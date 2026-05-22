import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Platform,
  StatusBar,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useWeather } from '../../hooks/useWeather';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  CloudLightning,
  MapPin,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Zap,
  ArrowRight,
  Thermometer,
  CloudSun
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../constants/Theme';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Empty-state placeholder shown while the OpenWeather request is in flight or
// when the key isn't configured. Real data comes from useWeather() below.
const EMPTY_FORECAST: Array<{ day: string; date: string; high: number; low: number; condition: string; pop: string; desc: string }> = [];

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

const NeuralOrb = ({ color, size, delay, x, y }: any) => {
  return (
    <motion.View
      initial={{ x, y, opacity: 0, scale: 0.8 }}
      animate={{ 
        x: [x, x + 60, x - 40, x],
        y: [y, y - 80, y + 50, y],
        opacity: [0.1, 0.2, 0.15, 0.1],
        scale: [1, 1.2, 0.9, 1]
      }}
      transition={{
        duration: 15 + delay / 1000,
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

export default function ForecastScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { configured, location, current, forecast, loading, error, errorKind, refetch } = useWeather();
  const forecastDays = forecast ?? EMPTY_FORECAST;

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const errorCopy = React.useMemo(() => {
    if (errorKind === 'unknown_location') {
      return {
        title: 'ENEO HALITAMBULIWI',
        body: `Mfumo haukutambui "${location}". Sahihisha eneo lako kwenye Wasifu.`,
      };
    }
    if (errorKind === 'network') {
      return { title: 'HITILAFU YA MTANDAO', body: 'Hakikisha mtandao unafanya kazi kisha jaribu tena.' };
    }
    return { title: 'HITILAFU', body: 'Imeshindwa kupata data ya hali ya hewa.' };
  }, [errorKind, location]);

  // Localized "today" label, e.g. "LEO, 12 OKT"
  const todayLabel = React.useMemo(() => {
    const d = new Date();
    const months = ['JAN', 'FEB', 'MAC', 'APR', 'MEI', 'JUN', 'JUL', 'AGO', 'SEP', 'OKT', 'NOV', 'DES'];
    return `LEO, ${d.getDate()} ${months[d.getMonth()]}`;
  }, []);

  const renderWeatherIcon = (condition: string, size = 24, color = colors.text) => {
    switch (condition) {
      case 'sun': return <Sun size={size} color={color} strokeWidth={2} />;
      case 'cloud': return <CloudSun size={size} color={color} strokeWidth={2} />;
      case 'rain': return <CloudRain size={size} color={color} strokeWidth={2} />;
      case 'storm': return <CloudLightning size={size} color={color} strokeWidth={2} />;
      default: return <Sun size={size} color={color} strokeWidth={2} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={StyleSheet.absoluteFill}>
        <NeuralOrb color="#3b82f6" size={SCREEN_WIDTH * 0.8} x={-50} y={50} delay={0} />
        <NeuralOrb color={colors.primary} size={SCREEN_WIDTH * 0.7} x={SCREEN_WIDTH - 150} y={300} delay={2000} />
        <NeuralOrb color="#8b5cf6" size={SCREEN_WIDTH * 0.6} x={SCREEN_WIDTH / 3} y={SCREEN_HEIGHT - 350} delay={4000} />
        
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
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          contentContainerStyle={styles.scrollContent}
        >
          <motion.View variants={containerVariants} initial="initial" animate="animate">
            
            <motion.View variants={itemVariants} style={styles.header}>
              <View>
                <View style={[styles.statusBadge, { backgroundColor: colors.primary + '15' }]}>
                  <Sparkles size={10} color={colors.primary} />
                  <Text style={[styles.statusText, { color: colors.primary }]}>INTELIJENSIA YA HALI YA HEWA</Text>
                </View>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Utabiri wa Siku</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={12} color={colors.primary} />
                  <Text style={[styles.locationText, { color: colors.textMute }]}>
                    {current?.location ?? location}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.refreshAction} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onRefresh(); }}>
                <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={styles.refreshBlur}>
                  <RefreshCw size={22} color={colors.text} />
                </BlurView>
              </TouchableOpacity>
            </motion.View>

            <motion.View variants={itemVariants} whileHover={{ y: -5, scale: 1.01 }}>
              <BlurView intensity={isDark ? 30 : 80} tint={isDark ? "dark" : "light"} style={[styles.mainCard, { borderColor: colors.border }]}>
                <LinearGradient
                  colors={isDark ? ['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.6)'] : ['rgba(255, 255, 255, 0.8)', 'rgba(241, 245, 249, 0.8)']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.heroTop}>
                  <View style={styles.tempSection}>
                    <Text style={[styles.todayText, { color: colors.textMute }]}>{todayLabel}</Text>
                    <View style={styles.tempMainContainer}>
                      <Text style={[styles.tempMain, { color: colors.text }]}>
                        {current ? current.temp : (loading ? '—' : '?')}
                      </Text>
                      <Text style={[styles.tempDegree, { color: colors.primary }]}>°C</Text>
                    </View>
                    <Text style={[styles.conditionMain, { color: colors.text }]}>
                      {current?.conditionLabel
                        ? current.conditionLabel.charAt(0).toUpperCase() + current.conditionLabel.slice(1)
                        : (loading ? 'Inapakia…' : 'Hakuna data')}
                    </Text>
                  </View>
                  <motion.View 
                    animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    style={styles.heroIconContainer}
                  >
                    <CloudSun size={100} color={isDark ? colors.primary : '#3b82f6'} strokeWidth={1.5} />
                  </motion.View>
                </View>
 
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
 
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                      <Droplets size={18} color="#3b82f6" />
                    </View>
                    <Text style={[styles.statVal, { color: colors.text }]}>
                      {current ? `${current.humidity}%` : '—'}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textMute }]}>Unyevunyevu</Text>
                  </View>
                  <View style={styles.statItem}>
                    <View style={[styles.statIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                      <Wind size={18} color="#10b981" />
                    </View>
                    <Text style={[styles.statVal, { color: colors.text }]}>
                      {current ? `${current.windKph} km/h` : '—'}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textMute }]}>Upepo</Text>
                  </View>
                  <View style={styles.statItem}>
                    <View style={[styles.statIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                      <Thermometer size={18} color="#f59e0b" />
                    </View>
                    <Text style={[styles.statVal, { color: colors.text }]}>
                      {current ? `${current.feelsLike}°` : '—'}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textMute }]}>Inahisika Kama</Text>
                  </View>
                </View>
              </BlurView>
            </motion.View>

            {!configured && (
              <motion.View variants={itemVariants}>
                <BlurView intensity={isDark ? 10 : 30} tint={isDark ? "dark" : "light"} style={[styles.insightCard, { borderColor: '#f59e0b40' }]}>
                  <View style={styles.insightHeader}>
                    <Zap size={14} color="#f59e0b" />
                    <Text style={[styles.insightTitle, { color: '#f59e0b' }]}>HAIJASANIDIWA</Text>
                  </View>
                  <Text style={[styles.insightText, { color: colors.text }]}>
                    Funguo ya OpenWeather haijawekwa. Ongeza EXPO_PUBLIC_OPENWEATHER_API_KEY ili kupata utabiri wa kweli.
                  </Text>
                </BlurView>
              </motion.View>
            )}

            {configured && !!error && (
              <motion.View variants={itemVariants}>
                <BlurView intensity={isDark ? 10 : 30} tint={isDark ? "dark" : "light"} style={[styles.insightCard, { borderColor: '#ef444440' }]}>
                  <View style={styles.insightHeader}>
                    <Zap size={14} color="#ef4444" />
                    <Text style={[styles.insightTitle, { color: '#ef4444' }]}>{errorCopy.title}</Text>
                  </View>
                  <Text style={[styles.insightText, { color: colors.text }]}>
                    {errorCopy.body}
                  </Text>
                </BlurView>
              </motion.View>
            )}

            {configured && !error && forecastDays[0] && (
              <motion.View variants={itemVariants}>
                <BlurView intensity={isDark ? 10 : 30} tint={isDark ? "dark" : "light"} style={[styles.insightCard, { borderColor: colors.primary + '30' }]}>
                  <View style={styles.insightHeader}>
                    <Zap size={14} color={colors.primary} />
                    <Text style={[styles.insightTitle, { color: colors.primary }]}>USHAURI WA AI (AGRONOMIST)</Text>
                  </View>
                  <Text style={[styles.insightText, { color: colors.text }]}>
                    {forecastDays[0].desc}
                  </Text>
                </BlurView>
              </motion.View>
            )}

            <motion.View variants={itemVariants} style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Wiki Nzima</Text>
              <TouchableOpacity style={styles.moreButton} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/analytics' as any); }}>
                <Text style={[styles.moreText, { color: colors.primary }]}>TAARIFA ZAIDI →</Text>
              </TouchableOpacity>
            </motion.View>
            
            {loading && forecastDays.length === 0 && (
              <View style={{ paddingVertical: 32, alignItems: 'center' }}>
                <ActivityIndicator color={colors.primary} />
              </View>
            )}

            <View style={styles.forecastList}>
              {forecastDays.map((item, index) => (
                <motion.View key={item.day} variants={itemVariants} layout>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => Haptics.selectionAsync()} style={styles.dayRowContainer}>
                    <BlurView intensity={isDark ? 15 : 50} tint={isDark ? "dark" : "light"} style={[styles.dayRow, { borderColor: colors.border }]}>
                      <View style={styles.dayMain}>
                        <Text style={[styles.dayName, { color: colors.text }]}>{item.day}</Text>
                        <Text style={[styles.dayDate, { color: colors.textMute }]}>{item.date}</Text>
                      </View>
                      
                      <View style={styles.dayIcon}>
                        <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                          {renderWeatherIcon(item.condition, 22, isDark ? colors.primary : colors.slate[700])}
                        </View>
                        <View style={[styles.popBadge, { backgroundColor: colors.primary + '10' }]}>
                          <Droplets size={10} color={colors.primary} />
                          <Text style={[styles.popText, { color: colors.primary }]}>{item.pop}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.tempRange}>
                        <View style={styles.tempLabels}>
                          <Text style={[styles.highTemp, { color: colors.text }]}>{item.high}°</Text>
                          <Text style={[styles.lowTemp, { color: colors.textMute }]}>{item.low}°</Text>
                        </View>
                        <View style={[styles.tempBarBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                          <motion.View 
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.high / 30) * 100}%` }}
                            transition={{ type: "spring", damping: 20, delay: 0.5 + index * 0.1 }}
                            style={{ flex: 1 }}
                          >
                            <LinearGradient colors={[colors.primary, '#3b82f6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.tempBarFill} />
                          </motion.View>
                        </View>
                        <ChevronRight size={18} color={colors.border} />
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                </motion.View>
              ))}
            </View>

            <View style={{ height: 120 }} />
          </motion.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  bgOrb: { position: 'absolute', opacity: 0.6 },
  bgGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: SCREEN_HEIGHT },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12, alignSelf: 'flex-start', gap: 6 },
  statusText: { fontSize: 9, fontFamily: 'Inter_900Black', letterSpacing: 1 },
  headerTitle: { fontSize: 32, fontFamily: 'Inter_900Black', letterSpacing: -1.5 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { fontSize: 13, fontFamily: 'Inter_700Bold', marginLeft: 6, opacity: 0.8 },
  refreshAction: { width: 54, height: 54, borderRadius: 27, overflow: 'hidden' },
  refreshBlur: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainCard: { borderRadius: 40, padding: 28, marginBottom: 24, overflow: 'hidden', borderWidth: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.1, shadowRadius: 30, elevation: 8 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  tempSection: { flex: 1 },
  todayText: { fontSize: 12, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1, marginBottom: 8 },
  tempMainContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  tempMain: { fontSize: 84, fontFamily: 'Inter_900Black', letterSpacing: -3, lineHeight: 84 },
  tempDegree: { fontSize: 32, fontFamily: 'Inter_900Black', marginTop: 4, marginLeft: 4 },
  conditionMain: { fontSize: 22, fontFamily: 'Inter_800ExtraBold', marginTop: 8, letterSpacing: -0.5 },
  heroIconContainer: { shadowColor: "#3b82f6", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 },
  divider: { height: 1, width: '100%', marginBottom: 24, opacity: 0.05 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', flex: 1 },
  statIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statVal: { fontSize: 17, fontFamily: 'Inter_900Black' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold', marginTop: 2, opacity: 0.6 },
  insightCard: { padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 36, overflow: 'hidden' },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  insightTitle: { fontSize: 10, fontFamily: 'Inter_900Black', letterSpacing: 1 },
  insightText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', lineHeight: 20, opacity: 0.9 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontFamily: 'Inter_900Black', letterSpacing: -0.8 },
  moreButton: { paddingHorizontal: 12, paddingVertical: 6 },
  moreText: { fontSize: 11, fontFamily: 'Inter_900Black', letterSpacing: 1 },
  forecastList: { gap: 12 },
  dayRowContainer: { borderRadius: 28, overflow: 'hidden' },
  dayRow: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 28, borderWidth: 1, overflow: 'hidden' },
  dayMain: { width: 100 },
  dayName: { fontSize: 16, fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.3 },
  dayDate: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 2, opacity: 0.6 },
  dayIcon: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  popBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  popText: { fontSize: 10, fontFamily: 'Inter_900Black' },
  tempRange: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tempLabels: { alignItems: 'flex-end' },
  highTemp: { fontSize: 15, fontFamily: 'Inter_900Black' },
  lowTemp: { fontSize: 12, fontFamily: 'Inter_700Bold', opacity: 0.5 },
  tempBarBg: { width: 60, height: 6, borderRadius: 3, overflow: 'hidden' },
  tempBarFill: { height: '100%', borderRadius: 3 },
});
