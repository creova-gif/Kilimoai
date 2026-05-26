import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions, 
  ScrollView,
  StatusBar,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { 
  ChevronLeft, 
  Layers, 
  Locate, 
  Plus,
  MapPin,
  Settings,
  Info,
  Maximize2,
  Navigation,
  Globe,
  Map as MapIcon,
  TrendingUp,
  Sliders,
  Calendar,
  CloudRain,
  Activity,
  Edit,
  SlidersHorizontal,
  Compass,
  ArrowRight
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../constants/Theme';
import { Card } from '../../components/ui/Card';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const INITIAL_ZONES = [
  { zone: 'Zone 8', status: 'Optimal Yield', rate: 150, area: '0.6 ha', color: '#2E7D32' },
  { zone: 'Zone 7', status: 'High Yield', rate: 125, area: '0.5 ha', color: '#4CAF50' },
  { zone: 'Zone 6', status: 'Above Avg', rate: 100, area: '0.4 ha', color: '#8BC34A' },
  { zone: 'Zone 5', status: 'Average', rate: 80, area: '0.4 ha', color: '#CDDC39' },
  { zone: 'Zone 4', status: 'Below Avg', rate: 60, area: '0.3 ha', color: '#FFC107' },
  { zone: 'Zone 3', status: 'Low Yield', rate: 40, area: '0.2 ha', color: '#FF5722' },
];

export default function MapScreen() {
  const router = useRouter();
  const { colors, radius, shadows } = useTheme();

  // Screen state
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newRateInput, setNewRateInput] = useState('');
  const [mapFilter, setMapFilter] = useState<'all'|'empty'|'corn'>('all');
  const [weatherForecastVisible, setWeatherForecastVisible] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'standard'|'ndvi'|'moisture'>('standard');

  // Highlights
  const [highlightedZone, setHighlightedZone] = useState<string | null>(null);

  // Trigger rate edit for a zone
  const handleZonePress = (zoneItem: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedZone(zoneItem);
    setNewRateInput(String(zoneItem.rate));
    setHighlightedZone(zoneItem.zone);
    setEditModalVisible(true);
  };

  // Save new zone rate
  const handleSaveRate = () => {
    const rateVal = parseFloat(newRateInput);
    if (isNaN(rateVal) || rateVal < 0) {
      Alert.alert('Error', 'Please enter a valid rate.');
      return;
    }

    setZones(prev => prev.map(z => z.zone === selectedZone.zone ? { ...z, rate: rateVal } : z));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setEditModalVisible(false);
    Alert.alert('Updated', `${selectedZone.zone} prescription rate set to ${rateVal} kg/ha.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <StatusBar barStyle="dark-content" />
      
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header bar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Back">
            <ChevronLeft size={22} color="#1E2A3E" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>VRA Spatial Map</Text>
          <TouchableOpacity onPress={() => router.push('/edit-profile')} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Settings">
            <Settings size={20} color="#1E2A3E" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          {/* Field Summary Card (Pills / Indicators filter map) */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <Card variant="solid" style={[styles.fieldSummaryCard, { borderColor: '#E5E7EB', borderWidth: 1, ...shadows.sm }]}>
              <Text style={styles.cardHeading}>Field Summary</Text>
              <View style={styles.pillsRow}>
                <TouchableOpacity
                  onPress={() => { setMapFilter('all'); Haptics.selectionAsync(); }}
                  style={[styles.filterPill, mapFilter === 'all' && styles.filterPillActive]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: mapFilter === 'all' }}
                >
                  <Text style={[styles.pillText, mapFilter === 'all' && styles.pillTextActive]}>All Fields</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setMapFilter('empty'); Haptics.selectionAsync(); }}
                  style={[styles.filterPill, mapFilter === 'empty' && styles.filterPillActive]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: mapFilter === 'empty' }}
                >
                  <Text style={[styles.pillText, mapFilter === 'empty' && styles.pillTextActive]}>Empty Field 15 ha</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setMapFilter('corn'); Haptics.selectionAsync(); }}
                  style={[styles.filterPill, mapFilter === 'corn' && styles.filterPillActive]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: mapFilter === 'corn' }}
                >
                  <Text style={[styles.pillText, mapFilter === 'corn' && styles.pillTextActive]}>Corn Field 12 ha</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </Animated.View>

          {/* Interactive Vector Map Grid Representation */}
          <Animated.View entering={FadeInDown.delay(150).springify()}>
            <Card variant="solid" style={[styles.mapContainer, { borderColor: '#E5E7EB', borderWidth: 1, ...shadows.sm }]}>
              <View style={styles.mapHeaderRow}>
                <Compass size={18} color="#2E7D32" strokeWidth={2} />
                <Text style={styles.mapTitle}>GIS Zoning Grid ({mapFilter === 'all' ? 'All' : mapFilter === 'empty' ? 'Empty' : 'Corn'})</Text>
              </View>
              
              <View style={styles.vectorMap}>
                {zones.map((zone) => {
                  const isHighlighted = highlightedZone === zone.zone;
                  // Apply filters visually
                  const isHidden = (mapFilter === 'empty' && zone.zone !== 'Zone 3' && zone.zone !== 'Zone 4') ||
                                   (mapFilter === 'corn' && zone.zone !== 'Zone 8' && zone.zone !== 'Zone 7');
                  
                  return (
                    <TouchableOpacity
                      key={zone.zone}
                      onPress={() => handleZonePress(zone)}
                      style={[
                        styles.vectorZoneBlock, 
                        { backgroundColor: zone.color },
                        isHighlighted && styles.highlightedZoneBlock,
                        isHidden && { opacity: 0.15 }
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`${zone.zone} details`}
                    >
                      <Text style={styles.zoneBlockText}>{zone.zone}</Text>
                      <Text style={styles.zoneBlockSub}>{zone.rate} kg/ha</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.tapInstruction}>Tap any zone on the grid map to adjust custom rates</Text>
            </Card>
          </Animated.View>

          {/* 3 Grid Statistics Widgets: Growth, Notes, Standard Rate */}
          <View style={styles.vitalsRow}>
            {/* Growth Rate Card */}
            <Card variant="solid" style={[styles.vitalCard, { flex: 1, borderColor: '#E5E7EB', borderWidth: 1, ...shadows.sm }]}>
              <View style={styles.vitalHeader}>
                <Text style={styles.vitalLabel}>GROWTH RATE</Text>
                <TrendingUp size={14} color="#2E7D32" strokeWidth={2.5} />
              </View>
              <Text style={styles.vitalVal}>0.75</Text>
              <View style={styles.datesRow}>
                <Text style={styles.dateSub}>July 24</Text>
                <ArrowRight size={10} color="#6B7280" />
                <Text style={styles.dateSub}>August 25</Text>
              </View>
            </Card>

            {/* Notes Card */}
            <Card variant="solid" style={[styles.vitalCard, { flex: 1, borderColor: '#E5E7EB', borderWidth: 1, ...shadows.sm }]}>
              <View style={styles.vitalHeader}>
                <Text style={styles.vitalLabel}>NOTES</Text>
                <Calendar size={14} color="#6B7280" strokeWidth={2} />
              </View>
              <Text style={styles.vitalVal}>Active</Text>
              <Text style={styles.dateSub}>Date: 24.03.2023</Text>
            </Card>
          </View>

          {/* Standard Rate Card */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Card variant="solid" style={[styles.standardRateCard, { borderColor: '#E5E7EB', borderWidth: 1, ...shadows.sm }]}>
              <View style={styles.vitalHeader}>
                <Text style={styles.vitalLabel}>STANDARD RATE</Text>
                <SlidersHorizontal size={14} color="#2E7D32" strokeWidth={2} />
              </View>
              <View style={styles.rateRow}>
                <Text style={styles.rateValText}>100</Text>
                <View style={styles.rateUnits}>
                  <Text style={styles.unitText}>kg/ha</Text>
                  <Text style={styles.unitText}>L/ha</Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Productivity Zones Card (Zones 3-8 list) */}
          <Animated.View entering={FadeInDown.delay(250).springify()}>
            <Card variant="solid" style={[styles.zonesCard, { borderColor: '#E5E7EB', borderWidth: 1, ...shadows.sm }]}>
              <Text style={styles.cardHeading}>Productivity Zones</Text>
              <View style={styles.zonesList}>
                {zones.map((z) => (
                  <TouchableOpacity 
                    key={z.zone} 
                    onPress={() => handleZonePress(z)}
                    style={[styles.zoneRow, { borderBottomColor: '#E5E7EB', borderBottomWidth: 1 }]}
                    accessibilityRole="button"
                  >
                    <View style={styles.zoneRowLeft}>
                      <View style={[styles.zoneColorBadge, { backgroundColor: z.color }]} />
                      <View style={{ marginLeft: 12 }}>
                        <Text style={styles.zoneNameText}>{z.zone}</Text>
                        <Text style={styles.zoneStatusText}>{z.status}</Text>
                      </View>
                    </View>
                    <View style={styles.zoneRowRight}>
                      <Text style={styles.zoneValueText}>{z.rate} kg/ha</Text>
                      <Text style={styles.zoneAreaText}>{z.area}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          </Animated.View>

          {/* Weather Card */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <TouchableOpacity 
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setWeatherForecastVisible(true); }}
              accessibilityRole="button"
              accessibilityLabel="View weather forecast"
            >
              <Card variant="solid" style={[styles.weatherCard, { borderColor: '#E5E7EB', borderWidth: 1, ...shadows.sm }]}>
                <View style={styles.weatherTop}>
                  <View>
                    <Text style={styles.weatherLocation}>Vymyk, Lviv Oblast, Ukraine</Text>
                    <Text style={styles.weatherTempRange}>H: +16°  L: +10°</Text>
                  </View>
                  <CloudRain size={28} color="#2E7D32" strokeWidth={2} />
                </View>
                <View style={styles.weatherExtraRow}>
                  <View style={styles.weatherExtraItem}>
                    <Text style={styles.extraLabel}>PRECIPITATION</Text>
                    <Text style={styles.extraVal}>5mm</Text>
                  </View>
                  <View style={styles.weatherExtraItem}>
                    <Text style={styles.extraLabel}>PRESSURE</Text>
                    <Text style={styles.extraVal}>1019 hPa</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          </Animated.View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      {/* ZONE RATE EDIT MODAL */}
      <Modal visible={editModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.editCard}>
            <Text style={styles.modalHeading}>Adjust Prescription Rate</Text>
            {selectedZone && (
              <View style={styles.modalBody}>
                <Text style={styles.zoneDetailsLabel}>Zone: {selectedZone.zone} ({selectedZone.status})</Text>
                <Text style={styles.inputLabel}>PRESCRIPTION RATE (KG/HA)</Text>
                <TextInput
                  value={newRateInput}
                  onChangeText={setNewRateInput}
                  keyboardType="numeric"
                  style={styles.rateInput}
                />
              </View>
            )}
            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setEditModalVisible(false)}
                accessibilityRole="button"
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveBtn, { backgroundColor: '#2E7D32' }]} 
                onPress={handleSaveRate}
                accessibilityRole="button"
              >
                <Text style={styles.saveBtnText}>Save Rate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 7-DAY WEATHER FORECAST MODAL */}
      <Modal visible={weatherForecastVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.forecastSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.forecastTitle}>7-Day Weather Forecast</Text>
            
            <ScrollView style={styles.forecastList} showsVerticalScrollIndicator={false}>
              {[
                { day: 'Mon', temp: '+16° / +10°', cond: 'Rainy' },
                { day: 'Tue', temp: '+17° / +11°', cond: 'Cloudy' },
                { day: 'Wed', temp: '+18° / +12°', cond: 'Partly Sunny' },
                { day: 'Thu', temp: '+19° / +11°', cond: 'Sunny' },
                { day: 'Fri', temp: '+15° / +9°', cond: 'Heavy Rain' },
                { day: 'Sat', temp: '+14° / +8°', cond: 'Overcast' },
                { day: 'Sun', temp: '+16° / +10°', cond: 'Showers' },
              ].map((item, idx) => (
                <View key={idx} style={[styles.forecastRow, { borderBottomColor: '#E5E7EB', borderBottomWidth: 1 }]}>
                  <Text style={styles.forecastDay}>{item.day}</Text>
                  <Text style={styles.forecastCond}>{item.cond}</Text>
                  <Text style={styles.forecastTemp}>{item.temp}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.closeForecastBtn, { backgroundColor: '#2E7D32' }]} 
              onPress={() => setWeatherForecastVisible(false)}
              accessibilityRole="button"
            >
              <Text style={styles.closeForecastBtnText}>Close Forecast</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  scroll: { paddingHorizontal: 16, paddingTop: 16 },
  
  // Field summary card
  fieldSummaryCard: { padding: 16, borderRadius: 16, marginBottom: 16 },
  cardHeading: { fontSize: 16, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E', marginBottom: 12 },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  filterPillActive: { borderColor: '#2E7D32', backgroundColor: '#E8F5E9' },
  pillText: { fontSize: 13, fontFamily: 'Inter_700Bold', color: '#6B7280' },
  pillTextActive: { color: '#2E7D32' },

  // GIS Zoning grid
  mapContainer: { padding: 16, borderRadius: 16, marginBottom: 16 },
  mapHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  mapTitle: { fontSize: 15, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  vectorMap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  vectorZoneBlock: { width: (SCREEN_WIDTH - 64) / 3, height: 72, borderRadius: 12, padding: 8, justifyContent: 'space-between', borderWidth: 2, borderColor: 'transparent' },
  highlightedZoneBlock: { borderColor: '#1E2A3E' },
  zoneBlockText: { color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter_900Black' },
  zoneBlockSub: { color: '#FFFFFF', fontSize: 10, fontFamily: 'Inter_700Bold' },
  tapInstruction: { fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#6B7280', textAlign: 'center', marginTop: 12 },

  // Stats Row
  vitalsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  vitalCard: { padding: 12, borderRadius: 16, gap: 6 },
  vitalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vitalLabel: { fontSize: 9, fontFamily: 'Inter_800ExtraBold', color: '#6B7280', letterSpacing: 0.5 },
  vitalVal: { fontSize: 20, fontFamily: 'Inter_900Black', color: '#1E2A3E' },
  datesRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateSub: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: '#6B7280' },

  // Standard Rate Card
  standardRateCard: { padding: 12, borderRadius: 16, marginBottom: 16 },
  rateRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginTop: 4 },
  rateValText: { fontSize: 24, fontFamily: 'Inter_900Black', color: '#1E2A3E' },
  rateUnits: { flexDirection: 'row', gap: 6, marginBottom: 2 },
  unitText: { fontSize: 11, fontFamily: 'Inter_700Bold', color: '#6B7280', backgroundColor: '#F3F4F6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },

  // Productivity Zones Card
  zonesCard: { padding: 16, borderRadius: 16, marginBottom: 16 },
  zonesList: { gap: 10 },
  zoneRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  zoneRowLeft: { flexDirection: 'row', alignItems: 'center' },
  zoneColorBadge: { width: 14, height: 14, borderRadius: 7 },
  zoneNameText: { fontSize: 14, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  zoneStatusText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#6B7280', marginTop: 2 },
  zoneRowRight: { alignItems: 'flex-end' },
  zoneValueText: { fontSize: 14, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  zoneAreaText: { fontSize: 11, fontFamily: 'Inter_500Medium', color: '#6B7280', marginTop: 2 },

  // Weather Card
  weatherCard: { padding: 16, borderRadius: 16, marginBottom: 16, gap: 12 },
  weatherTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  weatherLocation: { fontSize: 15, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  weatherTempRange: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#6B7280', marginTop: 2 },
  weatherExtraRow: { flexDirection: 'row', gap: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  weatherExtraItem: { flex: 1 },
  extraLabel: { fontSize: 9, fontFamily: 'Inter_800ExtraBold', color: '#6B7280', letterSpacing: 0.5 },
  extraVal: { fontSize: 14, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E', marginTop: 4 },

  // Edit Card Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  editCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalHeading: { fontSize: 18, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E', marginBottom: 16 },
  modalBody: { gap: 12, marginBottom: 20 },
  zoneDetailsLabel: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#6B7280' },
  inputLabel: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', color: '#6B7280', letterSpacing: 0.5 },
  rateInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, fontFamily: 'Inter_700Bold', color: '#1E2A3E' },
  modalBtnRow: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  cancelBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#6B7280' },
  saveBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  saveBtnText: { fontSize: 15, fontFamily: 'Inter_800ExtraBold', color: '#FFFFFF' },

  // Forecast Sheet
  forecastSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
  sheetHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#E5E7EB', alignSelf: 'center', marginBottom: 20 },
  forecastTitle: { fontSize: 18, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E', marginBottom: 16 },
  forecastList: { gap: 12, marginBottom: 20 },
  forecastRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  forecastDay: { fontSize: 15, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  forecastCond: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#6B7280' },
  forecastTemp: { fontSize: 14, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  closeForecastBtn: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  closeForecastBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_800ExtraBold' }
});
