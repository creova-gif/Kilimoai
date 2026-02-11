import { useState } from "react";
import {
  Sprout, Calendar, Droplet, Bug, TrendingUp, AlertTriangle,
  CheckCircle, ThermometerSun, Cloud, Leaf, Beaker, ShoppingCart,
  FileText, ChevronRight, Clock, Target, Zap, Info, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface CropSpecificTipsProps {
  language: "en" | "sw";
  userId: string;
  onNavigate?: (tab: string, data?: any) => void;
}

interface Crop {
  id: string;
  name: string;
  color: string;
}

interface Tip {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: "planting" | "watering" | "pest" | "harvest" | "fertilizer";
  timing: string;
  actionable: boolean;
  linkedService?: string;
  icon: any;
}

interface MicroMetric {
  label: string;
  value: string;
  status: "good" | "warning" | "critical";
  icon: any;
}

export function CropSpecificTips({ language, userId, onNavigate }: CropSpecificTipsProps) {
  const [selectedCrop, setSelectedCrop] = useState<string>("maize");
  const [selectedSeason, setSelectedSeason] = useState<string>("current");

  const crops: Crop[] = [
    { id: "maize", name: language === "en" ? "Maize" : "Mahindi", color: "yellow" },
    { id: "rice", name: language === "en" ? "Rice" : "Mchele", color: "green" },
    { id: "beans", name: language === "en" ? "Beans" : "Maharagwe", color: "red" },
    { id: "tomatoes", name: language === "en" ? "Tomatoes" : "Nyanya", color: "red" },
    { id: "cassava", name: language === "en" ? "Cassava" : "Muhogo", color: "orange" },
    { id: "sunflower", name: language === "en" ? "Sunflower" : "Alizeti", color: "yellow" }
  ];

  const seasons = [
    { id: "current", label: language === "en" ? "Current Season" : "Msimu wa Sasa" },
    { id: "upcoming", label: language === "en" ? "Upcoming" : "Inayokuja" },
    { id: "all", label: language === "en" ? "All Year" : "Mwaka Mzima" }
  ];

  // Mock tips for selected crop
  const cropTips: Tip[] = [
    {
      id: "tip-001",
      title: language === "en" ? "Optimal Planting Window" : "Wakati Bora wa Kupanda",
      description: language === "en"
        ? "Plant maize now for best yields. Soil temperature is ideal (18-25°C) and rains are expected."
        : "Panda mahindi sasa kwa mavuno bora. Joto la udongo ni bora (18-25°C) na mvua inatarajiwa.",
      priority: "high",
      category: "planting",
      timing: language === "en" ? "Next 2 weeks" : "Wiki 2 zijazo",
      actionable: true,
      linkedService: "inputs",
      icon: Calendar
    },
    {
      id: "tip-002",
      title: language === "en" ? "Pest Alert: Fall Armyworm" : "Tahadhari: Wadudu wa Fall Armyworm",
      description: language === "en"
        ? "High risk period for armyworm. Scout your fields daily and consider early treatment."
        : "Kipindi cha hatari ya juu cha wadudu. Kagua shamba lako kila siku na fikiria matibabu mapema.",
      priority: "high",
      category: "pest",
      timing: language === "en" ? "Immediate" : "Haraka",
      actionable: true,
      linkedService: "diagnostics",
      icon: Bug
    },
    {
      id: "tip-003",
      title: language === "en" ? "Water Management" : "Usimamizi wa Maji",
      description: language === "en"
        ? "Reduce watering as crop enters flowering stage. Overwatering now can reduce yields."
        : "Punguza kumwagilia mazao yanapoingia hatua ya maua. Kumwagilia kupita kiasi sasa kunaweza kupunguza mavuno.",
      priority: "medium",
      category: "watering",
      timing: language === "en" ? "This week" : "Wiki hii",
      actionable: false,
      icon: Droplet
    },
    {
      id: "tip-004",
      title: language === "en" ? "Fertilizer Application" : "Matumizi ya Mbolea",
      description: language === "en"
        ? "Apply top-dressing fertilizer (CAN or Urea) at 45 days after planting for maximum yield."
        : "Tumia mbolea ya juu (CAN au Urea) siku 45 baada ya kupanda kwa mavuno ya juu.",
      priority: "medium",
      category: "fertilizer",
      timing: language === "en" ? "In 10 days" : "Baada ya siku 10",
      actionable: true,
      linkedService: "inputs",
      icon: Beaker
    },
    {
      id: "tip-005",
      title: language === "en" ? "Harvest Preparation" : "Maandalizi ya Mavuno",
      description: language === "en"
        ? "Start preparing storage and drying facilities. Harvest expected in 30-40 days."
        : "Anza kuandaa hifadhi na vifaa vya kukausha. Mavuno yanatarajiwa baada ya siku 30-40.",
      priority: "low",
      category: "harvest",
      timing: language === "en" ? "In 30 days" : "Baada ya siku 30",
      actionable: false,
      icon: Target
    }
  ];

  // Micro-metrics for current crop
  const microMetrics: MicroMetric[] = [
    {
      label: language === "en" ? "Growth Stage" : "Hatua ya Ukuaji",
      value: language === "en" ? "Flowering" : "Maua",
      status: "good",
      icon: Sprout
    },
    {
      label: language === "en" ? "Soil Moisture" : "Unyevu wa Udongo",
      value: "65%",
      status: "good",
      icon: Droplet
    },
    {
      label: language === "en" ? "Pest Risk" : "Hatari ya Wadudu",
      value: language === "en" ? "High" : "Juu",
      status: "warning",
      icon: Bug
    },
    {
      label: language === "en" ? "Weather" : "Hali ya Hewa",
      value: language === "en" ? "Favorable" : "Nzuri",
      status: "good",
      icon: Cloud
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" };
      case "medium": return { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500" };
      case "low": return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-500" };
      default: return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-500" };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return { bg: "bg-green-100", text: "text-green-700", icon: "text-green-600" };
      case "warning": return { bg: "bg-yellow-100", text: "text-yellow-700", icon: "text-yellow-600" };
      case "critical": return { bg: "bg-red-100", text: "text-red-700", icon: "text-red-600" };
      default: return { bg: "bg-gray-100", text: "text-gray-700", icon: "text-gray-600" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-[#2E7D32] text-white px-4 lg:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Leaf className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {language === "en" ? "Crop-Specific Tips" : "Vidokezo vya Mazao"}
              </h1>
              <p className="text-green-100 text-sm">
                {language === "en" 
                  ? "Personalized guidance for your crops"
                  : "Mwongozo wa kibinafsi kwa mazao yako"}
              </p>
            </div>
          </div>

          {/* Crop Selector */}
          <div className="mt-6">
            <p className="text-sm text-white/80 mb-3">
              {language === "en" ? "Select your crop:" : "Chagua zao lako:"}
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {crops.map((crop) => (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedCrop === crop.id
                      ? "bg-white/20 border-white backdrop-blur-sm"
                      : "bg-white/10 border-white/20 hover:bg-white/15"
                  }`}
                >
                  <div className="mb-2">
                    <Sprout className="h-8 w-8 mx-auto" />
                  </div>
                  <div className="text-xs font-medium">{crop.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 -mt-4">
        <div className="space-y-6">
          {/* Micro-Metrics Dashboard */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-gray-700" />
              {language === "en" ? "Current Status" : "Hali ya Sasa"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {microMetrics.map((metric) => {
                const colors = getStatusColor(metric.status);
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className={`${colors.bg} rounded-xl p-4 border-2 ${colors.bg.replace('100', '200')}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`h-5 w-5 ${colors.icon}`} />
                      <span className="text-xs font-medium text-gray-600">{metric.label}</span>
                    </div>
                    <div className={`text-xl font-bold ${colors.text}`}>{metric.value}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Season Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2">
              {seasons.map((season) => {
                const isActive = selectedSeason === season.id;
                return (
                  <button
                    key={season.id}
                    onClick={() => setSelectedSeason(season.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {season.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tips List - Decision Aid Format */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                {language === "en" ? "Recommended Actions" : "Hatua Zinazopendekezwa"}
              </h2>
              <Badge className="bg-green-100 text-green-700 border-green-200 border-2">
                {cropTips.length} {language === "en" ? "active tips" : "vidokezo vya sasa"}
              </Badge>
            </div>

            <div className="space-y-4">
              {cropTips.map((tip) => {
                const priority = getPriorityColor(tip.priority);
                const Icon = tip.icon;

                return (
                  <Card key={tip.id} className={`border-2 ${priority.border} hover:shadow-md transition-all`}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`p-3 ${priority.bg} rounded-xl flex-shrink-0`}>
                          <Icon className={`h-6 w-6 ${priority.text}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-bold text-gray-900">{tip.title}</h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className={`w-2 h-2 rounded-full ${priority.dot} animate-pulse`}></div>
                              <Badge variant="outline" className={`${priority.text} ${priority.border} border text-xs`}>
                                {tip.priority.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 mb-3">{tip.description}</p>

                          {/* Timing */}
                          <div className="flex items-center gap-2 mb-3">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-600">
                              {language === "en" ? "Timing:" : "Muda:"} <span className={priority.text}>{tip.timing}</span>
                            </span>
                          </div>

                          {/* Action Buttons */}
                          {tip.actionable && (
                            <div className="flex flex-wrap gap-2">
                              {tip.linkedService === "inputs" && (
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => onNavigate && onNavigate("inputs")}
                                >
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  {language === "en" ? "Buy Inputs" : "Nunua Vifaa"}
                                </Button>
                              )}
                              {tip.linkedService === "diagnostics" && (
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => onNavigate && onNavigate("diagnostics")}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  {language === "en" ? "Get Diagnosis" : "Pata Uchunguzi"}
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-2"
                              >
                                <Info className="h-4 w-4 mr-2" />
                                {language === "en" ? "Learn More" : "Jifunze Zaidi"}
                              </Button>
                            </div>
                          )}

                          {!tip.actionable && (
                            <div className={`flex items-center gap-2 p-3 ${priority.bg} rounded-lg`}>
                              <Info className={`h-4 w-4 ${priority.text}`} />
                              <span className={`text-sm font-medium ${priority.text}`}>
                                {language === "en" ? "Monitor and prepare" : "Fuatilia na jiandae"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Quick Links to Related Services */}
          <div className="bg-green-50 rounded-xl border-2 border-green-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-green-600" />
              {language === "en" ? "Related Services" : "Huduma Zinazohusiana"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => onNavigate && onNavigate("diagnostics")}
                className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-all group"
              >
                <FileText className="h-6 w-6 text-gray-700" />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900 text-sm">
                    {language === "en" ? "Crop Diagnostics" : "Uchunguzi wa Mazao"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {language === "en" ? "Identify issues" : "Tambua matatizo"}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => onNavigate && onNavigate("soil-testing")}
                className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-all group"
              >
                <Beaker className="h-6 w-6 text-orange-600" />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900 text-sm">
                    {language === "en" ? "Soil Testing" : "Upimaji wa Udongo"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {language === "en" ? "Test your soil" : "Pima udongo wako"}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => onNavigate && onNavigate("inputs")}
                className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 rounded-xl border-2 border-green-200 hover:border-green-300 transition-all group"
              >
                <ShoppingCart className="h-6 w-6 text-green-600" />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900 text-sm">
                    {language === "en" ? "Input Marketplace" : "Soko la Vifaa"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {language === "en" ? "Buy supplies" : "Nunua vifaa"}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}