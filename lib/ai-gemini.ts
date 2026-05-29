import { GoogleGenerativeAI } from '@google/generative-ai';
import { useKilimoStore } from '../store/useKilimoStore';
import { ChatMessage, VisionDiagnosis, Severity, Confidence, ImgQuality, normalizeSeverity, AIError } from './ai';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export function aiConfigured(): boolean {
  return GEMINI_API_KEY.length > 0;
}

export async function chat(messages: ChatMessage[]): Promise<string> {
  if (!aiConfigured()) throw new AIError('Gemini API key not configured', 'not_configured');

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Gemini expects history in { role: "user" | "model", parts: [{ text: "..." }] } format
  const customPrompt = useKilimoStore.getState().customSystemPrompt;
  const systemText = customPrompt || `Wewe ni Sankofa AI — mshauri mkuu wa kilimo wa KILIMO AI, ukihudumia wakulima wa Tanzania na Afrika Mashariki...`;

  const formattedHistory = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  try {
    const chatSession = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemText }] },
        { role: 'model', parts: [{ text: 'Understood. I will act as Sankofa AI.' }] },
        ...formattedHistory.slice(0, -1) // All but last message
      ],
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chatSession.sendMessage(lastMessage);
    return result.response.text();
  } catch (error: any) {
    throw new AIError(error?.message ?? 'Gemini Chat Error', 'server');
  }
}

export async function diagnoseCropPhoto(
  imageBase64: string,
  opts: { mimeType?: string; prompt?: string } = {},
): Promise<VisionDiagnosis> {
  if (!aiConfigured()) throw new AIError('Gemini API key not configured', 'not_configured');

  const mimeType = opts.mimeType ?? 'image/jpeg';
  const prompt = opts.prompt ?? `Chunguza picha hii ya mmea kwa makini na toa uchambuzi wa kitaalamu... (Ensure JSON output only)`;

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      }
    ]);

    const content = result.response.text();
    let parsed: Partial<VisionDiagnosis> = {};
    try {
      const cleaned = content.replace(/```json\s*|\s*```/g, '').trim();
      const first = cleaned.indexOf('{');
      const last = cleaned.lastIndexOf('}');
      if (first >= 0 && last > first) parsed = JSON.parse(cleaned.slice(first, last + 1));
    } catch {
      // ignore
    }

    const severity = normalizeSeverity(parsed.severity);
    const confidence = (parsed.confidence?.toLowerCase() as Confidence) ?? undefined;
    const imageQuality = (parsed.imageQuality?.toLowerCase() as ImgQuality) ?? undefined;
    const consultExpert = typeof parsed.consultExpert === 'boolean' ? parsed.consultExpert : true;

    return { ...parsed, severity, confidence, imageQuality, consultExpert, raw: content };
  } catch (error: any) {
    throw new AIError(error?.message ?? 'Gemini Vision Error', 'server');
  }
}
