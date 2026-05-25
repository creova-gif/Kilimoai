/**
 * NEXUS — Identity & Settings hub
 * Premium redesign: cinematic Agro ID card + clean settings hierarchy
 */
import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  Dimensions, SafeAreaView, StatusBar, Image, Switch, Platform, Alert,
} from 'react-native';
import {
  Settings, ShieldCheck, CreditCard, Bell, HelpCircle, LogOut,
  ChevronRight, Database, Fingerprint, WifiOff, CloudSun, Wallet,
  Edit3, MapPin, Leaf, Star,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../constants/Theme';
import { motion } from 'motion/react';
import { useKilimoStore } from '../../store/useKilimoStore';
import { roleLabel } from '../../lib/access';

const { width: SW, height: SH } = Dimensions.get('window');

const AGRO_ID_FALLBACK = {
  name: 'Justin Mafie',
  role: 'farmer' as const,
  location: 'Arusha',
  id: 'KILIMO-8492-XJ',
  tier: 'Free',
  joinDate: '2024',
};

const enterAnim = { type: 'spring', damping: 26, stiffness: 170 } as const;

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const storedAgroId  = useKilimoStore((s) => s.agroId);
  const farmProfile   = useKilimoStore((s) => s.farmProfile);
  const isOffline     = useKilimoStore((s) => s.isOffline);
  const setOffline    = useKilimoStore((s) => s.setOffline);
  const resetOnboarding = useKilimoStore((s) => s.resetOnboarding);
  const unreadCount   = useKilimoStore((s) => s.unreadCount);

  const [biometric,       setBiometric]       = useState(true);
  const [pushNotifs,      setPushNotifs]       = useState(true);
  const [weatherTelemetry,setWeatherTelemetry] = useState(true);

  const D = storedAgroId ?? AGRO_ID_FALLBACK;
  const role = (D.role ?? 'farmer') as any;
  const cropCount = farmProfile?.primaryCrops?.length ?? 0;

  // ─────────────────────────────────────────
  const SECTIONS = [
    {
      title: 'AGRO ID & FEDHA',
      items: [
        { id: 'wallet',   label: 'M-Pesa Wallet Sync',  icon: <Wallet size={18} color="#10b981" />,    icolor: '#10b981', isSwitch: false, value: 'Linked',      onPress: () => router.push('/wallet-admin' as any) },
        { id: 'identity', label: 'Biometric Identity',   icon: <Fingerprint size={18} color="#3b82f6" />, icolor: '#3b82f6', isSwitch: true,  switchVal: biometric, onSwitch: (v: boolean) => { setBiometric(v); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } },
        { id: 'coop',     label: 'Cooperative Dues',     icon: <CreditCard size={18} color="#f59e0b" />, icolor: '#f59e0b', isSwitch: false, value: 'Up to date', onPress: () => router.push('/wallet-admin' as any) },
      ],
    },
    {
      title: 'MIFUMO & MTANDAO',
      items: [
        { id: 'offline', label: 'Offline-First Mode',    icon: <WifiOff size={18} color="#ef4444" />,   icolor: '#ef4444', isSwitch: true,  switchVal: isOffline,       onSwitch: (v: boolean) => { setOffline(v); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } },
        { id: 'sync',    label: 'Local Cache Sync',       icon: <Database size={18} color="#8b5cf6" />, icolor: '#8b5cf6', isSwitch: false, value: 'Synced 2h ago', onPress: () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); Alert.alert('Sync', 'Data yako imesawazishwa kikamilifu.'); } },
        { id: 'weather', label: 'Weather Telemetry',      icon: <CloudSun size={18} color="#0ea5e9" />, icolor: '#0ea5e9', isSwitch: true,  switchVal: weatherTelemetry, onSwitch: (v: boolean) => { setWeatherTelemetry(v); router.push('/(tabs)/forecast' as any); } },
      ],
    },
    {
      title: 'MIPANGILIO YA AKAUNTI',
      items: [
        { id: 'notifications', label: 'Push Notifications',  icon: <Bell size={18} color="#f59e0b" />,       icolor: '#f59e0b', isSwitch: true, switchVal: pushNotifs, onSwitch: (v: boolean) => { setPushNotifs(v); router.push('/notifications' as any); } },
        { id: 'security',      label: 'Security & Privacy',  icon: <ShieldCheck size={18} color="#3b82f6" />, icolor: '#3b82f6', isSwitch: false, value: '', onPress: () => router.push('/privacy' as any) },
        { id: 'help',          label: 'Help & Support',      icon: <HelpCircle size={18} color="#64748b" />, icolor: '#64748b', isSwitch: false, value: '', onPress: () => router.push('/terms' as any) },
      ],
    },
  ];

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ── Ambient orbs ── */}
      <View style={[s.orb1, { backgroundColor: '#3ecf8e12' }]} />
      <View style={[s.orb2, { backgroundColor: '#3b82f610' }]} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

          {/* ── Header row ── */}
          <motion.View
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={enterAnim}
            style={s.headerRow}
          >
            <Text style={[s.screenTitle, { color: colors.text }]}>Kilimo AI</Text>
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/edit-profile' as any); }}
              style={[s.editBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Edit3 size={16} color={colors.text} />
              <Text style={[s.editBtnText, { color: colors.text }]}>Hariri</Text>
            </TouchableOpacity>
          </motion.View>

          {/* ── Agro ID card ── */}
          <motion.View
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...enterAnim, delay: 0.05 }}
            style={s.cardWrap}
          >
            <LinearGradient
              colors={isDark
                ? ['#052e16', '#0d1117', '#1e1b4b']
                : ['#f0fdf4', '#eff6ff', '#f8fafc']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[s.idCard, { borderColor: isDark ? 'rgba(62,207,142,0.18)' : 'rgba(62,207,142,0.25)' }]}
            >
              {/* Subtle grid lines for depth */}
              <View style={s.gridLines} pointerEvents="none">
                {[0,1,2,3].map(i => (
                  <View key={i} style={[s.gridLine, { top: i * 32, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }]} />
                ))}
              </View>

              {/* Top row: badge + ID number */}
              <View style={s.idTopRow}>
                <View style={s.agroIdBadge}>
                  <Fingerprint size={11} color="#3ecf8e" />
                  <Text style={s.agroIdBadgeText}>AGRO ID</Text>
                </View>
                <Text style={[s.idNumber, { color: colors.textMute }]}>{D.id}</Text>
              </View>

              {/* Avatar + name block */}
              <View style={s.avatarRow}>
                <View style={s.avatarWrap}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' }}
                    style={s.avatar}
                  />
                  <View style={[s.avatarRing, { borderColor: '#3ecf8e60' }]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.userName, { color: colors.text }]}>{D.name}</Text>
                  <Text style={[s.userRole, { color: '#3ecf8e' }]}>{roleLabel(role)}</Text>
                  <View style={s.locationRow}>
                    <MapPin size={11} color={colors.textMute} />
                    <Text style={[s.locationText, { color: colors.textMute }]}>{D.location}</Text>
                  </View>
                </View>
              </View>

              {/* Stats strip */}
              <View style={[s.statsStrip, { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]}>
                <View style={s.statItem}>
                  <Leaf size={14} color="#3ecf8e" />
                  <Text style={[s.statVal, { color: colors.text }]}>{cropCount || 3}</Text>
                  <Text style={[s.statLbl, { color: colors.textMute }]}>Mazao</Text>
                </View>
                <View style={[s.statDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }]} />
                <View style={s.statItem}>
                  <Star size={14} color="#f59e0b" />
                  <Text style={[s.statVal, { color: colors.text }]}>{D.tier}</Text>
                  <Text style={[s.statLbl, { color: colors.textMute }]}>Kiwango</Text>
                </View>
                <View style={[s.statDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }]} />
                <View style={s.statItem}>
                  <Text style={[s.statVal, { color: colors.text }]}>{D.joinDate}</Text>
                  <Text style={[s.statLbl, { color: colors.textMute }]}>Mwaka</Text>
                </View>
              </View>
            </LinearGradient>
          </motion.View>

          {/* ── Settings sections ── */}
          {SECTIONS.map((sec, si) => (
            <motion.View
              key={sec.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...enterAnim, delay: 0.1 + si * 0.06 }}
              style={s.section}
            >
              <Text style={[s.secLabel, { color: colors.textMute }]}>{sec.title}</Text>
              <BlurView
                intensity={isDark ? 18 : 55}
                tint={isDark ? 'dark' : 'light'}
                style={[s.secCard, { borderColor: colors.border }]}
              >
                {sec.items.map((item, ii) => (
                  <View key={item.id}>
                    <TouchableOpacity
                      activeOpacity={item.isSwitch ? 1 : 0.72}
                      onPress={() => { if (!item.isSwitch && (item as any).onPress) { Haptics.selectionAsync(); (item as any).onPress(); } }}
                      style={s.itemRow}
                    >
                      <View style={[s.itemIcon, { backgroundColor: (item as any).icolor + '18' }]}>
                        {item.icon}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[s.itemLabel, { color: colors.text }]}>{item.label}</Text>
                        {!item.isSwitch && (item as any).value ? (
                          <Text style={[s.itemValue, { color: colors.textMute }]}>{(item as any).value}</Text>
                        ) : null}
                      </View>
                      {item.isSwitch ? (
                        <Switch
                          value={(item as any).switchVal}
                          trackColor={{ false: colors.border, true: '#3ecf8e' }}
                          thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
                          onValueChange={(item as any).onSwitch}
                        />
                      ) : (
                        <ChevronRight size={17} color={colors.textMute} />
                      )}
                    </TouchableOpacity>
                    {ii < sec.items.length - 1 && (
                      <View style={[s.divider, { backgroundColor: colors.border, marginLeft: 68 }]} />
                    )}
                  </View>
                ))}
              </BlurView>
            </motion.View>
          ))}

          {/* ── Logout ── */}
          <motion.View
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...enterAnim, delay: 0.35 }}
            style={{ marginTop: 8, marginBottom: 8 }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                Alert.alert(
                  'Ondoka',
                  'Una uhakika unataka kutoka? Utahitaji kuingia tena.',
                  [
                    { text: 'Ghairi', style: 'cancel' },
                    { text: 'Ondoka', style: 'destructive', onPress: () => { resetOnboarding(); router.replace('/onboarding' as any); } },
                  ]
                );
              }}
              style={s.logoutBtn}
            >
              <LogOut size={18} color="#ef4444" />
              <Text style={s.logoutText}>Ondoka (Log Out)</Text>
            </TouchableOpacity>
          </motion.View>

          <View style={{ height: 110 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1 },
  orb1:        { position: 'absolute', width: 420, height: 420, borderRadius: 210, top: -100, right: -100 },
  orb2:        { position: 'absolute', width: 320, height: 320, borderRadius: 160, bottom: 80, left: -100 },
  scroll:      { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 4 : 12, paddingBottom: 40 },

  headerRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  screenTitle: { fontSize: 30, fontFamily: 'Inter_900Black', letterSpacing: -1 },
  editBtn:     { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  editBtnText: { fontSize: 13, fontFamily: 'Inter_700Bold' },

  // ID Card
  cardWrap:    { marginBottom: 28 },
  idCard:      { borderRadius: 28, borderWidth: 1, padding: 20, overflow: 'hidden', position: 'relative' },
  gridLines:   { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  gridLine:    { position: 'absolute', left: 0, right: 0, height: 1 },

  idTopRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  agroIdBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(62,207,142,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  agroIdBadgeText: { color: '#3ecf8e', fontSize: 10, fontFamily: 'Inter_900Black', letterSpacing: 1 },
  idNumber:    { fontSize: 11, fontFamily: 'Inter_600SemiBold', letterSpacing: 2 },

  avatarRow:   { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatarWrap:  { position: 'relative' },
  avatar:      { width: 68, height: 68, borderRadius: 22 },
  avatarRing:  { position: 'absolute', top: -3, left: -3, right: -3, bottom: -3, borderRadius: 25, borderWidth: 2 },
  userName:    { fontSize: 22, fontFamily: 'Inter_900Black', letterSpacing: -0.5, marginBottom: 3 },
  userRole:    { fontSize: 13, fontFamily: 'Inter_700Bold', marginBottom: 5, textTransform: 'capitalize' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText:{ fontSize: 12, fontFamily: 'Inter_500Medium' },

  statsStrip:  { flexDirection: 'row', alignItems: 'center', paddingTop: 16, borderTopWidth: 1 },
  statItem:    { flex: 1, alignItems: 'center', gap: 2 },
  statDivider: { width: 1, height: 32, borderRadius: 1 },
  statVal:     { fontSize: 14, fontFamily: 'Inter_800ExtraBold' },
  statLbl:     { fontSize: 10, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.5 },

  // Sections
  section:     { marginBottom: 22 },
  secLabel:    { fontSize: 11, fontFamily: 'Inter_900Black', letterSpacing: 1.5, marginBottom: 10, marginLeft: 4 },
  secCard:     { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  itemRow:     { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14 },
  itemIcon:    { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  itemLabel:   { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  itemValue:   { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 2 },
  divider:     { height: StyleSheet.hairlineWidth },

  logoutBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 18, backgroundColor: 'rgba(239,68,68,0.08)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.15)', gap: 8 },
  logoutText:  { color: '#ef4444', fontSize: 14, fontFamily: 'Inter_800ExtraBold' },
});
