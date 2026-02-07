/**
 * QUICK PROFILE - NEW USERS ONLY
 * 
 * Minimal information collection after OTP verification.
 * Only name + role. Everything else is contextual.
 * 
 * Design: Calm, fast, no distractions.
 */

import { useState } from "react";
import { motion } from "motion/react";
import { User, Briefcase, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { toast } from "sonner@2.0.3";

interface QuickProfileProps {
  phoneNumber: string;
  userId: string;
  onComplete: (userData: any) => void;
  language?: "en" | "sw";
}

const ROLES = [
  {
    id: "smallholder_farmer",
    label: { en: "Smallholder Farmer", sw: "Mkulima Mdogo" },
    icon: "🌾",
  },
  {
    id: "commercial_farmer",
    label: { en: "Commercial Farmer", sw: "Mkulima wa Biashara" },
    icon: "🚜",
  },
  {
    id: "agribusiness",
    label: { en: "Agribusiness", sw: "Biashara ya Kilimo" },
    icon: "🏢",
  },
  {
    id: "extension_officer",
    label: { en: "Extension Officer", sw: "Afisa Ugani" },
    icon: "👨‍🌾",
  },
  {
    id: "cooperative_member",
    label: { en: "Cooperative", sw: "Ushirika" },
    icon: "🤝",
  },
];

export function QuickProfile({ phoneNumber, userId, onComplete, language = "sw" }: QuickProfileProps) {
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

  const t = {
    en: {
      title: "One last thing",
      subtitle: "Help us personalize your experience",
      nameLabel: "Your name",
      namePlaceholder: "e.g., John Doe",
      roleLabel: "I am a...",
      complete: "Get Started",
      completing: "Setting up...",
    },
    sw: {
      title: "Jambo la mwisho",
      subtitle: "Tusaidie kukupatia uzoefu bora",
      nameLabel: "Jina lako",
      namePlaceholder: "mfano, John Doe",
      roleLabel: "Mimi ni...",
      complete: "Anza Kutumia",
      completing: "Inaandaa...",
    },
  };

  const text = t[language];

  const handleComplete = async () => {
    if (!name.trim()) {
      toast.error(language === "en" ? "Enter your name" : "Weka jina lako");
      return;
    }

    if (!selectedRole) {
      toast.error(language === "en" ? "Select your role" : "Chagua wadhifa wako");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/complete-profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          name: name.trim(),
          role: selectedRole,
          phone_number: phoneNumber,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const userData = {
          id: userId,
          name: name.trim(),
          phone: phoneNumber,
          role: selectedRole,
          verified: true,
          onboardingCompleted: false, // Will show contextual setup later
          tier: "free",
        };

        onComplete(userData);
      } else {
        // Even if API fails, continue with local data
        const userData = {
          id: userId,
          name: name.trim(),
          phone: phoneNumber,
          role: selectedRole,
          verified: true,
          onboardingCompleted: false,
          tier: "free",
        };

        onComplete(userData);
      }
    } catch (error) {
      console.error("Profile completion error:", error);
      // Don't block user - continue anyway
      const userData = {
        id: userId,
        name: name.trim(),
        phone: phoneNumber,
        role: selectedRole,
        verified: true,
        onboardingCompleted: false,
        tier: "free",
      };

      onComplete(userData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{text.title}</h1>
          <p className="text-sm text-gray-600">{text.subtitle}</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              {text.nameLabel}
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder={text.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-12 h-12 text-base border-gray-300 focus:border-[#2E7D32] focus:ring-[#2E7D32]"
                disabled={loading}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">{text.roleLabel}</Label>
            <div className="grid gap-2">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  disabled={loading}
                  className={`
                    flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left
                    ${
                      selectedRole === role.id
                        ? "border-[#2E7D32] bg-[#E8F5E9]"
                        : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <span className="text-2xl">{role.icon}</span>
                  <span className="font-medium text-gray-900">{role.label[language]}</span>
                  {selectedRole === role.id && (
                    <div className="ml-auto h-5 w-5 rounded-full bg-[#2E7D32] flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleComplete}
            disabled={loading || !name.trim() || !selectedRole}
            className="w-full h-12 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {text.completing}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {text.complete}
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#2E7D32]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#2E7D32]" />
          <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
        </div>
      </motion.div>
    </div>
  );
}
