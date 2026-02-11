import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { 
  Trophy, 
  Award, 
  Star, 
  Target,
  TrendingUp,
  CheckCircle2,
  Lock,
  Sparkles,
  Crown,
  Zap,
  Gift,
  Medal,
  Flame,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  rewardPoints?: number;
  category?: "crop" | "market" | "learning" | "social" | "milestone";
}

interface GamificationPanelProps {
  userId: string;
  language: "en" | "sw";
}

export function GamificationPanel({ userId, language }: GamificationPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedAchievement, setExpandedAchievement] = useState<string | null>(null);

  // Mock data - would come from backend in production
  const achievements: Achievement[] = [
    {
      id: "ach-001",
      title: language === "en" ? "First Harvest" : "Mavuno ya Kwanza",
      description: language === "en" ? "Complete your first harvest" : "Kamilisha mavuno yako ya kwanza",
      icon: "🌾",
      unlocked: true,
      rewardPoints: 100,
      category: "crop"
    },
    {
      id: "ach-002",
      title: language === "en" ? "Market Explorer" : "Mtafiti wa Soko",
      description: language === "en" ? "Check market prices 10 times" : "Angalia bei za soko mara 10",
      icon: "📊",
      unlocked: true,
      progress: 100,
      rewardPoints: 50,
      category: "market"
    },
    {
      id: "ach-003",
      title: language === "en" ? "Knowledge Seeker" : "Mtafiti wa Ujuzi",
      description: language === "en" ? "Complete 5 tutorials" : "Kamilisha mafunzo 5",
      icon: "📚",
      unlocked: false,
      progress: 60,
      rewardPoints: 75,
      category: "learning"
    },
    {
      id: "ach-004",
      title: language === "en" ? "Community Helper" : "Msaidizi wa Jamii",
      description: language === "en" ? "Help 3 other farmers" : "Saidia wakulima wengine 3",
      icon: "🤝",
      unlocked: false,
      progress: 33,
      rewardPoints: 150,
      category: "social"
    },
    {
      id: "ach-005",
      title: language === "en" ? "Master Farmer" : "Mkulima Bingwa",
      description: language === "en" ? "Reach level 10" : "Fika kiwango cha 10",
      icon: "👑",
      unlocked: false,
      rewardPoints: 500,
      category: "milestone"
    }
  ];

  const currentLevel = 3;
  const totalPoints = 2450;
  const cropProgress = {
    cropName: language === "en" ? "Maize" : "Mahindi",
    stage: language === "en" ? "Flowering" : "Maua",
    progress: 65,
    nextMilestone: language === "en" ? "Harvest in 30 days" : "Mavuno baada ya siku 30"
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const progressAchievements = achievements.filter(a => !a.unlocked && a.progress);
  const lockedAchievements = achievements.filter(a => !a.unlocked && !a.progress);

  // Calculate next level
  const pointsForNextLevel = currentLevel * 1000;
  const pointsToNextLevel = pointsForNextLevel - (totalPoints % pointsForNextLevel);
  const levelProgress = ((totalPoints % pointsForNextLevel) / pointsForNextLevel) * 100;

  // Categories
  const categories = [
    { id: "all", label: "All", icon: Sparkles, color: "text-[#2E7D32]" },
    { id: "crop", label: "Farming", icon: Target, color: "text-[#2E7D32]" },
    { id: "market", label: "Trading", icon: TrendingUp, color: "text-[#2E7D32]" },
    { id: "learning", label: "Learning", icon: Award, color: "text-orange-600" },
    { id: "social", label: "Community", icon: Star, color: "text-gray-600" },
    { id: "milestone", label: "Milestones", icon: Trophy, color: "text-yellow-600" },
  ];

  const filteredAchievements = selectedCategory === "all" 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "crop": return Target;
      case "market": return TrendingUp;
      case "learning": return Award;
      case "social": return Star;
      case "milestone": return Trophy;
      default: return Medal;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "crop": return { bg: "bg-[#2E7D32]/5", border: "border-[#2E7D32]/30", text: "text-[#1B5E20]", icon: "text-[#2E7D32]" };
      case "market": return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", icon: "text-gray-600" };
      case "learning": return { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: "text-orange-600" };
      case "social": return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", icon: "text-gray-600" };
      case "milestone": return { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", icon: "text-yellow-600" };
      default: return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", icon: "text-gray-600" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Stats Section */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-[#2E7D32] via-[#2E7D32] to-[#1B5E20] border-0 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-10">
              <Crown className="h-32 w-32 -mt-8 -mr-8" />
            </div>
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-4 mb-4">
                <motion.div 
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <Trophy className="h-8 w-8" />
                </motion.div>
                <div>
                  <p className="text-sm text-white/80">Your Level</p>
                  <h2 className="text-4xl font-bold">Level {currentLevel}</h2>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Progress to Level {currentLevel + 1}</span>
                  <span className="font-medium">{Math.round(levelProgress)}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-white/70">{pointsToNextLevel} points to go</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Points Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 border-0 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-10">
              <Flame className="h-32 w-32 -mt-8 -mr-8" />
            </div>
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-4 mb-4">
                <motion.div 
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30"
                  whileHover={{ scale: 1.1 }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Star className="h-8 w-8" />
                </motion.div>
                <div>
                  <p className="text-sm text-white/80">Total Points</p>
                  <h2 className="text-4xl font-bold">{totalPoints.toLocaleString()}</h2>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">+{Math.floor(totalPoints * 0.1)} points this week</span>
                </div>
                <p className="text-xs text-white/70 opacity-0 pointer-events-none">Spacing adjustment</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 border-0 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-10">
              <Gift className="h-32 w-32 -mt-8 -mr-8" />
            </div>
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-4 mb-4">
                <motion.div 
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30"
                  whileHover={{ scale: 1.1 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Award className="h-8 w-8" />
                </motion.div>
                <div>
                  <p className="text-sm text-white/80">Achievements</p>
                  <h2 className="text-4xl font-bold">{unlockedAchievements.length}/{achievements.length}</h2>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">{progressAchievements.length} in progress</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Crop Progress Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              Crop Growth Progress - {cropProgress.cropName}
            </CardTitle>
            <CardDescription>Track your farming journey milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-medium text-gray-900">Current Stage: <span className="text-green-600">{cropProgress.stage}</span></span>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  {cropProgress.progress}% Complete
                </Badge>
              </div>
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${cropProgress.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
              <div className="p-2 bg-gray-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Next Milestone</p>
                <p className="text-sm text-gray-700 mt-1">{cropProgress.nextMilestone}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 mt-1" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          return (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
                isActive 
                  ? "bg-gradient-to-r from-green-50 to-blue-50 border-green-300 shadow-md" 
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-green-600" : "text-gray-500"}`} />
              <span className={`text-sm font-medium ${isActive ? "text-green-700" : "text-gray-600"}`}>
                {category.label}
              </span>
              {category.id === "all" && (
                <Badge variant="secondary" className="ml-1">
                  {achievements.length}
                </Badge>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Achievements Grid */}
      <div className="space-y-4">
        {/* Unlocked Achievements */}
        {filteredAchievements.filter(a => a.unlocked).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Unlocked ({filteredAchievements.filter(a => a.unlocked).length})
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              <AnimatePresence>
                {filteredAchievements.filter(a => a.unlocked).map((achievement, index) => {
                  const Icon = getCategoryIcon(achievement.category);
                  const colors = getCategoryColor(achievement.category);
                  const isExpanded = expandedAchievement === achievement.id;
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`${colors.bg} border-2 ${colors.border} cursor-pointer overflow-hidden group hover:shadow-lg transition-all`}
                        onClick={() => setExpandedAchievement(isExpanded ? null : achievement.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <motion.div 
                              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md flex-shrink-0`}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <Icon className={`h-6 w-6 ${colors.icon}`} />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className={`font-semibold ${colors.text}`}>{achievement.title}</h4>
                                <Badge className="bg-white/80 text-green-700 border-green-300 flex-shrink-0">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Done
                                </Badge>
                              </div>
                              <p className={`text-sm ${colors.text} opacity-80`}>{achievement.description}</p>
                              {achievement.rewardPoints && (
                                <div className="flex items-center gap-1 mt-2">
                                  <Zap className={`h-4 w-4 ${colors.icon}`} />
                                  <span className={`text-xs font-medium ${colors.text}`}>
                                    +{achievement.rewardPoints} points earned
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* In Progress Achievements */}
        {filteredAchievements.filter(a => !a.unlocked && a.progress).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-600" />
              In Progress ({filteredAchievements.filter(a => !a.unlocked && a.progress).length})
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              <AnimatePresence>
                {filteredAchievements.filter(a => !a.unlocked && a.progress).map((achievement, index) => {
                  const Icon = getCategoryIcon(achievement.category);
                  const colors = getCategoryColor(achievement.category);
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="border-2 hover:shadow-lg transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} flex-shrink-0`}>
                              <Icon className={`h-6 w-6 ${colors.icon}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                                <Badge variant="outline" className="text-orange-700 border-orange-300">
                                  {achievement.progress}%
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                              {achievement.progress !== undefined && (
                                <div className="space-y-1">
                                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div 
                                      className={`h-full bg-gradient-to-r ${colors.bg.replace('50', '500')} ${colors.bg.replace('50', '600')}`}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${achievement.progress}%` }}
                                      transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                  </div>
                                  {achievement.rewardPoints && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500">Keep going!</span>
                                      <span className="text-xs font-medium text-gray-700">
                                        +{achievement.rewardPoints} points
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {filteredAchievements.filter(a => !a.unlocked && !a.progress).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Lock className="h-5 w-5 text-gray-400" />
              Locked ({filteredAchievements.filter(a => !a.unlocked && !a.progress).length})
            </h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredAchievements.filter(a => !a.unlocked && !a.progress).map((achievement, index) => {
                  const Icon = getCategoryIcon(achievement.category);
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all opacity-60">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200 flex-shrink-0">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-500 mb-1">{achievement.title}</h4>
                              <p className="text-xs text-gray-400">{achievement.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}