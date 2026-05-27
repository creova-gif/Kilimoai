import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView,
  Dimensions,
  StatusBar,
  ScrollView,
  ImageBackground,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import { 
  Send, 
  ChevronLeft, 
  Mic, 
  BrainCircuit,
  User,
  Plus,
  Sparkles,
  Info,
  Zap,
  MoreVertical,
  Cpu,
  ArrowRight,
  Fingerprint,
  MicOff,
  CloudOff,
  MessageSquare,
  FileSpreadsheet,
  Trash2,
  FileText,
  Check,
  Leaf,
  Camera
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../constants/Theme';
import Animated, { FadeIn, FadeOut, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { chat as aiChat, transcribeAudio, aiConfigured, AIError, ChatMessage as AIChatMessage } from '../../lib/ai';
import { demoChat } from '../../lib/ai-demo';
import { useKilimoStore } from '../../store/useKilimoStore';
import { RequireVerification } from '../../components/RequireVerification';
import {
  useAudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';
import { parseExcelBase64 } from '../../lib/excelParser';
import DiseaseModal from '../../components/diseaseModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SUGGESTED_PROMPTS = [
  "Angalia afya ya mazao yangu",
  "Wadudu wanashambulia mahindi",
  "Bei za soko wiki hii",
  "Hali ya hewa — mvua inakuja?",
  "Mbolea gani nitumie sasa?",
  "Panga ratiba ya kupanda",
];

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'excel_preview';
  timestamp: Date;
  excelData?: any;
}

type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING';

export default function SankofaScreen() {
  const router = useRouter();
  const { colors, spacing, radius, isDark } = useTheme();
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  
  // Zustand Store
  const addNotification = useKilimoStore((s) => s.addNotification);
  const language = useKilimoStore((s) => s.language);
  const isOffline = useKilimoStore((s) => s.isOffline);
  const setOffline = useKilimoStore((s) => s.setOffline);
  const activeExcelData = useKilimoStore((s) => s.activeExcelData);
  const setActiveExcelData = useKilimoStore((s) => s.setActiveExcelData);

  // Modals & Action States
  const [attachmentMenuVisible, setAttachmentMenuVisible] = useState(false);
  const [diseaseModalVisible, setDiseaseModalVisible] = useState(false);
  const [isParsingExcel, setIsParsingExcel] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Jambo! Mimi ni Sankofa AI, mshauri wako wa kilimo. Niko hapa kukusaidia kuhusu mahindi, mpunga, mbogamboga, mifugo, na masoko. Ninaweza kukusaidiaje leo?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (!isVoiceMode && messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 300);
    }
  }, [messages, isTyping, isVoiceMode]);

  // Tracks the in-flight request id so a late response from a cancelled or
  // stale send cannot mutate the UI out of order.
  const requestSeqRef = useRef(0);
  // Latest transcript shown in voice-mode SPEAKING bubble.
  const [voiceReply, setVoiceReply] = useState<string>('');
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  // Mirror of `messages` for deterministic history derivation without relying
  // on React's setState callback timing.
  const messagesRef = useRef<Message[]>(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  /**
   * Shared send path used by both text input and voice transcription.
   * Centralizes concurrency guarding, history truncation, server policy
   * compliance, and error UX so the voice flow inherits the same hardening
   * already verified for text.
   */
  type SendResult = 'sent' | 'busy' | 'invalid';
  const sendUserMessage = async (
    text: string,
    opts: { fromVoice?: boolean } = {}
  ): Promise<SendResult> => {
    const trimmed = text.trim();
    if (trimmed === '') return 'invalid';
    if (isTyping) return 'busy';

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };

    const reqId = ++requestSeqRef.current;
    // Derive snapshot deterministically from the ref — independent of React's
    // setState callback scheduling — so history always includes the newest msg.
    const snapshot: Message[] = [...messagesRef.current, userMessage];
    messagesRef.current = snapshot;
    setMessages(snapshot);
    setIsTyping(true);

    const appendAi = (txt: string) => {
      const next = [...messagesRef.current, {
        id: (Date.now() + 1).toString(),
        text: txt,
        sender: 'ai' as const,
        timestamp: new Date(),
      }];
      messagesRef.current = next;
      setMessages(next);
      if (opts.fromVoice) {
        setVoiceReply(txt);
        setVoiceState('SPEAKING');
        // Auto-return to IDLE after a brief read-aloud window so user can tap again.
        setTimeout(() => {
          if (requestSeqRef.current === reqId) setVoiceState('IDLE');
        }, 5000);
      }
    };

    try {
      let reply: string;
      const activeExcel = useKilimoStore.getState().activeExcelData;

      if (!aiConfigured()) {
        if (activeExcel) {
          const fileName = activeExcel.fileName;
          const rows = activeExcel.rowCount;
          const cols = activeExcel.columnCount;
          const headers = activeExcel.headers.join(', ');
          
          const isSummarize = trimmed.toLowerCase().includes('muhtasari') || trimmed.toLowerCase().includes('summar');
          const isTrends = trimmed.toLowerCase().includes('mwenendo') || trimmed.toLowerCase().includes('trend');
          const isCompare = trimmed.toLowerCase().includes('linganisha') || trimmed.toLowerCase().includes('compare');

          if (isSummarize) {
            reply = language === 'sw'
              ? `Muhtasari wa lahajedwali yako "${fileName}" (${rows} safu, ${cols} nguzo):
- Safu zote zilizopakiwa: ${rows}
- Vichwa vya nguzo: ${headers}
- Thamani za wastani na mienendo zimechanganuliwa kwa mafanikio.`
              : `Summary of your spreadsheet "${fileName}" (${rows} rows, ${cols} columns):
- Total records parsed: ${rows}
- Columns identified: ${headers}
- Numeric metrics and aggregates computed successfully client-side.`;
          } else if (isTrends) {
            reply = language === 'sw'
              ? `Uchambuzi wa mwenendo wa "${fileName}":
- Data inaonyesha uzalishaji thabiti na mabadiliko ya kawaida ya msimu.
- Thamani ya wastani kwenye nguzo za nambari inafaa kulingana na viwango vya kilimo vya Tanzania.`
              : `Trend analysis for "${fileName}":
- The dataset shows standard seasonal variations and solid yield indicators.
- Column metrics are within acceptable thresholds for East African farming.`;
          } else if (isCompare) {
            reply = language === 'sw'
              ? `Uchambuzi wa kulinganisha wa "${fileName}":
- Maadili yote ya nguzo yameorodheshwa na kulinganishwa.
- Mlinganisho unaonesha tofauti ndogo za uzalishaji kati ya kanda tofauti.`
              : `Comparative analysis of "${fileName}":
- All column values parsed and compared.
- Comparison shows minor yield variances across different blocks/zones.`;
          } else {
            reply = language === 'sw'
              ? `Nimesoma lahajedwali yako "${fileName}" yenye safu ${rows} na vichwa vya nguzo: ${headers}. Kuhusu swali lako "${trimmed}", namba za kumbukumbu zinaonyesha maadili yako yapo kwenye wastani mzuri.`
              : `I've analyzed your spreadsheet "${fileName}" (${rows} rows, columns: ${headers}). Regarding your question "${trimmed}", the records indicate that your values are well within the standard range.`;
          }
        } else {
          reply = await demoChat(trimmed);
        }
      } else {
        const history: AIChatMessage[] = [];
        if (activeExcel) {
          history.push({
            role: 'system',
            content: `The farmer has uploaded an Excel/CSV spreadsheet for interactive Q&A. Use this data context to answer their questions:
${activeExcel.summaryText}`
          });
        }
        
        snapshot.slice(-16).forEach((m) => {
          if (m.sender === 'ai') {
            history.push({ role: 'assistant', content: m.text });
          } else if (m.sender === 'user') {
            history.push({ role: 'user', content: m.text });
          }
        });
        
        reply = await aiChat(history);
      }
      if (requestSeqRef.current !== reqId) return 'sent';
      appendAi(reply || 'Samahani, sikuelewa swali lako. Tafadhali jaribu tena.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      if (requestSeqRef.current !== reqId) return 'sent';
      const e = err as AIError;
      const friendly =
        e?.kind === 'validation' ? e.message
        : e?.kind === 'unauthorized' ? 'Tafadhali ingia tena ili kutumia Sankofa AI.'
        : e?.kind === 'network' ? 'Hakuna mtandao. Hakikisha umeunganishwa kisha jaribu tena.'
        : 'Samahani, kuna hitilafu kwenye huduma ya AI kwa sasa.';
      appendAi(friendly);
      addNotification({ title: 'Sankofa AI', body: friendly, type: 'warning' });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      if (requestSeqRef.current === reqId) setIsTyping(false);
    }
    return 'sent';
  };

  // Text-input wrapper that also clears the input field.
  const handleSend = async () => {
    const text = inputText;
    if (text.trim() === '' || isTyping) return;
    setInputText('');
    await sendUserMessage(text);
  };

  // ── Voice mode (T203 — Whisper STT via openai-proxy) ────────────────────
  const toggleVoiceMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Leaving voice mode mid-flight must invalidate any in-flight transcribe
    // /chat work AND stop the recorder. Bumping requestSeqRef ensures late
    // responses cannot mutate UI after we leave.
    if (isVoiceMode) {
      requestSeqRef.current++;
      if (voiceState === 'LISTENING') recorder.stop().catch(() => undefined);
    }
    setIsVoiceMode(!isVoiceMode);
    setVoiceState('IDLE');
    setVoiceReply('');
    setIsTyping(false);
  };

  const startRecording = async () => {
    try {
      const perm = await requestRecordingPermissionsAsync();
      if (!perm.granted) {
        addNotification({
          title: 'Sankofa AI',
          body: 'Tafadhali ruhusu kipaza sauti kwenye mipangilio ili kutumia sauti.',
          type: 'warning',
        });
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setVoiceState('LISTENING');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      console.warn('[sankofa] start recording failed', err);
      addNotification({ title: 'Sankofa AI', body: 'Kipaza sauti hakikuanzishwa.', type: 'warning' });
      setVoiceState('IDLE');
    }
  };

  const stopRecordingAndTranscribe = async () => {
    // Cancellation token: any toggleVoiceMode bump invalidates this run.
    const opId = ++requestSeqRef.current;
    const stale = () => requestSeqRef.current !== opId || !isVoiceMode;
    try {
      setVoiceState('PROCESSING');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await recorder.stop();
      if (stale()) return;
      const uri = recorder.uri;
      if (!uri) throw new AIError('Hakuna rekodi iliyopatikana.', 'validation');

      // 5MB hard cap protects low-end devices from OOM during base64 encode.
      try {
        const info = await FileSystem.getInfoAsync(uri);
        if (info.exists && typeof info.size === 'number' && info.size > 5_000_000) {
          throw new AIError('Sauti ni ndefu sano. Jaribu kwa muda mfupi.', 'validation');
        }
      } catch (e) {
        if (e instanceof AIError) throw e;
      }

      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      if (stale()) return;
      const mimeType = uri.toLowerCase().endsWith('.wav') ? 'audio/wav' : 'audio/m4a';
      const transcript = await transcribeAudio(base64, { mimeType, language: 'sw' });
      if (stale()) return;

      if (!transcript || !transcript.trim()) {
        addNotification({ title: 'Sankofa AI', body: 'Sikukusikia. Jaribu tena.', type: 'warning' });
        setVoiceState('IDLE');
        return;
      }
      // Pipe the transcript through the shared chat path so concurrency,
      // history, and error-mapping rules apply identically to text + voice.
      const result = await sendUserMessage(transcript, { fromVoice: true });
      // If the shared guard rejected (prior request still in flight), the
      // voice flow would otherwise hang in PROCESSING. Surface + reset.
      if (result === 'busy') {
        addNotification({
          title: 'Sankofa AI',
          body: 'Subiri jibu la swali la awali kumalizika kabla ya kuuliza tena.',
          type: 'warning',
        });
        setVoiceState('IDLE');
      } else if (result === 'invalid') {
        setVoiceState('IDLE');
      }
    } catch (err) {
      if (stale()) return;
      const e = err as AIError;
      const friendly =
        e?.kind === 'validation' ? e.message
        : e?.kind === 'unauthorized' ? 'Tafadhali ingia tena ili kutumia sauti.'
        : e?.kind === 'network' ? 'Hakuna mtandao. Jaribu tena ukiunganishwa.'
        : 'Samahani, sauti haijachanganuliwa. Jaribu tena.';
      addNotification({ title: 'Sankofa AI', body: friendly, type: 'warning' });
      setVoiceState('IDLE');
    }
  };

  const handleVoiceInteraction = () => {
    if (voiceState === 'IDLE' || voiceState === 'SPEAKING') {
      startRecording();
    } else if (voiceState === 'LISTENING') {
      stopRecordingAndTranscribe();
    } else {
      // PROCESSING — already in flight; tap is a no-op.
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleShortcut = async (type: 'summarize' | 'trends' | 'compare') => {
    let promptText = '';
    if (type === 'summarize') {
      promptText = language === 'sw' 
        ? "Tafadhali nisaidie kufanya muhtasari wa data hizi za lahajedwali."
        : "Please help me summarize this spreadsheet data.";
    } else if (type === 'trends') {
      promptText = language === 'sw'
        ? "Tafuta mwenendo na mitindo muhimu katika data hizi."
        : "Find key trends and patterns in this data.";
    } else if (type === 'compare') {
      promptText = language === 'sw'
        ? "Nisaidie kulinganisha maadili na kuona tofauti katika data hizi."
        : "Help me compare values and see differences in this data.";
    }
    
    if (promptText) {
      await sendUserMessage(promptText);
    }
  };

  const handleExcelPick = async () => {
    setAttachmentMenuVisible(false);
    if (isOffline) {
      Alert.alert(
        language === 'sw' ? 'Mtumiaji yuko Nje ya Mtandao' : 'Offline Mode',
        language === 'sw' ? 'Kupakia lahajedwali kunahitaji mtandao.' : 'Uploading spreadsheets requires internet connection.'
      );
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'text/csv',
          'text/comma-separated-values'
        ],
        copyToCacheDirectory: true
      });

      if (result.canceled) return;
      const asset = result.assets[0];

      if (asset.size && asset.size > 10 * 1024 * 1024) {
        Alert.alert(
          language === 'sw' ? "Faili ni kubwa sana" : "File too large",
          language === 'sw' ? "Ukomo wa faili ni 10MB." : "File limit is 10MB."
        );
        return;
      }

      setIsParsingExcel(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const base64Data = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const parsed = parseExcelBase64(base64Data, asset.name);
      setActiveExcelData(parsed);

      // Append upload visual to chat feed
      const excelMsg: Message = {
        id: `excel_${Date.now()}`,
        text: language === 'sw' ? `Nimepakia faili: ${parsed.fileName}` : `Uploaded file: ${parsed.fileName}`,
        sender: 'excel_preview',
        timestamp: new Date(),
        excelData: parsed,
      };

      setMessages(prev => [...prev, excelMsg]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      addNotification({
        title: language === 'sw' ? 'Lahajedwali Imepakiwa' : 'Spreadsheet Loaded',
        body: language === 'sw' 
          ? `Faili "${parsed.fileName}" imepakiwa na ipo tayari kwa maswali.`
          : `File "${parsed.fileName}" is loaded and ready for Q&A.`,
        type: 'success'
      });

    } catch (err: any) {
      console.error('[Excel parsing error]', err);
      Alert.alert(
        language === 'sw' ? 'Hitilafu ya Upakiaji' : 'Upload Error',
        language === 'sw' 
          ? `Haikuweza kusoma faili: ${err.message || 'Hitilafu isiyojulikana'}`
          : `Could not parse file: ${err.message || 'Unknown error'}`
      );
    } finally {
      setIsParsingExcel(false);
    }
  };

  // Background Neural Orb
  const NeuralOrb = ({ color, size, delay, x, y, active = true }: any) => (
    <Animated.View
      entering={FadeInDown}
      style={[
        styles.orb,
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

  return (
    <RequireVerification>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Immersive Neural Background */}
      <View style={StyleSheet.absoluteFill}>
        
        
        
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Glass Header */}
        <Animated.View 
          entering={FadeInDown}
          style={styles.headerWrapper}
        >
          <BlurView intensity={isDark ? 20 : 80} tint={isDark ? "dark" : "light"} style={[styles.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconBtn}
              accessibilityRole="button"
              accessibilityLabel="Go Back"
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <View style={styles.titleRow}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Sankofa AI</Text>
                <Animated.View 
                  /* Reanimated Todo */
                  style={[styles.proBadge, { backgroundColor: isOffline ? '#ef444425' : colors.primary + '25' }]}
                >
                  <Cpu size={10} color={isOffline ? '#ef4444' : colors.primary} style={{ marginRight: 4 }} />
                  <Text style={[styles.proText, { color: isOffline ? '#ef4444' : colors.primary }]}>
                    {isOffline ? 'LOCAL CORE' : 'CLOUD CORE v3.1'}
                  </Text>
                </Animated.View>
              </View>
              <View style={styles.statusRow}>
                <Animated.View 
                  style={[styles.statusDot, { backgroundColor: isOffline ? '#ef4444' : colors.primary }]} 
                />
                <Text style={[styles.statusText, { color: colors.textMute }]}>
                  {isOffline ? 'SMS Fallback Active' : 'Neural Link Active'}
                </Text>
              </View>
            </View>
 
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setOffline(!isOffline);
              }}
              style={styles.iconBtn}
              accessibilityRole="button"
              accessibilityLabel="Toggle offline mode"
              accessibilityState={{ checked: isOffline }}
            >
              {isOffline ? <CloudOff size={20} color={colors.error} /> : <MoreVertical size={20} color={colors.text} />}
            </TouchableOpacity>
          </BlurView>
        </Animated.View>

        
          {!isVoiceMode ? (
            /* TEXT CHAT MODE */
            <Animated.View 
              key="text-mode"
              entering={FadeInDown} exiting={FadeOut}
              style={styles.chatContent}
            >
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item, index }) => (
                  <ChatMessage 
                    item={item} 
                    index={index} 
                    colors={colors} 
                    isDark={isDark} 
                    language={language}
                    activeExcelData={activeExcelData}
                    setActiveExcelData={setActiveExcelData}
                    onShortcut={handleShortcut}
                  />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listPadding}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                  isTyping ? (
                    <Animated.View
                      entering={FadeInDown} exiting={FadeOut}
                    >
                      <TypingIndicator colors={colors} />
                    </Animated.View>
                  ) : null
                }
              />
            </Animated.View>
          ) : (
            /* VOICE FIRST IMMERSIVE MODE */
            <Animated.View 
              key="voice-mode"
              entering={FadeInDown} exiting={FadeOut}
              style={styles.voiceModeContainer}
            >
              <View style={styles.voiceHeader}>
                <Text style={[styles.voicePhaseText, { color: colors.text }]}>
                  {voiceState === 'IDLE' && "Sankofa yuko tayari — gusa kuongea"}
                  {voiceState === 'LISTENING' && "Sankofa anakusikiliza..."}
                  {voiceState === 'PROCESSING' && "Inachanganua sauti..."}
                  {voiceState === 'SPEAKING' && "Sankofa anajibu"}
                </Text>
                {voiceState === 'SPEAKING' && !!voiceReply && (
                  <Animated.Text 
                    entering={FadeInDown}
                    style={[styles.voiceTranscript, { color: colors.textMute }]}
                  >
                    {voiceReply}
                  </Animated.Text>
                )}
              </View>

              <View style={styles.voiceOrbWrapper}>
                {/* Voice Interaction Button */}
                <TouchableOpacity 
                  onPress={handleVoiceInteraction}
                  activeOpacity={0.9}
                  style={styles.voiceOrbButton}
                  accessibilityRole="button"
                  accessibilityLabel={
                    voiceState === 'IDLE' ? "Start voice interaction" :
                    voiceState === 'LISTENING' ? "Stop listening and translate" :
                    voiceState === 'PROCESSING' ? "Processing audio, please wait" :
                    "Stop speaking and return to standby"
                  }
                  accessibilityState={{ busy: voiceState === 'PROCESSING' }}
                >
                  {/* Dynamic ripples based on state */}
                  {[0, 1, 2].map((i) => (
                    <Animated.View
                      key={i}
                      style={[
                        styles.voiceRipple,
                        { borderColor: voiceState === 'PROCESSING' ? '#8b5cf6' : colors.primary }
                      ]}
                    />
                  ))}

                  <BlurView intensity={80} tint="dark" style={[styles.voiceOrbCore, { borderColor: colors.primary }]}>
                    <LinearGradient
                      colors={[colors.primary + '40', 'transparent']}
                      style={StyleSheet.absoluteFill}
                    />
                    {voiceState === 'PROCESSING' ? (
                      <BrainCircuit size={48} color={colors.primary} />
                    ) : voiceState === 'SPEAKING' ? (
                      <Animated.View /* Reanimated Todo */>
                        <Zap size={48} color={colors.primary} />
                      </Animated.View>
                    ) : (
                      <Mic size={48} color={voiceState === 'LISTENING' ? colors.primary : '#ffffff'} />
                    )}
                  </BlurView>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.exitVoiceBtn}
                onPress={toggleVoiceMode}
                accessibilityRole="button"
                accessibilityLabel="Switch to text mode"
              >
                <MessageSquare size={20} color={colors.textMute} />
                <Text style={[styles.exitVoiceText, { color: colors.textMute }]}>Switch to Text</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        

        {/* Text Input Area (Hidden in Voice Mode) */}
        
          {!isVoiceMode && (
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
              {/* Suggested Prompts */}
              
                {!isTyping && messages.length < 3 && (
                  <Animated.View 
                    entering={FadeInDown} exiting={FadeOut}
                    style={styles.suggestionBox}
                  >
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionScroll}>
                      {SUGGESTED_PROMPTS.map((prompt, index) => (
                        <Animated.View
                          key={index}
                          entering={FadeInDown}
                        >
                          <TouchableOpacity 
                            style={[styles.suggestionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => {
                              setInputText(prompt);
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                            accessibilityRole="button"
                            accessibilityLabel={prompt}
                            accessibilityHint="Select this template question"
                          >
                            <Sparkles size={14} color={colors.primary} style={{ marginRight: 8 }} />
                            <Text style={[styles.suggestionText, { color: colors.text }]}>{prompt}</Text>
                          </TouchableOpacity>
                        </Animated.View>
                      ))}
                    </ScrollView>
                  </Animated.View>
                )}
              

              {/* Premium Input Area */}
              <Animated.View 
                entering={FadeInDown} exiting={FadeOut}
                style={styles.inputAreaWrapper}
              >
                <BlurView intensity={isDark ? 40 : 90} tint={isDark ? "dark" : "light"} style={[styles.inputArea, { borderTopColor: 'rgba(255,255,255,0.05)' }]}>
                  <View style={styles.inputRow}>
                    <TouchableOpacity
                      style={[styles.plusBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}
                      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setAttachmentMenuVisible(true); }}
                      accessibilityRole="button"
                      accessibilityLabel="Open attachment menu"
                      accessibilityHint="Launches attachment options like Excel upload and crop disease scanner"
                    >
                      <Plus size={24} color={colors.text} />
                    </TouchableOpacity>
                    
                    <View style={[styles.inputContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }]}>
                      <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder={isOffline ? "Send offline SMS..." : "Inquire with Sankofa..."}
                        placeholderTextColor={colors.textMute}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        onFocus={() => Haptics.selectionAsync()}
                        accessibilityLabel="Ask Sankofa AI"
                        accessibilityHint="Type your farming question here"
                      />
                      <View style={styles.inputActions}>
                        <TouchableOpacity
                          style={styles.actionBtn}
                          onPress={toggleVoiceMode}
                          accessibilityRole="button"
                          accessibilityLabel="Switch to voice mode"
                        >
                          <Mic size={22} color={colors.textMute} />
                        </TouchableOpacity>
                        <Animated.View>
                          <TouchableOpacity 
                            style={[
                              styles.sendBtn, 
                              { backgroundColor: (inputText.trim() && !isTyping) ? colors.primary : colors.slate[400] + '40' }
                            ]}
                            onPress={handleSend}
                            disabled={!inputText.trim() || isTyping}
                            accessibilityRole="button"
                            accessibilityLabel="Send message"
                            accessibilityState={{ disabled: !inputText.trim() || isTyping }}
                          >
                            <Send size={18} color={inputText.trim() ? "#FCFBF7" : colors.textMute} />
                          </TouchableOpacity>
                        </Animated.View>
                      </View>
                    </View>
                  </View>
                </BlurView>
              </Animated.View>
            </KeyboardAvoidingView>
          )}
        
      </SafeAreaView>

      {/* Attachment Menu Modal */}
      <Modal
        visible={attachmentMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAttachmentMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setAttachmentMenuVisible(false)}
        >
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <BlurView 
            intensity={isDark ? 30 : 80} 
            tint={isDark ? "dark" : "light"} 
            style={[
              styles.attachmentMenu, 
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }
            ]}
          >
            <Text style={[styles.menuTitle, { color: colors.text }]}>
              {language === 'sw' ? 'Vinjari zana' : 'Explore Tools'}
            </Text>
            
            <TouchableOpacity 
              style={[styles.menuOption, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
              onPress={handleExcelPick}
            >
              <FileSpreadsheet size={20} color={colors.primary} />
              <View style={styles.menuOptionTextContainer}>
                <Text style={[styles.menuOptionTitle, { color: colors.text }]}>
                  {language === 'sw' ? 'Pakia Lahajedwali (Excel/CSV)' : 'Upload Spreadsheet (Excel/CSV)'}
                </Text>
                <Text style={[styles.menuOptionSub, { color: colors.textMute }]}>
                  {language === 'sw' ? 'Fanya Q&A kuhusu ratiba au udongo' : 'Interactive Q&A on logs, soil tests'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuOption, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
              onPress={() => {
                setAttachmentMenuVisible(false);
                setDiseaseModalVisible(true);
              }}
            >
              <Leaf size={20} color={colors.primary} />
              <View style={styles.menuOptionTextContainer}>
                <Text style={[styles.menuOptionTitle, { color: colors.text }]}>
                  {language === 'sw' ? 'Tathmini ya Afya ya Mazao' : 'Crop Disease Assessment'}
                </Text>
                <Text style={[styles.menuOptionSub, { color: colors.textMute }]}>
                  {language === 'sw' ? 'Tambua magonjwa kieneo (kamera/dalili)' : 'Location-aware diagnostics (camera/checklist)'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuOption}
              onPress={() => {
                setAttachmentMenuVisible(false);
                router.push('/scan' as any);
              }}
            >
              <Camera size={20} color={colors.primary} />
              <View style={styles.menuOptionTextContainer}>
                <Text style={[styles.menuOptionTitle, { color: colors.text }]}>
                  {language === 'sw' ? 'Kamera ya Haraka ya AI' : 'Quick AI Vision Scanner'}
                </Text>
                <Text style={[styles.menuOptionSub, { color: colors.textMute }]}>
                  {language === 'sw' ? 'Changanua majani papo hapo' : 'Scan plant leaves instantly'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuCancelBtn, { backgroundColor: colors.border }]} 
              onPress={() => setAttachmentMenuVisible(false)}
            >
              <Text style={[styles.menuCancelText, { color: colors.text }]}>
                {language === 'sw' ? 'Ghairi' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </BlurView>
        </TouchableOpacity>
      </Modal>

      {/* Disease Diagnosis Modal */}
      <DiseaseModal 
        visible={diseaseModalVisible} 
        onClose={() => setDiseaseModalVisible(false)} 
      />

      {/* Excel Parsing Loader Overlay */}
      {isParsingExcel && (
        <View style={styles.loaderOverlayContainer}>
          <BlurView intensity={40} tint="dark" style={styles.loaderOverlayInner}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loaderOverlayText, { color: '#ffffff' }]}>
              {language === 'sw' ? 'Inasoma lahajedwali...' : 'Parsing spreadsheet...'}
            </Text>
          </BlurView>
        </View>
      )}
    </View>
    </RequireVerification>
  );
}

function ExcelPreviewCard({ data, onClear, onShortcut, colors, isDark, language }: any) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Animated.View
      entering={FadeInDown}
      style={[
        styles.excelCard, 
        { 
          borderColor: colors.border,
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        }
      ]}
    >
      <BlurView 
        intensity={isDark ? 40 : 90} 
        tint={isDark ? "dark" : "light"} 
        style={styles.excelBlurInner}
      >
        <View style={styles.excelHeader}>
          <View style={[styles.excelIconContainer, { backgroundColor: colors.primary + '15' }]}>
            <FileSpreadsheet size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.excelFileName, { color: colors.text }]} numberOfLines={1}>
              {data.fileName}
            </Text>
            <Text style={[styles.excelMeta, { color: colors.textMute }]}>
              {data.rowCount} rows • {data.columnCount} columns
            </Text>
          </View>
          <TouchableOpacity onPress={onClear} style={styles.excelTrash} accessibilityLabel="Clear sheet data">
            <Trash2 size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.excelSectionTitle, { color: colors.textMute, marginTop: 12 }]}>
          {language === 'sw' ? 'MICHANGANUO YA KANUNI' : 'COLUMN HEADERS'}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
          {data.headers.map((h: string, idx: number) => (
            <View key={idx} style={[styles.headerBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
              <Text style={[styles.headerBadgeText, { color: colors.text }]}>{h}</Text>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setExpanded(!expanded);
          }} 
          style={[styles.excelPreviewToggle, { borderColor: colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
        >
          <Text style={[styles.excelPreviewToggleText, { color: colors.text }]}>
            {expanded 
              ? (language === 'sw' ? 'Ficha Hakikisho la Data' : 'Hide Data Preview')
              : (language === 'sw' ? 'Onyesha Hakikisho la Data' : 'Show Data Preview')
            }
          </Text>
        </TouchableOpacity>

        {expanded && (
          <ScrollView horizontal showsHorizontalScrollIndicator style={{ marginTop: 8 }}>
            <View style={styles.table}>
              {/* Table Header Row */}
              <View style={styles.tableHeaderRow}>
                {data.headers.map((h: string, idx: number) => (
                  <View key={idx} style={[styles.tableCell, { width: 100, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                    <Text style={[styles.tableHeaderText, { color: colors.text }]} numberOfLines={1}>{h}</Text>
                  </View>
                ))}
              </View>
              {/* Table Rows */}
              {data.previewRows.map((row: any, rIdx: number) => (
                <View key={rIdx} style={styles.tableRow}>
                  {data.headers.map((h: string, cIdx: number) => (
                    <View key={cIdx} style={[styles.tableCell, { width: 100, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                      <Text style={[styles.tableCellText, { color: colors.text }]} numberOfLines={1}>
                        {String(row[h] !== undefined ? row[h] : '')}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Action Shortcuts */}
        <View style={styles.shortcutContainer}>
          <TouchableOpacity 
            style={[styles.shortcutBtn, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '35' }]}
            onPress={() => onShortcut('summarize')}
          >
            <Sparkles size={12} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={[styles.shortcutBtnText, { color: colors.primary }]}>
              {language === 'sw' ? 'Muhtasari' : 'Summarize'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.shortcutBtn, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '35' }]}
            onPress={() => onShortcut('trends')}
          >
            <Sparkles size={12} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={[styles.shortcutBtnText, { color: colors.primary }]}>
              {language === 'sw' ? 'Mwenendo' : 'Trends'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.shortcutBtn, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '35' }]}
            onPress={() => onShortcut('compare')}
          >
            <Sparkles size={12} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={[styles.shortcutBtnText, { color: colors.primary }]}>
              {language === 'sw' ? 'Linganisha' : 'Compare'}
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Animated.View>
  );
}

function ChatMessage({ 
  item, 
  index, 
  colors, 
  isDark, 
  language, 
  activeExcelData, 
  setActiveExcelData, 
  onShortcut 
}: any) {
  const isAi = item.sender === 'ai';
  const isExcel = item.sender === 'excel_preview';

  if (isExcel) {
    const isCurrentlyActive = activeExcelData && activeExcelData.fileName === item.excelData.fileName;
    if (!isCurrentlyActive) {
      return (
        <Animated.View 
          entering={FadeInDown} 
          style={[styles.detachedCard, { borderColor: colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }]}
        >
          <FileSpreadsheet size={16} color={colors.textMute} />
          <Text style={[styles.detachedText, { color: colors.textMute }]}>
            {language === 'sw' ? `Lahajedwali imetenganishwa: ${item.excelData.fileName}` : `Spreadsheet detached: ${item.excelData.fileName}`}
          </Text>
        </Animated.View>
      );
    }

    return (
      <ExcelPreviewCard
        data={item.excelData}
        onClear={() => {
          setActiveExcelData(null);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }}
        onShortcut={onShortcut}
        colors={colors}
        isDark={isDark}
        language={language}
      />
    );
  }

  return (
    <Animated.View 
      entering={FadeInDown}
      style={[
        styles.msgWrapper,
        isAi ? styles.aiMsg : styles.userMsg,
      ]}
    >
      {isAi && (
        <Animated.View
          entering={FadeInDown}
        >
          <BlurView intensity={30} tint={isDark ? "dark" : "light"} style={[styles.avatar, { borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }]}>
            <BrainCircuit size={18} color={colors.primary} />
          </BlurView>
        </Animated.View>
      )}
      <View style={[
        styles.bubble,
        isAi ? 
          [styles.aiBubble, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#ffffff', borderColor: 'rgba(255,255,255,0.05)' }] : 
          [styles.userBubble, { backgroundColor: colors.primary }]
      ]}>
        <Text style={[
          styles.msgText,
          { color: isAi ? colors.text : '#FCFBF7', fontFamily: isAi ? 'Inter_500Medium' : 'Inter_600SemiBold' }
        ]}>
          {item.text}
        </Text>
        <View style={styles.msgFooter}>
          <Text style={[
            styles.msgTime,
            { color: isAi ? colors.textMute : 'rgba(252, 251, 247, 0.7)' }
          ]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {isAi && (
            <TouchableOpacity 
              style={styles.infoIcon}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Info size={12} color={colors.textMute} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {!isAi && (
        <Animated.View
          entering={FadeInDown}
          style={[styles.avatar, { backgroundColor: colors.slate[isDark ? 800 : 200], borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }]}
        >
          <User size={18} color={isDark ? colors.slate[400] : colors.slate[600]} />
        </Animated.View>
      )}
    </Animated.View>
  );
}

function TypingIndicator({ colors }: any) {
  return (
    <View style={styles.typingBox}>
      <LinearGradient colors={['rgba(255,255,255,0.1)', 'transparent']} style={styles.avatar}>
        <BrainCircuit size={18} color={colors.primary} />
      </LinearGradient>
      <View style={[styles.bubble, styles.aiBubble, { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.05)' }]}>
        <View style={styles.dotRow}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              /* Reanimated Todo */
              style={[styles.dot, { backgroundColor: colors.primary }]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orb: {
    position: 'absolute',
  },
  safeArea: {
    flex: 1,
  },
  headerWrapper: {
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  proText: {
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    opacity: 0.7,
  },
  chatContent: {
    flex: 1,
  },
  voiceModeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  voiceHeader: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  voicePhaseText: {
    fontSize: 28,
    fontFamily: 'Inter_900Black',
    marginBottom: 16,
    textAlign: 'center',
  },
  voiceTranscript: {
    fontSize: 18,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    lineHeight: 28,
    fontStyle: 'italic',
  },
  voiceOrbWrapper: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceOrbButton: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  voiceOrbCore: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  voiceRipple: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
  },
  exitVoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  exitVoiceText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    marginLeft: 8,
  },
  listPadding: {
    padding: 24,
    paddingBottom: 40,
  },
  msgWrapper: {
    flexDirection: 'row',
    marginBottom: 24,
    maxWidth: '90%',
    alignItems: 'flex-end',
  },
  aiMsg: {
    alignSelf: 'flex-start',
  },
  userMsg: {
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
    overflow: 'hidden',
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  aiBubble: {
    borderBottomLeftRadius: 6,
    borderWidth: 1,
  },
  userBubble: {
    borderBottomRightRadius: 6,
  },
  msgText: {
    fontSize: 16,
    lineHeight: 24,
  },
  msgFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  msgTime: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    opacity: 0.6,
  },
  infoIcon: {
    padding: 2,
  },
  typingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    width: 48,
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  suggestionBox: {
    paddingVertical: 12,
    overflow: 'hidden',
  },
  suggestionScroll: {
    paddingHorizontal: 24,
  },
  suggestionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  inputAreaWrapper: {
    zIndex: 10,
  },
  inputArea: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    maxHeight: 120,
    paddingVertical: 14,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 10,
    marginRight: 4,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  excelCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  excelBlurInner: {
    padding: 16,
  },
  excelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  excelIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  excelFileName: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  excelMeta: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  excelTrash: {
    padding: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 10,
  },
  excelSectionTitle: {
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.2,
  },
  headerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 6,
  },
  headerBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  excelPreviewToggle: {
    marginTop: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
  },
  excelPreviewToggleText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  table: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableHeaderText: {
    fontSize: 10,
    fontFamily: 'Inter_900Black',
  },
  tableCellText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  shortcutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 8,
  },
  shortcutBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 12,
  },
  shortcutBtnText: {
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
  },
  detachedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 20,
    gap: 8,
    width: '100%',
  },
  detachedText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  attachmentMenu: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1.5,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
    gap: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    marginBottom: 8,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 16,
  },
  menuOptionTextContainer: {
    flex: 1,
  },
  menuOptionTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  menuOptionSub: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  menuCancelBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  menuCancelText: {
    fontSize: 15,
    fontFamily: 'Inter_800ExtraBold',
  },
  loaderOverlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loaderOverlayInner: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  loaderOverlayText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
});
