import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
  Image,
  Pressable,
  Platform,
} from 'react-native';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';
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
  RefreshCw,
  Lightbulb,
  MapPin,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import { generateRecommendations, severityColor } from '../../lib/recommendations';
import { Card } from '../../components/ui/Card';
import { useSyncEngine } from '../../hooks/useSyncEngine';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const QUICK_ACTIONS = [
  { id: 'scan', label: 'Uchunguzi', icon: <Camera size={22} color="#fff" />, color: '#4CAF50', desc: 'AI Crop Scan' },
  { id: 'tasks', label: 'Usimamizi', icon: <LayoutGrid size={22} color="#fff" />, color: '#3b82f6', desc: 'Farm Tasks' },
  { id: 'market', label: 'Soko', icon: <TrendingUp size={22} color="#fff" />, color: '#f59e0b', desc: 'Market Prices' },
  { id: 'crop-planning', label: 'Panga Mazao', icon: <Leaf size={22} color="#fff" />, color: '#22c55e', desc: 'AI Crop Planning' },
  { id: 'contracts', label: 'Mikataba', icon: <BarChart3 size={22} color="#fff" />, color: '#8b5cf6', desc: 'Contract Farming' },
];

const TRACK_RECORDS = [
  { date: 'Feb 10', title: 'Compost', subtitle: 'Fertilizer', completed: true },
  { date: 'Feb 17', title: 'Superior', subtitle: 'Seeds', completed: true },
  { date: 'Feb 24', title: 'KCl', subtitle: 'Fertilizer', completed: false },
  { date: 'Mar 03', title: 'SP-36', subtitle: 'Fertilizer', completed: false },
];

const GROWTH_DATA = [
  { label: 'Jul 24', value: 0.4 },
  { label: 'Jul 25', value: 0.55 },
  { label: 'Jul 26', value: 0.65 },
  { label: 'Jul 27', value: 0.45 },
  { label: 'Jul 28', value: 0.75 },
  { label: 'Jul 29', value: 0.90 },
  { label: 'Jul 30', value: 0.82 },
  { label: 'Jul 31', value: 0.70 },
  { label: 'Aug 01', value: 0.88 },
  { label: 'Aug 02', value: 0.95 },
  { label: 'Aug 03', value: 0.60 },
  { label: 'Aug 04', value: 0.85 },
];

// Pulsing indicator for "🔴 Live" crop telemetry
const PulsingDot = () => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 800 }),
        withTiming(0.8, { duration: 800 })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.dotContainer}>
      <Animated.View style={[styles.liveOuterDot, animatedStyle]} />
      <View style={styles.liveInnerDot} />
    </View>
  );
};

// Horizontal stepper timeline component
const TrackRecords = ({ colors, isDark }: any) => {
  return (
    <Card variant="solid" style={[styles.trackCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.trackHeader}>
        <Text style={[styles.trackTitle, { color: colors.text }]}>Track Records</Text>
        <View style={[styles.qrBadge, { backgroundColor: colors.primaryLight }]}>
          <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 10 }}>QR Codes</Text>
        </View>
      </View>
      <View style={{ position: 'relative', marginTop: 16 }}>
        {/* Connection Line */}
        <View style={[styles.trackBgLine, { backgroundColor: isDark ? '#263322' : '#E2E8DF' }]} />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trackScroll}>
          {TRACK_RECORDS.map((item, idx) => (
            <View key={idx} style={styles.trackStep}>
              <View style={[
                styles.stepDot, 
                { 
                  backgroundColor: item.completed ? colors.primary : isDark ? '#171D15' : '#FFFFFF',
                  borderColor: item.completed ? colors.primary : isDark ? '#2A3326' : '#C4D0C0',
                  borderWidth: 2,
                }
              ]}>
                {item.completed && <View style={styles.activeDotInner} />}
              </View>
              <Text style={[styles.stepDate, { color: colors.textMute }]}>{item.date}</Text>
              <Text style={[styles.stepMainTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.stepSubtitle, { color: colors.textMute }]}>{item.subtitle}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Card>
  );
};

// Growth Rates vertical bar chart component
const GrowthChart = ({ colors, isDark }: any) => {
  const [selectedRange, setSelectedRange] = useState('M');

  return (
    <Card variant="solid" style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.chartHeader}>
        <View>
          <Text style={[styles.chartSub, { color: colors.textMute }]}>Growth rate</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 2 }}>
            <Text style={[styles.chartValue, { color: colors.text }]}>0.75</Text>
            <Text style={[styles.chartUnit, { color: colors.textMute }]}> kg/ha</Text>
          </View>
        </View>
        <View style={[styles.rangeSelector, { backgroundColor: isDark ? '#121711' : '#EDF1EC' }]}>
          {['W', 'M', 'Y'].map((range) => (
            <TouchableOpacity
              key={range}
              onPress={() => setSelectedRange(range)}
              style={[
                styles.rangeBtn,
                selectedRange === range && { backgroundColor: colors.primary }
              ]}
            >
              <Text style={[
                styles.rangeText,
                { color: selectedRange === range ? '#FFFFFF' : colors.textMute }
              ]}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.chartContainer}>
        {GROWTH_DATA.map((item, idx) => (
          <View key={idx} style={styles.chartBarWrapper}>
            <View style={[styles.chartBarBackground, { backgroundColor: isDark ? '#1C221A' : '#EDF1EC' }]}>
              <View 
                style={[
                  styles.chartBarFill, 
                  { 
                    height: `${item.value * 100}%`, 
                    backgroundColor: idx === 9 ? colors.primary : isDark ? '#2D4428' : '#B2C4AC' 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.chartLabel, { color: colors.textMute }]} numberOfLines={1}>{item.label}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

export default function HomeScreen() {
  const { colors, isDark, radius, shadows } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);

  const agroId = useKilimoStore((s) => s.agroId);
  const isOffline = useKilimoStore((s) => s.isOffline);
  const syncQueue = useKilimoStore((s) => s.syncQueue);
  const farmVitals = useKilimoStore((s) => s.farmVitals);
  const wallet = useKilimoStore((s) => s.wallet);
  const unreadCount = useKilimoStore((s) => s.unreadCount);
  const farmProfile = useKilimoStore((s) => s.farmProfile);
  const language = useKilimoStore((s) => s.language);
  const activities = useKilimoStore((s) => s.activities);
  const setActivities = useKilimoStore((s) => s.setActivities);

  const recommendations = useMemo(
    () => generateRecommendations({ profile: farmProfile, vitals: farmVitals, language }),
    [farmProfile, farmVitals, language]
  );

  const FARM_STATS = [
    { id: 'soil', label: 'Soil Health', value: `${farmVitals.soilHealth}%`, icon: <Leaf size={18} color={colors.primary} />, color: colors.primary },
    { id: 'moisture', label: 'Moisture', value: `${farmVitals.moisture}%`, icon: <Droplets size={18} color="#2563EB" />, color: '#2563EB' },
    { id: 'weather', label: 'Temperature', value: `${farmVitals.temperature}°C`, icon: <Sun size={18} color="#F59E0B" />, color: '#F59E0B' },
    { id: 'yield', label: 'Yield Est.', value: `${farmVitals.yieldEstimate}t`, icon: <TrendingUp size={18} color="#8b5cf6" />, color: '#8b5cf6' },
  ];

  const setLastSyncedAt = useKilimoStore((s) => s.setLastSyncedAt);
  const { forceSync } = useSyncEngine();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await forceSync();
    setLastSyncedAt(new Date().toISOString());
    setRefreshing(false);
  }, [setLastSyncedAt, forceSync]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />}
      >
        {/* Immersive Hero Header */}
        <View style={styles.heroWrapper}>
          <Image 
            source={require('../../assets/images/rice-field-bg.png')} 
            style={styles.heroImage} 
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.1)', colors.background]}
            style={StyleSheet.absoluteFill}
          />
          
          {/* Crop Overlay Visual Telemetry Markers */}
          <View style={StyleSheet.absoluteFill}>
            {/* Left Marker: Manure */}
            <View style={[styles.markerLabelContainer, { left: '8%', top: 120 }]}>
              <Text style={styles.markerLabelTitle}>Manure</Text>
              <Text style={styles.markerLabelSub}>Before Planting</Text>
            </View>
            <View style={[styles.markerLineH, { left: '26%', top: 132, width: '20%' }]} />
            <View style={[styles.markerLineV, { left: '46%', top: 132, height: 42 }]} />
            <View style={[styles.markerDot, { left: '45%', top: 174, borderColor: colors.primary }]} />

            {/* Right Marker: KCl Fertilizer */}
            <View style={[styles.markerLabelContainer, { right: '6%', top: 88, alignItems: 'flex-end' }]}>
              <Text style={styles.markerLabelTitle}>KCl Fertilizer</Text>
              <Text style={styles.markerLabelSub}>Age 2 - 3 Weeks</Text>
            </View>
            <View style={[styles.markerLineH, { right: '28%', top: 100, width: '18%' }]} />
            <View style={[styles.markerLineV, { right: '46%', top: 100, height: 48 }]} />
            <View style={[styles.markerDot, { right: '45.1%', top: 148, borderColor: colors.primary }]} />
          </View>
          
          <SafeAreaView style={styles.heroHeader}>
            <View style={[styles.locationPill, { backgroundColor: isDark ? 'rgba(23, 29, 21, 0.75)' : 'rgba(255, 255, 255, 0.85)' }]}>
              <MapPin size={14} color={colors.primary} />
              <Text style={[styles.locationText, { color: colors.text }]}>{farmProfile?.region || agroId?.location || 'Bali, Indonesia'}</Text>
            </View>
            
            <View style={styles.headerActions}>
              {isOffline && (
                <View style={styles.offlineIndicator}>
                  <WifiOff size={16} color="#ef4444" />
                  <Text style={styles.offlineText}>{syncQueue.length} Q</Text>
                </View>
              )}
              
              <TouchableOpacity 
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/notifications' as any); }}
                style={[styles.heroActionCircle, { backgroundColor: isDark ? 'rgba(23, 29, 21, 0.75)' : 'rgba(255, 255, 255, 0.85)' }]}
                accessibilityLabel="Notifications"
                accessibilityRole="button"
              >
                <Bell size={20} color={colors.text} />
                {unreadCount > 0 && !isOffline && <View style={styles.heroNotificationDot} />}
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => router.push('/(tabs)/profile' as any)}>
                <View style={[styles.heroAvatarBorder, { borderColor: colors.primary }]}>
                  {agroId?.avatarUrl ? (
                    <Image source={{ uri: agroId.avatarUrl }} style={styles.heroAvatar} />
                  ) : (
                    <View style={[styles.heroAvatar, { backgroundColor: colors.primary }]}>
                      <Text style={styles.heroAvatarText}>
                        {agroId?.name?.[0]?.toUpperCase() || '?'}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Crop Telemetry Info Overlay */}
          <View style={styles.heroCropPanel}>
            <View style={styles.cropTitleRow}>
              <Text style={styles.cropLabel}>YOUR AGRICULTURAL CROPS</Text>
              <View style={[styles.liveBadge, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <PulsingDot />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
            <View style={styles.cropSelectorRow}>
              <Text style={styles.cropName}>{farmProfile?.primaryCrops?.[0] || 'Rice Plants'}</Text>
              <ChevronDown size={18} color="#FFFFFF" />
            </View>
            
            {/* Cycle Progress bar */}
            <View style={styles.harvestTimeline}>
              <View style={styles.timelineTexts}>
                <Text style={styles.timelineLeft}>{language === 'sw' ? 'Muda wa Kuvuna' : 'Time to harvest'}</Text>
                <Text style={styles.timelineRight}>10 days (65/74)</Text>
              </View>
              <View style={styles.timelineProgressBg}>
                <View style={[styles.timelineProgressFill, { backgroundColor: colors.primary }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Content body below the Hero */}
        <View style={styles.mainContent}>
          
          {/* Horizontal Track Records timeline stepper */}
          <TrackRecords colors={colors} isDark={isDark} />

          {/* Quick Actions Scroll */}
          <View style={{ marginVertical: 12 }}>
            <Text style={[styles.bentoSectionTitle, { color: colors.textMute, marginLeft: 4 }]}>QUICK ACTIONS</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.actionScroll}
              snapToInterval={SCREEN_WIDTH * 0.65 + 16} 
              decelerationRate="fast"
            >
              {QUICK_ACTIONS.map((action) => (
                <TouchableOpacity 
                  key={action.id} 
                  activeOpacity={0.88} 
                  onPress={() => { 
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); 
                    if (action.id === 'contracts' && agroId?.tier === 'Free') {
                      setUpgradeModalVisible(true);
                    } else {
                      router.push(`/${action.id}` as any); 
                    }
                  }} 
                  style={styles.actionCardWrapper}
                  accessibilityLabel={action.label}
                  accessibilityHint={action.desc}
                  accessibilityRole="button"
                >
                  <LinearGradient 
                    colors={[action.color, action.color + 'aa']} 
                    style={[styles.actionCard, { borderRadius: radius.lg }]} 
                    start={{ x: 0, y: 0 }} 
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.actionIconOuter}>
                      {action.icon}
                    </View>
                    <View>
                      <Text style={styles.actionLabel}>{action.label}</Text>
                      <Text style={styles.actionDesc}>{action.desc}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Growth Rate Chart */}
          <GrowthChart colors={colors} isDark={isDark} />

          {/* Wallet Card - Replaced with Olive Premium card */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Card variant="solid" style={[styles.walletCard, { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark, ...shadows.premium }]}>
              <View style={styles.walletHeader}>
                <View style={[styles.agroIdBadge, { backgroundColor: 'rgba(255, 255, 255, 0.08)' }]}>
                  <Fingerprint size={12} color="#FCFBF7" />
                  <Text style={[styles.agroIdText, { color: '#FCFBF7' }]}>AGRO ID SECURED</Text>
                </View>
                <View style={[styles.mobileMoneyTag, { backgroundColor: colors.primary }]}>
                  <Text style={styles.mobileMoneyText}>{agroId?.mpesaLinked ? 'M-PESA LINKED' : 'LINK M-PESA'}</Text>
                </View>
              </View>

              <Text style={[styles.balanceLabel, { color: 'rgba(252, 251, 247, 0.6)' }]}>Akiba Yako (TZS)</Text>
              <View style={styles.balanceRow}>
                <Text style={[styles.balanceAmount, { color: '#FCFBF7' }]}>{wallet.balanceTZS.toLocaleString()}</Text>
                <Text style={[styles.balanceDecimals, { color: 'rgba(252, 251, 247, 0.6)' }]}>.00</Text>
              </View>

              <View style={styles.walletActions}>
                <TouchableOpacity
                  style={[styles.walletBtn, { backgroundColor: '#FCFBF7' }]}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/agro-id' as any); }}
                  accessibilityRole="button"
                  accessibilityLabel="Deposit funds"
                >
                  <ArrowDownLeft size={16} color="#080A08" />
                  <Text style={[styles.walletBtnText, { color: '#080A08' }]}>Deposit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.walletBtn, { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)' }]}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/wallet-admin' as any); }}
                  accessibilityRole="button"
                  accessibilityLabel="Pay cooperative dues"
                >
                  <ArrowUpRight size={16} color="#FCFBF7" />
                  <Text style={[styles.walletBtnText, { color: '#FCFBF7' }]}>Pay Co-op</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </Animated.View>

          {/* Bento Vitals Grid */}
          <View style={styles.bentoSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Afya ya Shamba</Text>
              <TouchableOpacity
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/analytics' as any); }}
                accessibilityRole="button"
                accessibilityLabel="View farm sensors"
              >
                <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 12 }}>SENSORS →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statsGrid}>
              {FARM_STATS.map((stat, idx) => (
                <View key={stat.id} style={styles.statCardContainer}>
                  <Card variant="solid" style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.lg, ...shadows.sm }]}>
                    <View style={styles.statHeaderRow}>
                      <View style={[styles.statIconBg, { backgroundColor: stat.color + '12' }]}>
                        {stat.icon}
                      </View>
                      <TouchableOpacity>
                        <MoreHorizontal size={16} color={colors.textMute} />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.statValueText, { color: colors.text }]}>{stat.value}</Text>
                    <Text style={[styles.statLabelText, { color: colors.textMute }]}>{stat.label}</Text>
                    <View style={styles.statTrendRow}>
                      <ArrowUpRight size={12} color={colors.primary} />
                      <Text style={[styles.statTrendLabel, { color: colors.primary }]}>Optimal</Text>
                    </View>
                  </Card>
                </View>
              ))}
            </View>
          </View>

          {/* AI Recommendations */}
          <View style={styles.recSection}>
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Lightbulb size={18} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Sankofa AI</Text>
              </View>
              <Text style={{ color: colors.textMute, fontFamily: 'Inter_700Bold', fontSize: 11 }}>{recommendations.length} NEW</Text>
            </View>
            <View style={{ gap: 10 }}>
              {recommendations.map((rec, idx) => {
                const col = severityColor(rec.severity);
                return (
                  <Pressable
                    key={rec.id}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(rec.cta.route as any); }}
                    accessibilityRole="button"
                    accessibilityLabel={rec.title}
                    accessibilityHint={rec.cta.label}
                  >
                    <Card variant="solid" style={[styles.recCard, { borderLeftColor: col, borderLeftWidth: 4, backgroundColor: colors.card, borderColor: colors.border }]}>
                      <Text style={[styles.recCat, { color: col }]}>{rec.category.toUpperCase()}</Text>
                      <Text style={[styles.recTitle, { color: colors.text }]}>{rec.title}</Text>
                      <Text style={[styles.recBody, { color: colors.textMute }]}>{rec.body}</Text>
                    </Card>
                  </Pressable>
                );
              })}
            </View>
          </View>
          
        </View>
        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: 0 },
  
  // Hero Styles
  heroWrapper: {
    height: 330,
    width: '100%',
    position: 'relative',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  markerLabelContainer: {
    position: 'absolute',
    zIndex: 2,
  },
  markerLabelTitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  markerLabelSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  markerLineH: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    zIndex: 1,
  },
  markerLineV: {
    position: 'absolute',
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    zIndex: 1,
  },
  markerDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    zIndex: 3,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 36,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroActionCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroNotificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
  heroAvatarBorder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    padding: 1.5,
  },
  heroAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroAvatarText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 14,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  offlineText: {
    color: '#ef4444',
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
  },
  
  // Crop overlay panel
  heroCropPanel: {
    paddingHorizontal: 20,
  },
  cropTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cropLabel: {
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  dotContainer: {
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveOuterDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    position: 'absolute',
  },
  liveInnerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ef4444',
  },
  liveText: {
    color: '#ef4444',
    fontSize: 8,
    fontFamily: 'Inter_900Black',
  },
  cropSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  cropName: {
    fontSize: 26,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  harvestTimeline: {
    marginTop: 2,
  },
  timelineTexts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timelineLeft: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: 'rgba(255,255,255,0.7)',
  },
  timelineRight: {
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
  },
  timelineProgressBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  timelineProgressFill: {
    height: '100%',
    width: '87%',
    borderRadius: 3,
  },

  // Main scroll content below header
  mainContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  
  // Track Records Stepper Styles
  trackCard: {
    padding: 16,
  },
  trackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackTitle: {
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.2,
  },
  qrBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  trackBgLine: {
    position: 'absolute',
    top: 14,
    left: 20,
    right: 20,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#C4D0C0',
  },
  trackScroll: {
    paddingRight: 20,
  },
  trackStep: {
    width: 96,
    alignItems: 'center',
    marginRight: 12,
  },
  stepDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    zIndex: 3,
  },
  activeDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  stepDate: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  stepMainTitle: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
  },
  stepSubtitle: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },

  // Quick Action List Styles
  bentoSectionTitle: {
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  actionScroll: {
    gap: 10,
    paddingRight: 20,
  },
  actionCardWrapper: {
    width: SCREEN_WIDTH * 0.44,
  },
  actionCard: {
    padding: 16,
    height: 110,
    justifyContent: 'space-between',
  },
  actionIconOuter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 1,
  },
  actionDesc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },

  // Growth Chart Styles
  chartCard: {
    padding: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartSub: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  chartValue: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  chartUnit: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  rangeSelector: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
  },
  rangeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  rangeText: {
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 110,
    marginTop: 8,
  },
  chartBarWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarBackground: {
    width: 8,
    height: 86,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 6,
  },

  // Wallet Card Styles
  walletCard: {
    padding: 18,
    borderRadius: 28,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  agroIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  agroIdText: {
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 0.5,
  },
  mobileMoneyTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  mobileMoneyText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
  },
  balanceLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  balanceDecimals: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  walletActions: {
    flexDirection: 'row',
    gap: 10,
  },
  walletBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  walletBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_800ExtraBold',
  },

  // Bento Stats Styles
  bentoSection: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCardContainer: {
    width: (SCREEN_WIDTH - 42) / 2,
  },
  statCard: {
    padding: 14,
    borderWidth: 1,
  },
  statHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValueText: {
    fontSize: 20,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  statLabelText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 2,
  },
  statTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 8,
  },
  statTrendLabel: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },

  // AI Recs Styles
  recSection: {
    marginTop: 4,
  },
  recCard: {
    padding: 14,
    paddingLeft: 12,
    borderWidth: 1,
    borderRadius: 16,
  },
  recCat: {
    fontSize: 9,
    fontFamily: 'Inter_900Black',
    marginBottom: 2,
  },
  recTitle: {
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 2,
  },
  recBody: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    lineHeight: 16,
  },
});
