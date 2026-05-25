/**
 * Market & Intel — Price Feed, Price Alerts, Make Offer, Sell Listing
 * Audit fixes: router in IntelligenceBento, category/region in MARKET_DATA,
 * Bell → Price Alerts modal, "Buy via Escrow" → Make Offer modal, UZA FAB
 */
import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput,
  Dimensions, SafeAreaView, Platform, StatusBar, RefreshControl, Modal,
  KeyboardAvoidingView, Alert,
} from 'react-native';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe, TrendingUp, TrendingDown, BarChart3, Activity, ArrowUpRight,
  Sparkles, Cpu, ShoppingBag, Leaf, Search, ChevronLeft, Bell,
  Filter, ArrowRight, Layers, FileSignature, Wallet, Plus, X, Check,
  AlertCircle, Tag, Package, MapPin, Clock, Send, Shield, Users, Calendar,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';
import { useKilimoStore } from '../store/useKilimoStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────
const MARKET_DATA = [
  { id: '1', name: 'Mahindi (Meupe)', price: 85_000, unit: '100kg Bag', trend: '+2.4%', positive: true, market: 'Tandale Market', region: 'Dar es Salaam', emoji: '🌽', category: 'Nafaka (Grains)', volatility: 'Low', demand: 'High', outlook: 'Bullish', priceNum: 85_000 },
  { id: '2', name: 'Mchele (Daraja A)', price: 120_000, unit: '100kg Bag', trend: '-1.2%', positive: false, market: 'Mbagala Market', region: 'Dar es Salaam', emoji: '🌾', category: 'Nafaka (Grains)', volatility: 'Medium', demand: 'Stable', outlook: 'Neutral', priceNum: 120_000 },
  { id: '3', name: 'Soya (Beans)', price: 210_000, unit: '100kg Bag', trend: '+0.8%', positive: true, market: 'Kariakoo Market', region: 'Dar es Salaam', emoji: '🫘', category: 'Nafaka (Grains)', volatility: 'Low', demand: 'High', outlook: 'Bullish', priceNum: 210_000 },
  { id: '4', name: 'Vitunguu (Vyekundu)', price: 45_000, unit: 'Net 20kg', trend: '+5.1%', positive: true, market: 'Tandale Market', region: 'Dar es Salaam', emoji: '🧅', category: 'Mboga (Veg)', volatility: 'High', demand: 'Surging', outlook: 'Volatile', priceNum: 45_000 },
  { id: '5', name: 'Nyanya (Beefsteak)', price: 38_000, unit: 'Crate 15kg', trend: '+1.8%', positive: true, market: 'Kilombero Market', region: 'Morogoro', emoji: '🍅', category: 'Mboga (Veg)', volatility: 'High', demand: 'High', outlook: 'Bullish', priceNum: 38_000 },
  { id: '6', name: 'Kahawa (AA)', price: 680_000, unit: '100kg Bag', trend: '+3.2%', positive: true, market: 'Moshi Co-op', region: 'Kilimanjaro', emoji: '☕', category: 'Inayovuma', volatility: 'Low', demand: 'High', outlook: 'Bullish', priceNum: 680_000 },
  { id: '7', name: 'Alizeti (Mbegu)', price: 95_000, unit: '100kg Bag', trend: '-0.5%', positive: false, market: 'Singida Market', region: 'Singida', emoji: '🌻', category: 'Inayovuma', volatility: 'Medium', demand: 'Stable', outlook: 'Neutral', priceNum: 95_000 },
];

const CATEGORIES = [
  { name: 'Yote (All)', icon: <Layers size={14} /> },
  { name: 'Nafaka (Grains)', icon: <Leaf size={14} /> },
  { name: 'Mboga (Veg)', icon: <ShoppingBag size={14} /> },
  { name: 'Inayovuma', icon: <TrendingUp size={14} /> },
];

const CROPS_SELL = ['Mahindi', 'Mchele', 'Maharage', 'Nyanya', 'Vitunguu', 'Kahawa', 'Alizeti', 'Soya', 'Mpunga', 'Kabichi'];
const GRADES = ['A — Bora Sana', 'B — Wastani', 'C — Kawaida'];
const DELIVERY = ['Siku 3', 'Wiki 1', 'Wiki 2'];
const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

type PriceAlert = { id: string; crop: string; direction: 'above' | 'below'; threshold: number; active: boolean };

// ─── Background orb ───────────────────────────────────────────────────────────
const NeuralOrb = ({ color, size, delay, x, y, duration = 20, scrolled }: any) => (
  <motion.View
    initial={{ x, y, opacity: 0, scale: 0.8 }}
    animate={{
      x: [x, x + 60, x - 40, x], y: [y, y - 80, y + 60, y],
      opacity: scrolled ? [0.05, 0.1, 0.08, 0.05] : [0.1, 0.2, 0.15, 0.1],
      scale: scrolled ? [0.8, 1, 0.9, 0.8] : [1, 1.15, 0.95, 1],
    }}
    transition={{ duration: duration + delay / 1000, repeat: Infinity, ease: 'easeInOut' }}
    style={[styles.bgOrb, { width: size, height: size, borderRadius: size / 2, backgroundColor: color, filter: Platform.OS === 'web' ? 'blur(120px)' : undefined }]}
  />
);

// ─── Intelligence bento (router prop fixed) ───────────────────────────────────
const IntelligenceBento = ({ isDark, colors, router }: any) => (
  <View style={styles.bentoContainer}>
    <motion.View initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 120 }} style={[styles.bentoMain, { borderColor: colors.border }]}>
      <BlurView intensity={isDark ? 25 : 85} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={isDark ? ['rgba(34,209,90,0.15)', 'rgba(15,23,42,0.9)'] : ['rgba(34,209,90,0.1)', 'rgba(255,255,255,0.9)']} style={StyleSheet.absoluteFill} />
      <View style={styles.bentoHeader}>
        <View style={styles.intelBadge}><Cpu size={14} color={colors.primary} /><Text style={[styles.intelBadgeText, { color: colors.primary }]}>AI ENGINE V4.5</Text></View>
        <motion.View animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}><Sparkles size={20} color={colors.primary} opacity={0.6} /></motion.View>
      </View>
      <Text style={[styles.bentoTitle, { color: colors.text }]}>Tahadhari ya Soko</Text>
      <Text style={[styles.bentoDesc, { color: colors.textMute }]}>Njia ya Mbeya inaonyesha <Text style={{ color: colors.primary, fontWeight: '700' }}>ucheleweshaji wa 15%</Text>. Athari kwa bei ya mahindi inatarajiwa katika <Text style={{ fontWeight: '700' }}>masaa 48</Text>.</Text>
      <View style={styles.bentoFooter}>
        <TouchableOpacity style={[styles.bentoAction, { backgroundColor: colors.primary }]} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/map'); }}>
          <Text style={styles.bentoActionText}>Angalia Ramani</Text><ArrowUpRight size={14} color="#000" />
        </TouchableOpacity>
      </View>
    </motion.View>
    <View style={styles.bentoSidebar}>
      <motion.View initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, type: 'spring' }} style={[styles.bentoSmall, { borderColor: colors.border }]}>
        <BlurView intensity={isDark ? 20 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <TrendingUp size={20} color={colors.primary} /><Text style={[styles.bentoSmallTitle, { color: colors.text }]}>+2.4%</Text><Text style={[styles.bentoSmallDesc, { color: colors.textMute }]}>Maize Index</Text>
      </motion.View>
      <motion.View initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, type: 'spring' }} style={[styles.bentoSmall, { borderColor: colors.border, backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)' }]}>
        <BlurView intensity={isDark ? 20 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <Activity size={20} color="#3b82f6" /><Text style={[styles.bentoSmallTitle, { color: colors.text }]}>Imara</Text><Text style={[styles.bentoSmallDesc, { color: colors.textMute }]}>Market Volatility</Text>
      </motion.View>
    </View>
  </View>
);

// ─── Sparkline ────────────────────────────────────────────────────────────────
const NeuralSparkline = ({ data, positive }: any) => {
  const max = Math.max(...data), min = Math.min(...data), range = max - min;
  return (
    <View style={styles.sparklineOuter}>
      {data.map((val: number, i: number) => (
        <motion.View key={i} initial={{ height: 0, opacity: 0 }} animate={{ height: ((val - min) / range) * 30 + 5, opacity: 1 }} transition={{ delay: 0.2 + i * 0.05, type: 'spring', damping: 15 }}
          style={[styles.sparkBar, { backgroundColor: positive ? '#22d15a' : '#ef4444', opacity: 0.3 + (i / data.length) * 0.7 }]} />
      ))}
    </View>
  );
};

// ─── Price Alerts Modal ───────────────────────────────────────────────────────
function PriceAlertsModal({ visible, onClose, alerts, onAdd, onDelete, colors, isDark }: any) {
  const [crop, setCrop] = useState('Mahindi');
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [threshold, setThreshold] = useState('');
  const [adding, setAdding] = useState(false);

  function save() {
    if (!threshold || parseFloat(threshold) <= 0) { Alert.alert('Bei inahitajika'); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAdd({ id: Date.now().toString(), crop, direction, threshold: parseFloat(threshold), active: true });
    setThreshold(''); setAdding(false);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" presentationStyle="overFullScreen">
      <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={[pm.sheet, { backgroundColor: isDark ? '#1a1a2e' : '#fff' }]}>
          <View style={[pm.handle, { backgroundColor: colors.border }]} />
          <View style={pm.row}><Text style={[pm.title, { color: colors.text }]}>Arifa za Bei</Text><TouchableOpacity onPress={onClose} style={[pm.closeBtn, { backgroundColor: colors.card }]}><X size={16} color={colors.textMute} /></TouchableOpacity></View>
          {alerts.length === 0 && !adding ? (
            <View style={{ alignItems: 'center', padding: 32 }}>
              <Bell size={36} color={colors.textMute} />
              <Text style={[pm.empty, { color: colors.textMute }]}>Hakuna arifa bado</Text>
            </View>
          ) : (
            <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
              {alerts.map((a: PriceAlert) => (
                <View key={a.id} style={[pm.alertRow, { borderColor: colors.border }]}>
                  <View style={[pm.alertDot, { backgroundColor: a.direction === 'above' ? '#22d15a' : '#ef4444' }]} />
                  <Text style={[pm.alertText, { color: colors.text }]}>{a.crop} — {a.direction === 'above' ? 'zaidi ya' : 'chini ya'} TZS {fmt(a.threshold)}</Text>
                  <TouchableOpacity onPress={() => { Haptics.selectionAsync(); onDelete(a.id); }}><X size={16} color={colors.textMute} /></TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
          {adding ? (
            <View style={{ gap: 12, marginTop: 8 }}>
              <Text style={[pm.label, { color: colors.textMute }]}>ZAO</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {CROPS_SELL.map((c) => (
                  <TouchableOpacity key={c} onPress={() => { setCrop(c); Haptics.selectionAsync(); }}
                    style={[pm.pill, { borderColor: crop === c ? colors.primary : colors.border, backgroundColor: crop === c ? colors.primary + '18' : 'transparent' }]}>
                    <Text style={[pm.pillText, { color: crop === c ? colors.primary : colors.textMute }]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={[pm.label, { color: colors.textMute }]}>MWELEKEO</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {(['above', 'below'] as const).map((d) => (
                  <TouchableOpacity key={d} onPress={() => { setDirection(d); Haptics.selectionAsync(); }} style={{ flex: 1 }}>
                    <View style={[pm.dirBtn, { borderColor: direction === d ? (d === 'above' ? '#22d15a' : '#ef4444') : colors.border, backgroundColor: direction === d ? (d === 'above' ? '#22d15a18' : '#ef444418') : 'transparent' }]}>
                      {d === 'above' ? <TrendingUp size={14} color={direction === d ? '#22d15a' : colors.textMute} /> : <TrendingDown size={14} color={direction === d ? '#ef4444' : colors.textMute} />}
                      <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 12, color: direction === d ? (d === 'above' ? '#22d15a' : '#ef4444') : colors.textMute }}>
                        {d === 'above' ? 'Zaidi ya' : 'Chini ya'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[pm.label, { color: colors.textMute }]}>BEI (TZS kwa kilo / mfuko)</Text>
              <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <TextInput value={threshold} onChangeText={setThreshold} keyboardType="decimal-pad" style={[pm.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder="e.g. 90000" />
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={() => setAdding(false)} style={[pm.cancelBtn, { borderColor: colors.border }]}><Text style={{ color: colors.textMute, fontFamily: 'Inter_700Bold' }}>Ghairi</Text></TouchableOpacity>
                <TouchableOpacity onPress={save} style={[pm.saveBtn, { backgroundColor: colors.primary, flex: 1 }]}>
                  <Check size={16} color="#000" /><Text style={{ color: '#000', fontFamily: 'Inter_900Black' }}>Hifadhi Arifa</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setAdding(true)} style={[pm.addBtn, { backgroundColor: colors.primary }]}>
              <Plus size={18} color="#000" /><Text style={{ color: '#000', fontFamily: 'Inter_900Black' }}>Ongeza Arifa Mpya</Text>
            </TouchableOpacity>
          )}
          <View style={{ height: 16 }} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Make Offer Modal ─────────────────────────────────────────────────────────
function MakeOfferModal({ item, onClose, colors, isDark, addNotification }: any) {
  const [qty, setQty] = useState('');
  const [offerPrice, setOfferPrice] = useState(item ? String(item.priceNum) : '');
  const [delivery, setDelivery] = useState('Wiki 1');
  const [message, setMessage] = useState('');

  if (!item) return null;

  function sendOffer() {
    if (!qty || parseFloat(qty) <= 0) { Alert.alert('Kiasi kinahitajika'); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addNotification({ title: '✅ Ofa Imetumwa', body: `Ofa yako ya ${item.name} (${qty}kg @ TZS ${fmt(parseFloat(offerPrice))} / mfuko) imetumwa kwa muuzaji.`, type: 'info' });
    onClose();
  }

  const total = parseFloat(qty) > 0 && parseFloat(offerPrice) > 0 ? parseFloat(qty) * parseFloat(offerPrice) / 100 : 0;

  return (
    <Modal visible animationType="slide" transparent presentationStyle="overFullScreen">
      <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={[pm.sheet, { backgroundColor: isDark ? '#1a1a2e' : '#fff' }]}>
          <View style={[pm.handle, { backgroundColor: colors.border }]} />
          <View style={pm.row}>
            <View>
              <Text style={[pm.title, { color: colors.text }]}>Toa Ofa</Text>
              <Text style={{ color: colors.textMute, fontFamily: 'Inter_500Medium', fontSize: 12 }}>{item.emoji} {item.name} · {item.market}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[pm.closeBtn, { backgroundColor: colors.card }]}><X size={16} color={colors.textMute} /></TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={[pm.label, { color: colors.textMute }]}>KIASI UNACHOTAKA (kg)</Text>
            <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput value={qty} onChangeText={setQty} keyboardType="decimal-pad" style={[pm.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder="e.g. 500" />
            </View>
            <Text style={[pm.label, { color: colors.textMute }]}>BEI UNAYOTOA (TZS kwa mfuko 100kg)</Text>
            <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput value={offerPrice} onChangeText={setOfferPrice} keyboardType="decimal-pad" style={[pm.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder={String(item.priceNum)} />
            </View>
            <Text style={[pm.label, { color: colors.textMute }]}>MUDA WA UWASILISHAJI</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {DELIVERY.map((d) => (
                <TouchableOpacity key={d} onPress={() => { setDelivery(d); Haptics.selectionAsync(); }} style={[pm.pill, { flex: 1, justifyContent: 'center', borderColor: delivery === d ? colors.primary : colors.border, backgroundColor: delivery === d ? colors.primary + '18' : 'transparent' }]}>
                  <Text style={[pm.pillText, { color: delivery === d ? colors.primary : colors.textMute }]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[pm.label, { color: colors.textMute }]}>UJUMBE (HIARI)</Text>
            <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.card, height: 80 }]}>
              <TextInput value={message} onChangeText={setMessage} multiline style={[pm.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder="Jina lako, mahali pa uwasilishaji, maelezo..." />
            </View>
            {total > 0 && (
              <View style={[pm.preview, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}>
                <Text style={{ color: colors.textMute, fontFamily: 'Inter_600SemiBold', fontSize: 11 }}>Jumla ya ofa</Text>
                <Text style={{ color: colors.primary, fontFamily: 'Inter_900Black', fontSize: 18 }}>TZS {fmt(Math.round(total))}</Text>
              </View>
            )}
            <TouchableOpacity onPress={sendOffer} style={[pm.saveBtn, { backgroundColor: colors.primary, marginTop: 16 }]}>
              <Send size={16} color="#000" /><Text style={{ color: '#000', fontFamily: 'Inter_900Black', fontSize: 15 }}>Tuma Ofa</Text>
            </TouchableOpacity>
            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Sell Listing Modal ───────────────────────────────────────────────────────
function SellListingModal({ visible, onClose, colors, isDark, addNotification }: any) {
  const [crop, setCrop] = useState('Mahindi');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [grade, setGrade] = useState('A — Bora Sana');
  const [notes, setNotes] = useState('');

  function publish() {
    if (!qty || parseFloat(qty) <= 0) { Alert.alert('Kiasi kinahitajika'); return; }
    if (!price || parseFloat(price) <= 0) { Alert.alert('Bei inahitajika'); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addNotification({ title: '📦 Tangazo Limewekwa', body: `${crop} ${qty}kg @ TZS ${fmt(parseFloat(price))}/kg limetangazwa kwenye soko.`, type: 'success' });
    setQty(''); setPrice(''); setNotes('');
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" presentationStyle="overFullScreen">
      <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={[pm.sheet, { backgroundColor: isDark ? '#1a1a2e' : '#fff' }]}>
          <View style={[pm.handle, { backgroundColor: colors.border }]} />
          <View style={pm.row}>
            <View>
              <Text style={[pm.title, { color: colors.text }]}>Uza Mazao</Text>
              <Text style={{ color: colors.textMute, fontFamily: 'Inter_500Medium', fontSize: 12 }}>Weka tangazo kwenye soko la KILIMO AI</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[pm.closeBtn, { backgroundColor: colors.card }]}><X size={16} color={colors.textMute} /></TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={[pm.label, { color: colors.textMute }]}>ZAO</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
              {CROPS_SELL.map((c) => (
                <TouchableOpacity key={c} onPress={() => { setCrop(c); Haptics.selectionAsync(); }}
                  style={[pm.pill, { borderColor: crop === c ? '#22d15a' : colors.border, backgroundColor: crop === c ? '#22d15a18' : 'transparent' }]}>
                  <Text style={[pm.pillText, { color: crop === c ? '#22d15a' : colors.textMute }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[pm.label, { color: colors.textMute }]}>KIASI (kg) *</Text>
                <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  <TextInput value={qty} onChangeText={setQty} keyboardType="decimal-pad" style={[pm.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder="500" />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[pm.label, { color: colors.textMute }]}>BEI/kg (TZS) *</Text>
                <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  <TextInput value={price} onChangeText={setPrice} keyboardType="decimal-pad" style={[pm.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder="850" />
                </View>
              </View>
            </View>
            <Text style={[pm.label, { color: colors.textMute }]}>DARAJA LA UBORA</Text>
            <View style={{ gap: 8 }}>
              {GRADES.map((g) => (
                <TouchableOpacity key={g} onPress={() => { setGrade(g); Haptics.selectionAsync(); }}
                  style={[pm.gradeRow, { borderColor: grade === g ? '#22d15a' : colors.border, backgroundColor: grade === g ? '#22d15a10' : 'transparent' }]}>
                  <View style={[pm.gradeRadio, { borderColor: grade === g ? '#22d15a' : colors.border }]}>
                    {grade === g && <View style={[pm.gradeInner, { backgroundColor: '#22d15a' }]} />}
                  </View>
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: grade === g ? '#22d15a' : colors.text }}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[pm.label, { color: colors.textMute }]}>MAELEZO ZAIDI (HIARI)</Text>
            <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.card, height: 72 }]}>
              <TextInput value={notes} onChangeText={setNotes} multiline style={[pm.input, { color: colors.text }]} placeholderTextColor={colors.textMute} placeholder="Hali ya mazao, usafirishaji, mawasiliano..." />
            </View>
            {qty && price && parseFloat(qty) > 0 && parseFloat(price) > 0 && (
              <View style={[pm.preview, { backgroundColor: '#22d15a12', borderColor: '#22d15a30' }]}>
                <Text style={{ color: colors.textMute, fontFamily: 'Inter_600SemiBold', fontSize: 11 }}>Thamani ya tangazo</Text>
                <Text style={{ color: '#22d15a', fontFamily: 'Inter_900Black', fontSize: 18 }}>TZS {fmt(parseFloat(qty) * parseFloat(price))}</Text>
              </View>
            )}
            <TouchableOpacity onPress={publish} style={[pm.saveBtn, { backgroundColor: '#22d15a', marginTop: 16 }]}>
              <Globe size={16} color="#000" /><Text style={{ color: '#000', fontFamily: 'Inter_900Black', fontSize: 15 }}>Chapisha Tangazo</Text>
            </TouchableOpacity>
            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function MarketScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const addNotification = useKilimoStore((s) => s.addNotification);

  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Yote (All)');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showSell, setShowSell] = useState(false);
  const [offerItem, setOfferItem] = useState<typeof MARKET_DATA[0] | null>(null);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [showScamBanner, setShowScamBanner] = useState(true);

  const sellingAdvice = React.useMemo(() => {
    const bullish  = MARKET_DATA.filter((d) => d.outlook === 'Bullish' && d.positive);
    const volatile = MARKET_DATA.filter((d) => d.volatility === 'High');
    const bearish  = MARKET_DATA.filter((d) => d.outlook === 'Neutral' && !d.positive);
    if (bullish.length >= 2) return { emoji: '🟢', title: 'Wakati Mzuri wa Kuuza', tip: `${bullish.map((d) => d.name.split(' ')[0]).join(', ')} viko juu sasa. Wasiliana na mnunuzi haraka kabla bei haijashuka.`, color: '#22d15a' };
    if (volatile.length >= 2) return { emoji: '🟡', title: 'Bei Zina Kushuka Kupanda', tip: `${volatile.map((d) => d.name.split(' ')[0]).join(', ')} vina bei zisizo imara. Angalia kila siku kabla ya kuuza.`, color: '#f59e0b' };
    if (bearish.length >= 2) return { emoji: '🔴', title: 'Bei Zimeshuka — Subiri', tip: `${bearish.map((d) => d.name.split(' ')[0]).join(', ')} — bei za chini sasa. Hifadhi kwa wiki 2–3 kama unaweza.`, color: '#ef4444' };
    return { emoji: '⚪', title: 'Bei za Wastani', tip: 'Bei ziko imara kwa sasa. Hakikisha bei za soko la karibu nawe kabla ya kuuza.', color: '#64748b' };
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const filtered = MARKET_DATA.filter((item) => {
    const catMatch = activeCategory === 'Yote (All)' || item.category === activeCategory;
    const qMatch = !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.market.toLowerCase().includes(searchQuery.toLowerCase()) || item.region.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && qMatch;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={StyleSheet.absoluteFill}>
        <NeuralOrb color={colors.primary} size={500} x={-150} y={50} delay={0} scrolled={scrolled} />
        <NeuralOrb color="#f59e0b" size={350} x={SCREEN_WIDTH / 2} y={350} delay={3000} scrolled={scrolled} />
        <LinearGradient colors={[isDark ? '#020617' : '#ffffff', isDark ? '#020617ee' : '#ffffffee', 'transparent']} style={styles.bgOverlay} />
      </View>

      {/* Modals */}
      <PriceAlertsModal visible={showAlerts} onClose={() => setShowAlerts(false)} alerts={priceAlerts} colors={colors} isDark={isDark}
        onAdd={(a: PriceAlert) => { setPriceAlerts((p) => [a, ...p]); addNotification({ title: '🔔 Arifa Imewekwa', body: `${a.crop} — ukipanda ${a.direction === 'above' ? 'zaidi' : 'chini'} ya TZS ${fmt(a.threshold)}, utaarifiwa.`, type: 'info' }); }}
        onDelete={(id: string) => setPriceAlerts((p) => p.filter((a) => a.id !== id))}
      />
      {offerItem && <MakeOfferModal item={offerItem} onClose={() => setOfferItem(null)} colors={colors} isDark={isDark} addNotification={addNotification} />}
      <SellListingModal visible={showSell} onClose={() => setShowSell(false)} colors={colors} isDark={isDark} addNotification={addNotification} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <motion.View initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={[styles.iconButton, { borderColor: colors.border }]}>
              <ChevronLeft size={24} color={colors.text} />
            </BlurView>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Soko & Intel</Text>
            <View style={styles.locationContainer}>
              <View style={[styles.statusDot, { backgroundColor: '#22d15a' }]} />
              <Text style={[styles.locationText, { color: colors.textMute }]}>EAST AFRICA FEED</Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.7} onPress={() => { Haptics.selectionAsync(); setShowAlerts(true); }}>
            <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={[styles.iconButton, { borderColor: colors.border }]}>
              <Bell size={20} color={colors.text} />
              {priceAlerts.length > 0 && <View style={[styles.notifDot, { backgroundColor: '#ef4444' }]} />}
            </BlurView>
          </TouchableOpacity>
        </motion.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={(e) => { const y = e.nativeEvent.contentOffset.y; if (y > 40 && !scrolled) setScrolled(true); if (y <= 40 && scrolled) setScrolled(false); }}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          contentContainerStyle={styles.scrollContent}
          stickyHeaderIndices={[1]}
        >
          {/* Search */}
          <motion.View layout style={[styles.searchContainer, searchFocused && styles.searchContainerFocused]}>
            <BlurView intensity={isDark ? 25 : 75} tint={isDark ? 'dark' : 'light'} style={[styles.searchBar, { borderColor: searchFocused ? colors.primary : colors.border }]}>
              <Search size={20} color={searchFocused ? colors.primary : colors.textMute} />
              <TextInput placeholder="Tafuta bidhaa, masoko, mikoa..." placeholderTextColor={colors.textMute} style={[styles.searchInput, { color: colors.text }]}
                value={searchQuery} onChangeText={setSearchQuery}
                onFocus={() => { setSearchFocused(true); Haptics.selectionAsync(); }} onBlur={() => setSearchFocused(false)} />
              <View style={styles.searchActions}>
                {searchQuery.length > 0 ? (
                  <TouchableOpacity onPress={() => { setSearchQuery(''); Haptics.selectionAsync(); }}><Text style={{ color: colors.textMute, fontWeight: '800', fontSize: 13 }}>✕</Text></TouchableOpacity>
                ) : searchFocused ? (
                  <TouchableOpacity onPress={() => setSearchFocused(false)}><Text style={{ color: colors.primary, fontWeight: '800', fontSize: 13 }}>DONE</Text></TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.searchActionBtn} onPress={() => { Haptics.selectionAsync(); Alert.alert('Chuja (Filter)', 'Pangilia kwa:', [{ text: 'Bei: Juu → Chini', onPress: () => {} }, { text: 'Bei: Chini → Juu', onPress: () => {} }, { text: 'Hifadhi ya Karibu', onPress: () => {} }, { text: 'Ghairi', style: 'cancel' }]); }}>
                    <Filter size={18} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </BlurView>
          </motion.View>

          {/* Categories (sticky) */}
          <View style={styles.stickyCategory}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContent}>
              {CATEGORIES.map((cat, idx) => (
                <motion.View key={cat.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                  <TouchableOpacity onPress={() => { setActiveCategory(cat.name); Haptics.selectionAsync(); }}>
                    <BlurView intensity={activeCategory === cat.name ? 0 : (isDark ? 20 : 50)} tint={isDark ? 'dark' : 'light'}
                      style={[styles.categoryPill, activeCategory === cat.name ? { backgroundColor: colors.primary } : { borderColor: colors.border, borderWidth: 1 }]}>
                      {React.cloneElement(cat.icon as React.ReactElement<{ color: string }>, { color: activeCategory === cat.name ? '#000' : colors.textMute })}
                      <Text style={[styles.categoryText, activeCategory === cat.name ? { color: '#000', fontFamily: 'Inter_800ExtraBold' } : { color: colors.textMute }]}>{cat.name}</Text>
                    </BlurView>
                  </TouchableOpacity>
                </motion.View>
              ))}
              {/* UZA pill */}
              <motion.View initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <TouchableOpacity onPress={() => { setShowSell(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}>
                  <View style={[styles.categoryPill, { backgroundColor: '#22d15a', borderRadius: 20 }]}>
                    <Tag size={14} color="#000" />
                    <Text style={[styles.categoryText, { color: '#000', fontFamily: 'Inter_800ExtraBold' }]}>UZA MAZAO</Text>
                  </View>
                </TouchableOpacity>
              </motion.View>
            </ScrollView>
          </View>

          {/* Intelligence bento */}
          <IntelligenceBento isDark={isDark} colors={colors} router={router} />

          {/* Selling timing advisory */}
          <motion.View initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, type: 'spring', damping: 22 }} style={[styles.sellingCard, { borderColor: sellingAdvice.color + '40' }]}>
            <BlurView intensity={isDark ? 20 : 65} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
            <LinearGradient colors={[sellingAdvice.color + '15', 'transparent']} style={StyleSheet.absoluteFill} />
            <View style={styles.sellingTop}>
              <Text style={{ fontSize: 22 }}>{sellingAdvice.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sellingTitle, { color: sellingAdvice.color }]}>{sellingAdvice.title}</Text>
                <Text style={[styles.sellingTip, { color: colors.text }]}>{sellingAdvice.tip}</Text>
              </View>
            </View>
            <View style={styles.sellingFooter}>
              <View style={styles.sellingChannel}>
                <Users size={12} color={colors.primary} />
                <Text style={[styles.sellingChannelText, { color: colors.primary }]}>KILIMO CO-OP</Text>
              </View>
              <Text style={[styles.sellingChannelNote, { color: colors.textMute }]}>Vikundi vya wakulima hupata bei 8–15% zaidi ya soko la kawaida</Text>
            </View>
          </motion.View>

          {/* Anti-scam awareness banner */}
          <AnimatePresence>
            {showScamBanner && (
              <motion.View initial={{ opacity: 0, y: 10, scaleX: 0.97 }} animate={{ opacity: 1, y: 0, scaleX: 1 }} exit={{ opacity: 0, y: -10, scaleX: 0.97 }} transition={{ type: 'spring', damping: 20 }} style={[styles.scamBanner, { borderColor: '#f59e0b40' }]}>
                <BlurView intensity={isDark ? 15 : 50} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                <LinearGradient colors={['#f59e0b14', 'transparent']} style={StyleSheet.absoluteFill} />
                <View style={styles.scamRow}>
                  <Shield size={18} color="#f59e0b" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.scamTitle}>TAHADHARI YA UDANGANYIFU</Text>
                    <Text style={[styles.scamText, { color: colors.text }]}>Epuka: mnunuzi anayetaka malipo kabla ya kupokea mazao • Bei "kubwa sana" zisizo za kawaida • Mawakala wasio na ofisi rasmi. Tumia escrow ya KILIMO AI kwa usalama.</Text>
                  </View>
                  <TouchableOpacity onPress={() => { setShowScamBanner(false); Haptics.selectionAsync(); }} style={styles.scamClose}>
                    <X size={14} color={colors.textMute} />
                  </TouchableOpacity>
                </View>
              </motion.View>
            )}
          </AnimatePresence>

          {/* Market data */}
          <View style={styles.sectionHeader}>
            <BarChart3 size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Bei za Moja kwa Moja</Text>
            <Text style={[{ color: colors.textMute, fontFamily: 'Inter_500Medium', fontSize: 11, marginLeft: 'auto' }]}>Leo · {filtered.length} bidhaa</Text>
          </View>

          <View style={styles.marketGrid}>
            {filtered.map((item, idx) => {
              const isExpanded = expandedId === item.id;
              const sparkData = [40, 45, 42, 48, 52, 50, 58, 62, 60, 65].map((v) => item.positive ? v : 100 - v);
              return (
                <motion.View key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.08 }} whileTap={{ scale: 0.97 }} layout>
                  <TouchableOpacity onPress={() => { setExpandedId(isExpanded ? null : item.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} activeOpacity={0.9}>
                    <BlurView intensity={isDark ? 20 : 60} tint={isDark ? 'dark' : 'light'}
                      style={[styles.premiumCard, { borderColor: colors.border }, isExpanded && { borderColor: colors.primary + '40', borderWidth: 2 }]}>
                      <View style={styles.cardHeader}>
                        <View style={[styles.emojiContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                          <Text style={styles.cardEmoji}>{item.emoji}</Text>
                        </View>
                        <View style={styles.cardMeta}>
                          <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                          <Text style={[styles.itemMarket, { color: colors.textMute }]}>{item.market} · {item.region}</Text>
                        </View>
                        <View style={[styles.volatilityBadge, { backgroundColor: item.volatility === 'High' ? '#ef444415' : '#22d15a15' }]}>
                          <Text style={[styles.volatilityText, { color: item.volatility === 'High' ? '#ef4444' : '#22d15a' }]}>{item.volatility}</Text>
                        </View>
                      </View>
                      <View style={styles.cardBody}>
                        <View style={styles.priceContainer}>
                          <Text style={[styles.priceLabel, { color: colors.textMute }]}>Wastani wa Bei</Text>
                          <Text style={[styles.priceBig, { color: colors.text }]}>TZS {fmt(item.priceNum)}</Text>
                        </View>
                        <View style={styles.trendArea}>
                          <NeuralSparkline data={sparkData} positive={item.positive} />
                          <View style={[styles.trendPill, { backgroundColor: item.positive ? '#22d15a20' : '#ef444420' }]}>
                            {item.positive ? <TrendingUp size={12} color="#22d15a" /> : <TrendingDown size={12} color="#ef4444" />}
                            <Text style={[styles.trendPercent, { color: item.positive ? '#22d15a' : '#ef4444' }]}>{item.trend}</Text>
                          </View>
                        </View>
                      </View>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.View initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={styles.expandedContent}>
                            <View style={[styles.intelDivider, { backgroundColor: colors.border }]} />
                            <View style={styles.analysisRow}>
                              <View style={styles.analysisItem}>
                                <Text style={[styles.analysisLabel, { color: colors.textMute }]}>AI Outlook</Text>
                                <View style={styles.outlookBadge}>
                                  <Sparkles size={12} color={colors.primary} />
                                  <Text style={[styles.outlookText, { color: colors.primary }]}>{item.outlook}</Text>
                                </View>
                              </View>
                              <View style={styles.analysisItem}>
                                <Text style={[styles.analysisLabel, { color: colors.textMute }]}>Mahitaji</Text>
                                <Text style={[styles.analysisValue, { color: colors.text }]}>{item.demand}</Text>
                              </View>
                              <View style={styles.analysisItem}>
                                <Text style={[styles.analysisLabel, { color: colors.textMute }]}>Kipimo</Text>
                                <Text style={[styles.analysisValue, { color: colors.text }]}>{item.unit}</Text>
                              </View>
                            </View>
                            <View style={styles.actionGrid}>
                              <TouchableOpacity style={[styles.contractBtn, { backgroundColor: colors.primary }]}
                                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setExpandedId(null); setOfferItem(item); }}>
                                <Wallet size={16} color="#000" />
                                <Text style={[styles.contractBtnText, { color: '#000' }]}>Toa Ofa</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={[styles.contractBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/contracts'); }}>
                                <FileSignature size={16} color={colors.text} />
                                <Text style={[styles.contractBtnText, { color: colors.text }]}>Smart Contract</Text>
                              </TouchableOpacity>
                            </View>
                          </motion.View>
                        )}
                      </AnimatePresence>

                      {!isExpanded && (
                        <View style={[styles.cardFooter, { borderColor: colors.border }]}>
                          <Text style={[styles.unitLabel, { color: colors.textMute }]}>{item.unit}</Text>
                          <TouchableOpacity style={styles.cardDetailBtn} onPress={(e) => { e.stopPropagation?.(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setOfferItem(item); }}>
                            <Text style={[styles.detailBtnText, { color: colors.primary }]}>Toa Ofa</Text>
                            <ArrowRight size={14} color={colors.primary} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </BlurView>
                  </TouchableOpacity>
                </motion.View>
              );
            })}
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Sell FAB */}
        <motion.View initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 120 }} style={styles.fab}>
          <TouchableOpacity onPress={() => { setShowSell(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); }} activeOpacity={0.85}>
            <LinearGradient colors={['#22d15a', '#059669']} style={styles.fabGrad}>
              <Package size={20} color="#fff" />
              <Text style={styles.fabText}>UZA</Text>
            </LinearGradient>
          </TouchableOpacity>
        </motion.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  bgOrb: { position: 'absolute' },
  bgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: SCREEN_HEIGHT },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, zIndex: 100 },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_900Black', letterSpacing: -1 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  locationText: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1 },
  iconButton: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 1, overflow: 'hidden' },
  notifDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16 },
  searchContainer: { marginBottom: 24 },
  searchContainerFocused: { zIndex: 50 },
  searchBar: { flexDirection: 'row', alignItems: 'center', height: 64, borderRadius: 24, paddingHorizontal: 20, borderWidth: 1, overflow: 'hidden' },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  searchActions: { flexDirection: 'row', alignItems: 'center' },
  searchActionBtn: { padding: 8 },
  stickyCategory: { marginBottom: 32, marginHorizontal: -24, zIndex: 10 },
  categoryContent: { paddingHorizontal: 24, gap: 12 },
  categoryPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, gap: 8 },
  categoryText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  bentoContainer: { flexDirection: 'row', gap: 16, marginBottom: 32, height: 200 },
  bentoMain: { flex: 1.5, borderRadius: 28, padding: 20, borderWidth: 1, overflow: 'hidden', justifyContent: 'space-between' },
  bentoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  intelBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(34,209,90,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  intelBadgeText: { fontSize: 9, fontFamily: 'Inter_900Black', letterSpacing: 0.5 },
  bentoTitle: { fontSize: 18, fontFamily: 'Inter_800ExtraBold', marginTop: 12, marginBottom: 4 },
  bentoDesc: { fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 20 },
  bentoFooter: { marginTop: 16 },
  bentoAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 16, gap: 8 },
  bentoActionText: { color: '#000', fontSize: 13, fontFamily: 'Inter_800ExtraBold' },
  bentoSidebar: { flex: 1, gap: 16 },
  bentoSmall: { flex: 1, borderRadius: 24, padding: 16, borderWidth: 1, overflow: 'hidden', justifyContent: 'center' },
  bentoSmallTitle: { fontSize: 20, fontFamily: 'Inter_900Black', marginTop: 8, marginBottom: 2 },
  bentoSmallDesc: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  sellingCard: { borderRadius: 24, padding: 18, borderWidth: 1, overflow: 'hidden', marginBottom: 16 },
  sellingTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  sellingTitle: { fontSize: 13, fontFamily: 'Inter_900Black', letterSpacing: 0.3, marginBottom: 4 },
  sellingTip: { fontSize: 13, fontFamily: 'Inter_600SemiBold', lineHeight: 19 },
  sellingFooter: { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)', paddingTop: 10, gap: 4 },
  sellingChannel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sellingChannelText: { fontSize: 10, fontFamily: 'Inter_900Black', letterSpacing: 0.5 },
  sellingChannelNote: { fontSize: 11, fontFamily: 'Inter_500Medium', lineHeight: 16 },
  scamBanner: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', marginBottom: 20, padding: 14 },
  scamRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  scamTitle: { fontSize: 9, fontFamily: 'Inter_900Black', color: '#f59e0b', letterSpacing: 1, marginBottom: 4 },
  scamText: { fontSize: 12, fontFamily: 'Inter_500Medium', lineHeight: 18 },
  scamClose: { padding: 4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontFamily: 'Inter_900Black', letterSpacing: -0.5 },
  marketGrid: { gap: 16 },
  premiumCard: { borderRadius: 28, padding: 20, borderWidth: 1, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  emojiContainer: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  cardEmoji: { fontSize: 20 },
  cardMeta: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 16, fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.3 },
  itemMarket: { fontSize: 12, fontFamily: 'Inter_500Medium', opacity: 0.7 },
  volatilityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  volatilityText: { fontSize: 10, fontFamily: 'Inter_800ExtraBold' },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  priceContainer: { flex: 1 },
  priceLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold', marginBottom: 4 },
  priceBig: { fontSize: 24, fontFamily: 'Inter_900Black', letterSpacing: -1 },
  trendArea: { alignItems: 'flex-end', gap: 8 },
  sparklineOuter: { flexDirection: 'row', alignItems: 'flex-end', height: 40, gap: 3 },
  sparkBar: { width: 4, borderRadius: 2 },
  trendPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  trendPercent: { fontSize: 11, fontFamily: 'Inter_800ExtraBold' },
  expandedContent: { overflow: 'hidden', marginTop: 8 },
  intelDivider: { height: 1, marginVertical: 16 },
  analysisRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  analysisItem: { flex: 1 },
  analysisLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold', marginBottom: 8 },
  outlookBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(34,209,90,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  outlookText: { fontSize: 10, fontFamily: 'Inter_900Black', letterSpacing: 0.5 },
  analysisValue: { fontSize: 14, fontFamily: 'Inter_800ExtraBold' },
  actionGrid: { flexDirection: 'row', gap: 12 },
  contractBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, gap: 8 },
  contractBtnText: { fontSize: 13, fontFamily: 'Inter_800ExtraBold' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1 },
  unitLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  cardDetailBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailBtnText: { fontSize: 12, fontFamily: 'Inter_800ExtraBold' },
  fab: { position: 'absolute', bottom: 32, right: 24 },
  fabGrad: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 16, borderRadius: 28 },
  fabText: { color: '#fff', fontFamily: 'Inter_900Black', fontSize: 14, letterSpacing: 0.5 },
});

const pm = StyleSheet.create({
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 16, maxHeight: '88%' },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  title: { fontSize: 18, fontFamily: 'Inter_900Black' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  empty: { fontFamily: 'Inter_600SemiBold', fontSize: 13, marginTop: 12 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1 },
  alertDot: { width: 8, height: 8, borderRadius: 4 },
  alertText: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  label: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.5, marginTop: 14, marginBottom: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 16, borderWidth: 1.5, alignItems: 'center' },
  pillText: { fontFamily: 'Inter_800ExtraBold', fontSize: 12 },
  dirBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5 },
  inputWrap: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 4 },
  input: { fontSize: 15, fontFamily: 'Inter_600SemiBold', paddingVertical: 10 },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 16 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, marginTop: 8 },
  gradeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12, borderWidth: 1.5 },
  gradeRadio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  gradeInner: { width: 8, height: 8, borderRadius: 4 },
  preview: { marginTop: 12, padding: 16, borderRadius: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
