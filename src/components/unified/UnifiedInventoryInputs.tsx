/**
 * UNIFIED INVENTORY & INPUTS
 * 
 * Farmer Question: "What do I have and what do I need?"
 * 
 * MERGES 3 LEGACY PAGES:
 * - Inventory Management (stock tracking)
 * - Input Supply Chain (purchase inputs)
 * - Seed Lists (seed inventory)
 * 
 * TABS:
 * 1. My Stock - Current inventory levels
 * 2. Purchase Inputs - Buy seeds, fertilizer, etc.
 * 3. Usage History - Track consumption over time
 * 
 * DESIGN PHILOSOPHY:
 * - One farmer job = one page
 * - Tabs for different aspects of inventory
 * - Offline-capable with sync
 * - Speed > beauty > completeness
 */

import { useState } from "react";
import { 
  Warehouse, ShoppingCart, TrendingDown, Package, AlertCircle, Plus, Download
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { ResourceInventoryManagement } from "../ResourceInventoryManagement";
import { IntelligentInputMarketplace } from "../IntelligentInputMarketplace";

interface UnifiedInventoryInputsProps {
  userId: string;
  region?: string;
  crops?: string[];
  onNavigate?: (tab: string) => void;
  language: "en" | "sw";
}

export function UnifiedInventoryInputs({
  userId,
  region = "Unknown",
  crops = [],
  onNavigate,
  language
}: UnifiedInventoryInputsProps) {
  const [activeTab, setActiveTab] = useState("stock");

  const tabs = [
    {
      id: "stock",
      label: language === "en" ? "My Stock" : "Hifadhi Yangu",
      icon: Warehouse,
      description: language === "en" ? "Current inventory" : "Hifadhi ya sasa"
    },
    {
      id: "purchase",
      label: language === "en" ? "Purchase Inputs" : "Nunua Vifaa",
      icon: ShoppingCart,
      description: language === "en" ? "Buy seeds & fertilizer" : "Nunua mbegu na mbolea"
    },
    {
      id: "history",
      label: language === "en" ? "Usage History" : "Historia ya Matumizi",
      icon: TrendingDown,
      description: language === "en" ? "Track consumption" : "Fuatilia matumizi"
    },
  ];

  // Sample inventory data (would come from API)
  const inventoryItems = [
    {
      id: "1",
      name: language === "en" ? "Maize Seeds" : "Mbegu za Mahindi",
      quantity: 25,
      unit: "kg",
      minLevel: 50,
      status: "low",
      lastUpdated: "2 days ago"
    },
    {
      id: "2",
      name: language === "en" ? "NPK Fertilizer" : "Mbolea ya NPK",
      quantity: 150,
      unit: "kg",
      minLevel: 100,
      status: "good",
      lastUpdated: "1 week ago"
    },
    {
      id: "3",
      name: language === "en" ? "Bean Seeds" : "Mbegu za Maharagwe",
      quantity: 5,
      unit: "kg",
      minLevel: 20,
      status: "critical",
      lastUpdated: "3 days ago"
    },
    {
      id: "4",
      name: language === "en" ? "Pesticide" : "Dawa ya Wadudu",
      quantity: 8,
      unit: "L",
      minLevel: 5,
      status: "good",
      lastUpdated: "1 day ago"
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === "critical") {
      return <Badge variant="destructive">{language === "en" ? "Critical" : "Hatari"}</Badge>;
    }
    if (status === "low") {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">{language === "en" ? "Low" : "Chini"}</Badge>;
    }
    return <Badge variant="default" className="bg-[#2E7D32]">{language === "en" ? "Good" : "Nzuri"}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2E7D32] rounded-lg">
            <Warehouse className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {language === "en" ? "Inventory & Inputs" : "Hifadhi na Vifaa"}
            </h1>
            <p className="text-sm text-gray-600">
              {language === "en" 
                ? "Track what you have, buy what you need" 
                : "Fuatilia unayo, nunua unahitaji"}
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
              {language === "en" ? "Add Item" : "Ongeza Kitu"}
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
          {/* My Stock */}
          <TabsContent value="stock" className="mt-0 space-y-4">
            {/* Low Stock Alert */}
            <Card className="border-yellow-500 bg-yellow-50">
              <CardContent className="flex items-start gap-3 pt-6">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900">
                    {language === "en" ? "Low Stock Alert" : "Tahadhari ya Hifadhi Chini"}
                  </h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    {language === "en" 
                      ? "2 items are running low. Consider restocking soon."
                      : "Vitu 2 vinaisha. Fikiria kujaza upya hivi karibuni."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inventoryItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-gray-400" />
                        <div>
                          <CardTitle className="text-base">{item.name}</CardTitle>
                          <CardDescription>{language === "en" ? "Updated" : "Imeboresha"} {item.lastUpdated}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">{language === "en" ? "Current Stock" : "Hifadhi ya Sasa"}</span>
                        <span className="font-semibold">{item.quantity} {item.unit}</span>
                      </div>
                      <Progress 
                        value={(item.quantity / item.minLevel) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {language === "en" ? "Min level:" : "Kiwango cha chini:"} {item.minLevel} {item.unit}
                      </p>
                    </div>
                    {item.status !== "good" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setActiveTab("purchase")}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {language === "en" ? "Restock Now" : "Jaza Upya Sasa"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Alternative: Use existing component */}
            <div className="mt-6">
              <ResourceInventoryManagement userId={userId} language={language} />
            </div>
          </TabsContent>

          {/* Purchase Inputs */}
          <TabsContent value="purchase" className="mt-0">
            <IntelligentInputMarketplace 
              userId={userId}
              region={region}
              crops={crops}
              language={language}
              onNavigate={onNavigate}
            />
          </TabsContent>

          {/* Usage History */}
          <TabsContent value="history" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Usage History" : "Historia ya Matumizi"}</CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? "Track how you've used your inputs over time"
                    : "Fuatilia jinsi ulivyotumia vifaa vyako kwa muda"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">{language === "en" ? "Maize Seeds" : "Mbegu za Mahindi"}</p>
                      <p className="text-sm text-gray-500">
                        {language === "en" ? "Used for North Field planting" : "Imetumika kupanda Shamba la Kaskazini"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">-10 kg</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">{language === "en" ? "NPK Fertilizer" : "Mbolea ya NPK"}</p>
                      <p className="text-sm text-gray-500">
                        {language === "en" ? "Applied to all fields" : "Imetumika mashamba yote"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">-50 kg</p>
                      <p className="text-xs text-gray-500">1 week ago</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium">{language === "en" ? "Bean Seeds" : "Mbegu za Maharagwe"}</p>
                      <p className="text-sm text-gray-500">
                        {language === "en" ? "Used for South Field planting" : "Imetumika kupanda Shamba la Kusini"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">-15 kg</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">{language === "en" ? "Pesticide" : "Dawa ya Wadudu"}</p>
                      <p className="text-sm text-gray-500">
                        {language === "en" ? "Pest control application" : "Kudhibiti wadudu"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">-2 L</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
