import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Platform,
  Dimensions, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { Button } from '@/src/components/ui/Button';

const { width: SCREEN_W } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  title: { en: string; sw: string };
  body: { en: string; sw: string };
}

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: 'leaf',
    iconColor: Colors.primary,
    iconBg: Colors.primaryMuted,
    title: { en: 'Smart Crop Advisory', sw: 'Ushauri wa Mazao wa Akili' },
    body: {
      en: 'Get AI-powered advice on planting, fertilizing, pest control, and harvest timing tailored to your specific crops and region.',
      sw: 'Pata ushauri wa AI kuhusu kupanda, mbolea, udhibiti wa wadudu, na wakati wa mavuno ulioboreshwa kwa mazao na mkoa wako.',
    },
  },
  {
    id: '2',
    icon: 'camera',
    iconColor: '#1565C0',
    iconBg: '#E3F2FD',
    title: { en: 'Instant Disease Detection', sw: 'Utambuzi wa Haraka wa Magonjwa' },
    body: {
      en: 'Point your camera at any crop problem and our AI instantly identifies diseases, pests, and nutrient deficiencies — with treatment steps.',
      sw: 'Elekeza kamera yako kwenye tatizo lolote la zao na AI yetu itatambua mara moja magonjwa, wadudu, na upungufu wa virutubisho.',
    },
  },
  {
    id: '3',
    icon: 'trending-up',
    iconColor: '#F57F17',
    iconBg: '#FFF8E1',
    title: { en: 'Live Market Prices', sw: 'Bei za Soko Wakati Halisi' },
    body: {
      en: 'Track real-time crop prices across all major markets. Know exactly when and where to sell for maximum profit.',
      sw: 'Fuatilia bei za mazao wakati halisi katika masoko yote makuu. Jua wakati na mahali pa kuuza kwa faida ya juu zaidi.',
    },
  },
  {
    id: '4',
    icon: 'wallet',
    iconColor: '#E65100',
    iconBg: '#FBE9E7',
    title: { en: 'Farm Finance & M-Pesa', sw: 'Fedha za Shamba na M-Pesa' },
    body: {
      en: 'Track income, expenses, and profit. Integrated M-Pesa payments let you pay suppliers, receive payments, and manage farm cash flow easily.',
      sw: 'Fuatilia mapato, matumizi, na faida. Malipo ya M-Pesa yaliyounganishwa hukuruhusu kulipa wasambazaji, kupokea malipo, na kusimamia mtiririko wa pesa ya shamba.',
    },
  },
  {
    id: '5',
    icon: 'people',
    iconColor: '#6A1B9A',
    iconBg: '#F3E5F5',
    title: { en: 'Community & Experts', sw: 'Jamii na Wataalamu' },
    body: {
      en: 'Connect with extension officers, agrovets, and fellow farmers. Get expert consultations and share experiences across East Africa.',
      sw: 'Ungana na maafisa wa ugani, madaktari wa mifugo, na wakulima wenzako. Pata ushauri wa wataalamu na kushiriki uzoefu kote Afrika Mashariki.',
    },
  },
];

const ROLES = [
  { id: 'smallholder_farmer', icon: 'leaf' as const, label: { en: 'Smallholder Farmer', sw: 'Mkulima Mdogo' } },
  { id: 'commercial_farmer', icon: 'business' as const, label: { en: 'Commercial Farmer', sw: 'Mkulima wa Kibiashara' } },
  { id: 'extension_officer', icon: 'school' as const, label: { en: 'Extension Officer', sw: 'Afisa Ugani' } },
  { id: 'agribusiness', icon: 'storefront' as const, label: { en: 'Agribusiness', sw: 'Biashara ya Kilimo' } },
  { id: 'cooperative', icon: 'people' as const, label: { en: 'Cooperative', sw: 'Ushirika' } },
];

const FARM_SIZES = [
  { id: '<1', label: { en: '< 1 acre', sw: '< Ekari 1' } },
  { id: '1-5', label: { en: '1–5 acres', sw: 'Ekari 1–5' } },
  { id: '5-20', label: { en: '5–20 acres', sw: 'Ekari 5–20' } },
  { id: '20+', label: { en: '20+ acres', sw: 'Ekari 20+' } },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { language, updateUser } = useAuth();
  const [step, setStep] = useState<'slides' | 'role' | 'farm'>('slides');
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [saving, setSaving] = useState(false);
  const flatRef = useRef<FlatList>(null);

  const topInset = Platform.OS === 'web' ? 20 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;

  const nextSlide = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (slideIndex < SLIDES.length - 1) {
      const next = slideIndex + 1;
      setSlideIndex(next);
      flatRef.current?.scrollToIndex({ index: next, animated: true });
    } else {
      setStep('role');
    }
  };

  const finish = async () => {
    if (!selectedRole) {
      Alert.alert('', language === 'sw' ? 'Tafadhali chagua jukumu lako.' : 'Please select your role.');
      return;
    }
    setSaving(true);
    try {
      await updateUser({ role: selectedRole, farmSize: selectedSize || '1-5', onboardingCompleted: true });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (step === 'slides') {
    return (
      <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={[styles.slideContainer, { paddingTop: topInset }]}>
        <FlatList
          ref={flatRef}
          data={SLIDES}
          keyExtractor={s => s.id}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width: SCREEN_W }]}>
              <View style={[styles.slideIcon, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon as any} size={52} color={item.iconColor} />
              </View>
              <Text style={styles.slideTitle}>{item.title[language]}</Text>
              <Text style={styles.slideBody}>{item.body[language]}</Text>
            </View>
          )}
        />

        <View style={[styles.slideFooter, { paddingBottom: bottomInset + 24 }]}>
          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View key={i} style={[styles.dot, i === slideIndex && styles.dotActive]} />
            ))}
          </View>

          <View style={styles.slideActions}>
            <TouchableOpacity onPress={() => { setStep('role'); }} style={styles.skipBtn}>
              <Text style={styles.skipText}>{language === 'sw' ? 'Ruka' : 'Skip'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBtn} onPress={nextSlide} activeOpacity={0.85}>
              <Text style={styles.nextBtnText}>
                {slideIndex < SLIDES.length - 1
                  ? (language === 'sw' ? 'Ifuatayo' : 'Next')
                  : (language === 'sw' ? 'Anza' : "Let's Go")}
              </Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (step === 'role') {
    return (
      <View style={[styles.setupContainer, { paddingTop: topInset + 20 }]}>
        <Text style={styles.setupTitle}>{language === 'sw' ? 'Unajihusisha na nini?' : 'What best describes you?'}</Text>
        <Text style={styles.setupSub}>{language === 'sw' ? 'Tutabinafsisha uzoefu wako' : "We'll personalise your experience"}</Text>

        <View style={styles.roleGrid}>
          {ROLES.map(r => (
            <TouchableOpacity
              key={r.id}
              style={[styles.roleCard, selectedRole === r.id && styles.roleCardActive]}
              onPress={() => { setSelectedRole(r.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              activeOpacity={0.8}
            >
              <View style={[styles.roleIcon, { backgroundColor: selectedRole === r.id ? Colors.primary : Colors.primaryMuted }]}>
                <Ionicons name={r.icon} size={24} color={selectedRole === r.id ? '#fff' : Colors.primary} />
              </View>
              <Text style={[styles.roleLabel, selectedRole === r.id && styles.roleLabelActive]}>
                {r.label[language]}
              </Text>
              {selectedRole === r.id && (
                <View style={styles.roleCheck}>
                  <Ionicons name="checkmark" size={14} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title={language === 'sw' ? 'Endelea' : 'Continue'}
          onPress={() => selectedRole ? setStep('farm') : Alert.alert('', language === 'sw' ? 'Chagua jukumu lako kwanza.' : 'Please select your role first.')}
          fullWidth
          style={styles.setupBtn}
          icon="arrow-forward"
        />
      </View>
    );
  }

  return (
    <View style={[styles.setupContainer, { paddingTop: topInset + 20 }]}>
      <TouchableOpacity style={styles.backRow} onPress={() => setStep('role')}>
        <Ionicons name="arrow-back" size={20} color={Colors.primary} />
        <Text style={styles.backRowText}>{language === 'sw' ? 'Rudi' : 'Back'}</Text>
      </TouchableOpacity>

      <Text style={styles.setupTitle}>{language === 'sw' ? 'Ukubwa wa Shamba Lako?' : 'How large is your farm?'}</Text>
      <Text style={styles.setupSub}>{language === 'sw' ? 'Hii itatusaidia kutoa ushauri bora' : 'This helps us give better advice'}</Text>

      <View style={styles.sizeGrid}>
        {FARM_SIZES.map(s => (
          <TouchableOpacity
            key={s.id}
            style={[styles.sizeCard, selectedSize === s.id && styles.sizeCardActive]}
            onPress={() => { setSelectedSize(s.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            activeOpacity={0.8}
          >
            <Text style={[styles.sizeLabel, selectedSize === s.id && styles.sizeLabelActive]}>{s.label[language]}</Text>
            {selectedSize === s.id && <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />}
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title={language === 'sw' ? 'Kamilisha Usanidi' : 'Complete Setup'}
        onPress={finish}
        loading={saving}
        fullWidth
        style={styles.setupBtn}
        icon="checkmark"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  slideContainer: { flex: 1 },
  slide: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 20,
  },
  slideIcon: {
    width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },
  slideTitle: { fontSize: 26, fontWeight: '800' as const, color: '#fff', textAlign: 'center', lineHeight: 34 },
  slideBody: { fontSize: 16, color: 'rgba(255,255,255,0.82)', textAlign: 'center', lineHeight: 25 },
  slideFooter: { paddingHorizontal: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotActive: { backgroundColor: '#fff', width: 24 },
  slideActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skipBtn: { padding: 12 },
  skipText: { fontSize: 15, color: 'rgba(255,255,255,0.7)', fontWeight: '500' as const },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 14, borderRadius: Colors.radiusFull,
  },
  nextBtnText: { fontSize: 16, fontWeight: '700' as const, color: Colors.primary },
  setupContainer: { flex: 1, backgroundColor: Colors.background, padding: 24, gap: 12 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  backRowText: { fontSize: 15, color: Colors.primary, fontWeight: '500' as const },
  setupTitle: { fontSize: 24, fontWeight: '800' as const, color: Colors.text },
  setupSub: { fontSize: 15, color: Colors.textMuted, marginBottom: 8 },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  roleCard: {
    flexBasis: '47%', flex: 1,
    backgroundColor: Colors.card, borderRadius: Colors.radiusLg, padding: 16,
    alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderColor: Colors.border, position: 'relative',
  },
  roleCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  roleIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  roleLabel: { fontSize: 13, fontWeight: '500' as const, color: Colors.text, textAlign: 'center' },
  roleLabelActive: { color: Colors.primary, fontWeight: '600' as const },
  roleCheck: {
    position: 'absolute', top: 8, right: 8,
    width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  sizeGrid: { gap: 10, marginTop: 4 },
  sizeCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.card, borderRadius: Colors.radius, padding: 18,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  sizeCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  sizeLabel: { fontSize: 16, fontWeight: '500' as const, color: Colors.text },
  sizeLabelActive: { color: Colors.primary, fontWeight: '600' as const },
  setupBtn: { marginTop: 16 },
});
