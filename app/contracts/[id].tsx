/**
 * Contract Detail — Nogyo-inspired redesign
 * Crop photo hero · track records timeline · contract conditions panel
 */
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView,
  ImageBackground, StatusBar, Dimensions, SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  CheckCircle2, Circle, ArrowRight, X, PenLine, Banknote,
  ChevronLeft, QrCode, MapPin, TrendingUp, User, Handshake,
  Calendar, Package,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../constants/Theme';
import {
  useContractsStore, STATUS_LABEL, STATUS_COLOR, nextStatuses, ContractStatus,
} from '../../store/useContractsStore';
import { useKilimoStore } from '../../store/useKilimoStore';
import { Gate } from '../../lib/access';

const { height: SH } = Dimensions.get('window');
const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);
const HERO_H = Math.min(310, SH * 0.36);

// Crop → verified Unsplash photo IDs (same source as crop-library.tsx)
const CROP_HERO_ID: Record<string, string> = {
  Maize:     '1601593346740-925612772716',
  Mahindi:   '1601593346740-925612772716',
  Rice:      '1536304929831-ee1ca9d44906',
  Mpunga:    '1536304929831-ee1ca9d44906',
  Coffee:    '1447933601403-0c6688de566e',
  Kahawa:    '1447933601403-0c6688de566e',
  Sunflower: '1490750967868-88df5691cc0e',
  Alizeti:   '1490750967868-88df5691cc0e',
  Tomatoes:  '1546470427-f5b4dd577b86',
  Nyanya:    '1546470427-f5b4dd577b86',
  Potatoes:  '1518977876801-8c2b56d2b4d7',
  Viazi:     '1518977876801-8c2b56d2b4d7',
  Wheat:     '1500382017468-9049fed747ef',
  Ngano:     '1500382017468-9049fed747ef',
  Beans:     '1559181567-c3190ca9d062',
  Maharage:  '1559181567-c3190ca9d062',
};
function getCropHeroUri(crop: string): string {
  const id = CROP_HERO_ID[crop] ?? '1464226184884-fa280b87c399';
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=800`;
}

const LIFECYCLE: ContractStatus[] = [
  'draft', 'sent', 'under_review', 'signed', 'active', 'milestone_due', 'completed',
];

// ─── Sub-components ────────────────────────────────────────────────────────────
function SectionTitle({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <View style={ST.row}>
      <View style={ST.accent} />
      <Text style={[ST.label, { color: colors.textMute }]}>{label.toUpperCase()}</Text>
    </View>
  );
}
const ST = StyleSheet.create({
  row:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 28, marginBottom: 12 },
  accent: { width: 3, height: 14, borderRadius: 2, backgroundColor: '#22d15a' },
  label:  { fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.5 },
});

function DetailRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={DR.row}>
      <Text style={[DR.label, { color: colors.textMute }]}>{label}</Text>
      <Text style={[DR.value, { color: accent ? '#22d15a' : colors.text }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
const DR = StyleSheet.create({
  row:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 16 },
  label: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  value: { fontSize: 13, fontFamily: 'Inter_800ExtraBold', maxWidth: '58%', textAlign: 'right' },
});

function SignatureRow({ label, when, colors, isDark }: { label: string; when?: string; colors: any; isDark: boolean }) {
  return (
    <View style={[DR.row]}>
      <Text style={[DR.label, { color: colors.textMute }]}>{label}</Text>
      {when ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <CheckCircle2 size={14} color="#22d15a" />
          <Text style={{ fontSize: 12, fontFamily: 'Inter_800ExtraBold', color: '#22d15a' }}>
            {new Date(when).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </Text>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Circle size={14} color={colors.textMute} />
          <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: colors.textMute }}>Inasubiri</Text>
        </View>
      )}
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function ContractDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const language = useKilimoStore((s) => s.language);
  const contract = useContractsStore((s) => s.contracts.find((c) => c.id === id));
  const advance = useContractsStore((s) => s.advance);
  const signAsFarmer = useContractsStore((s) => s.signAsFarmer);
  const signAsBuyer = useContractsStore((s) => s.signAsBuyer);
  const markMilestonePaid = useContractsStore((s) => s.markMilestonePaid);
  const addNotification = useKilimoStore((s) => s.addNotification);

  if (!contract) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Handshake size={40} color={colors.textMute} />
        <Text style={{ color: colors.textMute, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>
          Mkataba haupatikani
        </Text>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/contracts')}
          style={{ backgroundColor: '#22d15a20', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 }}
        >
          <Text style={{ color: '#22d15a', fontFamily: 'Inter_700Bold' }}>Rudi Nyuma</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const total = contract.quantityKg * contract.pricePerKgTZS;
  const paidAmount = contract.milestones.filter((m) => m.paid).reduce((s, m) => s + m.amountTZS, 0);
  const transitions = nextStatuses(contract.status);
  const statusColor = STATUS_COLOR[contract.status] as string;
  const currentIdx = LIFECYCLE.indexOf(contract.status);
  const isDestructive = (t: ContractStatus) => t === 'cancelled' || t === 'disputed';
  const sw = language === 'sw';

  function handleAdvance(to: ContractStatus) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const r = advance(contract!.id, to);
    if (!r.ok) {
      Alert.alert(sw ? 'Haiwezekani' : 'Cannot advance', r.reason ?? 'Invalid transition');
    } else {
      addNotification({ title: `Mkataba ${STATUS_LABEL[to]}`, body: `"${contract!.title}" → ${STATUS_LABEL[to]}`, type: 'info' });
    }
  }

  function handleSign() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    signAsFarmer(contract!.id);
    setTimeout(() => signAsBuyer(contract!.id), 800);
  }

  return (
    <Gate
      feature="contract_farming"
      fallback={
        <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.textMute, fontFamily: 'Inter_600SemiBold' }}>Hairuhusiwi.</Text>
        </View>
      }
    >
      <View style={[S.root, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="light-content" />

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

          {/* ── Hero ───────────────────────────────────────────── */}
          <ImageBackground
            source={{ uri: getCropHeroUri(contract.crop) }}
            style={[S.hero, { height: HERO_H }]}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.60)', 'rgba(0,0,0,0.08)', 'rgba(0,0,0,0.80)']}
              locations={[0, 0.42, 1]}
              style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={S.heroSafe}>
              {/* Nav row */}
              <View style={S.heroNav}>
                <TouchableOpacity
                  onPress={() => router.canGoBack() ? router.back() : router.replace('/contracts')}
                  style={S.heroBack}
                  activeOpacity={0.8}
                >
                  <ChevronLeft size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Alert.alert('QR Code', sw ? 'Kipengele hiki kitakuwa tayari hivi karibuni.' : 'This feature is coming soon.')}
                  style={S.heroQr}
                  activeOpacity={0.8}
                >
                  <QrCode size={15} color="#fff" />
                  <Text style={S.heroQrText}>QR Code</Text>
                </TouchableOpacity>
              </View>

              {/* Floating annotation: milestone count */}
              {contract.milestones.length > 0 && (
                <View style={S.floatAnnotation}>
                  <View style={[S.floatDot, { backgroundColor: '#22d15a' }]} />
                  <Text style={S.floatText}>
                    {contract.milestones.filter((m) => m.paid).length}/{contract.milestones.length} {sw ? 'Hatua Zimekamilika' : 'Milestones Done'}
                  </Text>
                </View>
              )}

              {/* Title block at bottom of hero */}
              <View style={S.heroBottom}>
                <View style={[S.statusHeroBadge, { backgroundColor: statusColor + '35', borderColor: statusColor + '70' }]}>
                  <View style={[S.statusHeroDot, { backgroundColor: statusColor }]} />
                  <Text style={[S.statusHeroText]}>{STATUS_LABEL[contract.status].toUpperCase()}</Text>
                </View>
                <Text style={S.heroTitle} numberOfLines={2}>{contract.title}</Text>
                <View style={S.heroMetaRow}>
                  <View style={S.heroMetaChip}>
                    <User size={10} color="rgba(255,255,255,0.8)" />
                    <Text style={S.heroMetaText}>{contract.buyer}</Text>
                  </View>
                  <View style={S.heroMetaDot} />
                  <View style={S.heroMetaChip}>
                    <MapPin size={10} color="rgba(255,255,255,0.8)" />
                    <Text style={S.heroMetaText}>{contract.region}</Text>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </ImageBackground>

          {/* ── Panel ──────────────────────────────────────────── */}
          <View style={[S.panel, { backgroundColor: colors.background }]}>

            {/* ── Contract Value ─────────────────────────── */}
            <Animated.View entering={FadeInDown.delay(60).springify()}>
              <View style={[S.valueCard, {
                backgroundColor: isDark ? 'rgba(34,209,90,0.07)' : 'rgba(34,209,90,0.05)',
                borderColor: isDark ? 'rgba(34,209,90,0.22)' : 'rgba(34,209,90,0.14)',
              }]}>
                <LinearGradient colors={['#22d15a10', '#22d15a00']} style={StyleSheet.absoluteFill} />
                <View style={{ flex: 1 }}>
                  <Text style={[S.valueLabel, { color: colors.textMute }]}>
                    {sw ? 'Thamani ya Mkataba' : 'Contract Value'}
                  </Text>
                  <Text style={[S.valueAmt, { color: colors.text }]}>TZS {fmt(total)}</Text>
                  <Text style={[S.valueSub, { color: colors.textMute }]}>
                    {fmt(contract.quantityKg)} kg @ TZS {fmt(contract.pricePerKgTZS)}/kg
                  </Text>
                  {paidAmount > 0 && (
                    <View style={S.paidRow}>
                      <TrendingUp size={11} color="#22d15a" />
                      <Text style={S.paidText}>
                        TZS {fmt(paidAmount)} {sw ? 'Imelipwa' : 'paid'} · TZS {fmt(total - paidAmount)} {sw ? 'Imesalia' : 'remaining'}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={[S.cropBadge, { backgroundColor: '#22d15a18', borderColor: '#22d15a35' }]}>
                  <Text style={S.cropBadgeText}>{contract.crop}</Text>
                </View>
              </View>
            </Animated.View>

            {/* ── Track Records (milestones) ──────────────── */}
            {contract.milestones.length > 0 && (
              <Animated.View entering={FadeInDown.delay(100).springify()}>
                <SectionTitle label={sw ? 'Rekodi za Hatua' : 'Track Records'} />

                {/* Horizontal dot timeline */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.timelineScroll}>
                  {contract.milestones.map((m, i) => (
                    <View key={m.id} style={S.timelineItem}>
                      <View style={S.timelineConnRow}>
                        <View style={[S.tlDot, {
                          backgroundColor: m.paid ? '#22d15a' : isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                          borderColor: m.paid ? '#22d15a' : colors.border,
                        }]}>
                          {m.paid && <CheckCircle2 size={11} color="#fff" />}
                        </View>
                        {i < contract.milestones.length - 1 && (
                          <View style={[S.tlLine, { backgroundColor: m.paid ? '#22d15a' : colors.border }]} />
                        )}
                      </View>
                      <Text style={[S.tlLabel, { color: colors.textMute }]} numberOfLines={2}>{m.label}</Text>
                      <Text style={[S.tlDate, { color: colors.textMute }]}>
                        {new Date(m.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </Text>
                    </View>
                  ))}
                </ScrollView>

                {/* Milestone detail cards */}
                <View style={{ gap: 10 }}>
                  {contract.milestones.map((m, i) => (
                    <Animated.View
                      key={m.id}
                      entering={FadeInDown.delay(120 + i * 45).springify()}
                      style={[S.mCard, {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
                        borderColor: m.paid ? '#22d15a30' : colors.border,
                      }]}
                    >
                      <View style={[S.mCardLeft, { backgroundColor: m.paid ? '#22d15a18' : isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc' }]}>
                        {m.paid
                          ? <CheckCircle2 size={20} color="#22d15a" />
                          : <Circle size={20} color={colors.textMute} />
                        }
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[S.mLabel, { color: colors.text }]}>{m.label}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
                          <Calendar size={10} color={colors.textMute} />
                          <Text style={[S.mDue, { color: colors.textMute }]}>
                            {new Date(m.dueDate).toLocaleDateString('en-GB')}
                          </Text>
                        </View>
                        <Text style={[S.mAmt, { color: '#22d15a' }]}>TZS {fmt(m.amountTZS)}</Text>
                      </View>
                      {!m.paid ? (
                        <TouchableOpacity
                          onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); markMilestonePaid(contract!.id, m.id); }}
                          style={[S.payBtn, { backgroundColor: '#22d15a18', borderColor: '#22d15a50' }]}
                        >
                          <Banknote size={12} color="#22d15a" />
                          <Text style={S.payText}>{sw ? 'Lipia' : 'Mark Paid'}</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={[S.paidBadge, { backgroundColor: '#22d15a12' }]}>
                          <Text style={S.paidBadgeText}>
                            ✓ {m.completedAt ? new Date(m.completedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Paid'}
                          </Text>
                        </View>
                      )}
                    </Animated.View>
                  ))}
                </View>
              </Animated.View>
            )}

            {/* ── Contract Conditions ─────────────────────── */}
            <Animated.View entering={FadeInDown.delay(160).springify()}>
              <SectionTitle label={sw ? 'Maelezo ya Mkataba' : 'Contract Details'} />
              <View style={[S.detailCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: colors.border }]}>
                <DetailRow label={sw ? 'Mnunuzi' : 'Buyer'} value={contract.buyer} accent />
                <View style={[S.divider, { backgroundColor: colors.border }]} />
                <DetailRow label={sw ? 'Mkoa' : 'Region'} value={contract.region} />
                <View style={[S.divider, { backgroundColor: colors.border }]} />
                <DetailRow label={sw ? 'Zao' : 'Crop'} value={contract.crop} />
                <View style={[S.divider, { backgroundColor: colors.border }]} />
                <DetailRow label={sw ? 'Kiasi' : 'Quantity'} value={`${fmt(contract.quantityKg)} kg`} />
                <View style={[S.divider, { backgroundColor: colors.border }]} />
                <DetailRow label={sw ? 'Bei kwa kilo' : 'Price per kg'} value={`TZS ${fmt(contract.pricePerKgTZS)}`} />
                <View style={[S.divider, { backgroundColor: colors.border }]} />
                <DetailRow
                  label={sw ? 'Ilisajiliwa' : 'Created'}
                  value={new Date(contract.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                />
              </View>
            </Animated.View>

            {/* ── Signatures ──────────────────────────────── */}
            <Animated.View entering={FadeInDown.delay(190).springify()}>
              <SectionTitle label={sw ? 'Saini' : 'Signatures'} />
              <View style={[S.detailCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: colors.border }]}>
                <SignatureRow label={sw ? 'Mkulima' : 'Farmer'} when={contract.signedByFarmerAt} colors={colors} isDark={isDark} />
                <View style={[S.divider, { backgroundColor: colors.border }]} />
                <SignatureRow label={sw ? 'Mnunuzi' : 'Buyer'} when={contract.signedByBuyerAt} colors={colors} isDark={isDark} />
              </View>
            </Animated.View>

            {/* ── Lifecycle stepper ───────────────────────── */}
            <Animated.View entering={FadeInDown.delay(210).springify()}>
              <SectionTitle label={sw ? 'Hatua za Mkataba' : 'Contract Lifecycle'} />
              <View style={[S.detailCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', borderColor: colors.border, padding: 18 }]}>
                {LIFECYCLE.map((step, i) => {
                  const done = currentIdx > i;
                  const current = step === contract.status;
                  const sc = STATUS_COLOR[step];
                  return (
                    <View key={step} style={S.lcRow}>
                      <View style={S.lcDotCol}>
                        <View style={[S.lcDot, {
                          backgroundColor: done ? '#22d15a' : current ? sc : isDark ? 'rgba(255,255,255,0.10)' : '#e2e8f0',
                          borderWidth: current ? 2.5 : 0,
                          borderColor: current ? sc : 'transparent',
                        }]}>
                          {done && <CheckCircle2 size={12} color="#fff" />}
                        </View>
                        {i < LIFECYCLE.length - 1 && (
                          <View style={[S.lcConnector, { backgroundColor: done ? '#22d15a' : isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }]} />
                        )}
                      </View>
                      <View style={[S.lcTextRow, { marginBottom: i < LIFECYCLE.length - 1 ? 0 : 0 }]}>
                        <Text style={[S.lcLabel, {
                          color: current ? colors.text : done ? colors.text : colors.textMute,
                          fontFamily: current ? 'Inter_900Black' : done ? 'Inter_600SemiBold' : 'Inter_500Medium',
                        }]}>
                          {STATUS_LABEL[step]}
                        </Text>
                        {current && (
                          <View style={[S.lcNow, { backgroundColor: sc + '20', borderColor: sc + '50' }]}>
                            <Text style={[S.lcNowText, { color: sc }]}>SASA</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </Animated.View>

            {/* ── Action Buttons ──────────────────────────── */}
            {transitions.length > 0 && (
              <Animated.View entering={FadeInDown.delay(230).springify()} style={{ gap: 10, marginTop: 28 }}>
                <SectionTitle label={sw ? 'Hatua Inayofuata' : 'Next Action'} />
                {transitions.map((t) => {
                  const isSign = t === 'signed' && !contract.signedByFarmerAt;
                  const dest = isDestructive(t);
                  return (
                    <TouchableOpacity
                      key={t}
                      onPress={() => isSign ? handleSign() : handleAdvance(t)}
                      activeOpacity={0.85}
                    >
                      {dest ? (
                        <View style={[S.actionBtn, { backgroundColor: '#ef444412', borderColor: '#ef444435', borderWidth: 1 }]}>
                          <X size={16} color="#ef4444" />
                          <Text style={[S.actionText, { color: '#ef4444' }]}>{STATUS_LABEL[t]}</Text>
                        </View>
                      ) : (
                        <LinearGradient
                          colors={isSign ? ['#22d15a', '#0a3d18'] : [statusColor + 'ee', statusColor + 'bb']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={S.actionBtn}
                        >
                          {isSign ? <PenLine size={16} color="#fff" /> : <ArrowRight size={16} color="#fff" />}
                          <Text style={[S.actionText, { color: '#fff' }]}>
                            {isSign ? (sw ? 'Saini Kidijitali' : 'Sign Digitally') : STATUS_LABEL[t]}
                          </Text>
                        </LinearGradient>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </Animated.View>
            )}

            {/* ── Bottom CTAs ──────────────────────────────── */}
            <Animated.View entering={FadeInDown.delay(250).springify()} style={S.bottomRow}>
              <TouchableOpacity
                style={[S.ctaBtn, { borderColor: colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', flex: 1 }]}
                onPress={() => Alert.alert('QR Code', sw ? 'Kipengele hiki kitakuwa tayari hivi karibuni.' : 'This feature is coming soon.')}
                activeOpacity={0.8}
              >
                <QrCode size={15} color={colors.textMute} />
                <Text style={[S.ctaText, { color: colors.textMute }]}>{sw ? 'Pakua QR' : 'Download QR'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[S.ctaBtn, { borderColor: colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#fff', flex: 1 }]}
                onPress={() => Alert.alert(sw ? 'Shiriki Mkataba' : 'Share Contract', sw ? 'Kipengele hiki kitakuwa tayari hivi karibuni.' : 'This feature is coming soon.')}
                activeOpacity={0.8}
              >
                <Package size={15} color={colors.textMute} />
                <Text style={[S.ctaText, { color: colors.textMute }]}>{sw ? 'Shiriki' : 'Share'}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </View>
    </Gate>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  root: { flex: 1 },

  // Hero
  hero: { width: '100%' },
  heroSafe: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 4, paddingBottom: 20 },
  heroNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroBack: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.38)', justifyContent: 'center', alignItems: 'center' },
  heroQr: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.38)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  heroQrText: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#fff' },

  floatAnnotation: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start' },
  floatDot: { width: 7, height: 7, borderRadius: 4 },
  floatText: { fontSize: 11, fontFamily: 'Inter_700Bold', color: '#fff' },

  heroBottom: { gap: 6 },
  statusHeroBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, alignSelf: 'flex-start' },
  statusHeroDot: { width: 6, height: 6, borderRadius: 3 },
  statusHeroText: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', color: '#fff', letterSpacing: 0.8 },
  heroTitle: { fontSize: 26, fontFamily: 'InstrumentSerif_400Regular', color: '#fff', letterSpacing: -0.6, lineHeight: 32 },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  heroMetaChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroMetaText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: 'rgba(255,255,255,0.80)' },
  heroMetaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' },

  // Panel
  panel: { paddingHorizontal: 20, paddingTop: 24 },

  // Value card
  valueCard: { borderRadius: 20, borderWidth: 1, padding: 20, flexDirection: 'row', alignItems: 'flex-start', overflow: 'hidden' },
  valueLabel: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1.2, marginBottom: 6 },
  valueAmt: { fontSize: 28, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.8 },
  valueSub: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 4 },
  paidRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  paidText: { fontSize: 11, fontFamily: 'Inter_700Bold', color: '#22d15a' },
  cropBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, alignSelf: 'flex-start', marginLeft: 10 },
  cropBadgeText: { fontSize: 11, fontFamily: 'Inter_800ExtraBold', color: '#22d15a' },

  // Timeline
  timelineScroll: { paddingHorizontal: 2, paddingBottom: 16, paddingTop: 4, gap: 0 },
  timelineItem: { alignItems: 'center', width: 80, gap: 6 },
  timelineConnRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  tlDot: { width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  tlLine: { flex: 1, height: 2 },
  tlLabel: { fontSize: 10, fontFamily: 'Inter_600SemiBold', textAlign: 'center', lineHeight: 13 },
  tlDate: { fontSize: 9, fontFamily: 'Inter_500Medium', textAlign: 'center' },

  // Milestone cards
  mCard: { borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  mCardLeft: { width: 52, alignItems: 'center', justifyContent: 'center', padding: 16, alignSelf: 'stretch' },
  mLabel: { fontSize: 14, fontFamily: 'Inter_800ExtraBold' },
  mDue: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  mAmt: { fontSize: 14, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.3, marginTop: 4 },
  payBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, borderWidth: 1, margin: 12 },
  payText: { fontSize: 11, fontFamily: 'Inter_800ExtraBold', color: '#22d15a' },
  paidBadge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, margin: 12 },
  paidBadgeText: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', color: '#22d15a' },

  // Detail card
  detailCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 16 },

  // Lifecycle
  lcRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 0 },
  lcDotCol: { alignItems: 'center', marginRight: 14, width: 22 },
  lcDot: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  lcConnector: { width: 2, height: 22, marginVertical: 2 },
  lcTextRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
  lcLabel: { fontSize: 13 },
  lcNow: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  lcNowText: { fontSize: 9, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.5 },

  // Actions
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16 },
  actionText: { fontSize: 14, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.2 },

  // Bottom CTAs
  bottomRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
  ctaText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
});
