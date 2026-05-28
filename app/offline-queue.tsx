/**
 * Nje ya Mtandao — Offline Queue Manager
 * Shows pending operations awaiting sync and local storage stats
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft, Wifi, WifiOff, RefreshCw, Camera, MessageSquare,
  ShoppingCart, ClipboardList, CheckCircle2, Clock, Trash2,
  CloudOff, Cloud, Zap, HardDrive, AlertTriangle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/Theme';
import { useKilimoStore } from '../store/useKilimoStore';

type QueueItem = {
  id: string;
  type: 'scan' | 'message' | 'order' | 'task' | 'price_check';
  label: string;
  sub: string;
  sizeKB: number;
  ts: number;
  retries: number;
};

const INITIAL_QUEUE: QueueItem[] = [
  { id: 'q1', type: 'scan',        label: 'Skani ya Mazao',      sub: 'Picha 3 zinasubiri uchanganuzi',    sizeKB: 847, ts: Date.now() - 3600000, retries: 1 },
  { id: 'q2', type: 'message',     label: 'Ujumbe wa Sankofa',   sub: 'Maswali 2 hayakupelekwa',           sizeKB: 4,   ts: Date.now() - 1800000, retries: 0 },
  { id: 'q3', type: 'price_check', label: 'Bei za Soko',         sub: 'Ombi la bei — Kariakoo, Mbeya',     sizeKB: 2,   ts: Date.now() - 900000,  retries: 0 },
  { id: 'q4', type: 'task',        label: 'Kazi Mpya',           sub: '"Mwagilia Kanda B" — haijaokolewa', sizeKB: 1,   ts: Date.now() - 600000,  retries: 0 },
  { id: 'q5', type: 'order',       label: 'Agizo la Pembejeo',   sub: 'Mbolea 50kg — halijathibitishwa',   sizeKB: 3,   ts: Date.now() - 120000,  retries: 2 },
];

const TYPE_META: Record<QueueItem['type'], { icon: (c: string) => React.ReactNode; color: string; label: string }> = {
  scan:        { icon: (c) => <Camera size={16} color={c} />,       color: '#8b5cf6', label: 'SKANI' },
  message:     { icon: (c) => <MessageSquare size={16} color={c} />, color: '#3b82f6', label: 'UJUMBE' },
  order:       { icon: (c) => <ShoppingCart size={16} color={c} />, color: '#f59e0b', label: 'AGIZO' },
  task:        { icon: (c) => <ClipboardList size={16} color={c} />, color: '#22d15a', label: 'KAZI' },
  price_check: { icon: (c) => <Zap size={16} color={c} />,          color: '#06b6d4', label: 'BEI' },
};

function fmtAge(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'Sasa hivi';
  if (diff < 3600000) return `min ${Math.floor(diff / 60000)} zilizopita`;
  return `saa ${Math.floor(diff / 3600000)} zilizopita`;
}

function SyncSpinner({ syncing }: { syncing: boolean }) {
  const rot = useSharedValue(0);
  useEffect(() => {
    if (syncing) {
      rot.value = withRepeat(withTiming(360, { duration: 800 }), -1, false);
    } else {
      rot.value = withTiming(0, { duration: 200 });
    }
  }, [syncing]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));
  return <Animated.View style={style}><RefreshCw size={18} color="#fff" /></Animated.View>;
}

export default function OfflineQueueScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const language = useKilimoStore((s) => s.language);
  const [online, setOnline] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [synced, setSynced] = useState<string[]>([]);

  const totalKB = queue.reduce((a, b) => a + b.sizeKB, 0);

  const handleSync = () => {
    if (!online) {
      Alert.alert(language === 'sw' ? 'Hakuna Mtandao' : 'No Connection', language === 'sw' ? 'Unganisha mtandao kwanza.' : 'Please connect to the internet first.');
      return;
    }
    setSyncing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    let idx = 0;
    const syncNext = () => {
      if (idx >= queue.length) { setSyncing(false); return; }
      const id = queue[idx].id;
      setTimeout(() => {
        setSynced(prev => [...prev, id]);
        idx++;
        setTimeout(syncNext, 400);
      }, 600 + idx * 200);
    };
    syncNext();
  };

  const handleDelete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQueue(prev => prev.filter(q => q.id !== id));
  };

  const toggleOnline = () => {
    Haptics.selectionAsync();
    setOnline(v => !v);
    if (synced.length > 0) setSynced([]);
  };

  return (
    <View style={[s.root, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={isDark ? ['#04090a', '#060d0f', colors.background] : ['#f0f9ff', '#f8fafc', colors.background]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.25, 1]}
      />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={[s.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ChevronLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[s.title, { color: colors.text }]}>{language === 'sw' ? 'Nje ya Mtandao' : 'Offline Queue'}</Text>
            <Text style={[s.sub, { color: colors.textMute }]}>{queue.length} {language === 'sw' ? 'zinasubiri' : 'pending'}</Text>
          </View>
          <TouchableOpacity
            onPress={toggleOnline}
            style={[s.onlineBtn, { backgroundColor: online ? '#22d15a22' : '#ef444422', borderColor: online ? '#22d15a55' : '#ef444455' }]}
          >
            {online ? <Wifi size={16} color="#22d15a" /> : <WifiOff size={16} color="#ef4444" />}
            <Text style={[s.onlineTxt, { color: online ? '#22d15a' : '#ef4444' }]}>
              {online ? (language === 'sw' ? 'MTANDAO' : 'ONLINE') : (language === 'sw' ? 'BILA MTANDAO' : 'OFFLINE')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status Card */}
        <Animated.View entering={FadeInUp.springify()} style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <LinearGradient
            colors={online ? ['#22d15a18', '#22d15a08'] : ['rgba(239,68,68,0.1)', 'rgba(239,68,68,0.04)']}
            style={[s.statusCard, { borderColor: online ? '#22d15a30' : 'rgba(239,68,68,0.25)' }]}
          >
            <View style={[s.statusIcon, { backgroundColor: online ? '#22d15a22' : '#ef444422' }]}>
              {online ? <Cloud size={22} color="#22d15a" /> : <CloudOff size={22} color="#ef4444" />}
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[s.statusTitle, { color: colors.text }]}>
                {online
                  ? (language === 'sw' ? 'Umeunganishwa — tayari kusawazisha' : 'Connected — ready to sync')
                  : (language === 'sw' ? 'Huna mtandao — mabadiliko yamehifadhiwa' : 'No connection — changes saved locally')}
              </Text>
              <Text style={[s.statusMeta, { color: colors.textMute }]}>
                {(totalKB / 1024).toFixed(1)} MB {language === 'sw' ? 'inangojea kupakia' : 'waiting to upload'}
                {'  ·  '}{language === 'sw' ? 'Hifadhi' : 'Storage'}: 87% {language === 'sw' ? 'bado' : 'free'}
              </Text>
            </View>
            <View style={[s.storageBar, { backgroundColor: colors.border }]}>
              <View style={[s.storageFill, { width: '13%', backgroundColor: online ? '#22d15a' : '#ef4444' }]} />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Queue list */}
        <ScrollView contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {queue.length === 0 && (
            <Animated.View entering={FadeInUp} style={[s.empty, { borderColor: colors.border }]}>
              <CheckCircle2 size={32} color={colors.primary} />
              <Text style={[s.emptyTitle, { color: colors.text }]}>{language === 'sw' ? 'Hakuna kinachongojea!' : 'Queue is clear!'}</Text>
              <Text style={[s.emptySub, { color: colors.textMute }]}>{language === 'sw' ? 'Data yote imesawazishwa kikamilifu.' : 'All data has been synced successfully.'}</Text>
            </Animated.View>
          )}
          {queue.map((item, i) => {
            const meta = TYPE_META[item.type];
            const done = synced.includes(item.id);
            return (
              <Animated.View key={item.id} entering={FadeInDown.delay(i * 60).springify()}>
                <View style={[s.qCard, { backgroundColor: colors.card, borderColor: done ? '#22d15a44' : colors.border, opacity: done ? 0.6 : 1 }]}>
                  <View style={[s.typeIcon, { backgroundColor: meta.color + '18' }]}>
                    {done ? <CheckCircle2 size={16} color="#22d15a" /> : meta.icon(meta.color)}
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[s.qLabel, { color: colors.text }]} numberOfLines={1}>{item.label}</Text>
                      <View style={[s.typeBadge, { backgroundColor: meta.color + '18' }]}>
                        <Text style={[s.typeBadgeText, { color: meta.color }]}>{meta.label}</Text>
                      </View>
                    </View>
                    <Text style={[s.qSub, { color: colors.textMute }]} numberOfLines={1}>{item.sub}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Clock size={10} color={colors.textMute} />
                      <Text style={[s.qMeta, { color: colors.textMute }]}>{fmtAge(item.ts)}</Text>
                      <Text style={[s.qMeta, { color: colors.textMute }]}>·</Text>
                      <HardDrive size={10} color={colors.textMute} />
                      <Text style={[s.qMeta, { color: colors.textMute }]}>{item.sizeKB > 500 ? `${(item.sizeKB / 1024).toFixed(1)} MB` : `${item.sizeKB} KB`}</Text>
                      {item.retries > 0 && <>
                        <Text style={[s.qMeta, { color: colors.textMute }]}>·</Text>
                        <AlertTriangle size={10} color="#f59e0b" />
                        <Text style={[s.qMeta, { color: '#f59e0b' }]}>{item.retries}x {language === 'sw' ? 'jaribio' : 'retried'}</Text>
                      </>}
                    </View>
                  </View>
                  {!done && (
                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={[s.deleteBtn, { backgroundColor: '#ef444418' }]}>
                      <Trash2 size={14} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                  {done && <CheckCircle2 size={18} color="#22d15a" />}
                </View>
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* Sync Button */}
        <View style={[s.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TouchableOpacity
            onPress={handleSync}
            activeOpacity={0.85}
            style={[s.syncBtn, { backgroundColor: online ? '#22d15a' : colors.card, borderColor: online ? '#22d15a' : colors.border }]}
          >
            <SyncSpinner syncing={syncing} />
            <Text style={[s.syncText, { color: online ? '#fff' : colors.textMute }]}>
              {syncing
                ? (language === 'sw' ? 'Inasawazisha...' : 'Syncing...')
                : (language === 'sw' ? 'Sawazisha Sasa' : 'Sync Now')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root:         { flex: 1 },
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  backBtn:      { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title:        { fontFamily: 'Inter_700Bold', fontSize: 18 },
  sub:          { fontFamily: 'Inter_500Medium', fontSize: 12 },
  onlineBtn:    { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  onlineTxt:    { fontFamily: 'Inter_800ExtraBold', fontSize: 9, letterSpacing: 0.6 },
  statusCard:   { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1, gap: 12 },
  statusIcon:   { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  statusTitle:  { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  statusMeta:   { fontFamily: 'Inter_500Medium', fontSize: 11 },
  storageBar:   { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, borderRadius: 3 },
  storageFill:  { height: 3, borderRadius: 3 },
  qCard:        { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1, gap: 12 },
  typeIcon:     { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  qLabel:       { fontFamily: 'Inter_700Bold', fontSize: 13 },
  typeBadge:    { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  typeBadgeText:{ fontFamily: 'Inter_800ExtraBold', fontSize: 9 },
  qSub:         { fontFamily: 'Inter_500Medium', fontSize: 11 },
  qMeta:        { fontFamily: 'Inter_500Medium', fontSize: 10 },
  deleteBtn:    { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  empty:        { alignItems: 'center', gap: 10, padding: 40, borderRadius: 16, borderWidth: 1, marginTop: 40 },
  emptyTitle:   { fontFamily: 'Inter_700Bold', fontSize: 16 },
  emptySub:     { fontFamily: 'Inter_500Medium', fontSize: 13, textAlign: 'center' },
  footer:       { padding: 16, borderTopWidth: StyleSheet.hairlineWidth },
  syncBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, height: 52, borderRadius: 16, borderWidth: 1.5 },
  syncText:     { fontFamily: 'Inter_700Bold', fontSize: 15 },
});
