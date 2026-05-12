/**
 * ============================================================================
 * KILIMO AGRI-AI SUITE - Frontend AI Feature Integration
 * ============================================================================
 * Easy-to-use utilities for integrating AI into any feature
 * Philosophy: "AI must feel helpful, not loud"
 * Principle: "Farmers are task-driven, not feature-driven"
 * ============================================================================
 */

import { projectId, publicAnonKey } from "./supabase/info";

/**
 * AI Feature Types
 */
export type AIFeature =
  | "crop_intelligence"
  | "farming_templates"
  | "crop_planning"
  | "yield_revenue"
  | "inventory"
  | "marketplace"
  | "finance"
  | "livestock"
  | "unified_advisor"
  | "weather_advice";

/**
 * AI Response Interface
 */
export interface AIResponse {
  success: boolean;
  role?: string;
  feature: string;
  language: string;
  response: any;
  timestamp: string;
  error?: string;
  message?: string;
}

/**
 * Main function to call AI for any feature
 */
export async function getAIAdvice(
  feature: AIFeature,
  context: any,
  query?: string,
  language: "EN" | "SW" = "EN"
): Promise<AIResponse> {
  try {
    const role = localStorage.getItem("userRole") || "smallholder_farmer";

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/ai/engine`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          role,
          feature,
          language,
          context,
          query: query || "",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "AI request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("AI Feature Integration Error:", error);
    return {
      success: false,
      feature,
      language,
      response: null,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * ============================================================================
 * FEATURE-SPECIFIC HELPERS
 * ============================================================================
 */

/**
 * 1. Crop Intelligence AI
 */
export async function getCropIntelligenceAdvice(data: {
  crop_name?: string;
  variety?: string;
  region?: string;
  season?: string;
  previous_yields?: number[];
  language?: "EN" | "SW";
}) {
  return getAIAdvice("crop_intelligence", data, undefined, data.language);
}

/**
 * 2. Farming Templates AI
 */
export async function getFarmingTemplateAdvice(data: {
  crop?: string;
  practice_type?: "rainfed" | "irrigated";
  soil_type?: string;
  inputs_available?: string[];
  labor_level?: "low" | "medium" | "high";
  language?: "EN" | "SW";
}) {
  return getAIAdvice("farming_templates", data, undefined, data.language);
}

/**
 * 3. Crop Planning AI
 */
export async function getCropPlanningAdvice(data: {
  plots?: Array<{ name: string; size_acres: number }>;
  selected_template?: string;
  season_window?: string;
  goal?: "yield" | "revenue" | "subsistence";
  language?: "EN" | "SW";
}) {
  return getAIAdvice("crop_planning", data, undefined, data.language);
}

/**
 * 4. Yield & Revenue Forecasting AI
 */
export async function getYieldRevenueAdvice(data: {
  crop_plan?: Array<{ crop: string; acres: number }>;
  market_prices?: { [crop: string]: number };
  confidence_preference?: "safe" | "balanced" | "optimistic";
  language?: "EN" | "SW";
}) {
  return getAIAdvice("yield_revenue", data, undefined, data.language);
}

/**
 * 5. Inventory AI
 */
export async function getInventoryAdvice(data: {
  harvested_amount?: number;
  planned_amount?: number;
  current_stock?: { [item: string]: number };
  language?: "EN" | "SW";
}) {
  return getAIAdvice("inventory", data, undefined, data.language);
}

/**
 * 6. Marketplace AI
 */
export async function getMarketplaceAdvice(data: {
  inventory?: Array<{ product: string; quantity: number; quality: string }>;
  price_preferences?: string;
  sales_channels?: string[];
  language?: "EN" | "SW";
}) {
  return getAIAdvice("marketplace", data, undefined, data.language);
}

/**
 * 7. Finance AI
 */
export async function getFinanceAdvice(data: {
  transactions?: Array<{
    date: string;
    type: "income" | "expense";
    amount: number;
    category: string;
  }>;
  wallet_balance?: number;
  pending_payments?: number;
  language?: "EN" | "SW";
}) {
  return getAIAdvice("finance", data, undefined, data.language);
}

/**
 * 8. Livestock AI
 */
export async function getLivestockAdvice(data: {
  animal_type?: string;
  symptoms?: string[];
  environment?: string;
  language?: "EN" | "SW";
}) {
  return getAIAdvice("livestock", data, undefined, data.language);
}

/**
 * 9. Unified Advisor AI
 */
export async function getUnifiedAdvice(data: {
  recent_activity?: string[];
  weather?: {
    condition: string;
    temperature: number;
    rainfall: number;
  };
  market_trends?: string[];
  language?: "EN" | "SW";
  query?: string;
}) {
  return getAIAdvice(
    "unified_advisor",
    data,
    data.query || "Provide insights based on context",
    data.language
  );
}

/**
 * 10. Weather Advice AI
 */
export async function getWeatherAdvice(data: {
  weather_forecast?: Array<{
    date: string;
    condition: string;
    rainfall: number;
  }>;
  current_crops?: string[];
  upcoming_tasks?: string[];
  language?: "EN" | "SW";
}) {
  return getAIAdvice("weather_advice", data, undefined, data.language);
}

/**
 * ============================================================================
 * UX HELPER COMPONENTS
 * ============================================================================
 */

/**
 * AI Loading State Helper
 */
export function createAILoadingMessage(
  feature: AIFeature,
  language: "EN" | "SW" = "EN"
): string {
  const messages = {
    EN: {
      crop_intelligence: "AI is analyzing crop data...",
      farming_templates: "AI is creating farming template...",
      crop_planning: "AI is optimizing crop plan...",
      yield_revenue: "AI is forecasting yields...",
      inventory: "AI is checking inventory...",
      marketplace: "AI is analyzing market conditions...",
      finance: "AI is reviewing finances...",
      livestock: "AI is assessing livestock health...",
      unified_advisor: "AI is gathering insights...",
      weather_advice: "AI is analyzing weather patterns...",
    },
    SW: {
      crop_intelligence: "AI inachanganua data ya mazao...",
      farming_templates: "AI inaunda kiolezo cha kilimo...",
      crop_planning: "AI inaboresha mpango wa mazao...",
      yield_revenue: "AI inatabiri mavuno...",
      inventory: "AI inakagua hesabu...",
      marketplace: "AI inachanganua hali ya soko...",
      finance: "AI inakagua fedha...",
      livestock: "AI inatathmini afya ya mifugo...",
      unified_advisor: "AI inakusanya maarifa...",
      weather_advice: "AI inachanganua mifumo ya hali ya hewa...",
    },
  };

  return messages[language][feature];
}

/**
 * AI Error Message Helper
 */
export function createAIErrorMessage(
  error: string,
  language: "EN" | "SW" = "EN"
): string {
  const messages = {
    EN: {
      network:
        "Unable to connect to AI. Please check your internet connection.",
      timeout: "AI is taking longer than expected. Please try again.",
      generic: "AI advice temporarily unavailable. You can continue manually.",
      quota: "AI quota exceeded. Please contact support or try again later.",
    },
    SW: {
      network:
        "Imeshindwa kuunganisha na AI. Tafadhali kagua muunganisho wako wa mtandao.",
      timeout: "AI inachukua muda mrefu kuliko ilivyotarajiwa. Tafadhali jaribu tena.",
      generic:
        "Ushauri wa AI haupatikani kwa muda. Unaweza kuendelea kwa mikono.",
      quota:
        "Kipimo cha AI kimezidiwa. Tafadhali wasiliana na msaada au jaribu baadaye.",
    },
  };

  if (error.includes("network") || error.includes("fetch")) {
    return messages[language].network;
  }
  if (error.includes("timeout")) {
    return messages[language].timeout;
  }
  if (error.includes("quota") || error.includes("402")) {
    return messages[language].quota;
  }
  return messages[language].generic;
}

/**
 * Parse AI Confidence Level
 */
export function parseConfidenceLevel(
  confidence: "low" | "medium" | "high",
  language: "EN" | "SW" = "EN"
): {
  label: string;
  color: string;
  description: string;
} {
  const confidenceLevels = {
    EN: {
      low: {
        label: "Low Confidence",
        color: "#F59E0B", // Orange for caution
        description: "AI suggests verifying this with local experts",
      },
      medium: {
        label: "Medium Confidence",
        color: "#2E7D32", // Raspberry Leaf Green - brand color
        description: "AI is reasonably confident based on available data",
      },
      high: {
        label: "High Confidence",
        color: "#2E7D32", // Raspberry Leaf Green - brand color
        description: "AI is very confident based on extensive data",
      },
    },
    SW: {
      low: {
        label: "Imani Ndogo",
        color: "#F59E0B",
        description: "AI inapendekeza kuthibitisha na wataalamu wa ndani",
      },
      medium: {
        label: "Imani ya Kati",
        color: "#2E7D32",
        description: "AI ina imani ya kiasi kulingana na data iliyopo",
      },
      high: {
        label: "Imani Kubwa",
        color: "#2E7D32",
        description: "AI ina imani kubwa kulingana na data nyingi",
      },
    },
  };

  return confidenceLevels[language][confidence];
}

/**
 * Format AI Response for Display
 */
export function formatAIResponse(
  response: AIResponse,
  language: "EN" | "SW" = "EN"
): {
  success: boolean;
  title: string;
  content: any;
  timestamp: string;
  error?: string;
} {
  if (!response.success) {
    return {
      success: false,
      title: language === "EN" ? "AI Unavailable" : "AI Haipatikani",
      content: createAIErrorMessage(response.error || "", language),
      timestamp: response.timestamp,
      error: response.error,
    };
  }

  return {
    success: true,
    title: language === "EN" ? "AI Insights" : "Maarifa ya AI",
    content: response.response,
    timestamp: response.timestamp,
  };
}

/**
 * ============================================================================
 * REACT HOOK FOR AI INTEGRATION
 * ============================================================================
 */

/**
 * Hook state interface
 */
export interface UseAIState {
  loading: boolean;
  response: AIResponse | null;
  error: string | null;
}

/**
 * Simple state manager for AI calls (works with React hooks)
 */
export class AIStateManager {
  private listeners: Set<(state: UseAIState) => void> = new Set();
  private state: UseAIState = {
    loading: false,
    response: null,
    error: null,
  };

  subscribe(listener: (state: UseAIState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  async callAI(feature: AIFeature, context: any, query?: string, language?: "EN" | "SW") {
    this.state = { loading: true, response: null, error: null };
    this.notify();

    try {
      const response = await getAIAdvice(feature, context, query, language);
      
      if (!response.success) {
        this.state = {
          loading: false,
          response: null,
          error: response.error || "AI request failed",
        };
      } else {
        this.state = {
          loading: false,
          response,
          error: null,
        };
      }
    } catch (error) {
      this.state = {
        loading: false,
        response: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    this.notify();
  }

  getState(): UseAIState {
    return this.state;
  }
}

/**
 * ============================================================================
 * EXPORT ALL
 * ============================================================================
 */

export default {
  getAIAdvice,
  getCropIntelligenceAdvice,
  getFarmingTemplateAdvice,
  getCropPlanningAdvice,
  getYieldRevenueAdvice,
  getInventoryAdvice,
  getMarketplaceAdvice,
  getFinanceAdvice,
  getLivestockAdvice,
  getUnifiedAdvice,
  getWeatherAdvice,
  createAILoadingMessage,
  createAIErrorMessage,
  parseConfidenceLevel,
  formatAIResponse,
  AIStateManager,
};
