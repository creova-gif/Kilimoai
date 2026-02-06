/**
 * Custom Hook for Feature Access Control
 * Provides easy-to-use utilities for checking feature access and showing upgrade prompts
 */

import { useState, useCallback } from "react";
import { hasFeatureAccess, type UserRole, type FeatureId } from "../utils/roleBasedAccess";

interface UseFeatureAccessProps {
  userRole: UserRole;
  onUpgradeRequest?: (targetRole: UserRole, featureId: FeatureId) => void;
}

export function useFeatureAccess({ userRole, onUpgradeRequest }: UseFeatureAccessProps) {
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [promptFeatureId, setPromptFeatureId] = useState<FeatureId | null>(null);
  const [promptFeatureName, setPromptFeatureName] = useState<string>("");

  /**
   * Check if user has access to a feature
   */
  const checkAccess = useCallback(
    (featureId: FeatureId): boolean => {
      return hasFeatureAccess(userRole, featureId);
    },
    [userRole]
  );

  /**
   * Attempt to access a feature
   * Returns true if access granted, false if denied (and optionally shows upgrade prompt)
   */
  const attemptFeatureAccess = useCallback(
    (featureId: FeatureId, featureName: string, showPrompt: boolean = true): boolean => {
      const hasAccess = hasFeatureAccess(userRole, featureId);

      if (!hasAccess && showPrompt) {
        setPromptFeatureId(featureId);
        setPromptFeatureName(featureName);
        setShowUpgradePrompt(true);
      }

      return hasAccess;
    },
    [userRole]
  );

  /**
   * Show upgrade prompt manually
   */
  const showUpgradePromptFor = useCallback((featureId: FeatureId, featureName: string) => {
    setPromptFeatureId(featureId);
    setPromptFeatureName(featureName);
    setShowUpgradePrompt(true);
  }, []);

  /**
   * Hide upgrade prompt
   */
  const hideUpgradePrompt = useCallback(() => {
    setShowUpgradePrompt(false);
    setPromptFeatureId(null);
    setPromptFeatureName("");
  }, []);

  /**
   * Handle upgrade selection
   */
  const handleUpgrade = useCallback(
    (targetRole: UserRole) => {
      if (onUpgradeRequest && promptFeatureId) {
        onUpgradeRequest(targetRole, promptFeatureId);
      }
      hideUpgradePrompt();
    },
    [onUpgradeRequest, promptFeatureId, hideUpgradePrompt]
  );

  /**
   * Wrapper function to protect feature access
   * Usage: protectFeature("tasks", "Task Management", () => { ... })
   */
  const protectFeature = useCallback(
    <T extends any>(
      featureId: FeatureId,
      featureName: string,
      callback: () => T,
      showPrompt: boolean = true
    ): T | null => {
      if (hasFeatureAccess(userRole, featureId)) {
        return callback();
      }

      if (showPrompt) {
        showUpgradePromptFor(featureId, featureName);
      }

      return null;
    },
    [userRole, showUpgradePromptFor]
  );

  return {
    // State
    showUpgradePrompt,
    promptFeatureId,
    promptFeatureName,

    // Functions
    checkAccess,
    attemptFeatureAccess,
    showUpgradePromptFor,
    hideUpgradePrompt,
    handleUpgrade,
    protectFeature,
  };
}

export default useFeatureAccess;
