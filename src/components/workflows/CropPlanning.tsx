import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  Sprout, 
  Calendar, 
  Cloud, 
  Droplet, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  MapPin
} from "lucide-react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface CropPlan {
  id: string;
  cropName: string;
  variety: string;
  plantingDate: string;
  expectedHarvest: string;
  farmSize: number;
  region: string;
  soilType: string;
  irrigationType: string;
  aiRecommendations: {
    optimalPlantingWindow: string;
    expectedYield: string;
    fertilizerSchedule: string[];
    pestManagement: string[];
    waterRequirements: string;
    riskFactors: string[];
    profitability: {
      estimatedCost: number;
      estimatedRevenue: number;
      netProfit: number;
      roi: number;
    };
  };
  status: "planning" | "scheduled" | "planted" | "growing" | "harvested";
}

interface CropPlanningProps {
  userId: string;
  userRole: string;
}

const TANZANIA_CROPS = [
  "Maize", "Rice", "Wheat", "Sorghum", "Millet", "Cassava", "Sweet Potatoes",
  "Beans", "Cowpeas", "Pigeon Peas", "Groundnuts", "Sunflower", "Cotton",
  "Coffee", "Tea", "Cashew Nuts", "Tobacco", "Sugarcane", "Tomatoes",
  "Onions", "Cabbage", "Spinach", "Okra", "Avocado", "Mango", "Banana"
];

const SOIL_TYPES = ["Sandy", "Loamy", "Clay", "Silty", "Sandy Loam", "Clay Loam"];
const IRRIGATION_TYPES = ["Rain-fed", "Drip", "Sprinkler", "Furrow", "Manual", "None"];

export function CropPlanning({ userId, userRole }: CropPlanningProps) {
  const [plans, setPlans] = useState<CropPlan[]>([]);
  const [showNewPlan, setShowNewPlan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  const [formData, setFormData] = useState({
    cropName: "",
    variety: "",
    plantingDate: "",
    farmSize: "",
    region: "",
    soilType: "",
    irrigationType: "Rain-fed"
  });

  useEffect(() => {
    loadPlans();
  }, [userId]);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/crop-plans/${userId}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      const data = await response.json();
      if (data.success) {
        setPlans(data.plans || []);
      }
    } catch (error) {
      console.error("Error loading crop plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIPlan = async () => {
    setGeneratingAI(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/crop-plans/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            userId,
            ...formData
          })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setPlans([data.plan, ...plans]);
        setShowNewPlan(false);
        setFormData({
          cropName: "",
          variety: "",
          plantingDate: "",
          farmSize: "",
          region: "",
          soilType: "",
          irrigationType: "Rain-fed"
        });
      } else {
        alert(data.error || "Failed to generate crop plan");
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      alert("Failed to generate crop plan");
    } finally {
      setGeneratingAI(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning": return "bg-gray-100 text-gray-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "planted": return "bg-green-100 text-green-800";
      case "growing": return "bg-yellow-100 text-yellow-800";
      case "harvested": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateDaysUntilPlanting = (plantingDate: string) => {
    const today = new Date();
    const planting = new Date(plantingDate);
    const diffTime = planting.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sprout className="h-6 w-6 text-[#2E7D32]" />
            AI Crop Planning & Scheduling
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            AI-powered crop selection, planting schedules, and yield forecasting
          </p>
        </div>
        <Button onClick={() => setShowNewPlan(true)} className="bg-[#2E7D32] hover:bg-[#2E7D32]/90">
          <Plus className="h-4 w-4 mr-2" />
          New AI Plan
        </Button>
      </div>

      {/* New Plan Form */}
      {showNewPlan && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle>Create AI-Powered Crop Plan</CardTitle>
            <CardDescription>
              Enter your crop details and let AI generate an optimized planting schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Crop Type</Label>
                <Select
                  value={formData.cropName}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, cropName: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {TANZANIA_CROPS.map(crop => (
                      <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Variety (Optional)</Label>
                <Input
                  placeholder="e.g., Hybrid H513"
                  value={formData.variety}
                  onChange={(e) => setFormData(prev => ({ ...prev, variety: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Planned Planting Date</Label>
                <Input
                  type="date"
                  value={formData.plantingDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, plantingDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Farm Size (acres)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 2.5"
                  value={formData.farmSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, farmSize: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Region</Label>
                <Input
                  placeholder="e.g., Morogoro"
                  value={formData.region}
                  onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Soil Type</Label>
                <Select
                  value={formData.soilType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, soilType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOIL_TYPES.map(soil => (
                      <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Irrigation Type</Label>
                <Select
                  value={formData.irrigationType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, irrigationType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IRRIGATION_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={generateAIPlan}
                disabled={!formData.cropName || !formData.plantingDate || generatingAI}
                className="bg-[#2E7D32] hover:bg-[#2E7D32]/90"
              >
                {generatingAI ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating AI Plan...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate AI Plan
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowNewPlan(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#2E7D32]" />
        </div>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sprout className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-semibold mb-2">No crop plans yet</h3>
            <p className="text-sm text-gray-600 mb-4">
              Create your first AI-powered crop plan to get started
            </p>
            <Button onClick={() => setShowNewPlan(true)} className="bg-[#2E7D32] hover:bg-[#2E7D32]/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {plans.map(plan => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sprout className="h-5 w-5 text-[#2E7D32]" />
                      {plan.cropName}
                      {plan.variety && (
                        <span className="text-sm font-normal text-gray-500">
                          ({plan.variety})
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {plan.region}
                      </span>
                      <span>{plan.farmSize} acres</span>
                      <span>{plan.soilType} soil</span>
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(plan.status)}>
                    {plan.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Timeline */}
                <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Planting Date</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-[#2E7D32]" />
                      {new Date(plan.plantingDate).toLocaleDateString()}
                    </p>
                    {calculateDaysUntilPlanting(plan.plantingDate) > 0 && (
                      <p className="text-xs text-gray-600 mt-1">
                        {calculateDaysUntilPlanting(plan.plantingDate)} days away
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Expected Harvest</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-[#2E7D32]" />
                      {plan.expectedHarvest}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Water Needs</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Droplet className="h-4 w-4 text-[#2E7D32]" />
                      {plan.aiRecommendations.waterRequirements}
                    </p>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">
                    AI Recommendations
                  </h4>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-600">Optimal Planting Window</p>
                      <p className="text-sm bg-gray-50 p-2 rounded border border-gray-200">
                        {plan.aiRecommendations.optimalPlantingWindow}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-600">Expected Yield</p>
                      <p className="text-sm bg-gray-50 p-2 rounded border border-gray-200 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-[#2E7D32]" />
                        {plan.aiRecommendations.expectedYield}
                      </p>
                    </div>
                  </div>

                  {/* Fertilizer Schedule */}
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Fertilizer Schedule</p>
                    <div className="space-y-1">
                      {plan.aiRecommendations.fertilizerSchedule.map((schedule, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-[#2E7D32] mt-0.5" />
                          <span>{schedule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pest Management */}
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Pest Management</p>
                    <div className="space-y-1">
                      {plan.aiRecommendations.pestManagement.map((pest, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-[#2E7D32] mt-0.5" />
                          <span>{pest}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Factors */}
                  {plan.aiRecommendations.riskFactors.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-2">Risk Factors</p>
                      <div className="space-y-1">
                        {plan.aiRecommendations.riskFactors.map((risk, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-orange-700">
                            <AlertCircle className="h-4 w-4 mt-0.5" />
                            <span>{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Profitability Analysis */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-[#2E7D32]" />
                      Profitability Analysis
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Estimated Cost</p>
                        <p className="font-bold text-gray-900">
                          TZS {plan.aiRecommendations.profitability.estimatedCost.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Estimated Revenue</p>
                        <p className="font-bold text-[#2E7D32]">
                          TZS {plan.aiRecommendations.profitability.estimatedRevenue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Net Profit</p>
                        <p className="font-bold text-gray-900">
                          TZS {plan.aiRecommendations.profitability.netProfit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">ROI</p>
                        <p className="font-bold text-gray-900">
                          {plan.aiRecommendations.profitability.roi}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}