/**
 * Kilimo AI — Notifications Center (Kituo cha Arifa)
 *
 * Displays all system, AI, and market notifications from the global store.
 * Supports swipe-to-dismiss, mark-all-read, and cinematic empty state.
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import {
  ChevronLeft,
  BellRing,
  CheckCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Zap,
  Trash2,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../constants/Theme';
import { useKilimoStore, Notification } from '../store/useKilimoStore';

const TYPE_CONFIG = {
  alert:   { icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
  warning: { icon: Zap,           color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  info:    { icon: Info,          color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  success: { icon: CheckCircle2,  color: '#1A3B14', bg: 'rgba(26, 59, 20, 0.12)' },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Sasa hivi';
  if (mins < 60) return `${mins}m iliyopita`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h iliyopita`;
  return `${Math.floor(hrs / 24)}d iliyopita`;
}

function NotificationItem({
  item,
  onRead,
  onDelete,
  colors,
  isDark,
  index,
}: {
  item: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  colors: any;
  isDark: boolean;
  index: number;
}) {
  const cfg = TYPE_CONFIG[item.type];
  const Icon = cfg.icon;

  return (
    <Animated.View
      entering={FadeInDown} exiting={FadeOut}
      style={styles.notifWrapper}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onRead(item.id);
        }}
        accessibilityRole="button"
        accessibilityLabel={item.read ? item.title : `Unread: ${item.title}`}
        accessibilityHint="Tap to mark as read"
      >
        <BlurView
          intensity={isDark ? 20 : 60}
          tint={isDark ? 'dark' : 'light'}
          style={[
            styles.notifCard,
            {
              borderColor: item.read
                ? colors.border
                : cfg.color + '40',
              borderWidth: item.read ? 1 : 1.5,
            },
          ]}
        >
          {!item.read && (
            <LinearGradient
              colors={[cfg.bg, 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}

          <View style={styles.notifRow}>
            {/* Icon */}
            <View style={[styles.notifIconBg, { backgroundColor: cfg.bg }]}>
              <Icon size={20} color={cfg.color} />
            </View>

            {/* Content */}
            <View style={styles.notifContent}>
              <Text style={[styles.notifTitle, { color: colors.text, opacity: item.read ? 0.6 : 1 }]}>
                {item.title}
              </Text>
              <Text style={[styles.notifBody, { color: colors.textMute }]}>
                {item.body}
              </Text>
              <Text style={[styles.notifTime, { color: colors.textMute }]}>
                {timeAgo(item.timestamp)}
              </Text>
            </View>

            {/* Unread indicator */}
            {!item.read && (
              <View style={[styles.unreadDot, { backgroundColor: cfg.color }]} />
            )}

            {/* Delete */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onDelete(item.id);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Delete notification: ${item.title}`}
            >
              <Trash2 size={14} color={colors.textMute} />
            </TouchableOpacity>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const notifications = useKilimoStore((s) => s.notifications);
  const markNotificationRead = useKilimoStore((s) => s.markNotificationRead);
  const removeNotification = useKilimoStore((s) => s.removeNotification);
  const markAllRead = useKilimoStore((s) => s.markAllRead);
  const clearNotifications = useKilimoStore((s) => s.clearNotifications);
  const unreadCount = useKilimoStore((s) => s.unreadCount);

  const handleDelete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    removeNotification(id);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Background Orbs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View
          /* Reanimated Todo */
          style={[styles.bgOrb, { backgroundColor: colors.primary, top: -80, right: -100, width: 300, height: 300, borderRadius: 150 }]}
        />
        <Animated.View
          /* Reanimated Todo */
          style={[styles.bgOrb, { backgroundColor: '#3b82f6', bottom: 100, left: -80, width: 250, height: 250, borderRadius: 125 }]}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View
          entering={FadeInDown}
        >
          <BlurView
            intensity={isDark ? 20 : 80}
            tint={isDark ? 'dark' : 'light'}
            style={[styles.header, { borderBottomColor: colors.border }]}
          >
            <TouchableOpacity
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
              style={styles.backBtn}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Arifa</Text>
              {unreadCount > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{unreadCount}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                markAllRead();
              }}
              style={styles.actionBtn}
              accessibilityRole="button"
              accessibilityLabel="Mark all notifications as read"
            >
              <CheckCheck size={20} color={colors.primary} />
            </TouchableOpacity>
          </BlurView>
        </Animated.View>

        {/* List */}
        <ScrollView
          showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}
        >
          
            {notifications.length === 0 ? (
              /* Empty State */
              <Animated.View
                entering={FadeInDown}
                style={styles.emptyState}
              >
                <Animated.View
                  /* Reanimated Todo */
                  style={[styles.emptyIcon, { backgroundColor: colors.primary + '15' }]}
                >
                  <BellRing size={40} color={colors.primary} />
                </Animated.View>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>Hakuna Arifa</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textMute }]}>
                  Arifa zako zote zitaonekana hapa. Sankofa AI itakutumia ujumbe muhimu.
                </Text>
              </Animated.View>
            ) : (
              notifications.map((notif, i) => (
                <NotificationItem
                  key={notif.id}
                  item={notif}
                  index={i}
                  onRead={markNotificationRead}
                  onDelete={handleDelete}
                  colors={colors}
                  isDark={isDark}
                />
              ))
            )}
          

          {notifications.length > 0 && (
            <TouchableOpacity
              style={styles.clearAllBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                clearNotifications();
              }}
              accessibilityRole="button"
              accessibilityLabel="Clear all notifications"
            >
              <Text style={[styles.clearAllText, { color: colors.textMute }]}>
                Futa Arifa Zote
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  bgOrb: { position: 'absolute', filter: Platform.OS === 'web' ? 'blur(80px)' : undefined },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerCenter: {
    flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 16, gap: 10,
  },
  headerTitle: {
    fontSize: 22, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: '#ef4444', borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  countText: {
    color: '#fff', fontSize: 11, fontFamily: 'InstrumentSerif_400Regular',
  },
  actionBtn: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(26, 59, 20, 0.1)',
  },
  scrollContent: {
    padding: 20, paddingBottom: 60, gap: 12,
  },
  notifWrapper: { marginBottom: 0 },
  notifCard: {
    borderRadius: 24, overflow: 'hidden',
  },
  notifRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    padding: 18, gap: 14,
  },
  notifIconBg: {
    width: 44, height: 44, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  notifContent: { flex: 1, gap: 4 },
  notifTitle: {
    fontSize: 15, fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.3,
  },
  notifBody: {
    fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 20,
  },
  notifTime: {
    fontSize: 11, fontFamily: 'Inter_600SemiBold', opacity: 0.5, marginTop: 2,
  },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4, marginTop: 4, flexShrink: 0,
  },
  deleteBtn: {
    padding: 4, opacity: 0.5,
  },
  emptyState: {
    alignItems: 'center', paddingTop: 80, paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 100, height: 100, borderRadius: 50,
    justifyContent: 'center', alignItems: 'center', marginBottom: 28,
  },
  emptyTitle: {
    fontSize: 24, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.5, marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16, fontFamily: 'Inter_500Medium', textAlign: 'center', lineHeight: 24,
  },
  clearAllBtn: {
    alignItems: 'center', paddingVertical: 20, marginTop: 8,
  },
  clearAllText: {
    fontSize: 13, fontFamily: 'Inter_700Bold',
  },
});
