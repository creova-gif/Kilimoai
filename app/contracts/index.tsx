/**
 * Contract Farming — list view
 * Lifecycle: Draft → Sent → Under Review → Signed → Active → Milestone Due → Completed
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Handshake, ChevronRight, Search } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import PageScaffold, { GlassCard, SectionHeader, EmptyState } from '../../components/PageScaffold';
import { useTheme } from '../../constants/Theme';
import { useContractsStore, STATUS_LABEL, STATUS_COLOR, Contract, ContractStatus } from '../../store/useContractsStore';
import { Gate } from '../../lib/access';

const FILTERS: { label: string; status: 'all' | ContractStatus }[] = [
  { label: 'All', status: 'all' },
  { label: 'Draft', status: 'draft' },
  { label: 'Pending', status: 'under_review' },
  { label: 'Active', status: 'active' },
  { label: 'Done', status: 'completed' },
];

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

export default function ContractsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const contracts = useContractsStore((s) => s.contracts);
  const createContract = useContractsStore((s) => s.createContract);
  const [filter, setFilter] = useState<'all' | ContractStatus>('all');

  const filtered = filter === 'all' ? contracts : contracts.filter((c) => c.status === filter);

  function handleNew() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const id = createContract({
      title: 'New Contract — Untitled',
      crop: 'Maize',
      quantityKg: 1000,
      pricePerKgTZS: 800,
      buyer: 'New Buyer',
      region: 'Arusha',
      milestones: [],
    });
    router.push(`/contracts/${id}`);
  }

  return (
    <Gate
      feature="contract_farming"
      fallback={
        <PageScaffold title="Mikataba" badge="MARKETPLACE">
          <View style={{ padding: 24 }}>
            <GlassCard style={{ padding: 24, alignItems: 'center' }}>
              <Handshake size={32} color={colors.textMute} />
              <Text style={{ color: colors.text, fontFamily: 'Inter_800ExtraBold', fontSize: 16, marginTop: 12 }}>Hairuhusiwi</Text>
              <Text style={{ color: colors.textMute, fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 6, textAlign: 'center' }}>
                Mikataba inapatikana kwa wakulima walio na akaunti ya Premium au Ushirika.
              </Text>
            </GlassCard>
          </View>
        </PageScaffold>
      }
    >
    <PageScaffold
      title="Mikataba"
      subtitle="Contract Farming"
      badge="MARKETPLACE"
      headerRight={
        <TouchableOpacity onPress={handleNew} style={[s.addBtn, { backgroundColor: colors.primary }]}>
          <Plus size={20} color="#000" />
        </TouchableOpacity>
      }
    >
      {/* Filter pills */}
      <View style={s.filterRow}>
        {FILTERS.map((f) => {
          const active = filter === f.status;
          return (
            <TouchableOpacity
              key={f.status}
              onPress={() => { Haptics.selectionAsync(); setFilter(f.status); }}
              style={[
                s.filterPill,
                { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary + '20' : 'transparent' },
              ]}
            >
              <Text style={[s.filterText, { color: active ? colors.primary : colors.textMute }]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <SectionHeader title={`${filtered.length} mikataba`} />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Handshake size={36} color={colors.primary} />}
          title="Hakuna mikataba"
          body="Tengeneza mkataba mpya wa kuuza mazao yako kwa mnunuzi aliyethibitishwa."
          cta="Tengeneza Mkataba"
          onCta={handleNew}
        />
      ) : (
        <View style={{ paddingHorizontal: 24, gap: 10 }}>
          {filtered.map((c) => <ContractRow key={c.id} c={c} onPress={() => router.push(`/contracts/${c.id}`)} />)}
        </View>
      )}
    </PageScaffold>
    </Gate>
  );
}

function ContractRow({ c, onPress }: { c: Contract; onPress: () => void }) {
  const { colors } = useTheme();
  const totalValue = c.quantityKg * c.pricePerKgTZS;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <GlassCard style={{ padding: 18 }}>
        <View style={s.rowTop}>
          <View style={{ flex: 1 }}>
            <View style={[s.statusBadge, { backgroundColor: STATUS_COLOR[c.status] + '25' }]}>
              <View style={[s.statusDot, { backgroundColor: STATUS_COLOR[c.status] }]} />
              <Text style={[s.statusText, { color: STATUS_COLOR[c.status] }]}>{STATUS_LABEL[c.status]}</Text>
            </View>
            <Text style={[s.title, { color: colors.text }]} numberOfLines={1}>{c.title}</Text>
            <Text style={[s.sub, { color: colors.textMute }]} numberOfLines={1}>
              {c.buyer} · {c.region}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textMute} />
        </View>
        <View style={[s.rowBottom, { borderTopColor: colors.border }]}>
          <Metric label="Qty" value={`${fmt(c.quantityKg)} kg`} />
          <Metric label="Rate" value={`TZS ${fmt(c.pricePerKgTZS)}/kg`} />
          <Metric label="Total" value={`TZS ${fmt(totalValue)}`} highlight />
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

function Metric({ label, value, highlight }: any) {
  const { colors } = useTheme();
  return (
    <View>
      <Text style={[s.metricLabel, { color: colors.textMute }]}>{label}</Text>
      <Text style={[s.metricValue, { color: highlight ? colors.primary : colors.text }]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  addBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 8, marginTop: 4, flexWrap: 'wrap' },
  filterPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 1 },
  filterText: { fontSize: 12, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.3 },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontFamily: 'Inter_900Black', letterSpacing: 0.8 },
  title: { fontSize: 16, fontFamily: 'Inter_900Black', letterSpacing: -0.3 },
  sub: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 2 },
  rowBottom: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, marginTop: 14, paddingTop: 12 },
  metricLabel: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1 },
  metricValue: { fontSize: 13, fontFamily: 'Inter_800ExtraBold', marginTop: 2 },
});
