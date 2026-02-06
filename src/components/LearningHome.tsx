import { useState } from "react";
import {
  BookOpen, Play, FileText, Sprout, Trophy, TrendingUp,
  ChevronRight, Clock, CheckCircle, Star, Award, Target,
  Leaf, Beaker, Users, GraduationCap, ArrowRight, Search,
  Filter, Calendar, Activity, Zap, MessageCircle, Video
} from "lucide-react";

interface LearningHomeProps {
  userId: string;
  language: "en" | "sw";
  onNavigate?: (tab: string) => void;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: "crop" | "livestock" | "finance" | "tools" | "market";
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  progress?: number;
  lessons: number;
  completed: boolean;
  icon: any;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  modules: number;
  totalLessons: number;
  estimatedHours: number;
  completed: number;
  icon: any;
  color: string;
}

export function LearningHome({ userId, language, onNavigate }: LearningHomeProps) {
  const [activeLevel, setActiveLevel] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Learning paths
  const learningPaths: LearningPath[] = [
    {
      id: "path-1",
      name: language === "en" ? "Maize Farming Mastery" : "Ujuzi wa Kilimo cha Mahindi",
      description: language === "en" 
        ? "Complete guide from seed selection to harvest"
        : "Mwongozo kamili kutoka uchaguzi wa mbegu hadi mavuno",
      modules: 6,
      totalLessons: 24,
      estimatedHours: 8,
      completed: 3,
      icon: Sprout,
      color: "green"
    },
    {
      id: "path-2",
      name: language === "en" ? "Smart Financial Management" : "Usimamizi Bora wa Fedha",
      description: language === "en"
        ? "Learn budgeting, record-keeping, and profit tracking"
        : "Jifunze bajeti, kuweka kumbukumbu, na kufuatilia faida",
      modules: 4,
      totalLessons: 16,
      estimatedHours: 5,
      completed: 0,
      icon: TrendingUp,
      color: "blue"
    },
    {
      id: "path-3",
      name: language === "en" ? "Livestock Health Basics" : "Msingi wa Afya ya Mifugo",
      description: language === "en"
        ? "Keep your animals healthy and productive"
        : "Weka wanyama wako wenye afya na wazalishaji",
      modules: 5,
      totalLessons: 20,
      estimatedHours: 6,
      completed: 1,
      icon: Activity,
      color: "purple"
    }
  ];

  // Continue learning (in-progress modules)
  const continueModules: LearningModule[] = [
    {
      id: "mod-1",
      title: language === "en" ? "Soil Preparation for Maize" : "Maandalizi ya Udongo kwa Mahindi",
      description: language === "en" 
        ? "Learn proper land preparation techniques"
        : "Jifunze mbinu sahihi za kuandaa ardhi",
      category: "crop",
      level: "beginner",
      duration: "15 min",
      progress: 65,
      lessons: 4,
      completed: false,
      icon: Leaf
    },
    {
      id: "mod-2",
      title: language === "en" ? "Understanding Market Prices" : "Kuelewa Bei za Soko",
      description: language === "en"
        ? "How to read and use market price information"
        : "Jinsi ya kusoma na kutumia taarifa za bei za soko",
      category: "market",
      level: "beginner",
      duration: "12 min",
      progress: 40,
      lessons: 3,
      completed: false,
      icon: TrendingUp
    }
  ];

  // Featured modules
  const featuredModules: LearningModule[] = [
    {
      id: "feat-1",
      title: language === "en" ? "Pest Control Methods" : "Njia za Kudhibiti Wadudu",
      description: language === "en"
        ? "Organic and chemical pest management"
        : "Usimamizi wa wadudu wa kikaboni na kemikali",
      category: "crop",
      level: "intermediate",
      duration: "20 min",
      lessons: 5,
      completed: false,
      icon: Beaker
    },
    {
      id: "feat-2",
      title: language === "en" ? "Water Management" : "Usimamizi wa Maji",
      description: language === "en"
        ? "Efficient irrigation and water conservation"
        : "Umwagiliaji wa ufanisi na uhifadhi wa maji",
      category: "tools",
      level: "intermediate",
      duration: "18 min",
      lessons: 4,
      completed: false,
      icon: Activity
    },
    {
      id: "feat-3",
      title: language === "en" ? "Contract Farming Basics" : "Msingi wa Ukulima wa Mikataba",
      description: language === "en"
        ? "Understanding farming contracts and agreements"
        : "Kuelewa mikataba na makubaliano ya kilimo",
      category: "finance",
      level: "beginner",
      duration: "25 min",
      lessons: 6,
      completed: false,
      icon: FileText
    }
  ];

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
      case "beginner": return "bg-green-100 text-green-700 border-green-200";
      case "intermediate": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "advanced": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/20 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white px-4 lg:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {language === "en" ? "Learning Center" : "Kituo cha Kujifunza"}
              </h1>
              <p className="text-green-100 text-sm">
                {language === "en" 
                  ? "Build your farming knowledge, step by step"
                  : "Jenga ujuzi wako wa kilimo, hatua kwa hatua"}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-green-100">
                {language === "en" ? "Completed" : "Imekamilika"}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-green-100">
                {language === "en" ? "In Progress" : "Inaendelea"}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">28h</div>
              <div className="text-xs text-green-100">
                {language === "en" ? "Learning Time" : "Muda wa Kujifunza"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 -mt-4">
        <div className="space-y-6">
          {/* Continue Learning */}
          {continueModules.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Play className="h-5 w-5 text-green-600" />
                  {language === "en" ? "Continue Learning" : "Endelea Kujifunza"}
                </h2>
                <button className="text-sm text-green-600 font-medium hover:text-green-700">
                  {language === "en" ? "View All" : "Ona Zote"}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {continueModules.map((module) => (
                  <div key={module.id} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-green-300 transition-all cursor-pointer group">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 bg-${getCategoryColor(module.category)}-100 rounded-lg`}>
                        <module.icon className={`h-5 w-5 text-${getCategoryColor(module.category)}-600`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{module.title}</h3>
                        <p className="text-xs text-gray-600">{module.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{module.progress}% {language === "en" ? "complete" : "imekamilika"}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {module.duration}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                      <button className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                        <Play className="h-4 w-4" />
                        {language === "en" ? "Continue" : "Endelea"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Paths */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                {language === "en" ? "Learning Paths" : "Njia za Kujifunza"}
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              {language === "en"
                ? "Follow structured paths to master specific farming topics"
                : "Fuata njia zilizopangwa kujifunza mada maalum za kilimo"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {learningPaths.map((path) => {
                const PathIcon = path.icon;
                const progressPercent = (path.completed / path.modules) * 100;
                
                return (
                  <div key={path.id} className={`bg-gradient-to-br from-${path.color}-50 to-${path.color}-100 rounded-xl p-5 border-2 border-${path.color}-200 hover:shadow-lg transition-all cursor-pointer`}>
                    <div className={`p-3 bg-${path.color}-500 rounded-xl inline-flex mb-3`}>
                      <PathIcon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{path.name}</h3>
                    <p className="text-xs text-gray-600 mb-4">{path.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{path.modules} {language === "en" ? "modules" : "moduli"}</span>
                        <span>{path.estimatedHours}h</span>
                      </div>
                      <div className="h-2 bg-white rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r from-${path.color}-500 to-${path.color}-600`}
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600">
                        {path.completed}/{path.modules} {language === "en" ? "completed" : "imekamilika"}
                      </div>
                      <button className={`w-full mt-2 px-4 py-2 bg-${path.color}-600 text-white rounded-lg hover:bg-${path.color}-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium`}>
                        {progressPercent > 0 ? (
                          <>
                            <Play className="h-4 w-4" />
                            {language === "en" ? "Continue Path" : "Endelea Njia"}
                          </>
                        ) : (
                          <>
                            <ArrowRight className="h-4 w-4" />
                            {language === "en" ? "Start Path" : "Anza Njia"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Modules */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                {language === "en" ? "Featured Lessons" : "Masomo Maalum"}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveLevel("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeLevel === "all"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {language === "en" ? "All" : "Zote"}
                </button>
                <button
                  onClick={() => setActiveLevel("beginner")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeLevel === "beginner"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {language === "en" ? "Beginner" : "Anzia"}
                </button>
                <button
                  onClick={() => setActiveLevel("intermediate")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeLevel === "intermediate"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {language === "en" ? "Intermediate" : "Wastani"}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredModules
                .filter(m => activeLevel === "all" || m.level === activeLevel)
                .map((module) => {
                  const ModuleIcon = module.icon;
                  return (
                    <div key={module.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 bg-${getCategoryColor(module.category)}-100 rounded-lg`}>
                          <ModuleIcon className={`h-5 w-5 text-${getCategoryColor(module.category)}-600`} />
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getLevelBadge(module.level)}`}>
                          {language === "en" ? module.level : module.level === "beginner" ? "Anzia" : module.level === "intermediate" ? "Wastani" : "Juu"}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{module.title}</h3>
                      <p className="text-xs text-gray-600 mb-4">{module.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {module.lessons} {language === "en" ? "lessons" : "masomo"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {module.duration}
                        </span>
                      </div>
                      <button className="w-full px-4 py-2 bg-white border-2 border-gray-200 group-hover:border-green-500 group-hover:bg-green-50 text-gray-700 group-hover:text-green-700 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-medium">
                        <Play className="h-4 w-4" />
                        {language === "en" ? "Start Learning" : "Anza Kujifunza"}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Quick Links to All Subpages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {language === "en" ? "Explore More" : "Chunguza Zaidi"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { icon: Video, label: language === "en" ? "Video Tutorials" : "Mafunzo ya Video", tab: "videos", color: "red" },
                { icon: BookOpen, label: language === "en" ? "Knowledge Base" : "Hifadhi ya Ujuzi", tab: "knowledge", color: "blue" },
                { icon: Sprout, label: language === "en" ? "Crop Tips" : "Vidokezo vya Mazao", tab: "crop-tips", color: "green" },
                { icon: Beaker, label: language === "en" ? "Farmer Lab" : "Maabara ya Mkulima", tab: "farmer-lab", color: "purple" },
                { icon: Trophy, label: language === "en" ? "Achievements" : "Mafanikio", tab: "gamification", color: "yellow" },
                { icon: Users, label: language === "en" ? "Community" : "Jamii", tab: "discussions", color: "indigo" }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigate && onNavigate(item.tab)}
                  className={`flex items-center gap-3 p-4 bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 hover:from-${item.color}-100 hover:to-${item.color}-200 rounded-xl border-2 border-${item.color}-200 transition-all group`}
                >
                  <item.icon className={`h-5 w-5 text-${item.color}-600`} />
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <ChevronRight className={`h-4 w-4 text-${item.color}-400 ml-auto group-hover:translate-x-1 transition-transform`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
