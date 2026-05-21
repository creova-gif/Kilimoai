import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions, 
  Image, 
  Platform,
  StatusBar
} from 'react-native';
import { 
  ChevronLeft, 
  Layers, 
  Locate, 
  Plus,
  MapPin,
  Settings,
  Info,
  Maximize2,
  Navigation,
  Search,
  Target,
  Zap,
  Globe
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';
import { motion, AnimatePresence } from "motion/react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 120 }
  }
};

const controlVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", damping: 20, stiffness: 100 }
  }
};

export default function MapScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const handleAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* High-Fidelity Satellite View Mock */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop' }} 
        style={styles.mapImage}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.7)']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.overlay}>
        <motion.View variants={containerVariants} initial="initial" animate="animate" style={{ flex: 1 }}>
          
          <motion.View variants={itemVariants} style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <BlurView intensity={30} tint="dark" style={styles.iconBtn}>
                <ChevronLeft size={24} color="#fff" />
              </BlurView>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <View style={[styles.spatialBadge, { backgroundColor: colors.primary + '30' }]}>
                <Globe size={10} color={colors.primary} />
                <Text style={[styles.spatialText, { color: colors.primary }]}>INTELIJENSIA YA ANGA v4.1</Text>
              </View>
              <BlurView intensity={25} tint="dark" style={styles.searchContainer}>
                <Search size={18} color="rgba(255,255,255,0.6)" style={{ marginRight: 12 }} />
                <Text style={styles.searchPlaceholder}>Changanua Eneo Lako...</Text>
              </BlurView>
            </View>

            <TouchableOpacity onPress={handleAction} activeOpacity={0.7}>
              <BlurView intensity={30} tint="dark" style={styles.iconBtn}>
                <Settings size={20} color="#fff" />
              </BlurView>
            </TouchableOpacity>
          </motion.View>

          <motion.View variants={controlVariants} style={styles.mapControls}>
            <TouchableOpacity onPress={handleAction} style={styles.controlItem}>
              <BlurView intensity={40} tint="dark" style={styles.controlInner}>
                <Layers size={22} color="#fff" />
              </BlurView>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAction} style={styles.controlItem}>
              <BlurView intensity={40} tint="dark" style={styles.controlInner}>
                <Maximize2 size={22} color="#fff" />
              </BlurView>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAction} style={styles.controlItem}>
              <BlurView intensity={50} tint="dark" style={[styles.controlInner, { borderColor: colors.primary }]}>
                <Locate size={22} color={colors.primary} />
              </BlurView>
            </TouchableOpacity>
          </motion.View>

          <motion.View 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring", damping: 15 }}
            style={[styles.pin, { top: '42%', left: '46%' }]}
          >
            <View style={styles.pinWrapper}>
              <motion.View 
                animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                style={[styles.pinPulse, { borderColor: colors.primary }]} 
              />
              <View style={[styles.pinCircle, { backgroundColor: colors.primary }]}>
                <Target size={22} color="#000" />
              </View>
            </View>
            <BlurView intensity={20} tint="dark" style={styles.pinLabel}>
              <Text style={styles.pinText}>Eneo Kuu (Mahindi)</Text>
            </BlurView>
          </motion.View>

          <motion.View 
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, type: "spring", damping: 20, stiffness: 100 }}
            style={styles.bottomSheet}
          >
            <BlurView intensity={90} tint={isDark ? "dark" : "light"} style={[styles.sheetContent, { borderColor: colors.border }]}>
              <View style={[styles.sheetHandle, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }]} />
              
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={[styles.sheetTitle, { color: colors.text }]}>Kitalu A (Alpha)</Text>
                  <View style={styles.metaRow}>
                    <Navigation size={12} color={colors.primary} style={{ marginRight: 6 }} />
                    <Text style={[styles.metaText, { color: colors.textMute }]}>Eneo 7G • Hekta 2.4 • Hali Nzuri</Text>
                  </View>
                </View>
                <TouchableOpacity style={[styles.addPlotBtn, { backgroundColor: colors.primary }]} onPress={handleAction}>
                  <Plus size={20} color="#000" />
                  <Text style={styles.addPlotText}>Ongeza Kitalu</Text>
                </TouchableOpacity>
              </View>
              
              <View style={[styles.statsGrid, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.textMute }]}>UNYEVU WA UDONGO</Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>18.4%</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.textMute }]}>AFYA (NDVI)</Text>
                  <Text style={[styles.statValue, { color: colors.text }]}>0.82</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.textMute }]}>MAVUNO YATARAJIWAYO</Text>
                  <Text style={[styles.statValue, { color: colors.primary }]}>4.2T</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.fullAnalysisBtn} onPress={handleAction}>
                <Zap size={16} color={colors.primary} style={{ marginRight: 10 }} />
                <Text style={[styles.fullAnalysisText, { color: colors.primary }]}>Anzisha Uchambuzi Kamili wa AI</Text>
              </TouchableOpacity>
            </BlurView>
          </motion.View>
        </motion.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  mapImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', opacity: 0.8 },
  overlay: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12 },
  iconBtn: { width: 52, height: 52, borderRadius: 20, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  headerCenter: { flex: 1, alignItems: 'center', marginHorizontal: 12 },
  spatialBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginBottom: 8 },
  spatialText: { fontSize: 9, fontFamily: 'Inter_900Black', marginLeft: 6, letterSpacing: 1 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 48, borderRadius: 18, paddingHorizontal: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  searchPlaceholder: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Inter_500Medium' },
  mapControls: { position: 'absolute', right: 20, top: 140, gap: 12 },
  controlItem: { width: 56, height: 56, borderRadius: 20, overflow: 'hidden' },
  controlInner: { flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  pin: { position: 'absolute', alignItems: 'center' },
  pinWrapper: { width: 60, height: 60, justifyContent: 'center', alignItems: 'center' },
  pinPulse: { position: 'absolute', width: 60, height: 60, borderRadius: 30, borderWidth: 2 },
  pinCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff', shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 },
  pinLabel: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 8, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  pinText: { color: '#fff', fontSize: 11, fontFamily: 'Inter_900Black', letterSpacing: 0.5 },
  bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  sheetContent: { borderTopLeftRadius: 44, borderTopRightRadius: 44, padding: 30, paddingBottom: Platform.OS === 'ios' ? 44 : 30, borderWidth: 1 },
  sheetHandle: { width: 44, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: 28 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  sheetTitle: { fontSize: 24, fontFamily: 'Inter_900Black', letterSpacing: -0.8, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 13, fontFamily: 'Inter_500Medium', opacity: 0.6 },
  addPlotBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, borderRadius: 18 },
  addPlotText: { color: '#000', fontFamily: 'Inter_900Black', marginLeft: 10, fontSize: 14 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', padding: 24, borderRadius: 28, marginBottom: 28 },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 9, fontFamily: 'Inter_900Black', marginBottom: 8, letterSpacing: 1 },
  statValue: { fontSize: 20, fontFamily: 'Inter_900Black' },
  divider: { width: 1, height: '60%', alignSelf: 'center', opacity: 0.2 },
  fullAnalysisBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(62, 207, 142, 0.2)' },
  fullAnalysisText: { fontSize: 15, fontFamily: 'Inter_800ExtraBold' },
});
