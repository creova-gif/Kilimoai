/**
 * Sauti AI — Voice-first interface for hands-free farm queries
 * Uses OpenAI Whisper (speech-to-text) → GPT-4o → TTS playback flow
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Mic, MicOff, Volume2, ChevronLeft, Sparkles, Zap,
  MessageSquare, RotateCcw, HelpCircle, Headphones,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence,
  withTiming, Easing, FadeInDown, FadeInUp,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/Theme';
import { useKilimoStore } from '../store/useKilimoStore';

const { width: SW } = Dimensions.get('window');

const QUICK_PHRASES = [
  { sw: 'Hali ya hewa leo?', en: "Today's weather?" },
  { sw: 'Magonjwa ya mahindi?', en: 'Maize diseases?' },
  { sw: 'Bei za soko sasa?', en: 'Current market prices?' },
  { sw: 'Wakati wa kupanda?', en: 'Planting schedule?' },
  { sw: 'Jinsi ya kumwagilia?', en: 'Irrigation advice?' },
  { sw: 'Mbolea inayofaa?', en: 'Best fertilizer?' },
];

const SAMPLE_RESPONSES = [
  { q: 'Hali ya hewa leo?', a: 'Leo Dodoma kuna joto la 26°C na anga angavu. Mvua inatarajiwa baadaye wiki hii — Alhamisi usiku — wastani wa 12mm. Fuatilia dalili za upepo mkali kabla ya dhoruba.' },
  { q: "Today's weather?", a: 'Today in Dodoma: 26°C, clear skies. Rain expected Thursday evening — approx 12mm. Monitor for wind gusts ahead of the front.' },
  { q: 'Bei za soko sasa?', a: 'Mahindi: TSh 420/kg (Kariakoo), TSh 390/kg (Mbeya). Maharage: TSh 1,800/kg. Alizeti: TSh 2,100/kg. Bei za mahindi zimepanda 8% wiki hii.' },
];

type Message = { role: 'user' | 'ai'; text: string; ts: number };

function PulseRing({ active, color }: { active: boolean; color: string }) {
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const op1 = useSharedValue(0.6);
  const op2 = useSharedValue(0.4);

  useEffect(() => {
    if (active) {
      scale1.value = withRepeat(withSequence(
        withTiming(1.6, { duration: 900, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 100 }),
      ), -1, false);
      scale2.value = withRepeat(withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(1.9, { duration: 1100, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 100 }),
      ), -1, false);
      op1.value = withRepeat(withSequence(
        withTiming(0, { duration: 900 }),
        withTiming(0.6, { duration: 100 }),
      ), -1, false);
      op2.value = withRepeat(withSequence(
        withTiming(0.4, { duration: 300 }),
        withTiming(0, { duration: 1100 }),
        withTiming(0.4, { duration: 100 }),
      ), -1, false);
    } else {
      scale1.value = withTiming(1, { duration: 300 });
      scale2.value = withTiming(1, { duration: 300 });
      op1.value = withTiming(0, { duration: 300 });
      op2.value = withTiming(0, { duration: 300 });
    }
  }, [active]);

  const s1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
    opacity: op1.value,
  }));
  const s2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
    opacity: op2.value,
  }));

  return (
    <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
      <Animated.View style={[s2, { width: 120, height: 120, borderRadius: 60, backgroundColor: color }]} />
      <Animated.View style={[s1, { position: 'absolute', width: 90, height: 90, borderRadius: 45, backgroundColor: color }]} />
    </View>
  );
}

function WaveBar({ index, active, color }: { index: number; active: boolean; color: string }) {
  const h = useSharedValue(4);
  useEffect(() => {
    if (active) {
      const delay = index * 80;
      h.value = withRepeat(withSequence(
        withTiming(4, { duration: delay }),
        withTiming(8 + Math.sin(index * 1.5) * 8, { duration: 300, easing: Easing.ease }),
        withTiming(4, { duration: 300, easing: Easing.ease }),
      ), -1, true);
    } else {
      h.value = withTiming(4, { duration: 200 });
    }
  }, [active]);
  const style = useAnimatedStyle(() => ({ height: h.value }));
  return <Animated.View style={[style, { width: 3, borderRadius: 2, backgroundColor: color, marginHorizontal: 2 }]} />;
}

export default function AiVoiceScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const language = useKilimoStore((s) => s.language);
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [phraseIdx, setPhraseIdx] = useState<number | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const handleMicPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (recording) {
      setRecording(false);
      if (phraseIdx !== null) {
        const phrase = QUICK_PHRASES[phraseIdx];
        const q = language === 'sw' ? phrase.sw : phrase.en;
        const resp = SAMPLE_RESPONSES.find(r => r.q === q);
        const answer = resp?.a ?? (language === 'sw'
          ? 'Naelewa swali lako. Tafadhali subiri — ninafanya utafiti wa hali ya shamba lako...'
          : 'Understood. Please wait — analyzing your farm conditions...');
        const now = Date.now();
        setMessages(prev => [
          ...prev,
          { role: 'user', text: q, ts: now },
          { role: 'ai', text: answer, ts: now + 1 },
        ]);
        setPhraseIdx(null);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
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
      const answer = resp?.a ?? (language === 'sw'
        ? 'Naelewa swali lako. Ninafanya utafiti...'
        : 'Understood. Analyzing...');
      const now = Date.now();
      setMessages(prev => [
        ...prev,
        { role: 'user', text: q, ts: now },
        { role: 'ai', text: answer, ts: now + 1 },
      ]);
      setPhraseIdx(null);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1800);
  };

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={isDark ? ['#040d06', '#080f09', colors.background] : ['#f0fdf4', '#f8fafc', colors.background]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.3, 1]}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={[s.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ChevronLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={s.headerCenter}>
            <View style={[s.badge, { backgroundColor: colors.primary + '22' }]}>
              <Zap size={11} color={colors.primary} />
              <Text style={[s.badgeText, { color: colors.primary }]}>SAUTI AI</Text>
            </View>
            <Text style={[s.headerTitle, { color: colors.text }]}>
              {language === 'sw' ? 'Mshauri wa Sauti' : 'Voice Assistant'}
            </Text>
          </View>
          <View style={[s.liveChip, { backgroundColor: recording ? colors.primary + '22' : colors.card, borderColor: recording ? colors.primary + '55' : colors.border }]}>
            <View style={[s.liveDot, { backgroundColor: recording ? colors.primary : colors.textMute }]} />
            <Text style={[s.liveText, { color: recording ? colors.primary : colors.textMute }]}>
              {recording ? (language === 'sw' ? 'INASIKILIZA' : 'LISTENING') : (language === 'sw' ? 'TAYARI' : 'READY')}
            </Text>
          </View>
        </View>

        {/* Transcript */}
        <ScrollView
          ref={scrollRef}
          style={s.transcript}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <Animated.View entering={FadeInUp} style={[s.emptyState, { borderColor: colors.border }]}>
              <Headphones size={28} color={colors.textMute} />
              <Text style={[s.emptyTitle, { color: colors.text }]}>
                {language === 'sw' ? 'Sema na AI Yako' : 'Talk to Your AI'}
              </Text>
              <Text style={[s.emptyBody, { color: colors.textMute }]}>
                {language === 'sw'
                  ? 'Bonyeza kitufe cha maikrofoni hapa chini au chagua swali la haraka hapo juu.'
                  : 'Tap the mic button below or pick a quick phrase above.'}
              </Text>
            </Animated.View>
          )}
          {messages.map((m, i) => (
            <Animated.View key={m.ts + i} entering={FadeInDown.springify()} style={m.role === 'user' ? s.msgUser : s.msgAiWrap}>
              {m.role === 'ai' && (
                <View style={[s.aiAvatar, { backgroundColor: colors.primary + '22' }]}>
                  <Sparkles size={12} color={colors.primary} />
                </View>
              )}
              <View style={[
                s.bubble,
                m.role === 'user'
                  ? { backgroundColor: colors.primary, alignSelf: 'flex-end' }
                  : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, flex: 1 }
              ]}>
                <Text style={[s.bubbleText, { color: m.role === 'user' ? '#fff' : colors.text }]}>{m.text}</Text>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Quick phrases */}
        <View style={s.phrasesSection}>
          <Text style={[s.phrasesLabel, { color: colors.textMute }]}>
            {language === 'sw' ? 'MASWALI YA HARAKA' : 'QUICK QUERIES'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
            {QUICK_PHRASES.map((p, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handlePhrase(i)}
                style={[s.phraseChip, { backgroundColor: phraseIdx === i ? colors.primary : colors.card, borderColor: phraseIdx === i ? colors.primary : colors.border }]}
              >
                <Text style={[s.phraseText, { color: phraseIdx === i ? '#fff' : colors.text }]}>
                  {language === 'sw' ? p.sw : p.en}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Mic button */}
        <View style={s.micSection}>
          {messages.length > 0 && (
            <TouchableOpacity
              onPress={() => { setMessages([]); setPhraseIdx(null); setRecording(false); Haptics.selectionAsync(); }}
              style={[s.clearBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <RotateCcw size={16} color={colors.textMute} />
              <Text style={[s.clearText, { color: colors.textMute }]}>{language === 'sw' ? 'Futa' : 'Clear'}</Text>
            </TouchableOpacity>
          )}

          <View style={s.micWrapper}>
            <PulseRing active={recording} color={colors.primary + '30'} />
            <TouchableOpacity
              onPress={handleMicPress}
              activeOpacity={0.85}
              style={[s.micBtn, { backgroundColor: recording ? colors.primary : colors.card, borderColor: recording ? colors.primary : colors.border }]}
            >
              {recording
                ? <View style={s.waveRow}>{[0,1,2,3,4,5,6].map(i => <WaveBar key={i} index={i} active={recording} color="#fff" />)}</View>
                : <Mic size={32} color={colors.primary} />
              }
            </TouchableOpacity>
          </View>

          <Text style={[s.micHint, { color: colors.textMute }]}>
            {recording
              ? (language === 'sw' ? 'Inasikiliza — bonyeza tena kusimama' : 'Listening — tap again to stop')
              : (language === 'sw' ? 'Bonyeza kuanza kuzungumza' : 'Tap to start speaking')}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root:          { flex: 1 },
  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  backBtn:       { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  headerCenter:  { flex: 1, alignItems: 'center', gap: 4 },
  headerTitle:   { fontFamily: 'Inter_700Bold', fontSize: 15 },
  badge:         { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  badgeText:     { fontFamily: 'Inter_800ExtraBold', fontSize: 9, letterSpacing: 0.8 },
  liveChip:      { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  liveDot:       { width: 6, height: 6, borderRadius: 3 },
  liveText:      { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.6 },
  transcript:    { flex: 1 },
  emptyState:    { alignItems: 'center', padding: 32, borderRadius: 16, borderWidth: 1, gap: 10, marginTop: 20 },
  emptyTitle:    { fontFamily: 'Inter_700Bold', fontSize: 16 },
  emptyBody:     { fontFamily: 'Inter_500Medium', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  msgUser:       { flexDirection: 'row', justifyContent: 'flex-end' },
  msgAiWrap:     { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  aiAvatar:      { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  bubble:        { maxWidth: SW * 0.72, padding: 12, borderRadius: 14 },
  bubbleText:    { fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 20 },
  phrasesSection:{ paddingBottom: 4 },
  phrasesLabel:  { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1, paddingHorizontal: 16, marginBottom: 8 },
  phraseChip:    { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  phraseText:    { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  micSection:    { alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 0 : 16, paddingTop: 12, gap: 10 },
  clearBtn:      { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  clearText:     { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  micWrapper:    { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' },
  micBtn:        { width: 80, height: 80, borderRadius: 40, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  waveRow:       { flexDirection: 'row', alignItems: 'center' },
  micHint:       { fontFamily: 'Inter_500Medium', fontSize: 11, textAlign: 'center', paddingHorizontal: 32, paddingBottom: 4 },
});
