/**
 * ============================================================================
 * KILIMO DATA ACCESS LAYER - AI Feature Integration
 * ============================================================================
 * Utilities for storing and retrieving AI-generated data
 * Compatible with Master Database Schema
 * ============================================================================
 */

import * as kv from "../supabase/functions/server/kv_store.tsx";

/**
 * ============================================================================
 * CROP INTELLIGENCE DATA ACCESS
 * ============================================================================
 */

export interface CropProfile {
  id: string;
  crop_id: string;
  region: string;
  expected_yield_min: number;
  expected_yield_max: number;
  maturity_days: number;
  common_pests: string[];
  notes: string;
  source: "ai" | "manual";
  updated_at: string;
}

export async function saveCropProfile(profile: Omit<CropProfile, "id" | "updated_at">): Promise<string> {
  const id = `crop_profile:${profile.crop_id}:${profile.region}`;
  
  const data: CropProfile = {
    id,
    ...profile,
    updated_at: new Date().toISOString(),
  };

  await kv.set(id, data);
  
  // Also store in index for quick lookup
  const indexKey = `crop_profiles:${profile.crop_id}`;
  const existing = (await kv.get(indexKey)) || [];
  await kv.set(indexKey, [...existing, id]);

  return id;
}

export async function getCropProfile(crop_id: string, region: string): Promise<CropProfile | null> {
  const id = `crop_profile:${crop_id}:${region}`;
  return await kv.get(id);
}

export async function getAllCropProfiles(crop_id: string): Promise<CropProfile[]> {
  const indexKey = `crop_profiles:${crop_id}`;
  const profileIds = (await kv.get(indexKey)) || [];
  
  const profiles = await Promise.all(
    profileIds.map((id: string) => kv.get(id))
  );
  
  return profiles.filter(Boolean);
}

/**
 * ============================================================================
 * CROP BLUEPRINTS DATA ACCESS
 * ============================================================================
 */

export interface CropBlueprint {
  id: string;
  farm_id: string;
  crop_id: string;
  spacing_cm: number;
  rows_per_bed?: number;
  beds_required?: number;
  seed_rate: number;
  irrigation_type: string;
  fertilizer_plan: {
    tasks: Array<{
      task_name: string;
      days_after_planting: number;
      description: string;
      quantity?: string;
    }>;
    input_needs: string[];
    risk_flags: string[];
    ai_confidence?: string;
    generated_at?: string;
  };
  created_by: "ai" | "farmer";
  created_at: string;
}

export async function saveCropBlueprint(blueprint: Omit<CropBlueprint, "id" | "created_at">): Promise<string> {
  const id = `blueprint:${blueprint.farm_id}:${blueprint.crop_id}:${Date.now()}`;
  
  const data: CropBlueprint = {
    id,
    ...blueprint,
    created_at: new Date().toISOString(),
  };

  await kv.set(id, data);
  
  // Index by farm
  const indexKey = `blueprints:farm:${blueprint.farm_id}`;
  const existing = (await kv.get(indexKey)) || [];
  await kv.set(indexKey, [...existing, id]);

  return id;
}

export async function getCropBlueprint(id: string): Promise<CropBlueprint | null> {
  return await kv.get(id);
}

export async function getFarmBlueprints(farm_id: string): Promise<CropBlueprint[]> {
  const indexKey = `blueprints:farm:${farm_id}`;
  const blueprintIds = (await kv.get(indexKey)) || [];
  
  const blueprints = await Promise.all(
    blueprintIds.map((id: string) => kv.get(id))
  );
  
  return blueprints.filter(Boolean);
}

/**
 * ============================================================================
 * CROP PLANNING DATA ACCESS
 * ============================================================================
 */

export interface Planting {
  id: string;
  farm_id: string;
  crop_id: string;
  blueprint_id?: string;
  planting_date: string;
  harvest_start?: string;
  harvest_end?: string;
  area_sq_m: number;
  status: "planned" | "planted" | "harvesting" | "completed";
  created_at: string;
}

export interface YieldForecast {
  id: string;
  planting_id: string;
  estimated_yield: number;
  estimated_revenue: number;
  confidence_level: "low" | "medium" | "high";
  generated_by: "ai" | "manual";
  forecast_metadata?: {
    yield_range: {
      low_kg: number;
      high_kg: number;
      most_likely_kg: number;
    };
    revenue_range: {
      low_tzs: number;
      high_tzs: number;
      most_likely_tzs: number;
    };
    key_assumptions: string[];
    confidence_note: string;
  };
  created_at: string;
}

export async function savePlanting(planting: Omit<Planting, "id" | "created_at">): Promise<string> {
  const id = `planting:${planting.farm_id}:${Date.now()}`;
  
  const data: Planting = {
    id,
    ...planting,
    created_at: new Date().toISOString(),
  };

  await kv.set(id, data);
  
  // Index by farm
  const indexKey = `plantings:farm:${planting.farm_id}`;
  const existing = (await kv.get(indexKey)) || [];
  await kv.set(indexKey, [...existing, id]);

  return id;
}

export async function saveYieldForecast(forecast: Omit<YieldForecast, "id" | "created_at">): Promise<string> {
  const id = `forecast:${forecast.planting_id}:${Date.now()}`;
  
  const data: YieldForecast = {
    id,
    ...forecast,
    created_at: new Date().toISOString(),
  };

  await kv.set(id, data);
  
  // Index by planting
  const indexKey = `forecasts:planting:${forecast.planting_id}`;
  await kv.set(indexKey, id);

  return id;
}

export async function getPlanting(id: string): Promise<Planting | null> {
  return await kv.get(id);
}

export async function getFarmPlantings(farm_id: string): Promise<Planting[]> {
  const indexKey = `plantings:farm:${farm_id}`;
  const plantingIds = (await kv.get(indexKey)) || [];
  
  const plantings = await Promise.all(
    plantingIds.map((id: string) => kv.get(id))
  );
  
  return plantings.filter(Boolean);
}

export async function getYieldForecast(planting_id: string): Promise<YieldForecast | null> {
  const indexKey = `forecasts:planting:${planting_id}`;
  const forecastId = await kv.get(indexKey);
  
  if (!forecastId) return null;
  
  return await kv.get(forecastId);
}

/**
 * ============================================================================
 * TASKS DATA ACCESS
 * ============================================================================
 */

export interface Task {
  id: string;
  planting_id: string;
  task_type: "plant" | "irrigate" | "fertilize" | "spray" | "harvest" | "weed";
  scheduled_date: string;
  completed: boolean;
  auto_generated: boolean;
  weather_adjusted?: boolean;
  adjustment_reason?: string;
  created_at: string;
}

export async function saveTask(task: Omit<Task, "id" | "created_at">): Promise<string> {
  const id = `task:${task.planting_id}:${task.task_type}:${Date.now()}`;
  
  const data: Task = {
    id,
    ...task,
    created_at: new Date().toISOString(),
  };

  await kv.set(id, data);
  
  // Index by planting
  const indexKey = `tasks:planting:${task.planting_id}`;
  const existing = (await kv.get(indexKey)) || [];
  await kv.set(indexKey, [...existing, id]);

  return id;
}

export async function getPlantingTasks(planting_id: string): Promise<Task[]> {
  const indexKey = `tasks:planting:${planting_id}`;
  const taskIds = (await kv.get(indexKey)) || [];
  
  const tasks = await Promise.all(
    taskIds.map((id: string) => kv.get(id))
  );
  
  return tasks.filter(Boolean);
}

export async function completeTask(task_id: string): Promise<void> {
  const task = await kv.get(task_id);
  if (task) {
    await kv.set(task_id, { ...task, completed: true });
  }
}

/**
 * ============================================================================
 * INVENTORY DATA ACCESS
 * ============================================================================
 */

export interface InventoryItem {
  id: string;
  farm_id: string;
  crop_id: string;
  quantity: number;
  unit: string;
  source: "harvest" | "purchase";
  ai_notes?: {
    status: "ok" | "low" | "critical";
    variance_analysis?: string;
    suggested_orders?: Array<{
      item: string;
      quantity: number;
      urgency: "low" | "medium" | "high";
      reason: string;
    }>;
  };
  updated_at: string;
}

export async function saveInventoryItem(item: Omit<InventoryItem, "id" | "updated_at">): Promise<string> {
  const id = `inventory:${item.farm_id}:${item.crop_id}`;
  
  // Check if item exists
  const existing = await kv.get(id);
  
  const data: InventoryItem = {
    id,
    ...item,
    updated_at: new Date().toISOString(),
  };

  await kv.set(id, data);
  
  // Index by farm
  const indexKey = `inventory:farm:${item.farm_id}`;
  if (!existing) {
    const inventory = (await kv.get(indexKey)) || [];
    await kv.set(indexKey, [...inventory, id]);
  }

  return id;
}

export async function getFarmInventory(farm_id: string): Promise<InventoryItem[]> {
  const indexKey = `inventory:farm:${farm_id}`;
  const itemIds = (await kv.get(indexKey)) || [];
  
  const items = await Promise.all(
    itemIds.map((id: string) => kv.get(id))
  );
  
  return items.filter(Boolean);
}

/**
 * ============================================================================
 * MARKETPLACE DATA ACCESS
 * ============================================================================
 */

export interface Product {
  id: string;
  farm_id: string;
  crop_id: string;
  unit: string;
  price: number;
  active: boolean;
  ai_pricing_metadata?: {
    recommended_price: number;
    market_confidence: "low" | "medium" | "high";
    rationale: string;
    demand_signal: string;
    generated_at: string;
  };
  created_at: string;
}

export async function saveProduct(product: Omit<Product, "id" | "created_at">): Promise<string> {
  const id = `product:${product.farm_id}:${product.crop_id}`;
  
  const data: Product = {
    id,
    ...product,
    created_at: new Date().toISOString(),
  };

  await kv.set(id, data);
  
  // Index by farm
  const indexKey = `products:farm:${product.farm_id}`;
  const existing = (await kv.get(indexKey)) || [];
  await kv.set(indexKey, [...existing, id]);

  return id;
}

export async function getFarmProducts(farm_id: string): Promise<Product[]> {
  const indexKey = `products:farm:${farm_id}`;
  const productIds = (await kv.get(indexKey)) || [];
  
  const products = await Promise.all(
    productIds.map((id: string) => kv.get(id))
  );
  
  return products.filter(Boolean);
}

/**
 * ============================================================================
 * AI RECOMMENDATIONS DATA ACCESS
 * ============================================================================
 */

export interface AIRecommendation {
  id: string;
  farm_id: string;
  category: "inventory" | "finance" | "weather" | "crop_planning" | "market" | "livestock";
  recommendation: string;
  urgency: "low" | "medium" | "high";
  completed: boolean;
  metadata?: any;
  created_at: string;
}

export async function saveAIRecommendation(rec: Omit<AIRecommendation, "id" | "created_at">): Promise<string> {
  const id = `recommendation:${rec.farm_id}:${Date.now()}`;
  
  const data: AIRecommendation = {
    id,
    ...rec,
    created_at: new Date().toISOString(),
  };

  await kv.set(id, data);
  
  // Index by farm
  const indexKey = `recommendations:farm:${rec.farm_id}`;
  const existing = (await kv.get(indexKey)) || [];
  await kv.set(indexKey, [...existing, id]);

  return id;
}

export async function getFarmRecommendations(farm_id: string, completed = false): Promise<AIRecommendation[]> {
  const indexKey = `recommendations:farm:${farm_id}`;
  const recIds = (await kv.get(indexKey)) || [];
  
  const recs = await Promise.all(
    recIds.map((id: string) => kv.get(id))
  );
  
  return recs.filter(Boolean).filter((rec: AIRecommendation) => rec.completed === completed);
}

/**
 * ============================================================================
 * AI INTERACTIONS DATA ACCESS (Telemetry)
 * ============================================================================
 */

export interface AIInteraction {
  id: string;
  user_id: string;
  context: string;
  input: string;
  output: string;
  confidence_score: number;
  metadata?: any;
  created_at: string;
}

export async function logAIInteraction(interaction: Omit<AIInteraction, "id" | "created_at">): Promise<string> {
  const id = `ai_interaction:${interaction.user_id}:${Date.now()}`;
  
  const data: AIInteraction = {
    id,
    ...interaction,
    created_at: new Date().toISOString(),
  };

  await kv.set(id, data);
  
  // Index by user
  const indexKey = `ai_interactions:user:${interaction.user_id}`;
  const existing = (await kv.get(indexKey)) || [];
  
  // Keep only last 100 interactions per user (to avoid storage bloat)
  const updated = [...existing, id].slice(-100);
  await kv.set(indexKey, updated);

  return id;
}

export async function getUserAIInteractions(user_id: string, limit = 10): Promise<AIInteraction[]> {
  const indexKey = `ai_interactions:user:${user_id}`;
  const interactionIds = (await kv.get(indexKey)) || [];
  
  // Get last N interactions
  const recentIds = interactionIds.slice(-limit);
  
  const interactions = await Promise.all(
    recentIds.map((id: string) => kv.get(id))
  );
  
  return interactions.filter(Boolean).reverse(); // Most recent first
}

/**
 * ============================================================================
 * HELPER FUNCTIONS
 * ============================================================================
 */

/**
 * Get all AI-generated data for a farm (for dashboard display)
 */
export async function getFarmAIDashboard(farm_id: string) {
  const [blueprints, plantings, recommendations, inventory, products] = await Promise.all([
    getFarmBlueprints(farm_id),
    getFarmPlantings(farm_id),
    getFarmRecommendations(farm_id, false), // Only active recommendations
    getFarmInventory(farm_id),
    getFarmProducts(farm_id),
  ]);

  // Get forecasts for all plantings
  const forecasts = await Promise.all(
    plantings.map((p) => getYieldForecast(p.id))
  );

  return {
    blueprints: blueprints.filter((b) => b.created_by === "ai"),
    plantings,
    forecasts: forecasts.filter(Boolean),
    recommendations: recommendations.filter((r) => r.urgency === "high").slice(0, 5),
    inventory: inventory.filter((i) => i.ai_notes?.status === "critical"),
    products: products.filter((p) => p.ai_pricing_metadata),
  };
}

/**
 * Clean up old AI data (maintenance function)
 */
export async function cleanupOldAIData(days = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  // This would need to iterate through all keys
  // Implementation depends on KV store capabilities
  console.log(`Cleanup would remove AI data older than ${cutoffDate.toISOString()}`);
}

/**
 * Export all utilities
 */
export default {
  // Crop Intelligence
  saveCropProfile,
  getCropProfile,
  getAllCropProfiles,
  
  // Crop Blueprints
  saveCropBlueprint,
  getCropBlueprint,
  getFarmBlueprints,
  
  // Crop Planning
  savePlanting,
  saveYieldForecast,
  getPlanting,
  getFarmPlantings,
  getYieldForecast,
  
  // Tasks
  saveTask,
  getPlantingTasks,
  completeTask,
  
  // Inventory
  saveInventoryItem,
  getFarmInventory,
  
  // Marketplace
  saveProduct,
  getFarmProducts,
  
  // AI Recommendations
  saveAIRecommendation,
  getFarmRecommendations,
  
  // AI Interactions
  logAIInteraction,
  getUserAIInteractions,
  
  // Helpers
  getFarmAIDashboard,
  cleanupOldAIData,
};
