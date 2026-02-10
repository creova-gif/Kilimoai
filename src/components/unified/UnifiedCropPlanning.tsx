/**
 * UNIFIED CROP PLANNING
 * 
 * Farmer Question: "What crops should I plant and when?"
 * 
 * MERGES 4 LEGACY PAGES:
 * - Crop Planning Management
 * - Land Allocation (Visual Planner)
 * - Crop Dashboard
 * - Yield Forecasting
 * 
 * TABS:
 * 1. Visual Planner - Drag-and-drop land allocation
 * 2. Seasonal Plans - Current/upcoming crop plans
 * 3. Dashboard - Crop health, progress, yield forecasts
 * 
 * DESIGN PHILOSOPHY:
 * - One farmer job = one page
 * - Tabs instead of separate destinations
 * - Mobile-first with large touch targets
 * - Offline-capable with clear states
 */

import { useState, useEffect } from "react";
import { 
  Sprout, Map, Calendar, TrendingUp, LayoutGrid, List, BarChart3
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { VisualCropPlannerEnhanced } from "../VisualCropPlannerEnhanced";
import { CropPlanningManagementRedesign } from "../CropPlanningManagementRedesign";
import { CropPlanningDashboard } from "../CropPlanningDashboard";

interface UnifiedCropPlanningProps {
  userId: string;
  totalFarmSize?: number;
  language: "en" | "sw";
}

export function UnifiedCropPlanning({
  userId,
  totalFarmSize = 100,
  language
}: UnifiedCropPlanningProps) {
  const [activeTab, setActiveTab] = useState("visual");

  const tabs = [
    {
      id: "visual",
      label: language === "en" ? "Visual Planner" : "Mpangilio wa Picha",
      icon: LayoutGrid,
      description: language === "en" ? "Drag-and-drop land allocation" : "Buruta na dondosha"
    },
    {
      id: "plans",
      label: language === "en" ? "My Plans" : "Mipango Yangu",
      icon: Calendar,
      description: language === "en" ? "Seasonal crop plans" : "Mipango ya msimu"
    },
    {
      id: "dashboard",
      label: language === "en" ? "Dashboard" : "Dashibodi",
      icon: BarChart3,
      description: language === "en" ? "Crop health & yield forecast" : "Afya na utabiri"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2E7D32] rounded-lg">
            <Sprout className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === "en" ? "Crop Planning" : "Mpango wa Mazao"}
            </h1>
            <p className="text-sm text-gray-600">
              {language === "en" 
                ? "Plan your crops, optimize your land, maximize your yield" 
                : "Panga mazao, boresha ardhi, ongeza mavuno"}
            </p>
          </div>
        </div>
      </div>

      {/* Unified Tabs Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab List */}
        <TabsList className="w-full justify-start overflow-x-auto bg-white border border-gray-200 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-[#2E7D32] data-[state=active]:text-white transition-colors whitespace-nowrap"
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab Contents */}
        <div className="mt-6">
          {/* Visual Planner */}
          <TabsContent value="visual" className="mt-0">
            <VisualCropPlannerEnhanced 
              totalFarmSize={totalFarmSize}
              userId={userId}
              language={language}
            />
          </TabsContent>

          {/* My Plans */}
          <TabsContent value="plans" className="mt-0">
            <CropPlanningManagementRedesign 
              userId={userId}
              language={language}
            />
          </TabsContent>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="mt-0">
            <CropPlanningDashboard 
              userId={userId}
              language={language}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
