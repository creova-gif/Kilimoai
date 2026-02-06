/**
 * KILIMO WORLD-CLASS ONBOARDING
 * Screen 4: AI Personalization (30 seconds)
 * Quick questions to configure dashboard
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

interface AIPersonalizationProps {
  onComplete: (answers: PersonalizationAnswers) => void;
  language: 'en' | 'sw';
  role: string;
}

export interface PersonalizationAnswers {
  products: string[];
  scale: string;
  paymentMethod: string;
  region: string;
}

export function AIPersonalization({ onComplete, language, role }: AIPersonalizationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<PersonalizationAnswers>({
    products: [],
    scale: '',
    paymentMethod: '',
    region: ''
  });

  const copy = {
    en: {
      title: "Let's personalize for you",
      subtitle: "Just 4 quick questions (30 seconds)",
      questions: [
        {
          id: 'products',
          label: 'What crops/products?',
          type: 'multi-select' as const,
          options: [
            { value: 'maize', label: 'Maize' },
            { value: 'rice', label: 'Rice' },
            { value: 'beans', label: 'Beans' },
            { value: 'coffee', label: 'Coffee' },
            { value: 'banana', label: 'Banana' },
            { value: 'cassava', label: 'Cassava' }
          ]
        },
        {
          id: 'scale',
          label: 'Scale of operation?',
          type: 'single-select' as const,
          options: [
            { value: 'small', label: 'Small (< 5 acres)', icon: '🌱' },
            { value: 'medium', label: 'Medium (5-20 acres)', icon: '🌾' },
            { value: 'large', label: 'Large (20+ acres)', icon: '🚜' }
          ]
        },
        {
          id: 'paymentMethod',
          label: 'Preferred payment?',
          type: 'single-select' as const,
          options: [
            { value: 'mobile', label: 'Mobile Money', icon: '📱' },
            { value: 'cash', label: 'Cash', icon: '💵' },
            { value: 'both', label: 'Both', icon: '💳' }
          ]
        },
        {
          id: 'region',
          label: 'Your region?',
          type: 'dropdown' as const,
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
      ],
      next: 'Next',
      back: 'Back',
      done: 'Done',
      skip: 'Skip',
      progress: 'Question'
    },
    sw: {
      title: "Hebu tukuandalie",
      subtitle: "Maswali 4 tu ya haraka (sekunde 30)",
      questions: [
        {
          id: 'products',
          label: 'Mazao/bidhaa gani?',
          type: 'multi-select' as const,
          options: [
            { value: 'maize', label: 'Mahindi' },
            { value: 'rice', label: 'Mchele' },
            { value: 'beans', label: 'Maharagwe' },
            { value: 'coffee', label: 'Kahawa' },
            { value: 'banana', label: 'Ndizi' },
            { value: 'cassava', label: 'Muhogo' }
          ]
        },
        {
          id: 'scale',
          label: 'Ukubwa wa shughuli?',
          type: 'single-select' as const,
          options: [
            { value: 'small', label: 'Ndogo (< ekari 5)', icon: '🌱' },
            { value: 'medium', label: 'Ya kati (ekari 5-20)', icon: '🌾' },
            { value: 'large', label: 'Kubwa (ekari 20+)', icon: '🚜' }
          ]
        },
        {
          id: 'paymentMethod',
          label: 'Malipo unayopendelea?',
          type: 'single-select' as const,
          options: [
            { value: 'mobile', label: 'Pesa ya Simu', icon: '📱' },
            { value: 'cash', label: 'Fedha Taslimu', icon: '💵' },
            { value: 'both', label: 'Zote', icon: '💳' }
          ]
        },
        {
          id: 'region',
          label: 'Mkoa wako?',
          type: 'dropdown' as const,
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
      ],
      next: 'Ifuatayo',
      back: 'Rudi',
      done: 'Maliza',
      skip: 'Ruka',
      progress: 'Swali'
    }
  };

  const t = copy[language];
  const currentQuestion = t.questions[currentStep];
  const totalSteps = t.questions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleMultiSelect = (value: string) => {
    const current = answers.products;
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setAnswers({ ...answers, products: updated });
  };

  const handleSingleSelect = (field: keyof PersonalizationAnswers, value: string) => {
    setAnswers({ ...answers, [field]: value });
  };

  const canProceed = () => {
    const field = currentQuestion.id as keyof PersonalizationAnswers;
    const value = answers[field];
    
    if (currentQuestion.type === 'multi-select') {
      return Array.isArray(value) && value.length > 0;
    }
    return Boolean(value);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete(answers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.title}
          </h1>
          <p className="text-gray-600">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>{t.progress} {currentStep + 1}/{totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentQuestion.label}
            </h2>

            {/* Multi-select */}
            {currentQuestion.type === 'multi-select' && (
              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers.products.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleMultiSelect(option.value)}
                      className={`p-4 rounded-xl border-2 transition-all text-left font-medium ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50 text-purple-900'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Single-select */}
            {currentQuestion.type === 'single-select' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const field = currentQuestion.id as keyof PersonalizationAnswers;
                  const isSelected = answers[field] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSingleSelect(field, option.value)}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {option.icon && <span className="text-3xl">{option.icon}</span>}
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Dropdown */}
            {currentQuestion.type === 'dropdown' && (
              <select
                value={answers.region}
                onChange={(e) => handleSingleSelect('region', e.target.value)}
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
              >
                <option value="">Select...</option>
                {currentQuestion.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {t.back}
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {currentStep === totalSteps - 1 ? t.done : t.next}
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleSkip}
            className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900"
          >
            {t.skip}
          </button>
        </div>
      </div>
    </div>
  );
}
