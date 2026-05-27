/**
 * Peer Groups — region/crop-specific discussion
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Users, Send, MessageSquare, LogIn, LogOut, AlertTriangle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import PageScaffold, { GlassCard, SectionHeader, EmptyState } from '../components/PageScaffold';
import { useTheme } from '../constants/Theme';
import { useFarmDataStore } from '../store/useFarmDataStore';
import { useKilimoStore } from '../store/useKilimoStore';
import { Gate } from '../lib/access';

function timeAgo(iso?: string) {
  if (!iso) return '';
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function PeerGroupsScreen() {
  const { colors } = useTheme();
  const groups = useFarmDataStore((s) => s.groups);
  const posts = useFarmDataStore((s) => s.posts);
  const joinGroup = useFarmDataStore((s) => s.joinGroup);
  const leaveGroup = useFarmDataStore((s) => s.leaveGroup);
  const addPost = useFarmDataStore((s) => s.addPost);
  const author = useKilimoStore((s) => s.agroId?.name ?? 'Anonymous');

  const [activeGroupId, setActiveGroupId] = useState<string | null>(groups.find((g) => g.joined)?.id ?? null);
  const [draft, setDraft] = useState('');

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
      <PageScaffold title="Vikundi" subtitle="Peer farmer groups" badge="PEER GROUPS">

        <SectionHeader title="Vikundi · Groups" />
        <View style={{ paddingHorizontal: 24, gap: 10 }}>
          {groups.map((g) => {
            const active = g.id === activeGroupId;
            return (
              <TouchableOpacity
                key={g.id}
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
                      <Text style={[s.groupMeta, { color: colors.textMute }]}>
                        {g.memberCount} members · {timeAgo(g.lastActivity)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        g.joined ? leaveGroup(g.id) : joinGroup(g.id);
                      }}
                      style={[s.joinBtn, {
                        backgroundColor: g.joined ? '#ef444425' : colors.primary,
                        borderColor: g.joined ? '#ef444460' : colors.primary,
                      }]}
                    >
                      {g.joined ? <LogOut size={12} color="#ef4444" /> : <LogIn size={12} color="#000" />}
                      <Text style={[s.joinText, { color: g.joined ? '#ef4444' : '#000' }]}>{g.joined ? 'Leave' : 'Join'}</Text>
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>

        {activeGroup && (
          <>
            <SectionHeader title={`${activeGroup.name} · ${groupPosts.length} posts`} />
            <View style={{ paddingHorizontal: 24, gap: 10 }}>
              {activeGroup.joined ? (
                <GlassCard style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <TextInput
                    value={draft}
                    onChangeText={setDraft}
                    placeholder="Share something with the group..."
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
                  <Text style={[s.joinPrompt, { color: colors.textMute }]}>Join this group to post and reply.</Text>
                </GlassCard>
              )}

              {groupPosts.length === 0 ? (
                <Text style={[s.noPosts, { color: colors.textMute }]}>Be the first to post in this group.</Text>
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
      </PageScaffold>
    </Gate>
  );
}

function AccessDenied() {
  return <EmptyState icon={<AlertTriangle size={36} color="#f59e0b" />} title="Haipatikani" body="Vikundi havipatikani kwa jukumu lako." />;
}

const s = StyleSheet.create({
  iconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  groupName: { fontSize: 14, fontFamily: 'InstrumentSerif_400Regular' },
  groupMeta: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 2 },
  joinBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  joinText: { fontSize: 11, fontFamily: 'InstrumentSerif_400Regular' },
  input: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium', minHeight: 36, maxHeight: 100 },
  sendBtn: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  joinPrompt: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  noPosts: { fontSize: 12, fontFamily: 'Inter_500Medium', textAlign: 'center', paddingVertical: 20 },
  avatar: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  avatarText: { fontSize: 12, fontFamily: 'InstrumentSerif_400Regular' },
  postAuthor: { fontSize: 12, fontFamily: 'Inter_800ExtraBold' },
  postTime: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  postBody: { fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 19 },
});
