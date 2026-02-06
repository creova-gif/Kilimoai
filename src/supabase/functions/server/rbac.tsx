/**
 * Role-Based Access Control (RBAC) Middleware for Backend API
 * Protects routes based on user roles
 */

import type { Context } from "npm:hono@4";

// Mirror the frontend role definitions
export type UserRole =
  | "smallholder_farmer"
  | "farmer"
  | "farm_manager"
  | "commercial_farm_admin"
  | "agribusiness_ops"
  | "extension_officer"
  | "cooperative_leader";

export type FeatureId =
  | "home"
  | "workflows"
  | "ai-chat"
  | "diagnosis"
  | "voice"
  | "ai-recommendations"
  | "ai-training"
  | "ai-insights"
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
  | "market"
  | "marketplace"
  | "agribusiness"
  | "orders"
  | "finance"
  | "mobile-money"
  | "insurance"
  | "contracts"
  | "input-supply"
  | "experts"
  | "soil-test"
  | "weather"
  | "agro-id"
  | "analytics"
  | "reports"
  | "predictive"
  | "crop-tips"
  | "knowledge"
  | "videos"
  | "training"
  | "discussions"
  | "cooperative"
  | "extension"
  | "institutional"
  | "gamification"
  | "diagnostics"
  | "support"
  | "contact"
  | "faq"
  | "privacy";

/**
 * Role-Feature Access Matrix (Must match frontend)
 */
const ROLE_FEATURES: Record<UserRole, FeatureId[]> = {
  smallholder_farmer: [
    "home", "workflows", "ai-chat", "diagnosis", "voice", "ai-recommendations",
    "ai-training", "crop-planning", "crop-planning-ai", "crop-dashboard",
    "livestock", "livestock-health", "family-planner", "farmer-lab",
    "market", "marketplace", "mobile-money", "insurance", "contracts",
    "input-supply", "experts", "soil-test", "weather", "crop-tips",
    "knowledge", "videos", "training", "discussions", "support", "contact",
    "faq", "privacy", "gamification"
  ],
  farmer: [
    "home", "workflows", "ai-chat", "diagnosis", "voice", "ai-recommendations",
    "ai-training", "ai-insights", "crop-planning", "crop-planning-ai",
    "crop-dashboard", "livestock", "livestock-health", "family-planner",
    "farmer-lab", "farm-graph", "market", "marketplace", "finance",
    "mobile-money", "insurance", "contracts", "input-supply", "experts",
    "soil-test", "weather", "crop-tips", "knowledge", "videos", "training",
    "discussions", "support", "contact", "faq", "privacy", "gamification"
  ],
  farm_manager: [
    "home", "workflows", "ai-chat", "diagnosis", "voice", "ai-recommendations",
    "ai-training", "ai-insights", "tasks", "crop-planning", "crop-planning-ai",
    "crop-dashboard", "livestock", "livestock-health", "farm-mapping",
    "land-allocation", "inventory", "family-planner", "farmer-lab",
    "digital-twin", "farm-graph", "market", "marketplace", "finance",
    "mobile-money", "insurance", "contracts", "input-supply", "experts",
    "soil-test", "weather", "analytics", "reports", "predictive", "crop-tips",
    "knowledge", "videos", "training", "discussions", "support", "contact",
    "faq", "privacy", "gamification"
  ],
  commercial_farm_admin: [
    "home", "workflows", "ai-chat", "diagnosis", "voice", "ai-recommendations",
    "ai-training", "ai-insights", "tasks", "crop-planning", "crop-planning-ai",
    "crop-dashboard", "livestock", "livestock-health", "farm-mapping",
    "land-allocation", "inventory", "family-planner", "farmer-lab",
    "digital-twin", "farm-graph", "market", "marketplace", "agribusiness",
    "orders", "finance", "mobile-money", "insurance", "contracts",
    "input-supply", "experts", "soil-test", "weather", "agro-id", "analytics",
    "reports", "predictive", "crop-tips", "knowledge", "videos", "training",
    "discussions", "institutional", "support", "contact", "faq", "privacy",
    "gamification", "diagnostics"
  ],
  agribusiness_ops: [
    "home", "workflows", "ai-chat", "ai-recommendations", "ai-insights",
    "market", "marketplace", "agribusiness", "orders", "finance",
    "mobile-money", "contracts", "input-supply", "weather", "analytics",
    "reports", "predictive", "knowledge", "videos", "institutional",
    "support", "contact", "faq", "privacy", "diagnostics"
  ],
  extension_officer: [
    "home", "workflows", "ai-chat", "diagnosis", "ai-recommendations",
    "ai-training", "ai-insights", "crop-planning", "crop-dashboard",
    "livestock", "farmer-lab", "market", "weather", "analytics", "reports",
    "crop-tips", "knowledge", "videos", "training", "discussions",
    "cooperative", "extension", "institutional", "support", "contact", "faq",
    "privacy"
  ],
  cooperative_leader: [
    "home", "workflows", "ai-chat", "diagnosis", "voice", "ai-recommendations",
    "ai-training", "crop-planning", "crop-dashboard", "livestock", "farmer-lab",
    "market", "marketplace", "finance", "mobile-money", "contracts", "weather",
    "analytics", "reports", "crop-tips", "knowledge", "videos", "training",
    "discussions", "cooperative", "support", "contact", "faq", "privacy"
  ],
};

/**
 * Check if a user role has access to a specific feature
 */
export function hasFeatureAccess(
  userRole: UserRole | string,
  featureId: FeatureId
): boolean {
  const role = (userRole as UserRole) || "smallholder_farmer";
  
  if (!ROLE_FEATURES[role]) {
    console.warn(`[RBAC] Unknown role: ${role}, defaulting to smallholder_farmer`);
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
    console.warn(`[RBAC] Unknown role: ${role}, defaulting to smallholder_farmer`);
    return ROLE_FEATURES.smallholder_farmer;
  }

  return ROLE_FEATURES[role];
}

/**
 * Middleware: Require feature access for a route
 * Usage: app.get('/tasks', requireFeature('tasks'), async (c) => { ... })
 */
export function requireFeature(featureId: FeatureId) {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      // Get user from context (should be set by auth middleware)
      const user = c.get("user");
      
      if (!user) {
        return c.json({
          success: false,
          error: "Unauthorized: No user found",
          code: "AUTH_REQUIRED"
        }, 401);
      }

      const userRole = user.role || "smallholder_farmer";

      // Check if user has access to this feature
      if (!hasFeatureAccess(userRole, featureId)) {
        console.warn(`[RBAC] Access denied: ${userRole} attempted to access ${featureId}`);
        
        return c.json({
          success: false,
          error: `Access denied: This feature is not available for your role (${userRole})`,
          code: "FEATURE_NOT_AVAILABLE",
          feature: featureId,
          userRole,
          availableFeatures: getRoleFeatures(userRole).length,
        }, 403);
      }

      // Access granted, proceed
      await next();
    } catch (error) {
      console.error("[RBAC] Error in requireFeature middleware:", error);
      return c.json({
        success: false,
        error: "Internal server error during access control",
        code: "RBAC_ERROR"
      }, 500);
    }
  };
}

/**
 * Middleware: Require specific role(s)
 * Usage: app.get('/admin', requireRole(['commercial_farm_admin']), async (c) => { ... })
 */
export function requireRole(allowedRoles: UserRole | UserRole[]) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  return async (c: Context, next: () => Promise<void>) => {
    try {
      const user = c.get("user");
      
      if (!user) {
        return c.json({
          success: false,
          error: "Unauthorized: No user found",
          code: "AUTH_REQUIRED"
        }, 401);
      }

      const userRole = user.role || "smallholder_farmer";

      if (!roles.includes(userRole as UserRole)) {
        console.warn(`[RBAC] Role denied: ${userRole} attempted to access role-restricted route (allowed: ${roles.join(", ")})`);
        
        return c.json({
          success: false,
          error: `Access denied: This endpoint requires one of these roles: ${roles.join(", ")}`,
          code: "ROLE_NOT_ALLOWED",
          userRole,
          requiredRoles: roles,
        }, 403);
      }

      // Access granted
      await next();
    } catch (error) {
      console.error("[RBAC] Error in requireRole middleware:", error);
      return c.json({
        success: false,
        error: "Internal server error during role verification",
        code: "RBAC_ERROR"
      }, 500);
    }
  };
}

/**
 * Utility: Get user from request context
 * Should be called after authentication middleware
 */
export function getUserFromContext(c: Context): { id: string; role: UserRole } | null {
  const user = c.get("user");
  if (!user) return null;
  
  return {
    id: user.id,
    role: user.role || "smallholder_farmer",
  };
}

/**
 * Utility: Filter data based on user role
 * For example, extension officers can only see data, not edit
 */
export function canUserEdit(userRole: UserRole | string): boolean {
  const readOnlyRoles: UserRole[] = ["extension_officer", "agribusiness_ops"];
  return !readOnlyRoles.includes(userRole as UserRole);
}

/**
 * Utility: Can user access multi-farm features?
 */
export function canAccessMultiFarm(userRole: UserRole | string): boolean {
  const multiFarmRoles: UserRole[] = [
    "farm_manager",
    "commercial_farm_admin",
    "cooperative_leader"
  ];
  return multiFarmRoles.includes(userRole as UserRole);
}

/**
 * Utility: Can user access enterprise features?
 */
export function canAccessEnterprise(userRole: UserRole | string): boolean {
  const enterpriseRoles: UserRole[] = [
    "commercial_farm_admin",
    "agribusiness_ops",
  ];
  return enterpriseRoles.includes(userRole as UserRole);
}

/**
 * Utility: Get feature count for role
 */
export function getFeatureCount(userRole: UserRole | string): number {
  return getRoleFeatures(userRole).length;
}

export default {
  hasFeatureAccess,
  getRoleFeatures,
  requireFeature,
  requireRole,
  getUserFromContext,
  canUserEdit,
  canAccessMultiFarm,
  canAccessEnterprise,
  getFeatureCount,
};
