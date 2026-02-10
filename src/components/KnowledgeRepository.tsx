import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  BookOpen,
  Search,
  Filter,
  Star,
  Clock,
  TrendingUp,
  Download,
  Share2,
  Bookmark,
  Eye,
  ThumbsUp,
  FileText,
  Video,
  Image,
  Headphones,
  Leaf,
  Droplet,
  Bug,
  Sprout,
  Wheat,
  Sun,
  CloudRain,
  DollarSign,
  Users,
  Target,
  Award,
  ChevronRight
} from "lucide-react";

interface KnowledgeRepositoryProps {
  language: "en" | "sw";
}

export function KnowledgeRepository({ language }: KnowledgeRepositoryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [contentType, setContentType] = useState("all");

  const categories = [
    { id: "all", label: "All Topics", icon: BookOpen, count: 156 },
    { id: "crop-management", label: "Crop Management", icon: Leaf, count: 42 },
    { id: "pest-control", label: "Pest Control", icon: Bug, count: 28 },
    { id: "irrigation", label: "Irrigation", icon: Droplet, count: 18 },
    { id: "soil-health", label: "Soil Health", icon: Sprout, count: 24 },
    { id: "weather", label: "Weather & Climate", icon: CloudRain, count: 16 },
    { id: "market", label: "Market & Pricing", icon: DollarSign, count: 14 },
    { id: "farming-tech", label: "Farming Technology", icon: Target, count: 14 },
  ];

  const contentTypes = [
    { id: "all", label: "All Types", icon: FileText },
    { id: "articles", label: "Articles", icon: FileText },
    { id: "videos", label: "Videos", icon: Video },
    { id: "guides", label: "Guides", icon: BookOpen },
    { id: "podcasts", label: "Podcasts", icon: Headphones },
  ];

  const featuredContent = [
    {
      id: "1",
      title: "Complete Guide to Maize Farming in Tanzania",
      description: "Step-by-step guide covering planting, care, pest control, and harvesting for maximum yield.",
      category: "Crop Management",
      type: "guide",
      icon: Wheat,
      image: "maize",
      author: "Dr. Amani Mwanga",
      readTime: "15 min read",
      views: 12500,
      likes: 856,
      rating: 4.8,
      bookmarked: true,
      tags: ["maize", "planting", "harvest", "yield"],
      difficulty: "intermediate"
    },
    {
      id: "2",
      title: "Integrated Pest Management for Vegetable Crops",
      description: "Learn natural and chemical methods to control pests while maintaining crop health and safety.",
      category: "Pest Control",
      type: "article",
      icon: Bug,
      image: "pest",
      author: "Sarah Kimani",
      readTime: "10 min read",
      views: 8900,
      likes: 623,
      rating: 4.6,
      bookmarked: false,
      tags: ["pests", "organic", "vegetables", "ipm"],
      difficulty: "beginner"
    },
    {
      id: "3",
      title: "Drip Irrigation System Setup and Maintenance",
      description: "Everything you need to know about installing and maintaining efficient drip irrigation systems.",
      category: "Irrigation",
      type: "video",
      icon: Droplet,
      image: "irrigation",
      author: "John Mwakibolwa",
      readTime: "25 min watch",
      views: 15600,
      likes: 1240,
      rating: 4.9,
      bookmarked: true,
      tags: ["irrigation", "water", "drip", "efficiency"],
      difficulty: "advanced"
    },
    {
      id: "4",
      title: "Improving Soil Fertility Naturally",
      description: "Organic methods to enhance soil health using compost, crop rotation, and cover crops.",
      category: "Soil Health",
      type: "article",
      icon: Sprout,
      image: "soil",
      author: "Grace Ndege",
      readTime: "12 min read",
      views: 9800,
      likes: 745,
      rating: 4.7,
      bookmarked: false,
      tags: ["soil", "organic", "compost", "fertility"],
      difficulty: "beginner"
    },
    {
      id: "5",
      title: "Understanding Market Price Trends",
      description: "How to interpret market data and make informed decisions about when to sell your crops.",
      category: "Market & Pricing",
      type: "guide",
      icon: DollarSign,
      image: "market",
      author: "Michael Njoroge",
      readTime: "18 min read",
      views: 7200,
      likes: 512,
      rating: 4.5,
      bookmarked: false,
      tags: ["market", "pricing", "selling", "profit"],
      difficulty: "intermediate"
    },
    {
      id: "6",
      title: "Climate-Smart Farming Practices",
      description: "Adapt your farming methods to changing weather patterns and build resilience.",
      category: "Weather & Climate",
      type: "podcast",
      icon: CloudRain,
      image: "climate",
      author: "Prof. Daniel Makau",
      readTime: "35 min listen",
      views: 5400,
      likes: 389,
      rating: 4.8,
      bookmarked: true,
      tags: ["climate", "adaptation", "resilience", "weather"],
      difficulty: "intermediate"
    },
  ];

  const popularTopics = [
    { name: "Maize farming", count: 45, trend: "+12%" },
    { name: "Pest control", count: 38, trend: "+8%" },
    { name: "Organic methods", count: 32, trend: "+15%" },
    { name: "Water management", count: 28, trend: "+5%" },
    { name: "Crop rotation", count: 24, trend: "+10%" },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-700";
      case "intermediate": return "bg-yellow-100 text-yellow-700";
      case "advanced": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "guide": return BookOpen;
      case "podcast": return Headphones;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 rounded-3xl p-6 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-black">Knowledge Hub</h1>
              </div>
              <p className="text-white/90 text-sm mb-3">
                Expert articles, guides, and resources for modern farming
              </p>
              <div className="flex items-center gap-3">
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                  156 Resources
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                  12 Categories
                </Badge>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
            <Input
              placeholder="Search articles, guides, videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 h-12"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all whitespace-nowrap
                ${isActive
                  ? "bg-orange-600 text-white border-orange-600 shadow-lg"
                  : "bg-white text-gray-700 border-gray-200 hover:border-orange-300"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span className="font-semibold text-sm">{cat.label}</span>
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-bold
                ${isActive ? "bg-white/20" : "bg-gray-100"}
              `}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Type Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          const isActive = contentType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => setContentType(type.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap text-sm
                ${isActive
                  ? "bg-orange-100 text-orange-700 border border-orange-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Featured Content Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredContent.map((content) => {
          const Icon = content.icon;
          const TypeIcon = getTypeIcon(content.type);
          
          return (
            <Card key={content.id} className="hover:shadow-xl transition-all border-2 hover:border-orange-300 group">
              <CardHeader className="space-y-3">
                {/* Type & Bookmark */}
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="gap-1">
                    <TypeIcon className="h-3 w-3" />
                    {content.type}
                  </Badge>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Bookmark 
                      className={`h-4 w-4 ${content.bookmarked ? 'fill-orange-600 text-orange-600' : 'text-gray-400'}`}
                    />
                  </button>
                </div>

                {/* Icon & Category */}
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{content.category}</p>
                    <Badge className={getDifficultyColor(content.difficulty)}>
                      {content.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <CardTitle className="text-base font-bold group-hover:text-orange-600 transition-colors">
                    {content.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-2">
                    {content.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {content.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                      <Eye className="h-3 w-3" />
                    </div>
                    <p className="text-xs font-bold text-gray-900">
                      {(content.views / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                      <ThumbsUp className="h-3 w-3" />
                    </div>
                    <p className="text-xs font-bold text-gray-900">
                      {content.likes}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <p className="text-xs font-bold text-gray-900">
                      {content.rating}
                    </p>
                  </div>
                </div>

                {/* Author & Read Time */}
                <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {content.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {content.readTime}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1 bg-orange-600 hover:bg-orange-700" size="sm">
                    Read Now
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Popular Topics Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Popular Topics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-lg font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{topic.name}</p>
                      <p className="text-xs text-gray-600">{topic.count} articles</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    {topic.trend}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-5 w-5 text-gray-600" />
              Quick Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              My Bookmarks
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Reading History
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Downloaded
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Star className="h-4 w-4 mr-2" />
              Favorites
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}