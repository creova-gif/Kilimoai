/**
 * KILIMO Demo Mode Control Panel
 * Pre-Authentication Feature Testing & Simulation Environment
 * 
 * CRITICAL RULES:
 * - NO UI modification of existing components
 * - Session-scoped state only (no backend writes)
 * - JSON output format
 * - Virtual feature overrides
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Play,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Database,
  Globe,
  Brain,
  Layers,
  Code,
  Zap,
  Shield,
  Users,
  FileJson,
  LogOut,
  Monitor,
  Smartphone,
  Activity,
  BarChart3,
  Leaf,
  Sprout,
  Package,
  DollarSign,
  Map,
  BookOpen,
  MessageSquare,
  Camera,
  Mic,
  ShoppingCart,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import {
  isDemoMode,
  initializeDemoMode,
  getDemoModeState,
  setDemoRole,
  toggleDemoFeature,
  setDemoFeatures,
  setDemoLanguage,
  updateDemoAIProfile,
  loadDemoMockData,
  resetDemoMode,
  exitDemoMode,
  exportDemoModeConfig,
  importDemoModeConfig,
  validateDemoUI,
  logDemoAction,
  type DemoModeState,
} from "../utils/demoMode";
import {
  generateCompleteMockData,
  generateCooperativeData,
  generateAgribusinessData,
} from "../utils/mockDataGenerator";
import {
  getAllFeatures,
  getRoleById,
} from "../utils/roleBasedAccess_helper";
import {
  getRoleFeatures,
  type FeatureId,
} from "../utils/roleBasedAccess";

interface DemoModeControlPanelProps {
  onLaunchDemo: (state: DemoModeState) => void;
  language?: "en" | "sw";
}

export function DemoModeControlPanel({ onLaunchDemo, language = "en" }: DemoModeControlPanelProps) {
  const [demoState, setDemoState] = useState<DemoModeState | null>(null);
  const [selectedRole, setSelectedRole] = useState("smallholder_farmer");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "sw">(language);
  const [uiValidation, setUiValidation] = useState<{ status: string; issues: string[] }>({
    status: "valid",
    issues: [],
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isDemoMode()) {
      const initialState = initializeDemoMode();
      setDemoState(initialState);
    } else {
      const state = getDemoModeState();
      setDemoState(state);
      if (state) {
        setSelectedRole(state.active_role);
        setSelectedLanguage(state.language);
      }
    }
  }, []);

  useEffect(() => {
    // Listen for demo mode updates
    const handleUpdate = (event: any) => {
      setDemoState(event.detail);
    };

    window.addEventListener("demo-mode-update", handleUpdate);
    return () => window.removeEventListener("demo-mode-update", handleUpdate);
  }, []);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    const newState = setDemoRole(role);
    setDemoState(newState);
    
    // Auto-load role default features
    const roleConfig = getRoleById(role);
    if (roleConfig) {
      const roleFeatures = getRoleFeatures(role);
      const featureState = setDemoFeatures(roleFeatures);
      setDemoState(featureState);
    }
    
    logDemoAction("role_changed", { role });
    toast.success(`Role changed to: ${role.replace(/_/g, " ")}`);
  };

  const handleLanguageChange = (lang: "en" | "sw") => {
    setSelectedLanguage(lang);
    const newState = setDemoLanguage(lang);
    setDemoState(newState);
    logDemoAction("language_changed", { language: lang });
    toast.success(`Language: ${lang === "en" ? "English" : "Swahili"}`);
  };

  const handleFeatureToggle = (feature: FeatureId) => {
    const newState = toggleDemoFeature(feature);
    setDemoState(newState);
    logDemoAction("feature_toggled", { feature });
  };

  const handleLoadMockData = () => {
    let mockData;
    
    if (selectedRole === "cooperative_leader") {
      mockData = {
        ...generateCompleteMockData(selectedRole),
        ...generateCooperativeData(),
      };
    } else if (selectedRole === "agribusiness") {
      mockData = {
        ...generateCompleteMockData(selectedRole),
        ...generateAgribusinessData(),
      };
    } else {
      mockData = generateCompleteMockData(selectedRole);
    }
    
    const newState = loadDemoMockData(mockData);
    setDemoState(newState);
    logDemoAction("mock_data_loaded", { role: selectedRole });
    toast.success("Mock data loaded successfully!", {
      description: `Generated Tanzania farm data for ${selectedRole}`,
    });
  };

  const handleAIProfileChange = (updates: Partial<DemoModeState["ai_profile"]>) => {
    const newState = updateDemoAIProfile(updates);
    setDemoState(newState);
    logDemoAction("ai_profile_updated", updates);
  };

  const handleValidateUI = () => {
    const validation = validateDemoUI();
    setUiValidation(validation);
    logDemoAction("ui_validated", validation);
    
    if (validation.status === "valid") {
      toast.success("UI validation passed!", { description: "No issues detected" });
    } else {
      toast.warning(`UI issues detected: ${validation.issues.length}`, {
        description: validation.issues[0] || "Check audit tab",
      });
    }
  };

  const handleReset = () => {
    const newState = resetDemoMode();
    setDemoState(newState);
    setSelectedRole("smallholder_farmer");
    setSelectedLanguage("en");
    logDemoAction("demo_reset");
    toast.info("Demo mode reset to defaults");
  };

  const handleExport = () => {
    const config = exportDemoModeConfig();
    const blob = new Blob([config], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kilimo-demo-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logDemoAction("config_exported");
    toast.success("Configuration exported!");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const imported = importDemoModeConfig(content);
      
      if (imported) {
        setDemoState(imported);
        setSelectedRole(imported.active_role);
        setSelectedLanguage(imported.language);
        logDemoAction("config_imported");
        toast.success("Configuration imported!");
      } else {
        toast.error("Failed to import configuration");
      }
    };
    reader.readAsText(file);
  };

  const handleLaunchDemo = () => {
    if (!demoState) return;
    
    if (!demoState.mock_data.loaded) {
      toast.warning("Please load mock data first", {
        description: "Click 'Load Mock Data' button",
      });
      return;
    }
    
    logDemoAction("demo_launched", { role: selectedRole, language: selectedLanguage });
    onLaunchDemo(demoState);
  };

  const handleExit = () => {
    exitDemoMode();
    logDemoAction("demo_exited");
    toast.info("Exited demo mode");
    window.location.reload();
  };

  if (!demoState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Database className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
          <p>Initializing Demo Mode...</p>
        </div>
      </div>
    );
  }

  const allFeatures = getAllFeatures();
  const roleConfig = getRoleById(selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-stone-800 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Settings className="h-8 w-8" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold">KILIMO Demo Mode Control Panel</h1>
                <p className="text-green-100 mt-1">Pre-Authentication Feature Sandbox</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-yellow-500 text-yellow-950 border-0">
                <AlertTriangle className="h-3 w-3 mr-1" />
                PRE-AUTH SANDBOX
              </Badge>
              <Badge className="bg-white/20 border-0">
                Session: {demoState.session_id.slice(-8)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex gap-3">
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-64">
                <Users className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smallholder_farmer">Smallholder Farmer</SelectItem>
                <SelectItem value="farmer_manager">Farmer Manager</SelectItem>
                <SelectItem value="commercial_farm_admin">Commercial Farm Admin</SelectItem>
                <SelectItem value="agribusiness">Agribusiness Operations</SelectItem>
                <SelectItem value="extension_officer">Extension Officer / NGO</SelectItem>
                <SelectItem value="cooperative_leader">Cooperative Leader</SelectItem>
                <SelectItem value="system_admin">System Admin</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <Globe className="h-4 w-4 text-gray-600" />
              <button
                onClick={() => handleLanguageChange("en")}
                className={`px-3 py-1 rounded ${
                  selectedLanguage === "en" ? "bg-green-600 text-white" : "text-gray-600"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange("sw")}
                className={`px-3 py-1 rounded ${
                  selectedLanguage === "sw" ? "bg-green-600 text-white" : "text-gray-600"
                }`}
              >
                SW
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleLoadMockData}>
              <Database className="h-4 w-4 mr-2" />
              Load Mock Data
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <label>
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </span>
              </Button>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleLaunchDemo} className="bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4 mr-2" />
              Launch Demo
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExit}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Role</p>
                  <p className="text-lg font-bold">
                    {selectedRole.replace(/_/g, " ").toUpperCase()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Enabled Features</p>
                  <p className="text-lg font-bold">{demoState.enabled_features.length}</p>
                </div>
                <Layers className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mock Data</p>
                  <p className="text-lg font-bold">
                    {demoState.mock_data.loaded ? "Loaded" : "Not Loaded"}
                  </p>
                </div>
                {demoState.mock_data.loaded ? (
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-gray-400" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">UI Status</p>
                  <p className="text-lg font-bold capitalize">{demoState.ui_status}</p>
                </div>
                {demoState.ui_status === "valid" ? (
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                ) : demoState.ui_status === "warning" ? (
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Card className="border-2">
          <Tabs defaultValue="features" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="features">
                  <Layers className="h-4 w-4 mr-2" />
                  Features
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Profile
                </TabsTrigger>
                <TabsTrigger value="data">
                  <Database className="h-4 w-4 mr-2" />
                  Mock Data
                </TabsTrigger>
                <TabsTrigger value="audit">
                  <Eye className="h-4 w-4 mr-2" />
                  UI Audit
                </TabsTrigger>
                <TabsTrigger value="config">
                  <Code className="h-4 w-4 mr-2" />
                  Config JSON
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              {/* Features Tab */}
              <TabsContent value="features" className="space-y-4">
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    Toggle features to simulate different role capabilities. Changes are
                    session-scoped only.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Feature Matrix</h3>
                    <p className="text-sm text-gray-600">
                      {demoState.enabled_features.length} of {allFeatures.length} features enabled
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const roleFeatures = getRoleFeatures(selectedRole);
                        setDemoFeatures(roleFeatures);
                        setDemoState(getDemoModeState());
                        toast.success("Loaded role default features");
                      }}
                    >
                      Load Role Defaults
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setDemoFeatures(allFeatures);
                        setDemoState(getDemoModeState());
                        toast.success("Enabled all features");
                      }}
                    >
                      Enable All
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setDemoFeatures([]);
                        setDemoState(getDemoModeState());
                        toast.success("Disabled all features");
                      }}
                    >
                      Disable All
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-[500px] pr-4">
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {allFeatures.map((feature) => {
                      const isEnabled = demoState.enabled_features.includes(feature);
                      const featureIcon = getFeatureIcon(feature);
                      
                      return (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <Card
                            className={`border-2 transition-colors cursor-pointer ${
                              isEnabled
                                ? "border-green-300 bg-green-50"
                                : "border-gray-200 bg-white"
                            }`}
                            onClick={() => handleFeatureToggle(feature)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {featureIcon}
                                  <span className="text-sm font-medium truncate">
                                    {feature.replace(/_/g, " ")}
                                  </span>
                                </div>
                                <Switch
                                  checked={isEnabled}
                                  onCheckedChange={() => handleFeatureToggle(feature)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* AI Profile Tab */}
              <TabsContent value="ai" className="space-y-6">
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    Configure AI behavior for this demo session. Changes affect AI response tone,
                    depth, and technical complexity.
                  </AlertDescription>
                </Alert>

                <div className="space-y-6">
                  {/* Verbosity */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">AI Verbosity</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["low", "medium", "high"] as const).map((level) => (
                        <Button
                          key={level}
                          variant={demoState.ai_profile.verbosity === level ? "default" : "outline"}
                          onClick={() => handleAIProfileChange({ verbosity: level })}
                          className="capitalize"
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Tone */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">AI Tone</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["advisory", "operational", "strategic"] as const).map((tone) => (
                        <Button
                          key={tone}
                          variant={demoState.ai_profile.tone === tone ? "default" : "outline"}
                          onClick={() => handleAIProfileChange({ tone })}
                          className="capitalize"
                        >
                          {tone}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Risk Tolerance */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Risk Tolerance</label>
                      <span className="text-sm text-gray-600">
                        {demoState.ai_profile.riskTolerance.toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      value={[demoState.ai_profile.riskTolerance * 100]}
                      onValueChange={(value) =>
                        handleAIProfileChange({ riskTolerance: value[0] / 100 })
                      }
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Conservative</span>
                      <span>Aggressive</span>
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">AI Temperature</label>
                      <span className="text-sm text-gray-600">
                        {demoState.ai_profile.temperature.toFixed(2)}
                      </span>
                    </div>
                    <Slider
                      value={[demoState.ai_profile.temperature * 100]}
                      onValueChange={(value) =>
                        handleAIProfileChange({ temperature: value[0] / 100 })
                      }
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Deterministic</span>
                      <span>Creative</span>
                    </div>
                  </div>

                  {/* Max Tokens */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Max Tokens</label>
                      <span className="text-sm text-gray-600">
                        {demoState.ai_profile.maxTokens}
                      </span>
                    </div>
                    <Slider
                      value={[demoState.ai_profile.maxTokens]}
                      onValueChange={(value) => handleAIProfileChange({ maxTokens: value[0] })}
                      min={100}
                      max={2000}
                      step={100}
                      className="w-full"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Mock Data Tab */}
              <TabsContent value="data" className="space-y-4">
                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    Mock data is generated based on Tanzania agricultural context with realistic
                    crops, regions, and financial transactions.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Mock Data Status</h3>
                    <p className="text-sm text-gray-600">
                      {demoState.mock_data.loaded ? "Data loaded successfully" : "No data loaded"}
                    </p>
                  </div>
                  <Button onClick={handleLoadMockData}>
                    <Database className="h-4 w-4 mr-2" />
                    Generate New Data
                  </Button>
                </div>

                {demoState.mock_data.loaded && demoState.mock_data.farmData && (
                  <div className="space-y-4">
                    <Separator />
                    
                    {/* User Info */}
                    <Card className="border-2 bg-gradient-to-br from-green-50 to-white">
                      <CardHeader>
                        <CardTitle className="text-lg">Simulated User</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Name:</span>
                            <span className="ml-2 font-medium">
                              {demoState.mock_data.farmData.user?.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Role:</span>
                            <span className="ml-2 font-medium capitalize">
                              {demoState.mock_data.farmData.user?.role?.replace(/_/g, " ")}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Phone:</span>
                            <span className="ml-2 font-medium">
                              {demoState.mock_data.farmData.user?.phone}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Region:</span>
                            <span className="ml-2 font-medium">
                              {demoState.mock_data.farmData.farm?.location?.region}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Farm Info */}
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle className="text-lg">Farm Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Size:</span>
                            <span className="ml-2 font-medium">
                              {demoState.mock_data.farmData.farm?.totalArea} hectares
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Type:</span>
                            <span className="ml-2 font-medium">
                              {demoState.mock_data.farmData.farm?.type}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Crops:</span>
                            <span className="ml-2 font-medium">
                              {demoState.mock_data.farmData.crops?.length || 0}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Livestock:</span>
                            <span className="ml-2 font-medium">
                              {demoState.mock_data.farmData.livestock?.length || 0}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {!demoState.mock_data.loaded && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No mock data loaded</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Click "Generate New Data" to create demo data
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* UI Audit Tab */}
              <TabsContent value="audit" className="space-y-4">
                <Alert>
                  <Eye className="h-4 w-4" />
                  <AlertDescription>
                    Validate UI consistency, branding compliance, and component integrity.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">UI Validation</h3>
                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          demoState.ui_status === "valid"
                            ? "text-green-600"
                            : demoState.ui_status === "warning"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {demoState.ui_status.toUpperCase()}
                      </span>
                    </p>
                  </div>
                  <Button onClick={handleValidateUI}>
                    <Activity className="h-4 w-4 mr-2" />
                    Run Validation
                  </Button>
                </div>

                {demoState.issues_detected.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Issues Detected:</h4>
                    {demoState.issues_detected.map((issue, index) => (
                      <Alert key={index} className="border-l-4 border-l-yellow-500">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{issue}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <Alert className="border-l-4 border-l-green-500">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>No UI issues detected. All systems nominal.</AlertDescription>
                  </Alert>
                )}

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Responsive Testing</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start">
                      <Monitor className="h-4 w-4 mr-2" />
                      Desktop View (1920x1080)
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Mobile View (375x667)
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Config JSON Tab */}
              <TabsContent value="config" className="space-y-4">
                <Alert>
                  <FileJson className="h-4 w-4" />
                  <AlertDescription>
                    View and export the complete demo configuration as JSON. This can be imported
                    later to reproduce the exact demo state.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Configuration Output</h3>
                  <Button size="sm" onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(demoState, null, 2));
                    toast.success("Copied to clipboard");
                  }}>
                    Copy to Clipboard
                  </Button>
                </div>

                <ScrollArea className="h-[500px] w-full rounded-lg border-2 bg-gray-50 p-4">
                  <pre className="text-xs font-mono">
                    {JSON.stringify(demoState, null, 2)}
                  </pre>
                </ScrollArea>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Warning Footer */}
        <Alert className="border-2 border-yellow-500 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-900">
            <strong>Demo Mode Active:</strong> All changes are session-scoped and will not persist
            to production. No backend writes occur. Exit demo mode to return to normal operation.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

// Helper function to get feature icon
function getFeatureIcon(feature: FeatureId) {
  const iconMap: Record<string, any> = {
    crop_planning: <Leaf className="h-4 w-4 text-green-600" />,
    livestock_management: <Sprout className="h-4 w-4 text-brown-600" />,
    farm_finance: <DollarSign className="h-4 w-4 text-blue-600" />,
    marketplace: <ShoppingCart className="h-4 w-4 text-purple-600" />,
    analytics_dashboard: <BarChart3 className="h-4 w-4 text-indigo-600" />,
    ai_chatbot: <MessageSquare className="h-4 w-4 text-pink-600" />,
    photo_diagnosis: <Camera className="h-4 w-4 text-orange-600" />,
    voice_assistant: <Mic className="h-4 w-4 text-red-600" />,
    farm_mapping: <Map className="h-4 w-4 text-teal-600" />,
    knowledge_base: <BookOpen className="h-4 w-4 text-cyan-600" />,
  };

  return iconMap[feature] || <Activity className="h-4 w-4 text-gray-600" />;
}