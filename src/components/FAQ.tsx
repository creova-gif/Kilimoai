import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  HelpCircle,
  Sprout,
  Cloud,
  TrendingUp,
  Smartphone,
  Wallet,
  MessageSquare,
  Users,
  Shield
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Topics", icon: HelpCircle },
    { id: "getting-started", label: "Getting Started", icon: Sprout },
    { id: "ai-features", label: "AI Features", icon: MessageSquare },
    { id: "payments", label: "Payments & Wallet", icon: Wallet },
    { id: "marketplace", label: "Marketplace", icon: TrendingUp },
    { id: "weather", label: "Weather & Crops", icon: Cloud },
    { id: "account", label: "Account & Security", icon: Shield },
    { id: "community", label: "Community", icon: Users },
  ];

  const faqs: FAQItem[] = [
    {
      id: "1",
      question: "How do I get started with CREOVA?",
      answer: "Getting started is easy! Simply register with your phone number, select your region and crops, and you'll instantly access personalized farming advice, market prices, weather forecasts, and AI support. No smartphone required - basic phones work too!",
      category: "getting-started",
      tags: ["registration", "setup", "beginner"]
    },
    {
      id: "2",
      question: "Is CREOVA free to use?",
      answer: "Yes! CREOVA's core features are completely free for smallholder farmers. This includes AI advisory, weather forecasts, market prices, and crop diagnosis. Premium features like detailed farm analytics and advanced AI recommendations are available at affordable rates.",
      category: "getting-started",
      tags: ["pricing", "free", "subscription"]
    },
    {
      id: "3",
      question: "How accurate is the Sankofa AI advisor?",
      answer: "Sankofa AI uses advanced machine learning trained on Tanzanian agricultural data. It provides answers with confidence scores - 'High Confidence' means 85%+ accuracy based on verified sources. The AI learns from local extension officers and successful farmers in your region.",
      category: "ai-features",
      tags: ["ai", "accuracy", "sankofa"]
    },
    {
      id: "4",
      question: "Can I ask questions in Swahili?",
      answer: "Absolutely! CREOVA is fully bilingual (English/Swahili). The AI understands both languages and responds in your preferred language. You can also use voice messages in Swahili - perfect for farmers who prefer speaking over typing.",
      category: "ai-features",
      tags: ["swahili", "language", "voice"]
    },
    {
      id: "5",
      question: "How do mobile money payments work?",
      answer: "CREOVA supports M-Pesa, TigoPesa, Airtel Money, and GoPay. When you sell crops on the marketplace, payment goes into your CREOVA Wallet. You can withdraw anytime to your mobile money account. Transactions are instant and secure with digital receipts.",
      category: "payments",
      tags: ["mobile money", "mpesa", "payments", "wallet"]
    },
    {
      id: "6",
      question: "What are the withdrawal fees?",
      answer: "Fees vary by provider: M-Pesa (1.5%), TigoPesa (1.8%), Airtel Money (1.5%), and GoPay (0.5%). GoPay offers the lowest fees to help farmers save more. Minimum withdrawal is TZS 10,000. No hidden charges!",
      category: "payments",
      tags: ["fees", "withdrawal", "gopay"]
    },
    {
      id: "7",
      question: "How do I list crops for sale?",
      answer: "Go to Marketplace → 'List Your Crop' → Enter crop type, quantity, and price. Verified buyers in your region will see your listing instantly. You can also see current market prices to set competitive rates. Payment is held in escrow until delivery.",
      category: "marketplace",
      tags: ["selling", "marketplace", "crops"]
    },
    {
      id: "8",
      question: "How does escrow protect me?",
      answer: "When a buyer orders your crop, payment is held securely in CREOVA Wallet escrow. Money is only released to you after the buyer confirms delivery. If there's a dispute, our support team mediates. This protects both farmers and buyers.",
      category: "marketplace",
      tags: ["escrow", "security", "protection"]
    },
    {
      id: "9",
      question: "How accurate are the weather forecasts?",
      answer: "We provide 14-day forecasts from Tanzania Meteorological Authority (TMA). High Confidence forecasts (1-7 days) are 85%+ accurate. Medium Confidence (8-14 days) are 70%+ accurate. We also show seasonal predictions and best planting times.",
      category: "weather",
      tags: ["weather", "forecast", "accuracy"]
    },
    {
      id: "10",
      question: "What if I upload a photo of a diseased crop?",
      answer: "Our AI analyzes the photo within seconds and identifies the disease with confidence scores. You'll get: (1) Disease name, (2) Treatment recommendations, (3) Nearby agro-vet shops, (4) Prevention tips. Save the diagnosis in your history.",
      category: "ai-features",
      tags: ["diagnosis", "disease", "photo"]
    },
    {
      id: "11",
      question: "Can I use CREOVA offline?",
      answer: "Basic features work offline! Downloaded crop guides, saved market prices, and your farm records are accessible without internet. AI chat, live prices, and payments require internet connection. We're building SMS support for remote areas.",
      category: "getting-started",
      tags: ["offline", "internet", "sms"]
    },
    {
      id: "12",
      question: "How is my data protected?",
      answer: "Your data is encrypted and stored securely. We NEVER share personal information without consent. You control what data is collected through Privacy Settings. CREOVA complies with Tanzania's Data Protection Act. Your trust is our priority.",
      category: "account",
      tags: ["privacy", "security", "data"]
    },
    {
      id: "13",
      question: "What is the CREOVA AGRO-ID?",
      answer: "Your digital farmer identity card! It includes: verified farmer status, farm details, transaction history, and credit score. Banks and cooperatives use it for loan applications. It's like NIDA for farmers - secure, portable, and trusted.",
      category: "account",
      tags: ["agro-id", "identity", "verification"]
    },
    {
      id: "14",
      question: "How do I join peer discussion groups?",
      answer: "Go to 'Peer Groups' → Select your interest (e.g., 'Maize Farmers', 'Organic Farming'). Ask questions, share experiences, and learn from successful farmers. Extension officers also participate to provide expert advice.",
      category: "community",
      tags: ["peer groups", "community", "discussion"]
    },
    {
      id: "15",
      question: "What are Rewards & Points?",
      answer: "Earn points by: asking AI questions, checking weather, selling crops, helping other farmers, and completing your farm profile. Points unlock achievements, badges, and discounts on inputs. Compete on leaderboards with farmers in your region!",
      category: "getting-started",
      tags: ["rewards", "points", "gamification"]
    },
    {
      id: "16",
      question: "How do I contact CREOVA support?",
      answer: "We're here to help! Contact us via: (1) In-app chat (fastest), (2) WhatsApp: +255 XXX XXX XXX, (3) Call: 0800 CREOVA (free), (4) Email: support@creova.co.tz. Support hours: Mon-Sat, 7AM-7PM EAT. Emergency support 24/7.",
      category: "getting-started",
      tags: ["support", "contact", "help"]
    },
    {
      id: "17",
      question: "Can cooperatives use CREOVA?",
      answer: "Yes! Cooperatives get special features: bulk member registration, group analytics, aggregated market pricing, field officer dashboards, and training program management. Contact us for cooperative pricing and onboarding.",
      category: "community",
      tags: ["cooperative", "organization", "bulk"]
    },
    {
      id: "18",
      question: "What languages are supported?",
      answer: "Currently: English and Swahili. Coming soon: Sukuma, Chaga, Hehe, Makonde, and more Tanzanian languages. Voice support works in Swahili dialect variations. Help us improve by reporting translation issues!",
      category: "getting-started",
      tags: ["language", "swahili", "translation"]
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = 
      searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
          </div>
          <p className="text-green-100">
            Find answers to common questions about CREOVA features and services
          </p>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search questions, answers, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                    selectedCategory === category.id
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">No FAQs found matching your search</p>
              <p className="text-sm text-gray-500 mt-1">Try different keywords or browse categories</p>
            </CardContent>
          </Card>
        ) : (
          filteredFAQs.map((faq) => (
            <Card key={faq.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full p-4 flex items-start justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <div className="flex flex-wrap gap-2">
                      {faq.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {expandedId === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </button>
                
                {expandedId === faq.id && (
                  <div className="px-4 pb-4 pt-2 border-t bg-gray-50">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Still Need Help */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Still Need Help?
          </CardTitle>
          <CardDescription>
            Can't find what you're looking for? Our support team is ready to assist you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button className="p-4 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Chat with AI</p>
                  <p className="text-sm text-gray-600">Get instant answers</p>
                </div>
              </div>
            </button>
            <button className="p-4 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Contact Support</p>
                  <p className="text-sm text-gray-600">Talk to a human</p>
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
