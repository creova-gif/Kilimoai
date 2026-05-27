/**
 * Market & Intel — Price Feed, Price Alerts, Make Offer, Sell Listing
 * Redesigned with bilingual localization support, robust category filters,
 * and high accessibility.
 */
import React, { useState, useMemo } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput,
  Dimensions, SafeAreaView, Platform, StatusBar, RefreshControl, Modal,
  KeyboardAvoidingView, Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Globe, TrendingUp, TrendingDown, BarChart3, Activity, ArrowUpRight,
  Sparkles, Cpu, ShoppingBag, Leaf, Search, ChevronLeft, Bell,
  Filter, ArrowRight, Layers, FileSignature, Wallet, Plus, X, Check,
  Package, Tag, MapPin
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import { RequireVerification } from '../../components/RequireVerification';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────
const MARKET_DATA = [
  { id: '1', nameSw: 'Mahindi (Meupe)', nameEn: 'White Maize', price: 85_000, unitSw: 'Mfuko wa 100kg', unitEn: '100kg Bag', trend: '+2.4%', positive: true, market: 'Tandale Market', region: 'Dar es Salaam', emoji: '🌽', category: 'grains', volatilitySw: 'Chini', volatilityEn: 'Low', demandSw: 'Juu', demandEn: 'High', outlookSw: 'Kupanda', outlookEn: 'Bullish', priceNum: 85_000 },
  { id: '2', nameSw: 'Mchele (Daraja A)', nameEn: 'Rice (Grade A)', price: 120_000, unitSw: 'Mfuko wa 100kg', unitEn: '100kg Bag', trend: '-1.2%', positive: false, market: 'Mbagala Market', region: 'Dar es Salaam', emoji: '🌾', category: 'grains', volatilitySw: 'Kati', volatilityEn: 'Medium', demandSw: 'Imara', demandEn: 'Stable', outlookSw: 'Kawaida', outlookEn: 'Neutral', priceNum: 120_000 },
  { id: '3', nameSw: 'Maharage (Soya)', nameEn: 'Soya Beans', price: 210_000, unitSw: 'Mfuko wa 100kg', unitEn: '100kg Bag', trend: '+0.8%', positive: true, market: 'Kariakoo Market', region: 'Dar es Salaam', emoji: '🫘', category: 'grains', volatilitySw: 'Chini', volatilityEn: 'Low', demandSw: 'Juu', demandEn: 'High', outlookSw: 'Kupanda', outlookEn: 'Bullish', priceNum: 210_000 },
  { id: '4', nameSw: 'Vitunguu (Vyekundu)', nameEn: 'Red Onions', price: 45_000, unitSw: 'Net 20kg', unitEn: '20kg Net', trend: '+5.1%', positive: true, market: 'Tandale Market', region: 'Dar es Salaam', emoji: '🧅', category: 'veg', volatilitySw: 'Juu', volatilityEn: 'High', demandSw: 'Kubwa', demandEn: 'Surging', outlookSw: 'Kuyumba', outlookEn: 'Volatile', priceNum: 45_000 },
  { id: '5', nameSw: 'Nyanya (Beefsteak)', nameEn: 'Tomatoes', price: 38_000, unitSw: 'Tenga la 15kg', unitEn: '15kg Crate', trend: '+1.8%', positive: true, market: 'Kilombero Market', region: 'Morogoro', emoji: '🍅', category: 'veg', volatilitySw: 'Juu', volatilityEn: 'High', demandSw: 'Juu', demandEn: 'High', outlookSw: 'Kupanda', outlookEn: 'Bullish', priceNum: 38_000 },
  { id: '6', nameSw: 'Kahawa (AA)', nameEn: 'Coffee (AA)', price: 680_000, unitSw: 'Mfuko wa 100kg', unitEn: '100kg Bag', trend: '+3.2%', positive: true, market: 'Moshi Co-op', region: 'Kilimanjaro', emoji: '☕', category: 'trending', volatilitySw: 'Chini', volatilityEn: 'Low', demandSw: 'Juu', demandEn: 'High', outlookSw: 'Kupanda', outlookEn: 'Bullish', priceNum: 680_000 },
  { id: '7', nameSw: 'Alizeti (Mbegu)', nameEn: 'Sunflower Seeds', price: 95_000, unitSw: 'Mfuko wa 100kg', unitEn: '100kg Bag', trend: '-0.5%', positive: false, market: 'Singida Market', region: 'Singida', emoji: '🌻', category: 'trending', volatilitySw: 'Kati', volatilityEn: 'Medium', demandSw: 'Imara', demandEn: 'Stable', outlookSw: 'Kawaida', outlookEn: 'Neutral', priceNum: 95_000 },
];

const CATEGORIES = [
  { id: 'all', labelSw: 'Yote', labelEn: 'All', icon: <Layers size={14} /> },
  { id: 'grains', labelSw: 'Nafaka', labelEn: 'Grains', icon: <Leaf size={14} /> },
  { id: 'veg', labelSw: 'Mbogamboga', labelEn: 'Vegetables', icon: <ShoppingBag size={14} /> },
  { id: 'trending', labelSw: 'Inayovuma', labelEn: 'Trending', icon: <TrendingUp size={14} /> },
];

const CROPS_SELL = ['Mahindi', 'Mchele', 'Maharage', 'Nyanya', 'Vitunguu', 'Kahawa', 'Alizeti', 'Soya', 'Mpunga', 'Kabichi'];
const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

type PriceAlert = { id: string; crop: string; direction: 'above' | 'below'; threshold: number; active: boolean };

// ─── Sparkline ────────────────────────────────────────────────────────────────
const NeuralSparkline = ({ data, positive }: any) => {
  const { colors } = useTheme();
  return (
    <View style={styles.sparklineOuter}>
      {data.map((val: number, i: number) => (
        <Animated.View key={i} entering={FadeInDown}
          style={[styles.sparkBar, { backgroundColor: positive ? colors.primary : '#ef4444', opacity: 0.3 + (i / data.length) * 0.7 }]} />
      ))}
    </View>
  );
};

// ─── Intelligence bento ───────────────────────────────────
const IntelligenceBento = ({ isDark, colors, router, language }: any) => (
  <View style={styles.bentoContainer}>
    <Animated.View entering={FadeInDown} style={[styles.bentoMain, { borderColor: colors.border }]}>
      <BlurView intensity={isDark ? 25 : 85} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={isDark ? ['rgba(26, 59, 20, 0.15)', 'rgba(15, 23, 42, 0.9)'] : ['rgba(26, 59, 20, 0.1)', 'rgba(255, 255, 255, 0.9)']} style={StyleSheet.absoluteFill} />
      <View style={styles.bentoHeader}>
        <View style={styles.intelBadge}><Cpu size={14} color={colors.primary} /><Text style={[styles.intelBadgeText, { color: colors.primary }]}>AI ENGINE V4.5</Text></View>
        <Animated.View><Sparkles size={20} color={colors.primary} opacity={0.6} /></Animated.View>
      </View>
      <Text style={[styles.bentoTitle, { color: colors.text }]}>
        {language === 'sw' ? 'Tahadhari ya Soko' : 'Market Alert'}
      </Text>
      <Text style={[styles.bentoDesc, { color: colors.textMute }]}>
        {language === 'sw' 
          ? 'Njia ya Mbeya inaonyesha ucheleweshaji wa 15%. Athari kwa bei ya mahindi inatarajiwa katika masaa 48.' 
          : 'Mbeya route shows 15% transit delay. Impact on maize price expected in 48 hours.'}
      </Text>
      <View style={styles.bentoFooter}>
        <TouchableOpacity
          style={[styles.bentoAction, { backgroundColor: colors.primary }]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/map'); }}
          accessibilityRole="button"
          accessibilityLabel={language === 'sw' ? 'Angalia ramani ya masoko na pembejeo' : 'View interactive market and inputs map'}
        >
          <Text style={styles.bentoActionText}>
            {language === 'sw' ? 'Angalia Ramani' : 'View Map'}
          </Text>
          <ArrowUpRight size={14} color="#FCFBF7" />
        </TouchableOpacity>
      </View>
    </Animated.View>
    <View style={styles.bentoSidebar}>
      <Animated.View entering={FadeInDown} style={[styles.bentoSmall, { borderColor: colors.border }]}>
        <BlurView intensity={isDark ? 20 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <TrendingUp size={20} color={colors.primary} />
        <Text style={[styles.bentoSmallTitle, { color: colors.text }]}>+2.4%</Text>
        <Text style={[styles.bentoSmallDesc, { color: colors.textMute }]}>
          {language === 'sw' ? 'Kadirio la Mahindi' : 'Maize Index'}
        </Text>
      </Animated.View>
      <Animated.View entering={FadeInDown} style={[styles.bentoSmall, { borderColor: colors.border }]}>
        <BlurView intensity={isDark ? 20 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <Activity size={20} color={colors.primary} />
        <Text style={[styles.bentoSmallTitle, { color: colors.text }]}>
          {language === 'sw' ? 'Imara' : 'Stable'}
        </Text>
        <Text style={[styles.bentoSmallDesc, { color: colors.textMute }]}>
          {language === 'sw' ? 'Mabadiliko ya Soko' : 'Market Volatility'}
        </Text>
      </Animated.View>
    </View>
  </View>
);

// ─── Price Alerts Modal ───────────────────────────────────────────────────────
function PriceAlertsModal({ visible, onClose, alerts, onAdd, onDelete, colors, isDark, language }: any) {
  const [crop, setCrop] = useState('Mahindi');
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [threshold, setThreshold] = useState('');
  const [adding, setAdding] = useState(false);

  function save() {
    if (!threshold || parseFloat(threshold) <= 0) {
      Alert.alert(language === 'sw' ? 'Bei inahitajika' : 'Price required');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAdd({ id: Date.now().toString(), crop, direction, threshold: parseFloat(threshold), active: true });
    setThreshold(''); setAdding(false);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" presentationStyle="overFullScreen">
      <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={[pm.sheet, { backgroundColor: colors.card, borderTopColor: colors.border, borderTopWidth: 1 }]}>
          <View style={[pm.handle, { backgroundColor: colors.border }]} />
          <View style={pm.row}>
            <Text style={[pm.title, { color: colors.text }]}>
              {language === 'sw' ? 'Arifa za Bei' : 'Price Alerts'}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[pm.closeBtn, { backgroundColor: colors.background }]}
              accessibilityRole="button"
              accessibilityLabel="Close alerts modal"
            >
              <X size={16} color={colors.textMute} />
            </TouchableOpacity>
          </View>
          {alerts.length === 0 && !adding ? (
            <View style={{ alignItems: 'center', padding: 32 }}>
              <Bell size={36} color={colors.textMute} />
              <Text style={[pm.empty, { color: colors.textMute }]}>
                {language === 'sw' ? 'Hakuna arifa bado' : 'No alerts set yet'}
              </Text>
            </View>
          ) : (
            <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false} >
              {alerts.map((a: PriceAlert) => (
                <View key={a.id} style={[pm.alertRow, { borderColor: colors.border }]}>
                  <View style={[pm.alertDot, { backgroundColor: a.direction === 'above' ? colors.success : colors.error }]} />
                  <Text style={[pm.alertText, { color: colors.text }]}>
                    {a.crop} — {a.direction === 'above' ? (language === 'sw' ? 'zaidi ya' : 'above') : (language === 'sw' ? 'chini ya' : 'below')} TZS {fmt(a.threshold)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => { Haptics.selectionAsync(); onDelete(a.id); }}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete alert for ${a.crop}`}
                  >
                    <X size={16} color={colors.textMute} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
          {adding ? (
            <View style={{ gap: 12, marginTop: 8 }}>
              <Text style={[pm.label, { color: colors.textMute }]}>
                {language === 'sw' ? 'ZAO' : 'CROP'}
              </Text>
              <ScrollView showsVerticalScrollIndicator={false} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {CROPS_SELL.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => { setCrop(c); Haptics.selectionAsync(); }}
                    style={[pm.pill, { borderColor: crop === c ? colors.primary : colors.border, backgroundColor: crop === c ? colors.primary + '18' : 'transparent' }]}
                    accessibilityRole="button"
                    accessibilityLabel={c}
                    accessibilityState={{ selected: crop === c }}
                  >
                    <Text style={[pm.pillText, { color: crop === c ? colors.primary : colors.textMute }]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={[pm.label, { color: colors.textMute }]}>
                {language === 'sw' ? 'MWELEKEO' : 'DIRECTION'}
              </Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {(['above', 'below'] as const).map((d) => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => { setDirection(d); Haptics.selectionAsync(); }}
                    style={{ flex: 1 }}
                    accessibilityRole="button"
                    accessibilityLabel={d === 'above' ? 'Alert if price goes above' : 'Alert if price goes below'}
                    accessibilityState={{ selected: direction === d }}
                  >
                    <View style={[pm.dirBtn, { borderColor: direction === d ? (d === 'above' ? colors.success : colors.error) : colors.border, backgroundColor: direction === d ? (d === 'above' ? colors.success + '18' : colors.error + '18') : 'transparent' }]}>
                      {d === 'above' ? <TrendingUp size={14} color={direction === d ? colors.success : colors.textMute} /> : <TrendingDown size={14} color={direction === d ? colors.error : colors.textMute} />}
                      <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 12, color: direction === d ? (d === 'above' ? colors.success : colors.error) : colors.textMute }}>
                        {d === 'above' ? (language === 'sw' ? 'Zaidi ya' : 'Above') : (language === 'sw' ? 'Chini ya' : 'Below')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[pm.label, { color: colors.textMute }]}>
                {language === 'sw' ? 'BEI (TZS)' : 'PRICE (TZS)'}
              </Text>
              <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <TextInput
                  value={threshold}
                  onChangeText={setThreshold}
                  keyboardType="decimal-pad"
                  style={[pm.input, { color: colors.text }]}
                  placeholderTextColor={colors.textMute}
                  placeholder="e.g. 90000"
                  accessibilityLabel="Price threshold"
                />
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  onPress={() => setAdding(false)}
                  style={[pm.cancelBtn, { borderColor: colors.border }]}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                >
                  <Text style={{ color: colors.textMute, fontFamily: 'Inter_700Bold' }}>
                    {language === 'sw' ? 'Ghairi' : 'Cancel'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={save}
                  style={[pm.saveBtn, { backgroundColor: colors.primary, flex: 1 }]}
                  accessibilityRole="button"
                  accessibilityLabel="Save price alert"
                >
                  <Check size={16} color={isDark ? '#000' : '#fff'} />
                  <Text style={{ color: isDark ? '#000' : '#fff', fontFamily: 'InstrumentSerif_400Regular' }}>
                    {language === 'sw' ? 'Hifadhi Arifa' : 'Save Alert'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setAdding(true)}
              style={[pm.addBtn, { backgroundColor: colors.primary }]}
              accessibilityRole="button"
              accessibilityLabel="Add price alert"
            >
              <Plus size={18} color={isDark ? '#000' : '#fff'} />
              <Text style={{ color: isDark ? '#000' : '#fff', fontFamily: 'InstrumentSerif_400Regular' }}>
                {language === 'sw' ? 'Ongeza Arifa Mpya' : 'Add New Alert'}
              </Text>
            </TouchableOpacity>
          )}
          <View style={{ height: 16 }} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Make Offer Modal ─────────────────────────────────────────────────────────
function MakeOfferModal({ item, onClose, colors, isDark, addNotification, language }: any) {
  const [qty, setQty] = useState('');
  const [offerPrice, setOfferPrice] = useState(item ? String(item.priceNum) : '');
  const [delivery, setDelivery] = useState('Wiki 1');
  const [message, setMessage] = useState('');

  if (!item) return null;

  function sendOffer() {
    if (!qty || parseFloat(qty) <= 0) {
      Alert.alert(language === 'sw' ? 'Kiasi kinahitajika' : 'Quantity required');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addNotification({ 
      title: language === 'sw' ? '✅ Ofa Imetumwa' : '✅ Offer Sent', 
      body: language === 'sw' 
        ? `Ofa yako ya ${item.nameSw} (${qty}kg @ TZS ${fmt(parseFloat(offerPrice))} / mfuko) imetumwa kwa muuzaji.`
        : `Your offer for ${item.nameEn} (${qty}kg @ TZS ${fmt(parseFloat(offerPrice))} / bag) was sent to the seller.`, 
      type: 'info' 
    });
    onClose();
  }

  const total = parseFloat(qty) > 0 && parseFloat(offerPrice) > 0 ? parseFloat(qty) * parseFloat(offerPrice) / 100 : 0;
  const deliveryOptions = language === 'sw' ? ['Siku 3', 'Wiki 1', 'Wiki 2'] : ['3 Days', '1 Week', '2 Weeks'];

  return (
    <Modal visible animationType="slide" transparent presentationStyle="overFullScreen">
      <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={[pm.sheet, { backgroundColor: colors.card, borderTopColor: colors.border, borderTopWidth: 1 }]}>
          <View style={[pm.handle, { backgroundColor: colors.border }]} />
          <View style={pm.row}>
            <View>
              <Text style={[pm.title, { color: colors.text }]}>
                {language === 'sw' ? 'Toa Ofa' : 'Make Offer'}
              </Text>
              <Text style={{ color: colors.textMute, fontFamily: 'Inter_500Medium', fontSize: 12 }}>
                {item.emoji} {language === 'sw' ? item.nameSw : item.nameEn} · {item.market}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[pm.closeBtn, { backgroundColor: colors.background }]}
              accessibilityRole="button"
              accessibilityLabel="Close modal"
            >
              <X size={16} color={colors.textMute} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={[pm.label, { color: colors.textMute }]}>
              {language === 'sw' ? 'KIASI UNACHOTAKA (kg)' : 'QUANTITY REQUIRED (kg)'}
            </Text>
            <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <TextInput
                value={qty}
                onChangeText={setQty}
                keyboardType="decimal-pad"
                style={[pm.input, { color: colors.text }]}
                placeholderTextColor={colors.textMute}
                placeholder="e.g. 500"
                accessibilityLabel="Quantity"
              />
            </View>
            <Text style={[pm.label, { color: colors.textMute }]}>
              {language === 'sw' ? 'BEI UNAYOTOA (TZS kwa mfuko)' : 'OFFER PRICE (TZS per bag)'}
            </Text>
            <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <TextInput
                value={offerPrice}
                onChangeText={setOfferPrice}
                keyboardType="decimal-pad"
                style={[pm.input, { color: colors.text }]}
                placeholderTextColor={colors.textMute}
                placeholder={String(item.priceNum)}
                accessibilityLabel="Offer Price"
              />
            </View>
            <Text style={[pm.label, { color: colors.textMute }]}>
              {language === 'sw' ? 'MUDA WA UWASILISHAJI' : 'DELIVERY TIME'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {deliveryOptions.map((d) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => { setDelivery(d); Haptics.selectionAsync(); }}
                  style={[pm.pill, { flex: 1, justifyContent: 'center', borderColor: delivery === d ? colors.primary : colors.border, backgroundColor: delivery === d ? colors.primary + '18' : 'transparent' }]}
                  accessibilityRole="button"
                  accessibilityLabel={d}
                  accessibilityState={{ selected: delivery === d }}
                >
                  <Text style={[pm.pillText, { color: delivery === d ? colors.primary : colors.textMute }]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[pm.label, { color: colors.textMute }]}>
              {language === 'sw' ? 'UJUMBE (HIARI)' : 'MESSAGE (OPTIONAL)'}
            </Text>
            <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.background, height: 80 }]}>
              <TextInput
                value={message}
                onChangeText={setMessage}
                multiline
                style={[pm.input, { color: colors.text }]}
                placeholderTextColor={colors.textMute}
                placeholder={language === 'sw' ? 'Maelezo ya ziada...' : 'Additional details...'}
                accessibilityLabel="Message"
              />
            </View>
            {total > 0 && (
              <View style={[pm.preview, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}>
                <Text style={{ color: colors.textMute, fontFamily: 'Inter_600SemiBold', fontSize: 11 }}>
                  {language === 'sw' ? 'Jumla ya ofa' : 'Total offer'}
                </Text>
                <Text style={{ color: colors.primary, fontFamily: 'InstrumentSerif_400Regular', fontSize: 18 }}>TZS {fmt(Math.round(total))}</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={sendOffer}
              style={[pm.saveBtn, { backgroundColor: colors.primary, marginTop: 16 }]}
              accessibilityRole="button"
              accessibilityLabel="Send Offer"
            >
              <Check size={16} color={isDark ? '#000' : '#fff'} />
              <Text style={{ color: isDark ? '#000' : '#fff', fontFamily: 'InstrumentSerif_400Regular', fontSize: 15 }}>
                {language === 'sw' ? 'Tuma Ofa' : 'Send Offer'}
              </Text>
            </TouchableOpacity>
            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Sell Listing Modal ───────────────────────────────────────────────────────
function SellListingModal({ visible, onClose, colors, isDark, addNotification, language }: any) {
  const [crop, setCrop] = useState('Mahindi');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');

  function publish() {
    if (!qty || parseFloat(qty) <= 0) {
      Alert.alert(language === 'sw' ? 'Kiasi kinahitajika' : 'Quantity required');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      Alert.alert(language === 'sw' ? 'Bei inahitajika' : 'Price required');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addNotification({ 
      title: language === 'sw' ? '📦 Tangazo Limewekwa' : '📦 Listing Posted', 
      body: language === 'sw'
        ? `${crop} ${qty}kg @ TZS ${fmt(parseFloat(price))}/kg limetangazwa kwenye soko.`
        : `${crop} ${qty}kg @ TZS ${fmt(parseFloat(price))}/kg listed on the marketplace.`, 
      type: 'success' 
    });
    setQty(''); setPrice(''); setNotes('');
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" presentationStyle="overFullScreen">
      <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={[pm.sheet, { backgroundColor: colors.card, borderTopColor: colors.border, borderTopWidth: 1 }]}>
          <View style={[pm.handle, { backgroundColor: colors.border }]} />
          <View style={pm.row}>
            <View>
              <Text style={[pm.title, { color: colors.text }]}>
                {language === 'sw' ? 'Uza Mazao' : 'Sell Crops'}
              </Text>
              <Text style={{ color: colors.textMute, fontFamily: 'Inter_500Medium', fontSize: 12 }}>
                {language === 'sw' ? 'Weka tangazo kwenye soko' : 'List your crops on the marketplace'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[pm.closeBtn, { backgroundColor: colors.background }]}
              accessibilityRole="button"
              accessibilityLabel="Close modal"
            >
              <X size={16} color={colors.textMute} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={[pm.label, { color: colors.textMute }]}>
              {language === 'sw' ? 'ZAO' : 'CROP'}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
              {CROPS_SELL.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => { setCrop(c); Haptics.selectionAsync(); }}
                  style={[pm.pill, { borderColor: crop === c ? colors.success : colors.border, backgroundColor: crop === c ? colors.success + '18' : 'transparent' }]}
                  accessibilityRole="button"
                  accessibilityLabel={c}
                  accessibilityState={{ selected: crop === c }}
                >
                  <Text style={[pm.pillText, { color: crop === c ? colors.success : colors.textMute }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={[pm.label, { color: colors.textMute }]}>
                  {language === 'sw' ? 'KIASI (kg) *' : 'QUANTITY (kg) *'}
                </Text>
                <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <TextInput
                    value={qty}
                    onChangeText={setQty}
                    keyboardType="decimal-pad"
                    style={[pm.input, { color: colors.text }]}
                    placeholderTextColor={colors.textMute}
                    placeholder="500"
                    accessibilityLabel="Quantity"
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[pm.label, { color: colors.textMute }]}>
                  {language === 'sw' ? 'BEI/kg (TZS) *' : 'PRICE/kg (TZS) *'}
                </Text>
                <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <TextInput
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                    style={[pm.input, { color: colors.text }]}
                    placeholderTextColor={colors.textMute}
                    placeholder="850"
                    accessibilityLabel="Price per kg"
                  />
                </View>
              </View>
            </View>
            <Text style={[pm.label, { color: colors.textMute }]}>
              {language === 'sw' ? 'MAELEZO ZAIDI (HIARI)' : 'MORE DETAILS (OPTIONAL)'}
            </Text>
            <View style={[pm.inputWrap, { borderColor: colors.border, backgroundColor: colors.background, height: 72 }]}>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                multiline
                style={[pm.input, { color: colors.text }]}
                placeholderTextColor={colors.textMute}
                placeholder={language === 'sw' ? 'Hali ya mazao, mahali..."' : 'Crop condition, location...'}
                accessibilityLabel="Notes"
              />
            </View>
            {qty && price && parseFloat(qty) > 0 && parseFloat(price) > 0 && (
              <View style={[pm.preview, { backgroundColor: colors.success + '12', borderColor: colors.success + '30' }]}>
                <Text style={{ color: colors.textMute, fontFamily: 'Inter_600SemiBold', fontSize: 11 }}>
                  {language === 'sw' ? 'Thamani ya tangazo' : 'Listing value'}
                </Text>
                <Text style={{ color: colors.success, fontFamily: 'InstrumentSerif_400Regular', fontSize: 18 }}>TZS {fmt(parseFloat(qty) * parseFloat(price))}</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={publish}
              style={[pm.saveBtn, { backgroundColor: colors.success, marginTop: 16 }]}
              accessibilityRole="button"
              accessibilityLabel="Publish listing"
            >
              <Globe size={16} color={isDark ? '#000' : '#fff'} />
              <Text style={{ color: isDark ? '#000' : '#fff', fontFamily: 'InstrumentSerif_400Regular', fontSize: 15 }}>
                {language === 'sw' ? 'Chapisha Tangazo' : 'Publish Listing'}
              </Text>
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
  const language = useKilimoStore((s) => s.language);

  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showSell, setShowSell] = useState(false);
  const [offerItem, setOfferItem] = useState<typeof MARKET_DATA[0] | null>(null);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const filtered = MARKET_DATA.filter((item) => {
    const catMatch = activeCategory === 'all' || item.category === activeCategory;
    const itemName = language === 'sw' ? item.nameSw : item.nameEn;
    const qMatch = !searchQuery.trim() || 
      itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.market.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.region.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && qMatch;
  });

  return (
    <RequireVerification>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={StyleSheet.absoluteFill}>
        <LinearGradient colors={[isDark ? '#020617' : '#ffffff', isDark ? '#020617ee' : '#ffffffee', 'transparent']} style={styles.bgOverlay} />
      </View>

      {/* Modals */}
      <PriceAlertsModal visible={showAlerts} onClose={() => setShowAlerts(false)} alerts={priceAlerts} colors={colors} isDark={isDark} language={language}
        onAdd={(a: PriceAlert) => { 
          setPriceAlerts((p) => [a, ...p]); 
          addNotification({ 
            title: language === 'sw' ? '🔔 Arifa Imewekwa' : '🔔 Alert Set', 
            body: language === 'sw' 
              ? `${a.crop} — ikifika ${a.direction === 'above' ? 'zaidi ya' : 'chini ya'} TZS ${fmt(a.threshold)}, utaarifiwa.`
              : `${a.crop} — when price goes ${a.direction === 'above' ? 'above' : 'below'} TZS ${fmt(a.threshold)}, you will be notified.`, 
            type: 'info' 
          }); 
        }}
        onDelete={(id: string) => setPriceAlerts((p) => p.filter((a) => a.id !== id))}
      />
      {offerItem && <MakeOfferModal item={offerItem} onClose={() => setOfferItem(null)} colors={colors} isDark={isDark} addNotification={addNotification} language={language} />}
      <SellListingModal visible={showSell} onClose={() => setShowSell(false)} colors={colors} isDark={isDark} addNotification={addNotification} language={language} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeInDown} style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={language === 'sw' ? 'Nenda Nyuma' : 'Go back'}
          >
            <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={[styles.iconButton, { borderColor: colors.border }]}>
              <ChevronLeft size={24} color={colors.text} />
            </BlurView>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {language === 'sw' ? 'Soko & Intel' : 'Market & Intel'}
            </Text>
            <View style={styles.locationContainer}>
              <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.locationText, { color: colors.textMute }]}>EAST AFRICA FEED</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => { Haptics.selectionAsync(); setShowAlerts(true); }}
            accessibilityRole="button"
            accessibilityLabel={language === 'sw' ? 'Arifa za bei' : 'Price alerts'}
          >
            <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={[styles.iconButton, { borderColor: colors.border }]}>
              <Bell size={20} color={colors.text} />
              {priceAlerts.length > 0 && <View style={[styles.notifDot, { backgroundColor: colors.error }]} />}
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false} onScroll={(e) => { const y = e.nativeEvent.contentOffset.y; if (y > 40 && !scrolled) setScrolled(true); if (y <= 40 && scrolled) setScrolled(false); }}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          contentContainerStyle={styles.scrollContent}
          stickyHeaderIndices={[1]}
        >
          {/* Search */}
          <Animated.View style={[styles.searchContainer, searchFocused && styles.searchContainerFocused]}>
            <BlurView intensity={isDark ? 25 : 75} tint={isDark ? 'dark' : 'light'} style={[styles.searchBar, { borderColor: searchFocused ? colors.primary : colors.border }]}>
              <Search size={20} color={searchFocused ? colors.primary : colors.textMute} />
              <TextInput
                placeholder={language === 'sw' ? 'Tafuta bidhaa, masoko, mikoa...' : 'Search crops, markets, regions...'}
                placeholderTextColor={colors.textMute}
                style={[styles.searchInput, { color: colors.text }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => { setSearchFocused(true); Haptics.selectionAsync(); }}
                onBlur={() => setSearchFocused(false)}
                accessibilityLabel={language === 'sw' ? 'Tafuta sokoni' : 'Search marketplace'}
              />
              <View style={styles.searchActions}>
                {searchQuery.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => { setSearchQuery(''); Haptics.selectionAsync(); }}
                    accessibilityRole="button"
                    accessibilityLabel="Clear"
                  >
                    <Text style={{ color: colors.textMute, fontWeight: '800', fontSize: 13 }}>✕</Text>
                  </TouchableOpacity>
                ) : searchFocused ? (
                  <TouchableOpacity
                    onPress={() => setSearchFocused(false)}
                    accessibilityRole="button"
                    accessibilityLabel="Done"
                  >
                    <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 13 }}>DONE</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.searchActionBtn}
                    onPress={() => { Haptics.selectionAsync(); Alert.alert(language === 'sw' ? 'Chuja' : 'Sort & Filter', language === 'sw' ? 'Pangilia kwa:' : 'Order by:', [{ text: language === 'sw' ? 'Bei: Juu → Chini' : 'Price: High → Low', onPress: () => {} }, { text: language === 'sw' ? 'Bei: Chini → Juu' : 'Price: Low → High', onPress: () => {} }, { text: language === 'sw' ? 'Ghairi' : 'Cancel', style: 'cancel' }]); }}
                    accessibilityRole="button"
                    accessibilityLabel="Filter menu"
                  >
                    <Filter size={18} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </BlurView>
          </Animated.View>

          {/* Categories (sticky) */}
          <View style={styles.stickyCategory}>
            <ScrollView showsVerticalScrollIndicator={false} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContent}>
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat.id;
                const label = language === 'sw' ? cat.labelSw : cat.labelEn;
                return (
                  <Animated.View key={cat.id} entering={FadeInDown}>
                    <TouchableOpacity
                      onPress={() => { setActiveCategory(cat.id); Haptics.selectionAsync(); }}
                      accessibilityRole="button"
                      accessibilityLabel={`Category ${label}`}
                      accessibilityState={{ selected: active }}
                    >
                      <BlurView intensity={active ? 0 : (isDark ? 20 : 50)} tint={isDark ? 'dark' : 'light'}
                        style={[styles.categoryPill, active ? { backgroundColor: colors.primary, borderColor: colors.primary, borderWidth: 1 } : { borderColor: colors.border, borderWidth: 1 }]}>
                        {React.cloneElement(cat.icon as any, { color: active ? '#FFFFFF' : colors.textMute })}
                        <Text style={[styles.categoryText, active ? { color: '#FFFFFF', fontFamily: 'Inter_800ExtraBold' } : { color: colors.textMute }]}>{label}</Text>
                      </BlurView>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
              {/* UZA pill */}
              <Animated.View entering={FadeInDown}>
                <TouchableOpacity
                  onPress={() => { setShowSell(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
                  accessibilityRole="button"
                  accessibilityLabel="Sell crops"
                >
                  <View style={[styles.categoryPill, { backgroundColor: colors.primary, borderColor: colors.primary, borderWidth: 1 }]}>
                    <Tag size={14} color="#FFFFFF" />
                    <Text style={[styles.categoryText, { color: '#FFFFFF', fontFamily: 'Inter_800ExtraBold' }]}>
                      {language === 'sw' ? 'UZA MAZAO' : 'SELL CROPS'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          </View>

          {/* Intelligence bento */}
          <IntelligenceBento isDark={isDark} colors={colors} router={router} language={language} />

          {/* Market data */}
          <View style={styles.sectionHeader}>
            <BarChart3 size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {language === 'sw' ? 'Bei za Moja kwa Moja' : 'Live Market Feed'}
            </Text>
            <Text style={[{ color: colors.textMute, fontFamily: 'Inter_500Medium', fontSize: 11, marginLeft: 'auto' }]}>
              {language === 'sw' ? `Leo · Bidhaa ${filtered.length}` : `Today · ${filtered.length} listings`}
            </Text>
          </View>

          <View style={styles.marketGrid}>
            {filtered.map((item) => {
              const isExpanded = expandedId === item.id;
              const sparkData = [40, 45, 42, 48, 52, 50, 58, 62, 60, 65].map((v) => item.positive ? v : 100 - v);
              const itemName = language === 'sw' ? item.nameSw : item.nameEn;
              const itemUnit = language === 'sw' ? item.unitSw : item.unitEn;
              const itemVol = language === 'sw' ? item.volatilitySw : item.volatilityEn;
              const itemOutlook = language === 'sw' ? item.outlookSw : item.outlookEn;
              const itemDemand = language === 'sw' ? item.demandSw : item.demandEn;

              return (
                <Animated.View key={item.id} entering={FadeInDown}>
                  <TouchableOpacity
                    onPress={() => { setExpandedId(isExpanded ? null : item.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                    activeOpacity={0.9}
                    accessibilityRole="button"
                    accessibilityLabel={`${itemName} at ${item.market}. Price is TZS ${fmt(item.priceNum)} per ${itemUnit}.`}
                    accessibilityState={{ expanded: isExpanded }}
                  >
                    <BlurView intensity={isDark ? 20 : 60} tint={isDark ? 'dark' : 'light'}
                      style={[styles.premiumCard, { borderColor: colors.border }, isExpanded && { borderColor: colors.primary + '40', borderWidth: 2 }]}>
                      <View style={styles.cardHeader}>
                        <View style={[styles.emojiContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                          <Text style={styles.cardEmoji}>{item.emoji}</Text>
                        </View>
                        <View style={styles.cardMeta}>
                          <Text style={[styles.itemName, { color: colors.text }]}>{itemName}</Text>
                          <Text style={[styles.itemMarket, { color: colors.textMute }]}>{item.market} · {item.region}</Text>
                        </View>
                        <View style={[styles.volatilityBadge, { backgroundColor: item.volatilitySw === 'High' || item.volatilityEn === 'High' ? colors.error + '15' : colors.success + '15' }]}>
                          <Text style={[styles.volatilityText, { color: item.volatilitySw === 'High' || item.volatilityEn === 'High' ? colors.error : colors.success }]}>
                            {itemVol}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.cardBody}>
                        <View style={styles.priceContainer}>
                          <Text style={[styles.priceLabel, { color: colors.textMute }]}>
                            {language === 'sw' ? 'Wastani wa Bei' : 'Average Price'}
                          </Text>
                          <Text style={[styles.priceBig, { color: colors.text }]}>TZS {fmt(item.priceNum)}</Text>
                        </View>
                        <View style={styles.trendArea}>
                          <NeuralSparkline data={sparkData} positive={item.positive} />
                          <View style={[styles.trendPill, { backgroundColor: item.positive ? colors.success + '20' : colors.error + '20' }]}>
                            {item.positive ? <TrendingUp size={12} color={colors.success} /> : <TrendingDown size={12} color={colors.error} />}
                            <Text style={[styles.trendPercent, { color: item.positive ? colors.success : colors.error }]}>{item.trend}</Text>
                          </View>
                        </View>
                      </View>

                      {isExpanded && (
                        <Animated.View entering={FadeInDown} style={styles.expandedContent}>
                          <View style={[styles.intelDivider, { backgroundColor: colors.border }]} />
                          <View style={styles.analysisRow}>
                            <View style={styles.analysisItem}>
                              <Text style={[styles.analysisLabel, { color: colors.textMute }]}>AI Outlook</Text>
                              <View style={styles.outlookBadge}>
                                <Sparkles size={12} color={colors.primary} />
                                <Text style={[styles.outlookText, { color: colors.primary }]}>{itemOutlook}</Text>
                              </View>
                            </View>
                            <View style={styles.analysisItem}>
                              <Text style={[styles.analysisLabel, { color: colors.textMute }]}>
                                {language === 'sw' ? 'Mahitaji' : 'Demand'}
                              </Text>
                              <Text style={[styles.analysisValue, { color: colors.text }]}>{itemDemand}</Text>
                            </View>
                            <View style={styles.analysisItem}>
                              <Text style={[styles.analysisLabel, { color: colors.textMute }]}>
                                {language === 'sw' ? 'Kipimo' : 'Unit'}
                              </Text>
                              <Text style={[styles.analysisValue, { color: colors.text }]}>{itemUnit}</Text>
                            </View>
                          </View>
                          <View style={styles.actionGrid}>
                            <TouchableOpacity
                              style={[styles.contractBtn, { backgroundColor: colors.primary }]}
                              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setExpandedId(null); setOfferItem(item); }}
                              accessibilityRole="button"
                              accessibilityLabel={`Make offer on ${itemName}`}
                            >
                              <Wallet size={16} color="#000" />
                              <Text style={[styles.contractBtnText, { color: '#000' }]}>
                                {language === 'sw' ? 'Toa Ofa' : 'Make Offer'}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.contractBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/contracts'); }}
                              accessibilityRole="button"
                              accessibilityLabel="View Smart Contracts"
                            >
                              <FileSignature size={16} color={colors.text} />
                              <Text style={[styles.contractBtnText, { color: colors.text }]}>Smart Contract</Text>
                            </TouchableOpacity>
                          </View>
                        </Animated.View>
                      )}

                      {!isExpanded && (
                        <View style={[styles.cardFooter, { borderColor: colors.border }]}>
                          <Text style={[styles.unitLabel, { color: colors.textMute }]}>{itemUnit}</Text>
                          <TouchableOpacity
                            style={styles.cardDetailBtn}
                            onPress={(e) => { e.stopPropagation?.(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setOfferItem(item); }}
                            accessibilityRole="button"
                            accessibilityLabel={`Make offer on ${itemName}`}
                          >
                            <Text style={[styles.detailBtnText, { color: colors.primary }]}>
                              {language === 'sw' ? 'Toa Ofa' : 'Make Offer'}
                            </Text>
                            <ArrowRight size={14} color={colors.primary} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </BlurView>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Sell FAB */}
        <Animated.View entering={FadeInDown} style={styles.fab}>
          <TouchableOpacity
            onPress={() => { setShowSell(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); }}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={language === 'sw' ? 'Uza mazao' : 'Sell crops'}
          >
            <LinearGradient colors={[colors.success, colors.primaryDark]} style={styles.fabGrad}>
              <Package size={20} color="#fff" />
              <Text style={styles.fabText}>
                {language === 'sw' ? 'UZA' : 'SELL'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
    </RequireVerification>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  bgOrb: { position: 'absolute' },
  bgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: SCREEN_HEIGHT },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, zIndex: 100 },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 24, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -1 },
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
  bentoContainer: { flexDirection: 'row', gap: 16, marginBottom: 32, height: 230 },
  bentoMain: { flex: 1.5, borderRadius: 28, padding: 20, borderWidth: 1, overflow: 'hidden', justifyContent: 'space-between' },
  bentoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  intelBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(26, 59, 20, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  intelBadgeText: { fontSize: 9, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: 0.5 },
  bentoTitle: { fontSize: 18, fontFamily: 'Inter_800ExtraBold', marginTop: 12, marginBottom: 4 },
  bentoDesc: { fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 20 },
  bentoFooter: { marginTop: 16 },
  bentoAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 16, gap: 8 },
  bentoActionText: { color: '#FCFBF7', fontSize: 13, fontFamily: 'Inter_800ExtraBold' },
  bentoSidebar: { flex: 1, gap: 16 },
  bentoSmall: { flex: 1, borderRadius: 24, padding: 16, borderWidth: 1, overflow: 'hidden', justifyContent: 'center' },
  bentoSmallTitle: { fontSize: 20, fontFamily: 'InstrumentSerif_400Regular', marginTop: 8, marginBottom: 2 },
  bentoSmallDesc: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.5 },
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
  priceBig: { fontSize: 24, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -1 },
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
  outlookBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(26, 59, 20, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  outlookText: { fontSize: 10, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: 0.5 },
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
  fabText: { color: '#fff', fontFamily: 'InstrumentSerif_400Regular', fontSize: 14, letterSpacing: 0.5 },
});

const pm = StyleSheet.create({
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 16, maxHeight: '88%' },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  title: { fontSize: 18, fontFamily: 'InstrumentSerif_400Regular' },
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
