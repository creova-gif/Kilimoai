/**
 * Upgrade Screen — Subscription tier selection
 * Free → Premium → Cooperative
 */
import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, Check, Zap, Star, Building2, Lock } from 'lucide-react-native';
import { useTheme } from '../constants/Theme';
import { useKilimoStore } from '../store/useKilimoStore';

const TIERS = [
  {
    id: 'Free' as const,
    label: 'Free',
    labelSw: 'Bure',
    price: 'TZS 0 / mwezi',
    color: '#64748b',
    icon: <Star size={22} color="#64748b" />,
    features: [
      '3 AI diagnoses / month',
      '5 AI chats / day',
      'Basic market prices',
      'Task management',
      'Weather forecasts',
    ],
    featuresSw: [
      'Utambuzi 3 wa AI / mwezi',
      'Mazungumzo 5 ya AI / siku',
      'Bei za soko za msingi',
      'Usimamizi wa kazi',
      'Utabiri wa hali ya hewa',
    ],
    locked: [],
  },
  {
    id: 'Premium' as const,
    label: 'Premium',
    labelSw: 'Premium',
    price: 'TZS 15,000 / mwezi',
    color: '#22d15a',
    icon: <Zap size={22} color="#22d15a" />,
    badge: 'BORA ZAIDI',
    features: [
      'Unlimited AI diagnoses',
      'Unlimited AI chats',
      'Voice assistant (Swahili + English)',
      'Contract farming',
      'Predictive analytics',
      'Digital Farm Twin',
      'Expert consultations',
      'Offline priority sync',
    ],
    featuresSw: [
      'Utambuzi usio na kikomo wa AI',
      'Mazungumzo yasio na kikomo ya AI',
      'Msaidizi wa sauti (Kiswahili + Kiingereza)',
      'Kilimo cha mikataba',
      'Uchambuzi wa utabiri',
      'Pacha wa Dijiti wa Shamba',
      'Ushauri wa wataalamu',
      'Usawazishaji wa kipaumbele nje ya mtandao',
    ],
    locked: [],
  },
  {
    id: 'Cooperative' as const,
    label: 'Cooperative',
    labelSw: 'Ushirika',
    price: 'TZS 50,000 / mwezi',
    color: '#8b5cf6',
    icon: <Building2 size={22} color="#8b5cf6" />,
    features: [
      'All Premium features',
      'Wallet admin & payouts',
      'Group member management',
      'Agro ID verification',
      'Collective market selling',
      'Priority support',
    ],
    featuresSw: [
      'Vipengele vyote vya Premium',
      'Msimamizi wa mkoba na malipo',
      'Usimamizi wa wanachama wa kikundi',
      'Uthibitishaji wa Agro ID',
      'Uuzaji wa pamoja wa soko',
      'Msaada wa kipaumbele',
    ],
    locked: [],
  },
];

export default function UpgradeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const language = useKilimoStore((s) => s.language);
  const currentTier = useKilimoStore((s) => s.agroId?.tier ?? 'Free');
  const updateAgroId = useKilimoStore((s) => s.updateAgroId);
  const addNotification = useKilimoStore((s) => s.addNotification);
  const isSw = language === 'sw';

  const [selected, setSelected] = useState<'Free' | 'Premium' | 'Cooperative'>(currentTier);

  const handleUpgrade = () => {
    if (selected === currentTier) { router.back(); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateAgroId({ tier: selected });
    addNotification({
      title: isSw ? 'Kiwango Kimebadilishwa' : 'Tier Updated',
      body: isSw
        ? `Umebadilisha kwa ${selected}. Vipengele vipya vinapatikana sasa.`
        : `Switched to ${selected}. New features are now unlocked.`,
      type: 'success',
    });
    router.back();
  };

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['rgba(139,92,246,0.18)', 'transparent']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 0.6 }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
            style={[s.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            accessibilityLabel={isSw ? 'Rudi' : 'Go back'}
          >
            <ChevronLeft size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: colors.text }]}>
            {isSw ? 'Chagua Kiwango' : 'Choose Plan'}
          </Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
          <Text style={[s.subtitle, { color: colors.textMute }]}>
            {isSw
              ? 'Fungua vipengele zaidi vya KILIMO AI kwa kiwango kinachokufaa.'
              : 'Unlock more of KILIMO AI with the plan that fits your farm.'}
          </Text>

          {TIERS.map((tier) => {
            const isSelected = selected === tier.id;
            const isCurrent = currentTier === tier.id;
            const featureList = isSw ? tier.featuresSw : tier.features;

            return (
              <TouchableOpacity
                key={tier.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelected(tier.id);
                }}
                activeOpacity={0.85}
                accessibilityLabel={`${tier.label} plan`}
                style={[
                  s.tierCard,
                  {
                    borderColor: isSelected ? tier.color : colors.border,
                    backgroundColor: isSelected ? tier.color + '10' : colors.card,
                  },
                ]}
              >
                <BlurView intensity={isDark ? 10 : 40} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />

                <View style={s.tierHeader}>
                  <View style={[s.tierIcon, { backgroundColor: tier.color + '18' }]}>
                    {tier.icon}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={s.tierTitleRow}>
                      <Text style={[s.tierLabel, { color: colors.text }]}>{isSw ? tier.labelSw : tier.label}</Text>
                      {isCurrent && (
                        <View style={[s.currentBadge, { backgroundColor: tier.color + '20' }]}>
                          <Text style={[s.currentBadgeText, { color: tier.color }]}>
                            {isSw ? 'SASA' : 'CURRENT'}
                          </Text>
                        </View>
                      )}
                      {(tier as any).badge && !isCurrent && (
                        <View style={[s.currentBadge, { backgroundColor: tier.color + '20' }]}>
                          <Text style={[s.currentBadgeText, { color: tier.color }]}>{(tier as any).badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[s.tierPrice, { color: tier.color }]}>{tier.price}</Text>
                  </View>
                  {isSelected && (
                    <View style={[s.checkCircle, { backgroundColor: tier.color }]}>
                      <Check size={14} color="#fff" />
                    </View>
                  )}
                </View>

                <View style={[s.divider, { backgroundColor: colors.border }]} />

                {featureList.map((f, i) => (
                  <View key={i} style={s.featureRow}>
                    <Check size={14} color={tier.color} />
                    <Text style={[s.featureText, { color: colors.text }]}>{f}</Text>
                  </View>
                ))}
              </TouchableOpacity>
            );
          })}

          <View style={s.noteWrap}>
            <Lock size={13} color={colors.textMute} />
            <Text style={[s.noteText, { color: colors.textMute }]}>
              {isSw
                ? 'Malipo yanashughulikiwa kwa usalama kupitia M-Pesa. Ghairi wakati wowote.'
                : 'Payments processed securely via M-Pesa. Cancel anytime.'}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              s.ctaBtn,
              { backgroundColor: selected === 'Free' ? colors.border : TIERS.find(t => t.id === selected)?.color ?? colors.primary },
            ]}
            onPress={handleUpgrade}
            activeOpacity={0.85}
            accessibilityLabel={isSw ? 'Thibitisha kiwango' : 'Confirm plan'}
          >
            <Text style={[s.ctaText, { color: selected === 'Free' ? colors.textMute : '#fff' }]}>
              {selected === currentTier
                ? (isSw ? 'Endelea na kiwango cha sasa' : 'Continue with current plan')
                : selected === 'Free'
                  ? (isSw ? 'Shuka kwa Bure' : 'Downgrade to Free')
                  : (isSw ? `Pata ${selected}` : `Get ${selected}`)}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root:          { flex: 1 },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 16 : 8, paddingBottom: 12 },
  backBtn:       { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle:   { fontSize: 18, fontFamily: 'Inter_800ExtraBold' },
  scroll:        { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24 },
  subtitle:      { fontSize: 14, fontFamily: 'Inter_500Medium', textAlign: 'center', marginBottom: 24, lineHeight: 21 },
  tierCard:      { borderRadius: 20, borderWidth: 1.5, padding: 18, marginBottom: 16, overflow: 'hidden' },
  tierHeader:    { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  tierIcon:      { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tierTitleRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' },
  tierLabel:     { fontSize: 18, fontFamily: 'Inter_800ExtraBold' },
  tierPrice:     { fontSize: 13, fontFamily: 'Inter_700Bold' },
  currentBadge:  { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  currentBadgeText: { fontSize: 9, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: 1 },
  checkCircle:   { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  divider:       { height: StyleSheet.hairlineWidth, marginBottom: 12 },
  featureRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  featureText:   { fontSize: 13, fontFamily: 'Inter_500Medium', flex: 1 },
  noteWrap:      { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20, paddingHorizontal: 8 },
  noteText:      { fontSize: 12, fontFamily: 'Inter_500Medium', flex: 1, lineHeight: 18 },
  ctaBtn:        { borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 8 },
  ctaText:       { fontSize: 16, fontFamily: 'Inter_800ExtraBold' },
});
