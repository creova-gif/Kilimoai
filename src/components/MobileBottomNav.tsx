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
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                flex flex-col items-center justify-center flex-1 h-full relative
                transition-all duration-200 active:scale-95 min-w-[56px]
                ${isActive ? "text-[#2E7D32]" : "text-gray-500 hover:text-gray-700"}
              `}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active pill background */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavPill"
                  className="absolute inset-x-1 inset-y-1 bg-[#2E7D32]/8 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-all duration-200 ${
                    isActive ? "scale-110" : ""
                  }`}
                />
                {/* Notification dot */}
                {item.id === "ai-chat" && notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 h-4 w-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 font-medium transition-all duration-200 ${
                  isActive ? "text-[#2E7D32]" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}