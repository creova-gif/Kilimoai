import { useState } from "react";
import {
  Users, Plus, Search, Filter, MessageCircle, ThumbsUp,
  Pin, TrendingUp, Award, Image, Mic, Send, MapPin, Calendar,
  Eye, ChevronRight, Star, CheckCircle, AlertCircle, Camera,
  Heart, Share2, Bookmark, MoreVertical, User
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface DiscussionGroupsProps {
  language: "en" | "sw";
  userId: string;
}

interface Post {
  id: string;
  author: {
    name: string;
    role: "farmer" | "expert" | "admin";
    region: string;
    verified: boolean;
  };
  content: string;
  category: "crop" | "livestock" | "market" | "success" | "question";
  timestamp: string;
  likes: number;
  comments: number;
  views: number;
  pinned: boolean;
  trending: boolean;
  hasImage: boolean;
  hasVoice: boolean;
  tags: string[];
}

export function DiscussionGroups({ language, userId }: DiscussionGroupsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPost, setNewPost] = useState({ content: "", category: "question" });

  // Mock posts data
  const posts: Post[] = [
    {
      id: "post-001",
      author: {
        name: "John Mollel",
        role: "expert",
        region: "Arusha",
        verified: true
      },
      content: language === "en"
        ? "🌽 Important Update: Fall armyworm activity increasing in Northern regions. Scout your maize fields daily and report any signs early. I recommend BT-based products for organic control."
        : "🌽 Taarifa Muhimu: Shughuli za wadudu wa Fall armyworm zinaongezeka katika mikoa ya Kaskazini. Kagua mashamba yako ya mahindi kila siku na ripoti ishara zozote mapema. Napendekeza bidhaa za msingi wa BT kwa udhibiti wa kikaboni.",
      category: "crop",
      timestamp: "2 hours ago",
      likes: 42,
      comments: 15,
      views: 234,
      pinned: true,
      trending: false,
      hasImage: false,
      hasVoice: false,
      tags: ["maize", "pest", "armyworm"]
    },
    {
      id: "post-002",
      author: {
        name: "Mama Neema",
        role: "farmer",
        region: "Morogoro",
        verified: false
      },
      content: language === "en"
        ? "📸 My tomato harvest this season! Used organic fertilizer and drip irrigation. Very happy with the results. Ask me anything!"
        : "📸 Mavuno yangu ya nyanya msimu huu! Nilitumia mbolea ya kikaboni na umwagiliaji wa matone. Nimefurahi sana na matokeo. Niulize chochote!",
      category: "success",
      timestamp: "5 hours ago",
      likes: 78,
      comments: 23,
      views: 456,
      pinned: false,
      trending: true,
      hasImage: true,
      hasVoice: false,
      tags: ["tomatoes", "success", "organic"]
    },
    {
      id: "post-003",
      author: {
        name: "David Mwita",
        role: "farmer",
        region: "Dodoma",
        verified: false
      },
      content: language === "en"
        ? "❓ Question: What's the best time to apply top-dressing fertilizer for maize? My crop is 30 days old now."
        : "❓ Swali: Ni wakati gani bora wa kutumia mbolea ya juu kwa mahindi? Mazao yangu yana umri wa siku 30 sasa.",
      category: "question",
      timestamp: "1 day ago",
      likes: 12,
      comments: 8,
      views: 189,
      pinned: false,
      trending: false,
      hasImage: false,
      hasVoice: false,
      tags: ["maize", "fertilizer", "advice"]
    },
    {
      id: "post-004",
      author: {
        name: "AgriMarket Admin",
        role: "admin",
        region: language === "en" ? "National" : "Taifa",
        verified: true
      },
      content: language === "en"
        ? "📊 Market Update: Maize prices have increased by 15% this week due to high demand. Current price: 800 TSh/kg in Dar es Salaam."
        : "📊 Taarifa za Soko: Bei za mahindi zimeongezeka kwa 15% wiki hii kutokana na mahitaji makubwa. Bei ya sasa: TSh 800/kg Dar es Salaam.",
      category: "market",
      timestamp: "1 day ago",
      likes: 56,
      comments: 18,
      views: 678,
      pinned: true,
      trending: false,
      hasImage: false,
      hasVoice: false,
      tags: ["market", "prices", "maize"]
    }
  ];

  const categories = [
    { id: "all", label: language === "en" ? "All" : "Zote", icon: Users, color: "gray" },
    { id: "crop", label: language === "en" ? "Crops" : "Mazao", icon: TrendingUp, color: "green" },
    { id: "livestock", label: language === "en" ? "Livestock" : "Mifugo", icon: Award, color: "purple" },
    { id: "market", label: language === "en" ? "Market" : "Soko", icon: TrendingUp, color: "blue" },
    { id: "success", label: language === "en" ? "Success Stories" : "Hadithi za Mafanikio", icon: Star, color: "yellow" },
    { id: "question", label: language === "en" ? "Questions" : "Maswali", icon: MessageCircle, color: "orange" }
  ];

  const regions = [
    { id: "all", label: language === "en" ? "All Regions" : "Mikoa Yote" },
    { id: "arusha", label: "Arusha" },
    { id: "dodoma", label: "Dodoma" },
    { id: "morogoro", label: "Morogoro" },
    { id: "mwanza", label: "Mwanza" },
    { id: "dar", label: "Dar es Salaam" }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesRegion = selectedRegion === "all" || post.author.region.toLowerCase() === selectedRegion;
    return matchesSearch && matchesCategory && matchesRegion;
  });

  const pinnedPosts = filteredPosts.filter(p => p.pinned);
  const regularPosts = filteredPosts.filter(p => !p.pinned);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "expert": return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" };
      case "admin": return { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" };
      default: return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "expert": return language === "en" ? "Expert" : "Mtaalamu";
      case "admin": return language === "en" ? "Admin" : "Msimamizi";
      case "farmer": return language === "en" ? "Farmer" : "Mkulima";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/20 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white px-4 lg:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {language === "en" ? "Community" : "Jamii"}
              </h1>
              <p className="text-green-100 text-sm">
                {language === "en" 
                  ? "Connect, learn, and share with fellow farmers"
                  : "Unganisha, jifunze, na shiriki na wakulima wenzako"}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">1,234</div>
              <div className="text-xs text-green-100">{language === "en" ? "Members" : "Wanachama"}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">456</div>
              <div className="text-xs text-green-100">{language === "en" ? "Posts" : "Machapisho"}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">89</div>
              <div className="text-xs text-green-100">{language === "en" ? "Experts" : "Wataalam"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 -mt-4">
        <div className="space-y-6">
          {/* New Post Button */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <button
              onClick={() => setShowNewPost(!showNewPost)}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl border-2 border-green-200 transition-all group"
            >
              <div className="p-2 bg-green-600 rounded-full">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <span className="flex-1 text-left font-semibold text-gray-700">
                {language === "en" ? "Share something with the community..." : "Shiriki kitu na jamii..."}
              </span>
            </button>

            {/* New Post Form */}
            {showNewPost && (
              <div className="mt-4 p-4 border-2 border-gray-200 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  {categories.filter(c => c.id !== "all").map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = newPost.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setNewPost({ ...newPost, category: cat.id })}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? `bg-${cat.color}-100 text-${cat.color}-700 border-2 border-${cat.color}-300`
                            : "bg-gray-100 text-gray-600 border-2 border-transparent hover:border-gray-300"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder={language === "en" 
                    ? "Share your experience, ask a question, or give advice..."
                    : "Shiriki uzoefu wako, uliza swali, au toa ushauri..."}
                  rows={4}
                  className="resize-none"
                />

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Image className="h-4 w-4 mr-2" />
                    {language === "en" ? "Photo" : "Picha"}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Camera className="h-4 w-4 mr-2" />
                    {language === "en" ? "Camera" : "Kamera"}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mic className="h-4 w-4 mr-2" />
                    {language === "en" ? "Voice" : "Sauti"}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      console.log("Posting:", newPost);
                      setShowNewPost(false);
                      setNewPost({ content: "", category: "question" });
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={!newPost.content}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {language === "en" ? "Post" : "Chapisha"}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowNewPost(false);
                      setNewPost({ content: "", category: "question" });
                    }}
                    variant="outline"
                  >
                    {language === "en" ? "Cancel" : "Ghairi"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === "en" ? "Search discussions..." : "Tafuta mijadala..."}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
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

            {/* Region Filter */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {regions.map((region) => {
                const isActive = selectedRegion === region.id;
                return (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {region.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pinned Posts */}
          {pinnedPosts.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 px-2">
                <Pin className="h-5 w-5 text-blue-600" />
                {language === "en" ? "Pinned Posts" : "Machapisho Yaliyobanwa"}
              </h2>
              {pinnedPosts.map((post) => {
                const roleColors = getRoleColor(post.author.role);
                
                return (
                  <Card key={post.id} className="border-2 border-blue-200 bg-blue-50/50 hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      {/* Author */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{post.author.name}</span>
                              {post.author.verified && (
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                              )}
                              <Badge className={`${roleColors.bg} ${roleColors.text} ${roleColors.border} border text-xs`}>
                                {getRoleLabel(post.author.role)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <MapPin className="h-3 w-3" />
                              {post.author.region}
                              <span>•</span>
                              <Calendar className="h-3 w-3" />
                              {post.timestamp}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Pin className="h-4 w-4 text-blue-600" />
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <MoreVertical className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

                      {/* Media Indicators */}
                      {(post.hasImage || post.hasVoice) && (
                        <div className="flex gap-2 mb-4">
                          {post.hasImage && (
                            <div className="px-3 py-2 bg-gray-100 rounded-lg flex items-center gap-2">
                              <Image className="h-4 w-4 text-gray-600" />
                              <span className="text-xs font-medium text-gray-700">
                                {language === "en" ? "Image attached" : "Picha imeambatishwa"}
                              </span>
                            </div>
                          )}
                          {post.hasVoice && (
                            <div className="px-3 py-2 bg-gray-100 rounded-lg flex items-center gap-2">
                              <Mic className="h-4 w-4 text-gray-600" />
                              <span className="text-xs font-medium text-gray-700">
                                {language === "en" ? "Voice message" : "Ujumbe wa sauti"}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                        <div className="flex items-center gap-4 text-sm">
                          <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                            <ThumbsUp className="h-4 w-4" />
                            <span className="font-medium">{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span className="font-medium">{post.comments}</span>
                          </button>
                          <span className="flex items-center gap-2 text-gray-500">
                            <Eye className="h-4 w-4" />
                            <span className="text-xs">{post.views}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Bookmark className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Share2 className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Regular Posts */}
          <div className="space-y-3">
            {pinnedPosts.length > 0 && (
              <h2 className="text-lg font-bold text-gray-900 px-2">
                {language === "en" ? "Recent Posts" : "Machapisho ya Hivi Karibuni"}
              </h2>
            )}
            {regularPosts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                  <MessageCircle className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2">
                  {language === "en" ? "No posts found" : "Hakuna machapisho yaliyopatikana"}
                </p>
              </div>
            ) : (
              regularPosts.map((post) => {
                const roleColors = getRoleColor(post.author.role);
                
                return (
                  <Card key={post.id} className="border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      {/* Author */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{post.author.name}</span>
                              {post.author.verified && (
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                              )}
                              {post.author.role !== "farmer" && (
                                <Badge className={`${roleColors.bg} ${roleColors.text} ${roleColors.border} border text-xs`}>
                                  {getRoleLabel(post.author.role)}
                                </Badge>
                              )}
                              {post.trending && (
                                <Badge className="bg-orange-100 text-orange-700 border-orange-200 border text-xs">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  {language === "en" ? "Trending" : "Maarufu"}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <MapPin className="h-3 w-3" />
                              {post.author.region}
                              <span>•</span>
                              <Calendar className="h-3 w-3" />
                              {post.timestamp}
                            </div>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>

                      {/* Content */}
                      <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

                      {/* Media Indicators */}
                      {(post.hasImage || post.hasVoice) && (
                        <div className="flex gap-2 mb-4">
                          {post.hasImage && (
                            <div className="px-3 py-2 bg-gray-100 rounded-lg flex items-center gap-2">
                              <Image className="h-4 w-4 text-gray-600" />
                              <span className="text-xs font-medium text-gray-700">
                                {language === "en" ? "Image attached" : "Picha imeambatishwa"}
                              </span>
                            </div>
                          )}
                          {post.hasVoice && (
                            <div className="px-3 py-2 bg-gray-100 rounded-lg flex items-center gap-2">
                              <Mic className="h-4 w-4 text-gray-600" />
                              <span className="text-xs font-medium text-gray-700">
                                {language === "en" ? "Voice message" : "Ujumbe wa sauti"}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                        <div className="flex items-center gap-4 text-sm">
                          <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                            <ThumbsUp className="h-4 w-4" />
                            <span className="font-medium">{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span className="font-medium">{post.comments}</span>
                          </button>
                          <span className="flex items-center gap-2 text-gray-500">
                            <Eye className="h-4 w-4" />
                            <span className="text-xs">{post.views}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Bookmark className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Share2 className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
