/**
 * Kilimo AI — Role-Based Access Control
 *
 * Implements the PRD feature matrix (Section 2.1) for the five user roles.
 * Each feature is gated as 'full' | 'basic' | 'none'.
 *
 * Usage:
 *   const access = useAccess('ai_chat');             // 'full' | 'basic' | 'none'
 *   const can = useCan('contract_farming');          // boolean (full OR basic)
 *   <Gate feature="livestock"> <LivestockPage /> </Gate>
 */

import React from 'react';
import { useKilimoStore } from '../store/useKilimoStore';

export type AccessLevel = 'full' | 'basic' | 'none';

// Canonical role identifiers — map Swahili display roles → canonical
export type CanonicalRole =
  | 'smallholder'
  | 'farmer'
  | 'farm_manager'
  | 'agribusiness'
  | 'coop_leader';

export type Feature =
  | 'ai_chat'
  | 'photo_diagnosis'
  | 'voice_assistant'
  | 'crop_planning'
  | 'farm_mapping'
  | 'task_management'
  | 'livestock'
  | 'inventory'
  | 'market_prices'
  | 'marketplace'
  | 'contract_farming'
  | 'input_supply'
  | 'finance_tracker'
  | 'mobile_money'
  | 'insurance'
  | 'agro_id'
  | 'analytics_predictive'
  | 'digital_farm_twin'
  | 'expert_consultations'
  | 'weather_alerts'
  | 'offline_mode'
  | 'peer_groups';

// Matrix mirrors PRD Section 2.1
const MATRIX: Record<CanonicalRole, Record<Feature, AccessLevel>> = {
  smallholder: {
    ai_chat: 'full', photo_diagnosis: 'full', voice_assistant: 'full',
    crop_planning: 'basic', farm_mapping: 'basic', task_management: 'basic',
    livestock: 'none', inventory: 'none',
    market_prices: 'full', marketplace: 'full', contract_farming: 'none', input_supply: 'none',
    finance_tracker: 'full', mobile_money: 'full', insurance: 'full', agro_id: 'none',
    analytics_predictive: 'none', digital_farm_twin: 'none',
    expert_consultations: 'full', weather_alerts: 'full', offline_mode: 'full', peer_groups: 'full',
  },
  farmer: {
    ai_chat: 'full', photo_diagnosis: 'full', voice_assistant: 'full',
    crop_planning: 'full', farm_mapping: 'full', task_management: 'full',
    livestock: 'full', inventory: 'full',
    market_prices: 'full', marketplace: 'full', contract_farming: 'full', input_supply: 'full',
    finance_tracker: 'full', mobile_money: 'full', insurance: 'full', agro_id: 'none',
    analytics_predictive: 'none', digital_farm_twin: 'none',
    expert_consultations: 'full', weather_alerts: 'full', offline_mode: 'full', peer_groups: 'full',
  },
  farm_manager: {
    ai_chat: 'full', photo_diagnosis: 'full', voice_assistant: 'full',
    crop_planning: 'full', farm_mapping: 'full', task_management: 'full',
    livestock: 'full', inventory: 'full',
    market_prices: 'full', marketplace: 'full', contract_farming: 'full', input_supply: 'full',
    finance_tracker: 'full', mobile_money: 'full', insurance: 'full', agro_id: 'none',
    analytics_predictive: 'full', digital_farm_twin: 'full',
    expert_consultations: 'full', weather_alerts: 'full', offline_mode: 'full', peer_groups: 'full',
  },
  agribusiness: {
    ai_chat: 'none', photo_diagnosis: 'none', voice_assistant: 'none',
    crop_planning: 'none', farm_mapping: 'none', task_management: 'none',
    livestock: 'none', inventory: 'none',
    market_prices: 'full', marketplace: 'full', contract_farming: 'full', input_supply: 'full',
    finance_tracker: 'full', mobile_money: 'full', insurance: 'none', agro_id: 'full',
    analytics_predictive: 'full', digital_farm_twin: 'none',
    expert_consultations: 'none', weather_alerts: 'none', offline_mode: 'none', peer_groups: 'none',
  },
  coop_leader: {
    ai_chat: 'full', photo_diagnosis: 'full', voice_assistant: 'full',
    crop_planning: 'full', farm_mapping: 'full', task_management: 'none',
    livestock: 'none', inventory: 'none',
    market_prices: 'full', marketplace: 'full', contract_farming: 'full', input_supply: 'none',
    finance_tracker: 'full', mobile_money: 'full', insurance: 'none', agro_id: 'none',
    analytics_predictive: 'none', digital_farm_twin: 'none',
    expert_consultations: 'full', weather_alerts: 'full', offline_mode: 'full', peer_groups: 'full',
  },
};

const FEATURE_LABELS: Record<Feature, string> = {
  ai_chat: 'AI Chat',
  photo_diagnosis: 'Photo Crop Diagnosis',
  voice_assistant: 'Voice Assistant',
  crop_planning: 'Crop Planning',
  farm_mapping: 'Farm Mapping',
  task_management: 'Task Management',
  livestock: 'Livestock Tracking',
  inventory: 'Inventory Management',
  market_prices: 'Market Prices',
  marketplace: 'Marketplace',
  contract_farming: 'Contract Farming',
  input_supply: 'Input Supply',
  finance_tracker: 'Finance Tracker',
  mobile_money: 'Mobile Money',
  insurance: 'Insurance Hub',
  agro_id: 'Agro ID',
  analytics_predictive: 'Predictive Analytics',
  digital_farm_twin: 'Digital Farm Twin',
  expert_consultations: 'Expert Consultations',
  weather_alerts: 'Weather & Alerts',
  offline_mode: 'Offline Mode',
  peer_groups: 'Peer Groups',
};

const ROLE_LABELS: Record<CanonicalRole, string> = {
  smallholder: 'Mkulima Mdogo (Smallholder)',
  farmer: 'Mkulima (Farmer)',
  farm_manager: 'Msimamizi (Farm Manager)',
  agribusiness: 'Agribiashara (Agribusiness)',
  coop_leader: 'Kiongozi wa Ushirika (Co-op Leader)',
};

// Map AgroID.role free-form string → canonical role.
// Defaults to 'farmer' which is a sensible middle ground.
export function normalizeRole(role: string | undefined | null): CanonicalRole {
  if (!role) return 'farmer';
  const r = role.toLowerCase();
  if (r.includes('small') || r.includes('mdogo')) return 'smallholder';
  if (r.includes('manager') || r.includes('msimamizi') || r.includes('mkuu')) return 'farm_manager';
  if (r.includes('agri') || r.includes('biashara') || r.includes('buyer')) return 'agribusiness';
  if (r.includes('coop') || r.includes('ushirika') || r.includes('amcos')) return 'coop_leader';
  return 'farmer';
}

export function featureLabel(f: Feature): string { return FEATURE_LABELS[f]; }
export function roleLabel(r: CanonicalRole): string { return ROLE_LABELS[r]; }
export function allFeatures(): Feature[] { return Object.keys(FEATURE_LABELS) as Feature[]; }
export function allRoles(): CanonicalRole[] { return Object.keys(ROLE_LABELS) as CanonicalRole[]; }

/** Hook: returns access level for a feature based on the current Agro ID role. */
export function useAccess(feature: Feature): AccessLevel {
  const role = useKilimoStore((s) => s.agroId?.role);
  const canon = normalizeRole(role);
  return MATRIX[canon][feature];
}

/** Hook: returns true if user has any access (full OR basic). */
export function useCan(feature: Feature): boolean {
  return useAccess(feature) !== 'none';
}

/** Hook: returns true only for full access. */
export function useHasFullAccess(feature: Feature): boolean {
  return useAccess(feature) === 'full';
}

/** Component: only renders children if user has access. */
export function Gate({
  feature,
  fallback = null,
  children,
}: {
  feature: Feature;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const access = useAccess(feature);
  if (access === 'none') return <>{fallback}</>;
  return <>{children}</>;
}
