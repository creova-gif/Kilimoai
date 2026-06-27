import NetInfo from '@react-native-community/netinfo';
import { useKilimoStore } from '../store/useKilimoStore';

export function initializeOfflineManager() {
  console.log('[OfflineManager] Initializing network listener...');

  const unsubscribe = NetInfo.addEventListener((state) => {
    const isOnline = !!state.isConnected && !!state.isInternetReachable;
    const store = useKilimoStore.getState();

    // Only trigger status change if different
    if (store.isOnline !== isOnline) {
      console.log(`[OfflineManager] Network status changed: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
      store.setOnlineStatus(isOnline);
      // We also update isOffline for backward compatibility with the existing property
      store.setOffline(!isOnline);

      // If we just came online, attempt to sync the queue
      if (isOnline && store.syncQueue.length > 0) {
        processSyncQueue();
      }
    }
  });

  return unsubscribe;
}

export async function processSyncQueue() {
  const store = useKilimoStore.getState();
  if (store.syncQueue.length === 0 || !store.isOnline) return;

  console.log(`[OfflineManager] Processing sync queue (${store.syncQueue.length} items)...`);

  for (const item of store.syncQueue) {
    try {
      console.log(`[OfflineManager] Syncing item: ${item.type} [${item.id}]`);

      // Simulate network request to backend
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Successfully synced! Remove from queue.
      store.dequeueAction(item.id);
      store.removeFromSyncQueue(item.id); // for safety
    } catch (err) {
      console.warn(`[OfflineManager] Failed to sync item ${item.id}`, err);
      // It will remain in the queue to be retried next time
    }
  }

  store.setLastSyncedAt(new Date().toISOString());
  console.log('[OfflineManager] Sync queue processing complete.');
}
