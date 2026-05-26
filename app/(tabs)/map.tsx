import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions, 
  Image, 
  Platform,
  StatusBar,
  Alert,
  ScrollView
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
  Search,
  Target,
  Zap,
  Globe,
  Map as MapIcon,
  TrendingUp,
  Sliders,
  Calendar
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../constants/Theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Productivity zones data
const PRODUCTIVITY_ZONES = [
  { zone: 'Zone 8', status: 'Optimal Yield', rate: '150 kg/ha', area: '0.6 ha', color: '#2E7D32' },
  { zone: 'Zone 7', status: 'High Yield', rate: '125 kg/ha', area: '0.5 ha', color: '#4CAF50' },
  { zone: 'Zone 6', status: 'Above Avg', rate: '100 kg/ha', area: '0.4 ha', color: '#8BC34A' },
  { zone: 'Zone 5', status: 'Average', rate: '80 kg/ha', area: '0.4 ha', color: '#CDDC39' },
  { zone: 'Zone 4', status: 'Below Avg', rate: '60 kg/ha', area: '0.3 ha', color: '#FFC107' },
  { zone: 'Zone 3', status: 'Low Yield', rate: '40 kg/ha', area: '0.2 ha', color: '#FF5722' },
];

export default function MapScreen() {
  const router = useRouter();
  const { colors, radius, spacing, shadows } = useTheme();

  const [activeLayer, setActiveLayer] = useState<'ndvi'|'moisture'|'standard'>('standard');
  const LAYER_LABELS = { ndvi: 'NDVI (Plant Health)', moisture: 'Soil Moisture', standard: 'Standard Map' };

  const handleLayers = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = activeLayer === 'standard' ? 'ndvi' : activeLayer === 'ndvi' ? 'moisture' : 'standard';
    setActiveLayer(next);
  };
  
  const handleLocate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('GPS Status', 'Current Location: Arusha Sector A\nRegion: Arusha • Size: 2.4 Ha\n8.9° S, 33.4° E');
  };
  
  const handleFullscreen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Fullscreen Map', 'Interactive GIS map opened in fullscreen mode.');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* High-Fidelity Satellite View Mock */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop' }} 
        style={styles.mapImage}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'transparent', 'rgba(255,255,255,0.5)']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.overlay}>
        <View style={{ flex: 1 }}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backButton}>
              <View style={[styles.iconBtn, { backgroundColor: '#FFFFFF', borderColor: colors.border }]}>
                <ChevronLeft size={24} color={colors.text} />
              </View>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <View style={[styles.spatialBadge, { backgroundColor: colors.primaryLight }]}>
                <Globe size={12} color={colors.primary} />
                <Text style={[styles.spatialText, { color: colors.primary }]}>VRA FERTILIZER MAP</Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/edit-profile' as any); }} activeOpacity={0.7}>
              <View style={[styles.iconBtn, { backgroundColor: '#FFFFFF', borderColor: colors.border }]}>
                <Settings size={20} color={colors.text} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Map Controls */}
          <View style={styles.mapControls}>
            <TouchableOpacity onPress={handleLayers} style={styles.controlItem}>
              <View style={[styles.controlInner, { backgroundColor: '#FFFFFF', borderColor: colors.border }, activeLayer !== 'standard' && { borderColor: colors.primary }]}>
                <Layers size={22} color={activeLayer !== 'standard' ? colors.primary : colors.text} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFullscreen} style={styles.controlItem}>
              <View style={[styles.controlInner, { backgroundColor: '#FFFFFF', borderColor: colors.border }]}>
                <Maximize2 size={22} color={colors.text} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLocate} style={styles.controlItem}>
              <View style={[styles.controlInner, { backgroundColor: '#FFFFFF', borderColor: colors.border }]}>
                <Locate size={22} color={colors.primary} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Pulse Pin */}
          <View style={[styles.pin, { top: '35%', left: '46%' }]}>
            <View style={styles.pinWrapper}>
              <View style={[styles.pinPulse, { borderColor: colors.primary }]} />
              <View style={[styles.pinCircle, { backgroundColor: colors.primary, borderColor: '#FFFFFF' }]}>
                <Target size={22} color="#FFFFFF" />
              </View>
            </View>
            <View style={[styles.pinLabel, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
              <Text style={styles.pinText}>Arusha Block A (Maize)</Text>
            </View>
          </View>

          {/* Bottom Sheet containing VRA Zones */}
          <View style={styles.bottomSheet}>
            <View style={[styles.sheetContent, { backgroundColor: '#FFFFFF', borderColor: colors.border, ...shadows.premium }]}>
              <View style={[styles.sheetHandle, { backgroundColor: '#E2E8F0' }]} />
              
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={[styles.sheetTitle, { color: colors.text }]}>VRA Prescription Zones</Text>
                  <View style={styles.metaRow}>
                    <MapIcon size={14} color={colors.primary} style={{ marginRight: 6 }} />
                    <Text style={[styles.metaText, { color: colors.textMute }]}>Productivity Zones (3 - 8)</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={[styles.addPlotBtn, { backgroundColor: colors.primary }]} 
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); router.push('/tasks' as any); }}
                >
                  <Plus size={18} color="#FFFFFF" />
                  <Text style={styles.addPlotText}>Add Record</Text>
                </TouchableOpacity>
              </View>

              {/* Stats row */}
              <View style={[styles.statsGrid, { backgroundColor: colors.primaryLight }]}>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.textMute }]}>AVG MOISTURE</Text>
                  <Text style={[styles.statValue, { color: colors.primary }]}>18.4%</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.textMute }]}>HEALTH (NDVI)</Text>
                  <Text style={[styles.statValue, { color: colors.primary }]}>0.82</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.textMute }]}>TARGET YIELD</Text>
                  <Text style={[styles.statValue, { color: colors.primary }]}>4.2 T/Ha</Text>
                </View>
              </View>

              <Text style={styles.sectionHeading}>PRESCRIPTION MATRIX</Text>
              
              {/* Productivity Zones List */}
              <ScrollView style={styles.zonesList} showsVerticalScrollIndicator={false}>
                {PRODUCTIVITY_ZONES.map((pz) => (
                  <View key={pz.zone} style={[styles.zoneRow, { borderColor: colors.border }]}>
                    <View style={styles.zoneLeft}>
                      <View style={[styles.zoneBadge, { backgroundColor: pz.color }]}>
                        <Text style={styles.zoneBadgeText}>{pz.zone}</Text>
                      </View>
                      <View style={{ marginLeft: 12 }}>
                        <Text style={[styles.zoneStatus, { color: colors.text }]}>{pz.status}</Text>
                        <Text style={[styles.zoneArea, { color: colors.textMute }]}>{pz.area}</Text>
                      </View>
                    </View>
                    <View style={styles.zoneRight}>
                      {/* chart.line.uptrend.xyaxis equivalent ( lucide TrendingUp ) */}
                      <TrendingUp size={16} color={colors.primary} style={{ marginRight: 6 }} />
                      <Text style={[styles.zoneRate, { color: colors.text }]}>{pz.rate}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', opacity: 0.9 },
  overlay: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12 },
  iconBtn: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  backButton: { marginRight: 0 },
  headerCenter: { flex: 1, alignItems: 'center' },
  spatialBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  spatialText: { fontSize: 11, fontFamily: 'Inter_900Black', marginLeft: 6, letterSpacing: 0.5 },
  mapControls: { position: 'absolute', right: 16, top: 120, gap: 8 },
  controlItem: { width: 44, height: 44 },
  controlInner: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 12, borderWidth: 1 },
  pin: { position: 'absolute', alignItems: 'center' },
  pinWrapper: { width: 60, height: 60, justifyContent: 'center', alignItems: 'center' },
  pinPulse: { position: 'absolute', width: 60, height: 60, borderRadius: 30, borderWidth: 2, opacity: 0.4 },
  pinCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  pinLabel: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginTop: 4, borderWidth: 1 },
  pinText: { color: '#FFFFFF', fontSize: 11, fontFamily: 'Inter_800ExtraBold' },
  bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  sheetContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 20, borderWidth: 1 },
  sheetHandle: { width: 40, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: 16 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 20, fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.5 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metaText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  addPlotBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  addPlotText: { color: '#FFFFFF', fontFamily: 'Inter_800ExtraBold', marginLeft: 6, fontSize: 13 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderRadius: 12, marginBottom: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 9, fontFamily: 'Inter_800ExtraBold', marginBottom: 4, letterSpacing: 0.5 },
  statValue: { fontSize: 16, fontFamily: 'Inter_900Black' },
  divider: { width: 1, height: '60%', alignSelf: 'center', opacity: 0.2 },
  sectionHeading: { fontSize: 11, fontFamily: 'Inter_800ExtraBold', color: '#5A6E85', letterSpacing: 1.2, marginBottom: 10 },
  zonesList: { maxHeight: 180 },
  zoneRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  zoneLeft: { flexDirection: 'row', alignItems: 'center' },
  zoneBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, width: 60, alignItems: 'center' },
  zoneBadgeText: { color: '#FFFFFF', fontSize: 11, fontFamily: 'Inter_900Black' },
  zoneStatus: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  zoneArea: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 2 },
  zoneRight: { flexDirection: 'row', alignItems: 'center' },
  zoneRate: { fontSize: 14, fontFamily: 'Inter_800ExtraBold' }
});
