/**
 * UNIFIED ACCESS SCREEN
 * World-class entry point for BOTH new and returning users
 * No marketing, no redundancy, just calm access
 */

import { useState } from 'react';
import { Phone, ChevronRight } from 'lucide-react';
import logo from 'figma:asset/59f0b6f20637b554072039bc3a2caa41a72f5af6.png';

interface UnifiedAccessScreenProps {
  onContinue: (phone: string, isReturning: boolean) => void;
  language: 'en' | 'sw';
}

export function UnifiedAccessScreen({ onContinue, language }: UnifiedAccessScreenProps) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const copy = {
    en: {
      tagline: 'Smart farming, simple payments',
      phoneLabel: 'Phone number',
      phonePlaceholder: '712 345 678',
      continue: 'Continue',
      returning: 'Already registered? Log in',
    },
    sw: {
      tagline: 'Kilimo mahiri, malipo rahisi',
      phoneLabel: 'Namba ya simu',
      phonePlaceholder: '712 345 678',
      continue: 'Endelea',
      returning: 'Umeshasajili? Ingia',
    }
  };

  const t = copy[language];

  // Auto-format phone as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 9) {
      value = value.slice(0, 9);
    }
    
    // Format: XXX XXX XXX
    if (value.length > 6) {
      value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)} ${value.slice(3)}`;
    }
    
    setPhone(value);
  };

  // Validate phone number
  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\s/g, '');
    return /^[67]\d{8}$/.test(cleaned);
  };

  const handleContinue = async () => {
    if (!validatePhone(phone)) return;
    
    setLoading(true);
    const cleanPhone = phone.replace(/\s/g, '');
    
    // Check if user exists (backend call)
    // For now, simulate by checking localStorage
    const existingUser = localStorage.getItem('kilimoUser');
    const isReturning = existingUser ? JSON.parse(existingUser).phone?.includes(cleanPhone) : false;
    
    setTimeout(() => {
      onContinue(`+255${cleanPhone}`, isReturning);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 pt-8 pb-6 px-6">
        <div className="flex flex-col items-center">
          <img src={logo} alt="KILIMO" className="h-16 w-auto mb-4" />
          <p className="text-gray-600 text-center text-sm max-w-xs">
            {t.tagline}
          </p>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm space-y-6">
          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.phoneLabel}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500">
                <Phone className="w-5 h-5" />
                <span className="text-base font-medium">+255</span>
                <div className="w-px h-6 bg-gray-300 ml-1" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder={t.phonePlaceholder}
                className="w-full pl-28 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/10 outline-none transition-all"
                maxLength={11}
                autoFocus
              />
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={loading || !validatePhone(phone)}
            className="w-full py-4 bg-[#2E7D32] text-white font-semibold text-lg rounded-2xl hover:bg-[#1B5E20] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {t.continue}
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom - Subtle secondary action */}
      <div className="flex-shrink-0 pb-8 px-6 text-center">
        <button
          onClick={() => {
            // Future: Show login with password option
          }}
          className="text-sm text-gray-500 hover:text-[#2E7D32] transition-colors"
        >
          {t.returning}
        </button>
      </div>
    </div>
  );
}
