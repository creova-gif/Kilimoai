/**
 * Soil Analysis — Enhanced v2
 * Hero · NPK status · 7-day trend · farm zones · IoT sensors · anomaly alerts
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ImageBackground, Platform, Dimensions, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft, Sprout, ArrowUpRight, Wifi, WifiOff, Battery,
  AlertTriangle, CheckCircle2, MapPin, Cpu, TrendingUp,
  TrendingDown, Minus, Activity, RefreshCw, Zap, Info,
} from 'lucide-react-native';
import { useTheme } from '../constants/Theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useKilimoStore } from '../store/useKilimoStore';

const { width: SW } = Dimensions.get('window');
const fmt = (n: number) => n.toFixed(0);

// ─── Mock historical data (7-day NPK trend) ──────────────────────────────────
const TREND_DAYS = ['J', 'I', 'I', 'A', 'J', 'S', 'S'];
const TREND_N = [72, 76, 79, 83, 81, 86, 85];
const TREND_P = [62, 64, 68, 67, 70, 69, 70];
const TREND_K = [50, 54, 57, 59, 57, 61, 60];

// ─── Farm zones ──────────────────────────────────────────────────────────────
const ZONES = [
  { id: 'A', name: 'Kanda A', label: 'Kaskazini', N: 92, P: 78, K: 65, status: 'good'      },
  { id: 'B', name: 'Kanda B', label: 'Mashariki', N: 71, P: 55, K: 43, status: 'attention' },
  { id: 'C', name: 'Kanda C', label: 'Kusini',    N: 85, P: 68, K: 70, status: 'good'      },
  { id: 'D', name: 'Kanda D', label: 'Magharibi', N: 44, P: 38, K: 31, status: 'critical'  },
];

// ─── IoT sensors ─────────────────────────────────────────────────────────────
const SENSORS = [
  { id: 's1', name: 'SM-3 · Kanda A',   type: 'Udongo NPK', zone: 'A', battery: 87, online: true,  sync: 'Dakika 2 zilizopita'  },
  { id: 's2', name: 'SM-3 · Kanda B',   type: 'Udongo NPK', zone: 'B', battery: 45, online: true,  sync: 'Dakika 5 zilizopita'  },
  { id: 's3', name: 'WS-01 · Central',  type: 'Hali ya Hewa', zone: '–', battery: 78, online: true, sync: 'Dakika 1 iliyopita'   },
  { id: 's4', name: 'SM-3 · Kanda D',   type: 'Udongo NPK', zone: 'D', battery: 12, online: false, sync: 'Saa 3 zilizopita'     },
];

// ─── Anomalies ────────────────────────────────────────────────────────────────
const ANOMALIES = [
  { id: 'an1', zone: 'D', nutrient: 'N·P·K', level: 44, title: 'Upungufu mkubwa — Kanda D', desc: 'Viwango vyote vya virutubisho viko chini ya 50%. Inahitaji hatua ya haraka.', severity: 'critical' },
  { id: 'an2', zone: 'B', nutrient: 'K',     level: 43, title: 'Potasiamu (K) chini — Kanda B', desc: 'Kiwango cha Potasiamu ni 43% — chini ya kiwango cha salama (55%). Ongeza Sulfate ya Potasiamu.', severity: 'warning' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusColor = (s: string) =>
  s === 'critical' ? '#ef4444' : s === 'attention' ? '#f59e0b' : '#22d15a';
const statusLabel = (s: string) =>
  s === 'critical' ? 'Hatari' : s === 'attention' ? 'Tahadhari' : 'Nzuri';
const nutrientColor = (label: string) =>
  label === 'N' ? '#22d15a' : label === 'P' ? '#f59e0b' : '#3b82f6';

// ─── Sparkline chart for one nutrient ────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const barW = (SW - 80) / 8;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 36, gap: 3 }}>
      {data.map((v, i) => (
        <View
          key={i}
          style={{
            width: barW,
            height: Math.max(4, (v / max) * 36),
            borderRadius: 3,
            backgroundColor: i === data.length - 1 ? color : color + '55',
          }}
        />
      ))}
    </View>
  );
}

// ─── Nutrient bar ─────────────────────────────────────────────────────────────
function NutrientBar({ label, value, colors }: { label: string; value: number; colors: any }) {
  const c = nutrientColor(label);
  const trend = label === 'N' ? 'up' : label === 'P' ? 'flat' : 'up';
  return (
    <View style={S.barItem}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={[S.barDot, { backgroundColor: c }]} />
          <Text style={[S.barLabel, { color: colors.text }]}>{label === 'N' ? 'Nitrojeni (N)' : label === 'P' ? 'Fosforasi (P)' : 'Potasiamu (K)'}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {trend === 'up' ? <TrendingUp size={12} color="#22d15a" /> : <Minus size={12} color="#f59e0b" />}
          <Text style={[S.barValue, { color: value >= 70 ? '#22d15a' : value >= 50 ? '#f59e0b' : '#ef4444' }]}>{value}%</Text>
        </View>
      </View>
      <View style={[S.barTrack, { backgroundColor: colors.border }]}>
        <LinearGradient
          colors={[c + 'aa', c]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={[S.barFill, { width: `${value}%` }]}
        />
      </View>
    </View>
  );
}

// ─── Zone card ────────────────────────────────────────────────────────────────
function ZoneCard({ z, colors, isDark }: { z: typeof ZONES[0]; colors: any; isDark: boolean }) {
  const sc = statusColor(z.status);
  return (
    <View style={[S.zoneCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: z.status === 'critical' ? '#ef444430' : z.status === 'attention' ? '#f59e0b30' : colors.border }]}>
      <View style={S.zoneTop}>
        <View style={[S.zoneBadge, { backgroundColor: sc + '18' }]}>
          <Text style={[S.zoneBadgeText, { color: sc }]}>{z.name}</Text>
        </View>
        <View style={[S.zoneStatus, { backgroundColor: sc + '15', borderColor: sc + '30' }]}>
          <View style={[S.zoneStatusDot, { backgroundColor: sc }]} />
          <Text style={[S.zoneStatusText, { color: sc }]}>{statusLabel(z.status)}</Text>
        </View>
      </View>
      <Text style={[S.zoneLabel, { color: colors.textMute }]}>{z.label}</Text>
      <View style={S.zoneMetrics}>
        {[['N', z.N], ['P', z.P], ['K', z.K]].map(([l, v]) => (
          <View key={l as string} style={S.zoneMetric}>
            <Text style={[S.zoneMetricLabel, { color: nutrientColor(l as string) }]}>{l}</Text>
            <Text style={[S.zoneMetricValue, { color: (v as number) < 50 ? '#ef4444' : colors.text }]}>{v}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function SoilAnalysis() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const language = useKilimoStore((s) => s.language);
  const sw = language === 'sw';
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1400);
  }

  const avgN = Math.round(ZONES.reduce((a, z) => a + z.N, 0) / ZONES.length);
  const avgP = Math.round(ZONES.reduce((a, z) => a + z.P, 0) / ZONES.length);
  const avgK = Math.round(ZONES.reduce((a, z) => a + z.K, 0) / ZONES.length);
  const overallHealth = avgN >= 70 && avgP >= 60 ? 'Bora' : avgN >= 55 ? 'Wastani' : 'Dhaifu';
  const healthColor = overallHealth === 'Bora' ? '#22d15a' : overallHealth === 'Wastani' ? '#f59e0b' : '#ef4444';

  return (
    <View style={[S.root, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

        {/* ── Hero ────────────────────────────────────── */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800' }}
          style={S.hero}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.1)', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
          <SafeAreaView edges={['top']} style={S.heroSafe}>
            <View style={S.heroNav}>
              <TouchableOpacity
                onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
                style={S.backBtn}
              >
                <ChevronLeft color="#fff" size={22} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRefresh} style={S.refreshBtn}>
                <RefreshCw size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={S.heroBottom}>
              <View style={S.heroBadge}>
                <Sprout size={12} color="#22d15a" />
                <Text style={S.heroBadgeText}>UDONGO · SOIL ANALYSIS</Text>
              </View>
              <Text style={S.heroTitle}>{sw ? 'Hali ya Udongo' : 'Soil Analysis'}</Text>
              <Text style={S.heroSub}>{sw ? 'Kanda 4 · Sensorer 4 zilizounganishwa' : '4 zones · 4 sensors connected'}</Text>
            </View>
          </SafeAreaView>
        </ImageBackground>

        <View style={S.content}>

          {/* ── Anomaly Alerts ──────────────────────── */}
          {ANOMALIES.map((a, i) => (
            <Animated.View key={a.id} entering={FadeInDown.delay(i * 50).springify()}>
              <View style={[S.anomaly, { backgroundColor: (a.severity === 'critical' ? '#ef4444' : '#f59e0b') + '12', borderColor: (a.severity === 'critical' ? '#ef4444' : '#f59e0b') + '35' }]}>
                <AlertTriangle size={16} color={a.severity === 'critical' ? '#ef4444' : '#f59e0b'} />
                <View style={{ flex: 1 }}>
                  <Text style={[S.anomalyTitle, { color: a.severity === 'critical' ? '#ef4444' : '#f59e0b' }]}>{a.title}</Text>
                  <Text style={[S.anomalyDesc, { color: colors.textMute }]}>{a.desc}</Text>
                </View>
              </View>
            </Animated.View>
          ))}

          {/* ── Overall NPK Card ─────────────────────── */}
          <Animated.View entering={FadeInDown.delay(80).springify()}>
            <View style={[S.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: colors.border }]}>
              <View style={S.cardHeader}>
                <View>
                  <Text style={[S.cardLabel, { color: colors.textMute }]}>{sw ? 'Afya ya Jumla' : 'Overall Health'}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={[S.overallLabel, { color: colors.text }]}>{overallHealth}</Text>
                    <View style={[S.overallBadge, { backgroundColor: healthColor + '18' }]}>
                      <TrendingUp size={11} color={healthColor} />
                      <Text style={[S.overallBadgeText, { color: healthColor }]}>+12% {sw ? 'wiki hii' : 'this week'}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => Alert.alert('NPK Info', 'N=Nitrojeni (ukuaji wa majani), P=Fosforasi (mizizi/maua), K=Potasiamu (nguvu ya mmea).')}
                  style={[S.infoBtn, { backgroundColor: colors.card }]}
                >
                  <Info size={18} color={colors.textMute} />
                </TouchableOpacity>
              </View>
              <View style={S.barsWrap}>
                <NutrientBar label="N" value={avgN} colors={colors} />
                <NutrientBar label="P" value={avgP} colors={colors} />
                <NutrientBar label="K" value={avgK} colors={colors} />
              </View>
            </View>
          </Animated.View>

          {/* ── 7-day Trend ─────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(110).springify()}>
            <SectionTitle label={sw ? 'Mwenendo wa Siku 7' : '7-Day Trend'} colors={colors} />
            <View style={[S.card, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: colors.border, gap: 16 }]}>
              {[{ label: 'N', data: TREND_N, color: '#22d15a' }, { label: 'P', data: TREND_P, color: '#f59e0b' }, { label: 'K', data: TREND_K, color: '#3b82f6' }].map((t) => (
                <View key={t.label}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={[S.trendLabel, { color: t.color }]}>
                      {t.label === 'N' ? 'Nitrojeni' : t.label === 'P' ? 'Fosforasi' : 'Potasiamu'}
                    </Text>
                    <Text style={[S.trendValue, { color: colors.textMute }]}>
                      {t.data[t.data.length - 1]}% · {t.data[t.data.length - 1] > t.data[0] ? '↑' : t.data[t.data.length - 1] < t.data[0] ? '↓' : '→'}{' '}
                      {Math.abs(t.data[t.data.length - 1] - t.data[0])} pts
                    </Text>
                  </View>
                  <Sparkline data={t.data} color={t.color} />
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ── Farm Zones ──────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(140).springify()}>
            <SectionTitle label={sw ? 'Kanda za Shamba' : 'Farm Zones'} colors={colors} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {ZONES.map((z) => (
                <ZoneCard key={z.id} z={z} colors={colors} isDark={isDark} />
              ))}
            </View>
          </Animated.View>

          {/* ── IoT Sensors ─────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(170).springify()}>
            <SectionTitle label={sw ? 'Sensorer za IoT' : 'IoT Sensors'} colors={colors} />
            <View style={{ gap: 8 }}>
              {SENSORS.map((s) => (
                <View key={s.id} style={[S.sensorRow, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: !s.online ? '#ef444430' : colors.border }]}>
                  <View style={[S.sensorIcon, { backgroundColor: s.online ? '#22d15a15' : '#ef444415' }]}>
                    {s.online ? <Wifi size={16} color="#22d15a" /> : <WifiOff size={16} color="#ef4444" />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[S.sensorName, { color: colors.text }]}>{s.name}</Text>
                    <Text style={[S.sensorType, { color: colors.textMute }]}>{s.type} · {s.sync}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Battery size={12} color={s.battery > 20 ? '#22d15a' : '#ef4444'} />
                      <Text style={[S.sensorBattery, { color: s.battery > 20 ? '#22d15a' : '#ef4444' }]}>{s.battery}%</Text>
                    </View>
                    <View style={[S.onlineDot, { backgroundColor: s.online ? '#22d15a' : '#ef4444' }]} />
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ── Recommendations ─────────────────────── */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <SectionTitle label={sw ? 'Mapendekezo ya Dharura' : 'Urgent Recommendations'} colors={colors} />
            <View style={{ gap: 12 }}>
              <RecCard
                title={sw ? 'Ongeza Urea — Kanda D' : 'Apply Urea — Zone D'}
                desc={sw ? 'Nitrojeni ni 44% tu. Weka Urea kg 25/ekari haraka iwezekanavyo.' : 'Nitrogen critically low at 44%. Apply 25kg/acre Urea immediately.'}
                cost="TZS 47,500"
                severity="critical"
                onPress={() => router.push('/tasks' as any)}
                colors={colors}
              />
              <RecCard
                title={sw ? 'Sulfate ya Potasiamu — Kanda B' : 'Potassium Sulphate — Zone B'}
                desc={sw ? 'K chini ya 45%. Weka MOP au SOP kg 20/ekari kabla ya wiki 2.' : 'K below 45%. Apply MOP or SOP 20kg/acre within 2 weeks.'}
                cost="TZS 38,000"
                severity="warning"
                onPress={() => router.push('/consultations' as any)}
                colors={colors}
              />
              <RecCard
                title={sw ? 'Weka Mbolea ya Hiari — Kanda C' : 'Maintenance Fertilizer — Zone C'}
                desc={sw ? 'Viwango viko vizuri. Weka CAN kg 15/ekari kwa kuzuia kushuka.' : 'Levels are good. Apply CAN 15kg/acre as maintenance dose.'}
                cost="TZS 28,500"
                severity="info"
                onPress={() => router.push('/input-supply' as any)}
                colors={colors}
              />
            </View>
          </Animated.View>

        </View>
      </ScrollView>
    </View>
  );
}

// ─── Section title ────────────────────────────────────────────────────────────
function SectionTitle({ label, colors }: { label: string; colors: any }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 24, marginBottom: 12 }}>
      <View style={{ width: 3, height: 14, borderRadius: 2, backgroundColor: '#22d15a' }} />
      <Text style={{ fontSize: 10, fontFamily: 'Inter_800ExtraBold', color: colors.textMute, letterSpacing: 1.5 }}>{label.toUpperCase()}</Text>
    </View>
  );
}

// ─── Recommendation card ──────────────────────────────────────────────────────
function RecCard({ title, desc, cost, severity, onPress, colors }: {
  title: string; desc: string; cost: string; severity: string; onPress: () => void; colors: any;
}) {
  const c = severity === 'critical' ? '#ef4444' : severity === 'warning' ? '#f59e0b' : '#22d15a';
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View style={[S.recCard, { borderColor: c + '30', backgroundColor: c + '08' }]}>
        <View style={[S.recLeft, { backgroundColor: c + '18' }]}>
          {severity === 'critical' ? <AlertTriangle size={18} color={c} /> : severity === 'warning' ? <AlertTriangle size={18} color={c} /> : <CheckCircle2 size={18} color={c} />}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[S.recTitle, { color: c }]}>{title}</Text>
          <Text style={[S.recDesc, { color: colors.textMute }]}>{desc}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <View style={[S.costBadge, { backgroundColor: c + '15' }]}>
              <Text style={[S.costText, { color: c }]}>{cost}</Text>
            </View>
            <Text style={[S.viewMore, { color: c }]}>Angalia →</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  root: { flex: 1 },
  hero: { width: '100%', height: 240, justifyContent: 'flex-start' },
  heroSafe: { flex: 1, justifyContent: 'space-between', paddingBottom: 24 },
  heroNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 4 : 16 },
  heroBottom: { paddingHorizontal: 20, gap: 4 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  heroBadgeText: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', color: '#22d15a', letterSpacing: 1.5 },
  heroTitle: { fontSize: 28, fontFamily: 'InstrumentSerif_400Regular', color: '#fff', letterSpacing: -0.5 },
  heroSub: { fontSize: 12, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.7)' },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.38)', justifyContent: 'center', alignItems: 'center' },
  refreshBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.38)', justifyContent: 'center', alignItems: 'center' },

  content: { paddingHorizontal: 20, paddingTop: 20 },

  anomaly: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
  anomalyTitle: { fontSize: 13, fontFamily: 'Inter_800ExtraBold', marginBottom: 2 },
  anomalyDesc: { fontSize: 12, fontFamily: 'Inter_500Medium', lineHeight: 16 },

  card: { borderRadius: 18, borderWidth: 1, padding: 18, marginBottom: 0 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  cardLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 0.5, marginBottom: 4 },
  overallLabel: { fontSize: 26, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.5 },
  overallBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  overallBadgeText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  infoBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  barsWrap: { gap: 16 },

  barItem: {},
  barDot: { width: 8, height: 8, borderRadius: 4 },
  barLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  barValue: { fontSize: 13, fontFamily: 'Inter_800ExtraBold' },
  barTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },

  trendLabel: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  trendValue: { fontSize: 11, fontFamily: 'Inter_500Medium' },

  zoneCard: { width: (SW - 52) / 2, borderRadius: 16, borderWidth: 1, padding: 14 },
  zoneTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  zoneBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  zoneBadgeText: { fontSize: 11, fontFamily: 'Inter_800ExtraBold' },
  zoneStatus: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  zoneStatusDot: { width: 5, height: 5, borderRadius: 3 },
  zoneStatusText: { fontSize: 9, fontFamily: 'Inter_800ExtraBold' },
  zoneLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', marginBottom: 10 },
  zoneMetrics: { flexDirection: 'row', gap: 8 },
  zoneMetric: { alignItems: 'center', gap: 2 },
  zoneMetricLabel: { fontSize: 10, fontFamily: 'Inter_800ExtraBold' },
  zoneMetricValue: { fontSize: 13, fontFamily: 'InstrumentSerif_400Regular' },

  sensorRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  sensorIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  sensorName: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  sensorType: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 2 },
  sensorBattery: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  onlineDot: { width: 7, height: 7, borderRadius: 4 },

  recCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 0, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  recLeft: { width: 52, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 16, alignSelf: 'stretch' },
  recTitle: { fontSize: 13, fontFamily: 'Inter_800ExtraBold', marginBottom: 4, paddingTop: 14, paddingRight: 14 },
  recDesc: { fontSize: 12, fontFamily: 'Inter_500Medium', lineHeight: 17, paddingRight: 14 },
  costBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  costText: { fontSize: 11, fontFamily: 'Inter_800ExtraBold' },
  viewMore: { fontSize: 12, fontFamily: 'Inter_700Bold', marginBottom: 12 },
});
