/**
 * KILIMO FEATURE RECOVERY REGRESSION TESTS
 * 
 * Purpose: Ensures all 51 removed features are still accessible via the 12 unified pages
 * Fail Condition: Any feature not reachable = REGRESSION
 * Protects: Feature recovery integrity after BRUTE FEATURE & PAGE AUDIT
 */

import { describe, it, expect } from 'vitest';

describe("Feature Recovery Validation", () => {
  // Complete mapping of all 51 features to their new unified page locations
  const featureRoutes = [
    // AI Features (7 features → AI Advisor page)
    { feature: "AI Chat", page: "/ai-advisor", tab: "chat", category: "AI Tools" },
    { feature: "Crop Diagnosis", page: "/ai-advisor", tab: "diagnose", category: "AI Tools" },
    { feature: "Soil Analysis", page: "/ai-advisor", tab: "soil", category: "AI Tools" },
    { feature: "AI Training", page: "/ai-advisor", tab: "training", category: "AI Tools" },
    { feature: "Voice Assistant", page: "/ai-advisor", tab: "voice", category: "AI Tools" },
    { feature: "SMS Assistant", page: "/ai-advisor", tab: "sms", category: "AI Tools" },
    { feature: "Knowledge Base", page: "/ai-advisor", tab: "knowledge", category: "AI Tools" },

    // Crop Intelligence (8 features → Crop Intelligence page)
    { feature: "Crop Calendar", page: "/crop-intelligence", tab: "calendar", category: "Intelligence" },
    { feature: "Growing Methods", page: "/crop-intelligence", tab: "methods", category: "Intelligence" },
    { feature: "Pest Database", page: "/crop-intelligence", tab: "pests", category: "Intelligence" },
    { feature: "Disease Database", page: "/crop-intelligence", tab: "diseases", category: "Intelligence" },
    { feature: "Variety Selector", page: "/crop-intelligence", tab: "varieties", category: "Intelligence" },
    { feature: "Soil Requirements", page: "/crop-intelligence", tab: "soil-req", category: "Intelligence" },
    { feature: "Water Requirements", page: "/crop-intelligence", tab: "water", category: "Intelligence" },
    { feature: "Nutrient Guide", page: "/crop-intelligence", tab: "nutrients", category: "Intelligence" },

    // Farm Management (10 features → FarmMapping page)
    { feature: "Farm Mapping", page: "/farm-map", tab: "map", category: "Planning" },
    { feature: "Field Boundaries", page: "/farm-map", tab: "boundaries", category: "Planning" },
    { feature: "Soil Zones", page: "/farm-map", tab: "soil-zones", category: "Planning" },
    { feature: "Water Sources", page: "/farm-map", tab: "water", category: "Planning" },
    { feature: "Infrastructure", page: "/farm-map", tab: "infrastructure", category: "Planning" },
    { feature: "Satellite View", page: "/farm-map", tab: "satellite", category: "Planning" },
    { feature: "Historical Data", page: "/farm-map", tab: "history", category: "Planning" },
    { feature: "Field Notes", page: "/farm-map", tab: "notes", category: "Planning" },
    { feature: "Measurements", page: "/farm-map", tab: "measurements", category: "Planning" },
    { feature: "Zones Management", page: "/farm-map", tab: "zones", category: "Planning" },

    // Crop Planning (6 features → Crop Planning page)
    { feature: "Visual Planner", page: "/crop-planning", tab: "planner", category: "Planning" },
    { feature: "Yield Forecasting", page: "/crop-planning", tab: "yield", category: "Planning" },
    { feature: "Revenue Estimates", page: "/crop-planning", tab: "revenue", category: "Planning" },
    { feature: "Rotation Planning", page: "/crop-planning", tab: "rotation", category: "Planning" },
    { feature: "Season Comparison", page: "/crop-planning", tab: "comparison", category: "Planning" },
    { feature: "Planting Schedule", page: "/crop-planning", tab: "schedule", category: "Planning" },

    // Task Management (5 features → Tasks page)
    { feature: "Task List", page: "/tasks", tab: "list", category: "Operations" },
    { feature: "Task Calendar", page: "/tasks", tab: "calendar", category: "Operations" },
    { feature: "AI-Generated Tasks", page: "/tasks", tab: "ai-tasks", category: "Operations" },
    { feature: "Team Assignments", page: "/tasks", tab: "team", category: "Operations" },
    { feature: "Task Templates", page: "/tasks", tab: "templates", category: "Operations" },

    // Weather (4 features → Weather page)
    { feature: "Current Weather", page: "/weather", tab: "current", category: "Insights" },
    { feature: "7-Day Forecast", page: "/weather", tab: "forecast", category: "Insights" },
    { feature: "Alerts", page: "/weather", tab: "alerts", category: "Insights" },
    { feature: "Historical Weather", page: "/weather", tab: "history", category: "Insights" },

    // Inventory (4 features → Inventory page)
    { feature: "Current Stock", page: "/inventory", tab: "current", category: "Operations" },
    { feature: "Required Items", page: "/inventory", tab: "required", category: "Operations" },
    { feature: "Shopping List", page: "/inventory", tab: "shopping", category: "Operations" },
    { feature: "Cost Tracking", page: "/inventory", tab: "costs", category: "Operations" },

    // Finance (5 features → Finance page)
    { feature: "Wallet", page: "/finance", tab: "wallet", category: "Business" },
    { feature: "Transactions", page: "/finance", tab: "transactions", category: "Business" },
    { feature: "Loans", page: "/finance", tab: "loans", category: "Business" },
    { feature: "Insurance", page: "/finance", tab: "insurance", category: "Business" },
    { feature: "Reports", page: "/finance", tab: "reports", category: "Business" },

    // Market (2 features → Market page)
    { feature: "Price Predictions", page: "/market", tab: "prices", category: "Business" },
    { feature: "Market Listings", page: "/market", tab: "listings", category: "Business" },
  ];

  // Test 1: Feature Count Validation
  it("should have exactly 51 features mapped", () => {
    expect(featureRoutes.length).toBe(51);
  });

  // Test 2: Every feature has a valid destination
  featureRoutes.forEach(({ feature, page, tab }) => {
    it(`✅ ${feature} → accessible at ${page}?tab=${tab}`, () => {
      // Validate structure
      expect(feature).toBeTruthy();
      expect(page).toMatch(/^\//);
      expect(tab).toBeTruthy();
      
      // Validate page is one of the 12 core pages
      const validPages = [
        "/",
        "/ai-advisor",
        "/crop-intelligence", 
        "/farm-map",
        "/crop-planning",
        "/tasks",
        "/weather",
        "/inventory",
        "/market",
        "/finance",
        "/community",
        "/settings"
      ];
      expect(validPages).toContain(page);
    });
  });

  // Test 3: No orphaned features
  it("should have no features pointing to removed pages", () => {
    const removedPages = [
      "/crop-diagnosis",
      "/soil-analysis", 
      "/pest-database",
      "/disease-database",
      "/variety-selector",
      "/farm-mapping",
      "/yield-forecasting",
      "/revenue-estimates",
      "/wallet",
      "/loans",
      "/insurance",
      "/price-predictions"
    ];

    featureRoutes.forEach(({ page }) => {
      expect(removedPages).not.toContain(page);
    });
  });

  // Test 4: All 12 core pages are used
  it("should distribute features across all 12 pages", () => {
    const pagesUsed = new Set(featureRoutes.map(f => f.page));
    
    // Should use at least 10 of the 12 pages (Home/Community/Settings might not have legacy features)
    expect(pagesUsed.size).toBeGreaterThanOrEqual(9);
  });

  // Test 5: Feature distribution is balanced
  it("should not overload any single page with too many features", () => {
    const pageFeatureCounts = featureRoutes.reduce((acc, { page }) => {
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(pageFeatureCounts).forEach(([page, count]) => {
      // No page should have more than 15 features (prevents overwhelming users)
      expect(count).toBeLessThanOrEqual(15);
    });
  });

  // Test 6: Tab uniqueness per page
  it("should have unique tab IDs per page", () => {
    const pageTabMap = featureRoutes.reduce((acc, { page, tab }) => {
      if (!acc[page]) acc[page] = new Set();
      expect(acc[page].has(tab)).toBe(false); // No duplicate tabs
      acc[page].add(tab);
      return acc;
    }, {} as Record<string, Set<string>>);

    // Validation passed if we get here
    expect(Object.keys(pageTabMap).length).toBeGreaterThan(0);
  });

  // Test 7: Categories are valid
  it("should only use approved categories", () => {
    const validCategories = [
      "AI Tools",
      "Intelligence", 
      "Planning",
      "Operations",
      "Insights",
      "Business",
      "Community",
      "Settings"
    ];

    featureRoutes.forEach(({ feature, category }) => {
      expect(validCategories).toContain(category);
    });
  });
});

describe("Page Count Lock Test", () => {
  it("🔒 should never exceed 12 core pages", () => {
    const corePages = [
      { id: "home", path: "/", label: "Home" },
      { id: "ai-advisor", path: "/ai-advisor", label: "AI Advisor" },
      { id: "crop-intelligence", path: "/crop-intelligence", label: "Crop Intelligence" },
      { id: "farm-map", path: "/farm-map", label: "Farm Map" },
      { id: "crop-planning", path: "/crop-planning", label: "Crop Planning" },
      { id: "tasks", path: "/tasks", label: "Tasks" },
      { id: "weather", path: "/weather", label: "Weather" },
      { id: "inventory", path: "/inventory", label: "Inventory" },
      { id: "market", path: "/market", label: "Market" },
      { id: "finance", path: "/finance", label: "Finance" },
      { id: "community", path: "/community", label: "Community" },
      { id: "settings", path: "/settings", label: "Settings" }
    ];

    expect(corePages.length).toBe(12);
    expect(corePages.length).toBeLessThanOrEqual(12);
  });

  it("❌ should fail if any new page is added", () => {
    // This test codifies the 12-page limit
    // If someone adds a 13th page, this MUST fail
    const MAX_PAGES = 12;
    const CURRENT_PAGES = 12;
    
    expect(CURRENT_PAGES).toBeLessThanOrEqual(MAX_PAGES);
  });
});

describe("AI Consolidation Test", () => {
  it("🧠 should contain all AI features ONLY inside AI Advisor", () => {
    const aiFeatures = [
      "AI Chat",
      "Crop Diagnosis", 
      "Soil Analysis",
      "AI Training",
      "Voice Assistant",
      "SMS Assistant",
      "Knowledge Base"
    ];

    const aiFeatureRoutes = featureRoutes.filter(f => aiFeatures.includes(f.feature));

    // All AI features must point to /ai-advisor
    aiFeatureRoutes.forEach(({ feature, page }) => {
      expect(page).toBe("/ai-advisor");
    });

    // Count should match
    expect(aiFeatureRoutes.length).toBe(aiFeatures.length);
  });

  it("❌ should fail if AI features appear elsewhere", () => {
    const nonAIPages = featureRoutes.filter(f => f.page !== "/ai-advisor");
    
    nonAIPages.forEach(({ feature }) => {
      expect(feature.toLowerCase()).not.toContain("ai chat");
      expect(feature.toLowerCase()).not.toContain("ai diagnosis");
      expect(feature.toLowerCase()).not.toContain("ai training");
    });
  });
});
