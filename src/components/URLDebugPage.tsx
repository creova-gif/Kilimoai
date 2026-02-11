/**
 * ============================================================================
 * URL DEBUGGING PAGE
 * ============================================================================
 * This component displays exactly what URLs are being constructed
 * ============================================================================
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { API_BASE_URL, TasksAPI } from "../utils/apiUtils";

export function URLDebugPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const results = [];

    // Test 1: Check projectId
    results.push({
      name: "Project ID Check",
      status: projectId ? "pass" : "fail",
      message: `projectId = "${projectId}"`,
      details: `Type: ${typeof projectId}, Length: ${projectId?.length || 0}`
    });

    // Test 2: Check API_BASE_URL
    const hasHttps = API_BASE_URL.startsWith("https://");
    const hasFunctionsPath = API_BASE_URL.includes("/functions/v1");
    const hasServerName = API_BASE_URL.includes("make-server-ce1844e7");
    
    results.push({
      name: "API_BASE_URL Check",
      status: (hasHttps && hasFunctionsPath && hasServerName) ? "pass" : "fail",
      message: API_BASE_URL,
      details: `HTTPS: ${hasHttps}, /functions/v1: ${hasFunctionsPath}, Server: ${hasServerName}`
    });

    // Test 3: Check URL Construction
    const testUrl = `${API_BASE_URL}/tasks?userId=test-user`;
    results.push({
      name: "Sample URL Construction",
      status: testUrl.startsWith("https://") && testUrl.includes("/functions/v1") ? "pass" : "fail",
      message: testUrl,
      details: `This is what fetch() will use`
    });

    // Test 4: Try actual API call
    try {
      console.log("🧪 [DEBUG] About to call TasksAPI.getTasks('test-user')");
      await TasksAPI.getTasks("test-user");
      results.push({
        name: "API Call Test",
        status: "pass",
        message: "API call completed (may be 404 if endpoint not deployed, but URL is correct)",
        details: "Check Network tab in DevTools to verify URL"
      });
    } catch (error: any) {
      results.push({
        name: "API Call Test",
        status: error.message.includes("404") ? "warning" : "fail",
        message: error.message,
        details: "404 is OK if backend not deployed. Check Network tab for actual URL used."
      });
    }

    setTestResults(results);
    setTesting(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Card className="border-[#2E7D32]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-[#2E7D32]" />
            URL Debug Console
          </CardTitle>
          <p className="text-sm text-gray-600">
            This page shows exactly what URLs are being constructed for API calls
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runTests} 
            disabled={testing}
            className="bg-[#2E7D32] hover:bg-[#1B5E20]"
          >
            {testing ? "Testing..." : "Run Tests"}
          </Button>

          <div className="space-y-3">
            {testResults.map((result, idx) => (
              <Card key={idx} className={`border-2 ${
                result.status === "pass" ? "border-green-500 bg-green-50" :
                result.status === "warning" ? "border-yellow-500 bg-yellow-50" :
                "border-red-500 bg-red-50"
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {result.status === "pass" && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                    {result.status === "warning" && <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                    {result.status === "fail" && <XCircle className="h-5 w-5 text-red-600 mt-0.5" />}
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{result.name}</h4>
                      <Badge className={
                        result.status === "pass" ? "bg-green-600" :
                        result.status === "warning" ? "bg-yellow-600" :
                        "bg-red-600"
                      }>
                        {result.status.toUpperCase()}
                      </Badge>
                      <p className="text-xs font-mono mt-2 p-2 bg-white rounded border break-all">
                        {result.message}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {result.details}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gray-100">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2">What to Check:</h4>
              <ul className="text-xs space-y-1 text-gray-700">
                <li>1. All tests should show <Badge className="bg-green-600 text-white">PASS</Badge></li>
                <li>2. URLs should start with <code className="bg-white px-1 py-0.5 rounded">https://</code></li>
                <li>3. URLs should contain <code className="bg-white px-1 py-0.5 rounded">/functions/v1</code></li>
                <li>4. Open DevTools → Network tab → Look for the /tasks request</li>
                <li>5. Click on the request → Check "Request URL" in Headers</li>
                <li>6. If you see <code className="bg-white px-1 py-0.5 rounded text-red-600">http://</code> anywhere, your browser cache is stale</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2 text-blue-900">Console Logs to Check:</h4>
              <p className="text-xs text-blue-800 mb-2">
                Open DevTools Console (F12) and look for these logs:
              </p>
              <ul className="text-xs space-y-1 text-blue-700 font-mono">
                <li>🔧 [API UTILS] Module imported!</li>
                <li>✅ [API UTILS] API_BASE_URL successfully set to: https://...</li>
                <li>🎉 [API UTILS] Initialization complete!</li>
                <li>🔵 [TASKS] About to call TasksAPI.getTasks...</li>
                <li>[KILIMO API] GET https://...</li>
              </ul>
              <p className="text-xs text-blue-800 mt-2">
                If you DON'T see these logs, your browser is running OLD cached JavaScript!
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
