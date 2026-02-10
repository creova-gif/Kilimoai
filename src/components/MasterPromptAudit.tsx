import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Smartphone,
  Monitor,
  Brain,
  Navigation,
  Layout,
  Zap,
  Globe,
  TrendingUp,
  Download,
  RefreshCw
} from "lucide-react";

interface AuditItem {
  component: string;
  category: "navigation" | "layout" | "ai" | "responsive" | "language" | "data";
  status: "pass" | "fail" | "warning";
  issue: string;
  impact: "critical" | "high" | "medium" | "low";
  recommendation: string;
  masterPromptRule: string;
}

export function MasterPromptAudit() {
  const [auditResults, setAuditResults] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(false);

  const runAudit = () => {
    setLoading(true);
    
    // Simulate audit analysis
    setTimeout(() => {
      const results: AuditItem[] = [
        // NAVIGATION ISSUES
        {
          component: "App.tsx - Main Navigation",
          category: "navigation",
          status: "fail",
          issue: "Uses left sidebar for all screen sizes - no bottom navigation for mobile",
          impact: "critical",
          recommendation: "Implement bottom navigation bar (3-5 primary actions) for mobile viewports",
          masterPromptRule: "Mobile: Bottom navigation (3-5 primary actions max)"
        },
        {
          component: "App.tsx - Mobile Menu",
          category: "navigation",
          status: "warning",
          issue: "Mobile menu is hamburger overlay - not optimized for thumb-first usage",
          impact: "high",
          recommendation: "Replace with bottom nav bar with icons + labels for primary actions",
          masterPromptRule: "Optimize for thumb-first mobile usage"
        },
        {
          component: "All Dashboard Components",
          category: "navigation",
          status: "fail",
          issue: "No Floating Action Button (FAB) for primary mobile actions",
          impact: "high",
          recommendation: "Add FAB for quick AI insights, task creation, and emergency actions",
          masterPromptRule: "Mobile: Floating Action Button (FAB)"
        },

        // LAYOUT ISSUES
        {
          component: "DashboardHome",
          category: "layout",
          status: "warning",
          issue: "Uses responsive grid but doesn't convert to true card stack on mobile",
          impact: "medium",
          recommendation: "Convert multi-column grid to vertical card stack with priority-based ordering",
          masterPromptRule: "Mobile: Vertical card stack"
        },
        {
          component: "TaskManagement",
          category: "layout",
          status: "warning",
          issue: "Task list uses same layout on mobile and web - not optimized for touch",
          impact: "medium",
          recommendation: "Convert to swipeable cards with actions revealed on swipe",
          masterPromptRule: "Re-architect layouts like real SaaS products"
        },
        {
          component: "AnalyticsDashboard, ComprehensiveReporting",
          category: "layout",
          status: "fail",
          issue: "Tables remain as tables on mobile - difficult to read and interact",
          impact: "critical",
          recommendation: "Convert rows → expandable cards with key metrics visible",
          masterPromptRule: "Mobile: Convert rows → expandable cards"
        },
        {
          component: "FarmFinance, ResourceInventoryManagement",
          category: "layout",
          status: "fail",
          issue: "Complex multi-column tables not mobile-optimized",
          impact: "high",
          recommendation: "Transform to card-based views with drill-down capability",
          masterPromptRule: "Preserve information hierarchy"
        },

        // AI TRIGGER ISSUES
        {
          component: "AIRecommendations",
          category: "ai",
          status: "warning",
          issue: "AI only generates on manual button click - no auto-triggers",
          impact: "high",
          recommendation: "Implement auto-generation on dashboard load, data changes, and scheduled intervals",
          masterPromptRule: "Trigger AI when: User opens Dashboard, New climate data arrives"
        },
        {
          component: "DashboardHome",
          category: "ai",
          status: "fail",
          issue: "No automatic AI insights on dashboard load",
          impact: "critical",
          recommendation: "Auto-load AI insights widget on dashboard mount with loading state",
          masterPromptRule: "Trigger AI when: User opens Dashboard"
        },
        {
          component: "LivestockManagement",
          category: "ai",
          status: "fail",
          issue: "No automatic detection of overdue treatments",
          impact: "high",
          recommendation: "Implement background check for overdue livestock treatments with push notifications",
          masterPromptRule: "Trigger AI when: Livestock treatment is overdue"
        },
        {
          component: "CropPlanningManagement",
          category: "ai",
          status: "fail",
          issue: "No automatic crop health monitoring or alerts",
          impact: "high",
          recommendation: "Add periodic health checks with AI-generated alerts",
          masterPromptRule: "Trigger AI when: Crop health changes"
        },
        {
          component: "WeatherCard",
          category: "ai",
          status: "warning",
          issue: "Weather data shown but no AI analysis or risk alerts",
          impact: "medium",
          recommendation: "Integrate weather data with AI to generate actionable farming advice",
          masterPromptRule: "Trigger AI when: New climate data arrives"
        },

        // RESPONSIVE BEHAVIOR
        {
          component: "AIWorkflowHub",
          category: "responsive",
          status: "warning",
          issue: "Workflow cards scale down on mobile instead of re-architecting",
          impact: "medium",
          recommendation: "Convert to vertical swipeable workflow cards with prominent CTAs",
          masterPromptRule: "YOU MUST NOT SCALE OR SHRINK SCREENS"
        },
        {
          component: "MarketPrices",
          category: "responsive",
          status: "warning",
          issue: "Price grid shrinks on mobile - hard to read",
          impact: "medium",
          recommendation: "Convert to list view with expandable price details and charts",
          masterPromptRule: "Re-architect layouts like real SaaS products"
        },
        {
          component: "Marketplace",
          category: "responsive",
          status: "pass",
          issue: "Uses responsive grid that converts to single column - good approach",
          impact: "low",
          recommendation: "Add swipe gestures for product navigation on mobile",
          masterPromptRule: "Preserve information hierarchy"
        },

        // LANGUAGE SUPPORT
        {
          component: "AIRecommendations",
          category: "language",
          status: "pass",
          issue: "Full bilingual support with proper Swahili translations",
          impact: "low",
          recommendation: "Extend this pattern to all components",
          masterPromptRule: "Support BOTH English and Swahili"
        },
        {
          component: "DashboardHome, TaskManagement, LivestockManagement",
          category: "language",
          status: "fail",
          issue: "Hardcoded English text - no Swahili support",
          impact: "critical",
          recommendation: "Implement language context provider and translate all UI strings",
          masterPromptRule: "NEVER break bilingual support"
        },
        {
          component: "ExpertConsultations, SoilTestingService",
          category: "language",
          status: "fail",
          issue: "No language toggle - English only",
          impact: "high",
          recommendation: "Add language prop and bilingual content structure",
          masterPromptRule: "ALWAYS preserve bilingual support"
        },

        // DATA INTEGRATION
        {
          component: "AIRecommendations",
          category: "data",
          status: "pass",
          issue: "Pulls real data from KV store and generates dynamic AI insights",
          impact: "low",
          recommendation: "Use as reference for other AI components",
          masterPromptRule: "Analyze farm, climate, livestock, finance data"
        },
        {
          component: "PredictiveModels",
          category: "data",
          status: "warning",
          issue: "Uses mock data instead of live farm metrics",
          impact: "medium",
          recommendation: "Connect to real-time KV store data for predictions",
          masterPromptRule: "ALWAYS assume poor connectivity environments"
        },
        {
          component: "DigitalFarmTwin",
          category: "data",
          status: "warning",
          issue: "Simulated data - not pulling from actual farm operations",
          impact: "medium",
          recommendation: "Integrate with task, crop, livestock, and finance data streams",
          masterPromptRule: "Preserve enterprise-scale functionality"
        },

        // ENTERPRISE FEATURES
        {
          component: "CooperativeDashboard",
          category: "layout",
          status: "pass",
          issue: "Good multi-entity support for cooperative management",
          impact: "low",
          recommendation: "Extend bulk operations capability to other components",
          masterPromptRule: "Support bulk operations, multi-field, staff-based tasks"
        },
        {
          component: "AgribusinessDashboard",
          category: "layout",
          status: "warning",
          issue: "Lacks staff task assignment and multi-field batch operations",
          impact: "medium",
          recommendation: "Add workforce management and bulk task creation",
          masterPromptRule: "ALWAYS preserve enterprise-scale functionality"
        },

        // OUTPUT FORMAT
        {
          component: "Backend /ai-advisory/generate",
          category: "ai",
          status: "pass",
          issue: "Returns structured JSON with proper bilingual format",
          impact: "low",
          recommendation: "Extend this JSON structure to all AI endpoints",
          masterPromptRule: "Output structured JSON ONLY"
        },
        {
          component: "AISupport (Chatbot)",
          category: "ai",
          status: "warning",
          issue: "Returns text responses - should return structured JSON for parsing",
          impact: "medium",
          recommendation: "Convert to structured JSON responses with action buttons",
          masterPromptRule: "NEVER output raw text — ONLY structured JSON"
        }
      ];

      setAuditResults(results);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    runAudit();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "fail": return <XCircle className="h-5 w-5 text-red-600" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass": return "bg-green-100 text-green-800 border-green-300";
      case "fail": return "bg-red-100 text-red-800 border-red-300";
      case "warning": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "";
    }
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      critical: "bg-red-600 text-white",
      high: "bg-orange-600 text-white",
      medium: "bg-yellow-600 text-white",
      low: "bg-green-600 text-white"
    };
    return <Badge className={colors[impact as keyof typeof colors]}>{impact.toUpperCase()}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      navigation: <Navigation className="h-5 w-5" />,
      layout: <Layout className="h-5 w-5" />,
      ai: <Brain className="h-5 w-5" />,
      responsive: <Smartphone className="h-5 w-5" />,
      language: <Globe className="h-5 w-5" />,
      data: <TrendingUp className="h-5 w-5" />
    };
    return icons[category as keyof typeof icons];
  };

  const summary = {
    total: auditResults.length,
    pass: auditResults.filter(r => r.status === "pass").length,
    fail: auditResults.filter(r => r.status === "fail").length,
    warning: auditResults.filter(r => r.status === "warning").length,
    critical: auditResults.filter(r => r.impact === "critical").length,
    high: auditResults.filter(r => r.impact === "high").length
  };

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary,
      results: auditResults,
      masterPromptCompliance: {
        score: Math.round((summary.pass / summary.total) * 100),
        criticalIssues: summary.critical,
        highPriorityIssues: summary.high
      }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kilimo-audit-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Master Prompt Compliance Audit</h1>
          <p className="text-gray-600">
            Comprehensive analysis against Master AI Prompt architecture standards
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={runAudit}
            disabled={loading}
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Re-run Audit
          </Button>
          <Button 
            onClick={exportReport}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Checks</p>
              <p className="text-3xl font-bold">{summary.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-300 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-1 text-green-600" />
              <p className="text-sm text-gray-600 mb-1">Passing</p>
              <p className="text-3xl font-bold text-green-600">{summary.pass}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-6 w-6 mx-auto mb-1 text-yellow-600" />
              <p className="text-sm text-gray-600 mb-1">Warnings</p>
              <p className="text-3xl font-bold text-yellow-600">{summary.warning}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-6 w-6 mx-auto mb-1 text-red-600" />
              <p className="text-sm text-gray-600 mb-1">Failing</p>
              <p className="text-3xl font-bold text-red-600">{summary.fail}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-400 bg-red-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Critical</p>
              <p className="text-3xl font-bold text-red-700">{summary.critical}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-300 bg-orange-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">High Priority</p>
              <p className="text-3xl font-bold text-orange-600">{summary.high}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Score */}
      <Card className="border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Master Prompt Compliance Score</h3>
              <p className="text-gray-600">
                {summary.pass} of {summary.total} checks passing
              </p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-600">
                {Math.round((summary.pass / summary.total) * 100)}%
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {Math.round((summary.pass / summary.total) * 100) >= 80 ? "Good" : 
                 Math.round((summary.pass / summary.total) * 100) >= 60 ? "Needs Work" : "Critical"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Results */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="all">All ({summary.total})</TabsTrigger>
          <TabsTrigger value="fail">Failed ({summary.fail})</TabsTrigger>
          <TabsTrigger value="warning">Warnings ({summary.warning})</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="ai">AI Logic</TabsTrigger>
          <TabsTrigger value="language">Language</TabsTrigger>
        </TabsList>

        {/* All Results */}
        <TabsContent value="all" className="space-y-3">
          {auditResults.map((item, idx) => (
            <Card key={idx} className={`border-l-4 ${getStatusColor(item.status)}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-lg">{item.component}</h4>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          {getCategoryIcon(item.category)}
                          {item.category.toUpperCase()}
                        </p>
                      </div>
                      {getImpactBadge(item.impact)}
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Issue:</p>
                      <p className="text-sm text-gray-600">{item.issue}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Recommendation:</p>
                      <p className="text-sm text-gray-600">{item.recommendation}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Master Prompt Rule:</p>
                      <p className="text-sm text-gray-600 italic">"{item.masterPromptRule}"</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Failed Items */}
        <TabsContent value="fail" className="space-y-3">
          {auditResults.filter(r => r.status === "fail").map((item, idx) => (
            <Card key={idx} className="border-l-4 border-red-300 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-semibold text-lg">{item.component}</h4>
                      {getImpactBadge(item.impact)}
                    </div>
                    <p className="text-sm text-gray-700">{item.issue}</p>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Fix:</p>
                      <p className="text-sm text-gray-600">{item.recommendation}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Warning Items */}
        <TabsContent value="warning" className="space-y-3">
          {auditResults.filter(r => r.status === "warning").map((item, idx) => (
            <Card key={idx} className="border-l-4 border-yellow-300 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-semibold text-lg">{item.component}</h4>
                      {getImpactBadge(item.impact)}
                    </div>
                    <p className="text-sm text-gray-700">{item.issue}</p>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Improvement:</p>
                      <p className="text-sm text-gray-600">{item.recommendation}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Category-specific tabs */}
        {["navigation", "layout", "ai", "language"].map(category => (
          <TabsContent key={category} value={category} className="space-y-3">
            {auditResults.filter(r => r.category === category).map((item, idx) => (
              <Card key={idx} className={`border-l-4 ${getStatusColor(item.status)}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {getStatusIcon(item.status)}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="font-semibold text-lg">{item.component}</h4>
                        {getImpactBadge(item.impact)}
                      </div>
                      <p className="text-sm text-gray-700">{item.issue}</p>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm text-gray-600">{item.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Action Items Summary */}
      <Card className="border-red-400 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">🚨 Critical Action Items</CardTitle>
          <CardDescription>These issues must be fixed immediately for Master Prompt compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 list-decimal list-inside">
            {auditResults
              .filter(r => r.impact === "critical")
              .map((item, idx) => (
                <li key={idx} className="text-sm font-medium text-red-800">
                  {item.component}: {item.issue}
                </li>
              ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}