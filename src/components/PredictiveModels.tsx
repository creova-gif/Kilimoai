import { useState, useEffect } from "react";
import { TrendingUp, AlertTriangle, DollarSign, BarChart3, Sparkles, Target, TrendingDown, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { motion } from "motion/react";

interface PredictiveModelsProps {
  userId: string;
  region?: string;
  crops?: string[];
  apiBase?: string;
  authToken?: string;
  language?: "en" | "sw";
}

const DEFAULT_API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

export function PredictiveModels({ 
  userId, 
  region = "Arusha", 
  crops = ["Maize"], 
  apiBase, 
  authToken, 
  language = "en" 
}: PredictiveModelsProps) {
  const API_BASE = apiBase || DEFAULT_API_BASE;
  const AUTH_TOKEN = authToken || publicAnonKey;
  
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState({
    yield: { value: 2800, change: 15, trend: "up" },
    disease: { risk: "Low", percentage: 12, type: "Leaf Rust" },
    price: { current: 35000, forecast: 38500, change: 10 },
  });

  const text = {
    title: language === "sw" ? "Utabiri wa AI" : "AI Predictions",
    subtitle: language === "sw" ? "Utabiri wa mavuno, bei na magonjwa" : "Yield, price & disease forecasts",
    yieldTitle: language === "sw" ? "Utabiri wa Mavuno" : "Yield Forecast",
    yieldDesc: language === "sw" ? "Kwa ekari moja" : "Per acre",
    diseaseTitle: language === "sw" ? "Hatari ya Magonjwa" : "Disease Risk",
    diseaseDesc: language === "sw" ? "30 siku zijazo" : "Next 30 days",
    priceTitle: language === "sw" ? "Utabiri wa Bei" : "Price Forecast",
    priceDesc: language === "sw" ? "Kwa gunia la kilo 100" : "Per 100kg bag",
    confidence: language === "sw" ? "Uhakika" : "Confidence",
    viewDetails: language === "sw" ? "Tazama Maelezo" : "View Details",
    kg: language === "sw" ? "kilo" : "kg",
    low: language === "sw" ? "Chini" : "Low",
    medium: language === "sw" ? "Kati" : "Medium",
    high: language === "sw" ? "Juu" : "High",
  };

  return (
    <div className="min-h-[calc(100vh-180px)] bg-gradient-to-br from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-[#2E7D32] rounded-2xl p-6 text-white shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{text.title}</h1>
                <p className="text-white/90 text-sm">{text.subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Yield Prediction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-[#2E7D32]/20 bg-gradient-to-br from-[#2E7D32] to-white hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-[#2E7D32] rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/20">
                    <Sparkles className="h-3 w-3 mr-1" />
                    92%
                  </Badge>
                </div>
                
                <h3 className="text-sm font-semibold text-gray-600 mb-1">{text.yieldTitle}</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">{predictions.yield.value}</span>
                  <span className="text-sm text-gray-600">{text.kg}/acre</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-4 w-4 text-[#2E7D32]" />
                  <span className="text-[#2E7D32] font-medium">+{predictions.yield.change}%</span>
                  <span className="text-gray-500 text-xs ml-1">vs last season</span>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-4 text-[#2E7D32] hover:bg-[#2E7D32]/10"
                >
                  {text.viewDetails}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Disease Risk */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-gray-100 text-gray-700 border-gray-300">
                    <Sparkles className="h-3 w-3 mr-1" />
                    88%
                  </Badge>
                </div>
                
                <h3 className="text-sm font-semibold text-gray-600 mb-1">{text.diseaseTitle}</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">{predictions.disease.risk}</span>
                  <span className="text-sm text-gray-600">risk</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <Target className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700 font-medium">{predictions.disease.percentage}%</span>
                  <span className="text-gray-500 text-xs ml-1">{predictions.disease.type}</span>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-4 text-gray-700 hover:bg-gray-100"
                >
                  {text.viewDetails}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Price Forecast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-gray-100 text-gray-700 border-gray-300">
                    <Sparkles className="h-3 w-3 mr-1" />
                    85%
                  </Badge>
                </div>
                
                <h3 className="text-sm font-semibold text-gray-600 mb-1">{text.priceTitle}</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">
                    {(predictions.price.forecast / 1000).toFixed(0)}k
                  </span>
                  <span className="text-sm text-gray-600">TSh</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700 font-medium">+{predictions.price.change}%</span>
                  <span className="text-gray-500 text-xs ml-1">next month</span>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-4 text-gray-700 hover:bg-gray-100"
                >
                  {text.viewDetails}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Info Card */}
        <Card className="border-2 border-gray-200">
          <CardContent className="py-4">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                  {language === "sw" ? "Jinsi Utabiri Unavyofanya Kazi" : "How Predictions Work"}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {language === "sw"
                    ? "AI inachambanua data ya hali ya hewa, udongo, na historia ya shamba lako kutoa utabiri wa uhakika. Utabiri unaboreshwa kila siku."
                    : "AI analyzes weather, soil data, and your farm history to provide accurate forecasts. Predictions improve daily."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

PredictiveModels.displayName = "PredictiveModels";
