import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Sprout, 
  Heart, 
  ClipboardList, 
  BarChart3, 
  CloudRain,
  Sparkles,
  ArrowRight,
  Lock,
  LayoutGrid
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";

interface AIWorkflowHubProps {
  userId: string;
  userRole: string;
  userTier: "free" | "basic" | "premium" | "enterprise";
  onNavigate?: (tab: string) => void;
  language?: "en" | "sw";
}

interface Workflow {
  id: string;
  name: string;
  nameSw: string;
  icon: any;
  color: string;
  description: string;
  descriptionSw: string;
  locked?: boolean;
  badge?: string;
}

export function AIWorkflowHub({ userId, userRole, userTier, onNavigate, language = "en" }: AIWorkflowHubProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const text = {
    title: language === "sw" ? "Mchakato wa AI" : "AI Workflows",
    subtitle: language === "sw" ? "Michakato inayotumia AI kwa shamba lako" : "AI-powered processes for your farm",
    comingSoon: language === "sw" ? "Inapatikana Hivi Karibuni" : "Coming Soon",
    premium: language === "sw" ? "Malipo" : "Premium",
    clickToStart: language === "sw" ? "Bonyeza kuanza" : "Click to start",
  };

  const workflows: Workflow[] = [
    {
      id: "crop-planning",
      name: "Crop Planning",
      nameSw: "Mpango wa Mazao",
      icon: Sprout,
      color: "bg-emerald-500",
      description: "AI-powered crop rotation and planting schedules",
      descriptionSw: "Mpango wa kupanda na kubadilisha mazao kwa kutumia AI",
      badge: "AI",
    },
    {
      id: "livestock-health",
      name: "Livestock Health",
      nameSw: "Afya ya Mifugo",
      icon: Heart,
      color: "bg-red-500",
      description: "Monitor and manage livestock health with AI",
      descriptionSw: "Fuatilia na kudhibiti afya ya mifugo kwa kutumia AI",
      badge: "AI",
    },
    {
      id: "task-management",
      name: "Task Management",
      nameSw: "Usimamizi wa Kazi",
      icon: ClipboardList,
      color: "bg-blue-500",
      description: "Organize farm tasks and track labor efficiently",
      descriptionSw: "Panga kazi za shamba na kufuatilia wafanyakazi",
    },
    {
      id: "yield-forecasting",
      name: "Yield Forecasting",
      nameSw: "Utabiri wa Mavuno",
      icon: BarChart3,
      color: "bg-purple-500",
      description: "Predict harvest quantities with AI precision",
      descriptionSw: "Tabiri wingi wa mavuno kwa usahihi wa AI",
      badge: "AI Pro",
      locked: userTier === "free",
    },
    {
      id: "climate-risk",
      name: "Climate Risk",
      nameSw: "Hatari ya Hali ya Hewa",
      icon: CloudRain,
      color: "bg-cyan-500",
      description: "Assess and mitigate climate-related farm risks",
      descriptionSw: "Tathmini na punguza hatari za hali ya hewa",
      badge: "AI",
      locked: userTier === "free",
    },
  ];

  const handleWorkflowClick = (workflow: Workflow) => {
    if (workflow.locked) {
      toast.info(language === "sw" ? "Boresha kupata huduma hii" : "Upgrade to access this workflow");
      return;
    }
    
    setSelectedWorkflow(workflow.id);
    toast.success(`${language === "sw" ? "Inafungua" : "Opening"} ${language === "sw" ? workflow.nameSw : workflow.name}...`);
  };

  return (
    <div className="min-h-[calc(100vh-180px)] bg-gradient-to-br from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-2xl p-6 text-white shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <LayoutGrid className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{text.title}</h1>
                <p className="text-white/90 text-sm">{text.subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((workflow, index) => {
            const Icon = workflow.icon;
            return (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`border-2 ${
                    workflow.locked 
                      ? "border-gray-200 opacity-75" 
                      : "border-gray-200 hover:border-[#2E7D32] hover:shadow-xl"
                  } transition-all cursor-pointer group relative overflow-hidden`}
                  onClick={() => handleWorkflowClick(workflow)}
                >
                  {workflow.locked && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="h-8 w-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Lock className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                  )}

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-14 w-14 ${workflow.color} rounded-xl flex items-center justify-center shadow-lg ${
                        workflow.locked ? "opacity-50" : "group-hover:scale-110"
                      } transition-transform`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      {workflow.badge && !workflow.locked && (
                        <Badge className="bg-[#2E7D32] text-white">
                          {workflow.badge}
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      {language === "sw" ? workflow.nameSw : workflow.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {language === "sw" ? workflow.descriptionSw : workflow.description}
                    </p>

                    <div className={`flex items-center gap-2 text-sm font-medium ${
                      workflow.locked ? "text-gray-400" : "text-[#2E7D32]"
                    }`}>
                      {workflow.locked ? (
                        <>
                          <Lock className="h-4 w-4" />
                          <span>{text.premium}</span>
                        </>
                      ) : (
                        <>
                          <span>{text.clickToStart}</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="border-2 border-blue-100 bg-blue-50/50">
          <CardContent className="py-4">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1 text-sm">
                  {language === "sw" ? "Mchakato wa AI ni Nini?" : "What are AI Workflows?"}
                </h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {language === "sw"
                    ? "Michakato ya AI ni mifumo maalum inayotumia akili bandia kusaidia katika maamuzi ya kila siku ya shamba lako - kutoka kupanga mazao hadi kutabiri mavuno."
                    : "AI Workflows are specialized systems that use artificial intelligence to assist with daily farm decisions - from crop planning to yield forecasting."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

AIWorkflowHub.displayName = "AIWorkflowHub";