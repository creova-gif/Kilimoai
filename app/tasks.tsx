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
  Platform
} from 'react-native';
import { 
  ChevronLeft, 
  Plus, 
  CheckCircle2, 
  Circle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Sparkles,
  Calendar as CalendarIcon,
  Bell,
  Check,
  Target,
  LayoutGrid,
  WifiOff,
  CloudLightning,
  Users,
  X
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { TextInput, Modal, Alert } from 'react-native';
import { useTheme } from '../constants/Theme';
import Animated, { FadeIn, FadeOut, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { springs, transitions } from '../constants/MotionTokens';
import { useKilimoStore } from '../store/useKilimoStore';
import { useTasks, TaskCategory, TaskPriority } from '../hooks/useTasks';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TASKS_DATA = [
  { id: '1', title: 'Weka Mbolea (Top-dressing)', field: 'Kitalu A (Mahindi)', date: '10:00 AM', priority: 'High', completed: false, category: 'Matunzo', sync: 'synced' },
  { id: '2', title: 'Kagua Mfumo wa Umwagiliaji', field: 'Kitalu B (Mpunga)', date: '02:00 PM', priority: 'Medium', completed: true, category: 'Miundombinu', sync: 'synced' },
  { id: '3', title: 'Vuna Nyanya', field: 'Bustani', date: '06:00 AM', priority: 'High', completed: false, category: 'Mavuno', sync: 'pending' },
  { id: '4', title: 'Kikao na Ushirika (AMCOS)', field: 'Ofisi Kuu', date: '09:00 AM', priority: 'Low', completed: false, category: 'Utawala', sync: 'synced', group: true },
  { id: '5', title: 'Chukua Sampuli ya Udongo', field: 'Kitalu C', date: '08:30 AM', priority: 'Medium', completed: false, category: 'Mipango', sync: 'synced' },
];

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const NeuralOrb = ({ color, size, delay, x, y }: any) => {
  return (
    <Animated.View
      entering={FadeInDown}
      style={[
        styles.bgOrb,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          filter: Platform.OS === 'web' ? 'blur(90px)' : undefined,
        },
      ]}
    />
  );
};

const itemVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    // motion-foundations: use springs token, not inline values
    transition: springs.gentle,
  }
};

const CATEGORIES: TaskCategory[] = ['irrigation','planting','harvest','scouting','finance','general'];
const PRIORITIES: TaskPriority[] = ['low','medium','high','critical'];
const CAT_LABEL: Record<TaskCategory,string> = { irrigation:'Umwagiliaji', planting:'Upanzi', harvest:'Mavuno', scouting:'Uchunguzi', finance:'Fedha', general:'Jumla' };
const PRI_COLOR: Record<TaskPriority,string> = { low:'#22c55e', medium:'#f59e0b', high:'#f97316', critical:'#ef4444' };

export default function TasksScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  // ── Live store & hooks ───────────────────────────────────
  const isOffline = useKilimoStore((s) => s.isOffline);
  const syncQueue = useKilimoStore((s) => s.syncQueue);
  const { tasks, pendingTasks, completedTasks, totalXP, completeTask, createTask, cancelTask } = useTasks();

  // Create task modal state
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTitleSw, setNewTitleSw] = useState('');
  const [newCat, setNewCat] = useState<TaskCategory>('general');
  const [newPri, setNewPri] = useState<TaskPriority>('medium');
  const [newBlock, setNewBlock] = useState('');
  // Filter & view state
  const [filter, setFilter] = useState<'all'|'pending'|'done'>('all');
  const [viewMode, setViewMode] = useState<'list'|'calendar'>('list');
  const [selectedDay, setSelectedDay] = useState<number|null>(null);

  const displayTasks = (() => {
    const base = filter === 'pending' ? pendingTasks : filter === 'done' ? completedTasks : tasks;
    if (viewMode === 'calendar' && selectedDay !== null) {
      const now = new Date();
      return base.filter((t) => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        return d.getDate() === selectedDay && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
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
      dueDate: new Date(Date.now() + 24 * 3600_000).toISOString(),
    });
    setShowCreate(false);
    setNewTitle(''); setNewTitleSw(''); setNewBlock('');
    setNewCat('general'); setNewPri('medium');
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <View style={StyleSheet.absoluteFill}>
        
        
        
        <LinearGradient
          colors={[
            isDark ? colors.slate[950] : '#fff',
            isDark ? colors.slate[900] + 'ee' : colors.slate[50] + 'ee',
            'transparent'
          ]}
          style={styles.bgGradient}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={{ flex: 1 }}>
          
          <Animated.View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <BlurView intensity={25} tint={isDark ? "dark" : "light"} style={[styles.headerBtn, { borderColor: colors.border }]}>
                <ChevronLeft size={24} color={colors.text} />
              </BlurView>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <View style={[styles.commandBadge, { backgroundColor: colors.primary + '20' }]}>
                <Target size={12} color={colors.primary} />
                <Text style={[styles.commandText, { color: colors.primary }]}>MTAA WA OPERESHENI</Text>
              </View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Kazi za Shamba</Text>
            </View>

            <TouchableOpacity
              onPress={() => { if (isOffline) { Alert.alert('Nje ya Mtandao', 'Kazi itahifadhiwa na kutumwa baadaye.'); } setShowCreate(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={isOffline ? 'Offline: new task will be queued' : 'Add new task'}
            >
              <BlurView intensity={25} tint={isDark ? "dark" : "light"} style={[styles.headerBtn, { borderColor: isOffline ? '#ef444450' : colors.border }]}>
                {isOffline ? <WifiOff size={20} color="#ef4444" /> : <Plus size={24} color={colors.primary} />}
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Gamification Dashboard */}
            <Animated.View style={styles.dashboard}>
              <BlurView intensity={isDark ? 20 : 90} tint={isDark ? "dark" : "light"} style={[styles.dashboardCard, { borderColor: colors.border }]}>
                <LinearGradient
                  colors={isDark ? ['rgba(62, 207, 142, 0.15)', 'transparent'] : ['rgba(62, 207, 142, 0.08)', 'transparent']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.dashboardHeader}>
                  <View style={{ flex: 1 }}>
                    <Animated.Text /* Reanimated Todo */ style={[styles.dashboardLabel, { color: colors.primary }]}>
                      UFANISI WA LEO
                    </Animated.Text>
                    <Text style={[styles.dashboardTitle, { color: colors.text }]}>Maendeleo ya Kazi</Text>
                    <Text style={[styles.dashboardSubtitle, { color: colors.textMute }]}>Kazi {completedTasks.length} zimekamilika kati ya {tasks.length}</Text>
                  </View>
                  <Animated.View style={[styles.progressCircle, { borderColor: colors.primary + '30' }]}>
                    <Text style={[styles.progressText, { color: colors.primary }]}>{progress}%</Text>
                  </Animated.View>
                </View>
                <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                  <Animated.View 
                    style={{ height: '100%' }}
                  >
                    <LinearGradient colors={[colors.primary, '#10b981']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.progressFill} />
                  </Animated.View>
                </View>
              </BlurView>
            </Animated.View>

            {/* Offline Sync Warning */}
            
              {isOffline && (
                <Animated.View 
                  entering={FadeInDown} exiting={FadeOut}
                  style={{ overflow: 'hidden', marginBottom: 24 }}
                >
                  <View style={[styles.offlineCard, { backgroundColor: '#ef444415', borderColor: '#ef444430' }]}>
                    <AlertCircle size={20} color="#ef4444" />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[styles.offlineTitle, { color: '#ef4444' }]}>Hali ya Mtandao</Text>
                      <Text style={[styles.offlineDesc, { color: isDark ? '#fca5a5' : '#b91c1c' }]}>Upo nje ya mtandao. Kazi zitahifadhiwa kwenye simu na kutumwa baadaye.</Text>
                    </View>
                  </View>
                </Animated.View>
              )}
            

            <Animated.View style={styles.queueHeader}>
              <Text style={[styles.queueTitle, { color: colors.text }]}>Orodha ya Kazi</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {/* Calendar / List toggle */}
                <TouchableOpacity
                  onPress={() => { setViewMode(v => v === 'list' ? 'calendar' : 'list'); setSelectedDay(null); Haptics.selectionAsync(); }}
                  style={[styles.filterBtn, { backgroundColor: viewMode === 'calendar' ? colors.primary + '20' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'), borderColor: viewMode === 'calendar' ? colors.primary : colors.border }]}
                  accessibilityRole="button"
                  accessibilityLabel={viewMode === 'calendar' ? 'Switch to list view' : 'Switch to calendar view'}
                >
                  {viewMode === 'calendar' ? <LayoutGrid size={18} color={colors.primary} /> : <CalendarIcon size={18} color={colors.textMute} />}
                </TouchableOpacity>
                {(['all','pending','done'] as const).map((f) => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => { setFilter(f); Haptics.selectionAsync(); }}
                    style={[styles.filterBtn, {
                      backgroundColor: filter === f ? colors.primary : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                      borderColor: filter === f ? colors.primary : colors.border,
                      paddingHorizontal: 10,
                    }]}
                    accessibilityRole="button"
                    accessibilityLabel={f === 'all' ? 'Show all tasks' : f === 'pending' ? 'Show pending tasks' : 'Show completed tasks'}
                    accessibilityState={{ selected: filter === f }}
                  >
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 10, color: filter === f ? '#000' : colors.textMute }}>
                      {f === 'all' ? 'ZOTE' : f === 'pending' ? 'ZINAZO' : 'ZIMEKAM'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>

            {/* ── Month Calendar View ─────────────────────────────── */}
            
              {viewMode === 'calendar' && (
                <Animated.View
                  entering={FadeInDown} exiting={FadeOut}
                  style={{ overflow: 'hidden', marginBottom: 24 }}
                >
                  <BlurView intensity={isDark ? 18 : 55} tint={isDark ? 'dark' : 'light'} style={[styles.calCard, { borderColor: colors.border }]}>
                    {/* Month label */}
                    {(() => {
                      const now = new Date();
                      const monthNames = ['Januari','Februari','Machi','Aprili','Mei','Juni','Julai','Agosti','Septemba','Oktoba','Novemba','Desemba'];
                      const month = now.getMonth();
                      const year = now.getFullYear();
                      const firstDay = new Date(year, month, 1).getDay();
                      const daysInMonth = new Date(year, month + 1, 0).getDate();
                      const today = now.getDate();

                      // Build tasksByDay index
                      const tasksByDay: Record<number, typeof tasks> = {};
                      tasks.forEach((t) => {
                        if (!t.dueDate) return;
                        const d = new Date(t.dueDate);
                        if (d.getMonth() === month && d.getFullYear() === year) {
                          const day = d.getDate();
                          if (!tasksByDay[day]) tasksByDay[day] = [];
                          tasksByDay[day].push(t);
                        }
                      });

                      const cells: (number | null)[] = Array(firstDay).fill(null);
                      for (let d = 1; d <= daysInMonth; d++) cells.push(d);
                      const DAY_HDRS = ['J','T','K','A','Al','Ij','S'];

                      return (
                        <>
                          <Text style={[styles.calMonth, { color: colors.text }]}>{monthNames[month]} {year}</Text>
                          <View style={styles.calDayHdrs}>
                            {DAY_HDRS.map((d, i) => <Text key={i} style={[styles.calDayHdr, { color: colors.textMute }]}>{d}</Text>)}
                          </View>
                          <View style={styles.calGrid}>
                            {cells.map((day, i) => {
                              if (!day) return <View key={`e${i}`} style={styles.calCell} />;
                              const isToday = day === today;
                              const isSel = day === selectedDay;
                              const dayTasks = tasksByDay[day] || [];
                              return (
                                <TouchableOpacity
                                  key={day}
                                  onPress={() => { setSelectedDay(isSel ? null : day); Haptics.selectionAsync(); }}
                                  style={styles.calCell}
                                  accessibilityRole="button"
                                  accessibilityLabel={`Day ${day}${dayTasks.length > 0 ? `, ${dayTasks.length} tasks` : ''}`}
                                  accessibilityState={{ selected: isSel }}
                                >
                                  <View style={[styles.calDayNum, isToday && { backgroundColor: colors.primary + '25' }, isSel && { backgroundColor: colors.primary }]}>
                                    <Text style={{ fontSize: 13, fontFamily: isToday ? 'Inter_900Black' : 'Inter_500Medium', color: isSel ? (isDark ? '#000' : '#FCFBF7') : isToday ? colors.primary : colors.text }}>{day}</Text>
                                  </View>
                                  {dayTasks.length > 0 && (
                                    <View style={styles.calDots}>
                                      {dayTasks.slice(0, 3).map((t, ti) => (
                                        <View key={ti} style={[styles.calDot, { backgroundColor: PRI_COLOR[t.priority as TaskPriority] || colors.primary }]} />
                                      ))}
                                    </View>
                                  )}
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                          {selectedDay && (
                            <View style={[styles.calSelBanner, { backgroundColor: colors.primary + '15' }]}>
                              <CalendarIcon size={13} color={colors.primary} />
                              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: colors.primary }}>
                                {selectedDay} {monthNames[month]} — kazi {displayTasks.length}
                              </Text>
                              <TouchableOpacity
                                onPress={() => setSelectedDay(null)}
                                accessibilityRole="button"
                                accessibilityLabel="Clear selected day"
                              ><X size={14} color={colors.primary} /></TouchableOpacity>
                            </View>
                          )}
                        </>
                      );
                    })()}
                  </BlurView>
                </Animated.View>
              )}
            

            <View style={styles.taskList}>
              {displayTasks.map((task) => (
                <Animated.View key={task.id} >
                  <TouchableOpacity
                    onPress={() => handleToggleTask(task.id)}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel={`${task.status === 'done' ? 'Mark incomplete' : 'Mark complete'}: ${task.titleSw ?? task.title}`}
                    accessibilityState={{ checked: task.status === 'done' }}
                  >
                    <BlurView intensity={isDark ? 20 : 60} tint={isDark ? "dark" : "light"} style={[
                      styles.taskCard, 
                      { borderColor: colors.border },
                      task.status === 'done' && { opacity: 0.7 }
                    ]}>
                      
                      <View style={styles.taskCardHeader}>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <View style={[styles.catBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }]}>
                            <Text style={[styles.catText, { color: colors.textMute }]}>{task.category.toUpperCase()}</Text>
                          </View>
                          {task.coopId && (
                            <View style={[styles.catBadge, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                              <Users size={10} color="#3b82f6" style={{ marginRight: 4 }} />
                              <Text style={[styles.catText, { color: '#3b82f6' }]}>AMCOS</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.priorityRow}>
                          <View style={[styles.priorityDot, { backgroundColor: task.priority === 'critical' ? '#ef4444' : task.priority === 'high' ? '#f59e0b' : colors.textMute }]} />
                          <Text style={[styles.priorityText, { color: colors.textMute }]}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.taskBody}>
                        <Animated.View 
                          style={[
                            styles.checkCircle, 
                            { backgroundColor: task.status === 'done' ? colors.primary : 'transparent', borderColor: task.status === 'done' ? colors.primary : colors.border }
                          ]}
                        >
                          {task.status === 'done' && <Check size={16} color={isDark ? '#000' : '#FCFBF7'} strokeWidth={3} />}
                        </Animated.View>
                        <View style={styles.taskInfo}>
                          <Text style={[styles.taskTitle, { color: colors.text }, task.status === 'done' && { textDecorationLine: 'line-through' }]}>
                            {task.titleSw ?? task.title}
                          </Text>
                          <View style={styles.taskFooter}>
                            {task.farmBlock && (
                              <View style={styles.footerTag}>
                                <View style={[styles.fieldMarker, { backgroundColor: colors.primary }]} />
                                <Text style={[styles.footerTagText, { color: colors.textMute }]}>{task.farmBlock}</Text>
                              </View>
                            )}
                            {task.dueDate && (
                              <View style={styles.footerTag}>
                                <Clock size={12} color={colors.primary} />
                                <Text style={[styles.footerTagText, { color: colors.textMute }]}>
                                  {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                              </View>
                            )}
                            {task.syncedOffline && (
                              <View style={styles.footerTag}>
                                <CloudLightning size={12} color="#f59e0b" />
                                <Text style={[styles.footerTagText, { color: '#f59e0b' }]}>Inasubiri mtandao</Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            <View style={{ height: 120 }} />
          </ScrollView>
        </Animated.View>
      </SafeAreaView>

      {/* ── Create Task Modal ──────────────────────────────── */}
      <Modal visible={showCreate} transparent animationType="slide" onRequestClose={() => setShowCreate(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <View style={{ backgroundColor: isDark ? '#0f172a' : '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, gap: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Inter_900Black', fontSize: 20, color: colors.text }}>Kazi Mpya</Text>
              <TouchableOpacity
                onPress={() => setShowCreate(false)}
                accessibilityRole="button"
                accessibilityLabel="Close create task modal"
              >
                <X size={22} color={colors.textMute} />
              </TouchableOpacity>
            </View>

            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Jina la kazi (English)"
              placeholderTextColor={colors.textMute}
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.text, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
              accessibilityLabel="Task name in English"
            />
            <TextInput
              value={newTitleSw}
              onChangeText={setNewTitleSw}
              placeholder="Jina kwa Kiswahili (hiari)"
              placeholderTextColor={colors.textMute}
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.text, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
              accessibilityLabel="Task name in Swahili (optional)"
            />
            <TextInput
              value={newBlock}
              onChangeText={setNewBlock}
              placeholder="Eneo la shamba (hiari, mfano: Block A)"
              placeholderTextColor={colors.textMute}
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.text, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
              accessibilityLabel="Farm block or area (optional)"
            />

            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: colors.textMute, letterSpacing: 1 }}>AINA YA KAZI</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {CATEGORIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setNewCat(c)}
                    style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: newCat === c ? colors.primary : colors.border, backgroundColor: newCat === c ? colors.primary + '20' : 'transparent' }}
                    accessibilityRole="button"
                    accessibilityLabel={CAT_LABEL[c]}
                    accessibilityState={{ selected: newCat === c }}
                  >
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: newCat === c ? colors.primary : colors.textMute }}>{CAT_LABEL[c]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: colors.textMute, letterSpacing: 1 }}>KIPAUMBELE</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setNewPri(p)}
                  style={{ flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center', borderColor: newPri === p ? PRI_COLOR[p] : colors.border, backgroundColor: newPri === p ? PRI_COLOR[p] + '20' : 'transparent' }}
                  accessibilityRole="button"
                  accessibilityLabel={`Set priority to ${p}`}
                  accessibilityState={{ selected: newPri === p }}
                >
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: newPri === p ? PRI_COLOR[p] : colors.textMute, textTransform: 'uppercase' }}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleCreate}
              style={{ backgroundColor: colors.primary, borderRadius: 16, padding: 18, alignItems: 'center', marginTop: 4 }}
              accessibilityRole="button"
              accessibilityLabel="Add new task"
            >
              <Text style={{ fontFamily: 'Inter_900Black', fontSize: 16, color: isDark ? '#000' : '#FCFBF7' }}>Ongeza Kazi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgOrb: { position: 'absolute' },
  bgGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 700 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerBtn: { width: 52, height: 52, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, overflow: 'hidden' },
  headerCenter: { alignItems: 'center' },
  commandBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginBottom: 4 },
  commandText: { fontSize: 9, fontFamily: 'Inter_900Black', marginLeft: 6, letterSpacing: 1 },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_900Black', letterSpacing: -0.8 },
  scrollContent: { padding: 20 },
  dashboard: { marginBottom: 24 },
  dashboardCard: { borderRadius: 36, padding: 28, overflow: 'hidden', borderWidth: 1 },
  dashboardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  dashboardLabel: { fontSize: 10, fontFamily: 'Inter_900Black', letterSpacing: 1.2, marginBottom: 8 },
  dashboardTitle: { fontSize: 22, fontFamily: 'Inter_900Black', marginBottom: 4, letterSpacing: -0.5 },
  dashboardSubtitle: { fontSize: 13, fontFamily: 'Inter_500Medium', opacity: 0.6 },
  progressCircle: { width: 64, height: 64, borderRadius: 32, borderWidth: 4, justifyContent: 'center', alignItems: 'center' },
  progressText: { fontSize: 18, fontFamily: 'Inter_900Black' },
  progressTrack: { height: 10, borderRadius: 5, width: '100%', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  offlineCard: { flexDirection: 'row', padding: 16, borderRadius: 20, borderWidth: 1, alignItems: 'center' },
  offlineTitle: { fontSize: 14, fontFamily: 'Inter_800ExtraBold', marginBottom: 4 },
  offlineDesc: { fontSize: 12, fontFamily: 'Inter_500Medium', lineHeight: 18 },
  queueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  queueTitle: { fontSize: 22, fontFamily: 'Inter_900Black', letterSpacing: -0.8 },
  filterBtn: { width: 48, height: 48, borderRadius: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  calCard: { borderRadius: 24, padding: 18, borderWidth: 1, overflow: 'hidden' },
  calMonth: { fontSize: 16, fontFamily: 'Inter_900Black', marginBottom: 14, textAlign: 'center' },
  calDayHdrs: { flexDirection: 'row', marginBottom: 8 },
  calDayHdr: { flex: 1, textAlign: 'center', fontSize: 10, fontFamily: 'Inter_800ExtraBold' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: { width: '14.28%', alignItems: 'center', paddingVertical: 4 },
  calDayNum: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  calDots: { flexDirection: 'row', gap: 2, marginTop: 2 },
  calDot: { width: 4, height: 4, borderRadius: 2 },
  calSelBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14, padding: 10, borderRadius: 10 },
  taskList: { gap: 16 },
  taskCard: { borderRadius: 32, padding: 24, overflow: 'hidden', borderWidth: 1 },
  taskCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  catBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  catText: { fontSize: 9, fontFamily: 'Inter_900Black', letterSpacing: 0.8 },
  priorityRow: { flexDirection: 'row', alignItems: 'center' },
  priorityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  priorityText: { fontSize: 12, fontFamily: 'Inter_700Bold', opacity: 0.6 },
  taskBody: { flexDirection: 'row', alignItems: 'flex-start' },
  checkCircle: { width: 32, height: 32, borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginTop: 2, marginRight: 20 },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 18, fontFamily: 'Inter_800ExtraBold', lineHeight: 26, marginBottom: 12, letterSpacing: -0.2 },
  taskFooter: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  footerTag: { flexDirection: 'row', alignItems: 'center' },
  footerTagText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', marginLeft: 6, opacity: 0.8 },
  fieldMarker: { width: 6, height: 6, borderRadius: 3 },
});
