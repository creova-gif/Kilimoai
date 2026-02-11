import { useState } from "react";
import { Sparkles, Download, Calendar, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";

interface AIFarmPlanGeneratorProps {
  userId: string;
  region: string;
  crops: string[];
  farmSize: string;
  apiBase: string;
  authToken: string;
  language?: "en" | "sw";
}

export function AIFarmPlanGenerator({ 
  userId, 
  region, 
  crops, 
  farmSize,
  apiBase, 
  authToken,
  language = "en"
}: AIFarmPlanGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [farmPlan, setFarmPlan] = useState<any>(null);

  const text = {
    title: language === "sw" ? "Tengeneza Mpango wa Shamba" : "Generate Farm Plan",
    subtitle: language === "sw" ? "Mpango kamili wa msimu unaotumia AI" : "AI-powered seasonal plan",
    generate: language === "sw" ? "Tengeneza Mpango" : "Generate Plan",
    generating: language === "sw" ? "Inatengeneza..." : "Generating...",
    download: language === "sw" ? "Pakua PDF" : "Download PDF",
    overview: language === "sw" ? "Muhtasari" : "Overview",
    timeline: language === "sw" ? "Ratiba" : "Timeline",
    budget: language === "sw" ? "Bajeti" : "Budget",
    expectedYield: language === "sw" ? "Mavuno Yanayotarajiwa" : "Expected Yield",
  };

  const generatePlan = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockPlan = {
        crop: crops[0] || "Maize",
        farmSize,
        region,
        timeline: [
          { week: 1, activity: "Land preparation", status: "pending" },
          { week: 2, activity: "Planting", status: "pending" },
          { week: 4, activity: "First weeding", status: "pending" },
          { week: 6, activity: "Fertilizer application", status: "pending" },
          { week: 12, activity: "Harvesting", status: "pending" },
        ],
        budget: {
          seeds: 50000,
          fertilizer: 120000,
          labor: 80000,
          total: 250000,
        },
        expectedYield: "2800 kg/acre",
      };
      
      setFarmPlan(mockPlan);
      toast.success(language === "sw" ? "Mpango umetengenezwa!" : "Plan generated!");
    } catch (error) {
      toast.error(language === "sw" ? "Imeshindwa kutengeneza" : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] bg-gradient-to-br from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-2xl p-6 text-white shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{text.title}</h1>
                <p className="text-white/90 text-sm">{text.subtitle}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <p className="text-xs text-white/80">{language === "sw" ? "Eneo" : "Region"}</p>
                <p className="font-semibold">{region}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <p className="text-xs text-white/80">{language === "sw" ? "Ukubwa" : "Size"}</p>
                <p className="font-semibold">{farmSize}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <p className="text-xs text-white/80">{language === "sw" ? "Zao" : "Crop"}</p>
                <p className="font-semibold">{crops[0] || "Maize"}</p>
              </div>
            </div>
          </div>
        </div>

        {!farmPlan ? (
          /* Generate CTA */
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="py-12 text-center">
              <div className="h-20 w-20 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === "sw" ? "Tayari kutengeneza mpango?" : "Ready to generate your plan?"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {language === "sw"
                  ? "AI itatengeneza mpango kamili wa kupanda, kulima, na kuvuna kulingana na shamba lako."
                  : "AI will create a complete planting, cultivation, and harvest plan tailored to your farm."}
              </p>
              
              <Button
                onClick={generatePlan}
                disabled={loading}
                className="bg-[#2E7D32] hover:bg-[#1B5E20] h-12 px-8 shadow-lg"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                    </motion.div>
                    {text.generating}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    {text.generate}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Generated Plan */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-2 border-emerald-200 bg-emerald-50">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-emerald-700 font-medium">{text.expectedYield}</p>
                        <p className="text-lg font-bold text-emerald-900">{farmPlan.expectedYield}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-700 font-medium">{text.timeline}</p>
                        <p className="text-lg font-bold text-blue-900">
                          {farmPlan.timeline.length} {language === "sw" ? "hatua" : "steps"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-amber-200 bg-amber-50">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-amber-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-amber-700 font-medium">{text.budget}</p>
                        <p className="text-lg font-bold text-amber-900">
                          {(farmPlan.budget.total / 1000).toFixed(0)}k TSh
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline */}
              <Card className="border-2 border-gray-200">
                <CardContent className="py-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#2E7D32]" />
                    {text.timeline}
                  </h3>
                  <div className="space-y-3">
                    {farmPlan.timeline.map((item: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 h-8 w-8 bg-[#2E7D32]/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-[#2E7D32]">{item.week}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.activity}</p>
                          <p className="text-xs text-gray-600">
                            {language === "sw" ? "Wiki" : "Week"} {item.week}
                          </p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-gray-300" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Download Button */}
              <Button
                onClick={() => toast.success(language === "sw" ? "Inapakua..." : "Downloading...")}
                variant="outline"
                className="w-full border-2 border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32]/10"
              >
                <Download className="h-4 w-4 mr-2" />
                {text.download}
              </Button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

AIFarmPlanGenerator.displayName = "AIFarmPlanGenerator";
