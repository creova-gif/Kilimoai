/**
 * KILIMO WORLD-CLASS ONBOARDING
 * Screen 1: Who Are You? (Role Selection)
 * Card-based selection with icons
 */

import { motion } from 'motion/react';
import { Wheat, Store, Truck, Briefcase } from 'lucide-react';

interface RoleSelectionProps {
  onSelect: (role: string) => void;
  language: 'en' | 'sw';
}

export function RoleSelection({ onSelect, language }: RoleSelectionProps) {
  const copy = {
    en: {
      title: "Who are you?",
      subtitle: "This helps us personalize your experience",
      roles: [
        { id: 'farmer', label: 'Farmer', description: 'Grow and sell crops' },
        { id: 'buyer', label: 'Buyer / Trader', description: 'Purchase produce' },
        { id: 'transporter', label: 'Transporter', description: 'Move goods' },
        { id: 'agent', label: 'Agent / Admin', description: 'Manage operations' }
      ]
    },
    sw: {
      title: "Wewe ni nani?",
      subtitle: "Hii inatusaidia kukupa huduma bora",
      roles: [
        { id: 'farmer', label: 'Mkulima', description: 'Lima na uza mazao' },
        { id: 'buyer', label: 'Mnunuzi / Mfanyabiashara', description: 'Nunua mazao' },
        { id: 'transporter', label: 'Msafiri', description: 'Safirisha bidhaa' },
        { id: 'agent', label: 'Wakala / Msimamizi', description: 'Simamia shughuli' }
      ]
    }
  };

  const t = copy[language];

  const roleIcons = {
    farmer: Wheat,
    buyer: Store,
    transporter: Truck,
    agent: Briefcase
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#2E7D32]/5 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {t.title}
          </h1>
          <p className="text-gray-600">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {t.roles.map((role, index) => {
            const Icon = roleIcons[role.id as keyof typeof roleIcons];
            
            return (
              <motion.button
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(role.id)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-[#2E7D32] text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#E8F5E9] rounded-xl">
                    <Icon className="w-8 h-8 text-[#2E7D32]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {role.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {role.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          {language === 'en' 
            ? "Don't worry, you can change this later in Settings" 
            : "Usijali, unaweza kubadilisha hii baadaye kwenye Mipangilio"}
        </motion.p>
      </div>
    </div>
  );
}