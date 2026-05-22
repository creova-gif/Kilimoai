/**
 * KILIMO AI — Client SDK for the openai-proxy edge function.
 *
 * Never call OpenAI directly from the app; all requests go through the
 * Supabase edge function which holds the API key. JWT auth is enforced
 * server-side, so the user must be signed in.
 */

import { getAccessToken } from './supabase';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export class AIError extends Error {
  constructor(message: string, public kind: 'not_configured' | 'unauthorized' | 'network' | 'server' | 'validation') {
    super(message);
  }
}

export function aiConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface InvokeOptions {
  /** Supabase JWT for the signed-in user. If omitted, uses the anon key
   *  (which will fail JWT verification — caller should always pass a token
   *  obtained from supabase.auth.getSession()). */
  accessToken?: string;
}

async function invoke<T>(action: string, payload: Record<string, unknown>, opts: InvokeOptions = {}): Promise<T> {
  if (!aiConfigured()) throw new AIError('Supabase not configured', 'not_configured');

  // Auto-resolve the user's JWT from the shared Supabase session if the caller
  // didn't pass one explicitly. Falls back to anon key (which the edge function
  // will reject when verify_jwt is true) so the failure mode is clear.
  const token = opts.accessToken ?? (await getAccessToken()) ?? SUPABASE_ANON_KEY;
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/functions/v1/openai-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ action, ...payload }),
    });
  } catch (e: any) {
    throw new AIError(e?.message ?? 'network error', 'network');
  }

  if (res.status === 401 || res.status === 403) {
    throw new AIError('Unauthorized — please sign in again', 'unauthorized');
  }
  const text = await res.text();
  if (!res.ok) {
    throw new AIError(`Edge function ${res.status}: ${text.slice(0, 300)}`, 'server');
  }
  return JSON.parse(text) as T;
}

/** T201 — Sankofa text chat. */
export async function chat(messages: ChatMessage[], opts?: InvokeOptions): Promise<string> {
  const { content } = await invoke<{ content: string }>('chat', { messages }, opts);
  return content;
}

/** T202 — Crop photo diagnosis. Returns model JSON parsed into a typed result
 *  when possible; falls back to raw content for the UI to display. */
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export interface VisionDiagnosis {
  crop?: string;
  disease?: string;
  severity?: Severity;
  actions?: string[];
  raw: string;
}

/** Normalize free-form severity strings from the model into our enum.
 *  Handles capitalization, Swahili synonyms, and obvious variants so critical
 *  side effects can't be silently skipped by formatting drift. */
export function normalizeSeverity(input: unknown): Severity | undefined {
  if (typeof input !== 'string') return undefined;
  const v = input.trim().toLowerCase();
  if (!v) return undefined;
  if (/(crit|hatari kubwa|dharura|severe|urgent)/.test(v)) return 'critical';
  if (/(high|kubwa|kali)/.test(v)) return 'high';
  if (/(med|wastani|kadiri|moderate)/.test(v)) return 'medium';
  if (/(low|ndogo|hafifu|mild|minor)/.test(v)) return 'low';
  return undefined;
}
export async function diagnoseCropPhoto(
  imageBase64: string,
  opts: InvokeOptions & { mimeType?: string; prompt?: string } = {},
): Promise<VisionDiagnosis> {
  const { content } = await invoke<{ content: string }>('vision', {
    imageBase64,
    mimeType: opts.mimeType,
    prompt: opts.prompt,
  }, opts);

  // The model may wrap JSON in ```json fences; strip and parse defensively.
  let parsed: Partial<VisionDiagnosis> = {};
  try {
    const cleaned = content.replace(/```json\s*|\s*```/g, '').trim();
    const first = cleaned.indexOf('{');
    const last = cleaned.lastIndexOf('}');
    if (first >= 0 && last > first) parsed = JSON.parse(cleaned.slice(first, last + 1));
  } catch {
    // leave parsed empty; raw is always returned
  }

  // Normalize severity so downstream automation (critical-task auto-creation)
  // is not defeated by model formatting drift like "Critical" or Swahili words.
  const severity = normalizeSeverity(parsed.severity);
  return { ...parsed, severity, raw: content };
}

/** T203 — Swahili STT via Whisper. */
export async function transcribeAudio(
  audioBase64: string,
  opts: InvokeOptions & { mimeType?: string; language?: string } = {},
): Promise<string> {
  const { text } = await invoke<{ text: string }>('transcribe', {
    audioBase64,
    mimeType: opts.mimeType ?? 'audio/m4a',
    language: opts.language ?? 'sw',
  }, opts);
  return text;
}
