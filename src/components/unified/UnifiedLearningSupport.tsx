/**
 * UNIFIED LEARNING & SUPPORT
 * 
 * Farmer Question: "How do I learn this?"
 * 
 * MERGES 6 LEGACY PAGES:
 * - Video Tutorials (video library)
 * - Knowledge Base (articles & guides)
 * - Training Courses (structured learning)
 * - Support/Helpdesk (customer support)
 * - Contact Support (contact form)
 * - FAQ (frequently asked questions)
 * 
 * TABS:
 * 1. Video Tutorials - Video learning library
 * 2. Knowledge Base - Articles & guides
 * 3. Get Help - Support & contact
 * 4. FAQ - Common questions
 * 
 * DESIGN PHILOSOPHY:
 * - One farmer job = one page
 * - Tabs for different learning methods
 * - Offline-capable with cached content
 * - Speed > beauty > completeness
 */

import { useState } from "react";
import { 
  BookOpen, PlayCircle, HelpCircle, MessageCircle, Search, PhoneCall
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { VideoTutorials } from "../VideoTutorials";
import { KnowledgeRepository } from "../KnowledgeRepository";
import { ContactSupport } from "../ContactSupport";
import { FAQ } from "../FAQ";

interface UnifiedLearningSupportProps {
  onNavigate?: (tab: string) => void;
  language: "en" | "sw";
}

export function UnifiedLearningSupport({
  onNavigate,
  language
}: UnifiedLearningSupportProps) {
  const [activeTab, setActiveTab] = useState("videos");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    {
      id: "videos",
      label: language === "en" ? "Video Tutorials" : "Mafunzo ya Video",
      icon: PlayCircle,
      description: language === "en" ? "Watch and learn" : "Tazama na ujifunze"
    },
    {
      id: "knowledge",
      label: language === "en" ? "Knowledge Base" : "Maktaba ya Maarifa",
      icon: BookOpen,
      description: language === "en" ? "Articles & guides" : "Makala na miongozo"
    },
    {
      id: "support",
      label: language === "en" ? "Get Help" : "Pata Msaada",
      icon: MessageCircle,
      description: language === "en" ? "Contact support" : "Wasiliana na msaada"
    },
    {
      id: "faq",
      label: language === "en" ? "FAQ" : "Maswali Mara kwa Mara",
      icon: HelpCircle,
      description: language === "en" ? "Common questions" : "Maswali ya kawaida"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2E7D32] rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {language === "en" ? "Learning & Support" : "Kujifunza na Msaada"}
            </h1>
            <p className="text-sm text-gray-600">
              {language === "en" 
                ? "Learn new skills, get help when you need it" 
                : "Jifunze ujuzi mpya, pata msaada unapohitaji"}
            </p>
          </div>
          
          {/* Quick Contact */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <PhoneCall className="h-4 w-4 mr-2" />
              {language === "en" ? "Call Support" : "Piga Simu"}
            </Button>
          </div>
        </div>
      </div>

      {/* Global Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={language === "en" ? "Search for help..." : "Tafuta msaada..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
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
          {/* Video Tutorials */}
          <TabsContent value="videos" className="mt-0">
            <VideoTutorials 
              language={language}
              onNavigate={onNavigate}
            />
          </TabsContent>

          {/* Knowledge Base */}
          <TabsContent value="knowledge" className="mt-0">
            <KnowledgeRepository 
              language={language}
              onNavigate={onNavigate}
            />
          </TabsContent>

          {/* Get Help */}
          <TabsContent value="support" className="mt-0">
            <ContactSupport language={language} />
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="mt-0">
            <FAQ language={language} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
