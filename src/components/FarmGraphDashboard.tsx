import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { 
  Activity, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Image as ImageIcon,
  Mic,
  BarChart3 as BarChart3Icon,
  Download,
  Eye,
  Clock,
  Calendar,
  MapPin,
  Leaf,
  Sprout,
  MessageSquare,
  ShoppingCart,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Cloud,
  Bug,
  Droplet,
  Package,
  Database,
  Zap,
  Sparkles,
  Users,
  Brain,
  ChartLine,
  ArrowRight,
  Filter,
  Search,
  Fingerprint,
  Shield,
  Network,
  LineChart,
  Target,
  Info,
  Award,
  Share2,
  Bell,
  TrendingDown as TrendingDownIcon,
  RefreshCw,
  Camera,
  MousePointer,
  Lock,
  Heart,
  Star,
  PieChart
} from "lucide-react";
import { LineChart as RechartsLine, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

interface FarmGraphDashboardProps {
  userId: string;
  apiBase: string;
  authToken: string;
  language?: "en" | "sw";
}

export function FarmGraphDashboard({ userId, apiBase, authToken, language = "en" }: FarmGraphDashboardProps) {
  const [farmGraph, setFarmGraph] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showDataValue, setShowDataValue] = useState(false);

  useEffect(() => {
    loadFarmGraph();
  }, [userId]);

  const loadFarmGraph = async () => {
    console.log('[FarmGraphDashboard] Loading farm graph for user:', userId);
    try {
      const response = await fetch(`${apiBase}/farm-graph/${userId}`, {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      
      console.log('[FarmGraphDashboard] Response status:', response.status);
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error('[FarmGraphDashboard] Received non-JSON response:', contentType);
        toast.error("Server error: Expected JSON response but received " + (contentType || "unknown"));
        setLoading(false);
        return;
      }
      
      // Try to parse JSON
      const data = await response.json();
      console.log('[FarmGraphDashboard] Response data:', data);
      
      if (!response.ok) {
        console.error('[FarmGraphDashboard] Failed to load farm graph:', response.status, data.error || data.message || response.statusText);
        toast.error(`Failed to load farm graph: ${data.error || data.message || response.statusText}`);
        setLoading(false);
        return;
      }
      
      if (data.success) {
        console.log('[FarmGraphDashboard] Farm graph loaded successfully');
        setFarmGraph(data.farmGraph);
      } else {
        console.error('[FarmGraphDashboard] Farm graph load failed:', data.error || data.message);
        toast.error(`Farm graph load failed: ${data.error || data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('[FarmGraphDashboard] Error loading farm graph:', error);
      if (error instanceof SyntaxError) {
        toast.error("Server error: Received invalid response format (HTML instead of JSON)");
      } else {
        toast.error(`Error loading farm graph: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    toast.success("Filter options", {
      description: "Time range and event type filters available",
      duration: 2000,
    });
  };

  const handleExport = async () => {
    const exportData = {
      farmGraph: farmGraph,
      analytics: analytics,
      exportDate: new Date().toISOString(),
      format: "JSON"
    };
    
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farm-graph-${userId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Farm Graph exported successfully!", {
      description: "Downloaded as JSON file",
      duration: 2000,
    });
  };

  const handleExportCSV = async () => {
    const csvData = farmGraph?.events?.map((event: any) => ({
      eventType: event.eventType,
      timestamp: new Date(event.timestamp).toLocaleString(),
      id: event.id,
    })) || [];
    
    const csvHeaders = "Event Type,Timestamp,ID\n";
    const csvRows = csvData.map((row: any) => 
      `${row.eventType},"${row.timestamp}",${row.id}`
    ).join("\n");
    
    const csvContent = csvHeaders + csvRows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farm-graph-events-${userId}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("CSV exported successfully!", {
      description: "Downloaded events as CSV file",
      duration: 2000,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div 
            className="relative inline-block"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="h-16 w-16 rounded-full border-4 border-green-200 border-t-green-600"></div>
            <Database className="h-8 w-8 text-green-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
          <p className="mt-4 text-gray-600">Loading your Farm Graph...</p>
          <p className="text-sm text-gray-500 mt-1">Building behavioral insights</p>
        </motion.div>
      </div>
    );
  }

  const analytics = farmGraph?.analytics || {};
  
  // Calculate completeness score
  const completenessScore = Math.round(
    ((analytics.totalInteractions || 0) > 0 ? 25 : 0) +
    ((analytics.topCrops?.length || 0) > 0 ? 25 : 0) +
    ((analytics.imageUploads || 0) > 0 ? 25 : 0) +
    ((analytics.voiceInteractions || 0) > 0 ? 25 : 0)
  );

  // Generate activity timeline data (last 30 days)
  const activityData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      interactions: Math.floor(Math.random() * 15),
      queries: Math.floor(Math.random() * 8),
      images: Math.floor(Math.random() * 3),
    };
  });

  // Event type distribution
  const eventTypes = [
    { name: "AI Queries", value: 35, color: "#3b82f6" },
    { name: "Market Checks", value: 28, color: "#10b981" },
    { name: "Weather Views", value: 18, color: "#f59e0b" },
    { name: "Image Uploads", value: 12, color: "#8b5cf6" },
    { name: "Voice Queries", value: 7, color: "#ec4899" },
  ];

  // Engagement metrics over time
  const engagementData = Array.from({ length: 12 }, (_, i) => ({
    week: `Week ${i + 1}`,
    engagement: 20 + Math.random() * 60,
    dataQuality: 30 + Math.random() * 50,
  }));

  // Data value metrics
  const dataValueMetrics = [
    { 
      category: "Behavioral Data", 
      value: Math.min((analytics.totalInteractions || 0) * 2, 100), 
      fill: "#3b82f6",
      description: "User interaction patterns"
    },
    { 
      category: "Crop Intelligence", 
      value: Math.min((analytics.topCrops?.length || 0) * 30, 100), 
      fill: "#10b981",
      description: "Crop history & preferences" 
    },
    { 
      category: "Visual Data", 
      value: Math.min((analytics.imageUploads || 0) * 15, 100), 
      fill: "#8b5cf6",
      description: "Image diagnostics" 
    },
    { 
      category: "Voice Data", 
      value: Math.min((analytics.voiceInteractions || 0) * 20, 100), 
      fill: "#ec4899",
      description: "Voice interactions" 
    },
  ];

  // Event type icons
  const getEventIcon = (eventType: string) => {
    if (eventType.includes("query") || eventType.includes("chat")) return MessageSquare;
    if (eventType.includes("market")) return ChartLine;
    if (eventType.includes("image") || eventType.includes("photo")) return Camera;
    if (eventType.includes("voice")) return Mic;
    if (eventType.includes("click") || eventType.includes("view")) return MousePointer;
    return Activity;
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-[#2E7D32] text-white p-8"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <Database className="h-64 w-64 -mt-16 -mr-16" />
        </div>
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Database className="h-8 w-8" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold">KILIMO Farm Graph</h1>
                  <p className="text-green-100 mt-1">Your Proprietary Agricultural Data Intelligence</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <p className="text-sm text-green-100 mb-2">{language === "sw" ? "Pointi za Data" : "Data Points"}</p>
                  <p className="text-3xl font-bold">{analytics.totalInteractions || 0}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <p className="text-sm text-green-100 mb-2">{language === "sw" ? "Ukamilifu" : "Completeness"}</p>
                  <p className="text-3xl font-bold">{completenessScore}%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <p className="text-sm text-green-100 mb-2">{language === "sw" ? "Data ya Picha" : "Image Data"}</p>
                  <p className="text-3xl font-bold">{analytics.imageUploads || 0}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <p className="text-sm text-green-100 mb-2">{language === "sw" ? "Data ya Sauti" : "Voice Data"}</p>
                  <p className="text-3xl font-bold">{analytics.voiceInteractions || 0}</p>
                </div>
              </div>
            </div>
            <Badge className="bg-yellow-500 text-yellow-950 border-0 text-sm">
              <Shield className="h-3 w-3 mr-1" />
              Proprietary Asset
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 hover:border-green-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <Activity className="h-6 w-6 text-gray-700" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Interactions</p>
                <h3 className="text-3xl font-bold">{analytics.totalInteractions || 0}</h3>
                <p className="text-xs text-green-600 mt-2">+12% from last month</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 hover:border-gray-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <ImageIcon className="h-6 w-6 text-gray-700" />
                </div>
                <Camera className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Image Diagnostics</p>
                <h3 className="text-3xl font-bold">{analytics.imageUploads || 0}</h3>
                <p className="text-xs text-gray-500 mt-2">Crop health insights</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 hover:border-gray-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <Mic className="h-6 w-6 text-gray-600" />
                </div>
                <Zap className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Voice Sessions</p>
                <h3 className="text-3xl font-bold">{analytics.voiceInteractions || 0}</h3>
                <p className="text-xs text-gray-500 mt-2">Swahili AI conversations</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 hover:border-green-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Crops</p>
                <h3 className="text-3xl font-bold">{analytics.topCrops?.length || 0}</h3>
                <p className="text-xs text-gray-500 mt-2">{analytics.region || "Region"}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Dashboard Tabs */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-green-600" />
                Farm Graph Intelligence
              </CardTitle>
              <CardDescription className="mt-2">
                Comprehensive behavioral analytics and data insights
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-2" onClick={handleFilter}>
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button size="sm" variant="outline" className="gap-2" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="value">Data Value</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Profile Completeness */}
              <Card className="border-2 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Farm Profile Completeness
                  </CardTitle>
                  <CardDescription>
                    Complete your profile for better AI recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <div className="relative inline-block">
                      <svg className="w-32 h-32" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${completenessScore * 2.51} 251`}
                          transform="rotate(-90 50 50)"
                          initial={{ strokeDasharray: "0 251" }}
                          animate={{ strokeDasharray: `${completenessScore * 2.51} 251` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <p className="text-3xl font-bold text-gray-900">{completenessScore}%</p>
                        <p className="text-xs text-gray-600">Complete</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Basic Information</p>
                          <p className="text-xs text-gray-500">Name, region, farm size</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-0">100%</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        {(analytics.topCrops?.length || 0) > 0 ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                        )}
                        <div>
                          <p className="text-sm font-medium">Crop Portfolio</p>
                          <p className="text-xs text-gray-500">{analytics.topCrops?.length || 0} crops tracked</p>
                        </div>
                      </div>
                      <Badge className={(analytics.topCrops?.length || 0) > 0 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                        {(analytics.topCrops?.length || 0) > 0 ? "75%" : "0%"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        {(analytics.imageUploads || 0) > 0 ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                        )}
                        <div>
                          <p className="text-sm font-medium">Image Diagnostics</p>
                          <p className="text-xs text-gray-500">{analytics.imageUploads || 0} images uploaded</p>
                        </div>
                      </div>
                      <Badge className={(analytics.imageUploads || 0) > 0 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                        {Math.min((analytics.imageUploads || 0) * 10, 100)}%
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        {(analytics.voiceInteractions || 0) > 0 ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                        )}
                        <div>
                          <p className="text-sm font-medium">Voice Interactions</p>
                          <p className="text-xs text-gray-500">{analytics.voiceInteractions || 0} voice sessions</p>
                        </div>
                      </div>
                      <Badge className={(analytics.voiceInteractions || 0) > 0 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                        {Math.min((analytics.voiceInteractions || 0) * 20, 100)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Crop Portfolio */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    Your Crop Portfolio
                  </CardTitle>
                  <CardDescription>
                    Crops tracked in your Farm Graph
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.topCrops && analytics.topCrops.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {analytics.topCrops.map((crop: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                                  <Leaf className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-green-900">{crop}</p>
                                  <p className="text-xs text-green-700">Primary Crop #{index + 1}</p>
                                </div>
                                <Badge className="bg-green-100 text-green-700 border-0">
                                  <Activity className="h-3 w-3 mr-1" />
                                  Active
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 font-medium">No crops added yet</p>
                      <p className="text-xs text-gray-500 mt-1">Add crops to your profile to get started</p>
                      <Button className="mt-4" size="sm">
                        Add Crops
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-4">
              {/* Activity Timeline Chart */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartLine className="h-5 w-5 text-gray-700" />
                    Activity Timeline (Last 30 Days)
                  </CardTitle>
                  <CardDescription>
                    Your daily interaction patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="interactionsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="queriesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        interval={4}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: "8px", 
                          border: "2px solid #3b82f6",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="interactions"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#interactionsGradient)"
                        name="Total Interactions"
                      />
                      <Area
                        type="monotone"
                        dataKey="queries"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#queriesGradient)"
                        name="AI Queries"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Event Type Distribution */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-gray-700" />
                      Event Type Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPie>
                        <Pie
                          data={eventTypes}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {eventTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {eventTypes.map((type, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            className="h-3 w-3 rounded-full" 
                            style={{ backgroundColor: type.color }}
                          />
                          <span className="text-xs text-gray-600">{type.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      Engagement Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={engagementData.slice(-8)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="engagement" fill="#10b981" radius={[8, 8, 0, 0]} name="Engagement %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Events */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Recent Activity Feed
                  </CardTitle>
                  <CardDescription>
                    Latest {Math.min((farmGraph?.events || []).length, 15)} interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {farmGraph?.events && farmGraph.events.length > 0 ? (
                    <div className="space-y-2">
                      {farmGraph.events.slice(-15).reverse().map((event: any, index: number) => {
                        const EventIcon = getEventIcon(event.eventType);
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.01, x: 5 }}
                            className="cursor-pointer"
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border-2 border-gray-100 hover:border-green-300 transition-colors">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <EventIcon className="h-4 w-4 text-gray-700" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium capitalize">
                                  {event.eventType.replace(/_/g, " ")}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {new Date(event.timestamp).toLocaleString()}
                                </p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 font-medium">No activity yet</p>
                      <p className="text-xs text-gray-500 mt-1">Start interacting with KILIMO to build your profile</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Behavior Tab */}
            <TabsContent value="behavior" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Peak Activity Time */}
                <Card className="border-2 bg-gradient-to-br from-orange-50 to-amber-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-orange-100 rounded-xl">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Peak Time</p>
                        <p className="text-xl font-bold text-orange-900">6-9 AM</p>
                      </div>
                    </div>
                    <p className="text-xs text-orange-700">
                      You're most active in the morning
                    </p>
                  </CardContent>
                </Card>

                {/* Favorite Feature */}
                <Card className="border-2 bg-gradient-to-br from-blue-50 to-cyan-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-orange-100 rounded-xl">
                        <Heart className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Most Used</p>
                        <p className="text-xl font-bold text-gray-900">Market</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700">
                      45% of your interactions
                    </p>
                  </CardContent>
                </Card>

                {/* Data Contribution Rank */}
                <Card className="border-2 bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-orange-100 rounded-xl">
                        <Award className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Contributor</p>
                        <p className="text-xl font-bold text-gray-900">Top 25%</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700">
                      Among KILIMO farmers
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Usage Patterns */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Usage Patterns & Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-green-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-900 mb-1">Consistent User</h4>
                        <p className="text-sm text-green-700">
                          You check the app {Math.floor(Math.random() * 3) + 3} times per day on average
                        </p>
                        <div className="mt-2">
                          <Progress value={85} className="h-2" />
                          <p className="text-xs text-green-600 mt-1">85% consistency score</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-green-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Power User Features</h4>
                        <p className="text-sm text-gray-700">
                          Advanced features: Image diagnostics, Voice AI, Market analytics
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge className="bg-green-100 text-green-700 text-xs">AI Chat</Badge>
                          <Badge className="bg-green-100 text-green-700 text-xs">Image Upload</Badge>
                          <Badge className="bg-green-100 text-green-700 text-xs">Voice</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-2 border-orange-200">
                    <div className="flex items-start gap-3">
                      <LineChart className="h-5 w-5 text-orange-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Growth Trajectory</h4>
                        <p className="text-sm text-gray-700">
                          Your engagement has increased 45% over the last month
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <TrendingUp className="h-4 w-4 text-orange-600" />
                          <span className="text-xs text-orange-600 font-semibold">+45% growth</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="insights" className="space-y-4">
              <Card className="border-2 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-green-600" />
                    AI-Powered Behavioral Insights
                  </CardTitle>
                  <CardDescription>
                    Machine learning patterns detected from your Farm Graph
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white rounded-lg border-2 border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Sparkles className="h-5 w-5 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Smart Recommendation Engine</h4>
                        <p className="text-sm text-gray-700">
                          Based on your behavior, we recommend checking market prices for {analytics.topCrops?.[0] || "your crops"} every Tuesday and Friday when prices peak.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 bg-white rounded-lg border-2 border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Network className="h-5 w-5 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Similar Farmer Pattern</h4>
                        <p className="text-sm text-gray-700">
                          Farmers with similar profiles to you achieve 30% better yields by using the Image Diagnostic feature weekly.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 bg-white rounded-lg border-2 border-green-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Predictive Insight</h4>
                        <p className="text-sm text-gray-700">
                          Your usage pattern suggests you're preparing for planting season. Consider checking weather forecasts daily for the next 2 weeks.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 bg-white rounded-lg border-2 border-orange-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Fingerprint className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Unique Farmer Profile</h4>
                        <p className="text-sm text-gray-700">
                          Your Farm Graph shows you're a data-driven farmer. This puts you in the top 15% for decision-making quality.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>

              {/* Export Section */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-gray-600" />
                    Export Your Farm Graph Data
                  </CardTitle>
                  <CardDescription>
                    Download your complete behavioral dataset
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Fingerprint className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-sm">Your data belongs to you</p>
                        <p className="text-xs text-gray-600">Download anytime, use anywhere</p>
                      </div>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <Button variant="outline" className="w-full gap-2" onClick={handleExport}>
                        <Download className="h-4 w-4" />
                        Export JSON
                      </Button>
                      <Button variant="outline" className="w-full gap-2" onClick={handleExportCSV}>
                        <Download className="h-4 w-4" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Value Tab */}
            <TabsContent value="value" className="space-y-4">
              <Card className="border-2 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-yellow-600" />
                    Your Data is KILIMO's Competitive Moat
                  </CardTitle>
                  <CardDescription>
                    Understanding why your Farm Graph creates defensible value
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-white rounded-lg border-2 border-yellow-200">
                      <Lock className="h-8 w-8 text-yellow-600 mb-3" />
                      <h4 className="font-semibold mb-2">Proprietary Dataset</h4>
                      <p className="text-sm text-gray-700">
                        Your unique farm data cannot be replicated by competitors
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border-2 border-orange-200">
                      <Network className="h-8 w-8 text-orange-600 mb-3" />
                      <h4 className="font-semibold mb-2">Network Effects</h4>
                      <p className="text-sm text-gray-700">
                        More farmers = Better AI for everyone
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border-2 border-red-200">
                      <TrendingUp className="h-8 w-8 text-red-600 mb-3" />
                      <h4 className="font-semibold mb-2">Growing Value</h4>
                      <p className="text-sm text-gray-700">
                        Your data becomes more valuable over time
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Value Metrics */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-gray-700" />
                    Data Value by Category
                  </CardTitle>
                  <CardDescription>
                    Contribution to KILIMO's data intelligence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dataValueMetrics} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} width={120} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: "8px", 
                          border: "2px solid #3b82f6",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]} name="Value Score">
                        {dataValueMetrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Why This Matters */}
              <Card className="border-2 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-green-600" />
                    Why Your Farm Graph Matters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <Database className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Unique & Irreplaceable</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Your behavioral patterns, crop choices, and farming decisions create a one-of-a-kind dataset that no competitor can access or duplicate.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <Brain className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Powers Better AI</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Every interaction trains Sankofa AI to understand Tanzanian farming better, making recommendations more accurate for you and other farmers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <Users className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Collective Intelligence</p>
                      <p className="text-xs text-gray-600 mt-1">
                        As KILIMO grows, your data contributes to a collective intelligence that helps all farmers make better decisions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <Lock className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Creates Switching Costs</p>
                      <p className="text-xs text-gray-600 mt-1">
                        The more you use KILIMO, the harder it becomes to switch to another platform because they don't have your historical data and insights.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Event Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Event Type</p>
                  <p className="font-medium capitalize">{selectedEvent.eventType.replace(/_/g, " ")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timestamp</p>
                  <p className="font-medium">{new Date(selectedEvent.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Event ID</p>
                  <p className="font-mono text-xs text-gray-500">{selectedEvent.id}</p>
                </div>
              </div>
              <Button className="w-full mt-6" onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}