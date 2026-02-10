import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  CheckCircle,
  Circle,
  Clock,
  Calendar,
  Plus,
  AlertCircle,
  MapPin,
  Tag,
  Edit2,
  Trash2,
  ChevronRight,
  Target,
  Activity,
  Sprout,
  Info,
  Sparkles
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { 
  generateTasksFromTemplate,
  getUpcomingTasks,
  getOverdueTasks,
  groupTasksByMonth,
  calculateTaskStats,
  type Task as GeneratedTask
} from "./TaskGenerationEngine";
import { projectId, publicAnonKey } from "../utils/supabase/info";

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface TaskManagementRedesignProps {
  userId: string;
  language?: "en" | "sw";
  onNavigate?: (tab: string) => void;
}

// Extend the generated task type with UI-specific fields
interface Task extends Omit<GeneratedTask, 'dueDate'> {
  dueDate: string; // Store as ISO string for easier serialization
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export function TaskManagementRedesign({ 
  userId,
  language = "en",
  onNavigate
}: TaskManagementRedesignProps) {
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      cropPlanId: "p1",
      cropName: "Maize",
      fieldName: "Field A - North",
      title: "Apply DAP Fertilizer - Maize",
      description: "Apply 50kg/acre of DAP Fertilizer to 40 acres. At planting",
      dueDate: "2026-02-15",
      status: "pending",
      category: "fertilizing",
      priority: "high",
      estimatedDuration: 20,
      inputs: [{ name: "DAP Fertilizer", quantity: "50kg/acre" }],
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      cropPlanId: "p1",
      cropName: "Maize",
      title: "Monitor Germination - Maize",
      description: "Monitor and assess germination stage for Maize. Check plant health, growth progress, and identify any issues.",
      dueDate: "2026-02-25",
      status: "pending",
      category: "monitoring",
      priority: "high",
      estimatedDuration: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: "3",
      cropPlanId: "p2",
      cropName: "Beans",
      fieldName: "Field B - South",
      title: "Plant Beans - Field B",
      description: "Plant 25 acres of Beans using Standard Planting method",
      dueDate: "2026-02-20",
      status: "in-progress",
      category: "planting",
      priority: "critical",
      estimatedDuration: 50,
      createdAt: new Date().toISOString()
    }
  ]);

  const [activeTab, setActiveTab] = useState("upcoming");
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showAutoGenerateInfo, setShowAutoGenerateInfo] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // ==========================================
  // LOAD TASKS FROM BACKEND
  // ==========================================

  useEffect(() => {
    loadTasksFromBackend();
  }, [userId]);

  const loadTasksFromBackend = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/tasks?userId=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.tasks && data.tasks.length > 0) {
          setTasks(data.tasks);
        }
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  // ==========================================
  // CALCULATIONS
  // ==========================================

  const tasksWithDates = tasks.map(t => ({
    ...t,
    dueDate: new Date(t.dueDate)
  }));

  const stats = calculateTaskStats(tasksWithDates);
  const upcomingTasks = getUpcomingTasks(tasksWithDates, 7);
  const overdueTasks = getOverdueTasks(tasksWithDates);
  const tasksByMonth = groupTasksByMonth(tasksWithDates);

  const getCategoryLabel = (category: string) => {
    const labels = {
      planting: { en: "Planting", sw: "Kupanda" },
      fertilizing: { en: "Fertilizing", sw: "Kumwagilia mbolea" },
      irrigation: { en: "Irrigation", sw: "Umwagiliaji" },
      "pest-control": { en: "Pest Control", sw: "Kudhibiti wadudu" },
      monitoring: { en: "Monitoring", sw: "Ufuatiliaji" },
      harvest: { en: "Harvest", sw: "Mavuno" },
      other: { en: "Other", sw: "Nyingine" }
    };
    return labels[category as keyof typeof labels]?.[language] || category;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-gray-900 text-white";
      case "high":
        return "bg-gray-700 text-white";
      case "normal":
        return "bg-gray-200 text-gray-700";
      case "low":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: { en: "Pending", sw: "Inasubiri" },
      "in-progress": { en: "In Progress", sw: "Inaendelea" },
      completed: { en: "Completed", sw: "Imekamilika" },
      skipped: { en: "Skipped", sw: "Imerukwa" }
    };
    return labels[status as keyof typeof labels]?.[language] || status;
  };

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleCompleteTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Update locally
    setTasks(tasks.map(t =>
      t.id === taskId
        ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() }
        : t
    ));

    // Save to backend
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/tasks/${taskId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ status: 'completed', completedAt: new Date().toISOString() })
        }
      );

      toast.success(language === "sw" ? "Kazi imekamilika" : "Task completed");
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error(language === "sw" ? "Hitilafu" : "Error updating task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(tasks.filter(t => t.id !== taskId));

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/tasks/${taskId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      toast.success(language === "sw" ? `${task?.title} imeondolewa` : `${task?.title} removed`);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const navigateToCropPlanning = () => {
    if (onNavigate) {
      onNavigate("land-allocation");
      toast.success(language === "sw" 
        ? "Nenda kwenye Mpango wa Mazao kutengeneza kazi" 
        : "Go to Crop Planning to generate tasks");
    }
  };

  // ==========================================
  // TAB 1: UPCOMING TASKS
  // ==========================================

  const UpcomingTasksView = () => (
    <div className="space-y-4">
      {/* Info Banner */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-[#2E7D32] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {language === "sw" ? "Kazi Zinatengenezwa Kiotomatiki" : "Tasks Generated Automatically"}
              </p>
              <p className="text-xs text-gray-600">
                {language === "sw" 
                  ? "Kazi zinaundwa kiotomatiki kutoka kwa mipango ya mazao yako. Nenda kwenye Mpango wa Mazao kuongeza zao."
                  : "Tasks are created automatically from your crop plans. Go to Crop Planning to add crops."}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-[#2E7D32] border-[#2E7D32] hover:bg-gray-50"
                onClick={navigateToCropPlanning}
              >
                <Plus className="h-3 w-3 mr-1" />
                {language === "sw" ? "Ongeza Mazao" : "Add Crops"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Tasks (Next 7 days) */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          {language === "sw" ? "Siku 7 Zijazo" : "Next 7 Days"}
        </h3>
        {upcomingTasks.length > 0 ? (
          <div className="space-y-3">
            {upcomingTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {language === "sw" 
                  ? "Hakuna kazi zijazo. Ongeza mazao kupata kazi."
                  : "No upcoming tasks. Add crops to generate tasks."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {language === "sw" ? "Kazi Zilizopitwa na Wakati" : "Overdue Tasks"}
          </h3>
          <div className="space-y-3">
            {overdueTasks.map(task => (
              <TaskCard key={task.id} task={task} isOverdue />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ==========================================
  // TAB 2: BY CROP
  // ==========================================

  const ByCropView = () => {
    const tasksByCrop = tasks.reduce((acc, task) => {
      if (!acc[task.cropName]) {
        acc[task.cropName] = [];
      }
      acc[task.cropName].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    return (
      <div className="space-y-4">
        {Object.entries(tasksByCrop).map(([cropName, cropTasks]) => (
          <Card key={cropName} className="border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-[#2E7D32]" />
                  <CardTitle className="text-base">{cropName}</CardTitle>
                  <Badge variant="outline">{cropTasks.length} tasks</Badge>
                </div>
                <Badge className="bg-[#2E7D32] text-white">
                  {cropTasks.filter(t => t.status === 'completed').length}/{cropTasks.length} {language === "sw" ? "imekamilika" : "completed"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {cropTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={task.status === 'completed'}
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-[#2E7D32]" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 hover:text-[#2E7D32]" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(task.priority)} variant="outline">
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {Object.keys(tasksByCrop).length === 0 && (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-12 text-center">
              <Sprout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                {language === "sw" 
                  ? "Hakuna kazi za mazao. Ongeza mazao kwenye mpango."
                  : "No crop tasks. Add crops to your plan."}
              </p>
              <Button
                onClick={navigateToCropPlanning}
                className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {language === "sw" ? "Nenda Mpango wa Mazao" : "Go to Crop Planning"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // ==========================================
  // TAB 3: CALENDAR
  // ==========================================

  const CalendarView = () => (
    <div className="space-y-4">
      {Array.from(tasksByMonth.entries()).map(([month, monthTasks]) => (
        <Card key={month} className="border border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{month}</CardTitle>
              <Badge variant="outline">{monthTasks.length} tasks</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {monthTasks.map(task => (
              <TaskCard key={task.id} task={task} compact />
            ))}
          </CardContent>
        </Card>
      ))}

      {tasksByMonth.size === 0 && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {language === "sw" 
                ? "Hakuna kazi zimepangwa bado."
                : "No tasks scheduled yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // ==========================================
  // TASK CARD COMPONENT
  // ==========================================

  const TaskCard = ({ task, isOverdue = false, compact = false }: { task: Task, isOverdue?: boolean, compact?: boolean }) => (
    <Card className={`border ${isOverdue ? 'border-gray-400 bg-gray-50' : 'border-gray-200'} hover:border-[#2E7D32] transition-colors`}>
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={() => handleCompleteTask(task.id)}
              disabled={task.status === 'completed'}
              className="mt-1"
            >
              {task.status === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-[#2E7D32]" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 hover:text-[#2E7D32]" />
              )}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className={`font-semibold text-sm ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h4>
                <Badge className={getPriorityColor(task.priority)} variant="outline">
                  {task.priority}
                </Badge>
              </div>
              {!compact && (
                <p className="text-xs text-gray-600 mb-2">{task.description}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Sprout className="h-3 w-3" />
                  {task.cropName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
                {task.fieldName && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {task.fieldName}
                  </span>
                )}
                {task.estimatedDuration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {task.estimatedDuration}h
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTask(task)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteTask(task.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!compact && task.inputs && task.inputs.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-700 mb-1">
              {language === "sw" ? "Pembejeo" : "Inputs Required"}
            </p>
            {task.inputs.map((input, idx) => (
              <p key={idx} className="text-xs text-gray-600">
                • {input.name}: {input.quantity}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // ==========================================
  // RENDER MAIN COMPONENT
  // ==========================================

  return (
    <div className="space-y-6 pb-6">
      {/* Summary Card */}
      <Card className="border-[#2E7D32] bg-white">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {language === "sw" ? "Muhtasari wa Kazi" : "Task Summary"}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">
                {language === "sw" ? "Jumla" : "Total"}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">{language === "sw" ? "kazi" : "tasks"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {language === "sw" ? "Inasubiri" : "Pending"}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-xs text-gray-500">{language === "sw" ? "kazi" : "tasks"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {language === "sw" ? "Imekamilika" : "Completed"}
              </p>
              <p className="text-2xl font-bold text-[#2E7D32]">{stats.completed}</p>
              <p className="text-xs text-gray-500">
                {stats.completionRate.toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {language === "sw" ? "Zimechelewa" : "Overdue"}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
              <p className="text-xs text-gray-500">{language === "sw" ? "kazi" : "tasks"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]">
            <Clock className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">
              {language === "sw" ? "Zijazo" : "Upcoming"}
            </span>
          </TabsTrigger>
          <TabsTrigger value="by-crop" className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]">
            <Sprout className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">
              {language === "sw" ? "Kwa Zao" : "By Crop"}
            </span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">
              {language === "sw" ? "Kalenda" : "Calendar"}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <UpcomingTasksView />
        </TabsContent>

        <TabsContent value="by-crop" className="mt-6">
          <ByCropView />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <CalendarView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
