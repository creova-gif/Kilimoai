import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { tr } from '@/src/utils/translations';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';

type Tab = 'email' | 'phone';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signInWithEmail, signInWithPhone, language } = useAuth();
  const [tab, setTab] = useState<Tab>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const validateEmail = () => {
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email address';
    if (!password) errs.password = 'Password is required';
    return errs;
  };

  const handleEmailLogin = async () => {
    const errs = validateEmail();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Login Failed', e.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (!phone) { setErrors({ phone: 'Phone number is required' }); return; }
    setLoading(true);
    try {
      await signInWithPhone(phone);
      router.push({ pathname: '/(auth)/otp', params: { phone } });
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={[styles.container, { paddingTop: topInset }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.brand}>
          <View style={styles.logo}>
            <Ionicons name="leaf" size={32} color="#fff" />
          </View>
          <Text style={styles.title}>{tr('loginTitle', language)}</Text>
          <Text style={styles.subtitle}>{tr('loginSubtitle', language)}</Text>
        </View>

        <View style={styles.tabs}>
          {(['email', 'phone'] as Tab[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => { setTab(t); setErrors({}); }}
            >
              <Ionicons
                name={t === 'email' ? 'mail-outline' : 'phone-portrait-outline'}
                size={16}
                color={tab === t ? Colors.primary : Colors.textMuted}
              />
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'email' ? tr('email', language) : tr('phone', language)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'email' ? (
          <View>
            <Input
              label={tr('email', language)}
              value={email}
              onChangeText={t => { setEmail(t); setErrors({}); }}
              placeholder={tr('emailPlaceholder', language)}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
              error={errors.email}
            />
            <Input
              label={tr('password', language)}
              value={password}
              onChangeText={t => { setPassword(t); setErrors({}); }}
              placeholder={tr('passwordPlaceholder', language)}
              isPassword
              leftIcon="lock-closed-outline"
              error={errors.password}
            />
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>{tr('forgotPassword', language)}</Text>
            </TouchableOpacity>
            <Button title={tr('login', language)} onPress={handleEmailLogin} loading={loading} fullWidth />
          </View>
        ) : (
          <View>
            <Input
              label={tr('phone', language)}
              value={phone}
              onChangeText={t => { setPhone(t); setErrors({}); }}
              placeholder={tr('phonePlaceholder', language)}
              keyboardType="phone-pad"
              leftIcon="phone-portrait-outline"
              error={errors.phone}
            />
            <Button title={language === 'en' ? 'Send OTP' : 'Tuma OTP'} onPress={handlePhoneLogin} loading={loading} fullWidth />
          </View>
        )}

        <View style={styles.signupRow}>
          <Text style={styles.signupPrompt}>{tr('noAccount', language)} </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.signupLink}>{tr('signUp', language)}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: { marginBottom: 24, width: 40 },
  brand: { alignItems: 'center', marginBottom: 32 },
  logo: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '700' as const, color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center' },
  tabs: {
    flexDirection: 'row', backgroundColor: Colors.gray100,
    borderRadius: Colors.radius, padding: 4, marginBottom: 24,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: Colors.radiusSm, gap: 6,
  },
  tabActive: { backgroundColor: Colors.background, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, color: Colors.textMuted, fontWeight: '500' as const },
  tabTextActive: { color: Colors.primary, fontWeight: '600' as const },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { fontSize: 13, color: Colors.primary, fontWeight: '500' as const },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  signupPrompt: { fontSize: 14, color: Colors.textSecondary },
  signupLink: { fontSize: 14, color: Colors.primary, fontWeight: '600' as const },
});
