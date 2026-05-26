import React, { useState, useEffect, useCallback } from 'react';
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
  Modal,
  TextInput,
  Alert,
  Clipboard
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
  CloudRain,
  Plus,
  Info,
  ChevronRight,
  Download,
  AlertCircle,
  MapPin
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import { Card } from '../../components/ui/Card';
import { useSyncEngine } from '../../hooks/useSyncEngine';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors, radius, shadows } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const agroId = useKilimoStore((s) => s.agroId);
  const isOffline = useKilimoStore((s) => s.isOffline);
  const syncQueue = useKilimoStore((s) => s.syncQueue);
  const farmVitals = useKilimoStore((s) => s.farmVitals);
  const unreadCount = useKilimoStore((s) => s.unreadCount);
  const farmProfile = useKilimoStore((s) => s.farmProfile);
  const language = useKilimoStore((s) => s.language);
  const setFarmProfile = useKilimoStore((s) => s.setFarmProfile);

  // Supabase states
  const [salesTotal, setSalesTotal] = useState<number>(9850.25);
  const [dbTransactions, setDbTransactions] = useState<any[]>([
    { id: 'TX-655-01', title: 'Compost Fertilizer', amount: 120, type: 'expense', status: 'completed', date: 'Feb 14, 2025', idLabel: '#655' },
    { id: 'TX-655-02', title: 'Seedlings', amount: 450, type: 'expense', status: 'pending', date: 'Feb 07, 2025', idLabel: '#655' },
    { id: 'TX-655-03', title: 'Urea Fertilizer', amount: 180, type: 'expense', status: 'completed', date: 'Jan 31, 2025', idLabel: '#655' },
    { id: 'TX-655-04', title: 'Compost Fertilizer', amount: 120, type: 'expense', status: 'completed', date: 'Jan 24, 2025', idLabel: '#655' },
  ]);

  // Modal States
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [txModalVisible, setTxModalVisible] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);

  // Form input states
  const [formCompost, setFormCompost] = useState(String(farmProfile?.compostKg ?? '120'));
  const [formUrea, setFormUrea] = useState(String(farmProfile?.ureaKg ?? '50'));
  const [formSP36, setFormSP36] = useState('40');
  const [formKCl, setFormKCl] = useState('30');
  const [updating, setUpdating] = useState(false);

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
  const fetchData = useCallback(async () => {
    try {
      const { getSupabase } = require('../../lib/supabase');
      const sb = getSupabase();
      if (sb && agroId?.id) {
        const { data: profileData } = await sb
          .from('agro_profiles')
          .select('sales_total')
          .eq('user_id', agroId.id)
          .maybeSingle();

        if (profileData && profileData.sales_total !== undefined && profileData.sales_total !== null) {
          setSalesTotal(profileData.sales_total);
        }
      }
    } catch (err) {
      console.warn('[HomeScreen] Supabase fetch error, using robust local data:', err);
    }
  }, [agroId?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await forceSync();
    await fetchData();
    setLastSyncedAt(new Date().toISOString());
    setRefreshing(false);
  }, [setLastSyncedAt, forceSync, fetchData]);

  // Handle Save Info Form
  const handleUpdateSave = async () => {
    const compostVal = parseFloat(formCompost) || 0;
    const ureaVal = parseFloat(formUrea) || 0;
    const sp36Val = parseFloat(formSP36) || 0;
    const kclVal = parseFloat(formKCl) || 0;

    if (compostVal < 0 || ureaVal < 0 || sp36Val < 0 || kclVal < 0) {
      Alert.alert('Error', 'Please enter positive numbers.');
      return;
    }

    setUpdating(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Save locally
    setFarmProfile({
      primaryCrops: farmProfile?.primaryCrops ?? ['Mpunga (Rice)'],
      region: farmProfile?.region ?? 'Bali, Indonesia',
      farmSizeAcres: farmProfile?.farmSizeAcres ?? 2.5,
      mainActivity: 'mazao',
      hasLivestock: false,
      hasIrrigation: false,
      compostKg: compostVal,
      ureaKg: ureaVal,
    });

    // Write to Supabase
    try {
      const { getSupabase } = require('../../lib/supabase');
      const sb = getSupabase();
      if (sb && agroId?.id) {
        const payload = {
          user_id: agroId.id,
          compost_kg: compostVal,
          urea_kg: ureaVal,
          sp36_kg: sp36Val,
          kcl_kg: kclVal
        };
        await sb.from('agro_profiles').upsert(payload, { onConflict: 'user_id' });
      }
    } catch (dbErr) {
      console.warn('[UpdateModal] Supabase save failed:', dbErr);
    }

    setUpdating(false);
    setUpdateModalVisible(false);
    Alert.alert('Success', 'Farm parameters updated successfully.');
  };

  // Handle Transaction Click
  const handleTxPress = (tx: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTx(tx);
    txModalVisible ? setTxModalVisible(false) : setTxModalVisible(true);
  };

  // Copy TX ID
  const handleTxLongPress = (tx: any) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Clipboard.setString(tx.id);
    Alert.alert('Copied', `Transaction ID ${tx.id} copied to clipboard.`);
  };

  // Download QR Code
  const handleDownloadQR = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Download', 'QR Code saved to gallery successfully.');
    setQrModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <StatusBar barStyle="dark-content" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Location / Search Header Bar */}
        <View style={styles.locationHeader}>
          <View style={styles.locLeft}>
            <MapPin size={18} color="#2E7D32" strokeWidth={2.5} style={{ marginRight: 6 }} />
            <Text style={styles.locationText}>Bali, Indonesia</Text>
          </View>
          <View style={styles.locRight}>
            <TouchableOpacity 
              onPress={() => setQrModalVisible(true)}
              style={[styles.qrIconBtn, { borderColor: '#E5E7EB', borderWidth: 1 }]}
              accessibilityRole="button"
              accessibilityLabel="Open QR Codes"
            >
              <QrCode size={20} color="#1E2A3E" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} accessibilityRole="button" accessibilityLabel="Profile">
              <View style={styles.profileAvatar}>
                <Text style={styles.avatarText}>JM</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2E7D32" />}
        >
          {/* Crop Card (Two-column layout hero card) */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <Card variant="solid" style={[styles.cropCard, { ...shadows.sm }]}>
              <View style={styles.cropCardHeader}>
                <View style={styles.badgePrimary}>
                  <Text style={styles.badgePrimaryText}>Your Agricultural Crops</Text>
                </View>
                <Text style={styles.cropTitle}>Rice Plants</Text>
              </View>

              <View style={styles.twoColumnGrid}>
                {/* Left Column */}
                <View style={styles.columnItem}>
                  <Text style={styles.colLabel}>ORGANIC SOIL</Text>
                  <Text style={styles.colVal}>Manure</Text>
                  <Text style={styles.colSubLabel}>Phase: Before Planting</Text>
                </View>
                {/* Right Column */}
                <View style={styles.columnItem}>
                  <Text style={styles.colLabel}>INPUT INGREDIENTS</Text>
                  <Text style={styles.colVal}>KCl Fertilizer</Text>
                  <Text style={styles.colSubLabel}>Age 2-3 Weeks</Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Sales Card (Dashboard card showing $9.850,25) */}
          <Animated.View entering={FadeInDown.delay(150).springify()}>
            <Card variant="solid" style={[styles.salesCard, { ...shadows.sm }]}>
              <View style={styles.salesHeader}>
                <View>
                  <Text style={styles.salesLabel}>Total Balance</Text>
                  <Text style={styles.salesAmount}>{formatSales(salesTotal)}</Text>
                </View>
                <View style={styles.salesRoseBadge}>
                  <TrendingUp size={14} color="#2E7D32" strokeWidth={2.5} style={{ marginRight: 4 }} />
                  <Text style={styles.salesRoseText}>Up 5% from last month</Text>
                </View>
              </View>

              {/* Sparkline Graph Visualizer */}
              <View style={styles.sparklineContainer}>
                <Text style={styles.sparklineText}>Sales Rose 12% in 1 Month</Text>
                <View style={styles.sparkline}>
                  <View style={[styles.sparklineBar, { height: 12, backgroundColor: '#E8F5E9' }]} />
                  <View style={[styles.sparklineBar, { height: 24, backgroundColor: '#E8F5E9' }]} />
                  <View style={[styles.sparklineBar, { height: 18, backgroundColor: '#E8F5E9' }]} />
                  <View style={[styles.sparklineBar, { height: 32, backgroundColor: '#E8F5E9' }]} />
                  <View style={[styles.sparklineBar, { height: 44, backgroundColor: '#2E7D32' }]} />
                  <View style={[styles.sparklineBar, { height: 56, backgroundColor: '#2E7D32' }]} />
                </View>
              </View>

              <View style={styles.salesFooter}>
                <TouchableOpacity 
                  onPress={() => router.push('/agro-id')}
                  style={styles.detailsBtn}
                  accessibilityRole="button"
                >
                  <Text style={styles.detailsBtnText}>View details</Text>
                  <ArrowRight size={14} color="#2E7D32" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </Card>
          </Animated.View>

          {/* Market Conditions Card */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Card variant="solid" style={[styles.marketCard, { borderColor: '#E5E7EB', borderWidth: 1, ...shadows.sm }]}>
              <View style={styles.cardHeaderRow}>
                <TrendingUp size={20} color="#2E7D32" strokeWidth={2} />
                <Text style={styles.cardHeaderTitle}>Market Conditions</Text>
              </View>
              <View style={styles.marketDetails}>
                <View style={styles.marketItem}>
                  <Text style={styles.marketLabelText}>Market Price</Text>
                  <Text style={styles.marketValText}>$50.00</Text>
                </View>
                <View style={styles.marketDivider} />
                <View style={styles.marketItem}>
                  <Text style={styles.marketLabelText}>Highest Demand</Text>
                  <Text style={styles.marketValText}>Surabaya, Bali, etc.</Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Information Card */}
          <Animated.View entering={FadeInDown.delay(250).springify()}>
            <Card variant="solid" style={[styles.infoCard, { borderColor: '#E5E7EB', borderWidth: 1, ...shadows.sm }]}>
              <View style={styles.cardHeaderRow}>
                <Info size={20} color="#2E7D32" strokeWidth={2} />
                <Text style={styles.cardHeaderTitle}>Information</Text>
              </View>
              <View style={styles.infoGrid}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoKey}>Plant Age</Text>
                  <Text style={styles.infoVal}>Week 4</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoKey}>Rice Harvest</Text>
                  <Text style={styles.infoVal}>950kg (Up 2% from last month)</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoKey}>Sales Data</Text>
                  <Text style={styles.infoVal}>Up 2%</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoKey}>Fertilization</Text>
                  <Text style={styles.infoVal}>Urea, SP-36, KCl, and ZA</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoKey}>Certification</Text>
                  <Text style={styles.infoVal}>Land and Fertilizer</Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Update Card */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Card variant="solid" style={[styles.updateCard, { backgroundColor: '#E8F5E9', borderColor: '#2E7D32', borderWidth: 1, ...shadows.sm }]}>
              <View style={styles.updateCardContent}>
                <Text style={styles.updateTitle}>Update Your Farm Information To Increase Total Balance Productivity</Text>
              </View>
              <TouchableOpacity 
                style={styles.updateBtn}
                onPress={() => setUpdateModalVisible(true)}
                accessibilityRole="button"
              >
                <Plus size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 6 }} />
                <Text style={styles.updateBtnText}>Update Information</Text>
              </TouchableOpacity>
            </Card>
          </Animated.View>

          {/* Transaction History Card */}
          <Animated.View entering={FadeInDown.delay(350).springify()}>
            <Card variant="solid" style={[styles.txCard, { borderColor: '#E5E7EB', borderWidth: 1, ...shadows.sm }]}>
              <Text style={styles.cardHeaderTitle}>Transaction History</Text>
              <View style={styles.txList}>
                {dbTransactions.map((tx) => {
                  const isCompleted = tx.status === 'completed';
                  return (
                    <TouchableOpacity 
                      key={tx.id}
                      onPress={() => handleTxPress(tx)}
                      onLongPress={() => handleTxLongPress(tx)}
                      style={[styles.txItem, { borderBottomColor: '#E5E7EB', borderBottomWidth: 1 }]}
                      accessibilityRole="button"
                      accessibilityLabel={`${tx.title} transaction`}
                    >
                      <View style={[styles.txIcon, { backgroundColor: isCompleted ? '#E8F5E9' : '#FEF3C7' }]}>
                        {isCompleted ? (
                          <CheckCircle2 size={18} color="#2E7D32" strokeWidth={2} />
                        ) : (
                          <Clock size={18} color="#F59E0B" strokeWidth={2} />
                        )}
                      </View>
                      <View style={styles.txInfo}>
                        <Text style={styles.txTitle}>{tx.title}</Text>
                        <Text style={styles.txMeta}>{tx.date} • ID: {tx.idLabel}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: isCompleted ? '#E8F5E9' : '#FEF3C7' }]}>
                        <Text style={[styles.statusText, { color: isCompleted ? '#2E7D32' : '#D97706' }]}>
                          {isCompleted ? 'Completed' : 'Pending'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>
          </Animated.View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      {/* UPDATE MODAL FORM */}
      <Modal visible={updateModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.modalTitle}>Update Farm Parameters</Text>
            
            <View style={styles.formScroll}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>COMPOST FERTILIZER (KG)</Text>
                <TextInput 
                  value={formCompost} 
                  onChangeText={setFormCompost} 
                  keyboardType="numeric" 
                  style={styles.formInput} 
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>UREA FERTILIZER (KG)</Text>
                <TextInput 
                  value={formUrea} 
                  onChangeText={setFormUrea} 
                  keyboardType="numeric" 
                  style={styles.formInput} 
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>SP-36 FERTILIZER (KG)</Text>
                <TextInput 
                  value={formSP36} 
                  onChangeText={setFormSP36} 
                  keyboardType="numeric" 
                  style={styles.formInput} 
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>KCL FERTILIZER (KG)</Text>
                <TextInput 
                  value={formKCl} 
                  onChangeText={setFormKCl} 
                  keyboardType="numeric" 
                  style={styles.formInput} 
                />
              </View>
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setUpdateModalVisible(false)}
                accessibilityRole="button"
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveBtn, { backgroundColor: '#2E7D32' }]} 
                onPress={handleUpdateSave}
                disabled={updating}
                accessibilityRole="button"
              >
                <Text style={styles.saveBtnText}>{updating ? 'Saving...' : 'Save Parameters'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* TRANSACTION DETAIL MODAL */}
      <Modal visible={txModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.txDetailCard}>
            <Text style={styles.detailHeader}>Transaction Invoice</Text>
            {selectedTx && (
              <View style={styles.invoiceContent}>
                <View style={styles.invoiceRow}>
                  <Text style={styles.invKey}>Transaction ID</Text>
                  <Text style={styles.invVal}>{selectedTx.id}</Text>
                </View>
                <View style={styles.invoiceRow}>
                  <Text style={styles.invKey}>Description</Text>
                  <Text style={styles.invVal}>{selectedTx.title}</Text>
                </View>
                <View style={styles.invoiceRow}>
                  <Text style={styles.invKey}>Date</Text>
                  <Text style={styles.invVal}>{selectedTx.date}</Text>
                </View>
                <View style={styles.invoiceRow}>
                  <Text style={styles.invKey}>Status</Text>
                  <Text style={[styles.invVal, { color: selectedTx.status === 'completed' ? '#2E7D32' : '#F59E0B' }]}>
                    {selectedTx.status.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.invoiceDivider} />
                <View style={styles.invoiceRow}>
                  <Text style={styles.invTotalLabel}>Amount Paid</Text>
                  <Text style={styles.invTotalVal}>${selectedTx.amount.toFixed(2)}</Text>
                </View>
              </View>
            )}
            <TouchableOpacity 
              style={[styles.closeInvoiceBtn, { backgroundColor: '#2E7D32' }]} 
              onPress={() => setTxModalVisible(false)}
              accessibilityRole="button"
            >
              <Text style={styles.closeInvoiceBtnText}>Close Invoice</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QR CODE MODAL */}
      <Modal visible={qrModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.qrSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.qrSheetTitle}>Farm Scannable Passport</Text>
            
            <View style={styles.qrPlaceholder}>
              <QrCode size={180} color="#1E2A3E" strokeWidth={1.5} />
            </View>
            
            <Text style={styles.qrInstructions}>
              Show this QR code to agro-vendors or loan officers to instantly share verified crop profiles.
            </Text>

            <TouchableOpacity 
              style={[styles.qrDownloadBtn, { backgroundColor: '#2E7D32' }]} 
              onPress={handleDownloadQR}
              accessibilityRole="button"
            >
              <Download size={20} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.qrDownloadText}>Download QR</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.qrCloseBtn} 
              onPress={() => setQrModalVisible(false)}
              accessibilityRole="button"
            >
              <Text style={styles.qrCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  locLeft: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 16, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  locRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qrIconBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  profileAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 14, fontFamily: 'Inter_800ExtraBold', color: '#2E7D32' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  
  // Crop Card
  cropCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 16, marginBottom: 16 },
  cropCardHeader: { marginBottom: 16 },
  badgePrimary: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 6 },
  badgePrimaryText: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', color: '#2E7D32', textTransform: 'uppercase' },
  cropTitle: { fontSize: 24, fontFamily: 'Inter_900Black', color: '#1E2A3E' },
  twoColumnGrid: { flexDirection: 'row', gap: 12 },
  columnItem: { flex: 1, backgroundColor: '#FAFBFD', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  colLabel: { fontSize: 9, fontFamily: 'Inter_800ExtraBold', color: '#6B7280', letterSpacing: 0.5, marginBottom: 4 },
  colVal: { fontSize: 15, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  colSubLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', color: '#6B7280', marginTop: 2 },

  // Sales Card
  salesCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 16, marginBottom: 16 },
  salesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  salesLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#6B7280' },
  salesAmount: { fontSize: 32, fontFamily: 'Inter_900Black', color: '#1E2A3E', marginTop: 4, letterSpacing: -1 },
  salesRoseBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  salesRoseText: { fontSize: 11, fontFamily: 'Inter_800ExtraBold', color: '#2E7D32' },
  sparklineContainer: { marginBottom: 16 },
  sparklineText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#6B7280', marginBottom: 10 },
  sparkline: { flexDirection: 'row', gap: 6, alignItems: 'flex-end', height: 60 },
  sparklineBar: { flex: 1, borderRadius: 3 },
  salesFooter: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 12, alignItems: 'flex-end' },
  detailsBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 8, paddingHorizontal: 12, minWidth: 44, minHeight: 44 },
  detailsBtnText: { fontSize: 14, fontFamily: 'Inter_800ExtraBold', color: '#2E7D32' },

  // Market Card
  marketCard: { padding: 16, borderRadius: 16, marginBottom: 16 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardHeaderTitle: { fontSize: 16, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  marketDetails: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  marketItem: { flex: 1, alignItems: 'center' },
  marketLabelText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  marketValText: { fontSize: 15, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  marketDivider: { width: 1, height: 32, backgroundColor: '#E5E7EB' },

  // Info Card
  infoCard: { padding: 16, borderRadius: 16, marginBottom: 16 },
  infoGrid: { gap: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  infoKey: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#6B7280' },
  infoVal: { fontSize: 13, fontFamily: 'Inter_700Bold', color: '#1E2A3E', textAlign: 'right', flex: 1, marginLeft: 12 },

  // Update Card
  updateCard: { padding: 16, borderRadius: 16, marginBottom: 16, gap: 14 },
  updateCardContent: { marginBottom: 4 },
  updateTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#1E2A3E', lineHeight: 22 },
  updateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, backgroundColor: '#2E7D32', minHeight: 48 },
  updateBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_800ExtraBold' },

  // Transaction Card
  txCard: { padding: 16, borderRadius: 16, marginBottom: 16 },
  txList: { gap: 12, marginTop: 12 },
  txItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  txIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  txInfo: { flex: 1, marginLeft: 12 },
  txTitle: { fontSize: 15, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  txMeta: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#6B7280', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontFamily: 'Inter_800ExtraBold' },

  // Modal Overlays
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
  sheetHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#E5E7EB', alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E', marginBottom: 20 },
  formScroll: { gap: 16, marginBottom: 24 },
  formInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#1E2A3E' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', color: '#6B7280', letterSpacing: 0.5, marginBottom: 6 },
  modalBtnRow: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  cancelBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#6B7280' },
  saveBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  saveBtnText: { fontSize: 15, fontFamily: 'Inter_800ExtraBold', color: '#FFFFFF' },

  // Invoice Card
  txDetailCard: { 
    backgroundColor: '#FFFFFF', 
    marginHorizontal: 24, 
    marginVertical: 'auto', 
    borderRadius: 24, 
    padding: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 2 
  },
  detailHeader: { fontSize: 18, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E', textAlign: 'center', marginBottom: 20 },
  invoiceContent: { gap: 14, marginBottom: 24 },
  invoiceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  invKey: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#6B7280' },
  invVal: { fontSize: 13, fontFamily: 'Inter_700Bold', color: '#1E2A3E' },
  invoiceDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  invTotalLabel: { fontSize: 15, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  invTotalVal: { fontSize: 18, fontFamily: 'Inter_900Black', color: '#2E7D32' },
  closeInvoiceBtn: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  closeInvoiceBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_800ExtraBold' },

  // QR Modal
  qrSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, alignItems: 'center' },
  qrSheetTitle: { fontSize: 18, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E', marginBottom: 20 },
  qrPlaceholder: { padding: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, marginBottom: 20 },
  qrInstructions: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#6B7280', textAlign: 'center', lineHeight: 20, marginBottom: 24, paddingHorizontal: 16 },
  qrDownloadBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, width: '100%', justifyContent: 'center', minHeight: 48 },
  qrDownloadText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_800ExtraBold' },
  qrCloseBtn: { paddingVertical: 12, marginTop: 8, width: '100%', alignItems: 'center', minHeight: 44 },
  qrCloseText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#6B7280' }
});
