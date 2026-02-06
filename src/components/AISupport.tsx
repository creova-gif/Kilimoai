import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { 
  Send, 
  Bot, 
  User, 
  Languages, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  Sparkles,
  Loader2,
  Copy,
  CheckCircle2,
  TrendingUp,
  Droplet,
  Bug,
  Sprout,
  DollarSign,
  Cloud,
  Info,
  AlertCircle,
  Calendar,
  BookOpen,
  ChevronRight,
  Zap,
  MessageSquare,
  Brain,
  Target,
  Lightbulb,
  ArrowRight,
  Clock,
  Award,
  Globe,
  ClipboardList
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  category?: "general" | "weather" | "market" | "pest" | "fertilizer" | "irrigation";
}

interface AISupportProps {
  userId: string;
  language: "en" | "sw";
  apiBase?: string;
  authToken?: string;
}

interface QuickAction {
  icon: any;
  label: string;
  prompt: string;
  category: string;
  color: string;
}

export function AISupport({ userId, language, apiBase, authToken }: AISupportProps) {
  const API_BASE = apiBase || `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;
  const AUTH_TOKEN = authToken || publicAnonKey;
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: language === "sw" 
        ? "Habari! Mimi ni Sankofa AI, msaidizi wako wa kilimo. Unaweza kuniuliza kuhusu mazao, mbolea, magonjwa ya mimea, bei za soko, na mengi zaidi. Niambie, ninaweza kukusaidia vipi leo?"
        : "Hello! 👋 I'm Sankofa AI, your intelligent farming assistant. Ask me anything about crops, fertilizers, pest control, market prices, weather forecasts, and best farming practices. How can I help you today?",
      timestamp: new Date().toISOString(),
      category: "general"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = language === "sw" 
    ? [
        { icon: Sprout, label: "Mbolea ya Mahindi", prompt: "Ni mbolea gani bora kwa mahindi?", category: "fertilizer", color: "text-green-600 bg-green-50 hover:bg-green-100" },
        { icon: Bug, label: "Magonjwa ya Nyanya", prompt: "Jinsi ya kudhibiti magonjwa ya nyanya", category: "pest", color: "text-red-600 bg-red-50 hover:bg-red-100" },
        { icon: DollarSign, label: "Bei za Soko", prompt: "Bei za sasa za mahindi na maharagwe", category: "market", color: "text-blue-600 bg-blue-50 hover:bg-blue-100" },
        { icon: Cloud, label: "Hali ya Hewa", prompt: "Hali ya hewa ya wiki ijayo", category: "weather", color: "text-purple-600 bg-purple-50 hover:bg-purple-100" },
        { icon: Droplet, label: "Umwagiliaji", prompt: "Ni mara ngapi nimwagilie mahindi?", category: "irrigation", color: "text-cyan-600 bg-cyan-50 hover:bg-cyan-100" },
        { icon: TrendingUp, label: "Uzalishaji Bora", prompt: "Jinsi ya kuongeza mavuno ya mahindi", category: "general", color: "text-orange-600 bg-orange-50 hover:bg-orange-100" },
      ]
    : [
        { icon: Sprout, label: "Maize Fertilizer", prompt: "What's the best fertilizer for maize?", category: "fertilizer", color: "text-green-600 bg-green-50 hover:bg-green-100" },
        { icon: Bug, label: "Tomato Diseases", prompt: "How to control tomato diseases", category: "pest", color: "text-red-600 bg-red-50 hover:bg-red-100" },
        { icon: DollarSign, label: "Market Prices", prompt: "Current prices for maize and beans", category: "market", color: "text-blue-600 bg-blue-50 hover:bg-blue-100" },
        { icon: Cloud, label: "Weather Forecast", prompt: "Weather forecast for next week", category: "weather", color: "text-purple-600 bg-purple-50 hover:bg-purple-100" },
        { icon: Droplet, label: "Irrigation", prompt: "How often should I water my maize?", category: "irrigation", color: "text-cyan-600 bg-cyan-50 hover:bg-cyan-100" },
        { icon: TrendingUp, label: "Yield Boost", prompt: "How to increase maize yield", category: "general", color: "text-orange-600 bg-orange-50 hover:bg-orange-100" },
      ];

  // Load recommendations
  useEffect(() => {
    loadRecommendations();
  }, [userId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages(prev => [
      {
        ...prev[0],
        content: language === "sw" 
          ? "Habari! Mimi ni Sankofa AI, msaidizi wako wa kilimo. Unaweza kuniuliza kuhusu mazao, mbolea, magonjwa ya mimea, bei za soko, na mengi zaidi. Niambie, ninaweza kukusaidia vipi leo?"
          : "Hello! 👋 I'm Sankofa AI, your intelligent farming assistant. Ask me anything about crops, fertilizers, pest control, market prices, weather forecasts, and best farming practices. How can I help you today?",
      },
      ...prev.slice(1)
    ]);
  }, [language]);

  const loadRecommendations = async () => {
    try {
      const response = await fetch(`${API_BASE}/advisory/personalized`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      // Get response as text first to check if it's HTML
      const responseText = await response.text();

      // Check if response is HTML (error page) - silently skip
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        setLoadingRecommendations(false);
        return;
      }

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        setLoadingRecommendations(false);
        return;
      }

      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      // Silently handle network errors
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const messageContent = customPrompt || input.trim();
    if (!messageContent) return;

    setShowQuickActions(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Call the OpenAI-powered API endpoint
      const response = await fetch(`${API_BASE}/advice/query`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          question: messageContent,
          language,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        // Show success notification with model info
        if (data.modelTier) {
          console.log(`✅ AI Response generated using ${data.modelTier} model`);
        }
      } else {
        throw new Error(data.error || "Failed to get AI response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      
      // Remove the user message if the request failed
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSend(action.prompt);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ✅ FIX #3: CREATE TASK FROM AI RECOMMENDATION
  const createTaskFromAI = async (messageContent: string) => {
    // Extract first actionable sentence
    const sentences = messageContent.split(/[.!?]\s/);
    const actionSentence = sentences.find(s => 
      s.toLowerCase().includes("apply") || 
      s.toLowerCase().includes("plant") ||
      s.toLowerCase().includes("harvest") ||
      s.toLowerCase().includes("monitor") ||
      s.toLowerCase().includes("check") ||
      s.toLowerCase().includes("water") ||
      s.toLowerCase().includes("fertilize") ||
      s.toLowerCase().includes("spray")
    ) || sentences[0];
    
    const title = actionSentence.substring(0, 100).trim();
    
    try {
      const response = await fetch(`${API_BASE}/tasks/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          title: language === "sw" ? `💡 ${title}` : `💡 ${title}`,
          description: messageContent,
          priority: "normal",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          category: "ai_recommendation",
          source: "sankofa_ai"
        })
      });
      
      if (response.ok) {
        toast.success(
          language === "sw" 
            ? "✅ Kazi imeundwa kutoka ushauri wa AI!" 
            : "✅ Task created from AI recommendation!",
          { duration: 5000 }
        );
      } else {
        toast.error(
          language === "sw" 
            ? "Imeshindwa kuunda kazi" 
            : "Failed to create task"
        );
      }
    } catch (error) {
      console.error("Failed to create task from AI:", error);
      toast.error(
        language === "sw" 
          ? "Tatizo la mtandao" 
          : "Network error"
      );
    }
  };

  const addToCropPlan = (messageContent: string) => {
    // This is a simplified version - shows info toast
    toast.info(
      language === "sw"
        ? "Fungua Mpango wa Mazao ili kuongeza ushauri huu"
        : "Open Crop Planning to add this recommendation",
      {
        duration: 6000
      }
    );
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info("Voice input is coming soon!");
    }
  };

  const allRecommendations = recommendations ? [
    ...(recommendations?.urgent || []),
    ...(recommendations?.seasonal || []),
    ...(recommendations?.market || []),
    ...(recommendations?.learning || []),
    ...(recommendations?.personalized || []),
  ] : [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-5 w-5" />;
      case "medium":
        return <TrendingUp className="h-5 w-5" />;
      case "low":
        return <BookOpen className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "weather": return Cloud;
      case "market": return DollarSign;
      case "pest": return Bug;
      case "fertilizer": return Sprout;
      case "irrigation": return Droplet;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white p-8"
      >
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="h-8 w-8" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold">AI Support Center</h1>
                  <p className="text-green-100 mt-1">Chat with Sankofa AI & Get Personalized Recommendations</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                <motion.div 
                  className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Send className="h-5 w-5 text-green-100" />
                    </div>
                    <Badge className="bg-green-400/20 text-white border-0 text-xs">Active</Badge>
                  </div>
                  <p className="text-xs text-green-100 mb-1">Total Messages</p>
                  <p className="text-3xl font-bold">{messages.length - 1}</p>
                </motion.div>

                <motion.div 
                  className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Brain className="h-5 w-5 text-green-100" />
                    </div>
                    <Zap className="h-4 w-4 text-yellow-300" />
                  </div>
                  <p className="text-xs text-green-100 mb-1">AI Responses</p>
                  <p className="text-3xl font-bold">{messages.filter(m => m.role === "assistant").length}</p>
                </motion.div>

                <motion.div 
                  className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-green-100" />
                    </div>
                    {allRecommendations.length > 0 && (
                      <Badge className="bg-red-500 text-white border-0 text-xs px-2">
                        {allRecommendations.length}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-green-100 mb-1">Tips</p>
                  <p className="text-3xl font-bold">{allRecommendations.length}</p>
                </motion.div>

                <motion.div 
                  className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Globe className="h-5 w-5 text-green-100" />
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                  <p className="text-xs text-green-100 mb-1">Language</p>
                  <p className="text-3xl font-bold">{language === "sw" ? "SW" : "EN"}</p>
                </motion.div>
              </div>
            </div>
            <Badge className="bg-green-500 text-white border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by AI
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <Card className="border-2 shadow-lg">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 md:px-6 pt-4 md:pt-6 pb-2 bg-white border-b border-gray-200">
              <TabsList className="inline-flex h-auto items-center justify-start gap-2 bg-transparent p-0 w-full flex-wrap">
                <TabsTrigger 
                  value="chat" 
                  className="relative rounded-full px-3 md:px-6 py-2.5 text-xs md:text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-200 data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 border-0"
                >
                  <MessageSquare className="h-4 w-4 md:mr-2" />
                  <span className="hidden sm:inline">AI Chat</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="recommendations" 
                  className="relative rounded-full px-3 md:px-6 py-2.5 text-xs md:text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-200 data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 border-0"
                >
                  <Target className="h-4 w-4 md:mr-2" />
                  <span className="hidden sm:inline">Recommendations</span>
                  <span className="sm:hidden">Tips</span>
                  {allRecommendations.length > 0 && (
                    <Badge className="ml-1.5 md:ml-2 h-5 px-1.5 md:px-2 text-[10px] bg-red-500 text-white border-0 rounded-full">
                      {allRecommendations.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="insights" 
                  className="relative rounded-full px-3 md:px-6 py-2.5 text-xs md:text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-200 data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200 border-0"
                >
                  <Lightbulb className="h-4 w-4 md:mr-2" />
                  <span className="hidden sm:inline">AI Insights</span>
                  <span className="sm:hidden">Info</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Chat Tab */}
            <TabsContent value="chat" className="p-6 m-0">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Chat Interface */}
                <div className="md:col-span-2">
                  <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-b from-gray-50 to-white">
                    <CardHeader className="pb-4 bg-white border-b sticky top-0 z-10 backdrop-blur-sm bg-white/95">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <Bot className="h-5 w-5 text-white" />
                          </motion.div>
                          <div>
                            <CardTitle className="text-lg font-bold mb-0.5">Sankofa AI</CardTitle>
                            <p className="text-xs text-green-600 font-normal flex items-center gap-1">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
                              Online now
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLanguage(language === "en" ? "sw" : "en")}
                          className="gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4"
                        >
                          <Languages className="h-4 w-4" />
                          <span className="hidden sm:inline">{language === "en" ? "EN" : "SW"}</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[500px] px-4">
                        <div className="py-4">
                          <AnimatePresence>
                            {messages.map((message, index) => (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className={`flex gap-2 mb-3 ${
                                  message.role === "user" ? "flex-row-reverse" : ""
                                }`}
                              >
                                <motion.div 
                                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
                                    message.role === "user" 
                                      ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                                      : "bg-gradient-to-br from-purple-500 to-indigo-600"
                                  }`}
                                  whileHover={{ scale: 1.1 }}
                                >
                                  {message.role === "user" ? (
                                    <User className="h-4 w-4 text-white" />
                                  ) : (
                                    <Bot className="h-4 w-4 text-white" />
                                  )}
                                </motion.div>
                                <div className={`flex-1 ${message.role === "user" ? "flex justify-end" : ""}`}>
                                  <motion.div 
                                    className={`inline-block max-w-[85%] sm:max-w-[75%] ${
                                      message.role === "user"
                                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl rounded-tr-md shadow-lg"
                                        : "bg-white text-gray-900 rounded-3xl rounded-tl-md shadow-md border border-gray-100"
                                    } px-4 py-3`}
                                    whileHover={{ scale: 1.01 }}
                                  >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                    
                                    {/* ✅ FIX #3: ADD ACTION BUTTONS FOR AI RESPONSES */}
                                    {message.role === "assistant" && (
                                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
                                        <button
                                          onClick={() => createTaskFromAI(message.content)}
                                          className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 bg-green-600 text-white hover:bg-green-700 shadow-sm"
                                        >
                                          <ClipboardList className="h-3.5 w-3.5" />
                                          <span>{language === "sw" ? "Ongeza kwenye Kazi" : "Add to Tasks"}</span>
                                        </button>
                                        <button
                                          onClick={() => addToCropPlan(message.content)}
                                          className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
                                        >
                                          <Calendar className="h-3.5 w-3.5" />
                                          <span>{language === "sw" ? "Ongeza kwenye Mpango" : "Add to Plan"}</span>
                                        </button>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5">
                                      <span className={`text-[10px] ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                      {message.role === "assistant" && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
                                          onClick={() => handleCopy(message.content, message.id)}
                                        >
                                          {copiedId === message.id ? (
                                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                                          ) : (
                                            <Copy className="h-3 w-3 text-gray-400" />
                                          )}
                                        </Button>
                                      )}
                                    </div>
                                  </motion.div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>

                          {loading && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex gap-2 mb-3"
                            >
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                                <Bot className="h-4 w-4 text-white" />
                              </div>
                              <div className="bg-white rounded-3xl rounded-tl-md shadow-md border border-gray-100 px-5 py-4">
                                <div className="flex gap-1.5">
                                  <motion.div
                                    className="w-2.5 h-2.5 bg-purple-400 rounded-full"
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                  />
                                  <motion.div
                                    className="w-2.5 h-2.5 bg-purple-400 rounded-full"
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                                  />
                                  <motion.div
                                    className="w-2.5 h-2.5 bg-purple-400 rounded-full"
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>

                      <div className="p-4 bg-white border-t sticky bottom-0">
                        <div className="flex gap-2 items-end">
                          <div className="flex-1 bg-gray-100 rounded-3xl p-1 flex items-center gap-2">
                            <Input
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                              placeholder={language === "sw" ? "Andika ujumbe..." : "Type a message..."}
                              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-4"
                              disabled={loading}
                            />
                            <Button
                              onClick={handleVoiceToggle}
                              variant="ghost"
                              size="icon"
                              className={`rounded-full h-9 w-9 ${isRecording ? "bg-red-100 text-red-600 hover:bg-red-200" : "hover:bg-gray-200"}`}
                            >
                              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                            </Button>
                          </div>
                          <motion.div whileTap={{ scale: 0.9 }}>
                            <Button 
                              onClick={() => handleSend()} 
                              disabled={loading || !input.trim()}
                              className="rounded-full h-11 w-11 p-0 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg disabled:opacity-50"
                            >
                              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions Sidebar */}
                <div>
                  <Card className="border-2 bg-gradient-to-br from-purple-50 to-indigo-50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-purple-600" />
                        Quick Actions
                      </CardTitle>
                      <CardDescription>
                        Common questions & topics
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {quickActions.map((action, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            className={`w-full justify-start gap-2 ${action.color} border-2 hover:shadow-md transition-all cursor-pointer`}
                            onClick={() => handleQuickAction(action)}
                            disabled={loading}
                          >
                            <action.icon className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm text-left">{action.label}</span>
                          </Button>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-2 mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-600" />
                        Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <p className="text-gray-700">Be specific in your questions</p>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <p className="text-gray-700">Ask in English or Swahili</p>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <p className="text-gray-700">Include your crop type for better advice</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="p-6 m-0">
              {loadingRecommendations ? (
                <div className="flex items-center justify-center h-64">
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Loader2 className="h-12 w-12 text-purple-600 mx-auto animate-spin mb-4" />
                    <p className="text-gray-600">Generating personalized recommendations...</p>
                  </motion.div>
                </div>
              ) : (
                <>
                  {/* Summary Cards */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Urgent</p>
                              <p className="text-3xl font-bold text-red-700">
                                {recommendations?.urgent?.length || 0}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-red-600">Needs attention</p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                              <Calendar className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Seasonal</p>
                              <p className="text-3xl font-bold text-yellow-700">
                                {recommendations?.seasonal?.length || 0}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-yellow-600">Planning tips</p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Market</p>
                              <p className="text-3xl font-bold text-green-700">
                                {recommendations?.market?.length || 0}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-green-600">Opportunities</p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <BookOpen className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Learning</p>
                              <p className="text-3xl font-bold text-blue-700">
                                {recommendations?.learning?.length || 0}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-blue-600">Resources</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* All Recommendations */}
                  <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-white to-pink-50 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-md">
                            <Target className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl md:text-2xl">
                              Smart Recommendations
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Brain className="h-4 w-4 text-purple-600" />
                              <span>{allRecommendations.length} personalized insights from your Farm Graph</span>
                            </CardDescription>
                          </div>
                        </div>
                        {allRecommendations.length > 0 && (
                          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 text-sm">
                            <Award className="h-4 w-4 mr-1" />
                            {allRecommendations.filter((r: any) => r.priority === "high").length} Urgent
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {allRecommendations.length > 0 ? (
                        <>
                          {/* Stats Overview */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-200"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <span className="text-xs font-medium text-red-700">High Priority</span>
                              </div>
                              <p className="text-2xl font-bold text-red-600">
                                {allRecommendations.filter((r: any) => r.priority === "high").length}
                              </p>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.05 }}
                              className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="h-4 w-4 text-orange-600" />
                                <span className="text-xs font-medium text-orange-700">Medium</span>
                              </div>
                              <p className="text-2xl font-bold text-orange-600">
                                {allRecommendations.filter((r: any) => r.priority === "medium").length}
                              </p>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 }}
                              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Info className="h-4 w-4 text-blue-600" />
                                <span className="text-xs font-medium text-blue-700">Low Priority</span>
                              </div>
                              <p className="text-2xl font-bold text-blue-600">
                                {allRecommendations.filter((r: any) => r.priority === "low").length}
                              </p>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.15 }}
                              className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Zap className="h-4 w-4 text-green-600" />
                                <span className="text-xs font-medium text-green-700">Actionable</span>
                              </div>
                              <p className="text-2xl font-bold text-green-600">
                                {allRecommendations.filter((r: any) => r.actionable).length}
                              </p>
                            </motion.div>
                          </div>

                          {/* Recommendations Grid */}
                          <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                              {allRecommendations.map((rec: any, index: number) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  transition={{ delay: index * 0.05 }}
                                  whileHover={{ scale: 1.01 }}
                                  className="group"
                                >
                                  <Card className={`border-2 transition-all duration-300 hover:shadow-xl ${
                                    rec.priority === "high" 
                                      ? "border-red-200 bg-gradient-to-br from-red-50 to-white hover:border-red-400" 
                                      : rec.priority === "medium"
                                      ? "border-orange-200 bg-gradient-to-br from-orange-50 to-white hover:border-orange-400"
                                      : "border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:border-blue-400"
                                  }`}>
                                    <CardContent className="p-5">
                                      <div className="flex items-start gap-4">
                                        {/* Priority Icon */}
                                        <div className={`p-3 rounded-xl shadow-md flex-shrink-0 ${
                                          rec.priority === "high" 
                                            ? "bg-gradient-to-br from-red-500 to-red-600" 
                                            : rec.priority === "medium"
                                            ? "bg-gradient-to-br from-orange-500 to-orange-600"
                                            : "bg-gradient-to-br from-blue-500 to-blue-600"
                                        }`}>
                                          <div className="text-white">
                                            {getPriorityIcon(rec.priority)}
                                          </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                          {/* Header */}
                                          <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex-1">
                                              <h4 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                                                {rec.title}
                                              </h4>
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <Badge 
                                                  variant="outline" 
                                                  className="bg-white border-2 text-xs"
                                                >
                                                  {rec.category}
                                                </Badge>
                                                <Badge 
                                                  className={`text-xs ${
                                                    rec.priority === "high" 
                                                      ? "bg-red-600 hover:bg-red-700" 
                                                      : rec.priority === "medium"
                                                      ? "bg-orange-600 hover:bg-orange-700"
                                                      : "bg-blue-600 hover:bg-blue-700"
                                                  }`}
                                                >
                                                  {rec.priority.toUpperCase()} PRIORITY
                                                </Badge>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Description */}
                                          <p className="text-sm text-gray-700 leading-relaxed mb-4 bg-white/50 rounded-lg p-3 border">
                                            {rec.description}
                                          </p>

                                          {/* Footer */}
                                          <div className="flex items-center justify-between flex-wrap gap-3">
                                            <div className="flex items-center gap-3 text-sm">
                                              {rec.dueDate && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border-2 border-purple-200">
                                                  <Calendar className="h-4 w-4 text-purple-600" />
                                                  <span className="font-medium text-gray-700">
                                                    Due: {new Date(rec.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                  </span>
                                                </div>
                                              )}
                                              {rec.actionable && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 rounded-lg border-2 border-green-300">
                                                  <Lightbulb className="h-4 w-4 text-green-600" />
                                                  <span className="text-xs font-semibold text-green-700">
                                                    ACTION READY
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                            
                                            {rec.actionable && (
                                              <Button 
                                                size="sm" 
                                                className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all group-hover:scale-105"
                                              >
                                                <Zap className="h-4 w-4" />
                                                Take Action
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-16 bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-2xl border-2 border-dashed border-purple-300"
                        >
                          <motion.div
                            animate={{ 
                              y: [0, -10, 0],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="inline-block mb-4"
                          >
                            <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                              <Sparkles className="h-16 w-16 text-purple-600" />
                            </div>
                          </motion.div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            No Recommendations Yet
                          </h3>
                          <p className="text-gray-600 font-medium mb-1">
                            Start your journey with CREOVA AI!
                          </p>
                          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                            As you interact with Sankofa AI and use farm management features, 
                            you'll receive personalized recommendations powered by your Farm Graph data.
                          </p>

                          <div className="flex items-center justify-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 border-purple-200">
                              <MessageSquare className="h-4 w-4 text-purple-600" />
                              <span className="text-sm font-medium text-gray-700">Chat with Sankofa</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 border-green-200">
                              <Sprout className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">Track Your Crops</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 border-blue-200">
                              <Globe className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-700">Explore Features</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="insights" className="p-6 m-0">
              <Card className="border-2 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-yellow-600" />
                    How AI Recommendations Work
                  </CardTitle>
                  <CardDescription>
                    CREOVA learns from your Farm Graph to provide increasingly accurate advice
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-purple-200"
                  >
                    <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold mb-1">Data Collection</p>
                      <p className="text-sm text-gray-600 break-words">
                        Every interaction you have with CREOVA is tracked in your Farm Graph
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-blue-200"
                  >
                    <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold mb-1">Pattern Recognition</p>
                      <p className="text-sm text-gray-600 break-words">
                        AI analyzes your behavior, crops, location, and historical data
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-green-200"
                  >
                    <div className="h-10 w-10 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold mb-1">Personalized Advice</p>
                      <p className="text-sm text-gray-600 break-words">
                        Recommendations are tailored specifically to YOUR farm, not generic advice
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-yellow-200"
                  >
                    <div className="h-10 w-10 rounded-xl bg-yellow-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold mb-1">Continuous Learning</p>
                      <p className="text-sm text-gray-600 break-words">
                        The more you use CREOVA, the better recommendations become
                      </p>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      Your AI Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Data Quality</span>
                        <span className="text-sm font-semibold">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Engagement Level</span>
                        <span className="text-sm font-semibold">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">AI Accuracy</span>
                        <span className="text-sm font-semibold">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 bg-gradient-to-br from-green-50 to-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-between">
                      <span>Ask Sankofa AI a question</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="w-full justify-between">
                      <span>Review urgent recommendations</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="w-full justify-between">
                      <span>Check market opportunities</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}