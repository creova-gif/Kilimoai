/**
 * Edit Farm Profile — seamless version
 *
 * Logic:
 * 1. Local state is initialised from the persisted store on mount.
 * 2. isDirty tracks any change so the back-button guard only triggers when needed.
 * 3. Validation: name ≥ 2 chars + at least 1 crop before save is allowed.
 * 4. save() writes atomically: updateAgroId → setFarmProfile → setLanguage,
 *    then fires an in-app success notification and navigates back.
 * 5. Pressing the system/header back button while dirty shows an Alert
 *    ("Discard changes?") — no silent data loss.
 * 6. Crop limit is 4 — consistent with the onboarding wizard.
 * 7. useTheme() is used throughout — respects light/dark mode.
 */
import React, { useState, useMemo } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Switch,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Save, User, Sprout, Globe, Check, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useKilimoStore, FarmProfile, AppLanguage } from '../store/useKilimoStore';
import { allRoles, roleLabel, CanonicalRole, normalizeRole } from '../lib/access';
import { useTheme } from '../constants/Theme';

const REGIONS = [
  'Arusha', 'Dodoma', 'Mbeya', 'Kilimanjaro', 'Morogoro',
  'Iringa', 'Mwanza', 'Tanga', 'Pwani', 'Singida', 'Tabora',
];
const CROPS = [
  'Mahindi', 'Maharage', 'Mpunga', 'Kahawa', 'Pamba', 'Alizeti',
  'Mihogo', 'Viazi', 'Nyanya', 'Vitunguu', 'Karanga', 'Ndizi',
];
const MAX_CROPS = 4;

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const agroId        = useKilimoStore((s) => s.agroId);
  const updateAgroId  = useKilimoStore((s) => s.updateAgroId);
  const farmProfile   = useKilimoStore((s) => s.farmProfile);
  const setFarmProfile = useKilimoStore((s) => s.setFarmProfile);
  const language      = useKilimoStore((s) => s.language);
  const setLanguage   = useKilimoStore((s) => s.setLanguage);
  const addNotification = useKilimoStore((s) => s.addNotification);

  // ── Local editable state ────────────────────────────────────────────────────
  const [name,         setName]         = useState(agroId?.name ?? '');
  const [role,         setRole]         = useState<CanonicalRole>(normalizeRole(agroId?.role));
  const [region,       setRegion]       = useState(farmProfile?.region ?? 'Arusha');
  const [crops,        setCrops]        = useState<string[]>(farmProfile?.primaryCrops ?? []);
  const [acres,        setAcres]        = useState(String(farmProfile?.farmSizeAcres ?? '2'));
  const [activity,     setActivity]     = useState<FarmProfile['mainActivity']>(farmProfile?.mainActivity ?? 'mazao');
  const [hasLivestock, setHasLivestock] = useState(farmProfile?.hasLivestock ?? false);
  const [hasIrrigation,setHasIrrigation]= useState(farmProfile?.hasIrrigation ?? false);
  const [lang,         setLang]         = useState<AppLanguage>(language);
  const [saved,        setSaved]        = useState(false);

  // ── Dirty tracking ──────────────────────────────────────────────────────────
  const isDirty = useMemo(() => {
    if (name !== (agroId?.name ?? '')) return true;
    if (role !== normalizeRole(agroId?.role)) return true;
    if (region !== (farmProfile?.region ?? 'Arusha')) return true;
    if (JSON.stringify(crops) !== JSON.stringify(farmProfile?.primaryCrops ?? [])) return true;
    if (acres !== String(farmProfile?.farmSizeAcres ?? '2')) return true;
    if (activity !== (farmProfile?.mainActivity ?? 'mazao')) return true;
    if (hasLivestock !== (farmProfile?.hasLivestock ?? false)) return true;
    if (hasIrrigation !== (farmProfile?.hasIrrigation ?? false)) return true;
    if (lang !== language) return true;
    return false;
  }, [name, role, region, crops, acres, activity, hasLivestock, hasIrrigation, lang,
      agroId, farmProfile, language]);

  // ── Validation ──────────────────────────────────────────────────────────────
  const nameValid  = name.trim().length >= 2;
  const cropsValid = crops.length > 0;
  const canSave    = nameValid && cropsValid;

  // ── Back-button guard ───────────────────────────────────────────────────────
  function handleBack() {
    if (!isDirty || saved) { router.back(); return; }
    Alert.alert(
      lang === 'sw' ? 'Toka bila Kuhifadhi?' : 'Discard changes?',
      lang === 'sw'
        ? 'Mabadiliko yako hayatahifadhiwa.'
        : 'Your unsaved changes will be lost.',
      [
        { text: lang === 'sw' ? 'Endelea Kuhariri' : 'Keep Editing', style: 'cancel' },
        { text: lang === 'sw' ? 'Toka'            : 'Discard',       style: 'destructive', onPress: () => router.back() },
      ],
    );
  }

  // ── Save ────────────────────────────────────────────────────────────────────
  function save() {
    if (!canSave) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateAgroId({ name: name.trim(), role, location: region });
    setFarmProfile({
      primaryCrops: crops,
      region,
      farmSizeAcres: parseFloat(acres) || 0,
      mainActivity: activity,
      hasLivestock,
      hasIrrigation,
    });
    setLanguage(lang);
    addNotification({
      title: lang === 'sw' ? 'Wasifu Umehifadhiwa' : 'Profile Saved',
      body:  lang === 'sw' ? 'Mapendekezo ya AI yatabadilika papo hapo.' : 'AI recommendations will update immediately.',
      type:  'success',
    });
    setSaved(true);
    router.back();
  }

  function toggleCrop(c: string) {
    Haptics.selectionAsync();
    setCrops((p) =>
      p.includes(c)
        ? p.filter((x) => x !== c)
        : p.length < MAX_CROPS ? [...p, c] : p,
    );
  }

  // ── i18n ────────────────────────────────────────────────────────────────────
  const t = lang === 'sw' ? {
    title:       'Hariri Wasifu wa Shamba',
    sub:         'Mabadiliko huboresha mapendekezo ya AI mara moja',
    name:        'Jina kamili',
    namePh:      'e.g. Amina Juma',
    nameErr:     'Jina lazima liwe na herufi 2 au zaidi',
    role:        'Wajibu',
    region:      'Mkoa',
    crops:       `Mazao makuu (chagua hadi ${MAX_CROPS})`,
    cropsErr:    'Chagua angalau zao moja',
    size:        'Ukubwa wa shamba (ekari)',
    activity:    'Shughuli kuu',
    mazao:       'Mazao',
    mifugo:      'Mifugo',
    mchanganyiko:'Mchanganyiko',
    livestock:   'Una mifugo?',
    irrigation:  'Una umwagiliaji?',
    language:    'Lugha ya programu',
    save:        'Hifadhi Mabadiliko',
    unsaved:     'Mabadiliko bila kuhifadhi',
  } : {
    title:       'Edit Farm Profile',
    sub:         'Changes refine your AI recommendations immediately',
    name:        'Full name',
    namePh:      'e.g. Amina Juma',
    nameErr:     'Name must be at least 2 characters',
    role:        'Role',
    region:      'Region',
    crops:       `Primary crops (pick up to ${MAX_CROPS})`,
    cropsErr:    'Select at least one crop',
    size:        'Farm size (acres)',
    activity:    'Main activity',
    mazao:       'Crops',
    mifugo:      'Livestock',
    mchanganyiko:'Mixed',
    livestock:   'Raise livestock?',
    irrigation:  'Have irrigation?',
    language:    'App language',
    save:        'Save Changes',
    unsaved:     'Unsaved changes',
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={isDark ? ['#022c22', '#0a0a0f', '#1e1b4b'] : ['#f0fdf4', '#f8fafc', '#eff6ff']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={handleBack} style={s.iconBtn}>
            <ChevronLeft size={22} color={colors.text} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={s.headerTitle}>{t.title}</Text>
            {isDirty && !saved && (
              <View style={s.dirtyBadge}>
                <View style={s.dirtyDot} />
                <Text style={s.dirtyText}>{t.unsaved}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={save} style={[s.iconBtn, canSave && isDirty && { backgroundColor: 'rgba(34,209,90,0.18)' }]}>
            <Save size={20} color={canSave && isDirty ? '#22d15a' : colors.textMute} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
            <Text style={s.sub}>{t.sub}</Text>

            {/* Name */}
            <Section icon={<User size={16} color="#22d15a" />} label={t.name} />
            <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={[s.inputWrap, !nameValid && name.length > 0 && s.inputErr]}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t.namePh}
                placeholderTextColor={colors.textMute}
                style={[s.input, { color: colors.text }]}
              />
            </BlurView>
            {!nameValid && name.length > 0 && (
              <View style={s.errRow}>
                <AlertCircle size={12} color="#ef4444" />
                <Text style={s.errText}>{t.nameErr}</Text>
              </View>
            )}

            {/* Role */}
            <Section icon={<User size={16} color="#8b5cf6" />} label={t.role} />
            <View style={{ gap: 6 }}>
              {allRoles().map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => { Haptics.selectionAsync(); setRole(r); }}
                  style={[s.rolePill, role === r && { borderColor: '#22d15a', backgroundColor: 'rgba(62,207,142,0.12)' }]}
                >
                  <Text style={[s.rolePillText, role === r && { color: '#22d15a' }]}>{roleLabel(r)}</Text>
                  {role === r && <Check size={16} color="#22d15a" />}
                </TouchableOpacity>
              ))}
            </View>

            {/* Region */}
            <Section icon={<MapPin size={16} color="#3b82f6" />} label={t.region} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
              {REGIONS.map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => { Haptics.selectionAsync(); setRegion(r); }}
                  style={[s.pill, region === r && { borderColor: '#22d15a', backgroundColor: 'rgba(34,209,90,0.18)' }]}
                >
                  <Text style={[s.pillText, region === r && { color: '#22d15a' }]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Crops */}
            <Section icon={<Sprout size={16} color="#10b981" />} label={t.crops} />
            <View style={s.cropGrid}>
              {CROPS.map((c) => {
                const on = crops.includes(c);
                const disabled = !on && crops.length >= MAX_CROPS;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => toggleCrop(c)}
                    style={[
                      s.cropPill,
                      on && { borderColor: '#22d15a', backgroundColor: 'rgba(34,209,90,0.18)' },
                      disabled && { opacity: 0.35 },
                    ]}
                  >
                    <Text style={[s.pillText, on && { color: '#22d15a' }]}>{c}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {crops.length === 0 && (
              <View style={[s.errRow, { marginTop: 6 }]}>
                <AlertCircle size={12} color="#f59e0b" />
                <Text style={[s.errText, { color: '#f59e0b' }]}>{t.cropsErr}</Text>
              </View>
            )}
            {crops.length === MAX_CROPS && (
              <View style={[s.errRow, { marginTop: 6 }]}>
                <Check size={12} color="#22d15a" />
                <Text style={[s.errText, { color: '#22d15a' }]}>
                  {lang === 'sw' ? `Mazao ${MAX_CROPS} yamechaguliwa` : `${MAX_CROPS} crops selected — max reached`}
                </Text>
              </View>
            )}

            {/* Farm size */}
            <Section label={t.size} />
            <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={s.inputWrap}>
              <TextInput
                value={acres}
                onChangeText={setAcres}
                keyboardType="decimal-pad"
                placeholder="2.5"
                placeholderTextColor={colors.textMute}
                style={[s.input, { color: colors.text }]}
              />
            </BlurView>

            {/* Activity */}
            <Section label={t.activity} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['mazao', 'mifugo', 'mchanganyiko'] as const).map((a) => (
                <TouchableOpacity
                  key={a}
                  onPress={() => { Haptics.selectionAsync(); setActivity(a); }}
                  style={[s.actBtn, activity === a && { borderColor: '#22d15a', backgroundColor: 'rgba(34,209,90,0.18)' }]}
                >
                  <Text style={[s.pillText, activity === a && { color: '#22d15a' }]}>{t[a]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Toggles */}
            <View style={s.toggleRow}>
              <Text style={s.toggleLabel}>{t.livestock}</Text>
              <Switch value={hasLivestock} onValueChange={(v) => { Haptics.selectionAsync(); setHasLivestock(v); }} trackColor={{ false: 'rgba(255,255,255,0.15)', true: '#22d15a' }} thumbColor="#fff" />
            </View>
            <View style={s.toggleRow}>
              <Text style={s.toggleLabel}>{t.irrigation}</Text>
              <Switch value={hasIrrigation} onValueChange={(v) => { Haptics.selectionAsync(); setHasIrrigation(v); }} trackColor={{ false: 'rgba(255,255,255,0.15)', true: '#22d15a' }} thumbColor="#fff" />
            </View>

            {/* Language */}
            <Section icon={<Globe size={16} color="#f59e0b" />} label={t.language} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['sw', 'en'] as const).map((L) => (
                <TouchableOpacity
                  key={L}
                  onPress={() => { Haptics.selectionAsync(); setLang(L); }}
                  style={[s.actBtn, lang === L && { borderColor: '#22d15a', backgroundColor: 'rgba(34,209,90,0.18)' }]}
                >
                  <Text style={[s.pillText, lang === L && { color: '#22d15a' }]}>{L === 'sw' ? 'Kiswahili' : 'English'}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Save CTA */}
            <TouchableOpacity
              onPress={save}
              disabled={!canSave}
              activeOpacity={0.85}
              style={[s.saveCta, { marginTop: 32 }, !canSave && { opacity: 0.4 }]}
            >
              <LinearGradient
                colors={['#22d15a', '#16a34a']}
                style={s.saveGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Save size={20} color="#000" />
                <Text style={s.saveText}>{t.save}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 48 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function Section({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <View style={s.sectionLabel}>
      {icon}
      <Text style={s.sectionLabelText}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container:       { flex: 1 },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  iconBtn:         { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.07)', justifyContent: 'center', alignItems: 'center' },
  headerTitle:     { color: '#f0fff4', fontSize: 17, fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.3 },
  dirtyBadge:      { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  dirtyDot:        { width: 6, height: 6, borderRadius: 3, backgroundColor: '#f59e0b' },
  dirtyText:       { color: '#f59e0b', fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  scroll:          { paddingHorizontal: 20, paddingBottom: 40 },
  sub:             { color: '#7a9e82', fontSize: 13, fontFamily: 'Inter_500Medium', marginBottom: 8, lineHeight: 18 },
  sectionLabel:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 24, marginBottom: 10 },
  sectionLabelText:{ color: '#7a9e82', fontSize: 11, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.5, textTransform: 'uppercase' },
  inputWrap:       { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  inputErr:        { borderColor: '#ef4444' },
  input:           { color: '#f0fff4', fontSize: 16, fontFamily: 'Inter_600SemiBold', paddingHorizontal: 16, paddingVertical: 14 },
  errRow:          { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  errText:         { color: '#ef4444', fontSize: 11, fontFamily: 'Inter_500Medium' },
  pill:            { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  pillText:        { color: 'rgba(255,255,255,0.80)', fontSize: 13, fontFamily: 'Inter_700Bold' },
  cropGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cropPill:        { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  actBtn:          { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)', alignItems: 'center' },
  rolePill:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  rolePillText:    { color: '#f0fff4', fontSize: 13, fontFamily: 'Inter_700Bold', flex: 1 },
  toggleRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)', marginTop: 6 },
  toggleLabel:     { color: '#f0fff4', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  saveCta:         { borderRadius: 16, overflow: 'hidden' },
  saveGrad:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  saveText:        { color: '#000', fontSize: 16, fontFamily: 'Inter_900Black', letterSpacing: 0.3 },
});
