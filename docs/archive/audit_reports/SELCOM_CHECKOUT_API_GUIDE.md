# SELCOM Checkout API - Complete Integration Guide for CREOVA

## 🎯 Overview

The SELCOM Checkout API is the **correct API to use** for e-commerce payments in CREOVA Agri-AI Suite. It provides a complete payment gateway solution for mobile money, cards, and bank payments.

---

## ✅ Why Use Checkout API (Not Utility Payment API)?

| Feature | Checkout API ✅ | Utility Payment API ❌ |
|---------|----------------|----------------------|
| **Use Case** | E-commerce, subscriptions, marketplace | Bill payments, airtime, electricity |
| **Payment Gateway URL** | ✅ Provided | ❌ Not available |
| **QR Codes** | ✅ Generated | ❌ Not available |
| **Payment Tokens** | ✅ Generated | ❌ Not available |
| **Stored Cards** | ✅ Supported | ❌ Not supported |
| **Webhook Callbacks** | ✅ Automatic | ❌ Manual polling |
| **Mobile Money Pull** | ✅ Push USSD | ❌ Manual entry |
| **Perfect for CREOVA** | ✅✅✅ | ❌ |

---

## 🚀 API Endpoints

### **1. Create Order (Minimal - Mobile Money Optimized)**

This is the **primary endpoint** for CREOVA. It creates a payment order optimized for mobile money.

```http
POST /v1/checkout/create-order-minimal
```

**Request:**
```json
{
  "vendor": "CREOVA001",
  "order_id": "CREOVA-1234567890",
  "buyer_email": "farmer@example.com",
  "buyer_name": "John Mwalimu",
  "buyer_phone": "255754123456",
  "amount": 5000,
  "currency": "TZS",
  "webhook": "aHR0cHM6Ly95b3VyLWRvbWFpbi5jb20vd2ViaG9vaw==",
  "buyer_remarks": "Premium AI Advisory",
  "merchant_remarks": "Monthly Subscription",
  "no_of_items": 1
}
```

**Response:**
```json
{
  "result": "SUCCESS",
  "resultcode": "000",
  "reference": "S19901380962",
  "message": "Order created successfully",
  "data": [{
    "gateway_buyer_uuid": "12344321",
    "payment_token": "80008000",
    "qr": "iVBORw0KGgoAAAANSUhEUgAA...",
    "payment_gateway_url": "aHR0cHM6Ly9wYXltZW50cy1zYW5kYm94..."
  }]
}
```

**What You Get:**
- ✅ **payment_gateway_url**: Redirect farmer here to complete payment (Base64 encoded)
- ✅ **payment_token**: Show this token to farmer for manual payment
- ✅ **qr**: QR code for TanQR/Masterpass payments
- ✅ **gateway_buyer_uuid**: Save this for future stored card payments

---

### **2. Get Order Status**

Check if payment has been completed.

```http
GET /v1/checkout/order-status?order_id=CREOVA-1234567890
```

**Response:**
```json
{
  "result": "SUCCESS",
  "resultcode": "000",
  "message": "Order fetch successful",
  "data": [{
    "order_id": "CREOVA-1234567890",
    "creation_date": "2024-12-14 10:30:00",
    "amount": "5000",
    "payment_status": "COMPLETED",
    "transid": "TXN123456",
    "channel": "MPESA-TZ",
    "reference": "S19901380962",
    "msisdn": "255754123456"
  }]
}
```

**Payment Status Values:**
- `PENDING` - Order created, awaiting payment
- `COMPLETED` - Payment successful ✅
- `CANCELLED` - Order cancelled by merchant
- `USERCANCELLED` - Farmer cancelled payment
- `REJECTED` - Payment rejected
- `INPROGRESS` - Payment being processed

---

### **3. Process Wallet Payment (Push USSD)**

Trigger USSD prompt on farmer's phone for instant payment.

```http
POST /v1/checkout/wallet-payment
```

**Request:**
```json
{
  "transid": "TXN-1234567890",
  "order_id": "CREOVA-1234567890",
  "msisdn": "255754123456"
}
```

**Response:**
```json
{
  "result": "INPROGRESS",
  "resultcode": "111",
  "message": "Push USSD sent. Awaiting customer confirmation.",
  "reference": "S19901380962"
}
```

**What Happens:**
1. SELCOM sends USSD push to farmer's phone
2. Farmer sees payment request: "Pay TZS 5,000 to CREOVA?"
3. Farmer enters M-Pesa PIN to confirm
4. Payment completes in 30-60 seconds
5. Webhook notification sent to your server

---

### **4. Cancel Order**

Cancel an order before payment completion.

```http
DELETE /v1/checkout/cancel-order?order_id=CREOVA-1234567890
```

**Response:**
```json
{
  "result": "SUCCESS",
  "resultcode": "000",
  "message": "Order cancelled successfully"
}
```

---

## 🔔 Webhook Callback

SELCOM automatically notifies your server when payment is completed.

**Your Webhook Endpoint:**
```
https://your-app.supabase.co/functions/v1/make-server-ce1844e7/payment/selcom/webhook
```

**Webhook Payload SELCOM Sends:**
```json
{
  "result": "SUCCESS",
  "resultcode": "000",
  "order_id": "CREOVA-1234567890",
  "transid": "TXN123456",
  "reference": "S19901380962",
  "channel": "MPESA-TZ",
  "amount": "5000",
  "phone": "255754123456",
  "payment_status": "COMPLETED"
}
```

**Your Response:**
```json
{
  "result": "SUCCESS",
  "resultcode": "000",
  "message": "Webhook processed"
}
```

---

## 💰 Complete Payment Flow for CREOVA

### **Scenario 1: Farmer Pays via Payment Gateway (Recommended)**

```
1. Farmer selects "Premium AI Advisory - TZS 5,000/month"
   ↓
2. CREOVA calls: POST /checkout/create-order-minimal
   ↓
3. SELCOM returns:
   - payment_gateway_url (redirect URL)
   - payment_token (for manual entry)
   - qr (for QR payments)
   ↓
4. CREOVA redirects farmer to payment_gateway_url
   OR shows QR code
   OR displays payment token
   ↓
5. Farmer selects M-Pesa on payment gateway
   ↓
6. Farmer enters phone: 0754123456
   ↓
7. Farmer receives USSD push: "Pay TZS 5,000?"
   ↓
8. Farmer enters M-Pesa PIN
   ↓
9. Payment completes (30-60 seconds)
   ↓
10. SELCOM sends webhook to CREOVA
   ↓
11. CREOVA activates premium features ✅
```

---

### **Scenario 2: Direct Wallet Payment (Fastest)**

```
1. Farmer inputs phone: 0754123456
   ↓
2. CREOVA calls: POST /checkout/create-order-minimal
   ↓
3. CREOVA calls: POST /checkout/wallet-payment
   ↓
4. Farmer receives USSD push on phone immediately
   ↓
5. Farmer enters PIN
   ↓
6. Payment completes
   ↓
7. Webhook received
   ↓
8. Premium features activated ✅
```

---

### **Scenario 3: QR Code Payment (Contactless)**

```
1. Farmer scans QR code with TanQR app
   ↓
2. TanQR app shows payment details
   ↓
3. Farmer confirms payment
   ↓
4. Webhook received
   ↓
5. Done ✅
```

---

## 🔐 Authentication (Same as Before)

Headers required for ALL requests:

```http
Authorization: SELCOM {Base64(API_KEY)}
Digest-Method: HS256
Digest: {HMAC-SHA256 signature}
Timestamp: 2024-12-14T10:30:46+03:00
Signed-Fields: vendor,order_id,buyer_email,buyer_name,buyer_phone,amount,currency,webhook,buyer_remarks,merchant_remarks,no_of_items
```

---

## 📱 Mobile Money Channels

| Channel Name | Operator | USSD | Market Share |
|--------------|----------|------|--------------|
| **MPESA-TZ** | Vodacom M-Pesa | *150*00# | 65% |
| **TIGOPESATZ** | TigoPesa | *150*01# | 20% |
| **AIRTELMONEY** | Airtel Money | *150*60# | 10% |
| **HALOPESATZ** | Halopesa | *150*88# | 3% |
| **TTCLMOBILE** | T-Pesa | *150*71# | 2% |

---

## 🎯 CREOVA Integration Steps

### **Step 1: Create Order**

```javascript
// Frontend: Farmer clicks "Subscribe to Premium AI"
const response = await fetch('/make-server-ce1844e7/payment/selcom/create-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`
  },
  body: JSON.stringify({
    amount: 5000,
    phoneNumber: '0754123456',
    customerName: 'John Mwalimu',
    email: 'john@example.com',
    remarks: 'Premium AI Advisory Subscription'
  })
});

const { orderId, paymentGatewayUrl, paymentToken, qrCode } = await response.json();
```

### **Step 2: Show Payment Options**

```javascript
// Option A: Redirect to payment gateway
window.location.href = paymentGatewayUrl;

// Option B: Show QR code
<img src={`data:image/png;base64,${qrCode}`} />

// Option C: Show payment token
<div>Payment Token: {paymentToken}</div>
<div>Dial *150*00# and enter this token</div>

// Option D: Direct wallet push (fastest!)
await fetch('/make-server-ce1844e7/payment/selcom/wallet-payment', {
  method: 'POST',
  body: JSON.stringify({
    orderId,
    phoneNumber: '0754123456'
  })
});
// Farmer receives USSD push immediately!
```

### **Step 3: Check Payment Status**

```javascript
// Poll every 5 seconds for payment confirmation
const checkStatus = setInterval(async () => {
  const status = await fetch(`/make-server-ce1844e7/payment/selcom/order-status/${orderId}`);
  const { payment_status } = await status.json();
  
  if (payment_status === 'COMPLETED') {
    clearInterval(checkStatus);
    // Activate premium features!
    alert('Payment successful! Premium features activated.');
  }
}, 5000);
```

### **Step 4: Handle Webhook (Backend)**

```javascript
// Webhook endpoint receives confirmation
app.post('/payment/selcom/webhook', async (c) => {
  const { order_id, payment_status, amount, channel } = await c.req.json();
  
  if (payment_status === 'COMPLETED') {
    // Activate premium features for farmer
    await activatePremiumFeatures(order_id);
    
    // Credit farmer wallet
    await creditWallet(order_id, amount);
    
    // Send confirmation SMS
    await sendSMS(order_id, 'Payment received! Premium features activated.');
  }
  
  return c.json({ result: 'SUCCESS', resultcode: '000' });
});
```

---

## 🧪 Testing

### **Sandbox Environment**

```bash
SELCOM_API_KEY=sandbox_api_key_here
SELCOM_API_SECRET=sandbox_secret_here
SELCOM_VENDOR_ID=sandbox_vendor_id
ENVIRONMENT=sandbox
```

**Test Phone Numbers:**
- M-Pesa: `255754000000`
- TigoPesa: `255655000000`
- Airtel: `255784000000`

**Test Amounts:**
- `1000 TZS` → Success
- `2000 TZS` → Pending
- `3000 TZS` → Failed

---

## ⚡ Key Advantages for CREOVA

✅ **Farmer-Friendly**: Simple payment flow  
✅ **Fast**: Push USSD = 30-60 second payments  
✅ **Multiple Options**: Gateway, QR, Token, Direct Push  
✅ **Automatic Webhooks**: No polling needed  
✅ **All Mobile Money**: M-Pesa, TigoPesa, Airtel, Halo, T-Pesa  
✅ **Production-Ready**: Complete payment solution  

---

## 📞 Support

- **SELCOM Technical**: helpdesk@selcom.net
- **Phone**: +255 222 700 111
- **Docs**: https://developer.selcommobile.com

---

**Built for Tanzanian Smallholder Farmers 🇹🇿🌾**
