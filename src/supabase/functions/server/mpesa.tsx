/**
 * M-PESA DIRECT INTEGRATION (Tanzania)
 * ====================================
 * 
 * Direct integration with M-Pesa Tanzania (Vodacom) API
 * Supports:
 * - Customer-to-Business (C2B) payments
 * - Business-to-Customer (B2C) disbursements
 * - Transaction status queries
 */

const MPESA_API_KEY = Deno.env.get("MPESA_API_KEY") || "";
const MPESA_PUBLIC_KEY = Deno.env.get("MPESA_PUBLIC_KEY") || "";
const MPESA_SERVICE_PROVIDER_CODE = Deno.env.get("MPESA_SERVICE_PROVIDER_CODE") || "";
const MPESA_INITIATOR_IDENTIFIER = Deno.env.get("MPESA_INITIATOR_IDENTIFIER") || "";
const MPESA_SECURITY_CREDENTIAL = Deno.env.get("MPESA_SECURITY_CREDENTIAL") || "";
const MPESA_ENVIRONMENT = Deno.env.get("MPESA_ENVIRONMENT") || "sandbox"; // sandbox or production

// API endpoints
const MPESA_BASE_URL = MPESA_ENVIRONMENT === "production"
  ? "https://openapi.m-pesa.com"
  : "https://openapi.m-pesa.com/sandbox";

/**
 * Generate M-Pesa access token
 */
async function getMPesaAccessToken(): Promise<string> {
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
      throw new Error(`Failed to get M-Pesa session: ${data.output_ResponseDesc}`);
    }
  } catch (error: any) {
    console.error("M-Pesa authentication error:", error);
    throw error;
  }
}

/**
 * Customer-to-Business (C2B) Payment Request
 * User pays from M-Pesa wallet to business account
 */
export interface MPesaC2BRequest {
  amount: number;
  customerMSISDN: string; // Phone number in format 255XXXXXXXXX
  transactionReference: string;
  thirdPartyReference: string; // Your internal reference
}

export interface MPesaC2BResponse {
  success: boolean;
  transactionID?: string;
  conversationID?: string;
  responseCode?: string;
  responseDescription?: string;
  error?: string;
}

export async function initiateMPesaC2BPayment(
  request: MPesaC2BRequest
): Promise<MPesaC2BResponse> {
  try {
    const sessionId = await getMPesaAccessToken();
    
    const payload = {
      input_ServiceProviderCode: MPESA_SERVICE_PROVIDER_CODE,
      input_CustomerMSISDN: request.customerMSISDN,
      input_Amount: request.amount.toFixed(2),
      input_TransactionReference: request.transactionReference,
      input_ThirdPartyConversationID: request.thirdPartyReference,
      input_PurchasedItemsDesc: "KILIMO Agri-AI Services",
    };

    const response = await fetch(`${MPESA_BASE_URL}/ipg/v2/vodacomTZN/c2bPayment/singleStage/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sessionId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.output_ResponseCode === "INS-0") {
      return {
        success: true,
        transactionID: data.output_TransactionID,
        conversationID: data.output_ConversationID,
        responseCode: data.output_ResponseCode,
        responseDescription: data.output_ResponseDesc,
      };
    } else {
      return {
        success: false,
        responseCode: data.output_ResponseCode,
        responseDescription: data.output_ResponseDesc,
        error: data.output_ResponseDesc,
      };
    }
  } catch (error: any) {
    console.error("M-Pesa C2B payment error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Business-to-Customer (B2C) Payment/Disbursement
 * Business pays user from business account to M-Pesa wallet
 */
export interface MPesaB2CRequest {
  amount: number;
  customerMSISDN: string;
  transactionReference: string;
  thirdPartyReference: string;
}

export interface MPesaB2CResponse {
  success: boolean;
  transactionID?: string;
  conversationID?: string;
  responseCode?: string;
  responseDescription?: string;
  error?: string;
}

export async function initiateMPesaB2CPayment(
  request: MPesaB2CRequest
): Promise<MPesaB2CResponse> {
  try {
    const sessionId = await getMPesaAccessToken();
    
    const payload = {
      input_ServiceProviderCode: MPESA_SERVICE_PROVIDER_CODE,
      input_InitiatorIdentifier: MPESA_INITIATOR_IDENTIFIER,
      input_SecurityCredential: MPESA_SECURITY_CREDENTIAL,
      input_CommandID: "BusinessPayment",
      input_Amount: request.amount.toFixed(2),
      input_CustomerMSISDN: request.customerMSISDN,
      input_TransactionReference: request.transactionReference,
      input_ThirdPartyConversationID: request.thirdPartyReference,
      input_Remarks: "KILIMO Wallet Withdrawal",
    };

    const response = await fetch(`${MPESA_BASE_URL}/ipg/v2/vodacomTZN/b2cPayment/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sessionId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.output_ResponseCode === "INS-0") {
      return {
        success: true,
        transactionID: data.output_TransactionID,
        conversationID: data.output_ConversationID,
        responseCode: data.output_ResponseCode,
        responseDescription: data.output_ResponseDesc,
      };
    } else {
      return {
        success: false,
        responseCode: data.output_ResponseCode,
        responseDescription: data.output_ResponseDesc,
        error: data.output_ResponseDesc,
      };
    }
  } catch (error: any) {
    console.error("M-Pesa B2C payment error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Query M-Pesa transaction status
 */
export interface MPesaQueryRequest {
  transactionID: string;
  thirdPartyReference: string;
}

export interface MPesaQueryResponse {
  success: boolean;
  responseCode?: string;
  responseDescription?: string;
  transactionStatus?: "Completed" | "Failed" | "Pending";
  error?: string;
}

export async function queryMPesaTransaction(
  request: MPesaQueryRequest
): Promise<MPesaQueryResponse> {
  try {
    const sessionId = await getMPesaAccessToken();
    
    const payload = {
      input_QueryReference: request.transactionID,
      input_ServiceProviderCode: MPESA_SERVICE_PROVIDER_CODE,
      input_ThirdPartyConversationID: request.thirdPartyReference,
    };

    const response = await fetch(`${MPESA_BASE_URL}/ipg/v2/vodacomTZN/queryTransactionStatus/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sessionId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.output_ResponseCode === "INS-0") {
      return {
        success: true,
        responseCode: data.output_ResponseCode,
        responseDescription: data.output_ResponseDesc,
        transactionStatus: data.output_TransactionStatus,
      };
    } else {
      return {
        success: false,
        responseCode: data.output_ResponseCode,
        responseDescription: data.output_ResponseDesc,
        error: data.output_ResponseDesc,
      };
    }
  } catch (error: any) {
    console.error("M-Pesa query error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Process M-Pesa webhook/callback
 */
export interface MPesaWebhookEvent {
  input_TransactionID: string;
  input_ConversationID: string;
  input_ThirdPartyConversationID: string;
  input_ServiceProviderCode: string;
  input_ResultCode: string;
  input_ResultDesc: string;
  input_TransactionStatus: "Completed" | "Failed";
}

export async function processMPesaWebhook(
  event: MPesaWebhookEvent
): Promise<{ success: boolean; message: string }> {
  try {
    console.log(`Processing M-Pesa webhook for transaction: ${event.input_TransactionID}`);
    
    if (event.input_TransactionStatus === "Completed" && event.input_ResultCode === "0") {
      return {
        success: true,
        message: `Transaction ${event.input_TransactionID} completed successfully`,
      };
    } else {
      return {
        success: false,
        message: `Transaction ${event.input_TransactionID} failed: ${event.input_ResultDesc}`,
      };
    }
  } catch (error: any) {
    console.error("Error processing M-Pesa webhook:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Format Tanzanian phone number for M-Pesa
 * Converts formats like 0700123456 or +255700123456 to 255700123456
 */
export function formatMPesaPhoneNumber(phone: string): string {
  // Remove spaces, dashes, and parentheses
  let formatted = phone.replace(/[\s\-\(\)]/g, "");
  
  // Remove + prefix if exists
  if (formatted.startsWith("+")) {
    formatted = formatted.substring(1);
  }
  
  // Convert 0XXXXXXXXX to 255XXXXXXXXX
  if (formatted.startsWith("0") && formatted.length === 10) {
    formatted = "255" + formatted.substring(1);
  }
  
  // Ensure it starts with 255
  if (!formatted.startsWith("255")) {
    throw new Error("Invalid Tanzanian phone number");
  }
  
  return formatted;
}
