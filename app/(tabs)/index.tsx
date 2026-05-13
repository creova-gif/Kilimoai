import React, { useState, useEffect } from 'react';
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
  Pressable
} from 'react-native';
import { 
  BrainCircuit, 
  Camera, 
  TrendingUp, 
  Calendar, 
  Bell, 
  ChevronRight,
  CloudSun,
  MapPin,
  ArrowRight,
  Search,
  Activity,
  History,
  LayoutGrid,
  Sparkles,
  Zap,
  Leaf,
  Droplets,
  Sun,
  Microscope,
  Cpu,
  BarChart3,
  Waves
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../constants/Theme';
import { motion, AnimatePresence } from "motion/react";

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

const RECENT_ACTIVITIES = [
  { id: '1', title: 'Soil Scan Complete', time: '2h ago', icon: <Microscope size={16} color="#3ecf8e" />, status: 'Optimal', detail: 'Nitrogen levels at 92%' },
  { id: '2', title: 'Irrigation Scheduled', time: '4h ago', icon: <Waves size={16} color="#3b82f6" />, status: 'Pending', detail: 'Block B - 05:00 AM' },
  { id: '3', title: 'Market Price Alert', time: '6h ago', icon: <BarChart3 size={16} color="#f59e0b" />, status: 'High', detail: 'Maize up 12% in Mbeya' },
];

const FARM_STATS = [
  { id: 'soil', label: 'Soil Health', value: '84%', icon: <Leaf size={18} color="#3ecf8e" />, color: '#3ecf8e' },
  { id: 'moisture', label: 'Moisture', value: '42%', icon: <Droplets size={18} color="#3b82f6" />, color: '#3b82f6' },
  { id: 'weather', label: 'Weather', value: '24°C', icon: <Sun size={18} color="#f59e0b" />, color: '#f59e0b' },
  { id: 'yield', label: 'Yield Est.', value: '1.2t', icon: <TrendingUp size={18} color="#8b5cf6" />, color: '#8b5cf6' },
];

const QUICK_ACTIONS = [
  { id: 'scan', label: 'Vision Scan', icon: <Camera size={24} color="#fff" />, color: '#3ecf8e', desc: 'Analyze crops' },
  { id: 'tasks', label: 'Management', icon: <LayoutGrid size={24} color="#fff" />, color: '#3b82f6', desc: 'Field log' },
  { id: 'market', label: 'Economy', icon: <TrendingUp size={24} color="#fff" />, color: '#f59e0b', desc: 'Price index' },
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
  const { colors, spacing, radius, isDark } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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
                <View style={styles.statusBadge}>
                  <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.statusText, { color: colors.primary }]}>SYSTEMS OPTIMAL</Text>
                </View>
                <Text style={[styles.greeting, { color: colors.textMute }]}>WELCOME BACK,</Text>
                <Text style={[styles.name, { color: colors.text }]}>Justin Mafie</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  style={styles.actionCircle}
                >
                  <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={styles.circleBlur}>
                    <Bell size={22} color={colors.text} />
                    <View style={styles.notificationDot} />
                  </BlurView>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.avatarContainer, { borderColor: colors.primary + '40' }]}
                  onPress={() => router.push('/profile')}
                >
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop' }} 
                    style={styles.avatar}
                  />
                </TouchableOpacity>
              </View>
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
                        <Text style={styles.aiBadgeText}>CORE INTELLIGENCE</Text>
                      </motion.View>
                    </View>
                    
                    <View style={styles.aiRight}>
                      <Text style={[styles.aiTitle, { color: colors.text }]}>Sankofa AI</Text>
                      <Text style={[styles.aiMessage, { color: colors.text }]}>
                        "Block B soil moisture is dropping faster than predicted. Suggesting irrigation at 18:00."
                      </Text>
                      <View style={styles.aiActionRow}>
                        <Text style={[styles.aiActionLabel, { color: colors.primary }]}>VIEW ANALYSIS</Text>
                        <ArrowRight size={14} color={colors.primary} />
                      </View>
                    </View>
                  </View>
                </BlurView>
              </TouchableOpacity>
            </motion.View>

            {/* Farm Vitale Grid */}
            <motion.View variants={itemVariants} style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Farm Vitale</Text>
              <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 13 }}>SENSORS</Text>
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

            {/* Telemetry Feed */}
            <motion.View variants={itemVariants} style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Telemetry Stream</Text>
              <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                <Text style={{ color: colors.textMute, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>CLEAR ALL</Text>
              </TouchableOpacity>
            </motion.View>

            <View style={styles.activityList}>
              {RECENT_ACTIVITIES.map((activity, index) => (
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
                    onPress={() => Haptics.selectionAsync()}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(62, 207, 142, 0.1)',
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
  aiHeroContainer: {
    marginBottom: 36,
  },
  aiHero: {
    borderRadius: 40,
    padding: 28,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
  },
  aiHeroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiLeft: {
    alignItems: 'center',
    marginRight: 24,
  },
  aiBrainWrapper: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiRotateContainer: {
    position: 'absolute',
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiOrbit: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
    opacity: 0.5,
  },
  aiIconMain: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
  },
  aiRight: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 26,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  aiMessage: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.8,
  },
  aiActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiActionLabel: {
    fontSize: 12,
    fontFamily: 'Inter_900Black',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 36,
  },
  statCardContainer: {
    width: (SCREEN_WIDTH - 64) / 2,
    marginBottom: 16,
  },
  statCard: {
    padding: 20,
    borderRadius: 32,
    borderWidth: 1,
    overflow: 'hidden',
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
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
    marginBottom: 40,
    gap: 16,
  },
  actionCardWrapper: {
    width: SCREEN_WIDTH * 0.65,
  },
  actionCard: {
    padding: 24,
    borderRadius: 32,
    height: 180,
    justifyContent: 'space-between',
  },
  actionIconOuter: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 2,
  },
  actionIconInner: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Inter_900Black',
    marginBottom: 4,
  },
  actionDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  actionArrow: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
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
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  activityContent: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  activityTitle: {
    fontSize: 15,
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
    paddingVertical: 5,
    borderRadius: 8,
  },
  activityStatusText: {
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
