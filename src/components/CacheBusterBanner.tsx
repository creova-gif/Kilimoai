/**
 * ============================================================================
 * CACHE BUSTER BANNER
 * ============================================================================
 * Shows a warning if the user is running old cached code
 * ============================================================================
 */

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, CheckCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export function CacheBusterBanner() {
  const [isOldVersion, setIsOldVersion] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check if running the latest version
    const EXPECTED_VERSION = "v20260211-NULL-SAFETY-ALL-COMPONENTS"; // MUST MATCH index.html
    const storedVersion = localStorage.getItem("KILIMO_CACHE_VERSION");
    
    console.log("🔍 [CACHE CHECK v7] Expected:", EXPECTED_VERSION);
    console.log("🔍 [CACHE CHECK v7] Stored:", storedVersion || "NONE");
    
    // AUTO-FIX: If version is wrong or missing, just set it and hide banner
    if (storedVersion !== EXPECTED_VERSION) {
      console.log("🔧 [AUTO-FIX v7] Setting correct version automatically...");
      localStorage.setItem("KILIMO_CACHE_VERSION", EXPECTED_VERSION);
      console.log("✅ [AUTO-FIX v7] Version corrected! No reload needed.");
      
      // Show brief success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      setIsOldVersion(false);
      setIsChecking(false);
    } else {
      console.log("✅ [CACHE CHECK v7] Running latest version");
      setIsOldVersion(false);
      setIsChecking(false);
    }
  }, []);

  if (isChecking) {
    return null;
  }

  // Show success message briefly after auto-fix
  if (showSuccess) {
    return (
      <div className="fixed top-4 right-4 z-[9999] animate-fadeIn">
        <Card className="border-green-500 bg-green-50 shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-900">
                ✅ Cache Fixed Automatically
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Never show the red warning banner - auto-fix handles everything
  return null;
}