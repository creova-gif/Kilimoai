import { useState, useEffect } from "react";
import { Layers, MapPin, TrendingUp, AlertCircle, Droplet, Leaf, RefreshCw, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface DigitalFarmTwinProps {
  userId: string;
  region: string;
  farmSize: string;
  crops: string[];
  apiBase: string;
  authToken: string;
}

export function DigitalFarmTwin({ userId, region, farmSize, crops, apiBase, authToken }: DigitalFarmTwinProps) {
  const [loading, setLoading] = useState(false);
  const [twinData, setTwinData] = useState<any>(null);
  const [scenarios, setScenarios] = useState<any[]>([]);

  useEffect(() => {
    loadFarmTwin();
  }, []);

  const loadFarmTwin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/farm-twin/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      // If endpoint doesn't exist (404), just use mock data
      if (!response.ok) {
        setTwinData(getMockTwinData());
        setScenarios(getMockScenarios());
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Not JSON, use mock data
        setTwinData(getMockTwinData());
        setScenarios(getMockScenarios());
        return;
      }

      const data = await response.json();
      if (data.success) {
        setTwinData(data.twin);
        setScenarios(data.scenarios || []);
      } else {
        setTwinData(getMockTwinData());
        setScenarios(getMockScenarios());
      }
    } catch (error) {
      // Silently use mock data - backend endpoints not yet implemented
      setTwinData(getMockTwinData());
      setScenarios(getMockScenarios());
    } finally {
      setLoading(false);
    }
  };

  const getMockTwinData = () => ({
    farmProfile: {
      name: "Your Farm",
      location: region,
      size: farmSize,
      plots: [
        { id: 1, name: "North Field", size: "2 acres", crop: crops[0] || "Maize", soilType: "Loamy" },
        { id: 2, name: "South Field", size: "1.5 acres", crop: "Beans", soilType: "Clay" }
      ]
    },
    currentInputs: {
      seeds: { type: "Hybrid Maize", quantity: "25kg", cost: 75000 },
      fertilizer: { type: "DAP", quantity: "100kg", cost: 180000 },
      pesticides: { type: "Organic spray", quantity: "5L", cost: 45000 },
      labor: { days: 30, cost: 150000 }
    },
    risks: [
      { type: "Weather", severity: "medium", description: "Drought risk in next 2 months", probability: 0.45 },
      { type: "Pest", severity: "high", description: "Fall Armyworm outbreak expected", probability: 0.65 },
      { type: "Market", severity: "low", description: "Price volatility", probability: 0.25 }
    ],
    predictions: {
      yieldExpected: "2.8 tonnes/acre",
      revenue: "TZS 1,680,000",
      profit: "TZS 1,230,000",
      roi: "174%",
      confidence: 0.82
    }
  });

  const getMockScenarios = () => [
    {
      name: "Current Plan",
      inputs: "Standard hybrid + DAP",
      yield: "2.8 t/acre",
      profit: "TZS 1,230,000",
      risk: "Medium",
      selected: true
    },
    {
      name: "High Input",
      inputs: "Premium hybrid + NPK + drip irrigation",
      yield: "3.5 t/acre",
      profit: "TZS 1,450,000",
      risk: "Low"
    },
    {
      name: "Low Cost",
      inputs: "Local variety + organic fertilizer",
      yield: "2.0 t/acre",
      profit: "TZS 980,000",
      risk: "High"
    },
    {
      name: "Diversified",
      inputs: "Maize + intercropped beans",
      yield: "2.5 t/acre maize + 0.8 t/acre beans",
      profit: "TZS 1,380,000",
      risk: "Low"
    }
  ];

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-700 border-red-300";
      case "medium": return "bg-orange-100 text-orange-700 border-orange-300";
      case "low": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!twinData) return null;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Layers className="h-6 w-6 md:h-7 md:w-7 text-green-600" />
            Digital Farm Twin
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Virtual model of your farm with inputs, risks, and predictions
          </p>
        </div>
        <Button onClick={loadFarmTwin} size="sm" variant="outline" className="h-9 md:h-10">
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="py-2.5 text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="inputs" className="py-2.5 text-xs sm:text-sm">
            Inputs
          </TabsTrigger>
          <TabsTrigger value="risks" className="py-2.5 text-xs sm:text-sm">
            Risks
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="py-2.5 text-xs sm:text-sm">
            Scenarios
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4 mt-0">
          <Card className="bg-green-50 border-2 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {twinData.farmProfile.name}
              </CardTitle>
              <CardDescription>{twinData.farmProfile.location} • {twinData.farmProfile.size}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-600">Expected Yield</p>
                  <p className="text-base md:text-lg font-bold text-green-600 mt-1">
                    {twinData.predictions.yieldExpected}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-600">Revenue</p>
                  <p className="text-base md:text-lg font-bold text-gray-900 mt-1">
                    {twinData.predictions.revenue}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-600">Profit</p>
                  <p className="text-base md:text-lg font-bold text-orange-600 mt-1">
                    {twinData.predictions.profit}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-600">ROI</p>
                  <p className="text-base md:text-lg font-bold text-orange-600 mt-1">
                    {twinData.predictions.roi}
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-white p-3 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Model Confidence</span>
                  <span className="text-sm font-bold">{(twinData.predictions.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${twinData.predictions.confidence * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl">Farm Plots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {twinData.farmProfile.plots.map((plot: any) => (
                  <div key={plot.id} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{plot.name}</h4>
                        <p className="text-sm text-gray-600">{plot.size}</p>
                      </div>
                      <Badge>{plot.crop}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Leaf className="h-4 w-4" />
                      <span>Soil: {plot.soilType}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inputs */}
        <TabsContent value="inputs" className="space-y-4 mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl">Current Season Inputs</CardTitle>
              <CardDescription>Track all inputs for accurate digital twin modeling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(twinData.currentInputs).map(([key, value]: [string, any]) => (
                  <div key={key} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">{key}</h4>
                      <span className="text-sm font-bold text-green-600">
                        TZS {value.cost?.toLocaleString() || value.cost}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="text-xs text-gray-500">Type:</span>
                        <p className="font-medium text-gray-700">{value.type || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Quantity:</span>
                        <p className="font-medium text-gray-700">{value.quantity || value.days + " days"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Input Cost</span>
                  <span className="text-xl font-bold text-green-600">
                    TZS {Object.values(twinData.currentInputs).reduce((sum: number, item: any) => sum + item.cost, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Add More Inputs</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Record New Input
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risks */}
        <TabsContent value="risks" className="space-y-4 mt-0">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-3 md:p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-orange-900">Risk Assessment</h4>
                <p className="text-sm text-orange-700 mt-1">
                  Digital twin identifies {twinData.risks.length} potential risks to your farm this season
                </p>
              </div>
            </div>
          </div>

          {twinData.risks.map((risk: any, idx: number) => (
            <Card key={idx} className={`border-2 ${getRiskColor(risk.severity)}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg md:text-xl flex items-center justify-between flex-wrap gap-2">
                  <span>{risk.type} Risk</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-white text-xs">
                      {(risk.probability * 100).toFixed(0)}% Probability
                    </Badge>
                    <Badge className={
                      risk.severity === "high" ? "bg-red-600" : 
                      risk.severity === "medium" ? "bg-orange-500" : "bg-green-500"
                    }>
                      {risk.severity.toUpperCase()}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-gray-700">{risk.description}</p>
                <div className="mt-3 p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Mitigation Strategies</p>
                  <Button size="sm" variant="outline" className="w-full">
                    View Recommendations
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Scenarios */}
        <TabsContent value="scenarios" className="space-y-4 mt-0">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 md:p-4">
            <h4 className="font-medium text-gray-900 mb-1">Scenario Planning</h4>
            <p className="text-sm text-gray-700">
              Compare different farming strategies and choose the best approach for your goals
            </p>
          </div>

          {scenarios.map((scenario: any, idx: number) => (
            <Card key={idx} className={scenario.selected ? "border-2 border-green-500 bg-green-50" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg md:text-xl flex items-center justify-between">
                  <span>{scenario.name}</span>
                  {scenario.selected && <Badge className="bg-green-600">Current</Badge>}
                </CardTitle>
                <CardDescription>{scenario.inputs}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Expected Yield</p>
                    <p className="font-bold text-green-600">{scenario.yield}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Profit</p>
                    <p className="font-bold text-gray-900">{scenario.profit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Risk Level</p>
                    <Badge variant={
                      scenario.risk === "High" ? "destructive" : 
                      scenario.risk === "Medium" ? "secondary" : "default"
                    }>
                      {scenario.risk}
                    </Badge>
                  </div>
                </div>
                {!scenario.selected && (
                  <Button className="w-full mt-3" variant="outline" size="sm">
                    Switch to This Scenario
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}