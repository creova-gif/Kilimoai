import { useState } from "react";
import { 
  X, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Leaf,
  Award,
  Settings,
  Edit2,
  Save,
  Crown,
  Zap,
  TrendingUp,
  CheckCircle,
  Calendar,
  Target,
  Sprout,
  BarChart3,
  Shield,
  Bell,
  Globe,
  Lock,
  Trash2,
  ChevronRight,
  Star,
  Flame,
  Trophy,
  Activity,
  Camera,
  MessageCircle,
  Share2,
  Download,
  AlertTriangle
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

interface ProfileProps {
  user: {
    id: string;
    name: string;
    phone: string;
    region: string;
    farmSize: string;
    crops?: string[];
    userType?: string;
    tier?: string;
    role?: string;
  };
  onClose: () => void;
  onUpdate: (user: any) => void;
}

export function Profile({ user, onClose, onUpdate }: ProfileProps) {
  const [editing, setEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "stats" | "id" | "achievements" | "settings">("profile");
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
    region: user.region,
    farmSize: user.farmSize
  });

  const handleSave = () => {
    onUpdate({ ...user, ...formData });
    setEditing(false);
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case "premium": return "from-purple-500 to-pink-500";
      case "basic": return "from-blue-500 to-cyan-500";
      default: return "from-gray-500 to-slate-500";
    }
  };

  const getTierBadge = (tier?: string) => {
    switch (tier) {
      case "premium": return "bg-gradient-to-r from-gray-100 to-gray-100 text-gray-700 border-gray-200";
      case "basic": return "bg-gradient-to-r from-gray-100 to-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTierIcon = (tier?: string) => {
    switch (tier) {
      case "premium": return Crown;
      case "basic": return Star;
      default: return User;
    }
  };

  // Mock data for stats
  const stats = {
    level: 5,
    points: 2450,
    nextLevelPoints: 3000,
    aiQueries: { used: 12, total: 20 },
    tasksCompleted: 28,
    consultations: 3,
    achievements: 8,
    streak: 7,
    joinDate: "Jan 2026"
  };

  const levelProgress = (stats.points / stats.nextLevelPoints) * 100;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Clean Header - No decoration */}
      <div className="border-b border-gray-200">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-base font-semibold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Tabs - Simple and flat */}
        <div className="flex border-t border-gray-100">
          <button
            onClick={() => setActiveSection("profile")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeSection === "profile"
                ? "border-[#2E7D32] text-gray-900"
                : "border-transparent text-gray-500"
            }`}
          >
            Info
          </button>
          <button
            onClick={() => setActiveSection("stats")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeSection === "stats"
                ? "border-[#2E7D32] text-gray-900"
                : "border-transparent text-gray-500"
            }`}
          >
            Stats
          </button>
          <button
            onClick={() => setActiveSection("settings")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeSection === "settings"
                ? "border-[#2E7D32] text-gray-900"
                : "border-transparent text-gray-500"
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="flex-1 overflow-y-auto p-4 -mt-1">
        {/* PROFILE SECTION */}
        {activeSection === "profile" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Edit Toggle */}
            <div className="flex justify-end">
              {!editing ? (
                <Button
                  onClick={() => setEditing(true)}
                  size="sm"
                  className="gap-2 bg-white shadow-sm"
                  variant="outline"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: user.name,
                        phone: user.phone,
                        region: user.region,
                        farmSize: user.farmSize
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Personal Information */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Full Name</Label>
                  {editing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-gray-300"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{user.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Phone Number</Label>
                  {editing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="border-gray-300"
                      placeholder="+255 XXX XXX XXX"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{user.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Region</Label>
                  {editing ? (
                    <Input
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="border-gray-300"
                      placeholder="e.g., Arusha"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{user.region}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Farm Size</Label>
                  {editing ? (
                    <Input
                      value={formData.farmSize}
                      onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                      className="border-gray-300"
                      placeholder="e.g., 5 acres"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Target className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{user.farmSize}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Farm Details */}
            {user.crops && user.crops.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Leaf className="h-4 w-4 text-green-600" />
                    </div>
                    My Crops & Livestock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.crops.map((crop, idx) => (
                      <div key={idx} className="px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Sprout className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-700">{crop}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-gray-50 to-gray-50 hover:from-gray-100 hover:to-gray-100 rounded-xl transition-all border-2 border-gray-200">
                  <Share2 className="h-6 w-6 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Share Profile</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-gray-50 to-gray-50 hover:from-gray-100 hover:to-gray-100 rounded-xl transition-all border-2 border-gray-200">
                  <Download className="h-6 w-6 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Export Data</span>
                </button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* STATS SECTION */}
        {activeSection === "stats" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Level Progress */}
            <Card className="shadow-sm border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Your Level</p>
                    <h3 className="text-3xl font-bold text-gray-900">Level {stats.level}</h3>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-gray-500 to-gray-500 rounded-2xl shadow-lg">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress to Level {stats.level + 1}</span>
                    <span className="font-bold text-gray-900">{stats.points} / {stats.nextLevelPoints}</span>
                  </div>
                  <Progress value={levelProgress} className="h-3" />
                  <p className="text-xs text-gray-500 text-center">{stats.nextLevelPoints - stats.points} points to go</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-yellow-100 rounded-full mb-3">
                      <Zap className="h-6 w-6 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.aiQueries.used}/{stats.aiQueries.total}</p>
                    <p className="text-xs text-gray-600 mt-1">AI Queries</p>
                    <Progress value={(stats.aiQueries.used / stats.aiQueries.total) * 100} className="w-full h-1.5 mt-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-green-100 rounded-full mb-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.tasksCompleted}</p>
                    <p className="text-xs text-gray-600 mt-1">Tasks Done</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">+12 this week</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-gray-100 rounded-full mb-3">
                      <MessageCircle className="h-6 w-6 text-gray-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.consultations}</p>
                    <p className="text-xs text-gray-600 mt-1">Consultations</p>
                    <Badge variant="secondary" className="mt-2 text-xs">Expert Access</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-gray-100 rounded-full mb-3">
                      <Award className="h-6 w-6 text-gray-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.achievements}</p>
                    <p className="text-xs text-gray-600 mt-1">Achievements</p>
                    <Badge variant="secondary" className="mt-2 text-xs">View All</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity Streak */}
            <Card className="shadow-sm border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg">
                    <Flame className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">{stats.streak} Days</h3>
                    <p className="text-sm text-gray-600">Activity Streak 🔥</p>
                    <p className="text-xs text-orange-600 font-medium mt-1">Keep it up! You're on fire!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Membership */}
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Calendar className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-bold text-gray-900">{stats.joinDate}</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                    Verified
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade CTA */}
            {user.tier === "free" && (
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 via-green-500 to-green-500 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
                <CardContent className="p-6 text-center relative">
                  <div className="inline-flex p-4 bg-white/20 backdrop-blur-sm rounded-3xl mb-4">
                    <Crown className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-white mb-2">Unlock Premium Features</h3>
                  <p className="text-white/90 text-sm mb-4">
                    Get unlimited AI queries, priority support, and advanced analytics
                  </p>
                  <ul className="text-left space-y-2 mb-6 text-sm text-white/90">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Unlimited AI-powered recommendations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Access to expert consultations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Advanced crop planning & analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Priority customer support</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-white text-green-600 hover:bg-gray-100 font-bold shadow-lg">
                    Upgrade to Premium
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* SETTINGS SECTION */}
        {activeSection === "settings" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Preferences */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Settings className="h-4 w-4 text-gray-600" />
                  </div>
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-xl transition-all group">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Change Language</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-xl transition-all group">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Notifications</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-xl transition-all group">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Privacy & Security</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </CardContent>
            </Card>

            {/* Account Management */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  Account Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-xl transition-all group">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Change Password</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-xl transition-all group">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Email Preferences</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-xl transition-all group">
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Download My Data</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </CardContent>
            </Card>

            {/* Subscription */}
            {user.tier !== "free" && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Crown className="h-4 w-4 text-gray-600" />
                    </div>
                    Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-50 rounded-xl border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Current Plan</span>
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                        {user.tier?.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">Renews on March 1, 2026</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Manage Subscription
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Support */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                  </div>
                  Help & Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-xl transition-all group">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Contact Support</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-xl transition-all group">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">FAQs</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="shadow-sm border-2 border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-red-600">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-red-50 rounded-xl transition-all group">
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-5 w-5 text-red-400 group-hover:text-red-600" />
                    <span className="text-sm font-medium text-red-600">Delete Account</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-red-400" />
                </button>
                <p className="text-xs text-gray-500 px-4">
                  Once deleted, your account cannot be recovered. This action is permanent.
                </p>
              </CardContent>
            </Card>

            {/* Version Info */}
            <div className="text-center py-4">
              <p className="text-xs text-gray-500">KILIMO Agri-AI Suite</p>
              <p className="text-xs text-gray-400">Version 2.5.0</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}