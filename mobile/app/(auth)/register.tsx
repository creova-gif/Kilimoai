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

const ROLES = [
  { id: 'smallholder_farmer', icon: 'leaf' as const, label: { en: 'Smallholder Farmer', sw: 'Mkulima Mdogo' } },
  { id: 'farmer', icon: 'grid' as const, label: { en: 'Commercial Farmer', sw: 'Mkulima wa Biashara' } },
  { id: 'extension_officer', icon: 'people' as const, label: { en: 'Extension Officer', sw: 'Afisa Ugani' } },
  { id: 'agribusiness', icon: 'business' as const, label: { en: 'Agribusiness', sw: 'Biashara ya Kilimo' } },
  { id: 'cooperative_leader', icon: 'albums' as const, label: { en: 'Cooperative', sw: 'Ushirika' } },
];

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { signUpWithEmail, language } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('smallholder_farmer');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email address';
    if (!password || password.length < 8) errs.password = 'Password must be at least 8 characters';
    return errs;
  };

  const handleRegister = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await signUpWithEmail(email, password, name, role);
      Alert.alert(
        language === 'en' ? 'Account Created' : 'Akaunti Imeundwa',
        language === 'en' ? 'Please check your email to verify your account.' : 'Tafadhali angalia barua pepe yako kuthibitisha akaunti.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to create account. Please try again.');
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

        <View style={styles.header}>
          <Text style={styles.title}>{tr('registerTitle', language)}</Text>
          <Text style={styles.subtitle}>{tr('registerSubtitle', language)}</Text>
        </View>

        <Input
          label={tr('fullName', language)} value={name}
          onChangeText={t => { setName(t); setErrors({}); }}
          placeholder={tr('namePlaceholder', language)}
          leftIcon="person-outline" error={errors.name}
        />
        <Input
          label={tr('email', language)} value={email}
          onChangeText={t => { setEmail(t); setErrors({}); }}
          placeholder={tr('emailPlaceholder', language)}
          keyboardType="email-address" autoCapitalize="none"
          leftIcon="mail-outline" error={errors.email}
        />
        <Input
          label={tr('password', language)} value={password}
          onChangeText={t => { setPassword(t); setErrors({}); }}
          placeholder="Min. 8 characters" isPassword
          leftIcon="lock-closed-outline" error={errors.password}
        />

        <Text style={styles.roleLabel}>{tr('selectRole', language)}</Text>
        <View style={styles.roleGrid}>
          {ROLES.map(r => (
            <TouchableOpacity
              key={r.id}
              style={[styles.roleCard, role === r.id && styles.roleCardActive]}
              onPress={() => setRole(r.id)}
              activeOpacity={0.8}
            >
              <Ionicons name={r.icon} size={24} color={role === r.id ? Colors.primary : Colors.textMuted} />
              <Text style={[styles.roleText, role === r.id && styles.roleTextActive]}>
                {r.label[language]}
              </Text>
              {role === r.id && (
                <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={styles.roleCheck} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Button title={tr('register', language)} onPress={handleRegister} loading={loading} fullWidth style={{ marginTop: 8 }} />

        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>{tr('alreadyHaveAccount', language)} </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginLink}>{tr('login', language)}</Text>
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
  header: { marginBottom: 28 },
  title: { fontSize: 26, fontWeight: '700' as const, color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.textSecondary },
  roleLabel: { fontSize: 14, fontWeight: '500' as const, color: Colors.text, marginBottom: 12 },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  roleCard: {
    flex: 1, minWidth: '45%', padding: 14, borderRadius: Colors.radius,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.gray50,
    alignItems: 'center', gap: 8, position: 'relative',
  },
  roleCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  roleText: { fontSize: 12, fontWeight: '500' as const, color: Colors.textMuted, textAlign: 'center' },
  roleTextActive: { color: Colors.primary, fontWeight: '600' as const },
  roleCheck: { position: 'absolute', top: 8, right: 8 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  loginPrompt: { fontSize: 14, color: Colors.textSecondary },
  loginLink: { fontSize: 14, color: Colors.primary, fontWeight: '600' as const },
});
