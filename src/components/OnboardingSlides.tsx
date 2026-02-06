import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sprout, Bug, CloudRain, TrendingUp, 
  Wifi, Globe, Users, ArrowRight
} from "lucide-react";
import { Button } from "./ui/button";
import logo from "figma:asset/9ef1fbe0081cc013ac53d20ae90d325e9b280b39.png";

interface OnboardingSlidesProps {
  language: "en" | "sw";
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingSlides({ language, onComplete, onSkip }: OnboardingSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1 - Value Proposition
    {
      type: "value",
      titleEn: "Grow Smarter, Harvest More",
      titleSw: "Lima kwa Akili, Vuna Zaidi",
      descEn: "AI-powered agricultural advice at your fingertips",
      descSw: "Ushauri wa kilimo wenye akili bandia mkononi mwako",
    },
    
    // Slide 2 - Core Features
    {
      type: "features",
      titleEn: "Everything You Need",
      titleSw: "Kila Kitu Unachohitaji",
      descEn: "Smart tools for modern farming",
      descSw: "Zana mahiri kwa kilimo cha kisasa",
      features: [
        { 
          icon: Sprout, 
          textEn: "Crop & planting advice", 
          textSw: "Ushauri wa mazao na upandaji" 
        },
        { 
          icon: Bug, 
          textEn: "Pest & disease detection", 
          textSw: "Kutambua wadudu na magonjwa" 
        },
        { 
          icon: CloudRain, 
          textEn: "Weather & market insights", 
          textSw: "Hali ya hewa na taarifa za soko" 
        }
      ]
    },
    
    // Slide 3 - Trust & Localization
    {
      type: "trust",
      titleEn: "Built for You",
      titleSw: "Imejengwa kwa Ajili Yako",
      descEn: "Reliable, local, and always accessible",
      descSw: "Ya kutegemewa, ya ndani, na inapatikana kila wakati",
      trustPoints: [
        { 
          icon: Wifi, 
          textEn: "Works offline / low data", 
          textSw: "Inafanya kazi bila mtandao" 
        },
        { 
          icon: Globe, 
          textEn: "Supports Swahili & English", 
          textSw: "Inasaidia Kiswahili na Kiingereza" 
        },
        { 
          icon: Users, 
          textEn: "Built for local farmers", 
          textSw: "Imejengwa kwa wakulima wa ndani" 
        }
      ]
    }
  ];

  const currentSlideData = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  // Touch handlers for swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - next slide
      handleNext();
    }

    if (touchStart - touchEnd < -75 && currentSlide > 0) {
      // Swipe right - previous slide
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-white flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Skip Button - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={onSkip}
          className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {language === "sw" ? "Ruka" : "Skip"}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-6 pb-32 pt-20">
        <div className="max-w-md w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-center"
            >
              {/* Slide 1 - Value Proposition */}
              {currentSlideData.type === "value" && (
                <>
                  {/* Logo/Visual */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-12"
                  >
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                      <img 
                        src={logo}
                        alt="KILIMO" 
                        className="h-32 w-32 object-cover relative z-10 mx-auto rounded-full border-4 border-white shadow-2xl"
                      />
                    </div>
                  </motion.div>

                  {/* Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight"
                  >
                    {language === "sw" ? currentSlideData.titleSw : currentSlideData.titleEn}
                  </motion.h1>

                  {/* Supporting Text */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-gray-600 leading-relaxed"
                  >
                    {language === "sw" ? currentSlideData.descSw : currentSlideData.descEn}
                  </motion.p>
                </>
              )}

              {/* Slide 2 - Core Features */}
              {currentSlideData.type === "features" && (
                <>
                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight"
                  >
                    {language === "sw" ? currentSlideData.titleSw : currentSlideData.titleEn}
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-gray-600 mb-12"
                  >
                    {language === "sw" ? currentSlideData.descSw : currentSlideData.descEn}
                  </motion.p>

                  {/* Feature Cards */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    {currentSlideData.features?.map((feature, idx) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-shrink-0 p-3 bg-green-600 rounded-xl shadow-sm">
                            <FeatureIcon className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-left text-base font-semibold text-gray-800">
                            {language === "sw" ? feature.textSw : feature.textEn}
                          </p>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </>
              )}

              {/* Slide 3 - Trust & Localization */}
              {currentSlideData.type === "trust" && (
                <>
                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-5xl font-black text-gray-900 mb-3 leading-tight"
                  >
                    {language === "sw" ? currentSlideData.titleSw : currentSlideData.titleEn}
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-gray-600 mb-12"
                  >
                    {language === "sw" ? currentSlideData.descSw : currentSlideData.descEn}
                  </motion.p>

                  {/* Trust Points */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    {currentSlideData.trustPoints?.map((point, idx) => {
                      const PointIcon = point.icon;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-shrink-0 p-3 bg-green-600 rounded-xl shadow-sm">
                            <PointIcon className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-left text-base font-semibold text-gray-800">
                            {language === "sw" ? point.textSw : point.textEn}
                          </p>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Fixed Section - Pagination & CTA */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6">
        <div className="max-w-md mx-auto">
          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 bg-green-600' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Continue/Next Button */}
          <Button
            onClick={handleNext}
            className="w-full h-14 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {currentSlide === slides.length - 1 
              ? (
                <span className="flex items-center justify-center gap-2">
                  {language === "sw" ? "Endelea" : "Continue"}
                  <ArrowRight className="h-5 w-5" />
                </span>
              )
              : (language === "sw" ? "Ifuatayo" : "Next")
            }
          </Button>
        </div>
      </div>
    </div>
  );
}