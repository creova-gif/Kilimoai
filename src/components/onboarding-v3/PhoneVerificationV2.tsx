/**
 * PHONE VERIFICATION V2
 * World-class verification for new AND returning users
 * No banners, no marketing, just calm authentication
 */

import { useState, useRef, useEffect } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PhoneVerificationV2Props {
  phone: string;
  isReturning: boolean;
  onVerified: (userId: string) => void;
  onBack: () => void;
  language: 'en' | 'sw';
  apiBase: string;
  apiKey: string;
}

export function PhoneVerificationV2({ 
  phone, 
  isReturning, 
  onVerified, 
  onBack, 
  language,
  apiBase,
  apiKey 
}: PhoneVerificationV2Props) {
  const [mode, setMode] = useState<'otp' | 'password'>(isReturning ? 'password' : 'otp');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const copy = {
    en: {
      title: isReturning ? 'Welcome back' : 'Verify phone',
      subtitle: isReturning 
        ? 'Choose how to log in' 
        : 'We\'ll send you a verification code',
      sendCode: 'Send code',
      codeSent: 'Code sent',
      enterCode: 'Enter verification code',
      enterPassword: 'Enter password',
      useOtp: 'Use code instead',
      usePassword: 'Use password instead',
      resend: 'Resend code',
      resendIn: 'Resend in',
      verifying: 'Verifying...',
      loggingIn: 'Logging in...',
      seconds: 's',
      secure: 'Your data is encrypted and secure',
    },
    sw: {
      title: isReturning ? 'Karibu tena' : 'Thibitisha simu',
      subtitle: isReturning 
        ? 'Chagua njia ya kuingia' 
        : 'Tutakutumia msimbo wa uthibitisho',
      sendCode: 'Tuma msimbo',
      codeSent: 'Msimbo umetumwa',
      enterCode: 'Weka msimbo wa uthibitisho',
      enterPassword: 'Weka nenosiri',
      useOtp: 'Tumia msimbo badala yake',
      usePassword: 'Tumia nenosiri badala yake',
      resend: 'Tuma tena',
      resendIn: 'Tuma tena baada ya',
      verifying: 'Inathibitisha...',
      loggingIn: 'Inaingia...',
      seconds: 's',
      secure: 'Data yako ni salama na imefichwa',
    }
  };

  const t = copy[language];

  // Send OTP on mount if new user
  useEffect(() => {
    if (!isReturning && !otpSent) {
      sendOtp();
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (otpSent && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [otpSent, countdown]);

  const sendOtp = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${apiBase}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phone,
          language: language,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setOtpSent(true);
        setCountdown(60);
        setCanResend(false);
        
        // Show OTP in console (demo mode fallback)
        console.log('🔐 OTP Code:', data.otp || '123456');
        
        toast.success(
          language === 'en' 
            ? 'Code sent to your phone' 
            : 'Msimbo umetumwa kwa simu yako'
        );
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error(
        language === 'en'
          ? 'Failed to send code. Please try again.'
          : 'Imeshindwa kutuma msimbo. Jaribu tena.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit on completion
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
    
    if (pastedData.length === 6) {
      verifyOtp(pastedData);
    }
  };

  const verifyOtp = async (code: string) => {
    setLoading(true);

    try {
      const response = await fetch(`${apiBase}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phone,
          otp: code,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        onVerified(data.user_id);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error(
        language === 'en'
          ? 'Invalid code. Please try again.'
          : 'Msimbo si sahihi. Jaribu tena.'
      );
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!password) return;
    
    setLoading(true);

    try {
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phone,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        onVerified(data.user_id);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(
        language === 'en'
          ? 'Incorrect password. Try again or use code.'
          : 'Nenosiri si sahihi. Jaribu tena au tumia msimbo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Back Button */}
      <div className="flex-shrink-0 pt-6 pb-4 px-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center gap-2 text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-gray-600">{phone}</p>
          </div>

          {/* OTP Mode */}
          {mode === 'otp' && (
            <div className="space-y-6">
              {/* Send Code Button (if not sent) */}
              {!otpSent && (
                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full py-4 bg-[#2E7D32] text-white font-semibold text-lg rounded-2xl hover:bg-[#1B5E20] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {loading ? t.verifying : t.sendCode}
                </button>
              )}

              {/* OTP Input (after sent) */}
              {otpSent && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 text-center mb-4">
                      {t.enterCode}
                    </p>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpRefs.current[index] = el)}
                          type="tel"
                          inputMode="numeric"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={handleOtpPaste}
                          disabled={loading}
                          maxLength={1}
                          className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/10 outline-none transition-all disabled:bg-gray-100"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Resend */}
                  <div className="text-center">
                    {canResend ? (
                      <button
                        onClick={sendOtp}
                        disabled={loading}
                        className="text-sm text-[#2E7D32] font-medium hover:underline"
                      >
                        {t.resend}
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {t.resendIn} {countdown}{t.seconds}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Password Mode (returning users) */}
          {mode === 'password' && (
            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.enterPassword}
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/10 outline-none transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordLogin()}
              />
              <button
                onClick={handlePasswordLogin}
                disabled={loading || !password}
                className="w-full py-4 bg-[#2E7D32] text-white font-semibold text-lg rounded-2xl hover:bg-[#1B5E20] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {loading ? t.loggingIn : t.title}
              </button>
            </div>
          )}

          {/* Switch Mode (returning users only) */}
          {isReturning && (
            <button
              onClick={() => {
                setMode(mode === 'otp' ? 'password' : 'otp');
                if (mode === 'password' && !otpSent) {
                  sendOtp();
                }
              }}
              className="w-full text-sm text-gray-600 hover:text-[#2E7D32] transition-colors"
            >
              {mode === 'otp' ? t.usePassword : t.useOtp}
            </button>
          )}

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-gray-500 pt-4">
            <Shield className="w-4 h-4" />
            <p className="text-xs">{t.secure}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
