/**
 * KILIMO WORLD-CLASS ONBOARDING
 * Screen 6: Success & Launch
 * Celebration + Dashboard redirect
 */

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SuccessLaunchProps {
  onLaunch: () => void;
  language: 'en' | 'sw';
  userName: string;
}

export function SuccessLaunch({ onLaunch, language, userName }: SuccessLaunchProps) {
  const copy = {
    en: {
      title: "You're all set!",
      subtitle: "Let's grow together",
      welcome: `Welcome to KILIMO, ${userName}!`,
      ready: [
        { icon: '🌾', label: "Your dashboard is ready" },
        { icon: '💰', label: "Wallet is active" },
        { icon: '🤖', label: "AI assistant is online" },
        { icon: '📊', label: "Market prices updated" }
      ],
      cta: "Go to Dashboard",
      excitement: "Let's start farming smarter!"
    },
    sw: {
      title: "Umekamilika!",
      subtitle: "Hebu tukue pamoja",
      welcome: `Karibu KILIMO, ${userName}!`,
      ready: [
        { icon: '🌾', label: "Dashboard yako iko tayari" },
        { icon: '💰', label: "Pochi yako hai" },
        { icon: '🤖', label: "Msaidizi wa AI yuko mtandaoni" },
        { icon: '📊', label: "Bei za soko zimesasishwa" }
      ],
      cta: "Nenda Dashboard",
      excitement: "Hebu tuanze kulima kwa akili!"
    }
  };

  const t = copy[language];

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#7CB342', '#689F38', '#558B2F', '#FFD700']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#7CB342', '#689F38', '#558B2F', '#FFD700']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-green-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
            <motion.div
              className="absolute inset-0 bg-green-400 rounded-full opacity-20"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <motion.div
              className="absolute inset-4 bg-green-500 rounded-full opacity-30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.2, 0.4]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.3
              }}
            />
            <div className="relative z-10 flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#7CB342] to-[#558B2F] rounded-full">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {t.title}
            </h1>
            <p className="text-xl text-[#7CB342] font-semibold mb-2">
              {t.subtitle}
            </p>
            <p className="text-lg text-gray-600">
              {t.welcome}
            </p>
          </motion.div>
        </motion.div>

        {/* Ready checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-xl mb-6"
        >
          <div className="space-y-4">
            {t.ready.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-gray-800 font-medium">{item.label}</span>
                <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Excitement message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 mb-6 text-center border-2 border-green-200"
        >
          <Sparkles className="w-8 h-8 text-[#7CB342] mx-auto mb-3" />
          <p className="text-lg font-semibold text-gray-900">
            {t.excitement}
          </p>
        </motion.div>

        {/* Launch CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLaunch}
          className="w-full py-5 bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-3 group"
        >
          {t.cta}
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </motion.button>
      </div>
    </div>
  );
}
