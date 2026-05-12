/**
 * INLINE PERSONALIZATION CARD
 * Non-blocking, dismissible card that appears on dashboard
 * Asks ONE simple question to improve AI recommendations
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Check, Wheat, Beef, Sprout, Briefcase, RefreshCw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface InlinePersonalizationCardProps {
  onComplete: (answer: string) => void;
  onDismiss: () => void;
  language: 'en' | 'sw';
}

export function InlinePersonalizationCard({ onComplete, onDismiss, language }: InlinePersonalizationCardProps) {
  const [selected, setSelected] = useState<string>('');

  const copy = {
    en: {
      title: "Quick question",
      subtitle: "What do you mainly farm or sell?",
      options: [
        { value: 'crops', label: 'Crops', description: 'Maize, rice, vegetables', icon: Wheat },
        { value: 'livestock', label: 'Livestock', description: 'Cattle, poultry, goats', icon: Beef },
        { value: 'inputs', label: 'Inputs', description: 'Seeds, fertilizer, tools', icon: Sprout },
        { value: 'trading', label: 'Trading', description: 'Buy and sell produce', icon: Briefcase },
        { value: 'mixed', label: 'Mixed', description: 'Multiple activities', icon: RefreshCw }
      ],
      dismiss: "Maybe later",
      helpText: "This helps us personalize your experience"
    },
    sw: {
      title: "Swali moja",
      subtitle: "Unalima au unauza nini zaidi?",
      options: [
        { value: 'crops', label: 'Mazao', description: 'Mahindi, mchele, mboga', icon: Wheat },
        { value: 'livestock', label: 'Mifugo', description: 'Ng\'ombe, kuku, mbuzi', icon: Beef },
        { value: 'inputs', label: 'Pembejeo', description: 'Mbegu, mbolea, zana', icon: Sprout },
        { value: 'trading', label: 'Biashara', description: 'Nunua na uza mazao', icon: Briefcase },
        { value: 'mixed', label: 'Mchanganyiko', description: 'Shughuli nyingi', icon: RefreshCw }
      ],
      dismiss: "Labda baadaye",
      helpText: "Hii inatusaidia kukupa huduma bora"
    }
  };

  const t = copy[language];

  const handleSelect = (value: string) => {
    setSelected(value);
    
    // Save immediately
    setTimeout(() => {
      localStorage.setItem('kilimoMainActivity', value);
      toast.success(
        language === 'en' 
          ? '✓ Preference saved!' 
          : '✓ Pendeleo limehifadhiwa!'
      );
      onComplete(value);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-lg border-2 border-[#2E7D32]/20 p-6 mb-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E8F5E9] rounded-lg">
            <Sparkles className="w-5 h-5 text-[#2E7D32]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{t.title}</h3>
            <p className="text-sm text-gray-600">{t.subtitle}</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {t.options.map((option) => {
          const isSelected = selected === option.value;
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-[#2E7D32] bg-[#E8F5E9] scale-105'
                  : 'border-gray-200 hover:border-[#2E7D32]/50 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-[#2E7D32]" />
                  <span className="text-base font-semibold text-gray-900">
                    {option.label}
                  </span>
                </div>
                {isSelected && (
                  <Check className="w-5 h-5 text-[#2E7D32] flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-600">{option.description}</p>
            </button>
          );
        })}
      </div>

      {/* Help Text */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{t.helpText}</p>
        <button
          onClick={onDismiss}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          {t.dismiss}
        </button>
      </div>
    </motion.div>
  );
}