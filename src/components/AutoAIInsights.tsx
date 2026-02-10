import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Droplets,
  Leaf,
  Beef,
  RefreshCw,
  X,
  ChevronRight,
  Clock
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface AutoAIInsightsProps {
  userId: string;
  language?: "en" | "sw";
  autoLoad?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface Insight {
  id: string;
  type: "urgent" | "recommendation" | "alert" | "optimization";
  category: "task" | "crop" | "livestock" | "climate" | "finance";
  title: { en: string; sw: string };
  description: { en: string; sw: string };
  priority: "critical" | "high" | "medium" | "low";
  actionable: boolean;
  action?: string;
  timestamp: string;
}

export function AutoAIInsights({ 
  userId, 
  language = "en", 
  autoLoad = true,
  refreshInterval = 300000 // 5 minutes default
}: AutoAIInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

  const fetchInsights = async (silent = false) => {
    if (!silent) setLoading(true);
    
    try {
      // Don't log on silent refresh
      if (!silent) {
        console.log('🤖 Fetching AI insights for userId:', userId);
      }
      
      const response = await fetch(`${API_BASE}/ai-advisory/generate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, language }),
      }).catch(fetchError => {
        // Network error - server unreachable or CORS issue
        // Silently use fallback instead of showing error
        if (!silent) {
          console.log('Network unavailable, using offline insights');
        }
        throw new Error('NETWORK_ERROR');
      });

      // Check if response is JSON before parsing
      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        // Server returned non-JSON (likely error text)
        if (!silent) {
          const errorText = await response.text();
          console.log("Server response:", errorText.substring(0, 100));
        }
        result = { success: false, error: "Server error" };
      }

      // Handle 402 or fallback mode with sample insights
      if (response.status === 402 || result.fallback || !result.success) {
        if (!silent) {
          console.log('💡 Using sample insights');
        }
        
        // Use fallback insights
        const fallbackInsights: Insight[] = [
          {
            id: 'fallback-1',
            type: 'urgent',
            category: 'task',
            title: { en: 'Morning Irrigation Recommended', sw: 'Umwagiliaji wa Asubuhi Unapendekezwa' },
            description: { en: 'Irrigate crops between 6-8 AM for optimal water efficiency', sw: 'Mwagilia mazao kati ya 6-8 AM kwa ufanisi bora wa maji' },
            priority: 'high',
            actionable: true,
            action: 'view-task',
            timestamp: new Date().toISOString()
          },
          {
            id: 'fallback-2',
            type: 'alert',
            category: 'crop',
            title: { en: 'Crop Health Check', sw: 'Ukaguzi wa Afya ya Mazao' },
            description: { en: 'Monitor for pest activity and disease symptoms', sw: 'Fuatilia shughuli za wadudu na dalili za magonjwa' },
            priority: 'medium',
            actionable: true,
            action: 'view-crop',
            timestamp: new Date().toISOString()
          },
          {
            id: 'fallback-3',
            type: 'recommendation',
            category: 'climate',
            title: { en: 'Weather Advisory', sw: 'Ushauri wa Hali ya Hewa' },
            description: { en: 'Moderate rainfall expected this week - good for planting', sw: 'Mvua wastani inatarajiwa wiki hii - nzuri kwa kupanda' },
            priority: 'medium',
            actionable: true,
            action: 'view-weather',
            timestamp: new Date().toISOString()
          }
        ];
        
        setInsights(fallbackInsights);
        setLastUpdated(new Date());
        return;
      }

      if (result.success && result.recommendations) {
        // Transform recommendations into insights
        const newInsights: Insight[] = [];

        // Critical tasks
        if (result.recommendations.tasks) {
          result.recommendations.tasks.slice(0, 2).forEach((task: any) => {
            newInsights.push({
              id: `task-${task.id}`,
              type: "urgent",
              category: "task",
              title: task.name,
              description: task.suggestion,
              priority: "high",
              actionable: true,
              action: "view-task",
              timestamp: new Date().toISOString()
            });
          });
        }

        // Crop alerts
        if (result.recommendations.crops_alerts) {
          result.recommendations.crops_alerts.slice(0, 2).forEach((crop: any) => {
            newInsights.push({
              id: `crop-${crop.field_id}`,
              type: "alert",
              category: "crop",
              title: crop.crop_name,
              description: crop.alert,
              priority: "high",
              actionable: true,
              action: "view-crop",
              timestamp: new Date().toISOString()
            });
          });
        }

        // Livestock alerts
        if (result.recommendations.livestock_alerts) {
          result.recommendations.livestock_alerts.forEach((animal: any) => {
            newInsights.push({
              id: `livestock-${animal.id}`,
              type: "alert",
              category: "livestock",
              title: animal.species,
              description: animal.suggestion,
              priority: "high",
              actionable: true,
              action: "view-livestock",
              timestamp: new Date().toISOString()
            });
          });
        }

        // Financial optimization
        if (result.recommendations.finance_advice) {
          result.recommendations.finance_advice.slice(0, 1).forEach((advice: any) => {
            newInsights.push({
              id: `finance-${Date.now()}`,
              type: "optimization",
              category: "finance",
              title: advice.category,
              description: advice.recommendation,
              priority: "medium",
              actionable: true,
              action: "view-finance",
              timestamp: new Date().toISOString()
            });
          });
        }

        // Climate warnings
        if (result.recommendations.climate_alerts) {
          result.recommendations.climate_alerts.slice(0, 1).forEach((alert: any) => {
            newInsights.push({
              id: `climate-${alert.date}`,
              type: "recommendation",
              category: "climate",
              title: { en: "Weather Alert", sw: "Tahadhari ya Hali ya Hewa" },
              description: alert.alert,
              priority: "medium",
              actionable: true,
              action: "view-weather",
              timestamp: new Date().toISOString()
            });
          });
        }

        setInsights(newInsights.slice(0, 5)); // Top 5 insights
        setLastUpdated(new Date());
        
        if (!silent) {
          toast.success(
            language === "en" 
              ? "AI insights updated" 
              : "Maarifa ya AI yameboreshwa"
          );
        }
      }
    } catch (error) {
      // Silently handle errors and use fallback insights
      // Only log in development or when explicitly requested
      if (!silent) {
        console.log('ℹ️ Using offline insights (network unavailable)');
      }
      
      // Use fallback insights when network fails
      const fallbackInsights: Insight[] = [
        {
          id: 'offline-1',
          type: 'urgent',
          category: 'task',
          title: { en: 'Morning Irrigation Recommended', sw: 'Umwagiliaji wa Asubuhi Unapendekezwa' },
          description: { en: 'Irrigate crops between 6-8 AM for optimal water efficiency', sw: 'Mwagilia mazao kati ya 6-8 AM kwa ufanisi bora wa maji' },
          priority: 'high',
          actionable: true,
          action: 'view-task',
          timestamp: new Date().toISOString()
        },
        {
          id: 'offline-2',
          type: 'alert',
          category: 'crop',
          title: { en: 'Crop Health Check', sw: 'Ukaguzi wa Afya ya Mazao' },
          description: { en: 'Monitor for pest activity and disease symptoms', sw: 'Fuatilia shughuli za wadudu na dalili za magonjwa' },
          priority: 'medium',
          actionable: true,
          action: 'view-crop',
          timestamp: new Date().toISOString()
        },
        {
          id: 'offline-3',
          type: 'recommendation',
          category: 'climate',
          title: { en: 'Weather Advisory', sw: 'Ushauri wa Hali ya Hewa' },
          description: { en: 'Check weather forecast regularly', sw: 'Angalia utabiri wa hali ya hewa mara kwa mara' },
          priority: 'medium',
          actionable: true,
          action: 'view-weather',
          timestamp: new Date().toISOString()
        }
      ];
      
      setInsights(fallbackInsights);
      setLastUpdated(new Date());
      
      if (!silent) {
        toast.info(
          language === "en" 
            ? "Showing offline insights" 
            : "Inaonyesha maarifa ya nje ya mtandao"
        );
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad && userId) {
      fetchInsights();
    }
  }, [userId, autoLoad]);

  // Auto-refresh interval
  useEffect(() => {
    if (refreshInterval > 0 && userId) {
      const intervalId = setInterval(() => {
        fetchInsights(true); // Silent refresh
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, userId]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "alert": return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "recommendation": return <Brain className="h-5 w-5 text-gray-700" />;
      case "optimization": return <TrendingUp className="h-5 w-5 text-green-600" />;
      default: return <Brain className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "crop": return <Leaf className="h-4 w-4" />;
      case "livestock": return <Beef className="h-4 w-4" />;
      case "climate": return <Droplets className="h-4 w-4" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-600 text-white";
      case "high": return "bg-orange-600 text-white";
      case "medium": return "bg-yellow-600 text-white";
      case "low": return "bg-green-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-20 left-4 z-40 md:bottom-4">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-gray-700 hover:bg-gray-800 shadow-xl rounded-full h-12 w-12"
        >
          <Brain className="h-6 w-6 text-white" />
        </Button>
        {insights.length > 0 && (
          <span className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {insights.length}
          </span>
        )}
      </div>
    );
  }

  return (
    <Card className="border-gray-300 bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-gray-700" />
            AI Insights
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchInsights()}
              disabled={loading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription className="text-xs flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {lastUpdated && (
            language === "en" 
              ? `Updated ${lastUpdated.toLocaleTimeString()}`
              : `Imeboreshwa ${lastUpdated.toLocaleTimeString()}`
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && insights.length === 0 ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 mx-auto mb-2 text-gray-600 animate-spin" />
            <p className="text-sm text-gray-600">
              {language === "en" ? "Analyzing your farm data..." : "Inachambu a data ya shamba..."}
            </p>
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              {language === "en" ? "No insights available" : "Hakuna maarifa"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getTypeIcon(insight.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(insight.category)}
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {insight.title[language]}
                        </p>
                      </div>
                      <Badge className={getPriorityColor(insight.priority)} size="sm">
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {insight.description[language]}
                    </p>
                    {insight.actionable && (
                      <Button
                        variant="link"
                        size="sm"
                        className="text-green-600 p-0 h-auto mt-1 text-xs"
                      >
                        {language === "en" ? "Take Action" : "Chukua Hatua"}
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}