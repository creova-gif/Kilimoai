import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  Clipboard,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  QrCode,
  Plus,
  ArrowRight,
  Download,
  MapPin,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { PALETTE, TYPE, SPACE, SHADOW, RADIUS } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import { useSyncEngine } from '../../hooks/useSyncEngine';

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Format 9850.25 → "$9.850,25" (European decimal style per design spec) */
function formatBalance(num: number) {
  const [int, dec] = num.toFixed(2).split('.');
  return '$' + int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + dec;
}

// ─── Seed data ─────────────────────────────────────────────────────────────

const SEED_TRANSACTIONS = [
  { id: 'TX-655-01', title: 'Compost Fertilizer',  amount: 120, status: 'completed', date: 'Feb 14, 2025', idLabel: '#655' },
  { id: 'TX-655-02', title: 'Seedlings',            amount: 450, status: 'pending',   date: 'Feb 07, 2025', idLabel: '#655' },
  { id: 'TX-655-03', title: 'Urea Fertilizer',      amount: 180, status: 'completed', date: 'Jan 31, 2025', idLabel: '#655' },
  { id: 'TX-655-04', title: 'Compost Fertilizer',   amount: 120, status: 'completed', date: 'Jan 24, 2025', idLabel: '#655' },
];

// ─── Sub-components ────────────────────────────────────────────────────────

function Divider() {
  return <View style={{ height: 1, backgroundColor: PALETTE.line, marginVertical: 0 }} />;
}

// ─── Main Screen ───────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router    = useRouter();
  const agroId    = useKilimoStore(s => s.agroId);
  const farmProfile = useKilimoStore(s => s.farmProfile);
  const setFarmProfile = useKilimoStore(s => s.setFarmProfile);
  const setLastSyncedAt = useKilimoStore(s => s.setLastSyncedAt);
  const { forceSync } = useSyncEngine();

  const [refreshing,  setRefreshing]  = useState(false);
  const [salesTotal,  setSalesTotal]  = useState(9850.25);
  const [transactions] = useState(SEED_TRANSACTIONS);

  // Modals
  const [updateVisible, setUpdateVisible] = useState(false);
  const [invoiceVisible, setInvoiceVisible] = useState(false);
  const [selectedTx, setSelectedTx] = useState<typeof SEED_TRANSACTIONS[0] | null>(null);
  const [qrVisible, setQrVisible] = useState(false);

  // Update form
  const [fCompost, setFCompost] = useState(String(farmProfile?.compostKg ?? 120));
  const [fUrea, setFUrea]       = useState(String(farmProfile?.ureaKg ?? 50));
  const [fSP36, setFSP36]       = useState('40');
  const [fKCl, setFKCl]         = useState('30');
  const [saving, setSaving]     = useState(false);

  // Fetch Supabase
  const fetchData = useCallback(async () => {
    try {
      const { getSupabase } = require('../../lib/supabase');
      const sb = getSupabase();
      if (sb && agroId?.id) {
        const { data } = await sb
          .from('agro_profiles')
          .select('sales_total')
          .eq('user_id', agroId.id)
          .maybeSingle();
        if (data?.sales_total != null) setSalesTotal(data.sales_total);
      }
    } catch { /* silent — use seed */ }
  }, [agroId?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await forceSync();
    await fetchData();
    setLastSyncedAt(new Date().toISOString());
    setRefreshing(false);
  }, [forceSync, fetchData, setLastSyncedAt]);

  // Save update form
  const handleSaveUpdate = async () => {
    const compost = parseFloat(fCompost) || 0;
    const urea    = parseFloat(fUrea)    || 0;
    const sp36    = parseFloat(fSP36)    || 0;
    const kcl     = parseFloat(fKCl)     || 0;
    setSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setFarmProfile({
      primaryCrops: farmProfile?.primaryCrops ?? ['Mpunga (Rice)'],
      region: farmProfile?.region ?? 'Bali, Indonesia',
      farmSizeAcres: farmProfile?.farmSizeAcres ?? 2.5,
      mainActivity: 'mazao',
      hasLivestock: false,
      hasIrrigation: false,
      compostKg: compost,
      ureaKg: urea,
    });
    try {
      const { getSupabase } = require('../../lib/supabase');
      const sb = getSupabase();
      if (sb && agroId?.id) {
        await sb.from('agro_profiles').upsert(
          { user_id: agroId.id, compost_kg: compost, urea_kg: urea, sp36_kg: sp36, kcl_kg: kcl },
          { onConflict: 'user_id' }
        );
      }
    } catch { /* silent */ }
    setSaving(false);
    setUpdateVisible(false);
    Alert.alert('Updated', 'Farm parameters saved.');
  };

  const initials = (agroId?.name ?? 'JM').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const firstName = agroId?.name?.split(' ')[0] ?? 'Justin';

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning, {firstName} 👋</Text>
            <View style={styles.locRow}>
              <MapPin size={12} color={PALETTE.inkMute} strokeWidth={2} />
              <Text style={styles.locText}>{farmProfile?.region ?? 'Bali, Indonesia'}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/profile')}
              style={styles.avatar}
              accessibilityRole="button"
              accessibilityLabel="Profile"
            >
              <Text style={styles.avatarText}>{initials}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PALETTE.greenAction} />
          }
        >

          {/* ── Crop Card ──────────────────────────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(60).springify()}>
            <View style={styles.cropCard}>
              <View style={styles.cropTop}>
                <View style={styles.cropBadge}>
                  <Text style={styles.cropBadgeText}>Your Agricultural Crops</Text>
                </View>
                <Text style={styles.cropTitle}>Rice Plants</Text>
              </View>
              <View style={styles.cropGrid}>
                <View style={styles.cropCell}>
                  <Text style={styles.cropCellLabel}>ORGANIC SOIL</Text>
                  <Text style={styles.cropCellVal}>Manure</Text>
                  <Text style={styles.cropCellSub}>Phase: Before Planting</Text>
                </View>
                <View style={styles.cropCellDivider} />
                <View style={styles.cropCell}>
                  <Text style={styles.cropCellLabel}>INPUT INGREDIENTS</Text>
                  <Text style={styles.cropCellVal}>KCl Fertilizer</Text>
                  <Text style={styles.cropCellSub}>Age 2–3 Weeks</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* ── Sales Card (dark hero) ─────────────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <LinearGradient
              colors={[PALETTE.greenInk, '#0F3C14']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.salesCard}
            >
              <View style={styles.salesTop}>
                <View>
                  <Text style={styles.salesLabel}>Total Balance</Text>
                  <Text style={styles.salesAmount}>{formatBalance(salesTotal)}</Text>
                </View>
                <View style={styles.trendBadge}>
                  <TrendingUp size={12} color={PALETTE.greenAction} strokeWidth={2.5} />
                  <Text style={styles.trendText}>+5% MoM</Text>
                </View>
              </View>

              {/* Sparkline */}
              <View style={styles.sparkline}>
                {[12, 24, 18, 32, 44, 56, 48, 60].map((h, i) => (
                  <View
                    key={i}
                    style={[
                      styles.sparkBar,
                      { height: h, backgroundColor: i >= 5 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)' },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.sparkLabel}>Sales rose 12% in 1 month</Text>

              <View style={styles.salesFooter}>
                <TouchableOpacity
                  onPress={() => router.push('/agro-id')}
                  style={styles.viewDetailsBtn}
                  accessibilityRole="button"
                >
                  <Text style={styles.viewDetailsText}>View details</Text>
                  <ArrowRight size={14} color="rgba(255,255,255,0.7)" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* ── Market Conditions ──────────────────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(140).springify()}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Market Conditions</Text>
              <View style={styles.marketRow}>
                <View style={styles.marketCell}>
                  <Text style={styles.marketCellLabel}>MARKET PRICE</Text>
                  <Text style={styles.marketCellVal}>$50.00</Text>
                </View>
                <View style={styles.marketCellDivider} />
                <View style={styles.marketCell}>
                  <Text style={styles.marketCellLabel}>HIGHEST DEMAND</Text>
                  <Text style={styles.marketCellVal}>Surabaya, Bali</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* ── Information Card ───────────────────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(180).springify()}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Information</Text>
              {[
                { k: 'Plant Age',      v: 'Week 4' },
                { k: 'Rice Harvest',   v: '950 kg · Up 2%' },
                { k: 'Sales Data',     v: 'Up 2% this month' },
                { k: 'Fertilization',  v: 'Urea, SP-36, KCl, ZA' },
                { k: 'Certification',  v: 'Land & Fertilizer' },
              ].map(({ k, v }, i, arr) => (
                <React.Fragment key={k}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoKey}>{k}</Text>
                    <Text style={styles.infoVal}>{v}</Text>
                  </View>
                  {i < arr.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </View>
          </Animated.View>

          {/* ── Update prompt ──────────────────────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(220).springify()}>
            <View style={styles.updateCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.updateTitle}>
                  Update farm parameters to improve AI recommendations
                </Text>
                <Text style={styles.updateSub}>Compost, Urea, SP-36, KCl</Text>
              </View>
              <TouchableOpacity
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setUpdateVisible(true); }}
                style={styles.updateBtn}
                accessibilityRole="button"
                accessibilityLabel="Update farm parameters"
              >
                <Plus size={16} color={PALETTE.greenAction} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* ── Transaction History ────────────────────────────────────── */}
          <Animated.View entering={FadeInDown.delay(260).springify()}>
            <View style={styles.card}>
              <View style={styles.txHeader}>
                <Text style={styles.cardTitle}>Transaction History</Text>
                <TouchableOpacity
                  onPress={() => router.push('/agro-id')}
                  accessibilityRole="button"
                  accessibilityLabel="View all transactions"
                >
                  <Text style={styles.txSeeAll}>See all</Text>
                </TouchableOpacity>
              </View>
              {transactions.map((tx, i) => {
                const done = tx.status === 'completed';
                return (
                  <React.Fragment key={tx.id}>
                    <TouchableOpacity
                      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedTx(tx); setInvoiceVisible(true); }}
                      onLongPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); Clipboard.setString(tx.id); Alert.alert('Copied', `Transaction ID ${tx.id} copied.`); }}
                      style={styles.txRow}
                      accessibilityRole="button"
                      accessibilityLabel={`${tx.title} — ${tx.status}`}
                    >
                      <View style={[styles.txIcon, { backgroundColor: done ? PALETTE.greenTint : PALETTE.amberTint }]}>
                        {done
                          ? <CheckCircle2 size={18} color={PALETTE.greenAction} strokeWidth={2} />
                          : <Clock        size={18} color={PALETTE.amber}       strokeWidth={2} />
                        }
                      </View>
                      <View style={styles.txInfo}>
                        <Text style={styles.txTitle}>{tx.title}</Text>
                        <Text style={styles.txMeta}>{tx.date} · {tx.idLabel}</Text>
                      </View>
                      <View style={[styles.txStatus, { backgroundColor: done ? PALETTE.greenTint : PALETTE.amberTint }]}>
                        <Text style={[styles.txStatusText, { color: done ? PALETTE.greenAction : PALETTE.amber }]}>
                          {done ? 'Done' : 'Pending'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {i < transactions.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </View>
          </Animated.View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      {/* ═══════════════════════════════════════════════════════════════════
          MODALS
      ═══════════════════════════════════════════════════════════════════ */}

      {/* Update form */}
      <Modal visible={updateVisible} animationType="slide" transparent statusBarTranslucent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Update Farm Parameters</Text>

            <View style={styles.sheetFields}>
              {[
                { label: 'COMPOST FERTILIZER (KG)', value: fCompost, set: setFCompost },
                { label: 'UREA FERTILIZER (KG)',    value: fUrea,    set: setFUrea    },
                { label: 'SP-36 FERTILIZER (KG)',   value: fSP36,    set: setFSP36    },
                { label: 'KCL FERTILIZER (KG)',     value: fKCl,     set: setFKCl     },
              ].map(f => (
                <View key={f.label} style={styles.sheetField}>
                  <Text style={styles.sheetFieldLabel}>{f.label}</Text>
                  <TextInput
                    value={f.value}
                    onChangeText={f.set}
                    keyboardType="decimal-pad"
                    style={styles.sheetInput}
                    placeholderTextColor={PALETTE.inkMute}
                    accessibilityLabel={f.label}
                  />
                </View>
              ))}
            </View>

            <View style={styles.sheetBtns}>
              <TouchableOpacity
                onPress={() => setUpdateVisible(false)}
                style={styles.sheetCancel}
                accessibilityRole="button"
              >
                <Text style={styles.sheetCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveUpdate}
                style={styles.sheetSave}
                disabled={saving}
                accessibilityRole="button"
              >
                {saving
                  ? <ActivityIndicator color={PALETTE.white} />
                  : <Text style={styles.sheetSaveText}>Save</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Invoice */}
      <Modal visible={invoiceVisible} animationType="fade" transparent statusBarTranslucent>
        <View style={[styles.overlay, { justifyContent: 'center', paddingHorizontal: SPACE['4'] }]}>
          <View style={styles.invoiceCard}>
            <Text style={styles.invoiceTitle}>Transaction Invoice</Text>
            {selectedTx && (
              <View style={styles.invoiceBody}>
                {[
                  { k: 'Transaction ID', v: selectedTx.id },
                  { k: 'Description',    v: selectedTx.title },
                  { k: 'Date',           v: selectedTx.date },
                  { k: 'Status',         v: selectedTx.status.toUpperCase() },
                ].map(({ k, v }) => (
                  <View key={k} style={styles.invoiceRow}>
                    <Text style={styles.invoiceKey}>{k}</Text>
                    <Text style={[styles.invoiceVal, k === 'Status' && { color: selectedTx.status === 'completed' ? PALETTE.greenAction : PALETTE.amber }]}>{v}</Text>
                  </View>
                ))}
                <View style={styles.invoiceDivider} />
                <View style={styles.invoiceRow}>
                  <Text style={styles.invoiceTotalKey}>Amount</Text>
                  <Text style={styles.invoiceTotalVal}>${selectedTx.amount.toFixed(2)}</Text>
                </View>
              </View>
            )}
            <TouchableOpacity
              onPress={() => setInvoiceVisible(false)}
              style={styles.invoiceClose}
              accessibilityRole="button"
            >
              <Text style={styles.invoiceCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QR */}
      <Modal visible={qrVisible} animationType="slide" transparent statusBarTranslucent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Farm Scannable Passport</Text>
            <View style={styles.qrBox}>
              <QrCode size={160} color={PALETTE.ink} strokeWidth={1.5} />
            </View>
            <Text style={styles.qrNote}>
              Show this QR to agro-vendors or loan officers to instantly share your verified crop profile.
            </Text>
            <TouchableOpacity
              onPress={() => { Alert.alert('Download', 'QR saved to gallery.'); setQrVisible(false); }}
              style={styles.sheetSave}
              accessibilityRole="button"
            >
              <Download size={18} color={PALETTE.white} strokeWidth={2} />
              <Text style={styles.sheetSaveText}>Download QR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setQrVisible(false)}
              style={styles.sheetCancelFull}
              accessibilityRole="button"
            >
              <Text style={styles.sheetCancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: PALETTE.surface },
  safe:  { flex: 1 },

  // Header
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
  greeting: { ...TYPE.subheading, color: PALETTE.ink, marginBottom: 2 },
  locRow:   { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locText:  { ...TYPE.captionMed, color: PALETTE.inkMute },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: SPACE['2'] },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: PALETTE.line,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PALETTE.white,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PALETTE.greenTint,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: PALETTE.greenAction,
  },
  avatarText: { ...TYPE.captionBold, color: PALETTE.greenInk },

  // Scroll
  scroll: { paddingTop: SPACE['3'], paddingHorizontal: SPACE['3'], gap: SPACE['2'] },

  // ── Crop Card ───────────────────────────────────────────────────────────
  cropCard: {
    backgroundColor: PALETTE.white,
    borderRadius: RADIUS.lg,
    padding: SPACE['3'],
    ...SHADOW.sm,
  },
  cropTop: { marginBottom: SPACE['3'] },
  cropBadge: {
    alignSelf: 'flex-start',
    backgroundColor: PALETTE.greenTint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    marginBottom: SPACE['2'],
  },
  cropBadgeText: { ...TYPE.label, color: PALETTE.greenInk, letterSpacing: 0.5 },
  cropTitle: { ...TYPE.heading, color: PALETTE.ink },
  cropGrid: { flexDirection: 'row', gap: SPACE['3'] },
  cropCell: { flex: 1 },
  cropCellDivider: { width: 1, backgroundColor: PALETTE.line },
  cropCellLabel: { ...TYPE.label, color: PALETTE.inkMute, marginBottom: 4 },
  cropCellVal:   { ...TYPE.bodySemi, color: PALETTE.ink },
  cropCellSub:   { ...TYPE.captionMed, color: PALETTE.inkMute, marginTop: 2 },

  // ── Sales Card (dark) ───────────────────────────────────────────────────
  salesCard: {
    backgroundColor: PALETTE.greenInk,
    borderRadius: RADIUS.lg,
    padding: SPACE['3'],
    ...SHADOW.md,
  },
  salesTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACE['3'],
  },
  salesLabel:  { ...TYPE.captionMed, color: 'rgba(255,255,255,0.55)', marginBottom: 4 },
  salesAmount: { fontSize: 34, fontFamily: 'Inter_900Black', color: PALETTE.white, letterSpacing: -1.5 },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: PALETTE.greenTint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  trendText: { ...TYPE.captionBold, color: PALETTE.greenAction },

  sparkline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 48,
    marginBottom: SPACE['1'],
  },
  sparkBar: { flex: 1, borderRadius: 2 },
  sparkLabel: { ...TYPE.captionMed, color: 'rgba(255,255,255,0.45)', marginBottom: SPACE['3'] },

  salesFooter: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: SPACE['2'] },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
    paddingVertical: 4,
    minHeight: 36,
  },
  viewDetailsText: { ...TYPE.captionBold, color: 'rgba(255,255,255,0.65)' },

  // ── Generic white card ──────────────────────────────────────────────────
  card: {
    backgroundColor: PALETTE.white,
    borderRadius: RADIUS.lg,
    padding: SPACE['3'],
    ...SHADOW.sm,
    gap: 0,
  },
  cardTitle: { ...TYPE.subheading, color: PALETTE.ink, marginBottom: SPACE['2'] },

  // Market
  marketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACE['1'],
  },
  marketCell: { flex: 1 },
  marketCellDivider: { width: 1, height: 32, backgroundColor: PALETTE.line, marginHorizontal: SPACE['3'] },
  marketCellLabel: { ...TYPE.label, color: PALETTE.inkMute, marginBottom: 4 },
  marketCellVal:   { ...TYPE.bodySemi, color: PALETTE.ink },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoKey: { ...TYPE.bodyMed, color: PALETTE.inkMid },
  infoVal: { ...TYPE.bodySemi, color: PALETTE.ink, textAlign: 'right', flex: 1, marginLeft: SPACE['3'] },

  // Update prompt
  updateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.greenTint,
    borderRadius: RADIUS.lg,
    padding: SPACE['3'],
    gap: SPACE['3'],
    ...SHADOW.sm,
  },
  updateTitle: { ...TYPE.bodyMed, color: PALETTE.greenInk, lineHeight: 20 },
  updateSub:   { ...TYPE.captionMed, color: PALETTE.greenAction, marginTop: 2 },
  updateBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PALETTE.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.sm,
  },

  // Transactions
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACE['2'],
  },
  txSeeAll: { ...TYPE.captionBold, color: PALETTE.greenAction },
  txRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  txIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  txInfo: { flex: 1, marginLeft: SPACE['2'] },
  txTitle:  { ...TYPE.bodySemi, color: PALETTE.ink },
  txMeta:   { ...TYPE.captionMed, color: PALETTE.inkMute, marginTop: 2 },
  txStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm },
  txStatusText: { ...TYPE.captionBold },

  // ── Overlay / Sheet ─────────────────────────────────────────────────────
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15,25,35,0.5)',
    justifyContent: 'flex-end',
  },
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
  sheetTitle: { ...TYPE.heading, color: PALETTE.ink, marginBottom: SPACE['4'] },
  sheetFields: { gap: SPACE['3'], marginBottom: SPACE['4'] },
  sheetField: {},
  sheetFieldLabel: { ...TYPE.label, color: PALETTE.inkMute, marginBottom: 6 },
  sheetInput: {
    height: 48,
    borderWidth: 1,
    borderColor: PALETTE.line,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACE['2'],
    ...TYPE.bodySemi,
    color: PALETTE.ink,
  },
  sheetBtns: { flexDirection: 'row', gap: SPACE['2'] },
  sheetCancel: {
    flex: 1,
    height: 50,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: PALETTE.line,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetCancelText: { ...TYPE.bodySemi, color: PALETTE.inkMid },
  sheetSave: {
    flex: 1,
    height: 50,
    borderRadius: RADIUS.md,
    backgroundColor: PALETTE.greenAction,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  sheetSaveText: { ...TYPE.bodySemi, color: PALETTE.white, fontFamily: 'Inter_700Bold' },
  sheetCancelFull: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACE['2'],
  },

  // Invoice
  invoiceCard: {
    backgroundColor: PALETTE.white,
    borderRadius: RADIUS.xl,
    padding: SPACE['4'],
    ...SHADOW.lg,
  },
  invoiceTitle: { ...TYPE.subheading, color: PALETTE.ink, textAlign: 'center', marginBottom: SPACE['4'] },
  invoiceBody:  { gap: SPACE['2'], marginBottom: SPACE['4'] },
  invoiceRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  invoiceKey:   { ...TYPE.captionMed, color: PALETTE.inkMute },
  invoiceVal:   { ...TYPE.captionBold, color: PALETTE.ink },
  invoiceDivider: { height: 1, backgroundColor: PALETTE.line, marginVertical: SPACE['2'] },
  invoiceTotalKey: { ...TYPE.bodySemi, color: PALETTE.ink },
  invoiceTotalVal: { ...TYPE.heading, color: PALETTE.greenAction },
  invoiceClose: {
    height: 50,
    borderRadius: RADIUS.md,
    backgroundColor: PALETTE.greenAction,
    justifyContent: 'center',
    alignItems: 'center',
  },
  invoiceCloseText: { ...TYPE.bodySemi, color: PALETTE.white, fontFamily: 'Inter_700Bold' },

  // QR
  qrBox: {
    padding: SPACE['3'],
    backgroundColor: PALETTE.surface,
    borderRadius: RADIUS.lg,
    alignSelf: 'center',
    marginBottom: SPACE['3'],
    ...SHADOW.sm,
  },
  qrNote: {
    ...TYPE.captionMed,
    color: PALETTE.inkMute,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: SPACE['4'],
    paddingHorizontal: SPACE['3'],
  },
});
