/**
 * AI-06 — Personalized Recommendation Engine (heuristic baseline).
 * Generates 3+ recs from farm profile + live vitals. Real LLM-backed version
 * arrives in Phase 2 (T201). Until then this is the source of truth and gives
 * the dashboard meaningful, role/region/crop-aware suggestions.
 */
import type { FarmProfile } from '../store/useKilimoStore';

export type RecSeverity = 'info' | 'opportunity' | 'urgent';
export type RecCategory = 'irrigation' | 'market' | 'pest' | 'soil' | 'finance' | 'weather' | 'planning';

export interface Recommendation {
  id: string;
  category: RecCategory;
  severity: RecSeverity;
  title: string;
  body: string;
  cta: { label: string; route: string };
}

interface Inputs {
  profile: FarmProfile | null;
  vitals: { soilHealth: number; moisture: number; temperature: number; yieldEstimate: number };
  language: 'sw' | 'en';
}

const COPY = {
  sw: {
    irrigate: (b: string) => ({ title: 'Umwagiliaji unahitajika', body: `Unyevu umeshuka chini ya 50%. ${b} Mwagilia leo kabla ya jua kali kuanza.` }),
    moisture_ok: () => ({ title: 'Unyevu wa udongo upo sawa', body: 'Hakuna haja ya umwagiliaji wa ziada leo. Endelea kufuatilia kila siku.' }),
    soil_low: () => ({ title: 'Boresha afya ya udongo', body: 'Afya ya udongo ipo chini ya 75%. Fikiria kuongeza mbolea ya samadi au kuchanganya nitrojeni.' }),
    market_up: (crop: string) => ({ title: `Bei ya ${crop} imepanda`, body: `Soko la karibu linaonyesha ongezeko la bei. Hii ni nafasi nzuri ya kuuza akiba yako.` }),
    weather_hot: () => ({ title: 'Joto kali linakuja', body: 'Joto la juu ya 28°C limetabiriwa. Hakikisha mifugo wana maji ya kutosha na kivuli.' }),
    plan_season: (crop: string) => ({ title: `Mpango wa msimu — ${crop}`, body: 'Tumia AI kuandaa mpango kamili: ratiba ya kupanda, pembejeo, na makadirio ya mavuno.' }),
    diversify: () => ({ title: 'Ongeza aina ya mazao', body: 'Una zao moja tu. Kuongeza zao la pili kunapunguza hatari ya kupoteza mapato.' }),
    join_coop: () => ({ title: 'Jiunge na ushirika', body: 'Wakulima wa eneo lako wanapata bei bora kwa kuuza pamoja. Tafuta kikundi karibu nawe.' }),
  },
  en: {
    irrigate: (b: string) => ({ title: 'Irrigation needed', body: `Soil moisture dropped below 50%. ${b} Irrigate today before peak heat.` }),
    moisture_ok: () => ({ title: 'Soil moisture is healthy', body: 'No extra irrigation needed today. Keep monitoring daily.' }),
    soil_low: () => ({ title: 'Improve soil health', body: 'Soil health is under 75%. Consider adding manure or supplementing with nitrogen.' }),
    market_up: (crop: string) => ({ title: `${crop} market price is up`, body: 'Local markets show a price increase. Great window to sell stored produce.' }),
    weather_hot: () => ({ title: 'High heat incoming', body: 'Temperatures above 28°C forecast. Make sure livestock have enough water and shade.' }),
    plan_season: (crop: string) => ({ title: `Season plan — ${crop}`, body: 'Use AI to generate a full plan: planting calendar, input list, projected yield.' }),
    diversify: () => ({ title: 'Diversify your crops', body: "You're growing a single crop. Adding a second reduces income risk." }),
    join_coop: () => ({ title: 'Join a cooperative', body: 'Farmers in your area get better prices selling together. Find a peer group near you.' }),
  },
};

export function generateRecommendations({ profile, vitals, language }: Inputs): Recommendation[] {
  const t = COPY[language];
  const recs: Recommendation[] = [];
  const crops = profile?.primaryCrops ?? [];
  const primaryCrop = crops[0] ?? (language === 'sw' ? 'mazao yako' : 'your crops');

  // 1) Moisture-driven irrigation rec (always something to say)
  if (vitals.moisture < 50) {
    const { title, body } = t.irrigate(profile?.hasIrrigation ? '' : (language === 'sw' ? 'Hauna umwagiliaji wa moja kwa moja.' : 'You have no installed irrigation.'));
    recs.push({
      id: 'rec-moisture',
      category: 'irrigation',
      severity: vitals.moisture < 35 ? 'urgent' : 'opportunity',
      title, body,
      cta: { label: language === 'sw' ? 'Fungua Ramani' : 'Open Map', route: '/map' },
    });
  } else {
    const { title, body } = t.moisture_ok();
    recs.push({
      id: 'rec-moisture-ok', category: 'irrigation', severity: 'info',
      title, body, cta: { label: language === 'sw' ? 'Ona vitals' : 'See vitals', route: '/map' },
    });
  }

  // 2) Soil health
  if (vitals.soilHealth < 75) {
    const { title, body } = t.soil_low();
    recs.push({
      id: 'rec-soil', category: 'soil', severity: 'opportunity',
      title, body,
      cta: { label: language === 'sw' ? 'Tafuta wauzaji' : 'Find suppliers', route: '/input-supply' },
    });
  }

  // 3) Market opportunity — surface for the primary crop
  recs.push({
    id: 'rec-market',
    category: 'market', severity: 'opportunity',
    ...t.market_up(primaryCrop),
    cta: { label: language === 'sw' ? 'Fungua Soko' : 'Open Market', route: '/market' },
  });

  // 4) Weather/livestock
  if (vitals.temperature >= 28) {
    recs.push({
      id: 'rec-weather', category: 'weather', severity: 'info',
      ...t.weather_hot(),
      cta: { label: language === 'sw' ? 'Tazama tahadhari' : 'View alerts', route: '/notifications' },
    });
  }

  // 5) Planning — link directly to Crop Planning screen (B1)
  if (primaryCrop) {
    recs.push({
      id: 'rec-plan', category: 'planning', severity: 'info',
      ...t.plan_season(primaryCrop),
      cta: { label: language === 'sw' ? 'Panga Mazao' : 'Plan Crops', route: '/farm' },
    });
  }

  // 6) Diversification / coop nudges — only if we're short on recs
  if (crops.length === 1) {
    recs.push({
      id: 'rec-diversify', category: 'planning', severity: 'info',
      ...t.diversify(),
      cta: { label: language === 'sw' ? 'Angalia Mazao' : 'Explore Crops', route: '/farm' },
    });
  }
  if (recs.length < 3) {
    recs.push({
      id: 'rec-coop', category: 'finance', severity: 'opportunity',
      ...t.join_coop(),
      cta: { label: language === 'sw' ? 'Tazama vikundi' : 'View peer groups', route: '/peer-groups' },
    });
  }

  return recs.slice(0, 5);
}

export function severityColor(sev: RecSeverity): string {
  if (sev === 'urgent') return '#ef4444';
  if (sev === 'opportunity') return '#1A3B14';
  return '#3b82f6';
}
