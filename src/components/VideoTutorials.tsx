import { useState } from "react";
import {
  Play, Pause, Clock, CheckCircle, BookOpen, Filter,
  Search, TrendingUp, Star, Download, Wifi, WifiOff,
  Video, PlayCircle, BarChart3, Award, ChevronRight,
  Eye, ThumbsUp, Share2, Bookmark, RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";

interface VideoTutorialsProps {
  language: "en" | "sw";
  userId: string;
}

interface VideoItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: "crop" | "livestock" | "finance" | "tools" | "market";
  level: "beginner" | "intermediate" | "advanced";
  views: number;
  likes: number;
  thumbnail: string;
  progress?: number;
  completed: boolean;
  trending: boolean;
  new: boolean;
  downloadable: boolean;
  lowBandwidth: boolean;
}

export function VideoTutorials({ language, userId }: VideoTutorialsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [lowBandwidthMode, setLowBandwidthMode] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  // Mock video data
  const videos: VideoItem[] = [
    {
      id: "vid-001",
      title: language === "en" ? "Maize Planting Basics" : "Msingi wa Kupanda Mahindi",
      description: language === "en" 
        ? "Learn proper spacing, depth, and timing for maize planting"
        : "Jifunze nafasi sahihi, kina, na muda wa kupanda mahindi",
      duration: "12:30",
      category: "crop",
      level: "beginner",
      views: 1250,
      likes: 98,
      thumbnail: "🌽",
      progress: 65,
      completed: false,
      trending: true,
      new: false,
      downloadable: true,
      lowBandwidth: true
    },
    {
      id: "vid-002",
      title: language === "en" ? "Pest Management Techniques" : "Mbinu za Kudhibiti Wadudu",
      description: language === "en"
        ? "Organic and chemical methods for controlling common pests"
        : "Njia za kikaboni na kemikali za kudhibiti wadudu wa kawaida",
      duration: "18:45",
      category: "crop",
      level: "intermediate",
      views: 890,
      likes: 76,
      thumbnail: "🦗",
      completed: false,
      trending: false,
      new: true,
      downloadable: true,
      lowBandwidth: true
    },
    {
      id: "vid-003",
      title: language === "en" ? "Chicken Vaccination Guide" : "Mwongozo wa Chanjo za Kuku",
      description: language === "en"
        ? "Complete vaccination schedule and techniques for poultry"
        : "Ratiba kamili ya chanjo na mbinu kwa kuku",
      duration: "15:20",
      category: "livestock",
      level: "beginner",
      views: 654,
      likes: 52,
      thumbnail: "🐔",
      completed: true,
      trending: false,
      new: false,
      downloadable: true,
      lowBandwidth: true
    },
    {
      id: "vid-004",
      title: language === "en" ? "Farm Financial Records" : "Kumbukumbu za Fedha za Shamba",
      description: language === "en"
        ? "How to track expenses and calculate profit margins"
        : "Jinsi ya kufuatilia gharama na kukokotoa faida",
      duration: "20:15",
      category: "finance",
      level: "intermediate",
      views: 432,
      likes: 38,
      thumbnail: "💰",
      completed: false,
      trending: true,
      new: false,
      downloadable: true,
      lowBandwidth: true
    },
    {
      id: "vid-005",
      title: language === "en" ? "Irrigation System Setup" : "Kuweka Mfumo wa Umwagiliaji",
      description: language === "en"
        ? "Installing and maintaining efficient drip irrigation"
        : "Kuweka na kudumisha umwagiliaji wa matone wenye ufanisi",
      duration: "25:30",
      category: "tools",
      level: "advanced",
      views: 1100,
      likes: 89,
      thumbnail: "💧",
      completed: false,
      trending: true,
      new: true,
      downloadable: false,
      lowBandwidth: false
    }
  ];

  const categories = [
    { id: "all", label: language === "en" ? "All" : "Zote", icon: Video, color: "gray" },
    { id: "crop", label: language === "en" ? "Crops" : "Mazao", icon: BookOpen, color: "green" },
    { id: "livestock", label: language === "en" ? "Livestock" : "Mifugo", icon: Award, color: "purple" },
    { id: "finance", label: language === "en" ? "Finance" : "Fedha", icon: TrendingUp, color: "blue" },
    { id: "tools", label: language === "en" ? "Tools" : "Zana", icon: BarChart3, color: "orange" },
    { id: "market", label: language === "en" ? "Market" : "Soko", icon: Star, color: "indigo" }
  ];

  const levels = [
    { id: "all", label: language === "en" ? "All Levels" : "Viwango Vyote" },
    { id: "beginner", label: language === "en" ? "Beginner" : "Anzia" },
    { id: "intermediate", label: language === "en" ? "Intermediate" : "Wastani" },
    { id: "advanced", label: language === "en" ? "Advanced" : "Juu" }
  ];

  // Continue learning (videos in progress)
  const continueWatching = videos.filter(v => v.progress && v.progress > 0 && !v.completed);
  
  // Filtered videos
  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || v.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || v.level === selectedLevel;
    const matchesBandwidth = !lowBandwidthMode || v.lowBandwidth;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesBandwidth;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "crop": return "green";
      case "livestock": return "purple";
      case "finance": return "blue";
      case "tools": return "orange";
      case "market": return "indigo";
      default: return "gray";
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "beginner": return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" };
      case "intermediate": return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" };
      case "advanced": return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" };
      default: return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/20 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white px-4 lg:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Video className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {language === "en" ? "Video Tutorials" : "Mafunzo ya Video"}
              </h1>
              <p className="text-green-100 text-sm">
                {language === "en" 
                  ? "Learn farming techniques through video"
                  : "Jifunza mbinu za kilimo kupitia video"}
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="space-y-3 mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === "en" ? "Search videos..." : "Tafuta video..."}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>

            {/* Low Bandwidth Toggle */}
            <div 
              onClick={() => setLowBandwidthMode(!lowBandwidthMode)}
              className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl cursor-pointer hover:bg-white/20 transition-all"
            >
              <div className="flex items-center gap-2">
                {lowBandwidthMode ? <WifiOff className="h-5 w-5" /> : <Wifi className="h-5 w-5" />}
                <span className="text-sm font-medium">
                  {language === "en" ? "Low Bandwidth Mode" : "Hali ya Mtandao Mdogo"}
                </span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-all ${lowBandwidthMode ? 'bg-white' : 'bg-white/30'}`}>
                <div className={`w-5 h-5 bg-green-600 rounded-full transition-all transform ${lowBandwidthMode ? 'translate-x-6 mt-0.5' : 'translate-x-0.5 mt-0.5'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 -mt-4">
        <div className="space-y-6">
          {/* Continue Watching */}
          {continueWatching.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-green-600" />
                  {language === "en" ? "Continue Watching" : "Endelea Kutazama"}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {continueWatching.map((video) => (
                  <div key={video.id} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-green-300 transition-all cursor-pointer group">
                    <div className="flex gap-4">
                      <div className="relative w-32 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                        <span className="text-3xl">{video.thumbnail}</span>
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="p-2 bg-white/90 rounded-full">
                            <Play className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        {video.progress && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
                            <div 
                              className="h-full bg-green-600"
                              style={{ width: `${video.progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{video.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                          <Clock className="h-3 w-3" />
                          <span>{video.duration}</span>
                          <span>•</span>
                          <span>{video.progress}% {language === "en" ? "complete" : "imekamilika"}</span>
                        </div>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <Play className="h-3 w-3 mr-1" />
                          {language === "en" ? "Resume" : "Endelea"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {/* Level Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {levels.map((level) => {
                const isActive = selectedLevel === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {level.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Video Grid */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {language === "en" ? "All Videos" : "Video Zote"}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredVideos.length})
                </span>
              </h2>
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                <Filter className="h-4 w-4" />
                {language === "en" ? "Sort" : "Panga"}
              </button>
            </div>

            {filteredVideos.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                  <Video className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2">
                  {language === "en" ? "No videos found" : "Hakuna video zilizopatikana"}
                </p>
                <p className="text-sm text-gray-500">
                  {language === "en" 
                    ? "Try adjusting your filters or search query"
                    : "Jaribu kubadilisha vichujio vyako au utaftaji"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVideos.map((video) => {
                  const levelBadge = getLevelBadge(video.level);
                  const categoryColor = getCategoryColor(video.category);
                  
                  return (
                    <div key={video.id} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer group">
                      {/* Thumbnail */}
                      <div className={`relative h-40 bg-gradient-to-br from-${categoryColor}-100 to-${categoryColor}-200 flex items-center justify-center overflow-hidden`}>
                        <span className="text-5xl">{video.thumbnail}</span>
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="p-4 bg-white rounded-full">
                            <Play className="h-8 w-8 text-green-600" />
                          </div>
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                          {video.trending && (
                            <Badge className="bg-red-500 text-white border-0">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {language === "en" ? "Trending" : "Maarufu"}
                            </Badge>
                          )}
                          {video.new && (
                            <Badge className="bg-blue-500 text-white border-0">
                              {language === "en" ? "New" : "Mpya"}
                            </Badge>
                          )}
                        </div>

                        {/* Duration */}
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded">
                          {video.duration}
                        </div>

                        {/* Completed Badge */}
                        {video.completed && (
                          <div className="absolute top-2 right-2 p-2 bg-green-500 rounded-full">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{video.title}</h3>
                        </div>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{video.description}</p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {video.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {video.likes}
                            </span>
                          </div>
                          <Badge className={`${levelBadge.bg} ${levelBadge.text} ${levelBadge.border} border text-xs`}>
                            {language === "en" ? video.level : video.level === "beginner" ? "Anzia" : video.level === "intermediate" ? "Wastani" : "Juu"}
                          </Badge>
                        </div>

                        {/* Progress Bar */}
                        {video.progress && video.progress > 0 && (
                          <div className="mb-3">
                            <Progress value={video.progress} className="h-1.5" />
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" size="sm">
                            <Play className="h-4 w-4 mr-1" />
                            {video.progress ? (language === "en" ? "Continue" : "Endelea") : (language === "en" ? "Watch" : "Tazama")}
                          </Button>
                          {video.downloadable && (
                            <Button variant="outline" size="sm" className="px-3">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="px-3">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Low Bandwidth Indicator */}
                        {video.lowBandwidth && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                            <WifiOff className="h-3 w-3" />
                            <span>{language === "en" ? "Low bandwidth available" : "Mtandao mdogo unapatikana"}</span>
                          </div>
                        )}
                      </div>
                    </div>
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
