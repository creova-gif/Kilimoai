/**
 * KILIMO AUTH - WORLD-CLASS ONBOARDING ENDPOINTS
 * Handles: OTP send, OTP verify, wallet init
 * Inspired by: M-Pesa, Twiga Foods, Plantix
 */

import { Hono } from "npm:hono@4.6.14";
import { sendSMS } from "./sms.tsx";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

export const authRoutes = new Hono();

// OTP storage
interface OTPRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  phone: string;
  userId: string;
}

// Generate secure 6-digit OTP
function generateOTP(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % 900000 + 100000).toString();
}

/**
 * POST /auth/send-otp
 * Send OTP to phone number
 */
authRoutes.post("/auth/send-otp", async (c) => {
  try {
    const { phone_number, language = 'sw' } = await c.req.json();

    // Validate phone number
    if (!phone_number || !phone_number.startsWith('+255')) {
      return c.json({
        status: 'error',
        message: language === 'sw' 
          ? 'Namba ya simu si sahihi. Lazima ianze na +255'
          : 'Invalid phone number. Must start with +255'
      }, 400);
    }

    // Check rate limit
    const rateLimitKey = `ratelimit:otp:${phone_number}`;
    const rateLimitData = await kv.get(rateLimitKey);
    
    if (rateLimitData) {
      const { count, firstAttempt } = rateLimitData;
      const now = Date.now();
      
      // Reset if outside 15-minute window
      if (now - firstAttempt > 15 * 60 * 1000) {
        await kv.set(rateLimitKey, { count: 1, firstAttempt: now });
      } else if (count >= 3) {
        return c.json({
          status: 'error',
          message: language === 'sw'
            ? 'Majaribio mengi mno. Subiri dakika 15.'
            : 'Too many attempts. Please wait 15 minutes.'
        }, 429);
      } else {
        await kv.set(rateLimitKey, { count: count + 1, firstAttempt });
      }
    } else {
      await kv.set(rateLimitKey, { count: 1, firstAttempt: Date.now() });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Check if user already exists
    const existingUserByPhone = await kv.get(`phone:${phone_number}`);
    const userId = existingUserByPhone 
      ? existingUserByPhone 
      : `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

    // Store OTP
    const otpRecord: OTPRecord = {
      code: otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0,
      phone: phone_number,
      userId,
    };
    
    await kv.set(`otp:${userId}`, otpRecord);

    // Send SMS
    const message = language === 'sw'
      ? `Msimbo wako wa KILIMO ni: ${otp}. Utaisha muda baada ya dakika 5.`
      : `Your KILIMO verification code is: ${otp}. Expires in 5 minutes.`;

    try {
      await sendSMS({ to: phone_number, message });
      console.log(`✓ OTP SMS sent to ${phone_number}`);
    } catch (smsError) {
      console.error('⚠️ SMS send error:', smsError);
      console.log(`📱 OTP for testing: ${otp} (user: ${userId})`);
      // Don't fail the request if SMS fails - user can retry
    }

    return c.json({
      status: 'success',
      user_id: userId,
      existing_user: !!existingUserByPhone,
      message: language === 'sw'
        ? 'Msimbo umetumwa kwa simu yako'
        : 'Code sent to your phone'
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return c.json({
      status: 'error',
      message: 'Failed to send OTP'
    }, 500);
  }
});

/**
 * POST /auth/verify-otp
 * Verify OTP and mark user as verified
 */
authRoutes.post("/auth/verify-otp", async (c) => {
  try {
    const { user_id, otp } = await c.req.json();

    if (!user_id || !otp) {
      return c.json({
        status: 'error',
        message: 'Missing user_id or otp'
      }, 400);
    }

    // Get OTP record
    const otpRecord = await kv.get(`otp:${user_id}`) as OTPRecord | null;

    if (!otpRecord) {
      return c.json({
        status: 'error',
        message: 'No OTP found. Please request a new code.'
      }, 404);
    }

    // Check expiry
    if (Date.now() > otpRecord.expiresAt) {
      await kv.del(`otp:${user_id}`);
      return c.json({
        status: 'error',
        message: 'OTP expired. Please request a new code.'
      }, 400);
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      await kv.del(`otp:${user_id}`);
      return c.json({
        status: 'error',
        message: 'Too many attempts. Please request a new code.'
      }, 400);
    }

    // Verify OTP
    if (otpRecord.code !== otp) {
      otpRecord.attempts++;
      await kv.set(`otp:${user_id}`, otpRecord);
      
      return c.json({
        status: 'error',
        message: 'Invalid code. Please try again.',
        attempts_remaining: 3 - otpRecord.attempts
      }, 400);
    }

    // Success! Create user record
    const userData = {
      id: user_id,
      phone: otpRecord.phone,
      verified: true,
      phoneVerified: true,
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await kv.set(`user:${user_id}`, userData);
    await kv.set(`phone:${otpRecord.phone}`, user_id); // Map phone to userId
    await kv.del(`otp:${user_id}`); // Delete used OTP

    return c.json({
      status: 'success',
      verified: true,
      user_id,
      message: 'Phone verified successfully'
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return c.json({
      status: 'error',
      message: 'Failed to verify OTP'
    }, 500);
  }
});

/**
 * PATCH /auth/profile
 * Update user profile after verification
 */
authRoutes.patch("/auth/profile/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const updates = await c.req.json();

    // Get existing user
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({
        status: 'error',
        message: 'User not found'
      }, 404);
    }

    // Update user data
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${userId}`, updatedUser);

    return c.json({
      status: 'success',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({
      status: 'error',
      message: 'Failed to update profile'
    }, 500);
  }
});

/**
 * POST /wallet/init
 * Initialize wallet for verified user
 */
authRoutes.post("/wallet/init", async (c) => {
  try {
    const { user_id, phone_number } = await c.req.json();

    if (!user_id || !phone_number) {
      return c.json({
        status: 'error',
        message: 'Missing user_id or phone_number'
      }, 400);
    }

    // Check if user is verified
    const user = await kv.get(`user:${user_id}`);
    
    if (!user || !user.verified) {
      return c.json({
        status: 'error',
        message: 'User must be verified before creating wallet'
      }, 403);
    }

    // Check if wallet already exists
    const existingWallet = await kv.get(`wallet:${user_id}`);
    
    if (existingWallet) {
      return c.json({
        status: 'success',
        wallet: existingWallet,
        message: 'Wallet already exists'
      });
    }

    // Create wallet
    const wallet = {
      userId: user_id,
      phone: phone_number,
      balance: 0,
      currency: 'TZS',
      status: 'active',
      createdAt: new Date().toISOString(),
      transactions: [],
    };

    await kv.set(`wallet:${user_id}`, wallet);

    // Also store by phone for quick lookup
    await kv.set(`wallet:phone:${phone_number}`, { userId: user_id });

    return c.json({
      status: 'success',
      wallet,
      message: 'Wallet created successfully'
    });

  } catch (error) {
    console.error('Wallet init error:', error);
    return c.json({
      status: 'error',
      message: 'Failed to create wallet'
    }, 500);
  }
});

export default authRoutes;