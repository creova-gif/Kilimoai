import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput,
  KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, Dimensions, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Globe, ChevronRight, ChevronLeft, Check, Sprout, MapPin, Scale, ShieldCheck, Fingerprint, QrCode
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useKilimoStore } from '../store/useKilimoStore';
import { useTheme } from '../constants/Theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CROPS = ['Mpunga (Rice)', 'Mahindi (Maize)', 'Kahawa (Coffee)', 'Mpunga wa Kilima', 'Mihogo'];
const REGIONS = ['Bali, Indonesia', 'Arusha, Tanzania', 'Mbeya, Tanzania', 'Dodoma, Tanzania', 'Surabaya, Indonesia'];

export default function OnboardingWizard() {
  const router = useRouter();
  const { colors, radius, shadows } = useTheme();
  
  const setLanguage = useKilimoStore((s) => s.setLanguage);
  const setAgroId = useKilimoStore((s) => s.setAgroId);
  const setFarmProfile = useKilimoStore((s) => s.setFarmProfile);
  const setOnboardingComplete = useKilimoStore((s) => s.setOnboardingComplete);
  const language = useKilimoStore((s) => s.language);

  // States
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [lang, setLang] = useState<'sw' | 'en'>(language);
  const [cropType, setCropType] = useState('Mpunga (Rice)');
  const [farmSize, setFarmSize] = useState('2.5');
  const [location, setLocation] = useState('Bali, Indonesia');
  const [name, setName] = useState('Justin Mafie');
  const [saving, setSaving] = useState(false);

  // Skip onboarding entirely (direct bypass)
  const handleSkip = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeOnboarding('Amina Juma', 'Mpunga (Rice)', 2.5, 'Bali, Indonesia');
  };

  // Complete and save to Supabase
  const completeOnboarding = async (
    profileName: string,
    selectedCrop: string,
    sizeHa: number,
    loc: string
  ) => {
    setSaving(true);
    const generatedId = 'KILIMO-' + Math.floor(1000 + Math.random() * 9000) + '-ID';
    
    // Update local store
    setLanguage(lang);
    setFarmProfile({
      primaryCrops: [selectedCrop],
      region: loc,
      farmSizeAcres: sizeHa,
      mainActivity: 'mazao',
      hasLivestock: false,
      hasIrrigation: false,
      compostKg: 120,
      ureaKg: 50
    });

    const newProfile = {
      id: generatedId,
      name: profileName,
      role: 'farmer',
      location: loc,
      tier: 'Free' as const,
      joinDate: new Date().getFullYear().toString(),
      mpesaLinked: true,
      biometricEnabled: true,
      verificationStatus: 'verified' as const
    };
    setAgroId(newProfile);

    // Save to Supabase
    try {
      const { getSupabase } = require('../lib/supabase');
      const sb = getSupabase();
      if (sb) {
        const payload = {
          user_id: generatedId,
          name: profileName,
          role: 'farmer',
          location: loc,
          crops: [selectedCrop],
          farm_size_acres: sizeHa,
          main_activity: 'mazao',
          has_livestock: false,
          has_irrigation: false,
          compost_kg: 120,
          urea_kg: 50
        };
        await sb.from('agro_profiles').upsert(payload, { onConflict: 'user_id' });
      }
    } catch (dbErr) {
      console.warn('[Onboarding] Supabase save failed, fallback locally:', dbErr);
    }

    setSaving(false);
    setOnboardingComplete(true);
    router.replace('/(tabs)');
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 0) {
      setLanguage(lang);
      setStep(1);
    } else if (step === 1) {
      if (!farmSize || parseFloat(farmSize) <= 0) {
        Alert.alert('Error', 'Please enter a valid farm size.');
        return;
      }
      setStep(2);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 1) setStep(0);
    if (step === 2) setStep(1);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Top Navigation / Progress Indicator */}
      <View style={styles.topBar}>
        {step > 0 ? (
          <TouchableOpacity onPress={handleBack} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Back">
            <ChevronLeft size={22} color="#1E2A3E" strokeWidth={2} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
        
        <View style={styles.progressRow}>
          {[0, 1, 2].map((s) => (
            <View 
              key={s} 
              style={[
                styles.progressDot, 
                { backgroundColor: step === s ? '#2E7D32' : '#E5E7EB' }
              ]} 
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn} accessibilityRole="button" accessibilityLabel="Skip onboarding">
          <Text style={styles.skipText}>{lang === 'sw' ? 'Ruka' : 'Skip'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          
          {/* STEP 0: Language & Welcome */}
          {step === 0 && (
            <Animated.View entering={FadeIn} style={styles.stepContainer}>
              <View style={styles.heroSection}>
                <Sprout size={64} color="#2E7D32" strokeWidth={2} />
                <Text style={styles.mainTitle}>KILIMO AI</Text>
                <Text style={styles.subtitle}>
                  {lang === 'sw' ? 'Msaidizi wako mahiri wa kilimo cha usahihi' : 'Your smart assistant for precision agriculture'}
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>{lang === 'sw' ? 'Chagua Lugha' : 'Select Language'}</Text>
                <View style={styles.langRow}>
                  <TouchableOpacity
                    onPress={() => { setLang('sw'); Haptics.selectionAsync(); }}
                    style={[styles.langBtn, lang === 'sw' && styles.langBtnActive]}
                  >
                    <Globe size={18} color={lang === 'sw' ? '#2E7D32' : '#6B7280'} strokeWidth={2} />
                    <Text style={[styles.langBtnText, lang === 'sw' && styles.langBtnTextActive]}>Kiswahili</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { setLang('en'); Haptics.selectionAsync(); }}
                    style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
                  >
                    <Globe size={18} color={lang === 'en' ? '#2E7D32' : '#6B7280'} strokeWidth={2} />
                    <Text style={[styles.langBtnText, lang === 'en' && styles.langBtnTextActive]}>English</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleNext} accessibilityRole="button">
                <Text style={styles.primaryBtnText}>{lang === 'sw' ? 'Anza Sasa' : 'Get Started'}</Text>
                <ChevronRight size={18} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* STEP 1: Farm Profile Data */}
          {step === 1 && (
            <Animated.View entering={FadeIn} style={styles.stepContainer}>
              <Text style={styles.stepTitle}>
                {lang === 'sw' ? 'Taarifa za Shamba' : 'Farm Profile'}
              </Text>
              <Text style={styles.stepSubtitle}>
                {lang === 'sw' ? 'Weka vipimo vichache kurekebisha mapendekezo ya AI' : 'Provide a few details to tailor the precision analysis'}
              </Text>

              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{lang === 'sw' ? 'Jina Lako' : 'Full Name'}</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.textInput}
                  placeholder="Justin Mafie"
                />
              </View>

              {/* Crop Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{lang === 'sw' ? 'Aina ya Zao' : 'Crop Type'}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
                  {CROPS.map((c) => {
                    const isSel = cropType === c;
                    return (
                      <TouchableOpacity
                        key={c}
                        onPress={() => { setCropType(c); Haptics.selectionAsync(); }}
                        style={[styles.pillBtn, isSel && styles.pillBtnActive]}
                      >
                        <Text style={[styles.pillBtnText, isSel && styles.pillBtnTextActive]}>{c}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Farm Size */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{lang === 'sw' ? 'Ukubwa wa Shamba (Hekta)' : 'Farm Size (Hectares)'}</Text>
                <View style={styles.sizeInputWrap}>
                  <Scale size={20} color="#6B7280" style={{ marginRight: 8 }} strokeWidth={2} />
                  <TextInput
                    value={farmSize}
                    onChangeText={setFarmSize}
                    keyboardType="numeric"
                    style={styles.sizeInput}
                    placeholder="2.5"
                  />
                  <Text style={styles.unitText}>ha</Text>
                </View>
              </View>

              {/* Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{lang === 'sw' ? 'Eneo la Shamba' : 'Location'}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
                  {REGIONS.map((r) => {
                    const isSel = location === r;
                    return (
                      <TouchableOpacity
                        key={r}
                        onPress={() => { setLocation(r); Haptics.selectionAsync(); }}
                        style={[styles.pillBtn, isSel && styles.pillBtnActive]}
                      >
                        <MapPin size={12} color={isSel ? '#2E7D32' : '#6B7280'} strokeWidth={2} style={{ marginRight: 4 }} />
                        <Text style={[styles.pillBtnText, isSel && styles.pillBtnTextActive]}>{r}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleNext} accessibilityRole="button">
                <Text style={styles.primaryBtnText}>{lang === 'sw' ? 'Endelea' : 'Continue'}</Text>
                <ChevronRight size={18} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* STEP 2: Done & Agro ID creation */}
          {step === 2 && (
            <Animated.View entering={FadeIn} style={styles.stepContainer}>
              <View style={styles.doneHeader}>
                <ShieldCheck size={56} color="#2E7D32" strokeWidth={2} />
                <Text style={styles.stepTitle}>
                  {lang === 'sw' ? 'Wasifu Umekamilika!' : 'Setup Complete!'}
                </Text>
                <Text style={styles.stepSubtitle}>
                  {lang === 'sw' ? 'Agro ID yako imeundwa kwa mafanikio' : 'Your Agro ID has been successfully generated'}
                </Text>
              </View>

              {/* Agro ID Card Mockup */}
              <View style={[styles.agroIdCard, { ...shadows.sm }]}>
                <View style={styles.cardTop}>
                  <View style={styles.cardBadge}>
                    <Fingerprint size={12} color="#2E7D32" strokeWidth={2} />
                    <Text style={styles.cardBadgeText}>AGRO ID</Text>
                  </View>
                  <Text style={styles.cardId}>KILIMO-9482-ID</Text>
                </View>

                <View style={styles.cardMiddle}>
                  <View style={styles.cardAvatar}>
                    <Text style={styles.avatarLetters}>{name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{name}</Text>
                    <Text style={styles.cardRole}>Mkulima (Farmer)</Text>
                    <Text style={styles.cardLoc}>{location}</Text>
                  </View>
                </View>

                <View style={styles.cardBottom}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardBottomLabel}>{lang === 'sw' ? 'Zao Makuu' : 'Primary Crop'}</Text>
                    <Text style={styles.cardBottomVal}>{cropType}</Text>
                  </View>
                  <View style={{ width: 60, alignItems: 'flex-end' }}>
                    <QrCode size={40} color="#1E2A3E" strokeWidth={2} />
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.primaryBtn} 
                onPress={() => completeOnboarding(name, cropType, parseFloat(farmSize) || 2.5, location)}
                disabled={saving}
                accessibilityRole="button"
              >
                <Text style={styles.primaryBtnText}>
                  {saving ? (lang === 'sw' ? 'Kuhifadhi...' : 'Saving...') : (lang === 'sw' ? 'Ingia Dashibodi' : 'Enter Dashboard')}
                </Text>
                {!saving && <Check size={18} color="#FFFFFF" strokeWidth={2} />}
              </TouchableOpacity>
            </Animated.View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  progressRow: { flexDirection: 'row', gap: 6 },
  progressDot: { width: 8, height: 8, borderRadius: 4 },
  skipBtn: { paddingHorizontal: 16, paddingVertical: 8, minWidth: 44, justifyContent: 'center', alignItems: 'center' },
  skipText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#6B7280' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  stepContainer: { flex: 1, paddingTop: 20 },
  heroSection: { alignItems: 'center', marginVertical: 32 },
  mainTitle: { fontSize: 32, fontFamily: 'Inter_900Black', color: '#1E2A3E', marginTop: 12, letterSpacing: -1 },
  subtitle: { fontSize: 15, fontFamily: 'Inter_500Medium', color: '#6B7280', textAlign: 'center', marginTop: 8, paddingHorizontal: 20, lineHeight: 22 },
  card: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 16, marginBottom: 32 },
  cardLabel: { fontSize: 12, fontFamily: 'Inter_800ExtraBold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  langRow: { flexDirection: 'row', gap: 12 },
  langBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, gap: 8 },
  langBtnActive: { borderColor: '#2E7D32', backgroundColor: '#E8F5E9' },
  langBtnText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#6B7280' },
  langBtnTextActive: { color: '#2E7D32' },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8, backgroundColor: '#2E7D32', marginTop: 16, minHeight: 48 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter_800ExtraBold' },
  stepTitle: { fontSize: 24, fontFamily: 'Inter_900Black', color: '#1E2A3E', marginBottom: 4 },
  stepSubtitle: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#6B7280', marginBottom: 24, lineHeight: 20 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 11, fontFamily: 'Inter_800ExtraBold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  textInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#1E2A3E', backgroundColor: '#FFFFFF' },
  selectorScroll: { gap: 8, paddingVertical: 4 },
  pillBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center' },
  pillBtnActive: { borderColor: '#2E7D32', backgroundColor: '#E8F5E9' },
  pillBtnText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#6B7280' },
  pillBtnTextActive: { color: '#2E7D32' },
  sizeInputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, backgroundColor: '#FFFFFF' },
  sizeInput: { flex: 1, paddingVertical: 12, fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#1E2A3E' },
  unitText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#6B7280' },
  doneHeader: { alignItems: 'center', marginVertical: 24, gap: 12 },
  agroIdCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 24, padding: 20, marginBottom: 32 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  cardBadgeText: { fontSize: 10, fontFamily: 'Inter_900Black', color: '#2E7D32', letterSpacing: 0.5 },
  cardId: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#6B7280' },
  cardMiddle: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  cardAvatar: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  avatarLetters: { fontSize: 20, fontFamily: 'Inter_900Black', color: '#2E7D32' },
  cardInfo: { marginLeft: 16, flex: 1 },
  cardName: { fontSize: 18, fontFamily: 'Inter_800ExtraBold', color: '#1E2A3E' },
  cardRole: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#6B7280', marginTop: 2 },
  cardLoc: { fontSize: 11, fontFamily: 'Inter_500Medium', color: '#6B7280', marginTop: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  cardBottomLabel: { fontSize: 9, fontFamily: 'Inter_800ExtraBold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 },
  cardBottomVal: { fontSize: 14, fontFamily: 'Inter_700Bold', color: '#1E2A3E', marginTop: 4 },
});
