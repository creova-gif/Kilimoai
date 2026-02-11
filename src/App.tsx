import image_e26027fb3aabd00c928ba655f087af31ac20983e from 'figma:asset/e26027fb3aabd00c928ba655f087af31ac20983e.png';
import image_258b5db2e38846cbee79c22a5c47ff1d8ec47802 from 'figma:asset/258b5db2e38846cbee79c22a5c47ff1d8ec47802.png';

// 🔥 EMERGENCY: Import fetch wrapper FIRST to intercept ALL fetch calls
import './emergency-fetch-wrapper';

// 🔥 CACHE BUSTER v5.0.6 - FETCH WRAPPER INSTALLED
// TIMESTAMP: 2026-02-10T18:00:00.000Z - FORCED HTTPS FIX
// If you see old version numbers, do a HARD REFRESH (Ctrl+Shift+R)
console.clear();
console.log('═══════════════════════════════════════════════════');
console.log('🔥 KILIMO v5.0.6 - FETCH WRAPPER ACTIVE');
console.log('✅ ALL http:// requests auto-upgraded to https://');
console.log('✅ Missing /functions/v1/ auto-added');
console.log('✅ Build timestamp:', new Date().toISOString());
console.log('✅ CACHE KEY: APP_20260210_006_FETCH_WRAPPER');
console.log('═══════════════════════════════════════════════════');

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
// ❌ REMOVED: Demo mode - production only
import logo from "figma:asset/59f0b6f20637b554072039bc3a2caa41a72f5af6.png";
import circleLogo from "figma:asset/9ef1fbe0081cc013ac53d20ae90d325e9b280b39.png";
import { hasFeatureAccess, filterFeaturesByRole, getRoleDisplayName, getRoleFeatures, FeatureId } from "./utils/roleBasedAccess";
import { analytics } from "./utils/analytics"; // ✅ Analytics tracking
import { useSessionTimeout } from "./hooks/useSessionTimeout"; // ✅ Session security
import { crashReporter, ErrorBoundary } from "./utils/crash-reporting"; // ✅ Crash reporting & error boundaries
import { ErrorBoundary as GlobalErrorBoundary } from "./components/ErrorBoundary"; // ✅ Global error boundary for App Store compliance
import { OfflineBanner } from "./components/NetworkHandling"; // ✅ Offline detection

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
import { TaskManagementRedesign } from "./components/TaskManagementRedesign";
import { URLDebugPage } from "./components/URLDebugPage";
import { CacheBusterBanner } from "./components/CacheBusterBanner";
import { VisualCropPlanner } from "./components/VisualCropPlanner";
import { VisualCropPlannerEnhanced } from "./components/VisualCropPlannerEnhanced";
import { CropPlanningManagement } from "./components/CropPlanningManagement";
import { CropPlanningManagementRedesign } from "./components/CropPlanningManagementRedesign";
import { CropPlanningDashboard } from "./components/CropPlanningDashboard";
import { LivestockManagement } from "./components/LivestockManagement";
import { LivestockManagementRedesign } from "./components/LivestockManagementRedesign";
import { AdvancedLivestockManagement } from "./components/AdvancedLivestockManagement";
import { FarmMapping } from "./components/FarmMapping";
import { FarmMappingRedesign } from "./components/FarmMappingRedesign";
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

// ✅ UNIFIED COMPONENTS - Phase 2 Merge Architecture
import { UnifiedAIAdvisor } from "./components/UnifiedAIAdvisor";
import { UnifiedCropIntelligence } from "./components/UnifiedCropIntelligence"; // ✅ Knowledge Layer
import { UnifiedCropPlanning } from "./components/UnifiedCropPlanning"; // ✅ Execution Layer
import { UnifiedMarket } from "./components/UnifiedMarket";
import { UnifiedFinance } from "./components/UnifiedFinance";
import { UnifiedCommunity } from "./components/UnifiedCommunity";
import { UnifiedLearning } from "./components/UnifiedLearning";
import { UnifiedInventory } from "./components/UnifiedInventory";

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
  const [isRegistered, setIsRegistered] = useState(false); // ✅ CRITICAL: Start with false to require login when no user
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(true); // ✅ CRITICAL: Start with true to show loading screen while checking session
  const [currentUser, setCurrentUser] = useState<User | null>(null); // ✅ PRODUCTION: No demo user - force real authentication
  const [activeTab, setActiveTab] = useState("home");
  const [notificationCount, setNotificationCount] = useState(0); // ✅ PRODUCTION: Real notification count from backend
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [language, setLanguage] = useState<"en" | "sw">("sw"); // Default Swahili
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showInlinePersonalization, setShowInlinePersonalization] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  // ❌ REMOVED: Demo mode state variables - production only

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;
  
  // Supabase client (singleton from utils/supabase/client.ts)
  // Already imported at top: import { supabase } from "./utils/supabase/client";

  // ✅ DEEP LINK SUPPORT - Parse URL query params for tab routing
  const getDeepLinkTab = (pageId: string): string | undefined => {
    if (typeof window === "undefined") return undefined;
    const params = new URLSearchParams(window.location.search);
    const urlTab = params.get("tab");
    const urlView = params.get("view");
    if (urlTab === pageId && urlView) return urlView;
    return undefined;
  };

  // ✅ SESSION RESTORATION - Check for active session on load
  useEffect(() => {
    const restoreSession = async () => {
      console.log('🔍 [SESSION v2] Starting session restoration...');
      console.log('🔍 [SESSION v2] Initial state:', { loading, isRegistered, hasUser: !!currentUser });
      
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
          
          console.log("✅ [SESSION v2] Session restored:", userData.email || userData.phone);
          console.log("✅ [SESSION v2] User state set:", { id: userData.id, role: userData.role });
        } else {
          // No session - check localStorage fallback
          console.log("⚠️ [SESSION v2] No Supabase session, checking localStorage...");
          const savedUser = localStorage.getItem("kilimoUser");
          if (savedUser) {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
            setIsRegistered(true);
            console.log("✅ [SESSION v2] User restored from localStorage:", user.email || user.phone);
          } else {
            console.log("❌ [SESSION v2] No user found in localStorage");
          }
        }
      } catch (error) {
        console.error("❌ [SESSION v2] Session restoration error:", error);
        // Fallback to localStorage
        const savedUser = localStorage.getItem("kilimoUser");
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          setIsRegistered(true);
          console.log("✅ [SESSION v2] User restored from localStorage (after error):", user.email || user.phone);
        } else {
          console.log("❌ [SESSION v2] No fallback user in localStorage");
        }
      } finally {
        setLoading(false);
        console.log("🏁 [SESSION v2] Session restoration complete. Final state:", { 
          loading: false, 
          isRegistered, 
          hasUser: !!currentUser 
        });
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
    enabled: isRegistered, // ✅ PRODUCTION: Session timeout for all logged-in users
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

  // ✅ PRODUCTION: Check for existing user session
  useEffect(() => {
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

  // ❌ REMOVED: handleLaunchDemo - production mode only

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

  // 🎯 KILIMO CORE PAGES - MERGE-BASED ARCHITECTURE
  // Philosophy: "If two pages answer the same farmer question, merge them"
  // Target: 12 CORE PAGES (one farmer job = one page)
  const allNavigationItems: Array<{ id: FeatureId; label: string; icon: any; category: string }> = [
    // ========================================
    // 1. DASHBOARD - Overview & Quick Actions
    // ========================================
    { id: "home", label: "Dashboard", icon: Home, category: "dashboard" },
    
    // ========================================
    // 2. AI ADVISOR - Unified AI Intelligence
    // MERGES: AI Chat + AI Recommendations + AI Insights + AI Training + Diagnosis + Voice
    // Farmer Question: "What should I do?"
    // ========================================
    { id: "ai-chat", label: "AI Advisor", icon: Brain, category: "ai-advisor" },
    
    // ========================================
    // 3. CROP PLANNING - Execution Layer
    // MERGES: Current Season Plans + Field Allocation + Yield Forecasting + Timeline
    // Farmer Question: "What am I planting THIS season?"
    // ========================================
    { id: "land-allocation", label: "Crop Planning", icon: Sprout, category: "planning" },
    
    // ========================================
    // 4. CROP INTELLIGENCE - Knowledge Layer
    // MERGES: Crop Library + Growing Tips + Templates + Historical Performance
    // Farmer Question: "How SHOULD I grow this crop?"
    // ========================================
    { id: "crop-tips", label: "Crop Intelligence", icon: Leaf, category: "planning" },
    
    // ========================================
    // 4B. CROP LIBRARY - Direct Access (also in Intelligence)
    // Quick access to crop database
    // Farmer Question: "What crops can I grow?"
    // ========================================
    { id: "crop-library", label: "Crop Library", icon: BookOpen, category: "planning" },
    
    // ========================================
    // 5. FARM MAP - Mapping + Allocation
    // MERGES: Farm Mapping + Land Allocation (view mode)
    // Farmer Question: "Where is everything on my farm?"
    // ========================================
    { id: "farm-mapping", label: "Farm Map", icon: Map, category: "planning" },
    
    // ========================================
    // 6. TASKS & SCHEDULE - Tasks + Calendar
    // MERGES: Task Management + Calendar views
    // Farmer Question: "What do I need to do today?"
    // ========================================
    { id: "tasks", label: "Tasks & Schedule", icon: ClipboardList, category: "operations" },
    
    // ========================================
    // 7. INVENTORY & INPUTS - Stock + Supplies
    // MERGES: Inventory + Input Supply + Seed Lists
    // Farmer Question: "What do I have and what do I need?"
    // ========================================
    { id: "inventory", label: "Inventory & Inputs", icon: Warehouse, category: "operations" },
    
    // ========================================
    // 8. MARKET - Buy + Sell + Orders
    // MERGES: Marketplace + Orders & Sales + Market Prices + Contracts
    // Farmer Question: "Where can I buy/sell?"
    // ========================================
    { id: "orders", label: "Market", icon: ShoppingCart, category: "market" },
    
    // ========================================
    // 9. FINANCE - Money + Wallet + Payments
    // MERGES: Farm Finance + Mobile Money + Wallet + Insurance
    // Farmer Question: "How much money do I have/owe/expect?"
    // ========================================
    { id: "finance", label: "Finance", icon: DollarSign, category: "finance" },
    
    // ========================================
    // 10. LIVESTOCK (Optional)
    // Farmer Question: "How are my animals?"
    // ========================================
    { id: "livestock", label: "Livestock", icon: Activity, category: "operations" },
    
    // ========================================
    // 11. COMMUNITY (Social features)
    // MERGES: Discussions + Cooperative + Expert Consult
    // Farmer Question: "Who can help me?"
    // ========================================
    { id: "discussions", label: "Community", icon: Users, category: "community" },
    
    // ========================================
    // 12. LEARNING & SUPPORT
    // MERGES: Videos + Knowledge Base + Training + Support
    // Farmer Question: "How do I learn this?"
    // ========================================
    { id: "support", label: "Learning & Support", icon: BookOpen, category: "support" },
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

  // 🎯 STREAMLINED CATEGORIES - ONE FARMER JOB = ONE CATEGORY
  const categories = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "ai-advisor", label: "AI Advisor", icon: Brain },
    { id: "planning", label: "Planning", icon: Calendar },
    { id: "operations", label: "Operations", icon: ClipboardList },
    { id: "market", label: "Market", icon: ShoppingCart },
    { id: "finance", label: "Finance", icon: DollarSign },
    { id: "community", label: "Community", icon: Users },
    { id: "support", label: "Support", icon: HelpCircle },
  ];

  // ❌ REMOVED: Demo Mode Control Panel - production only

  // Loading screen while checking session
  if (loading) {
    console.log("⏳ [RENDER] Showing loading screen");
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
    console.log("🔐 [RENDER] Showing auth screen (isRegistered=false)");
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

  // ✅ CRITICAL: Show login screen if no user (even if isRegistered was set to true)
  // This handles edge cases like localStorage cleared or session expired
  if (!currentUser) {
    console.log("❌ [RENDER] No user found - showing auth screen");
    console.log("❌ [RENDER] State:", { loading, isRegistered, currentUser });
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

  // Main Dashboard (only renders when currentUser exists)
  console.log("✅ [RENDER] Rendering dashboard with user:", currentUser?.id);
  return (
    <GlobalErrorBoundary>
      <OfflineBanner />
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-center" richColors />
        
        {/* Cache Buster Banner - Shows if running old cached code */}
        <CacheBusterBanner />

        {/* Offline Indicator - Shows when user loses connection */}
        <OfflineIndicator />

        {/* ❌ REMOVED: Demo Mode Indicator - production only */}

      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden relative p-2.5 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 rounded-xl transition-all duration-300 group overflow-hidden"
                aria-label="Toggle mobile menu"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                
                {showMobileMenu ? (
                  <X className="relative h-6 w-6 text-gray-700 group-hover:text-gray-900 transition-colors" />
                ) : (
                  <Menu className="relative h-6 w-6 text-gray-700 group-hover:text-gray-900 transition-colors" />
                )}
              </button>
              
              <button
                onClick={() => setActiveTab("home")}
                className="relative flex items-center gap-2 hover:scale-105 transition-all duration-300 group"
              >
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#2E7D32]/0 via-[#2E7D32]/5 to-[#2E7D32]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                <img 
                  src={logo}
                  alt="KILIMO Logo" 
                  className="relative h-10 w-auto object-contain"
                />
              </button>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#2E7D32] transition-colors duration-300" />
                <input
                  type="text"
                  placeholder={language === "en" ? "Search..." : "Tafuta..."}
                  className="w-full pl-11 pr-4 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                />
                {/* Search field glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#2E7D32]/0 via-[#2E7D32]/10 to-[#2E7D32]/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Role Badge */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 group">
                <Briefcase className="h-4 w-4 text-gray-600 group-hover:text-gray-700 transition-colors" />
                <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                  {getRoleDisplayName(currentUser?.role || "smallholder_farmer", language)}
                </span>
              </div>

              {/* Tier Badge */}
              {currentUser?.tier && currentUser.tier !== "free" && (
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-[#2E7D32]/10 via-green-50 to-[#2E7D32]/5 rounded-xl border border-[#2E7D32]/30 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                  {/* Shine effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  
                  <Award className="relative h-4 w-4 text-[#2E7D32] drop-shadow-sm" />
                  <span className="relative text-xs font-bold text-[#2E7D32] uppercase tracking-wide">{currentUser.tier}</span>
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
                className="relative flex items-center gap-2 px-3.5 py-2 bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all duration-300 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md group overflow-hidden"
              >
                {/* Shimmer */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                
                <span className={`relative text-xs font-bold transition-all duration-300 ${language === "en" ? "text-[#2E7D32] scale-110" : "text-gray-400 group-hover:text-gray-600"}`}>
                  EN
                </span>
                <span className="relative text-gray-300 group-hover:text-gray-400 transition-colors">|</span>
                <span className={`relative text-xs font-bold transition-all duration-300 ${language === "sw" ? "text-[#2E7D32] scale-110" : "text-gray-400 group-hover:text-gray-600"}`}>
                  SW
                </span>
              </button>

              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 rounded-xl transition-all duration-300 group"
              >
                <Bell className={`h-5 w-5 transition-all duration-300 ${notificationCount > 0 ? 'text-[#2E7D32] animate-pulse' : 'text-gray-700 group-hover:text-gray-900'}`} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 animate-bounce border-2 border-white">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              {/* Profile */}
              <button
                onClick={() => setShowProfile(!showProfile)}
                className={`flex items-center gap-2.5 p-2 rounded-xl transition-all duration-300 group relative overflow-hidden ${showProfile ? 'bg-gradient-to-br from-[#2E7D32]/10 to-green-50 border-2 border-[#2E7D32]/30' : 'hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50'}`}
              >
                {/* Shimmer */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                
                <div className={`relative p-2 bg-gradient-to-br from-[#2E7D32] to-[#245a27] rounded-xl shadow-md shadow-[#2E7D32]/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#2E7D32]/30 transition-all duration-300`}>
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left relative">
                  <p className="text-xs font-semibold text-gray-900 group-hover:text-[#2E7D32] transition-colors">{currentUser?.name}</p>
                  <p className="text-[10px] text-gray-500 group-hover:text-gray-600 transition-colors">{currentUser?.region}</p>
                </div>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="relative p-2.5 hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100/50 rounded-xl transition-all duration-300 group overflow-hidden border border-transparent hover:border-red-200"
                title={language === "en" ? "Logout" : "Ondoka"}
              >
                {/* Subtle danger glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                <LogOut className="relative h-5 w-5 text-gray-600 group-hover:text-red-600 group-hover:scale-110 transition-all duration-300" />
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
                  {/* Category Header - Only show if multiple items */}
                  {categoryItems.length > 1 && (
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
                  )}

                  {/* Navigation Items */}
                  <nav className={`space-y-1.5 ${categoryItems.length > 1 ? 'pl-1' : ''}`}>
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
                            <span className="px-2 py-1 bg-[#2E7D32]/20 text-[#2E7D32] text-xs font-bold rounded-lg shadow-sm border border-[#2E7D32]/30">
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
                      <div className="mb-5 flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-white via-gray-50/50 to-white rounded-xl border border-gray-200/80 shadow-sm backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                          {/* Data Freshness Indicator */}
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white/80 px-3 py-1.5 rounded-lg border border-gray-200/50 shadow-sm">
                            <div className="relative">
                              <div className="h-2 w-2 bg-[#2E7D32] rounded-full animate-pulse"></div>
                              <div className="absolute inset-0 h-2 w-2 bg-[#2E7D32] rounded-full animate-ping opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline font-semibold text-[#2E7D32]">Live</span>
                          </div>
                          
                          {/* Last Sync Time */}
                          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 bg-white/60 px-3 py-1.5 rounded-lg border border-gray-200/30 group hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all duration-300">
                            <Activity className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#2E7D32] transition-colors" />
                            <span className="font-medium group-hover:text-gray-700 transition-colors">Synced {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="flex items-center gap-2">
                          <button 
                            className="relative text-xs font-semibold text-gray-600 hover:text-[#2E7D32] transition-all duration-300 hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/80 hover:bg-white rounded-lg border border-gray-200/50 hover:border-[#2E7D32]/30 hover:shadow-md group overflow-hidden"
                            onClick={() => window.location.reload()}
                          >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                            
                            <svg className="relative h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="relative">Refresh</span>
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
                      <div className="relative bg-gradient-to-br from-white via-gray-50/30 to-white backdrop-blur-md rounded-2xl border border-gray-200/80 shadow-lg shadow-gray-200/50 overflow-hidden group">
                        {/* Subtle top gradient accent */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2E7D32]/20 to-transparent"></div>
                        
                        {/* Ambient glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2E7D32]/[0.02] via-transparent to-green-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        
                        {/* Tab Content with Transition System */}
                        <div className="relative">
                          {/* ========== HOME/DASHBOARD ========== */}
                          {activeTab === "home" && currentUser && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                              <ErrorBoundary componentName="DashboardHome">
                                <DashboardHome user={currentUser} onNavigate={setActiveTab} language={language} />
                              </ErrorBoundary>
                            </div>
                          )}

                          {/* ========== UNIFIED AI ADVISOR ========== */}
                          {/* Consolidates: ai-chat, workflows, diagnosis, voice, ai-training, predictions, digital-twin, ai-farm-plan, personalized, ai-recommendations, ai-advisory */}
                          {activeTab === "ai-chat" && currentUser && (
                            <div className="animate-fadeIn">
                              <ErrorBoundary componentName="UnifiedAIAdvisor">
                                <UnifiedAIAdvisor
                                  userId={currentUser.id}
                                  userRole={currentUser.role || "smallholder_farmer"}
                                  userTier={currentUser.tier || "free"}
                                  region={currentUser.region || "Unknown"}
                                  crops={currentUser.crops || []}
                                  farmSize={currentUser.farmSize || "0"}
                                  language={language}
                                  apiBase={API_BASE}
                                  authToken={publicAnonKey}
                                  onNavigate={setActiveTab}
                                  initialTab={getDeepLinkTab("ai-chat")}
                                />
                              </ErrorBoundary>
                            </div>
                          )}

                          {/* ========== UNIFIED CROP PLANNING ========== */}
                          {/* Execution Layer: Current season plans, field allocation, yield forecasts, task timelines */}
                          {activeTab === "land-allocation" && currentUser && (
                            <div className="animate-fadeIn">
                              <ErrorBoundary componentName="UnifiedCropPlanning">
                                <UnifiedCropPlanning
                                  userId={currentUser.id}
                                  totalFarmSize={parseFloat(currentUser.farmSize || "0")}
                                  language={language}
                                  apiBase={API_BASE}
                                  authToken={publicAnonKey}
                                  initialTab="overview"
                                  onNavigate={setActiveTab}
                                />
                              </ErrorBoundary>
                            </div>
                          )}

                          {/* ========== UNIFIED CROP INTELLIGENCE ========== */}
                          {/* Knowledge Layer: Crop library, growing tips, templates, historical performance */}
                          {(activeTab === "crop-tips" || activeTab === "crop-library") && currentUser && (
                            <div className="animate-fadeIn">
                              <ErrorBoundary componentName="UnifiedCropIntelligence">
                                <UnifiedCropIntelligence
                                  userId={currentUser.id}
                                  totalFarmSize={parseFloat(currentUser.farmSize || "0")}
                                  language={language}
                                  apiBase={API_BASE}
                                  authToken={publicAnonKey}
                                  initialTab={
                                    activeTab === "crop-library" 
                                      ? "library"  // Direct to library when coming from nav
                                      : getDeepLinkTab("crop-tips")
                                  }
                                  onNavigate={setActiveTab}
                                />
                              </ErrorBoundary>
                            </div>
                          )}

                          {/* ========== FARM MAP (Standalone) ========== */}
                          {activeTab === "farm-mapping" && currentUser && (
                            <div className="animate-fadeIn">
                              <ErrorBoundary componentName="FarmMappingRedesign">
                                <FarmMappingRedesign userId={currentUser.id} language={language} />
                              </ErrorBoundary>
                            </div>
                          )}

                          {/* ========== TASKS & SCHEDULE (Standalone) ========== */}
                          {activeTab === "tasks" && currentUser && (
                            <div className="animate-fadeIn">
                              <ErrorBoundary componentName="TaskManagementRedesign">
                                <TaskManagementRedesign userId={currentUser.id} onNavigate={setActiveTab} language={language} />
                              </ErrorBoundary>
                            </div>
                          )}

                          {/* ========== DEBUG PAGE (TEMPORARY) ========== */}
                          {activeTab === "url-debug" && (
                            <div className="animate-fadeIn">
                              <URLDebugPage />
                            </div>
                          )}

                          {/* ========== UNIFIED INVENTORY & INPUTS ========== */}
                          {/* Consolidates: inventory, input-supply */}
                          {activeTab === "inventory" && currentUser && (
                            <div className="animate-fadeIn">
                              <ErrorBoundary componentName="UnifiedInventory">
                                <UnifiedInventory
                                  userId={currentUser.id}
                                  region={currentUser.region || "Unknown"}
                                  crops={currentUser.crops}
                                  language={language}
                                  onNavigate={setActiveTab}
                                  initialTab={getDeepLinkTab("inventory")}
                                />
                              </ErrorBoundary>
                            </div>
                          )}

                          {/* ========== UNIFIED MARKET ========== */}
                          {/* Consolidates: orders, marketplace, market */}
                          {activeTab === "orders" && currentUser && (
                            <div className="animate-fadeIn">
                              <ErrorBoundary componentName="UnifiedMarket">
                                <UnifiedMarket
                                  userId={currentUser.id}
                                  region={currentUser.region || "Unknown"}
                                  language={language}
                                  onNavigate={setActiveTab}
                                  initialTab={getDeepLinkTab("orders")}
                                />
                              </ErrorBoundary>
                            </div>
                          )}

                          {/* ========== UNIFIED FINANCE ========== */}
                          {/* Consolidates: finance, mobile-money, reporting, contracts, insurance, wallet-admin */}
                          {activeTab === "finance" && currentUser && (
                            <div className="animate-fadeIn">
                              <ErrorBoundary componentName="UnifiedFinance">
                                <UnifiedFinance
                                  userId={currentUser.id}
                                  userRole={currentUser.role}
                                  language={language}
                                  user={currentUser}
                                  initialTab={getDeepLinkTab("finance")}
                                />
                              </ErrorBoundary>
                            </div>
                          )}

                          {/* ========== LIVESTOCK (Standalone) ========== */}
                          {activeTab === "livestock" && currentUser && (
                            <div className="animate-fadeIn">
                              <ErrorBoundary componentName="AdvancedLivestockManagement">
                                <AdvancedLivestockManagement userId={currentUser.id} language={language} />
                              </ErrorBoundary>
                            </div>
                          )}

                          {/* ========== UNIFIED COMMUNITY ========== */}
                          {/* Consolidates: discussions, experts, soil-test */}
                          {activeTab === "discussions" && currentUser && (
                            <div className="animate-fadeIn">
                              <ErrorBoundary componentName="UnifiedCommunity">
                                <UnifiedCommunity
                                  userId={currentUser.id}
                                  language={language}
                                  onNavigate={setActiveTab}
                                  initialTab={getDeepLinkTab("discussions")}
                                />
                              </ErrorBoundary>
                            </div>
                          )}

                          {/* ========== UNIFIED LEARNING & SUPPORT ========== */}
                          {/* Consolidates: support, videos, knowledge, contact, faq, training */}
                          {activeTab === "support" && currentUser && (
                            <div className="animate-fadeIn">
                              <ErrorBoundary componentName="UnifiedLearning">
                                <UnifiedLearning
                                  userId={currentUser.id}
                                  language={language}
                                  onNavigate={setActiveTab}
                                  initialTab={getDeepLinkTab("support")}
                                />
                              </ErrorBoundary>
                            </div>
                          )}

                          {/* ========== LEGACY ROUTES (for backwards compatibility) ========== */}
                          {/* These will be auto-redirected by useEffect above */}
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
      {showNotifications && currentUser && (
        <div className="fixed inset-0 z-50 lg:inset-auto lg:right-0 lg:top-16 lg:w-96 lg:h-[calc(100vh-4rem)]">
          <div className="lg:hidden absolute inset-0 bg-black/50" onClick={() => setShowNotifications(false)} />
          <div className="relative h-full bg-white lg:border-l lg:shadow-2xl overflow-y-auto">
            <NotificationPanel 
              userId={currentUser.id}
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
    </GlobalErrorBoundary>
  );
}