/**
 * UNIFIED ACCESS SCREEN - WORLD-CLASS REDESIGN
 * 
 * One calm entry point for BOTH new and returning users.
 * No marketing. No noise. Just access.
 * 
 * Design Philosophy:
 * - Speed beats polish
 * - Clarity beats features
 * - Silence beats noise
 * - Farmers in the field, not investors in offices
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Phone, ArrowRight, Loader2, CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import logo from "figma:asset/e26027fb3aabd00c928ba655f087af31ac20983e.png";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { toast } from "sonner@2.0.3";

interface UnifiedAccessScreenProps {
  onSuccess: (userData: any) => void;
  language?: "en" | "sw";
}

type AuthMode = "phone" | "otp-new" | "otp-returning" | "password";
type AuthMethod = "phone" | "email";

export function UnifiedAccessScreen({ onSuccess, language = "sw" }: UnifiedAccessScreenProps) {
  const [mode, setMode] = useState<AuthMode>("phone");
  const [authMethod, setAuthMethod] = useState<AuthMethod>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [tempUserId, setTempUserId] = useState<string>("");

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

  const t = {
    en: {
      appName: "KILIMO AI",
      tagline: "Smart farming, simple payments.",
      phonePlaceholder: "+255 XXX XXX XXX",
      emailPlaceholder: "your@email.com",
      continue: "Continue",
      verifyPhone: "Verify your number",
      otpSent: "We sent a code to",
      enterOtp: "Enter 6-digit code",
      verify: "Verify",
      welcome: "Welcome back",
      enterPassword: "Enter password",
      useOtp: "Use code instead",
      login: "Log In",
      checking: "Checking...",
      verifying: "Verifying...",
      loggingIn: "Logging in...",
      phoneTab: "Phone",
      emailTab: "Email",
    },
    sw: {
      appName: "KILIMO AI",
      tagline: "Kilimo cha kisasa, malipo rahisi.",
      phonePlaceholder: "+255 XXX XXX XXX",
      emailPlaceholder: "barua@pepe.com",
      continue: "Endelea",
      verifyPhone: "Thibitisha namba yako",
      otpSent: "Tumetuma nambari kwenye",
      enterOtp: "Weka nambari ya tarakimu 6",
      verify: "Thibitisha",
      welcome: "Karibu tena",
      enterPassword: "Weka nenosiri",
      useOtp: "Tumia nambari badala yake",
      login: "Ingia",
      checking: "Inaangalia...",
      verifying: "Inathibitisha...",
      loggingIn: "Inaingia...",
      phoneTab: "Simu",
      emailTab: "Barua pepe",
    },
  };

  const text = t[language];

  // Handle phone submission
  const handlePhoneContinue = async () => {
    if (!phoneNumber.trim()) {
      toast.error(language === "en" ? "Enter phone number" : "Weka namba ya simu");
      return;
    }

    setLoading(true);

    try {
      // Check if user exists
      const checkResponse = await fetch(`${API_BASE}/auth/check-user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });

      const checkResult = await checkResponse.json();

      if (checkResult.exists) {
        // Returning user - ask for password or send OTP
        setIsReturningUser(true);
        setMode("password");
      } else {
        // New user - send OTP for registration
        const otpResponse = await fetch(`${API_BASE}/auth/send-otp`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone_number: phoneNumber, language }),
        });

        const otpResult = await otpResponse.json();

        if (otpResult.status === "success") {
          // Store the user_id for OTP verification
          setTempUserId(otpResult.user_id);
          setIsReturningUser(false);
          setMode("otp-new");
          toast.success(
            language === "en" 
              ? `Code sent to ${phoneNumber}` 
              : `Nambari imetumwa kwenye ${phoneNumber}`
          );
        } else {
          throw new Error(otpResult.message || "Failed to send code");
        }
      }
    } catch (error) {
      console.error("Phone check error:", error);
      toast.error(language === "en" ? "Connection error" : "Tatizo la mtandao");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification (new user)
  const handleOTPVerify = async () => {
    if (otp.length !== 6) {
      toast.error(language === "en" ? "Enter 6-digit code" : "Weka nambari ya tarakimu 6");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: tempUserId,
          otp: otp,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        // For new users, pass to QuickProfile to collect name + role
        // Create basic user object that will be completed
        const basicUser = {
          id: result.user_id,
          phone: phoneNumber,
          name: phoneNumber, // Temporary - will update in QuickProfile
          role: "smallholder_farmer", // Default - will update in QuickProfile
          verified: true,
          onboardingCompleted: false,
        };
        
        onSuccess(basicUser);
      } else {
        toast.error(language === "en" ? "Invalid code" : "Nambari si sahihi");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(language === "en" ? "Verification failed" : "Uthibitishaji umeshindwa");
    } finally {
      setLoading(false);
    }
  };

  // Handle password login (returning user)
  const handlePasswordLogin = async () => {
    if (!password.trim()) {
      toast.error(language === "en" ? "Enter password" : "Weka nenosiri");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: phoneNumber,
          password: password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess(result.user);
      } else {
        toast.error(result.error || (language === "en" ? "Login failed" : "Kuingia kumeshindwa"));
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(language === "en" ? "Connection error" : "Tatizo la mtandao");
    } finally {
      setLoading(false);
    }
  };

  // Handle "Use OTP instead" for returning users
  const handleSwitchToOTP = async () => {
    setLoading(true);
    setMode("otp-returning");

    try {
      const response = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number: phoneNumber, language }),
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success(
          language === "en" 
            ? `Code sent to ${phoneNumber}` 
            : `Nambari imetumwa kwenye ${phoneNumber}`
        );
      } else {
        throw new Error(result.message || "Failed to send code");
      }
    } catch (error) {
      console.error("OTP send error:", error);
      toast.error(language === "en" ? "Failed to send code" : "Nambari haikutumwa");
      setMode("password");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP login for returning users
  const handleOTPLogin = async () => {
    if (otp.length !== 6) {
      toast.error(language === "en" ? "Enter 6-digit code" : "Weka nambari ya tarakimu 6");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login-otp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          otp_code: otp,
        }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess(result.user);
      } else {
        toast.error(language === "en" ? "Invalid code" : "Nambari si sahihi");
      }
    } catch (error) {
      console.error("OTP login error:", error);
      toast.error(language === "en" ? "Login failed" : "Kuingia kumeshindwa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <img src={logo} alt="KILIMO" className="h-16 w-16" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{text.appName}</h1>
          <p className="text-sm text-gray-600">{text.tagline}</p>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* PHONE INPUT MODE */}
          {mode === "phone" && (
            <div className="space-y-4">
              {/* Auth Method Tabs */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setAuthMethod("phone")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                    authMethod === "phone"
                      ? "bg-white text-[#2E7D32] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  disabled={loading}
                >
                  <Phone className="h-4 w-4" />
                  {text.phoneTab}
                </button>
                <button
                  onClick={() => setAuthMethod("email")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                    authMethod === "email"
                      ? "bg-white text-[#2E7D32] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  disabled={loading}
                >
                  <Mail className="h-4 w-4" />
                  {text.emailTab}
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor={authMethod} className="text-sm font-medium text-gray-700">
                  {authMethod === "phone" 
                    ? (language === "en" ? "Phone Number" : "Namba ya Simu")
                    : (language === "en" ? "Email Address" : "Barua Pepe")
                  }
                </Label>
                <div className="relative">
                  {authMethod === "phone" ? (
                    <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  ) : (
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  )}
                  <Input
                    id={authMethod}
                    type={authMethod === "phone" ? "tel" : "email"}
                    placeholder={authMethod === "phone" ? text.phonePlaceholder : text.emailPlaceholder}
                    value={authMethod === "phone" ? phoneNumber : email}
                    onChange={(e) => authMethod === "phone" ? setPhoneNumber(e.target.value) : setEmail(e.target.value)}
                    className="pl-12 h-12 text-base border-gray-300 focus:border-[#2E7D32] focus:ring-[#2E7D32]"
                    disabled={loading}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handlePhoneContinue();
                      }
                    }}
                  />
                </div>
              </div>

              <Button
                onClick={handlePhoneContinue}
                disabled={loading || (authMethod === "phone" ? !phoneNumber.trim() : !email.trim())}
                className="w-full h-12 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {text.checking}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {text.continue}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          )}

          {/* OTP VERIFICATION MODE (New User) */}
          {mode === "otp-new" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E8F5E9] rounded-full mb-3">
                  <Phone className="h-4 w-4 text-[#2E7D32]" />
                  <span className="text-sm font-medium text-[#2E7D32]">{phoneNumber}</span>
                </div>
                <p className="text-sm text-gray-600">{text.otpSent}</p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">{text.enterOtp}</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    disabled={loading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-12 h-12 text-lg border-gray-300" />
                      <InputOTPSlot index={1} className="w-12 h-12 text-lg border-gray-300" />
                      <InputOTPSlot index={2} className="w-12 h-12 text-lg border-gray-300" />
                      <InputOTPSlot index={3} className="w-12 h-12 text-lg border-gray-300" />
                      <InputOTPSlot index={4} className="w-12 h-12 text-lg border-gray-300" />
                      <InputOTPSlot index={5} className="w-12 h-12 text-lg border-gray-300" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                onClick={handleOTPVerify}
                disabled={loading || otp.length !== 6}
                className="w-full h-12 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {text.verifying}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {text.verify}
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                )}
              </Button>

              <button
                onClick={() => {
                  setMode("phone");
                  setOtp("");
                }}
                className="w-full text-sm text-gray-600 hover:text-gray-900 py-2"
              >
                {language === "en" ? "Change number" : "Badili namba"}
              </button>
            </motion.div>
          )}

          {/* PASSWORD MODE (Returning User) */}
          {mode === "password" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E8F5E9] rounded-full mb-3">
                  <CheckCircle2 className="h-4 w-4 text-[#2E7D32]" />
                  <span className="text-sm font-medium text-[#2E7D32]">{phoneNumber}</span>
                </div>
                <p className="text-sm text-gray-600">{text.welcome}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  {text.enterPassword}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base border-gray-300 focus:border-[#2E7D32] focus:ring-[#2E7D32]"
                  disabled={loading}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handlePasswordLogin();
                    }
                  }}
                />
              </div>

              <Button
                onClick={handlePasswordLogin}
                disabled={loading || !password.trim()}
                className="w-full h-12 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {text.loggingIn}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {text.login}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>

              <div className="text-center space-y-2">
                <button
                  onClick={handleSwitchToOTP}
                  disabled={loading}
                  className="text-sm text-[#2E7D32] hover:text-[#1B5E20] font-medium"
                >
                  {text.useOtp}
                </button>
                <div className="h-px bg-gray-200 my-3" />
                <button
                  onClick={() => {
                    setMode("phone");
                    setPassword("");
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {language === "en" ? "Change number" : "Badili namba"}
                </button>
              </div>
            </motion.div>
          )}

          {/* OTP MODE (Returning User) */}
          {mode === "otp-returning" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E8F5E9] rounded-full mb-3">
                  <Phone className="h-4 w-4 text-[#2E7D32]" />
                  <span className="text-sm font-medium text-[#2E7D32]">{phoneNumber}</span>
                </div>
                <p className="text-sm text-gray-600">{text.otpSent}</p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">{text.enterOtp}</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    disabled={loading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-12 h-12 text-lg border-gray-300" />
                      <InputOTPSlot index={1} className="w-12 h-12 text-lg border-gray-300" />
                      <InputOTPSlot index={2} className="w-12 h-12 text-lg border-gray-300" />
                      <InputOTPSlot index={3} className="w-12 h-12 text-lg border-gray-300" />
                      <InputOTPSlot index={4} className="w-12 h-12 text-lg border-gray-300" />
                      <InputOTPSlot index={5} className="w-12 h-12 text-lg border-gray-300" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                onClick={handleOTPLogin}
                disabled={loading || otp.length !== 6}
                className="w-full h-12 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {text.verifying}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {text.verify}
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                )}
              </Button>

              <div className="text-center space-y-2">
                <button
                  onClick={() => {
                    setMode("password");
                    setOtp("");
                  }}
                  className="text-sm text-[#2E7D32] hover:text-[#1B5E20] font-medium"
                >
                  {language === "en" ? "Use password instead" : "Tumia nenosiri badala yake"}
                </button>
                <div className="h-px bg-gray-200 my-3" />
                <button
                  onClick={() => {
                    setMode("phone");
                    setOtp("");
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {language === "en" ? "Change number" : "Badili namba"}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}