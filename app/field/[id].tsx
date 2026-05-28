import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Activity, Droplets, Target, Sprout, Combine } from 'lucide-react-native';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import { ZONES } from '../../constants/FarmData';
import MapView, { Polygon, PROVIDER_GOOGLE } from '../../components/MapViewWrapper';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SW } = Dimensions.get('window');

// Mock historical NDVI data
const HISTORICAL_DATA = [
  { month: 'Jan', val: 0.3 },
  { month: 'Feb', val: 0.45 },
  { month: 'Mar', val: 0.6 },
  { month: 'Apr', val: 0.8 },
  { month: 'May', val: 0.85 },
  { month: 'Jun', val: 0.75 },
];

export default function FieldDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const language = useKilimoStore(s => s.language);

  const zone = ZONES.find(z => z.id === Number(id));

  if (!zone) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text, fontFamily: 'InstrumentSerif_400Regular', fontSize: 24 }}>Field Not Found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate bounding box for the map to fit the polygon
  const minLat = Math.min(...zone.coordinates.map(c => c.latitude));
  const maxLat = Math.max(...zone.coordinates.map(c => c.latitude));
  const minLng = Math.min(...zone.coordinates.map(c => c.longitude));
  const maxLng = Math.max(...zone.coordinates.map(c => c.longitude));
  
  const initialRegion = {
    latitude: zone.centerLat,
    longitude: zone.centerLng,
    latitudeDelta: (maxLat - minLat) * 2 || 0.005,
    longitudeDelta: (maxLng - minLng) * 2 || 0.005,
  };

  const handleVraSetup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/vra-setup?zoneId=${zone.id}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Map Header */}
      <View style={styles.mapHeader}>
        <MapView 
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={initialRegion}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          mapType="satellite"
        >
          <Polygon 
            coordinates={zone.coordinates}
            fillColor={`${colors.primary}40`}
            strokeColor={colors.primary}
            strokeWidth={3}
          />
        </MapView>
        
        {/* Header Navigation overlay */}
        <BlurView intensity={60} tint="dark" style={styles.topNav}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {language === 'sw' ? zone.nameSw : zone.nameEn}
          </Text>
          <View style={{ width: 40 }} />
        </BlurView>

        <LinearGradient
          colors={['transparent', colors.background]}
          style={styles.gradientOverlay}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Animated.View entering={FadeInUp.delay(100)} style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: colors.text }]}>
            {language === 'sw' ? zone.cropSw : zone.cropEn} Overview
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: zone.alertType === 'warning' ? '#F59E0B20' : '#22d15a20' }]}>
            <Text style={[styles.statusText, { color: zone.alertType === 'warning' ? '#F59E0B' : colors.primary }]}>
              {language === 'sw' ? zone.messageSw : zone.messageEn}
            </Text>
          </View>
        </Animated.View>

        {/* Metrics Grid */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: colors.card }]}>
            <Target color={colors.primary} size={24} />
            <Text style={[styles.metricLabel, { color: colors.text + '80' }]}>NDVI Score</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>{zone.ndvi}</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.card }]}>
            <Droplets color={colors.primary} size={24} />
            <Text style={[styles.metricLabel, { color: colors.text + '80' }]}>Moisture</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>{zone.moisture}</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.card }]}>
            <Activity color={colors.primary} size={24} />
            <Text style={[styles.metricLabel, { color: colors.text + '80' }]}>Soil pH</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>{zone.ph}</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.card }]}>
            <Sprout color={colors.primary} size={24} />
            <Text style={[styles.metricLabel, { color: colors.text + '80' }]}>Area</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>{zone.area}</Text>
          </View>
        </Animated.View>

        {/* Growth Chart */}
        <Animated.View entering={FadeInUp.delay(300)} style={[styles.chartSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>NDVI Timeline</Text>
          <View style={styles.chartContainer}>
            {HISTORICAL_DATA.map((d, i) => (
              <View key={i} style={styles.barContainer}>
                <View style={[styles.barBg, { backgroundColor: colors.border }]}>
                  <Animated.View 
                    entering={FadeInDown.delay(400 + i * 100).springify()}
                    style={[styles.barFill, { backgroundColor: colors.primary, height: `${d.val * 100}%` }]} 
                  />
                </View>
                <Text style={[styles.barLabel, { color: colors.text + '80' }]}>{d.month}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Action Button Space */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Action Layer */}
      <View style={styles.floatingActionLayer}>
        <TouchableOpacity 
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          activeOpacity={0.8}
          onPress={handleVraSetup}
        >
          <Combine color="#FFF" size={24} />
          <Text style={styles.primaryBtnText}>
            {language === 'sw' ? 'Sanidi VRA (Matumizi Mbadala)' : 'Set Up VRA Protocol'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapHeader: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  topNav: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    borderRadius: 24,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 22,
    color: '#FFF',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  scrollContent: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  mainTitle: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 36,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    width: (SW - 52) / 2,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  metricLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginTop: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 28,
  },
  chartSection: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontFamily: 'InstrumentSerif_400Regular',
    fontSize: 24,
    marginBottom: 24,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  barContainer: {
    alignItems: 'center',
    gap: 8,
  },
  barBg: {
    width: 24,
    height: 120,
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 12,
  },
  barLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
  },
  floatingActionLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 30,
    gap: 12,
    shadowColor: '#22d15a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryBtnText: {
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
