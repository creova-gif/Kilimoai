import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert
} from 'react-native';
import {
  Award,
  CheckCircle,
  XCircle,
  ArrowRight,
  Lock,
  BookOpen,
  HelpCircle,
  Sparkles,
  Camera,
  Brain,
  ShieldAlert,
  ArrowLeft,
  ChevronRight,
  Bot
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInRight, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { useKilimoStore } from '../store/useKilimoStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Module Data ─────────────────────────────────────────────────────────────
interface Module {
  id: string;
  icon: React.ReactNode;
  titleSw: string;
  titleEn: string;
  subtitleSw: string;
  subtitleEn: string;
  lessonSw: string;
  lessonEn: string;
  questionSw: string;
  questionEn: string;
  optionsSw: string[];
  optionsEn: string[];
  correctAnswerIdx: number;
}

const MODULES_DATA = (colors: any): Module[] => [
  {
    id: 'intro',
    icon: <Bot size={24} color={colors.primary} />,
    titleSw: '1. Utangulizi wa Sankofa AI',
    titleEn: '1. Introduction to Sankofa AI',
    subtitleSw: 'Jinsi ya kujitambulisha vizuri',
    subtitleEn: 'How to introduce yourself properly',
    lessonSw: 'Sankofa AI ni mshauri wako wa kilimo lakini anahitaji muktadha ili kukusaidia vizuri zaidi. Unapoanza mazungumzo, jitambulishe kwa jina, taja eneo lako (mkoa/wilaya), mazao unayokuza, na tatizo lako. Hii inasaidia AI kutoa ushauri unaoendana na hali ya hewa na udongo wa eneo lako.',
    lessonEn: 'Sankofa AI is your farming advisor, but it needs context to help you best. When starting a chat, introduce yourself by name, state your location (region/district), the crops you grow, and your issue. This helps the AI provide advice tailored to your local weather and soil conditions.',
    questionSw: 'Ni ipi njia bora ya kuanzisha mazungumzo na Sankofa AI?',
    questionEn: 'What is the best way to start a conversation with Sankofa AI?',
    optionsSw: [
      'A) "Nina shida na mmea wangu wa mahindi."',
      'B) "Habari! Mimi ni Juma kutoka Mbeya, nina shamba la ekari 2 la mahindi. Majani yameanza kugeuka manjano."',
      'C) "Nisaidie haraka mazao yangu yanakufa!"'
    ],
    optionsEn: [
      'A) "I have a problem with my maize plant."',
      'B) "Hello! I am Juma from Mbeya, I have a 2-acre maize farm. The leaves have started turning yellow."',
      'C) "Help me quickly my crops are dying!"'
    ],
    correctAnswerIdx: 1
  },
  {
    id: 'prompting',
    icon: <Brain size={24} color="#3b82f6" />,
    titleSw: '2. Kupiga Maswali Sahihi',
    titleEn: '2. Effective Prompting',
    subtitleSw: 'Kutoa maelezo maalum na ya kina',
    subtitleEn: 'Providing specific and detailed prompts',
    lessonSw: 'Ili kupata majibu sahihi zaidi kutoka kwa Sankofa AI, epuka maswali ya jumla. Toa maelezo ya aina ya mbegu uliyotumia, umri wa mmea, hali ya unyevu wa udongo, na mabadiliko ya hali ya hewa ya hivi karibuni. AI itakupa mpango kamili wa hatua kwa hatua kulingana na maelezo hayo.',
    lessonEn: 'To get the most accurate answers from Sankofa AI, avoid general questions. Provide details about the seed variety used, plant age, soil moisture conditions, and recent weather changes. The AI will give you a complete step-by-step plan based on that details.',
    questionSw: 'Sankofa AI itakupa ushauri bora zaidi ukiipatia maelezo gani?',
    questionEn: 'Sankofa AI will give you the best advice if you provide which details?',
    optionsSw: [
      'A) Historia ya shamba, aina ya mbegu, na umri wa mmea',
      'B) Bei ya mbolea pekee',
      'C) Kuuliza "kwa nini kilimo ni kigumu"'
    ],
    optionsEn: [
      'A) Farm history, seed variety, and plant age',
      'B) Fertilizer price only',
      'C) Asking "why farming is hard"'
    ],
    correctAnswerIdx: 0
  },
  {
    id: 'photos',
    icon: <Camera size={24} color="#eab308" />,
    titleSw: '3. Piga Picha za Magonjwa kwa Usahihi',
    titleEn: '3. Capturing Crop Diseases',
    subtitleSw: 'Kanuni za kupata picha iliyo wazi',
    subtitleEn: 'Rules for getting a clear photo',
    lessonSw: 'Sankofa AI ina uwezo wa kutambua magonjwa kwa kuona picha, lakini picha zikiwa na giza au ukungu, itashindwa. Piga picha kwenye mwanga wa jua (mchana), umbali wa sm 15–30 kutoka kwa mmea, ukilenga sehemu yenye tatizo (majani, shina au tunda). Hakikisha picha haijatikisika.',
    lessonEn: 'Sankofa AI can diagnose diseases from photos, but if photos are dark or blurry, it will fail. Take photos in bright daylight, from a distance of 15–30 cm from the plant, focusing on the affected part (leaves, stem, or fruit). Make sure the photo is stable and clear.',
    questionSw: 'Ipi ni kanuni sahihi ya kupiga picha kwa ajili ya utambuzi wa AI?',
    questionEn: 'What is the correct rule for taking a photo for AI diagnosis?',
    optionsSw: [
      'A) Piga picha ya shamba zima kutoka mbali wakati wa jioni',
      'B) Piga picha usiku ukitumia flash ya kamera',
      'C) Piga picha karibu (sm 15-30), mchana, iliyolenga sehemu iliyoathirika na isiyotikisika'
    ],
    optionsEn: [
      'A) Take a photo of the whole farm from a distance in the evening',
      'B) Take a photo at night using camera flash',
      'C) Take a close-up (15-30cm), in daylight, focused on the affected part, and stable'
    ],
    correctAnswerIdx: 2
  },
  {
    id: 'confidence',
    icon: <HelpCircle size={24} color="#8b5cf6" />,
    titleSw: '4. Kuelewa Viwango vya Uhakika',
    titleEn: '4. Understanding Confidence Scores',
    subtitleSw: 'Kutambua lini AI haina uhakika',
    subtitleEn: 'Recognizing when the AI is unsure',
    lessonSw: 'Kila utambuzi wa picha unaambatana na kiwango cha uhakika (Confidence Score). Kiwango kikiwa "High", AI ina uhakika mkubwa. Kikiwa "Low", maana yake picha haikuwa wazi au ugonjwa haufahamiki vizuri. Ikiwa kiwango ni "Low", usichukue hatua za haraka — piga picha nyingine bora zaidi au tafuta msaada wa mtaalamu.',
    lessonEn: 'Every image diagnosis comes with a confidence score. "High" means the AI is very sure. "Low" means the photo was unclear or the disease is not well recognized. If the score is "Low", do not take immediate action — take another better photo or seek expert advice.',
    questionSw: 'Nini unapaswa kufanya ikiwa Sankofa AI inakupa kiwango cha chini cha uhakika (Low Confidence)?',
    questionEn: 'What should you do if Sankofa AI gives you a low confidence score?',
    optionsSw: [
      'A) Weka dawa ya zao bila kujali',
      'B) Piga picha nyingine bora zaidi yenye mwanga mzuri au wasiliana na Afisa Ugani',
      'C) Futa programu na uache kulima'
    ],
    optionsEn: [
      'A) Apply pesticides to the crop regardless',
      'B) Take a better photo with good light or consult an Extension Officer',
      'C) Delete the app and stop farming'
    ],
    correctAnswerIdx: 1
  },
  {
    id: 'escalation',
    icon: <ShieldAlert size={24} color="#ef4444" />,
    titleSw: '5. Kushauriana na Wataalamu',
    titleEn: '5. Action & Expert Escalation',
    subtitleSw: 'Mipaka ya AI na usalama wa kemikali',
    subtitleEn: 'AI boundaries and chemical safety',
    lessonSw: 'Sankofa AI haitoi dozi maalum za kemikali kwa sababu dozi isiyo sahihi inaweza kuharibu mazao yako au kuumiza afya yako. AI itakuelekeza aina ya dawa lakini itasisitiza kupata usaidizi wa Afisa Ugani. Ikiwa tatizo ni kubwa sana, chagua kitufe cha "Wasiliana na Wataalamu" ili kupata msaada wa binadamu.',
    lessonEn: 'Sankofa AI does not provide specific chemical dosages because incorrect dosage can destroy your crops or harm your health. The AI will guide you on the type of pesticide but will emphasize getting help from an Extension Officer. If the issue is severe, tap "Contact Expert" for human help.',
    questionSw: 'Kwa nini Sankofa AI haitoi dozi maalum za viuatilifu vya kemikali?',
    questionEn: 'Why does Sankofa AI not give specific chemical pesticide dosages?',
    optionsSw: [
      'A) Kwa sababu dozi isiyo sahihi inaweza kuua mazao au kudhuru afya, na inahitaji uthibitisho wa Afisa Ugani',
      'B) AI haina ufahamu wa dawa za kilimo',
      'C) Kwa sababu kemikali ni za bure'
    ],
    optionsEn: [
      'A) Because incorrect dosage can kill crops or harm health, and needs confirmation from an Extension Officer',
      'B) The AI has no knowledge of agricultural chemicals',
      'C) Because chemicals are free'
    ],
    correctAnswerIdx: 0
  }
];

export default function AITrainingHubScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const language = useKilimoStore((s) => s.language);
  const completedModules = useKilimoStore((s) => s.completedModules);
  const completeModuleAction = useKilimoStore((s) => s.completeModule);
  const aiCertified = useKilimoStore((s) => s.aiCertified);

  const modules = MODULES_DATA(colors);
  
  // Find current active module index
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [quizStatus, setQuizStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [showCertificate, setShowCertificate] = useState(false);

  const shakeOffset = useSharedValue(0);

  // Initialize active index based on completed modules
  useEffect(() => {
    let nextIndex = 0;
    for (let i = 0; i < modules.length; i++) {
      if (completedModules.includes(modules[i].id)) {
        nextIndex = i + 1;
      } else {
        nextIndex = i;
        break;
      }
    }
    // Cap at index 4 (last module) if certified, unless showing completion
    if (nextIndex >= modules.length) {
      setActiveIdx(modules.length - 1);
      setShowCertificate(true);
    } else {
      setActiveIdx(nextIndex);
    }
  }, [completedModules]);

  const activeModule = modules[activeIdx];

  const handleSelectOption = (idx: number) => {
    if (quizStatus === 'success') return;
    setSelectedAns(idx);
    setQuizStatus('idle');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleVerifyAnswer = () => {
    if (selectedAns === null || !activeModule) return;

    if (selectedAns === activeModule.correctAnswerIdx) {
      setQuizStatus('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Save progress to state
      completeModuleAction(activeModule.id);
      
      // Check if this was the last module
      if (activeIdx === modules.length - 1) {
        setTimeout(() => {
          setShowCertificate(true);
        }, 1200);
      }
    } else {
      setQuizStatus('fail');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      
      // Shake animation
      shakeOffset.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  };

  const handleNextModule = () => {
    if (activeIdx < modules.length - 1) {
      setSelectedAns(null);
      setQuizStatus('idle');
      setActiveIdx(activeIdx + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const shakeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeOffset.value }]
    };
  });

  const getProgressPercent = () => {
    return (completedModules.length / modules.length) * 100;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Background Gradient */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={[
            isDark ? colors.slate[950] : '#f1f5f9',
            isDark ? colors.slate[900] + 'ee' : colors.slate[100] + 'ee',
            'transparent'
          ]}
          style={styles.bgGradient}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)' }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {language === 'sw' ? 'Mafunzo ya Sankofa AI' : 'Sankofa AI Training Hub'}
          </Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {showCertificate ? (
            /* 🏆 CERTIFICATE OF COMPLETION SCREEN */
            <Animated.View entering={FadeIn.delay(200)} style={styles.certCard}>
              <BlurView intensity={isDark ? 40 : 80} tint={isDark ? "dark" : "light"} style={[styles.certBlur, { borderColor: colors.border }]}>
                <LinearGradient
                  colors={isDark ? ['rgba(26, 59, 20, 0.2)', 'rgba(30, 41, 59, 0.5)'] : ['rgba(26, 59, 20, 0.1)', 'rgba(255, 255, 255, 0.9)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                
                <View style={styles.certIconBg}>
                  <Award size={64} color="#eab308" />
                  <Sparkles size={24} color="#eab308" style={styles.sparkleIcon} />
                </View>

                <Text style={[styles.certHeading, { color: colors.text }]}>
                  {language === 'sw' ? 'Hongera Sana!' : 'Congratulations!'}
                </Text>
                
                <Text style={[styles.certSub, { color: colors.textMute }]}>
                  {language === 'sw' 
                    ? 'Umekamilisha moduli zote 5 za Mafunzo ya Sankofa AI na kuwa Mkulima aliyethibitishwa!'
                    : 'You have completed all 5 Sankofa AI Training modules and are now a Certified AI Farmer!'}
                </Text>

                <View style={styles.badgeShow}>
                  <Sparkles size={14} color="#3b82f6" />
                  <Text style={styles.badgeShowText}>Sankofa AI Certified</Text>
                </View>

                <View style={[styles.certDivider, { backgroundColor: colors.border }]} />

                <Text style={[styles.certFoot, { color: colors.textMute }]}>
                  {language === 'sw'
                    ? 'Kitambulisho chako cha Agro ID sasa kimepambwa na beji hii ya hadhi ya juu.'
                    : 'Your digital Agro ID card has been updated with this prestigious certification badge.'}
                </Text>

                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setShowCertificate(false);
                    setActiveIdx(0);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Review Modules"
                >
                  <Text style={styles.primaryBtnText}>
                    {language === 'sw' ? 'Pitia Mafunzo Tena' : 'Review Training'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.textBtn}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/(tabs)/profile');
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Go to Profile"
                >
                  <Text style={[styles.textBtnText, { color: colors.primary }]}>
                    {language === 'sw' ? 'Angalia Kitambulisho Chako' : 'View Your Agro ID Card'}
                  </Text>
                </TouchableOpacity>
              </BlurView>
            </Animated.View>
          ) : (
            /* 📝 ACTIVE MODULE SCREEN */
            <View>
              {/* Progress Tracker */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressLabel, { color: colors.textMute }]}>
                    {language === 'sw' ? `Hatua ya ${activeIdx + 1} kati ya 5` : `Module ${activeIdx + 1} of 5`}
                  </Text>
                  <Text style={[styles.progressVal, { color: colors.primary }]}>
                    {Math.round(getProgressPercent())}%
                  </Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                  <View style={[styles.progressBarFill, { width: `${getProgressPercent()}%`, backgroundColor: colors.primary }]} />
                </View>
              </View>

              {/* Modules Carousel Tabs */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsScroll}
              >
                {modules.map((m, index) => {
                  const isCompleted = completedModules.includes(m.id);
                  const isActive = index === activeIdx;
                  const isLocked = index > completedModules.length;

                  return (
                    <TouchableOpacity
                      key={m.id}
                      disabled={isLocked}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setActiveIdx(index);
                        setSelectedAns(null);
                        setQuizStatus('idle');
                      }}
                      style={[
                        styles.tabItem,
                        {
                          borderColor: isActive ? colors.primary : colors.border,
                          backgroundColor: isActive 
                            ? (isDark ? 'rgba(26,59,20,0.2)' : 'rgba(26,59,20,0.05)')
                            : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                          opacity: isLocked ? 0.4 : 1
                        }
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`Tab ${index + 1}`}
                      accessibilityState={{ selected: isActive, disabled: isLocked }}
                    >
                      {isLocked ? (
                        <Lock size={14} color={colors.textMute} />
                      ) : isCompleted ? (
                        <CheckCircle size={14} color="#10b981" />
                      ) : (
                        <View style={[styles.uncompletedDot, { backgroundColor: colors.textMute }]} />
                      )}
                      <Text style={[styles.tabText, { color: isActive ? colors.text : colors.textMute }]}>
                        {language === 'sw' ? `Mada ${index + 1}` : `Lesson ${index + 1}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Lesson Card */}
              {activeModule && (
                <Animated.View entering={SlideInRight} style={styles.cardContainer}>
                  <BlurView intensity={isDark ? 30 : 70} tint={isDark ? "dark" : "light"} style={[styles.moduleCard, { borderColor: colors.border }]}>
                    <LinearGradient
                      colors={isDark ? ['rgba(255,255,255,0.01)', 'rgba(30,41,59,0.3)'] : ['rgba(255,255,255,0.6)', 'rgba(248,250,252,0.9)']}
                      style={StyleSheet.absoluteFill}
                    />

                    {/* Lesson Section */}
                    <View style={styles.lessonHeader}>
                      <View style={[styles.moduleIconBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)' }]}>
                        {activeModule.icon}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.moduleTitle, { color: colors.text }]}>
                          {language === 'sw' ? activeModule.titleSw : activeModule.titleEn}
                        </Text>
                        <Text style={[styles.moduleSubtitle, { color: colors.textMute }]}>
                          {language === 'sw' ? activeModule.subtitleSw : activeModule.subtitleEn}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.lessonBody}>
                      <View style={styles.sectionHeaderRow}>
                        <BookOpen size={16} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                          {language === 'sw' ? 'SOMO / LESSON' : 'LESSON CONTENT'}
                        </Text>
                      </View>
                      <Text style={[styles.lessonText, { color: colors.text }]}>
                        {language === 'sw' ? activeModule.lessonSw : activeModule.lessonEn}
                      </Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Quiz Section */}
                    <Animated.View style={[styles.quizSection, shakeStyle]}>
                      <View style={styles.sectionHeaderRow}>
                        <HelpCircle size={16} color="#3b82f6" />
                        <Text style={[styles.sectionTitle, { color: '#3b82f6' }]}>
                          {language === 'sw' ? 'JARIBIO LA PAPI KWA PAPO / MINI QUIZ' : 'POP QUIZ'}
                        </Text>
                      </View>

                      <Text style={[styles.questionText, { color: colors.text }]}>
                        {language === 'sw' ? activeModule.questionSw : activeModule.questionEn}
                      </Text>

                      <View style={styles.optionsList}>
                        {(language === 'sw' ? activeModule.optionsSw : activeModule.optionsEn).map((option, idx) => {
                          const isSelected = selectedAns === idx;
                          let optBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
                          let optBorder = colors.border;
                          
                          if (isSelected) {
                            optBg = isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)';
                            optBorder = '#3b82f6';
                          }
                          if (quizStatus === 'success' && idx === activeModule.correctAnswerIdx) {
                            optBg = isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.05)';
                            optBorder = '#10b981';
                          } else if (quizStatus === 'fail' && isSelected) {
                            optBg = isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)';
                            optBorder = '#ef4444';
                          }

                          return (
                            <TouchableOpacity
                              key={idx}
                              style={[styles.optionItem, { backgroundColor: optBg, borderColor: optBorder }]}
                              onPress={() => handleSelectOption(idx)}
                              activeOpacity={0.8}
                              accessibilityRole="radio"
                              accessibilityState={{ checked: isSelected }}
                              accessibilityLabel={option}
                            >
                              <Text style={[
                                styles.optionText, 
                                { 
                                  color: isSelected 
                                    ? (quizStatus === 'fail' ? '#ef4444' : '#3b82f6') 
                                    : (quizStatus === 'success' && idx === activeModule.correctAnswerIdx ? '#10b981' : colors.text)
                                }
                              ]}>
                                {option}
                              </Text>
                              {quizStatus === 'success' && idx === activeModule.correctAnswerIdx && (
                                <CheckCircle size={18} color="#10b981" />
                              )}
                              {quizStatus === 'fail' && isSelected && (
                                <XCircle size={18} color="#ef4444" />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      {/* Action Button */}
                      {quizStatus === 'success' ? (
                        <View style={styles.resultContainer}>
                          <View style={styles.successBanner}>
                            <Sparkles size={16} color="#10b981" />
                            <Text style={styles.successText}>
                              {language === 'sw' ? 'Jibu Sahihi! Umefaulu.' : 'Correct! Well done.'}
                            </Text>
                          </View>
                          {activeIdx < modules.length - 1 ? (
                            <TouchableOpacity
                              style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                              onPress={handleNextModule}
                              accessibilityRole="button"
                              accessibilityLabel="Next Module"
                            >
                              <Text style={styles.primaryBtnText}>
                                {language === 'sw' ? 'Nenda Somo Linalofuata' : 'Next Lesson'}
                              </Text>
                              <ArrowRight size={18} color="#fff" />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={[styles.primaryBtn, { backgroundColor: '#eab308' }]}
                              onPress={() => setShowCertificate(true)}
                              accessibilityRole="button"
                              accessibilityLabel="Finish Training"
                            >
                              <Award size={18} color="#fff" />
                              <Text style={styles.primaryBtnText}>
                                {language === 'sw' ? 'Kamilisha & Pata Cheti' : 'Finish & Get Certified'}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      ) : (
                        <TouchableOpacity
                          disabled={selectedAns === null}
                          style={[
                            styles.primaryBtn, 
                            { 
                              backgroundColor: selectedAns === null ? colors.border : colors.primary,
                              opacity: selectedAns === null ? 0.6 : 1
                            }
                          ]}
                          onPress={handleVerifyAnswer}
                          accessibilityRole="button"
                          accessibilityLabel="Submit Answer"
                        >
                          <Text style={styles.primaryBtnText}>
                            {language === 'sw' ? 'Thibitisha Jibu' : 'Verify Answer'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </Animated.View>
                  </BlurView>
                </Animated.View>
              )}
            </View>
          )}
          <View style={{ height: 60 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  bgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  progressVal: {
    fontSize: 14,
    fontFamily: 'Inter_900Black',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  tabsScroll: {
    paddingBottom: 16,
    gap: 8,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
    minHeight: 48,
  },
  uncompletedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  cardContainer: {
    marginBottom: 24,
  },
  moduleCard: {
    borderRadius: 32,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  moduleIconBg: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleTitle: {
    fontSize: 16,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  moduleSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  divider: {
    height: 1,
  },
  lessonBody: {
    padding: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.5,
  },
  lessonText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    lineHeight: 22,
  },
  quizSection: {
    padding: 24,
  },
  questionText: {
    fontSize: 15,
    fontFamily: 'Inter_800ExtraBold',
    lineHeight: 22,
    marginBottom: 16,
  },
  optionsList: {
    gap: 10,
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 52,
  },
  optionText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
    paddingRight: 12,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    gap: 8,
    minHeight: 52,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter_800ExtraBold',
  },
  resultContainer: {
    gap: 12,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16,185,129,0.1)',
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
  },
  successText: {
    color: '#10b981',
    fontSize: 13,
    fontFamily: 'Inter_800ExtraBold',
  },
  /* 🏆 Certificate CSS */
  certCard: {
    marginTop: 20,
  },
  certBlur: {
    borderRadius: 36,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  certIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(234,179,8,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  sparkleIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  certHeading: {
    fontSize: 26,
    fontFamily: 'Inter_900Black',
    marginBottom: 12,
    textAlign: 'center',
  },
  certSub: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  badgeShow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59,130,246,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    marginBottom: 24,
  },
  badgeShowText: {
    color: '#3b82f6',
    fontSize: 13,
    fontFamily: 'Inter_800ExtraBold',
  },
  certDivider: {
    height: 1,
    width: '100%',
    marginBottom: 24,
  },
  certFoot: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
    marginBottom: 32,
  },
  textBtn: {
    marginTop: 16,
    paddingVertical: 12,
  },
  textBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
    textDecorationLine: 'underline',
  }
});
