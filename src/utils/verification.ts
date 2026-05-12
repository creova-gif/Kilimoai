/**
 * KILIMO VERIFICATION UTILITIES - FRONTEND
 * Handle OTP verification flows
 * NO UI CHANGES - Integration utilities only
 */

import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

export interface VerificationStatus {
  verified: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  verifiedAt?: string;
  phone?: string;
  email?: string;
}

export interface OTPResponse {
  success: boolean;
  message?: string;
  expiresIn?: number;
  remainingAttempts?: number;
  retryAfter?: number;
  error?: string;
}

/**
 * Send verification OTP to phone or email
 */
export async function sendVerificationOTP(
  identifier: string,
  type: 'phone' | 'email'
): Promise<OTPResponse> {
  try {
    const response = await fetch(`${API_BASE}/send-verification-otp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, type }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to send OTP' };
    }

    return data;
  } catch (error) {
    console.error('Send OTP error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Verify OTP code
 */
export async function verifyOTP(
  identifier: string,
  otp: string
): Promise<OTPResponse> {
  try {
    const response = await fetch(`${API_BASE}/verify-otp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, otp }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Verification failed' };
    }

    return data;
  } catch (error) {
    console.error('Verify OTP error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Resend verification OTP (rate limited)
 */
export async function resendVerificationOTP(
  identifier: string,
  type: 'phone' | 'email'
): Promise<OTPResponse> {
  try {
    const response = await fetch(`${API_BASE}/resend-verification-otp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, type }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { 
        success: false, 
        error: data.error || 'Failed to resend OTP',
        retryAfter: data.retryAfter 
      };
    }

    return data;
  } catch (error) {
    console.error('Resend OTP error:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Check user verification status
 */
export async function checkVerificationStatus(
  userId: string
): Promise<VerificationStatus | null> {
  try {
    const response = await fetch(`${API_BASE}/verification-status/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Check verification error:', error);
    return null;
  }
}

/**
 * Check if verification is required before action
 * Returns true if user can proceed, false if verification needed
 */
export async function canPerformAction(
  userId: string,
  actionType: 'payment' | 'contract' | 'withdrawal' | 'marketplace'
): Promise<{ allowed: boolean; error?: string }> {
  const status = await checkVerificationStatus(userId);
  
  if (!status) {
    return { allowed: false, error: 'Unable to check verification status' };
  }
  
  if (!status.verified) {
    return { 
      allowed: false, 
      error: `Phone verification required for ${actionType} operations` 
    };
  }
  
  return { allowed: true };
}

/**
 * Format phone number for Tanzania (+255)
 */
export function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleaned.startsWith('0')) {
    cleaned = '+255' + cleaned.substring(1);
  } else if (cleaned.startsWith('255')) {
    cleaned = '+' + cleaned;
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+255' + cleaned;
  }
  
  return cleaned;
}
