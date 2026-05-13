# Frontend OTP Integration Guide - KILIMO

## Quick Start for Frontend Developers

This guide shows you how to integrate the SMS OTP verification flow in the KILIMO frontend.

---

## 📱 User Flow

```
Registration → Enter Phone → Receive SMS → Enter OTP → Verified ✅ → Wallet Created
```

---

## 🔌 API Integration

### Base URL
```typescript
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;
```

### 1. User Signup

**Endpoint:** `POST /signup`

**Request:**
```typescript
const response = await fetch(`${API_BASE}/signup`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`
  },
  body: JSON.stringify({
    role: 'smallholder_farmer',
    name: 'John Mkulima',
    phone_number: '+255712345678',  // Must start with +255
    password: 'secure_password',
    language: 'sw',  // or 'en'
    location: {
      region: 'Kilimanjaro',
      district: 'Moshi'
    },
    role_specific_fields: {
      farm_size: 2.5,
      crops: ['maize', 'beans']
    }
  })
});

const data = await response.json();
```

**Success Response:**
```json
{
  "status": "success",
  "user_id": "uuid-here",
  "next_step": 1,
  "ai_tooltips": {...},
  "message": "Account created. Please verify your phone number."
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "This phone number is already registered. Please login instead."
}
```

**UI Actions:**
- ✅ Show success message
- ✅ Store `user_id` in state
- ✅ Redirect to OTP verification screen
- ✅ Show message: "SMS sent to +255712345678"

---

### 2. Verify OTP

**Endpoint:** `POST /verify`

**Request:**
```typescript
const response = await fetch(`${API_BASE}/verify`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`
  },
  body: JSON.stringify({
    user_id: userId,  // From signup response
    otp_code: '123456',  // User input
    method: 'phone'
  })
});

const data = await response.json();
```

**Success Response:**
```json
{
  "status": "success",
  "message": "Verification complete",
  "next_step": 2
}
```

**Error Responses:**
```json
// Invalid OTP
{
  "status": "error",
  "message": "Invalid OTP"
}

// Expired OTP
{
  "status": "error",
  "message": "OTP has expired"
}
```

**UI Actions:**
- ✅ Show success animation
- ✅ Update user state to verified
- ✅ Redirect to onboarding or dashboard
- ✅ Show message: "Phone verified! Wallet created."

---

### 3. Resend OTP

**Endpoint:** `POST /resend-otp`

**Request:**
```typescript
const response = await fetch(`${API_BASE}/resend-otp`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`
  },
  body: JSON.stringify({
    user_id: userId,
    method: 'phone'
  })
});

const data = await response.json();
```

**Success Response:**
```json
{
  "status": "success",
  "message": "OTP sent successfully"
}
```

**UI Actions:**
- ✅ Show success toast: "New code sent!"
- ✅ Disable resend button for 60 seconds
- ✅ Show countdown timer

---

## 🎨 UI Components

### OTP Verification Screen (React Example)

```tsx
import { useState, useEffect } from 'react';

export function OTPVerification({ userId, phoneNumber, onSuccess }: Props) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          user_id: userId,
          otp_code: otp,
          method: 'phone'
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        onSuccess();
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          user_id: userId,
          method: 'phone'
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setCanResend(false);
        setCountdown(60);
        // Show success toast
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-verification">
      <h2>Verify Your Phone</h2>
      <p>Enter the 6-digit code sent to {phoneNumber}</p>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder="000000"
        maxLength={6}
        className="otp-input"
      />

      {error && <p className="error">{error}</p>}

      <button 
        onClick={handleVerify} 
        disabled={loading || otp.length !== 6}
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>

      <button 
        onClick={handleResend} 
        disabled={!canResend || loading}
      >
        {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
      </button>
    </div>
  );
}
```

---

## 📱 Phone Number Input Component

```tsx
export function PhoneInput({ value, onChange, error }: Props) {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (input: string) => {
    // Auto-format for Tanzania
    let cleaned = input.replace(/\D/g, '');

    // Auto-add +255 if user starts typing without it
    if (cleaned.startsWith('0')) {
      cleaned = '255' + cleaned.slice(1);
    }

    if (!cleaned.startsWith('255') && cleaned.length > 0) {
      cleaned = '255' + cleaned;
    }

    const formatted = cleaned ? '+' + cleaned : '';
    setLocalValue(formatted);
    onChange(formatted);
  };

  return (
    <div className="phone-input">
      <label>Phone Number</label>
      <div className="input-wrapper">
        <span className="prefix">🇹🇿 +255</span>
        <input
          type="tel"
          value={localValue.replace('+255', '')}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="712 345 678"
          maxLength={9}
        />
      </div>
      {error && <p className="error">{error}</p>}
      <p className="hint">Enter your Tanzanian mobile number</p>
    </div>
  );
}
```

---

## ⚠️ Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Phone number must be in format +255 XXX XXX XXX" | Invalid format | Validate on frontend before sending |
| "This phone number is already registered" | Duplicate account | Redirect to login |
| "OTP has expired" | 10+ minutes passed | Show resend button |
| "Invalid OTP" | Wrong code | Allow retry (max 3-5 times) |
| "Verification required" | Tried to use wallet before verifying | Redirect to OTP screen |

### Error Display

```tsx
const ERROR_MESSAGES = {
  en: {
    invalid_otp: 'Invalid code. Please try again.',
    expired_otp: 'Code expired. Please request a new one.',
    network_error: 'Network error. Check your connection.',
    max_attempts: 'Too many failed attempts. Please try again later.'
  },
  sw: {
    invalid_otp: 'Nambari si sahihi. Jaribu tena.',
    expired_otp: 'Nambari imeisha muda. Omba mpya.',
    network_error: 'Tatizo la mtandao. Angalia muunganisho wako.',
    max_attempts: 'Majaribio mengi mno. Jaribu baadaye.'
  }
};
```

---

## 🔒 Wallet Access Protection

After OTP verification, the wallet is auto-created. If user tries to access wallet before verifying:

**API Response:**
```json
{
  "error": "Verification required",
  "message": "You must verify your phone number before performing payment operations.",
  "code": "VERIFICATION_REQUIRED",
  "action": "verify_phone"
}
```

**Frontend Handling:**
```tsx
if (error.code === 'VERIFICATION_REQUIRED') {
  // Redirect to OTP verification screen
  router.push('/verify-phone');
  
  // Show alert
  showAlert({
    title: 'Phone Verification Required',
    message: 'Please verify your phone number to access wallet features.',
    action: 'Verify Now'
  });
}
```

---

## 🧪 Testing Tips

### Development Mode
```typescript
// Use console logs to get OTP codes during development
// Check server logs for: "OTP for +255XXXXXXXXX: 123456"

// For testing, you can use a test phone number
const TEST_PHONE = '+255712000001';
```

### Production Mode
- Use real phone numbers
- Actual SMS will be sent via Africa's Talking
- Test with team members' phones first

---

## ✅ Pre-launch Checklist

Frontend Integration:
- [ ] Phone input validates format (+255XXXXXXXXX)
- [ ] OTP screen accepts 6-digit codes
- [ ] Resend button has 60-second cooldown
- [ ] Error messages display correctly
- [ ] Success states show wallet creation
- [ ] Unverified users redirected to OTP screen
- [ ] Both English and Swahili supported
- [ ] Loading states prevent double-submission
- [ ] Network errors handled gracefully
- [ ] OTP input auto-focuses and auto-submits

---

## 📞 Quick Reference

```typescript
// Signup
POST /signup
Body: { role, name, phone_number, password, language, ... }
Response: { status, user_id, message }

// Verify OTP
POST /verify
Body: { user_id, otp_code, method: "phone" }
Response: { status, message, next_step }

// Resend OTP
POST /resend-otp
Body: { user_id, method: "phone" }
Response: { status, message }
```

---

## 🎉 What Happens After Verification

1. ✅ Phone marked as confirmed in Supabase Auth
2. ✅ Wallet automatically created (TZS balance: 0)
3. ✅ User can access all wallet features
4. ✅ User can deposit, send, receive payments
5. ✅ User can use marketplace with payments
6. ✅ Transaction SMS alerts enabled

---

## 💡 Pro Tips

1. **Auto-focus OTP input** when screen loads
2. **Auto-submit** when 6 digits entered
3. **Clear input** on error for easy retry
4. **Show phone number** clearly on OTP screen
5. **Countdown timer** for resend button UX
6. **Success animation** on verification
7. **Haptic feedback** on mobile devices
8. **Accessibility**: Screen reader support
9. **Rate limiting**: Prevent spam clicks
10. **Analytics**: Track OTP success rates

---

Need help? Check server logs or contact the backend team! 🚀
