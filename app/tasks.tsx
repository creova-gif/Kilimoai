import React, { useState } from 'react';
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
  Users
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';
import { motion, AnimatePresence } from "motion/react";

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
    <motion.View
      initial={{ x, y, opacity: 0, scale: 0.8 }}
      animate={{ 
        x: [x, x + 40, x - 20, x],
        y: [y, y - 50, y + 30, y],
        opacity: [0.08, 0.15, 0.1, 0.08],
        scale: [1, 1.1, 0.95, 1]
      }}
      transition={{
        duration: 20 + delay / 1000,
        repeat: Infinity,
        ease: "easeInOut",
      }}
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
    transition: { type: "spring", damping: 20, stiffness: 100 }
  }
};

export default function TasksScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [offlineMode, setOfflineMode] = useState(true); // Demo offline state
  const [tasks, setTasks] = useState(TASKS_DATA);

  const handleToggleTask = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed, sync: offlineMode ? 'pending' : 'synced' } : t));
  };

  const progress = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <View style={StyleSheet.absoluteFill}>
        <NeuralOrb color={colors.primary} size={400} x={-100} y={50} delay={0} />
        <NeuralOrb color="#8b5cf6" size={350} x={SCREEN_WIDTH - 150} y={300} delay={2000} />
        
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
        <motion.View variants={containerVariants} initial="initial" animate="animate" style={{ flex: 1 }}>
          
          <motion.View variants={itemVariants} style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
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

            <TouchableOpacity onPress={() => setOfflineMode(!offlineMode)} activeOpacity={0.7}>
              <BlurView intensity={25} tint={isDark ? "dark" : "light"} style={[styles.headerBtn, { borderColor: offlineMode ? '#ef444450' : colors.border }]}>
                {offlineMode ? <WifiOff size={20} color="#ef4444" /> : <Plus size={24} color={colors.primary} />}
              </BlurView>
            </TouchableOpacity>
          </motion.View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Gamification Dashboard */}
            <motion.View variants={itemVariants} style={styles.dashboard}>
              <BlurView intensity={isDark ? 20 : 90} tint={isDark ? "dark" : "light"} style={[styles.dashboardCard, { borderColor: colors.border }]}>
                <LinearGradient
                  colors={isDark ? ['rgba(62, 207, 142, 0.15)', 'transparent'] : ['rgba(62, 207, 142, 0.08)', 'transparent']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.dashboardHeader}>
                  <View style={{ flex: 1 }}>
                    <motion.Text animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity }} style={[styles.dashboardLabel, { color: colors.primary }]}>
                      UFANISI WA LEO
                    </motion.Text>
                    <Text style={[styles.dashboardTitle, { color: colors.text }]}>Maendeleo ya Kazi</Text>
                    <Text style={[styles.dashboardSubtitle, { color: colors.textMute }]}>Kazi {tasks.filter(t=>t.completed).length} zimekamilika kati ya {tasks.length}</Text>
                  </View>
                  <motion.View whileHover={{ scale: 1.05 }} style={[styles.progressCircle, { borderColor: colors.primary + '30' }]}>
                    <Text style={[styles.progressText, { color: colors.primary }]}>{progress}%</Text>
                  </motion.View>
                </View>
                <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                  <motion.View 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", damping: 20 }}
                    style={{ height: '100%' }}
                  >
                    <LinearGradient colors={[colors.primary, '#10b981']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.progressFill} />
                  </motion.View>
                </View>
              </BlurView>
            </motion.View>

            {/* Offline Sync Warning */}
            <AnimatePresence>
              {offlineMode && (
                <motion.View 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', marginBottom: 24 }}
                >
                  <View style={[styles.offlineCard, { backgroundColor: '#ef444415', borderColor: '#ef444430' }]}>
                    <AlertCircle size={20} color="#ef4444" />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[styles.offlineTitle, { color: '#ef4444' }]}>Hali ya Mtandao</Text>
                      <Text style={[styles.offlineDesc, { color: isDark ? '#fca5a5' : '#b91c1c' }]}>Upo nje ya mtandao. Kazi zitahifadhiwa kwenye simu na kutumwa baadaye.</Text>
                    </View>
                  </View>
                </motion.View>
              )}
            </AnimatePresence>

            <motion.View variants={itemVariants} style={styles.queueHeader}>
              <Text style={[styles.queueTitle, { color: colors.text }]}>Orodha ya Kazi</Text>
              <TouchableOpacity style={[styles.filterBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderColor: colors.border }]}>
                <LayoutGrid size={18} color={colors.primary} />
              </TouchableOpacity>
            </motion.View>

            <View style={styles.taskList}>
              {tasks.map((task) => (
                <motion.View key={task.id} variants={itemVariants} layout>
                  <TouchableOpacity onPress={() => handleToggleTask(task.id)} activeOpacity={0.85}>
                    <BlurView intensity={isDark ? 20 : 60} tint={isDark ? "dark" : "light"} style={[
                      styles.taskCard, 
                      { borderColor: colors.border },
                      task.completed && { opacity: 0.7 }
                    ]}>
                      
                      <View style={styles.taskCardHeader}>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <View style={[styles.catBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }]}>
                            <Text style={[styles.catText, { color: colors.textMute }]}>{task.category.toUpperCase()}</Text>
                          </View>
                          {task.group && (
                            <View style={[styles.catBadge, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                              <Users size={10} color="#3b82f6" style={{ marginRight: 4 }} />
                              <Text style={[styles.catText, { color: '#3b82f6' }]}>AMCOS</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.priorityRow}>
                          <View style={[styles.priorityDot, { backgroundColor: task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : colors.textMute }]} />
                          <Text style={[styles.priorityText, { color: colors.textMute }]}>{task.priority}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.taskBody}>
                        <motion.View 
                          style={[
                            styles.checkCircle, 
                            { backgroundColor: task.completed ? colors.primary : 'transparent', borderColor: task.completed ? colors.primary : colors.border }
                          ]}
                        >
                          {task.completed && <Check size={16} color="#000" strokeWidth={3} />}
                        </motion.View>
                        <View style={styles.taskInfo}>
                          <Text style={[styles.taskTitle, { color: colors.text }, task.completed && { textDecorationLine: 'line-through' }]}>
                            {task.title}
                          </Text>
                          <View style={styles.taskFooter}>
                            <View style={styles.footerTag}>
                              <Clock size={12} color={colors.primary} />
                              <Text style={[styles.footerTagText, { color: colors.textMute }]}>{task.date}</Text>
                            </View>
                            <View style={styles.footerTag}>
                              <View style={[styles.fieldMarker, { backgroundColor: colors.primary }]} />
                              <Text style={[styles.footerTagText, { color: colors.textMute }]}>{task.field}</Text>
                            </View>
                            {task.sync === 'pending' && (
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
                </motion.View>
              ))}
            </View>

            <View style={{ height: 120 }} />
          </ScrollView>
        </motion.View>
      </SafeAreaView>
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
