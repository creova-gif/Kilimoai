/**
 * UNIFIED DUAL AUTH - KILIMO PRODUCTION SYSTEM
 * 
 * Engineered for simplicity, security, and farmer-first UX
 * 
 * Features:
 * - Email + Password (NO OTP)
 * - Phone + OTP (Optional, user choice)
 * - Single entry screen
 * - Tab-based method selection
 * - Clear recovery paths
 * - No dead ends
 * 
 * Philosophy:
 * - User choice is sacred
 * - Speed beats polish
 * - Recovery beats prevention
 * - Clarity beats features
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, Lock, ArrowRight, Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import logo from "figma:asset/e26027fb3aabd00c928ba655f087af31ac20983e.png";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { toast } from "sonner@2.0.3";
import { supabase } from "../../utils/supabase/client";

interface UnifiedDualAuthProps {
  onSuccess: (userData: any) => void;
  language?: "en" | "sw";
}

type AuthMethod = "phone" | "email";
type AuthMode = "entry" | "otp-verify" | "password-reset";
type AuthAction = "signup" | "login";

export function UnifiedDualAuth({ onSuccess, language = "sw" }: UnifiedDualAuthProps) {
  // Auth state
  const [authMethod, setAuthMethod] = useState<AuthMethod>("phone");
  const [authMode, setAuthMode] = useState<AuthMode>("entry");
  const [authAction, setAuthAction] = useState<AuthAction>("login");
  
  // Form inputs
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("smallholder_farmer");
  const [otp, setOtp] = useState("");
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempUserId, setTempUserId] = useState("");
  const [debugOTP, setDebugOTP] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;
  
  // Supabase client (singleton imported from utils/supabase/client.ts)

  const t = {
    en: {
      // Main
      welcome: "Welcome to KILIMO",
      tagline: "Smart farming starts here.",
      phoneTab: "Phone",
      emailTab: "Email",
      
      // Phone
      phoneLabel: "Phone Number",
      phonePlaceholder: "+255 XXX XXX XXX",
      continueWithPhone: "Continue with Phone",
      
      // Email
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter password",
      continueWithEmail: "Continue with Email",
      forgotPassword: "Forgot password?",
      
      // OTP
      otpSent: "Code sent to",
      enterOtp: "Enter 6-digit code",
      verifyCode: "Verify Code",
      resendCode: "Resend code",
      changeNumber: "Change number",
      
      // Actions
      signUp: "Sign up",
      logIn: "Log in",
      createAccount: "Create account",
      alreadyHaveAccount: "Already have an account?",
      noAccount: "Don't have an account?",
      
      // Reset
      resetTitle: "Reset Password",
      resetSubtitle: "Enter your email to receive reset link",
      sendResetLink: "Send reset link",
      backToLogin: "Back to login",
      resetSuccess: "Check your email for reset link",
      
      // Profile
      nameLabel: "Full Name",
      namePlaceholder: "John Doe",
      roleLabel: "I am a...",
      
      // Roles
      roles: {
        smallholder_farmer: "Smallholder Farmer",
        commercial_farmer: "Commercial Farmer",
        agribusiness: "Agribusiness Owner",
        extension_officer: "Extension Officer",
        institutional: "Institution/NGO",
        cooperative: "Cooperative Member",
        researcher: "Researcher/Student"
      },
      
      // States
      loading: "Loading...",
      verifying: "Verifying...",
      sending: "Sending...",
      
      // Errors
      emailRequired: "Email is required",
      emailInvalid: "Invalid email format",
      passwordRequired: "Password is required",
      passwordShort: "Password must be at least 6 characters",
      phoneRequired: "Phone number is required",
      phoneInvalid: "Invalid phone format",
      nameRequired: "Name is required",
      otpRequired: "Enter 6-digit code",
      accountExists: "Account exists. Log in instead.",
      wrongPassword: "Wrong password. Try again or reset it.",
      accountNotFound: "Account not found. Sign up instead.",
      otpInvalid: "Invalid code. Try again.",
    },
    sw: {
      // Main
      welcome: "Karibu KILIMO",
      tagline: "Kilimo cha kisasa kinaanzia hapa.",
      phoneTab: "Simu",
      emailTab: "Barua Pepe",
      
      // Phone
      phoneLabel: "Namba ya Simu",
      phonePlaceholder: "+255 XXX XXX XXX",
      continueWithPhone: "Endelea na Simu",
      
      // Email
      emailLabel: "Barua Pepe",
      emailPlaceholder: "barua@pepe.com",
      passwordLabel: "Nenosiri",
      passwordPlaceholder: "Weka nenosiri",
      continueWithEmail: "Endelea na Barua Pepe",
      forgotPassword: "Umesahau nenosiri?",
      
      // OTP
      otpSent: "Nambari imetumwa kwenye",
      enterOtp: "Weka nambari ya tarakimu 6",
      verifyCode: "Thibitisha Nambari",
      resendCode: "Tuma tena",
      changeNumber: "Badili namba",
      
      // Actions
      signUp: "Jisajili",
      logIn: "Ingia",
      createAccount: "Unda akaunti",
      alreadyHaveAccount: "Una akaunti tayari?",
      noAccount: "Huna akaunti?",
      
      // Reset
      resetTitle: "Badilisha Nenosiri",
      resetSubtitle: "Weka barua pepe kupata kiungo",
      sendResetLink: "Tuma kiungo",
      backToLogin: "Rudi kwa kuingia",
      resetSuccess: "Angalia barua pepe yako",
      
      // Profile
      nameLabel: "Jina Kamili",
      namePlaceholder: "Jina lako",
      roleLabel: "Mimi ni...",
      
      // Roles
      roles: {
        smallholder_farmer: "Mkulima Mdogo",
        commercial_farmer: "Mkulima wa Biashara",
        agribusiness: "Mmiliki wa Biashara ya Kilimo",
        extension_officer: "Afisa wa Ugani",
        institutional: "Taasisi/NGO",
        cooperative: "Mwanachama wa Ushirika",
        researcher: "Mtafiti/Mwanafunzi"
      },
      
      // States
      loading: "Inapakia...",
      verifying: "Inathibitisha...",
      sending: "Inatuma...",
      
      // Errors
      emailRequired: "Barua pepe inahitajika",
      emailInvalid: "Muundo wa barua pepe si sahihi",
      passwordRequired: "Nenosiri linahitajika",
      passwordShort: "Nenosiri lazima liwe na angalau herufi 6",
      phoneRequired: "Namba ya simu inahitajika",
      phoneInvalid: "Muundo wa namba si sahihi",
      nameRequired: "Jina linahitajika",
      otpRequired: "Weka nambari ya tarakimu 6",
      accountExists: "Akaunti ipo. Ingia badala yake.",
      wrongPassword: "Nenosiri si sahihi. Jaribu tena.",
      accountNotFound: "Akaunti haipo. Jisajili badala yake.",
      otpInvalid: "Nambari si sahihi. Jaribu tena.",
    },
  };

  const text = t[language];

  // Validation helpers
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^\+255[0-9]{9}$/.test(phone.replace(/\s/g, ""));

  // EMAIL SIGNUP
  const handleEmailSignup = async () => {
    if (!email.trim()) return toast.error(text.emailRequired);
    if (!isValidEmail(email)) return toast.error(text.emailInvalid);
    if (!password.trim()) return toast.error(text.passwordRequired);
    if (password.length < 6) return toast.error(text.passwordShort);
    if (!name.trim()) return toast.error(text.nameRequired);

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: { name: name.trim(), role: role, tier: "free", language: language }
        }
      });

      if (error) throw error;

      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: name.trim(),
          role: role,
          tier: "free",
          verified: true,
          onboardingCompleted: false,
        };

        localStorage.setItem("kilimoUser", JSON.stringify(userData));
        toast.success(language === "en" ? `Welcome, ${name}! 🌾` : `Karibu, ${name}! 🌾`);
        onSuccess(userData);
      }
    } catch (error: any) {
      console.error("Email signup error:", error);
      if (error.message?.includes("already registered")) {
        toast.error(text.accountExists);
        setAuthAction("login");
      } else {
        toast.error(error.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // EMAIL LOGIN
  const handleEmailLogin = async () => {
    if (!email.trim()) return toast.error(text.emailRequired);
    if (!password.trim()) return toast.error(text.passwordRequired);

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      if (data.user && data.session) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email,
          role: data.user.user_metadata?.role || "smallholder_farmer",
          tier: data.user.user_metadata?.tier || "free",
          verified: true,
          onboardingCompleted: data.user.user_metadata?.onboarding_complete || false,
        };

        localStorage.setItem("kilimoUser", JSON.stringify(userData));
        toast.success(language === "en" ? `Welcome back, ${userData.name}! 🌾` : `Karibu tena, ${userData.name}! 🌾`);
        onSuccess(userData);
      }
    } catch (error: any) {
      console.error("Email login error:", error);
      if (error.message?.includes("Invalid login credentials")) {
        toast.error(text.wrongPassword);
      } else {
        toast.error(error.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // PHONE SIGNUP - Send OTP
  const handlePhoneSignup = async () => {
    if (!phoneNumber.trim()) return toast.error(text.phoneRequired);
    if (!isValidPhone(phoneNumber)) return toast.error(text.phoneInvalid);

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number: phoneNumber, language }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setTempUserId(result.user_id);
        setAuthMode("otp-verify");
        toast.success(language === "en" ? `Code sent to ${phoneNumber}` : `Nambari imetumwa kwenye ${phoneNumber}`);
        
        // DEV MODE: Show OTP
        if (result.debug_otp) {
          setDebugOTP(result.debug_otp);
          toast.success(`🔓 DEV OTP: ${result.debug_otp}`, { duration: 10000 });
        }
      } else {
        throw new Error(result.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("Phone signup error:", error);
      toast.error(error.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  // PHONE LOGIN - Send OTP
  const handlePhoneLogin = async () => {
    if (!phoneNumber.trim()) return toast.error(text.phoneRequired);
    if (!isValidPhone(phoneNumber)) return toast.error(text.phoneInvalid);

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number: phoneNumber, language }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setTempUserId(result.user_id);
        setAuthMode("otp-verify");
        toast.success(language === "en" ? `Code sent to ${phoneNumber}` : `Nambari imetumwa kwenye ${phoneNumber}`);
        
        // DEV MODE: Show OTP
        if (result.debug_otp) {
          setDebugOTP(result.debug_otp);
          toast.success(`🔓 DEV OTP: ${result.debug_otp}`, { duration: 10000 });
        }
      } else {
        throw new Error(result.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("Phone login error:", error);
      toast.error(error.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  // OTP VERIFY
  const handleOTPVerify = async () => {
    if (otp.length !== 6) return toast.error(text.otpRequired);

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: tempUserId, otp: otp }),
      });

      const result = await response.json();

      if (result.status === "success") {
        const userData = {
          id: result.user_id,
          phone: phoneNumber,
          name: phoneNumber,
          role: "smallholder_farmer",
          verified: true,
          onboardingCompleted: false,
        };

        localStorage.setItem("kilimoUser", JSON.stringify(userData));
        toast.success(language === "en" ? "Verified! 🎉" : "Imethibitishwa! 🎉");
        onSuccess(userData);
      } else {
        toast.error(text.otpInvalid);
      }
    } catch (error: any) {
      console.error("OTP verify error:", error);
      toast.error(text.otpInvalid);
    } finally {
      setLoading(false);
    }
  };

  // PASSWORD RESET
  const handlePasswordReset = async () => {
    if (!email.trim()) return toast.error(text.emailRequired);
    if (!isValidEmail(email)) return toast.error(text.emailInvalid);

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setResetSent(true);
      toast.success(text.resetSuccess);
    } catch (error: any) {
      console.error("Reset error:", error);
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo & Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-3">
            <img src={logo} alt="KILIMO" className="h-16 w-16" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{text.welcome}</h1>
          <p className="text-sm text-gray-600">{text.tagline}</p>
        </motion.div>

        {/* Main Auth Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* PASSWORD RESET MODE */}
          {authMode === "password-reset" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{text.resetTitle}</h2>
                <p className="text-sm text-gray-600 mt-1">{text.resetSubtitle}</p>
              </div>

              {!resetSent ? (
                <>
                  <div className="space-y-2">
                    <Label>{text.emailLabel}</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder={text.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12"
                        disabled={loading}
                        autoFocus
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handlePasswordReset}
                    disabled={loading}
                    className="w-full h-12 bg-[#2E7D32] hover:bg-[#1B5E20]"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : text.sendResetLink}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-16 w-16 text-[#2E7D32] mx-auto mb-4" />
                  <p className="text-gray-900 font-medium">{text.resetSuccess}</p>
                </div>
              )}

              <button
                onClick={() => { setAuthMode("entry"); setResetSent(false); }}
                className="w-full text-sm text-[#2E7D32] hover:text-[#1B5E20] font-medium"
              >
                {text.backToLogin}
              </button>
            </div>
          )}

          {/* OTP VERIFY MODE */}
          {authMode === "otp-verify" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E8F5E9] rounded-full mb-3">
                  <Phone className="h-4 w-4 text-[#2E7D32]" />
                  <span className="text-sm font-medium text-[#2E7D32]">{phoneNumber}</span>
                </div>
                <p className="text-sm text-gray-600">{text.otpSent}</p>
              </div>

              <div className="space-y-3">
                <Label>{text.enterOtp}</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={loading}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                      <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {/* DEV MODE: Show OTP */}
                {debugOTP && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs font-semibold text-yellow-800 mb-1">🔓 DEV MODE - OTP:</p>
                    <p className="text-2xl font-bold text-yellow-900 font-mono">{debugOTP}</p>
                  </div>
                )}
              </div>

              <Button
                onClick={handleOTPVerify}
                disabled={loading || otp.length !== 6}
                className="w-full h-12 bg-[#2E7D32] hover:bg-[#1B5E20]"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : text.verifyCode}
              </Button>

              <div className="text-center space-y-2">
                <button
                  onClick={() => authAction === "signup" ? handlePhoneSignup() : handlePhoneLogin()}
                  className="text-sm text-[#2E7D32] hover:text-[#1B5E20] font-medium"
                  disabled={loading}
                >
                  {text.resendCode}
                </button>
                <div className="h-px bg-gray-200 my-3" />
                <button
                  onClick={() => { setAuthMode("entry"); setOtp(""); }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {text.changeNumber}
                </button>
              </div>
            </div>
          )}

          {/* ENTRY MODE - TABS */}
          {authMode === "entry" && (
            <div className="space-y-4">
              {/* Method Tabs */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setAuthMethod("phone")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                    authMethod === "phone"
                      ? "bg-white text-[#2E7D32] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
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
                >
                  <Mail className="h-4 w-4" />
                  {text.emailTab}
                </button>
              </div>

              {/* PHONE TAB */}
              {authMethod === "phone" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{text.phoneLabel}</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder={text.phonePlaceholder}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-12 h-12"
                        disabled={loading}
                        autoFocus
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => authAction === "signup" ? handlePhoneSignup() : handlePhoneLogin()}
                    disabled={loading}
                    className="w-full h-12 bg-[#2E7D32] hover:bg-[#1B5E20]"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        {text.continueWithPhone}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>

                  <div className="text-center text-sm">
                    {authAction === "login" ? (
                      <p className="text-gray-600">
                        {text.noAccount}{" "}
                        <button
                          onClick={() => setAuthAction("signup")}
                          className="text-[#2E7D32] hover:text-[#1B5E20] font-medium"
                        >
                          {text.signUp}
                        </button>
                      </p>
                    ) : (
                      <p className="text-gray-600">
                        {text.alreadyHaveAccount}{" "}
                        <button
                          onClick={() => setAuthAction("login")}
                          className="text-[#2E7D32] hover:text-[#1B5E20] font-medium"
                        >
                          {text.logIn}
                        </button>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* EMAIL TAB */}
              {authMethod === "email" && (
                <div className="space-y-4">
                  {authAction === "signup" && (
                    <div className="space-y-2">
                      <Label>{text.nameLabel}</Label>
                      <Input
                        type="text"
                        placeholder={text.namePlaceholder}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12"
                        disabled={loading}
                        autoFocus
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>{text.emailLabel}</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder={text.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12"
                        disabled={loading}
                        autoFocus={authAction === "login"}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{text.passwordLabel}</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={text.passwordPlaceholder}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 pr-12 h-12"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {authAction === "signup" && (
                    <div className="space-y-2">
                      <Label>{text.roleLabel}</Label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full h-12 px-4 border border-gray-300 rounded-md"
                        disabled={loading}
                      >
                        {Object.entries(text.roles).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <Button
                    onClick={() => authAction === "signup" ? handleEmailSignup() : handleEmailLogin()}
                    disabled={loading}
                    className="w-full h-12 bg-[#2E7D32] hover:bg-[#1B5E20]"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        {authAction === "signup" ? text.createAccount : text.continueWithEmail}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>

                  {authAction === "login" && (
                    <button
                      onClick={() => setAuthMode("password-reset")}
                      className="w-full text-sm text-[#2E7D32] hover:text-[#1B5E20] font-medium"
                    >
                      {text.forgotPassword}
                    </button>
                  )}

                  <div className="text-center text-sm">
                    {authAction === "login" ? (
                      <p className="text-gray-600">
                        {text.noAccount}{" "}
                        <button
                          onClick={() => setAuthAction("signup")}
                          className="text-[#2E7D32] hover:text-[#1B5E20] font-medium"
                        >
                          {text.createAccount}
                        </button>
                      </p>
                    ) : (
                      <p className="text-gray-600">
                        {text.alreadyHaveAccount}{" "}
                        <button
                          onClick={() => setAuthAction("login")}
                          className="text-[#2E7D32] hover:text-[#1B5E20] font-medium"
                        >
                          {text.logIn}
                        </button>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
