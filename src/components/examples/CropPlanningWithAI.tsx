/**
 * ============================================================================
 * EXAMPLE: Crop Planning Page with AI Integration
 * ============================================================================
 * This is a complete example showing how to integrate AI features
 * into a real KILIMO page using the new AI prompt logic system
 * ============================================================================
 */

import React, { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  AISuggestionChip,
  AIInsightCard,
  AIWhyChip,
} from "../components/ai-features/AIUIComponents";
import { getCropPlanningAdvice } from "../utils/aiFeatureIntegration";
import { Plus, Trash2 } from "lucide-react";

interface Plot {
  id: string;
  name: string;
  size_acres: number;
  crop?: string;
}

export function CropPlanningPageExample() {
  const [plots, setPlots] = useState<Plot[]>([
    { id: "1", name: "Plot A", size_acres: 2.5 },
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [goal, setGoal] = useState<"yield" | "revenue" | "subsistence">(
    "yield"
  );
  const [showAIInsights, setShowAIInsights] = useState(false);

  const language = (localStorage.getItem("language") || "EN") as "EN" | "SW";

  const addPlot = () => {
    const newPlot: Plot = {
      id: Date.now().toString(),
      name: `Plot ${String.fromCharCode(65 + plots.length)}`,
      size_acres: 1.0,
    };
    setPlots([...plots, newPlot]);
  };

  const removePlot = (id: string) => {
    setPlots(plots.filter((p) => p.id !== id));
  };

  const updatePlot = (id: string, updates: Partial<Plot>) => {
    setPlots(
      plots.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const handleApplyAISuggestion = (response: any) => {
    // Example: Apply AI-generated adjustments
    if (response.response.suggested_adjustments) {
      alert(
        `AI Suggests: ${response.response.suggested_adjustments.length} adjustments`
      );
      // In real implementation, you'd apply these to the form
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === "EN" ? "Crop Planning" : "Mipango ya Mazao"}
          </h1>
          
          {/* Inline AI Suggestion Chip */}
          <AISuggestionChip
            feature="crop_planning"
            context={{
              plots: plots.map((p) => ({
                name: p.name,
                size_acres: p.size_acres,
              })),
              goal,
            }}
            language={language}
            onApply={handleApplyAISuggestion}
          />
        </div>
        <p className="text-gray-600">
          {language === "EN"
            ? "Plan what to grow and when to maximize your harvest"
            : "Panga kilichopandwa na wakati wa kuboresha mavuno yako"}
        </p>
      </div>

      {/* Planning Goal */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Label className="text-gray-900 font-medium">
            {language === "EN" ? "Planning Goal" : "Lengo la Mpango"}
          </Label>
          <AIWhyChip
            explanation={
              language === "EN"
                ? "Your planning goal helps AI optimize recommendations for yield, revenue, or subsistence needs."
                : "Lengo lako la mipango linasaidia AI kuboresha mapendekezo kwa mavuno, mapato, au mahitaji ya kujikimu."
            }
            language={language}
          />
        </div>
        <Select
          value={goal}
          onValueChange={(value: any) => setGoal(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yield">
              {language === "EN"
                ? "Maximize Yield"
                : "Ongeza Mavuno"}
            </SelectItem>
            <SelectItem value="revenue">
              {language === "EN"
                ? "Maximize Revenue"
                : "Ongeza Mapato"}
            </SelectItem>
            <SelectItem value="subsistence">
              {language === "EN"
                ? "Subsistence Farming"
                : "Kilimo cha Kujikimu"}
            </SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Plots */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {language === "EN"
              ? "Your Plots"
              : "Viwanja Vyako"}
          </h2>
          <Button
            onClick={addPlot}
            size="sm"
            className="bg-[#2E7D32] hover:bg-[#1B5E20]"
          >
            <Plus className="h-4 w-4 mr-1" />
            {language === "EN" ? "Add Plot" : "Ongeza Kiwanja"}
          </Button>
        </div>

        <div className="space-y-4">
          {plots.map((plot) => (
            <div
              key={plot.id}
              className="flex gap-3 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-600 mb-1">
                    {language === "EN" ? "Plot Name" : "Jina la Kiwanja"}
                  </Label>
                  <Input
                    value={plot.name}
                    onChange={(e) =>
                      updatePlot(plot.id, { name: e.target.value })
                    }
                    placeholder={language === "EN" ? "Plot A" : "Kiwanja A"}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1">
                    {language === "EN"
                      ? "Size (acres)"
                      : "Ukubwa (ekari)"}
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={plot.size_acres}
                    onChange={(e) =>
                      updatePlot(plot.id, {
                        size_acres: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="2.5"
                  />
                </div>
              </div>
              <button
                onClick={() => removePlot(plot.id)}
                className="self-start mt-6 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {plots.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {language === "EN"
                ? "No plots added yet. Click 'Add Plot' to start."
                : "Hakuna viwanja vilivyoongezwa. Bonyeza 'Ongeza Kiwanja' kuanza."}
            </div>
          )}
        </div>
      </Card>

      {/* Template Selection */}
      <Card className="p-6 mb-6">
        <Label className="text-gray-900 font-medium mb-2 block">
          {language === "EN"
            ? "Farming Template (Optional)"
            : "Kiolezo cha Kilimo (Hiari)"}
        </Label>
        <Select
          value={selectedTemplate}
          onValueChange={setSelectedTemplate}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                language === "EN"
                  ? "Select a template..."
                  : "Chagua kiolezo..."
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rainfed-maize">
              {language === "EN"
                ? "Rainfed Maize"
                : "Mahindi ya Mvua"}
            </SelectItem>
            <SelectItem value="irrigated-vegetables">
              {language === "EN"
                ? "Irrigated Vegetables"
                : "Mboga za Umwagiliaji"}
            </SelectItem>
            <SelectItem value="mixed-beans-maize">
              {language === "EN"
                ? "Mixed Beans + Maize"
                : "Maharagwe + Mahindi"}
            </SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* AI Insights Toggle */}
      <div className="mb-6">
        <Button
          onClick={() => setShowAIInsights(!showAIInsights)}
          variant="outline"
          className="w-full"
        >
          {showAIInsights
            ? language === "EN"
              ? "Hide AI Insights"
              : "Ficha Maarifa ya AI"
            : language === "EN"
            ? "Show AI Insights"
            : "Onyesha Maarifa ya AI"}
        </Button>
      </div>

      {/* AI Insights Card */}
      {showAIInsights && (
        <AIInsightCard
          feature="crop_planning"
          context={{
            plots: plots.map((p) => ({
              name: p.name,
              size_acres: p.size_acres,
            })),
            selected_template: selectedTemplate || undefined,
            season_window: "March-July 2026",
            goal,
          }}
          language={language}
          autoLoad={true}
          onAction={(action, data) => {
            if (action === "apply") {
              alert(
                language === "EN"
                  ? "Applying AI recommendations..."
                  : "Inatumia mapendekezo ya AI..."
              );
              console.log("AI Data:", data);
              // In real implementation, you'd populate the form with AI data
            }
          }}
        />
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
        >
          {language === "EN" ? "Save as Draft" : "Hifadhi kama Dondoo"}
        </Button>
        <Button
          className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20]"
        >
          {language === "EN"
            ? "Create Planting Plan"
            : "Unda Mpango wa Kupanda"}
        </Button>
      </div>

      {/* Summary Stats */}
      <Card className="p-6 mt-6 bg-gray-50 border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">
          {language === "EN" ? "Summary" : "Muhtasari"}
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#2E7D32]">
              {plots.length}
            </div>
            <div className="text-xs text-gray-600">
              {language === "EN" ? "Plots" : "Viwanja"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2E7D32]">
              {plots.reduce((sum, p) => sum + p.size_acres, 0).toFixed(1)}
            </div>
            <div className="text-xs text-gray-600">
              {language === "EN" ? "Total Acres" : "Jumla ya Ekari"}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#2E7D32]">
              {Math.round(
                (plots.reduce((sum, p) => sum + p.size_acres, 0) /
                  10) *
                  100
              )}
              %
            </div>
            <div className="text-xs text-gray-600">
              {language === "EN" ? "Utilization" : "Matumizi"}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CropPlanningPageExample;
