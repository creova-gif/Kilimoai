/**
 * UNIFIED MARKET
 * 
 * Farmer Question: "Where can I buy/sell?"
 * 
 * MERGES 5 LEGACY PAGES:
 * - Marketplace (buy/sell)
 * - Orders & Sales (transaction history)
 * - Market Prices (current prices)
 * - Contracts (contract farming)
 * - Input Supply (purchasing inputs)
 * 
 * TABS:
 * 1. Buy & Sell - Marketplace for trading
 * 2. My Orders - Order history & tracking
 * 3. Market Prices - Current market rates
 * 4. Contracts - Contract farming opportunities
 * 
 * DESIGN PHILOSOPHY:
 * - One farmer job = one page
 * - Tabs for different market activities
 * - Offline-capable with price cache
 * - Speed > beauty > completeness
 */

import { useState } from "react";
import { 
  ShoppingCart, Package, TrendingUp, FileText, Search, Filter, Plus
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { NextGenMarketplace } from "../NextGenMarketplace";
import { OrdersSalesEcommerce } from "../OrdersSalesEcommerce";
import { MarketPrices } from "../MarketPrices";
import { FairContractFarming } from "../FairContractFarming";

interface UnifiedMarketProps {
  userId: string;
  region?: string;
  onNavigate?: (tab: string) => void;
  language: "en" | "sw";
}

export function UnifiedMarket({
  userId,
  region = "Unknown",
  onNavigate,
  language
}: UnifiedMarketProps) {
  const [activeTab, setActiveTab] = useState("marketplace");

  const tabs = [
    {
      id: "marketplace",
      label: language === "en" ? "Buy & Sell" : "Nunua & Uza",
      icon: ShoppingCart,
      description: language === "en" ? "Trade with others" : "Fanya biashara na wengine"
    },
    {
      id: "orders",
      label: language === "en" ? "My Orders" : "Maagizo Yangu",
      icon: Package,
      description: language === "en" ? "Order history" : "Historia ya maagizo"
    },
    {
      id: "prices",
      label: language === "en" ? "Market Prices" : "Bei za Soko",
      icon: TrendingUp,
      description: language === "en" ? "Current rates" : "Bei za sasa"
    },
    {
      id: "contracts",
      label: language === "en" ? "Contracts" : "Mikataba",
      icon: FileText,
      description: language === "en" ? "Contract farming" : "Kilimo cha mkataba"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2E7D32] rounded-lg">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {language === "en" ? "Market" : "Soko"}
            </h1>
            <p className="text-sm text-gray-600">
              {language === "en" 
                ? "Buy inputs, sell produce, track prices" 
                : "Nunua vifaa, uza mazao, fuatilia bei"}
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              {language === "en" ? "Search" : "Tafuta"}
            </Button>
            <Button size="sm" className="bg-[#2E7D32] hover:bg-[#2E7D32]/90">
              <Plus className="h-4 w-4 mr-2" />
              {language === "en" ? "Post Listing" : "Chapisha Tangazo"}
            </Button>
          </div>
        </div>
      </div>

      {/* Unified Tabs Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab List */}
        <TabsList className="w-full justify-start overflow-x-auto bg-white border border-gray-200 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-[#2E7D32] data-[state=active]:text-white transition-colors whitespace-nowrap"
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab Contents */}
        <div className="mt-6">
          {/* Buy & Sell */}
          <TabsContent value="marketplace" className="mt-0">
            <NextGenMarketplace 
              userId={userId}
              region={region}
              onNavigate={onNavigate}
              language={language}
            />
          </TabsContent>

          {/* My Orders */}
          <TabsContent value="orders" className="mt-0">
            <OrdersSalesEcommerce 
              userId={userId}
              language={language}
            />
          </TabsContent>

          {/* Market Prices */}
          <TabsContent value="prices" className="mt-0">
            <MarketPrices 
              region={region}
              onNavigate={onNavigate}
              language={language}
            />
          </TabsContent>

          {/* Contracts */}
          <TabsContent value="contracts" className="mt-0">
            <FairContractFarming 
              userId={userId}
              language={language}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
