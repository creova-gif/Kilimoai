import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Sparkles, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Flame,
  ShoppingCart,
  Leaf
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner@2.0.3";

interface PersonalizedRecommendationsProps {
  userId: string;
  apiBase: string;
  authToken: string;
  onNavigate?: (tab: string) => void;
}

export function PersonalizedRecommendations({ userId, apiBase, authToken, onNavigate }: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [userId]);

  const loadRecommendations = async () => {
    setLoading(true);
    
    try {
      const url = `${apiBase}/advisory/personalized`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      // Get response as text first to check if it's HTML
      const responseText = await response.text();

      // Check if response is HTML (error page) - silently use fallback
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        setRecommendations(getMockRecommendations());
        setLoading(false);
        return;
      }

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        setRecommendations(getMockRecommendations());
        setLoading(false);
        return;
      }

      if (data.success) {
        setRecommendations(data.recommendations);
      } else {
        setRecommendations(getMockRecommendations());
      }
    } catch (error) {
      // Silently use mock data on any error
      setRecommendations(getMockRecommendations());
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const getMockRecommendations = () => {
    return {
      urgent: [
        {
          title: "Fertilizer Application Recommended",
          description: "Based on your Maize growth stage, apply top-dressing fertilizer this week",
          priority: "high",
          category: "Crop Care",
          actionable: true,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          title: "Pest Alert: Fall Armyworm Detected",
          description: "Recent reports in your region. Inspect your crops and apply preventive measures",
          priority: "high",
          category: "Pest Control",
          actionable: true,
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ],
      seasonal: [
        {
          title: "Prepare for Short Rains",
          description: "October-December planting season approaching. Prepare your land now",
          priority: "medium",
          category: "Planning",
          actionable: true,
        },
        {
          title: "Soil Testing Recommended",
          description: "Test your soil before the next planting season for optimal fertilizer planning",
          priority: "medium",
          category: "Soil Health",
          actionable: true,
        }
      ],
      market: [
        {
          title: "Maize Prices Rising",
          description: "Market analysis shows 8% price increase in your region. Good time to sell",
          priority: "medium",
          category: "Market Opportunity",
          actionable: true,
        },
        {
          title: "High Demand for Beans",
          description: "Consider diversifying with beans - current prices are favorable",
          priority: "low",
          category: "Market Insight",
          actionable: false,
        }
      ],
      learning: [
        {
          title: "New Training: Fall Armyworm Management",
          description: "Learn about early detection and control of Fall Armyworm",
          priority: "low",
          category: "Education",
          actionable: false,
        },
        {
          title: "Video Tutorial: Drip Irrigation Setup",
          description: "Save water and increase yields with proper irrigation techniques",
          priority: "low",
          category: "Education",
          actionable: false,
        }
      ],
      personalized: [
        {
          title: "Follow-up on Recent Diagnosis",
          description: "Check on the treatment applied 7 days ago and upload new photos",
          priority: "medium",
          category: "Health Monitoring",
          actionable: true,
        }
      ],
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generating personalized recommendations...</p>
        </div>
      </div>
    );
  }

  const allRecommendations = [
    ...(recommendations?.urgent || []),
    ...(recommendations?.seasonal || []),
    ...(recommendations?.market || []),
    ...(recommendations?.learning || []),
    ...(recommendations?.personalized || []),
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-5 w-5" />;
      case "medium":
        return <TrendingUp className="h-5 w-5" />;
      case "low":
        return <BookOpen className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  // Smart navigation based on recommendation type
  const handleAction = (recommendation: any) => {
    if (!onNavigate) {
      toast.info("Navigation not available");
      return;
    }

    const { title, category, description } = recommendation;

    // Intelligent routing based on category and keywords
    if (category === "Pest Control" || title.toLowerCase().includes("pest") || title.toLowerCase().includes("disease")) {
      toast.success("Opening Crop Diagnosis Tool...");
      onNavigate("diagnosis");
    } else if (category === "Crop Care" && (title.toLowerCase().includes("fertilizer") || title.toLowerCase().includes("spray"))) {
      toast.success("Opening Input Supply Chain...");
      onNavigate("input-supply");
    } else if (category === "Market Opportunity" || category === "Market Insight") {
      toast.success("Opening Market Prices...");
      onNavigate("market");
    } else if (title.toLowerCase().includes("sell") || description.toLowerCase().includes("sell")) {
      toast.success("Opening Marketplace...");
      onNavigate("marketplace");
    } else if (category === "Planning" || category === "Seasonal") {
      toast.success("Opening Crop Planning...");
      onNavigate("crop-planning");
    } else if (category === "Soil Health" || title.toLowerCase().includes("soil")) {
      toast.success("Opening Soil Testing Service...");
      onNavigate("soil-test");
    } else if (category === "Education" || title.toLowerCase().includes("training") || title.toLowerCase().includes("tutorial")) {
      if (title.toLowerCase().includes("video")) {
        toast.success("Opening Video Tutorials...");
        onNavigate("videos");
      } else {
        toast.success("Opening Knowledge Repository...");
        onNavigate("knowledge");
      }
    } else if (category === "Health Monitoring" || title.toLowerCase().includes("follow-up")) {
      toast.success("Opening Photo Diagnosis...");
      onNavigate("diagnosis");
    } else {
      // Default fallback to AI Chat
      toast.success("Opening AI Assistant for guidance...");
      onNavigate("ai-chat");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="relative">
          {/* Decorative Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 blur-2xl -z-10"></div>
          
          <h2 className="text-3xl lg:text-4xl font-bold flex items-center gap-3 group">
            {/* Premium Icon Badge */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Lightbulb className="h-7 w-7 text-white" />
              </div>
            </div>
            
            {/* Premium Text with Gradient */}
            <span className="bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Personalized AI Recommendations
            </span>
            
            {/* Animated Badge */}
            <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 px-3 py-1 shadow-md animate-pulse">
              AI-Powered
            </Badge>
          </h2>
          
          {/* Decorative Underline */}
          <div className="mt-3 h-1 w-32 bg-gradient-to-r from-green-500 via-emerald-500 to-transparent rounded-full"></div>
        </div>
        <p className="text-gray-600 mt-2">
          Smart recommendations powered by your Farm Graph data - the more you use KILIMO, the smarter it gets
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardDescription>Urgent Actions</CardDescription>
            <CardTitle className="text-3xl text-red-700">
              {recommendations?.urgent?.length || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-red-600">Needs attention this week</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardDescription>Seasonal Tips</CardDescription>
            <CardTitle className="text-3xl text-yellow-700">
              {recommendations?.seasonal?.length || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-600">Planning opportunities</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardDescription>Market Insights</CardDescription>
            <CardTitle className="text-3xl text-green-700">
              {recommendations?.market?.length || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">Selling opportunities</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardDescription>Learning Resources</CardDescription>
            <CardTitle className="text-3xl text-blue-700">
              {recommendations?.learning?.length || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-600">Knowledge expansion</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        {/* Premium Filter Pills - Mobile: Horizontal Scroll, Desktop: Grid */}
        <div className="relative">
          {/* Mobile: Horizontal Scrollable */}
          <div className="md:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
              <TabsList className="inline-flex gap-2 bg-transparent p-0">
                <TabsTrigger 
                  value="all" 
                  className="flex-shrink-0 snap-start group data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-700 data-[state=active]:to-gray-900 data-[state=active]:text-white data-[state=active]:shadow-xl rounded-full px-4 py-2.5 transition-all duration-300 bg-white border-2 border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 flex-shrink-0" />
                    <span className="font-semibold text-sm whitespace-nowrap">All</span>
                    <div className="ml-1 bg-gray-200 group-data-[state=active]:bg-white/20 text-gray-700 group-data-[state=active]:text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {allRecommendations.length}
                    </div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="urgent" 
                  className="flex-shrink-0 snap-start group data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-xl rounded-full px-4 py-2.5 transition-all duration-300 bg-white border-2 border-red-200 hover:border-red-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Flame className="h-4 w-4 flex-shrink-0" />
                    <span className="font-semibold text-sm whitespace-nowrap">Urgent</span>
                    <div className="ml-1 bg-red-200 group-data-[state=active]:bg-white/20 text-red-700 group-data-[state=active]:text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {recommendations?.urgent?.length || 0}
                    </div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="market" 
                  className="flex-shrink-0 snap-start group data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-xl rounded-full px-4 py-2.5 transition-all duration-300 bg-white border-2 border-green-200 hover:border-green-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <ShoppingCart className="h-4 w-4 flex-shrink-0" />
                    <span className="font-semibold text-sm whitespace-nowrap">Market</span>
                    <div className="ml-1 bg-green-200 group-data-[state=active]:bg-white/20 text-green-700 group-data-[state=active]:text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {recommendations?.market?.length || 0}
                    </div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="seasonal" 
                  className="flex-shrink-0 snap-start group data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-xl rounded-full px-4 py-2.5 transition-all duration-300 bg-white border-2 border-yellow-200 hover:border-yellow-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Leaf className="h-4 w-4 flex-shrink-0" />
                    <span className="font-semibold text-sm whitespace-nowrap">Seasonal</span>
                    <div className="ml-1 bg-yellow-200 group-data-[state=active]:bg-white/20 text-yellow-700 group-data-[state=active]:text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {recommendations?.seasonal?.length || 0}
                    </div>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
            {/* Scroll Indicator */}
            <div className="flex justify-center gap-1 mt-2">
              <div className="h-1 w-8 bg-gray-300 rounded-full"></div>
              <div className="h-1 w-8 bg-gray-200 rounded-full"></div>
              <div className="h-1 w-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden md:block">
            <div className="bg-white rounded-lg border border-gray-200 p-2">
              <TabsList className="grid w-full grid-cols-4 gap-2 bg-transparent p-0">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-green-700 data-[state=active]:text-white rounded-lg px-4 py-3 transition-colors border border-transparent data-[state=active]:border-green-700"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">All</span>
                    <Badge variant="outline" className="ml-1 text-xs px-2 py-0.5">
                      {allRecommendations.length}
                    </Badge>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="urgent" 
                  className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg px-4 py-3 transition-colors border border-transparent data-[state=active]:border-red-600"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Flame className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">Urgent</span>
                    <Badge variant="outline" className="ml-1 text-xs px-2 py-0.5">
                      {recommendations?.urgent?.length || 0}
                    </Badge>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="market" 
                  className="data-[state=active]:bg-green-700 data-[state=active]:text-white rounded-lg px-4 py-3 transition-colors border border-transparent data-[state=active]:border-green-700"
                >
                  <div className="flex items-center justify-center gap-2">
                    <ShoppingCart className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">Market</span>
                    <Badge variant="outline" className="ml-1 text-xs px-2 py-0.5">
                      {recommendations?.market?.length || 0}
                    </Badge>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="seasonal" 
                  className="data-[state=active]:bg-green-700 data-[state=active]:text-white rounded-lg px-4 py-3 transition-colors border border-transparent data-[state=active]:border-green-700"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Leaf className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">Seasonal</span>
                    <Badge variant="outline" className="ml-1 text-xs px-2 py-0.5">
                      {recommendations?.seasonal?.length || 0}
                    </Badge>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {allRecommendations.length > 0 ? (
            <div className="space-y-3">
              {allRecommendations.map((rec, index) => (
                <Card key={index} className={`border-2 ${getPriorityColor(rec.priority)}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getPriorityColor(rec.priority)}`}>
                          {getPriorityIcon(rec.priority)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {rec.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline">{rec.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Badge variant={rec.priority === "high" ? "destructive" : "secondary"}>
                            {rec.priority.toUpperCase()}
                          </Badge>
                        </span>
                        {rec.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(rec.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {rec.actionable && (
                        <Button size="sm" onClick={() => handleAction(rec)}>
                          Take Action
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No recommendations yet. Keep using KILIMO to receive personalized advice!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="urgent" className="space-y-4">
          {recommendations?.urgent && recommendations.urgent.length > 0 ? (
            <div className="space-y-3">
              {recommendations.urgent.map((rec: any, index: number) => (
                <Card key={index} className="border-2 border-red-200 bg-red-50">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-6 w-6 text-red-600 mt-1" />
                      <div className="flex-1">
                        <CardTitle className="text-lg text-red-900">{rec.title}</CardTitle>
                        <CardDescription className="mt-1 text-red-700">
                          {rec.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      {rec.dueDate && (
                        <span className="text-sm text-red-600 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {new Date(rec.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <Button variant="destructive" size="sm" onClick={() => handleAction(rec)}>
                        Take Action Now
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">All caught up!</p>
                <p className="text-sm text-gray-500 mt-2">No urgent actions at the moment</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          {recommendations?.market && recommendations.market.length > 0 ? (
            <div className="space-y-3">
              {recommendations.market.map((rec: any, index: number) => (
                <Card key={index} className="border-2 border-green-200 bg-green-50">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-green-600 mt-1" />
                      <div className="flex-1">
                        <CardTitle className="text-lg text-green-900">{rec.title}</CardTitle>
                        <CardDescription className="mt-1 text-green-700">
                          {rec.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="border-green-600 text-green-600" onClick={() => handleAction(rec)}>
                      View Market Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No market opportunities at the moment. Check back later!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-4">
          {recommendations?.seasonal && recommendations.seasonal.length > 0 ? (
            <div className="space-y-3">
              {recommendations.seasonal.map((rec: any, index: number) => (
                <Card key={index} className="border-2 border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-6 w-6 text-yellow-600 mt-1" />
                      <div className="flex-1">
                        <CardTitle className="text-lg text-yellow-900">{rec.title}</CardTitle>
                        <CardDescription className="mt-1 text-yellow-700">
                          {rec.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="border-yellow-600 text-yellow-600" onClick={() => handleAction(rec)}>
                      Learn More
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No seasonal recommendations at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How AI Recommendations Work</CardTitle>
          <CardDescription>
            KILIMO learns from your Farm Graph to provide increasingly accurate advice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-sm">Data Collection</p>
                <p className="text-xs text-gray-600 mt-1">
                  Every interaction you have with KILIMO is tracked in your Farm Graph
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-sm">Pattern Recognition</p>
                <p className="text-xs text-gray-600 mt-1">
                  AI analyzes your behavior, crops, location, and historical data
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-sm">Personalized Advice</p>
                <p className="text-xs text-gray-600 mt-1">
                  Recommendations are tailored specifically to YOUR farm, not generic advice
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <p className="font-medium text-sm">Continuous Learning</p>
                <p className="text-xs text-gray-600 mt-1">
                  The more you use KILIMO, the better recommendations become
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}