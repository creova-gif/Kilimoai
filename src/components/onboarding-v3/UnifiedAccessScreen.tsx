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
      {/* Logo area */}
      <div className="flex-shrink-0 flex flex-col items-center pt-16 pb-8 px-6">
        <img src={logo} alt="KILIMO" className="h-14 w-auto mb-6" />
        <p className="text-gray-500 text-sm text-center">{t.tagline}</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pb-12">
        <div className="max-w-sm mx-auto space-y-5">
          {/* Phone input */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-900"
            >
              {t.phoneLabel}
            </label>
            <div className="relative">
              {/* Country prefix */}
              <div className="absolute left-0 inset-y-0 flex items-center pl-4 pointer-events-none">
                <span className="text-gray-500 font-medium text-sm">🇹🇿 +255</span>
              </div>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder={t.phonePlaceholder}
                className="
                  w-full pl-24 pr-4 py-4 text-base
                  border-2 border-gray-200 rounded-2xl
                  focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20
                  transition-all duration-200
                  placeholder:text-gray-400
                "
                onKeyDown={(e) => {
                  if (e.key === "Enter" && validatePhone(phone)) handleContinue();
                }}
              />
            </div>
          </div>

          {/* Continue button */}
          <button
            onClick={handleContinue}
            disabled={!validatePhone(phone) || loading}
            className="
              w-full flex items-center justify-center gap-2
              py-4 px-6 rounded-2xl
              bg-[#2E7D32] text-white font-semibold text-base
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-[#1B5E20] active:scale-[0.98]
              transition-all duration-200
              shadow-lg shadow-[#2E7D32]/25
            "
          >
            {loading ? (
              <span className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {t.continue}
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              {language === "en" ? "or" : "au"}
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Returning user hint */}
          <p className="text-center text-sm text-gray-500">
            <Phone className="inline h-3.5 w-3.5 mr-1 text-gray-400" />
            {t.returning}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 pb-8 px-6 text-center">
        <p className="text-xs text-gray-400">
          {language === "en"
            ? "By continuing you agree to our Terms & Privacy Policy"
            : "Kwa kuendelea unakubali Masharti na Sera ya Faragha yetu"}
        </p>
      </div>
    </div>
  );
}