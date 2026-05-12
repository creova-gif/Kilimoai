/**
 * AI Workflow Endpoints
 * Endpoints for 5 AI-powered workflows
 */

import * as kv from "./kv_store.tsx";

export function registerWorkflowEndpoints(app: any) {
  // ========== CROP PLANNING ==========

  app.get("/make-server-ce1844e7/crop-plans/:userId", async (c: any) => {
    try {
      const userId = c.req.param("userId");
      const plans = await kv.getByPrefix(`crop-plan:${userId}:`);
      
      return c.json({
        success: true,
        plans: plans || []
      });
    } catch (error) {
      console.log(`Error fetching crop plans: ${error}`);
      return c.json({ error: "Failed to fetch crop plans" }, 500);
    }
  });

  app.post("/make-server-ce1844e7/crop-plans/generate", async (c: any) => {
    try {
      const data = await c.req.json();
      const { userId, cropName, variety, plantingDate, farmSize, region, soilType, irrigationType } = data;

      const planId = crypto.randomUUID();
      const plantDate = new Date(plantingDate);
      
      // Calculate harvest date (example: 120 days for most crops)
      const harvestDate = new Date(plantDate);
      harvestDate.setDate(harvestDate.getDate() + 120);

      // Generate AI-powered recommendations
      const plan = {
        id: planId,
        cropName,
        variety: variety || "Standard",
        plantingDate,
        expectedHarvest: harvestDate.toISOString().split('T')[0],
        farmSize: parseFloat(farmSize),
        region,
        soilType,
        irrigationType,
        aiRecommendations: {
          optimalPlantingWindow: `Best planting window: ${plantDate.toLocaleDateString()} - ${new Date(plantDate.getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
          expectedYield: `${(parseFloat(farmSize) * 2.5).toFixed(1)} tons (2.5 tons/acre)`,
          fertilizerSchedule: [
            "Week 0: Apply NPK 17:17:17 at 50kg/acre at planting",
            "Week 3: Top-dress with Urea 46%N at 25kg/acre",
            "Week 6: Apply NPK 23:10:5 at 30kg/acre during flowering",
            "Week 9: Final top-dressing with Urea at 20kg/acre"
          ],
          pestManagement: [
            "Week 2-4: Scout for Fall Armyworm, apply Emamectin Benzoate if detected",
            "Week 5-8: Monitor for aphids, use Imidacloprid if threshold exceeded",
            "Week 10: Apply fungicide (Mancozeb) to prevent ear rot"
          ],
          waterRequirements: `${irrigationType === "Rain-fed" ? "25-30mm per week" : "Drip: 15-20mm per week"}`,
          riskFactors: [
            "Drought risk: Medium - ensure irrigation backup",
            "Pest pressure: Fall Armyworm typically high in this region",
            "Disease risk: Low for this planting window"
          ],
          profitability: {
            estimatedCost: parseFloat(farmSize) * 450000,
            estimatedRevenue: parseFloat(farmSize) * 2.5 * 800000,
            netProfit: (parseFloat(farmSize) * 2.5 * 800000) - (parseFloat(farmSize) * 450000),
            roi: Math.round((((parseFloat(farmSize) * 2.5 * 800000) / (parseFloat(farmSize) * 450000)) - 1) * 100)
          }
        },
        status: "planning" as const,
        createdDate: new Date().toISOString()
      };

      await kv.set(`crop-plan:${userId}:${planId}`, plan);

      return c.json({
        success: true,
        plan
      });
    } catch (error) {
      console.log(`Error generating crop plan: ${error}`);
      return c.json({ error: "Failed to generate crop plan" }, 500);
    }
  });

  // ========== LIVESTOCK HEALTH ==========

  app.get("/make-server-ce1844e7/livestock/:userId", async (c: any) => {
    try {
      const userId = c.req.param("userId");
      const animals = await kv.getByPrefix(`livestock:${userId}:`);
      
      return c.json({
        success: true,
        animals: animals || []
      });
    } catch (error) {
      console.log(`Error fetching livestock: ${error}`);
      return c.json({ error: "Failed to fetch livestock" }, 500);
    }
  });

  app.post("/make-server-ce1844e7/livestock/diagnose", async (c: any) => {
    try {
      const data = await c.req.json();
      const { userId, animalId, symptoms, description, duration, severity } = data;

      const animal = await kv.get(`livestock:${userId}:${animalId}`);
      
      if (!animal) {
        return c.json({ error: "Animal not found" }, 404);
      }

      // Generate AI diagnosis
      const alertId = crypto.randomUUID();
      const diagnosis = symptoms.includes("Fever") && symptoms.includes("Coughing")
        ? "Possible respiratory infection (Pneumonia)"
        : symptoms.includes("Diarrhea") && symptoms.includes("Loss of appetite")
        ? "Possible gastrointestinal infection or parasites"
        : symptoms.includes("Lameness")
        ? "Foot rot or joint inflammation"
        : "General illness - requires veterinary examination";

      const recommendedAction = severity === "critical"
        ? "URGENT: Contact veterinarian immediately"
        : severity === "high"
        ? "Schedule veterinary visit within 24 hours"
        : "Monitor closely and contact vet if symptoms worsen";

      const healthAlert = {
        id: alertId,
        severity,
        symptom: symptoms.join(", "),
        detectedDate: new Date().toISOString(),
        aiDiagnosis: diagnosis,
        recommendedAction,
        status: "new" as const
      };

      // Add treatment plan if high severity
      if (severity === "high" || severity === "critical") {
        animal.treatmentPlan = {
          diagnosis,
          treatments: [
            "Isolate animal from herd",
            "Provide clean water and fresh feed",
            "Monitor temperature daily",
            "Keep area clean and dry"
          ],
          medications: [
            {
              name: "Oxytetracycline LA",
              dosage: "20mg/kg body weight",
              frequency: "Once daily",
              duration: "5 days"
            }
          ],
          followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          cost: 45000,
          prognosis: "Good with proper treatment"
        };
      }

      animal.healthAlerts = animal.healthAlerts || [];
      animal.healthAlerts.unshift(healthAlert);
      animal.healthStatus = severity === "critical" ? "critical" : severity === "high" ? "sick" : "recovering";

      await kv.set(`livestock:${userId}:${animalId}`, animal);

      return c.json({
        success: true,
        animal
      });
    } catch (error) {
      console.log(`Error diagnosing animal: ${error}`);
      return c.json({ error: "Failed to diagnose animal" }, 500);
    }
  });

  // ========== TASK MANAGEMENT ==========

  app.get("/make-server-ce1844e7/tasks/:userId", async (c: any) => {
    try {
      const userId = c.req.param("userId");
      const tasks = await kv.getByPrefix(`task:${userId}:`);
      
      return c.json({
        success: true,
        tasks: tasks || []
      });
    } catch (error) {
      console.log(`Error fetching tasks: ${error}`);
      return c.json({ error: "Failed to fetch tasks" }, 500);
    }
  });

  app.get("/make-server-ce1844e7/workers/:userId", async (c: any) => {
    try {
      const userId = c.req.param("userId");
      const workers = await kv.getByPrefix(`worker:${userId}:`);
      
      return c.json({
        success: true,
        workers: workers || []
      });
    } catch (error) {
      console.log(`Error fetching workers: ${error}`);
      return c.json({ error: "Failed to fetch workers" }, 500);
    }
  });

  app.post("/make-server-ce1844e7/tasks/create", async (c: any) => {
    try {
      const data = await c.req.json();
      const { userId, title, description, category, priority, assignedTo, dueDate, estimatedHours, location, cropType } = data;

      const taskId = crypto.randomUUID();
      
      // AI-generated suggestions based on task type
      const aiSuggestions = category === "weeding" 
        ? ["Best time: Early morning (6-10am) for cooler conditions", "Use hand hoes for better root removal", "Target 2-3 weeding cycles for season"]
        : category === "fertilizing"
        ? ["Apply when soil is moist", "Avoid application before heavy rain", "Mix fertilizer with soil, don't leave on surface"]
        : category === "harvesting"
        ? ["Harvest in dry weather to reduce spoilage", "Handle produce gently to prevent bruising", "Start early morning for best quality"]
        : ["Follow best agricultural practices", "Document all activities for record-keeping"];

      const task = {
        id: taskId,
        title,
        description,
        category,
        priority,
        status: "pending" as const,
        assignedTo: assignedTo || [],
        dueDate,
        estimatedHours,
        location,
        cropType,
        aiSuggestions,
        createdDate: new Date().toISOString()
      };

      await kv.set(`task:${userId}:${taskId}`, task);

      return c.json({
        success: true,
        task
      });
    } catch (error) {
      console.log(`Error creating task: ${error}`);
      return c.json({ error: "Failed to create task" }, 500);
    }
  });

  app.put("/make-server-ce1844e7/tasks/update-status", async (c: any) => {
    try {
      const { taskId, status } = await c.req.json();
      
      // Find the task across all users (in production, you'd want userId)
      const allTasks = await kv.getByPrefix("task:");
      const task = allTasks.find((t: any) => t.id === taskId);
      
      if (!task) {
        return c.json({ error: "Task not found" }, 404);
      }

      task.status = status;
      if (status === "completed") {
        task.completedDate = new Date().toISOString();
      }

      // Re-save task (we'd need to know the userId in production)
      const keys = await kv.getByPrefix("task:");
      for (const key of keys) {
        if (key.id === taskId) {
          await kv.set(`task:${task.userId || "default"}:${taskId}`, task);
          break;
        }
      }

      return c.json({
        success: true,
        task
      });
    } catch (error) {
      console.log(`Error updating task: ${error}`);
      return c.json({ error: "Failed to update task" }, 500);
    }
  });

  // ========== YIELD FORECASTING ==========

  app.get("/make-server-ce1844e7/yield-forecasts/:userId", async (c: any) => {
    try {
      const userId = c.req.param("userId");
      const forecasts = await kv.getByPrefix(`yield-forecast:${userId}:`);
      
      return c.json({
        success: true,
        forecasts: forecasts || []
      });
    } catch (error) {
      console.log(`Error fetching forecasts: ${error}`);
      return c.json({ error: "Failed to fetch forecasts" }, 500);
    }
  });

  app.post("/make-server-ce1844e7/yield-forecasts/generate", async (c: any) => {
    try {
      const { userId } = await c.req.json();
      
      const forecastId = crypto.randomUUID();
      
      // Generate mock AI forecast
      const forecast = {
        id: forecastId,
        cropName: "Maize",
        farmSize: 3,
        region: "Morogoro",
        forecastedYield: 7.8,
        historicalYield: 6.2,
        yieldImprovement: 25.8,
        confidence: 87,
        factors: {
          weather: "positive" as const,
          soilHealth: "good" as const,
          pestPressure: "low" as const,
          inputQuality: "high" as const
        },
        revenue: {
          pessimistic: 4200000,
          realistic: 6240000,
          optimistic: 7800000,
          estimatedPrice: 800000
        },
        recommendations: [
          "Maintain current fertilizer application schedule - soil tests show optimal nutrient levels",
          "Increase plant density by 10% to maximize yield potential given favorable weather forecast",
          "Scout for Fall Armyworm weekly during vegetative stage - low pressure predicted but vigilance needed",
          "Consider installing drip irrigation for 15% yield boost and 40% water savings",
          "Harvest timing critical: Monitor grain moisture, target 13-14% for optimal quality"
        ],
        generatedDate: new Date().toISOString()
      };

      await kv.set(`yield-forecast:${userId}:${forecastId}`, forecast);

      return c.json({
        success: true,
        forecast
      });
    } catch (error) {
      console.log(`Error generating forecast: ${error}`);
      return c.json({ error: "Failed to generate forecast" }, 500);
    }
  });

  // ========== CLIMATE RISK ALERTS ==========

  app.get("/make-server-ce1844e7/climate-alerts/:userId", async (c: any) => {
    try {
      const userId = c.req.param("userId");
      const alerts = await kv.getByPrefix(`climate-alert:${userId}:`);
      
      return c.json({
        success: true,
        alerts: alerts || []
      });
    } catch (error) {
      console.log(`Error fetching climate alerts: ${error}`);
      return c.json({ error: "Failed to fetch climate alerts" }, 500);
    }
  });

  app.post("/make-server-ce1844e7/climate-alerts/acknowledge", async (c: any) => {
    try {
      const { alertId } = await c.req.json();
      
      // Find and update alert
      const allAlerts = await kv.getByPrefix("climate-alert:");
      const alert = allAlerts.find((a: any) => a.id === alertId);
      
      if (alert) {
        alert.status = "monitoring";
        // Save back (would need userId in production)
        await kv.set(`climate-alert:default:${alertId}`, alert);
      }

      return c.json({
        success: true
      });
    } catch (error) {
      console.log(`Error acknowledging alert: ${error}`);
      return c.json({ error: "Failed to acknowledge alert" }, 500);
    }
  });
}
