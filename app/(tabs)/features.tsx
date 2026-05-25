/**
 * Features Tab — all PRD feature routes, role-gated
 * Replaces the "UFIKIAJI WA HARAKA" section from Profile
 */
import React, { useMemo } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Sparkles, Leaf, TrendingUp, ShieldCheck, MapPin, ClipboardList,
  Beef, Package, ShoppingBag, FileText, Truck, Users, GraduationCap,
  Wallet, BarChart3, Cpu, Sprout, Bell, User, ChevronRight, Lock,
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import { useAccess, Feature } from '../../lib/access';

type FeatureEntry = {
  feature: Feature;
  label: string;
  sub: string;
  route: string;
  icon: React.ReactNode;
  color: string;
};

type Category = {
  title: string;
  titleEn: string;
  items: FeatureEntry[];
};

const CATEGORIES: Category[] = [
  {
    title: 'AI & Kilimo',
    titleEn: 'AI & Farming',
    items: [
      { feature: 'ai_chat',            label: 'Sankofa AI',          sub: 'Mshauri wako wa AI',        route: '/sankofa',       icon: <Sparkles size={20} color="#3ecf8e" />,    color: '#3ecf8e' },
      { feature: 'photo_diagnosis',    label: 'Skani ya Mazao',      sub: 'Tambua magonjwa ya mazao',  route: '/scan',          icon: <Leaf size={20} color="#10b981" />,        color: '#10b981' },
      { feature: 'analytics_predictive', label: 'Uchanganuzi wa AI', sub: 'Utabiri na takwimu',        route: '/analytics',     icon: <BarChart3 size={20} color="#f97316" />,   color: '#f97316' },
      { feature: 'digital_farm_twin',  label: 'Shamba Dijiti',       sub: 'Mfano wa kidijiti wa shamba',route: '/farm-twin',    icon: <Cpu size={20} color="#6366f1" />,         color: '#6366f1' },
      { feature: 'crop_planning',      label: 'Upangaji Mazao',      sub: 'Panga mzunguko wa mazao',   route: '/crop-planning', icon: <Sprout size={20} color="#22c55e" />,      color: '#22c55e' },
    ],
  },
  {
    title: 'Soko & Biashara',
    titleEn: 'Market & Trade',
    items: [
      { feature: 'market_prices',      label: 'Bei za Soko',         sub: 'Bei za mazao za sasa hivi', route: '/market',        icon: <TrendingUp size={20} color="#3b82f6" />,  color: '#3b82f6' },
      { feature: 'contract_farming',   label: 'Mikataba',            sub: 'Mkataba wa ukulima',        route: '/contracts',     icon: <FileText size={20} color="#3b82f6" />,    color: '#3b82f6' },
      { feature: 'input_supply',       label: 'Wauzaji',             sub: 'Vifaa vya kilimo',          route: '/input-supply',  icon: <Truck size={20} color="#10b981" />,       color: '#10b981' },
      { feature: 'marketplace',        label: 'Soko la Bidhaa',      sub: 'Nunua na uza mazao',        route: '/market',        icon: <ShoppingBag size={20} color="#ec4899" />, color: '#ec4899' },
    ],
  },
  {
    title: 'Shamba',
    titleEn: 'Farm',
    items: [
      { feature: 'farm_mapping',       label: 'Ramani ya Shamba',    sub: 'GPS na safu za NDVI',       route: '/map',           icon: <MapPin size={20} color="#0ea5e9" />,      color: '#0ea5e9' },
      { feature: 'livestock',          label: 'Mifugo',              sub: 'Simamia mifugo yako',       route: '/livestock',     icon: <Beef size={20} color="#f59e0b" />,        color: '#f59e0b' },
      { feature: 'inventory',          label: 'Pembejeo',            sub: 'Ghala na vifaa',            route: '/inventory',     icon: <Package size={20} color="#8b5cf6" />,     color: '#8b5cf6' },
      { feature: 'task_management',    label: 'Kazi',                sub: 'Orodha ya kazi za shamba',  route: '/tasks',         icon: <ClipboardList size={20} color="#64748b" />, color: '#64748b' },
    ],
  },
  {
    title: 'Fedha',
    titleEn: 'Finance',
    items: [
      { feature: 'wallet_admin',       label: 'Pochi Msimamizi',     sub: 'Malipo na akaunti',         route: '/wallet-admin',  icon: <Wallet size={20} color="#14b8a6" />,      color: '#14b8a6' },
      { feature: 'insurance',          label: 'Bima',                sub: 'Ulinzi wa mazao yako',      route: '/insurance',     icon: <ShieldCheck size={20} color="#0ea5e9" />, color: '#0ea5e9' },
      { feature: 'agro_id',            label: 'Agro ID',             sub: 'Kitambulisho · PDF ya P&L', route: '/agro-id',       icon: <User size={20} color="#3ecf8e" />,        color: '#3ecf8e' },
    ],
  },
  {
    title: 'Jamii',
    titleEn: 'Community',
    items: [
      { feature: 'peer_groups',        label: 'Vikundi',             sub: 'Vikundi vya wakulima',      route: '/peer-groups',   icon: <Users size={20} color="#ec4899" />,       color: '#ec4899' },
      { feature: 'expert_consultations', label: 'Wataalamu',         sub: 'Ushauri wa wataalamu',      route: '/consultations', icon: <GraduationCap size={20} color="#a855f7" />, color: '#a855f7' },
      { feature: 'weather_alerts',     label: 'Hali ya Hewa',        sub: 'Utabiri wa hali ya hewa',   route: '/(tabs)/forecast', icon: <Bell size={20} color="#f97316" />,      color: '#f97316' },
    ],
  },
];

function FeatureRow({ item }: { item: FeatureEntry }) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const access = useAccess(item.feature);
  const locked = access === 'none';

  function handlePress() {
    if (locked) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(item.route as any);
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={locked ? 1 : 0.78} style={{ opacity: locked ? 0.45 : 1 }}>
      <View style={[st.row, { borderBottomColor: colors.border }]}>
        <View style={[st.iconWrap, { backgroundColor: item.color + '18' }]}>
          {item.icon}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[st.label, { color: colors.text }]}>{item.label}</Text>
          <Text style={[st.sub, { color: colors.textMute }]}>{item.sub}</Text>
        </View>
        {locked
          ? <Lock size={15} color={colors.textMute} />
          : <ChevronRight size={18} color={colors.textMute} />
        }
        {access === 'basic' && !locked && (
          <View style={st.basicBadge}>
            <Text style={st.basicText}>BASIC</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function FeaturesScreen() {
  const { colors, isDark } = useTheme();
  const lang = useKilimoStore((s) => s.language);
  const agroId = useKilimoStore((s) => s.agroId);
  const role = agroId?.role ?? 'farmer';

  return (
    <View style={[st.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient
        colors={isDark ? ['#022c1a', colors.background, colors.background] : ['#f0fdf4', colors.background, colors.background]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={st.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={st.header}>
            <View>
              <Text style={[st.title, { color: colors.text }]}>
                {lang === 'sw' ? 'Vipengele' : 'Features'}
              </Text>
              <Text style={[st.subtitle, { color: colors.textMute }]}>
                {lang === 'sw' ? `Akaunti yako: ${role}` : `Your role: ${role}`}
              </Text>
            </View>
          </View>

          {/* Categories */}
          {CATEGORIES.map((cat) => (
            <View key={cat.title} style={st.section}>
              <Text style={[st.catLabel, { color: colors.textMute }]}>
                {lang === 'sw' ? cat.title.toUpperCase() : cat.titleEn.toUpperCase()}
              </Text>
              <BlurView
                intensity={isDark ? 20 : 60}
                tint={isDark ? 'dark' : 'light'}
                style={[st.card, { borderColor: colors.border }]}
              >
                {cat.items.map((item, idx) => (
                  <View key={item.feature}>
                    <FeatureRow item={item} />
                    {idx < cat.items.length - 1 && (
                      <View style={[st.divider, { backgroundColor: colors.border }]} />
                    )}
                  </View>
                ))}
              </BlurView>
            </View>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const st = StyleSheet.create({
  root:       { flex: 1 },
  scroll:     { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  title:      { fontSize: 30, fontFamily: 'Inter_900Black', letterSpacing: -1 },
  subtitle:   { fontSize: 12, fontFamily: 'Inter_600SemiBold', marginTop: 3, textTransform: 'capitalize' },

  section:    { marginBottom: 24 },
  catLabel:   { fontSize: 11, fontFamily: 'Inter_900Black', letterSpacing: 1.5, marginBottom: 10, marginLeft: 4 },
  card:       { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },

  row:        { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  iconWrap:   { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  label:      { fontSize: 14, fontFamily: 'Inter_800ExtraBold', marginBottom: 1 },
  sub:        { fontSize: 11, fontFamily: 'Inter_500Medium', lineHeight: 15 },
  divider:    { height: StyleSheet.hairlineWidth, marginLeft: 72 },

  basicBadge: { backgroundColor: 'rgba(245,158,11,0.15)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, marginRight: 6, borderWidth: 1, borderColor: 'rgba(245,158,11,0.25)' },
  basicText:  { color: '#f59e0b', fontSize: 9, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.8 },
});
