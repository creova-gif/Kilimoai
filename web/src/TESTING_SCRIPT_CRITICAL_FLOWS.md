# 🧪 CRITICAL FLOWS TESTING SCRIPT
## Manual QA Checklist for Production Launch

**Purpose:** Verify all critical fixes work correctly before launch  
**Time Required:** 45-60 minutes  
**Tester Role:** QA Engineer or Product Manager  
**Environment:** Production-like (real backend, real SMS)

---

## 🎯 PRE-TEST SETUP

### Required:
- [ ] Real Tanzania phone number (+255XXXXXXXXX)
- [ ] SMS receiving capability
- [ ] Computer with internet connection
- [ ] Notebook to record test results
- [ ] Browser: Chrome/Firefox (latest version)
- [ ] Clear browser cache before starting

### Backend Requirements:
- [ ] Supabase backend is running
- [ ] Africa's Talking SMS credentials configured
- [ ] Database is accessible
- [ ] All environment variables set

---

## TEST SUITE 1: AUTHENTICATION & OTP FLOW ✅ (NEW FIX)

### Test 1.1: New User Registration with OTP

**Objective:** Verify OTP flow works end-to-end

**Steps:**
1. Open app in browser (clear cache first!)
2. Click "Don't have an account? Register"
3. Fill registration form:
   - Name: "Test Farmer One"
   - Phone: +255XXX XXX XXX (YOUR real number)
   - Role: "Smallholder Farmer"
   - Region: "Arusha"
   - Password: "Test123!"
4. Click "Register"

**Expected Results:**
- [ ] Form validates correctly
- [ ] "Account created! Please verify your phone number" toast appears
- [ ] OTP verification screen shows
- [ ] SMS received on phone within 60 seconds
- [ ] OTP is 6 digits
- [ ] SMS says "KILIMO verification code: XXXXXX"

**Pass/Fail:** ___________

**If Failed, Note Error:** ________________________________

---

### Test 1.2: OTP Verification

**Steps:**
1. From OTP screen (previous test)
2. Enter the 6-digit code from SMS
3. Click "Verify"

**Expected Results:**
- [ ] "Phone verified! Welcome to KILIMO" toast appears
- [ ] User redirected to main dashboard
- [ ] Header shows user name: "Test Farmer One"
- [ ] Role badge shows "Smallholder Farmer"

**Pass/Fail:** ___________

**Backend Verification:**
- [ ] Check database: `user` record exists with `phone_verified = true`
- [ ] Check database: `wallet` record auto-created for user
- [ ] Wallet balance is TZS 0

---

### Test 1.3: OTP Resend

**Steps:**
1. Register with different phone
2. On OTP screen, click "Resend Code"
3. Wait for new SMS

**Expected Results:**
- [ ] "OTP resent" toast appears
- [ ] New SMS received within 60 seconds
- [ ] New OTP code (different from first)
- [ ] Old OTP code no longer works
- [ ] Can verify with new code

**Pass/Fail:** ___________

---

### Test 1.4: Invalid OTP

**Steps:**
1. Register with different phone
2. Enter wrong OTP: "123456"
3. Click "Verify"

**Expected Results:**
- [ ] "Invalid OTP" error message shows
- [ ] User stays on OTP screen
- [ ] Can try again
- [ ] After 3 wrong attempts: "Too many attempts" error

**Pass/Fail:** ___________

---

### Test 1.5: Expired OTP

**Steps:**
1. Register with phone
2. Wait 11 minutes
3. Enter correct OTP
4. Click "Verify"

**Expected Results:**
- [ ] "OTP expired" error message
- [ ] Option to resend OTP
- [ ] Resend works and new OTP valid

**Pass/Fail:** ___________

---

## TEST SUITE 2: WALLET BALANCE DISPLAY ✅ (NEW FIX)

### Test 2.1: Wallet Balance Fetch

**Objective:** Verify real balance displayed (not hardcoded)

**Steps:**
1. Login as verified user
2. Navigate to "Mobile Money" or "Wallet"
3. Observe wallet balance

**Expected Results:**
- [ ] Balance shows TZS 0 (for new user)
- [ ] Balance is NOT TZS 1,450,000 (old hardcoded value)
- [ ] Loading spinner shows while fetching
- [ ] Transaction history is empty (new user)

**Pass/Fail:** ___________

---

### Test 2.2: Wallet Balance After Deposit (Manual Backend)

**Setup:** Manually add TZS 10,000 to user's wallet in database

**Steps:**
1. Add funds via database or admin panel:
   ```sql
   UPDATE wallet SET balance = 10000 WHERE user_id = 'USER_ID';
   ```
2. Refresh page
3. Check wallet balance

**Expected Results:**
- [ ] Balance shows TZS 10,000 (not TZS 0)
- [ ] Proves balance is fetched from backend

**Pass/Fail:** ___________

---

### Test 2.3: Multiple Users See Different Balances

**Setup:** Create 2 users, give them different balances

**Steps:**
1. User A: TZS 5,000
2. User B: TZS 15,000
3. Login as User A → Check balance
4. Logout, login as User B → Check balance

**Expected Results:**
- [ ] User A sees TZS 5,000
- [ ] User B sees TZS 15,000
- [ ] Each user sees their own balance (not hardcoded same value)

**Pass/Fail:** ___________

---

## TEST SUITE 3: WITHDRAW FUNCTION ✅ (NEW FIX)

### Test 3.1: Unverified User Cannot Withdraw

**Setup:** Create user but don't verify phone

**Steps:**
1. Register user but skip OTP verification (modify code temporarily)
2. Navigate to wallet
3. Try to withdraw TZS 5,000

**Expected Results:**
- [ ] Backend returns 403 error
- [ ] Toast shows: "Phone verification required"
- [ ] User prompted to verify phone
- [ ] Withdrawal does NOT process

**Pass/Fail:** ___________

---

### Test 3.2: Insufficient Balance

**Setup:** User has TZS 5,000 in wallet

**Steps:**
1. Navigate to withdraw screen
2. Enter amount: TZS 10,000
3. Enter phone: +255XXX XXX XXX
4. Select provider: M-Pesa
5. Click "Withdraw"

**Expected Results:**
- [ ] "Insufficient balance" error shows
- [ ] Withdrawal does NOT process
- [ ] Balance unchanged

**Pass/Fail:** ___________

---

### Test 3.3: Successful Withdrawal (Real M-Pesa)

**Setup:** User has TZS 10,000 in wallet

**Steps:**
1. Navigate to withdraw screen
2. Enter amount: TZS 5,000
3. Enter phone: +255XXX XXX XXX (YOUR real number)
4. Select provider: M-Pesa
5. Click "Withdraw"

**Expected Results:**
- [ ] "Withdrawal initiated!" toast shows
- [ ] M-Pesa push notification received on phone within 2 minutes
- [ ] Enter M-Pesa PIN to confirm
- [ ] Money arrives in M-Pesa account
- [ ] Wallet balance updates to TZS 5,000
- [ ] Transaction appears in history

**Pass/Fail:** ___________

**Time to M-Pesa:** _________ seconds

---

### Test 3.4: Withdrawal Network Error

**Setup:** Turn off WiFi/mobile data

**Steps:**
1. Navigate to withdraw screen
2. Fill form
3. Click "Withdraw"

**Expected Results:**
- [ ] "Network error. Please check your internet connection" toast
- [ ] Withdrawal does NOT process
- [ ] Balance unchanged
- [ ] User can retry after reconnecting

**Pass/Fail:** ___________

---

## TEST SUITE 4: MARKETPLACE LISTING ✅ (NEW FIX)

### Test 4.1: List Crop and Verify Persistence

**Steps:**
1. Login as verified user
2. Navigate to "Marketplace"
3. Click "List Crop"
4. Fill form:
   - Crop: "Maize"
   - Quantity: 100
   - Price: 800
5. Submit
6. Verify listing appears
7. **Refresh page**
8. Check if listing still there

**Expected Results:**
- [ ] "Crop listed successfully!" toast
- [ ] Listing appears in "My Listings"
- [ ] After refresh: Listing STILL there (not disappeared!)
- [ ] Other users can see listing (check with different account)

**Pass/Fail:** ___________

---

### Test 4.2: Unverified User Cannot List

**Setup:** Unverified user

**Steps:**
1. Try to list crop
2. Submit

**Expected Results:**
- [ ] "Phone verification required" error
- [ ] Listing does NOT save
- [ ] User prompted to verify

**Pass/Fail:** ___________

---

## TEST SUITE 5: OFFLINE DETECTION ✅ (NEW FIX)

### Test 5.1: Offline Indicator Shows

**Steps:**
1. Login to app
2. Turn off WiFi/mobile data
3. Wait 5 seconds

**Expected Results:**
- [ ] Orange/red banner appears at top
- [ ] Message: "Offline Mode" or "You're offline"
- [ ] Explains limited functionality

**Pass/Fail:** ___________

---

### Test 5.2: Online Recovery

**Steps:**
1. From offline state
2. Turn WiFi/mobile data back on
3. Wait 5 seconds

**Expected Results:**
- [ ] Green banner appears
- [ ] Message: "Back online!"
- [ ] Banner auto-hides after 3 seconds
- [ ] Features work normally

**Pass/Fail:** ___________

---

## TEST SUITE 6: END-TO-END USER JOURNEY

### Test 6.1: Complete Transaction Flow

**Objective:** Simulate real farmer using platform

**Scenario:**
"John is a maize farmer in Arusha. He wants to sell his harvest."

**Steps:**
1. **Register:**
   - Name: John Farmer
   - Phone: +255XXX XXX XXX
   - Role: Smallholder Farmer
   - Region: Arusha

2. **Verify Phone:**
   - Receive SMS
   - Enter OTP
   - Verify success

3. **Check Wallet:**
   - Navigate to wallet
   - Verify balance is TZS 0

4. **List Crop:**
   - Go to marketplace
   - List: Maize, 500kg, TZS 850/kg
   - Total value: TZS 425,000

5. **Simulate Sale (Manual):**
   - Add TZS 425,000 to wallet via database
   - Refresh to see balance

6. **Withdraw Earnings:**
   - Withdraw TZS 200,000 to M-Pesa
   - Verify M-Pesa received
   - Check remaining balance: TZS 225,000

**Expected Results:**
- [ ] All steps complete without errors
- [ ] User sees correct balance at each step
- [ ] SMS received for OTP
- [ ] M-Pesa received for withdrawal
- [ ] Total time: < 10 minutes

**Pass/Fail:** ___________

**Time Taken:** _________ minutes

---

## TEST SUITE 7: ERROR HANDLING

### Test 7.1: Network Timeout

**Steps:**
1. Use browser dev tools → Network tab
2. Throttle to "Slow 3G"
3. Try to load wallet balance
4. Wait 30+ seconds

**Expected Results:**
- [ ] Request times out after 30 seconds
- [ ] Error message: "Request timeout - check your connection"
- [ ] NOT infinite loading spinner

**Pass/Fail:** ___________

---

### Test 7.2: Server Error (500)

**Setup:** Temporarily break backend endpoint

**Steps:**
1. Cause 500 error (e.g., remove required env variable)
2. Try to withdraw funds
3. Observe error

**Expected Results:**
- [ ] Error message: "Server error. We've been notified."
- [ ] NOT cryptic error code
- [ ] User can retry

**Pass/Fail:** ___________

---

### Test 7.3: Rate Limit (429)

**Setup:** Make 100 AI queries quickly

**Steps:**
1. Ask Sankofa AI 100 questions rapidly
2. Check when limit hit

**Expected Results:**
- [ ] After X queries: "AI query limit reached"
- [ ] Shows limit: "You've used 100/100 queries"
- [ ] Tells when to retry: "Try again tomorrow"

**Pass/Fail:** ___________

---

## TEST SUITE 8: BILINGUAL SUPPORT

### Test 8.1: Swahili Mode

**Steps:**
1. Switch language to Swahili
2. Try to withdraw without verification
3. Check error message

**Expected Results:**
- [ ] Error in Swahili: "Thibitisha namba ya simu kwanza"
- [ ] NOT in English

**Pass/Fail:** ___________

---

### Test 8.2: Language Persistence

**Steps:**
1. Switch to Swahili
2. Logout
3. Login again
4. Check language

**Expected Results:**
- [ ] App still in Swahili (saved preference)

**Pass/Fail:** ___________

---

## 📊 TEST RESULTS SUMMARY

### Critical Flows Status:

| Test Suite | Tests Run | Passed | Failed | Pass Rate |
|------------|-----------|--------|--------|-----------|
| Authentication & OTP | 5 | ___ | ___ | ___% |
| Wallet Balance | 3 | ___ | ___ | ___% |
| Withdraw Function | 4 | ___ | ___ | ___% |
| Marketplace Listing | 2 | ___ | ___ | ___% |
| Offline Detection | 2 | ___ | ___ | ___% |
| End-to-End Journey | 1 | ___ | ___ | ___% |
| Error Handling | 3 | ___ | ___ | ___% |
| Bilingual Support | 2 | ___ | ___ | ___% |
| **TOTAL** | **22** | ___ | ___ | ___% |

---

## 🚨 CRITICAL ISSUES FOUND

**List any blocking issues here:**

1. _______________________________________________
   - Severity: Critical / High / Medium / Low
   - Steps to reproduce: _______________________
   - Expected: _______________________________
   - Actual: _________________________________

2. _______________________________________________

3. _______________________________________________

---

## ✅ LAUNCH DECISION

### Can we launch?

**YES** if:
- [ ] All critical tests pass (Suite 1-5)
- [ ] End-to-end journey works
- [ ] No critical issues found
- [ ] Pass rate > 90%

**NO** if:
- [ ] Any critical test fails
- [ ] OTP not working
- [ ] Wallet balance wrong
- [ ] Withdraw doesn't process
- [ ] Data not persisting

### Decision: **LAUNCH** / **HOLD**

### If HOLD, blockers to fix:
1. _______________________________________
2. _______________________________________
3. _______________________________________

---

## 📝 TESTER NOTES

**Date:** _____________  
**Tester Name:** _____________  
**Environment:** Production / Staging  
**Backend Version:** _____________  
**Frontend Commit:** _____________  

**Overall Impression:**
_________________________________________________
_________________________________________________
_________________________________________________

**Recommendations:**
_________________________________________________
_________________________________________________
_________________________________________________

---

## 🔄 REGRESSION TESTING (After Fixes)

If any tests failed and were fixed, re-run:

### Re-test Date: _____________

**Tests to re-run:**
- [ ] Test 1.1 - Registration with OTP
- [ ] Test 2.1 - Wallet balance fetch
- [ ] Test 3.3 - Successful withdrawal
- [ ] Test 4.1 - Marketplace listing persistence
- [ ] Test 6.1 - End-to-end journey

**Re-test Results:**
- Pass rate after fixes: ___%
- All critical tests now passing: YES / NO

---

## 📈 PERFORMANCE NOTES

**Track these during testing:**

| Action | Time Taken | Acceptable? |
|--------|------------|-------------|
| Page load (first visit) | ___ sec | < 3 sec |
| Login | ___ sec | < 2 sec |
| OTP SMS delivery | ___ sec | < 60 sec |
| Wallet balance fetch | ___ sec | < 2 sec |
| List crop (save) | ___ sec | < 3 sec |
| Withdraw initiation | ___ sec | < 5 sec |
| M-Pesa confirmation | ___ min | < 5 min |

**Any performance issues?**
_________________________________________________

---

## 🎯 NEXT STEPS

**After completing this test:**

1. **If all pass:**
   - [ ] Share results with team
   - [ ] Schedule beta test with 20 users
   - [ ] Prepare monitoring dashboards
   - [ ] Ready for launch!

2. **If some fail:**
   - [ ] Document all failures
   - [ ] Prioritize fixes (critical first)
   - [ ] Fix and re-test
   - [ ] Repeat until all pass

3. **Always:**
   - [ ] Save this test report
   - [ ] Track issues in bug tracker
   - [ ] Update documentation based on findings

---

**TESTING COMPLETE!** ✅

**Sign-off:**

Tester: _________________ Date: _______  
Product Manager: _________________ Date: _______  
Technical Lead: _________________ Date: _______

**Launch Approval:** YES / NO

