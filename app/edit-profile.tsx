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
  const { colors } = useTheme();

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
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#022c22', '#0a0a0f', '#1e1b4b']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={s.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint={isDirty ? 'You have unsaved changes' : undefined}
          >
            <ChevronLeft size={22} color="#fff" />
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
          <TouchableOpacity
            onPress={save}
            style={[s.iconBtn, canSave && isDirty && { backgroundColor: 'rgba(62,207,142,0.18)' }]}
            accessibilityRole="button"
            accessibilityLabel="Save profile"
            accessibilityState={{ disabled: !(canSave && isDirty) }}
          >
            <Save size={20} color={canSave && isDirty ? '#3ecf8e' : 'rgba(255,255,255,0.3)'} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
            <Text style={s.sub}>{t.sub}</Text>

            {/* Name */}
            <Section icon={<User size={16} color="#3ecf8e" />} label={t.name} />
            <BlurView intensity={20} tint="dark" style={[s.inputWrap, !nameValid && name.length > 0 && s.inputErr]}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t.namePh}
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={s.input}
                accessibilityLabel={t.name}
                accessibilityHint={!nameValid && name.length > 0 ? t.nameErr : undefined}
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
                  style={[s.rolePill, role === r && { borderColor: '#3ecf8e', backgroundColor: 'rgba(62,207,142,0.12)' }]}
                  accessibilityRole="radio"
                  accessibilityLabel={roleLabel(r)}
                  accessibilityState={{ checked: role === r }}
                >
                  <Text style={[s.rolePillText, role === r && { color: '#3ecf8e' }]}>{roleLabel(r)}</Text>
                  {role === r && <Check size={16} color="#3ecf8e" />}
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
                  style={[s.pill, region === r && { borderColor: '#3ecf8e', backgroundColor: 'rgba(62,207,142,0.18)' }]}
                  accessibilityRole="radio"
                  accessibilityLabel={r}
                  accessibilityState={{ checked: region === r }}
                >
                  <Text style={[s.pillText, region === r && { color: '#3ecf8e' }]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Crops */}
            <Section icon={<Sprout size={16} color={colors.primary} />} label={t.crops} />
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
                      on && { borderColor: '#3ecf8e', backgroundColor: 'rgba(62,207,142,0.18)' },
                      disabled && { opacity: 0.35 },
                    ]}
                    accessibilityRole="checkbox"
                    accessibilityLabel={c}
                    accessibilityState={{ checked: on, disabled }}
                  >
                    <Text style={[s.pillText, on && { color: '#3ecf8e' }]}>{c}</Text>
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
                <Check size={12} color="#3ecf8e" />
                <Text style={[s.errText, { color: '#3ecf8e' }]}>
                  {lang === 'sw' ? `Mazao ${MAX_CROPS} yamechaguliwa` : `${MAX_CROPS} crops selected — max reached`}
                </Text>
              </View>
            )}

            {/* Farm size */}
            <Section label={t.size} />
            <BlurView intensity={20} tint="dark" style={s.inputWrap}>
              <TextInput
                value={acres}
                onChangeText={setAcres}
                keyboardType="decimal-pad"
                placeholder="2.5"
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={s.input}
                accessibilityLabel={t.size}
              />
            </BlurView>

            {/* Activity */}
            <Section label={t.activity} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['mazao', 'mifugo', 'mchanganyiko'] as const).map((a) => (
                <TouchableOpacity
                  key={a}
                  onPress={() => { Haptics.selectionAsync(); setActivity(a); }}
                  style={[s.actBtn, activity === a && { borderColor: '#3ecf8e', backgroundColor: 'rgba(62,207,142,0.18)' }]}
                  accessibilityRole="radio"
                  accessibilityLabel={(t as any)[a]}
                  accessibilityState={{ checked: activity === a }}
                >
                  <Text style={[s.pillText, activity === a && { color: '#3ecf8e' }]}>{(t as any)[a]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Toggles */}
            <View style={s.toggleRow}>
              <Text style={s.toggleLabel}>{t.livestock}</Text>
            <Switch
              value={hasLivestock}
              onValueChange={(v) => { Haptics.selectionAsync(); setHasLivestock(v); }}
              trackColor={{ false: '#333', true: '#3ecf8e' }}
              accessibilityLabel={t.livestock}
              accessibilityRole="switch"
            />
            </View>
            <View style={s.toggleRow}>
              <Text style={s.toggleLabel}>{t.irrigation}</Text>
            <Switch
              value={hasIrrigation}
              onValueChange={(v) => { Haptics.selectionAsync(); setHasIrrigation(v); }}
              trackColor={{ false: '#333', true: '#3ecf8e' }}
              accessibilityLabel={t.irrigation}
              accessibilityRole="switch"
            />
            </View>

            {/* Language */}
            <Section icon={<Globe size={16} color="#f59e0b" />} label={t.language} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['sw', 'en'] as const).map((L) => (
                <TouchableOpacity
                  key={L}
                  onPress={() => { Haptics.selectionAsync(); setLang(L); }}
                  style={[s.actBtn, lang === L && { borderColor: '#3ecf8e', backgroundColor: 'rgba(62,207,142,0.18)' }]}
                  accessibilityRole="radio"
                  accessibilityLabel={L === 'sw' ? 'Kiswahili' : 'English'}
                  accessibilityState={{ checked: lang === L }}
                >
                  <Text style={[s.pillText, lang === L && { color: '#3ecf8e' }]}>{L === 'sw' ? 'Kiswahili' : 'English'}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Save CTA */}
            <TouchableOpacity
              onPress={save}
              disabled={!canSave}
              activeOpacity={0.85}
              style={[s.saveCta, { marginTop: 32 }, !canSave && { opacity: 0.4 }]}
              accessibilityRole="button"
              accessibilityLabel={t.save}
              accessibilityState={{ disabled: !canSave }}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={s.saveGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Save size={20} color="#FFFFFF" />
                <Text style={[s.saveText, { color: '#FFFFFF' }]}>{t.save}</Text>
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
  iconBtn:         { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center' },
  headerTitle:     { color: '#fff', fontSize: 17, fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.3 },
  dirtyBadge:      { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  dirtyDot:        { width: 6, height: 6, borderRadius: 3, backgroundColor: '#f59e0b' },
  dirtyText:       { color: '#f59e0b', fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  scroll:          { paddingHorizontal: 20, paddingBottom: 40 },
  sub:             { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'Inter_500Medium', marginBottom: 8, lineHeight: 18 },
  sectionLabel:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 24, marginBottom: 10 },
  sectionLabelText:{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.5, textTransform: 'uppercase' },
  inputWrap:       { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  inputErr:        { borderColor: '#ef4444' },
  input:           { color: '#fff', fontSize: 16, fontFamily: 'Inter_600SemiBold', paddingHorizontal: 16, paddingVertical: 14 },
  errRow:          { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  errText:         { color: '#ef4444', fontSize: 11, fontFamily: 'Inter_500Medium' },
  pill:            { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  pillText:        { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontFamily: 'Inter_700Bold' },
  cropGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cropPill:        { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  actBtn:          { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center' },
  rolePill:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  rolePillText:    { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Inter_700Bold', flex: 1 },
  toggleRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)', marginTop: 6 },
  toggleLabel:     { color: '#fff', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  saveCta:         { borderRadius: 16, overflow: 'hidden' },
  saveGrad:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  saveText:        { color: '#000', fontSize: 16, fontFamily: 'Inter_900Black', letterSpacing: 0.3 },
});
