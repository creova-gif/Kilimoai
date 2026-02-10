/**
 * UNIFIED FARM MAP
 * 
 * Farmer Question: "Where is everything on my farm?"
 * 
 * MERGES 2 LEGACY PAGES:
 * - Farm Mapping (visual map of fields)
 * - Land Allocation (view-only mode for existing allocations)
 * 
 * TABS:
 * 1. Interactive Map - Visual map of farm fields
 * 2. Field List - Table view of all fields with details
 * 
 * DESIGN PHILOSOPHY:
 * - One farmer job = one page
 * - Tabs for different views of same data
 * - Offline-capable with GPS data
 * - Speed > beauty > completeness
 */

import { useState } from "react";
import { 
  Map, List, MapPin, Plus, Edit, Trash2, Download, Upload
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { FarmMappingRedesign } from "../FarmMappingRedesign";

interface UnifiedFarmMapProps {
  userId: string;
  language: "en" | "sw";
}

export function UnifiedFarmMap({
  userId,
  language
}: UnifiedFarmMapProps) {
  const [activeTab, setActiveTab] = useState("map");

  const tabs = [
    {
      id: "map",
      label: language === "en" ? "Interactive Map" : "Ramani ya Kuingiliana",
      icon: Map,
      description: language === "en" ? "Visual map of your farm" : "Ramani ya shamba lako"
    },
    {
      id: "fields",
      label: language === "en" ? "Field List" : "Orodha ya Mashamba",
      icon: List,
      description: language === "en" ? "Table view of all fields" : "Orodha ya mashamba yote"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2E7D32] rounded-lg">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {language === "en" ? "Farm Map" : "Ramani ya Shamba"}
            </h1>
            <p className="text-sm text-gray-600">
              {language === "en" 
                ? "Map your fields, track boundaries, plan efficiently" 
                : "Ramani mashamba yako, fuatilia mipaka, panga kwa ufanisi"}
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {language === "en" ? "Export" : "Hamisha"}
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
          {/* Interactive Map */}
          <TabsContent value="map" className="mt-0">
            <FarmMappingRedesign userId={userId} language={language} />
          </TabsContent>

          {/* Field List */}
          <TabsContent value="fields" className="mt-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {language === "en" ? "All Fields" : "Mashamba Yote"}
                </h3>
                <Button size="sm" className="bg-[#2E7D32] hover:bg-[#2E7D32]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "en" ? "Add Field" : "Ongeza Shamba"}
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left text-sm text-gray-600">
                      <th className="pb-3 font-medium">
                        {language === "en" ? "Field Name" : "Jina la Shamba"}
                      </th>
                      <th className="pb-3 font-medium">
                        {language === "en" ? "Size" : "Ukubwa"}
                      </th>
                      <th className="pb-3 font-medium">
                        {language === "en" ? "Current Crop" : "Zao la Sasa"}
                      </th>
                      <th className="pb-3 font-medium">
                        {language === "en" ? "Status" : "Hali"}
                      </th>
                      <th className="pb-3 font-medium">
                        {language === "en" ? "Actions" : "Vitendo"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr className="text-sm">
                      <td className="py-3">
                        {language === "en" ? "North Field" : "Shamba la Kaskazini"}
                      </td>
                      <td className="py-3">2.5 acres</td>
                      <td className="py-3">
                        {language === "en" ? "Maize" : "Mahindi"}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {language === "en" ? "Active" : "Hai"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="text-sm">
                      <td className="py-3">
                        {language === "en" ? "South Field" : "Shamba la Kusini"}
                      </td>
                      <td className="py-3">1.8 acres</td>
                      <td className="py-3">
                        {language === "en" ? "Beans" : "Maharagwe"}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {language === "en" ? "Active" : "Hai"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="text-sm">
                      <td className="py-3">
                        {language === "en" ? "East Field" : "Shamba la Mashariki"}
                      </td>
                      <td className="py-3">3.2 acres</td>
                      <td className="py-3">-</td>
                      <td className="py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          {language === "en" ? "Fallow" : "Tupu"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
