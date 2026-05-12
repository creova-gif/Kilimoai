import { useState, useEffect } from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import { OnboardingSlides } from "./OnboardingSlides";
import { PermissionsScreen } from "./PermissionsScreen";
import { GuestDemoMode } from "./GuestDemoMode";
import { TrustCredibilityScreen } from "./TrustCredibilityScreen";
import { CreateAccountCTA } from "./CreateAccountCTA";

interface MasterOnboardingProps {
  onComplete: (data: {
    language: "en" | "sw";
    permissions: { camera: boolean; location: boolean; notifications: boolean };
    mode: "registered" | "guest";
  }) => void;
  onShowRegister: () => void;
  onShowLogin: () => void;
}

export function MasterOnboarding({ onComplete, onShowRegister, onShowLogin }: MasterOnboardingProps) {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState<"en" | "sw">("sw");
  const [permissions, setPermissions] = useState({
    camera: false,
    location: false,
    notifications: false
  });

  // Check if user has already seen onboarding
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("kilimoSeenWelcome");
    if (hasSeenWelcome) {
      // Skip to last step if returning user
      setStep(5);
    }
  }, []);

  const steps = [
    "welcome",          // 0: Language selection + tagline
    "onboarding",       // 1: 3 problem-solution-benefit slides
    "permissions",      // 2: Camera, location, notifications
    "demo",            // 3: Guest mode with feature demos
    "trust",           // 4: Credibility & trust building
    "cta"              // 5: Create account CTA
  ];

  const handleWelcomeContinue = (selectedLanguage: "en" | "sw") => {
    setLanguage(selectedLanguage);
    localStorage.setItem("kilimoLanguage", selectedLanguage);
    setStep(1);
  };

  const handleOnboardingComplete = () => {
    setStep(2);
  };

  const handleOnboardingSkip = () => {
    // Skip straight to demo
    setStep(3);
  };

  const handlePermissionsComplete = (perms: { camera: boolean; location: boolean; notifications: boolean }) => {
    setPermissions(perms);
    setStep(3);
  };

  const handleDemoCreateAccount = () => {
    setStep(4); // Go to trust screen first
  };

  const handleDemoContinueAsGuest = () => {
    // Mark as completed in guest mode
    localStorage.setItem("kilimoSeenWelcome", "true");
    onComplete({ language, permissions, mode: "guest" });
  };

  const handleTrustContinue = () => {
    setStep(5); // Go to final CTA
  };

  const handlePhoneSignup = () => {
    localStorage.setItem("kilimoSeenWelcome", "true");
    onShowRegister();
  };

  const handleEmailSignup = () => {
    localStorage.setItem("kilimoSeenWelcome", "true");
    onShowLogin();
  };

  return (
    <>
      {steps[step] === "welcome" && (
        <WelcomeScreen onContinue={handleWelcomeContinue} />
      )}
      
      {steps[step] === "onboarding" && (
        <OnboardingSlides
          language={language}
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {steps[step] === "permissions" && (
        <PermissionsScreen
          language={language}
          onComplete={handlePermissionsComplete}
        />
      )}

      {steps[step] === "demo" && (
        <GuestDemoMode
          language={language}
          onCreateAccount={handleDemoCreateAccount}
          onContinueAsGuest={handleDemoContinueAsGuest}
        />
      )}

      {steps[step] === "trust" && (
        <TrustCredibilityScreen
          language={language}
          onContinue={handleTrustContinue}
        />
      )}

      {steps[step] === "cta" && (
        <CreateAccountCTA
          language={language}
          onPhoneSignup={handlePhoneSignup}
          onEmailSignup={handleEmailSignup}
        />
      )}
    </>
  );
}
