import { useState, useEffect } from "react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import {
  TrendingUp, TrendingDown, Minus, ShoppingCart, Store, Award,
  MessageCircle, Phone, Video, Clock, MapPin, Package, CheckCircle2,
  Star, Shield, Users, Activity, Zap, Search, Filter, Grid3x3,
  List, ChevronRight, Heart, Share2, Eye, Calendar, Truck,
  DollarSign, AlertCircle, BadgeCheck, Verified, Globe, Lock,
  Timer, FileText, Image as ImageIcon, Play, Pause, Bell,
  Sparkles, TrendingDown as Falling, ArrowUpRight, ArrowDownRight,
  CircleDot, Radio, Flame, Tag, Percent, Box, Scale, Leaf,
  Building2, Factory, Warehouse as WarehouseIcon, Home as HomeIcon,
  User, UserCheck, MessageSquare, ThumbsUp, ThumbsDown, Flag,
  X, Send, Mic, PlusCircle, MinusCircle, Info, ExternalLink,
  CreditCard, Banknote, Wallet, Receipt, ShieldCheck, FileCheck, Loader2
} from "lucide-react";

interface NextGenMarketplaceProps {
  userId: string;
  region: string;
  language: "en" | "sw";
  onNavigate: (tab: string) => void;
}

interface MarketPulse {
  activeBuyers: number;
  activeSellers: number;
  recentTrades: number;
  sentiment: "rising" | "stable" | "falling";
  topMovers: Array<{
    item: string;
    change: number;
    price: number;
  }>;
}

interface Seller {
  id: string;
  name: string;
  type: "individual" | "cooperative" | "business" | "exporter";
  logo?: string;
  verificationLevel: "basic" | "business" | "premium";
  trustScore: number;
  transactionCount: number;
  successRate: number;
  location: string;
  certifications: string[];
  story: string;
  memberSince: Date;
}

interface Listing {
  id: string;
  sellerId: string;
  title: string;
  category: "crops" | "livestock" | "inputs" | "equipment";
  image: string;
  price: number;
  unit: string;
  quantity: number;
  availableNow: boolean;
  expiresIn?: number; // hours
  quality: "premium" | "standard" | "economy";
  organic: boolean;
  verified: boolean;
  location: string;
  description: string;
  listedAt: Date;
  views: number;
  likes: number;
  isLive?: boolean;
}

export function NextGenMarketplace({ userId, region, language, onNavigate }: NextGenMarketplaceProps) {
  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;
  
  const [marketPulse, setMarketPulse] = useState<MarketPulse>({
    activeBuyers: 1247,
    activeSellers: 892,
    recentTrades: 34,
    sentiment: "rising",
    topMovers: [
      { item: language === "en" ? "Maize (White)" : "Mahindi (Meupe)", change: 8.2, price: 850 },
      { item: language === "en" ? "Beans (Red)" : "Maharagwe (Mekundu)", change: -3.1, price: 2100 },
      { item: language === "en" ? "Rice (Pishori)" : "Mchele (Pishori)", change: 1.5, price: 3200 }
    ]
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<"marketplace" | "my-listings" | "orders">("marketplace");
  const [chatOpen, setChatOpen] = useState(false);
  
  // ✅ Purchase state
  const [purchasing, setPurchasing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(false);

  // ✅ Fetch wallet balance on mount
  useEffect(() => {
    fetchWalletBalance();
  }, [userId]);

  const fetchWalletBalance = async () => {
    try {
      setLoadingBalance(true);
      const response = await fetch(`${API_BASE}/wallet/${userId}`, {
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      
      if (data.success && data.wallet) {
        setWalletBalance(data.wallet.balance || 0);
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    } finally {
      setLoadingBalance(false);
    }
  };

  // ✅ PURCHASE HANDLER - Real backend call
  const handlePurchase = async (listing: Listing, quantity: number) => {
    const totalCost = listing.price * quantity;
    
    try {
      setPurchasing(true);

      // 1. Check wallet balance
      if (walletBalance < totalCost) {
        toast.error(
          language === "sw"
            ? `Salio haitoshi. Unahitaji TZS ${totalCost.toLocaleString()}. Ongeza pesa kwenye pochi yako.`
            : `Insufficient balance. You need TZS ${totalCost.toLocaleString()}. Please add funds to your wallet.`,
          { duration: 5000 }
        );
        return;
      }

      // 2. Confirm purchase
      const confirmed = window.confirm(
        language === "sw"
          ? `Nunua ${quantity} ${listing.unit} ya ${listing.title} kwa TZS ${totalCost.toLocaleString()}?`
          : `Buy ${quantity} ${listing.unit} of ${listing.title} for TZS ${totalCost.toLocaleString()}?`
      );
      if (!confirmed) {
        setPurchasing(false);
        return;
      }

      // 3. ✅ FIX: Call /marketplace/order (not /marketplace/purchase)
      const response = await fetch(`${API_BASE}/marketplace/order`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          sellerId: listing.sellerId,
          items: [{
            listingId: listing.id,
            title: listing.title,
            quantity: quantity,
            pricePerUnit: listing.price,
          }],
          totalAmount: totalCost,
          paymentMethod: "wallet",
          deliveryLocation: region,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          language === "sw"
            ? `✅ Ununuzi umefanikiwa! Namba ya agizo: ${result.orderNumber || result.orderId}`
            : `✅ Purchase successful! Order #${result.orderNumber || result.orderId}`,
          { duration: 5000 }
        );
        
        // Refresh wallet balance
        await fetchWalletBalance();
        
        // Switch to orders tab
        setActiveTab("orders");
        setSelectedListing(null);
      } else {
        // Handle specific errors
        if (result.error?.includes("verification") || result.error?.includes("verify")) {
          toast.error(
            language === "sw"
              ? "⚠️ Thibitisha namba ya simu kwanza ili kununua bidhaa"
              : "⚠️ Phone verification required to make purchases"
          );
        } else if (result.error?.includes("balance") || result.error?.includes("insufficient")) {
          toast.error(
            language === "sw"
              ? `Salio haitoshi. Pochi yako: TZS ${walletBalance.toLocaleString()}`
              : `Insufficient balance. Your wallet: TZS ${walletBalance.toLocaleString()}`
          );
        } else {
          toast.error(result.error || (language === "sw" ? "Ununuzi umeshindwa" : "Purchase failed"));
        }
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error(
        language === "sw"
          ? "Tatizo la mtandao. Angalia muunganisho wako."
          : "Network error. Please check your connection."
      );
    } finally {
      setPurchasing(false);
    }
  };

  // ✅ FIX: Simplified contact seller (no backend call for now)
  const handleContactSeller = async (sellerId: string, sellerName: string) => {
    toast.info(
      language === "sw"
        ? `📞 Muuzaji: ${sellerName}\n\nNunua bidhaa ili kupata mawasiliano kamili.`
        : `📞 Seller: ${sellerName}\n\nPurchase to unlock full contact details.`,
      { duration: 6000 }
    );
  };

  // Mock sellers data
  const sellers: Seller[] = [
    {
      id: "1",
      name: "Kilimo Fresh Cooperative",
      type: "cooperative",
      verificationLevel: "premium",
      trustScore: 98,
      transactionCount: 1250,
      successRate: 99.2,
      location: "Arusha, Tanzania",
      certifications: ["Organic Certified", "Fair Trade", "GLOBALG.A.P."],
      story: language === "en" 
        ? "We are 500+ smallholder farmers committed to sustainable agriculture"
        : "Sisi ni wakulima wadogo 500+ wanaojitoa kwa kilimo endelevu",
      memberSince: new Date("2020-03-15")
    },
    {
      id: "2",
      name: "Mwanza Grain Traders",
      type: "business",
      verificationLevel: "business",
      trustScore: 94,
      transactionCount: 680,
      successRate: 96.8,
      location: "Mwanza, Tanzania",
      certifications: ["Licensed Trader", "Quality Assured"],
      story: language === "en"
        ? "Connecting farmers to regional and export markets since 2018"
        : "Kuunganisha wakulima na masoko ya mkoa na nje ya nchi tangu 2018",
      memberSince: new Date("2018-07-20")
    },
    {
      id: "3",
      name: "Green Valley Farm",
      type: "individual",
      verificationLevel: "basic",
      trustScore: 87,
      transactionCount: 145,
      successRate: 94.5,
      location: "Morogoro, Tanzania",
      certifications: ["Verified Farmer"],
      story: language === "en"
        ? "Family farm specializing in high-quality vegetables and grains"
        : "Shamba la familia linalojihusisha na mboga na nafaka za ubora wa juu",
      memberSince: new Date("2022-01-10")
    }
  ];

  // Mock listings data
  const listings: Listing[] = [
    {
      id: "1",
      sellerId: "1",
      title: language === "en" ? "Organic White Maize - Premium Grade" : "Mahindi Meupe ya Kikaboni - Daraja la Juu",
      category: "crops",
      image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400&h=300&fit=crop",
      price: 900,
      unit: "kg",
      quantity: 5000,
      availableNow: true,
      quality: "premium",
      organic: true,
      verified: true,
      location: "Arusha",
      description: language === "en"
        ? "Certified organic white maize, moisture <13%, ready for delivery"
        : "Mahindi meupe ya kikaboni yaliyothibitishwa, unyevu <13%, tayari kwa utoaji",
      listedAt: new Date(),
      views: 234,
      likes: 45,
      isLive: true
    },
    {
      id: "2",
      sellerId: "2",
      title: language === "en" ? "Red Kidney Beans - Bulk Available" : "Maharagwe Mekundu - Wingi Unapatikana",
      category: "crops",
      image: "https://images.unsplash.com/photo-1615485500834-bc10199bc964?w=400&h=300&fit=crop",
      price: 2100,
      unit: "kg",
      quantity: 2000,
      availableNow: true,
      expiresIn: 48,
      quality: "standard",
      organic: false,
      verified: true,
      location: "Mwanza",
      description: language === "en"
        ? "High-quality red beans, sorted and cleaned, bulk orders welcome"
        : "Maharagwe mekundu ya ubora wa juu, yamechaguliwa na kusafishwa",
      listedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      views: 567,
      likes: 89
    },
    {
      id: "3",
      sellerId: "1",
      title: language === "en" ? "NPK Fertilizer 17:17:17" : "Mbolea ya NPK 17:17:17",
      category: "inputs",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
      price: 65000,
      unit: language === "en" ? "bag (50kg)" : "gunia (50kg)",
      quantity: 100,
      availableNow: true,
      quality: "standard",
      organic: false,
      verified: true,
      location: "Arusha",
      description: language === "en"
        ? "Certified NPK fertilizer, ideal for maize and vegetables"
        : "Mbolea ya NPK iliyothibitishwa, nzuri kwa mahindi na mboga",
      listedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      views: 189,
      likes: 23,
      isLive: true
    },
    {
      id: "4",
      sellerId: "3",
      title: language === "en" ? "Fresh Tomatoes - Daily Harvest" : "Nyanya Mbichi - Mavuno ya Kila Siku",
      category: "crops",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop",
      price: 1500,
      unit: language === "en" ? "crate (20kg)" : "sanduku (20kg)",
      quantity: 50,
      availableNow: true,
      expiresIn: 12,
      quality: "premium",
      organic: false,
      verified: true,
      location: "Morogoro",
      description: language === "en"
        ? "Farm-fresh tomatoes, harvested daily, perfect for markets"
        : "Nyanya za shambani, zimevunwa kila siku, nzuri kwa masoko",
      listedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      views: 456,
      likes: 67,
      isLive: true
    }
  ];

  const getSellerForListing = (sellerId: string) => {
    return sellers.find(s => s.id === sellerId);
  };

  const getVerificationBadge = (level: string) => {
    switch (level) {
      case "premium":
        return <BadgeCheck className="h-5 w-5 text-green-600" />;
      case "business":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "basic":
        return <Shield className="h-5 w-5 text-gray-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/10">
      {/* SECTION 1: MARKET PULSE - HERO */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Store className="h-8 w-8" />
                {language === "en" ? "Live Marketplace" : "Soko la Moja kwa Moja"}
              </h1>
              <p className="text-white/90 mt-1">
                {language === "en" ? "Real-time agricultural commerce" : "Biashara ya kilimo ya wakati halisi"}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <Radio className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-medium">{language === "en" ? "LIVE" : "MOJA KWA MOJA"}</span>
            </div>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-white/80" />
                <span className="text-sm text-white/80">{language === "en" ? "Active Buyers" : "Wanunuzi Hai"}</span>
              </div>
              <div className="text-3xl font-bold">{marketPulse.activeBuyers.toLocaleString()}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Store className="h-5 w-5 text-white/80" />
                <span className="text-sm text-white/80">{language === "en" ? "Active Sellers" : "Wauzaji Hai"}</span>
              </div>
              <div className="text-3xl font-bold">{marketPulse.activeSellers.toLocaleString()}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-white/80" />
                <span className="text-sm text-white/80">{language === "en" ? "Trades Today" : "Biashara Leo"}</span>
              </div>
              <div className="text-3xl font-bold">{marketPulse.recentTrades}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                {marketPulse.sentiment === "rising" ? (
                  <TrendingUp className="h-5 w-5 text-green-300" />
                ) : marketPulse.sentiment === "falling" ? (
                  <TrendingDown className="h-5 w-5 text-red-300" />
                ) : (
                  <Minus className="h-5 w-5 text-white/80" />
                )}
                <span className="text-sm text-white/80">{language === "en" ? "Market" : "Soko"}</span>
              </div>
              <div className="text-3xl font-bold capitalize">{marketPulse.sentiment}</div>
            </div>
          </div>

          {/* Live Price Ticker */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="h-5 w-5 text-orange-300" />
              <span className="font-semibold">{language === "en" ? "Top Movers" : "Mabadiliko Makubwa"}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {marketPulse.topMovers.map((mover, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                  <div>
                    <div className="font-medium text-sm">{mover.item}</div>
                    <div className="text-xs text-white/80">TZS {mover.price.toLocaleString()}/kg</div>
                  </div>
                  <div className={`flex items-center gap-1 font-bold ${
                    mover.change > 0 ? "text-green-300" : "text-red-300"
                  }`}>
                    {mover.change > 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    <span>{Math.abs(mover.change)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("marketplace")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "marketplace"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {language === "en" ? "Browse Marketplace" : "Vinjari Soko"}
          </button>
          <button
            onClick={() => setActiveTab("my-listings")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "my-listings"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {language === "en" ? "My Listings" : "Matangazo Yangu"}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "orders"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {language === "en" ? "My Orders" : "Maagizo Yangu"}
          </button>
        </div>

        {activeTab === "marketplace" && (
          <>
            {/* Search & Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={language === "en" ? "Search crops, inputs, equipment..." : "Tafuta mazao, pembejeo, vifaa..."}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="all">{language === "en" ? "All Categories" : "Aina Zote"}</option>
                  <option value="crops">{language === "en" ? "Crops" : "Mazao"}</option>
                  <option value="livestock">{language === "en" ? "Livestock" : "Mifugo"}</option>
                  <option value="inputs">{language === "en" ? "Inputs" : "Pembejeo"}</option>
                  <option value="equipment">{language === "en" ? "Equipment" : "Vifaa"}</option>
                </select>

                {/* View Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                  >
                    <Grid3x3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Filter className="h-5 w-5" />
                  <span>{language === "en" ? "Filters" : "Vichujio"}</span>
                </button>
              </div>

              {/* Advanced Filters (Expandable) */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === "en" ? "Verification Level" : "Kiwango cha Uthibitisho"}
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="all">{language === "en" ? "All Sellers" : "Wauzaji Wote"}</option>
                      <option value="premium">{language === "en" ? "Premium Only" : "Premium Tu"}</option>
                      <option value="business">{language === "en" ? "Business+" : "Biashara+"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === "en" ? "Quality" : "Ubora"}
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="all">{language === "en" ? "All Grades" : "Viwango Vyote"}</option>
                      <option value="premium">{language === "en" ? "Premium" : "Ubora wa Juu"}</option>
                      <option value="standard">{language === "en" ? "Standard" : "Kawaida"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === "en" ? "Availability" : "Upatikanaji"}
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="all">{language === "en" ? "All" : "Zote"}</option>
                      <option value="now">{language === "en" ? "Available Now" : "Inapatikana Sasa"}</option>
                      <option value="live">{language === "en" ? "Live Listings" : "Matangazo ya Moja kwa Moja"}</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Listings Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {listings.map((listing) => {
                const seller = getSellerForListing(listing.sellerId);
                
                return (
                  <div
                    key={listing.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setSelectedListing(listing)}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Live Badge */}
                      {listing.isLive && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1 animate-pulse">
                          <Radio className="h-3 w-3" />
                          LIVE
                        </div>
                      )}

                      {/* Expires Soon Badge */}
                      {listing.expiresIn && listing.expiresIn < 24 && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded">
                          <Timer className="h-3 w-3 inline mr-1" />
                          {listing.expiresIn}h
                        </div>
                      )}

                      {/* Quality Badge */}
                      {listing.quality === "premium" && (
                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold rounded flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          {language === "en" ? "PREMIUM" : "UBORA WA JUU"}
                        </div>
                      )}

                      {/* Organic Badge */}
                      {listing.organic && (
                        <div className="absolute bottom-3 right-3 px-2 py-1 bg-green-600 text-white text-xs font-medium rounded flex items-center gap-1">
                          <Leaf className="h-3 w-3" />
                          {language === "en" ? "ORGANIC" : "KIKABONI"}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Seller Info */}
                      {seller && (
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                          <div className="h-8 w-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {seller.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-gray-900 truncate">{seller.name}</span>
                              {getVerificationBadge(seller.verificationLevel)}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{seller.trustScore}%</span>
                              </div>
                              <span>•</span>
                              <span>{seller.transactionCount} {language === "en" ? "trades" : "biashara"}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Listing Title */}
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{listing.title}</h3>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-2xl font-bold text-green-600">
                          TZS {listing.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">/{listing.unit}</span>
                      </div>

                      {/* Details */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          <span>{listing.quantity.toLocaleString()} {listing.unit}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{listing.location}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          {language === "en" ? "Buy Now" : "Nunua Sasa"}
                        </button>
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <MessageCircle className="h-5 w-5 text-gray-600" />
                        </button>
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Heart className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {listing.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {listing.likes}
                          </span>
                        </div>
                        <span>{new Date(listing.listedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* My Listings Tab */}
        {activeTab === "my-listings" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === "en" ? "No Active Listings" : "Hakuna Matangazo Hai"}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === "en" 
                ? "Start selling your products to thousands of verified buyers"
                : "Anza kuuza bidhaa zako kwa maelfu ya wanunuzi waliothibitishwa"}
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2 mx-auto">
              <PlusCircle className="h-5 w-5" />
              {language === "en" ? "Create Listing" : "Tengeneza Tangazo"}
            </button>
          </div>
        )}

        {/* My Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === "en" ? "No Orders Yet" : "Hakuna Maagizo Bado"}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === "en"
                ? "Browse the marketplace to find quality products"
                : "Vinjari soko ili kupata bidhaa za ubora"}
            </p>
            <button 
              onClick={() => setActiveTab("marketplace")}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2 mx-auto"
            >
              <Store className="h-5 w-5" />
              {language === "en" ? "Browse Marketplace" : "Vinjari Soko"}
            </button>
          </div>
        )}
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          seller={getSellerForListing(selectedListing.sellerId)!}
          language={language}
          onClose={() => setSelectedListing(null)}
          handlePurchase={handlePurchase}
          handleContactSeller={handleContactSeller}
          purchasing={purchasing}
          walletBalance={walletBalance}
          loadingBalance={loadingBalance}
        />
      )}
    </div>
  );
}

// Listing Detail Modal Component
interface ListingDetailModalProps {
  listing: Listing;
  seller: Seller;
  language: "en" | "sw";
  onClose: () => void;
  handlePurchase: (listing: Listing, quantity: number) => void;
  handleContactSeller: (sellerId: string, sellerName: string) => void;
  purchasing: boolean;
  walletBalance: number;
  loadingBalance: boolean;
}

function ListingDetailModal({ listing, seller, language, onClose, handlePurchase, handleContactSeller, purchasing, walletBalance, loadingBalance }: ListingDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
          {/* Header */}
          <div className="relative h-96">
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            {listing.isLive && (
              <div className="absolute top-4 left-4 px-4 py-2 bg-red-500 text-white font-bold rounded-full flex items-center gap-2 animate-pulse">
                <Radio className="h-4 w-4" />
                LIVE
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Seller Brand Card */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-200">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  {seller.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{seller.name}</h3>
                    {seller.verificationLevel === "premium" && (
                      <BadgeCheck className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{seller.story}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{seller.trustScore}%</span>
                      <span className="text-gray-600">{language === "en" ? "trust" : "uaminifu"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">{seller.successRate}%</span>
                      <span className="text-gray-600">{language === "en" ? "success" : "mafanikio"}</span>
                    </div>
                  </div>
                  {seller.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {seller.certifications.map((cert, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white text-xs font-medium text-green-700 rounded border border-green-300">
                          <Award className="h-3 w-3 inline mr-1" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{listing.title}</h2>
            <p className="text-gray-600 mb-6">{listing.description}</p>

            {/* Price & Quantity */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">{language === "en" ? "Price per unit" : "Bei kwa kila kipimo"}</div>
                <div className="text-3xl font-bold text-green-600">
                  TZS {listing.price.toLocaleString()}
                  <span className="text-sm text-gray-500">/{listing.unit}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">{language === "en" ? "Available quantity" : "Kiasi kinachopatikana"}</div>
                <div className="text-3xl font-bold text-gray-900">
                  {listing.quantity.toLocaleString()}
                  <span className="text-sm text-gray-500"> {listing.unit}</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "en" ? "Select quantity" : "Chagua kiasi"}
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <MinusCircle className="h-5 w-5 text-gray-600" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center font-semibold"
                />
                <button
                  onClick={() => setQuantity(Math.min(listing.quantity, quantity + 1))}
                  className="h-10 w-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <PlusCircle className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="text-right mt-2">
                <span className="text-sm text-gray-600">{language === "en" ? "Total:" : "Jumla:"} </span>
                <span className="text-xl font-bold text-green-600">
                  TZS {(listing.price * quantity).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => handlePurchase(listing, quantity)}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg"
                disabled={purchasing}
              >
                <ShoppingCart className="h-5 w-5" />
                {language === "en" ? "Buy Now with Escrow" : "Nunua Sasa na Escrow"}
              </button>
              <button
                onClick={() => setShowChat(!showChat)}
                className="px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all flex items-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                {language === "en" ? "Chat" : "Ongea"}
              </button>
              <button
                onClick={() => handleContactSeller(seller.id, seller.name)}
                className="px-6 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
              >
                <Phone className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Trust Features */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <div className="text-xs font-medium text-gray-700">{language === "en" ? "Escrow Protected" : "Ulinzi wa Escrow"}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Truck className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                <div className="text-xs font-medium text-gray-700">{language === "en" ? "Verified Delivery" : "Utoaji Uliothibitishwa"}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <FileCheck className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                <div className="text-xs font-medium text-gray-700">{language === "en" ? "Quality Assured" : "Ubora Umethibitishwa"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}