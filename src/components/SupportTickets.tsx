import { useState } from "react";
import {
  HeadphonesIcon, Plus, Search, Filter, Clock, CheckCircle,
  AlertCircle, MessageSquare, Phone, Mail, FileText, Send,
  ChevronRight, Tag, Calendar, User, Zap, X, ArrowRight,
  HelpCircle, Book, Video, TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface SupportTicketsProps {
  language: "en" | "sw";
  userId: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: "technical" | "payment" | "delivery" | "account" | "general";
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "high" | "medium" | "low";
  createdAt: string;
  updatedAt: string;
  responseTime?: string;
  messages: number;
}

export function SupportTickets({ language, userId }: SupportTicketsProps) {
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newTicket, setNewTicket] = useState({
    title: "",
    category: "general",
    description: ""
  });

  // Mock ticket data
  const tickets: Ticket[] = [
    {
      id: "tick-001",
      title: language === "en" ? "Payment not reflecting in wallet" : "Malipo hayaonekani kwenye mkoba",
      description: language === "en"
        ? "I made a payment 2 days ago but my wallet balance hasn't updated."
        : "Nilifanya malipo siku 2 zilizopita lakini salio la mkoba wangu halijasasishwa.",
      category: "payment",
      status: "in-progress",
      priority: "high",
      createdAt: "2 days ago",
      updatedAt: "1 hour ago",
      responseTime: "2 hours",
      messages: 3
    },
    {
      id: "tick-002",
      title: language === "en" ? "Cannot access video tutorials" : "Siwezi kufikia mafunzo ya video",
      description: language === "en"
        ? "Videos keep buffering and won't play even on good internet."
        : "Video zinazidi na hazichezi hata kwenye mtandao mzuri.",
      category: "technical",
      status: "open",
      priority: "medium",
      createdAt: "5 hours ago",
      updatedAt: "5 hours ago",
      messages: 1
    },
    {
      id: "tick-003",
      title: language === "en" ? "Fertilizer order delayed" : "Agizo la mbolea limechelewa",
      description: language === "en"
        ? "My fertilizer order was supposed to arrive 3 days ago."
        : "Agizo langu la mbolea lilipaswa kufika siku 3 zilizopita.",
      category: "delivery",
      status: "resolved",
      priority: "high",
      createdAt: "1 week ago",
      updatedAt: "2 days ago",
      messages: 5
    }
  ];

  const categories = [
    { id: "technical", label: language === "en" ? "Technical Issue" : "Tatizo la Kiufundi", icon: Zap, color: "orange" },
    { id: "payment", label: language === "en" ? "Payment" : "Malipo", icon: TrendingUp, color: "green" },
    { id: "delivery", label: language === "en" ? "Delivery" : "Utoaji", icon: ArrowRight, color: "blue" },
    { id: "account", label: language === "en" ? "Account" : "Akaunti", icon: User, color: "purple" },
    { id: "general", label: language === "en" ? "General" : "Jumla", icon: HelpCircle, color: "gray" }
  ];

  const statuses = [
    { id: "all", label: language === "en" ? "All" : "Zote" },
    { id: "open", label: language === "en" ? "Open" : "Wazi" },
    { id: "in-progress", label: language === "en" ? "In Progress" : "Inaendelea" },
    { id: "resolved", label: language === "en" ? "Resolved" : "Imetatuliwa" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-500" };
      case "in-progress": return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500" };
      case "resolved": return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" };
      case "closed": return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-500" };
      default: return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-500" };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const handleCreateTicket = () => {
    // Would submit to backend in production
    console.log("Creating ticket:", newTicket);
    setShowCreateTicket(false);
    setNewTicket({ title: "", category: "general", description: "" });
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/20 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white px-4 lg:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <HeadphonesIcon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {language === "en" ? "Support Center" : "Kituo cha Msaada"}
              </h1>
              <p className="text-green-100 text-sm">
                {language === "en" 
                  ? "Track your support requests"
                  : "Fuatilia maombi yako ya msaada"}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">{tickets.filter(t => t.status === "open").length}</div>
              <div className="text-xs text-white/90">{language === "en" ? "Open" : "Wazi"}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">{tickets.filter(t => t.status === "in-progress").length}</div>
              <div className="text-xs text-white/90">{language === "en" ? "In Progress" : "Inaendelea"}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">{tickets.filter(t => t.status === "resolved").length}</div>
              <div className="text-xs text-white/90">{language === "en" ? "Resolved" : "Imetatuliwa"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 -mt-4">
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {language === "en" ? "Quick Actions" : "Hatua za Haraka"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setShowCreateTicket(true)}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl border-2 border-green-200 transition-all group"
              >
                <Plus className="h-6 w-6 text-green-600" />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">{language === "en" ? "New Ticket" : "Tiketi Mpya"}</div>
                  <div className="text-xs text-gray-600">{language === "en" ? "Report an issue" : "Ripoti tatizo"}</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-50 hover:from-gray-100 hover:to-gray-100 rounded-xl border-2 border-gray-200 transition-all group">
                <Phone className="h-6 w-6 text-green-600" />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">{language === "en" ? "Call Support" : "Piga Msaada"}</div>
                  <div className="text-xs text-gray-600">+255 123 456 789</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-50 hover:from-gray-100 hover:to-gray-100 rounded-xl border-2 border-gray-200 transition-all group">
                <Book className="h-6 w-6 text-green-600" />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">{language === "en" ? "Help Center" : "Kituo cha Msaada"}</div>
                  <div className="text-xs text-gray-600">{language === "en" ? "FAQs & guides" : "Maswali & miongozo"}</div>
                </div>
              </button>
            </div>
          </div>

          {/* Create Ticket Modal */}
          {showCreateTicket && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle>{language === "en" ? "Create Support Ticket" : "Unda Tiketi ya Msaada"}</CardTitle>
                    <button onClick={() => setShowCreateTicket(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === "en" ? "Issue Category" : "Aina ya Tatizo"}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = newTicket.category === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setNewTicket({ ...newTicket, category: cat.id })}
                            className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                              isSelected 
                                ? `bg-${cat.color}-50 border-${cat.color}-300 text-${cat.color}-700`
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="text-sm font-medium">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === "en" ? "Issue Title" : "Kichwa cha Tatizo"}
                    </label>
                    <Input
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                      placeholder={language === "en" ? "Brief description of your issue" : "Maelezo mafupi ya tatizo lako"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === "en" ? "Detailed Description" : "Maelezo ya Kina"}
                    </label>
                    <Textarea
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      placeholder={language === "en" 
                        ? "Please provide as much detail as possible..."
                        : "Tafadhali toa maelezo mengi iwezekanavyo..."}
                      rows={5}
                    />
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {language === "en" 
                        ? "Expected response time: 2-4 hours"
                        : "Muda unatarajiwa wa majibu: saa 2-4"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateTicket}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={!newTicket.title || !newTicket.description}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {language === "en" ? "Submit Ticket" : "Wasilisha Tiketi"}
                    </Button>
                    <Button
                      onClick={() => setShowCreateTicket(false)}
                      variant="outline"
                    >
                      {language === "en" ? "Cancel" : "Ghairi"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search & Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === "en" ? "Search tickets..." : "Tafuta tiketi..."}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {statuses.map((status) => {
                const isActive = filterStatus === status.id;
                return (
                  <button
                    key={status.id}
                    onClick={() => setFilterStatus(status.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tickets List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {language === "en" ? "Your Tickets" : "Tiketi Zako"}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredTickets.length})
              </span>
            </h2>

            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2">
                  {language === "en" ? "No tickets found" : "Hakuna tiketi zilizopatikana"}
                </p>
                <Button onClick={() => setShowCreateTicket(true)} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "en" ? "Create First Ticket" : "Unda Tiketi ya Kwanza"}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTickets.map((ticket) => {
                  const statusColors = getStatusColor(ticket.status);
                  const category = categories.find(c => c.id === ticket.category);
                  const CategoryIcon = category?.icon || HelpCircle;

                  return (
                    <Card key={ticket.id} className="border-2 hover:border-green-300 hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 bg-${category?.color}-100 rounded-xl flex-shrink-0`}>
                            <CategoryIcon className={`h-6 w-6 text-${category?.color}-600`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-bold text-gray-900">{ticket.title}</h3>
                              <Badge className={`${statusColors.bg} ${statusColors.text} ${statusColors.border} border-2 flex-shrink-0`}>
                                <div className={`w-2 h-2 rounded-full ${statusColors.dot} mr-2`}></div>
                                {ticket.status.replace("-", " ")}
                              </Badge>
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {category?.label}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {ticket.createdAt}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {ticket.messages} {language === "en" ? "messages" : "ujumbe"}
                              </span>
                              {ticket.responseTime && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {language === "en" ? "Response:" : "Jibu:"} {ticket.responseTime}
                                </span>
                              )}
                              <span className={`flex items-center gap-1 font-medium ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority.toUpperCase()}
                              </span>
                            </div>

                            <Button size="sm" variant="outline" className="mt-3 border-2">
                              {language === "en" ? "View Details" : "Ona Maelezo"}
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}