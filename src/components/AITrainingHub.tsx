import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Brain, TrendingUp, CheckCircle, AlertCircle, Target, 
  Database, Zap, Globe, Shield, BarChart3, Activity,
  RefreshCw, Plus, Languages, Users, Clock, Award,
  LineChart, Settings, Upload, Download, Play, Pause,
  ChevronRight, Info, Eye, ThumbsUp, ThumbsDown, MessageSquare
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AITrainingHubProps {
  userId: string;
  userRole: string;
}

interface ModelMetrics {
  accuracy: number;
  responseTime: number;
  userSatisfaction: number;
  culturalRelevance: number;
  languageAccuracy: number;
  totalInteractions: number;
  improvementRate: number;
}

interface TrainingStatus {
  isTraining: boolean;
  lastUpdate: string;
  nextUpdate: string;
  modelsActive: number;
  datasetSize: number;
  performanceGain: number;
}

interface FeedbackItem {
  id: string;
  query: string;
  response: string;
  rating: number;
  feedback: string;
  language: string;
  context: string;
  timestamp: string;
}

export function AITrainingHub({ userId, userRole }: AITrainingHubProps) {
  const [metrics, setMetrics] = useState<ModelMetrics>({
    accuracy: 94.2,
    responseTime: 1.8,
    userSatisfaction: 4.6,
    culturalRelevance: 92.5,
    languageAccuracy: 96.3,
    totalInteractions: 45678,
    improvementRate: 12.4
  });

  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>({
    isTraining: true,
    lastUpdate: "2 hours ago",
    nextUpdate: "in 4 hours",
    modelsActive: 8,
    datasetSize: 2340000,
    performanceGain: 8.3
  });

  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([
    {
      id: "1",
      query: "Jinsi ya kupambana na wadudu kwenye mahindi?",
      response: "Tumia dawa za asili kama neem oil, panda mimea ya kurudisha wadudu...",
      rating: 5,
      feedback: "Very helpful and culturally appropriate",
      language: "sw",
      context: "pest_management",
      timestamp: "2 hours ago"
    },
    {
      id: "2",
      query: "Best fertilizer for tomatoes in coastal region?",
      response: "For coastal Tanzania, use NPK 15-15-15 during planting...",
      rating: 4,
      feedback: "Good but needs more local pricing info",
      language: "en",
      context: "fertilizer_advice",
      timestamp: "5 hours ago"
    }
  ]);

  const [activeTab, setActiveTab] = useState<"overview" | "training" | "feedback" | "optimization">("overview");
  const [autoLearnEnabled, setAutoLearnEnabled] = useState(true);
  const [privacyMode, setPrivacyMode] = useState("high");
  const [feedbackView, setFeedbackView] = useState<"review" | "upload">("review");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [accuracyThreshold, setAccuracyThreshold] = useState(90);
  const [satisfactionThreshold, setSatisfactionThreshold] = useState(4.0);

  const modelCategories = [
    {
      id: "crop_advisory",
      name: "Crop Advisory AI",
      icon: Brain,
      accuracy: 95.8,
      status: "optimizing",
      lastTrained: "1 hour ago",
      interactions: 12453,
      color: "text-green-600"
    },
    {
      id: "disease_detection",
      name: "Disease Detection AI",
      icon: Activity,
      accuracy: 93.2,
      status: "active",
      lastTrained: "3 hours ago",
      interactions: 8234,
      color: "text-red-600"
    },
    {
      id: "market_prediction",
      name: "Market Prediction AI",
      icon: TrendingUp,
      accuracy: 91.5,
      status: "active",
      lastTrained: "5 hours ago",
      interactions: 6789,
      color: "text-blue-600"
    },
    {
      id: "weather_insights",
      name: "Weather Insights AI",
      icon: Globe,
      accuracy: 96.4,
      status: "optimizing",
      lastTrained: "30 mins ago",
      interactions: 15678,
      color: "text-sky-600"
    },
    {
      id: "language_translation",
      name: "Swahili-English AI",
      icon: Languages,
      accuracy: 97.1,
      status: "active",
      lastTrained: "2 hours ago",
      interactions: 23456,
      color: "text-purple-600"
    },
    {
      id: "cultural_context",
      name: "Cultural Context AI",
      icon: Users,
      accuracy: 94.6,
      status: "optimizing",
      lastTrained: "1 hour ago",
      interactions: 9876,
      color: "text-orange-600"
    }
  ];

  const trainingPipeline = [
    {
      stage: "Data Collection",
      status: "active",
      progress: 100,
      description: "Gathering user interactions and feedback"
    },
    {
      stage: "Privacy Filtering",
      status: "active",
      progress: 100,
      description: "Anonymizing and protecting user data"
    },
    {
      stage: "Cultural Validation",
      status: "active",
      progress: 87,
      description: "Ensuring responses are culturally appropriate"
    },
    {
      stage: "Fine-tuning",
      status: "processing",
      progress: 65,
      description: "Optimizing models with regional data"
    },
    {
      stage: "Quality Assurance",
      status: "pending",
      progress: 0,
      description: "Testing improved models"
    },
    {
      stage: "Deployment",
      status: "pending",
      progress: 0,
      description: "Rolling out improvements"
    }
  ];

  const culturalContexts = [
    {
      region: "Tanzania - Coastal",
      language: "Swahili/English",
      crops: "Coconuts, Cashews, Rice",
      accuracy: 96.2,
      dataPoints: 45000
    },
    {
      region: "Tanzania - Northern",
      language: "Swahili/Maasai",
      crops: "Coffee, Maize, Beans",
      accuracy: 94.8,
      dataPoints: 38000
    },
    {
      region: "Tanzania - Southern",
      language: "Swahili",
      crops: "Tobacco, Cashews, Maize",
      accuracy: 93.5,
      dataPoints: 32000
    },
    {
      region: "Tanzania - Central",
      language: "Swahili",
      crops: "Sunflower, Sorghum, Cotton",
      accuracy: 95.1,
      dataPoints: 41000
    }
  ];

  const handleForceRetrain = () => {
    toast.success("Manual retraining initiated! Models will update in 15-20 minutes.");
  };

  const handleExportMetrics = () => {
    toast.success("Performance metrics exported successfully!");
  };

  const handleToggleAutoLearn = () => {
    setAutoLearnEnabled(!autoLearnEnabled);
    toast.success(autoLearnEnabled ? "Auto-learning paused" : "Auto-learning enabled");
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    // Validate file type
    const validTypes = ['.csv', '.json', '.txt', '.xlsx'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(fileExtension)) {
      toast.error("Invalid file type. Please upload CSV, JSON, TXT, or XLSX files.");
      return;
    }
    
    setUploadedFile(file);
    toast.success(`${file.name} uploaded successfully! Processing for training...`);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 p-6 md:p-8 text-white shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-400/5 rounded-full blur-2xl"></div>
        
        <div className="relative space-y-6">
          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl">
                <Brain className="h-8 w-8 md:h-10 md:w-10" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 leading-tight">
                  AI Training & Optimization Hub
                </h1>
                <p className="text-white/90 text-sm md:text-lg font-medium">
                  Self-Learning Intelligence for Tanzanian Agriculture
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <div className={`
                px-4 py-2.5 rounded-xl backdrop-blur-lg shadow-lg
                ${autoLearnEnabled 
                  ? 'bg-white/25 border-2 border-white/40' 
                  : 'bg-red-500/40 border-2 border-red-300/50'
                }
              `}>
                <div className="flex items-center gap-2.5">
                  <div className={`
                    w-2.5 h-2.5 rounded-full 
                    ${autoLearnEnabled ? 'bg-white shadow-lg shadow-white/50 animate-pulse' : 'bg-red-200'}
                  `}></div>
                  <span className="font-bold text-sm whitespace-nowrap">
                    {autoLearnEnabled ? 'Auto-Learning Active' : 'Manual Mode'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Accuracy Card */}
            <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 border border-white/25 hover:bg-white/20 transition-all shadow-lg group">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs md:text-sm font-bold text-white/90">Accuracy</span>
              </div>
              <div className="text-2xl md:text-3xl font-black mb-1">{metrics.accuracy}%</div>
              <div className="flex items-center gap-1 text-xs text-white/80 font-semibold">
                <TrendingUp className="h-3 w-3" />
                <span>+{metrics.improvementRate}% this month</span>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 border border-white/25 hover:bg-white/20 transition-all shadow-lg group">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs md:text-sm font-bold text-white/90">Response Time</span>
              </div>
              <div className="text-2xl md:text-3xl font-black mb-1">{metrics.responseTime}s</div>
              <div className="flex items-center gap-1 text-xs text-white/80 font-semibold">
                <Activity className="h-3 w-3" />
                <span>-0.4s improvement</span>
              </div>
            </div>

            {/* User Satisfaction Card */}
            <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 border border-white/25 hover:bg-white/20 transition-all shadow-lg group">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs md:text-sm font-bold text-white/90">User Satisfaction</span>
              </div>
              <div className="text-2xl md:text-3xl font-black mb-1">{metrics.userSatisfaction}/5</div>
              <div className="text-xs text-white/80 font-semibold truncate">
                {metrics.totalInteractions.toLocaleString()} interactions
              </div>
            </div>

            {/* Cultural Relevance Card */}
            <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 border border-white/25 hover:bg-white/20 transition-all shadow-lg group">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs md:text-sm font-bold text-white/90">Cultural Relevance</span>
              </div>
              <div className="text-2xl md:text-3xl font-black mb-1">{metrics.culturalRelevance}%</div>
              <div className="flex items-center gap-1 text-xs text-white/80 font-semibold">
                <CheckCircle className="h-3 w-3" />
                <span>Tanzania-optimized</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "overview", label: "Overview", icon: Eye },
          { id: "training", label: "Training Pipeline", icon: RefreshCw },
          { id: "feedback", label: "Feedback Analysis", icon: MessageSquare },
          { id: "optimization", label: "Optimization", icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                relative flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all duration-300
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-200 scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-green-300 border-2 border-gray-200 hover:scale-102'
                }
              `}
            >
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-xl animate-pulse"></div>
              )}
              <Icon className={`h-4 w-4 relative z-10 ${activeTab === tab.id ? 'text-white' : 'text-gray-600'}`} />
              <span className="relative z-10">{tab.label}</span>
              {activeTab === tab.id && (
                <CheckCircle className="h-4 w-4 relative z-10 ml-auto" />
              )}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* AI Models Grid */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              Active AI Models
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modelCategories.map((model) => {
                const Icon = model.icon;
                return (
                  <Card 
                    key={model.id} 
                    className={`
                      group relative overflow-hidden transition-all duration-300 border-2 hover:shadow-2xl hover:scale-105
                      ${model.status === 'optimizing' 
                        ? 'border-yellow-200 hover:border-yellow-400 bg-gradient-to-br from-yellow-50/50 to-orange-50/30' 
                        : 'border-green-200 hover:border-green-400 bg-gradient-to-br from-green-50/50 to-emerald-50/30'
                      }
                    `}
                  >
                    {/* Animated Background Accent */}
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 transition-all group-hover:opacity-30 ${
                      model.status === 'optimizing' ? 'bg-yellow-400' : 'bg-green-400'
                    }`}></div>
                    
                    <CardHeader className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`
                            p-3 rounded-xl border-2 shadow-lg transition-all group-hover:scale-110 group-hover:rotate-3
                            ${model.status === 'optimizing' 
                              ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300' 
                              : 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-300'
                            }
                          `}>
                            <Icon className={`h-6 w-6 ${model.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-base font-black text-gray-900">{model.name}</CardTitle>
                            <CardDescription className="text-xs font-semibold mt-1">
                              {model.interactions.toLocaleString()} interactions
                            </CardDescription>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className={`
                        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border-2 shadow-md
                        ${model.status === 'optimizing' 
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-300' 
                          : 'bg-green-100 text-green-700 border-green-300'
                        }
                      `}>
                        {model.status === 'optimizing' && <RefreshCw className="h-3 w-3 animate-spin" />}
                        {model.status === 'active' && <CheckCircle className="h-3 w-3" />}
                        {model.status === 'optimizing' ? 'Learning' : 'Active'}
                      </div>
                    </CardHeader>

                    <CardContent className="relative z-10">
                      <div className="space-y-4">
                        {/* Accuracy Display */}
                        <div className={`
                          p-4 rounded-xl border-2 shadow-sm
                          ${model.status === 'optimizing' 
                            ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                            : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                          }
                        `}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Target className={`h-4 w-4 ${model.status === 'optimizing' ? 'text-yellow-600' : 'text-green-600'}`} />
                              <span className="text-sm font-bold text-gray-700">Accuracy</span>
                            </div>
                            <span className={`text-2xl font-black ${model.status === 'optimizing' ? 'text-yellow-700' : 'text-green-700'}`}>
                              {model.accuracy}%
                            </span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                            <div 
                              className={`
                                h-3 rounded-full transition-all duration-500
                                ${model.status === 'optimizing' 
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                                  : 'bg-gradient-to-r from-green-500 to-emerald-500'
                                }
                              `}
                              style={{ width: `${model.accuracy}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Last Updated */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-gray-500 font-semibold">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Updated {model.lastTrained}</span>
                          </div>
                          <Activity className={`h-4 w-4 ${model.status === 'optimizing' ? 'text-yellow-500 animate-pulse' : 'text-green-500'}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Cultural Context Performance */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-orange-600" />
                Regional & Cultural Optimization
              </CardTitle>
              <CardDescription>AI performance across Tanzanian regions and contexts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {culturalContexts.map((context, index) => (
                  <div key={index} className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{context.region}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Languages className="h-3 w-3" />
                            {context.language}
                          </span>
                          <span className="text-sm text-gray-600">{context.crops}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-orange-600">{context.accuracy}%</div>
                        <div className="text-xs text-gray-500">{context.dataPoints.toLocaleString()} data points</div>
                      </div>
                    </div>
                    <div className="w-full bg-orange-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full"
                        style={{ width: `${context.accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Training Pipeline Tab */}
      {activeTab === "training" && (
        <div className="space-y-6">
          <Card className="border-2 border-green-200 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-b-2 border-green-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300 ${trainingStatus.isTraining ? 'animate-pulse' : ''}`}>
                    <RefreshCw className={`h-7 w-7 text-green-700 ${trainingStatus.isTraining ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      Continuous Learning Pipeline
                    </CardTitle>
                    <CardDescription className="mt-1 font-semibold">
                      Real-time AI improvement workflow
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleToggleAutoLearn}
                    variant="outline"
                    className="border-2 border-green-300 hover:bg-green-50 font-bold"
                  >
                    {autoLearnEnabled ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {autoLearnEnabled ? 'Pause' : 'Resume'}
                  </Button>
                  <Button
                    onClick={handleForceRetrain}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-bold shadow-lg"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Force Retrain
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-gradient-to-b from-white to-gray-50 max-h-[600px] overflow-y-auto">
              <div className="space-y-2">
                {trainingPipeline.map((stage, index) => (
                  <div key={index} className="relative">
                    <div className={`
                      flex items-center gap-4 p-4 rounded-xl transition-all duration-300 border-2
                      ${stage.status === 'active' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md' : ''}
                      ${stage.status === 'processing' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 shadow-lg animate-pulse' : ''}
                      ${stage.status === 'pending' ? 'bg-gray-50 border-gray-200' : ''}
                    `}>
                      {/* Status Icon */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center border-2 font-bold shadow-lg transition-all
                          ${stage.status === 'active' ? 'bg-green-500 border-green-600 text-white' : ''}
                          ${stage.status === 'processing' ? 'bg-yellow-500 border-yellow-600 text-white' : ''}
                          ${stage.status === 'pending' ? 'bg-gray-200 border-gray-300 text-gray-500' : ''}
                        `}>
                          {stage.status === 'active' && <CheckCircle className="h-6 w-6" />}
                          {stage.status === 'processing' && <RefreshCw className="h-6 w-6 animate-spin" />}
                          {stage.status === 'pending' && <Clock className="h-6 w-6" />}
                        </div>
                        {index < trainingPipeline.length - 1 && (
                          <div className={`w-1 h-4 rounded-full ${
                            stage.status === 'active' ? 'bg-green-400' : 
                            stage.status === 'processing' ? 'bg-yellow-400' : 
                            'bg-gray-300'
                          }`}></div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 mb-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-base">{stage.stage}</h3>
                            <span className={`
                              px-3 py-1.5 rounded-full text-xs font-bold border-2 shadow-sm
                              ${stage.status === 'active' ? 'bg-green-50 text-green-700 border-green-300' : ''}
                              ${stage.status === 'processing' ? 'bg-yellow-50 text-yellow-700 border-yellow-300' : ''}
                              ${stage.status === 'pending' ? 'bg-gray-50 text-gray-600 border-gray-300' : ''}
                            `}>
                              {stage.status === 'active' ? 'Complete' : stage.status === 'processing' ? 'In Progress' : 'Pending'}
                            </span>
                          </div>
                          <div className={`text-lg font-black px-4 py-2 rounded-xl shadow-sm ${
                            stage.status === 'active' ? 'bg-green-100 text-green-800 border-2 border-green-300' : 
                            stage.status === 'processing' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' : 
                            'bg-gray-100 text-gray-600 border-2 border-gray-300'
                          }`}>
                            {stage.progress}%
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 font-medium">{stage.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              stage.status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 
                              stage.status === 'processing' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                              'bg-gray-300'
                            }`}
                            style={{ width: `${stage.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Privacy Notice */}
              <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  </div>
                  <div>
                    <h4 className="font-black text-blue-900 mb-2 flex items-center gap-2">
                      Privacy-First Learning
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </h4>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      All user data is anonymized before training. Personal information is never stored or used in model updates. 
                      Cultural context and language patterns are learned while protecting individual privacy.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Statistics */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Training Dataset
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-gray-900 mb-1">
                  {(trainingStatus.datasetSize / 1000000).toFixed(2)}M
                </div>
                <p className="text-sm text-gray-600">Data points collected</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-green-600 font-semibold">
                  <TrendingUp className="h-3 w-3" />
                  +125K this week
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Plus className="h-5 w-5 text-purple-600" />
                  Performance Gain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-gray-900 mb-1">
                  +{trainingStatus.performanceGain}%
                </div>
                <p className="text-sm text-gray-600">Since last month</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-purple-600 font-semibold">
                  <Activity className="h-3 w-3" />
                  Continuous improvement
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Privacy Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-gray-900 mb-1 capitalize">
                  {privacyMode}
                </div>
                <p className="text-sm text-gray-600">Protection level</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-green-600 font-semibold">
                  <CheckCircle className="h-3 w-3" />
                  Full compliance
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Feedback Analysis Tab */}
      {activeTab === "feedback" && (
        <div className="space-y-6">
          {/* View Toggle & Stats */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Toggle Buttons */}
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setFeedbackView("review")}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      feedbackView === "review"
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                    Review Feedback
                  </button>
                  <button
                    onClick={() => setFeedbackView("upload")}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      feedbackView === "upload"
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Dataset
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-2xl font-black text-blue-600">{feedbackData.length}</div>
                    <div className="text-xs text-gray-600 font-semibold">Total Items</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-green-600">
                      {feedbackData.filter(item => item.rating >= 4).length}
                    </div>
                    <div className="text-xs text-gray-600 font-semibold">High Quality</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-purple-600">
                      {uploadedFile ? '1' : '0'}
                    </div>
                    <div className="text-xs text-gray-600 font-semibold">Uploaded Files</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review View */}
          {feedbackView === "review" && (
            <Card className="border-2 border-green-200 shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-b-2 border-green-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl border-2 border-green-300 shadow-lg">
                      <MessageSquare className="h-6 w-6 text-green-700" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl font-black">
                        User Feedback Review
                      </CardTitle>
                      <CardDescription className="mt-1 font-semibold">
                        Review and curate user interactions for AI training
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={() => toast.success("Exporting feedback data...")}
                    variant="outline"
                    size="sm"
                    className="border-2 border-green-300 hover:bg-green-50 font-bold"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-b from-white to-gray-50">
                <div className="space-y-4">
                  {feedbackData.map((item, index) => (
                    <div
                      key={item.id}
                      className={`
                        group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]
                        ${item.rating >= 4 
                          ? 'border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/30 hover:border-green-400' 
                          : item.rating >= 3 
                          ? 'border-yellow-200 bg-gradient-to-br from-yellow-50/50 to-orange-50/30 hover:border-yellow-400' 
                          : 'border-red-200 bg-gradient-to-br from-red-50/50 to-pink-50/30 hover:border-red-400'
                        }
                      `}
                    >
                      {/* Animated Background Glow */}
                      <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10 transition-all group-hover:opacity-20 ${
                        item.rating >= 4 ? 'bg-green-400' : item.rating >= 3 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>

                      {/* Side Accent Bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl ${
                        item.rating >= 4 ? 'bg-gradient-to-b from-green-500 to-emerald-500' : 
                        item.rating >= 3 ? 'bg-gradient-to-b from-yellow-500 to-orange-500' : 
                        'bg-gradient-to-b from-red-500 to-pink-500'
                      }`}></div>
                      
                      <div className="relative z-10 p-6 pl-8">
                        {/* Header Row */}
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Index Badge */}
                            <div className={`
                              px-3 py-2 rounded-xl border-2 shadow-md font-black text-sm
                              ${item.rating >= 4 
                                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300' 
                                : item.rating >= 3 
                                ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-300' 
                                : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-300'
                              }
                            `}>
                              #{index + 1}
                            </div>

                            {/* Language Badge */}
                            <span className={`
                              px-3 py-2 rounded-xl text-xs font-bold border-2 shadow-sm flex items-center gap-1.5
                              ${item.language === 'sw' 
                                ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-300' 
                                : 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-purple-300'
                              }
                            `}>
                              <Languages className="h-3.5 w-3.5" />
                              {item.language === 'sw' ? 'Swahili' : 'English'}
                            </span>

                            {/* Context Badge */}
                            <span className="px-3 py-2 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 rounded-xl text-xs font-bold border-2 border-gray-300 shadow-sm">
                              {item.context.replace('_', ' ').toUpperCase()}
                            </span>

                            {/* Timestamp */}
                            <span className="text-xs text-gray-500 font-semibold flex items-center gap-1.5 px-2">
                              <Clock className="h-3.5 w-3.5" />
                              {item.timestamp}
                            </span>
                          </div>
                          
                          {/* Rating Display */}
                          <div className={`
                            flex flex-col items-center px-4 py-2 rounded-xl border-2 shadow-lg
                            ${item.rating >= 4 
                              ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-300' 
                              : item.rating >= 3 
                              ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300' 
                              : 'bg-gradient-to-br from-red-100 to-pink-100 border-red-300'
                            }
                          `}>
                            <div className="flex items-center gap-0.5 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`text-xl ${
                                    i < item.rating 
                                      ? item.rating >= 4 ? 'text-green-600' : item.rating >= 3 ? 'text-yellow-600' : 'text-red-600'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <div className={`text-xs font-black ${
                              item.rating >= 4 ? 'text-green-700' : item.rating >= 3 ? 'text-yellow-700' : 'text-red-700'
                            }`}>
                              {item.rating}.0 / 5.0
                            </div>
                          </div>
                        </div>

                        {/* Content Cards */}
                        <div className="grid md:grid-cols-2 gap-4 mb-5">
                          {/* Query Card */}
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-blue-200 shadow-md hover:shadow-lg transition-all">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg border border-blue-300">
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                              </div>
                              <p className="text-xs font-black text-blue-900 uppercase tracking-wide">User Query</p>
                            </div>
                            <p className="text-sm text-gray-800 leading-relaxed font-medium">{item.query}</p>
                          </div>

                          {/* Response Card */}
                          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-green-200 shadow-md hover:shadow-lg transition-all">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg border border-green-300">
                                <Brain className="h-4 w-4 text-green-600" />
                              </div>
                              <p className="text-xs font-black text-green-900 uppercase tracking-wide">AI Response</p>
                            </div>
                            <p className="text-sm text-gray-800 leading-relaxed font-medium">{item.response}</p>
                          </div>
                        </div>

                        {/* Feedback Card */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border-2 border-orange-200 mb-5 shadow-md">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-orange-200 rounded-lg border border-orange-300">
                              <Users className="h-4 w-4 text-orange-700" />
                            </div>
                            <p className="text-xs font-black text-orange-900 uppercase tracking-wide">User Feedback</p>
                          </div>
                          <p className="text-sm text-orange-900 font-semibold italic">"{item.feedback}"</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                            onClick={() => toast.success("Added to training dataset!")}
                          >
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Approve for Training
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 border-2 border-red-300 text-red-600 hover:bg-red-50 font-bold hover:border-red-400 transition-all"
                            onClick={() => toast.info("Removed from training queue")}
                          >
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            Discard
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload View */}
          {feedbackView === "upload" && (
            <Card className="border-2 border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-6 w-6 text-green-600" />
                  Upload Training Dataset
                </CardTitle>
                <CardDescription className="mt-1">
                  Upload CSV, JSON, TXT, or XLSX files to enhance AI training
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Drag and Drop Zone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                      relative border-4 border-dashed rounded-2xl p-12 transition-all duration-300 text-center
                      ${dragActive 
                        ? 'border-green-500 bg-green-50 scale-105' 
                        : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-green-400 hover:bg-green-50/50'
                      }
                    `}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      accept=".csv,.json,.txt,.xlsx"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    
                    <div className="flex flex-col items-center">
                      <div className={`
                        p-6 rounded-full mb-6 transition-all
                        ${dragActive ? 'bg-green-500' : 'bg-gradient-to-br from-green-100 to-emerald-100'}
                      `}>
                        <Upload className={`h-12 w-12 ${dragActive ? 'text-white animate-bounce' : 'text-green-600'}`} />
                      </div>
                      
                      <h3 className="text-2xl font-black text-gray-900 mb-2">
                        {dragActive ? 'Drop your file here!' : 'Upload Training Data'}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 max-w-md">
                        Drag and drop your dataset file here, or click the button below to browse
                      </p>
                      
                      <label htmlFor="file-upload">
                        <Button 
                          type="button"
                          onClick={() => document.getElementById('file-upload')?.click()}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-6 text-lg shadow-xl"
                        >
                          <Database className="h-5 w-5 mr-2" />
                          Choose File
                        </Button>
                      </label>
                      
                      <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>CSV</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>JSON</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>TXT</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>XLSX</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded File Preview */}
                  {uploadedFile && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="p-4 bg-green-600 rounded-xl">
                            <Database className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-gray-900 mb-1">
                              {uploadedFile.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Size: {(uploadedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setUploadedFile(null);
                            toast.info("File removed");
                          }}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        </button>
                      </div>

                      {/* File Info */}
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-2xl font-black text-green-600">Ready</div>
                          <div className="text-xs text-gray-600 font-semibold mt-1">Status</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-2xl font-black text-blue-600">
                            {uploadedFile.name.substring(uploadedFile.name.lastIndexOf('.') + 1).toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-600 font-semibold mt-1">Format</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                          <div className="text-2xl font-black text-purple-600">Auto</div>
                          <div className="text-xs text-gray-600 font-semibold mt-1">Processing</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-bold shadow-lg"
                          onClick={() => toast.success("Training initiated with uploaded dataset!")}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Start Training
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 border-2 font-bold"
                          onClick={() => toast.info("Dataset preview loading...")}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Data
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Guidelines */}
                  <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-black text-blue-900 mb-3">Dataset Upload Guidelines</h4>
                        <ul className="space-y-2 text-sm text-blue-800">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Include query-response pairs with ratings and context</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Use Swahili or English language data for best results</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Ensure data is anonymized and privacy-compliant</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Maximum file size: 50MB per upload</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Optimization Tab */}
      {activeTab === "optimization" && (
        <div className="space-y-6">
          <Card className="border-2 border-green-200 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-b-2 border-green-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl border-2 border-green-300 shadow-lg">
                  <Settings className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl font-black">
                    AI Optimization Settings
                  </CardTitle>
                  <CardDescription className="mt-1 font-semibold">
                    Configure automatic learning and improvement parameters
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-gradient-to-b from-white to-gray-50">
              <div className="space-y-6">
                {/* Auto-Learning Toggle */}
                <div className={`
                  relative overflow-hidden p-5 rounded-xl border-2 shadow-lg transition-all hover:shadow-xl
                  ${autoLearnEnabled 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
                    : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300'
                  }
                `}>
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 ${
                    autoLearnEnabled ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`
                        p-3 rounded-xl border-2 shadow-md transition-all
                        ${autoLearnEnabled 
                          ? 'bg-green-100 border-green-300' 
                          : 'bg-gray-100 border-gray-300'
                        }
                      `}>
                        <Zap className={`h-5 w-5 ${autoLearnEnabled ? 'text-green-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 mb-1 text-lg">Auto-Learning Mode</h3>
                        <p className="text-sm text-gray-600 font-medium">Continuously improve from user interactions</p>
                      </div>
                    </div>
                    <button
                      onClick={handleToggleAutoLearn}
                      className={`
                        relative w-20 h-10 rounded-full transition-all shadow-lg
                        ${autoLearnEnabled ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-300'}
                      `}
                    >
                      <div className={`
                        absolute top-1 w-8 h-8 bg-white rounded-full transition-all duration-300 shadow-md flex items-center justify-center
                        ${autoLearnEnabled ? 'left-[calc(100%-36px)]' : 'left-1'}
                      `}>
                        {autoLearnEnabled ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Privacy Level */}
                <div className="relative overflow-hidden p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 shadow-lg">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 bg-blue-400"></div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg border border-blue-300">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-black text-gray-900 text-lg">Privacy Protection Level</h3>
                    </div>
                    <div className="space-y-3">
                      {['high', 'medium', 'low'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setPrivacyMode(level)}
                          className={`
                            w-full p-4 rounded-xl border-2 text-left transition-all shadow-md hover:shadow-lg hover:scale-[1.02]
                            ${privacyMode === level
                              ? 'border-blue-400 bg-gradient-to-r from-blue-100 to-cyan-100 shadow-lg scale-[1.02]'
                              : 'border-gray-200 bg-white hover:border-blue-300'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`
                                w-3 h-3 rounded-full border-2 transition-all
                                ${privacyMode === level 
                                  ? 'bg-blue-500 border-blue-600 shadow-lg' 
                                  : 'bg-gray-200 border-gray-300'
                                }
                              `}></div>
                              <div>
                                <span className="font-black text-gray-900 capitalize text-base">{level}</span>
                                <p className="text-xs text-gray-600 mt-1 font-medium">
                                  {level === 'high' && 'Maximum anonymization, slower learning'}
                                  {level === 'medium' && 'Balanced privacy and learning speed'}
                                  {level === 'low' && 'Faster learning, more data used'}
                                </p>
                              </div>
                            </div>
                            {privacyMode === level && (
                              <CheckCircle className="h-6 w-6 text-blue-600" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Performance Thresholds */}
                <div className="relative overflow-hidden p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 shadow-lg">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 bg-orange-400"></div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-100 rounded-lg border border-orange-300">
                        <Target className="h-5 w-5 text-orange-600" />
                      </div>
                      <h3 className="font-black text-gray-900 text-lg">Auto-Retrain Thresholds</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-5 font-medium">Trigger automatic retraining when metrics drop below:</p>
                    
                    <div className="space-y-5">
                      {/* Accuracy Threshold */}
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border-2 border-orange-200 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-orange-600" />
                            <label className="text-sm font-black text-gray-900">Accuracy Threshold</label>
                          </div>
                          <span className="text-xl font-black text-orange-600 px-3 py-1 bg-orange-100 rounded-lg border border-orange-300">
                            {accuracyThreshold}%
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min="85" 
                          max="98" 
                          value={accuracyThreshold} 
                          onChange={(e) => setAccuracyThreshold(parseInt(e.target.value))} 
                          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-orange-500"
                          style={{
                            background: `linear-gradient(to right, rgb(249 115 22) 0%, rgb(249 115 22) ${((accuracyThreshold - 85) / (98 - 85)) * 100}%, rgb(229 231 235) ${((accuracyThreshold - 85) / (98 - 85)) * 100}%, rgb(229 231 235) 100%)`
                          }}
                        />
                      </div>

                      {/* Satisfaction Threshold */}
                      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border-2 border-orange-200 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-orange-600" />
                            <label className="text-sm font-black text-gray-900">User Satisfaction</label>
                          </div>
                          <span className="text-xl font-black text-orange-600 px-3 py-1 bg-orange-100 rounded-lg border border-orange-300">
                            {satisfactionThreshold.toFixed(1)}/5
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min="3" 
                          max="5" 
                          step="0.1" 
                          value={satisfactionThreshold} 
                          onChange={(e) => setSatisfactionThreshold(parseFloat(e.target.value))} 
                          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-orange-500"
                          style={{
                            background: `linear-gradient(to right, rgb(249 115 22) 0%, rgb(249 115 22) ${((satisfactionThreshold - 3) / (5 - 3)) * 100}%, rgb(229 231 235) ${((satisfactionThreshold - 3) / (5 - 3)) * 100}%, rgb(229 231 235) 100%)`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export & Backup */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    onClick={handleExportMetrics}
                    variant="outline"
                    className="border-2 border-green-300 hover:bg-green-50 font-bold h-12 shadow-md hover:shadow-lg transition-all"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Export Performance Data
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-blue-300 hover:bg-blue-50 font-bold h-12 shadow-md hover:shadow-lg transition-all"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Import Training Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}