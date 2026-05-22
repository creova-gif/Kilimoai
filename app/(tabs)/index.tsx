import React, { useState, useCallback, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Platform,
  Image,
  Pressable,
} from 'react-native';
import { 
  BrainCircuit, 
  Camera, 
  TrendingUp, 
  Bell, 
  LayoutGrid,
  Sparkles,
  Leaf,
  Droplets,
  Sun,
  Microscope,
  BarChart3,
  Waves,
  Fingerprint,
  ArrowUpRight,
  ArrowDownLeft,
  WifiOff,
  ArrowRight,
  CloudOff,
  RefreshCw
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../constants/Theme';
import { motion, AnimatePresence } from "motion/react";
import { useKilimoStore } from '../../store/useKilimoStore';
import { generateRecommendations, severityColor } from '../../lib/recommendations';
import { Lightbulb } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Background Orb Component
const NeuralOrb = ({ color, size, delay, x, y }: any) => {
  return (
    <motion.View
      initial={{ x, y, opacity: 0, scale: 0.8 }}
      animate={{ 
        x: [x, x + 50, x - 30, x],
        y: [y, y - 60, y + 40, y],
        opacity: [0.1, 0.2, 0.15, 0.1],
        scale: [1, 1.15, 0.95, 1]
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
          filter: Platform.OS === 'web' ? 'blur(100px)' : undefined,
        },
      ]}
    />
  );
};

const INITIAL_ACTIVITIES = [
  { id: '1', title: 'Soil Scan Complete', route: '/scan', time: '2h ago', icon: <Microscope size={16} color="#3ecf8e" />, status: 'Optimal', detail: 'Nitrogen levels at 92%' },
  { id: '2', title: 'Irrigation Scheduled', route: '/tasks', time: '4h ago', icon: <Waves size={16} color="#3b82f6" />, status: 'Pending', detail: 'Block B - 05:00 AM' },
  { id: '3', title: 'Market Price Alert', route: '/market', time: '6h ago', icon: <BarChart3 size={16} color="#f59e0b" />, status: 'High', detail: 'Maize up 12% in Mbeya' },
];

const QUICK_ACTIONS = [
  { id: 'scan', label: 'Uchunguzi wa Mazao', icon: <Camera size={24} color="#fff" />, color: '#3ecf8e', desc: 'AI Crop Scan' },
  { id: 'tasks', label: 'Usimamizi', icon: <LayoutGrid size={24} color="#fff" />, color: '#3b82f6', desc: 'Farm Tasks' },
  { id: 'market', label: 'Soko', icon: <TrendingUp size={24} color="#fff" />, color: '#f59e0b', desc: 'Market Prices' },
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
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 120 }
  }
};

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  // ── Live global state ────────────────────────────────────────────────────
  const agroId = useKilimoStore((s) => s.agroId);
  const isOffline = useKilimoStore((s) => s.isOffline);
  const syncQueue = useKilimoStore((s) => s.syncQueue);
  const farmVitals = useKilimoStore((s) => s.farmVitals);
  const wallet = useKilimoStore((s) => s.wallet);
  const unreadCount = useKilimoStore((s) => s.unreadCount);
  const farmProfile = useKilimoStore((s) => s.farmProfile);
  const language = useKilimoStore((s) => s.language);

  // AI-06 — personalized recommendations (≥3, refreshed on profile/vitals change)
  const recommendations = React.useMemo(
    () => generateRecommendations({ profile: farmProfile, vitals: farmVitals, language }),
    [farmProfile, farmVitals, language]
  );

  // Derive dynamic farm stats from live store
  const FARM_STATS = [
    { id: 'soil', label: 'Soil Health', value: `${farmVitals.soilHealth}%`, icon: <Leaf size={18} color="#3ecf8e" />, color: '#3ecf8e' },
    { id: 'moisture', label: 'Moisture', value: `${farmVitals.moisture}%`, icon: <Droplets size={18} color="#3b82f6" />, color: '#3b82f6' },
    { id: 'weather', label: 'Joto', value: `${farmVitals.temperature}°C`, icon: <Sun size={18} color="#f59e0b" />, color: '#f59e0b' },
    { id: 'yield', label: 'Mavuno', value: `${farmVitals.yieldEstimate}t`, icon: <TrendingUp size={18} color="#8b5cf6" />, color: '#8b5cf6' },
  ];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Premium Background System */}
      <View style={StyleSheet.absoluteFill}>
        <NeuralOrb color={colors.primary} size={400} x={-100} y={100} delay={0} />
        <NeuralOrb color="#3b82f6" size={300} x={SCREEN_WIDTH - 150} y={300} delay={2000} />
        <NeuralOrb color="#f59e0b" size={250} x={SCREEN_WIDTH / 2} y={SCREEN_HEIGHT - 300} delay={4000} />
        
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
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor={colors.primary} 
            />
          }
        >
          <motion.View
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {/* Header Section */}
            <motion.View variants={itemVariants} style={styles.header}>
              <View>
                <View style={[styles.statusBadge, { backgroundColor: isOffline ? 'rgba(239, 68, 68, 0.1)' : 'rgba(62, 207, 142, 0.1)' }]}>
                  <View style={[styles.statusDot, { backgroundColor: isOffline ? '#ef4444' : colors.primary }]} />
                  <Text style={[styles.statusText, { color: isOffline ? '#ef4444' : colors.primary }]}>
                    {isOffline ? `OFFLINE • ${syncQueue.length} IN QUEUE` : 'SYSTEMS OPTIMAL'}
                  </Text>
                </View>
                <Text style={[styles.greeting, { color: colors.textMute }]}>KARIBU TENA,</Text>
                <Text style={[styles.name, { color: colors.text }]}>{agroId?.name?.split(' ')[0] ?? 'Mkulima'}</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/notifications' as any);
                  }}
                  style={styles.actionCircle}
                >
                  <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={styles.circleBlur}>
                    {isOffline ? <WifiOff size={22} color="#ef4444" /> : <Bell size={22} color={colors.text} />}
                    {unreadCount > 0 && !isOffline && (
                      <View style={[styles.notificationDot, styles.notificationBadge]}>
                        <Text style={styles.notificationBadgeText}>
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Text>
                      </View>
                    )}
                  </BlurView>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.avatarContainer, { borderColor: colors.primary + '40' }]}
                  onPress={() => router.push('/(tabs)/profile' as any)}
                >
                  <Image 
                    source={{ uri: agroId?.avatarUrl ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400' }} 
                    style={styles.avatar}
                  />
                </TouchableOpacity>
              </View>
            </motion.View>

            {/* Agro ID & Mobile Money Wallet Card */}
            <motion.View 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={styles.walletContainer}
            >
              <BlurView intensity={isDark ? 30 : 70} tint={isDark ? "dark" : "light"} style={[styles.walletCard, { borderColor: colors.border }]}>
                <LinearGradient
                  colors={isDark ? ['rgba(62, 207, 142, 0.15)', 'rgba(30, 41, 59, 0.4)'] : ['rgba(62, 207, 142, 0.1)', 'rgba(255, 255, 255, 0.8)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                
                <View style={styles.walletHeader}>
                  <View style={styles.agroIdBadge}>
                    <Fingerprint size={14} color={colors.primary} />
                    <Text style={[styles.agroIdText, { color: colors.primary }]}>AGRO ID SECURED</Text>
                  </View>
                  <View style={styles.mobileMoneyTag}>
                    <Text style={styles.mobileMoneyText}>
                      {agroId?.mpesaLinked ? 'M-PESA LINKED' : 'LINK M-PESA'}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.balanceLabel, { color: colors.textMute }]}>Akiba Yako ({wallet.currency})</Text>
                <View style={styles.balanceRow}>
                  <Text style={[styles.balanceAmount, { color: colors.text }]}>
                    {wallet.balanceTZS.toLocaleString()}
                  </Text>
                  <Text style={[styles.balanceDecimals, { color: colors.textMute }]}>.00</Text>
                </View>

                <View style={styles.walletActions}>
                  <TouchableOpacity
                    style={[styles.walletBtn, { backgroundColor: colors.primary }]}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/agro-id' as any); }}
                  >
                    <ArrowDownLeft size={18} color="#000" />
                    <Text style={[styles.walletBtnText, { color: '#000' }]}>Deposit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.walletBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/wallet-admin' as any); }}
                  >
                    <ArrowUpRight size={18} color={colors.text} />
                    <Text style={[styles.walletBtnText, { color: colors.text }]}>Pay Co-op</Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </motion.View>

            {/* Sankofa AI - The Neural Hub */}
            <motion.View 
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <TouchableOpacity 
                activeOpacity={0.95}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  router.push('/sankofa');
                }}
                style={styles.aiHeroContainer}
              >
                <BlurView intensity={isDark ? 30 : 70} tint={isDark ? "dark" : "light"} style={[styles.aiHero, { borderColor: colors.border }]}>
                  <LinearGradient
                    colors={isDark ? ['rgba(30, 41, 59, 0.4)', 'rgba(2, 6, 23, 0.6)'] : ['rgba(255, 255, 255, 0.8)', 'rgba(241, 245, 249, 0.8)']}
                    style={StyleSheet.absoluteFill}
                  />
                  
                  <View style={styles.aiHeroContent}>
                    <View style={styles.aiLeft}>
                      <View style={styles.aiBrainWrapper}>
                        <motion.View 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                          style={styles.aiRotateContainer}
                        >
                          <LinearGradient
                            colors={[colors.primary, '#3b82f6']}
                            style={styles.aiOrbit}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                          />
                        </motion.View>
                        <motion.View 
                          animate={{ 
                            scale: [1, 1.15, 1],
                            shadowOpacity: [0.2, 0.5, 0.2]
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <BlurView intensity={40} tint="dark" style={[styles.aiIconMain, { borderColor: colors.primary + '40' }]}>
                            <BrainCircuit size={32} color={colors.primary} />
                          </BlurView>
                        </motion.View>
                      </View>
                      <motion.View 
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={styles.aiBadge}
                      >
                        <Sparkles size={10} color={colors.primary} />
                        <Text style={styles.aiBadgeText}>SANKOFA AI</Text>
                      </motion.View>
                    </View>
                    
                    <View style={styles.aiRight}>
                      <Text style={[styles.aiTitle, { color: colors.text }]}>Ushauri wa AI</Text>
                      <Text style={[styles.aiMessage, { color: colors.text }]}>
                        "Block B soil moisture is dropping faster than predicted. Suggesting irrigation at 18:00."
                      </Text>
                      <View style={styles.aiActionRow}>
                        <Text style={[styles.aiActionLabel, { color: colors.primary }]}>SOMA ZAIDI</Text>
                        <ArrowRight size={14} color={colors.primary} />
                      </View>
                    </View>
                  </View>
                </BlurView>
              </TouchableOpacity>
            </motion.View>

            {/* Farm Vitale Grid */}
            <motion.View variants={itemVariants} style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Afya ya Shamba</Text>
              <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/analytics' as any); }}>
                <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 13 }}>SENSORS →</Text>
              </TouchableOpacity>
            </motion.View>

            <View style={styles.statsGrid}>
              {FARM_STATS.map((stat, idx) => (
                <motion.View 
                  key={stat.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={styles.statCardContainer}
                >
                  <BlurView intensity={isDark ? 15 : 50} tint={isDark ? "dark" : "light"} style={[styles.statCard, { borderColor: colors.border }]}>
                    <View style={[styles.statIconBg, { backgroundColor: stat.color + '15' }]}>
                      {stat.icon}
                    </View>
                    <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                    <Text style={[styles.statLabel, { color: colors.textMute }]}>{stat.label}</Text>
                    <View style={styles.miniGraph}>
                      {[...Array(5)].map((_, i) => (
                        <motion.View 
                          key={i} 
                          animate={{ height: 10 + Math.random() * 20 }}
                          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.15 }}
                          style={[
                            styles.graphBar, 
                            { 
                              backgroundColor: stat.color,
                              opacity: 0.4 + (i * 0.15)
                            }
                          ]} 
                        />
                      ))}
                    </View>
                  </BlurView>
                </motion.View>
              ))}
            </View>

            {/* Quick Action Matrix */}
            <motion.View variants={itemVariants}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.actionScroll}
                snapToInterval={SCREEN_WIDTH * 0.65 + 16}
                decelerationRate="fast"
              >
                {QUICK_ACTIONS.map((action, idx) => (
                  <TouchableOpacity 
                    key={action.id}
                    activeOpacity={0.9}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      router.push(`/${action.id}` as any);
                    }}
                    style={styles.actionCardWrapper}
                  >
                    <LinearGradient
                      colors={[action.color, action.color + 'dd']}
                      style={styles.actionCard}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.actionIconOuter}>
                        <View style={styles.actionIconInner}>
                          {action.icon}
                        </View>
                      </View>
                      <View>
                        <Text style={styles.actionLabel}>{action.label}</Text>
                        <Text style={styles.actionDesc}>{action.desc}</Text>
                      </View>
                      <View style={styles.actionArrow}>
                        <ArrowRight size={18} color="#fff" />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </motion.View>

            {/* AI-06 — Sankofa AI personalized recommendations */}
            <motion.View variants={itemVariants} style={styles.sectionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Lightbulb size={18} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {language === 'sw' ? 'Mapendekezo ya Sankofa AI' : 'Sankofa AI Recommendations'}
                </Text>
              </View>
              <Text style={{ color: colors.textMute, fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1 }}>
                {recommendations.length} {language === 'sw' ? 'MAPYA' : 'NEW'}
              </Text>
            </motion.View>
            <View style={{ gap: 10, marginBottom: 20 }}>
              {recommendations.map((rec) => {
                const col = severityColor(rec.severity);
                return (
                  <motion.View key={rec.id} variants={itemVariants}>
                    <Pressable
                      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(rec.cta.route as any); }}
                      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
                    >
                      <BlurView intensity={isDark ? 15 : 50} tint={isDark ? 'dark' : 'light'} style={[styles.recCard, { borderColor: col + '40' }]}>
                        <View style={[styles.recBar, { backgroundColor: col }]} />
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <View style={[styles.recDot, { backgroundColor: col }]} />
                            <Text style={[styles.recCat, { color: col }]}>{rec.category.toUpperCase()}</Text>
                          </View>
                          <Text style={[styles.recTitle, { color: colors.text }]}>{rec.title}</Text>
                          <Text style={[styles.recBody, { color: colors.textMute }]}>{rec.body}</Text>
                          <View style={[styles.recCta, { borderColor: col + '50' }]}>
                            <Text style={[styles.recCtaText, { color: col }]}>{rec.cta.label}</Text>
                            <ArrowRight size={12} color={col} />
                          </View>
                        </View>
                      </BlurView>
                    </Pressable>
                  </motion.View>
                );
              })}
            </View>

            {/* Telemetry Feed */}
            <motion.View variants={itemVariants} style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Shughuli za Hivi Karibuni</Text>
              <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActivities([]); }}>
                <Text style={{ color: colors.textMute, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>CLEAR ALL</Text>
              </TouchableOpacity>
            </motion.View>

            <View style={styles.activityList}>
              {activities.length === 0 && (
                <Pressable onPress={() => setActivities(INITIAL_ACTIVITIES)} style={{ alignItems: 'center', paddingVertical: 24 }}>
                  <RefreshCw size={20} color={colors.textMute} />
                  <Text style={{ color: colors.textMute, fontFamily: 'Inter_600SemiBold', fontSize: 12, marginTop: 8 }}>Gonga kurejeza shughuli</Text>
                </Pressable>
              )}
              {activities.map((activity, index) => (
                <motion.View 
                  key={activity.id}
                  variants={itemVariants}
                  layout
                >
                  <Pressable 
                    style={({ pressed }) => [
                      styles.activityItemContainer,
                      { transform: [{ scale: pressed ? 0.98 : 1 }] }
                    ]}
                    onPress={() => { Haptics.selectionAsync(); router.push(activity.route as any); }}
                  >
                    <BlurView intensity={isDark ? 10 : 40} tint={isDark ? "dark" : "light"} style={[styles.activityItem, { borderColor: colors.border }]}>
                      <View style={[styles.activityIconWrapper, { backgroundColor: activity.icon.props.color + '10', borderColor: activity.icon.props.color + '30' }]}>
                        {activity.icon}
                      </View>
                      <View style={styles.activityContent}>
                        <View style={styles.activityHeader}>
                          <Text style={[styles.activityTitle, { color: colors.text }]}>{activity.title}</Text>
                          <Text style={[styles.activityTime, { color: colors.textMute }]}>{activity.time}</Text>
                        </View>
                        <Text style={[styles.activityDetail, { color: colors.textMute }]}>{activity.detail}</Text>
                      </View>
                      <View style={[styles.activityStatusTag, { backgroundColor: isDark ? 'rgba(62, 207, 142, 0.1)' : 'rgba(62, 207, 142, 0.08)' }]}>
                        <Text style={[styles.activityStatusText, { color: colors.primary }]}>{activity.status}</Text>
                      </View>
                    </BlurView>
                  </Pressable>
                </motion.View>
              ))}
            </View>
          </motion.View>

          <View style={{ height: 140 }} />
        </ScrollView>
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
    width: 400,
    height: 400,
    borderRadius: 200,
    filter: 'blur(100px)',
  },
  bgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 12,
  },
  recCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    paddingLeft: 6,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  recBar: { width: 4, borderRadius: 2, alignSelf: 'stretch' },
  recDot: { width: 6, height: 6, borderRadius: 3 },
  recCat: { fontSize: 10, fontFamily: 'Inter_900Black', letterSpacing: 1.5 },
  recTitle: { fontSize: 14, fontFamily: 'Inter_800ExtraBold', marginBottom: 4 },
  recBody: { fontSize: 12, fontFamily: 'Inter_500Medium', lineHeight: 17, marginBottom: 10 },
  recCta: { flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  recCtaText: { fontSize: 11, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.5 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 9,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1,
  },
  greeting: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 2,
    marginBottom: 4,
  },
  name: {
    fontSize: 34,
    fontFamily: 'Inter_900Black',
    letterSpacing: -1.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 12,
  },
  circleBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  walletContainer: {
    marginBottom: 28,
  },
  walletCard: {
    borderRadius: 36,
    padding: 24,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  agroIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(62, 207, 142, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  agroIdText: {
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1,
  },
  mobileMoneyTag: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  mobileMoneyText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'Inter_900Black',
    letterSpacing: 0.5,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  balanceAmount: {
    fontSize: 42,
    fontFamily: 'Inter_900Black',
    letterSpacing: -2,
  },
  balanceDecimals: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  walletActions: {
    flexDirection: 'row',
    gap: 12,
  },
  walletBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 20,
    gap: 8,
  },
  walletBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.5,
  },
  aiHeroContainer: {
    marginBottom: 36,
  },
  aiHero: {
    borderRadius: 36,
    padding: 24,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  aiHeroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiLeft: {
    alignItems: 'center',
    marginRight: 20,
  },
  aiBrainWrapper: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiRotateContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiOrbit: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
    opacity: 0.5,
  },
  aiIconMain: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(62, 207, 142, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  aiBadgeText: {
    color: '#3ecf8e',
    fontSize: 8,
    fontFamily: 'Inter_900Black',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  aiRight: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  aiMessage: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    lineHeight: 18,
    marginBottom: 12,
    opacity: 0.8,
  },
  aiActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiActionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_900Black',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCardContainer: {
    width: (SCREEN_WIDTH - 64) / 2,
    marginBottom: 16,
  },
  statCard: {
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
  },
  statIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    opacity: 0.7,
    marginBottom: 12,
  },
  miniGraph: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  graphBar: {
    width: 6,
    borderRadius: 3,
  },
  actionScroll: {
    paddingRight: 40,
    marginBottom: 36,
    gap: 16,
  },
  actionCardWrapper: {
    width: SCREEN_WIDTH * 0.65,
  },
  actionCard: {
    padding: 24,
    borderRadius: 32,
    height: 160,
    justifyContent: 'space-between',
  },
  actionIconOuter: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 2,
  },
  actionIconInner: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  actionDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  actionArrow: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityList: {
    gap: 12,
  },
  activityItemContainer: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  activityIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  activityContent: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.3,
  },
  activityTime: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    opacity: 0.5,
  },
  activityDetail: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    opacity: 0.6,
  },
  activityStatusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activityStatusText: {
    fontSize: 9,
    fontFamily: 'Inter_900Black',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  notificationBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    top: -4,
    right: -4,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'Inter_900Black',
  },
});
