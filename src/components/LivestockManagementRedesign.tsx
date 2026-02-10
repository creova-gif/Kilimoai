import { useState, useEffect } from "react";
import { 
  Activity, AlertTriangle, TrendingUp, TrendingDown, Heart, 
  Baby, Beef, Egg, Droplets, LineChart, AlertCircle, CheckCircle2,
  Clock, Calendar, Thermometer, Syringe, ChevronRight, Loader2,
  Wifi, WifiOff, RefreshCw, Target, Award, Users
} from "lucide-react";

interface LivestockManagementRedesignProps {
  userId: string;
  language: "en" | "sw";
}

interface TabMetrics {
  count?: number;
  trend?: "up" | "down" | "stable";
  trendValue?: number;
  alerts?: number;
  status?: "healthy" | "warning" | "critical";
  urgentActions?: number;
}

interface TabConfig {
  id: string;
  label: { en: string; sw: string };
  icon: any;
  metrics: TabMetrics;
  description: { en: string; sw: string };
  enabled: boolean;
}

export function LivestockManagementRedesign({ userId, language }: LivestockManagementRedesignProps) {
  const [activeTab, setActiveTab] = useState("herd-snapshot");
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [tabData, setTabData] = useState<Record<string, any>>({});

  // Simulated tab configurations with real-time metrics
  const tabs: TabConfig[] = [
    {
      id: "herd-snapshot",
      label: { en: "Herd Snapshot", sw: "Muhtasari wa Kundi" },
      icon: Users,
      description: { 
        en: "Real-time herd size, risk flags, productivity index",
        sw: "Ukubwa wa kundi, tahadhari, na kiwango cha uzalishaji"
      },
      metrics: {
        count: 247,
        status: "healthy",
        alerts: 3,
        trend: "up",
        trendValue: 2.3
      },
      enabled: true
    },
    {
      id: "health-intelligence",
      label: { en: "Animal Health Intelligence", sw: "Uelewa wa Afya" },
      icon: Heart,
      description: { 
        en: "Vaccination status, illness alerts, mortality risk",
        sw: "Hali ya chanjo, tahadhari za magonjwa"
      },
      metrics: {
        alerts: 5,
        urgentActions: 2,
        status: "warning",
        count: 12
      },
      enabled: true
    },
    {
      id: "breeding-lineage",
      label: { en: "Breeding & Lineage", sw: "Uzazi na Ukoo" },
      icon: Baby,
      description: { 
        en: "Heat cycles, pregnancy tracking, genetic performance",
        sw: "Mzunguko wa joto, ufuatiliaji wa mimba"
      },
      metrics: {
        count: 18,
        urgentActions: 3,
        status: "healthy",
        trend: "stable"
      },
      enabled: true
    },
    {
      id: "production-output",
      label: { en: "Production & Output", sw: "Uzalishaji na Matokeo" },
      icon: TrendingUp,
      description: { 
        en: "Yield trends, feed efficiency, performance comparison",
        sw: "Mwelekeo wa mavuno, ufanisi wa chakula"
      },
      metrics: {
        trend: "up",
        trendValue: 8.5,
        status: "healthy",
        count: 247
      },
      enabled: true
    }
  ];

  // Simulate data fetching
  useEffect(() => {
    const loadTabData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsLoading(false);
      setLastSync(new Date());
    };

    loadTabData();

    // Check online status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [activeTab, userId]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "healthy": return "text-green-600 bg-green-50";
      case "warning": return "text-amber-600 bg-amber-50";
      case "critical": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "healthy": return <CheckCircle2 className="h-4 w-4" />;
      case "warning": return <AlertTriangle className="h-4 w-4" />;
      case "critical": return <AlertCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const renderTabContent = () => {
    const currentTab = tabs.find(t => t.id === activeTab);
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              {language === "en" ? "Loading data..." : "Inapakia data..."}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        {/* Tab-specific content will go here */}
        {activeTab === "herd-snapshot" && <HerdSnapshotView language={language} />}
        {activeTab === "health-intelligence" && <HealthIntelligenceView language={language} />}
        {activeTab === "breeding-lineage" && <BreedingLineageView language={language} />}
        {activeTab === "production-output" && <ProductionOutputView language={language} />}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/20">
      {/* Header with Status Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === "en" ? "Livestock Management" : "Usimamizi wa Mifugo"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {language === "en" 
                  ? "Intelligent livestock tracking & analytics" 
                  : "Ufuatiliaji wa akili wa mifugo"}
              </p>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                isOffline 
                  ? "bg-amber-50 text-amber-700" 
                  : "bg-green-50 text-green-700"
              }`}>
                {isOffline ? <WifiOff className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
                <span>{isOffline ? (language === "en" ? "Offline" : "Nje ya Mtandao") : (language === "en" ? "Live" : "Moja kwa Moja")}</span>
              </div>
              
              <button 
                onClick={() => window.location.reload()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={language === "en" ? "Refresh data" : "Onyesha upya data"}
              >
                <RefreshCw className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Last Sync Info */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {language === "en" ? "Last synced" : "Ulisawazishwa"}: {lastSync.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Intelligent Tab Navigation */}
        <div className="px-4 lg:px-6">
          <div className="flex gap-2 overflow-x-auto pb-px scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  disabled={!tab.enabled}
                  className={`
                    relative flex-shrink-0 group
                    ${isActive 
                      ? "text-green-700" 
                      : "text-gray-600 hover:text-gray-900"
                    }
                    ${!tab.enabled && "opacity-50 cursor-not-allowed"}
                  `}
                >
                  <div className={`
                    flex items-center gap-3 px-4 py-3 rounded-t-lg transition-all
                    ${isActive 
                      ? "bg-white" 
                      : "hover:bg-gray-50"
                    }
                  `}>
                    {/* Icon with Status Indicator */}
                    <div className="relative">
                      <Icon className={`h-5 w-5 ${isActive ? "text-green-600" : ""}`} />
                      {tab.metrics.alerts && tab.metrics.alerts > 0 && (
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border border-white flex items-center justify-center">
                          <span className="text-[8px] text-white font-bold">
                            {tab.metrics.alerts}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Label & Metrics */}
                    <div className="text-left min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {tab.label[language]}
                        </span>
                        
                        {/* Trend Indicator */}
                        {tab.metrics.trend && (
                          <div className="flex items-center gap-0.5">
                            {tab.metrics.trend === "up" && (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            )}
                            {tab.metrics.trend === "down" && (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            {tab.metrics.trendValue && (
                              <span className={`text-xs font-medium ${
                                tab.metrics.trend === "up" ? "text-green-600" : "text-red-600"
                              }`}>
                                {tab.metrics.trendValue}%
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Quick Metrics */}
                      <div className="flex items-center gap-3 mt-1">
                        {tab.metrics.count !== undefined && (
                          <span className="text-xs text-gray-500">
                            {tab.metrics.count} {language === "en" ? "total" : "jumla"}
                          </span>
                        )}
                        
                        {tab.metrics.urgentActions && tab.metrics.urgentActions > 0 && (
                          <span className="text-xs font-medium text-amber-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {tab.metrics.urgentActions} {language === "en" ? "urgent" : "haraka"}
                          </span>
                        )}
                        
                        {tab.metrics.status && (
                          <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${getStatusColor(tab.metrics.status)}`}>
                            {getStatusIcon(tab.metrics.status)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <ChevronRight className="h-4 w-4 text-green-600" />
                    )}
                  </div>

                  {/* Bottom Border for Active Tab */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="bg-white min-h-[calc(100vh-220px)]">
        {renderTabContent()}
      </div>
    </div>
  );
}

// Tab Content Components
function HerdSnapshotView({ language }: { language: "en" | "sw" }) {
  const stats = [
    { label: { en: "Total Animals", sw: "Jumla ya Wanyama" }, value: 247, icon: Users, color: "blue" },
    { label: { en: "At Risk", sw: "Hatarini" }, value: 3, icon: AlertTriangle, color: "red" },
    { label: { en: "Productivity Index", sw: "Kielelezo cha Tija" }, value: "94%", icon: Award, color: "green" },
    { label: { en: "Active Breeding", sw: "Uzazi Hai" }, value: 18, icon: Baby, color: "purple" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                  <Icon className={`h-5 w-5 text-${stat.color}-600`} />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label[language]}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {language === "en" ? "Quick Actions" : "Vitendo vya Haraka"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Target className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium text-gray-900">
                {language === "en" ? "Add Animal" : "Ongeza Mnyama"}
              </div>
              <div className="text-xs text-gray-500">
                {language === "en" ? "Register new livestock" : "Sajili mifugo mpya"}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function HealthIntelligenceView({ language }: { language: "en" | "sw" }) {
  const healthAlerts = [
    { animal: "COW-247", issue: "Vaccination Due", severity: "warning", days: 2 },
    { animal: "GOAT-089", issue: "Temperature Alert", severity: "critical", days: 0 },
    { animal: "COW-156", issue: "Checkup Required", severity: "info", days: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900">
              {language === "en" ? "5 Health Alerts Require Attention" : "Tahadhari 5 za Afya Zinahitaji Uangalifu"}
            </h4>
            <p className="text-sm text-amber-700 mt-1">
              {language === "en" ? "2 urgent actions needed today" : "Vitendo 2 vya haraka vinahitajika leo"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {healthAlerts.map((alert, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  alert.severity === "critical" ? "bg-red-50" :
                  alert.severity === "warning" ? "bg-amber-50" : "bg-gray-50"
                }`}>
                  <Heart className={`h-5 w-5 ${
                    alert.severity === "critical" ? "text-red-600" :
                    alert.severity === "warning" ? "text-amber-600" : "text-gray-600"
                  }`} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{alert.animal}</div>
                  <div className="text-sm text-gray-600">{alert.issue}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {alert.days === 0 ? (language === "en" ? "Today" : "Leo") : `${alert.days} ${language === "en" ? "days" : "siku"}`}
                </div>
                <button className="text-xs text-green-600 hover:text-green-700 font-medium mt-1">
                  {language === "en" ? "Take Action →" : "Chukua Hatua →"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BreedingLineageView({ language }: { language: "en" | "sw" }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Baby className="h-5 w-5 text-gray-600" />
            </div>
            <div className="text-sm font-medium text-gray-600">
              {language === "en" ? "In Heat Cycle" : "Katika Mzunguko wa Joto"}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">3</div>
          <div className="text-xs text-gray-500 mt-1">
            {language === "en" ? "Optimal breeding window" : "Dirisha bora la uzazi"}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Heart className="h-5 w-5 text-gray-600" />
            </div>
            <div className="text-sm font-medium text-gray-600">
              {language === "en" ? "Pregnant" : "Wanawake Wajawazito"}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">15</div>
          <div className="text-xs text-gray-500 mt-1">
            {language === "en" ? "Expected births: 3 months" : "Uzazi unatarajiwa: miezi 3"}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-sm font-medium text-gray-600">
              {language === "en" ? "High Performers" : "Watendaji Bora"}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">12</div>
          <div className="text-xs text-gray-500 mt-1">
            {language === "en" ? "Genetic excellence score >90%" : "Alama ya uboreshaji >90%"}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-600" />
          <div>
            <h4 className="font-semibold text-gray-900">
              {language === "en" ? "3 Animals Ready for Breeding" : "Wanyama 3 Tayari kwa Uzazi"}
            </h4>
            <p className="text-sm text-gray-700 mt-1">
              {language === "en" ? "Optimal window: Next 48 hours" : "Dirisha bora: Masaa 48 yajayo"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductionOutputView({ language }: { language: "en" | "sw" }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Droplets className="h-5 w-5 text-gray-600" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">1,247L</div>
          <div className="text-sm text-gray-600 mt-1">
            {language === "en" ? "Milk (Today)" : "Maziwa (Leo)"}
          </div>
          <div className="text-xs text-green-600 font-medium mt-1">+8.5% vs yesterday</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Egg className="h-5 w-5 text-amber-600" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-600 mt-1">
            {language === "en" ? "Eggs (Today)" : "Mayai (Leo)"}
          </div>
          <div className="text-xs text-gray-500 font-medium mt-1">N/A</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Beef className="h-5 w-5 text-red-600" />
            <LineChart className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">3.2kg</div>
          <div className="text-sm text-gray-600 mt-1">
            {language === "en" ? "Avg Weight Gain" : "Ongezeko la Uzito"}
          </div>
          <div className="text-xs text-gray-500 font-medium mt-1">Per animal/day</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-green-600" />
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">94%</div>
          <div className="text-sm text-gray-600 mt-1">
            {language === "en" ? "Feed Efficiency" : "Ufanisi wa Chakula"}
          </div>
          <div className="text-xs text-green-600 font-medium mt-1">Excellent</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {language === "en" ? "30-Day Production Trend" : "Mwelekeo wa Uzalishaji wa Siku 30"}
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <LineChart className="h-16 w-16 text-gray-300" />
          <span className="ml-3 text-gray-500">
            {language === "en" ? "Chart visualization here" : "Picha ya grafu hapa"}
          </span>
        </div>
      </div>
    </div>
  );
}
