import { Camera, MapPin, Bell, Mic, AlertCircle } from 'lucide-react';

interface PermissionExplainerProps {
  permission: 'camera' | 'location' | 'notifications' | 'microphone';
  onAllow: () => void;
  onDeny: () => void;
  language: 'en' | 'sw';
}

/**
 * Permission Explainer Modal
 * Required by Apple App Store - explain WHY before requesting
 */
export function PermissionExplainer({ permission, onAllow, onDeny, language }: PermissionExplainerProps) {
  const permissions = {
    camera: {
      icon: Camera,
      en: {
        title: 'Camera Access Needed',
        reason: 'KILIMO needs camera access to:',
        benefits: [
          'Take photos of diseased crops for AI diagnosis',
          'Document your farm progress',
          'Get instant pest identification',
        ],
        privacy: 'Photos are processed on our secure servers and never shared without your permission.',
      },
      sw: {
        title: 'Inahitaji Ruhusa ya Kamera',
        reason: 'KILIMO inahitaji kamera ili:',
        benefits: [
          'Piga picha za mazao yenye magonjwa kwa uchunguzi wa AI',
          'Rekodi maendeleo ya shamba lako',
          'Pata utambulisho wa wadudu papo hapo',
        ],
        privacy: 'Picha zinashughulikiwa kwenye seva zetu salama na kamwe hazishiriki bila ruhusa yako.',
      },
    },
    location: {
      icon: MapPin,
      en: {
        title: 'Location Access Needed',
        reason: 'KILIMO needs your location to:',
        benefits: [
          'Provide weather forecasts for your specific area',
          'Recommend crops suited to your region',
          'Connect you with nearby markets and suppliers',
        ],
        privacy: 'Your exact location is never shared publicly. We only use regional data for recommendations.',
      },
      sw: {
        title: 'Inahitaji Ruhusa ya Eneo',
        reason: 'KILIMO inahitaji eneo lako ili:',
        benefits: [
          'Kutoa utabiri wa hali ya hewa kwa eneo lako maalum',
          'Kupendekeza mazao yanayofaa mkoa wako',
          'Kuunganisha na masoko na wasambazaji karibu',
        ],
        privacy: 'Eneo lako kamili haliwekwi hadharani. Tunatumia tu data za kikanda kwa mapendekezo.',
      },
    },
    notifications: {
      icon: Bell,
      en: {
        title: 'Notification Permission',
        reason: 'KILIMO sends notifications to:',
        benefits: [
          'Remind you of important farm tasks',
          'Alert you about weather changes',
          'Notify you of market price updates',
        ],
        privacy: 'You can turn off notifications anytime in settings. We never send spam.',
      },
      sw: {
        title: 'Ruhusa ya Arifa',
        reason: 'KILIMO inatuma arifa ili:',
        benefits: [
          'Kukumbushia kazi muhimu za shamba',
          'Kukuarifu kuhusu mabadiliko ya hali ya hewa',
          'Kukujulisha bei mpya za soko',
        ],
        privacy: 'Unaweza kuzima arifa wakati wowote kwenye mipangilio. Hatutumi taarifa zisizohitajika.',
      },
    },
    microphone: {
      icon: Mic,
      en: {
        title: 'Microphone Access Needed',
        reason: 'KILIMO needs microphone access to:',
        benefits: [
          'Enable voice commands for hands-free farming',
          'Ask questions to Sankofa AI by speaking',
          'Record voice notes about your crops',
        ],
        privacy: 'Voice recordings are only processed when you activate voice mode. Nothing is recorded passively.',
      },
      sw: {
        title: 'Inahitaji Ruhusa ya Kipaza Sauti',
        reason: 'KILIMO inahitaji kipaza sauti ili:',
        benefits: [
          'Kuwezesha amri za sauti kwa kilimo bila mikono',
          'Uliza maswali Sankofa AI kwa kusema',
          'Rekodi vidokezo vya sauti kuhusu mazao yako',
        ],
        privacy: 'Sauti zinahifadhiwa tu unapoamsha hali ya sauti. Hakuna kitu kinachorejea kimya.',
      },
    },
  };

  const config = permissions[permission];
  const content = config[language];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <Icon className="w-10 h-10 text-[#2E7D32]" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
          {content.title}
        </h2>

        {/* Reason */}
        <p className="text-gray-700 font-semibold text-center mb-4">
          {content.reason}
        </p>

        {/* Benefits */}
        <ul className="space-y-3 mb-6">
          {content.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#2E7D32] font-bold text-sm">✓</span>
              </div>
              <span className="text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>

        {/* Privacy Note */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">{content.privacy}</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onAllow}
            className="w-full bg-[#2E7D32] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#1B5E20] transition-colors shadow-md"
          >
            {language === 'en' ? 'Allow' : 'Ruhusu'}
          </button>

          <button
            onClick={onDeny}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            {language === 'en' ? 'Not Now' : 'Si Sasa'}
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          {language === 'en' 
            ? 'You can change this permission anytime in Settings'
            : 'Unaweza kubadilisha ruhusa hii wakati wowote kwenye Mipangilio'}
        </p>
      </div>
    </div>
  );
}

/**
 * Hook to request permission with explainer
 */
export function usePermission(permission: 'camera' | 'location' | 'notifications' | 'microphone') {
  const [showExplainer, setShowExplainer] = React.useState(false);
  const [granted, setGranted] = React.useState(false);

  const requestPermission = () => {
    setShowExplainer(true);
  };

  const handleAllow = async () => {
    setShowExplainer(false);

    try {
      if (permission === 'camera') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setGranted(true);
      } else if (permission === 'location') {
        navigator.geolocation.getCurrentPosition(
          () => setGranted(true),
          () => setGranted(false)
        );
      } else if (permission === 'notifications') {
        const result = await Notification.requestPermission();
        setGranted(result === 'granted');
      } else if (permission === 'microphone') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setGranted(true);
      }
    } catch (error) {
      console.error(`Permission denied for ${permission}:`, error);
      setGranted(false);
    }
  };

  const handleDeny = () => {
    setShowExplainer(false);
    setGranted(false);
  };

  return {
    showExplainer,
    granted,
    requestPermission,
    handleAllow,
    handleDeny,
  };
}
