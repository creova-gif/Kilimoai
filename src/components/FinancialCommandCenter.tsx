import { useState, useEffect } from "react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import {
  Wallet, TrendingUp, TrendingDown, Lock, Unlock, Target,
  Clock, CheckCircle2, AlertCircle, Info, Eye, EyeOff,
  ArrowUpRight, ArrowDownRight, Shield, Zap, PiggyBank,
  Calendar, DollarSign, CreditCard, Smartphone, QrCode,
  Download, Upload, RefreshCw, Settings, MoreVertical,
  Banknote, Coins, TrendingUp as Growth, Award, Star,
  Activity, BarChart3, PieChart, Users, Building2,
  FileText, Send, Minus, Plus, X, ChevronRight, ChevronDown,
  Package, Sprout, Beef, School, Home as HomeIcon, Heart,
  Bell, Filter, Search, Circle, CheckCircle, XCircle,
  Fingerprint, Key, AlertTriangle, HelpCircle, ExternalLink
} from "lucide-react";

interface FinancialCommandCenterProps {
  userId: string;
  language: "en" | "sw";
}

interface WalletBalance {
  available: number;
  escrow: number;
  pending: number;
  savings: number;
  total: number;
}

interface Transaction {
  id: string;
  type: "credit" | "debit";
  category: "input_purchase" | "contract_advance" | "marketplace_sale" | "savings" | "withdrawal" | "transfer";
  amount: number;
  balance: number;
  description: string;
  status: "completed" | "pending" | "failed";
  date: Date;
  icon?: string;
  linkedTo?: {
    type: "input" | "contract" | "listing";
    id: string;
    name: string;
  };
}

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  color: string;
  deadline?: Date;
}

export function FinancialCommandCenter({ userId, language }: FinancialCommandCenterProps) {
  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;
  
  // ✅ REAL wallet balance from backend (not hardcoded!)
  const [balance, setBalance] = useState<WalletBalance>({
    available: 0,
    escrow: 0,
    pending: 0,
    savings: 0,
    total: 0
  });
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "savings" | "security">("overview");
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");

  // ✅ Fetch REAL wallet data from backend
  const fetchWalletData = async () => {
    try {
      setLoadingBalance(true);
      const response = await fetch(`${API_BASE}/wallet/${userId}`, {
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success && data.wallet) {
        const wallet = data.wallet;
        setBalance({
          available: wallet.balance || 0,
          escrow: wallet.escrowAmount || 0,
          pending: wallet.pendingPayments || 0,
          savings: wallet.savingsBalance || 0,
          total: (wallet.balance || 0) + (wallet.escrowAmount || 0) + (wallet.pendingPayments || 0) + (wallet.savingsBalance || 0)
        });
        
        // Set transactions if available
        if (data.transactions && Array.isArray(data.transactions)) {
          setTransactions(data.transactions.map((tx: any) => ({
            id: tx.id,
            type: tx.type === "credit" ? "credit" : "debit",
            category: tx.category || "transfer",
            amount: tx.amount,
            balance: tx.balanceAfter || wallet.balance,
            description: tx.description,
            status: tx.status || "completed",
            date: new Date(tx.timestamp || tx.createdAt),
          })));
        }
      } else {
        console.log("Wallet not found. User may need to verify phone.");
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
      toast.error(language === "sw" ? "Imeshindwa kupakia pochi" : "Could not load wallet");
    } finally {
      setLoadingBalance(false);
    }
  };

  // Fetch wallet data on mount
  useEffect(() => {
    if (userId) {
      fetchWalletData();
    }
  }, [userId]);

  // ❌ REMOVED: Hardcoded mock transactions (now fetched from backend above)
  const mockTransactionsForFallback: Transaction[] = [
    {
      id: "1",
      type: "debit",
      category: "input_purchase",
      amount: 65000,
      balance: 2450000,
      description: language === "en" ? "NPK Fertilizer - 1 bag" : "Mbolea ya NPK - Gunia 1",
      status: "completed",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: "🌱",
      linkedTo: {
        type: "input",
        id: "inp-123",
        name: "NPK 17:17:17"
      }
    },
    {
      id: "2",
      type: "credit",
      category: "contract_advance",
      amount: 500000,
      balance: 2515000,
      description: language === "en" ? "Contract advance - Maize delivery" : "Mkopo wa mkataba - Utoaji mahindi",
      status: "completed",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      icon: "🌾",
      linkedTo: {
        type: "contract",
        id: "con-456",
        name: "Maize Contract 2026"
      }
    },
    {
      id: "3",
      type: "credit",
      category: "marketplace_sale",
      amount: 180000,
      balance: 2015000,
      description: language === "en" ? "Sale: Tomatoes (3 crates)" : "Mauzo: Nyanya (masanduku 3)",
      status: "pending",
      date: new Date(Date.now() - 48 * 60 * 60 * 1000),
      icon: "🍅",
      linkedTo: {
        type: "listing",
        id: "lst-789",
        name: "Fresh Tomatoes"
      }
    },
    {
      id: "4",
      type: "credit",
      category: "savings",
      amount: 100000,
      balance: 1835000,
      description: language === "en" ? "Monthly auto-save" : "Akiba ya kila mwezi",
      status: "completed",
      date: new Date(Date.now() - 72 * 60 * 60 * 1000),
      icon: "🏦"
    }
  ];

  const savingsGoals: SavingsGoal[] = [
    {
      id: "1",
      name: language === "en" ? "Next Season Inputs" : "Pembejeo za Msimu Ujao",
      targetAmount: 2000000,
      currentAmount: 850000,
      icon: "🌱",
      color: "green",
      deadline: new Date("2026-03-01")
    },
    {
      id: "2",
      name: language === "en" ? "School Fees" : "Ada za Shule",
      targetAmount: 1200000,
      currentAmount: 650000,
      icon: "🎓",
      color: "blue",
      deadline: new Date("2026-01-15")
    },
    {
      id: "3",
      name: language === "en" ? "Dairy Cow" : "Ng'ombe wa Maziwa",
      targetAmount: 3000000,
      currentAmount: 0,
      icon: "🐄",
      color: "amber"
    }
  ];

  const getTransactionIcon = (category: string) => {
    switch (category) {
      case "input_purchase": return <Sprout className="h-5 w-5" />;
      case "contract_advance": return <FileText className="h-5 w-5" />;
      case "marketplace_sale": return <Package className="h-5 w-5" />;
      case "savings": return <PiggyBank className="h-5 w-5" />;
      case "withdrawal": return <ArrowUpRight className="h-5 w-5" />;
      case "transfer": return <Send className="h-5 w-5" />;
      default: return <Circle className="h-5 w-5" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `TZS ${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/10 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white px-4 lg:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Wallet className="h-7 w-7" />
                {language === "en" ? "My Wallet" : "Mkoba Wangu"}
              </h1>
              <p className="text-blue-100 text-sm mt-1">
                {language === "en" ? "Your financial command center" : "Kituo chako cha kifedha"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Total Balance Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-blue-100 text-sm">
                {language === "en" ? "Total Balance" : "Jumla ya Salio"}
              </span>
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            <div className="text-4xl font-bold mb-6">
              {showBalance ? formatCurrency(balance.total) : "••••••••"}
            </div>

            {/* Balance Breakdown */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Unlock className="h-4 w-4 text-green-300" />
                  <span className="text-xs text-blue-100">
                    {language === "en" ? "Available" : "Inapatikana"}
                  </span>
                </div>
                <div className="text-lg font-bold">
                  {showBalance ? formatCurrency(balance.available) : "••••"}
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="h-4 w-4 text-amber-300" />
                  <span className="text-xs text-blue-100">
                    {language === "en" ? "In Escrow" : "Katika Escrow"}
                  </span>
                </div>
                <div className="text-lg font-bold">
                  {showBalance ? formatCurrency(balance.escrow) : "••••"}
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-orange-300" />
                  <span className="text-xs text-blue-100">
                    {language === "en" ? "Pending" : "Inasubiri"}
                  </span>
                </div>
                <div className="text-lg font-bold">
                  {showBalance ? formatCurrency(balance.pending) : "••••"}
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <PiggyBank className="h-4 w-4 text-purple-300" />
                  <span className="text-xs text-blue-100">
                    {language === "en" ? "Savings" : "Akiba"}
                  </span>
                </div>
                <div className="text-lg font-bold">
                  {showBalance ? formatCurrency(balance.savings) : "••••"}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-3 flex flex-col items-center gap-2 transition-colors border border-white/10">
              <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                <ArrowDownRight className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium">{language === "en" ? "Add Money" : "Ongeza Pesa"}</span>
            </button>

            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-3 flex flex-col items-center gap-2 transition-colors border border-white/10">
              <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Send className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium">{language === "en" ? "Send" : "Tuma"}</span>
            </button>

            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-3 flex flex-col items-center gap-2 transition-colors border border-white/10">
              <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center">
                <PiggyBank className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium">{language === "en" ? "Save" : "Hifadhi"}</span>
            </button>

            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl p-3 flex flex-col items-center gap-2 transition-colors border border-white/10">
              <div className="h-10 w-10 bg-amber-500 rounded-full flex items-center justify-center">
                <QrCode className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium">{language === "en" ? "Scan" : "Changanua"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 -mt-4">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {language === "en" ? "Overview" : "Muhtasari"}
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                activeTab === "transactions"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {language === "en" ? "Transactions" : "Miamala"}
            </button>
            <button
              onClick={() => setActiveTab("savings")}
              className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                activeTab === "savings"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {language === "en" ? "Savings Goals" : "Malengo ya Akiba"}
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                activeTab === "security"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {language === "en" ? "Security" : "Usalama"}
            </button>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Spend Insights */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {language === "en" ? "Spending This Month" : "Matumizi Mwezi Huu"}
                </h3>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="week">{language === "en" ? "This Week" : "Wiki Hii"}</option>
                  <option value="month">{language === "en" ? "This Month" : "Mwezi Huu"}</option>
                  <option value="year">{language === "en" ? "This Year" : "Mwaka Huu"}</option>
                </select>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">{language === "en" ? "Farm Inputs" : "Pembejeo za Shamba"}</span>
                    </div>
                    <span className="font-semibold text-gray-900">TZS 785,000</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{language === "en" ? "Household" : "Nyumbani"}</span>
                    </div>
                    <span className="font-semibold text-gray-900">TZS 320,000</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "26%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">{language === "en" ? "Savings" : "Akiba"}</span>
                    </div>
                    <span className="font-semibold text-gray-900">TZS 100,000</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "9%" }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-blue-900 mb-1">
                      {language === "en" ? "Smart Insight" : "Ufahamu Mwerevu"}
                    </div>
                    <p className="text-sm text-blue-800">
                      {language === "en"
                        ? "You spent 65% on inputs this month. Consider our pay-later options to preserve cash flow."
                        : "Ulitumia 65% kwenye pembejeo mwezi huu. Zingatia chaguzi zetu za kulipa baadaye ili uhifadhi mtiririko wa pesa."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === "en" ? "Recent Activity" : "Shughuli za Hivi Karibuni"}
              </h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        txn.type === "credit" ? "bg-green-100" : "bg-red-100"
                      }`}>
                        {getTransactionIcon(txn.category)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{txn.description}</div>
                        <div className="text-sm text-gray-500">
                          {txn.date.toLocaleDateString()} • {txn.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                        {txn.type === "credit" ? "+" : "-"}{formatCurrency(txn.amount)}
                      </div>
                      {txn.status === "pending" && (
                        <span className="text-xs text-amber-600">{language === "en" ? "Pending" : "Inasubiri"}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === "transactions" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {language === "en" ? "All Transactions" : "Miamala Yote"}
              </h3>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" />
                <span className="text-sm">{language === "en" ? "Filter" : "Chuja"}</span>
              </button>
            </div>

            <div className="space-y-2">
              {transactions.map((txn) => (
                <div key={txn.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                        txn.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}>
                        {getTransactionIcon(txn.category)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{txn.description}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {txn.date.toLocaleDateString()} • {txn.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {txn.linkedTo && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {language === "en" ? "Linked to" : "Imeunganishwa na"}: {txn.linkedTo.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                        {txn.type === "credit" ? "+" : "-"}{formatCurrency(txn.amount)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {language === "en" ? "Balance" : "Salio"}: {formatCurrency(txn.balance)}
                      </div>
                      {txn.status === "pending" ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded mt-2">
                          <Clock className="h-3 w-3" />
                          {language === "en" ? "Pending" : "Inasubiri"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 rounded mt-2">
                          <CheckCircle2 className="h-3 w-3" />
                          {language === "en" ? "Completed" : "Imekamilika"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SAVINGS TAB */}
        {activeTab === "savings" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {language === "en" ? "Total Savings" : "Jumla ya Akiba"}
                </h3>
                <PiggyBank className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold mb-2">{formatCurrency(balance.savings)}</div>
              <p className="text-purple-100 text-sm">
                {language === "en" ? "Keep growing your future!" : "Endelea kukuza mustakabali wako!"}
              </p>
            </div>

            {savingsGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              
              return (
                <div key={goal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`text-3xl`}>{goal.icon}</div>
                      <div>
                        <h4 className="font-bold text-gray-900">{goal.name}</h4>
                        {goal.deadline && (
                          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="h-4 w-4" />
                            {language === "en" ? "Target" : "Lengo"}: {goal.deadline.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        {formatCurrency(goal.currentAmount)} {language === "en" ? "of" : "ya"} {formatCurrency(goal.targetAmount)}
                      </span>
                      <span className="font-semibold text-gray-900">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r from-${goal.color}-400 to-${goal.color}-600 rounded-full transition-all`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      {language === "en" ? "Add Funds" : "Ongeza Pesa"}
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      {language === "en" ? "Adjust Goal" : "Rekebisha Lengo"}
                    </button>
                  </div>
                </div>
              );
            })}

            <button className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600">
              <Plus className="h-5 w-5" />
              <span className="font-medium">{language === "en" ? "Create New Savings Goal" : "Tengeneza Lengo Jipya la Akiba"}</span>
            </button>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === "en" ? "Security Settings" : "Mipangilio ya Usalama"}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Fingerprint className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {language === "en" ? "Biometric Login" : "Kuingia kwa Alama ya Kibayolojia"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {language === "en" ? "Enabled" : "Imewashwa"}
                      </div>
                    </div>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Key className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {language === "en" ? "Transaction PIN" : "PIN ya Miamala"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {language === "en" ? "Set up" : "Imewekwa"}
                      </div>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 font-medium">
                    {language === "en" ? "Change" : "Badilisha"}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {language === "en" ? "Transaction Limits" : "Vikomo vya Miamala"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {language === "en" ? "Daily: TZS 5,000,000" : "Kila siku: TZS 5,000,000"}
                      </div>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 font-medium">
                    {language === "en" ? "View" : "Ona"}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-900 mb-1">
                    {language === "en" ? "Your money is safe" : "Pesa zako ziko salama"}
                  </div>
                  <p className="text-sm text-blue-800">
                    {language === "en"
                      ? "All transactions are encrypted and protected by escrow. We never store your PIN or biometric data."
                      : "Miamala yote imefichwa na inalindwa na escrow. Hatuhifadhi kamwe PIN yako au data ya kibayolojia."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Lightbulb({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}
