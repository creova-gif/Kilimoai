import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Sprout,
  Calendar,
  TrendingUp,
  CloudRain,
  Bug,
  DollarSign,
  MapPin,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  PlusCircle,
  Target,
  Leaf,
  Sun,
  Droplets,
  Scale,
  Clock,
  Activity,
  Download,
  Search,
  WifiOff,
  Loader2,
  TrendingDown,
  AlertTriangle,
  Eye
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface CropPlan {
  id: string;
  cropName: string;
  variety: string;
  field: string;
  fieldSize: number; // acres
  season: string;
  plantingDate: string;
  expectedHarvestDate: string;
  actualHarvestDate?: string;
  status: "planned" | "planted" | "growing" | "harvested";
  progress: number;
  currentStage: string;
  expectedYield: number;
  actualYield?: number;
  yieldUnit: string;
}

interface TaskTemplate {
  id: string;
  cropId: string;
  taskName: string;
  stage: string;
  daysAfterPlanting: number;
  priority: "high" | "medium" | "low";
  estimatedCost: number;
  completed: boolean;
}

interface SoilHealth {
  fieldId: string;
  pH: number;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  organicMatter: number;
  lastTested: string;
  recommendations: string[];
}

// Tab Module Interfaces for Dynamic Navigation
interface TabDataState {
  status: "live" | "cached" | "loading" | "error" | "offline";
  lastUpdated?: string;
  enabled: boolean;
}

interface TabMetadata {
  id: string;
  label: string;
  icon: any;
  insight?: string | number;
  insightType?: "success" | "warning" | "error" | "neutral";
  badge?: string;
  description: string;
  dataState: TabDataState;
}

export function CropPlanningManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSeason, setSelectedSeason] = useState("2024A");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isOnline, setIsOnline] = useState(true);
  const [tabStates, setTabStates] = useState<Record<string, TabDataState>>({
    overview: { status: "live", lastUpdated: new Date().toISOString(), enabled: true },
    calendar: { status: "live", lastUpdated: new Date().toISOString(), enabled: true },
    soil: { status: "cached", lastUpdated: "2024-01-20", enabled: true },
    yield: { status: "live", lastUpdated: new Date().toISOString(), enabled: true },
    reports: { status: "live", lastUpdated: new Date().toISOString(), enabled: true },
  });

  // Mock data
  const cropPlans: CropPlan[] = [
    {
      id: "CP001",
      cropName: "Maize",
      variety: "H614 (Hybrid)",
      field: "Field 1",
      fieldSize: 15,
      season: "2024A",
      plantingDate: "2024-03-15",
      expectedHarvestDate: "2024-07-20",
      status: "growing",
      progress: 45,
      currentStage: "Tasseling",
      expectedYield: 3000,
      yieldUnit: "bags (100kg)"
    },
    {
      id: "CP002",
      cropName: "Beans",
      variety: "Lyamungo 90",
      field: "Field 2",
      fieldSize: 8,
      season: "2024A",
      plantingDate: "2024-03-20",
      expectedHarvestDate: "2024-06-25",
      status: "growing",
      progress: 55,
      currentStage: "Flowering",
      expectedYield: 800,
      yieldUnit: "bags (100kg)"
    },
    {
      id: "CP003",
      cropName: "Sunflower",
      variety: "Record",
      field: "Field 3",
      fieldSize: 10,
      season: "2024B",
      plantingDate: "2024-08-01",
      expectedHarvestDate: "2024-11-15",
      status: "planned",
      progress: 0,
      currentStage: "Planning",
      expectedYield: 1500,
      yieldUnit: "kg (seeds)"
    }
  ];

  const tasks: TaskTemplate[] = [
    {
      id: "T001",
      cropId: "CP001",
      taskName: "Top Dressing (NPK)",
      stage: "Vegetative",
      daysAfterPlanting: 45,
      priority: "high",
      estimatedCost: 450000,
      completed: false
    },
    {
      id: "T002",
      cropId: "CP001",
      taskName: "Weed Control",
      stage: "Vegetative",
      daysAfterPlanting: 30,
      priority: "medium",
      estimatedCost: 120000,
      completed: true
    },
    {
      id: "T003",
      cropId: "CP002",
      taskName: "Pest Scouting",
      stage: "Flowering",
      daysAfterPlanting: 50,
      priority: "high",
      estimatedCost: 0,
      completed: false
    }
  ];

  const soilHealth: SoilHealth[] = [
    {
      fieldId: "Field 1",
      pH: 6.2,
      nitrogen: "Medium",
      phosphorus: "High",
      potassium: "Medium",
      organicMatter: 3.5,
      lastTested: "2024-01-15",
      recommendations: [
        "Apply lime to raise pH to 6.5-7.0",
        "Add compost to increase organic matter",
        "Monitor nitrogen levels before planting"
      ]
    },
    {
      fieldId: "Field 2",
      pH: 6.8,
      nitrogen: "Low",
      phosphorus: "Medium",
      potassium: "High",
      organicMatter: 4.2,
      lastTested: "2024-01-20",
      recommendations: [
        "Apply nitrogen fertilizer at planting",
        "Consider legume rotation to improve nitrogen",
        "Soil health is good overall"
      ]
    }
  ];

  const stats = {
    totalAcresPlanned: cropPlans.reduce((sum, plan) => sum + plan.fieldSize, 0),
    cropTypesThisSeason: new Set(cropPlans.filter(p => p.season === selectedSeason).map(p => p.cropName)).size,
    expectedRevenue: 45000000,
    tasksCompleted: tasks.filter(t => t.completed).length,
    tasksPending: tasks.filter(t => !t.completed).length,
    avgYieldTrend: "+12%"
  };

  const getDaysUntilTask = (task: TaskTemplate, plan: CropPlan) => {
    const plantingDate = new Date(plan.plantingDate);
    const taskDate = new Date(plantingDate);
    taskDate.setDate(taskDate.getDate() + task.daysAfterPlanting);
    const today = new Date();
    return Math.floor((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Calculate dynamic insights for each tab
  const nutrientDeficitCount = soilHealth.filter(s => s.nitrogen === "Low" || s.phosphorus === "Low" || s.potassium === "Low").length;
  const avgYieldConfidence = 87; // Mock confidence score
  const forecastTrend = "+12%"; // Mock trend
  const estimatedProfit = stats.expectedRevenue - 12500000; // Revenue - Input costs
  const profitMargin = ((estimatedProfit / stats.expectedRevenue) * 100).toFixed(0);

  // Dynamic Tab Configuration
  const tabsConfig: TabMetadata[] = [
    {
      id: "overview",
      label: "Farm Snapshot",
      icon: Eye,
      insight: `${cropPlans.filter(p => p.season === selectedSeason).length} Active`,
      insightType: "neutral",
      description: "Real-time overview of all farm operations",
      dataState: tabStates.overview
    },
    {
      id: "calendar",
      label: "Activity Timeline",
      icon: Calendar,
      insight: `${stats.tasksPending} Pending`,
      insightType: stats.tasksPending > 3 ? "warning" : "success",
      badge: stats.tasksPending > 5 ? "Urgent" : undefined,
      description: "Growth stages and scheduled tasks",
      dataState: tabStates.calendar
    },
    {
      id: "soil",
      label: "Soil Intelligence",
      icon: Leaf,
      insight: nutrientDeficitCount > 0 ? `${nutrientDeficitCount} Deficits` : "Optimal",
      insightType: nutrientDeficitCount > 0 ? "warning" : "success",
      badge: nutrientDeficitCount > 0 ? `N-${nutrientDeficitCount}` : undefined,
      description: "Nutrient status and soil health analytics",
      dataState: tabStates.soil
    },
    {
      id: "yield",
      label: "Production & Earnings",
      icon: TrendingUp,
      insight: `${avgYieldConfidence}% • ${forecastTrend}`,
      insightType: parseInt(forecastTrend) > 0 ? "success" : "error",
      badge: `${profitMargin}% Margin`,
      description: "Yield forecasts and revenue projections",
      dataState: tabStates.yield
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      insight: "3 Available",
      insightType: "neutral",
      description: "Export comprehensive analytics",
      dataState: tabStates.reports
    }
  ];

  // Status indicator component
  const getStatusIndicator = (status: TabDataState["status"]) => {
    switch (status) {
      case "live":
        return <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />;
      case "cached":
        return <WifiOff className="h-3 w-3 text-amber-500" />;
      case "loading":
        return <Loader2 className="h-3 w-3 text-gray-500 animate-spin" />;
      case "error":
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      case "offline":
        return <WifiOff className="h-3 w-3 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Crop Planning</h1>
          <p className="text-gray-600">Plan, monitor, and optimize crop production from planting to harvest</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="2024A">2024A (Mar-Jul)</option>
            <option value="2024B">2024B (Aug-Dec)</option>
            <option value="2025A">2025A (Mar-Jul)</option>
          </select>
          <Button className="bg-green-700 hover:bg-green-800">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Plan
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Acres</p>
                <p className="text-3xl font-bold">{stats.totalAcresPlanned}</p>
                <p className="text-sm text-gray-600 mt-1">{stats.cropTypesThisSeason} crops</p>
              </div>
              <MapPin className="h-10 w-10 text-green-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Expected Revenue</p>
                <p className="text-2xl font-bold">TZS {(stats.expectedRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-gray-600 mt-1">{stats.avgYieldTrend} vs last season</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Tasks</p>
                <p className="text-3xl font-bold">{stats.tasksPending}</p>
                <p className="text-sm text-gray-600 mt-1">{stats.tasksCompleted} completed</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Crop Health</p>
                <p className="text-3xl font-bold">92%</p>
                <p className="text-sm text-gray-600 mt-1">All fields</p>
              </div>
              <Activity className="h-10 w-10 text-green-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Dynamic, Data-Driven Navigation System */}
        <div className="w-full bg-white border rounded-lg p-1 shadow-sm mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-1">
            {tabsConfig.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => tab.dataState.enabled && setActiveTab(tab.id)}
                  disabled={!tab.dataState.enabled}
                  className={`
                    relative p-3 rounded-md transition-all duration-200
                    ${isActive 
                      ? 'bg-green-700 text-white shadow-md' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }
                    ${!tab.dataState.enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                  `}
                >
                  {/* Tab Header with Icon & Label */}
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    <span className={`text-xs md:text-sm font-medium truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {tab.label}
                    </span>
                    
                    {/* Data Status Indicator */}
                    <div className="ml-auto flex-shrink-0">
                      {getStatusIndicator(tab.dataState.status)}
                    </div>
                  </div>
                  
                  {/* Smart Insights - Only show on active or when there's critical info */}
                  {(isActive || tab.insightType === 'warning' || tab.insightType === 'error') && tab.insight && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`
                        text-xs font-semibold truncate
                        ${isActive 
                          ? 'text-white/90' 
                          : tab.insightType === 'success' 
                            ? 'text-green-600' 
                            : tab.insightType === 'warning' 
                              ? 'text-amber-600' 
                              : tab.insightType === 'error' 
                                ? 'text-red-600' 
                                : 'text-gray-600'
                        }
                      `}>
                        {tab.insight}
                      </span>
                    </div>
                  )}
                  
                  {/* Badge for Critical Info */}
                  {tab.badge && (
                    <div className="absolute top-1 right-1">
                      <Badge 
                        className={`
                          text-[10px] px-1.5 py-0.5 h-auto
                          ${isActive 
                            ? 'bg-white/20 text-white border-white/30' 
                            : tab.insightType === 'warning' 
                              ? 'bg-amber-100 text-amber-700 border-amber-200' 
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }
                        `}
                      >
                        {tab.badge}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Mobile-only: Show description on active tab */}
                  {isActive && (
                    <p className={`text-[10px] mt-1 text-white/80 lg:hidden`}>
                      {tab.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Connection Status Bar (Bottom) */}
          {!isOnline && (
            <div className="mt-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2">
              <WifiOff className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-xs text-amber-700 font-medium">Offline Mode - Showing cached data</span>
            </div>
          )}
        </div>

        <TabsContent value="overview" className="space-y-4">
          {/* Active Crops */}
          <Card>
            <CardHeader className="space-y-4">
              <div>
                <CardTitle>Active Crop Plans ({selectedSeason})</CardTitle>
                <CardDescription>Track growth stages and manage seasonal activities</CardDescription>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by crop name, field, or variety..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filter Tabs */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  className={statusFilter === "all" ? "bg-green-700 hover:bg-green-800" : ""}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === "growing" ? "default" : "outline"}
                  onClick={() => setStatusFilter("growing")}
                  className={statusFilter === "growing" ? "bg-green-700 hover:bg-green-800" : ""}
                >
                  Growing
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === "harvested" ? "default" : "outline"}
                  onClick={() => setStatusFilter("harvested")}
                  className={statusFilter === "harvested" ? "bg-green-700 hover:bg-green-800" : ""}
                >
                  Harvested
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === "planned" ? "default" : "outline"}
                  onClick={() => setStatusFilter("planned")}
                  className={statusFilter === "planned" ? "bg-green-700 hover:bg-green-800" : ""}
                >
                  Planned
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cropPlans
                  .filter(p => p.season === selectedSeason)
                  .filter(p => 
                    p.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.variety.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .filter(p => statusFilter === "all" || p.status === statusFilter)
                  .map((plan) => (
                    <div key={plan.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-12 w-12 ${plan.status === 'growing' ? 'bg-green-100' : plan.status === 'harvested' ? 'bg-gray-100' : 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                            <Sprout className={`h-6 w-6 ${plan.status === 'growing' ? 'text-green-600' : plan.status === 'harvested' ? 'text-gray-600' : 'text-gray-600'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-lg font-medium">{plan.cropName}</p>
                              <Badge variant="outline" className="text-xs">{plan.variety}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {plan.field} • {plan.fieldSize} acres • {plan.currentStage}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={
                            plan.status === "growing"
                              ? "bg-green-100 text-green-700"
                              : plan.status === "harvested"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {plan.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                        <div>
                          <p className="text-gray-600">Planting Date</p>
                          <p className="font-medium">{plan.plantingDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Expected Harvest</p>
                          <p className="font-medium">{plan.expectedHarvestDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Expected Yield</p>
                          <p className="font-medium">{plan.expectedYield} {plan.yieldUnit}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Growth Progress</p>
                          <p className="font-medium">{plan.progress}%</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Season Progress</span>
                          <span className="font-medium">{plan.progress}% Complete</span>
                        </div>
                        <Progress value={plan.progress} className="h-2" />
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          View Schedule
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bug className="h-3 w-3 mr-1" />
                          Health Check
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Farm Tasks</CardTitle>
              <CardDescription>Scheduled activities and maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.filter(t => !t.completed).map((task) => {
                  const plan = cropPlans.find(p => p.id === task.cropId);
                  if (!plan) return null;
                  const daysUntil = getDaysUntilTask(task, plan);

                  return (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">{task.taskName}</p>
                          <p className="text-sm text-gray-600">
                            {plan.cropName} - {plan.field} • Stage: {task.stage}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {daysUntil > 0 ? `In ${daysUntil} days` : daysUntil === 0 ? "Today" : `${Math.abs(daysUntil)} days ago`}
                          </p>
                          <p className="text-xs text-gray-600">Est. TZS {(task.estimatedCost / 1000).toFixed(0)}K</p>
                        </div>
                        <Badge
                          className={
                            task.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {task.priority}
                        </Badge>
                        <Button size="sm">Mark Done</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Calendar & Task Scheduling</CardTitle>
              <CardDescription>Plan and track activities across the growing season</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Timeline visualization */}
                <div className="grid grid-cols-5 gap-2 text-center text-sm font-medium mb-4">
                  <div className="p-2 bg-gray-100 rounded">Mar</div>
                  <div className="p-2 bg-green-100 rounded">Apr-May</div>
                  <div className="p-2 bg-yellow-100 rounded">Jun</div>
                  <div className="p-2 bg-orange-100 rounded">Jul</div>
                  <div className="p-2 bg-red-100 rounded">Aug</div>
                </div>

                {cropPlans.filter(p => p.season === selectedSeason && p.status !== "planned").map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{plan.cropName} - {plan.field}</p>
                        <p className="text-sm text-gray-600">{plan.variety}</p>
                      </div>
                      <Badge variant="outline">{plan.fieldSize} acres</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Sun className="h-4 w-4 text-yellow-600" />
                        <span className="text-gray-600">Planting:</span>
                        <span className="font-medium">{plan.plantingDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Droplets className="h-4 w-4 text-gray-700" />
                        <span className="text-gray-600">Flowering:</span>
                        <span className="font-medium">Week 8-10</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Scale className="h-4 w-4 text-orange-600" />
                        <span className="text-gray-600">Harvest:</span>
                        <span className="font-medium">{plan.expectedHarvestDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Automated Planting Calculations</CardTitle>
              <CardDescription>Seed rate, fertilizer, and input requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Maize - Field 1 (15 acres)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seed Required</span>
                      <span className="font-medium">250 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Basal Fertilizer (DAP)</span>
                      <span className="font-medium">15 bags (50kg)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Top Dressing (NPK)</span>
                      <span className="font-medium">12 bags (50kg)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Input Cost</span>
                      <span className="font-medium">TZS 2.8M</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Beans - Field 2 (8 acres)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seed Required</span>
                      <span className="font-medium">120 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Basal Fertilizer (DAP)</span>
                      <span className="font-medium">6 bags (50kg)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Herbicide</span>
                      <span className="font-medium">4 liters</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Input Cost</span>
                      <span className="font-medium">TZS 950K</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="soil" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Soil Health & Amendment Tracking</CardTitle>
              <CardDescription>Monitor soil conditions and optimize fertilizer use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {soilHealth.map((soil) => (
                  <div key={soil.fieldId} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{soil.fieldId}</h4>
                        <p className="text-sm text-gray-600">Last tested: {soil.lastTested}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        Schedule Test
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">pH Level</p>
                        <p className="text-2xl font-bold">{soil.pH}</p>
                        <p className="text-xs text-gray-600">Target: 6.5-7.0</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Nitrogen (N)</p>
                        <p className="text-lg font-bold">{soil.nitrogen}</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Phosphorus (P)</p>
                        <p className="text-lg font-bold">{soil.phosphorus}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Potassium (K)</p>
                        <p className="text-lg font-bold">{soil.potassium}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Organic Matter</p>
                        <p className="text-2xl font-bold">{soil.organicMatter}%</p>
                        <p className="text-xs text-gray-600">Target: &gt;3%</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <h5 className="font-medium mb-2 text-sm flex items-center gap-2">
                        <Target className="h-4 w-4 text-gray-700" />
                        Recommendations
                      </h5>
                      <ul className="space-y-1 text-sm">
                        {soil.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-gray-700 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yield" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yield Forecasting & Revenue Estimates</CardTitle>
              <CardDescription>AI-powered predictions based on historical data and current conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cropPlans.filter(p => p.season === selectedSeason).map((plan) => {
                  const estimatedRevenue = plan.expectedYield * (plan.cropName === "Maize" ? 85000 : plan.cropName === "Beans" ? 120000 : 3500);
                  const yieldPerAcre = plan.expectedYield / plan.fieldSize;

                  return (
                    <div key={plan.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium">{plan.cropName} - {plan.field}</h4>
                          <p className="text-sm text-gray-600">{plan.variety} • {plan.fieldSize} acres</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          {plan.status === "growing" ? "On Track" : plan.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Expected Yield</p>
                          <p className="text-2xl font-bold">{plan.expectedYield}</p>
                          <p className="text-xs text-gray-600">{plan.yieldUnit}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Per Acre</p>
                          <p className="text-2xl font-bold">{yieldPerAcre.toFixed(0)}</p>
                          <p className="text-xs text-gray-600">{plan.yieldUnit}/acre</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Estimated Revenue</p>
                          <p className="text-xl font-bold">TZS {(estimatedRevenue / 1000000).toFixed(1)}M</p>
                          <p className="text-xs text-green-600">+12% vs avg</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Confidence</p>
                          <p className="text-2xl font-bold">87%</p>
                          <p className="text-xs text-gray-600">AI prediction</p>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-medium mb-2 text-sm">Yield Factors</h5>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <CloudRain className="h-4 w-4 text-gray-700" />
                            <span>Rainfall: Good</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-green-600" />
                            <span>Soil: Excellent</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Bug className="h-4 w-4 text-orange-600" />
                            <span>Pests: Low</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Historical Yield Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>2023A Season</span>
                      <span className="font-medium">2,850 bags/15ac</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>2023B Season</span>
                      <span className="font-medium">2,920 bags/15ac</span>
                    </div>
                    <Progress value={97} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>2024A Season (Forecast)</span>
                      <span className="font-medium text-green-600">3,000 bags/15ac</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Price Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Maize (Current)</p>
                    <p className="text-2xl font-bold">TZS 85,000/bag</p>
                    <p className="text-xs text-green-600">↑ 8% from last month</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Beans (Current)</p>
                    <p className="text-2xl font-bold">TZS 120,000/bag</p>
                    <p className="text-xs text-green-600">↑ 12% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <BarChart3 className="h-10 w-10 mb-3 text-gray-700" />
                <h4 className="font-medium mb-2">Production Report</h4>
                <p className="text-sm text-gray-600 mb-4">Detailed yield and harvest data</p>
                <Button size="sm" variant="outline" className="w-full">
                  <Download className="h-3 w-3 mr-1" />
                  Generate
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <DollarSign className="h-10 w-10 mb-3 text-green-600" />
                <h4 className="font-medium mb-2">Financial Summary</h4>
                <p className="text-sm text-gray-600 mb-4">Revenue, costs, and profitability</p>
                <Button size="sm" variant="outline" className="w-full">
                  <Download className="h-3 w-3 mr-1" />
                  Generate
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Leaf className="h-10 w-10 mb-3 text-gray-700" />
                <h4 className="font-medium mb-2">Sustainability Report</h4>
                <p className="text-sm text-gray-600 mb-4">Environmental impact metrics</p>
                <Button size="sm" variant="outline" className="w-full">
                  <Download className="h-3 w-3 mr-1" />
                  Generate
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Season Summary ({selectedSeason})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Acres Cultivated</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalAcresPlanned}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Expected Revenue</p>
                  <p className="text-3xl font-bold text-green-600">TZS {(stats.expectedRevenue / 1000000).toFixed(1)}M</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Input Costs</p>
                  <p className="text-3xl font-bold text-gray-900">TZS 12.5M</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Net Profit (Est.)</p>
                  <p className="text-3xl font-bold text-orange-600">TZS 32.5M</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}