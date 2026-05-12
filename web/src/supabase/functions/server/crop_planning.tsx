/**
 * CROP PLANNING & MANAGEMENT AI SYSTEM
 * Enterprise-grade crop planning with AI recommendations
 */

import type { Context } from "npm:hono";
import * as kv from "./kv_store.tsx";
import * as openrouter from "./openrouter.tsx";

// Generate AI-powered crop plan
export async function generateCropPlan(c: Context) {
  try {
    const { userId, crop, season, location, field_size_ha, soil_data } = await c.req.json();

    if (!userId || !crop || !season) {
      return c.json({ error: "userId, crop, and season are required" }, 400);
    }

    const systemPrompt = `You are an AgriTech Decision Support AI for Tanzania and East Africa. Your role is to assist with crop planning, soil health optimization, yield forecasting, and revenue estimation. Always consider local Tanzanian climate seasons (Masika, Vuli). Use agronomic best practices suitable for smallholder to commercial-scale farms. Outputs must be practical, conservative, and data-driven. Support bilingual output: English and Swahili. Always return structured JSON. If data is missing, infer cautiously and label assumptions clearly.`;

    const userPrompt = `Create an optimized crop plan for:
Crop: ${crop}
Season: ${season}
Location: ${location || "Central Tanzania"}
Field Size: ${field_size_ha || 1} hectares
Soil Data: ${JSON.stringify(soil_data || {})}

Analyze soil data, season, and location. Recommend:
- Seed variety (specific to Tanzania)
- Soil amendments (with rates in kg/ha or t/ha)
- Planting window (dates)
- Fertilization schedule
- Expected yield range (kg/ha)
- Risk factors
- Cost estimates

Respond in English and Swahili. Return structured JSON with this exact format:
{
  "recommendations": {
    "seed_variety": "",
    "planting_window": "",
    "soil_amendments": [{"type": "", "rate": "", "cost_tzs": 0}],
    "fertilization_schedule": [{"stage": "", "product": "", "rate": "", "timing": ""}]
  },
  "forecast": {
    "yield_kg_per_ha": {"min": 0, "expected": 0, "max": 0},
    "confidence": "low|medium|high"
  },
  "risks": [""],
  "estimated_costs": {"seeds": 0, "fertilizer": 0, "labor": 0, "total": 0},
  "summary": {"en": "", "sw": ""}
}`;

    const aiResponse = await openrouter.queryAI(
      systemPrompt,
      userPrompt,
      "openai/gpt-3.5-turbo",
      1200,
      0.7
    );

    let plan;
    try {
      let cleaned = aiResponse.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
      plan = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse AI crop plan:", parseError);
      // Fallback plan
      plan = {
        recommendations: {
          seed_variety: `Hybrid ${crop} (local variety)`,
          planting_window: "March 15-30",
          soil_amendments: [{ type: "DAP", rate: "50kg/ha", cost_tzs: 75000 }],
          fertilization_schedule: [{ stage: "Planting", product: "DAP", rate: "50kg/ha", timing: "Day 0" }]
        },
        forecast: { yield_kg_per_ha: { min: 3000, expected: 4000, max: 5000 }, confidence: "medium" },
        risks: ["Weather variability"],
        estimated_costs: { seeds: 50000, fertilizer: 75000, labor: 100000, total: 225000 },
        summary: { en: "Standard crop plan generated", sw: "Mpango wa kawaida umetengenezwa" }
      };
    }

    // Store the plan
    const planId = crypto.randomUUID();
    await kv.set(`crop-plan:${userId}:${planId}`, {
      id: planId,
      userId,
      crop,
      season,
      location: location || "Central Tanzania",
      field_size_ha: field_size_ha || 1,
      soil_data: soil_data || {},
      ai_plan: plan,
      status: "planned",
      createdAt: new Date().toISOString()
    });

    return c.json({ success: true, planId, plan });

  } catch (error) {
    console.error("Crop plan generation error:", error);
    return c.json({ 
      success: false, 
      error: "Failed to generate crop plan",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
}

// Get all crop plans for user
export async function listCropPlans(c: Context) {
  try {
    const userId = c.req.header("X-User-Id");

    if (!userId) {
      return c.json({ error: "User ID required" }, 401);
    }

    const plans = await kv.getByPrefix(`crop-plan:${userId}:`) || [];
    
    return c.json({ success: true, plans, count: plans.length });
  } catch (error) {
    console.error("List crop plans error:", error);
    return c.json({ error: "Failed to list crop plans" }, 500);
  }
}

// AI Historical Performance Analysis
export async function analyzeHistory(c: Context) {
  try {
    const { userId, planId } = await c.req.json();

    if (!userId || !planId) {
      return c.json({ error: "userId and planId required" }, 400);
    }

    const currentPlan = await kv.get(`crop-plan:${userId}:${planId}`);
    const allPlans = await kv.getByPrefix(`crop-plan:${userId}:`) || [];
    const historicalPlans = allPlans.filter((p: any) => 
      p.crop === currentPlan.crop && p.id !== planId && p.status === "completed"
    );

    const systemPrompt = `You are an AgriTech AI analyzing historical crop performance. Compare crop plans to identify patterns, successes, and areas for improvement. Provide actionable insights in English and Swahili. Return structured JSON only.`;

    const userPrompt = `Compare this crop plan to historical plans for the same crop.

Current Plan: ${JSON.stringify(currentPlan)}
Historical Plans: ${JSON.stringify(historicalPlans.slice(0, 3))}

Analyze yield trends, soil health, cost efficiency. Return JSON:
{
  "analysis": {"yield_trend": "", "cost_efficiency": "", "soil_health": ""},
  "lessons": {"improved": [""], "worsened": [""], "recommendations": [""]},
  "summary": {"en": "", "sw": ""},
  "ai_score": 0
}`;

    const aiResponse = await openrouter.queryAI(systemPrompt, userPrompt, "openai/gpt-3.5-turbo", 1000, 0.7);

    let analysis;
    try {
      let cleaned = aiResponse.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
      analysis = JSON.parse(cleaned);
    } catch (parseError) {
      analysis = {
        analysis: { yield_trend: "stable", cost_efficiency: "average", soil_health: "maintained" },
        lessons: { improved: ["Better timing"], worsened: ["Higher costs"], recommendations: ["Optimize inputs"] },
        summary: { en: "Performance analysis complete", sw: "Uchambuzi umekamilika" },
        ai_score: 75
      };
    }

    await kv.set(`crop-plan-analysis:${userId}:${planId}`, {
      planId,
      analysis,
      generatedAt: new Date().toISOString()
    });

    return c.json({ success: true, analysis });

  } catch (error) {
    console.error("Historical analysis error:", error);
    return c.json({ 
      success: false, 
      error: "Failed to analyze history"
    }, 500);
  }
}
