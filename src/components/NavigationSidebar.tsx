import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { 
  LayoutDashboard, 
  MessageSquare, 
  TrendingUp, 
  Cloud,
  ShoppingCart,
  BarChart3,
  Trophy,
  Camera,
  X,
  Database,
  Mic,
  Users,
  Sparkles,
  UsersRound,
  Package,
  FileText,
  Shield,
  BookOpen,
  HelpCircle,
  Lock,
  Activity,
  Layers,
  Calendar,
  Brain,
  Wallet,
  Leaf,
  Zap,
  Target,
  Phone,
  Building,
  CreditCard,
  Smartphone,
  CheckSquare,
  Map,
  Beef,
  Warehouse,
  Sprout,
  DollarSign,
  Wrench,
  Video,
  Beaker,
  UserCheck
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userType: string;
}

export function NavigationSidebar({ 
  isOpen, 
  onClose, 
  activeTab, 
  onTabChange,
  userType 
}: NavigationSidebarProps) {
  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    onClose();
  };

  // Core Features Section
  const coreFeatures = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "ai-chat", label: "AI Support", icon: MessageSquare },
    { id: "diagnosis", label: "Crop Diagnosis", icon: Camera },
    { id: "market", label: "Market Prices", icon: TrendingUp },
    { id: "weather", label: "Weather", icon: Cloud },
  ];

  // Farm Management Section
  const farmManagement = [
    { id: "task-management", label: "Task & Team", icon: CheckSquare },
    { id: "farm-mapping", label: "Farm Mapping", icon: Map },
    { id: "farm-graph", label: "Farm Analytics", icon: Database },
    { id: "livestock-health-monitor", label: "Livestock Health", icon: Activity },
    { id: "ai-farm-plan-generator", label: "Farm Plan AI", icon: Calendar },
  ];

  // Advanced Farm Management (NEW COMPREHENSIVE FEATURES)
  const advancedManagement = [
    { id: "livestock-management", label: "Livestock Management", icon: Beef },
    { id: "crop-planning", label: "Crop Planning", icon: Sprout },
    { id: "resource-inventory", label: "Resource & Inventory", icon: Warehouse },
    { id: "orders-sales", label: "Orders & E-commerce", icon: ShoppingCart },
    { id: "comprehensive-reporting", label: "Reports & Analytics", icon: BarChart3 },
  ];

  // AI & Intelligence Section (MERGED: Predictive Models + AI Rec Engine)
  const aiIntelligence = [
    { id: "ai-recommendation-engine", label: "AI Recommendations", icon: Brain },
    { id: "voice-assistant", label: "Voice Assistant", icon: Mic },
    { id: "recommendations", label: "Personalized Tips", icon: Target },
  ];

  // Community & Learning Section
  const communityLearning = [
    { id: "farmer-lab", label: "Farmer Lab", icon: UsersRound },
    { id: "family-planner", label: "Family Planner", icon: Users },
    { id: "achievements", label: "Achievements", icon: Trophy },
  ];

  // Financial Services Section
  const financialServices = [
    { id: "mobile-money", label: "Mobile Money & Wallet", icon: Wallet },
    { id: "farm-finance", label: "Farm Finance", icon: CreditCard },
    { id: "agro-id", label: "KILIMO AGRO-ID", icon: Shield },
  ];

  // Marketplace & Trade Section (Farmer only)
  const marketplaceTrade = userType === "farmer" ? [
    { id: "marketplace", label: "Marketplace", icon: ShoppingCart },
    { id: "inputs", label: "Input Suppliers", icon: Package },
    { id: "contracts", label: "Contract Farming", icon: FileText },
    { id: "insurance", label: "Insurance", icon: Shield },
  ] : [];

  // Support & Resources Section
  const supportResources = userType === "farmer" ? [
    { id: "discussions", label: "Peer Groups", icon: UsersRound },
    { id: "knowledge", label: "Knowledge Library", icon: BookOpen },
    { id: "video-tutorials", label: "Video Tutorials", icon: Video },
    { id: "expert-consultations", label: "Expert Consultations", icon: UserCheck },
    { id: "soil-testing", label: "Soil Testing Service", icon: Beaker },
    { id: "support", label: "Support", icon: HelpCircle },
    { id: "privacy", label: "Privacy & Data", icon: Lock },
  ] : [];

  // Organization Tools (NGO/Cooperative)
  const organizationTools = (userType === "ngo" || userType === "cooperative") ? [
    { id: "analytics", label: "Analytics Dashboard", icon: BarChart3 },
    { id: "extension", label: "Field Visits", icon: Activity },
  ] : [];

  // Support Section
  const support = [
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "contact", label: "Contact Support", icon: Phone },
  ];

  const renderSection = (title: string, items: Array<{ id: string; label: string; icon: any }>, emoji?: string) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-3">
        <div className="px-2 mb-2.5">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center">
            {emoji && <span className="mr-1.5 text-sm">{emoji}</span>}
            {title}
          </p>
        </div>
        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-200 ${ 
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                }`}
                aria-label={`Navigate to ${item.label}`}
                aria-current={isActive ? "page" : undefined}
              >
                <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-600"}`} />
                </div>
                <span className={`flex-1 text-left text-[13px] leading-tight ${isActive ? "text-white font-medium" : "text-gray-700 font-normal"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[340px] p-0 flex flex-col h-full bg-white">
        {/* Header */}
        <SheetHeader className="px-4 pt-4 pb-3 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 flex-shrink-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Access all features and sections of the KILIMO platform
          </SheetDescription>
        </SheetHeader>
        
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {/* Core Features */}
          {renderSection("ESSENTIALS", coreFeatures)}
          <Separator className="my-3" />
          
          {/* Farm Management */}
          {renderSection("FARM MANAGEMENT", farmManagement)}
          
          <Separator className="my-3" />
          
          {/* Advanced Farm Management */}
          {renderSection("ADVANCED MANAGEMENT", advancedManagement)}
          
          <Separator className="my-3" />
          
          {/* AI & Intelligence */}
          {renderSection("AI INTELLIGENCE", aiIntelligence)}
          
          <Separator className="my-3" />
          
          {/* Community & Learning */}
          {renderSection("COMMUNITY", communityLearning)}
          
          <Separator className="my-3" />
          
          {/* Financial Services */}
          {renderSection("FINANCIAL", financialServices)}
          
          {/* Marketplace & Trade (Farmer only) */}
          {marketplaceTrade.length > 0 && (
            <>
              <Separator className="my-3" />
              {renderSection("MARKETPLACE", marketplaceTrade)}
            </>
          )}
          
          {/* Support & Resources (Farmer only) */}
          {supportResources.length > 0 && (
            <>
              <Separator className="my-3" />
              {renderSection("SUPPORT", supportResources)}
            </>
          )}
          
          {/* Organization Tools (NGO/Cooperative) */}
          {organizationTools.length > 0 && (
            <>
              <Separator className="my-3" />
              {renderSection("ORGANIZATION", organizationTools)}
            </>
          )}
          
          {/* Support Section */}
          <Separator className="my-3" />
          {renderSection("SUPPORT", support)}
        </nav>

        <div className="p-4 border-t bg-gradient-to-r from-green-50 to-emerald-50 flex-shrink-0">
          <div className="text-center">
            <p className="font-semibold text-sm text-green-800">KILIMO Agri-AI</p>
            <p className="text-xs text-green-600 mt-0.5">Empowering Tanzanian Farmers</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}