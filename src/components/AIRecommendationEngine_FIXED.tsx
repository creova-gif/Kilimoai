import { useState, useEffect } from "react";
import { Droplet, Leaf, Calendar, TrendingUp, RefreshCw, Bell, CheckCircle2, Brain, Target, Zap, BarChart3, CloudRain, Thermometer, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { toast } from "sonner@2.0.3";

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
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      console.log(`[AIRecommendationEngine] Loading AI recommendations for user ${userId}`);
      
      const [irrigationRes, fertilizerRes] = await Promise.all([
        fetch(`${apiBase}/ai-engine/irrigation/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        }).catch((err) => {
          console.error('[AIRecommendationEngine] Irrigation API error:', err);
          return null;
        }),
        fetch(`${apiBase}/ai-engine/fertilizer/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        }).catch((err) => {
          console.error('[AIRecommendationEngine] Fertilizer API error:', err);
          return null;
        })
      ]);

      let irrigationData = { success: false };
      let fertilizerData = { success: false };

      if (irrigationRes?.ok) {
        try {
          const contentType = irrigationRes.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            irrigationData = await irrigationRes.json();
            console.log('[AIRecommendationEngine] Irrigation data loaded from API');
          }
        } catch (err) {
          console.error('[AIRecommendationEngine] Failed to parse irrigation response:', err);
        }
      }

      if (fertilizerRes?.ok) {
        try {
          const contentType = fertilizerRes.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            fertilizerData = await fertilizerRes.json();
            console.log('[AIRecommendationEngine] Fertilizer data loaded from API');
          }
        } catch (err) {
          console.error('[AIRecommendationEngine] Failed to parse fertilizer response:', err);
        }
      }

      const useMock = !irrigationData.success || !fertilizerData.success;
      setUsingMockData(useMock);

      if (useMock) {
        console.warn('[AIRecommendationEngine] Using DEMO data - API endpoints not available');
        toast.warning("Using demo data - Connect your farm for real recommendations");
      }

      setIrrigationPlan(irrigationData.success ? irrigationData.plan : getMockIrrigationPlan());
      setFertilizerPlan(fertilizerData.success ? fertilizerData.plan : getMockFertilizerPlan());
    } catch (error) {
      console.error('[AIRecommendationEngine] Error loading recommendations:', error);
      toast.error("Failed to load AI recommendations");
      
      // Use mock data as fallback
      setUsingMockData(true);
      setIrrigationPlan(getMockIrrigationPlan());
      setFertilizerPlan(getMockFertilizerPlan());
    } finally {
      setLoading(false);
    }
  };

  // ⚠️ DEMO DATA - This is sample data for demonstration purposes only
  // Real recommendations will come from the AI engine API when connected
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

  // ⚠️ DEMO DATA - This is sample data for demonstration purposes only
  // Real recommendations will come from the AI engine API when connected
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
        <RefreshCw className="h-8 w-8 animate-spin text-[#2E7D32]" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Demo Data Warning Banner */}
      {usingMockData && (
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-orange-900 mb-1">Demo Data Mode</p>
                <p className="text-sm text-orange-800">
                  You're viewing sample recommendations. Connect your farm data for personalized AI insights.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="rounded-2xl bg-[#2E7D32] p-6 shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-2xl">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                AI Recommendation Engine
              </h2>
              <p className="text-sm md:text-base text-white/90 font-medium">
                Smart irrigation & fertilizer plans powered by AI
              </p>
            </div>
          </div>
          <Button 
            onClick={loadRecommendations} 
            size="lg" 
            className="bg-white text-[#2E7D32] hover:bg-white/90 font-bold shadow-lg"
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
              <Card className="border-2 border-gray-200 shadow-xl">
                <CardHeader className="pb-3 border-b-2 border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#2E7D32] rounded-xl shadow-lg">
                      <Droplet className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg md:text-xl font-bold">
                        Irrigation Summary
                      </CardTitle>
                      <CardDescription>
                        AI-optimized watering plan for {crops[0] || "your crops"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Method */}
                    <div className="bg-white hover:bg-gray-50 p-4 rounded-xl border-2 border-gray-200 hover:border-[#2E7D32] shadow-md hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-gray-100 rounded-lg">
                          <Droplet className="h-3.5 w-3.5 text-[#2E7D32]" />
                        </div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Method</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{irrigationPlan.summary.method}</p>
                    </div>

                    {/* Weekly Water */}
                    <div className="bg-white hover:bg-gray-50 p-4 rounded-xl border-2 border-gray-200 hover:border-[#2E7D32] shadow-md hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-gray-100 rounded-lg">
                          <CloudRain className="h-3.5 w-3.5 text-[#2E7D32]" />
                        </div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Weekly Water</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{irrigationPlan.summary.weeklyWater}</p>
                    </div>

                    {/* Efficiency */}
                    <div className="bg-white hover:bg-gray-50 p-4 rounded-xl border-2 border-gray-200 hover:border-[#2E7D32] shadow-md hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-green-100 rounded-lg">
                          <Target className="h-3.5 w-3.5 text-[#2E7D32]" />
                        </div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Efficiency</p>
                      </div>
                      <p className="text-sm font-bold text-[#2E7D32]">{irrigationPlan.summary.efficiency}</p>
                    </div>

                    {/* Savings */}
                    <div className="bg-white hover:bg-gray-50 p-4 rounded-xl border-2 border-gray-200 hover:border-[#2E7D32] shadow-md hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-green-100 rounded-lg">
                          <TrendingUp className="h-3.5 w-3.5 text-[#2E7D32]" />
                        </div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Savings</p>
                      </div>
                      <p className="text-sm font-bold text-[#2E7D32]">{irrigationPlan.summary.costSavings}</p>
                    </div>
                  </div>

                  {/* Soil Moisture Meter */}
                  <div className="mt-5 bg-white p-5 rounded-xl border-2 border-gray-200 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Thermometer className="h-4 w-4 text-[#2E7D32]" />
                        </div>
                        <span className="text-sm font-bold text-gray-900">Soil Moisture Level</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-[#2E7D32]">{irrigationPlan.soilMoisture.current}%</span>
                        <span className="text-sm text-gray-500 font-medium">/ {irrigationPlan.soilMoisture.optimal}% optimal</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-6 rounded-full transition-all duration-700 bg-[#2E7D32]"
                          style={{ width: `${irrigationPlan.soilMoisture.current}%` }}
                        />
                        
                        {/* Critical Level Marker */}
                        <div 
                          className="absolute top-0 h-6 w-1 bg-red-500 z-10"
                          style={{ left: `${irrigationPlan.soilMoisture.critical}%` }}
                          title="Critical level"
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded whitespace-nowrap">
                            Critical
                          </div>
                        </div>
                        
                        {/* Optimal Level Marker */}
                        <div 
                          className="absolute top-0 h-6 w-1 bg-[#2E7D32] z-10"
                          style={{ left: `${irrigationPlan.soilMoisture.optimal}%` }}
                          title="Optimal level"
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-[#2E7D32] text-white text-xs font-bold rounded whitespace-nowrap">
                            Optimal
                          </div>
                        </div>
                      </div>
                      
                      {/* Scale Labels */}
                      <div className="flex justify-between text-xs font-bold text-gray-600 mt-3 px-1">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Critical: {irrigationPlan.soilMoisture.critical}%
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-[#2E7D32] rounded-full"></div>
                          Optimal: {irrigationPlan.soilMoisture.optimal}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="mt-4 flex justify-center">
                      <Badge className={`px-4 py-2 text-sm font-bold ${
                        irrigationPlan.soilMoisture.current >= irrigationPlan.soilMoisture.optimal
                          ? 'bg-[#2E7D32] text-white'
                          : irrigationPlan.soilMoisture.current >= irrigationPlan.soilMoisture.critical
                          ? 'bg-orange-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}>
                        {irrigationPlan.soilMoisture.current >= irrigationPlan.soilMoisture.optimal
                          ? '✓ Optimal Moisture Level'
                          : irrigationPlan.soilMoisture.current >= irrigationPlan.soilMoisture.critical
                          ? '⚠ Below Optimal - Irrigate Soon'
                          : '⚠ Critical - Immediate Irrigation Needed'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              {irrigationPlan.alerts.map((alert: any, idx: number) => (
                <Card key={idx} className={
                  alert.severity === "info" ? "bg-gray-50 border-gray-300" : "bg-green-50 border-[#2E7D32]"
                }>
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl border-2 flex-shrink-0 ${
                        alert.severity === "info" 
                          ? "bg-gray-600 border-gray-500" 
                          : "bg-[#2E7D32] border-[#2E7D32]"
                      }`}>
                        <Bell className="h-5 w-5 text-white" />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`px-3 py-1 font-bold ${
                            alert.severity === "info"
                              ? "bg-gray-600 text-white"
                              : "bg-[#2E7D32] text-white"
                          }`}>
                            {alert.action}
                          </Badge>
                          <span className={`text-xs font-bold uppercase tracking-wide ${
                            alert.severity === "info" ? "text-gray-700" : "text-[#2E7D32]"
                          }`}>
                            {alert.severity === "info" ? "Weather Alert" : "Pro Tip"}
                          </span>
                        </div>
                        <p className="text-sm md:text-base font-medium text-gray-800">{alert.message}</p>
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
                        session.priority === "high" ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
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
                            <p className="text-lg font-bold text-[#2E7D32] mt-1">{session.amount}</p>
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
              <Card className="border-2 border-gray-200 shadow-xl">
                <CardHeader className="pb-3 border-b-2 border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#2E7D32] rounded-xl shadow-lg">
                      <Leaf className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg md:text-xl font-bold">
                        Fertilizer Plan Summary
                      </CardTitle>
                      <CardDescription>
                        Precision nutrient management for maximum yield
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Total Cost */}
                    <div className="bg-white hover:bg-gray-50 p-4 rounded-xl border-2 border-gray-200 hover:border-[#2E7D32] shadow-md hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-gray-100 rounded-lg">
                          <TrendingUp className="h-3.5 w-3.5 text-gray-700" />
                        </div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Total Cost</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{fertilizerPlan.summary.totalCost}</p>
                    </div>

                    {/* Yield Increase */}
                    <div className="bg-white hover:bg-gray-50 p-4 rounded-xl border-2 border-gray-200 hover:border-[#2E7D32] shadow-md hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-green-100 rounded-lg">
                          <BarChart3 className="h-3.5 w-3.5 text-[#2E7D32]" />
                        </div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Yield Increase</p>
                      </div>
                      <p className="text-sm font-bold text-[#2E7D32]">{fertilizerPlan.summary.expectedYieldIncrease}</p>
                    </div>

                    {/* ROI */}
                    <div className="bg-white hover:bg-gray-50 p-4 rounded-xl border-2 border-gray-200 hover:border-[#2E7D32] shadow-md hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-green-100 rounded-lg">
                          <TrendingUp className="h-3.5 w-3.5 text-[#2E7D32]" />
                        </div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">ROI</p>
                      </div>
                      <p className="text-sm font-bold text-[#2E7D32]">{fertilizerPlan.summary.roi}</p>
                    </div>

                    {/* Method */}
                    <div className="bg-white hover:bg-gray-50 p-4 rounded-xl border-2 border-gray-200 hover:border-[#2E7D32] shadow-md hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-gray-100 rounded-lg">
                          <Leaf className="h-3.5 w-3.5 text-[#2E7D32]" />
                        </div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Method</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{fertilizerPlan.summary.applicationMethod}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Application Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {fertilizerPlan.schedule.map((item: any, idx: number) => (
                      <div key={idx} className={`p-4 rounded-lg border-2 ${
                        item.completed ? "border-gray-200 bg-gray-50" : "border-[#2E7D32] bg-green-50"
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900">{item.week}</h4>
                              {item.completed && (
                                <CheckCircle2 className="h-4 w-4 text-[#2E7D32]" />
                              )}
                            </div>
                            <p className="text-sm font-bold text-[#2E7D32]">{item.fertilizer}</p>
                            <p className="text-sm text-gray-600 mt-1">{item.application}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{item.amount}</p>
                            <p className="text-sm text-gray-600">{item.cost}</p>
                            {!item.completed && item.daysUntil && (
                              <Badge className="mt-2 bg-orange-600 text-white">
                                {item.daysUntil} days
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                          <Badge variant="outline" className="text-xs">
                            {item.cropStage}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Soil Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Soil Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {Object.entries(fertilizerPlan.soilAnalysis).map(([key, value]: [string, any]) => (
                      <div key={key} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <h4 className="font-bold text-gray-900 capitalize mb-1">{key}</h4>
                        <p className="text-sm text-[#2E7D32] font-bold">{value.level}</p>
                        <p className="text-sm text-gray-600 mt-1">{value.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alternatives */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Alternative Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {fertilizerPlan.alternatives.map((alt: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-[#2E7D32] transition-all">
                        <h4 className="font-bold text-gray-900 mb-2">{alt.name}</h4>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-700"><span className="font-bold">Materials:</span> {alt.materials}</p>
                          <p className="text-gray-700"><span className="font-bold">Cost:</span> {alt.cost}</p>
                          <p className="text-[#2E7D32] font-bold"><span className="font-bold text-gray-700">Yield:</span> {alt.yieldIncrease}</p>
                          <p className="text-gray-600 text-xs">{alt.environmental} environmental impact</p>
                        </div>
                      </div>
                    ))}
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
