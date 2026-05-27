/**
 * Expert Consultations — schedule video/chat with certified agronomists
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Video, MessageSquare, Star, GraduationCap, Calendar, X, AlertTriangle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import PageScaffold, { GlassCard, SectionHeader, EmptyState } from '../components/PageScaffold';
import { useTheme } from '../constants/Theme';
import { useFarmDataStore, Expert } from '../store/useFarmDataStore';
import { Gate } from '../lib/access';

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

const STATUS_META = {
  requested: { color: '#f59e0b', label: 'Imeombwa' },
  scheduled: { color: '#3b82f6', label: 'Imepangwa' },
  completed: { color: '#22d15a', label: 'Imekamilika' },
  cancelled: { color: '#ef4444', label: 'Imefutwa' },
  available: { color: '#94a3b8', label: 'Inapatikana' },
};

export default function ConsultationsScreen() {
  const { colors } = useTheme();
  const experts = useFarmDataStore((s) => s.experts);
  const consultations = useFarmDataStore((s) => s.consultations);
  const requestConsultation = useFarmDataStore((s) => s.requestConsultation);
  const cancelConsultation = useFarmDataStore((s) => s.cancelConsultation);

  const upcoming = consultations.filter((c) => c.status === 'scheduled' || c.status === 'requested');

  function handleRequest(expert: Expert, channel: 'video' | 'chat') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    requestConsultation(expert.id, `Consultation with ${expert.name}`, channel);
  }

  return (
    <Gate feature="expert_consultations" fallback={<PageScaffold title="Wataalamu" badge="EXPERTS"><AccessDenied /></PageScaffold>}>
      <PageScaffold title="Wataalamu" subtitle="Certified agronomists" badge="CONSULTATIONS">

        {upcoming.length > 0 && (
          <>
            <SectionHeader title={`Vinakuja · ${upcoming.length} upcoming`} />
            <View style={{ paddingHorizontal: 24, gap: 10 }}>
              {upcoming.map((c) => {
                const e = experts.find((x) => x.id === c.expertId);
                const meta = STATUS_META[c.status];
                return (
                  <GlassCard key={c.id} style={{ padding: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {c.channel === 'video' ? <Video size={20} color={colors.primary} /> : <MessageSquare size={20} color={colors.primary} />}
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[s.topic, { color: colors.text }]} numberOfLines={1}>{c.topic}</Text>
                        <Text style={[s.expert, { color: colors.textMute }]}>{e?.name ?? 'Unknown expert'}</Text>
                      </View>
                      <View style={[s.statusBadge, { backgroundColor: meta.color + '25' }]}>
                        <Text style={[s.statusText, { color: meta.color }]}>{meta.label}</Text>
                      </View>
                    </View>
                    {c.scheduledFor && (
                      <View style={[s.schedRow, { borderTopColor: colors.border }]}>
                        <Calendar size={11} color={colors.textMute} />
                        <Text style={[s.schedText, { color: colors.textMute }]}>
                          {new Date(c.scheduledFor).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                        </Text>
                        <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); cancelConsultation(c.id); }} style={s.cancelBtn}>
                          <X size={11} color="#ef4444" />
                          <Text style={[s.cancelText, { color: '#ef4444' }]}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </GlassCard>
                );
              })}
            </View>
          </>
        )}

        <SectionHeader title="Wataalamu Walothibitishwa" />
        <View style={{ paddingHorizontal: 24, gap: 10 }}>
          {experts.map((e) => (
            <GlassCard key={e.id} style={{ padding: 18 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {e.avatarUrl ? (
                  <Image source={{ uri: e.avatarUrl }} style={[s.avatar, { borderColor: colors.primary + '40' }]} />
                ) : (
                  <View style={[s.avatar, { backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center' }]}>
                    <GraduationCap size={22} color={colors.primary} />
                  </View>
                )}
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[s.expName, { color: colors.text }]}>{e.name}</Text>
                  <Text style={[s.specialty, { color: colors.primary }]}>{e.specialty}</Text>
                  <View style={s.metaRow}>
                    <Star size={11} color="#f59e0b" fill="#f59e0b" />
                    <Text style={[s.metaText, { color: colors.textMute }]}>{e.rating.toFixed(2)}</Text>
                    <Text style={[s.metaText, { color: colors.textMute, marginLeft: 8 }]}>· {e.yearsExperience}+ yrs</Text>
                    <Text style={[s.metaText, { color: colors.textMute, marginLeft: 8 }]}>· {e.languages.join(', ')}</Text>
                  </View>
                </View>
              </View>

              <View style={[s.rateRow, { borderTopColor: colors.border }]}>
                <Text style={[s.rate, { color: colors.text }]}>TZS {fmt(e.ratePerHourTZS)}<Text style={[s.rateUnit, { color: colors.textMute }]}>/hr</Text></Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity onPress={() => handleRequest(e, 'chat')} style={[s.actBtn, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
                    <MessageSquare size={12} color={colors.primary} />
                    <Text style={[s.actText, { color: colors.primary }]}>Chat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRequest(e, 'video')} style={[s.actBtn, { backgroundColor: colors.primary }]}>
                    <Video size={12} color="#000" />
                    <Text style={[s.actText, { color: '#000' }]}>Video</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          ))}
        </View>
      </PageScaffold>
    </Gate>
  );
}

function AccessDenied() {
  return <EmptyState icon={<AlertTriangle size={36} color="#f59e0b" />} title="Haipatikani" body="Expert consultations hazipatikani kwa jukumu lako." />;
}

const s = StyleSheet.create({
  topic: { fontSize: 14, fontFamily: 'InstrumentSerif_400Regular' },
  expert: { fontSize: 12, fontFamily: 'Inter_600SemiBold', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 10, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: 0.5 },
  schedRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 12, paddingTop: 10, borderTopWidth: 1 },
  schedText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', flex: 1 },
  cancelBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cancelText: { fontSize: 11, fontFamily: 'Inter_800ExtraBold' },
  avatar: { width: 56, height: 56, borderRadius: 18, borderWidth: 2 },
  expName: { fontSize: 15, fontFamily: 'InstrumentSerif_400Regular' },
  specialty: { fontSize: 11, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.5, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 6 },
  metaText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTopWidth: 1 },
  rate: { fontSize: 16, fontFamily: 'InstrumentSerif_400Regular' },
  rateUnit: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  actBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  actText: { fontSize: 11, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: 0.3 },
});
