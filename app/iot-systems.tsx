import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  ImageBackground,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  ChevronLeft,
  Settings,
  Zap,
  Droplets,
  Wind,
  Wifi,
  BatteryCharging,
  Target,
  PlaneTakeoff,
  PlaneLanding,
  CloudRain,
  Map,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';
import { useKilimoStore } from '../store/useKilimoStore';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

export default function IOTSystems() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const language = useKilimoStore((s) => s.language);

  const [droneActive, setDroneActive] = useState(false);
  const [irrigationActive, setIrrigationActive] = useState(true);

  // Pulse animation for active sensors
  const pulseScale = useSharedValue(1);
  React.useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(withTiming(1.05, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1,
      true
    );
  }, []);
  const animatedPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleDroneToggle = (val: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDroneActive(val);
  };

  const handleIrrigationToggle = (val: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIrrigationActive(val);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ImageBackground
        source={require('../assets/images/welcome_bg.png')}
        style={StyleSheet.absoluteFillObject}
      >
        <LinearGradient
          colors={[isDark ? 'rgba(18,26,15,0.8)' : 'rgba(255,255,255,0.7)', isDark ? '#121A0F' : '#FCFBF7']}
          style={StyleSheet.absoluteFillObject}
          locations={[0, 0.4]}
        />
      </ImageBackground>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {language === 'sw' ? 'Mifumo ya IoT & Drones' : 'IoT & Drone Systems'}
          </Text>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Settings size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} >

          {/* Device Hub — Connection Status */}
          <Animated.View entering={FadeInUp.delay(50).springify()}>
            <View style={[styles.deviceHubBanner, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.deviceHubHeader, { backgroundColor: 'rgba(245,158,11,0.08)' }]}>
                <View style={styles.deviceHubTitleRow}>
                  <Animated.View style={[styles.searchingDot, animatedPulse, { backgroundColor: '#f59e0b' }]} />
                  <Text style={[styles.deviceHubTitle, { color: colors.text }]}>
                    {language === 'sw' ? 'KITUO CHA VIFAA' : 'DEVICE HUB'}
                  </Text>
                </View>
                <Text style={[styles.deviceHubSub, { color: '#f59e0b' }]}>
                  {language === 'sw' ? 'Inatafuta vifaa...' : 'Scanning for devices...'}
                </Text>
              </View>

              {([
                { name: language === 'sw' ? 'Drone ya Shamba (DJI T40)' : 'Agricultural Drone (DJI T40)', type: language === 'sw' ? 'DRONE' : 'DRONE', icon: <Target size={16} color="#3b82f6" />, color: '#3b82f6' },
                { name: language === 'sw' ? 'Sensori ya Udongo (SM-3)' : 'Soil Sensor Node (SM-3)', type: language === 'sw' ? 'SENSORI' : 'SENSOR', icon: <Zap size={16} color="#a3e635" />, color: '#a3e635' },
                { name: language === 'sw' ? 'Kituo cha Hali ya Hewa' : 'Weather Station', type: language === 'sw' ? 'HEWA' : 'WEATHER', icon: <Wind size={16} color="#0ea5e9" />, color: '#0ea5e9' },
                { name: language === 'sw' ? 'Mdhibiti wa Umwagiliaji' : 'Irrigation Controller', type: language === 'sw' ? 'MAJI' : 'IRRIGATION', icon: <Droplets size={16} color="#22c55e" />, color: '#22c55e' },
              ] as const).map((device, i) => (
                <Animated.View
                  key={i}
                  entering={FadeInDown.delay(80 + i * 55).springify()}
                  style={[styles.deviceRow, { borderTopColor: colors.border }]}
                >
                  <View style={[styles.deviceIconBox, { backgroundColor: device.color + '18' }]}>
                    {device.icon}
                  </View>
                  <View style={styles.deviceInfo}>
                    <Text style={[styles.deviceName, { color: colors.text }]}>{device.name}</Text>
                    <Text style={[styles.deviceType, { color: colors.textMute }]}>{device.type}</Text>
                  </View>
                  <View style={styles.deviceStatusRow}>
                    <Animated.View style={[styles.statusPulseDot, animatedPulse, { backgroundColor: '#f59e0b' }]} />
                    <Text style={[styles.deviceStatusText, { color: '#f59e0b' }]}>
                      {language === 'sw' ? 'Inatafuta' : 'Searching'}
                    </Text>
                  </View>
                </Animated.View>
              ))}

              <View style={[styles.deviceHubFooter, { borderTopColor: colors.border }]}>
                <Wifi size={12} color={colors.textMute} />
                <Text style={[styles.deviceHubFooterText, { color: colors.textMute }]}>
                  {language === 'sw'
                    ? 'Vifaa vitaunganishwa kiotomatiki vikiwa karibu · Bluetooth / Wi-Fi'
                    : 'Devices auto-connect when in range · Bluetooth / Wi-Fi'}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Drone Control Panel */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <Text style={[styles.sectionTitle, { color: colors.textMute }]}>
              {language === 'sw' ? 'Udhibiti wa Ndege Nyuki (Drone)' : 'Agricultural Drone Control'}
            </Text>
            
            <View style={[styles.glassCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <View style={[styles.iconBadge, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                    <Target size={20} color="#3b82f6" />
                  </View>
                  <View>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                      DJI Agras T40
                    </Text>
                    <Text style={[styles.cardSubtitle, { color: '#3b82f6' }]}>
                      {droneActive ? (language === 'sw' ? 'Iko Hewani' : 'In Flight') : (language === 'sw' ? 'Ipo Kituoni' : 'Standby')}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={droneActive}
                  onValueChange={handleDroneToggle}
                  trackColor={{ false: colors.border, true: '#3b82f6' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <BatteryCharging size={18} color="#22c55e" />
                  <Text style={[styles.statValue, { color: colors.text }]}>84%</Text>
                  <Text style={[styles.statLabel, { color: colors.textMute }]}>
                    {language === 'sw' ? 'Chaji' : 'Battery'}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Wifi size={18} color="#3b82f6" />
                  <Text style={[styles.statValue, { color: colors.text }]}>92 ms</Text>
                  <Text style={[styles.statLabel, { color: colors.textMute }]}>
                    {language === 'sw' ? 'Mawasiliano' : 'Latency'}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Droplets size={18} color="#0ea5e9" />
                  <Text style={[styles.statValue, { color: colors.text }]}>12 L</Text>
                  <Text style={[styles.statLabel, { color: colors.textMute }]}>
                    {language === 'sw' ? 'Dawa/Maji' : 'Payload'}
                  </Text>
                </View>
              </View>

              <View style={styles.droneActions}>
                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: droneActive ? '#ef4444' : colors.primary }]}
                  onPress={() => setDroneActive(!droneActive)}
                >
                  {droneActive ? <PlaneLanding size={18} color="#fff" /> : <PlaneTakeoff size={18} color={isDark ? '#000' : '#fff'} />}
                  <Text style={[styles.actionBtnText, { color: droneActive ? '#fff' : (isDark ? '#000' : '#fff') }]}>
                    {droneActive ? (language === 'sw' ? 'Tua Sasa' : 'Land Now') : (language === 'sw' ? 'Rusha Drone' : 'Launch Drone')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionBtnSecondary, { borderColor: colors.border }]}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <Map size={18} color={colors.text} />
                  <Text style={[styles.actionBtnTextSecondary, { color: colors.text }]}>
                    {language === 'sw' ? 'Chora Njia' : 'Flight Path'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* Smart Irrigation */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Text style={[styles.sectionTitle, { color: colors.textMute }]}>
              {language === 'sw' ? 'Umwagiliaji wa Akili' : 'Smart Irrigation'}
            </Text>

            <View style={[styles.glassCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <Animated.View style={[styles.iconBadge, { backgroundColor: 'rgba(14,165,233,0.1)' }, irrigationActive && animatedPulse]}>
                    <CloudRain size={20} color="#0ea5e9" />
                  </Animated.View>
                  <View>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                      {language === 'sw' ? 'Bomba Kuu (Kanda 1-4)' : 'Main Valve (Zones 1-4)'}
                    </Text>
                    <Text style={[styles.cardSubtitle, { color: irrigationActive ? '#0ea5e9' : colors.textMute }]}>
                      {irrigationActive ? (language === 'sw' ? 'Inamwagilia (2.4L/s)' : 'Active (2.4L/s)') : (language === 'sw' ? 'Imezimwa' : 'Inactive')}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={irrigationActive}
                  onValueChange={handleIrrigationToggle}
                  trackColor={{ false: colors.border, true: '#0ea5e9' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.irrigationStats}>
                <View style={styles.iStat}>
                  <Text style={[styles.iStatLabel, { color: colors.textMute }]}>{language === 'sw' ? 'Unyevu wa Udongo' : 'Soil Moisture'}</Text>
                  <Text style={[styles.iStatValue, { color: colors.text }]}>42% <Text style={{ color: '#ef4444', fontSize: 12 }}>(Chini)</Text></Text>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '42%', backgroundColor: '#ef4444' }]} />
                  </View>
                </View>
                <View style={styles.iStat}>
                  <Text style={[styles.iStatLabel, { color: colors.textMute }]}>{language === 'sw' ? 'Lengo la Unyevu' : 'Target Moisture'}</Text>
                  <Text style={[styles.iStatValue, { color: colors.text }]}>65%</Text>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '65%', backgroundColor: '#22c55e' }]} />
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Environmental Sensors */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Text style={[styles.sectionTitle, { color: colors.textMute }]}>
              {language === 'sw' ? 'Sensori za Mazingira' : 'Environmental Sensors'}
            </Text>
            
            <View style={styles.sensorsGrid}>
              {[
                { icon: <Wind size={24} color="#a855f7" />, label: language === 'sw' ? 'Upepo' : 'Wind Speed', value: '14 km/h', color: '#a855f7' },
                { icon: <Zap size={24} color="#f59e0b" />, label: language === 'sw' ? 'Joto la Udongo' : 'Soil Temp', value: '24°C', color: '#f59e0b' },
                { icon: <Droplets size={24} color="#3b82f6" />, label: 'pH Level', value: '6.4', color: '#3b82f6' },
                { icon: <Target size={24} color="#22c55e" />, label: 'Nitrogen (N)', value: 'Optimal', color: '#22c55e' },
              ].map((s, i) => (
                <View key={i} style={[styles.sensorCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.sensorIcon, { backgroundColor: s.color + '15' }]}>
                    {s.icon}
                  </View>
                  <Text style={[styles.sensorValue, { color: colors.text }]}>{s.value}</Text>
                  <Text style={[styles.sensorLabel, { color: colors.textMute }]}>{s.label}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
          {/* RIFT HerdTag Section */}
          <Animated.View entering={FadeInDown.delay(350).springify()}>
            <Text style={[styles.sectionTitle, { color: colors.textMute }]}>
              {language === 'sw' ? 'RIFT HerdTag™ · Ufuatiliaji wa Mifugo' : 'RIFT HerdTag™ · Livestock Tracking'}
            </Text>
            <View style={[styles.glassCard, { backgroundColor: colors.card, borderColor: '#22d15a30', borderWidth: 1.5 }]}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <View style={[styles.iconBadge, { backgroundColor: 'rgba(34,209,90,0.1)' }]}>
                    <Target size={20} color="#22d15a" />
                  </View>
                  <View>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>RIFT HerdTag™</Text>
                    <Text style={[styles.cardSubtitle, { color: '#22d15a' }]}>
                      {language === 'sw' ? 'Masikio Smart · 4G + BLE + GPS' : 'Smart Ear Tag · 4G + BLE + GPS'}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Animated.View style={[styles.statusPulseDot, animatedPulse, { backgroundColor: '#22d15a' }]} />
                    <Text style={{ fontSize: 10, fontFamily: 'Inter_700Bold', color: '#22d15a' }}>
                      {language === 'sw' ? '1 IMESAJILIWA' : '1 REGISTERED'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Tag metrics */}
              <View style={[styles.statsRow, { marginTop: 0, marginBottom: 16 }]}>
                {[
                  { label: language === 'sw' ? 'Wanyama' : 'Animals', value: '3' },
                  { label: language === 'sw' ? 'Tag Hai' : 'Tags Active', value: '1' },
                  { label: language === 'sw' ? 'Maonyo' : 'Alerts', value: '0' },
                ].map((s) => (
                  <View key={s.label} style={styles.statBox}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
                    <Text style={[styles.statLabel, { color: colors.textMute }]}>{s.label}</Text>
                  </View>
                ))}
              </View>

              {/* Registered tag */}
              <View style={{ gap: 8 }}>
                {[
                  { tag: 'TZ-0421', species: language === 'sw' ? 'Ng\'ombe' : 'Cattle', name: 'Sita', lat: -3.3869, lng: 36.6830, heartRate: 68, temp: 38.2, battery: 87, active: true },
                  { tag: 'TZ-0422', species: language === 'sw' ? 'Ng\'ombe' : 'Cattle', name: 'Bahati', lat: -3.3871, lng: 36.6832, heartRate: 72, temp: 38.5, battery: 72, active: false },
                  { tag: 'GT-118',  species: language === 'sw' ? 'Mbuzi' : 'Goat', name: '—', lat: -3.3875, lng: 36.6828, heartRate: 82, temp: 39.1, battery: 95, active: false },
                ].map((a) => (
                  <View key={a.tag} style={[{
                    flexDirection: 'row', alignItems: 'center', padding: 12,
                    borderRadius: 14, borderWidth: 1,
                    backgroundColor: a.active ? 'rgba(34,209,90,0.05)' : 'rgba(0,0,0,0.02)',
                    borderColor: a.active ? '#22d15a40' : colors.border,
                  }]}>
                    <View style={[styles.deviceIconBox, { backgroundColor: a.active ? '#22d15a18' : colors.background }]}>
                      <BatteryCharging size={16} color={a.active ? '#22d15a' : colors.textMute} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={[styles.deviceName, { color: colors.text }]}>{a.tag} · {a.name} ({a.species})</Text>
                      <Text style={[styles.deviceType, { color: colors.textMute }]}>
                        {a.active
                          ? `❤️ ${a.heartRate} bpm · 🌡 ${a.temp}°C · 🔋 ${a.battery}%`
                          : language === 'sw' ? 'Haijasajiliwa bado' : 'Not registered yet'}
                      </Text>
                    </View>
                    <View style={[styles.deviceStatusRow]}>
                      <View style={[styles.statusPulseDot, { backgroundColor: a.active ? '#22d15a' : '#94a3b8' }]} />
                      <Text style={[styles.deviceStatusText, { color: a.active ? '#22d15a' : '#94a3b8' }]}>
                        {a.active ? (language === 'sw' ? 'Hai' : 'Live') : (language === 'sw' ? 'Tumisha' : 'Activate')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* CTA */}
              <TouchableOpacity
                onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
                style={[styles.actionBtn, { backgroundColor: '#22d15a', marginTop: 14 }]}
              >
                <Map size={16} color="#000" />
                <Text style={[styles.actionBtnText, { color: '#000' }]}>
                  {language === 'sw' ? 'Ona Ramani ya Mifugo' : 'View Herd Map'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 10,
    paddingBottom: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 18,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 24,
    marginLeft: 4,
  },
  glassCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 17,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  statValue: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 16,
  },
  statLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
  droneActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  actionBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'transparent',
    gap: 8,
  },
  actionBtnTextSecondary: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  irrigationStats: {
    gap: 16,
  },
  iStat: {
    gap: 8,
  },
  iStatLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  iStatValue: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 16,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  deviceHubBanner: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
  },
  deviceHubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  deviceHubTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchingDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  deviceHubTitle: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.8,
  },
  deviceHubSub: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  deviceIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  deviceName: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  deviceType: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginTop: 1,
    letterSpacing: 0.6,
  },
  deviceStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  deviceStatusText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  deviceHubFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  deviceHubFooterText: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    flex: 1,
  },
  sensorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sensorCard: {
    width: '48%',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sensorIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sensorValue: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 18,
    marginBottom: 4,
  },
  sensorLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
});
