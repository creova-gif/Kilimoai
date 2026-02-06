import { useState } from "react";
import {
  GraduationCap, Play, CheckCircle, Lock, Clock, Award,
  BookOpen, Target, TrendingUp, Star, ChevronRight, Download,
  Calendar, Users, BarChart3, Trophy, Zap
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface TrainingCoursesProps {
  language: "en" | "sw";
  userId: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: "crop" | "livestock" | "finance" | "business" | "technology";
  level: "beginner" | "intermediate" | "advanced";
  lessons: number;
  duration: string;
  enrolled: number;
  rating: number;
  progress?: number;
  completed: boolean;
  hasCertificate: boolean;
  price: "free" | "premium";
}

export function TrainingCourses({ language, userId }: TrainingCoursesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const courses: Course[] = [
    {
      id: "course-001",
      title: language === "en" 
        ? "Complete Maize Farming Masterclass"
        : "Mafunzo Kamili ya Kilimo cha Mahindi",
      description: language === "en"
        ? "Master every aspect of maize farming from seed selection to harvest and storage."
        : "Jifunze kila kipengele cha kilimo cha mahindi kutoka uchaguzi wa mbegu hadi mavuno na uhifadhi.",
      instructor: "Dr. James Kimaro",
      category: "crop",
      level: "beginner",
      lessons: 24,
      duration: "8 hours",
      enrolled: 1234,
      rating: 4.8,
      progress: 45,
      completed: false,
      hasCertificate: true,
      price: "free"
    },
    {
      id: "course-002",
      title: language === "en"
        ? "Farm Business Management"
        : "Usimamizi wa Biashara ya Shamba",
      description: language === "en"
        ? "Learn to run your farm like a profitable business with proper record-keeping and financial planning."
        : "Jifunze kuendesha shamba lako kama biashara yenye faida na kuweka kumbukumbu na mipango ya fedha.",
      instructor: "Mama Grace Mushi",
      category: "business",
      level: "intermediate",
      lessons: 16,
      duration: "5 hours",
      enrolled: 876,
      rating: 4.9,
      completed: true,
      hasCertificate: true,
      price: "free"
    },
    {
      id: "course-003",
      title: language === "en"
        ? "Poultry Farming Essentials"
        : "Msingi wa Ufugaji wa Kuku",
      description: language === "en"
        ? "Start and manage a successful poultry farm with proper housing, feeding, and health management."
        : "Anza na usimamie shamba la kuku lenye mafanikio na makazi sahihi, ulishaji, na usimamizi wa afya.",
      instructor: "John Mollel",
      category: "livestock",
      level: "beginner",
      lessons: 18,
      duration: "6 hours",
      enrolled: 654,
      rating: 4.7,
      completed: false,
      hasCertificate: true,
      price: "premium"
    }
  ];

  const categories = [
    { id: "all", label: language === "en" ? "All" : "Zote", icon: GraduationCap, color: "gray" },
    { id: "crop", label: language === "en" ? "Crops" : "Mazao", icon: BookOpen, color: "green" },
    { id: "livestock", label: language === "en" ? "Livestock" : "Mifugo", icon: Award, color: "purple" },
    { id: "finance", label: language === "en" ? "Finance" : "Fedha", icon: TrendingUp, color: "blue" },
    { id: "business", label: language === "en" ? "Business" : "Biashara", icon: Target, color: "indigo" },
    { id: "technology", label: language === "en" ? "Technology" : "Teknolojia", icon: Zap, color: "orange" }
  ];

  const filteredCourses = courses.filter(c =>
    selectedCategory === "all" || c.category === selectedCategory
  );

  const inProgress = courses.filter(c => c.progress && c.progress > 0 && !c.completed);
  const completed = courses.filter(c => c.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/20 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-4 lg:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {language === "en" ? "Training Courses" : "Kozi za Mafunzo"}
              </h1>
              <p className="text-indigo-100 text-sm">
                {language === "en" 
                  ? "Structured learning paths with certificates"
                  : "Njia za kujifunza zilizopangwa na vyeti"}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">{inProgress.length}</div>
              <div className="text-xs text-indigo-100">{language === "en" ? "In Progress" : "Inaendelea"}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">{completed.length}</div>
              <div className="text-xs text-indigo-100">{language === "en" ? "Completed" : "Imekamilika"}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">{completed.length}</div>
              <div className="text-xs text-indigo-100">{language === "en" ? "Certificates" : "Vyeti"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 -mt-4">
        <div className="space-y-6">
          {/* Continue Learning */}
          {inProgress.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Play className="h-5 w-5 text-green-600" />
                {language === "en" ? "Continue Learning" : "Endelea Kujifunza"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inProgress.map((course) => (
                  <Card key={course.id} className="border-2 border-green-200 hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-green-100 rounded-xl">
                          <GraduationCap className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 mb-1">{course.title}</h3>
                          <p className="text-xs text-gray-600">{course.instructor}</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{course.progress}% {language === "en" ? "complete" : "imekamilika"}</span>
                          <span>{course.lessons} {language === "en" ? "lessons" : "masomo"}</span>
                        </div>
                        <Progress value={course.progress || 0} className="h-2" />
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <Play className="h-4 w-4 mr-2" />
                        {language === "en" ? "Continue" : "Endelea"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
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

          {/* All Courses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {language === "en" ? "All Courses" : "Kozi Zote"}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredCourses.map((course) => {
                const cat = categories.find(c => c.id === course.category);
                
                return (
                  <Card key={course.id} className="border-2 border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 bg-${cat?.color}-100 rounded-lg`}>
                          {cat && <cat.icon className={`h-5 w-5 text-${cat.color}-600`} />}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {course.price === "premium" && (
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200 border">
                              Premium
                            </Badge>
                          )}
                          {course.completed && (
                            <Badge className="bg-green-100 text-green-700 border-green-200 border">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {language === "en" ? "Completed" : "Imekamilika"}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          {course.rating}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.enrolled}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                        <span>{course.instructor}</span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {course.lessons} {language === "en" ? "lessons" : "masomo"}
                        </span>
                      </div>

                      {course.hasCertificate && (
                        <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                          <Trophy className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-medium text-blue-700">
                            {language === "en" ? "Certificate upon completion" : "Cheti baada ya kukamilisha"}
                          </span>
                        </div>
                      )}

                      {course.progress && course.progress > 0 && !course.completed && (
                        <div className="mb-4">
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      )}

                      <Button 
                        className={`w-full ${
                          course.completed 
                            ? "bg-green-600 hover:bg-green-700" 
                            : course.progress
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-gray-900 hover:bg-gray-800"
                        }`}
                      >
                        {course.completed ? (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            {language === "en" ? "Download Certificate" : "Pakua Cheti"}
                          </>
                        ) : course.progress ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            {language === "en" ? "Continue Course" : "Endelea na Kozi"}
                          </>
                        ) : (
                          <>
                            <ChevronRight className="h-4 w-4 mr-2" />
                            {language === "en" ? "Start Course" : "Anza Kozi"}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Achievements/Certificates */}
          {completed.length > 0 && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-600" />
                {language === "en" ? "Your Certificates" : "Vyeti Vyako"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {completed.map((course) => (
                  <div key={course.id} className="bg-white rounded-xl p-4 border-2 border-yellow-300">
                    <div className="text-center">
                      <div className="inline-flex p-3 bg-yellow-100 rounded-full mb-3">
                        <Award className="h-8 w-8 text-yellow-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mb-2">{course.title}</h4>
                      <Button size="sm" variant="outline" className="w-full border-2">
                        <Download className="h-3 w-3 mr-2" />
                        {language === "en" ? "Download" : "Pakua"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
