import { Home, Brain, ClipboardList, ShoppingCart, User, BarChart3, Users, Briefcase, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { hasFeatureAccess, type UserRole } from "../utils/roleBasedAccess";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount?: number;
  userRole?: UserRole | string;
}

export function MobileBottomNav({ activeTab, onTabChange, notificationCount = 0, userRole = "smallholder_farmer" }: MobileBottomNavProps) {
  // Role-specific navigation items
  const getRoleNavItems = () => {
    const role = userRole as UserRole;
    
    // Common items for all users
    const commonItems = [
      { id: "home", label: "Home", icon: Home, feature: "home" as const },
    ];

    // Role-specific middle items
    let middleItems: Array<{ id: string; label: string; icon: any; feature: any }> = [];

    switch (role) {
      case "smallholder_farmer":
      case "farmer":
        middleItems = [
          { id: "ai-chat", label: "AI", icon: Brain, feature: "ai-chat" as const },
          { id: "market", label: "Market", icon: ShoppingCart, feature: "market" as const },
          { id: "crop-planning", label: "Crops", icon: ClipboardList, feature: "crop-planning" as const },
        ];
        break;

      case "farm_manager":
        middleItems = [
          { id: "tasks", label: "Tasks", icon: ClipboardList, feature: "tasks" as const },
          { id: "analytics", label: "Analytics", icon: BarChart3, feature: "analytics" as const },
          { id: "farm-graph", label: "Farm", icon: TrendingUp, feature: "farm-graph" as const },
        ];
        break;

      case "commercial_farm_admin":
        middleItems = [
          { id: "agribusiness", label: "Business", icon: Briefcase, feature: "agribusiness" as const },
          { id: "orders", label: "Orders", icon: ShoppingCart, feature: "orders" as const },
          { id: "analytics", label: "Analytics", icon: BarChart3, feature: "analytics" as const },
        ];
        break;

      case "agribusiness_ops":
        middleItems = [
          { id: "marketplace", label: "Market", icon: ShoppingCart, feature: "marketplace" as const },
          { id: "orders", label: "Orders", icon: ClipboardList, feature: "orders" as const },
          { id: "analytics", label: "Analytics", icon: BarChart3, feature: "analytics" as const },
        ];
        break;

      case "extension_officer":
        middleItems = [
          { id: "ai-chat", label: "AI", icon: Brain, feature: "ai-chat" as const },
          { id: "farmer-lab", label: "Lab", icon: Users, feature: "farmer-lab" as const },
          { id: "analytics", label: "Analytics", icon: BarChart3, feature: "analytics" as const },
        ];
        break;

      case "cooperative_leader":
        middleItems = [
          { id: "cooperative", label: "Coop", icon: Users, feature: "cooperative" as const },
          { id: "marketplace", label: "Market", icon: ShoppingCart, feature: "marketplace" as const },
          { id: "analytics", label: "Analytics", icon: BarChart3, feature: "analytics" as const },
        ];
        break;

      default:
        // Fallback for unknown roles (smallholder)
        middleItems = [
          { id: "ai-chat", label: "AI", icon: Brain, feature: "ai-chat" as const },
          { id: "market", label: "Market", icon: ShoppingCart, feature: "market" as const },
          { id: "crop-planning", label: "Crops", icon: ClipboardList, feature: "crop-planning" as const },
        ];
    }

    // Profile is always last
    const profileItem = { id: "profile", label: "Profile", icon: User, feature: null };

    return [...commonItems, ...middleItems, profileItem];
  };

  const navItems = getRoleNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl z-50 md:hidden safe-area-bottom">
      <div className="h-16 relative">
        {/* Mobile bottom nav removed - navigation handled by sidebar menu */}
      </div>
    </div>
  );
}