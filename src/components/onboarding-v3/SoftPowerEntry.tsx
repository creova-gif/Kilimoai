/**
 * KILIMO WORLD-CLASS ONBOARDING
 * Screen 0: Soft Power Entry
 * Inspired by: Twiga Foods, M-Pesa, Duolingo
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../figma:asset/59f0b6f20637b554072039bc3a2caa41a72f5af6.png';

interface SoftPowerEntryProps {
  onContinue: () => void;
  language: 'en' | 'sw';
}

export function SoftPowerEntry({ onContinue, language }: SoftPowerEntryProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Fade in content after mount
    setTimeout(() => setShowContent(true), 300);
  }, []);

  const copy = {
    en: {
      tagline1: "Smart farming.",
      tagline2: "Simple payments.",
      subtitle: "Grow more. Earn better. All in one place.",
      cta: "Get Started"
    },
    sw: {
      tagline1: "Kilimo bora.",
      tagline2: "Biashara rahisi.",
      subtitle: "Lima zaidi. Pata bei bora. Mahali pamoja.",
      cta: "Anza Sasa"
    }
  };

  const t = copy[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-green-50 relative overflow-hidden">
      {/* Animated Background - Calm motion */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-[#2E7D32] via-gray-100 to-white"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
          style={{
            backgroundSize: '200% 200%'
          }}
        />
      </div>

      {/* Floating particles (marketplace activity simulation) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#2E7D32] rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.6, 0.3],
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

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <AnimatePresence>
          {showContent && (
            <>
              {/* Logo fade-in */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="mb-12"
              >
                <img 
                  src={logo} 
                  alt="KILIMO" 
                  className="w-32 h-32 drop-shadow-2xl"
                />
              </motion.div>

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center mb-4"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {t.tagline1}
                </h1>
                <h1 className="text-4xl md:text-5xl font-bold text-[#2E7D32]">
                  {t.tagline2}
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg text-gray-600 text-center max-w-md mb-16"
              >
                {t.subtitle}
              </motion.p>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onContinue}
                className="px-12 py-4 bg-[#2E7D32] text-white text-lg font-semibold rounded-full shadow-lg hover:bg-[#1B5E20] transition-colors"
              >
                {t.cta}
              </motion.button>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="mt-12 flex items-center gap-6 text-sm text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#2E7D32] rounded-full animate-pulse" />
                  <span>{language === 'en' ? 'Secure' : 'Salama'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#2E7D32] rounded-full animate-pulse" />
                  <span>{language === 'en' ? 'Free forever' : 'Bure milele'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#2E7D32] rounded-full animate-pulse" />
                  <span>{language === 'en' ? '15,000+ farmers' : 'Wakulima 15,000+'}</span>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}