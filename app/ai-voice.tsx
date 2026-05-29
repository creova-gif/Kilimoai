/**
 * Sauti AI — Voice assistant, creative redesign
 * Immersive orb visualizer · Editorial typography · Theme-aware
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, Dimensions, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Mic, ChevronLeft, Sparkles, Zap, RotateCcw, Headphones,
  Volume2, Wand2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence,
  withTiming, Easing, FadeInDown, FadeInUp, interpolate,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/Theme';
import { useKilimoStore } from '../store/useKilimoStore';

const { width: SW } = Dimensions.get('window');
const PRIMARY = '#22d15a';
const ORB_SIZE = 136;
const ORB_CONTAINER = 220;

const QUICK_PHRASES = [
  { sw: 'Hali ya hewa leo?', en: "Today's weather?", icon: '🌤' },
  { sw: 'Magonjwa ya mahindi?', en: 'Maize diseases?', icon: '🌽' },
  { sw: 'Bei za soko sasa?', en: 'Current market prices?', icon: '📈' },
  { sw: 'Wakati wa kupanda?', en: 'Planting schedule?', icon: '🌱' },
  { sw: 'Jinsi ya kumwagilia?', en: 'Irrigation advice?', icon: '💧' },
  { sw: 'Mbolea inayofaa?', en: 'Best fertilizer?', icon: '🧪' },
];

const SAMPLE_RESPONSES = [
  { q: 'Hali ya hewa leo?', a: 'Leo Dodoma kuna joto la 26°C na anga angavu. Mvua inatarajiwa Alhamisi usiku — wastani wa 12mm. Fuatilia dalili za upepo mkali kabla ya dhoruba.' },
  { q: "Today's weather?", a: 'Today in Dodoma: 26°C, clear skies. Rain expected Thursday evening — approx 12mm. Watch for wind gusts ahead of the front.' },
  { q: 'Bei za soko sasa?', a: 'Mahindi: TSh 420/kg (Kariakoo), TSh 390/kg (Mbeya). Maharage: TSh 1,800/kg. Alizeti: TSh 2,100/kg. Bei za mahindi zimepanda 8% wiki hii.' },
];

type Message = { role: 'user' | 'ai'; text: string; ts: number };

// ─── Single pulse ring (one per instance) ────────────────────────────────────
function OrbRing({ active, color, ringIndex }: { active: boolean; color: string; ringIndex: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  useEffect(() => {
    if (active) {
      const delay = ringIndex * 220;
      scale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: delay }),
          withTiming(1 + ringIndex * 0.28, { duration: 1000, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 0 }),
        ), -1, false);
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.5 - ringIndex * 0.12, { duration: delay }),
          withTiming(0, { duration: 1000 }),
          withTiming(0, { duration: 0 }),
        ), -1, false);
    } else {
      scale.value = withTiming(1, { duration: 400 });
      opacity.value = withTiming(0, { duration: 400 });
    }
  }, [active]);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  const size = ORB_SIZE + ringIndex * 28;
  return (
    <Animated.View style={[style, {
      position: 'absolute',
      width: size, height: size,
      borderRadius: size / 2,
      borderWidth: 1.5,
      borderColor: color,
    }]} />
  );
}

// ─── Three concentric pulse rings around the orb ──────────────────────────────
function OrbRings({ active, color }: { active: boolean; color: string }) {
  return (
    <>
      <OrbRing active={active} color={color} ringIndex={1} />
      <OrbRing active={active} color={color} ringIndex={2} />
      <OrbRing active={active} color={color} ringIndex={3} />
    </>
  );
}

// ─── Wave bars inside the orb ──────────────────────────────────────────────────
function WaveBar({ index, active }: { index: number; active: boolean }) {
  const h = useSharedValue(4);
  useEffect(() => {
    if (active) {
      const delay = index * 70;
      h.value = withRepeat(
        withSequence(
          withTiming(4, { duration: delay }),
          withTiming(6 + Math.abs(Math.sin(index * 1.2)) * 26, { duration: 350, easing: Easing.ease }),
          withTiming(4, { duration: 350, easing: Easing.ease }),
        ), -1, true);
    } else {
      h.value = withTiming(5, { duration: 250 });
    }
  }, [active]);
  const style = useAnimatedStyle(() => ({ height: h.value }));
  return <Animated.View style={[style, { width: 3.5, borderRadius: 2, backgroundColor: '#fff', marginHorizontal: 2.5 }]} />;
}

// ─── Idle orb inner shimmer ───────────────────────────────────────────────────
function OrbShimmer({ colors, isDark }: { colors: any; isDark: boolean }) {
  const rotate = useSharedValue(0);
  useEffect(() => {
    rotate.value = withRepeat(withTiming(1, { duration: 8000, easing: Easing.linear }), -1, false);
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value * 360}deg` }],
  }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, { borderRadius: ORB_SIZE / 2, overflow: 'hidden' }, style]}>
      <LinearGradient
        colors={[`${PRIMARY}00`, `${PRIMARY}20`, `${PRIMARY}00`, `${PRIMARY}10`]}
        locations={[0, 0.35, 0.65, 1]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ m, colors, isDark }: { m: Message; colors: any; isDark: boolean }) {
  if (m.role === 'user') {
    return (
      <Animated.View entering={FadeInDown.springify().damping(18)} style={S.msgUserRow}>
        <View style={[S.bubbleUser, { backgroundColor: PRIMARY }]}>
          <Text style={S.bubbleUserText}>{m.text}</Text>
        </View>
        <View style={[S.userAvatar, { backgroundColor: `${PRIMARY}28` }]}>
          <Mic size={12} color={PRIMARY} />
        </View>
      </Animated.View>
    );
  }
  return (
    <Animated.View entering={FadeInDown.springify().damping(18)} style={S.msgAiRow}>
      <View style={[S.aiAvatar, { backgroundColor: `${PRIMARY}20` }]}>
        <Sparkles size={12} color={PRIMARY} />
      </View>
      <View style={[S.bubbleAi, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[S.aiAccentBar, { backgroundColor: PRIMARY }]} />
        <Text style={[S.bubbleAiText, { color: colors.text }]}>{m.text}</Text>
        <View style={S.aiFooter}>
          <Volume2 size={10} color={colors.textMute} />
          <Text style={[S.aiFooterText, { color: colors.textMute }]}>Sauti AI</Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ colors, isDark, language }: { colors: any; isDark: boolean; language: string }) {
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.08, { duration: 2200, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <Animated.View entering={FadeInUp.duration(500)} style={S.emptyWrap}>
      {/* Concentric decorative rings */}
      <View style={S.emptyRingsWrap}>
        {[86, 110, 134].map((size, i) => (
          <View key={i} style={[S.emptyRing, { width: size, height: size, borderRadius: size / 2, borderColor: `${PRIMARY}${['25', '18', '10'][i]}` }]} />
        ))}
        <Animated.View style={[S.emptyIconCircle, { backgroundColor: `${PRIMARY}15`, borderColor: `${PRIMARY}35` }, pulseStyle]}>
          <Headphones size={28} color={PRIMARY} />
        </Animated.View>
      </View>

      <Text style={[S.emptyTitle, { color: colors.text }]}>
        {language === 'sw' ? 'Sema na AI Yako' : 'Talk to Your AI'}
      </Text>
      <Text style={[S.emptyBody, { color: colors.textMute }]}>
        {language === 'sw'
          ? 'Bonyeza kitufe cha maikrofoni hapa chini au chagua swali la haraka.'
          : 'Tap the mic orb below, or pick a quick phrase to get started.'}
      </Text>

      {/* Feature chips */}
      <View style={S.emptyChips}>
        {[
          { icon: '🌾', label: language === 'sw' ? 'Mazao' : 'Crops' },
          { icon: '☁️', label: language === 'sw' ? 'Hewa' : 'Weather' },
          { icon: '📊', label: language === 'sw' ? 'Bei' : 'Prices' },
          { icon: '💡', label: language === 'sw' ? 'Ushauri' : 'Advice' },
        ].map((chip, i) => (
          <View key={i} style={[S.emptyChip, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', borderColor: colors.border }]}>
            <Text style={{ fontSize: 13 }}>{chip.icon}</Text>
            <Text style={[S.emptyChipText, { color: colors.textMute }]}>{chip.label}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function AiVoiceScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const language = useKilimoStore((s) => s.language);
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [phraseIdx, setPhraseIdx] = useState<number | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const orbScale = useSharedValue(1);

  const handleMicPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    orbScale.value = withSpring(0.93, { damping: 10 }, () => { orbScale.value = withSpring(1, { damping: 12 }); });
    if (recording) {
      setRecording(false);
      if (phraseIdx !== null) {
        const phrase = QUICK_PHRASES[phraseIdx];
        const q = language === 'sw' ? phrase.sw : phrase.en;
        const resp = SAMPLE_RESPONSES.find(r => r.q === q);
        const answer = resp?.a ?? (language === 'sw'
          ? 'Naelewa swali lako. Ninafanya utafiti wa hali ya shamba lako...'
          : 'Understood. Analyzing your farm conditions...');
        const now = Date.now();
        setMessages(prev => [...prev, { role: 'user', text: q, ts: now }, { role: 'ai', text: answer, ts: now + 1 }]);
        setPhraseIdx(null);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);
      }
    } else {
      setRecording(true);
    }
  };

  const handlePhrase = (idx: number) => {
    Haptics.selectionAsync();
    setPhraseIdx(idx);
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      const phrase = QUICK_PHRASES[idx];
      const q = language === 'sw' ? phrase.sw : phrase.en;
      const resp = SAMPLE_RESPONSES.find(r => r.q === q);
      const answer = resp?.a ?? (language === 'sw' ? 'Naelewa swali lako. Ninafanya utafiti...' : 'Understood. Analyzing...');
      const now = Date.now();
      setMessages(prev => [...prev, { role: 'user', text: q, ts: now }, { role: 'ai', text: answer, ts: now + 1 }]);
      setPhraseIdx(null);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);
    }, 1800);
  };

  const orbAnimStyle = useAnimatedStyle(() => ({ transform: [{ scale: orbScale.value }] }));

  return (
    <View style={[S.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Background gradient */}
      <LinearGradient
        colors={isDark
          ? [`${PRIMARY}10`, colors.background, colors.background]
          : [`${PRIMARY}0c`, colors.background, colors.background]}
        locations={[0, 0.35, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Faint "SAUTI" watermark */}
      <View style={S.watermarkWrap} pointerEvents="none">
        <Text style={[S.watermark, { color: PRIMARY }]}>SAUTI</Text>
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        {/* ── Header ── */}
        <Animated.View entering={FadeInDown.duration(300)} style={S.header}>
          <TouchableOpacity
            onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
            activeOpacity={0.8}
            style={[S.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            accessibilityRole="button" accessibilityLabel="Go back"
          >
            <ChevronLeft size={20} color={colors.text} />
          </TouchableOpacity>

          <View style={S.headerCenter}>
            <View style={[S.badge, { backgroundColor: `${PRIMARY}18` }]}>
              <Wand2 size={11} color={PRIMARY} />
              <Text style={[S.badgeText, { color: PRIMARY }]}>SAUTI AI</Text>
            </View>
            <Text style={[S.headerTitle, { color: colors.text }]}>
              {language === 'sw' ? 'Mshauri wa Sauti' : 'Voice Assistant'}
            </Text>
          </View>

          <View style={[S.statusPill, {
            backgroundColor: recording ? `${PRIMARY}18` : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'),
            borderColor: recording ? `${PRIMARY}50` : colors.border,
          }]}>
            <View style={[S.statusDot, { backgroundColor: recording ? PRIMARY : colors.textMute }]} />
            <Text style={[S.statusText, { color: recording ? PRIMARY : colors.textMute }]}>
              {recording
                ? (language === 'sw' ? 'INASIKILIZA' : 'LISTENING')
                : (language === 'sw' ? 'TAYARI' : 'READY')}
            </Text>
          </View>
        </Animated.View>

        {/* ── Transcript ── */}
        <ScrollView
          ref={scrollRef}
          style={S.transcript}
          contentContainerStyle={S.transcriptContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <EmptyState colors={colors} isDark={isDark} language={language} />
          )}
          {messages.map((m, i) => (
            <MessageBubble key={m.ts + i} m={m} colors={colors} isDark={isDark} />
          ))}
        </ScrollView>

        {/* ── Quick phrases ── */}
        <View style={S.phrasesSection}>
          <View style={S.phrasesHeader}>
            <View style={[S.phrasesLine, { backgroundColor: colors.border }]} />
            <Text style={[S.phrasesLabel, { color: colors.textMute }]}>
              {language === 'sw' ? 'MASWALI YA HARAKA' : 'QUICK QUERIES'}
            </Text>
            <View style={[S.phrasesLine, { backgroundColor: colors.border }]} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={S.phrasesRow}
          >
            {QUICK_PHRASES.map((p, i) => {
              const active = phraseIdx === i;
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => handlePhrase(i)}
                  activeOpacity={0.8}
                  style={[S.phraseChip, {
                    backgroundColor: active ? PRIMARY : colors.card,
                    borderColor: active ? PRIMARY : colors.border,
                  }]}
                  accessibilityRole="button"
                  accessibilityLabel={language === 'sw' ? p.sw : p.en}
                >
                  <Text style={{ fontSize: 13 }}>{p.icon}</Text>
                  <Text style={[S.phraseText, { color: active ? '#fff' : colors.text }]}>
                    {language === 'sw' ? p.sw : p.en}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Mic orb section ── */}
        <View style={S.micSection}>
          {messages.length > 0 && (
            <Animated.View entering={FadeInDown.duration(260)}>
              <TouchableOpacity
                onPress={() => { setMessages([]); setPhraseIdx(null); setRecording(false); Haptics.selectionAsync(); }}
                style={[S.clearBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                accessibilityRole="button"
                accessibilityLabel={language === 'sw' ? 'Futa mazungumzo' : 'Clear conversation'}
              >
                <RotateCcw size={14} color={colors.textMute} />
                <Text style={[S.clearText, { color: colors.textMute }]}>
                  {language === 'sw' ? 'Futa' : 'Clear'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Orb container */}
          <View style={S.orbContainer}>
            {/* Pulse rings */}
            <OrbRings active={recording} color={`${PRIMARY}55`} />

            {/* Idle ambient ring */}
            {!recording && (
              <View style={[S.idleRing, { borderColor: `${PRIMARY}22` }]} />
            )}

            {/* Main orb button */}
            <Animated.View style={orbAnimStyle}>
              <TouchableOpacity
                onPress={handleMicPress}
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel={recording ? (language === 'sw' ? 'Simama' : 'Stop recording') : (language === 'sw' ? 'Anza kuzungumza' : 'Start speaking')}
                style={S.orbTouchable}
              >
                <LinearGradient
                  colors={recording
                    ? [PRIMARY, '#12903a', '#0a6b2a']
                    : (isDark ? [`${PRIMARY}18`, `${PRIMARY}08`] : [`${PRIMARY}12`, `${PRIMARY}05`])}
                  style={S.orb}
                >
                  {!recording && <OrbShimmer colors={colors} isDark={isDark} />}

                  {recording ? (
                    <View style={S.waveRow}>
                      {[0,1,2,3,4,5,6,7,8].map(i => (
                        <WaveBar key={i} index={i} active={recording} />
                      ))}
                    </View>
                  ) : (
                    <View style={S.orbIdleInner}>
                      <Mic size={34} color={PRIMARY} />
                    </View>
                  )}
                </LinearGradient>

                {/* Orb border ring */}
                <View style={[S.orbBorder, {
                  borderColor: recording ? `${PRIMARY}80` : `${PRIMARY}35`,
                }]} />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Hint text */}
          <Text style={[S.micHint, { color: colors.textMute }]}>
            {recording
              ? (language === 'sw' ? 'Inasikiliza — gusa kusimama' : 'Listening — tap to stop')
              : (language === 'sw' ? 'Gusa kuanza kuzungumza' : 'Tap to start speaking')}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  root: { flex: 1 },

  watermarkWrap: { position: 'absolute', top: 60, left: -20, overflow: 'hidden' },
  watermark: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 130, opacity: 0.035, letterSpacing: -4 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 4, paddingBottom: 10, gap: 10 },
  backBtn: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center', gap: 3 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999 },
  badgeText: { fontFamily: 'Inter_800ExtraBold', fontSize: 9, letterSpacing: 1 },
  headerTitle: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 18, letterSpacing: 0.2 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.6 },

  // Transcript
  transcript: { flex: 1 },
  transcriptContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 12, paddingBottom: 8 },

  // Empty state
  emptyWrap: { alignItems: 'center', paddingTop: 24, paddingBottom: 8, gap: 14 },
  emptyRingsWrap: { width: 134, height: 134, alignItems: 'center', justifyContent: 'center' },
  emptyRing: { position: 'absolute', borderWidth: 1 },
  emptyIconCircle: { width: 62, height: 62, borderRadius: 31, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontFamily: 'InstrumentSerif_400Regular', fontSize: 24, letterSpacing: 0.2 },
  emptyBody: { fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center', lineHeight: 20, paddingHorizontal: 32 },
  emptyChips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 },
  emptyChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  emptyChipText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },

  // Messages
  msgUserRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 8 },
  msgAiRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  userAvatar: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  aiAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 4, flexShrink: 0 },
  bubbleUser: { maxWidth: SW * 0.68, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, borderBottomRightRadius: 4 },
  bubbleUserText: { fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 20, color: '#fff' },
  bubbleAi: { flex: 1, maxWidth: SW * 0.72, borderRadius: 16, borderBottomLeftRadius: 4, borderWidth: 1, overflow: 'hidden' },
  aiAccentBar: { height: 3, width: '100%' },
  bubbleAiText: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 21, padding: 12, paddingTop: 10 },
  aiFooter: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingBottom: 8 },
  aiFooterText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.4 },

  // Phrases
  phrasesSection: { paddingBottom: 6 },
  phrasesHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, marginBottom: 10 },
  phrasesLine: { flex: 1, height: 1 },
  phrasesLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1.2 },
  phrasesRow: { paddingHorizontal: 16, gap: 8 },
  phraseChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  phraseText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },

  // Mic orb
  micSection: { alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 0 : 16, paddingTop: 8, gap: 8 },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  clearText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  orbContainer: { width: ORB_CONTAINER, height: ORB_CONTAINER, alignItems: 'center', justifyContent: 'center' },
  idleRing: { position: 'absolute', width: ORB_SIZE + 22, height: ORB_SIZE + 22, borderRadius: (ORB_SIZE + 22) / 2, borderWidth: 1 },
  orbTouchable: { width: ORB_SIZE, height: ORB_SIZE, borderRadius: ORB_SIZE / 2 },
  orb: { width: ORB_SIZE, height: ORB_SIZE, borderRadius: ORB_SIZE / 2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  orbBorder: { position: 'absolute', width: ORB_SIZE, height: ORB_SIZE, borderRadius: ORB_SIZE / 2, borderWidth: 1.5 },
  orbIdleInner: { alignItems: 'center', justifyContent: 'center' },
  waveRow: { flexDirection: 'row', alignItems: 'center' },
  micHint: { fontFamily: 'Inter_400Regular', fontSize: 12, textAlign: 'center', paddingHorizontal: 40, paddingBottom: 4 },
});
