/**
 * Contract Farming — list + create modal
 * Lifecycle: Draft → Sent → Under Review → Signed → Active → Milestone Due → Completed
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Handshake, ChevronRight, X, FileText, User, MapPin, Wheat } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut, FadeInDown, FadeInUp } from 'react-native-reanimated';
import PageScaffold, { GlassCard, SectionHeader, EmptyState } from '../../components/PageScaffold';
import { useTheme } from '../../constants/Theme';
import {
  useContractsStore, STATUS_LABEL, STATUS_COLOR, Contract, ContractStatus,
} from '../../store/useContractsStore';
import { Gate } from '../../lib/access';
import { RequireVerification } from '../../components/RequireVerification';

const FILTERS: { label: string; status: 'all' | ContractStatus }[] = [
  { label: 'Yote', status: 'all' },
  { label: 'Rasimu', status: 'draft' },
  { label: 'Inakaguliwa', status: 'under_review' },
  { label: 'Inaendelea', status: 'active' },
  { label: 'Imekamilika', status: 'completed' },
];

const CROPS = ['Mahindi', 'Mpunga', 'Maharage', 'Kahawa', 'Alizeti', 'Mihogo', 'Nyanya', 'Pamba', 'Ngano', 'Viazi'];
const REGIONS = ['Arusha', 'Mbeya', 'Kilimanjaro', 'Morogoro', 'Iringa', 'Dodoma', 'Mwanza', 'Tanga', 'Pwani', 'Singida'];

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

// ─── Create modal ─────────────────────────────────────────────────────────────
function CreateContractModal({ visible, onClose, onCreate }: {
  visible: boolean;
  onClose: () => void;
  onCreate: (id: string) => void;
}) {
  const { colors, isDark } = useTheme();
  const createContract = useContractsStore((s) => s.createContract);

  const [title, setTitle] = useState('');
  const [crop, setCrop] = useState('Mahindi');
  const [buyer, setBuyer] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [region, setRegion] = useState('Arusha');

  function handleCreate() {
    if (!title.trim()) { Alert.alert('Kichwa kinahitajika', 'Tafadhali weka jina la mkataba.'); return; }
    if (!buyer.trim()) { Alert.alert('Mnunuzi anahitajika', 'Tafadhali weka jina la mnunuzi.'); return; }
    const q = parseFloat(qty);
    const p = parseFloat(price);
    if (!q || q <= 0) { Alert.alert('Kiasi kinahitajika', 'Weka kiasi cha mazao kwa kg.'); return; }
    if (!p || p <= 0) { Alert.alert('Bei inahitajika', 'Weka bei kwa kilo moja.'); return; }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const id = createContract({
      title: title.trim(),
      crop,
      quantityKg: q,
      pricePerKgTZS: p,
      buyer: buyer.trim(),
      region,
      milestones: [],
    });
    setTitle(''); setBuyer(''); setQty(''); setPrice('');
    onClose();
    onCreate(id);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={[cm.sheet, { backgroundColor: isDark ? '#1a1a2e' : '#fff' }]}>
          <View style={[cm.handle, { backgroundColor: colors.border }]} />
          <View style={cm.sheetHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[cm.iconBg, { backgroundColor: colors.primary + '20' }]}>
                <Handshake size={18} color={colors.primary} />
              </View>
              <Text style={[cm.sheetTitle, { color: colors.text }]}>Mkataba Mpya</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[cm.closeBtn, { backgroundColor: colors.card }]}>
              <X size={16} color={colors.textMute} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            {/* Title */}
            <LabelRow icon={<FileText size={13} color={colors.primary} />} label="JINA LA MKATABA *" />
            <View style={[cm.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput value={title} onChangeText={setTitle} style={[cm.input, { color: colors.text }]}
                placeholderTextColor={colors.textMute} placeholder="e.g. Mahindi Hifadhi ya 2026..." />
            </View>

            {/* Crop */}
            <LabelRow icon={<Wheat size={13} color="#22d15a" />} label="ZAO" />
            <ScrollView showsVerticalScrollIndicator={false} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
              {CROPS.map((c) => (
                <TouchableOpacity key={c} onPress={() => { Haptics.selectionAsync(); setCrop(c); }}
                  style={[cm.pill, { borderColor: crop === c ? colors.primary : colors.border, backgroundColor: crop === c ? colors.primary + '18' : 'transparent' }]}>
                  <Text style={[cm.pillText, { color: crop === c ? colors.primary : colors.textMute }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Buyer */}
            <LabelRow icon={<User size={13} color="#8b5cf6" />} label="MNUNUZI *" />
            <View style={[cm.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput value={buyer} onChangeText={setBuyer} style={[cm.input, { color: colors.text }]}
                placeholderTextColor={colors.textMute} placeholder="e.g. NMB Foods Ltd..." />
            </View>

            {/* Region */}
            <LabelRow icon={<MapPin size={13} color="#3b82f6" />} label="MKOA" />
            <ScrollView showsVerticalScrollIndicator={false} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
              {REGIONS.map((r) => (
                <TouchableOpacity key={r} onPress={() => { Haptics.selectionAsync(); setRegion(r); }}
                  style={[cm.pill, { borderColor: region === r ? colors.primary : colors.border, backgroundColor: region === r ? colors.primary + '18' : 'transparent' }]}>
                  <Text style={[cm.pillText, { color: region === r ? colors.primary : colors.textMute }]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Qty + Price */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <LabelRow label="KIASI (kg) *" />
                <View style={[cm.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  <TextInput value={qty} onChangeText={setQty} keyboardType="decimal-pad"
                    style={[cm.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder="1000" />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <LabelRow label="BEI/kg (TZS) *" />
                <View style={[cm.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  <TextInput value={price} onChangeText={setPrice} keyboardType="decimal-pad"
                    style={[cm.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder="850" />
                </View>
              </View>
            </View>

            {/* Value preview */}
            {qty && price && parseFloat(qty) > 0 && parseFloat(price) > 0 && (
              <View style={[cm.previewBox, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}>
                <Text style={[cm.previewLabel, { color: colors.textMute }]}>Thamani ya mkataba</Text>
                <Text style={[cm.previewValue, { color: colors.primary }]}>
                  TZS {fmt(parseFloat(qty) * parseFloat(price))}
                </Text>
              </View>
            )}

            <TouchableOpacity onPress={handleCreate} style={[cm.createBtn, { backgroundColor: colors.primary }]}>
              <Handshake size={18} color="#000" />
              <Text style={cm.createBtnText}>Tengeneza Mkataba</Text>
            </TouchableOpacity>
            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function LabelRow({ icon, label }: { icon?: React.ReactNode; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16, marginBottom: 8 }}>
      {icon}
      <Text style={[cm.fieldLabel, { color: colors.textMute }]}>{label}</Text>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function ContractsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const contracts = useContractsStore((s) => s.contracts);
  const [filter, setFilter] = useState<'all' | ContractStatus>('all');
  const [showModal, setShowModal] = useState(false);

  const filtered = filter === 'all' ? contracts : contracts.filter((c) => c.status === filter);

  const active = contracts.filter((c) => c.status === 'active').length;
  const pending = contracts.filter((c) => c.status === 'under_review' || c.status === 'sent').length;
  const totalValue = contracts.reduce((s, c) => s + c.quantityKg * c.pricePerKgTZS, 0);

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
      <RequireVerification>
      <CreateContractModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onCreate={(id) => router.push(`/contracts/${id}` as any)}
      />

      <PageScaffold
        title="Mikataba"
        subtitle="Contract Farming"
        badge="MARKETPLACE"
        headerRight={
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowModal(true); }}
            style={[s.addBtn, { backgroundColor: colors.primary }]}
          >
            <Plus size={20} color="#000" />
          </TouchableOpacity>
        }
      >
        {/* Summary */}
        {contracts.length > 0 && (
          <View style={{ paddingHorizontal: 24 }}>
            <Animated.View entering={FadeInDown}>
              <GlassCard style={s.summaryCard}>
                <SummaryPill count={contracts.length} label="Mikataba Yote" color={colors.primary} />
                <View style={[s.vr, { backgroundColor: colors.border }]} />
                <SummaryPill count={active} label="Inaendelea" color="#22d15a" />
                <View style={[s.vr, { backgroundColor: colors.border }]} />
                <SummaryPill count={pending} label="Inakaguliwa" color="#f59e0b" />
              </GlassCard>
            </Animated.View>
          </View>
        )}

        {/* Filter pills */}
        <ScrollView showsVerticalScrollIndicator={false} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 8, paddingVertical: 12 }}>
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
        </ScrollView>

        <SectionHeader title={`${filtered.length} mikataba`} />

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Handshake size={36} color={colors.primary} />}
            title="Hakuna mikataba"
            body="Tengeneza mkataba mpya wa kuuza mazao yako kwa mnunuzi aliyethibitishwa."
            cta="Tengeneza Mkataba"
            onCta={() => setShowModal(true)}
          />
        ) : (
          <View style={{ paddingHorizontal: 24, gap: 10 }}>
            {filtered.map((c, idx) => (
              <Animated.View
                key={c.id}
                entering={FadeInDown}
              >
                <ContractRow c={c} onPress={() => router.push(`/contracts/${c.id}` as any)} />
              </Animated.View>
            ))}
          </View>
        )}
      </PageScaffold>
      </RequireVerification>
    </Gate>
  );
}

function SummaryPill({ count, label, color }: { count: number; label: string; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={[s.pillCount, { color }]}>{count}</Text>
      <Text style={[s.pillLabel, { color: colors.textMute }]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function ContractRow({ c, onPress }: { c: Contract; onPress: () => void }) {
  const { colors } = useTheme();
  const totalValue = c.quantityKg * c.pricePerKgTZS;
  const paidMilestones = c.milestones.filter((m) => m.paid).length;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        <View style={[s.statusBar, { backgroundColor: STATUS_COLOR[c.status] }]} />
        <View style={{ padding: 18 }}>
          <View style={s.rowTop}>
            <View style={{ flex: 1 }}>
              <View style={[s.statusBadge, { backgroundColor: STATUS_COLOR[c.status] + '25' }]}>
                <View style={[s.statusDot, { backgroundColor: STATUS_COLOR[c.status] }]} />
                <Text style={[s.statusText, { color: STATUS_COLOR[c.status] }]}>{STATUS_LABEL[c.status]}</Text>
              </View>
              <Text style={[s.title, { color: colors.text }]} numberOfLines={1}>{c.title}</Text>
              <Text style={[s.sub, { color: colors.textMute }]} numberOfLines={1}>
                {c.buyer}{c.buyerOrg ? ` · ${c.buyerOrg}` : ''} · {c.region}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textMute} />
          </View>
          <View style={[s.rowBottom, { borderTopColor: colors.border }]}>
            <Metric label="Zao" value={c.crop} />
            <Metric label="Kiasi" value={`${fmt(c.quantityKg)} kg`} />
            <Metric label="Bei/kg" value={`TZS ${fmt(c.pricePerKgTZS)}`} />
            <Metric label="Jumla" value={`TZS ${fmt(totalValue)}`} highlight />
          </View>
          {c.milestones.length > 0 && (
            <View style={[s.milestoneBar, { borderTopColor: colors.border }]}>
              <Text style={[s.milestoneText, { color: colors.textMute }]}>
                Hatua: {paidMilestones}/{c.milestones.length} imelipwa
              </Text>
              <View style={[s.mTrack, { backgroundColor: colors.border }]}>
                <View style={[s.mFill, {
                  backgroundColor: STATUS_COLOR[c.status],
                  width: `${c.milestones.length > 0 ? (paidMilestones / c.milestones.length) * 100 : 0}%` as any,
                }]} />
              </View>
            </View>
          )}
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
  summaryCard: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  pillCount: { fontSize: 22, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.5 },
  pillLabel: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.5, marginTop: 3, textAlign: 'center' },
  vr: { width: 1, height: 36, marginHorizontal: 4 },
  filterPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 1 },
  filterText: { fontSize: 12, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.3 },
  statusBar: { height: 3 },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: 0.8 },
  title: { fontSize: 16, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.3 },
  sub: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 2 },
  rowBottom: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, marginTop: 14, paddingTop: 12 },
  milestoneBar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, paddingTop: 10, borderTopWidth: 1 },
  milestoneText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  mTrack: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  mFill: { height: '100%', borderRadius: 2 },
  metricLabel: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 0.8 },
  metricValue: { fontSize: 12, fontFamily: 'Inter_800ExtraBold', marginTop: 2 },
});

const cm = StyleSheet.create({
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 32, maxHeight: '92%' },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  sheetTitle: { fontSize: 18, fontFamily: 'InstrumentSerif_400Regular' },
  iconBg: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  fieldLabel: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.5 },
  inputWrap: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 4 },
  input: { fontSize: 15, fontFamily: 'Inter_600SemiBold', paddingVertical: 10 },
  pill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1.5 },
  pillText: { fontSize: 12, fontFamily: 'Inter_800ExtraBold' },
  previewBox: { marginTop: 16, padding: 14, borderRadius: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  previewLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  previewValue: { fontSize: 18, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.5 },
  createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, paddingVertical: 16, borderRadius: 16 },
  createBtnText: { color: '#000', fontSize: 15, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: 0.3 },
});
