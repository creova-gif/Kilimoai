import { motion } from "motion/react";
import { Phone, Mail, Shield, Clock, DollarSign, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface CreateAccountCTAProps {
  language: "en" | "sw";
  onPhoneSignup: () => void;
  onEmailSignup: () => void;
}

export function CreateAccountCTA({ language, onPhoneSignup, onEmailSignup }: CreateAccountCTAProps) {
  const benefits = [
    {
      icon: Brain,
      textEn: "Get full AI advice",
      textSw: "Pata ushauri kamili wa AI"
    },
    {
      icon: Database,
      textEn: "Save your crop history",
      textSw: "Hifadhi historia ya mazao yako"
    },
    {
      icon: TrendingUp,
      textEn: "Get daily market prices",
      textSw: "Pata bei za soko za kila siku"
    },
    {
      icon: Bell,
      textEn: "Receive important alerts",
      textSw: "Pokea tahadhari muhimu"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full relative"
      >
        <Card className="bg-white border-0 shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white p-8 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-3xl text-white font-black mb-2">
              {language === "sw" ? "Fungua Akaunti Yako" : "Create Your Account"}
            </CardTitle>
            <p className="text-green-100">
              {language === "sw" 
                ? "Fungua akaunti ili upate huduma kamili"
                : "Sign up to unlock all features"}
            </p>
          </CardHeader>

          <CardContent className="p-8">
            {/* Benefits */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
                {language === "sw" ? "Fungua akaunti ili:" : "Sign up to:"}
              </p>
              <div className="space-y-3">
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <p className="text-gray-800 font-medium">
                        {language === "sw" ? benefit.textSw : benefit.textEn}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Sign up buttons */}
            <div className="space-y-3">
              <Button
                onClick={onPhoneSignup}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-14 text-lg font-bold shadow-lg"
              >
                <Phone className="h-5 w-5 mr-2" />
                {language === "sw" ? "Jisajili kwa Namba ya Simu" : "Sign up with Phone Number"}
              </Button>

              <Button
                onClick={onEmailSignup}
                variant="outline"
                className="w-full h-14 text-lg font-semibold border-2"
              >
                <Mail className="h-5 w-5 mr-2" />
                {language === "sw" ? "Tumia Barua Pepe" : "Use Email"}
              </Button>
            </div>

            {/* Footer benefits */}
            <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span>{language === "sw" ? "Bure kuanza" : "Free to start"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-green-600" />
                <span>{language === "sw" ? "Salama 100%" : "100% secure"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-green-600" />
                <span>{language === "sw" ? "Dakika 2" : "2 minutes"}</span>
              </div>
            </div>

            {/* Trust footer */}
            <p className="text-center text-xs text-gray-500 mt-4">
              {language === "sw"
                ? "Hakuna gharama za siri • Unaweza kufuta akaunti wakati wowote"
                : "No hidden charges • You can delete your account anytime"}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Missing imports for icons
import { Brain, Database, TrendingUp, Bell } from "lucide-react";
