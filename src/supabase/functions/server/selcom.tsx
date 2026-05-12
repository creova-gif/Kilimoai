/**
 * SELCOM PAYMENT INTEGRATION (Tanzania-Optimized)
 * Official API Documentation: https://developer.selcommobile.com
 * 
 * Tanzania's leading payment gateway supporting:
 * - Mobile money (M-Pesa, TigoPesa, Airtel Money, Halopesa, T-Pesa)
 * - Card payments (Visa, Mastercard, Amex)
 * - Bank transfers (CRDB, NMB, NBC, Equity, etc.)
 * - Masterpass & QR payments
 * 
 * Using Checkout API for e-commerce payments
 */

const SELCOM_API_KEY = Deno.env.get("SELCOM_API_KEY") || "";
const SELCOM_API_SECRET = Deno.env.get("SELCOM_API_SECRET") || "";
const SELCOM_VENDOR_ID = Deno.env.get("SELCOM_VENDOR_ID") || "";

// Base URLs
const SELCOM_BASE_URL = "https://apigw.selcommobile.com/v1";
const SELCOM_SANDBOX_URL = "https://apigw-sandbox.selcommobile.com/v1";

// Use sandbox for testing unless in production
const BASE_URL = Deno.env.get("ENVIRONMENT") === "production" 
  ? SELCOM_BASE_URL 
  : SELCOM_SANDBOX_URL;

export interface SelcomCheckoutRequest {
  amount: number;
  currency?: string; // Default: TZS
  buyer_email: string;
  buyer_name: string;
  buyer_phone: string;
  order_id: string; // Unique order reference
  webhook?: string; // Base64 encoded webhook URL
  buyer_remarks?: string;
  merchant_remarks?: string;
  no_of_items?: number;
}

export interface SelcomCheckoutResponse {
  result: "SUCCESS" | "FAIL" | "INPROGRESS" | "AMBIGUOUS";
  resultcode: string;
  message: string;
  reference?: string;
  data?: {
    gateway_buyer_uuid?: string;
    payment_token?: string;
    qr?: string;
    payment_gateway_url?: string; // Base64 encoded
  }[];
}

export interface SelcomOrderStatusResponse {
  result: "SUCCESS" | "FAIL" | "INPROGRESS" | "AMBIGUOUS";
  resultcode: string;
  message: string;
  reference?: string;
  data?: {
    order_id: string;
    creation_date: string;
    amount: string;
    payment_status: "PENDING" | "COMPLETED" | "CANCELLED" | "USERCANCELLED" | "REJECTED" | "INPROGRESS";
    transid?: string;
    channel?: string;
    reference?: string;
    msisdn?: string;
  }[];
}

export interface SelcomWalletPaymentRequest {
  order_id: string;
  msisdn: string; // Phone number to pull funds from
  transid: string;
}

/**
 * Generate ISO 8601 timestamp with timezone for East Africa Time (EAT = UTC+3)
 */
function generateTimestamp(): string {
  const now = new Date();
  // Format: 2019-02-26T09:30:46+03:00
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours() + 3).padStart(2, '0'); // EAT = UTC+3
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+03:00`;
}

/**
 * Generate SELCOM API signature for authentication
 * Format: timestamp=[ISO8601]&field1=value1&field2=value2...
 * Algorithm: Base64(HMAC-SHA256(stringToSign, API_SECRET))
 */
async function generateSelcomSignature(
  payload: any,
  signedFields: string[],
  timestamp: string
): Promise<string> {
  // Build the string to sign: timestamp=[ISO8601]&field1=value1&field2=value2...
  let stringToSign = `timestamp=${timestamp}`;
  
  for (const field of signedFields) {
    // Handle nested fields like billing.firstname
    const value = field.includes('.') 
      ? field.split('.').reduce((obj, key) => obj?.[key], payload)
      : payload[field];
    
    if (value !== undefined && value !== null) {
      stringToSign += `&${field}=${value}`;
    }
  }
  
  // Create HMAC-SHA256 signature
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SELCOM_API_SECRET);
  const messageData = encoder.encode(stringToSign);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  
  // Convert to base64
  const digest = btoa(String.fromCharCode(...new Uint8Array(signature)));
  
  return digest;
}

/**
 * Encode API key to Base64 for Authorization header
 */
function encodeApiKey(apiKey: string): string {
  return btoa(apiKey);
}

/**
 * Create a minimal checkout order (mobile money optimized, no card support)
 * This is perfect for CREOVA farmers who primarily use mobile money
 */
export async function createSelcomOrder(
  request: SelcomCheckoutRequest
): Promise<SelcomCheckoutResponse> {
  try {
    // Validate required fields
    if (!request.order_id || !request.amount || !request.buyer_phone || !request.buyer_name || !request.buyer_email) {
      return {
        result: "FAIL",
        resultcode: "400",
        message: "Order ID, amount, buyer phone, name, and email are required",
      };
    }

    // Prepare checkout payload (minimal version - no cards, just mobile money)
    const payload = {
      vendor: SELCOM_VENDOR_ID,
      order_id: request.order_id,
      buyer_email: request.buyer_email,
      buyer_name: request.buyer_name,
      buyer_phone: formatPhoneForSelcom(request.buyer_phone),
      amount: request.amount,
      currency: request.currency || "TZS",
      webhook: request.webhook ? btoa(request.webhook) : "",
      buyer_remarks: request.buyer_remarks || "CREOVA Agri-AI Services",
      merchant_remarks: request.merchant_remarks || "Agricultural Advisory Payment",
      no_of_items: request.no_of_items || 1,
    };

    // Generate timestamp
    const timestamp = generateTimestamp();
    
    // Define signed fields (order matters!)
    const signedFields = [
      'vendor',
      'order_id',
      'buyer_email',
      'buyer_name',
      'buyer_phone',
      'amount',
      'currency',
      'webhook',
      'buyer_remarks',
      'merchant_remarks',
      'no_of_items'
    ];
    
    // Generate HMAC signature
    const digest = await generateSelcomSignature(payload, signedFields, timestamp);
    
    // Encode API key to Base64
    const encodedApiKey = encodeApiKey(SELCOM_API_KEY);

    const response = await fetch(`${BASE_URL}/checkout/create-order-minimal`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `SELCOM ${encodedApiKey}`,
        "Digest-Method": "HS256",
        "Digest": digest,
        "Timestamp": timestamp,
        "Signed-Fields": signedFields.join(','),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Return SELCOM response
    return {
      result: data.result || "FAIL",
      resultcode: data.resultcode || "500",
      message: data.message || "Failed to create order",
      reference: data.reference,
      data: data.data,
    };
  } catch (error) {
    console.error("SELCOM checkout creation exception:", error);
    return {
      result: "FAIL",
      resultcode: "500",
      message: `Order creation failed: ${error.message}`,
    };
  }
}

/**
 * Check SELCOM order status
 */
export async function checkSelcomOrderStatus(
  orderId: string
): Promise<SelcomOrderStatusResponse> {
  try {
    const payload = { 
      order_id: orderId 
    };
    
    // Generate timestamp
    const timestamp = generateTimestamp();
    
    // Define signed fields
    const signedFields = ['order_id'];
    
    // Generate HMAC signature
    const digest = await generateSelcomSignature(payload, signedFields, timestamp);
    
    // Encode API key to Base64
    const encodedApiKey = encodeApiKey(SELCOM_API_KEY);

    const response = await fetch(
      `${BASE_URL}/checkout/order-status?order_id=${orderId}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `SELCOM ${encodedApiKey}`,
          "Digest-Method": "HS256",
          "Digest": digest,
          "Timestamp": timestamp,
          "Signed-Fields": signedFields.join(','),
        },
      }
    );

    const data = await response.json();

    // Return SELCOM response as-is
    return {
      result: data.result || "FAIL",
      resultcode: data.resultcode || "500",
      message: data.message || "Failed to retrieve order status",
      reference: data.reference,
      data: data.data,
    };
  } catch (error) {
    console.error("SELCOM order status exception:", error);
    return {
      result: "FAIL",
      resultcode: "500",
      message: `Order status check failed: ${error.message}`,
    };
  }
}

/**
 * Process wallet payment (Push USSD to mobile money)
 * This triggers the USSD menu on the farmer's phone
 */
export async function processSelcomWalletPayment(
  request: SelcomWalletPaymentRequest
): Promise<SelcomCheckoutResponse> {
  try {
    const payload = {
      transid: request.transid,
      order_id: request.order_id,
      msisdn: formatPhoneForSelcom(request.msisdn),
    };

    // Generate timestamp
    const timestamp = generateTimestamp();
    
    // Define signed fields
    const signedFields = ['transid', 'order_id', 'msisdn'];
    
    // Generate HMAC signature
    const digest = await generateSelcomSignature(payload, signedFields, timestamp);
    
    // Encode API key to Base64
    const encodedApiKey = encodeApiKey(SELCOM_API_KEY);

    const response = await fetch(`${BASE_URL}/checkout/wallet-payment`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `SELCOM ${encodedApiKey}`,
        "Digest-Method": "HS256",
        "Digest": digest,
        "Timestamp": timestamp,
        "Signed-Fields": signedFields.join(','),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return {
      result: data.result || "FAIL",
      resultcode: data.resultcode || "500",
      message: data.message || "Failed to process wallet payment",
      reference: data.reference,
      data: data.data,
    };
  } catch (error) {
    console.error("SELCOM wallet payment exception:", error);
    return {
      result: "FAIL",
      resultcode: "500",
      message: `Wallet payment failed: ${error.message}`,
    };
  }
}

/**
 * Cancel an order before payment completion
 */
export async function cancelSelcomOrder(orderId: string): Promise<SelcomCheckoutResponse> {
  try {
    const payload = { order_id: orderId };
    
    // Generate timestamp
    const timestamp = generateTimestamp();
    
    // Define signed fields
    const signedFields = ['order_id'];
    
    // Generate HMAC signature
    const digest = await generateSelcomSignature(payload, signedFields, timestamp);
    
    // Encode API key to Base64
    const encodedApiKey = encodeApiKey(SELCOM_API_KEY);

    const response = await fetch(
      `${BASE_URL}/checkout/cancel-order?order_id=${orderId}`,
      {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `SELCOM ${encodedApiKey}`,
          "Digest-Method": "HS256",
          "Digest": digest,
          "Timestamp": timestamp,
          "Signed-Fields": signedFields.join(','),
        },
      }
    );

    const data = await response.json();

    return {
      result: data.result || "FAIL",
      resultcode: data.resultcode || "500",
      message: data.message || "Failed to cancel order",
      reference: data.reference,
    };
  } catch (error) {
    console.error("SELCOM order cancellation exception:", error);
    return {
      result: "FAIL",
      resultcode: "500",
      message: `Order cancellation failed: ${error.message}`,
    };
  }
}

/**
 * Get supported mobile money operators
 */
export function getSelcomSupportedOperators() {
  return [
    { 
      code: "MPESA", 
      name: "M-Pesa (Vodacom)", 
      ussd: "*150*00#",
      icon: "📱",
      marketShare: "65%",
      description: "Tanzania's most popular mobile money service",
      channel: "MPESA-TZ"
    },
    { 
      code: "TIGOPESA", 
      name: "TigoPesa (Tigo/MIC by Yas)", 
      ussd: "*150*01#",
      icon: "🔵",
      marketShare: "20%",
      description: "Fast and reliable mobile payments",
      channel: "TIGOPESATZ"
    },
    { 
      code: "AIRTEL", 
      name: "Airtel Money", 
      ussd: "*150*60#",
      icon: "🔴",
      marketShare: "10%",
      description: "Airtel mobile money service",
      channel: "AIRTELMONEY"
    },
    { 
      code: "HALOPESA", 
      name: "Halopesa (Halotel)", 
      ussd: "*150*88#",
      icon: "💜",
      marketShare: "3%",
      description: "Halotel mobile money",
      channel: "HALOPESATZ"
    },
    { 
      code: "TPESA", 
      name: "T-Pesa (TTCL)", 
      ussd: "*150*71#",
      icon: "🟢",
      marketShare: "2%",
      description: "TTCL mobile money service",
      channel: "TTCLMOBILE"
    },
  ];
}

/**
 * Get supported banks for direct bank transfers
 */
export function getSelcomSupportedBanks() {
  return [
    { code: "CRDB", name: "CRDB Bank", logo: "🏦" },
    { code: "NMB", name: "NMB Bank", logo: "🏦" },
    { code: "NBC", name: "National Bank of Commerce", logo: "🏦" },
    { code: "EQUITY", name: "Equity Bank", logo: "🏦" },
    { code: "ABSA", name: "ABSA Bank Tanzania", logo: "🏦" },
    { code: "STANBIC", name: "Stanbic Bank", logo: "🏦" },
    { code: "DTB", name: "Diamond Trust Bank", logo: "🏦" },
    { code: "EXIM", name: "Exim Bank", logo: "🏦" },
    { code: "ACCESSBANK", name: "Access Bank Tanzania", logo: "🏦" },
    { code: "KCB", name: "Kenya Commercial Bank", logo: "🏦" },
  ];
}

/**
 * Validate Tanzanian phone number
 * Format: +255[6|7]XXXXXXXX or 0[6|7]XXXXXXXX
 */
export function validateTanzanianPhone(phone: string): boolean {
  // Remove spaces and special characters
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Tanzanian numbers: +255 followed by 9 digits (starting with 6 or 7)
  // Or starts with 0 followed by 9 digits (starting with 6 or 7)
  const regex = /^(\+255|255|0)[67]\d{8}$/;
  
  return regex.test(cleaned);
}

/**
 * Format phone number for SELCOM (MSISDN format)
 * SELCOM expects: 255XXXXXXXXX (no + symbol)
 */
export function formatPhoneForSelcom(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // If starts with +255, remove the +
  if (cleaned.startsWith('+255')) {
    return cleaned.substring(1);
  }
  
  // If starts with 0, replace with 255
  if (cleaned.startsWith('0')) {
    return '255' + cleaned.substring(1);
  }
  
  // If starts with 255, return as is
  if (cleaned.startsWith('255')) {
    return cleaned;
  }
  
  // Default: add 255 prefix
  return '255' + cleaned;
}

/**
 * Interpret SELCOM result codes
 */
export function interpretResultCode(resultcode: string): {
  status: "SUCCESS" | "PENDING" | "FAILED" | "UNKNOWN";
  description: string;
  action: string;
} {
  if (resultcode === "000") {
    return {
      status: "SUCCESS",
      description: "Transaction successful",
      action: "No action required"
    };
  } else if (resultcode === "111" || resultcode === "927" || resultcode === "001" || resultcode === "002" || resultcode === "003") {
    return {
      status: "PENDING",
      description: "Transaction in progress",
      action: "Query status after 3 minutes. If still pending, contact SELCOM support"
    };
  } else if (resultcode === "999") {
    return {
      status: "UNKNOWN",
      description: "Transaction status ambiguous",
      action: "Wait for manual reconciliation with SELCOM support (helpdesk@selcom.net)"
    };
  } else {
    return {
      status: "FAILED",
      description: "Transaction failed",
      action: "Check error message and retry or contact support"
    };
  }
}

/**
 * Decode payment gateway URL from base64
 */
export function decodePaymentGatewayUrl(base64Url: string): string {
  try {
    return atob(base64Url);
  } catch (error) {
    console.error("Failed to decode payment gateway URL:", error);
    return base64Url; // Return as-is if decoding fails
  }
}
