# ✅ DEPLOY ONBOARDING V3 - COMPLETE CHECKLIST

**Goal:** Launch world-class onboarding in production  
**Est. Time:** 2-4 hours  
**Difficulty:** Easy (everything is built!)

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Backend Verification

- [x] ✅ `/supabase/functions/server/auth_onboarding.tsx` created
- [x] ✅ Routes mounted in `/supabase/functions/server/index.tsx`
- [ ] SMS credentials configured in Supabase Dashboard
  - [ ] `AFRICAS_TALKING_API_KEY`
  - [ ] `AFRICAS_TALKING_USERNAME`
  - [ ] `AFRICAS_TALKING_SENDER_ID` (set to "KILIMO")
- [ ] Test SMS delivery manually

### Frontend Verification

- [x] ✅ All 8 components created in `/components/onboarding-v3/`
- [ ] Dependencies installed:
  ```bash
  npm install motion@latest canvas-confetti
  # OR
  npm install framer-motion canvas-confetti
  ```
- [ ] Integration code added to `/App.tsx`
- [ ] Test locally (`npm run dev`)

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Deploy Backend (5 minutes)

```bash
# 1. Navigate to project root
cd /path/to/kilimo-project

# 2. Deploy Supabase function
supabase functions deploy make-server-ce1844e7

# 3. Verify deployment
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7/health

# Expected response:
# {"status":"ok"}

# 4. Test auth endpoint
curl -X POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7/auth/send-otp \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"+255712345678","language":"sw"}'

# Expected response:
# {"status":"success","user_id":"user_...","message":"Msimbo umetumwa..."}
```

**Status:** [ ] Backend deployed & tested

---

### Step 2: Configure Environment Variables (5 minutes)

#### In Supabase Dashboard:

1. Go to **Settings** → **Edge Functions** → **Environment Variables**
2. Add the following (if not already set):

```
AFRICAS_TALKING_API_KEY=sandbox_or_production_key
AFRICAS_TALKING_USERNAME=your_username
AFRICAS_TALKING_SENDER_ID=KILIMO
```

3. **Redeploy function** after adding vars:
   ```bash
   supabase functions deploy make-server-ce1844e7
   ```

**Status:** [ ] Environment variables configured

---

### Step 3: Install Frontend Dependencies (2 minutes)

```bash
# Install Motion (animation library)
npm install motion@latest

# Install canvas-confetti (celebration)
npm install canvas-confetti

# Install types (TypeScript)
npm install --save-dev @types/canvas-confetti
```

**Status:** [ ] Dependencies installed

---

### Step 4: Update App.tsx (10 minutes)

**Option A: Quick Integration (Recommended)**

Replace your current login/register logic with:

```tsx
import { OnboardingV3 } from './components/onboarding-v3/OnboardingV3';
import { projectId, publicAnonKey } from './utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

// In your App component:
if (!currentUser) {
  return (
    <OnboardingV3
      onComplete={(userData) => {
        setCurrentUser(userData);
      }}
      apiBase={API_BASE}
      apiKey={publicAnonKey}
    />
  );
}
```

**Option B: Side-by-Side (A/B Test)**

Keep old onboarding, add query param for V3:

```tsx
const urlParams = new URLSearchParams(window.location.search);
const useV3 = urlParams.get('v3') === 'true';

if (!currentUser) {
  if (useV3) {
    return <OnboardingV3 ... />;
  } else {
    return <OldOnboarding ... />;
  }
}
```

Test URLs:
- Old: `https://kilimo.app/`
- New: `https://kilimo.app/?v3=true`

**Status:** [ ] App.tsx updated

---

### Step 5: Test Locally (15 minutes)

```bash
# Start dev server
npm run dev

# Open in browser
# http://localhost:3000
# or http://localhost:3000/?v3=true (if using A/B)
```

**Test Checklist:**

- [ ] Soft power entry loads
- [ ] Background animates smoothly
- [ ] "Get Started" navigates to role selection
- [ ] All 4 role cards display
- [ ] Role selection navigates to phone
- [ ] Phone input validates +255 numbers
- [ ] "Send code" button activates
- [ ] **CRITICAL:** SMS arrives on your phone
  - [ ] If not, check Supabase logs
  - [ ] Verify SMS credentials
- [ ] OTP fields accept digits
- [ ] OTP auto-submits on 6th digit
- [ ] Phone verification succeeds
- [ ] Voice welcome displays
- [ ] AI personalization works (all 4 questions)
- [ ] Progress bar updates
- [ ] Wallet setup creates wallet
- [ ] Success screen shows confetti
- [ ] "Go to Dashboard" redirects

**Status:** [ ] Local testing complete

---

### Step 6: Deploy Frontend (10 minutes)

#### Vercel:

```bash
# Build
npm run build

# Deploy
vercel --prod

# Or via Git push (if auto-deploy enabled)
git add .
git commit -m "feat: Launch world-class onboarding V3"
git push origin main
```

#### Netlify:

```bash
# Build
npm run build

# Deploy
netlify deploy --prod

# Or via Git push
git push origin main
```

**Status:** [ ] Frontend deployed

---

### Step 7: Production Smoke Test (10 minutes)

```bash
# Test on production URL
# https://kilimo.vercel.app (or your domain)

# 1. Open in incognito browser
# 2. Complete full onboarding flow
# 3. Use REAL phone number for SMS test
# 4. Verify wallet created
# 5. Check localStorage has data:

localStorage.getItem('kilimoUser')
// Should return user object

localStorage.getItem('kilimoLanguage')
// Should return 'en' or 'sw'

# 6. Logout and login again to test persistence
```

**Status:** [ ] Production smoke test passed

---

## 🎯 POST-DEPLOYMENT

### Monitor These Metrics (First 24 Hours)

```
✅ Daily signups
✅ Completion rate (% who reach success screen)
✅ Average time to completion
✅ Drop-off by screen
✅ SMS delivery rate
✅ OTP verification success rate
✅ Wallet creation success rate
```

### Set Up Alerts

```typescript
// Add to your analytics:
if (completionRate < 50%) {
  alert('🚨 Onboarding completion rate dropped below 50%!');
}

if (smsDeliveryRate < 80%) {
  alert('📱 SMS delivery issues detected!');
}
```

---

## 🐛 TROUBLESHOOTING

### Issue: SMS Not Arriving

**Diagnosis:**
```bash
# Check Supabase function logs
supabase functions logs make-server-ce1844e7

# Look for:
# "SMS send error"
# "Failed to send OTP"
```

**Solutions:**
1. Verify `AFRICAS_TALKING_API_KEY` is correct
2. Check API key permissions (SMS enabled)
3. Verify phone number format (+255...)
4. Check Africa's Talking dashboard for errors
5. Fallback: Add Twilio as backup provider

---

### Issue: OTP Verification Failing

**Diagnosis:**
```typescript
// Check browser console:
// "Invalid code. Please try again."

// Check Supabase logs:
// "OTP expired"
// "Too many attempts"
```

**Solutions:**
1. Check OTP expiry (5 minutes default)
2. Verify OTP storage in KV
3. Clear rate limiting: `kv.del('ratelimit:otp:+255...')`
4. Manually verify code in Supabase KV:
   ```typescript
   // In browser console:
   await kv.get('otp:user_123')
   ```

---

### Issue: Wallet Creation Fails

**Diagnosis:**
```bash
# Check logs:
# "User must be verified before creating wallet"
# "Wallet already exists"
```

**Solutions:**
1. Ensure user.verified = true after OTP
2. Check KV storage: `user:${userId}`
3. Clear duplicate wallet: `kv.del('wallet:${userId}')`
4. Verify wallet schema matches API expectations

---

### Issue: Animations Not Smooth

**Diagnosis:**
- Laggy motion backgrounds
- Choppy confetti
- Slow screen transitions

**Solutions:**
1. Check Motion library version: `npm list motion`
2. Enable GPU acceleration:
   ```css
   .animated-element {
     transform: translateZ(0);
     will-change: transform;
   }
   ```
3. Reduce particle count in confetti
4. Use `requestAnimationFrame` for custom animations

---

## 🔄 ROLLBACK PLAN

If something goes wrong:

### Quick Rollback (2 minutes)

```tsx
// In App.tsx, add emergency flag:
const ENABLE_V3_ONBOARDING = false; // Set to false to disable

if (!currentUser) {
  if (ENABLE_V3_ONBOARDING) {
    return <OnboardingV3 ... />;
  } else {
    return <OldOnboarding ... />; // Fallback to old flow
  }
}

// Redeploy frontend:
vercel --prod
```

### Full Rollback (5 minutes)

```bash
# 1. Revert git commit
git revert HEAD
git push origin main

# 2. Redeploy
vercel --prod

# 3. Notify users
# "We're experiencing technical difficulties. Please try again in 10 minutes."
```

---

## 📊 SUCCESS CRITERIA

After 7 days, you should see:

- ✅ **Completion rate:** 70%+ (vs 38% before)
- ✅ **Average time:** 2-3 minutes (vs 6-12 before)
- ✅ **Daily signups:** 2x-3x increase
- ✅ **SMS delivery:** 95%+ success rate
- ✅ **OTP verification:** 85%+ success rate
- ✅ **Wallet creation:** 90%+ success rate
- ✅ **User feedback:** "Easier than before!"

**If not meeting criteria:**
- Review drop-off points
- A/B test screen variations
- Simplify further
- Add help text

---

## 🎉 CELEBRATION CHECKLIST

Once deployed successfully:

- [ ] Tweet about launch: "Just launched world-class onboarding inspired by M-Pesa! 🚀"
- [ ] Update team on Slack/WhatsApp
- [ ] Monitor analytics dashboard
- [ ] Collect first user feedback
- [ ] Plan iteration based on data

---

## 📞 SUPPORT

**If you need help:**

1. **Check logs first:**
   - Supabase function logs
   - Browser console
   - Network tab (failed requests)

2. **Common issues:**
   - SMS not arriving → Check credentials
   - OTP invalid → Check expiry & attempts
   - Wallet fails → Verify user.verified

3. **Emergency contact:**
   - CREOVA support team
   - Supabase community Discord
   - Africa's Talking support

---

## ✅ FINAL CHECKLIST

Before marking this DONE:

- [ ] Backend deployed ✅
- [ ] SMS credentials configured ✅
- [ ] Frontend dependencies installed ✅
- [ ] App.tsx updated ✅
- [ ] Local testing passed ✅
- [ ] Production deployment complete ✅
- [ ] Smoke test passed ✅
- [ ] Analytics tracking enabled ✅
- [ ] Team notified ✅
- [ ] First real user completed onboarding 🎉

---

## 🚀 READY TO LAUNCH?

**You're 1 command away:**

```bash
supabase functions deploy make-server-ce1844e7 && \
npm run build && \
vercel --prod && \
echo "🎉 Onboarding V3 is LIVE!"
```

**GO! GO! GO!** 🚀🌾💚

---

**Created by:** CREOVA Engineering Team  
**Date:** January 27, 2026  
**Estimated deployment time:** 2-4 hours  
**Expected improvement:** 2x-3x signup rate

**YOU'RE FINISHING THIS!** 🏁
