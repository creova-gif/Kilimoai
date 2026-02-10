import { motion } from "motion/react";
import { Shield, Smartphone, MapPin, Users, CheckCircle, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface TrustCredibilityScreenProps {
  language: "en" | "sw";
  onContinue: () => void;
}

export function TrustCredibilityScreen({ language, onContinue }: TrustCredibilityScreenProps) {
  const trustPoints = [
    {
      icon: Shield,
      textEn: "We protect your data",
      textSw: "Tunalinda taarifa zako",
      color: "text-gray-600",
      bg: "bg-gray-50"
    },
    {
      icon: Smartphone,
      textEn: "Works even with low network",
      textSw: "Inafanya kazi hata mtandao ukiwa mdogo",
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      icon: MapPin,
      textEn: "Advice tailored for Tanzania",
      textSw: "Ushauri unaendana na mazingira ya Tanzania",
      color: "text-gray-600",
      bg: "bg-gray-50"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full"
      >
        <Card className="border-0 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-8 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Award className="h-16 w-16 text-white" />
              </div>
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-black mb-2">
              {language === "sw" 
                ? "App hii imetengenezwa kwa wakulima wa Tanzania"
                : "This app is built for Tanzanian farmers"}
            </h2>
            <p className="text-green-100">
              🇹🇿 {language === "sw" 
                ? "Tunajali mafanikio yako"
                : "We care about your success"}
            </p>
          </div>

          <CardContent className="p-8 space-y-6">
            {/* Trust Points */}
            <div className="space-y-4">
              {trustPoints.map((point, idx) => {
                const Icon = point.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className={`flex items-start gap-4 p-4 ${point.bg} rounded-xl`}
                  >
                    <div className={`p-2 bg-white rounded-lg ${point.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="text-gray-800 font-medium pt-2">
                      {language === "sw" ? point.textSw : point.textEn}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Stats (Optional) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <p className="text-2xl font-bold text-gray-900">10,000+</p>
                </div>
                <p className="text-sm text-gray-600">
                  {language === "sw" ? "Wakulima" : "Farmers"}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-2xl font-bold text-gray-900">95%</p>
                </div>
                <p className="text-sm text-gray-600">
                  {language === "sw" ? "Usahihi" : "Accuracy"}
                </p>
              </div>
            </motion.div>

            {/* Continue Button */}
            <Button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-14 text-lg font-bold shadow-lg"
            >
              {language === "sw" ? "Endelea" : "Continue"}
            </Button>

            {/* Security Note */}
            <p className="text-center text-xs text-gray-500">
              {language === "sw"
                ? "Taarifa zako zinalindwa kwa utaratibu wa kimataifa"
                : "Your data is protected with international standards"}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}