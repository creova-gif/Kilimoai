# KILIMO SMS OTP Flow - Visual Diagram

## 🔐 Complete Security Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER REGISTRATION FLOW                        │
└─────────────────────────────────────────────────────────────────────┘

Step 1: USER ENTERS DETAILS
┌────────────────┐
│   Frontend     │  User fills form:
│                │  • Role: smallholder_farmer
│   📱 Mobile    │  • Name: John Mkulima
│                │  • Phone: +255712345678
│                │  • Password: ********
└────────┬───────┘  • Language: Swahili
         │
         │ POST /make-server-ce1844e7/signup
         ↓
┌────────────────┐
│   Backend      │  Validates:
│   🔧 Server    │  ✓ Phone format (+255XXXXXXXXX)
│                │  ✓ No duplicate phone
│                │  ✓ Required fields present
└────────┬───────┘
         │
         ↓

Step 2: CREATE USER (UNVERIFIED)
┌────────────────┐
│  Supabase Auth │  Create user with:
│   🔐 Auth      │  • phone: +255712345678
│                │  • password: hashed
│                │  • user_metadata: {...}
│                │  ⚠️  NO email_confirm flag
│                │  ⚠️  NO phone_confirm flag
└────────┬───────┘
         │
         ↓

Step 3: STORE USER DATA
┌────────────────┐
│   KV Store     │  Save to KV:
│   💾 Database  │  • user:{userId} → user data
│                │  • phone:+255... → userId
│                │  • Status: UNVERIFIED
└────────┬───────┘
         │
         ↓

Step 4: GENERATE OTP
┌────────────────┐
│   Backend      │  Generate:
│   🔧 Server    │  • 6-digit code: 123456
│                │  • Expiry: now + 10 minutes
│                │  • Store in KV: otp:{userId}
└────────┬───────┘
         │
         ↓

Step 5: SEND SMS VIA AFRICA'S TALKING
┌────────────────┐
│ Africa's       │  Send SMS:
│ Talking        │  "KILIMO Uthibitishaji
│ 🇹🇿 Tanzania   │   
│                │   Nambari yako ya OTP: 123456
│                │   
│                │   Inatumika kwa dakika 5.
│                │   Usishiriki nambari hii."
└────────┬───────┘
         │
         ↓
┌────────────────┐
│  User's Phone  │  📱 SMS received!
│  📱 Device     │  "Your OTP: 123456"
└────────┬───────┘
         │
         ↓

Step 6: USER ENTERS OTP
┌────────────────┐
│   Frontend     │  User enters:
│   📱 Mobile    │  Code: 1 2 3 4 5 6
│                │  [Verify] button clicked
└────────┬───────┘
         │
         │ POST /make-server-ce1844e7/verify
         ↓
┌────────────────┐
│   Backend      │  Validate:
│   🔧 Server    │  ✓ OTP exists in KV
│                │  ✓ Code matches (123456)
│                │  ✓ Not expired (< 10 min)
└────────┬───────┘
         │
         ↓

Step 7: MARK PHONE AS CONFIRMED
┌────────────────┐
│  Supabase Auth │  Update user:
│   🔐 Auth      │  • phone_confirm = true
│                │  • phone_confirmed_at = now
│                │  ✅ VERIFIED!
└────────┬───────┘
         │
         ↓

Step 8: UPDATE KV STORE
┌────────────────┐
│   KV Store     │  Update:
│   💾 Database  │  • user:{userId}.phone_verified = true
│                │  • user:{userId}.verified_at = now
│                │  • Delete otp:{userId}
└────────┬───────┘
         │
         ↓

Step 9: AUTO-CREATE WALLET
┌────────────────┐
│   Backend      │  Create wallet:
│   🔧 Server    │  • wallet_id: uuid
│                │  • user_id: userId
│                │  • balance: 0 TZS
│                │  • currency: TZS
│                │  • status: active
│                │  💰 WALLET READY!
└────────┬───────┘
         │
         ↓

Step 10: STORE WALLET
┌────────────────┐
│   KV Store     │  Save wallet:
│   💾 Database  │  • wallet:{userId} → wallet data
│                │  • wallet:id:{walletId} → wallet data
│                │  ✅ COMPLETE!
└────────┬───────┘
         │
         ↓

Step 11: SUCCESS RESPONSE
┌────────────────┐
│   Frontend     │  Show success:
│   📱 Mobile    │  ✅ "Phone verified!"
│                │  ✅ "Wallet created!"
│                │  → Redirect to dashboard
└────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          USER IS NOW READY                           │
│                    ✅ Phone Verified                                 │
│                    ✅ Wallet Created                                 │
│                    ✅ Can Deposit Money                              │
│                    ✅ Can Send/Receive Payments                      │
│                    ✅ Can Use Marketplace                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🚫 What Happens If User Tries to Use Wallet BEFORE Verification?

```
┌────────────────┐
│  Unverified    │  User tries to:
│  User          │  • Deposit money
│  ⚠️  No Phone   │  • Send payment
│  Verification  │  • Use marketplace
└────────┬───────┘
         │
         │ POST /make-server-ce1844e7/wallet/deposit
         ↓
┌────────────────┐
│   Backend      │  Check verification:
│   🔧 Server    │  const check = await
│                │    requireVerification(userId, "payment")
│                │  
│                │  ❌ phone_confirmed_at = NULL
│                │  ❌ Verification FAILED
└────────┬───────┘
         │
         ↓
┌────────────────┐
│   Response     │  Return 403 Forbidden:
│   ❌ Blocked    │  {
│                │    "error": "Verification required",
│                │    "message": "You must verify your
│                │                phone number before
│                │                performing payment
│                │                operations.",
│                │    "code": "VERIFICATION_REQUIRED",
│                │    "action": "verify_phone"
│                │  }
└────────┬───────┘
         │
         ↓
┌────────────────┐
│   Frontend     │  Show alert:
│   📱 Mobile    │  ⚠️  "Phone Verification Required"
│                │  
│                │  "Please verify your phone to
│                │   access wallet features."
│                │  
│                │  [Verify Now] button
│                │  → Redirect to OTP screen
└────────────────┘
```

---

## 🔄 Resend OTP Flow

```
┌────────────────┐
│   Frontend     │  User clicks:
│   📱 Mobile    │  "Didn't receive code?"
│                │  [Resend OTP] button
└────────┬───────┘
         │
         │ POST /make-server-ce1844e7/resend-otp
         ↓
┌────────────────┐
│   Backend      │  Generate new OTP:
│   🔧 Server    │  • New 6-digit code: 789012
│                │  • New expiry: now + 10 min
│                │  • Overwrite old OTP in KV
└────────┬───────┘
         │
         ↓
┌────────────────┐
│ Africa's       │  Send new SMS:
│ Talking        │  "Your new OTP: 789012"
│ 🇹🇿 Tanzania   │  
└────────┬───────┘
         │
         ↓
┌────────────────┐
│  User's Phone  │  📱 New SMS received!
│  📱 Device     │  "Your OTP: 789012"
└────────┬───────┘
         │
         ↓
┌────────────────┐
│   Frontend     │  Show success:
│   📱 Mobile    │  ✅ "New code sent!"
│                │  ⏱️  Wait 60s before resending again
│                │  [Countdown: 59, 58, 57...]
└────────────────┘
```

---

## 💾 Data Storage Structure

```
KV Store (Database):

user:{userId}
├── id: "uuid-123"
├── name: "John Mkulima"
├── phone: "+255712345678"
├── role: "smallholder_farmer"
├── language: "sw"
├── phone_verified: true ← Set after OTP verification
├── verified_at: "2026-01-26T10:30:00Z" ← Timestamp
└── ...

phone:+255712345678
└── "uuid-123" (userId)

otp:{userId}
├── code: "123456"
├── method: "phone"
├── created_at: "2026-01-26T10:25:00Z"
└── expires_at: "2026-01-26T10:35:00Z" ← 10 minutes later

wallet:{userId}
├── id: "wallet-uuid-456"
├── user_id: "uuid-123"
├── balance: 0
├── currency: "TZS"
├── status: "active"
├── created_at: "2026-01-26T10:30:00Z" ← Created after verification
└── updated_at: "2026-01-26T10:30:00Z"

wallet:id:{walletId}
└── (same wallet data as above)
```

```
Supabase Auth (auth.users table):

id: "uuid-123"
phone: "+255712345678"
phone_confirmed_at: "2026-01-26T10:30:00Z" ← Set after OTP verification
email_confirmed_at: null
user_metadata:
  ├── name: "John Mkulima"
  ├── role: "smallholder_farmer"
  ├── language: "sw"
  └── ...
```

---

## 🔐 Security Checkpoints

```
┌─────────────────────────────────────────────────────────────┐
│           VERIFICATION REQUIRED AT THESE POINTS             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Wallet Deposit        ← requireVerification()          │
│  2. Wallet Payment        ← requireVerification()          │
│  3. Wallet Transfer       ← requireVerification() (both)   │
│  4. Wallet Withdrawal     ← requireVerification()          │
│  5. Payment Requests      ← requireVerification()          │
│  6. Marketplace Purchase  ← requireVerification()          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Verification Check Logic:

async function requireVerification(userId, operationType) {
  // Get user from Supabase Auth
  const { data: authUser } = await supabase.auth.admin.getUserById(userId);
  
  // Check if phone is confirmed
  const phoneVerified = authUser?.user?.phone_confirmed_at ? true : false;
  
  if (!phoneVerified) {
    return {
      allowed: false,
      error: "Phone verification required for {operationType}",
      status: 403
    };
  }
  
  return { allowed: true };
}
```

---

## 📱 SMS Templates

### OTP Verification (English)
```
KILIMO Verification

Your OTP: 123456

Valid for 5 minutes.
Do not share this code.
```

### OTP Verification (Swahili)
```
KILIMO Uthibitishaji

Nambari yako ya OTP: 123456

Inatumika kwa dakika 5.
Usishiriki nambari hii.
```

### Payment Confirmation (English)
```
KILIMO Wallet

Payment Confirmed
Amount: TZS 50,000
Balance: TZS 125,000
Ref: TXN123456789

Thank you!
```

### Payment Confirmation (Swahili)
```
KILIMO Wallet

Malipo Yamethibitishwa
Kiasi: TZS 50,000
Salio: TZS 125,000
Kumbukumbu: TXN123456789

Asante!
```

---

## ⏱️ Timing & Expiry

```
OTP Generation
   ↓
   ⏱️  Valid for 10 minutes
   ↓
User enters code within 10 min → ✅ Success
User enters code after 10 min  → ❌ Expired

Resend Cooldown
   ↓
   ⏱️  Wait 60 seconds
   ↓
[Resend OTP] button disabled for 60s
After 60s → ✅ Can resend

OTP Attempts (Recommended)
   ↓
   ⏱️  Max 5 attempts
   ↓
After 5 failed attempts → 🔒 Lock for 1 hour
After 1 hour → ✅ Can try again
```

---

## 🇹🇿 Tanzania Phone Number Format

```
Valid Formats:

+255712345678   ✅ Correct (E.164 format)
+255 712 345 678 ✅ Correct (with spaces)
0712345678      ❌ Wrong (local format, needs conversion)
255712345678    ❌ Wrong (missing +)
712345678       ❌ Wrong (missing country code)

Auto-Formatting Logic:

Input: 0712345678
  ↓ Remove leading 0
Output: +255712345678

Input: 255712345678
  ↓ Add + prefix
Output: +255712345678

Input: 712345678
  ↓ Add +255 prefix
Output: +255712345678
```

---

## 📊 Monitoring Points

```
┌─────────────────────────────────────────────────────────┐
│              METRICS TO MONITOR                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. OTP Delivery Rate                                  │
│     └─ Target: > 95% delivered within 30 seconds       │
│                                                         │
│  2. OTP Verification Success Rate                      │
│     └─ Target: > 85% verified on first try             │
│                                                         │
│  3. SMS Costs                                          │
│     └─ Monitor: Monthly spend per user                 │
│                                                         │
│  4. Failed Attempts                                    │
│     └─ Alert: If > 20% failure rate                    │
│                                                         │
│  5. Wallet Creation Rate                               │
│     └─ Target: 100% after phone verification           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎉 End Result

```
✅ SECURE REGISTRATION
   └─ No auto-confirm, proper OTP verification

✅ SMS DELIVERY
   └─ Africa's Talking optimized for Tanzania

✅ PHONE VERIFIED
   └─ phone_confirmed_at set in Supabase Auth

✅ WALLET CREATED
   └─ Auto-created with 0 TZS balance

✅ PAYMENTS PROTECTED
   └─ All wallet operations require verification

✅ USER READY
   └─ Can deposit, send, receive money safely
```

---

**Total Flow Time:** ~2-3 minutes from signup to verified wallet
**User Actions:** 3 steps (signup, receive SMS, enter OTP)
**Backend Actions:** 11 automated steps
**Result:** Secure, verified user with active wallet ready for transactions 🚀
