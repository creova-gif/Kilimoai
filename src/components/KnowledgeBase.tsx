import { useState } from "react";
import {
  BookOpen, Search, ChevronDown, ChevronUp, FileText,
  Leaf, TrendingUp, Beaker, Shield, Calendar, Eye,
  Bookmark, Share2, ThumbsUp, Clock, Tag, ArrowRight,
  HelpCircle, Info, Sparkles, Filter, CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

interface KnowledgeBaseProps {
  language: "en" | "sw";
  userId: string;
}

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "crop" | "livestock" | "finance" | "tools" | "market" | "general";
  tags: string[];
  readTime: string;
  views: number;
  helpful: number;
  lastUpdated: string;
  relatedArticles: string[];
  expertVerified: boolean;
}

interface Term {
  term: string;
  definition: string;
}

export function KnowledgeBase({ language, userId }: KnowledgeBaseProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null);

  // Mock articles data
  const articles: Article[] = [
    {
      id: "art-001",
      title: language === "en" ? "Complete Guide to Maize Farming" : "Mwongozo Kamili wa Kilimo cha Mahindi",
      summary: language === "en"
        ? "Everything you need to know about growing maize successfully in Tanzania, from land preparation to harvest."
        : "Kila kitu unachohitaji kujua kuhusu kulima mahindi kwa mafanikio Tanzania, kutoka maandalizi ya ardhi hadi mavuno.",
      content: language === "en"
        ? "Maize is one of the most important staple crops in Tanzania. Proper cultivation requires understanding soil requirements, optimal planting times, and pest management strategies."
        : "Mahindi ni mojawapo ya mazao muhimu zaidi Tanzania. Ulimaji sahihi unahitaji kuelewa mahitaji ya udongo, wakati bora wa kupanda, na mikakati ya kudhibiti wadudu.",
      category: "crop",
      tags: ["maize", "planting", "harvest", "beginner"],
      readTime: "8 min",
      views: 2340,
      helpful: 189,
      lastUpdated: "2 days ago",
      relatedArticles: ["art-002", "art-003"],
      expertVerified: true
    },
    {
      id: "art-002",
      title: language === "en" ? "Pest Control: Organic Methods" : "Kudhibiti Wadudu: Njia za Kikaboni",
      summary: language === "en"
        ? "Learn natural and organic approaches to managing pests without harmful chemicals."
        : "Jifunza njia za asili na kikaboni za kusimamia wadudu bila kemikali zenye madhara.",
      content: language === "en"
        ? "Organic pest control uses natural predators, companion planting, and botanical pesticides to protect crops while maintaining ecosystem health."
        : "Udhibiti wa wadudu wa kikaboni hutumia wanyama wanaokula wadudu, kupanda mimea ya ushirikiano, na dawa za mimea kulinda mazao huku ukidumisha afya ya mazingira.",
      category: "crop",
      tags: ["pest", "organic", "sustainable", "intermediate"],
      readTime: "12 min",
      views: 1876,
      helpful: 142,
      lastUpdated: "5 days ago",
      relatedArticles: ["art-001"],
      expertVerified: true
    },
    {
      id: "art-003",
      title: language === "en" ? "Understanding Soil pH" : "Kuelewa pH ya Udongo",
      summary: language === "en"
        ? "Why soil pH matters and how to test and adjust it for optimal crop growth."
        : "Kwa nini pH ya udongo ni muhimu na jinsi ya kuipima na kuirekebisha kwa ukuaji bora wa mazao.",
      content: language === "en"
        ? "Soil pH affects nutrient availability to plants. Most crops prefer slightly acidic to neutral soil (pH 6.0-7.0). Testing and amending soil pH can significantly improve yields."
        : "pH ya udongo inaathiri upatikanaji wa virutubisho kwa mimea. Mazao mengi yanapenda udongo wenye asidi kidogo hadi wastani (pH 6.0-7.0). Kupima na kurekebisha pH ya udongo kunaweza kuongeza mavuno kwa kiasi kikubwa.",
      category: "tools",
      tags: ["soil", "testing", "nutrients", "advanced"],
      readTime: "10 min",
      views: 1234,
      helpful: 98,
      lastUpdated: "1 week ago",
      relatedArticles: ["art-001"],
      expertVerified: true
    },
    {
      id: "art-004",
      title: language === "en" ? "Poultry Health Management" : "Usimamizi wa Afya ya Kuku",
      summary: language === "en"
        ? "Essential practices for keeping your chickens healthy and productive."
        : "Mazoezi muhimu ya kuweka kuku wako wenye afya na wazalishaji.",
      content: language === "en"
        ? "Regular vaccination, proper housing, clean water, and balanced nutrition are key to successful poultry farming. Early disease detection saves your flock."
        : "Chanjo za kawaida, makazi sahihi, maji safi, na lishe kamili ni muhimu kwa ufugaji wa kuku wenye mafanikio. Kugunduwa magonjwa mapema kunaokoa kundi lako.",
      category: "livestock",
      tags: ["poultry", "health", "vaccination", "beginner"],
      readTime: "15 min",
      views: 1567,
      helpful: 124,
      lastUpdated: "3 days ago",
      relatedArticles: [],
      expertVerified: true
    },
    {
      id: "art-005",
      title: language === "en" ? "Farm Record Keeping Basics" : "Msingi wa Kuweka Kumbukumbu za Shamba",
      summary: language === "en"
        ? "Simple methods to track your farm activities, expenses, and income."
        : "Njia rahisi za kufuatilia shughuli za shamba, gharama, na mapato.",
      content: language === "en"
        ? "Good record keeping helps you understand profitability, make better decisions, and access credit. Start with basic expense and income tracking."
        : "Kuweka kumbukumbu nzuri kunakusaidia kuelewa faida, kufanya maamuzi bora, na kupata mikopo. Anza na kufuatilia gharama na mapato ya msingi.",
      category: "finance",
      tags: ["records", "accounting", "profit", "beginner"],
      readTime: "7 min",
      views: 987,
      helpful: 76,
      lastUpdated: "4 days ago",
      relatedArticles: [],
      expertVerified: false
    }
  ];

  // Technical terms with inline definitions
  const technicalTerms: Term[] = [
    {
      term: "pH",
      definition: language === "en" 
        ? "A measure of how acidic or alkaline soil is, ranging from 0-14"
        : "Kipimo cha jinsi udongo unavyokuwa na asidi au alkaline, kutoka 0-14"
    },
    {
      term: "companion planting",
      definition: language === "en"
        ? "Growing different plants together that benefit each other"
        : "Kulima mimea tofauti pamoja ambayo inafaaidiana"
    },
    {
      term: "botanical pesticides",
      definition: language === "en"
        ? "Natural pest control substances made from plants"
        : "Dawa za asili za kudhibiti wadudu zilizoundwa kutoka mimea"
    }
  ];

  const categories = [
    { id: "all", label: language === "en" ? "All" : "Zote", icon: BookOpen, color: "gray" },
    { id: "crop", label: language === "en" ? "Crops" : "Mazao", icon: Leaf, color: "green" },
    { id: "livestock", label: language === "en" ? "Livestock" : "Mifugo", icon: Sparkles, color: "purple" },
    { id: "finance", label: language === "en" ? "Finance" : "Fedha", icon: TrendingUp, color: "blue" },
    { id: "tools", label: language === "en" ? "Tools" : "Zana", icon: Beaker, color: "orange" },
    { id: "market", label: language === "en" ? "Market" : "Soko", icon: TrendingUp, color: "indigo" }
  ];

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSection = (articleId: string, section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [`${articleId}-${section}`]: !prev[`${articleId}-${section}`]
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "crop": return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: "text-green-600" };
      case "livestock": return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: "text-purple-600" };
      case "finance": return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "text-blue-600" };
      case "tools": return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: "text-orange-600" };
      case "market": return { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", icon: "text-indigo-600" };
      default: return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", icon: "text-gray-600" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/20 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white px-4 lg:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {language === "en" ? "Knowledge Base" : "Hifadhi ya Ujuzi"}
              </h1>
              <p className="text-green-100 text-sm">
                {language === "en" 
                  ? "Expert articles and farming guides"
                  : "Makala za wataalamu na miongozo ya kilimo"}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === "en" ? "Search articles, topics, or tags..." : "Tafuta makala, mada, au lebo..."}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 -mt-4">
        <div className="space-y-6">
          {/* Category Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
                      isActive 
                        ? `bg-${category.color}-50 border-${category.color}-300 text-${category.color}-700` 
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Popular Topics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              {language === "en" ? "Popular Topics" : "Mada Maarufu"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {["maize", "pest control", "soil", "poultry", "irrigation", "finance", "market prices"].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSearchQuery(topic)}
                  className="px-3 py-2 bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 rounded-lg text-sm font-medium transition-all border-2 border-transparent hover:border-green-200"
                >
                  <Tag className="h-3 w-3 inline mr-1" />
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Articles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {language === "en" ? "Articles" : "Makala"}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredArticles.length})
                </span>
              </h2>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2">
                  {language === "en" ? "No articles found" : "Hakuna makala zilizopatikana"}
                </p>
                <p className="text-sm text-gray-500">
                  {language === "en" 
                    ? "Try adjusting your search or filters"
                    : "Jaribu kubadilisha utafutaji au vichujio"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredArticles.map((article) => {
                  const isExpanded = expandedArticle === article.id;
                  const colors = getCategoryColor(article.category);
                  
                  return (
                    <Card key={article.id} className={`border-2 ${isExpanded ? colors.border : 'border-gray-200'} hover:border-gray-300 transition-all`}>
                      <CardContent className="p-6">
                        {/* Article Header */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`${colors.bg} ${colors.text} ${colors.border} border-2`}>
                                {categories.find(c => c.id === article.category)?.label}
                              </Badge>
                              {article.expertVerified && (
                                <Badge className="bg-blue-100 text-blue-700 border-blue-200 border-2">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {language === "en" ? "Verified" : "Imethibitishwa"}
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                            
                            {/* Plain-language summary */}
                            <div className={`p-4 ${colors.bg} border-2 ${colors.border} rounded-lg mb-4`}>
                              <p className={`text-sm ${colors.text} font-medium mb-1`}>
                                {language === "en" ? "📋 Summary" : "📋 Muhtasari"}
                              </p>
                              <p className="text-sm text-gray-700">{article.summary}</p>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {article.readTime} {language === "en" ? "read" : "kusoma"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {article.views} {language === "en" ? "views" : "watazamaji"}
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                {article.helpful} {language === "en" ? "helpful" : "inasaidia"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {language === "en" ? "Updated" : "Imesasishwa"} {article.lastUpdated}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Content */}
                        {!isExpanded ? (
                          <Button
                            onClick={() => setExpandedArticle(article.id)}
                            variant="outline"
                            className="w-full border-2"
                          >
                            {language === "en" ? "Read Full Article" : "Soma Makala Kamili"}
                            <ChevronDown className="h-4 w-4 ml-2" />
                          </Button>
                        ) : (
                          <div className="space-y-4">
                            {/* Article Content - Expandable Sections */}
                            <div className="border-t-2 border-gray-200 pt-4">
                              <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-4">{article.content}</p>

                                {/* Example expandable sections */}
                                <div className="space-y-3">
                                  {/* Section 1 */}
                                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                      onClick={() => toggleSection(article.id, "section1")}
                                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-all"
                                    >
                                      <span className="font-semibold text-gray-900">
                                        {language === "en" ? "🌱 Getting Started" : "🌱 Kuanza"}
                                      </span>
                                      {expandedSections[`${article.id}-section1`] ? (
                                        <ChevronUp className="h-5 w-5 text-gray-600" />
                                      ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-600" />
                                      )}
                                    </button>
                                    {expandedSections[`${article.id}-section1`] && (
                                      <div className="p-4 bg-white">
                                        <p className="text-gray-700 text-sm">
                                          {language === "en"
                                            ? "Start with proper land preparation. Clear the field, plow to a depth of 15-20cm, and ensure good drainage."
                                            : "Anza na maandalizi sahihi ya ardhi. Futa shamba, lima kwa kina cha cm 15-20, na hakikisha maji yanatoka vizuri."}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Section 2 - with technical term */}
                                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                      onClick={() => toggleSection(article.id, "section2")}
                                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-all"
                                    >
                                      <span className="font-semibold text-gray-900">
                                        {language === "en" ? "💧 Soil & Water Management" : "💧 Usimamizi wa Udongo na Maji"}
                                      </span>
                                      {expandedSections[`${article.id}-section2`] ? (
                                        <ChevronUp className="h-5 w-5 text-gray-600" />
                                      ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-600" />
                                      )}
                                    </button>
                                    {expandedSections[`${article.id}-section2`] && (
                                      <div className="p-4 bg-white">
                                        <p className="text-gray-700 text-sm">
                                          {language === "en"
                                            ? "Test your soil's "
                                            : "Pima "}
                                          <span 
                                            className="relative inline-flex items-center gap-1 text-blue-600 font-medium cursor-help border-b-2 border-blue-300 border-dotted"
                                            onMouseEnter={() => setHoveredTerm("pH")}
                                            onMouseLeave={() => setHoveredTerm(null)}
                                          >
                                            pH
                                            <HelpCircle className="h-3 w-3" />
                                            {hoveredTerm === "pH" && (
                                              <span className="absolute z-10 bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                                                {technicalTerms.find(t => t.term === "pH")?.definition}
                                              </span>
                                            )}
                                          </span>
                                          {language === "en"
                                            ? " before planting. Most crops prefer pH 6.0-7.0."
                                            : " ya udongo wako kabla ya kupanda. Mazao mengi yanapenda pH 6.0-7.0."}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                              {article.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {/* Related Articles */}
                            {article.relatedArticles.length > 0 && (
                              <div className={`p-4 ${colors.bg} border-2 ${colors.border} rounded-lg`}>
                                <h4 className={`text-sm font-bold ${colors.text} mb-3 flex items-center gap-2`}>
                                  <ArrowRight className="h-4 w-4" />
                                  {language === "en" ? "Related Articles" : "Makala Zinazohusiana"}
                                </h4>
                                <div className="space-y-2">
                                  {article.relatedArticles.map((relatedId) => {
                                    const related = articles.find(a => a.id === relatedId);
                                    return related ? (
                                      <button
                                        key={relatedId}
                                        onClick={() => setExpandedArticle(relatedId)}
                                        className="w-full text-left p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-all flex items-center justify-between group"
                                      >
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">
                                          {related.title}
                                        </span>
                                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                                      </button>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t-2 border-gray-200">
                              <Button variant="outline" size="sm" className="flex-1">
                                <ThumbsUp className="h-4 w-4 mr-2" />
                                {language === "en" ? "Helpful" : "Inasaidia"}
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                <Bookmark className="h-4 w-4 mr-2" />
                                {language === "en" ? "Save" : "Hifadhi"}
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                <Share2 className="h-4 w-4 mr-2" />
                                {language === "en" ? "Share" : "Shiriki"}
                              </Button>
                            </div>

                            <Button
                              onClick={() => setExpandedArticle(null)}
                              variant="ghost"
                              className="w-full"
                            >
                              {language === "en" ? "Collapse Article" : "Funga Makala"}
                              <ChevronUp className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        )}
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
