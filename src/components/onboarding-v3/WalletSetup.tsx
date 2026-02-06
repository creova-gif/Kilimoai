/**
 * KILIMO WORLD-CLASS ONBOARDING
 * Screen 5: Wallet Setup (Trust Moment)
 * Initialize wallet, show security
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wallet, Shield, Lock, Check, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface WalletSetupProps {
  onComplete: () => void;
  language: 'en' | 'sw';
  userId: string;
  phone: string;
  apiBase: string;
  apiKey: string;
}

export function WalletSetup({ onComplete, language, userId, phone, apiBase, apiKey }: WalletSetupProps) {
  const [loading, setLoading] = useState(true);
  const [walletCreated, setWalletCreated] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);

  const copy = {
    en: {
      title: "Your wallet is ready!",
      subtitle: "Secure, fast, and always available",
      balance: "Balance",
      linkedPhone: "Linked to",
      security: [
        { icon: Shield, label: "Bank-level encryption" },
        { icon: Lock, label: "Your money, your control" },
        { icon: Check, label: "Instant transactions" }
      ],
      deposit: "Deposit money",
      skipForNow: "Skip for now",
      creating: "Setting up your wallet...",
      note: "You can add money anytime from your dashboard"
    },
    sw: {
      title: "Pochi yako iko tayari!",
      subtitle: "Salama, haraka, na inapatikana kila wakati",
      balance: "Salio",
      linkedPhone: "Imeunganishwa na",
      security: [
        { icon: Shield, label: "Usalama wa kiwango cha benki" },
        { icon: Lock, label: "Pesa yako, udhibiti wako" },
        { icon: Check, label: "Malipo ya papo hapo" }
      ],
      deposit: "Weka pesa",
      skipForNow: "Ruka sasa",
      creating: "Inaanzisha pochi yako...",
      note: "Unaweza kuweka pesa wakati wowote kutoka dashboard"
    }
  };

  const t = copy[language];

  useEffect(() => {
    initializeWallet();
  }, []);

  const initializeWallet = async () => {
    setLoading(true);
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
        setWalletCreated(true);
        toast.success(language === 'en' ? 'Wallet created!' : 'Pochi imeundwa!');
      } else {
        throw new Error(data.message || 'Failed to create wallet');
      }
    } catch (error) {
      console.error('Wallet init error:', error);
      toast.error(language === 'en' 
        ? 'Failed to create wallet. Please try again.' 
        : 'Imeshindwa kuunda pochi. Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = () => {
    setShowDeposit(true);
    // In production, this would navigate to deposit flow
    toast.info(language === 'en' 
      ? 'Deposit feature coming soon!' 
      : 'Kipengele cha kuweka pesa kinakuja hivi karibuni!');
  };

  const handleSkip = () => {
    onComplete();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-flex items-center justify-center w-16 h-16 bg-[#7CB342] rounded-full mb-4"
          >
            <Wallet className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-lg text-gray-600">
            {t.creating}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
            <motion.div
              className="absolute inset-0 bg-green-400 rounded-full opacity-20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <div className="relative z-10 flex items-center justify-center w-20 h-20 bg-[#7CB342] rounded-full">
              <Wallet className="w-10 h-10 text-white" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white"
              >
                <Check className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.title}
          </h1>
          <p className="text-gray-600">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Wallet card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#7CB342] to-[#558B2F] rounded-2xl p-6 shadow-2xl mb-6 text-white"
        >
          <div className="mb-6">
            <p className="text-sm opacity-80 mb-1">{t.balance}</p>
            <p className="text-4xl font-bold">TZS 0</p>
          </div>

          <div className="pt-4 border-t border-white/20">
            <p className="text-xs opacity-80 mb-1">{t.linkedPhone}</p>
            <p className="font-mono">{phone}</p>
          </div>
        </motion.div>

        {/* Security features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="space-y-4">
            {t.security.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#7CB342]" />
                  </div>
                  <span className="text-gray-800">{item.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-3"
        >
          <button
            onClick={handleDeposit}
            className="w-full py-4 bg-[#7CB342] text-white font-semibold rounded-xl hover:bg-[#689F38] transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {t.deposit}
          </button>

          <button
            onClick={handleSkip}
            className="w-full py-3 text-gray-600 font-medium hover:text-gray-900"
          >
            {t.skipForNow}
          </button>
        </motion.div>

        {/* Info note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          💡 {t.note}
        </motion.p>
      </div>
    </div>
  );
}
