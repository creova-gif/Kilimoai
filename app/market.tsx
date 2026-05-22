import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  RefreshControl,
  Pressable
} from 'react-native';
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { 
  Globe, 
  Database, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  BarChart3, 
  Activity,
  ArrowUpRight,
  Sparkles,
  Cpu,
  MessageCircle,
  ShoppingBag,
  Leaf,
  Mic,
  Search,
  ChevronLeft,
  Bell,
  Filter,
  MapPin,
  ArrowRight,
  Info,
  Layers,
  FileSignature,
  Wallet
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MARKET_DATA = [
  { id: '1', name: 'Mahindi (Meupe)', price: 'TZS 85,000', unit: '100kg Bag', trend: '+2.4%', positive: true, market: 'Tandale Market', emoji: '🌽', volatility: 'Low', demand: 'High', outlook: 'Bullish' },
  { id: '2', name: 'Mchele (Daraja A)', price: 'TZS 120,000', unit: '100kg Bag', trend: '-1.2%', positive: false, market: 'Mbagala Market', emoji: '🌾', volatility: 'Medium', demand: 'Stable', outlook: 'Neutral' },
  { id: '3', name: 'Soya (Beans)', price: 'TZS 210,000', unit: '100kg Bag', trend: '+0.8%', positive: true, market: 'Kariakoo Market', emoji: '🫘', volatility: 'Low', demand: 'High', outlook: 'Bullish' },
  { id: '4', name: 'Vitunguu (Vyekundu)', price: 'TZS 45,000', unit: 'Net', trend: '+5.1%', positive: true, market: 'Tandale Market', emoji: '🧅', volatility: 'High', demand: 'Surging', outlook: 'Volatile' },
];

const CATEGORIES = [
  { name: 'Yote (All)', icon: <Layers size={14} /> },
  { name: 'Nafaka (Grains)', icon: <Leaf size={14} /> },
  { name: 'Mboga (Veg)', icon: <ShoppingBag size={14} /> },
  { name: 'Inayovuma', icon: <TrendingUp size={14} /> },
];

// Cinematic Background Component
const NeuralOrb = ({ color, size, delay, x, y, duration = 20, scrolled }: any) => {
  return (
    <motion.View
      initial={{ x, y, opacity: 0, scale: 0.8 }}
      animate={{ 
        x: [x, x + 60, x - 40, x],
        y: [y, y - 80, y + 60, y],
        opacity: scrolled ? [0.05, 0.1, 0.08, 0.05] : [0.1, 0.2, 0.15, 0.1],
        scale: scrolled ? [0.8, 1, 0.9, 0.8] : [1, 1.15, 0.95, 1]
      }}
      transition={{
        duration: duration + delay / 1000,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={[
        styles.bgOrb,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          filter: Platform.OS === 'web' ? 'blur(120px)' : undefined,
        },
      ]}
    />
  );
};

// Agentic Intelligence Bento
const IntelligenceBento = ({ isDark, colors }: any) => {
  return (
    <View style={styles.bentoContainer}>
      <motion.View 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        style={[styles.bentoMain, { borderColor: colors.border }]}
      >
        <BlurView intensity={isDark ? 25 : 85} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={isDark 
            ? ['rgba(62, 207, 142, 0.15)', 'rgba(15, 23, 42, 0.9)'] 
            : ['rgba(62, 207, 142, 0.1)', 'rgba(255, 255, 255, 0.9)']}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.bentoHeader}>
          <View style={styles.intelBadge}>
            <Cpu size={14} color={colors.primary} />
            <Text style={[styles.intelBadgeText, { color: colors.primary }]}>AI ENGINE V4.5</Text>
          </View>
          <motion.View animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
            <Sparkles size={20} color={colors.primary} opacity={0.6} />
          </motion.View>
        </View>

        <Text style={[styles.bentoTitle, { color: colors.text }]}>Tahadhari ya Soko</Text>
        <Text style={[styles.bentoDesc, { color: colors.textMute }]}>
          Mbeya supply route showing <Text style={{ color: colors.primary, fontWeight: '700' }}>15% latency</Text>. Maize pricing impact expected in <Text style={{ fontWeight: '700' }}>48h</Text>.
        </Text>
        
        <View style={styles.bentoFooter}>
          <TouchableOpacity style={[styles.bentoAction, { backgroundColor: colors.primary }]} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/map' as any); }}>
            <Text style={styles.bentoActionText}>Analyze Route</Text>
            <ArrowUpRight size={14} color="#000" />
          </TouchableOpacity>
        </View>
      </motion.View>

      <View style={styles.bentoSidebar}>
        <motion.View 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, type: "spring" }}
          style={[styles.bentoSmall, { borderColor: colors.border }]}
        >
          <BlurView intensity={isDark ? 20 : 60} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
          <TrendingUp size={20} color={colors.primary} />
          <Text style={[styles.bentoSmallTitle, { color: colors.text }]}>+2.4%</Text>
          <Text style={[styles.bentoSmallDesc, { color: colors.textMute }]}>Maize Index</Text>
        </motion.View>

        <motion.View 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          style={[styles.bentoSmall, { borderColor: colors.border, backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)' }]}
        >
          <BlurView intensity={isDark ? 20 : 60} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
          <Activity size={20} color="#3b82f6" />
          <Text style={[styles.bentoSmallTitle, { color: colors.text }]}>Imara</Text>
          <Text style={[styles.bentoSmallDesc, { color: colors.textMute }]}>Market Volatility</Text>
        </motion.View>
      </View>
    </View>
  );
};

// Premium Sparkline 
const NeuralSparkline = ({ data, positive }: any) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  return (
    <View style={styles.sparklineOuter}>
      {data.map((val: number, i: number) => {
        const height = ((val - min) / range) * 30 + 5;
        return (
          <motion.View
            key={i}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.05, type: "spring", damping: 15 }}
            style={[
              styles.sparkBar,
              { 
                backgroundColor: positive ? '#10b981' : '#ef4444',
                opacity: 0.3 + (i / data.length) * 0.7
              }
            ]}
          />
        );
      })}
    </View>
  );
};

export default function MarketScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Yote (All)');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Background Motion System */}
      <View style={StyleSheet.absoluteFill}>
        <NeuralOrb color={colors.primary} size={500} x={-150} y={50} delay={0} scrolled={scrolled} />
        <NeuralOrb color="#f59e0b" size={350} x={SCREEN_WIDTH / 2} y={350} delay={3000} scrolled={scrolled} />
        
        <LinearGradient
          colors={[
            isDark ? colors.slate[950] : '#ffffff',
            isDark ? colors.slate[950] + 'ee' : '#ffffff' + 'ee',
            'transparent'
          ]}
          style={styles.bgOverlay}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <motion.View 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <BlurView intensity={isDark ? 30 : 60} tint={isDark ? "dark" : "light"} style={[styles.iconButton, { borderColor: colors.border }]}>
              <ChevronLeft size={24} color={colors.text} />
            </BlurView>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Soko & Intel</Text>
            <View style={styles.locationContainer}>
              <View style={[styles.statusDot, { backgroundColor: '#10b981' }]} />
              <Text style={[styles.locationText, { color: colors.textMute }]}>EAST AFRICA FEED</Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.7} onPress={() => Haptics.selectionAsync()}>
            <BlurView intensity={isDark ? 30 : 60} tint={isDark ? "dark" : "light"} style={[styles.iconButton, { borderColor: colors.border }]}>
              <Bell size={20} color={colors.text} />
              <View style={[styles.notifDot, { backgroundColor: '#ef4444' }]} />
            </BlurView>
          </TouchableOpacity>
        </motion.View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          onScroll={(e) => {
            const y = e.nativeEvent.contentOffset.y;
            if (y > 40 && !scrolled) setScrolled(true);
            if (y <= 40 && scrolled) setScrolled(false);
          }}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          contentContainerStyle={styles.scrollContent}
          stickyHeaderIndices={[1]}
        >
          {/* Morphing Search Bar */}
          <motion.View 
            layout
            style={[styles.searchContainer, searchFocused && styles.searchContainerFocused]}
          >
            <BlurView 
              intensity={isDark ? 25 : 75} 
              tint={isDark ? "dark" : "light"} 
              style={[styles.searchBar, { borderColor: searchFocused ? colors.primary : colors.border }]}
            >
              <Search size={20} color={searchFocused ? colors.primary : colors.textMute} />
              <TextInput 
                placeholder="Tafuta bidhaa, masoko..." 
                placeholderTextColor={colors.textMute}
                style={[styles.searchInput, { color: colors.text }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => { setSearchFocused(true); Haptics.selectionAsync(); }}
                onBlur={() => setSearchFocused(false)}
              />
              <View style={styles.searchActions}>
                {searchQuery.length > 0 ? (
                  <TouchableOpacity onPress={() => { setSearchQuery(''); Haptics.selectionAsync(); }}>
                    <Text style={{ color: colors.textMute, fontWeight: '800', fontSize: 13 }}>✕</Text>
                  </TouchableOpacity>
                ) : searchFocused ? (
                  <TouchableOpacity onPress={() => setSearchFocused(false)}>
                    <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 13 }}>DONE</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.searchActionBtn} onPress={() => {
                    Haptics.selectionAsync();
                    Alert.alert('Chuja (Filter)', 'Chagua mpangilio', [
                      { text: 'Bei: Juu → Chini', onPress: () => {} },
                      { text: 'Bei: Chini → Juu', onPress: () => {} },
                      { text: 'Hifadhi ya Karibu', onPress: () => {} },
                      { text: 'Ghairi', style: 'cancel' },
                    ]);
                  }}>
                    <Filter size={18} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </BlurView>
          </motion.View>

          {/* Sticky Categories */}
          <View style={styles.stickyCategory}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContent}>
              {CATEGORIES.map((cat, idx) => (
                <motion.View 
                  key={cat.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <TouchableOpacity onPress={() => { setActiveCategory(cat.name); Haptics.selectionAsync(); }}>
                    <BlurView 
                      intensity={activeCategory === cat.name ? 0 : (isDark ? 20 : 50)} 
                      tint={isDark ? "dark" : "light"} 
                      style={[
                        styles.categoryPill, 
                        activeCategory === cat.name ? { backgroundColor: colors.primary } : { borderColor: colors.border, borderWidth: 1 }
                      ]}
                    >
                      {React.cloneElement(cat.icon as React.ReactElement, { color: activeCategory === cat.name ? '#000' : colors.textMute })}
                      <Text style={[styles.categoryText, activeCategory === cat.name ? { color: '#000', fontFamily: 'Inter_800ExtraBold' } : { color: colors.textMute }]}>
                        {cat.name}
                      </Text>
                    </BlurView>
                  </TouchableOpacity>
                </motion.View>
              ))}
            </ScrollView>
          </View>

          {/* Agentic Intelligence Layer */}
          <IntelligenceBento isDark={isDark} colors={colors} />

          {/* Market Data */}
          <View style={styles.sectionHeader}>
            <BarChart3 size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Bei za Moja kwa Moja</Text>
          </View>

          <View style={styles.marketGrid}>
            {MARKET_DATA.filter((item) => {
              const catMatch = activeCategory === 'Yote (All)' || item.category === activeCategory;
              const qMatch = !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.region.toLowerCase().includes(searchQuery.toLowerCase());
              return catMatch && qMatch;
            }).map((item, idx) => {
              const isExpanded = expandedId === item.id;
              return (
                <motion.View 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  layout
                >
                  <TouchableOpacity onPress={() => toggleExpand(item.id)} activeOpacity={0.9}>
                    <BlurView intensity={isDark ? 20 : 60} tint={isDark ? "dark" : "light"} style={[
                      styles.premiumCard, 
                      { borderColor: colors.border },
                      isExpanded && { borderColor: colors.primary + '40', borderWidth: 2 }
                    ]}>
                      
                      <View style={styles.cardHeader}>
                        <View style={[styles.emojiContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                          <Text style={styles.cardEmoji}>{item.emoji}</Text>
                        </View>
                        <View style={styles.cardMeta}>
                          <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                          <Text style={[styles.itemMarket, { color: colors.textMute }]}>{item.market}</Text>
                        </View>
                        <View style={[styles.volatilityBadge, { backgroundColor: item.volatility === 'High' ? '#ef444415' : '#10b98115' }]}>
                          <Text style={[styles.volatilityText, { color: item.volatility === 'High' ? '#ef4444' : '#10b981' }]}>{item.volatility}</Text>
                        </View>
                      </View>

                      <View style={styles.cardBody}>
                        <View style={styles.priceContainer}>
                          <Text style={[styles.priceLabel, { color: colors.textMute }]}>Wastani wa Bei</Text>
                          <Text style={[styles.priceBig, { color: colors.text }]}>{item.price}</Text>
                        </View>
                        
                        <View style={styles.trendArea}>
                          <NeuralSparkline 
                            data={[40, 45, 42, 48, 52, 50, 58, 62, 60, 65].map(v => item.positive ? v : 100 - v)} 
                            positive={item.positive} 
                          />
                          <View style={[styles.trendPill, { backgroundColor: item.positive ? '#10b98120' : '#ef444420' }]}>
                            {item.positive ? <TrendingUp size={12} color="#10b981" /> : <TrendingDown size={12} color="#ef4444" />}
                            <Text style={[styles.trendPercent, { color: item.positive ? '#10b981' : '#ef4444' }]}>{item.trend}</Text>
                          </View>
                        </View>
                      </View>

                      {/* Smart Contract / Escrow Flow Expansion */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.View
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={styles.expandedContent}
                          >
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
                                <Text style={[styles.analysisLabel, { color: colors.textMute }]}>Demand</Text>
                                <Text style={[styles.analysisValue, { color: colors.text }]}>{item.demand}</Text>
                              </View>
                            </View>

                            <View style={styles.actionGrid}>
                              <TouchableOpacity
                                style={[styles.contractBtn, { backgroundColor: colors.primary }]}
                                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/wallet-admin' as any); }}
                              >
                                <Wallet size={16} color="#000" />
                                <Text style={[styles.contractBtnText, { color: '#000' }]}>Buy via Escrow</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[styles.contractBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/contracts' as any); }}
                              >
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
                          <TouchableOpacity
                            style={styles.cardDetailBtn}
                            onPress={(e) => {
                              e.stopPropagation?.();
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                              router.push('/wallet-admin' as any);
                            }}
                          >
                            <Text style={[styles.detailBtnText, { color: colors.primary }]}>Fanya Biashara</Text>
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
          <View style={{ height: 100 }} />
        </ScrollView>
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
  notifDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: '#000' },
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
  intelBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(62, 207, 142, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
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
  outlookBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(62, 207, 142, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  outlookText: { fontSize: 10, fontFamily: 'Inter_900Black', letterSpacing: 0.5 },
  analysisValue: { fontSize: 14, fontFamily: 'Inter_800ExtraBold' },
  actionGrid: { flexDirection: 'row', gap: 12 },
  contractBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, gap: 8 },
  contractBtnText: { fontSize: 13, fontFamily: 'Inter_800ExtraBold' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1 },
  unitLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  cardDetailBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailBtnText: { fontSize: 12, fontFamily: 'Inter_800ExtraBold' },
  aiAssistantContainer: { position: 'absolute', bottom: 32, right: 24, zIndex: 100 },
  aiAssistantBubble: { width: 64, height: 64, borderRadius: 32, padding: 4, overflow: 'hidden' },
  aiAssistantIcon: { flex: 1, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  aiPulse: { position: 'absolute', width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#fff' }
});
