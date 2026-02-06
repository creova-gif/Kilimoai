/**
 * KILIMO WORLD-CLASS ONBOARDING - ORCHESTRATOR
 * Complete 7-screen onboarding flow
 * Inspired by: Twiga Foods, M-Pesa, Plantix, Duolingo
 */

import { useState } from 'react';
import { Toaster } from 'sonner@2.0.3';
import { SoftPowerEntry } from './SoftPowerEntry';
import { RoleSelection } from './RoleSelection';
import { PhoneVerification } from './PhoneVerification';
import { VoiceWelcome } from './VoiceWelcome';
import { AIPersonalization, PersonalizationAnswers } from './AIPersonalization';
import { WalletSetup } from './WalletSetup';
import { SuccessLaunch } from './SuccessLaunch';

interface OnboardingV3Props {
  onComplete: (userData: any) => void;
  apiBase: string;
  apiKey: string;
}

type OnboardingStep = 
  | 'power-entry'
  | 'role-selection'
  | 'phone-verification'
  | 'voice-welcome'
  | 'ai-personalization'
  | 'wallet-setup'
  | 'success-launch';

export function OnboardingV3({ onComplete, apiBase, apiKey }: OnboardingV3Props) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('power-entry');
  const [language, setLanguage] = useState<'en' | 'sw'>('sw'); // Default to Swahili
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [userId, setUserId] = useState('');
  const [useVoice, setUseVoice] = useState(false);
  const [personalization, setPersonalization] = useState<PersonalizationAnswers | null>(null);
  const [userName, setUserName] = useState('');

  // Step 0: Soft Power Entry
  const handlePowerEntryContinue = () => {
    // Detect language from browser (optional)
    const browserLang = navigator.language.startsWith('sw') ? 'sw' : 'en';
    setLanguage(browserLang as 'en' | 'sw');
    setCurrentStep('role-selection');
  };

  // Step 1: Role Selection
  const handleRoleSelection = (selectedRole: string) => {
    setRole(selectedRole);
    setCurrentStep('phone-verification');
  };

  // Step 2: Phone Verification
  const handlePhoneVerified = (verifiedPhone: string, verifiedUserId: string) => {
    setPhone(verifiedPhone);
    setUserId(verifiedUserId);
    
    // Ask for name via modal or move to voice
    // For now, extract name from userId or ask later
    setUserName('Farmer'); // Placeholder
    
    setCurrentStep('voice-welcome');
  };

  // Step 3: Voice Welcome
  const handleVoiceContinue = (enableVoice: boolean) => {
    setUseVoice(enableVoice);
    setCurrentStep('ai-personalization');
  };

  // Step 4: AI Personalization
  const handlePersonalizationComplete = (answers: PersonalizationAnswers) => {
    setPersonalization(answers);
    setCurrentStep('wallet-setup');
  };

  // Step 5: Wallet Setup
  const handleWalletSetupComplete = () => {
    setCurrentStep('success-launch');
  };

  // Step 6: Success Launch
  const handleLaunch = () => {
    // Compile final user data
    const userData = {
      id: userId,
      phone,
      role,
      language,
      name: userName,
      useVoice,
      personalization,
      wallet: {
        balance: 0,
        linkedPhone: phone,
      },
      onboardingCompleted: true,
      onboardingCompletedAt: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem('kilimoUser', JSON.stringify(userData));
    localStorage.setItem('kilimoLanguage', language);
    localStorage.setItem('kilimoSeenWelcome', 'true');

    // Call parent handler
    onComplete(userData);
  };

  return (
    <>
      <Toaster position="top-center" richColors />

      {currentStep === 'power-entry' && (
        <SoftPowerEntry 
          onContinue={handlePowerEntryContinue}
          language={language}
        />
      )}

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

      {currentStep === 'voice-welcome' && (
        <VoiceWelcome
          onContinue={handleVoiceContinue}
          language={language}
          userName={userName}
        />
      )}

      {currentStep === 'ai-personalization' && (
        <AIPersonalization
          onComplete={handlePersonalizationComplete}
          language={language}
          role={role}
        />
      )}

      {currentStep === 'wallet-setup' && (
        <WalletSetup
          onComplete={handleWalletSetupComplete}
          language={language}
          userId={userId}
          phone={phone}
          apiBase={apiBase}
          apiKey={apiKey}
        />
      )}

      {currentStep === 'success-launch' && (
        <SuccessLaunch
          onLaunch={handleLaunch}
          language={language}
          userName={userName}
        />
      )}
    </>
  );
}
