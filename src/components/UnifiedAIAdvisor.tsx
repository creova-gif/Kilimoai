import { useState } from "react";
import { Brain, MessageSquare, Camera, Mic, GraduationCap, Sparkles, TrendingUp, Zap, Calendar, LayoutGrid } from "lucide-react";
import { AIWorkflowHub } from "./AIWorkflowHub";
import { AISupport } from "./AISupport";
import { PhotoCropDiagnosis } from "./PhotoCropDiagnosis";
import { VoiceAssistant } from "./VoiceAssistant";
import { AITrainingHub } from "./AITrainingHub_FIXED";
import { PersonalizedRecommendations } from "./PersonalizedRecommendations";
import { PredictiveModels } from "./PredictiveModels";
import { DigitalFarmTwin } from "./DigitalFarmTwin";
import { AIFarmPlanGenerator } from "./AIFarmPlanGenerator";

interface UnifiedAIAdvisorProps {
  userId: string;
  userRole: string;
  userTier: string;
  region: string;
  crops: string[];
  farmSize: string;
  language: string;
  apiBase: string;
  authToken: string;
  onNavigate: (tab: string) => void;
  initialTab?: string; // For deep linking
}

type AITab = "today" | "chat" | "diagnose" | "voice" | "workflows" | "predictions" | "plans" | "twin" | "training";

export function UnifiedAIAdvisor({
  userId,
  userRole,
  userTier,
  region,
  crops,
  farmSize,
  language,
  apiBase,
  authToken,
  onNavigate,
  initialTab = "today"
}: UnifiedAIAdvisorProps) {
  const [activeTab, setActiveTab] = useState<AITab>(initialTab as AITab);

  const tabs = [
    { id: "today", label: language === "sw" ? "Leo" : "Today", icon: Calendar, description: "Your daily recommendations" },
    { id: "chat", label: language === "sw" ? "Mazungumzo" : "Chat", icon: MessageSquare, description: "Talk to AI assistant" },
    { id: "diagnose", label: language === "sw" ? "Changanua" : "Diagnose", icon: Camera, description: "Photo diagnosis" },
    { id: "voice", label: language === "sw" ? "Sauti" : "Voice", icon: Mic, description: "Voice assistant" },
    { id: "workflows", label: language === "sw" ? "Mchakato" : "Workflows", icon: LayoutGrid, description: "AI workflows" },
    { id: "predictions", label: language === "sw" ? "Utabiri" : "Predictions", icon: TrendingUp, description: "Forecasts" },
    { id: "plans", label: language === "sw" ? "Mipango" : "Plans", icon: Sparkles, description: "Generate farm plans" },
    { id: "twin", label: language === "sw" ? "Pacha" : "Twin", icon: Zap, description: "Digital farm twin", premium: true },
    { id: "training", label: language === "sw" ? "Mafunzo" : "Training", icon: GraduationCap, description: "Learn AI" }
  ];

  // Filter tabs based on tier
  const visibleTabs = tabs.filter(tab => {
    if (tab.premium && userTier === "free") return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#2E7D32] rounded-xl flex items-center justify-center shadow-md">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {language === "sw" ? "Mshauri wa AI" : "AI Advisor"}
              </h1>
              <p className="text-xs text-gray-600">
                {language === "sw" ? "Ushauri wa kilimo kwa AI" : "AI-powered farming intelligence"}
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal Scrollable Tabs */}
        <div className="overflow-x-auto hide-scrollbar px-2 pb-2">
          <div className="flex gap-2 min-w-max">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AITab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#2E7D32] text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{tab.label}</span>
                  {tab.premium && !isActive && (
                    <span className="ml-1 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                      Pro
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "today" && (
          <div className="animate-in fade-in duration-300 p-4">
            <PersonalizedRecommendations
              userId={userId}
              apiBase={apiBase}
              authToken={authToken}
              onNavigate={onNavigate}
              language={language}
            />
          </div>
        )}

        {activeTab === "chat" && (
          <div className="animate-in fade-in duration-300">
            <AISupport
              userId={userId}
              language={language}
              apiBase={apiBase}
              authToken={authToken}
            />
          </div>
        )}

        {activeTab === "diagnose" && (
          <div className="animate-in fade-in duration-300">
            <PhotoCropDiagnosis
              onAnalyzePhoto={(file) => {
                console.log("Photo analysis:", file);
                // Mock response
                return Promise.resolve({
                  disease: "Early Blight",
                  confidence: 0.87,
                  severity: "medium" as const,
                  remedy: "Apply copper-based fungicide. Remove affected leaves. Ensure proper spacing for air circulation.",
                  nearbyDealers: ["Agro Supplies Ltd", "Farm Inputs Co."]
                });
              }}
              language={language}
            />
          </div>
        )}

        {activeTab === "voice" && (
          <div className="animate-in fade-in duration-300">
            <VoiceAssistant language={language} />
          </div>
        )}

        {activeTab === "workflows" && (
          <div className="animate-in fade-in duration-300">
            <AIWorkflowHub
              userId={userId}
              userRole={userRole}
              userTier={userTier}
              onNavigate={onNavigate}
              language={language}
            />
          </div>
        )}

        {activeTab === "predictions" && (
          <div className="animate-in fade-in duration-300">
            <PredictiveModels
              userId={userId}
              region={region}
              crops={crops}
              apiBase={apiBase}
              authToken={authToken}
              language={language}
            />
          </div>
        )}

        {activeTab === "plans" && (
          <div className="animate-in fade-in duration-300">
            <AIFarmPlanGenerator
              userId={userId}
              region={region}
              crops={crops}
              farmSize={farmSize}
              apiBase={apiBase}
              authToken={authToken}
              language={language}
            />
          </div>
        )}

        {activeTab === "twin" && (
          <div className="animate-in fade-in duration-300">
            <DigitalFarmTwin userId={userId} language={language} />
          </div>
        )}

        {activeTab === "training" && (
          <div className="animate-in fade-in duration-300 p-4">
            <AITrainingHub
              userId={userId}
              userRole={userRole}
              language={language}
            />
          </div>
        )}
      </div>
    </div>
  );
}