import React, { useState, useEffect } from 'react';
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
  RefreshControl
} from 'react-native';
import { 
  ChevronLeft, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Filter,
  MapPin,
  ArrowRight,
  Bell,
  ArrowUpRight,
  Sparkles,
  Zap,
  Leaf,
  ShoppingBag,
  Info,
  Mic,
  MessageCircle,
  Cpu,
  BarChart3,
  Layers
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';
import { motion, AnimatePresence } from "motion/react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MARKET_DATA = [
  { id: '1', name: 'Maize (White)', price: 'TZS 85,000', unit: '100kg Bag', trend: '+2.4%', positive: true, market: 'Tandale Market', emoji: '🌽', volatility: 'Low' },
  { id: '2', name: 'Rice (Grade A)', price: 'TZS 120,000', unit: '100kg Bag', trend: '-1.2%', positive: false, market: 'Mbagala Market', emoji: '🌾', volatility: 'Medium' },
  { id: '3', name: 'Beans (Soya)', price: 'TZS 210,000', unit: '100kg Bag', trend: '+0.8%', positive: true, market: 'Kariakoo Market', emoji: '🫘', volatility: 'Low' },
  { id: '4', name: 'Onions (Red)', price: 'TZS 45,000', unit: 'Net', trend: '+5.1%', positive: true, market: 'Tandale Market', emoji: '🧅', volatility: 'High' },
  { id: '5', name: 'Tomatoes', price: 'TZS 35,000', unit: 'Crate', trend: '-3.5%', positive: false, market: 'Kariakoo Market', emoji: '🍅', volatility: 'High' },
  { id: '6', name: 'Potatoes (Round)', price: 'TZS 75,000', unit: 'Sack', trend: '+1.2%', positive: true, market: 'Mbagala Market', emoji: '🥔', volatility: 'Low' },
];

const CATEGORIES = [
  { name: 'All', icon: <Layers size={14} /> },
  { name: 'Grains', icon: <Leaf size={14} /> },
  { name: 'Vegetables', icon: <ShoppingBag size={14} /> },
  { name: 'Trending', icon: <TrendingUp size={14} /> },
  { name: 'Input', icon: <Zap size={14} /> },
];

// Variants for staggered entrance
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 22, stiffness: 120 }
  }
};

// Enhanced Neural Orb Component
const NeuralOrb = ({ color, size, delay, x, y, duration = 20 }: any) => {
  return (
    <motion.View
      initial={{ x, y, opacity: 0, scale: 0.8 }}
      animate={{ 
        x: [x, x + 60, x - 40, x],
        y: [y, y - 80, y + 60, y],
        opacity: [0.08, 0.18, 0.12, 0.08],
        scale: [1, 1.2, 0.9, 1]
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
          filter: Platform.OS === 'web' ? 'blur(100px)' : undefined,
        },
      ]}
    />
  );
};

// Live Intelligence Feed Component
const IntelligenceHero = ({ isDark, colors }: any) => {
  return (
    <motion.View 
      variants={itemVariants}
      style={styles.intelligenceContainer}
    >
      <BlurView intensity={isDark ? 25 : 85} tint={isDark ? "dark" : "light"} style={[styles.intelligenceCard, { borderColor: colors.border }]}>
        <LinearGradient
          colors={isDark 
            ? ['rgba(62, 207, 142, 0.12)', 'rgba(30, 41, 59, 0.6)', 'rgba(15, 23, 42, 0.8)'] 
            : ['rgba(62, 207, 142, 0.08)', 'rgba(255, 255, 255, 0.9)', 'rgba(241, 245, 249, 0.95)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.intelHeader}>
          <View style={styles.intelBadge}>
            <Cpu size={14} color={colors.primary} />
            <Text style={[styles.intelBadgeText, { color: colors.primary }]}>AGENTIC INSIGHT</Text>
          </View>
          <View style={styles.liveBadge}>
            <motion.View 
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={[styles.liveDot, { backgroundColor: '#ef4444' }]} 
            />
            <Text style={[styles.liveText, { color: colors.textMute }]}>LIVE FEED</Text>
          </View>
        </View>

        <View style={styles.intelContent}>
          <Text style={[styles.intelTitle, { color: colors.text }]}>Regional Supply Squeeze Detected</Text>
          <Text style={[styles.intelDescription, { color: colors.textMute }]}>
            AI analysis of transport logs shows a <Text style={{ color: colors.primary, fontWeight: '800' }}>15% slowdown</Text> in Mbeya-Dar corridor. Expect Maize prices to rise by <Text style={{ color: colors.primary, fontWeight: '800' }}>TZS 2,500</Text> per bag within 48h.
          </Text>
        </View>

        <View style={[styles.intelDivider, { backgroundColor: colors.border }]} />

        <View style={styles.intelFooter}>
          <View style={styles.suggestionBox}>
            <Sparkles size={14} color={colors.primary} />
            <Text style={[styles.suggestionText, { color: colors.text }]}>Sourcing Tip: Check Iringa Market</Text>
          </View>
          <TouchableOpacity 
            style={[styles.intelAction, { backgroundColor: colors.primary }]}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <ArrowUpRight size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Scanning Effect Overlay */}
        <motion.View 
          animate={{ translateY: [-100, 300] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={[styles.scanningLine, { backgroundColor: colors.primary, opacity: 0.15 }]}
        />
      </BlurView>
    </motion.View>
  );
};

// Premium Sparkline Component
const NeuralSparkline = ({ data, positive, colors }: any) => {
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
            transition={{ delay: 0.5 + i * 0.05, type: "spring", damping: 15 }}
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
  const { colors, isDark, spacing, radius, shadows } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      setExpandedId(id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Dynamic Background System */}
      <View style={StyleSheet.absoluteFill}>
        <NeuralOrb color={colors.primary} size={500} x={-150} y={100} delay={0} duration={25} />
        <NeuralOrb color="#3b82f6" size={450} x={SCREEN_WIDTH - 200} y={SCREEN_HEIGHT - 400} delay={3000} duration={30} />
        <NeuralOrb color="#f59e0b" size={350} x={SCREEN_WIDTH / 2 - 175} y={400} delay={6000} duration={20} />
        
        <LinearGradient
          colors={[
            isDark ? colors.slate[950] : '#ffffff',
            isDark ? colors.slate[950] + 'f2' : '#ffffff' + 'f2',
            'transparent'
          ]}
          style={styles.bgOverlay}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <motion.View 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          style={{ flex: 1 }}
        >
          {/* Immersive Header */}
          <motion.View variants={itemVariants} style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <BlurView intensity={isDark ? 30 : 60} tint={isDark ? "dark" : "light"} style={[styles.iconButton, { borderColor: colors.border }]}>
                <ChevronLeft size={24} color={colors.text} />
              </BlurView>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Market Intel</Text>
              <View style={styles.locationContainer}>
                <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.locationText, { color: colors.textMute }]}>Tanzania Regional Feed</Text>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.7} onPress={() => Haptics.selectionAsync()}>
              <BlurView intensity={isDark ? 30 : 60} tint={isDark ? "dark" : "light"} style={[styles.iconButton, { borderColor: colors.border }]}>
                <Bell size={20} color={colors.text} />
                <View style={[styles.notifDot, { backgroundColor: colors.error }]} />
              </BlurView>
            </TouchableOpacity>
          </motion.View>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
            contentContainerStyle={styles.scrollContent}
            stickyHeaderIndices={[1]}
          >
            {/* Search Bar */}
            <motion.View variants={itemVariants} style={{ marginBottom: 24 }}>
              <BlurView intensity={isDark ? 20 : 70} tint={isDark ? "dark" : "light"} style={[styles.searchBar, { borderColor: colors.border }]}>
                <Search size={20} color={colors.textMute} />
                <TextInput 
                  placeholder="Analyze commodities..." 
                  placeholderTextColor={colors.textMute}
                  style={[styles.searchInput, { color: colors.text }]}
                />
                <View style={styles.searchActions}>
                  <TouchableOpacity style={styles.searchActionBtn}>
                    <Mic size={18} color={colors.textMute} />
                  </TouchableOpacity>
                  <View style={styles.searchDivider} />
                  <TouchableOpacity style={styles.searchActionBtn}>
                    <Filter size={18} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </BlurView>
            </motion.View>

            {/* Category Filter - Sticky Style */}
            <View style={[styles.stickyCategory, { backgroundColor: isDark ? 'transparent' : 'transparent' }]}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.categoryContent}
              >
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity 
                    key={cat.name}
                    onPress={() => {
                      setActiveCategory(cat.name);
                      Haptics.selectionAsync();
                    }}
                    activeOpacity={0.8}
                  >
                    <BlurView 
                      intensity={activeCategory === cat.name ? 0 : (isDark ? 15 : 40)} 
                      tint={isDark ? "dark" : "light"} 
                      style={[
                        styles.categoryPill, 
                        activeCategory === cat.name 
                          ? { backgroundColor: colors.primary } 
                          : { borderColor: colors.border, borderWidth: 1 }
                      ]}
                    >
                      {cat.icon && React.cloneElement(cat.icon as React.ReactElement, { color: activeCategory === cat.name ? '#fff' : colors.textMute })}
                      <Text style={[styles.categoryText, activeCategory === cat.name ? { color: '#ffffff' } : { color: colors.textMute }]}>
                        {cat.name}
                      </Text>
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Agentic Intelligence Section */}
            <IntelligenceHero isDark={isDark} colors={colors} />

            {/* Market List Section Header */}
            <motion.View variants={itemVariants} style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <BarChart3 size={18} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Live Market Indices</Text>
              </View>
              <TouchableOpacity style={styles.viewToggle}>
                <Text style={[styles.viewToggleText, { color: colors.primary }]}>VOLATILITY</Text>
              </TouchableOpacity>
            </motion.View>

            {/* Redesigned Market Cards */}
            <View style={styles.marketGrid}>
              {MARKET_DATA.map((item, index) => {
                const isExpanded = expandedId === item.id;
                return (
                  <motion.View 
                    key={item.id} 
                    variants={itemVariants}
                    layout
                  >
                    <TouchableOpacity 
                      onPress={() => toggleExpand(item.id)}
                      activeOpacity={0.9}
                    >
                      <BlurView intensity={isDark ? 10 : 50} tint={isDark ? "dark" : "light"} style={[
                        styles.premiumCard, 
                        { borderColor: colors.border },
                        isExpanded && { borderColor: colors.primary + '40', borderWidth: 1.5 }
                      ]}>
                        <View style={styles.cardHeader}>
                          <View style={[styles.emojiContainer, { backgroundColor: isDark ? colors.slate[800] : colors.slate[100] }]}>
                            <Text style={styles.cardEmoji}>{item.emoji}</Text>
                          </View>
                          <View style={styles.cardMeta}>
                            <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                            <Text style={[styles.itemMarket, { color: colors.textMute }]}>{item.market}</Text>
                          </View>
                          <View style={[
                            styles.volatilityBadge, 
                            { backgroundColor: item.volatility === 'High' ? '#ef444415' : '#10b98115' }
                          ]}>
                            <Text style={[styles.volatilityText, { color: item.volatility === 'High' ? '#ef4444' : '#10b981' }]}>
                              {item.volatility}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.cardBody}>
                          <View style={styles.priceContainer}>
                            <Text style={[styles.priceLabel, { color: colors.textMute }]}>Current Avg.</Text>
                            <Text style={[styles.priceBig, { color: colors.text }]}>{item.price}</Text>
                          </View>
                          
                          <View style={styles.trendArea}>
                            <NeuralSparkline 
                              data={[40, 45, 42, 48, 52, 50, 58, 62, 60, 65].map(v => item.positive ? v : 100 - v)} 
                              positive={item.positive}
                              colors={colors}
                            />
                            <View style={[
                              styles.trendPill, 
                              { backgroundColor: item.positive ? '#10b98120' : '#ef444420' }
                            ]}>
                              {item.positive ? <TrendingUp size={12} color="#10b981" /> : <TrendingDown size={12} color="#ef4444" />}
                              <Text style={[styles.trendPercent, { color: item.positive ? '#10b981' : '#ef4444' }]}>{item.trend}</Text>
                            </View>
                          </View>
                        </View>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.View
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              style={styles.expandedContent}
                            >
                              <View style={[styles.intelDivider, { backgroundColor: colors.border, marginVertical: 16 }]} />
                              
                              <View style={styles.analysisRow}>
                                <View style={styles.analysisItem}>
                                  <Text style={[styles.analysisLabel, { color: colors.textMute }]}>Predictive Outlook</Text>
                                  <View style={styles.outlookBadge}>
                                    <Sparkles size={12} color={colors.primary} />
                                    <Text style={[styles.outlookText, { color: colors.primary }]}>BULLISH</Text>
                                  </View>
                                </View>
                                <View style={styles.analysisItem}>
                                  <Text style={[styles.analysisLabel, { color: colors.textMute }]}>Demand Signal</Text>
                                  <Text style={[styles.analysisValue, { color: colors.text }]}>Strong (8.4/10)</Text>
                                </View>
                              </View>

                              <Text style={[styles.agenticQuote, { color: colors.textMute }]}>
                                "Agentic analysis suggests locking in supply now. Logistic bottlenecks are forming in the northern regions."
                              </Text>

                              <TouchableOpacity 
                                style={[styles.fullActionBtn, { backgroundColor: colors.primary }]}
                                onPress={() => router.push('/hub')}
                              >
                                <Text style={styles.fullActionText}>Deep Analysis with Kilimo AI</Text>
                                <Zap size={16} color="#fff" />
                              </TouchableOpacity>
                            </motion.View>
                          )}
                        </AnimatePresence>

                        {!isExpanded && (
                          <View style={[styles.cardFooter, { borderColor: colors.border }]}>
                            <View style={styles.unitBox}>
                              <Info size={12} color={colors.textMute} />
                              <Text style={[styles.unitLabel, { color: colors.textMute }]}>{item.unit}</Text>
                            </View>
                            <View style={styles.cardDetailBtn}>
                              <Text style={[styles.detailBtnText, { color: colors.primary }]}>Analyze</Text>
                              <ArrowRight size={14} color={colors.primary} />
                            </View>
                          </View>
                        )}
                      </BlurView>
                    </TouchableOpacity>
                  </motion.View>
                );
              })}
            </View>

            <View style={{ height: 140 }} />
          </ScrollView>
        </motion.View>
      </SafeAreaView>

      {/* Persistent AI Assistant Bubble */}
      <motion.View 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        style={styles.aiAssistantContainer}
      >
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.push('/hub');
          }}
        >
          <BlurView intensity={80} tint="dark" style={styles.aiAssistantBubble}>
            <LinearGradient
              colors={[colors.primary, '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiAssistantIcon}
            >
              <MessageCircle size={28} color="#fff" />
              <motion.View 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={styles.aiPulse}
              />
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
      </motion.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  bgOrb: {
    position: 'absolute',
  },
  bgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 800,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    letterSpacing: -1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  locationText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    opacity: 0.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  notifDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 68,
    borderRadius: 24,
    paddingHorizontal: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
  },
  searchActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchActionBtn: {
    padding: 8,
  },
  searchDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  stickyCategory: {
    marginBottom: 32,
    marginHorizontal: -24,
    zIndex: 10,
  },
  categoryContent: {
    paddingHorizontal: 24,
    gap: 12,
    paddingBottom: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 18,
    overflow: 'hidden',
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
  },
  intelligenceContainer: {
    marginBottom: 40,
  },
  intelligenceCard: {
    borderRadius: 36,
    padding: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
  },
  intelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  intelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(62, 207, 142, 0.15)',
    gap: 6,
  },
  intelBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveText: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 0.5,
  },
  intelContent: {
    marginBottom: 24,
  },
  intelTitle: {
    fontSize: 28,
    fontFamily: 'Inter_900Black',
    letterSpacing: -1,
    lineHeight: 34,
    marginBottom: 12,
  },
  intelDescription: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    lineHeight: 24,
    opacity: 0.9,
  },
  intelDivider: {
    height: 1,
    width: '100%',
    opacity: 0.1,
    marginBottom: 20,
  },
  intelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  intelAction: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  viewToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewToggleText: {
    fontSize: 11,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.2,
  },
  marketGrid: {
    gap: 16,
  },
  premiumCard: {
    borderRadius: 32,
    padding: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  emojiContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 28,
  },
  cardMeta: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.5,
  },
  itemMarket: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 2,
  },
  volatilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  volatilityText: {
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    textTransform: 'uppercase',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  priceContainer: {
    gap: 4,
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceBig: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  trendContainer: {
    alignItems: 'flex-end',
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  trendPercent: {
    fontSize: 13,
    fontFamily: 'Inter_900Black',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  unitBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unitLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  cardDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_800ExtraBold',
  },
  aiAssistantContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: 24,
    zIndex: 100,
  },
  aiAssistantBubble: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
  },
  aiAssistantIcon: {
    flex: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiPulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  sparklineOuter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 35,
    gap: 2,
    marginRight: 12,
  },
  sparkBar: {
    width: 3,
    borderRadius: 1,
  },
  trendArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedContent: {
    overflow: 'hidden',
  },
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  analysisItem: {
    gap: 6,
  },
  analysisLabel: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  outlookBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(62, 207, 142, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  outlookText: {
    fontSize: 12,
    fontFamily: 'Inter_900Black',
  },
  analysisValue: {
    fontSize: 15,
    fontFamily: 'Inter_800ExtraBold',
  },
  agenticQuote: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold_Italic',
    lineHeight: 20,
    opacity: 0.7,
    marginBottom: 24,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(62, 207, 142, 0.3)',
  },
  fullActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 56,
    borderRadius: 18,
    marginBottom: 8,
  },
  fullActionText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter_800ExtraBold',
  },
});

});
