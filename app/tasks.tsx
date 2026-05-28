import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  AlertCircle,
  Sparkles,
  Calendar as CalendarIcon,
  Check,
  Target,
  LayoutGrid,
  WifiOff,
  CloudLightning,
  Users,
  X,
  Droplets,
  Leaf,
  Wheat,
  Eye,
  Wallet,
  MapPin,
  Zap,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';
import Animated, { FadeIn, FadeOut, FadeInDown } from 'react-native-reanimated';
import { useKilimoStore } from '../store/useKilimoStore';
import { useTasks, TaskCategory, TaskPriority } from '../hooks/useTasks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Constants ────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'Januari','Februari','Machi','Aprili','Mei','Juni',
  'Julai','Agosti','Septemba','Oktoba','Novemba','Desemba',
];
const DAY_HEADERS = ['J','T','K','A','Al','Ij','S'];

const CATEGORIES: TaskCategory[] = ['irrigation','planting','harvest','scouting','finance','general'];
const PRIORITIES: TaskPriority[] = ['low','medium','high','critical'];

const CAT_LABEL: Record<TaskCategory, string> = {
  irrigation: 'Umwagiliaji',
  planting:   'Upanzi',
  harvest:    'Mavuno',
  scouting:   'Uchunguzi',
  finance:    'Fedha',
  general:    'Jumla',
};

const CAT_COLOR: Record<TaskCategory, string> = {
  irrigation: '#3b82f6',
  planting:   '#22d15a',
  harvest:    '#f59e0b',
  scouting:   '#a855f7',
  finance:    '#10b981',
  general:    '#94a3b8',
};

const CAT_ICON: Record<TaskCategory, React.ReactNode> = {
  irrigation: <Droplets size={14} color="#3b82f6" />,
  planting:   <Leaf size={14} color="#22d15a" />,
  harvest:    <Wheat size={14} color="#f59e0b" />,
  scouting:   <Eye size={14} color="#a855f7" />,
  finance:    <Wallet size={14} color="#10b981" />,
  general:    <LayoutGrid size={14} color="#94a3b8" />,
};

const PRI_COLOR: Record<TaskPriority, string> = {
  low:      '#22c55e',
  medium:   '#f59e0b',
  high:     '#f97316',
  critical: '#ef4444',
};

const STATUS_COLOR: Record<string, string> = {
  pending:     '#f59e0b',
  in_progress: '#3b82f6',
  done:        '#22d15a',
  cancelled:   '#94a3b8',
};

const STATUS_LABEL: Record<string, string> = {
  pending:     'INASUBIRI',
  in_progress: 'INAENDELEA',
  done:        'IMEKAMILIKA',
  cancelled:   'IMEFUTWA',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDue = (iso: string): string => {
  const d = new Date(iso);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const hours = Math.round(diff / 3_600_000);
  if (hours < 0) return 'Imepita';
  if (hours < 1) return 'Hivi sasa';
  if (hours < 24) return `Saa ${hours} zijazo`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Kesho';
  return `Siku ${days} zijazo`;
};

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function TasksScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const isOffline = useKilimoStore((s) => s.isOffline);
  const { tasks, pendingTasks, completedTasks, totalXP, completeTask, createTask } = useTasks();

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTitleSw, setNewTitleSw] = useState('');
  const [newCat, setNewCat] = useState<TaskCategory>('general');
  const [newPri, setNewPri] = useState<TaskPriority>('medium');
  const [newBlock, setNewBlock] = useState('');
  const [newDueDays, setNewDueDays] = useState(1);

  // Filter / view
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Calendar navigation
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  const prevMonth = () => {
    Haptics.selectionAsync();
    setSelectedDay(null);
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    Haptics.selectionAsync();
    setSelectedDay(null);
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  };

  const displayTasks = (() => {
    const base = filter === 'pending' ? pendingTasks : filter === 'done' ? completedTasks : tasks;
    if (viewMode === 'calendar' && selectedDay !== null) {
      return base.filter((t) => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        return d.getDate() === selectedDay
          && d.getMonth() === calMonth
          && d.getFullYear() === calYear;
      });
    }
    return base;
  })();

  const progress = tasks.length > 0
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  const handleToggleTask = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeTask(id);
  };

  function handleCreate() {
    if (!newTitle.trim()) { Alert.alert('Jaza jina la kazi'); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    createTask({
      title: newTitle.trim(),
      titleSw: newTitleSw.trim() || undefined,
      category: newCat,
      priority: newPri,
      status: 'pending',
      xpReward: newPri === 'critical' ? 40 : newPri === 'high' ? 25 : newPri === 'medium' ? 15 : 10,
      farmBlock: newBlock.trim() || undefined,
      dueDate: new Date(Date.now() + newDueDays * 86_400_000).toISOString(),
    });
    setShowCreate(false);
    setNewTitle(''); setNewTitleSw(''); setNewBlock('');
    setNewCat('general'); setNewPri('medium'); setNewDueDays(1);
  }

  // Tasks-by-day index for calendar
  const tasksByDay: Record<number, typeof tasks> = {};
  tasks.forEach((t) => {
    if (!t.dueDate) return;
    const d = new Date(t.dueDate);
    if (d.getMonth() === calMonth && d.getFullYear() === calYear) {
      const day = d.getDate();
      if (!tasksByDay[day]) tasksByDay[day] = [];
      tasksByDay[day].push(t);
    }
  });

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <View style={[st.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Background glow */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[st.glowTR, Platform.OS === 'web' && ({ filter: 'blur(90px)' } as any)]} />
        <View style={[st.glowBL, Platform.OS === 'web' && ({ filter: 'blur(70px)' } as any)]} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        {/* ── Header ── */}
        <View style={st.header}>
          <TouchableOpacity
            onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
            style={st.iconBtn}
          >
            <ChevronLeft size={22} color={isDark ? 'rgba(255,255,255,0.8)' : colors.text} />
          </TouchableOpacity>

          <View style={{ alignItems: 'center' }}>
            <View style={st.commandBadge}>
              <Target size={11} color="#22d15a" />
              <Text style={st.commandText}>OPERESHENI</Text>
            </View>
            <Text style={[st.headerTitle, { color: colors.text }]}>Kazi za Shamba</Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              if (isOffline) Alert.alert('Nje ya Mtandao', 'Kazi itahifadhiwa na kutumwa baadaye.');
              setShowCreate(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            style={[st.iconBtn, isOffline && { borderColor: '#ef444450' }]}
          >
            {isOffline
              ? <WifiOff size={18} color="#ef4444" />
              : <Plus size={22} color="#22d15a" />
            }
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={st.scrollContent}>

          {/* ── Progress dashboard ── */}
          <View style={[st.dashCard, {
            backgroundColor: isDark ? 'rgba(9,20,11,0.97)' : colors.card,
            borderColor: 'rgba(34,209,90,0.15)',
          }]}>
            <LinearGradient
              colors={['rgba(34,209,90,0.1)', 'transparent']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={st.dashRow}>
              <View style={{ flex: 1 }}>
                <Text style={st.dashLabel}>UFANISI WA LEO</Text>
                <Text style={[st.dashTitle, { color: colors.text }]}>Maendeleo ya Kazi</Text>
                <Text style={[st.dashSub, { color: colors.textMute }]}>
                  {completedTasks.length} / {tasks.length} zimekamilika
                </Text>
              </View>
              <View style={st.dashCircle}>
                <Text style={st.dashPct}>{progress}%</Text>
              </View>
            </View>
            {/* XP row */}
            <View style={st.xpRow}>
              <Zap size={13} color="#f59e0b" />
              <Text style={st.xpText}>{totalXP} XP iliyopatikana</Text>
            </View>
            {/* Progress bar */}
            <View style={[st.barTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
              <LinearGradient
                colors={['#22d15a', '#048038']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[st.barFill, { width: `${progress}%` as any }]}
              />
            </View>
          </View>

          {/* ── Offline banner ── */}
          {isOffline && (
            <Animated.View entering={FadeInDown} exiting={FadeOut} style={[st.offlineCard]}>
              <AlertCircle size={18} color="#ef4444" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={st.offlineTitle}>Nje ya Mtandao</Text>
                <Text style={st.offlineDesc}>Kazi zitahifadhiwa na kutumwa baadaye.</Text>
              </View>
            </Animated.View>
          )}

          {/* ── Section header + filters ── */}
          <View style={st.sectionRow}>
            <Text style={[st.sectionTitle, { color: colors.text }]}>Orodha ya Kazi</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <TouchableOpacity
                onPress={() => { setViewMode((v) => v === 'list' ? 'calendar' : 'list'); setSelectedDay(null); Haptics.selectionAsync(); }}
                style={[st.filterBtn, {
                  backgroundColor: viewMode === 'calendar' ? 'rgba(34,209,90,0.12)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                  borderColor: viewMode === 'calendar' ? '#22d15a' : colors.border,
                }]}
              >
                {viewMode === 'calendar'
                  ? <LayoutGrid size={17} color="#22d15a" />
                  : <CalendarIcon size={17} color={colors.textMute} />
                }
              </TouchableOpacity>
              {(['all', 'pending', 'done'] as const).map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => { setFilter(f); Haptics.selectionAsync(); }}
                  style={[st.filterBtn, {
                    backgroundColor: filter === f ? '#22d15a' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                    borderColor: filter === f ? '#22d15a' : colors.border,
                    paddingHorizontal: 10,
                  }]}
                >
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 9, color: filter === f ? '#000' : colors.textMute }}>
                    {f === 'all' ? 'ZOTE' : f === 'pending' ? 'ZINAZO' : 'ZIMEKAM'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── Calendar ── */}
          {viewMode === 'calendar' && (
            <Animated.View entering={FadeInDown} exiting={FadeOut} style={{ marginBottom: 20 }}>
              <View style={[st.calCard, {
                backgroundColor: isDark ? 'rgba(9,20,11,0.97)' : colors.card,
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border,
              }]}>
                {/* Shimmer */}
                <LinearGradient
                  colors={['rgba(34,209,90,0.07)', 'transparent']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 48, borderTopLeftRadius: 22, borderTopRightRadius: 22 }}
                  pointerEvents="none"
                />

                {/* Month nav */}
                <View style={st.calNav}>
                  <TouchableOpacity onPress={prevMonth} style={st.calNavBtn}>
                    <ChevronLeft size={18} color={isDark ? 'rgba(255,255,255,0.6)' : colors.text} />
                  </TouchableOpacity>
                  <Text style={[st.calMonthLabel, { color: colors.text }]}>
                    {MONTH_NAMES[calMonth]} {calYear}
                  </Text>
                  <TouchableOpacity onPress={nextMonth} style={st.calNavBtn}>
                    <ChevronRight size={18} color={isDark ? 'rgba(255,255,255,0.6)' : colors.text} />
                  </TouchableOpacity>
                </View>

                {/* Day header row */}
                <View style={st.calDayHdrRow}>
                  {DAY_HEADERS.map((d, i) => (
                    <Text key={i} style={[st.calDayHdr, { color: colors.textMute }]}>{d}</Text>
                  ))}
                </View>

                {/* Grid */}
                <View style={st.calGrid}>
                  {calCells.map((day, i) => {
                    if (!day) return <View key={`e${i}`} style={st.calCell} />;
                    const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                    const isSel = day === selectedDay;
                    const dayTasks = tasksByDay[day] ?? [];
                    return (
                      <TouchableOpacity
                        key={day}
                        onPress={() => { setSelectedDay(isSel ? null : day); Haptics.selectionAsync(); }}
                        style={st.calCell}
                      >
                        <View style={[
                          st.calDayNum,
                          isToday && { backgroundColor: 'rgba(34,209,90,0.2)' },
                          isSel && { backgroundColor: '#22d15a' },
                        ]}>
                          <Text style={{
                            fontSize: 13,
                            fontFamily: isToday ? 'Inter_700Bold' : 'Inter_500Medium',
                            color: isSel ? '#000' : isToday ? '#22d15a' : (isDark ? 'rgba(255,255,255,0.8)' : colors.text),
                          }}>
                            {day}
                          </Text>
                        </View>
                        {dayTasks.length > 0 && (
                          <View style={st.calDots}>
                            {dayTasks.slice(0, 3).map((t, ti) => (
                              <View
                                key={ti}
                                style={[st.calDot, { backgroundColor: PRI_COLOR[t.priority as TaskPriority] ?? '#22d15a' }]}
                              />
                            ))}
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Selected day banner */}
                {selectedDay !== null && (
                  <View style={[st.calSelBanner, { backgroundColor: 'rgba(34,209,90,0.1)', borderColor: 'rgba(34,209,90,0.2)' }]}>
                    <CalendarIcon size={13} color="#22d15a" />
                    <Text style={[st.calSelText, { color: '#22d15a' }]}>
                      {selectedDay} {MONTH_NAMES[calMonth]} — kazi {displayTasks.length}
                    </Text>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity
                      onPress={() => { setShowCreate(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
                      style={st.calAddBtn}
                    >
                      <Plus size={11} color="#22d15a" />
                      <Text style={st.calAddText}>Ongeza</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedDay(null)} style={{ marginLeft: 8 }}>
                      <X size={14} color="#22d15a" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </Animated.View>
          )}

          {/* ── Task list ── */}
          <View style={{ gap: 14 }}>
            {displayTasks.length === 0 && (
              <View style={[st.emptyCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : colors.card, borderColor: colors.border }]}>
                <CalendarIcon size={28} color={colors.textMute} />
                <Text style={[st.emptyText, { color: colors.textMute }]}>Hakuna kazi zinazolingana</Text>
              </View>
            )}
            {displayTasks.map((task, idx) => {
              const priColor    = PRI_COLOR[task.priority as TaskPriority] ?? '#94a3b8';
              const catColor    = CAT_COLOR[task.category] ?? '#94a3b8';
              const statusColor = STATUS_COLOR[task.status] ?? '#94a3b8';
              const isDone      = task.status === 'done';
              const isProgress  = task.status === 'in_progress';

              return (
                <Animated.View key={task.id} entering={FadeInDown.delay(idx * 50).springify()}>
                  <View style={[st.taskCard, {
                    backgroundColor: isDark ? 'rgba(9,20,11,0.97)' : colors.card,
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : colors.border,
                    borderLeftColor: isDone ? '#22d15a' : priColor,
                    opacity: isDone ? 0.72 : 1,
                  }]}>
                    {/* Shimmer strip */}
                    <LinearGradient
                      colors={[`${isDone ? '#22d15a' : priColor}1a`, 'transparent']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={StyleSheet.absoluteFill}
                      pointerEvents="none"
                    />

                    {/* ── Top: category + priority ── */}
                    <View style={st.cardHeader}>
                      <View style={[st.catIconBox, { backgroundColor: `${catColor}18` }]}>
                        {CAT_ICON[task.category]}
                      </View>
                      <Text style={[st.catLabel, { color: catColor }]}>
                        {CAT_LABEL[task.category].toUpperCase()}
                      </Text>
                      {task.coopId && (
                        <View style={st.coopBadge}>
                          <Users size={9} color="#3b82f6" />
                          <Text style={st.coopText}>AMCOS</Text>
                        </View>
                      )}
                      <View style={{ flex: 1 }} />
                      <View style={[st.priPill, {
                        backgroundColor: `${priColor}18`,
                        borderColor: `${priColor}45`,
                      }]}>
                        <View style={[st.priDot, { backgroundColor: priColor }]} />
                        <Text style={[st.priText, { color: priColor }]}>
                          {task.priority.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    {/* ── Body: checkbox + title ── */}
                    <View style={st.cardBody}>
                      <TouchableOpacity
                        onPress={() => handleToggleTask(task.id)}
                        style={[st.checkBtn, {
                          backgroundColor: isDone ? '#22d15a' : 'transparent',
                          borderColor: isDone ? '#22d15a' : (isDark ? 'rgba(255,255,255,0.18)' : colors.border),
                        }]}
                      >
                        {isDone && <Check size={12} color="#000" strokeWidth={3} />}
                      </TouchableOpacity>
                      <Text
                        style={[st.taskTitle, {
                          color: isDone ? colors.textMute : (isDark ? '#fff' : colors.text),
                          textDecorationLine: isDone ? 'line-through' : 'none',
                        }]}
                        numberOfLines={2}
                      >
                        {task.titleSw ?? task.title}
                      </Text>
                    </View>

                    {/* ── Footer chips ── */}
                    <View style={st.cardFooter}>
                      {task.farmBlock && (
                        <View style={st.chip}>
                          <MapPin size={9} color="#22d15a" />
                          <Text style={st.chipText}>{task.farmBlock}</Text>
                        </View>
                      )}
                      {task.dueDate && (
                        <View style={st.chip}>
                          <Clock size={9} color="#22d15a" />
                          <Text style={st.chipText}>{formatDue(task.dueDate)}</Text>
                        </View>
                      )}
                      <View style={[st.chip, { backgroundColor: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)' }]}>
                        <Sparkles size={9} color="#f59e0b" />
                        <Text style={[st.chipText, { color: '#f59e0b' }]}>+{task.xpReward} XP</Text>
                      </View>
                      <View style={[st.chip, { backgroundColor: `${statusColor}14`, borderColor: `${statusColor}38` }]}>
                        <Text style={[st.chipText, { color: statusColor }]}>{STATUS_LABEL[task.status]}</Text>
                      </View>
                      {task.syncedOffline && (
                        <View style={[st.chip, { backgroundColor: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)' }]}>
                          <CloudLightning size={9} color="#f59e0b" />
                          <Text style={[st.chipText, { color: '#f59e0b' }]}>Offline</Text>
                        </View>
                      )}
                    </View>

                    {/* In-progress micro bar */}
                    {isProgress && (
                      <View style={[st.progressBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
                        <LinearGradient
                          colors={['#3b82f6', '#06b6d4']}
                          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                          style={{ width: '55%', height: '100%', borderRadius: 3 }}
                        />
                      </View>
                    )}
                  </View>
                </Animated.View>
              );
            })}
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>

      {/* ── Create Task Modal ── */}
      <Modal visible={showCreate} transparent animationType="slide" onRequestClose={() => setShowCreate(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.65)' }}>
          <View style={[st.modalSheet, { backgroundColor: isDark ? '#0a140a' : '#fff' }]}>
            <View style={st.modalHandle} />

            <View style={st.modalHeader}>
              <Text style={[st.modalTitle, { color: colors.text }]}>Kazi Mpya</Text>
              <TouchableOpacity onPress={() => setShowCreate(false)} style={st.modalClose}>
                <X size={20} color={colors.textMute} />
              </TouchableOpacity>
            </View>

            {/* Inputs */}
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Jina la kazi (English)"
              placeholderTextColor={colors.textMute}
              style={[st.modalInput, { color: colors.text, borderColor: colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}
            />
            <TextInput
              value={newTitleSw}
              onChangeText={setNewTitleSw}
              placeholder="Jina kwa Kiswahili (hiari)"
              placeholderTextColor={colors.textMute}
              style={[st.modalInput, { color: colors.text, borderColor: colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}
            />
            <TextInput
              value={newBlock}
              onChangeText={setNewBlock}
              placeholder="Eneo la shamba (mfano: Block A)"
              placeholderTextColor={colors.textMute}
              style={[st.modalInput, { color: colors.text, borderColor: colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}
            />

            {/* Due date stepper */}
            <Text style={[st.modalSection, { color: colors.textMute }]}>SIKU ZA KUKAMILISHA</Text>
            <View style={st.dueStepper}>
              <TouchableOpacity
                onPress={() => setNewDueDays((d) => Math.max(1, d - 1))}
                style={[st.stepBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : colors.card, borderColor: colors.border }]}
              >
                <Text style={{ fontSize: 18, color: colors.text }}>−</Text>
              </TouchableOpacity>
              <View style={[st.stepVal, { backgroundColor: 'rgba(34,209,90,0.1)', borderColor: 'rgba(34,209,90,0.25)' }]}>
                <Text style={{ fontSize: 20, fontFamily: 'InstrumentSerif_400Regular', color: '#22d15a' }}>{newDueDays}</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Inter_500Medium', color: '#22d15a' }}>
                  {newDueDays === 1 ? 'siku' : 'siku'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setNewDueDays((d) => Math.min(90, d + 1))}
                style={[st.stepBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : colors.card, borderColor: colors.border }]}
              >
                <Text style={{ fontSize: 18, color: colors.text }}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Category */}
            <Text style={[st.modalSection, { color: colors.textMute }]}>AINA YA KAZI</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8, paddingBottom: 4 }}>
                {CATEGORIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setNewCat(c)}
                    style={[st.catPill, {
                      backgroundColor: newCat === c ? `${CAT_COLOR[c]}20` : 'transparent',
                      borderColor: newCat === c ? CAT_COLOR[c] : colors.border,
                    }]}
                  >
                    {CAT_ICON[c]}
                    <Text style={[st.catPillText, { color: newCat === c ? CAT_COLOR[c] : colors.textMute }]}>
                      {CAT_LABEL[c]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Priority */}
            <Text style={[st.modalSection, { color: colors.textMute }]}>KIPAUMBELE</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setNewPri(p)}
                  style={[st.priBtn, {
                    flex: 1,
                    backgroundColor: newPri === p ? `${PRI_COLOR[p]}20` : 'transparent',
                    borderColor: newPri === p ? PRI_COLOR[p] : colors.border,
                  }]}
                >
                  <View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: PRI_COLOR[p], marginBottom: 4 }]} />
                  <Text style={[st.priBtn2Text, { color: newPri === p ? PRI_COLOR[p] : colors.textMute }]}>
                    {p.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={handleCreate} style={st.createBtn}>
              <LinearGradient colors={['#22d15a', '#048038']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={st.createBtnGrad}>
                <Plus size={18} color="#fff" />
                <Text style={st.createBtnText}>Ongeza Kazi</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
  container: { flex: 1 },

  glowTR: {
    position: 'absolute', top: -80, right: -60,
    width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(34,209,90,0.08)',
  },
  glowBL: {
    position: 'absolute', bottom: 80, left: -80,
    width: 240, height: 240, borderRadius: 120,
    backgroundColor: 'rgba(34,209,90,0.05)',
  },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  commandBadge: {
    flexDirection: 'row', alignItems: 'center',
    gap: 5, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(34,209,90,0.1)',
    marginBottom: 4,
  },
  commandText: {
    fontSize: 9, fontFamily: 'Inter_700Bold',
    color: '#22d15a', letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 21, fontFamily: 'InstrumentSerif_400Regular',
    letterSpacing: -0.5,
  },

  scrollContent: { padding: 16 },

  // Dashboard card
  dashCard: {
    borderRadius: 22, borderWidth: 1,
    overflow: 'hidden', padding: 20, marginBottom: 20,
  },
  dashRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 14,
  },
  dashLabel: {
    fontSize: 9, fontFamily: 'Inter_700Bold',
    color: '#22d15a', letterSpacing: 1, marginBottom: 6,
  },
  dashTitle: {
    fontSize: 18, fontFamily: 'InstrumentSerif_400Regular',
    letterSpacing: -0.3, marginBottom: 3,
  },
  dashSub: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  dashCircle: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 3, borderColor: 'rgba(34,209,90,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  dashPct: {
    fontSize: 18, fontFamily: 'InstrumentSerif_400Regular',
    color: '#22d15a',
  },
  xpRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 5, marginBottom: 12,
  },
  xpText: {
    fontSize: 11, fontFamily: 'Inter_600SemiBold',
    color: '#f59e0b',
  },
  barTrack: {
    height: 8, borderRadius: 4, overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 4 },

  // Offline
  offlineCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, borderRadius: 16, marginBottom: 16,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)',
  },
  offlineTitle: {
    fontSize: 13, fontFamily: 'Inter_700Bold',
    color: '#ef4444', marginBottom: 2,
  },
  offlineDesc: {
    fontSize: 11, fontFamily: 'Inter_500Medium',
    color: '#fca5a5',
  },

  // Section header
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20, fontFamily: 'InstrumentSerif_400Regular',
    letterSpacing: -0.5,
  },
  filterBtn: {
    width: 42, height: 42, borderRadius: 14,
    borderWidth: 1, justifyContent: 'center', alignItems: 'center',
  },

  // Calendar
  calCard: {
    borderRadius: 22, borderWidth: 1,
    overflow: 'hidden', padding: 16,
  },
  calNav: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 14,
  },
  calNavBtn: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  calMonthLabel: {
    fontSize: 15, fontFamily: 'InstrumentSerif_400Regular',
    letterSpacing: -0.3,
  },
  calDayHdrRow: { flexDirection: 'row', marginBottom: 8 },
  calDayHdr: {
    flex: 1, textAlign: 'center',
    fontSize: 10, fontFamily: 'Inter_700Bold',
  },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: {
    width: '14.28%', alignItems: 'center', paddingVertical: 3,
  },
  calDayNum: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  calDots: { flexDirection: 'row', gap: 2, marginTop: 2 },
  calDot: { width: 4, height: 4, borderRadius: 2 },
  calSelBanner: {
    flexDirection: 'row', alignItems: 'center',
    gap: 7, marginTop: 14, padding: 10,
    borderRadius: 12, borderWidth: 1,
  },
  calSelText: {
    fontSize: 12, fontFamily: 'Inter_700Bold',
  },
  calAddBtn: {
    flexDirection: 'row', alignItems: 'center',
    gap: 4, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 8, backgroundColor: 'rgba(34,209,90,0.15)',
  },
  calAddText: {
    fontSize: 11, fontFamily: 'Inter_700Bold', color: '#22d15a',
  },

  // Task card
  taskCard: {
    borderRadius: 20, borderWidth: 1, borderLeftWidth: 3,
    overflow: 'hidden', padding: 16, gap: 12,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  catIconBox: {
    width: 28, height: 28, borderRadius: 9,
    justifyContent: 'center', alignItems: 'center',
  },
  catLabel: {
    fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.8,
  },
  coopBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6,
    backgroundColor: 'rgba(59,130,246,0.14)',
  },
  coopText: {
    fontSize: 8, fontFamily: 'Inter_700Bold', color: '#3b82f6',
  },
  priPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 9, paddingVertical: 4,
    borderRadius: 999, borderWidth: 1,
  },
  priDot: { width: 5, height: 5, borderRadius: 3 },
  priText: { fontSize: 8, fontFamily: 'Inter_700Bold', letterSpacing: 0.6 },

  cardBody: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  checkBtn: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 1.5, justifyContent: 'center', alignItems: 'center',
    marginTop: 2,
  },
  taskTitle: {
    flex: 1, fontSize: 17, fontFamily: 'Inter_700Bold',
    lineHeight: 24, letterSpacing: -0.2,
  },

  cardFooter: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 6,
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 8, borderWidth: 1,
    backgroundColor: 'rgba(34,209,90,0.07)',
    borderColor: 'rgba(34,209,90,0.22)',
  },
  chipText: {
    fontSize: 9, fontFamily: 'Inter_600SemiBold',
    color: 'rgba(34,209,90,0.9)',
  },

  progressBar: { height: 5, borderRadius: 3, overflow: 'hidden' },

  // Empty state
  emptyCard: {
    alignItems: 'center', gap: 12, padding: 40,
    borderRadius: 20, borderWidth: 1,
  },
  emptyText: {
    fontSize: 14, fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },

  // Modal
  modalSheet: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 44, gap: 14,
    borderWidth: 1, borderColor: 'rgba(34,209,90,0.1)',
  },
  modalHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center', marginBottom: 8,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20, fontFamily: 'InstrumentSerif_400Regular',
  },
  modalClose: {
    width: 34, height: 34, borderRadius: 17,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  modalInput: {
    borderWidth: 1, borderRadius: 14, padding: 14,
    fontFamily: 'Inter_500Medium', fontSize: 14,
  },
  modalSection: {
    fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 1,
  },
  dueStepper: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  stepBtn: {
    width: 44, height: 44, borderRadius: 14, borderWidth: 1,
    justifyContent: 'center', alignItems: 'center',
  },
  stepVal: {
    flex: 1, alignItems: 'center', paddingVertical: 10,
    borderRadius: 14, borderWidth: 1,
  },
  catPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 12, borderWidth: 1,
  },
  catPillText: {
    fontSize: 12, fontFamily: 'Inter_600SemiBold',
  },
  priBtn: {
    paddingVertical: 10, borderRadius: 12,
    borderWidth: 1, alignItems: 'center',
  },
  priBtn2Text: {
    fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.5,
  },
  createBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 4 },
  createBtnGrad: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, padding: 18,
  },
  createBtnText: {
    fontSize: 16, fontFamily: 'InstrumentSerif_400Regular',
    color: '#fff',
  },
});
