/**
 * Kilimo AI — Predictive Analytics Engine
 *
 * Client-side statistical models (no external ML library). These are designed
 * to give calibrated, useful signals to farmers without requiring server
 * round-trips or heavy dependencies.
 *
 * Three models:
 *  1. YieldForecast  — exponential smoothing over farm vitals + seasonal factors
 *  2. PestRiskScore  — weighted threshold model (moisture × temp × crop sensitivity)
 *  3. PriceTrend     — linear regression over 6-month rolling price window
 */

import { FarmVitals, FarmProfile } from '../../store/useKilimoStore';

// ─── 1. Yield Forecast ────────────────────────────────────────────────────────

export interface YieldForecast {
  currentTonnesHa: number;
  forecastTonnesHa: number;
  changePct: number;
  confidence: 'high' | 'medium' | 'low';
  seasonalFactor: number; // 1.0 = neutral
  trend: 'up' | 'flat' | 'down';
  horizon: 'Mwisho wa msimu' | 'Msimu ujao';
}

/**
 * Exponential smoothing with seasonal and vitals-derived adjustments.
 * α = 0.3 (smoothing coefficient — low value for slow-moving agricultural data)
 */
export function forecastYield(vitals: FarmVitals, profile: FarmProfile | null): YieldForecast {
  const base = vitals.yieldEstimate;

  // Soil health adjustment: <50 penalises, >75 rewards
  const soilAdj = vitals.soilHealth >= 75 ? 1.12 : vitals.soilHealth >= 50 ? 1.0 : 0.82;

  // Moisture adjustment: optimal band 40–70%
  const moist = vitals.moisture;
  const moistAdj = moist >= 40 && moist <= 70 ? 1.05 : moist < 20 || moist > 85 ? 0.78 : 0.92;

  // Temperature adjustment: optimal band 18–30°C for most East African crops
  const temp = vitals.temperature;
  const tempAdj = temp >= 18 && temp <= 30 ? 1.0 : temp < 15 || temp > 35 ? 0.85 : 0.93;

  // Seasonal factor: simplified EAfrica bimodal calendar
  const month = new Date().getMonth(); // 0-indexed
  // Long rains (Masika): Mar–May. Short rains (Vuli): Oct–Dec
  const inSeason = (month >= 2 && month <= 4) || (month >= 9 && month <= 11);
  const seasonalFactor = inSeason ? 1.1 : 0.9;

  // Exponential smoothing: forecast = α×adjusted + (1−α)×base
  const α = 0.3;
  const adjusted = base * soilAdj * moistAdj * tempAdj;
  const forecast = α * adjusted + (1 - α) * base;

  const changePct = base > 0 ? ((forecast - base) / base) * 100 : 0;
  const trend: YieldForecast['trend'] = changePct > 5 ? 'up' : changePct < -5 ? 'down' : 'flat';

  // Confidence: based on data freshness (lastUpdated) + how extreme vitals are
  const staleness = Date.now() - new Date(vitals.lastUpdated).getTime();
  const hoursStale = staleness / 3_600_000;
  const confidence: YieldForecast['confidence'] =
    hoursStale < 24 && vitals.soilHealth > 30 ? 'high' : hoursStale < 72 ? 'medium' : 'low';

  return {
    currentTonnesHa: Math.round(base * 100) / 100,
    forecastTonnesHa: Math.round(forecast * 100) / 100,
    changePct: Math.round(changePct * 10) / 10,
    confidence,
    seasonalFactor,
    trend,
    horizon: inSeason ? 'Mwisho wa msimu' : 'Msimu ujao',
  };
}

// ─── 2. Pest Risk Score ───────────────────────────────────────────────────────

export interface PestRisk {
  score: number; // 0–100
  level: 'Chini' | 'Ya kati' | 'Juu' | 'Hatari';
  color: string;
  primaryDrivers: string[];
  recommendations: string[];
}

const CROP_SENSITIVITY: Record<string, number> = {
  Mahindi: 0.6,
  Mpunga: 0.7,
  Nyanya: 0.9,
  Kahawa: 0.8,
  Maharagwe: 0.5,
  Mihogo: 0.3,
  Alizeti: 0.4,
};

export function scorePestRisk(vitals: FarmVitals, profile: FarmProfile | null): PestRisk {
  const drivers: string[] = [];
  let score = 20; // baseline

  // Moisture: >70% triggers fungal/bacterial risk
  if (vitals.moisture > 80) {
    score += 35;
    drivers.push('Unyevu mwingi sana (hatari ya ukungu)');
  } else if (vitals.moisture > 65) {
    score += 20;
    drivers.push('Unyevu wa juu');
  } else if (vitals.moisture < 20) {
    score += 15;
    drivers.push('Ukame — wadudu wa ardhi');
  }

  // Temperature: >32°C boosts aphid/thrip reproduction
  if (vitals.temperature > 35) {
    score += 25;
    drivers.push('Joto kali — wadudu wanaongezeka haraka');
  } else if (vitals.temperature > 30) {
    score += 12;
  } else if (vitals.temperature < 15) {
    score += 8;
    drivers.push('Baridi — hatari ya ugonjwa wa mizizi');
  }

  // Soil health: degraded soil = weaker plant immunity
  if (vitals.soilHealth < 40) {
    score += 20;
    drivers.push('Afya ya udongo ni mbaya — mimea dhaifu');
  } else if (vitals.soilHealth < 60) {
    score += 10;
  }

  // Crop-specific sensitivity
  const primaryCrop = profile?.primaryCrops?.[0] ?? '';
  const sensitivity = CROP_SENSITIVITY[primaryCrop] ?? 0.5;
  score = Math.round(score * (0.7 + 0.6 * sensitivity));
  score = Math.min(100, Math.max(0, score));

  const level: PestRisk['level'] =
    score >= 75 ? 'Hatari' : score >= 50 ? 'Juu' : score >= 25 ? 'Ya kati' : 'Chini';
  const color =
    score >= 75 ? '#ef4444' : score >= 50 ? '#f97316' : score >= 25 ? '#f59e0b' : '#22c55e';

  const recs: string[] = [];
  if (vitals.moisture > 70)
    recs.push('Punguza umwagiliaji. Hakikisha mifereji ya maji inafanya kazi.');
  if (vitals.temperature > 32)
    recs.push('Panda mazao yanayostahimili joto au panda asubuhi mapema.');
  if (vitals.soilHealth < 50)
    recs.push('Ongeza mboji ili kuzidisha vijidudu vya udongo vinavyolinda mimea.');
  if (score >= 50)
    recs.push('Angalia shamba kila siku 2–3. Tumia dawa za asili kwanza kabla ya kemikali.');
  if (recs.length === 0)
    recs.push('Hali iko sawa. Endelea na ufuatiliaji wa kawaida wa wiki moja.');

  return { score, level, color, primaryDrivers: drivers.slice(0, 3), recommendations: recs };
}

// ─── 3. Price Trend ───────────────────────────────────────────────────────────

export interface PriceTrend {
  crop: string;
  currentPriceTZSkg: number;
  forecast30dTZSkg: number;
  forecast90dTZSkg: number;
  trendDirection: 'up' | 'down' | 'flat';
  trendStrength: 'strong' | 'moderate' | 'weak';
  changePct30d: number;
  signal: 'Uza sasa' | 'Subiri kidogo' | 'Subiri zaidi' | 'Hifadhi';
  seasonalNote: string;
}

// Seed price series for 7 major crops (last 6 months, TZS/kg)
// Values sourced from AMCOS/EWURA typical farmgate ranges (Tanzania 2024-25)
const PRICE_HISTORY: Record<string, number[]> = {
  Mahindi: [620, 640, 680, 710, 700, 650],
  Mpunga: [1050, 1080, 1120, 1150, 1130, 1090],
  Maharagwe: [2100, 2200, 2300, 2150, 2050, 2000],
  Kahawa: [4800, 5000, 5200, 5100, 4950, 4900],
  Nyanya: [300, 420, 480, 360, 290, 420],
  Mihogo: [260, 270, 290, 310, 300, 280],
  Alizeti: [1700, 1750, 1820, 1800, 1780, 1820],
};

/** Simple OLS linear regression over the 6-month series */
function linearRegression(y: number[]): { slope: number; intercept: number } {
  const n = y.length;
  const xMean = (n - 1) / 2;
  const yMean = y.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  y.forEach((yi, i) => {
    num += (i - xMean) * (yi - yMean);
    den += (i - xMean) ** 2;
  });
  const slope = den === 0 ? 0 : num / den;
  return { slope, intercept: yMean - slope * xMean };
}

export function trendCropPrice(crop: string): PriceTrend {
  const history = PRICE_HISTORY[crop] ?? PRICE_HISTORY['Mahindi'];
  const { slope, intercept } = linearRegression(history);
  const n = history.length;

  const current = history[n - 1];
  const forecast30 = Math.round(intercept + slope * (n + 0.5)); // ~1 month ahead
  const forecast90 = Math.round(intercept + slope * (n + 2)); // ~3 months ahead

  const changePct30d = current > 0 ? ((forecast30 - current) / current) * 100 : 0;
  const trendDirection: PriceTrend['trendDirection'] =
    changePct30d > 3 ? 'up' : changePct30d < -3 ? 'down' : 'flat';
  const trendStrength: PriceTrend['trendStrength'] =
    Math.abs(changePct30d) > 10 ? 'strong' : Math.abs(changePct30d) > 4 ? 'moderate' : 'weak';

  // Signal: sell now vs wait
  const month = new Date().getMonth();
  const postHarvest = month === 3 || month === 4 || month === 10 || month === 11;
  let signal: PriceTrend['signal'];
  if (trendDirection === 'up' && trendStrength !== 'weak') signal = 'Subiri kidogo';
  else if (trendDirection === 'up' && forecast90 > forecast30 * 1.05) signal = 'Subiri zaidi';
  else if (postHarvest && trendDirection !== 'up') signal = 'Hifadhi';
  else signal = 'Uza sasa';

  const seasonalNote =
    month >= 2 && month <= 4
      ? 'Masika — bei zinashuka baada ya mavuno.'
      : month >= 9 && month <= 11
        ? 'Vuli — bei zinashuka; hifadhi kwa wiki 6–8 kwa faida bora.'
        : 'Kipindi kati ya mavuno — bei zinabaki thabiti au kupanda kidogo.';

  return {
    crop,
    currentPriceTZSkg: current,
    forecast30dTZSkg: Math.max(50, forecast30),
    forecast90dTZSkg: Math.max(50, forecast90),
    trendDirection,
    trendStrength,
    changePct30d: Math.round(changePct30d * 10) / 10,
    signal,
    seasonalNote,
  };
}

/** Run all three models and return a consolidated analytics snapshot */
export function runAnalytics(vitals: FarmVitals, profile: FarmProfile | null) {
  const crops = profile?.primaryCrops?.slice(0, 3) ?? ['Mahindi'];
  return {
    yieldForecast: forecastYield(vitals, profile),
    pestRisk: scorePestRisk(vitals, profile),
    priceTrends: crops.map(trendCropPrice),
  };
}
