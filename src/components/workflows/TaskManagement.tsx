import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import {
  ClipboardList,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Loader2,
  Sparkles,
  Plus,
  UserCircle
} from "lucide-react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface Task {
  id: string;
  title: string;
  description: string;
  category: "planting" | "weeding" | "fertilizing" | "harvesting" | "irrigation" | "pest_control" | "general";
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "overdue";
  assignedTo: string[];
  dueDate: string;
  estimatedHours: number;
  actualHours?: number;
  location: string;
  cropType?: string;
  aiSuggestions?: string[];
  createdDate: string;
  completedDate?: string;
}

interface LaborWorker {
  id: string;
  name: string;
  phone: string;
  role: string;
  activeTasks: number;
  completedTasks: number;
  hoursWorked: number;
  efficiency: number;
  dailyRate: number;
}

interface TaskManagementProps {
  userId: string;
  userRole: string;
}

const TASK_CATEGORIES = [
  { value: "planting", label: "🌱 Planting" },
  { value: "weeding", label: "🌿 Weeding" },
  { value: "fertilizing", label: "💧 Fertilizing" },
  { value: "harvesting", label: "🌾 Harvesting" },
  { value: "irrigation", label: "💦 Irrigation" },
  { value: "pest_control", label: "🐛 Pest Control" },
  { value: "general", label: "📋 General" }
];

export function TaskManagement({ userId, userRole }: TaskManagementProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workers, setWorkers] = useState<LaborWorker[]>([]);
  const [showNewTask, setShowNewTask] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    category: "general" as Task["category"],
    priority: "medium" as Task["priority"],
    assignedTo: [] as string[],
    dueDate: "",
    estimatedHours: "",
    location: "",
    cropType: ""
  });

  useEffect(() => {
    loadTasks();
    loadWorkers();
  }, [userId]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/tasks/${userId}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      const data = await response.json();
      if (data.success) {
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkers = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/workers/${userId}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      const data = await response.json();
      if (data.success) {
        setWorkers(data.workers || []);
      }
    } catch (error) {
      console.error("Error loading workers:", error);
    }
  };

  const createTask = async () => {
    setCreatingTask(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/tasks/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            userId,
            ...taskForm,
            estimatedHours: parseFloat(taskForm.estimatedHours) || 0
          })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setTasks([data.task, ...tasks]);
        setShowNewTask(false);
        setTaskForm({
          title: "",
          description: "",
          category: "general",
          priority: "medium",
          assignedTo: [],
          dueDate: "",
          estimatedHours: "",
          location: "",
          cropType: ""
        });
      } else {
        alert(data.error || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    } finally {
      setCreatingTask(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task["status"]) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/tasks/update-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ taskId, status: newStatus })
        }
      );

      const data = await response.json();
      if (data.success) {
        await loadTasks();
        await loadWorkers();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-gray-100 text-gray-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTasks = filterStatus === "all" 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus);

  const pendingTasks = tasks.filter(t => t.status === "pending").length;
  const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const overdueTasks = tasks.filter(t => t.status === "overdue").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-blue-600" />
            Task & Labor Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            AI-powered task scheduling, worker assignment, and productivity tracking
          </p>
        </div>
        <Button onClick={() => setShowNewTask(true)} className="bg-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{pendingTasks}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressTasks}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Loader2 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Workers</p>
                <p className="text-2xl font-bold text-purple-600">{workers.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workers Summary */}
      {workers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              Labor Force Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {workers.map(worker => (
                <div key={worker.id} className="bg-gray-50 p-3 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-gray-600" />
                        {worker.name}
                      </p>
                      <p className="text-xs text-gray-600">{worker.role}</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 text-xs">
                      {worker.efficiency}% eff.
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600">Active</p>
                      <p className="font-semibold text-blue-600">{worker.activeTasks}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Done</p>
                      <p className="font-semibold text-green-600">{worker.completedTasks}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Hours</p>
                      <p className="font-semibold">{worker.hoursWorked}h</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Task Form */}
      {showNewTask && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
            <CardDescription>
              Define task details and AI will suggest optimal scheduling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Task Title</Label>
              <Input
                placeholder="e.g., Weed maize field section A"
                value={taskForm.title}
                onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Detailed task description..."
                value={taskForm.description}
                onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={taskForm.category}
                  onValueChange={(value: any) => setTaskForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(value: any) => setTaskForm(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Estimated Hours</Label>
                <Input
                  type="number"
                  placeholder="e.g., 8"
                  value={taskForm.estimatedHours}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, estimatedHours: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="e.g., Field A, North section"
                  value={taskForm.location}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Crop Type (Optional)</Label>
                <Input
                  placeholder="e.g., Maize"
                  value={taskForm.cropType}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, cropType: e.target.value }))}
                />
              </div>
            </div>

            {workers.length > 0 && (
              <div className="space-y-2">
                <Label>Assign Workers</Label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {workers.map(worker => (
                    <label key={worker.id} className="flex items-center gap-2 p-2 border rounded hover:bg-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={taskForm.assignedTo.includes(worker.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTaskForm(prev => ({ ...prev, assignedTo: [...prev.assignedTo, worker.id] }));
                          } else {
                            setTaskForm(prev => ({ ...prev, assignedTo: prev.assignedTo.filter(id => id !== worker.id) }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{worker.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                onClick={createTask}
                disabled={!taskForm.title || !taskForm.dueDate || creatingTask}
                className="bg-blue-600"
              >
                {creatingTask ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create Task with AI Suggestions
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowNewTask(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          onClick={() => setFilterStatus("all")}
          size="sm"
        >
          All ({tasks.length})
        </Button>
        <Button
          variant={filterStatus === "pending" ? "default" : "outline"}
          onClick={() => setFilterStatus("pending")}
          size="sm"
        >
          Pending ({pendingTasks})
        </Button>
        <Button
          variant={filterStatus === "in_progress" ? "default" : "outline"}
          onClick={() => setFilterStatus("in_progress")}
          size="sm"
        >
          In Progress ({inProgressTasks})
        </Button>
        <Button
          variant={filterStatus === "completed" ? "default" : "outline"}
          onClick={() => setFilterStatus("completed")}
          size="sm"
        >
          Completed ({completedTasks})
        </Button>
        {overdueTasks > 0 && (
          <Button
            variant={filterStatus === "overdue" ? "default" : "outline"}
            onClick={() => setFilterStatus("overdue")}
            size="sm"
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Overdue ({overdueTasks})
          </Button>
        )}
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-semibold mb-2">No tasks found</h3>
            <p className="text-sm text-gray-600">
              {filterStatus === "all" ? "Create your first task to get started" : `No ${filterStatus} tasks`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredTasks.map(task => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{task.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </Badge>
                          <Badge variant="outline">
                            {TASK_CATEGORIES.find(c => c.value === task.category)?.label}
                          </Badge>
                          {task.location && (
                            <Badge variant="outline">{task.location}</Badge>
                          )}
                        </div>
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>

                    {task.aiSuggestions && task.aiSuggestions.length > 0 && (
                      <div className="mt-3 bg-purple-50 p-2 rounded text-xs">
                        <p className="font-medium text-purple-700 mb-1 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          AI Suggestions:
                        </p>
                        <ul className="space-y-1 ml-4">
                          {task.aiSuggestions.map((suggestion, idx) => (
                            <li key={idx} className="text-gray-700">• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {task.assignedTo.length > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <Users className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-600">Assigned to:</span>
                        {task.assignedTo.map(workerId => {
                          const worker = workers.find(w => w.id === workerId);
                          return worker ? (
                            <Badge key={workerId} variant="secondary" className="text-xs">
                              {worker.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}

                    {task.status !== "completed" && (
                      <div className="mt-3 flex gap-2">
                        {task.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => updateTaskStatus(task.id, "in_progress")}
                            className="bg-blue-600 text-xs h-7"
                          >
                            Start Task
                          </Button>
                        )}
                        {task.status === "in_progress" && (
                          <Button
                            size="sm"
                            onClick={() => updateTaskStatus(task.id, "completed")}
                            className="bg-green-600 text-xs h-7"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
