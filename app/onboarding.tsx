import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions, 
  SafeAreaView, 
  Platform,
  StatusBar,
  ImageBackground
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Sprout, 
  CloudRain, 
  BrainCircuit, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Globe,
  Sparkles,
  Fingerprint
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';
import { motion, AnimatePresence } from "motion/react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Kilimo Bora,\nMaisha Bora',
    subtitle: 'Swahili AI Expert',
    description: 'The first AI agricultural assistant designed specifically for African farmers. Real expertise, in your language.',
    icon: <Sprout size={80} color="#3ecf8e" />,
    gradient: ['#064e3b', '#022c22'] as [string, string],
    accent: '#3ecf8e',
    tag: 'Smart Farming',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2940&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Precise Local\nIntelligence',
    subtitle: 'Climate Resilient',
    description: 'Get hyper-local weather alerts and crop recommendations tailored to your specific region and soil conditions.',
    icon: <CloudRain size={80} color="#3b82f6" />,
    gradient: ['#1e3a8a', '#1e1b4b'] as [string, string],
    accent: '#3b82f6',
    tag: 'Weather Data',
    image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=2787&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Agro ID &\nSankofa AI',
    subtitle: 'Always Available',
    description: 'Establish your digital identity and connect with our voice-first Swahili AI to diagnose crops and get instant support.',
    icon: <BrainCircuit size={80} color="#8b5cf6" />,
    gradient: ['#4c1d95', '#2e1065'] as [string, string],
    accent: '#8b5cf6',
    tag: 'Digital Identity',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2940&auto=format&fit=crop'
  },
];

const MotionView = motion(View);
const MotionText = motion(Text);

export default function OnboardingScreen() {
  const { colors, isDark } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    // Simulate cinematic loading sequence
    setTimeout(() => setIsReady(true), 500);
  }, []);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/(tabs)');
  };

  const slide = SLIDES[currentSlide];

  if (!isReady) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <motion.View
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Sprout size={48} color="#3ecf8e" />
        </motion.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Dynamic Background System with Cinematic Parallax */}
      <AnimatePresence mode="wait">
        <motion.View
          key={`bg-${currentSlide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={StyleSheet.absoluteFill}
        >
          <motion.View
            animate={{ scale: [1.1, 1] }}
            transition={{ duration: 8, ease: "easeOut" }}
            style={StyleSheet.absoluteFill}
          >
            <ImageBackground 
              source={{ uri: slide.image }} 
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            >
              {/* Complex Vignette & Gradient Overlays */}
              <LinearGradient
                colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.98)']}
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                colors={[slide.gradient[0] + '90', slide.gradient[1] + '40', 'transparent']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </ImageBackground>
          </motion.View>
        </motion.View>
      </AnimatePresence>

      {/* Liquid Glass Neural Orbs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <motion.View
          animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={[styles.glowOrb, { backgroundColor: slide.accent + '30', top: '-10%', right: '-20%' }]}
        />
        <motion.View
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={[styles.glowOrb, { backgroundColor: slide.accent + '20', bottom: '10%', left: '-30%' }]}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Nav Header */}
        <View style={styles.header}>
          <View style={styles.pagination}>
            {SLIDES.map((_, i) => (
              <motion.View 
                key={i} 
                animate={{
                  width: i === currentSlide ? 40 : 10,
                  opacity: i === currentSlide ? 1 : 0.3,
                  backgroundColor: i === currentSlide ? slide.accent : '#ffffff'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={styles.dot} 
              />
            ))}
          </View>
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <BlurView intensity={20} tint="dark" style={styles.skipBlur}>
              <Text style={styles.skipText}>Skip</Text>
            </BlurView>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <AnimatePresence mode="wait">
            <motion.View
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              style={styles.slideContent}
            >
              {/* Central Neural Icon */}
              <View style={styles.iconWrapper}>
                <motion.View
                  animate={{ rotateY: [0, 360], rotateZ: [0, 180, 360] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  style={[styles.iconOrbit, { borderColor: slide.accent + '40' }]}
                >
                  <View style={[styles.orbitDot, { backgroundColor: slide.accent }]} />
                </motion.View>
                
                <BlurView intensity={40} tint="dark" style={[styles.iconContainer, { borderColor: slide.accent + '60' }]}>
                  <motion.View
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {slide.icon}
                  </motion.View>
                  <LinearGradient colors={['rgba(255,255,255,0.3)', 'transparent']} style={styles.iconGloss} />
                </BlurView>
                
                <motion.View 
                  animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={[styles.iconShadow, { backgroundColor: slide.accent, filter: 'blur(30px)' }]} 
                />
              </View>

              {/* Typography Section */}
              <View style={styles.textContainer}>
                <motion.View
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  style={[styles.tag, { borderColor: slide.accent + '50', backgroundColor: slide.accent + '20' }]}
                >
                  <Sparkles size={14} color={slide.accent} />
                  <Text style={[styles.tagText, { color: slide.accent }]}>{slide.tag}</Text>
                </motion.View>
                
                <MotionText 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={styles.title}
                >
                  {slide.title}
                </MotionText>
                
                <MotionText 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={styles.description}
                >
                  {slide.description}
                </MotionText>
              </View>
            </motion.View>
          </AnimatePresence>
        </View>

        {/* Footer Interaction Zone */}
        <View style={styles.footer}>
          <motion.View whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.9}>
              <LinearGradient
                colors={[slide.accent, slide.gradient[0]]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.nextButtonText}>
                  {currentSlide === SLIDES.length - 1 ? 'Activate Agro ID' : 'Continue'}
                </Text>
                <motion.View animate={{ x: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight color="#ffffff" size={24} strokeWidth={3} />
                </motion.View>
              </LinearGradient>
            </TouchableOpacity>
          </motion.View>
          
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Fingerprint size={14} color="#ffffff" opacity={0.6} />
              <Text style={styles.trustText}>SECURE AI</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.trustItem}>
              <Zap size={14} color="#ffffff" opacity={0.6} />
              <Text style={styles.trustText}>REAL-TIME</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.trustItem}>
              <Globe size={14} color="#ffffff" opacity={0.6} />
              <Text style={styles.trustText}>LOCALIZED</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  glowOrb: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    filter: 'blur(90px)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    zIndex: 10,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  skipBtn: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  skipBlur: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconWrapper: {
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
    zIndex: 10,
  },
  iconGloss: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  iconOrbit: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbitDot: {
    position: 'absolute',
    top: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  iconShadow: {
    position: 'absolute',
    width: 150,
    height: 50,
    borderRadius: 75,
    bottom: -15,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 24,
    gap: 8,
  },
  tagText: {
    fontSize: 13,
    fontFamily: 'Inter_900Black',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontSize: 52,
    fontFamily: 'Inter_900Black',
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 24,
    letterSpacing: -2,
    lineHeight: 56,
  },
  description: {
    fontSize: 18,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 28,
    paddingHorizontal: 15,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 32,
  },
  nextButton: {
    height: 72,
    borderRadius: 24,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Inter_900Black',
    marginRight: 16,
    letterSpacing: -0.5,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 16,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustText: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Inter_900Black',
    opacity: 0.5,
    letterSpacing: 1.5,
  },
  divider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  }
});
