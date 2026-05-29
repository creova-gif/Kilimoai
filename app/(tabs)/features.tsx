/**
 * Features Hub — editorial dark-glass redesign
 * Today's Focus widget · Calendar entry · Live task badges · Time-aware greeting
 */
import React, { useMemo, useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Platform, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Sparkles, Leaf, TrendingUp, ShieldCheck, MapPin, ClipboardList,
  Beef, Package, ShoppingBag, FileText, Truck, Users, GraduationCap,
  Wallet, BarChart3, Cpu, Sprout, Bell, User, ChevronRight, Lock,
  Camera, Zap, Calendar, AlertTriangle, CheckCircle2, Clock3,
  BrainCircuit, Layers, Mic,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInDown, FadeIn, useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import { useAccess, useCan, Feature, roleLabel } from '../../lib/access';
import { useTasks } from '../../hooks/useTasks';

const { width: SW } = Dimensions.get('window');

// ── Types ──────────────────────────────────────────────────────────────────────

type FeatureEntry = {
  feature: Feature;
  label: string;
  labelEn: string;
  sub: string;
  subEn: string;
  route: string;
  icon: React.ReactNode;
  color: string;
  pinned?: boolean;
  isNew?: boolean;
};

// ── Feature list ──────────────────────────────────────────────────────────────

const ALL_FEATURES: FeatureEntry[] = [
  // AI
  { feature: 'ai_chat',              label: 'Sankofa AI',          labelEn: 'Sankofa AI',          sub: 'Mshauri wako wa AI',             subEn: 'Your AI advisor',            route: '/(tabs)/ai',         icon: <BrainCircuit size={20} color="#22d15a"/>,  color: '#22d15a', pinned: true },
  { feature: 'voice_assistant',      label: 'Sauti AI',            labelEn: 'Voice AI',            sub: 'Ongea na AI kwa sauti',          subEn: 'Talk to AI by voice',        route: '/ai-voice',          icon: <Mic size={20} color="#f59e0b"/>,           color: '#f59e0b' },
  { feature: 'photo_diagnosis',      label: 'Skani ya Mazao',      labelEn: 'Crop Scan',           sub: 'Tambua magonjwa ya mazao',       subEn: 'Diagnose crop disease',      route: '/scan',              icon: <Camera size={20} color="#22d15a"/>,        color: '#22d15a', pinned: true },
  { feature: 'analytics_predictive', label: 'Uchanganuzi wa AI',   labelEn: 'AI Analytics',        sub: 'Utabiri na takwimu',             subEn: 'Forecast & statistics',      route: '/analytics',         icon: <BarChart3 size={20} color="#f59e0b"/>,     color: '#f59e0b' },
  { feature: 'digital_farm_twin',    label: 'Shamba Dijiti',       labelEn: 'Digital Farm Twin',   sub: 'Mfano wa kidijiti wa shamba',    subEn: 'Digital farm model',         route: '/farm-twin',         icon: <Layers size={20} color="#8b5cf6"/>,        color: '#8b5cf6' },
  { feature: 'crop_planning',        label: 'Upangaji Mazao',      labelEn: 'Crop Planning',       sub: 'Panga mzunguko wa mazao',        subEn: 'Plan crop rotations',        route: '/crop-planning',     icon: <Sprout size={20} color="#22d15a"/>,        color: '#22d15a' },
  { feature: 'crop_library',         label: 'Maktaba ya Mazao',    labelEn: 'Crop Library',        sub: 'Miongozo ya kilimo',             subEn: 'Farming guides',             route: '/crop-library',      icon: <Leaf size={20} color="#22d15a"/>,          color: '#22d15a', pinned: true },
  // Market
  { feature: 'market_prices',        label: 'Bei za Soko',         labelEn: 'Market Prices',       sub: 'Bei za mazao ya sasa hivi',      subEn: 'Live crop prices',           route: '/market',            icon: <TrendingUp size={20} color="#22d15a"/>,    color: '#22d15a', pinned: true },
  { feature: 'contract_farming',     label: 'Mikataba',            labelEn: 'Contracts',           sub: 'Mkataba wa ukulima',             subEn: 'Farming contracts',          route: '/contracts',         icon: <FileText size={20} color="#8b5cf6"/>,      color: '#8b5cf6' },
  { feature: 'input_supply',         label: 'Wauzaji',             labelEn: 'Input Supply',        sub: 'Vifaa vya kilimo',               subEn: 'Farm supplies',              route: '/input-supply',      icon: <Truck size={20} color="#3b82f6"/>,         color: '#3b82f6' },
  { feature: 'marketplace',          label: 'Soko la Bidhaa',      labelEn: 'Marketplace',         sub: 'Nunua na uza mazao',             subEn: 'Buy and sell produce',       route: '/market',            icon: <ShoppingBag size={20} color="#22d15a"/>,   color: '#22d15a' },
  // Farm
  { feature: 'farm_mapping',         label: 'Ramani ya Shamba',    labelEn: 'Farm Map',            sub: 'GPS na safu za NDVI',            subEn: 'GPS & NDVI layers',          route: '/map',               icon: <MapPin size={20} color="#22d15a"/>,        color: '#22d15a', pinned: true },
  { feature: 'task_management',      label: 'Kalenda ya Shamba',   labelEn: 'Farm Calendar',       sub: 'Ratiba na kazi za shamba',       subEn: 'Schedule & farm tasks',      route: '/calendar',          icon: <Calendar size={20} color="#22d15a"/>,      color: '#22d15a', pinned: true, isNew: true },
  { feature: 'task_management',      label: 'Kazi',                labelEn: 'Tasks',               sub: 'Orodha ya kazi za shamba',       subEn: 'Farm task list',             route: '/tasks',             icon: <ClipboardList size={20} color="#64748b"/>, color: '#64748b' },
  { feature: 'livestock',            label: 'Mifugo',              labelEn: 'Livestock',           sub: 'Simamia mifugo yako',            subEn: 'Manage your livestock',      route: '/livestock',         icon: <Beef size={20} color="#f59e0b"/>,          color: '#f59e0b' },
  { feature: 'inventory',            label: 'Pembejeo',            labelEn: 'Inventory',           sub: 'Ghala na vifaa',                 subEn: 'Storage & supplies',         route: '/inventory',         icon: <Package size={20} color="#8b5cf6"/>,       color: '#8b5cf6' },
  { feature: 'offline_mode',         label: 'Nje ya Mtandao',      labelEn: 'Offline Mode',        sub: 'Skani bila mtandao',             subEn: 'Work without internet',      route: '/offline-queue',     icon: <Zap size={20} color="#64748b"/>,           color: '#64748b' },
  { feature: 'iot_systems',          label: 'IoT & Drones',        labelEn: 'IoT & Drones',        sub: 'Mifumo ya kisasa ya shamba',     subEn: 'Smart farm systems',         route: '/iot-systems',       icon: <Cpu size={20} color="#0ea5e9"/>,           color: '#0ea5e9' },
  { feature: 'soil_analysis',        label: 'Udongo & pH',         labelEn: 'Soil Analysis',       sub: 'Uchambuzi wa afya ya udongo',    subEn: 'Soil health analysis',       route: '/soil-analysis',     icon: <Leaf size={20} color="#a3e635"/>,          color: '#a3e635' },
  // Finance
  { feature: 'finance_tracker',      label: 'Daftari la Fedha',    labelEn: 'Finance Tracker',     sub: 'Matumizi na mapato',             subEn: 'Expenses & revenue',         route: '/finance',           icon: <BarChart3 size={20} color="#22d15a"/>,     color: '#22d15a', pinned: true },
  { feature: 'mobile_money',         label: 'M-Pesa / Airtel',     labelEn: 'Mobile Money',        sub: 'Tuma na pokea pesa',             subEn: 'Send & receive money',       route: '/mobile-money',      icon: <Wallet size={20} color="#22d15a"/>,        color: '#22d15a' },
  { feature: 'wallet_admin',         label: 'Pochi Msimamizi',     labelEn: 'Wallet Admin',        sub: 'Malipo na akaunti',              subEn: 'Payments & accounts',        route: '/wallet-admin',      icon: <Wallet size={20} color="#22d15a"/>,        color: '#22d15a' },
  { feature: 'insurance',            label: 'Bima',                labelEn: 'Insurance',           sub: 'Ulinzi wa mazao yako',           subEn: 'Protect your crops',         route: '/insurance',         icon: <ShieldCheck size={20} color="#8b5cf6"/>,   color: '#8b5cf6' },
  { feature: 'agro_id',              label: 'Agro ID',             labelEn: 'Agro ID',             sub: 'Kitambulisho · PDF ya P&L',      subEn: 'Identity · P&L PDF',         route: '/agro-id',           icon: <User size={20} color="#3b82f6"/>,          color: '#3b82f6' },
  // Community
  { feature: 'peer_groups',          label: 'Vikundi',             labelEn: 'Peer Groups',         sub: 'Vikundi vya wakulima',           subEn: 'Farmer groups',              route: '/peer-groups',       icon: <Users size={20} color="#8b5cf6"/>,         color: '#8b5cf6' },
  { feature: 'expert_consultations', label: 'Wataalamu',           labelEn: 'Experts',             sub: 'Ushauri wa wataalamu',           subEn: 'Expert consultations',       route: '/consultations',     icon: <GraduationCap size={20} color="#22d15a"/>, color: '#22d15a' },
  { feature: 'weather_alerts',       label: 'Hali ya Hewa',        labelEn: 'Weather',             sub: 'Utabiri wa hali ya hewa',        subEn: 'Weather forecast',           route: '/forecast',          icon: <Bell size={20} color="#f59e0b"/>,          color: '#f59e0b' },
];

const CATEGORIES = [
  {
    key: 'ai', title: 'Akili Bandia', titleEn: 'AI & Intelligence', color: '#22d15a', num: '01',
    features: ['ai_chat', 'voice_assistant', 'photo_diagnosis', 'analytics_predictive', 'digital_farm_twin', 'crop_planning', 'crop_library'] as Feature[],
  },
  {
    key: 'market', title: 'Soko & Biashara', titleEn: 'Market & Trade', color: '#f59e0b', num: '02',
    features: ['market_prices', 'contract_farming', 'input_supply', 'marketplace'] as Feature[],
  },
  {
    key: 'farm', title: 'Shamba', titleEn: 'Farm Management', color: '#22d15a', num: '03',
    features: ['task_management', 'farm_mapping', 'livestock', 'inventory', 'offline_mode', 'iot_systems', 'soil_analysis'] as Feature[],
  },
  {
    key: 'finance', title: 'Fedha', titleEn: 'Finance & ID', color: '#3b82f6', num: '04',
    features: ['finance_tracker', 'mobile_money', 'wallet_admin', 'insurance', 'agro_id'] as Feature[],
  },
  {
    key: 'community', title: 'Jamii', titleEn: 'Community', color: '#8b5cf6', num: '05',
    features: ['peer_groups', 'expert_consultations', 'weather_alerts'] as Feature[],
  },
];

// ── Live pulse dot ─────────────────────────────────────────────────────────────
function PulseDot({ color }: { color: string }) {
  const op = useSharedValue(1);
  useEffect(() => {
    op.value = withRepeat(withTiming(0.2, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);
  const s = useAnimatedStyle(() => ({ opacity: op.value }));
  return (
    <View style={{ width: 8, height: 8, position: 'relative' }}>
      <Animated.View style={[{ position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: color }, s]} />
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, opacity: 0.35 }} />
    </View>
  );
}

// ── Pinned card ────────────────────────────────────────────────────────────────
function PinnedCard({ item, overdueCnt }: { item: FeatureEntry; overdueCnt: number }) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const lang = useKilimoStore(s => s.language);
  const can = useCan(item.feature);
  const isCalendar = item.route === '/calendar';
  const label = lang === 'sw' ? item.label : item.labelEn;
  const sub   = lang === 'sw' ? item.sub   : item.subEn;

  return (
    <TouchableOpacity
      onPress={() => { if (!can) return; Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push(item.route as any); }}
      activeOpacity={0.78}
      style={{ width: (SW - 52) / 3, opacity: can ? 1 : 0.35 }}
    >
      <LinearGradient
        colors={[item.color + '1e', item.color + '07']}
        style={[pc.card, { borderColor: item.color + '35' }]}
      >
        {isCalendar && overdueCnt > 0 && (
          <View style={[pc.overdueDot, { backgroundColor: '#ef4444' }]}>
            <Text style={pc.overdueNum}>{overdueCnt > 9 ? '9+' : overdueCnt}</Text>
          </View>
        )}
        {item.isNew && (
          <View style={pc.newBadge}>
            <Text style={pc.newText}>NEW</Text>
          </View>
        )}
        <View style={[pc.iconRing, { backgroundColor: item.color + '1a', borderColor: item.color + '30' }]}>
          {item.icon}
        </View>
        <Text style={[pc.label, { color: colors.text }]} numberOfLines={1}>{label}</Text>
        <Text style={[pc.sub, { color: colors.textMute }]} numberOfLines={2}>{sub}</Text>
        {!can && <Lock size={10} color={colors.textMute} style={{ marginTop: 2 }} />}
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ── Feature row ────────────────────────────────────────────────────────────────
function FeatureRow({ item, isCalendar, overdueCnt }: { item: FeatureEntry; isCalendar?: boolean; overdueCnt?: number }) {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const lang = useKilimoStore(s => s.language);
  const access = useAccess(item.feature);
  const locked = access === 'none';
  const label = lang === 'sw' ? item.label : item.labelEn;
  const sub   = lang === 'sw' ? item.sub   : item.subEn;

  return (
    <TouchableOpacity
      onPress={() => { if (locked) return; Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(item.route as any); }}
      activeOpacity={locked ? 1 : 0.72}
      style={[fr.row, { opacity: locked ? 0.32 : 1 }]}
    >
      <View style={[fr.iconWrap, { backgroundColor: item.color + '18' }]}>
        {item.icon}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Text style={[fr.label, { color: colors.text }]}>{label}</Text>
          {access === 'basic' && !locked && (
            <View style={fr.basicBadge}><Text style={fr.basicText}>BASIC</Text></View>
          )}
          {item.isNew && (
            <View style={[fr.basicBadge, { backgroundColor: 'rgba(34,209,90,0.14)', borderColor: 'rgba(34,209,90,0.25)' }]}>
              <Text style={[fr.basicText, { color: '#22d15a' }]}>NEW</Text>
            </View>
          )}
        </View>
        <Text style={[fr.sub, { color: colors.textMute }]}>{sub}</Text>
      </View>
      {locked ? (
        <Lock size={14} color={colors.textMute} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {isCalendar && overdueCnt && overdueCnt > 0 ? (
            <View style={fr.countBadge}>
              <Text style={fr.countText}>{overdueCnt > 99 ? '99+' : overdueCnt}</Text>
            </View>
          ) : null}
          <ChevronRight size={15} color={colors.textMute} />
        </View>
      )}
    </TouchableOpacity>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────
export default function FeaturesScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const lang = useKilimoStore(s => s.language);
  const agroId = useKilimoStore(s => s.agroId);
  const role = (agroId?.role ?? 'farmer') as any;
  const name = agroId?.name ?? (lang === 'sw' ? 'Mkulima' : 'Farmer');
  const firstName = name.split(' ')[0];
  const { tasks } = useTasks();

  // Time-aware greeting
  const [hour] = useState(() => new Date().getHours());
  const greeting = useMemo(() => {
    if (lang === 'sw') {
      if (hour < 12) return `Habari ya asubuhi`;
      if (hour < 17) return `Habari ya mchana`;
      return `Habari ya jioni`;
    } else {
      if (hour < 12) return `Good morning`;
      if (hour < 17) return `Good afternoon`;
      return `Good evening`;
    }
  }, [hour, lang]);

  // Live task stats
  const todayKey = useMemo(() => {
    const t = new Date();
    return `${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`;
  }, []);

  const { pendingToday, overdueCount, doneToday } = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let pendingToday = 0, overdueCount = 0, doneToday = 0;
    tasks.forEach(t => {
      if (!t.dueDate) return;
      const due = new Date(t.dueDate);
      const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
      if (t.status === 'done') {
        if (dueDay.getTime() === todayStart.getTime()) doneToday++;
      } else if (t.status === 'pending') {
        if (dueDay.getTime() === todayStart.getTime()) pendingToday++;
        else if (dueDay.getTime() < todayStart.getTime()) overdueCount++;
      }
    });
    return { pendingToday, overdueCount, doneToday };
  }, [tasks]);

  // unique-feature pinned list (deduplicate routes)
  const pinnedItems = useMemo(() => {
    const seen = new Set<string>();
    return ALL_FEATURES.filter(f => {
      if (!f.pinned) return false;
      if (seen.has(f.route)) return false;
      seen.add(f.route);
      return true;
    });
  }, []);

  // category feature map (deduplicate by route per category)
  const featuresByCategory = useMemo(() => {
    const result: Record<string, FeatureEntry[]> = {};
    CATEGORIES.forEach(cat => {
      const seen = new Set<string>();
      const items: FeatureEntry[] = [];
      cat.features.forEach(feat => {
        const match = ALL_FEATURES.find(f => f.feature === feat && !seen.has(f.route));
        if (match) { seen.add(match.route); items.push(match); }
      });
      result[cat.key] = items;
    });
    return result;
  }, []);

  return (
    <View style={[s.root]}>
      <StatusBar barStyle="light-content" />

      {/* Deep forest background */}
      <LinearGradient colors={['#040e06', '#020804']} style={StyleSheet.absoluteFill} />

      {/* Ambient glows */}
      <View style={s.glow1} />
      <View style={s.glow2} />

      {/* Watermark */}
      <Text style={s.watermark} numberOfLines={1} allowFontScaling={false}>KILIMO</Text>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Header ──────────────────────────────────────────────── */}
          <Animated.View entering={FadeIn.duration(400)} style={s.header}>
            <View style={{ flex: 1 }}>
              <Text style={s.greetSub}>{greeting}</Text>
              <Text style={s.greetName} numberOfLines={1}>{firstName}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <PulseDot color="#22d15a" />
                <Text style={s.roleLabel}>{roleLabel(role)}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/agro-id' as any); }}
              activeOpacity={0.8}
              style={s.avatarBtn}
            >
              <LinearGradient colors={['#1a5c2a', '#0a3318']} style={s.avatar}>
                <Text style={s.avatarText}>{firstName.substring(0, 2).toUpperCase()}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* ── Today's Focus ────────────────────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(80).springify()} style={{ marginTop: 20 }}>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/calendar' as any); }}
              activeOpacity={0.82}
            >
              <LinearGradient
                colors={['#0c2a10', '#071408']}
                style={[s.focusCard, { borderColor: overdueCount > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(34,209,90,0.2)' }]}
              >
                {/* Left accent */}
                <LinearGradient
                  colors={overdueCount > 0 ? ['#ef4444', '#b91c1c'] : ['#22d15a', '#0a7a2a']}
                  style={s.focusAccent}
                />

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Calendar size={15} color={overdueCount > 0 ? '#ef4444' : '#22d15a'} />
                    <Text style={[s.focusTitle, { color: overdueCount > 0 ? '#ef4444' : '#22d15a' }]}>
                      {lang === 'sw' ? 'Ratiba ya Leo' : "Today's Focus"}
                    </Text>
                    {overdueCount > 0 && (
                      <View style={s.overdueChip}>
                        <AlertTriangle size={10} color="#ef4444" />
                        <Text style={s.overdueChipTxt}>{overdueCount} {lang === 'sw' ? 'imepita' : 'overdue'}</Text>
                      </View>
                    )}
                  </View>

                  <View style={s.statRow}>
                    <View style={s.statItem}>
                      <View style={[s.statIcon, { backgroundColor: 'rgba(34,209,90,0.12)' }]}>
                        <Clock3 size={13} color="#22d15a" />
                      </View>
                      <View>
                        <Text style={[s.statNum, { color: '#22d15a' }]}>{pendingToday}</Text>
                        <Text style={s.statLbl}>{lang === 'sw' ? 'Zinangoja' : 'Pending'}</Text>
                      </View>
                    </View>
                    <View style={s.statDivider} />
                    <View style={s.statItem}>
                      <View style={[s.statIcon, { backgroundColor: 'rgba(100,116,139,0.12)' }]}>
                        <CheckCircle2 size={13} color="#64748b" />
                      </View>
                      <View>
                        <Text style={[s.statNum, { color: '#64748b' }]}>{doneToday}</Text>
                        <Text style={s.statLbl}>{lang === 'sw' ? 'Zimekamilika' : 'Done today'}</Text>
                      </View>
                    </View>
                    {overdueCount > 0 && (
                      <>
                        <View style={s.statDivider} />
                        <View style={s.statItem}>
                          <View style={[s.statIcon, { backgroundColor: 'rgba(239,68,68,0.12)' }]}>
                            <AlertTriangle size={13} color="#ef4444" />
                          </View>
                          <View>
                            <Text style={[s.statNum, { color: '#ef4444' }]}>{overdueCount}</Text>
                            <Text style={s.statLbl}>{lang === 'sw' ? 'Imepita' : 'Overdue'}</Text>
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                </View>

                <View style={s.focusArrow}>
                  <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* ── Quick Launch ─────────────────────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(140).springify()} style={{ marginTop: 28 }}>
            <View style={s.secRow}>
              <Text style={s.secLabel}>{lang === 'sw' ? 'FUNGUA HARAKA' : 'QUICK LAUNCH'}</Text>
              <View style={[s.secLine, { backgroundColor: 'rgba(34,209,90,0.15)' }]} />
            </View>
            <View style={s.pinnedGrid}>
              {pinnedItems.map((item, i) => (
                <Animated.View key={`${item.feature}-${item.route}`} entering={FadeInDown.delay(160 + i * 40).springify()}>
                  <PinnedCard item={item} overdueCnt={overdueCount} />
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* ── Category sections ────────────────────────────────────── */}
          {CATEGORIES.map((cat, catIdx) => {
            const items = featuresByCategory[cat.key] || [];
            return (
              <Animated.View
                key={cat.key}
                entering={FadeInDown.delay(220 + catIdx * 80).springify()}
                style={{ marginTop: 28 }}
              >
                {/* Section header */}
                <View style={s.catHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <Text style={[s.catNum, { color: cat.color + '55' }]}>{cat.num}</Text>
                    <View>
                      <Text style={[s.catTitle, { color: colors.text }]}>
                        {lang === 'sw' ? cat.title : cat.titleEn}
                      </Text>
                      <Text style={[s.catSub, { color: colors.textMute }]}>
                        {items.length} {lang === 'sw' ? 'vipengele' : 'features'}
                      </Text>
                    </View>
                  </View>
                  <View style={[s.catDot, { backgroundColor: cat.color }]} />
                </View>

                <View style={[s.catCard, { borderColor: cat.color + '1e', backgroundColor: 'rgba(6,15,8,0.92)' }]}>
                  <View style={[s.catAccent, { backgroundColor: cat.color }]} />
                  {items.map((item, idx) => (
                    <View key={`${item.feature}-${item.route}-${idx}`}>
                      <FeatureRow
                        item={item}
                        isCalendar={item.route === '/calendar'}
                        overdueCnt={overdueCount}
                      />
                      {idx < items.length - 1 && (
                        <View style={[s.divider, { backgroundColor: 'rgba(34,209,90,0.06)', marginLeft: 70 }]} />
                      )}
                    </View>
                  ))}
                </View>
              </Animated.View>
            );
          })}

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root:       { flex: 1 },
  scroll:     { paddingHorizontal: 18, paddingTop: Platform.OS === 'ios' ? 4 : 16 },

  glow1:      { position: 'absolute', width: 320, height: 320, borderRadius: 160, top: -60, right: -80, backgroundColor: 'rgba(34,209,90,0.06)' },
  glow2:      { position: 'absolute', width: 240, height: 240, borderRadius: 120, bottom: 80, left: -60, backgroundColor: 'rgba(10,61,24,0.08)' },
  watermark:  { position: 'absolute', bottom: 120, right: -30, fontSize: 130, fontFamily: 'InstrumentSerif_400Regular', color: 'rgba(255,255,255,0.022)', letterSpacing: -4, zIndex: 0 },

  // Header
  header:     { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 12 },
  greetSub:   { fontSize: 12, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.38)', letterSpacing: 0.3, marginBottom: 2 },
  greetName:  { fontSize: 28, fontFamily: 'InstrumentSerif_400Regular', color: '#fff', letterSpacing: -0.5 },
  roleLabel:  { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: 'rgba(255,255,255,0.45)', textTransform: 'capitalize' },
  avatarBtn:  {},
  avatar:     { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontFamily: 'InstrumentSerif_400Regular', color: '#22d15a' },

  // Today's Focus
  focusCard:  { borderRadius: 20, borderWidth: 1, padding: 18, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', gap: 12 },
  focusAccent:{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, borderRadius: 2 },
  focusTitle: { fontSize: 12, fontFamily: 'Inter_700Bold', letterSpacing: 0.8, textTransform: 'uppercase' },
  focusArrow: { justifyContent: 'center', alignItems: 'center' },

  overdueChip:    { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(239,68,68,0.12)', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  overdueChipTxt: { fontSize: 10, fontFamily: 'Inter_700Bold', color: '#ef4444' },

  statRow:    { flexDirection: 'row', alignItems: 'center', gap: 0 },
  statItem:   { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  statIcon:   { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  statNum:    { fontSize: 18, fontFamily: 'InstrumentSerif_400Regular', lineHeight: 20 },
  statLbl:    { fontSize: 10, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.35)', marginTop: 1 },
  statDivider:{ width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.07)', marginHorizontal: 12 },

  // Quick launch
  secRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  secLabel:   { fontSize: 10, fontFamily: 'Inter_800ExtraBold', color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5 },
  secLine:    { flex: 1, height: 1 },
  pinnedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  // Categories
  catHeader:  { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10, gap: 0 },
  catNum:     { fontSize: 38, fontFamily: 'InstrumentSerif_400Regular', lineHeight: 40, marginRight: 4 },
  catTitle:   { fontSize: 17, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.3 },
  catSub:     { fontSize: 10, fontFamily: 'Inter_500Medium', marginTop: 1 },
  catDot:     { width: 7, height: 7, borderRadius: 3.5, marginBottom: 6 },

  catCard:    { borderRadius: 20, borderWidth: 1, overflow: 'hidden', position: 'relative' },
  catAccent:  { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
  divider:    { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.05)' },
});

const pc = StyleSheet.create({
  card:       { borderRadius: 18, borderWidth: 1, padding: 14, gap: 7, minHeight: 100, position: 'relative' },
  iconRing:   { width: 40, height: 40, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  label:      { fontSize: 12, fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.2, color: '#fff' },
  sub:        { fontSize: 10, fontFamily: 'Inter_500Medium', lineHeight: 14, color: 'rgba(255,255,255,0.45)' },
  overdueDot: { position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  overdueNum: { fontSize: 9, fontFamily: 'Inter_800ExtraBold', color: '#fff' },
  newBadge:   { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(34,209,90,0.25)', borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2, zIndex: 2 },
  newText:    { fontSize: 8, fontFamily: 'Inter_800ExtraBold', color: '#22d15a', letterSpacing: 0.8 },
});

const fr = StyleSheet.create({
  row:        { flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 16, paddingVertical: 14 },
  iconWrap:   { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  label:      { fontSize: 14, fontFamily: 'Inter_700Bold', marginBottom: 1, color: '#fff' },
  sub:        { fontSize: 11, fontFamily: 'Inter_500Medium', lineHeight: 15 },
  basicBadge: { backgroundColor: 'rgba(245,158,11,0.14)', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(245,158,11,0.25)' },
  basicText:  { color: '#f59e0b', fontSize: 9, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.8 },
  countBadge: { backgroundColor: '#ef4444', borderRadius: 8, minWidth: 20, height: 20, paddingHorizontal: 5, justifyContent: 'center', alignItems: 'center' },
  countText:  { fontSize: 10, fontFamily: 'Inter_800ExtraBold', color: '#fff' },
});
