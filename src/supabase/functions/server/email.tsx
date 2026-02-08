/**
 * EMAIL SENDING UTILITY FOR KILIMO
 * Uses Supabase built-in SMTP or external email service
 */

// For now, we'll use a simple approach - you can integrate with:
// - Resend (recommended for Africa)
// - SendGrid
// - AWS SES
// - Mailgun

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "KILIMO <noreply@kilimo.app>";

// Validate configuration
function validateEmailConfig() {
  const issues: string[] = [];
  
  if (!RESEND_API_KEY || RESEND_API_KEY === "") {
    issues.push("RESEND_API_KEY is not set");
  }
  
  if (issues.length > 0) {
    console.error("❌ Email Configuration Error:");
    issues.forEach(issue => console.error(`  - ${issue}`));
    console.error("\n💡 Set these environment variables in Supabase Dashboard:");
    console.error("   Settings > Edge Functions > Add Secrets");
    console.error("   Get your API key from https://resend.com/api-keys");
    return false;
  }
  
  console.log("✅ Email Configuration validated");
  console.log(`   From: ${FROM_EMAIL}`);
  return true;
}

const EMAIL_CONFIGURED = validateEmailConfig();

export interface EmailRequest {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email via Resend API
 */
export async function sendEmail(request: EmailRequest): Promise<any> {
  if (!EMAIL_CONFIGURED) {
    console.warn("⚠️ Email not configured. Email content:", request);
    return { id: "mock-email-id", message: "Email not sent - configuration missing" };
  }

  const recipients = Array.isArray(request.to) ? request.to : [request.to];

  try {
    const payload = {
      from: FROM_EMAIL,
      to: recipients,
      subject: request.subject,
      html: request.html,
      text: request.text || request.html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    };

    console.log(`📧 Sending email to: ${recipients.join(", ")}`);
    console.log(`   From: ${FROM_EMAIL}`);
    console.log(`   Subject: ${request.subject}`);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(`❌ Email API Error (${response.status}):`, responseText);
      
      // Parse error for helpful message
      let errorDetail = responseText;
      try {
        const errorJson = JSON.parse(responseText);
        errorDetail = errorJson.message || errorJson.error || responseText;
      } catch (e) {
        // Keep original text if not JSON
      }
      
      throw new Error(`Email API error: ${response.status} - ${errorDetail}`);
    }

    const data = JSON.parse(responseText);
    console.log(`✅ Email sent successfully to ${recipients.join(", ")}`);
    console.log(`   Email ID: ${data.id}`);
    return data;
  } catch (error) {
    console.error("❌ Email send error:", error);
    console.error("   Error details:", {
      message: error.message,
      to: recipients,
      from: FROM_EMAIL,
    });
    throw error;
  }
}

/**
 * Send OTP email
 */
export async function sendOTPEmail(
  email: string,
  otp: string,
  language: "en" | "sw" = "en",
  expiryMinutes: number = 5
): Promise<any> {
  const subject = language === "sw" 
    ? "Msimbo wako wa KILIMO"
    : "Your KILIMO Verification Code";

  const html = language === "sw" ? `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">KILIMO</h1>
          <p style="color: #E8F5E9; margin: 5px 0 0 0;">Kilimo cha Kisasa</p>
        </div>
        
        <div style="background: white; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none;">
          <h2 style="color: #2E7D32; margin-top: 0;">Msimbo Wako wa Kuthibitisha</h2>
          
          <p style="font-size: 16px; color: #555;">Karibu KILIMO! Tumia msimbo huu kukamilisha kuingia kwako:</p>
          
          <div style="background: #F5F5F5; border: 2px dashed #2E7D32; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <div style="font-size: 36px; font-weight: bold; color: #2E7D32; letter-spacing: 8px; font-family: monospace;">
              ${otp}
            </div>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            <strong>Muhimu:</strong>
          </p>
          <ul style="font-size: 14px; color: #666; padding-left: 20px;">
            <li>Msimbo huu utaisha baada ya dakika ${expiryMinutes}</li>
            <li>Usimshirikishe mtu yeyote msimbo huu</li>
            <li>Kama hukuomba msimbo huu, puuza barua pepe hii</li>
          </ul>
        </div>
        
        <div style="background: #F5F5F5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666;">
          <p style="margin: 5px 0;">© 2026 KILIMO Agri-AI Suite</p>
          <p style="margin: 5px 0;">Tunawezesha wakulima wadogo Tanzania</p>
        </div>
      </body>
    </html>
  ` : `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">KILIMO</h1>
          <p style="color: #E8F5E9; margin: 5px 0 0 0;">Smart Farming, Simple Payments</p>
        </div>
        
        <div style="background: white; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none;">
          <h2 style="color: #2E7D32; margin-top: 0;">Your Verification Code</h2>
          
          <p style="font-size: 16px; color: #555;">Welcome to KILIMO! Use this code to complete your sign in:</p>
          
          <div style="background: #F5F5F5; border: 2px dashed #2E7D32; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <div style="font-size: 36px; font-weight: bold; color: #2E7D32; letter-spacing: 8px; font-family: monospace;">
              ${otp}
            </div>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            <strong>Important:</strong>
          </p>
          <ul style="font-size: 14px; color: #666; padding-left: 20px;">
            <li>This code expires in ${expiryMinutes} minutes</li>
            <li>Never share this code with anyone</li>
            <li>If you didn't request this code, please ignore this email</li>
          </ul>
        </div>
        
        <div style="background: #F5F5F5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666;">
          <p style="margin: 5px 0;">© 2026 KILIMO Agri-AI Suite</p>
          <p style="margin: 5px 0;">Empowering Smallholder Farmers in Tanzania</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  email: string,
  name: string,
  language: "en" | "sw" = "en"
): Promise<any> {
  const subject = language === "sw" 
    ? `Karibu KILIMO, ${name}!`
    : `Welcome to KILIMO, ${name}!`;

  const html = language === "sw" ? `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🌱 Karibu KILIMO!</h1>
        </div>
        
        <div style="background: white; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none;">
          <h2 style="color: #2E7D32; margin-top: 0;">Habari ${name},</h2>
          
          <p style="font-size: 16px; color: #555;">Tunafurahi kukukaribisha kwenye KILIMO - mfumo wako wa kisasa wa ushauri wa kilimo na malipo!</p>
          
          <p style="font-size: 16px; color: #555;">Unaweza sasa:</p>
          <ul style="font-size: 15px; color: #555; line-height: 1.8;">
            <li>📱 Pata ushauri wa kilimo kutoka kwa Sankofa AI</li>
            <li>💰 Angalia bei za soko za mazao</li>
            <li>🌦️ Pokea arifa za hali ya hewa</li>
            <li>🛒 Nunua pembejeo za kilimo</li>
            <li>📊 Simamia shamba lako</li>
          </ul>
          
          <p style="font-size: 16px; color: #555;">Tupo hapa kukusaidia! Kama una maswali, wasiliana nasi wakati wowote.</p>
        </div>
        
        <div style="background: #F5F5F5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666;">
          <p style="margin: 5px 0;">© 2026 KILIMO Agri-AI Suite</p>
        </div>
      </body>
    </html>
  ` : `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🌱 Welcome to KILIMO!</h1>
        </div>
        
        <div style="background: white; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none;">
          <h2 style="color: #2E7D32; margin-top: 0;">Hi ${name},</h2>
          
          <p style="font-size: 16px; color: #555;">We're excited to welcome you to KILIMO - your modern agricultural advisory and payments platform!</p>
          
          <p style="font-size: 16px; color: #555;">You can now:</p>
          <ul style="font-size: 15px; color: #555; line-height: 1.8;">
            <li>📱 Get farming advice from Sankofa AI</li>
            <li>💰 Check real-time market prices</li>
            <li>🌦️ Receive weather alerts</li>
            <li>🛒 Buy agricultural inputs</li>
            <li>📊 Manage your farm</li>
          </ul>
          
          <p style="font-size: 16px; color: #555;">We're here to help! If you have any questions, reach out anytime.</p>
        </div>
        
        <div style="background: #F5F5F5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666;">
          <p style="margin: 5px 0;">© 2026 KILIMO Agri-AI Suite</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

export default { sendEmail, sendOTPEmail, sendWelcomeEmail };