# 🚀 KILIMO LAUNCH ACTION CHECKLIST

**Last Updated:** January 26, 2026  
**Deployment Score:** 73/100 - CONDITIONAL GO ⚠️  
**Estimated Time to Launch:** 5-7 days

---

## ⛔ CRITICAL PATH (Must Complete - 3 Days)

### Day 1: Africa's Talking SMS Setup
**Priority:** BLOCKER ⛔  
**Owner:** DevOps + Backend Team  
**Time:** 4-6 hours

- [ ] Create production account at https://africastalking.com
- [ ] Verify business details (required for production)
- [ ] Get API Key from dashboard
- [ ] Get production username (not "sandbox")
- [ ] Top up account with TZS 100,000+ credits
- [ ] Register sender ID: "KILIMO" or "CREOVA" (max 11 chars)

**Add to Supabase Edge Function Secrets:**
```bash
AFRICAS_TALKING_API_KEY=<your_api_key>
AFRICAS_TALKING_USERNAME=<your_username>
AFRICAS_TALKING_SENDER_ID=KILIMO
ENVIRONMENT=production
```

**Test:**
```bash
# Run this curl command to test SMS
curl -X POST $API_BASE/signup \
  -H "Content-Type: application/json" \
  -d '{
    "role": "smallholder_farmer",
    "name": "Test User",
    "phone_number": "+255712345678",  # ← Use YOUR real phone
    "password": "test123456",
    "language": "sw",
    "role_specific_fields": {"farm_size": 2.5, "crops": ["maize"]}
  }'
```

**Expected Result:** SMS received within 30 seconds with 6-digit OTP

---

### Day 2-3: Frontend OTP UI Implementation
**Priority:** BLOCKER ⛔  
**Owner:** Frontend Team  
**Time:** 8-12 hours

**Reference:** `/FRONTEND_OTP_GUIDE.md` (complete implementation guide)

#### Step 1: Create OTP Component (`/components/OTPVerificationScreen.tsx`)
```typescript
import { useState, useEffect } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Button } from './ui/button';

export function OTPVerificationScreen({ 
  userId, 
  phoneNumber, 
  onSuccess 
}: {
  userId: string;
  phoneNumber: string;
  onSuccess: () => void;
}) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);
  
  const handleVerify = async () => {
    setLoading(true);
    setError('');
    
    const response = await fetch(`${API_BASE}/verify`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        user_id: userId,
        otp_code: otp,
        method: 'phone'
      })
    });
    
    const result = await response.json();
    
    if (result.status === 'success') {
      onSuccess();
    } else {
      setError(result.message || 'Invalid OTP');
      setOtp('');
    }
    
    setLoading(false);
  };
  
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    await fetch(`${API_BASE}/resend-otp`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        user_id: userId,
        method: 'phone'
      })
    });
  };
  
  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Verify Your Phone</h2>
        <p className="text-gray-600 mt-2">
          Enter the 6-digit code sent to {phoneNumber}
        </p>
      </div>
      
      <InputOTP 
        value={otp} 
        onChange={setOtp}
        maxLength={6}
        disabled={loading}
      >
        <InputOTPGroup>
          {[0,1,2,3,4,5].map(i => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      
      {error && (
        <div className="text-red-600 text-sm text-center">{error}</div>
      )}
      
      <Button 
        onClick={handleResend}
        disabled={resendCooldown > 0}
        variant="ghost"
        className="w-full"
      >
        {resendCooldown > 0 
          ? `Resend in ${resendCooldown}s` 
          : 'Resend Code'}
      </Button>
    </div>
  );
}
```

#### Step 2: Integrate into App Flow
```typescript
// In /App.tsx or registration flow
const [showOTPScreen, setShowOTPScreen] = useState(false);
const [pendingUserId, setPendingUserId] = useState('');
const [pendingPhone, setPendingPhone] = useState('');

const handleRegister = async (data) => {
  const response = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  const result = await response.json();
  
  if (result.status === 'success') {
    setPendingUserId(result.user_id);
    setPendingPhone(data.phone_number);
    setShowOTPScreen(true);  // ← Show OTP screen
  }
};

const handleOTPSuccess = () => {
  setShowOTPScreen(false);
  setIsRegistered(true);
  toast.success('Phone verified! Welcome to KILIMO 🌾');
};

// In render:
{showOTPScreen ? (
  <OTPVerificationScreen 
    userId={pendingUserId}
    phoneNumber={pendingPhone}
    onSuccess={handleOTPSuccess}
  />
) : (
  <RegistrationForm onRegister={handleRegister} />
)}
```

**Checklist:**
- [ ] OTPVerificationScreen component created
- [ ] 6-digit input works (auto-submit on complete)
- [ ] Error messages display correctly
- [ ] Resend button with 30s cooldown
- [ ] Integration with signup flow
- [ ] Success redirects to dashboard
- [ ] Tested on mobile (touch targets)

---

### Day 3: End-to-End Testing
**Priority:** CRITICAL ⛔  
**Owner:** QA + Full Team  
**Time:** 4 hours

#### Test Case 1: Happy Path - Signup → Verify → Wallet
1. Fill signup form with real Tanzania phone (+255...)
2. Submit form
3. Wait for SMS (< 30s)
4. Enter correct 6-digit OTP
5. Redirected to dashboard
6. Check wallet exists with 0 balance

**Pass Criteria:**
- ✅ SMS received within 30 seconds
- ✅ OTP verification succeeds
- ✅ Wallet auto-created
- ✅ Dashboard loads successfully

---

#### Test Case 2: Invalid OTP
1. Enter wrong OTP code
2. Error message displays: "Invalid OTP"
3. OTP input clears
4. User can try again

**Pass Criteria:**
- ✅ Error shown clearly
- ✅ Input cleared for retry
- ✅ No navigation happens

---

#### Test Case 3: Expired OTP
1. Wait 10+ minutes after receiving OTP
2. Enter OTP code
3. Error: "OTP has expired"
4. Resend button works
5. New OTP received
6. Verification succeeds

**Pass Criteria:**
- ✅ Expiry detected correctly
- ✅ Resend works
- ✅ New OTP succeeds

---

#### Test Case 4: Unverified User Blocked
1. Signup but don't verify
2. Try to access wallet/payments
3. Blocked with "Verification Required"
4. Redirected to OTP screen
5. Complete verification
6. Access granted

**Pass Criteria:**
- ✅ Unverified user blocked
- ✅ Clear error message shown
- ✅ Redirect to verification
- ✅ Access granted after verify

---

## ⚠️ HIGH PRIORITY (Should Complete - 2 Days)

### Day 4: Image Upload Optimization
**Priority:** HIGH ⚠️  
**Owner:** Frontend + Backend Team  
**Time:** 4-6 hours

**Issue:** Currently sending base64 images in JSON (slow, large payloads)

**Fix:** Use multipart/form-data for direct file uploads

#### Update PhotoCropDiagnosis.tsx
```typescript
// ❌ OLD (base64)
const imageData = canvas.toDataURL("image/jpeg", 0.9);
onAnalyzePhoto(imageData);

// ✅ NEW (direct file)
canvas.toBlob(async (blob) => {
  const formData = new FormData();
  formData.append('file', blob, 'crop.jpg');
  formData.append('userId', userId);
  formData.append('language', language);
  
  const response = await fetch(`${API_BASE}/diagnose-crop`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  
  const result = await response.json();
  // Handle result...
}, 'image/jpeg', 0.9);
```

**Files to Update:**
- [ ] `/components/PhotoCropDiagnosis.tsx`
- [ ] `/components/LivestockHealthMonitor.tsx`
- [ ] `/components/VoiceAssistant.tsx` (audio)

**Test:**
- [ ] Upload 5MB image completes in < 2s
- [ ] Diagnosis results display correctly
- [ ] No base64 in network tab

---

### Day 5: Error Context Enhancement
**Priority:** MEDIUM ⚠️  
**Owner:** Backend Team  
**Time:** 2-3 hours

**Update all API responses to include error codes:**

```typescript
// ✅ STANDARDIZED ERROR RESPONSE
{
  success: false,
  error: {
    code: "SMS_SEND_FAILED",
    message: "Failed to send OTP. Please try again.",
    details: "Africa's Talking API error: Insufficient credits",
    action: "contact_support"
  }
}
```

**Error Codes to Add:**
- `OTP_EXPIRED`
- `OTP_INVALID`
- `VERIFICATION_REQUIRED`
- `SMS_SEND_FAILED`
- `WALLET_NOT_FOUND`
- `INSUFFICIENT_BALANCE`

**Files to Update:**
- [ ] `/supabase/functions/server/signup_api.tsx`
- [ ] `/supabase/functions/server/index.tsx` (wallet endpoints)
- [ ] `/supabase/functions/server/sms.tsx`

---

## 🔵 RECOMMENDED (Can Launch Without - Ongoing)

### Week 2: In-App Notifications
- [ ] Create notification data model in KV
- [ ] Add notification bell icon to header
- [ ] Implement notification panel UI
- [ ] Store wallet notifications
- [ ] Mark as read functionality
- [ ] Badge count display

---

### Week 2: Localization Audit
- [ ] Search codebase for hard-coded English strings
- [ ] Replace with translation utility calls
- [ ] Test language toggle across all screens
- [ ] Verify SMS messages in both languages
- [ ] Update error messages to be bilingual

---

### Week 3: Performance Monitoring
- [ ] Set up Sentry or DataDog
- [ ] Monitor API response times
- [ ] Track SMS delivery rate (target: >95%)
- [ ] Track verification success rate (target: >85%)
- [ ] Set up alerts for critical failures

---

## 📊 DAILY STANDUP TRACKER

### Day 1 Checklist ☑️
- [ ] Africa's Talking account created
- [ ] API credentials obtained
- [ ] Credentials added to Supabase
- [ ] Test SMS sent and received
- [ ] Delivery confirmed in dashboard

**Blocker Check:** Can proceed to Day 2? YES / NO

---

### Day 2 Checklist ☑️
- [ ] OTPVerificationScreen component created
- [ ] Component integrated into signup flow
- [ ] Manual test: OTP screen appears after signup
- [ ] Manual test: 6-digit input works
- [ ] Manual test: Resend button works

**Blocker Check:** Can proceed to Day 3? YES / NO

---

### Day 3 Checklist ☑️
- [ ] Happy path test passed (signup → verify → wallet)
- [ ] Invalid OTP test passed
- [ ] Expired OTP test passed
- [ ] Unverified user blocked test passed
- [ ] All critical bugs fixed

**Blocker Check:** Can proceed to launch? YES / NO

---

## 🚨 ROLLBACK PLAN

If issues found in production:

### Immediate Actions
1. **SMS Fails:** Switch ENVIRONMENT=development (uses console logs instead)
2. **OTP UI Broken:** Hide OTP screen, auto-verify for 24h (emergency only)
3. **Wallet Issues:** Disable wallet features, show maintenance message

### Emergency Contacts
- **SMS Issues:** support@africastalking.com
- **Supabase Issues:** https://supabase.com/dashboard/support
- **Critical Bug:** [Your tech lead email/phone]

---

## ✅ GO/NO-GO DECISION GATE

**Date:** [Fill in before launch]  
**Decision Maker:** [Product Owner / Tech Lead]

### Critical Requirements (All Must Pass)
- [ ] Africa's Talking SMS working in production
- [ ] OTP verification flow complete end-to-end
- [ ] Wallet auto-created after verification
- [ ] Unverified users blocked from wallet/payments
- [ ] All Day 3 tests passed

### Decision: GO 🟢 / NO-GO 🔴

**Notes:**
_[Record any concerns, risks, or mitigation plans]_

---

## 📞 SUPPORT CONTACTS

**Africa's Talking:**
- Email: support@africastalking.com
- Dashboard: https://account.africastalking.com
- API Docs: https://developers.africastalking.com

**Supabase:**
- Dashboard: https://supabase.com/dashboard
- Support: https://supabase.com/dashboard/support

**Internal:**
- Tech Lead: [Name/Email]
- DevOps: [Name/Email]
- QA Lead: [Name/Email]

---

**Last Updated:** January 26, 2026  
**Next Review:** [Day 3 - Before Launch Decision]
