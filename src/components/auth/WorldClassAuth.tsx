/**
 * WORLD-CLASS AUTH ORCHESTRATOR
 * 
 * Flow:
 * 1. UnifiedAccessScreen (phone + auto-detect)
 * 2. QuickProfile (ONLY for new users, ONLY name + role)
 * 3. Dashboard (all other setup is contextual)
 * 
 * Returning users: 1 screen (phone/password or phone/OTP)
 * New users: 2 screens (phone/OTP, then quick profile)
 */

import { useState } from "react";
import { UnifiedAccessScreen } from "./UnifiedAccessScreen";
import { QuickProfile } from "./QuickProfile";

interface WorldClassAuthProps {
  onSuccess: (userData: any) => void;
  language?: "en" | "sw";
}

type AuthStep = "access" | "profile";

export function WorldClassAuth({ onSuccess, language = "sw" }: WorldClassAuthProps) {
  const [step, setStep] = useState<AuthStep>("access");
  const [tempUserData, setTempUserData] = useState<any>(null);

  const handleAccessSuccess = (userData: any) => {
    // Check if user needs profile completion
    if (!userData.name || userData.name === userData.phone || !userData.role) {
      // New user - needs profile
      setTempUserData(userData);
      setStep("profile");
    } else {
      // Returning user - has profile
      onSuccess(userData);
    }
  };

  const handleProfileComplete = (userData: any) => {
    onSuccess(userData);
  };

  return (
    <>
      {step === "access" && (
        <UnifiedAccessScreen
          onSuccess={handleAccessSuccess}
          language={language}
        />
      )}

      {step === "profile" && tempUserData && (
        <QuickProfile
          phoneNumber={tempUserData.phone}
          userId={tempUserData.id}
          onComplete={handleProfileComplete}
          language={language}
        />
      )}
    </>
  );
}
