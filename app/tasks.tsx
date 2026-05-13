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
  LayoutGrid
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';
import { motion, AnimatePresence } from "motion/react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TASKS_DATA = [
  { id: '1', title: 'Apply Top-dressing Fertilizer', field: 'Field A (Maize)', date: '10:00 AM', priority: 'High', completed: false, category: 'Maintenance' },
  { id: '2', title: 'Check Irrigation System', field: 'Field B (Rice)', date: '02:00 PM', priority: 'Medium', completed: true, category: 'Infrastructure' },
  { id: '3', title: 'Harvest Tomatoes', field: 'Vegetable Garden', date: '06:00 AM', priority: 'High', completed: false, category: 'Harvest' },
  { id: '4', title: 'Meeting with Cooperative', field: 'Main Office', date: '09:00 AM', priority: 'Low', completed: false, category: 'Admin' },
  { id: '5', title: 'Soil Sample Collection', field: 'Field C', date: '08:30 AM', priority: 'Medium', completed: false, category: 'Planning' },
];

// Variants for staggered entrance
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Background Orb Component
const NeuralOrb = ({ color, size, delay, x, y }: any) => {
  return (
    <motion.View
      initial={{ x, y, opacity: 0, scale: 0.8 }}
      animate={{ 
        x: [x, x + 45, x - 25, x],
        y: [y, y - 55, y + 35, y],
        opacity: [0.08, 0.15, 0.1, 0.08],
        scale: [1, 1.12, 0.92, 1]
      }}
      transition={{
        duration: 18 + delay / 1000,
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
  const { colors, isDark, spacing, radius, shadows } = useTheme();
  const router = useRouter();

  const handleToggleTask = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Premium Background System */}
      <View style={StyleSheet.absoluteFill}>
        <NeuralOrb color={colors.primary} size={420} x={-120} y={100} delay={0} />
        <NeuralOrb color="#3b82f6" size={380} x={SCREEN_WIDTH - 150} y={250} delay={2000} />
        <NeuralOrb color="#10b981" size={320} x={SCREEN_WIDTH / 4} y={SCREEN_HEIGHT - 350} delay={4000} />
        
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
        <motion.View 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          style={{ flex: 1 }}
        >
          {/* Premium Glass Header */}
          <motion.View variants={itemVariants} style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <BlurView intensity={25} tint={isDark ? "dark" : "light"} style={styles.headerBtn}>
                <ChevronLeft size={24} color={colors.text} />
              </BlurView>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <View style={[styles.commandBadge, { backgroundColor: colors.primary + '20' }]}>
                <Target size={12} color={colors.primary} />
                <Text style={[styles.commandText, { color: colors.primary }]}>OPERATIONAL COMMAND</Text>
              </View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Strategic Tasks</Text>
            </View>

            <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)} activeOpacity={0.7}>
              <BlurView intensity={25} tint={isDark ? "dark" : "light"} style={styles.headerBtn}>
                <Plus size={24} color={colors.primary} />
              </BlurView>
            </TouchableOpacity>
          </motion.View>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            {/* Productivity Dashboard */}
            <motion.View variants={itemVariants} style={styles.dashboard}>
              <BlurView intensity={isDark ? 20 : 90} tint={isDark ? "dark" : "light"} style={[styles.dashboardCard, { borderColor: colors.border }]}>
                <LinearGradient
                  colors={isDark 
                    ? ['rgba(62, 207, 142, 0.12)', 'transparent'] 
                    : ['rgba(62, 207, 142, 0.08)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.dashboardHeader}>
                  <View style={{ flex: 1 }}>
                    <motion.Text 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={[styles.dashboardLabel, { color: colors.primary }]}
                    >
                      DAILY EFFICIENCY
                    </motion.Text>
                    <Text style={[styles.dashboardTitle, { color: colors.text }]}>Optimization Progress</Text>
                    <Text style={[styles.dashboardSubtitle, { color: colors.textMute }]}>4 nodes synchronized out of 12</Text>
                  </View>
                  <motion.View 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    style={[styles.progressCircle, { borderColor: colors.primary + '30' }]}
                  >
                    <Text style={[styles.progressText, { color: colors.primary }]}>33%</Text>
                  </motion.View>
                </View>
                <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                  <motion.View 
                    initial={{ width: 0 }}
                    animate={{ width: '33%' }}
                    transition={{ type: "spring", damping: 20, stiffness: 50, delay: 0.5 }}
                    style={{ height: '100%' }}
                  >
                    <LinearGradient
                      colors={[colors.primary, '#10b981']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.progressFill}
                    />
                  </motion.View>
                </View>
              </BlurView>
            </motion.View>

            {/* Temporal Navigation */}
            <motion.View variants={itemVariants} style={styles.temporalNav}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => {
                  const isActive = i === 2;
                  return (
                    <TouchableOpacity key={day} onPress={() => Haptics.selectionAsync()} activeOpacity={0.8}>
                      <BlurView 
                        intensity={isActive ? 0 : 20} 
                        tint={isDark ? "dark" : "light"}
                        style={[
                          styles.dateCard, 
                          isActive ? { backgroundColor: colors.primary } : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: colors.border, borderWidth: 1 }
                        ]}
                      >
                        <Text style={[styles.dateDay, isActive ? { color: '#000' } : { color: colors.textMute }]}>{day}</Text>
                        <Text style={[styles.dateNum, isActive ? { color: '#000' } : { color: colors.text }]}>{12 + i}</Text>
                      </BlurView>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </motion.View>

            {/* Operational Queue */}
            <motion.View variants={itemVariants} style={styles.queueHeader}>
              <Text style={[styles.queueTitle, { color: colors.text }]}>Active Operations</Text>
              <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <LayoutGrid size={18} color={colors.primary} />
              </TouchableOpacity>
            </motion.View>

            <View style={styles.taskList}>
              {TASKS_DATA.map((task, i) => (
                <motion.View 
                  key={task.id} 
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <TouchableOpacity onPress={() => handleToggleTask(task.id)} activeOpacity={0.85}>
                    <BlurView intensity={isDark ? 15 : 60} tint={isDark ? "dark" : "light"} style={[styles.taskCard, { borderColor: colors.border }]}>
                      {task.priority === 'High' && (
                        <View style={[styles.priorityGlow, { backgroundColor: '#ef4444', opacity: isDark ? 0.05 : 0.03 }]} />
                      )}
                      <View style={styles.taskCardHeader}>
                        <View style={[styles.catBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }]}>
                          <Text style={[styles.catText, { color: colors.textMute }]}>{task.category.toUpperCase()}</Text>
                        </View>
                        <View style={styles.priorityRow}>
                          <motion.View 
                            animate={task.priority === 'High' ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={[styles.priorityDot, { backgroundColor: task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : colors.textMute }]} 
                          />
                          <Text style={[styles.priorityText, { color: colors.textMute }]}>{task.priority} Priority</Text>
                        </View>
                      </View>
                      
                      <View style={styles.taskBody}>
                        <motion.View 
                          whileTap={{ scale: 0.8 }}
                          style={[
                            styles.checkCircle, 
                            { backgroundColor: task.completed ? colors.primary : 'transparent', borderColor: task.completed ? colors.primary : colors.border }
                          ]}
                        >
                          {task.completed && <Check size={16} color="#000" strokeWidth={3} />}
                        </motion.View>
                        <View style={styles.taskInfo}>
                          <Text style={[
                            styles.taskTitle, 
                            { color: colors.text },
                            task.completed && { textDecorationLine: 'line-through', opacity: 0.5 }
                          ]}>
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
  container: {
    flex: 1,
  },
  bgOrb: {
    position: 'absolute',
    filter: Platform.OS === 'web' ? 'blur(90px)' : undefined,
  },
  bgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 700,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 52,
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  headerCenter: {
    alignItems: 'center',
  },
  commandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 4,
  },
  commandText: {
    fontSize: 9,
    fontFamily: 'Inter_900Black',
    marginLeft: 6,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.8,
  },
  scrollContent: {
    padding: 20,
  },
  dashboard: {
    marginBottom: 36,
  },
  dashboardCard: {
    borderRadius: 36,
    padding: 28,
    overflow: 'hidden',
    borderWidth: 1,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  dashboardLabel: {
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  dashboardTitle: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  dashboardSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    opacity: 0.6,
  },
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontFamily: 'Inter_900Black',
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  temporalNav: {
    marginBottom: 36,
    marginHorizontal: -20,
  },
  dateScroll: {
    paddingHorizontal: 20,
  },
  dateCard: {
    width: 68,
    height: 88,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  dateDay: {
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  dateNum: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  queueTitle: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.8,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskList: {
    gap: 16,
  },
  taskCard: {
    borderRadius: 32,
    padding: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  priorityGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  taskCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  catBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  catText: {
    fontSize: 9,
    fontFamily: 'Inter_900Black',
    letterSpacing: 0.8,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    opacity: 0.6,
  },
  taskBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginRight: 20,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    lineHeight: 26,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  footerTagText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 8,
    opacity: 0.6,
  },
  fieldMarker: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
