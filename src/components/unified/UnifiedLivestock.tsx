/**
 * UNIFIED LIVESTOCK
 * 
 * Farmer Question: "How are my animals?"
 * 
 * MERGES 3 LEGACY PAGES:
 * - Livestock Management (herd tracking)
 * - Livestock Health Monitor (health tracking)
 * - Advanced Livestock Management (breeding, sales)
 * 
 * TABS:
 * 1. My Herd - Overview of all animals
 * 2. Health - Health monitoring & vet records
 * 3. Breeding - Breeding programs & genetics
 * 4. Sales - Livestock sales & revenue
 * 
 * DESIGN PHILOSOPHY:
 * - One farmer job = one page
 * - Tabs for different livestock aspects
 * - Offline-capable with sync
 * - Speed > beauty > completeness
 */

import { useState } from "react";
import { 
  Activity, Heart, TrendingUp, ShoppingBag, Plus, Download
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { AdvancedLivestockManagement } from "../AdvancedLivestockManagement";
import { LivestockHealthMonitor } from "../LivestockHealthMonitor";

interface UnifiedLivestockProps {
  userId: string;
  language: "en" | "sw";
}

export function UnifiedLivestock({
  userId,
  language
}: UnifiedLivestockProps) {
  const [activeTab, setActiveTab] = useState("herd");

  const tabs = [
    {
      id: "herd",
      label: language === "en" ? "My Herd" : "Kundi Langu",
      icon: Activity,
      description: language === "en" ? "All animals" : "Wanyama wote"
    },
    {
      id: "health",
      label: language === "en" ? "Health" : "Afya",
      icon: Heart,
      description: language === "en" ? "Health monitoring" : "Ufuatiliaji wa afya"
    },
    {
      id: "breeding",
      label: language === "en" ? "Breeding" : "Uzazi",
      icon: TrendingUp,
      description: language === "en" ? "Breeding programs" : "Mipango ya uzazi"
    },
    {
      id: "sales",
      label: language === "en" ? "Sales" : "Mauzo",
      icon: ShoppingBag,
      description: language === "en" ? "Sales & revenue" : "Mauzo na mapato"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2E7D32] rounded-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {language === "en" ? "Livestock" : "Mifugo"}
            </h1>
            <p className="text-sm text-gray-600">
              {language === "en" 
                ? "Manage your animals, track health, maximize value" 
                : "Simamia wanyama, fuatilia afya, ongeza thamani"}
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {language === "en" ? "Export" : "Hamisha"}
            </Button>
            <Button size="sm" className="bg-[#2E7D32] hover:bg-[#2E7D32]/90">
              <Plus className="h-4 w-4 mr-2" />
              {language === "en" ? "Add Animal" : "Ongeza Mnyama"}
            </Button>
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
          {/* My Herd */}
          <TabsContent value="herd" className="mt-0">
            <AdvancedLivestockManagement userId={userId} language={language} />
          </TabsContent>

          {/* Health */}
          <TabsContent value="health" className="mt-0">
            <LivestockHealthMonitor userId={userId} language={language} />
          </TabsContent>

          {/* Breeding */}
          <TabsContent value="breeding" className="mt-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                {language === "en" ? "Breeding Programs" : "Mipango ya Uzazi"}
              </h3>
              <p className="text-gray-600">
                {language === "en" 
                  ? "Track breeding cycles, genetics, and offspring performance"
                  : "Fuatilia mizunguko ya uzazi, maumbile, na utendaji wa watoto"}
              </p>
            </div>
          </TabsContent>

          {/* Sales */}
          <TabsContent value="sales" className="mt-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                {language === "en" ? "Livestock Sales" : "Mauzo ya Mifugo"}
              </h3>
              <p className="text-gray-600">
                {language === "en" 
                  ? "Manage livestock sales, track revenue, and buyer relationships"
                  : "Simamia mauzo ya mifugo, fuatilia mapato, na mahusiano ya wanunuzi"}
              </p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
