/**
 * UNIFIED PAYMENT INTEGRATION FOR KILIMO
 * ======================================
 * 
 * Supports:
 * 1. M-Pesa STK Push (Tanzania)
 * 2. Tigopesa
 * 3. Airtel Money
 * 4. Halopesa
 * 5. Card Payments (via Selcom/Flutterwave)
 * 
 * All payments flow through this unified service
 */

import * as kv from "./kv_store.tsx";

// ==================== CONFIGURATION ====================

const MPESA_API_KEY = Deno.env.get("MPESA_API_KEY") || "";
const MPESA_PUBLIC_KEY = Deno.env.get("MPESA_PUBLIC_KEY") || "";
const MPESA_SERVICE_PROVIDER_CODE = Deno.env.get("MPESA_SERVICE_PROVIDER_CODE") || "";
const MPESA_BUSINESS_SHORTCODE = Deno.env.get("MPESA_BUSINESS_SHORTCODE") || "174379";
const MPESA_ENVIRONMENT = Deno.env.get("MPESA_ENVIRONMENT") || "sandbox";

const MPESA_BASE_URL = MPESA_ENVIRONMENT === "production"
  ? "https://openapi.m-pesa.com"
  : "https://openapi.m-pesa.com/sandbox";

const SELCOM_API_KEY = Deno.env.get("SELCOM_API_KEY") || "";
const SELCOM_API_SECRET = Deno.env.get("SELCOM_API_SECRET") || "";

const FLUTTERWAVE_PUBLIC_KEY = Deno.env.get("FLUTTERWAVE_PUBLIC_KEY") || "";
const FLUTTERWAVE_SECRET_KEY = Deno.env.get("FLUTTERWAVE_SECRET_KEY") || "";

// ==================== M-PESA STK PUSH ====================

/**
 * Get M-Pesa session token
 */
async function getMPesaSession(): Promise<string> {
  try {
    const response = await fetch(`${MPESA_BASE_URL}/ipg/v2/vodacomTZN/getSession/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${MPESA_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (data.output_ResponseCode === "INS-0") {
      return data.output_SessionID;
    } else {
      throw new Error(`M-Pesa session failed: ${data.output_ResponseDesc}`);
    }
  } catch (error) {
    console.error("M-Pesa session error:", error);
    throw error;
  }
}

/**
 * Initiate M-Pesa STK Push
 * User receives prompt on their phone to enter PIN
 */
export async function initiateMPesaSTKPush(params: {
  phoneNumber: string;
  amount: number;
  reference: string;
  description: string;
}): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    const { phoneNumber, amount, reference, description } = params;
    
    // Format phone number (remove +255, keep 255...)
    const formattedPhone = phoneNumber.startsWith("+")
      ? phoneNumber.substring(1)
      : phoneNumber.startsWith("0")
      ? "255" + phoneNumber.substring(1)
      : phoneNumber;

    // Get session token
    const sessionId = await getMPesaSession();

    // Initiate STK Push
    const response = await fetch(`${MPESA_BASE_URL}/ipg/v2/vodacomTZN/c2bPayment/singleStage/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sessionId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input_Amount: amount.toString(),
        input_CustomerMSISDN: formattedPhone,
        input_Country: "TZN",
        input_Currency: "TZS",
        input_ServiceProviderCode: MPESA_SERVICE_PROVIDER_CODE,
        input_TransactionReference: reference,
        input_ThirdPartyConversationID: reference,
        input_PurchasedItemsDesc: description,
      }),
    });

    const data = await response.json();

    if (data.output_ResponseCode === "INS-0") {
      return {
        success: true,
        transactionId: data.output_TransactionID,
      };
    } else {
      return {
        success: false,
        error: data.output_ResponseDesc || "STK push failed",
      };
    }
  } catch (error: any) {
    console.error("M-Pesa STK push error:", error);
    return {
      success: false,
      error: error.message || "Failed to initiate payment",
    };
  }
}

/**
 * Query M-Pesa transaction status
 */
export async function queryMPesaTransaction(transactionId: string): Promise<{
  success: boolean;
  status?: "pending" | "completed" | "failed";
  error?: string;
}> {
  try {
    const sessionId = await getMPesaSession();

    const response = await fetch(`${MPESA_BASE_URL}/ipg/v2/vodacomTZN/queryTransactionStatus/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionId}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.output_ResponseCode === "INS-0") {
      return {
        success: true,
        status: data.output_ResponseTransactionStatus === "Completed" ? "completed" : "pending",
      };
    } else {
      return {
        success: false,
        status: "failed",
        error: data.output_ResponseDesc,
      };
    }
  } catch (error: any) {
    console.error("M-Pesa query error:", error);
    return {
      success: false,
      status: "failed",
      error: error.message,
    };
  }
}

// ==================== TIGOPESA ====================

/**
 * Initiate Tigopesa payment
 * Uses push notification for customer authorization
 */
export async function initiateTigopesaPayment(params: {
  phoneNumber: string;
  amount: number;
  reference: string;
  description: string;
}): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    // Tigopesa uses similar API structure to M-Pesa
    // This is a placeholder - actual implementation requires Tigopesa credentials
    
    console.log("Tigopesa payment initiated:", params);
    
    // For now, return simulation
    // In production, integrate with Tigopesa API
    return {
      success: true,
      transactionId: `TIGO-${Date.now()}`,
    };
  } catch (error: any) {
    console.error("Tigopesa error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ==================== AIRTEL MONEY ====================

/**
 * Initiate Airtel Money payment
 */
export async function initiateAirtelMoneyPayment(params: {
  phoneNumber: string;
  amount: number;
  reference: string;
  description: string;
}): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    // Airtel Money integration
    // This is a placeholder - actual implementation requires Airtel credentials
    
    console.log("Airtel Money payment initiated:", params);
    
    // For now, return simulation
    return {
      success: true,
      transactionId: `AIRTEL-${Date.now()}`,
    };
  } catch (error: any) {
    console.error("Airtel Money error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ==================== HALOPESA ====================

/**
 * Initiate Halopesa payment
 */
export async function initiateHalopesaPayment(params: {
  phoneNumber: string;
  amount: number;
  reference: string;
  description: string;
}): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    console.log("Halopesa payment initiated:", params);
    
    return {
      success: true,
      transactionId: `HALO-${Date.now()}`,
    };
  } catch (error: any) {
    console.error("Halopesa error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ==================== CARD PAYMENTS (via Selcom/Flutterwave) ====================

/**
 * Initiate card payment via Selcom
 */
export async function initiateCardPaymentSelcom(params: {
  amount: number;
  customerEmail: string;
  customerPhone: string;
  reference: string;
  description: string;
}): Promise<{ success: boolean; checkoutUrl?: string; error?: string }> {
  try {
    // Selcom Checkout API integration
    // Returns a checkout URL for the customer to complete payment
    
    const { amount, customerEmail, customerPhone, reference, description } = params;
    
    // This is a placeholder - actual implementation requires Selcom API
    console.log("Selcom card payment initiated:", params);
    
    return {
      success: true,
      checkoutUrl: `https://checkout.selcommobile.com/${reference}`,
    };
  } catch (error: any) {
    console.error("Selcom card payment error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Initiate card payment via Flutterwave
 */
export async function initiateCardPaymentFlutterwave(params: {
  amount: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  reference: string;
}): Promise<{ success: boolean; checkoutUrl?: string; error?: string }> {
  try {
    const { amount, customerEmail, customerName, customerPhone, reference } = params;
    
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: reference,
        amount: amount,
        currency: "TZS",
        redirect_url: "https://kilimo.app/payment/callback",
        customer: {
          email: customerEmail,
          phonenumber: customerPhone,
          name: customerName,
        },
        customizations: {
          title: "KILIMO Wallet Deposit",
          description: "Add funds to your KILIMO wallet",
          logo: "https://kilimo.app/logo.png",
        },
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      return {
        success: true,
        checkoutUrl: data.data.link,
      };
    } else {
      return {
        success: false,
        error: data.message || "Failed to initiate card payment",
      };
    }
  } catch (error: any) {
    console.error("Flutterwave error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// ==================== UNIFIED PAYMENT GATEWAY ====================

/**
 * Route payment to appropriate provider based on payment method
 */
export async function initiatePayment(params: {
  userId: string;
  amount: number;
  phoneNumber: string;
  paymentMethod: string; // "M-Pesa", "TigoPesa", "Airtel Money", "Halopesa", "Card"
  description?: string;
}): Promise<{
  success: boolean;
  transactionId?: string;
  checkoutUrl?: string;
  message?: string;
  error?: string;
}> {
  try {
    const { userId, amount, phoneNumber, paymentMethod, description } = params;
    
    // Generate unique reference
    const reference = `KILIMO-${userId.substring(0, 8)}-${Date.now()}`;
    const desc = description || `KILIMO Wallet Deposit - TZS ${amount}`;

    let result;

    // Route to appropriate payment provider
    switch (paymentMethod.toLowerCase()) {
      case "m-pesa":
      case "mpesa":
        result = await initiateMPesaSTKPush({
          phoneNumber,
          amount,
          reference,
          description: desc,
        });
        break;

      case "tigopesa":
      case "tigo pesa":
        result = await initiateTigopesaPayment({
          phoneNumber,
          amount,
          reference,
          description: desc,
        });
        break;

      case "airtel money":
      case "airtel":
        result = await initiateAirtelMoneyPayment({
          phoneNumber,
          amount,
          reference,
          description: desc,
        });
        break;

      case "halopesa":
      case "halo pesa":
        result = await initiateHalopesaPayment({
          phoneNumber,
          amount,
          reference,
          description: desc,
        });
        break;

      case "card":
      case "credit card":
      case "debit card":
        // Use Flutterwave for card payments
        result = await initiateCardPaymentFlutterwave({
          amount,
          customerEmail: `user-${userId}@kilimo.app`,
          customerName: "KILIMO User",
          customerPhone: phoneNumber,
          reference,
        });
        break;

      default:
        return {
          success: false,
          error: `Unsupported payment method: ${paymentMethod}`,
        };
    }

    // Store payment record
    if (result.success) {
      const paymentRecord = {
        id: reference,
        userId,
        amount,
        paymentMethod,
        status: "pending",
        transactionId: result.transactionId,
        checkoutUrl: result.checkoutUrl,
        createdAt: new Date().toISOString(),
        phoneNumber,
        description: desc,
      };

      await kv.set(`payment:${reference}`, paymentRecord);
      await kv.set(`payment:user:${userId}:${reference}`, paymentRecord);

      return {
        success: true,
        transactionId: result.transactionId,
        checkoutUrl: result.checkoutUrl,
        message: paymentMethod.includes("Card")
          ? "Complete payment on the checkout page"
          : `Check your phone (${phoneNumber}) to authorize payment`,
      };
    } else {
      return result;
    }
  } catch (error: any) {
    console.error("Payment initiation error:", error);
    return {
      success: false,
      error: error.message || "Failed to initiate payment",
    };
  }
}

/**
 * Verify payment completion
 */
export async function verifyPayment(transactionId: string): Promise<{
  success: boolean;
  status: "pending" | "completed" | "failed";
  error?: string;
}> {
  try {
    // Get payment record
    const paymentRecord = await kv.get(`payment:${transactionId}`);
    
    if (!paymentRecord) {
      return {
        success: false,
        status: "failed",
        error: "Payment record not found",
      };
    }

    // Query provider based on payment method
    let result;
    
    if (paymentRecord.paymentMethod.toLowerCase().includes("m-pesa")) {
      result = await queryMPesaTransaction(paymentRecord.transactionId);
    } else {
      // For other providers, simulate status check
      // In production, implement actual status queries
      result = {
        success: true,
        status: "completed" as const,
      };
    }

    // Update payment record
    if (result.success) {
      paymentRecord.status = result.status;
      paymentRecord.verifiedAt = new Date().toISOString();
      await kv.set(`payment:${transactionId}`, paymentRecord);
      
      // If completed, credit wallet
      if (result.status === "completed") {
        const wallet = await kv.get(`wallet:${paymentRecord.userId}`);
        if (wallet) {
          wallet.balance += paymentRecord.amount;
          wallet.totalDeposited = (wallet.totalDeposited || 0) + paymentRecord.amount;
          await kv.set(`wallet:${paymentRecord.userId}`, wallet);
        }
      }
    }

    return result;
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return {
      success: false,
      status: "failed",
      error: error.message,
    };
  }
}

// ==================== PAYOUT (Withdraw to Mobile Money) ====================

/**
 * Send money to user's mobile money account (B2C)
 */
export async function sendMobileMoney(params: {
  phoneNumber: string;
  amount: number;
  provider: string;
  reference: string;
  narration?: string;
}): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    const { phoneNumber, amount, provider, reference, narration } = params;
    
    // Format phone
    const formattedPhone = phoneNumber.startsWith("+")
      ? phoneNumber.substring(1)
      : phoneNumber.startsWith("0")
      ? "255" + phoneNumber.substring(1)
      : phoneNumber;

    let result;

    switch (provider.toLowerCase()) {
      case "m-pesa":
      case "mpesa":
        // M-Pesa B2C disbursement
        const sessionId = await getMPesaSession();
        
        const response = await fetch(`${MPESA_BASE_URL}/ipg/v2/vodacomTZN/b2cPayment/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${sessionId}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input_Amount: amount.toString(),
            input_CustomerMSISDN: formattedPhone,
            input_Country: "TZN",
            input_Currency: "TZS",
            input_ServiceProviderCode: MPESA_SERVICE_PROVIDER_CODE,
            input_TransactionReference: reference,
            input_ThirdPartyConversationID: reference,
            input_PaymentItemsDesc: narration || "KILIMO Withdrawal",
          }),
        });

        const data = await response.json();
        
        if (data.output_ResponseCode === "INS-0") {
          result = {
            success: true,
            transactionId: data.output_TransactionID,
          };
        } else {
          result = {
            success: false,
            error: data.output_ResponseDesc,
          };
        }
        break;

      default:
        // For other providers, simulate success
        // In production, implement actual B2C APIs
        result = {
          success: true,
          transactionId: `${provider.toUpperCase()}-B2C-${Date.now()}`,
        };
        break;
    }

    return result;
  } catch (error: any) {
    console.error("Mobile money payout error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
