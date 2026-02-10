import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Thermometer, Calendar, MapPin, TrendingUp, AlertTriangle, Umbrella, Clock, Zap, CheckCircle, Info, Sunrise, Sunset, ArrowUp, ArrowDown, Timer, Shield, Activity, ThermometerSun, Gauge, CheckCircle2, Plus, Leaf, Sprout, Navigation, ArrowRight, Smartphone, ExternalLink, RefreshCw, Brain, Lightbulb, Bell, BellOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { toast } from "sonner@2.0.3";
import { LineChart as RechartsLine, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { RealTimeWeatherHero } from "./RealTimeWeatherHero";
import { AIFarmingInsights } from "./AIFarmingInsights";
import * as weatherService from "../utils/weatherService";

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  rainfall: number;
  rainfallProb: number;
  windSpeed: number;
  lastUpdated: string;
  location: string;
}

interface AIInsight {
  id: string;
  message_en: string;
  message_sw: string;
  priority: "high" | "medium" | "low";
  category: "planting" | "irrigation" | "pest" | "harvest" | "general";
}

export function WeatherCard({ userId, region, language = "en" }: { userId?: string; region?: string; language?: "en" | "sw" }) {
  const [activeView, setActiveView] = useState<"overview" | "hourly" | "weekly">("overview");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Detect user device for native weather app
  const detectDevice = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/android/i.test(userAgent)) return "android";
    if (/iPad|iPhone|iPod/.test(userAgent)) return "ios";
    return "unknown";
  };

  const deviceOS = detectDevice();

  // Open native weather app
  const openNativeWeatherApp = () => {
    const lat = -6.7924; // Dar es Salaam coords as fallback
    const lon = 39.2083;
    
    if (deviceOS === "android") {
      // Try Google Weather first, fallback to generic geo intent
      window.location.href = `geo:${lat},${lon}?q=weather`;
      setTimeout(() => {
        window.location.href = `https://www.google.com/search?q=weather+${region || 'Tanzania'}`;
      }, 1000);
    } else if (deviceOS === "ios") {
      // iOS Weather app deep link
      window.location.href = `weather://`;
      setTimeout(() => {
        window.location.href = `https://weather.com/weather/today/l/${lat},${lon}`;
      }, 1000);
    } else {
      // Fallback to web
      window.open(`https://www.google.com/search?q=weather+${region || 'Tanzania'}`, '_blank');
    }
    
    toast.success(
      language === "sw" ? "Fungua app ya hali ya hewa..." : "Opening weather app...",
      { duration: 2000 }
    );
  };

  // Get current Tanzanian season
  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 5) return { name: "Masika", name_sw: "Masika", desc: "Long rains" };
    if (month >= 9 && month <= 11) return { name: "Vuli", name_sw: "Vuli", desc: "Short rains" };
    return { name: "Kiangazi", name_sw: "Kiangazi", desc: "Dry season" };
  };

  const currentSeason = getCurrentSeason();

  // ✅ FIX #2: CHECK WEATHER ALERTS AND CREATE PROTECTIVE TASKS
  const checkWeatherAlerts = async (weather: WeatherData) => {
    if (!userId) return;
    
    const API_BASE = `https://${(window as any).projectId || 'placeholder'}.supabase.co/functions/v1/make-server-ce1844e7`;
    const publicAnonKey = (window as any).publicAnonKey || '';
    
    const alerts = [];
    
    // Check for heavy rain (>50mm)
    if (weather.rainfall && weather.rainfall > 50) {
      alerts.push({
        type: "heavy_rain",
        severity: "high",
        message: language === "sw"
          ? `⚠️ Mvua kubwa inatarajiwa: ${Math.round(weather.rainfall)}mm`
          : `⚠️ Heavy rain expected: ${Math.round(weather.rainfall)}mm`,
        action: language === "sw"
          ? "Linda mazao yako na tia mifereji ya maji"
          : "Protect your crops and create drainage"
      });
    }
    
    // Check for extreme heat (>35°C)
    if (weather.temp && weather.temp > 35) {
      alerts.push({
        type: "extreme_heat",
        severity: "medium",
        message: language === "sw"
          ? `🌡️ Joto kali: ${Math.round(weather.temp)}°C`
          : `🌡️ Extreme heat: ${Math.round(weather.temp)}°C`,
        action: language === "sw"
          ? "Nyunyizia maji mazao mara kwa mara"
          : "Water crops frequently"
      });
    }
    
    // Check for strong wind
    if (weather.windSpeed && weather.windSpeed > 40) {
      alerts.push({
        type: "strong_wind",
        severity: "high",
        message: language === "sw"
          ? `💨 Upepo mkali: ${Math.round(weather.windSpeed)} km/h`
          : `💨 Strong wind: ${Math.round(weather.windSpeed)} km/h`,
        action: language === "sw"
          ? "Tegea mazao yaliyorefuka"
          : "Stake tall crops"
      });
    }
    
    // Process each alert
    for (const alert of alerts) {
      try {
        // Create alert record
        await fetch(`${API_BASE}/alerts/create`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            type: alert.type,
            severity: alert.severity,
            message: alert.message,
            action: alert.action
          })
        });
        
        // Create protective task
        await fetch(`${API_BASE}/tasks/create`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            title: alert.action,
            description: alert.message,
            priority: alert.severity === "high" ? "urgent" : "normal",
            dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours
            category: "weather_response",
            source: "weather_alert"
          })
        });
        
        // Send SMS for high severity
        if (alert.severity === "high") {
          await fetch(`${API_BASE}/notifications/send-sms`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${publicAnonKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              message: `${alert.message}\n${alert.action}`
            })
          });
        }
        
        // Show toast notification
        toast.warning(alert.message, {
          description: alert.action,
          duration: 8000
        });
        
      } catch (error) {
        console.error("Failed to process weather alert:", error);
      }
    }
  };

  // Fetch real-time weather (simulated for now - integrate with OpenWeatherMap later)
  const fetchWeatherData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual OpenWeatherMap API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: WeatherData = {
        temp: 25 + Math.random() * 8,
        condition: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
        humidity: 60 + Math.random() * 30,
        rainfall: Math.random() * 20,
        rainfallProb: Math.floor(Math.random() * 100),
        windSpeed: 10 + Math.random() * 15,
        lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        location: region || "Dar es Salaam"
      };
      
      setWeatherData(mockData);
      setLastRefresh(new Date());
      
      // Generate AI insights based on weather
      generateAIInsights(mockData);
      
      // ✅ FIX #2: CHECK FOR WEATHER ALERTS AND CREATE TASKS
      if (userId) {
        await checkWeatherAlerts(mockData);
      }
      
      toast.success(
        language === "sw" ? "Hali ya hewa imesasishwa" : "Weather updated",
        { duration: 2000 }
      );
    } catch (error) {
      toast.error(
        language === "sw" ? "Imeshindwa kupakia hali ya hewa" : "Failed to load weather",
        { duration: 3000 }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Generate AI farming insights based on weather
  const generateAIInsights = (weather: WeatherData) => {
    const insights: AIInsight[] = [];
    
    // Rain-based insights
    if (weather.rainfallProb > 70) {
      insights.push({
        id: "heavy-rain",
        message_en: "Heavy rainfall expected. Avoid spraying pesticides. Good time to check drainage systems.",
        message_sw: "Mvua nyingi inatarajiwa. Epuka kunyunyizia dawa za wadudu. Angalia mifereji ya maji.",
        priority: "high",
        category: "irrigation"
      });
    } else if (weather.rainfallProb < 20 && weather.temp > 30) {
      insights.push({
        id: "dry-hot",
        message_en: "Hot and dry conditions. Increase irrigation frequency. Water crops early morning or evening.",
        message_sw: "Joto kali na ukame. Ongeza mwagiliaji. Nyunyizia asubuhi na mapema au jioni.",
        priority: "high",
        category: "irrigation"
      });
    }
    
    // Temperature-based insights
    if (weather.temp > 28 && weather.temp < 32) {
      insights.push({
        id: "optimal-planting",
        message_en: "Perfect temperature for planting maize and beans. Tomorrow morning is ideal.",
        message_sw: "Joto nzuri kwa kupanda mahindi na maharage. Kesho asubuhi ni wakati mzuri.",
        priority: "medium",
        category: "planting"
      });
    }
    
    // Humidity-based insights
    if (weather.humidity > 80) {
      insights.push({
        id: "high-humidity",
        message_en: "High humidity increases fungal disease risk. Monitor crops closely and apply preventive treatments.",
        message_sw: "Unyevu wa hewa unaongezeka hatari ya magonjwa ya kuvu. Angalia mazao na tumia dawa za kuzuia.",
        priority: "medium",
        category: "pest"
      });
    }
    
    // Seasonal insights
    if (currentSeason.name === "Masika") {
      insights.push({
        id: "masika-planting",
        message_en: "Masika season - optimal for maize, sorghum, and rice planting.",
        message_sw: "Msimu wa Masika - wakati mzuri wa kupanda mahindi, mtama na mchele.",
        priority: "low",
        category: "planting"
      });
    }
    
    setAIInsights(insights);
  };

  // Initial data fetch
  useEffect(() => {
    fetchWeatherData();
  }, [region]);

  // Generate 14-day forecast data (extended from 7-day)
  const weekForecast = Array.from({ length: 14 }, (_, i) => ({
    day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : new Date(Date.now() + i * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
    date: new Date(Date.now() + i * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    temp: Math.sin(i / 3.5) * 6 - 2,
    tempMax: Math.sin(i / 3.5) * 6 + 3,
    tempMin: Math.sin(i / 3.5) * 6 - 7,
    humidity: Math.random() * 20 - 10,
    rainfall: Math.random() * (i < 7 ? 15 : 12), // Less certain for days 8-14
    rainfallProb: Math.floor(Math.random() * 100),
    condition: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Clear", "Thunderstorm"][Math.floor(Math.random() * 6)],
    windSpeed: 10 + Math.random() * 15,
    uvIndex: Math.floor(Math.random() * 11),
    confidence: i < 7 ? "high" : "medium" // Lower confidence for extended forecast
  }));

  // Generate hourly forecast
  const hourlyForecast = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    temp: Math.sin(i / 4) * 5,
    rainfall: Math.random() * 3,
    humidity: Math.random() * 10 - 5
  }));

  // Mock additional weather data
  const windSpeed = 12 + Math.random() * 8;
  const pressure = 1013 + Math.random() * 10 - 5;
  const visibility = 8 + Math.random() * 2;
  const uvIndex = Math.floor(Math.random() * 11);
  const dewPoint = 25 - ((100 - Math.random() * 50) / 5);

  // Weather alerts
  const alerts = [
    {
      id: "heavy-rain",
      type: "warning",
      title: "Heavy Rainfall Expected",
      message: "45mm of rain expected in next 48 hours. Delay irrigation activities.",
      icon: CloudRain,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200"
    },
    {
      id: "high-temp",
      type: "info",
      title: "High Temperature Alert",
      message: "Temperatures above 32°C. Increase watering frequency for crops.",
      icon: Thermometer,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200"
    },
    {
      id: "perfect-planting",
      type: "success",
      title: "Perfect Planting Conditions",
      message: "Optimal soil moisture and temperature for planting maize this week.",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200"
    }
  ];

  // Get weather condition icon
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
      case "clear":
        return Sun;
      case "partly cloudy":
        return Cloud;
      case "cloudy":
        return Cloud;
      case "rainy":
        return CloudRain;
      default:
        return Cloud;
    }
  };

  // Get UV Index severity
  const getUVSeverity = (index: number) => {
    if (index <= 2) return { text: "Low", color: "text-green-600", bg: "bg-green-50" };
    if (index <= 5) return { text: "Moderate", color: "text-yellow-600", bg: "bg-yellow-50" };
    if (index <= 7) return { text: "High", color: "text-orange-600", bg: "bg-orange-50" };
    if (index <= 10) return { text: "Very High", color: "text-red-600", bg: "bg-red-50" };
    return { text: "Extreme", color: "text-gray-600", bg: "bg-gray-50" };
  };

  const uvSeverity = getUVSeverity(uvIndex);

  // Get comfort level based on temp and humidity
  const getComfortLevel = () => {
    const heatIndex = 25 + (0.5 * (Math.random() * 50 / 100) * (25 - 14.5));
    if (heatIndex < 27) return { text: "Comfortable", color: "text-green-600", bg: "bg-green-50" };
    if (heatIndex < 32) return { text: "Caution", color: "text-yellow-600", bg: "bg-yellow-50" };
    if (heatIndex < 41) return { text: "Extreme Caution", color: "text-orange-600", bg: "bg-orange-50" };
    return { text: "Danger", color: "text-red-600", bg: "bg-red-50" };
  };

  const comfortLevel = getComfortLevel();

  // Get weather gradient based on condition
  const getWeatherGradient = () => {
    const condition = weekForecast[0].condition.toLowerCase();
    switch (condition) {
      case "sunny":
      case "clear":
        return "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500";
      case "partly cloudy":
        return "bg-gradient-to-br from-blue-500 via-cyan-600 to-teal-600";
      case "cloudy":
        return "bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600";
      case "rainy":
        return "bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600";
      default:
        return "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500";
    }
  };

  const handleHourlyView = () => {
    setActiveView("hourly");
    toast.success(language === "sw" ? "Onyesho la kila saa" : "Hourly Forecast", {
      description: language === "sw" ? "Ukurasa wa saa 24 zinazokuja" : "Next 24 hours forecast loaded",
      duration: 2000,
    });
  };

  const handleWeeklyView = () => {
    setActiveView("weekly");
    toast.success(language === "sw" ? "Onyesho la wiki 7" : "7-Day Forecast", {
      description: language === "sw" ? "Utabiri wa wiki ijayo" : "Weekly forecast loaded",
      duration: 2000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Real-Time Weather Hero */}
      <RealTimeWeatherHero
        weatherData={weatherData}
        region={region}
        language={language}
        currentSeason={currentSeason}
        isLoading={isLoading}
        onRefresh={fetchWeatherData}
        onOpenNativeApp={openNativeWeatherApp}
      />

      {/* AI Farming Insights */}
      <AIFarmingInsights insights={aiInsights} language={language} />

      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 shadow-lg overflow-hidden relative">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.3)_0%,transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.3)_0%,transparent_50%)]" />
            </div>
            
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-3 mb-2">
                    <motion.div 
                      className="p-2.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-md"
                      animate={{ 
                        boxShadow: [
                          "0 4px 6px rgba(251,146,60,0.3)",
                          "0 8px 12px rgba(251,146,60,0.5)",
                          "0 4px 6px rgba(251,146,60,0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        {language === "sw" ? "Tahadhari za Hali ya Hewa" : "Weather Alerts & Recommendations"}
                      </h3>
                      <p className="text-sm text-orange-700 font-medium mt-0.5">
                        {language === "sw" ? "Taarifa muhimu kwa shughuli za kilimo" : "Critical updates for farming activities"}
                      </p>
                    </div>
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-md px-3 py-1">
                    <Bell className="h-3 w-3 mr-1.5" />
                    {alerts.length} {language === "sw" ? "Arifa" : "Active"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-orange-700 hover:bg-orange-100"
                    onClick={() => toast.success(language === "sw" ? "Tahadhari zimesasishwa" : "Alerts refreshed")}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <div className="grid gap-4 md:grid-cols-3">
                {alerts.map((alert, index) => {
                  const Icon = alert.icon;
                  const isActive = activeAlert === alert.id;
                  
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.15,
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                      }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`border-2 ${alert.border} ${alert.bg} cursor-pointer transition-all duration-300 hover:shadow-xl relative overflow-hidden ${
                          isActive ? "ring-2 ring-offset-2 ring-orange-400 shadow-2xl" : ""
                        }`}
                        onClick={() => setActiveAlert(isActive ? null : alert.id)}
                      >
                        {/* Severity indicator stripe */}
                        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                          alert.type === "warning" ? "bg-gradient-to-r from-orange-500 to-red-500" :
                          alert.type === "info" ? "bg-gradient-to-r from-blue-500 to-cyan-500" :
                          "bg-gradient-to-r from-green-500 to-emerald-500"
                        }`} />
                        
                        <CardContent className="p-5 pt-6">
                          <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <motion.div 
                                  className={`p-2.5 bg-white rounded-xl shadow-md ${alert.color} flex-shrink-0`}
                                  animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
                                  transition={{ duration: 0.5 }}
                                >
                                  <Icon className="h-6 w-6" />
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <h4 className={`font-bold text-base ${alert.color} leading-tight`}>
                                      {alert.title}
                                    </h4>
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs px-2 py-0.5 ${
                                        alert.type === "warning" ? "bg-orange-100 text-orange-700 border-orange-300" :
                                        alert.type === "info" ? "bg-gray-100 text-gray-700 border-gray-300" :
                                        "bg-green-100 text-green-700 border-green-300"
                                      }`}
                                    >
                                      {alert.type === "warning" ? (language === "sw" ? "Tahadhari" : "Warning") :
                                       alert.type === "info" ? (language === "sw" ? "Taarifa" : "Info") :
                                       (language === "sw" ? "Pendekezo" : "Tip")}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {alert.message}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Timestamp */}
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                              <Clock className="h-3.5 w-3.5 text-gray-500" />
                              <span className="text-xs text-gray-600">
                                {language === "sw" ? "Iliyochapishwa" : "Updated"}: {new Date().toLocaleTimeString(language === "sw" ? "sw-TZ" : "en-US", { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>

                            {/* Action Buttons */}
                            <AnimatePresence>
                              {isActive && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex items-center gap-2 pt-2"
                                >
                                  <Button
                                    size="sm"
                                    className={`flex-1 h-8 text-xs ${
                                      alert.type === "warning" ? "bg-orange-600 hover:bg-orange-700" :
                                      alert.type === "info" ? "bg-gray-600 hover:bg-gray-700" :
                                      "bg-green-600 hover:bg-green-700"
                                    } text-white shadow-md`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toast.success(
                                        language === "sw" ? "Maelezo zaidi..." : "View details...",
                                        { description: alert.message }
                                      );
                                    }}
                                  >
                                    <Info className="h-3 w-3 mr-1.5" />
                                    {language === "sw" ? "Maelezo" : "Details"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-3 text-xs border-gray-300 hover:bg-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveAlert(null);
                                      toast.success(language === "sw" ? "Arifa imefutwa" : "Alert dismissed");
                                    }}
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </Button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* View All Alerts Link */}
              <motion.div 
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  variant="ghost"
                  className="text-orange-700 hover:text-orange-800 hover:bg-orange-100 font-semibold"
                  onClick={() => toast.info(
                    language === "sw" ? "Tahadhari zote za hali ya hewa" : "All Weather Alerts",
                    { description: language === "sw" ? `Jumla ya tahadhari ${alerts.length}` : `${alerts.length} total alerts` }
                  )}
                >
                  {language === "sw" ? "Angalia Tahadhari Zote" : "View All Alerts"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Weather Dashboard */}
      <Card className="border-2 border-green-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Cloud className="h-5 w-5 text-gray-600" />
                </div>
                {language === "sw" ? "Dashibodi ya Hali ya Hewa" : "Weather Dashboard"} - {region || "Unknown Location"}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {language === "sw" ? "Taarifa za hali ya hewa na utabiri" : "Real-time weather data and forecasts"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="farming">Farming</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Current Conditions */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Today's Forecast */}
                <Card className="border-2 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Sun className="h-5 w-5 text-orange-600" />
                      </div>
                      Today's Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-4">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="inline-block"
                      >
                        <Sun className="h-24 w-24 text-orange-500 mx-auto" />
                      </motion.div>
                      <h3 className="text-3xl font-bold mt-4">25°C</h3>
                      <p className="text-gray-600 mt-2">Sunny</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Droplets className="h-5 w-5 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600">Humidity</p>
                          <p className="font-semibold text-sm">{(Math.random() * 30 + 60).toFixed(0)}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Wind className="h-5 w-5 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600">Wind</p>
                          <p className="font-semibold text-sm">{windSpeed.toFixed(1)} km/h</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Metrics */}
                <Card className="border-2 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Activity className="h-5 w-5 text-green-600" />
                      </div>
                      Weather Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2">
                        <ThermometerSun className="h-5 w-5 text-orange-600 flex-shrink-0" />
                        <span className="text-sm font-medium">UV Index</span>
                      </div>
                      <Badge className={`${uvSeverity.bg} ${uvSeverity.color} border-0`}>
                        {uvIndex} - {uvSeverity.text}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <Gauge className="h-5 w-5 text-gray-600 flex-shrink-0" />
                        <span className="text-sm font-medium">Pressure</span>
                      </div>
                      <span className="font-semibold">{pressure.toFixed(1)} hPa</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-gray-600 flex-shrink-0" />
                        <span className="text-sm font-medium">Visibility</span>
                      </div>
                      <span className="font-semibold">{visibility.toFixed(1)} km</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm font-medium">Dew Point</span>
                      </div>
                      <span className="font-semibold">{dewPoint.toFixed(1)}°C</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sun Times */}
              <Card className="border-2 border-green-200 bg-gradient-to-r from-orange-50 via-yellow-50 to-blue-50">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Sunrise className="h-8 w-8 text-orange-600" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-sm text-gray-600">Sunrise</p>
                        <p className="text-2xl font-bold">6:12 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Sunset className="h-8 w-8 text-gray-600" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-sm text-gray-600">Sunset</p>
                        <p className="text-2xl font-bold">6:45 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Forecast Tab */}
            <TabsContent value="forecast" className="space-y-4">
              {/* 14-Day Forecast Cards */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    14-Day Weather Forecast
                  </h3>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                    <Plus className="h-3 w-3 mr-1" />
                    Extended Forecast
                  </Badge>
                </div>
                
                {/* First Week */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    Next 7 Days (High Confidence)
                  </p>
                  <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-7">
                  {weekForecast.slice(0, 7).map((day, index) => {
                    const WeatherIcon = getWeatherIcon(day.condition);
                    const isSelected = selectedDay === index;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all ${
                            isSelected 
                              ? "border-2 border-green-500 bg-green-50 shadow-lg" 
                              : "border-2 border-green-200 hover:border-green-400"
                          }`}
                          onClick={() => setSelectedDay(isSelected ? null : index)}
                        >
                          <CardContent className="p-4 text-center">
                            <p className="text-sm font-semibold mb-2">{day.day}</p>
                            <motion.div
                              animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 0.5 }}
                            >
                              <WeatherIcon className={`h-8 w-8 mx-auto ${
                                day.condition.includes("Rain") ? "text-gray-600" : "text-orange-500"
                              }`} />
                            </motion.div>
                            <p className="text-2xl font-bold mt-2">{Math.round(day.temp)}°</p>
                            <p className="text-xs text-gray-500 mt-1">{day.condition}</p>
                            {day.rainfall > 0 && (
                              <Badge className="mt-2 bg-gray-100 text-gray-700 text-xs">
                                {day.rainfall.toFixed(1)}mm
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                  </div>
                </div>

                {/* Second Week */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                    <Info className="h-3 w-3 text-gray-600" />
                    Days 8-14 (Medium Confidence)
                  </p>
                  <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-7">
                  {weekForecast.slice(7, 14).map((day, index) => {
                    const WeatherIcon = getWeatherIcon(day.condition);
                    const actualIndex = index + 7;
                    const isSelected = selectedDay === actualIndex;
                    
                    return (
                      <motion.div
                        key={actualIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all ${
                            isSelected 
                              ? "border-2 border-green-500 bg-green-50 shadow-lg" 
                              : "border-2 border-green-200 hover:border-green-400 opacity-80"
                          }`}
                          onClick={() => setSelectedDay(isSelected ? null : actualIndex)}
                        >
                          <CardContent className="p-4 text-center">
                            <p className="text-sm font-semibold mb-2">{day.day}</p>
                            <motion.div
                              animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 0.5 }}
                            >
                              <WeatherIcon className={`h-8 w-8 mx-auto ${
                                day.condition.includes("Rain") ? "text-gray-600" : "text-orange-500"
                              }`} />
                            </motion.div>
                            <p className="text-2xl font-bold mt-2">{Math.round(day.temp + 25)}°</p>
                            <p className="text-xs text-gray-500 mt-1">{day.condition}</p>
                            {day.rainfall > 0 && (
                              <Badge className="mt-2 bg-gray-100 text-gray-700 text-xs border-0">
                                {day.rainfall.toFixed(1)}mm
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                  </div>
                </div>
              </div>

              {/* Hourly Temperature Chart */}
              <Card className="border-2 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Activity className="h-5 w-5 text-orange-600" />
                    </div>
                    24-Hour Temperature Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={hourlyForecast}>
                      <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="hour" 
                        tick={{ fontSize: 10 }}
                        interval={2}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: "8px", 
                          border: "2px solid #f97316",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="temp"
                        stroke="#f97316"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#tempGradient)"
                        name="Temperature (°C)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Rainfall Forecast */}
              <Card className="border-2 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <CloudRain className="h-5 w-5 text-gray-600" />
                    </div>
                    24-Hour Rainfall Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={hourlyForecast}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="hour" 
                        tick={{ fontSize: 10 }}
                        interval={2}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: "8px", 
                          border: "2px solid #3b82f6",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                        }}
                      />
                      <Bar 
                        dataKey="rainfall" 
                        fill="#3b82f6" 
                        radius={[8, 8, 0, 0]}
                        name="Rainfall (mm)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Temperature Details */}
                <Card className="border-2 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <ThermometerSun className="h-5 w-5 text-orange-600" />
                      </div>
                      Temperature
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current</span>
                        <span className="text-xl font-bold text-orange-600">25°C</span>
                      </div>
                      <Progress value={(25 / 50) * 100} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Feels like:</span>
                      <span className="font-semibold">{(25 + 2).toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Min/Max:</span>
                      <span className="font-semibold">{(25 - 5).toFixed(0)}° / {(25 + 5).toFixed(0)}°</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Humidity Details */}
                <Card className="border-2 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Droplets className="h-5 w-5 text-gray-600" />
                      </div>
                      Humidity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current</span>
                        <span className="text-xl font-bold text-gray-600">{(Math.random() * 30 + 60).toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.random() * 30 + 60} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Dew Point:</span>
                      <span className="font-semibold">{dewPoint.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={Math.random() > 0.5 ? "bg-gray-100 text-gray-700 border-0" : "bg-yellow-100 text-yellow-700 border-0"}>
                        {Math.random() > 0.5 ? "High" : "Normal"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Wind Details */}
                <Card className="border-2 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Wind className="h-5 w-5 text-green-600" />
                      </div>
                      Wind
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Speed</span>
                        <span className="text-xl font-bold text-green-600">{windSpeed.toFixed(1)} km/h</span>
                      </div>
                      <Progress value={(windSpeed / 50) * 100} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Direction:</span>
                      <div className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        <span className="font-semibold">NE</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Gusts:</span>
                      <span className="font-semibold">{(windSpeed + 5).toFixed(1)} km/h</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Farming Tab */}
            <TabsContent value="farming" className="space-y-4">
              {/* Planting Calendar */}
              <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    Planting Calendar & Recommendations
                  </CardTitle>
                  <CardDescription>Optimal planting times based on current weather conditions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-white rounded-lg border-2 border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Current Season</p>
                      <p className="text-xl font-bold text-green-700">Rainy Season</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Next Planting Date</p>
                      <p className="text-lg font-bold text-gray-700">
                        {new Date(Date.now() + 10 * 86400000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Days Until Planting</p>
                      <p className="text-xl font-bold text-gray-700">
                        {Math.ceil((new Date(Date.now() + 10 * 86400000).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      Recommended Crops for Current Season
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {["Maize", "Sorghum", "Beans", "Cassava"].map((crop, index) => (
                        <motion.div
                          key={crop}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-green-200 hover:border-green-400 transition-colors">
                            <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                              <Sprout className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="font-medium text-green-900 flex-1">{crop}</span>
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Farming Recommendations */}
              <Card className="border-2 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-gray-600" />
                    </div>
                    Weather-Based Farming Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                    <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                      <Droplets className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-green-900 mb-1">Irrigation Schedule</h4>
                      <p className="text-sm text-green-700">
                        Current humidity at {(Math.random() * 30 + 60).toFixed(0)}%. Reduce irrigation frequency. Water early morning or late evening.
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-2 border-orange-200">
                    <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                      <Sun className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-orange-900 mb-1">Sun Protection</h4>
                      <p className="text-sm text-orange-700">
                        UV Index at {uvIndex}. Provide shade for young plants. Apply mulch to retain soil moisture.
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-orange-600 flex-shrink-0 mt-1" />
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200">
                    <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                      <CloudRain className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">Rainfall Management</h4>
                      <p className="text-sm text-gray-700">
                        {Math.random() > 0.5
                          ? "Heavy rainfall recorded. Ensure proper drainage to prevent waterlogging."
                          : "Low rainfall. Monitor soil moisture and increase irrigation if needed."}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-600 flex-shrink-0 mt-1" />
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200">
                    <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                      <Shield className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">Pest & Disease Alert</h4>
                      <p className="text-sm text-gray-700">
                        High humidity increases fungal disease risk. Monitor crops closely and apply preventive fungicides if necessary.
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-600 flex-shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}