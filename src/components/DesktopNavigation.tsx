import { useState, useRef, useEffect } from "react";
import {
  Home, GraduationCap, Users, ShoppingCart, FileText, Zap,
  Wallet, HelpCircle, Settings, ChevronDown, Search, Bell,
  User, Video, BookOpen, Sprout, FlaskConical, Trophy,
  MessageCircle, Award, TrendingUp, Package, Truck,
  Beaker, Shield, HeadphonesIcon, Phone, Lightbulb,
  BookMarked, LogOut
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";

interface DesktopNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: "farmer" | "expert" | "admin";
  language: "en" | "sw";
  userName?: string;
}

interface NavItem {
  id: string;
  label: string;
  labelSw: string;
  icon: any;
  page?: string;
  subItems?: SubItem[];
  badge?: string;
}

interface SubItem {
  id: string;
  label: string;
  labelSw: string;
  page: string;
  icon?: any;
  badge?: string;
  description?: string;
  descriptionSw?: string;
}

export function DesktopNavigation({ 
  currentPage, 
  onNavigate, 
  userRole, 
  language,
  userName = "John Mollel"
}: DesktopNavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      labelSw: "Nyumbani",
      icon: Home,
      page: "home"
    },
    {
      id: "learning",
      label: "Learning",
      labelSw: "Kujifunza",
      icon: GraduationCap,
      subItems: [
        {
          id: "learning-home",
          label: "Learning Center",
          labelSw: "Kituo cha Kujifunza",
          page: "learning-home",
          icon: BookMarked,
          description: "Explore all learning resources",
          descriptionSw: "Chunguza rasilimali zote za kujifunza"
        },
        {
          id: "videos",
          label: "Video Tutorials",
          labelSw: "Mafunzo ya Video",
          page: "videos",
          icon: Video,
          description: "Watch farming video guides",
          descriptionSw: "Tazama miongozo ya video ya kilimo"
        },
        {
          id: "knowledge",
          label: "Knowledge Base",
          labelSw: "Hifadhi ya Ujuzi",
          page: "knowledge",
          icon: BookOpen,
          description: "Read expert articles",
          descriptionSw: "Soma makala za wataalam"
        },
        {
          id: "crop-tips",
          label: "Crop-Specific Tips",
          labelSw: "Vidokezo vya Mazao",
          page: "crop-tips",
          icon: Sprout,
          description: "Get crop recommendations",
          descriptionSw: "Pata mapendekezo ya mazao"
        },
        {
          id: "farmer-lab",
          label: "Farmer Lab",
          labelSw: "Maabara ya Mkulima",
          page: "farmer-lab",
          icon: FlaskConical,
          description: "Community experiments",
          descriptionSw: "Majaribio ya jamii"
        },
        {
          id: "courses",
          label: "Training Courses",
          labelSw: "Kozi za Mafunzo",
          page: "courses",
          icon: Trophy,
          badge: "New",
          description: "Structured learning paths",
          descriptionSw: "Njia za kujifunza zilizopangwa"
        }
      ]
    },
    {
      id: "community",
      label: "Community",
      labelSw: "Jamii",
      icon: Users,
      subItems: [
        {
          id: "discussions",
          label: "Discussion Groups",
          labelSw: "Vikundi vya Majadiliano",
          page: "discussions",
          icon: MessageCircle,
          description: "Connect with farmers",
          descriptionSw: "Unganisha na wakulima"
        },
        {
          id: "achievements",
          label: "Achievements",
          labelSw: "Mafanikio",
          page: "gamification",
          icon: Award,
          description: "Track your progress",
          descriptionSw: "Fuatilia maendeleo yako"
        }
      ]
    },
    {
      id: "marketplace",
      label: "Marketplace",
      labelSw: "Soko",
      icon: ShoppingCart,
      subItems: [
        {
          id: "market-prices",
          label: "Market Prices",
          labelSw: "Bei za Soko",
          page: "market",
          icon: TrendingUp,
          description: "Real-time price updates",
          descriptionSw: "Taarifa za bei za wakati halisi"
        },
        {
          id: "input-supply",
          label: "Input Supply",
          labelSw: "Ugavi wa Vifaa",
          page: "inputs",
          icon: Package,
          description: "Buy farming supplies",
          descriptionSw: "Nunua vifaa vya kilimo"
        },
        {
          id: "my-orders",
          label: "My Orders",
          labelSw: "Maagizo Yangu",
          page: "orders",
          icon: Truck,
          description: "Track your purchases",
          descriptionSw: "Fuatilia manunuzi yako"
        }
      ]
    },
    {
      id: "services",
      label: "Services",
      labelSw: "Huduma",
      icon: Zap,
      subItems: [
        {
          id: "contracts",
          label: "Contract Farming",
          labelSw: "Ukulima wa Mikataba",
          page: "contracts",
          icon: FileText,
          description: "Secure farming contracts",
          descriptionSw: "Mikataba salama ya kilimo"
        },
        {
          id: "expert-consultation",
          label: "Expert Consultation",
          labelSw: "Ushauri wa Mtaalamu",
          page: "expert-consultation",
          icon: MessageCircle,
          description: "Get expert advice",
          descriptionSw: "Pata ushauri wa wataalamu"
        },
        {
          id: "soil-testing",
          label: "Soil Testing",
          labelSw: "Upimaji wa Udongo",
          page: "soil-testing",
          icon: Beaker,
          description: "Analyze your soil",
          descriptionSw: "Changanua udongo wako"
        },
        {
          id: "insurance",
          label: "Insurance Hub",
          labelSw: "Kituo cha Bima",
          page: "insurance",
          icon: Shield,
          badge: "New",
          description: "Protect your farm",
          descriptionSw: "Linda shamba lako"
        }
      ]
    },
    {
      id: "wallet",
      label: "Wallet",
      labelSw: "Mkoba",
      icon: Wallet,
      page: "wallet"
    },
    {
      id: "help",
      label: "Help",
      labelSw: "Msaada",
      icon: HelpCircle,
      subItems: [
        {
          id: "support",
          label: "Support Tickets",
          labelSw: "Tiketi za Msaada",
          page: "support-tickets",
          icon: HeadphonesIcon,
          description: "Get help with issues",
          descriptionSw: "Pata msaada kwa matatizo"
        },
        {
          id: "contact",
          label: "Contact Us",
          labelSw: "Wasiliana Nasi",
          page: "contact",
          icon: Phone,
          description: "Reach our team",
          descriptionSw: "Wasiliana na timu yetu"
        },
        {
          id: "faq",
          label: "FAQs",
          labelSw: "Maswali",
          page: "faq",
          icon: Lightbulb,
          description: "Common questions",
          descriptionSw: "Maswali ya kawaida"
        }
      ]
    }
  ];

  const getLabel = (item: NavItem | SubItem) => {
    return language === "sw" ? item.labelSw : item.label;
  };

  const getDescription = (item: SubItem) => {
    return language === "sw" ? item.descriptionSw : item.description;
  };

  const isActive = (page?: string) => page === currentPage;

  const hasActiveSubItem = (item: NavItem) =>
    item.subItems?.some(sub => sub.page === currentPage);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setHoveredItem(null);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setHoveredItem(null);
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-white border-b-2 border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <Sprout className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">KILIMO</h1>
              <p className="text-xs text-gray-600">
                {language === "en" ? "Agri-AI Suite" : "Mfumo wa AI-Kilimo"}
              </p>
            </div>
          </button>

          {/* Navigation Items */}
          <div className="flex items-center gap-1" ref={dropdownRef}>
            {navItems.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isItemActive = isActive(item.page) || hasActiveSubItem(item);
              const ItemIcon = item.icon;
              const isHovered = hoveredItem === item.id;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => hasSubItems && setHoveredItem(item.id)}
                  onMouseLeave={() => hasSubItems && setHoveredItem(null)}
                >
                  <button
                    onClick={() => {
                      if (!hasSubItems && item.page) {
                        onNavigate(item.page);
                      } else if (hasSubItems) {
                        setHoveredItem(isHovered ? null : item.id);
                      }
                    }}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-all relative
                      ${isItemActive 
                        ? "bg-green-50 text-green-700 font-semibold shadow-sm" 
                        : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                    aria-expanded={hasSubItems ? isHovered : undefined}
                    aria-haspopup={hasSubItems ? "menu" : undefined}
                  >
                    {isItemActive && (
                      <motion.div
                        layoutId="desktopActiveIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <ItemIcon className={`h-4 w-4 ${isItemActive ? "text-green-600" : ""}`} />
                    <span className="text-sm">{getLabel(item)}</span>
                    {hasSubItems && (
                      <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isHovered ? "rotate-180" : ""}`} />
                    )}
                    {item.badge && (
                      <Badge className="bg-red-500 text-white text-xs ml-1 px-1.5 py-0.5">
                        {item.badge}
                      </Badge>
                    )}
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {hasSubItems && isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden"
                        role="menu"
                      >
                        {/* Dropdown Header */}
                        <div className="p-3 bg-green-50 border-b-2 border-green-100">
                          <div className="flex items-center gap-2">
                            <ItemIcon className="h-5 w-5 text-green-600" />
                            <span className="font-semibold text-gray-900">{getLabel(item)}</span>
                          </div>
                        </div>

                        {/* Dropdown Items */}
                        <div className="p-2 max-h-96 overflow-y-auto">
                          {item.subItems!.map((subItem, idx) => {
                            const isSubActive = isActive(subItem.page);
                            const SubIcon = subItem.icon || ChevronDown;

                            return (
                              <motion.button
                                key={subItem.id}
                                onClick={() => {
                                  onNavigate(subItem.page);
                                  setHoveredItem(null);
                                }}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className={`
                                  w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left group
                                  ${isSubActive 
                                    ? "bg-green-50 border-2 border-green-200" 
                                    : "hover:bg-gray-50 border-2 border-transparent"
                                  }
                                `}
                                role="menuitem"
                              >
                                <div className={`
                                  p-2 rounded-lg flex-shrink-0 transition-all
                                  ${isSubActive ? "bg-green-600 shadow-md" : "bg-gray-100 group-hover:bg-green-100"}
                                `}>
                                  <SubIcon className={`h-4 w-4 ${isSubActive ? "text-white" : "text-gray-600 group-hover:text-green-600"}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className={`text-sm font-semibold ${isSubActive ? "text-green-700" : "text-gray-900"}`}>
                                      {getLabel(subItem)}
                                    </span>
                                    {subItem.badge && (
                                      <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                                        {subItem.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  {subItem.description && (
                                    <p className="text-xs text-gray-600">
                                      {getDescription(subItem)}
                                    </p>
                                  )}
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all relative group"
              title={language === "en" ? "Search (⌘K)" : "Tafuta (⌘K)"}
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>

            {/* Notifications */}
            <button
              onClick={() => onNavigate("notifications")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all relative"
              aria-label={language === "en" ? "Notifications" : "Arifa"}
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <div className="p-1.5 bg-green-100 rounded-full">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{userName}</span>
                <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden"
                  >
                    <div className="p-3 bg-green-50 border-b-2 border-green-100">
                      <p className="text-sm font-semibold text-gray-900">{userName}</p>
                      <p className="text-xs text-gray-600">{userRole}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          onNavigate("profile");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-all text-left"
                      >
                        <User className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{language === "en" ? "My Profile" : "Wasifu Wangu"}</span>
                      </button>
                      <button
                        onClick={() => {
                          onNavigate("profile");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-all text-left"
                      >
                        <Settings className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{language === "en" ? "Settings" : "Mipangilio"}</span>
                      </button>
                      <div className="my-2 border-t border-gray-200"></div>
                      <button
                        onClick={() => console.log("Logout")}
                        className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg transition-all text-left text-red-600"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm">{language === "en" ? "Sign Out" : "Toka"}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Search Bar Expanded */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-gray-200"
            >
              <div className="py-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === "en" ? "Search pages, features... (⌘K)" : "Tafuta kurasa, huduma... (⌘K)"}
                    className="pl-10 bg-gray-50 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
