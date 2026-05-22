import { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/src/context/AuthContext';

interface Notification {
  id: string;
  type: 'alert' | 'price' | 'task' | 'ai' | 'system';
  title: { en: string; sw: string };
  body: { en: string; sw: string };
  time: string;
  read: boolean;
}

const INITIAL: Notification[] = [
  {
    id: '1', type: 'alert', read: false, time: '2 min ago',
    title: { en: 'Weather Alert', sw: 'Tahadhari ya Hali ya Hewa' },
    body: { en: 'Heavy rains expected tomorrow. Consider harvesting or protecting vulnerable crops.', sw: 'Mvua kubwa inatarajiwa kesho. Fikiria kuvuna au kulinda mazao yanayoweza kuathiriwa.' },
  },
  {
    id: '2', type: 'price', read: false, time: '1 hr ago',
    title: { en: 'Maize Price Up 8%', sw: 'Bei ya Mahindi Imepanda 8%' },
    body: { en: 'Maize prices in Nairobi market have risen to KSh 49/kg — good time to sell!', sw: 'Bei ya mahindi katika soko la Nairobi imepanda hadi KSh 49/kg — wakati mzuri wa kuuza!' },
  },
  {
    id: '3', type: 'task', read: false, time: '3 hrs ago',
    title: { en: 'Task Due Today', sw: 'Kazi Inayohitajika Leo' },
    body: { en: '"Apply fertilizer to Field 2" is due today. Mark it complete when done.', sw: '"Weka mbolea kwenye Shamba la 2" inahitajika leo. Weka alama ya kukamilika unapofanya.' },
  },
  {
    id: '4', type: 'ai', read: true, time: 'Yesterday',
    title: { en: 'AI Insight Ready', sw: 'Ufahamu wa AI Uko Tayari' },
    body: { en: 'Your personalized crop advisory for the coming week has been generated. Check it out!', sw: 'Ushauri wako binafsi wa mazao kwa wiki ijayo umezalishwa. Angalia!' },
  },
  {
    id: '5', type: 'price', read: true, time: 'Yesterday',
    title: { en: 'Beans Price Drop', sw: 'Bei ya Maharagwe Imeshuka' },
    body: { en: 'Beans prices dropped by 4% in Mombasa. Consider holding stock for a better time.', sw: 'Bei ya maharagwe imeshuka kwa 4% huko Mombasa. Fikiria kushikilia hifadhi kwa wakati bora zaidi.' },
  },
  {
    id: '6', type: 'system', read: true, time: '2 days ago',
    title: { en: 'Welcome to KILIMO AI!', sw: 'Karibu KILIMO AI!' },
    body: { en: 'Your account is set up and ready. Explore AI advisory, market prices, and farm management tools.', sw: 'Akaunti yako imewekwa na iko tayari. Chunguza ushauri wa AI, bei za soko, na zana za usimamizi wa shamba.' },
  },
];

const TYPE_CONFIG = {
  alert: { icon: 'warning' as const, color: Colors.warning, bg: Colors.warningLight },
  price: { icon: 'trending-up' as const, color: Colors.success, bg: Colors.successLight },
  task: { icon: 'checkbox' as const, color: '#6A1B9A', bg: '#F3E5F5' },
  ai: { icon: 'chatbubble-ellipses' as const, color: Colors.info, bg: Colors.infoLight },
  system: { icon: 'information-circle' as const, color: Colors.textMuted, bg: Colors.gray100 },
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { language } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL);

  const topInset = Platform.OS === 'web' ? 20 : insets.top;
  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const cfg = TYPE_CONFIG[item.type];
    return (
      <TouchableOpacity
        style={[styles.item, !item.read && styles.itemUnread]}
        onPress={() => markRead(item.id)}
        activeOpacity={0.8}
      >
        {!item.read && <View style={styles.unreadDot} />}
        <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon} size={22} color={cfg.color} />
        </View>
        <View style={styles.itemBody}>
          <View style={styles.itemTop}>
            <Text style={styles.itemTitle} numberOfLines={1}>{item.title[language]}</Text>
            <Text style={styles.itemTime}>{item.time}</Text>
          </View>
          <Text style={styles.itemBody2} numberOfLines={3}>{item.body[language]}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{language === 'sw' ? 'Arifa' : 'Notifications'}</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSub}>{unreadCount} {language === 'sw' ? 'mpya' : 'unread'}</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>{language === 'sw' ? 'Soma zote' : 'Mark all read'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={n => n.id}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === 'web' ? 48 : 32 }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={52} color={Colors.gray300} />
            <Text style={styles.emptyText}>{language === 'sw' ? 'Hakuna arifa' : 'No notifications yet'}</Text>
          </View>
        }
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    backgroundColor: Colors.primary, paddingHorizontal: 16, paddingBottom: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' as const, color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  markAllBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: Colors.radiusFull,
  },
  markAllText: { fontSize: 12, fontWeight: '600' as const, color: '#fff' },
  list: { paddingTop: 8 },
  item: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingHorizontal: 16, paddingVertical: 16, backgroundColor: Colors.background,
    position: 'relative',
  },
  itemUnread: { backgroundColor: '#F0FAF0' },
  unreadDot: {
    position: 'absolute', left: 6, top: '50%',
    width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.primary,
  },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  itemBody: { flex: 1, gap: 4 },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  itemTitle: { flex: 1, fontSize: 15, fontWeight: '600' as const, color: Colors.text },
  itemTime: { fontSize: 12, color: Colors.textMuted, flexShrink: 0 },
  itemBody2: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  separator: { height: 1, backgroundColor: Colors.divider, marginLeft: 72 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textMuted },
});
