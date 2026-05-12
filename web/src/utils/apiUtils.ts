/**
 * ============================================================================
 * KILIMO API UTILITIES - Centralized API Configuration
 * ============================================================================
 * Ensures all API calls use the correct URL format
 * ============================================================================
 */

import { projectId, publicAnonKey } from "./supabase/info";

// DEBUG: Log the imports
console.log("🔧 [API UTILS] Module imported!");
console.log("🔧 [API UTILS] projectId type:", typeof projectId);
console.log("🔧 [API UTILS] projectId value:", projectId);
console.log("🔧 [API UTILS] publicAnonKey exists:", !!publicAnonKey);

// CRITICAL: Verify we have required values
if (!projectId) {
  console.error("❌ [API UTILS] CRITICAL ERROR: projectId is undefined!");
  throw new Error("projectId is required for API initialization");
}

if (typeof projectId !== "string") {
  console.error("❌ [API UTILS] CRITICAL ERROR: projectId is not a string!", typeof projectId);
  throw new Error(`projectId must be a string, got ${typeof projectId}`);
}

/**
 * Base API URL for all backend endpoints
 * ALWAYS uses https:// and includes /functions/v1
 */
export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

// DEBUG: Verify the constant was set correctly
console.log("✅ [API UTILS] API_BASE_URL successfully set to:", API_BASE_URL);
console.log("✅ [API UTILS] URL Verification:");
console.log("  ✓ Starts with https://:", API_BASE_URL.startsWith("https://"));
console.log("  ✓ Contains /functions/v1:", API_BASE_URL.includes("/functions/v1"));
console.log("  ✓ Contains make-server-ce1844e7:", API_BASE_URL.includes("make-server-ce1844e7"));
console.log("  ✓ Full URL length:", API_BASE_URL.length);

// FINAL CHECK: Ensure no http:// anywhere
if (API_BASE_URL.includes("http://")) {
  console.error("❌ [API UTILS] FATAL: API_BASE_URL contains http:// instead of https://");
  throw new Error("API_BASE_URL must use https://, not http://");
}

console.log("🎉 [API UTILS] Initialization complete!");

/**
 * ============================================================================
 * CORE API FETCH UTILITY
 * ============================================================================
 */

/**
 * Centralized fetch wrapper with logging
 */
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  console.log(`[KILIMO API] ${options.method || "GET"} ${url}`);
  console.log(`[KILIMO API] URL Components:`, {
    protocol: url.startsWith("https://") ? "https" : url.startsWith("http://") ? "http" : "unknown",
    hasProjectId: url.includes(projectId),
    hasFunctionsPath: url.includes("/functions/v1"),
    fullUrl: url
  });

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[KILIMO API] Error ${response.status}:`, errorText);
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * ============================================================================
 * TASKS API
 * ============================================================================
 */

export const TasksAPI = {
  /**
   * Get all tasks for a user
   */
  getTasks: async (userId: string) => {
    return apiFetch(`tasks?userId=${userId}`);
  },

  /**
   * Create a single task
   */
  createTask: async (task: any, userId: string) => {
    return apiFetch("tasks", {
      method: "POST",
      body: JSON.stringify({ ...task, userId }),
    });
  },

  /**
   * Create multiple tasks in batch
   */
  createTasksBatch: async (tasks: any[], userId: string) => {
    return apiFetch("tasks/batch", {
      method: "POST",
      body: JSON.stringify({ tasks, userId }),
    });
  },

  /**
   * Update a task
   */
  updateTask: async (taskId: string, updates: any, userId: string) => {
    return apiFetch(`tasks/${taskId}?userId=${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete a task
   */
  deleteTask: async (taskId: string, userId: string) => {
    return apiFetch(`tasks/${taskId}?userId=${userId}`, {
      method: "DELETE",
    });
  },

  /**
   * Update task status
   */
  updateTaskStatus: async (taskId: string, status: string, userId: string) => {
    return apiFetch(`tasks/${taskId}/status?userId=${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};

/**
 * ============================================================================
 * CROP PLANS API
 * ============================================================================
 */

export const CropPlansAPI = {
  /**
   * Get all crop plans for a user
   */
  getCropPlans: async (userId: string) => {
    return apiFetch(`crop-plans?userId=${userId}`);
  },

  /**
   * Create a new crop plan
   */
  createCropPlan: async (plan: any, userId: string) => {
    return apiFetch("crop-plans", {
      method: "POST",
      body: JSON.stringify({ ...plan, userId }),
    });
  },

  /**
   * Update a crop plan
   */
  updateCropPlan: async (planId: string, updates: any, userId: string) => {
    return apiFetch(`crop-plans/${planId}?userId=${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete a crop plan
   */
  deleteCropPlan: async (planId: string, userId: string) => {
    return apiFetch(`crop-plans/${planId}?userId=${userId}`, {
      method: "DELETE",
    });
  },
};

/**
 * ============================================================================
 * USER PROFILE API
 * ============================================================================
 */

export const UserAPI = {
  /**
   * Get user profile
   */
  getProfile: async (userId: string) => {
    return apiFetch(`profile/${userId}`);
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId: string, updates: any) => {
    return apiFetch(`profile/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },
};

/**
 * ============================================================================
 * WEATHER API
 * ============================================================================
 */

export const WeatherAPI = {
  /**
   * Get current weather
   */
  getCurrentWeather: async (location: string) => {
    return apiFetch(`weather/current?location=${encodeURIComponent(location)}`);
  },

  /**
   * Get weather forecast
   */
  getForecast: async (location: string, days: number = 7) => {
    return apiFetch(`weather/forecast?location=${encodeURIComponent(location)}&days=${days}`);
  },
};

/**
 * ============================================================================
 * AI PROMPTS API
 * ============================================================================
 */

export const AIPromptsAPI = {
  /**
   * Get AI recommendation
   */
  getRecommendation: async (context: any, userId: string) => {
    return apiFetch("ai/recommend", {
      method: "POST",
      body: JSON.stringify({ ...context, userId }),
    });
  },

  /**
   * Chat with AI
   */
  chat: async (message: string, context: any, userId: string) => {
    return apiFetch("ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, context, userId }),
    });
  },
};
