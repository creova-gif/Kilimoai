/**
 * UNIFIED AI ADVISOR
 * 
 * Farmer Question: "What should I do?"
 * 
 * MERGES 7 LEGACY PAGES:
 * - AI Chat (Sankofa AI Assistant)
 * - Photo Diagnosis (Crop Disease Scanner)
 * - Voice Assistant
 * - AI Training Hub
 * - AI Recommendations
 * - AI Advisory
 * - AI Farm Plan Generator
 * 
 * DESIGN PHILOSOPHY:
 * - Single destination for all AI-powered help
 * - Tab-based navigation (mobile: swipeable)
 * - Offline-first with clear fallbacks
 * - Speed > beauty > completeness
 */

import { useState, useEffect } from "react";
import { 
  Brain, Camera, Mic, Lightbulb, TrendingUp, BookOpen, Sparkles,
  MessageCircle, Zap, Target, ChevronLeft, ChevronRight
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AISupport } from "../AISupport";
import { PhotoCropDiagnosis } from "../PhotoCropDiagnosis";
import { VoiceAssistant } from "../VoiceAssistant";
import { AITrainingHub } from "../AITrainingHub";
import { AIRecommendations } from "../AIRecommendations";
import { AIFarmPlanGenerator } from "../AIFarmPlanGenerator";

interface UnifiedAIAdvisorProps {
  userId: string;
  userRole: string;
  region?: string;
  crops?: string[];
  farmSize?: string;
  language: "en" | "sw";
  apiBase: string;
  authToken: string;
  onAnalyzePhoto?: (imageData: string) => Promise<any>;
}

export function UnifiedAIAdvisor({
  userId,
  userRole,
  region = "Unknown",
  crops = [],
  farmSize = "0",
  language,
  apiBase,
  authToken,
  onAnalyzePhoto
}: UnifiedAIAdvisorProps) {
  const [activeTab, setActiveTab] = useState("chat");

  // Track tab usage
  useEffect(() => {
    console.log(`AI Advisor - Tab changed to: ${activeTab}`);
  }, [activeTab]);

  const tabs = [
    {
      id: "chat",
      label: language === "en" ? "Ask AI" : "Uliza AI",
      icon: MessageCircle,
      description: language === "en" ? "Chat with Sankofa AI" : "Ongea na Sankofa AI"
    },
    {
      id: "scan",
      label: language === "en" ? "Scan Crop" : "Piga Picha",
      icon: Camera,
      description: language === "en" ? "Diagnose crop diseases" : "Tambua magonjwa"
    },
    {
      id: "voice",
      label: language === "en" ? "Voice" : "Sauti",
      icon: Mic,
      description: language === "en" ? "Speak your question" : "Sema swali lako"
    },
    {
      id: "recommendations",
      label: language === "en" ? "Recommendations" : "Mapendekezo",
      icon: Lightbulb,
      description: language === "en" ? "AI suggestions for your farm" : "Ushauri wa AI"
    },
    {
      id: "plan",
      label: language === "en" ? "Farm Plan" : "Mpango",
      icon: Target,
      description: language === "en" ? "AI-generated farm plan" : "Mpango wa shamba"
    },
    {
      id: "training",
      label: language === "en" ? "Learn" : "Jifunze",
      icon: BookOpen,
      description: language === "en" ? "AI training resources" : "Mafunzo ya AI"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2E7D32] rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === "en" ? "AI Advisor" : "Mshauri wa AI"}
            </h1>
            <p className="text-sm text-gray-600">
              {language === "en" 
                ? "Your intelligent farming assistant" 
                : "Msaidizi wako wa kilimo wenye akili"}
            </p>
          </div>
        </div>
      </div>

      {/* Unified Tabs Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab List - Horizontal scroll on mobile */}
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
          {/* AI Chat */}
          <TabsContent value="chat" className="mt-0">
            <AISupport 
              userId={userId}
              language={language}
              apiBase={apiBase}
              authToken={authToken}
            />
          </TabsContent>

          {/* Photo Diagnosis */}
          <TabsContent value="scan" className="mt-0">
            <PhotoCropDiagnosis 
              onAnalyzePhoto={onAnalyzePhoto || (async () => ({ disease: "Test", confidence: 0.9 }))}
              language={language}
            />
          </TabsContent>

          {/* Voice Assistant */}
          <TabsContent value="voice" className="mt-0">
            <VoiceAssistant language={language} />
          </TabsContent>

          {/* AI Recommendations */}
          <TabsContent value="recommendations" className="mt-0">
            <AIRecommendations language={language} />
          </TabsContent>

          {/* AI Farm Plan */}
          <TabsContent value="plan" className="mt-0">
            <AIFarmPlanGenerator 
              userId={userId}
              region={region}
              crops={crops}
              farmSize={farmSize}
              apiBase={apiBase}
              authToken={authToken}
              language={language}
            />
          </TabsContent>

          {/* AI Training */}
          <TabsContent value="training" className="mt-0">
            <AITrainingHub 
              userId={userId}
              userRole={userRole}
              language={language}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Quick Action Hint */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-[#2E7D32] mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {language === "en" ? "Quick Tip" : "Kidokezo"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {language === "en" 
                ? "Swipe left/right to switch between AI tools on mobile"
                : "Swipe kushoto/kulia kubadilisha zana za AI kwenye simu"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
