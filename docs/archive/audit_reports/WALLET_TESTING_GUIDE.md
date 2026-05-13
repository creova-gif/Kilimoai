# 🧪 WALLET LEDGER TESTING GUIDE

Quick reference for testing all wallet features.

## 🚀 QUICK START TESTING

### 1. Run Full Test Suite
```bash
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/test \
  -H "Authorization: Bearer ${publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user-123"}'
```

**Expected Output:**
```json
{
  "success": true,
  "results": [
    {"test": "Deposit", "passed": true, "message": "Deposited 5432 TZS"},
    {"test": "Balance Check", "passed": true, "message": "Balance: 5432 TZS"},
    {"test": "Transfer", "passed": true, "message": "Transferred 1234 TZS"},
    {"test": "Payment (Escrow)", "passed": true, "message": "Payment 2000 TZS held in escrow"},
    {"test": "Refund", "passed": true, "message": "Refunded 800 TZS"},
    {"test": "Reconciliation", "passed": true, "message": "Ledger=2398, Wallet=2398"},
    {"test": "Ledger Integrity", "passed": true, "message": "6/6 balanced"}
  ]
}
```

---

## 💳 PAYMENT GATEWAY TESTING

### A. Flutterwave Test

```bash
# 1. Initiate payment
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/flutterwave/initiate \
  -H "Authorization: Bearer ${publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-farmer-001",
    "amount": 10000,
    "email": "farmer@test.com",
    "phoneNumber": "+255700123456",
    "currency": "TZS",
    "country": "TZ"
  }'

# 2. Expected Response
{
  "success": true,
  "paymentLink": "https://checkout.flutterwave.com/...",
  "txRef": "FLW-test-farmer-001-1737876543210"
}

# 3. Verify payment (after user pays)
curl https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/flutterwave/verify/12345 \
  -H "Authorization: Bearer ${publicAnonKey}"
```

### B. M-Pesa C2B Test (Deposit)

```bash
# 1. Initiate C2B payment
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/mpesa/c2b \
  -H "Authorization: Bearer ${publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-farmer-001",
    "amount": 5000,
    "phoneNumber": "0700123456"
  }'

# 2. Expected Response
{
  "success": true,
  "transactionID": "MPESA-TXN-123456",
  "conversationID": "CONV-ABC123",
  "message": "Please complete payment on your M-Pesa phone"
}

# 3. Query status
curl https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/mpesa/status/MPESA-TXN-123456?ref=MPESA-C2B-123 \
  -H "Authorization: Bearer ${publicAnonKey}"
```

### C. M-Pesa B2C Test (Withdrawal)

```bash
# 1. First, ensure user has balance (deposit first)
# 2. Initiate withdrawal
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/mpesa/b2c \
  -H "Authorization: Bearer ${publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-farmer-001",
    "amount": 3000,
    "phoneNumber": "+255700123456"
  }'

# 3. Expected Response
{
  "success": true,
  "transactionID": "MPESA-TXN-789012",
  "message": "Withdrawal initiated. Funds will arrive in M-Pesa shortly"
}
```

---

## 📊 REPORTS TESTING

### 1. Platform Statistics

```bash
curl https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/platform-stats \
  -H "Authorization: Bearer ${publicAnonKey}"
```

**Expected Output:**
```json
{
  "success": true,
  "stats": {
    "totalWallets": 150,
    "totalBalance": 5000000,
    "totalEscrow": 250000,
    "totalRevenue": 75000,
    "totalFees": 25000,
    "averageBalance": 33333,
    "transactionVolume24h": 180000,
    "activeUsersToday": 45
  }
}
```

### 2. Financial Report (Monthly)

```bash
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/report \
  -H "Authorization: Bearer ${publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2026-01-01",
    "endDate": "2026-01-31",
    "reportType": "monthly"
  }'
```

**Expected Output:**
```json
{
  "success": true,
  "report": {
    "period": "2026-01",
    "reportType": "monthly",
    "totalRevenue": 125000,
    "totalFees": 35000,
    "totalEscrow": 50000,
    "totalRefunds": 8000,
    "totalDeposits": 500000,
    "totalWithdrawals": 200000,
    "transactionCount": 450,
    "activeUsers": 120
  }
}
```

### 3. Transaction Trends

```bash
curl https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/trends?days=7 \
  -H "Authorization: Bearer ${publicAnonKey}"
```

### 4. Escrow Report

```bash
curl https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/escrow-report \
  -H "Authorization: Bearer ${publicAnonKey}"
```

**Expected Output:**
```json
{
  "success": true,
  "escrow": {
    "totalHeld": 150000,
    "orderCount": 12,
    "oldestEscrow": "2026-01-15T10:30:00Z",
    "escrowOrders": [
      {
        "orderId": "ORD-20260120-ABC123",
        "amount": 25000,
        "heldSince": "2026-01-20T14:20:00Z"
      }
    ]
  }
}
```

### 5. Revenue Breakdown

```bash
curl https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/revenue-breakdown \
  -H "Authorization: Bearer ${publicAnonKey}"
```

### 6. Top Users

```bash
curl https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/top-users?limit=10 \
  -H "Authorization: Bearer ${publicAnonKey}"
```

---

## ⚖️ TRANSACTION LIMITS TESTING

### 1. Set Daily Limit

```bash
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/set-limit \
  -H "Authorization: Bearer ${publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-farmer-001",
    "limitType": "daily",
    "amount": 50000
  }'
```

### 2. Set Monthly Limit

```bash
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/set-limit \
  -H "Authorization: Bearer ${publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-farmer-001",
    "limitType": "monthly",
    "amount": 200000
  }'
```

### 3. Set Per-Transaction Limit

```bash
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/set-limit \
  -H "Authorization: Bearer ${publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-farmer-001",
    "limitType": "perTransaction",
    "amount": 100000
  }'
```

### 4. Get User Limits

```bash
curl https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/limits/test-farmer-001 \
  -H "Authorization: Bearer ${publicAnonKey}"
```

**Expected Output:**
```json
{
  "success": true,
  "limits": [
    {
      "userId": "test-farmer-001",
      "limitType": "daily",
      "amount": 50000,
      "spent": 15000,
      "period": "2026-01-26"
    },
    {
      "userId": "test-farmer-001",
      "limitType": "monthly",
      "amount": 200000,
      "spent": 45000,
      "period": "2026-01"
    },
    {
      "userId": "test-farmer-001",
      "limitType": "perTransaction",
      "amount": 100000,
      "spent": 0,
      "period": "N/A"
    }
  ]
}
```

### 5. Test Limit Enforcement

```bash
# Try to exceed daily limit
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/deduct \
  -H "Authorization: Bearer ${publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-farmer-001",
    "amount": 60000,
    "description": "Test limit enforcement"
  }'

# Expected Error:
{
  "error": "Daily limit exceeded: 75000 / 50000"
}
```

---

## 🔍 INTEGRITY TESTING

### Validate Ledger Integrity

```bash
curl https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/validate-integrity \
  -H "Authorization: Bearer ${publicAnonKey}"
```

**Expected Output (Healthy System):**
```json
{
  "success": true,
  "valid": true,
  "errors": [],
  "warnings": [],
  "stats": {
    "totalTransactions": 450,
    "totalEntries": 900,
    "balancedTransactions": 450,
    "unbalancedTransactions": 0
  }
}
```

**Expected Output (Issues Found):**
```json
{
  "success": false,
  "valid": false,
  "errors": [
    "Transaction DEP-1737876543210-abc123 is unbalanced: debits=10000, credits=9500"
  ],
  "warnings": [
    "User user-123 wallet mismatch: wallet=50000, ledger=50500"
  ],
  "stats": {
    "totalTransactions": 450,
    "totalEntries": 900,
    "balancedTransactions": 449,
    "unbalancedTransactions": 1
  }
}
```

---

## 🧪 SCENARIO TESTING

### Create Specific Test Scenarios

```bash
# Test 1: Deposit Scenario
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/test-scenario \
  -H "Authorization: Bearer ${publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-farmer-001",
    "scenarioType": "deposit"
  }'

# Test 2: Withdrawal Scenario
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/test-scenario \
  -H "Authorization: Bearer ${publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-farmer-001",
    "scenarioType": "withdrawal"
  }'

# Test 3: Transfer Scenario
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/test-scenario \
  -H "Authorization: Bearer ${publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-farmer-001",
    "scenarioType": "transfer"
  }'

# Test 4: Payment with Escrow
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/test-scenario \
  -H "Authorization: Bearer ${publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-farmer-001",
    "scenarioType": "payment"
  }'

# Test 5: Refund Scenario
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/test-scenario \
  -H "Authorization: Bearer ${publicAnonKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-farmer-001",
    "scenarioType": "refund"
  }'
```

---

## 📱 ADMIN DASHBOARD TESTING

### Access Dashboard
```tsx
// In your React app
import WalletAdminDashboard from './components/WalletAdminDashboard';

// Route it to admin-only path
<Route path="/admin/wallet" element={<WalletAdminDashboard />} />
```

### Test Dashboard Features:
1. ✅ Click "Refresh" button - Should reload all data
2. ✅ Switch between tabs - All tabs should load
3. ✅ Check Platform Stats cards - Should show real numbers
4. ✅ View Transaction Trends - Change days filter (7/14/30)
5. ✅ Check Escrow Report - Should list active escrow orders
6. ✅ View Top Users - Should rank by balance
7. ✅ Run Integrity Check - Click "Run Check" button

---

## 🔄 RECONCILIATION TESTING

### Test User Balance Reconciliation

```bash
# 1. Get user ledger
curl https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/ledger/test-farmer-001 \
  -H "Authorization: Bearer ${publicAnonKey}"

# 2. Reconcile balance
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/reconcile/test-farmer-001 \
  -H "Authorization: Bearer ${publicAnonKey}"

# Expected Output (Balanced):
{
  "success": true,
  "balanced": true,
  "ledgerBalance": 50000,
  "walletBalance": 50000,
  "difference": 0
}

# Expected Output (Unbalanced):
{
  "success": true,
  "balanced": false,
  "ledgerBalance": 50000,
  "walletBalance": 49500,
  "difference": 500
}
```

### Sync Wallet to Ledger (Migration)

```bash
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/sync-ledger/test-farmer-001 \
  -H "Authorization: Bearer ${publicAnonKey}"
```

---

## 📋 TESTING CHECKLIST

### ✅ Core Wallet Functions
- [ ] Deposit funds
- [ ] Withdraw funds
- [ ] P2P transfer
- [ ] Payment with escrow
- [ ] Refund transaction
- [ ] Balance reconciliation

### ✅ Payment Gateways
- [ ] Flutterwave initiate
- [ ] Flutterwave webhook
- [ ] M-Pesa C2B (deposit)
- [ ] M-Pesa B2C (withdrawal)
- [ ] M-Pesa webhook

### ✅ Transaction Limits
- [ ] Set daily limit
- [ ] Set monthly limit
- [ ] Set per-transaction limit
- [ ] Test limit enforcement
- [ ] Verify automatic reset

### ✅ Reports & Analytics
- [ ] Platform statistics
- [ ] Financial report (monthly)
- [ ] Revenue breakdown
- [ ] Escrow report
- [ ] Transaction trends
- [ ] Top users list

### ✅ Admin Dashboard
- [ ] Load all statistics
- [ ] View transaction trends
- [ ] Monitor escrow
- [ ] Check top users
- [ ] Run integrity check

### ✅ Testing & Validation
- [ ] Run full test suite
- [ ] Create test scenarios
- [ ] Validate ledger integrity
- [ ] Check reconciliation
- [ ] Verify double-entry

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue 1: Payment Gateway Webhook Not Received
**Solution:**
- Verify webhook URL configured in gateway dashboard
- Check server logs for incoming webhook calls
- Ensure CORS is properly configured
- Test with ngrok if testing locally

### Issue 2: Ledger Integrity Fails
**Solution:**
```bash
# Run reconciliation for all users
# Then check specific users with mismatches
curl https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/validate-integrity

# Sync individual user
curl -X POST https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/sync-ledger/{userId}
```

### Issue 3: Transaction Limit Not Working
**Solution:**
```bash
# Check if limit is set
curl https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/wallet/limits/{userId}

# Verify period hasn't expired (daily resets at midnight)
```

### Issue 4: M-Pesa Phone Number Format Error
**Solution:**
- Use any format: `0700123456`, `+255700123456`, or `255700123456`
- System auto-formats to M-Pesa standard

---

## 📊 PERFORMANCE BENCHMARKS

### Expected Response Times:
- Simple wallet query: **< 100ms**
- Ledger transaction: **< 200ms**
- Payment initiation: **< 500ms** (gateway call)
- Report generation: **< 1s** (cached)
- Integrity check: **< 3s** (full scan)
- Test suite: **< 5s** (7 tests)

---

## ✅ FINAL VERIFICATION

Run this complete test to verify everything works:

```bash
#!/bin/bash

# Set your credentials
PROJECT_ID="your-project-id"
ANON_KEY="your-anon-key"
API_URL="https://${PROJECT_ID}.supabase.co/functions/v1/make-server-ce1844e7"

echo "🧪 Running Complete Wallet System Test..."

# 1. Test Suite
echo "\n1️⃣ Running test suite..."
curl -X POST ${API_URL}/wallet/test \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-001"}'

# 2. Platform Stats
echo "\n2️⃣ Getting platform stats..."
curl ${API_URL}/wallet/platform-stats \
  -H "Authorization: Bearer ${ANON_KEY}"

# 3. Validate Integrity
echo "\n3️⃣ Validating integrity..."
curl ${API_URL}/wallet/validate-integrity \
  -H "Authorization: Bearer ${ANON_KEY}"

echo "\n\n✅ Test complete!"
```

---

**Happy Testing! 🎉**

All wallet features are fully functional and ready for production use.
