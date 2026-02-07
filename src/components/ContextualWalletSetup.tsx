/**
 * CONTEXTUAL WALLET SETUP
 * Triggered when user tries to transact (not during onboarding)
 * Shows trust indicators and quick setup
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Shield, Lock, Check, X, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ContextualWalletSetupProps {
  onComplete: () => void;
  onSkip: () => void;
  language: 'en' | 'sw';
  userId: string;
  phone: string;
  apiBase: string;
  apiKey: string;
}

export function ContextualWalletSetup({
  onComplete,
  onSkip,
  language,
  userId,
  phone,
  apiBase,
  apiKey
}: ContextualWalletSetupProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'intro' | 'creating' | 'success'>('intro');
  const [isVisible, setIsVisible] = useState(true);

  const copy = {
    en: {
      title: "Set up your wallet",
      subtitle: "Required for payments and transactions",
      why: "Why do I need a wallet?",
      benefits: [
        { icon: Shield, text: "Bank-level security" },
        { icon: Lock, text: "Your money, your control" },
        { icon: Check, text: "Instant payments" }
      ],
      creating: "Setting up your wallet...",
      success: "Wallet created!",
      successMsg: "You can now make payments",
      setup: "Set up wallet",
      skip: "Maybe later",
      continue: "Continue",
      note: "Free to set up • No minimum balance"
    },
    sw: {
      title: "Weka pochi yako",
      subtitle: "Inahitajika kwa malipo na miamala",
      why: "Kwa nini nahitaji pochi?",
      benefits: [
        { icon: Shield, text: "Usalama wa kiwango cha benki" },
        { icon: Lock, text: "Pesa yako, udhibiti wako" },
        { icon: Check, text: "Malipo ya papo hapo" }
      ],
      creating: "Inaanzisha pochi yako...",
      success: "Pochi imeundwa!",
      successMsg: "Sasa unaweza kufanya malipo",
      setup: "Weka pochi",
      skip: "Labda baadaye",
      continue: "Endelea",
      note: "Bure kuanzisha • Hakuna salio la chini"
    }
  };

  const t = copy[language];

  const handleSetup = async () => {
    setLoading(true);
    setStep('creating');

    try {
      const response = await fetch(`${apiBase}/wallet/init`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          phone_number: phone,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setStep('success');
        toast.success(
          language === 'en' 
            ? '✓ Wallet created successfully!' 
            : '✓ Pochi imeundwa!'
        );
        
        // Auto-close after 2 seconds
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 300);
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to create wallet');
      }
    } catch (error) {
      console.error('Wallet setup error:', error);
      toast.error(
        language === 'en'
          ? 'Failed to create wallet. Please try again.'
          : 'Imeshindwa kuunda pochi. Jaribu tena.'
      );
      setStep('intro');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onSkip, 300);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
        >
          {/* Intro Step */}
          {step === 'intro' && (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#E8F5E9] rounded-xl">
                      <Wallet className="w-6 h-6 text-[#2E7D32]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
                      <p className="text-sm text-gray-600">{t.subtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSkip}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Why section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-[#2E7D32]" />
                    <h3 className="font-semibold text-gray-900">{t.why}</h3>
                  </div>
                  <div className="space-y-3">
                    {t.benefits.map((benefit, index) => {
                      const Icon = benefit.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="p-2 bg-white rounded-lg">
                            <Icon className="w-5 h-5 text-[#2E7D32]" />
                          </div>
                          <span className="text-sm text-gray-700">{benefit.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Note */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-gray-700 text-center">
                    💡 {t.note}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSkip}
                    className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                  >
                    {t.skip}
                  </button>
                  <button
                    onClick={handleSetup}
                    disabled={loading}
                    className="flex-1 py-3 bg-[#2E7D32] text-white font-semibold rounded-xl hover:bg-[#1B5E20] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    {t.setup}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Creating Step */}
          {step === 'creating' && (
            <div className="p-12 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-flex items-center justify-center w-16 h-16 bg-[#2E7D32] rounded-full mb-4"
              >
                <Wallet className="w-8 h-8 text-white" />
              </motion.div>
              <p className="text-lg text-gray-700 font-medium">
                {t.creating}
              </p>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-[#E8F5E9] rounded-full mb-4"
              >
                <Check className="w-10 h-10 text-[#2E7D32]" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t.success}
              </h3>
              <p className="text-gray-600">
                {t.successMsg}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
