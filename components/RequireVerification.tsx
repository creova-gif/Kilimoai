import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useKilimoStore } from '../store/useKilimoStore';
import { Button } from './ui/Button';
import { GlassCard } from './PageScaffold';
import { useTheme } from '../constants/Theme';
import * as Haptics from 'expo-haptics';

export function RequireVerification({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const router = useRouter();
  const agroId = useKilimoStore((s) => s.agroId);
  const language = useKilimoStore((s) => s.language);
  const status = agroId?.verificationStatus || 'unverified';

  if (status === 'verified') {
    return <>{children}</>;
  }

  const handleGoHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Navigate back to the home tab where the activation scanner card is visible.
    router.replace('/(tabs)');
  };

  const title = language === 'sw'
    ? (status === 'pending' ? 'Uhakiki Unasubiriwa' : 'Uhakiki Unahitajika')
    : (status === 'pending' ? 'Verification Pending' : 'Verification Required');

  const body = language === 'sw'
    ? (status === 'pending'
      ? 'Kitambulisho chako kinakaguliwa kwa sasa. Kipengele hiki kitafunguliwa kiotomatiki mara kitakapothibitishwa shambani.'
      : 'Ili kulinda jamii na kufuata kanuni za Kilimo AI, lazima uhakiki kitambulisho chako ili kupata huduma hii.')
    : (status === 'pending'
      ? 'Your identity is currently under review. This feature will unlock automatically once approved.'
      : 'To protect the community and comply with Kilimo AI guidelines, you must verify your identity to access this feature.');

  const btnLabel = language === 'sw'
    ? 'Nenda Nyumbani Kuwezesha'
    : 'Go to Home to Activate';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GlassCard style={styles.card}>
        <View style={styles.iconWrap}>
          <ShieldAlert size={48} color={colors.warning} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.body, { color: colors.textMute }]}>{body}</Text>
        
        <Button
          label={btnLabel}
          onPress={handleGoHome}
          style={{ marginTop: 24, width: '100%' }}
        />
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  card: { padding: 24, alignItems: 'center', width: '100%', maxWidth: 340 },
  iconWrap: { marginBottom: 16 },
  title: { fontSize: 18, fontFamily: 'Inter_800ExtraBold', marginBottom: 12, textAlign: 'center' },
  body: { fontSize: 14, fontFamily: 'Inter_500Medium', textAlign: 'center', lineHeight: 22 },
});
