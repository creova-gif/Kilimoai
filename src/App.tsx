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

import { LoginForm } from "./components/LoginForm";
import { RegistrationForm } from "./components/RegistrationForm";
import { RoleBasedRegistrationForm } from "./components/RoleBasedRegistrationForm";
import { SignupWithOTPFlow } from "./components/SignupWithOTPFlow"; // ✅ Added OTP flow
import { MasterOnboarding } from "./components/MasterOnboarding";
import { DemoModeControlPanel } from "./components/DemoModeControlPanel";
import logo from "figma:asset/59f0b6f20637b554072039bc3a2caa41a72f5af6.png";
import circleLogo from "figma:asset/9ef1fbe0081cc013ac53d20ae90d325e9b280b39.png";
import { hasFeatureAccess, filterFeaturesByRole, getRoleDisplayName, getRoleFeatures, FeatureId } from "./utils/roleBasedAccess";
import { isDemoMode, getDemoUser, demoModeFeatureAccess, getDemoModeState } from "./utils/demoMode";
import type { DemoModeState } from "./utils/demoMode";

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
import { projectId, publicAnonKey } from "./utils/supabase/info";

interface User {
  id: string;
  name: string;
  phone: string;
  region: string;
  crops: string[];
  farmSize: string;
  userType: string;
  role?: string;
  tier?: "free" | "basic" | "premium" | "enterprise";
}

export default function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [language, setLanguage] = useState<"en" | "sw">("en");
  const [showMasterOnboarding, setShowMasterOnboarding] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [showDemoControl, setShowDemoControl] = useState(false);
  const [demoModeActive, setDemoModeActive] = useState(false);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

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
          setShowMasterOnboarding(false);
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
      setShowMasterOnboarding(false);
    } else if (!hasSeenWelcome) {
      // First time user - show master onboarding
      setShowMasterOnboarding(true);
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

  const handleLogout = () => {
    setCurrentUser(null);
    setIsRegistered(false);
    localStorage.removeItem("kilimoUser");
    toast.success("Logged out successfully");
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
      setShowMasterOnboarding(false);
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

  // Navigation items - ALL 50+ FEATURES
  const allNavigationItems: Array<{ id: FeatureId; label: string; icon: any; color: string; category: string; badge?: string }> = [
    { id: "home", label: "Dashboard", icon: Home, color: "text-blue-600", category: "main" },
    { id: "workflows", label: "AI Workflows", icon: Brain, color: "text-purple-600", badge: "NEW", category: "ai" },
    { id: "ai-chat", label: "Sankofa AI", icon: MessageSquare, color: "text-green-600", category: "ai" },
    { id: "diagnosis", label: "Crop Diagnosis", icon: Camera, color: "text-orange-600", category: "ai" },
    { id: "voice", label: "Voice Assistant", icon: Phone, color: "text-blue-600", category: "ai" },
    { id: "ai-training", label: "AI Training Hub", icon: Brain, color: "text-purple-600", badge: "NEW", category: "ai" },
    { id: "market", label: "Market Prices", icon: TrendingUp, color: "text-indigo-600", category: "market" },
    { id: "weather", label: "Weather", icon: CloudRain, color: "text-sky-600", category: "main" },
    { id: "marketplace", label: "Marketplace", icon: ShoppingCart, color: "text-pink-600", category: "market" },
    { id: "experts", label: "Expert Consult", icon: Users, color: "text-cyan-600", category: "services" },
    { id: "soil-test", label: "Soil Testing", icon: Microscope, color: "text-emerald-600", category: "services" },
    { id: "videos", label: "Video Tutorials", icon: PlayCircle, color: "text-rose-600", category: "learning" },
    { id: "knowledge", label: "Knowledge Base", icon: BookOpen, color: "text-amber-600", category: "learning" },
    { id: "discussions", label: "Discussion Groups", icon: MessageCircle, color: "text-violet-600", category: "community" },
    { id: "tasks", label: "Task Management", icon: ClipboardList, color: "text-blue-600", category: "farm" },
    { id: "crop-planning", label: "Crop Planning", icon: Sprout, color: "text-green-600", category: "farm" },
    { id: "crop-planning-ai", label: "Crop Planning AI", icon: Brain, color: "text-emerald-600", category: "farm" },
    { id: "crop-dashboard", label: "Crop Dashboard", icon: BarChart3, color: "text-emerald-600", category: "farm" },
    { id: "livestock", label: "Livestock", icon: Activity, color: "text-orange-600", category: "farm" },
    { id: "livestock-health", label: "Livestock Health", icon: Activity, color: "text-red-600", category: "farm" },
    { id: "farm-mapping", label: "Farm Mapping", icon: Map, color: "text-indigo-600", category: "farm" },
    { id: "land-allocation", label: "Land Allocation", icon: Target, color: "text-purple-600", category: "farm" },
    { id: "inventory", label: "Inventory", icon: Warehouse, color: "text-blue-600", category: "farm" },
    { id: "finance", label: "Farm Finance", icon: Calculator, color: "text-green-600", category: "finance" },
    { id: "mobile-money", label: "Mobile Money", icon: CreditCard, color: "text-pink-600", category: "finance" },
    { id: "wallet-admin", label: "Wallet Admin", icon: Wallet, color: "text-emerald-600", category: "finance" },
    { id: "orders", label: "Orders & Sales", icon: ShoppingBag, color: "text-purple-600", category: "market" },
    { id: "agribusiness", label: "Agribusiness", icon: Building2, color: "text-purple-600", category: "market" },
    { id: "input-supply", label: "Input Supply", icon: Package, color: "text-blue-600", category: "finance" },
    { id: "contracts", label: "Contract Farming", icon: FileText, color: "text-green-600", category: "finance" },
    { id: "insurance", label: "Insurance", icon: Shield, color: "text-red-600", category: "services" },
    { id: "agro-id", label: "KILIMO Agro-ID", icon: IdCard, color: "text-blue-600", category: "services" },
    { id: "analytics", label: "Analytics", icon: BarChart3, color: "text-purple-600", category: "insights" },
    { id: "reports", label: "Reporting", icon: LineChart, color: "text-indigo-600", category: "insights" },
    { id: "farm-graph", label: "Farm Graph", icon: Network, color: "text-cyan-600", category: "insights" },
    { id: "predictive", label: "Predictions", icon: TrendingUp, color: "text-green-600", category: "insights" },
    { id: "digital-twin", label: "Digital Twin", icon: Boxes, color: "text-purple-600", category: "insights" },
    { id: "ai-recommendations", label: "AI Recommendations", icon: Lightbulb, color: "text-yellow-600", category: "ai" },
    { id: "ai-insights", label: "AI Insights", icon: Brain, color: "text-green-600", category: "ai" },
    { id: "crop-tips", label: "Crop Specific Tips", icon: Leaf, color: "text-emerald-600", category: "learning" },
    { id: "family-planner", label: "Family Planner", icon: Users, color: "text-pink-600", category: "farm" },
    { id: "farmer-lab", label: "Farmer Lab", icon: Microscope, color: "text-purple-600", category: "learning" },
    { id: "gamification", label: "Achievements", icon: Award, color: "text-yellow-600", category: "admin" },
    { id: "extension", label: "Extension Officer", icon: Briefcase, color: "text-indigo-600", category: "admin" },
    { id: "institutional", label: "Institutional", icon: Building2, color: "text-purple-600", category: "admin" },
    { id: "cooperative", label: "Cooperative", icon: Users, color: "text-green-600", category: "community" },
    { id: "diagnostics", label: "System Diagnostics", icon: Settings, color: "text-gray-600", category: "admin" },
    { id: "training", label: "Training Courses", icon: BookOpen, color: "text-blue-600", category: "learning" },
    { id: "support", label: "Support", icon: HelpCircle, color: "text-blue-600", category: "help" },
    { id: "contact", label: "Contact Us", icon: PhoneCall, color: "text-green-600", category: "help" },
    { id: "faq", label: "FAQ", icon: Info, color: "text-cyan-600", category: "help" },
    { id: "privacy", label: "Privacy", icon: Shield, color: "text-gray-600", category: "settings" },
  ];

  // Filter navigation items based on user role
  const navigationItems = currentUser?.role 
    ? filterFeaturesByRole(allNavigationItems, currentUser.role)
    : allNavigationItems;

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

  // Login/Register Screen
  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Toaster position="top-center" richColors />
        
        {/* Login/Register Forms */}
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            {showLogin ? (
              <LoginForm onLogin={handleLogin} loading={loading} language={language} />
            ) : (
              <SignupWithOTPFlow 
                onComplete={(userData) => {
                  setCurrentUser(userData);
                  setIsRegistered(true);
                  const roleDisplayName = getRoleDisplayName(userData.role, language);
                  const featureCount = getRoleFeatures(userData.role).length;
                  toast.success(
                    language === "en"
                      ? `✅ Phone verified! Welcome to KILIMO, ${userData.name}! (${roleDisplayName} • ${featureCount} features)`
                      : `✅ Simu imethibitishwa! Karibu KILIMO, ${userData.name}! (${roleDisplayName} • Vipengele ${featureCount})`
                  );
                }}
                language={language}
              />
            )}
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowLogin(!showLogin)}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                {showLogin ? "Don't have an account? Register" : "Already have an account? Login"}
              </button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="p-2 bg-green-100 rounded-xl w-fit mb-2">
                <Brain className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">AI Workflows</h3>
              <p className="text-xs text-gray-600 mt-1">5 intelligent farm management tools</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="p-2 bg-green-100 rounded-xl w-fit mb-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Sankofa AI</h3>
              <p className="text-xs text-gray-600 mt-1">24/7 agricultural advisor</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="p-2 bg-green-100 rounded-xl w-fit mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Live Prices</h3>
              <p className="text-xs text-gray-600 mt-1">Real-time market data</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="p-2 bg-green-100 rounded-xl w-fit mb-2">
                <Camera className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Diagnosis</h3>
              <p className="text-xs text-gray-600 mt-1">AI crop health analysis</p>
            </div>
          </div>
        </div>
      </div>
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
                className="lg:hidden relative group"
                aria-label="Toggle mobile menu"
              >
                <div className="relative w-12 h-12 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-green-200 hover:border-green-400">
                  {/* Animated background pulse */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${showMobileMenu ? 'animate-pulse' : ''}`} />
                  
                  {/* Menu icon container */}
                  <div className="relative w-6 h-6 flex flex-col justify-center items-center gap-1.5">
                    {/* Top bar */}
                    <span className={`block h-0.5 w-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full transition-all duration-300 ease-out ${
                      showMobileMenu 
                        ? 'rotate-45 translate-y-2 w-6' 
                        : 'group-hover:w-5'
                    }`} />
                    
                    {/* Middle bar */}
                    <span className={`block h-0.5 w-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full transition-all duration-300 ease-out ${
                      showMobileMenu 
                        ? 'opacity-0 scale-0' 
                        : 'group-hover:w-4 opacity-100'
                    }`} />
                    
                    {/* Bottom bar */}
                    <span className={`block h-0.5 w-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full transition-all duration-300 ease-out ${
                      showMobileMenu 
                        ? '-rotate-45 -translate-y-2 w-6' 
                        : 'group-hover:w-5'
                    }`} />
                  </div>
                  
                  {/* Notification dot when menu is active */}
                  {showMobileMenu && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full border-2 border-white shadow-md animate-bounce" />
                  )}
                </div>
                
                {/* Tooltip */}
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {showMobileMenu ? 'Close menu' : 'Open menu'}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab("home")}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img 
                  src={logo}
                  alt="KILIMO Logo" 
                  className="h-12 w-auto object-contain"
                />
              </button>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search features, crops, markets..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Role Badge */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-200">
                <Briefcase className="h-3.5 w-3.5 text-green-600" />
                <span className="text-xs font-semibold text-green-700">
                  {getRoleDisplayName(currentUser?.role || "smallholder_farmer", language)}
                </span>
              </div>

              {/* Tier Badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                <Award className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-bold text-purple-700 uppercase">{currentUser?.tier || "FREE"}</span>
              </div>

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
                className="flex items-center gap-1.5 px-3 py-2 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
              >
                <span className={`text-xs font-semibold ${language === "en" ? "text-green-600" : "text-gray-400"}`}>
                  EN
                </span>
                <span className="text-gray-400">|</span>
                <span className={`text-xs font-semibold ${language === "sw" ? "text-green-600" : "text-gray-400"}`}>
                  SW
                </span>
              </button>

              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-700" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Profile */}
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-gray-900">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500">{currentUser?.region}</p>
                </div>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-xl transition-colors group"
                title="Logout"
              >
                <LogOut className="h-5 w-5 text-gray-600 group-hover:text-red-600" />
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
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                  <Briefcase className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-green-900">
                    {getRoleDisplayName(currentUser?.role || "smallholder_farmer", language)}
                  </h3>
                  <p className="text-[10px] text-green-700">
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
                  {/* Enhanced Category Header */}
                  <div className="relative group">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200/60 shadow-sm">
                      <div className="p-1.5 bg-white rounded-lg shadow-sm group-hover:shadow transition-shadow">
                        <CategoryIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                        {category.label}
                      </h3>
                      <div className="ml-auto h-1 w-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-60"></div>
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
              <div className="p-4 space-y-6">
                {/* Role Summary Card - Mobile */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm">
                      <Briefcase className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs font-bold text-green-900">
                        {getRoleDisplayName(currentUser?.role || "smallholder_farmer", language)}
                      </h3>
                      <p className="text-[10px] text-green-700">
                        {navigationItems.length} {language === "en" ? "features" : "vipengele"}
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
                      {/* Enhanced Category Header */}
                      <div className="relative group">
                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200/60 shadow-sm">
                          <div className="p-1.5 bg-white rounded-lg shadow-sm group-hover:shadow transition-shadow">
                            <CategoryIcon className="h-4 w-4 text-green-600" />
                          </div>
                          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                            {category.label}
                          </h3>
                          <div className="ml-auto h-1 w-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-60"></div>
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
                                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 shadow-md shadow-green-100/50 scale-[1.02]' 
                                  : 'bg-white border border-gray-100 hover:border-green-200 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
                                }
                              `}
                            >
                              {/* Icon Container with Gradient Background */}
                              <div className={`
                                p-1.5 rounded-lg transition-all duration-200
                                ${isActive 
                                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-sm' 
                                  : 'bg-gray-50 group-hover/item:bg-green-50'
                                }
                              `}>
                                <Icon className={`
                                  h-4 w-4 transition-colors duration-200
                                  ${isActive ? 'text-white' : item.color + ' group-hover/item:text-green-600'}
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
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-sm shadow-green-300 animate-pulse"></div>
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
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative">
          {/* Multi-Layer Animated Background */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {/* Gradient Base Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/40"></div>
            
            {/* Animated Orbs - Layer 1 */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-green-200/40 to-emerald-300/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-teal-200/40 to-green-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            {/* Animated Orbs - Layer 2 */}
            <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-emerald-200/30 to-green-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-gradient-to-tl from-teal-200/30 to-emerald-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
            
            {/* Central Glow */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-green-100/20 via-transparent to-transparent rounded-full blur-3xl"></div>
            
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(34, 197, 94, 0.3) 25%, rgba(34, 197, 94, 0.3) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, 0.3) 75%, rgba(34, 197, 94, 0.3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(34, 197, 94, 0.3) 25%, rgba(34, 197, 94, 0.3) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, 0.3) 75%, rgba(34, 197, 94, 0.3) 76%, transparent 77%, transparent)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          {/* Content Container with Enhanced Design */}
          <div className="relative z-10 min-h-full p-4 lg:p-8">
            {/* Floating Content Container with Glass Morphism */}
            <div className="relative">
              {/* Decorative Top Border Glow */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60"></div>
              
              {/* Content Wrapper with Premium Styling */}
              <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
                {/* Top Gradient Accent Bar */}
                <div className="h-1.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
                
                {/* Inner Content with Padding */}
                <div className="p-4 lg:p-8 pb-24 lg:pb-8">
                  {/* Advanced Content Delivery System with State Management */}
                  <div className="relative min-h-[calc(100vh-12rem)]">
                    {/* Multi-layer Background System */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                      {/* Base layer */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-green-50/20"></div>
                      {/* Accent layer for active states */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-green-50/10 via-transparent to-blue-50/10 opacity-0 transition-opacity duration-500"></div>
                      {/* Pattern overlay */}
                      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(0 0 0) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                    </div>
                    
                    {/* Content Layer with Progressive Enhancement */}
                    <div className="relative z-10">
                      {/* Status Bar - Shows connection, sync, and data freshness */}
                      <div className="mb-4 flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                          {/* Data Freshness Indicator */}
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
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

                      {/* Content Container with Smart Loading */}
                      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm overflow-hidden">
                        {/* Tab Content with Transition System */}
                        <div className="relative">
                          {activeTab === "home" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                              <DashboardHome user={currentUser!} onNavigate={setActiveTab} language={language} />
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
                
                {/* Bottom Decorative Glow */}
                <div className="h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
              </div>
              
              {/* Decorative Bottom Border Glow */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40"></div>
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

      {/* Master Onboarding */}
      {showMasterOnboarding && (
        <MasterOnboarding 
          onComplete={(data) => {
            setShowMasterOnboarding(false);
            setLanguage(data.language);
            if (data.mode === "guest") {
              setIsGuestMode(true);
              setIsRegistered(true);
              // Create a guest user
              const guestUser = {
                id: "guest",
                name: "Guest User",
                phone: "",
                region: "Dar es Salaam",
                crops: [],
                farmSize: "",
                userType: "guest",
                tier: "free" as const
              };
              setCurrentUser(guestUser);
            }
          }}
          onShowRegister={() => {
            setShowMasterOnboarding(false);
            setShowLogin(false);
          }}
          onShowLogin={() => {
            setShowMasterOnboarding(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
}