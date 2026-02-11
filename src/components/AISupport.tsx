import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Loader2,
  Copy,
  CheckCircle2,
  Droplet,
  Bug,
  Sprout,
  DollarSign,
  Cloud,
  Zap,
  MessageSquare,
  ArrowRight
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: language === "sw" 
        ? "Habari! 👋 Mimi ni Sankofa AI. Niambie, ninaweza kukusaidia vipi leo?"
        : "Hi there! 👋 I'm Sankofa AI, your farming expert. What can I help you with today?",
      timestamp: new Date().toISOString(),
      category: "general"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = language === "sw" 
    ? [
        { icon: Sprout, label: "Mbolea ya Mahindi", prompt: "Ni mbolea gani bora kwa mahindi?", category: "fertilizer", color: "bg-emerald-500" },
        { icon: Bug, label: "Magonjwa", prompt: "Jinsi ya kudhibiti magonjwa ya nyanya", category: "pest", color: "bg-red-500" },
        { icon: DollarSign, label: "Bei za Soko", prompt: "Bei za sasa za mahindi", category: "market", color: "bg-amber-500" },
        { icon: Cloud, label: "Hali ya Hewa", prompt: "Hali ya hewa ya wiki ijayo", category: "weather", color: "bg-blue-500" },
        { icon: Droplet, label: "Umwagiliaji", prompt: "Ni mara ngapi nimwagilie mahindi?", category: "irrigation", color: "bg-cyan-500" },
      ]
    : [
        { icon: Sprout, label: "Fertilizer Tips", prompt: "What's the best fertilizer for maize?", category: "fertilizer", color: "bg-emerald-500" },
        { icon: Bug, label: "Pest Control", prompt: "How to control tomato diseases", category: "pest", color: "bg-red-500" },
        { icon: DollarSign, label: "Market Prices", prompt: "Current maize prices", category: "market", color: "bg-amber-500" },
        { icon: Cloud, label: "Weather", prompt: "Next week's weather forecast", category: "weather", color: "bg-blue-500" },
        { icon: Droplet, label: "Irrigation", prompt: "How often should I water maize?", category: "irrigation", color: "bg-cyan-500" },
      ];

  const text = {
    placeholder: language === "sw" ? "Andika ujumbe wako hapa..." : "Type your question here...",
    send: language === "sw" ? "Tuma" : "Send",
    quickStart: language === "sw" ? "Uliza Haraka" : "Quick Ask",
    quickStartDesc: language === "sw" ? "Chagua mada au andika swali lako" : "Choose a topic or type your own question",
    copied: language === "sw" ? "Imenakiliwa!" : "Copied!",
    you: language === "sw" ? "Wewe" : "You",
    ai: language === "sw" ? "Sankofa AI" : "Sankofa AI",
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (messageContent?: string) => {
    const content = messageContent || input.trim();
    if (!content || loading) return;

    setShowQuickActions(false);
    setInput("");

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/ai/ask`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          question: content,
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
      } else {
        throw new Error(data.error || "Failed to get AI response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(language === "sw" ? "Imeshindwa kutuma ujumbe" : "Failed to send message");
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
    toast.success(text.copied);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-gray-50">
      {/* Hero Header - FIXED ALIGNMENT */}
      <div className="relative overflow-hidden bg-[#2E7D32] px-6 py-6">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white leading-tight">{text.ai}</h1>
              <p className="text-white/90 text-sm mt-0.5">
                {language === "sw" ? "Msaidizi wako wa kilimo" : "Your farming assistant"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-[#2E7D32] flex items-center justify-center shadow-md">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                )}

                <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "flex justify-end" : ""}`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-[#2E7D32] text-white shadow-lg"
                      : "bg-white border-2 border-gray-100 shadow-sm"
                  }`}>
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                      message.role === "user" ? "text-white" : "text-gray-800"
                    }`}>
                      {message.content}
                    </p>
                    
                    {message.role === "assistant" && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(message.content, message.id)}
                          className="h-7 px-2 hover:bg-gray-100"
                        >
                          {copiedId === message.id ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#2E7D32]" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gray-700 flex items-center justify-center shadow-md">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 justify-start"
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-[#2E7D32] flex items-center justify-center shadow-md">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#2E7D32]" />
                  <span className="text-sm text-gray-600">
                    {language === "sw" ? "Inafikiri..." : "Thinking..."}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Actions - Show only at start */}
          {showQuickActions && messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4"
            >
              <div className="text-center mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{text.quickStart}</h3>
                <p className="text-xs text-gray-600">{text.quickStartDesc}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleQuickAction(action)}
                      className="group relative overflow-hidden rounded-xl p-4 bg-white border-2 border-gray-100 hover:border-gray-300 transition-all hover:shadow-lg hover:scale-105"
                    >
                      <div className={`h-10 w-10 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-xs font-medium text-gray-900 text-center leading-tight">
                        {action.label}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={text.placeholder}
              disabled={loading}
              className="flex-1 h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#2E7D32] focus:ring-0"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="h-12 px-6 bg-[#2E7D32] hover:bg-[#1B5E20] rounded-xl shadow-lg"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            {language === "sw" 
              ? "Sankofa AI inaweza kufanya makosa. Hakikisha majibu yako."
              : "Sankofa AI can make mistakes. Verify important info."}
          </p>
        </div>
      </div>
    </div>
  );
}

AISupport.displayName = "AISupport";