/**
 * KILIMO WALLET LEDGER SYSTEM
 * ===========================
 * 
 * Double-entry bookkeeping system for accurate transaction tracking.
 * Every monetary flow creates TWO ledger entries (debit + credit).
 * 
 * PRINCIPLES:
 * - Assets (wallet balance) increase with DEBIT, decrease with CREDIT
 * - Every transaction has matching debit and credit entries
 * - Running balance maintained for audit trail
 * - Immutable ledger entries (no updates, only new entries)
 * - Refunds create reversing entries
 * 
 * LEDGER STRUCTURE:
 * - Main ledger: All entries with running balance
 * - User ledger: User-specific transaction history
 * - Account types: WALLET, ESCROW, REVENUE, FEES, REFUNDS
 */

import * as kv from "./kv_store.tsx";

// Account types in the ledger
export enum AccountType {
  WALLET = "WALLET",           // User wallet balance
  ESCROW = "ESCROW",           // Held funds for marketplace
  REVENUE = "REVENUE",         // Platform revenue
  FEES = "FEES",               // Transaction fees
  REFUNDS = "REFUNDS",         // Refund pool
  PENDING = "PENDING",         // Pending deposits/withdrawals
  EXTERNAL = "EXTERNAL",       // External payment gateways
}

// Transaction types
export enum TransactionType {
  DEPOSIT = "DEPOSIT",                 // Add funds to wallet
  WITHDRAWAL = "WITHDRAWAL",           // Remove funds from wallet
  TRANSFER = "TRANSFER",               // P2P transfer
  PAYMENT = "PAYMENT",                 // Payment for goods/services
  REFUND = "REFUND",                   // Money returned
  FEE = "FEE",                         // Transaction fee
  ESCROW_HOLD = "ESCROW_HOLD",        // Move to escrow
  ESCROW_RELEASE = "ESCROW_RELEASE",  // Release from escrow
  REVERSAL = "REVERSAL",              // Transaction reversal
}

// Entry side (debit or credit)
export enum EntrySide {
  DEBIT = "DEBIT",   // Increase asset accounts (wallets)
  CREDIT = "CREDIT", // Decrease asset accounts (wallets)
}

// Ledger entry structure
export interface LedgerEntry {
  id: string;                      // Unique entry ID
  transactionId: string;           // Links related entries
  timestamp: string;               // ISO timestamp
  accountType: AccountType;        // Which account is affected
  accountId: string;               // User ID or account identifier
  side: EntrySide;                 // DEBIT or CREDIT
  amount: number;                  // Amount in TZS
  runningBalance: number;          // Balance after this entry
  transactionType: TransactionType;
  description: string;
  metadata?: {
    paymentMethod?: string;
    paymentRef?: string;
    orderId?: string;
    relatedUserId?: string;
    gateway?: string;
    feeAmount?: number;
    originalTransactionId?: string; // For refunds/reversals
  };
}

// Transaction record (groups related ledger entries)
export interface LedgerTransaction {
  id: string;
  type: TransactionType;
  timestamp: string;
  entries: LedgerEntry[];
  status: "pending" | "completed" | "failed" | "reversed";
  description: string;
  metadata?: any;
}

/**
 * Generate unique transaction ID
 */
export function generateTransactionId(type: TransactionType): string {
  const prefix = type.substring(0, 3).toUpperCase();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Get current balance for an account
 */
export async function getAccountBalance(
  accountType: AccountType,
  accountId: string
): Promise<number> {
  const balanceKey = `balance:${accountType}:${accountId}`;
  const balance = await kv.get(balanceKey);
  return balance?.amount || 0;
}

/**
 * Update account balance
 */
async function updateAccountBalance(
  accountType: AccountType,
  accountId: string,
  amount: number,
  operation: "add" | "subtract"
): Promise<number> {
  const balanceKey = `balance:${accountType}:${accountId}`;
  const currentBalance = await getAccountBalance(accountType, accountId);
  
  const newBalance = operation === "add" 
    ? currentBalance + amount 
    : currentBalance - amount;
  
  await kv.set(balanceKey, {
    accountType,
    accountId,
    amount: newBalance,
    updatedAt: new Date().toISOString(),
  });
  
  return newBalance;
}

/**
 * Create a ledger entry
 */
async function createLedgerEntry(
  transactionId: string,
  accountType: AccountType,
  accountId: string,
  side: EntrySide,
  amount: number,
  transactionType: TransactionType,
  description: string,
  metadata?: any
): Promise<LedgerEntry> {
  const entryId = `${transactionId}-${crypto.randomUUID().substring(0, 8)}`;
  
  // Calculate new balance
  const operation = side === EntrySide.DEBIT ? "add" : "subtract";
  const runningBalance = await updateAccountBalance(accountType, accountId, amount, operation);
  
  const entry: LedgerEntry = {
    id: entryId,
    transactionId,
    timestamp: new Date().toISOString(),
    accountType,
    accountId,
    side,
    amount,
    runningBalance,
    transactionType,
    description,
    metadata,
  };
  
  // Store in main ledger
  await kv.set(`ledger:${entryId}`, entry);
  
  // Store in user-specific ledger for quick retrieval
  if (accountType === AccountType.WALLET) {
    await kv.set(`user-ledger:${accountId}:${entryId}`, entry);
  }
  
  return entry;
}

/**
 * DEPOSIT: Add funds to wallet from external source
 * 
 * Debit: User Wallet (+)
 * Credit: External Account (-)
 */
export async function recordDeposit(
  userId: string,
  amount: number,
  paymentMethod: string,
  paymentRef: string,
  gateway?: string
): Promise<LedgerTransaction> {
  const transactionId = generateTransactionId(TransactionType.DEPOSIT);
  const description = `Deposit via ${paymentMethod}`;
  
  const entries: LedgerEntry[] = [];
  
  // Debit: User wallet increases
  entries.push(
    await createLedgerEntry(
      transactionId,
      AccountType.WALLET,
      userId,
      EntrySide.DEBIT,
      amount,
      TransactionType.DEPOSIT,
      description,
      { paymentMethod, paymentRef, gateway }
    )
  );
  
  // Credit: External account decreases (tracking only)
  entries.push(
    await createLedgerEntry(
      transactionId,
      AccountType.EXTERNAL,
      gateway || paymentMethod,
      EntrySide.CREDIT,
      amount,
      TransactionType.DEPOSIT,
      description,
      { paymentMethod, paymentRef, userId }
    )
  );
  
  const transaction: LedgerTransaction = {
    id: transactionId,
    type: TransactionType.DEPOSIT,
    timestamp: new Date().toISOString(),
    entries,
    status: "completed",
    description,
    metadata: { userId, amount, paymentMethod, paymentRef, gateway },
  };
  
  await kv.set(`transaction:${transactionId}`, transaction);
  await kv.set(`user-transaction:${userId}:${transactionId}`, transaction);
  
  return transaction;
}

/**
 * WITHDRAWAL: Remove funds from wallet to external account
 * 
 * Debit: External Account (+)
 * Credit: User Wallet (-)
 */
export async function recordWithdrawal(
  userId: string,
  amount: number,
  feeAmount: number,
  phoneNumber: string,
  provider: string,
  paymentRef?: string
): Promise<LedgerTransaction> {
  const transactionId = generateTransactionId(TransactionType.WITHDRAWAL);
  const description = `Withdrawal to ${provider}`;
  
  const entries: LedgerEntry[] = [];
  
  // Credit: User wallet decreases (amount + fee)
  entries.push(
    await createLedgerEntry(
      transactionId,
      AccountType.WALLET,
      userId,
      EntrySide.CREDIT,
      amount + feeAmount,
      TransactionType.WITHDRAWAL,
      description,
      { phoneNumber, provider, paymentRef, feeAmount }
    )
  );
  
  // Debit: External account increases (user receives this)
  entries.push(
    await createLedgerEntry(
      transactionId,
      AccountType.EXTERNAL,
      provider,
      EntrySide.DEBIT,
      amount,
      TransactionType.WITHDRAWAL,
      description,
      { userId, phoneNumber, paymentRef }
    )
  );
  
  // Debit: Fee account increases (platform keeps fee)
  if (feeAmount > 0) {
    entries.push(
      await createLedgerEntry(
        transactionId,
        AccountType.FEES,
        "platform",
        EntrySide.DEBIT,
        feeAmount,
        TransactionType.FEE,
        `Withdrawal fee for ${transactionId}`,
        { userId, originalAmount: amount }
      )
    );
  }
  
  const transaction: LedgerTransaction = {
    id: transactionId,
    type: TransactionType.WITHDRAWAL,
    timestamp: new Date().toISOString(),
    entries,
    status: "completed",
    description,
    metadata: { userId, amount, feeAmount, phoneNumber, provider, paymentRef },
  };
  
  await kv.set(`transaction:${transactionId}`, transaction);
  await kv.set(`user-transaction:${userId}:${transactionId}`, transaction);
  
  return transaction;
}

/**
 * TRANSFER: P2P transfer between users
 * 
 * Credit: Sender Wallet (-)
 * Debit: Recipient Wallet (+)
 */
export async function recordTransfer(
  fromUserId: string,
  toUserId: string,
  amount: number,
  description?: string
): Promise<LedgerTransaction> {
  const transactionId = generateTransactionId(TransactionType.TRANSFER);
  const desc = description || `Transfer from ${fromUserId} to ${toUserId}`;
  
  const entries: LedgerEntry[] = [];
  
  // Credit: Sender wallet decreases
  entries.push(
    await createLedgerEntry(
      transactionId,
      AccountType.WALLET,
      fromUserId,
      EntrySide.CREDIT,
      amount,
      TransactionType.TRANSFER,
      desc,
      { relatedUserId: toUserId }
    )
  );
  
  // Debit: Recipient wallet increases
  entries.push(
    await createLedgerEntry(
      transactionId,
      AccountType.WALLET,
      toUserId,
      EntrySide.DEBIT,
      amount,
      TransactionType.TRANSFER,
      desc,
      { relatedUserId: fromUserId }
    )
  );
  
  const transaction: LedgerTransaction = {
    id: transactionId,
    type: TransactionType.TRANSFER,
    timestamp: new Date().toISOString(),
    entries,
    status: "completed",
    description: desc,
    metadata: { fromUserId, toUserId, amount },
  };
  
  await kv.set(`transaction:${transactionId}`, transaction);
  await kv.set(`user-transaction:${fromUserId}:${transactionId}`, transaction);
  await kv.set(`user-transaction:${toUserId}:${transactionId}`, transaction);
  
  return transaction;
}

/**
 * PAYMENT: Payment for goods/services with optional escrow
 * 
 * Credit: Buyer Wallet (-)
 * Debit: Escrow/Seller Wallet (+)
 */
export async function recordPayment(
  buyerUserId: string,
  sellerUserId: string,
  amount: number,
  orderId: string,
  useEscrow: boolean = false,
  description?: string
): Promise<LedgerTransaction> {
  const transactionId = generateTransactionId(TransactionType.PAYMENT);
  const desc = description || `Payment for order ${orderId}`;
  
  const entries: LedgerEntry[] = [];
  
  // Credit: Buyer wallet decreases
  entries.push(
    await createLedgerEntry(
      transactionId,
      AccountType.WALLET,
      buyerUserId,
      EntrySide.CREDIT,
      amount,
      TransactionType.PAYMENT,
      desc,
      { relatedUserId: sellerUserId, orderId }
    )
  );
  
  if (useEscrow) {
    // Debit: Escrow holds the money
    entries.push(
      await createLedgerEntry(
        transactionId,
        AccountType.ESCROW,
        orderId,
        EntrySide.DEBIT,
        amount,
        TransactionType.ESCROW_HOLD,
        `Escrow for ${desc}`,
        { buyerUserId, sellerUserId, orderId }
      )
    );
  } else {
    // Debit: Seller wallet increases immediately
    entries.push(
      await createLedgerEntry(
        transactionId,
        AccountType.WALLET,
        sellerUserId,
        EntrySide.DEBIT,
        amount,
        TransactionType.PAYMENT,
        desc,
        { relatedUserId: buyerUserId, orderId }
      )
    );
  }
  
  const transaction: LedgerTransaction = {
    id: transactionId,
    type: TransactionType.PAYMENT,
    timestamp: new Date().toISOString(),
    entries,
    status: "completed",
    description: desc,
    metadata: { buyerUserId, sellerUserId, amount, orderId, useEscrow },
  };
  
  await kv.set(`transaction:${transactionId}`, transaction);
  await kv.set(`user-transaction:${buyerUserId}:${transactionId}`, transaction);
  await kv.set(`user-transaction:${sellerUserId}:${transactionId}`, transaction);
  
  return transaction;
}

/**
 * ESCROW RELEASE: Release funds from escrow to seller
 * 
 * Credit: Escrow (-)
 * Debit: Seller Wallet (+)
 */
export async function recordEscrowRelease(
  orderId: string,
  sellerUserId: string,
  amount: number,
  originalTransactionId: string
): Promise<LedgerTransaction> {
  const transactionId = generateTransactionId(TransactionType.ESCROW_RELEASE);
  const description = `Escrow release for order ${orderId}`;
  
  const entries: LedgerEntry[] = [];
  
  // Credit: Escrow decreases
  entries.push(
    await createLedgerEntry(
      transactionId,
      AccountType.ESCROW,
      orderId,
      EntrySide.CREDIT,
      amount,
      TransactionType.ESCROW_RELEASE,
      description,
      { sellerUserId, orderId, originalTransactionId }
    )
  );
  
  // Debit: Seller wallet increases
  entries.push(
    await createLedgerEntry(
      transactionId,
      AccountType.WALLET,
      sellerUserId,
      EntrySide.DEBIT,
      amount,
      TransactionType.ESCROW_RELEASE,
      description,
      { orderId, originalTransactionId }
    )
  );
  
  const transaction: LedgerTransaction = {
    id: transactionId,
    type: TransactionType.ESCROW_RELEASE,
    timestamp: new Date().toISOString(),
    entries,
    status: "completed",
    description,
    metadata: { orderId, sellerUserId, amount, originalTransactionId },
  };
  
  await kv.set(`transaction:${transactionId}`, transaction);
  await kv.set(`user-transaction:${sellerUserId}:${transactionId}`, transaction);
  
  return transaction;
}

/**
 * REFUND: Return money to buyer (reverses a payment)
 * 
 * Debit: Buyer Wallet (+)
 * Credit: Seller Wallet/Escrow (-)
 */
export async function recordRefund(
  buyerUserId: string,
  sellerUserId: string,
  amount: number,
  orderId: string,
  originalTransactionId: string,
  reason?: string
): Promise<LedgerTransaction> {
  const transactionId = generateTransactionId(TransactionType.REFUND);
  const description = `Refund for order ${orderId}${reason ? `: ${reason}` : ""}`;
  
  const entries: LedgerEntry[] = [];
  
  // Check if funds are in escrow or seller wallet
  const escrowBalance = await getAccountBalance(AccountType.ESCROW, orderId);
  const fromEscrow = escrowBalance >= amount;
  
  if (fromEscrow) {
    // Credit: Escrow decreases
    entries.push(
      await createLedgerEntry(
        transactionId,
        AccountType.ESCROW,
        orderId,
        EntrySide.CREDIT,
        amount,
        TransactionType.REFUND,
        description,
        { buyerUserId, sellerUserId, orderId, originalTransactionId }
      )
    );
  } else {
    // Credit: Seller wallet decreases
    entries.push(
      await createLedgerEntry(
        transactionId,
        AccountType.WALLET,
        sellerUserId,
        EntrySide.CREDIT,
        amount,
        TransactionType.REFUND,
        description,
        { buyerUserId, orderId, originalTransactionId }
      )
    );
  }
  
  // Debit: Buyer wallet increases
  entries.push(
    await createLedgerEntry(
      transactionId,
      AccountType.WALLET,
      buyerUserId,
      EntrySide.DEBIT,
      amount,
      TransactionType.REFUND,
      description,
      { sellerUserId, orderId, originalTransactionId, fromEscrow }
    )
  );
  
  const transaction: LedgerTransaction = {
    id: transactionId,
    type: TransactionType.REFUND,
    timestamp: new Date().toISOString(),
    entries,
    status: "completed",
    description,
    metadata: { buyerUserId, sellerUserId, amount, orderId, originalTransactionId, reason, fromEscrow },
  };
  
  await kv.set(`transaction:${transactionId}`, transaction);
  await kv.set(`user-transaction:${buyerUserId}:${transactionId}`, transaction);
  await kv.set(`user-transaction:${sellerUserId}:${transactionId}`, transaction);
  
  // Mark original transaction as reversed
  const originalTx = await kv.get(`transaction:${originalTransactionId}`);
  if (originalTx) {
    originalTx.status = "reversed";
    originalTx.metadata = originalTx.metadata || {};
    originalTx.metadata.reversedBy = transactionId;
    await kv.set(`transaction:${originalTransactionId}`, originalTx);
  }
  
  return transaction;
}

/**
 * Get user ledger history
 */
export async function getUserLedger(userId: string): Promise<LedgerEntry[]> {
  const entries = await kv.getByPrefix(`user-ledger:${userId}:`);
  return entries || [];
}

/**
 * Get user transaction history
 */
export async function getUserTransactions(userId: string): Promise<LedgerTransaction[]> {
  const transactions = await kv.getByPrefix(`user-transaction:${userId}:`);
  return transactions || [];
}

/**
 * Reconcile wallet balance with ledger
 * Returns true if balanced, false if mismatch
 */
export async function reconcileWalletBalance(userId: string): Promise<{
  balanced: boolean;
  ledgerBalance: number;
  walletBalance: number;
  difference: number;
}> {
  // Get balance from ledger system
  const ledgerBalance = await getAccountBalance(AccountType.WALLET, userId);
  
  // Get balance from old wallet system
  const wallet = await kv.get(`wallet:${userId}`);
  const walletBalance = wallet?.balance || 0;
  
  const difference = Math.abs(ledgerBalance - walletBalance);
  const balanced = difference < 0.01; // Allow 1 cent difference for rounding
  
  return {
    balanced,
    ledgerBalance,
    walletBalance,
    difference,
  };
}

/**
 * Sync old wallet to new ledger system (migration helper)
 */
export async function syncWalletToLedger(userId: string): Promise<void> {
  const wallet = await kv.get(`wallet:${userId}`);
  if (!wallet) return;
  
  const currentLedgerBalance = await getAccountBalance(AccountType.WALLET, userId);
  const targetBalance = wallet.balance || 0;
  
  if (currentLedgerBalance !== targetBalance) {
    const difference = targetBalance - currentLedgerBalance;
    
    if (difference > 0) {
      // Add missing balance
      await recordDeposit(userId, difference, "MIGRATION", "SYNC-MIGRATION", "SYSTEM");
    } else if (difference < 0) {
      // This shouldn't happen but log it
      console.error(`User ${userId} has negative balance difference: ${difference}`);
    }
  }
}
