import { useState, useEffect } from "react";
import { 
  Activity, AlertTriangle, TrendingUp, TrendingDown, Heart, 
  Baby, Beef, Egg, Droplets, LineChart, AlertCircle, CheckCircle2,
  Clock, Calendar, Thermometer, Syringe, ChevronRight, Loader2,
  Wifi, WifiOff, RefreshCw, Target, Award, Users, ArrowUpRight,
  ArrowDownRight, Minus, Plus, Eye, Edit, Trash2, Search, Filter,
  Download, Upload, Phone, MessageSquare, DollarSign, Package,
  ShoppingCart, FileText, Bell, Info, Zap, Brain, Sparkles,
  ChevronDown, ChevronUp, X, Check, CircleDot, BarChart3,
  PieChart, TrendingDown as Decrease, Flame, Wind, CloudRain,
  Sun, Moon, Apple, Wheat, Scale, RotateCcw, Send, MapPin,
  Building2, UserCheck, Shield, Database, Layers, GitBranch, ClipboardList
} from "lucide-react";

interface AdvancedLivestockManagementProps {
  userId: string;
  language: "en" | "sw";
}

interface HerdStats {
  total: number;
  cattle: number;
  goats: number;
  sheep: number;
  poultry: number;
  healthIndex: number;
  productionIndex: number;
  profitTrend: "up" | "down" | "stable";
  profitValue: number;
}

interface Alert {
  id: string;
  type: "disease" | "vaccination" | "feed" | "heat" | "mortality" | "critical";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  animalId?: string;
  dueDate?: Date;
  actionRequired: boolean;
}

interface AnimalProfile {
  id: string;
  name: string;
  species: "cattle" | "goat" | "sheep" | "poultry";
  breed: string;
  age: number;
  weight: number;
  healthStatus: "healthy" | "sick" | "at-risk";
  productionStatus: "active" | "inactive";
  lastCheckup: Date;
  nextVaccination?: Date;
}

interface AIRecommendation {
  id: string;
  category: "breeding" | "feed" | "health" | "culling";
  title: string;
  description: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  actionable: boolean;
}

export function AdvancedLivestockManagement({ userId, language }: AdvancedLivestockManagementProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [showAlertCenter, setShowAlertCenter] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);

  // Mock data - in production, this would come from API
  const [herdStats, setHerdStats] = useState<HerdStats>({
    total: 247,
    cattle: 85,
    goats: 92,
    sheep: 48,
    poultry: 22,
    healthIndex: 87,
    productionIndex: 92,
    profitTrend: "up",
    profitValue: 12.5
  });

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "disease",
      severity: "critical",
      title: language === "en" ? "Disease Outbreak Alert" : "Tahadhari ya Mlipuko wa Ugonjwa",
      description: language === "en" ? "3 cattle showing symptoms of foot-and-mouth disease" : "Ng'ombe 3 wanaonyesha dalili za ugonjwa wa mguu na mdomo",
      actionRequired: true,
      dueDate: new Date()
    },
    {
      id: "2",
      type: "vaccination",
      severity: "warning",
      title: language === "en" ? "Vaccinations Overdue" : "Chanjo Zilizopita Muda",
      description: language === "en" ? "12 animals need immediate vaccination" : "Wanyama 12 wanahitaji chanjo haraka",
      actionRequired: true,
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: "3",
      type: "feed",
      severity: "warning",
      title: language === "en" ? "Feed Shortage Risk" : "Hatari ya Upungufu wa Chakula",
      description: language === "en" ? "Feed inventory low - 5 days remaining" : "Akiba ya chakula chini - siku 5 zinazobaki",
      actionRequired: true
    },
    {
      id: "4",
      type: "heat",
      severity: "info",
      title: language === "en" ? "Heat Stress Warning" : "Tahadhari ya Joto Kali",
      description: language === "en" ? "High temperatures expected - increase water supply" : "Joto kali linatarajiwa - ongeza usambazaji wa maji",
      actionRequired: false
    }
  ]);

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: "1",
      category: "breeding",
      title: language === "en" ? "Optimal Breeding Window" : "Dirisha Bora la Uzazi",
      description: language === "en" ? "3 cows entering optimal breeding period in next 48 hours" : "Ng'ombe 3 wanaingia kipindi bora cha uzazi katika masaa 48 yajayo",
      confidence: 94,
      impact: "high",
      actionable: true
    },
    {
      id: "2",
      category: "feed",
      title: language === "en" ? "Feed Mix Optimization" : "Uboreshaji wa Mchanganyiko wa Chakula",
      description: language === "en" ? "Adjust protein ratio to 18% for improved milk yield" : "Rekebisha uwiano wa protini hadi 18% kwa mavuno bora ya maziwa",
      confidence: 87,
      impact: "medium",
      actionable: true
    },
    {
      id: "3",
      category: "health",
      title: language === "en" ? "Preventive Deworming" : "Kuondoa Minyoo kwa Kuzuia",
      description: language === "en" ? "Schedule deworming for 23 animals based on seasonal patterns" : "Panga kuondoa minyoo kwa wanyama 23 kulingana na mifumo ya misimu",
      confidence: 91,
      impact: "high",
      actionable: true
    }
  ]);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-50 border-red-200 text-red-900";
      case "warning": return "bg-amber-50 border-amber-200 text-amber-900";
      case "info": return "bg-gray-50 border-gray-200 text-gray-900";
      default: return "bg-gray-50 border-gray-200 text-gray-900";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case "info": return <Info className="h-5 w-5 text-gray-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const criticalAlerts = alerts.filter(a => a.severity === "critical");
  const warningAlerts = alerts.filter(a => a.severity === "warning");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-6 w-6 text-green-600" />
                {language === "en" ? "Livestock Management" : "Usimamizi wa Mifugo"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {language === "en" 
                  ? "Intelligent herd tracking & decision support" 
                  : "Ufuatiliaji wa akili wa kundi na usaidizi wa maamuzi"}
              </p>
            </div>
            
            {/* Connection & Sync Status */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                isOffline 
                  ? "bg-amber-50 text-amber-700 border border-amber-200" 
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}>
                {isOffline ? <WifiOff className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
                <span>{isOffline ? (language === "en" ? "Offline Mode" : "Hali ya Nje") : (language === "en" ? "Live" : "Moja kwa Moja")}</span>
              </div>
              
              <button 
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    setLastSync(new Date());
                  }, 1000);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={language === "en" ? "Sync data" : "Sawazisha data"}
              >
                <RefreshCw className={`h-4 w-4 text-gray-600 ${isLoading ? "animate-spin" : ""}`} />
              </button>
              
              <button 
                onClick={() => setShowAlertCenter(!showAlertCenter)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {criticalAlerts.length > 0 && (
                  <div className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </button>
            </div>
          </div>

          {/* Last Sync Time */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {language === "en" ? "Last synced" : "Ulisawazishwa"}: {lastSync.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 lg:px-6 py-6 space-y-6">
        {/* 1. HERD SNAPSHOT - Always Visible */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-[#2E7D32] h-1"></div>
          
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              {language === "en" ? "Herd Snapshot" : "Muhtasari wa Kundi"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Animals */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-8 w-8 text-gray-700" />
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">{herdStats.total}</div>
                    <div className="text-xs text-gray-700 font-medium mt-0.5">
                      {language === "en" ? "Total Animals" : "Jumla ya Wanyama"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-700 mt-3 pt-3 border-t border-gray-300">
                  <div className="flex items-center gap-1">
                    <Beef className="h-3.5 w-3.5" />
                    <span>{herdStats.cattle}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3.5 w-3.5">🐐</div>
                    <span>{herdStats.goats}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3.5 w-3.5">🐑</div>
                    <span>{herdStats.sheep}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Egg className="h-3.5 w-3.5" />
                    <span>{herdStats.poultry}</span>
                  </div>
                </div>
              </div>

              {/* Health Risk Index */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="h-8 w-8 text-green-600" />
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-900">{herdStats.healthIndex}%</div>
                    <div className="text-xs text-green-700 font-medium mt-0.5">
                      {language === "en" ? "Health Index" : "Kielelezo cha Afya"}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-green-700">{language === "en" ? "Excellent" : "Bora"}</span>
                    <span className="text-green-700 font-medium">{herdStats.healthIndex}/100</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${herdStats.healthIndex}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Production Index */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-8 w-8 text-gray-700" />
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">{herdStats.productionIndex}%</div>
                    <div className="text-xs text-gray-700 font-medium mt-0.5">
                      {language === "en" ? "Production Index" : "Kielelezo cha Uzalishaji"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-700">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>{language === "en" ? "Above target" : "Juu ya lengo"}</span>
                </div>
              </div>

              {/* Financial Status */}
              <div className={`bg-gradient-to-br rounded-lg p-4 border ${
                herdStats.profitTrend === "up" 
                  ? "bg-green-50 border-green-200" 
                  : "from-red-50 to-red-100/50 border-red-200"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className={`h-8 w-8 ${herdStats.profitTrend === "up" ? "text-green-600" : "text-red-600"}`} />
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${herdStats.profitTrend === "up" ? "text-green-900" : "text-red-900"}`}>
                      {herdStats.profitTrend === "up" ? "+" : "-"}{herdStats.profitValue}%
                    </div>
                    <div className={`text-xs font-medium mt-0.5 ${herdStats.profitTrend === "up" ? "text-green-700" : "text-red-700"}`}>
                      {language === "en" ? "Profit Trend" : "Mwelekeo wa Faida"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs">
                  {herdStats.profitTrend === "up" ? (
                    <><ArrowUpRight className="h-4 w-4 text-green-700" />
                    <span className="text-green-700">{language === "en" ? "Growing" : "Inakua"}</span></>
                  ) : (
                    <><ArrowDownRight className="h-4 w-4 text-red-700" />
                    <span className="text-red-700">{language === "en" ? "Declining" : "Inapungua"}</span></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ALERTS & RISK CENTER */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 h-1"></div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                {language === "en" ? "Alerts & Risk Center" : "Kituo cha Tahadhari na Hatari"}
              </h2>
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <Filter className="h-4 w-4" />
                {language === "en" ? "Filter" : "Chuja"}
              </button>
            </div>

            {/* Critical Alerts Summary */}
            {criticalAlerts.length > 0 && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900">
                      {criticalAlerts.length} {language === "en" ? "Critical Alert" : "Tahadhari Kuu"}{criticalAlerts.length > 1 ? "s" : ""}
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      {language === "en" ? "Immediate action required" : "Hatua ya haraka inahitajika"}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                    {language === "en" ? "Review Now" : "Kagua Sasa"}
                  </button>
                </div>
              </div>
            )}

            {/* Alert List */}
            <div className="space-y-3">
              {alerts.slice(0, 4).map((alert) => (
                <div 
                  key={alert.id}
                  className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{alert.title}</h4>
                      <p className="text-sm mt-1 opacity-90">{alert.description}</p>
                      {alert.dueDate && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs opacity-75">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {alert.dueDate < new Date() 
                              ? (language === "en" ? "Overdue" : "Imepita Muda")
                              : alert.dueDate.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    {alert.actionRequired && (
                      <button className="px-3 py-1.5 bg-white border border-current text-xs font-medium rounded hover:bg-opacity-90 transition-colors flex-shrink-0">
                        {language === "en" ? "Take Action" : "Chukua Hatua"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {alerts.length > 4 && (
              <button className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center gap-2 border-t border-gray-200 pt-4">
                {language === "en" ? "View All Alerts" : "Tazama Tahadhari Zote"} ({alerts.length})
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* 3. INTELLIGENT NAVIGATION MODULES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Intelligence Module */}
          <ModuleCard
            icon={<Heart className="h-6 w-6" />}
            title={language === "en" ? "Health Intelligence" : "Uelewa wa Afya"}
            description={language === "en" ? "Vaccination, illness tracking & vet notes" : "Chanjo, ufuatiliaji wa magonjwa"}
            stats={[
              { label: language === "en" ? "Vaccinations Due" : "Chanjo Zinazosubiri", value: "12", trend: "warning" },
              { label: language === "en" ? "Under Treatment" : "Chini ya Matibabu", value: "3", trend: "info" },
              { label: language === "en" ? "Healthy" : "Wenye Afya", value: "232", trend: "success" }
            ]}
            onClick={() => setActiveModule(activeModule === "health" ? null : "health")}
            isActive={activeModule === "health"}
            language={language}
          />

          {/* Breeding & Genetics Module */}
          <ModuleCard
            icon={<Baby className="h-6 w-6" />}
            title={language === "en" ? "Breeding & Genetics" : "Uzazi na Urithi"}
            description={language === "en" ? "Heat cycles, pregnancy tracking & lineage" : "Mzunguko wa joto, ufuatiliaji wa mimba"}
            stats={[
              { label: language === "en" ? "In Heat" : "Katika Joto", value: "3", trend: "warning" },
              { label: language === "en" ? "Pregnant" : "Wajawazito", value: "15", trend: "success" },
              { label: language === "en" ? "Due Soon" : "Karibu Kuzaa", value: "4", trend: "info" }
            ]}
            onClick={() => setActiveModule(activeModule === "breeding" ? null : "breeding")}
            isActive={activeModule === "breeding"}
            language={language}
          />

          {/* Production & Finance Module */}
          <ModuleCard
            icon={<BarChart3 className="h-6 w-6" />}
            title={language === "en" ? "Production & Finance" : "Uzalishaji na Fedha"}
            description={language === "en" ? "Yield trends, costs & revenue forecasts" : "Mwelekeo wa mavuno, gharama na utabiri"}
            stats={[
              { label: language === "en" ? "Daily Milk" : "Maziwa ya Leo", value: "1,247L", trend: "success" },
              { label: language === "en" ? "Feed Efficiency" : "Ufanisi wa Chakula", value: "94%", trend: "success" },
              { label: language === "en" ? "ROI" : "Faida", value: "+12.5%", trend: "success" }
            ]}
            onClick={() => setActiveModule(activeModule === "production" ? null : "production")}
            isActive={activeModule === "production"}
            language={language}
          />

          {/* Feed & Nutrition Module */}
          <ModuleCard
            icon={<Apple className="h-6 w-6" />}
            title={language === "en" ? "Feed & Nutrition" : "Chakula na Lishe"}
            description={language === "en" ? "Inventory, ration effectiveness & alerts" : "Akiba, ufanisi wa mgao na tahadhari"}
            stats={[
              { label: language === "en" ? "Days Remaining" : "Siku Zilizobaki", value: "5", trend: "warning" },
              { label: language === "en" ? "Cost/Animal" : "Gharama/Mnyama", value: "$2.30", trend: "info" },
              { label: language === "en" ? "Efficiency" : "Ufanisi", value: "91%", trend: "success" }
            ]}
            onClick={() => setActiveModule(activeModule === "feed" ? null : "feed")}
            isActive={activeModule === "feed"}
            language={language}
          />
        </div>

        {/* 4. AI DECISION-SUPPORT LAYER */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-[#2E7D32] h-1"></div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Brain className="h-5 w-5 text-gray-700" />
                {language === "en" ? "AI Decision Support" : "Usaidizi wa Maamuzi wa AI"}
              </h2>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <Sparkles className="h-4 w-4 text-gray-700" />
                <span className="text-xs font-medium text-gray-900">
                  {language === "en" ? "AI Powered" : "Inaendeshwa na AI"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div 
                  key={rec.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                          rec.impact === "high" 
                            ? "bg-red-100 text-red-700" 
                            : rec.impact === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {language === "en" ? `${rec.impact} Impact` : `Athari ${rec.impact === "high" ? "Kubwa" : rec.impact === "medium" ? "Ya Kati" : "Ndogo"}`}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Target className="h-3 w-3" />
                          <span>{rec.confidence}% {language === "en" ? "confidence" : "uhakika"}</span>
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    </div>
                    {rec.actionable && (
                      <button className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0">
                        {language === "en" ? "Apply" : "Tekeleza"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Zap className="h-4 w-4" />
              {language === "en" ? "Generate More Insights" : "Tengeneza Maarifa Zaidi"}
            </button>
          </div>
        </div>

        {/* 5. MARKET & ADVISORY INTEGRATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Signals */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              {language === "en" ? "Market Signals" : "Ishara za Soko"}
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{language === "en" ? "Cattle (Live)" : "Ng'ombe (Hai)"}</div>
                  <div className="text-sm text-gray-600 mt-0.5">TZS 850,000/head</div>
                </div>
                <div className="flex items-center gap-1 text-green-700 font-medium">
                  <TrendingUp className="h-4 w-4" />
                  +5.2%
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{language === "en" ? "Milk (per liter)" : "Maziwa (kwa lita)"}</div>
                  <div className="text-sm text-gray-600 mt-0.5">TZS 1,200/L</div>
                </div>
                <div className="flex items-center gap-1 text-gray-700 font-medium">
                  <Minus className="h-4 w-4" />
                  0%
                </div>
              </div>

              <button className="w-full mt-2 py-2 text-sm text-green-600 hover:text-green-700 font-medium flex items-center justify-center gap-2 border-t border-gray-200 pt-3">
                {language === "en" ? "View Full Market Data" : "Tazama Data Kamili ya Soko"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Vet & Advisory */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-gray-700" />
              {language === "en" ? "Vet & Advisory" : "Daktari na Washauri"}
            </h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{language === "en" ? "Request Tele-Vet" : "Omba Daktari Mtandaoni"}</div>
                  <div className="text-sm text-gray-600">{language === "en" ? "24/7 consultation" : "Ushauri 24/7"}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="p-2 bg-green-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{language === "en" ? "Chat with Expert" : "Ongea na Mtaalamu"}</div>
                  <div className="text-sm text-gray-600">{language === "en" ? "Get instant advice" : "Pata ushauri wa haraka"}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{language === "en" ? "Schedule Visit" : "Panga Ziara"}</div>
                  <div className="text-sm text-gray-600">{language === "en" ? "On-farm consultation" : "Ushauri shambani"}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* 6. TASKS & COMPLIANCE */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-[#2E7D32] h-1"></div>
          
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-gray-700" />
              {language === "en" ? "Tasks & Compliance" : "Kazi na Ufuatiliaji"}
            </h2>

            <div className="space-y-2">
              <TaskItem 
                title={language === "en" ? "Vaccinate 12 cattle - FMD vaccine" : "Chanjo ng'ombe 12 - Chanjo ya FMD"}
                dueDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                priority="high"
                language={language}
              />
              <TaskItem 
                title={language === "en" ? "Breeding window for COW-247, COW-189, COW-203" : "Dirisha la uzazi kwa COW-247, COW-189, COW-203"}
                dueDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)}
                priority="medium"
                language={language}
              />
              <TaskItem 
                title={language === "en" ? "Feed order - 500kg concentrate mix" : "Agizo la chakula - 500kg mchanganyiko"}
                dueDate={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)}
                priority="low"
                language={language}
              />
            </div>

            <button className="w-full mt-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" />
              {language === "en" ? "Add Custom Task" : "Ongeza Kazi Maalum"}
            </button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-[#2E7D32] rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-4">{language === "en" ? "Quick Actions" : "Vitendo vya Haraka"}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm border border-white/20">
              <Plus className="h-6 w-6" />
              <span className="text-sm font-medium">{language === "en" ? "Add Animal" : "Ongeza Mnyama"}</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm border border-white/20">
              <FileText className="h-6 w-6" />
              <span className="text-sm font-medium">{language === "en" ? "New Record" : "Rekodi Mpya"}</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm border border-white/20">
              <Download className="h-6 w-6" />
              <span className="text-sm font-medium">{language === "en" ? "Export Data" : "Hamisha Data"}</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm border border-white/20">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm font-medium">{language === "en" ? "Reports" : "Ripoti"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Module Card Component
interface ModuleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stats: Array<{ label: string; value: string; trend: "success" | "warning" | "info" }>;
  onClick: () => void;
  isActive: boolean;
  language: "en" | "sw";
}

function ModuleCard({ icon, title, description, stats, onClick, isActive, language }: ModuleCardProps) {
  return (
    <div 
      className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all cursor-pointer hover:shadow-md ${
        isActive ? "border-green-500 ring-2 ring-green-200" : "border-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isActive ? "bg-green-100" : "bg-gray-100"}`}>
              <div className={isActive ? "text-green-600" : "text-gray-600"}>{icon}</div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600 mt-0.5">{description}</p>
            </div>
          </div>
          <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${isActive ? "rotate-90" : ""}`} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className={`text-lg font-bold ${
                stat.trend === "success" ? "text-green-600" :
                stat.trend === "warning" ? "text-amber-600" :
                "text-gray-700"
              }`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {isActive && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <button className="w-full py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
            {language === "en" ? "Open Full Module" : "Fungua Moduli Kamili"}
          </button>
        </div>
      )}
    </div>
  );
}

// Task Item Component
interface TaskItemProps {
  title: string;
  dueDate: Date;
  priority: "high" | "medium" | "low";
  language: "en" | "sw";
}

function TaskItem({ title, dueDate, priority, language }: TaskItemProps) {
  const isOverdue = dueDate < new Date();
  const daysUntil = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <input type="checkbox" className="h-4 w-4 text-green-600 rounded" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 text-sm">{title}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className={`text-xs px-2 py-0.5 rounded ${
            priority === "high" ? "bg-red-100 text-red-700" :
            priority === "medium" ? "bg-amber-100 text-amber-700" :
            "bg-gray-100 text-gray-700"
          }`}>
            {priority === "high" ? (language === "en" ? "High" : "Juu") :
             priority === "medium" ? (language === "en" ? "Medium" : "Kati") :
             (language === "en" ? "Low" : "Chini")}
          </div>
          <div className={`text-xs flex items-center gap-1 ${isOverdue ? "text-red-600" : "text-gray-600"}`}>
            <Clock className="h-3 w-3" />
            <span>
              {isOverdue 
                ? (language === "en" ? "Overdue" : "Imepita") 
                : daysUntil === 0 
                ? (language === "en" ? "Today" : "Leo")
                : `${daysUntil} ${language === "en" ? "days" : "siku"}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}