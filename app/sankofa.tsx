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
  Fingerprint
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';
import { motion, AnimatePresence } from "motion/react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SUGGESTED_PROMPTS = [
  "Check crop health",
  "Pest diagnosis",
  "Market price trends",
  "Weather forecast"
];

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Background Orb Component using motion/react
const NeuralOrb = ({ color, size, delay, x, y }: any) => {
  return (
    <motion.View
      initial={{ x, y, opacity: 0, scale: 0.8 }}
      animate={{ 
        x: [x, x + 60, x - 40, x],
        y: [y, y - 80, y + 50, y],
        opacity: [0.15, 0.25, 0.18, 0.15],
        scale: [1, 1.2, 0.9, 1]
      }}
      transition={{
        duration: 15 + delay / 1000,
        repeat: Infinity,
        ease: "easeInOut",
      }}
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
};

export default function SankofaScreen() {
  const router = useRouter();
  const { colors, spacing, radius, isDark } = useTheme();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Sankofa AI, your neural agricultural advisor. My sensors are calibrated and ready to optimize your yield. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Mock AI Response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Analyzing your request... Based on my recent data ingestion, your local soil moisture is slightly below the 15% threshold. I recommend a 20-minute irrigation cycle before sunset to maximize absorption.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [messages, isTyping]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Neural Background Orbs */}
      <View style={StyleSheet.absoluteFill}>
        <NeuralOrb color={colors.primary} size={350} delay={0} x={-120} y={-80} />
        <NeuralOrb color="#3b82f6" size={300} delay={2000} x={SCREEN_WIDTH - 180} y={220} />
        <NeuralOrb color={colors.primary} size={250} delay={4000} x={30} y={SCREEN_HEIGHT - 300} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Glass Header */}
        <motion.View 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          style={styles.headerWrapper}
        >
          <BlurView intensity={isDark ? 20 : 80} tint={isDark ? "dark" : "light"} style={[styles.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <View style={styles.titleRow}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Sankofa AI</Text>
                <motion.View 
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={[styles.proBadge, { backgroundColor: colors.primary + '25' }]}
                >
                  <Cpu size={10} color={colors.primary} style={{ marginRight: 4 }} />
                  <Text style={[styles.proText, { color: colors.primary }]}>CORE v2.5</Text>
                </motion.View>
              </View>
              <View style={styles.statusRow}>
                <motion.View 
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={[styles.statusDot, { backgroundColor: colors.primary }]} 
                />
                <Text style={[styles.statusText, { color: colors.textMute }]}>Neural Link Active</Text>
              </View>
            </View>
 
            <TouchableOpacity style={styles.iconBtn}>
              <MoreVertical size={20} color={colors.text} />
            </TouchableOpacity>
          </BlurView>
        </motion.View>

        <View style={styles.chatContent}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item, index }) => (
              <ChatMessage 
                item={item} 
                index={index} 
                colors={colors} 
                isDark={isDark} 
              />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <AnimatePresence>
                {isTyping && (
                  <motion.View
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <TypingIndicator colors={colors} />
                  </motion.View>
                )}
              </AnimatePresence>
            }
          />
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          {/* Suggested Prompts */}
          <AnimatePresence>
            {!isTyping && messages.length < 3 && (
              <motion.View 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={styles.suggestionBox}
              >
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionScroll}>
                  {SUGGESTED_PROMPTS.map((prompt, index) => (
                    <motion.View
                      key={index}
                      initial={{ opacity: 0, scale: 0.9, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <TouchableOpacity 
                        style={[styles.suggestionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => {
                          setInputText(prompt);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                      >
                        <Sparkles size={14} color={colors.primary} style={{ marginRight: 8 }} />
                        <Text style={[styles.suggestionText, { color: colors.text }]}>{prompt}</Text>
                      </TouchableOpacity>
                    </motion.View>
                  ))}
                </ScrollView>
              </motion.View>
            )}
          </AnimatePresence>

          {/* Premium Input Area */}
          <motion.View 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            style={styles.inputAreaWrapper}
          >
            <BlurView intensity={isDark ? 30 : 90} tint={isDark ? "dark" : "light"} style={[styles.inputArea, { borderTopColor: colors.border }]}>
              <View style={styles.inputRow}>
                <TouchableOpacity style={[styles.plusBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                  <Plus size={22} color={colors.text} />
                </TouchableOpacity>
                
                <View style={[styles.inputContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)', borderColor: colors.border, borderWidth: 1 }]}>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Inquire with Sankofa..."
                    placeholderTextColor={colors.textMute}
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    onFocus={() => Haptics.selectionAsync()}
                  />
                  <View style={styles.inputActions}>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Mic size={20} color={colors.textMute} />
                    </TouchableOpacity>
                    <motion.View
                      animate={{ 
                        scale: inputText.trim() ? 1 : 0.9,
                        opacity: inputText.trim() ? 1 : 0.6
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <TouchableOpacity 
                        style={[
                          styles.sendBtn, 
                          { backgroundColor: inputText.trim() ? colors.primary : colors.slate[400] + '40' }
                        ]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                      >
                        <Send size={18} color={inputText.trim() ? "#000" : colors.textMute} />
                      </TouchableOpacity>
                    </motion.View>
                  </View>
                </View>
              </View>
            </BlurView>
          </motion.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function ChatMessage({ item, index, colors, isDark }: any) {
  const isAi = item.sender === 'ai';

  return (
    <motion.View 
      layout
      initial={{ opacity: 0, x: isAi ? -30 : 30, y: 15, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 22, stiffness: 150 }}
      style={[
        styles.msgWrapper,
        isAi ? styles.aiMsg : styles.userMsg,
      ]}
    >
      {isAi && (
        <motion.View
          initial={{ rotate: -45, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", damping: 15, delay: 0.2 }}
        >
          <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={[styles.avatar, { borderColor: colors.border, borderWidth: 1 }]}>
            <BrainCircuit size={16} color={colors.primary} />
          </BlurView>
        </motion.View>
      )}
      <View style={[
        styles.bubble,
        isAi ? 
          [styles.aiBubble, { backgroundColor: colors.card, borderColor: colors.border }] : 
          [styles.userBubble, { backgroundColor: colors.primary }]
      ]}>
        <Text style={[
          styles.msgText,
          { color: isAi ? colors.text : '#000', fontFamily: isAi ? 'Inter_500Medium' : 'Inter_600SemiBold' }
        ]}>
          {item.text}
        </Text>
        <View style={styles.msgFooter}>
          <Text style={[
            styles.msgTime,
            { color: isAi ? colors.textMute : 'rgba(0,0,0,0.5)' }
          ]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {isAi && (
            <TouchableOpacity style={styles.infoIcon}>
              <Info size={10} color={colors.textMute} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {!isAi && (
        <motion.View
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, delay: 0.2 }}
          style={[styles.avatar, { backgroundColor: colors.slate[isDark ? 800 : 200], borderColor: colors.border, borderWidth: 1 }]}
        >
          <User size={16} color={isDark ? colors.slate[400] : colors.slate[600]} />
        </motion.View>
      )}
    </motion.View>
  );
}

function TypingIndicator({ colors }: any) {
  return (
    <View style={styles.typingBox}>
      <LinearGradient colors={['#171717', '#333333']} style={styles.avatar}>
        <BrainCircuit size={16} color={colors.primary} />
      </LinearGradient>
      <View style={[styles.bubble, styles.aiBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.dotRow}>
          {[0, 1, 2].map((i) => (
            <motion.View
              key={i}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
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
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 10,
  },
  proText: {
    fontSize: 9,
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
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    opacity: 0.6,
  },
  chatContent: {
    flex: 1,
  },
  listPadding: {
    padding: 20,
    paddingBottom: 30,
  },
  msgWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    maxWidth: '88%',
    alignItems: 'flex-end',
  },
  aiMsg: {
    alignSelf: 'flex-start',
  },
  userMsg: {
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginLeft: 8,
  },
  bubble: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  msgText: {
    fontSize: 15,
    lineHeight: 22,
  },
  msgFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  msgTime: {
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    opacity: 0.5,
  },
  infoIcon: {
    padding: 2,
  },
  typingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    width: 40,
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 3,
  },
  suggestionBox: {
    paddingVertical: 12,
    overflow: 'hidden',
  },
  suggestionScroll: {
    paddingHorizontal: 20,
  },
  suggestionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  inputAreaWrapper: {
    zIndex: 10,
  },
  inputArea: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopWidth: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    maxHeight: 100,
    paddingVertical: 12,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 8,
    marginRight: 4,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
