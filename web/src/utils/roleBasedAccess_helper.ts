/**
 * Helper functions for roleBasedAccess
 * Temporary file to ensure exports work
 */

import { ROLE_FEATURES, type UserRole, type FeatureId, getRoleDisplayName, getRoleDescription } from "./roleBasedAccess";

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
