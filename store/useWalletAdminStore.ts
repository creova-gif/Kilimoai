/**
 * Kilimo AI — Wallet Admin Store
 *
 * Enterprise/Co-op operator surface for:
 *  • Aggregated ledger of M-Pesa transactions across members
 *  • Payout queue with approve / reject / mark-settled lifecycle
 *  • Member account list (linked phone, balance, status)
 *
 * Real M-Pesa wiring lands in T205 (Daraja). Until then `triggerPayout()` only
 * mutates local state and pushes an in-app notification + SMS stub so admins
 * can rehearse the full workflow end-to-end with deterministic mock data.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendSms } from '../lib/sms';
import { useKilimoStore } from './useKilimoStore';
import { normalizeRole } from '../lib/access';

/** Returns true only if the current user has full wallet_admin access. */
function currentUserCanDecide(): boolean {
  const role = useKilimoStore.getState().agroId?.role;
  const canon = normalizeRole(role);
  return canon === 'commercial_admin' || canon === 'coop_leader';
}

export type TxnType = 'deposit' | 'payout' | 'fee' | 'transfer';
export type TxnStatus = 'pending' | 'completed' | 'failed' | 'reversed';

export interface Transaction {
  id: string;
  memberId: string;
  memberName: string;
  type: TxnType;
  amountTZS: number;
  status: TxnStatus;
  reference: string;       // M-Pesa receipt or internal ref
  note?: string;
  createdAt: string;
}

export type PayoutStatus = 'requested' | 'approved' | 'rejected' | 'settled';

export interface PayoutRequest {
  id: string;
  memberId: string;
  memberName: string;
  amountTZS: number;
  mpesaPhone: string;
  reason: string;
  status: PayoutStatus;
  requestedAt: string;
  decidedAt?: string;
  decidedBy?: string;       // Admin agroId
  rejectionReason?: string;
  settledTxnId?: string;
}

export interface Member {
  id: string;
  name: string;
  mpesaPhone: string;       // E.164
  balanceTZS: number;
  status: 'active' | 'suspended';
  joinedAt: string;
}

// ─── Seed data ───────────────────────────────────────────────────────────────
// Realistic placeholder so empty-state never blocks demo / QA. Replaced by real
// Supabase rows once the wallet admin service is implemented (T205+).

const SEED_MEMBERS: Member[] = [
  { id: 'm1', name: 'Asha Mwangi',     mpesaPhone: '+255712345001', balanceTZS:  850_000, status: 'active', joinedAt: '2025-08-12' },
  { id: 'm2', name: 'Juma Said',       mpesaPhone: '+255712345002', balanceTZS:  220_000, status: 'active', joinedAt: '2025-09-03' },
  { id: 'm3', name: 'Neema Okello',    mpesaPhone: '+255712345003', balanceTZS: 1_400_000, status: 'active', joinedAt: '2025-10-21' },
  { id: 'm4', name: 'Hassan Mbaga',    mpesaPhone: '+255712345004', balanceTZS:    0,     status: 'suspended', joinedAt: '2025-07-04' },
  { id: 'm5', name: 'Grace Mushi',     mpesaPhone: '+255712345005', balanceTZS:  640_000, status: 'active', joinedAt: '2026-01-18' },
];

const now = () => new Date().toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

const SEED_TXNS: Transaction[] = [
  { id: 't1', memberId: 'm1', memberName: 'Asha Mwangi', type: 'deposit', amountTZS: 250_000, status: 'completed', reference: 'NHJ4K9ZQX1', createdAt: daysAgo(1) },
  { id: 't2', memberId: 'm3', memberName: 'Neema Okello', type: 'deposit', amountTZS: 400_000, status: 'completed', reference: 'NHJ4L0AB23', createdAt: daysAgo(2) },
  { id: 't3', memberId: 'm2', memberName: 'Juma Said',    type: 'payout',  amountTZS:  80_000, status: 'completed', reference: 'NHJ4M1CD45', note: 'Pembejeo', createdAt: daysAgo(3) },
  { id: 't4', memberId: 'm1', memberName: 'Asha Mwangi',  type: 'fee',     amountTZS:   2_500, status: 'completed', reference: 'FEE-AUG-25',   createdAt: daysAgo(5) },
  { id: 't5', memberId: 'm5', memberName: 'Grace Mushi',  type: 'payout',  amountTZS: 120_000, status: 'pending',   reference: 'PAY-PENDING-1', createdAt: daysAgo(0) },
];

const SEED_PAYOUTS: PayoutRequest[] = [
  { id: 'p1', memberId: 'm5', memberName: 'Grace Mushi', amountTZS: 120_000, mpesaPhone: '+255712345005', reason: 'Mauzo ya mahindi — Mbeya soko',  status: 'requested', requestedAt: daysAgo(0) },
  { id: 'p2', memberId: 'm2', memberName: 'Juma Said',   amountTZS:  60_000, mpesaPhone: '+255712345002', reason: 'Bidhaa za nyumbani',             status: 'requested', requestedAt: daysAgo(1) },
  { id: 'p3', memberId: 'm3', memberName: 'Neema Okello', amountTZS: 300_000, mpesaPhone: '+255712345003', reason: 'Ununuzi wa mbegu',              status: 'approved',  requestedAt: daysAgo(2), decidedAt: daysAgo(1), decidedBy: 'admin' },
];

// ─── Store interface ─────────────────────────────────────────────────────────

export interface WalletAdminState {
  members: Member[];
  transactions: Transaction[];
  payouts: PayoutRequest[];

  // Derived helpers
  pendingPayoutCount: () => number;
  totalBalanceTZS: () => number;

  // Actions
  requestPayout: (input: Omit<PayoutRequest, 'id' | 'status' | 'requestedAt'>) => string;
  approvePayout: (id: string, adminName: string) => void;
  rejectPayout: (id: string, adminName: string, reason: string) => void;
  markSettled: (id: string, mpesaReceipt: string) => void;
  recordTransaction: (txn: Omit<Transaction, 'id' | 'createdAt'>) => string;
  reset: () => void;
}

const fresh = () => ({
  members: SEED_MEMBERS,
  transactions: SEED_TXNS,
  payouts: SEED_PAYOUTS,
});

export const useWalletAdminStore = create<WalletAdminState>()(
  persist(
    (set, get) => ({
      ...fresh(),

      pendingPayoutCount: () => get().payouts.filter((p) => p.status === 'requested').length,
      totalBalanceTZS: () => get().members.reduce((s, m) => s + m.balanceTZS, 0),

      requestPayout: (input) => {
        const id = `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        set((s) => ({
          payouts: [
            { ...input, id, status: 'requested', requestedAt: now() },
            ...s.payouts,
          ],
        }));
        return id;
      },

      approvePayout: (id, adminName) => {
        if (!currentUserCanDecide()) return;
        const target = get().payouts.find((p) => p.id === id);
        if (!target || target.status !== 'requested') return;
        set((s) => ({
          payouts: s.payouts.map((p) =>
            p.id === id ? { ...p, status: 'approved', decidedAt: now(), decidedBy: adminName } : p,
          ),
        }));
        // SMS stub fires immediately; real Daraja STK push lands in T205.
        sendSms({
          to: target.mpesaPhone,
          body: `Ombi lako la TSh ${target.amountTZS.toLocaleString()} limeidhinishwa. Pesa zitatumwa hivi karibuni.`,
          event: 'payment_received',
          meta: { payoutId: id },
        }).catch(() => undefined);
        useKilimoStore.getState().addNotification({
          title: 'Malipo yameidhinishwa',
          body: `${target.memberName} — TSh ${target.amountTZS.toLocaleString()}`,
          type: 'success',
        });
      },

      rejectPayout: (id, adminName, reason) => {
        if (!currentUserCanDecide()) return;
        const target = get().payouts.find((p) => p.id === id);
        if (!target || target.status !== 'requested') return;
        set((s) => ({
          payouts: s.payouts.map((p) =>
            p.id === id
              ? { ...p, status: 'rejected', decidedAt: now(), decidedBy: adminName, rejectionReason: reason }
              : p,
          ),
        }));
        // Mirror rejection to member via SMS stub (consistent with approve path).
        sendSms({
          to: target.mpesaPhone,
          body: `Ombi lako la TSh ${target.amountTZS.toLocaleString()} limekataliwa. Sababu: ${reason}`,
          event: 'payment_received',
          meta: { payoutId: id, decision: 'rejected' },
        }).catch(() => undefined);
        useKilimoStore.getState().addNotification({
          title: 'Malipo yamekataliwa',
          body: `${target.memberName} — ${reason}`,
          type: 'warning',
        });
      },

      markSettled: (id, mpesaReceipt) => {
        if (!currentUserCanDecide()) return;
        const target = get().payouts.find((p) => p.id === id);
        if (!target || target.status !== 'approved') return;

        // Block settlement if member balance would go negative.
        const member = get().members.find((m) => m.id === target.memberId);
        if (member && member.balanceTZS < target.amountTZS) {
          useKilimoStore.getState().addNotification({
            title: 'Salio halitooshi',
            body: `${target.memberName} ana TSh ${member.balanceTZS.toLocaleString()} — malipo ya TSh ${target.amountTZS.toLocaleString()} yanazidi.`,
            type: 'alert',
          });
          return;
        }

        // Create a settlement transaction + decrement member balance atomically.
        const txnId = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        set((s) => ({
          payouts: s.payouts.map((p) =>
            p.id === id ? { ...p, status: 'settled', settledTxnId: txnId } : p,
          ),
          transactions: [
            {
              id: txnId,
              memberId: target.memberId,
              memberName: target.memberName,
              type: 'payout',
              amountTZS: target.amountTZS,
              status: 'completed',
              reference: mpesaReceipt,
              note: target.reason,
              createdAt: now(),
            },
            ...s.transactions,
          ],
          members: s.members.map((m) =>
            m.id === target.memberId
              ? { ...m, balanceTZS: m.balanceTZS - target.amountTZS }
              : m,
          ),
        }));
        // Notify member that payout has been sent.
        sendSms({
          to: target.mpesaPhone,
          body: `Malipo yako ya TSh ${target.amountTZS.toLocaleString()} yametumwa. Risiti: ${mpesaReceipt}`,
          event: 'payment_received',
          meta: { payoutId: id, receipt: mpesaReceipt },
        }).catch(() => undefined);
        useKilimoStore.getState().addNotification({
          title: 'Malipo yametumwa',
          body: `${target.memberName} — TSh ${target.amountTZS.toLocaleString()} · ${mpesaReceipt}`,
          type: 'success',
        });
      },

      recordTransaction: (txn) => {
        const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        set((s) => ({
          transactions: [{ ...txn, id, createdAt: now() }, ...s.transactions],
        }));
        return id;
      },

      reset: () => set(fresh()),
    }),
    {
      name: 'kilimo-wallet-admin-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
