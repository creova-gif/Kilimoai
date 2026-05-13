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
  Info
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';
import { motion, AnimatePresence } from "motion/react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MARKET_DATA = [
  { id: '1', name: 'Maize (White)', price: 'TZS 85,000', unit: '100kg Bag', trend: '+2.4%', positive: true, market: 'Tandale Market', emoji: '🌽' },
  { id: '2', name: 'Rice (Grade A)', price: 'TZS 120,000', unit: '100kg Bag', trend: '-1.2%', positive: false, market: 'Mbagala Market', emoji: '🌾' },
  { id: '3', name: 'Beans (Soya)', price: 'TZS 210,000', unit: '100kg Bag', trend: '+0.8%', positive: true, market: 'Kariakoo Market', emoji: '🫘' },
  { id: '4', name: 'Onions (Red)', price: 'TZS 45,000', unit: 'Net', trend: '+5.1%', positive: true, market: 'Tandale Market', emoji: '🧅' },
  { id: '5', name: 'Tomatoes', price: 'TZS 35,000', unit: 'Crate', trend: '-3.5%', positive: false, market: 'Kariakoo Market', emoji: '🍅' },
  { id: '6', name: 'Potatoes (Round)', price: 'TZS 75,000', unit: 'Sack', trend: '+1.2%', positive: true, market: 'Mbagala Market', emoji: '🥔' },
];

// Variants for staggered entrance
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

// Background Orb Component
const NeuralOrb = ({ color, size, delay, x, y }: any) => {
  return (
    <motion.View
      initial={{ x, y, opacity: 0, scale: 0.8 }}
      animate={{ 
        x: [x, x + 45, x - 25, x],
        y: [y, y - 55, y + 35, y],
        opacity: [0.08, 0.15, 0.1, 0.08],
        scale: [1, 1.12, 0.92, 1]
      }}
      transition={{
        duration: 18 + delay / 1000,
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
          filter: Platform.OS === 'web' ? 'blur(90px)' : undefined,
        },
      ]}
    />
  );
};

const itemVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 20, stiffness: 100 }
  }
};

export default function MarketScreen() {
  const { colors, isDark, spacing, radius, shadows } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handlePressItem = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Premium Background System */}
      <View style={StyleSheet.absoluteFill}>
        <NeuralOrb color={colors.primary} size={420} x={-120} y={150} delay={0} />
        <NeuralOrb color="#3b82f6" size={380} x={SCREEN_WIDTH - 150} y={SCREEN_HEIGHT - 350} delay={2000} />
        <NeuralOrb color="#f59e0b" size={280} x={SCREEN_WIDTH / 2} y={350} delay={4000} />
        
        <LinearGradient
          colors={[
            isDark ? colors.slate[950] : '#fff',
            isDark ? colors.slate[900] + 'ee' : colors.slate[50] + 'ee',
            'transparent'
          ]}
          style={styles.bgGradient}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <motion.View 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          style={{ flex: 1 }}
        >
          {/* Header Section */}
          <motion.View variants={itemVariants} style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <BlurView intensity={isDark ? 20 : 40} tint={isDark ? "dark" : "light"} style={[styles.iconButton, { borderColor: colors.border }]}>
                <ChevronLeft size={24} color={colors.text} />
              </BlurView>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Market Intel</Text>
              <View style={styles.locationContainer}>
                <MapPin size={10} color={colors.primary} />
                <Text style={[styles.locationText, { color: colors.textMute }]}>Dar es Salaam, TZ</Text>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => Haptics.selectionAsync()}>
              <BlurView intensity={isDark ? 20 : 40} tint={isDark ? "dark" : "light"} style={[styles.iconButton, { borderColor: colors.border }]}>
                <Bell size={20} color={colors.text} />
              </BlurView>
            </TouchableOpacity>
          </motion.View>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
            contentContainerStyle={styles.scrollContent}
          >
            {/* Modern Search */}
            <motion.View variants={itemVariants}>
              <BlurView intensity={isDark ? 15 : 60} tint={isDark ? "dark" : "light"} style={[styles.searchContainer, { borderColor: colors.border }]}>
                <Search size={18} color={colors.textMute} />
                <TextInput 
                  placeholder="Search commodities..." 
                  placeholderTextColor={colors.textMute}
                  style={[styles.searchInput, { color: colors.text }]}
                />
                <TouchableOpacity style={styles.filterBtn}>
                  <Filter size={18} color={colors.primary} />
                </TouchableOpacity>
              </BlurView>
            </motion.View>

            {/* Category Filters */}
            <motion.View variants={itemVariants}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryContainer}>
                {['Trending', 'Grains', 'Vegetables', 'Fruits', 'Fertilizers'].map((cat, i) => (
                  <TouchableOpacity 
                    key={i} 
                    onPress={() => Haptics.selectionAsync()}
                    activeOpacity={0.7}
                  >
                    <BlurView 
                      intensity={i === 0 ? 0 : (isDark ? 10 : 30)} 
                      tint={isDark ? "dark" : "light"} 
                      style={[
                        styles.categoryPill, 
                        i === 0 
                          ? { backgroundColor: colors.primary } 
                          : { borderColor: colors.border, borderWidth: 1 }
                      ]}
                    >
                      <Text style={[styles.categoryText, i === 0 ? { color: '#ffffff' } : { color: colors.textMute }]}>{cat}</Text>
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </motion.View>

            {/* Premium Insight Card */}
            <motion.View 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <TouchableOpacity activeOpacity={0.9} onPress={handlePressItem}>
                <BlurView intensity={isDark ? 15 : 80} tint={isDark ? "dark" : "light"} style={[styles.trendCard, { borderColor: colors.border }]}>
                  <LinearGradient
                    colors={isDark 
                      ? ['rgba(62, 207, 142, 0.08)', 'rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.6)'] 
                      : ['rgba(62, 207, 142, 0.05)', 'rgba(255, 255, 255, 0.8)', 'rgba(241, 245, 249, 0.9)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  
                  {/* Glowing Edge Effect */}
                  <View style={[styles.glowLine, { backgroundColor: colors.primary, opacity: isDark ? 0.3 : 0.1 }]} />
                  
                  <View style={styles.trendCardHeader}>
                    <motion.View 
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={[styles.premiumBadge, { backgroundColor: colors.primary + '20' }]}
                    >
                      <Sparkles size={12} color={colors.primary} />
                      <Text style={[styles.badgeText, { color: colors.primary }]}>BULLISH SIGNAL</Text>
                    </motion.View>
                    <View style={styles.liveIndicator}>
                      <motion.View 
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={[styles.liveDot, { backgroundColor: colors.primary }]} 
                      />
                      <Text style={[styles.timeText, { color: colors.textMute }]}>Live Analysis</Text>
                    </View>
                  </View>
                  
                  <Text style={[styles.trendTitle, { color: colors.text }]}>Maize prices surging in Mbeya</Text>
                  <Text style={[styles.trendDesc, { color: colors.textMute }]}>Regional logistics delays are tightening supply in Mbeya markets. Sourcing alternatives suggested in Block C.</Text>
                  
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  
                  <View style={styles.trendFooter}>
                    <View style={styles.socialGroup}>
                      <View style={[styles.avatarStack]}>
                        {[1, 2, 3].map(i => (
                          <View key={i} style={[styles.avatar, { backgroundColor: colors.slate[isDark ? 800 : 200], marginLeft: i === 1 ? 0 : -12, borderColor: isDark ? colors.slate[900] : '#fff', borderWidth: 2 }]} />
                        ))}
                      </View>
                      <Text style={[styles.socialText, { color: colors.textMute }]}>+124 watching</Text>
                    </View>
                    <motion.View whileHover={{ x: 5 }} whileTap={{ scale: 0.9 }}>
                      <TouchableOpacity style={[styles.insightAction, { backgroundColor: colors.primary + '20' }]}>
                        <ArrowUpRight size={20} color={colors.primary} />
                      </TouchableOpacity>
                    </motion.View>
                  </View>
                </BlurView>
              </TouchableOpacity>
            </motion.View>

            {/* Market Feed Section */}
            <motion.View variants={itemVariants} style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Regional Price Feed</Text>
              <TouchableOpacity style={styles.viewMoreBtn}>
                <Text style={[styles.viewMoreText, { color: colors.primary }]}>LATEST</Text>
              </TouchableOpacity>
            </motion.View>

            <View style={styles.marketList}>
              {MARKET_DATA.map((item, index) => (
                <motion.View 
                  key={item.id} 
                  variants={itemVariants}
                >
                  <TouchableOpacity 
                    onPress={handlePressItem}
                    activeOpacity={0.8}
                  >
                    <BlurView intensity={isDark ? 8 : 40} tint={isDark ? "dark" : "light"} style={[styles.marketCard, { borderColor: colors.border }]}>
                      <View style={styles.marketCardMain}>
                        <View style={[styles.commodityIcon, { backgroundColor: isDark ? colors.slate[800] : colors.slate[100] }]}>
                          <Text style={styles.commodityEmoji}>{item.emoji}</Text>
                        </View>
                        <View style={styles.commodityInfo}>
                          <Text style={[styles.commodityName, { color: colors.text }]}>{item.name}</Text>
                          <View style={styles.marketSubInfo}>
                            <Text style={[styles.marketName, { color: colors.textMute }]}>{item.market}</Text>
                            <View style={[styles.dot, { backgroundColor: colors.border }]} />
                            <Text style={[styles.unitText, { color: colors.textMute }]}>{item.unit}</Text>
                          </View>
                        </View>
                        <View style={styles.priceSection}>
                          <Text style={[styles.priceValue, { color: colors.text }]}>{item.price.split(' ')[1]}</Text>
                          <View style={[
                            styles.trendBadgeSmall, 
                            { backgroundColor: item.positive ? '#10b98115' : '#ef444415' }
                          ]}>
                            {item.positive ? <TrendingUp size={10} color="#10b981" /> : <TrendingDown size={10} color="#ef4444" />}
                            <Text style={[styles.trendTextSmall, { color: item.positive ? '#10b981' : '#ef4444' }]}>{item.trend}</Text>
                          </View>
                        </View>
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                </motion.View>
              ))}
            </View>

            <View style={{ height: 120 }} />
          </ScrollView>
        </motion.View>
      </SafeAreaView>
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
    filter: Platform.OS === 'web' ? 'blur(90px)' : undefined,
  },
  bgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 700,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    marginLeft: 4,
    opacity: 0.6,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 64,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  filterBtn: {
    padding: 8,
  },
  categoryScroll: {
    marginBottom: 32,
    marginHorizontal: -24,
  },
  categoryContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryPill: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
  },
  trendCard: {
    borderRadius: 40,
    padding: 28,
    marginBottom: 36,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 8,
  },
  glowLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  trendCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.2,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    opacity: 0.6,
  },
  trendTitle: {
    fontSize: 28,
    fontFamily: 'Inter_900Black',
    marginBottom: 12,
    letterSpacing: -1,
  },
  trendDesc: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.8,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 20,
    opacity: 0.05,
  },
  trendFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  socialGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  socialText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    marginLeft: 12,
  },
  insightAction: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.8,
  },
  viewMoreBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewMoreText: {
    fontSize: 11,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1,
  },
  marketList: {
    gap: 16,
  },
  marketCard: {
    borderRadius: 32,
    borderWidth: 1,
    padding: 18,
    overflow: 'hidden',
  },
  marketCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commodityIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commodityEmoji: {
    fontSize: 30,
  },
  commodityInfo: {
    flex: 1,
    marginLeft: 16,
  },
  commodityName: {
    fontSize: 17,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.4,
  },
  marketSubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  marketName: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
    opacity: 0.2,
  },
  unitText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  trendBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  trendTextSmall: {
    fontSize: 10,
    fontFamily: 'Inter_900Black',
  },
});
