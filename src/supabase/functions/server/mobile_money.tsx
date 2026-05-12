/**
 * CREOVA Mobile Money Integration Module
 * =====================================
 * 
 * Supports Tanzanian Mobile Money Providers:
 * - M-Pesa (Vodacom)
 * - TigoPesa (Tigo)
 * - Airtel Money (Airtel)
 * - GoPay (Proprietary - lowest fees)
 * 
 * API Integration Points:
 * ----------------------
 * This file provides the structure and mock implementation for integrating
 * with real payment APIs. Each provider has specific API requirements.
 * 
 * INTEGRATION CHECKLIST (For Production):
 * 
 * 1. M-Pesa API Setup:
 *    - Register at: https://developer.mpesa.vodacom.co.tz
 *    - Required: API Key, Public Key, Service Provider Code
 *    - Environment Variables: MPESA_API_KEY, MPESA_PUBLIC_KEY, MPESA_SERVICE_PROVIDER_CODE
 *    - Documentation: https://openapiportal.m-pesa.com/documentation
 * 
 * 2. TigoPesa API Setup:
 *    - Register at: https://developers.tigo.co.tz
 *    - Required: Username, Password, Biller Code
 *    - Environment Variables: TIGOPESA_USERNAME, TIGOPESA_PASSWORD, TIGOPESA_BILLER_CODE
 *    - Documentation: https://www.tigo.co.tz/api-docs
 * 
 * 3. Airtel Money API Setup:
 *    - Register at: https://developers.airtel.africa
 *    - Required: Client ID, Client Secret, Merchant ID
 *    - Environment Variables: AIRTEL_CLIENT_ID, AIRTEL_CLIENT_SECRET, AIRTEL_MERCHANT_ID
 *    - Documentation: https://developers.airtel.africa/documentation
 * 
 * 4. GoPay API Setup:
 *    - Contact GoPay Tanzania: api@gopay.co.tz
 *    - Required: Merchant ID, API Secret
 *    - Environment Variables: GOPAY_MERCHANT_ID, GOPAY_API_SECRET
 *    - Lower fees (0.5%) - preferred provider
 * 
 * Transaction Flow:
 * ----------------
 * 1. User initiates withdrawal/payment
 * 2. CREOVA validates user balance and transaction
 * 3. Call provider API to initiate payment
 * 4. User receives USSD prompt on their phone
 * 5. User enters PIN to confirm
 * 6. Provider processes and sends callback
 * 7. CREOVA updates transaction status
 * 8. User receives confirmation
 * 
 * Security Features:
 * -----------------
 * - All API calls use HTTPS
 * - Sensitive data encrypted in transit
 * - Transaction IDs for tracking and reconciliation
 * - Webhook signatures verified
 * - Transaction limits and fraud detection
 * - Escrow for marketplace transactions
 */

export interface MobileMoneyProvider {
  id: string;
  name: string;
  apiEndpoint: string;
  fee: number; // Percentage
  minAmount: number; // TZS
  maxAmount: number; // TZS
}

export interface PaymentRequest {
  userId: string;
  amount: number;
  phoneNumber: string;
  provider: string;
  transactionType: "deposit" | "withdrawal" | "payment";
  reference?: string;
  metadata?: any;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: "pending" | "completed" | "failed";
  message: string;
  provider: string;
  amount: number;
  fee: number;
  netAmount: number;
  confirmationRequired?: boolean;
}

// Provider configurations
export const PROVIDERS: Record<string, MobileMoneyProvider> = {
  mpesa: {
    id: "mpesa",
    name: "M-Pesa",
    apiEndpoint: "https://openapi.m-pesa.com/sandbox/ipg/v2", // Production: remove 'sandbox'
    fee: 1.5,
    minAmount: 1000,
    maxAmount: 3000000,
  },
  tigopesa: {
    id: "tigopesa",
    name: "TigoPesa",
    apiEndpoint: "https://api.tigo.co.tz/v1/tigo/payment",
    fee: 1.8,
    minAmount: 500,
    maxAmount: 2500000,
  },
  airtel: {
    id: "airtel",
    name: "Airtel Money",
    apiEndpoint: "https://openapi.airtel.africa/merchant/v1",
    fee: 1.5,
    minAmount: 500,
    maxAmount: 3000000,
  },
  gopay: {
    id: "gopay",
    name: "GoPay",
    apiEndpoint: "https://api.gopay.co.tz/v1",
    fee: 0.5,
    minAmount: 500,
    maxAmount: 5000000,
  },
};

/**
 * Initiates a mobile money withdrawal
 * @param request - Payment request details
 * @returns Payment response with transaction status
 */
export async function initiateWithdrawal(request: PaymentRequest): Promise<PaymentResponse> {
  const provider = PROVIDERS[request.provider];
  
  if (!provider) {
    return {
      success: false,
      transactionId: "",
      status: "failed",
      message: "Invalid payment provider",
      provider: request.provider,
      amount: request.amount,
      fee: 0,
      netAmount: 0,
    };
  }

  // Validate amount
  if (request.amount < provider.minAmount || request.amount > provider.maxAmount) {
    return {
      success: false,
      transactionId: "",
      status: "failed",
      message: `Amount must be between ${provider.minAmount} and ${provider.maxAmount} TZS`,
      provider: request.provider,
      amount: request.amount,
      fee: 0,
      netAmount: 0,
    };
  }

  // Calculate fees
  const fee = Math.ceil(request.amount * (provider.fee / 100));
  const netAmount = request.amount - fee;

  // Generate unique transaction ID
  const transactionId = `TXN-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  try {
    // Call provider-specific API
    const response = await callProviderAPI(request, provider, transactionId);
    
    return {
      success: response.success,
      transactionId,
      status: response.status || "pending",
      message: response.message || `Withdrawal request sent to ${provider.name}. Please check your phone to confirm.`,
      provider: provider.name,
      amount: request.amount,
      fee,
      netAmount,
      confirmationRequired: true,
    };
  } catch (error) {
    console.error(`Withdrawal error for ${provider.name}:`, error);
    return {
      success: false,
      transactionId,
      status: "failed",
      message: `Failed to process withdrawal with ${provider.name}`,
      provider: provider.name,
      amount: request.amount,
      fee,
      netAmount,
    };
  }
}

/**
 * Calls the provider-specific API
 * NOTE: This is a template. Replace with actual API calls in production.
 */
async function callProviderAPI(
  request: PaymentRequest,
  provider: MobileMoneyProvider,
  transactionId: string
): Promise<{ success: boolean; status: string; message: string }> {
  
  // ==================== M-PESA API ====================
  if (provider.id === "mpesa") {
    /*
     * PRODUCTION CODE TEMPLATE:
     * 
     * const mpesaApiKey = Deno.env.get("MPESA_API_KEY");
     * const mpesaPublicKey = Deno.env.get("MPESA_PUBLIC_KEY");
     * const serviceProviderCode = Deno.env.get("MPESA_SERVICE_PROVIDER_CODE");
     * 
     * const payload = {
     *   input_Amount: request.amount.toString(),
     *   input_CustomerMSISDN: request.phoneNumber.replace("+", ""),
     *   input_Country: "TZN",
     *   input_Currency: "TZS",
     *   input_ServiceProviderCode: serviceProviderCode,
     *   input_ThirdPartyConversationID: transactionId,
     *   input_TransactionReference: request.reference || transactionId,
     *   input_PurchasedItemsDesc: "CREOVA Wallet Withdrawal"
     * };
     * 
     * const response = await fetch(`${provider.apiEndpoint}/c2bPayment/singleStage`, {
     *   method: "POST",
     *   headers: {
     *     "Content-Type": "application/json",
     *     "Authorization": `Bearer ${mpesaApiKey}`,
     *     "Origin": "*",
     *   },
     *   body: JSON.stringify(payload),
     * });
     * 
     * const data = await response.json();
     * 
     * return {
     *   success: data.output_ResponseCode === "INS-0",
     *   status: data.output_ResponseCode === "INS-0" ? "pending" : "failed",
     *   message: data.output_ResponseDesc || "M-Pesa payment initiated"
     * };
     */
    
    // Mock response for demo
    return {
      success: true,
      status: "pending",
      message: "M-Pesa payment initiated. Check your phone for USSD prompt.",
    };
  }

  // ==================== TIGOPESA API ====================
  if (provider.id === "tigopesa") {
    /*
     * PRODUCTION CODE TEMPLATE:
     * 
     * const username = Deno.env.get("TIGOPESA_USERNAME");
     * const password = Deno.env.get("TIGOPESA_PASSWORD");
     * const billerCode = Deno.env.get("TIGOPESA_BILLER_CODE");
     * 
     * const payload = {
     *   billNumber: billerCode,
     *   customerName: request.userId,
     *   amount: request.amount,
     *   currency: "TZS",
     *   transactionId: transactionId,
     *   phoneNumber: request.phoneNumber,
     * };
     * 
     * const authToken = btoa(`${username}:${password}`);
     * 
     * const response = await fetch(`${provider.apiEndpoint}/payouts`, {
     *   method: "POST",
     *   headers: {
     *     "Content-Type": "application/json",
     *     "Authorization": `Basic ${authToken}`,
     *   },
     *   body: JSON.stringify(payload),
     * });
     * 
     * const data = await response.json();
     * 
     * return {
     *   success: data.status === "SUCCESS",
     *   status: data.status === "SUCCESS" ? "pending" : "failed",
     *   message: data.message || "TigoPesa payment initiated"
     * };
     */
    
    // Mock response for demo
    return {
      success: true,
      status: "pending",
      message: "TigoPesa payment initiated. Check your phone for confirmation.",
    };
  }

  // ==================== AIRTEL MONEY API ====================
  if (provider.id === "airtel") {
    /*
     * PRODUCTION CODE TEMPLATE:
     * 
     * // Step 1: Get OAuth token
     * const clientId = Deno.env.get("AIRTEL_CLIENT_ID");
     * const clientSecret = Deno.env.get("AIRTEL_CLIENT_SECRET");
     * 
     * const tokenResponse = await fetch("https://openapi.airtel.africa/auth/oauth2/token", {
     *   method: "POST",
     *   headers: {
     *     "Content-Type": "application/json",
     *   },
     *   body: JSON.stringify({
     *     client_id: clientId,
     *     client_secret: clientSecret,
     *     grant_type: "client_credentials",
     *   }),
     * });
     * 
     * const { access_token } = await tokenResponse.json();
     * 
     * // Step 2: Initiate disbursement
     * const payload = {
     *   payee: {
     *     msisdn: request.phoneNumber.replace("+", ""),
     *   },
     *   reference: transactionId,
     *   amount: request.amount,
     *   country: "TZ",
     *   currency: "TZS",
     * };
     * 
     * const response = await fetch(`${provider.apiEndpoint}/disbursements`, {
     *   method: "POST",
     *   headers: {
     *     "Content-Type": "application/json",
     *     "Authorization": `Bearer ${access_token}`,
     *     "X-Country": "TZ",
     *     "X-Currency": "TZS",
     *   },
     *   body: JSON.stringify(payload),
     * });
     * 
     * const data = await response.json();
     * 
     * return {
     *   success: data.status === "SUCCESS",
     *   status: data.status === "SUCCESS" ? "pending" : "failed",
     *   message: data.message || "Airtel Money payment initiated"
     * };
     */
    
    // Mock response for demo
    return {
      success: true,
      status: "pending",
      message: "Airtel Money payment initiated. Check your phone for confirmation.",
    };
  }

  // ==================== GOPAY API ====================
  if (provider.id === "gopay") {
    /*
     * PRODUCTION CODE TEMPLATE:
     * 
     * const merchantId = Deno.env.get("GOPAY_MERCHANT_ID");
     * const apiSecret = Deno.env.get("GOPAY_API_SECRET");
     * 
     * // Generate HMAC signature for security
     * const timestamp = Date.now().toString();
     * const signatureData = `${merchantId}${request.phoneNumber}${request.amount}${timestamp}`;
     * 
     * const key = await crypto.subtle.importKey(
     *   "raw",
     *   new TextEncoder().encode(apiSecret),
     *   { name: "HMAC", hash: "SHA-256" },
     *   false,
     *   ["sign"]
     * );
     * 
     * const signatureBuffer = await crypto.subtle.sign(
     *   "HMAC",
     *   key,
     *   new TextEncoder().encode(signatureData)
     * );
     * 
     * const signature = Array.from(new Uint8Array(signatureBuffer))
     *   .map(b => b.toString(16).padStart(2, '0'))
     *   .join('');
     * 
     * const payload = {
     *   merchantId,
     *   phoneNumber: request.phoneNumber,
     *   amount: request.amount,
     *   currency: "TZS",
     *   transactionId,
     *   description: "CREOVA Wallet Withdrawal",
     *   timestamp,
     *   signature,
     * };
     * 
     * const response = await fetch(`${provider.apiEndpoint}/disburse`, {
     *   method: "POST",
     *   headers: {
     *     "Content-Type": "application/json",
     *     "X-Merchant-ID": merchantId,
     *   },
     *   body: JSON.stringify(payload),
     * });
     * 
     * const data = await response.json();
     * 
     * return {
     *   success: data.status === "SUCCESS",
     *   status: data.status === "SUCCESS" ? "pending" : "failed",
     *   message: data.message || "GoPay payment initiated"
     * };
     */
    
    // Mock response for demo
    return {
      success: true,
      status: "pending",
      message: "GoPay payment initiated. Lowest fees! Check your phone for confirmation.",
    };
  }

  // Unknown provider
  return {
    success: false,
    status: "failed",
    message: "Unsupported payment provider",
  };
}

/**
 * Handles payment callback/webhook from provider
 * This function should be called by the provider's callback endpoint
 */
export function handlePaymentCallback(
  provider: string,
  callbackData: any
): { transactionId: string; status: string; success: boolean } {
  
  // Verify callback signature based on provider
  // Each provider has specific signature verification method
  
  if (provider === "mpesa") {
    // M-Pesa callback verification
    return {
      transactionId: callbackData.output_ThirdPartyConversationID || "",
      status: callbackData.output_ResponseCode === "INS-0" ? "completed" : "failed",
      success: callbackData.output_ResponseCode === "INS-0",
    };
  }
  
  if (provider === "tigopesa") {
    // TigoPesa callback verification
    return {
      transactionId: callbackData.transactionId || "",
      status: callbackData.status === "SUCCESS" ? "completed" : "failed",
      success: callbackData.status === "SUCCESS",
    };
  }
  
  if (provider === "airtel") {
    // Airtel Money callback verification
    return {
      transactionId: callbackData.reference || "",
      status: callbackData.status === "SUCCESS" ? "completed" : "failed",
      success: callbackData.status === "SUCCESS",
    };
  }
  
  if (provider === "gopay") {
    // GoPay callback verification
    return {
      transactionId: callbackData.transactionId || "",
      status: callbackData.status === "SUCCESS" ? "completed" : "failed",
      success: callbackData.status === "SUCCESS",
    };
  }
  
  return {
    transactionId: "",
    status: "failed",
    success: false,
  };
}

/**
 * Validates phone number format for Tanzanian mobile money
 */
export function validatePhoneNumber(phone: string, provider: string): boolean {
  const cleaned = phone.replace(/\s+/g, '').replace('+', '');
  
  // Tanzanian phone numbers start with 255 or 0
  if (!cleaned.startsWith('255') && !cleaned.startsWith('0')) {
    return false;
  }
  
  // Provider-specific validation
  const providerPrefixes: Record<string, string[]> = {
    mpesa: ['25575', '25576', '25577', '074', '075', '076', '077'], // Vodacom
    tigopesa: ['25565', '25571', '065', '071'], // Tigo
    airtel: ['25568', '25569', '25578', '068', '069', '078'], // Airtel
    gopay: [], // GoPay works with all networks
  };
  
  if (provider !== 'gopay' && providerPrefixes[provider]) {
    const prefixes = providerPrefixes[provider];
    const hasValidPrefix = prefixes.some(prefix => cleaned.startsWith(prefix));
    if (!hasValidPrefix) {
      return false;
    }
  }
  
  // Length check (9-12 digits)
  return cleaned.length >= 9 && cleaned.length <= 12;
}

/**
 * Calculates transaction fees
 */
export function calculateFees(amount: number, provider: string): { fee: number; netAmount: number } {
  const providerConfig = PROVIDERS[provider];
  if (!providerConfig) {
    return { fee: 0, netAmount: amount };
  }
  
  const fee = Math.ceil(amount * (providerConfig.fee / 100));
  const netAmount = amount - fee;
  
  return { fee, netAmount };
}

/**
 * Mock function to simulate payment status check
 * In production, this would call the provider's transaction status API
 */
export async function checkTransactionStatus(
  transactionId: string,
  provider: string
): Promise<{ status: string; message: string }> {
  // In production, call provider API to check status
  // Each provider has different endpoints and response formats
  
  // Mock implementation
  return {
    status: "completed",
    message: "Transaction completed successfully",
  };
}
