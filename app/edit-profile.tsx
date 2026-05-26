import React, { useState, useMemo } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Switch,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin, User, Sprout, Globe, Check, AlertCircle, SquarePen } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useKilimoStore, FarmProfile, AppLanguage } from '../store/useKilimoStore';
import { allRoles, roleLabel, CanonicalRole, normalizeRole } from '../lib/access';
import { useTheme } from '../constants/Theme';

const REGIONS = [
  'Arusha', 'Dodoma', 'Mbeya', 'Kilimanjaro', 'Morogoro',
  'Iringa', 'Mwanza', 'Tanga', 'Pwani', 'Singida', 'Tabora',
];
const CROPS = [
  'Mpunga (Rice)', 'Mahindi (Maize)', 'Kahawa (Coffee)', 'Mihogo', 'Nyanya', 'Vitunguu'
];
const MAX_CROPS = 4;

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors, radius, shadows } = useTheme();

  const agroId        = useKilimoStore((s) => s.agroId);
  const updateAgroId  = useKilimoStore((s) => s.updateAgroId);
  const farmProfile   = useKilimoStore((s) => s.farmProfile);
  const setFarmProfile = useKilimoStore((s) => s.setFarmProfile);
  const language      = useKilimoStore((s) => s.language);
  const setLanguage   = useKilimoStore((s) => s.setLanguage);
  const addNotification = useKilimoStore((s) => s.addNotification);

  // Editable local state
  const [name,         setName]         = useState(agroId?.name ?? '');
  const [role,         setRole]         = useState<CanonicalRole>(normalizeRole(agroId?.role));
  const [region,       setRegion]       = useState(farmProfile?.region ?? 'Arusha');
  const [crops,        setCrops]        = useState<string[]>(farmProfile?.primaryCrops ?? []);
  const [acres,        setAcres]        = useState(String(farmProfile?.farmSizeAcres ?? '2.5'));
  const [activity,     setActivity]     = useState<FarmProfile['mainActivity']>(farmProfile?.mainActivity ?? 'mazao');
  const [hasLivestock, setHasLivestock] = useState(farmProfile?.hasLivestock ?? false);
  const [hasIrrigation,setHasIrrigation]= useState(farmProfile?.hasIrrigation ?? false);
  const [compost,     setCompost]     = useState(String(farmProfile?.compostKg ?? '120'));
  const [urea,        setUrea]        = useState(String(farmProfile?.ureaKg ?? '50'));
  const [lang,         setLang]         = useState<AppLanguage>(language);
  const [saved,        setSaved]        = useState(false);

  // Dirty tracking
  const isDirty = useMemo(() => {
    if (name !== (agroId?.name ?? '')) return true;
    if (role !== normalizeRole(agroId?.role)) return true;
    if (region !== (farmProfile?.region ?? 'Arusha')) return true;
    if (JSON.stringify(crops) !== JSON.stringify(farmProfile?.primaryCrops ?? [])) return true;
    if (acres !== String(farmProfile?.farmSizeAcres ?? '2.5')) return true;
    if (activity !== (farmProfile?.mainActivity ?? 'mazao')) return true;
    if (hasLivestock !== (farmProfile?.hasLivestock ?? false)) return true;
    if (hasIrrigation !== (farmProfile?.hasIrrigation ?? false)) return true;
    if (compost !== String(farmProfile?.compostKg ?? '120')) return true;
    if (urea !== String(farmProfile?.ureaKg ?? '50')) return true;
    if (lang !== language) return true;
    return false;
  }, [name, role, region, crops, acres, activity, hasLivestock, hasIrrigation, compost, urea, lang,
      agroId, farmProfile, language]);

  const nameValid  = name.trim().length >= 2;
  const cropsValid = crops.length > 0;
  const canSave    = nameValid && cropsValid;

  function handleBack() {
    if (!isDirty || saved) { router.back(); return; }
    Alert.alert(
      lang === 'sw' ? 'Toka bila Kuhifadhi?' : 'Discard changes?',
      lang === 'sw' ? 'Mabadiliko yako hayatahifadhiwa.' : 'Your unsaved changes will be lost.',
      [
        { text: lang === 'sw' ? 'Endelea Kuhariri' : 'Keep Editing', style: 'cancel' },
        { text: lang === 'sw' ? 'Toka' : 'Discard', style: 'destructive', onPress: () => router.back() },
      ],
    );
  }

  async function save() {
    if (!canSave) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    }
    
    // Local store updates
    updateAgroId({ name: name.trim(), role, location: region });
    setFarmProfile({
      primaryCrops: crops,
      region,
      farmSizeAcres: parseFloat(acres) || 2.5,
      mainActivity: activity,
      hasLivestock,
      hasIrrigation,
      compostKg: parseFloat(compost) || 0,
      ureaKg: parseFloat(urea) || 0,
    });
    setLanguage(lang);

    // Save to Supabase
    try {
      const { getSupabase } = require('../lib/supabase');
      const sb = getSupabase();
      if (sb && agroId?.id) {
        const payload = {
          user_id: agroId.id,
          name: name.trim(),
          role: role,
          location: region,
          crops: crops,
          farm_size_acres: parseFloat(acres) || 0,
          main_activity: activity,
          has_livestock: hasLivestock,
          has_irrigation: hasIrrigation,
          compost_kg: parseFloat(compost) || 0,
          urea_kg: parseFloat(urea) || 0,
        };
        await sb.from('agro_profiles').upsert(payload, { onConflict: 'user_id' });
      }
    } catch (dbErr) {
      console.warn('[EditProfile] Supabase write failed, saved locally:', dbErr);
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
      p.includes(c) ? p.filter((x) => x !== c) : (p.length < MAX_CROPS ? [...p, c] : p)
    );
  }

  const t = lang === 'sw' ? {
    title:       'Hariri Wasifu wa Shamba',
    sub:         'Mabadiliko huboresha mapendekezo ya AI mara moja',
    name:        'Jina kamili',
    namePh:      'k.m. Justin Mafie',
    nameErr:     'Jina lazima liwe na herufi 2 au zaidi',
    role:        'Wajibu',
    region:      'Mkoa',
    crops:       `Mazao makuu (chagua hadi ${MAX_CROPS})`,
    cropsErr:    'Chagua angalau zao moja',
    size:        'Ukubwa wa shamba (hektari)',
    compost:     'Mbolea ya Samadi (kg)',
    urea:        'Mbolea ya Urea (kg)',
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
    namePh:      'e.g. Justin Mafie',
    nameErr:     'Name must be at least 2 characters',
    role:        'Role',
    region:      'Region',
    crops:       `Primary crops (pick up to ${MAX_CROPS})`,
    cropsErr:    'Select at least one crop',
    size:        'Farm size (hectares)',
    compost:     'Compost (kg)',
    urea:        'Urea (kg)',
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
    <View style={[s.container, { backgroundColor: '#FFFFFF' }]}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={[s.header, { borderBottomColor: '#E5E7EB', borderBottomWidth: 1 }]}>
          <TouchableOpacity
            onPress={handleBack}
            style={[s.iconBtn, { borderColor: '#E5E7EB', borderWidth: 1 }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint={isDirty ? 'You have unsaved changes' : undefined}
          >
            <ChevronLeft size={22} color="#1E2A3E" strokeWidth={2} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={[s.headerTitle, { color: '#1E2A3E' }]}>{t.title}</Text>
            {isDirty && !saved && (
              <View style={s.dirtyBadge}>
                <View style={s.dirtyDot} />
                <Text style={s.dirtyText}>{t.unsaved}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={save}
            style={[s.iconBtn, { borderColor: '#E5E7EB', borderWidth: 1 }, canSave && isDirty && { backgroundColor: '#E8F5E9', borderColor: '#2E7D32' }]}
            accessibilityRole="button"
            accessibilityLabel="Save profile"
            accessibilityState={{ disabled: !(canSave && isDirty) }}
          >
            <SquarePen size={20} color={canSave && isDirty ? '#2E7D32' : '#6B7280'} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={s.sub}>{t.sub}</Text>

            {/* Name */}
            <Section icon={<User size={16} color="#2E7D32" strokeWidth={2} />} label={t.name} />
            <View style={[s.inputWrap, !nameValid && name.length > 0 && s.inputErr]}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t.namePh}
                placeholderTextColor="#6B7280"
                style={s.input}
                accessibilityLabel={t.name}
                accessibilityHint={!nameValid && name.length > 0 ? t.nameErr : undefined}
              />
            </View>
            {!nameValid && name.length > 0 && (
              <View style={s.errRow}>
                <AlertCircle size={12} color="#ef4444" strokeWidth={2} />
                <Text style={s.errText}>{t.nameErr}</Text>
              </View>
            )}

            {/* Role */}
            <Section icon={<User size={16} color="#2E7D32" strokeWidth={2} />} label={t.role} />
            <View style={{ gap: 6 }}>
              {allRoles().map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => { Haptics.selectionAsync(); setRole(r); }}
                  style={[s.rolePill, role === r && { borderColor: '#2E7D32', backgroundColor: '#E8F5E9' }]}
                  accessibilityRole="radio"
                  accessibilityLabel={roleLabel(r)}
                  accessibilityState={{ checked: role === r }}
                >
                  <Text style={[s.rolePillText, { color: role === r ? '#2E7D32' : '#1E2A3E' }]}>{roleLabel(r)}</Text>
                  {role === r && <Check size={16} color="#2E7D32" strokeWidth={2} />}
                </TouchableOpacity>
              ))}
            </View>

            {/* Region */}
            <Section icon={<MapPin size={16} color="#2E7D32" strokeWidth={2} />} label={t.region} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
              {REGIONS.map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => { Haptics.selectionAsync(); setRegion(r); }}
                  style={[s.pill, region === r && { borderColor: '#2E7D32', backgroundColor: '#E8F5E9' }]}
                  accessibilityRole="radio"
                  accessibilityLabel={r}
                  accessibilityState={{ checked: region === r }}
                >
                  <Text style={[s.pillText, { color: region === r ? '#2E7D32' : '#1E2A3E' }]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Crops */}
            <Section icon={<Sprout size={16} color="#2E7D32" strokeWidth={2} />} label={t.crops} />
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
                      on && { borderColor: '#2E7D32', backgroundColor: '#E8F5E9' },
                      disabled && { opacity: 0.35 },
                    ]}
                    accessibilityRole="checkbox"
                    accessibilityLabel={c}
                    accessibilityState={{ checked: on, disabled }}
                  >
                    <Text style={[s.pillText, { color: on ? '#2E7D32' : '#1E2A3E' }]}>{c}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {crops.length === 0 && (
              <View style={[s.errRow, { marginTop: 6 }]}>
                <AlertCircle size={12} color="#F59E0B" strokeWidth={2} />
                <Text style={[s.errText, { color: '#F59E0B' }]}>{t.cropsErr}</Text>
              </View>
            )}

            {/* Farm size */}
            <Section label={t.size} />
            <View style={s.inputWrap}>
              <TextInput
                value={acres}
                onChangeText={setAcres}
                keyboardType="decimal-pad"
                placeholder="2.5"
                placeholderTextColor="#6B7280"
                style={s.input}
                accessibilityLabel={t.size}
              />
            </View>

            {/* Compost */}
            <Section label={t.compost} />
            <View style={s.inputWrap}>
              <TextInput
                value={compost}
                onChangeText={setCompost}
                keyboardType="numeric"
                placeholder="120"
                placeholderTextColor="#6B7280"
                style={s.input}
                accessibilityLabel={t.compost}
              />
            </View>

            {/* Urea */}
            <Section label={t.urea} />
            <View style={s.inputWrap}>
              <TextInput
                value={urea}
                onChangeText={setUrea}
                keyboardType="numeric"
                placeholder="50"
                placeholderTextColor="#6B7280"
                style={s.input}
                accessibilityLabel={t.urea}
              />
            </View>

            {/* Activity */}
            <Section label={t.activity} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['mazao', 'mifugo', 'mchanganyiko'] as const).map((a) => (
                <TouchableOpacity
                  key={a}
                  onPress={() => { Haptics.selectionAsync(); setActivity(a); }}
                  style={[s.actBtn, activity === a && { borderColor: '#2E7D32', backgroundColor: '#E8F5E9' }]}
                  accessibilityRole="radio"
                  accessibilityLabel={(t as any)[a]}
                  accessibilityState={{ checked: activity === a }}
                >
                  <Text style={[s.pillText, { color: activity === a ? '#2E7D32' : '#1E2A3E' }]}>{(t as any)[a]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Toggles */}
            <View style={s.toggleRow}>
              <Text style={s.toggleLabel}>{t.livestock}</Text>
              <Switch
                value={hasLivestock}
                onValueChange={(v) => { Haptics.selectionAsync(); setHasLivestock(v); }}
                trackColor={{ false: '#E5E7EB', true: '#2E7D32' }}
                thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
                accessibilityLabel={t.livestock}
                accessibilityRole="switch"
              />
            </View>
            <View style={s.toggleRow}>
              <Text style={s.toggleLabel}>{t.irrigation}</Text>
              <Switch
                value={hasIrrigation}
                onValueChange={(v) => { Haptics.selectionAsync(); setHasIrrigation(v); }}
                trackColor={{ false: '#E5E7EB', true: '#2E7D32' }}
                thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
                accessibilityLabel={t.irrigation}
                accessibilityRole="switch"
              />
            </View>

            {/* Language */}
            <Section icon={<Globe size={16} color="#2E7D32" strokeWidth={2} />} label={t.language} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['sw', 'en'] as const).map((L) => (
                <TouchableOpacity
                  key={L}
                  onPress={() => { Haptics.selectionAsync(); setLang(L); }}
                  style={[s.actBtn, lang === L && { borderColor: '#2E7D32', backgroundColor: '#E8F5E9' }]}
                  accessibilityRole="radio"
                  accessibilityLabel={L === 'sw' ? 'Kiswahili' : 'English'}
                  accessibilityState={{ checked: lang === L }}
                >
                  <Text style={[s.pillText, { color: lang === L ? '#2E7D32' : '#1E2A3E' }]}>{L === 'sw' ? 'Kiswahili' : 'English'}</Text>
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
              <View style={[s.saveGrad, { backgroundColor: '#2E7D32' }]}>
                <SquarePen size={20} color="#FFFFFF" strokeWidth={2} />
                <Text style={s.saveText}>{t.save}</Text>
              </View>
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
  iconBtn:         { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  headerTitle:     { fontSize: 17, fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.3 },
  dirtyBadge:      { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  dirtyDot:        { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F59E0B' },
  dirtyText:       { color: '#F59E0B', fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  scroll:          { paddingHorizontal: 20, paddingBottom: 40 },
  sub:             { color: '#6B7280', fontSize: 13, fontFamily: 'Inter_500Medium', marginTop: 12, marginBottom: 8, lineHeight: 18 },
  sectionLabel:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 24, marginBottom: 10 },
  sectionLabelText:{ color: '#6B7280', fontSize: 11, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.5, textTransform: 'uppercase' },
  inputWrap:       { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  inputErr:        { borderColor: '#ef4444' },
  input:           { color: '#1E2A3E', fontSize: 16, fontFamily: 'Inter_600SemiBold', paddingHorizontal: 16, paddingVertical: 14 },
  errRow:          { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  errText:         { color: '#ef4444', fontSize: 11, fontFamily: 'Inter_500Medium' },
  pill:            { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  pillText:        { fontSize: 13, fontFamily: 'Inter_700Bold' },
  cropGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cropPill:        { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  actBtn:          { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  rolePill:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  rolePillText:    { fontSize: 13, fontFamily: 'Inter_700Bold', flex: 1 },
  toggleRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginTop: 6 },
  toggleLabel:     { color: '#1E2A3E', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  saveCta:         { borderRadius: 16, overflow: 'hidden' },
  saveGrad:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  saveText:        { color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter_900Black', letterSpacing: 0.3 },
});
