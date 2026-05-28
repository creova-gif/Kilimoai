/**
 * Daftari la Fedha — Financial Tracker
 * Income/expense ledger with monthly P&L, category breakdown, and CSV/PDF export
 */
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Alert, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft, TrendingUp, TrendingDown, Plus, ArrowUpRight,
  ArrowDownLeft, Filter, FileText, Tag, ChevronRight,
  Wheat, Truck, Package, Droplets, Zap,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/Theme';
import { useKilimoStore } from '../store/useKilimoStore';
import Svg, { Line as SvgLine, Text as SvgText, Rect as SvgRect, Defs as SvgDefs, LinearGradient as SvgGrad, Stop as SvgStop } from 'react-native-svg';

const { width: SW } = Dimensions.get('window');

type EntryType = 'income' | 'expense';
type Category = 'mazao' | 'mbolea' | 'usafirishaji' | 'umwagiliaji' | 'zana' | 'nyingine';

type Entry = {
  id: string;
  type: EntryType;
  category: Category;
  label: string;
  amount: number;
  ts: number;
};

const INITIAL_ENTRIES: Entry[] = [
  { id: 'e1',  type: 'income',  category: 'mazao',        label: 'Uza Mahindi — Kg 200',       amount: 84000,  ts: Date.now() - 86400000  },
  { id: 'e2',  type: 'expense', category: 'mbolea',       label: 'Urea 50kg — Yara',           amount: 42500,  ts: Date.now() - 172800000 },
  { id: 'e3',  type: 'income',  category: 'mazao',        label: 'Maharage — Sehemu 1',        amount: 62000,  ts: Date.now() - 259200000 },
  { id: 'e4',  type: 'expense', category: 'usafirishaji', label: 'Lori — Dodoma–Mbeya',        amount: 18000,  ts: Date.now() - 345600000 },
  { id: 'e5',  type: 'expense', category: 'umwagiliaji',  label: 'Bomba Jipya — m 30',         amount: 9500,   ts: Date.now() - 432000000 },
  { id: 'e6',  type: 'income',  category: 'mazao',        label: 'Alizeti — Kg 80',            amount: 168000, ts: Date.now() - 518400000 },
  { id: 'e7',  type: 'expense', category: 'zana',         label: 'Jembe la trekta — serikali', amount: 35000,  ts: Date.now() - 604800000 },
  { id: 'e8',  type: 'income',  category: 'mazao',        label: 'Mbegu — Mauzo Ya Ziada',     amount: 21000,  ts: Date.now() - 691200000 },
];

const CAT_META: Record<Category, { icon: (c: string) => React.ReactNode; color: string; label: string; labelEn: string }> = {
  mazao:        { icon: c => <Wheat size={14} color={c} />,       color: '#22d15a', label: 'Mazao',        labelEn: 'Crops'     },
  mbolea:       { icon: c => <Package size={14} color={c} />,     color: '#f59e0b', label: 'Mbolea',       labelEn: 'Inputs'    },
  usafirishaji: { icon: c => <Truck size={14} color={c} />,       color: '#3b82f6', label: 'Usafirishaji', labelEn: 'Transport' },
  umwagiliaji:  { icon: c => <Droplets size={14} color={c} />,    color: '#06b6d4', label: 'Umwagiliaji',  labelEn: 'Irrigation'},
  zana:         { icon: c => <Zap size={14} color={c} />,         color: '#8b5cf6', label: 'Zana',         labelEn: 'Tools'     },
  nyingine:     { icon: c => <Tag size={14} color={c} />,         color: '#94a3b8', label: 'Nyingine',     labelEn: 'Other'     },
};

function fmtTZS(n: number) {
  return `TSh ${new Intl.NumberFormat('en-US').format(Math.round(n))}`;
}
function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString('sw-TZ', { month: 'short', day: 'numeric' });
}

function MonthlyChart({ months, colors }: { months: { label: string; income: number; expense: number }[]; colors: any }) {
  const CW = Dimensions.get('window').width - 64;
  const H = 110; const PAD_LEFT = 42; const PAD_BOT = 24; const PAD_TOP = 8;
  const chartW = CW - PAD_LEFT - 8;
  const chartH = H - PAD_BOT - PAD_TOP;
  const maxVal = Math.max(...months.flatMap(m => [m.income, m.expense]), 1);
  const toY = (v: number) => PAD_TOP + chartH - (v / maxVal) * chartH;
  const barW = Math.max(6, (chartW / months.length - 6) / 2);
  const colW = chartW / months.length;
  const gridVals = [0.25, 0.5, 0.75, 1.0];

  const fmtK = (v: number) => v >= 1000 ? `${Math.round(v / 1000)}k` : `${Math.round(v)}`;

  return (
    <View>
      {/* Legend */}
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 8, paddingHorizontal: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: '#22d15a' }} />
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 10, color: colors.textMute }}>Mapato</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: '#ef4444' }} />
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 10, color: colors.textMute }}>Matumizi</Text>
        </View>
      </View>
      <Svg width={CW} height={H}>
        <SvgDefs>
          <SvgGrad id="incGrad" x1="0" y1="0" x2="0" y2="1">
            <SvgStop offset="0%" stopColor="#22d15a" stopOpacity="1" />
            <SvgStop offset="100%" stopColor="#16a34a" stopOpacity="0.9" />
          </SvgGrad>
          <SvgGrad id="expGrad" x1="0" y1="0" x2="0" y2="1">
            <SvgStop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
            <SvgStop offset="100%" stopColor="#dc2626" stopOpacity="0.7" />
          </SvgGrad>
        </SvgDefs>

        {/* Gridlines + y-axis labels */}
        {gridVals.map(pct => {
          const gy = toY(maxVal * pct);
          return (
            <SvgLine key={pct} x1={PAD_LEFT} y1={gy} x2={CW - 8} y2={gy}
              stroke={colors.border} strokeWidth="0.8" strokeDasharray="3,3" />
          );
        })}
        {gridVals.map(pct => (
          <SvgText key={pct} x={PAD_LEFT - 4} y={toY(maxVal * pct) + 3.5}
            fontSize="8" fontFamily="Inter_600SemiBold" fill={colors.textMute} textAnchor="end">
            {fmtK(maxVal * pct)}
          </SvgText>
        ))}

        {/* Y-axis line */}
        <SvgLine x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={PAD_TOP + chartH}
          stroke={colors.border} strokeWidth="1" />

        {/* Bars */}
        {months.map((m, i) => {
          const cx = PAD_LEFT + i * colW + colW / 2;
          const incH = Math.max(2, (m.income / maxVal) * chartH);
          const expH = Math.max(2, (m.expense / maxVal) * chartH);
          const isLast = i === months.length - 1;
          return (
            <React.Fragment key={m.label}>
              <SvgRect
                x={cx - barW - 1} y={toY(m.income)} width={barW} height={incH}
                rx="3" fill={isLast ? 'url(#incGrad)' : '#22d15a'} opacity={isLast ? 1 : 0.45} />
              <SvgRect
                x={cx + 1} y={toY(m.expense)} width={barW} height={expH}
                rx="3" fill={isLast ? 'url(#expGrad)' : '#ef4444'} opacity={isLast ? 0.85 : 0.3} />
              {/* X-axis month label */}
              <SvgText x={cx} y={H - 4} fontSize="8" fontFamily="Inter_600SemiBold"
                fill={isLast ? colors.text : colors.textMute} textAnchor="middle">
                {m.label}
              </SvgText>
              {/* Value on top of last bar */}
              {isLast && (
                <SvgText x={cx - barW / 2 - 1} y={toY(m.income) - 3} fontSize="7"
                  fontFamily="Inter_700Bold" fill="#22d15a" textAnchor="middle">
                  {fmtK(m.income)}
                </SvgText>
              )}
            </React.Fragment>
          );
        })}

        {/* X-axis base line */}
        <SvgLine x1={PAD_LEFT} y1={PAD_TOP + chartH} x2={CW - 8} y2={PAD_TOP + chartH}
          stroke={colors.border} strokeWidth="1" />
      </Svg>
    </View>
  );
}

export default function FinanceScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const language = useKilimoStore((s) => s.language);
  const [entries, setEntries] = useState<Entry[]>(INITIAL_ENTRIES);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<EntryType>('income');
  const [newCat, setNewCat] = useState<Category>('mazao');

  const totalIncome  = useMemo(() => entries.filter(e => e.type === 'income').reduce((a, b) => a + b.amount, 0), [entries]);
  const totalExpense = useMemo(() => entries.filter(e => e.type === 'expense').reduce((a, b) => a + b.amount, 0), [entries]);
  const profit = totalIncome - totalExpense;

  const filtered = useMemo(() =>
    filter === 'all' ? entries : entries.filter(e => e.type === filter),
    [entries, filter]);

  const catTotals = useMemo(() => {
    const map: Partial<Record<Category, number>> = {};
    entries.forEach(e => { map[e.category] = (map[e.category] ?? 0) + (e.type === 'income' ? e.amount : -e.amount); });
    return Object.entries(map).sort((a, b) => Math.abs(b[1]!) - Math.abs(a[1]!)).slice(0, 4) as [Category, number][];
  }, [entries]);

  const months = useMemo(() => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    return labels.map((label, i) => ({
      label,
      income: 40000 + Math.sin(i * 1.3 + 0.5) * 20000 + (i === labels.length - 1 ? totalIncome * 0.1 : 0),
      expense: 20000 + Math.cos(i * 1.1) * 10000 + (i === labels.length - 1 ? totalExpense * 0.1 : 0),
    }));
  }, [totalIncome, totalExpense]);

  const handleAdd = () => {
    const amt = parseFloat(newAmount.replace(/,/g, ''));
    if (!newLabel || !amt || amt <= 0) {
      Alert.alert(language === 'sw' ? 'Tafadhali jaza fomu' : 'Please complete the form');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const entry: Entry = { id: Date.now().toString(), type: newType, category: newCat, label: newLabel, amount: amt, ts: Date.now() };
    setEntries(prev => [entry, ...prev]);
    setShowAdd(false);
    setNewLabel('');
    setNewAmount('');
  };

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={isDark ? ['#050e06', '#070f08', colors.background] : ['#f0fdf4', '#f8fafc', colors.background]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.3, 1]}
      />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={[s.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ChevronLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[s.title, { color: colors.text }]}>{language === 'sw' ? 'Daftari la Fedha' : 'Finance Tracker'}</Text>
            <Text style={[s.sub, { color: colors.textMute }]}>{entries.length} {language === 'sw' ? 'rekodi' : 'records'}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/agro-id' as any)} style={[s.exportBtn, { backgroundColor: colors.primary + '18', borderColor: colors.primary + '44' }]}>
            <FileText size={14} color={colors.primary} />
            <Text style={[s.exportTxt, { color: colors.primary }]}>PDF</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {/* P&L Summary */}
          <Animated.View entering={FadeInUp.springify()} style={{ paddingHorizontal: 16 }}>
            <LinearGradient
              colors={isDark ? ['#0d1f0e', '#080f09'] : ['#f0fdf4', '#e8f9ed']}
              style={[s.plCard, { borderColor: isDark ? '#22d15a22' : '#22d15a33' }]}
            >
              <View style={s.plRow}>
                <View style={s.plItem}>
                  <Text style={[s.plLabel, { color: colors.textMute }]}>{language === 'sw' ? 'MAPATO' : 'INCOME'}</Text>
                  <Text style={[s.plValue, { color: '#22d15a' }]}>{fmtTZS(totalIncome)}</Text>
                </View>
                <View style={[s.plDivider, { backgroundColor: colors.border }]} />
                <View style={s.plItem}>
                  <Text style={[s.plLabel, { color: colors.textMute }]}>{language === 'sw' ? 'MATUMIZI' : 'EXPENSES'}</Text>
                  <Text style={[s.plValue, { color: '#ef4444' }]}>{fmtTZS(totalExpense)}</Text>
                </View>
                <View style={[s.plDivider, { backgroundColor: colors.border }]} />
                <View style={s.plItem}>
                  <Text style={[s.plLabel, { color: colors.textMute }]}>{language === 'sw' ? 'FAIDA' : 'PROFIT'}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    {profit >= 0 ? <TrendingUp size={14} color="#22d15a" /> : <TrendingDown size={14} color="#ef4444" />}
                    <Text style={[s.plValue, { color: profit >= 0 ? '#22d15a' : '#ef4444' }]}>{fmtTZS(Math.abs(profit))}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Monthly chart */}
          <Animated.View entering={FadeInDown.delay(80).springify()} style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <View style={[s.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={s.chartHeader}>
                <Text style={[s.chartTitle, { color: colors.text }]}>{language === 'sw' ? 'Muhtasari wa Miezi 6' : '6-Month Overview'}</Text>
                <View style={s.legendRow}>
                  <View style={[s.legendDot, { backgroundColor: '#22d15a' }]} /><Text style={[s.legendTxt, { color: colors.textMute }]}>{language === 'sw' ? 'Mapato' : 'Income'}</Text>
                  <View style={[s.legendDot, { backgroundColor: '#ef4444' }]} /><Text style={[s.legendTxt, { color: colors.textMute }]}>{language === 'sw' ? 'Matumizi' : 'Expenses'}</Text>
                </View>
              </View>
              <MonthlyChart months={months} colors={colors} />
            </View>
          </Animated.View>

          {/* Category breakdown */}
          <Animated.View entering={FadeInDown.delay(120).springify()} style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <View style={[s.catCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[s.chartTitle, { color: colors.text }]}>{language === 'sw' ? 'Mgawanyo wa Gharama' : 'Breakdown by Category'}</Text>
              <View style={{ gap: 10, marginTop: 10 }}>
                {catTotals.map(([cat, val]) => {
                  const meta = CAT_META[cat];
                  const pct = Math.min(1, Math.abs(val) / Math.max(totalIncome, totalExpense, 1));
                  return (
                    <View key={cat} style={s.catRow}>
                      <View style={[s.catIcon, { backgroundColor: meta.color + '18' }]}>
                        {meta.icon(meta.color)}
                      </View>
                      <View style={{ flex: 1, gap: 4 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={[s.catLabel, { color: colors.text }]}>{language === 'sw' ? meta.label : meta.labelEn}</Text>
                          <Text style={[s.catVal, { color: val >= 0 ? '#22d15a' : '#ef4444' }]}>
                            {val >= 0 ? '+' : ''}{fmtTZS(Math.abs(val))}
                          </Text>
                        </View>
                        <View style={[s.catTrack, { backgroundColor: colors.background }]}>
                          <View style={[s.catFill, { width: `${pct * 100}%`, backgroundColor: val >= 0 ? '#22d15a' : '#ef4444' }]} />
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </Animated.View>

          {/* Filter tabs */}
          <View style={s.filterRow}>
            {(['all', 'income', 'expense'] as const).map(f => (
              <TouchableOpacity key={f} onPress={() => { Haptics.selectionAsync(); setFilter(f); }}
                style={[s.filterTab, {
                  backgroundColor: filter === f ? (f === 'income' ? '#22d15a' : f === 'expense' ? '#ef4444' : colors.primary) : colors.card,
                  borderColor: filter === f ? 'transparent' : colors.border,
                }]}>
                <Text style={[s.filterTxt, { color: filter === f ? '#fff' : colors.textMute }]}>
                  {f === 'all' ? (language === 'sw' ? 'Zote' : 'All') : f === 'income' ? (language === 'sw' ? 'Mapato' : 'Income') : (language === 'sw' ? 'Matumizi' : 'Expenses')}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => { Haptics.selectionAsync(); setShowAdd(v => !v); }}
              style={[s.addBtn, { backgroundColor: colors.primary }]}>
              <Plus size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Add entry form */}
          {showAdd && (
            <Animated.View entering={FadeInDown.springify()} style={{ paddingHorizontal: 16, marginBottom: 8 }}>
              <View style={[s.addForm, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[s.formTitle, { color: colors.text }]}>{language === 'sw' ? 'Ingiza Rekodi' : 'Add Entry'}</Text>
                <View style={s.typeRow}>
                  {(['income', 'expense'] as EntryType[]).map(t => (
                    <TouchableOpacity key={t} onPress={() => setNewType(t)}
                      style={[s.typeBtn, { backgroundColor: newType === t ? (t === 'income' ? '#22d15a' : '#ef4444') : colors.background, borderColor: colors.border }]}>
                      {t === 'income' ? <ArrowDownLeft size={14} color={newType === t ? '#fff' : colors.textMute} /> : <ArrowUpRight size={14} color={newType === t ? '#fff' : colors.textMute} />}
                      <Text style={[s.typeTxt, { color: newType === t ? '#fff' : colors.textMute }]}>
                        {t === 'income' ? (language === 'sw' ? 'Mapato' : 'Income') : (language === 'sw' ? 'Matumizi' : 'Expense')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput style={[s.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder={language === 'sw' ? 'Maelezo (e.g. Uza mahindi)' : 'Description (e.g. Sold maize)'}
                  placeholderTextColor={colors.textMute} value={newLabel} onChangeText={setNewLabel} />
                <TextInput style={[s.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  placeholder={language === 'sw' ? 'Kiasi (TZS)' : 'Amount (TZS)'}
                  placeholderTextColor={colors.textMute} keyboardType="numeric" value={newAmount} onChangeText={setNewAmount} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                  {(Object.keys(CAT_META) as Category[]).map(c => {
                    const meta = CAT_META[c];
                    return (
                      <TouchableOpacity key={c} onPress={() => setNewCat(c)}
                        style={[s.catChip, { backgroundColor: newCat === c ? meta.color : colors.background, borderColor: newCat === c ? meta.color : colors.border }]}>
                        {meta.icon(newCat === c ? '#fff' : meta.color)}
                        <Text style={[s.catChipTxt, { color: newCat === c ? '#fff' : colors.textMute }]}>{language === 'sw' ? meta.label : meta.labelEn}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                <TouchableOpacity onPress={handleAdd} style={[s.saveBtn, { backgroundColor: colors.primary }]}>
                  <Text style={s.saveTxt}>{language === 'sw' ? 'Hifadhi' : 'Save'}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Entries list */}
          <View style={{ paddingHorizontal: 16, gap: 8 }}>
            {filtered.map((e, i) => {
              const meta = CAT_META[e.category];
              return (
                <Animated.View key={e.id} entering={FadeInDown.delay(i * 40).springify()}>
                  <View style={[s.entryRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={[s.entryIcon, { backgroundColor: meta.color + '18' }]}>
                      {meta.icon(meta.color)}
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={[s.entryLabel, { color: colors.text }]} numberOfLines={1}>{e.label}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={[s.catBadge, { backgroundColor: meta.color + '18' }]}>
                          <Text style={[s.catBadgeTxt, { color: meta.color }]}>{language === 'sw' ? meta.label : meta.labelEn}</Text>
                        </View>
                        <Text style={[s.entryDate, { color: colors.textMute }]}>{fmtDate(e.ts)}</Text>
                      </View>
                    </View>
                    <Text style={[s.entryAmt, { color: e.type === 'income' ? '#22d15a' : '#ef4444' }]}>
                      {e.type === 'income' ? '+' : '-'}{fmtTZS(e.amount)}
                    </Text>
                  </View>
                </Animated.View>
              );
            })}
          </View>

          {/* Agro ID export link */}
          <Animated.View entering={FadeInDown.delay(200).springify()} style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <TouchableOpacity onPress={() => router.push('/agro-id' as any)}
              style={[s.exportLink, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <FileText size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[s.exportLinkTitle, { color: colors.text }]}>{language === 'sw' ? 'Toa Ripoti ya P&L' : 'Export P&L Report'}</Text>
                <Text style={[s.exportLinkSub, { color: colors.textMute }]}>{language === 'sw' ? 'PDF yenye nembo — kupitia Agro ID' : 'Branded PDF via your Agro ID'}</Text>
              </View>
              <ChevronRight size={16} color={colors.textMute} />
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root:           { flex: 1 },
  header:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  backBtn:        { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title:          { fontFamily: 'InstrumentSerif_400Regular', fontSize: 22, letterSpacing: -0.3 },
  sub:            { fontFamily: 'Inter_500Medium', fontSize: 12 },
  exportBtn:      { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  exportTxt:      { fontFamily: 'Inter_800ExtraBold', fontSize: 10 },
  plCard:         { borderRadius: 20, padding: 16, borderWidth: 1 },
  plRow:          { flexDirection: 'row', alignItems: 'center' },
  plItem:         { flex: 1, alignItems: 'center', gap: 4 },
  plLabel:        { fontFamily: 'Inter_800ExtraBold', fontSize: 9, letterSpacing: 0.6 },
  plValue:        { fontFamily: 'InstrumentSerif_400Regular', fontSize: 18 },
  plDivider:      { width: 1, height: 40, marginHorizontal: 4 },
  chartCard:      { padding: 16, borderRadius: 16, borderWidth: 1, gap: 4 },
  chartHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chartTitle:     { fontFamily: 'Inter_700Bold', fontSize: 14 },
  legendRow:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:      { width: 8, height: 8, borderRadius: 4 },
  legendTxt:      { fontFamily: 'Inter_500Medium', fontSize: 10 },
  catCard:        { padding: 16, borderRadius: 16, borderWidth: 1 },
  catRow:         { flexDirection: 'row', alignItems: 'center', gap: 10 },
  catIcon:        { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  catLabel:       { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  catVal:         { fontFamily: 'Inter_700Bold', fontSize: 12 },
  catTrack:       { height: 5, borderRadius: 3, overflow: 'hidden' },
  catFill:        { height: 5, borderRadius: 3 },
  filterRow:      { flexDirection: 'row', paddingHorizontal: 16, marginVertical: 12, gap: 8, alignItems: 'center' },
  filterTab:      { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  filterTxt:      { fontFamily: 'Inter_700Bold', fontSize: 12 },
  addBtn:         { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  addForm:        { padding: 16, borderRadius: 16, borderWidth: 1, gap: 12 },
  formTitle:      { fontFamily: 'Inter_700Bold', fontSize: 15 },
  typeRow:        { flexDirection: 'row', gap: 8 },
  typeBtn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 40, borderRadius: 10, borderWidth: 1 },
  typeTxt:        { fontFamily: 'Inter_700Bold', fontSize: 12 },
  input:          { height: 44, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, fontFamily: 'Inter_500Medium', fontSize: 13 },
  catChip:        { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  catChipTxt:     { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  saveBtn:        { height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  saveTxt:        { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#fff' },
  entryRow:       { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, borderWidth: 1, gap: 12 },
  entryIcon:      { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  entryLabel:     { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  entryDate:      { fontFamily: 'Inter_500Medium', fontSize: 10 },
  entryAmt:       { fontFamily: 'InstrumentSerif_400Regular', fontSize: 16, letterSpacing: -0.2 },
  catBadge:       { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  catBadgeTxt:    { fontFamily: 'Inter_700Bold', fontSize: 9 },
  exportLink:     { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, borderWidth: 1 },
  exportLinkTitle:{ fontFamily: 'Inter_700Bold', fontSize: 14 },
  exportLinkSub:  { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 2 },
});
