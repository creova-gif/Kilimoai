/**
 * Agro ID — full identity passport with P&L PDF export
 * P0 Story: "...export them as a PDF via my Agro ID so that I can apply for a bank loan."
 */

import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Platform,
} from 'react-native';
import {
  Fingerprint, Download, QrCode, ShieldCheck, TrendingUp, TrendingDown,
  FileText, Wallet, MapPin, Calendar, CheckCircle2, Plus,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import * as Haptics from 'expo-haptics';
import PageScaffold, { GlassCard, SectionHeader } from '../components/PageScaffold';
import { useTheme } from '../constants/Theme';
import { useKilimoStore } from '../store/useKilimoStore';
import { useFarmDataStore } from '../store/useFarmDataStore';
import { exportPnlPdf, PnlReport } from '../lib/pdf/pnl';
import { Gate } from '../lib/access';
import Animated, { FadeIn, FadeOut, FadeInDown, FadeInUp } from 'react-native-reanimated';

const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.abs(n));

export default function AgroIdScreen() {
  const { colors, isDark } = useTheme();
  const agroId = useKilimoStore((s) => s.agroId);
  const ledger = useFarmDataStore((s) => s.ledger);
  const addLedgerEntry = useFarmDataStore((s) => s.addLedgerEntry);
  const [exporting, setExporting] = useState(false);

  const { income, expense, net } = useMemo(() => {
    const inc = ledger.filter((e) => e.amountTZS > 0).reduce((s, e) => s + e.amountTZS, 0);
    const exp = ledger.filter((e) => e.amountTZS < 0).reduce((s, e) => s + Math.abs(e.amountTZS), 0);
    return { income: inc, expense: exp, net: inc - exp };
  }, [ledger]);

  const qrPayload = `https://kilimo.ai/verify/${agroId?.id ?? 'unknown'}`;

  async function handleExport() {
    if (!agroId) return;
    setExporting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      const report: PnlReport = {
        agroId,
        seasonLabel: 'Msimu wa Mvua Ndefu 2026',
        items: ledger.map(({ id, ...rest }) => ({
          date: rest.date,
          category: rest.category,
          description: rest.description,
          amount: rest.amountTZS,
        })),
        generatedAt: new Date().toISOString(),
        qrPayload,
      };
      await exportPnlPdf(report);
    } catch (err: any) {
      Alert.alert('Hitilafu', err?.message ?? 'Failed to export PDF');
    } finally {
      setExporting(false);
    }
  }

  function addSampleEntry(positive: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addLedgerEntry({
      date: new Date().toISOString(),
      category: positive ? 'Sale · Manual entry' : 'Expense · Manual entry',
      description: positive ? 'Mauzo ya soko' : 'Manunuzi ya pembejeo',
      amountTZS: positive ? 250_000 : -120_000,
    });
  }

  if (!agroId) {
    return (
      <PageScaffold title="Agro ID" subtitle="Tafadhali ingia kwanza" badge="AGRO ID">
        <Text style={{ textAlign: 'center', color: colors.textMute, marginTop: 40 }}>Sign in to view your Agro ID.</Text>
      </PageScaffold>
    );
  }

  return (
    <Gate feature="agro_id" fallback={<PageScaffold title="Agro ID" badge="VERIFIED IDENTITY"><AgroIdDenied /></PageScaffold>}>
    <PageScaffold title="Agro ID" subtitle="Hati yako ya kidijiti ya kifedha" badge="VERIFIED IDENTITY">
      {/* The Identity Card */}
      <View style={{ paddingHorizontal: 24 }}>
        <Animated.View entering={FadeInDown}>
          <GlassCard style={{ padding: 24 }}>
            <LinearGradient
              colors={[colors.primary + '22', 'transparent']}
              style={StyleSheet.absoluteFill}
            />
            <View style={s.cardHeader}>
              <View style={s.badge}>
                <ShieldCheck size={12} color={colors.primary} />
                <Text style={[s.badgeText, { color: colors.primary }]}>VERIFIED</Text>
              </View>
              <Text style={[s.idNum, { color: colors.textMute }]}>{agroId.id}</Text>
            </View>

            <View style={s.profileRow}>
                {agroId.avatarUrl ? (
                  <Image source={{ uri: agroId.avatarUrl }} style={[s.avatar, { borderColor: colors.primary }]} />
                ) : (
                  <View style={[s.avatar, { borderColor: colors.primary, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.card }]}>
                    <Text style={{ color: colors.text, fontSize: 32, fontFamily: 'Inter_900Black' }}>
                      {agroId.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                    </Text>
                  </View>
                )}
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={[s.name, { color: colors.text }]}>{agroId.name}</Text>
                <Text style={[s.role, { color: colors.textMute }]}>{agroId.role}</Text>
                <View style={s.metaRow}>
                  <MapPin size={11} color={colors.textMute} />
                  <Text style={[s.metaText, { color: colors.textMute }]}>{agroId.location}</Text>
                  <Calendar size={11} color={colors.textMute} style={{ marginLeft: 10 }} />
                  <Text style={[s.metaText, { color: colors.textMute }]}>Since {agroId.joinDate}</Text>
                </View>
              </View>
            </View>

            <View style={s.qrSection}>
              <View style={[s.qrWrap, { backgroundColor: '#fff' }]}>
                <QRCode value={qrPayload} size={120} backgroundColor="#fff" color="#000" />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={[s.qrTitle, { color: colors.text }]}>Scannable Identity</Text>
                <Text style={[s.qrBody, { color: colors.textMute }]}>
                  Banks and buyers scan this code to instantly verify your farm record, certifications, and P&L history.
                </Text>
                <View style={s.chipRow}>
                  <View style={[s.chip, { backgroundColor: colors.primary + '20' }]}>
                    <Fingerprint size={10} color={colors.primary} />
                    <Text style={[s.chipText, { color: colors.primary }]}>{agroId.tier}</Text>
                  </View>
                  {agroId.mpesaLinked && (
                    <View style={[s.chip, { backgroundColor: '#3b82f620' }]}>
                      <Wallet size={10} color="#3b82f6" />
                      <Text style={[s.chipText, { color: '#3b82f6' }]}>M-Pesa</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </GlassCard>
        </Animated.View>
      </View>

      {/* P&L Summary */}
      <SectionHeader title="Mapato na Matumizi · P&L" />
      <View style={{ paddingHorizontal: 24, gap: 12 }}>
        <View style={s.summaryGrid}>
          <SummaryTile label="Mapato" value={income} accent="#10b981" Icon={TrendingUp} />
          <SummaryTile label="Matumizi" value={expense} accent="#ef4444" Icon={TrendingDown} />
        </View>
        <GlassCard style={{ padding: 18 }}>
          <Text style={[s.netLabel, { color: colors.textMute }]}>Faida Halisi · Net Position</Text>
          <Text style={[s.netValue, { color: net >= 0 ? '#10b981' : '#ef4444' }]}>
            {net >= 0 ? '+' : '−'} TZS {fmt(net)}
          </Text>
          <Text style={[s.netSub, { color: colors.textMute }]}>{ledger.length} entries · ready for bank submission</Text>
        </GlassCard>
      </View>

      {/* Primary CTA — PDF Export */}
      <View style={{ paddingHorizontal: 24, marginTop: 20 }}>
        <TouchableOpacity
          onPress={handleExport}
          disabled={exporting}
          activeOpacity={0.85}
          style={[s.primaryCta, { backgroundColor: colors.primary, opacity: exporting ? 0.6 : 1 }]}
          accessibilityRole="button"
          accessibilityLabel="Export Profit and Loss statements to PDF"
          accessibilityState={{ disabled: exporting }}
        >
          {exporting ? (
            <Text style={[s.primaryCtaText, { color: isDark ? '#000' : '#FCFBF7' }]}>Inatayarisha PDF...</Text>
          ) : (
            <>
              <Download size={20} color={isDark ? '#000' : '#FCFBF7'} />
              <Text style={[s.primaryCtaText, { color: isDark ? '#000' : '#FCFBF7' }]}>
                {Platform.OS === 'web' ? 'Print / Save P&L PDF' : 'Export & Share P&L PDF'}
              </Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={[s.disclaimer, { color: colors.textMute }]}>
          PDF imeundwa na sahihi ya QR · Tamper-evident · Inakubaliwa na NMB, CRDB, na taasisi nyingine.
        </Text>
      </View>

      {/* Quick add entries */}
      <SectionHeader title="Ongeza Akaunti · Quick Entry" />
      <View style={{ paddingHorizontal: 24, flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          onPress={() => addSampleEntry(true)}
          style={[s.quickBtn, { backgroundColor: colors.success + '20', borderColor: colors.success + '40' }]}
          accessibilityRole="button"
          accessibilityLabel="Quick add income transaction"
          accessibilityHint="Adds a sample Mauzo ya soko entry"
        >
          <Plus size={14} color={colors.success} />
          <Text style={[s.quickBtnText, { color: colors.success }]}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => addSampleEntry(false)}
          style={[s.quickBtn, { backgroundColor: colors.error + '20', borderColor: colors.error + '40' }]}
          accessibilityRole="button"
          accessibilityLabel="Quick add expense transaction"
          accessibilityHint="Adds a sample Manunuzi ya pembejeo entry"
        >
          <Plus size={14} color={colors.error} />
          <Text style={[s.quickBtnText, { color: colors.error }]}>Expense</Text>
        </TouchableOpacity>
      </View>

      {/* Recent ledger */}
      <SectionHeader title={`Ledger · ${ledger.length} entries`} />
      <View style={{ paddingHorizontal: 24 }}>
        <GlassCard>
          {ledger.slice(0, 8).map((e, i) => (
            <View key={e.id}>
              <View style={s.ledgerRow}>
                <View style={[s.ledgerDot, { backgroundColor: e.amountTZS > 0 ? '#10b981' : '#ef4444' }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[s.ledgerDesc, { color: colors.text }]} numberOfLines={1}>{e.description}</Text>
                  <Text style={[s.ledgerCat, { color: colors.textMute }]}>{e.category} · {new Date(e.date).toLocaleDateString('en-GB')}</Text>
                </View>
                <Text style={[s.ledgerAmt, { color: e.amountTZS > 0 ? '#10b981' : '#ef4444' }]}>
                  {e.amountTZS > 0 ? '+' : '−'} {fmt(e.amountTZS)}
                </Text>
              </View>
              {i < Math.min(7, ledger.length - 1) && <View style={[s.divider, { backgroundColor: colors.border }]} />}
            </View>
          ))}
        </GlassCard>
      </View>
    </PageScaffold>
    </Gate>
  );
}

function AgroIdDenied() {
  const { colors } = useTheme();
  return (
    <View style={{ padding: 24 }}>
      <GlassCard style={{ padding: 24, alignItems: 'center' }}>
        <ShieldCheck size={32} color={colors.textMute} />
        <Text style={{ color: colors.text, fontFamily: 'Inter_800ExtraBold', fontSize: 16, marginTop: 12 }}>Hairuhusiwi</Text>
        <Text style={{ color: colors.textMute, fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 6, textAlign: 'center' }}>
          Akaunti yako haina ufikiaji wa Agro ID. Wasiliana na msimamizi wa ushirika wako.
        </Text>
      </GlassCard>
    </View>
  );
}

function SummaryTile({ label, value, accent, Icon }: any) {
  const { colors } = useTheme();
  return (
    <GlassCard style={{ flex: 1, padding: 18 }}>
      <View style={s.summaryRow}>
        <Icon size={16} color={accent} />
        <Text style={[s.summaryLabel, { color: colors.textMute }]}>{label}</Text>
      </View>
      <Text style={[s.summaryValue, { color: colors.text }]}>TZS {fmt(value)}</Text>
    </GlassCard>
  );
}

const s = StyleSheet.create({
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: 'rgba(62,207,142,0.18)' },
  badgeText: { fontSize: 10, fontFamily: 'Inter_900Black', letterSpacing: 1.2 },
  idNum: { fontSize: 12, fontFamily: 'Inter_700Bold', letterSpacing: 1.5 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 64, height: 64, borderRadius: 22, borderWidth: 2 },
  name: { fontSize: 22, fontFamily: 'Inter_900Black', letterSpacing: -0.5 },
  role: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  metaText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  qrSection: { flexDirection: 'row', alignItems: 'center', paddingTop: 18, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  qrWrap: { padding: 8, borderRadius: 12 },
  qrTitle: { fontSize: 14, fontFamily: 'Inter_800ExtraBold', marginBottom: 4 },
  qrBody: { fontSize: 11, fontFamily: 'Inter_500Medium', lineHeight: 16 },
  chipRow: { flexDirection: 'row', gap: 6, marginTop: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  chipText: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.5 },
  summaryGrid: { flexDirection: 'row', gap: 12 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  summaryLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  summaryValue: { fontSize: 18, fontFamily: 'Inter_900Black', letterSpacing: -0.5 },
  netLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 1 },
  netValue: { fontSize: 30, fontFamily: 'Inter_900Black', letterSpacing: -1, marginTop: 6 },
  netSub: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 4 },
  primaryCta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18, borderRadius: 18 },
  primaryCtaText: { color: '#000', fontSize: 15, fontFamily: 'Inter_900Black', letterSpacing: 0.3 },
  disclaimer: { fontSize: 11, fontFamily: 'Inter_500Medium', textAlign: 'center', marginTop: 10, lineHeight: 16 },
  quickBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
  quickBtnText: { fontSize: 13, fontFamily: 'Inter_800ExtraBold' },
  ledgerRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  ledgerDot: { width: 8, height: 8, borderRadius: 4 },
  ledgerDesc: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  ledgerCat: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 2 },
  ledgerAmt: { fontSize: 13, fontFamily: 'Inter_900Black' },
  divider: { height: 1, marginLeft: 34 },
});
