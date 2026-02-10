import { useState, useEffect } from "react";
import { Calendar, Sparkles, Download, RefreshCw, CheckCircle2, Clock, TrendingUp, AlertCircle, Info, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";

interface AIFarmPlanGeneratorProps {
  userId: string;
  region: string;
  crops: string[];
  farmSize: string;
  apiBase: string;
  authToken: string;
}

export function AIFarmPlanGenerator({ 
  userId, 
  region, 
  crops, 
  farmSize,
  apiBase, 
  authToken 
}: AIFarmPlanGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState((crops && crops.length > 0) ? crops[0] : "maize");
  const [selectedSeason, setSelectedSeason] = useState("2024/2025 Main Season");
  const [farmPlan, setFarmPlan] = useState<any>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Load existing plan on mount
  useEffect(() => {
    loadExistingPlan();
  }, [userId]);

  const loadExistingPlan = async () => {
    try {
      const response = await fetch(`${apiBase}/ai-farm-plan/list/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.plans && data.plans.length > 0) {
          // Load the most recent plan
          const latestPlan = data.plans[0];
          setPlanId(latestPlan.id);
          // Note: The list endpoint returns summary, not full plan
          // We'd need to add a get endpoint or generate fresh
        }
      }
    } catch (error) {
      console.log("No existing plans found");
    }
  };

  const generateNewPlan = async () => {
    setLoading(true);
    
    try {
      toast.info("🌱 Generating your personalized farm plan...", {
        description: "This may take a few seconds",
        duration: 3000,
      });

      const response = await fetch(`${apiBase}/ai-farm-plan/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          crop: selectedCrop,
          region,
          farmSize,
          season: selectedSeason
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFarmPlan(data.plan);
          setPlanId(data.planId);
          setAiGenerated(data.aiGenerated);
          
          toast.success(
            data.aiGenerated 
              ? "✨ AI-Powered Farm Plan Generated!" 
              : "📋 Farm Plan Created!",
            {
              description: data.aiGenerated 
                ? "Your plan was created using advanced AI technology" 
                : "Your plan is based on proven farming practices",
              duration: 4000,
            }
          );
          return;
        }
      }

      throw new Error("Failed to generate plan");
    } catch (error) {
      console.error("Error generating farm plan:", error);
      toast.error("Failed to generate farm plan", {
        description: "Please try again or contact support",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (phaseIndex: number, taskIndex: number) => {
    if (!farmPlan || !planId) return;

    const currentStatus = farmPlan.phases[phaseIndex].tasks[taskIndex].completed;
    
    // Optimistic update
    const updatedPlan = { ...farmPlan };
    updatedPlan.phases[phaseIndex].tasks[taskIndex].completed = !currentStatus;
    setFarmPlan(updatedPlan);

    try {
      const response = await fetch(`${apiBase}/ai-farm-plan/update-task`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          planId,
          phaseIndex,
          taskIndex,
          completed: !currentStatus
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFarmPlan(data.plan);
          toast.success(!currentStatus ? "Task completed! 🎉" : "Task marked incomplete", {
            duration: 2000,
          });
        }
      } else {
        // Revert on failure
        setFarmPlan(farmPlan);
        toast.error("Failed to update task");
      }
    } catch (error) {
      // Revert on failure
      setFarmPlan(farmPlan);
      toast.error("Failed to update task");
    }
  };

  const exportToPDF = async () => {
    if (!farmPlan || !planId) return;

    setExporting(true);
    try {
      toast.info("📄 Generating PDF...", {
        description: "Please wait while we create your document",
        duration: 2000,
      });

      const response = await fetch(`${apiBase}/ai-farm-plan/export-pdf`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          planId
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success("PDF exported successfully! 📥", {
            description: data.message,
            duration: 3000,
          });
        }
      } else {
        throw new Error("PDF generation failed");
      }
    } catch (error) {
      toast.error("Failed to export PDF", {
        description: "Please try again later",
        duration: 3000,
      });
    } finally {
      setExporting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700 border-green-300";
      case "in-progress": return "bg-gray-100 text-gray-700 border-gray-300";
      case "upcoming": return "bg-gray-100 text-gray-700 border-gray-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getPhaseProgress = (phase: any) => {
    if (!phase.tasks || phase.tasks.length === 0) return 0;
    const completedTasks = phase.tasks.filter((t: any) => t.completed).length;
    return Math.round((completedTasks / phase.tasks.length) * 100);
  };

  const getOverallProgress = () => {
    if (!farmPlan || !farmPlan.phases) return 0;
    const totalTasks = farmPlan.phases.reduce((sum: number, phase: any) => sum + phase.tasks.length, 0);
    const completedTasks = farmPlan.phases.reduce(
      (sum: number, phase: any) => sum + phase.tasks.filter((t: any) => t.completed).length,
      0
    );
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-12 w-12 text-green-600" />
        </motion.div>
        <p className="text-gray-600">Generating your personalized farm plan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Clean & Professional */}
      <div className="rounded-2xl bg-[#2E7D32] p-6 md:p-8 shadow-lg">
        {/* Content */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-2">
            {/* Title with Icon Badge */}
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Glowing background for icon */}
                <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl"></div>
                <div className="relative p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg">
                  <Brain className="h-7 w-7 md:h-8 md:w-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-white drop-shadow-lg flex items-center gap-2">
                  AI Farm Plan Generator
                </h2>
                <p className="text-sm md:text-base text-green-50 mt-1 font-medium">
                  Season-by-season farming plans powered by AI
                </p>
              </div>
            </div>
            
            {/* Feature Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-xs font-bold text-white flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                Season Planning
              </div>
              <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3" />
                ROI Optimization
              </div>
              <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" />
                Task Tracking
              </div>
            </div>
          </div>
          
          {/* Action Button with Premium Styling */}
          <div className="relative">
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-white/30 rounded-xl blur-xl animate-pulse"></div>
            <Button 
              onClick={generateNewPlan} 
              size="lg" 
              className="relative bg-white text-green-700 hover:bg-green-50 font-black shadow-2xl border-2 border-white/50 h-11 md:h-12 px-6 gap-2 transition-all hover:scale-105 hover:shadow-3xl"
            >
              <RefreshCw className="h-5 w-5" />
              Generate New Plan
            </Button>
          </div>
        </div>
        
        {/* Decorative Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      </div>

      {/* Plan Configuration */}
      <Card className="bg-white border-2 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl">Plan Configuration</CardTitle>
          <CardDescription>Customize your farming season plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm mb-2 block">Select Crop</label>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {crops.map(crop => (
                    <SelectItem key={crop} value={crop.toLowerCase()}>
                      {crop}
                    </SelectItem>
                  ))}
                  <SelectItem value="maize">Maize</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="beans">Beans</SelectItem>
                  <SelectItem value="sunflower">Sunflower</SelectItem>
                  <SelectItem value="sorghum">Sorghum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm mb-2 block">Season</label>
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025/2026 Main Season">2025/2026 Main Season</SelectItem>
                  <SelectItem value="2025/2026 Short Rain">2025/2026 Short Rain</SelectItem>
                  <SelectItem value="2026/2027 Main Season">2026/2027 Main Season</SelectItem>
                  <SelectItem value="2026/2027 Short Rain">2026/2027 Short Rain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {aiGenerated && farmPlan && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-gray-100 rounded-lg border-2 border-gray-300 flex items-start gap-3"
            >
              <Sparkles className="h-5 w-5 text-gray-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm">
                  <strong>AI-Powered Plan:</strong> This plan was generated using advanced agricultural AI trained on Tanzanian farming conditions.
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {farmPlan ? (
        <>
          {/* Overall Progress */}
          <Card className="border-2 border-gray-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Overall Progress</span>
                <span className="text-lg">{getOverallProgress()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-[#2E7D32] h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getOverallProgress()}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card className="border-2 border-gray-200 bg-gray-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gray-700" />
                Financial Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-600">Total Cost</p>
                  <p className="text-base md:text-lg text-red-600 mt-1">{farmPlan.summary.totalCost}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-600">Expected Yield</p>
                  <p className="text-base md:text-lg text-green-600 mt-1">{farmPlan.summary.expectedYield}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-600">Revenue</p>
                  <p className="text-base md:text-lg text-gray-900 mt-1">{farmPlan.summary.expectedRevenue}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-600">Profit</p>
                  <p className="text-base md:text-lg text-gray-900 mt-1">{farmPlan.summary.profit}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-600">ROI</p>
                  <p className="text-base md:text-lg text-orange-600 mt-1">{farmPlan.summary.roi}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Dates Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Critical Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {farmPlan.criticalDates.map((item: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                      item.importance === "critical" ? "bg-red-50 border-red-200" :
                      item.importance === "high" ? "bg-orange-50 border-orange-200" :
                      "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm">{item.date}</div>
                      <div className="text-sm">{item.activity}</div>
                    </div>
                    <Badge variant={
                      item.importance === "critical" ? "destructive" :
                      item.importance === "high" ? "secondary" : "outline"
                    }>
                      {item.importance}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Season Phases */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {farmPlan.phases.map((phase: any, idx: number) => {
                const progress = getPhaseProgress(phase);
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className={`border-2 ${getStatusColor(phase.status)}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                              {phase.status === "completed" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                              {phase.status === "in-progress" && <Clock className="h-5 w-5 text-gray-600 animate-pulse" />}
                              {phase.name}
                            </CardTitle>
                            <CardDescription>{phase.week} • {phase.days}</CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={
                              phase.status === "completed" ? "bg-green-600" :
                              phase.status === "in-progress" ? "bg-gray-600" :
                              "bg-gray-500"
                            }>
                              {phase.status.toUpperCase().replace("-", " ")}
                            </Badge>
                            <span className="text-xs text-gray-600">{progress}% Complete</span>
                          </div>
                        </div>
                        {progress > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <motion.div
                              className="bg-green-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {phase.tasks.map((task: any, taskIdx: number) => (
                            <motion.div
                              key={taskIdx}
                              whileHover={{ scale: 1.01 }}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                task.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:border-green-300"
                              }`}
                              onClick={() => toggleTaskCompletion(idx, taskIdx)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                  task.completed ? "border-green-600 bg-green-600" : "border-gray-300 hover:border-green-500"
                                }`}>
                                  {task.completed && <CheckCircle2 className="h-4 w-4 text-white" />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className={`text-sm md:text-base ${task.completed ? "line-through text-gray-600" : ""}`}>
                                      {task.task}
                                    </p>
                                    <span className="text-sm text-green-600 whitespace-nowrap">
                                      {task.cost}
                                    </span>
                                  </div>
                                  <p className="text-xs md:text-sm text-gray-600">Duration: {task.duration}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Export Button */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <Button 
                className="w-full gap-2" 
                variant="outline"
                onClick={exportToPDF}
                disabled={exporting}
              >
                {exporting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Export Full Plan (PDF)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center">
            <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg mb-2">No Farm Plan Yet</h3>
            <p className="text-gray-600 mb-4">
              Click "Generate New Plan" to create a personalized farming schedule for your {selectedCrop} crop.
            </p>
            <Button onClick={generateNewPlan} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Generate My First Plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}