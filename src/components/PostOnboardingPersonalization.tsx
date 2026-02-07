/**
 * POST-ONBOARDING PERSONALIZATION
 * Non-blocking personalization cards that appear AFTER onboarding
 * Shows in dashboard to improve recommendations
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, ChevronRight, MapPin, Sprout, CreditCard, TrendingUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PersonalizationCardProps {
  onComplete: (data: PersonalizationData) => void;
  onSkip: () => void;
  language: 'en' | 'sw';
  userRole: string;
}

export interface PersonalizationData {
  crops?: string[];
  region?: string;
  farmSize?: string;
  interests?: string[];
}

export function PostOnboardingPersonalization({ onComplete, onSkip, language, userRole }: PersonalizationCardProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<PersonalizationData>({
    crops: [],
    region: '',
    farmSize: '',
    interests: []
  });

  const copy = {
    en: {
      title: "Quick setup",
      subtitle: "Help us personalize your experience (30 seconds)",
      skip: "Skip for now",
      next: "Next",
      done: "Done",
      steps: [
        {
          id: 'crops',
          title: "What do you grow?",
          subtitle: "Select all that apply",
          icon: Sprout,
          options: [
            { value: 'maize', label: 'Maize' },
            { value: 'rice', label: 'Rice' },
            { value: 'beans', label: 'Beans' },
            { value: 'coffee', label: 'Coffee' },
            { value: 'banana', label: 'Banana' },
            { value: 'cassava', label: 'Cassava' },
            { value: 'vegetables', label: 'Vegetables' },
            { value: 'fruits', label: 'Fruits' }
          ]
        },
        {
          id: 'region',
          title: "Your region?",
          subtitle: "For local market prices",
          icon: MapPin,
          options: [
            { value: 'arusha', label: 'Arusha' },
            { value: 'dar', label: 'Dar es Salaam' },
            { value: 'dodoma', label: 'Dodoma' },
            { value: 'kilimanjaro', label: 'Kilimanjaro' },
            { value: 'mbeya', label: 'Mbeya' },
            { value: 'morogoro', label: 'Morogoro' },
            { value: 'mwanza', label: 'Mwanza' },
            { value: 'tanga', label: 'Tanga' }
          ]
        }
      ]
    },
    sw: {
      title: "Usanidi wa haraka",
      subtitle: "Tusaidie kukupa huduma bora (sekunde 30)",
      skip: "Ruka sasa",
      next: "Ifuatayo",
      done: "Maliza",
      steps: [
        {
          id: 'crops',
          title: "Unalima nini?",
          subtitle: "Chagua yote yanayofaa",
          icon: Sprout,
          options: [
            { value: 'maize', label: 'Mahindi' },
            { value: 'rice', label: 'Mchele' },
            { value: 'beans', label: 'Maharagwe' },
            { value: 'coffee', label: 'Kahawa' },
            { value: 'banana', label: 'Ndizi' },
            { value: 'cassava', label: 'Muhogo' },
            { value: 'vegetables', label: 'Mboga' },
            { value: 'fruits', label: 'Matunda' }
          ]
        },
        {
          id: 'region',
          title: "Mkoa wako?",
          subtitle: "Kwa bei za soko la karibu",
          icon: MapPin,
          options: [
            { value: 'arusha', label: 'Arusha' },
            { value: 'dar', label: 'Dar es Salaam' },
            { value: 'dodoma', label: 'Dodoma' },
            { value: 'kilimanjaro', label: 'Kilimanjaro' },
            { value: 'mbeya', label: 'Mbeya' },
            { value: 'morogoro', label: 'Morogoro' },
            { value: 'mwanza', label: 'Mwanza' },
            { value: 'tanga', label: 'Tanga' }
          ]
        }
      ]
    }
  };

  const t = copy[language];
  const currentStepData = t.steps[currentStep];
  const Icon = currentStepData.icon;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onSkip(), 300);
  };

  const handleCropToggle = (value: string) => {
    const current = data.crops || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setData({ ...data, crops: updated });
  };

  const handleRegionSelect = (value: string) => {
    setData({ ...data, region: value });
  };

  const handleNext = () => {
    if (currentStep < t.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save and complete
      localStorage.setItem('kilimoPersonalization', JSON.stringify(data));
      toast.success(
        language === 'en'
          ? '✓ Preferences saved!'
          : '✓ Mapendeleo yamehifadhiwa!'
      );
      setIsVisible(false);
      setTimeout(() => onComplete(data), 300);
    }
  };

  const canProceed = () => {
    if (currentStepData.id === 'crops') {
      return data.crops && data.crops.length > 0;
    }
    if (currentStepData.id === 'region') {
      return Boolean(data.region);
    }
    return true;
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#E8F5E9] rounded-lg">
                  <Sparkles className="w-5 h-5 text-[#2E7D32]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
                  <p className="text-sm text-gray-600">{t.subtitle}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
              {t.steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-[#2E7D32]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[#E8F5E9] rounded-xl">
                    <Icon className="w-6 h-6 text-[#2E7D32]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {currentStepData.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentStepData.subtitle}
                    </p>
                  </div>
                </div>

                {/* Crops - Multi-select */}
                {currentStepData.id === 'crops' && (
                  <div className="grid grid-cols-2 gap-3">
                    {currentStepData.options.map((option) => {
                      const isSelected = data.crops?.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleCropToggle(option.value)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? 'border-[#2E7D32] bg-[#E8F5E9]'
                              : 'border-gray-200 hover:border-[#2E7D32]/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {option.label}
                            </span>
                            {isSelected && (
                              <Check className="w-5 h-5 text-[#2E7D32]" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Region - Single select */}
                {currentStepData.id === 'region' && (
                  <div className="space-y-2">
                    {currentStepData.options.map((option) => {
                      const isSelected = data.region === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleRegionSelect(option.value)}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? 'border-[#2E7D32] bg-[#E8F5E9]'
                              : 'border-gray-200 hover:border-[#2E7D32]/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {option.label}
                            </span>
                            {isSelected && (
                              <Check className="w-5 h-5 text-[#2E7D32]" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors"
              >
                {t.skip}
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 py-3 bg-[#2E7D32] text-white font-semibold rounded-xl hover:bg-[#1B5E20] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                {currentStep === t.steps.length - 1 ? t.done : t.next}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
