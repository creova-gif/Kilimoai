import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Home,
  Map as MapIcon,
  ClipboardList,
  User as UserIcon,
  Settings,
  QrCode,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  BrainCircuit, 
  Camera, 
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
  CloudRain
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
  { id: 'scan', label: 'Uchunguzi', icon: <Camera size={24} color="#fff" strokeWidth={2} />, color: '#2E7D32', desc: 'AI Crop Scan' },
  { id: 'tasks', label: 'Usimamizi', icon: <LayoutGrid size={24} color="#fff" strokeWidth={2} />, color: '#3b82f6', desc: 'Farm Tasks' },
  { id: 'market', label: 'Soko', icon: <TrendingUp size={24} color="#fff" strokeWidth={2} />, color: '#f59e0b', desc: 'Market Prices' },
  { id: 'crop-planning', label: 'Panga Mazao', icon: <Leaf size={24} color="#fff" strokeWidth={2} />, color: '#10b981', desc: 'AI Crop Planning' },
  { id: 'contracts', label: 'Mikataba', icon: <BarChart3 size={24} color="#fff" strokeWidth={2} />, color: '#8b5cf6', desc: 'Contract Farming' },
];

export default function HomeScreen() {
  const { colors, radius, shadows } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);

  const agroId = useKilimoStore((s) => s.agroId);
  const isOffline = useKilimoStore((s) => s.isOffline);
  const syncQueue = useKilimoStore((s) => s.syncQueue);
  const farmVitals = useKilimoStore((s) => s.farmVitals);
  const unreadCount = useKilimoStore((s) => s.unreadCount);
  const farmProfile = useKilimoStore((s) => s.farmProfile);
  const language = useKilimoStore((s) => s.language);

  // Supabase states
  const [salesTotal, setSalesTotal] = useState<number>(9850.25);
  const [dbTransactions, setDbTransactions] = useState<any[]>([
    { id: '1', title: 'Compost Sale', amount: 1200.00, type: 'sale', status: 'completed', created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
    { id: '2', title: 'Urea Purchase', amount: 350.00, type: 'expense', status: 'completed', created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: '3', title: 'Crop Insurance', amount: 150.00, type: 'expense', status: 'pending', created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
    { id: '4', title: 'Maize Harvest Sale', amount: 8150.25, type: 'sale', status: 'completed', created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() },
  ]);

  const recommendations = useMemo(
    () => generateRecommendations({ profile: farmProfile, vitals: farmVitals, language }),
    [farmProfile, farmVitals, language]
  );

  const FARM_STATS = [
    { id: 'soil', label: 'Soil Health', value: `${farmVitals.soilHealth}%`, icon: <Leaf size={18} color="#2E7D32" strokeWidth={2} />, color: '#2E7D32' },
    { id: 'moisture', label: 'Moisture', value: `${farmVitals.moisture}%`, icon: <Droplets size={18} color="#3b82f6" strokeWidth={2} />, color: '#3b82f6' },
    { id: 'weather', label: 'Joto', value: `${farmVitals.temperature}°C`, icon: <Sun size={18} color="#f59e0b" strokeWidth={2} />, color: '#f59e0b' },
    { id: 'yield', label: 'Mavuno', value: `${farmVitals.yieldEstimate}t`, icon: <TrendingUp size={18} color="#8b5cf6" strokeWidth={2} />, color: '#8b5cf6' },
  ];

  const setLastSyncedAt = useKilimoStore((s) => s.setLastSyncedAt);
  const { forceSync } = useSyncEngine();

  // Format Helper: e.g. 9850.25 -> "$9.850,25"
  const formatSales = useCallback((num: number) => {
    const parts = num.toFixed(2).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const decimalPart = parts[1];
    return `$${integerPart},${decimalPart}`;
  }, []);

  // Fetch from Supabase
  const fetchDataFromSupabase = useCallback(async () => {
    try {
      const { getSupabase } = require('../../lib/supabase');
      const sb = getSupabase();
      if (sb && agroId?.id) {
        // 1. Fetch sales_total
        const { data: profileData, error: profileErr } = await sb
          .from('agro_profiles')
          .select('sales_total')
          .eq('user_id', agroId.id)
          .maybeSingle();

        if (!profileErr && profileData && profileData.sales_total !== undefined && profileData.sales_total !== null) {
          setSalesTotal(profileData.sales_total);
        }

        // 2. Fetch transactions
        const { data: transData, error: transErr } = await sb
          .from('transactions')
          .select('*')
          .eq('user_id', agroId.id)
          .order('created_at', { ascending: false })
          .limit(4);

        if (!transErr && transData && transData.length > 0) {
          setDbTransactions(transData);
        }
      }
    } catch (err) {
      console.warn('[HomeScreen] Supabase fetch error, using robust fallback data:', err);
    }
  }, [agroId?.id]);

  useEffect(() => {
    fetchDataFromSupabase();
  }, [fetchDataFromSupabase]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await forceSync();
    await fetchDataFromSupabase();
    setLastSyncedAt(new Date().toISOString());
    setRefreshing(false);
  }, [setLastSyncedAt, forceSync, fetchDataFromSupabase]);

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <StatusBar barStyle="dark-content" />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2E7D32" />}
        >
          {/* Header Section */}
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
            <View>
              <View style={[styles.statusBadge, { backgroundColor: isOffline ? '#fee2e2' : '#E8F5E9' }]}>
                <View style={[styles.statusDot, { backgroundColor: isOffline ? '#ef4444' : '#2E7D32' }]} />
                <Text style={[styles.statusText, { color: isOffline ? '#ef4444' : '#2E7D32' }]}>
                  {isOffline ? `OFFLINE • ${syncQueue.length} IN QUEUE` : 'SYSTEMS OPTIMAL'}
                </Text>
              </View>
              <Text style={[styles.greeting, { color: '#5A6E85' }]}>KARIBU TENA,</Text>
              <Text style={[styles.name, { color: '#1E2A3E' }]}>{agroId?.name?.split(' ')[0] ?? 'Mkulima'}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/notifications' as any); }}
                style={[styles.actionCircle, { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderWidth: 1 }]}
                accessibilityLabel="Notifications"
                accessibilityRole="button"
              >
                {isOffline ? <WifiOff size={22} color="#ef4444" strokeWidth={2} /> : <Bell size={22} color="#1E2A3E" strokeWidth={2} />}
                {unreadCount > 0 && !isOffline && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/(tabs)/profile' as any)} accessibilityLabel="Profile" accessibilityRole="button">
                <View style={[styles.avatarContainer, { borderColor: '#2E7D32' }]}>
                  {agroId?.avatarUrl ? (
                    <Image source={{ uri: agroId.avatarUrl }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, { backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' }]}>
                      <Text style={{ color: '#2E7D32', fontFamily: 'Inter_800ExtraBold', fontSize: 18 }}>
                        {agroId?.name?.[0]?.toUpperCase() || '?'}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Sales Card Dashboard */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Card variant="solid" style={[styles.walletCard, { backgroundColor: '#2E7D32', borderColor: '#2E7D32', ...shadows.sm }]}>
              <View style={styles.walletHeader}>
                <View style={[styles.agroIdBadge, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
                  <Fingerprint size={14} color="#FFFFFF" strokeWidth={2} />
                  <Text style={[styles.agroIdText, { color: '#FFFFFF' }]}>AGRO ID SECURED</Text>
                </View>
                <View style={[styles.mobileMoneyTag, { backgroundColor: agroId?.mpesaLinked ? '#1B5E20' : '#F59E0B' }]}>
                  <Text style={styles.mobileMoneyText}>{agroId?.mpesaLinked ? 'M-PESA LINKED' : 'LINK M-PESA'}</Text>
                </View>
              </View>

              <Text style={[styles.balanceLabel, { color: 'rgba(255, 255, 255, 0.8)' }]}>Sales Total (USD)</Text>
              <View style={styles.balanceRow}>
                <Text style={[styles.balanceAmount, { color: '#FFFFFF' }]}>{formatSales(salesTotal)}</Text>
              </View>

              <View style={styles.walletActions}>
                <TouchableOpacity
                  style={[styles.walletBtn, { backgroundColor: '#FFFFFF' }]}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/agro-id' as any); }}
                  accessibilityRole="button"
                  accessibilityLabel="Deposit funds"
                >
                  <ArrowDownLeft size={18} color="#2E7D32" strokeWidth={2} />
                  <Text style={[styles.walletBtnText, { color: '#2E7D32' }]}>Deposit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.walletBtn, { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.25)' }]}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/wallet-admin' as any); }}
                  accessibilityRole="button"
                  accessibilityLabel="Pay cooperative dues"
                >
                  <ArrowUpRight size={18} color="#FFFFFF" strokeWidth={2} />
                  <Text style={[styles.walletBtnText, { color: '#FFFFFF' }]}>Pay Co-op</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </Animated.View>

          {/* Premium Weather Card */}
          <Animated.View entering={FadeInDown.delay(250).springify()}>
            <Card variant="solid" style={[styles.weatherCard, { borderColor: '#E2E8F0', borderWidth: 1, ...shadows.sm }]}>
              <View style={styles.weatherHeader}>
                <View>
                  <Text style={styles.weatherLocation}>Vymyk, Lviv Oblast, Ukraine</Text>
                  <Text style={styles.weatherStatus}>Rainy / Overcast</Text>
                </View>
                <View style={styles.weatherTempBadge}>
                  <CloudRain size={28} color="#2E7D32" strokeWidth={2} />
                  <Text style={styles.weatherTemp}>+16° / +10°</Text>
                </View>
              </View>
              <View style={styles.weatherDetails}>
                <View style={styles.weatherDetailItem}>
                  <Text style={styles.weatherDetailLabel}>HUMIDITY</Text>
                  <Text style={styles.weatherDetailVal}>82%</Text>
                </View>
                <View style={styles.weatherDetailDivider} />
                <View style={styles.weatherDetailItem}>
                  <Text style={styles.weatherDetailLabel}>WIND</Text>
                  <Text style={styles.weatherDetailVal}>14 km/h</Text>
                </View>
                <View style={styles.weatherDetailDivider} />
                <View style={styles.weatherDetailItem}>
                  <Text style={styles.weatherDetailLabel}>PRECIP</Text>
                  <Text style={styles.weatherDetailVal}>65%</Text>
                </View>
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
              <Card variant="glass" style={[styles.aiHero, { borderColor: '#E2E8F0', borderWidth: 1, ...shadows.sm }]}>
                <View style={styles.aiHeroContent}>
                  <View style={[styles.aiIconMain, { backgroundColor: '#E8F5E9' }]}>
                    <BrainCircuit size={32} color="#2E7D32" strokeWidth={2} />
                  </View>
                  <View style={styles.aiRight}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Sparkles size={12} color="#2E7D32" style={{ marginRight: 4 }} />
                      <Text style={[styles.aiTitle, { color: '#2E7D32' }]}>Sankofa AI</Text>
                    </View>
                    <Text style={[styles.aiMessage, { color: '#1E2A3E' }]}>
                      {language === 'sw' ? '"Unyevu wa Shamba B unashuka haraka. Napendekeza umwagiliaji..."' : '"Block B moisture dropping faster than predicted. Recommended: irrigate..."'}
                    </Text>
                    <View style={styles.aiActionRow}>
                      <Text style={[styles.aiActionLabel, { color: '#2E7D32' }]}>SOMA ZAIDI</Text>
                      <ArrowRight size={14} color="#2E7D32" strokeWidth={2} />
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
                <LinearGradient colors={[action.color, action.color + 'cc']} style={[styles.actionCard, { borderRadius: radius.lg }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
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

          {/* Transaction History Section */}
          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: '#1E2A3E' }]}>Kumbukumbu za Malipo (Transactions)</Text>
          </Animated.View>
          <View style={styles.transactionList}>
            {dbTransactions.map((tx) => {
              const isCompleted = tx.status === 'completed';
              const isSale = tx.type === 'sale';
              return (
                <Card key={tx.id} variant="solid" style={[styles.txItem, { borderColor: '#E2E8F0', borderWidth: 1 }]}>
                  <View style={[styles.txIconBg, { backgroundColor: isCompleted ? '#E8F5E9' : '#FEF3C7' }]}>
                    {isCompleted ? (
                      <CheckCircle2 size={20} color="#2E7D32" strokeWidth={2} />
                    ) : (
                      <Clock size={20} color="#F59E0B" strokeWidth={2} />
                    )}
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={[styles.txTitle, { color: '#1E2A3E' }]}>{tx.title}</Text>
                    <Text style={[styles.txDate, { color: '#5A6E85' }]}>
                      {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </View>
                  <View style={styles.txAmountWrapper}>
                    <Text style={[styles.txAmount, { color: isSale ? '#2E7D32' : '#EF4444' }]}>
                      {isSale ? '+' : '-'}{formatSales(tx.amount)}
                    </Text>
                    <View style={[styles.txBadge, { backgroundColor: isCompleted ? '#E8F5E9' : '#FEF3C7' }]}>
                      <Text style={[styles.txBadgeText, { color: isCompleted ? '#2E7D32' : '#D97706' }]}>
                        {isCompleted ? 'COMPLETED' : 'PENDING'}
                      </Text>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>

          {/* Farm Vitale Grid */}
          <Animated.View entering={FadeInDown.delay(500).springify()} style={[styles.sectionHeader, { marginTop: 24 }]}>
            <Text style={[styles.sectionTitle, { color: '#1E2A3E' }]}>Afya ya Shamba</Text>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/analytics' as any); }}
              accessibilityRole="button"
              accessibilityLabel="View farm sensors"
            >
              <Text style={{ color: '#2E7D32', fontFamily: 'Inter_700Bold', fontSize: 13 }}>SENSORS →</Text>
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.statsGrid}>
            {FARM_STATS.map((stat, idx) => (
              <Animated.View key={stat.id} entering={FadeInDown.delay(500 + idx * 50).springify()} style={styles.statCardContainer}>
                <Card variant="solid" style={{ padding: 12, borderColor: '#E2E8F0', borderWidth: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View style={[styles.statIconBg, { backgroundColor: '#E8F5E9' }]}>{stat.icon}</View>
                    <Text style={[styles.statLabel, { color: '#5A6E85', marginLeft: 8 }]}>{stat.label}</Text>
                  </View>
                  <Text style={[styles.statValue, { color: '#1E2A3E' }]}>{stat.value}</Text>
                </Card>
              </Animated.View>
            ))}
          </View>

          {/* Recommendations */}
          <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Lightbulb size={18} color="#2E7D32" strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: '#1E2A3E' }]}>Sankofa AI</Text>
            </View>
            <Text style={{ color: '#5A6E85', fontFamily: 'Inter_700Bold', fontSize: 11 }}>{recommendations.length} NEW</Text>
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
                    <Card variant="solid" style={[styles.recCard, { borderLeftColor: col, borderLeftWidth: 4, borderColor: '#E2E8F0', borderWidth: 1 }]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Text style={[styles.recCat, { color: col }]}>{rec.category.toUpperCase()}</Text>
                      </View>
                      <Text style={[styles.recTitle, { color: '#1E2A3E' }]}>{rec.title}</Text>
                      <Text style={[styles.recBody, { color: '#5A6E85' }]}>{rec.body}</Text>
                    </Card>
                  </Pressable>
                </Animated.View>
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 8, alignSelf: 'flex-start' },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  greeting: { fontSize: 12, fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  name: { fontSize: 28, fontFamily: 'Inter_800ExtraBold', letterSpacing: -1 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  actionCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  notificationBadge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' },
  notificationBadgeText: { display: 'none' },
  avatarContainer: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, padding: 2 },
  avatar: { width: '100%', height: '100%', borderRadius: 20 },
  walletCard: { marginBottom: 16, padding: 16, borderRadius: 16 },
  walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  agroIdBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6 },
  agroIdText: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.5 },
  mobileMoneyTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  mobileMoneyText: { color: '#fff', fontSize: 10, fontFamily: 'Inter_800ExtraBold' },
  balanceLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', marginBottom: 4 },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 20 },
  balanceAmount: { fontSize: 36, fontFamily: 'Inter_800ExtraBold', letterSpacing: -1 },
  walletActions: { flexDirection: 'row', gap: 12 },
  walletBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, gap: 6 },
  walletBtnText: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  weatherCard: { marginBottom: 16, padding: 16, borderRadius: 16 },
  weatherHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  weatherLocation: { fontSize: 16, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  weatherStatus: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#5A6E85', marginTop: 2 },
  weatherTempBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  weatherTemp: { fontSize: 16, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  weatherDetails: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  weatherDetailItem: { alignItems: 'center' },
  weatherDetailLabel: { fontSize: 9, fontFamily: 'Inter_800ExtraBold', color: '#5A6E85', marginBottom: 4 },
  weatherDetailVal: { fontSize: 14, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  weatherDetailDivider: { width: 1, height: 24, backgroundColor: '#E2E8F0' },
  aiHero: { marginBottom: 24, padding: 16, borderRadius: 16 },
  aiHeroContent: { flexDirection: 'row', alignItems: 'center' },
  aiIconMain: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  aiRight: { flex: 1 },
  aiTitle: { fontSize: 16, fontFamily: 'Inter_800ExtraBold' },
  aiMessage: { fontSize: 14, fontFamily: 'Inter_500Medium', lineHeight: 20, marginBottom: 12 },
  aiActionRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  aiActionLabel: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  actionScroll: { paddingRight: 40, gap: 12, marginBottom: 24 },
  actionCardWrapper: { width: SCREEN_WIDTH * 0.4 },
  actionCard: { padding: 16, height: 120, justifyContent: 'space-between' },
  actionIconOuter: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  actionLabel: { color: '#fff', fontSize: 16, fontFamily: 'Inter_800ExtraBold', marginBottom: 2 },
  actionDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: 'Inter_500Medium' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_800ExtraBold' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24, gap: 8 },
  statCardContainer: { width: (SCREEN_WIDTH - 40) / 2 },
  statIconBg: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  statLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  statValue: { fontSize: 22, fontFamily: 'Inter_800ExtraBold' },
  recCard: { padding: 12, borderRadius: 16 },
  recCat: { fontSize: 10, fontFamily: 'Inter_800ExtraBold' },
  recTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  recBody: { fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 18 },
  transactionList: { gap: 8 },
  txItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16 },
  txIconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  txInfo: { flex: 1, marginLeft: 12 },
  txTitle: { fontSize: 15, fontFamily: 'Inter_800ExtraBold' },
  txDate: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 2 },
  txAmountWrapper: { alignItems: 'flex-end' },
  txAmount: { fontSize: 15, fontFamily: 'Inter_800ExtraBold' },
  txBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  txBadgeText: { fontSize: 8, fontFamily: 'Inter_800ExtraBold' }
});
