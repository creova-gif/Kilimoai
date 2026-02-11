import { useState } from "react";
import { ShoppingCart, TrendingUp, Package, Store } from "lucide-react";
import { NextGenMarketplace } from "./NextGenMarketplace";
import { MarketPrices } from "./MarketPrices";
import { OrdersSalesEcommerce } from "./OrdersSalesEcommerce";

interface UnifiedMarketProps {
  userId: string;
  region: string;
  language: string;
  onNavigate: (tab: string) => void;
  initialTab?: string;
}

type MarketTab = "marketplace" | "prices" | "orders";

export function UnifiedMarket({
  userId,
  region,
  language,
  onNavigate,
  initialTab = "marketplace"
}: UnifiedMarketProps) {
  const [activeTab, setActiveTab] = useState<MarketTab>(initialTab as MarketTab);

  const tabs = [
    { id: "marketplace", label: language === "sw" ? "Soko" : "Buy & Sell", icon: Store },
    { id: "prices", label: language === "sw" ? "Bei" : "Prices", icon: TrendingUp },
    { id: "orders", label: language === "sw" ? "Maagizo" : "My Orders", icon: Package }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#2E7D32] rounded-lg">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {language === "sw" ? "Soko" : "Market"}
              </h1>
              <p className="text-xs text-gray-500">
                {language === "sw" ? "Nunua na uza mazao" : "Buy and sell produce"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as MarketTab)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 ${
                  isActive
                    ? "border-[#2E7D32] text-gray-900"
                    : "border-transparent text-gray-500"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "marketplace" && (
          <div className="animate-in fade-in duration-300">
            <NextGenMarketplace
              userId={userId}
              region={region}
              onNavigate={onNavigate}
              language={language}
            />
          </div>
        )}

        {activeTab === "prices" && (
          <div className="animate-in fade-in duration-300">
            <MarketPrices
              region={region}
              onNavigate={onNavigate}
              language={language}
            />
          </div>
        )}

        {activeTab === "orders" && (
          <div className="animate-in fade-in duration-300">
            <OrdersSalesEcommerce userId={userId} language={language} />
          </div>
        )}
      </div>
    </div>
  );
}
