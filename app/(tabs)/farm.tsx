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
  MapPin,
  Clock,
  Sliders,
  ChevronDown
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import { Card } from '../../components/ui/Card';

interface TimelineEvent {
  date: string;
  label: string; // e.g. "Compost Fertilizer"
  amount: string;
  crop: string;
  notes: string;
  synced: boolean;
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

  // Form input states
  const [compostInput, setCompostInput] = useState('');
  const [ureaInput, setUreaInput] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(farmProfile?.primaryCrops?.[0] ?? 'Mpunga (Rice)');

  // Calendar dates scroll
  const [timelineData, setTimelineData] = useState<TimelineEvent[]>([
    { date: 'Feb 10', label: 'Compost Fertilizer', amount: '120 kg', crop: 'Mpunga (Rice)', notes: 'Pre-planting manure application', synced: true },
    { date: 'Feb 17', label: 'Superior Seeds', amount: '20 kg', crop: 'Mpunga (Rice)', notes: 'Sowing High-yielding IR64 Rice Seeds', synced: true },
    { date: 'Feb 24', label: 'KCl Fertilizer', amount: '40 kg', crop: 'Mpunga (Rice)', notes: 'Initial top-dressing for vegetative growth', synced: true },
    { date: 'Mar 03', label: 'SP-36 Fertilizer', amount: '35 kg', crop: 'Mpunga (Rice)', notes: 'Phosphate supplement applied', synced: true },
    { date: 'Mar 10', label: 'Urea Fertilizer', amount: '50 kg', crop: 'Mpunga (Rice)', notes: 'Nitrogen boost applied to active tillers', synced: true },
    { date: 'Mar 17', label: 'Compost Fertilizer', amount: '80 kg', crop: 'Mpunga (Rice)', notes: 'Organic compost secondary layer', synced: true },
  ]);

  // Selected date to view details
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent>(timelineData[0]);

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
            date: new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            label: d.type === 'urea' ? 'Urea Fertilizer' : 'Compost Fertilizer',
            amount: `${d.amount} kg`,
            crop: d.crop || 'Mpunga (Rice)',
            notes: d.notes || 'Logged via Farm Management Console',
            synced: true
          }));
          
          // Merge with static seeds/SP-36 ones to preserve variety
          const staticEvents = timelineData.filter(e => e.label === 'Superior Seeds' || e.label === 'SP-36 Fertilizer');
          setTimelineData([...mapped, ...staticEvents]);
          setSelectedEvent(mapped[0]);
        }
      }
    } catch (err) {
      console.warn('[TrackRecords] Failed to fetch logs from Supabase, using local defaults:', err);
    }
  }, [agroId?.id]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Add a new log
  const handleLogApplication = async () => {
    const compostVal = parseFloat(compostInput) || 0;
    const ureaVal = parseFloat(ureaInput) || 0;

    if (compostVal === 0 && ureaVal === 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Alert.alert('Enter Quantities', 'Please enter a quantity for compost or urea.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const newEvents: TimelineEvent[] = [];
    const timestamp = new Date().toISOString();
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (compostVal > 0) {
      newEvents.push({
        date: dateStr,
        label: 'Compost Fertilizer',
        amount: `${compostVal} kg`,
        crop: selectedCrop,
        notes: 'Manual log entry',
        synced: !isOffline
      });
    }

    if (ureaVal > 0) {
      newEvents.push({
        date: dateStr,
        label: 'Urea Fertilizer',
        amount: `${ureaVal} kg`,
        crop: selectedCrop,
        notes: 'Manual log entry',
        synced: !isOffline
      });
    }

    // Update local state
    setTimelineData((prev) => [...newEvents, ...prev]);
    setSelectedEvent(newEvents[0]);
    setCompostInput('');
    setUreaInput('');

    // Write to Supabase or Queue
    try {
      const { getSupabase } = require('../../lib/supabase');
      const sb = getSupabase();

      for (const ev of newEvents) {
        const payload = {
          user_id: agroId?.id || 'demo-user-id',
          type: ev.label.toLowerCase().includes('urea') ? 'urea' : 'compost',
          amount: parseFloat(ev.amount),
          crop: ev.crop,
          notes: ev.notes,
          created_at: timestamp
        };

        if (isOffline || !sb) {
          addToSyncQueue({
            type: 'irrigation_log',
            payload
          });
        } else {
          await sb.from('fertilizer_logs').insert(payload);
        }
      }

      addNotification({
        title: 'Mbolea Imerekodiwa',
        body: 'Kumbukumbu za matumizi ya mbolea zimesasishwa.',
        type: 'success'
      });

    } catch (err) {
      console.warn('[TrackRecords] Database write exception:', err);
    }
  };

  const handleDatePress = (eventItem: TimelineEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedEvent(eventItem);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#1E2A3E' }]}>Track Records</Text>
          <Text style={styles.subtitle}>
            {language === 'sw' ? 'Fuatilia na kupanga matumizi ya shamba' : 'Monitor and plan farm input applications'}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          {/* Horizontal scroll with exact dates and stacked labels */}
          <View style={styles.horizontalSection}>
            <Text style={styles.sectionHeading}>APPLICATION CALENDAR</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {timelineData.map((ev, idx) => {
                const isSelected = selectedEvent.date === ev.date && selectedEvent.label === ev.label;
                const isUrea = ev.label.includes('Urea') || ev.label.includes('KCl');
                return (
                  <TouchableOpacity
                    key={`${ev.date}-${idx}`}
                    onPress={() => handleDatePress(ev)}
                    style={[
                      styles.dateCard, 
                      { borderColor: isSelected ? '#2E7D32' : '#E5E7EB', borderWidth: 1 },
                      isSelected && { backgroundColor: '#E8F5E9' }
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`${ev.date}: ${ev.label}`}
                  >
                    <Text style={styles.dateText}>{ev.date}</Text>
                    <View style={[styles.indicatorDot, { backgroundColor: isUrea ? '#3b82f6' : '#2E7D32' }]} />
                    <Text style={styles.labelText}>{ev.label.split(' ')[0]}</Text>
                    <Text style={styles.amountText}>{ev.amount}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Expanded Event Detail Card */}
          {selectedEvent && (
            <Card variant="solid" style={[styles.detailCard, { borderColor: '#E5E7EB', borderWidth: 1, ...shadows.sm }]}>
              <View style={styles.detailHeaderRow}>
                <View style={styles.detailTitleCol}>
                  <Text style={styles.detailLabel}>{selectedEvent.date} Application</Text>
                  <Text style={styles.detailTitle}>{selectedEvent.label}</Text>
                </View>
                <View style={[styles.badgeGreen, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={styles.badgeTextGreen}>{selectedEvent.amount}</Text>
                </View>
              </View>
              <View style={styles.detailBody}>
                <View style={styles.detailMetaRow}>
                  <Sprout size={14} color="#6B7280" strokeWidth={2} />
                  <Text style={styles.detailMetaText}>Target Crop: {selectedEvent.crop}</Text>
                </View>
                <Text style={styles.detailNotes}>{selectedEvent.notes}</Text>
              </View>
            </Card>
          )}

          {/* Quick Log Form */}
          <Card variant="solid" style={[styles.logCard, { borderColor: '#E5E7EB', borderWidth: 1, ...shadows.sm }]}>
            <Text style={styles.cardHeading}>Log New Input Application</Text>

            {/* Target crop select */}
            <Text style={styles.inputLabel}>Target Crop</Text>
            <View style={styles.cropSelector}>
              {['Mpunga (Rice)', 'Mahindi (Maize)', 'Kahawa (Coffee)'].map((c) => {
                const isSel = selectedCrop === c;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => { setSelectedCrop(c); Haptics.selectionAsync(); }}
                    style={[styles.cropPill, { borderColor: isSel ? '#2E7D32' : '#E5E7EB', backgroundColor: isSel ? '#E8F5E9' : '#FFFFFF' }]}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSel }}
                  >
                    <Text style={[styles.cropPillText, { color: isSel ? '#2E7D32' : '#1E2A3E' }]}>{c}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.inputGrid}>
              <View style={styles.inputCol}>
                <Text style={styles.inputLabel}>COMPOST (KG)</Text>
                <TextInput
                  value={compostInput}
                  onChangeText={setCompostInput}
                  keyboardType="numeric"
                  placeholder="e.g. 120"
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
                  placeholder="e.g. 50"
                  style={styles.textInput}
                  accessibilityLabel="Urea quantity in kilograms"
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.submitBtn, { backgroundColor: '#2E7D32' }]} 
              onPress={handleLogApplication}
              accessibilityRole="button"
              accessibilityLabel="Record input log"
            >
              <Plus size={20} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.submitBtnText}>Log Application</Text>
            </TouchableOpacity>
          </Card>

          {/* Timeline History List */}
          <Text style={[styles.sectionHeading, { marginTop: 16 }]}>APPLICATION HISTORY</Text>

          <View style={styles.timelineContainer}>
            {timelineData.map((ev, idx) => {
              const isLast = idx === timelineData.length - 1;
              const isUrea = ev.label.includes('Urea') || ev.label.includes('KCl');
              return (
                <View key={`${ev.date}-${idx}`} style={styles.timelineRow}>
                  {/* Left lines */}
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, { backgroundColor: isUrea ? '#3b82f6' : '#2E7D32' }]}>
                      <Calendar size={12} color="#FFFFFF" strokeWidth={2} />
                    </View>
                    {!isLast && <View style={styles.timelineLine} />}
                  </View>

                  <View style={styles.timelineRight}>
                    <View style={styles.timelineHeaderRow}>
                      <Text style={styles.timelineTitle}>{ev.label}</Text>
                      <Text style={styles.timelineDate}>{ev.date}</Text>
                    </View>
                    <Text style={styles.timelineDetail}>
                      {ev.amount} applied on {ev.crop}
                    </Text>
                    <View style={styles.syncBadgeRow}>
                      <Database size={10} color={ev.synced ? '#2E7D32' : '#F59E0B'} strokeWidth={2} />
                      <Text style={[styles.syncText, { color: ev.synced ? '#2E7D32' : '#D97706' }]}>
                        {ev.synced ? 'Synced to Cloud' : 'Offline Queue'}
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
  subtitle: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#6B7280', marginTop: 4 },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100, gap: 16 },
  horizontalSection: { gap: 8 },
  sectionHeading: { fontSize: 11, fontFamily: 'Inter_800ExtraBold', color: '#6B7280', letterSpacing: 1.2, marginLeft: 4 },
  horizontalScroll: { gap: 10, paddingVertical: 4 },
  dateCard: {
    width: 90,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    minHeight: 44
  },
  dateText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#6B7280' },
  indicatorDot: { width: 6, height: 6, borderRadius: 3, marginVertical: 6 },
  labelText: { fontSize: 14, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  amountText: { fontSize: 11, fontFamily: 'Inter_500Medium', color: '#6B7280', marginTop: 2 },
  
  // Detail card
  detailCard: { padding: 16, borderRadius: 16, gap: 12 },
  detailHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailTitleCol: { flex: 1 },
  detailLabel: { fontSize: 11, fontFamily: 'Inter_800ExtraBold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 },
  detailTitle: { fontSize: 18, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E', marginTop: 2 },
  badgeGreen: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  badgeTextGreen: { fontSize: 13, fontFamily: 'Inter_800ExtraBold', color: '#2E7D32' },
  detailBody: { gap: 8 },
  detailMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailMetaText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#6B7280' },
  detailNotes: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#1E2A3E', lineHeight: 18, marginTop: 4 },

  logCard: { padding: 16, borderRadius: 16, gap: 12 },
  cardHeading: { fontSize: 16, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E', marginBottom: 4 },
  cropSelector: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  cropPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 44
  },
  cropPillText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  inputGrid: { flexDirection: 'row', gap: 12 },
  inputCol: { flex: 1, gap: 6 },
  inputLabel: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', color: '#6B7280', letterSpacing: 1 },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E2A3E',
    fontFamily: 'Inter_600SemiBold',
    backgroundColor: '#FFFFFF',
    minHeight: 44
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
    minHeight: 48
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_800ExtraBold' },
  
  // Timeline list
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
    backgroundColor: '#E5E7EB'
  },
  timelineRight: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  timelineHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timelineTitle: { fontSize: 15, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  timelineDate: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#6B7280' },
  timelineDetail: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#6B7280', marginTop: 4 },
  syncBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  syncText: { fontSize: 9, fontFamily: 'Inter_800ExtraBold' }
});
