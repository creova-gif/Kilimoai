import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface TestResult {
  name: string;
  status: "pending" | "success" | "warning" | "error";
  message?: string;
  duration?: number;
}

export function SystemDiagnostics() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  
  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

  const tests = [
    {
      name: "API Health Check",
      endpoint: `${API_BASE}/health`,
      method: "GET",
    },
    {
      name: "AI Crop Plan",
      endpoint: `${API_BASE}/api/ai/crop-plan`,
      method: "POST",
      body: {
        user_id: "test-user",
        crop: "Maize",
        season: "2025 Masika",
        location: "Morogoro",
        field_size_ha: 5,
        soil_data: { ph: 6.0, nitrogen: "medium" }
      }
    },
    {
      name: "Market Prices",
      endpoint: `${API_BASE}/market/prices/Dodoma`,
      method: "GET",
    },
    {
      name: "Weather API",
      endpoint: `${API_BASE}/weather/Morogoro`,
      method: "GET",
    },
    {
      name: "AI Yield Forecast",
      endpoint: `${API_BASE}/api/ai/yield-forecast`,
      method: "POST",
      body: {
        user_id: "test-user",
        crop_plan_id: "test-plan",
        current_yield_estimate: 5000,
        market_price_tzs: 1300,
        input_cost: 450000
      }
    },
    {
      name: "User Registration",
      endpoint: `${API_BASE}/register`,
      method: "POST",
      body: {
        name: "Test User",
        phone: "+255700000000",
        password: "testpass123",
        region: "Dodoma",
        crops: ["Maize"],
        farmSize: "5",
        userType: "farmer"
      }
    }
  ];

  const runTests = async () => {
    setTesting(true);
    setResults([]);
    const newResults: TestResult[] = [];

    for (const test of tests) {
      const startTime = Date.now();
      
      // Set pending
      newResults.push({ name: test.name, status: "pending" });
      setResults([...newResults]);

      try {
        const options: RequestInit = {
          method: test.method,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
          },
        };

        if (test.body) {
          options.body = JSON.stringify(test.body);
        }

        const response = await fetch(test.endpoint, options);
        const duration = Date.now() - startTime;
        
        if (response.ok) {
          const data = await response.json();
          newResults[newResults.length - 1] = {
            name: test.name,
            status: "success",
            message: `✓ ${duration}ms`,
            duration
          };
        } else if (response.status === 400 && test.name === "User Registration") {
          // Registration might fail if user exists - that's OK
          newResults[newResults.length - 1] = {
            name: test.name,
            status: "warning",
            message: "User exists (OK)",
            duration
          };
        } else {
          const error = await response.text();
          newResults[newResults.length - 1] = {
            name: test.name,
            status: "error",
            message: `${response.status}: ${error.substring(0, 50)}`,
            duration
          };
        }
      } catch (error: any) {
        newResults[newResults.length - 1] = {
          name: test.name,
          status: "error",
          message: error.message || "Network error",
          duration: Date.now() - startTime
        };
      }

      setResults([...newResults]);
    }

    setTesting(false);
    
    const successCount = newResults.filter(r => r.status === "success" || r.status === "warning").length;
    const totalCount = newResults.length;
    
    if (successCount === totalCount) {
      toast.success(`All ${totalCount} tests passed!`);
    } else {
      toast.error(`${successCount}/${totalCount} tests passed`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "pending":
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Pass</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Fail</Badge>;
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">Testing...</Badge>;
    }
  };

  const successCount = results.filter(r => r.status === "success" || r.status === "warning").length;
  const errorCount = results.filter(r => r.status === "error").length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 pb-24 lg:pb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔧 System Diagnostics
          </CardTitle>
          <CardDescription>
            Test all API endpoints and backend services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={runTests} 
              disabled={testing}
              className="bg-green-600 hover:bg-green-700"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>

            {results.length > 0 && (
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">{successCount} passed</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">{errorCount} failed</span>
                </div>
              </div>
            )}
          </div>

          {/* Test Results */}
          <div className="space-y-2">
            {results.map((result, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border bg-white"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{result.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {result.message && (
                    <span className="text-sm text-gray-600">{result.message}</span>
                  )}
                  {getStatusBadge(result.status)}
                </div>
              </div>
            ))}
          </div>

          {results.length === 0 && !testing && (
            <div className="text-center py-8 text-gray-500">
              Click "Run All Tests" to check system health
            </div>
          )}

          {/* API Configuration */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm">API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base URL:</span>
                <span className="font-mono text-xs">{API_BASE}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Project ID:</span>
                <span className="font-mono text-xs">{projectId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Auth Token:</span>
                <span className="font-mono text-xs">{publicAnonKey.substring(0, 20)}...</span>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Quick Fix Guide */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800 text-sm">Common Issues & Fixes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-orange-900">❌ If Health Check fails:</p>
            <p className="text-orange-700 ml-4">• Supabase Edge Function is not deployed</p>
            <p className="text-orange-700 ml-4">• Check environment variables</p>
          </div>
          <div>
            <p className="font-medium text-orange-900">❌ If AI endpoints fail:</p>
            <p className="text-orange-700 ml-4">• OPENROUTER_API_KEY not set</p>
            <p className="text-orange-700 ml-4">• Check AI credits</p>
          </div>
          <div>
            <p className="font-medium text-orange-900">❌ If Weather/Market fails:</p>
            <p className="text-orange-700 ml-4">• OPENWEATHER_API_KEY not set</p>
            <p className="text-orange-700 ml-4">• External API down</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
