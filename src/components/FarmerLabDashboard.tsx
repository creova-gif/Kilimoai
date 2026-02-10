import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { 
  Users, 
  MessageSquare, 
  Star, 
  TrendingUp,
  Send,
  CheckCircle2,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Trophy,
  Target,
  Zap,
  Award,
  Flame,
  Vote,
  Play,
  FileText,
  Share2,
  AlertCircle,
  Sparkles,
  TrendingDown,
  ArrowRight,
  Eye,
  Heart,
  MessageCircle,
  Bell,
  Gift,
  Rocket
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";

interface FarmerLabDashboardProps {
  userId: string;
  userType: string;
  apiBase: string;
  authToken: string;
}

export function FarmerLabDashboard({ userId, userType, apiBase, authToken }: FarmerLabDashboardProps) {
  const [activePolls, setActivePolls] = useState<any[]>([]);
  const [featureVotes, setFeatureVotes] = useState<any[]>([]);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);
  
  // Form states
  const [newDiscussion, setNewDiscussion] = useState("");
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    loadLabData();
  }, []);

  const loadLabData = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with API calls
      setActivePolls([
        {
          id: "poll-1",
          question: "Which feature would you like to see next in KILIMO?",
          options: [
            { id: "opt-1", text: "Offline voice commands", votes: 45, percentage: 30 },
            { id: "opt-2", text: "Drone crop monitoring", votes: 68, percentage: 45 },
            { id: "opt-3", text: "Automated irrigation alerts", votes: 38, percentage: 25 }
          ],
          totalVotes: 151,
          endsAt: "2024-12-20",
          userVoted: false
        },
        {
          id: "poll-2",
          question: "How satisfied are you with the AI crop diagnosis feature?",
          options: [
            { id: "opt-4", text: "Very satisfied", votes: 82, percentage: 68 },
            { id: "opt-5", text: "Satisfied", votes: 28, percentage: 23 },
            { id: "opt-6", text: "Needs improvement", votes: 11, percentage: 9 }
          ],
          totalVotes: 121,
          endsAt: "2024-12-18",
          userVoted: true,
          userVote: "opt-4"
        }
      ]);

      setFeatureVotes([
        {
          id: "feat-1",
          title: "Integration with mobile money providers",
          description: "Direct payment from buyers through M-Pesa, AirtelMoney, TigoPesa",
          votes: 234,
          status: "in-progress",
          comments: 45,
          userVoted: true,
          category: "Financial",
          submittedBy: "John M.",
          daysAgo: 5
        },
        {
          id: "feat-2",
          title: "Multi-language voice support (Swahili dialects)",
          description: "Voice assistant that understands regional Swahili variations",
          votes: 189,
          status: "planned",
          comments: 32,
          userVoted: false,
          category: "AI",
          submittedBy: "Sarah K.",
          daysAgo: 3
        },
        {
          id: "feat-3",
          title: "Community marketplace for farm tools",
          description: "Rent or buy second-hand farming equipment from other farmers",
          votes: 156,
          status: "under-review",
          comments: 28,
          userVoted: false,
          category: "Marketplace",
          submittedBy: "David L.",
          daysAgo: 7
        }
      ]);

      setDiscussions([
        {
          id: "disc-1",
          title: "Best practices for maize storage during rainy season",
          author: "Amina Hassan",
          avatar: "AH",
          replies: 23,
          likes: 45,
          lastActive: "2 hours ago",
          isHot: true,
          tags: ["Maize", "Storage", "Season"]
        },
        {
          id: "disc-2",
          title: "Has anyone tried the new fertilizer recommendation AI?",
          author: "Joseph Mwamba",
          avatar: "JM",
          replies: 17,
          likes: 34,
          lastActive: "5 hours ago",
          isHot: false,
          tags: ["AI", "Fertilizer", "Tips"]
        },
        {
          id: "disc-3",
          title: "Looking for cooperative partners in Morogoro region",
          author: "Grace Kimaro",
          avatar: "GK",
          replies: 12,
          likes: 28,
          lastActive: "1 day ago",
          isHot: false,
          tags: ["Cooperative", "Morogoro", "Partnership"]
        }
      ]);

      setExperiments([
        {
          id: "exp-1",
          title: "Testing AI-powered irrigation scheduling",
          participants: 45,
          duration: "4 weeks",
          rewards: "500 points + Premium features",
          status: "active",
          progress: 65,
          spotsLeft: 5
        },
        {
          id: "exp-2",
          title: "Beta: Blockchain-based supply chain tracking",
          participants: 30,
          duration: "6 weeks",
          rewards: "1000 points + Cash bonus",
          status: "active",
          progress: 30,
          spotsLeft: 10
        },
        {
          id: "exp-3",
          title: "Early access: Weather prediction AI v2.0",
          participants: 20,
          duration: "3 weeks",
          rewards: "300 points + Exclusive badge",
          status: "starting-soon",
          progress: 0,
          spotsLeft: 30
        }
      ]);

      setLeaderboard([
        { rank: 1, name: "Amina Hassan", points: 2847, avatar: "AH", contributions: 156, badge: "🏆" },
        { rank: 2, name: "Joseph Mwamba", points: 2534, avatar: "JM", contributions: 142, badge: "🥈" },
        { rank: 3, name: "Grace Kimaro", points: 2210, avatar: "GK", contributions: 128, badge: "🥉" },
        { rank: 4, name: "John Massawe", points: 1890, avatar: "JM", contributions: 98, badge: "" },
        { rank: 5, name: "Sarah Kibwana", points: 1654, avatar: "SK", contributions: 87, badge: "" },
      ]);

      setUserStats({
        rank: 12,
        points: 845,
        contributions: 34,
        feedbackSubmitted: 8,
        pollsVoted: 15,
        experimentsJoined: 2,
        level: 4,
        nextLevelPoints: 1000
      });

    } catch (error) {
      console.error("Error loading farmer lab data:", error);
      toast.error("Failed to load some data");
    } finally {
      setLoading(false);
    }
  };

  const handleVotePoll = async (pollId: string, optionId: string) => {
    try {
      toast.success("Vote submitted!");
      loadLabData();
    } catch (error) {
      toast.error("Failed to submit vote");
    }
  };

  const handleVoteFeature = async (featureId: string) => {
    try {
      const updatedFeatures = featureVotes.map(f => 
        f.id === featureId 
          ? { ...f, votes: f.userVoted ? f.votes - 1 : f.votes + 1, userVoted: !f.userVoted }
          : f
      );
      setFeatureVotes(updatedFeatures);
      toast.success(updatedFeatures.find(f => f.id === featureId)?.userVoted ? "Vote added!" : "Vote removed!");
    } catch (error) {
      toast.error("Failed to vote");
    }
  };

  const handleSubmitDiscussion = async () => {
    if (!newDiscussion.trim()) {
      toast.error("Please enter a discussion topic");
      return;
    }
    try {
      toast.success("Discussion created!");
      setNewDiscussion("");
      loadLabData();
    } catch (error) {
      toast.error("Failed to create discussion");
    }
  };

  const handleJoinExperiment = async (experimentId: string) => {
    try {
      toast.success("Successfully joined experiment!");
      loadLabData();
    } catch (error) {
      toast.error("Failed to join experiment");
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    try {
      toast.success("Feedback submitted! +50 points earned 🎉");
      setFeedbackText("");
      loadLabData();
    } catch (error) {
      toast.error("Failed to submit feedback");
    }
  };

  if (loading && !userStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Farmer Lab...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white p-8"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <Sparkles className="h-64 w-64 -mt-16 -mr-16" />
        </div>
        
        <div className="relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Rocket className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">KILIMO Farmer Lab</h1>
                  <p className="text-green-100 text-sm">Shape the future of farming technology</p>
                </div>
              </div>
              <p className="text-green-100 max-w-2xl">
                Join 200+ pilot farmers testing new features, voting on improvements, and earning rewards for your contributions to the platform.
              </p>
            </div>

            {userStats && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 min-w-[250px]">
                <div className="text-center">
                  <p className="text-sm opacity-90 mb-2">Your Lab Rank</p>
                  <p className="text-5xl font-bold mb-1">#{userStats.rank}</p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Trophy className="h-4 w-4" />
                    <span>{userStats.points} points</span>
                  </div>
                  <Separator className="my-4 bg-white/20" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="opacity-90">Level {userStats.level}</span>
                      <span className="font-semibold">{userStats.points}/{userStats.nextLevelPoints}</span>
                    </div>
                    <Progress value={(userStats.points / userStats.nextLevelPoints) * 100} className="h-2" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      {userStats && (
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Contributions", value: userStats.contributions, icon: MessageSquare, color: "text-green-600", bg: "bg-green-100" },
            { label: "Feedback Given", value: userStats.feedbackSubmitted, icon: FileText, color: "text-green-600", bg: "bg-green-100" },
            { label: "Polls Voted", value: userStats.pollsVoted, icon: Vote, color: "text-green-600", bg: "bg-green-100" },
            { label: "Experiments", value: userStats.experimentsJoined, icon: Zap, color: "text-orange-600", bg: "bg-orange-100" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-2 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 ${stat.bg} rounded-xl`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Tabs defaultValue="polls" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="polls">Polls</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="experiments">Beta Tests</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Active Polls */}
        <TabsContent value="polls" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Active Polls</h3>
              <p className="text-gray-600">Vote on important platform decisions</p>
            </div>
            <Badge variant="outline" className="text-sm">
              <Bell className="h-3 w-3 mr-1" />
              {activePolls.filter(p => !p.userVoted).length} new
            </Badge>
          </div>

          <div className="space-y-4">
            {activePolls.map((poll, index) => (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-2 ${poll.userVoted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{poll.question}</CardTitle>
                        <CardDescription className="mt-2 flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {poll.totalVotes} votes
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Ends {poll.endsAt}
                          </span>
                        </CardDescription>
                      </div>
                      {poll.userVoted && (
                        <Badge className="bg-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Voted
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {poll.options.map((option: any) => (
                      <div key={option.id}>
                        <button
                          onClick={() => !poll.userVoted && handleVotePoll(poll.id, option.id)}
                          disabled={poll.userVoted}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            poll.userVote === option.id
                              ? 'border-green-500 bg-green-50'
                              : poll.userVoted
                              ? 'border-gray-200 cursor-not-allowed opacity-60'
                              : 'border-gray-200 hover:border-green-400 hover:bg-green-50 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{option.text}</span>
                            <span className="text-sm font-semibold">{option.percentage}%</span>
                          </div>
                          <Progress value={option.percentage} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">{option.votes} votes</p>
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Feature Voting */}
        <TabsContent value="features" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Feature Requests</h3>
              <p className="text-gray-600">Vote for features you want to see</p>
            </div>
            <Button>
              <Lightbulb className="h-4 w-4 mr-2" />
              Submit Idea
            </Button>
          </div>

          <div className="space-y-4">
            {featureVotes.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Vote Button */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleVoteFeature(feature.id)}
                          className={`p-3 rounded-xl transition-all ${
                            feature.userVoted
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                          }`}
                        >
                          <ThumbsUp className="h-6 w-6" />
                        </button>
                        <span className="text-xl font-bold mt-2">{feature.votes}</span>
                        <span className="text-xs text-gray-500">votes</span>
                      </div>

                      {/* Feature Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{feature.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                          </div>
                          <Badge variant={
                            feature.status === 'in-progress' ? 'default' :
                            feature.status === 'planned' ? 'secondary' :
                            'outline'
                          }>
                            {feature.status === 'in-progress' ? '🚀 In Progress' :
                             feature.status === 'planned' ? '📋 Planned' :
                             '👀 Under Review'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <Badge variant="outline" className="font-normal">
                            {feature.category}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {feature.comments} comments
                          </span>
                          <span>By {feature.submittedBy}</span>
                          <span>{feature.daysAgo} days ago</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Discussions */}
        <TabsContent value="discussions" className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold mb-2">Community Discussions</h3>
            <p className="text-gray-600 mb-4">Share experiences and learn from other farmers</p>

            {/* New Discussion */}
            <Card className="border-2 border-dashed">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="Start a new discussion..."
                    value={newDiscussion}
                    onChange={(e) => setNewDiscussion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitDiscussion()}
                  />
                  <Button onClick={handleSubmitDiscussion}>
                    <Send className="h-4 w-4 mr-2" />
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            {discussions.map((discussion, index) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {discussion.avatar}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-lg flex items-center gap-2">
                              {discussion.title}
                              {discussion.isHot && (
                                <Badge variant="destructive" className="text-xs">
                                  <Flame className="h-3 w-3 mr-1" />
                                  Hot
                                </Badge>
                              )}
                            </h4>
                            <p className="text-sm text-gray-600">by {discussion.author}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {discussion.replies} replies
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {discussion.likes} likes
                          </span>
                          <span>{discussion.lastActive}</span>
                        </div>
                        <div className="flex gap-2">
                          {discussion.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Beta Experiments */}
        <TabsContent value="experiments" className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold">Beta Testing Programs</h3>
            <p className="text-gray-600">Join experiments and earn exclusive rewards</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {experiments.map((experiment, index) => (
              <motion.div
                key={experiment.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 hover:shadow-xl transition-all h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">{experiment.title}</CardTitle>
                      <Badge variant={experiment.status === 'active' ? 'default' : 'secondary'}>
                        {experiment.status === 'active' ? 'Active' : 'Starting Soon'}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{experiment.participants} participants</span>
                        <span className="text-green-600 font-semibold">• {experiment.spotsLeft} spots left</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{experiment.duration} duration</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {experiment.status === 'active' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold">{experiment.progress}%</span>
                        </div>
                        <Progress value={experiment.progress} className="h-2" />
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Gift className="h-5 w-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">{experiment.rewards}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => handleJoinExperiment(experiment.id)}
                      disabled={experiment.spotsLeft === 0}
                    >
                      {experiment.spotsLeft === 0 ? 'Full' : 'Join Experiment'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Feedback Section */}
          <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                Quick Feedback
              </CardTitle>
              <CardDescription>
                Share your thoughts on KILIMO and earn 50 points instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="What features do you love? What can we improve?"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={3}
              />
              <Button onClick={handleSubmitFeedback} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback (+50 points)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold">Top Contributors</h3>
            <p className="text-gray-600">Farmers making the biggest impact on the platform</p>
          </div>

          <div className="space-y-2">
            {leaderboard.map((user, index) => (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-2 ${user.rank <= 3 ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50' : 'border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold w-8 text-center">
                        {user.badge || `#${user.rank}`}
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user.avatar}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.contributions} contributions</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{user.points}</p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {userStats && userStats.rank > 5 && (
            <Card className="border-2 border-gray-200 bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-xl font-bold w-8 text-center">
                    #{userStats.rank}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    YOU
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">Your Ranking</h4>
                    <p className="text-sm text-gray-600">{userStats.contributions} contributions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{userStats.points}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}