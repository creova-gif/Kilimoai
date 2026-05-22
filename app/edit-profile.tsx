/**
 * AUTH-08 — Editable farm profile. Updates flow into AI recommendation context
 * immediately because the dashboard reads farmProfile/agroId from the same store.
 */
import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Switch,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Save, User, Sprout, Globe } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useKilimoStore, FarmProfile, AppLanguage } from '../store/useKilimoStore';
import { allRoles, roleLabel, CanonicalRole, normalizeRole } from '../lib/access';

const REGIONS = ['Arusha', 'Dodoma', 'Mbeya', 'Kilimanjaro', 'Morogoro', 'Iringa', 'Mwanza', 'Tanga', 'Pwani', 'Singida', 'Tabora'];
const CROPS = ['Mahindi', 'Maharage', 'Mpunga', 'Kahawa', 'Pamba', 'Alizeti', 'Mihogo', 'Viazi', 'Nyanya', 'Vitunguu', 'Karanga', 'Ndizi'];

export default function EditProfileScreen() {
  const router = useRouter();
  const agroId = useKilimoStore((s) => s.agroId);
  const updateAgroId = useKilimoStore((s) => s.updateAgroId);
  const farmProfile = useKilimoStore((s) => s.farmProfile);
  const setFarmProfile = useKilimoStore((s) => s.setFarmProfile);
  const language = useKilimoStore((s) => s.language);
  const setLanguage = useKilimoStore((s) => s.setLanguage);

  const [name, setName] = useState(agroId?.name ?? '');
  const [role, setRole] = useState<CanonicalRole>(normalizeRole(agroId?.role));
  const [region, setRegion] = useState(farmProfile?.region ?? 'Arusha');
  const [crops, setCrops] = useState<string[]>(farmProfile?.primaryCrops ?? []);
  const [acres, setAcres] = useState(String(farmProfile?.farmSizeAcres ?? '2'));
  const [activity, setActivity] = useState<FarmProfile['mainActivity']>(farmProfile?.mainActivity ?? 'mazao');
  const [hasLivestock, setHasLivestock] = useState(farmProfile?.hasLivestock ?? false);
  const [hasIrrigation, setHasIrrigation] = useState(farmProfile?.hasIrrigation ?? false);
  const [lang, setLang] = useState<AppLanguage>(language);

  function toggleCrop(c: string) {
    Haptics.selectionAsync();
    setCrops((p) => p.includes(c) ? p.filter((x) => x !== c) : (p.length < 6 ? [...p, c] : p));
  }

  function save() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateAgroId({ name: name.trim() || agroId?.name || 'Mkulima', role, location: region });
    setFarmProfile({
      primaryCrops: crops,
      region,
      farmSizeAcres: parseFloat(acres) || 0,
      mainActivity: activity,
      hasLivestock,
      hasIrrigation,
    });
    setLanguage(lang);
    router.back();
  }

  const t = lang === 'sw' ? {
    title: 'Hariri Wasifu wa Shamba', sub: 'Mabadiliko huboresha mapendekezo ya AI papo hapo',
    name: 'Jina kamili', role: 'Wajibu', region: 'Mkoa', crops: 'Mazao makuu',
    size: 'Ukubwa wa shamba (ekari)', activity: 'Shughuli kuu',
    mazao: 'Mazao', mifugo: 'Mifugo', mchanganyiko: 'Mchanganyiko',
    livestock: 'Una mifugo?', irrigation: 'Una umwagiliaji?', language: 'Lugha ya programu',
    save: 'Hifadhi Mabadiliko',
  } : {
    title: 'Edit Farm Profile', sub: 'Changes refine your AI recommendations immediately',
    name: 'Full name', role: 'Role', region: 'Region', crops: 'Primary crops',
    size: 'Farm size (acres)', activity: 'Main activity',
    mazao: 'Crops', mifugo: 'Livestock', mchanganyiko: 'Mixed',
    livestock: 'Raise livestock?', irrigation: 'Have irrigation?', language: 'App language',
    save: 'Save Changes',
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#022c22', '#0a0a0f', '#1e1b4b']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.iconBtn}>
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{t.title}</Text>
          <TouchableOpacity onPress={save} style={s.iconBtn}>
            <Save size={20} color="#3ecf8e" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
            <Text style={s.sub}>{t.sub}</Text>

            <Section icon={<User size={16} color="#3ecf8e" />} label={t.name} />
            <BlurView intensity={20} tint="dark" style={s.inputWrap}>
              <TextInput value={name} onChangeText={setName} placeholderTextColor="rgba(255,255,255,0.4)" style={s.input} />
            </BlurView>

            <Section icon={<User size={16} color="#8b5cf6" />} label={t.role} />
            <View style={{ gap: 6 }}>
              {allRoles().map((r) => (
                <TouchableOpacity key={r} onPress={() => { Haptics.selectionAsync(); setRole(r); }} style={[s.rolePill, role === r && { borderColor: '#3ecf8e', backgroundColor: 'rgba(62,207,142,0.12)' }]}>
                  <Text style={[s.rolePillText, role === r && { color: '#3ecf8e' }]}>{roleLabel(r)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Section icon={<MapPin size={16} color="#3b82f6" />} label={t.region} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
              {REGIONS.map((r) => (
                <TouchableOpacity key={r} onPress={() => { Haptics.selectionAsync(); setRegion(r); }} style={[s.pill, region === r && { borderColor: '#3ecf8e', backgroundColor: 'rgba(62,207,142,0.18)' }]}>
                  <Text style={[s.pillText, region === r && { color: '#3ecf8e' }]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Section icon={<Sprout size={16} color="#10b981" />} label={t.crops} />
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

            <Section label={t.size} />
            <BlurView intensity={20} tint="dark" style={s.inputWrap}>
              <TextInput value={acres} onChangeText={setAcres} keyboardType="decimal-pad" placeholderTextColor="rgba(255,255,255,0.4)" style={s.input} />
            </BlurView>

            <Section label={t.activity} />
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

            <Section icon={<Globe size={16} color="#f59e0b" />} label={t.language} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['sw', 'en'] as const).map((L) => (
                <TouchableOpacity key={L} onPress={() => { Haptics.selectionAsync(); setLang(L); }} style={[s.actBtn, lang === L && { borderColor: '#3ecf8e', backgroundColor: 'rgba(62,207,142,0.18)' }]}>
                  <Text style={[s.pillText, lang === L && { color: '#3ecf8e' }]}>{L === 'sw' ? 'Kiswahili' : 'English'}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={save} activeOpacity={0.85} style={{ marginTop: 32, borderRadius: 16, overflow: 'hidden' }}>
              <LinearGradient colors={['#3ecf8e', '#10b981']} style={s.saveBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Save size={20} color="#000" />
                <Text style={s.saveText}>{t.save}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
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
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 17, fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.3 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  sub: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'Inter_500Medium', marginBottom: 8, lineHeight: 18 },
  sectionLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 22, marginBottom: 10 },
  sectionLabelText: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.5, textTransform: 'uppercase' },
  inputWrap: { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  input: { color: '#fff', fontSize: 16, fontFamily: 'Inter_600SemiBold', paddingHorizontal: 16, paddingVertical: 14 },
  pill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  pillText: { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontFamily: 'Inter_700Bold' },
  cropGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cropPill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  actBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center' },
  rolePill: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  rolePillText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: 'Inter_700Bold' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)', marginTop: 6 },
  toggleLabel: { color: '#fff', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  saveText: { color: '#000', fontSize: 16, fontFamily: 'Inter_900Black', letterSpacing: 0.3 },
});
