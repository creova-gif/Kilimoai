/**
 * Kilimo AI — Digital Farm Twin Store
 *
 * Persists up to 6 named "what-if" scenarios. Each scenario stores its inputs
 * and the deterministic model output so comparisons survive app restarts.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TwinInputs, TwinOutput, runTwinModel, Crop, SoilType } from '../lib/farmtwin/model';

export interface Scenario {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  inputs: TwinInputs;
  output: TwinOutput;
}

const DEFAULT_INPUTS: TwinInputs = {
  crop: 'Mahindi',
  areaHa: 2,
  rainfallMm: 600,
  fertilizerKgHa: 100,
  irrigated: false,
  soilHealth: 75,
  plantingDensityPct: 100,
  soilType: 'Tifutifu (Loam)',
};

// Two seed scenarios for demo/QA
function makeSeeds(): Scenario[] {
  const now = new Date().toISOString();
  const baseInputs: TwinInputs = { ...DEFAULT_INPUTS };
  const improvedInputs: TwinInputs = {
    ...DEFAULT_INPUTS,
    fertilizerKgHa: 180,
    irrigated: true,
    soilHealth: 88,
    plantingDensityPct: 110,
  };
  return [
    { id: 's1', name: 'Hali ya Sasa', createdAt: now, updatedAt: now, inputs: baseInputs, output: runTwinModel(baseInputs) },
    { id: 's2', name: 'Hali Bora', createdAt: now, updatedAt: now, inputs: improvedInputs, output: runTwinModel(improvedInputs) },
  ];
}

export interface DigitalFarmTwinState {
  scenarios: Scenario[];
  createScenario: (name: string, inputs?: Partial<TwinInputs>) => string;
  updateInputs: (id: string, inputs: TwinInputs) => void;
  renameScenario: (id: string, name: string) => void;
  deleteScenario: (id: string) => void;
  duplicateScenario: (id: string) => string;
  reset: () => void;
}

export const useDigitalFarmTwinStore = create<DigitalFarmTwinState>()(
  persist(
    (set, get) => ({
      scenarios: makeSeeds(),

      createScenario: (name, inputs = {}) => {
        const merged: TwinInputs = { ...DEFAULT_INPUTS, ...inputs };
        const id = `sc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const now = new Date().toISOString();
        set((s) => ({
          scenarios: [
            ...s.scenarios,
            { id, name, createdAt: now, updatedAt: now, inputs: merged, output: runTwinModel(merged) },
          ],
        }));
        return id;
      },

      updateInputs: (id, inputs) => {
        set((s) => ({
          scenarios: s.scenarios.map((sc) =>
            sc.id === id
              ? { ...sc, inputs, output: runTwinModel(inputs), updatedAt: new Date().toISOString() }
              : sc,
          ),
        }));
      },

      renameScenario: (id, name) => {
        set((s) => ({
          scenarios: s.scenarios.map((sc) =>
            sc.id === id ? { ...sc, name, updatedAt: new Date().toISOString() } : sc,
          ),
        }));
      },

      deleteScenario: (id) => {
        set((s) => ({ scenarios: s.scenarios.filter((sc) => sc.id !== id) }));
      },

      duplicateScenario: (id) => {
        const src = get().scenarios.find((sc) => sc.id === id);
        if (!src) return '';
        const newId = `sc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const now = new Date().toISOString();
        set((s) => ({
          scenarios: [
            ...s.scenarios,
            { ...src, id: newId, name: `${src.name} (nakala)`, createdAt: now, updatedAt: now },
          ],
        }));
        return newId;
      },

      reset: () => set({ scenarios: makeSeeds() }),
    }),
    {
      name: 'kilimo-farm-twin-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export { DEFAULT_INPUTS };
export type { TwinInputs, TwinOutput, Crop, SoilType };
