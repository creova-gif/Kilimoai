/**
 * Livestock Tracking — full health records, vaccination schedule, add/update/delete
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import {
  Beef, Bird, Plus, Syringe, Trash2, CheckCircle2, AlertTriangle,
  HeartPulse, ChevronDown, ChevronUp, X,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { motion, AnimatePresence } from 'motion/react';
import PageScaffold, { GlassCard, SectionHeader, EmptyState } from '../components/PageScaffold';
import { useTheme } from '../constants/Theme';
import { useFarmDataStore, LivestockAnimal, LivestockSpecies } from '../store/useFarmDataStore';
import { Gate } from '../lib/access';

// ─── Species config ───────────────────────────────────────────────────────────
const SPECIES: { key: LivestockSpecies; label: string; swahili: string; color: string }[] = [
  { key: 'cattle', label: 'Cattle', swahili: 'Ng\'ombe', color: '#10b981' },
  { key: 'goat',   label: 'Goat',   swahili: 'Mbuzi',    color: '#f59e0b' },
  { key: 'sheep',  label: 'Sheep',  swahili: 'Kondoo',   color: '#8b5cf6' },
  { key: 'poultry',label: 'Poultry',swahili: 'Kuku',     color: '#3b82f6' },
  { key: 'pig',    label: 'Pig',    swahili: 'Nguruwe',  color: '#ec4899' },
];

const HEALTH: { key: LivestockAnimal['healthStatus']; label: string; color: string; icon: any }[] = [
  { key: 'healthy',   label: 'Mzima',     color: '#10b981', icon: CheckCircle2 },
  { key: 'attention', label: 'Tahadhari', color: '#f59e0b', icon: AlertTriangle },
  { key: 'sick',      label: 'Mgonjwa',   color: '#ef4444', icon: HeartPulse },
];

function speciesColor(s: LivestockSpecies) {
  return SPECIES.find((x) => x.key === s)?.color ?? '#94a3b8';
}
function SpeciesIcon({ species, size, color }: { species: LivestockSpecies; size: number; color: string }) {
  if (species === 'poultry') return <Bird size={size} color={color} />;
  return <Beef size={size} color={color} />;
}

function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400_000);
}

// ─── Add modal ────────────────────────────────────────────────────────────────
function AddAnimalModal({ visible, onClose, onSave }: {
  visible: boolean;
  onClose: () => void;
  onSave: (a: Omit<LivestockAnimal, 'id'>) => void;
}) {
  const { colors, isDark } = useTheme();
  const [species, setSpecies] = useState<LivestockSpecies>('cattle');
  const [name, setName] = useState('');
  const [tag, setTag] = useState(() => `TZ-${Math.floor(Math.random() * 9000 + 1000)}`);
  const [weight, setWeight] = useState('');
  const [health, setHealth] = useState<LivestockAnimal['healthStatus']>('healthy');

  function handleSave() {
    if (!tag.trim()) {
      Alert.alert('Tagi inahitajika', 'Tafadhali weka namba ya tagi ya mnyama.');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave({
      tag: tag.trim(),
      species,
      name: name.trim() || undefined,
      weightKg: parseFloat(weight) || undefined,
      healthStatus: health,
      nextVaccineDue: new Date(Date.now() + 90 * 86400_000).toISOString(),
    });
    setName(''); setWeight(''); setHealth('healthy');
    setTag(`TZ-${Math.floor(Math.random() * 9000 + 1000)}`);
    onClose();
  }

  const sc = SPECIES.find((x) => x.key === species)!;

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={[m.sheet, { backgroundColor: isDark ? '#1a1a2e' : '#fff' }]}>
          {/* Handle */}
          <View style={[m.handle, { backgroundColor: colors.border }]} />
          <View style={m.sheetHeader}>
            <Text style={[m.sheetTitle, { color: colors.text }]}>Sajili Mnyama Mpya</Text>
            <TouchableOpacity onPress={onClose} style={[m.closeBtn, { backgroundColor: colors.card }]}>
              <X size={16} color={colors.textMute} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Species */}
            <Text style={[m.label, { color: colors.textMute }]}>AINA YA MNYAMA</Text>
            <View style={m.speciesRow}>
              {SPECIES.map((sp) => (
                <TouchableOpacity
                  key={sp.key}
                  onPress={() => { Haptics.selectionAsync(); setSpecies(sp.key); }}
                  style={[m.speciesPill, {
                    borderColor: species === sp.key ? sp.color : colors.border,
                    backgroundColor: species === sp.key ? sp.color + '20' : 'transparent',
                  }]}
                >
                  <SpeciesIcon species={sp.key} size={16} color={species === sp.key ? sp.color : colors.textMute} />
                  <Text style={[m.speciesText, { color: species === sp.key ? sp.color : colors.textMute }]}>{sp.swahili}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tag */}
            <Text style={[m.label, { color: colors.textMute }]}>NAMBA YA TAGI *</Text>
            <View style={[m.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput value={tag} onChangeText={setTag} style={[m.input, { color: colors.text }]}
                placeholderTextColor={colors.textMute} placeholder="e.g. TZ-1234" />
            </View>

            {/* Name */}
            <Text style={[m.label, { color: colors.textMute }]}>JINA (HIARI)</Text>
            <View style={[m.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput value={name} onChangeText={setName} style={[m.input, { color: colors.text }]}
                placeholderTextColor={colors.textMute} placeholder="e.g. Sita, Bahati..." />
            </View>

            {/* Weight */}
            <Text style={[m.label, { color: colors.textMute }]}>UZITO (kg, HIARI)</Text>
            <View style={[m.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput value={weight} onChangeText={setWeight} keyboardType="decimal-pad"
                style={[m.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder="e.g. 320" />
            </View>

            {/* Health */}
            <Text style={[m.label, { color: colors.textMute }]}>HALI YA AFYA</Text>
            <View style={m.healthRow}>
              {HEALTH.map((h) => {
                const Icon = h.icon;
                return (
                  <TouchableOpacity
                    key={h.key}
                    onPress={() => { Haptics.selectionAsync(); setHealth(h.key); }}
                    style={[m.healthPill, {
                      borderColor: health === h.key ? h.color : colors.border,
                      backgroundColor: health === h.key ? h.color + '20' : 'transparent',
                      flex: 1,
                    }]}
                  >
                    <Icon size={14} color={health === h.key ? h.color : colors.textMute} />
                    <Text style={[m.healthText, { color: health === h.key ? h.color : colors.textMute }]}>{h.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity onPress={handleSave} style={[m.saveBtn, { backgroundColor: sc.color }]}>
              <Plus size={18} color="#fff" />
              <Text style={m.saveBtnText}>Sajili {sc.swahili}</Text>
            </TouchableOpacity>
            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Animal card ──────────────────────────────────────────────────────────────
function AnimalCard({ a, idx, onUpdateHealth, onDelete }: {
  a: LivestockAnimal;
  idx: number;
  onUpdateHealth: (id: string, next: LivestockAnimal['healthStatus']) => void;
  onDelete: (id: string) => void;
}) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const sc = speciesColor(a.species);
  const healthMeta = HEALTH.find((h) => h.key === a.healthStatus)!;
  const HealthIcon = healthMeta.icon;

  const vacDays = a.nextVaccineDue ? daysUntil(a.nextVaccineDue) : null;
  const vacColor = vacDays !== null ? (vacDays < 0 ? '#ef4444' : vacDays < 14 ? '#f59e0b' : '#10b981') : colors.textMute;

  function cycleHealth() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const idx = HEALTH.findIndex((h) => h.key === a.healthStatus);
    const next = HEALTH[(idx + 1) % HEALTH.length].key;
    onUpdateHealth(a.id, next);
  }

  function confirmDelete() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert('Futa Mnyama', `Futa ${a.tag}${a.name ? ` (${a.name})` : ''}?`, [
      { text: 'Ghairi', style: 'cancel' },
      { text: 'Futa', style: 'destructive', onPress: () => onDelete(a.id) },
    ]);
  }

  return (
    <motion.View
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 18, delay: idx * 0.06 }}
    >
      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        {/* Color bar */}
        <View style={[ac.colorBar, { backgroundColor: sc }]} />
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[ac.iconBg, { backgroundColor: sc + '18' }]}>
              <SpeciesIcon species={a.species} size={22} color={sc} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[ac.tag, { color: colors.text }]}>{a.tag}</Text>
                {a.name && <Text style={[ac.name, { color: sc }]}>· {a.name}</Text>}
              </View>
              <Text style={[ac.species, { color: colors.textMute }]}>
                {SPECIES.find((x) => x.key === a.species)?.swahili.toUpperCase()} {a.weightKg ? `· ${a.weightKg} kg` : ''}
              </Text>
            </View>
            <TouchableOpacity onPress={cycleHealth} style={[ac.healthBadge, { backgroundColor: healthMeta.color + '20' }]}>
              <HealthIcon size={11} color={healthMeta.color} />
              <Text style={[ac.healthText, { color: healthMeta.color }]}>{healthMeta.label}</Text>
            </TouchableOpacity>
          </View>

          {/* Vaccine row */}
          {a.nextVaccineDue && (
            <View style={[ac.vacRow, { borderTopColor: colors.border }]}>
              <Syringe size={12} color={vacColor} />
              <Text style={[ac.vacText, { color: vacColor }]}>
                {vacDays! < 0
                  ? `Chanjo imechelewa — siku ${Math.abs(vacDays!)} zilipita`
                  : vacDays === 0 ? 'Chanjo leo!'
                  : `Chanjo katika siku ${vacDays}`}
              </Text>
              <TouchableOpacity onPress={() => { setExpanded(!expanded); Haptics.selectionAsync(); }} style={ac.expandBtn}>
                {expanded ? <ChevronUp size={14} color={colors.textMute} /> : <ChevronDown size={14} color={colors.textMute} />}
              </TouchableOpacity>
            </View>
          )}

          {/* Expanded details */}
          {expanded && (
            <View style={[ac.expandedBox, { borderTopColor: colors.border, backgroundColor: colors.card }]}>
              {a.birthDate && <Detail label="Tarehe ya kuzaliwa" value={new Date(a.birthDate).toLocaleDateString('en-GB')} />}
              {a.lastVaccineDate && <Detail label="Chanjo ya mwisho" value={new Date(a.lastVaccineDate).toLocaleDateString('en-GB')} />}
              {a.notes && <Detail label="Maelezo" value={a.notes} />}
              <TouchableOpacity onPress={confirmDelete} style={[ac.deleteBtn, { borderColor: '#ef444440' }]}>
                <Trash2 size={13} color="#ef4444" />
                <Text style={ac.deleteText}>Futa mnyama huyu</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </GlassCard>
    </motion.View>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
      <Text style={{ color: colors.textMute, fontSize: 11, fontFamily: 'Inter_600SemiBold' }}>{label}</Text>
      <Text style={{ color: colors.text, fontSize: 11, fontFamily: 'Inter_700Bold' }}>{value}</Text>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function LivestockScreen() {
  const { colors } = useTheme();
  const animals = useFarmDataStore((s) => s.livestock);
  const addAnimal = useFarmDataStore((s) => s.addAnimal);
  const updateAnimal = useFarmDataStore((s) => s.updateAnimal);
  const removeAnimal = useFarmDataStore((s) => s.removeAnimal);
  const [showModal, setShowModal] = useState(false);

  const healthy = animals.filter((a) => a.healthStatus === 'healthy').length;
  const attention = animals.filter((a) => a.healthStatus === 'attention').length;
  const sick = animals.filter((a) => a.healthStatus === 'sick').length;
  const dueSoon = animals.filter((a) => a.nextVaccineDue && daysUntil(a.nextVaccineDue) < 14);

  return (
    <Gate feature="livestock" fallback={<PageScaffold title="Mifugo" badge="LIVESTOCK"><AccessDenied /></PageScaffold>}>
      <AddAnimalModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={(a) => addAnimal(a)}
      />
      <PageScaffold
        title="Mifugo"
        subtitle={`${animals.length} wanyama`}
        badge="LIVESTOCK"
        headerRight={
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowModal(true); }}
            style={[s.addBtn, { backgroundColor: colors.primary }]}>
            <Plus size={20} color="#000" />
          </TouchableOpacity>
        }
      >
        {/* Summary ribbon */}
        {animals.length > 0 && (
          <View style={{ paddingHorizontal: 24 }}>
            <motion.View initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <GlassCard style={s.summaryCard}>
                <SummaryPill count={healthy}   label="Wazima"     color="#10b981" />
                <SummaryPill count={attention} label="Tahadhari"  color="#f59e0b" />
                <SummaryPill count={sick}      label="Wagonjwa"   color="#ef4444" />
                {dueSoon.length > 0 && <SummaryPill count={dueSoon.length} label="Chanjo Hivi Karibuni" color="#3b82f6" />}
              </GlassCard>
            </motion.View>
          </View>
        )}

        {/* Vaccine alert */}
        {dueSoon.length > 0 && (
          <View style={{ paddingHorizontal: 24, marginTop: 12 }}>
            <GlassCard style={[s.alertCard, { borderColor: '#f59e0b50' }]}>
              <Syringe size={18} color="#f59e0b" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[s.alertTitle, { color: colors.text }]}>Chanjo Zinakaribia</Text>
                <Text style={[s.alertBody, { color: colors.textMute }]}>
                  {dueSoon.map((a) => a.tag).join(', ')} — ndani ya siku 14
                </Text>
              </View>
            </GlassCard>
          </View>
        )}

        <SectionHeader title={`Kundi · ${animals.length} wanyama`} />
        {animals.length === 0 ? (
          <EmptyState
            icon={<Beef size={40} color={colors.primary} />}
            title="Hakuna wanyama bado"
            body="Anza kufuatilia afya, ukuaji na chanjo za mifugo yako."
            cta="Sajili Mnyama wa Kwanza"
            onCta={() => setShowModal(true)}
          />
        ) : (
          <View style={{ paddingHorizontal: 24, gap: 10 }}>
            {animals.map((a, idx) => (
              <AnimalCard
                key={a.id}
                a={a}
                idx={idx}
                onUpdateHealth={(id, next) => updateAnimal(id, { healthStatus: next })}
                onDelete={removeAnimal}
              />
            ))}
          </View>
        )}
      </PageScaffold>
    </Gate>
  );
}

function SummaryPill({ count, label, color }: { count: number; label: string; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={[s.pillCount, { color }]}>{count}</Text>
      <Text style={[s.pillLabel, { color: colors.textMute }]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function AccessDenied() {
  const { colors } = useTheme();
  return (
    <EmptyState
      icon={<AlertTriangle size={36} color="#f59e0b" />}
      title="Haipatikani"
      body="Kipengele cha mifugo hakipatikani kwa jukumu lako."
    />
  );
}

const s = StyleSheet.create({
  addBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  summaryCard: { flexDirection: 'row', padding: 16 },
  pillCount: { fontSize: 22, fontFamily: 'Inter_900Black', letterSpacing: -0.5 },
  pillLabel: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.5, marginTop: 2, textAlign: 'center' },
  alertCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderWidth: 1 },
  alertTitle: { fontSize: 13, fontFamily: 'Inter_800ExtraBold' },
  alertBody: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 2 },
});

const ac = StyleSheet.create({
  colorBar: { height: 3, width: '100%' },
  iconBg: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  tag: { fontSize: 15, fontFamily: 'Inter_900Black', letterSpacing: 0.3 },
  name: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  species: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1, marginTop: 2 },
  healthBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10 },
  healthText: { fontSize: 10, fontFamily: 'Inter_900Black', letterSpacing: 0.5 },
  vacRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 10, borderTopWidth: 1 },
  vacText: { fontSize: 11, fontFamily: 'Inter_700Bold', flex: 1 },
  expandBtn: { padding: 2 },
  expandedBox: { marginTop: 10, padding: 12, borderRadius: 12, borderTopWidth: 1 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, alignSelf: 'flex-start' },
  deleteText: { fontSize: 11, fontFamily: 'Inter_800ExtraBold', color: '#ef4444' },
});

const m = StyleSheet.create({
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 32, maxHeight: '92%' },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  sheetTitle: { fontSize: 18, fontFamily: 'Inter_900Black' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.5, marginTop: 16, marginBottom: 8 },
  speciesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  speciesPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12, borderWidth: 1.5 },
  speciesText: { fontSize: 12, fontFamily: 'Inter_800ExtraBold' },
  inputWrap: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 4 },
  input: { fontSize: 15, fontFamily: 'Inter_600SemiBold', paddingVertical: 10 },
  healthRow: { flexDirection: 'row', gap: 8 },
  healthPill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5 },
  healthText: { fontSize: 11, fontFamily: 'Inter_800ExtraBold' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, paddingVertical: 16, borderRadius: 16 },
  saveBtnText: { color: '#fff', fontSize: 15, fontFamily: 'Inter_900Black', letterSpacing: 0.3 },
});
