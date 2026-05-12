# 🧪 ONBOARDING V3 - COMPLETE TESTING GUIDE

**Status:** Ready for QA  
**Architecture:** 2-Screen Flow + Post-Onboarding Features  
**Test Duration:** 15-20 minutes  

---

## 📋 WHAT TO TEST

### **1. Core Onboarding Flow (2 Screens)**
- RoleSelection.tsx
- PhoneVerification.tsx

### **2. Post-Onboarding Features**
- PostOnboardingPersonalization.tsx (dashboard modal)
- ContextualWalletSetup.tsx (triggered by action)

### **3. Integration**
- Full user journey
- localStorage persistence
- Error handling

---

## 🚀 QUICK START

### **Option A: Use Test Component**

```tsx
import { OnboardingTest } from './components/onboarding-v3/OnboardingTest';

// In your App.tsx or test route:
<OnboardingTest />
```

**What it does:**
- Runs complete onboarding flow
- Records timing metrics
- Validates user data
- Shows test results
- Provides reset functionality

### **Option B: Use Integration Example**

```tsx
import App from './ONBOARDING_INTEGRATION_COMPLETE';

// Run the complete integrated experience
<App />
```

**What it includes:**
- Full onboarding → dashboard flow
- Post-onboarding personalization
- Contextual wallet setup
- Test mode toggle

---

## 🧪 TEST SUITE 1: CORE ONBOARDING

### **Test 1.1: Role Selection Screen**

**Steps:**
1. Open app (new user)
2. View role selection screen

**Expected Results:**
- ✅ 4 role cards display
- ✅ Icons show correctly (Wheat, Store, Truck, Briefcase)
- ✅ Bilingual text (Swahili by default)
- ✅ Hover effect works
- ✅ No purple/pink/blue colors
- ✅ Only #2E7D32 green used

**Test Roles:**
- [ ] Farmer (Mkulima)
- [ ] Buyer (Mnunuzi)
- [ ] Transporter (Msafiri)
- [ ] Agent (Wakala)

**Pass Criteria:**
- All 4 roles clickable
- Selection advances to phone screen
- Takes ~5-10 seconds

---

### **Test 1.2: Phone Verification Screen**

**Steps:**
1. Enter phone number: `712 345 678`
2. Click "Send code" (Tuma msimbo)
3. Wait for OTP
4. Enter OTP: `123456`
5. Verify completion

**Expected Results:**
- ✅ Phone input auto-formats: "712 345 678"
- ✅ Validation rejects invalid numbers
- ✅ "+255" prefix displays
- ✅ "Send code" button enables when valid
- ✅ OTP inputs appear inline (no separate screen)
- ✅ 6 OTP input boxes
- ✅ Auto-advance between boxes
- ✅ Paste support works
- ✅ Success toast shows
- ✅ Dashboard loads

**Demo Mode Behavior:**
- OTP code logs to console: `🔐 OTP Code: 123456`
- No actual SMS sent (fallback)
- Verification succeeds with any 6 digits

**Pass Criteria:**
- Phone verification completes
- User data saved to localStorage
- Welcome toast shows
- Total time: <25 seconds

---

### **Test 1.3: Error Handling**

**Test Invalid Phone:**
```
Input: "123"
Expected: "Please enter a valid phone number"
```

**Test Wrong OTP:**
```
Input: "000000"
Expected: "Invalid code. Please try again."
OTP boxes clear
Focus returns to first box
```

**Test Network Failure:**
```
Disconnect internet
Try to send OTP
Expected: Error message + graceful fallback
```

**Pass Criteria:**
- Errors display clearly
- User can retry
- No crashes

---

## 🧪 TEST SUITE 2: POST-ONBOARDING FEATURES

### **Test 2.1: Personalization Modal**

**Trigger:**
- Appears 3 seconds after onboarding
- Can be triggered from settings
- Can be triggered from "Personalize" button

**Steps:**
1. Complete onboarding
2. Wait 3 seconds
3. Personalization modal appears

**Expected Results:**
- ✅ Modal shows after delay
- ✅ Progress bar (2 steps)
- ✅ Step 1: Crop selection (multi-select)
- ✅ Step 2: Region selection (single-select)
- ✅ "Skip for now" button works
- ✅ "Next" button disabled until selection
- ✅ "Done" saves to localStorage
- ✅ Success toast shows

**Test Crops:**
- [ ] Select multiple crops
- [ ] Deselect crops
- [ ] Verify checkmarks

**Test Region:**
- [ ] Select one region
- [ ] Change selection
- [ ] Verify radio behavior

**Pass Criteria:**
- Modal closable
- Data saves correctly
- Can be skipped
- Takes ~20-30 seconds if completed

---

### **Test 2.2: Contextual Wallet Setup**

**Trigger:**
- User clicks "Deposit Money"
- User clicks "Buy Inputs"
- User tries to make payment

**Steps:**
1. Click "Deposit Money" button
2. Wallet setup modal appears
3. Review benefits
4. Click "Set up wallet"

**Expected Results:**
- ✅ Modal shows instantly
- ✅ 3 trust indicators display
- ✅ "Why do I need a wallet?" section
- ✅ "Maybe later" button works
- ✅ Loading state during setup
- ✅ Success animation
- ✅ Auto-closes after 2 seconds
- ✅ Wallet initialized in user data

**Test Skip Behavior:**
```
1. Click "Maybe later"
2. Modal closes
3. Try deposit again
4. Modal shows again (not persistent skip)
```

**Pass Criteria:**
- Wallet creates successfully
- Can be skipped
- Re-prompts on next transaction
- Takes ~5-10 seconds

---

## 🧪 TEST SUITE 3: INTEGRATION & DATA

### **Test 3.1: localStorage Persistence**

**Keys to Check:**
```javascript
localStorage.getItem('kilimoUser')
localStorage.getItem('kilimoLanguage')
localStorage.getItem('kilimoSeenWelcome')
localStorage.getItem('kilimoPersonalization')
```

**User Data Structure:**
```json
{
  "id": "uuid-string",
  "phone": "+255712345678",
  "role": "farmer",
  "language": "sw",
  "onboardingCompleted": true,
  "onboardingCompletedAt": "2026-02-07T...",
  "personalizationCompleted": false,
  "walletInitialized": false,
  "preferences": {
    "crops": ["maize", "rice"],
    "region": "arusha"
  }
}
```

**Tests:**
- [ ] Data saves after onboarding
- [ ] Data persists on page reload
- [ ] Data updates after personalization
- [ ] Data updates after wallet setup

---

### **Test 3.2: Complete User Journey**

**Full Flow Test:**

```
1. NEW USER
   → Opens app
   → Sees RoleSelection
   
2. SELECT ROLE
   → Clicks "Farmer"
   → Advances to PhoneVerification
   
3. VERIFY PHONE
   → Enters: 712 345 678
   → Sends OTP
   → Enters: 123456
   → Verification succeeds
   
4. DASHBOARD
   → Welcome toast appears
   → Dashboard loads
   → User data in state
   
5. PERSONALIZATION (3 sec delay)
   → Modal appears
   → Selects crops
   → Selects region
   → Saves preferences
   
6. WALLET SETUP (when needed)
   → Clicks "Deposit Money"
   → Wallet modal appears
   → Sets up wallet
   → Wallet initialized
   
7. RETURNING USER
   → Refreshes page
   → Lands on dashboard (no onboarding)
   → All data persists
```

**Pass Criteria:**
- Complete flow without errors
- Total time: ~60-90 seconds
- All data persists
- No color violations

---

## 🧪 TEST SUITE 4: MOBILE RESPONSIVENESS

### **Test 4.1: Mobile Viewport**

**Device Sizes to Test:**
- iPhone SE (375x667)
- iPhone 12 (390x844)
- Android (360x740)
- iPad (768x1024)

**Tests:**
- [ ] Role cards stack on mobile
- [ ] Phone input fits screen
- [ ] OTP boxes don't overflow
- [ ] Modals are scrollable
- [ ] Buttons accessible
- [ ] Text readable (no truncation)

---

### **Test 4.2: Touch Interactions**

**Tests:**
- [ ] Role cards tap correctly
- [ ] OTP inputs work with keyboard
- [ ] Paste works on mobile
- [ ] Modal close X is tappable
- [ ] Buttons have tap feedback
- [ ] No double-tap issues

---

## 🧪 TEST SUITE 5: PERFORMANCE

### **Test 5.1: Speed Metrics**

**Targets:**

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to Role Screen | <1 sec | Page load → role screen |
| Role → Phone Screen | <0.5 sec | Click role → phone screen |
| OTP Send | <3 sec | Click send → OTP received |
| OTP Verify | <2 sec | Enter code → dashboard |
| **Total Onboarding** | **<30 sec** | Start → dashboard |
| Personalization | <30 sec | If completed |
| Wallet Setup | <10 sec | Modal → created |

**How to Measure:**
```javascript
// Use OnboardingTest component
// It automatically tracks timing
<OnboardingTest />

// Or manually:
const startTime = Date.now();
// ... complete flow ...
const endTime = Date.now();
const duration = (endTime - startTime) / 1000;
console.log(`Onboarding took ${duration}s`);
```

---

### **Test 5.2: Network Conditions**

**Test on Slow 3G:**
1. Chrome DevTools → Network → Slow 3G
2. Run onboarding
3. Verify graceful degradation

**Expected:**
- Loading states show
- No crashes
- Timeouts handled
- Error messages clear

---

## 🧪 TEST SUITE 6: ACCESSIBILITY

### **Test 6.1: Keyboard Navigation**

**Tests:**
- [ ] Tab through role cards
- [ ] Tab through OTP inputs
- [ ] Enter key submits
- [ ] Escape closes modals
- [ ] Focus indicators visible

---

### **Test 6.2: Screen Readers**

**Tests:**
- [ ] Role cards have labels
- [ ] Phone input labeled
- [ ] OTP inputs labeled
- [ ] Error messages announced
- [ ] Success toasts announced

---

## 🧪 TEST SUITE 7: BROWSER COMPATIBILITY

### **Desktop Browsers:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### **Mobile Browsers:**
- [ ] Safari iOS
- [ ] Chrome Android
- [ ] Firefox Android

---

## 🧪 TEST SUITE 8: REGRESSION TESTS

### **Test 8.1: Deleted Components**

**Verify these DO NOT appear:**
- ❌ SoftPowerEntry (splash screen)
- ❌ VoiceWelcome (AI intro)
- ❌ AIPersonalization (4 questions during onboarding)
- ❌ WalletSetup (forced wallet during onboarding)
- ❌ SuccessLaunch (confetti celebration)

**How to Check:**
```bash
# Search codebase for references:
grep -r "VoiceWelcome" src/
grep -r "SuccessLaunch" src/
# Should return 0 results in .tsx files
```

---

### **Test 8.2: Color Compliance**

**Check for violations:**
```bash
# Search for forbidden colors:
grep -r "purple\|pink\|blue\|orange\|teal\|indigo" src/components/onboarding-v3/
# Should return 0 results
```

**Allowed Colors Only:**
- #2E7D32 (Raspberry Leaf Green)
- #1B5E20 (Darker green)
- #E8F5E9 (Light green background)
- Gray scale (white, gray-50, gray-600, gray-900)

**Visual Check:**
- Open each screen
- Use browser inspector
- Verify computed colors
- No purple, pink, blue anywhere

---

## 📊 TEST RESULTS TEMPLATE

```markdown
## Test Session: [DATE]
**Tester:** [NAME]
**Environment:** [Chrome/Firefox/Safari/Mobile]
**Duration:** [MINUTES]

### Core Onboarding
- [ ] Role Selection: PASS / FAIL
- [ ] Phone Verification: PASS / FAIL
- [ ] Error Handling: PASS / FAIL
- [ ] Time to Dashboard: [SECONDS]

### Post-Onboarding
- [ ] Personalization Modal: PASS / FAIL
- [ ] Contextual Wallet: PASS / FAIL

### Integration
- [ ] localStorage: PASS / FAIL
- [ ] Full Journey: PASS / FAIL

### Performance
- [ ] Speed: PASS / FAIL
- [ ] Network: PASS / FAIL

### Issues Found:
1. [Description]
2. [Description]

### Overall: PASS / FAIL
```

---

## 🐛 COMMON ISSUES & SOLUTIONS

### **Issue: OTP not received**
**Solution:** Check console for demo OTP code  
**Expected:** `🔐 OTP Code: 123456`

### **Issue: Modal won't close**
**Solution:** Click X button or click outside modal  
**Check:** onClick handlers in ContextualWalletSetup

### **Issue: Colors look wrong**
**Solution:** Clear browser cache, check CSS  
**Verify:** Only #2E7D32 used

### **Issue: localStorage not saving**
**Solution:** Check browser privacy settings  
**Verify:** Cookies/storage enabled

### **Issue: Phone validation fails**
**Solution:** Must start with 6 or 7, 9 digits total  
**Example:** 712 345 678 (valid), 123 456 789 (invalid)

---

## ✅ FINAL CHECKLIST

Before marking as production-ready:

- [ ] All test suites pass
- [ ] No console errors
- [ ] No color violations
- [ ] Mobile works perfectly
- [ ] Performance meets targets
- [ ] localStorage persists
- [ ] Error handling works
- [ ] Bilingual text correct
- [ ] Accessibility passes
- [ ] Browser compatibility verified
- [ ] Deleted components gone
- [ ] Documentation complete

---

## 🚀 READY FOR PRODUCTION

Once all tests pass:

1. **Tag the release:**
   ```bash
   git tag -a v3.0.0 -m "Onboarding V3: 2-screen flow"
   git push origin v3.0.0
   ```

2. **Deploy to staging:**
   - Test with real users
   - Collect feedback
   - Monitor completion rates

3. **Deploy to production:**
   - Enable for 10% of users
   - Monitor metrics
   - Gradually roll out to 100%

4. **Track KPIs:**
   - Completion rate (target: >80%)
   - Time to dashboard (target: <35s)
   - User feedback
   - Drop-off points

---

**Testing complete? Ship it!** 🎉
