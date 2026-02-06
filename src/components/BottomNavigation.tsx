import { Home, MessageSquare, ShoppingCart, User } from "lucide-react";
import { Badge } from "./ui/badge";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount: number;
  userType: string;
}

export function BottomNavigation({ 
  activeTab, 
  onTabChange, 
  notificationCount,
  userType 
}: BottomNavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "ai-chat", label: "Chat", icon: MessageSquare },
    ...(userType === "farmer" ? [{ id: "marketplace", label: "Market", icon: ShoppingCart }] : []),
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 sm:h-14 px-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-200 active:scale-95 min-w-[60px] ${
                isActive 
                  ? "text-green-600" 
                  : "text-gray-500 hover:text-gray-700 active:text-gray-900"
              }`}
              aria-label={`Navigate to ${item.label}`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                <Icon className={`h-6 w-6 ${isActive ? "fill-green-100" : ""}`} />
                {item.id === "ai-chat" && notificationCount > 0 && (
                  <Badge 
                    className="absolute -right-2 -top-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]"
                    variant="destructive"
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </div>
              <span className={`text-xs mt-1 ${isActive ? "font-medium" : ""}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-green-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}