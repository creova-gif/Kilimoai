import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions, 
  Image, 
  StatusBar, 
  Platform 
} from 'react-native';
import { 
  X, 
  Zap, 
  Image as ImageIcon, 
  RotateCw, 
  ScanLine,
  Info,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Maximize2,
  Camera
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';
import { motion, AnimatePresence } from "motion/react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ScanScreen() {
  const router = useRouter();
  const { colors, spacing, radius, isDark } = useTheme();
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);

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

  const handleScan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsScanning(true);
    
    // Mock scanning process
    setTimeout(() => {
      setIsScanning(false);
      setShowResult(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 3500);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowResult(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Premium Camera View Mock */}
      <motion.View 
        animate={{ scale: isScanning ? 1.1 : 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 80 }}
        style={styles.cameraView}
      >
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1594488651083-023b8a4a3b1e?q=80&w=2940&auto=format&fit=crop' }} 
          style={styles.mockCamera}
        />
        
        {/* Advanced Scanning Line Overlay */}
        <AnimatePresence>
          {isScanning && (
            <motion.View 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={StyleSheet.absoluteFill}
            >
              <motion.View 
                animate={{ 
                  y: [SCREEN_HEIGHT * 0.2, SCREEN_HEIGHT * 0.7, SCREEN_HEIGHT * 0.2] 
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={styles.scanOverlay}
              >
                <LinearGradient
                  colors={['transparent', colors.primary + '60', colors.primary, colors.primary + '60', 'transparent']}
                  style={styles.scanLine}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                />
                <motion.View 
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={[styles.scanGlow, { backgroundColor: colors.primary + '20' }]} 
                />
              </motion.View>
            </motion.View>
          )}
        </AnimatePresence>
      </motion.View>

      <SafeAreaView style={styles.safeArea}>
        {/* Floating Header */}
        <motion.View 
          animate={{ opacity: isScanning ? 0 : 1, y: isScanning ? -20 : 0 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <BlurView intensity={30} tint="dark" style={styles.iconButton}>
              <X size={24} color="#ffffff" />
            </BlurView>
          </TouchableOpacity>
          
          <View style={styles.headerTitleBox}>
            <BlurView intensity={25} tint="dark" style={styles.badge}>
              <Sparkles size={12} color={colors.primary} />
              <Text style={styles.badgeText}>NEURAL SCAN V2.4</Text>
            </BlurView>
          </View>

          <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} activeOpacity={0.7}>
            <BlurView intensity={30} tint="dark" style={styles.iconButton}>
              <Zap size={22} color="#ffffff" />
            </BlurView>
          </TouchableOpacity>
        </motion.View>

        <View style={styles.content}>
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.View 
                key="scanner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.scannerInterface}
              >
                {/* Aiming Reticle */}
                <View style={styles.reticleContainer}>
                  {[styles.tl, styles.tr, styles.bl, styles.br].map((posStyle, idx) => (
                    <motion.View 
                      key={idx}
                      animate={{ 
                        scale: isScanning ? 1.05 : 1,
                        opacity: isScanning ? [0.4, 1, 0.4] : 1
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        delay: idx * 0.1
                      }}
                      style={[styles.corner, posStyle]} 
                    />
                  ))}
                  
                  {/* Dynamic AI Markers */}
                  <AnimatePresence>
                    {isScanning && (
                      <motion.View 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        style={styles.aiMarkers}
                      >
                        <motion.View 
                          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          style={styles.markerPulse} 
                        />
                        <View style={styles.markerTextContainer}>
                          <Text style={styles.markerText}>ANALYZING BIO-MARKERS</Text>
                          <motion.View 
                            animate={{ height: [0, 40, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={styles.markerLine} 
                          />
                        </View>
                      </motion.View>
                    )}
                  </AnimatePresence>
                </View>

                <motion.View 
                  animate={{ y: isScanning ? 20 : 0 }}
                  style={styles.instructions}
                >
                  <Text style={styles.instructionLarge}>
                    {isScanning ? 'Decoding Molecular Structure' : 'Target Crop Biomass'}
                  </Text>
                  <Text style={styles.instructionSmall}>
                    {isScanning ? 'Kilimo AI is verifying plant health markers' : 'Hold position for hyperspectral analysis'}
                  </Text>
                </motion.View>
              </motion.View>
            ) : (
              <motion.View 
                key="result"
                initial={{ opacity: 0, y: 100, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                style={styles.resultWrapper}
              >
                <AnimatePresence>
                  {showResult && (
                    <View style={StyleSheet.absoluteFill}>
                      <NeuralOrb color={colors.primary} size={350} x={-100} y={100} delay={0} />
                      <NeuralOrb color="#3b82f6" size={300} x={SCREEN_WIDTH - 150} y={SCREEN_HEIGHT - 400} delay={2000} />
                    </View>
                  )}
                </AnimatePresence>

                <BlurView intensity={isDark ? 30 : 90} tint={isDark ? "dark" : "light"} style={[styles.resultCard, { borderColor: colors.border }]}>
                  <LinearGradient
                    colors={[colors.primary + '15', 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                  
                  <View style={styles.resultHeader}>
                    <motion.View 
                      initial={{ rotate: -15, scale: 0.5 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      style={[styles.resultIcon, { backgroundColor: colors.primary }]}
                    >
                      <BrainCircuit size={28} color="#000" />
                    </motion.View>
                    <View style={styles.resultMeta}>
                      <Text style={[styles.resultName, { color: colors.text }]}>Maize Streak Virus</Text>
                      <motion.View 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        style={styles.confBadge}
                      >
                        <Text style={styles.confText}>98.4% Confidence</Text>
                      </motion.View>
                    </View>
                  </View>

                  <motion.View 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={[styles.detailCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
                  >
                    <View style={styles.detailTitleRow}>
                      <AlertCircle size={16} color="#ef4444" />
                      <Text style={[styles.detailTitle, { color: colors.text }]}>Viral Pathogen Detected</Text>
                    </View>
                    <Text style={[styles.detailBody, { color: colors.textMute }]}>
                      Characteristic yellow streaks along leaf veins. Rapid intervention is recommended to protect the fleet.
                    </Text>
                  </motion.View>

                  <motion.View
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <TouchableOpacity 
                      style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                      activeOpacity={0.8}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        router.push('/sankofa');
                      }}
                    >
                      <Text style={styles.primaryBtnText}>Initialize Treatment Flow</Text>
                      <ArrowRight size={18} color="#000" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                      <RotateCw size={16} color={colors.textMute} />
                      <Text style={[styles.resetBtnText, { color: colors.textMute }]}>Retake Sample</Text>
                    </TouchableOpacity>
                  </motion.View>
                </BlurView>
              </motion.View>
            )}
          </AnimatePresence>
        </View>

        {/* Shutter Controls */}
        <AnimatePresence>
          {!showResult && (
            <motion.View 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              style={styles.footer}
            >
              <TouchableOpacity style={styles.auxBtn}>
                <BlurView intensity={40} tint="dark" style={styles.auxInner}>
                  <ImageIcon size={22} color="#ffffff" />
                </BlurView>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.shutterRing, { borderColor: colors.primary }]}
                onPress={handleScan}
                disabled={isScanning}
                activeOpacity={0.8}
              >
                <motion.View 
                  animate={{ scale: isScanning ? 0.9 : 1 }}
                  style={[styles.shutterCore, { backgroundColor: isScanning ? colors.primary : '#ffffff' }]}
                >
                  {isScanning ? (
                     <motion.View 
                       animate={{ rotate: 360 }}
                       transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                       style={styles.shutterLoading} 
                     />
                  ) : (
                    <Camera size={30} color="#000" />
                  )}
                </motion.View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.auxBtn}>
                <BlurView intensity={40} tint="dark" style={styles.auxInner}>
                  <Info size={22} color="#ffffff" />
                </BlurView>
              </TouchableOpacity>
            </motion.View>
          )}
        </AnimatePresence>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraView: {
    ...StyleSheet.absoluteFillObject,
  },
  mockCamera: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  bgOrb: {
    position: 'absolute',
    filter: Platform.OS === 'web' ? 'blur(90px)' : undefined,
  },
  scanOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLine: {
    width: '100%',
    height: 4,
    shadowColor: "#3ecf8e",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
  },
  scanGlow: {
    position: 'absolute',
    width: '100%',
    height: 60,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headerTitleBox: {
    flex: 1,
    alignItems: 'center',
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    gap: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerInterface: {
    alignItems: 'center',
  },
  reticleContainer: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderColor: '#3ecf8e',
  },
  tl: {
    top: 0,
    left: 0,
    borderTopWidth: 6,
    borderLeftWidth: 6,
    borderTopLeftRadius: 36,
  },
  tr: {
    top: 0,
    right: 0,
    borderTopWidth: 6,
    borderRightWidth: 6,
    borderTopRightRadius: 36,
  },
  bl: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 6,
    borderLeftWidth: 6,
    borderBottomLeftRadius: 36,
  },
  br: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 6,
    borderRightWidth: 6,
    borderBottomRightRadius: 36,
  },
  aiMarkers: {
    alignItems: 'center',
  },
  markerPulse: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3ecf8e',
    marginBottom: 10,
  },
  markerTextContainer: {
    alignItems: 'center',
  },
  markerText: {
    color: '#3ecf8e',
    fontSize: 9,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.5,
  },
  markerLine: {
    width: 1,
    backgroundColor: '#3ecf8e',
    marginTop: 8,
  },
  instructions: {
    marginTop: 60,
    alignItems: 'center',
  },
  instructionLarge: {
    color: '#ffffff',
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  instructionSmall: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    maxWidth: 240,
  },
  resultWrapper: {
    width: SCREEN_WIDTH * 0.9,
  },
  resultCard: {
    borderRadius: 40,
    padding: 30,
    overflow: 'hidden',
    borderWidth: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  resultIcon: {
    width: 68,
    height: 68,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#3ecf8e",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  resultMeta: {
    flex: 1,
    marginLeft: 20,
  },
  resultName: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  confBadge: {
    marginTop: 6,
  },
  confText: {
    color: '#3ecf8e',
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
  },
  detailCard: {
    padding: 24,
    borderRadius: 28,
    marginBottom: 32,
  },
  detailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 16,
    fontFamily: 'Inter_900Black',
    marginLeft: 10,
  },
  detailBody: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    lineHeight: 22,
    opacity: 0.8,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 24,
    marginBottom: 16,
  },
  primaryBtnText: {
    color: '#000',
    fontSize: 17,
    fontFamily: 'Inter_900Black',
    marginRight: 10,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  resetBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  auxBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
  },
  auxInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  shutterRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  shutterCore: {
    width: 82,
    height: 82,
    borderRadius: 41,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterLoading: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#000',
    borderTopColor: 'transparent',
  },
});
