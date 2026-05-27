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
import Svg, {
  Path,
  Polygon,
  G,
  Circle,
  Text as SvgText,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';
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

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);
const AnimatedG = Animated.createAnimatedComponent(G);

const { width: SW, height: SH } = Dimensions.get('window');

// Data representing the farm zones (fields)
interface ZoneData {
  id: number;
  nameEn: string;
  nameSw: string;
  cropEn: string;
  cropSw: string;
  area: string;
  center: { x: number; y: number };
  points: string;
  // Metrics
  productivity: 'High' | 'Average' | 'Low';
  productivitySw: 'Juu' | 'Wastani' | 'Chini';
  ndvi: number;
  ph: number;
  moisture: string;
  nitrogen: { statusEn: string; statusSw: string; value: string; color: string };
  phosphorus: { statusEn: string; statusSw: string; value: string; color: string };
  potassium: { statusEn: string; statusSw: string; value: string; color: string };
  // Messages & Alerts
  messageEn: string;
  messageSw: string;
  alertType?: 'warning' | 'info';
}

const ZONES: ZoneData[] = [
  {
    id: 42,
    nameEn: 'Zone 42 - Cornfield',
    nameSw: 'Ukanda 42 - Shamba la Mahindi',
    cropEn: 'Corn',
    cropSw: 'Mahindi',
    area: '4.5 ha',
    points: '40,60 180,30 200,160 60,180',
    center: { x: 120, y: 110 },
    productivity: 'High',
    productivitySw: 'Juu',
    ndvi: 0.82,
    ph: 6.2,
    moisture: '68%',
    nitrogen: { statusEn: 'Optimal', statusSw: 'Safi', value: '85%', color: '#1A3B14' },
    phosphorus: { statusEn: 'Optimal', statusSw: 'Safi', value: '78%', color: '#1A3B14' },
    potassium: { statusEn: 'Optimal', statusSw: 'Safi', value: '80%', color: '#1A3B14' },
    messageEn: 'High Productivity Zone',
    messageSw: 'Ukanda wenye Uzalishaji wa Juu',
  },
  {
    id: 12,
    nameEn: 'Zone 12 - Wheatfield',
    nameSw: 'Ukanda 12 - Shamba la Ngano',
    cropEn: 'Wheat',
    cropSw: 'Ngano',
    area: '6.2 ha',
    points: '180,30 320,50 300,180 200,160',
    center: { x: 250, y: 100 },
    productivity: 'Low',
    productivitySw: 'Chini',
    ndvi: 0.45,
    ph: 5.5,
    moisture: '52%',
    nitrogen: { statusEn: 'Low (-15%)', statusSw: 'Chini (-15%)', value: '40%', color: '#D97706' },
    phosphorus: { statusEn: 'Optimal', statusSw: 'Safi', value: '70%', color: '#1A3B14' },
    potassium: { statusEn: 'Optimal', statusSw: 'Safi', value: '65%', color: '#1A3B14' },
    messageEn: 'Low Nitrogen detected. Apply Urea.',
    messageSw: 'Nitrojeni iko chini. Weka mbolea ya Urea.',
    alertType: 'warning',
  },
  {
    id: 8,
    nameEn: 'Zone 8 - Ricefield',
    nameSw: 'Ukanda 8 - Shamba la Mpunga',
    cropEn: 'Rice',
    cropSw: 'Mpunga',
    area: '1.2 ha',
    points: '60,180 200,160 170,290 30,260',
    center: { x: 115, y: 220 },
    productivity: 'Average',
    productivitySw: 'Wastani',
    ndvi: 0.68,
    ph: 6.8,
    moisture: '82%',
    nitrogen: { statusEn: 'Optimal', statusSw: 'Safi', value: '75%', color: '#1A3B14' },
    phosphorus: { statusEn: 'Optimal', statusSw: 'Safi', value: '82%', color: '#1A3B14' },
    potassium: { statusEn: 'Optimal', statusSw: 'Safi', value: '74%', color: '#1A3B14' },
    messageEn: 'High moisture level ideal for rice.',
    messageSw: 'Unyevu wa juu unaofaa kwa mpunga.',
    alertType: 'info',
  },
  {
    id: 5,
    nameEn: 'Zone 5 - Veggie Patch',
    nameSw: 'Ukanda 5 - Kiriba cha Mboga',
    cropEn: 'Vegetables',
    cropSw: 'Mboga',
    area: '1.2 ha',
    points: '200,160 300,180 280,310 170,290',
    center: { x: 240, y: 230 },
    productivity: 'Low',
    productivitySw: 'Chini',
    ndvi: 0.55,
    ph: 7.2,
    moisture: '40%',
    nitrogen: { statusEn: 'Optimal', statusSw: 'Safi', value: '68%', color: '#1A3B14' },
    phosphorus: { statusEn: 'Optimal', statusSw: 'Safi', value: '66%', color: '#1A3B14' },
    potassium: { statusEn: 'Deficient (-22%)', statusSw: 'Pungufu (-22%)', value: '25%', color: '#DC2626' },
    messageEn: 'Potassium deficiency. Boost suggested.',
    messageSw: 'Upungufu wa Potasiamu. Ongeza mbolea.',
    alertType: 'warning',
  },
];

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
    const defaultW = 350;
    const defaultH = 420;
    const scale = 1 / zoomLevel;
    const w = defaultW * scale;
    const h = defaultH * scale;

    // Pan to center of active zone if zoomed in
    const activeZone = ZONES.find((z) => z.id === activeZoneId);
    let x = 0;
    let y = 0;
    if (activeZone && zoomLevel > 1.0) {
      x = Math.max(0, Math.min(defaultW - w, activeZone.center.x - w / 2));
      y = Math.max(0, Math.min(defaultH - h, activeZone.center.y - h / 2));
    }
    return `${x} ${y} ${w} ${h}`;
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
      if (zone.productivity === 'High') return '#1A3B14';
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
    if (zone.ph <= 7.0) return '#1A3B14'; // Optimal (Green)
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
          <TouchableOpacity style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Menu">
            <Menu size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{farmName}</Text>
          <TouchableOpacity style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Notifications">
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

          {/* ── Filter Selectors (Pills) ───────────────────────── */}
          <View style={styles.filterContainer}>
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
                  activeOpacity={0.8}
                  style={[
                    styles.filterPill,
                    { borderColor: colors.border, backgroundColor: colors.card },
                    active && { backgroundColor: '#1A3B14', borderColor: '#1A3B14' },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.filterText, active && styles.filterTextActive, { color: active ? '#FCFBF7' : colors.textMute }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── SVG Map Visualizer ───────────────────────────────── */}
          <View style={styles.mapContainer}>
            <Animated.View entering={FadeIn.duration(800)} style={StyleSheet.absoluteFill}>
              <Svg viewBox={viewBox} style={StyleSheet.absoluteFill}>
                {/* Grid Overlay / Terrain lines */}
                <G opacity={isDark ? 0.08 : 0.15}>
                  <Path d="M 0 50 Q 100 80, 200 40 T 350 70" stroke={colors.text} strokeWidth="1" fill="none" />
                  <Path d="M 0 120 Q 150 140, 250 90 T 350 110" stroke={colors.text} strokeWidth="1" fill="none" />
                  <Path d="M 0 200 Q 100 230, 220 180 T 350 210" stroke={colors.text} strokeWidth="1" fill="none" />
                  <Path d="M 0 290 Q 120 310, 260 270 T 350 280" stroke={colors.text} strokeWidth="1" fill="none" />
                  <Path d="M 0 370 Q 110 390, 240 360 T 350 370" stroke={colors.text} strokeWidth="1" fill="none" />
                </G>

                {/* Road representation */}
                <Path
                  d="M 0 180 Q 180 200, 350 240"
                  stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
                  strokeWidth="10"
                  fill="none"
                />
                <Path
                  d="M 0 180 Q 180 200, 350 240"
                  stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  fill="none"
                />

                {/* River representation */}
                <Path
                  d="M 120 0 C 135 100, 150 220, 185 420"
                  stroke="#2563EB"
                  strokeWidth="3"
                  opacity={isDark ? 0.3 : 0.4}
                  fill="none"
                />

                {/* Zone Polygons */}
                {filteredZones.map((zone) => {
                  const isSelected = activeZoneId === zone.id;
                  const fillColor = getZoneColor(zone);

                  return (
                    <G key={zone.id}>
                      <AnimatedPolygon
                        points={zone.points}
                        fill={fillColor}
                        fillOpacity={isSelected ? 0.75 : 0.35}
                        stroke={isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.4)'}
                        strokeWidth={isSelected ? 3.5 : 1.5}
                        onPress={() => handleZoneSelect(zone.id)}
                      />
                      
                      {/* Zone ID label */}
                      <SvgText
                        x={zone.center.x}
                        y={zone.center.y}
                        fill="#FFFFFF"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        pointerEvents="none"
                        opacity={isSelected ? 1.0 : 0.7}
                      >
                        {language === 'sw' ? `Kanda ${zone.id}` : `Zone ${zone.id}`}
                      </SvgText>
                      
                      {/* Crop indicator under text */}
                      <SvgText
                        x={zone.center.x}
                        y={zone.center.y + 11}
                        fill="rgba(255,255,255,0.8)"
                        fontSize="8"
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {language === 'sw' ? zone.cropSw : zone.cropEn}
                      </SvgText>
                    </G>
                  );
                })}
              </Svg>
            </Animated.View>

            {/* ── Map HUD Floating Indicators (tethers on map zones) ── */}
            {/* Zone 8 Droplets / Humidity Indicator */}
            {filteredZones.some(z => z.id === 8) && (
              <View style={[styles.hudBadge, { left: 90 * zoomLevel, top: 180 * zoomLevel }]}>
                <Animated.View style={[styles.hudBadgeIcon, animatedPulseStyle]}>
                  <Droplets size={10} color="#3b82f6" />
                </Animated.View>
                <Text style={styles.hudBadgeText}>{language === 'sw' ? 'Unyevu 82%' : '82% Humidity'}</Text>
              </View>
            )}

            {/* Zone 12 Low Nitrogen warning banner */}
            {filteredZones.some(z => z.id === 12) && (
              <View style={[styles.hudLabel, { left: 210 * zoomLevel, top: 110 * zoomLevel }]}>
                <Animated.View style={[styles.hudLabelPulse, animatedPulseStyle]} />
                <Text style={styles.hudLabelText}>{language === 'sw' ? 'Nitrojeni Chini' : 'Low Nitrogen'}</Text>
              </View>
            )}

            {/* Zone 5 Potassium warning Alert icon */}
            {filteredZones.some(z => z.id === 5) && (
              <TouchableOpacity
                onPress={() => handleZoneSelect(5)}
                style={[styles.hudWarningDotContainer, { left: 240 * zoomLevel, top: 250 * zoomLevel }]}
              >
                <Animated.View style={[styles.hudWarningRingPulse, animatedPulseStyle]} />
                <View style={styles.hudWarningDot}>
                  <AlertTriangle size={12} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            )}

            {/* ── Zoom Controls ───────────────────────────────────── */}
            <View style={styles.zoomControls}>
              <TouchableOpacity
                onPress={() => handleZoom('in')}
                style={[styles.zoomBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                accessibilityRole="button"
                accessibilityLabel="Zoom In"
              >
                <Plus size={20} color={colors.text} />
              </TouchableOpacity>
              <View style={[styles.zoomDivider, { backgroundColor: colors.border }]} />
              <TouchableOpacity
                onPress={() => handleZoom('out')}
                style={[styles.zoomBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                accessibilityRole="button"
                accessibilityLabel="Zoom Out"
              >
                <Minus size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Active Selection Bottom Details Card ────────────── */}
          <View style={styles.bottomSheetContainer}>
            <LinearGradient
              colors={isDark ? ['rgba(26, 59, 20, 0.95)', 'rgba(10, 15, 10, 0.99)'] : ['#FAF7F0', '#FFFFFF']}
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
                  <Target size={16} color="#1A3B14" />
                </TouchableOpacity>
              </View>

              {/* Status Message */}
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: activeZone.alertType === 'warning' ? '#F59E0B' : '#1A3B14' }]} />
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
                  <Sparkles size={14} color="#1A3B14" />
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
    fontFamily: 'Inter_900Black',
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
    fontFamily: 'Inter_900Black',
    color: '#1A3B14',
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
    fontFamily: 'Inter_900Black',
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
    backgroundColor: '#1A3B14',
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
