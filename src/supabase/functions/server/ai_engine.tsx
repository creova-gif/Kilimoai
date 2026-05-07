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
import { createClient } from "npm:@supabase/supabase-js";
import { generateMasterPrompt } from "./ai_feature_prompts.tsx";
import { sendSMS } from "./sms.tsx";
import * as kv from "./kv_store.tsx";

const aiEngine = new Hono();

// Rate limit configuration
const DAILY_LIMIT = 20; // 20 requests per day for free tier

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

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
      user_id, // Pass user_id for RAG memory
    } = await c.req.json();

    // Rate limiting logic
    if (user_id) {
      const today = new Date().toISOString().split('T')[0];
      const kvKey = `rl:ai:${user_id}:${today}`;
      const count = (await kv.get(kvKey)) || 0;

      if (count >= DAILY_LIMIT) {
        return c.json({
          error: "RATE_LIMIT_EXCEEDED",
          message: language.toUpperCase() === "SW" 
            ? "Umekamilisha kikomo cha maswali ya kila siku. Tafadhali jaribu tena kesho."
            : "You have reached your daily AI query limit. Please try again tomorrow.",
          limit: DAILY_LIMIT
        }, 429);
      }
      
      // Increment count (asynchronously to not block response)
      kv.set(kvKey, count + 1).catch(err => console.error("KV error:", err));
    }

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

    // RAG: Retrieve memories if user_id is provided
    let memoryContext = "";
    if (user_id) {
      try {
        const memories = await retrieveMemories(user_id, query);
        if (memories && memories.length > 0) {
          memoryContext = "\n\nRELEVANT FARM HISTORY & PREVIOUS CONTEXT:\n" + 
            memories.map((m: any) => `- ${m.content}`).join("\n");
        }
      } catch (memError) {
        console.error("Memory retrieval error:", memError);
      }
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
    let systemPrompt = generateMasterPrompt({
      feature: mappedFeature,
      context: {
        ...context,
        language: language.toUpperCase(),
        user_role: role,
      },
      language: language.toUpperCase() as "EN" | "SW",
    });

    // Append memory context if available
    if (memoryContext) {
      systemPrompt += memoryContext;
    }

    // Call AI provider (OpenRouter with Claude)
    const aiResponse = await callAIProvider(systemPrompt, query, language);

    // Parse and structure response
    const structuredResponse = parseAIResponse(aiResponse, feature);

    // EXECUTE AGENTIC ACTIONS if present
    if (structuredResponse.agentic_actions && Array.isArray(structuredResponse.agentic_actions)) {
      for (const action of structuredResponse.agentic_actions) {
        try {
          await executeAgenticAction(user_id, action);
        } catch (actionError) {
          console.error("Action execution error:", actionError);
        }
      }
    }

    // Background: Save this interaction to memory if user_id is provided
    if (user_id && query) {
      saveMemory(user_id, query, aiResponse, mappedFeature).catch(err => 
        console.error("Memory saving error:", err)
      );
    }

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
 * Retrieve relevant memories for RAG
 */
async function retrieveMemories(userId: string, query: string) {
  // For now, use keyword matching as embedding generation might be complex in Edge functions 
  // without additional dependencies.
  // Ideally, we'd generate an embedding for 'query' and use RPC search_ai_memory.
  
  const { data, error } = await supabase
    .from('ai_memory')
    .select('content')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) throw error;
  return data;
}

/**
 * Save interaction to memory
 */
async function saveMemory(userId: string, query: string, response: string, feature: string) {
  const content = `User asked about ${feature}: "${query}". AI responded: "${response.substring(0, 200)}..."`;
  
  // We're skipping embedding for now or using a placeholder
  const { error } = await supabase
    .from('ai_memory')
    .insert({
      user_id: userId,
      content: content,
      metadata: { feature, timestamp: new Date().toISOString() }
      // embedding: ... (optionally call an embedding API here)
    });

  if (error) console.error("Error saving memory to Supabase:", error);
}

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

/**
 * Execute Agentic Action (SMS, Task, etc.)
 */
async function executeAgenticAction(userId: string | undefined, action: any) {
  console.log(`[AGENTIC ACTION] Executing ${action.type}:`, action.payload);

  switch (action.type) {
    case "send_sms":
      if (action.payload?.to && action.payload?.message) {
        await sendSMS({
          to: action.payload.to,
          message: action.payload.message,
        });
      }
      break;

    case "create_task":
      if (userId && action.payload?.title) {
        await supabase.from("tasks").insert({
          user_id: userId,
          title: action.payload.title,
          description: action.payload.description || action.justification,
          due_date: action.payload.due_date || new Date(Date.now() + 86400000).toISOString(),
          status: "pending",
          priority: action.payload.priority || "medium",
        });
      }
      break;

    case "post_listing":
      if (userId && action.payload?.title && action.payload?.price) {
        await supabase.from("marketplace_listings").insert({
          user_id: userId,
          title: action.payload.title,
          description: action.payload.description,
          price: action.payload.price,
          category: action.payload.category || "produce",
          status: "draft", // Draft mode as safety measure
        });
      }
      break;

    default:
      console.warn(`Unknown action type: ${action.type}`);
  }
}

export default aiEngine;