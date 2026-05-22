/**
 * Digital Farm Twin — Scenario list + create
 *
 * Lists saved what-if scenarios, shows a mini comparison bar chart for yield
 * and net profit, and lets the user create or duplicate scenarios (capped at 6
 * to keep the comparison view usable).
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  Alert, TextInput, Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Copy, Trash2, FlaskConical, ChevronRight, TrendingUp, ShieldCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import PageScaffold, { GlassCard, SectionHeader, EmptyState } from '../../components/PageScaffold';
import { useTheme } from '../../constants/Theme';
import { Gate } from '../../lib/access';
import { useDigitalFarmTwinStore, Scenario } from '../../store/useDigitalFarmTwinStore';

const MAX_SCENARIOS = 6;
const fmtTZS = (n: number) => `TSh ${new Intl.NumberFormat('en-US').format(Math.round(n))}`;

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <View style={mb.track}>
      <View style={[mb.fill, { width: `${pct * 100}%` as any, backgroundColor: color }]} />
    </View>
  );
}
const mb = StyleSheet.create({
  track: { height: 6, backgroundColor: '#ffffff18', borderRadius: 3, overflow: 'hidden', flex: 1 },
  fill:  { height: 6, borderRadius: 3 },
});

function riskColor(score: number) {
  return score >= 70 ? '#ef4444' : score >= 45 ? '#f97316' : score >= 25 ? '#f59e0b' : '#22c55e';
}

export default function FarmTwinList() {
  const { colors } = useTheme();
  const router = useRouter();
  const scenarios = useDigitalFarmTwinStore((s) => s.scenarios);
  const createScenario = useDigitalFarmTwinStore((s) => s.createScenario);
  const duplicateScenario = useDigitalFarmTwinStore((s) => s.duplicateScenario);
  const deleteScenario = useDigitalFarmTwinStore((s) => s.deleteScenario);
  const [newName, setNewName] = useState('');
  const [showModal, setShowModal] = useState(false);

  const maxYield = scenarios.length > 0 ? Math.max(...scenarios.map((s) => s.output.totalYieldTonnes), 1) : 1;
  const maxProfit = scenarios.length > 0 ? Math.max(...scenarios.map((s) => Math.max(0, s.output.netProfitTZS)), 1) : 1;

  function handleCreate() {
    const name = newName.trim() || `Hali ${scenarios.length + 1}`;
    const id = createScenario(name);
    setNewName('');
    setShowModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push(`/farm-twin/${id}`);
  }

  function handleDelete(sc: Scenario) {
    Alert.alert(
      'Futa hali',
      `Futa "${sc.name}"? Hii haiwezi kutenduliwa.`,
      [
        { text: 'Ghairi', style: 'cancel' },
        {
          text: 'Futa', style: 'destructive',
          onPress: () => { deleteScenario(sc.id); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); },
        },
      ],
    );
  }

  const renderItem = ({ item }: { item: Scenario }) => {
    const { output } = item;
    const rc = riskColor(output.riskScore);
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={() => router.push(`/farm-twin/${item.id}`)}>
        <GlassCard style={s.card}>
          <View style={s.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[s.cardName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[s.cardSub, { color: colors.textMute }]}>
                {item.inputs.crop} · {item.inputs.areaHa} ha · {item.inputs.irrigated ? 'Umwagiliaji' : 'Mvua'}
              </Text>
            </View>
            <View style={s.cardActions}>
              <TouchableOpacity
                onPress={() => {
                  if (scenarios.length >= MAX_SCENARIOS) {
                    Alert.alert('Ukomo', `Unaweza kuwa na hadi ${MAX_SCENARIOS} hali kwa wakati mmoja.`);
                    return;
                  }
                  const id = duplicateScenario(item.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/farm-twin/${id}`);
                }}
                style={s.iconBtn}
              >
                <Copy size={16} color={colors.textMute} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)} style={s.iconBtn}>
                <Trash2 size={16} color="#ef444488" />
              </TouchableOpacity>
            </View>
            <ChevronRight size={18} color={colors.textMute} />
          </View>

          {/* Metric rows with mini bars */}
          <View style={s.metricRow}>
            <Text style={[s.metricLabel, { color: colors.textMute }]}>Mavuno</Text>
            <MiniBar value={output.totalYieldTonnes} max={maxYield} color="#3ecf8e" />
            <Text style={[s.metricValue, { color: '#3ecf8e' }]}>{output.totalYieldTonnes}t</Text>
          </View>
          <View style={s.metricRow}>
            <Text style={[s.metricLabel, { color: colors.textMute }]}>Faida</Text>
            <MiniBar value={Math.max(0, output.netProfitTZS)} max={maxProfit} color="#3b82f6" />
            <Text style={[s.metricValue, { color: output.netProfitTZS >= 0 ? '#3b82f6' : '#ef4444' }]}>
              {fmtTZS(output.netProfitTZS)}
            </Text>
          </View>
          <View style={s.metricRow}>
            <Text style={[s.metricLabel, { color: colors.textMute }]}>Hatari</Text>
            <MiniBar value={output.riskScore} max={100} color={rc} />
            <Text style={[s.metricValue, { color: rc }]}>{output.riskScore}/100</Text>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  return (
    <Gate
      feature="digital_farm_twin"
      fallback={
        <PageScaffold title="Shamba Dijiti" badge="AI TWIN">
          <View style={{ padding: 24 }}>
            <GlassCard style={{ padding: 24, alignItems: 'center' }}>
              <ShieldCheck size={32} color={colors.textMute} />
              <Text style={[s.fallbackTitle, { color: colors.text }]}>Hairuhusiwi</Text>
              <Text style={[s.fallbackBody, { color: colors.textMute }]}>
                Shamba Dijiti inapatikana kwa Wasimamizi wa Shamba, Wakulima wa Biashara, na Wasimamizi Wakuu tu.
              </Text>
            </GlassCard>
          </View>
        </PageScaffold>
      }
    >
      <PageScaffold
        title="Shamba Dijiti"
        subtitle="Digital Farm Twin"
        badge="AI TWIN"
        headerRight={
          scenarios.length < MAX_SCENARIOS ? (
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={[s.addBtn, { backgroundColor: colors.primary }]}
            >
              <Plus size={20} color="#000" />
            </TouchableOpacity>
          ) : undefined
        }
      >
        {scenarios.length === 0 ? (
          <View style={{ padding: 24 }}>
            <EmptyState
              icon={<FlaskConical size={32} color={colors.textMute} />}
              title="Hakuna hali bado"
              body='Bonyeza "+" kuunda hali yako ya kwanza ya shamba dijiti.'
              cta="Unda Hali"
              onCta={() => setShowModal(true)}
            />
          </View>
        ) : (
          <>
            <SectionHeader title={`HALI ${scenarios.length}/${MAX_SCENARIOS}`} />
            <FlatList
              data={scenarios}
              keyExtractor={(i) => i.id}
              renderItem={renderItem}
              scrollEnabled={false}
              contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
            />
          </>
        )}
      </PageScaffold>

      {/* New scenario modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={[s.modal, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[s.modalTitle, { color: colors.text }]}>Hali Mpya</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Jina la hali (mfano: Mvua Nyingi)"
              placeholderTextColor={colors.textMute}
              style={[s.input, { color: colors.text, borderColor: colors.border }]}
              autoFocus
            />
            <View style={s.modalActions}>
              <TouchableOpacity
                style={[s.modalBtn, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
                onPress={() => { setShowModal(false); setNewName(''); }}
              >
                <Text style={[s.modalBtnText, { color: colors.text }]}>Ghairi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleCreate}
              >
                <Text style={[s.modalBtnText, { color: '#000' }]}>Unda</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Gate>
  );
}

const s = StyleSheet.create({
  addBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  card:   { padding: 14, gap: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardName:   { fontFamily: 'Inter_800ExtraBold', fontSize: 14 },
  cardSub:    { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 2 },
  cardActions:{ flexDirection: 'row', gap: 4 },
  iconBtn:    { padding: 6 },
  metricRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  metricLabel:{ fontFamily: 'Inter_600SemiBold', fontSize: 10, width: 44 },
  metricValue:{ fontFamily: 'Inter_800ExtraBold', fontSize: 11, width: 80, textAlign: 'right' },
  fallbackTitle: { fontFamily: 'Inter_800ExtraBold', fontSize: 16, marginTop: 12 },
  fallbackBody:  { fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 6, textAlign: 'center' },
  overlay: { flex: 1, backgroundColor: '#00000099', justifyContent: 'center', alignItems: 'center' },
  modal:   { width: 320, padding: 20, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, gap: 14 },
  modalTitle: { fontFamily: 'Inter_800ExtraBold', fontSize: 16 },
  input:      { borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, padding: 10, fontFamily: 'Inter_500Medium', fontSize: 13 },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  modalBtnText: { fontFamily: 'Inter_800ExtraBold', fontSize: 13 },
});
