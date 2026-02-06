import React from 'react';
import { 
  Zap, 
  Globe, 
  CreditCard, 
  Brain, 
  CheckCircle, 
  Settings,
  TrendingUp,
  Shield,
  Sparkles,
  Smartphone // Added for SELCOM
} from 'lucide-react';

interface IntegrationsHubProps {
  language: 'en' | 'sw';
}

export function IntegrationsHub({ language }: IntegrationsHubProps) {
  const t = {
    en: {
      title: "CREOVA Integrations Hub",
      subtitle: "Advanced tools powering your agricultural success",
      selcom: {
        name: "SELCOM Payments",
        tagline: "Tanzania's #1 Payment Gateway",
        description: "Deep mobile money integration optimized for Tanzanian smallholder farmers with M-Pesa, TigoPesa, Airtel Money, Halopesa & T-Pesa.",
        features: [
          "M-Pesa integration (65% market share in Tanzania)",
          "TigoPesa, Airtel Money, Halopesa & T-Pesa support",
          "Direct bank transfers (CRDB, NMB, NBC, Equity, etc.)",
          "USSD payment codes & instant confirmations",
        ],
        status: "Active",
      },
      flutterwave: {
        name: "Flutterwave Payments",
        tagline: "Pan-African Payment Gateway",
        description: "Accept payments across 8 African countries with mobile money, cards, and bank transfers.",
        features: [
          "Multi-currency support (TZS, KES, NGN, GHS, UGX, RWF, ZMW, ZAR)",
          "Mobile money integration (M-Pesa, MTN, Airtel, Tigo)",
          "Card payments (Visa, Mastercard)",
          "Bank transfers & USSD payments",
        ],
        status: "Active",
      },
      openrouter: {
        name: "OpenRouter AI",
        tagline: "Multi-Model AI Intelligence",
        description: "Access GPT-4, Claude, Gemini, and 100+ AI models for superior agricultural advisory.",
        features: [
          "GPT-4 Turbo for complex agricultural analysis",
          "Claude 3 for detailed crop diagnostics",
          "Gemini Pro for multilingual support",
          "Automatic model selection based on query complexity",
        ],
        status: "Active",
      },
      sentry: {
        name: "Sentry Error Tracking",
        tagline: "Production Monitoring",
        description: "Real-time error tracking and performance monitoring for CREOVA platform.",
        features: [
          "Real-time error alerts",
          "Performance monitoring",
          "User impact tracking",
          "Stack trace analysis",
        ],
        status: "Coming Soon",
      },
      posthog: {
        name: "PostHog Analytics",
        tagline: "Product Analytics & Feature Flags",
        description: "Track farmer behavior, A/B test features, and make data-driven decisions.",
        features: [
          "User behavior analytics",
          "Session replay for UX optimization",
          "Feature flags for gradual rollouts",
          "Funnel analysis",
        ],
        status: "Coming Soon",
      },
      benefits: {
        title: "Integration Benefits",
        items: [
          {
            icon: Globe,
            title: "Pan-African Reach",
            description: "Expand beyond Tanzania to Kenya, Nigeria, Ghana, and 5 more countries",
          },
          {
            icon: Brain,
            title: "Superior AI",
            description: "Multi-model AI provides 40% better accuracy than single-model systems",
          },
          {
            icon: Shield,
            title: "Enterprise Security",
            description: "Bank-level encryption and compliance with international standards",
          },
          {
            icon: TrendingUp,
            title: "Growth Ready",
            description: "Scalable infrastructure supporting millions of farmers",
          },
        ],
      },
    },
    sw: {
      title: "Kituo cha Muunganisho wa CREOVA",
      subtitle: "Zana za kale zinazoendesha mafanikio yako ya kilimo",
      selcom: {
        name: "Malipo ya SELCOM",
        tagline: "Lango la Malipo la Afrika",
        description: "Muunganisho wa pesa ya simu ya kawaida kwa wakulima wa kijiji kubwa Tanzania na M-Pesa, TigoPesa, Airtel Money, Halopesa & T-Pesa.",
        features: [
          "Muunganisho wa M-Pesa (65% ya simu ya kawaida katika Tanzania)",
          "TigoPesa, Airtel Money, Halopesa & T-Pesa",
          "Uhamisho wa benki kati ya CRDB, NMB, NBC, Equity, na hivi punde",
          "Mawasiliano ya USSD na ubalikisho wa kati ya sekunde",
        ],
        status: "Inatumika",
      },
      flutterwave: {
        name: "Malipo ya Flutterwave",
        tagline: "Lango la Malipo la Afrika",
        description: "Pokea malipo katika nchi 8 za Afrika kwa pesa ya simu, kadi, na uhamisho wa benki.",
        features: [
          "Msaada wa sarafu nyingi (TZS, KES, NGN, GHS, UGX, RWF, ZMW, ZAR)",
          "Muunganisho wa pesa ya simu (M-Pesa, MTN, Airtel, Tigo)",
          "Malipo ya kadi (Visa, Mastercard)",
          "Uhamisho wa benki na malipo ya USSD",
        ],
        status: "Inatumika",
      },
      openrouter: {
        name: "OpenRouter AI",
        tagline: "Akili ya AI ya Muundo Mwingi",
        description: "Pata GPT-4, Claude, Gemini, na miundo 100+ ya AI kwa ushauri bora wa kilimo.",
        features: [
          "GPT-4 Turbo kwa uchambuzi wa kilimo wa ngumu",
          "Claude 3 kwa uchunguzi wa mazao wa kina",
          "Gemini Pro kwa msaada wa lugha nyingi",
          "Uteuzi wa kiotomatiki wa muundo kulingana na ugumu wa swali",
        ],
        status: "Inatumika",
      },
      sentry: {
        name: "Ufuatiliaji wa Makosa wa Sentry",
        tagline: "Ufuatiliaji wa Uzalishaji",
        description: "Ufuatiliaji wa makosa wa wakati halisi na ufuatiliaji wa utendaji kwa jukwaa la CREOVA.",
        features: [
          "Tahadhari za makosa za wakati halisi",
          "Ufuatiliaji wa utendaji",
          "Ufuatiliaji wa athari kwa watumiaji",
          "Uchambuzi wa stack trace",
        ],
        status: "Inakuja Hivi Karibuni",
      },
      posthog: {
        name: "Uchambuzi wa PostHog",
        tagline: "Uchambuzi wa Bidhaa na Bendera za Kipengele",
        description: "Fuatilia tabia za wakulima, jaribu vipengele vya A/B, na fanya maamuzi yanayotegemea data.",
        features: [
          "Uchambuzi wa tabia za watumiaji",
          "Uonyesho wa kipindi kwa uboreshaji wa UX",
          "Bendera za kipengele kwa uzinduzi wa polepole",
          "Uchambuzi wa funnel",
        ],
        status: "Inakuja Hivi Karibuni",
      },
      benefits: {
        title: "Faida za Muunganisho",
        items: [
          {
            icon: Globe,
            title: "Upatikanaji wa Afrika",
            description: "Panua zaidi ya Tanzania hadi Kenya, Nigeria, Ghana, na nchi 5 zaidi",
          },
          {
            icon: Brain,
            title: "AI Bora",
            description: "AI ya muundo mwingi inatoa usahihi wa 40% bora kuliko mifumo ya muundo mmoja",
          },
          {
            icon: Shield,
            title: "Usalama wa Biashara",
            description: "Usimbaji fiche wa kiwango cha benki na kuzingatia viwango vya kimataifa",
          },
          {
            icon: TrendingUp,
            title: "Tayari kwa Ukuaji",
            description: "Miundombinu inayoweza kukua inayoweza kusaidia mamilioni ya wakulima",
          },
        ],
      },
    },
  };

  const content = t[language];

  const integrations = [
    {
      ...content.selcom,
      icon: Smartphone,
      color: "from-green-500 to-emerald-600",
      category: "Payments",
    },
    {
      ...content.flutterwave,
      icon: Globe,
      color: "from-orange-500 to-yellow-500",
      category: "Payments",
    },
    {
      ...content.openrouter,
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      category: "AI",
    },
    {
      ...content.sentry,
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      category: "Monitoring",
    },
    {
      ...content.posthog,
      icon: TrendingUp,
      color: "from-green-500 to-teal-500",
      category: "Analytics",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-green-600" />
          <h1 className="text-green-900">{content.title}</h1>
        </div>
        <p className="text-gray-600 max-w-2xl">{content.subtitle}</p>
      </div>

      {/* Integration Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {integrations.map((integration, index) => {
          const Icon = integration.icon;
          const isActive = integration.status === "Active" || integration.status === "Inatumika";
          
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${integration.color} p-6 text-white relative overflow-hidden`}>
                <div className="absolute -right-8 -top-8 opacity-20">
                  <Icon className="w-40 h-40" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-8 h-8" />
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {isActive ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>{integration.status}</span>
                        </>
                      ) : (
                        <>
                          <Settings className="w-4 h-4" />
                          <span>{integration.status}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <h3 className="mb-1">{integration.name}</h3>
                  <p className="text-white/90 text-sm">{integration.tagline}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-gray-600 mb-4">{integration.description}</p>

                <div className="space-y-2">
                  {integration.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {isActive && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className={`w-full bg-gradient-to-r ${integration.color} text-white py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}>
                      <Zap className="w-5 h-5" />
                      <span>{language === 'en' ? 'View Integration' : 'Tazama Muunganisho'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-6">
        <h2 className="text-green-900 mb-8 text-center">{content.benefits.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.benefits.items.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl mb-4">
                  <Icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl mb-2">100+</div>
            <div className="text-white/90">{language === 'en' ? 'AI Models' : 'Miundo ya AI'}</div>
          </div>
          <div>
            <div className="text-4xl mb-2">5</div>
            <div className="text-white/90">{language === 'en' ? 'Mobile Money Operators' : 'Waendeshaji wa Pesa ya Simu'}</div>
          </div>
          <div>
            <div className="text-4xl mb-2">20+</div>
            <div className="text-white/90">{language === 'en' ? 'Payment Methods' : 'Njia za Malipo'}</div>
          </div>
          <div>
            <div className="text-4xl mb-2">99.9%</div>
            <div className="text-white/90">{language === 'en' ? 'Uptime' : 'Muda wa Kufanya Kazi'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}