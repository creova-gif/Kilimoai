import { useState } from "react";
import { Users, MessageCircle, UserCheck, Microscope } from "lucide-react";
import { PeerDiscussionGroups } from "./PeerDiscussionGroups";
import { ExpertConsultations } from "./ExpertConsultations";
import { SoilTestingService } from "./SoilTestingService";

interface UnifiedCommunityProps {
  userId: string;
  language: string;
  onNavigate: (tab: string) => void;
  initialTab?: string;
}

type CommunityTab = "discussions" | "experts" | "services";

export function UnifiedCommunity({
  userId,
  language,
  onNavigate,
  initialTab = "discussions"
}: UnifiedCommunityProps) {
  const [activeTab, setActiveTab] = useState<CommunityTab>(initialTab as CommunityTab);

  const tabs = [
    { id: "discussions", label: language === "sw" ? "Majadiliano" : "Discussions", icon: MessageCircle },
    { id: "experts", label: language === "sw" ? "Wataalam" : "Experts", icon: UserCheck },
    { id: "services", label: language === "sw" ? "Huduma" : "Services", icon: Microscope }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#2E7D32] rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {language === "sw" ? "Jamii" : "Community"}
              </h1>
              <p className="text-xs text-gray-500">
                {language === "sw" ? "Jifunze na wakulima wenzako" : "Learn from fellow farmers"}
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
                onClick={() => setActiveTab(tab.id as CommunityTab)}
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
        {activeTab === "discussions" && (
          <div className="animate-in fade-in duration-300">
            <PeerDiscussionGroups
              userId={userId}
              onNavigate={onNavigate}
              language={language}
            />
          </div>
        )}

        {activeTab === "experts" && (
          <div className="animate-in fade-in duration-300">
            <ExpertConsultations
              userId={userId}
              onNavigate={onNavigate}
              language={language}
            />
          </div>
        )}

        {activeTab === "services" && (
          <div className="animate-in fade-in duration-300">
            <SoilTestingService
              userId={userId}
              onNavigate={onNavigate}
              language={language}
            />
          </div>
        )}
      </div>
    </div>
  );
}
