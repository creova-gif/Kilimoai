/**
 * ROLE SELECTION V2
 * Clean, minimal, world-class role picker
 * Shown AFTER phone verification for new users only
 */

import { Wheat, Store, Truck, Briefcase, Check } from 'lucide-react';

interface RoleSelectionV2Props {
  onSelect: (role: string) => void;
  language: 'en' | 'sw';
}

export function RoleSelectionV2({ onSelect, language }: RoleSelectionV2Props) {
  const copy = {
    en: {
      title: 'How do you use KILIMO?',
      subtitle: 'This helps us personalize your experience',
      roles: [
        {
          id: 'farmer',
          icon: Wheat,
          title: 'Farmer',
          description: 'Grow crops and livestock',
        },
        {
          id: 'buyer',
          icon: Store,
          title: 'Buyer',
          description: 'Purchase farm produce',
        },
        {
          id: 'transporter',
          icon: Truck,
          title: 'Transporter',
          description: 'Move goods to market',
        },
        {
          id: 'agent',
          icon: Briefcase,
          title: 'Agent',
          description: 'Connect farmers & buyers',
        },
      ],
    },
    sw: {
      title: 'Unatumia KILIMO vipi?',
      subtitle: 'Hii inatusaidia kukupa huduma bora',
      roles: [
        {
          id: 'farmer',
          icon: Wheat,
          title: 'Mkulima',
          description: 'Unalima mazao na mifugo',
        },
        {
          id: 'buyer',
          icon: Store,
          title: 'Mnunuzi',
          description: 'Ununua mazao ya shamba',
        },
        {
          id: 'transporter',
          icon: Truck,
          title: 'Msafiri',
          description: 'Usafirisha bidhaa sokoni',
        },
        {
          id: 'agent',
          icon: Briefcase,
          title: 'Wakala',
          description: 'Unaunganisha wakulima na wanunuzi',
        },
      ],
    },
  };

  const t = copy[language];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 pt-12 pb-6 px-6">
        <div className="max-w-sm mx-auto space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            {t.title}
          </h1>
          <p className="text-gray-600 text-center text-sm">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="flex-1 px-6 pb-12">
        <div className="max-w-sm mx-auto grid grid-cols-1 gap-3">
          {t.roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => onSelect(role.id)}
                className="bg-white rounded-2xl p-5 shadow-sm border-2 border-gray-200 hover:border-[#2E7D32] hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 p-3 bg-[#E8F5E9] rounded-xl group-hover:bg-[#2E7D32] transition-colors">
                    <Icon className="w-6 h-6 text-[#2E7D32] group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-0.5">
                      {role.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {role.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
