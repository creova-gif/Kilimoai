/**
 * LEGACY ROUTE REDIRECTS
 * 
 * Maps old standalone pages to new unified components with proper tab selection.
 * Ensures deep links continue to work during structural unification.
 * 
 * Usage:
 *   const redirect = getLegacyRedirect(oldRoute);
 *   if (redirect) {
 *     setActiveTab(redirect.newRoute);
 *     setSubTab(redirect.tab); // Optional tab selection
 *   }
 */

export interface RouteRedirect {
  /** Old route ID */
  oldRoute: string;
  /** New unified route ID */
  newRoute: string;
  /** Optional: specific tab to open within unified component */
  tab?: string;
  /** Reason for redirect (for logging/debugging) */
  reason: string;
}

/**
 * Complete mapping of legacy routes to unified pages
 */
export const LEGACY_ROUTE_REDIRECTS: RouteRedirect[] = [
  // ========================================
  // AI ADVISOR UNIFICATION
  // ========================================
  {
    oldRoute: "ai-chat",
    newRoute: "ai-advisor",
    tab: "chat",
    reason: "Unified into AI Advisor - Chat tab"
  },
  {
    oldRoute: "diagnosis",
    newRoute: "ai-advisor",
    tab: "scan",
    reason: "Unified into AI Advisor - Scan tab"
  },
  {
    oldRoute: "voice",
    newRoute: "ai-advisor",
    tab: "voice",
    reason: "Unified into AI Advisor - Voice tab"
  },
  {
    oldRoute: "ai-recommendations",
    newRoute: "ai-advisor",
    tab: "recommendations",
    reason: "Unified into AI Advisor - Recommendations tab"
  },
  {
    oldRoute: "ai-farm-plan",
    newRoute: "ai-advisor",
    tab: "plan",
    reason: "Unified into AI Advisor - Farm Plan tab"
  },
  {
    oldRoute: "ai-training",
    newRoute: "ai-advisor",
    tab: "training",
    reason: "Unified into AI Advisor - Training tab"
  },
  {
    oldRoute: "workflows",
    newRoute: "ai-advisor",
    tab: "chat",
    reason: "Deprecated - redirects to AI Advisor"
  },
  {
    oldRoute: "ai-advisory",
    newRoute: "ai-advisor",
    tab: "recommendations",
    reason: "Duplicate - unified into AI Advisor"
  },
  {
    oldRoute: "ai-insights",
    newRoute: "ai-advisor",
    tab: "recommendations",
    reason: "Generic insights - now in recommendations"
  },

  // ========================================
  // CROP PLANNING UNIFICATION
  // ========================================
  {
    oldRoute: "land-allocation",
    newRoute: "crop-planning",
    tab: "visual",
    reason: "Unified into Crop Planning - Visual Planner tab"
  },
  {
    oldRoute: "crop-planning",
    newRoute: "crop-planning",
    tab: "plans",
    reason: "Unified into Crop Planning - Plans tab"
  },
  {
    oldRoute: "crop-planning-ai",
    newRoute: "crop-planning",
    tab: "plans",
    reason: "Duplicate - unified into Crop Planning"
  },
  {
    oldRoute: "crop-dashboard",
    newRoute: "crop-planning",
    tab: "dashboard",
    reason: "Unified into Crop Planning - Dashboard tab"
  },
  {
    oldRoute: "predictions",
    newRoute: "crop-planning",
    tab: "dashboard",
    reason: "Yield forecasting - now in dashboard"
  },

  // ========================================
  // CROP INTELLIGENCE UNIFICATION
  // ========================================
  {
    oldRoute: "crop-tips",
    newRoute: "crop-intelligence",
    tab: "tips",
    reason: "Unified into Crop Intelligence - Tips tab"
  },
  {
    oldRoute: "personalized",
    newRoute: "crop-intelligence",
    tab: "tips",
    reason: "Personalized recommendations - now in tips"
  },

  // ========================================
  // FARM MAP UNIFICATION
  // ========================================
  {
    oldRoute: "farm-mapping",
    newRoute: "farm-map",
    tab: "map",
    reason: "Unified into Farm Map - Interactive Map tab"
  },
  {
    oldRoute: "farm-map",
    newRoute: "farm-map",
    tab: "map",
    reason: "Already unified"
  },

  // ========================================
  // TASKS & SCHEDULE UNIFICATION
  // ========================================
  {
    oldRoute: "tasks",
    newRoute: "tasks-schedule",
    tab: "today",
    reason: "Unified into Tasks & Schedule - Today tab"
  },

  // ========================================
  // INVENTORY & INPUTS UNIFICATION
  // ========================================
  {
    oldRoute: "inventory",
    newRoute: "inventory-inputs",
    tab: "stock",
    reason: "Unified into Inventory & Inputs - Stock tab"
  },
  {
    oldRoute: "input-supply",
    newRoute: "inventory-inputs",
    tab: "purchase",
    reason: "Unified into Inventory & Inputs - Purchase tab"
  },

  // ========================================
  // MARKET UNIFICATION
  // ========================================
  {
    oldRoute: "marketplace",
    newRoute: "market",
    tab: "marketplace",
    reason: "Unified into Market - Marketplace tab"
  },
  {
    oldRoute: "orders",
    newRoute: "market",
    tab: "orders",
    reason: "Unified into Market - Orders tab"
  },
  {
    oldRoute: "market",
    newRoute: "market",
    tab: "prices",
    reason: "Market prices - unified into Market"
  },
  {
    oldRoute: "contracts",
    newRoute: "market",
    tab: "contracts",
    reason: "Unified into Market - Contracts tab"
  },
  {
    oldRoute: "contract-farming",
    newRoute: "market",
    tab: "contracts",
    reason: "Unified into Market - Contracts tab"
  },

  // ========================================
  // FINANCE UNIFICATION
  // ========================================
  {
    oldRoute: "finance",
    newRoute: "finance",
    tab: "overview",
    reason: "Unified into Finance - Overview tab"
  },
  {
    oldRoute: "mobile-money",
    newRoute: "finance",
    tab: "mobile-money",
    reason: "Unified into Finance - Mobile Money tab"
  },
  {
    oldRoute: "insurance",
    newRoute: "finance",
    tab: "insurance",
    reason: "Unified into Finance - Insurance tab"
  },
  {
    oldRoute: "analytics",
    newRoute: "finance",
    tab: "overview",
    reason: "Analytics - now in finance overview"
  },
  {
    oldRoute: "reporting",
    newRoute: "finance",
    tab: "transactions",
    reason: "Reporting - now in transactions"
  },
  {
    oldRoute: "agribusiness",
    newRoute: "finance",
    tab: "overview",
    reason: "Agribusiness metrics - now in finance"
  },
  {
    oldRoute: "farm-graph",
    newRoute: "finance",
    tab: "overview",
    reason: "Farm analytics - now in finance overview"
  },

  // ========================================
  // LIVESTOCK UNIFICATION
  // ========================================
  {
    oldRoute: "livestock",
    newRoute: "livestock",
    tab: "herd",
    reason: "Unified into Livestock - Herd tab"
  },
  {
    oldRoute: "livestock-health",
    newRoute: "livestock",
    tab: "health",
    reason: "Unified into Livestock - Health tab"
  },

  // ========================================
  // COMMUNITY UNIFICATION
  // ========================================
  {
    oldRoute: "discussions",
    newRoute: "community",
    tab: "discussions",
    reason: "Unified into Community - Discussions tab"
  },
  {
    oldRoute: "experts",
    newRoute: "community",
    tab: "experts",
    reason: "Unified into Community - Ask Expert tab"
  },
  {
    oldRoute: "cooperative",
    newRoute: "community",
    tab: "cooperative",
    reason: "Unified into Community - Cooperative tab"
  },
  {
    oldRoute: "extension-officer",
    newRoute: "community",
    tab: "experts",
    reason: "Extension services - now in community"
  },
  {
    oldRoute: "institutional",
    newRoute: "community",
    tab: "cooperative",
    reason: "Institutional features - now in cooperative"
  },

  // ========================================
  // LEARNING & SUPPORT UNIFICATION
  // ========================================
  {
    oldRoute: "videos",
    newRoute: "learning-support",
    tab: "videos",
    reason: "Unified into Learning & Support - Videos tab"
  },
  {
    oldRoute: "knowledge",
    newRoute: "learning-support",
    tab: "knowledge",
    reason: "Unified into Learning & Support - Knowledge tab"
  },
  {
    oldRoute: "support",
    newRoute: "learning-support",
    tab: "support",
    reason: "Unified into Learning & Support - Support tab"
  },
  {
    oldRoute: "contact",
    newRoute: "learning-support",
    tab: "support",
    reason: "Contact support - unified"
  },
  {
    oldRoute: "faq",
    newRoute: "learning-support",
    tab: "faq",
    reason: "Unified into Learning & Support - FAQ tab"
  },
  {
    oldRoute: "training",
    newRoute: "learning-support",
    tab: "videos",
    reason: "Training - now in video tutorials"
  },

  // ========================================
  // DEPRECATED / REMOVED PAGES
  // ========================================
  {
    oldRoute: "farmer-lab",
    newRoute: "home",
    reason: "Deprecated - too abstract"
  },
  {
    oldRoute: "gamification",
    newRoute: "home",
    reason: "Deprecated - non-essential"
  },
  {
    oldRoute: "family-planner",
    newRoute: "home",
    reason: "Deprecated - scope creep"
  },
  {
    oldRoute: "digital-twin",
    newRoute: "home",
    reason: "Deprecated - over-engineered"
  },
  {
    oldRoute: "diagnostics",
    newRoute: "home",
    reason: "Dev tool - hidden from main navigation"
  },
  {
    oldRoute: "weather",
    newRoute: "home",
    reason: "Weather widget now inline on dashboard"
  },
  {
    oldRoute: "soil-test",
    newRoute: "crop-intelligence",
    tab: "guides",
    reason: "Soil testing - now in crop guides"
  },
];

/**
 * Get redirect information for a legacy route
 */
export function getLegacyRedirect(oldRoute: string): RouteRedirect | null {
  return LEGACY_ROUTE_REDIRECTS.find(r => r.oldRoute === oldRoute) || null;
}

/**
 * Check if a route is deprecated and should redirect
 */
export function isLegacyRoute(route: string): boolean {
  return LEGACY_ROUTE_REDIRECTS.some(r => r.oldRoute === route);
}

/**
 * Get all routes that redirect to a specific unified page
 */
export function getRedirectsToPage(newRoute: string): RouteRedirect[] {
  return LEGACY_ROUTE_REDIRECTS.filter(r => r.newRoute === newRoute);
}

/**
 * Log redirect for analytics
 */
export function logRouteRedirect(redirect: RouteRedirect): void {
  console.log(`[Route Redirect] ${redirect.oldRoute} → ${redirect.newRoute}${redirect.tab ? ` (tab: ${redirect.tab})` : ''}`);
  console.log(`[Reason] ${redirect.reason}`);
}
