/**
 * ============================================================================
 * KILIMO AGRI-AI SUITE - Feature Gate Helper
 * ============================================================================
 * Purpose: Simple feature gating - NO UI CHANGES
 * Logic: Backend controls visibility, frontend just checks permissions
 * ============================================================================
 */

/**
 * Check if user has access to a specific feature
 * Handles "everything" permission for enterprise users
 * 
 * @param userFeatures - Array of features from backend (role_features table)
 * @param feature - Feature to check access for
 * @returns boolean - true if user has access
 */
export function hasFeature(
  userFeatures: string[] | null | undefined,
  feature: string
): boolean {
  if (!userFeatures || userFeatures.length === 0) {
    return false;
  }

  // Enterprise users with "everything" have access to all features
  if (userFeatures.includes("everything")) {
    return true;
  }

  // Check for specific feature
  return userFeatures.includes(feature);
}

/**
 * Check if user has ANY of the specified features
 * Useful for checking multiple permission levels
 * 
 * @param userFeatures - Array of features from backend
 * @param features - Array of features to check (OR logic)
 * @returns boolean - true if user has ANY of the features
 */
export function hasAnyFeature(
  userFeatures: string[] | null | undefined,
  features: string[]
): boolean {
  if (!userFeatures || userFeatures.length === 0) {
    return false;
  }

  if (userFeatures.includes("everything")) {
    return true;
  }

  return features.some((feature) => userFeatures.includes(feature));
}

/**
 * Check if user has ALL of the specified features
 * Useful for complex permission requirements
 * 
 * @param userFeatures - Array of features from backend
 * @param features - Array of features to check (AND logic)
 * @returns boolean - true if user has ALL of the features
 */
export function hasAllFeatures(
  userFeatures: string[] | null | undefined,
  features: string[]
): boolean {
  if (!userFeatures || userFeatures.length === 0) {
    return false;
  }

  if (userFeatures.includes("everything")) {
    return true;
  }

  return features.every((feature) => userFeatures.includes(feature));
}

/**
 * Filter a list of items based on required features
 * Returns only items the user has permission to see
 * 
 * @param items - Array of items with requiredFeature property
 * @param userFeatures - Array of features from backend
 * @returns Filtered array of items
 */
export function filterByFeatures<T extends { requiredFeature?: string }>(
  items: T[],
  userFeatures: string[] | null | undefined
): T[] {
  if (!userFeatures || userFeatures.length === 0) {
    return [];
  }

  if (userFeatures.includes("everything")) {
    return items;
  }

  return items.filter((item) => {
    if (!item.requiredFeature) {
      return true; // No feature requirement = always visible
    }
    return userFeatures.includes(item.requiredFeature);
  });
}

/**
 * Get display name for a feature
 * Used for upgrade prompts and feature descriptions
 */
export function getFeatureDisplayName(feature: string): string {
  const featureNames: Record<string, string> = {
    // Core Features
    crop_planning: "Crop Planning",
    yield_forecast: "Yield Forecast",
    soil_health: "Soil Health Tracking",
    livestock_monitor: "Livestock Monitor",
    livestock_management: "Livestock Management",
    
    // AI Features
    ai_chat: "AI Chat (Sankofa)",
    voice_ai: "Voice AI",
    ai_recommendations: "AI Recommendations",
    
    // Management Features
    task_management: "Task Management",
    team_management: "Team Management",
    inventory: "Inventory Management",
    member_management: "Member Management",
    
    // Advanced Features
    digital_farm_twin: "Digital Farm Twin",
    farm_graph_dashboard: "Farm Graph Dashboard",
    analytics_dashboard: "Analytics Dashboard",
    agribusiness_dashboard: "Agribusiness Dashboard",
    cooperative_dashboard: "Cooperative Dashboard",
    
    // Financial Features
    finance: "Finance Management",
    contract_farming: "Contract Farming",
    mobile_money: "Mobile Money",
    insurance: "Insurance",
    expense_tracking: "Expense Tracking",
    
    // Marketplace Features
    marketplace: "Marketplace",
    input_supply: "Input Supply",
    group_sales: "Group Sales",
    
    // Communication Features
    sms_alerts: "SMS Alerts",
    sms_broadcast: "SMS Broadcast",
    
    // Extension Features
    extension_tools: "Extension Tools",
    farmer_lab: "Farmer Lab",
    impact_reports: "Impact Reports",
    training_modules: "Training Modules",
    
    // Other Features
    weather: "Weather Forecasts",
    calendar: "Calendar",
    market_prices: "Market Prices",
    field_notes: "Field Notes",
    family_farm_planner: "Family Farm Planner",
    enterprise_reports: "Enterprise Reports",
    export_management: "Export Management",
    quality_control: "Quality Control",
    supply_chain: "Supply Chain",
    procurement: "Procurement",
  };

  return featureNames[feature] || feature.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Get recommended upgrade role for a feature
 */
export function getFeatureUpgradeRole(feature: string): string | null {
  const upgradeMap: Record<string, string> = {
    // Features that require Farmer Manager or higher
    task_management: "farmer_manager",
    digital_farm_twin: "farmer_manager",
    farm_graph_dashboard: "farmer_manager",
    
    // Features that require Farm Manager
    team_management: "farm_manager",
    analytics_dashboard: "farm_manager",
    
    // Features that require Commercial Admin
    finance: "commercial_farm_admin",
    contract_farming: "commercial_farm_admin",
    enterprise_reports: "commercial_farm_admin",
    export_management: "commercial_farm_admin",
    
    // Features specific to other roles
    agribusiness_dashboard: "agribusiness_ops",
    cooperative_dashboard: "cooperative_leader",
    extension_tools: "extension_officer",
    farmer_lab: "extension_officer",
  };

  return upgradeMap[feature] || null;
}

/**
 * Usage Examples:
 * 
 * // Basic feature check
 * {hasFeature(user.features, "crop_planning") && <CropPlanning />}
 * 
 * // Check multiple features (OR)
 * {hasAnyFeature(user.features, ["ai_chat", "voice_ai"]) && <AIAssistant />}
 * 
 * // Check multiple features (AND)
 * {hasAllFeatures(user.features, ["finance", "analytics_dashboard"]) && <FinancialDashboard />}
 * 
 * // Filter navigation items
 * const visibleNavItems = filterByFeatures(allNavItems, user.features);
 * 
 * // Show upgrade prompt
 * if (!hasFeature(user.features, "analytics_dashboard")) {
 *   const upgradeRole = getFeatureUpgradeRole("analytics_dashboard");
 *   // Show upgrade modal
 * }
 */

export default {
  hasFeature,
  hasAnyFeature,
  hasAllFeatures,
  filterByFeatures,
  getFeatureDisplayName,
  getFeatureUpgradeRole,
};
