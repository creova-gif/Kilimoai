import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Sparkles, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
  ShoppingCart,
  Leaf,
  Clock,
  ArrowRight,
  Zap
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface PersonalizedRecommendationsProps {
  userId: string;
  apiBase: string;
  authToken: string;
  onNavigate?: (tab: string) => void;
  language?: "en" | "sw";
}

export function PersonalizedRecommendations({ 
  userId, 
  apiBase, 
  authToken, 
  onNavigate,
  language = "en" 
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    loadRecommendations();
  }, [userId]);

  const loadRecommendations = async () => {
    setLoading(true);
    
    try {
      const url = `${apiBase}/advisory/personalized`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const responseText = await response.text();

      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        setRecommendations(null);
        setLoading(false);
        return;
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        setRecommendations(null);
        setLoading(false);
        return;
      }

      if (data.success) {
        setRecommendations(data.recommendations);
      } else {
        setRecommendations(null);
      }
    } catch (error) {
      console.error("Recommendations load error:", error);
      setRecommendations(null);
    } finally {
      setLoading(false);
    }
  };

  const getMockRecommendations = () => {
    return {
      urgent: [
        {
          title: "Fertilizer Application Recommended",
          description: "Based on your Maize growth stage, apply top-dressing fertilizer this week",
          priority: "high",
          category: "Crop Care",
          actionable: true,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          impact: "High yield boost expected",
        },
        {
          title: "Pest Alert: Fall Armyworm Detected",
          description: "Recent reports in your region. Inspect your crops and apply preventive measures",
          priority: "high",
          category: "Pest Control",
          actionable: true,
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          impact: "Prevent 30% yield loss",
        }
      ],
      seasonal: [
        {
          title: "Prepare for Short Rains",
          description: "October-December planting season approaching. Prepare your land now",
          priority: "medium",
          category: "Planning",
          actionable: true,
          impact: "Better soil preparation",
        },
        {
          title: "Soil Testing Recommended",
          description: "Test your soil before the next planting season for optimal fertilizer planning",
          priority: "medium",
          category: "Soil Health",
          actionable: true,
          impact: "Save 20% on fertilizer costs",
        }
      ],
      market: [
        {
          title: "Maize Prices Rising",
          description: "Market analysis shows 8% price increase in your region. Good time to sell",
          priority: "medium",
          category: "Market Opportunity",
          actionable: true,
          impact: "+8% profit opportunity",
        },
        {
          title: "High Demand for Beans",
          description: "Consider diversifying with beans - current prices are favorable",
          priority: "low",
          category: "Market Insight",
          actionable: false,
          impact: "Diversification benefit",
        }
      ],
    };
  };

  const handleAction = (recommendation: any) => {
    if (!onNavigate) {
      toast.info("Navigation not available");
      return;
    }

    const { title, category, description } = recommendation;

    if (category === "Pest Control" || title.toLowerCase().includes("pest") || title.toLowerCase().includes("disease")) {
      toast.success("Opening Crop Diagnosis Tool...");
      onNavigate("diagnosis");
    } else if (category === "Crop Care" && (title.toLowerCase().includes("fertilizer") || title.toLowerCase().includes("spray"))) {
      toast.success("Opening Input Supply Chain...");
      onNavigate("input-supply");
    } else if (category === "Market Opportunity" || category === "Market Insight") {
      toast.success("Opening Market Prices...");
      onNavigate("market");
    } else if (title.toLowerCase().includes("sell") || description.toLowerCase().includes("sell")) {
      toast.success("Opening Marketplace...");
      onNavigate("marketplace");
    } else if (category === "Planning" || category === "Seasonal") {
      toast.success("Opening Crop Planning...");
      onNavigate("crop-planning");
    } else if (category === "Soil Health" || title.toLowerCase().includes("soil")) {
      toast.success("Opening Soil Testing Service...");
      onNavigate("soil-test");
    } else {
      toast.success("Opening AI Assistant for guidance...");
      onNavigate("ai-chat");
    }
  };

  // Translations
  const text = {
    title: language === "en" ? "Your Action Plan" : "Mpango Wako wa Vitendo",
    subtitle: language === "en" ? "AI-powered tasks, sorted by priority" : "Kazi zinazotumia AI, zimepangwa kwa kipaumbele",
    urgent: language === "en" ? "Urgent" : "Ya Haraka",
    seasonal: language === "en" ? "Seasonal" : "Msimu",
    market: language === "en" ? "Market" : "Soko",
    all: language === "en" ? "All" : "Zote",
    takeAction: language === "en" ? "Take Action" : "Chukua Hatua",
    viewDetails: language === "en" ? "View Details" : "Tazama Maelezo",
    daysLeft: language === "en" ? "days left" : "siku zimesalia",
    impact: language === "en" ? "Impact" : "Athari",
    nothingUrgent: language === "en" ? "All caught up!" : "Umefanikiwa!",
    nothingUrgentDesc: language === "en" ? "No urgent actions needed" : "Hakuna hatua za haraka zinazohitajika",
    loading: language === "en" ? "Loading your recommendations..." : "Inapakia mapendekezo yako...",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{text.loading}</p>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl">
          <AlertCircle className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">
              {language === "en" ? "Could not load recommendations" : "Imeshindwa kupakia mapendekezo"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {language === "en" 
                ? "Please check your connection and try again." 
                : "Tafadhali angalia muunganisho wako na ujaribu tena."}
            </p>
          </div>
          <button
            onClick={loadRecommendations}
            className="text-sm text-[#2E7D32] font-medium hover:underline flex-shrink-0"
          >
            {language === "en" ? "Retry" : "Jaribu Tena"}
          </button>
        </div>
      </div>
    );
  }

  const allRecommendations = [
    ...(recommendations?.urgent || []).map((r: any) => ({ ...r, type: "urgent" })),
    ...(recommendations?.seasonal || []).map((r: any) => ({ ...r, type: "seasonal" })),
    ...(recommendations?.market || []).map((r: any) => ({ ...r, type: "market" })),
  ].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  const filteredRecommendations = activeFilter === "all" 
    ? allRecommendations 
    : allRecommendations.filter(r => r.type === activeFilter);

  const urgentCount = recommendations?.urgent?.length || 0;
  const seasonalCount = recommendations?.seasonal?.length || 0;
  const marketCount = recommendations?.market?.length || 0;

  const getTimeLeft = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "urgent": return Flame;
      case "seasonal": return Leaf;
      case "market": return TrendingUp;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section - Task-Driven Header */}
      <div className="bg-[#2E7D32] rounded-2xl p-6 md:p-8 text-white shadow-md">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{text.title}</h1>
              <p className="text-white/90 text-sm mt-1">{text.subtitle}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="h-4 w-4 text-white/80" />
                <span className="text-xs text-white/80 uppercase tracking-wider">{text.urgent}</span>
              </div>
              <p className="text-2xl font-bold">{urgentCount}</p>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-white/80" />
                <span className="text-xs text-white/80 uppercase tracking-wider">{text.market}</span>
              </div>
              <p className="text-2xl font-bold">{marketCount}</p>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="h-4 w-4 text-white/80" />
                <span className="text-xs text-white/80 uppercase tracking-wider">{text.seasonal}</span>
              </div>
              <p className="text-2xl font-bold">{seasonalCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Pills - Mobile First */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveFilter("all")}
          className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all ${
            activeFilter === "all"
              ? "bg-[#2E7D32] text-white shadow-lg scale-105"
              : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#2E7D32]"
          }`}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {text.all}
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeFilter === "all" ? "bg-white/20" : "bg-gray-100"
            }`}>
              {allRecommendations.length}
            </span>
          </span>
        </button>

        <button
          onClick={() => setActiveFilter("urgent")}
          className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all ${
            activeFilter === "urgent"
              ? "bg-[#2E7D32] text-white shadow-lg scale-105"
              : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-400"
          }`}
        >
          <span className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            {text.urgent}
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeFilter === "urgent" ? "bg-white/20" : "bg-gray-100 text-gray-700"
            }`}>
              {urgentCount}
            </span>
          </span>
        </button>

        <button
          onClick={() => setActiveFilter("market")}
          className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all ${
            activeFilter === "market"
              ? "bg-[#2E7D32] text-white shadow-lg scale-105"
              : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-400"
          }`}
        >
          <span className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {text.market}
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeFilter === "market" ? "bg-white/20" : "bg-gray-100 text-gray-700"
            }`}>
              {marketCount}
            </span>
          </span>
        </button>

        <button
          onClick={() => setActiveFilter("seasonal")}
          className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all ${
            activeFilter === "seasonal"
              ? "bg-[#2E7D32] text-white shadow-lg scale-105"
              : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-400"
          }`}
        >
          <span className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            {text.seasonal}
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeFilter === "seasonal" ? "bg-white/20" : "bg-gray-100 text-gray-700"
            }`}>
              {seasonalCount}
            </span>
          </span>
        </button>
      </div>

      {/* Recommendations List - Clean & Scannable */}
      <div className="space-y-3">
        {filteredRecommendations.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-200">
            <CardContent className="py-12 text-center">
              <div className="h-16 w-16 bg-[#2E7D32]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-[#2E7D32]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{text.nothingUrgent}</h3>
              <p className="text-sm text-gray-600">{text.nothingUrgentDesc}</p>
            </CardContent>
          </Card>
        ) : (
          filteredRecommendations.map((rec, index) => {
            const Icon = getIconForType(rec.type);
            const isUrgent = rec.priority === "high";
            const daysLeft = rec.dueDate ? getTimeLeft(rec.dueDate) : null;

            return (
              <Card 
                key={index} 
                className="border-2 border-gray-200 bg-white transition-all hover:shadow-md hover:scale-[1.01]"
              >
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center ${
                      isUrgent ? "bg-[#2E7D32]/10" : "bg-gray-100"
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        isUrgent ? "text-[#2E7D32]" : "text-gray-600"
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-base mb-1 leading-tight">
                            {rec.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {rec.description}
                          </p>
                        </div>
                        {daysLeft !== null && daysLeft <= 5 && (
                          <Badge 
                            variant="secondary" 
                            className="flex-shrink-0 bg-gray-100 text-gray-700 border-gray-300"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {daysLeft}d
                          </Badge>
                        )}
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          {rec.impact && (
                            <div className="flex items-center gap-1.5 text-xs">
                              <Sparkles className="h-3.5 w-3.5 text-[#2E7D32]" />
                              <span className="text-gray-700 font-medium">{rec.impact}</span>
                            </div>
                          )}
                          {rec.category && (
                            <Badge variant="outline" className="text-xs font-normal">
                              {rec.category}
                            </Badge>
                          )}
                        </div>

                        {rec.actionable && (
                          <Button
                            size="sm"
                            onClick={() => handleAction(rec)}
                            className="bg-[#2E7D32] hover:bg-[#1B5E20] shadow-md"
                          >
                            {text.takeAction}
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

PersonalizedRecommendations.displayName = "PersonalizedRecommendations";
