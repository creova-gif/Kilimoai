/**
 * UNIFIED COMMUNITY
 * 
 * Farmer Question: "Who can help me?"
 * 
 * MERGES 4 LEGACY PAGES:
 * - Peer Discussion Groups (community forum)
 * - Expert Consultations (expert advice)
 * - Cooperative Dashboard (cooperative features)
 * - Extension Officer Dashboard (extension services)
 * 
 * TABS:
 * 1. Discussions - Community forum
 * 2. Ask Expert - Professional consultations
 * 3. Cooperative - Cooperative features
 * 
 * DESIGN PHILOSOPHY:
 * - One farmer job = one page
 * - Tabs for different community aspects
 * - Offline-capable with sync
 * - Speed > beauty > completeness
 */

import { useState } from "react";
import { 
  Users, MessageCircle, Award, Building2, Plus, Search
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { PeerDiscussionGroups } from "../PeerDiscussionGroups";
import { ExpertConsultations } from "../ExpertConsultations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface UnifiedCommunityProps {
  userId: string;
  onNavigate?: (tab: string) => void;
  language: "en" | "sw";
}

export function UnifiedCommunity({
  userId,
  onNavigate,
  language
}: UnifiedCommunityProps) {
  const [activeTab, setActiveTab] = useState("discussions");

  const tabs = [
    {
      id: "discussions",
      label: language === "en" ? "Discussions" : "Mijadala",
      icon: MessageCircle,
      description: language === "en" ? "Community forum" : "Jukwaa la jamii"
    },
    {
      id: "experts",
      label: language === "en" ? "Ask Expert" : "Uliza Mtaalamu",
      icon: Award,
      description: language === "en" ? "Professional advice" : "Ushauri wa kitaalamu"
    },
    {
      id: "cooperative",
      label: language === "en" ? "Cooperative" : "Ushirikiano",
      icon: Building2,
      description: language === "en" ? "Cooperative features" : "Huduma za ushirikiano"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2E7D32] rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {language === "en" ? "Community" : "Jamii"}
            </h1>
            <p className="text-sm text-gray-600">
              {language === "en" 
                ? "Connect, learn, and grow together" 
                : "Unganisha, jifunze, na kua pamoja"}
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              {language === "en" ? "Search" : "Tafuta"}
            </Button>
            <Button size="sm" className="bg-[#2E7D32] hover:bg-[#2E7D32]/90">
              <Plus className="h-4 w-4 mr-2" />
              {language === "en" ? "New Post" : "Chapisho Jipya"}
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
          {/* Discussions */}
          <TabsContent value="discussions" className="mt-0">
            <PeerDiscussionGroups 
              userId={userId}
              onNavigate={onNavigate}
              language={language}
            />
          </TabsContent>

          {/* Ask Expert */}
          <TabsContent value="experts" className="mt-0">
            <ExpertConsultations 
              userId={userId}
              onNavigate={onNavigate}
              language={language}
            />
          </TabsContent>

          {/* Cooperative */}
          <TabsContent value="cooperative" className="mt-0">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "en" ? "Cooperative Benefits" : "Faida za Ushirikiano"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en" 
                      ? "Join a cooperative to access group benefits"
                      : "Jiunge na ushirikiano kupata faida za kikundi"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold">
                          {language === "en" ? "Bulk Purchasing" : "Ununuzi wa Jumla"}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {language === "en" 
                          ? "Save money by buying inputs together"
                          : "Okoa pesa kwa kununua vifaa pamoja"}
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Award className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold">
                          {language === "en" ? "Group Training" : "Mafunzo ya Kikundi"}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {language === "en" 
                          ? "Access professional training programs"
                          : "Pata mafunzo ya kitaalamu"}
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <ShoppingCart className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold">
                          {language === "en" ? "Better Prices" : "Bei Bora"}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {language === "en" 
                          ? "Negotiate better prices for your produce"
                          : "Patana bei bora za mazao yako"}
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Users className="h-5 w-5 text-orange-600" />
                        </div>
                        <h3 className="font-semibold">
                          {language === "en" ? "Shared Resources" : "Rasilimali za Pamoja"}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {language === "en" 
                          ? "Share equipment and reduce costs"
                          : "Shiriki vifaa na upunguze gharama"}
                      </p>
                    </div>
                  </div>

                  <Button className="w-full bg-[#2E7D32] hover:bg-[#2E7D32]/90">
                    {language === "en" ? "Join a Cooperative" : "Jiunge na Ushirikiano"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
