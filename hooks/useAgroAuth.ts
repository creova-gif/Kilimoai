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

  // ── Email / phone sign-in ────────────────────────────────────────────────
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      if (!supabase) throw new Error('Supabase not configured');

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Persist session token securely
      await SecureStore.setItemAsync(SESSION_KEY, data.session?.access_token ?? '');

      // Fetch Agro ID profile
      const { data: profile, error: profileError } = await supabase
        .from('agro_profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (profileError || !profile) {
        // First-time user — create a new Agro ID
        const newProfile: AgroID = {
          id: `KILIMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          name: data.user.user_metadata?.name ?? 'Mkulima',
          role: 'Mkulima',
          location: 'Tanzania',
          tier: 'Free',
          joinDate: new Date().getFullYear().toString(),
          mpesaLinked: false,
          biometricEnabled: false,
        };
        await supabase.from('agro_profiles').insert({ ...newProfile, user_id: data.user.id });
        setAgroId(newProfile);
      } else {
        setAgroId(profile as AgroID);
      }
    } catch (err: any) {
      throw new Error(err.message ?? 'Sign-in failed');
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
    signIn,
    signOut,
    authenticateWithBiometric,
  };
}
