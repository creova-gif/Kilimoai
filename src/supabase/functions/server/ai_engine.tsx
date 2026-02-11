/**
 * ============================================================================
 * KILIMO AGRI-AI SUITE - Unified AI Engine
 * ============================================================================
 * Single endpoint for ALL AI interactions
 * Role-aware, context-aware, language-consistent
 * Returns structured JSON responses
 * Philosophy: "AI must feel helpful, not loud"
 * ============================================================================
 */

import { Hono } from "npm:hono";
import { generateMasterPrompt } from "./ai_feature_prompts.tsx";

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
      language = "EN",
      context = {},
      query = "",
    } = await c.req.json();

    // Validate required fields
    if (!feature) {
      return c.json(
        {
          error: "Missing required field",
          message: "feature is required",
        },
        400
      );
    }

    // Map legacy feature names to new system
    const featureMap: { [key: string]: string } = {
      crop_planning: "crop_planning",
      yield_forecast: "yield_revenue",
      soil_health: "crop_intelligence",
      ai_chat: "unified_advisor",
      task_management: "crop_planning",
      livestock_management: "livestock",
      market_prices: "marketplace",
      weather: "weather_advice",
    };

    const mappedFeature = featureMap[feature] || feature;

    // Generate feature-specific prompt using the master system
    const systemPrompt = generateMasterPrompt({
      feature: mappedFeature,
      context: {
        ...context,
        language: language.toUpperCase(),
        user_role: role,
      },
      language: language.toUpperCase() as "EN" | "SW",
    });

    // Call AI provider (OpenRouter with Claude)
    const aiResponse = await callAIProvider(systemPrompt, query, language);

    // Parse and structure response
    const structuredResponse = parseAIResponse(aiResponse, feature);

    return c.json({
      success: true,
      role,
      feature: mappedFeature,
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
 * Call AI provider (OpenRouter with Claude)
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