/**
 * AI Action Type Registry
 * 
 * CRITICAL: Every button in the app must map to ONE action type
 * No free-form prompts, no chatbot behavior
 */

// ==================== ACTION TYPES ====================

export type AIActionType =
  // Crop Planning
  | "CREATE_CROP_PLAN"
  | "OPTIMIZE_CROP_PLAN"
  | "VIEW_CROP_HISTORY"
  | "GENERATE_YIELD_FORECAST"
  | "UPDATE_SOIL_DATA"
  | "VIEW_COST_BREAKDOWN"
  
  // Market & Pricing
  | "GET_MARKET_PRICE"
  | "VIEW_PRICE_TRENDS"
  | "SET_PRICE_ALERT"
  | "COMPARE_MARKET_PRICES"
  
  // Weather
  | "WEATHER_ALERT_TRIGGER"
  | "GET_WEATHER_FORECAST"
  | "VIEW_CLIMATE_TRENDS"
  
  // Soil & Testing
  | "ANALYZE_SOIL_DATA"
  | "RECOMMEND_AMENDMENTS"
  | "TRACK_SOIL_HEALTH"
  
  // Photo Diagnosis
  | "DIAGNOSE_CROP_IMAGE"
  | "IDENTIFY_PEST"
  | "IDENTIFY_DISEASE"
  
  // AI Chat (Limited)
  | "CHAT_MESSAGE"
  | "GET_QUICK_TIP"
  
  // Analytics
  | "COMPARE_SEASONS"
  | "VIEW_PERFORMANCE_TRENDS"
  | "EXPORT_REPORT";

// ==================== SCREEN STATES ====================

export interface ScreenState {
  screen_id: string;
  allowed_actions: AIActionType[];
  current_context?: any;
}

export const SCREEN_STATES: Record<string, ScreenState> = {
  crop_planning: {
    screen_id: "crop_planning",
    allowed_actions: [
      "CREATE_CROP_PLAN",
      "VIEW_CROP_HISTORY",
      "GENERATE_YIELD_FORECAST"
    ]
  },
  
  crop_plan_detail: {
    screen_id: "crop_plan_detail",
    allowed_actions: [
      "OPTIMIZE_CROP_PLAN",
      "VIEW_HISTORY",
      "UPDATE_SOIL_DATA",
      "GENERATE_YIELD_FORECAST",
      "VIEW_COST_BREAKDOWN"
    ]
  },
  
  crop_plan_history: {
    screen_id: "crop_plan_history",
    allowed_actions: [
      "COMPARE_SEASONS",
      "VIEW_PERFORMANCE_TRENDS",
      "EXPORT_REPORT"
    ]
  },
  
  marketplace: {
    screen_id: "marketplace",
    allowed_actions: [
      "GET_MARKET_PRICE",
      "VIEW_PRICE_TRENDS",
      "SET_PRICE_ALERT",
      "COMPARE_MARKET_PRICES"
    ]
  },
  
  weather: {
    screen_id: "weather",
    allowed_actions: [
      "WEATHER_ALERT_TRIGGER",
      "GET_WEATHER_FORECAST",
      "VIEW_CLIMATE_TRENDS"
    ]
  },
  
  soil_testing: {
    screen_id: "soil_testing",
    allowed_actions: [
      "ANALYZE_SOIL_DATA",
      "RECOMMEND_AMENDMENTS",
      "TRACK_SOIL_HEALTH"
    ]
  },
  
  photo_diagnosis: {
    screen_id: "photo_diagnosis",
    allowed_actions: [
      "DIAGNOSE_CROP_IMAGE",
      "IDENTIFY_PEST",
      "IDENTIFY_DISEASE"
    ]
  },
  
  ai_chat: {
    screen_id: "ai_chat",
    allowed_actions: [
      "CHAT_MESSAGE",
      "GET_QUICK_TIP"
    ]
  }
};

// ==================== GLOBAL STATE ====================

export interface GlobalAIState {
  global_language: "en" | "sw";
  device_type: "web" | "mobile";
  screen_id: string;
  user_role: string;
  user_id: string;
}

// ==================== REQUEST SCHEMA ====================

export interface AIActionRequest {
  action_type: AIActionType;
  screen_id: string;
  input_data: any;
  global_language: "en" | "sw";
  device_type: "web" | "mobile";
  user_role: string;
  user_id: string;
}

// ==================== RESPONSE SCHEMAS ====================

export interface AICard {
  title: string;
  value: string;
  confidence?: "Low" | "Medium" | "High";
  icon?: string;
}

export interface AICalendarEvent {
  event: string;
  start: string;
  end?: string;
  type: "planting" | "fertilization" | "irrigation" | "harvest" | "pest-control";
  ai_generated: boolean;
}

export interface AIRisk {
  risk: string;
  severity: "Low" | "Medium" | "High";
  mitigation?: string;
}

export interface AIActionResponse {
  status: "success" | "error";
  ui_updates?: {
    cards?: AICard[];
    tables?: any[];
    calendar_events?: AICalendarEvent[];
    risks?: AIRisk[];
    charts?: any[];
  };
  data_to_store?: any;
  next_allowed_actions?: AIActionType[];
  error_code?: string;
  message?: string;
}

// ==================== SPECIFIC RESPONSE TYPES ====================

export interface CropPlanResponse extends AIActionResponse {
  data_to_store: {
    crop_plan_id: string;
    seed_variety: string;
    yield_forecast_min: number;
    yield_forecast_max: number;
    planting_window: string;
    estimated_costs: {
      seeds: number;
      fertilizer: number;
      labor: number;
      total: number;
    };
  };
}

export interface MarketPriceResponse extends AIActionResponse {
  data_to_store: {
    crop: string;
    price_tzs_per_kg: number;
    region: string;
    trend: "rising" | "falling" | "stable";
    last_updated: string;
  };
}

export interface SoilAnalysisResponse extends AIActionResponse {
  data_to_store: {
    ph: number;
    nitrogen: "low" | "medium" | "high";
    phosphorus: "low" | "medium" | "high";
    potassium: "low" | "medium" | "high";
    recommendations: Array<{
      amendment: string;
      rate: string;
      cost_tzs: number;
    }>;
  };
}

// ==================== ERROR CODES ====================

export enum AIErrorCode {
  INVALID_SCREEN = "INVALID_SCREEN",
  ACTION_NOT_ALLOWED = "ACTION_NOT_ALLOWED",
  LANGUAGE_CONFLICT = "LANGUAGE_CONFLICT",
  MISSING_REQUIRED_DATA = "MISSING_REQUIRED_DATA",
  AI_SERVICE_ERROR = "AI_SERVICE_ERROR",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"
}

// ==================== ACTION LABELS ====================

export const ACTION_LABELS: Record<AIActionType, { en: string; sw: string }> = {
  CREATE_CROP_PLAN: {
    en: "Create Crop Plan",
    sw: "Unda Mpango wa Mazao"
  },
  OPTIMIZE_CROP_PLAN: {
    en: "Optimize Plan",
    sw: "Boresha Mpango"
  },
  VIEW_CROP_HISTORY: {
    en: "View History",
    sw: "Angalia Historia"
  },
  GENERATE_YIELD_FORECAST: {
    en: "Generate Forecast",
    sw: "Tengeneza Utabiri"
  },
  UPDATE_SOIL_DATA: {
    en: "Update Soil Data",
    sw: "Sasisha Data ya Udongo"
  },
  VIEW_COST_BREAKDOWN: {
    en: "View Costs",
    sw: "Angalia Gharama"
  },
  GET_MARKET_PRICE: {
    en: "Get Price",
    sw: "Pata Bei"
  },
  VIEW_PRICE_TRENDS: {
    en: "View Trends",
    sw: "Angalia Mwelekeo"
  },
  SET_PRICE_ALERT: {
    en: "Set Alert",
    sw: "Weka Tahadhari"
  },
  COMPARE_MARKET_PRICES: {
    en: "Compare Prices",
    sw: "Linganisha Bei"
  },
  WEATHER_ALERT_TRIGGER: {
    en: "Weather Alert",
    sw: "Tahadhari ya Hali ya Hewa"
  },
  GET_WEATHER_FORECAST: {
    en: "Get Forecast",
    sw: "Pata Utabiri"
  },
  VIEW_CLIMATE_TRENDS: {
    en: "Climate Trends",
    sw: "Mwelekeo wa Hali ya Hewa"
  },
  ANALYZE_SOIL_DATA: {
    en: "Analyze Soil",
    sw: "Chambua Udongo"
  },
  RECOMMEND_AMENDMENTS: {
    en: "Get Recommendations",
    sw: "Pata Mapendekezo"
  },
  TRACK_SOIL_HEALTH: {
    en: "Track Health",
    sw: "Fuatilia Afya"
  },
  DIAGNOSE_CROP_IMAGE: {
    en: "Diagnose Crop",
    sw: "Gundua Tatizo"
  },
  IDENTIFY_PEST: {
    en: "Identify Pest",
    sw: "Tambua Wadudu"
  },
  IDENTIFY_DISEASE: {
    en: "Identify Disease",
    sw: "Tambua Ugonjwa"
  },
  CHAT_MESSAGE: {
    en: "Send Message",
    sw: "Tuma Ujumbe"
  },
  GET_QUICK_TIP: {
    en: "Get Tip",
    sw: "Pata Ushauri"
  },
  COMPARE_SEASONS: {
    en: "Compare Seasons",
    sw: "Linganisha Misimu"
  },
  VIEW_PERFORMANCE_TRENDS: {
    en: "Performance Trends",
    sw: "Mwelekeo wa Utendaji"
  },
  EXPORT_REPORT: {
    en: "Export Report",
    sw: "Hamisha Ripoti"
  }
};
