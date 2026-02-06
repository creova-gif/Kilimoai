import image_e26027fb3aabd00c928ba655f087af31ac20983e from 'figma:asset/e26027fb3aabd00c928ba655f087af31ac20983e.png';
import { useState } from "react";
import { motion } from "motion/react";
import { Wheat, Globe, Sparkles, TrendingUp, Users, Leaf } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import logo from "figma:asset/9ef1fbe0081cc013ac53d20ae90d325e9b280b39.png";

interface WelcomeScreenProps {
  onContinue: (language: "en" | "sw") => void;
}

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "sw">("sw");

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 flex items-center justify-center p-4 overflow-y-auto">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Logo with pulse effect */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <motion.div 
              animate={{
                boxShadow: [
                  "0 0 20px rgba(255,255,255,0.3)",
                  "0 0 40px rgba(255,255,255,0.5)",
                  "0 0 20px rgba(255,255,255,0.3)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="p-8 bg-white/20 backdrop-blur-lg rounded-3xl"
            >
              <img 
                src={image_e26027fb3aabd00c928ba655f087af31ac20983e}
                alt="KILIMO Logo" 
                className="h-24 w-24 md:h-32 md:w-32 object-contain"
              />
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
              KILIMO
            </h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="h-1 w-32 bg-white/80 rounded-full mx-auto mb-6"
            />
            <p className="text-xl md:text-2xl text-white font-semibold px-4 mb-2">
              {selectedLanguage === "sw" 
                ? "Teknolojia ya Kilimo. Ushauri Sahihi. Mavuno Bora."
                : "Agricultural Technology. Smart Advice. Better Harvests."}
            </p>
            <p className="text-sm md:text-base text-green-100 italic">
              {selectedLanguage === "sw"
                ? "Jiunga na maelfu ya wakulima wanaoboresha mazao yao"
                : "Join thousands of farmers improving their harvests"}
            </p>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-3 gap-3 md:gap-4 mb-8 max-w-2xl mx-auto"
          >
            {[
              { icon: Leaf, label: selectedLanguage === "sw" ? "Ushauri wa AI" : "AI Advisory" },
              { icon: TrendingUp, label: selectedLanguage === "sw" ? "Bei za Soko" : "Market Prices" },
              { icon: Users, label: selectedLanguage === "sw" ? "Jumuiya" : "Community" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + (index * 0.1), duration: 0.4 }}
                className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-white"
              >
                <feature.icon className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2" />
                <p className="text-xs md:text-sm font-semibold">{feature.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Language Selector */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="space-y-4 max-w-md mx-auto"
          >
            <p className="text-white/90 text-sm font-medium mb-3">
              {selectedLanguage === "sw" ? "Chagua Lugha" : "Select Language"}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLanguage("sw")}
                className={`p-5 rounded-2xl font-bold transition-all ${
                  selectedLanguage === "sw"
                    ? "bg-white text-green-700 shadow-2xl"
                    : "bg-white/20 backdrop-blur-md text-white hover:bg-white/30"
                }`}
              >
                <Globe className="h-6 w-6 mx-auto mb-2" />
                <span className="text-base">Kiswahili</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLanguage("en")}
                className={`p-5 rounded-2xl font-bold transition-all ${
                  selectedLanguage === "en"
                    ? "bg-white text-green-700 shadow-2xl"
                    : "bg-white/20 backdrop-blur-md text-white hover:bg-white/30"
                }`}
              >
                <Globe className="h-6 w-6 mx-auto mb-2" />
                <span className="text-base">English</span>
              </motion.button>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => onContinue(selectedLanguage)}
                size="lg"
                className="w-full bg-white text-green-700 hover:bg-green-50 font-bold text-lg h-16 rounded-2xl shadow-2xl"
              >
                {selectedLanguage === "sw" ? "Anza Sasa" : "Get Started"} →
              </Button>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-8 space-y-2"
          >
            <p className="text-white/80 text-sm">
              {selectedLanguage === "sw" 
                ? "Imetengenezwa kwa wakulima wa Tanzania 🇹🇿"
                : "Built for Tanzanian farmers 🇹🇿"}
            </p>
            <p className="text-white/60 text-xs">
              {selectedLanguage === "sw"
                ? "Tumeaminika na wakulima zaidi ya 10,000+"
                : "Trusted by 10,000+ farmers"}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}