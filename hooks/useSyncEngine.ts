/**
 * Kilimo AI — Offline Sync Engine
 *
 * A background service that monitors network connectivity and drains
 * the offline sync queue when connection is restored.
 *
 * Usage:
 *   const { isOnline, pendingCount, forcSync } = useSyncEngine();
 */

import { useEffect, useRef, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useKilimoStore } from '../store/useKilimoStore';

// ─── Mock API endpoint (replace with Supabase edge function URL) ───────────
const SYNC_ENDPOINT = 'https://api.kilimo.ai/v1/sync';

async function pushItem(item: ReturnType<typeof useKilimoStore.getState>['syncQueue'][0]): Promise<boolean> {
  try {
    // In production: replace with actual Supabase or REST call
    // const response = await supabase.from(item.type).upsert(item.payload);
    // For now, simulate a 90% success rate
    await new Promise((res) => setTimeout(res, 300 + Math.random() * 400));
    return Math.random() > 0.1;
  } catch {
    return false;
  }
}

export function useSyncEngine() {
  const {
    isOffline,
    syncQueue,
    setOffline,
    removeFromSyncQueue,
    setLastSyncedAt,
    addNotification,
  } = useKilimoStore();

  const isSyncing = useRef(false);

  // ── Drain the sync queue ────────────────────────────────────────────────
  const drainQueue = useCallback(async () => {
    if (isSyncing.current || syncQueue.length === 0) return;
    isSyncing.current = true;

    let successCount = 0;
    for (const item of [...syncQueue]) {
      const ok = await pushItem(item);
      if (ok) {
        removeFromSyncQueue(item.id);
        successCount++;
      }
    }

    isSyncing.current = false;
    if (successCount > 0) {
      setLastSyncedAt(new Date().toISOString());
      addNotification({
        title: `Sync Imekamilika ✓`,
        body: `${successCount} record(s) synced to your Agro ID cloud.`,
        type: 'success',
      });
    }
  }, [syncQueue, removeFromSyncQueue, setLastSyncedAt, addNotification]);

  // ── Subscribe to network changes ────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const online = state.isConnected === true && state.isInternetReachable !== false;
      setOffline(!online);

      if (online && syncQueue.length > 0) {
        // Small delay to let network stabilize
        setTimeout(() => drainQueue(), 1500);
      }
    });

    return () => unsubscribe();
  }, [setOffline, drainQueue, syncQueue.length]);

  // ── Initial check ───────────────────────────────────────────────────────
  useEffect(() => {
    NetInfo.fetch().then((state: NetInfoState) => {
      const online = state.isConnected === true && state.isInternetReachable !== false;
      setOffline(!online);
    });
  }, [setOffline]);

  return {
    isOnline: !isOffline,
    pendingCount: syncQueue.length,
    forceSync: drainQueue,
  };
}
