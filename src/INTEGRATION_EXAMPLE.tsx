/**
 * KILIMO APP.TSX INTEGRATION EXAMPLE
 * How to integrate OnboardingV3 into your main app
 */

import { useState, useEffect } from "react";
import { OnboardingV3 } from "./components/onboarding-v3/OnboardingV3";
import { projectId, publicAnonKey } from "./utils/supabase/info";
import { Toaster } from "sonner@2.0.3";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

  useEffect(() => {
    // Check if user is already registered
    const savedUser = localStorage.getItem("kilimoUser");
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setShowOnboarding(false);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("kilimoUser");
        setShowOnboarding(true);
      }
    } else {
      setShowOnboarding(true);
    }
    
    setLoading(false);
  }, []);

  const handleOnboardingComplete = (userData) => {
    console.log("Onboarding complete!", userData);
    setCurrentUser(userData);
    setShowOnboarding(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("kilimoUser");
    localStorage.removeItem("kilimoLanguage");
    setCurrentUser(null);
    setShowOnboarding(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading KILIMO...</p>
        </div>
      </div>
    );
  }

  // Show onboarding for new users
  if (showOnboarding) {
    return (
      <OnboardingV3
        onComplete={handleOnboardingComplete}
        apiBase={API_BASE}
        apiKey={publicAnonKey}
      />
    );
  }

  // Main app (existing dashboard)
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors />
      
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            KILIMO Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {currentUser?.name || currentUser?.phone}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">User Profile</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Phone:</span>
                <span className="ml-2 font-medium">{currentUser?.phone}</span>
              </div>
              <div>
                <span className="text-gray-500">Role:</span>
                <span className="ml-2 font-medium">{currentUser?.role}</span>
              </div>
              <div>
                <span className="text-gray-500">Language:</span>
                <span className="ml-2 font-medium">{currentUser?.language === 'sw' ? 'Swahili' : 'English'}</span>
              </div>
              <div>
                <span className="text-gray-500">Verified:</span>
                <span className="ml-2 font-medium text-green-600">✓ Yes</span>
              </div>
            </div>
          </div>

          {/* Wallet Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">Wallet</h2>
            <div className="space-y-2">
              <p className="text-3xl font-bold">
                TZS {currentUser?.wallet?.balance?.toLocaleString() || '0'}
              </p>
              <p className="text-sm opacity-80">
                Linked: {currentUser?.wallet?.linkedPhone || currentUser?.phone}
              </p>
              <button className="mt-4 w-full bg-white text-green-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100">
                Deposit Money
              </button>
            </div>
          </div>

          {/* Personalization Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Preferences</h2>
            {currentUser?.personalization && (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Products:</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {currentUser.personalization.products?.map((product) => (
                      <span key={product} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Scale:</span>
                  <span className="ml-2 font-medium">{currentUser.personalization.scale}</span>
                </div>
                <div>
                  <span className="text-gray-500">Payment:</span>
                  <span className="ml-2 font-medium">{currentUser.personalization.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-gray-500">Region:</span>
                  <span className="ml-2 font-medium capitalize">{currentUser.personalization.region}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard features would go here */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <span className="text-2xl mb-2 block">🌾</span>
              <span className="text-sm font-medium">My Crops</span>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <span className="text-2xl mb-2 block">📊</span>
              <span className="text-sm font-medium">Market Prices</span>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <span className="text-2xl mb-2 block">🤖</span>
              <span className="text-sm font-medium">Ask Sankofa</span>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <span className="text-2xl mb-2 block">📱</span>
              <span className="text-sm font-medium">Send Money</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * MIGRATION NOTES:
 * 
 * 1. The OnboardingV3 component is a complete drop-in replacement
 * 2. It handles its own routing between screens
 * 3. Once complete, it calls onComplete with full user data
 * 4. User data is automatically saved to localStorage
 * 5. The main app can then use currentUser state
 * 
 * WHAT GETS STORED:
 * - localStorage.getItem('kilimoUser') - Full user object
 * - localStorage.getItem('kilimoLanguage') - 'en' or 'sw'
 * - localStorage.getItem('kilimoSeenWelcome') - 'true'
 * 
 * USER OBJECT STRUCTURE:
 * {
 *   id: string,
 *   phone: string,
 *   role: string,
 *   language: 'en' | 'sw',
 *   name: string,
 *   useVoice: boolean,
 *   personalization: {
 *     products: string[],
 *     scale: string,
 *     paymentMethod: string,
 *     region: string
 *   },
 *   wallet: {
 *     balance: number,
 *     linkedPhone: string
 *   },
 *   onboardingCompleted: true,
 *   onboardingCompletedAt: ISO timestamp
 * }
 */
