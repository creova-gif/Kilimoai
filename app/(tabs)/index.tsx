import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
  Platform,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert
} from 'react-native';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  SlideInRight,
  SlideOutLeft
} from 'react-native-reanimated';
import { 
  BrainCircuit, 
  Camera, 
  TrendingUp, 
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
  MapPin,
  ChevronDown,
  MoreHorizontal,
  Search,
  X,
  Globe
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import { useTasks } from '../../hooks/useTasks';
import { generateRecommendations, severityColor } from '../../lib/recommendations';
import { Card } from '../../components/ui/Card';
import { useSyncEngine } from '../../hooks/useSyncEngine';
import { chat, aiConfigured } from '../../lib/ai';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TRACK_RECORDS_DATA = {
  sw: [
    { date: 'Feb 10', title: 'Mbolea Vuli', subtitle: 'Samadi', completed: true },
    { date: 'Feb 17', title: 'Kupanda Mbegu', subtitle: 'Mbegu Bora', completed: true },
    { date: 'Feb 24', title: 'Mbolea ya KCl', subtitle: 'Kukua', completed: false },
    { date: 'Mar 03', title: 'Dawa SP-36', subtitle: 'Kuzuia wadudu', completed: false },
  ],
  en: [
    { date: 'Feb 10', title: 'Compost', subtitle: 'Fertilizer', completed: true },
    { date: 'Feb 17', title: 'Superior', subtitle: 'Seeds', completed: true },
    { date: 'Feb 24', title: 'KCl Fertilizer', subtitle: 'Fertilizer', completed: false },
    { date: 'Mar 03', title: 'SP-36', subtitle: 'Fertilizer', completed: false },
  ]
};

const GROWTH_DATA = [
  { label: 'Jul 24', value: 0.4 },
  { label: 'Jul 25', value: 0.55 },
  { label: 'Jul 26', value: 0.65 },
  { label: 'Jul 27', value: 0.45 },
  { label: 'Jul 28', value: 0.75 },
  { label: 'Jul 29', value: 0.90 },
  { label: 'Jul 30', value: 0.82 },
  { label: 'Jul 31', value: 0.70 },
  { label: 'Aug 01', value: 0.88 },
  { label: 'Aug 02', value: 0.95 },
  { label: 'Aug 03', value: 0.60 },
  { label: 'Aug 04', value: 0.85 },
];

// Pulsing indicator for "🔴 Live" crop telemetry
const PulsingDot = () => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 800 }),
        withTiming(0.8, { duration: 800 })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.dotContainer}>
      <Animated.View style={[styles.liveOuterDot, animatedStyle]} />
      <View style={styles.liveInnerDot} />
    </View>
  );
};

// Horizontal stepper timeline component
const TrackRecords = ({ colors, isDark, language }: any) => {
  const records = language === 'sw' ? TRACK_RECORDS_DATA.sw : TRACK_RECORDS_DATA.en;
  return (
    <Card variant="solid" style={[styles.trackCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.trackHeader}>
        <Text style={[styles.trackTitle, { color: colors.text }]}>
          {language === 'sw' ? 'Marekodi ya Ufuatiliaji' : 'Track Records'}
        </Text>
        <View style={[styles.qrBadge, { backgroundColor: colors.primaryLight }]}>
          <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 10 }}>QR Codes</Text>
        </View>
      </View>
      <View style={{ position: 'relative', marginTop: 16 }}>
        {/* Connection Line */}
        <View style={[styles.trackBgLine, { backgroundColor: isDark ? '#263322' : '#E2E8DF' }]} />
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trackScroll}>
          {records.map((item, idx) => (
            <View key={idx} style={styles.trackStep}>
              <View style={[
                styles.stepDot, 
                { 
                  backgroundColor: item.completed ? colors.primary : isDark ? '#171D15' : '#FFFFFF',
                  borderColor: item.completed ? colors.primary : isDark ? '#2A3326' : '#C4D0C0',
                  borderWidth: 2,
                }
              ]}>
                {item.completed && <View style={styles.activeDotInner} />}
              </View>
              <Text style={[styles.stepDate, { color: colors.textMute }]}>{item.date}</Text>
              <Text style={[styles.stepMainTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.stepSubtitle, { color: colors.textMute }]}>{item.subtitle}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Card>
  );
};

// Growth Rates vertical bar chart component
const GrowthChart = ({ colors, isDark, language }: any) => {
  const [selectedRange, setSelectedRange] = useState('M');

  return (
    <Card variant="solid" style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.chartHeader}>
        <View>
          <Text style={[styles.chartSub, { color: colors.textMute }]}>
            {language === 'sw' ? 'Kiwango cha ukuaji' : 'Growth rate'}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 2 }}>
            <Text style={[styles.chartValue, { color: colors.text }]}>0.75</Text>
            <Text style={[styles.chartUnit, { color: colors.textMute }]}> kg/ha</Text>
          </View>
        </View>
        <View style={[styles.rangeSelector, { backgroundColor: isDark ? '#121711' : '#EDF1EC' }]}>
          {['W', 'M', 'Y'].map((range) => (
            <TouchableOpacity
              key={range}
              onPress={() => setSelectedRange(range)}
              style={[
                styles.rangeBtn,
                selectedRange === range && { backgroundColor: colors.primary }
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Range ${range}`}
            >
              <Text style={[
                styles.rangeText,
                { color: selectedRange === range ? '#FFFFFF' : colors.textMute }
              ]}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.chartContainer}>
        {GROWTH_DATA.map((item, idx) => (
          <View key={idx} style={styles.chartBarWrapper}>
            <View style={[styles.chartBarBackground, { backgroundColor: isDark ? '#1C221A' : '#EDF1EC' }]}>
              <View 
                style={[
                  styles.chartBarFill, 
                  { 
                    height: `${item.value * 100}%`, 
                    backgroundColor: idx === 9 ? colors.primary : isDark ? '#2D4428' : '#B2C4AC' 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.chartLabel, { color: colors.textMute }]} numberOfLines={1}>{item.label}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

// ─── Inline Sparks / Charts for stats cards ───────────────────────────

const SoilHealthChart = ({ color }: { color: string }) => (
  <View style={styles.miniChartContainer}>
    <Svg height="30" width="130">
      <Defs>
        <SvgLinearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M0 25 C 20 22, 40 12, 60 18 C 80 24, 100 5, 130 8 L 130 30 L 0 30 Z"
        fill="url(#soilGrad)"
      />
      <Path
        d="M0 25 C 20 22, 40 12, 60 18 C 80 24, 100 5, 130 8"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </Svg>
  </View>
);

const MoistureChart = () => (
  <View style={styles.miniChartContainer}>
    <Svg height="30" width="130">
      <Defs>
        <SvgLinearGradient id="moistGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
          <Stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M0 12 C 25 28, 50 2, 75 22 C 100 32, 115 12, 130 15 L 130 30 L 0 30 Z"
        fill="url(#moistGrad)"
      />
      <Path
        d="M0 12 C 25 28, 50 2, 75 22 C 100 32, 115 12, 130 15"
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
      />
    </Svg>
  </View>
);

const TemperatureChart = () => {
  const heights = [10, 16, 14, 22, 26, 18, 20];
  return (
    <View style={styles.miniBarContainer}>
      {heights.map((h, i) => (
        <View 
          key={i} 
          style={{ 
            width: 4, 
            height: h, 
            backgroundColor: i === heights.length - 1 ? '#F59E0B' : 'rgba(245, 158, 11, 0.35)', 
            borderRadius: 2 
          }} 
        />
      ))}
    </View>
  );
};

const YieldChart = () => (
  <View style={styles.miniChartContainer}>
    <Svg height="30" width="130">
      <Defs>
        <SvgLinearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
          <Stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M0 28 Q 35 24, 65 15 T 130 3 L 130 30 L 0 30 Z"
        fill="url(#yieldGrad)"
      />
      <Path
        d="M0 28 Q 35 24, 65 15 T 130 3"
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="2"
      />
    </Svg>
  </View>
);

// Get crop layout specifications and images based on their names
const getCropMetadata = (cropName: string, language: 'en' | 'sw') => {
  const nameLower = (cropName || '').toLowerCase();
  let image = require('../../assets/images/rice-field-bg.png');
  let displayName = cropName;
  let harvestDays = 74;
  let currentDay = 65;
  let markers = {
    left: { 
      title: language === 'sw' ? 'Mbolea' : 'Manure', 
      sub: language === 'sw' ? 'Kabla ya Kupanda' : 'Before Planting',
      top: 120, left: '8%', lineW: '20%', lineH: 42, dotTop: 174
    },
    right: { 
      title: language === 'sw' ? 'Mbolea ya KCl' : 'KCl Fertilizer', 
      sub: language === 'sw' ? 'Wiki 2 - 3' : 'Age 2 - 3 Weeks',
      top: 88, right: '6%', lineW: '18%', lineH: 48, dotTop: 148
    }
  };

  if (nameLower.includes('maize') || nameLower.includes('mahindi')) {
    image = require('../../assets/images/crop_maize.png');
    displayName = language === 'sw' ? 'Mahindi' : 'Maize';
    harvestDays = 120;
    currentDay = 98;
    markers = {
      left: { 
        title: language === 'sw' ? 'Nafasi ya Mbegu' : 'Seed Spacing', 
        sub: language === 'sw' ? 'Siku ya Kwanza' : 'Day 1 planting',
        top: 110, left: '8%', lineW: '22%', lineH: 38, dotTop: 160
      },
      right: { 
        title: language === 'sw' ? 'Mbolea ya Urea' : 'Urea Fertilizer', 
        sub: language === 'sw' ? 'Wiki ya 4 - 6' : 'Week 4 - 6 dressing',
        top: 85, right: '8%', lineW: '20%', lineH: 52, dotTop: 150
      }
    };
  } else if (nameLower.includes('beans') || nameLower.includes('maharage')) {
    image = require('../../assets/images/crop_beans.png');
    displayName = language === 'sw' ? 'Maharage' : 'Beans';
    harvestDays = 85;
    currentDay = 60;
    markers = {
      left: { 
        title: language === 'sw' ? 'Kuweka Maji' : 'Watering', 
        sub: language === 'sw' ? 'Ua la kwanza' : 'First flowering',
        top: 130, left: '5%', lineW: '24%', lineH: 40, dotTop: 180
      },
      right: { 
        title: language === 'sw' ? 'Dawa ya Wadudu' : 'Pesticide', 
        sub: language === 'sw' ? 'Wiki ya 3' : 'Week 3 spray',
        top: 95, right: '5%', lineW: '18%', lineH: 45, dotTop: 152
      }
    };
  } else if (nameLower.includes('tomato') || nameLower.includes('nyanya')) {
    image = require('../../assets/images/crop_tomato.png');
    displayName = language === 'sw' ? 'Nyanya' : 'Tomato';
    harvestDays = 90;
    currentDay = 72;
    markers = {
      left: { 
        title: language === 'sw' ? 'Kupandikiza' : 'Transplanting', 
        sub: language === 'sw' ? 'Siku ya 1' : 'Day 1 field',
        top: 120, left: '8%', lineW: '20%', lineH: 42, dotTop: 174
      },
      right: { 
        title: language === 'sw' ? 'Kukata Matawi' : 'Pruning', 
        sub: language === 'sw' ? 'Kila Wiki' : 'Weekly trimming',
        top: 88, right: '6%', lineW: '18%', lineH: 48, dotTop: 148
      }
    };
  } else if (nameLower.includes('rice') || nameLower.includes('mpunga')) {
    image = require('../../assets/images/crop_rice.png');
    displayName = language === 'sw' ? 'Mpunga' : 'Rice';
    harvestDays = 130;
    currentDay = 105;
    markers = {
      left: { 
        title: language === 'sw' ? 'Kupandikiza' : 'Transplanting', 
        sub: language === 'sw' ? 'Siku ya 1' : 'Day 1 flooded',
        top: 120, left: '8%', lineW: '20%', lineH: 42, dotTop: 174
      },
      right: { 
        title: language === 'sw' ? 'Kukata Maji' : 'Drain Field', 
        sub: language === 'sw' ? 'Wiki 2 kabla ya kuvuna' : '2 weeks pre-harvest',
        top: 88, right: '6%', lineW: '18%', lineH: 48, dotTop: 148
      }
    };
  } else if (nameLower.includes('onion') || nameLower.includes('vitunguu')) {
    image = require('../../assets/images/crop_onion.png');
    displayName = language === 'sw' ? 'Vitunguu' : 'Onions';
    harvestDays = 120;
    currentDay = 85;
    markers = {
      left: { 
        title: language === 'sw' ? 'Kupandikiza' : 'Transplanting', 
        sub: language === 'sw' ? 'Siku ya 1' : 'Day 1 field',
        top: 120, left: '8%', lineW: '20%', lineH: 42, dotTop: 174
      },
      right: { 
        title: language === 'sw' ? 'Palizi ya Kwanza' : 'First Weeding', 
        sub: language === 'sw' ? 'Wiki ya 3' : 'Week 3',
        top: 88, right: '6%', lineW: '18%', lineH: 48, dotTop: 148
      }
    };
  } else if (nameLower.includes('cabbage') || nameLower.includes('kabichi')) {
    image = require('../../assets/images/crop_cabbage.png');
    displayName = language === 'sw' ? 'Kabichi' : 'Cabbage';
    harvestDays = 90;
    currentDay = 60;
    markers = {
      left: { 
        title: language === 'sw' ? 'Mbolea ya Urea' : 'Urea Fertilizer', 
        sub: language === 'sw' ? 'Wiki ya 4' : 'Week 4',
        top: 120, left: '8%', lineW: '20%', lineH: 42, dotTop: 174
      },
      right: { 
        title: language === 'sw' ? 'Viwavi' : 'Caterpillars', 
        sub: language === 'sw' ? 'Siku ya 45' : 'Day 45 spray',
        top: 88, right: '6%', lineW: '18%', lineH: 48, dotTop: 148
      }
    };
  } else if (nameLower.includes('sunflower') || nameLower.includes('alizeti')) {
    image = require('../../assets/images/crop_sunflower.png');
    displayName = language === 'sw' ? 'Alizeti' : 'Sunflower';
    harvestDays = 95;
    currentDay = 70;
    markers = {
      left: { 
        title: language === 'sw' ? 'Nafasi ya Kupanda' : 'Plant Spacing', 
        sub: language === 'sw' ? '75cm × 30cm' : 'Spacing 75x30cm',
        top: 120, left: '8%', lineW: '20%', lineH: 42, dotTop: 174
      },
      right: { 
        title: language === 'sw' ? 'Kukomaa' : 'Maturity Check', 
        sub: language === 'sw' ? 'Siku ya 85' : 'Day 85 check',
        top: 88, right: '6%', lineW: '18%', lineH: 48, dotTop: 148
      }
    };
  } else if (nameLower.includes('chili') || nameLower.includes('pilipili')) {
    image = require('../../assets/images/crop_chili.png');
    displayName = language === 'sw' ? 'Pilipili Kali' : 'Chili Peppers';
    harvestDays = 120;
    currentDay = 90;
    markers = {
      left: { 
        title: language === 'sw' ? 'Kitalu' : 'Nursery Bed', 
        sub: language === 'sw' ? 'Wiki 4 mapema' : '4 weeks before',
        top: 120, left: '8%', lineW: '20%', lineH: 42, dotTop: 174
      },
      right: { 
        title: language === 'sw' ? 'Mavuno ya Kwanza' : 'First Harvest', 
        sub: language === 'sw' ? 'Wiki ya 17' : 'Week 17 harvest',
        top: 88, right: '6%', lineW: '18%', lineH: 48, dotTop: 148
      }
    };
  } else if (nameLower.includes('sorghum') || nameLower.includes('mtama')) {
    image = require('../../assets/images/crop_sorghum.png');
    displayName = language === 'sw' ? 'Mtama' : 'Sorghum';
    harvestDays = 90;
    currentDay = 65;
    markers = {
      left: { 
        title: language === 'sw' ? 'Kupalilia' : 'Weeding', 
        sub: language === 'sw' ? 'Wiki ya 3' : 'Week 3 weed',
        top: 120, left: '8%', lineW: '20%', lineH: 42, dotTop: 174
      },
      right: { 
        title: language === 'sw' ? 'Kuzuia Ndege' : 'Bird Scaring', 
        sub: language === 'sw' ? 'Wiki ya 10' : 'Week 10 bird net',
        top: 88, right: '6%', lineW: '18%', lineH: 48, dotTop: 148
      }
    };
  }
  
  return { image, displayName, harvestDays, currentDay, markers };
};

export default function HomeScreen() {
  const { colors, isDark, radius, shadows } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const agroId = useKilimoStore((s) => s.agroId);
  const isOffline = useKilimoStore((s) => s.isOffline);
  const syncQueue = useKilimoStore((s) => s.syncQueue);
  const farmVitals = useKilimoStore((s) => s.farmVitals);
  const wallet = useKilimoStore((s) => s.wallet);
  const unreadCount = useKilimoStore((s) => s.unreadCount);
  const farmProfile = useKilimoStore((s) => s.farmProfile);
  const language = useKilimoStore((s) => s.language);
  const addNotification = useKilimoStore((s) => s.addNotification);
  const { createTask } = useTasks();

  // Guide Modal State
  const [activeGuideModal, setActiveGuideModal] = useState(false);
  const [activeGuideStep, setActiveGuideStep] = useState(0);

  // RAG Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [ragLoading, setRagLoading] = useState(false);
  const [ragResult, setRagResult] = useState<{ summary: string; source: string } | null>(null);

  // Ask Kilimo AI Chat Widget State
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatReply, setChatReply] = useState<string | null>(null);

  // Weekly Insights State
  const [weeklyInsight, setWeeklyInsight] = useState<{ title: string; body: string; source: string } | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);

  // Crop Slideshow Selection
  const primaryCrops = useMemo(() => {
    const crops = farmProfile?.primaryCrops || [];
    return crops.length > 0 ? crops : ['Mpunga (Rice)'];
  }, [farmProfile]);

  const [activeCropIndex, setActiveCropIndex] = useState(0);

  // Slide carousel effect
  useEffect(() => {
    if (primaryCrops.length <= 1) return;
    const interval = setInterval(() => {
      setActiveCropIndex((prev) => (prev + 1) % primaryCrops.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [primaryCrops]);

  const activeCrop = primaryCrops[activeCropIndex];
  const cropMeta = useMemo(() => getCropMetadata(activeCrop, language), [activeCrop, language]);

  // Translate Bento Stats
  const FARM_STATS = [
    { id: 'soil', label: language === 'sw' ? 'Afya ya Udongo' : 'Soil Health', value: `${farmVitals.soilHealth}%`, chart: <SoilHealthChart color={colors.primary} />, icon: <Leaf size={18} color={colors.primary} />, color: colors.primary, trend: language === 'sw' ? 'Nzuri' : 'Optimal' },
    { id: 'moisture', label: language === 'sw' ? 'Unyevu' : 'Moisture', value: `${farmVitals.moisture}%`, chart: <MoistureChart />, icon: <Droplets size={18} color="#2563EB" />, color: '#2563EB', trend: language === 'sw' ? 'Kawaida' : 'Optimal' },
    { id: 'weather', label: language === 'sw' ? 'Joto' : 'Temperature', value: `${farmVitals.temperature}°C`, chart: <TemperatureChart />, icon: <Sun size={18} color="#F59E0B" />, color: '#F59E0B', trend: language === 'sw' ? 'Imara' : 'Optimal' },
    { id: 'yield', label: language === 'sw' ? 'Kadirio Mavuno' : 'Yield Est.', value: `${farmVitals.yieldEstimate}t`, chart: <YieldChart />, icon: <TrendingUp size={18} color="#8b5cf6" />, color: '#8b5cf6', trend: language === 'sw' ? 'Kawaida' : 'Optimal' },
  ];

  const quickActions = useMemo(() => [
    { id: 'scan', label: language === 'sw' ? 'Uchunguzi' : 'Scan', icon: <Camera size={22} color="#fff" />, color: '#4CAF50', desc: language === 'sw' ? 'Chunguza Ugonjwa' : 'AI Crop Scan' },
    { id: 'tasks', label: language === 'sw' ? 'Ratiba' : 'Tasks', icon: <LayoutGrid size={22} color="#fff" />, color: '#3b82f6', desc: language === 'sw' ? 'Kazi za Shamba' : 'Farm Tasks' },
    { id: 'market', label: language === 'sw' ? 'Soko' : 'Market', icon: <TrendingUp size={22} color="#fff" />, color: '#f59e0b', desc: language === 'sw' ? 'Bei za Mazao' : 'Market Prices' },
    { id: 'crop-planning', label: language === 'sw' ? 'Upangaji' : 'Planning', icon: <Leaf size={22} color="#fff" />, color: '#22c55e', desc: language === 'sw' ? 'Upangaji wa Mazao' : 'AI Crop Planning' },
    { id: 'contracts', label: language === 'sw' ? 'Mikataba' : 'Contracts', icon: <BarChart3 size={22} color="#fff" />, color: '#8b5cf6', desc: language === 'sw' ? 'Kilimo cha Mkataba' : 'Contract Farming' },
  ], [language]);

  const recommendations = useMemo(
    () => generateRecommendations({ profile: farmProfile, vitals: farmVitals, language }),
    [farmProfile, farmVitals, language]
  );

  const setLastSyncedAt = useKilimoStore((s) => s.setLastSyncedAt);
  const { forceSync } = useSyncEngine();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await forceSync();
    setLastSyncedAt(new Date().toISOString());
    setRefreshing(false);
  }, [setLastSyncedAt, forceSync]);

  // Execute RAG Search
  const handleRagSearch = async () => {
    const query = searchQuery.trim();
    if (!query) return;
    setRagLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      if (aiConfigured()) {
        const prompt = `Act as an agricultural search RAG system. Answer the following search query: "${query}" in ${language === 'sw' ? 'Kiswahili' : 'English'}.
        Keep the answer very brief (max 3 sentences). 
        You MUST output a clean JSON object ONLY, with no markdown styling:
        {
          "summary": "AI summary text here...",
          "source": "realistic source citation, e.g. TARI (2024) or FAO guidelines"
        }`;
        const resText = await chat([{ role: 'user', content: prompt }]);
        const parsed = JSON.parse(resText.replace(/```json\s*|\s*```/g, '').trim());
        setRagResult(parsed);
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        const queryLower = query.toLowerCase();
        if (queryLower.includes('mbeya') || queryLower.includes('maize') || queryLower.includes('mahindi')) {
          if (language === 'sw') {
            setRagResult({
              summary: 'Uzalishaji wa mahindi mkoani Mbeya hufaidika na udongo wa kichanga wenye pH ya 6.2. Mavuno bora hutokea kati ya Juni na Agosti. Inashauriwa kuvuna wakati unyevu wa nafaka uko chini ya 15% ili kuzuia kuvu.',
              source: 'Mwongozo wa Kilimo Tanzania (TARI Mbeya, 2024)'
            });
          } else {
            setRagResult({
              summary: 'Maize production in Mbeya benefit from fertile loam soil with pH 6.2. The optimal harvest window is between June and August. It is recommended to harvest when grain moisture is below 15% to prevent aflatoxin.',
              source: 'Tanzania Agriculture Research Institute (TARI, 2024)'
            });
          }
        } else if (queryLower.includes('nitrogen') || queryLower.includes('nitrojeni')) {
          if (language === 'sw') {
            setRagResult({
              summary: 'Nitrojeni ya chini kwenye Zone 42 inasababishwa na kilimo cha mara kwa mara bila mzunguko wa mazao ya kunde. Inashauriwa kuongeza mbolea ya Urea (kilo 50/ekari) au kupanda maharage ili kurejesha rutuba ya nitrojeni.',
              source: 'Ripoti ya Udongo ya Kilimo AI (Zone 42 Soil Report)'
            });
          } else {
            setRagResult({
              summary: 'Low nitrogen in Zone 42 is caused by continuous cropping without legume rotation. We recommend applying Urea (50kg/acre) or intercropping with beans to naturally restore nitrogen levels.',
              source: 'Kilimo AI Sensor Analytics (Zone 42 Soil Report)'
            });
          }
        } else {
          if (language === 'sw') {
            setRagResult({
              summary: `Majibu ya utafutaji wa "${query}": Mazao ya shamba lako yanahitaji mbolea sahihi na umwagiliaji kwa wakati. Tafadhali wasiliana na afisa ugani kwa maelezo zaidi.`,
              source: 'Kitabu cha Kilimo cha Taifa'
            });
          } else {
            setRagResult({
              summary: `Search results for "${query}": Your farm crops require proper fertilization and scheduled irrigation. Please consult your local extension officer for crop-specific actions.`,
              source: 'National Agricultural Handbook'
            });
          }
        }
      }
    } catch {
      setRagResult({
        summary: language === 'sw' ? 'Imeshindwa kupata majibu kwa sasa.' : 'Unable to retrieve search context right now.',
        source: 'System Error'
      });
    } finally {
      setRagLoading(false);
    }
  };

  // Submit chat widget query
  const handleChatWidgetSubmit = async (queryText?: string) => {
    const query = (queryText || chatInput).trim();
    if (!query) return;
    setChatLoading(true);
    setChatInput('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      if (aiConfigured()) {
        const promptText = `Wewe ni msaidizi wa Kilimo AI. Jibu kwa kifupi swali hili kwa ${language === 'sw' ? 'Kiswahili' : 'English'}: "${query}"`;
        const reply = await chat([{ role: 'user', content: promptText }]);
        setChatReply(reply);
      } else {
        await new Promise((r) => setTimeout(r, 1000));
        const queryLower = query.toLowerCase();
        if (queryLower.includes('nitrogen') || queryLower.includes('nitrojeni')) {
          setChatReply(language === 'sw' 
            ? 'Nitrojeni iko chini kwa sababu ya kilimo cha mfululizo. Kupanda maharage au kuweka mbolea ya Urea kutarudisha rutuba.' 
            : 'Low nitrogen is usually caused by repeated mono-cropping. Intercropping with beans or applying Urea fertilizer will restore soil nutrients.');
        } else if (queryLower.includes('bei') || queryLower.includes('market') || queryLower.includes('price')) {
          setChatReply(language === 'sw' 
            ? 'Bei ya Mahindi soko la Tandale imepanda hadi TZS 85,000 kwa gunia la kilo 100 leo. Hii ni ongezeko la 2.4%.' 
            : 'Maize prices at Tandale market increased to TZS 85,000 per 100kg bag today. That is a 2.4% increase.');
        } else {
          setChatReply(language === 'sw'
            ? 'Sankofa AI imepokea swali lako. Mwagilia mmea asubuhi kabla ya jua kali na uhakikishe mifereji iko wazi shambani.'
            : 'Sankofa AI has received your query. Please irrigate your crops early in the morning and verify field drainage is optimal.');
        }
      }
    } catch {
      setChatReply(language === 'sw' ? 'Kuna hitilafu ya mtandao, jaribu tena.' : 'Network error. Please try again.');
    } finally {
      setChatLoading(false);
    }
  };

  // Fetch LLM weekly insight
  useEffect(() => {
    let active = true;
    const fetchWeeklyInsight = async () => {
      setInsightLoading(true);
      try {
        const cropsList = primaryCrops.join(', ');
        const prompt = `Generate a human-like, actionable weekly farming recommendation for a farmer in ${farmProfile?.region || 'Mbeya'}, Tanzania growing ${cropsList}. 
        Write the response in ${language === 'sw' ? 'Kiswahili' : 'English'}.
        Respond with a clean JSON format ONLY, with no markdown code blocks:
        {
          "title": "short catchy title",
          "body": "actionable 2-sentence recommendation detail",
          "source": "realistic source citation, e.g. TARI (2024)"
        }`;
        
        let insightText = '';
        if (aiConfigured()) {
          insightText = await chat([{ role: 'user', content: prompt }]);
        } else {
          await new Promise((r) => setTimeout(r, 1200));
          if (language === 'sw') {
            insightText = JSON.stringify({
              title: "Muda wa Kupalilia na Kuweka Urea",
              body: `Kwa kuwa mahindi yako yana wiki 4 sasa mkoani ${farmProfile?.region || 'Mbeya'}, weka mbolea ya Urea (kilo 50 kwa ekari) baada ya kupalilia. Hii itaongeza ukuaji wa majani kwa haraka.`,
              source: "Afisa Ugani (TARI, 2024)"
            });
          } else {
            insightText = JSON.stringify({
              title: "Weeding and Urea Application",
              body: `Since your maize is at week 4 in ${farmProfile?.region || 'Mbeya'}, apply Urea fertilizer (50kg/acre) immediately after weeding. This boosts leafy vegetative growth.`,
              source: "Extension Officer (TARI, 2024)"
            });
          }
        }
        
        if (!active) return;
        try {
          const parsed = JSON.parse(insightText.replace(/```json\s*|\s*```/g, '').trim());
          setWeeklyInsight(parsed);
        } catch {
          setWeeklyInsight({
            title: language === 'sw' ? 'Ushauri wa Mbolea' : 'Fertilization Advice',
            body: insightText.slice(0, 150),
            source: 'Kilimo AI'
          });
        }
      } catch (err) {
        if (active) {
          setWeeklyInsight({
            title: language === 'sw' ? 'Dhibiti Unyevu wa Udongo' : 'Manage Soil Moisture',
            body: language === 'sw' ? 'Mwagilia asubuhi na jioni ili kulinda mimea dhidi ya ukame unaotarajiwa.' : 'Water your crops in the morning and evening to protect against the expected dry spell.',
            source: 'Kilimo AI'
          });
        }
      } finally {
        if (active) setInsightLoading(false);
      }
    };
    
    fetchWeeklyInsight();
    return () => { active = false; };
  }, [farmProfile, language, primaryCrops]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />}
      >
        {/* Immersive Hero Header */}
        <View style={styles.heroWrapper}>
          <Image 
            source={cropMeta.image} 
            style={styles.heroImage} 
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.1)', colors.background]}
            style={StyleSheet.absoluteFill}
          />
          
          {/* Crop Overlay Visual Telemetry Markers */}
          <View style={StyleSheet.absoluteFill}>
            {/* Left Marker */}
            <View style={[styles.markerLabelContainer, { left: cropMeta.markers.left.left as any, top: cropMeta.markers.left.top } as any]}>
              <Text style={styles.markerLabelTitle}>{cropMeta.markers.left.title}</Text>
              <Text style={styles.markerLabelSub}>{cropMeta.markers.left.sub}</Text>
            </View>
            <View style={[styles.markerLineH, { left: '26%', top: cropMeta.markers.left.top + 12, width: cropMeta.markers.left.lineW as any } as any]} />
            <View style={[styles.markerLineV, { left: '46%', top: cropMeta.markers.left.top + 12, height: cropMeta.markers.left.lineH } as any]} />
            <View style={[styles.markerDot, { left: '45%', top: cropMeta.markers.left.dotTop, borderColor: colors.primary } as any]} />

            {/* Right Marker */}
            <View style={[styles.markerLabelContainer, { right: cropMeta.markers.right.right as any, top: cropMeta.markers.right.top, alignItems: 'flex-end' } as any]}>
              <Text style={styles.markerLabelTitle}>{cropMeta.markers.right.title}</Text>
              <Text style={styles.markerLabelSub}>{cropMeta.markers.right.sub}</Text>
            </View>
            <View style={[styles.markerLineH, { right: '28%', top: cropMeta.markers.right.top + 12, width: cropMeta.markers.right.lineW as any } as any]} />
            <View style={[styles.markerLineV, { right: '46%', top: cropMeta.markers.right.top + 12, height: cropMeta.markers.right.lineH } as any]} />
            <View style={[styles.markerDot, { right: '45.1%', top: cropMeta.markers.right.dotTop, borderColor: colors.primary } as any]} />
          </View>
          
          <SafeAreaView style={styles.heroHeader}>
            <View style={[styles.locationPill, { backgroundColor: isDark ? 'rgba(23, 29, 21, 0.75)' : 'rgba(255, 255, 255, 0.85)' }]}>
              <MapPin size={14} color={colors.primary} />
              <Text style={[styles.locationText, { color: colors.text }]}>{farmProfile?.region || agroId?.location || 'Mbeya, Tanzania'}</Text>
            </View>
            
            <View style={styles.headerActions}>
              {isOffline && (
                <View style={styles.offlineIndicator}>
                  <WifiOff size={16} color="#ef4444" />
                  <Text style={styles.offlineText}>{syncQueue.length} Q</Text>
                </View>
              )}
              
              <TouchableOpacity 
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/notifications' as any); }}
                style={[styles.heroActionCircle, { backgroundColor: isDark ? 'rgba(23, 29, 21, 0.75)' : 'rgba(255, 255, 255, 0.85)' }]}
                accessibilityLabel="Notifications"
                accessibilityRole="button"
              >
                <Bell size={20} color={colors.text} />
                {unreadCount > 0 && !isOffline && <View style={styles.heroNotificationDot} />}
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => router.push('/(tabs)/profile' as any)}>
                <View style={[styles.heroAvatarBorder, { borderColor: colors.primary }]}>
                  {agroId?.avatarUrl ? (
                    <Image source={{ uri: agroId.avatarUrl }} style={styles.heroAvatar} />
                  ) : (
                    <View style={[styles.heroAvatar, { backgroundColor: colors.primary }]}>
                      <Text style={styles.heroAvatarText}>
                        {agroId?.name?.[0]?.toUpperCase() || '?'}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Crop Telemetry Info Overlay */}
          <View style={styles.heroCropPanel}>
            <View style={styles.cropTitleRow}>
              <Text style={styles.cropLabel}>
                {language === 'sw' ? 'MAZAO YAKO YA KILIMO' : 'YOUR AGRICULTURAL CROPS'}
              </Text>
              <View style={[styles.liveBadge, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <PulsingDot />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
            <View style={styles.cropSelectorRow}>
              <Text style={styles.cropName}>{cropMeta.displayName}</Text>
              {primaryCrops.length > 1 && (
                <View style={styles.slideshowIndicator}>
                  <Text style={styles.slideshowIndicatorText}>
                    {activeCropIndex + 1}/{primaryCrops.length}
                  </Text>
                </View>
              )}
            </View>
            
            {/* Cycle Progress bar */}
            <View style={styles.harvestTimeline}>
              <View style={styles.timelineTexts}>
                <Text style={styles.timelineLeft}>
                  {language === 'sw' ? 'Muda wa Kuvuna' : 'Time to harvest'}
                </Text>
                <Text style={styles.timelineRight}>
                  {`${cropMeta.harvestDays - cropMeta.currentDay} ${language === 'sw' ? 'siku' : 'days'} (${cropMeta.currentDay}/${cropMeta.harvestDays})`}
                </Text>
              </View>
              <View style={styles.timelineProgressBg}>
                <View style={[styles.timelineProgressFill, { backgroundColor: colors.primary, width: `${(cropMeta.currentDay / cropMeta.harvestDays) * 100}%` }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Content body below the Hero */}
        <View style={styles.mainContent}>

          {/* RAG SEARCH BAR */}
          <Animated.View entering={FadeInDown.delay(100).springify()} style={[styles.searchBarContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.searchBarInner}>
              <Search size={20} color={colors.textMute} />
              <TextInput
                style={[styles.searchBarInput, { color: colors.text }]}
                placeholder={language === 'sw' ? 'Tafuta miongozo ya mazao, udongo au masoko...' : 'Search crop guides, soil, or markets...'}
                placeholderTextColor={colors.textMute}
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  if (!text.trim()) setRagResult(null);
                }}
                onSubmitEditing={handleRagSearch}
                accessibilityLabel="RAG Search"
                accessibilityHint="Query agricultural guides and get cited source cards"
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => { setSearchQuery(''); setRagResult(null); }} accessibilityRole="button" accessibilityLabel="Clear Search">
                  <X size={18} color={colors.textMute} />
                </TouchableOpacity>
              ) : null}
            </View>

            {ragLoading && (
              <View style={styles.searchLoading}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.searchLoadingText, { color: colors.textMute }]}>
                  {language === 'sw' ? 'Inatafuta nyaraka...' : 'Retrieving context...'}
                </Text>
              </View>
            )}

            {ragResult && (
              <Animated.View entering={FadeInDown} style={[styles.searchResultCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderColor: colors.border }]}>
                <View style={styles.searchResultHeader}>
                  <Sparkles size={14} color={colors.primary} />
                  <Text style={[styles.searchResultTitle, { color: colors.primary }]}>
                    {language === 'sw' ? 'Jibu la AI (RAG)' : 'AI Synthesis (RAG)'}
                  </Text>
                </View>
                <Text style={[styles.searchResultBody, { color: colors.text }]}>{ragResult.summary}</Text>
                
                {/* Cited Source Card */}
                <View style={[styles.citedCard, { backgroundColor: isDark ? '#171D15' : '#EAF0E8', borderColor: colors.primary + '30' }]}>
                  <Globe size={12} color={colors.primary} />
                  <Text style={[styles.citedText, { color: colors.primary }]}>
                    {language === 'sw' ? `Kumbukumbu: ${ragResult.source}` : `Cited Source: ${ragResult.source}`}
                  </Text>
                </View>
              </Animated.View>
            )}
          </Animated.View>
          
          {/* Horizontal Track Records timeline stepper */}
          <TrackRecords colors={colors} isDark={isDark} language={language} />

          {/* Quick Actions Scroll */}
          <View style={{ marginVertical: 12 }}>
            <Text style={[styles.bentoSectionTitle, { color: colors.textMute, marginLeft: 4 }]}>
              {language === 'sw' ? 'NJIA ZA HARAKA' : 'QUICK ACTIONS'}
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.actionScroll}
              snapToInterval={SCREEN_WIDTH * 0.65 + 16} 
              decelerationRate="fast"
            >
              {quickActions.map((action) => (
                <TouchableOpacity 
                  key={action.id} 
                  activeOpacity={0.88} 
                  onPress={() => { 
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); 
                    if (action.id === 'contracts' && agroId?.tier === 'Free') {
                      router.push('/upgrade' as any);
                    } else {
                      router.push(`/${action.id}` as any); 
                    }
                  }} 
                  style={styles.actionCardWrapper}
                  accessibilityLabel={action.label}
                  accessibilityHint={action.desc}
                  accessibilityRole="button"
                >
                  <LinearGradient 
                    colors={[action.color, action.color + 'aa']} 
                    style={[styles.actionCard, { borderRadius: radius.lg }]} 
                    start={{ x: 0, y: 0 }} 
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.actionIconOuter}>
                      {action.icon}
                    </View>
                    <View>
                      <Text style={styles.actionLabel}>{action.label}</Text>
                      <Text style={styles.actionDesc}>{action.desc}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Farming Guides / Miongozo ya Kilimo */}
          <Animated.View entering={FadeInDown.delay(100).springify()} style={{ marginVertical: 8 }}>
            <Text style={[styles.bentoSectionTitle, { color: colors.textMute, marginLeft: 4 }]}>
              {language === 'sw' ? 'MIONGOZO YA KILIMO' : 'FARMING GUIDES'}
            </Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setActiveGuideStep(0);
                setActiveGuideModal(true);
              }}
              accessibilityRole="button"
              accessibilityLabel={language === 'sw' ? 'Mwongozo wa Kupanda Mahindi' : 'Maize Planting Guide'}
              style={[styles.guideCard, { borderColor: colors.border, backgroundColor: colors.card }]}
            >
              <Image
                source={require('../../assets/images/maize_planting_guide.png')}
                style={styles.guideCardImage}
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.85)']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.guideCardContent}>
                <View style={[styles.guideBadge, { backgroundColor: colors.primary }]}>
                  <Sparkles size={10} color="#FCFBF7" />
                  <Text style={styles.guideBadgeText}>TARI RECOMMENDED</Text>
                </View>
                <Text style={styles.guideCardTitle}>
                  {language === 'sw' ? 'Jinsi ya Kupanda Mahindi' : 'How to Plant Maize'}
                </Text>
                <Text style={styles.guideCardDesc}>
                  {language === 'sw' 
                    ? 'Mwongozo kamili wa nafasi, kina, mbolea na maandalizi ya udongo.' 
                    : 'Full step-by-step guide on spacing, depth, fertilizing and soil prep.'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Growth Rate Chart */}
          <GrowthChart colors={colors} isDark={isDark} language={language} />

          {/* Wallet Card - Replaced with Olive Premium card */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Card variant="solid" style={[styles.walletCard, { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark, ...shadows.premium }]}>
              <View style={styles.walletHeader}>
                <View style={[styles.agroIdBadge, { backgroundColor: 'rgba(255, 255, 255, 0.08)' }]}>
                  <Fingerprint size={12} color="#FCFBF7" />
                  <Text style={[styles.agroIdText, { color: '#FCFBF7' }]}>AGRO ID SECURED</Text>
                </View>
                <View style={[styles.mobileMoneyTag, { backgroundColor: colors.primary }]}>
                  <Text style={styles.mobileMoneyText}>{agroId?.mpesaLinked ? 'M-PESA LINKED' : 'LINK M-PESA'}</Text>
                </View>
              </View>

              <Text style={[styles.balanceLabel, { color: 'rgba(252, 251, 247, 0.6)' }]}>
                {language === 'sw' ? 'Akiba Yako (TZS)' : 'Your Savings (TZS)'}
              </Text>
              <View style={styles.balanceRow}>
                <Text style={[styles.balanceAmount, { color: '#FCFBF7' }]}>{wallet.balanceTZS.toLocaleString()}</Text>
                <Text style={[styles.balanceDecimals, { color: 'rgba(252, 251, 247, 0.6)' }]}>.00</Text>
              </View>

              <View style={styles.walletActions}>
                <TouchableOpacity
                  style={[styles.walletBtn, { backgroundColor: '#FCFBF7' }]}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/agro-id' as any); }}
                  accessibilityRole="button"
                  accessibilityLabel="Deposit funds"
                >
                  <ArrowDownLeft size={16} color="#080A08" />
                  <Text style={[styles.walletBtnText, { color: '#080A08' }]}>
                    {language === 'sw' ? 'Weka Pesa' : 'Deposit'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.walletBtn, { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)' }]}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/wallet-admin' as any); }}
                  accessibilityRole="button"
                  accessibilityLabel="Pay cooperative dues"
                >
                  <ArrowUpRight size={16} color="#FCFBF7" />
                  <Text style={[styles.walletBtnText, { color: '#FCFBF7' }]}>
                    {language === 'sw' ? 'Lipa Co-op' : 'Pay Co-op'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          </Animated.View>

          {/* Bento Vitals Grid */}
          <View style={styles.bentoSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {language === 'sw' ? 'Afya ya Shamba' : 'Farm Vitals'}
              </Text>
              <TouchableOpacity
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/analytics' as any); }}
                accessibilityRole="button"
                accessibilityLabel="View farm sensors"
              >
                <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 12 }}>
                  {language === 'sw' ? 'DENSORI →' : 'SENSORS →'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statsGrid}>
              {FARM_STATS.map((stat) => (
                <View key={stat.id} style={styles.statCardContainer}>
                  <Card variant="solid" style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.lg, ...shadows.sm }]}>
                    <View style={styles.statHeaderRow}>
                      <View style={[styles.statIconBg, { backgroundColor: stat.color + '12' }]}>
                        {stat.icon}
                      </View>
                      <TouchableOpacity>
                        <MoreHorizontal size={16} color={colors.textMute} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.statMainBody}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.statValueText, { color: colors.text }]}>{stat.value}</Text>
                        <Text style={[styles.statLabelText, { color: colors.textMute }]}>{stat.label}</Text>
                      </View>
                      {/* Embed Sparklines / mini graphs here */}
                      {stat.chart}
                    </View>
                    <View style={styles.statTrendRow}>
                      <ArrowUpRight size={12} color={colors.primary} />
                      <Text style={[styles.statTrendLabel, { color: colors.primary }]}>{stat.trend}</Text>
                    </View>
                  </Card>
                </View>
              ))}
            </View>
          </View>

          {/* ASK KILIMO AI LLM WIDGET */}
          <Animated.View entering={FadeInDown.delay(150).springify()} style={[styles.chatWidgetCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.chatWidgetHeader}>
              <BrainCircuit size={20} color={colors.primary} />
              <Text style={[styles.chatWidgetTitle, { color: colors.text }]}>
                {language === 'sw' ? 'Uliza Kilimo AI' : 'Ask Kilimo AI'}
              </Text>
              <Sparkles size={16} color={colors.primary} style={styles.chatWidgetSparkle} />
            </View>
            
            <Text style={[styles.chatWidgetDesc, { color: colors.textMute }]}>
              {language === 'sw' ? 'Uliza lolote kuhusu nitrojeni, wadudu au masoko ya karibu.' : 'Ask about Nitrogen levels, disease control, or localized markets.'}
            </Text>

            <View style={styles.suggestionsWrapper}>
              {[
                language === 'sw' ? 'Mbona nitrogen iko chini Zone 42?' : 'Why is Nitrogen low in Zone 42?',
                language === 'sw' ? 'Bei ya mahindi Mbeya?' : 'Maize market price in Mbeya?'
              ].map((query, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setChatInput(query);
                    handleChatWidgetSubmit(query);
                  }}
                  style={[styles.suggestionPill, { backgroundColor: isDark ? '#1C221A' : '#EDF1EC' }]}
                  accessibilityRole="button"
                  accessibilityLabel={`Ask suggestion: ${query}`}
                >
                  <Text style={[styles.suggestionTextText, { color: colors.text }]}>{query}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.chatWidgetInputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <TextInput
                style={[styles.chatWidgetInput, { color: colors.text }]}
                placeholder={language === 'sw' ? 'Uliza Kilimo AI...' : 'Ask Kilimo AI...'}
                placeholderTextColor={colors.textMute}
                value={chatInput}
                onChangeText={setChatInput}
                onSubmitEditing={() => handleChatWidgetSubmit()}
                accessibilityLabel="Ask Kilimo AI Input"
              />
              <TouchableOpacity
                onPress={() => handleChatWidgetSubmit()}
                disabled={chatLoading || !chatInput.trim()}
                style={[styles.chatWidgetSendBtn, { backgroundColor: chatInput.trim() ? colors.primary : 'transparent' }]}
                accessibilityRole="button"
                accessibilityLabel="Send message"
              >
                {chatLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <ArrowRight size={18} color={chatInput.trim() ? '#fff' : colors.textMute} />
                )}
              </TouchableOpacity>
            </View>

            {chatReply && (
              <Animated.View entering={FadeInDown} style={[styles.chatWidgetReply, { backgroundColor: isDark ? '#121711' : '#F6F9F5', borderColor: colors.primary + '20' }]}>
                <Text style={[styles.chatWidgetReplyHeader, { color: colors.primary }]}>Kilimo AI:</Text>
                <Text style={[styles.chatWidgetReplyText, { color: colors.text }]}>{chatReply}</Text>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/(tabs)/ai' as any);
                  }}
                  style={styles.chatWidgetReplyAction}
                  accessibilityRole="button"
                  accessibilityLabel="Open in full screen chat"
                >
                  <Text style={[styles.chatWidgetReplyActionText, { color: colors.primary }]}>
                    {language === 'sw' ? 'Fungua Mazungumzo Kamili →' : 'Open Full Chat →'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </Animated.View>

          {/* AI Recommendations */}
          <View style={styles.recSection}>
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Lightbulb size={18} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {language === 'sw' ? 'Mapendekezo ya AI' : 'Sankofa AI'}
                </Text>
              </View>
              <Text style={{ color: colors.textMute, fontFamily: 'Inter_700Bold', fontSize: 11 }}>
                {recommendations.length + (weeklyInsight ? 1 : 0)} NEW
              </Text>
            </View>
            
            <View style={{ gap: 10 }}>
              {/* Dynamic Weekly Insights Powered by LLM */}
              {insightLoading && (
                <Card variant="solid" style={[styles.recCard, { backgroundColor: colors.card, borderColor: colors.border, alignItems: 'center', padding: 20 }]}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={{ color: colors.textMute, marginTop: 8, fontSize: 12 }}>
                    {language === 'sw' ? 'Inapakia Ushauri wa AI...' : 'Generating Weekly Insights...'}
                  </Text>
                </Card>
              )}

              {weeklyInsight && !insightLoading && (
                <Pressable
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/crop-planning' as any); }}
                  accessibilityRole="button"
                  accessibilityLabel={`Weekly Insight: ${weeklyInsight.title}`}
                  accessibilityHint={weeklyInsight.body}
                >
                  <Card variant="solid" style={[styles.recCard, { borderLeftColor: colors.primary, borderLeftWidth: 4, backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.weeklyInsightBadgeRow}>
                      <Text style={[styles.recCat, { color: colors.primary }]}>
                        {language === 'sw' ? 'UFAHAMU WA WIKI (AI)' : 'WEEKLY INSIGHT (AI)'}
                      </Text>
                      <Sparkles size={12} color={colors.primary} />
                    </View>
                    <Text style={[styles.recTitle, { color: colors.text }]}>{weeklyInsight.title}</Text>
                    <Text style={[styles.recBody, { color: colors.textMute }]}>{weeklyInsight.body}</Text>
                    <Text style={styles.weeklyInsightSource}>
                      {language === 'sw' ? `Chanzo: ${weeklyInsight.source}` : `Source: ${weeklyInsight.source}`}
                    </Text>
                  </Card>
                </Pressable>
              )}

              {/* Regular Static/Rule-based recommendations */}
              {recommendations.map((rec) => {
                const col = severityColor(rec.severity);
                return (
                  <Pressable
                    key={rec.id}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(rec.cta.route as any); }}
                    accessibilityRole="button"
                    accessibilityLabel={rec.title}
                    accessibilityHint={rec.cta.label}
                  >
                    <Card variant="solid" style={[styles.recCard, { borderLeftColor: col, borderLeftWidth: 4, backgroundColor: colors.card, borderColor: colors.border }]}>
                      <Text style={[styles.recCat, { color: col }]}>{rec.category.toUpperCase()}</Text>
                      <Text style={[styles.recTitle, { color: colors.text }]}>{rec.title}</Text>
                      <Text style={[styles.recBody, { color: colors.textMute }]}>{rec.body}</Text>
                    </Card>
                  </Pressable>
                );
              })}
            </View>
          </View>
          
        </View>
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── Farming Guide Modal ────────────────────────────── */}
      <Modal
        visible={activeGuideModal}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveGuideModal(false)}
      >
        <View style={styles.guideModalContainer}>
          <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[styles.guideModalContent, { backgroundColor: isDark ? '#0c0f0a' : '#FCFBF7', borderColor: colors.border }]}>
            {/* Header */}
            <View style={styles.guideModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Leaf size={20} color={colors.primary} />
                <View>
                  <Text style={[styles.guideModalTitle, { color: colors.text }]}>
                    {language === 'sw' ? 'Kupanda Mahindi' : 'Maize Planting Guide'}
                  </Text>
                  <Text style={[styles.guideModalSub, { color: colors.textMute }]}>
                    {language === 'sw' ? 'Mwongozo wa Kilimo wa TARI' : 'TARI Agronomy Guideline'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setActiveGuideModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Close Guide"
                style={[styles.guideModalCloseBtn, { borderColor: colors.border }]}
              >
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Steps Progress Indicator */}
            <View style={styles.guideStepIndicatorRow}>
              {[0, 1, 2, 3].map((step) => {
                const isCompleted = activeGuideStep > step;
                const isActive = activeGuideStep === step;
                return (
                  <View 
                    key={step} 
                    style={[
                      styles.guideStepDot, 
                      { 
                        backgroundColor: isCompleted ? colors.primary : isActive ? colors.primary : (isDark ? '#2D352B' : '#E2E8DF'),
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        marginHorizontal: 2
                      }
                    ]} 
                  />
                );
              })}
            </View>

            {/* Active Step Panel */}
            <View style={styles.guideStepContent}>
              {activeGuideStep === 0 && (
                <Animated.View entering={SlideInRight} exiting={SlideOutLeft} style={styles.guideStepSlide}>
                  {/* Visual animation - compost pile pulsing */}
                  <View style={styles.animationContainer}>
                    <View style={[styles.animatedCompostCircle, { backgroundColor: colors.primary + '20' }]}>
                      <Leaf size={32} color={colors.primary} />
                    </View>
                  </View>
                  <Text style={[styles.guideStepNumText, { color: colors.primary }]}>HATUA YA 1: MAANDALIZI YA UDONGO</Text>
                  <Text style={[styles.guideStepTitle, { color: colors.text }]}>
                    {language === 'sw' ? 'Kutayarisha Udongo & Rutuba' : 'Soil Preparation & Tillage'}
                  </Text>
                  <Text style={[styles.guideStepBody, { color: colors.text }]}>
                    {language === 'sw' 
                      ? 'Tayarisha shamba lako wiki 2-3 kabla ya msimu wa mvua kuanza ili kuruhusu udongo kupumua. Palilia na utishe udongo vizuri kwa kina cha kutosha. Changanya samadi au mboji tani 8-16 kwa hekta kuboresha unyevu na muundo wa udongo.'
                      : 'Tillage and prepare your field 2-3 weeks before the onset of rains to allow aeration. Weed and loosen the soil. Incorporate 8-16 tonnes of compost or farmyard manure per hectare to enhance organic content.'}
                  </Text>
                </Animated.View>
              )}

              {activeGuideStep === 1 && (
                <Animated.View entering={SlideInRight} exiting={SlideOutLeft} style={styles.guideStepSlide}>
                  {/* Visual animation - seed dropping */}
                  <View style={styles.animationContainer}>
                    <View style={styles.animatedSoilLayer}>
                      {/* Spacing lines */}
                      <View style={styles.spacingIndicatorLine} />
                      <Text style={styles.spacingIndicatorText}>75cm</Text>
                      {/* Seed dropping */}
                      <View style={[styles.animatedSeed, { backgroundColor: '#F59E0B' }]} />
                    </View>
                  </View>
                  <Text style={[styles.guideStepNumText, { color: colors.primary }]}>HATUA YA 2: NAFASI NA KINA YA UPANDAJI</Text>
                  <Text style={[styles.guideStepTitle, { color: colors.text }]}>
                    {language === 'sw' ? 'Nafasi ya Kupanda & Mbegu' : 'Planting Spacing & Seed Rate'}
                  </Text>
                  <Text style={[styles.guideStepBody, { color: colors.text }]}>
                    {language === 'sw' 
                      ? 'Chimba mashimo yenye kina cha sm 2-5. Weka nafasi ya sm 75 kati ya mistari ya mashimo na sm 25-30 kutoka shimo hadi shimo ndani ya mstari mmoja. Panda mbegu 2 kwa kila shimo; baadaye utapunguza na kubakiza mmea mmoja wenye nguvu.'
                      : 'Dig planting holes at a depth of 2-5 cm. Space them exactly 75 cm between rows and 25-30 cm between plants within each row. Place 2 seeds per hole, then thin to 1 strong plant after germination.'}
                  </Text>
                </Animated.View>
              )}

              {activeGuideStep === 2 && (
                <Animated.View entering={SlideInRight} exiting={SlideOutLeft} style={styles.guideStepSlide}>
                  {/* Visual animation - fertilizer placement */}
                  <View style={styles.animationContainer}>
                    <View style={styles.fertilizerPlacementDiagram}>
                      <View style={[styles.animatedSeedStatic, { backgroundColor: '#F59E0B' }]} />
                      <View style={[styles.animatedFertilizerStatic, { backgroundColor: colors.primary }]} />
                      <View style={styles.fertilizerOffsetLine} />
                      <Text style={styles.fertilizerOffsetText}>5cm</Text>
                    </View>
                  </View>
                  <Text style={[styles.guideStepNumText, { color: colors.primary }]}>HATUA YA 3: MBOLEA YA AWALI (BASAL)</Text>
                  <Text style={[styles.guideStepTitle, { color: colors.text }]}>
                    {language === 'sw' ? 'Uwekaji wa Mbolea ya Kwanza' : 'Basal Fertilizer Placement'}
                  </Text>
                  <Text style={[styles.guideStepBody, { color: colors.text }]}>
                    {language === 'sw' 
                      ? 'Weka mbolea yenye Fosforasi (kama DAP, NPK 17-17-17, au Minjingu Nafaka) wakati wa kupanda. Weka kwenye shimo umbali wa sm 5 pembeni mwa mbegu na ufunike kwa udongo kabla ya kuweka mbegu ili kuzuia mizizi kuungua.'
                      : 'Apply a phosphorus-rich fertilizer (like DAP, NPK 17-17-17, or Minjingu Nafaka) at planting. Place the fertilizer in a hole 5 cm away from the seed and cover with soil first to prevent direct seed contact.'}
                  </Text>
                </Animated.View>
              )}

              {activeGuideStep === 3 && (
                <Animated.View entering={SlideInRight} exiting={SlideOutLeft} style={styles.guideStepSlide}>
                  {/* Visual animation - growing maize shoot */}
                  <View style={styles.animationContainer}>
                    <View style={styles.growingMaizeContainer}>
                      <View style={[styles.maizeShootLeaf1, { backgroundColor: colors.primary }]} />
                      <View style={[styles.maizeShootLeaf2, { backgroundColor: colors.primary }]} />
                      <View style={[styles.maizeShootStem, { backgroundColor: colors.primary }]} />
                    </View>
                  </View>
                  <Text style={[styles.guideStepNumText, { color: colors.primary }]}>HATUA YA 4: PALIZI NA MBOLEA YA JUU</Text>
                  <Text style={[styles.guideStepTitle, { color: colors.text }]}>
                    {language === 'sw' ? 'Kupalilia & Uwekaji wa Urea' : 'Weeding & Top-Dressing'}
                  </Text>
                  <Text style={[styles.guideStepBody, { color: colors.text }]}>
                    {language === 'sw' 
                      ? 'Palilia shamba ndani ya wiki 2-3 baada ya kuota ili kuzuia magugu. Wiki ya 4-6 (urefu wa goti), weka mbolea ya Nitrojeni kama Urea au CAN (kilo 50 kwa ekari). Weka wakati udongo una unyevu na baada tu ya kupalilia.'
                      : 'Weed the field 2-3 weeks post-germination. At week 4-6 (knee-high stage), apply nitrogen top-dressing such as Urea or CAN (50kg/acre). Ensure application is done immediately after weeding on moist soils.'}
                  </Text>
                </Animated.View>
              )}
            </View>

            {/* Footer Buttons */}
            <View style={styles.guideModalFooter}>
              {activeGuideStep > 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setActiveGuideStep((prev) => prev - 1);
                  }}
                  style={[styles.guideFooterBtnSec, { borderColor: colors.border }]}
                  accessibilityRole="button"
                  accessibilityLabel="Back"
                >
                  <Text style={[styles.guideFooterBtnTextSec, { color: colors.text }]}>
                    {language === 'sw' ? 'Nyuma' : 'Back'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={{ flex: 1 }} />
              )}

              {activeGuideStep < 3 ? (
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setActiveGuideStep((prev) => prev + 1);
                  }}
                  style={[styles.guideFooterBtnPrim, { backgroundColor: colors.primary }]}
                  accessibilityRole="button"
                  accessibilityLabel="Next"
                >
                  <Text style={[styles.guideFooterBtnTextPrim, { color: isDark ? '#000' : '#FCFBF7' }]}>
                    {language === 'sw' ? 'Mbele' : 'Next'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    // Add planting tasks to task list!
                    createTask({
                      title: 'Maize Planting: Land Preparation (TARI Guide)',
                      titleSw: 'Upandaji Mahindi: Maandalizi ya Udongo',
                      category: 'planting',
                      priority: 'high',
                      status: 'pending',
                      xpReward: 25,
                      dueDate: new Date(Date.now() + 24 * 3600_000).toISOString()
                    });
                    createTask({
                      title: 'Maize Planting: Basal DAP/NPK Application',
                      titleSw: 'Upandaji Mahindi: Kuweka Mbolea ya DAP/NPK',
                      category: 'planting',
                      priority: 'high',
                      status: 'pending',
                      xpReward: 30,
                      dueDate: new Date(Date.now() + 2 * 24 * 3600_000).toISOString()
                    });
                    createTask({
                      title: 'Maize Care: Weed Field and Apply Urea/CAN (Week 4)',
                      titleSw: 'Matunzo ya Mahindi: Palizi na Urea/CAN',
                      category: 'scouting',
                      priority: 'critical',
                      status: 'pending',
                      xpReward: 40,
                      dueDate: new Date(Date.now() + 28 * 24 * 3600_000).toISOString()
                    });

                    addNotification({
                      title: language === 'sw' ? '📅 Ratiba ya Mahindi Imewekwa' : '📅 Maize Schedule Configured',
                      body: language === 'sw' ? 'Kazi 3 za miongozo ya TARI zimeongezwa kwenye ratiba yako!' : '3 tasks from TARI planting guides have been added to your schedule!',
                      type: 'success'
                    });

                    setActiveGuideModal(false);
                    Alert.alert(
                      language === 'sw' ? 'Kazi Zimeongezwa!' : 'Tasks Scheduled!',
                      language === 'sw' 
                        ? 'Ratiba ya kazi za kupanda mahindi kulingana na TARI imeongezwa kwenye ukurasa wako wa Kazi.'
                        : 'A schedule of maize planting tasks matching TARI guidelines has been added to your Tasks tab.',
                      [{ text: 'Sawa' }]
                    );
                  }}
                  style={[styles.guideFooterBtnPrim, { backgroundColor: colors.primary }]}
                  accessibilityRole="button"
                  accessibilityLabel="Add to Tasks"
                >
                  <Text style={[styles.guideFooterBtnTextPrim, { color: isDark ? '#000' : '#FCFBF7' }]}>
                    {language === 'sw' ? 'Weka Kazi' : 'Schedule Tasks'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  guideStepDot: {},
  scrollContent: { paddingTop: 0 },
  
  // Hero Styles
  heroWrapper: {
    height: 330,
    width: '100%',
    position: 'relative',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  markerLabelContainer: {
    position: 'absolute',
    zIndex: 2,
  },
  markerLabelTitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  markerLabelSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  markerLineH: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    zIndex: 1,
  },
  markerLineV: {
    position: 'absolute',
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    zIndex: 1,
  },
  markerDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    zIndex: 3,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 36,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroActionCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroNotificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
  heroAvatarBorder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    padding: 1.5,
  },
  heroAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroAvatarText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 14,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  offlineText: {
    color: '#ef4444',
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
  },
  
  // Crop overlay panel
  heroCropPanel: {
    paddingHorizontal: 20,
  },
  cropTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cropLabel: {
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  dotContainer: {
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveOuterDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    position: 'absolute',
  },
  liveInnerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ef4444',
  },
  liveText: {
    color: '#ef4444',
    fontSize: 8,
    fontFamily: 'Inter_900Black',
  },
  cropSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  cropName: {
    fontSize: 26,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  slideshowIndicator: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 4,
  },
  slideshowIndicatorText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
  },
  harvestTimeline: {
    marginTop: 2,
  },
  timelineTexts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timelineLeft: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: 'rgba(255,255,255,0.7)',
  },
  timelineRight: {
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
  },
  timelineProgressBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  timelineProgressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Main scroll content below header
  mainContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },

  // RAG Search Bar Styles
  searchBarContainer: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBarInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    paddingVertical: 4,
  },
  searchLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 6,
  },
  searchLoadingText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  searchResultCard: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 4,
    gap: 8,
  },
  searchResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  searchResultTitle: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 0.5,
  },
  searchResultBody: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    lineHeight: 18,
  },
  citedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  citedText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  
  // Track Records Stepper Styles
  trackCard: {
    padding: 16,
  },
  trackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackTitle: {
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.2,
  },
  qrBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  trackBgLine: {
    position: 'absolute',
    top: 14,
    left: 20,
    right: 20,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#C4D0C0',
  },
  trackScroll: {
    paddingRight: 20,
  },
  trackStep: {
    width: 96,
    alignItems: 'center',
    marginRight: 12,
  },
  stepDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    zIndex: 3,
  },
  activeDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  stepDate: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  stepMainTitle: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
  },
  stepSubtitle: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },

  // Quick Action List Styles
  bentoSectionTitle: {
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  actionScroll: {
    gap: 10,
    paddingRight: 20,
  },
  actionCardWrapper: {
    width: SCREEN_WIDTH * 0.44,
  },
  actionCard: {
    padding: 16,
    height: 110,
    justifyContent: 'space-between',
  },
  actionIconOuter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 1,
  },
  actionDesc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },

  // Growth Chart Styles
  chartCard: {
    padding: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartSub: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  chartValue: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  chartUnit: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  rangeSelector: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
  },
  rangeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  rangeText: {
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 110,
    marginTop: 8,
  },
  chartBarWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarBackground: {
    width: 8,
    height: 86,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 6,
  },

  // Wallet Card Styles
  walletCard: {
    padding: 18,
    borderRadius: 28,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  agroIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  agroIdText: {
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 0.5,
  },
  mobileMoneyTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  mobileMoneyText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
  },
  balanceLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  balanceDecimals: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  walletActions: {
    flexDirection: 'row',
    gap: 10,
  },
  walletBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  walletBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_800ExtraBold',
  },

  // Bento Stats Styles
  bentoSection: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCardContainer: {
    width: (SCREEN_WIDTH - 42) / 2,
  },
  statCard: {
    padding: 14,
    borderWidth: 1,
  },
  statHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statMainBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statValueText: {
    fontSize: 20,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  statLabelText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 2,
  },
  statTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 8,
  },
  statTrendLabel: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  miniChartContainer: {
    width: 60,
    height: 30,
    overflow: 'hidden',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 6,
  },
  miniBarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: 50,
    height: 30,
    paddingHorizontal: 2,
    marginLeft: 6,
  },

  // Ask Kilimo AI Widget Styles
  chatWidgetCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  chatWidgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatWidgetTitle: {
    fontSize: 15,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.2,
  },
  chatWidgetSparkle: {
    marginLeft: 'auto',
  },
  chatWidgetDesc: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    lineHeight: 16,
  },
  suggestionsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  suggestionPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  suggestionTextText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  chatWidgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 6,
    height: 48,
    marginTop: 4,
  },
  chatWidgetInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  chatWidgetSendBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatWidgetReply: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginTop: 6,
    gap: 6,
  },
  chatWidgetReplyHeader: {
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 0.5,
  },
  chatWidgetReplyText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    lineHeight: 18,
  },
  chatWidgetReplyAction: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  chatWidgetReplyActionText: {
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
  },

  // AI Recs Styles
  recSection: {
    marginTop: 4,
  },
  recCard: {
    padding: 14,
    paddingLeft: 12,
    borderWidth: 1,
    borderRadius: 16,
  },
  weeklyInsightBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  weeklyInsightSource: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: '#8b5cf6',
    marginTop: 8,
  },
  recCat: {
    fontSize: 9,
    fontFamily: 'Inter_900Black',
    marginBottom: 2,
  },
  recTitle: {
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 2,
  },
  recBody: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    lineHeight: 16,
  },

  // Guide Card Styles
  guideCard: {
    borderRadius: 24,
    height: 180,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  guideCardImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  guideCardContent: {
    zIndex: 2,
    gap: 6,
  },
  guideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    alignSelf: 'flex-start',
  },
  guideBadgeText: {
    color: '#FCFBF7',
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 0.5,
  },
  guideCardTitle: {
    color: '#FCFBF7',
    fontSize: 20,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  guideCardDesc: {
    color: 'rgba(252,251,247,0.8)',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    lineHeight: 16,
  },

  // Guide Modal Styles
  guideModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideModalContent: {
    width: SCREEN_WIDTH * 0.9,
    borderRadius: 36,
    borderWidth: 1.5,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
  guideModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guideModalTitle: {
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  guideModalSub: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 2,
  },
  guideModalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideStepIndicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginVertical: 4,
  },
  guideStepContent: {
    minHeight: 280,
    justifyContent: 'center',
  },
  guideStepSlide: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
  },
  animationContainer: {
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  animatedCompostCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedSoilLayer: {
    height: 60,
    width: 200,
    borderBottomWidth: 4,
    borderColor: '#8B5A2B',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacingIndicatorLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    height: 2,
    backgroundColor: '#3b82f6',
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  spacingIndicatorText: {
    position: 'absolute',
    bottom: 26,
    color: '#3b82f6',
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
  },
  animatedSeed: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    bottom: 10,
  },
  fertilizerPlacementDiagram: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 200,
    borderBottomWidth: 4,
    borderColor: '#8B5A2B',
    position: 'relative',
  },
  animatedSeedStatic: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 40,
  },
  animatedFertilizerStatic: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  fertilizerOffsetLine: {
    position: 'absolute',
    left: 88,
    right: 76,
    bottom: 14,
    height: 1,
    backgroundColor: '#ef4444',
  },
  fertilizerOffsetText: {
    position: 'absolute',
    bottom: 20,
    color: '#ef4444',
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
  },
  growingMaizeContainer: {
    height: 80,
    width: 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  maizeShootStem: {
    width: 6,
    height: 40,
    borderRadius: 3,
  },
  maizeShootLeaf1: {
    position: 'absolute',
    width: 20,
    height: 8,
    borderRadius: 4,
    transform: [{ rotate: '-30deg' }],
    bottom: 28,
    left: 18,
  },
  maizeShootLeaf2: {
    position: 'absolute',
    width: 20,
    height: 8,
    borderRadius: 4,
    transform: [{ rotate: '30deg' }],
    bottom: 34,
    right: 18,
  },
  guideStepNumText: {
    fontSize: 9,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1,
  },
  guideStepTitle: {
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  guideStepBody: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    lineHeight: 18,
    textAlign: 'center',
    opacity: 0.85,
  },
  guideModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  guideFooterBtnPrim: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  guideFooterBtnTextPrim: {
    fontSize: 14,
    fontFamily: 'Inter_900Black',
  },
  guideFooterBtnSec: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  guideFooterBtnTextSec: {
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
  },
});
