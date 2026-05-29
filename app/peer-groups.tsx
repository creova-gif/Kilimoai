/**
 * Peer Groups — Vikundi vya Wakulima
 * Groups list · forum · external community links · upcoming events
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Linking, Alert,
} from 'react-native';
import {
  Users, Send, MessageSquare, LogIn, LogOut, AlertTriangle,
  ExternalLink, Calendar, MapPin, Bell, ChevronRight, Hash,
  Globe, Phone,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import PageScaffold, { GlassCard, SectionHeader, EmptyState } from '../components/PageScaffold';
import { useTheme } from '../constants/Theme';
import { useFarmDataStore } from '../store/useFarmDataStore';
import { useKilimoStore } from '../store/useKilimoStore';
import { Gate } from '../lib/access';

// ─── Static external community data ──────────────────────────────────────────
const COMMUNITY_LINKS = [
  {
    id: 'tg1',
    title: 'KILIMO AI · Telegram',
    subtitle: 'Habari za haraka · Masasisho ya bei',
    url: 'https://t.me/kilimoai_tz',
    type: 'telegram',
    members: '3,420',
    color: '#229ED9',
  },
  {
    id: 'wa1',
    title: 'Wakulima wa Tanzania · WhatsApp',
    subtitle: 'Msaada wa pamoja · Mbinu bora',
    url: 'https://chat.whatsapp.com/kilimotz',
    type: 'whatsapp',
    members: '1,800',
    color: '#25D366',
  },
  {
    id: 'fb1',
    title: 'Kilimo Bora Tanzania · Facebook',
    subtitle: 'Picha · Mafunzo · Habari',
    url: 'https://facebook.com/groups/kilimobora',
    type: 'facebook',
    members: '12,500',
    color: '#1877F2',
  },
];

const UPCOMING_EVENTS = [
  {
    id: 'ev1',
    title: 'Mafunzo ya Udongo — Arusha',
    titleEn: 'Soil Health Training — Arusha',
    date: 'Juni 8, 2026',
    time: '09:00 AM',
    location: 'Arusha Agricultural Expo Centre',
    organizer: 'TARI Tengeru',
    type: 'training',
    spots: 40,
    spotsLeft: 14,
    tag: 'FREE',
  },
  {
    id: 'ev2',
    title: 'Soko la Mbegu — Mbeya',
    titleEn: 'Seed Fair — Mbeya',
    date: 'Juni 15, 2026',
    time: '07:00 AM',
    location: 'Mbeya Market Square',
    organizer: 'Mbeya Farmers Coop',
    type: 'market',
    spots: 200,
    spotsLeft: 88,
    tag: 'SOKO',
  },
  {
    id: 'ev3',
    title: 'Webinar: Kilimo cha Kahawa Daraja la 1',
    titleEn: 'Webinar: Grade 1 Coffee Farming',
    date: 'Juni 22, 2026',
    time: '02:00 PM',
    location: 'Online (Zoom)',
    organizer: 'TACRI',
    type: 'webinar',
    spots: 500,
    spotsLeft: 212,
    tag: 'ONLINE',
  },
];

const EVENT_COLOR: Record<string, string> = {
  training: '#8b5cf6', market: '#f59e0b', webinar: '#3b82f6',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function timeAgo(iso?: string) {
  if (!iso) return '';
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function openLink(url: string, name: string) {
  Linking.canOpenURL(url).then((ok) => {
    if (ok) {
      Linking.openURL(url);
    } else {
      Alert.alert('Kiungo hakifunguki', `Tafadhali tembelea ${name} kwenye kivinjari chako.`);
    }
  });
}

// ─── Community link card ──────────────────────────────────────────────────────
function CommunityLinkCard({ item }: { item: typeof COMMUNITY_LINKS[0] }) {
  const { colors } = useTheme();
  const Icon = item.type === 'telegram' ? Hash : item.type === 'whatsapp' ? Phone : Globe;
  return (
    <TouchableOpacity
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); openLink(item.url, item.title); }}
      activeOpacity={0.82}
    >
      <GlassCard style={{ padding: 14, flexDirection: 'row', alignItems: 'center' }}>
        <View style={[s.linkIcon, { backgroundColor: item.color + '18' }]}>
          <Icon size={20} color={item.color} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[s.linkTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[s.linkSub, { color: colors.textMute }]}>{item.subtitle}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={[s.linkMembers, { color: item.color }]}>{item.members}</Text>
          <ExternalLink size={13} color={colors.textMute} />
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

// ─── Event card ───────────────────────────────────────────────────────────────
function EventCard({ ev }: { ev: typeof UPCOMING_EVENTS[0] }) {
  const { colors } = useTheme();
  const ec = EVENT_COLOR[ev.type] ?? '#22d15a';
  const pct = Math.round((1 - ev.spotsLeft / ev.spots) * 100);
  return (
    <GlassCard style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <View style={[s.eventDateBox, { backgroundColor: ec + '18', borderColor: ec + '30' }]}>
          <Text style={[s.eventDateNum, { color: ec }]}>{ev.date.split(' ')[1].replace(',', '')}</Text>
          <Text style={[s.eventDateMon, { color: ec }]}>{ev.date.split(' ')[0].slice(0, 3).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <View style={[s.eventTag, { backgroundColor: ec + '18' }]}>
              <Text style={[s.eventTagText, { color: ec }]}>{ev.tag}</Text>
            </View>
          </View>
          <Text style={[s.eventTitle, { color: colors.text }]}>{ev.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <MapPin size={11} color={colors.textMute} />
            <Text style={[s.eventLocation, { color: colors.textMute }]}>{ev.location}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Calendar size={11} color={colors.textMute} />
            <Text style={[s.eventLocation, { color: colors.textMute }]}>{ev.date} · {ev.time}</Text>
          </View>
        </View>
      </View>
      <View style={[s.eventFooter, { borderTopColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <View style={[s.spotsTrack, { backgroundColor: colors.border }]}>
            <View style={[s.spotsFill, { width: `${pct}%`, backgroundColor: pct > 75 ? '#ef4444' : ec }]} />
          </View>
          <Text style={[s.spotsText, { color: colors.textMute }]}>{ev.spotsLeft} nafasi zilizobaki kati ya {ev.spots}</Text>
        </View>
        <TouchableOpacity
          onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
          style={[s.registerBtn, { backgroundColor: ec }]}
        >
          <Bell size={12} color="#fff" />
          <Text style={s.registerText}>Jiandikishe</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function PeerGroupsScreen() {
  const { colors } = useTheme();
  const groups = useFarmDataStore((s) => s.groups);
  const posts = useFarmDataStore((s) => s.posts);
  const joinGroup = useFarmDataStore((s) => s.joinGroup);
  const leaveGroup = useFarmDataStore((s) => s.leaveGroup);
  const addPost = useFarmDataStore((s) => s.addPost);
  const author = useKilimoStore((s) => s.agroId?.name ?? 'Anonymous');

  const [activeGroupId, setActiveGroupId] = useState<string | null>(
    groups.find((g) => g.joined)?.id ?? null,
  );
  const [draft, setDraft] = useState('');
  const [tab, setTab] = useState<'groups' | 'events' | 'links'>('groups');

  const activeGroup = groups.find((g) => g.id === activeGroupId);
  const groupPosts = posts.filter((p) => p.groupId === activeGroupId);

  function handlePost() {
    if (!activeGroupId || !draft.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addPost(activeGroupId, author, draft.trim());
    setDraft('');
  }

  return (
    <Gate feature="peer_groups" fallback={<PageScaffold title="Vikundi" badge="PEER GROUPS"><AccessDenied /></PageScaffold>}>
      <PageScaffold title="Vikundi" subtitle="Jamii ya wakulima" badge="PEER GROUPS">

        {/* ── Tab bar ── */}
        <View style={[s.tabBar, { borderColor: colors.border }]}>
          {([['groups', 'Vikundi'], ['events', 'Matukio'], ['links', 'Mitandao']] as const).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              onPress={() => { Haptics.selectionAsync(); setTab(key); }}
              style={[s.tab, tab === key && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            >
              <Text style={[s.tabLabel, { color: tab === key ? colors.primary : colors.textMute }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Groups tab ── */}
        {tab === 'groups' && (
          <>
            <SectionHeader title={`Vikundi · ${groups.length} groups`} />
            <View style={{ paddingHorizontal: 24, gap: 10 }}>
              {groups.map((g, i) => {
                const active = g.id === activeGroupId;
                return (
                  <Animated.View key={g.id} entering={FadeInDown.delay(i * 40).springify()}>
                    <TouchableOpacity
                      onPress={() => { Haptics.selectionAsync(); setActiveGroupId(g.id); }}
                      activeOpacity={0.85}
                    >
                      <GlassCard style={[{ padding: 16 }, active && { borderColor: colors.primary, borderWidth: 1.5 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <View style={[s.iconBg, { backgroundColor: colors.primary + '15' }]}>
                            <Users size={20} color={colors.primary} />
                          </View>
                          <View style={{ flex: 1, marginLeft: 14 }}>
                            <Text style={[s.groupName, { color: colors.text }]} numberOfLines={1}>{g.name}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                              <MapPin size={10} color={colors.textMute} />
                              <Text style={[s.groupMeta, { color: colors.textMute }]}>{g.region}</Text>
                              <Text style={[s.groupMeta, { color: colors.textMute }]}>· {g.memberCount.toLocaleString()} wanachama</Text>
                            </View>
                            <Text style={[s.groupMeta, { color: colors.textMute }]}>{timeAgo(g.lastActivity)}</Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); g.joined ? leaveGroup(g.id) : joinGroup(g.id); }}
                            style={[s.joinBtn, {
                              backgroundColor: g.joined ? '#ef444420' : colors.primary,
                              borderColor: g.joined ? '#ef444460' : colors.primary,
                            }]}
                          >
                            {g.joined ? <LogOut size={12} color="#ef4444" /> : <LogIn size={12} color="#000" />}
                            <Text style={[s.joinText, { color: g.joined ? '#ef4444' : '#000' }]}>{g.joined ? 'Acha' : 'Jiunge'}</Text>
                          </TouchableOpacity>
                        </View>
                      </GlassCard>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>

            {activeGroup && (
              <>
                <SectionHeader title={`${activeGroup.name} · ${groupPosts.length} machapisho`} />
                <View style={{ paddingHorizontal: 24, gap: 10 }}>
                  {activeGroup.joined ? (
                    <GlassCard style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <TextInput
                        value={draft}
                        onChangeText={setDraft}
                        placeholder="Shiriki kitu na kikundi..."
                        placeholderTextColor={colors.textMute}
                        multiline
                        style={[s.input, { color: colors.text }]}
                      />
                      <TouchableOpacity
                        onPress={handlePost}
                        disabled={!draft.trim()}
                        style={[s.sendBtn, { backgroundColor: colors.primary, opacity: draft.trim() ? 1 : 0.4 }]}
                      >
                        <Send size={16} color="#000" />
                      </TouchableOpacity>
                    </GlassCard>
                  ) : (
                    <GlassCard style={{ padding: 16, alignItems: 'center' }}>
                      <Text style={[s.joinPrompt, { color: colors.textMute }]}>Jiunge kikundi ili kuweza kuchapisha na kujibu.</Text>
                    </GlassCard>
                  )}

                  {groupPosts.length === 0 ? (
                    <Text style={[s.noPosts, { color: colors.textMute }]}>Kuwa wa kwanza kuchapisha katika kikundi hiki.</Text>
                  ) : (
                    groupPosts.map((p) => (
                      <GlassCard key={p.id} style={{ padding: 14 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                          <View style={[s.avatar, { backgroundColor: colors.primary + '20' }]}>
                            <Text style={[s.avatarText, { color: colors.primary }]}>{p.author[0]?.toUpperCase() ?? '?'}</Text>
                          </View>
                          <Text style={[s.postAuthor, { color: colors.text }]}>{p.author}</Text>
                          <Text style={[s.postTime, { color: colors.textMute }]}> · {timeAgo(p.createdAt)}</Text>
                        </View>
                        <Text style={[s.postBody, { color: colors.text }]}>{p.body}</Text>
                      </GlassCard>
                    ))
                  )}
                </View>
              </>
            )}
          </>
        )}

        {/* ── Events tab ── */}
        {tab === 'events' && (
          <>
            <SectionHeader title="Matukio Yanayokuja" />
            <View style={{ paddingHorizontal: 24, gap: 12 }}>
              {UPCOMING_EVENTS.map((ev, i) => (
                <Animated.View key={ev.id} entering={FadeInDown.delay(i * 50).springify()}>
                  <EventCard ev={ev} />
                </Animated.View>
              ))}
            </View>
          </>
        )}

        {/* ── Community links tab ── */}
        {tab === 'links' && (
          <>
            <SectionHeader title="Mitandao ya Jamii" />
            <View style={{ paddingHorizontal: 24, gap: 10 }}>
              {COMMUNITY_LINKS.map((item, i) => (
                <Animated.View key={item.id} entering={FadeInDown.delay(i * 50).springify()}>
                  <CommunityLinkCard item={item} />
                </Animated.View>
              ))}
            </View>

            <SectionHeader title="Nambari za Msaada" />
            <View style={{ paddingHorizontal: 24, gap: 10 }}>
              {[
                { label: 'TARI Msaada wa Kilimo', number: '0800 110 110', free: true },
                { label: 'MAFC Farmers Helpline',  number: '+255 22 286 3315', free: false },
                { label: 'TFDA Malalamiko ya Dawa', number: '+255 22 245 0512', free: false },
              ].map((h) => (
                <GlassCard key={h.number} style={{ padding: 14, flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[s.linkIcon, { backgroundColor: '#22d15a18' }]}>
                    <Phone size={18} color="#22d15a" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[s.linkTitle, { color: colors.text }]}>{h.label}</Text>
                    <Text style={[s.linkSub, { color: colors.textMute }]}>{h.number}</Text>
                  </View>
                  {h.free && (
                    <View style={[s.freeBadge]}>
                      <Text style={s.freeText}>BURE</Text>
                    </View>
                  )}
                </GlassCard>
              ))}
            </View>
          </>
        )}

      </PageScaffold>
    </Gate>
  );
}

function AccessDenied() {
  return <EmptyState icon={<AlertTriangle size={36} color="#f59e0b" />} title="Haipatikani" body="Vikundi havipatikani kwa jukumu lako." />;
}

const s = StyleSheet.create({
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, marginHorizontal: 24, marginBottom: 8 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabLabel: { fontSize: 13, fontFamily: 'Inter_700Bold' },

  iconBg: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  groupName: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  groupMeta: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 1 },
  joinBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, minHeight: 40 },
  joinText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium', minHeight: 48, maxHeight: 120 },
  sendBtn: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  joinPrompt: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  noPosts: { fontSize: 14, fontFamily: 'Inter_500Medium', textAlign: 'center', paddingVertical: 20 },
  avatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  postAuthor: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  postTime: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  postBody: { fontSize: 15, fontFamily: 'Inter_500Medium', lineHeight: 22 },

  linkIcon: { width: 44, height: 44, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  linkTitle: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  linkSub: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 2 },
  linkMembers: { fontSize: 12, fontFamily: 'Inter_800ExtraBold' },
  freeBadge: { backgroundColor: '#22d15a18', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  freeText: { fontSize: 10, fontFamily: 'Inter_800ExtraBold', color: '#22d15a' },

  eventDateBox: { width: 50, height: 54, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  eventDateNum: { fontSize: 20, fontFamily: 'InstrumentSerif_400Regular' },
  eventDateMon: { fontSize: 8, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.5 },
  eventTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  eventTagText: { fontSize: 9, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.5 },
  eventTitle: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  eventLocation: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  eventFooter: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  spotsTrack: { height: 4, borderRadius: 2, overflow: 'hidden', marginBottom: 4 },
  spotsFill: { height: '100%', borderRadius: 2 },
  spotsText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  registerBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  registerText: { fontSize: 12, fontFamily: 'Inter_700Bold', color: '#fff' },
});
