/**
 * Market & Intel — Creative Redesign v3 (Theme-aware)
 * Fully respects light / dark via useTheme() — no hardcoded dark values.
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput,
  Dimensions, SafeAreaView, Platform, StatusBar, RefreshControl, Modal,
  KeyboardAvoidingView, Alert,
} from 'react-native';
import Animated, {
  FadeInDown, FadeIn, useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, interpolate, Easing,
} from 'react-native-reanimated';
import {
  Globe, TrendingUp, TrendingDown, BarChart3, Activity, ArrowUpRight,
  Sparkles, Cpu, ShoppingBag, Leaf, Search, ChevronLeft, Bell,
  Filter, Layers, FileSignature, Plus, X, Check,
  Package, Tag, MapPin, Heart, Scale, MessageSquare, Flame,
  ChevronDown, ChevronUp, Eye,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import { RequireVerification } from '../../components/RequireVerification';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width: W } = Dimensions.get('window');
const CARD_PAD = 16;
const PRIMARY = '#22d15a';

// ─── Data ──────────────────────────────────────────────────────────────────────
const MARKET_DATA = [
  { id: '1', nameSw: 'Mahindi (Meupe)', nameEn: 'White Maize', price: 85_000, unitSw: 'Mfuko wa 100kg', unitEn: '100kg Bag', trend: '+2.4%', positive: true, market: 'Tandale Market', region: 'Dar es Salaam', emoji: '🌽', category: 'grains', volatilitySw: 'Chini', volatilityEn: 'Low', demandSw: 'Juu', demandEn: 'High', outlookSw: 'Kupanda', outlookEn: 'Bullish', priceNum: 85_000, spark: [40,44,42,49,53,51,59,63,61,66] },
  { id: '2', nameSw: 'Mchele (Daraja A)', nameEn: 'Rice (Grade A)', price: 120_000, unitSw: 'Mfuko wa 100kg', unitEn: '100kg Bag', trend: '-1.2%', positive: false, market: 'Mbagala Market', region: 'Dar es Salaam', emoji: '🌾', category: 'grains', volatilitySw: 'Kati', volatilityEn: 'Medium', demandSw: 'Imara', demandEn: 'Stable', outlookSw: 'Kawaida', outlookEn: 'Neutral', priceNum: 120_000, spark: [70,68,72,66,60,58,55,53,51,50] },
  { id: '3', nameSw: 'Maharage (Soya)', nameEn: 'Soya Beans', price: 210_000, unitSw: 'Mfuko wa 100kg', unitEn: '100kg Bag', trend: '+0.8%', positive: true, market: 'Kariakoo Market', region: 'Dar es Salaam', emoji: '🫘', category: 'grains', volatilitySw: 'Chini', volatilityEn: 'Low', demandSw: 'Juu', demandEn: 'High', outlookSw: 'Kupanda', outlookEn: 'Bullish', priceNum: 210_000, spark: [50,52,51,54,56,58,57,60,61,63] },
  { id: '4', nameSw: 'Vitunguu (Vyekundu)', nameEn: 'Red Onions', price: 45_000, unitSw: 'Net 20kg', unitEn: '20kg Net', trend: '+5.1%', positive: true, market: 'Tandale Market', region: 'Dar es Salaam', emoji: '🧅', category: 'veg', volatilitySw: 'Juu', volatilityEn: 'High', demandSw: 'Kubwa', demandEn: 'Surging', outlookSw: 'Kuyumba', outlookEn: 'Volatile', priceNum: 45_000, spark: [30,38,35,42,50,47,55,62,58,68] },
  { id: '5', nameSw: 'Nyanya (Beefsteak)', nameEn: 'Tomatoes', price: 38_000, unitSw: 'Tenga la 15kg', unitEn: '15kg Crate', trend: '+1.8%', positive: true, market: 'Kilombero Market', region: 'Morogoro', emoji: '🍅', category: 'veg', volatilitySw: 'Juu', volatilityEn: 'High', demandSw: 'Juu', demandEn: 'High', outlookSw: 'Kupanda', outlookEn: 'Bullish', priceNum: 38_000, spark: [35,40,38,43,45,48,47,52,54,56] },
  { id: '6', nameSw: 'Kahawa (AA)', nameEn: 'Coffee (AA)', price: 680_000, unitSw: 'Mfuko wa 100kg', unitEn: '100kg Bag', trend: '+3.2%', positive: true, market: 'Moshi Co-op', region: 'Kilimanjaro', emoji: '☕', category: 'trending', volatilitySw: 'Chini', volatilityEn: 'Low', demandSw: 'Juu', demandEn: 'High', outlookSw: 'Kupanda', outlookEn: 'Bullish', priceNum: 680_000, spark: [55,58,60,62,65,64,68,70,73,76] },
  { id: '7', nameSw: 'Alizeti (Mbegu)', nameEn: 'Sunflower Seeds', price: 95_000, unitSw: 'Mfuko wa 100kg', unitEn: '100kg Bag', trend: '-0.5%', positive: false, market: 'Singida Market', region: 'Singida', emoji: '🌻', category: 'trending', volatilitySw: 'Kati', volatilityEn: 'Medium', demandSw: 'Imara', demandEn: 'Stable', outlookSw: 'Kawaida', outlookEn: 'Neutral', priceNum: 95_000, spark: [60,58,62,56,58,55,53,56,52,50] },
];

const CATEGORIES = [
  { id: 'all', labelSw: 'Yote', labelEn: 'All', icon: Layers },
  { id: 'grains', labelSw: 'Nafaka', labelEn: 'Grains', icon: Leaf },
  { id: 'veg', labelSw: 'Mbogamboga', labelEn: 'Vegetables', icon: ShoppingBag },
  { id: 'trending', labelSw: 'Inayovuma', labelEn: 'Trending', icon: Flame },
];

const CROPS_SELL = ['Mahindi','Mchele','Maharage','Nyanya','Vitunguu','Kahawa','Alizeti','Soya','Mpunga','Kabichi'];
const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

type PriceAlert = { id: string; crop: string; direction: 'above'|'below'; threshold: number; active: boolean };
type MarketItem = typeof MARKET_DATA[0];

// ─── Sparkline ─────────────────────────────────────────────────────────────────
function sparkPath(data: number[], w: number, h: number) {
  if (!data || data.length < 2) return { line: '', area: '' };
  const min = Math.min(...data); const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const toY = (v: number) => h * 0.9 - ((v - min) / range) * h * 0.78;
  let d = `M0 ${toY(data[0]).toFixed(1)}`;
  for (let i = 1; i < data.length; i++) {
    const px = (i - 1) * step, cx = i * step, cpx = (px + cx) / 2;
    d += ` C${cpx.toFixed(1)} ${toY(data[i-1]).toFixed(1)},${cpx.toFixed(1)} ${toY(data[i]).toFixed(1)},${cx.toFixed(1)} ${toY(data[i]).toFixed(1)}`;
  }
  return { line: d, area: `${d} L${((data.length-1)*step).toFixed(1)} ${h} L0 ${h} Z` };
}

const NeuralSparkline = ({ data, positive, width = 88, height = 32 }: { data: number[]; positive: boolean; width?: number; height?: number }) => {
  const color = positive ? PRIMARY : '#ef4444';
  const { line, area } = sparkPath(data, width, height);
  if (!line) return null;
  const gid = `sg${positive ? 'p' : 'n'}${width}`;
  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgLinearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </SvgLinearGradient>
      </Defs>
      <Path d={area} fill={`url(#${gid})`} />
      <Path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

// ─── Live pulse dot ────────────────────────────────────────────────────────────
const LivePulse = () => {
  const scale = useSharedValue(1);
  React.useEffect(() => {
    scale.value = withRepeat(withTiming(1.9, { duration: 1000, easing: Easing.out(Easing.ease) }), -1, true);
  }, []);
  const ring = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(scale.value, [1, 1.9], [0.6, 0]),
  }));
  return (
    <View style={{ width: 10, height: 10, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[{ position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: PRIMARY }, ring]} />
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: PRIMARY }} />
    </View>
  );
};

// ─── Hero Bento ────────────────────────────────────────────────────────────────
const HeroBento = ({ colors, isDark, router, language }: any) => (
  <Animated.View entering={FadeInDown.duration(400)}
    style={[S.hero, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
    <LinearGradient
      colors={isDark
        ? [`${PRIMARY}18`, colors.card, colors.card]
        : [`${PRIMARY}12`, colors.background, colors.background]}
      locations={[0, 0.5, 1]}
      style={StyleSheet.absoluteFill}
    />
    <View style={S.heroBg} pointerEvents="none">
      <Text style={[S.heroWatermark, { color: PRIMARY }]}>SOKO</Text>
    </View>

    <View style={S.heroTopRow}>
      <View style={[S.aiBadge, { backgroundColor: `${PRIMARY}18` }]}>
        <Cpu size={11} color={PRIMARY} />
        <Text style={[S.aiBadgeText, { color: PRIMARY }]}>AI ENGINE V4.5</Text>
      </View>
      <View style={[S.liveChip, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]}>
        <LivePulse />
        <Text style={[S.liveChipText, { color: colors.textMute }]}>LIVE</Text>
      </View>
    </View>

    <Text style={[S.heroTitle, { color: colors.text }]}>Tahadhari ya{'\n'}Soko</Text>
    <Text style={[S.heroBody, { color: colors.textMute }]}>
      {language === 'sw'
        ? 'Njia ya Mbeya inaonyesha ucheleweshaji wa 15%. Athari kwa bei ya mahindi inatarajiwa katika masaa 48.'
        : 'Mbeya route shows 15% transit delay. Maize price impact expected within 48 hours.'}
    </Text>

    <View style={S.heroStats}>
      {[
        { icon: TrendingUp, label: language === 'sw' ? 'Kadirio' : 'Maize Index', val: '+2.4%', color: PRIMARY },
        { icon: Activity, label: language === 'sw' ? 'Hali ya Soko' : 'Market Mood', val: language === 'sw' ? 'Imara' : 'Stable', color: '#059669' },
        { icon: Eye, label: language === 'sw' ? 'Bidhaa' : 'Live Items', val: `${MARKET_DATA.length}`, color: '#0284c7' },
      ].map((s, i) => (
        <View key={i} style={S.heroStat}>
          <s.icon size={13} color={s.color} />
          <Text style={[S.heroStatVal, { color: s.color }]}>{s.val}</Text>
          <Text style={[S.heroStatLabel, { color: colors.textMute }]}>{s.label}</Text>
        </View>
      ))}
    </View>

    <TouchableOpacity style={S.heroBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/map'); }} activeOpacity={0.8}>
      <LinearGradient colors={[PRIMARY, '#12903a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={S.heroBtnGrad}>
        <Text style={S.heroBtnText}>{language === 'sw' ? 'Angalia Ramani' : 'View Map'}</Text>
        <ArrowUpRight size={14} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  </Animated.View>
);

// ─── Compare Sheet ─────────────────────────────────────────────────────────────
function CompareSheet({ items, onClose, colors, isDark, language }: { items: MarketItem[]; onClose: () => void; colors: any; isDark: boolean; language: string }) {
  if (items.length < 2) return null;
  const [a, b] = items;
  const rows = [
    { labelSw: 'Bei ya Wastani', labelEn: 'Avg Price', valA: `TZS ${fmt(a.priceNum)}`, valB: `TZS ${fmt(b.priceNum)}` },
    { labelSw: 'Mwenendo', labelEn: 'Trend', valA: a.trend, valB: b.trend },
    { labelSw: 'Mvutano', labelEn: 'Volatility', valA: language === 'sw' ? a.volatilitySw : a.volatilityEn, valB: language === 'sw' ? b.volatilitySw : b.volatilityEn },
    { labelSw: 'Mahitaji', labelEn: 'Demand', valA: language === 'sw' ? a.demandSw : a.demandEn, valB: language === 'sw' ? b.demandSw : b.demandEn },
    { labelSw: 'Matarajio', labelEn: 'Outlook', valA: language === 'sw' ? a.outlookSw : a.outlookEn, valB: language === 'sw' ? b.outlookSw : b.outlookEn },
    { labelSw: 'Soko', labelEn: 'Market', valA: a.market, valB: b.market },
    { labelSw: 'Kitengo', labelEn: 'Unit', valA: language === 'sw' ? a.unitSw : a.unitEn, valB: language === 'sw' ? b.unitSw : b.unitEn },
  ];
  return (
    <Modal visible animationType="slide" transparent presentationStyle="overFullScreen">
      <BlurView intensity={isDark ? 40 : 20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={[S.compareSheet, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <View style={[S.sheetHandle, { backgroundColor: colors.border }]} />
          <View style={S.compareHeader}>
            <Scale size={18} color={PRIMARY} />
            <Text style={[S.compareTitle, { color: colors.text }]}>{language === 'sw' ? 'Linganisha Bidhaa' : 'Compare Products'}</Text>
            <TouchableOpacity onPress={onClose} style={[S.closeCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }]}>
              <X size={15} color={colors.textMute} />
            </TouchableOpacity>
          </View>
          <View style={S.compareProductRow}>
            <View style={S.compareProductCol}>
              <Text style={S.compareEmoji}>{a.emoji}</Text>
              <Text style={[S.compareProductName, { color: colors.text }]}>{language === 'sw' ? a.nameSw : a.nameEn}</Text>
              <Text style={[S.compareProductMarket, { color: colors.textMute }]}>{a.market}</Text>
            </View>
            <View style={[S.compareVsCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }]}>
              <Text style={[S.compareVsText, { color: colors.textMute }]}>VS</Text>
            </View>
            <View style={S.compareProductCol}>
              <Text style={S.compareEmoji}>{b.emoji}</Text>
              <Text style={[S.compareProductName, { color: colors.text }]}>{language === 'sw' ? b.nameSw : b.nameEn}</Text>
              <Text style={[S.compareProductMarket, { color: colors.textMute }]}>{b.market}</Text>
            </View>
          </View>
          <View style={[S.compareProductRow, { marginBottom: 12 }]}>
            <View style={{ flex: 1, alignItems: 'center' }}><NeuralSparkline data={a.spark} positive={a.positive} width={120} height={40} /></View>
            <View style={{ width: 40 }} />
            <View style={{ flex: 1, alignItems: 'center' }}><NeuralSparkline data={b.spark} positive={b.positive} width={120} height={40} /></View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 280 }}>
            {rows.map((r, i) => (
              <View key={i} style={[S.compareRow, i % 2 === 0 && { backgroundColor: isDark ? 'rgba(34,209,90,0.04)' : 'rgba(34,209,90,0.04)' }]}>
                <Text style={[S.compareRowVal, { flex: 1, textAlign: 'right', color: colors.text }]} numberOfLines={1}>{r.valA}</Text>
                <Text style={[S.compareRowLabel, { color: colors.textMute }]}>{language === 'sw' ? r.labelSw : r.labelEn}</Text>
                <Text style={[S.compareRowVal, { flex: 1, color: '#0284c7' }]} numberOfLines={1}>{r.valB}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={{ height: 24 }} />
        </View>
      </View>
    </Modal>
  );
}

// ─── Price Alerts Modal ────────────────────────────────────────────────────────
function PriceAlertsModal({ visible, onClose, alerts, onAdd, onDelete, colors, isDark, language }: any) {
  const [crop, setCrop] = useState('Mahindi');
  const [direction, setDirection] = useState<'above'|'below'>('above');
  const [threshold, setThreshold] = useState('');
  const [adding, setAdding] = useState(false);

  function save() {
    if (!threshold || parseFloat(threshold) <= 0) { Alert.alert(language === 'sw' ? 'Bei inahitajika' : 'Price required'); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAdd({ id: Date.now().toString(), crop, direction, threshold: parseFloat(threshold), active: true });
    setThreshold(''); setAdding(false);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" presentationStyle="overFullScreen">
      <BlurView intensity={isDark ? 40 : 20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={[pm.sheet, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <View style={[pm.handle, { backgroundColor: colors.border }]} />
          <View style={pm.row}>
            <Text style={[pm.title, { color: colors.text }]}>{language === 'sw' ? 'Arifa za Bei' : 'Price Alerts'}</Text>
            <TouchableOpacity onPress={onClose} style={[pm.closeBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }]}>
              <X size={16} color={colors.textMute} />
            </TouchableOpacity>
          </View>
          {alerts.length === 0 && !adding ? (
            <View style={{ alignItems: 'center', padding: 32 }}>
              <Bell size={36} color={colors.border} />
              <Text style={[pm.empty, { color: colors.textMute }]}>{language === 'sw' ? 'Hakuna arifa bado' : 'No alerts set yet'}</Text>
            </View>
          ) : (
            <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
              {alerts.map((a: PriceAlert) => (
                <View key={a.id} style={[pm.alertRow, { borderColor: colors.border }]}>
                  <View style={[pm.alertDot, { backgroundColor: a.direction === 'above' ? PRIMARY : '#ef4444' }]} />
                  <Text style={[pm.alertText, { color: colors.text, flex: 1 }]} numberOfLines={1}>
                    {a.crop} — {a.direction === 'above' ? (language === 'sw' ? 'zaidi ya' : 'above') : (language === 'sw' ? 'chini ya' : 'below')} TZS {fmt(a.threshold)}
                  </Text>
                  <TouchableOpacity onPress={() => { Haptics.selectionAsync(); onDelete(a.id); }}>
                    <X size={16} color={colors.textMute} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
          {adding ? (
            <View style={{ gap: 12, marginTop: 8 }}>
              <Text style={[pm.label, { color: colors.textMute }]}>{language === 'sw' ? 'ZAO' : 'CROP'}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {CROPS_SELL.map((c) => (
                  <TouchableOpacity key={c} onPress={() => { setCrop(c); Haptics.selectionAsync(); }}
                    style={[pm.pill, { borderColor: crop === c ? PRIMARY : colors.border, backgroundColor: crop === c ? `${PRIMARY}18` : 'transparent' }]}>
                    <Text style={[pm.pillText, { color: crop === c ? PRIMARY : colors.textMute }]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={[pm.label, { color: colors.textMute }]}>{language === 'sw' ? 'MWELEKEO' : 'DIRECTION'}</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {(['above','below'] as const).map((d) => (
                  <TouchableOpacity key={d} onPress={() => { setDirection(d); Haptics.selectionAsync(); }} style={{ flex: 1 }}>
                    <View style={[pm.dirBtn, { borderColor: direction === d ? (d === 'above' ? PRIMARY : '#ef4444') : colors.border, backgroundColor: direction === d ? (d === 'above' ? `${PRIMARY}18` : '#ef444418') : 'transparent' }]}>
                      {d === 'above' ? <TrendingUp size={14} color={direction === d ? PRIMARY : colors.textMute} /> : <TrendingDown size={14} color={direction === d ? '#ef4444' : colors.textMute} />}
                      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: direction === d ? (d === 'above' ? PRIMARY : '#ef4444') : colors.textMute }}>
                        {d === 'above' ? (language === 'sw' ? 'Zaidi ya' : 'Above') : (language === 'sw' ? 'Chini ya' : 'Below')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[pm.label, { color: colors.textMute }]}>{language === 'sw' ? 'BEI (TZS)' : 'PRICE (TZS)'}</Text>
              <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <TextInput value={threshold} onChangeText={setThreshold} keyboardType="decimal-pad" style={[pm.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder="e.g. 90000" />
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={() => setAdding(false)} style={[pm.cancelBtn, { borderColor: colors.border }]}>
                  <Text style={{ color: colors.textMute, fontFamily: 'Inter_700Bold' }}>{language === 'sw' ? 'Ghairi' : 'Cancel'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={save} style={[pm.saveBtn, { backgroundColor: PRIMARY, flex: 1 }]}>
                  <Check size={16} color="#fff" />
                  <Text style={{ color: '#fff', fontFamily: 'InstrumentSerif_400Regular' }}>{language === 'sw' ? 'Hifadhi Arifa' : 'Save Alert'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setAdding(true)} style={[pm.addBtn, { backgroundColor: PRIMARY }]}>
              <Plus size={18} color="#fff" />
              <Text style={{ color: '#fff', fontFamily: 'InstrumentSerif_400Regular' }}>{language === 'sw' ? 'Ongeza Arifa Mpya' : 'Add New Alert'}</Text>
            </TouchableOpacity>
          )}
          <View style={{ height: 16 }} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Make Offer Modal ──────────────────────────────────────────────────────────
function MakeOfferModal({ item, onClose, colors, isDark, addNotification, language }: any) {
  const [qty, setQty] = useState('');
  const [offerPrice, setOfferPrice] = useState(item ? String(item.priceNum) : '');
  const [delivery, setDelivery] = useState('Wiki 1');
  const [message, setMessage] = useState('');
  if (!item) return null;

  function sendOffer() {
    if (!qty || parseFloat(qty) <= 0) { Alert.alert(language === 'sw' ? 'Kiasi kinahitajika' : 'Quantity required'); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addNotification({ title: language === 'sw' ? '✅ Ofa Imetumwa' : '✅ Offer Sent', body: language === 'sw' ? `Ofa yako ya ${item.nameSw} imetumwa kwa muuzaji.` : `Your offer for ${item.nameEn} was sent to the seller.`, type: 'info' });
    onClose();
  }

  const total = parseFloat(qty) > 0 && parseFloat(offerPrice) > 0 ? parseFloat(qty) * parseFloat(offerPrice) / 100 : 0;
  const delivOpts = language === 'sw' ? ['Siku 3','Wiki 1','Wiki 2'] : ['3 Days','1 Week','2 Weeks'];

  return (
    <Modal visible animationType="slide" transparent presentationStyle="overFullScreen">
      <BlurView intensity={isDark ? 40 : 20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={[pm.sheet, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <View style={[pm.handle, { backgroundColor: colors.border }]} />
          <View style={pm.row}>
            <View>
              <Text style={[pm.title, { color: colors.text }]}>{language === 'sw' ? 'Toa Ofa' : 'Make Offer'}</Text>
              <Text style={{ color: colors.textMute, fontFamily: 'Inter_500Medium', fontSize: 12 }}>{item.emoji} {language === 'sw' ? item.nameSw : item.nameEn} · {item.market}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[pm.closeBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }]}>
              <X size={16} color={colors.textMute} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={[pm.label, { color: colors.textMute }]}>{language === 'sw' ? 'KIASI UNACHOTAKA (kg)' : 'QUANTITY REQUIRED (kg)'}</Text>
            <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <TextInput value={qty} onChangeText={setQty} keyboardType="decimal-pad" style={[pm.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder="e.g. 500" />
            </View>
            <Text style={[pm.label, { color: colors.textMute }]}>{language === 'sw' ? 'BEI UNAYOTOA (TZS kwa mfuko)' : 'OFFER PRICE (TZS per bag)'}</Text>
            <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <TextInput value={offerPrice} onChangeText={setOfferPrice} keyboardType="decimal-pad" style={[pm.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder={String(item.priceNum)} />
            </View>
            <Text style={[pm.label, { color: colors.textMute }]}>{language === 'sw' ? 'MUDA WA UWASILISHAJI' : 'DELIVERY TIME'}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {delivOpts.map((d) => (
                <TouchableOpacity key={d} onPress={() => { setDelivery(d); Haptics.selectionAsync(); }}
                  style={[pm.pill, { flex: 1, justifyContent: 'center', borderColor: delivery === d ? PRIMARY : colors.border, backgroundColor: delivery === d ? `${PRIMARY}18` : 'transparent' }]}>
                  <Text style={[pm.pillText, { color: delivery === d ? PRIMARY : colors.textMute }]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[pm.label, { color: colors.textMute }]}>{language === 'sw' ? 'UJUMBE (HIARI)' : 'MESSAGE (OPTIONAL)'}</Text>
            <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.background, height: 80 }]}>
              <TextInput value={message} onChangeText={setMessage} multiline style={[pm.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder={language === 'sw' ? 'Maelezo ya ziada...' : 'Additional details...'} />
            </View>
            {total > 0 && (
              <View style={[pm.preview, { backgroundColor: `${PRIMARY}12`, borderColor: `${PRIMARY}30` }]}>
                <Text style={{ color: colors.textMute, fontFamily: 'Inter_600SemiBold', fontSize: 11 }}>{language === 'sw' ? 'Jumla ya ofa' : 'Total offer'}</Text>
                <Text style={{ color: PRIMARY, fontFamily: 'InstrumentSerif_400Regular', fontSize: 18 }}>TZS {fmt(Math.round(total))}</Text>
              </View>
            )}
            <TouchableOpacity onPress={sendOffer} style={[pm.saveBtn, { backgroundColor: PRIMARY, marginTop: 16 }]}>
              <Check size={16} color="#fff" />
              <Text style={{ color: '#fff', fontFamily: 'InstrumentSerif_400Regular', fontSize: 15 }}>{language === 'sw' ? 'Tuma Ofa' : 'Send Offer'}</Text>
            </TouchableOpacity>
            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Sell Listing Modal ────────────────────────────────────────────────────────
function SellListingModal({ visible, onClose, colors, isDark, addNotification, language }: any) {
  const [crop, setCrop] = useState('Mahindi');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');

  function publish() {
    if (!qty || parseFloat(qty) <= 0) { Alert.alert(language === 'sw' ? 'Kiasi kinahitajika' : 'Quantity required'); return; }
    if (!price || parseFloat(price) <= 0) { Alert.alert(language === 'sw' ? 'Bei inahitajika' : 'Price required'); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addNotification({ title: language === 'sw' ? '📦 Tangazo Limewekwa' : '📦 Listing Posted', body: language === 'sw' ? `${crop} ${qty}kg limetangazwa kwenye soko.` : `${crop} ${qty}kg listed on marketplace.`, type: 'success' });
    setQty(''); setPrice(''); setNotes('');
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" presentationStyle="overFullScreen">
      <BlurView intensity={isDark ? 40 : 20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={[pm.sheet, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <View style={[pm.handle, { backgroundColor: colors.border }]} />
          <View style={pm.row}>
            <View>
              <Text style={[pm.title, { color: colors.text }]}>{language === 'sw' ? 'Uza Mazao' : 'Sell Crops'}</Text>
              <Text style={{ color: colors.textMute, fontFamily: 'Inter_500Medium', fontSize: 12 }}>{language === 'sw' ? 'Weka tangazo kwenye soko' : 'List your crops on the marketplace'}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[pm.closeBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }]}>
              <X size={16} color={colors.textMute} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={[pm.label, { color: colors.textMute }]}>{language === 'sw' ? 'ZAO' : 'CROP'}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
              {CROPS_SELL.map((c) => (
                <TouchableOpacity key={c} onPress={() => { setCrop(c); Haptics.selectionAsync(); }}
                  style={[pm.pill, { borderColor: crop === c ? PRIMARY : colors.border, backgroundColor: crop === c ? `${PRIMARY}18` : 'transparent' }]}>
                  <Text style={[pm.pillText, { color: crop === c ? PRIMARY : colors.textMute }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[pm.label, { color: colors.textMute }]}>{language === 'sw' ? 'KIASI (kg) *' : 'QUANTITY (kg) *'}</Text>
                <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <TextInput value={qty} onChangeText={setQty} keyboardType="decimal-pad" style={[pm.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder="500" />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[pm.label, { color: colors.textMute }]}>{language === 'sw' ? 'BEI/kg (TZS) *' : 'PRICE/kg (TZS) *'}</Text>
                <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <TextInput value={price} onChangeText={setPrice} keyboardType="decimal-pad" style={[pm.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder="850" />
                </View>
              </View>
            </View>
            <Text style={[pm.label, { color: colors.textMute }]}>{language === 'sw' ? 'MAELEZO ZAIDI (HIARI)' : 'MORE DETAILS (OPTIONAL)'}</Text>
            <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.background, height: 72 }]}>
              <TextInput value={notes} onChangeText={setNotes} multiline style={[pm.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder={language === 'sw' ? 'Hali ya mazao, mahali...' : 'Crop condition, location...'} />
            </View>
            {qty && price && parseFloat(qty) > 0 && parseFloat(price) > 0 && (
              <View style={[pm.preview, { backgroundColor: `${PRIMARY}12`, borderColor: `${PRIMARY}30` }]}>
                <Text style={{ color: colors.textMute, fontFamily: 'Inter_600SemiBold', fontSize: 11 }}>{language === 'sw' ? 'Thamani ya tangazo' : 'Listing value'}</Text>
                <Text style={{ color: PRIMARY, fontFamily: 'InstrumentSerif_400Regular', fontSize: 18 }}>TZS {fmt(parseFloat(qty) * parseFloat(price))}</Text>
              </View>
            )}
            <TouchableOpacity onPress={publish} style={[pm.saveBtn, { backgroundColor: PRIMARY, marginTop: 16 }]}>
              <Globe size={16} color="#fff" />
              <Text style={{ color: '#fff', fontFamily: 'InstrumentSerif_400Regular', fontSize: 15 }}>{language === 'sw' ? 'Chapisha Tangazo' : 'Publish Listing'}</Text>
            </TouchableOpacity>
            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Market Card ───────────────────────────────────────────────────────────────
function MarketCard({ item, isExpanded, onPress, onOffer, onWishlist, onCompare, isWishlisted, isComparing, colors, isDark, language }: {
  item: MarketItem; isExpanded: boolean; onPress: () => void; onOffer: () => void;
  onWishlist: () => void; onCompare: () => void; isWishlisted: boolean; isComparing: boolean;
  colors: any; isDark: boolean; language: string;
}) {
  const itemName = language === 'sw' ? item.nameSw : item.nameEn;
  const itemUnit = language === 'sw' ? item.unitSw : item.unitEn;
  const itemVol   = language === 'sw' ? item.volatilitySw : item.volatilityEn;
  const itemOut   = language === 'sw' ? item.outlookSw : item.outlookEn;
  const itemDem   = language === 'sw' ? item.demandSw : item.demandEn;
  const isHigh    = item.volatilityEn === 'High';

  const subtle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

  return (
    <Animated.View entering={FadeInDown.duration(320)}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.92}
        accessibilityLabel={`${itemName} at ${item.market}. TZS ${fmt(item.priceNum)}`}
        accessibilityState={{ expanded: isExpanded }}>
        <View style={[S.card, { backgroundColor: colors.card, borderColor: isExpanded ? `${PRIMARY}40` : colors.border, borderWidth: isExpanded ? 1.5 : 1 }]}>
          {isExpanded && (
            <LinearGradient colors={[`${PRIMARY}08`, colors.card]} locations={[0, 0.6]} style={StyleSheet.absoluteFill} />
          )}

          {/* Top row */}
          <View style={S.cardTop}>
            <View style={[S.emojiRing, { borderColor: `${PRIMARY}30`, backgroundColor: `${PRIMARY}10` }]}>
              <Text style={S.emojiText}>{item.emoji}</Text>
            </View>
            <View style={S.cardMid}>
              <Text style={[S.cardName, { color: colors.text }]}>{itemName}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <MapPin size={10} color={colors.textMute} />
                <Text style={[S.cardMarket, { color: colors.textMute }]}>{item.market} · {item.region}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <TouchableOpacity onPress={(e) => { e.stopPropagation?.(); onWishlist(); Haptics.selectionAsync(); }}
                style={[S.heartBtn, { backgroundColor: isWishlisted ? '#ef444418' : subtle, borderColor: isWishlisted ? '#ef444440' : colors.border }]}
                accessibilityRole="button" accessibilityLabel={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
                <Heart size={13} color={isWishlisted ? '#ef4444' : colors.textMute} fill={isWishlisted ? '#ef4444' : 'none'} />
              </TouchableOpacity>
              {isExpanded ? <ChevronUp size={14} color={colors.textMute} /> : <ChevronDown size={14} color={colors.textMute} />}
            </View>
          </View>

          {/* Price + sparkline */}
          <View style={S.cardPriceRow}>
            <View style={S.cardPriceLeft}>
              <Text style={[S.priceLabel, { color: colors.textMute }]}>{language === 'sw' ? 'Wastani wa Bei' : 'Average Price'}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
                <Text style={[S.priceCurrency, { color: colors.textMute }]}>TZS</Text>
                <Text style={[S.priceNumber, { color: colors.text }]}>{fmt(item.priceNum)}</Text>
              </View>
              <Text style={[S.priceUnit, { color: colors.textMute }]}>{itemUnit}</Text>
            </View>
            <View style={S.cardPriceRight}>
              <NeuralSparkline data={item.spark} positive={item.positive} width={88} height={32} />
              <View style={[S.trendPill, { backgroundColor: item.positive ? `${PRIMARY}20` : '#ef444420' }]}>
                {item.positive ? <TrendingUp size={10} color={PRIMARY} /> : <TrendingDown size={10} color="#ef4444" />}
                <Text style={[S.trendText, { color: item.positive ? PRIMARY : '#ef4444' }]}>{item.trend}</Text>
              </View>
            </View>
          </View>

          {/* Badges row */}
          <View style={S.badgeRow}>
            <View style={[S.volBadge, { backgroundColor: isHigh ? '#ef444415' : `${PRIMARY}15` }]}>
              <View style={[S.volDot, { backgroundColor: isHigh ? '#ef4444' : PRIMARY }]} />
              <Text style={[S.volText, { color: isHigh ? '#ef4444' : PRIMARY }]}>{itemVol}</Text>
            </View>
            <View style={[S.unitChip, { backgroundColor: subtle }]}>
              <Package size={10} color={colors.textMute} />
              <Text style={[S.unitText, { color: colors.textMute }]}>{itemUnit}</Text>
            </View>
          </View>

          {/* Expanded panel */}
          {isExpanded && (
            <Animated.View entering={FadeIn.duration(200)} style={S.expandPanel}>
              <View style={[S.intelRow, { gap: 6 }]}>
                {[
                  { label: language === 'sw' ? 'Mwenendo' : 'Outlook', val: itemOut, color: item.positive ? PRIMARY : '#f59e0b' },
                  { label: language === 'sw' ? 'Mahitaji' : 'Demand', val: itemDem, color: '#0284c7' },
                  { label: language === 'sw' ? 'Mvutano' : 'Volatility', val: itemVol, color: isHigh ? '#ef4444' : PRIMARY },
                ].map((chip, i) => (
                  <View key={i} style={[S.intelChip, { backgroundColor: subtle, flex: 1 }]}>
                    <Text style={[S.intelChipVal, { color: chip.color }]}>{chip.val}</Text>
                    <Text style={[S.intelChipLabel, { color: colors.textMute }]}>{chip.label}</Text>
                  </View>
                ))}
              </View>
              <View style={[S.expandDivider, { backgroundColor: colors.border }]} />
              <View style={S.actionRow}>
                <TouchableOpacity onPress={() => { onOffer(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
                  style={S.actionPrimary} accessibilityRole="button" accessibilityLabel="Make offer">
                  <LinearGradient colors={[PRIMARY, '#12903a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={S.actionGrad}>
                    <Sparkles size={13} color="#fff" />
                    <Text style={S.actionPrimaryText}>{language === 'sw' ? 'Toa Ofa' : 'Make Offer'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { onCompare(); Haptics.selectionAsync(); }}
                  style={[S.actionSecondary, { borderColor: isComparing ? `${PRIMARY}60` : colors.border, backgroundColor: isComparing ? `${PRIMARY}12` : subtle }]}
                  accessibilityRole="button" accessibilityLabel="Compare">
                  <Scale size={13} color={isComparing ? PRIMARY : colors.textMute} />
                  <Text style={[S.actionSecondaryText, { color: isComparing ? PRIMARY : colors.textMute }]}>{language === 'sw' ? 'Linganisha' : 'Compare'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Haptics.selectionAsync()}
                  style={[S.actionSecondary, { borderColor: colors.border, backgroundColor: subtle }]}
                  accessibilityRole="button" accessibilityLabel="Inquire">
                  <MessageSquare size={13} color={colors.textMute} />
                  <Text style={[S.actionSecondaryText, { color: colors.textMute }]}>{language === 'sw' ? 'Uliza' : 'Inquire'}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function MarketScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const addNotification = useKilimoStore((s) => s.addNotification);
  const language = useKilimoStore((s) => s.language);

  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string|null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showSell, setShowSell] = useState(false);
  const [offerItem, setOfferItem] = useState<MarketItem|null>(null);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const filtered = useMemo(() => MARKET_DATA.filter((item) => {
    const catMatch = activeCategory === 'all' || item.category === activeCategory;
    const name = language === 'sw' ? item.nameSw : item.nameEn;
    const qMatch = !searchQuery.trim() || name.toLowerCase().includes(searchQuery.toLowerCase()) || item.market.toLowerCase().includes(searchQuery.toLowerCase()) || item.region.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && qMatch;
  }), [activeCategory, searchQuery, language]);

  function toggleWishlist(id: string) {
    setWishlist((w) => {
      const next = w.includes(id) ? w.filter((x) => x !== id) : [...w, id];
      const item = MARKET_DATA.find((m) => m.id === id)!;
      if (!w.includes(id)) addNotification({ title: language === 'sw' ? '❤️ Imeongezwa' : '❤️ Wishlisted', body: language === 'sw' ? `${item.nameSw} imeongezwa kwenye vipendwa vyako.` : `${item.nameEn} added to your wishlist.`, type: 'info' });
      return next;
    });
  }

  function toggleCompare(id: string) {
    setCompareIds((c) => {
      if (c.includes(id)) return c.filter((x) => x !== id);
      if (c.length >= 2) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); return [c[1], id]; }
      return [...c, id];
    });
  }

  const compareItems = compareIds.map((id) => MARKET_DATA.find((m) => m.id === id)!).filter(Boolean);
  const subtle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

  return (
    <RequireVerification>
      <View style={[S.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

        {/* Modals */}
        <PriceAlertsModal visible={showAlerts} onClose={() => setShowAlerts(false)} alerts={priceAlerts} language={language} colors={colors} isDark={isDark}
          onAdd={(a: PriceAlert) => { setPriceAlerts((p) => [a, ...p]); addNotification({ title: language === 'sw' ? '🔔 Arifa Imewekwa' : '🔔 Alert Set', body: `${a.crop} — ${a.direction} TZS ${fmt(a.threshold)}`, type: 'info' }); }}
          onDelete={(id: string) => setPriceAlerts((p) => p.filter((a) => a.id !== id))} />
        {offerItem && <MakeOfferModal item={offerItem} onClose={() => setOfferItem(null)} colors={colors} isDark={isDark} addNotification={addNotification} language={language} />}
        <SellListingModal visible={showSell} onClose={() => setShowSell(false)} colors={colors} isDark={isDark} addNotification={addNotification} language={language} />
        {showCompare && <CompareSheet items={compareItems} onClose={() => setShowCompare(false)} colors={colors} isDark={isDark} language={language} />}

        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <Animated.View entering={FadeInDown.duration(300)} style={S.header}>
            <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} activeOpacity={0.7}
              accessibilityRole="button" accessibilityLabel={language === 'sw' ? 'Nenda Nyuma' : 'Go back'}>
              <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={[S.iconBtn, { borderColor: colors.border }]}>
                <ChevronLeft size={22} color={colors.text} />
              </BlurView>
            </TouchableOpacity>

            <View style={S.headerCenter}>
              <Text style={[S.headerTitle, { color: colors.text }]}>{language === 'sw' ? 'Soko & Intel' : 'Market & Intel'}</Text>
              <View style={S.headerSub}>
                <LivePulse />
                <Text style={[S.headerSubText, { color: colors.textMute }]}>EAST AFRICA FEED</Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => { Haptics.selectionAsync(); setShowAlerts(true); }} activeOpacity={0.7}
              accessibilityRole="button" accessibilityLabel={language === 'sw' ? 'Arifa za bei' : 'Price alerts'}>
              <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={[S.iconBtn, { borderColor: colors.border }]}>
                <Bell size={18} color={colors.text} />
                {priceAlerts.length > 0 && <View style={[S.alertDot, { backgroundColor: colors.error }]} />}
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY} />}
            contentContainerStyle={S.scrollContent}
            stickyHeaderIndices={[1]}
          >
            {/* Search bar */}
            <View style={S.searchWrap}>
              <View style={[S.searchBar, { backgroundColor: colors.card, borderColor: searchFocused ? PRIMARY : colors.border }]}>
                <View style={[S.searchIconCircle, { backgroundColor: searchFocused ? `${PRIMARY}18` : subtle }]}>
                  <Search size={15} color={searchFocused ? PRIMARY : colors.textMute} />
                </View>
                <TextInput
                  placeholder={language === 'sw' ? 'Tafuta bidhaa, masoko, mikoa...' : 'Search crops, markets, regions...'}
                  placeholderTextColor={colors.textMute}
                  style={[S.searchInput, { color: colors.text }]}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={() => { setSearchFocused(true); Haptics.selectionAsync(); }}
                  onBlur={() => setSearchFocused(false)}
                  accessibilityLabel={language === 'sw' ? 'Tafuta sokoni' : 'Search marketplace'}
                />
                {searchQuery.length > 0 ? (
                  <TouchableOpacity onPress={() => { setSearchQuery(''); Haptics.selectionAsync(); }}>
                    <View style={[S.searchClear, { backgroundColor: subtle }]}><X size={12} color={colors.textMute} /></View>
                  </TouchableOpacity>
                ) : (
                  <View style={[S.searchFilter, { backgroundColor: `${PRIMARY}15` }]}>
                    <Filter size={13} color={PRIMARY} />
                  </View>
                )}
              </View>
            </View>

            {/* Categories — sticky */}
            <View style={[S.stickyStrip, { backgroundColor: colors.background }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.catRow}>
                {CATEGORIES.map((cat) => {
                  const active = activeCategory === cat.id;
                  const label = language === 'sw' ? cat.labelSw : cat.labelEn;
                  const Icon = cat.icon;
                  return (
                    <TouchableOpacity key={cat.id} onPress={() => { setActiveCategory(cat.id); Haptics.selectionAsync(); }}
                      accessibilityRole="button" accessibilityLabel={`Category ${label}`} accessibilityState={{ selected: active }}>
                      <View style={[S.catPill, { borderColor: active ? PRIMARY : colors.border, backgroundColor: active ? PRIMARY : colors.card }, active && S.catPillActive]}>
                        <Icon size={13} color={active ? '#fff' : colors.textMute} />
                        <Text style={[S.catText, { color: active ? '#fff' : colors.textMute }, active && { fontFamily: 'Inter_800ExtraBold' }]}>{label}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
                {/* Sell pill */}
                <TouchableOpacity onPress={() => { setShowSell(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
                  accessibilityRole="button" accessibilityLabel="Sell crops">
                  <View style={[S.catPill, { backgroundColor: PRIMARY, borderColor: PRIMARY }]}>
                    <Tag size={13} color="#fff" />
                    <Text style={[S.catText, { color: '#fff', fontFamily: 'Inter_800ExtraBold' }]}>{language === 'sw' ? 'UZA MAZAO' : 'SELL'}</Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Hero bento */}
            <HeroBento colors={colors} isDark={isDark} router={router} language={language} />

            {/* Feed header */}
            <View style={S.feedHeader}>
              <BarChart3 size={16} color={PRIMARY} />
              <Text style={[S.feedTitle, { color: colors.text }]}>{language === 'sw' ? 'Bei za Moja kwa Moja' : 'Live Market Feed'}</Text>
              <View style={[S.feedCount, { backgroundColor: subtle }]}>
                <Text style={[S.feedCountText, { color: colors.textMute }]}>{filtered.length} {language === 'sw' ? 'bidhaa' : 'items'}</Text>
              </View>
            </View>

            {/* Wishlist strip */}
            {wishlist.length > 0 && (
              <Animated.View entering={FadeInDown.duration(300)} style={[S.wishlistBar, { backgroundColor: '#ef444410', borderColor: '#ef444425' }]}>
                <Heart size={14} color="#ef4444" fill="#ef4444" />
                <Text style={[S.wishlistText, { color: colors.text }]}>{wishlist.length} {language === 'sw' ? 'vipendwa' : 'wishlisted'}</Text>
                <TouchableOpacity onPress={() => setWishlist([])} style={S.wishlistClear}>
                  <Text style={S.wishlistClearText}>{language === 'sw' ? 'Futa' : 'Clear'}</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Market cards */}
            <View style={S.cardList}>
              {filtered.length === 0 ? (
                <View style={S.emptyState}>
                  <Search size={36} color={colors.border} />
                  <Text style={[S.emptyText, { color: colors.textMute }]}>{language === 'sw' ? 'Hakuna bidhaa' : 'No items found'}</Text>
                </View>
              ) : (
                filtered.map((item) => (
                  <MarketCard
                    key={item.id}
                    item={item}
                    isExpanded={expandedId === item.id}
                    onPress={() => { setExpandedId(expandedId === item.id ? null : item.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                    onOffer={() => setOfferItem(item)}
                    onWishlist={() => toggleWishlist(item.id)}
                    onCompare={() => toggleCompare(item.id)}
                    isWishlisted={wishlist.includes(item.id)}
                    isComparing={compareIds.includes(item.id)}
                    colors={colors}
                    isDark={isDark}
                    language={language}
                  />
                ))
              )}
            </View>

            <View style={{ height: compareIds.length >= 2 ? 120 : 32 }} />
          </ScrollView>

          {/* Compare bar */}
          {compareIds.length >= 2 && (
            <Animated.View entering={FadeInDown.duration(350)} style={[S.compareBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
              <View style={S.compareBarInner}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  {compareItems.map((it) => (
                    <View key={it.id} style={[S.compareThumb, { backgroundColor: `${PRIMARY}15`, borderColor: `${PRIMARY}40` }]}>
                      <Text style={{ fontSize: 16 }}>{it.emoji}</Text>
                    </View>
                  ))}
                  <Text style={[S.compareBarLabel, { color: colors.textMute }]}>{language === 'sw' ? 'Tayari kulinganisha' : 'Ready to compare'}</Text>
                </View>
                <TouchableOpacity onPress={() => { setShowCompare(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
                  style={S.compareBarBtn}>
                  <LinearGradient colors={[PRIMARY, '#12903a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={S.compareBarBtnGrad}>
                    <Scale size={14} color="#fff" />
                    <Text style={S.compareBarBtnText}>{language === 'sw' ? 'Linganisha' : 'Compare'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Sell FAB */}
          {compareIds.length < 2 && (
            <TouchableOpacity onPress={() => { setShowSell(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
              style={S.sellFab} activeOpacity={0.88}
              accessibilityRole="button" accessibilityLabel={language === 'sw' ? 'Uza Mazao' : 'Sell Crops'}>
              <LinearGradient colors={[PRIMARY, '#12903a']} style={S.sellFabGrad}>
                <Tag size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </View>
    </RequireVerification>
  );
}

// ─── Modal styles ──────────────────────────────────────────────────────────────
const pm = StyleSheet.create({
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingTop: 8, borderTopWidth: 1 },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 22 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.2, marginBottom: 6, marginTop: 12 },
  empty: { fontFamily: 'Inter_500Medium', marginTop: 12 },
  pill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, flexDirection: 'row', gap: 5, alignItems: 'center' },
  pillText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  dirBtn: { flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, borderWidth: 1 },
  inputWrap: { borderRadius: 12, borderWidth: 1, overflow: 'hidden', marginBottom: 4 },
  input: { fontFamily: 'Inter_500Medium', fontSize: 14, padding: 12 },
  preview: { borderRadius: 12, borderWidth: 1, padding: 12, marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addBtn: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 14, marginTop: 12 },
  saveBtn: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 14 },
  cancelBtn: { flex: 0.4, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 14, borderWidth: 1 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 4, borderBottomWidth: StyleSheet.hairlineWidth },
  alertDot: { width: 8, height: 8, borderRadius: 4 },
  alertText: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});

// ─── Main styles ───────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: CARD_PAD },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: CARD_PAD, paddingVertical: 10, gap: 12 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 20, letterSpacing: 0.3 },
  headerSub: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  headerSubText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.5 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  alertDot: { position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: 4 },

  searchWrap: { marginBottom: 4 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, borderWidth: 1, paddingHorizontal: 10, gap: 8, height: 46 },
  searchIconCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  searchInput: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14 },
  searchClear: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  searchFilter: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },

  stickyStrip: { paddingVertical: 10, marginHorizontal: -CARD_PAD, paddingHorizontal: CARD_PAD },
  catRow: { gap: 8, paddingVertical: 2 },
  catPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 24, borderWidth: 1 },
  catPillActive: {},
  catText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },

  hero: { borderRadius: 22, overflow: 'hidden', marginBottom: 20, padding: 22, minHeight: 200 },
  heroBg: { position: 'absolute', right: -10, bottom: -20 },
  heroWatermark: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 120, opacity: 0.04, letterSpacing: -4 },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  aiBadge: { flexDirection: 'row', gap: 5, alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  aiBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1 },
  liveChip: { flexDirection: 'row', gap: 5, alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  liveChipText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5 },
  heroTitle: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 32, lineHeight: 36, marginBottom: 10 },
  heroBody: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, marginBottom: 18 },
  heroStats: { flexDirection: 'row', marginBottom: 18 },
  heroStat: { flex: 1, gap: 3 },
  heroStatVal: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 18 },
  heroStatLabel: { fontFamily: 'Inter_500Medium', fontSize: 10, letterSpacing: 0.3 },
  heroBtn: { alignSelf: 'flex-start', borderRadius: 22, overflow: 'hidden' },
  heroBtnGrad: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 18, paddingVertical: 10 },
  heroBtnText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#fff' },

  feedHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  feedTitle: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 18, flex: 1 },
  feedCount: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  feedCountText: { fontFamily: 'Inter_500Medium', fontSize: 11 },

  wishlistBar: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, padding: 10, marginBottom: 12, borderWidth: 1 },
  wishlistText: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  wishlistClear: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#ef444428', borderRadius: 8 },
  wishlistClearText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: '#ef4444' },

  cardList: { gap: 10 },
  card: { borderRadius: 18, overflow: 'hidden', padding: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  emojiRing: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  emojiText: { fontSize: 22 },
  cardMid: { flex: 1 },
  cardName: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 16, lineHeight: 20 },
  cardMarket: { fontFamily: 'Inter_400Regular', fontSize: 11 },
  heartBtn: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  cardPriceRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 },
  cardPriceLeft: { gap: 2 },
  priceLabel: { fontFamily: 'Inter_500Medium', fontSize: 10, letterSpacing: 0.5 },
  priceCurrency: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  priceNumber: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 26, lineHeight: 30 },
  priceUnit: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  cardPriceRight: { alignItems: 'flex-end', gap: 6 },
  trendPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  trendText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  badgeRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  volBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10 },
  volDot: { width: 5, height: 5, borderRadius: 3 },
  volText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.5 },
  unitChip: { flexDirection: 'row', gap: 4, alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  unitText: { fontFamily: 'Inter_500Medium', fontSize: 10 },

  expandPanel: { marginTop: 14 },
  expandDivider: { height: 1, marginBottom: 12 },
  intelRow: { flexDirection: 'row', marginBottom: 12 },
  intelChip: { alignItems: 'center', gap: 3, paddingVertical: 8, borderRadius: 10, marginHorizontal: 2 },
  intelChipVal: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 14 },
  intelChipLabel: { fontFamily: 'Inter_500Medium', fontSize: 9, letterSpacing: 0.5 },
  actionRow: { flexDirection: 'row', gap: 8 },
  actionPrimary: { flex: 1.4, borderRadius: 12, overflow: 'hidden' },
  actionGrad: { flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  actionPrimaryText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: '#fff' },
  actionSecondary: { flex: 1, flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  actionSecondaryText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },

  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 18 },

  compareBar: { borderTopWidth: 1 },
  compareBarInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, paddingBottom: Platform.OS === 'ios' ? 28 : 14 },
  compareThumb: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  compareBarLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  compareBarBtn: { borderRadius: 22, overflow: 'hidden' },
  compareBarBtnGrad: { flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 18, paddingVertical: 10 },
  compareBarBtnText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#fff' },

  sellFab: { position: 'absolute', bottom: Platform.OS === 'ios' ? 28 : 20, right: 20, width: 52, height: 52, borderRadius: 26, overflow: 'hidden', shadowColor: '#0a3d18', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  sellFabGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  compareSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingTop: 8, borderTopWidth: 1 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  compareHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  compareTitle: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 20, flex: 1 },
  closeCircle: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  compareProductRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  compareProductCol: { flex: 1, alignItems: 'center', gap: 5 },
  compareEmoji: { fontSize: 32 },
  compareProductName: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 14, textAlign: 'center' },
  compareProductMarket: { fontFamily: 'Inter_400Regular', fontSize: 11, textAlign: 'center' },
  compareVsCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  compareVsText: { fontFamily: 'Inter_800ExtraBold', fontSize: 9, letterSpacing: 1 },
  compareRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 8, borderRadius: 8, gap: 8 },
  compareRowLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, width: 80, textAlign: 'center' },
  compareRowVal: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
});
