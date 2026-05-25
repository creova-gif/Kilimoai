/**
 * Features Hub — premium central navigator
 * Role-gated, grouped, with hero + quick-launch grid
 */
import React, { useMemo } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Platform, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Sparkles, Leaf, TrendingUp, ShieldCheck, MapPin, ClipboardList,
  Beef, Package, ShoppingBag, FileText, Truck, Users, GraduationCap,
  Wallet, BarChart3, Cpu, Sprout, Bell, User, ChevronRight, Lock,
  Camera, Zap, LayoutGrid,
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { motion } from 'motion/react';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import { useAccess, useCan, Feature, roleLabel } from '../../lib/access';

const { width: SW } = Dimensions.get('window');

// ── Data ─────────────────────────────────────────────────────────────────────

type FeatureEntry = {
  feature: Feature;
  label: string;
  sub: string;
  route: string;
  icon: React.ReactNode;
  color: string;
  pinned?: boolean;
};

const ALL_FEATURES: FeatureEntry[] = [
  // AI
  { feature: 'ai_chat',              label: 'Sankofa AI',          sub: 'Mshauri wako wa AI',          route: '/sankofa',         icon: null, color: '#22d15a',  pinned: true },
  { feature: 'photo_diagnosis',      label: 'Skani ya Mazao',      sub: 'Tambua magonjwa ya mazao',    route: '/scan',            icon: null, color: '#22d15a',  pinned: true },
  { feature: 'analytics_predictive', label: 'Uchanganuzi wa AI',   sub: 'Utabiri na takwimu',          route: '/analytics',       icon: null, color: '#f97316' },
  { feature: 'digital_farm_twin',    label: 'Shamba Dijiti',       sub: 'Mfano wa kidijiti',           route: '/farm-twin',       icon: null, color: '#6366f1' },
  { feature: 'crop_planning',        label: 'Upangaji Mazao',      sub: 'Panga mzunguko wa mazao',     route: '/crop-planning',   icon: null, color: '#22c55e' },
  // Market
  { feature: 'market_prices',        label: 'Bei za Soko',         sub: 'Bei za mazao ya sasa hivi',   route: '/market',          icon: null, color: '#3b82f6',  pinned: true },
  { feature: 'contract_farming',     label: 'Mikataba',            sub: 'Mkataba wa ukulima',          route: '/contracts',       icon: null, color: '#8b5cf6' },
  { feature: 'input_supply',         label: 'Wauzaji',             sub: 'Vifaa vya kilimo',            route: '/input-supply',    icon: null, color: '#22d15a' },
  { feature: 'marketplace',          label: 'Soko la Bidhaa',      sub: 'Nunua na uza mazao',          route: '/market',          icon: null, color: '#ec4899' },
  // Farm
  { feature: 'farm_mapping',         label: 'Ramani ya Shamba',    sub: 'GPS na safu za NDVI',         route: '/map',             icon: null, color: '#0ea5e9',  pinned: true },
  { feature: 'livestock',            label: 'Mifugo',              sub: 'Simamia mifugo yako',         route: '/livestock',       icon: null, color: '#f59e0b' },
  { feature: 'inventory',            label: 'Pembejeo',            sub: 'Ghala na vifaa',              route: '/inventory',       icon: null, color: '#a855f7' },
  { feature: 'task_management',      label: 'Kazi',                sub: 'Orodha ya kazi za shamba',    route: '/tasks',           icon: null, color: '#64748b' },
  // Finance
  { feature: 'wallet_admin',         label: 'Pochi Msimamizi',     sub: 'Malipo na akaunti',           route: '/wallet-admin',    icon: null, color: '#14b8a6' },
  { feature: 'insurance',            label: 'Bima',                sub: 'Ulinzi wa mazao yako',        route: '/insurance',       icon: null, color: '#0ea5e9' },
  { feature: 'agro_id',              label: 'Agro ID',             sub: 'Kitambulisho · PDF ya P&L',   route: '/agro-id',         icon: null, color: '#22d15a' },
  // Community
  { feature: 'peer_groups',          label: 'Vikundi',             sub: 'Vikundi vya wakulima',        route: '/peer-groups',     icon: null, color: '#ec4899' },
  { feature: 'expert_consultations', label: 'Wataalamu',           sub: 'Ushauri wa wataalamu',        route: '/consultations',   icon: null, color: '#a855f7' },
  { feature: 'weather_alerts',       label: 'Hali ya Hewa',        sub: 'Utabiri wa hali ya hewa',     route: '/(tabs)/forecast', icon: null, color: '#f97316' },
];

const ICONS: Record<Feature, React.ReactNode> = {
  ai_chat:              <Sparkles size={20} color="#22d15a" />,
  photo_diagnosis:      <Camera size={20} color="#22d15a" />,
  analytics_predictive: <BarChart3 size={20} color="#f97316" />,
  digital_farm_twin:    <Cpu size={20} color="#6366f1" />,
  crop_planning:        <Sprout size={20} color="#22c55e" />,
  market_prices:        <TrendingUp size={20} color="#3b82f6" />,
  contract_farming:     <FileText size={20} color="#8b5cf6" />,
  input_supply:         <Truck size={20} color="#22d15a" />,
  marketplace:          <ShoppingBag size={20} color="#ec4899" />,
  farm_mapping:         <MapPin size={20} color="#0ea5e9" />,
  livestock:            <Beef size={20} color="#f59e0b" />,
  inventory:            <Package size={20} color="#a855f7" />,
  task_management:      <ClipboardList size={20} color="#64748b" />,
  wallet_admin:         <Wallet size={20} color="#14b8a6" />,
  insurance:            <ShieldCheck size={20} color="#0ea5e9" />,
  agro_id:              <User size={20} color="#22d15a" />,
  peer_groups:          <Users size={20} color="#ec4899" />,
  expert_consultations: <GraduationCap size={20} color="#a855f7" />,
  weather_alerts:       <Bell size={20} color="#f97316" />,
  // extras not in features list but in Feature type
  voice_assistant:      <Zap size={20} color="#f59e0b" />,
  finance_tracker:      <BarChart3 size={20} color="#3b82f6" />,
  mobile_money:         <Wallet size={20} color="#22d15a" />,
  offline_mode:         <Zap size={20} color="#64748b" />,
};

const CATEGORIES = [
  {
    key: 'ai',
    title: 'Akili Bandia',
    titleEn: 'AI & Intelligence',
    color: '#22d15a',
    features: ['ai_chat', 'photo_diagnosis', 'analytics_predictive', 'digital_farm_twin', 'crop_planning'] as Feature[],
  },
  {
    key: 'market',
    title: 'Soko & Biashara',
    titleEn: 'Market & Trade',
    color: '#3b82f6',
    features: ['market_prices', 'contract_farming', 'input_supply', 'marketplace'] as Feature[],
  },
  {
    key: 'farm',
    title: 'Shamba',
    titleEn: 'Farm Management',
    color: '#f59e0b',
    features: ['farm_mapping', 'livestock', 'inventory', 'task_management'] as Feature[],
  },
  {
    key: 'finance',
    title: 'Fedha',
    titleEn: 'Finance & ID',
    color: '#14b8a6',
    features: ['wallet_admin', 'insurance', 'agro_id'] as Feature[],
  },
  {
    key: 'community',
    title: 'Jamii',
    titleEn: 'Community',
    color: '#ec4899',
    features: ['peer_groups', 'expert_consultations', 'weather_alerts'] as Feature[],
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function PinnedCard({ item }: { item: FeatureEntry }) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const can = useCan(item.feature);

  return (
    <TouchableOpacity
      onPress={() => { if (!can) return; Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push(item.route as any); }}
      activeOpacity={0.8}
      style={{ width: (SW - 56) / 2, opacity: can ? 1 : 0.4 }}
    >
      <LinearGradient
        colors={[item.color + '22', item.color + '08']}
        style={[pc.card, { borderColor: item.color + '30' }]}
      >
        <View style={[pc.iconRing, { backgroundColor: item.color + '18', borderColor: item.color + '30' }]}>
          {ICONS[item.feature]}
        </View>
        <Text style={[pc.label, { color: colors.text }]} numberOfLines={1}>{item.label}</Text>
        <Text style={[pc.sub, { color: colors.textMute }]} numberOfLines={1}>{item.sub}</Text>
        {!can && <Lock size={12} color={colors.textMute} style={{ marginTop: 4 }} />}
      </LinearGradient>
    </TouchableOpacity>
  );
}

function FeatureRow({ item }: { item: FeatureEntry }) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const access = useAccess(item.feature);
  const locked = access === 'none';

  return (
    <TouchableOpacity
      onPress={() => { if (locked) return; Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(item.route as any); }}
      activeOpacity={locked ? 1 : 0.75}
      style={[fr.row, { opacity: locked ? 0.38 : 1 }]}
    >
      <View style={[fr.iconWrap, { backgroundColor: item.color + '15' }]}>
        {ICONS[item.feature]}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={[fr.label, { color: colors.text }]}>{item.label}</Text>
          {access === 'basic' && !locked && (
            <View style={fr.basicBadge}>
              <Text style={fr.basicText}>BASIC</Text>
            </View>
          )}
        </View>
        <Text style={[fr.sub, { color: colors.textMute }]}>{item.sub}</Text>
      </View>
      {locked
        ? <Lock size={14} color={colors.textMute} />
        : <ChevronRight size={16} color={colors.textMute} />
      }
    </TouchableOpacity>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function FeaturesScreen() {
  const { colors, isDark } = useTheme();
  const lang = useKilimoStore((s) => s.language);
  const agroId = useKilimoStore((s) => s.agroId);
  const role = (agroId?.role ?? 'farmer') as any;

  const featureMap = useMemo(() => {
    const map: Record<string, FeatureEntry> = {};
    ALL_FEATURES.forEach((f) => { map[f.feature] = { ...f, icon: ICONS[f.feature] }; });
    return map;
  }, []);

  const pinnedItems = ALL_FEATURES.filter((f) => f.pinned);

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Ambient glow */}
      <View style={[s.orb1, { backgroundColor: isDark ? '#22d15a10' : '#22d15a08' }]} />
      <View style={[s.orb2, { backgroundColor: isDark ? '#6366f110' : '#6366f108' }]} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Hero ─────────────────────────────────────────────────── */}
          <motion.View
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 180 }}
          >
            <LinearGradient
              colors={isDark ? ['#052e16', '#0a0a0f'] : ['#f0fdf4', '#f8fafc']}
              style={[s.hero, { borderColor: isDark ? 'rgba(34,209,90,0.15)' : 'rgba(34,209,90,0.2)' }]}
            >
              <View style={s.heroLeft}>
                <View style={s.heroBadge}>
                  <Sparkles size={12} color="#22d15a" />
                  <Text style={s.heroBadgeText}>FEATURES HUB</Text>
                </View>
                <Text style={[s.heroTitle, { color: colors.text }]}>
                  {lang === 'sw' ? 'Vipengele Vyako' : 'Your Features'}
                </Text>
                <Text style={[s.heroRole, { color: colors.textMute }]}>
                  {roleLabel(role)}
                </Text>
              </View>
              <View style={s.heroRight}>
                <LinearGradient colors={['#22d15a', '#22d15a']} style={s.heroCircle}>
                  <LayoutGrid size={26} color="#000" strokeWidth={2.5} />
                </LinearGradient>
              </View>
            </LinearGradient>
          </motion.View>

          {/* ── Quick launch grid ────────────────────────────────────── */}
          <Text style={[s.secLabel, { color: colors.textMute, marginTop: 28 }]}>
            {lang === 'sw' ? 'VIPENGELE VYA HARAKA' : 'QUICK LAUNCH'}
          </Text>
          <View style={s.pinnedGrid}>
            {pinnedItems.map((item, i) => (
              <motion.View
                key={item.feature}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, type: 'spring', damping: 20, stiffness: 200 }}
              >
                <PinnedCard item={item} />
              </motion.View>
            ))}
          </View>

          {/* ── Category sections ────────────────────────────────────── */}
          {CATEGORIES.map((cat, catIdx) => (
            <motion.View
              key={cat.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + catIdx * 0.07, type: 'spring', damping: 22, stiffness: 160 }}
              style={{ marginTop: 28 }}
            >
              {/* Section header */}
              <View style={s.catHeader}>
                <View style={[s.catDot, { backgroundColor: cat.color }]} />
                <Text style={[s.secLabel, { color: colors.textMute, marginTop: 0, flex: 1 }]}>
                  {lang === 'sw' ? cat.title.toUpperCase() : cat.titleEn.toUpperCase()}
                </Text>
              </View>

              <BlurView
                intensity={isDark ? 18 : 55}
                tint={isDark ? 'dark' : 'light'}
                style={[s.card, { borderColor: colors.border }]}
              >
                <View style={[s.catAccent, { backgroundColor: cat.color }]} />
                {cat.features.map((feat, idx) => {
                  const item = featureMap[feat];
                  if (!item) return null;
                  return (
                    <View key={feat}>
                      <FeatureRow item={item} />
                      {idx < cat.features.length - 1 && (
                        <View style={[s.divider, { backgroundColor: colors.border, marginLeft: 72 }]} />
                      )}
                    </View>
                  );
                })}
              </BlurView>
            </motion.View>
          ))}

          <View style={{ height: 110 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root:       { flex: 1 },
  orb1:       { position: 'absolute', width: 360, height: 360, borderRadius: 180, top: -80, right: -80 },
  orb2:       { position: 'absolute', width: 280, height: 280, borderRadius: 140, bottom: 100, left: -60 },
  scroll:     { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 8 : 16, paddingBottom: 40 },

  // Hero
  hero:       { borderRadius: 24, borderWidth: 1, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroLeft:   { flex: 1, gap: 4 },
  heroBadge:  { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(34,209,90,0.12)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  heroBadgeText: { color: '#22d15a', fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.2 },
  heroTitle:  { fontSize: 26, fontFamily: 'Inter_900Black', letterSpacing: -0.8, marginTop: 8 },
  heroRole:   { fontSize: 12, fontFamily: 'Inter_600SemiBold', textTransform: 'capitalize', marginTop: 2 },
  heroRight:  { marginLeft: 16 },
  heroCircle: { width: 60, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },

  // Sections
  secLabel:   { fontSize: 11, fontFamily: 'Inter_900Black', letterSpacing: 1.5, marginTop: 0, marginBottom: 10, marginLeft: 2 },
  pinnedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  catHeader:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  catDot:     { width: 8, height: 8, borderRadius: 4 },

  // Card container
  card:       { borderRadius: 20, borderWidth: 1, overflow: 'hidden', position: 'relative' },
  catAccent:  { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderRadius: 2 },
  divider:    { height: StyleSheet.hairlineWidth },
});

const pc = StyleSheet.create({
  card:       { borderRadius: 18, borderWidth: 1, padding: 16, gap: 8 },
  iconRing:   { width: 44, height: 44, borderRadius: 13, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  label:      { fontSize: 13, fontFamily: 'Inter_800ExtraBold' },
  sub:        { fontSize: 10, fontFamily: 'Inter_500Medium', lineHeight: 14 },
});

const fr = StyleSheet.create({
  row:        { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 15 },
  iconWrap:   { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  label:      { fontSize: 14, fontFamily: 'Inter_800ExtraBold', marginBottom: 1 },
  sub:        { fontSize: 11, fontFamily: 'Inter_500Medium', lineHeight: 15 },
  basicBadge: { backgroundColor: 'rgba(245,158,11,0.14)', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(245,158,11,0.25)' },
  basicText:  { color: '#f59e0b', fontSize: 9, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.8 },
});
