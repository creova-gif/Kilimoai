import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AICreditsWarning } from "./AICreditsWarning";
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Droplets,
  Thermometer,
  DollarSign,
  Leaf,
  Beef,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
  Languages,
  Sparkles,
  Brain,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Task {
  id: number;
  name: string;
  status: string;
  field_id: number;
}

interface Crop {
  field_id: number;
  crop_name: string;
  growth_stage: string;
  health: string;
  expected_yield: number;
}

interface Livestock {
  id: number;
  species: string;
  age: number;
  health_status: string;
  last_treatment_date: string;
}

interface Climate {
  date: string;
  forecast_rain_mm: number;
  temp_max: number;
  temp_min: number;
  alert: string;
}

interface Finance {
  category: string;
  expense: number;
  revenue: number;
}

interface RecommendationData {
  farmer_name: string;
  farm_type: "smallholder" | "agribusiness" | "commercial";
  language: "en" | "sw";
  tasks: Task[];
  crops: Crop[];
  livestock: Livestock[];
  climate: Climate[];
  finance: Finance[];
}

interface Recommendation {
  tasks: Array<{
    id: number;
    name: { en: string; sw: string };
    suggestion: { en: string; sw: string };
    steps: Array<{ en: string; sw: string }>;
  }>;
  crops_alerts: Array<{
    field_id: number;
    crop_name: { en: string; sw: string };
    alert: { en: string; sw: string };
  }>;
  livestock_alerts: Array<{
    id: number;
    species: { en: string; sw: string };
    suggestion: { en: string; sw: string };
  }>;
  finance_advice: Array<{
    category: { en: string; sw: string };
    recommendation: { en: string; sw: string };
  }>;
  climate_alerts: Array<{
    date: string;
    alert: { en: string; sw: string };
  }>;
}

interface AIRecommendationsProps {
  userId?: string;
}

export function AIRecommendations({ userId }: AIRecommendationsProps = {}) {
  const [language, setLanguage] = useState<"en" | "sw">("en");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
  const [farmerProfile, setFarmerProfile] = useState<{name: string; farmType: string; region: string} | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

  const getFallbackRecommendations = (): Recommendation => {
    return {
      tasks: [
        {
          id: 1,
          name: { en: "Water crops early morning", sw: "Mwagilia mazao asubuhi na mapema" },
          suggestion: { 
            en: "Irrigate between 6-8 AM to reduce water loss", 
            sw: "Mwagilia kati ya 6-8 AM ili kupunguza upotevu wa maji" 
          },
          steps: [
            { en: "Check soil moisture", sw: "Angalia unyevu wa udongo" },
            { en: "Water for 30-45 minutes", sw: "Mwagilia kwa dakika 30-45" }
          ]
        },
        {
          id: 2,
          name: { en: "Apply organic fertilizer", sw: "Tumia mbolea asili" },
          suggestion: { 
            en: "Use compost to improve soil health", 
            sw: "Tumia mbolea ili kuboresha afya ya udongo" 
          },
          steps: [
            { en: "Apply 2kg per plant", sw: "Tumia kilo 2 kwa kila mmea" },
            { en: "Mix with topsoil", sw: "Changanya na udongo wa juu" }
          ]
        }
      ],
      crops_alerts: [
        {
          field_id: 1,
          crop_name: { en: "Maize", sw: "Mahindi" },
          alert: { 
            en: "Monitor for Fall Armyworm signs", 
            sw: "Angalia dalili za mdudu wa Fall Armyworm" 
          }
        }
      ],
      livestock_alerts: [
        {
          id: 101,
          species: { en: "Cattle", sw: "Ng'ombe" },
          suggestion: { 
            en: "Schedule vaccination check this month", 
            sw: "Panga ukaguzi wa chanjo mwezi huu" 
          }
        }
      ],
      finance_advice: [
        {
          category: { en: "Market Prices", sw: "Bei ya Soko" },
          recommendation: { 
            en: "Maize prices expected to rise 5% next month", 
            sw: "Bei ya mahindi inatarajiwa kuongezeka 5% mwezi ujao" 
          }
        }
      ],
      climate_alerts: [
        {
          date: new Date().toISOString().split('T')[0],
          alert: { 
            en: "Moderate rainfall expected this week", 
            sw: "Mvua wastani inatarajiwa wiki hii" 
          }
        }
      ]
    };
  };

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // Get userId from localStorage if not provided
      const currentUserId = userId || JSON.parse(localStorage.getItem("kilimoUser") || "{}").id;
      
      if (!currentUserId) {
        toast.error(language === "en" ? "User not found. Please log in." : "Mtumiaji hajapatikana. Tafadhali ingia.");
        return;
      }

      // Call the backend AI advisory endpoint
      const response = await fetch(`${API_BASE}/ai-advisory/generate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUserId,
          language
        }),
      });

      const result = await response.json();

      // Handle 402 payment errors with fallback
      if (response.status === 402 || result.fallback) {
        setIsFallbackMode(true);
        toast.warning(
          language === "en" 
            ? "AI service temporarily unavailable. Showing sample recommendations." 
            : "Huduma ya AI haipatikani kwa sasa. Inaonyesha mapendekezo ya sampuli."
        );
        
        // Use fallback recommendations
        setRecommendations(getFallbackRecommendations());
        return;
      }

      setIsFallbackMode(false);

      if (!response.ok) {
        throw new Error(result.error || result.details || "Failed to generate recommendations");
      }

      if (result.success && result.recommendations) {
        setRecommendations(result.recommendations);
        if (result.farmerProfile) {
          setFarmerProfile(result.farmerProfile);
        }
        toast.success(
          language === "en" 
            ? "AI recommendations generated successfully!" 
            : "Mapendekezo ya AI yametengenezwa!"
        );
      } else {
        throw new Error(result.error || "Invalid response from server");
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast.error(
        language === "en" 
          ? `Failed to generate recommendations: ${error instanceof Error ? error.message : String(error)}` 
          : `Imeshindwa kutengeneza mapendekezo: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "sw" : "en");
    toast.success(
      language === "en" 
        ? "Language changed to Swahili" 
        : "Lugha imebadilishwa kuwa Kiingereza"
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === "en" ? "AI Farm Recommendations" : "Mapendekezo ya Kilimo ya AI"}
          </h1>
          <p className="text-gray-600">
            {language === "en" 
              ? "Personalized insights for your farm based on real-time data" 
              : "Ushauri maalum kwa shamba lako kulingana na data ya wakati halisi"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={toggleLanguage}
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <Languages className="h-4 w-4 mr-2" />
            {language === "en" ? "EN" : "SW"}
          </Button>
          <Button 
            onClick={generateRecommendations}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                {language === "en" ? "Generating..." : "Inatengeneza..."}
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                {language === "en" ? "Generate Recommendations" : "Tengeneza Mapendekezo"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Farmer Info Card */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-green-600 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{farmerProfile?.name || "John Mwangi"}</h3>
              <p className="text-sm text-gray-600">
                {language === "en" ? "Farm Type" : "Aina ya Shamba"}: {farmerProfile?.farmType || "smallholder"}
              </p>
              <p className="text-sm text-gray-600">
                {language === "en" ? "Active Crops" : "Mazao Hai"}: {farmerProfile?.farmType ? 3 : 0} | 
                {language === "en" ? " Livestock" : " Mifugo"}: {farmerProfile?.farmType ? 2 : 0} | 
                {language === "en" ? " Pending Tasks" : " Kazi Zinazongoja"}: {farmerProfile?.farmType ? 3 : 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Credits Warning */}
      {isFallbackMode && <AICreditsWarning language={language} />}

      {!recommendations ? (
        <Card>
          <CardContent className="pt-16 pb-16 text-center">
            <Brain className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">
              {language === "en" 
                ? "No Recommendations Yet" 
                : "Hakuna Mapendekezo Bado"}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === "en" 
                ? "Click the button above to generate AI-powered farming recommendations" 
                : "Bonyeza kitufe hapo juu ili kutengeneza mapendekezo ya kilimo ya AI"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="tasks">
              <CheckCircle className="h-4 w-4 mr-2" />
              {language === "en" ? "Tasks" : "Kazi"}
            </TabsTrigger>
            <TabsTrigger value="crops">
              <Leaf className="h-4 w-4 mr-2" />
              {language === "en" ? "Crops" : "Mazao"}
            </TabsTrigger>
            <TabsTrigger value="livestock">
              <Beef className="h-4 w-4 mr-2" />
              {language === "en" ? "Livestock" : "Mifugo"}
            </TabsTrigger>
            <TabsTrigger value="climate">
              <Droplets className="h-4 w-4 mr-2" />
              {language === "en" ? "Climate" : "Hali ya Hewa"}
            </TabsTrigger>
            <TabsTrigger value="finance">
              <DollarSign className="h-4 w-4 mr-2" />
              {language === "en" ? "Finance" : "Fedha"}
            </TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "en" ? "Task Recommendations" : "Mapendekezo ya Kazi"}
                </CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? "AI-suggested actions and optimizations for your scheduled tasks" 
                    : "Vitendo na maboresho vilivyopendekezwa na AI kwa kazi zako zilizopangwa"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.tasks.map((task) => (
                  <Card key={task.id} className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-lg mb-1">
                              {task.name[language]}
                            </h4>
                            <p className="text-sm text-gray-700 flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              {task.suggestion[language]}
                            </p>
                          </div>
                          <Badge className="bg-blue-600 text-white">
                            {language === "en" ? "Suggested" : "Pendekezo"}
                          </Badge>
                        </div>

                        <div className="pl-6 space-y-2 border-l-2 border-blue-300 ml-2">
                          <p className="text-sm font-medium text-gray-700">
                            {language === "en" ? "Step-by-Step Guide:" : "Mwongozo wa Hatua kwa Hatua:"}
                          </p>
                          {task.steps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {idx + 1}
                              </div>
                              <p className="text-sm text-gray-700 pt-0.5">{step[language]}</p>
                            </div>
                          ))}
                        </div>

                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                          onClick={() => toast.success(language === "en" ? "Task marked as acknowledged" : "Kazi imewekwa alama kuwa imetambuliwa")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {language === "en" ? "Mark as Acknowledged" : "Weka Alama Kuwa Imetambuliwa"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crops Tab */}
          <TabsContent value="crops" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "en" ? "Crop Health Alerts" : "Tahadhari za Afya ya Mazao"}
                </CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? "Monitor crop health and receive timely interventions" 
                    : "Fuatilia afya ya mazao na upokee matibabu kwa wakati"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.crops_alerts.map((crop) => (
                  <div key={crop.field_id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">{crop.crop_name[language]}</p>
                          <p className="text-sm text-gray-600">
                            {language === "en" ? "Field" : "Shamba"} #{crop.field_id}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-700">
                        {language === "en" ? "Alert" : "Tahadhari"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 pl-7">{crop.alert[language]}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Livestock Tab */}
          <TabsContent value="livestock" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "en" ? "Livestock Care Suggestions" : "Mapendekezo ya Matunzo ya Mifugo"}
                </CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? "Health monitoring and treatment schedules for your animals" 
                    : "Ufuatiliaji wa afya na ratiba za matibabu kwa wanyama wako"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.livestock_alerts.map((animal) => (
                  <div key={animal.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Beef className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium">{animal.species[language]}</p>
                          <p className="text-sm text-gray-600">ID: {animal.id}</p>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700">
                        {language === "en" ? "Action Needed" : "Hatua Inahitajika"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 pl-7">{animal.suggestion[language]}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Climate Tab */}
          <TabsContent value="climate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "en" ? "Weather Insights" : "Maarifa ya Hali ya Hewa"}
                </CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? "Plan your activities based on upcoming weather patterns" 
                    : "Panga shughuli zako kulingana na hali ya hewa inayokuja"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.climate_alerts.map((alert, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">
                            {new Date(alert.date).toLocaleDateString(language === "en" ? "en-US" : "sw-TZ", {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <Calendar className="h-4 w-4 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-700 pl-7">{alert.alert[language]}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Finance Tab */}
          <TabsContent value="finance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "en" ? "Financial Optimization" : "Maboresho ya Kifedha"}
                </CardTitle>
                <CardDescription>
                  {language === "en" 
                    ? "Maximize profits with market intelligence and cost savings" 
                    : "Ongeza faida kwa maarifa ya soko na uokoaji wa gharama"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.finance_advice.map((advice, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">{advice.category[language]}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white">
                        {language === "en" ? "Optimize" : "Boresha"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 pl-7">{advice.recommendation[language]}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* JSON Output Section */}
      {recommendations && (
        <Card className="border-gray-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {language === "en" ? "Raw JSON Output" : "Matokeo ya JSON Ghafi"}
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(recommendations, null, 2));
                  toast.success(language === "en" ? "JSON copied to clipboard!" : "JSON imenakiliwa kwenye clipboard!");
                }}
              >
                {language === "en" ? "Copy JSON" : "Nakili JSON"}
              </Button>
            </div>
            <CardDescription>
              {language === "en" 
                ? "Complete API response for developer integration" 
                : "Jibu kamili la API kwa uunganishaji wa wasanidi programu"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
              {JSON.stringify(recommendations, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}