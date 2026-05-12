/**
 * SIGNUP WITH OTP FLOW
 * Complete registration flow with OTP verification
 * Drop-in replacement for existing signup flow
 */

import { useState } from "react";
import { RoleBasedRegistrationForm } from "./RoleBasedRegistrationForm";
import { OTPVerificationScreen } from "./OTPVerificationScreen";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface SignupWithOTPFlowProps {
  language?: "en" | "sw";
  onComplete: (userData: any) => void;
  onBack?: () => void;
}

type FlowStep = "register" | "verify-otp" | "complete";

export function SignupWithOTPFlow({
  language = "en",
  onComplete,
  onBack,
}: SignupWithOTPFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("register");
  const [pendingUserId, setPendingUserId] = useState("");
  const [pendingPhone, setPendingPhone] = useState("");
  const [pendingUserData, setPendingUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

  const handleRegister = async (data: any) => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: data.role,
          name: data.name,
          phone_number: data.phone,
          email: data.email || null,
          password: data.password,
          language: language,
          location: {
            region: data.region,
            district: data.district,
          },
          role_specific_fields: {
            farm_size: data.farmSize,
            crops: data.crops,
            gender: data.gender,
            ageGroup: data.ageGroup,
            // Add other role-specific fields as needed
          },
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        // Store user details for after verification
        setPendingUserId(result.user_id);
        setPendingPhone(data.phone);
        setPendingUserData(data);

        // Move to OTP verification step
        setCurrentStep("verify-otp");

        toast.success(
          language === "sw"
            ? "Akaunti imeundwa! Thibitisha namba yako ya simu."
            : "Account created! Please verify your phone number.",
          {
            description: language === "sw"
              ? `OTP imetumwa kwenye ${data.phone}`
              : `OTP sent to ${data.phone}`,
          }
        );
      } else {
        // Handle registration errors
        const errorMessage =
          result.message || result.error || "Registration failed";

        toast.error(
          language === "sw" ? "Usajili umeshindwa" : "Registration failed",
          {
            description: errorMessage,
          }
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        language === "sw"
          ? "Tatizo la mtandao. Jaribu tena."
          : "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = async () => {
    // Fetch complete user data after verification
    try {
      const response = await fetch(`${API_BASE}/profile/${pendingUserId}`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        // Store user in localStorage
        localStorage.setItem("kilimoUser", JSON.stringify(result.user));

        // Call parent onComplete
        onComplete(result.user);
      } else {
        // Fallback: use pending data
        const userData = {
          id: pendingUserId,
          ...pendingUserData,
          verified: true,
          verifiedAt: new Date().toISOString(),
        };
        localStorage.setItem("kilimoUser", JSON.stringify(userData));
        onComplete(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Fallback: use pending data
      const userData = {
        id: pendingUserId,
        ...pendingUserData,
        verified: true,
        verifiedAt: new Date().toISOString(),
      };
      localStorage.setItem("kilimoUser", JSON.stringify(userData));
      onComplete(userData);
    }
  };

  const handleBackFromOTP = () => {
    setCurrentStep("register");
    setPendingUserId("");
    setPendingPhone("");
    setPendingUserData(null);
  };

  // Render current step
  switch (currentStep) {
    case "register":
      return (
        <RoleBasedRegistrationForm
          onRegister={handleRegister}
          loading={loading}
          language={language}
        />
      );

    case "verify-otp":
      return (
        <OTPVerificationScreen
          userId={pendingUserId}
          phoneNumber={pendingPhone}
          language={language}
          onSuccess={handleOTPSuccess}
          onBack={handleBackFromOTP}
        />
      );

    default:
      return null;
  }
}
