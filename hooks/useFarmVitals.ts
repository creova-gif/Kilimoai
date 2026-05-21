/**
 * Kilimo AI — Farm Vitals Hook
 *
 * Simulates real-time sensor telemetry with configurable polling intervals.
 * In production, replace the mock generator with Supabase Realtime subscriptions
 * or an IoT MQTT bridge.
 *
 * Features:
 * - Polling with jitter to avoid thundering herd
 * - Pauses polling when offline
 * - Caches last known values in the global store
 */

import { useEffect, useRef } from 'react';
import { useKilimoStore } from '../store/useKilimoStore';

const POLL_INTERVAL_MS = 30_000; // 30 seconds

function generateDelta(base: number, variance: number): number {
  return Math.round((base + (Math.random() * variance * 2 - variance)) * 10) / 10;
}

async function fetchSensorData() {
  // TODO: Replace with Supabase Realtime or IoT bridge
  // const { data } = await supabase.from('farm_sensors').select('*').eq('farm_id', agroId).single();
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
  return {
    soilHealth: generateDelta(84, 3),
    moisture: generateDelta(42, 8),
    temperature: generateDelta(24, 2),
    yieldEstimate: generateDelta(1.2, 0.1),
  };
}

export function useFarmVitals() {
  const { isOffline, farmVitals, updateFarmVitals, addNotification } = useKilimoStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollVitals = async () => {
    if (isOffline) return;
    try {
      const data = await fetchSensorData();
      const prevMoisture = farmVitals.moisture;
      updateFarmVitals(data);

      // Alert if moisture drops critically
      if (prevMoisture > 35 && data.moisture <= 35) {
        addNotification({
          title: '⚠️ Unyevu wa Udongo Umeshuka Sana',
          body: `Moisture dropped to ${data.moisture}%. Immediate irrigation required.`,
          type: 'alert',
        });
      }
    } catch (err) {
      console.warn('[FarmVitals] Polling failed:', err);
    }
  };

  useEffect(() => {
    // Initial fetch
    pollVitals();

    // Polling with jitter (±5s to avoid thundering herd)
    const jitter = Math.random() * 5000;
    timerRef.current = setInterval(pollVitals, POLL_INTERVAL_MS + jitter);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOffline]);

  return {
    vitals: farmVitals,
    refresh: pollVitals,
  };
}
