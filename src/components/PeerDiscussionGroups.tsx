import { useState } from "react";
import { Users, MessageSquare, TrendingUp, Leaf, Send, ThumbsUp, Flag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";

interface Discussion {
  id: string;
  author: string;
  authorType: "farmer" | "extension" | "champion";
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  hasPhoto?: boolean;
  verified?: boolean;
}

interface DiscussionGroup {
  id: string;
  name: string;
  topic: string;
  members: number;
  icon: any;
  color: string;
  description: string;
}

export function PeerDiscussionGroups() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  
  const groups: DiscussionGroup[] = [
    {
      id: "G001",
      name: "Maize Farmers Network",
      topic: "Maize Cultivation",
      members: 234,
      icon: Leaf,
      color: "green",
      description: "Share tips and experiences on maize farming",
    },
    {
      id: "G002",
      name: "Market Price Watch",
      topic: "Market Information",
      members: 187,
      icon: TrendingUp,
      color: "blue",
      description: "Real-time market discussions and price negotiations",
    },
    {
      id: "G003",
      name: "Women in Agriculture",
      topic: "Women Farmers",
      members: 156,
      icon: Users,
      color: "purple",
      description: "Supporting women farmers with shared experiences",
    },
    {
      id: "G004",
      name: "Pest & Disease Control",
      topic: "Crop Protection",
      members: 312,
      icon: MessageSquare,
      color: "orange",
      description: "Get help identifying and treating crop problems",
    },
  ];

  const discussions: Discussion[] = [
    {
      id: "D001",
      author: "John Mwangi",
      authorType: "farmer",
      content: "My maize leaves are turning yellow at the tips. Has anyone experienced this? What could be the cause?",
      timestamp: "2 hours ago",
      likes: 12,
      replies: 8,
      hasPhoto: true,
    },
    {
      id: "D002",
      author: "Dr. Amina Hassan (Extension Officer)",
      authorType: "extension",
      content: "Yellow leaf tips often indicate nitrogen deficiency. Apply urea fertilizer at 50kg per acre. Also check soil pH - it should be between 5.5-7.0 for optimal maize growth.",
      timestamp: "1 hour ago",
      likes: 24,
      replies: 3,
      verified: true,
    },
    {
      id: "D003",
      author: "Peter Komba",
      authorType: "champion",
      content: "I had the same issue last season. After applying urea as Dr. Amina suggested, my crop recovered within 2 weeks. Also make sure you're watering adequately.",
      timestamp: "45 minutes ago",
      likes: 15,
      replies: 2,
    },
    {
      id: "D004",
      author: "Grace Mollel",
      authorType: "farmer",
      content: "Where can I buy certified maize seeds in Morogoro? I need about 20kg for next season.",
      timestamp: "30 minutes ago",
      likes: 5,
      replies: 4,
    },
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In real app, this would send to backend
    setNewMessage("");
  };

  const getAuthorBadge = (type: string) => {
    switch (type) {
      case "extension":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-300">Extension Officer</Badge>;
      case "champion":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-300">Champion Farmer</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-6 w-6" />
            Farmer Discussion Groups
          </CardTitle>
          <CardDescription className="text-green-100">
            Connect with other farmers, share experiences, and learn from experts
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => {
          const Icon = group.icon;
          const isSelected = selectedGroup === group.id;
          
          return (
            <Card 
              key={group.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'border-green-500 border-2 shadow-lg' : 'border-gray-200'
              }`}
              onClick={() => setSelectedGroup(isSelected ? null : group.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-${group.color}-100`}>
                    <Icon className={`h-6 w-6 text-${group.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{group.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {group.members} members
                      </span>
                      <Badge variant="outline" className="text-xs">{group.topic}</Badge>
                    </div>
                  </div>
                </div>
                
                {isSelected && (
                  <Button 
                    className="w-full mt-4 bg-green-600 hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Join group action
                    }}
                  >
                    View Discussions
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Discussion Feed */}
      {selectedGroup && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Recent Discussions
            </CardTitle>
            <CardDescription>
              {groups.find(g => g.id === selectedGroup)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* New Message Input */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share your experience, ask a question, or help a fellow farmer..."
                rows={3}
                className="mb-3 focus:ring-2 focus:ring-green-500 bg-white"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleSendMessage}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post Message
                </Button>
                <Button variant="outline">
                  Add Photo
                </Button>
              </div>
            </div>

            {/* Discussion Messages */}
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <div key={discussion.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <span className="font-medium text-green-700">
                          {discussion.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{discussion.author}</p>
                          {getAuthorBadge(discussion.authorType)}
                          {discussion.verified && (
                            <Badge className="bg-green-100 text-green-700">Verified</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{discussion.timestamp}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{discussion.content}</p>

                  {discussion.hasPhoto && (
                    <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-3">
                      <p className="text-gray-500 text-sm">[Photo attached]</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{discussion.likes} Likes</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      <span>{discussion.replies} Replies</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors ml-auto">
                      <Flag className="h-4 w-4" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Community Guidelines */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <CardTitle className="text-gray-900">Community Guidelines</CardTitle>
          <ul className="space-y-2 text-sm text-gray-800">
            <li className="flex gap-2">
              <span className="text-gray-600 mt-0.5">•</span>
              <span>Be respectful and supportive of fellow farmers</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-600 mt-0.5">•</span>
              <span>Share accurate information - misinformation will be flagged</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-600 mt-0.5">•</span>
              <span>Extension officers verify critical farming advice</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-600 mt-0.5">•</span>
              <span>Report suspicious or harmful content immediately</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}