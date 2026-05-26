import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  SafeAreaView,
  StatusBar,
  Image,
  Switch,
  Platform
} from 'react-native';
import { 
  Settings, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Database,
  Fingerprint,
  WifiOff,
  ArrowUpRight
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme, PALETTE, RADIUS, SPACE, SHADOW } from '../../constants/Theme';
import Animated, { FadeIn, FadeOut, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useKilimoStore } from '../../store/useKilimoStore';
import { Alert } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');



const AGRO_ID_FALLBACK = {
  name: 'Justin Mafie',
  role: 'Mkulima Mkuu',
  location: 'Arusha, Tanzania',
  id: 'KILIMO-8492-XJ',
  tier: 'Premium Co-op Member',
  joinDate: '2023',
};

// Routes for the PRD-mandated Quick Access shortcuts (rendered below the ID card).
const QUICK_ROUTES: { key: string; label: string; sub: string; route: string; color: string }[] = [
  { key: 'contracts', label: 'Mikataba', sub: 'Contract Farming', route: '/contracts', color: '#3b82f6' },
  { key: 'livestock', label: 'Mifugo', sub: 'Livestock', route: '/livestock', color: '#f59e0b' },
  { key: 'inventory', label: 'Pembejeo', sub: 'Inventory', route: '/inventory', color: '#8b5cf6' },
  { key: 'insurance', label: 'Bima', sub: 'Insurance Hub', route: '/insurance', color: '#0ea5e9' },
  { key: 'input', label: 'Wauzaji', sub: 'Input Supply', route: '/input-supply', color: '#10b981' },
  { key: 'peer', label: 'Vikundi', sub: 'Peer Groups', route: '/peer-groups', color: '#ec4899' },
  { key: 'expert', label: 'Wataalamu', sub: 'Consultations', route: '/consultations', color: '#a855f7' },
  { key: 'farm-twin', label: 'Shamba Dijiti', sub: 'Digital Farm Twin', route: '/farm-twin', color: '#6366f1' },
  { key: 'analytics', label: 'Uchanganuzi wa AI', sub: 'Predictive Analytics', route: '/analytics', color: '#f97316' },
  { key: 'crop-plan', label: 'Upangaji Mazao', sub: 'Crop Planning · AI', route: '/crop-planning', color: '#22c55e' },
];

// Sections built inside component to access router + store actions



export default function ProfileScreen() {
  const { colors, spacing, radius, isDark } = useTheme();
  const router = useRouter();
  const storedAgroId = useKilimoStore((s) => s.agroId);
  const isOffline = useKilimoStore((s) => s.isOffline);
  const setOffline = useKilimoStore((s) => s.setOffline);
  const resetOnboarding = useKilimoStore((s) => s.resetOnboarding);
  const [biometric, setBiometric] = useState(true);
  const AGRO_ID_DATA = storedAgroId ?? AGRO_ID_FALLBACK;

  const PROFILE_SECTIONS = [
    {
      title: 'AGRO ID & USALAMA',
      items: [
        { id: 'identity', title: 'Biometric Identity', icon: <Fingerprint size={20} color="#3b82f6" />, hasSwitch: true, switchVal: biometric, onSwitch: (v: boolean) => { setBiometric(v); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }, value: '' },
        { id: 'security', title: 'Security & Privacy', icon: <ShieldCheck size={20} color="#64748b" />, hasSwitch: false, value: '', onPress: () => router.push('/privacy' as any) },
      ]
    },
    {
      title: 'MIFUMO & MTANDAO',
      items: [
        { id: 'offline', title: 'Offline-First Mode', icon: <WifiOff size={20} color="#ef4444" />, hasSwitch: true, switchVal: isOffline, onSwitch: (v: boolean) => { setOffline(v); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }, value: '' },
        { id: 'sync', title: 'Local Cache Sync', icon: <Database size={20} color="#8b5cf6" />, hasSwitch: false, value: 'Last sync: 2h ago', onPress: () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); Alert.alert('Sync', 'Data yako imesawazishwa kikamilifu.'); } },
      ]
    },
    {
      title: 'MSAADA & VIGEZO',
      items: [
        { id: 'help', title: 'Help & Support', icon: <HelpCircle size={20} color="#64748b" />, hasSwitch: false, value: '', onPress: () => router.push('/terms' as any) },
      ]
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Cinematic Background */}
      <View style={StyleSheet.absoluteFill}>
        
        
        
        <LinearGradient
          colors={[
            isDark ? colors.slate[950] : '#f8fafc',
            isDark ? colors.slate[900] + 'ee' : colors.slate[50] + 'ee',
            'transparent'
          ]}
          style={styles.bgGradient}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View>
            {/* Header */}
            <Animated.View style={styles.header}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Identity</Text>
              <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/edit-profile' as any); }}
              accessibilityRole="button"
              accessibilityLabel="Edit profile settings"
            >
                <Settings size={24} color={colors.text} />
              </TouchableOpacity>
            </Animated.View>

            {/* Agro ID Card */}
            <Animated.View style={styles.idCardContainer}>
              <TouchableOpacity
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/agro-id' as any); }}
                activeOpacity={0.92}
                accessibilityRole="button"
                accessibilityLabel="Open Agro ID dashboard"
              >
                <LinearGradient
                  colors={[PALETTE.greenInk, '#0F3C14']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.idCard}
                >
                  <View style={styles.idHeader}>
                    <View style={[styles.idBadge, { backgroundColor: 'rgba(255, 255, 255, 0.12)' }]}>
                      <Fingerprint size={12} color="#FFFFFF" />
                      <Text style={[styles.idBadgeText, { color: '#FFFFFF' }]}>AGRO ID</Text>
                    </View>
                    <Text style={[styles.idNumber, { color: 'rgba(255, 255, 255, 0.55)' }]}>{AGRO_ID_DATA.id}</Text>
                  </View>

                  <View style={styles.profileRow}>
                    <View style={[styles.profileImage, { borderColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.12)' }]}>
                      <Text style={{ color: '#FFFFFF', fontSize: 24, fontFamily: 'Inter_900Black' }}>
                        {AGRO_ID_DATA.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                      </Text>
                    </View>
                    <View style={styles.profileInfo}>
                      <Text style={[styles.profileName, { color: '#FFFFFF' }]}>{AGRO_ID_DATA.name}</Text>
                      <Text style={[styles.profileRole, { color: 'rgba(255, 255, 255, 0.65)' }]}>{AGRO_ID_DATA.role}</Text>
                      <Text style={[styles.profileLocation, { color: 'rgba(255, 255, 255, 0.45)' }]}>{AGRO_ID_DATA.location}</Text>
                    </View>
                  </View>

                  <View style={styles.tierContainer}>
                    <Text style={[styles.tierText, { color: '#FFFFFF' }]}>{AGRO_ID_DATA.tier}</Text>
                    <Text style={[styles.joinText, { color: 'rgba(255, 255, 255, 0.45)' }]}>Member since {AGRO_ID_DATA.joinDate}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Quick Access — all PRD feature routes */}
            <View style={styles.quickContainer}>
              <Text style={[styles.sectionTitle, { color: colors.textMute }]}>UFIKIAJI WA HARAKA</Text>
              <View style={styles.quickGrid}>
                {QUICK_ROUTES.map((q) => (
                  <TouchableOpacity
                    key={q.key}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(q.route as any); }}
                    activeOpacity={0.85}
                    style={styles.quickItem}
                    accessibilityRole="button"
                    accessibilityLabel={q.label}
                    accessibilityHint={`Open ${q.sub}`}
                  >
                    <View style={[styles.quickCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
                      <View style={[styles.quickDot, { backgroundColor: q.color + '15' }]}>
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: q.color }} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.quickLabel, { color: colors.text }]}>{q.label}</Text>
                        <Text style={[styles.quickSub, { color: colors.textMute }]}>{q.sub}</Text>
                      </View>
                      <ArrowUpRight size={14} color={colors.textMute} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sections */}
            {PROFILE_SECTIONS.map((section, sIdx) => (
              <View key={sIdx} style={styles.sectionContainer}>
                <Text style={[styles.sectionTitle, { color: colors.textMute }]}>{section.title}</Text>
                
                <View style={[styles.sectionBlock, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  {section.items.map((item, iIdx) => (
                    <View key={item.id}>
                      <TouchableOpacity 
                        activeOpacity={item.hasSwitch ? 1 : 0.7}
                        onPress={() => { if (!item.hasSwitch && (item as any).onPress) { Haptics.selectionAsync(); (item as any).onPress(); } }}
                        style={styles.itemRow}
                        accessibilityRole={item.hasSwitch ? 'none' : 'button'}
                        accessibilityLabel={item.title}
                        accessibilityHint={!item.hasSwitch && item.value ? item.value : undefined}
                      >
                        <View style={[styles.itemIconBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                          {item.icon}
                        </View>
                        <View style={styles.itemContent}>
                          <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                          {!item.hasSwitch && item.value ? (
                            <Text style={[styles.itemValue, { color: colors.textMute }]}>{item.value}</Text>
                          ) : null}
                        </View>
                        
                        {item.hasSwitch ? (
                          <Switch 
                            value={(item as any).switchVal as boolean}
                            trackColor={{ false: isDark ? '#1C241E' : '#E6DFD5', true: colors.primary }}
                            thumbColor="#fff"
                            onValueChange={(v) => (item as any).onSwitch?.(v)}
                            accessibilityLabel={item.title}
                            accessibilityRole="switch"
                            accessibilityState={{ checked: (item as any).switchVal as boolean }}
                          />
                        ) : (
                          <ChevronRight size={20} color={colors.textMute} />
                        )}
                      </TouchableOpacity>
                      
                      {iIdx < section.items.length - 1 && (
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ))}

            {/* Logout */}
            <View>
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
                style={styles.logoutBtn}
                accessibilityRole="button"
                accessibilityLabel="Log out"
                accessibilityHint="Signs you out and returns to the login screen"
              >
                <LogOut size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Ondoka (Log Out)</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const quickStyles = {
  quickContainer: { marginTop: 24 },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickItem: {
    width: '48%',
  },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    backgroundColor: PALETTE.white,
    ...SHADOW.sm,
  },
  quickDot: { width: 28, height: 28, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  quickLabel: { fontSize: 14, fontFamily: 'Inter_800ExtraBold' },
  quickSub: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 2 },
} as const;

const styles = StyleSheet.create({
  ...quickStyles,
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  bgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter_900Black',
    letterSpacing: -1,
  },
  idCardContainer: {
    marginBottom: 32,
  },
  idCard: {
    borderRadius: 32,
    padding: 24,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  idHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(62, 207, 142, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  idBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1,
  },
  idNumber: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 24,
    borderWidth: 2,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  profileLocation: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    opacity: 0.7,
  },
  tierContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  tierText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  joinText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 8,
  },
  sectionBlock: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  itemIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  itemValue: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 72,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: 'transparent',
    gap: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 15,
    fontFamily: 'Inter_800ExtraBold',
  },
});
