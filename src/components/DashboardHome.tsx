import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { AutoAIInsights } from "./AutoAIInsights";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Droplet,
  CloudRain,
  Sun,
  Wind,
  Thermometer,
  Brain,
  ArrowRight,
  Calendar,
  MapPin,
  Leaf,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Zap,
  Target,
  Activity,
  Settings
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface DashboardHomeProps {
  user: {
    id: string;
    name: string;
    region: string;
    farmSize: string;
    crops?: string[];
    tier?: string;
    role?: string;
  };
  language: "en" | "sw";
  onNavigate?: (tab: string) => void;
}

export function DashboardHome({ user, language, onNavigate }: DashboardHomeProps) {
  // Safe translation access with fallbacks
  const text = {
    welcomeBack: language === "en" ? "Welcome back" : "Karibu tena",
    overview: language === "en" ? "Here's your farm overview" : "Hapa kuna muhtasari wa shamba lako",
    activeCrops: language === "en" ? "Active Crops" : "Mazao Yanayoendelea",
    pendingTasks: language === "en" ? "Pending Tasks" : "Kazi Zinazosubiri",
    revenue: language === "en" ? "Revenue" : "Mapato",
    soilHealth: language === "en" ? "Soil Health" : "Afya ya Udongo",
    weatherToday: language === "en" ? "Weather Today" : "Hali ya Hewa Leo",
    live: language === "en" ? "Live" : "Moja kwa Moja",
    good: language === "en" ? "Good" : "Nzuri",
    temperature: language === "en" ? "Temperature" : "Joto",
    humidity: language === "en" ? "Humidity" : "Unyevu",
    rainfall: language === "en" ? "Rainfall" : "Mvua",
    wind: language === "en" ? "Wind" : "Upepo",
    todaysTasks: language === "en" ? "Today's Tasks" : "Kazi za Leo",
    viewAll: language === "en" ? "View All" : "Tazama Zote",
    addNewTask: language === "en" ? "Add New Task" : "Ongeza Kazi Mpya",
    marketPriceTrends: language === "en" ? "Market Price Trends" : "Mwenendo wa Bei za Soko",
    liveFromMarkets: language === "en" ? "Live prices from" : "Bei za sasa kutoka",
    markets: language === "en" ? "markets" : "masoko",
    viewAllMarkets: language === "en" ? "View All Markets" : "Tazama Masoko Yote",
    perTonne: language === "en" ? "Per tonne" : "Kwa tani",
    aiWorkflows: language === "en" ? "AI Workflows" : "Mchakato wa AI",
    accessAIWorkflows: language === "en" ? "Access AI-powered workflows" : "Pata mchakato unaotegemea AI",
    yieldForecast: language === "en" ? "Yield Forecast" : "Utabiri wa Mavuno",
    aiPredictions: language === "en" ? "AI predictions" : "Utabiri wa AI",
    farmHealth: language === "en" ? "Farm Health" : "Afya ya Shamba",
    liveMonitoring: language === "en" ? "Live monitoring" : "Ufuatiliaji wa moja kwa moja",
    systemCheck: language === "en" ? "System Check" : "Ukaguzi wa Mfumo",
    testAllFeatures: language === "en" ? "Test all features" : "Jaribu vipengele vyote",
    seasonRevenueProgress: language === "en" ? "Season Revenue Progress" : "Maendeleo ya Mapato ya Msimu",
    target: language === "en" ? "Target" : "Lengo",
    currentProgress: language === "en" ? "Current Progress" : "Maendeleo ya Sasa",
    projected: language === "en" ? "Projected" : "Inatarajiwa",
    onTrack: language === "en" ? "On Track" : "Kwenye Njia",
    daysLeft: language === "en" ? "Days Left" : "Siku Zilizobaki",
    goodPlantingConditions: language === "en" ? "Good planting conditions" : "Hali nzuri ya kupanda",
    soilMoistureOptimal: language === "en" ? "Soil moisture optimal for transplanting" : "Unyevu wa udongo ni mzuri kwa kupanda",
    high: language === "en" ? "high" : "juu",
    medium: language === "en" ? "medium" : "wastani",
    openingTaskManagement: language === "en" ? "Opening Task Management..." : "Inafungua Usimamizi wa Kazi...",
    openingAIWorkflows: language === "en" ? "Opening AI Workflows..." : "Inafungua Mchakato wa AI...",
    openingPredictiveModels: language === "en" ? "Opening Predictive Models..." : "Inafungua Mifano ya Utabiri...",
    openingFarmAnalytics: language === "en" ? "Opening Farm Analytics..." : "Inafungua Uchambuzi wa Shamba...",
    runningSystemDiagnostics: language === "en" ? "Running system diagnostics..." : "Inafanya uchunguzi wa mfumo...",
    openingMarketPrices: language === "en" ? "Opening Market Prices..." : "Inafungua Bei za Soko...",
  };

  const [weather, setWeather] = useState({
    temp: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    rainfall: 12,
    wind: 15
  });

  const [todayTasks, setTodayTasks] = useState([
    { id: 1, title: "Apply fertilizer to maize field", priority: "high", completed: false },
    { id: 2, title: "Check irrigation system", priority: "medium", completed: true },
    { id: 3, title: "Scout for pests in section A", priority: "high", completed: false },
  ]);

  const [marketTrends, setMarketTrends] = useState([
    { crop: "Maize", price: 850000, change: 5.2, trend: "up" },
    { crop: "Rice", price: 1200000, change: -2.1, trend: "down" },
    { crop: "Beans", price: 950000, change: 3.8, trend: "up" },
  ]);

  const [farmStats, setFarmStats] = useState({
    activeCrops: 3,
    pendingTasks: 5,
    healthScore: 87,
    expectedYield: "12.5 tons",
    revenueTarget: 15000000,
    currentProgress: 65
  });

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white">
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl">
                  <Brain className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black">{text.welcomeBack}, {user.name}!</h1>
                  <p className="text-white/90 text-xs md:text-sm">{text.overview}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="h-4 w-4" />
                <p className="text-[10px] md:text-xs text-white/80">{text.activeCrops}</p>
              </div>
              <p className="text-xl md:text-2xl font-bold">5</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4" />
                <p className="text-[10px] md:text-xs text-white/80">{text.pendingTasks}</p>
              </div>
              <p className="text-xl md:text-2xl font-bold">12</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4" />
                <p className="text-[10px] md:text-xs text-white/80">{text.revenue}</p>
              </div>
              <p className="text-xl md:text-2xl font-bold">8.2M</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Droplet className="h-4 w-4" />
                <p className="text-[10px] md:text-xs text-white/80">{text.soilHealth}</p>
              </div>
              <p className="text-xl md:text-2xl font-bold">{text.good}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auto AI Insights Widget */}
      <AutoAIInsights 
        userId={user.id}
        language="en"
        autoLoad={true}
        refreshInterval={300000}
      />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weather Card */}
        <Card className="lg:col-span-1 hover:shadow-lg transition-shadow border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-blue-600" />
                {text.weatherToday}
              </CardTitle>
              <Badge className="bg-blue-100 text-blue-700">{text.live}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="inline-flex p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl mb-3">
                <Sun className="h-12 w-12 text-blue-600" />
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-1">{weather.temp}°C</p>
              <p className="text-sm text-gray-600">{weather.condition}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <Droplet className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">{text.humidity}</p>
                <p className="text-sm font-bold text-gray-900">{weather.humidity}%</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <CloudRain className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">{text.rainfall}</p>
                <p className="text-sm font-bold text-gray-900">{weather.rainfall}mm</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <Wind className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">{text.wind}</p>
                <p className="text-sm font-bold text-gray-900">{weather.wind}km/h</p>
              </div>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-green-900">{text.goodPlantingConditions}</p>
                  <p className="text-xs text-green-700 mt-1">{text.soilMoistureOptimal}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Tasks */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow border-orange-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                {text.todaysTasks}
              </CardTitle>
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1" onClick={() => {
                if (onNavigate) {
                  toast.success(text.openingTaskManagement);
                  onNavigate("tasks");
                }
              }}>
                {text.viewAll}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className={`
                  flex items-center gap-3 p-4 rounded-xl border-2 transition-all
                  ${task.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200 hover:border-orange-300'
                  }
                `}
              >
                <div className={`
                  flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${task.completed 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-300'
                  }
                `}>
                  {task.completed && <CheckCircle className="h-3 w-3 text-white" />}
                </div>
                
                <div className="flex-1">
                  <p className={`
                    text-sm font-medium
                    ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}
                  `}>
                    {task.title}
                  </p>
                </div>

                <Badge className={
                  task.priority === "high" 
                    ? "bg-red-100 text-red-700" 
                    : "bg-yellow-100 text-yellow-700"
                }>
                  {task.priority}
                </Badge>
              </div>
            ))}

            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-orange-400 hover:text-orange-600 transition-colors">
              + {text.addNewTask}
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Market Trends */}
      <Card className="hover:shadow-lg transition-shadow border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              {text.marketPriceTrends}
            </CardTitle>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1" onClick={() => {
              if (onNavigate) {
                toast.success(text.openingMarketPrices);
                onNavigate("market");
              }
            }}>
              {text.viewAllMarkets}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <CardDescription>{text.liveFromMarkets} {user.region} {text.markets}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {marketTrends.map((market, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Package className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{market.crop}</p>
                    <p className="text-sm text-gray-600">{text.perTonne}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">
                    TZS {(market.price / 1000).toFixed(0)}k
                  </p>
                  <div className={`
                    flex items-center gap-1 text-sm font-medium
                    ${market.trend === "up" ? "text-green-600" : "text-red-600"}
                  `}>
                    {market.trend === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {Math.abs(market.change)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-all cursor-pointer group border-green-200" onClick={() => {
          if (onNavigate) {
            toast.success(text.openingAIWorkflows);
            onNavigate("workflows");
          }
        }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{text.aiWorkflows}</p>
                <p className="text-xs text-gray-600">{text.accessAIWorkflows}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group border-green-200" onClick={() => {
          if (onNavigate) {
            toast.success(text.openingPredictiveModels);
            onNavigate("predictions");
          }
        }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{text.yieldForecast}</p>
                <p className="text-xs text-gray-600">{text.aiPredictions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group border-green-200" onClick={() => {
          if (onNavigate) {
            toast.success(text.openingFarmAnalytics);
            onNavigate("analytics");
          }
        }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{text.farmHealth}</p>
                <p className="text-xs text-gray-600">{text.liveMonitoring}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer group border-orange-200" onClick={() => {
          if (onNavigate) {
            toast.info(text.runningSystemDiagnostics);
            onNavigate("system-diagnostics");
          }
        }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-xl group-hover:scale-110 transition-transform">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{text.systemCheck}</p>
                <p className="text-xs text-gray-600">{text.testAllFeatures}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Progress */}
      <Card className="hover:shadow-lg transition-shadow border-emerald-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            {text.seasonRevenueProgress}
          </CardTitle>
          <CardDescription>{text.target}: TZS {(farmStats.revenueTarget / 1000000).toFixed(1)}M</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{text.currentProgress}</span>
              <span className="font-bold text-gray-900">{farmStats.currentProgress}%</span>
            </div>
            <Progress value={farmStats.currentProgress} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-gray-600 mb-1">{text.projected}</p>
              <p className="text-lg font-bold text-blue-600">
                TZS {((farmStats.revenueTarget * farmStats.currentProgress / 100) / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-xs text-gray-600 mb-1">{text.onTrack}</p>
              <p className="text-lg font-bold text-green-600">
                <CheckCircle className="h-5 w-5 mx-auto" />
              </p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-xl">
              <p className="text-xs text-gray-600 mb-1">{text.daysLeft}</p>
              <p className="text-lg font-bold text-orange-600">89</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}