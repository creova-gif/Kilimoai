/**
 * UNIFIED FINANCE
 * 
 * Farmer Question: "How much money do I have/owe/expect?"
 * 
 * MERGES 6 LEGACY PAGES:
 * - Farm Finance (revenue tracking)
 * - Mobile Money (payments)
 * - Wallet (digital wallet)
 * - Insurance (crop insurance)
 * - Analytics (financial dashboards)
 * - Agribusiness (business metrics)
 * 
 * TABS:
 * 1. Overview - Financial summary
 * 2. Transactions - Payment history
 * 3. Mobile Money - M-Pesa, Tigo Pesa, etc.
 * 4. Insurance - Crop insurance
 * 
 * DESIGN PHILOSOPHY:
 * - One farmer job = one page
 * - Tabs for different financial aspects
 * - Offline-capable with sync
 * - Speed > beauty > completeness
 */

import { useState } from "react";
import { 
  DollarSign, CreditCard, Wallet, Shield, TrendingUp, Download, Plus
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { FarmFinance } from "../FarmFinance";
import { FinancialCommandCenter } from "../FinancialCommandCenter";
import { InsuranceHub } from "../InsuranceHub";

interface UnifiedFinanceProps {
  userId: string;
  language: "en" | "sw";
}

export function UnifiedFinance({
  userId,
  language
}: UnifiedFinanceProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    {
      id: "overview",
      label: language === "en" ? "Overview" : "Muhtasari",
      icon: DollarSign,
      description: language === "en" ? "Financial summary" : "Muhtasari wa fedha"
    },
    {
      id: "transactions",
      label: language === "en" ? "Transactions" : "Miamala",
      icon: CreditCard,
      description: language === "en" ? "Payment history" : "Historia ya malipo"
    },
    {
      id: "mobile-money",
      label: language === "en" ? "Mobile Money" : "Fedha ya Simu",
      icon: Wallet,
      description: language === "en" ? "M-Pesa, Tigo Pesa" : "M-Pesa, Tigo Pesa"
    },
    {
      id: "insurance",
      label: language === "en" ? "Insurance" : "Bima",
      icon: Shield,
      description: language === "en" ? "Crop protection" : "Ulinzi wa mazao"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2E7D32] rounded-lg">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {language === "en" ? "Finance" : "Fedha"}
            </h1>
            <p className="text-sm text-gray-600">
              {language === "en" 
                ? "Manage your farm finances in one place" 
                : "Simamia fedha za shamba mahali pamoja"}
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {language === "en" ? "Export" : "Hamisha"}
            </Button>
            <Button size="sm" className="bg-[#2E7D32] hover:bg-[#2E7D32]/90">
              <Plus className="h-4 w-4 mr-2" />
              {language === "en" ? "Add Transaction" : "Ongeza Muamala"}
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
          {/* Overview */}
          <TabsContent value="overview" className="mt-0">
            <FarmFinance userId={userId} language={language} />
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions" className="mt-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                {language === "en" ? "Recent Transactions" : "Miamala ya Hivi Karibuni"}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">
                      {language === "en" ? "Maize Sale" : "Uuzaji wa Mahindi"}
                    </p>
                    <p className="text-sm text-gray-500">Feb 8, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+TZS 450,000</p>
                    <p className="text-xs text-gray-500">
                      {language === "en" ? "Received" : "Imepokelewa"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">
                      {language === "en" ? "Fertilizer Purchase" : "Ununuzi wa Mbolea"}
                    </p>
                    <p className="text-sm text-gray-500">Feb 5, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">-TZS 120,000</p>
                    <p className="text-xs text-gray-500">
                      {language === "en" ? "Paid" : "Imelipwa"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">
                      {language === "en" ? "Seeds Purchase" : "Ununuzi wa Mbegu"}
                    </p>
                    <p className="text-sm text-gray-500">Feb 3, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">-TZS 85,000</p>
                    <p className="text-xs text-gray-500">
                      {language === "en" ? "Paid" : "Imelipwa"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">
                      {language === "en" ? "Bean Sale" : "Uuzaji wa Maharagwe"}
                    </p>
                    <p className="text-sm text-gray-500">Jan 28, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+TZS 280,000</p>
                    <p className="text-xs text-gray-500">
                      {language === "en" ? "Received" : "Imepokelewa"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Mobile Money */}
          <TabsContent value="mobile-money" className="mt-0">
            <FinancialCommandCenter userId={userId} language={language} />
          </TabsContent>

          {/* Insurance */}
          <TabsContent value="insurance" className="mt-0">
            <InsuranceHub userId={userId} language={language} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
