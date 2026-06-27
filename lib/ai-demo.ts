/**
 * KILIMO AI — Demo Response Engine (Phase 1 fallback)
 *
 * When Supabase / OpenAI is not configured, both the Sankofa chat and the
 * crop-scan screen use this module to return realistic, contextual Swahili
 * responses so the app is fully demoable without any API keys.
 *
 * Strategy: keyword → intent → response bank. We pick one response per
 * intent at random so repeated asks feel varied.
 */

import type { VisionDiagnosis } from './ai';

// ─── Sankofa Chat Demo ────────────────────────────────────────────────────────

type Intent =
  | 'greeting'
  | 'irrigation'
  | 'pest'
  | 'disease'
  | 'soil'
  | 'market'
  | 'weather'
  | 'fertilizer'
  | 'maize'
  | 'rice'
  | 'coffee'
  | 'beans'
  | 'livestock'
  | 'planning'
  | 'finance'
  | 'fallback';

interface IntentRule {
  patterns: RegExp[];
  intent: Intent;
}

const INTENT_RULES: IntentRule[] = [
  {
    intent: 'greeting',
    patterns: [/\b(habari|hujambo|salama|karibu|hello|hi\b|hey|jambo|mambo|niambie)\b/i],
  },
  {
    intent: 'irrigation',
    patterns: [/\b(maji|umwagiliaji|irrigat|unyevu|moisture|drought|ukame|kunyunyizia)\b/i],
  },
  {
    intent: 'pest',
    patterns: [/\b(wadudu|pest|nzige|aphid|mbu|inzi|viwavi|armyworm|thrip|whitefly|nematode)\b/i],
  },
  {
    intent: 'disease',
    patterns: [
      /\b(ugonjwa|magonjwa|disease|blight|kutu|mold|ukungu|rust|wilt|majani|yellow|njano|kuoza)\b/i,
    ],
  },
  {
    intent: 'soil',
    patterns: [/\b(udongo|soil|pH|rutuba|compost|samadi|organic|mineral|silt|loam|sandy)\b/i],
  },
  {
    intent: 'market',
    patterns: [/\b(bei|soko|market|price|uza|nunua|export|wholesale|retail|mnunuzi|ununuzi)\b/i],
  },
  {
    intent: 'weather',
    patterns: [
      /\b(hali ya hewa|mvua|rain|weather|joto|heat|baridi|cold|forecast|tabiri|upepo|wind)\b/i,
    ],
  },
  {
    intent: 'fertilizer',
    patterns: [/\b(mbolea|fertilizer|NPK|nitrogen|potassium|phosphorus|DAP|urea|CAN|topdress)\b/i],
  },
  {
    intent: 'maize',
    patterns: [/\b(mahindi|maize|corn|ugali)\b/i],
  },
  {
    intent: 'rice',
    patterns: [/\b(mpunga|mchele|rice|paddy)\b/i],
  },
  {
    intent: 'coffee',
    patterns: [/\b(kahawa|coffee)\b/i],
  },
  {
    intent: 'beans',
    patterns: [/\b(maharage|beans|soya|soy|kunde|mbaazi)\b/i],
  },
  {
    intent: 'livestock',
    patterns: [
      /\b(mifugo|ng'ombe|ng.ombe|kuku|kondoo|mbuzi|cattle|cow|chicken|poultry|goat|sheep)\b/i,
    ],
  },
  {
    intent: 'planning',
    patterns: [
      /\b(panda|kupanda|plant|season|msimu|ratiba|schedule|plan|mpango|masika|vuli|kiangazi)\b/i,
    ],
  },
  {
    intent: 'finance',
    patterns: [/\b(mkopo|loan|pesa|fedha|faida|profit|gharama|cost|bima|insurance|benki|bank)\b/i],
  },
];

const RESPONSES: Record<Intent, string[]> = {
  greeting: [
    'Habari! Mimi ni Sankofa AI, mshauri wako wa kilimo. Ninaweza kukusaidia kuhusu mazao yako, wadudu, bei za soko, na mengi zaidi. Unahitaji msaada gani leo?',
    'Karibu sana! Niko hapa kukusaidia na maswali yako ya kilimo. Niulize chochote kuhusu mazao, udongo, au soko!',
    'Jambo! Sankofa AI iko tayari. Je, una swali kuhusu mazao, hali ya hewa, au soko la leo?',
  ],
  irrigation: [
    'Kulingana na data ya shamba lako, unyevu wa udongo uko chini ya 45%. Napendekeza umwagiliaji mfupi wa dakika 30 kabla jua kali. Mwagilia asubuhi saa 12 au jioni saa 12 ili kupunguza uvukizi.',
    'Kwa mazao ya mahindi katika hatua ya ukuaji (vegetative stage), unahitaji lita 5–7 kwa mita ya mraba kwa wiki. Angalia hali ya majani — ukiona yanashuka, mwagilia haraka.',
    'Njia bora ya umwagiliaji kwa eneo kame ni drip irrigation — inapunguza maji kwa 40% ikilinganishwa na kunyunyizia. Unaweza pia tumia mulch (majani makavu) kufunika ardhi kupunguza uvukizi.',
  ],
  pest: [
    'Viwavi wa mahindi (Fall Armyworm) ni tatizo kubwa Tanzania. Dalili: mashimo makubwa kwenye majani na kinyesi cheusi. Dawa inayofaa: Emamectin benzoate (Sunfire) — nyunyizia asubuhi au jioni. Fanya kila siku 7.',
    'Aphids kwenye mazao yako zinaweza kudhibitiwa na dawa ya neem (mwarobaini) iliyochanganywa na sabuni laini. Changanya: maji lita 10 + neem oil ml 30 + sabuni g 5. Nyunyizia kila siku 5.',
    'Kwa wadudu wanaoshambulia mizizi, tumia granules za imidacloprid wakati wa kupanda. Njia za asili: jua la kuchoma ardhi (solarization) kabla ya msimu, au mzunguko wa mazao (crop rotation).',
  ],
  disease: [
    "Dalili za kutu ya mahindi (Maize Streak Virus): madoa ya njano kwenye majani. Inasambazwa na wadudu (leafhopper). Hakuna tiba — ng'oa mimea iliyoathirika na ichome ili kuzuia kuenea. Tumia mbegu sugu msimu ujao.",
    'Ukungu wa mpunga (Blast) unaonekana kwa madoa ya kijivu-nyeupe kwenye majani. Dawa: Tricyclazole au Isoprothiolane. Epuka kumwagilia kupita kiasi na hakikisha mzunguko wa hewa shambani.',
    'Uoza wa mizizi (Root rot) husababishwa na maji mengi. Punguza umwagiliaji, fanya mfumo mzuri wa mifereji, na nyunyizia Mancozeb au dawa ya copper oxychloride kwenye ardhi.',
  ],
  soil: [
    "Udongo bora kwa mazao mengi una pH kati ya 6.0–6.8. Kama pH yako iko chini (tindikali), ongeza chokaa (lime) — gramu 200 kwa mita mraba. Kama pH ni juu (alkali), ongeza sulfuri au matumizi ya samadi ya ng'ombe.",
    'Ili kuboresha rutuba ya udongo: changanya samadi iliyooza vizuri (compost) — kilo 2 kwa mita mraba — na mbolea ya DAP wakati wa kupanda. Msimu ujao, tumia mzunguko wa mazao ya kunde (legumes) kuboresha nitrojeni.',
    'Udongo wa Tanzania wa eneo la Rift Valley una potassium nyingi lakini upungufu wa zinc na boron. Wasiliana na mtaalamu wa udongo ili kupata uchambuzi kamili wa soil test kabla ya msimu.',
  ],
  market: [
    'Bei za soko la Mbeya leo: Mahindi — TZS 580/kg (juu kidogo kutoka wiki iliyopita). Maharage — TZS 1,400/kg. Mpunga (vuli) — TZS 950/kg. Ushauri: soko nzuri zaidi kwa mahindi ni Dar es Salaam au arusha. Wasiliana na ushirika wako.',
    'Muda mzuri wa kuuza mavuno yako ni miezi 2–3 baada ya mavuno ya wengi — bei inakuwa juu zaidi. Hifadhi vizuri kwenye ghala lenye hewa nzuri na dawa ya kuua wadudu wa nafaka.',
    'Kwa bei bora, jiunge na kikundi cha wakulima ili kuuza pamoja (bulk selling). Mnunuzi wa jumla hulipa TZS 50–100 zaidi kwa kilo kuliko duka la kawaida.',
  ],
  weather: [
    'Msimu wa Masika (Machi–Mei) unatarajiwa kuwa na mvua za wastani mwaka huu. ICPAC imetabiri: mvua za kawaida hadi juu kidogo (above-normal) kwa Tanzania Kaskazini na Kati. Panda mahindi mwishoni mwa Machi.',
    'Joto la sasa: 27°C. Wiki ijayo linatarajiwa kuwa kali — joto 32–35°C. Hakikisha mazao yako yana maji ya kutosha na fanya mulching ili kupunguza upotezaji wa maji kutoka ardhini.',
    'Mvua za Vuli (Oktoba–Desemba) zinatarajiwa kuanza mapema mwaka huu. Tayarisha shamba lako: fanya mifereji ya maji kupita kiasi na panga kupanda ndani ya siku 7 za mvua ya kwanza.',
  ],
  fertilizer: [
    'Mpango bora wa mbolea kwa mahindi (ekari moja): Kupanda — DAP kilo 50. Wiki 4 baada ya kupanda — CAN kilo 50 (top dressing 1). Wiki 8 — CAN kilo 25 (top dressing 2). Jumla ya gharama: TZS 85,000–110,000.',
    "Mbolea ya asili (organic) inaboresha udongo vizuri zaidi kuliko kemikali peke yake. Changanya: samadi ya ng'ombe iliyooza (kilo 500/ekari) + compost ya majani + mbolea ya kijani (green manure). Hii inapunguza gharama kwa 30%.",
    'Urea ina nitrojeni nyingi (46%) — nzuri kwa ukuaji wa majani. Lakini usitumie zaidi ya kiasi — inachoma mizizi. Tumia gramu 2–3 kwa mita mraba wakati wa top dressing la kwanza.',
  ],
  maize: [
    'Mbegu bora za mahindi kwa Tanzania: DK8031 (hybrid, mavuno ya juu — tani 6–8/ekari), SEEDCO SC403 (ukame-sugu), Longe 10H (eneo la mvua chache). Nunua mbegu zilizothibitishwa tu kwenye duka rasmi.',
    'Mzunguko wa mahindi: Kupanda → Kuota (siku 7) → Ukuaji wa majani (siku 20–45) → Maua (siku 55–65) → Tunda (siku 70–90) → Kukomaa (siku 95–110). Mwagilia vizuri wakati wa maua — hatua muhimu zaidi.',
    'Mavuno mazuri ya mahindi yanahitaji: mbegu bora + mbolea sahihi + umwagiliaji + kudhibiti wadudu mapema. Kwa usimamizi mzuri, unaweza kupata tani 5–7 kwa ekari badala ya wastani wa tani 2.',
  ],
  rice: [
    'Kwa mpunga wa mfumo wa FARO au SRI (System of Rice Intensification), unaweza kuongeza mavuno hadi mara 2. Kanuni kuu: panda miche michanga (siku 8–12), nafasi pana (25×25cm), mbolea ya asili, maji kidogo.',
    'Magonjwa makuu ya mpunga Tanzania: Blast (ukungu), Brown Spot, Bacterial Leaf Blight. Epuka kwa: mbegu sugu, kudhibiti maji, na kupunguza mbolea ya nitrojeni kupita kiasi.',
    'Bei ya mpunga imeongezeka kwa 15% msimu huu. Soko la Moshi na Arusha linanunua kwa TZS 950–1,100/kg kwa mpunga wa ubora wa kwanza. Chagua aina ya aromatic (mwaka mzuri wa kuuza).',
  ],
  coffee: [
    'Kahawa ya arabica (eneo la Kilimanjaro/Mbeya): Inahitaji mvua ya mm 1,500–2,000/mwaka, joto 15–24°C, na udongo wenye rutuba. Mwagilia kwa mfumo wa drip kama mvua haitoshi.',
    'Ugonjwa mkubwa wa kahawa: Coffee Berry Disease (CBD) na Leaf Rust (kutu). Tumia Copper hydroxide kabla ya mvua. Kagua mashamba kila wiki katika msimu wa mvua.',
    'Kahawa inauzwa vizuri kupitia cooperative (e.g., KNCU Kilimanjaro). Unaweza kupata bei ya USD 2.5–3.5/kg kwa kahawa ya ubora wa kwanza ikilinganishwa na bei ya kawaida ya TZS 3,500/kg.',
  ],
  beans: [
    'Maharage yanafaa kwa mzunguko wa mazao baada ya mahindi — yanaboresha nitrojeni ya udongo. Panda aina ya Jesca, Selian 97, au LYAMUNGU 85 kwa mavuno mazuri.',
    "Ugonjwa wa Bean Common Mosaic Virus: madoa ya njano ya mosaic kwenye majani. Ng'oa mimea iliyoathirika. Epuka kwa mbegu safi na kudhibiti aphids (wanaosambaza virusi).",
    'Soko la maharage linafanya vizuri — bei ni TZS 1,200–1,600/kg kulingana na aina. Maharage nyekundu (kidney beans) yana bei bora zaidi. Hifadhi vizuri kwenye gunia zilizofunikwa.',
  ],
  livestock: [
    "Kwa ng'ombe wa maziwa, lishe nzuri ni muhimu sana. Tumia napier grass (bana) + concentrate (kilo 2–3/siku) + chumvi ya madini. Ng'ombe mzuri anaweza kutoa lita 15–20/siku.",
    'Chanjo muhimu kwa mifugo Tanzania: FMD (Homa ya miguu na mdomo) — kila miezi 6, Anthrax — kila mwaka, CBPP (magonjwa ya mapafu) — kila mwaka. Wasiliana na daktari wa mifugo wa karibu.',
    'Kuku wa kienyeji wanaweza kuuzwa TZS 8,000–15,000 kila mmoja. Chanjo ya Newcastle (siku 7 na siku 21) inapunguza vifo sana. Lishe: nafaka (mahindi) 60% + protein (samaki uliochomwa) 20% + vitamini.',
  ],
  planning: [
    'Msimu wa Masika (Machi–Mei) unaoanza hivi karibuni: Wiki 1–2: tayarisha shamba (palilia, lima, ongeza samadi). Wiki 3: panda mbegu (mahindi, maharage). Wiki 5: mbolea ya kwanza (DAP). Wiki 8: palilia + mbolea ya pili (CAN). Wiki 16: mavuno.',
    'Mpango wa mwaka wa shamba bora: Masika (Machi–Mei): mahindi + maharage. Vuli (Oktoba–Desemba): mpunga au mbogamboga. Kiangazi: alizeti au vitunguu kwa umwagiliaji. Hii inaongeza mapato mara 3.',
    'Kabla ya msimu, kazi muhimu 5: (1) Pima udongo (soil test), (2) Ununue mbegu sertified, (3) Panga mbolea mapema, (4) Angalia hali ya zana, (5) Wasiliana na soko la mbele (forward contract).',
  ],
  finance: [
    'CRDB na NMB Tanzania wana mikopo ya kilimo kwa riba ya 12–18%/mwaka. Unahitaji: Agro ID, historia ya mauzo (warehouse receipts), na dhamana. Jiunge na SACCOS ya wakulima ili kupata mkopo rahisi zaidi.',
    'Bima ya mazao (crop insurance) inapatikana kupitia UAP Old Mutual na Jubilee Insurance Tanzania. Inafunika hasara ya mvua, ukame, na magonjwa. Gharama: TZS 30,000–80,000/ekari/msimu.',
    'Ili kupata faida nzuri: Hesabu gharama zako (inputs + kazi + usafiri) kisha ulinganishe na bei ya soko. Mkulima anayetumia TZS 300,000/ekari anaweza kupata faida ya TZS 500,000+ kwa mahindi ya ubora.',
  ],
  fallback: [
    'Asante kwa swali lako. Kwa sasa nina taarifa kuhusu: umwagiliaji, wadudu, magonjwa ya mazao, bei za soko, udongo, hali ya hewa, na mipango ya msimu. Je, unaweza kuniambia zaidi kuhusu mazao yako au tatizo unalolipata?',
    'Ninajua mengi kuhusu kilimo cha Tanzania — mahindi, mpunga, kahawa, maharage, mifugo, na zaidi. Niambie zaidi kuhusu tatizo lako ili nikupe ushauri sahihi.',
    'Napenda kukusaidia! Uliza swali lako kuhusu: mazao, wadudu, udongo, mbolea, bei za soko, au mipango ya shamba. Nitajibu kwa Kiswahili kamili.',
  ],
};

function detectIntent(text: string): Intent {
  const lower = text.toLowerCase();
  for (const rule of INTENT_RULES) {
    if (rule.patterns.some((p) => p.test(lower))) {
      return rule.intent;
    }
  }
  return 'fallback';
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Simulate network latency so the demo feels realistic (600–1800ms). */
function simulatedDelay(): Promise<void> {
  return new Promise((r) => setTimeout(r, 600 + Math.random() * 1200));
}

/**
 * Demo chat — returns a contextual Swahili farming response without any API.
 * Call this when `aiConfigured()` returns false.
 */
export async function demoChat(userText: string): Promise<string> {
  await simulatedDelay();
  const intent = detectIntent(userText);
  return pick(RESPONSES[intent]);
}

// ─── Scan Demo ────────────────────────────────────────────────────────────────

const DEMO_DIAGNOSES: VisionDiagnosis[] = [
  {
    crop: 'Mahindi',
    disease: 'Fall Armyworm (Spodoptera frugiperda)',
    severity: 'high',
    actions: [
      'Nyunyizia Emamectin benzoate 1.9% EC (Sunfire) — ml 10 / lita 10 ya maji',
      'Rudia dawa baada ya siku 7 kama wadudu wanaendelea',
      'Ondoa na choma majani yaliyoathirika sana',
      'Fuatilia shamba kila asubuhi kwa wiki mbili',
    ],
    raw: 'Fall Armyworm detected with high confidence. Leaf damage pattern and frass deposits confirm Spodoptera frugiperda infestation.',
  },
  {
    crop: 'Mpunga',
    disease: 'Rice Blast (Pyricularia oryzae)',
    severity: 'medium',
    actions: [
      'Nyunyizia Tricyclazole 75WP — g 15 / lita 15 ya maji',
      'Punguza umwagiliaji wa mara kwa mara',
      'Epuka mbolea ya ziada ya nitrojeni',
      'Angalia tena baada ya siku 10',
    ],
    raw: 'Rice blast lesions detected on leaf samples. Gray-white diamond-shaped spots with brown borders indicate Pyricularia oryzae infection.',
  },
  {
    crop: 'Mahindi',
    disease: 'Maize Streak Virus (MSV)',
    severity: 'medium',
    actions: [
      "Ng'oa mimea yote iliyoathirika na ichome mbali na shamba",
      'Dhibiti leafhopper (wadudu wanaosambaza virusi) kwa Imidacloprid',
      'Msimu ujao: tumia mbegu sugu kama DK8031 au SEEDCO 403',
      'Epuka kupanda karibu na mahindi ya zamani (ambayo inaweza kuwa chanzo cha virusi)',
    ],
    raw: 'Maize Streak Virus symptoms detected. Yellow streaking pattern along leaf veins is characteristic of MSV infection spread by leafhoppers.',
  },
  {
    crop: 'Maharage',
    disease: 'Bean Rust (Uromyces appendiculatus)',
    severity: 'low',
    actions: [
      'Nyunyizia Mancozeb 80WP — g 25 / lita 10 ya maji',
      'Hakikisha hewa nzuri kati ya mimea (nafasi ya kutosha)',
      'Epuka kumwagilia juu ya majani jioni',
      'Fuatilia kwa wiki moja na uamue kama unahitaji dawa zaidi',
    ],
    raw: 'Early-stage bean rust detected. Orange-brown pustules on leaf undersides indicate Uromyces infection at manageable level.',
  },
  {
    crop: 'Kahawa',
    disease: 'Coffee Leaf Rust (Hemileia vastatrix)',
    severity: 'high',
    actions: [
      'Nyunyizia Copper hydroxide 77WP — g 30 / lita 10 ya maji',
      'Rudia baada ya siku 14 hadi dalili zinapungua',
      'Kata matawi yaliyozidi ili hewa ipite vizuri',
      'Wasiliana na daktari wa kilimo kwa uhakika wa aina ya dawa',
    ],
    raw: 'Coffee leaf rust confirmed. Yellow-orange powdery lesions on leaf undersides match Hemileia vastatrix infection pattern.',
  },
];

/**
 * Demo vision diagnosis — simulates a realistic crop scan result.
 * Randomly picks from a bank of real East African crop diseases.
 * Call this when `aiConfigured()` returns false.
 */
export async function demoDiagnosis(): Promise<VisionDiagnosis> {
  await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1500));
  return pick(DEMO_DIAGNOSES);
}
