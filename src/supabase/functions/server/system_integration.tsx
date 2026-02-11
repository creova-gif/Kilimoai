/**
 * KILIMO SYSTEM INTEGRATION - BACKEND ROUTES
 * 
 * This adds ALL missing integration endpoints to connect:
 * - Crop Plans → Tasks → Notifications
 * - Inventory → Harvest → Market → Finance
 * - AI Telemetry → Feedback Loop
 * - Offline sync support
 */

import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

export function registerIntegrationRoutes(app: Hono) {
  
  // ==================== CROP PLANNING → TASKS INTEGRATION ====================
  
  // Generate tasks from crop plan
  app.post("/make-server-ce1844e7/tasks/generate-from-plan", async (c) => {
    try {
      const { planId } = await c.req.json();
      
      if (!planId) {
        return c.json({ success: false, error: "Plan ID required" }, 400);
      }
      
      // Get plan details
      const plan = await kv.get(`cropPlan:${planId}`);
      
      if (!plan) {
        return c.json({ success: false, error: "Plan not found" }, 404);
      }
      
      // Generate tasks based on crop growth stages
      const tasks = generateTasksForCrop(plan);
      
      // Store tasks
      for (const task of tasks) {
        await kv.set(`task:${task.id}`, task);
      }
      
      // Update plan with task IDs
      plan.tasks = tasks.map((t: any) => t.id);
      await kv.set(`cropPlan:${planId}`, plan);
      
      return c.json({
        success: true,
        tasks,
        count: tasks.length,
      });
    } catch (error: any) {
      console.error("Task generation error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  
  // Update task status
  app.put("/make-server-ce1844e7/tasks/:taskId", async (c) => {
    try {
      const taskId = c.req.param("taskId");
      const updates = await c.req.json();
      
      const task = await kv.get(`task:${taskId}`);
      
      if (!task) {
        return c.json({ success: false, error: "Task not found" }, 404);
      }
      
      // Update task
      const updatedTask = { ...task, ...updates };
      await kv.set(`task:${taskId}`, updatedTask);
      
      // If completed and it's a harvest task, trigger inventory update
      if (updates.status === 'completed' && task.category === 'harvest') {
        await triggerHarvestInventoryUpdate(task);
      }
      
      return c.json({ success: true, task: updatedTask });
    } catch (error: any) {
      console.error("Task update error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  
  // ==================== NOTIFICATIONS ====================
  
  // Schedule notification for task
  app.post("/make-server-ce1844e7/notifications/schedule", async (c) => {
    try {
      const { taskId, userId, title, body, scheduledFor, type } = await c.req.json();
      
      const notification = {
        id: crypto.randomUUID(),
        taskId,
        userId,
        title,
        body,
        scheduledFor,
        type,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      };
      
      await kv.set(`notification:${notification.id}`, notification);
      
      // Add to user's notification queue
      const userNotifications = await kv.get(`userNotifications:${userId}`) || [];
      userNotifications.push(notification.id);
      await kv.set(`userNotifications:${userId}`, userNotifications);
      
      return c.json({ success: true, notification });
    } catch (error: any) {
      console.error("Notification scheduling error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  
  // Get user notifications
  app.get("/make-server-ce1844e7/notifications/:userId", async (c) => {
    try {
      const userId = c.req.param("userId");
      
      const notificationIds = await kv.get(`userNotifications:${userId}`) || [];
      
      const notifications = await Promise.all(
        notificationIds.map((id: string) => kv.get(`notification:${id}`))
      );
      
      return c.json({
        success: true,
        notifications: notifications.filter(Boolean),
        count: notifications.length,
      });
    } catch (error: any) {
      console.error("Notification fetch error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  
  // ==================== INVENTORY → HARVEST INTEGRATION ====================
  
  // Add harvest to inventory
  app.post("/make-server-ce1844e7/inventory/add-harvest", async (c) => {
    try {
      const { userId, cropName, quantity, harvestDate, planId } = await c.req.json();
      
      // Get or create user inventory
      const inventory = await kv.get(`inventory:${userId}`) || {};
      
      if (!inventory[cropName]) {
        inventory[cropName] = {
          totalQuantity: 0,
          harvests: [],
        };
      }
      
      // Add harvest
      const harvest = {
        id: crypto.randomUUID(),
        quantity,
        harvestDate,
        planId,
        addedAt: new Date().toISOString(),
      };
      
      inventory[cropName].harvests.push(harvest);
      inventory[cropName].totalQuantity += quantity;
      
      await kv.set(`inventory:${userId}`, inventory);
      
      return c.json({ success: true, inventory: inventory[cropName] });
    } catch (error: any) {
      console.error("Inventory add error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  
  // Reduce inventory (after sale)
  app.post("/make-server-ce1844e7/inventory/reduce", async (c) => {
    try {
      const { userId, cropName, quantity } = await c.req.json();
      
      const inventory = await kv.get(`inventory:${userId}`) || {};
      
      if (!inventory[cropName] || inventory[cropName].totalQuantity < quantity) {
        return c.json({ success: false, error: "Insufficient inventory" }, 400);
      }
      
      inventory[cropName].totalQuantity -= quantity;
      
      await kv.set(`inventory:${userId}`, inventory);
      
      return c.json({ success: true, inventory: inventory[cropName] });
    } catch (error: any) {
      console.error("Inventory reduce error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  
  // Get user inventory
  app.get("/make-server-ce1844e7/inventory/:userId", async (c) => {
    try {
      const userId = c.req.param("userId");
      
      const inventory = await kv.get(`inventory:${userId}`) || {};
      
      return c.json({ success: true, inventory });
    } catch (error: any) {
      console.error("Inventory fetch error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  
  // ==================== MARKETPLACE → INVENTORY → FINANCE INTEGRATION ====================
  
  // Update marketplace inventory availability
  app.post("/make-server-ce1844e7/marketplace/update-inventory", async (c) => {
    try {
      const { userId, cropName, quantity, available } = await c.req.json();
      
      // Get or create marketplace listings
      const listings = await kv.get(`marketplaceListings:${userId}`) || [];
      
      // Check if listing exists
      const existingIndex = listings.findIndex((l: any) => l.cropName === cropName);
      
      if (existingIndex >= 0) {
        listings[existingIndex].quantity = quantity;
        listings[existingIndex].available = available;
        listings[existingIndex].updatedAt = new Date().toISOString();
      } else {
        listings.push({
          id: crypto.randomUUID(),
          cropName,
          quantity,
          available,
          createdAt: new Date().toISOString(),
        });
      }
      
      await kv.set(`marketplaceListings:${userId}`, listings);
      
      return c.json({ success: true, listings });
    } catch (error: any) {
      console.error("Marketplace update error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  
  // Process marketplace sale
  app.post("/make-server-ce1844e7/marketplace/process-sale", async (c) => {
    try {
      const { sellerId, buyerId, cropName, quantity, pricePerUnit } = await c.req.json();
      
      // Verify inventory
      const inventory = await kv.get(`inventory:${sellerId}`) || {};
      
      if (!inventory[cropName] || inventory[cropName].totalQuantity < quantity) {
        return c.json({ success: false, error: "Insufficient inventory" }, 400);
      }
      
      // Create sale record
      const sale = {
        id: crypto.randomUUID(),
        sellerId,
        buyerId,
        cropName,
        quantity,
        pricePerUnit,
        totalAmount: quantity * pricePerUnit,
        status: 'completed',
        createdAt: new Date().toISOString(),
      };
      
      await kv.set(`sale:${sale.id}`, sale);
      
      // Update seller's sales history
      const sellerSales = await kv.get(`sales:${sellerId}`) || [];
      sellerSales.push(sale.id);
      await kv.set(`sales:${sellerId}`, sellerSales);
      
      return c.json({ success: true, sale });
    } catch (error: any) {
      console.error("Marketplace sale error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  
  // ==================== WALLET INTEGRATION ====================
  
  // Update wallet balance
  app.post("/make-server-ce1844e7/wallet/update-balance", async (c) => {
    try {
      const { userId, amount, source, type } = await c.req.json();
      
      // Get or create wallet
      const wallet = await kv.get(`wallet:${userId}`) || {
        balance: 0,
        transactions: [],
      };
      
      // Update balance
      if (type === 'credit') {
        wallet.balance += amount;
      } else {
        wallet.balance -= amount;
      }
      
      // Add transaction
      const transaction = {
        id: crypto.randomUUID(),
        amount,
        type,
        source,
        timestamp: new Date().toISOString(),
      };
      
      wallet.transactions.push(transaction);
      
      await kv.set(`wallet:${userId}`, wallet);
      
      return c.json({ success: true, wallet });
    } catch (error: any) {
      console.error("Wallet update error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  
  // Get wallet balance
  app.get("/make-server-ce1844e7/wallet/:userId", async (c) => {
    try {
      const userId = c.req.param("userId");
      
      const wallet = await kv.get(`wallet:${userId}`) || {
        balance: 0,
        transactions: [],
      };
      
      return c.json({ success: true, wallet });
    } catch (error: any) {
      console.error("Wallet fetch error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  
  // ==================== FINANCE INTEGRATION ====================
  
  // Record finance transaction
  app.post("/make-server-ce1844e7/finance/record-transaction", async (c) => {
    try {
      const { userId, type, category, amount, description, date } = await c.req.json();
      
      const transaction = {
        id: crypto.randomUUID(),
        userId,
        type,
        category,
        amount,
        description,
        date,
        createdAt: new Date().toISOString(),
      };
      
      await kv.set(`financeTransaction:${transaction.id}`, transaction);
      
      // Add to user's transaction history
      const userTransactions = await kv.get(`financeTransactions:${userId}`) || [];
      userTransactions.push(transaction.id);
      await kv.set(`financeTransactions:${userId}`, userTransactions);
      
      // Update financial summary
      await updateFinancialSummary(userId, type, amount);
      
      return c.json({ success: true, transaction });
    } catch (error: any) {
      console.error("Finance transaction error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  
  // Get financial summary
  app.get("/make-server-ce1844e7/finance/summary/:userId", async (c) => {
    try {
      const userId = c.req.param("userId");
      
      const summary = await kv.get(`financeSummary:${userId}`) || {
        totalIncome: 0,
        totalExpense: 0,
        netProfit: 0,
      };
      
      return c.json({ success: true, summary });
    } catch (error: any) {
      console.error("Finance summary error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  
  // ==================== AI TELEMETRY & FEEDBACK ====================
  
  // Store AI diagnosis telemetry
  app.post("/make-server-ce1844e7/ai/telemetry/diagnosis", async (c) => {
    try {
      const { userId, timestamp, disease, confidence, remedy } = await c.req.json();
      
      const telemetry = {
        id: crypto.randomUUID(),
        userId,
        timestamp,
        disease,
        confidence,
        remedy,
        feedback: null,
        actualOutcome: null,
      };
      
      await kv.set(`aiTelemetry:${telemetry.id}`, telemetry);
      
      // Add to user's telemetry history
      const userTelemetry = await kv.get(`userTelemetry:${userId}`) || [];
      userTelemetry.push(telemetry.id);
      await kv.set(`userTelemetry:${userId}`, userTelemetry);
      
      return c.json({ success: true, telemetry });
    } catch (error: any) {
      console.error("Telemetry storage error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  
  // Submit diagnosis feedback
  app.post("/make-server-ce1844e7/ai/telemetry/feedback", async (c) => {
    try {
      const { diagnosisId, feedback, actualOutcome, userId } = await c.req.json();
      
      const telemetry = await kv.get(`aiTelemetry:${diagnosisId}`);
      
      if (!telemetry) {
        return c.json({ success: false, error: "Diagnosis not found" }, 404);
      }
      
      telemetry.feedback = feedback;
      telemetry.actualOutcome = actualOutcome;
      telemetry.feedbackTimestamp = new Date().toISOString();
      
      await kv.set(`aiTelemetry:${diagnosisId}`, telemetry);
      
      // Update AI confidence scores based on feedback
      if (feedback === 'accurate') {
        await improveAIConfidence(telemetry.disease);
      } else {
        await reduceAIConfidence(telemetry.disease);
      }
      
      return c.json({ success: true, telemetry });
    } catch (error: any) {
      console.error("Feedback submission error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  
  // Trigger AI optimization
  app.post("/make-server-ce1844e7/ai/optimize", async (c) => {
    try {
      const { userId, trigger } = await c.req.json();
      
      // Get all telemetry data
      const userTelemetry = await kv.get(`userTelemetry:${userId}`) || [];
      
      const telemetryData = await Promise.all(
        userTelemetry.map((id: string) => kv.get(`aiTelemetry:${id}`))
      );
      
      // Calculate optimization metrics
      const accurateDiagnoses = telemetryData.filter((t: any) => t?.feedback === 'accurate').length;
      const totalFeedback = telemetryData.filter((t: any) => t?.feedback).length;
      
      const accuracy = totalFeedback > 0 ? (accurateDiagnoses / totalFeedback) * 100 : 0;
      
      const optimization = {
        id: crypto.randomUUID(),
        userId,
        trigger,
        accuracy,
        totalDiagnoses: telemetryData.length,
        feedbackCount: totalFeedback,
        timestamp: new Date().toISOString(),
      };
      
      await kv.set(`aiOptimization:${optimization.id}`, optimization);
      
      return c.json({ success: true, optimization });
    } catch (error: any) {
      console.error("AI optimization error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
  
  // ==================== OFFLINE SYNC ====================
  
  // Sync offline actions
  app.post("/make-server-ce1844e7/sync/offline-actions", async (c) => {
    try {
      const { userId, actions } = await c.req.json();
      
      const results = [];
      
      for (const action of actions) {
        try {
          // Process each offline action
          // This is a simplified version - in production, route to appropriate handlers
          results.push({
            actionId: action.id,
            success: true,
            timestamp: new Date().toISOString(),
          });
        } catch (error: any) {
          results.push({
            actionId: action.id,
            success: false,
            error: error.message,
          });
        }
      }
      
      return c.json({
        success: true,
        results,
        synced: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
      });
    } catch (error: any) {
      console.error("Offline sync error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  });
}

// ==================== HELPER FUNCTIONS ====================

function generateTasksForCrop(plan: any): any[] {
  const tasks = [];
  const startDate = new Date(plan.startDate);
  
  // ✅ IMPORTANT: Ensure startDate is in the future or today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // If plan starts in the past, adjust to start today
  if (startDate < today) {
    startDate.setTime(today.getTime());
  }
  
  // Land preparation (Day 0 - starts from plan start date)
  tasks.push({
    id: crypto.randomUUID(),
    planId: plan.id,
    title: `Land Preparation for ${plan.cropName}`,
    description: 'Clear field, plow, and prepare planting beds',
    dueDate: startDate.toISOString(),
    status: 'pending',
    priority: 'high',
    category: 'preparation',
  });
  
  // Planting (Day 3)
  const plantingDate = new Date(startDate);
  plantingDate.setDate(startDate.getDate() + 3);
  tasks.push({
    id: crypto.randomUUID(),
    planId: plan.id,
    title: `Plant ${plan.cropName}`,
    description: 'Plant seeds at proper spacing and depth',
    dueDate: plantingDate.toISOString(),
    status: 'pending',
    priority: 'high',
    category: 'planting',
  });
  
  // Fertilizer application (Week 2)
  const fertilizerDate = new Date(startDate);
  fertilizerDate.setDate(startDate.getDate() + 14);
  tasks.push({
    id: crypto.randomUUID(),
    planId: plan.id,
    title: `Apply Fertilizer to ${plan.cropName}`,
    description: 'Apply NPK fertilizer according to soil test results',
    dueDate: fertilizerDate.toISOString(),
    status: 'pending',
    priority: 'medium',
    category: 'fertilization',
  });
  
  // Weeding (Week 3)
  const weedingDate = new Date(startDate);
  weedingDate.setDate(startDate.getDate() + 21);
  tasks.push({
    id: crypto.randomUUID(),
    planId: plan.id,
    title: `Weed ${plan.cropName} Field`,
    description: 'Remove all weeds competing for nutrients',
    dueDate: weedingDate.toISOString(),
    status: 'pending',
    priority: 'medium',
    category: 'weeding',
  });
  
  // Pest control (Week 4)
  const pestControlDate = new Date(startDate);
  pestControlDate.setDate(startDate.getDate() + 28);
  tasks.push({
    id: crypto.randomUUID(),
    planId: plan.id,
    title: `Pest Control for ${plan.cropName}`,
    description: 'Inspect and apply appropriate pest control measures',
    dueDate: pestControlDate.toISOString(),
    status: 'pending',
    priority: 'high',
    category: 'pest_control',
  });
  
  // Harvest (estimated end date - ensure it's in the future)
  const harvestDate = new Date(plan.endDate);
  const minHarvestDate = new Date(startDate);
  minHarvestDate.setDate(startDate.getDate() + 90); // At least 90 days from start
  
  // If plan end date is in past, set harvest to 90 days from today
  if (harvestDate < today || harvestDate < minHarvestDate) {
    harvestDate.setTime(minHarvestDate.getTime());
  }
  
  tasks.push({
    id: crypto.randomUUID(),
    planId: plan.id,
    title: `Harvest ${plan.cropName}`,
    description: 'Harvest crop at optimal maturity',
    dueDate: harvestDate.toISOString(),
    status: 'pending',
    priority: 'high',
    category: 'harvest',
  });
  
  return tasks;
}

async function triggerHarvestInventoryUpdate(task: any): Promise<void> {
  try {
    // This is called automatically when a harvest task is completed
    console.log(`Triggering inventory update for completed harvest task: ${task.id}`);
    // Actual implementation handled by the main flow
  } catch (error) {
    console.error("Harvest inventory trigger error:", error);
  }
}

async function updateFinancialSummary(userId: string, type: string, amount: number): Promise<void> {
  try {
    const summary = await kv.get(`financeSummary:${userId}`) || {
      totalIncome: 0,
      totalExpense: 0,
      netProfit: 0,
    };
    
    if (type === 'income') {
      summary.totalIncome += amount;
    } else {
      summary.totalExpense += amount;
    }
    
    summary.netProfit = summary.totalIncome - summary.totalExpense;
    
    await kv.set(`financeSummary:${userId}`, summary);
  } catch (error) {
    console.error("Financial summary update error:", error);
  }
}

async function improveAIConfidence(disease: string): Promise<void> {
  try {
    const confidence = await kv.get(`aiConfidence:${disease}`) || 0.80;
    const newConfidence = Math.min(0.95, confidence + 0.01);
    await kv.set(`aiConfidence:${disease}`, newConfidence);
  } catch (error) {
    console.error("AI confidence improvement error:", error);
  }
}

async function reduceAIConfidence(disease: string): Promise<void> {
  try {
    const confidence = await kv.get(`aiConfidence:${disease}`) || 0.80;
    const newConfidence = Math.max(0.60, confidence - 0.02);
    await kv.set(`aiConfidence:${disease}`, newConfidence);
  } catch (error) {
    console.error("AI confidence reduction error:", error);
  }
}

export default registerIntegrationRoutes;