import React, { useState } from 'react';
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
    title: 'Sankofa AI\nAdvisory',
    subtitle: 'Always Available',
    description: 'Connect with our Swahili-speaking AI agent to diagnose crop diseases and get expert farming advice instantly.',
    icon: <BrainCircuit size={80} color="#8b5cf6" />,
    gradient: ['#4c1d95', '#2e1065'] as [string, string],
    accent: '#8b5cf6',
    tag: 'AI Diagnostic',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2940&auto=format&fit=crop'
  },
];

// Motion Components
const MotionView = motion(View);
const MotionText = motion(Text);

export default function OnboardingScreen() {
  const { colors, isDark } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Dynamic Background System */}
      <AnimatePresence mode="wait">
        <MotionView
          key={`bg-${currentSlide}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={StyleSheet.absoluteFill}
        >
          <ImageBackground 
            source={{ uri: slide.image }} 
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.95)']}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={[slide.gradient[0] + '80', 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </ImageBackground>
        </MotionView>
      </AnimatePresence>

      {/* Neural Hub Overlays */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <MotionView
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={[styles.glowOrb, { backgroundColor: slide.accent + '20', top: '10%', right: '-10%' }]}
        />
        <MotionView
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={[styles.glowOrb, { backgroundColor: slide.accent + '15', bottom: '15%', left: '-20%' }]}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Nav Header */}
        <View style={styles.header}>
          <View style={styles.pagination}>
            {SLIDES.map((_, i) => (
              <MotionView 
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
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <AnimatePresence mode="wait">
            <MotionView
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              style={styles.slideContent}
            >
              {/* Central Neural Icon */}
              <View style={styles.iconWrapper}>
                <MotionView
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  style={styles.iconOrbit}
                >
                  <View style={[styles.orbitDot, { backgroundColor: slide.accent }]} />
                </MotionView>
                
                <BlurView intensity={25} tint="dark" style={styles.iconContainer}>
                  <MotionView
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {slide.icon}
                  </MotionView>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.2)', 'transparent']}
                    style={styles.iconGloss}
                  />
                </BlurView>
                
                <MotionView 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={[styles.iconShadow, { shadowColor: slide.accent }]} 
                />
              </View>

              {/* Typography Section */}
              <View style={styles.textContainer}>
                <MotionView
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  style={[styles.tag, { borderColor: slide.accent + '40', backgroundColor: slide.accent + '15' }]}
                >
                  <Sparkles size={12} color={slide.accent} />
                  <Text style={[styles.tagText, { color: slide.accent }]}>{slide.tag}</Text>
                </MotionView>
                
                <MotionText 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={styles.title}
                >
                  {slide.title}
                </MotionText>
                
                <MotionText 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={styles.description}
                >
                  {slide.description}
                </MotionText>
              </View>
            </MotionView>
          </AnimatePresence>
        </View>

        {/* Footer Interaction Zone */}
        <View style={styles.footer}>
          <MotionView
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={styles.buttonShadow}
          >
            <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.9}>
              <LinearGradient
                colors={['#ffffff', '#e2e8f0']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.nextButtonText}>
                  {currentSlide === SLIDES.length - 1 ? 'Enter Neural Hub' : 'Continue'}
                </Text>
                <MotionView
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight color="#000" size={24} strokeWidth={3} />
                </MotionView>
              </LinearGradient>
            </TouchableOpacity>
          </MotionView>
          
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Fingerprint size={14} color="#ffffff" opacity={0.5} />
              <Text style={styles.trustText}>SECURE AI</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.trustItem}>
              <Zap size={14} color="#ffffff" opacity={0.5} />
              <Text style={styles.trustText}>REAL-TIME</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.trustItem}>
              <Globe size={14} color="#ffffff" opacity={0.5} />
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
    width: 400,
    height: 400,
    borderRadius: 200,
    filter: 'blur(80px)',
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    opacity: 0.8,
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
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    zIndex: 10,
  },
  iconGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  iconOrbit: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbitDot: {
    position: 'absolute',
    top: -5,
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  iconShadow: {
    position: 'absolute',
    width: 140,
    height: 40,
    borderRadius: 70,
    bottom: -10,
    opacity: 0.5,
    filter: 'blur(30px)',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
    gap: 8,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter_900Black',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Inter_900Black',
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 20,
    letterSpacing: -2.5,
    lineHeight: 52,
  },
  description: {
    fontSize: 18,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 28,
    paddingHorizontal: 10,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 32,
  },
  buttonShadow: {
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  nextButton: {
    height: 80,
    borderRadius: 28,
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
    color: '#000000',
    fontSize: 20,
    fontFamily: 'Inter_900Black',
    marginRight: 16,
    letterSpacing: -0.5,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    gap: 12,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    opacity: 0.4,
    letterSpacing: 1,
  },
  divider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  }
});
