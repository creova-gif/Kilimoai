import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity,
  FlatList, Animated, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { tr } from '@/src/utils/translations';

const { width, height } = Dimensions.get('window');

const slides = [
  { icon: 'leaf' as const, titleKey: 'feature1Title' as const, descKey: 'feature1Desc' as const },
  { icon: 'trending-up' as const, titleKey: 'feature2Title' as const, descKey: 'feature2Desc' as const },
  { icon: 'cloud' as const, titleKey: 'feature3Title' as const, descKey: 'feature3Desc' as const },
];

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/(auth)/login');
    }
  };

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.container}>
      <View style={[styles.header, { paddingTop: topInset + 16 }]}>
        <Text style={styles.appName}>{tr('appName', language)}</Text>
        <View style={styles.langRow}>
          <TouchableOpacity
            style={[styles.langBtn, language === 'sw' && styles.langBtnActive]}
            onPress={() => setLanguage('sw')}
          >
            <Text style={[styles.langText, language === 'sw' && styles.langTextActive]}>SW</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>EN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={64} color={Colors.primary} />
            </View>
            <Text style={styles.slideTitle}>{tr(item.titleKey, language)}</Text>
            <Text style={styles.slideDesc}>{tr(item.descKey, language)}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
        ))}
      </View>

      <View style={[styles.footer, { paddingBottom: bottomInset + 24 }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>
            {currentIndex < slides.length - 1 ? tr('next', language) : tr('getStarted', language)}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.primary} style={{ marginLeft: 6 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={{ marginTop: 16 }}>
          <Text style={styles.skipText}>{tr('login', language)}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  appName: { fontSize: 24, fontWeight: '800' as const, color: '#fff', letterSpacing: 1 },
  langRow: { flexDirection: 'row', gap: 8 },
  langBtn: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
  },
  langBtnActive: { backgroundColor: '#fff' },
  langText: { fontSize: 12, fontWeight: '600' as const, color: 'rgba(255,255,255,0.7)' },
  langTextActive: { color: Colors.primary },
  slide: {
    width, paddingHorizontal: 32, alignItems: 'center',
    justifyContent: 'center', flex: 1,
  },
  iconCircle: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    marginBottom: 36,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  slideTitle: { fontSize: 26, fontWeight: '700' as const, color: '#fff', textAlign: 'center', marginBottom: 16 },
  slideDesc: { fontSize: 16, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { width: 24, backgroundColor: '#fff' },
  footer: { paddingHorizontal: 24, alignItems: 'center' },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', borderRadius: Colors.radiusFull,
    paddingVertical: 16, paddingHorizontal: 40, width: '100%',
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700' as const, color: Colors.primary },
  skipText: { fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: '500' as const },
});
