/**
 * Expert Consultations — Wataalamu Walioidhinishwa
 * Directory · specialty filters · video / chat request · upcoming sessions
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import {
  Video, MessageSquare, Star, GraduationCap, Calendar, X,
  AlertTriangle, Clock, Languages, CheckCircle2, Filter,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import PageScaffold, { GlassCard, SectionHeader, EmptyState } from '../components/PageScaffold';
import { useTheme } from '../constants/Theme';
import { useFarmDataStore, Expert } from '../store/useFarmDataStore';
import { Gate } from '../lib/access';

const fmt = (n: number) => new Intl.NumberFormat('sw-TZ').format(n);

// ─── Status meta ─────────────────────────────────────────────────────────────
const STATUS_META = {
  requested:  { color: '#f59e0b', label: 'Imeombwa'    },
  scheduled:  { color: '#3b82f6', label: 'Imepangwa'   },
  completed:  { color: '#22d15a', label: 'Imekamilika' },
  cancelled:  { color: '#ef4444', label: 'Imefutwa'    },
  available:  { color: '#94a3b8', label: 'Inapatikana' },
};

// ─── Specialty filters ────────────────────────────────────────────────────────
const FILTERS = [
  { id: 'all',        label: 'Wote'        },
  { id: 'soil',       label: 'Udongo'      },
  { id: 'crop',       label: 'Mazao'       },
  { id: 'livestock',  label: 'Mifugo'      },
  { id: 'water',      label: 'Maji'        },
  { id: 'business',   label: 'Biashara'    },
  { id: 'organic',    label: 'Organic'     },
  { id: 'tech',       label: 'Teknolojia'  },
];

const SPECIALTY_MAP: Record<string, string> = {
  'Udongo & Mbolea':          'soil',
  'Wadudu & Magonjwa':        'crop',
  'Afya ya Mifugo':           'livestock',
  'Kahawa & Korosho':         'crop',
  'Bustani & Mboga':          'crop',
  'Umwagiliaji & Maji':       'water',
  'Mpunga & Nafaka':          'crop',
  'Biashara ya Mazao':        'business',
  'Viumbe-Hai & Organic':     'organic',
  'Teknolojia ya Kilimo':     'tech',
};

// ─── Star rating row ──────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={10} color="#f59e0b" fill={i <= full ? '#f59e0b' : 'transparent'} />
      ))}
      <Text style={s.ratingNum}>{rating.toFixed(2)}</Text>
    </View>
  );
}

// ─── Expert card ──────────────────────────────────────────────────────────────
function ExpertCard({
  e, idx, onRequest,
}: {
  e: Expert; idx: number; onRequest: (e: Expert, c: 'video' | 'chat') => void;
}) {
  const { colors, isDark } = useTheme();
  const accentMap: Record<string, string> = {
    'Udongo & Mbolea': '#22d15a', 'Wadudu & Magonjwa': '#ef4444',
    'Afya ya Mifugo': '#f59e0b', 'Kahawa & Korosho': '#a16207',
    'Bustani & Mboga': '#22d15a', 'Umwagiliaji & Maji': '#3b82f6',
    'Mpunga & Nafaka': '#f59e0b', 'Biashara ya Mazao': '#8b5cf6',
    'Viumbe-Hai & Organic': '#10b981', 'Teknolojia ya Kilimo': '#0ea5e9',
  };
  const accent = accentMap[e.specialty] ?? colors.primary;
  const online = idx % 3 !== 2;

  return (
    <Animated.View entering={FadeInDown.delay(idx * 55).springify()}>
      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        {/* Top accent strip */}
        <View style={{ height: 3, backgroundColor: accent }} />

        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
            {/* Avatar */}
            <View style={{ position: 'relative' }}>
              {e.avatarUrl ? (
                <Image
                  source={{ uri: e.avatarUrl }}
                  style={[s.avatar, { borderColor: accent + '60' }]}
                />
              ) : (
                <View style={[s.avatar, { backgroundColor: accent + '18', alignItems: 'center', justifyContent: 'center', borderColor: accent + '30' }]}>
                  <GraduationCap size={24} color={accent} />
                </View>
              )}
              <View style={[s.onlineDot, { backgroundColor: online ? '#22d15a' : '#94a3b8', borderColor: colors.card }]} />
            </View>

            {/* Info */}
            <View style={{ flex: 1 }}>
              <Text style={[s.expName, { color: colors.text }]}>{e.name}</Text>
              <View style={[s.specialtyPill, { backgroundColor: accent + '15' }]}>
                <Text style={[s.specialtyText, { color: accent }]}>{e.specialty}</Text>
              </View>
              <View style={{ marginTop: 8, gap: 4 }}>
                <StarRating rating={e.rating} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <View style={s.metaChip}>
                    <Clock size={9} color={colors.textMute} />
                    <Text style={[s.metaChipText, { color: colors.textMute }]}>{e.yearsExperience}+ miaka</Text>
                  </View>
                  <View style={s.metaChip}>
                    <Languages size={9} color={colors.textMute} />
                    <Text style={[s.metaChipText, { color: colors.textMute }]}>{e.languages.join(' · ')}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Rate + actions */}
          <View style={[s.footer, { borderTopColor: colors.border }]}>
            <View>
              <Text style={[s.rateLabel, { color: colors.textMute }]}>Kwa saa</Text>
              <Text style={[s.rateValue, { color: colors.text }]}>
                TZS {fmt(e.ratePerHourTZS)}<Text style={[s.rateSlash, { color: colors.textMute }]}>/hr</Text>
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onRequest(e, 'chat'); }}
                style={[s.actBtn, { backgroundColor: accent + '15', borderColor: accent + '40' }]}
              >
                <MessageSquare size={13} color={accent} />
                <Text style={[s.actText, { color: accent }]}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); onRequest(e, 'video'); }}
                style={[s.actBtn, { backgroundColor: accent, borderColor: accent }]}
              >
                <Video size={13} color="#fff" />
                <Text style={[s.actText, { color: '#fff' }]}>Video</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function ConsultationsScreen() {
  const { colors } = useTheme();
  const experts = useFarmDataStore((s) => s.experts);
  const consultations = useFarmDataStore((s) => s.consultations);
  const requestConsultation = useFarmDataStore((s) => s.requestConsultation);
  const cancelConsultation = useFarmDataStore((s) => s.cancelConsultation);

  const [activeFilter, setActiveFilter] = useState('all');

  const upcoming = consultations.filter((c) => c.status === 'scheduled' || c.status === 'requested');

  const filtered = activeFilter === 'all'
    ? experts
    : experts.filter((e) => SPECIALTY_MAP[e.specialty] === activeFilter);

  function handleRequest(expert: Expert, channel: 'video' | 'chat') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    requestConsultation(expert.id, `Mashauriano na ${expert.name}`, channel);
  }

  return (
    <Gate feature="expert_consultations" fallback={<PageScaffold title="Wataalamu" badge="EXPERTS"><AccessDenied /></PageScaffold>}>
      <PageScaffold title="Wataalamu" subtitle="Wataalam waliothibitishwa" badge="CONSULTATIONS">

        {/* ── Upcoming sessions ── */}
        {upcoming.length > 0 && (
          <>
            <SectionHeader title={`Yanayokuja · ${upcoming.length}`} />
            <View style={{ paddingHorizontal: 24, gap: 10 }}>
              {upcoming.map((c) => {
                const e = experts.find((x) => x.id === c.expertId);
                const meta = STATUS_META[c.status];
                return (
                  <GlassCard key={c.id} style={{ padding: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={[s.sessionIcon, { backgroundColor: colors.primary + '15' }]}>
                        {c.channel === 'video'
                          ? <Video size={18} color={colors.primary} />
                          : <MessageSquare size={18} color={colors.primary} />}
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[s.topic, { color: colors.text }]} numberOfLines={1}>{c.topic}</Text>
                        <Text style={[s.expertName, { color: colors.textMute }]}>{e?.name ?? 'Mtaalam asiyejulikana'}</Text>
                      </View>
                      <View style={[s.statusBadge, { backgroundColor: meta.color + '20' }]}>
                        <Text style={[s.statusText, { color: meta.color }]}>{meta.label}</Text>
                      </View>
                    </View>
                    {c.scheduledFor && (
                      <View style={[s.schedRow, { borderTopColor: colors.border }]}>
                        <Calendar size={11} color={colors.textMute} />
                        <Text style={[s.schedText, { color: colors.textMute }]}>
                          {new Date(c.scheduledFor).toLocaleString('sw-TZ', { dateStyle: 'medium', timeStyle: 'short' })}
                        </Text>
                        <TouchableOpacity
                          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); cancelConsultation(c.id); }}
                          style={s.cancelBtn}
                        >
                          <X size={11} color="#ef4444" />
                          <Text style={[s.cancelText, { color: '#ef4444' }]}>Futa</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </GlassCard>
                );
              })}
            </View>
          </>
        )}

        {/* ── Specialty filter chips ── */}
        <View style={{ paddingHorizontal: 24, marginTop: 20, marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Filter size={12} color={colors.textMute} />
            <Text style={{ fontSize: 10, fontFamily: 'Inter_800ExtraBold', color: colors.textMute, letterSpacing: 1.2 }}>CHAGUA UTAALAMU</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {FILTERS.map((f) => {
                const active = activeFilter === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    onPress={() => { Haptics.selectionAsync(); setActiveFilter(f.id); }}
                    style={[s.filterChip, {
                      backgroundColor: active ? colors.primary : colors.primary + '10',
                      borderColor: active ? colors.primary : colors.primary + '30',
                    }]}
                  >
                    <Text style={[s.filterText, { color: active ? '#000' : colors.primary }]}>{f.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* ── Expert list ── */}
        <SectionHeader title={`Wataalamu · ${filtered.length} wanapatikana`} />
        <View style={{ paddingHorizontal: 24, gap: 12 }}>
          {filtered.length === 0 ? (
            <GlassCard style={{ padding: 24, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.textMute }}>
                Hakuna wataalamu wa aina hii kwa sasa.
              </Text>
            </GlassCard>
          ) : (
            filtered.map((e, idx) => (
              <ExpertCard key={e.id} e={e} idx={idx} onRequest={handleRequest} />
            ))
          )}
        </View>

      </PageScaffold>
    </Gate>
  );
}

function AccessDenied() {
  return (
    <EmptyState
      icon={<AlertTriangle size={36} color="#f59e0b" />}
      title="Haipatikani"
      body="Mashauriano na wataalamu hayapatikani kwa jukumu lako."
    />
  );
}

const s = StyleSheet.create({
  sessionIcon: { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  topic:       { fontSize: 14, fontFamily: 'Inter_700Bold' },
  expertName:  { fontSize: 12, fontFamily: 'Inter_600SemiBold', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText:  { fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.3 },
  schedRow:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 10, borderTopWidth: 1 },
  schedText:   { fontSize: 11, fontFamily: 'Inter_600SemiBold', flex: 1 },
  cancelBtn:   { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cancelText:  { fontSize: 11, fontFamily: 'Inter_800ExtraBold' },

  avatar:        { width: 58, height: 58, borderRadius: 18, borderWidth: 2 },
  onlineDot:     { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, borderWidth: 2 },
  expName:       { fontSize: 15, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.3 },
  specialtyPill: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 4 },
  specialtyText: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.3 },
  metaChip:      { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaChipText:  { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  ratingNum:     { fontSize: 11, fontFamily: 'Inter_800ExtraBold', color: '#f59e0b', marginLeft: 4 },

  footer:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTopWidth: 1 },
  rateLabel:  { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.5, marginBottom: 2 },
  rateValue:  { fontSize: 16, fontFamily: 'InstrumentSerif_400Regular' },
  rateSlash:  { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  actBtn:     { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1 },
  actText:    { fontSize: 12, fontFamily: 'Inter_700Bold' },

  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
});
