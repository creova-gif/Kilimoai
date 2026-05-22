import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Platform, Alert, KeyboardAvoidingView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { tr } from '@/src/utils/translations';
import { Button } from '@/src/components/ui/Button';

export default function OTPScreen() {
  const insets = useSafeAreaInsets();
  const { verifyOTP, signInWithPhone, language } = useAuth();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const refs = useRef<TextInput[]>([]);

  const topInset = Platform.OS === 'web' ? 67 : insets.top;

  const handleChange = (text: string, index: number) => {
    const val = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    if (val && index < 5) refs.current[index + 1]?.focus();
    if (!val && index > 0) refs.current[index - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) { Alert.alert('Error', 'Please enter the 6-digit code'); return; }
    setLoading(true);
    try {
      await verifyOTP(phone, code);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Verification Failed', e.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      refs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await signInWithPhone(phone);
      Alert.alert('Sent', `OTP sent to ${phone}`);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { paddingTop: topInset }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.body}>
          <View style={styles.iconCircle}>
            <Ionicons name="phone-portrait" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.title}>{tr('verifyOTP', language)}</Text>
          <Text style={styles.subtitle}>{tr('enterOTP', language)}</Text>
          <Text style={styles.phone}>{phone}</Text>

          <View style={styles.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={r => { if (r) refs.current[i] = r; }}
                style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                value={digit}
                onChangeText={t => handleChange(t, i)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <Button
            title={tr('verify', language)}
            onPress={handleVerify}
            loading={loading}
            fullWidth
            style={{ marginTop: 24, marginBottom: 16 }}
          />
          <TouchableOpacity onPress={handleResend} disabled={resending}>
            <Text style={styles.resendText}>
              {resending ? tr('loading', language) : tr('resendOTP', language)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 24 },
  backBtn: { marginBottom: 32, width: 40 },
  body: { alignItems: 'center' },
  iconCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 24, fontWeight: '700' as const, color: Colors.text, marginBottom: 12 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  phone: { fontSize: 16, fontWeight: '600' as const, color: Colors.primary, marginTop: 4, marginBottom: 32 },
  otpRow: { flexDirection: 'row', gap: 12 },
  otpBox: {
    width: 46, height: 56, borderRadius: Colors.radiusSm,
    borderWidth: 2, borderColor: Colors.border,
    fontSize: 22, fontWeight: '700' as const, color: Colors.text,
    textAlign: 'center', backgroundColor: Colors.gray50,
  },
  otpBoxFilled: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  resendText: { fontSize: 14, color: Colors.primary, fontWeight: '500' as const },
});
