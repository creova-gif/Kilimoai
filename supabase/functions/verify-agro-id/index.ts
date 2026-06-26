// KILIMO AI — public Agro-ID verification endpoint.
//
// Backs the QR code on the Agro-ID passport. A bank / buyer / cooperative
// scans the QR (https://<project>.functions.supabase.co/verify-agro-id?id=...)
// and gets back a NON-PII attestation: that the ID exists, how long the
// verified financial history spans, entry count, and net position band — never
// raw transactions or personal data.
//
// This endpoint is intentionally public (no JWT) so third parties can verify
// without an account, but it reads through the service role and returns only
// aggregate, non-identifying figures.
//
// Required secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (auto-injected).

// @ts-nocheck — Deno runtime.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const admin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function netBand(net: number): string {
  if (net >= 2_000_000) return 'strong';
  if (net >= 500_000) return 'healthy';
  if (net >= 0) return 'positive';
  return 'building';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const url = new URL(req.url);
  const agroId = url.searchParams.get('id');
  if (!agroId) return json({ verified: false, reason: 'missing id' }, 400);

  try {
    // Map the public Agro-ID to a user, then read the aggregate summary.
    const { data: profile } = await admin
      .from('agro_profiles')
      .select('user_id, region, name')
      .eq('agro_id', agroId)
      .maybeSingle();

    if (!profile) return json({ verified: false, reason: 'not_found' }, 404);

    const { data: summary } = await admin
      .from('agro_ledger_summary')
      .select('*')
      .eq('user_id', profile.user_id)
      .maybeSingle();

    return json({
      verified: true,
      agroId,
      region: profile.region ?? null,
      // First-name-only to limit PII exposure on a public endpoint.
      holder: (profile.name ?? '').split(' ')[0] ?? null,
      history: summary
        ? {
            entryCount: summary.entry_count,
            firstEntryAt: summary.first_entry_at,
            lastEntryAt: summary.last_entry_at,
            netBand: netBand(summary.net_tzs),
          }
        : null,
      checkedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[verify-agro-id]', err);
    return json({ verified: false, reason: 'internal_error' }, 500);
  }
});
