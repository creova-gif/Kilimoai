/**
 * ONBOARDING V3 - TESTING COMPONENT
 * Manual testing interface for the 2-screen flow
 * Use this to test the complete onboarding experience
 */

import { useState } from 'react';
import { OnboardingV3 } from './OnboardingV3';
import { CheckCircle, XCircle, Clock, User, Phone, Sparkles } from 'lucide-react';

export function OnboardingTest() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [completedUser, setCompletedUser] = useState<any>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Start timer when component mounts
  useState(() => {
    setStartTime(Date.now());
  });

  const handleOnboardingComplete = (userData: any) => {
    const endTime = Date.now();
    const duration = startTime ? (endTime - startTime) / 1000 : 0;

    // Record test results
    const results = [
      {
        test: 'Onboarding Completion',
        status: 'pass',
        message: 'User successfully completed onboarding'
      },
      {
        test: 'Time to Dashboard',
        status: duration <= 35 ? 'pass' : 'warn',
        message: `Completed in ${duration.toFixed(1)}s (target: <35s)`
      },
      {
        test: 'User Data Structure',
        status: userData.id && userData.phone && userData.role ? 'pass' : 'fail',
        message: 'User data contains all required fields'
      },
      {
        test: 'Language Support',
        status: ['en', 'sw'].includes(userData.language) ? 'pass' : 'fail',
        message: `Language set to: ${userData.language}`
      },
      {
        test: 'localStorage',
        status: localStorage.getItem('kilimoUser') ? 'pass' : 'fail',
        message: 'User data saved to localStorage'
      }
    ];

    setTestResults(results);
    setCompletedUser(userData);
    setShowOnboarding(false);
  };

  const resetTest = () => {
    setShowOnboarding(true);
    setCompletedUser(null);
    setTestResults([]);
    setStartTime(Date.now());
    localStorage.removeItem('kilimoUser');
    localStorage.removeItem('kilimoLanguage');
    localStorage.removeItem('kilimoSeenWelcome');
  };

  if (showOnboarding) {
    return (
      <>
        {/* Timer Display */}
        <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 border-2 border-[#2E7D32]">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#2E7D32]" />
            <span className="text-sm font-medium">Test Mode Active</span>
          </div>
        </div>

        <OnboardingV3
          onComplete={handleOnboardingComplete}
          apiBase={`https://${import.meta.env.VITE_SUPABASE_PROJECT_ID || 'your-project'}.supabase.co/functions/v1/make-server-ce1844e7`}
          apiKey={import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2E7D32] rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Onboarding Test Complete
          </h1>
          <p className="text-gray-600">
            Review the results below
          </p>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Test Results</h2>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 rounded-lg ${
                  result.status === 'pass'
                    ? 'bg-green-50 border border-green-200'
                    : result.status === 'warn'
                    ? 'bg-yellow-50 border border-yellow-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                {result.status === 'pass' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{result.test}</p>
                  <p className="text-sm text-gray-600">{result.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Data Display */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">User Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-[#2E7D32]" />
                <span className="text-sm font-semibold text-gray-700">User ID</span>
              </div>
              <p className="text-sm text-gray-900 font-mono break-all">
                {completedUser?.id || 'N/A'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-[#2E7D32]" />
                <span className="text-sm font-semibold text-gray-700">Phone</span>
              </div>
              <p className="text-sm text-gray-900 font-mono">
                {completedUser?.phone || 'N/A'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                <span className="text-sm font-semibold text-gray-700">Role</span>
              </div>
              <p className="text-sm text-gray-900 capitalize">
                {completedUser?.role || 'N/A'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                <span className="text-sm font-semibold text-gray-700">Language</span>
              </div>
              <p className="text-sm text-gray-900 uppercase">
                {completedUser?.language || 'N/A'}
              </p>
            </div>
          </div>

          {/* Full JSON */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-[#2E7D32] hover:underline">
              View Full JSON
            </summary>
            <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg text-xs overflow-x-auto">
              {JSON.stringify(completedUser, null, 2)}
            </pre>
          </details>
        </div>

        {/* localStorage Display */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">localStorage Keys</h2>
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <span className="text-sm font-mono text-gray-700">kilimoUser</span>
              <span className={`text-xs px-2 py-1 rounded ${
                localStorage.getItem('kilimoUser')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {localStorage.getItem('kilimoUser') ? 'SET' : 'NOT SET'}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <span className="text-sm font-mono text-gray-700">kilimoLanguage</span>
              <span className={`text-xs px-2 py-1 rounded ${
                localStorage.getItem('kilimoLanguage')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {localStorage.getItem('kilimoLanguage') ? 'SET' : 'NOT SET'}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <span className="text-sm font-mono text-gray-700">kilimoSeenWelcome</span>
              <span className={`text-xs px-2 py-1 rounded ${
                localStorage.getItem('kilimoSeenWelcome')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {localStorage.getItem('kilimoSeenWelcome') ? 'SET' : 'NOT SET'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={resetTest}
            className="flex-1 py-4 bg-[#2E7D32] text-white font-semibold rounded-xl hover:bg-[#1B5E20] transition-colors shadow-lg"
          >
            Run Test Again
          </button>
          <button
            onClick={() => {
              console.log('Test Results:', testResults);
              console.log('User Data:', completedUser);
            }}
            className="px-6 py-4 border-2 border-[#2E7D32] text-[#2E7D32] font-semibold rounded-xl hover:bg-green-50 transition-colors"
          >
            Log to Console
          </button>
        </div>

        {/* Testing Checklist */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Manual Testing Checklist</h2>
          <div className="space-y-2 text-sm">
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Role Selection:</strong> All 4 roles display correctly with icons
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Phone Input:</strong> Auto-formats as "XXX XXX XXX"
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Phone Validation:</strong> Rejects invalid numbers
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>OTP Send:</strong> Shows success toast
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>OTP Input:</strong> Auto-advances between digits
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>OTP Verify:</strong> Auto-submits on 6th digit
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Welcome Toast:</strong> Shows bilingual welcome message
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Time:</strong> Completes in under 35 seconds
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Mobile:</strong> Works on mobile viewport
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <span className="text-gray-700">
                <strong>Colors:</strong> Only #2E7D32 green used (no purple/pink/blue)
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
