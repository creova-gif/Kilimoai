import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Brain, TrendingUp, CheckCircle, AlertCircle, Target, 
  Database, Zap, Globe, Shield, BarChart3, Activity,
  RefreshCw, Plus, Languages, Users, Clock, Award,
  LineChart, Settings, Upload, Download, Play, Pause,
  ChevronRight, Info, Eye, ThumbsUp, ThumbsDown, MessageSquare, AlertTriangle
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
  // ⚠️ DEMO DATA - All metrics below are sample data for demonstration
  const [metrics, setMetrics] = useState<ModelMetrics>({
    accuracy: 94.2,
    responseTime: 1.8,
    userSatisfaction: 4.6,
    culturalRelevance: 92.5,
    languageAccuracy: 96.3,
    totalInteractions: 45678,
    improvementRate: 12.4
  });

  // ⚠️ DEMO DATA - Training status is hardcoded for demonstration
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>({
    isTraining: true,
    lastUpdate: "2 hours ago",
    nextUpdate: "in 4 hours",
    modelsActive: 8,
    datasetSize: 2340000,
    performanceGain: 8.3
  });

  // ⚠️ DEMO DATA - Sample feedback items for demonstration
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
  const [isDemoMode, setIsDemoMode] = useState(true);

  // ⚠️ DEMO DATA - Hardcoded model categories
  const modelCategories = [
    {
      id: "crop_advisory",
      name: "Crop Advisory AI",
      icon: Brain,
      accuracy: 95.8,
      status: "optimizing",
      lastTrained: "1 hour ago",
      interactions: 12453,
      color: "text-[#2E7D32]"
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
      color: "text-gray-700"
    },
    {
      id: "weather_insights",
      name: "Weather Insights AI",
      icon: Globe,
      accuracy: 96.4,
      status: "optimizing",
      lastTrained: "30 mins ago",
      interactions: 15678,
      color: "text-gray-700"
    },
    {
      id: "language_translation",
      name: "Swahili-English AI",
      icon: Languages,
      accuracy: 97.1,
      status: "active",
      lastTrained: "2 hours ago",
      interactions: 23456,
      color: "text-gray-700"
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

  useEffect(() => {
    console.log('[AITrainingHub] Component mounted - DEMO MODE active');
    console.log('[AITrainingHub] User:', userId, 'Role:', userRole);
  }, [userId, userRole]);

  const handleForceRetrain = () => {
    console.log('[AITrainingHub] Manual retraining initiated by user:', userId);
    toast.success("Manual retraining initiated! Models will update in 15-20 minutes.");
  };

  const handleExportMetrics = () => {
    console.log('[AITrainingHub] Metrics export requested by user:', userId);
    toast.success("Performance metrics exported successfully!");
  };

  const handleToggleAutoLearn = () => {
    const newState = !autoLearnEnabled;
    setAutoLearnEnabled(newState);
    console.log('[AITrainingHub] Auto-learning toggled:', newState);
    toast.success(newState ? "Auto-learning enabled" : "Auto-learning paused");
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
    console.log('[AITrainingHub] File upload initiated:', file.name, file.size);
    
    // Validate file type
    const validTypes = ['.csv', '.json', '.txt', '.xlsx'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(fileExtension)) {
      console.error('[AITrainingHub] Invalid file type:', fileExtension);
      toast.error("Invalid file type. Please upload CSV, JSON, TXT, or XLSX files.");
      return;
    }
    
    setUploadedFile(file);
    console.log('[AITrainingHub] File uploaded successfully:', file.name);
    toast.success(`${file.name} uploaded successfully! Processing for training...`);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "training", label: "Training", icon: RefreshCw },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "optimization", label: "Optimization", icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Demo Data Warning Banner */}
      {isDemoMode && (
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-orange-900 mb-1">Demo Data Mode</p>
                <p className="text-sm text-orange-800">
                  You're viewing sample AI training metrics. Connect your production AI system for real data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-[#2E7D32] p-6 md:p-8 text-white shadow-2xl">
        <div className="relative space-y-6">
          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl">
                <Brain className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  AI Training Hub
                </h1>
                <p className="text-white/90 text-base md:text-lg font-medium">
                  Continuous learning system for culturally-aware AI models
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleExportMetrics}
                className="bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 text-white font-bold"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Metrics
              </Button>
              <Button 
                onClick={handleForceRetrain}
                className="bg-white text-[#2E7D32] hover:bg-white/90 font-bold shadow-lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Force Retrain
              </Button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4" />
                <p className="text-xs font-bold uppercase tracking-wide text-white/80">Accuracy</p>
              </div>
              <p className="text-2xl font-bold">{metrics.accuracy}%</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4" />
                <p className="text-xs font-bold uppercase tracking-wide text-white/80">Response</p>
              </div>
              <p className="text-2xl font-bold">{metrics.responseTime}s</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4" />
                <p className="text-xs font-bold uppercase tracking-wide text-white/80">Satisfaction</p>
              </div>
              <p className="text-2xl font-bold">{metrics.userSatisfaction}/5</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4" />
                <p className="text-xs font-bold uppercase tracking-wide text-white/80">Improvement</p>
              </div>
              <p className="text-2xl font-bold">+{metrics.improvementRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              console.log('[AITrainingHub] Tab changed to:', tab.id);
            }}
            className={`
              relative px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center gap-2
              ${activeTab === tab.id
                ? 'bg-[#2E7D32] text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }
            `}
          >
            <tab.icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Active AI Models */}
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="h-6 w-6 text-[#2E7D32]" />
                Active AI Models
              </h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modelCategories.map((model) => (
                  <Card 
                    key={model.id}
                    className={`
                      relative border-2 transition-all hover:shadow-lg
                      ${model.status === 'optimizing' 
                        ? 'border-yellow-200 hover:border-yellow-400 bg-yellow-50/30' 
                        : 'border-gray-200 hover:border-[#2E7D32] bg-white'
                      }
                    `}
                  >
                    <CardContent className="p-4">
                      {/* Status Indicator */}
                      <div className="absolute top-3 right-3">
                        <div className={`
                          px-2 py-1 rounded-full text-xs font-bold border-2
                          ${model.status === 'optimizing' 
                            ? 'bg-yellow-100 border-yellow-300 text-yellow-700' 
                            : 'bg-green-100 border-green-300 text-green-700'
                          }
                        `}>
                          {model.status === 'optimizing' ? 'Training' : 'Active'}
                        </div>
                      </div>

                      {/* Icon */}
                      <div className={`
                        inline-flex p-3 rounded-xl mb-3 border-2
                        ${model.status === 'optimizing' 
                          ? 'bg-yellow-50 border-yellow-200' 
                          : 'bg-green-50 border-gray-200'
                        }
                      `}>
                        <model.icon className={`h-6 w-6 ${model.color}`} />
                      </div>

                      {/* Model Info */}
                      <h3 className="font-bold text-gray-900 mb-2">{model.name}</h3>
                      
                      {/* Stats */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Accuracy</span>
                          <span className="font-bold text-[#2E7D32]">{model.accuracy}%</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              model.status === 'optimizing' 
                                ? 'bg-yellow-500' 
                                : 'bg-[#2E7D32]'
                            }`}
                            style={{ width: `${model.accuracy}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                          <span>{model.interactions.toLocaleString()} interactions</span>
                          <span>{model.lastTrained}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cultural Context Coverage */}
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#2E7D32]" />
                Cultural Context Coverage
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {culturalContexts.map((context, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-2">{context.region}</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700"><span className="font-bold">Language:</span> {context.language}</p>
                      <p className="text-gray-700"><span className="font-bold">Crops:</span> {context.crops}</p>
                      <p className="text-[#2E7D32] font-bold">Accuracy: {context.accuracy}%</p>
                      <p className="text-gray-600 text-xs">{context.dataPoints.toLocaleString()} data points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Training Tab */}
      {activeTab === "training" && (
        <div className="space-y-6">
          <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
            <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-green-100 border-2 border-gray-300 ${trainingStatus.isTraining ? 'animate-pulse' : ''}`}>
                    <RefreshCw className={`h-7 w-7 text-[#2E7D32] ${trainingStatus.isTraining ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      {trainingStatus.isTraining ? 'Training in Progress' : 'Training Idle'}
                    </CardTitle>
                    <CardDescription className="mt-1 font-semibold">
                      Last updated {trainingStatus.lastUpdate} • Next update {trainingStatus.nextUpdate}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    size="lg"
                    onClick={handleForceRetrain}
                    className="bg-[#2E7D32] hover:bg-[#1f5a24] font-bold shadow-lg"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Force Retrain
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 bg-white">
              {/* Training Pipeline */}
              <div className="space-y-4">
                {trainingPipeline.map((stage, idx) => (
                  <div
                    key={idx}
                    className={`
                      flex items-center gap-4 p-4 rounded-xl transition-all duration-300 border-2
                      ${stage.status === 'active' ? 'bg-green-50 border-green-200 shadow-md' : ''}
                      ${stage.status === 'processing' ? 'bg-yellow-50 border-yellow-200 shadow-lg' : ''}
                      ${stage.status === 'pending' ? 'bg-gray-50 border-gray-200' : ''}
                    `}
                  >
                    {/* Stage Number */}
                    <div className={`
                      flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border-2
                      ${stage.status === 'active' ? 'bg-[#2E7D32] text-white border-[#2E7D32]' : ''}
                      ${stage.status === 'processing' ? 'bg-yellow-500 text-white border-yellow-400' : ''}
                      ${stage.status === 'pending' ? 'bg-gray-200 text-gray-600 border-gray-300' : ''}
                    `}>
                      {idx + 1}
                    </div>

                    {/* Stage Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{stage.stage}</h4>
                        <span className="text-sm font-bold text-[#2E7D32]">
                          {stage.progress}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{stage.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            stage.status === 'active' ? 'bg-[#2E7D32]' : 
                            stage.status === 'processing' ? 'bg-yellow-500' : 
                            'bg-gray-400'
                          }`}
                          style={{ width: `${stage.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {stage.status === 'active' && (
                        <CheckCircle className="h-6 w-6 text-[#2E7D32]" />
                      )}
                      {stage.status === 'processing' && (
                        <RefreshCw className="h-6 w-6 text-yellow-600 animate-spin" />
                      )}
                      {stage.status === 'pending' && (
                        <Clock className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Privacy Notice */}
              <div className="mt-6 p-5 bg-gray-50 rounded-xl border-2 border-gray-200 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Shield className="h-5 w-5 text-[#2E7D32] flex-shrink-0" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      Privacy-First Learning
                      <CheckCircle className="h-4 w-4 text-[#2E7D32]" />
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      All user data is anonymized before training. Personal information is never stored or used in model updates. 
                      Only aggregated, privacy-protected insights improve our AI models.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-2 border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#2E7D32]" />
                  Active Models
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">{trainingStatus.modelsActive}</p>
                <p className="text-sm text-gray-600">Currently optimizing</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-5 w-5 text-gray-700" />
                  Training Dataset
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">
                  {(trainingStatus.datasetSize / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-gray-600">Data points</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Plus className="h-5 w-5 text-gray-700" />
                  Performance Gain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#2E7D32]">
                  +{trainingStatus.performanceGain}%
                </p>
                <p className="text-sm text-gray-600">Since last month</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === "feedback" && (
        <div className="space-y-6">
          {/* View Toggle */}
          <div className="flex gap-3">
            <Button
              onClick={() => setFeedbackView("review")}
              variant={feedbackView === "review" ? "default" : "outline"}
              className={feedbackView === "review" ? "bg-[#2E7D32]" : ""}
            >
              <Eye className="h-4 w-4 mr-2" />
              Review Feedback
            </Button>
            <Button
              onClick={() => setFeedbackView("upload")}
              variant={feedbackView === "upload" ? "default" : "outline"}
              className={feedbackView === "upload" ? "bg-[#2E7D32]" : ""}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Dataset
            </Button>
          </div>

          {feedbackView === "review" && (
            <Card className="border-2 border-gray-200 shadow-2xl overflow-hidden">
              <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-xl border-2 border-gray-300 shadow-lg">
                      <MessageSquare className="h-6 w-6 text-[#2E7D32]" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">
                        User Feedback Review
                      </CardTitle>
                      <CardDescription className="mt-1 font-semibold">
                        Review and curate AI responses for training
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {feedbackData.map((item) => (
                    <Card
                      key={item.id}
                      className={`
                        relative border-2 transition-all hover:shadow-lg
                        ${item.rating >= 4 
                          ? 'border-green-200 bg-green-50/30 hover:border-[#2E7D32]' 
                          : item.rating >= 3 
                          ? 'border-yellow-200 bg-yellow-50/30 hover:border-yellow-400' 
                          : 'border-red-200 bg-red-50/30 hover:border-red-400'
                        }
                      `}
                    >
                      <CardContent className="p-5">
                        {/* Rating Indicator Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl ${
                          item.rating >= 4 ? 'bg-[#2E7D32]' : 
                          item.rating >= 3 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}></div>

                        <div className="ml-4 space-y-4">
                          {/* Header with badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            <div className={`
                              px-3 py-1 rounded-full text-xs font-bold border-2 flex items-center gap-1
                              ${item.rating >= 4 
                                ? 'bg-green-100 text-[#2E7D32] border-green-300' 
                                : item.rating >= 3 
                                ? 'bg-yellow-100 text-yellow-700 border-yellow-300' 
                                : 'bg-red-100 text-red-700 border-red-300'
                              }
                            `}>
                              <Award className="h-3 w-3" />
                              {item.rating}/5
                            </div>

                            <div className={`
                              px-3 py-1 rounded-full text-xs font-bold border-2
                              ${item.language === 'sw' 
                                ? 'bg-gray-100 text-gray-700 border-gray-300' 
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                              }
                            `}>
                              <Languages className="inline h-3 w-3 mr-1" />
                              {item.language === 'sw' ? 'Swahili' : 'English'}
                            </div>

                            <span className="text-xs text-gray-600 ml-auto">{item.timestamp}</span>
                          </div>

                          {/* Collapsible Content */}
                          <div className={`
                            p-4 rounded-lg border-2
                            ${item.rating >= 4 
                              ? 'bg-white border-green-200' 
                              : item.rating >= 3 
                              ? 'bg-white border-yellow-200' 
                              : 'bg-white border-red-200'
                            }
                          `}>
                            {/* Query */}
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-gray-100 rounded-lg border border-gray-300">
                                  <MessageSquare className="h-4 w-4 text-gray-700" />
                                </div>
                                <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">User Query</p>
                              </div>
                              <p className="text-sm text-gray-800 font-medium leading-relaxed pl-10">
                                {item.query}
                              </p>
                            </div>

                            {/* Response */}
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg border border-green-300">
                                  <Brain className="h-4 w-4 text-[#2E7D32]" />
                                </div>
                                <p className="text-xs font-bold text-[#2E7D32] uppercase tracking-wide">AI Response</p>
                              </div>
                              <p className="text-sm text-gray-800 leading-relaxed pl-10">
                                {item.response}
                              </p>
                            </div>

                            {/* User Feedback */}
                            <div className="pt-3 border-t border-gray-200">
                              <p className="text-xs font-bold text-gray-600 mb-1">USER FEEDBACK:</p>
                              <p className="text-sm text-gray-700 italic">"{item.feedback}"</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1 bg-[#2E7D32] hover:bg-[#1f5a24] text-white font-bold shadow-lg"
                              onClick={() => toast.success("Added to training dataset!")}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Use for Training
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 border-2 border-gray-300 font-bold"
                              onClick={() => toast.info("Feedback skipped")}
                            >
                              Skip
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {feedbackView === "upload" && (
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-[#2E7D32]" />
                  Upload Training Dataset
                </CardTitle>
                <CardDescription>
                  Upload CSV, JSON, or XLSX files with query-response pairs
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Drag & Drop Zone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                      relative border-4 border-dashed rounded-2xl p-12 text-center transition-all
                      ${dragActive 
                        ? 'border-[#2E7D32] bg-green-50' 
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                      }
                    `}
                  >
                    <div className={`
                      inline-flex items-center justify-center
                      p-6 rounded-full mb-6 transition-all
                      ${dragActive ? 'bg-[#2E7D32]' : 'bg-green-100'}
                    `}>
                      <Upload className={`h-12 w-12 ${dragActive ? 'text-white' : 'text-[#2E7D32]'}`} />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {dragActive ? 'Drop your file here' : 'Drag & drop your training data'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          or click below to select a file
                        </p>
                      </div>

                      <div>
                        <input
                          type="file"
                          id="file-upload"
                          accept=".csv,.json,.txt,.xlsx"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          size="lg"
                          onClick={() => document.getElementById('file-upload')?.click()}
                          className="bg-[#2E7D32] hover:bg-[#1f5a24] text-white font-bold px-8 py-6 text-lg shadow-xl"
                        >
                          <Upload className="h-5 w-5 mr-2" />
                          Choose File
                        </Button>
                      </div>

                      <p className="text-xs text-gray-500">
                        Supported formats: CSV, JSON, TXT, XLSX (Max 50MB)
                      </p>
                    </div>
                  </div>

                  {/* Uploaded File Preview */}
                  {uploadedFile && (
                    <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-[#2E7D32] rounded-lg">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{uploadedFile.name}</h4>
                            <p className="text-sm text-gray-600">
                              {(uploadedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setUploadedFile(null);
                            toast.info("File removed");
                          }}
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-[#2E7D32] hover:bg-[#1f5a24] font-bold shadow-lg"
                          onClick={() => {
                            console.log('[AITrainingHub] Training initiated with uploaded file:', uploadedFile.name);
                            toast.success("Training initiated with uploaded dataset!");
                          }}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Training
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Guidelines */}
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-[#2E7D32] flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Dataset Guidelines</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-[#2E7D32] mt-0.5 flex-shrink-0" />
                            <span>Include query-response pairs with ratings and context</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-[#2E7D32] mt-0.5 flex-shrink-0" />
                            <span>Use Swahili or English language data for best results</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-[#2E7D32] mt-0.5 flex-shrink-0" />
                            <span>Ensure data is anonymized and privacy-compliant</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-[#2E7D32] mt-0.5 flex-shrink-0" />
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
          <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
            <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl border-2 border-gray-300 shadow-lg">
                  <Settings className="h-6 w-6 text-[#2E7D32]" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    AI Optimization Settings
                  </CardTitle>
                  <CardDescription className="mt-1 font-semibold">
                    Configure automatic learning and improvement parameters
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <div className="space-y-6">
                {/* Auto-Learning Toggle */}
                <div className={`
                  p-6 rounded-xl border-2 transition-all
                  ${autoLearnEnabled 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                  }
                `}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-[#2E7D32]" />
                        Automatic Learning
                      </h3>
                      <p className="text-sm text-gray-700 mb-4">
                        Allow AI models to automatically learn from user interactions and feedback in real-time
                      </p>
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={handleToggleAutoLearn}
                          className={autoLearnEnabled ? "bg-[#2E7D32]" : "bg-gray-400"}
                        >
                          {autoLearnEnabled ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Disable
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Enable
                            </>
                          )}
                        </Button>
                        <span className={`text-sm font-bold ${autoLearnEnabled ? 'text-[#2E7D32]' : 'text-gray-500'}`}>
                          {autoLearnEnabled ? 'Active' : 'Paused'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thresholds */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-2">Accuracy Threshold</h4>
                    <p className="text-sm text-gray-600 mb-3">Minimum accuracy for production deployment</p>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="80"
                        max="99"
                        value={accuracyThreshold}
                        onChange={(e) => setAccuracyThreshold(Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-lg font-bold text-[#2E7D32] w-16 text-right">
                        {accuracyThreshold}%
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-2">Satisfaction Threshold</h4>
                    <p className="text-sm text-gray-600 mb-3">Minimum user satisfaction rating (1-5)</p>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="3"
                        max="5"
                        step="0.1"
                        value={satisfactionThreshold}
                        onChange={(e) => setSatisfactionThreshold(Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-lg font-bold text-[#2E7D32] w-16 text-right">
                        {satisfactionThreshold.toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
