/**
 * VERIFICATION MIDDLEWARE FOR KILIMO
 * Enforces phone/email verification for critical operations
 * NO UI CHANGES - Backend security only
 */

import { Context } from "npm:hono@4.6.14";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

export interface VerificationStatus {
  verified: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  userId: string;
  error?: string;
}

/**
 * Check if user is verified
 * Returns verification status without throwing
 */
export async function checkVerification(userId: string): Promise<VerificationStatus> {
  try {
    const userData = await kv.get(`user:${userId}`);
    
    if (!userData) {
      return {
        verified: false,
        phoneVerified: false,
        emailVerified: false,
        userId,
        error: "User not found",
      };
    }
    
    // Check Supabase Auth verification
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    
    const phoneVerified = authUser?.user?.phone_confirmed_at ? true : false;
    const emailVerified = authUser?.user?.email_confirmed_at ? true : false;
    
    return {
      verified: userData.verified || phoneVerified || emailVerified,
      phoneVerified,
      emailVerified,
      userId,
    };
  } catch (error) {
    console.error(`Verification check error for ${userId}: ${error}`);
    return {
      verified: false,
      phoneVerified: false,
      emailVerified: false,
      userId,
      error: String(error),
    };
  }
}

/**
 * Require verification middleware
 * Blocks request if user is not verified
 */
export async function requireVerification(
  userId: string,
  operationType: "payment" | "contract" | "withdrawal" | "loan" | "marketplace"
): Promise<{ allowed: boolean; error?: string; status?: number }> {
  const verification = await checkVerification(userId);
  
  if (!verification.verified) {
    return {
      allowed: false,
      error: `Phone verification required for ${operationType}. Please verify your phone number to continue.`,
      status: 403,
    };
  }
  
  return { allowed: true };
}

/**
 * Verify phone number is required for payment operations
 */
export async function requirePhoneVerification(userId: string): Promise<{ allowed: boolean; error?: string; status?: number }> {
  const verification = await checkVerification(userId);
  
  if (!verification.phoneVerified) {
    return {
      allowed: false,
      error: "Phone verification required for this operation. Please verify your phone number.",
      status: 403,
    };
  }
  
  return { allowed: true };
}

/**
 * Check if phone number belongs to verified user
 * Used in payment/contract flows
 */
export async function isPhoneVerified(phone: string): Promise<boolean> {
  try {
    const userId = await kv.get(`phone:${phone}`);
    if (!userId) return false;
    
    const verification = await checkVerification(userId);
    return verification.phoneVerified;
  } catch {
    return false;
  }
}

/**
 * Get verification error response
 */
export function getVerificationError(operationType: string) {
  return {
    error: "Verification required",
    message: `You must verify your phone number before performing ${operationType} operations.`,
    code: "VERIFICATION_REQUIRED",
    action: "verify_phone",
  };
}
