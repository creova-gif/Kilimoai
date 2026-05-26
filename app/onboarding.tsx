import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
  Sprout,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { useKilimoStore } from '../store/useKilimoStore';
import { PALETTE, TYPE, SPACE, SHADOW, RADIUS } from '../constants/Theme';

const { width: W, height: H } = Dimensions.get('window');

const CROPS = [
  { id: 'rice',   label: 'Mpunga (Rice)',        emoji: '🌾' },
  { id: 'maize',  label: 'Mahindi (Maize)',       emoji: '🌽' },
  { id: 'coffee', label: 'Kahawa (Coffee)',        emoji: '☕' },
  { id: 'hrice',  label: 'Mpunga wa Kilima',       emoji: '🏔️' },
  { id: 'cassav', label: 'Mihogo (Cassava)',        emoji: '🥔' },
];

const REGIONS = [
  'Bali, Indonesia',
  'Arusha, Tanzania',
  'Mbeya, Tanzania',
  'Dodoma, Tanzania',
  'Surabaya, Indonesia',
];

// ─── Language Card ─────────────────────────────────────────────────────────

function LangCard({ code, label, flag, selected, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={[
        styles.langCard,
        selected && styles.langCardSelected,
      ]}
    >
      <Text style={styles.langFlag}>{flag}</Text>
      <Text style={[styles.langLabel, selected && styles.langLabelSelected]}>{label}</Text>
      {selected && (
        <Check size={16} color={PALETTE.greenInk} strokeWidth={2.5} style={{ marginLeft: 4 }} />
      )}
    </TouchableOpacity>
  );
}

// ─── Region Row ────────────────────────────────────────────────────────────

function RegionRow({ label, selected, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={[styles.regionRow, selected && styles.regionRowSelected]}
    >
      <View style={[styles.regionDot, selected && styles.regionDotSelected]} />
      <Text style={[styles.regionLabel, selected && styles.regionLabelSelected]}>{label}</Text>
      {selected && <Check size={16} color={PALETTE.greenAction} strokeWidth={2.5} />}
    </TouchableOpacity>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function OnboardingWizard() {
  const router = useRouter();

  const setLanguage         = useKilimoStore(s => s.setLanguage);
  const setAgroId           = useKilimoStore(s => s.setAgroId);
  const setFarmProfile      = useKilimoStore(s => s.setFarmProfile);
  const setOnboardingComplete = useKilimoStore(s => s.setOnboardingComplete);
  const language            = useKilimoStore(s => s.language);

  const [step, setStep]         = useState<0 | 1 | 2>(0);
  const [lang, setLang]         = useState<'sw' | 'en'>(language);
  const [cropId, setCropId]     = useState('rice');
  const [farmSize, setFarmSize] = useState('2.5');
  const [region, setRegion]     = useState('Bali, Indonesia');
  const [name, setName]         = useState('');
  const [saving, setSaving]     = useState(false);

  const cropLabel = CROPS.find(c => c.id === cropId)?.label ?? 'Mpunga (Rice)';

  const t = (sw: string, en: string) => lang === 'sw' ? sw : en;

  // ── navigation ─────────────────────────────────────────────────────────

  const goNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 0) { setLanguage(lang); setStep(1); return; }
    if (step === 1) {
      if (!name.trim()) { Alert.alert(t('Jina Linahitajika', 'Name Required'), t('Tafadhali weka jina lako.', 'Please enter your name.')); return; }
      if (!farmSize || parseFloat(farmSize) <= 0) { Alert.alert(t('Kosa', 'Error'), t('Weka ukubwa sahihi wa shamba.', 'Enter a valid farm size.')); return; }
      setStep(2);
    }
  };

  const goBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step > 0) setStep((s) => (s - 1) as 0 | 1 | 2);
  };

  const handleSkip = () => {
    Haptics.selectionAsync();
    finish('Amina Juma', 'Mpunga (Rice)', 2.5, 'Bali, Indonesia');
  };

  // ── finish ─────────────────────────────────────────────────────────────

  const finish = async (
    profileName: string,
    selectedCrop: string,
    sizeHa: number,
    loc: string,
  ) => {
    setSaving(true);
    const generatedId = 'KILIMO-' + Math.floor(1000 + Math.random() * 9000) + '-ID';

    setLanguage(lang);
    setFarmProfile({
      primaryCrops: [selectedCrop],
      region: loc,
      farmSizeAcres: sizeHa,
      mainActivity: 'mazao',
      hasLivestock: false,
      hasIrrigation: false,
      compostKg: 120,
      ureaKg: 50,
    });

    setAgroId({
      id: generatedId,
      name: profileName,
      role: 'farmer',
      location: loc,
      tier: 'Free',
      joinDate: new Date().getFullYear().toString(),
      mpesaLinked: true,
      biometricEnabled: true,
      verificationStatus: 'verified',
    });

    try {
      const { getSupabase } = require('../lib/supabase');
      const sb = getSupabase();
      if (sb) {
        await sb.from('agro_profiles').upsert({
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
          urea_kg: 50,
        }, { onConflict: 'user_id' });
      }
    } catch (err) {
      console.warn('[Onboarding] Supabase save failed:', err);
    }

    setSaving(false);
    setOnboardingComplete(true);
    router.replace('/(tabs)');
  };

  // ── render ─────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* ── Top Bar ───────────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        {step > 0 ? (
          <TouchableOpacity
            onPress={goBack}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel={t('Rudi', 'Back')}
          >
            <ChevronLeft size={22} color={PALETTE.ink} strokeWidth={2} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}

        {/* Step indicators */}
        <View style={styles.steps}>
          {[0, 1, 2].map(s => (
            <View
              key={s}
              style={[
                styles.stepPip,
                s === step   && styles.stepPipActive,
                s <  step    && styles.stepPipDone,
              ]}
            />
          ))}
        </View>

        <View style={styles.iconBtn} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* ══════════════════════════════════════════════════════════════
              STEP 0 — Language & Welcome
          ══════════════════════════════════════════════════════════════ */}
          {step === 0 && (
            <Animated.View entering={FadeIn.duration(400)} style={styles.stepWrap}>

              {/* Hero illustration area */}
              <View style={styles.heroWrap}>
                <LinearGradient
                  colors={[PALETTE.greenTint, '#E8F5E9']}
                  style={styles.heroBg}
                >
                  <Sprout size={56} color={PALETTE.greenAction} strokeWidth={1.5} />
                </LinearGradient>
                <View style={styles.heroDot1} />
                <View style={styles.heroDot2} />
              </View>

              <Text style={styles.displayTitle}>Kilimo AI</Text>
              <Text style={styles.displaySub}>
                {t(
                  'Msaidizi wako mahiri wa\nkilimo cha usahihi',
                  'Your precision agriculture\nassistant for better yields',
                )}
              </Text>

              {/* Language selection */}
              <View style={styles.langSection}>
                <Text style={styles.sectionLabel}>{t('CHAGUA LUGHA', 'SELECT LANGUAGE')}</Text>
                <View style={styles.langGrid}>
                  <LangCard
                    code="sw"
                    label="Kiswahili"
                    flag="🇹🇿"
                    selected={lang === 'sw'}
                    onPress={() => { setLang('sw'); Haptics.selectionAsync(); }}
                  />
                  <LangCard
                    code="en"
                    label="English"
                    flag="🇬🇧"
                    selected={lang === 'en'}
                    onPress={() => { setLang('en'); Haptics.selectionAsync(); }}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={goNext}
                accessibilityRole="button"
                accessibilityLabel={t('Anza Sasa', 'Get Started')}
              >
                <Text style={styles.primaryBtnText}>{t('Anza Sasa', 'Get Started')}</Text>
                <ChevronRight size={18} color={PALETTE.white} strokeWidth={2.5} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSkip}
                style={styles.bottomSkipBtn}
                accessibilityRole="button"
                accessibilityLabel={t('Ruka Onboarding', 'Skip Onboarding')}
              >
                <Text style={styles.bottomSkipText}>{t('Ruka (Tumia Demo)', 'Skip (Use Demo)')}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 1 — Farm Profile
          ══════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <Animated.View entering={FadeIn.duration(400)} style={styles.stepWrap}>

              <View style={styles.stepHeader}>
                <Text style={styles.stepNum}>{t('Hatua 1 ya 2', 'Step 1 of 2')}</Text>
                <Text style={styles.stepTitle}>{t('Taarifa za Shamba', 'Farm Profile')}</Text>
                <Text style={styles.stepSub}>
                  {t(
                    'Vipimo hivi vinatuwezesha kukusaidia vizuri zaidi',
                    'These details help us tailor precision advice for you',
                  )}
                </Text>
              </View>

              {/* Full name */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{t('JINA LAKO KAMILI', 'FULL NAME')}</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.textInput}
                  placeholder={t('Mfano: Amina Juma', 'E.g. Justin Mafie')}
                  placeholderTextColor={PALETTE.inkMute}
                  autoCapitalize="words"
                  returnKeyType="next"
                  accessibilityLabel={t('Jina', 'Full name')}
                />
              </View>

              {/* Crop type */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{t('AINA YA ZAO KUU', 'PRIMARY CROP')}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipRow}
                >
                  {CROPS.map(c => {
                    const sel = cropId === c.id;
                    return (
                      <TouchableOpacity
                        key={c.id}
                        onPress={() => { setCropId(c.id); Haptics.selectionAsync(); }}
                        style={[styles.chip, sel && styles.chipActive]}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: sel }}
                      >
                        <Text style={styles.chipEmoji}>{c.emoji}</Text>
                        <Text style={[styles.chipText, sel && styles.chipTextActive]}>
                          {c.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Farm size */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{t('UKUBWA WA SHAMBA', 'FARM SIZE')}</Text>
                <View style={styles.sizeRow}>
                  <TextInput
                    value={farmSize}
                    onChangeText={setFarmSize}
                    keyboardType="decimal-pad"
                    style={styles.sizeInput}
                    placeholderTextColor={PALETTE.inkMute}
                    placeholder="2.5"
                    accessibilityLabel={t('Ukubwa wa shamba kwa hekta', 'Farm size in hectares')}
                  />
                  <View style={styles.sizeUnit}>
                    <Text style={styles.sizeUnitText}>ha</Text>
                  </View>
                </View>
              </View>

              {/* Region */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{t('ENEO LA SHAMBA', 'REGION')}</Text>
                <View style={styles.regionList}>
                  {REGIONS.map(r => (
                    <RegionRow
                      key={r}
                      label={r}
                      selected={region === r}
                      onPress={() => { setRegion(r); Haptics.selectionAsync(); }}
                    />
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={goNext}
                accessibilityRole="button"
                accessibilityLabel={t('Endelea', 'Continue')}
              >
                <Text style={styles.primaryBtnText}>{t('Endelea', 'Continue')}</Text>
                <ChevronRight size={18} color={PALETTE.white} strokeWidth={2.5} />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 2 — Agro ID Preview & Complete
          ══════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <Animated.View entering={FadeIn.duration(400)} style={styles.stepWrap}>

              <View style={styles.stepHeader}>
                <Text style={styles.stepNum}>{t('Hatua 2 ya 2', 'Step 2 of 2')}</Text>
                <Text style={styles.stepTitle}>{t('Agro ID Yako', 'Your Agro ID')}</Text>
                <Text style={styles.stepSub}>
                  {t(
                    'Kitambulisho chako cha kidijitali cha kilimo kimesasishwa',
                    'Your digital farming identity has been generated',
                  )}
                </Text>
              </View>

              {/* Dark ID Card */}
              <LinearGradient
                colors={[PALETTE.greenInk, '#0F3C14']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.idCard}
              >
                {/* Card header */}
                <View style={styles.idCardTop}>
                  <View style={styles.idBadge}>
                    <Text style={styles.idBadgeText}>AGRO ID</Text>
                  </View>
                  <Text style={styles.idSerial}>KILIMO-{Math.floor(1000 + Math.random() * 9000)}-ID</Text>
                </View>

                {/* Avatar + info */}
                <View style={styles.idMid}>
                  <View style={styles.idAvatar}>
                    <Text style={styles.idAvatarText}>
                      {(name.trim() || 'KL').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.idInfo}>
                    <Text style={styles.idName}>{name.trim() || t('Mkulima', 'Farmer')}</Text>
                    <Text style={styles.idRole}>{t('Mkulima wa Usahihi', 'Precision Farmer')}</Text>
                    <View style={styles.idLocRow}>
                      <MapPin size={11} color="rgba(255,255,255,0.5)" strokeWidth={2} />
                      <Text style={styles.idLoc}>{region}</Text>
                    </View>
                  </View>
                </View>

                {/* Card footer */}
                <View style={styles.idFooter}>
                  <View style={styles.idStat}>
                    <Text style={styles.idStatLabel}>{t('ZAO KUU', 'PRIMARY CROP')}</Text>
                    <Text style={styles.idStatVal}>{CROPS.find(c => c.id === cropId)?.emoji} {cropLabel}</Text>
                  </View>
                  <View style={styles.idDivider} />
                  <View style={styles.idStat}>
                    <Text style={styles.idStatLabel}>{t('UKUBWA', 'FARM SIZE')}</Text>
                    <Text style={styles.idStatVal}>{farmSize || '2.5'} ha</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* CTA */}
              <TouchableOpacity
                style={[styles.primaryBtn, saving && styles.primaryBtnLoading]}
                onPress={() => finish(name.trim() || 'Mkulima', cropLabel, parseFloat(farmSize) || 2.5, region)}
                disabled={saving}
                accessibilityRole="button"
                accessibilityLabel={t('Ingia Dashibodi', 'Enter Dashboard')}
              >
                {saving ? (
                  <ActivityIndicator color={PALETTE.white} />
                ) : (
                  <>
                    <Text style={styles.primaryBtnText}>{t('Ingia Dashibodi', 'Enter Dashboard')}</Text>
                    <Check size={18} color={PALETTE.white} strokeWidth={2.5} />
                  </>
                )}
              </TouchableOpacity>

              <Text style={styles.legalNote}>
                {t(
                  'Kwa kuendelea, unakubali masharti ya matumizi ya Kilimo AI.',
                  'By continuing, you agree to the Kilimo AI Terms of Service.',
                )}
              </Text>
            </Animated.View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: PALETTE.white },
  flex:   { flex: 1 },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACE['3'],
    height: 56,
  },
  iconBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  steps: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  stepPip: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.line,
  },
  stepPipActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.greenAction,
  },
  stepPipDone: {
    backgroundColor: PALETTE.greenTint,
    borderWidth: 1,
    borderColor: PALETTE.greenAction,
  },
  skipBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  skipText: {
    ...TYPE.captionBold,
    color: PALETTE.inkMute,
  },

  // Scroll
  scroll: {
    paddingHorizontal: SPACE['3'],
    paddingBottom: SPACE['7'],
  },
  stepWrap: { paddingTop: SPACE['2'] },

  // ── Hero (step 0) ────────────────────────────────────────────────────────
  heroWrap: {
    alignItems: 'center',
    marginTop: SPACE['4'],
    marginBottom: SPACE['4'],
  },
  heroBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: PALETTE.greenTint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroEmoji: { fontSize: 56 },
  heroDot1: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PALETTE.greenTint,
    top: 8,
    right: W / 2 - 80,
  },
  heroDot2: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PALETTE.greenTint,
    bottom: 4,
    left: W / 2 - 80,
  },

  displayTitle: {
    ...TYPE.display,
    color: PALETTE.ink,
    textAlign: 'center',
    marginBottom: SPACE['2'],
  },
  displaySub: {
    ...TYPE.bodyMed,
    color: PALETTE.inkMute,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACE['5'],
  },

  langSection: { marginBottom: SPACE['5'] },
  sectionLabel: {
    ...TYPE.label,
    color: PALETTE.inkMute,
    marginBottom: SPACE['2'],
  },
  langGrid: { flexDirection: 'row', gap: SPACE['2'] },
  langCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: SPACE['3'],
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    backgroundColor: PALETTE.white,
  },
  langCardSelected: {
    borderColor: PALETTE.greenAction,
    backgroundColor: PALETTE.greenTint,
  },
  langFlag: { fontSize: 22 },
  langLabel: {
    ...TYPE.bodySemi,
    color: PALETTE.inkMid,
  },
  langLabelSelected: { color: PALETTE.greenInk },

  // ── Step header ──────────────────────────────────────────────────────────
  stepHeader: { marginBottom: SPACE['4'], paddingTop: SPACE['2'] },
  stepNum: {
    ...TYPE.label,
    color: PALETTE.greenAction,
    marginBottom: SPACE['1'],
  },
  stepTitle: {
    ...TYPE.heading,
    color: PALETTE.ink,
    marginBottom: 6,
  },
  stepSub: {
    ...TYPE.bodyMed,
    color: PALETTE.inkMute,
  },

  // ── Form fields ──────────────────────────────────────────────────────────
  fieldGroup: { marginBottom: SPACE['4'] },
  fieldLabel: {
    ...TYPE.label,
    color: PALETTE.inkMute,
    marginBottom: SPACE['2'],
  },
  textInput: {
    height: 52,
    borderBottomWidth: 1.5,
    borderBottomColor: PALETTE.line,
    paddingHorizontal: 0,
    paddingVertical: 0,
    ...TYPE.bodySemi,
    color: PALETTE.ink,
    backgroundColor: 'transparent',
  },

  // Crop chips
  chipRow: { gap: SPACE['2'], paddingVertical: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    backgroundColor: 'transparent',
    minHeight: 44,
  },
  chipActive: {
    borderBottomColor: PALETTE.greenAction,
  },
  chipEmoji: { fontSize: 16 },
  chipText: {
    ...TYPE.captionBold,
    color: PALETTE.inkMid,
  },
  chipTextActive: { color: PALETTE.greenInk },

  // Farm size
  sizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: PALETTE.line,
  },
  sizeInput: {
    flex: 1,
    height: 52,
    ...TYPE.heading,
    color: PALETTE.ink,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  sizeUnit: {
    paddingLeft: SPACE['2'],
    paddingBottom: 4,
  },
  sizeUnitText: {
    ...TYPE.bodyMed,
    color: PALETTE.inkMute,
  },

  // Region list
  regionList: { gap: 2 },
  regionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE['2'],
    paddingVertical: 14,
    paddingHorizontal: SPACE['2'],
    borderRadius: RADIUS.md,
    minHeight: 48,
  },
  regionRowSelected: { backgroundColor: PALETTE.greenTint },
  regionDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    backgroundColor: PALETTE.white,
  },
  regionDotSelected: {
    borderColor: PALETTE.greenAction,
    backgroundColor: PALETTE.greenAction,
  },
  regionLabel: {
    ...TYPE.bodyMed,
    color: PALETTE.inkMid,
    flex: 1,
  },
  regionLabelSelected: { color: PALETTE.greenInk, fontFamily: 'Inter_600SemiBold' },

  // ── Dark ID card (step 2) ────────────────────────────────────────────────
  idCard: {
    backgroundColor: PALETTE.greenInk,
    borderRadius: RADIUS.xl,
    padding: SPACE['4'],
    marginBottom: SPACE['4'],
    ...SHADOW.md,
  },
  idCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACE['4'],
  },
  idBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  idBadgeText: {
    ...TYPE.label,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
  },
  idSerial: {
    ...TYPE.captionMed,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  },

  idMid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE['3'],
    marginBottom: SPACE['4'],
  },
  idAvatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  idAvatarText: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    color: PALETTE.white,
  },
  idInfo: { flex: 1 },
  idName: {
    fontSize: 20,
    fontFamily: 'Inter_800ExtraBold',
    color: PALETTE.white,
    letterSpacing: -0.3,
  },
  idRole: {
    ...TYPE.captionMed,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 3,
  },
  idLocRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  idLoc: {
    ...TYPE.captionMed,
    color: 'rgba(255,255,255,0.45)',
  },

  idFooter: {
    flexDirection: 'row',
    paddingTop: SPACE['3'],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  idStat: { flex: 1 },
  idDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: SPACE['3'],
  },
  idStatLabel: {
    ...TYPE.label,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  idStatVal: {
    ...TYPE.captionBold,
    color: PALETTE.white,
  },

  // ── Primary Button ───────────────────────────────────────────────────────
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: RADIUS.md,
    backgroundColor: PALETTE.greenAction,
    marginTop: SPACE['2'],
    ...SHADOW.sm,
  },
  primaryBtnLoading: { opacity: 0.7 },
  primaryBtnText: {
    ...TYPE.bodySemi,
    color: PALETTE.white,
    fontFamily: 'Inter_700Bold',
  },

  legalNote: {
    ...TYPE.caption,
    color: PALETTE.inkMute,
    textAlign: 'center',
    marginTop: SPACE['3'],
    lineHeight: 18,
  },
  bottomSkipBtn: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACE['3'],
  },
  bottomSkipText: {
    ...TYPE.bodySemi,
    color: PALETTE.inkMute,
  },
});
