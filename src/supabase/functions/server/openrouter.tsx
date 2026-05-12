/**
 * OpenRouter AI Integration Module for KILIMO AgriTech Platform
 * Supports multiple AI models via OpenRouter API
 */

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") || "";

if (!OPENROUTER_API_KEY) {
  console.warn("⚠️  OPENROUTER_API_KEY not set - AI features will use fallback responses");
}

/**
 * OpenRouter API types
 */
interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string | any[];
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface OpenRouterResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * AI Model configurations
 */
export const AI_MODELS = {
  // Premium models (high accuracy, higher cost)
  PREMIUM: {
    GPT4: "openai/gpt-4-turbo-preview",
    GPT4_VISION: "openai/gpt-4-vision-preview",
    CLAUDE35: "anthropic/claude-3.5-sonnet",
  },
  
  // Balanced models (good accuracy, moderate cost)
  BALANCED: {
    GPT35_TURBO: "openai/gpt-3.5-turbo",
    CLAUDE3: "anthropic/claude-3-haiku",
  },
  
  // Fast models (quick responses, low cost)
  FAST: {
    GPT35: "openai/gpt-3.5-turbo",
    LLAMA3: "meta-llama/llama-3-8b-instruct",
    MISTRAL: "mistralai/mistral-7b-instruct",
  },
  
  // Recommended for agricultural AI (Swahili support)
  DEFAULT: "openai/gpt-4-turbo-preview",
};

/**
 * System prompts for Sankofa AI
 */
export const SANKOFA_SYSTEM_PROMPT = {
  en: `You are Sankofa AI, an expert agricultural advisor for smallholder farmers in Tanzania and East Africa. 

Your expertise includes:
- Crop cultivation (maize, rice, cassava, beans, vegetables)
- Pest and disease management
- Soil health and fertilization
- Weather-based farming advice
- Sustainable farming practices
- Market prices and selling strategies

Guidelines:
- Provide practical, actionable advice
- Consider local Tanzanian farming conditions
- Use simple language that farmers can understand
- Give specific recommendations (quantities, timing, methods)
- Be culturally sensitive and respectful
- Prioritize low-cost, accessible solutions

Always be helpful, accurate, and farmer-focused.`,

  sw: `Wewe ni Sankofa AI, mshauri mkuu wa kilimo kwa wakulima wadogo wadogo nchini Tanzania na Afrika Mashariki.

Ujuzi wako ni pamoja na:
- Kilimo cha mazao (mahindi, mchele, mihogo, maharagwe, mboga)
- Udhibiti wa wadudu na magonjwa
- Afya ya udongo na mbolea
- Ushauri wa kilimo kulingana na hali ya hewa
- Mbinu endelevu za kilimo
- Bei za soko na mikakati ya kuuza

Miongozo:
- Toa ushauri wa vitendo unaotumiwa
- Zingatia hali za kilimo za Tanzania
- Tumia lugha rahisi ambayo wakulima wanaweza kuelewa
- Toa mapendekezo maalum (kiasi, muda, njia)
- Kuwa na heshima za kitamaduni
- Weka kipaumbele kwenye suluhisho za gharama nafuu na zinazopatikana

Kuwa msaidizi, sahihi, na kuzingatia mahitaji ya wakulima.`,
};

/**
 * Get model recommendations based on query complexity
 */
export function getRecommendedModel(query: string): string {
  const queryLength = query.length;
  const complexKeywords = ["disease", "pest", "gonjwa", "wadudu", "analyze", "changanua"];
  const isComplex = complexKeywords.some((keyword) => 
    query.toLowerCase().includes(keyword)
  );

  if (isComplex || queryLength > 200) {
    return AI_MODELS.PREMIUM.GPT4; // Complex query → premium model
  } else if (queryLength > 50) {
    return AI_MODELS.BALANCED.GPT35_TURBO; // Medium query → balanced model
  } else {
    return AI_MODELS.FAST.GPT35; // Simple query → fast model
  }
}

/**
 * Query AI with vision support (for image analysis)
 */
export async function queryAIWithVision(
  systemPrompt: string,
  imageData: string,
  model: string = "openai/gpt-4-turbo",
  maxTokens: number = 1500,
  temperature: number = 0.5
): Promise<string> {
  // If no API key, throw immediately
  if (!OPENROUTER_API_KEY) {
    console.warn("OpenRouter API key not configured - vision unavailable");
    throw new Error("AI_SERVICE_UNAVAILABLE");
  }

  try {
    // Ensure image is in base64 format
    const imageUrl = imageData.startsWith("data:") ? imageData : `data:image/jpeg;base64,${imageData}`;

    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please analyze this crop image and provide a detailed diagnosis."
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl
            }
          }
        ]
      }
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://kilimo.tz",
        "X-Title": "KILIMO Agri-AI Suite",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      
      // Handle specific error codes BEFORE logging
      if (response.status === 402) {
        console.log("OpenRouter Vision 402: Insufficient credits - using fallback");
        throw new Error("AI_INSUFFICIENT_CREDITS");
      }
      
      // Only log errors for non-402 cases
      console.error("OpenRouter Vision API error:", errorData);
      throw new Error(`AI_VISION_ERROR_${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      throw new Error("AI_NO_RESPONSE");
    }
  } catch (error) {
    console.error("OpenRouter Vision API exception:", error);
    throw error;
  }
}

/**
 * Simpler query AI function (text-only)
 */
export async function queryAI(
  systemPrompt: string,
  userMessage: string,
  model: string = "openai/gpt-4-turbo-preview",
  maxTokens: number = 1000,
  temperature: number = 0.7
): Promise<string> {
  // If no API key, return fallback immediately
  if (!OPENROUTER_API_KEY) {
    console.warn("OpenRouter API key not configured - using fallback response");
    throw new Error("AI_SERVICE_UNAVAILABLE");
  }

  try {
    const messages: OpenRouterMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://kilimo.tz",
        "X-Title": "KILIMO Agri-AI Suite",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      } as OpenRouterRequest),
    });

    if (!response.ok) {
      const errorData = await response.text();
      
      // Handle specific error codes BEFORE logging
      if (response.status === 402) {
        console.log("OpenRouter 402: Insufficient credits - using fallback");
        throw new Error("AI_INSUFFICIENT_CREDITS");
      }
      
      // Only log errors for non-402 cases
      console.error("OpenRouter API error:", errorData);
      throw new Error(`AI_SERVICE_ERROR_${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      throw new Error("AI_NO_RESPONSE");
    }
  } catch (error) {
    // Don't log here - already logged above
    throw error;
  }
}

/**
 * General-purpose AI call function with structured options
 */
export async function callOpenRouterAI(
  messages: Array<{ role: string; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    language?: string;
  } = {}
): Promise<{ success: boolean; message: string; error?: string }> {
  // If no API key, return error immediately
  if (!OPENROUTER_API_KEY) {
    console.warn("OpenRouter API key not configured - returning error");
    return {
      success: false,
      message: "",
      error: "AI_SERVICE_UNAVAILABLE"
    };
  }

  try {
    const model = options.model || AI_MODELS.PREMIUM.GPT4;
    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.maxTokens || 2000;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://kilimo.tz",
        "X-Title": "KILIMO Agri-AI Suite",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      
      // Handle specific error codes BEFORE logging
      if (response.status === 402) {
        console.warn("OpenRouter 402: Insufficient credits - returning error");
        return {
          success: false,
          message: "",
          error: "AI_INSUFFICIENT_CREDITS"
        };
      }
      
      // Only log errors for non-402 cases
      console.error("OpenRouter API error:", errorData);
      return {
        success: false,
        message: "",
        error: `AI_SERVICE_ERROR_${response.status}`
      };
    }

    const data: OpenRouterResponse = await response.json();

    if (data.choices && data.choices.length > 0) {
      return {
        success: true,
        message: data.choices[0].message.content
      };
    } else {
      return {
        success: false,
        message: "",
        error: "AI_NO_RESPONSE"
      };
    }
  } catch (error) {
    console.error("OpenRouter API exception:", error);
    return {
      success: false,
      message: "",
      error: String(error)
    };
  }
}

/**
 * Get Sankofa AI advice with conversation history support
 */
export async function getSankofaAIAdvice(
  question: string,
  language: "en" | "sw" = "en",
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const systemPrompt = SANKOFA_SYSTEM_PROMPT[language];
    const model = getRecommendedModel(question);

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: question }
    ];

    return await callOpenRouterAI(messages, {
      model,
      temperature: 0.7,
      maxTokens: 1000,
      language
    });
  } catch (error) {
    console.error("Sankofa AI error:", error);
    return {
      success: false,
      message: "",
      error: String(error)
    };
  }
}

/**
 * Analyze crop image with AI
 */
export async function analyzeCropImage(
  imageUrl: string,
  userQuery: string,
  language: "en" | "sw" = "en"
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const systemPrompt = language === "sw" 
      ? "Wewe ni mtaalamu wa kilimo. Changanua picha ya mazao na utoe ushauri wa kitaalamu."
      : "You are an agricultural expert. Analyze the crop image and provide expert advice.";

    const response = await queryAIWithVision(
      systemPrompt,
      imageUrl,
      AI_MODELS.PREMIUM.GPT4_VISION,
      1500,
      0.5
    );

    return {
      success: true,
      message: response
    };
  } catch (error) {
    console.error("Crop image analysis error:", error);
    return {
      success: false,
      message: "",
      error: String(error)
    };
  }
}