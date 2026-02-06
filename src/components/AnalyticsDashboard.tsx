import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  Target,
  DollarSign,
  Leaf,
  Droplet,
  Package,
  Users,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Zap,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Minimize2,
  Maximize2
} from "lucide-react";

interface AnalyticsDashboardProps {
  userId: string;
}

export function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState("month");
  const [isExpanded, setIsExpanded] = useState(false);

  const farmMetrics = {
    totalRevenue: 12500000,
    revenueGrowth: 15.3,
    totalExpenses: 5200000,
    expenseChange: -8.2,
    netProfit: 7300000,
    profitMargin: 58.4,
    activeCrops: 8,
    totalYield: 28.5,
    yieldGrowth: 12.8,
    waterUsage: 12500,
    waterEfficiency: 87,
    laborCost: 1200000,
    inputCost: 2800000,
    farmHealth: 92,
  };

  const cropPerformance = [
    { crop: "Maize", yield: 8.2, revenue: 4200000, acres: 3.5, health: 95, trend: "up" },
    { crop: "Tomatoes", yield: 12.5, revenue: 3800000, acres: 1.2, health: 88, trend: "up" },
    { crop: "Beans", yield: 3.8, revenue: 2100000, acres: 2.0, health: 92, trend: "stable" },
    { crop: "Onions", yield: 5.5, revenue: 1600000, acres: 0.8, health: 85, trend: "down" },
    { crop: "Rice", yield: 4.2, revenue: 800000, acres: 1.0, health: 78, trend: "up" },
  ];

  const monthlyTrend = [
    { month: "Jan", revenue: 2100000, expenses: 950000, profit: 1150000 },
    { month: "Feb", revenue: 1850000, expenses: 880000, profit: 970000 },
    { month: "Mar", revenue: 2400000, expenses: 1020000, profit: 1380000 },
    { month: "Apr", revenue: 2650000, expenses: 1100000, profit: 1550000 },
    { month: "May", revenue: 2200000, expenses: 920000, profit: 1280000 },
    { month: "Jun", revenue: 3300000, expenses: 1330000, profit: 1970000 },
  ];

  const resourceUtilization = [
    { resource: "Water", used: 12500, total: 15000, efficiency: 87, icon: Droplet, color: "blue" },
    { resource: "Labor Hours", used: 850, total: 1000, efficiency: 85, icon: Users, color: "purple" },
    { resource: "Land", used: 8.5, total: 10, efficiency: 85, icon: MapPin, color: "green" },
    { resource: "Equipment", used: 720, total: 800, efficiency: 90, icon: Package, color: "orange" },
  ];

  const alerts = [
    { id: 1, type: "success", message: "Maize yield exceeded target by 15%", time: "2 hours ago" },
    { id: 2, type: "warning", message: "Water usage in Section B is 20% above average", time: "5 hours ago" },
    { id: 3, type: "info", message: "Tomato harvest scheduled for next week", time: "1 day ago" },
  ];

  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-green-600 bg-green-100";
    if (health >= 75) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-3xl p-6 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-black">Farm Analytics</h1>
              </div>
              <p className="text-white/90 text-sm mb-3">
                Comprehensive insights into your farm performance
              </p>
              <div className="flex items-center gap-3">
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                  Farm Health: {farmMetrics.farmHealth}%
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{farmMetrics.revenueGrowth}% Growth
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["week", "month", "quarter", "year", "all"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize whitespace-nowrap
              ${timeRange === range
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-200 hover:border-purple-300"
              }
            `}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <Card className="hover:shadow-lg transition-all border-2 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-700 gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +{farmMetrics.revenueGrowth}%
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-black text-gray-900">
              {(farmMetrics.totalRevenue / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-500 mt-1">TZS this {timeRange}</p>
          </CardContent>
        </Card>

        {/* Profit Margin */}
        <Card className="hover:shadow-lg transition-all border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700">
                Excellent
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mb-1">Profit Margin</p>
            <p className="text-2xl font-black text-gray-900">
              {farmMetrics.profitMargin.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Above industry avg</p>
          </CardContent>
        </Card>

        {/* Yield Growth */}
        <Card className="hover:shadow-lg transition-all border-2 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Leaf className="h-5 w-5 text-orange-600" />
              </div>
              <Badge className="bg-orange-100 text-orange-700 gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +{farmMetrics.yieldGrowth}%
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mb-1">Total Yield</p>
            <p className="text-2xl font-black text-gray-900">
              {farmMetrics.totalYield} T
            </p>
            <p className="text-xs text-gray-500 mt-1">Across {farmMetrics.activeCrops} crops</p>
          </CardContent>
        </Card>

        {/* Farm Health */}
        <Card className="hover:shadow-lg transition-all border-2 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Healthy
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mb-1">Farm Health Score</p>
            <p className="text-2xl font-black text-gray-900">
              {farmMetrics.farmHealth}%
            </p>
            <Progress value={farmMetrics.farmHealth} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Crop Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Crop Performance Analysis
            </CardTitle>
            <Button variant="outline" size="sm">
              <LineChart className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
          <CardDescription>
            Compare yield, revenue, and health metrics across all crops
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cropPerformance.map((crop, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg font-bold text-gray-900">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{crop.crop}</h4>
                      <p className="text-xs text-gray-600">{crop.acres} acres planted</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(crop.trend)}
                    <Badge className={getHealthColor(crop.health)}>
                      Health: {crop.health}%
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Yield</p>
                    <p className="text-lg font-bold text-gray-900">{crop.yield} T</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Revenue</p>
                    <p className="text-lg font-bold text-green-600">
                      {(crop.revenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Per Acre</p>
                    <p className="text-lg font-bold text-blue-600">
                      {(crop.yield / crop.acres).toFixed(1)} T
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Trend & Resource Utilization */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Revenue & Profit Trend
            </CardTitle>
            <CardDescription>Last 6 months performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyTrend.map((month, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-900">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-green-600 font-bold">
                        +{(month.revenue / 1000000).toFixed(1)}M
                      </span>
                      <span className="text-blue-600 font-bold">
                        {(month.profit / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-green-100 rounded-full h-2">
                      <div
                        className="bg-green-600 rounded-full h-2"
                        style={{ width: `${(month.revenue / 3500000) * 100}%` }}
                      />
                    </div>
                    <div className="flex-1 bg-blue-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 rounded-full h-2"
                        style={{ width: `${(month.profit / 2000000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resource Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              Resource Utilization
            </CardTitle>
            <CardDescription>Efficiency metrics for key resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resourceUtilization.map((resource, idx) => {
              const Icon = resource.icon;
              const colorMap: Record<string, string> = {
                blue: "bg-blue-500",
                purple: "bg-purple-500",
                green: "bg-green-500",
                orange: "bg-orange-500"
              };
              
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 text-${resource.color}-600`} />
                      <span className="text-sm font-semibold text-gray-900">
                        {resource.resource}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {resource.used} / {resource.total}
                      </p>
                      <p className="text-xs text-gray-600">{resource.efficiency}% efficient</p>
                    </div>
                  </div>
                  <Progress value={resource.efficiency} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Insights */}
      <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Recent Alerts & Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => {
              const iconMap = {
                success: <CheckCircle className="h-5 w-5 text-green-600" />,
                warning: <AlertCircle className="h-5 w-5 text-yellow-600" />,
                info: <Activity className="h-5 w-5 text-blue-600" />
              };
              const bgMap = {
                success: "bg-green-50 border-green-200",
                warning: "bg-yellow-50 border-yellow-200",
                info: "bg-blue-50 border-blue-200"
              };
              
              return (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 ${bgMap[alert.type as keyof typeof bgMap]}`}
                >
                  {iconMap[alert.type as keyof typeof iconMap]}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {alert.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
