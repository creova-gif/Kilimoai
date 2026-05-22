import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
  TouchableOpacity, Platform, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { tr } from '@/src/utils/translations';
import { Card } from '@/src/components/ui/Card';
import { supabase, API_BASE } from '@/src/lib/supabase';

interface DashboardData {
  stats: { activeCrops: number; pendingTasks: number; revenue: string; soilHealth: string };
  weather: { temp: number; condition: string; humidity: number; rainfall: number; wind: number };
  tasks: Array<{ id: number; title: string; priority: string; completed: boolean }>;
  marketTrends: Array<{ crop: string; price: number; trend: string; change: number }>;
}

const QUICK_ACTIONS = [
  { id: 'ai', icon: 'chatbubble-ellipses' as const, labelKey: 'aiChat' as const, color: '#1565C0', bg: '#E3F2FD' },
  { id: 'diagnosis', icon: 'camera' as const, labelKey: 'cropDiagnosis' as const, color: '#2E7D32', bg: '#E8F5E9' },
  { id: 'market', icon: 'trending-up' as const, labelKey: 'marketPrices' as const, color: '#F57F17', bg: '#FFF8E1' },
  { id: 'weather', icon: 'cloud' as const, labelKey: 'weather' as const, color: '#1565C0', bg: '#E3F2FD' },
  { id: 'tasks', icon: 'checkbox' as const, labelKey: 'tasks' as const, color: '#6A1B9A', bg: '#F3E5F5' },
  { id: 'finance', icon: 'wallet' as const, labelKey: 'finance' as const, color: '#E65100', bg: '#FBE9E7' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, language } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_BASE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_dashboard', userId: user?.id }),
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setData(getMockData());
      }
    } catch {
      setData(getMockData());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboard();
  }, []);

  const getMockData = (): DashboardData => ({
    stats: { activeCrops: 4, pendingTasks: 7, revenue: 'KSh 45,200', soilHealth: '82%' },
    weather: { temp: 24, condition: 'Partly Cloudy', humidity: 68, rainfall: 12, wind: 14 },
    tasks: [
      { id: 1, title: language === 'sw' ? 'Nyunyizia maji mahindi' : 'Water maize crops', priority: 'high', completed: false },
      { id: 2, title: language === 'sw' ? 'Weka mbolea shambani' : 'Apply fertilizer to field 2', priority: 'medium', completed: false },
      { id: 3, title: language === 'sw' ? 'Kagua afya ya mifugo' : 'Check livestock health', priority: 'low', completed: true },
    ],
    marketTrends: [
      { crop: language === 'sw' ? 'Mahindi' : 'Maize', price: 45, trend: 'up', change: 5.2 },
      { crop: language === 'sw' ? 'Maharagwe' : 'Beans', price: 120, trend: 'up', change: 3.1 },
      { crop: language === 'sw' ? 'Viazi' : 'Potatoes', price: 35, trend: 'down', change: -2.4 },
      { crop: language === 'sw' ? 'Nyanya' : 'Tomatoes', price: 80, trend: 'up', change: 8.7 },
    ],
  });

  const greetingKey = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening';
  const greetings: Record<string, Record<'en' | 'sw', string>> = {
    morning: { en: 'Good morning', sw: 'Habari za asubuhi' },
    afternoon: { en: 'Good afternoon', sw: 'Habari za mchana' },
    evening: { en: 'Good evening', sw: 'Habari za jioni' },
  };
  const greeting = greetings[greetingKey][language];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <View>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'Farmer'} 👋</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === 'web' ? 34 + 84 : 80 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Weather Card */}
            {data?.weather && (
              <Card style={styles.weatherCard} padded={false}>
                <View style={styles.weatherTop}>
                  <View>
                    <Text style={styles.weatherTemp}>{data.weather.temp}°C</Text>
                    <Text style={styles.weatherCondition}>{data.weather.condition}</Text>
                  </View>
                  <Ionicons name="partly-sunny" size={48} color="#fff" />
                </View>
                <View style={styles.weatherStats}>
                  <WeatherStat icon="water" value={`${data.weather.humidity}%`} label={tr('humidity', language)} />
                  <WeatherStat icon="rainy" value={`${data.weather.rainfall}mm`} label={tr('rainfall', language)} />
                  <WeatherStat icon="speedometer" value={`${data.weather.wind}km/h`} label={tr('wind', language)} />
                </View>
              </Card>
            )}

            {/* Stats Row */}
            {data?.stats && (
              <View style={styles.statsRow}>
                <StatCard icon="leaf" label={tr('activeCrops', language)} value={String(data.stats.activeCrops)} color={Colors.primary} />
                <StatCard icon="checkbox-outline" label={tr('pendingTasks', language)} value={String(data.stats.pendingTasks)} color="#F57F17" />
                <StatCard icon="cash-outline" label={tr('monthlyRevenue', language)} value={data.stats.revenue} color="#1565C0" />
              </View>
            )}

            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>{tr('quickActions', language)}</Text>
            <View style={styles.quickGrid}>
              {QUICK_ACTIONS.map(a => (
                <TouchableOpacity
                  key={a.id}
                  style={styles.quickCard}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (a.id === 'ai') router.push('/(tabs)/ai');
                    else if (a.id === 'diagnosis') router.push('/diagnosis');
                    else if (a.id === 'market') router.push('/(tabs)/market');
                    else if (a.id === 'tasks') router.push('/(tabs)/farm');
                    else if (a.id === 'finance') router.push('/(tabs)/finance');
                  }}
                >
                  <View style={[styles.quickIcon, { backgroundColor: a.bg }]}>
                    <Ionicons name={a.icon} size={24} color={a.color} />
                  </View>
                  <Text style={styles.quickLabel}>{tr(a.labelKey, language)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tasks */}
            {data?.tasks && (
              <>
                <Text style={styles.sectionTitle}>{tr('todayTasks', language)}</Text>
                <Card padded={false} style={{ overflow: 'hidden' }}>
                  {data.tasks.map((task, i) => (
                    <View key={task.id} style={[styles.taskRow, i < data.tasks.length - 1 && styles.taskDivider]}>
                      <View style={[styles.taskDot, {
                        backgroundColor: task.priority === 'high' ? Colors.error : task.priority === 'medium' ? Colors.warning : Colors.gray400,
                      }]} />
                      <Text style={[styles.taskTitle, task.completed && styles.taskDone]} numberOfLines={1}>{task.title}</Text>
                      {task.completed && <Ionicons name="checkmark-circle" size={18} color={Colors.success} />}
                    </View>
                  ))}
                </Card>
              </>
            )}

            {/* Market Trends */}
            {data?.marketTrends && (
              <>
                <Text style={styles.sectionTitle}>{tr('marketTrends', language)}</Text>
                <Card padded={false} style={{ overflow: 'hidden' }}>
                  {data.marketTrends.map((item, i) => (
                    <View key={item.crop} style={[styles.marketRow, i < data.marketTrends.length - 1 && styles.taskDivider]}>
                      <Text style={styles.cropName}>{item.crop}</Text>
                      <Text style={styles.cropPrice}>KSh {item.price}/kg</Text>
                      <View style={[styles.changeBadge, { backgroundColor: item.trend === 'up' ? Colors.successLight : Colors.errorLight }]}>
                        <Ionicons name={item.trend === 'up' ? 'trending-up' : 'trending-down'} size={12} color={item.trend === 'up' ? Colors.success : Colors.error} />
                        <Text style={[styles.changeText, { color: item.trend === 'up' ? Colors.success : Colors.error }]}>
                          {Math.abs(item.change)}%
                        </Text>
                      </View>
                    </View>
                  ))}
                </Card>
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function WeatherStat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <View style={styles.weatherStat}>
      <Ionicons name={icon as any} size={16} color="rgba(255,255,255,0.9)" />
      <Text style={styles.weatherStatValue}>{value}</Text>
      <Text style={styles.weatherStatLabel}>{label}</Text>
    </View>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color, borderTopWidth: 3 }]}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={styles.statValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.statLabel} numberOfLines={2}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    backgroundColor: Colors.primary, paddingHorizontal: 20, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  userName: { fontSize: 22, fontWeight: '700' as const, color: '#fff' },
  headerRight: { flexDirection: 'row', gap: 12 },
  headerBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: 16, gap: 16 },
  weatherCard: { backgroundColor: Colors.primary, padding: 16 },
  weatherTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  weatherTemp: { fontSize: 48, fontWeight: '700' as const, color: '#fff' },
  weatherCondition: { fontSize: 16, color: 'rgba(255,255,255,0.85)' },
  weatherStats: { flexDirection: 'row', justifyContent: 'space-around' },
  weatherStat: { alignItems: 'center', gap: 4 },
  weatherStatValue: { fontSize: 14, fontWeight: '600' as const, color: '#fff' },
  weatherStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1, backgroundColor: Colors.card, borderRadius: Colors.radius,
    padding: 12, gap: 6, borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  statValue: { fontSize: 15, fontWeight: '700' as const, color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textMuted, lineHeight: 15 },
  sectionTitle: { fontSize: 17, fontWeight: '700' as const, color: Colors.text },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: {
    width: '30%', flex: 1, minWidth: 90,
    backgroundColor: Colors.card, borderRadius: Colors.radius,
    padding: 14, alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  quickIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 11, fontWeight: '500' as const, color: Colors.text, textAlign: 'center' },
  taskRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 14, gap: 12,
  },
  taskDivider: { borderBottomWidth: 1, borderBottomColor: Colors.divider },
  taskDot: { width: 8, height: 8, borderRadius: 4 },
  taskTitle: { flex: 1, fontSize: 14, color: Colors.text },
  taskDone: { textDecorationLine: 'line-through', color: Colors.textMuted },
  marketRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 8,
  },
  cropName: { flex: 1, fontSize: 14, fontWeight: '500' as const, color: Colors.text },
  cropPrice: { fontSize: 14, fontWeight: '600' as const, color: Colors.text },
  changeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: Colors.radiusFull,
  },
  changeText: { fontSize: 12, fontWeight: '600' as const },
});
