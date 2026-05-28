import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
  Bot,
  GraduationCap,
  Play,
  RotateCcw
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
  withTiming,
  withRepeat,
  Easing,
  interpolate
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
  
  // Tabs & Navigation State
  const [currentTab, setCurrentTab] = useState<'sankofa' | 'motion'>('sankofa');
  
  // Sankofa States
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [quizStatus, setQuizStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [showCertificate, setShowCertificate] = useState(false);
  const shakeOffset = useSharedValue(0);

  // Creative Motion States
  const [activeMotionIdx, setActiveMotionIdx] = useState(0); // 0: Squash, 1: Anticipation
  const [bounceDuration, setBounceDuration] = useState(1200); // ms
  const [bounceHeight, setBounceHeight] = useState(80); // pt
  const [squashPrompt, setSquashPrompt] = useState('');
  const [squashFeedback, setSquashFeedback] = useState('');
  const [squashQuizAns, setSquashQuizAns] = useState<number | null>(null);
  const [squashQuizStatus, setSquashQuizStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  const [arrowDuration, setArrowDuration] = useState(1400); // ms
  const [arrowTension, setArrowTension] = useState(35); // pt
  const [anticipationPrompt, setAnticipationPrompt] = useState('');
  const [anticipationFeedback, setAnticipationFeedback] = useState('');
  const [anticipationQuizAns, setAnticipationQuizAns] = useState<number | null>(null);
  const [anticipationQuizStatus, setAnticipationQuizStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  // Shared values for Animations
  const squashAnim = useSharedValue(0);
  const arrowAnim = useSharedValue(0);

  // 60fps Animation Loops
  useEffect(() => {
    squashAnim.value = withRepeat(
      withTiming(1, { duration: bounceDuration, easing: Easing.linear }),
      -1,
      false
    );
  }, [bounceDuration]);

  useEffect(() => {
    arrowAnim.value = withRepeat(
      withTiming(1, { duration: arrowDuration, easing: Easing.linear }),
      -1,
      false
    );
  }, [arrowDuration]);

  // Animated styles
  const animatedBallStyle = useAnimatedStyle(() => {
    const p = squashAnim.value;
    const t = Math.abs(p - 0.5) * 2; // 1 at peak, 0 at ground
    const y = (1 - t * t) * bounceHeight;

    const scaleY = interpolate(
      p,
      [0, 0.25, 0.45, 0.5, 0.55, 0.75, 1],
      [1.0, 1.2, 1.25, 0.5, 1.25, 1.2, 1.0],
      'clamp'
    );

    const scaleX = interpolate(
      p,
      [0, 0.25, 0.45, 0.5, 0.55, 0.75, 1],
      [1.0, 0.85, 0.8, 1.45, 0.8, 0.85, 1.0],
      'clamp'
    );

    return {
      transform: [
        { translateY: y },
        { scaleX },
        { scaleY }
      ] as any
    };
  });

  const animatedArrowStyle = useAnimatedStyle(() => {
    const p = arrowAnim.value;
    let x = 0;
    if (p < 0.7) {
      // Pull back slowly
      const progress = p / 0.7;
      x = -arrowTension * progress;
    } else if (p < 0.75) {
      // Shoot forward rapidly
      const progress = (p - 0.7) / 0.05;
      x = interpolate(progress, [0, 1], [-arrowTension, 160]);
    } else {
      // Reset back
      const progress = (p - 0.75) / 0.25;
      x = interpolate(progress, [0, 1], [160, 0]);
    }
    return {
      transform: [{ translateX: x }] as any
    };
  });

  // Prompt Handlers
  const handleParseSquashPrompt = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const pr = squashPrompt.toLowerCase().trim();
    if (!pr) return;

    if (pr.includes('heavy') || pr.includes('slow') || pr.includes('zito') || pr.includes('polepole')) {
      setBounceDuration(1800);
      setBounceHeight(50);
      setSquashFeedback(
        language === 'sw'
          ? 'AI imeweka mfumo wa vitu VIKUBWA/VIZITO. Mpira unadunda polepole na kufinyika sana!'
          : 'AI set HEAVY physics. The ball now moves slower and squashes flatter to simulate weight!'
      );
    } else if (pr.includes('fast') || pr.includes('light') || pr.includes('haraka') || pr.includes('wepesi') || pr.includes('spring')) {
      setBounceDuration(600);
      setBounceHeight(95);
      setSquashFeedback(
        language === 'sw'
          ? 'AI imeweka mfumo wa EPESI na NISHATI YA JUU. Mpira unadunda haraka na kwa wepesi!'
          : 'AI set LIGHT & SPRINGY physics. The ball bounce rate increased!'
      );
    } else if (pr.includes('high') || pr.includes('juu') || pr.includes('tall')) {
      setBounceHeight(130);
      setBounceDuration(1000);
      setSquashFeedback(
        language === 'sw'
          ? 'AI imeweka mwinuko wa juu zaidi. Mpira unanyooka zaidi wakati wa kuanguka!'
          : 'AI configured extreme height. The ball stretches longer as it drops!'
      );
    } else if (pr.includes('low') || pr.includes('chini') || pr.includes('fupi')) {
      setBounceHeight(30);
      setBounceDuration(800);
      setSquashFeedback(
        language === 'sw'
          ? 'AI imeweka mwinuko wa chini. Mpira unadunda karibu sana na ardhi!'
          : 'AI configured low bounds. The ball stays close to the floor!'
      );
    } else {
      setSquashFeedback(
        language === 'sw'
          ? 'AI imechambua ujumbe wako na kurekebisha urefu na kasi ya dundo ili kuendana na maelezo.'
          : 'AI parsed your instruction and adjusted the spacing parameters to fit.'
      );
    }
  };

  const handleParseAnticipationPrompt = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const pr = anticipationPrompt.toLowerCase().trim();
    if (!pr) return;

    if (pr.includes('extreme') || pr.includes('mbali') || pr.includes('far') || pr.includes('deep') || pr.includes('nguvu')) {
      setArrowTension(55);
      setAnticipationFeedback(
        language === 'sw'
          ? 'AI imeweka uvutaji MKUBWA! Mshale unavutwa mbali zaidi kuonyesha matarajio makubwa.'
          : 'AI configured extreme pullback! The arrow is pulled deep, creating massive anticipation.'
      );
    } else if (pr.includes('weak') || pr.includes('short') || pr.includes('kidogo') || pr.includes('polepole')) {
      setArrowTension(15);
      setArrowDuration(2200);
      setAnticipationFeedback(
        language === 'sw'
          ? 'AI imeweka uvutaji MDOGO. Matarajio ni mafupi na ya taratibu.'
          : 'AI configured minor pullback. The anticipation is small and soft.'
      );
    } else if (pr.includes('fast') || pr.includes('snap') || pr.includes('haraka')) {
      setArrowDuration(800);
      setAnticipationFeedback(
        language === 'sw'
          ? 'AI imeweka ufyatuaji wa KASI YA JUU! Nafasi kati ya fremu imeongezeka.'
          : 'AI configured rapid speed release! The spacing between frames is wider.'
      );
    } else {
      setAnticipationFeedback(
        language === 'sw'
          ? 'AI imetathmini maelezo yako na kurekebisha umbali wa matarajio ya mshale.'
          : 'AI evaluated your prompt and updated anticipation pullback parameters.'
      );
    }
  };

  // Quiz Verification Handlers
  const handleVerifySquashQuiz = () => {
    if (squashQuizAns === null) return;
    if (squashQuizAns === 0) {
      setSquashQuizStatus('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      completeModuleAction('motion_squash');
    } else {
      setSquashQuizStatus('fail');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const handleVerifyAnticipationQuiz = () => {
    if (anticipationQuizAns === null) return;
    if (anticipationQuizAns === 0) {
      setAnticipationQuizStatus('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      completeModuleAction('motion_anticipation');
    } else {
      setAnticipationQuizStatus('fail');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

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
      completeModuleAction(activeModule.id);
      if (activeIdx === modules.length - 1) {
        setTimeout(() => {
          setShowCertificate(true);
        }, 1200);
      }
    } else {
      setQuizStatus('fail');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
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
    return (completedModules.filter(id => !id.startsWith('motion_')).length / modules.length) * 100;
  };

  const getMotionProgressPercent = () => {
    let count = 0;
    if (completedModules.includes('motion_squash')) count++;
    if (completedModules.includes('motion_anticipation')) count++;
    return (count / 2) * 100;
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
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.canGoBack() ? router.back() : router.replace('/'); }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {language === 'sw' ? 'Kitovu cha Mafunzo AI' : 'Sankofa AI Learning Hub'}
          </Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Category Switcher Tab */}
        <View style={styles.categorySwitcher}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setCurrentTab('sankofa'); }}
            style={[
              styles.categoryPill,
              currentTab === 'sankofa' 
                ? { backgroundColor: colors.primary } 
                : { borderColor: colors.border, borderWidth: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#fff' }
            ]}
            accessibilityRole="button"
            accessibilityLabel="Sankofa AI Guide"
          >
            <Text style={[styles.categoryPillText, { color: currentTab === 'sankofa' ? '#FCFBF7' : colors.text }]}>
              {language === 'sw' ? 'Mwongozo wa Sankofa' : 'Sankofa AI Guide'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setCurrentTab('motion'); }}
            style={[
              styles.categoryPill,
              currentTab === 'motion' 
                ? { backgroundColor: colors.primary } 
                : { borderColor: colors.border, borderWidth: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#fff' }
            ]}
            accessibilityRole="button"
            accessibilityLabel="Creative Art & Motion"
          >
            <Text style={[styles.categoryPillText, { color: currentTab === 'motion' ? '#FCFBF7' : colors.text }]}>
              {language === 'sw' ? 'Sanaa ya Picha na Mwendo' : 'Creative Art & Motion'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}
        >
          {/* TAB 1: SANKOFA AI GUIDE FLOW */}
          {currentTab === 'sankofa' && (
            showCertificate ? (
              /* 🏆 CERTIFICATE OF COMPLETION SCREEN */
              <Animated.View entering={FadeIn.delay(200)} style={styles.certCard}>
                <BlurView intensity={isDark ? 40 : 80} tint={isDark ? "dark" : "light"} style={[styles.certBlur, { borderColor: colors.border }]}>
                  <LinearGradient
                    colors={isDark ? ['rgba(34, 209, 90, 0.2)', 'rgba(30, 41, 59, 0.5)'] : ['rgba(34, 209, 90, 0.1)', 'rgba(255, 255, 255, 0.9)']}
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
                <ScrollView showsVerticalScrollIndicator={false} horizontal 
                  showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}
                >
                  {modules.map((m, index) => {
                    const isCompleted = completedModules.includes(m.id);
                    const isActive = index === activeIdx;
                    const isLocked = index > completedModules.filter(id => !id.startsWith('motion_')).length;

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
                              ? (isDark ? 'rgba(34,209,90,0.2)' : 'rgba(34,209,90,0.05)')
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
            )
          )}

          {/* TAB 2: CREATIVE ART & MOTION SECTION */}
          {currentTab === 'motion' && (
            <View>
              {/* Progress Tracker for Motion */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressLabel, { color: colors.textMute }]}>
                    {language === 'sw' ? `Mwendo: Mada ${activeMotionIdx + 1} ya 2` : `Motion: Lesson ${activeMotionIdx + 1} of 2`}
                  </Text>
                  <Text style={[styles.progressVal, { color: colors.primary }]}>
                    {Math.round(getMotionProgressPercent())}%
                  </Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                  <View style={[styles.progressBarFill, { width: `${getMotionProgressPercent()}%`, backgroundColor: colors.primary }]} />
                </View>
              </View>

              {/* Sub-selector pills for Squash vs Anticipation */}
              <View style={styles.motionPillTabContainer}>
                <TouchableOpacity
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveMotionIdx(0); }}
                  style={[
                    styles.motionPill,
                    activeMotionIdx === 0
                      ? { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                      : { borderColor: colors.border }
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Squash & Stretch"
                >
                  {completedModules.includes('motion_squash') ? (
                    <CheckCircle size={12} color="#10b981" />
                  ) : (
                    <View style={[styles.uncompletedDot, { backgroundColor: colors.textMute }]} />
                  )}
                  <Text style={[styles.motionPillText, { color: colors.text }]}>
                    {language === 'sw' ? 'Kufinya & Kukaza' : 'Squash & Stretch'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveMotionIdx(1); }}
                  style={[
                    styles.motionPill,
                    activeMotionIdx === 1
                      ? { backgroundColor: colors.primary + '20', borderColor: colors.primary }
                      : { borderColor: colors.border }
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Anticipation & Spacing"
                >
                  {completedModules.includes('motion_anticipation') ? (
                    <CheckCircle size={12} color="#10b981" />
                  ) : (
                    <View style={[styles.uncompletedDot, { backgroundColor: colors.textMute }]} />
                  )}
                  <Text style={[styles.motionPillText, { color: colors.text }]}>
                    {language === 'sw' ? 'Matarajio & Nafasi' : 'Anticipation & Spacing'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* LESSON 1: SQUASH AND STRETCH */}
              {activeMotionIdx === 0 && (
                <Animated.View entering={SlideInRight} style={styles.cardContainer}>
                  <BlurView intensity={isDark ? 30 : 70} tint={isDark ? "dark" : "light"} style={[styles.moduleCard, { borderColor: colors.border }]}>
                    <LinearGradient
                      colors={isDark ? ['rgba(255,255,255,0.01)', 'rgba(30,41,59,0.3)'] : ['rgba(255,255,255,0.6)', 'rgba(248,250,252,0.9)']}
                      style={StyleSheet.absoluteFill}
                    />

                    {/* Lesson Header */}
                    <View style={styles.lessonHeader}>
                      <View style={[styles.moduleIconBg, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                        <Sparkles size={24} color="#3b82f6" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.moduleTitle, { color: colors.text }]}>
                          {language === 'sw' ? 'Mbinu ya Kufinya na Kukaza' : 'Squash & Stretch'}
                        </Text>
                        <Text style={[styles.moduleSubtitle, { color: colors.textMute }]}>
                          {language === 'sw' ? 'Kujifunza wepesi, uzito na kubadilika kwa maumbo' : 'Learn flexibility, mass, and shape volume'}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Objective & Theory */}
                    <View style={styles.lessonBody}>
                      <View style={styles.sectionHeaderRow}>
                        <BookOpen size={16} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                          {language === 'sw' ? 'MADHUMUNI YA KISANAA' : 'ARTISTIC OBJECTIVE'}
                        </Text>
                      </View>
                      <Text style={[styles.lessonText, { color: colors.text }]}>
                        {language === 'sw'
                          ? 'Kufinya na Kukaza (Squash & Stretch) ndio msingi muhimu zaidi wa uhuishaji (animation). Inasaidia kuleta hisia ya uzito na wepesi wa kitu kinachotembea bila kupoteza ujazo wake wa asili. Mfano: Mpira unapoanguka unajinyoosha kiwima (stretch), na unapo gusa ardhi unafinyika kabisa kilalo (squash) kuonyesha nguvu ya mguso.'
                          : 'Squash & Stretch is the most fundamental principle of animation. It gives static objects a sense of weight, flexibility, and life by changing their shape dynamically during movement. The volume must remain constant: stretching vertically during travel, and squashing horizontally upon floor impact.'}
                      </Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Animation Canvas Demo */}
                    <View style={styles.canvasContainer}>
                      <Text style={styles.canvasLabel}>
                        {language === 'sw' ? 'MIFANO YA 60FPS YA UHAKIKA' : '60FPS HARDWARE-ACCELERATED PREVIEW'}
                      </Text>
                      <View 
                        style={[styles.motionCanvas, { backgroundColor: isDark ? '#080a06' : '#f8fafc', borderColor: colors.border }]}
                        accessibilityLabel="Bouncing ball showcasing squash and stretch principles"
                      >
                        {/* Floor Line */}
                        <View style={[styles.canvasFloor, { backgroundColor: colors.border }]} />
                        {/* Reanimated Ball */}
                        <Animated.View style={[styles.animatedBall, { backgroundColor: colors.primary }, animatedBallStyle]} />
                      </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Sliders Presets Control */}
                    <View style={styles.lessonBody}>
                      <Text style={[styles.sectionTitle, { color: colors.primary, marginBottom: 12 }]}>
                        {language === 'sw' ? 'DHIBITI PARAMETA ZA MWENDO' : 'MOTION PARAMETER CONTROL'}
                      </Text>
                      
                      {/* Speed Presets */}
                      <Text style={[styles.fieldLabel, { color: colors.text }]}>
                        {language === 'sw' ? 'Kasi ya Dundo / Bounce Speed:' : 'Bounce Speed:'}
                      </Text>
                      <View style={styles.presetRow}>
                        {([
                          { label: language === 'sw' ? 'Polepole' : 'Slow', val: 1800 },
                          { label: language === 'sw' ? 'Kawaida' : 'Normal', val: 1200 },
                          { label: language === 'sw' ? 'Haraka' : 'Fast', val: 600 }
                        ]).map((item) => (
                          <TouchableOpacity
                            key={item.val}
                            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setBounceDuration(item.val); }}
                            style={[styles.presetBtn, bounceDuration === item.val ? { backgroundColor: colors.primary } : { borderColor: colors.border, borderWidth: 1 }]}
                          >
                            <Text style={[styles.presetBtnText, { color: bounceDuration === item.val ? '#FCFBF7' : colors.text }]}>
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      {/* Height Presets */}
                      <Text style={[styles.fieldLabel, { color: colors.text, marginTop: 16 }]}>
                        {language === 'sw' ? 'Kina cha Juu / Bounce Height:' : 'Bounce Height:'}
                      </Text>
                      <View style={styles.presetRow}>
                        {([
                          { label: language === 'sw' ? 'Chini' : 'Low', val: 40 },
                          { label: language === 'sw' ? 'Kati' : 'Medium', val: 80 },
                          { label: language === 'sw' ? 'Juu' : 'High', val: 130 }
                        ]).map((item) => (
                          <TouchableOpacity
                            key={item.val}
                            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setBounceHeight(item.val); }}
                            style={[styles.presetBtn, bounceHeight === item.val ? { backgroundColor: colors.primary } : { borderColor: colors.border, borderWidth: 1 }]}
                          >
                            <Text style={[styles.presetBtnText, { color: bounceHeight === item.val ? '#FCFBF7' : colors.text }]}>
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Creative prompt challenge */}
                    <View style={styles.lessonBody}>
                      <View style={styles.sectionHeaderRow}>
                        <Brain size={16} color="#3b82f6" />
                        <Text style={[styles.sectionTitle, { color: '#3b82f6' }]}>
                          {language === 'sw' ? 'JARIBU MAELEZO YA KIFANISHAJI (PHYSICS PROMPTING)' : 'PHYSICS PROMPT CHALLENGE'}
                        </Text>
                      </View>
                      
                      <Text style={[styles.promptDesc, { color: colors.textMute }]}>
                        {language === 'sw'
                          ? 'Andika maelezo ya fizikia (mfano "heavy slow bounce" au "haraka sana chini") kuona AI inavyobadili dundo la mpira.'
                          : 'Enter a physics text instruction (e.g. "heavy bounce", "extremely fast and springy") to see how the AI parses the command to modify ball physics.'}
                      </Text>

                      <View style={styles.promptInputContainer}>
                        <TextInput
                          value={squashPrompt}
                          onChangeText={setSquashPrompt}
                          style={[styles.promptInput, { color: colors.text, borderColor: colors.border }]}
                          placeholder={language === 'sw' ? 'Andika mfumo wa fizikia...' : 'Enter physics prompt...'}
                          placeholderTextColor={colors.textMute}
                          accessibilityLabel="Squash Prompt Input"
                        />
                        <TouchableOpacity
                          style={[styles.promptSubmitBtn, { backgroundColor: colors.primary }]}
                          onPress={handleParseSquashPrompt}
                        >
                          <Text style={styles.promptSubmitBtnText}>
                            {language === 'sw' ? 'Tathmini' : 'Parse'}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {squashFeedback ? (
                        <View style={[styles.promptFeedbackBox, { backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)', borderColor: '#3b82f6' }]}>
                          <Sparkles size={14} color="#3b82f6" style={{ marginTop: 2 }} />
                          <Text style={[styles.promptFeedbackText, { color: colors.text }]}>{squashFeedback}</Text>
                        </View>
                      ) : null}
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Checkpoint Quiz */}
                    <View style={styles.quizSection}>
                      <View style={styles.sectionHeaderRow}>
                        <HelpCircle size={16} color="#3b82f6" />
                        <Text style={[styles.sectionTitle, { color: '#3b82f6' }]}>
                          {language === 'sw' ? 'MTIHANI WA MADA' : 'LESSON CHECKPOINT'}
                        </Text>
                      </View>

                      <Text style={[styles.questionText, { color: colors.text }]}>
                        {language === 'sw'
                          ? 'Ni ipi athari kuu ya mbinu ya Kufinya na Kukaza (Squash & Stretch) kwenye kitu kinachotembea?'
                          : 'What is the primary effect of Squash & Stretch on a moving object?'}
                      </Text>

                      <View style={styles.optionsList}>
                        {([
                          {
                            sw: 'A) Inatoa hisia za uzito, wepesi na mvuto bila kupoteza ujazo wake wa asili.',
                            en: 'A) It provides a sense of weight, flexibility, and drag without losing its original volume.'
                          },
                          {
                            sw: 'B) Inafanya kitu kionekane kama chuma kigumu kisichoweza kubadilika.',
                            en: 'B) It makes the object look like rigid solid steel that cannot deform.'
                          },
                          {
                            sw: 'C) Inapunguza kiwango cha picha kwa sekunde.',
                            en: 'C) It decreases the frame rate of the render.'
                          }
                        ]).map((opt, idx) => {
                          const isSelected = squashQuizAns === idx;
                          let optBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
                          let optBorder = colors.border;
                          
                          if (isSelected) {
                            optBg = isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)';
                            optBorder = '#3b82f6';
                          }
                          if (squashQuizStatus === 'success' && idx === 0) {
                            optBg = isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.05)';
                            optBorder = '#10b981';
                          } else if (squashQuizStatus === 'fail' && isSelected) {
                            optBg = isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)';
                            optBorder = '#ef4444';
                          }

                          return (
                            <TouchableOpacity
                              key={idx}
                              style={[styles.optionItem, { backgroundColor: optBg, borderColor: optBorder }]}
                              onPress={() => {
                                if (squashQuizStatus === 'success') return;
                                setSquashQuizAns(idx);
                                setSquashQuizStatus('idle');
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              }}
                            >
                              <Text style={[styles.optionText, { color: colors.text }]}>
                                {language === 'sw' ? opt.sw : opt.en}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      {squashQuizStatus === 'success' ? (
                        <View style={styles.successBanner}>
                          <CheckCircle size={16} color="#10b981" />
                          <Text style={styles.successText}>
                            {language === 'sw' ? 'Hongera! Jibu Lako ni Sahihi.' : 'Correct! Lesson completed.'}
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          disabled={squashQuizAns === null}
                          style={[styles.primaryBtn, { backgroundColor: squashQuizAns === null ? colors.border : colors.primary, opacity: squashQuizAns === null ? 0.6 : 1 }]}
                          onPress={handleVerifySquashQuiz}
                        >
                          <Text style={styles.primaryBtnText}>
                            {language === 'sw' ? 'Thibitisha Jibu' : 'Verify Answer'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </BlurView>
                </Animated.View>
              )}

              {/* LESSON 2: ANTICIPATION AND SPACING */}
              {activeMotionIdx === 1 && (
                <Animated.View entering={SlideInRight} style={styles.cardContainer}>
                  <BlurView intensity={isDark ? 30 : 70} tint={isDark ? "dark" : "light"} style={[styles.moduleCard, { borderColor: colors.border }]}>
                    <LinearGradient
                      colors={isDark ? ['rgba(255,255,255,0.01)', 'rgba(30,41,59,0.3)'] : ['rgba(255,255,255,0.6)', 'rgba(248,250,252,0.9)']}
                      style={StyleSheet.absoluteFill}
                    />

                    {/* Lesson Header */}
                    <View style={styles.lessonHeader}>
                      <View style={[styles.moduleIconBg, { backgroundColor: 'rgba(234,179,8,0.1)' }]}>
                        <Play size={24} color="#eab308" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.moduleTitle, { color: colors.text }]}>
                          {language === 'sw' ? 'Mbinu ya Matarajio na Nafasi' : 'Anticipation & Spacing'}
                        </Text>
                        <Text style={[styles.moduleSubtitle, { color: colors.textMute }]}>
                          {language === 'sw' ? 'Kujifunza ufyatuaji na harakati za maandalizi' : 'Learn pullback, acceleration, and release'}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Objective & Theory */}
                    <View style={styles.lessonBody}>
                      <View style={styles.sectionHeaderRow}>
                        <BookOpen size={16} color={colors.primary} />
                        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                          {language === 'sw' ? 'MADHUMUNI YA KISANAA' : 'ARTISTIC OBJECTIVE'}
                        </Text>
                      </View>
                      <Text style={[styles.lessonText, { color: colors.text }]}>
                        {language === 'sw'
                          ? 'Mbinu ya Matarajio (Anticipation) hutayarisha akili ya mtazamaji kwa tendo kuu linalofuata. Mfano: Kabla ya kuruka juu, mtu lazima kwanza ainame magoti chini. Katika mfano wa upinde na mshale, mshale lazima kwanza uvutwe nyuma polepole (anticipation) kabla ya kurushwa mbele kwa kasi sana (spacing ya haraka).'
                          : 'Anticipation prepares the audience for an action by executing a small setup movement in the opposite direction. For instance, a character must crouch down before jumping up. In our bow and arrow example, the arrow slowly pulls backward (anticipation) to gather potential energy before snapping forward instantly (spacing / release).'}
                      </Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Animation Canvas Demo */}
                    <View style={styles.canvasContainer}>
                      <Text style={styles.canvasLabel}>
                        {language === 'sw' ? 'MIFANO YA 60FPS YA UHAKIKA' : '60FPS HARDWARE-ACCELERATED PREVIEW'}
                      </Text>
                      <View 
                        style={[styles.motionCanvas, { backgroundColor: isDark ? '#080a06' : '#f8fafc', borderColor: colors.border }]}
                        accessibilityLabel="Bow and arrow animation showcasing anticipation and spacing principles"
                      >
                        {/* Bow shape SVG representation using styled lines */}
                        <View style={[styles.bowCurve, { borderColor: colors.text }]} />
                        <View style={[styles.bowString, { backgroundColor: colors.textMute }]} />
                        {/* Animated Arrow */}
                        <Animated.View style={[styles.animatedArrow, animatedArrowStyle]}>
                          <View style={[styles.arrowShaft, { backgroundColor: '#ef4444' }]} />
                          <View style={[styles.arrowHead, { borderLeftColor: '#ef4444' }]} />
                        </Animated.View>
                      </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Sliders Presets Control */}
                    <View style={styles.lessonBody}>
                      <Text style={[styles.sectionTitle, { color: colors.primary, marginBottom: 12 }]}>
                        {language === 'sw' ? 'DHIBITI PARAMETA ZA MWENDO' : 'MOTION PARAMETER CONTROL'}
                      </Text>
                      
                      {/* Pullback Presets */}
                      <Text style={[styles.fieldLabel, { color: colors.text }]}>
                        {language === 'sw' ? 'Urefu wa Kuvuta Nyuma / Pullback Tension:' : 'Pullback Tension:'}
                      </Text>
                      <View style={styles.presetRow}>
                        {([
                          { label: language === 'sw' ? 'Kidogo' : 'Light', val: 15 },
                          { label: language === 'sw' ? 'Kati' : 'Medium', val: 35 },
                          { label: language === 'sw' ? 'Kubwa' : 'Extreme', val: 55 }
                        ]).map((item) => (
                          <TouchableOpacity
                            key={item.val}
                            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setArrowTension(item.val); }}
                            style={[styles.presetBtn, arrowTension === item.val ? { backgroundColor: colors.primary } : { borderColor: colors.border, borderWidth: 1 }]}
                          >
                            <Text style={[styles.presetBtnText, { color: arrowTension === item.val ? '#FCFBF7' : colors.text }]}>
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      {/* Release Duration Presets */}
                      <Text style={[styles.fieldLabel, { color: colors.text, marginTop: 16 }]}>
                        {language === 'sw' ? 'Muda wa Kufyatua / Release Cycle:' : 'Release Cycle:'}
                      </Text>
                      <View style={styles.presetRow}>
                        {([
                          { label: language === 'sw' ? 'Haraka' : 'Snap', val: 800 },
                          { label: language === 'sw' ? 'Kawaida' : 'Normal', val: 1400 },
                          { label: language === 'sw' ? 'Taratibu' : 'Slow', val: 2200 }
                        ]).map((item) => (
                          <TouchableOpacity
                            key={item.val}
                            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setArrowDuration(item.val); }}
                            style={[styles.presetBtn, arrowDuration === item.val ? { backgroundColor: colors.primary } : { borderColor: colors.border, borderWidth: 1 }]}
                          >
                            <Text style={[styles.presetBtnText, { color: arrowDuration === item.val ? '#FCFBF7' : colors.text }]}>
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Creative prompt challenge */}
                    <View style={styles.lessonBody}>
                      <View style={styles.sectionHeaderRow}>
                        <Brain size={16} color="#3b82f6" />
                        <Text style={[styles.sectionTitle, { color: '#3b82f6' }]}>
                          {language === 'sw' ? 'JARIBU MAELEZO YA KIFANISHAJI (PHYSICS PROMPTING)' : 'PHYSICS PROMPT CHALLENGE'}
                        </Text>
                      </View>
                      
                      <Text style={[styles.promptDesc, { color: colors.textMute }]}>
                        {language === 'sw'
                          ? 'Andika maelezo ya fizikia (mfano "extreme pull back" au "weak short pullback") kuona AI inavyobadili uzani wa mshale.'
                          : 'Enter a physics text instruction (e.g. "extreme pull back", "weak short pullback") to see how the AI parses the command to modify arrow physics.'}
                      </Text>

                      <View style={styles.promptInputContainer}>
                        <TextInput
                          value={anticipationPrompt}
                          onChangeText={setAnticipationPrompt}
                          style={[styles.promptInput, { color: colors.text, borderColor: colors.border }]}
                          placeholder={language === 'sw' ? 'Andika mfumo wa fizikia...' : 'Enter physics prompt...'}
                          placeholderTextColor={colors.textMute}
                          accessibilityLabel="Anticipation Prompt Input"
                        />
                        <TouchableOpacity
                          style={[styles.promptSubmitBtn, { backgroundColor: colors.primary }]}
                          onPress={handleParseAnticipationPrompt}
                        >
                          <Text style={styles.promptSubmitBtnText}>
                            {language === 'sw' ? 'Tathmini' : 'Parse'}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {anticipationFeedback ? (
                        <View style={[styles.promptFeedbackBox, { backgroundColor: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)', borderColor: '#3b82f6' }]}>
                          <Sparkles size={14} color="#3b82f6" style={{ marginTop: 2 }} />
                          <Text style={[styles.promptFeedbackText, { color: colors.text }]}>{anticipationFeedback}</Text>
                        </View>
                      ) : null}
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Checkpoint Quiz */}
                    <View style={styles.quizSection}>
                      <View style={styles.sectionHeaderRow}>
                        <HelpCircle size={16} color="#3b82f6" />
                        <Text style={[styles.sectionTitle, { color: '#3b82f6' }]}>
                          {language === 'sw' ? 'MTIHANI WA MADA' : 'LESSON CHECKPOINT'}
                        </Text>
                      </View>

                      <Text style={[styles.questionText, { color: colors.text }]}>
                        {language === 'sw'
                          ? 'Ni ipi faida kuu ya kuongeza kipindi cha matarajio (Anticipation) kabla ya kufyatua mshale?'
                          : 'What is the main benefit of adding an anticipation phase before releasing the arrow?'}
                      </Text>

                      <View style={styles.optionsList}>
                        {([
                          {
                            sw: 'A) Inatayarisha macho ya mtazamaji na kuonyesha nishati inayokusanywa kabla ya harakati ya haraka kuanza.',
                            en: 'A) It prepares the viewer\'s eyes and highlights potential energy built up before a high-speed motion starts.'
                          },
                          {
                            sw: 'B) Inazuia mshale usijikunje au kupasuka katikati.',
                            en: 'B) It prevents the arrow from bending or splitting in half.'
                          },
                          {
                            sw: 'C) Inapunguza ukubwa wa simu yako.',
                            en: 'C) It decreases the storage size of your app.'
                          }
                        ]).map((opt, idx) => {
                          const isSelected = anticipationQuizAns === idx;
                          let optBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
                          let optBorder = colors.border;
                          
                          if (isSelected) {
                            optBg = isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)';
                            optBorder = '#3b82f6';
                          }
                          if (anticipationQuizStatus === 'success' && idx === 0) {
                            optBg = isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.05)';
                            optBorder = '#10b981';
                          } else if (anticipationQuizStatus === 'fail' && isSelected) {
                            optBg = isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)';
                            optBorder = '#ef4444';
                          }

                          return (
                            <TouchableOpacity
                              key={idx}
                              style={[styles.optionItem, { backgroundColor: optBg, borderColor: optBorder }]}
                              onPress={() => {
                                if (anticipationQuizStatus === 'success') return;
                                setAnticipationQuizAns(idx);
                                setAnticipationQuizStatus('idle');
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              }}
                            >
                              <Text style={[styles.optionText, { color: colors.text }]}>
                                {language === 'sw' ? opt.sw : opt.en}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      {anticipationQuizStatus === 'success' ? (
                        <View style={styles.successBanner}>
                          <CheckCircle size={16} color="#10b981" />
                          <Text style={styles.successText}>
                            {language === 'sw' ? 'Hongera! Jibu Lako ni Sahihi.' : 'Correct! Lesson completed.'}
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          disabled={anticipationQuizAns === null}
                          style={[styles.primaryBtn, { backgroundColor: anticipationQuizAns === null ? colors.border : colors.primary, opacity: anticipationQuizAns === null ? 0.6 : 1 }]}
                          onPress={handleVerifyAnticipationQuiz}
                        >
                          <Text style={styles.primaryBtnText}>
                            {language === 'sw' ? 'Thibitisha Jibu' : 'Verify Answer'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </BlurView>
                </Animated.View>
              )}
            </View>
          )}

          <View style={{ height: 110 }} />
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
    fontFamily: 'InstrumentSerif_400Regular',
    textAlign: 'center',
    flex: 1,
  },
  categorySwitcher: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginVertical: 12,
  },
  categoryPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPillText: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 8,
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
    fontFamily: 'InstrumentSerif_400Regular',
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
    fontFamily: 'InstrumentSerif_400Regular',
    letterSpacing: -0.5,
  },
  moduleSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    fontFamily: 'InstrumentSerif_400Regular',
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
    marginBottom: 12,
  },
  successText: {
    color: '#10b981',
    fontSize: 13,
    fontFamily: 'Inter_800ExtraBold',
  },
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
    fontFamily: 'InstrumentSerif_400Regular',
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
  },
  // Creative Art & Motion styles
  motionPillTabContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  motionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  motionPillText: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
  },
  canvasContainer: {
    padding: 24,
    alignItems: 'center',
  },
  canvasLabel: {
    fontSize: 10,
    fontFamily: 'InstrumentSerif_400Regular',
    letterSpacing: 1,
    marginBottom: 12,
    opacity: 0.5,
  },
  motionCanvas: {
    width: '100%',
    height: 180,
    borderRadius: 24,
    borderWidth: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  canvasFloor: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    right: 10,
    height: 2,
  },
  animatedBall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'absolute',
    bottom: 30,
  },
  bowCurve: {
    position: 'absolute',
    left: 40,
    top: 50,
    bottom: 50,
    width: 60,
    borderWidth: 3,
    borderLeftWidth: 0,
    borderRadius: 40,
  },
  bowString: {
    position: 'absolute',
    left: 40,
    top: 50,
    bottom: 50,
    width: 1.5,
  },
  animatedArrow: {
    position: 'absolute',
    left: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowShaft: {
    width: 80,
    height: 2,
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderTopColor: 'transparent',
    borderBottomWidth: 6,
    borderBottomColor: 'transparent',
    borderLeftWidth: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  presetBtnText: {
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
  },
  promptDesc: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    lineHeight: 18,
    marginBottom: 12,
  },
  promptInputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  promptInput: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  promptSubmitBtn: {
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptSubmitBtnText: {
    color: '#FCFBF7',
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
  },
  promptFeedbackBox: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  promptFeedbackText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 18,
    flex: 1,
  }
});
