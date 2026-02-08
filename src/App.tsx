import image_e26027fb3aabd00c928ba655f087af31ac20983e from 'figma:asset/e26027fb3aabd00c928ba655f087af31ac20983e.png';
import image_258b5db2e38846cbee79c22a5c47ff1d8ec47802 from 'figma:asset/258b5db2e38846cbee79c22a5c47ff1d8ec47802.png';
import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner@2.0.3";
import { 
  Home, MessageSquare, Camera, TrendingUp, CloudRain, ShoppingCart, 
  Users, Briefcase, BookOpen, Shield, BarChart3, LineChart, Calendar,
  Award, Bell, User, LogOut, Menu, X, Search, Settings, 
  Brain, Wheat, Phone, ClipboardList, Sprout, Activity, Map, Target,
  Warehouse, Calculator, CreditCard, ShoppingBag, Package, FileText,
  IdCard, Network, Lightbulb, Leaf, Microscope, Link, Send, HelpCircle,
  PhoneCall, Info, PlayCircle, MessageCircle, Building2, DollarSign, Boxes, Zap, Wallet
} from "lucide-react";

import { UnifiedDualAuth } from "./components/auth/UnifiedDualAuth"; // ✅ PRODUCTION: Dual-method auth (Email+Password OR Phone+OTP)
import { supabase } from "./utils/supabase/client"; // ✅ Singleton Supabase client
import { InlinePersonalizationCard } from "./components/InlinePersonalizationCard"; // ✅ Non-blocking personalization
import { OnboardingV3WorldClass } from "./components/onboarding-v3/OnboardingV3WorldClass"; // ✅ Legacy onboarding (if needed)
import { DemoModeControlPanel } from "./components/DemoModeControlPanel";
import logo from "figma:asset/59f0b6f20637b554072039bc3a2caa41a72f5af6.png";
import circleLogo from "figma:asset/9ef1fbe0081cc013ac53d20ae90d325e9b280b39.png";
import { hasFeatureAccess, filterFeaturesByRole, getRoleDisplayName, getRoleFeatures, FeatureId } from "./utils/roleBasedAccess";
import { isDemoMode, getDemoUser, demoModeFeatureAccess, getDemoModeState } from "./utils/demoMode";
import type { DemoModeState } from "./utils/demoMode";
import { analytics } from "./utils/analytics"; // ✅ Analytics tracking
import { useSessionTimeout } from "./hooks/useSessionTimeout"; // ✅ Session security
import { crashReporter, ErrorBoundary } from "./utils/crash-reporting"; // ✅ Crash reporting & error boundaries

// Component imports
import { DashboardHome } from "./components/DashboardHome";
import { AIWorkflowHub } from "./components/AIWorkflowHub";
import { AISupport } from "./components/AISupport";
import { PhotoCropDiagnosis } from "./components/PhotoCropDiagnosis";
import { VoiceAssistant } from "./components/VoiceAssistant";
import { MarketPrices } from "./components/MarketPrices";
import { WeatherCard } from "./components/WeatherCard";
import { Marketplace } from "./components/Marketplace";
import { NextGenMarketplace } from "./components/NextGenMarketplace";
import { ExpertConsultations } from "./components/ExpertConsultations";
import { SoilTestingService } from "./components/SoilTestingService";
import { VideoTutorials } from "./components/VideoTutorials";
import { KnowledgeRepository } from "./components/KnowledgeRepository";
import { PeerDiscussionGroups } from "./components/PeerDiscussionGroups";
import { TaskManagement } from "./components/TaskManagement";
import { CropPlanningManagement } from "./components/CropPlanningManagement";
import { CropPlanningManagementRedesign } from "./components/CropPlanningManagementRedesign";
import { CropPlanningDashboard } from "./components/CropPlanningDashboard";
import { LivestockManagement } from "./components/LivestockManagement";
import { LivestockManagementRedesign } from "./components/LivestockManagementRedesign";
import { AdvancedLivestockManagement } from "./components/AdvancedLivestockManagement";
import { FarmMapping } from "./components/FarmMapping";
import { FarmLandAllocation } from "./components/FarmLandAllocation";
import { ResourceInventoryManagement } from "./components/ResourceInventoryManagement";
import { FarmFinance } from "./components/FarmFinance";
import { MobileMoneyHub } from "./components/MobileMoneyHub";
import { FinancialCommandCenter } from "./components/FinancialCommandCenter";
import { OrdersSalesEcommerce } from "./components/OrdersSalesEcommerce";
import { InputSupplyChain } from "./components/InputSupplyChain";
import { IntelligentInputMarketplace } from "./components/IntelligentInputMarketplace";
import { ContractFarming } from "./components/ContractFarming";
import { FairContractFarming } from "./components/FairContractFarming";
import { InsuranceHub } from "./components/InsuranceHub";
import { CreovaAgroID } from "./components/CreovaAgroID";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { ComprehensiveReporting } from "./components/ComprehensiveReporting";
import { FarmGraphDashboard } from "./components/FarmGraphDashboard";
import { PredictiveModels } from "./components/PredictiveModels";
import { DigitalFarmTwin } from "./components/DigitalFarmTwin";
import { AIRecommendationEngine } from "./components/AIRecommendationEngine";
import { AIRecommendations } from "./components/AIRecommendations";
import { MasterPromptAudit } from "./components/MasterPromptAudit";
import { MasterPromptValidator } from "./components/MasterPromptValidator";
import { AIFarmPlanGenerator } from "./components/AIFarmPlanGenerator";
import { LivestockHealthMonitor } from "./components/LivestockHealthMonitor";
import { PersonalizedRecommendations } from "./components/PersonalizedRecommendations";
import { CropSpecificTips } from "./components/CropSpecificTips";
import { FamilyFarmPlanner } from "./components/FamilyFarmPlanner";
import { FarmerLabDashboard } from "./components/FarmerLabDashboard";
import { GamificationPanel } from "./components/GamificationPanel";
import { ExtensionOfficerDashboard } from "./components/ExtensionOfficerDashboard";
import { InstitutionalDashboard } from "./components/InstitutionalDashboard";
import { AgribusinessDashboard } from "./components/AgribusinessDashboard";
import { CooperativeDashboard } from "./components/CooperativeDashboard";
import { RoleBasedDashboard } from "./components/RoleBasedDashboard";
import { SupportHelpdesk } from "./components/SupportHelpdesk";
import { ContactSupport } from "./components/ContactSupport";
import { FAQ } from "./components/FAQ";
import { DataPrivacyConsent } from "./components/DataPrivacyConsent";
import { NotificationPanel } from "./components/NotificationPanel";
import { Profile } from "./components/Profile";
import { AITrainingHub } from "./components/AITrainingHub";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { FloatingActionButton } from "./components/FloatingActionButton";
import { AutoAIInsights } from "./components/AutoAIInsights";
import { SystemDiagnostics } from "./components/SystemDiagnostics";
import { OfflineIndicator } from "./components/OfflineIndicator"; // ✅ Added offline detection
import WalletAdminDashboard from "./components/WalletAdminDashboard";
import { CollapsibleNavCategory } from "./components/CollapsibleNavCategory";
import { projectId, publicAnonKey } from "./utils/supabase/info";

interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  region?: string;
  crops?: string[];
  farmSize?: string;
  userType?: string;
  role?: string;
  tier?: "free" | "basic" | "premium" | "enterprise";
  verified?: boolean;
  onboardingCompleted?: boolean;
}

export default function App() {
  const [isRegistered, setIsRegistered] = useState(true); // ✅ TEMP: Skip auth for testing
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false); // ✅ TEMP: Disable loading screen
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: "demo-user-123",
    name: "Demo Farmer",
    email: "demo@kilimo.tz",
    phoneNumber: "+255712345678",
    role: "farmer",
    region: "Arusha",
    crops: ["Maize", "Beans", "Coffee"],
    farmSize: "5 acres",
    language: "sw",
    verified: true,
    onboardingCompleted: true,
    tier: "premium"
  } as User); // ✅ TEMP: Demo user for testing
  const [activeTab, setActiveTab] = useState("home");
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [language, setLanguage] = useState<"en" | "sw">("sw"); // Default Swahili
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showInlinePersonalization, setShowInlinePersonalization] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [showDemoControl, setShowDemoControl] = useState(false);
  const [demoModeActive, setDemoModeActive] = useState(false);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;
  
  // Supabase client (singleton from utils/supabase/client.ts)
  // Already imported at top: import { supabase } from "./utils/supabase/client";

  // ✅ SESSION RESTORATION - Check for active session on load
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Check for active Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
          // Session exists - restore user
          const userData = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email,
            role: session.user.user_metadata?.role || "smallholder_farmer",
            tier: session.user.user_metadata?.tier || "free",
            verified: true,
            onboardingCompleted: session.user.user_metadata?.onboarding_complete || false,
          };

          setCurrentUser(userData);
          setIsRegistered(true);
          localStorage.setItem("kilimoUser", JSON.stringify(userData));
          
          console.log("✅ Session restored:", userData.email || userData.phone);
        } else {
          // No session - check localStorage fallback
          const savedUser = localStorage.getItem("kilimoUser");
          if (savedUser) {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
            setIsRegistered(true);
          }
        }
      } catch (error) {
        console.error("Session restoration error:", error);
        // Fallback to localStorage
        const savedUser = localStorage.getItem("kilimoUser");
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          setIsRegistered(true);
        }
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ✅ Initialize analytics on app load
  useEffect(() => {
    analytics.page('app_root');
    analytics.track('app_initialized', {
      version: '3.0.0',
      environment: 'production'
    });
  }, []);

  // ✅ Session timeout for security (15 minutes of inactivity)
  useSessionTimeout({
    timeout: 15 * 60 * 1000, // 15 minutes
    warningTime: 60 * 1000, // 1 minute warning
    enabled: isRegistered && !demoModeActive, // Only for logged-in users, not demo
    onWarning: () => {
      toast.warning(
        language === 'en'
          ? 'Your session will expire in 1 minute due to inactivity.'
          : 'Kipindi chako kitaisha baada ya dakika 1 kwa ukosefu wa shughuli.',
        { duration: 10000 }
      );
    },
    onTimeout: () => {
      handleLogout();
      analytics.track('session_timeout');
      toast.error(
        language === 'en'
          ? 'Session expired for security. Please log in again.'
          : 'Kipindi kimeisha kwa usalama. Tafadhali ingia tena.'
      );
    }
  });

  // Check if user is already registered OR if demo mode is active
  useEffect(() => {
    // Check for demo mode query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const demoParam = urlParams.get("demo");
    
    if (demoParam === "control" || demoParam === "true") {
      setShowDemoControl(true);
      return;
    }
    
    // Check if demo mode is active from session
    if (isDemoMode()) {
      setDemoModeActive(true);
      const demoState = getDemoModeState();
      if (demoState) {
        setLanguage(demoState.language);
        // Create virtual demo user
        const demoUser = getDemoUser();
        if (demoUser) {
          setCurrentUser(demoUser);
          setIsRegistered(true);
          setShowOnboarding(false);
        }
      }
      return;
    }
    
    const savedUser = localStorage.getItem("kilimoUser");
    const hasSeenWelcome = localStorage.getItem("kilimoSeenWelcome");
    const savedLanguage = localStorage.getItem("kilimoLanguage");
    
    if (savedLanguage) {
      setLanguage(savedLanguage as "en" | "sw");
    }
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsRegistered(true);
      setShowOnboarding(false);
      
      // ✅ Identify user in analytics
      analytics.identify(user.id, {
        role: user.role,
        language: savedLanguage || 'sw',
        onboardingCompleted: user.onboardingCompleted,
        tier: user.tier || 'free'
      });
      
      // Show inline personalization if not completed
      if (user.onboardingCompleted && !localStorage.getItem('kilimoMainActivity')) {
        setTimeout(() => setShowInlinePersonalization(true), 3000);
      }
    } else if (!hasSeenWelcome) {
      // First time user - show world-class onboarding
      analytics.track('first_visit');
      setShowOnboarding(true);
    }
  }, []);

  const handleRegister = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Use the user data returned from backend
        const user = {
          ...result.user,
          tier: result.user.tier || "free",
          role: result.user.role || data.role || "smallholder_farmer"
        };
        setCurrentUser(user);
        setIsRegistered(true);
        localStorage.setItem("kilimoUser", JSON.stringify(user));
        
        // Show role-based welcome message
        const roleDisplayName = getRoleDisplayName(user.role, language);
        const featureCount = getRoleFeatures(user.role).length;
        toast.success(
          language === "en"
            ? `Welcome to KILIMO, ${user.name}! 🌾\n${roleDisplayName} • ${featureCount} features unlocked`
            : `Karibu KILIMO, ${user.name}! 🌾\n${roleDisplayName} • Vipengele ${featureCount} vimefunguliwa`
        );
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const result = await response.json();

      if (result.success) {
        const user = {
          ...result.user,
          tier: result.user.tier || "free",
          role: result.user.role || "smallholder_farmer"
        };
        setCurrentUser(user);
        setIsRegistered(true);
        localStorage.setItem("kilimoUser", JSON.stringify(user));
        
        // Show role-based welcome message
        const roleDisplayName = getRoleDisplayName(user.role, language);
        const featureCount = getRoleFeatures(user.role).length;
        toast.success(
          language === "en"
            ? `Welcome back, ${result.user.name}! (${roleDisplayName} • ${featureCount} features)`
            : `Karibu tena, ${result.user.name}! (${roleDisplayName} • Vipengele ${featureCount})`
        );
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear local state
    setCurrentUser(null);
    setIsRegistered(false);
    localStorage.removeItem("kilimoUser");
    
    toast.success(
      language === "en" 
        ? "Logged out successfully" 
        : "Umetoka nje kikamilifu"
    );
  };

  const handleLaunchDemo = (demoState: DemoModeState) => {
    // Close control panel and launch main app in demo mode
    setShowDemoControl(false);
    setDemoModeActive(true);
    setLanguage(demoState.language);
    
    // Create virtual demo user from demo state
    const demoUser = getDemoUser();
    if (demoUser) {
      setCurrentUser(demoUser);
      setIsRegistered(true);
      setShowOnboarding(false);
      toast.success("Demo Mode Launched!", {
        description: `Role: ${demoState.active_role.replace(/_/g, " ")}`,
        duration: 3000,
      });
    }
  };

  const handleFABAction = (action: string) => {
    switch (action) {
      case "ai-insight":
        setActiveTab("ai-advisory");
        toast.success("Opening AI Advisory");
        break;
      case "new-task":
        setActiveTab("task-management");
        toast.success("Opening Task Management");
        break;
      case "ask-sankofa":
        setActiveTab("chat");
        toast.success("Opening Sankofa AI");
        break;
      case "scan-crop":
        setActiveTab("photo-diagnosis");
        toast.success("Opening Crop Scanner");
        break;
      default:
        break;
    }
  };

  // Handle photo crop diagnosis
  const handlePhotoAnalysis = async (imageData: string) => {
    try {
      const response = await fetch(`${API_BASE}/diagnosis/analyze`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser?.id,
          imageData,
          language,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const diagnosisData = {
          disease: result.disease,
          confidence: result.confidence,
          severity: result.severity,
          remedy: result.remedy,
          nearbyDealers: result.nearbyDealers,
        };
        
        // ✅ FIX #1: AUTO-CREATE TASK FOR HIGH/CRITICAL SEVERITY
        if (result.severity === "high" || result.severity === "critical") {
          try {
            // Ask user if they want to create a task
            const shouldCreateTask = window.confirm(
              language === "sw"
                ? `Tatizo kubwa limegunduliwa: ${result.disease}. Unda kazi ya "${result.remedy}"?`
                : `Serious issue detected: ${result.disease}. Create task: "${result.remedy}"?`
            );
            
            if (shouldCreateTask) {
              const taskResponse = await fetch(`${API_BASE}/tasks/create`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${publicAnonKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: currentUser?.id,
                  title: language === "sw" 
                    ? `🌿 Tibu ${result.disease}` 
                    : `🌿 Treat ${result.disease}`,
                  description: result.remedy,
                  priority: result.severity === "critical" ? "urgent" : "high",
                  dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                  category: "crop_health",
                  source: "ai_diagnosis"
                })
              });
              
              if (taskResponse.ok) {
                toast.success(
                  language === "sw" 
                    ? "✅ Kazi imeundwa! Angalia orodha ya kazi." 
                    : "✅ Task created! Check your task list.",
                  { duration: 5000 }
                );
              }
            }
          } catch (taskError) {
            console.error("Failed to create task from diagnosis:", taskError);
          }
          
          // Send SMS alert for critical diagnoses
          if (result.severity === "critical") {
            try {
              await fetch(`${API_BASE}/notifications/send-sms`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${publicAnonKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: currentUser?.id,
                  message: language === "sw"
                    ? `⚠️ DHARURA: ${result.disease} imegunduliwa kwenye mazao yako. Angalia app kwa maelekezo.`
                    : `⚠️ URGENT: ${result.disease} detected in your crops. Check app for treatment.`
                })
              });
            } catch (smsError) {
              console.error("Failed to send SMS alert:", smsError);
            }
          }
        }
        
        return diagnosisData;
      } else {
        throw new Error(result.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Photo analysis error:", error);
      throw error;
    }
  };

  // Navigation items - ALL 50+ FEATURES (🔥 CLEAN DATA - NO COLOR PROPS)
  const allNavigationItems: Array<{ id: FeatureId; label: string; icon: any; category: string }> = [
    { id: "home", label: "Dashboard", icon: Home, category: "main" },
    { id: "workflows", label: "AI Workflows", icon: Brain, category: "ai" },
    { id: "ai-chat", label: "Sankofa AI", icon: MessageSquare, category: "ai" },
    { id: "diagnosis", label: "Crop Diagnosis", icon: Camera, category: "ai" },
    { id: "voice", label: "Voice Assistant", icon: Phone, category: "ai" },
    { id: "ai-training", label: "AI Training Hub", icon: Brain, category: "ai" },
    { id: "market", label: "Market Prices", icon: TrendingUp, category: "market" },
    { id: "weather", label: "Weather", icon: CloudRain, category: "main" },
    { id: "marketplace", label: "Marketplace", icon: ShoppingCart, category: "market" },
    { id: "experts", label: "Expert Consult", icon: Users, category: "services" },
    { id: "soil-test", label: "Soil Testing", icon: Microscope, category: "services" },
    { id: "videos", label: "Video Tutorials", icon: PlayCircle, category: "learning" },
    { id: "knowledge", label: "Knowledge Base", icon: BookOpen, category: "learning" },
    { id: "discussions", label: "Discussion Groups", icon: MessageCircle, category: "community" },
    { id: "tasks", label: "Task Management", icon: ClipboardList, category: "farm" },
    { id: "crop-planning", label: "Crop Planning", icon: Sprout, category: "farm" },
    { id: "crop-planning-ai", label: "Crop Planning AI", icon: Brain, category: "farm" },
    { id: "crop-dashboard", label: "Crop Dashboard", icon: BarChart3, category: "farm" },
    { id: "livestock", label: "Livestock", icon: Activity, category: "farm" },
    { id: "livestock-health", label: "Livestock Health", icon: Activity, category: "farm" },
    { id: "farm-mapping", label: "Farm Mapping", icon: Map, category: "farm" },
    { id: "land-allocation", label: "Land Allocation", icon: Target, category: "farm" },
    { id: "inventory", label: "Inventory", icon: Warehouse, category: "farm" },
    { id: "finance", label: "Farm Finance", icon: Calculator, category: "finance" },
    { id: "mobile-money", label: "Mobile Money", icon: CreditCard, category: "finance" },
    { id: "wallet-admin", label: "Wallet Admin", icon: Wallet, category: "finance" },
    { id: "orders", label: "Orders & Sales", icon: ShoppingBag, category: "market" },
    { id: "agribusiness", label: "Agribusiness", icon: Building2, category: "market" },
    { id: "input-supply", label: "Input Supply", icon: Package, category: "finance" },
    { id: "contracts", label: "Contract Farming", icon: FileText, category: "finance" },
    { id: "insurance", label: "Insurance", icon: Shield, category: "services" },
    { id: "agro-id", label: "KILIMO Agro-ID", icon: IdCard, category: "services" },
    { id: "analytics", label: "Analytics", icon: BarChart3, category: "insights" },
    { id: "reports", label: "Reporting", icon: LineChart, category: "insights" },
    { id: "farm-graph", label: "Farm Graph", icon: Network, category: "insights" },
    { id: "predictive", label: "Predictions", icon: TrendingUp, category: "insights" },
    { id: "digital-twin", label: "Digital Twin", icon: Boxes, category: "insights" },
    { id: "ai-recommendations", label: "AI Recommendations", icon: Lightbulb, category: "ai" },
    { id: "ai-insights", label: "AI Insights", icon: Brain, category: "ai" },
    { id: "crop-tips", label: "Crop Specific Tips", icon: Leaf, category: "learning" },
    { id: "family-planner", label: "Family Planner", icon: Users, category: "farm" },
    { id: "farmer-lab", label: "Farmer Lab", icon: Microscope, category: "learning" },
    { id: "gamification", label: "Achievements", icon: Award, category: "admin" },
    { id: "extension", label: "Extension Officer", icon: Briefcase, category: "admin" },
    { id: "institutional", label: "Institutional", icon: Building2, category: "admin" },
    { id: "cooperative", label: "Cooperative", icon: Users, category: "community" },
    { id: "diagnostics", label: "System Diagnostics", icon: Settings, category: "admin" },
    { id: "training", label: "Training Courses", icon: BookOpen, category: "learning" },
    { id: "support", label: "Support", icon: HelpCircle, category: "help" },
    { id: "contact", label: "Contact Us", icon: PhoneCall, category: "help" },
    { id: "faq", label: "FAQ", icon: Info, category: "help" },
    { id: "privacy", label: "Privacy", icon: Shield, category: "settings" },
  ];

  // Filter navigation items based on user role
  const navigationItems = currentUser?.role 
    ? filterFeaturesByRole(allNavigationItems, currentUser.role)
    : allNavigationItems;

  // ✅ Track tab changes
  useEffect(() => {
    if (activeTab && currentUser) {
      analytics.page(activeTab);
      analytics.track('navigation_change', {
        from: activeTab,
        to: activeTab,
        userId: currentUser.id,
        userRole: currentUser.role
      });
    }
  }, [activeTab]);

  // Group navigation by category
  const categories = [
    { id: "main", label: "Main", icon: Home },
    { id: "ai", label: "AI Tools", icon: Brain },
    { id: "farm", label: "Farm Management", icon: Wheat },
    { id: "market", label: "Market & Sales", icon: ShoppingCart },
    { id: "finance", label: "Finance", icon: DollarSign },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "insights", label: "Insights", icon: LineChart },
    { id: "learning", label: "Learning", icon: BookOpen },
    { id: "community", label: "Community", icon: Users },
    { id: "admin", label: "Admin", icon: Settings },
    { id: "help", label: "Help & Support", icon: HelpCircle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Demo Mode Control Panel (Pre-Auth)
  if (showDemoControl) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <DemoModeControlPanel onLaunchDemo={handleLaunchDemo} language={language} />
      </>
    );
  }

  // Loading screen while checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {language === "en" ? "Loading..." : "Inapakia..."}
          </p>
        </div>
      </div>
    );
  }

  // Login/Register Screen - UNIFIED DUAL AUTH
  if (!isRegistered) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <UnifiedDualAuth
          onSuccess={(userData) => {
            setCurrentUser(userData);
            setIsRegistered(true);
            
            // ✅ Track successful authentication
            analytics.identify(userData.id, {
              role: userData.role,
              language: language,
              verified: userData.verified,
              tier: userData.tier || 'free'
            });
            
            analytics.track('auth_success', {
              method: userData.email ? 'email_password' : 'phone_otp',
              role: userData.role,
              isNewUser: !userData.onboardingCompleted
            });
            
            // Store user (already done in component, but ensure it's set)
            localStorage.setItem("kilimoUser", JSON.stringify(userData));
            
            // Welcome message
            const roleDisplayName = getRoleDisplayName(userData.role, language);
            const featureCount = getRoleFeatures(userData.role).length;
            toast.success(
              language === "en"
                ? `Welcome to KILIMO, ${userData.name}! 🌾`
                : `Karibu KILIMO, ${userData.name}! 🌾`,
              {
                description: `${roleDisplayName} • ${featureCount} ${language === "en" ? "features" : "vipengele"}`,
                duration: 3000
              }
            );
            
            // Show inline personalization for new users
            if (!userData.onboardingCompleted) {
              setTimeout(() => setShowInlinePersonalization(true), 2000);
            }
          }}
          language={language}
        />
      </>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors />

      {/* Offline Indicator - Shows when user loses connection */}
      <OfflineIndicator />

      {/* Demo Mode Indicator */}
      {demoModeActive && (
        <div className="fixed top-4 right-4 z-[100] bg-yellow-500 text-yellow-950 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
          <Zap className="h-4 w-4" />
          <span className="font-semibold text-sm">DEMO MODE ACTIVE</span>
        </div>
      )}

      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle mobile menu"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>
              
              <button
                onClick={() => setActiveTab("home")}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img 
                  src={logo}
                  alt="KILIMO Logo" 
                  className="h-10 w-auto object-contain"
                />
              </button>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === "en" ? "Search..." : "Tafuta..."}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Role Badge */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                <Briefcase className="h-4 w-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">
                  {getRoleDisplayName(currentUser?.role || "smallholder_farmer", language)}
                </span>
              </div>

              {/* Tier Badge */}
              {currentUser?.tier && currentUser.tier !== "free" && (
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 rounded-lg border border-purple-200">
                  <Award className="h-3.5 w-3.5 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-700 uppercase">{currentUser.tier}</span>
                </div>
              )}

              {/* Language Toggle */}
              <button
                onClick={() => {
                  const newLang = language === "en" ? "sw" : "en";
                  setLanguage(newLang);
                  localStorage.setItem("kilimoLanguage", newLang);
                  toast.success(
                    newLang === "en" 
                      ? "Language changed to English" 
                      : "Lugha imebadilishwa kuwa Kiswahili"
                  );
                }}
                className="flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                <span className={`text-xs font-medium ${language === "en" ? "text-gray-900" : "text-gray-400"}`}>
                  EN
                </span>
                <span className="text-gray-300">|</span>
                <span className={`text-xs font-medium ${language === "sw" ? "text-gray-900" : "text-gray-400"}`}>
                  SW
                </span>
              </button>

              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-700" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              {/* Profile */}
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="p-1.5 bg-[#2E7D32] rounded-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-gray-900">{currentUser?.name}</p>
                  <p className="text-[10px] text-gray-500">{currentUser?.region}</p>
                </div>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={language === "en" ? "Logout" : "Ondoka"}
              >
                <LogOut className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex max-w-7xl mx-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 h-[calc(100vh-4rem)] sticky top-16 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Role Summary Card */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-gray-50 rounded-lg">
                  <Briefcase className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-gray-900">
                    {getRoleDisplayName(currentUser?.role || "smallholder_farmer", language)}
                  </h3>
                  <p className="text-[10px] text-gray-600">
                    {navigationItems.length} {language === "en" ? "features available" : "vipengele vinavyopatikana"}
                  </p>
                </div>
              </div>
            </div>

            {categories.map((category) => {
              const categoryItems = navigationItems.filter(item => item.category === category.id);
              if (categoryItems.length === 0) return null;

              const CategoryIcon = category.icon;
              
              return (
                <div key={category.id} className="space-y-2">
                  {/* Category Header */}
                  <div className="relative group">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="p-1.5 bg-white rounded-lg">
                        <CategoryIcon className="h-4 w-4 text-gray-600" />
                      </div>
                      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                        {category.label}
                      </h3>
                    </div>
                  </div>

                  {/* Navigation Items */}
                  <nav className="space-y-1.5 pl-1">
                    {categoryItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setShowMobileMenu(false);
                          }}
                          className={`
                            w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-left group/item
                            ${isActive 
                              ? 'bg-white border-2 border-gray-300 shadow-lg' 
                              : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
                            }
                          `}
                        >
                          {/* Icon Container with Gradient Background */}
                          <div className={`
                            p-1.5 rounded-lg transition-all duration-200
                            ${isActive 
                              ? 'bg-gray-100' 
                              : 'bg-gray-50 group-hover/item:bg-gray-100'
                            }
                          `}>
                            <Icon className={`
                              h-4 w-4 transition-colors duration-200
                              ${isActive ? 'text-gray-900' : item.color + ' group-hover/item:text-gray-700'}
                            `} />
                          </div>

                          {/* Label */}
                          <span className={`
                            text-sm font-semibold transition-colors duration-200 flex-1
                            ${isActive ? 'text-gray-900' : 'text-gray-700 group-hover/item:text-gray-900'}
                          `}>
                            {item.label}
                          </span>

                          {/* Badge */}
                          {item.badge && (
                            <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold rounded-lg shadow-sm animate-pulse">
                              {item.badge}
                            </span>
                          )}

                          {/* Active Indicator */}
                          {isActive && (
                            <div className="w-1.5 h-1.5 bg-gray-900 rounded-full shadow-sm"></div>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setShowMobileMenu(false)}>
            <aside className="w-80 h-full bg-white overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-4">
                {categories.map((category) => {
                  const categoryItems = navigationItems.filter(item => item.category === category.id);
                  if (categoryItems.length === 0) return null;
                  
                  // Mark "main" category (Dashboard) as primary anchor
                  const isPrimaryAnchor = category.id === "main";
                  
                  return (
                    <CollapsibleNavCategory
                      key={category.id}
                      category={category}
                      items={categoryItems}
                      activeTab={activeTab}
                      onItemClick={setActiveTab}
                      onMenuClose={() => setShowMobileMenu(false)}
                      isPrimaryAnchor={isPrimaryAnchor}
                    />
                  );
                })}
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative">


          {/* Content Container with Enhanced Design */}
          <div className="relative z-10 min-h-full p-4 lg:p-8">
            {/* Floating Content Container with Glass Morphism */}
            <div className="relative">
              {/* Content Wrapper - Clean & Professional */}
              <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Top Accent Bar - Brand Color Only */}
                <div className="h-1.5 bg-[#2E7D32]"></div>
                
                {/* Inner Content with Padding */}
                <div className="p-4 lg:p-8 pb-24 lg:pb-8">
                  {/* Content Delivery System */}
                  <div className="relative min-h-[calc(100vh-12rem)]">
                    {/* Content Layer */}
                    <div className="relative">
                      {/* Status Bar - Shows connection, sync, and data freshness */}
                      <div className="mb-4 flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                          {/* Data Freshness Indicator */}
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <div className="h-1.5 w-1.5 bg-[#2E7D32] rounded-full animate-pulse"></div>
                            <span className="hidden sm:inline">Live</span>
                          </div>
                          
                          {/* Last Sync Time */}
                          <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500">
                            <Activity className="h-3 w-3" />
                            <span>Synced {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="flex items-center gap-2">
                          <button 
                            className="text-xs text-gray-500 hover:text-gray-700 transition-colors hidden sm:block"
                            onClick={() => window.location.reload()}
                          >
                            Refresh
                          </button>
                        </div>
                      </div>

                      {/* Inline Personalization Card */}
                      {showInlinePersonalization && (
                        <InlinePersonalizationCard
                          onComplete={(answer) => {
                            localStorage.setItem('kilimoMainActivity', answer);
                            setShowInlinePersonalization(false);
                          }}
                          onDismiss={() => {
                            setShowInlinePersonalization(false);
                          }}
                          language={language}
                        />
                      )}

                      {/* Content Container with Smart Loading */}
                      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm overflow-hidden">
                        {/* Tab Content with Transition System */}
                        <div className="relative">
                          {activeTab === "home" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                              <ErrorBoundary componentName="DashboardHome">
                                <DashboardHome user={currentUser!} onNavigate={setActiveTab} language={language} />
                              </ErrorBoundary>
                            </div>
                          )}
                      {activeTab === "workflows" && (
                        <div className="animate-fadeIn">
                          <AIWorkflowHub userId={currentUser?.id!} userRole={currentUser?.role || "smallholder_farmer"} userTier={currentUser?.tier || "free"} onNavigate={setActiveTab} language={language} />
                      </div>
                    )}
                      {activeTab === "ai-chat" && (
                        <div className="animate-fadeIn">
                          <AISupport 
                            userId={currentUser?.id!} 
                            language={language}
                            apiBase={API_BASE}
                            authToken={publicAnonKey}
                          />
                        </div>
                      )}
                      {activeTab === "diagnosis" && (
                        <div className="animate-fadeIn">
                          <PhotoCropDiagnosis 
                            onAnalyzePhoto={handlePhotoAnalysis} 
                            language={language} 
                          />
                        </div>
                      )}
                      {activeTab === "voice" && (
                        <div className="animate-fadeIn">
                          <VoiceAssistant language={language} />
                        </div>
                      )}
                      {activeTab === "ai-training" && (
                        <div className="animate-fadeIn">
                          <AITrainingHub userId={currentUser?.id!} userRole={currentUser?.role || "smallholder_farmer"} language={language} />
                        </div>
                      )}
                      {activeTab === "market" && (
                        <div className="animate-fadeIn">
                          <MarketPrices region={currentUser?.region!} onNavigate={setActiveTab} language={language} />
                        </div>
                      )}
                      {activeTab === "weather" && (
                        <div className="animate-fadeIn">
                          <WeatherCard userId={currentUser?.id!} region={currentUser?.region!} onNavigate={setActiveTab} language={language} />
                        </div>
                      )}
                      {activeTab === "marketplace" && (
                        <div className="animate-fadeIn">
                          <NextGenMarketplace userId={currentUser?.id!} region={currentUser?.region!} onNavigate={setActiveTab} language={language} />
                        </div>
                      )}
                      {activeTab === "experts" && (
                        <div className="animate-fadeIn">
                          <ExpertConsultations userId={currentUser?.id!} onNavigate={setActiveTab} language={language} />
                        </div>
                      )}
                      {activeTab === "soil-test" && (
                        <div className="animate-fadeIn">
                          <SoilTestingService userId={currentUser?.id!} onNavigate={setActiveTab} language={language} />
                        </div>
                      )}
                      {activeTab === "videos" && (
                        <div className="animate-fadeIn">
                          <VideoTutorials language={language} onNavigate={setActiveTab} />
                        </div>
                      )}
                      {activeTab === "knowledge" && (
                        <div className="animate-fadeIn">
                          <KnowledgeRepository language={language} onNavigate={setActiveTab} />
                        </div>
                      )}
                      {activeTab === "discussions" && (
                        <div className="animate-fadeIn">
                          <PeerDiscussionGroups userId={currentUser?.id!} onNavigate={setActiveTab} language={language} />
                        </div>
                      )}
                      {activeTab === "tasks" && (
                        <div className="animate-fadeIn">
                          <TaskManagement userId={currentUser?.id!} onNavigate={setActiveTab} language={language} />
                        </div>
                      )}
                      {activeTab === "crop-planning" && (
                        <div className="animate-fadeIn">
                          <CropPlanningManagement userId={currentUser?.id!} onNavigate={setActiveTab} language={language} />
                        </div>
                      )}
                      {activeTab === "crop-planning-ai" && (
                        <div className="animate-fadeIn">
                          <CropPlanningManagementRedesign userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "crop-dashboard" && (
                        <div className="animate-fadeIn">
                          <CropPlanningDashboard userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "livestock" && (
                        <div className="animate-fadeIn">
                          <AdvancedLivestockManagement userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "farm-map" && (
                        <div className="animate-fadeIn">
                          <FarmMapping userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "land-allocation" && (
                        <div className="animate-fadeIn">
                          <FarmLandAllocation userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "inventory" && (
                        <div className="animate-fadeIn">
                          <ResourceInventoryManagement userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "finance" && (
                        <div className="animate-fadeIn">
                          <FarmFinance userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "mobile-money" && (
                        <div className="animate-fadeIn">
                          <FinancialCommandCenter userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "wallet-admin" && (
                        <div className="animate-fadeIn">
                          <WalletAdminDashboard language={language} user={currentUser} />
                        </div>
                      )}
                      {activeTab === "orders" && (
                        <div className="animate-fadeIn">
                          <OrdersSalesEcommerce userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "input-supply" && (
                        <div className="animate-fadeIn">
                          <IntelligentInputMarketplace userId={currentUser?.id!} region={currentUser?.region!} language={language} crops={currentUser?.crops} onNavigate={setActiveTab} />
                        </div>
                      )}
                      {(activeTab === "contract-farming" || activeTab === "contracts") && (
                        <div className="animate-fadeIn">
                          <FairContractFarming userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "insurance" && (
                        <div className="animate-fadeIn">
                          <InsuranceHub userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "agro-id" && (
                        <div className="animate-fadeIn">
                          <CreovaAgroID userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "agribusiness" && (
                        <div className="animate-fadeIn">
                          <AgribusinessDashboard 
                            companyName={currentUser?.name || "Agribusiness"}
                            onLogout={handleLogout}
                            language={language}
                          />
                        </div>
                      )}
                      {activeTab === "analytics" && (
                        <div className="animate-fadeIn">
                          <AnalyticsDashboard userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "reporting" && (
                        <div className="animate-fadeIn">
                          <ComprehensiveReporting userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "farm-graph" && (
                        <div className="animate-fadeIn">
                          <FarmGraphDashboard userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "predictions" && (
                        <div className="animate-fadeIn">
                          <PredictiveModels 
                            userId={currentUser?.id!}
                            region={currentUser?.region || "Unknown"}
                            crops={currentUser?.crops || []}
                            apiBase={API_BASE}
                            authToken={publicAnonKey}
                            language={language}
                          />
                        </div>
                      )}
                      {activeTab === "digital-twin" && (
                        <div className="animate-fadeIn">
                          <DigitalFarmTwin userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {/* AI Recommendation Engine - Supports All Agricultural Seasons */}
                      {/* Planting Season | Growing Season | Harvest Season | Dry Season */}
                      {activeTab === "ai-recommendations" && (
                        <div className="animate-fadeIn">
                          <AIRecommendationEngine 
                            userId={currentUser?.id!} 
                            region={currentUser?.region || "Unknown"}
                            crops={currentUser?.crops || []}
                            farmSize={currentUser?.farmSize || "0"}
                            apiBase={API_BASE}
                            authToken={publicAnonKey}
                            language={language}
                          />
                        </div>
                      )}
                      {/* AI Advisory - Bilingual Recommendations System */}
                      {activeTab === "ai-advisory" && (
                        <div className="animate-fadeIn">
                          <AIRecommendations language={language} />
                        </div>
                      )}
                      {activeTab === "ai-farm-plan" && (
                        <div className="animate-fadeIn">
                          <AIFarmPlanGenerator 
                            userId={currentUser?.id!}
                            region={currentUser?.region || "Unknown"}
                            crops={currentUser?.crops || []}
                            farmSize={currentUser?.farmSize || "0"}
                            apiBase={API_BASE}
                            authToken={publicAnonKey}
                            language={language}
                          />
                        </div>
                      )}
                      {activeTab === "livestock-health" && (
                        <div className="animate-fadeIn">
                          <LivestockHealthMonitor userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "personalized" && (
                        <div className="animate-fadeIn">
                          <PersonalizedRecommendations 
                            userId={currentUser?.id!} 
                            apiBase={API_BASE}
                            authToken={publicAnonKey}
                            onNavigate={setActiveTab}
                            language={language}
                          />
                        </div>
                      )}
                      {activeTab === "crop-tips" && (
                        <div className="animate-fadeIn">
                          <CropSpecificTips userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "family-planner" && (
                        <div className="animate-fadeIn">
                          <FamilyFarmPlanner 
                            userId={currentUser?.id!} 
                            apiBase={API_BASE}
                            authToken={publicAnonKey}
                            language={language} 
                          />
                        </div>
                      )}
                      {activeTab === "farmer-lab" && (
                        <div className="animate-fadeIn">
                          <FarmerLabDashboard userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "gamification" && (
                        <div className="animate-fadeIn">
                          <GamificationPanel userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "extension-officer" && (
                        <div className="animate-fadeIn">
                          <ExtensionOfficerDashboard language={language} />
                        </div>
                      )}
                      {activeTab === "institutional" && (
                        <div className="animate-fadeIn">
                          <InstitutionalDashboard language={language} />
                        </div>
                      )}
                      {activeTab === "support" && (
                        <div className="animate-fadeIn">
                          <SupportHelpdesk userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "contact" && (
                        <div className="animate-fadeIn">
                          <ContactSupport language={language} />
                        </div>
                      )}
                      {activeTab === "faq" && (
                        <div className="animate-fadeIn">
                          <FAQ language={language} />
                        </div>
                      )}
                      {activeTab === "privacy" && (
                        <div className="animate-fadeIn">
                          <DataPrivacyConsent userId={currentUser?.id!} language={language} />
                        </div>
                      )}
                      {activeTab === "training" && (
                        <div className="animate-fadeIn">
                          <VideoTutorials language={language} onNavigate={setActiveTab} />
                        </div>
                      )}
                      {activeTab === "master-audit" && (
                        <div className="animate-fadeIn">
                          <MasterPromptAudit language={language} />
                        </div>
                      )}
                      {activeTab === "master-validator" && (
                        <div className="animate-fadeIn">
                          <MasterPromptValidator language={language} />
                        </div>
                      )}
                      {activeTab === "system-diagnostics" && (
                        <div className="animate-fadeIn">
                          <SystemDiagnostics language={language} />
                        </div>
                      )}
                      {activeTab === "agribusiness-dashboard" && (
                        <div className="animate-fadeIn">
                          <AgribusinessDashboard 
                            companyName={currentUser?.name || "Agribusiness"}
                            onLogout={handleLogout}
                            language={language}
                          />
                        </div>
                      )}
                      {activeTab === "cooperative-dashboard" && (
                        <div className="animate-fadeIn">
                          <CooperativeDashboard 
                            cooperativeName={currentUser?.name || "Cooperative"}
                            onLogout={handleLogout}
                            language={language}
                          />
                        </div>
                      )}
                      {activeTab === "role-dashboard" && (
                        <div className="animate-fadeIn">
                          <RoleBasedDashboard 
                            role={{
                              id: currentUser?.role || "smallholder_farmer",
                              displayName: currentUser?.role?.replace(/_/g, ' ') || "Smallholder Farmer",
                              tier: currentUser?.tier || "free",
                              limits: {
                                maxAIQueries: currentUser?.tier === "premium" ? 1000 : currentUser?.tier === "basic" ? 100 : 20,
                                maxExpertConsultations: currentUser?.tier === "premium" ? 10 : currentUser?.tier === "basic" ? 3 : 1,
                                maxFarmSize: null,
                                maxTeamMembers: currentUser?.tier === "premium" ? 50 : currentUser?.tier === "basic" ? 10 : null,
                                aiModelTier: currentUser?.tier === "premium" ? "Advanced" : currentUser?.tier === "basic" ? "Standard" : "Basic"
                              },
                              dashboardConfig: {
                                sections: ["analytics", "farm-management", "marketplace"],
                                analytics: ["yield", "revenue", "expenses"],
                                widgets: ["weather", "market-prices", "tasks"]
                              }
                            }}
                            usage={{
                              aiQueriesUsed: 15,
                              consultationsUsed: 0,
                              farmSizeUsed: Number(currentUser?.farmSize || 0),
                              teamMembersUsed: 1
                            }}
                            language={language}
                          />
                        </div>
                      )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Decorative Separator */}
                <div className="h-px bg-gray-200"></div>
              </div>
              

            </div>
          </div>
        </main>
      </div>

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 lg:inset-auto lg:right-0 lg:top-16 lg:w-96 lg:h-[calc(100vh-4rem)]">
          <div className="lg:hidden absolute inset-0 bg-black/50" onClick={() => setShowNotifications(false)} />
          <div className="relative h-full bg-white lg:border-l lg:shadow-2xl overflow-y-auto">
            <NotificationPanel 
              userId={currentUser?.id!}
              onClose={() => setShowNotifications(false)}
              language={language}
            />
          </div>
        </div>
      )}

      {/* Profile Drawer */}
      {showProfile && (
        <div className="fixed inset-0 z-50 lg:inset-auto lg:right-0 lg:top-16 lg:w-96 lg:h-[calc(100vh-4rem)]">
          <div className="lg:hidden absolute inset-0 bg-black/50" onClick={() => setShowProfile(false)} />
          <div className="relative h-full bg-white lg:border-l lg:shadow-2xl overflow-y-auto">
            <Profile 
              user={currentUser!}
              onClose={() => setShowProfile(false)}
              onUpdate={(updatedUser) => {
                setCurrentUser(updatedUser);
                localStorage.setItem("kilimoUser", JSON.stringify(updatedUser));
              }}
              language={language}
            />
          </div>
        </div>
      )}

      {/* Onboarding removed - using MasterOnboarding instead */}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notificationCount={notificationCount}
        userRole={currentUser?.role}
      />

      {/* Floating Action Button */}
      <FloatingActionButton onAction={handleFABAction} language={language} />

      {/* OnboardingV3WorldClass - Unified Access Flow */}
      {showOnboarding && (
        <OnboardingV3WorldClass 
          onComplete={(userData) => {
            setShowOnboarding(false);
            setLanguage(userData.language);
            setCurrentUser(userData);
            setIsRegistered(true);
            
            // Show inline personalization after 3 seconds (new users only)
            if (!userData.personalizationCompleted) {
              setTimeout(() => {
                setShowInlinePersonalization(true);
              }, 3000);
            }
          }}
          apiBase={API_BASE}
          apiKey={publicAnonKey}
        />
      )}
    </div>
  );
}