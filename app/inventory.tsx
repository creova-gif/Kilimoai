/**
 * Inventory Management — proper add modal, stock progress bars, delete, animated cards
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import {
  Package, AlertTriangle, Plus, Minus, Boxes, Sprout, Syringe,
  Wrench, Beef, Wheat, Trash2, X, ChevronDown, ChevronUp,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut, FadeInDown, FadeInUp } from 'react-native-reanimated';
import PageScaffold, { GlassCard, SectionHeader, EmptyState } from '../components/PageScaffold';
import { useTheme } from '../constants/Theme';
import { useFarmDataStore, InventoryItem, InventoryUnit } from '../store/useFarmDataStore';
import { Gate } from '../lib/access';

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORIES: { key: InventoryItem['category']; label: string; swahili: string; color: string; icon: any }[] = [
  { key: 'seed',       label: 'Seed',       swahili: 'Mbegu',     color: '#22d15a', icon: Wheat },
  { key: 'fertilizer', label: 'Fertilizer', swahili: 'Mbolea',    color: '#3b82f6', icon: Sprout },
  { key: 'pesticide',  label: 'Pesticide',  swahili: 'Dawa',      color: '#f59e0b', icon: Syringe },
  { key: 'feed',       label: 'Feed',       swahili: 'Chakula',   color: '#8b5cf6', icon: Beef },
  { key: 'tool',       label: 'Tool',       swahili: 'Zana',      color: '#64748b', icon: Wrench },
  { key: 'other',      label: 'Other',      swahili: 'Nyingine',  color: '#94a3b8', icon: Package },
];

const UNITS: { key: InventoryUnit; label: string }[] = [
  { key: 'kg', label: 'kg' },
  { key: 'L',  label: 'Lit' },
  { key: 'bag', label: 'Mfuko' },
  { key: 'piece', label: 'Kipande' },
  { key: 'pack', label: 'Pakiti' },
];

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

function catMeta(c: InventoryItem['category']) {
  return CATEGORIES.find((x) => x.key === c) ?? CATEGORIES[5];
}

// ─── Add modal ────────────────────────────────────────────────────────────────
function AddItemModal({ visible, onClose, onSave }: {
  visible: boolean;
  onClose: () => void;
  onSave: (i: Omit<InventoryItem, 'id'>) => void;
}) {
  const { colors, isDark } = useTheme();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('seed');
  const [unit, setUnit] = useState<InventoryUnit>('kg');
  const [qty, setQty] = useState('');
  const [cost, setCost] = useState('');
  const [lowAt, setLowAt] = useState('');
  const [supplier, setSupplier] = useState('');

  function handleSave() {
    if (!name.trim()) { Alert.alert('Jina linahitajika', 'Tafadhali weka jina la bidhaa.'); return; }
    const q = parseFloat(qty) || 0;
    if (q <= 0) { Alert.alert('Kiasi kinahitajika', 'Tafadhali weka kiasi cha sasa hivi.'); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave({
      name: name.trim(),
      category,
      unit,
      qty: q,
      lowStockAt: parseFloat(lowAt) || 0,
      costPerUnitTZS: parseFloat(cost) || undefined,
      supplier: supplier.trim() || undefined,
    });
    setName(''); setQty(''); setCost(''); setLowAt(''); setSupplier('');
    onClose();
  }

  const cm = catMeta(category);
  const CatIcon = cm.icon;

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={[m.sheet, { backgroundColor: isDark ? '#1a1a2e' : '#fff' }]}>
          <View style={[m.handle, { backgroundColor: colors.border }]} />
          <View style={m.sheetHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[m.catPreview, { backgroundColor: cm.color + '20' }]}>
                <CatIcon size={18} color={cm.color} />
              </View>
              <Text style={[m.sheetTitle, { color: colors.text }]}>Ongeza Bidhaa</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[m.closeBtn, { backgroundColor: colors.card }]}>
              <X size={16} color={colors.textMute} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Category */}
            <Text style={[m.label, { color: colors.textMute }]}>AINA</Text>
            <View style={m.catGrid}>
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const active = category === c.key;
                return (
                  <TouchableOpacity key={c.key} onPress={() => { Haptics.selectionAsync(); setCategory(c.key); }}
                    style={[m.catPill, { borderColor: active ? c.color : colors.border, backgroundColor: active ? c.color + '18' : 'transparent' }]}>
                    <Icon size={14} color={active ? c.color : colors.textMute} />
                    <Text style={[m.catText, { color: active ? c.color : colors.textMute }]}>{c.swahili}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Name */}
            <Text style={[m.label, { color: colors.textMute }]}>JINA LA BIDHAA *</Text>
            <View style={[m.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput value={name} onChangeText={setName} style={[m.input, { color: colors.text }]}
                placeholderTextColor={colors.textMute} placeholder="e.g. DAP Fertilizer, Maize Seed..." />
            </View>

            {/* Unit */}
            <Text style={[m.label, { color: colors.textMute }]}>KIPIMO</Text>
            <View style={m.unitRow}>
              {UNITS.map((u) => (
                <TouchableOpacity key={u.key} onPress={() => { Haptics.selectionAsync(); setUnit(u.key); }}
                  style={[m.unitPill, { borderColor: unit === u.key ? colors.primary : colors.border, backgroundColor: unit === u.key ? colors.primary + '18' : 'transparent' }]}>
                  <Text style={[m.unitText, { color: unit === u.key ? colors.primary : colors.textMute }]}>{u.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Qty + Low stock in a row */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[m.label, { color: colors.textMute }]}>KIASI SASA *</Text>
                <View style={[m.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  <TextInput value={qty} onChangeText={setQty} keyboardType="decimal-pad"
                    style={[m.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder="0" />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[m.label, { color: colors.textMute }]}>KIWANGO CHA CHINI</Text>
                <View style={[m.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  <TextInput value={lowAt} onChangeText={setLowAt} keyboardType="decimal-pad"
                    style={[m.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder="0" />
                </View>
              </View>
            </View>

            {/* Cost */}
            <Text style={[m.label, { color: colors.textMute }]}>GHARAMA KWA KIPIMO (TZS, HIARI)</Text>
            <View style={[m.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput value={cost} onChangeText={setCost} keyboardType="decimal-pad"
                style={[m.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder="e.g. 95000" />
            </View>

            {/* Supplier */}
            <Text style={[m.label, { color: colors.textMute }]}>MUUZAJI (HIARI)</Text>
            <View style={[m.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput value={supplier} onChangeText={setSupplier} style={[m.input, { color: colors.text }]}
                placeholderTextColor={colors.textMute} placeholder="e.g. YARA, East African Seed..." />
            </View>

            <TouchableOpacity onPress={handleSave} style={[m.saveBtn, { backgroundColor: cm.color }]}>
              <Plus size={18} color="#fff" />
              <Text style={m.saveBtnText}>Hifadhi Bidhaa</Text>
            </TouchableOpacity>
            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Item card ────────────────────────────────────────────────────────────────
function ItemCard({ item, idx, adjust, remove }: {
  item: InventoryItem;
  idx: number;
  adjust: (id: string, delta: number) => void;
  remove: (id: string) => void;
}) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const cm = catMeta(item.category);
  const Icon = cm.icon;
  const low = item.qty <= item.lowStockAt;

  // Stock progress: full = 2× low-stock threshold (or qty if no threshold set)
  const maxVal = Math.max(item.qty, item.lowStockAt * 2, 1);
  const progress = Math.min(item.qty / maxVal, 1);
  const progressColor = low ? '#ef4444' : item.qty <= item.lowStockAt * 1.5 ? '#f59e0b' : cm.color;

  const totalValue = item.qty * (item.costPerUnitTZS ?? 0);

  function confirmDelete() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert('Futa Bidhaa', `Futa "${item.name}" kutoka hifadhi?`, [
      { text: 'Ghairi', style: 'cancel' },
      { text: 'Futa', style: 'destructive', onPress: () => remove(item.id) },
    ]);
  }

  return (
    <Animated.View
      entering={FadeInDown}
    >
      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        {/* Left accent bar */}
        <View style={[ic.leftBar, { backgroundColor: cm.color }]} />
        <View style={{ padding: 16, paddingLeft: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[ic.catBg, { backgroundColor: cm.color + '18' }]}>
              <Icon size={20} color={cm.color} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[ic.itemName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                <View style={[ic.catBadge, { backgroundColor: cm.color + '15' }]}>
                  <Text style={[ic.catBadgeText, { color: cm.color }]}>{cm.swahili.toUpperCase()}</Text>
                </View>
                {item.supplier && (
                  <Text style={[ic.supplier, { color: colors.textMute }]}>{item.supplier}</Text>
                )}
              </View>
            </View>

            {/* Qty control */}
            <View style={ic.qtyControl}>
              <TouchableOpacity onPress={() => { Haptics.selectionAsync(); adjust(item.id, -1); }}
                style={[ic.qtyBtn, { borderColor: colors.border }]}>
                <Minus size={13} color={item.qty <= 0 ? colors.border : colors.text} />
              </TouchableOpacity>
              <Text style={[ic.qtyText, { color: low ? '#ef4444' : colors.text }]}>
                {item.qty}{item.unit}
              </Text>
              <TouchableOpacity onPress={() => { Haptics.selectionAsync(); adjust(item.id, 1); }}
                style={[ic.qtyBtn, { borderColor: colors.border }]}>
                <Plus size={13} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress bar */}
          <View style={[ic.progressTrack, { backgroundColor: colors.border }]}>
            <Animated.View
              style={[ic.progressFill, { backgroundColor: progressColor }]}
            />
          </View>

          {/* Low stock warning */}
          {low && (
            <View style={[ic.lowBar, { backgroundColor: '#ef444412', borderColor: '#ef444435' }]}>
              <AlertTriangle size={11} color="#ef4444" />
              <Text style={ic.lowText}>
                Stock chini ya kiwango — {item.lowStockAt}{item.unit} ni kiwango cha chini
              </Text>
            </View>
          )}

          {/* Expand toggle */}
          <TouchableOpacity onPress={() => { setExpanded(!expanded); Haptics.selectionAsync(); }}
            style={[ic.expandRow, { borderTopColor: colors.border }]}>
            <Text style={[ic.expandLabel, { color: colors.textMute }]}>
              {item.costPerUnitTZS ? `TZS ${fmt(item.costPerUnitTZS)}/${item.unit} · ` : ''}
              {item.costPerUnitTZS ? `Thamani: TZS ${fmt(totalValue)}` : 'Maelezo zaidi'}
            </Text>
            {expanded ? <ChevronUp size={13} color={colors.textMute} /> : <ChevronDown size={13} color={colors.textMute} />}
          </TouchableOpacity>

          {expanded && (
            <View style={[ic.expandBox, { borderTopColor: colors.border, backgroundColor: colors.card }]}>
              {item.costPerUnitTZS ? <Detail label="Gharama kwa kipimo" value={`TZS ${fmt(item.costPerUnitTZS)}`} /> : null}
              {item.costPerUnitTZS ? <Detail label="Thamani yote" value={`TZS ${fmt(totalValue)}`} /> : null}
              {item.expiresOn ? <Detail label="Tarehe ya mwisho" value={new Date(item.expiresOn).toLocaleDateString('en-GB')} /> : null}
              {item.supplier ? <Detail label="Muuzaji" value={item.supplier} /> : null}
              <TouchableOpacity onPress={confirmDelete} style={ic.deleteBtn}>
                <Trash2 size={13} color="#ef4444" />
                <Text style={ic.deleteText}>Futa bidhaa hii</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </GlassCard>
    </Animated.View>
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
export default function InventoryScreen() {
  const { colors } = useTheme();
  const items = useFarmDataStore((s) => s.inventory);
  const adjust = useFarmDataStore((s) => s.adjustItem);
  const addItem = useFarmDataStore((s) => s.addItem);
  const removeItem = useFarmDataStore((s) => s.removeItem);
  const [showModal, setShowModal] = useState(false);

  const lowStock = items.filter((i) => i.qty <= i.lowStockAt);
  const totalValue = items.reduce((sum, i) => sum + i.qty * (i.costPerUnitTZS ?? 0), 0);

  return (
    <Gate feature="inventory" fallback={<PageScaffold title="Pembejeo" badge="INVENTORY"><AccessDenied /></PageScaffold>}>
      <AddItemModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={(i) => addItem(i)}
      />
      <PageScaffold
        title="Pembejeo"
        subtitle={`${items.length} bidhaa · TZS ${fmt(totalValue)}`}
        badge="INVENTORY"
        headerRight={
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowModal(true); }}
            style={[s.addBtn, { backgroundColor: colors.primary }]}>
            <Plus size={20} color="#000" />
          </TouchableOpacity>
        }
      >
        {/* Summary ribbon */}
        {items.length > 0 && (
          <View style={{ paddingHorizontal: 24 }}>
            <Animated.View entering={FadeInDown}>
              <GlassCard style={s.summaryCard}>
                <SummaryCol label="Bidhaa Zote" value={String(items.length)} color={colors.primary} />
                <View style={[s.divider, { backgroundColor: colors.border }]} />
                <SummaryCol label="Stock Chini" value={String(lowStock.length)} color={lowStock.length > 0 ? '#ef4444' : '#22d15a'} />
                <View style={[s.divider, { backgroundColor: colors.border }]} />
                <SummaryCol label="Thamani Yote" value={`TZS ${fmt(totalValue)}`} color={colors.text} small />
              </GlassCard>
            </Animated.View>
          </View>
        )}

        {/* Low stock alert */}
        {lowStock.length > 0 && (
          <View style={{ paddingHorizontal: 24, marginTop: 12 }}>
            <GlassCard style={[s.alertCard, { borderColor: '#ef444445' }]}>
              <AlertTriangle size={18} color="#ef4444" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[s.alertTitle, { color: colors.text }]}>Bidhaa {lowStock.length} zina stock chini</Text>
                <Text style={[s.alertBody, { color: colors.textMute }]} numberOfLines={2}>
                  {lowStock.map((i) => `${i.name} (${i.qty}${i.unit})`).join(', ')}
                </Text>
              </View>
            </GlassCard>
          </View>
        )}

        <SectionHeader title={`Hifadhi · ${items.length} bidhaa`} />
        {items.length === 0 ? (
          <EmptyState
            icon={<Boxes size={40} color={colors.primary} />}
            title="Hakuna bidhaa bado"
            body="Anza kufuatilia mbegu, mbolea, dawa na zana zako zote."
            cta="Ongeza Bidhaa ya Kwanza"
            onCta={() => setShowModal(true)}
          />
        ) : (
          <View style={{ paddingHorizontal: 24, gap: 10 }}>
            {items.map((i, idx) => (
              <ItemCard key={i.id} item={i} idx={idx} adjust={adjust} remove={removeItem} />
            ))}
          </View>
        )}
      </PageScaffold>
    </Gate>
  );
}

function SummaryCol({ label, value, color, small }: { label: string; value: string; color: string; small?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={[small ? s.summaryValueSm : s.summaryValue, { color }]}>{value}</Text>
      <Text style={[s.summaryLabel, { color: colors.textMute }]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function AccessDenied() {
  return <EmptyState icon={<AlertTriangle size={36} color="#f59e0b" />} title="Haipatikani" body="Pembejeo haipatikani kwa jukumu lako." />;
}

const s = StyleSheet.create({
  addBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  summaryCard: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  summaryValue: { fontSize: 20, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.5 },
  summaryValueSm: { fontSize: 13, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.3 },
  summaryLabel: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.5, marginTop: 3, textAlign: 'center' },
  divider: { width: 1, height: 36, marginHorizontal: 4 },
  alertCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderWidth: 1 },
  alertTitle: { fontSize: 13, fontFamily: 'Inter_800ExtraBold' },
  alertBody: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 2 },
});

const ic = StyleSheet.create({
  leftBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },
  catBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  itemName: { fontSize: 14, fontFamily: 'Inter_800ExtraBold' },
  catBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  catBadgeText: { fontSize: 8, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: 0.8 },
  supplier: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 13, fontFamily: 'InstrumentSerif_400Regular', minWidth: 52, textAlign: 'center' },
  progressTrack: { height: 4, borderRadius: 2, marginTop: 12, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  lowBar: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8, padding: 8, borderRadius: 10, borderWidth: 1 },
  lowText: { color: '#ef4444', fontSize: 10, fontFamily: 'Inter_700Bold', flex: 1 },
  expandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1 },
  expandLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold', flex: 1 },
  expandBox: { marginTop: 10, padding: 12, borderRadius: 12, borderTopWidth: 1 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#ef444440', alignSelf: 'flex-start' },
  deleteText: { fontSize: 11, fontFamily: 'Inter_800ExtraBold', color: '#ef4444' },
});

const m = StyleSheet.create({
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 32, maxHeight: '92%' },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  sheetTitle: { fontSize: 18, fontFamily: 'InstrumentSerif_400Regular' },
  catPreview: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.5, marginTop: 16, marginBottom: 8 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12, borderWidth: 1.5 },
  catText: { fontSize: 11, fontFamily: 'Inter_800ExtraBold' },
  inputWrap: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 4 },
  input: { fontSize: 15, fontFamily: 'Inter_600SemiBold', paddingVertical: 10 },
  unitRow: { flexDirection: 'row', gap: 8 },
  unitPill: { flex: 1, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5, alignItems: 'center' },
  unitText: { fontSize: 12, fontFamily: 'Inter_800ExtraBold' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, paddingVertical: 16, borderRadius: 16 },
  saveBtnText: { color: '#fff', fontSize: 15, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: 0.3 },
});
