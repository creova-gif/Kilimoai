/**
 * Insurance Hub — crop & livestock insurance discovery + claims
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Shield, FileCheck2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import PageScaffold, { GlassCard, SectionHeader, EmptyState } from '../components/PageScaffold';
import { useTheme } from '../constants/Theme';
import { useFarmDataStore, InsurancePolicy } from '../store/useFarmDataStore';
import { Gate } from '../lib/access';

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

const STATUS_META = {
  browse: { color: '#94a3b8', label: 'Available' },
  pending: { color: '#f59e0b', label: 'Pending' },
  active: { color: '#22d15a', label: 'Active' },
  expired: { color: '#64748b', label: 'Expired' },
  claimed: { color: '#3b82f6', label: 'Claim Filed' },
};

export default function InsuranceScreen() {
  const { colors } = useTheme();
  const policies = useFarmDataStore((s) => s.insurance);
  const enroll = useFarmDataStore((s) => s.enrollPolicy);
  const fileClaim = useFarmDataStore((s) => s.fileClaim);

  const myPolicies = policies.filter((p) => p.status === 'active' || p.status === 'pending' || p.status === 'claimed');
  const available = policies.filter((p) => p.status === 'browse');

  function handleEnroll(p: InsurancePolicy) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      `${p.product}`,
      `Premium: TZS ${fmt(p.premiumTZS)} · Payout up to TZS ${fmt(p.payoutMaxTZS)} · ${p.termMonths} months`,
      [
        { text: 'Sitaki', style: 'cancel' },
        { text: 'Enroll', onPress: () => enroll(p.id) },
      ]
    );
  }

  function handleClaim(p: InsurancePolicy) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    fileClaim(p.id, 'Crop damage from prolonged drought', Math.round(p.payoutMaxTZS * 0.6));
  }

  return (
    <Gate feature="insurance" fallback={<PageScaffold title="Bima" badge="INSURANCE"><AccessDenied /></PageScaffold>}>
      <PageScaffold title="Bima" subtitle="Crop & livestock insurance" badge="INSURANCE HUB">
        <SectionHeader title="Sera Yangu · My Policies" />
        {myPolicies.length === 0 ? (
          <View style={{ paddingHorizontal: 24 }}>
            <GlassCard style={{ padding: 18, alignItems: 'center' }}>
              <Shield size={24} color={colors.textMute} />
              <Text style={[s.empty, { color: colors.textMute }]}>Hakuna sera bado · No active policies</Text>
            </GlassCard>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 24, gap: 10 }}>
            {myPolicies.map((p) => <PolicyCard key={p.id} p={p} onClaim={handleClaim} />)}
          </View>
        )}

        <SectionHeader title="Patikana · Available" />
        <View style={{ paddingHorizontal: 24, gap: 10 }}>
          {available.map((p) => (
            <GlassCard key={p.id} style={{ padding: 18 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[s.iconBg, { backgroundColor: colors.primary + '20' }]}>
                  <Shield size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[s.product, { color: colors.text }]}>{p.product}</Text>
                  <Text style={[s.provider, { color: colors.textMute }]}>{p.provider} · {p.coverage}</Text>
                </View>
              </View>
              <View style={[s.specs, { borderTopColor: colors.border }]}>
                <Spec label="Premium" value={`TZS ${fmt(p.premiumTZS)}`} />
                <Spec label="Max Payout" value={`TZS ${fmt(p.payoutMaxTZS)}`} highlight />
                <Spec label="Term" value={`${p.termMonths} mo`} />
              </View>
              <TouchableOpacity
                onPress={() => handleEnroll(p)}
                style={[s.enrollBtn, { backgroundColor: colors.primary }]}
                activeOpacity={0.85}
              >
                <Text style={s.enrollText}>Jiunge · Enroll</Text>
              </TouchableOpacity>
            </GlassCard>
          ))}
        </View>
      </PageScaffold>
    </Gate>
  );
}

function PolicyCard({ p, onClaim }: { p: InsurancePolicy; onClaim: (p: InsurancePolicy) => void }) {
  const { colors } = useTheme();
  const meta = STATUS_META[p.status];
  return (
    <GlassCard style={{ padding: 18 }}>
      <View style={s.policyRow}>
        <View style={[s.statusBadge, { backgroundColor: meta.color + '25' }]}>
          <View style={[s.statusDot, { backgroundColor: meta.color }]} />
          <Text style={[s.statusText, { color: meta.color }]}>{meta.label.toUpperCase()}</Text>
        </View>
        {p.expiresAt && (
          <Text style={[s.expires, { color: colors.textMute }]}>
            <Clock size={10} color={colors.textMute} /> Until {new Date(p.expiresAt).toLocaleDateString('en-GB')}
          </Text>
        )}
      </View>
      <Text style={[s.product, { color: colors.text, marginTop: 8 }]}>{p.product}</Text>
      <Text style={[s.provider, { color: colors.textMute }]}>{p.provider}</Text>
      {p.status === 'claimed' ? (
        <View style={[s.claimBox, { borderColor: '#3b82f640' }]}>
          <FileCheck2 size={14} color="#3b82f6" />
          <Text style={[s.claimText, { color: '#3b82f6' }]}>
            Claim filed: TZS {fmt(p.claimAmountTZS ?? 0)} — under review
          </Text>
        </View>
      ) : p.status === 'active' ? (
        <TouchableOpacity onPress={() => onClaim(p)} style={[s.claimBtn, { borderColor: colors.primary }]}>
          <Text style={[s.claimBtnText, { color: colors.primary }]}>File Claim</Text>
        </TouchableOpacity>
      ) : null}
    </GlassCard>
  );
}

function Spec({ label, value, highlight }: any) {
  const { colors } = useTheme();
  return (
    <View>
      <Text style={[s.specLabel, { color: colors.textMute }]}>{label}</Text>
      <Text style={[s.specValue, { color: highlight ? colors.primary : colors.text }]}>{value}</Text>
    </View>
  );
}

function AccessDenied() {
  return (
    <EmptyState
      icon={<AlertTriangle size={36} color="#f59e0b" />}
      title="Haipatikani"
      body="Bima haipatikani kwa jukumu lako."
    />
  );
}

const s = StyleSheet.create({
  empty: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginTop: 8 },
  iconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  product: { fontSize: 15, fontFamily: 'Inter_900Black', letterSpacing: -0.3 },
  provider: { fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 0.5, marginTop: 2 },
  specs: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTopWidth: 1 },
  specLabel: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1 },
  specValue: { fontSize: 12, fontFamily: 'Inter_800ExtraBold', marginTop: 2 },
  enrollBtn: { marginTop: 14, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  enrollText: { color: '#000', fontSize: 13, fontFamily: 'Inter_900Black', letterSpacing: 0.5 },
  policyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontFamily: 'Inter_900Black', letterSpacing: 0.8 },
  expires: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  claimBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 10, borderWidth: 1, marginTop: 12 },
  claimText: { fontSize: 11, fontFamily: 'Inter_700Bold', flex: 1 },
  claimBtn: { marginTop: 12, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
  claimBtnText: { fontSize: 12, fontFamily: 'Inter_900Black', letterSpacing: 0.3 },
});
