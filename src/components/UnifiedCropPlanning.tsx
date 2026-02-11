import { useState, useEffect } from "react";
import { Calendar, Plus, Copy, ChevronDown, MapPin, TrendingUp, Clock, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

/**
 * CROP PLANNING PAGE - Execution Layer
 * 
 * PURPOSE: "What am I growing, where, when, and how much THIS season?"
 * 
 * ✅ Season-based planning
 * ✅ Field allocation
 * ✅ Planting timelines
 * ✅ Yield & revenue forecasts
 * ✅ Auto-generated tasks
 * 
 * ❌ NO crop knowledge
 * ❌ NO crop library
 * ❌ NO educational content
 */

interface CropPlan {
  id: string;
  crop: string;
  field: string;
  area_ha: number;
  planting_date: string;
  harvest_date: string;
  status: "planned" | "active" | "harvested";
  yield_forecast: {
    expected_kg: number;
    confidence: "low" | "medium" | "high";
  };
  revenue_forecast: {
    expected_tzs: number;
    confidence: "low" | "medium" | "high";
  };
  tasks_count: number;
}

interface Field {
  id: string;
  name: string;
  size_ha: number;
  assigned_crop?: string;
  status: "available" | "assigned";
}

interface UnifiedCropPlanningProps {
  userId: string;
  totalFarmSize: number;
  language: string;
  apiBase: string;
  authToken: string;
  initialTab?: string;
  onNavigate?: (tab: string) => void;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

export function UnifiedCropPlanning({
  userId,
  totalFarmSize,
  language,
  onNavigate
}: UnifiedCropPlanningProps) {
  const [selectedSeason, setSelectedSeason] = useState("2026-masika");
  const [seasonStatus, setSeasonStatus] = useState<"planned" | "active" | "harvested">("active");
  const [cropPlans, setCropPlans] = useState<CropPlan[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Translations
  const text = {
    title: language === "sw" ? "Mipango ya Mazao" : "Crop Planning",
    subtitle: language === "sw" 
      ? "Panga, ratibisha, na simamia unavyopanda msimu huu"
      : "Plan, schedule, and manage what you are growing this season",
    autoCalc: language === "sw"
      ? "Hesabu zote zinapatikana kiotomatiki kutoka kwa violezo vyako"
      : "All calculations are generated automatically from your templates",
    seasonLabel: language === "sw" ? "Msimu" : "Season",
    fieldAllocation: language === "sw" ? "Mgawanyo wa Mashamba" : "Field Allocation",
    plantingTimeline: language === "sw" ? "Ratiba ya Kupanda" : "Plantings Timeline",
    yieldRevenue: language === "sw" ? "Mavuno na Mapato" : "Yield & Revenue",
    autoTasks: language === "sw" ? "Kazi Zinazopatikana" : "Auto-Generated Tasks",
    createPlan: language === "sw" ? "Unda Mpango Mpya" : "Create New Crop Plan",
    duplicateLast: language === "sw" ? "Nakili Msimu Uliopita" : "Duplicate Last Season",
    viewInTasks: language === "sw" ? "Ona katika Kazi" : "View in Tasks",
    noCrops: language === "sw" ? "Hakuna mazao yaliyopangwa" : "No crops planned yet",
    startPlanning: language === "sw" ? "Anza kupanga msimu wako" : "Start planning your season",
    unassigned: language === "sw" ? "Haijapangwa" : "Unassigned",
    confidence: {
      low: language === "sw" ? "Chini" : "Low",
      medium: language === "sw" ? "Wastani" : "Medium",
      high: language === "sw" ? "Juu" : "High"
    },
    status: {
      planned: language === "sw" ? "Imepangwa" : "Planned",
      active: language === "sw" ? "Inaendelea" : "Active",
      harvested: language === "sw" ? "Imevunwa" : "Harvested"
    }
  };

  // Load sample data
  useEffect(() => {
    loadPlanningData();
  }, [selectedSeason]);

  async function loadPlanningData() {
    setLoading(true);
    
    // Sample fields
    const sampleFields: Field[] = [
      { id: "f1", name: "Block A", size_ha: 2.5, assigned_crop: "Maize", status: "assigned" },
      { id: "f2", name: "Block B", size_ha: 1.8, assigned_crop: "Beans", status: "assigned" },
      { id: "f3", name: "Block C", size_ha: 1.2, status: "available" },
      { id: "f4", name: "South Field", size_ha: 0.5, status: "available" }
    ];

    // Sample crop plans
    const samplePlans: CropPlan[] = [
      {
        id: "p1",
        crop: "Maize (Hybrid H614)",
        field: "Block A",
        area_ha: 2.5,
        planting_date: "2026-03-01",
        harvest_date: "2026-07-15",
        status: "active",
        yield_forecast: { expected_kg: 8750, confidence: "high" },
        revenue_forecast: { expected_tzs: 6125000, confidence: "high" },
        tasks_count: 12
      },
      {
        id: "p2",
        crop: "Beans (Lyamungu 90)",
        field: "Block B",
        area_ha: 1.8,
        planting_date: "2026-03-10",
        harvest_date: "2026-06-20",
        status: "active",
        yield_forecast: { expected_kg: 2160, confidence: "medium" },
        revenue_forecast: { expected_tzs: 4320000, confidence: "medium" },
        tasks_count: 8
      }
    ];

    setFields(sampleFields);
    setCropPlans(samplePlans);
    setLoading(false);
  }

  function handleCreatePlan() {
    toast.success(
      language === "sw"
        ? "Inafungua kiolezo cha mazao..."
        : "Opening crop template selector..."
    );
    // In production: open template selector or planning wizard
  }

  function handleDuplicateSeason() {
    toast.success(
      language === "sw"
        ? "Inanakili mipango ya msimu uliopita..."
        : "Duplicating previous season plans..."
    );
  }

  const totalYield = cropPlans.reduce((sum, p) => sum + p.yield_forecast.expected_kg, 0);
  const totalRevenue = cropPlans.reduce((sum, p) => sum + p.revenue_forecast.expected_tzs, 0);
  const unassignedFields = fields.filter(f => f.status === "available");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ========== 1. INTRO BLOCK ========== */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {text.title}
              </h1>
              <p className="text-sm text-gray-600 mb-2">
                {text.subtitle}
              </p>
              <p className="text-xs text-gray-500">
                {text.autoCalc}
              </p>
            </div>

            {/* Cross-link to Intelligence */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate?.("crop-library")}
              className="hidden sm:flex items-center gap-1.5 text-[#2E7D32] border-[#2E7D32]/30 hover:bg-[#2E7D32]/5"
            >
              <span className="text-xs font-medium">Crop Library</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* ========== 2. SEASON SELECTOR ========== */}
        <Card className="border border-gray-200 shadow-sm">
          <div className="p-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              {text.seasonLabel}
            </label>
            <div className="flex items-center gap-3">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
              >
                <option value="2026-masika">2026 Masika (Long Rains)</option>
                <option value="2025-vuli">2025 Vuli (Short Rains)</option>
                <option value="2025-masika">2025 Masika (Long Rains)</option>
              </select>
              <Badge
                className={`px-3 py-1 ${
                  seasonStatus === "active"
                    ? "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/20"
                    : seasonStatus === "planned"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {text.status[seasonStatus]}
              </Badge>
            </div>
          </div>
        </Card>

        {/* ========== 3. FIELD / LAND ALLOCATION ========== */}
        <Card className="border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              {text.fieldAllocation}
            </h2>
          </div>
          <div className="p-4 space-y-2">
            {fields.map((field) => (
              <div
                key={field.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  field.status === "assigned"
                    ? "border-[#2E7D32]/20 bg-[#2E7D32]/5"
                    : "border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className={`h-4 w-4 ${
                    field.status === "assigned" ? "text-[#2E7D32]" : "text-gray-400"
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {field.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {field.size_ha} ha
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {field.assigned_crop ? (
                    <span className="text-sm font-medium text-[#2E7D32]">
                      {field.assigned_crop}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">
                      {text.unassigned}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {unassignedFields.length > 0 && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed border-[#2E7D32]/30 text-[#2E7D32] hover:bg-[#2E7D32]/5"
                  onClick={handleCreatePlan}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Crop to {unassignedFields.length} Available Field{unassignedFields.length > 1 ? 's' : ''}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* ========== 4. PLANTINGS TIMELINE ========== */}
        <Card className="border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              {text.plantingTimeline}
            </h2>
          </div>
          <div className="p-4">
            {cropPlans.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {text.noCrops}
                </p>
                <p className="text-xs text-gray-500">
                  {text.startPlanning}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cropPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-start gap-4 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className={`h-2 w-2 rounded-full ${
                        plan.status === "active" ? "bg-[#2E7D32]" : "bg-gray-300"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {plan.crop}
                          </div>
                          <div className="text-xs text-gray-500">
                            {plan.field} · {plan.area_ha} ha
                          </div>
                        </div>
                        <Badge
                          className={`px-2 py-0.5 text-xs ${
                            plan.status === "active"
                              ? "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/20"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                        >
                          {text.status[plan.status]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          Plant: {new Date(plan.planting_date).toLocaleDateString()}
                        </span>
                        <span>→</span>
                        <span>
                          Harvest: {new Date(plan.harvest_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* ========== 5. YIELD & REVENUE SUMMARY ========== */}
        {cropPlans.length > 0 && (
          <Card className="border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">
                {text.yieldRevenue}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {language === "sw" ? "Takwimu zinapatikana kiotomatiki" : "Derived values only"}
              </p>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {cropPlans.map((plan) => (
                <div key={plan.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-xs font-medium text-gray-700">
                      {plan.crop.split(" (")[0]}
                    </div>
                    <Badge className={`px-2 py-0.5 text-[10px] ${
                      plan.yield_forecast.confidence === "high"
                        ? "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/20"
                        : plan.yield_forecast.confidence === "medium"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}>
                      {text.confidence[plan.yield_forecast.confidence]}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-gray-600">Expected Yield</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {plan.yield_forecast.expected_kg.toLocaleString()} kg
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-gray-600">Est. Revenue</span>
                      <span className="text-sm font-semibold text-[#2E7D32]">
                        {(plan.revenue_forecast.expected_tzs / 1000000).toFixed(2)}M TZS
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="md:col-span-2 p-4 rounded-lg bg-[#2E7D32]/5 border border-[#2E7D32]/20">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Total Expected Yield</div>
                    <div className="text-xl font-bold text-gray-900">
                      {totalYield.toLocaleString()} kg
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Total Est. Revenue</div>
                    <div className="text-xl font-bold text-[#2E7D32]">
                      {(totalRevenue / 1000000).toFixed(2)}M TZS
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ========== 6. AUTO-GENERATED TASKS PREVIEW ========== */}
        {cropPlans.length > 0 && (
          <Card className="border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {text.autoTasks}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {language === "sw" 
                    ? "Kazi zimejengwa kutoka kwa violezo vyako"
                    : "Tasks generated from your crop templates"
                  }
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate?.("tasks")}
                className="text-[#2E7D32] border-[#2E7D32]/30 hover:bg-[#2E7D32]/5"
              >
                {text.viewInTasks}
                <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </div>
            <div className="p-4 space-y-2">
              {cropPlans.slice(0, 3).map((plan, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded border border-gray-100">
                  <CheckCircle2 className="h-4 w-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-900">
                      {plan.crop.split(" (")[0]} - {language === "sw" ? "Nyunyiza mbolea" : "Apply fertilizer"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {language === "sw" ? "Ijayo" : "Upcoming"} · {plan.tasks_count} {language === "sw" ? "kazi" : "tasks"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ========== 7. PRIMARY ACTIONS ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-6">
          <Button
            onClick={handleCreatePlan}
            className="h-12 bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            {text.createPlan}
          </Button>
          <Button
            onClick={handleDuplicateSeason}
            variant="outline"
            className="h-12 border-[#2E7D32]/30 text-[#2E7D32] hover:bg-[#2E7D32]/5 font-medium"
          >
            <Copy className="h-4 w-4 mr-2" />
            {text.duplicateLast}
          </Button>
        </div>
      </div>
    </div>
  );
}

UnifiedCropPlanning.displayName = "UnifiedCropPlanning";
