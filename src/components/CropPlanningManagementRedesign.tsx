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
  status: "planned" | "active" | "completed" | "at-risk";
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
    if (confidence === "high") return "text-gray-900 bg-gray-100";
    if (confidence === "medium") return "text-yellow-800 bg-yellow-50";
    return "text-red-800 bg-red-50";
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      planned: "bg-gray-100 text-gray-700",
      active: "bg-gray-100 text-gray-900",
      completed: "bg-gray-100 text-gray-600",
      "at-risk": "bg-red-50 text-red-700"
    };
    return colors[status as keyof typeof colors] || colors.planned;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-gray-200">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">
              {language === "en" ? "Crop Planning" : "Mipango ya Mazao"}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <label className="text-sm text-gray-500">
                {language === "en" ? "Season:" : "Msimu:"}
              </label>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
              >
                <option>2025 Masika</option>
                <option>2025 Vuli</option>
                <option>2024 Masika</option>
              </select>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#2E7D32] hover:bg-[rgba(46,125,50,0.9)] text-white px-5 py-2.5 h-auto text-base font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            {language === "en" ? "New Plan" : "Mpango Mpya"}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full inline-flex h-auto bg-gray-50 p-1 rounded-lg border border-gray-200">
            <TabsTrigger value="overview" className="flex-1 text-sm px-3 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              {language === "en" ? "Overview" : "Muhtasari"}
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex-1 text-sm px-3 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              {language === "en" ? "Calendar" : "Kalenda"}
            </TabsTrigger>
            <TabsTrigger value="soil" className="flex-1 text-sm px-3 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              {language === "en" ? "Soil" : "Udongo"}
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex-1 text-sm px-3 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              {language === "en" ? "Revenue" : "Mapato"}
            </TabsTrigger>
            <TabsTrigger value="history" className="hidden sm:flex flex-1 text-sm px-3 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              {language === "en" ? "History" : "Historia"}
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <RefreshCw className="h-8 w-8 mb-3 animate-spin text-gray-400" />
                <p className="text-base text-gray-600">{language === "en" ? "Loading..." : "Inapakia..."}</p>
              </div>
            ) : cropPlans.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 px-4">
                <Sprout className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {language === "en" ? "No plans yet" : "Hakuna mipango bado"}
                </h3>
                <p className="text-base text-gray-600 mb-8 text-center max-w-sm">
                  {language === "en" 
                    ? "Create your first crop plan to get started" 
                    : "Tengeneza mpango wako wa kwanza wa mazao"}
                </p>
                <Button 
                  onClick={() => setShowCreateModal(true)} 
                  className="bg-[#2E7D32] hover:bg-[rgba(46,125,50,0.9)] text-white px-6 py-2.5 h-auto text-base"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  {language === "en" ? "Create Plan" : "Tengeneza Mpango"}
                </Button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4">
                  {cropPlans.map((plan) => (
                    <div key={plan.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-5 pb-5 border-b border-gray-100">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-lg font-semibold text-gray-900">{plan.crop}</h3>
                            {plan.status === "at-risk" && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                                {language === "en" ? "At Risk" : "Hatari"}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                            <span>{plan.location}</span>
                            <span>•</span>
                            <span>{plan.field_size_ha} ha</span>
                            <span>•</span>
                            <span>{plan.season}</span>
                          </div>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-6 mb-5">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">
                            {language === "en" ? "Expected Yield" : "Mavuno"}
                          </div>
                          <div className="text-xl font-semibold text-gray-900">
                            {plan.ai_plan.forecast.yield_kg_per_ha.expected}
                            <span className="text-sm font-normal text-gray-500 ml-1">kg/ha</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">
                            {language === "en" ? "Total Cost" : "Gharama"}
                          </div>
                          <div className="text-xl font-semibold text-gray-900">
                            {(plan.ai_plan.estimated_costs.total / 1000).toFixed(1)}k
                            <span className="text-sm font-normal text-gray-500 ml-1">TZS</span>
                          </div>
                        </div>
                      </div>

                      {/* Risks */}
                      {plan.ai_plan.risks.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-5">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-yellow-900 mb-1.5">
                                {language === "en" ? "Risk Factors" : "Hatari"}
                              </div>
                              <div className="space-y-1">
                                {plan.ai_plan.risks.map((risk, idx) => (
                                  <p key={idx} className="text-sm text-yellow-800">{risk}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action */}
                      <Button 
                        variant="outline" 
                        className="w-full border-gray-300 text-gray-900 hover:bg-gray-50 font-medium"
                      >
                        {language === "en" ? "View Details" : "Angalia Maelezo"}
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* AI Insights */}
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      {language === "en" ? "AI Insights" : "Maarifa ya AI"}
                    </h3>
                    
                    <div className="space-y-3">
                      {/* Warning */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex gap-2.5">
                          <AlertTriangle className="h-4 w-4 text-yellow-700 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-yellow-900 mb-1">
                              {language === "en" ? "Nitrogen Deficit" : "Upungufu wa Nitrojeni"}
                            </p>
                            <p className="text-sm text-yellow-800">
                              {language === "en" 
                                ? "Field B may see 8-12% yield reduction" 
                                : "Shamba B linaweza kupunguza mavuno 8-12%"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex gap-2.5">
                          <Droplets className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {language === "en" ? "Good Rainfall Expected" : "Mvua Nzuri Inatarajiwa"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {language === "en" 
                                ? "Optimal planting window next week" 
                                : "Wakati bora wa kupanda wiki ijayo"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Success */}
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex gap-2.5">
                          <CheckCircle className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {language === "en" ? "Soil Health Optimal" : "Afya ya Udongo Nzuri"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {language === "en" 
                                ? "pH and nutrients at good levels" 
                                : "pH na virutubishi viko vizuri"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial */}
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      {language === "en" ? "Financial Summary" : "Muhtasari wa Fedha"}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{language === "en" ? "Investment" : "Uwekezaji"}</span>
                        <span className="text-base font-semibold text-gray-900">2.5M TZS</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{language === "en" ? "Revenue" : "Mapato"}</span>
                        <span className="text-base font-semibold text-gray-900">4.2M TZS</span>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900">{language === "en" ? "Net Margin" : "Faida"}</span>
                          <span className="text-lg font-bold text-gray-900">+68%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* CALENDAR TAB */}
          <TabsContent value="calendar">
            <div className="bg-white border border-gray-200 rounded-lg p-12">
              <div className="text-center py-16">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-base text-gray-600">
                  {language === "en" ? "Calendar view coming soon" : "Muonekano wa kalenda unakuja hivi karibuni"}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* SOIL TAB */}
          <TabsContent value="soil">
            <div className="bg-white border border-gray-200 rounded-lg p-12">
              <div className="text-center py-16">
                <Beaker className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-base text-gray-600">
                  {language === "en" ? "Soil tracking coming soon" : "Ufuatiliaji wa udongo unakuja hivi karibuni"}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* REVENUE TAB */}
          <TabsContent value="revenue">
            <div className="bg-white border border-gray-200 rounded-lg p-12">
              <div className="text-center py-16">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-base text-gray-600">
                  {language === "en" ? "Revenue analytics coming soon" : "Uchambuzi wa mapato unakuja hivi karibuni"}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* HISTORY TAB */}
          <TabsContent value="history">
            <div className="bg-white border border-gray-200 rounded-lg p-12">
              <div className="text-center py-16">
                <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-base text-gray-600">
                  {language === "en" ? "Historical analysis coming soon" : "Uchambuzi wa kihistoria unakuja hivi karibuni"}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {language === "en" ? "Create New Crop Plan" : "Tengeneza Mpango Mpya"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {language === "en" ? "AI will optimize your plan based on conditions" : "AI itaboresha mpango kulingana na hali"}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2 block">
                    {language === "en" ? "Crop" : "Mazao"}
                  </Label>
                  <select
                    value={newPlan.crop}
                    onChange={(e) => setNewPlan({...newPlan, crop: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                  >
                    <option>Maize</option>
                    <option>Rice</option>
                    <option>Beans</option>
                    <option>Cassava</option>
                    <option>Tomatoes</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2 block">
                    {language === "en" ? "Season" : "Msimu"}
                  </Label>
                  <select
                    value={newPlan.season}
                    onChange={(e) => setNewPlan({...newPlan, season: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                  >
                    <option>2025 Masika</option>
                    <option>2025 Vuli</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2 block">
                    {language === "en" ? "Location" : "Mahali"}
                  </Label>
                  <Input
                    value={newPlan.location}
                    onChange={(e) => setNewPlan({...newPlan, location: e.target.value})}
                    className="focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2 block">
                    {language === "en" ? "Field Size (hectares)" : "Ukubwa wa Shamba (hekta)"}
                  </Label>
                  <Input
                    type="number"
                    value={newPlan.field_size_ha}
                    onChange={(e) => setNewPlan({...newPlan, field_size_ha: Number(e.target.value)})}
                    className="focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-900 mb-3 block">
                  {language === "en" ? "Soil Data (Optional)" : "Data ya Udongo (Si lazima)"}
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-600 mb-1.5 block">pH</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newPlan.soil_data.ph}
                      onChange={(e) => setNewPlan({
                        ...newPlan,
                        soil_data: {...newPlan.soil_data, ph: Number(e.target.value)}
                      })}
                      className="focus:ring-2 focus:ring-[#2E7D32]"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 mb-1.5 block">
                      {language === "en" ? "Nitrogen" : "Nitrojeni"}
                    </Label>
                    <select
                      value={newPlan.soil_data.nitrogen}
                      onChange={(e) => setNewPlan({
                        ...newPlan,
                        soil_data: {...newPlan.soil_data, nitrogen: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                    >
                      <option>low</option>
                      <option>medium</option>
                      <option>high</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {language === "en" ? "Cancel" : "Ghairi"}
              </Button>
              <Button
                onClick={generateCropPlan}
                disabled={loading}
                className="flex-1 bg-[#2E7D32] hover:bg-[rgba(46,125,50,0.9)] text-white"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {language === "en" ? "Generating..." : "Inatengeneza..."}
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    {language === "en" ? "Generate Plan" : "Tengeneza Mpango"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}