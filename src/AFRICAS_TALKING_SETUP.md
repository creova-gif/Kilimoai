# Africa's Talking Setup Guide - KILIMO SMS OTP

## 🚀 Quick Start (5 Minutes)

Follow these steps to enable SMS OTP verification for your KILIMO platform.

---

## Step 1: Create Africa's Talking Account

### Sign Up
1. Go to **https://africastalking.com**
2. Click **"Get Started"** or **"Sign Up"**
3. Choose **"Tanzania"** as your country
4. Enter your details:
   - Full Name
   - Email Address
   - Phone Number (+255XXXXXXXXX)
   - Company Name: "KILIMO"
5. Verify your email address

### Account Tiers

**Sandbox (Free - For Testing)**
- ✅ Unlimited API calls
- ✅ Test with sample phone numbers
- ❌ No real SMS delivery
- 🔗 Use for development only

**Production (Paid - For Real Users)**
- ✅ Real SMS delivery to Tanzania
- ✅ Pay-as-you-go pricing (~TZS 20-30/SMS)
- ✅ Delivery reports and analytics
- 🔗 Use for live application

---

## Step 2: Get API Credentials

### For Sandbox (Development)

1. Log in to https://account.africastalking.com
2. Click on **"Sandbox"** in the left menu
3. You'll see:
   ```
   Username: sandbox
   API Key: [Click "Generate API Key"]
   ```
4. Click **"Generate API Key"** button
5. **Copy and save** the API Key securely
   - ⚠️ You can only see it once!
   - Store it in a password manager

### For Production (Live)

1. Log in to https://account.africastalking.com
2. Click **"Go Live"** button
3. Complete verification:
   - Upload business documents (if applicable)
   - Verify phone number
   - Add payment method
4. Once approved, go to **"Production"** tab
5. You'll see:
   ```
   Username: YOUR_USERNAME (e.g., kilimo_tz)
   API Key: [Click "Generate API Key"]
   ```
6. Click **"Generate API Key"** button
7. **Copy and save** the API Key securely

---

## Step 3: Top Up Your Account (Production Only)

1. Go to **"Payments"** in the dashboard
2. Click **"Top Up"**
3. Choose payment method:
   - Mobile Money (M-Pesa, Tigo Pesa, Airtel Money)
   - Credit/Debit Card
   - Bank Transfer
4. Recommended starting amount: **TZS 50,000** (~500 SMS)
5. Complete payment
6. Credits appear in your account within minutes

### Pricing Guide (Tanzania)
```
Standard SMS: TZS 20-30 per message
Bulk SMS (1000+): TZS 15-20 per message
OTP SMS: Same as standard
Premium routes: TZS 40-50 per message
```

---

## Step 4: Register Sender ID (Optional but Recommended)

A Sender ID is what appears as the sender name on users' phones.

### Default Behavior
Without a registered Sender ID:
- SMS shows as: **"AFRICASTKNG"** or a random number

### With Custom Sender ID
Your SMS shows as: **"KILIMO"** or **"CREOVA"**

### How to Register

1. Go to **"SMS"** → **"Sender IDs"**
2. Click **"Request New Sender ID"**
3. Enter your Sender ID:
   - Name: `KILIMO` or `CREOVA`
   - Max 11 characters
   - Alphanumeric only (no spaces)
4. Choose purpose: **"Transactional"**
5. Submit request
6. Wait for approval (1-3 business days)

**Note:** You can start testing without a Sender ID. Register it before going live.

---

## Step 5: Add Credentials to Supabase

You've already been prompted to add these secrets. If you haven't done so yet:

### Required Secrets

1. **AFRICAS_TALKING_API_KEY**
   - Your API Key from Step 2
   - Example: `atsk_abc123def456ghi789jkl...`

2. **AFRICAS_TALKING_USERNAME**
   - For Sandbox: `sandbox`
   - For Production: Your username (e.g., `kilimo_tz`)

3. **AFRICAS_TALKING_SENDER_ID** (Optional)
   - Your registered Sender ID
   - Example: `KILIMO` or `CREOVA`
   - Leave blank if not registered yet

### How to Add Secrets in Supabase

The modal should have already appeared. If you dismissed it:

1. Go to your Supabase project dashboard
2. Click **"Edge Functions"** → **"Secrets"**
3. Add each secret:
   ```
   Name: AFRICAS_TALKING_API_KEY
   Value: [paste your API key]
   
   Name: AFRICAS_TALKING_USERNAME
   Value: sandbox (or your production username)
   
   Name: AFRICAS_TALKING_SENDER_ID
   Value: KILIMO (or leave blank)
   ```
4. Click **"Add Secret"** for each one

---

## Step 6: Set Environment Mode

### For Development/Testing
```
ENVIRONMENT=development
```
This uses the sandbox API endpoint.

### For Production
```
ENVIRONMENT=production
```
This uses the live API endpoint and sends real SMS.

**Add this to Supabase Edge Function secrets:**
```
Name: ENVIRONMENT
Value: development (or production)
```

---

## Step 7: Test the Integration

### Testing in Sandbox Mode

1. Make sure you have:
   ```
   AFRICAS_TALKING_USERNAME=sandbox
   ENVIRONMENT=development
   ```

2. Try to sign up with any phone number:
   - Use a Kenyan number format: `+254712345678`
   - Or Tanzanian: `+255712345678`

3. **Check server logs** for the OTP code:
   ```
   OTP for +255712345678: 123456
   ```

4. Enter the OTP code to verify

5. Check that:
   - ✅ User is marked as verified
   - ✅ Wallet is created
   - ✅ No errors in logs

**Note:** In sandbox mode, SMS is **NOT** actually sent. You must check server logs for the OTP code.

### Testing in Production Mode

1. Make sure you have:
   ```
   AFRICAS_TALKING_USERNAME=your_production_username
   AFRICAS_TALKING_API_KEY=your_production_api_key
   ENVIRONMENT=production
   ```

2. Sign up with a **real Tanzanian phone number** (+255...)

3. **Check your phone** for the SMS

4. Expected SMS:
   ```
   KILIMO Verification
   
   Your OTP: 123456
   
   Valid for 5 minutes.
   Do not share this code.
   ```

5. Enter the OTP code to verify

6. Verify in Africa's Talking dashboard:
   - Go to **"SMS"** → **"Logs"**
   - You should see the sent message
   - Status should be **"Delivered"**

---

## Step 8: Monitor & Maintain

### Check SMS Delivery Logs

1. Go to Africa's Talking dashboard
2. Click **"SMS"** → **"Logs"**
3. View:
   - Message status (Sent, Delivered, Failed)
   - Delivery time
   - Cost per message
   - Recipient phone number

### Set Up Low Balance Alerts

1. Go to **"Payments"** → **"Alerts"**
2. Set alert threshold: **TZS 10,000**
3. Add your email
4. You'll be notified when balance is low

### Monthly Cost Estimation

```
Expected Users/Month: 1000
SMS per User: 2 (signup + 1 resend)
Total SMS: 2000
Cost per SMS: TZS 25
Monthly Cost: TZS 50,000 (~$20 USD)
```

Adjust based on your user growth.

---

## 🔧 Troubleshooting

### "Insufficient Balance" Error

**Problem:** Account has no credits

**Solution:**
1. Go to **"Payments"** → **"Top Up"**
2. Add credits via mobile money or card
3. Retry sending SMS

---

### "Invalid API Key" Error

**Problem:** Wrong API key or username

**Solution:**
1. Verify credentials in Africa's Talking dashboard
2. Regenerate API key if needed
3. Update Supabase secrets with new key
4. Redeploy Edge Functions

---

### SMS Not Received

**Problem:** SMS sent but user didn't receive it

**Possible Causes:**
1. Phone number format wrong
   - Must be: `+255712345678`
   - Not: `0712345678` or `712345678`

2. Network issues
   - User's network may have delays
   - Check delivery status in dashboard

3. Phone is off or out of service
   - SMS will queue and deliver when back online

4. Blocked number
   - User may have blocked the sender

**Solution:**
1. Check Africa's Talking logs for delivery status
2. Verify phone number format
3. Try resending OTP
4. If persistent, contact Africa's Talking support

---

### "Authentication Failed" Error

**Problem:** API authentication failed

**Solution:**
1. Verify `AFRICAS_TALKING_API_KEY` is correct
2. Verify `AFRICAS_TALKING_USERNAME` matches your account
3. Check if API key has expired (regenerate if needed)
4. Ensure no extra spaces in the credentials

---

## 📊 Dashboard Overview

### Key Metrics to Monitor

**Daily:**
- SMS sent count
- Delivery success rate (should be > 95%)
- Failed deliveries (investigate if > 5%)

**Weekly:**
- Total SMS cost
- Average cost per user
- OTP verification success rate

**Monthly:**
- Total users registered
- Total SMS sent
- Total cost
- Credit balance

---

## 💰 Cost Optimization Tips

1. **Reduce Resends**
   - Implement rate limiting
   - Max 3 OTP requests per user per hour

2. **Optimize Message Length**
   - Keep OTP SMS under 160 characters
   - Longer messages cost 2-3x more

3. **Use Proper Error Handling**
   - Don't send OTP if phone format is invalid
   - Validate before sending

4. **Batch Non-Urgent SMS**
   - Use bulk sending for marketing messages
   - Lower rates for bulk (1000+ messages)

5. **Monitor Failed Deliveries**
   - Identify and fix phone number issues
   - Don't waste credits on wrong numbers

---

## 🆘 Support Resources

### Africa's Talking Support

**Email:** support@africastalking.com  
**Phone:** +254 20 524 2223  
**Hours:** 24/7 support

**Documentation:**
- Main Docs: https://developers.africastalking.com
- SMS API: https://developers.africastalking.com/docs/sms/overview
- FAQ: https://help.africastalking.com

### Community Support

**Slack:** https://slackin-africastalking.now.sh  
**Forum:** https://help.africastalking.com  
**GitHub:** https://github.com/AfricasTalkingLtd

---

## ✅ Pre-Launch Checklist

Before going live with production:

**Account Setup:**
- [ ] Production account created
- [ ] Business verification completed (if required)
- [ ] Payment method added
- [ ] Initial credits purchased (TZS 50,000+)

**Credentials:**
- [ ] Production API Key generated
- [ ] Production Username noted
- [ ] Sender ID registered and approved
- [ ] All secrets added to Supabase
- [ ] ENVIRONMENT=production set

**Testing:**
- [ ] Test with real phone number
- [ ] SMS received within 30 seconds
- [ ] OTP verification works
- [ ] Wallet created after verification
- [ ] Delivery logs checked in dashboard

**Monitoring:**
- [ ] Low balance alerts set up
- [ ] Dashboard bookmarked
- [ ] Team has access to dashboard
- [ ] SMS logs reviewed daily

**Documentation:**
- [ ] Team trained on SMS flow
- [ ] Error handling procedures documented
- [ ] Support contact info shared

---

## 🎉 You're Ready!

Once you've completed all steps above, your KILIMO platform will have:

✅ **Secure SMS OTP verification**  
✅ **Real-time SMS delivery to Tanzania**  
✅ **Auto-wallet creation after verification**  
✅ **Protected payment operations**  
✅ **Professional sender ID (KILIMO/CREOVA)**  
✅ **Delivery monitoring and analytics**

Your users can now safely register and verify their phones to access the full KILIMO platform! 🚀

---

## 📞 Quick Reference

```
Africa's Talking Dashboard:
https://account.africastalking.com

API Documentation:
https://developers.africastalking.com

Support Email:
support@africastalking.com

Your Credentials:
Username: [your_username or "sandbox"]
API Key: [stored in Supabase secrets]
Sender ID: KILIMO or CREOVA

Cost per SMS:
~TZS 20-30 (Standard)
~TZS 15-20 (Bulk 1000+)
```

---

**Need help?** Contact Africa's Talking support or check server logs for detailed error messages.
