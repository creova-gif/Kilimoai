import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Shield,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

interface PlatformStats {
  totalWallets: number;
  totalBalance: number;
  totalEscrow: number;
  totalRevenue: number;
  totalFees: number;
  averageBalance: number;
  transactionVolume24h: number;
  activeUsersToday: number;
}

interface EscrowReport {
  totalHeld: number;
  orderCount: number;
  oldestEscrow: string | null;
  escrowOrders: Array<{ orderId: string; amount: number; heldSince: string }>;
}

interface FinancialReport {
  period: string;
  reportType: string;
  totalRevenue: number;
  totalFees: number;
  totalEscrow: number;
  totalRefunds: number;
  totalDeposits: number;
  totalWithdrawals: number;
  transactionCount: number;
  activeUsers: number;
}

interface TransactionTrend {
  date: string;
  deposits: number;
  withdrawals: number;
  transfers: number;
  transactionCount: number;
}

interface TopUser {
  userId: string;
  balance: number;
  lastActivity: string;
}

interface IntegrityCheck {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalTransactions: number;
    totalEntries: number;
    balancedTransactions: number;
    unbalancedTransactions: number;
  };
}

interface WalletAdminDashboardProps {
  language: 'en' | 'sw';
  user?: {
    role?: string;
    tier?: string;
  };
}

export default function WalletAdminDashboard({ language, user }: WalletAdminDashboardProps) {
  // Check if user has admin access
  const isAdmin = user?.role === 'commercial_farm_admin' || 
                  user?.role === 'agribusiness_ops' || 
                  user?.tier === 'enterprise';
  
  // Bilingual translations
  const text = {
    // Header
    title: language === 'en' ? 'Wallet Admin Dashboard' : 'Dashibodi ya Msimamizi wa Mkoba',
    subtitle: language === 'en' ? 'Monitor and manage platform wallet operations' : 'Fuatilia na simamia shughuli za mkoba wa jukwaa',
    refresh: language === 'en' ? 'Refresh' : 'Onyesha Upya',
    
    // Platform Stats
    totalBalance: language === 'en' ? 'Total Balance' : 'Jumla ya Salio',
    escrowHoldings: language === 'en' ? 'Escrow Holdings' : 'Fedha Zilizohifadhiwa',
    totalRevenue: language === 'en' ? 'Total Revenue' : 'Jumla ya Mapato',
    volume24h: language === 'en' ? '24h Volume' : 'Kiasi cha Masaa 24',
    activeWallets: language === 'en' ? 'active wallets' : 'mikoba hai',
    ordersInEscrow: language === 'en' ? 'orders in escrow' : 'maagizo katika hifadhi',
    inFees: language === 'en' ? 'in fees' : 'katika ada',
    activeUsers: language === 'en' ? 'active users' : 'watumiaji hai',
    
    // Tabs
    transactionTrends: language === 'en' ? 'Transaction Trends' : 'Mwenendo wa Miamala',
    escrowManagement: language === 'en' ? 'Escrow Management' : 'Usimamizi wa Hifadhi',
    topUsers: language === 'en' ? 'Top Users' : 'Watumiaji Wakuu',
    systemIntegrity: language === 'en' ? 'System Integrity' : 'Uadilifu wa Mfumo',
    
    // Transaction Trends
    transactions: language === 'en' ? 'transactions' : 'miamala',
    last7Days: language === 'en' ? 'Last 7 days' : 'Siku 7 zilizopita',
    last14Days: language === 'en' ? 'Last 14 days' : 'Siku 14 zilizopita',
    last30Days: language === 'en' ? 'Last 30 days' : 'Siku 30 zilizopita',
    deposits: language === 'en' ? 'Deposits' : 'Amana',
    withdrawals: language === 'en' ? 'Withdrawals' : 'Utoaji',
    transfers: language === 'en' ? 'Transfers' : 'Uhamisho',
    
    // Financial Summary
    monthlyFinancialSummary: language === 'en' ? 'Monthly Financial Summary' : 'Muhtasari wa Fedha wa Kila Mwezi',
    totalDeposits: language === 'en' ? 'Total Deposits' : 'Jumla ya Amana',
    totalWithdrawals: language === 'en' ? 'Total Withdrawals' : 'Jumla ya Utoaji',
    totalRefunds: language === 'en' ? 'Total Refunds' : 'Jumla ya Marejesho',
    
    // Escrow
    totalHeld: language === 'en' ? 'Total Held' : 'Jumla Iliyoshikiliwa',
    ordersCount: language === 'en' ? 'Orders Count' : 'Idadi ya Maagizo',
    oldestEscrow: language === 'en' ? 'Oldest Escrow' : 'Hifadhi ya Zamani',
    activeEscrowOrders: language === 'en' ? 'Active Escrow Orders' : 'Maagizo ya Hifadhi Yanayoendelea',
    heldSince: language === 'en' ? 'Held since' : 'Imeshikiliwa tangu',
    notAvailable: language === 'en' ? 'N/A' : 'Hakuna',
    
    // Top Users
    topUsersByBalance: language === 'en' ? 'Top Users by Balance' : 'Watumiaji Wakuu kwa Salio',
    lastActive: language === 'en' ? 'Last active' : 'Uliotumia mwisho',
    
    // Integrity
    ledgerIntegrityCheck: language === 'en' ? 'Ledger Integrity Check' : 'Ukaguzi wa Uadilifu wa Daftari',
    runCheck: language === 'en' ? 'Run Check' : 'Fanya Ukaguzi',
    systemIntegrityPassed: language === 'en' ? 'System Integrity: PASSED' : 'Uadilifu wa Mfumo: UMEPITA',
    systemIntegrityIssues: language === 'en' ? 'System Integrity: ISSUES FOUND' : 'Uadilifu wa Mfumo: MATATIZO YAMEPATIKANA',
    totalTransactions: language === 'en' ? 'Total Transactions' : 'Jumla ya Miamala',
    totalEntries: language === 'en' ? 'Total Entries' : 'Jumla ya Maingizo',
    balanced: language === 'en' ? 'Balanced' : 'Imesawazishwa',
    unbalanced: language === 'en' ? 'Unbalanced' : 'Haijasawazishwa',
    errors: language === 'en' ? 'Errors' : 'Makosa',
    warnings: language === 'en' ? 'Warnings' : 'Onyo',
    
    // Access Control
    accessDenied: language === 'en' ? 'Access Denied' : 'Ufikiaji Umekataliwa',
    adminAccessRequired: language === 'en' ? 'Administrator access is required to view this dashboard.' : 'Ufikiaji wa msimamizi unahitajika kuona dashibodi hii.',
  };

  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [escrowReport, setEscrowReport] = useState<EscrowReport | null>(null);
  const [financialReport, setFinancialReport] = useState<FinancialReport | null>(null);
  const [trends, setTrends] = useState<TransactionTrend[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [integrity, setIntegrity] = useState<IntegrityCheck | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('7');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPlatformStats(),
        loadEscrowReport(),
        loadFinancialReport(),
        loadTrends(),
        loadTopUsers(),
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlatformStats = async () => {
    try {
      const response = await fetch(`${API_URL}/wallet/platform-stats`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setPlatformStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading platform stats:', error);
    }
  };

  const loadEscrowReport = async () => {
    try {
      const response = await fetch(`${API_URL}/wallet/escrow-report`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setEscrowReport(data.escrow);
      }
    } catch (error) {
      console.error('Error loading escrow report:', error);
    }
  };

  const loadFinancialReport = async () => {
    try {
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const response = await fetch(`${API_URL}/wallet/report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate, endDate, reportType: 'monthly' }),
      });
      const data = await response.json();
      if (data.success) {
        setFinancialReport(data.report);
      }
    } catch (error) {
      console.error('Error loading financial report:', error);
    }
  };

  const loadTrends = async () => {
    try {
      const response = await fetch(`${API_URL}/wallet/trends?days=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTrends(data.trends);
      }
    } catch (error) {
      console.error('Error loading trends:', error);
    }
  };

  const loadTopUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/wallet/top-users?limit=10`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTopUsers(data.topUsers);
      }
    } catch (error) {
      console.error('Error loading top users:', error);
    }
  };

  const validateIntegrity = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/wallet/validate-integrity`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const data = await response.json();
      setIntegrity(data);
    } catch (error) {
      console.error('Error validating integrity:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // RBAC Check - Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <Alert variant="destructive" className="max-w-md">
          <Lock className="w-4 h-4" />
          <AlertDescription>
            <strong>{text.accessDenied}</strong>
            <p className="mt-1">{text.adminAccessRequired}</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{text.title}</h1>
            <p className="text-gray-600 mt-1">{text.subtitle}</p>
          </div>
          <Button onClick={loadDashboardData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {text.refresh}
          </Button>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{text.totalBalance}</p>
                <p className="text-2xl font-bold text-green-600">
                  {platformStats ? formatCurrency(platformStats.totalBalance) : '...'}
                </p>
              </div>
              <Wallet className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {platformStats?.totalWallets || 0} {text.activeWallets}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{text.escrowHoldings}</p>
                <p className="text-2xl font-bold text-green-600">
                  {platformStats ? formatCurrency(platformStats.totalEscrow) : '...'}
                </p>
              </div>
              <Shield className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {escrowReport?.orderCount || 0} {text.ordersInEscrow}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{text.totalRevenue}</p>
                <p className="text-2xl font-bold text-green-600">
                  {platformStats ? formatCurrency(platformStats.totalRevenue) : '...'}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {platformStats ? formatCurrency(platformStats.totalFees) : '0'} {text.inFees}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{text.volume24h}</p>
                <p className="text-2xl font-bold text-green-600">
                  {platformStats ? formatCurrency(platformStats.transactionVolume24h) : '...'}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {platformStats?.activeUsersToday || 0} {text.activeUsers}
            </p>
          </Card>
        </div>

        {/* Tabs for Different Sections */}
        <Tabs defaultValue="trends" className="w-full">
          <TabsList>
            <TabsTrigger value="trends">{text.transactionTrends}</TabsTrigger>
            <TabsTrigger value="escrow">{text.escrowManagement}</TabsTrigger>
            <TabsTrigger value="top-users">{text.topUsers}</TabsTrigger>
            <TabsTrigger value="integrity">{text.systemIntegrity}</TabsTrigger>
          </TabsList>

          {/* Transaction Trends */}
          <TabsContent value="trends" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{text.transactionTrends}</h3>
                <select
                  value={selectedPeriod}
                  onChange={(e) => {
                    setSelectedPeriod(e.target.value);
                    loadTrends();
                  }}
                  className="px-3 py-1 border rounded"
                >
                  <option value="7">{text.last7Days}</option>
                  <option value="14">{text.last14Days}</option>
                  <option value="30">{text.last30Days}</option>
                </select>
              </div>

              <div className="space-y-3">
                {trends.map((trend) => (
                  <div key={trend.date} className="border-b pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{formatDate(trend.date)}</span>
                      <Badge variant="outline">{trend.transactionCount} {text.transactions}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                        <span>{text.deposits}: {formatCurrency(trend.deposits)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                        <span>{text.withdrawals}: {formatCurrency(trend.withdrawals)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{text.transfers}: {formatCurrency(trend.transfers)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {financialReport && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">{text.monthlyFinancialSummary}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{text.totalDeposits}</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(financialReport.totalDeposits)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{text.totalWithdrawals}</p>
                    <p className="text-xl font-bold text-red-600">
                      {formatCurrency(financialReport.totalWithdrawals)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{text.totalRefunds}</p>
                    <p className="text-xl font-bold text-gray-700">
                      {formatCurrency(financialReport.totalRefunds)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{text.activeUsers}</p>
                    <p className="text-xl font-bold text-gray-700">
                      {financialReport.activeUsers}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Escrow Management */}
          <TabsContent value="escrow" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">{text.escrowManagement}</h3>
              {escrowReport && (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">{text.totalHeld}</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(escrowReport.totalHeld)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{text.ordersCount}</p>
                      <p className="text-2xl font-bold">{escrowReport.orderCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{text.oldestEscrow}</p>
                      <p className="text-sm font-medium">
                        {escrowReport.oldestEscrow ? formatDate(escrowReport.oldestEscrow) : text.notAvailable}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">{text.activeEscrowOrders}</h4>
                    {escrowReport.escrowOrders.slice(0, 10).map((order) => (
                      <div
                        key={order.orderId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="font-medium text-sm">{order.orderId}</p>
                          <p className="text-xs text-gray-500">{text.heldSince} {formatDate(order.heldSince)}</p>
                        </div>
                        <Badge variant="outline">{formatCurrency(order.amount)}</Badge>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </TabsContent>

          {/* Top Users */}
          <TabsContent value="top-users" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">{text.topUsersByBalance}</h3>
              <div className="space-y-2">
                {topUsers.map((user, index) => (
                  <div
                    key={user.userId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-green-700">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.userId.substring(0, 12)}...</p>
                        <p className="text-xs text-gray-500">
                          {text.lastActive}: {formatDate(user.lastActivity)}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      {formatCurrency(user.balance)}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* System Integrity */}
          <TabsContent value="integrity" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{text.ledgerIntegrityCheck}</h3>
                <Button onClick={validateIntegrity} disabled={loading}>
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  {text.runCheck}
                </Button>
              </div>

              {integrity && (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded ${
                      integrity.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {integrity.valid ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <p className={`font-semibold ${integrity.valid ? 'text-green-700' : 'text-red-700'}`}>
                        {integrity.valid ? text.systemIntegrityPassed : text.systemIntegrityIssues}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">{text.totalTransactions}</p>
                      <p className="text-xl font-bold">{integrity.stats.totalTransactions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{text.totalEntries}</p>
                      <p className="text-xl font-bold">{integrity.stats.totalEntries}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{text.balanced}</p>
                      <p className="text-xl font-bold text-green-600">
                        {integrity.stats.balancedTransactions}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{text.unbalanced}</p>
                      <p className="text-xl font-bold text-red-600">
                        {integrity.stats.unbalancedTransactions}
                      </p>
                    </div>
                  </div>

                  {integrity.errors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-red-700">{text.errors}</h4>
                      {integrity.errors.map((error, index) => (
                        <div key={index} className="p-2 bg-red-50 rounded text-sm text-red-700">
                          {error}
                        </div>
                      ))}
                    </div>
                  )}

                  {integrity.warnings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-orange-700">{text.warnings}</h4>
                      {integrity.warnings.map((warning, index) => (
                        <div key={index} className="p-2 bg-orange-50 rounded text-sm text-orange-700">
                          {warning}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}