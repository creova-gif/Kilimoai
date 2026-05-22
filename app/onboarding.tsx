/**
 * Onboarding Wizard — Creative redesign
 * Steps: Language → Welcome → Role → Farm Profile → Done
 */
import React, { useState, useMemo } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Switch,
  KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, Dimensions, Image,
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
import { motion, AnimatePresence } from 'motion/react';
import { useKilimoStore, FarmProfile, AppLanguage } from '../store/useKilimoStore';
import { CanonicalRole, allRoles, roleLabel, ROLE_DESCRIPTIONS } from '../lib/access';

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

type Step = 0 | 1 | 2 | 3 | 4;

export default function OnboardingWizard() {
  const router = useRouter();
  const setLanguage           = useKilimoStore((s) => s.setLanguage);
  const setAgroId             = useKilimoStore((s) => s.setAgroId);
  const setFarmProfile        = useKilimoStore((s) => s.setFarmProfile);
  const setOnboardingComplete = useKilimoStore((s) => s.setOnboardingComplete);

  const [step,         setStep]         = useState<Step>(0);
  const [lang,         setLang]         = useState<AppLanguage>('sw');
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
    if (step === 2) return !!role;
    if (step === 3) return name.trim().length >= 2 && crops.length > 0 && parseFloat(acres) > 0;
    return true;
  }, [step, lang, role, name, crops, acres]);

  function next() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 0) setLanguage(lang);
    if (step < 4) setStep((s) => Math.min(4, s + 1) as Step);
  }
  function back() {
    Haptics.selectionAsync();
    if (step > 0) setStep((s) => Math.max(0, s - 1) as Step);
  }
  function finish() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setFarmProfile({ primaryCrops: crops, region, farmSizeAcres: parseFloat(acres) || 0, mainActivity: activity, hasLivestock, hasIrrigation });
    setAgroId({
      id: `KILIMO-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).slice(2, 4).toUpperCase()}`,
      name: name.trim() || 'Mkulima',
      role,
      location: region,
      tier: 'Free',
      joinDate: new Date().getFullYear().toString(),
      mpesaLinked: false,
      biometricEnabled: false,
    });
    setOnboardingComplete(true);
    router.replace('/(tabs)');
  }
  function toggleCrop(c: string) {
    Haptics.selectionAsync();
    setCrops((p) => p.includes(c) ? p.filter((x) => x !== c) : (p.length < 4 ? [...p, c] : p));
  }

  const isLangStep = step === 0;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />

      {/* Background gradient */}
      <LinearGradient
        colors={['#011a12', '#060d1f', '#0d0d1a']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative orbs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[s.orb, { backgroundColor: '#3ecf8e', width: 320, height: 320, top: -100, right: -120, opacity: 0.07 }]} />
        <View style={[s.orb, { backgroundColor: '#8b5cf6', width: 280, height: 280, bottom: 80, left: -120, opacity: 0.08 }]} />
        <View style={[s.orb, { backgroundColor: '#3b82f6', width: 200, height: 200, bottom: -60, right: -60, opacity: 0.05 }]} />
        {/* Subtle grid lines */}
        <View style={s.gridLine1} />
        <View style={s.gridLine2} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        {/* ── Progress + nav bar (hidden on step 0) ───────── */}
        {!isLangStep && (
          <View style={s.topBar}>
            <TouchableOpacity onPress={back} style={s.backBtn} activeOpacity={0.7}>
              <ChevronLeft size={18} color="rgba(255,255,255,0.8)" />
              <Text style={s.backText}>{t.back}</Text>
            </TouchableOpacity>
            <View style={s.progressPills}>
              {([0,1,2,3,4] as Step[]).map((i) => (
                <View
                  key={i}
                  style={[
                    s.progressPill,
                    i === step   && s.progressActive,
                    i < step     && s.progressDone,
                  ]}
                />
              ))}
            </View>
            <Text style={s.stepNum}>{step + 1}/5</Text>
          </View>
        )}

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={[s.scroll, isLangStep && s.scrollLang]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <AnimatePresence mode="wait">
              <motion.View
                key={`step-${step}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ type: 'spring', damping: 24, stiffness: 200 }}
                style={{ flex: 1 }}
              >
                {step === 0 && <LangStep t={t.lang} lang={lang} setLang={setLang} onNext={next} />}
                {step === 1 && <WelcomeStep t={t.welcome} lang={lang} />}
                {step === 2 && <RoleStep t={t.role} role={role} setRole={setRole} />}
                {step === 3 && (
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
                {step === 4 && <DoneStep t={t.done} name={name || 'Mkulima'} role={role} lang={lang} />}
              </motion.View>
            </AnimatePresence>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* ── Footer CTA (hidden on step 0 — it has inline CTAs) ── */}
        {!isLangStep && (
          <View style={s.footer}>
            <TouchableOpacity
              onPress={step === 4 ? finish : next}
              disabled={!canContinue}
              activeOpacity={0.88}
              style={[s.ctaWrap, !canContinue && { opacity: 0.38 }]}
            >
              <LinearGradient
                colors={['#3ecf8e', '#0ea95b']}
                style={s.ctaGrad}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={s.ctaText}>
                  {step === 4 ? t.done.cta : t.next}
                </Text>
                <View style={s.ctaArrow}>
                  <ChevronRight size={18} color="#022c22" strokeWidth={3} />
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
  return (
    <View style={s.langRoot}>
      {/* Logo mark */}
      <View style={s.logoWrap}>
        <LinearGradient colors={['#3ecf8e', '#0ea95b']} style={s.logoGrad}>
          <Sparkles size={38} color="#fff" strokeWidth={1.8} />
        </LinearGradient>
        {/* Glow ring */}
        <View style={s.logoRing} />
      </View>

      {/* Brand wordmark */}
      <Text style={s.langHeadline}>{t.headline}</Text>
      <View style={s.taglineRow}>
        <View style={s.taglineDot} />
        <Text style={s.langTagline}>{t.tagline}</Text>
        <View style={s.taglineDot} />
      </View>

      {/* Divider */}
      <View style={s.langDivider} />

      <Text style={s.langPick}>{t.pick}</Text>

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
            >
              <LinearGradient
                colors={active ? ['rgba(62,207,142,0.22)', 'rgba(14,169,91,0.14)'] : ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)']}
                style={[s.langCard, active && { borderColor: '#3ecf8e' }]}
              >
                <Text style={s.langFlag}>{L === 'sw' ? '🇹🇿' : '🇬🇧'}</Text>
                <Text style={[s.langLabel, active && { color: '#3ecf8e' }]}>
                  {L === 'sw' ? t.sw : t.en}
                </Text>
                {active
                  ? <View style={s.langCheck}><Check size={14} color="#022c22" strokeWidth={3} /></View>
                  : <View style={s.langCheckEmpty} />
                }
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Inline CTA */}
      <TouchableOpacity onPress={onNext} activeOpacity={0.88} style={s.langCtaWrap}>
        <LinearGradient colors={['#3ecf8e', '#0ea95b']} style={s.langCta} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={s.langCtaText}>{lang === 'sw' ? 'Endelea' : 'Continue'}</Text>
          <View style={s.ctaArrow}>
            <ChevronRight size={18} color="#022c22" strokeWidth={3} />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={s.langFootnote}>
        {lang === 'sw' ? 'Unaweza kubadilisha lugha wakati wowote' : 'You can change language anytime'}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 1 — Welcome
// ─────────────────────────────────────────────────────────────
function WelcomeStep({ t, lang }: any) {
  return (
    <View style={s.stepRoot}>
      {/* Logo */}
      <View style={s.welcomeLogoWrap}>
        <BlurView intensity={20} tint="dark" style={s.welcomeLogoBg}>
          <Image source={LOGO} style={s.welcomeLogoImg} resizeMode="contain" />
        </BlurView>
      </View>

      <Text style={s.h1}>{t.title}</Text>
      <Text style={s.sub}>{t.subtitle}</Text>

      {/* Feature grid */}
      <View style={s.featureGrid}>
        {FEATURES.map((f, i) => (
          <View key={i} style={[s.featureCard, { backgroundColor: f.bg }]}>
            <View style={s.featureIcon}>{f.icon}</View>
            <Text style={s.featureLabel}>{f.label}</Text>
            <Text style={s.featureSub}>{lang === 'sw' ? f.sub : f.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 2 — Role
// ─────────────────────────────────────────────────────────────
function RoleStep({ t, role, setRole }: any) {
  return (
    <View style={s.stepRoot}>
      <Text style={s.h1}>{t.title}</Text>
      <Text style={s.sub}>{t.subtitle}</Text>
      <View style={{ gap: 8, marginTop: 20 }}>
        {allRoles().map((r) => {
          const meta = ROLE_META[r];
          const active = role === r;
          return (
            <TouchableOpacity key={r} onPress={() => { Haptics.selectionAsync(); setRole(r); }} activeOpacity={0.82}>
              <View style={[s.roleCard, active && { borderColor: meta.color, backgroundColor: `${meta.color}14` }]}>
                <View style={[s.roleIconWrap, { backgroundColor: `${meta.color}18` }]}>
                  {meta.icon}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.roleName, active && { color: meta.color }]}>{roleLabel(r)}</Text>
                  <Text style={s.roleDesc} numberOfLines={1}>{ROLE_DESCRIPTIONS[r]}</Text>
                </View>
                <View style={[s.roleRadio, active && { backgroundColor: meta.color, borderColor: meta.color }]}>
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
// Step 3 — Farm Profile
// ─────────────────────────────────────────────────────────────
function ProfileStep({ t, name, setName, region, setRegion, crops, toggleCrop, acres, setAcres, activity, setActivity, hasLivestock, setHasLivestock, hasIrrigation, setHasIrrigation }: any) {
  return (
    <View style={s.stepRoot}>
      <Text style={s.h1}>{t.title}</Text>
      <Text style={s.sub}>{t.subtitle}</Text>

      <FieldLabel label={t.name} />
      <BlurView intensity={16} tint="dark" style={s.inputWrap}>
        <TextInput value={name} onChangeText={setName} placeholder={t.namePh} placeholderTextColor="rgba(255,255,255,0.35)" style={s.input} />
      </BlurView>

      <FieldLabel label={t.region} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
        {REGIONS.map((r) => (
          <TouchableOpacity key={r} onPress={() => { Haptics.selectionAsync(); setRegion(r); }} style={[s.pill, region === r && s.pillActive]}>
            <Text style={[s.pillText, region === r && s.pillTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FieldLabel label={t.crops} />
      <View style={s.cropGrid}>
        {CROPS.map((c) => {
          const on = crops.includes(c);
          const maxed = !on && crops.length >= 4;
          return (
            <TouchableOpacity key={c} onPress={() => toggleCrop(c)} style={[s.cropPill, on && s.pillActive, maxed && { opacity: 0.32 }]}>
              <Text style={[s.pillText, on && s.pillTextActive]}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FieldLabel label={t.size} />
      <BlurView intensity={16} tint="dark" style={s.inputWrap}>
        <TextInput value={acres} onChangeText={setAcres} keyboardType="decimal-pad" placeholder="2.5" placeholderTextColor="rgba(255,255,255,0.35)" style={s.input} />
      </BlurView>

      <FieldLabel label={t.activity} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(['mazao', 'mifugo', 'mchanganyiko'] as const).map((a) => (
          <TouchableOpacity key={a} onPress={() => { Haptics.selectionAsync(); setActivity(a); }} style={[s.actBtn, activity === a && s.pillActive]}>
            <Text style={[s.pillText, activity === a && s.pillTextActive]}>{(t as any)[a]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.toggleRow}>
        <Text style={s.toggleLabel}>{t.livestock}</Text>
        <Switch value={hasLivestock} onValueChange={setHasLivestock} trackColor={{ false: '#1f2937', true: '#3ecf8e' }} thumbColor="#fff" />
      </View>
      <View style={s.toggleRow}>
        <Text style={s.toggleLabel}>{t.irrigation}</Text>
        <Switch value={hasIrrigation} onValueChange={setHasIrrigation} trackColor={{ false: '#1f2937', true: '#3ecf8e' }} thumbColor="#fff" />
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 4 — Done
// ─────────────────────────────────────────────────────────────
function DoneStep({ t, name, role, lang }: any) {
  const meta = ROLE_META[role as CanonicalRole];
  return (
    <View style={[s.stepRoot, { alignItems: 'center', paddingTop: 16 }]}>
      {/* Success ring */}
      <View style={s.doneRingOuter}>
        <LinearGradient colors={['#3ecf8e', '#0ea95b']} style={s.doneRingInner}>
          <Check size={44} color="#000" strokeWidth={3} />
        </LinearGradient>
      </View>

      <Text style={[s.h1, { textAlign: 'center', marginTop: 24 }]}>{t.title}</Text>
      <Text style={[s.sub, { textAlign: 'center' }]}>{t.subtitle}</Text>

      {/* ID card preview */}
      <LinearGradient
        colors={['rgba(62,207,142,0.12)', 'rgba(62,207,142,0.04)']}
        style={s.idCard}
      >
        <View style={s.idRow}>
          <View style={[s.idIconWrap, { backgroundColor: `${meta.color}20` }]}>
            {meta.icon}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.idName}>{name}</Text>
            <Text style={s.idRole}>{roleLabel(role)}</Text>
          </View>
          <View style={s.idBadge}>
            <Text style={s.idBadgeText}>FREE</Text>
          </View>
        </View>
        <View style={s.idDivider} />
        <Text style={s.idFooter}>
          {lang === 'sw' ? '🌿 Agro ID yako imesajiliwa' : '🌿 Your Agro ID is registered'}
        </Text>
      </LinearGradient>
    </View>
  );
}

function FieldLabel({ label }: { label: string }) {
  return <Text style={s.fieldLabel}>{label}</Text>;
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
