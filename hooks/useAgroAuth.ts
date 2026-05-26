/**
 * Kilimo AI — Agro ID Auth Hook
 *
 * Handles:
 * - Supabase session check on app boot
 * - Biometric authentication (Face ID / fingerprint)
 * - Sign-in / sign-out flows
 * - Agro ID creation (first-time registration)
 * - State bridge to global Zustand store
 */

import { useEffect, useState, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useKilimoStore, AgroID } from '../store/useKilimoStore';

const SESSION_KEY = 'kilimo_session_token';

// ─── Supabase client (lazy import to avoid issues in non-native envs) ───────
let supabase: any = null;
try {
  const { createClient } = require('@supabase/supabase-js');
  supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );
} catch {
  console.warn('[AgroID] Supabase not configured — using local session only');
}

// ─── Auth Hook ───────────────────────────────────────────────────────────────

export function useAgroAuth() {
  const { agroId, isAuthenticated, setAgroId, clearAgroId } = useKilimoStore();
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // ── Check biometric capability ───────────────────────────────────────────
  useEffect(() => {
    LocalAuthentication.hasHardwareAsync().then((has) => {
      if (has) {
        LocalAuthentication.isEnrolledAsync().then((enrolled) => {
          setBiometricAvailable(enrolled);
        });
      }
    });
  }, []);

  // ── Restore session on boot ──────────────────────────────────────────────
  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await SecureStore.getItemAsync(SESSION_KEY);
        if (!token || isAuthenticated) return;

        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser(token);
          if (user) {
            // Fetch Agro ID profile from DB
            const { data: profile } = await supabase
              .from('agro_profiles')
              .select('*')
              .eq('user_id', user.id)
              .single();

            if (profile) {
              setAgroId(profile as AgroID);
            }
          }
        }
      } catch (err) {
        console.warn('[AgroID] Session restore failed:', err);
      }
    }

    restoreSession();
  }, []);

  // ── Biometric unlock ─────────────────────────────────────────────────────
  const authenticateWithBiometric = useCallback(async (): Promise<boolean> => {
    if (!biometricAvailable) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirm your Agro ID identity',
      fallbackLabel: 'Use PIN',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });

    return result.success;
  }, [biometricAvailable]);

  // ── Phone OTP sign-in ────────────────────────────────────────────────────
  const signInWithPhone = useCallback(async (phone: string) => {
    setLoading(true);
    try {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: { channel: 'sms' },
      });
      if (error) throw error;
      await SecureStore.setItemAsync('kilimo_phone', phone);
    } catch (err: any) {
      throw new Error(err.message ?? 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Email password sign-in ─────────────────────────────────────────
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    console.log('[AgroAuth] signInWithEmail starting for:', email);
    setLoading(true);
    try {
      if (!supabase) {
        console.warn('[AgroAuth] Supabase client is not initialized!');
        throw new Error('Supabase not configured');
      }
      console.log('[AgroAuth] Calling Supabase signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('[AgroAuth] Supabase signInWithPassword returned error:', error);
        throw error;
      }
      console.log('[AgroAuth] Supabase sign-in successful. User ID:', data.user?.id);
      
      // Persist session token securely
      await SecureStore.setItemAsync(SESSION_KEY, data.session?.access_token ?? '');

      console.log('[AgroAuth] Checking database for existing agro_profile...');
      // Check if profile exists, to hydrate if it's an existing user
      const { data: profile, error: profileError } = await supabase
        .from('agro_profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (profileError) {
        console.log('[AgroAuth] Profile query error (might be a new user):', profileError.message);
      }

      if (!profileError && profile) {
        console.log('[AgroAuth] Existing profile found. Hydrating user state:', profile.name);
        setAgroId(profile as AgroID);
        return { existingUser: true, user: data.user };
      }
      console.log('[AgroAuth] No existing profile found. Proceeding as new user.');
      return { existingUser: false, user: data.user };
    } catch (err: any) {
      console.error('[AgroAuth] signInWithEmail exception caught:', err);
      throw new Error(err.message ?? 'Failed to sign in with email');
    } finally {
      setLoading(false);
    }
  }, [setAgroId]);

  const verifyOtp = useCallback(async (phone: string, token: string) => {
    setLoading(true);
    try {
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });
      if (error) throw error;
      
      // Persist session token securely
      await SecureStore.setItemAsync(SESSION_KEY, data.session?.access_token ?? '');

      // We don't create the profile here anymore. Onboarding wizard will create it.
      // Just check if profile exists, to hydrate if it's an existing user.
      const { data: profile, error: profileError } = await supabase
        .from('agro_profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (!profileError && profile) {
        setAgroId(profile as AgroID);
        return { existingUser: true, user: data.user };
      }
      return { existingUser: false, user: data.user };
    } catch (err: any) {
      throw new Error(err.message ?? 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  }, [setAgroId]);

  // ── Sign out ─────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await SecureStore.deleteItemAsync(SESSION_KEY);
      if (supabase) await supabase.auth.signOut();
      clearAgroId();
    } catch (err) {
      console.warn('[AgroID] Sign out error:', err);
    } finally {
      setLoading(false);
    }
  }, [clearAgroId]);

  return {
    agroId,
    isAuthenticated,
    loading,
    biometricAvailable,
    signInWithPhone,
    signInWithEmail,
    verifyOtp,
    signOut,
    authenticateWithBiometric,
  };
}
