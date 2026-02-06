import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  PieChart,
  Calendar,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  ShoppingCart,
  Package,
  Leaf,
  Droplet,
  Users,
  Truck,
  BarChart3,
  Target,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface FarmFinanceProps {
  userId: string;
}

export function FarmFinance({ userId }: FarmFinanceProps) {
  const [timeRange, setTimeRange] = useState("month");
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const financialSummary = {
    totalIncome: 8500000,
    totalExpenses: 4200000,
    netProfit: 4300000,
    previousMonthProfit: 3800000,
    profitChange: 13.16,
    cashOnHand: 2100000,
    expectedRevenue: 5200000,
  };

  const incomeCategories = [
    { name: "Crop Sales", amount: 6200000, percentage: 73, color: "bg-green-500", icon: Leaf },
    { name: "Livestock", amount: 1800000, percentage: 21, color: "bg-blue-500", icon: Users },
    { name: "Other Income", amount: 500000, percentage: 6, color: "bg-purple-500", icon: Package },
  ];

  const expenseCategories = [
    { name: "Seeds & Inputs", amount: 1500000, percentage: 36, color: "bg-orange-500", icon: Package },
    { name: "Fertilizers", amount: 1200000, percentage: 29, color: "bg-yellow-500", icon: Droplet },
    { name: "Labor", amount: 900000, percentage: 21, color: "bg-blue-500", icon: Users },
    { name: "Equipment", amount: 400000, percentage: 10, color: "bg-purple-500", icon: Truck },
    { name: "Other", amount: 200000, percentage: 4, color: "bg-gray-500", icon: ShoppingCart },
  ];

  const recentTransactions = [
    {
      id: "1",
      type: "income",
      category: "Crop Sales",
      description: "Sold 2 tonnes of maize",
      amount: 1700000,
      date: "2026-01-07",
      status: "completed"
    },
    {
      id: "2",
      type: "expense",
      category: "Fertilizers",
      description: "NPK fertilizer - 10 bags",
      amount: 450000,
      date: "2026-01-06",
      status: "completed"
    },
    {
      id: "3",
      type: "income",
      category: "Livestock",
      description: "Sold 3 goats",
      amount: 600000,
      date: "2026-01-05",
      status: "completed"
    },
    {
      id: "4",
      type: "expense",
      category: "Labor",
      description: "Farm workers - weekly wages",
      amount: 200000,
      date: "2026-01-04",
      status: "pending"
    },
    {
      id: "5",
      type: "expense",
      category: "Seeds",
      description: "Tomato seeds - 2kg",
      amount: 120000,
      date: "2026-01-03",
      status: "completed"
    },
  ];

  const budgetGoals = [
    { category: "Seeds & Inputs", budget: 2000000, spent: 1500000, remaining: 500000 },
    { category: "Fertilizers", budget: 1500000, spent: 1200000, remaining: 300000 },
    { category: "Labor", budget: 1000000, spent: 900000, remaining: 100000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-3xl p-6 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-black">Farm Finance</h1>
              </div>
              <p className="text-white/90 text-sm">
                Track income, expenses, and profitability
              </p>
            </div>
            <Button className="bg-white text-green-600 hover:bg-white/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">Total Income</p>
              <p className="text-xl font-bold">
                {(financialSummary.totalIncome / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">Total Expenses</p>
              <p className="text-xl font-bold">
                {(financialSummary.totalExpenses / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">Net Profit</p>
              <p className="text-xl font-bold">
                {(financialSummary.netProfit / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">Cash On Hand</p>
              <p className="text-xl font-bold">
                {(financialSummary.cashOnHand / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {["week", "month", "quarter", "year"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize
              ${timeRange === range
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-200 hover:border-green-300"
              }
            `}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Main Metrics Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Total Income */}
        <Card className="border-2 border-green-200 hover:shadow-xl transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-700">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +15.3%
              </Badge>
            </div>
            <CardTitle className="text-sm text-gray-600 mt-4">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-gray-900 mb-2">
              TZS {(financialSummary.totalIncome / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-600">
              This {timeRange}
            </p>
          </CardContent>
        </Card>

        {/* Total Expenses */}
        <Card className="border-2 border-red-200 hover:shadow-xl transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="p-2 bg-red-100 rounded-xl">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <Badge className="bg-red-100 text-red-700">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2%
              </Badge>
            </div>
            <CardTitle className="text-sm text-gray-600 mt-4">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-gray-900 mb-2">
              TZS {(financialSummary.totalExpenses / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-600">
              This {timeRange}
            </p>
          </CardContent>
        </Card>

        {/* Net Profit */}
        <Card className="border-2 border-blue-200 hover:shadow-xl transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +{financialSummary.profitChange.toFixed(1)}%
              </Badge>
            </div>
            <CardTitle className="text-sm text-gray-600 mt-4">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-gray-900 mb-2">
              TZS {(financialSummary.netProfit / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-600">
              Profit margin: {((financialSummary.netProfit / financialSummary.totalIncome) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Income & Expense Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Income Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-600" />
              Income Breakdown
            </CardTitle>
            <CardDescription>Where your income comes from</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {incomeCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Icon className="h-4 w-4 text-green-700" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        TZS {(cat.amount / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-xs text-gray-600">{cat.percentage}%</p>
                    </div>
                  </div>
                  <Progress value={cat.percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-red-600" />
              Expense Breakdown
            </CardTitle>
            <CardDescription>Where your money goes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {expenseCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Icon className="h-4 w-4 text-red-700" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        TZS {(cat.amount / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-xs text-gray-600">{cat.percentage}%</p>
                    </div>
                  </div>
                  <Progress value={cat.percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Budget Goals */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Budget Goals
          </CardTitle>
          <CardDescription>Track spending against your budget</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {budgetGoals.map((goal, idx) => {
            const percentageSpent = (goal.spent / goal.budget) * 100;
            const isOverBudget = percentageSpent > 90;
            
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{goal.category}</p>
                    <p className="text-xs text-gray-600">
                      TZS {(goal.spent / 1000000).toFixed(2)}M of {(goal.budget / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                      {percentageSpent.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-600">
                      TZS {(goal.remaining / 1000000).toFixed(2)}M left
                    </p>
                  </div>
                </div>
                <Progress 
                  value={percentageSpent} 
                  className={`h-2 ${isOverBudget ? 'bg-red-100' : ''}`} 
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-gray-600" />
              Recent Transactions
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-lg
                    ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}
                  `}>
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-600">{transaction.category}</p>
                      <span className="text-gray-400">•</span>
                      <p className="text-xs text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`
                    font-bold text-sm
                    ${transaction.type === "income" ? "text-green-600" : "text-red-600"}
                  `}>
                    {transaction.type === "income" ? "+" : "-"}TZS {(transaction.amount / 1000).toFixed(0)}k
                  </p>
                  <Badge
                    variant="secondary"
                    className={`
                      text-xs mt-1
                      ${transaction.status === "completed" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >
                    {transaction.status === "completed" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}