/**
 * UNIFIED FINANCE - WORLD-CLASS REDESIGN
 * 
 * Farmer Question: "Where is my money?"
 * 
 * DESIGN PHILOSOPHY:
 * - Clear balance visibility
 * - Transaction history
 * - Payment requests
 * - Mobile money integration
 */

import { useState } from "react";
import { 
  Wallet, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Sparkles
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface UnifiedFinanceProps {
  userId: string;
  language: "en" | "sw";
}

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
  category: string;
}

export function UnifiedFinance({
  userId,
  language
}: UnifiedFinanceProps) {
  const [balance] = useState(2450000);
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "income",
      amount: 850000,
      description: language === "en" ? "Maize sale - Arusha Market" : "Mauzo ya mahindi - Soko la Arusha",
      date: new Date(Date.now() - 86400000).toISOString(),
      category: language === "en" ? "Sales" : "Mauzo"
    },
    {
      id: "2",
      type: "expense",
      amount: 120000,
      description: language === "en" ? "NPK Fertilizer purchase" : "Ununuzi wa mbolea ya NPK",
      date: new Date(Date.now() - 172800000).toISOString(),
      category: language === "en" ? "Inputs" : "Vifaa"
    },
    {
      id: "3",
      type: "income",
      amount: 450000,
      description: language === "en" ? "Bean harvest payment" : "Malipo ya mavuno ya maharagwe",
      date: new Date(Date.now() - 259200000).toISOString(),
      category: language === "en" ? "Sales" : "Mauzo"
    },
    {
      id: "4",
      type: "expense",
      amount: 80000,
      description: language === "en" ? "Labor - Weeding" : "Wafanyakazi - Kupalilia",
      date: new Date(Date.now() - 345600000).toISOString(),
      category: language === "en" ? "Labor" : "Wafanyakazi"
    }
  ]);

  const text = {
    title: language === "en" ? "Finance & Wallet" : "Fedha na Mkoba",
    subtitle: language === "en" ? "Track earnings and expenses" : "Fuatilia mapato na matumizi",
    balance: language === "en" ? "Balance" : "Salio",
    income: language === "en" ? "Income" : "Mapato",
    expenses: language === "en" ? "Expenses" : "Matumizi",
    addMoney: language === "en" ? "Add Money" : "Ongeza Fedha",
    sendMoney: language === "en" ? "Send Money" : "Tuma Fedha",
    recentTransactions: language === "en" ? "Recent Transactions" : "Shughuli za Hivi Karibuni",
    viewAll: language === "en" ? "View All" : "Tazama Zote",
  };

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
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
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{text.title}</h1>
                  <p className="text-white/90 text-sm">{text.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4">
              <p className="text-sm text-white/80 mb-2">{text.balance}</p>
              <p className="text-4xl font-bold mb-4">
                {(balance / 1000).toFixed(0)}k
                <span className="text-lg ml-2">TSh</span>
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => toast.success(language === "en" ? "Opening deposit..." : "Inafungua uwekaji fedha...")}
                  className="flex-1 bg-white text-[#2E7D32] hover:bg-white/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {text.addMoney}
                </Button>
                <Button 
                  onClick={() => toast.success(language === "en" ? "Opening transfer..." : "Inafungua uhamisho...")}
                  className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0"
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  {text.sendMoney}
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{text.income}</p>
                <p className="text-xl font-bold text-emerald-400">
                  +{(totalIncome / 1000).toFixed(0)}k
                </p>
                <p className="text-xs text-white/80">{language === "en" ? "this month" : "mwezi huu"}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{text.expenses}</p>
                <p className="text-xl font-bold text-red-400">
                  -{(totalExpenses / 1000).toFixed(0)}k
                </p>
                <p className="text-xs text-white/80">{language === "en" ? "this month" : "mwezi huu"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{text.recentTransactions}</h2>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => toast.success(language === "en" ? "Opening all transactions..." : "Inafungua shughuli zote...")}
            >
              {text.viewAll}
            </Button>
          </div>

          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-2 border-gray-200 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                          transaction.type === "income" 
                            ? "bg-emerald-100" 
                            : "bg-red-100"
                        }`}>
                          {transaction.type === "income" ? (
                            <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {transaction.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(transaction.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className={`text-lg font-bold ${
                        transaction.type === "income" 
                          ? "text-emerald-600" 
                          : "text-red-600"
                      }`}>
                        {transaction.type === "income" ? "+" : "-"}
                        {(transaction.amount / 1000).toFixed(0)}k
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <Card className="border-2 border-purple-100 bg-purple-50/50">
          <CardContent className="py-4">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-purple-900 mb-1 text-sm">
                  {language === "en" ? "Mobile Money Integration" : "Muunganisho wa Fedha za Simu"}
                </h4>
                <p className="text-sm text-purple-700 leading-relaxed">
                  {language === "en"
                    ? "Connect M-Pesa, Tigo Pesa, Airtel Money. Send/receive payments directly. Track all farm finances in one place."
                    : "Unganisha M-Pesa, Tigo Pesa, Airtel Money. Tuma/pokea malipo moja kwa moja. Fuatilia fedha zote za shamba mahali pamoja."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

UnifiedFinance.displayName = "UnifiedFinance";