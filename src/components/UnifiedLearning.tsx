import { useState } from "react";
import { BookOpen, PlayCircle, HelpCircle, HeadphonesIcon } from "lucide-react";
import { VideoTutorials } from "./VideoTutorials";
import { KnowledgeRepository } from "./KnowledgeRepository";
import { SupportHelpdesk } from "./SupportHelpdesk";
import { ContactSupport } from "./ContactSupport";
import { FAQ } from "./FAQ";

interface UnifiedLearningProps {
  userId: string;
  language: string;
  onNavigate: (tab: string) => void;
  initialTab?: string;
}

type LearningTab = "videos" | "guides" | "support";

export function UnifiedLearning({
  userId,
  language,
  onNavigate,
  initialTab = "videos"
}: UnifiedLearningProps) {
  const [activeTab, setActiveTab] = useState<LearningTab>(initialTab as LearningTab);
  const [supportView, setSupportView] = useState<"helpdesk" | "contact" | "faq">("helpdesk");

  const tabs = [
    { id: "videos", label: language === "sw" ? "Video" : "Videos", icon: PlayCircle },
    { id: "guides", label: language === "sw" ? "Miongozo" : "Guides", icon: BookOpen },
    { id: "support", label: language === "sw" ? "Msaada" : "Support", icon: HeadphonesIcon }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#2E7D32] rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {language === "sw" ? "Elimu" : "Learning"}
              </h1>
              <p className="text-xs text-gray-500">
                {language === "sw" ? "Jifunze ujuzi mpya" : "Learn new skills"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LearningTab)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 ${
                  isActive
                    ? "border-[#2E7D32] text-gray-900"
                    : "border-transparent text-gray-500"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "videos" && (
          <div className="animate-in fade-in duration-300">
            <VideoTutorials language={language} onNavigate={onNavigate} />
          </div>
        )}

        {activeTab === "guides" && (
          <div className="animate-in fade-in duration-300">
            <KnowledgeRepository language={language} onNavigate={onNavigate} />
          </div>
        )}

        {activeTab === "support" && (
          <div className="animate-in fade-in duration-300">
            {/* Support sub-navigation */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex gap-2 px-4 py-2">
                <button
                  onClick={() => setSupportView("helpdesk")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    supportView === "helpdesk"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  {language === "sw" ? "Msaada" : "Helpdesk"}
                </button>
                <button
                  onClick={() => setSupportView("contact")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    supportView === "contact"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  {language === "sw" ? "Wasiliana" : "Contact"}
                </button>
                <button
                  onClick={() => setSupportView("faq")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    supportView === "faq"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  FAQ
                </button>
              </div>
            </div>

            {supportView === "helpdesk" && (
              <SupportHelpdesk userId={userId} language={language} />
            )}
            {supportView === "contact" && (
              <ContactSupport language={language} />
            )}
            {supportView === "faq" && (
              <FAQ language={language} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
