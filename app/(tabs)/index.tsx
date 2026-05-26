import React, { useState, useCallback, useMemo } from 'react';
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
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
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
  Lightbulb
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
  { id: 'scan', label: 'Uchunguzi', icon: <Camera size={24} color="#fff" />, color: '#4CAF50', desc: 'AI Crop Scan' },
  { id: 'tasks', label: 'Usimamizi', icon: <LayoutGrid size={24} color="#fff" />, color: '#3b82f6', desc: 'Farm Tasks' },
  { id: 'market', label: 'Soko', icon: <TrendingUp size={24} color="#fff" />, color: '#f59e0b', desc: 'Market Prices' },
  { id: 'crop-planning', label: 'Panga Mazao', icon: <Leaf size={24} color="#fff" />, color: '#22c55e', desc: 'AI Crop Planning' },
  { id: 'contracts', label: 'Mikataba', icon: <BarChart3 size={24} color="#fff" />, color: '#8b5cf6', desc: 'Contract Farming' },
];

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
    { id: 'soil', label: 'Soil Health', value: `${farmVitals.soilHealth}%`, icon: <Leaf size={18} color="#4CAF50" />, color: '#4CAF50' },
    { id: 'moisture', label: 'Moisture', value: `${farmVitals.moisture}%`, icon: <Droplets size={18} color="#3b82f6" />, color: '#3b82f6' },
    { id: 'weather', label: 'Joto', value: `${farmVitals.temperature}°C`, icon: <Sun size={18} color="#f59e0b" />, color: '#f59e0b' },
    { id: 'yield', label: 'Mavuno', value: `${farmVitals.yieldEstimate}t`, icon: <TrendingUp size={18} color="#8b5cf6" />, color: '#8b5cf6' },
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
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        >
          {/* Header Section */}
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
            <View>
              <View style={[styles.statusBadge, { backgroundColor: isOffline ? '#fee2e2' : colors.primaryLight }]}>
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
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/notifications' as any); }}
                style={[styles.actionCircle, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
                accessibilityLabel="Notifications"
                accessibilityRole="button"
              >
                {isOffline ? <WifiOff size={22} color="#ef4444" /> : <Bell size={22} color={colors.text} />}
                {unreadCount > 0 && !isOffline && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/(tabs)/profile' as any)} accessibilityLabel="Profile" accessibilityRole="button">
                <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
                  {agroId?.avatarUrl ? (
                    <Image source={{ uri: agroId.avatarUrl }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, { backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' }]}>
                      <Text style={{ color: colors.primary, fontFamily: 'Inter_800ExtraBold', fontSize: 18 }}>
                        {agroId?.name?.[0]?.toUpperCase() || '?'}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Wallet Card */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Card variant="solid" style={[styles.walletCard, { backgroundColor: colors.primary, borderColor: colors.primary, ...shadows.premium }]}>
              <View style={styles.walletHeader}>
                <View style={[styles.agroIdBadge, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                  <Fingerprint size={14} color="#FCFBF7" />
                  <Text style={[styles.agroIdText, { color: '#FCFBF7' }]}>AGRO ID SECURED</Text>
                </View>
                <View style={[styles.mobileMoneyTag, { backgroundColor: agroId?.mpesaLinked ? '#3A8D52' : '#D97706' }]}>
                  <Text style={styles.mobileMoneyText}>{agroId?.mpesaLinked ? 'M-PESA LINKED' : 'LINK M-PESA'}</Text>
                </View>
              </View>

              <Text style={[styles.balanceLabel, { color: 'rgba(252, 251, 247, 0.7)' }]}>Akiba Yako (TZS)</Text>
              <View style={styles.balanceRow}>
                <Text style={[styles.balanceAmount, { color: '#FCFBF7' }]}>{wallet.balanceTZS.toLocaleString()}</Text>
                <Text style={[styles.balanceDecimals, { color: 'rgba(252, 251, 247, 0.7)' }]}>.00</Text>
              </View>

              <View style={styles.walletActions}>
                <TouchableOpacity
                  style={[styles.walletBtn, { backgroundColor: '#FCFBF7' }]}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/agro-id' as any); }}
                  accessibilityRole="button"
                  accessibilityLabel="Deposit funds"
                >
                  <ArrowDownLeft size={18} color="#080A08" />
                  <Text style={[styles.walletBtnText, { color: '#080A08' }]}>Deposit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.walletBtn, { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.25)' }]}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/wallet-admin' as any); }}
                  accessibilityRole="button"
                  accessibilityLabel="Pay cooperative dues"
                >
                  <ArrowUpRight size={18} color="#FCFBF7" />
                  <Text style={[styles.walletBtnText, { color: '#FCFBF7' }]}>Pay Co-op</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </Animated.View>

          {/* Sankofa AI Hero */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); router.push('/ai'); }}
              accessibilityRole="button"
              accessibilityLabel="Open Sankofa AI assistant"
              accessibilityHint="View AI crop recommendations"
            >
              <Card variant="glass" style={styles.aiHero}>
                <View style={styles.aiHeroContent}>
                  <View style={[styles.aiIconMain, { backgroundColor: colors.primaryLight }]}>
                    <BrainCircuit size={32} color={colors.primary} />
                  </View>
                  <View style={styles.aiRight}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Sparkles size={12} color={colors.primary} style={{ marginRight: 4 }} />
                      <Text style={[styles.aiTitle, { color: colors.primary }]}>Sankofa AI</Text>
                    </View>
                    <Text style={[styles.aiMessage, { color: colors.text }]}>
                      {language === 'sw' ? '"Unyevu wa Shamba B unashuka haraka. Napendekeza umwagiliaji..."' : '"Block B moisture dropping faster than predicted. Recommended: irrigate..."'}
                    </Text>
                    <View style={styles.aiActionRow}>
                      <Text style={[styles.aiActionLabel, { color: colors.primary }]}>SOMA ZAIDI</Text>
                      <ArrowRight size={14} color={colors.primary} />
                    </View>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          </Animated.View>

          {/* Quick Actions */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionScroll} snapToInterval={SCREEN_WIDTH * 0.65 + 16} decelerationRate="fast">
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity 
                key={action.id} 
                activeOpacity={0.9} 
                onPress={() => { 
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); 
                  if (action.id === 'contracts' && agroId?.tier === 'Free') {
                    setUpgradeModalVisible(true);
                  } else {
                    router.push(`/${action.id}` as any); 
                  }
                }} 
                style={styles.actionCardWrapper}
                accessible={true}
                accessibilityLabel={action.label}
                accessibilityHint={action.desc}
                accessibilityRole="button"
              >
                <LinearGradient colors={[action.color, action.color + 'bb']} style={[styles.actionCard, { borderRadius: radius.lg }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
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

          {/* Farm Vitale Grid */}
          <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Afya ya Shamba</Text>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/analytics' as any); }}
              accessibilityRole="button"
              accessibilityLabel="View farm sensors"
            >
              <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 13 }}>SENSORS →</Text>
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.statsGrid}>
            {FARM_STATS.map((stat, idx) => (
              <Animated.View key={stat.id} entering={FadeInDown.delay(500 + idx * 50).springify()} style={styles.statCardContainer}>
                <Card variant="solid" style={{ padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={[styles.statIconBg, { backgroundColor: stat.color + '15' }]}>{stat.icon}</View>
                    <Text style={[styles.statLabel, { color: colors.textMute, marginLeft: 8 }]}>{stat.label}</Text>
                  </View>
                  <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                </Card>
              </Animated.View>
            ))}
          </View>

          {/* Recommendations */}
          <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Lightbulb size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Sankofa AI</Text>
            </View>
            <Text style={{ color: colors.textMute, fontFamily: 'Inter_700Bold', fontSize: 11 }}>{recommendations.length} NEW</Text>
          </Animated.View>
          <View style={{ gap: 10, marginBottom: 24 }}>
            {recommendations.map((rec, idx) => {
              const col = severityColor(rec.severity);
              return (
                <Animated.View key={rec.id} entering={FadeInDown.delay(600 + idx * 50).springify()}>
                  <Pressable
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(rec.cta.route as any); }}
                    accessibilityRole="button"
                    accessibilityLabel={rec.title}
                    accessibilityHint={rec.cta.label}
                  >
                    <Card variant="solid" style={[styles.recCard, { borderLeftColor: col, borderLeftWidth: 4 }]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Text style={[styles.recCat, { color: col }]}>{rec.category.toUpperCase()}</Text>
                      </View>
                      <Text style={[styles.recTitle, { color: colors.text }]}>{rec.title}</Text>
                      <Text style={[styles.recBody, { color: colors.textMute }]}>{rec.body}</Text>
                    </Card>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>

          {/* Telemetry Feed */}
          <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Shughuli za Hivi Karibuni</Text>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActivities([]); }}
              accessibilityRole="button"
              accessibilityLabel="Clear all recent activities"
            >
              <Text style={{ color: colors.textMute, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>CLEAR ALL</Text>
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.activityList}>
            {activities.length === 0 && (
              <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                <Text style={{ color: colors.textMute, fontFamily: 'Inter_600SemiBold', fontSize: 12, marginTop: 8 }}>Hakuna shughuli mpya.</Text>
              </View>
            )}
            {activities.map((activity, idx) => (
              <Animated.View key={activity.id} entering={FadeInDown.delay(700 + idx * 50).springify()}>
                <Pressable
                  onPress={() => { Haptics.selectionAsync(); router.push(activity.route as any); }}
                  accessibilityRole="button"
                  accessibilityLabel={activity.title}
                  accessibilityHint={activity.detail}
                >
                  <Card variant="solid" style={styles.activityItem}>
                    <View style={[styles.activityIconWrapper, { backgroundColor: (activity.iconColor || colors.primary) + '15' }]}>
                      {activity.iconName === 'Microscope' ? <Microscope size={16} color={activity.iconColor || colors.primary} /> : 
                       activity.iconName === 'Waves' ? <Waves size={16} color={activity.iconColor || colors.primary} /> :
                       activity.iconName === 'BarChart3' ? <BarChart3 size={16} color={activity.iconColor || colors.primary} /> :
                       <Leaf size={16} color={activity.iconColor || colors.primary} />}
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={[styles.activityTitle, { color: colors.text }]}>{activity.title}</Text>
                      <Text style={[styles.activityDetail, { color: colors.textMute }]}>{activity.detail}</Text>
                    </View>
                    <Text style={[styles.activityTime, { color: colors.textMute }]}>{activity.time}</Text>
                  </Card>
                </Pressable>
              </Animated.View>
            ))}
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
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 8, alignSelf: 'flex-start' },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  greeting: { fontSize: 12, fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  name: { fontSize: 28, fontFamily: 'Inter_800ExtraBold', letterSpacing: -1 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  actionCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  notificationBadge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' },
  notificationBadgeText: { display: 'none' },
  avatarContainer: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, padding: 2 },
  avatar: { width: '100%', height: '100%', borderRadius: 20 },
  walletCard: { marginBottom: 24, padding: 20 },
  walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  agroIdBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6 },
  agroIdText: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.5 },
  mobileMoneyTag: { backgroundColor: '#10b981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  mobileMoneyText: { color: '#fff', fontSize: 10, fontFamily: 'Inter_800ExtraBold' },
  balanceLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', marginBottom: 4 },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 20 },
  balanceAmount: { fontSize: 36, fontFamily: 'Inter_800ExtraBold', letterSpacing: -1 },
  balanceDecimals: { fontSize: 18, fontFamily: 'Inter_600SemiBold' },
  walletActions: { flexDirection: 'row', gap: 12 },
  walletBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, gap: 6 },
  walletBtnText: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  aiHero: { marginBottom: 32, padding: 20 },
  aiHeroContent: { flexDirection: 'row', alignItems: 'center' },
  aiIconMain: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  aiRight: { flex: 1 },
  aiTitle: { fontSize: 16, fontFamily: 'Inter_800ExtraBold' },
  aiMessage: { fontSize: 14, fontFamily: 'Inter_500Medium', lineHeight: 20, marginBottom: 12 },
  aiActionRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  aiActionLabel: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  actionScroll: { paddingRight: 40, gap: 16 },
  actionCardWrapper: { width: SCREEN_WIDTH * 0.4 },
  actionCard: { padding: 16, height: 120, justifyContent: 'space-between' },
  actionIconOuter: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  actionLabel: { color: '#fff', fontSize: 16, fontFamily: 'Inter_800ExtraBold', marginBottom: 2 },
  actionDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: 'Inter_500Medium' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_800ExtraBold' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  statCardContainer: { width: (SCREEN_WIDTH - 52) / 2 },
  statIconBg: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  statLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  statValue: { fontSize: 22, fontFamily: 'Inter_800ExtraBold' },
  recCard: { padding: 16, paddingLeft: 12 },
  recCat: { fontSize: 10, fontFamily: 'Inter_800ExtraBold' },
  recTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  recBody: { fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 18 },
  activityList: { gap: 12 },
  activityItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  activityIconWrapper: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  activityContent: { flex: 1, marginLeft: 12 },
  activityTitle: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  activityDetail: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 2 },
  activityTime: { fontSize: 11, fontFamily: 'Inter_500Medium' },
});
