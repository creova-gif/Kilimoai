import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  Dimensions, 
  Platform, 
  StatusBar,
} from 'react-native';
import { 
  User, 
  Bell, 
  Shield, 
  LogOut, 
  ChevronRight, 
  CreditCard, 
  HelpCircle, 
  BadgeCheck, 
  ExternalLink,
  Sparkles,
  Zap,
  Activity,
  LayoutGrid
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../constants/Theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Animation Variants
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Background Orb Component
const NeuralOrb = ({ color, size, delay, x, y }: any) => {
  return (
    <motion.View
      initial={{ x, y, opacity: 0, scale: 0.8 }}
      animate={{ 
        x: [x, x + 40, x - 20, x],
        y: [y, y - 50, y + 30, y],
        opacity: [0.05, 0.15, 0.1, 0.05],
        scale: [1, 1.1, 0.9, 1]
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
          filter: Platform.OS === 'web' ? 'blur(80px)' : undefined,
        },
      ]}
    />
  );
};

const itemVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 18
    }
  },
};

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();

  const handlePress = () => {
    Haptics.selectionAsync();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Premium Background System */}
      <View style={StyleSheet.absoluteFill}>
        <NeuralOrb color={colors.primary} size={350} x={-100} y={50} delay={0} />
        <NeuralOrb color="#3b82f6" size={250} x={SCREEN_WIDTH - 100} y={200} delay={2000} />
        <NeuralOrb color="#8b5cf6" size={200} x={SCREEN_WIDTH / 2} y={500} delay={4000} />
        
        <LinearGradient
          colors={[
            isDark ? colors.background : '#fff',
            isDark ? colors.background + 'cc' : colors.background + 'cc',
            'transparent'
          ]}
          style={styles.bgGradient}
        />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        <motion.View 
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.View variants={itemVariants} style={styles.header}>
            <View style={styles.avatarWrapper}>
              <LinearGradient
                colors={[colors.primary, '#16a34a']}
                style={styles.avatarGradient}
              >
                <User color="#ffffff" size={48} strokeWidth={1.5} />
              </LinearGradient>
              <View style={[styles.badgeContainer, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 2 }]}>
                <BadgeCheck size={20} color={colors.primary} fill={isDark ? 'transparent' : 'white'} />
              </View>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.text }]}>Justin Mafie</Text>
              <Text style={[styles.userEmail, { color: colors.textMute }]}>justin@kilimo.ai</Text>
              <TouchableOpacity 
                activeOpacity={0.8}
                style={[styles.proBadge, { backgroundColor: isDark ? 'rgba(62, 207, 142, 0.15)' : 'rgba(34, 197, 94, 0.1)', borderColor: colors.primary + '40' }]}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <Sparkles size={12} color={colors.primary} />
                <Text style={[styles.proBadgeText, { color: colors.primary }]}>KILIMO AI PRO</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quickStats}>
              <BlurView intensity={isDark ? 10 : 40} tint={isDark ? "dark" : "light"} style={[styles.statBox, { borderColor: colors.border }]}>
                <Text style={[styles.statNumber, { color: colors.text }]}>12</Text>
                <Text style={[styles.statLabel, { color: colors.textMute }]}>Fields</Text>
              </BlurView>
              <BlurView intensity={isDark ? 10 : 40} tint={isDark ? "dark" : "light"} style={[styles.statBox, { borderColor: colors.border }]}>
                <Text style={[styles.statNumber, { color: colors.text }]}>84%</Text>
                <Text style={[styles.statLabel, { color: colors.textMute }]}>Avg Health</Text>
              </BlurView>
              <BlurView intensity={isDark ? 10 : 40} tint={isDark ? "dark" : "light"} style={[styles.statBox, { borderColor: colors.border }]}>
                <Text style={[styles.statNumber, { color: colors.text }]}>2.4k</Text>
                <Text style={[styles.statLabel, { color: colors.textMute }]}>kg Yield</Text>
              </BlurView>
            </View>
          </motion.View>

          <View style={styles.content}>
            <motion.View variants={itemVariants}>
              <Text style={[styles.sectionTitle, { color: colors.textMute }]}>ACCOUNT INTELLIGENCE</Text>
              <BlurView intensity={isDark ? 5 : 30} tint={isDark ? "dark" : "light"} style={[styles.menuCard, { borderColor: colors.border }]}>
                <MenuItem 
                  icon={<User color="#3b82f6" size={20} />} 
                  label="Profile Data" 
                  colors={colors}
                  isDark={isDark}
                  onPress={handlePress}
                />
                <View style={[styles.itemDivider, { backgroundColor: colors.border }]} />
                <MenuItem 
                  icon={<Bell color="#f59e0b" size={20} />} 
                  label="Alert Protocols" 
                  colors={colors}
                  isDark={isDark}
                  hasSwitch
                  onPress={handlePress}
                />
                <View style={[styles.itemDivider, { backgroundColor: colors.border }]} />
                <MenuItem 
                  icon={<Shield color="#10b981" size={20} />} 
                  label="Secure Access" 
                  colors={colors}
                  isDark={isDark}
                  onPress={handlePress}
                />
              </BlurView>
            </motion.View>

            <motion.View variants={itemVariants}>
              <Text style={[styles.sectionTitle, { color: colors.textMute }]}>OPERATIONS</Text>
              <BlurView intensity={isDark ? 5 : 30} tint={isDark ? "dark" : "light"} style={[styles.menuCard, { borderColor: colors.border }]}>
                <MenuItem 
                  icon={<LayoutGrid color="#22c55e" size={20} />} 
                  label="Workspace Units" 
                  colors={colors}
                  isDark={isDark}
                  value="12 active"
                  onPress={handlePress}
                />
                <View style={[styles.itemDivider, { backgroundColor: colors.border }]} />
                <MenuItem 
                  icon={<CreditCard color="#6366f1" size={20} />} 
                  label="Nexus Billing" 
                  colors={colors}
                  isDark={isDark}
                  onPress={handlePress}
                />
                <View style={[styles.itemDivider, { backgroundColor: colors.border }]} />
                <MenuItem 
                  icon={<Activity color="#ec4899" size={20} />} 
                  label="Sensor Nodes" 
                  colors={colors}
                  isDark={isDark}
                  value="Online"
                  onPress={handlePress}
                />
              </BlurView>
            </motion.View>

            <motion.View variants={itemVariants}>
              <Text style={[styles.sectionTitle, { color: colors.textMute }]}>SUBSYSTEMS</Text>
              <BlurView intensity={isDark ? 5 : 30} tint={isDark ? "dark" : "light"} style={[styles.menuCard, { borderColor: colors.border }]}>
                <MenuItem 
                  icon={<HelpCircle color="#06b6d4" size={20} />} 
                  label="Knowledge Base" 
                  colors={colors}
                  isDark={isDark}
                  onPress={handlePress}
                />
                <View style={[styles.itemDivider, { backgroundColor: colors.border }]} />
                <MenuItem 
                  icon={<ExternalLink color="#8b5cf6" size={20} />} 
                  label="System Protocol" 
                  colors={colors}
                  isDark={isDark}
                  onPress={handlePress}
                />
              </BlurView>

              <TouchableOpacity 
                style={[styles.logoutButton, { borderColor: 'rgba(239, 68, 68, 0.2)', borderWidth: 1 }]} 
                onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)}
              >
                <BlurView intensity={isDark ? 5 : 20} tint="dark" style={StyleSheet.absoluteFill} />
                <LogOut color="#ef4444" size={20} />
                <Text style={styles.logoutText}>TERMINATE SESSION</Text>
              </TouchableOpacity>
            </motion.View>
            
            <motion.View variants={itemVariants} style={styles.footer}>
              <Text style={[styles.versionText, { color: colors.textMute }]}>Kilimo AI Core v2.4.8 High-Impact</Text>
              <Text style={[styles.copyrightText, { color: colors.textMute }]}>© 2026 KILIMO AI TECHNOLOGY GROUP</Text>
            </motion.View>
          </View>
        </motion.View>
      </ScrollView>
    </View>
  );
}

function MenuItem({ icon, label, colors, isDark, hasSwitch = false, value = '', onPress }: any) {
  return (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
          {icon}
        </View>
        <Text style={[styles.menuItemLabel, { color: colors.text }]}>{label}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {value ? <Text style={[styles.menuItemValue, { color: colors.primary }]}>{value}</Text> : null}
        {hasSwitch ? (
          <Switch 
            value={true} 
            trackColor={{ false: '#262626', true: colors.primary }}
            thumbColor="#ffffff"
          />
        ) : (
          <ChevronRight color={colors.textMute} size={18} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgOrb: {
    position: 'absolute',
    filter: 'blur(80px)',
  },
  bgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 600,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#3ecf8e",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  userName: {
    fontSize: 28,
    fontFamily: 'Inter_900Black',
    letterSpacing: -1,
    marginBottom: 6,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    marginBottom: 16,
    opacity: 0.7,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  proBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.5,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    opacity: 0.6,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.5,
    marginBottom: 16,
    marginTop: 24,
    paddingLeft: 4,
    opacity: 0.8,
  },
  menuCard: {
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  itemDivider: {
    height: 1,
    marginHorizontal: 20,
    opacity: 0.05,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemLabel: {
    fontSize: 17,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.3,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 14,
    marginRight: 10,
    fontFamily: 'Inter_900Black',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
    borderRadius: 28,
    marginTop: 32,
    marginBottom: 40,
    overflow: 'hidden',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontFamily: 'Inter_900Black',
    marginLeft: 12,
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 6,
    opacity: 0.7,
  },
  copyrightText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    opacity: 0.4,
    letterSpacing: 0.5,
  },
});
