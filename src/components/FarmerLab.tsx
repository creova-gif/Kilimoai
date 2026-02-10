import { useState } from "react";
import {
  Beaker, TrendingUp, Plus, Search, Filter, Award, AlertTriangle,
  CheckCircle, BarChart3, Users, Calendar, Tag, ThumbsUp, MessageCircle,
  Eye, Share2, Camera, FileText, ChevronRight, Info, Lightbulb, Target
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

interface FarmerLabProps {
  language: "en" | "sw";
  userId: string;
}

interface Experiment {
  id: string;
  title: string;
  description: string;
  author: string;
  category: "seeds" | "fertilizer" | "pest" | "irrigation" | "technique";
  status: "ongoing" | "completed";
  verified: boolean;
  participants: number;
  results?: string;
  startDate: string;
  duration: string;
  likes: number;
  comments: number;
  tags: string[];
}

export function FarmerLab({ language, userId }: FarmerLabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const experiments: Experiment[] = [
    {
      id: "exp-001",
      title: language === "en" 
        ? "Comparing Maize Varieties: H614 vs H628"
        : "Kulinganisha Aina za Mahindi: H614 dhidi ya H628",
      description: language === "en"
        ? "Testing two hybrid maize varieties side-by-side to compare yields, pest resistance, and drought tolerance."
        : "Kupima aina mbili za mahindi violezo kando kwa kando kulinganisha mavuno, upinzani wa wadudu, na ustahimilivu wa ukame.",
      author: "John Mollel",
      category: "seeds",
      status: "ongoing",
      verified: true,
      participants: 12,
      startDate: "2 weeks ago",
      duration: "4 months",
      likes: 34,
      comments: 18,
      tags: ["maize", "varieties", "comparison"]
    },
    {
      id: "exp-002",
      title: language === "en"
        ? "Organic vs Chemical Fertilizer Results"
        : "Matokeo ya Mbolea ya Kikaboni dhidi ya Kemikali",
      description: language === "en"
        ? "6-month trial comparing organic compost with DAP fertilizer on tomato yields."
        : "Jaribio la miezi 6 linalinganisha mbolea ya kikaboni na mbolea ya DAP kwenye mavuno ya nyanya.",
      author: "Mama Neema",
      category: "fertilizer",
      status: "completed",
      verified: false,
      participants: 8,
      results: language === "en"
        ? "Organic fertilizer showed 15% better yield with lower costs. Soil health improved significantly."
        : "Mbolea ya kikaboni ilionyesha mavuno bora ya 15% na gharama za chini. Afya ya udongo iliborekakin kiasi kikubwa.",
      startDate: "6 months ago",
      duration: "6 months",
      likes: 67,
      comments: 32,
      tags: ["fertilizer", "organic", "tomatoes", "results"]
    }
  ];

  const categories = [
    { id: "all", label: language === "en" ? "All" : "Zote", color: "gray" },
    { id: "seeds", label: language === "en" ? "Seeds & Varieties" : "Mbegu na Aina", color: "green" },
    { id: "fertilizer", label: language === "en" ? "Fertilizers" : "Mbolea", color: "blue" },
    { id: "pest", label: language === "en" ? "Pest Control" : "Udhibiti wa Wadudu", color: "red" },
    { id: "irrigation", label: language === "en" ? "Irrigation" : "Umwagiliaji", color: "cyan" },
    { id: "technique", label: language === "en" ? "Techniques" : "Mbinu", color: "purple" }
  ];

  const filteredExperiments = experiments.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || exp.category === selectedCategory;
    const matchesVerified = !showVerifiedOnly || exp.verified;
    return matchesSearch && matchesCategory && matchesVerified;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/20 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white px-4 lg:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Beaker className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {language === "en" ? "Farmer Lab" : "Maabara ya Mkulima"}
              </h1>
              <p className="text-green-100 text-sm">
                {language === "en" 
                  ? "Experiment, learn, and share discoveries"
                  : "Jaribu, jifunze, na shiriki ugunduzi"}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === "en" ? "Search experiments..." : "Tafuta majaribio..."}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 -mt-4">
        <div className="space-y-6">
          {/* Start Experiment CTA */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-600 rounded-xl">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">
                  {language === "en" ? "Start Your Own Experiment" : "Anza Jaribio Lako"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {language === "en"
                    ? "Test new techniques, compare products, or share your findings with the community."
                    : "Jaribu mbinu mpya, linganisha bidhaa, au shiriki matokeo yako na jamii."}
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "en" ? "Create Experiment" : "Unda Jaribio"}
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap text-sm font-medium ${
                      isActive 
                        ? `bg-${category.color}-50 border-${category.color}-300 text-${category.color}-700` 
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  showVerifiedOnly
                    ? "bg-gray-100 text-gray-700 border-2 border-gray-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                {language === "en" ? "Verified Only" : "Zilizothibitishwa Tu"}
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <span className="font-bold">{language === "en" ? "Important:" : "Muhimu:"}</span>{" "}
              {language === "en"
                ? "Farmer Lab experiments are community-driven. Results marked 'Verified' have been reviewed by agricultural experts. Always consult with experts before making major farming decisions."
                : "Majaribio ya Farmer Lab yanafanywa na jamii. Matokeo yaliyotandikwa 'Yamethibitishwa' yamekaguliwa na wataalam wa kilimo. Daima shauri na wataalam kabla ya kufanya maamuzi makubwa ya kilimo."}
            </div>
          </div>

          {/* Experiments List */}
          <div className="space-y-4">
            {filteredExperiments.map((exp) => {
              const cat = categories.find(c => c.id === exp.category);
              
              return (
                <Card key={exp.id} className="border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`bg-${cat?.color}-100 text-${cat?.color}-700 border-${cat?.color}-200 border-2`}>
                            {cat?.label}
                          </Badge>
                          {exp.verified && (
                            <Badge className="bg-gray-100 text-gray-700 border-gray-200 border-2">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {language === "en" ? "Verified" : "Imethibitishwa"}
                            </Badge>
                          )}
                          <Badge className={`${
                            exp.status === "completed"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-yellow-100 text-yellow-700 border-yellow-200"
                          } border-2`}>
                            {exp.status === "completed" 
                              ? (language === "en" ? "Completed" : "Imekamilika")
                              : (language === "en" ? "Ongoing" : "Inaendelea")}
                          </Badge>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">{exp.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{exp.description}</p>

                        {exp.results && (
                          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="h-5 w-5 text-green-600" />
                              <span className="font-bold text-green-900">
                                {language === "en" ? "Results" : "Matokeo"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{exp.results}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {exp.participants} {language === "en" ? "participants" : "washiriki"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {language === "en" ? "Started" : "Ilianza"} {exp.startDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 className="h-3 w-3" />
                            {exp.duration}
                          </span>
                          <span className="text-gray-700">
                            {language === "en" ? "By:" : "Na:"} <span className="font-medium">{exp.author}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {exp.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                      <div className="flex items-center gap-4 text-sm">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="font-medium">{exp.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span className="font-medium">{exp.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                          <Share2 className="h-4 w-4" />
                          {language === "en" ? "Share" : "Shiriki"}
                        </button>
                      </div>
                      <Button variant="outline" className="border-2">
                        {language === "en" ? "View Details" : "Ona Maelezo"}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}