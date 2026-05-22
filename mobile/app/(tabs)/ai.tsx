import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  Platform, KeyboardAvoidingView, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { tr } from '@/src/utils/translations';
import { API_BASE } from '@/src/lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIScreen() {
  const insets = useSafeAreaInsets();
  const { user, language } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: tr('aiGreeting', language),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const bottomInset = Platform.OS === 'web' ? 34 : insets.bottom;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [userMsg, ...prev]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ai_chat',
          message: text,
          language,
          userId: user?.id,
        }),
      });

      let reply = '';
      if (res.ok) {
        const json = await res.json();
        reply = json.response || json.message || 'I understand. Let me help you with that.';
      } else {
        reply = getFallbackResponse(text, language);
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      setMessages(prev => [aiMsg, ...prev]);
    } catch {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getFallbackResponse(text, language),
        timestamp: new Date(),
      };
      setMessages(prev => [aiMsg, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackResponse = (query: string, lang: 'en' | 'sw'): string => {
    const q = query.toLowerCase();
    if (q.includes('maize') || q.includes('corn') || q.includes('mahindi')) {
      return lang === 'sw'
        ? 'Mahindi yanahitaji mvua ya kutosha (500-800mm) wakati wa ukuaji. Weka mbolea ya nitrogen baada ya wiki 3. Angalia dalili za ugonjwa kama michirizi ya njano.'
        : 'Maize requires adequate rainfall (500-800mm) during growth. Apply nitrogen fertilizer after 3 weeks. Watch for signs of disease like yellow streaking.';
    }
    if (q.includes('weather') || q.includes('hali ya hewa') || q.includes('mvua')) {
      return lang === 'sw'
        ? 'Hali ya hewa leo: Joto 24°C, unyevu 68%. Mvua inatarajiwa wiki ijayo. Panga shughuli zako za shambani ipasavyo.'
        : 'Today\'s weather: 24°C, humidity 68%. Rain expected next week. Plan your farming activities accordingly.';
    }
    if (q.includes('price') || q.includes('bei') || q.includes('market') || q.includes('soko')) {
      return lang === 'sw'
        ? 'Bei za soko za leo: Mahindi KSh 45/kg (↑5%), Maharagwe KSh 120/kg (↑3%), Nyanya KSh 80/kg (↑9%). Bei zinazidi kuwa juu.'
        : 'Today\'s market prices: Maize KSh 45/kg (↑5%), Beans KSh 120/kg (↑3%), Tomatoes KSh 80/kg (↑9%). Prices trending upward.';
    }
    return lang === 'sw'
      ? 'Asante kwa swali lako. Kwa ushauri kamili zaidi kuhusu kilimo, tafadhali eleza hali yako zaidi. Naweza kukusaidia kuhusu magonjwa ya mazao, mbolea, mwagiliaji, au masoko.'
      : 'Thank you for your question. For more complete farming advice, please describe your situation in more detail. I can help with crop diseases, fertilizers, irrigation, or markets.';
  };

  const SUGGESTED = [
    { en: 'How to treat maize disease?', sw: 'Jinsi ya kutibu ugonjwa wa mahindi?' },
    { en: 'Best time to plant beans?', sw: 'Wakati mzuri wa kupanda maharagwe?' },
    { en: 'Current market prices', sw: 'Bei za soko za sasa' },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <View style={styles.aiAvatar}>
          <Ionicons name="leaf" size={20} color="#fff" />
        </View>
        <View>
          <Text style={styles.headerTitle}>{tr('sankofaAI', language)}</Text>
          <Text style={styles.headerSub}>
            {language === 'sw' ? 'Msaidizi wa Kilimo wa AI' : 'AI Agricultural Assistant'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.diagnosisBtn}
          onPress={() => router.push('/diagnosis')}
          activeOpacity={0.85}
        >
          <Ionicons name="camera" size={16} color="#fff" />
          <Text style={styles.diagnosisBtnText}>
            {language === 'sw' ? 'Chunguza' : 'Diagnose'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        inverted
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          loading ? (
            <View style={[styles.bubble, styles.aiBubble]}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : null
        }
        ListFooterComponent={
          messages.length === 1 ? (
            <View style={styles.suggestions}>
              {SUGGESTED.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.suggestionChip}
                  onPress={() => { setInput(s[language]); }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.suggestionText}>{s[language]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            {item.role === 'assistant' && (
              <View style={styles.aiBadge}>
                <Ionicons name="leaf" size={12} color={Colors.primary} />
              </View>
            )}
            <Text style={[styles.bubbleText, item.role === 'user' && styles.userBubbleText]}>
              {item.content}
            </Text>
          </View>
        )}
      />

      <View style={[styles.inputContainer, { paddingBottom: bottomInset + 10 }]}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder={tr('typeMessage', language)}
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    backgroundColor: Colors.primary, paddingHorizontal: 16, paddingBottom: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  aiAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700' as const, color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  headerBtn: { marginLeft: 'auto' as any },
  diagnosisBtn: {
    marginLeft: 'auto' as any, flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: Colors.radiusFull,
  },
  diagnosisBtnText: { fontSize: 13, fontWeight: '600' as const, color: '#fff' },
  messageList: { padding: 16, gap: 12 },
  bubble: {
    maxWidth: '82%', borderRadius: Colors.radiusLg, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  aiBubble: { backgroundColor: Colors.card, alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: Colors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBadge: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primaryMuted,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  bubbleText: { fontSize: 15, color: Colors.text, lineHeight: 22 },
  userBubbleText: { color: '#fff' },
  suggestions: { gap: 8, paddingBottom: 8 },
  suggestionChip: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.primary,
    borderRadius: Colors.radiusFull, paddingHorizontal: 14, paddingVertical: 10, alignSelf: 'flex-start',
  },
  suggestionText: { fontSize: 13, color: Colors.primary, fontWeight: '500' as const },
  inputContainer: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    paddingHorizontal: 16, paddingTop: 10,
    backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  textInput: {
    flex: 1, minHeight: 44, maxHeight: 100, fontSize: 15, color: Colors.text,
    backgroundColor: Colors.gray50, borderRadius: Colors.radiusLg,
    paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.gray300 },
});
