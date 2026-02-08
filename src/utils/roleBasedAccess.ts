/**
 * Role-Based Feature Access Control System
 * Maps user roles to their allowed features
 */

export type UserRole =
  | "smallholder_farmer"
  | "farmer"
  | "commercial_farmer"  // Added: Commercial farmer role
  | "farm_manager"
  | "commercial_farm_admin"
  | "agribusiness_ops"
  | "extension_officer"
  | "cooperative_leader";

export type FeatureId =
  // Main
  | "home"
  | "workflows"
  // AI Tools
  | "ai-chat"
  | "diagnosis"
  | "voice"
  | "ai-recommendations"
  | "ai-training"
  | "ai-insights"
  // Farm Management
  | "tasks"
  | "crop-planning"
  | "crop-planning-ai"
  | "crop-dashboard"
  | "livestock"
  | "livestock-health"
  | "farm-mapping"
  | "land-allocation"
  | "inventory"
  | "family-planner"
  | "farmer-lab"
  | "digital-twin"
  | "farm-graph"
  // Market & Sales
  | "market"
  | "marketplace"
  | "agribusiness"
  | "orders"
  // Finance
  | "finance"
  | "mobile-money"
  | "wallet-admin"
  | "insurance"
  | "contracts"
  | "input-supply"
  // Services
  | "experts"
  | "soil-test"
  | "weather"
  | "agro-id"
  // Insights
  | "analytics"
  | "reports"
  | "predictive"
  | "crop-tips"
  // Learning
  | "knowledge"
  | "videos"
  | "training"
  // Community
  | "discussions"
  | "cooperative"
  // Admin
  | "extension"
  | "institutional"
  | "gamification"
  | "diagnostics"
  // Help
  | "support"
  | "contact"
  | "faq"
  | "privacy";

/**
 * Feature Access Matrix
 * Defines which features each role can access
 */
export const ROLE_FEATURES: Record<UserRole, FeatureId[]> = {
  /**
   * SMALLHOLDER FARMER (0-5 acres)
   * Focus: Basic farming, AI advisory, marketplace
   */
  smallholder_farmer: [
    // Main
    "home",
    "workflows",
    // AI Tools
    "ai-chat",
    "diagnosis",
    "voice",
    "ai-recommendations",
    "ai-training",
    // Farm Management
    "crop-planning",
    "crop-planning-ai",
    "crop-dashboard",
    "livestock",
    "livestock-health",
    "family-planner",
    "farmer-lab",
    // Market & Sales
    "market",
    "marketplace",
    // Finance
    "mobile-money",
    "insurance",
    "contracts",
    "input-supply",
    // Services
    "experts",
    "soil-test",
    "weather",
    // Insights
    "crop-tips",
    // Learning
    "knowledge",
    "videos",
    "training",
    // Community
    "discussions",
    // Help
    "support",
    "contact",
    "faq",
    "privacy",
    "gamification",
  ],

  /**
   * FARMER (5+ acres, independent)
   * Focus: Smallholder + some advanced planning
   */
  farmer: [
    // All smallholder features
    "home",
    "workflows",
    "ai-chat",
    "diagnosis",
    "voice",
    "ai-recommendations",
    "ai-training",
    "ai-insights",
    "crop-planning",
    "crop-planning-ai",
    "crop-dashboard",
    "livestock",
    "livestock-health",
    "family-planner",
    "farmer-lab",
    "farm-graph", // Added for larger farms
    "market",
    "marketplace",
    "finance", // Added
    "mobile-money",
    "insurance",
    "contracts",
    "input-supply",
    "experts",
    "soil-test",
    "weather",
    "crop-tips",
    "knowledge",
    "videos",
    "training",
    "discussions",
    "support",
    "contact",
    "faq",
    "privacy",
    "gamification",
  ],

  /**
   * COMMERCIAL FARMER (5+ acres, independent)
   * Focus: Smallholder + some advanced planning
   */
  commercial_farmer: [
    // All smallholder features
    "home",
    "workflows",
    "ai-chat",
    "diagnosis",
    "voice",
    "ai-recommendations",
    "ai-training",
    "ai-insights",
    "crop-planning",
    "crop-planning-ai",
    "crop-dashboard",
    "livestock",
    "livestock-health",
    "family-planner",
    "farmer-lab",
    "farm-graph", // Added for larger farms
    "market",
    "marketplace",
    "finance", // Added
    "mobile-money",
    "insurance",
    "contracts",
    "input-supply",
    "experts",
    "soil-test",
    "weather",
    "crop-tips",
    "knowledge",
    "videos",
    "training",
    "discussions",
    "support",
    "contact",
    "faq",
    "privacy",
    "gamification",
  ],

  /**
   * FARM MANAGER (Multi-field, multi-team)
   * Focus: Task management, team coordination, analytics
   */
  farm_manager: [
    // All farmer features +
    "home",
    "workflows",
    "ai-chat",
    "diagnosis",
    "voice",
    "ai-recommendations",
    "ai-training",
    "ai-insights",
    "tasks", // Added
    "crop-planning",
    "crop-planning-ai",
    "crop-dashboard",
    "livestock",
    "livestock-health",
    "farm-mapping", // Added
    "land-allocation", // Added
    "inventory", // Added
    "family-planner",
    "farmer-lab",
    "digital-twin", // Added
    "farm-graph",
    "market",
    "marketplace",
    "finance",
    "mobile-money",
    "insurance",
    "contracts",
    "input-supply",
    "experts",
    "soil-test",
    "weather",
    "analytics", // Added
    "reports", // Added
    "predictive", // Added
    "crop-tips",
    "knowledge",
    "videos",
    "training",
    "discussions",
    "support",
    "contact",
    "faq",
    "privacy",
    "gamification",
  ],

  /**
   * COMMERCIAL FARM ADMIN (Enterprise-level)
   * Focus: Multi-farm management, enterprise reporting, agribusiness
   */
  commercial_farm_admin: [
    // All farm manager features +
    "home",
    "workflows",
    "ai-chat",
    "diagnosis",
    "voice",
    "ai-recommendations",
    "ai-training",
    "ai-insights",
    "tasks",
    "crop-planning",
    "crop-planning-ai",
    "crop-dashboard",
    "livestock",
    "livestock-health",
    "farm-mapping",
    "land-allocation",
    "inventory",
    "family-planner",
    "farmer-lab",
    "digital-twin",
    "farm-graph",
    "market",
    "marketplace",
    "agribusiness", // Added
    "orders", // Added
    "finance",
    "mobile-money",
    "wallet-admin", // Added - Admin-only wallet management
    "insurance",
    "contracts",
    "input-supply",
    "experts",
    "soil-test",
    "weather",
    "agro-id", // Added
    "analytics",
    "reports",
    "predictive",
    "crop-tips",
    "knowledge",
    "videos",
    "training",
    "discussions",
    "institutional", // Added
    "support",
    "contact",
    "faq",
    "privacy",
    "gamification",
    "diagnostics", // Added
  ],

  /**
   * AGRIBUSINESS OPERATIONS (Buyer/Supplier)
   * Focus: Marketplace, farmer network, procurement
   */
  agribusiness_ops: [
    "home",
    "workflows",
    "ai-chat",
    "ai-recommendations",
    "ai-insights",
    "market",
    "marketplace",
    "agribusiness",
    "orders",
    "finance",
    "mobile-money",
    "wallet-admin", // Added - Admin-only wallet management
    "contracts",
    "input-supply",
    "weather",
    "analytics",
    "reports",
    "predictive",
    "knowledge",
    "videos",
    "institutional",
    "support",
    "contact",
    "faq",
    "privacy",
    "diagnostics",
  ],

  /**
   * EXTENSION OFFICER / NGO (External advisor)
   * Focus: Farmer monitoring, training, impact assessment
   */
  extension_officer: [
    "home",
    "workflows",
    "ai-chat",
    "diagnosis",
    "ai-recommendations",
    "ai-training",
    "ai-insights",
    "crop-planning",
    "crop-dashboard",
    "livestock",
    "farmer-lab",
    "market",
    "weather",
    "analytics",
    "reports",
    "crop-tips",
    "knowledge",
    "videos",
    "training",
    "discussions",
    "cooperative",
    "extension", // Primary feature
    "institutional",
    "support",
    "contact",
    "faq",
    "privacy",
  ],

  /**
   * COOPERATIVE LEADER (Multi-farmer management)
   * Focus: Member management, group sales, aggregation
   */
  cooperative_leader: [
    "home",
    "workflows",
    "ai-chat",
    "diagnosis",
    "voice",
    "ai-recommendations",
    "ai-training",
    "crop-planning",
    "crop-dashboard",
    "livestock",
    "farmer-lab",
    "market",
    "marketplace",
    "finance",
    "mobile-money",
    "contracts",
    "weather",
    "analytics",
    "reports",
    "crop-tips",
    "knowledge",
    "videos",
    "training",
    "discussions",
    "cooperative", // Primary feature
    "support",
    "contact",
    "faq",
    "privacy",
  ],
};

/**
 * Check if a user role has access to a specific feature
 */
export function hasFeatureAccess(
  userRole: UserRole | string,
  featureId: FeatureId
): boolean {
  // Default to smallholder_farmer if role is unknown
  const role = (userRole as UserRole) || "smallholder_farmer";
  
  // Check if role exists in matrix
  if (!ROLE_FEATURES[role]) {
    console.warn(`Unknown role: ${role}, defaulting to smallholder_farmer`);
    return ROLE_FEATURES.smallholder_farmer.includes(featureId);
  }

  return ROLE_FEATURES[role].includes(featureId);
}

/**
 * Get all features accessible by a user role
 */
export function getRoleFeatures(userRole: UserRole | string): FeatureId[] {
  const role = (userRole as UserRole) || "smallholder_farmer";
  
  if (!ROLE_FEATURES[role]) {
    console.warn(`Unknown role: ${role}, defaulting to smallholder_farmer`);
    return ROLE_FEATURES.smallholder_farmer;
  }

  return ROLE_FEATURES[role];
}

/**
 * Filter a list of features based on user role
 */
export function filterFeaturesByRole<T extends { id: FeatureId }>(
  features: T[],
  userRole: UserRole | string
): T[] {
  const allowedFeatures = getRoleFeatures(userRole);
  return features.filter((feature) => allowedFeatures.includes(feature.id));
}

/**
 * Get role display name
 */
export function getRoleDisplayName(
  role: UserRole | string,
  language: "en" | "sw" = "en"
): string {
  const names: Record<UserRole, { en: string; sw: string }> = {
    smallholder_farmer: {
      en: "Smallholder Farmer",
      sw: "Mkulima Mdogo",
    },
    farmer: {
      en: "Farmer (5+ acres)",
      sw: "Mkulima (Ekari 5+)",
    },
    commercial_farmer: {
      en: "Commercial Farmer (5+ acres)",
      sw: "Mkulima ya Biashara (Ekari 5+)",
    },
    farm_manager: {
      en: "Farm Manager",
      sw: "Meneja wa Shamba",
    },
    commercial_farm_admin: {
      en: "Commercial Farm Admin",
      sw: "Msimamizi wa Shamba la Biashara",
    },
    agribusiness_ops: {
      en: "Agribusiness Operations",
      sw: "Operesheni za Kilimo Biashara",
    },
    extension_officer: {
      en: "Extension Officer / NGO",
      sw: "Afisa wa Ugani / NGO",
    },
    cooperative_leader: {
      en: "Cooperative Leader",
      sw: "Kiongozi wa Ushirika",
    },
  };

  const roleName = names[role as UserRole];
  if (!roleName) {
    return role;
  }

  return roleName[language];
}

/**
 * Get role description
 */
export function getRoleDescription(
  role: UserRole | string,
  language: "en" | "sw" = "en"
): string {
  const descriptions: Record<UserRole, { en: string; sw: string }> = {
    smallholder_farmer: {
      en: "0-5 acres, basic farming with AI advisory",
      sw: "Ekari 0-5, kilimo cha msingi na ushauri wa AI",
    },
    farmer: {
      en: "5+ acres, independent farming with advanced tools",
      sw: "Ekari 5+, kilimo huru na zana za juu",
    },
    commercial_farmer: {
      en: "5+ acres, independent farming with advanced tools",
      sw: "Ekari 5+, kilimo huru na zana za juu",
    },
    farm_manager: {
      en: "Multi-field management with team coordination",
      sw: "Usimamizi wa mashamba mengi na uratibu wa timu",
    },
    commercial_farm_admin: {
      en: "Enterprise-level multi-farm operations",
      sw: "Operesheni za mashamba ya kiwango cha biashara",
    },
    agribusiness_ops: {
      en: "Buyer/supplier marketplace operations",
      sw: "Operesheni za soko za wanunuzi/wasambazaji",
    },
    extension_officer: {
      en: "External advisor for farmer monitoring & training",
      sw: "Mshauri wa nje kwa ufuatiliaji na mafunzo ya wakulima",
    },
    cooperative_leader: {
      en: "Multi-farmer cooperative management",
      sw: "Usimamizi wa ushirika wa wakulima wengi",
    },
  };

  const desc = descriptions[role as UserRole];
  if (!desc) {
    return "";
  }

  return desc[language];
}

/**
 * Feature count by role
 */
export function getFeatureCount(userRole: UserRole | string): number {
  return getRoleFeatures(userRole).length;
}

/**
 * Get all unique features across all roles
 */
export function getAllFeatures(): FeatureId[] {
  const allFeatures = new Set<FeatureId>();
  
  Object.values(ROLE_FEATURES).forEach((features) => {
    features.forEach((feature) => allFeatures.add(feature));
  });
  
  return Array.from(allFeatures).sort();
}

/**
 * Get role configuration by ID
 */
export function getRoleById(roleId: string): {
  id: string;
  name: string;
  description: string;
  features: FeatureId[];
} | null {
  const role = roleId as UserRole;
  
  if (!ROLE_FEATURES[role]) {
    return null;
  }
  
  return {
    id: roleId,
    name: getRoleDisplayName(role, "en"),
    description: getRoleDescription(role, "en"),
    features: ROLE_FEATURES[role],
  };
}

/**
 * Get all available roles
 */
export function getAllRoles(): UserRole[] {
  return Object.keys(ROLE_FEATURES) as UserRole[];
}