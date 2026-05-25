/**
 * KILIMO AI — World-Class Onboarding V3
 * Inspired by: M-Pesa, Twiga Foods, Duolingo, Tala
 *
 * 6-screen experience:
 *  0  Power Entry    — animated hero, language, trust indicators
 *  1  Welcome        — feature showcase, social proof
 *  2  Role           — large visual cards (4 simplified roles)
 *  3  Farm Profile   — conversational form (name, region, crops)
 *  4  Personalization — farm size + activity + quick toggles
 *  5  Success        — pulsing celebration + Agro ID reveal
 */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  TextInput, Switch, KeyboardAvoidingView, Platform,
  SafeAreaView, StatusBar, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Globe, ChevronRight, ChevronLeft, Check, Sparkles,
  Leaf, Tractor, Users, TrendingUp, MapPin, Sprout,
  Camera, BarChart3, ShieldCheck, Zap, Star, Award,
  UserCog, Building2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { motion, AnimatePresence } from 'motion/react';
import { useKilimoStore, FarmProfile, AppLanguage } from '../store/useKilimoStore';
import { CanonicalRole, roleLabel } from '../lib/access';

const { width: SW, height: SH } = Dimensions.get('window');

// ── Data ────────────────────────────────────────────────────────────────────

const REGIONS = [
  'Arusha', 'Dar es Salaam', 'Dodoma', 'Geita', 'Iringa', 'Kagera', 'Katavi',
  'Kigoma', 'Kilimanjaro', 'Lindi', 'Manyara', 'Mara', 'Mbeya', 'Morogoro',
  'Mtwara', 'Mwanza', 'Njombe', 'Pemba Kaskazini', 'Pemba Kusini', 'Pwani',
  'Rukwa', 'Ruvuma', 'Shinyanga', 'Simiyu', 'Singida', 'Songwe', 'Tabora',
  'Tanga', 'Unguja Kaskazini', 'Unguja Kusini', 'Mjini Magharibi',
];

const CROPS = [
  { name: 'Mahindi', emoji: '🌽' }, { name: 'Maharage', emoji: '🫘' },
  { name: 'Mpunga', emoji: '🌾' },  { name: 'Kahawa', emoji: '☕' },
  { name: 'Pamba', emoji: '🌿' },   { name: 'Alizeti', emoji: '🌻' },
  { name: 'Mihogo', emoji: '🍠' },  { name: 'Viazi', emoji: '🥔' },
  { name: 'Nyanya', emoji: '🍅' },  { name: 'Vitunguu', emoji: '🧅' },
  { name: 'Karanga', emoji: '🥜' }, { name: 'Ndizi', emoji: '🍌' },
];

// 4 simplified visual roles mapping to canonical roles
const VISUAL_ROLES: {
  id: CanonicalRole; labelSw: string; labelEn: string;
  descSw: string; descEn: string;
  icon: React.ReactNode; gradient: [string, string]; glow: string;
}[] = [
  {
    id: 'farmer',
    labelSw: 'Mkulima', labelEn: 'Farmer',
    descSw: 'Ninolima mazao — kidogo au kwa wingi',
    descEn: 'I grow crops — small or large scale',
    icon: <Sprout size={32} color="#3ecf8e" />,
    gradient: ['rgba(62,207,142,0.18)', 'rgba(16,185,129,0.06)'],
    glow: '#3ecf8e',
  },
  {
    id: 'commercial_farmer',
    labelSw: 'Mkulima Biashara', labelEn: 'Commercial Farmer',
    descSw: 'Shamba kubwa, teknolojia ya kisasa',
    descEn: 'Large farm, modern technology',
    icon: <Tractor size={32} color="#3b82f6" />,
    gradient: ['rgba(59,130,246,0.18)', 'rgba(37,99,235,0.06)'],
    glow: '#3b82f6',
  },
  {
    id: 'coop_leader',
    labelSw: 'Kiongozi / Kikundi', labelEn: 'Leader / Cooperative',
    descSw: 'Nasimamia wakulima au chama',
    descEn: 'I manage farmers or a cooperative',
    icon: <Users size={32} color="#8b5cf6" />,
    gradient: ['rgba(139,92,246,0.18)', 'rgba(124,58,237,0.06)'],
    glow: '#8b5cf6',
  },
  {
    id: 'agribusiness',
    labelSw: 'Msambazaji / Mfanyabiashara', labelEn: 'Trader / Agribusiness',
    descSw: 'Ninunua, nauza, au nasambaza mazao',
    descEn: 'I buy, sell, or distribute produce',
    icon: <TrendingUp size={32} color="#f59e0b" />,
    gradient: ['rgba(245,158,11,0.18)', 'rgba(217,119,6,0.06)'],
    glow: '#f59e0b',
  },
];

const SIZE_OPTIONS = [
  { label: '< 1 ekari', value: '0.5' },
  { label: '1–5 ekari', value: '2.5' },
  { label: '5–20 ekari', value: '10' },
  { label: '20+ ekari', value: '25' },
];

// Trust badges for Power Entry
const TRUST = [
  { icon: <Users size={13} color="#3ecf8e" />, label: '15,000+ farmers' },
  { icon: <ShieldCheck size={13} color="#3ecf8e" />, label: 'Bank-level security' },
  { icon: <Star size={13} color="#3ecf8e" />, label: 'Free forever' },
];

// Features for Welcome step
const FEATURES = [
  { icon: <Sparkles size={22} color="#3ecf8e" />, bg: 'rgba(62,207,142,0.12)', border: 'rgba(62,207,142,0.2)',  labelSw: 'Sankofa AI',    subSw: 'Mshauri wa AI',         labelEn: 'Sankofa AI',    subEn: 'AI farming advisor' },
  { icon: <Camera size={22} color="#10b981" />,   bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.2)',  labelSw: 'Skani Mazao',   subSw: 'Tambua magonjwa',       labelEn: 'Crop Scan',     subEn: 'Disease diagnosis' },
  { icon: <TrendingUp size={22} color="#3b82f6" />,bg: 'rgba(59,130,246,0.12)',border: 'rgba(59,130,246,0.2)',  labelSw: 'Bei za Soko',   subSw: 'Masoko ya Tanzania',    labelEn: 'Market Prices', subEn: 'Live market data' },
  { icon: <ShieldCheck size={22} color="#f59e0b" />,bg:'rgba(245,158,11,0.12)',border: 'rgba(245,158,11,0.2)',  labelSw: 'Bima ya Mazao', subSw: 'Ulinzi wa mavuno',      labelEn: 'Crop Insurance',subEn: 'Protect your harvest' },
  { icon: <BarChart3 size={22} color="#8b5cf6" />, bg: 'rgba(139,92,246,0.12)',border: 'rgba(139,92,246,0.2)',  labelSw: 'Uchanganuzi',   subSw: 'Utabiri wa AI',         labelEn: 'Analytics',     subEn: 'AI-powered forecasts' },
  { icon: <Zap size={22} color="#ec4899" />,       bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.2)', labelSw: 'Mikataba',      subSw: 'Kilimo cha mkataba',    labelEn: 'Contracts',     subEn: 'Contract farming' },
];

type Step = 0 | 1 | 2 | 3 | 4 | 5;
const TOTAL = 6;

// Per-step background accent colours
const STEP_GRADIENTS: [string, string, string][] = [
  ['#022c22', '#0a0a0f', '#0f1229'],   // 0 power entry — deep green
  ['#0a0a0f', '#0d1117', '#1a0a2e'],   // 1 welcome     — deep indigo
  ['#0a0a0f', '#0d1117', '#0a1628'],   // 2 role        — dark blue
  ['#0a0a0f', '#0d1117', '#0f1229'],   // 3 profile     — neutral dark
  ['#0a0a0f', '#0d1117', '#1a0a10'],   // 4 personalise — slight warm
  ['#022c22', '#0a130f', '#031a10'],   // 5 success     — rich green
];

// ── Floating Orb component ───────────────────────────────────────────────────

function FloatingOrb({ color, size, top, left, delay }: { color: string; size: number; top: number; left: number; delay: number }) {
  return (
    <motion.View
      animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' }}
      style={[
        StyleSheet.absoluteFillObject,
        {
          top, left,
          width: size, height: size, borderRadius: size / 2,
          backgroundColor: color,
          opacity: 0.4,
        },
      ]}
    />
  );
}

// ── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const pct = ((step + 1) / TOTAL) * 100;
  return (
    <View style={pb.track}>
      <motion.View
        animate={{ width: `${pct}%` as any }}
        transition={{ type: 'spring', damping: 22, stiffness: 140 }}
        style={pb.fill}
      >
        <LinearGradient colors={['#3ecf8e', '#10b981']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
      </motion.View>
    </View>
  );
}
const pb = StyleSheet.create({
  track: { height: 3, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, marginHorizontal: 24, marginTop: 8, overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: 2, overflow: 'hidden' },
});

// ── Step 0: Power Entry ──────────────────────────────────────────────────────

function PowerEntry({ lang, setLang }: { lang: AppLanguage; setLang: (l: AppLanguage) => void }) {
  return (
    <View style={{ flex: 1, paddingHorizontal: 24 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
        {/* Logo */}
        <motion.View
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 120, delay: 0.1 }}
          style={pe.logoWrap}
        >
          <LinearGradient colors={['rgba(62,207,142,0.25)', 'rgba(16,185,129,0.08)']} style={pe.logoGrad}>
            <Sparkles size={44} color="#3ecf8e" />
          </LinearGradient>
          {/* Pulse ring */}
          <motion.View
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={[StyleSheet.absoluteFill, { borderRadius: 48, borderWidth: 2, borderColor: '#3ecf8e' }]}
          />
        </motion.View>

        <motion.View initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Text style={pe.appName}>KILIMO AI</Text>
          <Text style={pe.tagline}>
            {lang === 'sw' ? 'Kilimo bora. Biashara rahisi.' : 'Smart farming. Simple trade.'}
          </Text>
        </motion.View>

        {/* Trust badges */}
        <motion.View
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={pe.trustRow}
        >
          {TRUST.map((b, i) => (
            <View key={i} style={pe.trustBadge}>
              {b.icon}
              <Text style={pe.trustText}>{b.label}</Text>
            </View>
          ))}
        </motion.View>
      </View>

      {/* Language selection */}
      <motion.View initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Text style={pe.langLabel}>
          {lang === 'sw' ? 'Chagua lugha yako' : 'Choose your language'}
        </Text>
        <View style={pe.langRow}>
          {(['sw', 'en'] as AppLanguage[]).map((L) => (
            <TouchableOpacity
              key={L}
              onPress={() => { Haptics.selectionAsync(); setLang(L); }}
              activeOpacity={0.8}
              style={{ flex: 1 }}
            >
              <LinearGradient
                colors={lang === L ? ['rgba(62,207,142,0.22)', 'rgba(16,185,129,0.1)'] : ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)']}
                style={[pe.langBtn, lang === L && { borderColor: '#3ecf8e' }]}
              >
                <Globe size={18} color={lang === L ? '#3ecf8e' : 'rgba(255,255,255,0.5)'} />
                <Text style={[pe.langBtnText, lang === L && { color: '#3ecf8e' }]}>
                  {L === 'sw' ? '🇹🇿  Kiswahili' : '🇬🇧  English'}
                </Text>
                {lang === L && (
                  <View style={pe.langCheck}>
                    <Check size={11} color="#000" strokeWidth={3} />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </motion.View>
    </View>
  );
}

const pe = StyleSheet.create({
  logoWrap:    { width: 96, height: 96, borderRadius: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 28 },
  logoGrad:    { width: 96, height: 96, borderRadius: 48, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(62,207,142,0.35)' },
  appName:     { fontSize: 38, fontFamily: 'Inter_900Black', color: '#fff', textAlign: 'center', letterSpacing: -1.5 },
  tagline:     { fontSize: 16, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 8, letterSpacing: 0.2 },
  trustRow:    { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 24 },
  trustBadge:  { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(62,207,142,0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(62,207,142,0.2)' },
  trustText:   { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  langLabel:   { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' },
  langRow:     { flexDirection: 'row', gap: 10, paddingBottom: 8 },
  langBtn:     { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  langBtnText: { flex: 1, color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: 'Inter_700Bold' },
  langCheck:   { width: 18, height: 18, borderRadius: 9, backgroundColor: '#3ecf8e', justifyContent: 'center', alignItems: 'center' },
});

// ── Step 1: Welcome / Feature Showcase ──────────────────────────────────────

function WelcomeStep({ lang }: { lang: AppLanguage }) {
  const sw = lang === 'sw';
  return (
    <View style={{ flex: 1, paddingHorizontal: 24 }}>
      <View style={{ alignItems: 'center', paddingTop: 12 }}>
        <motion.View
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 16, stiffness: 120 }}
          style={ws.heroWrap}
        >
          <LinearGradient colors={['rgba(62,207,142,0.2)', 'rgba(62,207,142,0.04)']} style={ws.heroGrad}>
            <Sprout size={52} color="#3ecf8e" />
          </LinearGradient>
          <motion.View
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={[StyleSheet.absoluteFill, { borderRadius: 56, borderWidth: 2, borderColor: '#3ecf8e' }]}
          />
        </motion.View>

        <motion.View initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Text style={ws.title}>
            {sw ? 'Mwenzako wa Kidijiti' : 'Your Digital Partner'}
          </Text>
          <Text style={ws.sub}>
            {sw
              ? 'Teknolojia ya kisasa kwa mkulima wa Tanzania'
              : 'World-class technology for Tanzanian farmers'}
          </Text>
        </motion.View>

        {/* Stats bar */}
        <motion.View initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={ws.statsRow}>
          {[
            { val: '15K+', sub: sw ? 'Wakulima' : 'Farmers' },
            { val: '4.8★', sub: sw ? 'Ukadiriaji' : 'Rating' },
            { val: '31',   sub: sw ? 'Mikoa' : 'Regions' },
          ].map((s, i) => (
            <View key={i} style={ws.statItem}>
              <Text style={ws.statVal}>{s.val}</Text>
              <Text style={ws.statSub}>{s.sub}</Text>
            </View>
          ))}
        </motion.View>
      </View>

      {/* Feature grid */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 16 }}>
        <View style={ws.grid}>
          {FEATURES.map((f, i) => (
            <motion.View
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              style={{ width: (SW - 48 - 10) / 2 }}
            >
              <View style={[ws.card, { backgroundColor: f.bg, borderColor: f.border }]}>
                <View style={[ws.iconWrap, { backgroundColor: f.bg }]}>{f.icon}</View>
                <Text style={ws.cardLabel}>{lang === 'sw' ? f.labelSw : f.labelEn}</Text>
                <Text style={ws.cardSub}>{lang === 'sw' ? f.subSw : f.subEn}</Text>
              </View>
            </motion.View>
          ))}
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const ws = StyleSheet.create({
  heroWrap: { width: 112, height: 112, borderRadius: 56, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  heroGrad: { width: 112, height: 112, borderRadius: 56, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(62,207,142,0.3)' },
  title:    { fontSize: 28, fontFamily: 'Inter_900Black', color: '#fff', textAlign: 'center', letterSpacing: -0.8, lineHeight: 34 },
  sub:      { fontSize: 14, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  statsRow: { flexDirection: 'row', gap: 0, marginTop: 20, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden', alignSelf: 'stretch' },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: 'rgba(255,255,255,0.08)' },
  statVal:  { fontSize: 20, fontFamily: 'Inter_900Black', color: '#3ecf8e' },
  statSub:  { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  grid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card:     { borderRadius: 16, padding: 14, borderWidth: 1, gap: 6 },
  iconWrap: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  cardLabel:{ color: '#fff', fontSize: 13, fontFamily: 'Inter_800ExtraBold' },
  cardSub:  { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'Inter_500Medium', lineHeight: 15 },
});

// ── Step 2: Role Selection ───────────────────────────────────────────────────

function RoleStep({ lang, role, setRole }: { lang: AppLanguage; role: CanonicalRole; setRole: (r: CanonicalRole) => void }) {
  const sw = lang === 'sw';
  return (
    <View style={{ flex: 1, paddingHorizontal: 24 }}>
      <motion.View initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <View style={rs.eyebrow}>
          <UserCog size={14} color="#3ecf8e" />
          <Text style={rs.eyebrowText}>{sw ? 'HATUA YA 1 KWA 4' : 'STEP 1 OF 4'}</Text>
        </View>
        <Text style={rs.title}>{sw ? 'Wewe ni nani?' : 'Who are you?'}</Text>
        <Text style={rs.sub}>
          {sw ? 'Tutaonyesha vipengele vinavyokufaa zaidi' : "We'll personalise features just for you"}
        </Text>
      </motion.View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
        <View style={{ gap: 12 }}>
          {VISUAL_ROLES.map((r, i) => {
            const active = role === r.id;
            return (
              <motion.View
                key={r.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                <TouchableOpacity
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setRole(r.id); }}
                  activeOpacity={0.82}
                >
                  <LinearGradient
                    colors={active ? r.gradient : ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)']}
                    style={[rs.card, active && { borderColor: r.glow }]}
                  >
                    <View style={[rs.iconWrap, { backgroundColor: active ? `${r.glow}20` : 'rgba(255,255,255,0.06)', borderColor: active ? `${r.glow}40` : 'transparent', borderWidth: 1 }]}>
                      {r.icon}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[rs.name, active && { color: r.glow }]}>
                        {sw ? r.labelSw : r.labelEn}
                      </Text>
                      <Text style={rs.desc} numberOfLines={1}>
                        {sw ? r.descSw : r.descEn}
                      </Text>
                    </View>
                    {active ? (
                      <View style={[rs.check, { backgroundColor: r.glow }]}>
                        <Check size={13} color="#000" strokeWidth={3} />
                      </View>
                    ) : (
                      <View style={rs.checkEmpty} />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </motion.View>
            );
          })}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const rs = StyleSheet.create({
  eyebrow:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  eyebrowText: { color: '#3ecf8e', fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 2 },
  title:       { fontSize: 30, fontFamily: 'Inter_900Black', color: '#fff', letterSpacing: -0.8, lineHeight: 36 },
  sub:         { fontSize: 14, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.55)', marginTop: 6 },
  card:        { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 20, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)' },
  iconWrap:    { width: 58, height: 58, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  name:        { color: '#fff', fontSize: 15, fontFamily: 'Inter_800ExtraBold', marginBottom: 3 },
  desc:        { color: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: 'Inter_500Medium' },
  check:       { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  checkEmpty:  { width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },
});

// ── Step 3: Farm Profile ─────────────────────────────────────────────────────

function ProfileStep({
  lang, name, setName, region, setRegion, crops, toggleCrop,
}: {
  lang: AppLanguage; name: string; setName: (v: string) => void;
  region: string; setRegion: (v: string) => void;
  crops: string[]; toggleCrop: (c: string) => void;
}) {
  const sw = lang === 'sw';
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <motion.View initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <View style={ps.eyebrow}>
            <MapPin size={14} color="#3ecf8e" />
            <Text style={ps.eyebrowText}>{sw ? 'HATUA YA 2 KWA 4' : 'STEP 2 OF 4'}</Text>
          </View>
          <Text style={ps.title}>{sw ? 'Shamba lako' : 'Your Farm'}</Text>
          <Text style={ps.sub}>{sw ? 'Hii inaboresha mapendekezo ya AI yako' : 'This sharpens your AI recommendations'}</Text>
        </motion.View>

        {/* Name */}
        <motion.View initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Text style={ps.label}>{sw ? '👤  JINA LAKO KAMILI' : '👤  YOUR FULL NAME'}</Text>
          <View style={ps.inputWrap}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={sw ? 'k.m. Amina Mwalimu' : 'e.g. Amina Mwalimu'}
              placeholderTextColor="rgba(255,255,255,0.28)"
              style={ps.input}
              autoCapitalize="words"
            />
          </View>
        </motion.View>

        {/* Region */}
        <motion.View initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
          <Text style={ps.label}>{sw ? '📍  MKOA WAKO' : '📍  YOUR REGION'}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4, paddingRight: 8 }}>
            {REGIONS.map((r) => {
              const on = region === r;
              return (
                <TouchableOpacity key={r} onPress={() => { Haptics.selectionAsync(); setRegion(r); }} activeOpacity={0.8}>
                  <LinearGradient
                    colors={on ? ['rgba(62,207,142,0.22)', 'rgba(16,185,129,0.1)'] : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.03)']}
                    style={[ps.regionPill, on && { borderColor: '#3ecf8e' }]}
                  >
                    <Text style={[ps.regionText, on && { color: '#3ecf8e' }]}>{r}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </motion.View>

        {/* Crops */}
        <motion.View initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          <Text style={ps.label}>
            {sw ? `🌱  MAZAO YAKO (chagua 1–4) — ${crops.length}/4` : `🌱  YOUR CROPS (pick 1–4) — ${crops.length}/4`}
          </Text>
          <View style={ps.cropGrid}>
            {CROPS.map((c) => {
              const on = crops.includes(c.name);
              const locked = !on && crops.length >= 4;
              return (
                <TouchableOpacity key={c.name} onPress={() => !locked && toggleCrop(c.name)} activeOpacity={0.8} style={{ opacity: locked ? 0.3 : 1 }}>
                  <LinearGradient
                    colors={on ? ['rgba(62,207,142,0.2)', 'rgba(16,185,129,0.08)'] : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                    style={[ps.cropPill, on && { borderColor: '#3ecf8e' }]}
                  >
                    <Text style={ps.cropEmoji}>{c.emoji}</Text>
                    <Text style={[ps.cropText, on && { color: '#3ecf8e' }]}>{c.name}</Text>
                    {on && <View style={ps.cropCheck}><Check size={9} color="#000" strokeWidth={3} /></View>}
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </motion.View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const ps = StyleSheet.create({
  eyebrow:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, marginTop: 4 },
  eyebrowText:{ color: '#3ecf8e', fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 2 },
  title:      { fontSize: 30, fontFamily: 'Inter_900Black', color: '#fff', letterSpacing: -0.8, lineHeight: 36 },
  sub:        { fontSize: 14, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.55)', marginTop: 6, marginBottom: 4 },
  label:      { color: 'rgba(255,255,255,0.38)', fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.5, marginTop: 20, marginBottom: 10, textTransform: 'uppercase' },
  inputWrap:  { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  input:      { color: '#fff', fontSize: 17, fontFamily: 'Inter_600SemiBold', paddingHorizontal: 18, paddingVertical: 16 },
  regionPill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  regionText: { color: 'rgba(255,255,255,0.65)', fontSize: 13, fontFamily: 'Inter_700Bold' },
  cropGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cropPill:   { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  cropEmoji:  { fontSize: 14 },
  cropText:   { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Inter_700Bold' },
  cropCheck:  { width: 14, height: 14, borderRadius: 7, backgroundColor: '#3ecf8e', justifyContent: 'center', alignItems: 'center' },
});

// ── Step 4: Personalisation ──────────────────────────────────────────────────

function PersonaliseStep({
  lang, acres, setAcres, activity, setActivity, hasLivestock, setHasLivestock, hasIrrigation, setHasIrrigation,
}: {
  lang: AppLanguage; acres: string; setAcres: (v: string) => void;
  activity: FarmProfile['mainActivity']; setActivity: (v: FarmProfile['mainActivity']) => void;
  hasLivestock: boolean; setHasLivestock: (v: boolean) => void;
  hasIrrigation: boolean; setHasIrrigation: (v: boolean) => void;
}) {
  const sw = lang === 'sw';
  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
      <motion.View initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <View style={prs.eyebrow}>
          <Zap size={14} color="#3ecf8e" />
          <Text style={prs.eyebrowText}>{sw ? 'HATUA YA 3 KWA 4' : 'STEP 3 OF 4'}</Text>
        </View>
        <Text style={prs.title}>{sw ? 'Maelezo ya Shamba' : 'Farm Details'}</Text>
        <Text style={prs.sub}>{sw ? 'Dakika moja tu — inaboresha AI yako' : 'One minute — it powers your AI'}</Text>
      </motion.View>

      {/* Farm size */}
      <motion.View initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <Text style={prs.label}>{sw ? '📐  UKUBWA WA SHAMBA' : '📐  FARM SIZE'}</Text>
        <View style={prs.sizeGrid}>
          {SIZE_OPTIONS.map((opt) => {
            const on = acres === opt.value;
            return (
              <TouchableOpacity key={opt.value} onPress={() => { Haptics.selectionAsync(); setAcres(opt.value); }} activeOpacity={0.8} style={{ width: (SW - 48 - 10) / 2 }}>
                <LinearGradient
                  colors={on ? ['rgba(62,207,142,0.2)', 'rgba(16,185,129,0.08)'] : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                  style={[prs.sizeCard, on && { borderColor: '#3ecf8e' }]}
                >
                  <Text style={[prs.sizeText, on && { color: '#3ecf8e' }]}>{opt.label}</Text>
                  {on && <Check size={14} color="#3ecf8e" />}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </motion.View>

      {/* Main activity */}
      <motion.View initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
        <Text style={prs.label}>{sw ? '🌿  SHUGHULI KUU' : '🌿  MAIN ACTIVITY'}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {([
            { val: 'mazao' as const,      labelSw: '🌱 Mazao',       labelEn: '🌱 Crops' },
            { val: 'mifugo' as const,     labelSw: '🐄 Mifugo',      labelEn: '🐄 Livestock' },
            { val: 'mchanganyiko' as const,labelSw: '🔀 Mchanganyiko', labelEn: '🔀 Mixed' },
          ]).map((a) => {
            const on = activity === a.val;
            return (
              <TouchableOpacity key={a.val} onPress={() => { Haptics.selectionAsync(); setActivity(a.val); }} activeOpacity={0.8} style={{ flex: 1 }}>
                <LinearGradient
                  colors={on ? ['rgba(62,207,142,0.2)', 'rgba(16,185,129,0.08)'] : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                  style={[prs.actCard, on && { borderColor: '#3ecf8e' }]}
                >
                  <Text style={[prs.actText, on && { color: '#3ecf8e' }]}>{sw ? a.labelSw : a.labelEn}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </motion.View>

      {/* Toggles */}
      <motion.View initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
        {[
          { label: sw ? '🐄 Una mifugo?' : '🐄 Have livestock?', val: hasLivestock, set: setHasLivestock },
          { label: sw ? '💧 Una umwagiliaji?' : '💧 Have irrigation?', val: hasIrrigation, set: setHasIrrigation },
        ].map((t, i) => (
          <View key={i} style={prs.toggleRow}>
            <Text style={prs.toggleLabel}>{t.label}</Text>
            <Switch value={t.val} onValueChange={t.set} trackColor={{ false: 'rgba(255,255,255,0.15)', true: '#3ecf8e' }} thumbColor="#fff" />
          </View>
        ))}
      </motion.View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const prs = StyleSheet.create({
  eyebrow:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10, marginTop: 4 },
  eyebrowText:{ color: '#3ecf8e', fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 2 },
  title:      { fontSize: 30, fontFamily: 'Inter_900Black', color: '#fff', letterSpacing: -0.8, lineHeight: 36 },
  sub:        { fontSize: 14, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.55)', marginTop: 6, marginBottom: 4 },
  label:      { color: 'rgba(255,255,255,0.38)', fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.5, marginTop: 20, marginBottom: 10, textTransform: 'uppercase' },
  sizeGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sizeCard:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 16, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  sizeText:   { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: 'Inter_700Bold' },
  actCard:    { alignItems: 'center', paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  actText:    { color: 'rgba(255,255,255,0.65)', fontSize: 12, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  toggleRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)', marginTop: 4 },
  toggleLabel:{ color: '#fff', fontSize: 14, fontFamily: 'Inter_600SemiBold', flex: 1 },
});

// ── Step 5: Success Launch ───────────────────────────────────────────────────

function SuccessStep({ lang, name, role }: { lang: AppLanguage; name: string; role: CanonicalRole }) {
  const sw = lang === 'sw';
  const features = [
    { icon: '🤖', text: sw ? 'Sankofa AI amsha' : 'Sankofa AI activated' },
    { icon: '📷', text: sw ? 'Utambuzi wa mazao umefunguliwa' : 'Crop diagnosis unlocked' },
    { icon: '📊', text: sw ? 'Bei za soko zinapatikana' : 'Market prices live' },
    { icon: '🆔', text: sw ? 'Agro ID imesajiliwa' : 'Agro ID registered' },
  ];

  return (
    <View style={{ flex: 1, paddingHorizontal: 24, alignItems: 'center' }}>
      {/* Celebration rings */}
      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 12, marginBottom: 24 }}>
        {[{ size: 160, opacity: 0.06, delay: 0 }, { size: 130, opacity: 0.1, delay: 0.3 }, { size: 104, opacity: 0.18, delay: 0.6 }].map((r, i) => (
          <motion.View
            key={i}
            animate={{ scale: [1, 1.08, 1], opacity: [r.opacity, r.opacity * 1.6, r.opacity] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: r.delay }}
            style={{
              position: 'absolute',
              width: r.size, height: r.size, borderRadius: r.size / 2,
              backgroundColor: '#3ecf8e',
            }}
          />
        ))}
        {/* Check circle */}
        <motion.View
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 120, delay: 0.2 }}
          style={ss.checkCircle}
        >
          <LinearGradient colors={['#3ecf8e', '#0ea95b']} style={ss.checkGrad}>
            <Check size={44} color="#000" strokeWidth={3} />
          </LinearGradient>
        </motion.View>
      </View>

      <motion.View initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{ alignItems: 'center' }}>
        <Text style={ss.congrats}>{sw ? '🎉 Umefanikiwa!' : '🎉 You\'re all set!'}</Text>
        <Text style={ss.welcomeMsg}>
          {sw ? `Karibu, ${name || 'Mkulima'}!` : `Welcome, ${name || 'Farmer'}!`}
        </Text>
        <Text style={ss.sub}>
          {sw ? 'Agro ID yako imesajiliwa. Kilimo bora linaanza sasa.' : 'Your Agro ID is registered. Better farming starts now.'}
        </Text>
      </motion.View>

      {/* Features unlocked */}
      <motion.View initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={ss.unlockedCard}>
        <Text style={ss.unlockedTitle}>{sw ? 'Imefunguliwa:' : 'Unlocked for you:'}</Text>
        {features.map((f, i) => (
          <motion.View
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            style={ss.featureRow}
          >
            <Text style={ss.featureIcon}>{f.icon}</Text>
            <Text style={ss.featureText}>{f.text}</Text>
            <View style={ss.tick}><Check size={10} color="#000" strokeWidth={3} /></View>
          </motion.View>
        ))}
      </motion.View>

      {/* Agro ID badge */}
      <motion.View
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
        style={{ alignSelf: 'stretch' }}
      >
        <LinearGradient colors={['rgba(62,207,142,0.14)', 'rgba(62,207,142,0.04)']} style={ss.idBadge}>
          <Award size={16} color="#3ecf8e" />
          <Text style={ss.idText}>
            {sw ? `${roleLabel(role)} · FREE TIER` : `${roleLabel(role)} · FREE TIER`}
          </Text>
          <View style={ss.activeDot} />
          <Text style={ss.activeText}>ACTIVE</Text>
        </LinearGradient>
      </motion.View>
    </View>
  );
}

const ss = StyleSheet.create({
  checkCircle: { width: 96, height: 96, borderRadius: 48, padding: 4, backgroundColor: 'rgba(62,207,142,0.15)' },
  checkGrad:   { flex: 1, borderRadius: 44, justifyContent: 'center', alignItems: 'center' },
  congrats:    { fontSize: 30, fontFamily: 'Inter_900Black', color: '#fff', textAlign: 'center', letterSpacing: -0.5 },
  welcomeMsg:  { fontSize: 22, fontFamily: 'Inter_800ExtraBold', color: '#3ecf8e', textAlign: 'center', marginTop: 6 },
  sub:         { fontSize: 13, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 8, lineHeight: 19 },
  unlockedCard:{ alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 16, marginTop: 20, gap: 10 },
  unlockedTitle:{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.5, marginBottom: 4 },
  featureRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureIcon: { fontSize: 18, width: 26 },
  featureText: { flex: 1, color: '#fff', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  tick:        { width: 18, height: 18, borderRadius: 9, backgroundColor: '#3ecf8e', justifyContent: 'center', alignItems: 'center' },
  idBadge:     { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(62,207,142,0.25)', padding: 12, marginTop: 14 },
  idText:      { flex: 1, color: '#3ecf8e', fontSize: 12, fontFamily: 'Inter_700Bold' },
  activeDot:   { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3ecf8e' },
  activeText:  { color: '#3ecf8e', fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1 },
});

// ── Main Orchestrator ────────────────────────────────────────────────────────

export default function OnboardingV3() {
  const router = useRouter();
  const setLanguage           = useKilimoStore((s) => s.setLanguage);
  const setAgroId             = useKilimoStore((s) => s.setAgroId);
  const setFarmProfile        = useKilimoStore((s) => s.setFarmProfile);
  const setOnboardingComplete = useKilimoStore((s) => s.setOnboardingComplete);

  const [step,          setStep]         = useState<Step>(0);
  const [direction,     setDirection]    = useState<1 | -1>(1);
  const [lang,          setLang]         = useState<AppLanguage>('sw');
  const [role,          setRole]         = useState<CanonicalRole>('farmer');
  const [name,          setName]         = useState('');
  const [region,        setRegion]       = useState(REGIONS[0]);
  const [crops,         setCrops]        = useState<string[]>([]);
  const [acres,         setAcres]        = useState('2.5');
  const [activity,      setActivity]     = useState<FarmProfile['mainActivity']>('mazao');
  const [hasLivestock,  setHasLivestock] = useState(false);
  const [hasIrrigation, setHasIrrigation]= useState(false);

  const canContinue = useMemo(() => {
    if (step === 0) return true;
    if (step === 1) return true;
    if (step === 2) return !!role;
    if (step === 3) return name.trim().length >= 2 && crops.length > 0;
    if (step === 4) return !!acres && parseFloat(acres) > 0;
    return true;
  }, [step, role, name, crops, acres]);

  function goNext() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 0) setLanguage(lang);
    setDirection(1);
    if (step < (TOTAL - 1)) setStep((s) => (s + 1) as Step);
  }

  function goBack() {
    Haptics.selectionAsync();
    setDirection(-1);
    if (step > 0) setStep((s) => (s - 1) as Step);
  }

  function finish() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setFarmProfile({
      primaryCrops: crops, region,
      farmSizeAcres: parseFloat(acres) || 1,
      mainActivity: activity, hasLivestock, hasIrrigation,
    });
    const uid = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
      : `${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setAgroId({
      id: `KILIMO-${uid.slice(0, 4)}-${uid.slice(4, 8)}`,
      name: name.trim() || 'Mkulima',
      role,
      location: region,
      tier: 'Free',
      joinDate: new Date().getFullYear().toString(),
      mpesaLinked: false,
      biometricEnabled: false,
    });
    setOnboardingComplete(true);
    router.replace('/(tabs)');
  }

  function toggleCrop(c: string) {
    Haptics.selectionAsync();
    setCrops((p) => p.includes(c) ? p.filter((x) => x !== c) : (p.length < 4 ? [...p, c] : p));
  }

  const bg = STEP_GRADIENTS[step];
  const sw = lang === 'sw';
  const isLast = step === TOTAL - 1;

  const ctaLabel = () => {
    if (isLast) return sw ? 'Ingia kwenye Dashibodi' : 'Enter Dashboard';
    if (step === 0) return sw ? 'Anza Sasa' : 'Get Started';
    return sw ? 'Endelea' : 'Continue';
  };

  return (
    <View style={g.root}>
      <StatusBar barStyle="light-content" />

      {/* Animated background gradient */}
      <LinearGradient colors={bg} style={StyleSheet.absoluteFill} />

      {/* Floating orbs — persistent */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <FloatingOrb color="#3ecf8e18" size={380} top={-120} left={-120} delay={0} />
        <FloatingOrb color="#8b5cf618" size={280} top={SH * 0.4} left={-80} delay={1.5} />
        <FloatingOrb color="#3b82f614" size={220} top={SH * 0.1} left={SW * 0.6} delay={2.5} />
        <FloatingOrb color="#3ecf8e10" size={160} top={SH * 0.7} left={SW * 0.55} delay={1} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        {/* Progress */}
        <ProgressBar step={step} />

        {/* Top nav row */}
        <View style={g.navRow}>
          {step > 0 && step < TOTAL - 1 ? (
            <TouchableOpacity onPress={goBack} style={g.backBtn} accessibilityLabel="Back">
              <ChevronLeft size={20} color="rgba(255,255,255,0.8)" />
              <Text style={g.backText}>{sw ? 'Rudi' : 'Back'}</Text>
            </TouchableOpacity>
          ) : <View style={{ width: 70 }} />}
          <Text style={g.stepCount}>{step + 1} / {TOTAL}</Text>
          {step < TOTAL - 1 && step > 0 ? (
            <TouchableOpacity onPress={goNext} style={g.skipBtn} accessibilityLabel="Skip">
              <Text style={g.skipText}>{sw ? 'Ruka' : 'Skip'}</Text>
            </TouchableOpacity>
          ) : <View style={{ width: 70 }} />}
        </View>

        {/* Step content */}
        <View style={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.View
              key={`step-${step}`}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ type: 'spring', damping: 24, stiffness: 200 }}
              style={{ flex: 1 }}
            >
              {step === 0 && <PowerEntry lang={lang} setLang={setLang} />}
              {step === 1 && <WelcomeStep lang={lang} />}
              {step === 2 && <RoleStep lang={lang} role={role} setRole={setRole} />}
              {step === 3 && (
                <ProfileStep
                  lang={lang} name={name} setName={setName}
                  region={region} setRegion={setRegion}
                  crops={crops} toggleCrop={toggleCrop}
                />
              )}
              {step === 4 && (
                <PersonaliseStep
                  lang={lang} acres={acres} setAcres={setAcres}
                  activity={activity} setActivity={setActivity}
                  hasLivestock={hasLivestock} setHasLivestock={setHasLivestock}
                  hasIrrigation={hasIrrigation} setHasIrrigation={setHasIrrigation}
                />
              )}
              {step === 5 && <SuccessStep lang={lang} name={name} role={role} />}
            </motion.View>
          </AnimatePresence>
        </View>

        {/* CTA footer */}
        <View style={g.footer}>
          <TouchableOpacity
            onPress={isLast ? finish : goNext}
            disabled={!canContinue}
            activeOpacity={0.88}
            style={[g.ctaWrap, !canContinue && { opacity: 0.38 }]}
            accessibilityLabel={ctaLabel()}
          >
            <LinearGradient
              colors={['#3ecf8e', '#0ea95b']}
              style={g.ctaGrad}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <Text style={g.ctaText}>{ctaLabel()}</Text>
              <ChevronRight size={22} color="#000" strokeWidth={3} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const g = StyleSheet.create({
  root:     { flex: 1, backgroundColor: '#0a0a0f' },
  navRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 4 },
  backBtn:  { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 4, minWidth: 70 },
  backText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  stepCount:{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Inter_700Bold', letterSpacing: 1.5 },
  skipBtn:  { alignItems: 'flex-end', minWidth: 70, paddingVertical: 6, paddingHorizontal: 4 },
  skipText: { color: 'rgba(255,255,255,0.35)', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  footer:   { paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 32 : 20, paddingTop: 10 },
  ctaWrap:  { borderRadius: 20, overflow: 'hidden' },
  ctaGrad:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 19 },
  ctaText:  { color: '#000', fontSize: 16, fontFamily: 'Inter_900Black', letterSpacing: 0.3 },
});
