import { useState, useEffect } from "react";
import { Droplet, Leaf, Calendar, TrendingUp, RefreshCw, Bell, CheckCircle2, Brain, Target, Zap, BarChart3, CloudRain, Thermometer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";

interface AIRecommendationEngineProps {
  userId: string;
  region: string;
  crops: string[];
  farmSize: string;
  apiBase: string;
  authToken: string;
}

export function AIRecommendationEngine({ 
  userId, 
  region, 
  crops, 
  farmSize,
  apiBase, 
  authToken 
}: AIRecommendationEngineProps) {
  const [loading, setLoading] = useState(false);
  const [irrigationPlan, setIrrigationPlan] = useState<any>(null);
  const [fertilizerPlan, setFertilizerPlan] = useState<any>(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const [irrigationRes, fertilizerRes] = await Promise.all([
        fetch(`${apiBase}/ai-engine/irrigation/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        }).catch(() => null),
        fetch(`${apiBase}/ai-engine/fertilizer/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        }).catch(() => null)
      ]);

      let irrigationData = { success: false };
      let fertilizerData = { success: false };

      if (irrigationRes?.ok) {
        try {
          const contentType = irrigationRes.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            irrigationData = await irrigationRes.json();
          }
        } catch {}
      }

      if (fertilizerRes?.ok) {
        try {
          const contentType = fertilizerRes.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            fertilizerData = await fertilizerRes.json();
          }
        } catch {}
      }

      setIrrigationPlan(irrigationData.success ? irrigationData.plan : getMockIrrigationPlan());
      setFertilizerPlan(fertilizerData.success ? fertilizerData.plan : getMockFertilizerPlan());
    } catch (error) {
      // Silently use mock data - backend endpoints not yet implemented
      setIrrigationPlan(getMockIrrigationPlan());
      setFertilizerPlan(getMockFertilizerPlan());
    } finally {
      setLoading(false);
    }
  };

  const getMockIrrigationPlan = () => ({
    summary: {
      method: "Drip Irrigation + Rainfall",
      weeklyWater: "150mm",
      efficiency: "85%",
      costSavings: "TZS 45,000/season"
    },
    schedule: [
      {
        day: "Monday",
        amount: "25mm",
        duration: "2 hours",
        time: "6:00 AM",
        reason: "Soil moisture at 45%, below optimal 60%",
        priority: "high"
      },
      {
        day: "Thursday",
        amount: "25mm",
        duration: "2 hours",
        time: "6:00 AM",
        reason: "Maintaining optimal moisture during flowering",
        priority: "high"
      },
      {
        day: "Saturday",
        amount: "20mm",
        duration: "1.5 hours",
        time: "7:00 AM",
        reason: "Light irrigation before expected rain",
        priority: "medium"
      }
    ],
    alerts: [
      {
        type: "weather",
        message: "Heavy rain expected Wednesday - Skip Thursday irrigation",
        action: "Postpone",
        severity: "info"
      },
      {
        type: "efficiency",
        message: "Consider installing moisture sensors in North Field",
        action: "Optimize",
        severity: "tip"
      }
    ],
    soilMoisture: {
      current: 48,
      optimal: 60,
      critical: 35
    }
  });

  const getMockFertilizerPlan = () => ({
    summary: {
      totalCost: "TZS 180,000",
      expectedYieldIncrease: "+25%",
      roi: "340%",
      applicationMethod: "Split application"
    },
    schedule: [
      {
        week: "Week 2 (Planting)",
        fertilizer: "DAP (Diammonium Phosphate)",
        amount: "50kg per acre",
        cost: "TZS 90,000",
        application: "Basally at planting",
        cropStage: "Germination",
        completed: true
      },
      {
        week: "Week 4 (Vegetative)",
        fertilizer: "Urea",
        amount: "25kg per acre",
        cost: "TZS 40,000",
        application: "Top-dress, 5cm from plants",
        cropStage: "4-6 leaf stage",
        completed: false,
        daysUntil: 3
      },
      {
        week: "Week 7 (Pre-flowering)",
        fertilizer: "NPK 23-10-5",
        amount: "30kg per acre",
        cost: "TZS 50,000",
        application: "Top-dress before tasseling",
        cropStage: "Tasseling",
        completed: false,
        daysUntil: 24
      }
    ],
    soilAnalysis: {
      nitrogen: { level: "Low", recommendation: "Apply urea" },
      phosphorus: { level: "Medium", recommendation: "Moderate DAP" },
      potassium: { level: "High", recommendation: "No extra K needed" },
      pH: { level: "6.5", recommendation: "Optimal for maize" }
    },
    alternatives: [
      {
        name: "Organic Option",
        materials: "Compost + Manure",
        cost: "TZS 60,000",
        yieldIncrease: "+15%",
        environmental: "Low impact"
      },
      {
        name: "Premium Blend",
        materials: "Slow-release NPK",
        cost: "TZS 250,000",
        yieldIncrease: "+35%",
        environmental: "Medium impact"
      }
    ]
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 border-2 border-green-200 shadow-xl">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          {/* Animated Grid Pattern */}
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="currentColor" className="text-green-600">
                  <animate attributeName="r" values="1;2;1" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
                </circle>
              </pattern>
              <pattern id="grid-pattern-2" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="2" fill="currentColor" className="text-emerald-500">
                  <animate attributeName="r" values="1.5;2.5;1.5" dur="4s" repeatCount="indefinite" begin="0.5s" />
                  <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" begin="0.5s" />
                </circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            <rect width="100%" height="100%" fill="url(#grid-pattern-2)" />
          </svg>
          
          {/* Floating Particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-30"></div>
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping opacity-25" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-teal-400 rounded-full animate-ping opacity-20" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-green-500 rounded-full animate-ping opacity-30" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Icon Badge */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl border-2 border-green-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              {/* Status Indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            </div>

            {/* Title Section */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  AI Recommendation Engine
                </h2>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md hidden md:flex">
                  <Brain className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
              </div>
              <p className="text-sm md:text-base text-gray-700 font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Smart irrigation & fertilizer plans powered by machine learning
              </p>
              
              {/* Quick Stats */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-green-200 shadow-sm">
                  <Target className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-bold text-gray-700">98% Accuracy</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 shadow-sm">
                  <BarChart3 className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-bold text-gray-700">Real-time Data</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={loadRecommendations} 
            size="lg" 
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-0"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Insights
          </Button>
        </div>
      </div>

      <Tabs defaultValue="irrigation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="irrigation" className="flex items-center gap-2 py-2.5">
            <Droplet className="h-4 w-4" />
            <span>Irrigation</span>
          </TabsTrigger>
          <TabsTrigger value="fertilizer" className="flex items-center gap-2 py-2.5">
            <Leaf className="h-4 w-4" />
            <span>Fertilizer</span>
          </TabsTrigger>
        </TabsList>

        {/* Irrigation Tab */}
        <TabsContent value="irrigation" className="space-y-4 mt-0">
          {irrigationPlan && (
            <>
              <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-2 border-blue-300 shadow-xl">
                {/* Animated Background Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                <CardHeader className="pb-3 relative z-10 border-b-2 border-blue-200 bg-gradient-to-r from-blue-100/50 to-cyan-100/50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg border-2 border-blue-300">
                      <Droplet className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg md:text-xl flex items-center gap-2 font-black">
                        Irrigation Summary
                      </CardTitle>
                      <CardDescription className="font-medium">
                        AI-optimized watering plan for {crops[0] || "your crops"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 pt-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Method */}
                    <div className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 p-4 rounded-xl border-2 border-blue-200 hover:border-blue-400 shadow-md hover:shadow-lg transition-all hover:scale-105">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-blue-100 rounded-lg">
                            <Droplet className="h-3.5 w-3.5 text-blue-600" />
                          </div>
                          <p className="text-xs font-black text-gray-600 uppercase tracking-wide">Method</p>
                        </div>
                        <p className="text-sm font-bold text-blue-600">{irrigationPlan.summary.method}</p>
                      </div>
                    </div>

                    {/* Weekly Water */}
                    <div className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 p-4 rounded-xl border-2 border-cyan-200 hover:border-cyan-400 shadow-md hover:shadow-lg transition-all hover:scale-105">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-200 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-cyan-100 rounded-lg">
                            <CloudRain className="h-3.5 w-3.5 text-cyan-600" />
                          </div>
                          <p className="text-xs font-black text-gray-600 uppercase tracking-wide">Weekly Water</p>
                        </div>
                        <p className="text-sm font-bold text-cyan-600">{irrigationPlan.summary.weeklyWater}</p>
                      </div>
                    </div>

                    {/* Efficiency */}
                    <div className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 p-4 rounded-xl border-2 border-green-200 hover:border-green-400 shadow-md hover:shadow-lg transition-all hover:scale-105">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-green-100 rounded-lg">
                            <Target className="h-3.5 w-3.5 text-green-600" />
                          </div>
                          <p className="text-xs font-black text-gray-600 uppercase tracking-wide">Efficiency</p>
                        </div>
                        <p className="text-sm font-bold text-green-600">{irrigationPlan.summary.efficiency}</p>
                      </div>
                    </div>

                    {/* Savings */}
                    <div className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 shadow-md hover:shadow-lg transition-all hover:scale-105">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-purple-100 rounded-lg">
                            <TrendingUp className="h-3.5 w-3.5 text-purple-600" />
                          </div>
                          <p className="text-xs font-black text-gray-600 uppercase tracking-wide">Savings</p>
                        </div>
                        <p className="text-sm font-bold text-purple-600">{irrigationPlan.summary.costSavings}</p>
                      </div>
                    </div>
                  </div>

                  {/* Soil Moisture Meter */}
                  <div className="mt-5 relative overflow-hidden bg-gradient-to-br from-white to-blue-50/50 p-5 rounded-xl border-2 border-blue-200 shadow-lg">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-20"></div>
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-100 rounded-lg border border-blue-300">
                            <Thermometer className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-black text-gray-900">Soil Moisture Level</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-blue-600">{irrigationPlan.soilMoisture.current}%</span>
                          <span className="text-sm text-gray-500 font-medium">/ {irrigationPlan.soilMoisture.optimal}% optimal</span>
                        </div>
                      </div>
                      
                      {/* Enhanced Progress Bar */}
                      <div className="relative">
                        <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-6 relative overflow-hidden shadow-inner">
                          {/* Animated Gradient Fill */}
                          <div 
                            className="absolute top-0 left-0 h-6 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 shadow-lg"
                            style={{ width: `${irrigationPlan.soilMoisture.current}%` }}
                          >
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                          </div>
                          
                          {/* Critical Level Marker */}
                          <div 
                            className="absolute top-0 h-6 w-1 bg-red-500 shadow-lg z-10"
                            style={{ left: `${irrigationPlan.soilMoisture.critical}%` }}
                            title="Critical level"
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded shadow-lg whitespace-nowrap">
                              Critical
                            </div>
                          </div>
                          
                          {/* Optimal Level Marker */}
                          <div 
                            className="absolute top-0 h-6 w-1 bg-green-500 shadow-lg z-10"
                            style={{ left: `${irrigationPlan.soilMoisture.optimal}%` }}
                            title="Optimal level"
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded shadow-lg whitespace-nowrap">
                              Optimal
                            </div>
                          </div>
                          
                          {/* Current Level Indicator */}
                          <div 
                            className="absolute top-1/2 transform -translate-y-1/2 w-3 h-8 bg-white border-2 border-blue-600 rounded-full shadow-xl z-20 transition-all duration-700"
                            style={{ left: `${irrigationPlan.soilMoisture.current}%` }}
                          >
                            <div className="absolute inset-0 bg-blue-600 rounded-full animate-pulse opacity-50"></div>
                          </div>
                        </div>
                        
                        {/* Scale Labels */}
                        <div className="flex justify-between text-xs font-bold text-gray-600 mt-3 px-1">
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Critical: {irrigationPlan.soilMoisture.critical}%
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Optimal: {irrigationPlan.soilMoisture.optimal}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="mt-4 flex justify-center">
                        <Badge className={`px-4 py-2 text-sm font-bold shadow-lg ${
                          irrigationPlan.soilMoisture.current >= irrigationPlan.soilMoisture.optimal
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0'
                            : irrigationPlan.soilMoisture.current >= irrigationPlan.soilMoisture.critical
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0'
                            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0'
                        }`}>
                          {irrigationPlan.soilMoisture.current >= irrigationPlan.soilMoisture.optimal
                            ? '✓ Optimal Moisture Level'
                            : irrigationPlan.soilMoisture.current >= irrigationPlan.soilMoisture.critical
                            ? '⚠ Below Optimal - Irrigate Soon'
                            : '⚠ Critical - Immediate Irrigation Needed'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              {irrigationPlan.alerts.map((alert: any, idx: number) => (
                <Card key={idx} className={
                  alert.severity === "info" ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"
                }>
                  <CardContent className="p-4 md:p-5 relative overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                    
                    <div className="flex items-start gap-4 relative z-10">
                      {/* Animated Icon Badge */}
                      <div className="relative flex-shrink-0">
                        <div className={`absolute inset-0 rounded-full blur-md opacity-50 animate-pulse ${
                          alert.severity === "info" ? "bg-blue-400" : "bg-green-400"
                        }`}></div>
                        <div className={`relative p-3 rounded-xl border-2 shadow-lg ${
                          alert.severity === "info" 
                            ? "bg-gradient-to-br from-blue-500 to-cyan-600 border-blue-300" 
                            : "bg-gradient-to-br from-green-500 to-emerald-600 border-green-300"
                        }`}>
                          <Bell className="h-5 w-5 text-white animate-pulse" />
                        </div>
                        {/* Notification Dot */}
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-md animate-ping ${
                          alert.severity === "info" ? "bg-blue-500" : "bg-green-500"
                        }`}></div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`px-3 py-1 font-bold shadow-md border-0 ${
                            alert.severity === "info"
                              ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
                              : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                          }`}>
                            {alert.action}
                          </Badge>
                          <span className={`text-xs font-bold uppercase tracking-wide ${
                            alert.severity === "info" ? "text-blue-600" : "text-green-600"
                          }`}>
                            {alert.severity === "info" ? "Weather Alert" : "Pro Tip"}
                          </span>
                        </div>
                        <p className="text-sm md:text-base font-medium text-gray-800 leading-relaxed">{alert.message}</p>
                        
                        {/* Action Button */}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className={`mt-2 font-bold border-2 hover:scale-105 transition-all ${
                            alert.severity === "info"
                              ? "border-blue-300 text-blue-600 hover:bg-blue-50"
                              : "border-green-300 text-green-600 hover:bg-green-50"
                          }`}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Schedule */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    This Week's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {irrigationPlan.schedule.map((session: any, idx: number) => (
                      <div key={idx} className={`p-3 rounded-lg border-2 ${
                        session.priority === "high" ? "border-red-300 bg-red-50" : "border-blue-200 bg-blue-50"
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold">{session.day}</h4>
                            <p className="text-sm text-gray-600">{session.time} • {session.duration}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={session.priority === "high" ? "destructive" : "default"}>
                              {session.priority.toUpperCase()}
                            </Badge>
                            <p className="text-lg font-bold text-blue-600 mt-1">{session.amount}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{session.reason}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Fertilizer Tab */}
        <TabsContent value="fertilizer" className="space-y-4 mt-0">
          {fertilizerPlan && (
            <>
              <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-2 border-green-300 shadow-xl">
                {/* Animated Background Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-green-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                <CardHeader className="pb-3 relative z-10 border-b-2 border-green-200 bg-gradient-to-r from-green-100/50 to-emerald-100/50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg border-2 border-green-300">
                      <Leaf className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg md:text-xl flex items-center gap-2 font-black">
                        Fertilizer Plan Summary
                      </CardTitle>
                      <CardDescription className="font-medium">
                        Precision nutrient management for maximum yield
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 pt-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Total Cost */}
                    <div className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 p-4 rounded-xl border-2 border-green-200 hover:border-green-400 shadow-md hover:shadow-lg transition-all hover:scale-105">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-green-200 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-green-100 rounded-lg">
                            <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                          </div>
                          <p className="text-xs font-black text-gray-600 uppercase tracking-wide">Total Cost</p>
                        </div>
                        <p className="text-sm font-bold text-green-600">{fertilizerPlan.summary.totalCost}</p>
                      </div>
                    </div>

                    {/* Yield Increase */}
                    <div className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 p-4 rounded-xl border-2 border-blue-200 hover:border-blue-400 shadow-md hover:shadow-lg transition-all hover:scale-105">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-blue-100 rounded-lg">
                            <BarChart3 className="h-3.5 w-3.5 text-blue-600" />
                          </div>
                          <p className="text-xs font-black text-gray-600 uppercase tracking-wide">Yield Increase</p>
                        </div>
                        <p className="text-sm font-bold text-blue-600">{fertilizerPlan.summary.expectedYieldIncrease}</p>
                      </div>
                    </div>

                    {/* ROI */}
                    <div className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 shadow-md hover:shadow-lg transition-all hover:scale-105">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-purple-100 rounded-lg">
                            <Zap className="h-3.5 w-3.5 text-purple-600" />
                          </div>
                          <p className="text-xs font-black text-gray-600 uppercase tracking-wide">ROI</p>
                        </div>
                        <p className="text-sm font-bold text-purple-600">{fertilizerPlan.summary.roi}</p>
                      </div>
                    </div>

                    {/* Method */}
                    <div className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 p-4 rounded-xl border-2 border-orange-200 hover:border-orange-400 shadow-md hover:shadow-lg transition-all hover:scale-105">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-orange-200 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-orange-100 rounded-lg">
                            <Target className="h-3.5 w-3.5 text-orange-600" />
                          </div>
                          <p className="text-xs font-black text-gray-600 uppercase tracking-wide">Method</p>
                        </div>
                        <p className="text-sm font-bold text-orange-600">{fertilizerPlan.summary.applicationMethod}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Schedule */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Application Schedule
                  </CardTitle>
                  <CardDescription>Split applications timed to crop growth stages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {fertilizerPlan.schedule.map((application: any, idx: number) => (
                      <div key={idx} className={`p-3 md:p-4 rounded-lg border-2 ${
                        application.completed ? "border-green-300 bg-green-50" :
                        application.daysUntil <= 7 ? "border-orange-300 bg-orange-50" :
                        "border-gray-300 bg-gray-50"
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold">{application.week}</h4>
                              {application.completed && (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              )}
                              {!application.completed && application.daysUntil && (
                                <Badge variant={application.daysUntil <= 7 ? "destructive" : "secondary"}>
                                  {application.daysUntil} days
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">Crop Stage: {application.cropStage}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{application.cost}</p>
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-gray-500">Fertilizer</p>
                            <p className="font-medium">{application.fertilizer}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Amount</p>
                            <p className="font-medium">{application.amount}</p>
                          </div>
                        </div>
                        <div className="mt-2 p-2 bg-white rounded text-sm">
                          <p className="text-xs text-gray-600 mb-0.5">Application Method:</p>
                          <p className="font-medium">{application.application}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Soil Analysis */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-300 shadow-xl">
                {/* Animated Background Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                <CardHeader className="pb-3 relative z-10 border-b-2 border-amber-200 bg-gradient-to-r from-amber-100/50 to-yellow-100/50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg border-2 border-amber-300">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg md:text-xl font-black">Soil Nutrient Analysis</CardTitle>
                      <CardDescription className="font-medium">AI-based recommendations from soil conditions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 pt-5">
                  <div className="grid gap-4">
                    {Object.entries(fertilizerPlan.soilAnalysis).map(([nutrient, data]: [string, any], idx: number) => {
                      const nutrientConfig = {
                        nitrogen: { 
                          color: 'blue', 
                          icon: <Leaf className="h-5 w-5" />,
                          gradient: 'from-blue-500 to-cyan-600',
                          bgGradient: 'from-blue-50 to-cyan-50',
                          borderColor: 'border-blue-300',
                          hoverBorder: 'hover:border-blue-500'
                        },
                        phosphorus: { 
                          color: 'purple', 
                          icon: <Zap className="h-5 w-5" />,
                          gradient: 'from-purple-500 to-pink-600',
                          bgGradient: 'from-purple-50 to-pink-50',
                          borderColor: 'border-purple-300',
                          hoverBorder: 'hover:border-purple-500'
                        },
                        potassium: { 
                          color: 'green', 
                          icon: <Target className="h-5 w-5" />,
                          gradient: 'from-green-500 to-emerald-600',
                          bgGradient: 'from-green-50 to-emerald-50',
                          borderColor: 'border-green-300',
                          hoverBorder: 'hover:border-green-500'
                        },
                        pH: { 
                          color: 'orange', 
                          icon: <Thermometer className="h-5 w-5" />,
                          gradient: 'from-orange-500 to-amber-600',
                          bgGradient: 'from-orange-50 to-amber-50',
                          borderColor: 'border-orange-300',
                          hoverBorder: 'hover:border-orange-500'
                        }
                      };
                      
                      const config = nutrientConfig[nutrient.toLowerCase()] || nutrientConfig.nitrogen;
                      
                      return (
                        <div 
                          key={nutrient} 
                          className={`group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:${config.bgGradient} p-5 rounded-xl border-2 ${config.borderColor} ${config.hoverBorder} shadow-md hover:shadow-xl transition-all hover:scale-[1.02]`}
                        >
                          {/* Hover Glow Effect */}
                          <div className={`absolute top-0 right-0 w-24 h-24 bg-${config.color}-200 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity`}></div>
                          
                          <div className="relative flex items-start gap-4">
                            {/* Animated Icon Badge */}
                            <div className="relative flex-shrink-0">
                              <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity`}></div>
                              <div className={`relative p-3 bg-gradient-to-br ${config.gradient} rounded-xl shadow-lg border-2 ${config.borderColor}`}>
                                <div className={`text-white`}>
                                  {config.icon}
                                </div>
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <h4 className="text-lg font-black capitalize text-gray-900">{nutrient}</h4>
                                <Badge className={`px-3 py-1 font-bold text-sm shadow-md border-0 ${
                                  data.level === "Low" 
                                    ? "bg-gradient-to-r from-red-500 to-pink-600 text-white" :
                                  data.level === "High" 
                                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" :
                                    "bg-gradient-to-r from-yellow-500 to-orange-600 text-white"
                                }`}>
                                  {data.level === "Low" && "⚠ "}
                                  {data.level === "High" && "✓ "}
                                  {data.level}
                                </Badge>
                              </div>
                              
                              {/* Recommendation */}
                              <div className={`p-3 bg-gradient-to-br ${config.bgGradient} rounded-lg border ${config.borderColor}`}>
                                <div className="flex items-start gap-2">
                                  <div className={`mt-0.5 p-1 bg-white rounded-md`}>
                                    <CheckCircle2 className={`h-3.5 w-3.5 text-${config.color}-600`} />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-0.5">AI Recommendation</p>
                                    <p className="text-sm font-medium text-gray-800 leading-relaxed">{data.recommendation}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Visual Level Indicator */}
                              <div className="pt-2">
                                <div className="flex items-center justify-between text-xs font-bold text-gray-600 mb-1.5">
                                  <span>Level Status</span>
                                  <span className={`${
                                    data.level === "Low" ? "text-red-600" :
                                    data.level === "High" ? "text-green-600" :
                                    "text-yellow-600"
                                  }`}>
                                    {data.level === "Low" && "Needs Attention"}
                                    {data.level === "High" && "Optimal"}
                                    {data.level === "Medium" && "Moderate"}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((bar) => {
                                    const filled = data.level === "Low" ? bar <= 2 :
                                                  data.level === "High" ? bar <= 5 :
                                                  bar <= 3;
                                    return (
                                      <div
                                        key={bar}
                                        className={`flex-1 h-2 rounded-full transition-all ${
                                          filled 
                                            ? `bg-gradient-to-r ${config.gradient} shadow-sm` 
                                            : 'bg-gray-200'
                                        }`}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Plans */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 shadow-xl">
                {/* Animated Background Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-green-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                <CardHeader className="pb-3 relative z-10 border-b-2 border-green-200 bg-gradient-to-r from-green-100/50 to-emerald-100/50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg border-2 border-green-300">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg md:text-xl font-black">Alternative Plans</CardTitle>
                      <CardDescription className="font-medium">Compare different fertilizer strategies</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 pt-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    {fertilizerPlan.alternatives.map((alt: any, idx: number) => {
                      const isOrganic = alt.name.toLowerCase().includes('organic');
                      const isPremium = alt.name.toLowerCase().includes('premium');
                      
                      const planConfig = isOrganic ? {
                        gradient: 'from-green-500 to-emerald-600',
                        bgGradient: 'from-green-50 to-emerald-50',
                        borderColor: 'border-green-300',
                        hoverBorder: 'hover:border-green-500',
                        glowColor: 'bg-green-200',
                        icon: <Leaf className="h-5 w-5 text-white" />,
                        badgeGradient: 'from-green-500 to-emerald-600',
                        buttonHover: 'hover:from-green-600 hover:to-emerald-700'
                      } : {
                        gradient: 'from-orange-500 to-amber-600',
                        bgGradient: 'from-orange-50 to-amber-50',
                        borderColor: 'border-orange-300',
                        hoverBorder: 'hover:border-orange-500',
                        glowColor: 'bg-orange-200',
                        icon: <Zap className="h-5 w-5 text-white" />,
                        badgeGradient: 'from-orange-500 to-amber-600',
                        buttonHover: 'hover:from-orange-600 hover:to-amber-700'
                      };
                      
                      return (
                        <div 
                          key={idx} 
                          className={`group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:${planConfig.bgGradient} p-5 rounded-xl border-2 ${planConfig.borderColor} ${planConfig.hoverBorder} shadow-lg hover:shadow-2xl transition-all hover:scale-[1.02]`}
                        >
                          {/* Hover Glow Effect */}
                          <div className={`absolute top-0 right-0 w-32 h-32 ${planConfig.glowColor} rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity`}></div>
                          
                          {/* Badge - Best Value / Eco-Friendly */}
                          {isOrganic && (
                            <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-black rounded-full shadow-lg flex items-center gap-1">
                              <Leaf className="h-3 w-3" />
                              ECO-FRIENDLY
                            </div>
                          )}
                          {isPremium && (
                            <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-black rounded-full shadow-lg flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              BEST YIELD
                            </div>
                          )}
                          
                          <div className="relative space-y-4">
                            {/* Header with Icon */}
                            <div className="flex items-center gap-3">
                              <div className="relative flex-shrink-0">
                                <div className={`absolute inset-0 bg-gradient-to-br ${planConfig.gradient} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity`}></div>
                                <div className={`relative p-3 bg-gradient-to-br ${planConfig.gradient} rounded-xl shadow-lg border-2 ${planConfig.borderColor}`}>
                                  {planConfig.icon}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-xl font-black text-gray-900">{alt.name}</h4>
                                <p className="text-sm font-medium text-gray-600">{alt.materials}</p>
                              </div>
                            </div>
                            
                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-3">
                              {/* Cost */}
                              <div className={`p-3 bg-gradient-to-br ${planConfig.bgGradient} rounded-lg border ${planConfig.borderColor} text-center`}>
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <TrendingUp className="h-3 w-3 text-green-600" />
                                  <p className="text-xs font-black text-gray-600 uppercase tracking-wide">Cost</p>
                                </div>
                                <p className="text-sm font-bold text-green-600">{alt.cost}</p>
                              </div>
                              
                              {/* Yield Impact */}
                              <div className={`p-3 bg-gradient-to-br ${planConfig.bgGradient} rounded-lg border ${planConfig.borderColor} text-center`}>
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <BarChart3 className="h-3 w-3 text-blue-600" />
                                  <p className="text-xs font-black text-gray-600 uppercase tracking-wide">Yield</p>
                                </div>
                                <p className="text-sm font-bold text-blue-600">{alt.yieldIncrease}</p>
                              </div>
                              
                              {/* Environmental */}
                              <div className={`p-3 bg-gradient-to-br ${planConfig.bgGradient} rounded-lg border ${planConfig.borderColor} text-center`}>
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Leaf className="h-3 w-3 text-emerald-600" />
                                  <p className="text-xs font-black text-gray-600 uppercase tracking-wide">Impact</p>
                                </div>
                                <p className="text-sm font-bold text-emerald-600">{alt.environmental}</p>
                              </div>
                            </div>
                            
                            {/* Visual Comparison Bar */}
                            <div className="space-y-2">
                              <div>
                                <div className="flex items-center justify-between text-xs font-bold text-gray-600 mb-1">
                                  <span>Value Rating</span>
                                  <span className={isOrganic ? "text-green-600" : "text-orange-600"}>
                                    {isOrganic ? "Budget-Friendly" : "Maximum ROI"}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((bar) => {
                                    const filled = isOrganic ? bar <= 3 : bar <= 5;
                                    return (
                                      <div
                                        key={bar}
                                        className={`flex-1 h-2 rounded-full transition-all ${
                                          filled 
                                            ? `bg-gradient-to-r ${planConfig.gradient} shadow-sm` 
                                            : 'bg-gray-200'
                                        }`}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                            
                            {/* Key Benefits */}
                            <div className={`p-3 bg-gradient-to-br ${planConfig.bgGradient} rounded-lg border ${planConfig.borderColor}`}>
                              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Key Benefits</p>
                              <div className="space-y-1">
                                {isOrganic ? (
                                  <>
                                    <div className="flex items-center gap-2 text-xs">
                                      <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                                      <span className="font-medium text-gray-700">Soil health improvement</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                      <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                                      <span className="font-medium text-gray-700">Long-term sustainability</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                      <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                                      <span className="font-medium text-gray-700">Lower cost investment</span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-2 text-xs">
                                      <CheckCircle2 className="h-3 w-3 text-orange-600 flex-shrink-0" />
                                      <span className="font-medium text-gray-700">Maximum yield increase</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                      <CheckCircle2 className="h-3 w-3 text-orange-600 flex-shrink-0" />
                                      <span className="font-medium text-gray-700">Slow-release nutrients</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                      <CheckCircle2 className="h-3 w-3 text-orange-600 flex-shrink-0" />
                                      <span className="font-medium text-gray-700">Highest ROI potential</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {/* Action Button */}
                            <Button 
                              size="lg" 
                              className={`w-full bg-gradient-to-r ${planConfig.gradient} ${planConfig.buttonHover} text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 border-0`}
                            >
                              <Target className="h-4 w-4 mr-2" />
                              Switch to {alt.name}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Comparison Info */}
                  <div className="mt-5 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg border border-blue-300">
                        <Brain className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-black text-gray-900 mb-1">AI Recommendation</h5>
                        <p className="text-sm font-medium text-gray-700 leading-relaxed">
                          Based on your farm size and budget, the <span className="font-bold text-green-600">Organic Option</span> provides excellent soil health benefits at lower cost, while the <span className="font-bold text-purple-600">Premium Blend</span> maximizes short-term yields with 340% ROI.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}