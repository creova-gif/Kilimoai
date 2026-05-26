/**
 * Onboarding Wizard — Creative redesign
 * Steps: Language → Welcome → Role → Farm Profile → Done
 */
import React, { useState, useMemo } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Switch,
  KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, Dimensions, Image, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Globe, ChevronRight, ChevronLeft, Check,
  Sparkles, Leaf, Tractor, Building2, ShoppingBag, GraduationCap, UserCog,
  Users, MapPin, Zap, TrendingUp, ShieldCheck, Sprout, User,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useKilimoStore, FarmProfile, AppLanguage } from '../store/useKilimoStore';
import { CanonicalRole, allRoles, roleLabel, ROLE_DESCRIPTIONS } from '../lib/access';
import { useAgroAuth } from '../hooks/useAgroAuth';
import { useTheme } from '../constants/Theme';

const { width: SW } = Dimensions.get('window');

const LOGO = require('../assets/icon.png');

const REGIONS = ['Arusha', 'Dodoma', 'Mbeya', 'Kilimanjaro', 'Morogoro', 'Iringa', 'Mwanza', 'Tanga', 'Pwani', 'Singida', 'Tabora'];
const CROPS   = ['Mahindi', 'Maharage', 'Mpunga', 'Kahawa', 'Pamba', 'Alizeti', 'Mihogo', 'Viazi', 'Nyanya', 'Vitunguu', 'Karanga', 'Ndizi'];

const ROLE_META: Record<CanonicalRole, { icon: React.ReactNode; color: string }> = {
  smallholder:       { icon: <Leaf size={22} color="#3ecf8e" />,    color: '#3ecf8e' },
  farmer:            { icon: <Sprout size={22} color="#10b981" />,   color: '#10b981' },
  commercial_farmer: { icon: <Tractor size={22} color="#3b82f6" />,  color: '#3b82f6' },
  farm_manager:      { icon: <UserCog size={22} color="#8b5cf6" />,  color: '#8b5cf6' },
  commercial_admin:  { icon: <Building2 size={22} color="#f59e0b" />,color: '#f59e0b' },
  agribusiness:      { icon: <ShoppingBag size={22} color="#ec4899" />, color: '#ec4899' },
  coop_leader:       { icon: <Users size={22} color="#06b6d4" />,    color: '#06b6d4' },
  extension_officer: { icon: <GraduationCap size={22} color="#a78bfa" />, color: '#a78bfa' },
};

const FEATURES = [
  { icon: <Sparkles size={20} color="#3ecf8e" />, bg: 'rgba(62,207,142,0.12)', label: 'Sankofa AI', sub: 'Ushauri wa AI' },
  { icon: <Leaf size={20} color="#10b981" />,     bg: 'rgba(16,185,129,0.12)', label: 'Crop Scan',  sub: 'Tambua magonjwa' },
  { icon: <TrendingUp size={20} color="#3b82f6" />,bg:'rgba(59,130,246,0.12)', label: 'Soko',       sub: 'Bei za sasa' },
  { icon: <ShieldCheck size={20} color="#f59e0b" />,bg:'rgba(245,158,11,0.12)',label: 'Bima',       sub: 'Ulinzi wa mazao' },
];

const COPY = {
  sw: {
    lang:    { headline: 'KILIMO AI', tagline: 'Kilimo bora · Maisha bora', pick: 'Chagua lugha yako', sw: 'Kiswahili', en: 'English' },
    welcome: { title: 'Mwenzako wa Kidijiti', subtitle: 'Ushauri wa AI kwa lugha yako, utambuzi wa magonjwa, na bei za soko — zote mahali pamoja.' },
    role:    { title: 'Wewe ni nani?', subtitle: 'Tutaonyesha vipengele vinavyokufaa zaidi.' },
    profile: { title: 'Shamba lako', subtitle: 'Hii inaboresha mapendekezo ya AI.', name: 'Jina lako kamili', namePh: 'k.m. Justin Mafie', region: 'Mkoa', crops: 'Mazao makuu (1–4)', size: 'Ukubwa wa shamba (ekari)', activity: 'Shughuli kuu', mazao: 'Mazao', mifugo: 'Mifugo', mchanganyiko: 'Mchanganyiko', livestock: 'Una mifugo?', irrigation: 'Una umwagiliaji?' },
    done:    { title: 'Karibu! 🌿', subtitle: 'Agro ID yako imeundwa. Uko tayari kuanza safari ya kilimo bora.', cta: 'Ingia kwenye Dashibodi' },
    back: 'Rudi', next: 'Endelea',
  },
  en: {
    lang:    { headline: 'KILIMO AI', tagline: 'Better farming · Better life', pick: 'Choose your language', sw: 'Kiswahili', en: 'English' },
    welcome: { title: 'Your Digital Farming Partner', subtitle: 'AI advice in your language, disease diagnosis, and live market prices — all in one place.' },
    role:    { title: 'Who are you?', subtitle: "We'll show you the features that matter most to you." },
    profile: { title: 'Your Farm', subtitle: 'This sharpens your AI recommendations.', name: 'Full name', namePh: 'e.g. Justin Mafie', region: 'Region', crops: 'Primary crops (1–4)', size: 'Farm size (acres)', activity: 'Main activity', mazao: 'Crops', mifugo: 'Livestock', mchanganyiko: 'Mixed', livestock: 'Raise livestock?', irrigation: 'Have irrigation?' },
    done:    { title: 'All set! 🌿', subtitle: 'Your Agro ID is ready. Welcome to better farming.', cta: 'Enter Dashboard' },
    back: 'Back', next: 'Continue',
  },
};

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export default function OnboardingWizard() {
  const router = useRouter();
  const setLanguage           = useKilimoStore((s) => s.setLanguage);
  const setAgroId             = useKilimoStore((s) => s.setAgroId);
  const setFarmProfile        = useKilimoStore((s) => s.setFarmProfile);
  const setOnboardingComplete = useKilimoStore((s) => s.setOnboardingComplete);
  const { signInWithPhone, verifyOtp, loading } = useAgroAuth();
  const { colors, isDark } = useTheme();

  const [step,         setStep]         = useState<Step>(0);
  const [lang,         setLang]         = useState<AppLanguage>('sw');
  const [phone,        setPhone]        = useState('');
  const [otp,          setOtp]          = useState('');
  const [userId,       setUserId]       = useState('');
  const [role,         setRole]         = useState<CanonicalRole>('farmer');
  const [name,         setName]         = useState('');
  const [region,       setRegion]       = useState(REGIONS[0]);
  const [crops,        setCrops]        = useState<string[]>([]);
  const [acres,        setAcres]        = useState('2');
  const [activity,     setActivity]     = useState<FarmProfile['mainActivity']>('mazao');
  const [hasLivestock, setHasLivestock] = useState(false);
  const [hasIrrigation,setHasIrrigation]= useState(false);

  const t = COPY[lang];

  const canContinue = useMemo(() => {
    if (step === 0) return true;
    if (step === 1) return true;
    if (step === 2) return phone.length >= 9;
    if (step === 3) return otp.length === 6;
    if (step === 4) return !!role;
    if (step === 5) return name.trim().length >= 2 && crops.length > 0 && parseFloat(acres) > 0;
    return true;
  }, [step, lang, phone, otp, role, name, crops, acres]);

  async function next() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 0) setLanguage(lang);
    if (step === 2) {
      try {
        await signInWithPhone(phone);
        setStep(3);
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to send OTP');
      }
      return;
    }
    if (step === 3) {
      try {
        const result = await verifyOtp(phone, otp);
        if (result.existingUser) {
          setOnboardingComplete(true);
          router.replace('/(tabs)');
          return;
        }
        setUserId(result.user.id);
        setStep(4);
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Invalid OTP');
      }
      return;
    }
    if (step < 6) setStep((s) => Math.min(6, s + 1) as Step);
  }
  function back() {
    Haptics.selectionAsync();
    if (step > 0) setStep((s) => Math.max(0, s - 1) as Step);
  }
  function finish() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setFarmProfile({ primaryCrops: crops, region, farmSizeAcres: parseFloat(acres) || 0, mainActivity: activity, hasLivestock, hasIrrigation });
    const newProfile = { id: userId, name, role, location: region, tier: 'Free', joinDate: new Date().getFullYear().toString(), mpesaLinked: false, biometricEnabled: false, verificationStatus: 'unverified' } as any;
    setAgroId(newProfile);
    setOnboardingComplete(true);
    router.replace('/(tabs)');
  }
  function toggleCrop(c: string) {
    Haptics.selectionAsync();
    setCrops((p) => p.includes(c) ? p.filter((x) => x !== c) : (p.length < 4 ? [...p, c] : p));
  }

  const isLangStep = step === 0;

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Background gradient */}
      <LinearGradient
        colors={isDark ? ['#080A08', '#122617', '#080A08'] : ['#FAF7F0', '#F2ECE0', '#FAF7F0']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative orbs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[s.orb, { backgroundColor: colors.primary, width: 320, height: 320, top: -100, right: -120, opacity: 0.07 }]} />
        <View style={[s.orb, { backgroundColor: colors.primaryDark, width: 280, height: 280, bottom: 80, left: -120, opacity: 0.08 }]} />
        <View style={[s.orb, { backgroundColor: colors.glow, width: 200, height: 200, bottom: -60, right: -60, opacity: 0.05 }]} />
        {/* Subtle grid lines */}
        <View style={s.gridLine1} />
        <View style={s.gridLine2} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        {/* ── Progress + nav bar (hidden on step 0) ───────── */}
        {!isLangStep && (
          <View style={s.topBar}>
            <TouchableOpacity onPress={back} style={s.backBtn} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel="Go back">
              <ChevronLeft size={18} color={colors.textMute} />
              <Text style={[s.backText, { color: colors.textMute }]}>{t.back}</Text>
            </TouchableOpacity>
            <View style={s.progressPills}>
              {([0,1,2,3,4,5,6] as Step[]).map((i) => (
                <View
                  key={i}
                  style={[
                    s.progressPill,
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' },
                    i === step   && [s.progressActive, { backgroundColor: colors.primary }],
                    i < step     && [s.progressDone, { backgroundColor: colors.primary + '80' }],
                  ]}
                />
              ))}
            </View>
            <Text style={s.stepNum}>{step + 1}/7</Text>
          </View>
        )}

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={[s.scroll, isLangStep && s.scrollLang]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              key={`step-${step}`}
              entering={FadeInUp.springify().damping(24).stiffness(200)}
              exiting={FadeOutUp}
              style={{ flex: 1 }}
            >
              {step === 0 && <LangStep t={t.lang} lang={lang} setLang={setLang} onNext={next} />}
              {step === 1 && <WelcomeStep t={t.welcome} lang={lang} />}
              {step === 2 && <PhoneStep phone={phone} setPhone={setPhone} lang={lang} />}
              {step === 3 && <OtpStep otp={otp} setOtp={setOtp} lang={lang} />}
              {step === 4 && <RoleStep t={t.role} role={role} setRole={setRole} />}
              {step === 5 && (
                <ProfileStep
                  t={t.profile} name={name} setName={setName}
                  region={region} setRegion={setRegion}
                  crops={crops} toggleCrop={toggleCrop}
                  acres={acres} setAcres={setAcres}
                  activity={activity} setActivity={setActivity}
                  hasLivestock={hasLivestock} setHasLivestock={setHasLivestock}
                  hasIrrigation={hasIrrigation} setHasIrrigation={setHasIrrigation}
                />
              )}
              {step === 6 && <DoneStep t={t.done} name={name || 'Mkulima'} role={role} lang={lang} />}
            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView>

        {/* ── Footer CTA (hidden on step 0 — it has inline CTAs) ── */}
        {!isLangStep && (
          <View style={s.footer}>
            <TouchableOpacity
              onPress={step === 6 ? finish : next}
              disabled={!canContinue || loading}
              activeOpacity={0.88}
              style={[s.ctaWrap, (!canContinue || loading) && { opacity: 0.38 }]}
              accessibilityRole="button"
              accessibilityLabel={loading ? 'Loading' : (step === 6 ? t.done.cta : t.next)}
              accessibilityState={{ disabled: !canContinue || loading }}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={s.ctaGrad}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={[s.ctaText, { color: isDark ? '#000' : '#fff' }]}>
                  {loading ? 'Subiri...' : (step === 6 ? t.done.cta : t.next)}
                </Text>
                <View style={s.ctaArrow}>
                  <ChevronRight size={18} color={isDark ? '#000' : '#fff'} strokeWidth={3} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 0 — Language (full-hero layout)
// ─────────────────────────────────────────────────────────────
function LangStep({ t, lang, setLang, onNext }: any) {
  const { colors, isDark } = useTheme();
  return (
    <View style={s.langRoot}>
      {/* Logo mark */}
      <View style={s.logoWrap}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={s.logoGrad}>
          <Sparkles size={38} color={isDark ? '#000' : '#fff'} strokeWidth={1.8} />
        </LinearGradient>
        {/* Glow ring */}
        <View style={[s.logoRing, { borderColor: colors.primary + '40' }]} />
      </View>

      {/* Brand wordmark */}
      <Text style={[s.langHeadline, { color: colors.text }]}>{t.headline}</Text>
      <View style={s.taglineRow}>
        <View style={[s.taglineDot, { backgroundColor: colors.primary }]} />
        <Text style={[s.langTagline, { color: colors.textMute }]}>{t.tagline}</Text>
        <View style={[s.taglineDot, { backgroundColor: colors.primary }]} />
      </View>

      {/* Divider */}
      <View style={[s.langDivider, { backgroundColor: colors.border }]} />

      <Text style={[s.langPick, { color: colors.textMute }]}>{t.pick}</Text>

      {/* Language cards */}
      <View style={s.langCards}>
        {(['sw', 'en'] as const).map((L) => {
          const active = lang === L;
          return (
            <TouchableOpacity
              key={L}
              onPress={() => { Haptics.selectionAsync(); setLang(L); }}
              activeOpacity={0.82}
              style={{ flex: 1 }}
              accessibilityRole="button"
              accessibilityLabel={L === 'sw' ? t.sw : t.en}
              accessibilityState={{ selected: active }}
            >
              <LinearGradient
                colors={active ? [colors.primary + '22', colors.primaryDark + '14'] : ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)']}
                style={[s.langCard, active && { borderColor: colors.primary }, { borderColor: colors.border }]}
              >
                <Text style={s.langFlag}>{L === 'sw' ? '🇹🇿' : '🇬🇧'}</Text>
                <Text style={[s.langLabel, { color: colors.text }, active && { color: colors.primary }]}>
                  {L === 'sw' ? t.sw : t.en}
                </Text>
                {active
                  ? <View style={[s.langCheck, { backgroundColor: colors.primary }]}><Check size={14} color={isDark ? '#000' : '#fff'} strokeWidth={3} /></View>
                  : <View style={[s.langCheckEmpty, { borderColor: colors.border }]} />
                }
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Inline CTA */}
      <TouchableOpacity
        onPress={onNext}
        activeOpacity={0.88}
        style={s.langCtaWrap}
        accessibilityRole="button"
        accessibilityLabel="Continue"
      >
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={s.langCta} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={[s.langCtaText, { color: isDark ? '#000' : '#fff' }]}>{lang === 'sw' ? 'Endelea' : 'Continue'}</Text>
          <View style={s.ctaArrow}>
            <ChevronRight size={18} color={isDark ? '#000' : '#fff'} strokeWidth={3} />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={[s.langFootnote, { color: colors.textMute }]}>
        {lang === 'sw' ? 'Unaweza kubadilisha lugha wakati wowote' : 'You can change language anytime'}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 1 — Welcome
// ─────────────────────────────────────────────────────────────
function WelcomeStep({ t, lang }: any) {
  const { colors } = useTheme();
  return (
    <View style={s.stepRoot}>
      {/* Logo */}
      <View style={[s.welcomeLogoWrap, { borderColor: colors.border }]}>
        <BlurView intensity={20} tint="dark" style={s.welcomeLogoBg}>
          <Image source={LOGO} style={s.welcomeLogoImg} resizeMode="contain" />
        </BlurView>
      </View>

      <Text style={[s.h1, { color: colors.text }]}>{t.title}</Text>
      <Text style={[s.sub, { color: colors.textMute }]}>{t.subtitle}</Text>

      {/* Feature grid */}
      <View style={s.featureGrid}>
        {FEATURES.map((f, i) => (
          <View key={i} style={[s.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[s.featureIcon, { backgroundColor: colors.primaryLight }]}>{React.cloneElement(f.icon as any, { color: colors.primary })}</View>
            <Text style={[s.featureLabel, { color: colors.text }]}>{f.label}</Text>
            <Text style={[s.featureSub, { color: colors.textMute }]}>{lang === 'sw' ? f.sub : f.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 2 — Phone
// ─────────────────────────────────────────────────────────────
function PhoneStep({ phone, setPhone, lang }: any) {
  const { colors, isDark } = useTheme();
  return (
    <View style={s.stepRoot}>
      <Text style={[s.h1, { color: colors.text }]}>{lang === 'sw' ? 'Namba yako ya simu' : 'Your Phone Number'}</Text>
      <Text style={[s.sub, { color: colors.textMute }]}>{lang === 'sw' ? 'Tutakutumia namba ya siri (OTP)' : 'We will send you a secret OTP code'}</Text>

      <FieldLabel label={lang === 'sw' ? 'SIMU' : 'PHONE'} />
      <BlurView intensity={isDark ? 16 : 40} tint={isDark ? "dark" : "light"} style={[s.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <TextInput 
          value={phone} 
          onChangeText={setPhone} 
          placeholder="+255 7..." 
          placeholderTextColor={colors.textMute} 
          style={[s.input, { color: colors.text }]} 
          keyboardType="phone-pad" 
          autoFocus 
          accessibilityLabel="Phone Number Input"
          accessibilityHint="Type your phone number to authenticate"
        />
      </BlurView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 3 — OTP
// ─────────────────────────────────────────────────────────────
function OtpStep({ otp, setOtp, lang }: any) {
  const { colors, isDark } = useTheme();
  return (
    <View style={s.stepRoot}>
      <Text style={[s.h1, { color: colors.text }]}>{lang === 'sw' ? 'Namba ya siri' : 'Secret Code'}</Text>
      <Text style={[s.sub, { color: colors.textMute }]}>{lang === 'sw' ? 'Ingiza tarakimu 6 tulizotuma' : 'Enter the 6-digit code we sent'}</Text>

      <FieldLabel label="OTP" />
      <BlurView intensity={isDark ? 16 : 40} tint={isDark ? "dark" : "light"} style={[s.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <TextInput 
          value={otp} 
          onChangeText={setOtp} 
          placeholder="123456" 
          placeholderTextColor={colors.textMute} 
          style={[s.input, { color: colors.text }]} 
          keyboardType="number-pad" 
          maxLength={6}
          autoFocus 
          accessibilityLabel="OTP Verification Input"
          accessibilityHint="Type the 6 digit code received via SMS"
        />
      </BlurView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 4 — Role
// ─────────────────────────────────────────────────────────────
function RoleStep({ t, role, setRole }: any) {
  const { colors, isDark } = useTheme();
  return (
    <View style={s.stepRoot}>
      <Text style={[s.h1, { color: colors.text }]}>{t.title}</Text>
      <Text style={[s.sub, { color: colors.textMute }]}>{t.subtitle}</Text>
      <View style={{ gap: 8, marginTop: 20 }}>
        {allRoles().map((r) => {
          const meta = ROLE_META[r];
          const active = role === r;
          return (
            <TouchableOpacity
              key={r}
              onPress={() => { Haptics.selectionAsync(); setRole(r); }}
              activeOpacity={0.82}
              accessibilityRole="button"
              accessibilityLabel={`Select role ${roleLabel(r)}`}
              accessibilityState={{ selected: active }}
            >
              <View style={[s.roleCard, { borderColor: colors.border, backgroundColor: colors.card }, active && { borderColor: meta.color, backgroundColor: `${meta.color}14` }]}>
                <View style={[s.roleIconWrap, { backgroundColor: `${meta.color}18` }]}>
                  {meta.icon}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.roleName, { color: colors.text }, active && { color: meta.color }]}>{roleLabel(r)}</Text>
                  <Text style={[s.roleDesc, { color: colors.textMute }]} numberOfLines={1}>{ROLE_DESCRIPTIONS[r]}</Text>
                </View>
                <View style={[s.roleRadio, { borderColor: colors.border }, active && { backgroundColor: meta.color, borderColor: meta.color }]}>
                  {active && <Check size={12} color="#000" strokeWidth={3} />}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 5 — Farm Profile
// ─────────────────────────────────────────────────────────────
function ProfileStep({ t, name, setName, region, setRegion, crops, toggleCrop, acres, setAcres, activity, setActivity, hasLivestock, setHasLivestock, hasIrrigation, setHasIrrigation }: any) {
  const { colors, isDark } = useTheme();

  return (
    <View style={s.stepRoot}>
      <Text style={[s.h1, { color: colors.text }]}>{t.title}</Text>
      <Text style={[s.sub, { color: colors.textMute }]}>{t.subtitle}</Text>

      <FieldLabel label={t.name} />
      <BlurView
        intensity={isDark ? 16 : 40}
        tint={isDark ? "dark" : "light"}
        style={[s.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}
      >
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t.namePh}
          placeholderTextColor={colors.textMute}
          style={[s.input, { color: colors.text }]}
          accessibilityLabel="Full Name Input"
          accessibilityHint="Enter your full name for your agricultural identity profile"
        />
      </BlurView>

      <FieldLabel label={t.region} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
        {REGIONS.map((r) => {
          const isSelected = region === r;
          return (
            <TouchableOpacity
              key={r}
              onPress={() => { Haptics.selectionAsync(); setRegion(r); }}
              accessibilityRole="button"
              accessibilityLabel={`Select region ${r}`}
              accessibilityState={{ selected: isSelected }}
              style={[
                s.pill,
                { borderColor: colors.border, backgroundColor: colors.card },
                isSelected && { borderColor: colors.primary, backgroundColor: colors.primaryLight }
              ]}
            >
              <Text style={[s.pillText, { color: colors.textMute }, isSelected && { color: colors.primary }]}>{r}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FieldLabel label={t.crops} />
      <View style={s.cropGrid}>
        {CROPS.map((c) => {
          const on = crops.includes(c);
          const maxed = !on && crops.length >= 4;
          return (
            <TouchableOpacity
              key={c}
              onPress={() => toggleCrop(c)}
              disabled={maxed}
              accessibilityRole="button"
              accessibilityLabel={`Select crop ${c}`}
              accessibilityState={{ selected: on, disabled: maxed }}
              style={[
                s.cropPill,
                { borderColor: colors.border, backgroundColor: colors.card },
                on && { borderColor: colors.primary, backgroundColor: colors.primaryLight },
                maxed && { opacity: 0.32 }
              ]}
            >
              <Text style={[s.pillText, { color: colors.textMute }, on && { color: colors.primary }]}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FieldLabel label={t.size} />
      <BlurView
        intensity={isDark ? 16 : 40}
        tint={isDark ? "dark" : "light"}
        style={[s.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}
      >
        <TextInput
          value={acres}
          onChangeText={setAcres}
          keyboardType="decimal-pad"
          placeholder="2.5"
          placeholderTextColor={colors.textMute}
          style={[s.input, { color: colors.text }]}
          accessibilityLabel="Farm Size Input"
          accessibilityHint="Enter your farm size in acres using numbers"
        />
      </BlurView>

      <FieldLabel label={t.activity} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(['mazao', 'mifugo', 'mchanganyiko'] as const).map((a) => {
          const isSelected = activity === a;
          return (
            <TouchableOpacity
              key={a}
              onPress={() => { Haptics.selectionAsync(); setActivity(a); }}
              accessibilityRole="button"
              accessibilityLabel={`Select main activity ${a}`}
              accessibilityState={{ selected: isSelected }}
              style={[
                s.actBtn,
                { borderColor: colors.border, backgroundColor: colors.card },
                isSelected && { borderColor: colors.primary, backgroundColor: colors.primaryLight }
              ]}
            >
              <Text style={[s.pillText, { color: colors.textMute }, isSelected && { color: colors.primary }]}>{(t as any)[a]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={[s.toggleRow, { borderBottomColor: colors.border }]}>
        <Text style={[s.toggleLabel, { color: colors.text }]}>{t.livestock}</Text>
        <Switch
          value={hasLivestock}
          onValueChange={setHasLivestock}
          trackColor={{ false: isDark ? '#1C241E' : '#E6DFD5', true: colors.primary }}
          thumbColor="#fff"
          accessibilityRole="switch"
          accessibilityLabel={t.livestock}
          accessibilityState={{ checked: hasLivestock }}
        />
      </View>
      <View style={[s.toggleRow, { borderBottomColor: colors.border }]}>
        <Text style={[s.toggleLabel, { color: colors.text }]}>{t.irrigation}</Text>
        <Switch
          value={hasIrrigation}
          onValueChange={setHasIrrigation}
          trackColor={{ false: isDark ? '#1C241E' : '#E6DFD5', true: colors.primary }}
          thumbColor="#fff"
          accessibilityRole="switch"
          accessibilityLabel={t.irrigation}
          accessibilityState={{ checked: hasIrrigation }}
        />
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 6 — Done
// ─────────────────────────────────────────────────────────────
function DoneStep({ t, name, role, lang }: any) {
  const meta = ROLE_META[role as CanonicalRole];
  const { colors, isDark } = useTheme();

  return (
    <View style={[s.stepRoot, { alignItems: 'center', paddingTop: 16 }]}>
      {/* Success ring */}
      <View style={[s.doneRingOuter, { backgroundColor: colors.primaryLight }]}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={s.doneRingInner}>
          <Check size={44} color={isDark ? '#000' : '#fff'} strokeWidth={3} />
        </LinearGradient>
      </View>

      <Text style={[s.h1, { textAlign: 'center', marginTop: 24, color: colors.text }]}>{t.title}</Text>
      <Text style={[s.sub, { textAlign: 'center', color: colors.textMute }]}>{t.subtitle}</Text>

      {/* ID card preview */}
      <LinearGradient
        colors={isDark ? ['rgba(58, 141, 82, 0.15)', 'rgba(58, 141, 82, 0.04)'] : ['#FAF7F0', '#FFFFFF']}
        style={[s.idCard, { borderColor: colors.border }]}
      >
        <View style={s.idRow}>
          <View style={[s.idIconWrap, { backgroundColor: `${meta.color}20` }]}>
            {meta.icon}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.idName, { color: colors.text }]}>{name}</Text>
            <Text style={[s.idRole, { color: colors.textMute }]}>{roleLabel(role)}</Text>
          </View>
          <View style={[s.idBadge, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
            <Text style={[s.idBadgeText, { color: colors.primary }]}>FREE</Text>
          </View>
        </View>
        <View style={[s.idDivider, { backgroundColor: colors.border }]} />
        <Text style={[s.idFooter, { color: colors.textMute }]}>
          {lang === 'sw' ? '🌿 Agro ID yako imesajiliwa' : '🌿 Your Agro ID is registered'}
        </Text>
      </LinearGradient>
    </View>
  );
}

function FieldLabel({ label }: { label: string }) {
  const { colors } = useTheme();
  return <Text style={[s.fieldLabel, { color: colors.textMute }]}>{label}</Text>;
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#060d1f' },

  // Background decoration
  orb: { position: 'absolute', borderRadius: 999 },
  gridLine1: { position: 'absolute', top: '30%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.025)' },
  gridLine2: { position: 'absolute', top: '60%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.02)' },

  // Top nav
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingRight: 8 },
  backText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  progressPills: { flexDirection: 'row', gap: 5 },
  progressPill: { width: 20, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)' },
  progressActive: { backgroundColor: '#3ecf8e', width: 32 },
  progressDone: { backgroundColor: 'rgba(62,207,142,0.5)' },
  stepNum: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Inter_700Bold', minWidth: 28, textAlign: 'right' },

  // Scroll containers
  scroll: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 20 },
  scrollLang: { flexGrow: 1 },

  // Generic step root
  stepRoot: { paddingTop: 8, paddingBottom: 12 },

  // Typography
  h1: { color: '#fff', fontSize: 30, fontFamily: 'Inter_900Black', letterSpacing: -0.8, lineHeight: 36, marginBottom: 8 },
  sub: { color: 'rgba(255,255,255,0.6)', fontSize: 15, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  fieldLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1.8, textTransform: 'uppercase', marginTop: 20, marginBottom: 8 },

  // Input
  inputWrap: { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  input: { color: '#fff', fontSize: 16, fontFamily: 'Inter_600SemiBold', paddingHorizontal: 16, paddingVertical: 14 },

  // Pills
  pill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' },
  pillActive: { borderColor: '#3ecf8e', backgroundColor: 'rgba(62,207,142,0.15)' },
  pillText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  pillTextActive: { color: '#3ecf8e' },
  cropGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cropPill: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.13)' },
  actBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', alignItems: 'center' },

  // Toggles
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)' },
  toggleLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontFamily: 'Inter_600SemiBold' },

  // Footer CTA
  footer: { paddingHorizontal: 22, paddingBottom: Platform.OS === 'ios' ? 32 : 22, paddingTop: 12 },
  ctaWrap: { borderRadius: 16, overflow: 'hidden' },
  ctaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 0, paddingVertical: 17 },
  ctaText: { color: '#022c22', fontSize: 16, fontFamily: 'Inter_900Black', letterSpacing: 0.2 },
  ctaArrow: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.15)', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },

  // ── Lang step ─────────────────────────────────────────────
  langRoot: { flex: 1, alignItems: 'center', paddingTop: 40, paddingHorizontal: 24, paddingBottom: 24 },
  logoWrap: { width: 96, height: 96, justifyContent: 'center', alignItems: 'center', marginBottom: 24, position: 'relative' },
  logoGrad: { width: 88, height: 88, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  logoRing: { position: 'absolute', width: 96, height: 96, borderRadius: 30, borderWidth: 1.5, borderColor: 'rgba(62,207,142,0.3)', top: 0, left: 0 },
  logoImg: { width: 80, height: 80 },
  langHeadline: { color: '#fff', fontSize: 34, fontFamily: 'Inter_900Black', letterSpacing: -1.2, textAlign: 'center' },
  taglineRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  taglineDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#3ecf8e' },
  langTagline: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.5 },
  langDivider: { width: 40, height: 1.5, backgroundColor: 'rgba(62,207,142,0.3)', marginVertical: 28 },
  langPick: { color: 'rgba(255,255,255,0.55)', fontSize: 12, fontFamily: 'Inter_700Bold', letterSpacing: 1.6, textTransform: 'uppercase', marginBottom: 16, alignSelf: 'flex-start' },
  langCards: { flexDirection: 'row', gap: 12, alignSelf: 'stretch' },
  langCard: { borderRadius: 18, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', paddingVertical: 20, paddingHorizontal: 16, alignItems: 'center', gap: 10, overflow: 'hidden' },
  langFlag: { fontSize: 32 },
  langLabel: { color: '#fff', fontSize: 15, fontFamily: 'Inter_800ExtraBold', textAlign: 'center' },
  langCheck: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#3ecf8e', justifyContent: 'center', alignItems: 'center' },
  langCheckEmpty: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },
  langCtaWrap: { alignSelf: 'stretch', borderRadius: 16, overflow: 'hidden', marginTop: 28 },
  langCta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 17 },
  langCtaText: { color: '#022c22', fontSize: 16, fontFamily: 'Inter_900Black', letterSpacing: 0.2 },
  langFootnote: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 16, textAlign: 'center' },

  // ── Welcome step ──────────────────────────────────────────
  welcomeLogoWrap: { width: 80, height: 80, borderRadius: 20, overflow: 'hidden', marginBottom: 22, borderWidth: 1, borderColor: 'rgba(62,207,142,0.25)' },
  welcomeLogoBg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcomeLogoImg: { width: 60, height: 60 },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 24 },
  featureCard: { width: (SW - 44 - 10) / 2, borderRadius: 16, padding: 16, gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  featureIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center' },
  featureLabel: { color: '#fff', fontSize: 13, fontFamily: 'Inter_800ExtraBold' },
  featureSub: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'Inter_400Regular' },

  // ── Role step ─────────────────────────────────────────────
  roleCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' },
  roleIconWrap: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  roleName: { color: '#fff', fontSize: 13, fontFamily: 'Inter_800ExtraBold', marginBottom: 2 },
  roleDesc: { color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'Inter_400Regular' },
  roleRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },

  // ── Done step ─────────────────────────────────────────────
  doneRingOuter: { width: 100, height: 100, borderRadius: 50, padding: 3, backgroundColor: 'rgba(62,207,142,0.15)' },
  doneRingInner: { flex: 1, borderRadius: 47, justifyContent: 'center', alignItems: 'center' },
  idCard: { alignSelf: 'stretch', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(62,207,142,0.2)', padding: 18, marginTop: 28 },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  idIconWrap: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  idName: { color: '#fff', fontSize: 16, fontFamily: 'Inter_800ExtraBold' },
  idRole: { color: 'rgba(255,255,255,0.55)', fontSize: 12, fontFamily: 'Inter_600SemiBold', marginTop: 2 },
  idBadge: { backgroundColor: 'rgba(62,207,142,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(62,207,142,0.3)' },
  idBadgeText: { color: '#3ecf8e', fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1 },
  idDivider: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 14 },
  idFooter: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
});
