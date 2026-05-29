import React, { useState, useEffect } from 'react';
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
  Modal,
  TextInput,
  Alert,
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
  Plus,
  X,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Tv,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';
import { useKilimoStore } from '../store/useKilimoStore';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { GlassCard } from '../components/PageScaffold';

interface IoTDevice {
  id: string;
  name: string;
  nameSw: string;
  type: 'DRONE' | 'SENSOR' | 'WEATHER' | 'IRRIGATION' | 'GATE' | 'WATER';
  iconName: 'target' | 'zap' | 'wind' | 'droplets' | 'cpu' | 'tv';
  battery: number;
  latency: number;
  lastSeen: string;
  lastSeenSw: string;
  status: 'active' | 'searching' | 'offline';
  serialNumber: string;
  agroIdLinked: string | null;
}

const INITIAL_DEVICES: IoTDevice[] = [
  {
    id: '1',
    name: 'Agricultural Drone (DJI T40)',
    nameSw: 'Drone ya Shamba (DJI T40)',
    type: 'DRONE',
    iconName: 'target',
    battery: 84,
    latency: 92,
    lastSeen: '1 minute ago',
    lastSeenSw: 'Dk 1 iliyopita',
    status: 'active',
    serialNumber: 'DJI-T40-8812',
    agroIdLinked: 'AGRO-MAJ-920',
  },
  {
    id: '2',
    name: 'Soil Sensor Node (SM-3)',
    nameSw: 'Sensori ya Udongo (SM-3)',
    type: 'SENSOR',
    iconName: 'zap',
    battery: 92,
    latency: 120,
    lastSeen: '5 minutes ago',
    lastSeenSw: 'Dk 5 zilizopita',
    status: 'active',
    serialNumber: 'RIFT-SM3-4019',
    agroIdLinked: 'AGRO-MAJ-920',
  },
  {
    id: '3',
    name: 'Weather Station',
    nameSw: 'Kituo cha Hali ya Hewa',
    type: 'WEATHER',
    iconName: 'wind',
    battery: 76,
    latency: 185,
    lastSeen: '12 minutes ago',
    lastSeenSw: 'Dk 12 zilizopita',
    status: 'active',
    serialNumber: 'RIFT-WS-1102',
    agroIdLinked: 'AGRO-MAJ-920',
  },
  {
    id: '4',
    name: 'Irrigation Controller',
    nameSw: 'Mdhibiti wa Umwagiliaji',
    type: 'IRRIGATION',
    iconName: 'droplets',
    battery: 68,
    latency: 145,
    lastSeen: '2 minutes ago',
    lastSeenSw: 'Dk 2 zilizopita',
    status: 'active',
    serialNumber: 'RIFT-IRR-0891',
    agroIdLinked: 'AGRO-MAJ-920',
  },
  {
    id: '5',
    name: 'RFID Gate Controller',
    nameSw: 'Bango la Lango la RFID',
    type: 'GATE',
    iconName: 'cpu',
    battery: 81,
    latency: 110,
    lastSeen: '8 minutes ago',
    lastSeenSw: 'Dk 8 zilizopita',
    status: 'active',
    serialNumber: 'RIFT-RFID-004',
    agroIdLinked: 'AGRO-MAJ-920',
  },
];

export default function IOTSystems() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const language = useKilimoStore((s) => s.language);
  const agroId = useKilimoStore((s) => s.agroId);

  const [devices, setDevices] = useState<IoTDevice[]>(INITIAL_DEVICES);
  const [droneActive, setDroneActive] = useState(false);
  const [irrigationActive, setIrrigationActive] = useState(true);

  // Modals
  const [showRegModal, setShowRegModal] = useState(false);
  const [showWaypointModal, setShowWaypointModal] = useState(false);
  const [regStep, setRegStep] = useState<'scan' | 'form' | 'success'>('scan');
  const [serialInput, setSerialInput] = useState('');
  const [deviceNameInput, setDeviceNameInput] = useState('');
  const [deviceTypeInput, setDeviceTypeInput] = useState<'SENSOR' | 'GATE' | 'WATER'>('SENSOR');
  const [selectedSubTier, setSelectedSubTier] = useState<'monthly' | 'yearly' | null>(null);

  // Waypoint path
  const [waypoints, setWaypoints] = useState<string[]>([
    'Point A (Start): -6.7924, 39.2083',
    'Point B (Pasture): -6.7932, 39.2091',
    'Point C (Water Source): -6.7940, 39.2078',
    'Point D (North Boundary): -6.7915, 39.2069',
  ]);
  const [newWaypoint, setNewWaypoint] = useState('');

  // Pulse animation for active sensors
  const pulseScale = useSharedValue(1);
  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(withTiming(1.06, { duration: 1000 }), withTiming(1, { duration: 1000 })),
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

  // Device registration actions
  const startManualRegistration = () => {
    Haptics.selectionAsync();
    setRegStep('form');
  };

  const handleRegisterDevice = () => {
    if (!serialInput.trim()) {
      Alert.alert(
        language === 'sw' ? 'Namba ya Kifaa inahitajika' : 'Serial Number required',
        language === 'sw' ? 'Tafadhali weka serial number.' : 'Please input serial number.'
      );
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const newDevName = deviceNameInput.trim() || `${deviceTypeInput} Node ${devices.length + 1}`;
    const newIoTDevice: IoTDevice = {
      id: String(devices.length + 1),
      name: newDevName,
      nameSw: newDevName,
      type: deviceTypeInput,
      iconName: deviceTypeInput === 'SENSOR' ? 'zap' : deviceTypeInput === 'GATE' ? 'cpu' : 'droplets',
      battery: 100,
      latency: 75,
      lastSeen: 'Just now',
      lastSeenSw: 'Hivi sasa',
      status: 'active',
      serialNumber: serialInput.trim(),
      agroIdLinked: agroId?.id ?? 'AGRO-MAJ-920',
    };

    setDevices((prev) => [...prev, newIoTDevice]);
    setRegStep('success');
  };

  const handleSubscribe = (tier: 'monthly' | 'yearly') => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSelectedSubTier(tier);
    Alert.alert(
      language === 'sw' ? 'Kusajiliwa Kufanikiwa!' : 'Subscription Activated!',
      language === 'sw'
        ? `Umesajili huduma ya Premium IoT. Malipo ya ${tier === 'monthly' ? 'TSh 15,000/Mwezi' : 'TSh 150,000/Mwaka'} yatakatwa.`
        : `You subscribed to Premium IoT support. ${tier === 'monthly' ? 'TSh 15,000/Month' : 'TSh 150,000/Year'} will be billed.`
    );
  };

  const handleAddWaypoint = () => {
    if (!newWaypoint.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWaypoints((prev) => [...prev, newWaypoint.trim()]);
    setNewWaypoint('');
  };

  const handleRemoveWaypoint = (idx: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setWaypoints((prev) => prev.filter((_, i) => i !== idx));
  };

  const getDeviceIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'zap':
        return <Zap size={16} color={color} />;
      case 'wind':
        return <Wind size={16} color={color} />;
      case 'droplets':
        return <Droplets size={16} color={color} />;
      case 'cpu':
        return <Cpu size={16} color={color} />;
      case 'tv':
        return <Tv size={16} color={color} />;
      default:
        return <Target size={16} color={color} />;
    }
  };

  const getDeviceColor = (type: string) => {
    switch (type) {
      case 'DRONE':
        return '#3b82f6';
      case 'SENSOR':
        return '#22d15a';
      case 'WEATHER':
        return '#0ea5e9';
      case 'IRRIGATION':
        return '#a855f7';
      case 'GATE':
        return '#f59e0b';
      default:
        return '#94a3b8';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ImageBackground
        source={require('../assets/images/welcome_bg.png')}
        style={StyleSheet.absoluteFillObject}
      >
        <LinearGradient
          colors={[isDark ? 'rgba(18,26,15,0.85)' : 'rgba(255,255,255,0.7)', isDark ? '#121A0F' : '#FCFBF7']}
          style={StyleSheet.absoluteFillObject}
          locations={[0, 0.45]}
        />
      </ImageBackground>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
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

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Device Hub — Connection Status */}
          <Animated.View entering={FadeInUp.delay(50).springify()}>
            <View style={[styles.deviceHubBanner, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.deviceHubHeader, { backgroundColor: 'rgba(34,209,90,0.06)' }]}>
                <View style={styles.deviceHubTitleRow}>
                  <Animated.View style={[styles.searchingDot, animatedPulse, { backgroundColor: '#22d15a' }]} />
                  <Text style={[styles.deviceHubTitle, { color: colors.text }]}>
                    {language === 'sw' ? 'KITUO CHA VIFAA' : 'DEVICE HUB'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setRegStep('scan');
                    setSerialInput('');
                    setDeviceNameInput('');
                    setShowRegModal(true);
                  }}
                  style={styles.registerFab}
                >
                  <Plus size={12} color="#fff" />
                  <Text style={styles.registerFabText}>
                    {language === 'sw' ? 'Sajili' : 'Register'}
                  </Text>
                </TouchableOpacity>
              </View>

              {devices.map((device, i) => {
                const color = getDeviceColor(device.type);
                return (
                  <Animated.View
                    key={device.id}
                    entering={FadeInDown.delay(80 + i * 50).springify()}
                    style={[styles.deviceRow, { borderTopColor: colors.border }]}
                  >
                    <View style={[styles.deviceIconBox, { backgroundColor: color + '15' }]}>
                      {getDeviceIcon(device.iconName, color)}
                    </View>
                    <View style={styles.deviceInfo}>
                      <Text style={[styles.deviceName, { color: colors.text }]}>
                        {language === 'sw' ? device.nameSw : device.name}
                      </Text>
                      <Text style={[styles.deviceType, { color: colors.textMute }]}>
                        S/N: {device.serialNumber} {device.agroIdLinked ? `· Linked` : ''}
                      </Text>
                      
                      {/* Sub telemetry status */}
                      <View style={styles.telemetryMiniRow}>
                        <View style={styles.telemetryMiniBox}>
                          <BatteryCharging size={10} color={colors.textMute} />
                          <Text style={[styles.telemetryMiniTxt, { color: colors.textMute }]}>{device.battery}%</Text>
                        </View>
                        <View style={styles.telemetryMiniBox}>
                          <Wifi size={10} color={colors.textMute} />
                          <Text style={[styles.telemetryMiniTxt, { color: colors.textMute }]}>{device.latency}ms</Text>
                        </View>
                        <Text style={[styles.telemetryMiniTxt, { color: colors.textMute }]}>
                          Seen: {language === 'sw' ? device.lastSeenSw : device.lastSeen}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.deviceStatusRow}>
                      <View style={[styles.statusPulseDot, { backgroundColor: '#22d15a' }]} />
                      <Text style={[styles.deviceStatusText, { color: '#22d15a' }]}>
                        {language === 'sw' ? 'Imekamilika' : 'Connected'}
                      </Text>
                    </View>
                  </Animated.View>
                );
              })}

              <View style={[styles.deviceHubFooter, { borderTopColor: colors.border }]}>
                <Wifi size={12} color={colors.textMute} />
                <Text style={[styles.deviceHubFooterText, { color: colors.textMute }]}>
                  {language === 'sw'
                    ? 'Mifumo imeunganishwa salama · LoRaWAN Gateway active'
                    : 'System nodes connected securely · LoRaWAN Gateway active'}
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
                    <Text style={[styles.cardTitle, { color: colors.text }]}>DJI Agras T40</Text>
                    <Text style={[styles.cardSubtitle, { color: '#3b82f6' }]}>
                      {droneActive
                        ? language === 'sw'
                          ? 'Iko Hewani'
                          : 'In Flight'
                        : language === 'sw'
                        ? 'Ipo Kituoni'
                        : 'Standby'}
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
                    {language === 'sw' ? 'Payload' : 'Payload'}
                  </Text>
                </View>
              </View>

              <View style={styles.droneActions}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: droneActive ? '#ef4444' : colors.primary }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setDroneActive(!droneActive);
                  }}
                >
                  {droneActive ? (
                    <PlaneLanding size={18} color="#fff" />
                  ) : (
                    <PlaneTakeoff size={18} color={isDark ? '#000' : '#fff'} />
                  )}
                  <Text style={[styles.actionBtnText, { color: droneActive ? '#fff' : isDark ? '#000' : '#fff' }]}>
                    {droneActive
                      ? language === 'sw'
                        ? 'Tua Sasa'
                        : 'Land Now'
                      : language === 'sw'
                      ? 'Rusha Drone'
                      : 'Launch Drone'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtnSecondary, { borderColor: colors.border }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowWaypointModal(true);
                  }}
                >
                  <Map size={18} color={colors.text} />
                  <Text style={[styles.actionBtnTextSecondary, { color: colors.text }]}>
                    {language === 'sw' ? 'Chora Njia' : 'Waypoints'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* Premium Subscription Module */}
          <Animated.View entering={FadeInDown.delay(180).springify()}>
            <Text style={[styles.sectionTitle, { color: colors.textMute }]}>
              {language === 'sw' ? 'Msaada wa Matunzo (Premium)' : 'Premium Maintenance Support'}
            </Text>

            <View style={[styles.glassCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={{ gap: 4, marginBottom: 12 }}>
                <Text style={[styles.subTitleText, { color: colors.text }]}>
                  {language === 'sw' ? 'KilimoAI Premium IoT Subscription' : 'KilimoAI Premium IoT Subscription'}
                </Text>
                <Text style={[styles.subBodyText, { color: colors.textMute }]}>
                  {language === 'sw'
                    ? 'Pata huduma ya saa 24, mafundi shamba nyumbani kwako ndani ya masaa 12, na kubadilishiwa kifaa kikiharibika.'
                    : 'Get 24/7 remote monitoring, field technicians on-site within 12 hours, and replacement parts warranty.'}
                </Text>
              </View>

              <View style={styles.subTierRow}>
                <TouchableOpacity
                  onPress={() => handleSubscribe('monthly')}
                  style={[
                    styles.subTierBox,
                    {
                      borderColor: selectedSubTier === 'monthly' ? '#22d15a' : colors.border,
                      backgroundColor: selectedSubTier === 'monthly' ? 'rgba(34,209,90,0.06)' : 'transparent',
                    },
                  ]}
                >
                  <Text style={[styles.subTierName, { color: colors.text }]}>
                    {language === 'sw' ? 'Kila Mwezi' : 'Monthly'}
                  </Text>
                  <Text style={[styles.subTierPrice, { color: '#22d15a' }]}>TSh 15,000</Text>
                  <Text style={[styles.subTierPeriod, { color: colors.textMute }]}>/ mwezi</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSubscribe('yearly')}
                  style={[
                    styles.subTierBox,
                    {
                      borderColor: selectedSubTier === 'yearly' ? '#22d15a' : colors.border,
                      backgroundColor: selectedSubTier === 'yearly' ? 'rgba(34,209,90,0.06)' : 'transparent',
                    },
                  ]}
                >
                  <Text style={[styles.subTierName, { color: colors.text }]}>
                    {language === 'sw' ? 'Kila Mwaka' : 'Annual'}
                  </Text>
                  <Text style={[styles.subTierPrice, { color: '#22d15a' }]}>TSh 150,000</Text>
                  <Text style={[styles.subTierPeriod, { color: colors.textMute }]}>/ mwaka</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* Smart Irrigation */}
          <Animated.View entering={FadeInDown.delay(220).springify()}>
            <Text style={[styles.sectionTitle, { color: colors.textMute }]}>
              {language === 'sw' ? 'Umwagiliaji wa Akili' : 'Smart Irrigation'}
            </Text>

            <View style={[styles.glassCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <Animated.View
                    style={[
                      styles.iconBadge,
                      { backgroundColor: 'rgba(14,165,233,0.1)' },
                      irrigationActive && animatedPulse,
                    ]}
                  >
                    <CloudRain size={20} color="#0ea5e9" />
                  </Animated.View>
                  <View>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                      {language === 'sw' ? 'Bomba Kuu (Kanda 1-4)' : 'Main Valve (Zones 1-4)'}
                    </Text>
                    <Text style={[styles.cardSubtitle, { color: irrigationActive ? '#0ea5e9' : colors.textMute }]}>
                      {irrigationActive
                        ? language === 'sw'
                          ? 'Inamwagilia (2.4L/s)'
                          : 'Active (2.4L/s)'
                        : language === 'sw'
                        ? 'Imezimwa'
                        : 'Inactive'}
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
                  <Text style={[styles.iStatLabel, { color: colors.textMute }]}>
                    {language === 'sw' ? 'Unyevu wa Udongo' : 'Soil Moisture'}
                  </Text>
                  <Text style={[styles.iStatValue, { color: colors.text }]}>
                    42% <Text style={{ color: '#ef4444', fontSize: 12 }}>(Chini)</Text>
                  </Text>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '42%', backgroundColor: '#ef4444' }]} />
                  </View>
                </View>
                <View style={styles.iStat}>
                  <Text style={[styles.iStatLabel, { color: colors.textMute }]}>
                    {language === 'sw' ? 'Lengo la Unyevu' : 'Target Moisture'}
                  </Text>
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
                {
                  icon: <Wind size={24} color="#a855f7" />,
                  label: language === 'sw' ? 'Upepo' : 'Wind Speed',
                  value: '14 km/h',
                  color: '#a855f7',
                },
                {
                  icon: <Zap size={24} color="#f59e0b" />,
                  label: language === 'sw' ? 'Joto la Udongo' : 'Soil Temp',
                  value: '24°C',
                  color: '#f59e0b',
                },
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

      {/* Waypoints Planning Modal */}
      <Modal visible={showWaypointModal} transparent animationType="slide" onRequestClose={() => setShowWaypointModal(false)}>
        <View style={styles.modalOverlay}>
          <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {language === 'sw' ? 'Njia ya Ndege (Waypoints)' : 'Flight Waypoints'}
              </Text>
              <TouchableOpacity onPress={() => setShowWaypointModal(false)} style={styles.closeBtn}>
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 300 }} contentContainerStyle={{ gap: 8 }}>
              {waypoints.map((pt, idx) => (
                <View key={idx} style={[styles.waypointRow, { borderColor: colors.border }]}>
                  <Text style={[styles.waypointText, { color: colors.text }]}>{pt}</Text>
                  <TouchableOpacity onPress={() => handleRemoveWaypoint(idx)}>
                    <X size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <View style={styles.waypointInputRow}>
              <TextInput
                value={newWaypoint}
                onChangeText={setNewWaypoint}
                placeholder="e.g. -6.7952, 39.2100"
                placeholderTextColor={colors.textMute}
                style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              />
              <TouchableOpacity onPress={handleAddWaypoint} style={[styles.addWaypointBtn, { backgroundColor: colors.primary }]}>
                <Plus size={16} color="#000" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setShowWaypointModal(false);
                Alert.alert(
                  language === 'sw' ? 'Njia Imetumwa!' : 'Path Uploaded!',
                  language === 'sw' ? 'Gridi ya usambazaji imehamishiwa kwenye Drone.' : 'Waypoints grid path uploaded to drone flight deck.'
                );
              }}
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.saveBtnText}>
                {language === 'sw' ? 'Tuma Kwenye Drone' : 'Upload to Drone'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QR Registration Modal */}
      <Modal visible={showRegModal} transparent animationType="slide" onRequestClose={() => setShowRegModal(false)}>
        <View style={styles.modalOverlay}>
          <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {language === 'sw' ? 'Sajili Kifaa Mpya' : 'Register New Device'}
              </Text>
              <TouchableOpacity onPress={() => setShowRegModal(false)} style={styles.closeBtn}>
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            {regStep === 'scan' && (
              <View style={styles.scannerWrapper}>
                <View style={styles.cameraBox}>
                  <QrCode size={120} color={colors.textMute} strokeWidth={1} />
                  <Animated.View style={[styles.scannerLaser, { borderColor: colors.primary }]} />
                  <Text style={[styles.scannerDescText, { color: colors.textMute }]}>
                    {language === 'sw' ? 'Sogeza QR Code karibu na Kamera' : 'Align QR Code within the frame'}
                  </Text>
                </View>

                <TouchableOpacity onPress={startManualRegistration} style={[styles.manualBtn, { borderColor: colors.border }]}>
                  <Text style={[styles.manualBtnText, { color: colors.text }]}>
                    {language === 'sw' ? 'Weka Serial Number kwa Mkono' : 'Enter Serial Number Manually'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {regStep === 'form' && (
              <ScrollView contentContainerStyle={{ gap: 14 }}>
                <Text style={[styles.inputLabel, { color: colors.textMute }]}>
                  {language === 'sw' ? 'AINA YA KIFAA' : 'DEVICE TYPE'}
                </Text>
                <View style={styles.typeOptionRow}>
                  {(['SENSOR', 'GATE', 'WATER'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setDeviceTypeInput(type)}
                      style={[
                        styles.typeOptionBox,
                        {
                          borderColor: deviceTypeInput === type ? '#22d15a' : colors.border,
                          backgroundColor: deviceTypeInput === type ? 'rgba(34,209,90,0.08)' : 'transparent',
                        },
                      ]}
                    >
                      <Text style={[styles.typeOptionText, { color: deviceTypeInput === type ? '#22d15a' : colors.textMute }]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.inputLabel, { color: colors.textMute }]}>
                  {language === 'sw' ? 'JINA LA KIFAA' : 'DEVICE NAME'}
                </Text>
                <TextInput
                  value={deviceNameInput}
                  onChangeText={setDeviceNameInput}
                  placeholder="e.g. Sensori ya Udongo Mashariki"
                  placeholderTextColor={colors.textMute}
                  style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                />

                <Text style={[styles.inputLabel, { color: colors.textMute }]}>
                  {language === 'sw' ? 'NAMBA YA KITAMBULISHO (S/N)' : 'SERIAL NUMBER (S/N)'}
                </Text>
                <TextInput
                  value={serialInput}
                  onChangeText={setSerialInput}
                  placeholder="e.g. RIFT-SM-9041"
                  placeholderTextColor={colors.textMute}
                  style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                />

                <View style={styles.linkAlert}>
                  <CheckCircle2 size={16} color="#22d15a" />
                  <Text style={[styles.linkAlertText, { color: colors.textMute }]}>
                    {language === 'sw'
                      ? `Kifaa hiki kitaunganishwa kiotomatiki na Agro ID yako: ${agroId?.name ?? 'Justin Mafie'}`
                      : `This device will link automatically to your Agro ID: ${agroId?.name ?? 'Justin Mafie'}`}
                  </Text>
                </View>

                <TouchableOpacity onPress={handleRegisterDevice} style={[styles.saveBtn, { backgroundColor: colors.primary }]}>
                  <Text style={styles.saveBtnText}>
                    {language === 'sw' ? 'Sajili Kifaa' : 'Register Device'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}

            {regStep === 'success' && (
              <View style={styles.successWrapper}>
                <CheckCircle2 size={64} color="#22d15a" />
                <Text style={[styles.successTitle, { color: colors.text }]}>
                  {language === 'sw' ? 'Kifaa Kimesajiliwa!' : 'Device Linked!'}
                </Text>
                <Text style={[styles.successDesc, { color: colors.textMute }]}>
                  {language === 'sw'
                    ? 'Kifaa chako kipya kimeunganishwa na Agro ID yako na kimeanza kurusha vipimo.'
                    : 'Your new device is linked to your Agro ID profile and is transmitting telemetry.'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowRegModal(false);
                    setRegStep('scan');
                  }}
                  style={[styles.saveBtn, { backgroundColor: colors.primary, width: '100%', marginTop: 24 }]}
                >
                  <Text style={styles.saveBtnText}>{language === 'sw' ? 'Kamilisha' : 'Finish'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  registerFab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#22d15a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  registerFabText: {
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    color: '#000',
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  deviceIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
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
  telemetryMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  telemetryMiniBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  telemetryMiniTxt: {
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
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
  subTitleText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  subBodyText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    lineHeight: 18,
  },
  subTierRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  subTierBox: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    alignItems: 'center',
  },
  subTierName: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  subTierPrice: {
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    marginTop: 6,
  },
  subTierPeriod: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },

  // Modals styling
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 24,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'InstrumentSerif_400Regular',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerWrapper: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 20,
  },
  cameraBox: {
    width: 200,
    height: 200,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderWidth: 2,
    borderColor: 'rgba(34,209,90,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  scannerLaser: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    borderTopWidth: 2,
  },
  scannerDescText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    position: 'absolute',
    bottom: 12,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  manualBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  manualBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  inputLabel: {
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1,
  },
  typeOptionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOptionBox: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  typeOptionText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  linkAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(34,209,90,0.06)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34,209,90,0.15)',
  },
  linkAlertText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    flex: 1,
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#000',
  },
  successWrapper: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  successTitle: {
    fontSize: 18,
    fontFamily: 'InstrumentSerif_400Regular',
    marginTop: 12,
  },
  successDesc: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Waypoints specific styles
  waypointRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  waypointText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  waypointInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  addWaypointBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
