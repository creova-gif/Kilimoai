/**
 * ============================================================================
 * KILIMO AGRI-AI SUITE - Unified AI Engine
 * ============================================================================
 * Single endpoint for ALL AI interactions
 * Role-aware, context-aware, language-consistent
 * Returns structured JSON responses
 * ============================================================================
 */

import { Hono } from "npm:hono";

const aiEngine = new Hono();

/**
 * POST /ai/engine
 * 
 * Universal AI endpoint for all features and roles
 */
aiEngine.post("/engine", async (c) => {
  try {
    const {
      role,
      feature,
      language = "en",
      context = {},
      query = "",
    } = await c.req.json();

    // Validate required fields
    if (!role || !feature) {
      return c.json(
        {
          error: "Missing required fields",
          message: "role and feature are required",
        },
        400
      );
    }

    // Generate role-specific system prompt
    const systemPrompt = generateSystemPrompt(role, feature, language, context);

    // Call AI provider (OpenAI, Claude, etc.)
    const aiResponse = await callAIProvider(systemPrompt, query, language);

    // Parse and structure response
    const structuredResponse = parseAIResponse(aiResponse, feature);

    return c.json({
      success: true,
      role,
      feature,
      language,
      response: structuredResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Engine Error:", error);
    return c.json(
      {
        error: "AI processing failed",
        message: error.message || "Unknown error",
      },
      500
    );
  }
});

/**
 * Generate role-specific, feature-specific system prompt
 */
function generateSystemPrompt(
  role: string,
  feature: string,
  language: string,
  context: any
): string {
  // Base system identity
  let prompt = language === "sw"
    ? "Wewe ni CREOVA Agri-AI, msaidizi wa kilimo wa akili bandia kwa wakulima wa Tanzania."
    : "You are CREOVA Agri-AI, an intelligent agricultural assistant for Tanzanian farmers.";

  // Add role-specific context
  prompt += `\n\nUser Role: ${role}`;
  prompt += `\nFeature: ${feature}`;
  prompt += `\nLanguage: ${language}`;

  // Add role-specific expertise
  prompt += `\n\n${getRoleExpertise(role, language)}`;

  // Add feature-specific instructions
  prompt += `\n\n${getFeatureInstructions(feature, language)}`;

  // Add user context
  if (Object.keys(context).length > 0) {
    prompt += `\n\nUser Context:`;
    if (context.farm_size) prompt += `\n- Farm size: ${context.farm_size} acres`;
    if (context.crop) prompt += `\n- Crop: ${context.crop}`;
    if (context.season) prompt += `\n- Season: ${context.season}`;
    if (context.region) prompt += `\n- Region: ${context.region}`;
  }

  // Add response format rules
  prompt += `\n\nRULES:`;
  prompt += `\n- Respond ONLY in ${language === "sw" ? "Swahili" : "English"}`;
  prompt += `\n- Keep advice relevant to ${role} role`;
  prompt += `\n- Use practical, local Tanzanian context`;
  prompt += `\n- Return response in JSON format`;
  prompt += `\n- No mixed languages`;

  // Add JSON structure
  prompt += `\n\nResponse Format:`;
  prompt += `\n{`;
  prompt += `\n  "recommendations": ["string array of actionable recommendations"],`;
  prompt += `\n  "alerts": ["string array of warnings or urgent notices"],`;
  prompt += `\n  "actions": ["string array of specific next steps"],`;
  prompt += `\n  "explanation": "detailed explanation as string"`;
  prompt += `\n}`;

  return prompt;
}

/**
 * Get role-specific expertise description
 */
function getRoleExpertise(role: string, language: string): string {
  const expertise: Record<string, { en: string; sw: string }> = {
    smallholder_farmer: {
      en: "EXPERTISE: You specialize in helping smallholder farmers (0-5 acres) with practical, low-cost solutions for subsistence and small-scale commercial farming.",
      sw: "UTAALAMU: Unafanya kazi na wakulima wadogo (ekari 0-5) na kutoa suluhisho za bei nafuu za kilimo cha kujikimu na biashara ndogo.",
    },
    farmer_manager: {
      en: "EXPERTISE: You help independent farmers (5+ acres) optimize productivity, diversify crops, and manage resources efficiently.",
      sw: "UTAALAMU: Unasaidia wakulima huru (ekari 5+) kuboresha uzalishaji, kutofautisha mazao, na kusimamia rasilimali kwa ufanisi.",
    },
    farm_manager: {
      en: "EXPERTISE: You provide strategic advice for farm managers overseeing multi-field operations, team coordination, and performance optimization.",
      sw: "UTAALAMU: Unatoa ushauri wa kimkakati kwa wasimamizi wa mashamba wanaosimamia shughuli za mashamba mengi, uratibu wa timu, na uboreshaji wa utendaji.",
    },
    commercial_farm_admin: {
      en: "EXPERTISE: You support enterprise-level agricultural operations with financial planning, export management, and business intelligence.",
      sw: "UTAALAMU: Unasaidia shughuli za kilimo za kiwango cha biashara na mipango ya kifedha, usimamizi wa usafirishaji, na akili ya biashara.",
    },
    agribusiness_ops: {
      en: "EXPERTISE: You assist agribusiness professionals with supply chain optimization, procurement strategies, and market intelligence.",
      sw: "UTAALAMU: Unasaidia wataalamu wa biashara za kilimo na uboreshaji wa mnyororo wa usambazaji, mikakati ya ununuzi, na habari za soko.",
    },
    extension_officer: {
      en: "EXPERTISE: You support extension officers with farmer training, impact assessment, and best practice dissemination.",
      sw: "UTAALAMU: Unasaidia maafisa wa ugani na mafunzo ya wakulima, tathmini ya athari, na usambazaji wa mbinu bora.",
    },
    cooperative_leader: {
      en: "EXPERTISE: You help cooperative leaders with group management, collective marketing, and member engagement strategies.",
      sw: "UTAALAMU: Unasaidia viongozi wa ushirika na usimamizi wa kikundi, masoko ya pamoja, na mikakati ya ushiriki wa wanachama.",
    },
  };

  const roleExpertise = expertise[role] || expertise.smallholder_farmer;
  return roleExpertise[language as "en" | "sw"];
}

/**
 * Get feature-specific instructions
 */
function getFeatureInstructions(feature: string, language: string): string {
  const instructions: Record<string, { en: string; sw: string }> = {
    crop_planning: {
      en: "FEATURE: CROP PLANNING - Provide practical crop selection, planting calendars, rotation strategies, and yield expectations.",
      sw: "KIPENGELE: MIPANGO YA MAZAO - Toa uteuzi wa mazao wa vitendo, kalenda ya kupanda, mikakati ya mzunguko, na matarajio ya mavuno.",
    },
    yield_forecast: {
      en: "FEATURE: YIELD FORECAST - Provide data-driven yield predictions based on crop type, farm conditions, and regional averages.",
      sw: "KIPENGELE: UTABIRI WA MAVUNO - Toa utabiri wa mavuno kulingana na data ya aina ya zao, hali ya shamba, na wastani wa mkoa.",
    },
    soil_health: {
      en: "FEATURE: SOIL HEALTH - Advise on soil testing, nutrient management, pH balance, and organic matter improvement.",
      sw: "KIPENGELE: AFYA YA UDONGO - Shauri kuhusu upimaji wa udongo, usimamizi wa virutubishi, usawa wa pH, na uboreshaji wa vitu vilivyooza.",
    },
    ai_chat: {
      en: "FEATURE: AI CHAT - Answer general agricultural questions with practical, context-specific advice.",
      sw: "KIPENGELE: AI CHAT - Jibu maswali ya jumla ya kilimo kwa ushauri wa vitendo, mahususi kwa muktadha.",
    },
    task_management: {
      en: "FEATURE: TASK MANAGEMENT - Help prioritize tasks, allocate resources, and optimize farm operations scheduling.",
      sw: "KIPENGELE: USIMAMIZI WA KAZI - Saidia kuweka vipaumbele vya kazi, kugawa rasilimali, na kuboresha ratiba ya shughuli za shamba.",
    },
    livestock_management: {
      en: "FEATURE: LIVESTOCK MANAGEMENT - Provide advice on animal health, feeding, breeding, and disease prevention.",
      sw: "KIPENGELE: USIMAMIZI WA MIFUGO - Toa ushauri kuhusu afya ya wanyama, kulisha, uzazi, na kuzuia magonjwa.",
    },
    market_prices: {
      en: "FEATURE: MARKET INTELLIGENCE - Analyze market trends, optimal selling times, and price forecasts.",
      sw: "KIPENGELE: HABARI ZA SOKO - Chambuza mwenendo wa soko, muda bora wa kuuza, na utabiri wa bei.",
    },
    weather: {
      en: "FEATURE: WEATHER ADVICE - Provide weather-informed recommendations for planting, irrigation, and crop protection.",
      sw: "KIPENGELE: USHAURI WA HALI YA HEWA - Toa mapendekezo yanayotegemea hali ya hewa kwa kupanda, umwagiliaji, na ulinzi wa mazao.",
    },
  };

  const featureInstr = instructions[feature] || instructions.ai_chat;
  return featureInstr[language as "en" | "sw"];
}

/**
 * Call AI provider (OpenAI, Claude, Gemini, etc.)
 */
async function callAIProvider(
  systemPrompt: string,
  query: string,
  language: string
): Promise<string> {
  const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }

  // Call OpenRouter API (supports multiple models)
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://kilimo.app",
      "X-Title": "KILIMO Agri-AI Suite",
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-sonnet", // or "openai/gpt-4", "google/gemini-pro"
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query || "Provide recommendations based on the context." },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("AI Provider Error:", error);
    throw new Error(`AI provider returned ${response.status}: ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

/**
 * Parse AI response and structure it
 */
function parseAIResponse(aiResponse: string, feature: string): any {
  try {
    // Try to parse as JSON
    const parsed = JSON.parse(aiResponse);
    return parsed;
  } catch (error) {
    // If not JSON, structure the text response
    return {
      recommendations: [aiResponse],
      alerts: [],
      actions: [],
      explanation: aiResponse,
    };
  }
}

export default aiEngine;
