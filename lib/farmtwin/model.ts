/**
 * Kilimo AI — Digital Farm Twin: Parametric Yield & Revenue Model
 *
 * A research-calibrated agronomic model for East African smallholder crops.
 * All maths are deterministic so the UI can call it synchronously.
 *
 * Model architecture (per crop per hectare):
 *   base_yield      ← crop ceiling × (soil_health / 100)^0.5
 *   rainfall_factor ← bell curve around optimal_mm; irrigated farms get full score
 *   fertilizer_factor ← Mitscherlich response curve: 1 + 0.4 × min(rate/recommended, 1.2)
 *   planting_factor ← triangular optimum around recommended_density
 *   ─────────────────────────────────────────────────────────────────
 *   yield_t_ha = base × rf × ff × pf                (tonnes / hectare)
 *   total_yield = yield_t_ha × area_ha
 *   revenue     = total_yield × 1000 × price_tzs_kg (TZS)
 *   total_cost  = seed + fertilizer + labor + irrigation + overhead (TZS)
 *   net_profit  = revenue − total_cost               (TZS)
 *   risk_score  = 0–100 composite (drought + pest + market)
 */

export const CROPS = ['Mahindi', 'Mpunga', 'Maharagwe', 'Kahawa', 'Nyanya', 'Mihogo', 'Alizeti'] as const;
export type Crop = typeof CROPS[number];

export const SOIL_TYPES = ['Tifutifu (Loam)', 'Mchanga (Sandy)', 'Udongo (Clay)', 'Mboji (Organic)'] as const;
export type SoilType = typeof SOIL_TYPES[number];

export interface TwinInputs {
  crop: Crop;
  areaHa: number;            // 0.5 – 50
  rainfallMm: number;        // seasonal total, 200 – 2000
  fertilizerKgHa: number;    // 0 – 400
  irrigated: boolean;
  soilHealth: number;        // 0 – 100 (from farm vitals)
  plantingDensityPct: number;// 50 – 150 (% of recommended)
  soilType: SoilType;
}

export interface TwinOutput {
  yieldTonnesHa: number;
  totalYieldTonnes: number;
  revenuesTZS: number;
  totalCostTZS: number;
  netProfitTZS: number;
  roi: number;               // %
  waterUsageM3: number;
  riskScore: number;         // 0–100 (lower = safer)
  riskBreakdown: { drought: number; pest: number; market: number };
  costBreakdown: { seed: number; fertilizer: number; labor: number; irrigation: number; overhead: number };
  advice: string[];           // Swahili advisory strings
}

// ─── Per-crop constants (calibrated from CIMMYT / IRRI / FAO EAfrica data) ──

interface CropParams {
  baseYieldTHa: number;      // attainable ceiling (t/ha) with good management
  optimalRainMm: number;     // season total mm for full rf=1
  priceTZSkg: number;        // farmgate typical price
  recFertKgHa: number;       // recommended N+P2O5+K2O (combined)
  recDensityPlHa: number;    // recommended plants/ha (for reference)
  seedCostTZSha: number;
  laborDaysCost: number;     // TZS/ha
  waterLitersMMha: number;   // litres per mm per ha (for water calcs)
  pestSensitivity: number;   // 0–1 (pest risk multiplier)
  marketVolatility: number;  // 0–1 (price risk)
}

const CROP_PARAMS: Record<Crop, CropParams> = {
  'Mahindi':    { baseYieldTHa: 5,   optimalRainMm: 600,  priceTZSkg: 650,   recFertKgHa: 120, recDensityPlHa: 53_000, seedCostTZSha: 85_000,  laborDaysCost: 320_000, waterLitersMMha: 1000, pestSensitivity: 0.6, marketVolatility: 0.5 },
  'Mpunga':     { baseYieldTHa: 5.5, optimalRainMm: 1200, priceTZSkg: 1100,  recFertKgHa: 150, recDensityPlHa: 400_000,seedCostTZSha: 140_000, laborDaysCost: 480_000, waterLitersMMha: 1500, pestSensitivity: 0.7, marketVolatility: 0.4 },
  'Maharagwe':  { baseYieldTHa: 2,   optimalRainMm: 400,  priceTZSkg: 2200,  recFertKgHa: 60,  recDensityPlHa: 250_000,seedCostTZSha: 70_000,  laborDaysCost: 260_000, waterLitersMMha: 800,  pestSensitivity: 0.5, marketVolatility: 0.6 },
  'Kahawa':     { baseYieldTHa: 1.5, optimalRainMm: 1500, priceTZSkg: 5000,  recFertKgHa: 200, recDensityPlHa: 1_667,  seedCostTZSha: 250_000, laborDaysCost: 600_000, waterLitersMMha: 2000, pestSensitivity: 0.8, marketVolatility: 0.7 },
  'Nyanya':     { baseYieldTHa: 30,  optimalRainMm: 600,  priceTZSkg: 450,   recFertKgHa: 250, recDensityPlHa: 16_000, seedCostTZSha: 180_000, laborDaysCost: 550_000, waterLitersMMha: 1200, pestSensitivity: 0.9, marketVolatility: 0.8 },
  'Mihogo':     { baseYieldTHa: 14,  optimalRainMm: 700,  priceTZSkg: 280,   recFertKgHa: 80,  recDensityPlHa: 10_000, seedCostTZSha: 60_000,  laborDaysCost: 240_000, waterLitersMMha: 900,  pestSensitivity: 0.3, marketVolatility: 0.4 },
  'Alizeti':    { baseYieldTHa: 1.8, optimalRainMm: 500,  priceTZSkg: 1800,  recFertKgHa: 100, recDensityPlHa: 44_000, seedCostTZSha: 95_000,  laborDaysCost: 290_000, waterLitersMMha: 900,  pestSensitivity: 0.4, marketVolatility: 0.5 },
};

const SOIL_MULTIPLIER: Record<SoilType, number> = {
  'Tifutifu (Loam)':  1.0,
  'Mchanga (Sandy)':  0.78,
  'Udongo (Clay)':    0.88,
  'Mboji (Organic)':  1.12,
};

// ─── Factor functions ─────────────────────────────────────────────────────────

/** Soil health → yield capacity (square-root response — diminishing returns) */
function soilFactor(health: number): number {
  return Math.pow(Math.max(0, health) / 100, 0.5);
}

/** Rainfall response bell curve — deficit hurts more than excess */
function rainfallFactor(rainMm: number, optMm: number, irrigated: boolean): number {
  if (irrigated) return 1.0; // irrigation compensates deficit, excess drainage managed
  const ratio = rainMm / optMm;
  if (ratio <= 1) {
    // Deficit: roughly linear drop, but crops can tolerate ~20% deficit
    return Math.max(0.2, 0.2 + 0.8 * (ratio / 0.8)); // = 1.0 at ratio 0.8
  } else {
    // Excess: waterlogging penalty, more severe for rice-excluded crops
    return Math.max(0.5, 1.0 - 0.35 * (ratio - 1.0));
  }
}

/** Mitscherlich-style fertilizer response (plateau at ~1.4×) */
function fertFactor(rate: number, recommended: number): number {
  const pct = rate / Math.max(1, recommended);
  return 1 + 0.4 * Math.min(pct, 1.2) - 0.05 * Math.max(0, pct - 1.2);
}

/** Triangular planting density optimum */
function densityFactor(pct: number): number {
  // Peak at 100%; falls off symmetrically: under-planted or over-planted both hurt
  const d = pct / 100;
  if (d <= 1) return 0.5 + 0.5 * d;       // 50–100%
  return Math.max(0.75, 1.0 - 0.25 * (d - 1.0)); // over-planted
}

// ─── Risk model ───────────────────────────────────────────────────────────────

function droughtRisk(rainMm: number, optMm: number, irrigated: boolean): number {
  if (irrigated) return 10;
  const deficit = Math.max(0, optMm - rainMm) / optMm;
  return Math.min(100, Math.round(deficit * 90 + 10));
}

function pestRisk(soilHealth: number, rain: number, opt: number, sensitivity: number): number {
  // High moisture + degraded soil = higher pest pressure
  const moistureFactor = rain > opt * 1.3 ? 1.3 : rain > opt * 0.8 ? 1.0 : 0.7;
  const soilRisk = 1 - soilHealth / 100;
  return Math.min(100, Math.round((soilRisk * 0.4 + moistureFactor * 0.6) * sensitivity * 100));
}

function marketRisk(volatility: number): number {
  return Math.round(volatility * 80 + 10);
}

// ─── Cost model ───────────────────────────────────────────────────────────────

function costs(inputs: TwinInputs, p: CropParams) {
  const seed = p.seedCostTZSha * inputs.areaHa;
  const fertilizer = inputs.fertilizerKgHa * inputs.areaHa * 850; // ~850 TZS/kg avg compound
  const labor = p.laborDaysCost * inputs.areaHa;
  const irrigation = inputs.irrigated ? inputs.areaHa * 120_000 : 0; // pump + water cost
  const overhead = (seed + fertilizer + labor) * 0.08; // 8% overhead
  return { seed, fertilizer, labor, irrigation, overhead };
}

// ─── Swahili advisory generator ───────────────────────────────────────────────

function buildAdvice(inputs: TwinInputs, output: TwinOutput, p: CropParams): string[] {
  const tips: string[] = [];
  const { riskBreakdown } = output;

  if (riskBreakdown.drought > 60 && !inputs.irrigated)
    tips.push('Hatari ya ukame ni kubwa. Fikiria umwagiliaji au kuhifadhi maji ya mvua.');
  if (inputs.fertilizerKgHa < p.recFertKgHa * 0.5)
    tips.push(`Mbolea ni chini ya mapendekezo (${p.recFertKgHa} kg/ha). Ongeza hadi nusu ya mapendekezo kwa faida bora.`);
  if (inputs.fertilizerKgHa > p.recFertKgHa * 1.4)
    tips.push('Mbolea nyingi sana — unaweza kusababisha kuchomwa kwa mizizi. Punguza kidogo.');
  if (inputs.soilHealth < 50)
    tips.push('Afya ya udongo ni chini ya wastani. Tumia mboji au mbolea ya kijani kabla ya kupanda.');
  if (inputs.plantingDensityPct > 130)
    tips.push('Msongamano wa mimea ni mkubwa sana — hewa haitoshi na magonjwa yataenea haraka.');
  if (inputs.plantingDensityPct < 70)
    tips.push('Mimea ni michache mno — unaacha ardhi bure. Ongeza msongamano kwa mavuno zaidi.');
  if (riskBreakdown.pest > 70)
    tips.push('Hatari ya wadudu na magonjwa ni ya juu. Angalia shamba mara kwa mara na tumia dawa za kuzuia.');
  if (output.roi < 20)
    tips.push('Faida ya mtaji ni ndogo. Angalia kupunguza gharama za kazi au kuuza kwa bei bora zaidi.');
  if (output.roi > 100)
    tips.push('Hali nzuri sana! Weka akiba ya sehemu ya faida kwa msimu ujao.');
  if (tips.length === 0)
    tips.push('Hali ya shamba lako iko vizuri. Endelea na mpango huu na ufuatilie mavuno kwa karibu.');
  return tips;
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export function runTwinModel(inputs: TwinInputs): TwinOutput {
  const p = CROP_PARAMS[inputs.crop];
  const soilMult = SOIL_MULTIPLIER[inputs.soilType];

  const sf = soilFactor(inputs.soilHealth) * soilMult;
  const rf = rainfallFactor(inputs.rainfallMm, p.optimalRainMm, inputs.irrigated);
  const ff = fertFactor(inputs.fertilizerKgHa, p.recFertKgHa);
  const df = densityFactor(inputs.plantingDensityPct);

  const yieldTonnesHa = p.baseYieldTHa * sf * rf * ff * df;
  const totalYieldTonnes = yieldTonnesHa * inputs.areaHa;
  const revenuesTZS = totalYieldTonnes * 1000 * p.priceTZSkg;

  const { seed, fertilizer, labor, irrigation, overhead } = costs(inputs, p);
  const totalCostTZS = seed + fertilizer + labor + irrigation + overhead;
  const netProfitTZS = revenuesTZS - totalCostTZS;
  const roi = totalCostTZS > 0 ? (netProfitTZS / totalCostTZS) * 100 : 0;

  // Water usage: mm × litres/mm/ha × area (converted to m³)
  const waterUsageM3 = inputs.irrigated
    ? (p.optimalRainMm * p.waterLitersMMha * inputs.areaHa) / 1000
    : 0;

  const riskBreakdown = {
    drought: droughtRisk(inputs.rainfallMm, p.optimalRainMm, inputs.irrigated),
    pest:    pestRisk(inputs.soilHealth, inputs.rainfallMm, p.optimalRainMm, p.pestSensitivity),
    market:  marketRisk(p.marketVolatility),
  };
  const riskScore = Math.round(
    riskBreakdown.drought * 0.4 + riskBreakdown.pest * 0.35 + riskBreakdown.market * 0.25,
  );

  const output: TwinOutput = {
    yieldTonnesHa: Math.round(yieldTonnesHa * 100) / 100,
    totalYieldTonnes: Math.round(totalYieldTonnes * 100) / 100,
    revenuesTZS: Math.round(revenuesTZS),
    totalCostTZS: Math.round(totalCostTZS),
    netProfitTZS: Math.round(netProfitTZS),
    roi: Math.round(roi),
    waterUsageM3: Math.round(waterUsageM3),
    riskScore,
    riskBreakdown,
    costBreakdown: {
      seed: Math.round(seed),
      fertilizer: Math.round(fertilizer),
      labor: Math.round(labor),
      irrigation: Math.round(irrigation),
      overhead: Math.round(overhead),
    },
    advice: [],
  };
  output.advice = buildAdvice(inputs, output, p);
  return output;
}

/** Compare two scenarios and return delta stats */
export function compareScenarios(a: TwinOutput, b: TwinOutput) {
  return {
    yieldDelta: b.totalYieldTonnes - a.totalYieldTonnes,
    revenueDelta: b.revenuesTZS - a.revenuesTZS,
    profitDelta: b.netProfitTZS - a.netProfitTZS,
    riskDelta: b.riskScore - a.riskScore,
  };
}
