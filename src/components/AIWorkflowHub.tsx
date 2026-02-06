import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Sprout, 
  Heart, 
  ClipboardList, 
  BarChart3, 
  CloudRain,
  Sparkles,
  Crown
} from "lucide-react";
import { CropPlanning } from "./workflows/CropPlanning";
import { LivestockHealth } from "./workflows/LivestockHealth";
import { TaskManagement } from "./workflows/TaskManagement";
import { YieldForecasting } from "./workflows/YieldForecasting";
import { ClimateRisk } from "./workflows/ClimateRisk";
import { toast } from "sonner@2.0.3";

interface AIWorkflowHubProps {
  userId: string;
  userRole: string;
  userTier: "free" | "basic" | "premium" | "enterprise";
  onNavigate?: (tab: string) => void;
}

interface WorkflowTab {
  id: string;
  name: string;
  icon: any;
  component: any;
  color: string;
  bgColor: string;
  requiredTier?: "basic" | "premium" | "enterprise";
  badge?: string;
  description?: string;
}

export function AIWorkflowHub({ userId, userRole, userTier, onNavigate }: AIWorkflowHubProps) {
  const workflows: WorkflowTab[] = [
    {
      id: "crop-planning",
      name: "Crop Planning",
      icon: Sprout,
      component: CropPlanning,
      color: "text-green-600",
      bgColor: "bg-green-100",
      badge: "AI"
    },
    {
      id: "livestock-health",
      name: "Livestock Health",
      icon: Heart,
      component: LivestockHealth,
      color: "text-red-600",
      bgColor: "bg-red-100",
      badge: "AI"
    },
    {
      id: "task-management",
      name: "Task & Labor",
      icon: ClipboardList,
      component: TaskManagement,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      requiredTier: "basic",
      badge: "BASIC"
    },
    {
      id: "yield-forecasting",
      name: "Yield Forecasting",
      icon: BarChart3,
      component: YieldForecasting,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      requiredTier: "basic",
      badge: "AI PRO"
    },
    {
      id: "climate-risk",
      name: "Climate Alerts",
      icon: CloudRain,
      component: ClimateRisk,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      badge: "LIVE"
    }
  ];

  const [activeTab, setActiveTab] = useState(workflows[0].id);

  const tierOrder = { free: 0, basic: 1, premium: 2, enterprise: 3 };
  
  const hasAccess = (workflow: WorkflowTab) => {
    if (!workflow.requiredTier) return true;
    return tierOrder[userTier] >= tierOrder[workflow.requiredTier];
  };

  const activeWorkflow = workflows.find(w => w.id === activeTab);
  const ActiveComponent = activeWorkflow?.component;
  
  const handleUpgradeClick = () => {
    toast.info("Upgrade Feature", {
      description: "Contact support to upgrade your plan and unlock premium features",
      duration: 4000
    });
    // Navigate to role dashboard for upgrade options
    if (onNavigate) {
      onNavigate("role-dashboard");
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs Header */}
      <Card className="p-1 bg-gray-50">
        <div className="flex flex-wrap gap-1">
          {workflows.map(workflow => {
            const Icon = workflow.icon;
            const isActive = activeTab === workflow.id;
            const locked = !hasAccess(workflow);
            
            return (
              <button
                key={workflow.id}
                onClick={() => {
                  if (!locked) {
                    setActiveTab(workflow.id);
                    toast.success(`${workflow.name} activated`, {
                      description: `Viewing ${workflow.name} workflow`,
                      duration: 2000
                    });
                  } else {
                    toast.warning("Premium Feature Locked", {
                      description: `${workflow.name} requires ${workflow.requiredTier} tier or higher`,
                      duration: 3000
                    });
                  }
                }}
                disabled={locked}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group
                  ${isActive 
                    ? 'bg-white shadow-lg border-2 border-green-200' 
                    : locked 
                      ? 'bg-gray-50 opacity-60 cursor-not-allowed border border-gray-200' 
                      : 'bg-white/50 border border-gray-100 hover:bg-white hover:shadow-md hover:border-green-100'
                  }
                `}
              >
                <div className={`p-2 rounded-lg transition-all ${
                  isActive 
                    ? `${workflow.bgColor} shadow-sm` 
                    : locked 
                      ? 'bg-gray-200' 
                      : 'bg-gray-100 group-hover:bg-green-50'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    isActive 
                      ? workflow.color 
                      : locked 
                        ? 'text-gray-400' 
                        : 'text-gray-600 group-hover:text-green-600'
                  }`} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-semibold ${
                      isActive 
                        ? 'text-gray-900' 
                        : locked 
                          ? 'text-gray-500' 
                          : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {workflow.name.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim()}
                    </span>
                    {workflow.badge && !locked && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 h-5 bg-purple-100 text-purple-700 border-purple-200">
                        {workflow.badge.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim()}
                      </Badge>
                    )}
                    {locked && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-md">
                        <Crown className="h-3 w-3 text-amber-600" />
                        <span className="text-[10px] font-bold text-amber-700">PRO</span>
                      </div>
                    )}
                  </div>
                  {workflow.description && (
                    <p className={`text-xs mt-0.5 ${
                      isActive 
                        ? 'text-gray-600' 
                        : locked 
                          ? 'text-gray-400' 
                          : 'text-gray-500'
                    }`}>
                      {workflow.description.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim()}
                    </p>
                  )}
                </div>
                {isActive && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Upgrade Notice for Locked Features */}
      {activeWorkflow && !hasAccess(activeWorkflow) && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="p-6 text-center">
            <Crown className="h-12 w-12 mx-auto text-yellow-600 mb-3" />
            <h3 className="text-lg font-bold mb-2">Upgrade to Access {activeWorkflow.name}</h3>
            <p className="text-sm text-gray-600 mb-4">
              This feature requires a {activeWorkflow.requiredTier?.toUpperCase()} plan or higher
            </p>
            <button 
              onClick={handleUpgradeClick}
              className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              Upgrade Now
            </button>
          </div>
        </Card>
      )}

      {/* Active Workflow Content */}
      {activeWorkflow && hasAccess(activeWorkflow) && ActiveComponent && (
        <div className="animate-in fade-in duration-200">
          <ActiveComponent userId={userId} userRole={userRole} />
        </div>
      )}
    </div>
  );
}