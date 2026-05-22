/**
 * Shared Supabase client singleton + auth helpers.
 *
 * Centralizes client construction so screens, hooks, and lib/ai.ts all share
 * one session state and don't duplicate the createClient boilerplate.
 */

import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'kilimo_session_token';

let _client: any = null;

export function getSupabase() {
  if (_client) return _client;
  try {
    const { createClient } = require('@supabase/supabase-js');
    _client = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    );
    return _client;
  } catch {
    return null;
  }
}

/**
 * Resolve the current user's access token. Tries the live Supabase session
 * first, falls back to the SecureStore-cached token from useAgroAuth.
 */
export async function getAccessToken(): Promise<string | null> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data } = await sb.auth.getSession();
      const tok = data?.session?.access_token;
      if (tok) return tok;
    } catch {
      // fall through to cached token
    }
  }
  try {
    return await SecureStore.getItemAsync(SESSION_KEY);
  } catch {
    return null;
  }
}
