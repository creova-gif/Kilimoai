import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  StatusBar,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {
  SlidersHorizontal,
  CloudRain,
  TrendingUp,
  ArrowRight,
  X,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PALETTE, TYPE, SPACE, SHADOW, RADIUS } from '../../constants/Theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width: W } = Dimensions.get('window');

// ─── Data ──────────────────────────────────────────────────────────────────

const INITIAL_ZONES = [
  { id: 'z8', label: 'Zone 8', status: 'Optimal',   rate: 150, area: '0.6 ha', hex: '#1B5E20' },
  { id: 'z7', label: 'Zone 7', status: 'High',       rate: 125, area: '0.5 ha', hex: '#2E7D32' },
  { id: 'z6', label: 'Zone 6', status: 'Above Avg',  rate: 100, area: '0.4 ha', hex: '#4CAF50' },
  { id: 'z5', label: 'Zone 5', status: 'Average',    rate: 80,  area: '0.4 ha', hex: '#8BC34A' },
  { id: 'z4', label: 'Zone 4', status: 'Below Avg',  rate: 60,  area: '0.3 ha', hex: '#D97706' },
  { id: 'z3', label: 'Zone 3', status: 'Low Yield',  rate: 40,  area: '0.2 ha', hex: '#DC2626' },
];

const FILTERS = [
  { id: 'all',   label: 'All Fields' },
  { id: 'empty', label: 'Empty · 15 ha' },
  { id: 'corn',  label: 'Corn · 12 ha' },
];

const FORECAST = [
  { day: 'Mon', cond: 'Rainy',        temp: '+16° / +10°' },
  { day: 'Tue', cond: 'Cloudy',       temp: '+17° / +11°' },
  { day: 'Wed', cond: 'Partly Sunny', temp: '+18° / +12°' },
  { day: 'Thu', cond: 'Sunny',        temp: '+19° / +11°' },
  { day: 'Fri', cond: 'Heavy Rain',   temp: '+15° / +9°'  },
  { day: 'Sat', cond: 'Overcast',     temp: '+14° / +8°'  },
  { day: 'Sun', cond: 'Showers',      temp: '+16° / +10°' },
];

// ─── Component ─────────────────────────────────────────────────────────────

export default function MapScreen() {
  const [zones,        setZones]        = useState(INITIAL_ZONES);
  const [filter,       setFilter]       = useState('all');
  const [activeZone,   setActiveZone]   = useState<typeof INITIAL_ZONES[0] | null>(null);
  const [editRate,     setEditRate]     = useState('');
  const [editVisible,  setEditVisible]  = useState(false);
  const [wxVisible,    setWxVisible]    = useState(false);

  const visibleZones = zones.filter(z => {
    if (filter === 'empty') return z.id === 'z3' || z.id === 'z4';
    if (filter === 'corn')  return z.id === 'z7' || z.id === 'z8';
    return true;
  });

  const openEdit = (z: typeof INITIAL_ZONES[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveZone(z);
    setEditRate(String(z.rate));
    setEditVisible(true);
  };

  const saveRate = () => {
    const v = parseFloat(editRate);
    if (!activeZone || isNaN(v) || v < 0) { Alert.alert('Invalid', 'Enter a valid rate.'); return; }
    setZones(prev => prev.map(z => z.id === activeZone.id ? { ...z, rate: v } : z));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setEditVisible(false);
    Alert.alert('Saved', `${activeZone.label} rate set to ${v} kg/ha.`);
  };

  // ── render ─────────────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>VRA Spatial Map</Text>
            <Text style={styles.headerSub}>Variable Rate Application · 2024 Season</Text>
          </View>
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setWxVisible(true); }}
            style={styles.wxBtn}
            accessibilityRole="button"
            accessibilityLabel="Weather forecast"
          >
            <CloudRain size={18} color={PALETTE.greenAction} strokeWidth={2} />
            <Text style={styles.wxBtnText}>+16°</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Filter pills */}
          <Animated.View entering={FadeInDown.delay(60).springify()} style={styles.filterRow}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f.id}
                onPress={() => { setFilter(f.id); Haptics.selectionAsync(); }}
                style={[styles.filterPill, filter === f.id && styles.filterPillActive]}
                accessibilityRole="radio"
                accessibilityState={{ checked: filter === f.id }}
              >
                <Text style={[styles.filterText, filter === f.id && styles.filterTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* GIS zone grid */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>GIS Zoning Grid</Text>
                <TouchableOpacity
                  style={styles.legendBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Zone legend"
                >
                  <SlidersHorizontal size={16} color={PALETTE.inkMute} strokeWidth={2} />
                </TouchableOpacity>
              </View>

              <View style={styles.zoneGrid}>
                {INITIAL_ZONES.map(z => {
                  const hidden = !visibleZones.find(v => v.id === z.id);
                  return (
                    <TouchableOpacity
                      key={z.id}
                      onPress={() => openEdit(z)}
                      activeOpacity={0.8}
                      style={[
                        styles.zoneBlock,
                        { backgroundColor: z.hex },
                        hidden && styles.zoneBlockHidden,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`${z.label} — ${z.rate} kg/ha`}
                    >
                      <Text style={styles.zoneBlockLabel}>{z.label}</Text>
                      <Text style={styles.zoneBlockRate}>{z.rate} kg/ha</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.zoneHint}>Tap any zone to adjust the prescription rate</Text>
            </View>
          </Animated.View>

          {/* Stats row */}
          <Animated.View entering={FadeInDown.delay(140).springify()} style={styles.statsRow}>
            <View style={[styles.statCard, { flex: 1 }]}>
              <Text style={styles.statLabel}>GROWTH RATE</Text>
              <Text style={styles.statVal}>0.75</Text>
              <View style={styles.statDateRow}>
                <Text style={styles.statDate}>Jul 24</Text>
                <ArrowRight size={10} color={PALETTE.inkMute} />
                <Text style={styles.statDate}>Aug 25</Text>
              </View>
            </View>
            <View style={[styles.statCard, { flex: 1 }]}>
              <Text style={styles.statLabel}>STD. RATE</Text>
              <Text style={styles.statVal}>100</Text>
              <Text style={styles.statDate}>kg/ha</Text>
            </View>
            <View style={[styles.statCard, { flex: 1 }]}>
              <Text style={styles.statLabel}>COVERAGE</Text>
              <Text style={styles.statVal}>2.4</Text>
              <Text style={styles.statDate}>hectares</Text>
            </View>
          </Animated.View>

          {/* Productivity zones list */}
          <Animated.View entering={FadeInDown.delay(180).springify()}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Productivity Zones</Text>
              {zones.map((z, i) => (
                <React.Fragment key={z.id}>
                  <TouchableOpacity
                    onPress={() => openEdit(z)}
                    style={styles.zoneRow}
                    accessibilityRole="button"
                    accessibilityLabel={`${z.label} — ${z.status}`}
                  >
                    <View style={[styles.zoneColorPin, { backgroundColor: z.hex }]} />
                    <View style={styles.zoneRowInfo}>
                      <Text style={styles.zoneRowLabel}>{z.label}</Text>
                      <Text style={styles.zoneRowStatus}>{z.status}</Text>
                    </View>
                    <View style={styles.zoneRowRight}>
                      <Text style={styles.zoneRowRate}>{z.rate} kg/ha</Text>
                      <Text style={styles.zoneRowArea}>{z.area}</Text>
                    </View>
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </Animated.View>

          {/* Weather card (tap for forecast) */}
          <Animated.View entering={FadeInDown.delay(220).springify()}>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setWxVisible(true); }}
              activeOpacity={0.85}
              style={styles.wxCard}
              accessibilityRole="button"
              accessibilityLabel="View weather forecast"
            >
              <View style={styles.wxLeft}>
                <Text style={styles.wxLocation}>Vymyk, Lviv Oblast</Text>
                <Text style={styles.wxTemp}>H: +16°  L: +10°</Text>
              </View>
              <View style={styles.wxRight}>
                <CloudRain size={32} color={PALETTE.greenAction} strokeWidth={1.5} />
                <View style={styles.wxStats}>
                  <Text style={styles.wxStatLabel}>5mm · 1019 hPa</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      {/* ═══════════ ZONE EDIT MODAL ═══════════ */}
      <Modal visible={editVisible} animationType="slide" transparent statusBarTranslucent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />

            {activeZone && (
              <>
                <View style={styles.sheetTitleRow}>
                  <View>
                    <Text style={styles.sheetTitle}>Adjust Rate</Text>
                    <Text style={styles.sheetSub}>{activeZone.label} · {activeZone.status}</Text>
                  </View>
                  <View style={[styles.zoneColorPin, { width: 20, height: 20, borderRadius: 10, backgroundColor: activeZone.hex }]} />
                </View>

                <Text style={styles.fieldLabel}>PRESCRIPTION RATE (KG/HA)</Text>
                <TextInput
                  value={editRate}
                  onChangeText={setEditRate}
                  keyboardType="decimal-pad"
                  style={styles.input}
                  accessibilityLabel="Prescription rate"
                />

                <View style={styles.btnRow}>
                  <TouchableOpacity
                    onPress={() => setEditVisible(false)}
                    style={styles.cancelBtn}
                    accessibilityRole="button"
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={saveRate}
                    style={styles.saveBtn}
                    accessibilityRole="button"
                  >
                    <Text style={styles.saveText}>Save Rate</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ═══════════ FORECAST MODAL ═══════════ */}
      <Modal visible={wxVisible} animationType="slide" transparent statusBarTranslucent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetTitleRow}>
              <Text style={styles.sheetTitle}>7-Day Forecast</Text>
              <TouchableOpacity
                onPress={() => setWxVisible(false)}
                style={styles.closeIconBtn}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <X size={20} color={PALETTE.inkMute} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            {FORECAST.map((f, i) => (
              <React.Fragment key={f.day}>
                <View style={styles.wxRow}>
                  <Text style={styles.wxDay}>{f.day}</Text>
                  <Text style={styles.wxCond}>{f.cond}</Text>
                  <Text style={styles.wxTempRange}>{f.temp}</Text>
                </View>
                {i < FORECAST.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
            <TouchableOpacity
              onPress={() => setWxVisible(false)}
              style={[styles.saveBtn, { marginTop: SPACE['3'] }]}
              accessibilityRole="button"
            >
              <Text style={styles.saveText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const ZONE_W = (W - SPACE['3'] * 2 - SPACE['2'] * 2) / 3;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: PALETTE.surface },
  safe: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACE['3'],
    paddingVertical: SPACE['2'],
    backgroundColor: PALETTE.white,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.line,
  },
  headerTitle: { ...TYPE.subheading, color: PALETTE.ink },
  headerSub:   { ...TYPE.captionMed, color: PALETTE.inkMute, marginTop: 2 },
  wxBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: PALETTE.greenTint,
    minHeight: 36,
  },
  wxBtnText: { ...TYPE.captionBold, color: PALETTE.greenInk },

  scroll: { padding: SPACE['3'], gap: SPACE['2'] },

  // Filter pills
  filterRow: { flexDirection: 'row', gap: SPACE['2'], flexWrap: 'wrap' },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    backgroundColor: PALETTE.white,
    minHeight: 36,
  },
  filterPillActive: { borderColor: PALETTE.greenAction, backgroundColor: PALETTE.greenTint },
  filterText:       { ...TYPE.captionBold, color: PALETTE.inkMid },
  filterTextActive: { color: PALETTE.greenInk },

  // Card
  card: {
    backgroundColor: PALETTE.white,
    borderRadius: RADIUS.lg,
    padding: SPACE['3'],
    ...SHADOW.sm,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACE['3'] },
  cardTitle:     { ...TYPE.subheading, color: PALETTE.ink },
  legendBtn:     { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },

  // Zone grid
  zoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACE['2'],
    marginBottom: SPACE['2'],
  },
  zoneBlock: {
    width: ZONE_W,
    height: 80,
    borderRadius: RADIUS.md,
    padding: 10,
    justifyContent: 'space-between',
  },
  zoneBlockHidden: { opacity: 0.12 },
  zoneBlockLabel:  { ...TYPE.captionBold, color: PALETTE.white },
  zoneBlockRate:   { ...TYPE.label, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.3 },
  zoneHint:        { ...TYPE.captionMed, color: PALETTE.inkMute, textAlign: 'center' },

  // Stats row
  statsRow: { flexDirection: 'row', gap: SPACE['2'] },
  statCard: {
    backgroundColor: PALETTE.white,
    borderRadius: RADIUS.lg,
    padding: SPACE['2'],
    ...SHADOW.sm,
    gap: 2,
  },
  statLabel: { ...TYPE.label, color: PALETTE.inkMute, letterSpacing: 0.5, marginBottom: 2 },
  statVal:   { ...TYPE.heading, color: PALETTE.ink },
  statDateRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  statDate:  { ...TYPE.captionMed, color: PALETTE.inkMute },

  // Zone list rows
  zoneRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  zoneColorPin: { width: 14, height: 14, borderRadius: 7 },
  zoneRowInfo:  { flex: 1, marginLeft: SPACE['2'] },
  zoneRowLabel:  { ...TYPE.bodySemi, color: PALETTE.ink },
  zoneRowStatus: { ...TYPE.captionMed, color: PALETTE.inkMute, marginTop: 1 },
  zoneRowRight:  { alignItems: 'flex-end' },
  zoneRowRate:   { ...TYPE.bodySemi, color: PALETTE.ink },
  zoneRowArea:   { ...TYPE.captionMed, color: PALETTE.inkMute, marginTop: 1 },
  divider: { height: 1, backgroundColor: PALETTE.line },

  // Weather card
  wxCard: {
    backgroundColor: PALETTE.white,
    borderRadius: RADIUS.lg,
    padding: SPACE['3'],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOW.sm,
  },
  wxLeft: { flex: 1 },
  wxLocation: { ...TYPE.subheading, color: PALETTE.ink },
  wxTemp:     { ...TYPE.bodyMed, color: PALETTE.inkMute, marginTop: 4 },
  wxRight:    { alignItems: 'flex-end', gap: 4 },
  wxStats:    {},
  wxStatLabel:{ ...TYPE.captionMed, color: PALETTE.inkMute },

  // Overlay / sheet
  overlay: { flex: 1, backgroundColor: 'rgba(15,25,35,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: PALETTE.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACE['4'],
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: PALETTE.line,
    alignSelf: 'center',
    marginBottom: SPACE['4'],
  },
  sheetTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACE['3'] },
  sheetTitle: { ...TYPE.subheading, color: PALETTE.ink },
  sheetSub:   { ...TYPE.captionMed, color: PALETTE.inkMute, marginTop: 2 },
  closeIconBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },

  fieldLabel: { ...TYPE.label, color: PALETTE.inkMute, marginBottom: SPACE['2'] },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: PALETTE.line,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACE['2'],
    ...TYPE.heading,
    color: PALETTE.ink,
    marginBottom: SPACE['4'],
  },
  btnRow:     { flexDirection: 'row', gap: SPACE['2'] },
  cancelBtn:  { flex: 1, height: 50, borderRadius: RADIUS.md, borderWidth: 1, borderColor: PALETTE.line, justifyContent: 'center', alignItems: 'center' },
  cancelText: { ...TYPE.bodySemi, color: PALETTE.inkMid },
  saveBtn:    { flex: 1, height: 50, borderRadius: RADIUS.md, backgroundColor: PALETTE.greenAction, justifyContent: 'center', alignItems: 'center' },
  saveText:   { ...TYPE.bodySemi, color: PALETTE.white, fontFamily: 'Inter_700Bold' },

  // Forecast rows
  wxRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  wxDay:      { ...TYPE.bodySemi, color: PALETTE.ink, width: 40 },
  wxCond:     { ...TYPE.bodyMed, color: PALETTE.inkMid, flex: 1 },
  wxTempRange:{ ...TYPE.bodySemi, color: PALETTE.ink },
});
