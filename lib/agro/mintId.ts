/**
 * KILIMO AI — Agro-ID minting.
 *
 * The Agro-ID is embedded in a PUBLIC verification QR, so it must be
 * unpredictable (no enumeration) and must never encode identifying document
 * numbers. We prefer a SERVER-MINTED id (authoritative + uniqueness-enforced in
 * agro_profiles) and fall back to a locally-generated CSPRNG id when offline so
 * activation still works; the local id is reconciled by the server on next sync.
 *
 * Format: AGRO-2026-<docTag>-<16 CSPRNG chars>   (docTag ∈ NIDA|TIN|LIC|REG)
 */

import * as Crypto from 'expo-crypto';
import { supabase } from '../supabase';

export type DocTag = 'NIDA' | 'TIN' | 'LIC' | 'REG';

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/** 16 chars from a cryptographically-secure source (expo-crypto). */
function opaqueSegment(): string {
  const bytes = Crypto.getRandomBytes(16);
  let out = '';
  for (let i = 0; i < bytes.length; i++) out += ALPHA[bytes[i] % ALPHA.length];
  return out;
}

export function localAgroId(docTag: DocTag): string {
  return `AGRO-2026-${docTag}-${opaqueSegment()}`;
}

/**
 * Mint an Agro-ID. Asks the server to generate and persist the authoritative id
 * (idempotent — returns the existing one if already minted); falls back to a
 * local CSPRNG id when there's no backend or the call fails.
 */
export async function mintAgroId(docTag: DocTag): Promise<{ id: string; serverMinted: boolean }> {
  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('mint-agro-id', { body: { docTag } });
      if (!error && data?.agroId) return { id: data.agroId, serverMinted: true };
    } catch {
      /* fall through to local */
    }
  }
  return { id: localAgroId(docTag), serverMinted: false };
}
