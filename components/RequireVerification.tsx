import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useKilimoStore } from '../store/useKilimoStore';
import { Button } from './ui/Button';
import { GlassCard } from './PageScaffold';
import { useTheme } from '../constants/Theme';

export function RequireVerification({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const router = useRouter();
  const agroId = useKilimoStore((s) => s.agroId);
  const status = agroId?.verificationStatus || 'unverified';

  if (status === 'verified') {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <GlassCard style={styles.card}>
        <View style={styles.iconWrap}>
          <ShieldAlert size={48} color="#f59e0b" />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>
          {status === 'pending' ? 'Verification Pending' : 'Verification Required'}
        </Text>
        <Text style={[styles.body, { color: colors.textMute }]}>
          {status === 'pending'
            ? 'Your identity is currently under review. This feature will unlock automatically once approved.'
            : 'To protect the community and comply with regulations, you must verify your identity to access financial features.'}
        </Text>
        
        {status === 'unverified' && (
          <Button
            label="Verify Identity Now"
            onPress={() => router.push('/verification/intro')}
            style={{ marginTop: 24, width: '100%' }}
          />
        )}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  card: { padding: 24, alignItems: 'center' },
  iconWrap: { marginBottom: 16 },
  title: { fontSize: 18, fontFamily: 'Inter_800ExtraBold', marginBottom: 12 },
  body: { fontSize: 14, fontFamily: 'Inter_500Medium', textAlign: 'center', lineHeight: 22 },
});
