/**
 * Crop Library — redesigned with dark glass cards, category chips,
 * profit/difficulty badges, and AI details modal
 */
import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  Image, Modal, ActivityIndicator, Dimensions, SafeAreaView,
  StatusBar, Platform,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import {
  ChevronLeft, Leaf, Droplets, Sun, TrendingUp, Clock,
  Sparkles, X, BookOpen, Award, Zap, BarChart3,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '../constants/Theme';
import { chat } from '../lib/ai';

const { width: SW } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',          title: 'Yote',                  color: '#22d15a' },
  { id: 'staple',       title: 'Nafaka',                color: '#f59e0b' },
  { id: 'cash',         title: 'Biashara',              color: '#3b82f6' },
  { id: 'horticulture', title: 'Matunda & Mboga',       color: '#a855f7' },
];

const CROPS = [
  { id: 'maize',       nameEn: 'Maize',         nameSw: 'Mahindi',       category: 'staple',       img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400', duration: 'Miezi 3–4', difficulty: 'Kati',   profit: 'Kati',     profitScore: 2, water: 'Wastani',    sun: 'Jua Kamili', desc: 'Zao kuu la chakula Tanzania. Hustawi maeneo mengi yenye mvua za kutosha.' },
  { id: 'rice',        nameEn: 'Rice',          nameSw: 'Mpunga',        category: 'staple',       img: 'https://images.unsplash.com/photo-1530335032608-f40445a6c1e9?auto=format&fit=crop&q=80&w=400', duration: 'Miezi 4–5', difficulty: 'Nguvu',  profit: 'Juu',      profitScore: 3, water: 'Mingi Sana', sun: 'Jua Kamili', desc: 'Hulimwa sana mabondeni Mbeya, Morogoro, na Shinyanga. Hulipa sana kibiashara.' },
  { id: 'beans',       nameEn: 'Beans',         nameSw: 'Maharage',      category: 'staple',       img: 'https://images.unsplash.com/photo-1551608674-d4b3ff2efbb7?auto=format&fit=crop&q=80&w=400', duration: 'Siku 60–90', difficulty: 'Rahisi', profit: 'Kati',     profitScore: 2, water: 'Wastani',    sun: 'Jua Kamili', desc: 'Hulimwa sana nyanda za juu. Husaidia kurudisha nitrojeni kwenye udongo.' },
  { id: 'cassava',     nameEn: 'Cassava',       nameSw: 'Muhogo',        category: 'staple',       img: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=400', duration: 'Miezi 9–12', difficulty: 'Rahisi', profit: 'Kati',     profitScore: 2, water: 'Kidogo',     sun: 'Jua Kamili', desc: 'Zao linalostahimili ukame. Hulimwa kanda ya ziwa, Pwani na Kusini.' },
  { id: 'sorghum',     nameEn: 'Sorghum',       nameSw: 'Mtama',         category: 'staple',       img: 'https://images.unsplash.com/photo-1597816001099-0158bc56184a?auto=format&fit=crop&q=80&w=400', duration: 'Miezi 3–4', difficulty: 'Rahisi', profit: 'Chini',    profitScore: 1, water: 'Kidogo Sana',sun: 'Jua Kali',   desc: 'Ustahimili ukame wa hali ya juu. Zao zuri kwa kanda kame kama Dodoma.' },
  { id: 'cashew',      nameEn: 'Cashew Nuts',   nameSw: 'Korosho',       category: 'cash',         img: 'https://images.unsplash.com/photo-1533742468351-4d40abcb6478?auto=format&fit=crop&q=80&w=400', duration: 'Miaka 3+',  difficulty: 'Kati',   profit: 'Juu Sana', profitScore: 4, water: 'Kidogo',     sun: 'Jua Kamili', desc: 'Zao la utajiri Kusini mwa Tanzania (Mtwara, Lindi).' },
  { id: 'coffee',      nameEn: 'Coffee',        nameSw: 'Kahawa',        category: 'cash',         img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400', duration: 'Miaka 3–5', difficulty: 'Nguvu',  profit: 'Juu',      profitScore: 3, water: 'Mingi',      sun: 'Kivuli',     desc: 'Zao kuu la biashara (Arabica kaskazini/kusini, Robusta Kagera).' },
  { id: 'cotton',      nameEn: 'Cotton',        nameSw: 'Pamba',         category: 'cash',         img: 'https://images.unsplash.com/photo-1502472458406-8d62dcce474f?auto=format&fit=crop&q=80&w=400', duration: 'Miezi 5–6', difficulty: 'Nguvu',  profit: 'Kati',     profitScore: 2, water: 'Wastani',    sun: 'Jua Kamili', desc: '"Dhahabu Nyeupe" inayolimwa sana Kanda ya Ziwa.' },
  { id: 'sunflower',   nameEn: 'Sunflower',     nameSw: 'Alizeti',       category: 'cash',         img: 'https://images.unsplash.com/photo-1558500259-22a868427ce2?auto=format&fit=crop&q=80&w=400', duration: 'Siku 90–120', difficulty: 'Rahisi',profit: 'Kati',     profitScore: 2, water: 'Kidogo',     sun: 'Jua Kamili', desc: 'Hustahimili ukame. Hustawi Dodoma na Singida kwa uzalishaji wa mafuta.' },
  { id: 'tea',         nameEn: 'Tea',           nameSw: 'Chai',          category: 'cash',         img: 'https://images.unsplash.com/photo-1596637373007-9304a3f3a8b4?auto=format&fit=crop&q=80&w=400', duration: 'Miaka 3+',  difficulty: 'Nguvu',  profit: 'Juu',      profitScore: 3, water: 'Mingi Sana', sun: 'Jua Kiasi',  desc: 'Hulimwa nyanda za juu kama Mufindi na Lushoto.' },
  { id: 'tomato',      nameEn: 'Tomatoes',      nameSw: 'Nyanya',        category: 'horticulture', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400', duration: 'Miezi 2–3', difficulty: 'Nguvu',  profit: 'Juu',      profitScore: 3, water: 'Mingi',      sun: 'Jua Kamili', desc: 'Zao la biashara la haraka. Linahitaji matunzo na dawa za kuzuia magonjwa.' },
  { id: 'onion',       nameEn: 'Onions',        nameSw: 'Vitunguu',      category: 'horticulture', img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=400', duration: 'Miezi 3–4', difficulty: 'Kati',   profit: 'Juu Sana', profitScore: 4, water: 'Wastani',    sun: 'Jua Kamili', desc: 'Vitunguu vya Singida na Mang\'ola vina soko kubwa Afrika Mashariki.' },
  { id: 'avocado',     nameEn: 'Avocado',       nameSw: 'Parachichi',    category: 'horticulture', img: 'https://images.unsplash.com/photo-1517666005606-1eb8a614d95b?auto=format&fit=crop&q=80&w=400', duration: 'Miaka 3+',  difficulty: 'Kati',   profit: 'Juu Sana', profitScore: 4, water: 'Wastani',    sun: 'Jua Kamili', desc: 'Dhahabu ya kijani Njombe na Mbeya. Soko lake linakua kimataifa (Hass).' },
  { id: 'banana',      nameEn: 'Banana',        nameSw: 'Ndizi',         category: 'horticulture', img: 'https://images.unsplash.com/photo-1601002888204-5838cc518e38?auto=format&fit=crop&q=80&w=400', duration: 'Miezi 9–12', difficulty: 'Kati',  profit: 'Juu',      profitScore: 3, water: 'Mingi',      sun: 'Kiasi',      desc: 'Chakula kikuu Kilimanjaro na Kagera. Inahitaji unyevu na mboji nyingi.' },
  { id: 'cloves',      nameEn: 'Cloves',        nameSw: 'Karafuu',       category: 'horticulture', img: 'https://images.unsplash.com/photo-1606822263435-0ce1b88e0018?auto=format&fit=crop&q=80&w=400', duration: 'Miaka 5+',  difficulty: 'Kati',   profit: 'Juu Sana', profitScore: 4, water: 'Mingi',      sun: 'Jua Kamili', desc: 'Zao maarufu la Zanzibar na Pemba. Hutumika kama kiungo duniani kote.' },
];

const PROFIT_COLOR: Record<string, string> = {
  'Chini': '#64748b', 'Kati': '#f59e0b', 'Juu': '#22d15a', 'Juu Sana': '#22d15a',
};

const DIFF_COLOR: Record<string, string> = {
  'Rahisi': '#22d15a', 'Kati': '#f59e0b', 'Nguvu': '#ef4444',
};

function aiConfigured() {
  return !!(process.env.EXPO_PUBLIC_OPENAI_API_KEY);
}

// ─── Profit score dots ────────────────────────────────────────────────────────
function ProfitDots({ score }: { score: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={{
            width: 5, height: 5, borderRadius: 3,
            backgroundColor: i <= score ? '#22d15a' : 'rgba(255,255,255,0.1)',
          }}
        />
      ))}
    </View>
  );
}

// ─── Crop card ────────────────────────────────────────────────────────────────
function CropCard({ crop, index, onPress }: { crop: any; index: number; onPress: () => void }) {
  const { colors, isDark } = useTheme();
  const isHighProfit = crop.profitScore >= 3;

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).springify()}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={{ width: SW * 0.46 }}>
        <View style={[cc.wrap, {
          backgroundColor: isDark ? 'rgba(9,20,11,0.97)' : colors.card,
          borderColor: isHighProfit
            ? 'rgba(34,209,90,0.2)'
            : (isDark ? 'rgba(255,255,255,0.06)' : colors.border),
        }]}>
          {/* Image */}
          <View style={cc.imgWrap}>
            <Image source={{ uri: crop.img }} style={cc.img} resizeMode="cover" />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={cc.imgGrad}
            />
            {isHighProfit && (
              <View style={cc.hotChip}>
                <Zap size={8} color="#000" />
                <Text style={cc.hotText}>HOT</Text>
              </View>
            )}
          </View>

          {/* Body */}
          <View style={cc.body}>
            <Text style={[cc.name, { color: isDark ? '#fff' : colors.text }]} numberOfLines={1}>
              {crop.nameSw}
            </Text>
            <Text style={[cc.sub, { color: colors.textMute }]} numberOfLines={1}>
              {crop.nameEn}
            </Text>

            <View style={cc.badges}>
              {/* Profit */}
              <View style={[cc.badge, { backgroundColor: `${PROFIT_COLOR[crop.profit]}18` }]}>
                <TrendingUp size={9} color={PROFIT_COLOR[crop.profit]} />
                <Text style={[cc.badgeText, { color: PROFIT_COLOR[crop.profit] }]}>{crop.profit}</Text>
              </View>
              {/* Duration */}
              <View style={[cc.badge, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]}>
                <Clock size={9} color={colors.textMute} />
                <Text style={[cc.badgeText, { color: colors.textMute }]}>{crop.duration}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
              <ProfitDots score={crop.profitScore} />
              <View style={[cc.diffBadge, { backgroundColor: `${DIFF_COLOR[crop.difficulty]}15` }]}>
                <Text style={[cc.diffText, { color: DIFF_COLOR[crop.difficulty] }]}>{crop.difficulty}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const cc = StyleSheet.create({
  wrap: {
    borderRadius: 18, borderWidth: 1,
    overflow: 'hidden',
  },
  imgWrap: { position: 'relative' },
  img: { width: '100%', height: 130 },
  imgGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 50 },
  hotChip: {
    position: 'absolute', top: 8, right: 8,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: 20, backgroundColor: '#22d15a',
  },
  hotText: { fontSize: 7, fontFamily: 'Inter_700Bold', color: '#000' },
  body: { padding: 10, gap: 3 },
  name: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  sub: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  badges: { flexDirection: 'row', gap: 5, flexWrap: 'wrap', marginTop: 6 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6,
  },
  badgeText: { fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  diffBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  diffText: { fontSize: 9, fontFamily: 'Inter_700Bold' },
});

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function CropLibraryScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const [catFilter, setCatFilter] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const displayed = catFilter === 'all'
    ? CROPS
    : CROPS.filter((c) => c.category === catFilter);

  const fetchDetails = async (crop: any) => {
    setSelectedCrop(crop);
    setDetails('');
    setLoading(true);
    try {
      if (aiConfigured()) {
        const res = await chat([{ role: 'user', content: `Nipe mwongozo kamili wa kilimo cha ${crop.nameSw}. Jumuisha: 1. Maandalizi ya shamba, 2. Umbali wa kupanda, 3. Magonjwa makuu, 4. Uvunaji. Fupisha kwa bullet points.` }]);
        setDetails(res);
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        setDetails(`Mwongozo wa Sankofa AI kwa ${crop.nameSw}:\n\n• Maandalizi ya Shamba: Andaa shamba mapema, palilia na tayarisha udongo uwe laini. Tumia samadi kuongeza rutuba.\n• Umbali wa Kupanda: Zingatia vipimo sahihi kuruhusu hewa na mwanga wa kutosha.\n• Udhibiti wa Magonjwa: Kagua shamba angalau mara mbili kwa wiki. Tumia viuatilifu vilivyopendekezwa.\n• Uvunaji: Vuna mazao yakiwa yamekomaa vizuri na hifadhi sehemu kavu.`);
      }
    } catch {
      setDetails('Kuna changamoto ya mtandao. Tafadhali jaribu tena baadaye.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Glow */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[s.glow, Platform.OS === 'web' && ({ filter: 'blur(90px)' } as any)]} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity
            onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
            style={s.iconBtn}
          >
            <ChevronLeft size={22} color={isDark ? 'rgba(255,255,255,0.8)' : colors.text} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <View style={s.badge}>
              <BookOpen size={10} color="#22d15a" />
              <Text style={s.badgeText}>MAKTABA</Text>
            </View>
            <Text style={[s.title, { color: colors.text }]}>Maktaba ya Mazao</Text>
          </View>
          <View style={{ width: 42 }} />
        </View>

        {/* Summary stats */}
        <Animated.View entering={FadeInDown} style={{ paddingHorizontal: 16, marginBottom: 14 }}>
          <View style={[s.statsBar, {
            backgroundColor: isDark ? 'rgba(9,20,11,0.97)' : colors.card,
            borderColor: 'rgba(34,209,90,0.12)',
          }]}>
            <LinearGradient
              colors={['rgba(34,209,90,0.08)', 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={s.statCol}>
              <Text style={s.statNum}>{CROPS.length}</Text>
              <Text style={[s.statLbl, { color: colors.textMute }]}>Mazao Yote</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statCol}>
              <Text style={[s.statNum, { color: '#22d15a' }]}>
                {CROPS.filter((c) => c.profitScore >= 3).length}
              </Text>
              <Text style={[s.statLbl, { color: colors.textMute }]}>Faida Juu</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statCol}>
              <Text style={[s.statNum, { color: '#f59e0b' }]}>
                {CROPS.filter((c) => c.difficulty === 'Rahisi').length}
              </Text>
              <Text style={[s.statLbl, { color: colors.textMute }]}>Rahisi</Text>
            </View>
          </View>
        </Animated.View>

        {/* Category filters */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 12 }}
        >
          {CATEGORIES.map((cat) => {
            const active = catFilter === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCatFilter(cat.id)}
                style={[s.filterPill, {
                  backgroundColor: active ? `${cat.color}18` : (isDark ? 'rgba(255,255,255,0.04)' : colors.card),
                  borderColor: active ? cat.color : (isDark ? 'rgba(255,255,255,0.08)' : colors.border),
                }]}
              >
                <Text style={[s.filterText, { color: active ? cat.color : colors.textMute }]}>
                  {cat.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Grid */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}>
          <View style={s.grid}>
            {displayed.map((crop, i) => (
              <CropCard key={crop.id} crop={crop} index={i} onPress={() => fetchDetails(crop)} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Detail modal */}
      <Modal visible={!!selectedCrop} transparent animationType="slide" onRequestClose={() => setSelectedCrop(null)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <View style={[s.modal, { backgroundColor: isDark ? '#0a140a' : '#fff' }]}>
            {/* Handle */}
            <View style={s.modalHandle} />

            {/* Modal header */}
            <View style={s.modalTop}>
              <View>
                <Text style={[s.modalTitle, { color: colors.text }]}>{selectedCrop?.nameSw}</Text>
                <Text style={[s.modalSub, { color: colors.textMute }]}>{selectedCrop?.nameEn}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedCrop(null)} style={s.closeBtn}>
                <X size={18} color={colors.textMute} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              {/* Hero image */}
              <View style={{ position: 'relative', marginBottom: 16 }}>
                <Image source={{ uri: selectedCrop?.img }} style={s.modalImg} resizeMode="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.5)']}
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, borderRadius: 16 }}
                />
              </View>

              <Text style={[s.modalDesc, { color: colors.textMute }]}>{selectedCrop?.desc}</Text>

              {/* Stats grid */}
              <View style={s.statsGrid}>
                {[
                  { icon: <Clock size={18} color="#22d15a" />, label: 'Muda', value: selectedCrop?.duration },
                  { icon: <TrendingUp size={18} color="#f59e0b" />, label: 'Faida', value: selectedCrop?.profit },
                  { icon: <Leaf size={18} color="#3b82f6" />, label: 'Ugumu', value: selectedCrop?.difficulty },
                  { icon: <Droplets size={18} color="#0ea5e9" />, label: 'Maji', value: selectedCrop?.water },
                  { icon: <Sun size={18} color="#f97316" />, label: 'Jua', value: selectedCrop?.sun },
                  { icon: <Award size={18} color="#a855f7" />, label: 'Alama', value: selectedCrop ? `${selectedCrop.profitScore}/4` : '-' },
                ].map((item, i) => (
                  <View key={i} style={[s.statBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : colors.background }]}>
                    {item.icon}
                    <Text style={[s.statBoxVal, { color: colors.text }]}>{item.value}</Text>
                    <Text style={[s.statBoxLbl, { color: colors.textMute }]}>{item.label}</Text>
                  </View>
                ))}
              </View>

              {/* AI guide */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Sparkles size={18} color="#22d15a" />
                <Text style={[s.aiTitle, { color: colors.text }]}>Mwongozo wa Sankofa AI</Text>
              </View>

              <View style={[s.aiBox, {
                backgroundColor: isDark ? 'rgba(34,209,90,0.06)' : 'rgba(34,209,90,0.04)',
                borderColor: 'rgba(34,209,90,0.15)',
              }]}>
                {loading ? (
                  <View style={{ padding: 24, alignItems: 'center', gap: 12 }}>
                    <ActivityIndicator size="large" color="#22d15a" />
                    <Text style={{ color: colors.textMute, fontFamily: 'Inter_500Medium', fontSize: 13 }}>
                      Sankofa AI inachambua...
                    </Text>
                  </View>
                ) : (
                  <Text style={[s.aiText, { color: isDark ? 'rgba(255,255,255,0.8)' : colors.text }]}>
                    {details}
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  glow: {
    position: 'absolute', top: -60, right: -60,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(34,209,90,0.07)',
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 9, paddingVertical: 3,
    borderRadius: 8, backgroundColor: 'rgba(34,209,90,0.1)', marginBottom: 4,
  },
  badgeText: { fontSize: 9, fontFamily: 'Inter_700Bold', color: '#22d15a', letterSpacing: 1 },
  title: { fontSize: 20, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.4 },

  statsBar: {
    flexDirection: 'row', borderRadius: 16, borderWidth: 1,
    overflow: 'hidden', padding: 14,
  },
  statCol: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 22, fontFamily: 'InstrumentSerif_400Regular', color: '#fff' },
  statLbl: { fontSize: 9, fontFamily: 'Inter_600SemiBold', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: 8 },

  filterPill: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, borderWidth: 1.5,
  },
  filterText: { fontSize: 12, fontFamily: 'Inter_700Bold' },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 12, paddingTop: 4,
  },

  // Modal
  modal: {
    height: '90%',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 20, paddingBottom: 0,
    borderWidth: 1, borderColor: 'rgba(34,209,90,0.1)',
  },
  modalHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center', marginBottom: 16,
  },
  modalTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 16,
  },
  modalTitle: { fontSize: 26, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.5 },
  modalSub: { fontSize: 13, fontFamily: 'Inter_500Medium', marginTop: 2 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  modalImg: { width: '100%', height: 200, borderRadius: 16 },
  modalDesc: { fontSize: 14, fontFamily: 'Inter_500Medium', lineHeight: 22, marginBottom: 20 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statBox: {
    width: '30.5%', padding: 12, borderRadius: 14,
    alignItems: 'flex-start', gap: 6,
  },
  statBoxVal: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  statBoxLbl: { fontSize: 10, fontFamily: 'Inter_500Medium' },

  aiTitle: { fontSize: 17, fontFamily: 'InstrumentSerif_400Regular' },
  aiBox: {
    borderRadius: 16, borderWidth: 1, padding: 16,
  },
  aiText: { fontSize: 14, fontFamily: 'Inter_500Medium', lineHeight: 24 },
});
