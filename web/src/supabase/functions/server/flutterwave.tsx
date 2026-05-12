/**
 * FLUTTERWAVE PAYMENT INTEGRATION
 * Pan-African payment gateway supporting:
 * - Mobile money (15+ African countries)
 * - Card payments (Visa, Mastercard)
 * - Bank transfers
 * - USSD payments
 */

const FLUTTERWAVE_SECRET_KEY = Deno.env.get("FLUTTERWAVE_SECRET_KEY") || "";
const FLUTTERWAVE_PUBLIC_KEY = Deno.env.get("FLUTTERWAVE_PUBLIC_KEY") || "";
const FLUTTERWAVE_ENCRYPTION_KEY = Deno.env.get("FLUTTERWAVE_ENCRYPTION_KEY") || "";

export interface FlutterwavePaymentRequest {
  amount: number;
  currency: string; // TZS, KES, NGN, GHS, etc.
  email: string;
  phone_number: string;
  name: string;
  tx_ref: string; // Unique transaction reference
  redirect_url?: string;
  payment_type?: "mobilemoney" | "card" | "banktransfer" | "ussd";
  country?: string; // TZ, KE, NG, GH, etc.
}

export interface FlutterwavePaymentResponse {
  status: string;
  message: string;
  data?: {
    link: string; // Payment link for customer
    tx_ref: string;
    amount: number;
    currency: string;
  };
}

export interface FlutterwaveVerificationResponse {
  status: string;
  message: string;
  data?: {
    id: number;
    tx_ref: string;
    amount: number;
    currency: string;
    charged_amount: number;
    status: "successful" | "failed" | "pending";
    customer: {
      email: string;
      phone_number: string;
      name: string;
    };
    created_at: string;
  };
}

/**
 * Initialize a Flutterwave payment
 */
export async function initiateFlutterwavePayment(
  request: FlutterwavePaymentRequest
): Promise<FlutterwavePaymentResponse> {
  try {
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: request.tx_ref,
        amount: request.amount,
        currency: request.currency,
        redirect_url: request.redirect_url || "https://creova.com/payment-success",
        payment_options: request.payment_type || "mobilemoney,card",
        customer: {
          email: request.email,
          phone_number: request.phone_number,
          name: request.name,
        },
        customizations: {
          title: "CREOVA Agri-AI Payment",
          description: "Agricultural services payment",
          logo: "https://creova.com/logo.png",
        },
        meta: {
          platform: "CREOVA Agri-AI Suite",
          country: request.country || "TZ",
        },
      }),
    });

    const data = await response.json();

    if (response.ok && data.status === "success") {
      return {
        status: "success",
        message: "Payment initiated successfully",
        data: {
          link: data.data.link,
          tx_ref: request.tx_ref,
          amount: request.amount,
          currency: request.currency,
        },
      };
    } else {
      console.error("Flutterwave payment initiation error:", data);
      return {
        status: "error",
        message: data.message || "Failed to initiate payment",
      };
    }
  } catch (error) {
    console.error("Flutterwave payment initiation exception:", error);
    return {
      status: "error",
      message: `Payment initiation failed: ${error.message}`,
    };
  }
}

/**
 * Verify a Flutterwave payment transaction
 */
export async function verifyFlutterwavePayment(
  transactionId: string
): Promise<FlutterwaveVerificationResponse> {
  try {
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.status === "success") {
      return {
        status: "success",
        message: "Payment verified successfully",
        data: data.data,
      };
    } else {
      console.error("Flutterwave payment verification error:", data);
      return {
        status: "error",
        message: data.message || "Failed to verify payment",
      };
    }
  } catch (error) {
    console.error("Flutterwave payment verification exception:", error);
    return {
      status: "error",
      message: `Payment verification failed: ${error.message}`,
    };
  }
}

/**
 * Process mobile money payment via Flutterwave
 * Supports: MTN, Vodafone, Airtel, Tigo, M-Pesa across Africa
 */
export async function processFlutterwaveMobileMoney(
  amount: number,
  phoneNumber: string,
  email: string,
  name: string,
  currency: string = "TZS",
  country: string = "TZ"
): Promise<FlutterwavePaymentResponse> {
  const txRef = `CREOVA-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  return await initiateFlutterwavePayment({
    amount,
    currency,
    email,
    phone_number: phoneNumber,
    name,
    tx_ref: txRef,
    payment_type: "mobilemoney",
    country,
  });
}

/**
 * Get supported countries and currencies
 */
export function getFlutterwaveSupportedCountries() {
  return [
    { code: "TZ", name: "Tanzania", currency: "TZS", flag: "🇹🇿" },
    { code: "KE", name: "Kenya", currency: "KES", flag: "🇰🇪" },
    { code: "NG", name: "Nigeria", currency: "NGN", flag: "🇳🇬" },
    { code: "GH", name: "Ghana", currency: "GHS", flag: "🇬🇭" },
    { code: "UG", name: "Uganda", currency: "UGX", flag: "🇺🇬" },
    { code: "RW", name: "Rwanda", currency: "RWF", flag: "🇷🇼" },
    { code: "ZM", name: "Zambia", currency: "ZMW", flag: "🇿🇲" },
    { code: "ZA", name: "South Africa", currency: "ZAR", flag: "🇿🇦" },
  ];
}

/**
 * Validate Flutterwave webhook signature
 */
export async function validateFlutterwaveWebhook(
  signature: string,
  payload: string
): Promise<boolean> {
  try {
    // Flutterwave uses SHA256 HMAC for webhook verification
    const crypto = await import("node:crypto");
    const hash = crypto
      .createHmac("sha256", FLUTTERWAVE_SECRET_KEY)
      .update(payload)
      .digest("hex");
    
    return hash === signature;
  } catch (error) {
    console.error("Error validating Flutterwave webhook:", error);
    return false;
  }
}

/**
 * Process Flutterwave webhook event
 */
export interface FlutterwaveWebhookEvent {
  event: "charge.completed" | "transfer.completed" | "transfer.failed";
  data: {
    id: number;
    tx_ref: string;
    amount: number;
    currency: string;
    status: string;
    customer: {
      email: string;
      phone_number: string;
      name: string;
    };
  };
}

export async function processFlutterwaveWebhook(
  event: FlutterwaveWebhookEvent
): Promise<{ success: boolean; message: string }> {
  try {
    console.log(`Processing Flutterwave webhook: ${event.event}`);
    
    if (event.event === "charge.completed" && event.data.status === "successful") {
      return {
        success: true,
        message: `Payment ${event.data.tx_ref} completed successfully`,
      };
    } else if (event.event === "transfer.completed") {
      return {
        success: true,
        message: `Transfer ${event.data.tx_ref} completed successfully`,
      };
    } else if (event.event === "transfer.failed") {
      return {
        success: false,
        message: `Transfer ${event.data.tx_ref} failed`,
      };
    }
    
    return {
      success: true,
      message: "Webhook processed",
    };
  } catch (error: any) {
    console.error("Error processing Flutterwave webhook:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}