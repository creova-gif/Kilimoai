/**
 * Kilimo AI — Contract Farming Store
 *
 * Implements the contract lifecycle from PRD 5.3:
 *   Draft → Sent → Under Review → Signed → Active → Milestone Due → Completed
 *
 * Plus terminal states: Cancelled, Disputed.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ContractStatus =
  | 'draft'
  | 'sent'
  | 'under_review'
  | 'signed'
  | 'active'
  | 'milestone_due'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface ContractMilestone {
  id: string;
  label: string;
  dueDate: string;
  amountTZS: number;
  paid: boolean;
  completedAt?: string;
}

export interface Contract {
  id: string;
  title: string;
  crop: string;
  quantityKg: number;
  pricePerKgTZS: number;
  buyer: string;
  buyerOrg?: string;
  region: string;
  status: ContractStatus;
  milestones: ContractMilestone[];
  signedByFarmerAt?: string;
  signedByBuyerAt?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_FLOW: Record<ContractStatus, ContractStatus[]> = {
  draft:          ['sent', 'cancelled'],
  sent:           ['under_review', 'cancelled'],
  under_review:   ['signed', 'cancelled', 'disputed'],
  signed:         ['active', 'cancelled'],
  active:         ['milestone_due', 'completed', 'disputed'],
  milestone_due:  ['active', 'completed', 'disputed'],
  completed:      [],
  cancelled:      [],
  disputed:       ['active', 'cancelled'],
};

export function canAdvance(from: ContractStatus, to: ContractStatus): boolean {
  return STATUS_FLOW[from].includes(to);
}

export function nextStatuses(from: ContractStatus): ContractStatus[] {
  return STATUS_FLOW[from];
}

export const STATUS_LABEL: Record<ContractStatus, string> = {
  draft: 'Rasimu',
  sent: 'Imetumwa',
  under_review: 'Inakaguliwa',
  signed: 'Imesainiwa',
  active: 'Inaendelea',
  milestone_due: 'Hatua Inahitajika',
  completed: 'Imekamilika',
  cancelled: 'Imefutwa',
  disputed: 'Ina Mzozo',
};

export const STATUS_COLOR: Record<ContractStatus, string> = {
  draft: '#94a3b8',
  sent: '#3b82f6',
  under_review: '#f59e0b',
  signed: '#3ecf8e',
  active: '#10b981',
  milestone_due: '#f59e0b',
  completed: '#10b981',
  cancelled: '#ef4444',
  disputed: '#ef4444',
};

interface ContractsState {
  contracts: Contract[];
  createContract: (c: Omit<Contract, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'milestones'> & { milestones?: ContractMilestone[] }) => string;
  advance: (id: string, to: ContractStatus) => { ok: boolean; reason?: string };
  signAsFarmer: (id: string) => void;
  signAsBuyer: (id: string) => void;
  markMilestonePaid: (contractId: string, milestoneId: string) => void;
  removeContract: (id: string) => void;
}

// Seed data — illustrates each lifecycle state
const SEED: Contract[] = [
  {
    id: 'c1', title: 'Mahindi Hifadhi ya 2026', crop: 'Maize', quantityKg: 5000, pricePerKgTZS: 850,
    buyer: 'NMB Foods Ltd', buyerOrg: 'NMB', region: 'Arusha', status: 'active',
    signedByFarmerAt: new Date(Date.now() - 14 * 86400_000).toISOString(),
    signedByBuyerAt: new Date(Date.now() - 13 * 86400_000).toISOString(),
    milestones: [
      { id: 'm1', label: 'Mavuno ya Awali', dueDate: new Date(Date.now() + 7 * 86400_000).toISOString(), amountTZS: 1_500_000, paid: false },
      { id: 'm2', label: 'Uwasilishaji wa Mwisho', dueDate: new Date(Date.now() + 30 * 86400_000).toISOString(), amountTZS: 2_750_000, paid: false },
    ],
    createdAt: new Date(Date.now() - 20 * 86400_000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400_000).toISOString(),
  },
  {
    id: 'c2', title: 'Mpunga Bora Mbeya', crop: 'Rice', quantityKg: 2000, pricePerKgTZS: 1_400,
    buyer: 'Kilimo Trust Coop', region: 'Mbeya', status: 'under_review',
    milestones: [
      { id: 'm1', label: 'Malipo ya Awali', dueDate: new Date(Date.now() + 14 * 86400_000).toISOString(), amountTZS: 1_400_000, paid: false },
    ],
    createdAt: new Date(Date.now() - 3 * 86400_000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400_000).toISOString(),
  },
  {
    id: 'c3', title: 'Maharage Mavuno Mafupi', crop: 'Beans', quantityKg: 800, pricePerKgTZS: 2_300,
    buyer: 'East African Grains', region: 'Kilimanjaro', status: 'draft',
    milestones: [],
    createdAt: new Date(Date.now() - 1 * 86400_000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400_000).toISOString(),
  },
];

export const useContractsStore = create<ContractsState>()(
  persist(
    (set, get) => ({
      contracts: SEED,

      createContract: (c) => {
        const id = `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const now = new Date().toISOString();
        const contract: Contract = {
          ...c,
          id,
          status: 'draft',
          milestones: c.milestones ?? [],
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ contracts: [contract, ...s.contracts] }));
        return id;
      },

      advance: (id, to) => {
        const c = get().contracts.find((x) => x.id === id);
        if (!c) return { ok: false, reason: 'not_found' };
        if (!canAdvance(c.status, to)) {
          return { ok: false, reason: `cannot_transition_from_${c.status}_to_${to}` };
        }
        set((s) => ({
          contracts: s.contracts.map((x) =>
            x.id === id ? { ...x, status: to, updatedAt: new Date().toISOString() } : x
          ),
        }));
        return { ok: true };
      },

      signAsFarmer: (id) => set((s) => ({
        contracts: s.contracts.map((x) =>
          x.id === id ? { ...x, signedByFarmerAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : x
        ),
      })),

      signAsBuyer: (id) => set((s) => ({
        contracts: s.contracts.map((x) =>
          x.id === id ? { ...x, signedByBuyerAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : x
        ),
      })),

      markMilestonePaid: (contractId, milestoneId) => set((s) => ({
        contracts: s.contracts.map((c) =>
          c.id !== contractId ? c : {
            ...c,
            milestones: c.milestones.map((m) =>
              m.id === milestoneId ? { ...m, paid: true, completedAt: new Date().toISOString() } : m
            ),
            updatedAt: new Date().toISOString(),
          }
        ),
      })),

      removeContract: (id) => set((s) => ({ contracts: s.contracts.filter((c) => c.id !== id) })),
    }),
    {
      name: 'kilimo-contracts-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
