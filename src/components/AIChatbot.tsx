import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  Plus,
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
  Bot,
  User,
  Languages
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  category?: "general" | "weather" | "market" | "pest" | "fertilizer" | "irrigation";
  confidence?: number; // AI confidence score for diagnosis
  sources?: string[]; // Data sources used
  actionable?: boolean; // Whether response has actionable advice
}

interface AIChatbotProps {
  userId: string;
  onSendMessage: (question: string, language: string) => Promise<string>;
}

interface QuickAction {
  icon: any;
  label: string;
  prompt: string;
  category: string;
  color: string;
}

export function AIChatbot({ userId, onSendMessage }: AIChatbotProps) {
  const [language, setLanguage] = useState<"en" | "sw">("en");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: language === "sw" 
        ? "Habari! Mimi ni msaidizi wako wa AI wa kilimo. Unaweza kuniuliza kuhusu mazao, mbolea, magonjwa ya mimea, bei za soko, na mengi zaidi. Niambie, ninaweza kukusaidia vipi leo?"
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = language === "sw" 
    ? [
        { icon: Sprout, label: "Mbolea ya Mahindi", prompt: "Ni mbolea gani bora kwa mahindi?", category: "fertilizer", color: "text-[#2E7D32] bg-[#2E7D32]/5 hover:bg-[#2E7D32]/10 border-[#2E7D32]" },
        { icon: Bug, label: "Magonjwa ya Nyanya", prompt: "Jinsi ya kudhibiti magonjwa ya nyanya", category: "pest", color: "text-red-600 bg-red-50 hover:bg-red-100 border-red-200" },
        { icon: DollarSign, label: "Bei za Soko", prompt: "Bei za sasa za mahindi na maharagwe", category: "market", color: "text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200" },
        { icon: Cloud, label: "Hali ya Hewa", prompt: "Hali ya hewa ya wiki ijayo", category: "weather", color: "text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200" },
        { icon: Droplet, label: "Umwagiliaji", prompt: "Ni mara ngapi nimwagilie mahindi?", category: "irrigation", color: "text-[#2E7D32] bg-[#2E7D32]/5 hover:bg-[#2E7D32]/10 border-[#2E7D32]" },
        { icon: TrendingUp, label: "Uzalishaji Bora", prompt: "Jinsi ya kuongeza mavuno ya mahindi", category: "general", color: "text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200" },
      ]
    : [
        { icon: Sprout, label: "Maize Fertilizer", prompt: "What's the best fertilizer for maize?", category: "fertilizer", color: "text-[#2E7D32] bg-[#2E7D32]/5 hover:bg-[#2E7D32]/10 border-[#2E7D32]" },
        { icon: Bug, label: "Tomato Diseases", prompt: "How to control tomato diseases", category: "pest", color: "text-red-600 bg-red-50 hover:bg-red-100 border-red-200" },
        { icon: DollarSign, label: "Market Prices", prompt: "Current prices for maize and beans", category: "market", color: "text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200" },
        { icon: Cloud, label: "Weather Forecast", prompt: "Weather forecast for next week", category: "weather", color: "text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200" },
        { icon: Droplet, label: "Irrigation", prompt: "How often should I water my maize?", category: "irrigation", color: "text-[#2E7D32] bg-[#2E7D32]/5 hover:bg-[#2E7D32]/10 border-[#2E7D32]" },
        { icon: TrendingUp, label: "Yield Boost", prompt: "How to increase maize yield", category: "general", color: "text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200" },
      ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string) => {
    const messageContent = customPrompt || input.trim();
    if (!messageContent) return;

    // Hide quick actions after first message
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
      const response = await onSendMessage(messageContent, language);
      
      // Categorize response
      let category: Message["category"] = "general";
      if (response.toLowerCase().includes("weather") || response.toLowerCase().includes("rain") || response.toLowerCase().includes("hewa")) {
        category = "weather";
      } else if (response.toLowerCase().includes("price") || response.toLowerCase().includes("market") || response.toLowerCase().includes("bei")) {
        category = "market";
      } else if (response.toLowerCase().includes("pest") || response.toLowerCase().includes("disease") || response.toLowerCase().includes("magonjwa")) {
        category = "pest";
      } else if (response.toLowerCase().includes("fertilizer") || response.toLowerCase().includes("mbolea")) {
        category = "fertilizer";
      } else if (response.toLowerCase().includes("water") || response.toLowerCase().includes("irrigat") || response.toLowerCase().includes("maji")) {
        category = "irrigation";
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
        category
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Show success toast
      toast.success(language === "sw" ? "Jibu limefika!" : "Response received!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(language === "sw" ? "Tatizo limetokea. Jaribu tena." : "Error occurred. Please try again.");
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: language === "sw" 
          ? "Samahani, imekuwa na tatizo. Tafadhali jaribu tena baadae."
          : "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageToggle = () => {
    const newLanguage = language === "en" ? "sw" : "en";
    setLanguage(newLanguage);
    
    const systemMessage: Message = {
      id: Date.now().toString(),
      role: "system",
      content: newLanguage === "sw" 
        ? "🌍 Nimebadilisha lugha kuwa Kiswahili. Unaweza kuniuliza maswali yoyote kuhusu kilimo!"
        : "🌍 I've switched to English. You can ask me any questions about farming!",
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, systemMessage]);
    setShowQuickActions(true);
    toast.success(newLanguage === "sw" ? "Lugha imebadilishwa kuwa Kiswahili" : "Language changed to English");
  };

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      toast.success(language === "sw" ? "Imenakiliwa!" : "Copied!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error(language === "sw" ? "Imeshindwa kunakili" : "Failed to copy");
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "weather": return <Cloud className="h-3 w-3" />;
      case "market": return <DollarSign className="h-3 w-3" />;
      case "pest": return <Bug className="h-3 w-3" />;
      case "fertilizer": return <Sprout className="h-3 w-3" />;
      case "irrigation": return <Droplet className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "weather": return "text-gray-700";
      case "market": return "text-gray-700";
      case "pest": return "text-red-600";
      case "fertilizer": return "text-[#2E7D32]";
      case "irrigation": return "text-[#2E7D32]";
      default: return "text-gray-600";
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      toast.success(language === "sw" ? "Kurekodi kumeanza..." : "Recording started...");
      
      setTimeout(() => {
        stopRecording();
      }, 5000);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error(language === "sw" ? "Ruhusu kipokezi sauti" : "Please allow microphone access");
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast.info(language === "sw" ? "Kurekodi kumekamilika" : "Recording complete");
  };

  return (
    <Card className="h-[calc(100vh-200px)] md:h-[700px] flex flex-col shadow-xl border-2">
      <CardHeader className="border-b bg-white pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[#2E7D32] rounded-full animate-ping opacity-20"></div>
              <div className="relative bg-[#2E7D32] p-2 rounded-full">
                <Bot className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">Sankofa AI</span>
                <Badge className="bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]">
                  <span className="animate-pulse">●</span>
                  <span className="ml-1">{language === "sw" ? "Mtandaoni" : "Online"}</span>
                </Badge>
              </div>
              <p className="text-xs text-gray-600 font-normal mt-1">
                {language === "sw" ? "Msaidizi wako wa AI wa kilimo" : "Your AI farming assistant"}
              </p>
            </div>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLanguageToggle}
            className="flex items-center gap-2 hover:bg-[#2E7D32]/5 transition-colors"
          >
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">{language === "sw" ? "Kiswahili" : "English"}</span>
            <span className="sm:hidden">{language === "sw" ? "SW" : "EN"}</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30,
                    delay: index * 0.05 
                  }}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {message.role !== "system" && (
                    <motion.div 
                      className={`flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 shadow-lg ${
                        message.role === "user" 
                          ? "bg-gray-200" 
                          : "bg-[#2E7D32]"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {message.role === "user" ? (
                        <User className="h-5 w-5 text-gray-700" />
                      ) : (
                        <Bot className="h-5 w-5 text-white" />
                      )}
                    </motion.div>
                  )}
                  
                  <div className={`flex-1 max-w-[85%] ${message.role === "user" ? "text-right" : ""}`}>
                    {message.role === "system" ? (
                      <div className="flex justify-center">
                        <div className="inline-block bg-gray-100 border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600">
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      <>
                        <motion.div 
                          className={`inline-block rounded-2xl px-4 py-3 shadow-sm ${
                            message.role === "user"
                              ? "bg-gray-100 text-gray-900 border border-gray-200"
                              : "bg-white border border-gray-200 text-gray-900"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </motion.div>
                        
                        <div className={`flex items-center gap-2 mt-2 text-xs text-gray-500 ${
                          message.role === "user" ? "justify-end" : ""
                        }`}>
                          {message.category && message.role === "assistant" && (
                            <Badge variant="outline" className={`${getCategoryColor(message.category)} border-current`}>
                              {getCategoryIcon(message.category)}
                              <span className="ml-1 capitalize">{message.category}</span>
                            </Badge>
                          )}
                          <span>{new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                          {message.role === "assistant" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 hover:bg-gray-100"
                              onClick={() => handleCopy(message.content, message.id)}
                            >
                              {copiedId === message.id ? (
                                <CheckCircle2 className="h-3 w-3 text-[#2E7D32]" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2E7D32] shadow-lg">
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-[#2E7D32] rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-[#2E7D32] rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-[#2E7D32] rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {language === "sw" ? "Inaandika..." : "Thinking..."}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t bg-white p-4 space-y-3">
          {/* Quick Actions */}
          <AnimatePresence>
            {showQuickActions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Plus className="h-4 w-4 text-[#2E7D32]" />
                    <p className="text-xs font-medium text-gray-600">
                      {language === "sw" ? "Maswali ya Haraka:" : "Quick Actions:"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {quickActions.map((action, idx) => {
                      const Icon = action.icon;
                      return (
                        <motion.button
                          key={action.label}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSend(action.prompt)}
                          className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${action.color}`}
                          disabled={loading}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs font-medium text-left">{action.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Input Area */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder={language === "sw" ? "Andika swali lako hapa..." : "Type your question here..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                disabled={loading}
                className="pr-10 border-2 focus:border-[#2E7D32] transition-colors"
              />
              {!showQuickActions && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-gray-400 hover:text-[#2E7D32]"
                  onClick={() => setShowQuickActions(!showQuickActions)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => handleSend()} 
                disabled={loading || !input.trim()}
                className="bg-[#2E7D32] hover:bg-[#2E7D32]/90 shadow-lg"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={loading}
                className={`${
                  isRecording 
                    ? "bg-red-600 hover:bg-red-700 animate-pulse" 
                    : "bg-gray-600 hover:bg-gray-700"
                } shadow-lg`}
              >
                {isRecording ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            </motion.div>
          </div>
          
          <p className="text-xs text-center text-gray-500">
            {language === "sw" 
              ? "💡 Nieleze kuhusu shamba lako, na nitakupa ushauri wa kibia"
              : "💡 Tell me about your farm, and I'll provide personalized advice"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}