/**
 * SUPABASE CLIENT SINGLETON
 * 
 * Creates a single shared instance of Supabase client
 * to avoid multiple GoTrueClient warnings
 */

import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create singleton instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

/**
 * Get or create the Supabase client instance
 * This ensures only ONE client exists in the browser context
 */
export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage,
        }
      }
    );
  }
  return supabaseInstance;
}

// Export singleton instance
export const supabase = getSupabaseClient();
