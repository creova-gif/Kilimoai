/**
 * KILIMO AI — Gemini Client
 *
 * Calls Google Gemini's API directly using EXPO_PUBLIC_GEMINI_API_KEY.
 * Falls back to demo mode when the key is not set.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { useKilimoStore } from '../store/useKilimoStore';
import { supabase } from './supabase';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export class AIError extends Error {
  constructor(
    message: string,
    public kind: 'not_configured' | 'unauthorized' | 'network' | 'server' | 'validation'
  ) {
    super(message);
  }
}

export function aiConfigured(): boolean {
  return GEMINI_API_KEY.length > 0;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** T201 — Sankofa text chat (gemini-1.5-flash for speed + cost). */
export async function chat(messages: ChatMessage[]): Promise<string> {
  if (!aiConfigured()) throw new AIError('Gemini API key not configured', 'not_configured');

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const customPrompt = useKilimoStore.getState().customSystemPrompt;
  const systemText =
    customPrompt ||
    `Wewe ni Sankofa AI — mshauri mkuu wa kilimo wa KILIMO AI, ukihudumia wakulima wa Tanzania na Afrika Mashariki...
KANUNI ZA LAZIMA: 
1. UKWELI KWANZA 
2. USALAMA WA KEMIKALI 
3. LUGHA — Jibu kwa lugha ya mtumiaji
4. HISIA — Onyesha huruma`;

  const lastMessageContent = messages[messages.length - 1].content;

  // RAG Context Fetching
  let ragContextText = '';
  if (OPENAI_API_KEY && supabase) {
    try {
      const res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({ input: lastMessageContent, model: 'text-embedding-3-small' }),
      });
      if (res.ok) {
        const data = await res.json();
        const embedding = data.data[0].embedding;
        const { data: docs } = await supabase.rpc('match_knowledge', {
          query_embedding: embedding,
          match_threshold: 0.7,
          match_count: 3,
        });
        if (docs && docs.length > 0) {
          const docStr = docs.map((d: any) => `[${d.title}]: ${d.content}`).join('\n\n');
          ragContextText = `\n\nTAARIFA MUHIMU KUTOKA KWENYE KANZI DATA YETU KUSAIDIA KUJIBU:\n${docStr}`;
        }
      }
    } catch (e) {
      console.log('RAG fetch failed or skipped', e);
    }
  }

  const formattedHistory = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  try {
    const chatSession = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemText }] },
        { role: 'model', parts: [{ text: 'Understood. I am Sankofa AI.' }] },
        ...formattedHistory.slice(0, -1),
      ],
    });

    const finalQuery = lastMessageContent + ragContextText;
    const result = await chatSession.sendMessage(finalQuery);
    return result.response.text();
  } catch (error: any) {
    throw new AIError(error?.message ?? 'Gemini Chat Error', 'server');
  }
}

export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Confidence = 'low' | 'medium' | 'high';
export type ImgQuality = 'good' | 'poor' | 'unusable';

export interface VisionDiagnosis {
  crop?: string;
  disease?: string;
  severity?: Severity;
  confidence?: Confidence;
  imageQuality?: ImgQuality;
  consultExpert?: boolean;
  actions?: string[];
  raw: string;
}

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
  opts: { mimeType?: string; prompt?: string } = {}
): Promise<VisionDiagnosis> {
  if (!aiConfigured()) throw new AIError('Gemini API key not configured', 'not_configured');

  const mimeType = opts.mimeType ?? 'image/jpeg';
  const prompt =
    opts.prompt ??
    `Chunguza picha hii ya mmea kwa makini na toa uchambuzi wa kitaalamu.
Jibu LAZIMA kwa JSON iliyosafi tu:
{
  "crop": "jina la mmea kwa Kiswahili",
  "disease": "jina la ugonjwa/tatizo",
  "severity": "low|medium|high|critical",
  "confidence": "high|medium|low",
  "imageQuality": "good|poor|unusable",
  "consultExpert": true|false,
  "actions": ["hatua 1", "hatua 2"]
}
HAKIKISHA JSON YAKO NI SAHIHI.`;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
    ]);

    const content = result.response.text();

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
    const rawConf = typeof parsed.confidence === 'string' ? parsed.confidence.toLowerCase() : '';
    const confidence: Confidence | undefined =
      rawConf === 'high'
        ? 'high'
        : rawConf === 'medium'
          ? 'medium'
          : rawConf === 'low'
            ? 'low'
            : undefined;

    const rawQuality =
      typeof parsed.imageQuality === 'string' ? parsed.imageQuality.toLowerCase() : '';
    const imageQuality: ImgQuality | undefined =
      rawQuality === 'good'
        ? 'good'
        : rawQuality === 'poor'
          ? 'poor'
          : rawQuality === 'unusable'
            ? 'unusable'
            : undefined;

    const consultExpert: boolean =
      typeof parsed.consultExpert === 'boolean'
        ? parsed.consultExpert
        : severity === 'critical' || severity === 'high' || confidence === 'low';

    return { ...parsed, severity, confidence, imageQuality, consultExpert, raw: content };
  } catch (err: any) {
    throw new AIError(err?.message ?? 'Vision Error', 'server');
  }
}

// Fallback stub for audio since Gemini doesn't have a direct equivalent to Whisper form upload out of the box in this snippet
export async function transcribeAudio(
  audioBase64: string,
  opts: { mimeType?: string; language?: string } = {}
): Promise<string> {
  return 'Audio transcription is currently handled server-side.';
}
