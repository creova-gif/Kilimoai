/**
 * FARM SETUP NUDGE (Progressive Onboarding)
 * 
 * "Day-2" Nudge to encourage users to complete their profile
 * Shown prominently on Dashboard if profile is incomplete.
 */

import React from 'react';
import { Sprout, ArrowRight, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { motion, AnimatePresence } from 'motion/react';

interface FarmSetupNudgeProps {
  onSetup: () => void;
  onDismiss: () => void;
  language: 'en' | 'sw';
}

export function FarmSetupNudge({ onSetup, onDismiss, language }: FarmSetupNudgeProps) {
  const content = {
    en: {
      title: "Personalize Your Farm",
      description: "Complete your farm profile to get precision AI advice on planting, weather, and yield forecasting.",
      action: "Setup Farm",
      skip: "Maybe later"
    },
    sw: {
      title: "Boresha Shamba Lako",
      description: "Kamilisha wasifu wako wa shamba ili upate ushauri sahihi wa AI kuhusu kupanda, hali ya hewa, na mavuno.",
      action: "Sanidi Shamba",
      skip: "Baadaye"
    }
  };

  const t = content[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full"
    >
      <Card className="border-2 border-[#2E7D32]/20 bg-[#E8F5E9]/50 overflow-hidden relative">
        <button 
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 hover:bg-[#2E7D32]/10 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-[#2E7D32]" />
        </button>
        
        <CardContent className="p-5">
          <div className="flex gap-4 items-start">
            <div className="bg-[#2E7D32] p-3 rounded-2xl shrink-0">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <h3 className="font-bold text-[#1B5E20] text-lg leading-tight">
                  {t.title}
                </h3>
                <p className="text-[#2E7D32] text-sm mt-1 leading-snug">
                  {t.description}
                </p>
              </div>
              
              <div className="flex items-center gap-3 pt-1">
                <Button 
                  onClick={onSetup}
                  className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl px-5"
                >
                  {t.action}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <button 
                  onClick={onDismiss}
                  className="text-[#2E7D32] text-sm font-semibold hover:underline"
                >
                  {t.skip}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
