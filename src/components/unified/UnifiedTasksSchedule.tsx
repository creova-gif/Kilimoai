/**
 * UNIFIED TASKS & SCHEDULE
 * 
 * Farmer Question: "What do I need to do today?"
 * 
 * MERGES 3 LEGACY PAGES:
 * - Task Management (task list)
 * - Calendar views (schedule visualization)
 * - AI-generated tasks (smart task recommendations)
 * 
 * TABS:
 * 1. Today - Focus on today's tasks
 * 2. This Week - Week view with calendar
 * 3. All Tasks - Complete task list with filters
 * 
 * DESIGN PHILOSOPHY:
 * - One farmer job = one page
 * - Tabs for different time horizons
 * - Offline-first with sync
 * - Speed > beauty > completeness
 */

import { useState } from "react";
import { 
  ClipboardList, Calendar, CheckSquare, Plus, Filter, TrendingUp
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { TaskManagementRedesign } from "../TaskManagementRedesign";
import { TaskGenerationEngine } from "../TaskGenerationEngine";

interface UnifiedTasksScheduleProps {
  userId: string;
  onNavigate?: (tab: string) => void;
  language: "en" | "sw";
}

export function UnifiedTasksSchedule({
  userId,
  onNavigate,
  language
}: UnifiedTasksScheduleProps) {
  const [activeTab, setActiveTab] = useState("today");
  const [showTaskGenerator, setShowTaskGenerator] = useState(false);

  const tabs = [
    {
      id: "today",
      label: language === "en" ? "Today" : "Leo",
      icon: CheckSquare,
      description: language === "en" ? "Focus on today's tasks" : "Zingatia kazi za leo"
    },
    {
      id: "week",
      label: language === "en" ? "This Week" : "Wiki Hii",
      icon: Calendar,
      description: language === "en" ? "Week view" : "Muonekano wa wiki"
    },
    {
      id: "all",
      label: language === "en" ? "All Tasks" : "Kazi Zote",
      icon: ClipboardList,
      description: language === "en" ? "Complete task list" : "Orodha kamili ya kazi"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2E7D32] rounded-lg">
            <ClipboardList className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {language === "en" ? "Tasks & Schedule" : "Kazi na Ratiba"}
            </h1>
            <p className="text-sm text-gray-600">
              {language === "en" 
                ? "Stay on top of your farm work" 
                : "Fuatilia kazi za shamba lako"}
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowTaskGenerator(!showTaskGenerator)}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {language === "en" ? "AI Tasks" : "Kazi za AI"}
            </Button>
            <Button size="sm" className="bg-[#2E7D32] hover:bg-[#2E7D32]/90">
              <Plus className="h-4 w-4 mr-2" />
              {language === "en" ? "Add Task" : "Ongeza Kazi"}
            </Button>
          </div>
        </div>
      </div>

      {/* AI Task Generator (expandable) */}
      {showTaskGenerator && (
        <div className="bg-white border border-[#2E7D32] rounded-lg p-4">
          <TaskGenerationEngine
            userId={userId}
            language={language}
            onTasksGenerated={() => setShowTaskGenerator(false)}
          />
        </div>
      )}

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
          {/* Today's Tasks */}
          <TabsContent value="today" className="mt-0">
            <TaskManagementRedesign 
              userId={userId} 
              onNavigate={onNavigate}
              language={language}
              defaultView="today"
            />
          </TabsContent>

          {/* This Week */}
          <TabsContent value="week" className="mt-0">
            <TaskManagementRedesign 
              userId={userId} 
              onNavigate={onNavigate}
              language={language}
              defaultView="week"
            />
          </TabsContent>

          {/* All Tasks */}
          <TabsContent value="all" className="mt-0">
            <TaskManagementRedesign 
              userId={userId} 
              onNavigate={onNavigate}
              language={language}
              defaultView="all"
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
