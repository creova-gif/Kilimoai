# SELCOM Payment Integration Guide

## 🇹🇿 Tanzania's Leading Payment Gateway for CREOVA Agri-AI Suite

SELCOM is Tanzania's premier payment gateway, specifically optimized for mobile money transactions - the primary payment method for smallholder farmers. This integration provides seamless payment processing through M-Pesa, TigoPesa, Airtel Money, Halopesa, and T-Pesa.

---

## ✅ Why SELCOM for East Africa?

### **Perfect for Tanzanian Smallholder Farmers**
- **Deep Mobile Money Integration**: Direct integration with all 5 major mobile money operators
- **Local Expertise**: Built specifically for the Tanzanian market with local support
- **USSD Support**: Farmers can pay via simple USSD codes without internet
- **Low Transaction Fees**: Competitive rates optimized for small-value agricultural transactions
- **Instant Confirmations**: Real-time payment verification for immediate service access

### **Market Coverage**
- **M-Pesa (Vodacom)**: 65% market share - Tanzania's most popular
- **TigoPesa**: 20% market share - Fast and reliable
- **Airtel Money**: 10% market share - Wide coverage
- **Halopesa (Halotel)**: 3% market share - Growing rapidly
- **T-Pesa (TTCL)**: 2% market share - Government-backed

---

## 🚀 Quick Setup

### **Step 1: Get SELCOM API Credentials**

1. **Sign up for SELCOM**
   - Visit: https://www.selcommobile.com
   - Create a merchant account
   - Complete KYC verification

2. **Get your credentials**
   - API Key (for authentication)
   - API Secret (for request signing)
   - Vendor ID (your merchant identifier)

### **Step 2: Add Environment Variables**

Add these to your Supabase project environment variables:

```bash
SELCOM_API_KEY=your_api_key_here
SELCOM_API_SECRET=your_api_secret_here
SELCOM_VENDOR_ID=your_vendor_id_here
ENVIRONMENT=sandbox  # Change to 'production' when ready
```

**Important**: Start with `sandbox` environment for testing, then switch to `production` for live payments.

---

## 📱 Supported Payment Methods

### **Mobile Money (Primary)**
✅ M-Pesa (Vodacom) - USSD: `*150*00#`  
✅ TigoPesa - USSD: `*150*01#`  
✅ Airtel Money - USSD: `*150*60#`  
✅ Halopesa (Halotel) - USSD: `*150*88#`  
✅ T-Pesa (TTCL) - USSD: `*150*71#`

### **Bank Transfers**
✅ CRDB Bank  
✅ NMB Bank  
✅ National Bank of Commerce (NBC)  
✅ Equity Bank  
✅ ABSA Bank Tanzania  
✅ Stanbic Bank  
✅ Diamond Trust Bank (DTB)  
✅ Exim Bank

### **Card Payments**
✅ Visa  
✅ Mastercard

---

## 🔧 API Integration

### **Backend API Endpoints**

All SELCOM endpoints are prefixed with: `/make-server-ce1844e7/payment/selcom/`

#### **1. Initiate Payment**
```http
POST /make-server-ce1844e7/payment/selcom/initiate
```

**Request Body:**
```json
{
  "amount": 10000,
  "phoneNumber": "0754123456",
  "customerName": "John Mwalimu",
  "email": "john@example.com",
  "mobileOperator": "MPESA"
}
```

**Response:**
```json
{
  "success": true,
  "result": "SUCCESS",
  "resultcode": "000",
  "message": "Payment initiated successfully",
  "transid": "CREOVA-SELCOM-1234567890-abc123",
  "reference": "0289999288",
  "orderReference": "CREOVA-SELCOM-1234567890-abc123",
  "paymentLink": "https://payments.selcommobile.com/...",
  "ussdCode": "*150*00#",
  "mobileInstructions": "Dial *150*00# on your MPESA phone to complete payment"
}
```

#### **2. Check Payment Status**
```http
GET /make-server-ce1844e7/payment/selcom/status/:orderReference
```

**Response:**
```json
{
  "success": true,
  "order": {
    "orderReference": "CREOVA-SELCOM-1234567890-abc123",
    "transactionId": "TXN123456",
    "amount": 10000,
    "currency": "TZS",
    "paymentStatus": "COMPLETED",
    "paymentMethod": "MOBILEMONEY",
    "customerName": "John Mwalimu",
    "phoneNumber": "+255754123456",
    "createdAt": "2024-01-15T10:30:00Z",
    "completedAt": "2024-01-15T10:32:15Z"
  }
}
```

#### **3. Process M-Pesa Payment (Direct)**
```http
POST /make-server-ce1844e7/payment/selcom/mpesa
```

#### **4. Process TigoPesa Payment**
```http
POST /make-server-ce1844e7/payment/selcom/tigopesa
```

#### **5. Process Airtel Money Payment**
```http
POST /make-server-ce1844e7/payment/selcom/airtel
```

#### **6. Process Halopesa Payment**
```http
POST /make-server-ce1844e7/payment/selcom/halopesa
```

#### **7. Get Supported Operators**
```http
GET /make-server-ce1844e7/payment/selcom/operators
```

**Response:**
```json
{
  "success": true,
  "operators": [
    {
      "code": "MPESA",
      "name": "M-Pesa (Vodacom)",
      "ussd": "*150*00#",
      "icon": "📱",
      "marketShare": "65%",
      "description": "Tanzania's most popular mobile money service"
    },
    // ... more operators
  ]
}
```

#### **8. Get Supported Banks**
```http
GET /make-server-ce1844e7/payment/selcom/banks
```

---

## 🔐 Authentication & Security

### **SELCOM API Authentication**
SELCOM uses HMAC-SHA256 signature-based authentication:

**Required Headers:**
```http
Authorization: SELCOM {your_api_key}
Digest-Method: HS256
Digest: {calculated_hmac_signature}
Timestamp: {ISO8601_timestamp}
Signed-Fields: {comma_separated_field_names}
```

**Signature Calculation:**
```
string_to_sign = timestamp + signed_field_values + api_secret
signature = HMAC-SHA256(string_to_sign, api_secret)
digest = Base64(signature)
```

The integration automatically handles signature generation - you don't need to implement this manually.

---

## 📞 Phone Number Format

### **Tanzanian Phone Numbers**
SELCOM accepts phone numbers in these formats:

✅ **International format**: `+255754123456`  
✅ **Local format**: `0754123456`

The integration automatically converts local format to international format.

**Valid prefixes:**
- **Mobile**: `+2556xxxxxxxx` or `+2557xxxxxxxx`
- **Total digits**: 9 digits after country code

**Validation:**
```javascript
// The integration provides phone validation
const isValid = validateTanzanianPhone("0754123456");
const formatted = formatPhoneForSelcom("0754123456");
// Returns: "+255754123456"
```

---

## 💰 Payment Flow

### **Typical M-Pesa Payment Flow**

1. **Farmer initiates payment** → CREOVA app calls `/payment/selcom/mpesa`
2. **SELCOM processes request** → Returns order reference and USSD code
3. **Farmer receives SMS** → M-Pesa sends payment prompt to phone
4. **Farmer enters PIN** → Confirms payment on mobile phone
5. **Payment completes** → SELCOM sends webhook notification
6. **CREOVA verifies** → Calls `/payment/selcom/status/:orderReference`
7. **Service activated** → Farmer gains access to premium features

**Average time**: 30-60 seconds for mobile money payments

---

## 🧪 Testing

### **Sandbox Environment**
Set `ENVIRONMENT=sandbox` to use SELCOM's test environment.

**Test Phone Numbers:**
```
M-Pesa: 0754000000
TigoPesa: 0655000000
Airtel: 0784000000
```

**Test Amounts:**
- `1000 TZS` → Success
- `2000 TZS` → Pending
- `3000 TZS` → Failed

### **Test Credentials**
SELCOM provides test credentials for sandbox:
- Test API Key
- Test API Secret
- Test Vendor ID

Contact SELCOM support to get sandbox credentials.

---

## 🌐 URLs

### **Sandbox (Testing)**
```
Base URL: https://apigw-sandbox.selcommobile.com/v1
Payment Gateway: https://payments-sandbox.selcommobile.com
```

### **Production (Live)**
```
Base URL: https://apigw.selcommobile.com/v1
Payment Gateway: https://payments.selcommobile.com
```

---

## ⚡ Use Cases in CREOVA

### **1. Premium AI Advisory Subscription**
```javascript
// Monthly subscription: 5,000 TZS
POST /payment/selcom/mpesa
{
  "amount": 5000,
  "phoneNumber": "0754123456",
  "customerName": "Farmer Name",
  "email": "farmer@example.com"
}
```

### **2. Input Purchase (Seeds/Fertilizer)**
```javascript
// Buying 10kg certified maize seeds: 25,000 TZS
POST /payment/selcom/initiate
{
  "amount": 25000,
  "phoneNumber": "0754123456",
  "customerName": "Farmer Name",
  "mobileOperator": "TIGOPESA"
}
```

### **3. Marketplace Transaction**
```javascript
// Selling crops to buyer: 150,000 TZS
// Buyer pays via bank transfer
POST /payment/selcom/initiate
{
  "amount": 150000,
  "phoneNumber": "0754123456",
  "customerName": "Buyer Name",
  "paymentMethod": "BANK"
}
```

---

## 🔔 Webhooks (Optional)

SELCOM can send payment notifications to your webhook URL:

**Configure webhook URL in payload:**
```json
{
  "webhookUrl": "https://your-app.com/webhooks/selcom"
}
```

**Webhook payload:**
```json
{
  "event": "payment.completed",
  "order_id": "CREOVA-SELCOM-1234567890-abc123",
  "transid": "TXN123456",
  "amount": 10000,
  "status": "COMPLETED",
  "payment_method": "MOBILEMONEY",
  "timestamp": "2024-01-15T10:32:15Z"
}
```

---

## 📊 Transaction Fees

SELCOM transaction fees vary by payment method:

- **Mobile Money**: ~2-3% per transaction
- **Bank Transfer**: ~1-2% per transaction
- **Card Payments**: ~3-4% per transaction

Contact SELCOM for volume-based pricing and custom rates for agricultural projects.

---

## 📋 SELCOM Response Codes

### **Success Response**
```json
{
  "result": "SUCCESS",
  "resultcode": "000",
  "message": "Transaction successful"
}
```

### **In Progress Response**
```json
{
  "result": "INPROGRESS",
  "resultcode": "111",  // or "927"
  "message": "Transaction in progress"
}
```
**Action**: Query status after 3 minutes. If still pending, contact SELCOM recon team.

### **Ambiguous Response**
```json
{
  "result": "AMBIGUOUS",
  "resultcode": "999",
  "message": "Transaction status unknown"
}
```
**Action**: Wait for manual reconciliation with SELCOM recon team (recon@selcom.net)

### **Failed Response**
```json
{
  "result": "FAIL",
  "resultcode": "403",  // or other error codes
  "message": "No response from upstream system"
}
```

### **Result Code Interpretation**
| Result | Code | Description | Action |
|--------|------|-------------|--------|
| SUCCESS | 000 | Transaction successful | No action required |
| INPROGRESS | 111, 927 | Transaction pending | Query after 3 mins, then contact recon |
| AMBIGUOUS | 999 | Status unknown | Wait for manual recon |
| FAIL | Others | Transaction failed | Check message and retry |

---

## 🆘 Troubleshooting

### **Common Issues**

**1. Invalid Phone Number**
```
Error: "Invalid Tanzanian phone number"
```
**Solution**: Ensure phone starts with 0 or +255 and has 9 digits after prefix

**2. Signature Mismatch**
```
Error: "Digest validation failed"
```
**Solution**: Check that `SELCOM_API_SECRET` is correctly set

**3. Payment Timeout**
```
Status: "PENDING" for > 5 minutes
```
**Solution**: Check payment status endpoint or contact farmer to complete payment

**4. Insufficient Balance**
```
Error: "Insufficient funds"
```
**Solution**: Ask farmer to top up mobile money account

---

## 📞 Support

### **SELCOM Support**
- **Website**: https://www.selcommobile.com
- **Email**: support@selcommobile.com
- **Phone**: +255 222 700 111
- **Business Hours**: Mon-Fri 8:00 AM - 5:00 PM EAT

### **API Documentation**
- **Developer Portal**: https://developer.selcommobile.com
- **API Reference**: https://docs.selcommobile.com/api

---

## 🎯 Next Steps

1. ✅ **Get SELCOM credentials** from merchant portal
2. ✅ **Add environment variables** to Supabase
3. ✅ **Test in sandbox** with test phone numbers
4. ✅ **Integrate payment UI** in your CREOVA frontend
5. ✅ **Go live** by switching to production environment

---

## 📝 Integration Checklist

- [ ] SELCOM merchant account created
- [ ] API credentials obtained (API Key, Secret, Vendor ID)
- [ ] Environment variables added to Supabase
- [ ] Tested payment initiation in sandbox
- [ ] Tested payment status checking
- [ ] Tested all 5 mobile money operators
- [ ] Implemented error handling
- [ ] Configured webhook URL (optional)
- [ ] Tested live transactions with real money (small amounts)
- [ ] Switched to production environment
- [ ] Monitoring payments in SELCOM dashboard

---

## 🏆 Benefits for CREOVA Farmers

✅ **Pay with mobile money** - No need for bank account or cards  
✅ **Instant access** - Services activated immediately after payment  
✅ **Secure transactions** - Bank-level encryption and security  
✅ **Low fees** - Affordable for smallholder farmers  
✅ **24/7 availability** - Pay anytime, anywhere  
✅ **SMS confirmations** - Automatic payment receipts via SMS  
✅ **Multiple options** - Choose from 5 mobile money operators  

---

**Built with ❤️ for Tanzanian Smallholder Farmers**