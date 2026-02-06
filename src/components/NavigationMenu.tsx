import { useState, useEffect, useRef } from "react";
import {
  Menu, X, Search, ChevronDown, ChevronRight, Home, GraduationCap,
  Users, ShoppingCart, FileText, MessageCircle, Beaker, Shield,
  HelpCircle, Settings, Video, BookOpen, Sprout, FlaskConical,
  Trophy, Award, HeadphonesIcon, Phone, Mail, User, LogOut,
  Bell, Wallet, TrendingUp, Calendar, Target, Zap, Star,
  Package, Truck, BadgeCheck, BookMarked, Lightbulb
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";

interface NavigationMenuProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: "farmer" | "expert" | "admin";
  language: "en" | "sw";
  isMobile?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  labelSw: string;
  icon: any;
  page?: string;
  subPages?: SubPage[];
  badge?: string;
  newFeature?: boolean;
  roles?: ("farmer" | "expert" | "admin")[];
}

interface SubPage {
  id: string;
  label: string;
  labelSw: string;
  page: string;
  icon?: any;
  badge?: string;
  newFeature?: boolean;
}

export function NavigationMenu({ 
  currentPage, 
  onNavigate, 
  userRole, 
  language,
  isMobile = false 
}: NavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  // Menu structure
  const menuItems: MenuItem[] = [
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
      subPages: [
        {
          id: "learning-home",
          label: "Learning Center",
          labelSw: "Kituo cha Kujifunza",
          page: "learning-home",
          icon: BookMarked
        },
        {
          id: "videos",
          label: "Video Tutorials",
          labelSw: "Mafunzo ya Video",
          page: "videos",
          icon: Video
        },
        {
          id: "knowledge",
          label: "Knowledge Base",
          labelSw: "Hifadhi ya Ujuzi",
          page: "knowledge",
          icon: BookOpen
        },
        {
          id: "crop-tips",
          label: "Crop-Specific Tips",
          labelSw: "Vidokezo vya Mazao",
          page: "crop-tips",
          icon: Sprout
        },
        {
          id: "farmer-lab",
          label: "Farmer Lab",
          labelSw: "Maabara ya Mkulima",
          page: "farmer-lab",
          icon: FlaskConical
        },
        {
          id: "courses",
          label: "Training Courses",
          labelSw: "Kozi za Mafunzo",
          page: "courses",
          icon: Trophy,
          newFeature: true
        }
      ]
    },
    {
      id: "community",
      label: "Community",
      labelSw: "Jamii",
      icon: Users,
      subPages: [
        {
          id: "discussions",
          label: "Discussion Groups",
          labelSw: "Vikundi vya Majadiliano",
          page: "discussions",
          icon: MessageCircle
        },
        {
          id: "achievements",
          label: "Achievements",
          labelSw: "Mafanikio",
          page: "gamification",
          icon: Award
        }
      ]
    },
    {
      id: "marketplace",
      label: "Marketplace",
      labelSw: "Soko",
      icon: ShoppingCart,
      subPages: [
        {
          id: "market-prices",
          label: "Market Prices",
          labelSw: "Bei za Soko",
          page: "market",
          icon: TrendingUp
        },
        {
          id: "input-supply",
          label: "Input Supply",
          labelSw: "Ugavi wa Vifaa",
          page: "inputs",
          icon: Package
        },
        {
          id: "my-orders",
          label: "My Orders",
          labelSw: "Maagizo Yangu",
          page: "orders",
          icon: Truck
        }
      ]
    },
    {
      id: "contract-farming",
      label: "Contract Farming",
      labelSw: "Ukulima wa Mikataba",
      icon: FileText,
      page: "contracts"
    },
    {
      id: "services",
      label: "Services",
      labelSw: "Huduma",
      icon: Zap,
      subPages: [
        {
          id: "expert-consultation",
          label: "Expert Consultation",
          labelSw: "Ushauri wa Mtaalamu",
          page: "expert-consultation",
          icon: MessageCircle
        },
        {
          id: "soil-testing",
          label: "Soil Testing",
          labelSw: "Upimaji wa Udongo",
          page: "soil-testing",
          icon: Beaker
        },
        {
          id: "insurance",
          label: "Insurance Hub",
          labelSw: "Kituo cha Bima",
          page: "insurance",
          icon: Shield,
          badge: "New"
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
      label: "Help & Support",
      labelSw: "Msaada na Usaidizi",
      icon: HelpCircle,
      subPages: [
        {
          id: "support-tickets",
          label: "Support Tickets",
          labelSw: "Tiketi za Msaada",
          page: "support-tickets",
          icon: HeadphonesIcon
        },
        {
          id: "contact",
          label: "Contact Us",
          labelSw: "Wasiliana Nasi",
          page: "contact",
          icon: Phone
        },
        {
          id: "faq",
          label: "FAQs",
          labelSw: "Maswali ya Kawaida",
          page: "faq",
          icon: Lightbulb
        }
      ]
    },
    {
      id: "settings",
      label: "Settings",
      labelSw: "Mipangilio",
      icon: Settings,
      page: "profile"
    }
  ];

  // Filter menu items by role
  const visibleMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  // Search functionality
  const searchResults = searchQuery.trim() 
    ? visibleMenuItems.flatMap(item => {
        const matches: { item: MenuItem; subPage?: SubPage }[] = [];
        
        // Check main item
        if (
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.labelSw.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          matches.push({ item });
        }
        
        // Check subpages
        item.subPages?.forEach(subPage => {
          if (
            subPage.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subPage.labelSw.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            matches.push({ item, subPage });
          }
        });
        
        return matches;
      })
    : [];

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Handle navigation
  const handleNavigate = (page: string) => {
    onNavigate(page);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Auto-expand section containing current page
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.subPages?.some(sub => sub.page === currentPage)) {
        if (!expandedSections.includes(item.id)) {
          setExpandedSections(prev => [...prev, item.id]);
        }
      }
    });
  }, [currentPage]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen && isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMobile]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Persist expanded state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("nav-expanded-sections");
    if (saved) {
      try {
        setExpandedSections(JSON.parse(saved));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("nav-expanded-sections", JSON.stringify(expandedSections));
  }, [expandedSections]);

  // Get label based on language
  const getLabel = (item: MenuItem | SubPage) => {
    return language === "sw" ? item.labelSw : item.label;
  };

  // Check if page is active
  const isActive = (page?: string) => page === currentPage;

  // Check if section has active subpage
  const hasActiveSubpage = (item: MenuItem) => 
    item.subPages?.some(sub => sub.page === currentPage);

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-green-400 hover:shadow-xl transition-all active:scale-95"
          aria-label={language === "en" ? "Open menu" : "Fungua menyu"}
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6 text-gray-700" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      )}

      {/* Menu Overlay (Mobile) */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Menu Panel */}
      <AnimatePresence>
        {(!isMobile || isOpen) && (
          <motion.div
            ref={menuRef}
            initial={isMobile ? { x: "-100%" } : false}
            animate={isMobile ? { x: 0 } : false}
            exit={isMobile ? { x: "-100%" } : false}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`
              ${isMobile 
                ? "fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-50" 
                : "relative w-full bg-white border-b-2 border-gray-200"
              }
            `}
            role="navigation"
            aria-label={language === "en" ? "Main navigation" : "Urambazaji mkuu"}
          >
            <div className={`flex flex-col h-full ${isMobile ? "" : "max-w-7xl mx-auto"}`}>
              {/* Header */}
              <div className={`
                flex items-center justify-between p-4 border-b-2 border-gray-200
                ${isMobile ? "bg-gradient-to-r from-green-600 to-emerald-600" : ""}
              `}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isMobile ? "bg-white/20" : "bg-green-100"}`}>
                    <Sprout className={`h-6 w-6 ${isMobile ? "text-white" : "text-green-600"}`} />
                  </div>
                  <div>
                    <h2 className={`font-bold text-lg ${isMobile ? "text-white" : "text-gray-900"}`}>
                      KILIMO
                    </h2>
                    <p className={`text-xs ${isMobile ? "text-green-100" : "text-gray-600"}`}>
                      {language === "en" ? "Agri-AI Suite" : "Mfumo wa AI-Kilimo"}
                    </p>
                  </div>
                </div>
                {isMobile && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                    aria-label={language === "en" ? "Close menu" : "Funga menyu"}
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                )}
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === "en" ? "Search menu..." : "Tafuta menyu..."}
                    className="pl-9 bg-gray-50 border-gray-200 focus:border-green-400 focus:ring-green-400"
                    aria-label={language === "en" ? "Search navigation" : "Tafuta urambazaji"}
                  />
                </div>

                {/* Search Results */}
                {searchQuery && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto"
                  >
                    {searchResults.map(({ item, subPage }, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleNavigate(subPage?.page || item.page || "")}
                        className="w-full flex items-center gap-3 p-3 hover:bg-green-50 transition-all text-left border-b border-gray-100 last:border-0 group"
                      >
                        <item.icon className="h-4 w-4 text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <div className="flex-1 min-w-0">
                          {subPage ? (
                            <>
                              <div className="text-xs text-gray-500">{getLabel(item)}</div>
                              <div className="text-sm font-medium text-gray-900">{getLabel(subPage)}</div>
                            </>
                          ) : (
                            <div className="text-sm font-medium text-gray-900">{getLabel(item)}</div>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </motion.div>
                )}

                {searchQuery && searchResults.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-center text-sm text-gray-500"
                  >
                    {language === "en" ? "No results found" : "Hakuna matokeo"}
                  </motion.div>
                )}
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto p-2" role="menu">
                <div className="space-y-1">
                  {visibleMenuItems.map((item) => {
                    const isExpanded = expandedSections.includes(item.id);
                    const hasSubPages = item.subPages && item.subPages.length > 0;
                    const isItemActive = isActive(item.page) || hasActiveSubpage(item);
                    const ItemIcon = item.icon;

                    return (
                      <div key={item.id} role="none">
                        {/* Main Item */}
                        <button
                          onClick={() => {
                            if (hasSubPages) {
                              toggleSection(item.id);
                            } else if (item.page) {
                              handleNavigate(item.page);
                            }
                          }}
                          className={`
                            w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                            transition-all group relative
                            ${isItemActive 
                              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 shadow-sm" 
                              : "hover:bg-gray-50 border-2 border-transparent hover:border-gray-200"
                            }
                          `}
                          role="menuitem"
                          aria-expanded={hasSubPages ? isExpanded : undefined}
                          aria-haspopup={hasSubPages ? "menu" : undefined}
                        >
                          {/* Active Indicator */}
                          {isItemActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute left-0 top-0 bottom-0 w-1 bg-green-600 rounded-r-full"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}

                          <div className="flex items-center gap-3 flex-1">
                            <div className={`
                              p-2 rounded-lg transition-all
                              ${isItemActive 
                                ? "bg-green-600 text-white shadow-md" 
                                : "bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600"
                              }
                            `}>
                              <ItemIcon className="h-5 w-5" />
                            </div>
                            <span className={`
                              text-sm font-medium
                              ${isItemActive ? "text-green-700 font-semibold" : "text-gray-700"}
                            `}>
                              {getLabel(item)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.badge && (
                              <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                                {item.badge}
                              </Badge>
                            )}
                            {item.newFeature && (
                              <Badge className="bg-blue-500 text-white text-xs px-2 py-0.5">
                                {language === "en" ? "New" : "Mpya"}
                              </Badge>
                            )}
                            {hasSubPages && (
                              <ChevronDown className={`
                                h-4 w-4 text-gray-400 transition-transform duration-200
                                ${isExpanded ? "rotate-180" : ""}
                              `} />
                            )}
                          </div>
                        </button>

                        {/* Subpages */}
                        <AnimatePresence>
                          {hasSubPages && isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                              role="menu"
                            >
                              <div className="ml-6 mt-1 space-y-1 border-l-2 border-green-200 pl-2">
                                {item.subPages!.map((subPage) => {
                                  const isSubActive = isActive(subPage.page);
                                  const SubIcon = subPage.icon || ChevronRight;

                                  return (
                                    <motion.button
                                      key={subPage.id}
                                      onClick={() => handleNavigate(subPage.page)}
                                      initial={{ x: -10, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ duration: 0.2 }}
                                      className={`
                                        w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg
                                        transition-all text-left group
                                        ${isSubActive 
                                          ? "bg-green-50 border-2 border-green-200 text-green-700 shadow-sm" 
                                          : "hover:bg-gray-50 border-2 border-transparent text-gray-600 hover:border-gray-200"
                                        }
                                      `}
                                      role="menuitem"
                                    >
                                      <div className="flex items-center gap-2 flex-1">
                                        <SubIcon className={`
                                          h-4 w-4 transition-colors
                                          ${isSubActive ? "text-green-600" : "text-gray-400 group-hover:text-green-500"}
                                        `} />
                                        <span className="text-sm font-medium">{getLabel(subPage)}</span>
                                      </div>
                                      {subPage.badge && (
                                        <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                                          {subPage.badge}
                                        </Badge>
                                      )}
                                      {subPage.newFeature && (
                                        <Badge className="bg-blue-500 text-white text-xs px-2 py-0.5">
                                          {language === "en" ? "New" : "Mpya"}
                                        </Badge>
                                      )}
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
              </nav>

              {/* Footer Actions (Mobile) */}
              {isMobile && (
                <div className="p-4 border-t-2 border-gray-200 space-y-2 bg-gray-50">
                  <Button
                    onClick={() => handleNavigate("profile")}
                    variant="outline"
                    className="w-full justify-start gap-3 border-2 hover:border-green-300 hover:bg-green-50 transition-all"
                  >
                    <User className="h-4 w-4" />
                    {language === "en" ? "My Profile" : "Wasifu Wangu"}
                  </Button>
                  <Button
                    onClick={() => handleNavigate("notifications")}
                    variant="outline"
                    className="w-full justify-start gap-3 border-2 hover:border-green-300 hover:bg-green-50 transition-all"
                  >
                    <Bell className="h-4 w-4" />
                    {language === "en" ? "Notifications" : "Arifa"}
                    <Badge className="ml-auto bg-red-500 text-white">3</Badge>
                  </Button>
                  <Button
                    onClick={() => console.log("Logout")}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    {language === "en" ? "Sign Out" : "Toka"}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
