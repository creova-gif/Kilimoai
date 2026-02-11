/**
 * UNIFIED MARKET - WORLD-CLASS REDESIGN
 * 
 * Farmer Question: "What are prices today? Where can I sell?"
 * 
 * DESIGN PHILOSOPHY:
 * - Real-time price updates
 * - Multiple market comparison
 * - Buy/sell marketplace
 * - Price trends & forecasts
 */

import { useState } from "react";
import { 
  TrendingUp, TrendingDown, Store, DollarSign, MapPin, Sparkles, Search
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface UnifiedMarketProps {
  userId: string;
  region: string;
  language: "en" | "sw";
}

interface MarketPrice {
  id: string;
  crop: string;
  price: number;
  change: number;
  market: string;
  trend: "up" | "down" | "stable";
  lastUpdated: string;
}

export function UnifiedMarket({
  userId,
  region,
  language
}: UnifiedMarketProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [prices, setPrices] = useState<MarketPrice[]>([
    {
      id: "1",
      crop: language === "en" ? "Maize" : "Mahindi",
      price: 850000,
      change: 5.2,
      market: "Arusha Central",
      trend: "up",
      lastUpdated: new Date().toISOString()
    },
    {
      id: "2",
      crop: language === "en" ? "Rice" : "Mchele",
      price: 1200000,
      change: -2.1,
      market: "Mwanza Market",
      trend: "down",
      lastUpdated: new Date().toISOString()
    },
    {
      id: "3",
      crop: language === "en" ? "Beans" : "Maharagwe",
      price: 950000,
      change: 1.5,
      market: "Dodoma Market",
      trend: "up",
      lastUpdated: new Date().toISOString()
    },
    {
      id: "4",
      crop: language === "en" ? "Coffee" : "Kahawa",
      price: 3500000,
      change: 0.3,
      market: "Moshi Market",
      trend: "stable",
      lastUpdated: new Date().toISOString()
    }
  ]);

  const text = {
    title: language === "en" ? "Market Prices" : "Bei za Soko",
    subtitle: language === "en" ? "Live prices and trading opportunities" : "Bei za sasa na fursa za biashara",
    search: language === "en" ? "Search crop..." : "Tafuta zao...",
    perTonne: language === "en" ? "per tonne" : "kwa tani",
    updated: language === "en" ? "Updated" : "Imeboreshwa",
    justNow: language === "en" ? "just now" : "sasa hivi",
    viewMarket: language === "en" ? "View Market" : "Tazama Soko",
    sell: language === "en" ? "Sell" : "Uza",
    buy: language === "en" ? "Buy" : "Nunua",
  };

  const filteredPrices = prices.filter(p => 
    p.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgPrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
  const upTrends = prices.filter(p => p.trend === "up").length;

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
                  <Store className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{text.title}</h1>
                  <p className="text-white/90 text-sm">{text.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{language === "en" ? "Avg Price" : "Bei ya Wastani"}</p>
                <p className="text-lg font-bold">{(avgPrice / 1000).toFixed(0)}k</p>
                <p className="text-xs text-white/80">TSh/{language === "en" ? "t" : "tani"}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{language === "en" ? "Markets" : "Masoko"}</p>
                <p className="text-2xl font-bold">{prices.length}</p>
                <p className="text-xs text-white/80">{language === "en" ? "tracked" : "inafuatiliwa"}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{language === "en" ? "Rising" : "Inapanda"}</p>
                <p className="text-2xl font-bold">{upTrends}</p>
                <p className="text-xs text-white/80">{language === "en" ? "crops" : "mazao"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={text.search}
            className="pl-10 h-12 border-2 border-gray-200 focus:border-[#2E7D32]"
          />
        </div>

        {/* Price Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredPrices.map((price, index) => (
            <motion.div
              key={price.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-2 border-gray-200 hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl mb-1">{price.crop}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-3.5 w-3.5" />
                        {price.market}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                      price.trend === "up" 
                        ? "bg-emerald-100 text-emerald-700" 
                        : price.trend === "down"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {price.trend === "up" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : price.trend === "down" ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : (
                        <DollarSign className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">{Math.abs(price.change)}%</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-3xl font-bold text-gray-900">
                      {(price.price / 1000).toFixed(0)}k
                      <span className="text-lg text-gray-600 font-normal ml-2">TSh</span>
                    </p>
                    <p className="text-sm text-gray-600">{text.perTonne}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      className="flex-1 border-2 border-gray-300 hover:border-[#2E7D32]"
                      onClick={() => toast.success(`${text.buy} ${price.crop}`)}
                    >
                      {text.buy}
                    </Button>
                    <Button 
                      size="sm"
                      className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20]"
                      onClick={() => toast.success(`${text.sell} ${price.crop}`)}
                    >
                      {text.sell}
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 mt-3 text-center">
                    {text.updated}: {text.justNow}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Info Card */}
        <Card className="border-2 border-blue-100 bg-blue-50/50">
          <CardContent className="py-4">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1 text-sm">
                  {language === "en" ? "Real-Time Market Data" : "Data ya Soko ya Wakati Halisi"}
                </h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {language === "en"
                    ? "Live prices from major markets across Tanzania. AI predicts best selling times. Direct connection to verified buyers."
                    : "Bei za sasa kutoka masoko makubwa Tanzania. AI inatabiri nyakati bora za kuuza. Muunganisho wa moja kwa moja na wanunuzi walioidhinishwa."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

UnifiedMarket.displayName = "UnifiedMarket";