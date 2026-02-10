import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Calendar,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface YieldForecast {
  id: string;
  cropName: string;
  farmSize: number;
  region: string;
  forecastedYield: number;
  historicalYield: number;
  yieldImprovement: number;
  confidence: number;
  factors: {
    weather: "positive" | "neutral" | "negative";
    soilHealth: "good" | "fair" | "poor";
    pestPressure: "low" | "medium" | "high";
    inputQuality: "high" | "medium" | "low";
  };
  revenue: {
    pessimistic: number;
    realistic: number;
    optimistic: number;
    estimatedPrice: number;
  };
  recommendations: string[];
  generatedDate: string;
}

interface YieldForecastingProps {
  userId: string;
  userRole: string;
}

export function YieldForecasting({ userId, userRole }: YieldForecastingProps) {
  const [forecasts, setForecasts] = useState<YieldForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadForecasts();
  }, [userId]);

  const loadForecasts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/yield-forecasts/${userId}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      const data = await response.json();
      if (data.success) {
        setForecasts(data.forecasts || []);
      }
    } catch (error) {
      console.error("Error loading forecasts:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewForecast = async () => {
    setGenerating(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/yield-forecasts/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ userId })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setForecasts([data.forecast, ...forecasts]);
      } else {
        alert(data.error || "Failed to generate forecast");
      }
    } catch (error) {
      console.error("Error generating forecast:", error);
      alert("Failed to generate forecast");
    } finally {
      setGenerating(false);
    }
  };

  const getFactorColor = (value: string) => {
    if (value === "positive" || value === "good" || value === "low" || value === "high") {
      return "text-green-600 bg-green-100";
    } else if (value === "neutral" || value === "fair" || value === "medium") {
      return "text-yellow-600 bg-yellow-100";
    } else {
      return "text-red-600 bg-red-100";
    }
  };

  const totalRevenue = forecasts.reduce((sum, f) => sum + f.revenue.realistic, 0);
  const avgYieldImprovement = forecasts.length > 0 
    ? forecasts.reduce((sum, f) => sum + f.yieldImprovement, 0) / forecasts.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-gray-600" />
            AI Yield & Revenue Forecasting
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Predictive analytics for crop yields and revenue projections
          </p>
        </div>
        <Button onClick={generateNewForecast} disabled={generating} className="bg-[#2E7D32]">
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Forecast
            </>
          )}
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Forecasted Revenue</p>
                <p className="text-xl font-bold text-green-600">
                  TZS {totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Avg. Yield Improvement</p>
                <p className="text-xl font-bold text-gray-800 flex items-center gap-1">
                  {avgYieldImprovement > 0 && <TrendingUp className="h-4 w-4" />}
                  {avgYieldImprovement.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Active Forecasts</p>
                <p className="text-xl font-bold">{forecasts.length}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Avg. Confidence</p>
                <p className="text-xl font-bold text-gray-800">
                  {forecasts.length > 0 
                    ? (forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length).toFixed(0)
                    : 0}%
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecasts List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        </div>
      ) : forecasts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-semibold mb-2">No forecasts yet</h3>
            <p className="text-sm text-gray-600 mb-4">
              Generate your first AI-powered yield forecast
            </p>
            <Button onClick={generateNewForecast} className="bg-[#2E7D32]">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate First Forecast
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {forecasts.map(forecast => (
            <Card key={forecast.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-gray-600" />
                      {forecast.cropName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span>{forecast.region}</span>
                      <span>{forecast.farmSize} acres</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(forecast.generatedDate).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800">
                    {forecast.confidence}% Confidence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Yield Comparison */}
                <div className="grid md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Historical Yield</p>
                    <p className="text-2xl font-bold text-gray-600">
                      {forecast.historicalYield} tons
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Forecasted Yield</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {forecast.forecastedYield} tons
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Improvement</p>
                    <p className={`text-2xl font-bold flex items-center gap-1 ${
                      forecast.yieldImprovement > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {forecast.yieldImprovement > 0 ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                      {forecast.yieldImprovement > 0 ? "+" : ""}{forecast.yieldImprovement}%
                    </p>
                  </div>
                </div>

                {/* Contributing Factors */}
                <div>
                  <h4 className="font-semibold text-sm mb-3">Contributing Factors</h4>
                  <div className="grid md:grid-cols-4 gap-3">
                    <div className="text-center p-3 border rounded">
                      <p className="text-xs text-gray-600 mb-2">Weather Impact</p>
                      <Badge className={getFactorColor(forecast.factors.weather)}>
                        {forecast.factors.weather}
                      </Badge>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-xs text-gray-600 mb-2">Soil Health</p>
                      <Badge className={getFactorColor(forecast.factors.soilHealth)}>
                        {forecast.factors.soilHealth}
                      </Badge>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-xs text-gray-600 mb-2">Pest Pressure</p>
                      <Badge className={getFactorColor(forecast.factors.pestPressure)}>
                        {forecast.factors.pestPressure}
                      </Badge>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-xs text-gray-600 mb-2">Input Quality</p>
                      <Badge className={getFactorColor(forecast.factors.inputQuality)}>
                        {forecast.factors.inputQuality}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Revenue Scenarios */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Revenue Projections (@ TZS {forecast.revenue.estimatedPrice.toLocaleString()}/ton)
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600 mb-1">Pessimistic</p>
                      <p className="text-lg font-bold text-red-600">
                        TZS {forecast.revenue.pessimistic.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">70% probability</p>
                    </div>
                    <div className="bg-white p-3 rounded border-2 border-green-300">
                      <p className="text-xs text-gray-600 mb-1">Most Likely</p>
                      <p className="text-lg font-bold text-green-600">
                        TZS {forecast.revenue.realistic.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Expected outcome</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600 mb-1">Optimistic</p>
                      <p className="text-lg font-bold text-gray-800">
                        TZS {forecast.revenue.optimistic.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Best case scenario</p>
                    </div>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-gray-600" />
                    AI Recommendations to Maximize Yield
                  </h4>
                  <div className="space-y-2">
                    {forecast.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded text-sm">
                        <AlertCircle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}