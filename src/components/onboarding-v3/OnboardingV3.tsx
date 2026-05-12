/**
 * KILIMO FINAL ONBOARDING ARCHITECTURE
 * 2-Screen Flow: Role → Phone → Dashboard
 * Time to value: 20-30 seconds
 * Drop-off: Minimal
 */

import { useState } from 'react';
import { Toaster, toast } from 'sonner@2.0.3';
import { RoleSelection } from './RoleSelection';
import { PhoneVerification } from './PhoneVerification';

interface OnboardingV3Props {
  onComplete: (userData: any) => void;
  apiBase: string;
  apiKey: string;
}

type OnboardingStep = 'role-selection' | 'phone-verification';

export function OnboardingV3({ onComplete, apiBase, apiKey }: OnboardingV3Props) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('role-selection');
  const [language, setLanguage] = useState<'en' | 'sw'>('sw'); // Default Swahili
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [userId, setUserId] = useState('');

  // Step 1: Role Selection
  const handleRoleSelection = (selectedRole: string) => {
    setRole(selectedRole);
    setCurrentStep('phone-verification');
  };

  // Step 2: Phone Verification → Launch
  const handlePhoneVerified = (verifiedPhone: string, verifiedUserId: string) => {
    setPhone(verifiedPhone);
    setUserId(verifiedUserId);
    
    // Compile final user data
    const userData = {
      id: verifiedUserId,
      phone: verifiedPhone,
      role,
      language,
      onboardingCompleted: true,
      onboardingCompletedAt: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem('kilimoUser', JSON.stringify(userData));
    localStorage.setItem('kilimoLanguage', language);
    localStorage.setItem('kilimoSeenWelcome', 'true');

    // Show welcome toast
    toast.success(
      language === 'en' 
        ? '✓ Welcome to KILIMO!' 
        : '✓ Karibu KILIMO!',
      {
        description: language === 'en'
          ? 'Your account is ready. Let\'s grow together!'
          : 'Akaunti yako iko tayari. Hebu tukue pamoja!',
        duration: 4000,
      }
    );

    // Launch to dashboard
    onComplete(userData);
  };

  return (
    <>
      <Toaster position="top-center" richColors />

      {currentStep === 'role-selection' && (
        <RoleSelection
          onSelect={handleRoleSelection}
          language={language}
        />
      )}

      {currentStep === 'phone-verification' && (
        <PhoneVerification
          onVerified={handlePhoneVerified}
          language={language}
          apiBase={apiBase}
          apiKey={apiKey}
        />
      )}
    </>
  );
}
