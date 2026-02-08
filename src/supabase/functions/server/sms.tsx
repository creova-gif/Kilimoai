/**
 * SMS GATEWAY INTEGRATION FOR TANZANIA
 * Using Africa's Talking API - Popular in East Africa
 * Alternative providers: Twilio, Bongo Live, TTCL SMS
 */

const AFRICAS_TALKING_API_KEY = Deno.env.get("AFRICAS_TALKING_API_KEY") || "";
const AFRICAS_TALKING_USERNAME = Deno.env.get("AFRICAS_TALKING_USERNAME") || "sandbox";
const AFRICAS_TALKING_SENDER_ID = Deno.env.get("AFRICAS_TALKING_SENDER_ID") || "KILIMO";

// Base URLs
const AT_BASE_URL = "https://api.africastalking.com/version1";
const AT_SANDBOX_URL = "https://api.sandbox.africastalking.com/version1";

// Use sandbox unless in production
const BASE_URL = Deno.env.get("ENVIRONMENT") === "production" 
  ? AT_BASE_URL 
  : AT_SANDBOX_URL;

// Validate configuration on startup
function validateSMSConfig() {
  const issues: string[] = [];
  
  if (!AFRICAS_TALKING_API_KEY || AFRICAS_TALKING_API_KEY === "") {
    issues.push("AFRICAS_TALKING_API_KEY is not set");
  }
  
  if (!AFRICAS_TALKING_USERNAME || AFRICAS_TALKING_USERNAME === "") {
    issues.push("AFRICAS_TALKING_USERNAME is not set");
  }
  
  if (issues.length > 0) {
    console.error("❌ SMS Configuration Error:");
    issues.forEach(issue => console.error(`  - ${issue}`));
    console.error("\n💡 Set these environment variables in Supabase Dashboard:");
    console.error("   Settings > Edge Functions > Add Secrets");
    return false;
  }
  
  console.log("✅ SMS Configuration validated");
  console.log(`   Environment: ${Deno.env.get("ENVIRONMENT") || "sandbox"}`);
  console.log(`   Username: ${AFRICAS_TALKING_USERNAME}`);
  console.log(`   API URL: ${BASE_URL}`);
  console.log(`   API Key (first 6 chars): ${AFRICAS_TALKING_API_KEY.substring(0, 6)}...`);
  return true;
}

// Run validation
const SMS_CONFIGURED = validateSMSConfig();

export interface SMSRequest {
  to: string | string[]; // Phone number(s) in E.164 format: +255XXXXXXXXX
  message: string;
  from?: string; // Sender ID (alphanumeric, max 11 chars)
  enqueue?: boolean; // Queue messages for slow networks
}

export interface SMSResponse {
  SMSMessageData: {
    Message: string;
    Recipients: {
      statusCode: number;
      number: string;
      status: string;
      cost: string;
      messageId: string;
    }[];
  };
}

/**
 * Format phone number to E.164 format (+255XXXXXXXXX)
 */
function formatPhoneNumber(phone: string): string {
  // Remove spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");
  
  // If starts with 0, replace with +255
  if (cleaned.startsWith("0")) {
    cleaned = "+255" + cleaned.substring(1);
  }
  
  // If starts with 255, add +
  if (cleaned.startsWith("255") && !cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }
  
  // If doesn't start with +, assume it's a Tanzanian number
  if (!cleaned.startsWith("+")) {
    cleaned = "+255" + cleaned;
  }
  
  return cleaned;
}

/**
 * Send SMS via Africa's Talking
 */
export async function sendSMS(request: SMSRequest): Promise<SMSResponse> {
  if (!SMS_CONFIGURED) {
    console.warn("⚠️ SMS not configured. Message content:", request);
    throw new Error("SMS configuration is not valid. Cannot send SMS.");
  }

  // Format phone numbers
  const recipients = Array.isArray(request.to) 
    ? request.to.map(formatPhoneNumber).join(",")
    : formatPhoneNumber(request.to);

  // Prepare form data
  const formData = new URLSearchParams();
  formData.append("username", AFRICAS_TALKING_USERNAME);
  formData.append("to", recipients);
  formData.append("message", request.message);
  
  if (request.from) {
    formData.append("from", request.from);
  } else if (AFRICAS_TALKING_SENDER_ID) {
    formData.append("from", AFRICAS_TALKING_SENDER_ID);
  }
  
  if (request.enqueue) {
    formData.append("enqueue", "1");
  }

  console.log(`📱 Sending SMS to: ${recipients}`);
  console.log(`   From: ${request.from || AFRICAS_TALKING_SENDER_ID}`);
  console.log(`   Message preview: ${request.message.substring(0, 50)}...`);

  try {
    // Make API request
    const response = await fetch(`${BASE_URL}/messaging`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "apiKey": AFRICAS_TALKING_API_KEY,
      },
      body: formData.toString(),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error(`❌ SMS API Error (${response.status}):`, responseText);
      
      // Provide helpful error messages
      if (response.status === 401) {
        throw new Error(
          `SMS API Authentication Failed (401): Invalid API key or username. ` +
          `Please check AFRICAS_TALKING_API_KEY and AFRICAS_TALKING_USERNAME in Supabase secrets. ` +
          `Error details: ${responseText}`
        );
      }
      
      throw new Error(`SMS API error: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log(`✅ SMS sent successfully to ${recipients}`);
    console.log(`   Response:`, data);
    return data;
  } catch (error) {
    console.error("❌ SMS send error:", error);
    console.error("   Error details:", {
      message: error.message,
      to: recipients,
      from: request.from || AFRICAS_TALKING_SENDER_ID,
    });
    throw error;
  }
}

/**
 * Send payment request SMS
 */
export async function sendPaymentRequestSMS(
  recipientPhone: string,
  senderName: string,
  amount: number,
  paymentLink: string
): Promise<SMSResponse> {
  const message = `
CREOVA Payment Request

From: ${senderName}
Amount: TZS ${amount.toLocaleString()}

Pay now: ${paymentLink}

Thank you!
  `.trim();

  return sendSMS({
    to: recipientPhone,
    message,
    enqueue: true,
  });
}

/**
 * Send invoice SMS
 */
export async function sendInvoiceSMS(
  recipientPhone: string,
  invoiceNumber: string,
  sellerName: string,
  amount: number,
  downloadLink?: string
): Promise<SMSResponse> {
  const message = downloadLink
    ? `
CREOVA Invoice ${invoiceNumber}

From: ${sellerName}
Total: TZS ${amount.toLocaleString()}

Download: ${downloadLink}

Thank you for your business!
    `.trim()
    : `
CREOVA Invoice ${invoiceNumber}

From: ${sellerName}
Total: TZS ${amount.toLocaleString()}

Invoice has been generated and saved.
Thank you for your business!
    `.trim();

  return sendSMS({
    to: recipientPhone,
    message,
    enqueue: true,
  });
}

/**
 * Send transaction confirmation SMS
 */
export async function sendTransactionSMS(
  recipientPhone: string,
  type: "payment" | "withdrawal" | "deposit",
  amount: number,
  balance: number,
  reference: string
): Promise<SMSResponse> {
  const typeText = type === "payment" ? "Payment" : type === "withdrawal" ? "Withdrawal" : "Deposit";
  
  const message = `
CREOVA Wallet

${typeText} Confirmed
Amount: TZS ${amount.toLocaleString()}
Balance: TZS ${balance.toLocaleString()}
Ref: ${reference}

Thank you!
  `.trim();

  return sendSMS({
    to: recipientPhone,
    message,
    enqueue: true,
  });
}

/**
 * Send OTP for authentication
 */
export async function sendOTP(
  phone: string,
  otp: string,
  language: "en" | "sw" = "en",
  expiryMinutes: number = 5
): Promise<SMSResponse> {
  const message = language === "sw" ? `
KILIMO Uthibitishaji

Msimbo wako: ${otp}

Halali kwa dakika ${expiryMinutes}.
Usimshirikishe mtu yeyote.
  `.trim() : `
KILIMO Verification

Your OTP: ${otp}

Valid for ${expiryMinutes} minutes.
Do not share this code.
  `.trim();

  return sendSMS({
    to: phone,
    message,
  });
}

/**
 * Send loan repayment confirmation
 */
export async function sendLoanRepaymentSMS(
  recipientPhone: string,
  lenderName: string,
  amount: number,
  remainingBalance: number,
  reference: string
): Promise<SMSResponse> {
  const message = `
CREOVA Loan Payment

Paid: TZS ${amount.toLocaleString()}
To: ${lenderName}
Balance: TZS ${remainingBalance.toLocaleString()}
Ref: ${reference}

Thank you!
  `.trim();

  return sendSMS({
    to: recipientPhone,
    message,
    enqueue: true,
  });
}

/**
 * Send agricultural input order confirmation
 */
export async function sendInputOrderSMS(
  recipientPhone: string,
  orderNumber: string,
  totalAmount: number,
  itemCount: number
): Promise<SMSResponse> {
  const message = `
CREOVA Inputs Order

Order: ${orderNumber}
Items: ${itemCount}
Total: TZS ${totalAmount.toLocaleString()}

Your order is being processed.
Delivery within 3-5 days.

Thank you!
  `.trim();

  return sendSMS({
    to: recipientPhone,
    message,
    enqueue: true,
  });
}

/**
 * Send bulk SMS (for cooperatives/NGOs)
 */
export async function sendBulkSMS(
  recipients: string[],
  message: string
): Promise<SMSResponse> {
  return sendSMS({
    to: recipients,
    message,
    enqueue: true,
  });
}

/**
 * Get SMS delivery status
 */
export async function getSMSStatus(messageId: string): Promise<any> {
  const response = await fetch(
    `${BASE_URL}/messaging?username=${AFRICAS_TALKING_USERNAME}&messageId=${messageId}`,
    {
      headers: {
        "Accept": "application/json",
        "apiKey": AFRICAS_TALKING_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch SMS status: ${response.status}`);
  }

  return response.json();
}