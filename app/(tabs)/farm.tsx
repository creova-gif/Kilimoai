import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform, 
  StatusBar,
  TextInput,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Sprout, 
  Box, 
  Activity, 
  ChevronRight, 
  Calendar, 
  Plus, 
  Check, 
  SquarePen, 
  Database,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import { Card } from '../../components/ui/Card';

interface FertilizerLog {
  id: string;
  date: string;
  label: string; // e.g. "Urea" or "Compost"
  amount: string; // e.g. "50 kg"
  crop: string;
  synced: boolean;
  notes?: string;
}

export default function FarmHub() {
  const router = useRouter();
  const { colors, radius, shadows } = useTheme();
  const language = useKilimoStore((s) => s.language);
  const farmProfile = useKilimoStore((s) => s.farmProfile);
  const agroId = useKilimoStore((s) => s.agroId);
  const isOffline = useKilimoStore((s) => s.isOffline);
  const addToSyncQueue = useKilimoStore((s) => s.addToSyncQueue);
  const addNotification = useKilimoStore((s) => s.addNotification);

  // Form states
  const [compostInput, setCompostInput] = useState('');
  const [ureaInput, setUreaInput] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(farmProfile?.primaryCrops?.[0] ?? 'Mahindi');

  // Logs state
  const [logs, setLogs] = useState<FertilizerLog[]>([
    { id: '1', date: 'May 26', label: 'Urea', amount: '50 kg', crop: 'Mahindi', synced: true },
    { id: '2', date: 'May 25', label: 'Compost', amount: '120 kg', crop: 'Maharage', synced: true },
    { id: '3', date: 'May 24', label: 'Urea', amount: '40 kg', crop: 'Mpunga', synced: true },
    { id: '4', date: 'May 22', label: 'Compost', amount: '80 kg', crop: 'Mahindi', synced: true },
    { id: '5', date: 'May 20', label: 'Urea', amount: '30 kg', crop: 'Kahawa', synced: true },
  ]);

  // Fetch logs from Supabase
  const fetchLogs = useCallback(async () => {
    try {
      const { getSupabase } = require('../../lib/supabase');
      const sb = getSupabase();
      if (sb && agroId?.id) {
        const { data, error } = await sb
          .from('fertilizer_logs')
          .select('*')
          .eq('user_id', agroId.id)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map((d: any) => ({
            id: d.id,
            date: new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            label: d.type === 'urea' ? 'Urea' : 'Compost',
            amount: `${d.amount} kg`,
            crop: d.crop || 'Mahindi',
            synced: true,
            notes: d.notes
          }));
          setLogs(mapped);
        }
      }
    } catch (err) {
      console.warn('[TrackRecords] Failed to fetch logs from Supabase, using local defaults:', err);
    }
  }, [agroId?.id]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Log Application action
  const handleLogApplication = async () => {
    const compostVal = parseFloat(compostInput) || 0;
    const ureaVal = parseFloat(ureaInput) || 0;

    if (compostVal === 0 && ureaVal === 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Alert.alert(
        language === 'sw' ? 'Weka Vipimo' : 'Enter Quantities',
        language === 'sw' ? 'Tafadhali weka kiasi cha mbolea ya samadi au urea.' : 'Please enter a quantity for compost or urea.'
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const newLogs: FertilizerLog[] = [];
    const timestamp = new Date().toISOString();
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (compostVal > 0) {
      newLogs.push({
        id: `compost_${Date.now()}`,
        date: dateStr,
        label: 'Compost',
        amount: `${compostVal} kg`,
        crop: selectedCrop,
        synced: !isOffline
      });
    }

    if (ureaVal > 0) {
      newLogs.push({
        id: `urea_${Date.now()}`,
        date: dateStr,
        label: 'Urea',
        amount: `${ureaVal} kg`,
        crop: selectedCrop,
        synced: !isOffline
      });
    }

    // Update local state
    setLogs((prev) => [...newLogs, ...prev]);
    setCompostInput('');
    setUreaInput('');

    // Write to Supabase or Sync Queue
    try {
      const { getSupabase } = require('../../lib/supabase');
      const sb = getSupabase();

      for (const logItem of newLogs) {
        const payload = {
          user_id: agroId?.id || 'demo-user-id',
          type: logItem.label.toLowerCase(),
          amount: parseFloat(logItem.amount),
          crop: logItem.crop,
          created_at: timestamp
        };

        if (isOffline || !sb) {
          // Add to offline sync queue
          addToSyncQueue({
            type: 'irrigation_log', // maps to log event in queue
            payload
          });
        } else {
          // Direct write
          const { error } = await sb.from('fertilizer_logs').insert(payload);
          if (error) {
            console.warn('[TrackRecords] Failed to save log directly, queuing offline:', error.message);
            addToSyncQueue({
              type: 'irrigation_log',
              payload
            });
          }
        }
      }

      addNotification({
        title: language === 'sw' ? 'Mbolea Imerekodiwa' : 'Fertilizer Logged',
        body: language === 'sw' ? 'Kumbukumbu zako za mbolea zimesasishwa.' : 'Your fertilizer track records have been updated.',
        type: 'success'
      });

    } catch (err) {
      console.warn('[TrackRecords] Database write exception, queueing offline:', err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#1E2A3E' }]}>
            {language === 'sw' ? 'Kumbukumbu za Mbolea' : 'Fertilizer Track Records'}
          </Text>
          <Text style={styles.subtitle}>
            {language === 'sw' ? 'Fuatilia matumizi ya mbolea ya samadi na urea' : 'Monitor compost and urea applications over time'}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Horizontal scroll with exact dates and stacked labels */}
          <View style={styles.horizontalSection}>
            <Text style={styles.sectionHeading}>
              {language === 'sw' ? 'KALENDA YA MATUMIZI' : 'APPLICATION CALENDAR'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {logs.map((log) => (
                <View key={log.id} style={[styles.dateCard, { borderColor: '#E2E8F0', borderWidth: 1 }]}>
                  <Text style={styles.dateText}>{log.date}</Text>
                  <View style={[styles.indicatorDot, { backgroundColor: log.label === 'Urea' ? '#3b82f6' : '#2E7D32' }]} />
                  <Text style={styles.labelText}>{log.label}</Text>
                  <Text style={styles.amountText}>{log.amount}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Quick Log Form */}
          <Card variant="solid" style={[styles.logCard, { borderColor: '#E2E8F0', borderWidth: 1, ...shadows.sm }]}>
            <Text style={styles.cardHeading}>
              {language === 'sw' ? 'Weka Kumbukumbu Mpya' : 'Log New Application'}
            </Text>

            {/* Crop selector */}
            <Text style={styles.inputLabel}>{language === 'sw' ? 'Zao lililowekewa' : 'Target Crop'}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cropSelector}>
              {(farmProfile?.primaryCrops ?? ['Mahindi', 'Maharage', 'Mpunga']).map((crop) => {
                const isSelected = selectedCrop === crop;
                return (
                  <TouchableOpacity
                    key={crop}
                    onPress={() => { Haptics.selectionAsync(); setSelectedCrop(crop); }}
                    style={[
                      styles.cropPill,
                      { borderColor: isSelected ? '#2E7D32' : '#E2E8F0', backgroundColor: isSelected ? '#E8F5E9' : '#FFFFFF' }
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                  >
                    <Text style={[styles.cropPillText, { color: isSelected ? '#2E7D32' : '#1E2A3E' }]}>{crop}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.inputGrid}>
              <View style={styles.inputCol}>
                <Text style={styles.inputLabel}>COMPOST (KG)</Text>
                <TextInput
                  value={compostInput}
                  onChangeText={setCompostInput}
                  keyboardType="numeric"
                  placeholder="e.g. 50"
                  style={styles.textInput}
                  accessibilityLabel="Compost quantity in kilograms"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.inputLabel}>UREA (KG)</Text>
                <TextInput
                  value={ureaInput}
                  onChangeText={setUreaInput}
                  keyboardType="numeric"
                  placeholder="e.g. 25"
                  style={styles.textInput}
                  accessibilityLabel="Urea quantity in kilograms"
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.submitBtn, { backgroundColor: '#2E7D32' }]} 
              onPress={handleLogApplication}
              accessibilityRole="button"
              accessibilityLabel="Save application log"
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.submitBtnText}>
                {language === 'sw' ? 'Rekodi Matumizi' : 'Log Application'}
              </Text>
            </TouchableOpacity>
          </Card>

          {/* Timeline list */}
          <Text style={[styles.sectionHeading, { marginTop: 16 }]}>
            {language === 'sw' ? 'HISTORIA YA MATUMIZI' : 'APPLICATION HISTORY'}
          </Text>

          <View style={styles.timelineContainer}>
            {logs.map((log, idx) => {
              const isLast = idx === logs.length - 1;
              return (
                <View key={log.id} style={styles.timelineRow}>
                  {/* Timeline lines and dots */}
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, { backgroundColor: log.label === 'Urea' ? '#3b82f6' : '#2E7D32' }]}>
                      <Calendar size={12} color="#FFFFFF" strokeWidth={2} />
                    </View>
                    {!isLast && <View style={styles.timelineLine} />}
                  </View>

                  <View style={styles.timelineRight}>
                    <View style={styles.timelineHeaderRow}>
                      <Text style={styles.timelineTitle}>
                        {log.label} Application
                      </Text>
                      <Text style={styles.timelineDate}>{log.date}</Text>
                    </View>
                    <Text style={styles.timelineDetail}>
                      {log.amount} applied on {log.crop}
                    </Text>
                    <View style={styles.syncBadgeRow}>
                      <Database size={10} color={log.synced ? '#2E7D32' : '#F59E0B'} strokeWidth={2} />
                      <Text style={[styles.syncText, { color: log.synced ? '#2E7D32' : '#D97706' }]}>
                        {log.synced ? 'Synced to Cloud' : 'Offline Queue'}
                      </Text>
                    </View>
                  </View>
                </View>
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
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontFamily: 'Inter_900Black', letterSpacing: -0.8 },
  subtitle: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#5A6E85', marginTop: 4 },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100, gap: 16 },
  horizontalSection: { gap: 8 },
  sectionHeading: { fontSize: 11, fontFamily: 'Inter_800ExtraBold', color: '#5A6E85', letterSpacing: 1.2, marginLeft: 4 },
  horizontalScroll: { gap: 10, paddingVertical: 4 },
  dateCard: {
    width: 90,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center'
  },
  dateText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#5A6E85' },
  indicatorDot: { width: 6, height: 6, borderRadius: 3, marginVertical: 6 },
  labelText: { fontSize: 14, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  amountText: { fontSize: 11, fontFamily: 'Inter_500Medium', color: '#5A6E85', marginTop: 2 },
  logCard: { padding: 16, borderRadius: 16, gap: 12 },
  cardHeading: { fontSize: 16, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E', marginBottom: 4 },
  cropSelector: { gap: 8, paddingVertical: 4 },
  cropPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center'
  },
  cropPillText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  inputGrid: { flexDirection: 'row', gap: 12 },
  inputCol: { flex: 1, gap: 6 },
  inputLabel: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', color: '#5A6E85', letterSpacing: 1 },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E2A3E',
    fontFamily: 'Inter_600SemiBold',
    backgroundColor: '#FFFFFF'
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 8
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_800ExtraBold' },
  timelineContainer: { marginTop: 12, gap: 0 },
  timelineRow: { flexDirection: 'row', minHeight: 70 },
  timelineLeft: { width: 30, alignItems: 'center' },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  timelineLine: {
    position: 'absolute',
    top: 24,
    bottom: 0,
    width: 2,
    backgroundColor: '#E2E8F0'
  },
  timelineRight: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  timelineHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timelineTitle: { fontSize: 15, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  timelineDate: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#5A6E85' },
  timelineDetail: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#5A6E85', marginTop: 4 },
  syncBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  syncText: { fontSize: 9, fontFamily: 'Inter_800ExtraBold' }
});
