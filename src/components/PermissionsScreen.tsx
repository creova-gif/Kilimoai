import { useState } from "react";
import { motion } from "motion/react";
import { Camera, MapPin, Bell, CheckCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface PermissionsScreenProps {
  language: "en" | "sw";
  onComplete: (permissions: { camera: boolean; location: boolean; notifications: boolean }) => void;
}

export function PermissionsScreen({ language, onComplete }: PermissionsScreenProps) {
  const [permissions, setPermissions] = useState({
    camera: false,
    location: false,
    notifications: false
  });
  const [currentStep, setCurrentStep] = useState(0);

  const permissionSteps = [
    {
      key: "camera" as const,
      icon: Camera,
      titleEn: "We need camera access",
      titleSw: "Tunahitaji kamera",
      descEn: "To take photos of crops for disease identification",
      descSw: "Kupiga picha ya mazao ili kutambua magonjwa",
      color: "from-blue-500 to-cyan-600",
      required: true
    },
    {
      key: "location" as const,
      icon: MapPin,
      titleEn: "We need your location",
      titleSw: "Tunahitaji eneo lako",
      descEn: "To give you weather forecasts and local farming advice",
      descSw: "Kukupa ushauri wa hali ya hewa na kilimo cha eneo lako",
      color: "from-green-500 to-emerald-600",
      required: false
    },
    {
      key: "notifications" as const,
      icon: Bell,
      titleEn: "Get important alerts",
      titleSw: "Pata tahadhari muhimu",
      descEn: "Rain forecasts, disease alerts, and quick farming tips",
      descSw: "Mvua, magonjwa, na ushauri wa haraka",
      color: "from-purple-500 to-indigo-600",
      required: false
    }
  ];

  const currentPermission = permissionSteps[currentStep];
  const Icon = currentPermission.icon;

  const handleAllow = () => {
    setPermissions(prev => ({ ...prev, [currentPermission.key]: true }));
    handleNext();
  };

  const handleSkip = () => {
    setPermissions(prev => ({ ...prev, [currentPermission.key]: false }));
    handleNext();
  };

  const handleNext = () => {
    if (currentStep < permissionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(permissions);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="bg-white border-0 shadow-2xl overflow-hidden">
          <CardHeader className={`bg-gradient-to-br ${currentPermission.color} text-white p-8`}>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Icon className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center text-white">
              {language === "sw" ? currentPermission.titleSw : currentPermission.titleEn}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            {/* Description */}
            <p className="text-center text-gray-700 text-lg mb-8">
              {language === "sw" ? currentPermission.descSw : currentPermission.descEn}
            </p>

            {/* Visual explanation */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="text-sm text-gray-700">
                  {language === "sw" 
                    ? "Tunatumia hii kukuletea huduma bora zaidi. Taarifa zako ni salama."
                    : "We use this to provide you better service. Your data is secure."}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAllow}
                className={`w-full bg-gradient-to-r ${currentPermission.color} hover:opacity-90 h-12 text-base font-semibold`}
              >
                {language === "sw" 
                  ? `Ruhusu ${currentPermission.key === "camera" ? "Kamera" : currentPermission.key === "location" ? "Eneo" : "Taarifa"}`
                  : `Allow ${currentPermission.key === "camera" ? "Camera" : currentPermission.key === "location" ? "Location" : "Notifications"}`}
              </Button>

              {!currentPermission.required && (
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="w-full h-12 text-base"
                >
                  {language === "sw" ? "Baadaye" : "Later"}
                </Button>
              )}
            </div>

            {/* Progress indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {permissionSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 w-8 rounded-full transition-all ${
                    idx === currentStep 
                      ? 'bg-green-600' 
                      : idx < currentStep 
                        ? 'bg-green-400'
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
