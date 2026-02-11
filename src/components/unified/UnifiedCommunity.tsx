/**
 * UNIFIED COMMUNITY - WORLD-CLASS REDESIGN
 * 
 * Farmer Question: "Who can help me? What are others doing?"
 * 
 * DESIGN PHILOSOPHY:
 * - Peer discussions
 * - Expert Q&A
 * - Success stories
 * - Local groups
 */

import { useState } from "react";
import { 
  Users, MessageSquare, ThumbsUp, Award, Plus, Search, Sparkles
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Avatar } from "../ui/avatar";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface UnifiedCommunityProps {
  userId: string;
  region: string;
  language: "en" | "sw";
}

interface Post {
  id: string;
  author: string;
  role: string;
  content: string;
  likes: number;
  replies: number;
  category: string;
  timeAgo: string;
}

export function UnifiedCommunity({
  userId,
  region,
  language
}: UnifiedCommunityProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts] = useState<Post[]>([
    {
      id: "1",
      author: language === "en" ? "John Farmer" : "John Mkulima",
      role: language === "en" ? "Farmer" : "Mkulima",
      content: language === "en" 
        ? "Just harvested 3 tonnes of maize from 2 acres using the new planting method. Amazing results!"
        : "Nimevuna tani 3 za mahindi kutoka ekari 2 kwa kutumia mbinu mpya ya kupanda. Matokeo ya ajabu!",
      likes: 24,
      replies: 8,
      category: language === "en" ? "Success Story" : "Hadithi ya Mafanikio",
      timeAgo: language === "en" ? "2 hours ago" : "saa 2 zilizopita"
    },
    {
      id: "2",
      author: language === "en" ? "Dr. Mary Extension" : "Dk. Mary Ugani",
      role: language === "en" ? "Extension Officer" : "Afisa Ugani",
      content: language === "en"
        ? "Reminder: Apply first top-dressing fertilizer 3-4 weeks after planting. Use urea at 50kg/acre."
        : "Kumbusho: Tumia mbolea ya kwanza ya juu wiki 3-4 baada ya kupanda. Tumia urea kilo 50 kwa ekari.",
      likes: 45,
      replies: 12,
      category: language === "en" ? "Expert Advice" : "Ushauri wa Wataalamu",
      timeAgo: language === "en" ? "1 day ago" : "siku 1 iliyopita"
    },
    {
      id: "3",
      author: language === "en" ? "Sarah Cooperative" : "Sarah Ushirika",
      role: language === "en" ? "Cooperative Member" : "Mwanachama wa Ushirika",
      content: language === "en"
        ? "Looking for farmers interested in group purchasing of fertilizer. We can get 20% discount for bulk orders."
        : "Ninatafuta wakulima wenye nia ya kununua mbolea kwa kikundi. Tunaweza kupata punguzo la 20% kwa maagizo makubwa.",
      likes: 18,
      replies: 15,
      category: language === "en" ? "Cooperation" : "Ushirikiano",
      timeAgo: language === "en" ? "3 hours ago" : "saa 3 zilizopita"
    }
  ]);

  const text = {
    title: language === "en" ? "Community" : "Jamii",
    subtitle: language === "en" ? "Connect with farmers and experts" : "Unganisha na wakulima na wataalam",
    search: language === "en" ? "Search discussions..." : "Tafuta majadiliano...",
    newPost: language === "en" ? "New Post" : "Chapisho Jipya",
    members: language === "en" ? "Members" : "Wanachama",
    discussions: language === "en" ? "Discussions" : "Majadiliano",
    experts: language === "en" ? "Experts" : "Wataalam",
    reply: language === "en" ? "Reply" : "Jibu",
    like: language === "en" ? "Like" : "Penda",
  };

  const filteredPosts = posts.filter(p => 
    p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryColors: Record<string, any> = {
    [language === "en" ? "Success Story" : "Hadithi ya Mafanikio"]: { bg: "bg-emerald-100", text: "text-emerald-700" },
    [language === "en" ? "Expert Advice" : "Ushauri wa Wataalamu"]: { bg: "bg-blue-100", text: "text-blue-700" },
    [language === "en" ? "Cooperation" : "Ushirikiano"]: { bg: "bg-purple-100", text: "text-purple-700" },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-[#2E7D32] rounded-2xl p-6 text-white shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{text.title}</h1>
                  <p className="text-white/90 text-sm">{text.subtitle}</p>
                </div>
              </div>
              <Button 
                onClick={() => toast.success(language === "en" ? "Opening post creator..." : "Inafungua kiundaji cha chapisho...")}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                {text.newPost}
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{text.members}</p>
                <p className="text-2xl font-bold">2,340</p>
                <p className="text-xs text-white/80">{region}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{text.discussions}</p>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-white/80">{language === "en" ? "active" : "hai"}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{text.experts}</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-white/80">{language === "en" ? "online" : "mtandaoni"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={text.search}
            className="pl-10 h-12 border-2 border-gray-200 focus:border-[#2E7D32]"
          />
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.map((post, index) => {
            const categoryStyle = categoryColors[post.category] || { bg: "bg-gray-100", text: "text-gray-700" };
            
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-2 border-gray-200 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-[#2E7D32] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{post.author[0]}</span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{post.author}</h3>
                            <p className="text-sm text-gray-600">{post.role}</p>
                          </div>
                          <Badge className={`${categoryStyle.bg} ${categoryStyle.text}`}>
                            {post.category}
                          </Badge>
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>

                        <div className="flex items-center gap-4 text-sm">
                          <button 
                            onClick={() => toast.success(language === "en" ? "Liked!" : "Imependwa!")}
                            className="flex items-center gap-2 text-gray-600 hover:text-[#2E7D32] transition-colors"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </button>
                          <button 
                            onClick={() => toast.success(language === "en" ? "Opening replies..." : "Inafungua majibu...")}
                            className="flex items-center gap-2 text-gray-600 hover:text-[#2E7D32] transition-colors"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.replies}</span>
                          </button>
                          <span className="text-gray-500 ml-auto">{post.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="border-2 border-blue-100 bg-blue-50/50">
          <CardContent className="py-4">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1 text-sm">
                  {language === "en" ? "Learn from Peers" : "Jifunze kutoka Wenzako"}
                </h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {language === "en"
                    ? "Connect with 2000+ farmers in your region. Share experiences, ask questions, and learn best practices from experts and successful farmers."
                    : "Unganisha na wakulima 2000+ katika mkoa wako. Shiriki uzoefu, uliza maswali, na jifunze mbinu bora kutoka kwa wataalam na wakulima mafanikio."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

UnifiedCommunity.displayName = "UnifiedCommunity";