import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown, ChevronUp, Home, Brain, Wheat, ShoppingCart,
  DollarSign, Briefcase, LineChart, BookOpen, Users, Settings,
  HelpCircle, X
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface CollapsibleNavigationProps {
  categories: Array<{ id: string; label: string; icon: any }>;
  navigationItems: Array<{ 
    id: string; 
    label: string; 
    icon: any; 
    color: string; 
    category: string; 
    badge?: string 
  }>;
  currentPage: string;
  onNavigate: (pageId: string) => void;
  onClose?: () => void;
  language: "en" | "sw";
}

export function CollapsibleNavigation({
  categories,
  navigationItems,
  currentPage,
  onNavigate,
  onClose,
  language
}: CollapsibleNavigationProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["main"]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCategoryLabel = (categoryId: string) => {
    const labels: Record<string, { en: string; sw: string }> = {
      main: { en: "Main", sw: "Kuu" },
      ai: { en: "AI Tools", sw: "Zana za AI" },
      farm: { en: "Farm Management", sw: "Usimamizi wa Shamba" },
      market: { en: "Market & Sales", sw: "Soko na Mauzo" },
      finance: { en: "Finance", sw: "Fedha" },
      services: { en: "Services", sw: "Huduma" },
      insights: { en: "Insights", sw: "Ufahamu" },
      learning: { en: "Learning", sw: "Ujifunzaji" },
      community: { en: "Community", sw: "Jamii" },
      admin: { en: "Admin", sw: "Usimamizi" },
      help: { en: "Help & Support", sw: "Msaada" },
      settings: { en: "Settings", sw: "Mipangilio" }
    };
    return labels[categoryId]?.[language] || categoryId;
  };

  const getItemLabel = (itemId: string, originalLabel: string) => {
    // Simplified translation mapping for key items
    const translations: Record<string, { en: string; sw: string }> = {
      home: { en: "Dashboard", sw: "Dashibodi" },
      "ai-chat": { en: "Sankofa AI", sw: "Sankofa AI" },
      market: { en: "Market Prices", sw: "Bei za Soko" },
      weather: { en: "Weather", sw: "Hali ya Hewa" },
      marketplace: { en: "Marketplace", sw: "Soko" },
      videos: { en: "Video Tutorials", sw: "Mafunzo ya Video" },
      knowledge: { en: "Knowledge Base", sw: "Hifadhi ya Ujuzi" },
      experts: { en: "Expert Consult", sw: "Ushauri wa Wataalamu" },
      contracts: { en: "Contract Farming", sw: "Ukulima wa Mikataba" },
      support: { en: "Support", sw: "Msaada" },
      contact: { en: "Contact Us", sw: "Wasiliana Nasi" },
      faq: { en: "FAQ", sw: "Maswali Yanayoulizwa Mara Kwa Mara" }
    };
    return translations[itemId]?.[language] || originalLabel;
  };

  // Group items by category
  const groupedItems = categories.map(category => ({
    ...category,
    items: navigationItems.filter(item => item.category === category.id)
  })).filter(category => category.items.length > 0);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">
          {language === "sw" ? "Menyu" : "Menu"}
        </h2>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation Categories */}
      <div className="flex-1 overflow-y-auto py-2">
        {groupedItems.map((category) => {
          const CategoryIcon = category.icon;
          const isExpanded = expandedCategories.includes(category.id);
          const hasActiveItem = category.items.some(item => item.id === currentPage);

          return (
            <div key={category.id} className="mb-1">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                  hasActiveItem ? "bg-green-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${
                    hasActiveItem ? "bg-green-600" : "bg-gray-100"
                  }`}>
                    <CategoryIcon className={`h-4 w-4 ${
                      hasActiveItem ? "text-white" : "text-gray-600"
                    }`} />
                  </div>
                  <span className={`text-sm font-semibold ${
                    hasActiveItem ? "text-green-700" : "text-gray-700"
                  }`}>
                    {getCategoryLabel(category.id)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {category.items.length}
                  </Badge>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </button>

              {/* Category Items */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="py-1 bg-gray-50/50">
                      {category.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isActive = item.id === currentPage;

                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              onNavigate(item.id);
                              if (onClose) onClose();
                            }}
                            className={`w-full flex items-center gap-3 px-4 pl-12 py-2.5 hover:bg-white transition-all ${
                              isActive 
                                ? "bg-green-50 border-l-4 border-green-600" 
                                : "border-l-4 border-transparent"
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg ${
                              isActive ? "bg-green-600" : "bg-white"
                            }`}>
                              <ItemIcon className={`h-3.5 w-3.5 ${
                                isActive ? "text-white" : item.color
                              }`} />
                            </div>
                            <span className={`text-sm flex-1 text-left ${
                              isActive ? "font-bold text-green-700" : "font-medium text-gray-700"
                            }`}>
                              {getItemLabel(item.id, item.label)}
                            </span>
                            {item.badge && (
                              <Badge className="bg-green-600 text-white text-xs">
                                {item.badge}
                              </Badge>
                            )}
                            {isActive && (
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            )}
                          </button>
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

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-center text-gray-500">
          {language === "sw" 
            ? `Vipengele ${navigationItems.length} vinavyopatikana` 
            : `${navigationItems.length} features available`}
        </p>
      </div>
    </div>
  );
}