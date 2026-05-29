/**
 * Crop Library — Creative Redesign v2
 * Rich crop detail: hero image · stats bento · pH visualization ·
 * disease risks · daily tips · AI guide · weather suitability
 */
import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  Image, Modal, ActivityIndicator, Dimensions, SafeAreaView,
  StatusBar,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  ChevronLeft, Leaf, Droplets, Sun, TrendingUp, Clock,
  Sparkles, BookOpen, Zap, BarChart3, MapPin, Users,
  AlertTriangle, Lightbulb, ArrowRight, Check, Calendar,
  ChevronRight, Target,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useTheme } from '../constants/Theme';
import { useKilimoStore } from '../store/useKilimoStore';
import { chat, aiConfigured } from '../lib/ai';
import { useWeather } from '../hooks/useWeather';

const { width: SW } = Dimensions.get('window');
const PRIMARY = '#22d15a';
const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000 ? `${(n / 1_000).toFixed(0)}k`
  : String(n);

// ─── Rich Crop Data ───────────────────────────────────────────────────────────
const CROPS = [
  {
    id: 'maize', nameEn: 'Maize', nameSw: 'Mahindi', category: 'staple',
    // Golden corn ears / maize close-up — no people
    img: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=800',
    duration: 'Miezi 3–4', harvestDays: 105, difficulty: 'Kati', profit: 'Kati', profitScore: 2,
    water: 'Wastani', sun: 'Jua Kamili',
    desc: 'Zao kuu la chakula Tanzania. Hustawi maeneo mengi yenye mvua za kutosha.',
    ph: '5.8–7.0', phMid: 6.4, yieldKgAcre: 2500, marketPricePerKg: 420,
    spacing: '75 × 25 cm', fertilizer: 'DAP + CAN', fertStatus: 'Balanced',
    season: 'Masika (Mar–Jun) · Vuli (Oct–Dec)',
    regions: 'Dodoma · Mbeya · Morogoro · Arusha',
    workers: '3–5 / ekari', tempMin: 18, tempMax: 30,
    diseases: [
      { name: 'Blight ya Majani', severity: 'high' },
      { name: 'Funza wa Nguruwe (Fall Armyworm)', severity: 'medium' },
      { name: 'Uozo wa Shina', severity: 'low' },
    ],
    tips: [
      'Panda mbegu zilizotibiwa (treated seeds) kupunguza magonjwa ya udongo.',
      'Mwagilia kwa kiasi kwenye awamu ya maua — muhimu sana kwa mavuno.',
      'Weka mbolea ya CAN siku 30 baada ya kupanda kwa ukuaji bora.',
    ],
  },
  {
    id: 'rice', nameEn: 'Rice', nameSw: 'Mpunga', category: 'staple',
    // Lush green rice paddy field — no people
    img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=800',
    duration: 'Miezi 4–5', harvestDays: 140, difficulty: 'Nguvu', profit: 'Juu', profitScore: 3,
    water: 'Mingi Sana', sun: 'Jua Kamili',
    desc: 'Hulimwa sana mabondeni Mbeya, Morogoro, na Shinyanga. Hulipa sana kibiashara.',
    ph: '5.5–6.5', phMid: 6.0, yieldKgAcre: 3200, marketPricePerKg: 1200,
    spacing: '20 × 20 cm', fertilizer: 'Urea + TSP', fertStatus: 'Mingi',
    season: 'Masika (Feb–Jun) · Msimu Mkuu (Jul–Nov)',
    regions: 'Mbeya · Morogoro · Shinyanga · Mwanza',
    workers: '5–8 / ekari', tempMin: 22, tempMax: 35,
    diseases: [
      { name: 'Rice Blast (Ugonjwa wa Majani)', severity: 'high' },
      { name: 'Brown Plant Hopper', severity: 'high' },
      { name: 'Bacterial Leaf Blight', severity: 'medium' },
    ],
    tips: [
      'Umwagiliaji wa mfumo wa mabonde (flooded paddies) husaidia kudhibiti magugu.',
      'Tumia mbegu bora kama SARO 5 au IR 64 zilizorekebishwa Tanzania.',
      'Dhibiti maji shambani — usiache kupata maji mengi sana baada ya maua.',
    ],
  },
  {
    id: 'beans', nameEn: 'Beans', nameSw: 'Maharage', category: 'staple',
    // Green bean pods hanging on plant — no people
    img: 'https://images.unsplash.com/photo-1559181567-c3190ca9d062?auto=format&fit=crop&q=80&w=800',
    duration: 'Siku 60–90', harvestDays: 75, difficulty: 'Rahisi', profit: 'Kati', profitScore: 2,
    water: 'Wastani', sun: 'Jua Kamili',
    desc: 'Hulimwa sana nyanda za juu. Husaidia kurudisha nitrojeni kwenye udongo.',
    ph: '6.0–7.0', phMid: 6.5, yieldKgAcre: 1200, marketPricePerKg: 1800,
    spacing: '45 × 10 cm', fertilizer: 'DAP + Rhizobium', fertStatus: 'Haba',
    season: 'Masika (Mar–Jun) · Vuli (Oct–Jan)',
    regions: 'Kilimanjaro · Arusha · Iringa · Njombe',
    workers: '2–3 / ekari', tempMin: 15, tempMax: 26,
    diseases: [
      { name: 'Bean Rust (Kutu)', severity: 'high' },
      { name: 'Angular Leaf Spot', severity: 'medium' },
      { name: 'Root Rot', severity: 'low' },
    ],
    tips: [
      'Zingatia mzunguko wa mazao — usipande maharage shambani moja mara nyingi.',
      'Panda sambamba na mihogo au mahindi kwa matumizi bora ya ardhi.',
      'Vuna ukiwa baridi asubuhi ili kupunguza upotevu baada ya kuvuna.',
    ],
  },
  {
    id: 'cassava', nameEn: 'Cassava', nameSw: 'Muhogo', category: 'staple',
    // Cassava roots / tapioca plant — no people
    img: 'https://images.unsplash.com/photo-1627494360338-67c40e45f9e2?auto=format&fit=crop&q=80&w=800',
    duration: 'Miezi 9–12', harvestDays: 300, difficulty: 'Rahisi', profit: 'Kati', profitScore: 2,
    water: 'Kidogo', sun: 'Jua Kamili',
    desc: 'Zao linalostahimili ukame. Hulimwa kanda ya ziwa, Pwani na Kusini.',
    ph: '5.5–6.5', phMid: 6.0, yieldKgAcre: 8000, marketPricePerKg: 180,
    spacing: '1.0 × 1.0 m', fertilizer: 'Samadi', fertStatus: 'Haba',
    season: 'Kipindi chochote — ustahimilivu wa juu',
    regions: 'Pwani · Kanda ya Ziwa · Lindi · Mtwara',
    workers: '2–4 / ekari', tempMin: 20, tempMax: 35,
    diseases: [
      { name: 'Cassava Mosaic Virus', severity: 'high' },
      { name: 'Cassava Brown Streak', severity: 'high' },
      { name: 'Mealybug (Utitiri)', severity: 'medium' },
    ],
    tips: [
      'Tumia vipande (cuttings) visivyo na magonjwa — chanzo bora ni vituo vya kilimo.',
      'Panda mwanzoni mwa mvua kwa ukuaji bora wa mizizi.',
      'Usivune mapema — subiri miezi 9–12 kwa ubora wa juu wa wanga.',
    ],
  },
  {
    id: 'cashew', nameEn: 'Cashew Nuts', nameSw: 'Korosho', category: 'cash',
    // Ripe cashew apple with nut on tree — no people
    img: 'https://images.unsplash.com/photo-1574856344991-aaa31b6f4f85?auto=format&fit=crop&q=80&w=800',
    duration: 'Miaka 3+', harvestDays: 1095, difficulty: 'Kati', profit: 'Juu Sana', profitScore: 4,
    water: 'Kidogo', sun: 'Jua Kamili',
    desc: 'Zao la utajiri Kusini mwa Tanzania (Mtwara, Lindi). Soko kubwa nje ya nchi.',
    ph: '6.0–6.5', phMid: 6.25, yieldKgAcre: 450, marketPricePerKg: 5800,
    spacing: '10 × 10 m', fertilizer: 'DAP + Potassium', fertStatus: 'Wastani',
    season: 'Vuli (Septemba–Desemba)',
    regions: 'Mtwara · Lindi · Masasi · Newala',
    workers: '4–6 / ekari (wakati wa kuvuna)', tempMin: 24, tempMax: 38,
    diseases: [
      { name: 'Anthracnose', severity: 'high' },
      { name: 'Powdery Mildew', severity: 'medium' },
      { name: 'Stem Canker', severity: 'low' },
    ],
    tips: [
      'Kata matawi (pruning) kila mwaka wa kwanza hadi wa tatu kuimarisha muundo.',
      'Piga dawa (Copper fungicide) kabla ya msimu wa mvua kupunguza anthracnose.',
      'Vuna korosho zilizoanguka chini — ubora wake ni wa juu zaidi.',
    ],
  },
  {
    id: 'coffee', nameEn: 'Coffee', nameSw: 'Kahawa', category: 'cash',
    // Red coffee cherries on branch — classic shot, no people
    img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800',
    duration: 'Miaka 3–5', harvestDays: 1460, difficulty: 'Nguvu', profit: 'Juu', profitScore: 3,
    water: 'Mingi', sun: 'Kivuli',
    desc: 'Zao kuu la biashara (Arabica kaskazini/kusini, Robusta Kagera). Soko la dunia.',
    ph: '6.0–6.5', phMid: 6.25, yieldKgAcre: 600, marketPricePerKg: 8500,
    spacing: '3 × 3 m', fertilizer: 'NPK + Samadi', fertStatus: 'Juu',
    season: 'Masika (Mar–Jun harvest) · Vuli (Oct–Jan harvest)',
    regions: 'Kilimanjaro · Arusha · Kagera · Mbeya',
    workers: '6–10 / ekari (harvesting)', tempMin: 15, tempMax: 25,
    diseases: [
      { name: 'Coffee Berry Borer', severity: 'high' },
      { name: 'Coffee Leaf Rust', severity: 'high' },
      { name: 'Antestia Bug', severity: 'medium' },
    ],
    tips: [
      'Tumia kivuli cha miti (shade trees) — Grevillea au Leucaena ni bora Tanzania.',
      'Vuna tu matunda mekundu-makomaa kwa ubora wa juu (selective picking).',
      'Tumia njia ya kuosha (wet processing) kwa kahawa ya daraja la kwanza (AA).',
    ],
  },
  {
    id: 'sunflower', nameEn: 'Sunflower', nameSw: 'Alizeti', category: 'cash',
    // Bright sunflower field in full bloom — no people
    img: 'https://images.unsplash.com/photo-1490750967868-88df5691cc0e?auto=format&fit=crop&q=80&w=800',
    duration: 'Siku 90–120', harvestDays: 105, difficulty: 'Rahisi', profit: 'Kati', profitScore: 2,
    water: 'Kidogo', sun: 'Jua Kamili',
    desc: 'Hustahimili ukame. Hustawi Dodoma na Singida kwa uzalishaji wa mafuta.',
    ph: '6.0–7.5', phMid: 6.75, yieldKgAcre: 900, marketPricePerKg: 950,
    spacing: '75 × 30 cm', fertilizer: 'DAP (kupanda) + CAN', fertStatus: 'Wastani',
    season: 'Masika (Mar–Jun) · Vuli (Oct–Jan)',
    regions: 'Dodoma · Singida · Tabora · Shinyanga',
    workers: '2–3 / ekari', tempMin: 20, tempMax: 32,
    diseases: [
      { name: 'Sclerotinia Stem Rot', severity: 'high' },
      { name: 'Downy Mildew', severity: 'medium' },
      { name: 'Aphids (Vidukari)', severity: 'low' },
    ],
    tips: [
      'Panda mbegu bora kama Sunco au Record — toa wastani wa kg 5–7/ekari.',
      'Usiruhusu magugu mwezi wa kwanza — yanashindana kwa maji na virutubisho.',
      'Vuna unapona rangi ya majani ya nyuma (bracts) inageuka njano-kahawia.',
    ],
  },
  {
    id: 'tomato', nameEn: 'Tomatoes', nameSw: 'Nyanya', category: 'horticulture',
    // Ripe red tomatoes on the vine — no people
    img: 'https://images.unsplash.com/photo-1546470427-f5b4dd577b86?auto=format&fit=crop&q=80&w=800',
    duration: 'Miezi 2–3', harvestDays: 80, difficulty: 'Nguvu', profit: 'Juu', profitScore: 3,
    water: 'Mingi', sun: 'Jua Kamili',
    desc: 'Zao la biashara la haraka. Linahitaji matunzo na dawa za kuzuia magonjwa.',
    ph: '6.0–6.8', phMid: 6.4, yieldKgAcre: 15000, marketPricePerKg: 380,
    spacing: '60 × 45 cm', fertilizer: 'DAP + Urea + K', fertStatus: 'Juu',
    season: 'Masika na Kipindi cha Baridi (Jun–Sep ni bora)',
    regions: 'Kilimanjaro · Arusha · Moshi · Morogoro',
    workers: '6–8 / ekari', tempMin: 18, tempMax: 28,
    diseases: [
      { name: 'Early Blight (Alternaria)', severity: 'high' },
      { name: 'Late Blight (Phytophthora)', severity: 'high' },
      { name: 'Bacterial Wilt', severity: 'high' },
      { name: 'Tomato Yellow Leaf Curl Virus', severity: 'medium' },
    ],
    tips: [
      'Tumia mbegu za F1 hybrid (kama Tengeru 97) kwa mavuno mazuri Tanzania.',
      'Anza kwenye kitalu (nursery) kwa wiki 3–4 kabla ya kupanda shambani.',
      'Weka staking (vigingi) na kufunga — huzuia magonjwa ya udongo.',
    ],
  },
  {
    id: 'onion', nameEn: 'Onions', nameSw: 'Vitunguu', category: 'horticulture',
    // Raw white onions with roots, overhead view — no people
    img: 'https://images.unsplash.com/photo-1518977876801-8c2b56d2b4d7?auto=format&fit=crop&q=80&w=800',
    duration: 'Miezi 3–4', harvestDays: 110, difficulty: 'Kati', profit: 'Juu Sana', profitScore: 4,
    water: 'Wastani', sun: 'Jua Kamili',
    desc: "Vitunguu vya Singida na Mang'ola vina soko kubwa Afrika Mashariki.",
    ph: '6.0–7.0', phMid: 6.5, yieldKgAcre: 12000, marketPricePerKg: 550,
    spacing: '30 × 10 cm', fertilizer: 'DAP + Sulphate of Potash', fertStatus: 'Wastani',
    season: 'Kipindi kame (Jun–Sep ni bora — ukaushi rahisi)',
    regions: "Singida · Iringa · Mang'ola · Arumeru",
    workers: '4–6 / ekari', tempMin: 16, tempMax: 30,
    diseases: [
      { name: 'Purple Blotch (Alternaria)', severity: 'high' },
      { name: 'Downy Mildew', severity: 'high' },
      { name: 'Neck Rot (baada ya kuvuna)', severity: 'medium' },
    ],
    tips: [
      "Anza vitalu (nursery) kwa mbegu bora kama Red Creole au Mang'ola Red.",
      'Acha mwagiliaji wiki 2 kabla ya kuvuna — inaimarisha ukoko (curing).',
      'Hifadhi sehemu kavu yenye hewa nzuri — vitunguu vya Singida huhifadhiwa miezi 4+.',
    ],
  },
  {
    id: 'avocado', nameEn: 'Avocado', nameSw: 'Parachichi', category: 'horticulture',
    // Avocados hanging on tree branch — no people
    img: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&q=80&w=800',
    duration: 'Miaka 3+', harvestDays: 1095, difficulty: 'Kati', profit: 'Juu Sana', profitScore: 4,
    water: 'Wastani', sun: 'Jua Kamili',
    desc: 'Dhahabu ya kijani Njombe na Mbeya. Soko lake linakua kimataifa (Hass variety).',
    ph: '6.0–6.5', phMid: 6.25, yieldKgAcre: 3500, marketPricePerKg: 1200,
    spacing: '8 × 8 m', fertilizer: 'NPK 14:14:14 + Zinc', fertStatus: 'Wastani',
    season: 'Kipindi cha baridi (Jul–Oct harvest)',
    regions: 'Njombe · Mbeya · Mbinga · Kilosa',
    workers: '3–5 / ekari (harvesting)', tempMin: 16, tempMax: 28,
    diseases: [
      { name: 'Phytophthora Root Rot', severity: 'high' },
      { name: 'Anthracnose (baada ya kuvuna)', severity: 'high' },
      { name: 'Avocado Sunblotch Viroid', severity: 'medium' },
    ],
    tips: [
      'Panda mche wa Hass ulioingizwa kwenye Fuerte (grafted) kwa ubora wa kimataifa.',
      'Hakikisha mifereji ya maji mizuri — parachichi haivumilii maji yaliyosimama.',
      'Vuna Hass wakati wa ngozi inapoanza kuwa kijani-giza, sio baada ya kuiva.',
    ],
  },
  {
    id: 'cloves', nameEn: 'Cloves', nameSw: 'Karafuu', category: 'horticulture',
    // Dried cloves spice close-up — no people
    img: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=800',
    duration: 'Miaka 5+', harvestDays: 1825, difficulty: 'Kati', profit: 'Juu Sana', profitScore: 4,
    water: 'Mingi', sun: 'Jua Kamili',
    desc: 'Zao maarufu la Zanzibar na Pemba. Hutumika kama kiungo duniani kote.',
    ph: '5.5–6.5', phMid: 6.0, yieldKgAcre: 350, marketPricePerKg: 15000,
    spacing: '9 × 9 m', fertilizer: 'Organic (samadi ya ng\'ombe)', fertStatus: 'Haba',
    season: 'Kuvunwa mwaka mzima, kilele Jul–Oct',
    regions: 'Zanzibar · Pemba · Tanga',
    workers: '5–8 / ekari (wakati wa kuvuna)', tempMin: 22, tempMax: 35,
    diseases: [
      { name: 'Sudden Death Syndrome (SDW)', severity: 'high' },
      { name: 'Leaf Spot (Phyllosticta)', severity: 'medium' },
      { name: 'Mealybug', severity: 'low' },
    ],
    tips: [
      'Vuna maua kabla hayajakomaa (bud stage) — hupunguza ubora endapo utabaki.',
      'Kausha muda wa siku 4–5 juani, ukigeuza mara kwa mara.',
      'Hifadhi kwenye vyombo visivyopitisha hewa baada ya kukaushwa vizuri.',
    ],
  },
];

const CATEGORIES = [
  { id: 'all',          titleSw: 'Yote',      titleEn: 'All',          color: PRIMARY },
  { id: 'staple',       titleSw: 'Nafaka',    titleEn: 'Staple',       color: '#f59e0b' },
  { id: 'cash',         titleSw: 'Biashara',  titleEn: 'Cash',         color: '#3b82f6' },
  { id: 'horticulture', titleSw: 'Bustani',   titleEn: 'Horticulture', color: '#a855f7' },
];

const PROFIT_COLOR: Record<string, string> = {
  'Chini': '#64748b', 'Kati': '#f59e0b', 'Juu': PRIMARY, 'Juu Sana': PRIMARY,
};
const DIFF_COLOR: Record<string, string> = {
  'Rahisi': PRIMARY, 'Kati': '#f59e0b', 'Nguvu': '#ef4444',
};
const SEV_COLOR: Record<string, string> = {
  high: '#ef4444', medium: '#f59e0b', low: '#22d15a',
};

type Crop = typeof CROPS[0];

// ─── Mini profit dots ─────────────────────────────────────────────────────────
function ProfitDots({ score, isDark }: { score: number; isDark: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={{
          width: 6, height: 6, borderRadius: 3,
          backgroundColor: i <= score ? PRIMARY : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'),
        }} />
      ))}
    </View>
  );
}

// ─── pH gradient bar ──────────────────────────────────────────────────────────
function PHBar({ ph, phMid }: { ph: string; phMid: number }) {
  const pct = ((phMid - 4) / 10) * 100;
  const safe = Math.max(2, Math.min(96, pct));
  const label = phMid < 6.5 ? 'Tindikali' : phMid > 7.5 ? 'Alkali' : 'Wastani';
  const labelColor = phMid < 6.5 ? '#f59e0b' : phMid > 7.5 ? '#3b82f6' : PRIMARY;
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 10, color: '#9CA3AF' }}>Tindikali (4)</Text>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 10, color: labelColor }}>{label} · pH {phMid.toFixed(1)}</Text>
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 10, color: '#9CA3AF' }}>Alkali (9)</Text>
      </View>
      <View style={{ height: 8, borderRadius: 4, overflow: 'hidden' }}>
        <LinearGradient
          colors={['#ef4444', '#f59e0b', '#22d15a', '#3b82f6']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </View>
      {/* marker overlay — separate view so it doesn't clip */}
      <View style={{ height: 12, marginTop: -10 }}>
        <View style={{
          position: 'absolute', left: `${safe}%` as any,
          width: 12, height: 12, borderRadius: 6,
          backgroundColor: '#fff', borderWidth: 2.5, borderColor: labelColor,
          marginLeft: -6,
        }} />
      </View>
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
        Range: pH {ph}
      </Text>
    </View>
  );
}

// ─── Weather suitability chip ─────────────────────────────────────────────────
function WeatherChip({ crop }: { crop: Crop }) {
  const { current } = useWeather();
  if (!current) return null;
  const temp = (current as any).main?.temp ?? (current as any).temp ?? 0;
  const suitable = temp >= crop.tempMin && temp <= crop.tempMax;
  return (
    <View style={[D.weatherChip, {
      backgroundColor: suitable ? `${PRIMARY}18` : '#f59e0b18',
      borderColor: suitable ? `${PRIMARY}40` : '#f59e0b40',
    }]}>
      {suitable
        ? <Check size={11} color={PRIMARY} />
        : <AlertTriangle size={11} color="#f59e0b" />}
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 10, color: suitable ? PRIMARY : '#f59e0b' }}>
        {Math.round(temp)}°C · {suitable ? 'Inafaa kupanda' : 'Hali tofauti na kawaida'}
      </Text>
    </View>
  );
}

// ─── Disease row ──────────────────────────────────────────────────────────────
function DiseaseRow({ d, language, textColor }: { d: any; language: string; textColor: string }) {
  const color = SEV_COLOR[d.severity] ?? '#9CA3AF';
  const sevLabel =
    d.severity === 'high'   ? (language === 'sw' ? 'Hatari'  : 'High Risk') :
    d.severity === 'medium' ? (language === 'sw' ? 'Wastani' : 'Medium')    :
                              (language === 'sw' ? 'Chini'   : 'Low');
  return (
    <View style={D.diseaseRow}>
      <View style={[D.diseaseDot, { backgroundColor: color }]} />
      <Text style={[D.diseaseName, { flex: 1, color: textColor }]}>{d.name}</Text>
      <View style={[D.diseasePill, { backgroundColor: `${color}18` }]}>
        <Text style={[D.diseasePillText, { color }]}>{sevLabel}</Text>
      </View>
    </View>
  );
}

// ─── Full-screen Crop Detail ───────────────────────────────────────────────────
function CropDetail({
  crop, onClose, colors, isDark, language,
}: {
  crop: Crop; onClose: () => void; colors: any; isDark: boolean; language: string;
}) {
  const [aiText, setAiText]     = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLoaded, setAiLoaded]  = useState(false);
  const router = useRouter();
  const marketValue = Math.round((crop.yieldKgAcre * crop.marketPricePerKg) / 1000) * 1000;
  const subtle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

  const loadAI = async () => {
    if (aiLoaded) return;
    setAiLoading(true);
    try {
      if (aiConfigured()) {
        const res = await chat([{
          role: 'user',
          content: `Nipe mwongozo kamili wa kilimo cha ${crop.nameSw} Tanzania kwa bullet points 6 fupi.`,
        }]);
        setAiText(res);
      } else {
        await new Promise((r) => setTimeout(r, 800));
        setAiText(
          `Mwongozo wa Sankofa AI kwa ${crop.nameSw}:\n\n` +
          `• Maandalizi ya shamba: Andaa shamba mapema, ongeza samadi au mboji.\n` +
          `• Umbali wa kupanda: ${crop.spacing} kwa mwanga na hewa ya kutosha.\n` +
          `• Mbolea: Tumia ${crop.fertilizer} kwa mwongozo wa kituo cha kilimo.\n` +
          `• Udhibiti wa magonjwa: Kagua shamba mara 2/wiki, piga dawa mapema.\n` +
          `• Maji: ${crop.water} — epuka maji yaliyosimama, yanaweza kusababisha kuoza.\n` +
          `• Uvunaji: Vuna mazao yakiwa yamekomaa na hifadhi sehemu kavu na yenye hewa.`
        );
      }
      setAiLoaded(true);
    } catch {
      setAiText('Kuna tatizo la mtandao. Tafadhali jaribu tena.');
    } finally {
      setAiLoading(false);
    }
  };

  const cropName = language === 'sw' ? crop.nameSw : crop.nameEn;
  const catInfo = CATEGORIES.find((c) => c.id === crop.category)!;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} bounces>

        {/* ── Hero ── */}
        <View style={D.heroWrap}>
          <Image source={{ uri: crop.img }} style={D.heroImg} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'transparent', 'rgba(0,0,0,0.88)']}
            locations={[0, 0.22, 0.45, 1]}
            style={StyleSheet.absoluteFill}
          />

          <SafeAreaView style={D.heroTopBar}>
            <TouchableOpacity onPress={onClose} style={D.heroBackBtn} activeOpacity={0.8}>
              <BlurView intensity={55} tint="dark" style={D.heroBackBlur}>
                <ChevronLeft size={20} color="#fff" />
              </BlurView>
            </TouchableOpacity>
            <View style={[D.heroCatBadge, { backgroundColor: `${catInfo.color}d0` }]}>
              <Text style={D.heroCatText}>{language === 'sw' ? catInfo.titleSw : catInfo.titleEn}</Text>
            </View>
          </SafeAreaView>

          <View style={D.heroBottom}>
            {crop.profitScore >= 3 && (
              <View style={D.hotBadge}>
                <Zap size={10} color="#000" />
                <Text style={D.hotText}>HOT</Text>
              </View>
            )}
            <Text style={D.heroName}>{cropName}</Text>
            <Text style={D.heroSub}>{language === 'sw' ? crop.nameEn : crop.nameSw}</Text>
            <WeatherChip crop={crop} />
          </View>
        </View>

        <View style={D.body}>

          {/* ── Stats Bento ── */}
          <Animated.View entering={FadeInDown.delay(60).duration(320)}>
            <View style={[D.bentoBg, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <LinearGradient
                colors={[`${PRIMARY}10`, colors.card]}
                locations={[0, 0.7]}
                style={StyleSheet.absoluteFill}
              />
              <View style={D.bentoRow}>
                <View style={[D.bentoCell, { borderRightColor: colors.border, borderRightWidth: 1 }]}>
                  <Leaf size={13} color={PRIMARY} />
                  <Text style={[D.bentoBig, { color: colors.text }]}>{fmt(crop.yieldKgAcre)}</Text>
                  <Text style={D.bentoUnit}>kg / ekari</Text>
                  <Text style={D.bentoLabel}>{language === 'sw' ? 'Est. Mavuno' : 'Est. Yield'}</Text>
                </View>
                <View style={[D.bentoCell, { borderRightColor: colors.border, borderRightWidth: 1 }]}>
                  <TrendingUp size={13} color="#f59e0b" />
                  <Text style={[D.bentoBig, { color: colors.text }]}>TSh {fmt(marketValue)}</Text>
                  <Text style={D.bentoUnit}>/ ekari</Text>
                  <Text style={D.bentoLabel}>{language === 'sw' ? 'Bei ya Soko' : 'Market Value'}</Text>
                </View>
                <View style={D.bentoCell}>
                  <Clock size={13} color="#0284c7" />
                  <Text style={[D.bentoBig, { color: colors.text }]}>
                    {crop.harvestDays > 365 ? `${(crop.harvestDays / 365).toFixed(0)}y+` : `${crop.harvestDays}`}
                  </Text>
                  <Text style={D.bentoUnit}>{crop.harvestDays > 365 ? 'miaka' : 'siku'}</Text>
                  <Text style={D.bentoLabel}>{language === 'sw' ? 'Hadi Mavuno' : 'To Harvest'}</Text>
                </View>
              </View>
              <View style={[D.priceStrip, { backgroundColor: subtle, borderTopColor: colors.border }]}>
                <BarChart3 size={12} color={PRIMARY} />
                <Text style={[D.priceStripText, { color: colors.textMute }]}>
                  {language === 'sw' ? 'Bei ya soko' : 'Market price'}
                </Text>
                <Text style={[D.priceStripVal, { color: PRIMARY }]}>
                  TSh {new Intl.NumberFormat('en-US').format(crop.marketPricePerKg)} / kg
                </Text>
                <ProfitDots score={crop.profitScore} isDark={isDark} />
              </View>
            </View>
          </Animated.View>

          {/* ── Growing Conditions ── */}
          <Animated.View entering={FadeInDown.delay(100).duration(320)} style={D.section}>
            <View style={D.sectionHeader}>
              <Leaf size={15} color={PRIMARY} />
              <Text style={[D.sectionTitle, { color: colors.text }]}>
                {language === 'sw' ? 'Hali ya Kukua' : 'Growing Conditions'}
              </Text>
            </View>
            <View style={{ gap: 10 }}>
              <View style={[D.condCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={D.condCardHeader}>
                  <Text style={[D.condCardTitle, { color: colors.text }]}>
                    {language === 'sw' ? 'Ubora wa Udongo — pH' : 'Soil Quality — pH'}
                  </Text>
                  <View style={[D.fertChip, { backgroundColor: `${PRIMARY}18` }]}>
                    <Check size={10} color={PRIMARY} />
                    <Text style={[D.fertChipText, { color: PRIMARY }]}>{crop.fertStatus}</Text>
                  </View>
                </View>
                <PHBar ph={crop.ph} phMid={crop.phMid} />
                <View style={[D.condRow, { marginTop: 10, borderTopColor: colors.border, borderTopWidth: 1, paddingTop: 10 }]}>
                  <View style={D.condItem}>
                    <Leaf size={12} color={PRIMARY} />
                    <Text style={[D.condItemText, { color: colors.textMute }]}>{crop.fertilizer}</Text>
                  </View>
                  <View style={D.condItem}>
                    <Target size={12} color="#a855f7" />
                    <Text style={[D.condItemText, { color: colors.textMute }]}>{crop.spacing}</Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={[D.condHalf, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[D.condHalfIcon, { backgroundColor: '#0284c715' }]}>
                    <Droplets size={16} color="#0284c7" />
                  </View>
                  <Text style={[D.condHalfLabel, { color: colors.textMute }]}>
                    {language === 'sw' ? 'Maji' : 'Water'}
                  </Text>
                  <Text style={[D.condHalfVal, { color: colors.text }]}>{crop.water}</Text>
                </View>
                <View style={[D.condHalf, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[D.condHalfIcon, { backgroundColor: '#f9731615' }]}>
                    <Sun size={16} color="#f97316" />
                  </View>
                  <Text style={[D.condHalfLabel, { color: colors.textMute }]}>
                    {language === 'sw' ? 'Jua' : 'Sunlight'}
                  </Text>
                  <Text style={[D.condHalfVal, { color: colors.text }]}>{crop.sun}</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* ── Season & Region ── */}
          <Animated.View entering={FadeInDown.delay(140).duration(320)} style={D.section}>
            <View style={D.sectionHeader}>
              <Calendar size={15} color="#0284c7" />
              <Text style={[D.sectionTitle, { color: colors.text }]}>
                {language === 'sw' ? 'Msimu & Mikoa' : 'Season & Regions'}
              </Text>
            </View>
            <View style={[D.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={D.infoRow}>
                <Calendar size={13} color={PRIMARY} />
                <Text style={[D.infoText, { color: colors.text }]}>{crop.season}</Text>
              </View>
              <View style={[D.infoDivider, { backgroundColor: colors.border }]} />
              <View style={D.infoRow}>
                <MapPin size={13} color="#a855f7" />
                <Text style={[D.infoText, { color: colors.text }]}>{crop.regions}</Text>
              </View>
              <View style={[D.infoDivider, { backgroundColor: colors.border }]} />
              <View style={D.infoRow}>
                <Users size={13} color="#f59e0b" />
                <Text style={[D.infoText, { color: colors.text }]}>{crop.workers}</Text>
                <Text style={[D.infoSub, { color: colors.textMute }]}>
                  {' '}{language === 'sw' ? 'wafanyakazi' : 'workers'}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* ── Disease Risks ── */}
          <Animated.View entering={FadeInDown.delay(180).duration(320)} style={D.section}>
            <View style={D.sectionHeader}>
              <AlertTriangle size={15} color="#ef4444" />
              <Text style={[D.sectionTitle, { color: colors.text }]}>
                {language === 'sw' ? 'Magonjwa ya Hatari' : 'Disease Risks'}
              </Text>
              <View style={[D.riskBadge, { backgroundColor: '#ef444418' }]}>
                <Text style={[D.riskBadgeText, { color: '#ef4444' }]}>{crop.diseases.length}</Text>
              </View>
            </View>
            <View style={[D.diseaseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {crop.diseases.map((d, i) => (
                <React.Fragment key={i}>
                  <DiseaseRow d={d} language={language} textColor={colors.text} />
                  {i < crop.diseases.length - 1 && (
                    <View style={[D.infoDivider, { backgroundColor: colors.border }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </Animated.View>

          {/* ── Daily Tips ── */}
          <Animated.View entering={FadeInDown.delay(220).duration(320)} style={D.section}>
            <View style={D.sectionHeader}>
              <Lightbulb size={15} color="#f59e0b" />
              <Text style={[D.sectionTitle, { color: colors.text }]}>
                {language === 'sw' ? 'Vidokezo vya Kila Siku' : 'Daily Tips'}
              </Text>
              <ArrowRight size={14} color={colors.textMute} />
            </View>
            <View style={{ gap: 8 }}>
              {crop.tips.map((tip, i) => (
                <Animated.View key={i} entering={FadeInDown.delay(230 + i * 30).duration(280)}>
                  <View style={[D.tipRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={[D.tipNum, { backgroundColor: `${PRIMARY}18` }]}>
                      <Text style={[D.tipNumText, { color: PRIMARY }]}>{i + 1}</Text>
                    </View>
                    <Text style={[D.tipText, { color: colors.text }]}>{tip}</Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* ── AI Sankofa Guide ── */}
          <Animated.View entering={FadeInDown.delay(280).duration(320)} style={D.section}>
            <View style={D.sectionHeader}>
              <Sparkles size={15} color={PRIMARY} />
              <Text style={[D.sectionTitle, { color: colors.text }]}>
                {language === 'sw' ? 'Mwongozo wa Sankofa AI' : 'Sankofa AI Guide'}
              </Text>
            </View>
            <View style={[D.aiCard, { backgroundColor: colors.card, borderColor: `${PRIMARY}30` }]}>
              <View style={[D.aiCardAccent, { backgroundColor: PRIMARY }]} />
              {aiLoading ? (
                <View style={{ padding: 28, alignItems: 'center', gap: 12 }}>
                  <ActivityIndicator size="large" color={PRIMARY} />
                  <Text style={{ color: colors.textMute, fontFamily: 'Inter_500Medium', fontSize: 13 }}>
                    {language === 'sw' ? 'Sankofa AI inachambua...' : 'Analyzing with Sankofa AI...'}
                  </Text>
                </View>
              ) : aiLoaded ? (
                <Text style={[D.aiText, { color: colors.text }]}>{aiText}</Text>
              ) : (
                <TouchableOpacity onPress={loadAI} style={D.aiPromptBtn} activeOpacity={0.8}>
                  <LinearGradient colors={[PRIMARY, '#12903a']} style={D.aiPromptGrad}>
                    <Sparkles size={16} color="#fff" />
                    <Text style={D.aiPromptText}>
                      {language === 'sw' ? 'Omba Mwongozo wa AI' : 'Get AI Guidance'}
                    </Text>
                    <ArrowRight size={14} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>

          {/* ── CTA ── */}
          <Animated.View entering={FadeInDown.delay(320).duration(320)} style={{ marginBottom: 40 }}>
            <TouchableOpacity
              onPress={() => { onClose(); router.push('/crop-planning'); }}
              style={D.ctaBtn}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={[PRIMARY, '#12903a', '#0a6b2a']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={D.ctaGrad}
              >
                <Leaf size={18} color="#fff" />
                <Text style={D.ctaText}>
                  {language === 'sw' ? 'Ongeza kwenye Mpango wa Kulima' : 'Add to Crop Plan'}
                </Text>
                <ChevronRight size={16} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Grid card ────────────────────────────────────────────────────────────────
function CropCard({ crop, index, onPress, colors, isDark, language }: {
  crop: Crop; index: number; onPress: () => void;
  colors: any; isDark: boolean; language: string;
}) {
  const isHot = crop.profitScore >= 3;
  const name  = language === 'sw' ? crop.nameSw : crop.nameEn;
  return (
    <Animated.View entering={FadeInDown.delay(index * 35).springify()} style={{ width: (SW - 44) / 2 }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.88}>
        <View style={[gc.card, {
          backgroundColor: colors.card,
          borderColor: isHot ? `${PRIMARY}35` : colors.border,
        }]}>
          <View style={gc.imgWrap}>
            <Image source={{ uri: crop.img }} style={gc.img} resizeMode="cover" />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={gc.imgGrad} />
            {isHot && (
              <View style={gc.hotChip}>
                <Zap size={8} color="#000" />
                <Text style={gc.hotText}>HOT</Text>
              </View>
            )}
            <View style={gc.imgOverlay}>
              <Text style={gc.imgName} numberOfLines={1}>{name}</Text>
            </View>
          </View>
          <View style={gc.body}>
            <Text style={[gc.sub, { color: colors.textMute }]} numberOfLines={1}>
              {language === 'sw' ? crop.nameEn : crop.nameSw}
            </Text>
            <View style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap', marginTop: 5 }}>
              <View style={[gc.pill, { backgroundColor: `${PROFIT_COLOR[crop.profit]}18` }]}>
                <TrendingUp size={9} color={PROFIT_COLOR[crop.profit]} />
                <Text style={[gc.pillText, { color: PROFIT_COLOR[crop.profit] }]}>{crop.profit}</Text>
              </View>
              <View style={[gc.pill, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]}>
                <Clock size={9} color={colors.textMute} />
                <Text style={[gc.pillText, { color: colors.textMute }]}>{crop.duration}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
              <ProfitDots score={crop.profitScore} isDark={isDark} />
              <View style={[gc.diffBadge, { backgroundColor: `${DIFF_COLOR[crop.difficulty]}15` }]}>
                <Text style={[gc.diffText, { color: DIFF_COLOR[crop.difficulty] }]}>{crop.difficulty}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const gc = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  imgWrap: { position: 'relative' },
  img: { width: '100%', height: 140 },
  imgGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 72 },
  hotChip: {
    position: 'absolute', top: 8, right: 8,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: 20, backgroundColor: PRIMARY,
  },
  hotText: { fontSize: 7, fontFamily: 'Inter_700Bold', color: '#000' },
  imgOverlay: { position: 'absolute', bottom: 8, left: 10, right: 10 },
  imgName: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 15, color: '#fff' },
  body: { padding: 10 },
  sub: { fontSize: 10, fontFamily: 'Inter_500Medium' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  pillText: { fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  diffBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  diffText: { fontSize: 9, fontFamily: 'Inter_700Bold' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function CropLibraryScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const language = useKilimoStore((s) => s.language);

  const [catFilter, setCatFilter]       = useState('all');
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);

  const displayed = catFilter === 'all' ? CROPS : CROPS.filter((c) => c.category === catFilter);

  return (
    <View style={[M.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <Modal
        visible={!!selectedCrop}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setSelectedCrop(null)}
      >
        {selectedCrop && (
          <CropDetail
            crop={selectedCrop}
            onClose={() => setSelectedCrop(null)}
            colors={colors}
            isDark={isDark}
            language={language}
          />
        )}
      </Modal>

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={M.header}>
          <TouchableOpacity
            onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
            style={[M.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.8}
          >
            <ChevronLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center', gap: 3 }}>
            <View style={[M.badge, { backgroundColor: `${PRIMARY}18` }]}>
              <BookOpen size={10} color={PRIMARY} />
              <Text style={[M.badgeText, { color: PRIMARY }]}>MAKTABA</Text>
            </View>
            <Text style={[M.title, { color: colors.text }]}>
              {language === 'sw' ? 'Maktaba ya Mazao' : 'Crop Library'}
            </Text>
          </View>
          <View style={{ width: 38 }} />
        </View>

        {/* Summary stats bar */}
        <Animated.View entering={FadeInDown.duration(300)}>
          <View style={[M.statsBar, {
            backgroundColor: colors.card,
            borderColor: colors.border,
            marginHorizontal: 16, marginBottom: 12,
          }]}>
            <LinearGradient
              colors={[`${PRIMARY}0a`, 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            {[
              { num: String(CROPS.length), label: language === 'sw' ? 'Mazao Yote' : 'Total Crops', color: colors.text },
              { num: String(CROPS.filter((c) => c.profitScore >= 3).length), label: language === 'sw' ? 'Faida Juu' : 'High Profit', color: PRIMARY },
              { num: String(CROPS.filter((c) => c.difficulty === 'Rahisi').length), label: language === 'sw' ? 'Rahisi' : 'Easy', color: '#f59e0b' },
            ].map((s, i, arr) => (
              <React.Fragment key={i}>
                <View style={M.statCol}>
                  <Text style={[M.statNum, { color: s.color }]}>{s.num}</Text>
                  <Text style={[M.statLbl, { color: colors.textMute }]}>{s.label}</Text>
                </View>
                {i < arr.length - 1 && <View style={[M.statDiv, { backgroundColor: colors.border }]} />}
              </React.Fragment>
            ))}
          </View>
        </Animated.View>

        {/* Category filter pills */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 12 }}
        >
          {CATEGORIES.map((cat) => {
            const active = catFilter === cat.id;
            const label  = language === 'sw' ? cat.titleSw : cat.titleEn;
            return (
              <TouchableOpacity key={cat.id} onPress={() => setCatFilter(cat.id)} activeOpacity={0.8}>
                <View style={[M.catPill, {
                  backgroundColor: active ? cat.color : colors.card,
                  borderColor: active ? cat.color : colors.border,
                }]}>
                  <Text style={[M.catText, { color: active ? '#fff' : colors.textMute }]}>{label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Crop grid */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}>
          <View style={M.grid}>
            {displayed.map((crop, i) => (
              <CropCard
                key={crop.id}
                crop={crop}
                index={i}
                onPress={() => setSelectedCrop(crop)}
                colors={colors}
                isDark={isDark}
                language={language}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Detail styles ─────────────────────────────────────────────────────────────
const D = StyleSheet.create({
  heroWrap:    { position: 'relative', height: 310 },
  heroImg:     { width: '100%', height: 310 },
  heroTopBar:  {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 4,
  },
  heroBackBtn:  { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
  heroBackBlur: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroCatBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  heroCatText:  { fontFamily: 'Inter_700Bold', fontSize: 11, color: '#fff', letterSpacing: 0.5 },
  heroBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, gap: 5,
  },
  hotBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
    backgroundColor: PRIMARY, alignSelf: 'flex-start',
  },
  hotText:   { fontFamily: 'Inter_700Bold', fontSize: 9, color: '#000', letterSpacing: 1 },
  heroName:  { fontFamily: 'InstrumentSerif_400Regular', fontSize: 38, color: '#fff', lineHeight: 42 },
  heroSub:   { fontFamily: 'Inter_500Medium', fontSize: 14, color: 'rgba(255,255,255,0.72)' },
  weatherChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, alignSelf: 'flex-start', marginTop: 4,
  },

  body: { padding: 16 },

  // Bento
  bentoBg:      { borderRadius: 20, borderWidth: 1, overflow: 'hidden', marginBottom: 18 },
  bentoRow:     { flexDirection: 'row' },
  bentoCell:    { flex: 1, alignItems: 'center', paddingVertical: 18, gap: 3 },
  bentoBig:     { fontFamily: 'InstrumentSerif_400Regular', fontSize: 22, lineHeight: 26 },
  bentoUnit:    { fontFamily: 'Inter_400Regular', fontSize: 9, color: '#9CA3AF' },
  bentoLabel:   { fontFamily: 'Inter_600SemiBold', fontSize: 9, color: '#9CA3AF', letterSpacing: 0.4, textAlign: 'center' },
  priceStrip:   { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 12, borderTopWidth: 1 },
  priceStripText: { fontFamily: 'Inter_500Medium', fontSize: 11, flex: 1 },
  priceStripVal:  { fontFamily: 'Inter_700Bold', fontSize: 13 },

  // Section
  section:       { marginBottom: 18 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10 },
  sectionTitle:  { fontFamily: 'InstrumentSerif_400Regular', fontSize: 18, flex: 1 },
  riskBadge:     { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  riskBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 11 },

  // Conditions
  condCard:       { borderRadius: 16, borderWidth: 1, padding: 14 },
  condCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  condCardTitle:  { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  fertChip:       { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  fertChipText:   { fontFamily: 'Inter_700Bold', fontSize: 10 },
  condRow:        { flexDirection: 'row', gap: 16 },
  condItem:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  condItemText:   { fontFamily: 'Inter_500Medium', fontSize: 12 },
  condHalf:       { flex: 1, borderRadius: 16, borderWidth: 1, padding: 14, alignItems: 'center', gap: 6 },
  condHalfIcon:   { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  condHalfLabel:  { fontFamily: 'Inter_500Medium', fontSize: 10, letterSpacing: 0.4 },
  condHalfVal:    { fontFamily: 'InstrumentSerif_400Regular', fontSize: 14, textAlign: 'center' },

  // Info card
  infoCard:    { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  infoRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 13 },
  infoText:    { fontFamily: 'Inter_500Medium', fontSize: 13, flex: 1, lineHeight: 18 },
  infoSub:     { fontFamily: 'Inter_400Regular', fontSize: 11 },
  infoDivider: { height: 1 },

  // Disease
  diseaseCard:     { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  diseaseRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 13 },
  diseaseDot:      { width: 7, height: 7, borderRadius: 4 },
  diseaseName:     { fontFamily: 'Inter_500Medium', fontSize: 13 },
  diseasePill:     { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  diseasePillText: { fontFamily: 'Inter_700Bold', fontSize: 10 },

  // Tips
  tipRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 13, borderRadius: 14, borderWidth: 1 },
  tipNum:     { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tipNumText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  tipText:    { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, flex: 1 },

  // AI
  aiCard:       { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  aiCardAccent: { height: 3, width: '100%' },
  aiText:       { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 22, padding: 14 },
  aiPromptBtn:  { margin: 14, borderRadius: 14, overflow: 'hidden' },
  aiPromptGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14 },
  aiPromptText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#fff', flex: 1, textAlign: 'center' },

  // CTA
  ctaBtn:  { borderRadius: 20, overflow: 'hidden', marginTop: 8 },
  ctaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  ctaText: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 16, color: '#fff', flex: 1, textAlign: 'center' },
});

// ─── Main screen styles ────────────────────────────────────────────────────────
const M = StyleSheet.create({
  root:    { flex: 1 },
  header:  {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  backBtn: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  badge:   { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1 },
  title:   { fontFamily: 'InstrumentSerif_400Regular', fontSize: 20 },
  statsBar: {
    flexDirection: 'row', borderRadius: 16, borderWidth: 1,
    overflow: 'hidden', padding: 14,
  },
  statCol: { flex: 1, alignItems: 'center', gap: 2 },
  statNum: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 24 },
  statLbl: { fontFamily: 'Inter_600SemiBold', fontSize: 9 },
  statDiv: { width: 1, marginHorizontal: 8 },
  catPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  catText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  grid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingTop: 4 },
});
