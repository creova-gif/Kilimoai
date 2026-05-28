import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  Plus,
  Minus,
  Droplets,
  AlertTriangle,
  Target,
  Menu,
  Bell,
  Info,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import MapView, { Polygon as MapPolygon, Marker, PROVIDER_GOOGLE } from '../../components/MapViewWrapper';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import { RequireVerification } from '../../components/RequireVerification';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';



const { width: SW, height: SH } = Dimensions.get('window');

// Data representing the farm zones (fields)
import { ZoneData, ZONES } from '../../constants/FarmData';


type MapFilter = 'productivity' | 'ndvi' | 'ph';

export default function FarmHub() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const language = useKilimoStore((s) => s.language);
  const agroId = useKilimoStore((s) => s.agroId);

  const [activeZoneId, setActiveZoneId] = useState<number>(42);
  const [activeFilter, setActiveFilter] = useState<MapFilter>('productivity');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [searchQuery, setSearchQuery] = useState('');

  // Pulsing Warnings Shared Values
  const pulseVal = useSharedValue(0.9);
  const pulseOpacity = useSharedValue(0.7);

  React.useEffect(() => {
    pulseVal.value = withRepeat(
      withSequence(
        withTiming(1.25, { duration: 900 }),
        withTiming(0.9, { duration: 900 })
      ),
      -1,
      true
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 900 }),
        withTiming(0.7, { duration: 900 })
      ),
      -1,
      true
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseVal.value }],
    opacity: pulseOpacity.value,
  }));

  // Localized Farm Name
  const farmName = useMemo(() => {
    if (agroId?.name) {
      return language === 'sw' ? `Shamba la ${agroId.name}` : `${agroId.name} Farm`;
    }
    return language === 'sw' ? 'Shamba la North Valleya' : 'North Valleya Farm';
  }, [agroId, language]);

  // Zoom configuration coordinates
  const viewBox = useMemo(() => {
    // Find bounding box for active zone to frame it perfectly
    const activeZone = ZONES.find((z) => z.id === activeZoneId);
    let lat = -6.8280;
    let lng = 37.6695;
    if (activeZone && zoomLevel > 1.0) {
      lat = activeZone.centerLat;
      lng = activeZone.centerLng;
    }
    // Return Region
    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.005 / zoomLevel,
      longitudeDelta: 0.005 / zoomLevel,
    };
  }, [zoomLevel, activeZoneId]);

  const activeZone = useMemo(() => {
    return ZONES.find((z) => z.id === activeZoneId) || ZONES[0];
  }, [activeZoneId]);

  // Filtered zones based on search query
  const filteredZones = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return ZONES;
    return ZONES.filter(
      (z) =>
        z.nameEn.toLowerCase().includes(query) ||
        z.nameSw.toLowerCase().includes(query) ||
        z.cropEn.toLowerCase().includes(query) ||
        z.cropSw.toLowerCase().includes(query) ||
        z.id.toString() === query
    );
  }, [searchQuery]);

  // Function to determine polygon color depending on active filter and zone values
  const getZoneColor = (zone: ZoneData) => {
    if (activeFilter === 'productivity') {
      if (zone.productivity === 'High') return '#22d15a';
      if (zone.productivity === 'Average') return '#3D7A29';
      return '#F59E0B'; // Low
    }
    if (activeFilter === 'ndvi') {
      if (zone.ndvi >= 0.8) return '#0D3807';
      if (zone.ndvi >= 0.6) return '#246219';
      if (zone.ndvi >= 0.5) return '#4B8D3D';
      return '#8EBD81';
    }
    // Soil pH
    if (zone.ph < 6.0) return '#EA580C'; // Acidic (Orange)
    if (zone.ph <= 7.0) return '#22d15a'; // Optimal (Green)
    return '#0891B2'; // Alkaline (Teal)
  };

  const handleZoneSelect = (id: number) => {
    Haptics.selectionAsync();
    setActiveZoneId(id);
  };

  const handleZoom = (type: 'in' | 'out') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setZoomLevel((prev) => {
      if (type === 'in') return Math.min(2.5, prev + 0.3);
      return Math.max(1.0, prev - 0.3);
    });
  };

  return (
    <RequireVerification>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.safe}>
        
        {/* ── Top Header ───────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.iconBtn} 
            accessibilityRole="button" 
            accessibilityLabel="Menu"
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Menu size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{farmName}</Text>
          <TouchableOpacity 
            style={styles.iconBtn} 
            accessibilityRole="button" 
            accessibilityLabel="Notifications"
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Bell size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.mainContent}>
          {/* ── Search Input overlay ────────────────────────────── */}
          <BlurView intensity={isDark ? 16 : 40} tint={isDark ? 'dark' : 'light'} style={[styles.searchBar, { borderColor: colors.border }]}>
            <Search size={18} color={colors.textMute} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={language === 'sw' ? 'Tafuta maeneo, ukanda au sensa..' : 'Search fields, zone or sensor..'}
              placeholderTextColor={colors.textMute}
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessibilityLabel="Search Fields"
            />
          </BlurView>

          

          {/* ── SVG Map Visualizer ───────────────────────────────── */}
          <View style={[styles.mapContainer, { borderRadius: 0, marginHorizontal: -16, marginTop: -8 }]}>
            <MapView
              style={StyleSheet.absoluteFillObject}
              mapType="satellite"
              region={viewBox}
            >
              {filteredZones.map((zone) => {
                const isSelected = activeZoneId === zone.id;
                const fillColor = getZoneColor(zone);
                
                return (
                  <MapPolygon
                    key={zone.id}
                    coordinates={(zone as any).coordinates}
                    fillColor={isSelected ? fillColor + '80' : fillColor + '30'}
                    strokeColor={isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.4)'}
                    strokeWidth={isSelected ? 3 : 1}
                    tappable={true}
                    onPress={() => handleZoneSelect(zone.id)}
                  />
                );
              })}

              {/* Markers for specific zones */}
              {filteredZones.some(z => z.id === 8) && (
                <Marker coordinate={{ latitude: -6.8290, longitude: 37.6688 }}>
                  <View style={[styles.hudBadge, { position: 'relative', left: 0, top: 0 }]}>
                    <Droplets size={10} color="#3b82f6" />
                    <Text style={styles.hudBadgeText}>{language === 'sw' ? 'Unyevu 82%' : '82% Humidity'}</Text>
                  </View>
                </Marker>
              )}

              {filteredZones.some(z => z.id === 12) && (
                <Marker coordinate={{ latitude: -6.8268, longitude: 37.6705 }}>
                  <View style={[styles.hudLabel, { position: 'relative', left: 0, top: 0 }]}>
                    <Text style={styles.hudLabelText}>{language === 'sw' ? 'Nitrojeni Chini' : 'Low Nitrogen'}</Text>
                  </View>
                </Marker>
              )}
            </MapView>

            {/* Filter selectors floating over map */}
            <View style={[styles.filterContainer, { position: 'absolute', top: 10, left: 16, right: 16, zIndex: 10 }]}>
              {(['productivity', 'ndvi', 'ph'] as MapFilter[]).map((filter) => {
                const active = activeFilter === filter;
                let label = '';
                if (filter === 'productivity') label = language === 'sw' ? 'Uzalishaji' : 'Productivity';
                if (filter === 'ndvi') label = 'NDVI Index';
                if (filter === 'ph') label = 'Soil pH';

                return (
                  <TouchableOpacity
                    key={filter}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setActiveFilter(filter);
                    }}
                    style={[
                      styles.filterPill,
                      { borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.9)' },
                      active && { backgroundColor: '#22d15a', borderColor: '#22d15a' },
                    ]}
                  >
                    <Text style={[styles.filterText, active && styles.filterTextActive, { color: active ? '#FCFBF7' : '#22d15a' }]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Active Selection Bottom Details Card ────────────── */}
          <View style={styles.bottomSheetContainer}>
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(`/field/${activeZone.id}`);
              }}
            >
              <LinearGradient
                colors={isDark ? ['rgba(34, 209, 90, 0.95)', 'rgba(10, 15, 10, 0.99)'] : ['#F0FAF2', '#FFFFFF']}
                style={[styles.bottomSheet, { borderColor: colors.border }]}
              >
                <View style={styles.sheetTopRow}>
                <View>
                  <Text style={styles.activeSelectionLabel}>
                    {language === 'sw' ? 'UCHAGUZI WA SASA' : 'ACTIVE SELECTION'}
                  </Text>
                  <Text style={[styles.activeZoneTitle, { color: colors.text }]}>
                    {language === 'sw' ? activeZone.nameSw : activeZone.nameEn}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    setZoomLevel(1.5);
                  }}
                  style={[styles.recenterBtn, { backgroundColor: colors.primaryLight }]}
                  accessibilityRole="button"
                  accessibilityLabel="Recenter map"
                >
                  <Target size={16} color="#22d15a" />
                </TouchableOpacity>
              </View>

              {/* Status Message */}
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: activeZone.alertType === 'warning' ? '#F59E0B' : '#22d15a' }]} />
                <Text style={[styles.statusText, { color: colors.text }]}>
                  {language === 'sw' ? activeZone.messageSw : activeZone.messageEn}
                </Text>
              </View>

              {/* Grid Readings */}
              <View style={styles.metricsGrid}>
                {/* Metric 1 */}
                <View style={[styles.metricBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={styles.metricName}>{language === 'sw' ? 'Ukubwa' : 'Size'}</Text>
                  <Text style={[styles.metricValue, { color: colors.text }]}>{activeZone.area}</Text>
                </View>
                {/* Metric 2 */}
                <View style={[styles.metricBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={styles.metricName}>NDVI</Text>
                  <Text style={[styles.metricValue, { color: colors.text }]}>{activeZone.ndvi}</Text>
                </View>
                {/* Metric 3 */}
                <View style={[styles.metricBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={styles.metricName}>pH ya Udongo</Text>
                  <Text style={[styles.metricValue, { color: colors.text }]}>{activeZone.ph}</Text>
                </View>
                {/* Metric 4 */}
                <View style={[styles.metricBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={styles.metricName}>{language === 'sw' ? 'Unyevu' : 'Moisture'}</Text>
                  <Text style={[styles.metricValue, { color: colors.text }]}>{activeZone.moisture}</Text>
                </View>
              </View>

              {/* Advanced Nutrients Bar */}
              <View style={[styles.nutrientsBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.nutrientsHeader}>
                  <Sparkles size={14} color="#22d15a" />
                  <Text style={[styles.nutrientsTitle, { color: colors.text }]}>
                    {language === 'sw' ? 'Uchambuzi wa Virutubisho' : 'Soil Nutrient Analysis'}
                  </Text>
                </View>
                <View style={styles.nutrientsRow}>
                  {/* Nitrogen */}
                  <View style={styles.nutrientElem}>
                    <Text style={styles.nutrientLabel}>N</Text>
                    <Text style={[styles.nutrientVal, { color: activeZone.nitrogen.color }]}>
                      {language === 'sw' ? activeZone.nitrogen.statusSw : activeZone.nitrogen.statusEn}
                    </Text>
                  </View>
                  <View style={styles.elemDivider} />
                  {/* Phosphorus */}
                  <View style={styles.nutrientElem}>
                    <Text style={styles.nutrientLabel}>P</Text>
                    <Text style={[styles.nutrientVal, { color: activeZone.phosphorus.color }]}>
                      {language === 'sw' ? activeZone.phosphorus.statusSw : activeZone.phosphorus.statusEn}
                    </Text>
                  </View>
                  <View style={styles.elemDivider} />
                  {/* Potassium */}
                  <View style={styles.nutrientElem}>
                    <Text style={styles.nutrientLabel}>K</Text>
                    <Text style={[styles.nutrientVal, { color: activeZone.potassium.color }]}>
                      {language === 'sw' ? activeZone.potassium.statusSw : activeZone.potassium.statusEn}
                    </Text>
                  </View>
                </View>
              </View>

            </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Floating circular Add (+) button */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/crop-planning');
          }}
          activeOpacity={0.85}
          style={styles.floatingAddBtn}
          accessibilityRole="button"
          accessibilityLabel="Add Field"
        >
          <Plus size={24} color="#FCFBF7" />
        </TouchableOpacity>

      </SafeAreaView>
    </View>
    </RequireVerification>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
    paddingBottom: 8,
  },
  iconBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'InstrumentSerif_400Regular',
    letterSpacing: -0.5,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
    marginTop: 8,
    overflow: 'hidden',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    height: '100%',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  filterTextActive: {
    color: '#FCFBF7',
  },
  mapContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 20,
    backgroundColor: '#0c0f0a',
    position: 'relative',
  },
  zoomControls: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    zIndex: 10,
    elevation: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  zoomBtn: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomDivider: {
    height: 1,
  },
  hudBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  hudBadgeIcon: {
    marginRight: 2,
  },
  hudBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
  },
  hudLabel: {
    position: 'absolute',
    backgroundColor: 'rgba(217, 119, 6, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  hudLabelText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontFamily: 'Inter_800ExtraBold',
  },
  hudWarningDot: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EA580C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  bottomSheet: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sheetTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeSelectionLabel: {
    fontSize: 9,
    fontFamily: 'InstrumentSerif_400Regular',
    color: '#22d15a',
    letterSpacing: 1.2,
  },
  activeZoneTitle: {
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    marginTop: 2,
  },
  recenterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    opacity: 0.8,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  metricBox: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  metricName: {
    fontSize: 8,
    fontFamily: 'Inter_700Bold',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
    marginTop: 4,
  },
  nutrientsBar: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
  },
  nutrientsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  nutrientsTitle: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  nutrientsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  nutrientElem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nutrientLabel: {
    fontSize: 11,
    fontFamily: 'InstrumentSerif_400Regular',
    color: 'rgba(255,255,255,0.4)',
  },
  nutrientVal: {
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
  },
  elemDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 2,
  },
  floatingAddBtn: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    backgroundColor: '#22d15a',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 30,
  },

  // Map HUD Pulsing Indicator Styles
  hudLabelPulse: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#EA580C',
    backgroundColor: 'rgba(234, 88, 12, 0.15)',
  },
  hudWarningDotContainer: {
    position: 'absolute',
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hudWarningRingPulse: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#EA580C',
    backgroundColor: 'rgba(234, 88, 12, 0.25)',
  },
});
