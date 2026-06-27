import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { useWeather } from '../hooks/useWeather';
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  CloudLightning,
  MapPin,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Zap,
  ArrowLeft,
  Thermometer,
  CloudSun,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../constants/Theme';
import { useRouter } from 'expo-router';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useKilimoStore } from '../store/useKilimoStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// High-quality mock data when OpenWeather is not configured
const MOCK_CURRENT = {
  location: 'Mbeya, Tanzania',
  temp: 24,
  feelsLike: 26,
  humidity: 78,
  windKph: 12,
  condition: 'cloud' as const,
  conditionLabel: 'Mawingu kidogo',
  pop: 65,
};

const MOCK_FORECAST = [
  {
    day: 'Jumatatu',
    date: '28 Mei',
    high: 26,
    low: 18,
    condition: 'rain' as const,
    pop: '80%',
    desc: 'Mvua kubwa inatarajiwa. Epuka kuweka mbolea leo.',
  },
  {
    day: 'Jumanne',
    date: '29 Mei',
    high: 25,
    low: 17,
    condition: 'cloud' as const,
    pop: '30%',
    desc: 'Hali nzuri kwa kupanda na kupalilia.',
  },
  {
    day: 'Jumatano',
    date: '30 Mei',
    high: 28,
    low: 19,
    condition: 'sun' as const,
    pop: '10%',
    desc: 'Siku nzuri kwa uvunaji na kazi za shambani.',
  },
  {
    day: 'Alhamisi',
    date: '31 Mei',
    high: 29,
    low: 20,
    condition: 'sun' as const,
    pop: '5%',
    desc: 'Siku nzuri kwa uvunaji na kazi za shambani.',
  },
  {
    day: 'Ijumaa',
    date: '01 Jun',
    high: 27,
    low: 18,
    condition: 'rain' as const,
    pop: '60%',
    desc: 'Mvua kubwa inatarajiwa. Epuka kuweka mbolea leo.',
  },
  {
    day: 'Jumamosi',
    date: '02 Jun',
    high: 24,
    low: 16,
    condition: 'storm' as const,
    pop: '90%',
    desc: 'Tahadhari ya upepo mkali. Funga ghala vizuri.',
  },
  {
    day: 'Jumapili',
    date: '03 Jun',
    high: 26,
    low: 17,
    condition: 'cloud' as const,
    pop: '20%',
    desc: 'Hali nzuri kwa kupanda na kupalilia.',
  },
];

export default function ForecastScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const language = useKilimoStore((s) => s.language);
  const [refreshing, setRefreshing] = useState(false);
  const {
    configured,
    location,
    current: realCurrent,
    forecast: realForecast,
    loading,
    error,
    errorKind,
    refetch,
  } = useWeather();

  // Pick real data or fall back to high-quality mock data
  const current = realCurrent || MOCK_CURRENT;
  const forecastDays = realForecast || MOCK_FORECAST;

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      if (configured) {
        await refetch();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } finally {
      setRefreshing(false);
    }
  }, [configured, refetch]);

  // Localized "today" label
  const todayLabel = React.useMemo(() => {
    const d = new Date();
    if (language === 'sw') {
      const months = [
        'JAN',
        'FEB',
        'MAC',
        'APR',
        'MEI',
        'JUN',
        'JUL',
        'AGO',
        'SEP',
        'OKT',
        'NOV',
        'DES',
      ];
      return `LEO, ${d.getDate()} ${months[d.getMonth()]}`;
    } else {
      const months = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ];
      return `TODAY, ${d.getDate()} ${months[d.getMonth()]}`;
    }
  }, [language]);

  const renderWeatherIcon = (condition: string, size = 24, color = '#fff') => {
    switch (condition) {
      case 'sun':
        return <Sun size={size} color={color} strokeWidth={2} />;
      case 'cloud':
        return <CloudSun size={size} color={color} strokeWidth={2} />;
      case 'rain':
        return <CloudRain size={size} color={color} strokeWidth={2} />;
      case 'storm':
        return <CloudLightning size={size} color={color} strokeWidth={2} />;
      default:
        return <Sun size={size} color={color} strokeWidth={2} />;
    }
  };

  // Generate hourly weather progression dynamically based on current temp
  const hourlyData = React.useMemo(() => {
    const currentHour = new Date().getHours();
    const temp = current?.temp || 24;
    return Array.from({ length: 5 }).map((_, i) => {
      const hr = (currentHour + i * 2) % 24;
      const ampm = hr >= 12 ? 'PM' : 'AM';
      const displayHr = hr % 12 === 0 ? 12 : hr % 12;
      const label = `${displayHr.toString().padStart(2, '0')} ${ampm}`;

      const tempOffset = Math.sin(i) * 2;
      const hourTemp = Math.round(temp + tempOffset);

      let condition: 'sun' | 'cloud' | 'rain' | 'storm' = 'sun';
      if (i === 1) condition = 'cloud';
      else if (i === 3) condition = 'rain';
      else if (i === 4) condition = 'cloud';

      return { label, temp: hourTemp, condition };
    });
  }, [current?.temp]);

  // Calculate position on the temp slider bar
  const tempSliderProgress = React.useMemo(() => {
    const temp = current?.temp || 24;
    const low = forecastDays[0]?.low || 18;
    const high = forecastDays[0]?.high || 28;
    const range = high - low || 10;
    const fraction = (temp - low) / range;
    return Math.max(0, Math.min(100, Math.round(fraction * 100)));
  }, [current?.temp, forecastDays]);

  const errorCopy = React.useMemo(() => {
    if (errorKind === 'unknown_location') {
      return {
        title: language === 'sw' ? 'ENEO HALITAMBULIWI' : 'UNKNOWN LOCATION',
        body:
          language === 'sw'
            ? `Mfumo haukutambui "${location}". Sahihisha eneo lako kwenye Wasifu.`
            : `We couldn't recognize "${location}". Please correct your location in Profile.`,
      };
    }
    if (errorKind === 'network') {
      return {
        title: language === 'sw' ? 'HITILAFU YA MTANDAO' : 'NETWORK ERROR',
        body:
          language === 'sw'
            ? 'Hakikisha mtandao unafanya kazi kisha jaribu tena.'
            : 'Please check your internet connection and try again.',
      };
    }
    return {
      title: language === 'sw' ? 'HITILAFU' : 'ERROR',
      body:
        language === 'sw'
          ? 'Imeshindwa kupata data ya hali ya hewa.'
          : 'Failed to retrieve weather data.',
    };
  }, [errorKind, location, language]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={require('../assets/images/rice-field-bg.png')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(6, 23, 12, 0.85)', 'rgba(2, 10, 5, 0.95)']}
          style={StyleSheet.absoluteFillObject}
        />
      </ImageBackground>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (router.canGoBack()) router.back();
              else router.replace('/');
            }}
          >
            <BlurView intensity={30} tint="dark" style={styles.backBlur}>
              <ArrowLeft size={20} color="#fff" />
            </BlurView>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{language === 'sw' ? 'Hali ya Hewa' : 'Weather'}</Text>

          <View style={styles.locationBadge}>
            <BlurView intensity={25} tint="dark" style={styles.badgeBlur}>
              <MapPin size={12} color="#a3e635" />
              <Text style={styles.badgeText}>{realCurrent?.location || location}</Text>
            </BlurView>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#a3e635" />
          }
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View entering={FadeInUp.duration(600).springify()}>
            {/* Main Glass Card */}
            <BlurView intensity={40} tint="dark" style={styles.mainCard}>
              <View style={styles.heroTop}>
                <View style={styles.tempSection}>
                  <Text style={styles.todayText}>{todayLabel}</Text>
                  <View style={styles.tempMainContainer}>
                    <Text style={styles.tempMain}>{current?.temp}</Text>
                    <Text style={styles.tempDegree}>°C</Text>
                  </View>
                  <View style={styles.conditionRow}>
                    <View style={styles.conditionDot} />
                    <Text style={styles.conditionMain}>
                      {current?.conditionLabel
                        ? current.conditionLabel.charAt(0).toUpperCase() +
                          current.conditionLabel.slice(1)
                        : loading
                          ? 'Inapakia…'
                          : 'Mawingu'}
                    </Text>
                  </View>
                </View>
                <View style={styles.heroIconContainer}>
                  {renderWeatherIcon(current?.condition || 'cloud', 90, '#a3e635')}
                </View>
              </View>

              {/* Dynamic Range Temp Slider */}
              <View style={styles.sliderContainer}>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabelText}>{forecastDays[0]?.low ?? 18}°C</Text>
                  <Text style={[styles.sliderLabelText, { opacity: 0.5 }]}>
                    {language === 'sw' ? 'Kiwango cha Leo' : "Today's Range"}
                  </Text>
                  <Text style={styles.sliderLabelText}>{forecastDays[0]?.high ?? 28}°C</Text>
                </View>
                <View style={styles.sliderTrack}>
                  <LinearGradient
                    colors={['#2e7d32', '#a3e635', '#f59e0b', '#ef4444']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.sliderGradient}
                  />
                  <View style={[styles.sliderPointer, { left: `${tempSliderProgress}%` }]} />
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Hourly Forecast Capsules */}
              <Text style={styles.hourlyTitle}>
                {language === 'sw' ? 'Utabiri wa Saa' : 'Hourly Forecast'}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hourlyList}
              >
                {hourlyData.map((item, index) => (
                  <BlurView
                    key={index}
                    intensity={25}
                    tint="dark"
                    style={[styles.hourlyCapsule, index === 2 && styles.activeHourlyCapsule]}
                  >
                    <Text style={styles.hourlyTime}>{item.label}</Text>
                    <View style={styles.hourlyIconCircle}>
                      {renderWeatherIcon(item.condition, 20, index === 2 ? '#a3e635' : '#fff')}
                    </View>
                    <Text style={styles.hourlyTemp}>{item.temp}°</Text>
                  </BlurView>
                ))}
              </ScrollView>
            </BlurView>
          </Animated.View>

          {/* Bento Grid Metrics */}
          <View style={styles.bentoContainer}>
            {/* UV Index Card */}
            <Animated.View
              entering={FadeInDown.delay(100).duration(600).springify()}
              style={styles.bentoHalf}
            >
              <BlurView intensity={30} tint="dark" style={styles.bentoCard}>
                <View style={styles.bentoHeader}>
                  <Zap size={14} color="#f59e0b" />
                  <Text style={styles.bentoTitle}>
                    {language === 'sw' ? 'Kielezo cha UV' : 'UV Index'}
                  </Text>
                </View>
                <Text style={styles.bentoValue}>05</Text>
                <Text style={[styles.bentoSubText, { color: '#f59e0b' }]}>
                  {language === 'sw' ? 'Kawaida' : 'Moderate'}
                </Text>
                <View style={styles.bentoSparkline}>
                  <Svg height="60" width="100%" viewBox="0 0 160 60" preserveAspectRatio="none">
                    <Defs>
                      <SvgLinearGradient id="uvGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                        <Stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                      </SvgLinearGradient>
                    </Defs>
                    <Path d="M0 45 Q 40 15, 80 35 T 160 20 L160 60 L0 60 Z" fill="url(#uvGrad)" />
                    <Path
                      d="M0 45 Q 40 15, 80 35 T 160 20"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                  </Svg>
                </View>
              </BlurView>
            </Animated.View>

            {/* Humidity Card */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(600).springify()}
              style={styles.bentoHalf}
            >
              <BlurView intensity={30} tint="dark" style={styles.bentoCard}>
                <View style={styles.bentoHeader}>
                  <Droplets size={14} color="#3b82f6" />
                  <Text style={styles.bentoTitle}>
                    {language === 'sw' ? 'Unyevunyevu' : 'Humidity'}
                  </Text>
                </View>
                <Text style={styles.bentoValue}>{current?.humidity}%</Text>
                <Text style={[styles.bentoSubText, { color: '#3b82f6' }]}>
                  {language === 'sw' ? 'Imara' : 'Optimal'}
                </Text>
                <View style={styles.bentoSparkline}>
                  <Svg height="60" width="100%" viewBox="0 0 160 60" preserveAspectRatio="none">
                    <Defs>
                      <SvgLinearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <Stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </SvgLinearGradient>
                    </Defs>
                    <Path d="M0 30 Q 30 50, 80 20 T 160 35 L160 60 L0 60 Z" fill="url(#humGrad)" />
                    <Path
                      d="M0 30 Q 30 50, 80 20 T 160 35"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                  </Svg>
                </View>
              </BlurView>
            </Animated.View>
          </View>

          {/* AI Alert/Agronomist Warning Banner */}
          <Animated.View entering={FadeInDown.delay(300).duration(600).springify()}>
            <BlurView intensity={35} tint="dark" style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <Sparkles size={16} color="#a3e635" />
                <Text style={styles.alertTitle}>
                  {language === 'sw' ? 'USHAURI WA KILIMO AI' : 'KILIMO AI AGRONOMIST TIP'}
                </Text>
              </View>
              <View style={styles.alertBody}>
                <View style={styles.alertWarningBox}>
                  <Zap size={16} color="#f59e0b" />
                  <Text style={styles.alertWarningText}>
                    {language === 'sw' ? 'Umwagiliaji Unahitajika' : 'Irrigation Recommended'}
                  </Text>
                </View>
                <Text style={styles.alertText}>
                  {forecastDays[0]?.desc ||
                    (language === 'sw'
                      ? 'Utabiri unaonyesha kupanda kwa joto na kupungua kwa unyevu. Ni vyema kumwagilia mashamba ya mboga na mazao machanga leo jioni kuzuia unyaufu.'
                      : 'Forecast shows high temperature and optimal moisture level. Water seedlings and crops this evening to prevent water stress.')}
                </Text>
              </View>
            </BlurView>
          </Animated.View>

          {/* Error notifications if API fails */}
          {configured && !!error && (
            <Animated.View entering={FadeIn}>
              <BlurView intensity={20} tint="dark" style={styles.errorCard}>
                <Zap size={16} color="#ef4444" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.errorTitle}>{errorCopy.title}</Text>
                  <Text style={styles.errorText}>{errorCopy.body}</Text>
                </View>
              </BlurView>
            </Animated.View>
          )}

          {/* API Not Configured Notice - Small & Clean Banner */}
          {!configured && (
            <Animated.View entering={FadeIn}>
              <BlurView intensity={20} tint="dark" style={styles.demoBanner}>
                <Sparkles size={14} color="#a3e635" />
                <Text style={styles.demoText}>
                  {language === 'sw'
                    ? 'Hali ya Maonyesho — Imewezeshwa kwa data ya majaribio ya Mbeya.'
                    : 'Demo mode — Populated with high-fidelity sample data.'}
                </Text>
              </BlurView>
            </Animated.View>
          )}

          {/* Weekly Forecast List */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {language === 'sw' ? 'Wiki Nzima' : '7-Day Forecast'}
            </Text>
            <View style={styles.sectionLine} />
          </View>

          {loading && realForecast?.length === 0 && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#a3e635" size="large" />
            </View>
          )}

          <View style={styles.forecastList}>
            {forecastDays.map((item, index) => (
              <Animated.View
                key={item.day}
                entering={FadeInDown.delay(100 + index * 50).duration(500)}
              >
                <BlurView intensity={20} tint="dark" style={styles.dayRow}>
                  <View style={styles.dayMain}>
                    <Text style={styles.dayName}>{item.day}</Text>
                    <Text style={styles.dayDate}>{item.date}</Text>
                  </View>

                  <View style={styles.dayIconSection}>
                    <View style={styles.dayIconBg}>
                      {renderWeatherIcon(item.condition, 20, '#a3e635')}
                    </View>
                    <View style={styles.popBadge}>
                      <Droplets size={10} color="#a3e635" />
                      <Text style={styles.popText}>{item.pop}</Text>
                    </View>
                  </View>

                  <View style={styles.dayTempRange}>
                    <Text style={styles.dayHighTemp}>{item.high}°</Text>
                    <View style={styles.dayTempBarBg}>
                      <LinearGradient
                        colors={['#2e7d32', '#a3e635']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.dayTempBarFill}
                      />
                    </View>
                    <Text style={styles.dayLowTemp}>{item.low}°</Text>
                  </View>
                </BlurView>
              </Animated.View>
            ))}
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06170c',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  backBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'InstrumentSerif_400Regular',
    color: '#fff',
    letterSpacing: -0.5,
  },
  locationBadge: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  badgeBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
  },
  mainCard: {
    borderRadius: 32,
    padding: 24,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  tempSection: {
    flex: 1,
  },
  todayText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  tempMainContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tempMain: {
    fontSize: 72,
    fontFamily: 'InstrumentSerif_400Regular',
    color: '#fff',
    letterSpacing: -2,
    lineHeight: 76,
  },
  tempDegree: {
    fontSize: 28,
    fontFamily: 'InstrumentSerif_400Regular',
    color: '#a3e635',
    marginTop: 4,
    marginLeft: 2,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  conditionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#a3e635',
  },
  conditionMain: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  heroIconContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderLabelText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
  },
  sliderTrack: {
    height: 6,
    width: '100%',
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderGradient: {
    height: '100%',
    width: '100%',
    borderRadius: 3,
  },
  sliderPointer: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2e7d32',
    position: 'absolute',
    transform: [{ translateX: -7 }],
  },
  cardDivider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  hourlyTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  hourlyList: {
    gap: 10,
    paddingRight: 10,
  },
  hourlyCapsule: {
    width: 65,
    height: 110,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  activeHourlyCapsule: {
    borderColor: 'rgba(163, 230, 53, 0.4)',
    backgroundColor: 'rgba(6, 23, 12, 0.5)',
  },
  hourlyTime: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  hourlyIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hourlyTemp: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  bentoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bentoHalf: {
    width: '48.5%',
  },
  bentoCard: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    height: 150,
    position: 'relative',
  },
  bentoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  bentoTitle: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  bentoValue: {
    fontSize: 28,
    fontFamily: 'InstrumentSerif_400Regular',
    color: '#fff',
  },
  bentoSubText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 2,
  },
  bentoSparkline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    overflow: 'hidden',
  },
  alertCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(163, 230, 53, 0.25)',
    marginBottom: 28,
    overflow: 'hidden',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#a3e635',
    letterSpacing: 1.2,
  },
  alertBody: {
    gap: 8,
  },
  alertWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  alertWarningText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#f59e0b',
  },
  alertText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 19,
  },
  errorCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    marginBottom: 20,
    gap: 12,
    overflow: 'hidden',
  },
  errorTitle: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#ef4444',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 16,
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(163, 230, 53, 0.2)',
    marginBottom: 24,
    overflow: 'hidden',
  },
  demoText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: 'rgba(255, 255, 255, 0.65)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'InstrumentSerif_400Regular',
    color: '#fff',
    letterSpacing: -0.3,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  forecastList: {
    gap: 10,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  dayMain: {
    width: 90,
  },
  dayName: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  dayDate: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 2,
  },
  dayIconSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dayIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(163, 230, 53, 0.08)',
  },
  popText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: '#a3e635',
  },
  dayTempRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayHighTemp: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    width: 24,
    textAlign: 'right',
  },
  dayLowTemp: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: 'rgba(255, 255, 255, 0.4)',
    width: 24,
    textAlign: 'left',
  },
  dayTempBarBg: {
    width: 50,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  dayTempBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});
