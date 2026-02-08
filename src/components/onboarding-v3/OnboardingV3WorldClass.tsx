/**
 * ONBOARDING V3 - WORLD-CLASS
 * Complete redesign: Unified access → Role (if new) → Dashboard
 * Handles both new and returning users elegantly
 */

import { useState } from 'react';
import { toast, Toaster } from 'sonner@2.0.3';
import { UnifiedAccessScreen } from './UnifiedAccessScreen';
import { PhoneVerificationV2 } from './PhoneVerificationV2';
import { RoleSelectionV2 } from './RoleSelectionV2';

interface OnboardingV3WorldClassProps {
  onComplete: (userData: any) => void;
  apiBase: string;
  apiKey: string;
}

type OnboardingStep = 'access' | 'verification' | 'role';

export function OnboardingV3WorldClass({ onComplete, apiBase, apiKey }: OnboardingV3WorldClassProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('access');
  const [language, setLanguage] = useState<'en' | 'sw'>('sw'); // Default Swahili
  const [phone, setPhone] = useState('');
  const [isReturning, setIsReturning] = useState(false);
  const [userId, setUserId] = useState('');

  // Step 1: Unified Access (new + returning users)
  const handleContinue = (phoneNumber: string, returning: boolean) => {
    setPhone(phoneNumber);
    setIsReturning(returning);
    setCurrentStep('verification');
  };

  // Step 2: Phone Verification
  const handleVerified = (verifiedUserId: string) => {
    setUserId(verifiedUserId);
    
    if (isReturning) {
      // Returning user - skip role selection, go straight to dashboard
      completeOnboarding(verifiedUserId, null);
    } else {
      // New user - show role selection
      setCurrentStep('role');
    }
  };

  // Step 3: Role Selection (new users only)
  const handleRoleSelected = (role: string) => {
    completeOnboarding(userId, role);
  };

  // Complete onboarding
  const completeOnboarding = async (id: string, role: string | null) => {
    // If returning user, fetch existing data
    if (isReturning && !role) {
      const existingUser = localStorage.getItem('kilimoUser');
      if (existingUser) {
        const userData = JSON.parse(existingUser);
        toast.success(
          language === 'en' 
            ? `✓ Welcome back, ${userData.name || 'Farmer'}!` 
            : `✓ Karibu tena, ${userData.name || 'Mkulima'}!`
        );
        onComplete(userData);
        return;
      }
    }

    // New user or updating role
    const userData = {
      id: id,
      phone: phone,
      role: role || 'farmer',
      language: language,
      onboardingCompleted: true,
      onboardingCompletedAt: new Date().toISOString(),
      personalizationCompleted: false,
      walletInitialized: false,
    };

    // Save to backend
    try {
      await fetch(`${apiBase}/users/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Error saving user:', error);
    }

    // Save locally
    localStorage.setItem('kilimoUser', JSON.stringify(userData));
    localStorage.setItem('kilimoLanguage', language);
    localStorage.setItem('kilimoSeenWelcome', 'true');

    // Welcome message
    toast.success(
      language === 'en' 
        ? '✓ Welcome to KILIMO!' 
        : '✓ Karibu KILIMO!'
    );

    onComplete(userData);
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      
      {currentStep === 'access' && (
        <UnifiedAccessScreen
          onContinue={handleContinue}
          language={language}
        />
      )}

      {currentStep === 'verification' && (
        <PhoneVerificationV2
          phone={phone}
          isReturning={isReturning}
          onVerified={handleVerified}
          onBack={() => setCurrentStep('access')}
          language={language}
          apiBase={apiBase}
          apiKey={apiKey}
        />
      )}

      {currentStep === 'role' && (
        <RoleSelectionV2
          onSelect={handleRoleSelected}
          language={language}
        />
      )}
    </>
  );
}