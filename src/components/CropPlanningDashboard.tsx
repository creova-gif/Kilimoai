import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import {
  Leaf,
  Calendar,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Brain,
  Plus,
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
  Beaker,
  Globe,
  ChevronDown,
  Share2,
  Settings,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Filter
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

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "planting" | "fertilization" | "irrigation" | "harvest" | "pest-control";
  status: "pending" | "completed" | "alert";
  aiGenerated: boolean;
}

interface CropPlanningDashboardProps {
  userId: string;
  language?: "en" | "sw";
}

export function CropPlanningDashboard({ userId, language = "en" }: CropPlanningDashboardProps) {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "sw">(language);
  const [selectedSeason, setSelectedSeason] = useState("2025 Masika");
  const [selectedField, setSelectedField] = useState("Block A");
  const [cropPlans, setCropPlans] = useState<CropPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<CropPlan | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  
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

  // Key metrics
  const [metrics, setMetrics] = useState({
    yieldForecast: { min: 4200, expected: 5000, max: 5800 },
    expectedRevenue: 6500000,
    soilHealthIndex: 78,
    riskLevel: "medium",
    activePlans: 3
  });

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

  useEffect(() => {
    loadCropPlans();
    loadCalendarEvents();
  }, [selectedSeason, selectedField]);

  const loadCropPlans = async () => {
    setLoading(true);
    try {
      // Simulate loading from backend
      // In production, this would fetch from Supabase
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    } catch (error) {
      console.error("Load crop plans error:", error);
      setLoading(false);
    }
  };

  const loadCalendarEvents = () => {
    // Sample calendar events
    const events: CalendarEvent[] = [
      {
        id: "1",
        title: "Planting - Maize",
        date: "2025-03-15",
        type: "planting",
        status: "pending",
        aiGenerated: true
      },
      {
        id: "2",
        title: "Apply DAP Fertilizer",
        date: "2025-04-15",
        type: "fertilization",
        status: "pending",
        aiGenerated: true
      },
      {
        id: "3",
        title: "Irrigation Check",
        date: "2025-04-20",
        type: "irrigation",
        status: "alert",
        aiGenerated: true
      },
      {
        id: "4",
        title: "Pest Control Spray",
        date: "2025-05-01",
        type: "pest-control",
        status: "pending",
        aiGenerated: false
      },
      {
        id: "5",
        title: "Harvest - Maize Block A",
        date: "2025-07-15",
        type: "harvest",
        status: "pending",
        aiGenerated: true
      }
    ];
    setCalendarEvents(events);
  };

  const handleCreateCropPlan = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/ai/crop-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          user_id: userId,
          ...newPlan
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create crop plan");
      }

      const data = await response.json();
      
      toast.success(currentLanguage === "en" 
        ? "Crop plan created successfully!" 
        : "Mpango wa mazao umeundwa!");
      
      setShowCreateModal(false);
      loadCropPlans();
    } catch (error: any) {
      toast.error(currentLanguage === "en"
        ? "Failed to create crop plan"
        : "Imeshindwa kuunda mpango");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizePlan = async (planId: string) => {
    setOptimizing(true);
    try {
      // Call AI optimization endpoint
      toast.success(currentLanguage === "en"
        ? "AI optimization complete!"
        : "Urekebishaji wa AI umekamilika!");
      
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        yieldForecast: {
          min: prev.yieldForecast.min + 200,
          expected: prev.yieldForecast.expected + 300,
          max: prev.yieldForecast.max + 400
        }
      }));
    } catch (error) {
      toast.error("Optimization failed");
    } finally {
      setOptimizing(false);
    }
  };

  const handleViewHistory = async () => {
    setShowHistoryModal(true);
    // Load historical data
  };

  const getEventColor = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "planting": return "bg-green-100 text-green-800 border-green-300";
      case "fertilization": return "bg-blue-100 text-blue-800 border-blue-300";
      case "irrigation": return "bg-cyan-100 text-cyan-800 border-cyan-300";
      case "harvest": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "pest-control": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: CalendarEvent["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "alert": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600 bg-green-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "high": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const translations = {
    en: {
      title: "Crop Planning & Management",
      createNew: "Create New Crop Plan",
      viewHistory: "View Crop History",
      export: "Export",
      share: "Share",
      optimize: "Optimize Plan",
      yieldForecast: "Yield Forecast",
      expectedRevenue: "Expected Revenue",
      soilHealth: "Soil Health Index",
      riskAlerts: "Risk Alerts",
      calendar: "Calendar & Timeline",
      aiSuggestions: "AI Suggestions",
      activePlans: "Active Plans",
      historicalPlans: "Historical Plans",
      metrics: "Key Metrics",
      kgPerHa: "kg/ha",
      tzs: "TZS"
    },
    sw: {
      title: "Mipango ya Mazao na Usimamizi",
      createNew: "Unda Mpango Mpya",
      viewHistory: "Angalia Historia",
      export: "Hamisha",
      share: "Shiriki",
      optimize: "Boresha Mpango",
      yieldForecast: "Utabiri wa Mavuno",
      expectedRevenue: "Mapato Yanayotarajiwa",
      soilHealth: "Afya ya Udongo",
      riskAlerts: "Tahadhari za Hatari",
      calendar: "Kalenda na Ratiba",
      aiSuggestions: "Mapendekezo ya AI",
      activePlans: "Mipango Inayoendelea",
      historicalPlans: "Mipango ya Zamani",
      metrics: "Vipimo Muhimu",
      kgPerHa: "kg/ha",
      tzs: "TZS"
    }
  };

  const t = translations[currentLanguage];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 lg:p-6 pb-24 lg:pb-8">
      {/* Header & Overview */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
              <Leaf className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">{t.title}</h1>
              <p className="text-green-100 flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4" />
                {selectedField} • {selectedSeason}
              </p>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={currentLanguage === "en" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCurrentLanguage("en")}
              className={currentLanguage === "en" ? "" : "text-white hover:text-white"}
            >
              <Globe className="w-4 h-4 mr-2" />
              EN
            </Button>
            <Button
              variant={currentLanguage === "sw" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCurrentLanguage("sw")}
              className={currentLanguage === "sw" ? "" : "text-white hover:text-white"}
            >
              <Globe className="w-4 h-4 mr-2" />
              SW
            </Button>
          </div>
        </div>

        {/* Selectors */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="space-y-2">
            <Label className="text-white text-sm">{currentLanguage === "en" ? "Season" : "Msimu"}</Label>
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025 Masika">2025 Masika (Long Rains)</SelectItem>
                <SelectItem value="2025 Vuli">2025 Vuli (Short Rains)</SelectItem>
                <SelectItem value="2024 Masika">2024 Masika</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white text-sm">{currentLanguage === "en" ? "Field / Block" : "Shamba / Kipande"}</Label>
            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Block A">Block A (25 ha)</SelectItem>
                <SelectItem value="Block B">Block B (15 ha)</SelectItem>
                <SelectItem value="Block C">Block C (10 ha)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-initial">
              <Plus className="w-4 h-4 mr-2" />
              {t.createNew}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.createNew}</DialogTitle>
              <DialogDescription>
                {currentLanguage === "en" 
                  ? "AI will generate optimized recommendations based on your inputs"
                  : "AI itaunda mapendekezo bora kulingana na taarifa zako"}
              </DialogDescription>
            </DialogHeader>

            {/* Create Plan Form */}
            <div className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{currentLanguage === "en" ? "Crop Type" : "Aina ya Zao"}</Label>
                  <Select value={newPlan.crop} onValueChange={(value) => setNewPlan({...newPlan, crop: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maize">Maize (Mahindi)</SelectItem>
                      <SelectItem value="Rice">Rice (Mchele)</SelectItem>
                      <SelectItem value="Beans">Beans (Maharagwe)</SelectItem>
                      <SelectItem value="Cassava">Cassava (Muhogo)</SelectItem>
                      <SelectItem value="Tomatoes">Tomatoes (Nyanya)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{currentLanguage === "en" ? "Field Size (hectares)" : "Ukubwa wa Shamba (hekta)"}</Label>
                  <Input 
                    type="number" 
                    value={newPlan.field_size_ha}
                    onChange={(e) => setNewPlan({...newPlan, field_size_ha: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{currentLanguage === "en" ? "Location" : "Eneo"}</Label>
                <Input 
                  value={newPlan.location}
                  onChange={(e) => setNewPlan({...newPlan, location: e.target.value})}
                  placeholder="e.g., Morogoro, Dodoma"
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Beaker className="w-4 h-4" />
                  {currentLanguage === "en" ? "Soil Data (Optional)" : "Taarifa za Udongo (Si Lazima)"}
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>pH</Label>
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
                  <div className="space-y-2">
                    <Label>{currentLanguage === "en" ? "Nitrogen Level" : "Kiwango cha Nitrojeni"}</Label>
                    <Select 
                      value={newPlan.soil_data.nitrogen}
                      onValueChange={(value) => setNewPlan({
                        ...newPlan,
                        soil_data: {...newPlan.soil_data, nitrogen: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Chini)</SelectItem>
                        <SelectItem value="medium">Medium (Wastani)</SelectItem>
                        <SelectItem value="high">High (Juu)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCreateCropPlan} 
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {currentLanguage === "en" ? "Generating AI Plan..." : "Kuunda Mpango wa AI..."}
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    {currentLanguage === "en" ? "Generate AI Crop Plan" : "Unda Mpango wa AI"}
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={handleViewHistory}>
          <History className="w-4 h-4 mr-2" />
          {t.viewHistory}
        </Button>

        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          {t.export}
        </Button>

        <Button variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          {t.share}
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Yield Forecast */}
        <Card className="border-green-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
              <Target className="w-4 h-4" />
              {t.yieldForecast}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">
                {metrics.yieldForecast.expected.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">{t.kgPerHa}</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Min: {metrics.yieldForecast.min}</span>
                <span className="text-gray-500">Max: {metrics.yieldForecast.max}</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Expected Revenue */}
        <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              {t.expectedRevenue}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">
                {(metrics.expectedRevenue / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">{t.tzs}</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <ArrowUpRight className="w-4 h-4" />
                <span>+15% vs last season</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Soil Health Index */}
        <Card className="border-blue-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
              <Beaker className="w-4 h-4" />
              {t.soilHealth}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">
                {metrics.soilHealthIndex}
              </div>
              <div className="text-sm text-gray-600">Score / 100</div>
              <Progress value={metrics.soilHealthIndex} className="h-2" />
              <Badge className="bg-green-100 text-green-800 text-xs">
                Good Health
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Risk Alerts */}
        <Card className="border-orange-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
              <AlertTriangle className="w-4 h-4" />
              {t.riskAlerts}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getRiskColor(metrics.riskLevel)}`}>
                <div className="text-2xl font-bold capitalize">{metrics.riskLevel}</div>
              </div>
              <div className="text-sm text-gray-600">Risk Level</div>
              <div className="space-y-1 mt-3">
                <div className="flex items-center gap-2 text-xs text-yellow-700">
                  <AlertTriangle className="w-3 h-3" />
                  Nitrogen deficiency
                </div>
                <div className="flex items-center gap-2 text-xs text-yellow-700">
                  <AlertTriangle className="w-3 h-3" />
                  Late rainfall risk
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Calendar & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                {t.calendar}
              </CardTitle>
              <CardDescription>
                {currentLanguage === "en"
                  ? "AI-generated schedule with color-coded activities"
                  : "Ratiba iliyoundwa na AI na shughuli zilizopangwa kwa rangi"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {calendarEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border-2 ${getEventColor(event.type)} transition-all hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(event.status)}
                          <h4 className="font-semibold">{event.title}</h4>
                          {event.aiGenerated && (
                            <Badge className="bg-purple-100 text-purple-800 text-xs">
                              <Brain className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4">
                <Plus className="w-4 h-4 mr-2" />
                {currentLanguage === "en" ? "Add Custom Event" : "Ongeza Tukio"}
              </Button>
            </CardContent>
          </Card>

          {/* Active Crop Plans Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-green-600" />
                {t.activePlans}
              </CardTitle>
              <CardDescription>
                {metrics.activePlans} {currentLanguage === "en" ? "plans in progress" : "mipango inayoendelea"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Sample Active Plan Card */}
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">Maize - Block A</h4>
                      <p className="text-sm text-gray-600">2025 Masika • 25 hectares</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Seed Variety</p>
                      <p className="font-semibold">UH6303 Hybrid</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Planting Window</p>
                      <p className="font-semibold">Mar 15-30</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Expected Yield</p>
                      <p className="font-semibold">5000 kg/ha</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Revenue</p>
                      <p className="font-semibold">6.5M TZS</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleOptimizePlan("1")}
                      disabled={optimizing}
                    >
                      {optimizing ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4 mr-2" />
                      )}
                      {t.optimize}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - AI Suggestions Panel */}
        <div className="space-y-6">
          <Card className="border-purple-200 sticky top-4">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Brain className="w-5 h-5" />
                {t.aiSuggestions}
              </CardTitle>
              <CardDescription className="text-purple-700">
                {currentLanguage === "en"
                  ? "Real-time AI-powered recommendations"
                  : "Mapendekezo ya AI ya wakati halisi"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 mt-4">
              {/* AI Suggestion Card 1 */}
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 mb-1">
                      {currentLanguage === "en" ? "Optimal Planting Time" : "Wakati Bora wa Kupanda"}
                    </h4>
                    <p className="text-sm text-green-800">
                      {currentLanguage === "en"
                        ? "Plant between March 15-20 for maximum yield. Weather forecast shows ideal rainfall."
                        : "Panda kati ya Machi 15-20 kwa mavuno bora. Utabiri wa hali ya hewa unaonesha mvua nzuri."}
                    </p>
                    <Button size="sm" variant="ghost" className="mt-2 text-green-700 hover:text-green-900 h-auto p-0">
                      {currentLanguage === "en" ? "Apply Suggestion" : "Tumia Pendekezo"} →
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Suggestion Card 2 */}
              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-900 mb-1">
                      {currentLanguage === "en" ? "Increase Fertilizer" : "Ongeza Mbolea"}
                    </h4>
                    <p className="text-sm text-yellow-800">
                      {currentLanguage === "en"
                        ? "Soil tests show low nitrogen. Recommend increasing DAP to 60kg/ha for +12% yield boost."
                        : "Upimaji wa udongo unaonesha nitrojeni chini. Tunapendekeza kuongeza DAP hadi 60kg/ha kwa kuongeza mavuno +12%."}
                    </p>
                    <Button size="sm" variant="ghost" className="mt-2 text-yellow-700 hover:text-yellow-900 h-auto p-0">
                      {currentLanguage === "en" ? "View Details" : "Angalia Maelezo"} →
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Suggestion Card 3 */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <Droplets className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-1">
                      {currentLanguage === "en" ? "Irrigation Schedule" : "Ratiba ya Umwagiliaji"}
                    </h4>
                    <p className="text-sm text-blue-800">
                      {currentLanguage === "en"
                        ? "Dry spell expected April 20-30. Schedule supplemental irrigation to maintain soil moisture."
                        : "Ukame unatarajiwa Aprili 20-30. Panga umwagiliaji wa ziada kudumisha unyevu wa udongo."}
                    </p>
                    <Button size="sm" variant="ghost" className="mt-2 text-blue-700 hover:text-blue-900 h-auto p-0">
                      {currentLanguage === "en" ? "Add to Calendar" : "Ongeza Kalenda"} →
                    </Button>
                  </div>
                </div>
              </div>

              {/* Request New Analysis */}
              <Button 
                variant="outline" 
                className="w-full mt-4 border-purple-300 text-purple-700 hover:bg-purple-50"
                onClick={() => toast.info("AI analysis in progress...")}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {currentLanguage === "en" ? "Request New Analysis" : "Omba Uchambuzi Mpya"}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {currentLanguage === "en" ? "Quick Stats" : "Takwimu za Haraka"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {currentLanguage === "en" ? "Total Farm Area" : "Jumla ya Eneo"}
                </span>
                <span className="font-semibold">50 ha</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {currentLanguage === "en" ? "Active Crops" : "Mazao Yanayolimwa"}
                </span>
                <span className="font-semibold">3 crops</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {currentLanguage === "en" ? "Season Progress" : "Mwenendo wa Msimu"}
                </span>
                <span className="font-semibold">35%</span>
              </div>
              <Progress value={35} className="h-2" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Historical Plans Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              {t.historicalPlans}
            </DialogTitle>
            <DialogDescription>
              {currentLanguage === "en"
                ? "Compare past crop plans with AI-powered insights"
                : "Linganisha mipango ya zamani na mapendekezo ya AI"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Sample Historical Plan */}
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg">Maize - Block A</h4>
                  <p className="text-sm text-gray-600">2024 Masika • 25 hectares</p>
                </div>
                <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 mb-1">Actual Yield</p>
                  <p className="font-bold text-blue-900">4800 kg/ha</p>
                  <p className="text-xs text-blue-600">vs 5000 target</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-600 mb-1">Revenue</p>
                  <p className="font-bold text-green-900">5.6M TZS</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    +12% vs 2023
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-600 mb-1">AI Score</p>
                  <p className="font-bold text-purple-900">78/100</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  {currentLanguage === "en" ? "AI Performance Analysis" : "Uchambuzi wa Utendaji wa AI"}
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">
                        {currentLanguage === "en" ? "What Worked:" : "Nilichofanya Vizuri:"}
                      </p>
                      <p className="text-gray-700">
                        {currentLanguage === "en"
                          ? "Earlier planting (+10 days), increased compost application"
                          : "Kupanda mapema (+siku 10), kuongeza mbolea asili"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">
                        {currentLanguage === "en" ? "Needs Improvement:" : "Inahitaji Kuboresha:"}
                      </p>
                      <p className="text-gray-700">
                        {currentLanguage === "en"
                          ? "Nitrogen levels still low, harvest timing 3 days late"
                          : "Nitrojeni bado ni chini, mavuno yalichelewa siku 3"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                {currentLanguage === "en" ? "View Full Report" : "Angalia Ripoti Kamili"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}