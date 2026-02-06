import { Bell, Menu, User, LogOut, UserCircle, Languages } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HeaderProps {
  userType: string;
  userName: string;
  notificationCount: number;
  onMenuClick: () => void;
  onNotificationClick: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
  language?: "en" | "sw";
  onLanguageToggle?: () => void;
}

export function Header({ 
  userType, 
  userName, 
  notificationCount,
  onMenuClick,
  onNotificationClick,
  onProfileClick,
  onLogout,
  language = "en",
  onLanguageToggle
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-green-600 to-green-700 shadow-lg safe-area-top">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onMenuClick}
            className="text-white hover:bg-green-500 h-10 w-10 sm:h-auto sm:w-auto p-2"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 sm:h-5 sm:w-5" />
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white text-green-600 shadow-md">
              <span className="font-bold text-sm sm:text-base">CA</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-white">KILIMO Agri-AI</h1>
              <p className="text-xs text-green-100">{userType}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {/* Language Toggle Button */}
          {onLanguageToggle && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-green-500 h-10 px-2.5 sm:px-3 flex items-center gap-1.5 border border-white/30 rounded-lg transition-all hover:border-white/60"
              onClick={onLanguageToggle}
              aria-label="Toggle language"
              title={language === "en" ? "Switch to Swahili" : "Badili kwenda Kiingereza"}
            >
              <Languages className="h-5 w-5" />
              <span className="text-sm font-bold min-w-[28px] text-center">{language === "en" ? "EN" : "SW"}</span>
              <span className="hidden md:inline text-xs opacity-90 ml-0.5">| {language === "en" ? "English" : "Kiswahili"}</span>
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative text-white hover:bg-green-500 h-10 w-10 p-2"
            onClick={onNotificationClick}
            aria-label="View notifications"
          >
            <Bell className="h-6 w-6 sm:h-5 sm:w-5" />
            {notificationCount > 0 && (
              <Badge 
                className="absolute -right-0.5 -top-0.5 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 border-2 border-white text-xs"
                variant="destructive"
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </Badge>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onProfileClick}
            className="hidden sm:flex items-center gap-2 text-white hover:bg-green-500 px-3"
            aria-label="View profile"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <UserCircle className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm max-w-[100px] truncate">{userName}</span>
          </Button>

          {/* Mobile Profile Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onProfileClick}
            className="sm:hidden text-white hover:bg-green-500 h-10 w-10 p-2"
            aria-label="View profile"
          >
            <UserCircle className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="hidden sm:flex text-white hover:bg-green-500 h-auto px-3"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}