/**
 * KILIMO AUTH - WORLD-CLASS ONBOARDING ENDPOINTS
 * Handles: OTP send (phone/email), OTP verify, wallet init
 * Inspired by: M-Pesa, Twiga Foods, Plantix
 */

import { Hono } from "npm:hono@4.6.14";
import { sendSMS } from "./sms.tsx";
import { sendOTPEmail } from "./email.tsx";
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
  phone?: string;
  email?: string;
  userId: string;
  method: "phone" | "email";
}

// Generate secure 6-digit OTP
function generateOTP(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % 900000 + 100000).toString();
}

/**
 * POST /auth/send-otp-email
 * Send OTP to email address
 */
authRoutes.post("/auth/send-otp-email", async (c) => {
  try {
    const { email, language = 'en' } = await c.req.json();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return c.json({
        status: 'error',
        message: language === 'sw'
          ? 'Barua pepe si sahihi'
          : 'Invalid email address'
      }, 400);
    }

    // Check rate limit
    const rateLimitKey = `ratelimit:otp:${email}`;
    const rateLimitData = await kv.get(rateLimitKey);
    
    if (rateLimitData) {
      const { count, firstAttempt } = rateLimitData;
      const now = Date.now();
      
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
    const existingUserByEmail = await kv.get(`email:${email}`);
    const userId = existingUserByEmail 
      ? existingUserByEmail 
      : `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

    // Store OTP
    const otpRecord: OTPRecord = {
      code: otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0,
      email: email,
      userId,
      method: "email"
    };
    
    await kv.set(`otp:${userId}`, otpRecord);

    // Send Email
    try {
      await sendOTPEmail(email, otp, language);
      console.log(`✓ OTP email sent to ${email}`);
      console.log(`📧 OTP Code: ${otp} (user: ${userId})`); // Always log for debugging
    } catch (emailError) {
      console.error('⚠️ Email send error:', emailError);
      console.log(`📧 OTP for testing: ${otp} (user: ${userId})`);
      
      // Log detailed error for debugging
      console.error('Email Error Details:', {
        email,
        userId,
        errorMessage: emailError.message,
        timestamp: new Date().toISOString()
      });
    }

    return c.json({
      status: 'success',
      user_id: userId,
      existing_user: !!existingUserByEmail,
      message: language === 'sw'
        ? 'Msimbo umetumwa kwa barua pepe yako'
        : 'Code sent to your email',
      // DEV MODE: Send OTP in response for debugging (remove in production)
      debug_otp: otp
    });

  } catch (error) {
    console.error('Send email OTP error:', error);
    return c.json({
      status: 'error',
      message: 'Failed to send OTP'
    }, 500);
  }
});

/**
 * POST /auth/send-otp
 * Send OTP to phone number via SMS
 */
authRoutes.post("/auth/send-otp", async (c) => {
  try {
    const { phone_number, language = 'sw' } = await c.req.json();

    // Validate phone number (Tanzania format)
    const phoneRegex = /^\+255[67]\d{8}$/;
    if (!phone_number || !phoneRegex.test(phone_number)) {
      return c.json({
        status: 'error',
        message: language === 'sw'
          ? 'Namba ya simu si sahihi. Tumia +255XXXXXXXXX'
          : 'Invalid phone number. Use +255XXXXXXXXX'
      }, 400);
    }

    // Check rate limit
    const rateLimitKey = `ratelimit:otp:${phone_number}`;
    const rateLimitData = await kv.get(rateLimitKey);
    
    if (rateLimitData) {
      const { count, firstAttempt } = rateLimitData;
      const now = Date.now();
      
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
      method: "phone"
    };
    
    await kv.set(`otp:${userId}`, otpRecord);

    // Send SMS
    try {
      await sendSMS({
        to: phone_number,
        message: language === 'sw' 
          ? `KILIMO Uthibitishaji\n\nMsimbo wako: ${otp}\n\nHalali kwa dakika 5.\nUsimshirikishe mtu yeyote.`
          : `KILIMO Verification\n\nYour OTP: ${otp}\n\nValid for 5 minutes.\nDo not share this code.`
      });
      console.log(`✓ OTP SMS sent to ${phone_number}`);
      console.log(`📱 OTP Code: ${otp} (user: ${userId})`); // Always log for debugging
    } catch (smsError) {
      console.error('⚠️ SMS send error:', smsError);
      console.log(`📱 OTP for testing: ${otp} (user: ${userId})`);
      
      // Log detailed error for debugging
      console.error('SMS Error Details:', {
        phone: phone_number,
        userId,
        errorMessage: smsError.message,
        timestamp: new Date().toISOString()
      });
    }

    return c.json({
      status: 'success',
      user_id: userId,
      existing_user: !!existingUserByPhone,
      message: language === 'sw'
        ? 'Msimbo umetumwa kwa simu yako'
        : 'Code sent to your phone',
      // DEV MODE: Send OTP in response for debugging (remove in production)
      debug_otp: otp
    });

  } catch (error) {
    console.error('Send phone OTP error:', error);
    return c.json({
      status: 'error',
      message: 'Failed to send OTP'
    }, 500);
  }
});

/**
 * POST /auth/check-user
 * Check if phone number or email is already registered
 */
authRoutes.post("/auth/check-user", async (c) => {
  try {
    const { phone_number, email } = await c.req.json();

    if (!phone_number && !email) {
      return c.json({
        status: 'error',
        message: 'Phone number or email is required'
      }, 400);
    }

    // Check if phone or email exists in our system
    let existingUserId = null;
    if (phone_number) {
      existingUserId = await kv.get(`phone:${phone_number}`);
    } else if (email) {
      existingUserId = await kv.get(`email:${email}`);
    }

    return c.json({
      exists: !!existingUserId,
      user_id: existingUserId || null
    });

  } catch (error) {
    console.error('Check user error:', error);
    return c.json({
      status: 'error',
      message: 'Failed to check user'
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

    // Success! Create user record based on method
    const userData: any = {
      id: user_id,
      verified: true,
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Add phone or email based on verification method
    if (otpRecord.method === "phone" && otpRecord.phone) {
      userData.phone = otpRecord.phone;
      userData.phoneVerified = true;
      await kv.set(`phone:${otpRecord.phone}`, user_id); // Map phone to userId
    } else if (otpRecord.method === "email" && otpRecord.email) {
      userData.email = otpRecord.email;
      userData.emailVerified = true;
      await kv.set(`email:${otpRecord.email}`, user_id); // Map email to userId
    }

    await kv.set(`user:${user_id}`, userData);
    await kv.del(`otp:${user_id}`); // Delete used OTP

    const successMessage = otpRecord.method === "phone" 
      ? 'Phone verified successfully'
      : 'Email verified successfully';

    return c.json({
      status: 'success',
      verified: true,
      user_id,
      message: successMessage
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

/**
 * POST /users/create
 * Create or update user after onboarding completion
 */
authRoutes.post("/users/create", async (c) => {
  try {
    const userData = await c.req.json();
    const { id, phone, role, language } = userData;

    if (!id || !phone) {
      return c.json({
        status: 'error',
        message: 'Missing required fields: id, phone'
      }, 400);
    }

    // Check if user already exists
    const existingUser = await kv.get(`user:${id}`);
    
    if (existingUser) {
      // Update existing user
      const updatedUser = {
        ...existingUser,
        ...userData,
        updatedAt: new Date().toISOString(),
      };
      
      await kv.set(`user:${id}`, updatedUser);
      
      return c.json({
        status: 'success',
        user: updatedUser,
        message: 'User updated successfully'
      });
    }

    // Create new user
    const newUser = {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verified: false, // Will be set to true after OTP verification
    };

    await kv.set(`user:${id}`, newUser);
    await kv.set(`phone:${phone}`, id);

    // Also create in Supabase Auth if not exists (with placeholder email)
    try {
      const placeholderEmail = `${phone.replace(/\+/g, '')}@kilimo.app`;
      
      const { error: authError } = await supabase.auth.admin.createUser({
        phone: phone,
        email: placeholderEmail,
        email_confirm: true, // Auto-confirm placeholder
        user_metadata: {
          role,
          language,
          onboarding_completed: true,
        }
      });

      if (authError && authError.code !== 'phone_exists') {
        console.error('Supabase auth create error:', authError);
      }
    } catch (authCreateError) {
      console.error('Error creating Supabase auth user:', authCreateError);
      // Don't fail the whole request - user data is saved in KV
    }

    return c.json({
      status: 'success',
      user: newUser,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Create user error:', error);
    return c.json({
      status: 'error',
      message: 'Failed to create user'
    }, 500);
  }
});

/**
 * POST /auth/login-otp
 * Login with OTP for returning users
 */
authRoutes.post("/auth/login-otp", async (c) => {
  try {
    const { phone_number, otp_code } = await c.req.json();

    if (!phone_number || !otp_code) {
      return c.json({
        success: false,
        error: 'Missing phone_number or otp_code'
      }, 400);
    }

    // Get user ID from phone
    const userId = await kv.get(`phone:${phone_number}`);
    
    if (!userId) {
      return c.json({
        success: false,
        error: 'User not found'
      }, 404);
    }

    // Get OTP record
    const otpRecord = await kv.get(`otp:${userId}`) as OTPRecord | null;

    if (!otpRecord) {
      return c.json({
        success: false,
        error: 'No OTP found. Please request a new code.'
      }, 404);
    }

    // Check expiry
    if (Date.now() > otpRecord.expiresAt) {
      await kv.del(`otp:${userId}`);
      return c.json({
        success: false,
        error: 'OTP expired. Please request a new code.'
      }, 400);
    }

    // Verify OTP
    if (otpRecord.code !== otp_code) {
      return c.json({
        success: false,
        error: 'Invalid code'
      }, 400);
    }

    // Get user data
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({
        success: false,
        error: 'User not found'
      }, 404);
    }

    // Delete used OTP
    await kv.del(`otp:${userId}`);

    return c.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Login with OTP error:', error);
    return c.json({
      success: false,
      error: 'Failed to login with OTP'
    }, 500);
  }
});

/**
 * POST /auth/complete-profile
 * Complete user profile after phone verification (new users only)
 */
authRoutes.post("/auth/complete-profile", async (c) => {
  try {
    const { user_id, name, role, phone_number } = await c.req.json();

    if (!user_id || !name || !role || !phone_number) {
      return c.json({
        success: false,
        error: 'Missing required fields'
      }, 400);
    }

    // Get existing user
    const existingUser = await kv.get(`user:${user_id}`);
    
    if (!existingUser) {
      return c.json({
        success: false,
        error: 'User not found'
      }, 404);
    }

    // Update user with profile data
    const updatedUser = {
      ...existingUser,
      name,
      role,
      phone: phone_number,
      onboardingCompleted: false, // Will show contextual setup later
      tier: 'free',
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${user_id}`, updatedUser);

    // Ensure phone mapping exists
    await kv.set(`phone:${phone_number}`, user_id);

    return c.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error('Complete profile error:', error);
    return c.json({
      success: false,
      error: 'Failed to complete profile'
    }, 500);
  }
});

export default authRoutes;