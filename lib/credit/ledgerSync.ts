/**
 * KILIMO AI — Agro-ID ledger server sync (offline-first).
 *
 * The ledger is the backbone of the credit passport, so it must live on the
 * server (not just device AsyncStorage) to be trustworthy and verifiable.
 * These helpers best-effort push/pull to Supabase; callers keep the local
 * Zustand store as the offline cache and call pushLedgerEntry() after a local
 * add. Failures are swallowed and surfaced via the return flag so the UI can
 * show a "pending sync" state rather than blocking the farmer.
 *
 * Requires the `agro_ledger` table + RLS (see
 * supabase/migrations/*_agro_ledger.sql).
 */

import { supabase } from '../supabase';
import type { LedgerEntry } from '../../store/useFarmDataStore';

export interface SyncResult {
  ok: boolean;
  reason?: string;
}

/** Push a single ledger entry to the server. Best-effort. */
export async function pushLedgerEntry(entry: LedgerEntry): Promise<SyncResult> {
  if (!supabase) return { ok: false, reason: 'no_backend' };
  try {
    const { data: sess } = await supabase.auth.getSession();
    const userId = sess?.session?.user?.id;
    if (!userId) return { ok: false, reason: 'not_authenticated' };

    const { error } = await supabase.from('agro_ledger').insert({
      client_id: entry.id,
      user_id: userId,
      entry_date: entry.date,
      category: entry.category,
      description: entry.description,
      amount_tzs: entry.amountTZS,
    });
    if (error) return { ok: false, reason: error.message };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, reason: e?.message ?? 'network_error' };
  }
}

/** Fetch the server-side ledger for the signed-in user (newest first). */
export async function fetchLedger(): Promise<LedgerEntry[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('agro_ledger')
      .select('client_id, entry_date, category, description, amount_tzs')
      .order('entry_date', { ascending: false });
    if (error || !data) return null;
    return data.map((r: any) => ({
      id: r.client_id,
      date: r.entry_date,
      category: r.category,
      description: r.description,
      amountTZS: r.amount_tzs,
    }));
  } catch {
    return null;
  }
}
