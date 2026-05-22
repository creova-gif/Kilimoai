/**
 * Kilimo AI — SMS Adapter (Phase 1 stub)
 *
 * Sends SMS via a pluggable provider. In Phase 1 this is a no-op that logs to
 * console and pushes an in-app notification so the user can see what would have
 * been sent. Wire Africa's Talking or Selcom in Phase 2 by:
 *
 *   1. Add AFRICAS_TALKING_API_KEY + AFRICAS_TALKING_USERNAME secrets
 *   2. Replace the body of `sendSms` with a fetch to the provider
 *
 * The Notification Delivery Matrix (PRD 2.2) routes through here for all
 * SMS-backed events: critical diagnosis, price alerts, severe weather.
 */

import { useKilimoStore } from '../../store/useKilimoStore';

export type SmsEvent =
  | 'critical_diagnosis'
  | 'price_alert'
  | 'severe_weather'
  | 'payment_received';

export interface SmsPayload {
  to: string;          // E.164, e.g. "+255712345678"
  body: string;        // Plain text, < 160 chars ideally
  event: SmsEvent;
  meta?: Record<string, unknown>;
}

const PROVIDER_CONFIGURED = false; // Flip true once Phase 2 secrets land

export async function sendSms(payload: SmsPayload): Promise<{ ok: boolean; reason?: string }> {
  if (!PROVIDER_CONFIGURED) {
    console.log('[SMS:stub]', payload.event, '→', payload.to, '·', payload.body);

    // Mirror to in-app notification so the user sees the channel firing
    useKilimoStore.getState().addNotification({
      title: `[SMS Stub] ${labelForEvent(payload.event)}`,
      body: `Would send to ${maskNumber(payload.to)}: ${payload.body}`,
      type: 'info',
    });

    return { ok: false, reason: 'sms_provider_not_configured' };
  }

  // Phase 2: real provider call goes here.
  return { ok: false, reason: 'not_implemented' };
}

function labelForEvent(e: SmsEvent): string {
  switch (e) {
    case 'critical_diagnosis': return 'Critical Diagnosis';
    case 'price_alert': return 'Price Alert';
    case 'severe_weather': return 'Severe Weather';
    case 'payment_received': return 'Payment Received';
  }
}

function maskNumber(n: string): string {
  if (n.length < 6) return n;
  return n.slice(0, 4) + '••••' + n.slice(-3);
}
