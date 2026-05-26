import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock } from 'lucide-react-native';
import PageScaffold, { GlassCard } from '../../components/PageScaffold';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../constants/Theme';

export default function VerificationPending() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <PageScaffold title="Under Review" scroll={false}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Clock size={64} color="#f59e0b" />
        </View>
        
        <GlassCard style={styles.card}>
          <Text style={[styles.title, { color: colors.text }]}>Verification Pending</Text>
          <Text style={[styles.body, { color: colors.textMute }]}>
            Your identity documents have been submitted securely and are currently under review. This usually takes 24-48 hours.
          </Text>
        </GlassCard>

        <Button
          label="Return to Dashboard"
          variant="secondary"
          onPress={() => router.replace('/(tabs)')}
          style={{ marginTop: 32 }}
        />
      </View>
    </PageScaffold>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  iconWrap: { alignItems: 'center', marginBottom: 32 },
  card: { padding: 24, alignItems: 'center' },
  title: { fontSize: 20, fontFamily: 'Inter_900Black', marginBottom: 12 },
  body: { fontSize: 14, fontFamily: 'Inter_500Medium', textAlign: 'center', lineHeight: 22 },
});
