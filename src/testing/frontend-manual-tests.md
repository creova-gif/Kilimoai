# 🧪 KILIMO FRONTEND MANUAL TESTING GUIDE

**Purpose:** Validate frontend functionality before production launch  
**Time Required:** 30-45 minutes  
**Devices Needed:** Desktop browser + Mobile device (iOS/Android)

---

## 📋 PRE-TEST SETUP

### Requirements
- [ ] Backend deployed and running
- [ ] Africa's Talking SMS configured
- [ ] Test Tanzania phone number available (+255...)
- [ ] Desktop browser (Chrome/Firefox/Safari)
- [ ] Mobile device (iPhone or Android)

### Test Data
```
Test Phone: +255712345678 (use your real number)
Test Password: TestPass123!
Test Name: QA Tester
Test Farm Size: 2.5 hectares
Test Crops: Maize, Beans
```

---

## 🎯 CRITICAL PATH TESTS (Must Pass)

### TEST 1: Signup Flow ⛔ BLOCKER
**Objective:** Verify complete signup → OTP → dashboard flow

**Steps:**
1. Open app in browser
2. Click "Register" or "Create Account"
3. Fill signup form:
   - Name: QA Tester
   - Phone: [Your real +255 number]
   - Password: TestPass123!
   - Role: Smallholder Farmer
   - Farm Size: 2.5
   - Crops: Select Maize and Beans
4. Submit form

**Expected Results:**
- ✅ Form submits without errors
- ✅ OTP verification screen appears
- ✅ SMS received within 30 seconds
- ✅ OTP is 6 digits

**Pass Criteria:** All ✅ must pass  
**On Failure:** BLOCKER - Do not proceed to production

---

### TEST 2: OTP Verification ⛔ BLOCKER
**Objective:** Verify OTP input and validation

**Steps:**
1. On OTP screen, observe 6-digit input
2. Enter correct OTP from SMS
3. Wait for auto-submit (should submit when 6th digit entered)

**Expected Results:**
- ✅ Input auto-focused on page load
- ✅ Auto-submits after 6th digit
- ✅ Success animation plays
- ✅ Redirects to dashboard after ~1.5s
- ✅ User name displays on dashboard
- ✅ Wallet balance shows 0 TZS

**Pass Criteria:** All ✅ must pass  
**On Failure:** BLOCKER - Fix before production

---

### TEST 3: Invalid OTP Handling
**Objective:** Verify error handling

**Steps:**
1. Signup with new phone number
2. On OTP screen, enter wrong code: 000000
3. Observe error message

**Expected Results:**
- ✅ Error message displays clearly: "Invalid OTP"
- ✅ Input clears automatically
- ✅ Input re-focuses for retry
- ✅ Can enter new OTP
- ✅ Correct OTP works after invalid attempt

**Pass Criteria:** All ✅ must pass

---

### TEST 4: OTP Resend
**Objective:** Verify resend functionality

**Steps:**
1. Signup with new phone number
2. On OTP screen, wait 5 seconds
3. Click "Resend OTP" button
4. Observe countdown timer

**Expected Results:**
- ✅ Button disabled for 30 seconds
- ✅ Countdown displays correctly (30, 29, 28...)
- ✅ New SMS received
- ✅ New OTP code works
- ✅ Resend count increments (shows 1/3, then 2/3)
- ✅ After 3 resends, shows limit message

**Pass Criteria:** All ✅ must pass

---

### TEST 5: Expired OTP
**Objective:** Verify expiry handling

**Steps:**
1. Signup with new phone number
2. Wait 11+ minutes (or temporarily change backend expiry to 1 min for testing)
3. Enter OTP code

**Expected Results:**
- ✅ Error message: "OTP has expired"
- ✅ Resend button enabled
- ✅ Clicking resend gets new OTP
- ✅ New OTP works correctly

**Pass Criteria:** All ✅ must pass

---

### TEST 6: Wallet Access (Unverified) ⛔ BLOCKER
**Objective:** Verify unverified users are blocked

**Steps:**
1. Signup but DON'T verify OTP
2. Close OTP screen (if possible) or refresh page
3. Try to access wallet/payments

**Expected Results:**
- ✅ Wallet features blocked
- ✅ Error message: "Phone verification required"
- ✅ Redirected to OTP screen
- ✅ After verification, access granted

**Pass Criteria:** All ✅ must pass  
**On Failure:** BLOCKER - Security issue

---

## 📱 MOBILE RESPONSIVENESS TESTS

### TEST 7: Mobile Signup (iOS/Android)
**Device:** iPhone or Android smartphone

**Steps:**
1. Open app on mobile browser
2. Complete signup flow
3. Verify OTP

**Expected Results:**
- ✅ Form fields large enough for touch (min 44x44px)
- ✅ No zoom when focusing inputs
- ✅ Numeric keyboard shows for OTP input
- ✅ Buttons easy to tap
- ✅ No horizontal scrolling
- ✅ All text readable
- ✅ Success animation plays smoothly

**Pass Criteria:** All ✅ must pass

---

### TEST 8: Mobile OTP Input
**Device:** iPhone or Android smartphone

**Steps:**
1. Reach OTP screen on mobile
2. Tap OTP input
3. Enter 6 digits

**Expected Results:**
- ✅ Numeric keyboard appears
- ✅ Input boxes large enough (min 48x48px)
- ✅ Easy to see which box is active
- ✅ Auto-advance between boxes
- ✅ Backspace works correctly
- ✅ Paste from clipboard works
- ✅ Auto-submit after 6 digits

**Pass Criteria:** All ✅ must pass

---

## 🌍 LOCALIZATION TESTS

### TEST 9: English Language
**Objective:** Verify English translations

**Steps:**
1. Set language to English
2. Complete signup flow
3. Observe all text

**Expected Results:**
- ✅ Signup form in English
- ✅ OTP screen in English
- ✅ Error messages in English
- ✅ Button labels in English
- ✅ No Swahili text visible
- ✅ SMS message in English

**Pass Criteria:** All ✅ must pass

---

### TEST 10: Swahili Language
**Objective:** Verify Swahili translations

**Steps:**
1. Set language to Swahili
2. Complete signup flow
3. Observe all text

**Expected Results:**
- ✅ Signup form in Swahili
- ✅ OTP screen in Swahili
- ✅ Error messages in Swahili
- ✅ Button labels in Swahili
- ✅ No English text visible
- ✅ SMS message in Swahili

**Pass Criteria:** All ✅ must pass

---

### TEST 11: Language Toggle
**Objective:** Verify language switching

**Steps:**
1. Start with English
2. Switch to Swahili mid-signup
3. Complete signup in Swahili
4. Switch back to English on dashboard

**Expected Results:**
- ✅ Language changes immediately
- ✅ No mixed language screens
- ✅ Form data preserved during toggle
- ✅ All screens update correctly

**Pass Criteria:** All ✅ must pass

---

## 🎨 UI/UX TESTS

### TEST 12: Loading States
**Objective:** Verify loading indicators

**Steps:**
1. Submit signup form
2. Observe loading state
3. Submit OTP
4. Observe loading state

**Expected Results:**
- ✅ Loading spinner shows
- ✅ Buttons disabled during loading
- ✅ Form inputs disabled during loading
- ✅ Loading text displays ("Verifying...")
- ✅ No double-submit possible

**Pass Criteria:** All ✅ must pass

---

### TEST 13: Error Recovery
**Objective:** Verify users can recover from errors

**Steps:**
1. Submit invalid form (missing fields)
2. Fix errors
3. Submit again

**Expected Results:**
- ✅ Error messages clear and specific
- ✅ Error fields highlighted
- ✅ Can edit and resubmit
- ✅ Success after fixing errors

**Pass Criteria:** All ✅ must pass

---

### TEST 14: Back Navigation
**Objective:** Verify back button functionality

**Steps:**
1. Complete signup (OTP screen shows)
2. Click "Go Back" button
3. Edit phone number
4. Resubmit

**Expected Results:**
- ✅ Returns to signup form
- ✅ Form data preserved
- ✅ Can edit and resubmit
- ✅ New OTP sent to new number

**Pass Criteria:** All ✅ must pass

---

## 🔒 SECURITY TESTS

### TEST 15: OTP Security
**Objective:** Verify OTP not exposed

**Steps:**
1. Complete signup
2. Open browser DevTools (F12)
3. Check Console and Network tabs

**Expected Results:**
- ✅ OTP not logged to console
- ✅ OTP not visible in network requests (should be in response, not logged)
- ✅ OTP not stored in localStorage
- ✅ OTP clears after use

**Pass Criteria:** All ✅ must pass

---

### TEST 16: Password Security
**Objective:** Verify password handling

**Steps:**
1. Enter password in signup form
2. Inspect page source (View Source)

**Expected Results:**
- ✅ Password input type="password"
- ✅ Password hidden with dots
- ✅ Password not visible in page source
- ✅ No password in URL

**Pass Criteria:** All ✅ must pass

---

## 🌐 NETWORK TESTS

### TEST 17: Slow Network (3G)
**Objective:** Verify performance on slow connection

**Steps:**
1. Open Chrome DevTools
2. Network tab → Throttling → Slow 3G
3. Complete signup flow

**Expected Results:**
- ✅ App still functions (may be slow)
- ✅ Loading indicators show
- ✅ No timeouts
- ✅ SMS arrives (may take longer)
- ✅ Error messages if request fails

**Pass Criteria:** App functional (allowed to be slow)

---

### TEST 18: Offline Mode
**Objective:** Verify offline handling

**Steps:**
1. Turn off internet/wifi
2. Try to submit signup form
3. Try to verify OTP

**Expected Results:**
- ✅ Clear error message: "Network error"
- ✅ Doesn't crash
- ✅ Can retry when back online
- ✅ User understands what happened

**Pass Criteria:** All ✅ must pass

---

## 📊 TEST RESULTS TRACKER

### Critical Path Results
```
[ ] TEST 1: Signup Flow
[ ] TEST 2: OTP Verification
[ ] TEST 3: Invalid OTP Handling
[ ] TEST 4: OTP Resend
[ ] TEST 5: Expired OTP
[ ] TEST 6: Wallet Access (Unverified)

CRITICAL PASS RATE: __/6 (must be 6/6 to launch)
```

### Mobile Results
```
[ ] TEST 7: Mobile Signup
[ ] TEST 8: Mobile OTP Input

MOBILE PASS RATE: __/2 (must be 2/2 to launch)
```

### Localization Results
```
[ ] TEST 9: English Language
[ ] TEST 10: Swahili Language
[ ] TEST 11: Language Toggle

LOCALIZATION PASS RATE: __/3 (recommended 3/3)
```

### UI/UX Results
```
[ ] TEST 12: Loading States
[ ] TEST 13: Error Recovery
[ ] TEST 14: Back Navigation

UI/UX PASS RATE: __/3 (recommended 3/3)
```

### Security Results
```
[ ] TEST 15: OTP Security
[ ] TEST 16: Password Security

SECURITY PASS RATE: __/2 (must be 2/2 to launch)
```

### Network Results
```
[ ] TEST 17: Slow Network
[ ] TEST 18: Offline Mode

NETWORK PASS RATE: __/2 (recommended 2/2)
```

---

## 🎯 GO/NO-GO CRITERIA

### ✅ MUST PASS (BLOCKERS)
All of these must pass to launch:
- Critical Path: 6/6 ✅
- Mobile: 2/2 ✅
- Security: 2/2 ✅

### ⚠️ SHOULD PASS (HIGH PRIORITY)
These should pass but can be fixed post-launch:
- Localization: 3/3
- UI/UX: 3/3
- Network: 2/2

### 📊 OVERALL SCORE

**Total Tests:** 18  
**Tests Passed:** __/18  
**Pass Rate:** __%

**Launch Decision:**
- 100%: ✅ Perfect! Launch immediately
- 90-99%: ✅ Launch (fix minor issues post-launch)
- 80-89%: ⚠️ Launch with caution (prioritize fixes)
- <80%: ⛔ DO NOT LAUNCH (fix critical issues first)

---

## 🐛 COMMON ISSUES & FIXES

### Issue: OTP Not Received
**Possible Causes:**
- Africa's Talking not configured
- Wrong phone number format
- Insufficient SMS credits
- Network/carrier issues

**Fix:**
1. Check Supabase secrets for AFRICAS_TALKING_API_KEY
2. Verify phone format: +255XXXXXXXXX
3. Check Africa's Talking dashboard for delivery status
4. Top up credits if needed

---

### Issue: "Network Error" on Submit
**Possible Causes:**
- Backend not deployed
- Wrong API_BASE URL
- CORS issues
- Server down

**Fix:**
1. Check API_BASE in /utils/supabase/info.tsx
2. Test health endpoint: curl $API_BASE/health
3. Check Supabase logs for errors
4. Verify CORS headers in server

---

### Issue: OTP Input Not Showing
**Possible Causes:**
- Component not imported
- input-otp UI component missing

**Fix:**
1. Run: npx shadcn@latest add input-otp
2. Verify import in OTPVerificationScreen.tsx
3. Check browser console for errors

---

### Issue: Auto-Submit Not Working
**Possible Causes:**
- useEffect dependency missing
- Loading state blocking

**Fix:**
1. Check useEffect in OTPVerificationScreen.tsx line ~121
2. Ensure dependency: [otp]
3. Check loading state not stuck

---

## 📋 TEST SESSION LOG

**Date:** __________  
**Tester:** __________  
**Device(s):** __________  
**Browser(s):** __________  

**Issues Found:**
```
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________
```

**Blockers:**
```
□ None found
□ Issues listed above
```

**Recommendations:**
```
___________________________________________________
___________________________________________________
___________________________________________________
```

**Final Decision:**
```
□ APPROVED FOR LAUNCH
□ APPROVED WITH FIXES
□ NOT APPROVED - FIX BLOCKERS FIRST
```

**Signature:** __________  
**Date:** __________

---

**Testing Duration:** ~30-45 minutes  
**Priority:** CRITICAL  
**Frequency:** Before each deployment

