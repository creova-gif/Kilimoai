import { useState } from "react";
import { Wallet, Smartphone, FileText, Shield, ScrollText, Settings } from "lucide-react";
import { FarmFinance } from "./FarmFinance";
import { FinancialCommandCenter } from "./FinancialCommandCenter";
import { ComprehensiveReporting } from "./ComprehensiveReporting";
import { FairContractFarming } from "./FairContractFarming";
import { InsuranceHub } from "./InsuranceHub";
import WalletAdminDashboard from "./WalletAdminDashboard";

interface UnifiedFinanceProps {
  userId: string;
  userRole?: string;
  language: string;
  user?: any;
  initialTab?: string;
}

type FinanceTab = "overview" | "mobile-money" | "reports" | "contracts" | "insurance" | "admin";

export function UnifiedFinance({
  userId,
  userRole,
  language,
  user,
  initialTab = "overview"
}: UnifiedFinanceProps) {
  const [activeTab, setActiveTab] = useState<FinanceTab>(initialTab as FinanceTab);

  const isAdmin = userRole === "admin" || userRole === "super_admin";

  const tabs = [
    { id: "overview", label: language === "sw" ? "Muhtasari" : "Overview", icon: Wallet },
    { id: "mobile-money", label: language === "sw" ? "Simu Pesa" : "Mobile Money", icon: Smartphone },
    { id: "reports", label: language === "sw" ? "Ripoti" : "Reports", icon: FileText },
    { id: "contracts", label: language === "sw" ? "Mikataba" : "Contracts", icon: ScrollText },
    { id: "insurance", label: language === "sw" ? "Bima" : "Insurance", icon: Shield }
  ];

  if (isAdmin) {
    tabs.push({ id: "admin", label: language === "sw" ? "Msimamizi" : "Admin", icon: Settings });
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#2E7D32] rounded-lg">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {language === "sw" ? "Fedha" : "Finance"}
              </h1>
              <p className="text-xs text-gray-500">
                {language === "sw" ? "Simamia fedha zako" : "Manage your money"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-1 px-2 pb-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as FinanceTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-[#2E7D32] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "overview" && (
          <div className="animate-in fade-in duration-300">
            <FarmFinance userId={userId} language={language} />
          </div>
        )}

        {activeTab === "mobile-money" && (
          <div className="animate-in fade-in duration-300">
            <FinancialCommandCenter userId={userId} language={language} />
          </div>
        )}

        {activeTab === "reports" && (
          <div className="animate-in fade-in duration-300">
            <ComprehensiveReporting userId={userId} language={language} />
          </div>
        )}

        {activeTab === "contracts" && (
          <div className="animate-in fade-in duration-300">
            <FairContractFarming userId={userId} language={language} />
          </div>
        )}

        {activeTab === "insurance" && (
          <div className="animate-in fade-in duration-300">
            <InsuranceHub userId={userId} language={language} />
          </div>
        )}

        {activeTab === "admin" && isAdmin && (
          <div className="animate-in fade-in duration-300">
            <WalletAdminDashboard language={language} user={user} />
          </div>
        )}
      </div>
    </div>
  );
}
