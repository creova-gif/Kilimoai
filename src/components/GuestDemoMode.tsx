import { useState } from "react";
import { motion } from "motion/react";
import { 
  Camera, CloudRain, DollarSign, MessageSquare,
  Lock, CheckCircle, TrendingUp, AlertTriangle,
  Droplets, Wind, Sun, ArrowRight
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

interface GuestDemoModeProps {
  language: "en" | "sw";
  onCreateAccount: () => void;
  onContinueAsGuest: () => void;
}

export function GuestDemoMode({ language, onCreateAccount, onContinueAsGuest }: GuestDemoModeProps) {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const demoFeatures = [
    {
      id: "disease",
      icon: Camera,
      titleEn: "Crop Disease Detection",
      titleSw: "Kutambua Magonjwa ya Mazao",
      descEn: "Take a photo (sample)",
      descSw: "Piga picha ya majani (mfano)",
      color: "from-orange-500 to-red-600",
      demoResult: {
        titleEn: "Possible Diagnosis: Fungal Disease",
        titleSw: "Inaweza kuwa: Ugonjwa wa Fangasi",
        adviceEn: "Apply appropriate fungicide early. Remove affected leaves.",
        adviceSw: "Tumia dawa sahihi mapema. Ondoa majani yaliyoathirika.",
        confidence: 87
      }
    },
    {
      id: "weather",
      icon: CloudRain,
      titleEn: "Weather & Planting Advice",
      titleSw: "Hali ya Hewa na Ushauri wa Kupanda",
      descEn: "Weather forecast (your region)",
      descSw: "Hali ya hewa (mkoa wako)",
      color: "from-blue-500 to-cyan-600",
      demoResult: {
        titleEn: "Rain expected in 3 days",
        titleSw: "Mvua inatarajiwa ndani ya siku 3",
        adviceEn: "Good time to plant. Prepare your seeds now.",
        adviceSw: "Wakati mzuri wa kupanda. Tayarisha mbegu zako sasa.",
        temp: "24°C",
        humidity: "68%"
      }
    },
    {
      id: "prices",
      icon: DollarSign,
      titleEn: "Market Prices",
      titleSw: "Bei za Soko",
      descEn: "Live prices from markets",
      descSw: "Bei za soko za sasa",
      color: "from-green-500 to-emerald-600",
      demoResult: {
        crop: language === "sw" ? "Mahindi" : "Maize",
        markets: [
          { name: "Arusha", price: "800" },
          { name: "Dodoma", price: "750" },
          { name: "Mwanza", price: "820" }
        ]
      }
    },
    {
      id: "ai-chat",
      icon: MessageSquare,
      titleEn: "AI Chat Preview",
      titleSw: "Mazungumzo na AI",
      descEn: "Ask farming questions",
      descSw: "Uliza maswali ya kilimo",
      color: "from-purple-500 to-indigo-600",
      demoResult: {
        questionEn: "When should I plant maize?",
        questionSw: "Nipande mahindi lini?",
        answerEn: "This season is good. Plant within the next 2 weeks for best results. Make sure soil is well prepared and has good drainage.",
        answerSw: "Msimu huu ni mzuri kupanda ndani ya wiki 2 zijazo. Hakikisha udongo umeandaliwa vizuri na una mtiririko mzuri."
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
      <div className="min-h-screen p-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header - More visual */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              <CheckCircle className="h-4 w-4" />
              {language === "sw" ? "Bila malipo" : "No payment required"}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              {language === "sw" ? "Jaribu Bila Akaunti" : "Try Without Account"}
            </h1>
            <p className="text-lg text-gray-600">
              {language === "sw" 
                ? "Ona jinsi KILIMO inavyofanya kazi kabla ya kujiandikisha"
                : "See how KILIMO works before signing up"}
            </p>
          </motion.div>

          {/* Demo Features - Modern grid on larger screens */}
          <div className="space-y-3">
            {demoFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              const isActive = activeDemo === feature.id;

              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                      isActive 
                        ? 'border-green-500 border-2 shadow-2xl ring-4 ring-green-100' 
                        : 'hover:shadow-lg hover:border-gray-300 border-gray-200'
                    }`}
                    onClick={() => setActiveDemo(isActive ? null : feature.id)}
                  >
                    {/* Card Header - Cleaner design */}
                    <div className={`bg-gradient-to-r ${feature.color} p-4`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl flex-shrink-0">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-base mb-0.5">
                              {language === "sw" ? feature.titleSw : feature.titleEn}
                            </h3>
                            <p className="text-white/90 text-xs line-clamp-1">
                              {language === "sw" ? feature.descSw : feature.descEn}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className="bg-white/20 text-white border-white/40 text-xs px-2 py-1">
                            {language === "sw" ? "Mfano" : "Demo"}
                          </Badge>
                          <motion.div
                            animate={{ rotate: isActive ? 90 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ArrowRight className="h-5 w-5 text-white" />
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content - Premium feel */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-5 pb-5 bg-gradient-to-b from-gray-50 to-white">
                          {/* Disease Detection Demo */}
                          {feature.id === "disease" && (
                            <div className="space-y-4">
                              <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl p-5 shadow-lg">
                                <div className="flex items-start gap-4">
                                  <div className="p-3 bg-orange-500 rounded-xl shadow-md flex-shrink-0">
                                    <AlertTriangle className="h-7 w-7 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-bold text-orange-900 text-lg">
                                        {language === "sw" ? feature.demoResult.titleSw : feature.demoResult.titleEn}
                                      </h4>
                                      <span className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full shadow-sm">
                                        {feature.demoResult.confidence}%
                                      </span>
                                    </div>
                                    <p className="text-sm text-orange-800 leading-relaxed">
                                      <span className="font-bold">{language === "sw" ? "Ushauri:" : "Advice:"}</span>{" "}
                                      {language === "sw" ? feature.demoResult.adviceSw : feature.demoResult.adviceEn}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Weather Demo */}
                          {feature.id === "weather" && (
                            <div className="space-y-4">
                              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-2xl p-5 shadow-lg">
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                                    <CloudRain className="h-10 w-10 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-bold text-blue-900 text-lg mb-1">
                                      {language === "sw" ? feature.demoResult.titleSw : feature.demoResult.titleEn}
                                    </h4>
                                    <div className="flex items-center gap-3 text-blue-700">
                                      <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-200/50 rounded-lg">
                                        <Sun className="h-4 w-4" />
                                        <span className="text-sm font-semibold">{feature.demoResult.temp}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-200/50 rounded-lg">
                                        <Droplets className="h-4 w-4" />
                                        <span className="text-sm font-semibold">{feature.demoResult.humidity}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm text-blue-900 leading-relaxed bg-white/50 p-3 rounded-xl">
                                  <span className="font-bold">{language === "sw" ? "Ushauri:" : "Advice:"}</span>{" "}
                                  {language === "sw" ? feature.demoResult.adviceSw : feature.demoResult.adviceEn}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Market Prices Demo */}
                          {feature.id === "prices" && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-gray-900 text-base">
                                  {language === "sw" ? "Bei ya " : "Price of "}{feature.demoResult.crop}
                                </h4>
                                <Badge className="bg-green-100 text-green-700 border-green-300 font-semibold">
                                  {language === "sw" ? "Leo" : "Today"}
                                </Badge>
                              </div>
                              {feature.demoResult.markets.map((market, idx) => (
                                <motion.div 
                                  key={idx}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                >
                                  <span className="font-semibold text-gray-900">{market.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl font-black text-green-700">
                                      {market.price}
                                    </span>
                                    <span className="text-sm text-green-600 font-medium">TZS/kg</span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}

                          {/* AI Chat Demo */}
                          {feature.id === "ai-chat" && (
                            <div className="space-y-3">
                              <div className="bg-gray-100 rounded-xl p-4 border border-gray-300">
                                <p className="text-sm text-gray-700">
                                  <span className="font-bold text-gray-900">{language === "sw" ? "Swali:" : "Question:"}</span>{" "}
                                  {language === "sw" ? feature.demoResult.questionSw : feature.demoResult.questionEn}
                                </p>
                              </div>
                              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-4 shadow-md">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-purple-500 rounded-lg flex-shrink-0">
                                    <MessageSquare className="h-5 w-5 text-white" />
                                  </div>
                                  <div className="text-sm text-purple-900 leading-relaxed flex-1">
                                    <span className="font-bold block mb-1">{language === "sw" ? "AI Jibu:" : "AI Response:"}</span>
                                    {language === "sw" ? feature.demoResult.answerSw : feature.demoResult.answerEn}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Locked CTA - More prominent */}
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-5 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl flex items-center gap-3 shadow-sm"
                          >
                            <div className="p-2 bg-amber-500 rounded-lg">
                              <Lock className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-sm text-amber-900 font-semibold flex-1">
                              {language === "sw" 
                                ? "Fungua huduma zote kwa akaunti"
                                : "Unlock all features with an account"}
                            </p>
                            <ArrowRight className="h-5 w-5 text-amber-600" />
                          </motion.div>
                        </CardContent>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Buttons - More prominent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 pt-6"
          >
            <Button
              onClick={onCreateAccount}
              className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 h-16 text-lg font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] rounded-xl"
            >
              <span className="flex items-center gap-2">
                {language === "sw" ? "Fungua Akaunti Yako" : "Create Your Account"}
                <ArrowRight className="h-6 w-6" />
              </span>
            </Button>

            <Button
              onClick={onContinueAsGuest}
              variant="outline"
              className="w-full h-12 text-base border-2 hover:bg-gray-50 rounded-xl font-semibold"
            >
              {language === "sw" ? "Endelea bila akaunti" : "Continue as guest"}
            </Button>

            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">{language === "sw" ? "Bure kuanza" : "Free to start"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">{language === "sw" ? "Dakika 2 tu" : "Only 2 minutes"}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}