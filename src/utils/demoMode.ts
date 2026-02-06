/**
 * KILIMO Demo Mode State Management
 * Pre-Authentication Feature Control System
 * 
 * CRITICAL RULES:
 * - Session-scoped only (no backend writes)
 * - Virtual feature overrides (no production changes)
 * - Reversible and resettable
 * - JSON output contract
 */

import { FeatureId } from "./roleBasedAccess";

export interface DemoModeState {
  active_role: string;
  enabled_features: FeatureId[];
  ai_profile: {
    verbosity: "low" | "medium" | "high";
    tone: "advisory" | "operational" | "strategic";
    riskTolerance: number;
    temperature: number;
    maxTokens: number;
  };
  language: "en" | "sw";
  mock_data: {
    loaded: boolean;
    userId: string;
    farmData: any;
    timestamp: string;
  };
  ui_status: "valid" | "warning" | "error";
  issues_detected: string[];
  session_id: string;
  timestamp: string;
}

const DEMO_MODE_KEY = "kilimo_demo_mode_state";
const DEMO_MODE_ACTIVE_KEY = "kilimo_demo_mode_active";

/**
 * Check if Demo Mode is currently active
 */
export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(DEMO_MODE_ACTIVE_KEY) === "true";
}

/**
 * Initialize Demo Mode with default state
 */
export function initializeDemoMode(): DemoModeState {
  const initialState: DemoModeState = {
    active_role: "smallholder_farmer",
    enabled_features: [],
    ai_profile: {
      verbosity: "medium",
      tone: "advisory",
      riskTolerance: 0.5,
      temperature: 0.7,
      maxTokens: 500,
    },
    language: "en",
    mock_data: {
      loaded: false,
      userId: `demo-user-${Date.now()}`,
      farmData: null,
      timestamp: new Date().toISOString(),
    },
    ui_status: "valid",
    issues_detected: [],
    session_id: `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };

  sessionStorage.setItem(DEMO_MODE_ACTIVE_KEY, "true");
  sessionStorage.setItem(DEMO_MODE_KEY, JSON.stringify(initialState));
  
  return initialState;
}

/**
 * Get current Demo Mode state
 */
export function getDemoModeState(): DemoModeState | null {
  if (!isDemoMode()) return null;
  
  const stateStr = sessionStorage.getItem(DEMO_MODE_KEY);
  if (!stateStr) return null;
  
  try {
    return JSON.parse(stateStr);
  } catch (error) {
    console.error("Failed to parse demo mode state:", error);
    return null;
  }
}

/**
 * Update Demo Mode state
 */
export function updateDemoModeState(updates: Partial<DemoModeState>): DemoModeState {
  const currentState = getDemoModeState() || initializeDemoMode();
  
  const newState: DemoModeState = {
    ...currentState,
    ...updates,
    timestamp: new Date().toISOString(),
  };
  
  sessionStorage.setItem(DEMO_MODE_KEY, JSON.stringify(newState));
  
  // Dispatch custom event for reactive components
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("demo-mode-update", { detail: newState }));
  }
  
  return newState;
}

/**
 * Set active role in Demo Mode
 */
export function setDemoRole(role: string): DemoModeState {
  return updateDemoModeState({ active_role: role });
}

/**
 * Toggle a feature in Demo Mode
 */
export function toggleDemoFeature(feature: FeatureId): DemoModeState {
  const state = getDemoModeState() || initializeDemoMode();
  const enabled = state.enabled_features;
  
  const newFeatures = enabled.includes(feature)
    ? enabled.filter(f => f !== feature)
    : [...enabled, feature];
  
  return updateDemoModeState({ enabled_features: newFeatures });
}

/**
 * Enable multiple features at once
 */
export function setDemoFeatures(features: FeatureId[]): DemoModeState {
  return updateDemoModeState({ enabled_features: features });
}

/**
 * Set Demo Mode language
 */
export function setDemoLanguage(language: "en" | "sw"): DemoModeState {
  return updateDemoModeState({ language });
}

/**
 * Update AI profile settings
 */
export function updateDemoAIProfile(
  profile: Partial<DemoModeState["ai_profile"]>
): DemoModeState {
  const state = getDemoModeState() || initializeDemoMode();
  return updateDemoModeState({
    ai_profile: {
      ...state.ai_profile,
      ...profile,
    },
  });
}

/**
 * Load mock data into Demo Mode
 */
export function loadDemoMockData(farmData: any): DemoModeState {
  return updateDemoModeState({
    mock_data: {
      loaded: true,
      userId: `demo-user-${Date.now()}`,
      farmData,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Reset Demo Mode to initial state
 */
export function resetDemoMode(): DemoModeState {
  const newState = initializeDemoMode();
  
  // Dispatch reset event
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("demo-mode-reset", { detail: newState }));
  }
  
  return newState;
}

/**
 * Exit Demo Mode and clear all state
 */
export function exitDemoMode(): void {
  sessionStorage.removeItem(DEMO_MODE_KEY);
  sessionStorage.removeItem(DEMO_MODE_ACTIVE_KEY);
  
  // Dispatch exit event
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("demo-mode-exit"));
  }
}

/**
 * Export Demo Mode state as JSON
 */
export function exportDemoModeConfig(): string {
  const state = getDemoModeState();
  if (!state) return "{}";
  
  return JSON.stringify(state, null, 2);
}

/**
 * Import Demo Mode state from JSON
 */
export function importDemoModeConfig(jsonConfig: string): DemoModeState | null {
  try {
    const config = JSON.parse(jsonConfig);
    
    // Validate structure
    if (!config.active_role || !config.language) {
      throw new Error("Invalid config structure");
    }
    
    // Update session_id and timestamp
    config.session_id = `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    config.timestamp = new Date().toISOString();
    
    sessionStorage.setItem(DEMO_MODE_KEY, JSON.stringify(config));
    sessionStorage.setItem(DEMO_MODE_ACTIVE_KEY, "true");
    
    return config;
  } catch (error) {
    console.error("Failed to import demo config:", error);
    return null;
  }
}

/**
 * Get enabled features for current demo role
 */
export function getDemoEnabledFeatures(): FeatureId[] {
  const state = getDemoModeState();
  if (!state) return [];
  return state.enabled_features;
}

/**
 * Virtual feature gate override for Demo Mode
 * Wraps the real hasFeatureAccess function
 */
export function demoModeFeatureAccess(
  role: string,
  feature: FeatureId,
  realAccessCheck: (role: string, feature: FeatureId) => boolean
): boolean {
  if (!isDemoMode()) {
    return realAccessCheck(role, feature);
  }
  
  const state = getDemoModeState();
  if (!state) return false;
  
  return state.enabled_features.includes(feature);
}

/**
 * Get demo user data
 */
export function getDemoUser(): any {
  const state = getDemoModeState();
  if (!state || !state.mock_data.loaded) return null;
  
  return {
    id: state.mock_data.userId,
    role: state.active_role,
    language: state.language,
    ...state.mock_data.farmData?.user,
  };
}

/**
 * Validate UI integrity (branding, spacing, typography)
 */
export function validateDemoUI(): { status: string; issues: string[] } {
  const issues: string[] = [];
  
  // Check for common UI issues
  if (typeof document !== "undefined") {
    // Check for missing CREOVA colors
    const elements = document.querySelectorAll("[class*='bg-'], [class*='text-']");
    let hasDeepGreen = false;
    let hasEarthBrown = false;
    
    elements.forEach((el) => {
      const classes = el.className;
      if (classes.includes("green-900") || classes.includes("green-800")) {
        hasDeepGreen = true;
      }
      if (classes.includes("stone-700") || classes.includes("stone-800")) {
        hasEarthBrown = true;
      }
    });
    
    if (!hasDeepGreen) {
      issues.push("Missing Deep Green (#0F3D2E) branding color");
    }
    
    // Check for typography consistency
    const headings = document.querySelectorAll("h1, h2, h3");
    if (headings.length === 0) {
      issues.push("No heading elements found");
    }
  }
  
  const status = issues.length === 0 ? "valid" : issues.length > 5 ? "error" : "warning";
  
  // Update state
  updateDemoModeState({ ui_status: status, issues_detected: issues });
  
  return { status, issues };
}

/**
 * Log demo mode action (for audit trail)
 */
export function logDemoAction(action: string, details?: any): void {
  const state = getDemoModeState();
  if (!state) return;
  
  const logEntry = {
    timestamp: new Date().toISOString(),
    session_id: state.session_id,
    action,
    details,
  };
  
  console.log("[DEMO MODE]", logEntry);
  
  // Could store in sessionStorage for export if needed
  const logsKey = "kilimo_demo_logs";
  const existingLogs = sessionStorage.getItem(logsKey);
  const logs = existingLogs ? JSON.parse(existingLogs) : [];
  logs.push(logEntry);
  
  // Keep only last 100 logs
  if (logs.length > 100) {
    logs.shift();
  }
  
  sessionStorage.setItem(logsKey, JSON.stringify(logs));
}
