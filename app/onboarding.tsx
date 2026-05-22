/**
 * Onboarding Wizard — implements PRD AUTH-04, AUTH-05, AUTH-07
 * Steps: Language → Welcome → Role → Farm Profile → Done
 */
import React, { useState, useMemo } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Switch,
  KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Sprout, Globe, Users, MapPin, ChevronRight, ChevronLeft, Check,
  Sparkles, Leaf, Tractor, Building2, ShoppingBag, GraduationCap, UserCog, User,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../constants/Theme';
import { useKilimoStore, FarmProfile, AppLanguage } from '../store/useKilimoStore';
import { CanonicalRole, allRoles, roleLabel, ROLE_DESCRIPTIONS } from '../lib/access';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const REGIONS = ['Arusha', 'Dodoma', 'Mbeya', 'Kilimanjaro', 'Morogoro', 'Iringa', 'Mwanza', 'Tanga', 'Pwani', 'Singida', 'Tabora'];
const CROPS = ['Mahindi', 'Maharage', 'Mpunga', 'Kahawa', 'Pamba', 'Alizeti', 'Mihogo', 'Viazi', 'Nyanya', 'Vitunguu', 'Karanga', 'Ndizi'];

const ROLE_ICON: Record<CanonicalRole, React.ReactNode> = {
  smallholder: <Leaf size={26} color="#3ecf8e" />,
  farmer: <Sprout size={26} color="#10b981" />,
  commercial_farmer: <Tractor size={26} color="#3b82f6" />,
  farm_manager: <UserCog size={26} color="#8b5cf6" />,
  commercial_admin: <Building2 size={26} color="#f59e0b" />,
  agribusiness: <ShoppingBag size={26} color="#ec4899" />,
  coop_leader: <Users size={26} color="#06b6d4" />,
  extension_officer: <GraduationCap size={26} color="#64748b" />,
};

const COPY = {
  sw: {
    lang: { title: 'Karibu KILIMO AI', subtitle: 'Chagua lugha unayopenda', sw: 'Kiswahili', en: 'English', next: 'Endelea' },
    welcome: { title: 'Mwenzako wa Kilimo wa Kidijiti', subtitle: 'Sankofa AI hutoa ushauri kwa lugha yako, hutambua magonjwa, na kufuatilia bei za soko.', cta: 'Anza' },
    role: { title: 'Wewe ni nani?', subtitle: 'Tutaonyesha vipengele vinavyokufaa zaidi' },
    profile: { title: 'Tuambie kuhusu shamba lako', subtitle: 'Maelezo haya yanaboresha mapendekezo ya AI', name: 'Jina lako kamili', namePh: 'k.m. Justin Mafie', region: 'Mkoa', crops: 'Mazao makuu (chagua 1–4)', size: 'Ukubwa wa shamba (ekari)', activity: 'Shughuli kuu', mazao: 'Mazao', mifugo: 'Mifugo', mchanganyiko: 'Mchanganyiko', livestock: 'Una mifugo?', irrigation: 'Una umwagiliaji?' },
    done: { title: 'Tayari!', subtitle: 'Agro ID yako imeundwa. Karibu Kilimo bora, maisha bora.', cta: 'Ingia kwenye Dashibodi' },
    back: 'Rudi', next: 'Endelea',
  },
  en: {
    lang: { title: 'Welcome to KILIMO AI', subtitle: 'Choose your preferred language', sw: 'Kiswahili', en: 'English', next: 'Continue' },
    welcome: { title: 'Your Digital Farming Partner', subtitle: 'Sankofa AI gives advice in your language, diagnoses disease, and tracks market prices.', cta: 'Get Started' },
    role: { title: 'Who are you?', subtitle: "We'll surface the features most relevant to you" },
    profile: { title: 'Tell us about your farm', subtitle: 'This sharpens your AI recommendations', name: 'Full name', namePh: 'e.g. Justin Mafie', region: 'Region', crops: 'Primary crops (pick 1–4)', size: 'Farm size (acres)', activity: 'Main activity', mazao: 'Crops', mifugo: 'Livestock', mchanganyiko: 'Mixed', livestock: 'Do you raise livestock?', irrigation: 'Do you have irrigation?' },
    done: { title: 'All set!', subtitle: 'Your Agro ID is ready. Welcome to better farming.', cta: 'Enter Dashboard' },
    back: 'Back', next: 'Continue',
  },
};

type Step = 0 | 1 | 2 | 3 | 4;

export default function OnboardingWizard() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const setLanguage = useKilimoStore((s) => s.setLanguage);
  const setAgroId = useKilimoStore((s) => s.setAgroId);
  const setFarmProfile = useKilimoStore((s) => s.setFarmProfile);
  const setOnboardingComplete = useKilimoStore((s) => s.setOnboardingComplete);

  const [step, setStep] = useState<Step>(0);
  const [lang, setLang] = useState<AppLanguage>('sw');
  const [role, setRole] = useState<CanonicalRole>('farmer');
  const [name, setName] = useState('');
  const [region, setRegion] = useState(REGIONS[0]);
  const [crops, setCrops] = useState<string[]>([]);
  const [acres, setAcres] = useState('2');
  const [activity, setActivity] = useState<FarmProfile['mainActivity']>('mazao');
  const [hasLivestock, setHasLivestock] = useState(false);
  const [hasIrrigation, setHasIrrigation] = useState(false);

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
    if (step < 4) {
      if (step === 0) setLanguage(lang);
      setStep((s) => Math.min(4, (s + 1)) as Step);
    }
  }
  function back() {
    Haptics.selectionAsync();
    if (step > 0) setStep((s) => Math.max(0, (s - 1)) as Step);
  }

  function finish() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const profile: FarmProfile = {
      primaryCrops: crops,
      region,
      farmSizeAcres: parseFloat(acres) || 0,
      mainActivity: activity,
      hasLivestock,
      hasIrrigation,
    };
    setFarmProfile(profile);
    setAgroId({
      id: `KILIMO-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).slice(2, 4).toUpperCase()}`,
      name: name.trim() || 'New Farmer',
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
    setCrops((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : (prev.length < 4 ? [...prev, c] : prev));
  }

  return (
    <View style={[s.container, { backgroundColor: isDark ? '#000' : '#0a0a0f' }]}>
      <StatusBar barStyle="light-content" />

      {/* Background */}
      <LinearGradient colors={['#022c22', '#0a0a0f', '#1e1b4b']} style={StyleSheet.absoluteFill} />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[s.orb, { backgroundColor: '#3ecf8e22', top: -80, right: -80 }]} />
        <View style={[s.orb, { backgroundColor: '#8b5cf622', bottom: -80, left: -80 }]} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        {/* Progress bar */}
        <View style={s.progressWrap}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} style={[s.progressSeg, { backgroundColor: i <= step ? '#3ecf8e' : 'rgba(255,255,255,0.15)' }]} />
          ))}
        </View>

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
                {step === 1 && <WelcomeStep t={t.welcome} />}
                {step === 2 && <RoleStep t={t.role} role={role} setRole={setRole} />}
                {step === 3 && (
                  <ProfileStep
                    t={t.profile}
                    name={name} setName={setName}
                    region={region} setRegion={setRegion}
                    crops={crops} toggleCrop={toggleCrop}
                    acres={acres} setAcres={setAcres}
                    activity={activity} setActivity={setActivity}
                    hasLivestock={hasLivestock} setHasLivestock={setHasLivestock}
                    hasIrrigation={hasIrrigation} setHasIrrigation={setHasIrrigation}
                  />
                )}
                {step === 4 && <DoneStep t={t.done} name={name || 'mkulima'} role={role} />}
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
            style={[s.cta, !canContinue && { opacity: 0.4 }]}
          >
            <LinearGradient
              colors={['#3ecf8e', '#10b981']}
              style={s.ctaGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={s.ctaText}>
                {step === 4 ? t.done.cta : step === 1 ? t.welcome.cta : t.next}
              </Text>
              <ChevronRight size={22} color="#000" strokeWidth={3} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─── Step components ──────────────────────────────────────────

function LangStep({ t, lang, setLang }: any) {
  return (
    <View>
      <Sparkles size={42} color="#3ecf8e" style={{ marginBottom: 18 }} />
      <Text style={s.h1}>{t.title}</Text>
      <Text style={s.sub}>{t.subtitle}</Text>
      <View style={{ gap: 12, marginTop: 28 }}>
        {(['sw', 'en'] as const).map((L) => (
          <TouchableOpacity key={L} onPress={() => { Haptics.selectionAsync(); setLang(L); }} activeOpacity={0.85}>
            <BlurView intensity={30} tint="dark" style={[s.langCard, lang === L && { borderColor: '#3ecf8e', backgroundColor: 'rgba(62,207,142,0.12)' }]}>
              <Globe size={22} color={lang === L ? '#3ecf8e' : 'rgba(255,255,255,0.6)'} />
              <Text style={[s.langText, lang === L && { color: '#3ecf8e' }]}>{L === 'sw' ? t.sw : t.en}</Text>
              {lang === L && <Check size={22} color="#3ecf8e" />}
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function WelcomeStep({ t }: any) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={s.heroIconWrap}>
        <BlurView intensity={40} tint="dark" style={s.heroIcon}>
          <Sprout size={64} color="#3ecf8e" />
        </BlurView>
      </View>
      <Text style={[s.h1, { textAlign: 'center' }]}>{t.title}</Text>
      <Text style={[s.sub, { textAlign: 'center', marginTop: 12 }]}>{t.subtitle}</Text>
      <View style={s.featureRow}>
        <FeatureChip icon={<Sparkles size={14} color="#3ecf8e" />} label="Sankofa AI" />
        <FeatureChip icon={<Leaf size={14} color="#10b981" />} label="Crop Scan" />
        <FeatureChip icon={<MapPin size={14} color="#3b82f6" />} label="Soko" />
      </View>
    </View>
  );
}

function FeatureChip({ icon, label }: any) {
  return (
    <View style={s.chip}>
      {icon}
      <Text style={s.chipText}>{label}</Text>
    </View>
  );
}

function RoleStep({ t, role, setRole }: any) {
  return (
    <View>
      <User size={36} color="#3ecf8e" style={{ marginBottom: 14 }} />
      <Text style={s.h1}>{t.title}</Text>
      <Text style={s.sub}>{t.subtitle}</Text>
      <View style={{ gap: 10, marginTop: 22 }}>
        {allRoles().map((r) => (
          <TouchableOpacity key={r} onPress={() => { Haptics.selectionAsync(); setRole(r); }} activeOpacity={0.85}>
            <BlurView intensity={25} tint="dark" style={[s.roleCard, role === r && { borderColor: '#3ecf8e', backgroundColor: 'rgba(62,207,142,0.10)' }]}>
              <View style={s.roleIcon}>{ROLE_ICON[r]}</View>
              <View style={{ flex: 1 }}>
                <Text style={[s.roleName, role === r && { color: '#3ecf8e' }]}>{roleLabel(r)}</Text>
                <Text style={s.roleDesc}>{ROLE_DESCRIPTIONS[r]}</Text>
              </View>
              {role === r && <Check size={20} color="#3ecf8e" />}
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function ProfileStep({ t, name, setName, region, setRegion, crops, toggleCrop, acres, setAcres, activity, setActivity, hasLivestock, setHasLivestock, hasIrrigation, setHasIrrigation }: any) {
  return (
    <View>
      <MapPin size={36} color="#3ecf8e" style={{ marginBottom: 14 }} />
      <Text style={s.h1}>{t.title}</Text>
      <Text style={s.sub}>{t.subtitle}</Text>

      <Text style={s.fieldLabel}>{t.name}</Text>
      <BlurView intensity={20} tint="dark" style={s.inputWrap}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t.namePh}
          placeholderTextColor="rgba(255,255,255,0.4)"
          style={s.input}
        />
      </BlurView>

      <Text style={s.fieldLabel}>{t.region}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
        {REGIONS.map((r) => (
          <TouchableOpacity key={r} onPress={() => { Haptics.selectionAsync(); setRegion(r); }} style={[s.pill, region === r && { borderColor: '#3ecf8e', backgroundColor: 'rgba(62,207,142,0.18)' }]}>
            <Text style={[s.pillText, region === r && { color: '#3ecf8e' }]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={s.fieldLabel}>{t.crops}</Text>
      <View style={s.cropGrid}>
        {CROPS.map((c) => {
          const on = crops.includes(c);
          return (
            <TouchableOpacity key={c} onPress={() => toggleCrop(c)} style={[s.cropPill, on && { borderColor: '#3ecf8e', backgroundColor: 'rgba(62,207,142,0.18)' }]}>
              <Text style={[s.pillText, on && { color: '#3ecf8e' }]}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={s.fieldLabel}>{t.size}</Text>
      <BlurView intensity={20} tint="dark" style={s.inputWrap}>
        <TextInput
          value={acres}
          onChangeText={setAcres}
          keyboardType="decimal-pad"
          placeholder="2.5"
          placeholderTextColor="rgba(255,255,255,0.4)"
          style={s.input}
        />
      </BlurView>

      <Text style={s.fieldLabel}>{t.activity}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(['mazao', 'mifugo', 'mchanganyiko'] as const).map((a) => (
          <TouchableOpacity key={a} onPress={() => { Haptics.selectionAsync(); setActivity(a); }} style={[s.actBtn, activity === a && { borderColor: '#3ecf8e', backgroundColor: 'rgba(62,207,142,0.18)' }]}>
            <Text style={[s.pillText, activity === a && { color: '#3ecf8e' }]}>{t[a]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.toggleRow}>
        <Text style={s.toggleLabel}>{t.livestock}</Text>
        <Switch value={hasLivestock} onValueChange={setHasLivestock} trackColor={{ false: '#333', true: '#3ecf8e' }} />
      </View>
      <View style={s.toggleRow}>
        <Text style={s.toggleLabel}>{t.irrigation}</Text>
        <Switch value={hasIrrigation} onValueChange={setHasIrrigation} trackColor={{ false: '#333', true: '#3ecf8e' }} />
      </View>
    </View>
  );
}

function DoneStep({ t, name, role }: any) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 20 }}>
      <View style={s.heroIconWrap}>
        <BlurView intensity={40} tint="dark" style={[s.heroIcon, { borderColor: '#3ecf8e80' }]}>
          <Check size={64} color="#3ecf8e" strokeWidth={3} />
        </BlurView>
      </View>
      <Text style={[s.h1, { textAlign: 'center' }]}>{t.title}</Text>
      <Text style={[s.sub, { textAlign: 'center', marginTop: 12 }]}>{t.subtitle}</Text>
      <BlurView intensity={25} tint="dark" style={s.summaryCard}>
        <Text style={s.summaryLine}>👤 {name}</Text>
        <Text style={s.summaryLine}>🎯 {roleLabel(role)}</Text>
      </BlurView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  orb: { position: 'absolute', width: 400, height: 400, borderRadius: 200, opacity: 0.6 },
  progressWrap: { flexDirection: 'row', gap: 4, paddingHorizontal: 24, paddingTop: 8 },
  progressSeg: { flex: 1, height: 3, borderRadius: 2 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 4 },
  backText: { color: '#fff', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  stepLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'Inter_700Bold', letterSpacing: 1.5 },
  scroll: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  h1: { color: '#fff', fontSize: 32, fontFamily: 'Inter_900Black', letterSpacing: -1, lineHeight: 38 },
  sub: { color: 'rgba(255,255,255,0.7)', fontSize: 15, fontFamily: 'Inter_500Medium', marginTop: 8, lineHeight: 22 },
  fieldLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.5, marginTop: 20, marginBottom: 8, textTransform: 'uppercase' },
  inputWrap: { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  input: { color: '#fff', fontSize: 16, fontFamily: 'Inter_600SemiBold', paddingHorizontal: 16, paddingVertical: 14 },
  pill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  pillText: { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontFamily: 'Inter_700Bold' },
  cropGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cropPill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  actBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)', marginTop: 6 },
  toggleLabel: { color: '#fff', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  langCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)' },
  langText: { flex: 1, color: '#fff', fontSize: 17, fontFamily: 'Inter_800ExtraBold' },
  roleCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.10)' },
  roleIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center' },
  roleName: { color: '#fff', fontSize: 14, fontFamily: 'Inter_800ExtraBold' },
  roleDesc: { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 3, lineHeight: 15 },
  heroIconWrap: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  heroIcon: { width: 140, height: 140, borderRadius: 70, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(62,207,142,0.4)', overflow: 'hidden' },
  featureRow: { flexDirection: 'row', gap: 8, marginTop: 24 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  chipText: { color: '#fff', fontSize: 11, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.5 },
  summaryCard: { padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(62,207,142,0.3)', marginTop: 24, alignSelf: 'stretch', gap: 8 },
  summaryLine: { color: '#fff', fontSize: 14, fontFamily: 'Inter_700Bold' },
  footer: { paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 30 : 20, paddingTop: 10 },
  cta: { borderRadius: 18, overflow: 'hidden' },
  ctaGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  ctaText: { color: '#000', fontSize: 16, fontFamily: 'Inter_900Black', letterSpacing: 0.3 },
});
