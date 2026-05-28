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
import Animated, { FadeInDown } from 'react-native-reanimated';
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
  { feature: 'ai_chat',              label: 'Sankofa AI',          sub: 'Mshauri wako wa AI',          route: '/(tabs)/ai',         icon: null, color: '#22d15a',  pinned: true },
  { feature: 'voice_assistant',      label: 'Sauti AI',            sub: 'Ongea na AI kwa sauti',       route: '/ai-voice',        icon: null, color: '#F59E0B' },
  { feature: 'photo_diagnosis',      label: 'Skani ya Mazao',      sub: 'Tambua magonjwa ya mazao',    route: '/scan',            icon: null, color: '#22d15a',  pinned: true },
  { feature: 'analytics_predictive', label: 'Uchanganuzi wa AI',   sub: 'Utabiri na takwimu',          route: '/analytics',       icon: null, color: '#F59E0B' },
  { feature: 'digital_farm_twin',    label: 'Shamba Dijiti',       sub: 'Mfano wa kidijiti',           route: '/farm-twin',       icon: null, color: '#8b5cf6' },
  { feature: 'crop_planning',        label: 'Upangaji Mazao',      sub: 'Panga mzunguko wa mazao',     route: '/crop-planning',   icon: null, color: '#22d15a' },
  // Market
  { feature: 'market_prices',        label: 'Bei za Soko',         sub: 'Bei za mazao ya sasa hivi',   route: '/market',          icon: null, color: '#22d15a',  pinned: true },
  { feature: 'contract_farming',     label: 'Mikataba',            sub: 'Mkataba wa ukulima',          route: '/contracts',       icon: null, color: '#8b5cf6' },
  { feature: 'input_supply',         label: 'Wauzaji',             sub: 'Vifaa vya kilimo',            route: '/input-supply',    icon: null, color: '#3b82f6' },
  { feature: 'marketplace',          label: 'Soko la Bidhaa',      sub: 'Nunua na uza mazao',          route: '/market',          icon: null, color: '#22d15a' },
  // Farm
  { feature: 'farm_mapping',         label: 'Ramani ya Shamba',    sub: 'GPS na safu za NDVI',         route: '/map',             icon: null, color: '#22d15a',  pinned: true },
  { feature: 'livestock',            label: 'Mifugo',              sub: 'Simamia mifugo yako',         route: '/livestock',       icon: null, color: '#F59E0B' },
  { feature: 'inventory',            label: 'Pembejeo',            sub: 'Ghala na vifaa',              route: '/inventory',       icon: null, color: '#8b5cf6' },
  { feature: 'task_management',      label: 'Kazi',                sub: 'Orodha ya kazi za shamba',    route: '/tasks',           icon: null, color: '#64748b' },
  { feature: 'offline_mode',         label: 'Nje ya Mtandao',      sub: 'Skani bila mtandao',          route: '/offline-queue',   icon: null, color: '#64748b' },
  // Finance
  { feature: 'finance_tracker',      label: 'Daftari la Fedha',    sub: 'Matumizi na mapato',          route: '/finance',         icon: null, color: '#22d15a',  pinned: true },
  { feature: 'mobile_money',         label: 'M-Pesa / Airtel',     sub: 'Tuma na pokea pesa',          route: '/mobile-money',    icon: null, color: '#22d15a' },
  { feature: 'wallet_admin',         label: 'Pochi Msimamizi',     sub: 'Malipo na akaunti',           route: '/wallet-admin',    icon: null, color: '#22d15a' },
  { feature: 'insurance',            label: 'Bima',                sub: 'Ulinzi wa mazao yako',        route: '/insurance',       icon: null, color: '#8b5cf6' },
  { feature: 'agro_id',              label: 'Agro ID',             sub: 'Kitambulisho · PDF ya P&L',   route: '/agro-id',         icon: null, color: '#3b82f6' },
  // Community
  { feature: 'peer_groups',          label: 'Vikundi',             sub: 'Vikundi vya wakulima',        route: '/peer-groups',     icon: null, color: '#8b5cf6' },
  { feature: 'expert_consultations', label: 'Wataalamu',           sub: 'Ushauri wa wataalamu',        route: '/consultations',   icon: null, color: '#22d15a' },
  { feature: 'weather_alerts',       label: 'Hali ya Hewa',        sub: 'Utabiri wa hali ya hewa',     route: '/forecast',        icon: null, color: '#F59E0B' },
];

const ICONS: Record<Feature, React.ReactNode> = {
  ai_chat:              <Sparkles size={20} color="#22d15a" />,
  photo_diagnosis:      <Camera size={20} color="#22d15a" />,
  analytics_predictive: <BarChart3 size={20} color="#F59E0B" />,
  digital_farm_twin:    <Cpu size={20} color="#8b5cf6" />,
  crop_planning:        <Sprout size={20} color="#22d15a" />,
  market_prices:        <TrendingUp size={20} color="#22d15a" />,
  contract_farming:     <FileText size={20} color="#8b5cf6" />,
  input_supply:         <Truck size={20} color="#3b82f6" />,
  marketplace:          <ShoppingBag size={20} color="#22d15a" />,
  farm_mapping:         <MapPin size={20} color="#22d15a" />,
  livestock:            <Beef size={20} color="#F59E0B" />,
  inventory:            <Package size={20} color="#8b5cf6" />,
  task_management:      <ClipboardList size={20} color="#64748b" />,
  wallet_admin:         <Wallet size={20} color="#22d15a" />,
  insurance:            <ShieldCheck size={20} color="#8b5cf6" />,
  agro_id:              <User size={20} color="#3b82f6" />,
  peer_groups:          <Users size={20} color="#8b5cf6" />,
  expert_consultations: <GraduationCap size={20} color="#22d15a" />,
  weather_alerts:       <Bell size={20} color="#F59E0B" />,
  // extras not in features list but in Feature type
  voice_assistant:      <Zap size={20} color="#F59E0B" />,
  finance_tracker:      <BarChart3 size={20} color="#22d15a" />,
  mobile_money:         <Wallet size={20} color="#22d15a" />,
  offline_mode:         <Zap size={20} color="#64748b" />,
};

const CATEGORIES = [
  {
    key: 'ai',
    title: 'Akili Bandia',
    titleEn: 'AI & Intelligence',
    color: '#22d15a',
    features: ['ai_chat', 'voice_assistant', 'photo_diagnosis', 'analytics_predictive', 'digital_farm_twin', 'crop_planning'] as Feature[],
  },
  {
    key: 'market',
    title: 'Soko & Biashara',
    titleEn: 'Market & Trade',
    color: '#22d15a',
    features: ['market_prices', 'contract_farming', 'input_supply', 'marketplace'] as Feature[],
  },
  {
    key: 'farm',
    title: 'Shamba',
    titleEn: 'Farm Management',
    color: '#F59E0B',
    features: ['farm_mapping', 'livestock', 'inventory', 'task_management', 'offline_mode'] as Feature[],
  },
  {
    key: 'finance',
    title: 'Fedha',
    titleEn: 'Finance & ID',
    color: '#22d15a',
    features: ['finance_tracker', 'mobile_money', 'wallet_admin', 'insurance', 'agro_id'] as Feature[],
  },
  {
    key: 'community',
    title: 'Jamii',
    titleEn: 'Community',
    color: '#8b5cf6',
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
          {React.cloneElement(ICONS[item.feature] as React.ReactElement<any>, { color: item.color })}
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
        {React.cloneElement(ICONS[item.feature] as React.ReactElement<any>, { color: item.color })}
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
      <View style={[s.orb1, { backgroundColor: isDark ? 'rgba(26,59,20,0.1)' : 'rgba(26,59,20,0.05)' }]} />
      <View style={[s.orb2, { backgroundColor: isDark ? 'rgba(46,90,39,0.08)' : 'rgba(46,90,39,0.04)' }]} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} >

          {/* ── Hero ─────────────────────────────────────────────────── */}
          <Animated.View
            entering={FadeInDown.springify()}
          >
            <LinearGradient
              colors={isDark ? ['#0c250c', '#0a0a0f'] : ['#f0fdf4', '#f8fafc']}
              style={[s.hero, { borderColor: isDark ? 'rgba(26,59,20,0.25)' : 'rgba(26,59,20,0.15)' }]}
            >
              <View style={s.heroLeft}>
                <View style={[s.heroBadge, { backgroundColor: isDark ? 'rgba(26,59,20,0.3)' : 'rgba(26,59,20,0.1)' }]}>
                  <Sparkles size={12} color={isDark ? '#6B9E5F' : colors.primary} />
                  <Text style={[s.heroBadgeText, { color: isDark ? '#6B9E5F' : colors.primary }]}>FEATURES HUB</Text>
                </View>
                <Text style={[s.heroTitle, { color: colors.text }]}>
                  {lang === 'sw' ? 'Vipengele Vyako' : 'Your Features'}
                </Text>
                <Text style={[s.heroRole, { color: colors.textMute }]}>
                  {roleLabel(role)}
                </Text>
              </View>
              <View style={s.heroRight}>
                <LinearGradient colors={[colors.primary, colors.primaryDark ?? '#0a1d08']} style={s.heroCircle}>
                  <LayoutGrid size={26} color="#FCFBF7" strokeWidth={2.5} />
                </LinearGradient>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* ── Quick launch grid ────────────────────────────────────── */}
          <Text style={[s.secLabel, { color: colors.textMute, marginTop: 28 }]}>
            {lang === 'sw' ? 'VIPENGELE VYA HARAKA' : 'QUICK LAUNCH'}
          </Text>
          <View style={s.pinnedGrid}>
            {pinnedItems.map((item, i) => (
              <Animated.View
                key={item.feature}
                entering={FadeInDown.delay(i * 60).springify()}
              >
                <PinnedCard item={item} />
              </Animated.View>
            ))}
          </View>

          {/* ── Category sections ────────────────────────────────────── */}
          {CATEGORIES.map((cat, catIdx) => (
            <Animated.View
              key={cat.key}
              entering={FadeInDown.delay(100 + catIdx * 70).springify()}
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
            </Animated.View>
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
  heroBadge:  { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  heroBadgeText: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.2 },
  heroTitle:  { fontSize: 26, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.8, marginTop: 8 },
  heroRole:   { fontSize: 12, fontFamily: 'Inter_600SemiBold', textTransform: 'capitalize', marginTop: 2 },
  heroRight:  { marginLeft: 16 },
  heroCircle: { width: 60, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },

  // Sections
  secLabel:   { fontSize: 11, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: 1.5, marginTop: 0, marginBottom: 10, marginLeft: 2 },
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
