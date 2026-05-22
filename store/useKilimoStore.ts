/**
 * Kilimo AI — Global State Store
 * Powered by Zustand with AsyncStorage persistence (MMKV-ready)
 *
 * This is the single source of truth for:
 * - Agro ID & user session
 * - Offline mode & sync queue
 * - Farm vitals (sensor data)
 * - Notifications badge count
 * - Active wallet balance
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AgroID {
  id: string;
  name: string;
  role: string;
  location: string;
  tier: 'Free' | 'Premium' | 'Cooperative';
  joinDate: string;
  avatarUrl?: string;
  mpesaLinked: boolean;
  phoneNumber?: string;
  biometricEnabled: boolean;
  coopId?: string;
}

export interface SyncQueueItem {
  id: string;
  type: 'scan_result' | 'task_complete' | 'market_order' | 'irrigation_log' | 'voice_note';
  payload: Record<string, unknown>;
  createdAt: string;
  retries: number;
}

export interface FarmVitals {
  soilHealth: number;       // 0–100
  moisture: number;         // 0–100
  temperature: number;      // °C
  yieldEstimate: number;    // tonnes
  lastUpdated: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  read: boolean;
  timestamp: string;
}

export interface WalletState {
  balanceTZS: number;
  mpesaPhone?: string;
  lastTransaction?: string;
  currency: 'TZS' | 'KES' | 'UGX';
}

// ─── Store State ─────────────────────────────────────────────────────────────

interface KilimoState {
  // Auth / Identity
  agroId: AgroID | null;
  isAuthenticated: boolean;
  
  // Network / Offline
  isOffline: boolean;
  syncQueue: SyncQueueItem[];
  lastSyncedAt: string | null;

  // Farm Intelligence
  farmVitals: FarmVitals;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;

  // Wallet / Finance
  wallet: WalletState;

  // ─── Actions ───────────────────────────────────────────────────

  // Auth
  setAgroId: (agroId: AgroID) => void;
  clearAgroId: () => void;

  // Network
  setOffline: (offline: boolean) => void;
  addToSyncQueue: (item: Omit<SyncQueueItem, 'id' | 'createdAt' | 'retries'>) => void;
  removeFromSyncQueue: (id: string) => void;
  clearSyncQueue: () => void;
  setLastSyncedAt: (timestamp: string) => void;

  // Farm Vitals
  updateFarmVitals: (vitals: Partial<FarmVitals>) => void;

  // Notifications
  addNotification: (notif: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  clearNotifications: () => void;

  // Wallet
  updateWallet: (wallet: Partial<WalletState>) => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useKilimoStore = create<KilimoState>()(
  persist(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────────────
      agroId: {
        id: 'KILIMO-8492-XJ',
        name: 'Justin Mafie',
        role: 'Mkulima Mkuu',
        location: 'Arusha, Tanzania',
        tier: 'Premium',
        joinDate: '2023',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
        mpesaLinked: true,
        biometricEnabled: true,
        coopId: 'AMCOS-KIL-001',
      },
      isAuthenticated: true,

      isOffline: false,
      syncQueue: [],
      lastSyncedAt: null,

      farmVitals: {
        soilHealth: 84,
        moisture: 42,
        temperature: 24,
        yieldEstimate: 1.2,
        lastUpdated: new Date().toISOString(),
      },

      notifications: [
        {
          id: 'n1',
          title: 'Unyevu wa Udongo Umeshuka',
          body: 'Block B: Moisture dropped to 38%. Irrigate before 18:00.',
          type: 'alert',
          read: false,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'n2',
          title: 'Bei ya Mahindi Imepanda',
          body: 'Maize price up 12% in Mbeya Market. Consider selling now.',
          type: 'info',
          read: false,
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'n3',
          title: 'Sankofa AI Imefanya Utambuzi',
          body: 'Crop scan completed. Maize Streak Virus detected in Plot 3.',
          type: 'warning',
          read: true,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      unreadCount: 2,

      wallet: {
        balanceTZS: 2450000,
        mpesaPhone: '+255 712 345 678',
        lastTransaction: 'Co-op Payment - KES 5,000',
        currency: 'TZS',
      },

      // ── Auth Actions ───────────────────────────────────────────
      setAgroId: (agroId) => set({ agroId, isAuthenticated: true }),
      clearAgroId: () => set({ agroId: null, isAuthenticated: false }),

      // ── Network Actions ────────────────────────────────────────
      setOffline: (offline) => set({ isOffline: offline }),

      addToSyncQueue: (item) =>
        set((state) => ({
          syncQueue: [
            ...state.syncQueue,
            {
              ...item,
              id: `sync_${Date.now()}_${Math.random().toString(36).slice(2)}`,
              createdAt: new Date().toISOString(),
              retries: 0,
            },
          ],
        })),

      removeFromSyncQueue: (id) =>
        set((state) => ({
          syncQueue: state.syncQueue.filter((item) => item.id !== id),
        })),

      clearSyncQueue: () => set({ syncQueue: [] }),
      setLastSyncedAt: (timestamp) => set({ lastSyncedAt: timestamp }),

      // ── Farm Vitals Actions ────────────────────────────────────
      updateFarmVitals: (vitals) =>
        set((state) => ({
          farmVitals: {
            ...state.farmVitals,
            ...vitals,
            lastUpdated: new Date().toISOString(),
          },
        })),

      // ── Notification Actions ───────────────────────────────────
      addNotification: (notif) =>
        set((state) => ({
          notifications: [
            {
              ...notif,
              id: `notif_${Date.now()}`,
              read: false,
              timestamp: new Date().toISOString(),
            },
            ...state.notifications,
          ],
          unreadCount: state.unreadCount + 1,
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      clearNotifications: () =>
        set({ notifications: [], unreadCount: 0 }),

      // ── Wallet Actions ─────────────────────────────────────────
      updateWallet: (wallet) =>
        set((state) => ({
          wallet: { ...state.wallet, ...wallet },
        })),
    }),
    {
      name: 'kilimo-ai-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist non-sensitive, offline-resilient data
      partialize: (state) => ({
        agroId: state.agroId,
        isAuthenticated: state.isAuthenticated,
        syncQueue: state.syncQueue,
        lastSyncedAt: state.lastSyncedAt,
        farmVitals: state.farmVitals,
        wallet: { ...state.wallet, mpesaPhone: undefined }, // Never persist phone
        notifications: state.notifications.slice(0, 50), // Cap at 50
        unreadCount: state.unreadCount,
      }),
    }
  )
);
