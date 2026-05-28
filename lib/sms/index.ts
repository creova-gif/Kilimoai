/**
 * Kilimo AI — SMS Adapter (Africa's Talking)
 *
 * Sends SMS via Africa's Talking REST API.
 * Requires three EXPO_PUBLIC_* secrets:
 *   EXPO_PUBLIC_AT_USERNAME   — AT username (use "sandbox" for testing)
 *   EXPO_PUBLIC_AT_API_KEY    — AT API key
 *   EXPO_PUBLIC_AT_SENDER_ID  — Registered shortcode / alphanumeric sender ID (optional)
 *
 * Falls back to in-app notification mirror when credentials are absent so the
 * channel is always visible during development.
 *
 * Notification Delivery Matrix (PRD 2.2) routes through here for all
 * SMS-backed events: critical diagnosis, price alerts, severe weather, payments.
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

const AT_USERNAME  = process.env.EXPO_PUBLIC_AT_USERNAME  ?? '';
const AT_API_KEY   = process.env.EXPO_PUBLIC_AT_API_KEY   ?? '';
const AT_SENDER_ID = process.env.EXPO_PUBLIC_AT_SENDER_ID ?? '';
const AT_ENDPOINT  = 'https://api.africastalking.com/version1/messaging';

function atConfigured(): boolean {
  return AT_USERNAME.length > 0 && AT_API_KEY.length > 0;
}

export async function sendSms(payload: SmsPayload): Promise<{ ok: boolean; reason?: string }> {
  if (!atConfigured()) {
    console.log('[SMS:stub]', payload.event, '→', payload.to, '·', payload.body);

    useKilimoStore.getState().addNotification({
      title: labelForEvent(payload.event),
      body: `${maskNumber(payload.to)}: ${payload.body}`,
      type: 'info',
    });

    return { ok: false, reason: 'sms_provider_not_configured' };
  }

  try {
    const formBody = new URLSearchParams({
      username: AT_USERNAME,
      to: payload.to,
      message: payload.body,
      ...(AT_SENDER_ID ? { from: AT_SENDER_ID } : {}),
    });

    const res = await fetch(AT_ENDPOINT, {
      method: 'POST',
      headers: {
        apiKey: AT_API_KEY,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[SMS:AT] HTTP error', res.status, text);
      return { ok: false, reason: `at_http_${res.status}` };
    }

    const json = await res.json();
    const recipient = json?.SMSMessageData?.Recipients?.[0];

    if (recipient?.statusCode === 101) {
      useKilimoStore.getState().addNotification({
        title: labelForEvent(payload.event),
        body: `SMS imetumwa kwa ${maskNumber(payload.to)}`,
        type: 'success',
      });
      return { ok: true };
    }

    const errMsg = recipient?.status ?? 'unknown_at_status';
    console.error('[SMS:AT] Delivery failure:', errMsg);
    return { ok: false, reason: errMsg };
  } catch (err: any) {
    console.error('[SMS:AT] Network error:', err?.message);
    return { ok: false, reason: 'network_error' };
  }
}

function labelForEvent(e: SmsEvent): string {
  switch (e) {
    case 'critical_diagnosis': return 'Utambuzi wa Haraka';
    case 'price_alert':        return 'Tahadhari ya Bei';
    case 'severe_weather':     return 'Tahadhari ya Hali ya Hewa';
    case 'payment_received':   return 'Malipo Yamepokelewa';
  }
}

function maskNumber(n: string): string {
  if (n.length < 6) return n;
  return n.slice(0, 4) + '••••' + n.slice(-3);
}
