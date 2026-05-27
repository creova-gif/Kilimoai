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
  ImageBackground
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
  MessageSquare
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
  sender: 'user' | 'ai';
  timestamp: Date;
}

type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING';

export default function SankofaScreen() {
  const router = useRouter();
  const { colors, spacing, radius, isDark } = useTheme();
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const addNotification = useKilimoStore((s) => s.addNotification);

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
      if (!aiConfigured()) {
        reply = await demoChat(trimmed);
      } else {
        const history: AIChatMessage[] = snapshot.slice(-16).map((m) => ({
          role: m.sender === 'ai' ? 'assistant' : 'user',
          content: m.text,
        }));
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
                setIsOffline(!isOffline);
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
                  <ChatMessage item={item} index={index} colors={colors} isDark={isDark} />
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
                      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/scan' as any); }}
                      accessibilityRole="button"
                      accessibilityLabel="Open crop disease scanner"
                      accessibilityHint="Launches camera to diagnose plant leaf diseases"
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
    </View>
    </RequireVerification>
  );
}

function ChatMessage({ item, index, colors, isDark }: any) {
  const isAi = item.sender === 'ai';

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
            <TouchableOpacity style={styles.infoIcon}>
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
});
