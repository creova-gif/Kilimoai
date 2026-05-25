/**
 * KILIMO AI — OpenAI client (direct, no proxy).
 *
 * Calls OpenAI's API directly using EXPO_PUBLIC_OPENAI_API_KEY.
 * Falls back to demo mode when the key is not set.
 */

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';
const OPENAI_BASE = 'https://api.openai.com/v1';

export class AIError extends Error {
  constructor(message: string, public kind: 'not_configured' | 'unauthorized' | 'network' | 'server' | 'validation') {
    super(message);
  }
}

export function aiConfigured(): boolean {
  return OPENAI_API_KEY.length > 0;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function openaiPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  if (!aiConfigured()) throw new AIError('OpenAI API key not configured', 'not_configured');

  let res: Response;
  try {
    res = await fetch(`${OPENAI_BASE}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    });
  } catch (e: any) {
    throw new AIError(e?.message ?? 'Network error', 'network');
  }

  if (res.status === 401 || res.status === 403) {
    throw new AIError('OpenAI API key is invalid or unauthorized.', 'unauthorized');
  }

  const text = await res.text();
  if (!res.ok) {
    throw new AIError(`OpenAI ${res.status}: ${text.slice(0, 300)}`, 'server');
  }
  return JSON.parse(text) as T;
}

/** T201 — Sankofa text chat (GPT-4o-mini for speed + cost). */
export async function chat(messages: ChatMessage[]): Promise<string> {
  const systemMessage: ChatMessage = {
    role: 'system',
    content: `Wewe ni Sankofa AI, mshauri wa kilimo wa KILIMO AI kwa wakulima wa Tanzania. 
Jibu kwa Kiswahili fasaha na rahisi kuelewa. 
Toa ushauri wa vitendo kuhusu mazao, wadudu, udongo, bei za soko, na mipango ya shamba.
Tumia data ya mazingira ya Tanzania: mazao ya mahindi, mpunga, kahawa, maharage, alizeti.
Jibu kwa ufupi lakini kamili — mistari 3 hadi 8.`,
  };

  const fullMessages = [systemMessage, ...messages];

  const data = await openaiPost<{ choices: { message: { content: string } }[] }>('/chat/completions', {
    model: 'gpt-4o-mini',
    messages: fullMessages,
    max_tokens: 500,
    temperature: 0.7,
  });

  return data.choices[0]?.message?.content ?? '';
}

/** T202 — Crop photo diagnosis via GPT-4o Vision. */
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export interface VisionDiagnosis {
  crop?: string;
  disease?: string;
  severity?: Severity;
  actions?: string[];
  raw: string;
}

/** Normalize free-form severity strings from the model into our enum. */
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
  opts: { mimeType?: string; prompt?: string } = {},
): Promise<VisionDiagnosis> {
  const mimeType = opts.mimeType ?? 'image/jpeg';
  const prompt = opts.prompt ?? `Chunguza picha hii ya mmea na utambue magonjwa au wadudu.
Jibu LAZIMA kwa JSON iliyosafi (bila markdown fences) kama hii:
{
  "crop": "jina la mmea kwa Kiswahili",
  "disease": "jina la ugonjwa/wadudu kwa Kiswahili na Kiingereza",
  "severity": "low|medium|high|critical",
  "actions": ["hatua 1", "hatua 2", "hatua 3"]
}
Kama picha si ya mmea/mazao, weka disease: "Picha si ya mmea" na severity: "low".`;

  const data = await openaiPost<{ choices: { message: { content: string } }[] }>('/chat/completions', {
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${imageBase64}`, detail: 'high' },
          },
          { type: 'text', text: prompt },
        ],
      },
    ],
    max_tokens: 600,
    temperature: 0.2,
  });

  const content = data.choices[0]?.message?.content ?? '';

  let parsed: Partial<VisionDiagnosis> = {};
  try {
    const cleaned = content.replace(/```json\s*|\s*```/g, '').trim();
    const first = cleaned.indexOf('{');
    const last = cleaned.lastIndexOf('}');
    if (first >= 0 && last > first) parsed = JSON.parse(cleaned.slice(first, last + 1));
  } catch {
    // leave parsed empty; raw is always returned
  }

  const severity = normalizeSeverity(parsed.severity);
  return { ...parsed, severity, raw: content };
}

/** T203 — Swahili STT via Whisper. */
export async function transcribeAudio(
  audioBase64: string,
  opts: { mimeType?: string; language?: string } = {},
): Promise<string> {
  if (!aiConfigured()) throw new AIError('OpenAI API key not configured', 'not_configured');

  const mimeType = opts.mimeType ?? 'audio/m4a';
  const language = opts.language ?? 'sw';

  const ext = mimeType.split('/')[1]?.split(';')[0] ?? 'm4a';
  const byteChars = atob(audioBase64);
  const byteArray = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteArray[i] = byteChars.charCodeAt(i);
  const blob = new Blob([byteArray], { type: mimeType });

  const form = new FormData();
  form.append('file', blob, `audio.${ext}`);
  form.append('model', 'whisper-1');
  form.append('language', language);

  let res: Response;
  try {
    res = await fetch(`${OPENAI_BASE}/audio/transcriptions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: form,
    });
  } catch (e: any) {
    throw new AIError(e?.message ?? 'Network error', 'network');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new AIError(`Whisper ${res.status}: ${text.slice(0, 200)}`, 'server');
  }

  const data = await res.json() as { text: string };
  return data.text ?? '';
}
