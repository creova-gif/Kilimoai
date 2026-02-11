import { useState } from "react";
import { BookOpen, Search, Filter, ExternalLink, Target, TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { CropLibrary } from "./CropLibrary";
import { CropSpecificTips } from "./CropSpecificTips";

/**
 * CROP INTELLIGENCE PAGE - Knowledge Layer
 * 
 * PURPOSE: "What do I know about this crop, and how can I grow it better?"
 * 
 * ✅ Crop library & varieties
 * ✅ Growing best practices
 * ✅ Reusable templates
 * ✅ AI optimization insights
 * ✅ Historical performance
 * 
 * ❌ NO planting dates
 * ❌ NO field allocation
 * ❌ NO season timelines
 * ❌ NO task calendars
 */

interface UnifiedCropIntelligenceProps {
  userId: string;
  totalFarmSize: number;
  language: string;
  apiBase: string;
  authToken: string;
  initialTab?: string;
  onNavigate?: (tab: string) => void;
}

type IntelligenceTab = "library" | "practices" | "templates" | "performance";

export function UnifiedCropIntelligence({
  userId,
  language,
  initialTab = "library",
  onNavigate
}: UnifiedCropIntelligenceProps) {
  const [activeTab, setActiveTab] = useState<IntelligenceTab>(initialTab as IntelligenceTab);

  // Translations
  const text = {
    title: language === "sw" ? "Akili ya Mazao" : "Crop Intelligence",
    subtitle: language === "sw"
      ? "Elewa mazao, boresha mbinu, na ongeza mavuno ya baadaye"
      : "Understand crops, optimize practices, and improve future yields",
    library: language === "sw" ? "Maktaba" : "Library",
    practices: language === "sw" ? "Mbinu Bora" : "Best Practices",
    templates: language === "sw" ? "Violezo" : "Templates",
    performance: language === "sw" ? "Historia" : "Performance"
  };

  const tabs = [
    { id: "library", label: text.library, icon: BookOpen },
    { id: "practices", label: text.practices, icon: Sparkles },
    { id: "templates", label: text.templates, icon: Target },
    { id: "performance", label: text.performance, icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ========== 1. INTRO BLOCK ========== */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {text.title}
              </h1>
              <p className="text-sm text-gray-600">
                {text.subtitle}
              </p>
            </div>

            {/* Cross-link to Planning */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate?.("land-allocation")}
              className="hidden sm:flex items-center gap-1.5 text-[#2E7D32] border-[#2E7D32]/30 hover:bg-[#2E7D32]/5"
            >
              <span className="text-xs font-medium">Apply to Crop Plan</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6 border-b border-gray-200 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as IntelligenceTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-[#2E7D32] text-[#2E7D32]"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "library" && (
          <div className="animate-in fade-in duration-300">
            <CropLibrary
              userId={userId}
              language={language as "en" | "sw"}
              onNavigate={onNavigate}
            />
          </div>
        )}

        {activeTab === "practices" && (
          <div className="animate-in fade-in duration-300">
            <CropSpecificTips userId={userId} language={language} />
          </div>
        )}

        {activeTab === "templates" && (
          <div className="animate-in fade-in duration-300">
            <GrowingTemplates userId={userId} language={language} onNavigate={onNavigate} />
          </div>
        )}

        {activeTab === "performance" && (
          <div className="animate-in fade-in duration-300">
            <HistoricalPerformance userId={userId} language={language} />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * GROWING TEMPLATES SECTION
 * Reusable cultivation templates with editable parameters
 */
function GrowingTemplates({ 
  userId, 
  language, 
  onNavigate 
}: { 
  userId: string; 
  language: string; 
  onNavigate?: (tab: string) => void 
}) {
  const text = {
    title: language === "sw" ? "Violezo vya Kilimo" : "Growing Templates",
    subtitle: language === "sw"
      ? "Violezo vinavyoweza kutumika tena kwa kilimo bora"
      : "Reusable cultivation templates for optimal growing",
    description: language === "sw"
      ? "Violezo vinaonyesha jinsi ya kulima zao. Badilisha vigezo na tumia kwenye mipango yako."
      : "Templates show how crops should be grown. Edit parameters and apply to your crop plans.",
    createTemplate: language === "sw" ? "Unda Kiolezo Kipya" : "Create New Template",
    applyToPlan: language === "sw" ? "Tumia kwenye Mpango" : "Apply to Crop Plan",
    noTemplates: language === "sw" ? "Hakuna violezo bado" : "No templates yet",
    startCreating: language === "sw"
      ? "Anza kuunda violezo vya mazao yako"
      : "Start creating templates for your crops"
  };

  // Sample templates
  const templates = [
    {
      id: "t1",
      crop: "Maize",
      variety: "Hybrid H614",
      type: "AI Generated",
      parameters: {
        spacing: "75cm × 25cm",
        fertilizer: "DAP + Urea",
        irrigation: "Rainfed",
        duration: "120 days"
      },
      confidence: "high" as const
    },
    {
      id: "t2",
      crop: "Beans",
      variety: "Lyamungu 90",
      type: "Community",
      parameters: {
        spacing: "40cm × 10cm",
        fertilizer: "DAP",
        irrigation: "Rainfed",
        duration: "90 days"
      },
      confidence: "medium" as const
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          {text.title}
        </h2>
        <p className="text-sm text-gray-600">
          {text.subtitle}
        </p>
      </div>

      {/* Info Card */}
      <Card className="border border-blue-200 bg-blue-50/50 mb-6">
        <div className="p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">
            {text.description}
          </p>
        </div>
      </Card>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <Card className="border border-gray-200 shadow-sm">
          <div className="p-12 text-center">
            <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {text.noTemplates}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {text.startCreating}
            </p>
            <Button className="bg-[#2E7D32] hover:bg-[#2E7D32]/90">
              <Target className="h-4 w-4 mr-2" />
              {text.createTemplate}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-gray-900">
                        {template.crop} - {template.variety}
                      </h3>
                      <Badge className={`px-2 py-0.5 text-xs ${
                        template.confidence === "high"
                          ? "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/20"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {template.confidence === "high" ? "High Confidence" : "Medium Confidence"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {template.type}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onNavigate?.("land-allocation")}
                    className="bg-[#2E7D32] hover:bg-[#2E7D32]/90"
                  >
                    {text.applyToPlan}
                  </Button>
                </div>

                {/* Template Parameters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(template.parameters).map(([key, value]) => (
                    <div key={key} className="p-2 rounded bg-gray-50 border border-gray-200">
                      <div className="text-xs text-gray-600 mb-0.5 capitalize">
                        {key}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}

          {/* Create New Button */}
          <Button
            variant="outline"
            className="w-full h-12 border-dashed border-[#2E7D32]/30 text-[#2E7D32] hover:bg-[#2E7D32]/5"
          >
            <Target className="h-4 w-4 mr-2" />
            {text.createTemplate}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * HISTORICAL PERFORMANCE SECTION
 * Cross-season yield analysis and AI learning insights
 */
function HistoricalPerformance({ 
  userId, 
  language 
}: { 
  userId: string; 
  language: string 
}) {
  const text = {
    title: language === "sw" ? "Utendaji wa Historia" : "Historical Performance",
    subtitle: language === "sw"
      ? "Angalia matokeo ya misimu iliyopita na jifunze kutoka kwa data yako"
      : "View past season results and learn from your data",
    description: language === "sw"
      ? "AI inajifunza kutoka kwa mavuno yako ya kweli ili kuboresha mipango na mapendekezo ya baadaye."
      : "AI learns from your actual yields to improve future plans and recommendations.",
    noData: language === "sw" ? "Hakuna data ya historia bado" : "No historical data yet",
    startTracking: language === "sw"
      ? "Anza kufuatilia mavuno yako kujenga historia"
      : "Start tracking your yields to build history",
    aiInsights: language === "sw" ? "Maarifa ya AI" : "AI Insights"
  };

  // Sample historical data
  const hasData = true;
  const historicalYields = [
    {
      season: "2025 Masika",
      crop: "Maize",
      predicted: 3500,
      actual: 3750,
      variance: "+7.1%",
      positive: true
    },
    {
      season: "2025 Masika",
      crop: "Beans",
      predicted: 1200,
      actual: 1050,
      variance: "-12.5%",
      positive: false
    },
    {
      season: "2024 Vuli",
      crop: "Maize",
      predicted: 3200,
      actual: 3100,
      variance: "-3.1%",
      positive: false
    }
  ];

  const aiInsights = [
    {
      title: language === "sw" ? "Boresha Mbolea" : "Optimize Fertilizer",
      description: language === "sw"
        ? "Mahindi yako yanapata mavuno bora zaidi wakati unatumia DAP + Urea kuliko DAP peke yake"
        : "Your maize performs better when using DAP + Urea vs DAP alone",
      impact: "+12% yield"
    },
    {
      title: language === "sw" ? "Wakati Bora wa Kupanda" : "Optimal Planting Window",
      description: language === "sw"
        ? "Kupanda katikati ya Machi kunaongeza uwezekano wa mavuno bora"
        : "Planting in mid-March increases likelihood of better yields",
      impact: "+8% success rate"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          {text.title}
        </h2>
        <p className="text-sm text-gray-600">
          {text.subtitle}
        </p>
      </div>

      {/* Info Card */}
      <Card className="border border-blue-200 bg-blue-50/50 mb-6">
        <div className="p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">
            {text.description}
          </p>
        </div>
      </Card>

      {!hasData ? (
        <Card className="border border-gray-200 shadow-sm">
          <div className="p-12 text-center">
            <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {text.noData}
            </h3>
            <p className="text-xs text-gray-500">
              {text.startTracking}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Yield Comparison Table */}
          <Card className="border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">
                {language === "sw" ? "Linganisha Mavuno" : "Yield Comparison"}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      {language === "sw" ? "Msimu" : "Season"}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                      {language === "sw" ? "Zao" : "Crop"}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                      {language === "sw" ? "Iliyotarajiwa" : "Predicted"}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                      {language === "sw" ? "Halisi" : "Actual"}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600">
                      {language === "sw" ? "Tofauti" : "Variance"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historicalYields.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {row.season}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {row.crop}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-right">
                        {row.predicted.toLocaleString()} kg
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        {row.actual.toLocaleString()} kg
                      </td>
                      <td className={`px-4 py-3 text-sm font-semibold text-right ${
                        row.positive ? "text-[#2E7D32]" : "text-red-600"
                      }`}>
                        {row.variance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* AI Insights */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {text.aiInsights}
            </h3>
            <div className="space-y-3">
              {aiInsights.map((insight, idx) => (
                <Card key={idx} className="border border-[#2E7D32]/20 bg-[#2E7D32]/5">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {insight.title}
                      </h4>
                      <Badge className="bg-[#2E7D32]/20 text-[#2E7D32] border-[#2E7D32]/30">
                        {insight.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">
                      {insight.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

UnifiedCropIntelligence.displayName = "UnifiedCropIntelligence";
