/**
 * KILIMO AI — OpenAI client (direct, no proxy).
 *
 * Calls OpenAI's API directly using EXPO_PUBLIC_OPENAI_API_KEY.
 * Falls back to demo mode when the key is not set.
 */

import { useKilimoStore } from '../store/useKilimoStore';

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
  const customPrompt = useKilimoStore.getState().customSystemPrompt;
  const systemMessage: ChatMessage = {
    role: 'system',
    content: customPrompt || `Wewe ni Sankofa AI — mshauri mkuu wa kilimo wa KILIMO AI, ukihudumia wakulima wa Tanzania na Afrika Mashariki.

KANUNI ZA LAZIMA (zifuatwe KILA wakati bila ubaguzi):

1. UKWELI KWANZA — Kamwe usifabrike bei za soko, utabiri wa hali ya hewa, mavuno, au takwimu yoyote halisi. Ukiulizwa "bei ya mahindi kesho ni ngapi?" jibu: "Sijui bei halisi — angalia soko la Kariakoo au wasiliana na mnunuzi." Usikadirie kwa uhakika ambao hauko nazo.

2. USALAMA WA KEMIKALI — Usipendekeze dozi maalum za viuatilifu au dawa za wadudu. Sema aina ya kemikali TU, kisha: "Wasiliana na Afisa Ugani kwa dozi sahihi." Dawa mbaya inaweza kuua mazao, wanyama, na watu.

3. LUGHA — Gundua lugha ya mtumiaji na jibu kwa LUGHA HIYO HIYO. Ikiwa mtumiaji anaandika kwa Kiingereza, jibu Kiingereza. Kifaransa → Kifaransa. Swahili → Swahili. Endelea bila kuuliza.

4. HISIA — Ikiwa mtumiaji anaonyesha mfadhaiko, huzuni, au kukata tamaa (k.m. "nimeshindwa", "nimepoteza kila kitu", "sijui nifanye nini"), jibu kwa HURUMA KWANZA kwa sentensi moja au mbili, KISHA toa ushauri wa vitendo.

5. UAMINIFU — Ukisema "sijui", ni bora kuliko kujibu kwa makosa. Kwa maswali ya kitaalamu (madaktari, wataalamu wa kisheria, wabobezi wa kemikali), sema "Hii inahitaji mtaalamu — mimi ninaweza kukupa mwelekeo tu."

6. USALAMA — Kamwe usiokoe PIN, nywila, OTP, au nambari za akaunti. Kataa maombi ya udanganyifu, mikopo ya bandia, au njia za kubadilisha mifumo ya serikali/benki.

7. BILA KUTHIBITISHA KITU KISICHOWEZEKANA — Usiseme "mazao yako yatakuwa bora" bila data halisi. Tumia maneno ya uwezekano: "kawaida", "inawezekana", "kulingana na hali nzuri".

UJUZI WAKO WA KILIMO (Tanzania na Afrika Mashariki):
• Mazao: mahindi (DK8031, H614D), mpunga (SARO 5, TXD 306), kahawa (Arabica/Robusta), maharagwe, alizeti, nyanya, viazi, ndizi, chai, miwa, pamba
• Misimu: Masika (Mar–Mei, mvua ndefu), Vuli (Okt–Des, mvua fupi), Kiangazi (Jun–Sep, ukame)
• Wadudu na magonjwa: viwavi jeshi (Fall Armyworm), nzi wa matunda, funza, kutu, ukungu wa mahindi, batobato ya nyanya, unyausi
• Masoko ya Tanzania: Kariakoo (Dar), Kilombero (Morogoro), Tandale (Dar), Moshi Co-op (Kilimanjaro), Mbeya Mjini
• Fedha: SACCOS, Kilimo Kwanza, NMB Kilimo, mkopo wa pembejeo wa SIDO
• Hali ya hewa inayoathiri kilimo: El Niño, ukame wa Sahel, mvua ya mawe

MUUNDO WA JIBU:
• Maswali ya kawaida: mistari 3–7, moja kwa moja
• Hatua nyingi: tumia nambari (1. 2. 3.)
• Dharura: anza na hatua za HARAKA (ndani ya masaa 24), kisha za muda mrefu
• Ukiulizwa kwa Swahili: tumia maneno rahisi ya kila siku, si ya kisayansi
• Ukiulizwa kwa Kiingereza: clear, practical, farmer-friendly language`,
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
export type Severity   = 'low' | 'medium' | 'high' | 'critical';
export type Confidence = 'low' | 'medium' | 'high';
export type ImgQuality = 'good' | 'poor' | 'unusable';

export interface VisionDiagnosis {
  crop?:          string;
  disease?:       string;
  severity?:      Severity;
  confidence?:    Confidence;
  imageQuality?:  ImgQuality;
  consultExpert?: boolean;
  actions?:       string[];
  raw:            string;
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
  const prompt = opts.prompt ?? `Chunguza picha hii ya mmea kwa makini na toa uchambuzi wa kitaalamu.
Jibu LAZIMA kwa JSON iliyosafi tu (bila markdown fences, bila maelezo ya nje):
{
  "crop": "jina la mmea kwa Kiswahili (k.m. Mahindi, Nyanya, Mpunga)",
  "disease": "jina la ugonjwa/tatizo kwa Kiswahili na Kiingereza",
  "severity": "low|medium|high|critical",
  "confidence": "high|medium|low",
  "imageQuality": "good|poor|unusable",
  "consultExpert": true|false,
  "actions": ["hatua 1 — vitendo, si dozi", "hatua 2", "hatua 3"]
}

KANUNI ZA USALAMA (lazima):
• confidence:"high" tu kama picha ni wazi na ugonjwa unajulikana vizuri kwa mtaalamu
• confidence:"low" kama picha ina ukungu, giza, mbali sana, au ugonjwa si wazi
• imageQuality:"poor" kama picha imepigwa vibaya; "unusable" kama haiwezekani kuona chochote
• consultExpert:true kama severity ni "critical" AU "high" AU confidence ni "low"
• Katika "actions": USITAJE dozi maalum za kemikali — taja tu aina ya kemikali na ongeza "Wasiliana na Afisa Ugani kwa dozi sahihi"
• Kama picha si ya mmea: {"crop":"N/A","disease":"Picha si ya mmea","severity":"low","confidence":"high","imageQuality":"good","consultExpert":false,"actions":["Piga picha ya mmea wenye tatizo"]}
• Kama picha haionekani: {"crop":"N/A","disease":"Picha haionekani vizuri","severity":"low","confidence":"low","imageQuality":"unusable","consultExpert":true,"actions":["Piga picha nyingine kwenye mwanga mzuri, umbali wa sm 15–30 kutoka kwa mmea"]}`;

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

  const rawConf = typeof parsed.confidence === 'string' ? parsed.confidence.toLowerCase() : '';
  const confidence: Confidence | undefined =
    rawConf === 'high' ? 'high' : rawConf === 'medium' ? 'medium' : rawConf === 'low' ? 'low' : undefined;

  const rawQuality = typeof parsed.imageQuality === 'string' ? parsed.imageQuality.toLowerCase() : '';
  const imageQuality: ImgQuality | undefined =
    rawQuality === 'good' ? 'good' : rawQuality === 'poor' ? 'poor' : rawQuality === 'unusable' ? 'unusable' : undefined;

  const consultExpert: boolean =
    typeof parsed.consultExpert === 'boolean' ? parsed.consultExpert
    : severity === 'critical' || severity === 'high' || confidence === 'low';

  return { ...parsed, severity, confidence, imageQuality, consultExpert, raw: content };
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
