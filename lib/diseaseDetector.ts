export interface DiseaseResult {
  diseaseNameSw: string;
  diseaseNameEn: string;
  confidence: number; // percentage
  organicControlSw: string;
  organicControlEn: string;
  chemicalControlSw: string;
  chemicalControlEn: string;
  videoUrl?: string; // YouTube Video ID
  videoId?: string; // Video catalog item ID (e.g. 'v5')
}

export interface DiseaseReport {
  crop: string;
  region: string;
  diagnosisDate: string;
  topDiseases: DiseaseResult[];
}

// Symptom definitions per crop
export const CROP_SYMPTOMS: Record<string, { labelSw: string; labelEn: string; id: string }[]> = {
  maize: [
    { id: 'yellow_veins', labelSw: 'Madoa au michirizi ya njano kwenye majani', labelEn: 'Yellow stripes/spots on leaves' },
    { id: 'wilted_stunted', labelSw: 'Mmea kunyauka na kudumaa haraka', labelEn: 'Sudden wilting and stunting' },
    { id: 'white_cob_mold', labelSw: 'Ukungu mweupe/kijivu kwenye mahindi/gunzi', labelEn: 'White/gray mold on cobs' },
    { id: 'powder_rust', labelSw: 'Unga wa rangi ya kahawia kwenye majani', labelEn: 'Brown powdery pustules on leaves' }
  ],
  tomatoes: [
    { id: 'leaf_curling', labelSw: 'Majani kujikunja juu na kuwa madogo', labelEn: 'Upward curling and small leaves' },
    { id: 'concentric_spots', labelSw: 'Madoa meusi ya duara yenye mistari ya pete', labelEn: 'Black concentric target spots' },
    { id: 'wilted_stem', labelSw: 'Mmea kunyauka katikati ya siku hata kukiwa na maji', labelEn: 'Wilting during hot days despite moisture' },
    { id: 'gray_leaf_mold', labelSw: 'Ukungu wa kijivu au zambarau chini ya jani', labelEn: 'Gray or purple mold under leaves' }
  ],
  beans: [
    { id: 'rust_dots', labelSw: 'Viji-doa vyekundu/kahawia vya kutu', labelEn: 'Reddish-brown rust pustules' },
    { id: 'mosaic_mottle', labelSw: 'Madoa ya kijani kibichi na njano (batobato)', labelEn: 'Mottle/mosaic green and yellow patterns' },
    { id: 'halo_spots', labelSw: 'Madoa yenye mduara wa njano (halo)', labelEn: 'Dark spots surrounded by a yellow halo' }
  ],
  cassava: [
    { id: 'leaf_distortion', labelSw: 'Majani yaliyopinda na batobato ya njano', labelEn: 'Distorted leaves with yellow mosaic' },
    { id: 'brown_streak_stem', labelSw: 'Michirizi ya kahawia kwenye shina na mizizi iliyooza', labelEn: 'Brown streaks on stem and necrotic roots' },
    { id: 'whitefly_swarm', labelSw: 'Makundi ya inzi weupe chini ya majani', labelEn: 'Whitefly swarms under leaves' }
  ],
  coffee: [
    { id: 'dark_berries', labelSw: 'Mabuni ya kahawa kuwa meusi na kuoza', labelEn: 'Coffee berries turning black and rotting' },
    { id: 'orange_dust', labelSw: 'Unga wa rangi ya machungwa chini ya majani', labelEn: 'Orange powdery spots on leaf undersides' }
  ],
  rice: [
    { id: 'diamond_spots', labelSw: 'Madoa yenye umbo la almasi (kijivu katikati)', labelEn: 'Diamond-shaped spots with gray centers' },
    { id: 'leaf_drying', labelSw: 'Majani kukauka kuanzia pembeni', labelEn: 'Leaf margins drying out (wavy blight)' },
    { id: 'yellow_mottle_rice', labelSw: 'Majani kuwa ya njano na mmea kudumaa', labelEn: 'Yellow mottling and stunted growth' }
  ],
  sorghum: [
    { id: 'red_leaf_spots', labelSw: 'Madoa makubwa mekundu kwenye majani', labelEn: 'Large elongated red spots on leaves' },
    { id: 'sweet_sap_head', labelSw: 'Maji matamu ya kunata yanatoka kwenye masuke', labelEn: 'Sticky sweet exudate from seed heads' }
  ],
  sunflower: [
    { id: 'black_leaf_blight', labelSw: 'Madoa meusi yanayoenea kwenye majani na shina', labelEn: 'Black lesions spreading on leaves and stems' },
    { id: 'yellow_rust_flower', labelSw: 'Madoa ya njano/kahawia ya kutu majanini', labelEn: 'Yellow-brown rust spots on leaves' }
  ],
  cabbage: [
    { id: 'v_shaped_yellow', labelSw: 'Madoa ya njano yenye umbo la V ukingoni', labelEn: 'V-shaped yellow lesions on leaf margins' },
    { id: 'swollen_roots', labelSw: 'Mizizi kufura kama viriba/vilabu', labelEn: 'Swollen club-like roots and wilting' }
  ],
  chili: [
    { id: 'white_powder_leaf', labelSw: 'Unga mweupe juu ya majani', labelEn: 'White powdery coating on leaves' },
    { id: 'sunken_spots_fruit', labelSw: 'Madoa yaliyobonyea na kuoza kwenye pilipili', labelEn: 'Sunken water-soaked lesions on fruits' }
  ]
};

// Database of regional risk weight modifiers in Tanzania
// Risk weight is added to disease confidence if the farmer is in that region.
const REGIONAL_RISK_FACTORS: Record<string, Record<string, number>> = {
  'Southern Highlands': {
    'Maize Lethal Necrosis': 0.35,
    'Coffee Leaf Rust': 0.25,
    'Potato Late Blight': 0.30,
    'Grey Leaf Spot': 0.25,
    'Black Rot': 0.20
  },
  'Northern Highlands': {
    'Maize Streak Virus': 0.35,
    'Coffee Berry Disease': 0.35,
    'Bean Rust': 0.30,
    'Sorghum Ergot': 0.20
  },
  'Lake Zone': {
    'Cassava Mosaic Disease': 0.40,
    'Rice Yellow Mottle Virus': 0.30,
    'Fusarium Wilt': 0.25,
    'Bean Common Mosaic Virus': 0.20
  },
  'Coastal / Eastern': {
    'Rice Blast': 0.35,
    'Tomato Yellow Leaf Curl': 0.35,
    'Cassava Brown Streak Disease': 0.35,
    'Early Blight': 0.20,
    'Anthracnose': 0.20
  },
  'Central Zone': {
    'Maize Streak Virus': 0.20,
    'Alternaria Leaf Blight': 0.30,
    'Powdery Mildew': 0.25,
    'Sorghum Anthracnose': 0.25
  }
};

// Tanzanian farming regions mapped to risk zones
export const REGIONS_LIST = [
  { label: 'Mbeya (Southern Highlands)', zone: 'Southern Highlands' },
  { label: 'Iringa (Southern Highlands)', zone: 'Southern Highlands' },
  { label: 'Arusha (Northern Highlands)', zone: 'Northern Highlands' },
  { label: 'Kilimanjaro (Northern Highlands)', zone: 'Northern Highlands' },
  { label: 'Mwanza (Lake Zone)', zone: 'Lake Zone' },
  { label: 'Shinyanga (Lake Zone)', zone: 'Lake Zone' },
  { label: 'Morogoro (Coastal / Eastern)', zone: 'Coastal / Eastern' },
  { label: 'Tanga (Coastal / Eastern)', zone: 'Coastal / Eastern' },
  { label: 'Dodoma (Central Zone)', zone: 'Central Zone' },
  { label: 'Singida (Central Zone)', zone: 'Central Zone' }
];

export function getRegionZone(regionName: string): string {
  const norm = regionName.toLowerCase();
  const found = REGIONS_LIST.find(r => norm.includes(r.label.split(' ')[0].toLowerCase()));
  return found ? found.zone : 'Central Zone'; // default fallback
}

/**
 * Diagnostic logic for Symptom Checklist.
 * Takes the selected crop, user's region, and checked symptoms IDs.
 * Returns sorted array of matching diseases.
 */
export function solveSymptomChecklist(
  cropKey: string,
  regionName: string,
  selectedSymptomIds: string[]
): DiseaseResult[] {
  const zone = getRegionZone(regionName);
  const regionRisks = REGIONAL_RISK_FACTORS[zone] || {};
  
  const matches: DiseaseResult[] = [];

  // 1. Diagnose based on crop
  if (cropKey === 'maize') {
    // Maize Streak Virus
    let msvScore = 0.1;
    if (selectedSymptomIds.includes('yellow_veins')) msvScore += 0.5;
    if (selectedSymptomIds.includes('wilted_stunted')) msvScore += 0.15;
    msvScore += (regionRisks['Maize Streak Virus'] || 0);

    // Maize Lethal Necrosis
    let mlnScore = 0.1;
    if (selectedSymptomIds.includes('wilted_stunted')) mlnScore += 0.5;
    if (selectedSymptomIds.includes('yellow_veins')) mlnScore += 0.25;
    mlnScore += (regionRisks['Maize Lethal Necrosis'] || 0);

    // Common Rust
    let rustScore = 0.1;
    if (selectedSymptomIds.includes('powder_rust')) rustScore += 0.7;
    
    matches.push({
      diseaseNameSw: 'Virusi vya Mnyauko wa Mahindi (MSV)',
      diseaseNameEn: 'Maize Streak Virus (MSV)',
      confidence: Math.min(98, Math.round(msvScore * 100)),
      organicControlSw: 'Ng\'oa mimea iliyoambukizwa mapema na uhakikishe mzunguko wa mazao ya legume.',
      organicControlEn: 'Uproot infected plants early, and practice crop rotation with legumes.',
      chemicalControlSw: 'Dhibiti leafhoppers wanaosambaza virusi kwa kunyunyizia Imidacloprid. Wasiliana na Afisa Ugani kwa dozi sahihi.',
      chemicalControlEn: 'Control the leafhoppers that transmit the virus by spraying Imidacloprid. Consult Agronomist for exact dosage.',
      videoUrl: 'q2KlyV45xZg',
      videoId: 'v1'
    });

    matches.push({
      diseaseNameSw: 'Ugonjwa hatari wa Mnyauko wa Mahindi (MLN)',
      diseaseNameEn: 'Maize Lethal Necrosis (MLN)',
      confidence: Math.min(98, Math.round(mlnScore * 100)),
      organicControlSw: 'Choma mabaki yote ya mazao shambani, na kuzuia kupanda mahindi misimu miwili mfululizo.',
      organicControlEn: 'Burn all crop residues in the field, and avoid planting maize for two consecutive seasons.',
      chemicalControlSw: 'Nyunyizia viuatilifu vya kudhibiti wadudu wasambazaji (thrips/beetles) kama Lambdacyhalothrin. Wasiliana na Afisa Ugani kwa dozi sahihi.',
      chemicalControlEn: 'Spray insecticides to control vectors (thrips/beetles) like Lambdacyhalothrin. Consult Agronomist for exact dosage.',
      videoUrl: 'q2KlyV45xZg',
      videoId: 'v1'
    });
  } 
  else if (cropKey === 'tomatoes') {
    // TYLCV
    let tylcvScore = 0.1;
    if (selectedSymptomIds.includes('leaf_curling')) tylcvScore += 0.55;
    if (selectedSymptomIds.includes('wilted_stem')) tylcvScore += 0.1;
    tylcvScore += (regionRisks['Tomato Yellow Leaf Curl'] || 0);

    // Early Blight
    let blightScore = 0.1;
    if (selectedSymptomIds.includes('concentric_spots')) blightScore += 0.6;
    blightScore += (regionRisks['Early Blight'] || 0);

    matches.push({
      diseaseNameSw: 'Mnyauko wa Kujikunja kwa Majani (TYLCV)',
      diseaseNameEn: 'Tomato Yellow Leaf Curl Virus (TYLCV)',
      confidence: Math.min(98, Math.round(tylcvScore * 100)),
      organicControlSw: 'Tumia nyavu za kuzuia wadudu (insect nets) kwenye kitalu, na nyunyizia neem extract.',
      organicControlEn: 'Use insect nets in nursery beds, and spray neem leaf extract as a natural repellent.',
      chemicalControlSw: 'Nyunyizia Acetamiprid ili kuua inzi weupe (whiteflies) wanaoeneza ugonjwa. Wasiliana na Afisa Ugani kwa dozi sahihi.',
      chemicalControlEn: 'Spray Acetamiprid to eliminate whiteflies carrying the virus. Consult Agronomist for exact dosage.',
      videoUrl: 'eH6lI_g3FfI',
      videoId: 'v5'
    });

    matches.push({
      diseaseNameSw: 'Baka la Mapema (Early Blight)',
      diseaseNameEn: 'Early Blight (Alternaria solani)',
      confidence: Math.min(98, Math.round(blightScore * 100)),
      organicControlSw: 'Punguza matawi ya chini ili kuzuia maji ya udongo kurukia majani, fanya mulching.',
      organicControlEn: 'Prune lower branches to prevent soil splashing onto leaves, and apply organic mulch.',
      chemicalControlSw: 'Nyunyizia dawa ya kukinga ukungu kama Mancozeb au Copper Oxychloride. Wasiliana na Afisa Ugani kwa dozi sahihi.',
      chemicalControlEn: 'Apply protective fungicides like Mancozeb or Copper Oxychloride. Consult Agronomist for exact dosage.',
      videoUrl: 'eH6lI_g3FfI',
      videoId: 'v5'
    });
  } 
  else if (cropKey === 'beans') {
    let rustScore = 0.1;
    if (selectedSymptomIds.includes('rust_dots')) rustScore += 0.6;
    rustScore += (regionRisks['Bean Rust'] || 0);

    matches.push({
      diseaseNameSw: 'Kutu ya Maharage',
      diseaseNameEn: 'Bean Rust',
      confidence: Math.min(98, Math.round(rustScore * 100)),
      organicControlSw: 'Fanya usafi shambani, ng\'oa na kuchoma majani yenye kutu, epuka nafasi finyu.',
      organicControlEn: 'Practice good farm sanitation, uproot and burn rusty leaves, and ensure wide spacing.',
      chemicalControlSw: 'Tumia Mancozeb au Propiconazole kuzuia kuenea kwa ukungu wa kutu. Wasiliana na Afisa Ugani kwa dozi sahihi.',
      chemicalControlEn: 'Apply Mancozeb or Propiconazole to halt the spread of rust spores. Consult Agronomist for exact dosage.',
    });
  }
  else if (cropKey === 'cassava') {
    let cmdScore = 0.1;
    if (selectedSymptomIds.includes('leaf_distortion')) cmdScore += 0.55;
    if (selectedSymptomIds.includes('whitefly_swarm')) cmdScore += 0.2;
    cmdScore += (regionRisks['Cassava Mosaic Disease'] || 0);

    matches.push({
      diseaseNameSw: 'Ugonjwa wa Batobato la Muhogo (CMD)',
      diseaseNameEn: 'Cassava Mosaic Disease (CMD)',
      confidence: Math.min(98, Math.round(cmdScore * 100)),
      organicControlSw: 'Tumia mbegu/vikonyo vilivyothibitishwa kuwa safi (certified cuttings) na ng\'oa mimea yenye dalili mapema.',
      organicControlEn: 'Use certified CMD-free clean stem cuttings, and rogue out diseased plants immediately.',
      chemicalControlSw: 'Hakuna tiba ya kemikali kwa virusi. Dhibiti wadudu wasambazaji (whiteflies) kwa sabuni ya kilimo au viuatilifu vya kimfumo. Wasiliana na Afisa Ugani kwa dozi.',
      chemicalControlEn: 'No chemical treatment for the virus itself. Control whitefly vectors using systemic insecticides. Consult Agronomist.',
    });
  }
  else if (cropKey === 'rice') {
    let blastScore = 0.1;
    if (selectedSymptomIds.includes('diamond_spots')) blastScore += 0.6;
    blastScore += (regionRisks['Rice Blast'] || 0);

    matches.push({
      diseaseNameSw: 'Ukungu wa Mpunga (Rice Blast)',
      diseaseNameEn: 'Rice Blast (Pyricularia oryzae)',
      confidence: Math.min(98, Math.round(blastScore * 100)),
      organicControlSw: 'Epuka mbolea ya ziada ya Nitrojeni, choma majani makavu ya msimu uliopita shambani.',
      organicControlEn: 'Avoid excessive nitrogen fertilization, and burn straw residues from the previous harvest.',
      chemicalControlSw: 'Nyunyizia Tricyclazole 75WP au Isoprothiolane. Wasiliana na Afisa Ugani kwa dozi sahihi.',
      chemicalControlEn: 'Spray Tricyclazole 75WP or Isoprothiolane. Consult Agronomist for exact dosage.',
      videoId: 'v2'
    });
  }
  else {
    // Generic fallback mapping for remaining crops (Coffee, Sorghum, Sunflower, Cabbage, Chili)
    let score = selectedSymptomIds.length > 0 ? 0.65 : 0.2;
    matches.push({
      diseaseNameSw: `Ugonjwa wa Uyoga/Ukungu kwenye ${cropKey}`,
      diseaseNameEn: `Fungal/Pathogenic Infection in ${cropKey}`,
      confidence: Math.round(score * 100),
      organicControlSw: 'Punguza unyevu shambani, hakikisha mzunguko mzuri wa hewa, na piga mulch ya kikaboni.',
      organicControlEn: 'Reduce field humidity, ensure good aeration spacing, and apply organic mulch.',
      chemicalControlSw: 'Nyunyizia dawa ya kukinga ukungu (Mancozeb) au shaba ya kilimo (Copper). Wasiliana na Afisa Ugani kwa dozi sahihi.',
      chemicalControlEn: 'Spray protective fungicide (Mancozeb) or agricultural copper. Consult Agronomist for exact dosage.'
    });
  }

  // Sort by confidence high to low
  matches.sort((a, b) => b.confidence - a.confidence);

  // Return only entries with at least 15% confidence
  return matches.filter(m => m.confidence >= 15);
}
