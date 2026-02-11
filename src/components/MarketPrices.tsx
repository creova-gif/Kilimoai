import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  MapPin,
  Calendar,
  RefreshCw,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  DollarSign,
  Package,
  Wheat,
  Apple,
  Leaf,
  Clock,
  Bell,
  Target,
  Activity
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";

interface MarketPricesProps {
  region: string;
  onNavigate?: (tab: string) => void;
}

export function MarketPrices({ region, onNavigate }: MarketPricesProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("today");

  const categories = [
    { id: "all", label: "All Crops", icon: Package, count: 24 },
    { id: "grains", label: "Grains", icon: Wheat, count: 8 },
    { id: "vegetables", label: "Vegetables", icon: Leaf, count: 10 },
    { id: "fruits", label: "Fruits", icon: Apple, count: 6 },
  ];

  const marketData = [
    {
      crop: "Maize",
      category: "grains",
      price: 850000,
      previousPrice: 800000,
      change: 6.25,
      trend: "up",
      unit: "per tonne",
      market: "Morogoro Central",
      lastUpdated: "2 hours ago",
      volume: "2,450 tonnes",
      forecast: "rising"
    },
    {
      crop: "Rice (Paddy)",
      category: "grains",
      price: 1200000,
      previousPrice: 1225000,
      change: -2.04,
      trend: "down",
      unit: "per tonne",
      market: "Dodoma Market",
      lastUpdated: "1 hour ago",
      volume: "1,850 tonnes",
      forecast: "stable"
    },
    {
      crop: "Beans",
      category: "grains",
      price: 950000,
      previousPrice: 915000,
      change: 3.83,
      trend: "up",
      unit: "per tonne",
      market: "Arusha Wholesale",
      lastUpdated: "3 hours ago",
      volume: "1,200 tonnes",
      forecast: "rising"
    },
    {
      crop: "Tomatoes",
      category: "vegetables",
      price: 45000,
      previousPrice: 45000,
      change: 0,
      trend: "stable",
      unit: "per crate (20kg)",
      market: "Dar es Salaam",
      lastUpdated: "30 mins ago",
      volume: "8,500 crates",
      forecast: "stable"
    },
    {
      crop: "Onions",
      category: "vegetables",
      price: 65000,
      previousPrice: 58000,
      change: 12.07,
      trend: "up",
      unit: "per bag (50kg)",
      market: "Mwanza Market",
      lastUpdated: "1 hour ago",
      volume: "3,200 bags",
      forecast: "rising"
    },
    {
      crop: "Potatoes",
      category: "vegetables",
      price: 55000,
      previousPrice: 60000,
      change: -8.33,
      trend: "down",
      unit: "per bag (50kg)",
      market: "Iringa Market",
      lastUpdated: "4 hours ago",
      volume: "4,100 bags",
      forecast: "falling"
    },
    {
      crop: "Bananas",
      category: "fruits",
      price: 35000,
      previousPrice: 33000,
      change: 6.06,
      trend: "up",
      unit: "per bunch",
      market: "Mbeya Market",
      lastUpdated: "2 hours ago",
      volume: "6,700 bunches",
      forecast: "stable"
    },
    {
      crop: "Mangoes",
      category: "fruits",
      price: 25000,
      previousPrice: 27000,
      change: -7.41,
      trend: "down",
      unit: "per crate (15kg)",
      market: "Tanga Market",
      lastUpdated: "5 hours ago",
      volume: "2,900 crates",
      forecast: "falling"
    },
  ];

  const filteredData = marketData.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.crop.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-[#2E7D32]" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-[#2E7D32] bg-green-50 border-[#2E7D32]/20";
      case "down": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getForecastBadge = (forecast: string) => {
    switch (forecast) {
      case "rising":
        return <Badge className="bg-green-50 text-[#2E7D32] flex items-center gap-1"><TrendingUp className="h-3 w-3" />Rising</Badge>;
      case "falling":
        return <Badge className="bg-red-100 text-red-700 flex items-center gap-1"><TrendingDown className="h-3 w-3" />Falling</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 flex items-center gap-1"><Minus className="h-3 w-3" />Stable</Badge>;
    }
  };
  
  const handleRefresh = () => {
    toast.success("Market Prices Refreshed", {
      description: "Latest market data loaded successfully",
      duration: 2000
    });
  };
  
  const handleSetAlert = (cropName?: string) => {
    if (cropName) {
      toast.success(`Price Alert Set for ${cropName}`, {
        description: "You'll be notified when the price changes significantly",
        duration: 3000
      });
    } else {
      toast.info("Price Alert System", {
        description: "Set up custom price alerts for your favorite crops",
        duration: 3000
      });
    }
  };
  
  const handleFilterClick = () => {
    toast.info("Advanced Filters", {
      description: "Filter by price range, region, and date",
      duration: 2000
    });
  };
  
  const handleMarketplaceNavigation = () => {
    toast.success("Opening Marketplace", {
      description: "Connect with verified buyers instantly",
      duration: 2000
    });
    if (onNavigate) {
      onNavigate("marketplace");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2E7D32] via-[#2E7D32] to-[#1B5E20] rounded-2xl md:rounded-3xl p-4 md:p-6 text-white">
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 md:p-2 bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h1 className="text-2xl md:text-3xl font-black">Market Prices</h1>
              </div>
              <p className="text-white/90 text-xs md:text-sm mb-3">
                Live market data from Tanzania's major agricultural markets
              </p>
              <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm flex-wrap">
                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full">
                  <MapPin className="h-3 w-3" />
                  {region}
                </span>
                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full">
                  <Clock className="h-3 w-3" />
                  Updated live
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 w-full md:w-auto transition-all hover:scale-105"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4 md:mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-3">
              <p className="text-[10px] md:text-xs text-white/80 mb-1">Markets Tracked</p>
              <p className="text-xl md:text-2xl font-bold">12</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-3">
              <p className="text-[10px] md:text-xs text-white/80 mb-1">Crops Listed</p>
              <p className="text-xl md:text-2xl font-bold">24</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-3">
              <p className="text-[10px] md:text-xs text-white/80 mb-1">Avg. Change</p>
              <p className="text-xl md:text-2xl font-bold flex items-center gap-1">
                +2.3%
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search crops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl border-2 focus:border-[#2E7D32]"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleFilterClick}
            className="gap-2 h-11 rounded-xl border-2 hover:border-[#2E7D32] hover:bg-green-50 transition-all"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            <span className="sm:hidden">Filter</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSetAlert()}
            className="gap-2 h-11 rounded-xl border-2 hover:border-[#2E7D32] hover:bg-green-50 transition-all"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Set Alert</span>
            <span className="sm:hidden">Alert</span>
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                toast.success(`Category: ${cat.label}`, {
                  description: `Viewing ${cat.count} items`,
                  duration: 2000
                });
              }}
              className={`
                flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl border-2 transition-all whitespace-nowrap flex-shrink-0 hover:scale-105
                ${isActive
                  ? "bg-[#2E7D32] text-white border-[#2E7D32] shadow-lg scale-105"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#2E7D32]/30 hover:shadow-md"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span className="font-semibold text-xs md:text-sm">{cat.label}</span>
              <span className={`
                px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold
                ${isActive ? "bg-white/20" : "bg-gray-100"}
              `}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Price Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((item, idx) => (
          <Card key={idx} className="hover:shadow-xl transition-all border-2 hover:border-[#2E7D32]/30 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <CardTitle className="text-lg font-bold">{item.crop}</CardTitle>
                  <CardDescription className="text-xs">{item.unit}</CardDescription>
                </div>
                {getTrendIcon(item.trend)}
              </div>
              
              <div className="flex items-end gap-2">
                <p className="text-3xl font-black text-gray-900">
                  {(item.price / 1000).toFixed(0)}k
                </p>
                <p className="text-sm text-gray-500 mb-1">TZS</p>
              </div>

              <div className={`
                flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg border w-fit
                ${getTrendColor(item.trend)}
              `}>
                {item.trend === "up" && <ArrowUpRight className="h-3 w-3" />}
                {item.trend === "down" && <ArrowDownRight className="h-3 w-3" />}
                {item.change > 0 ? "+" : ""}{item.change.toFixed(2)}%
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Previous</span>
                <span className="font-semibold text-gray-900">
                  TZS {(item.previousPrice / 1000).toFixed(0)}k
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Market
                </span>
                <span className="font-semibold text-gray-900">{item.market}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Volume
                </span>
                <span className="font-semibold text-gray-900">{item.volume}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated
                </span>
                <span className="font-semibold text-gray-900">{item.lastUpdated}</span>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Forecast</span>
                  {getForecastBadge(item.forecast)}
                </div>
              </div>

              <Button 
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] transition-all hover:scale-105" 
                size="sm"
                onClick={() => handleSetAlert(item.crop)}
              >
                <Target className="h-4 w-4 mr-2" />
                Set Price Alert
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Insights */}
      <Card className="border-2 border-[#2E7D32]/20 bg-gradient-to-br from-green-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#2E7D32]" />
            Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div 
              onClick={handleMarketplaceNavigation}
              className="flex items-start gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all cursor-pointer hover:scale-105"
            >
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-[#2E7D32]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">Rising Demand for Onions</p>
                <p className="text-xs text-gray-600 mt-1">
                  Prices up 12% this week due to seasonal demand. Good time to sell.
                </p>
              </div>
            </div>

            <div 
              onClick={handleMarketplaceNavigation}
              className="flex items-start gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all cursor-pointer hover:scale-105"
            >
              <div className="p-2 bg-gray-100 rounded-lg">
                <Activity className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">Stable Grain Markets</p>
                <p className="text-xs text-gray-600 mt-1">
                  Maize and rice prices remain steady. Expected to hold through the month.
                </p>
              </div>
            </div>

            <div 
              onClick={handleMarketplaceNavigation}
              className="flex items-start gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all cursor-pointer hover:scale-105"
            >
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingDown className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">Seasonal Fruit Surplus</p>
                <p className="text-xs text-gray-600 mt-1">
                  Mango prices dropping as harvest season peaks. Consider storage options.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}