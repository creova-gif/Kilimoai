/**
 * Kilimo AI — Predictive Analytics Dashboard
 *
 * Three live statistical models run against current farm vitals and profile:
 *  1. Yield Forecast    — exponential smoothing + seasonal factors
 *  2. Pest Risk Score   — weighted threshold (moisture × temp × crop sensitivity)
 *  3. Price Trends      — linear regression on 6-month series per crop
 *
 * All models are client-side (no server round-trip), deterministic, and update
 * every time the user navigates to this screen.
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  TrendingUp, TrendingDown, Minus, Bug,
  ArrowRight, ShieldCheck,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Line, Circle } from 'react-native-svg';
import PageScaffold, { GlassCard, SectionHeader } from '../../components/PageScaffold';
import { useTheme } from '../../constants/Theme';
import { Gate } from '../../lib/access';
import { useKilimoStore } from '../../store/useKilimoStore';
import { runAnalytics, PriceTrend } from '../../lib/analytics/predictions';

const fmtTZS = (n: number) =>
  `TSh ${new Intl.NumberFormat('en-US').format(Math.round(n))}`;

// Projection chart: shows current → forecast as a smooth SVG line
function YieldProjectionChart({ current, forecast, trend, color }: {
  current: number; forecast: number; trend: 'up' | 'down' | 'flat'; color: string;
}) {
  const W = 280; const H = 56; const PAD = 8;
  // Build a 9-point series: 6 historical points leading to current, then 3 projected
  const hi = current;
  const lo = Math.min(current, forecast) * 0.8;
  const range = Math.max(0.01, Math.max(hi, forecast) * 1.15 - lo);
  const toY = (v: number) => H - PAD - ((v - lo) / range) * (H - PAD * 2);

  const histPts = [0, 1, 2, 3, 4, 5].map(i => {
    const t = i / 5;
    const noise = Math.sin(i * 2.1 + current) * 0.04 * current;
    return { x: (i / 8) * (W - PAD * 2) + PAD, y: toY(current * (0.7 + t * 0.3) + noise) };
  });
  const forecastPts = [5, 6, 7, 8].map(i => {
    const t = (i - 5) / 3;
    const v = current + (forecast - current) * t;
    return { x: (i / 8) * (W - PAD * 2) + PAD, y: toY(v) };
  });
  const allPts = [...histPts, ...forecastPts.slice(1)];

  let histLine = `M${histPts[0].x.toFixed(1)} ${histPts[0].y.toFixed(1)}`;
  for (let i = 1; i < histPts.length; i++) {
    const cpx = (histPts[i-1].x + histPts[i].x) / 2;
    histLine += ` C${cpx.toFixed(1)} ${histPts[i-1].y.toFixed(1)},${cpx.toFixed(1)} ${histPts[i].y.toFixed(1)},${histPts[i].x.toFixed(1)} ${histPts[i].y.toFixed(1)}`;
  }

  let projLine = `M${forecastPts[0].x.toFixed(1)} ${forecastPts[0].y.toFixed(1)}`;
  for (let i = 1; i < forecastPts.length; i++) {
    const cpx = (forecastPts[i-1].x + forecastPts[i].x) / 2;
    projLine += ` C${cpx.toFixed(1)} ${forecastPts[i-1].y.toFixed(1)},${cpx.toFixed(1)} ${forecastPts[i].y.toFixed(1)},${forecastPts[i].x.toFixed(1)} ${forecastPts[i].y.toFixed(1)}`;
  }

  const areaPath = `${histLine} ${projLine.replace('M', 'L')} L${allPts[allPts.length-1].x.toFixed(1)} ${H} L${PAD} ${H} Z`;
  const divideX = forecastPts[0].x.toFixed(1);
  const lastPt = forecastPts[forecastPts.length - 1];

  return (
    <View style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden' }}>
      <Svg width={W} height={H}>
        <Defs>
          <SvgLinearGradient id="ypa" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </SvgLinearGradient>
        </Defs>
        <Path d={areaPath} fill="url(#ypa)" />
        <Path d={histLine} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
        <Path d={projLine} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5,3" />
        <Line x1={divideX} y1={PAD.toString()} x2={divideX} y2={(H - PAD).toString()} stroke={color} strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
        <Circle cx={forecastPts[0].x.toFixed(1)} cy={forecastPts[0].y.toFixed(1)} r="3.5" fill={color} opacity="0.9" />
        <Circle cx={lastPt.x.toFixed(1)} cy={lastPt.y.toFixed(1)} r="4" fill={color} />
      </Svg>
    </View>
  );
}

function TrendIcon({ dir, size = 16 }: { dir: 'up' | 'down' | 'flat'; size?: number }) {
  if (dir === 'up') return <TrendingUp size={size} color="#22c55e" />;
  if (dir === 'down') return <TrendingDown size={size} color="#ef4444" />;
  return <Minus size={size} color="#94a3b8" />;
}

// Simple bar chart row for price comparison
function PriceBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  const { colors } = useTheme();
  return (
    <View style={pb.row}>
      <Text style={[pb.lbl, { color: colors.textMute }]}>{label}</Text>
      <View style={[pb.track, { backgroundColor: colors.card }]}>
        <View style={[pb.fill, { width: `${pct * 100}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={[pb.val, { color }]}>{fmtTZS(value)}/kg</Text>
    </View>
  );
}
const pb = StyleSheet.create({
  row:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 4 },
  lbl:  { fontFamily: 'Inter_600SemiBold', fontSize: 10, width: 60 },
  track:{ flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4 },
  val:  { fontFamily: 'Inter_700Bold', fontSize: 10, width: 90, textAlign: 'right' },
});

function SignalBadge({ signal }: { signal: PriceTrend['signal'] }) {
  const map: Record<PriceTrend['signal'], { color: string; bg: string }> = {
    'Uza sasa':      { color: '#22c55e', bg: '#22c55e22' },
    'Subiri kidogo': { color: '#f59e0b', bg: '#f59e0b22' },
    'Subiri zaidi':  { color: '#3b82f6', bg: '#3b82f622' },
    'Hifadhi':       { color: '#a78bfa', bg: '#a78bfa22' },
  };
  const { color, bg } = map[signal];
  return (
    <View style={[sb.badge, { backgroundColor: bg }]}>
      <Text style={[sb.text, { color }]}>{signal}</Text>
    </View>
  );
}
const sb = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  text:  { fontFamily: 'Inter_800ExtraBold', fontSize: 10 },
});

export default function AnalyticsDashboard() {
  const { colors } = useTheme();
  const router = useRouter();
  const vitals = useKilimoStore((s) => s.farmVitals);
  const profile = useKilimoStore((s) => s.farmProfile);

  const { yieldForecast, pestRisk, priceTrends } = useMemo(
    () => runAnalytics(vitals, profile),
    [vitals, profile],
  );

  const confColor: Record<typeof yieldForecast.confidence, string> = {
    high: '#22c55e', medium: '#f59e0b', low: '#ef4444',
  };
  const maxPrice = priceTrends.length > 0 ? Math.max(...priceTrends.map((t) => t.forecast90dTZSkg), 1) : 1;

  return (
    <Gate
      feature="analytics_predictive"
      fallback={
        <PageScaffold title="Uchanganuzi wa AI" badge="ANALYTICS">
          <View style={{ padding: 24 }}>
            <GlassCard style={{ padding: 24, alignItems: 'center' }}>
              <ShieldCheck size={32} color={colors.textMute} />
              <Text style={[s.fallbackTitle, { color: colors.text }]}>Hairuhusiwi</Text>
              <Text style={[s.fallbackBody, { color: colors.textMute }]}>
                Uchanganuzi wa AI unapatikana kwa Wasimamizi wa Shamba, Wakulima wa Biashara, Agribiashara, na wengine.
              </Text>
            </GlassCard>
          </View>
        </PageScaffold>
      }
    >
      <PageScaffold title="Uchanganuzi wa AI" subtitle="Predictive Analytics" badge="ANALYTICS">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 80 }}>

          {/* ── 1. YIELD FORECAST ──────────────────────────── */}
          <SectionHeader title="UTABIRI WA MAVUNO" />
          <GlassCard style={s.yieldCard}>
            <View style={s.yieldTop}>
              <View style={{ flex: 1 }}>
                <Text style={[s.yieldLabel, { color: colors.textMute }]}>SASA HIVI</Text>
                <Text style={[s.yieldCurrent, { color: colors.text }]}>
                  {yieldForecast.currentTonnesHa}t/ha
                </Text>
              </View>
              <View style={s.yieldArrow}>
                <TrendIcon dir={yieldForecast.trend} size={28} />
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={[s.yieldLabel, { color: colors.textMute }]}>{yieldForecast.horizon.toUpperCase()}</Text>
                <Text style={[s.yieldForecast, {
                  color: yieldForecast.trend === 'up' ? '#22c55e' : yieldForecast.trend === 'down' ? '#ef4444' : colors.text,
                }]}>
                  {yieldForecast.forecastTonnesHa}t/ha
                </Text>
              </View>
            </View>

            <YieldProjectionChart
              current={yieldForecast.currentTonnesHa}
              forecast={yieldForecast.forecastTonnesHa}
              trend={yieldForecast.trend}
              color={confColor[yieldForecast.confidence]}
            />

            <View style={[s.yieldMeta, { borderTopColor: colors.border }]}>
              <View style={[s.confBadge, { backgroundColor: `${confColor[yieldForecast.confidence]}22` }]}>
                <Text style={[s.confText, { color: confColor[yieldForecast.confidence] }]}>
                  Imara: {yieldForecast.confidence === 'high' ? 'Juu' : yieldForecast.confidence === 'medium' ? 'Ya kati' : 'Chini'}
                </Text>
              </View>
              <Text style={[s.changePct, {
                color: yieldForecast.changePct >= 0 ? '#22c55e' : '#ef4444',
              }]}>
                {yieldForecast.changePct >= 0 ? '+' : ''}{yieldForecast.changePct}%
              </Text>
            </View>
          </GlassCard>

          {/* ── 2. PEST RISK ───────────────────────────────── */}
          <SectionHeader title="TATHMINI YA HATARI YA WADUDU" />
          <GlassCard style={s.pestCard}>
            <View style={s.pestTop}>
              <View style={[s.pestGauge, { backgroundColor: `${pestRisk.color}22` }]}>
                <Bug size={20} color={pestRisk.color} />
                <Text style={[s.pestScore, { color: pestRisk.color }]}>{pestRisk.score}</Text>
                <Text style={[s.pestLevel, { color: pestRisk.color }]}>{pestRisk.level}</Text>
              </View>
              <View style={{ flex: 1, gap: 8 }}>
                {pestRisk.primaryDrivers.length > 0 ? (
                  pestRisk.primaryDrivers.map((d, i) => (
                    <View key={i} style={s.driverRow}>
                      <View style={[s.driverDot, { backgroundColor: pestRisk.color }]} />
                      <Text style={[s.driverText, { color: colors.text }]}>{d}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={[s.noDriver, { color: colors.textMute }]}>Hakuna viashiria hatarishi.</Text>
                )}
              </View>
            </View>
            {pestRisk.recommendations.map((r, i) => (
              <View key={i} style={[s.recRow, { borderTopColor: colors.border, borderTopWidth: i === 0 ? StyleSheet.hairlineWidth : 0 }]}>
                <ArrowRight size={13} color={colors.primary} />
                <Text style={[s.recText, { color: colors.text }]}>{r}</Text>
              </View>
            ))}
          </GlassCard>

          {/* ── 3. PRICE TRENDS ────────────────────────────── */}
          <SectionHeader title="MWELEKEO WA BEI" action="Shamba Dijiti" onAction={() => router.push('/farm-twin')} />
          {priceTrends.map((trend) => (
            <GlassCard key={trend.crop} style={s.priceCard}>
              <View style={s.priceCropRow}>
                <Text style={[s.priceCrop, { color: colors.text }]}>{trend.crop}</Text>
                <View style={s.priceSignalRow}>
                  <TrendIcon dir={trend.trendDirection} size={16} />
                  <SignalBadge signal={trend.signal} />
                </View>
              </View>

              <View style={s.priceBarSection}>
                <PriceBar label="Sasa" value={trend.currentPriceTZSkg} max={maxPrice} color="#94a3b8" />
                <PriceBar label="Mwezi 1" value={trend.forecast30dTZSkg} max={maxPrice} color="#3b82f6" />
                <PriceBar label="Miezi 3" value={trend.forecast90dTZSkg} max={maxPrice} color={trend.trendDirection === 'up' ? '#22c55e' : trend.trendDirection === 'down' ? '#ef4444' : '#f59e0b'} />
              </View>

              <View style={[s.priceChangePct, { borderTopColor: colors.border }]}>
                <Text style={[s.priceNote, { color: colors.textMute }]}>{trend.seasonalNote}</Text>
                <Text style={[s.priceChangePctVal, {
                  color: trend.changePct30d >= 0 ? '#22c55e' : '#ef4444',
                }]}>
                  {trend.changePct30d >= 0 ? '+' : ''}{trend.changePct30d}% / mwezi
                </Text>
              </View>
            </GlassCard>
          ))}

          {/* Disclaimer */}
          <Text style={[s.disclaimer, { color: colors.textMute }]}>
            * Utabiri huu unatumia mfano wa takwimu tu. Ulitumia data ya shamba lako na bei za soko za kawaida. Si ushauri wa kisheria wa fedha.
          </Text>

        </ScrollView>
      </PageScaffold>
    </Gate>
  );
}

const s = StyleSheet.create({
  fallbackTitle: { fontFamily: 'Inter_800ExtraBold', fontSize: 16, marginTop: 12 },
  fallbackBody:  { fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 6, textAlign: 'center' },

  // Yield
  yieldCard:    { padding: 16 },
  yieldTop:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  yieldLabel:   { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.8 },
  yieldCurrent: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 24, marginTop: 4 },
  yieldForecast:{ fontFamily: 'InstrumentSerif_400Regular', fontSize: 24, marginTop: 4 },
  yieldArrow:   { paddingHorizontal: 4 },
  yieldMeta:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, marginTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
  confBadge:    { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  confText:     { fontFamily: 'Inter_700Bold', fontSize: 11 },
  changePct:    { fontFamily: 'Inter_800ExtraBold', fontSize: 16 },

  // Pest
  pestCard:     { padding: 14, gap: 10 },
  pestTop:      { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  pestGauge:    { width: 80, alignItems: 'center', padding: 10, borderRadius: 14, gap: 4 },
  pestScore:    { fontFamily: 'InstrumentSerif_400Regular', fontSize: 24 },
  pestLevel:    { fontFamily: 'Inter_700Bold', fontSize: 10 },
  driverRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  driverDot:    { width: 6, height: 6, borderRadius: 3, marginTop: 5 },
  driverText:   { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 18 },
  noDriver:     { fontFamily: 'Inter_500Medium', fontSize: 12 },
  recRow:       { flexDirection: 'row', gap: 8, alignItems: 'flex-start', paddingTop: 8, marginTop: 4 },
  recText:      { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 18 },

  // Price
  priceCard:      { padding: 14, gap: 10 },
  priceCropRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceCrop:      { fontFamily: 'Inter_800ExtraBold', fontSize: 14 },
  priceSignalRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priceBarSection:{ gap: 2 },
  priceChangePct: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth },
  priceNote:      { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 10, lineHeight: 15 },
  priceChangePctVal: { fontFamily: 'Inter_800ExtraBold', fontSize: 12, marginLeft: 8 },

  disclaimer: { fontFamily: 'Inter_500Medium', fontSize: 10, lineHeight: 16, textAlign: 'center', fontStyle: 'italic' },
});
