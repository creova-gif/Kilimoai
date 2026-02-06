/**
 * KILIMO WORLD-CLASS ONBOARDING
 * Screen 3: Voice Welcome (Optional but 🔥)
 * AI voice assistant introduction
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, SkipForward, Play, Pause } from 'lucide-react';

interface VoiceWelcomeProps {
  onContinue: (useVoice: boolean) => void;
  language: 'en' | 'sw';
  userName?: string;
}

export function VoiceWelcome({ onContinue, language, userName }: VoiceWelcomeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const copy = {
    en: {
      title: "Meet your AI assistant",
      subtitle: "Let me guide you step by step",
      voiceText: `Hello${userName ? ` ${userName}` : ''}! I'm your KILIMO assistant. I'll help you set up your account and show you around. You can change the language anytime.`,
      continueWithVoice: "Continue with voice",
      skipVoice: "Skip voice guide",
      playPause: "Play / Pause",
      mute: "Mute",
      note: "Voice guides help you navigate faster"
    },
    sw: {
      title: "Kutana na msaidizi wako wa AI",
      subtitle: "Nitakuongoza hatua kwa hatua",
      voiceText: `Karibu${userName ? ` ${userName}` : ''}! Mimi ni msaidizi wako wa KILIMO. Nitakusaidia kuweka akaunti yako na kukuonyesha kila kitu. Unaweza kubadilisha lugha wakati wowote.`,
      continueWithVoice: "Endelea na sauti",
      skipVoice: "Ruka mwongozo wa sauti",
      playPause: "Cheza / Simamisha",
      mute: "Nyamazisha",
      note: "Miongozo ya sauti inakusaidia kusogea haraka"
    }
  };

  const t = copy[language];

  // Simulate voice playing (in production, integrate with OpenRouter TTS or ElevenLabs)
  const simulateVoicePlay = () => {
    setIsPlaying(true);
    // In production: trigger actual TTS here
    
    // Simulate 5-second voice message
    setTimeout(() => {
      setIsPlaying(false);
    }, 5000);
  };

  useEffect(() => {
    // Auto-play voice on mount (after 1s delay)
    const timer = setTimeout(() => {
      if (!isMuted) {
        simulateVoicePlay();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinueWithVoice = () => {
    onContinue(true);
  };

  const handleSkip = () => {
    onContinue(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      // Stop TTS
    } else {
      simulateVoicePlay();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Animated voice wave */}
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
            <motion.div
              className="absolute inset-0 bg-purple-400 rounded-full opacity-20"
              animate={isPlaying ? {
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.1, 0.3]
              } : {}}
              transition={{
                duration: 2,
                repeat: isPlaying ? Infinity : 0,
                ease: 'easeInOut'
              }}
            />
            <motion.div
              className="absolute inset-2 bg-purple-500 rounded-full opacity-30"
              animate={isPlaying ? {
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.2, 0.4]
              } : {}}
              transition={{
                duration: 1.5,
                repeat: isPlaying ? Infinity : 0,
                ease: 'easeInOut',
                delay: 0.2
              }}
            />
            <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.title}
          </h1>
          <p className="text-gray-600">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Voice text display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          <p className="text-lg text-gray-800 leading-relaxed">
            {t.voiceText}
          </p>

          {/* Voice controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={togglePlayPause}
              className="p-3 bg-purple-100 hover:bg-purple-200 rounded-full transition-colors"
              title={t.playPause}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-purple-600" />
              ) : (
                <Play className="w-5 h-5 text-purple-600" />
              )}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 bg-purple-100 hover:bg-purple-200 rounded-full transition-colors"
              title={t.mute}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-purple-600" />
              ) : (
                <Volume2 className="w-5 h-5 text-purple-600" />
              )}
            </button>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <button
            onClick={handleContinueWithVoice}
            className="w-full py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <Volume2 className="w-5 h-5" />
            {t.continueWithVoice}
          </button>

          <button
            onClick={handleSkip}
            className="w-full py-3 text-gray-600 font-medium hover:text-gray-900 flex items-center justify-center gap-2"
          >
            <SkipForward className="w-4 h-4" />
            {t.skipVoice}
          </button>
        </motion.div>

        {/* Info note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          💡 {t.note}
        </motion.p>
      </div>
    </div>
  );
}
