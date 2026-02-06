/**
 * KILIMO WORLD-CLASS ONBOARDING
 * Screen 2: Phone First (Trust Layer)
 * With OTP verification inline
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Phone, Shield, Lock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PhoneVerificationProps {
  onVerified: (phone: string, userId: string) => void;
  language: 'en' | 'sw';
  apiBase: string;
  apiKey: string;
}

export function PhoneVerification({ onVerified, language, apiBase, apiKey }: PhoneVerificationProps) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [countdown, setCountdown] = useState(60);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const copy = {
    en: {
      title: "Verify your phone",
      subtitle: "We use your number to protect your wallet and payments.",
      phoneLabel: "Phone number",
      phonePlaceholder: "712 345 678",
      sendOTP: "Send code",
      otpTitle: "Enter verification code",
      otpSubtitle: "Code sent to +255 ",
      resend: "Resend code",
      resendIn: "Resend in ",
      verifying: "Verifying...",
      sending: "Sending code...",
      trustNote: "🔒 Your number is secure and never shared"
    },
    sw: {
      title: "Thibitisha namba yako",
      subtitle: "Tunatumia namba yako kulinda pochi na malipo yako.",
      phoneLabel: "Namba ya simu",
      phonePlaceholder: "712 345 678",
      sendOTP: "Tuma msimbo",
      otpTitle: "Weka msimbo wa uthibitisho",
      otpSubtitle: "Msimbo umetumwa kwa +255 ",
      resend: "Tuma tena",
      resendIn: "Tuma tena baada ya ",
      verifying: "Inathibitisha...",
      sending: "Inatuma msimbo...",
      trustNote: "🔒 Namba yako ni salama na haishiriki"
    }
  };

  const t = copy[language];

  // Countdown timer for resend
  useEffect(() => {
    if (step === 'otp' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, step]);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  };

  const validatePhone = (value: string): boolean => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.length === 9 && ['6', '7'].includes(cleaned[0]);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    setPhone(formatted);
  };

  const handleSendOTP = async () => {
    if (!validatePhone(phone)) {
      toast.error(language === 'en' 
        ? 'Please enter a valid phone number' 
        : 'Tafadhali weka namba sahihi ya simu');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: `+255${phone.replace(/\D/g, '')}`,
          language,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setUserId(data.user_id);
        setStep('otp');
        setCountdown(60);
        toast.success(language === 'en' ? 'Code sent!' : 'Msimbo umetumwa!');
        
        // Auto-focus first OTP input
        setTimeout(() => otpRefs.current[0]?.focus(), 300);
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error(language === 'en' 
        ? 'Failed to send code. Please try again.' 
        : 'Imeshindwa kutuma msimbo. Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit on completion
    if (index === 5 && value) {
      const completeOtp = newOtp.join('');
      if (completeOtp.length === 6) {
        handleVerifyOTP(completeOtp);
      }
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const digits = pasteData.replace(/\D/g, '').slice(0, 6);

    if (digits.length === 6) {
      const newOtp = digits.split('');
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
      handleVerifyOTP(digits);
    }
  };

  const handleVerifyOTP = async (code: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          otp: code,
        }),
      });

      const data = await response.json();

      if (data.status === 'success' && data.verified) {
        toast.success(language === 'en' ? '✓ Phone verified!' : '✓ Simu imethibitishwa!');
        onVerified(`+255${phone.replace(/\D/g, '')}`, userId);
      } else {
        throw new Error(data.message || 'Invalid code');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error(language === 'en' 
        ? 'Invalid code. Please try again.' 
        : 'Msimbo sio sahihi. Jaribu tena.');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(60);
    handleSendOTP();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2E7D32] rounded-full mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.title}
          </h1>
          <p className="text-gray-600">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Phone Input */}
        {step === 'phone' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.phoneLabel}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  +255
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className="w-full pl-16 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 outline-none transition-all"
                  maxLength={11}
                  autoFocus
                />
              </div>
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading || !validatePhone(phone)}
              className="w-full py-4 bg-[#2E7D32] text-white font-semibold rounded-xl hover:bg-[#1B5E20] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              {loading ? t.sending : t.sendOTP}
            </button>

            {/* Trust indicators */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#2E7D32] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-800">
                  {t.trustNote}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* OTP Input */}
        {step === 'otp' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-6">
                {t.otpSubtitle}{phone.replace(/\D/g, '')}
              </p>

              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    onPaste={index === 0 ? handleOTPPaste : undefined}
                    disabled={loading}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 outline-none transition-all disabled:bg-gray-100"
                  />
                ))}
              </div>

              {loading && (
                <p className="text-sm text-gray-600 animate-pulse">
                  {t.verifying}
                </p>
              )}

              {countdown > 0 ? (
                <p className="text-sm text-gray-500">
                  {t.resendIn}{countdown}s
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-sm text-[#2E7D32] font-medium hover:underline"
                >
                  {t.resend}
                </button>
              )}
            </div>

            <button
              onClick={() => setStep('phone')}
              className="w-full py-3 text-gray-600 font-medium hover:text-gray-900"
            >
              {language === 'en' ? '← Change phone number' : '← Badilisha namba'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}