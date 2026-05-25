/**
 * Onboarding Wizard — PRD AUTH-04, AUTH-05, AUTH-07
 * Steps: Language → Welcome → Role → Farm Profile → Done
 */
import React, { useState, useMemo } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Switch,
  KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Globe, ChevronRight, ChevronLeft, Check,
  Sparkles, Leaf, Tractor, Building2, ShoppingBag, GraduationCap, UserCog,
  Users, MapPin, TrendingUp, ShieldCheck, Sprout, User,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { motion, AnimatePresence } from 'motion/react';
import { useKilimoStore, FarmProfile, AppLanguage } from '../store/useKilimoStore';
import { CanonicalRole, allRoles, roleLabel, ROLE_DESCRIPTIONS } from '../lib/access';

const { width: SW } = Dimensions.get('window');

const REGIONS = ['Arusha', 'Dodoma', 'Mbeya', 'Kilimanjaro', 'Morogoro', 'Iringa', 'Mwanza', 'Tanga', 'Pwani', 'Singida', 'Tabora'];
const CROPS   = ['Mahindi', 'Maharage', 'Mpunga', 'Kahawa', 'Pamba', 'Alizeti', 'Mihogo', 'Viazi', 'Nyanya', 'Vitunguu', 'Karanga', 'Ndizi'];

const ROLE_META: Record<CanonicalRole, { icon: React.ReactNode; color: string }> = {
  smallholder:       { icon: <Leaf size={22} color="#3ecf8e" />,       color: '#3ecf8e' },
  farmer:            { icon: <Sprout size={22} color="#10b981" />,      color: '#10b981' },
  commercial_farmer: { icon: <Tractor size={22} color="#3b82f6" />,     color: '#3b82f6' },
  farm_manager:      { icon: <UserCog size={22} color="#8b5cf6" />,     color: '#8b5cf6' },
  commercial_admin:  { icon: <Building2 size={22} color="#f59e0b" />,   color: '#f59e0b' },
  agribusiness:      { icon: <ShoppingBag size={22} color="#ec4899" />, color: '#ec4899' },
  coop_leader:       { icon: <Users size={22} color="#06b6d4" />,       color: '#06b6d4' },
  extension_officer: { icon: <GraduationCap size={22} color="#a78bfa" />, color: '#a78bfa' },
};

const FEATURES = [
  { icon: <Sparkles size={20} color="#3ecf8e" />, bg: 'rgba(62,207,142,0.12)',  label: 'Sankofa AI',  subSw: 'Ushauri wa AI',       subEn: 'AI advice' },
  { icon: <Leaf size={20} color="#10b981" />,     bg: 'rgba(16,185,129,0.12)',  label: 'Crop Scan',   subSw: 'Tambua magonjwa',     subEn: 'Diagnose disease' },
  { icon: <TrendingUp size={20} color="#3b82f6" />,bg:'rgba(59,130,246,0.12)', label: 'Soko',         subSw: 'Bei za sasa hivi',    subEn: 'Live market prices' },
  { icon: <ShieldCheck size={20} color="#f59e0b" />,bg:'rgba(245,158,11,0.12)',label: 'Bima',          subSw: 'Ulinzi wa mazao',     subEn: 'Crop protection' },
];

const COPY = {
  sw: {
    lang:    { title: 'Karibu KILIMO AI', subtitle: 'Chagua lugha unayopenda', sw: 'Kiswahili', en: 'English' },
    welcome: { title: 'Mwenzako wa Kidijiti', subtitle: 'Ushauri wa AI kwa lugha yako, utambuzi wa magonjwa, na bei za soko — zote mahali pamoja.' },
    role:    { title: 'Wewe ni nani?', subtitle: 'Tutaonyesha vipengele vinavyokufaa zaidi.' },
    profile: { title: 'Shamba lako', subtitle: 'Maelezo haya yanaboresha mapendekezo ya AI.', name: 'Jina lako kamili', namePh: 'k.m. Justin Mafie', region: 'Mkoa', crops: 'Mazao makuu (chagua 1–4)', size: 'Ukubwa wa shamba (ekari)', activity: 'Shughuli kuu', mazao: 'Mazao', mifugo: 'Mifugo', mchanganyiko: 'Mchanganyiko', livestock: 'Una mifugo?', irrigation: 'Una umwagiliaji?' },
    done:    { title: 'Tayari!', subtitle: 'Agro ID yako imeundwa. Karibu kilimo bora, maisha bora.', cta: 'Ingia kwenye Dashibodi' },
    back: 'Rudi', next: 'Endelea',
  },
  en: {
    lang:    { title: 'Welcome to KILIMO AI', subtitle: 'Choose your preferred language', sw: 'Kiswahili', en: 'English' },
    welcome: { title: 'Your Digital Farming Partner', subtitle: 'AI advice in your language, disease diagnosis, and live market prices — all in one place.' },
    role:    { title: 'Who are you?', subtitle: "We'll show you the features most relevant to you." },
    profile: { title: 'Your Farm', subtitle: 'This sharpens your AI recommendations.', name: 'Full name', namePh: 'e.g. Justin Mafie', region: 'Region', crops: 'Primary crops (pick 1–4)', size: 'Farm size (acres)', activity: 'Main activity', mazao: 'Crops', mifugo: 'Livestock', mchanganyiko: 'Mixed', livestock: 'Raise livestock?', irrigation: 'Have irrigation?' },
    done:    { title: 'All set!', subtitle: 'Your Agro ID is ready. Welcome to better farming.', cta: 'Enter Dashboard' },
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
    if (step === 0) return !!lang;
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

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#022c22', '#0a0a0f', '#1e1b4b']} style={StyleSheet.absoluteFill} />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[s.orb, { backgroundColor: '#3ecf8e22', top: -80, right: -80 }]} />
        <View style={[s.orb, { backgroundColor: '#8b5cf622', bottom: -80, left: -80 }]} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        {/* Progress bar */}
        <View style={s.progressWrap}>
          {([0,1,2,3,4] as Step[]).map((i) => (
            <View
              key={i}
              style={[
                s.progressSeg,
                { backgroundColor: i <= step ? '#3ecf8e' : 'rgba(255,255,255,0.15)' },
                i === step && s.progressActive,
              ]}
            />
          ))}
        </View>

        {/* Nav row */}
        <View style={s.header}>
          {step > 0 && step < 4 ? (
            <TouchableOpacity onPress={back} style={s.backBtn}>
              <ChevronLeft size={20} color="#fff" />
              <Text style={s.backText}>{t.back}</Text>
            </TouchableOpacity>
          ) : <View style={{ width: 60 }} />}
          <Text style={s.stepLabel}>{step + 1} / 5</Text>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
            <AnimatePresence mode="wait">
              <motion.View
                key={`step-${step}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', damping: 22, stiffness: 180 }}
              >
                {step === 0 && <LangStep t={t.lang} lang={lang} setLang={setLang} />}
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

        {/* Footer CTA */}
        <View style={s.footer}>
          <TouchableOpacity
            onPress={step === 4 ? finish : next}
            disabled={!canContinue}
            activeOpacity={0.85}
            style={[s.ctaWrap, !canContinue && { opacity: 0.4 }]}
          >
            <LinearGradient colors={['#3ecf8e', '#10b981']} style={s.ctaGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={s.ctaText}>
                {step === 4 ? t.done.cta : step === 1 ? (lang === 'sw' ? 'Anza' : 'Get Started') : t.next}
              </Text>
              <ChevronRight size={22} color="#000" strokeWidth={3} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 0 — Language  (original design, restored)
// ─────────────────────────────────────────────────────────────
function LangStep({ t, lang, setLang }: any) {
  return (
    <View>
      <Sparkles size={42} color="#3ecf8e" style={{ marginBottom: 18 }} />
      <Text style={s.h1}>{t.title}</Text>
      <Text style={s.sub}>{t.subtitle}</Text>
      <View style={{ gap: 12, marginTop: 28 }}>
        {(['sw', 'en'] as const).map((L) => (
          <TouchableOpacity key={L} onPress={() => { Haptics.selectionAsync(); setLang(L); }} activeOpacity={0.85}>
            <BlurView
              intensity={30}
              tint="dark"
              style={[s.langCard, lang === L && { borderColor: '#3ecf8e', backgroundColor: 'rgba(62,207,142,0.12)' }]}
            >
              <Globe size={22} color={lang === L ? '#3ecf8e' : 'rgba(255,255,255,0.6)'} />
              <Text style={[s.langText, lang === L && { color: '#3ecf8e' }]}>
                {L === 'sw' ? t.sw : t.en}
              </Text>
              {lang === L && <Check size={22} color="#3ecf8e" />}
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 1 — Welcome  (improved feature grid)
// ─────────────────────────────────────────────────────────────
function WelcomeStep({ t, lang }: any) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={s.heroIconWrap}>
        <BlurView intensity={40} tint="dark" style={s.heroIcon}>
          <Sprout size={64} color="#3ecf8e" />
        </BlurView>
      </View>
      <Text style={[s.h1, { textAlign: 'center' }]}>{t.title}</Text>
      <Text style={[s.sub, { textAlign: 'center', marginTop: 10 }]}>{t.subtitle}</Text>
      <View style={s.featureGrid}>
        {FEATURES.map((f, i) => (
          <View key={i} style={[s.featureCard, { backgroundColor: f.bg }]}>
            <View style={s.featureIconWrap}>{f.icon}</View>
            <Text style={s.featureLabel}>{f.label}</Text>
            <Text style={s.featureSub}>{lang === 'sw' ? f.subSw : f.subEn}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 2 — Role  (per-role accent colours)
// ─────────────────────────────────────────────────────────────
function RoleStep({ t, role, setRole }: any) {
  return (
    <View>
      <User size={36} color="#3ecf8e" style={{ marginBottom: 14 }} />
      <Text style={s.h1}>{t.title}</Text>
      <Text style={s.sub}>{t.subtitle}</Text>
      <View style={{ gap: 8, marginTop: 20 }}>
        {allRoles().map((r) => {
          const meta = ROLE_META[r];
          const active = role === r;
          return (
            <TouchableOpacity key={r} onPress={() => { Haptics.selectionAsync(); setRole(r); }} activeOpacity={0.82}>
              <BlurView
                intensity={25}
                tint="dark"
                style={[s.roleCard, active && { borderColor: meta.color, backgroundColor: `${meta.color}14` }]}
              >
                <View style={[s.roleIconWrap, { backgroundColor: `${meta.color}18` }]}>
                  {meta.icon}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.roleName, active && { color: meta.color }]}>{roleLabel(r)}</Text>
                  <Text style={s.roleDesc} numberOfLines={1}>{ROLE_DESCRIPTIONS[r]}</Text>
                </View>
                {active && (
                  <View style={[s.roleCheck, { backgroundColor: meta.color }]}>
                    <Check size={13} color="#000" strokeWidth={3} />
                  </View>
                )}
              </BlurView>
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
    <View>
      <MapPin size={36} color="#3ecf8e" style={{ marginBottom: 14 }} />
      <Text style={s.h1}>{t.title}</Text>
      <Text style={s.sub}>{t.subtitle}</Text>

      <Text style={s.fieldLabel}>{t.name}</Text>
      <BlurView intensity={20} tint="dark" style={s.inputWrap}>
        <TextInput value={name} onChangeText={setName} placeholder={t.namePh} placeholderTextColor="rgba(255,255,255,0.4)" style={s.input} />
      </BlurView>

      <Text style={s.fieldLabel}>{t.region}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
        {REGIONS.map((r) => (
          <TouchableOpacity key={r} onPress={() => { Haptics.selectionAsync(); setRegion(r); }} style={[s.pill, region === r && s.pillActive]}>
            <Text style={[s.pillText, region === r && { color: '#3ecf8e' }]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={s.fieldLabel}>{t.crops}</Text>
      <View style={s.cropGrid}>
        {CROPS.map((c) => {
          const on = crops.includes(c);
          return (
            <TouchableOpacity key={c} onPress={() => toggleCrop(c)} style={[s.cropPill, on && s.pillActive, !on && crops.length >= 4 && { opacity: 0.32 }]}>
              <Text style={[s.pillText, on && { color: '#3ecf8e' }]}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={s.fieldLabel}>{t.size}</Text>
      <BlurView intensity={20} tint="dark" style={s.inputWrap}>
        <TextInput value={acres} onChangeText={setAcres} keyboardType="decimal-pad" placeholder="2.5" placeholderTextColor="rgba(255,255,255,0.4)" style={s.input} />
      </BlurView>

      <Text style={s.fieldLabel}>{t.activity}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(['mazao', 'mifugo', 'mchanganyiko'] as const).map((a) => (
          <TouchableOpacity key={a} onPress={() => { Haptics.selectionAsync(); setActivity(a); }} style={[s.actBtn, activity === a && s.pillActive]}>
            <Text style={[s.pillText, activity === a && { color: '#3ecf8e' }]}>{(t as any)[a]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.toggleRow}>
        <Text style={s.toggleLabel}>{t.livestock}</Text>
        <Switch value={hasLivestock} onValueChange={setHasLivestock} trackColor={{ false: '#333', true: '#3ecf8e' }} thumbColor="#fff" />
      </View>
      <View style={s.toggleRow}>
        <Text style={s.toggleLabel}>{t.irrigation}</Text>
        <Switch value={hasIrrigation} onValueChange={setHasIrrigation} trackColor={{ false: '#333', true: '#3ecf8e' }} thumbColor="#fff" />
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
    <View style={{ alignItems: 'center', paddingTop: 16 }}>
      <View style={s.doneRingOuter}>
        <LinearGradient colors={['#3ecf8e', '#0ea95b']} style={s.doneRingInner}>
          <Check size={44} color="#000" strokeWidth={3} />
        </LinearGradient>
      </View>
      <Text style={[s.h1, { textAlign: 'center', marginTop: 24 }]}>{t.title}</Text>
      <Text style={[s.sub, { textAlign: 'center' }]}>{t.subtitle}</Text>

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

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: '#0a0a0f' },
  orb:           { position: 'absolute', width: 400, height: 400, borderRadius: 200, opacity: 0.6 },

  // Progress
  progressWrap:  { flexDirection: 'row', gap: 4, paddingHorizontal: 24, paddingTop: 8 },
  progressSeg:   { flex: 1, height: 3, borderRadius: 2 },
  progressActive:{ flex: 1.6 },

  // Header
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 },
  backBtn:       { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 4 },
  backText:      { color: '#fff', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  stepLabel:     { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'Inter_700Bold', letterSpacing: 1.5 },

  scroll:        { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },

  // Typography
  h1:            { color: '#fff', fontSize: 32, fontFamily: 'Inter_900Black', letterSpacing: -1, lineHeight: 38 },
  sub:           { color: 'rgba(255,255,255,0.7)', fontSize: 15, fontFamily: 'Inter_500Medium', marginTop: 8, lineHeight: 22 },
  fieldLabel:    { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.5, marginTop: 20, marginBottom: 8, textTransform: 'uppercase' },

  // Input
  inputWrap:     { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  input:         { color: '#fff', fontSize: 16, fontFamily: 'Inter_600SemiBold', paddingHorizontal: 16, paddingVertical: 14 },

  // Pills
  pill:          { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  pillActive:    { borderColor: '#3ecf8e', backgroundColor: 'rgba(62,207,142,0.18)' },
  pillText:      { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontFamily: 'Inter_700Bold' },
  cropGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cropPill:      { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  actBtn:        { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center' },

  // Toggles
  toggleRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)', marginTop: 6 },
  toggleLabel:   { color: '#fff', fontSize: 14, fontFamily: 'Inter_600SemiBold' },

  // Footer CTA
  footer:        { paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 30 : 20, paddingTop: 10 },
  ctaWrap:       { borderRadius: 18, overflow: 'hidden' },
  ctaGrad:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  ctaText:       { color: '#000', fontSize: 16, fontFamily: 'Inter_900Black', letterSpacing: 0.3 },

  // Lang step (original)
  langCard:      { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)' },
  langText:      { flex: 1, color: '#fff', fontSize: 17, fontFamily: 'Inter_800ExtraBold' },

  // Welcome step
  heroIconWrap:  { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  heroIcon:      { width: 140, height: 140, borderRadius: 70, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(62,207,142,0.4)', overflow: 'hidden' },
  featureGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 24 },
  featureCard:   { width: (SW - 48 - 10) / 2, borderRadius: 16, padding: 14, gap: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  featureIconWrap:{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  featureLabel:  { color: '#fff', fontSize: 13, fontFamily: 'Inter_800ExtraBold' },
  featureSub:    { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'Inter_500Medium' },

  // Role step
  roleCard:      { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.10)' },
  roleIconWrap:  { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  roleName:      { color: '#fff', fontSize: 14, fontFamily: 'Inter_800ExtraBold', marginBottom: 2 },
  roleDesc:      { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'Inter_500Medium', lineHeight: 15 },
  roleCheck:     { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

  // Done step
  doneRingOuter: { width: 104, height: 104, borderRadius: 52, padding: 4, backgroundColor: 'rgba(62,207,142,0.15)' },
  doneRingInner: { flex: 1, borderRadius: 48, justifyContent: 'center', alignItems: 'center' },
  idCard:        { alignSelf: 'stretch', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(62,207,142,0.2)', padding: 18, marginTop: 28 },
  idRow:         { flexDirection: 'row', alignItems: 'center', gap: 14 },
  idIconWrap:    { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  idName:        { color: '#fff', fontSize: 16, fontFamily: 'Inter_800ExtraBold' },
  idRole:        { color: 'rgba(255,255,255,0.55)', fontSize: 12, fontFamily: 'Inter_600SemiBold', marginTop: 2 },
  idBadge:       { backgroundColor: 'rgba(62,207,142,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(62,207,142,0.3)' },
  idBadgeText:   { color: '#3ecf8e', fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1 },
  idDivider:     { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 14 },
  idFooter:      { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
});
