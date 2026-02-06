/**
 * OTP VERIFICATION SCREEN
 * Production-ready phone verification UI with auto-submit, resend, and error handling
 * Supports both English and Swahili
 */

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { AlertCircle, CheckCircle, Loader2, RefreshCw, Phone, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface OTPVerificationScreenProps {
  userId: string;
  phoneNumber: string;
  language?: "en" | "sw";
  onSuccess: () => void;
  onBack?: () => void;
}

export function OTPVerificationScreen({
  userId,
  phoneNumber,
  language = "en",
  onSuccess,
  onBack,
}: OTPVerificationScreenProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (otp.length === 6 && !loading) {
      handleVerify();
    }
  }, [otp]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Translations
  const t = {
    title: language === "sw" ? "Thibitisha Namba Yako ya Simu" : "Verify Your Phone Number",
    description: language === "sw"
      ? `Ingiza namba ya OTP yenye tarakimu 6 iliyotumwa kwenye`
      : `Enter the 6-digit OTP code sent to`,
    placeholder: language === "sw" ? "Ingiza OTP" : "Enter OTP",
    verifying: language === "sw" ? "Inathibitisha..." : "Verifying...",
    resend: language === "sw" ? "Tuma Tena OTP" : "Resend OTP",
    resendIn: language === "sw" ? "Tuma tena baada ya" : "Resend in",
    seconds: language === "sw" ? "sekunde" : "seconds",
    success: language === "sw" ? "Uthibitishaji Umekamilika!" : "Verification Complete!",
    successDesc: language === "sw" 
      ? "Namba yako ya simu imethibitishwa. Unaingia sasa..."
      : "Your phone number has been verified. Logging you in...",
    errorInvalid: language === "sw" ? "OTP si sahihi. Jaribu tena." : "Invalid OTP. Please try again.",
    errorExpired: language === "sw" ? "OTP imeisha muda. Tafadhali tuma tena." : "OTP has expired. Please resend.",
    errorNetwork: language === "sw" ? "Tatizo la mtandao. Jaribu tena." : "Network error. Please try again.",
    errorGeneric: language === "sw" ? "Kuna hitilafu. Jaribu tena." : "Something went wrong. Please try again.",
    resendSuccess: language === "sw" ? "OTP mpya imetumwa!" : "New OTP sent!",
    resendLimit: language === "sw" 
      ? "Umefika kikomo cha kutuma tena. Jaribu baadaye."
      : "You've reached the resend limit. Please try again later.",
    back: language === "sw" ? "Rudi Nyuma" : "Go Back",
    didntReceive: language === "sw" ? "Hukupokea OTP?" : "Didn't receive the code?",
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError(language === "sw" ? "Tafadhali ingiza tarakimu 6" : "Please enter 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/verify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          otp_code: otp,
          method: "phone",
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setVerificationSuccess(true);
        toast.success(t.success, {
          description: t.successDesc,
        });

        // Wait 1.5 seconds to show success state, then proceed
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        // Handle specific error cases
        const errorMessage = result.message || result.error || "";
        
        if (errorMessage.toLowerCase().includes("expired")) {
          setError(t.errorExpired);
        } else if (errorMessage.toLowerCase().includes("invalid")) {
          setError(t.errorInvalid);
        } else {
          setError(errorMessage || t.errorGeneric);
        }
        
        // Clear OTP for retry
        setOtp("");
        
        // Auto-focus for retry
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError(t.errorNetwork);
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    // Limit resend attempts
    if (resendCount >= 3) {
      toast.error(t.resendLimit);
      return;
    }

    setResendCooldown(30);
    setResendCount(resendCount + 1);
    setError("");
    setOtp("");

    try {
      const response = await fetch(`${API_BASE}/resend-otp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          method: "phone",
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success(t.resendSuccess, {
          description: language === "sw"
            ? `OTP mpya imetumwa kwenye ${phoneNumber}`
            : `New OTP sent to ${phoneNumber}`,
        });
      } else {
        toast.error(result.message || t.errorGeneric);
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(t.errorNetwork);
    }
  };

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    // +255712345678 → +255 71 234 5678
    if (phone.startsWith("+255")) {
      const cleaned = phone.replace("+255", "");
      return `+255 ${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5)}`;
    }
    return phone;
  };

  // Success state
  if (verificationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">{t.success}</h3>
              <p className="text-gray-600">{t.successDesc}</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">
                {language === "sw" ? "Inaingia..." : "Redirecting..."}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verification form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Phone className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
          <CardDescription className="text-base">
            {t.description}
            <br />
            <span className="font-semibold text-green-600 text-lg mt-2 inline-block">
              {formatPhoneNumber(phoneNumber)}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          {/* OTP Input */}
          <div className="flex flex-col items-center space-y-4">
            <InputOTP
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setError("");
              }}
              maxLength={6}
              disabled={loading}
              ref={inputRef}
              className="gap-2"
            >
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-12 h-14 text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-green-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">{t.verifying}</span>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <Alert variant="destructive" className="animate-shake">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Resend button */}
          <div className="space-y-3">
            <div className="text-center text-sm text-gray-600">
              {t.didntReceive}
            </div>
            <Button
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              variant="outline"
              className="w-full border-green-600 text-green-600 hover:bg-green-50 disabled:opacity-50"
            >
              {resendCooldown > 0 ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t.resendIn} {resendCooldown} {t.seconds}
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t.resend}
                  {resendCount > 0 && ` (${resendCount}/3)`}
                </>
              )}
            </Button>
          </div>

          {/* Back button */}
          {onBack && (
            <Button
              onClick={onBack}
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.back}
            </Button>
          )}

          {/* Help text */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>
              {language === "sw"
                ? "OTP inaisha baada ya dakika 10"
                : "OTP expires after 10 minutes"}
            </p>
            <p>
              {language === "sw"
                ? "Usishiriki namba hii na mtu yeyote"
                : "Never share this code with anyone"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
