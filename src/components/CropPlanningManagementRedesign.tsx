import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import {
  Leaf,
  Calendar,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Brain,
  Plus,
  Search,
  Filter,
  Download,
  History,
  Sprout,
  Droplets,
  Sun,
  Target,
  BarChart3,
  RefreshCw,
  ChevronRight,
  FileText,
  Beaker
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface CropPlan {
  id: string;
  crop: string;
  season: string;
  location: string;
  field_size_ha: number;
  status: "planned" | "active" | "completed";
  ai_plan: {
    recommendations: {
      seed_variety: string;
      planting_window: string;
      soil_amendments: Array<{ type: string; rate: string; cost_tzs: number }>;
      fertilization_schedule: Array<{ stage: string; product: string; rate: string; timing: string }>;
    };
    forecast: {
      yield_kg_per_ha: { min: number; expected: number; max: number };
      confidence: string;
    };
    risks: string[];
    estimated_costs: {
      seeds: number;
      fertilizer: number;
      labor: number;
      total: number;
    };
    summary: {
      en: string;
      sw: string;
    };
  };
  createdAt: string;
}

interface CropPlanningProps {
  userId: string;
  language?: "en" | "sw";
}

export function CropPlanningManagementRedesign({ userId, language = "en" }: CropPlanningProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [cropPlans, setCropPlans] = useState<CropPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState("2025 Masika");
  
  // Create plan state
  const [newPlan, setNewPlan] = useState({
    crop: "Maize",
    season: "2025 Masika",
    location: "Morogoro",
    field_size_ha: 5,
    soil_data: {
      ph: 6.0,
      nitrogen: "medium",
      phosphorus: "medium",
      potassium: "medium"
    }
  });

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

  useEffect(() => {
    loadCropPlans();
  }, []);

  const loadCropPlans = async () => {
    setLoading(true);
    try {
      // Simulate loading from backend
      // In production, this would fetch from Supabase
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For now, just set empty array (no mock data to avoid confusion)
      setCropPlans([]);
      setLoading(false);
    } catch (error) {
      console.error("Load crop plans error:", error);
      setLoading(false);
    }
  };

  const generateCropPlan = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/crop-plan/generate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          ...newPlan
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success(language === "en" ? "Crop plan generated!" : "Mpango wa mazao umetengenezwa!");
        setShowCreateModal(false);
        loadCropPlans();
      } else {
        toast.error(result.error || "Failed to generate plan");
      }
    } catch (error) {
      console.error("Generate plan error:", error);
      toast.error("Failed to generate crop plan");
    } finally {
      setLoading(false);
    }
  };

  const analyzeHistory = async (planId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/crop-plan/analyze-history`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, planId })
      });

      const result = await response.json();
      if (result.success) {
        toast.success(language === "en" ? "Analysis complete!" : "Uchambuzi umekamilika!");
        // Show analysis in modal or section
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze history");
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (confidence: string) => {
    if (confidence === "high") return "text-green-600 bg-green-100";
    if (confidence === "medium") return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      planned: "bg-blue-100 text-blue-700",
      active: "bg-green-100 text-green-700",
      completed: "bg-gray-100 text-gray-700"
    };
    return colors[status as keyof typeof colors] || colors.planned;
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {language === "en" ? "Crop Planning & Management" : "Mipango na Usimamizi wa Mazao"}
          </h1>
          <p className="text-gray-600">
            {language === "en" 
              ? "Plan crops from soil → seed → harvest with AI optimization" 
              : "Panga mazao kutoka udongo → mbegu → mavuno kwa uboresho wa AI"}
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option>2025 Masika</option>
            <option>2025 Vuli</option>
            <option>2024 Masika</option>
          </select>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {language === "en" ? "New Crop Plan" : "Mpango Mpya"}
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            {language === "en" ? "Overview" : "Muhtasari"}
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            {language === "en" ? "Calendar" : "Kalenda"}
          </TabsTrigger>
          <TabsTrigger value="soil">
            <Beaker className="h-4 w-4 mr-2" />
            {language === "en" ? "Soil & Inputs" : "Udongo"}
          </TabsTrigger>
          <TabsTrigger value="revenue">
            <DollarSign className="h-4 w-4 mr-2" />
            {language === "en" ? "Yield & Revenue" : "Mapato"}
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            {language === "en" ? "History" : "Historia"}
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Column 1: Active Crop Plans */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold">
                {language === "en" ? "Active Crop Plans" : "Mipango Hai ya Mazao"}
              </h3>
              
              {loading ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-green-600" />
                    <p className="text-sm text-gray-600">{language === "en" ? "Loading..." : "Inapakia..."}</p>
                  </CardContent>
                </Card>
              ) : cropPlans.length === 0 ? (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <Sprout className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">
                      {language === "en" ? "No Crop Plans Yet" : "Hakuna Mipango Bado"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {language === "en" 
                        ? "Create your first AI-powered crop plan" 
                        : "Tengeneza mpango wako wa kwanza wa mazao"}
                    </p>
                    <Button onClick={() => setShowCreateModal(true)} className="bg-green-600">
                      <Plus className="h-4 w-4 mr-2" />
                      {language === "en" ? "Create Plan" : "Tengeneza Mpango"}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                cropPlans.map((plan) => (
                  <Card key={plan.id} className="hover:shadow-lg transition-shadow border-l-4 border-green-500">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Leaf className="h-5 w-5 text-green-600" />
                            <h4 className="text-lg font-bold">{plan.crop}</h4>
                            <Badge className={getStatusBadge(plan.status)}>
                              {plan.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>📍 {plan.location}</span>
                            <span>📏 {plan.field_size_ha} ha</span>
                            <span>🌱 {plan.season}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getHealthColor(plan.ai_plan.forecast.confidence)}>
                            AI: {plan.ai_plan.forecast.confidence}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">{language === "en" ? "Expected Yield" : "Mavuno Yanayotarajiwa"}</p>
                          <p className="text-lg font-bold text-green-600">
                            {plan.ai_plan.forecast.yield_kg_per_ha.expected} kg/ha
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">{language === "en" ? "Total Cost" : "Gharama Jumla"}</p>
                          <p className="text-lg font-bold text-blue-600">
                            {(plan.ai_plan.estimated_costs.total / 1000).toFixed(0)}k TZS
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">{language === "en" ? "Variety" : "Aina"}</p>
                          <p className="text-sm font-semibold truncate">
                            {plan.ai_plan.recommendations.seed_variety}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">{language === "en" ? "Planting" : "Kupanda"}</p>
                          <p className="text-sm font-semibold">
                            {plan.ai_plan.recommendations.planting_window}
                          </p>
                        </div>
                      </div>

                      {plan.ai_plan.risks.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-yellow-800 mb-1">
                                {language === "en" ? "Risk Factors:" : "Hatari:"}
                              </p>
                              <ul className="text-xs text-yellow-700 list-disc list-inside">
                                {plan.ai_plan.risks.map((risk, idx) => (
                                  <li key={idx}>{risk}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />
                          {language === "en" ? "View Details" : "Angalia Maelezo"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => analyzeHistory(plan.id)}>
                          <Brain className="h-4 w-4 mr-2" />
                          {language === "en" ? "AI Analysis" : "Uchambuzi wa AI"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Column 2: AI Insights Panel (Sticky) */}
            <div className="space-y-4">
              <Card className="border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 sticky top-4">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-lg">
                      {language === "en" ? "AI Crop Advisor" : "Mshauri wa Mazao wa AI"}
                    </CardTitle>
                  </div>
                  <CardDescription>
                    {language === "en" ? "Real-time insights and recommendations" : "Maarifa ya wakati halisi"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border-l-4 border-yellow-500">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-yellow-800 mb-1">
                          {language === "en" ? "Nitrogen Deficit Warning" : "Tahadhari ya Upungufu wa Nitrojeni"}
                        </p>
                        <p className="text-xs text-yellow-700">
                          {language === "en" 
                            ? "Nitrogen deficit likely to reduce yield by 8-12% in Field B" 
                            : "Upungufu wa nitrojeni unaweza kupunguza mavuno kwa 8-12% kwenye Shamba B"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-start gap-2">
                      <Droplets className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-blue-800 mb-1">
                          {language === "en" ? "Climate Opportunity" : "Fursa ya Hali ya Hewa"}
                        </p>
                        <p className="text-xs text-blue-700">
                          {language === "en" 
                            ? "Good rainfall expected - optimal planting window next week" 
                            : "Mvua nzuri inatarajiwa - wakati bora wa kupanda wiki ijayo"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-green-800 mb-1">
                          {language === "en" ? "Soil Health Good" : "Afya ya Udongo Nzuri"}
                        </p>
                        <p className="text-xs text-green-700">
                          {language === "en" 
                            ? "Soil pH and organic matter at optimal levels" 
                            : "pH ya udongo na vituhai viko kwa kiwango bora"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Snapshot */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    {language === "en" ? "Financial Snapshot" : "Muhtasari wa Kifedha"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{language === "en" ? "Total Investment" : "Uwekezaji Jumla"}</span>
                    <span className="font-bold">2.5M TZS</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{language === "en" ? "Expected Revenue" : "Mapato Yanayotarajiwa"}</span>
                    <span className="font-bold text-green-600">4.2M TZS</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-semibold">{language === "en" ? "Net Margin" : "Faida Halisi"}</span>
                    <span className="font-bold text-green-600">+68%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* CALENDAR TAB */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Crop Calendar" : "Kalenda ya Mazao"}</CardTitle>
              <CardDescription>
                {language === "en" ? "Scheduled activities and milestones" : "Shughuli zilizopangwa"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 py-8">
                {language === "en" ? "Calendar view coming soon..." : "Muonekano wa kalenda unakuja hivi karibuni..."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SOIL & INPUTS TAB */}
        <TabsContent value="soil">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Soil Health & Amendments" : "Afya ya Udongo"}</CardTitle>
              <CardDescription>
                {language === "en" ? "Track soil tests and input applications" : "Fuatilia vipimo vya udongo"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 py-8">
                {language === "en" ? "Soil tracking coming soon..." : "Ufuatiliaji wa udongo unakuja hivi karibuni..."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REVENUE TAB */}
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Yield & Revenue Forecast" : "Utabiri wa Mavuno na Mapato"}</CardTitle>
              <CardDescription>
                {language === "en" ? "Financial projections and yield estimates" : "Makadirio ya kifedha"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 py-8">
                {language === "en" ? "Revenue analytics coming soon..." : "Uchambuzi wa mapato unakuja hivi karibuni..."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Crop Plan History" : "Historia ya Mipango"}</CardTitle>
              <CardDescription>
                {language === "en" ? "AI-powered performance analysis" : "Uchambuzi wa utendaji wa AI"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 py-8">
                {language === "en" ? "Historical analysis coming soon..." : "Uchambuzi wa kihistoria unakuja hivi karibuni..."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{language === "en" ? "Create New Crop Plan" : "Tengeneza Mpango Mpya"}</CardTitle>
              <CardDescription>
                {language === "en" ? "AI will generate an optimized plan based on your inputs" : "AI itatengeneza mpango ulio bora"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{language === "en" ? "Crop" : "Mazao"}</Label>
                  <select
                    value={newPlan.crop}
                    onChange={(e) => setNewPlan({...newPlan, crop: e.target.value})}
                    className="w-full mt-1 p-2 border rounded"
                  >
                    <option>Maize</option>
                    <option>Rice</option>
                    <option>Beans</option>
                    <option>Cassava</option>
                    <option>Tomatoes</option>
                  </select>
                </div>
                <div>
                  <Label>{language === "en" ? "Season" : "Msimu"}</Label>
                  <select
                    value={newPlan.season}
                    onChange={(e) => setNewPlan({...newPlan, season: e.target.value})}
                    className="w-full mt-1 p-2 border rounded"
                  >
                    <option>2025 Masika</option>
                    <option>2025 Vuli</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{language === "en" ? "Location" : "Mahali"}</Label>
                  <Input
                    value={newPlan.location}
                    onChange={(e) => setNewPlan({...newPlan, location: e.target.value})}
                  />
                </div>
                <div>
                  <Label>{language === "en" ? "Field Size (hectares)" : "Ukubwa wa Shamba (hekta)"}</Label>
                  <Input
                    type="number"
                    value={newPlan.field_size_ha}
                    onChange={(e) => setNewPlan({...newPlan, field_size_ha: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">{language === "en" ? "Soil Data (Optional)" : "Data ya Udongo (Si lazima)"}</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">pH</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newPlan.soil_data.ph}
                      onChange={(e) => setNewPlan({
                        ...newPlan,
                        soil_data: {...newPlan.soil_data, ph: Number(e.target.value)}
                      })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">{language === "en" ? "Nitrogen" : "Nitrojeni"}</Label>
                    <select
                      value={newPlan.soil_data.nitrogen}
                      onChange={(e) => setNewPlan({
                        ...newPlan,
                        soil_data: {...newPlan.soil_data, nitrogen: e.target.value}
                      })}
                      className="w-full p-2 border rounded text-sm"
                    >
                      <option>low</option>
                      <option>medium</option>
                      <option>high</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  {language === "en" ? "Cancel" : "Ghairi"}
                </Button>
                <Button
                  onClick={generateCropPlan}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Brain className="h-4 w-4 mr-2" />
                  )}
                  {language === "en" ? "Generate with AI" : "Tengeneza na AI"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}