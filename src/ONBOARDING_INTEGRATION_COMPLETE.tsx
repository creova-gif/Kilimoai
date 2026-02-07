/**
 * COMPLETE ONBOARDING V3 INTEGRATION GUIDE
 * Shows how to integrate:
 * 1. OnboardingV3 (2-screen flow)
 * 2. PostOnboardingPersonalization (dashboard card)
 * 3. ContextualWalletSetup (when transacting)
 * 4. OnboardingTest (for testing)
 */

import { useState, useEffect } from 'react';
import { Toaster } from 'sonner@2.0.3';
import { OnboardingV3 } from './components/onboarding-v3/OnboardingV3';
import { PostOnboardingPersonalization, PersonalizationData } from './components/PostOnboardingPersonalization';
import { ContextualWalletSetup } from './components/ContextualWalletSetup';
import { OnboardingTest } from './components/onboarding-v3/OnboardingTest';
import { projectId, publicAnonKey } from './utils/supabase/info';

// Type definitions
interface User {
  id: string;
  phone: string;
  role: string;
  language: 'en' | 'sw';
  onboardingCompleted: boolean;
  onboardingCompletedAt: string;
  personalizationCompleted?: boolean;
  walletInitialized?: boolean;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [showWalletSetup, setShowWalletSetup] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

  // Check for existing user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('kilimoUser');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      
      // Show personalization if not completed
      if (user.onboardingCompleted && !user.personalizationCompleted) {
        // Delay to show dashboard first
        setTimeout(() => {
          setShowPersonalization(true);
        }, 3000);
      }
    } else {
      // New user - show onboarding
      setShowOnboarding(true);
    }
  }, []);

  // Handle onboarding completion
  const handleOnboardingComplete = (userData: any) => {
    const user: User = {
      ...userData,
      onboardingCompleted: true,
      personalizationCompleted: false,
      walletInitialized: false,
    };
    
    setCurrentUser(user);
    setShowOnboarding(false);
    
    // Show personalization after 3 seconds
    setTimeout(() => {
      setShowPersonalization(true);
    }, 3000);
  };

  // Handle personalization completion
  const handlePersonalizationComplete = (data: PersonalizationData) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        personalizationCompleted: true,
        preferences: data,
      };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('kilimoUser', JSON.stringify(updatedUser));
    }
    setShowPersonalization(false);
  };

  // Handle personalization skip
  const handlePersonalizationSkip = () => {
    setShowPersonalization(false);
  };

  // Handle wallet setup completion
  const handleWalletSetupComplete = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        walletInitialized: true,
      };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('kilimoUser', JSON.stringify(updatedUser));
    }
    setShowWalletSetup(false);
  };

  // Handle wallet setup skip
  const handleWalletSetupSkip = () => {
    setShowWalletSetup(false);
  };

  // Trigger wallet setup contextually
  const handleDepositClick = () => {
    if (!currentUser?.walletInitialized) {
      setShowWalletSetup(true);
    } else {
      // Proceed to deposit flow
      console.log('Proceed to deposit');
    }
  };

  const handleBuyClick = () => {
    if (!currentUser?.walletInitialized) {
      setShowWalletSetup(true);
    } else {
      // Proceed to purchase flow
      console.log('Proceed to purchase');
    }
  };

  // Enable test mode
  const enableTestMode = () => {
    // Clear all data
    localStorage.removeItem('kilimoUser');
    localStorage.removeItem('kilimoLanguage');
    localStorage.removeItem('kilimoSeenWelcome');
    localStorage.removeItem('kilimoPersonalization');
    
    setIsTestMode(true);
    setCurrentUser(null);
    setShowOnboarding(false);
  };

  // ==========================================
  // RENDERING
  // ==========================================

  // Test Mode
  if (isTestMode) {
    return <OnboardingTest />;
  }

  // Onboarding Flow
  if (showOnboarding) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <OnboardingV3
          onComplete={handleOnboardingComplete}
          apiBase={API_BASE}
          apiKey={publicAnonKey}
        />
      </>
    );
  }

  // Main Dashboard
  return (
    <>
      <Toaster position="top-center" richColors />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                KILIMO Dashboard
              </h1>
              
              {/* Test Mode Button */}
              <button
                onClick={enableTestMode}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Test Onboarding
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {currentUser?.language === 'en' 
                ? `Welcome back!` 
                : `Karibu tena!`}
            </h2>
            <p className="text-gray-600">
              {currentUser?.language === 'en'
                ? 'Manage your farm and grow your business'
                : 'Simamia shamba lako na kua biashara yako'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={handleDepositClick}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-[#2E7D32]"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                💰 {currentUser?.language === 'en' ? 'Deposit Money' : 'Weka Pesa'}
              </h3>
              <p className="text-sm text-gray-600">
                {currentUser?.language === 'en' 
                  ? 'Add money to your wallet' 
                  : 'Ongeza pesa kwenye pochi yako'}
              </p>
            </button>

            <button
              onClick={handleBuyClick}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-[#2E7D32]"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                🛒 {currentUser?.language === 'en' ? 'Buy Inputs' : 'Nunua Pembejeo'}
              </h3>
              <p className="text-sm text-gray-600">
                {currentUser?.language === 'en'
                  ? 'Purchase seeds, fertilizer, and more'
                  : 'Nunua mbegu, mbolea, na zaidi'}
              </p>
            </button>

            <button
              onClick={() => setShowPersonalization(true)}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-[#2E7D32]"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                ⚙️ {currentUser?.language === 'en' ? 'Personalize' : 'Weka Mapendeleo'}
              </h3>
              <p className="text-sm text-gray-600">
                {currentUser?.language === 'en'
                  ? 'Customize your experience'
                  : 'Panga huduma yako'}
              </p>
            </button>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {currentUser?.language === 'en' ? 'Your Account' : 'Akaunti Yako'}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">User ID:</span>
                <span className="font-mono text-gray-900">{currentUser?.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Phone:</span>
                <span className="font-mono text-gray-900">{currentUser?.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Role:</span>
                <span className="capitalize text-gray-900">{currentUser?.role}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Language:</span>
                <span className="uppercase text-gray-900">{currentUser?.language}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Personalization:</span>
                <span className={currentUser?.personalizationCompleted ? 'text-green-600' : 'text-yellow-600'}>
                  {currentUser?.personalizationCompleted ? '✓ Complete' : '⏳ Pending'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Wallet:</span>
                <span className={currentUser?.walletInitialized ? 'text-green-600' : 'text-gray-400'}>
                  {currentUser?.walletInitialized ? '✓ Active' : '○ Not set up'}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Post-Onboarding Personalization Modal */}
      {showPersonalization && currentUser && (
        <PostOnboardingPersonalization
          onComplete={handlePersonalizationComplete}
          onSkip={handlePersonalizationSkip}
          language={currentUser.language}
          userRole={currentUser.role}
        />
      )}

      {/* Contextual Wallet Setup Modal */}
      {showWalletSetup && currentUser && (
        <ContextualWalletSetup
          onComplete={handleWalletSetupComplete}
          onSkip={handleWalletSetupSkip}
          language={currentUser.language}
          userId={currentUser.id}
          phone={currentUser.phone}
          apiBase={API_BASE}
          apiKey={publicAnonKey}
        />
      )}
    </>
  );
}

/**
 * ==========================================
 * INTEGRATION NOTES
 * ==========================================
 * 
 * 1. ONBOARDING (First-time users)
 *    - Shows OnboardingV3 component
 *    - 2 screens: Role → Phone verification
 *    - 20-30 seconds total
 *    - Saves to localStorage on completion
 * 
 * 2. POST-ONBOARDING PERSONALIZATION
 *    - Shows 3 seconds after onboarding
 *    - Non-blocking modal
 *    - Can be skipped
 *    - Can be triggered again from settings
 * 
 * 3. CONTEXTUAL WALLET SETUP
 *    - Triggered when user tries to:
 *      - Deposit money
 *      - Make a purchase
 *      - Access financial features
 *    - Shows trust indicators
 *    - Can be skipped (will ask again later)
 * 
 * 4. TESTING
 *    - Click "Test Onboarding" button
 *    - Clears all localStorage
 *    - Shows OnboardingTest component
 *    - Records metrics and results
 * 
 * ==========================================
 * KEY FEATURES
 * ==========================================
 * 
 * ✅ 2-screen onboarding (not 7)
 * ✅ Progressive disclosure
 * ✅ Contextual feature requests
 * ✅ Non-blocking personalization
 * ✅ Bilingual support (EN/SW)
 * ✅ localStorage persistence
 * ✅ Test mode for QA
 * ✅ 100% color compliance (#2E7D32)
 * 
 * ==========================================
 * WHAT CHANGED
 * ==========================================
 * 
 * BEFORE:
 * - 7 screens during onboarding
 * - Forced wallet setup
 * - Forced personalization
 * - Celebration screens
 * - 90-120 seconds
 * 
 * AFTER:
 * - 2 screens during onboarding
 * - Contextual wallet setup
 * - Optional personalization
 * - Immediate dashboard access
 * - 20-30 seconds
 * 
 * ==========================================
 */
