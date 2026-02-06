import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  CheckCircle,
  Circle,
  Clock,
  Calendar,
  Plus,
  Filter,
  TrendingUp,
  AlertTriangle,
  Star,
  User,
  MapPin,
  Tag,
  MoreVertical,
  Edit2,
  Trash2,
  Flag,
  Archive,
  ChevronRight,
  Target,
  Activity
} from "lucide-react";

interface TaskManagementProps {
  userId: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in-progress" | "completed";
  category: string;
  dueDate: string;
  assignee?: string;
  location?: string;
  tags: string[];
}

export function TaskManagement({ userId }: TaskManagementProps) {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [showAddTask, setShowAddTask] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Apply fertilizer to maize field",
      description: "Section A requires NPK fertilizer application",
      priority: "high",
      status: "todo",
      category: "Fertilization",
      dueDate: "2026-01-09",
      location: "Section A",
      tags: ["maize", "fertilizer", "urgent"]
    },
    {
      id: "2",
      title: "Check irrigation system",
      description: "Inspect all drip lines and repair leaks",
      priority: "medium",
      status: "completed",
      category: "Irrigation",
      dueDate: "2026-01-08",
      location: "All sections",
      tags: ["water", "maintenance"]
    },
    {
      id: "3",
      title: "Scout for pests in tomato field",
      description: "Look for whiteflies and aphids",
      priority: "high",
      status: "in-progress",
      category: "Pest Control",
      dueDate: "2026-01-09",
      location: "Section C",
      tags: ["tomatoes", "pests", "monitoring"]
    },
    {
      id: "4",
      title: "Harvest beans",
      description: "Beans are ready for harvesting",
      priority: "urgent",
      status: "todo",
      category: "Harvesting",
      dueDate: "2026-01-10",
      location: "Section B",
      tags: ["beans", "harvest"]
    },
    {
      id: "5",
      title: "Prepare land for planting",
      description: "Plough and prepare soil for next season",
      priority: "low",
      status: "todo",
      category: "Land Preparation",
      dueDate: "2026-01-15",
      location: "Section D",
      tags: ["preparation", "ploughing"]
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-700 border-red-300";
      case "high": return "bg-orange-100 text-orange-700 border-orange-300";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default: return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return <AlertTriangle className="h-3 w-3" />;
      case "high": return <Flag className="h-3 w-3" />;
      default: return <Flag className="h-3 w-3" />;
    }
  };

  const getStatusColumns = () => {
    return [
      { id: "todo", label: "To Do", icon: Circle, color: "text-gray-600", count: tasks.filter(t => t.status === "todo").length },
      { id: "in-progress", label: "In Progress", icon: Clock, color: "text-blue-600", count: tasks.filter(t => t.status === "in-progress").length },
      { id: "completed", label: "Completed", icon: CheckCircle, color: "text-green-600", count: tasks.filter(t => t.status === "completed").length },
    ];
  };

  const filteredTasks = filterStatus === "all" 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== "completed").length,
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white">
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-black">Task Management</h1>
              </div>
              <p className="text-white/90 text-sm">
                Organize and track all your farm activities
              </p>
            </div>
            <Button
              onClick={() => setShowAddTask(true)}
              className="bg-white text-orange-600 hover:bg-white/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">Total Tasks</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">In Progress</p>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">Overdue</p>
              <p className="text-2xl font-bold text-[rgb(252,251,251)]">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap
              ${filterStatus === "all"
                ? "bg-orange-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300"
              }
            `}
          >
            All ({tasks.length})
          </button>
          {getStatusColumns().map((col) => {
            const Icon = col.icon;
            return (
              <button
                key={col.id}
                onClick={() => setFilterStatus(col.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                  ${filterStatus === col.id
                    ? "bg-orange-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {col.label} ({col.count})
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid lg:grid-cols-3 gap-6">
        {getStatusColumns().map((column) => {
          const Icon = column.icon;
          const columnTasks = tasks.filter(t => t.status === column.id);
          
          return (
            <div key={column.id} className="space-y-3">
              {/* Column Header */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border-2 border-gray-200">
                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${column.color}`} />
                  <h3 className="font-bold text-gray-900">{column.label}</h3>
                  <Badge variant="secondary">{column.count}</Badge>
                </div>
              </div>

              {/* Task Cards */}
              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-lg transition-all border-2 hover:border-orange-300 cursor-pointer">
                    <CardContent className="p-4 space-y-3">
                      {/* Priority Badge */}
                      <div className="flex items-start justify-between">
                        <Badge className={`${getPriorityColor(task.priority)} border text-xs font-bold`}>
                          {getPriorityIcon(task.priority)}
                          <span className="ml-1">{task.priority.toUpperCase()}</span>
                        </Badge>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{task.title}</h4>
                        <p className="text-xs text-gray-600">{task.description}</p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Meta Info */}
                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Calendar className="h-3 w-3" />
                            Due Date
                          </span>
                          <span className="font-semibold text-gray-900">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>

                        {task.location && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1 text-gray-600">
                              <MapPin className="h-3 w-3" />
                              Location
                            </span>
                            <span className="font-semibold text-gray-900">{task.location}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Tag className="h-3 w-3" />
                            Category
                          </span>
                          <span className="font-semibold text-gray-900">{task.category}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                          <Edit2 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        {task.status !== "completed" && (
                          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add Task to Column */}
                <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 transition-all">
                  <Plus className="h-4 w-4 inline mr-2" />
                  Add task to {column.label}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Productivity Insights */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Productivity Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <h4 className="font-semibold text-sm">Completion Rate</h4>
              </div>
              <p className="text-3xl font-black text-green-600">
                {((stats.completed / stats.total) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {stats.completed} of {stats.total} tasks completed
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <h4 className="font-semibold text-sm">Active Tasks</h4>
              </div>
              <p className="text-3xl font-black text-blue-600">{stats.inProgress}</p>
              <p className="text-xs text-gray-600 mt-1">Currently being worked on</p>
            </div>

            <div className="p-4 bg-white rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </div>
                <h4 className="font-semibold text-sm">Overdue</h4>
              </div>
              <p className="text-3xl font-black text-orange-600">{stats.overdue}</p>
              <p className="text-xs text-gray-600 mt-1">Need immediate attention</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add New Task</CardTitle>
                <button onClick={() => setShowAddTask(false)}>
                  <Plus className="h-5 w-5 rotate-45" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Task Title</Label>
                <Input placeholder="e.g., Water tomato plants" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Add details about the task..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="e.g., Section A" />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                  Create Task
                </Button>
                <Button variant="outline" onClick={() => setShowAddTask(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}