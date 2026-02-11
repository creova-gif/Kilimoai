/**
 * UNIFIED TASKS & SCHEDULE - WORLD-CLASS REDESIGN
 * 
 * Farmer Question: "What do I need to do today?"
 * 
 * DESIGN PHILOSOPHY:
 * - Task-driven interface
 * - Focus on today first
 * - Quick add/complete
 * - AI-powered suggestions
 */

import { useState } from "react";
import { 
  ClipboardList, Plus, CheckCircle2, Clock, Calendar, Sparkles, AlertCircle
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

interface UnifiedTasksScheduleProps {
  userId: string;
  onNavigate?: (tab: string) => void;
  language: "en" | "sw";
}

interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  category: string;
  completed: boolean;
  aiGenerated?: boolean;
}

export function UnifiedTasksSchedule({
  userId,
  onNavigate,
  language
}: UnifiedTasksScheduleProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: language === "en" ? "Apply fertilizer to maize field" : "Tumia mbolea shambani la mahindi",
      priority: "high",
      dueDate: new Date().toISOString(),
      category: language === "en" ? "Fertilizing" : "Kumbolea",
      completed: false,
      aiGenerated: true
    },
    {
      id: "2",
      title: language === "en" ? "Check irrigation system" : "Angalia mfumo wa umwagiliaji",
      priority: "high",
      dueDate: new Date().toISOString(),
      category: language === "en" ? "Maintenance" : "Matengenezo",
      completed: false
    },
    {
      id: "3",
      title: language === "en" ? "Harvest beans from south field" : "Vuna maharagwe kutoka shamba la kusini",
      priority: "medium",
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      category: language === "en" ? "Harvesting" : "Kuvuna",
      completed: false
    },
    {
      id: "4",
      title: language === "en" ? "Purchase seeds for next season" : "Nunua mbegu kwa msimu ujao",
      priority: "low",
      dueDate: new Date(Date.now() + 172800000).toISOString(),
      category: language === "en" ? "Planning" : "Kupanga",
      completed: true
    }
  ]);

  const [filter, setFilter] = useState<"all" | "today" | "upcoming">("today");

  const text = {
    title: language === "en" ? "Tasks & Schedule" : "Kazi na Ratiba",
    subtitle: language === "en" ? "Stay on top of your farm work" : "Fuatilia kazi za shamba lako",
    addTask: language === "en" ? "Add Task" : "Ongeza Kazi",
    today: language === "en" ? "Today" : "Leo",
    upcoming: language === "en" ? "Upcoming" : "Zijazo",
    all: language === "en" ? "All" : "Zote",
    completed: language === "en" ? "Completed" : "Zimekamilika",
    pending: language === "en" ? "Pending" : "Zinasubiri",
    high: language === "en" ? "High" : "Juu",
    medium: language === "en" ? "Medium" : "Kati",
    low: language === "en" ? "Low" : "Chini",
    aiGenerated: language === "en" ? "AI Suggested" : "AI Imependekeza",
    dueToday: language === "en" ? "Due today" : "Inakamilika leo",
    overdue: language === "en" ? "Overdue" : "Imechelewa",
    markComplete: language === "en" ? "Mark as complete" : "Weka kama zimekamilika",
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast.success(
        task.completed 
          ? (language === "en" ? "Task reopened" : "Kazi imefunguliwa tena")
          : (language === "en" ? "Task completed! 🎉" : "Kazi imekamilika! 🎉")
      );
    }
  };

  const todayTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate.toDateString() === today.toDateString() && !task.completed;
  });

  const upcomingTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate > today && !task.completed;
  });

  const completedTasks = tasks.filter(task => task.completed);

  const filteredTasks = filter === "today" ? todayTasks : filter === "upcoming" ? upcomingTasks : tasks;

  const priorityColors = {
    high: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
    medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
    low: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-[#2E7D32] rounded-2xl p-6 text-white shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{text.title}</h1>
                  <p className="text-white/90 text-sm">{text.subtitle}</p>
                </div>
              </div>
              <Button 
                onClick={() => toast.success(language === "en" ? "Opening task creator..." : "Inafungua kiundaji cha kazi...")}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                {text.addTask}
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{text.today}</p>
                <p className="text-2xl font-bold">{todayTasks.length}</p>
                <p className="text-xs text-white/80">{text.pending}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{text.upcoming}</p>
                <p className="text-2xl font-bold">{upcomingTasks.length}</p>
                <p className="text-xs text-white/80">{language === "en" ? "tasks" : "kazi"}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{text.completed}</p>
                <p className="text-2xl font-bold">{completedTasks.length}</p>
                <p className="text-xs text-white/80">{language === "en" ? "done" : "zimekamilika"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["today", "upcoming", "all"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === filterType
                  ? "bg-[#2E7D32] text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300"
              }`}
            >
              {text[filterType as keyof typeof text]}
              <Badge variant="secondary" className="ml-2">
                {filterType === "today" ? todayTasks.length : filterType === "upcoming" ? upcomingTasks.length : tasks.length}
              </Badge>
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task, index) => {
              const priorityStyle = priorityColors[task.priority];
              const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`border-2 ${task.completed ? "border-gray-200 opacity-60" : priorityStyle.border} hover:shadow-lg transition-all`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <Checkbox 
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="mt-1"
                        />

                        {/* Task Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className={`font-semibold ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                              {task.title}
                            </h3>
                            <Badge className={`${priorityStyle.bg} ${priorityStyle.text} border ${priorityStyle.border} shrink-0`}>
                              <div className={`h-2 w-2 ${priorityStyle.dot} rounded-full mr-1.5`}></div>
                              {text[task.priority]}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                              {task.category}
                            </Badge>
                            
                            {isOverdue && (
                              <Badge className="bg-red-100 text-red-700 border-red-200">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {text.overdue}
                              </Badge>
                            )}

                            {new Date(task.dueDate).toDateString() === new Date().toDateString() && !task.completed && (
                              <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                                <Clock className="h-3 w-3 mr-1" />
                                {text.dueToday}
                              </Badge>
                            )}

                            {task.aiGenerated && (
                              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                                <Sparkles className="h-3 w-3 mr-1" />
                                {text.aiGenerated}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Complete Icon */}
                        {task.completed && (
                          <CheckCircle2 className="h-6 w-6 text-[#2E7D32] shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredTasks.length === 0 && (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="py-12 text-center">
                <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === "en" ? "No tasks here!" : "Hakuna kazi hapa!"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === "en" 
                    ? "All caught up. Add a new task or check other filters."
                    : "Umefanya kazi zote. Ongeza kazi mpya au angalia vichujio vingine."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Card */}
        <Card className="border-2 border-purple-100 bg-purple-50/50">
          <CardContent className="py-4">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-purple-900 mb-1 text-sm">
                  {language === "en" ? "AI Task Suggestions" : "Mapendekezo ya Kazi za AI"}
                </h4>
                <p className="text-sm text-purple-700 leading-relaxed">
                  {language === "en"
                    ? "KILIMO AI analyzes your farm data and creates smart task recommendations based on weather, crop stages, and best practices."
                    : "KILIMO AI inachambanua data ya shamba lako na kuunda mapendekezo sahihi ya kazi kulingana na hali ya hewa, hatua za mazao, na mbinu bora."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

UnifiedTasksSchedule.displayName = "UnifiedTasksSchedule";