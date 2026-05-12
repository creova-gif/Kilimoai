/**
 * KILIMO WALLET ADVANCED FEATURES
 * ================================
 * 
 * Enhanced wallet functionality including:
 * - Transaction limits (daily/monthly)
 * - Financial reports (revenue, fees, escrow)
 * - Admin ledger viewing
 * - Testing and validation
 * - Analytics and insights
 */

import * as kv from "./kv_store.tsx";
import * as walletLedger from "./wallet_ledger.tsx";

// ==================== TRANSACTION LIMITS ====================

export interface TransactionLimit {
  userId: string;
  limitType: "daily" | "monthly" | "perTransaction";
  amount: number;
  period: string; // "2026-01-26" for daily, "2026-01" for monthly
  spent: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Set transaction limit for a user
 */
export async function setTransactionLimit(
  userId: string,
  limitType: "daily" | "monthly" | "perTransaction",
  amount: number
): Promise<void> {
  const limitKey = `limit:${userId}:${limitType}`;
  const period = limitType === "daily" 
    ? new Date().toISOString().split("T")[0]
    : new Date().toISOString().substring(0, 7);
  
  const limit: TransactionLimit = {
    userId,
    limitType,
    amount,
    period,
    spent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(limitKey, limit);
}

/**
 * Check if transaction exceeds limit
 */
export async function checkTransactionLimit(
  userId: string,
  amount: number
): Promise<{ allowed: boolean; reason?: string; limit?: TransactionLimit }> {
  // Check per-transaction limit
  const perTxLimitKey = `limit:${userId}:perTransaction`;
  const perTxLimit = await kv.get(perTxLimitKey);
  
  if (perTxLimit && amount > perTxLimit.amount) {
    return {
      allowed: false,
      reason: `Transaction amount (${amount}) exceeds per-transaction limit (${perTxLimit.amount})`,
      limit: perTxLimit,
    };
  }
  
  // Check daily limit
  const today = new Date().toISOString().split("T")[0];
  const dailyLimitKey = `limit:${userId}:daily`;
  let dailyLimit = await kv.get(dailyLimitKey);
  
  // Reset daily limit if new day
  if (dailyLimit && dailyLimit.period !== today) {
    dailyLimit.spent = 0;
    dailyLimit.period = today;
    dailyLimit.updatedAt = new Date().toISOString();
    await kv.set(dailyLimitKey, dailyLimit);
  }
  
  if (dailyLimit && (dailyLimit.spent + amount) > dailyLimit.amount) {
    return {
      allowed: false,
      reason: `Daily limit exceeded: ${dailyLimit.spent + amount} / ${dailyLimit.amount}`,
      limit: dailyLimit,
    };
  }
  
  // Check monthly limit
  const thisMonth = new Date().toISOString().substring(0, 7);
  const monthlyLimitKey = `limit:${userId}:monthly`;
  let monthlyLimit = await kv.get(monthlyLimitKey);
  
  // Reset monthly limit if new month
  if (monthlyLimit && monthlyLimit.period !== thisMonth) {
    monthlyLimit.spent = 0;
    monthlyLimit.period = thisMonth;
    monthlyLimit.updatedAt = new Date().toISOString();
    await kv.set(monthlyLimitKey, monthlyLimit);
  }
  
  if (monthlyLimit && (monthlyLimit.spent + amount) > monthlyLimit.amount) {
    return {
      allowed: false,
      reason: `Monthly limit exceeded: ${monthlyLimit.spent + amount} / ${monthlyLimit.amount}`,
      limit: monthlyLimit,
    };
  }
  
  return { allowed: true };
}

/**
 * Update spent amount for limits
 */
export async function updateLimitSpending(
  userId: string,
  amount: number
): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const thisMonth = new Date().toISOString().substring(0, 7);
  
  // Update daily limit
  const dailyLimitKey = `limit:${userId}:daily`;
  const dailyLimit = await kv.get(dailyLimitKey);
  if (dailyLimit) {
    if (dailyLimit.period !== today) {
      dailyLimit.spent = amount;
      dailyLimit.period = today;
    } else {
      dailyLimit.spent += amount;
    }
    dailyLimit.updatedAt = new Date().toISOString();
    await kv.set(dailyLimitKey, dailyLimit);
  }
  
  // Update monthly limit
  const monthlyLimitKey = `limit:${userId}:monthly`;
  const monthlyLimit = await kv.get(monthlyLimitKey);
  if (monthlyLimit) {
    if (monthlyLimit.period !== thisMonth) {
      monthlyLimit.spent = amount;
      monthlyLimit.period = thisMonth;
    } else {
      monthlyLimit.spent += amount;
    }
    monthlyLimit.updatedAt = new Date().toISOString();
    await kv.set(monthlyLimitKey, monthlyLimit);
  }
}

/**
 * Get all limits for a user
 */
export async function getUserLimits(userId: string): Promise<TransactionLimit[]> {
  const limits: TransactionLimit[] = [];
  
  const dailyLimit = await kv.get(`limit:${userId}:daily`);
  if (dailyLimit) limits.push(dailyLimit);
  
  const monthlyLimit = await kv.get(`limit:${userId}:monthly`);
  if (monthlyLimit) limits.push(monthlyLimit);
  
  const perTxLimit = await kv.get(`limit:${userId}:perTransaction`);
  if (perTxLimit) limits.push(perTxLimit);
  
  return limits;
}

// ==================== FINANCIAL REPORTS ====================

export interface FinancialReport {
  period: string; // "2026-01-26" for daily, "2026-01" for monthly
  reportType: "daily" | "monthly" | "custom";
  totalRevenue: number;
  totalFees: number;
  totalEscrow: number;
  totalRefunds: number;
  totalDeposits: number;
  totalWithdrawals: number;
  transactionCount: number;
  activeUsers: number;
  generatedAt: string;
}

/**
 * Generate financial report for a period
 */
export async function generateFinancialReport(
  startDate: string,
  endDate: string,
  reportType: "daily" | "monthly" | "custom" = "daily"
): Promise<FinancialReport> {
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();
  
  // Get revenue balance
  const revenueBalance = await walletLedger.getAccountBalance(
    walletLedger.AccountType.REVENUE,
    "platform"
  );
  
  // Get fees balance
  const feesBalance = await walletLedger.getAccountBalance(
    walletLedger.AccountType.FEES,
    "platform"
  );
  
  // Get all ledger entries in period
  const allLedgers = await kv.getByPrefix("ledger:");
  const periodEntries = (allLedgers || []).filter((entry: any) => {
    const entryTime = new Date(entry.timestamp).getTime();
    return entryTime >= startTime && entryTime <= endTime;
  });
  
  // Calculate metrics
  let totalDeposits = 0;
  let totalWithdrawals = 0;
  let totalRefunds = 0;
  let totalEscrow = 0;
  const uniqueUsers = new Set<string>();
  
  for (const entry of periodEntries) {
    if (entry.accountType === walletLedger.AccountType.WALLET) {
      uniqueUsers.add(entry.accountId);
    }
    
    if (entry.transactionType === walletLedger.TransactionType.DEPOSIT) {
      totalDeposits += entry.amount;
    } else if (entry.transactionType === walletLedger.TransactionType.WITHDRAWAL) {
      totalWithdrawals += entry.amount;
    } else if (entry.transactionType === walletLedger.TransactionType.REFUND) {
      totalRefunds += entry.amount;
    } else if (entry.transactionType === walletLedger.TransactionType.ESCROW_HOLD) {
      totalEscrow += entry.amount;
    }
  }
  
  const report: FinancialReport = {
    period: reportType === "daily" ? startDate : startDate.substring(0, 7),
    reportType,
    totalRevenue: revenueBalance,
    totalFees: feesBalance,
    totalEscrow: totalEscrow,
    totalRefunds: totalRefunds,
    totalDeposits: totalDeposits,
    totalWithdrawals: totalWithdrawals,
    transactionCount: periodEntries.length / 2, // Divide by 2 for double-entry
    activeUsers: uniqueUsers.size,
    generatedAt: new Date().toISOString(),
  };
  
  // Store report
  const reportKey = `report:${reportType}:${report.period}`;
  await kv.set(reportKey, report);
  
  return report;
}

/**
 * Get revenue breakdown by source
 */
export async function getRevenueBreakdown(
  startDate: string,
  endDate: string
): Promise<{
  gatewayFees: number;
  withdrawalFees: number;
  platformFees: number;
  total: number;
}> {
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();
  
  const allFeeEntries = await kv.getByPrefix(`ledger:`);
  const periodFees = (allFeeEntries || []).filter((entry: any) => {
    const entryTime = new Date(entry.timestamp).getTime();
    return entryTime >= startTime && 
           entryTime <= endTime && 
           entry.accountType === walletLedger.AccountType.FEES;
  });
  
  let gatewayFees = 0;
  let withdrawalFees = 0;
  let platformFees = 0;
  
  for (const entry of periodFees) {
    if (entry.transactionType === walletLedger.TransactionType.WITHDRAWAL) {
      withdrawalFees += entry.amount;
    } else if (entry.metadata?.gateway) {
      gatewayFees += entry.amount;
    } else {
      platformFees += entry.amount;
    }
  }
  
  return {
    gatewayFees,
    withdrawalFees,
    platformFees,
    total: gatewayFees + withdrawalFees + platformFees,
  };
}

/**
 * Get escrow report
 */
export async function getEscrowReport(): Promise<{
  totalHeld: number;
  orderCount: number;
  oldestEscrow: string | null;
  escrowOrders: Array<{ orderId: string; amount: number; heldSince: string }>;
}> {
  const escrowEntries = await kv.getByPrefix(`balance:${walletLedger.AccountType.ESCROW}:`);
  
  let totalHeld = 0;
  let orderCount = 0;
  const escrowOrders: Array<{ orderId: string; amount: number; heldSince: string }> = [];
  let oldestTimestamp: string | null = null;
  
  for (const entry of escrowEntries || []) {
    if (entry.amount > 0) {
      totalHeld += entry.amount;
      orderCount++;
      escrowOrders.push({
        orderId: entry.accountId,
        amount: entry.amount,
        heldSince: entry.updatedAt,
      });
      
      if (!oldestTimestamp || entry.updatedAt < oldestTimestamp) {
        oldestTimestamp = entry.updatedAt;
      }
    }
  }
  
  return {
    totalHeld,
    orderCount,
    oldestEscrow: oldestTimestamp,
    escrowOrders: escrowOrders.sort((a, b) => b.amount - a.amount),
  };
}

// ==================== ADMIN ANALYTICS ====================

/**
 * Get platform-wide wallet statistics
 */
export async function getPlatformWalletStats(): Promise<{
  totalWallets: number;
  totalBalance: number;
  totalEscrow: number;
  totalRevenue: number;
  totalFees: number;
  averageBalance: number;
  transactionVolume24h: number;
  activeUsersToday: number;
}> {
  // Get all wallet balances
  const walletBalances = await kv.getByPrefix(`balance:${walletLedger.AccountType.WALLET}:`);
  
  let totalWallets = 0;
  let totalBalance = 0;
  
  for (const balance of walletBalances || []) {
    totalWallets++;
    totalBalance += balance.amount;
  }
  
  // Get escrow total
  const escrowReport = await getEscrowReport();
  
  // Get revenue and fees
  const totalRevenue = await walletLedger.getAccountBalance(
    walletLedger.AccountType.REVENUE,
    "platform"
  );
  
  const totalFees = await walletLedger.getAccountBalance(
    walletLedger.AccountType.FEES,
    "platform"
  );
  
  // Get 24h transaction volume
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const today = new Date().toISOString();
  const report24h = await generateFinancialReport(yesterday, today, "custom");
  
  return {
    totalWallets,
    totalBalance,
    totalEscrow: escrowReport.totalHeld,
    totalRevenue,
    totalFees,
    averageBalance: totalWallets > 0 ? totalBalance / totalWallets : 0,
    transactionVolume24h: report24h.totalDeposits + report24h.totalWithdrawals,
    activeUsersToday: report24h.activeUsers,
  };
}

/**
 * Get top users by wallet balance
 */
export async function getTopUsersByBalance(limit: number = 10): Promise<Array<{
  userId: string;
  balance: number;
  lastActivity: string;
}>> {
  const walletBalances = await kv.getByPrefix(`balance:${walletLedger.AccountType.WALLET}:`);
  
  const users = (walletBalances || []).map((balance: any) => ({
    userId: balance.accountId,
    balance: balance.amount,
    lastActivity: balance.updatedAt,
  }));
  
  users.sort((a, b) => b.balance - a.balance);
  
  return users.slice(0, limit);
}

/**
 * Get transaction volume trends
 */
export async function getTransactionTrends(days: number = 7): Promise<Array<{
  date: string;
  deposits: number;
  withdrawals: number;
  transfers: number;
  transactionCount: number;
}>> {
  const trends: Array<{
    date: string;
    deposits: number;
    withdrawals: number;
    transfers: number;
    transactionCount: number;
  }> = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    const nextDateStr = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    
    const report = await generateFinancialReport(dateStr, nextDateStr, "daily");
    
    trends.unshift({
      date: dateStr,
      deposits: report.totalDeposits,
      withdrawals: report.totalWithdrawals,
      transfers: report.transactionCount - report.totalDeposits - report.totalWithdrawals,
      transactionCount: report.transactionCount,
    });
  }
  
  return trends;
}

// ==================== TESTING UTILITIES ====================

/**
 * Create test transaction scenario
 */
export async function createTestScenario(
  userId: string,
  scenarioType: "deposit" | "withdrawal" | "transfer" | "payment" | "refund"
): Promise<walletLedger.LedgerTransaction> {
  const testAmount = Math.floor(Math.random() * 10000) + 1000;
  
  switch (scenarioType) {
    case "deposit":
      return await walletLedger.recordDeposit(
        userId,
        testAmount,
        "TEST_GATEWAY",
        `TEST-${Date.now()}`,
        "TEST"
      );
    
    case "withdrawal":
      return await walletLedger.recordWithdrawal(
        userId,
        testAmount,
        500, // Fee
        "+255700000000",
        "TEST_PROVIDER",
        `TEST-${Date.now()}`
      );
    
    case "transfer":
      return await walletLedger.recordTransfer(
        userId,
        "test-user-2",
        testAmount,
        "Test transfer"
      );
    
    case "payment":
      return await walletLedger.recordPayment(
        userId,
        "test-seller",
        testAmount,
        `TEST-ORDER-${Date.now()}`,
        true, // Use escrow
        "Test payment"
      );
    
    case "refund":
      // First create a payment, then refund it
      const payment = await walletLedger.recordPayment(
        userId,
        "test-seller",
        testAmount,
        `TEST-ORDER-${Date.now()}`,
        true,
        "Test payment for refund"
      );
      
      return await walletLedger.recordRefund(
        userId,
        "test-seller",
        testAmount,
        payment.metadata.orderId,
        payment.id,
        "Test refund"
      );
    
    default:
      throw new Error("Invalid scenario type");
  }
}

/**
 * Validate ledger integrity
 */
export async function validateLedgerIntegrity(): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalTransactions: number;
    totalEntries: number;
    balancedTransactions: number;
    unbalancedTransactions: number;
  };
}> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Get all transactions
  const allTransactions = await kv.getByPrefix("transaction:");
  let totalTransactions = 0;
  let totalEntries = 0;
  let balancedTransactions = 0;
  let unbalancedTransactions = 0;
  
  for (const tx of allTransactions || []) {
    if (!tx.entries || tx.entries.length === 0) {
      continue; // Skip legacy transactions
    }
    
    totalTransactions++;
    totalEntries += tx.entries.length;
    
    // Verify double-entry: sum of debits should equal sum of credits
    let debitSum = 0;
    let creditSum = 0;
    
    for (const entry of tx.entries) {
      if (entry.side === walletLedger.EntrySide.DEBIT) {
        debitSum += entry.amount;
      } else {
        creditSum += entry.amount;
      }
    }
    
    if (Math.abs(debitSum - creditSum) < 0.01) {
      balancedTransactions++;
    } else {
      unbalancedTransactions++;
      errors.push(
        `Transaction ${tx.id} is unbalanced: debits=${debitSum}, credits=${creditSum}`
      );
    }
  }
  
  // Verify wallet balances match ledger balances
  const wallets = await kv.getByPrefix("wallet:");
  for (const wallet of wallets || []) {
    const ledgerBalance = await walletLedger.getAccountBalance(
      walletLedger.AccountType.WALLET,
      wallet.userId
    );
    
    const difference = Math.abs(wallet.balance - ledgerBalance);
    if (difference > 0.01) {
      warnings.push(
        `User ${wallet.userId} wallet mismatch: wallet=${wallet.balance}, ledger=${ledgerBalance}`
      );
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalTransactions,
      totalEntries,
      balancedTransactions,
      unbalancedTransactions,
    },
  };
}

/**
 * Run comprehensive test suite
 */
export async function runTestSuite(testUserId: string): Promise<{
  success: boolean;
  results: Array<{ test: string; passed: boolean; message: string }>;
}> {
  const results: Array<{ test: string; passed: boolean; message: string }> = [];
  
  try {
    // Test 1: Deposit
    const deposit = await createTestScenario(testUserId, "deposit");
    results.push({
      test: "Deposit",
      passed: deposit.status === "completed",
      message: `Deposited ${deposit.metadata.amount} TZS`,
    });
    
    // Test 2: Check balance
    const balance = await walletLedger.getAccountBalance(
      walletLedger.AccountType.WALLET,
      testUserId
    );
    results.push({
      test: "Balance Check",
      passed: balance > 0,
      message: `Balance: ${balance} TZS`,
    });
    
    // Test 3: Transfer
    const transfer = await createTestScenario(testUserId, "transfer");
    results.push({
      test: "Transfer",
      passed: transfer.status === "completed",
      message: `Transferred ${transfer.metadata.amount} TZS`,
    });
    
    // Test 4: Payment with escrow
    const payment = await createTestScenario(testUserId, "payment");
    results.push({
      test: "Payment (Escrow)",
      passed: payment.status === "completed",
      message: `Payment ${payment.metadata.amount} TZS held in escrow`,
    });
    
    // Test 5: Refund
    const refund = await createTestScenario(testUserId, "refund");
    results.push({
      test: "Refund",
      passed: refund.status === "completed",
      message: `Refunded ${refund.metadata.amount} TZS`,
    });
    
    // Test 6: Reconciliation
    const reconcile = await walletLedger.reconcileWalletBalance(testUserId);
    results.push({
      test: "Reconciliation",
      passed: reconcile.balanced,
      message: `Ledger=${reconcile.ledgerBalance}, Wallet=${reconcile.walletBalance}`,
    });
    
    // Test 7: Ledger integrity
    const integrity = await validateLedgerIntegrity();
    results.push({
      test: "Ledger Integrity",
      passed: integrity.valid,
      message: `${integrity.stats.balancedTransactions}/${integrity.stats.totalTransactions} balanced`,
    });
    
    const allPassed = results.every(r => r.passed);
    
    return {
      success: allPassed,
      results,
    };
  } catch (error: any) {
    results.push({
      test: "Test Suite",
      passed: false,
      message: `Error: ${error.message}`,
    });
    
    return {
      success: false,
      results,
    };
  }
}
