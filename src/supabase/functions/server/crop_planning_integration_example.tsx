/**
 * ============================================================================
 * EXAMPLE: Full AI + Database Integration
 * ============================================================================
 * This example shows how to create a complete crop planning workflow
 * that uses AI intelligence and stores results in the database
 * ============================================================================
 */

import { Hono } from "npm:hono";
import { generateMasterPrompt } from "./ai_feature_prompts.tsx";
import * as dataAccess from "./data_access.tsx";

const cropPlanningRouter = new Hono();

/**
 * ============================================================================
 * ENDPOINT 1: Generate AI Crop Blueprint
 * ============================================================================
 * POST /crop-planning/blueprint/generate
 * 
 * Takes: crop_id, farm_id, preferences
 * Returns: AI-generated blueprint (stored in database)
 */

cropPlanningRouter.post("/blueprint/generate", async (c) => {
  try {
    const { crop_id, farm_id, practice_type, soil_type, inputs_available, labor_level } =
      await c.req.json();

    // Validate inputs
    if (!crop_id || !farm_id) {
      return c.json({ error: "crop_id and farm_id are required" }, 400);
    }

    // 1. Get AI recommendation
    const systemPrompt = generateMasterPrompt({
      feature: "farming_templates",
      context: {
        crop: crop_id, // In production, you'd look up the crop name
        practice_type: practice_type || "rainfed",
        soil_type: soil_type || "sandy loam",
        inputs_available: inputs_available || ["DAP", "Urea"],
        labor_level: labor_level || "medium",
        language: "EN",
      },
      language: "EN",
    });

    // 2. Call AI provider (simplified)
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate optimal farming blueprint" },
        ],
      }),
    });

    const aiData = await response.json();
    const aiResponse = JSON.parse(aiData.choices[0].message.content);

    // 3. Store blueprint in database
    const blueprintId = await dataAccess.saveCropBlueprint({
      farm_id,
      crop_id,
      spacing_cm: aiResponse.defaults.spacing_cm || 75,
      seed_rate: parseFloat(aiResponse.defaults.expected_yield_kg?.split("-")[0] || "0"),
      irrigation_type: practice_type || "rainfed",
      fertilizer_plan: {
        tasks: aiResponse.tasks || [],
        input_needs: aiResponse.defaults.input_needs || [],
        risk_flags: aiResponse.risk_flags || [],
        ai_confidence: "high",
        generated_at: new Date().toISOString(),
      },
      created_by: "ai",
    });

    // 4. Return blueprint
    return c.json({
      success: true,
      blueprint_id: blueprintId,
      blueprint: await dataAccess.getCropBlueprint(blueprintId),
      ai_response: aiResponse,
    });
  } catch (error) {
    console.error("Blueprint generation error:", error);
    return c.json(
      {
        error: "Failed to generate blueprint",
        message: error.message,
      },
      500
    );
  }
});

/**
 * ============================================================================
 * ENDPOINT 2: Create Crop Planting with AI Forecasting
 * ============================================================================
 * POST /crop-planning/planting/create
 * 
 * Takes: farm_id, crop_id, blueprint_id, planting_date, area
 * Returns: Planting record with AI yield forecast and auto-generated tasks
 */

cropPlanningRouter.post("/planting/create", async (c) => {
  try {
    const { farm_id, crop_id, blueprint_id, planting_date, area_acres } =
      await c.req.json();

    // Validate inputs
    if (!farm_id || !crop_id || !planting_date) {
      return c.json(
        {
          error: "farm_id, crop_id, and planting_date are required",
        },
        400
      );
    }

    // 1. Create planting record
    const plantingId = await dataAccess.savePlanting({
      farm_id,
      crop_id,
      blueprint_id,
      planting_date,
      area_sq_m: (area_acres || 1.0) * 4047, // Convert acres to sq meters
      status: "planned",
    });

    // 2. Get AI yield forecast
    const forecastPrompt = generateMasterPrompt({
      feature: "yield_revenue",
      context: {
        crop_plan: [{ crop: crop_id, acres: area_acres || 1.0 }],
        market_prices: { [crop_id]: 800 }, // Default price
        confidence_preference: "balanced",
        language: "EN",
      },
      language: "EN",
    });

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    
    const forecastResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-sonnet",
          messages: [
            { role: "system", content: forecastPrompt },
            { role: "user", content: "Provide yield and revenue forecast" },
          ],
        }),
      }
    );

    const forecastData = await forecastResponse.json();
    const forecast = JSON.parse(forecastData.choices[0].message.content);

    // 3. Store yield forecast
    const forecastId = await dataAccess.saveYieldForecast({
      planting_id: plantingId,
      estimated_yield: forecast.yield_range.most_likely_kg,
      estimated_revenue: forecast.revenue_range.most_likely_tzs,
      confidence_level: "medium",
      generated_by: "ai",
      forecast_metadata: forecast,
    });

    // 4. Auto-generate tasks from blueprint
    const blueprint = blueprint_id
      ? await dataAccess.getCropBlueprint(blueprint_id)
      : null;

    const tasks = [];
    if (blueprint && blueprint.fertilizer_plan.tasks) {
      for (const task of blueprint.fertilizer_plan.tasks) {
        // Calculate scheduled date
        const plantDate = new Date(planting_date);
        plantDate.setDate(plantDate.getDate() + task.days_after_planting);

        const taskId = await dataAccess.saveTask({
          planting_id: plantingId,
          task_type: task.task_name.toLowerCase().includes("fertilize")
            ? "fertilize"
            : task.task_name.toLowerCase().includes("plant")
            ? "plant"
            : task.task_name.toLowerCase().includes("harvest")
            ? "harvest"
            : "irrigate",
          scheduled_date: plantDate.toISOString().split("T")[0],
          completed: false,
          auto_generated: true,
        });

        tasks.push(taskId);
      }
    }

    // 5. Return complete planting package
    return c.json({
      success: true,
      planting: await dataAccess.getPlanting(plantingId),
      forecast: await dataAccess.getYieldForecast(plantingId),
      tasks: await Promise.all(tasks.map((id) => dataAccess.getPlantingTasks(plantingId))),
      ai_insights: {
        yield_forecast: forecast,
        tasks_generated: tasks.length,
      },
    });
  } catch (error) {
    console.error("Planting creation error:", error);
    return c.json(
      {
        error: "Failed to create planting",
        message: error.message,
      },
      500
    );
  }
});

/**
 * ============================================================================
 * ENDPOINT 3: Get Farm Dashboard with AI Insights
 * ============================================================================
 * GET /crop-planning/dashboard/:farm_id
 * 
 * Returns: Complete AI-powered dashboard for a farm
 */

cropPlanningRouter.get("/dashboard/:farm_id", async (c) => {
  try {
    const farm_id = c.req.param("farm_id");

    if (!farm_id) {
      return c.json({ error: "farm_id is required" }, 400);
    }

    // 1. Get all farm data with AI insights
    const dashboard = await dataAccess.getFarmAIDashboard(farm_id);

    // 2. Get active AI recommendations
    const recommendations = await dataAccess.getFarmRecommendations(
      farm_id,
      false
    );

    // 3. Calculate summary metrics
    const totalPlantings = dashboard.plantings.length;
    const activePlantings = dashboard.plantings.filter(
      (p) => p.status === "planted" || p.status === "planned"
    ).length;
    const totalForecastedRevenue = dashboard.forecasts.reduce(
      (sum, f) => sum + (f?.estimated_revenue || 0),
      0
    );

    // 4. Return dashboard
    return c.json({
      success: true,
      dashboard: {
        summary: {
          total_plantings: totalPlantings,
          active_plantings: activePlantings,
          forecasted_revenue: totalForecastedRevenue,
        },
        ai_insights: {
          blueprints_created: dashboard.blueprints.length,
          active_recommendations: recommendations.filter(
            (r) => r.urgency === "high"
          ).length,
          critical_inventory: dashboard.inventory.length,
        },
        plantings: dashboard.plantings,
        forecasts: dashboard.forecasts,
        recommendations: recommendations.slice(0, 5), // Top 5
        inventory_alerts: dashboard.inventory,
        pricing_suggestions: dashboard.products,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return c.json(
      {
        error: "Failed to load dashboard",
        message: error.message,
      },
      500
    );
  }
});

/**
 * ============================================================================
 * ENDPOINT 4: Complete Harvest with Inventory Update
 * ============================================================================
 * POST /crop-planning/harvest/complete
 * 
 * Takes: planting_id, actual_yield
 * Returns: Updated planting, inventory, and AI pricing suggestions
 */

cropPlanningRouter.post("/harvest/complete", async (c) => {
  try {
    const { planting_id, actual_yield_kg } = await c.req.json();

    if (!planting_id || !actual_yield_kg) {
      return c.json(
        {
          error: "planting_id and actual_yield_kg are required",
        },
        400
      );
    }

    // 1. Get planting details
    const planting = await dataAccess.getPlanting(planting_id);
    if (!planting) {
      return c.json({ error: "Planting not found" }, 404);
    }

    // 2. Update planting status (simulated update)
    // In real implementation: UPDATE plantings SET status = 'completed'

    // 3. Add to inventory
    const inventoryId = await dataAccess.saveInventoryItem({
      farm_id: planting.farm_id,
      crop_id: planting.crop_id,
      quantity: actual_yield_kg,
      unit: "kg",
      source: "harvest",
    });

    // 4. Get AI pricing suggestion
    const pricingPrompt = generateMasterPrompt({
      feature: "marketplace",
      context: {
        inventory: [
          {
            product: planting.crop_id,
            quantity: actual_yield_kg,
            quality: "Grade A",
          },
        ],
        price_preferences: "market average",
        sales_channels: ["Local market"],
        language: "EN",
      },
      language: "EN",
    });

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    
    const pricingResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-sonnet",
          messages: [
            { role: "system", content: pricingPrompt },
            { role: "user", content: "Suggest optimal pricing" },
          ],
        }),
      }
    );

    const pricingData = await pricingResponse.json();
    const pricing = JSON.parse(pricingData.choices[0].message.content);

    // 5. Create/update product listing
    const productId = await dataAccess.saveProduct({
      farm_id: planting.farm_id,
      crop_id: planting.crop_id,
      unit: "kg",
      price: pricing.recommended_price.price_per_kg_tzs,
      active: true,
      ai_pricing_metadata: pricing,
    });

    // 6. Return complete harvest package
    return c.json({
      success: true,
      planting: planting,
      inventory_added: inventoryId,
      product_listing: productId,
      ai_pricing: pricing,
      summary: {
        harvested: actual_yield_kg,
        recommended_price: pricing.recommended_price.price_per_kg_tzs,
        estimated_revenue:
          actual_yield_kg * pricing.recommended_price.price_per_kg_tzs,
      },
    });
  } catch (error) {
    console.error("Harvest completion error:", error);
    return c.json(
      {
        error: "Failed to complete harvest",
        message: error.message,
      },
      500
    );
  }
});

export default cropPlanningRouter;

/**
 * ============================================================================
 * USAGE EXAMPLE IN MAIN SERVER
 * ============================================================================
 * 
 * // In /supabase/functions/server/index.tsx:
 * 
 * import cropPlanningRouter from "./crop_planning_integration.tsx";
 * 
 * // Mount the router
 * app.route("/make-server-ce1844e7/crop-planning", cropPlanningRouter);
 * 
 * ============================================================================
 * 
 * FRONTEND USAGE EXAMPLES
 * ============================================================================
 * 
 * // 1. Generate AI blueprint
 * const response = await fetch(
 *   `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/crop-planning/blueprint/generate`,
 *   {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *       Authorization: `Bearer ${anonKey}`,
 *     },
 *     body: JSON.stringify({
 *       crop_id: "uuid",
 *       farm_id: "uuid",
 *       practice_type: "rainfed",
 *       soil_type: "sandy loam",
 *     }),
 *   }
 * );
 * 
 * // 2. Create planting with AI forecasting
 * const response = await fetch(
 *   `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/crop-planning/planting/create`,
 *   {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *       Authorization: `Bearer ${anonKey}`,
 *     },
 *     body: JSON.stringify({
 *       farm_id: "uuid",
 *       crop_id: "uuid",
 *       blueprint_id: "uuid",
 *       planting_date: "2026-03-15",
 *       area_acres: 2.5,
 *     }),
 *   }
 * );
 * 
 * // 3. Get AI-powered dashboard
 * const response = await fetch(
 *   `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/crop-planning/dashboard/${farmId}`,
 *   {
 *     headers: {
 *       Authorization: `Bearer ${anonKey}`,
 *     },
 *   }
 * );
 * 
 * ============================================================================
 */
