/**
 * UNIFIED LEARNING & SUPPORT - WORLD-CLASS REDESIGN
 * 
 * Farmer Question: "How do I learn more? Who can help me?"
 * 
 * DESIGN PHILOSOPHY:
 * - Video tutorials
 * - Articles & guides
 * - FAQ & help
 * - Contact support
 */

import { useState } from "react";
import { 
  GraduationCap, PlayCircle, BookOpen, HelpCircle, MessageCircle, Phone, Sparkles, Clock
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface UnifiedLearningSupportProps {
  userId: string;
  language: "en" | "sw";
}

interface Course {
  id: string;
  title: string;
  type: "video" | "article";
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  completed: boolean;
}

export function UnifiedLearningSupport({
  userId,
  language
}: UnifiedLearningSupportProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses] = useState<Course[]>([
    {
      id: "1",
      title: language === "en" ? "Modern Maize Farming Techniques" : "Mbinu za Kisasa za Kilimo cha Mahindi",
      type: "video",
      duration: "15 min",
      level: "beginner",
      category: language === "en" ? "Crop Management" : "Usimamizi wa Mazao",
      completed: false
    },
    {
      id: "2",
      title: language === "en" ? "Organic Fertilizer Production" : "Uzalishaji wa Mbolea Asilia",
      type: "video",
      duration: "20 min",
      level: "intermediate",
      category: language === "en" ? "Soil Management" : "Usimamizi wa Udongo",
      completed: true
    },
    {
      id: "3",
      title: language === "en" ? "Pest Control Best Practices" : "Mbinu Bora za Kudhibiti Wadudu",
      type: "article",
      duration: "10 min",
      level: "beginner",
      category: language === "en" ? "Pest Management" : "Usimamizi wa Wadudu",
      completed: false
    },
    {
      id: "4",
      title: language === "en" ? "Financial Planning for Farmers" : "Upangaji wa Fedha kwa Wakulima",
      type: "video",
      duration: "25 min",
      level: "intermediate",
      category: language === "en" ? "Farm Business" : "Biashara ya Shamba",
      completed: false
    }
  ]);

  const text = {
    title: language === "en" ? "Learning & Support" : "Kujifunza na Msaada",
    subtitle: language === "en" ? "Grow your farming skills" : "Ongeza ujuzi wako wa kilimo",
    search: language === "en" ? "Search courses..." : "Tafuta kozi...",
    contactSupport: language === "en" ? "Contact Support" : "Wasiliana na Msaada",
    courses: language === "en" ? "Courses" : "Kozi",
    completed: language === "en" ? "Completed" : "Zimekamilika",
    inProgress: language === "en" ? "In Progress" : "Zinaendelea",
    start: language === "en" ? "Start" : "Anza",
    continue: language === "en" ? "Continue" : "Endelea",
    level: {
      beginner: language === "en" ? "Beginner" : "Mwanzo",
      intermediate: language === "en" ? "Intermediate" : "Kati",
      advanced: language === "en" ? "Advanced" : "Juu"
    },
    getHelp: language === "en" ? "Need Help?" : "Unahitaji Msaada?",
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedCount = courses.filter(c => c.completed).length;
  const inProgressCount = courses.filter(c => !c.completed).length;

  const levelColors = {
    beginner: { bg: "bg-emerald-100", text: "text-emerald-700" },
    intermediate: { bg: "bg-blue-100", text: "text-blue-700" },
    advanced: { bg: "bg-purple-100", text: "text-purple-700" },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
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
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{text.title}</h1>
                  <p className="text-white/90 text-sm">{text.subtitle}</p>
                </div>
              </div>
              <Button 
                onClick={() => toast.success(language === "en" ? "Opening support..." : "Inafungua msaada...")}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {text.contactSupport}
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{text.courses}</p>
                <p className="text-2xl font-bold">{courses.length}</p>
                <p className="text-xs text-white/80">{language === "en" ? "available" : "zinapatikana"}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{text.completed}</p>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-xs text-white/80">{language === "en" ? "courses" : "kozi"}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{text.inProgress}</p>
                <p className="text-2xl font-bold">{inProgressCount}</p>
                <p className="text-xs text-white/80">{language === "en" ? "learning" : "kujifunza"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={text.search}
            className="pl-10 h-12 border-2 border-gray-200 focus:border-[#2E7D32]"
          />
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredCourses.map((course, index) => {
            const levelStyle = levelColors[course.level];
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border-2 ${course.completed ? "border-emerald-200 bg-emerald-50/30" : "border-gray-200"} hover:shadow-xl transition-all`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-lg ${
                        course.type === "video" ? "bg-red-500" : "bg-blue-500"
                      }`}>
                        {course.type === "video" ? (
                          <PlayCircle className="h-6 w-6 text-white" />
                        ) : (
                          <BookOpen className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={`${levelStyle.bg} ${levelStyle.text}`}>
                          {text.level[course.level]}
                        </Badge>
                        {course.completed && (
                          <Badge className="bg-emerald-100 text-emerald-700">
                            ✓ {text.completed}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">{course.title}</h3>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {course.category}
                      </Badge>
                    </div>

                    <Button 
                      size="sm" 
                      className={`w-full ${course.completed ? "bg-gray-600 hover:bg-gray-700" : "bg-[#2E7D32] hover:bg-[#1B5E20]"}`}
                      onClick={() => toast.success(`${course.completed ? text.continue : text.start}: ${course.title}`)}
                    >
                      {course.type === "video" ? (
                        <PlayCircle className="h-3.5 w-3.5 mr-2" />
                      ) : (
                        <BookOpen className="h-3.5 w-3.5 mr-2" />
                      )}
                      {course.completed ? text.continue : text.start}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Support Options */}
        <Card className="border-2 border-gray-200">
          <CardContent className="py-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">{text.getHelp}</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                variant="outline"
                className="h-auto py-4 flex-col gap-2 border-2 hover:border-[#2E7D32]"
                onClick={() => toast.success(language === "en" ? "Opening chat..." : "Inafungua mazungumzo...")}
              >
                <MessageCircle className="h-6 w-6 text-[#2E7D32]" />
                <span className="font-semibold">{language === "en" ? "Live Chat" : "Mazungumzo ya Moja kwa Moja"}</span>
                <span className="text-xs text-gray-600">{language === "en" ? "Chat with support" : "Zungumza na msaada"}</span>
              </Button>

              <Button 
                variant="outline"
                className="h-auto py-4 flex-col gap-2 border-2 hover:border-[#2E7D32]"
                onClick={() => toast.success(language === "en" ? "Opening FAQ..." : "Inafungua FAQ...")}
              >
                <HelpCircle className="h-6 w-6 text-[#2E7D32]" />
                <span className="font-semibold">FAQ</span>
                <span className="text-xs text-gray-600">{language === "en" ? "Common questions" : "Maswali ya kawaida"}</span>
              </Button>

              <Button 
                variant="outline"
                className="h-auto py-4 flex-col gap-2 border-2 hover:border-[#2E7D32]"
                onClick={() => toast.success(language === "en" ? "Calling support..." : "Inapiga simu msaada...")}
              >
                <Phone className="h-6 w-6 text-[#2E7D32]" />
                <span className="font-semibold">{language === "en" ? "Call Us" : "Piga Simu"}</span>
                <span className="text-xs text-gray-600">+255 123 456 789</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-2 border-blue-100 bg-blue-50/50">
          <CardContent className="py-4">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1 text-sm">
                  {language === "en" ? "Learn at Your Own Pace" : "Jifunze kwa Kasi Yako"}
                </h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {language === "en"
                    ? "Access 50+ video tutorials and articles in English and Swahili. Learn modern farming techniques from expert agronomists and successful farmers."
                    : "Pata video 50+ za mafunzo na makala kwa Kiingereza na Kiswahili. Jifunze mbinu za kisasa za kilimo kutoka kwa wataalam wa kilimo na wakulima mafanikio."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

UnifiedLearningSupport.displayName = "UnifiedLearningSupport";