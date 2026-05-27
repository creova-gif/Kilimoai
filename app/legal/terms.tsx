import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { FileText } from 'lucide-react-native';
import PageScaffold, { GlassCard } from '../../components/PageScaffold';
import { useTheme } from '../../constants/Theme';

export default function TermsOfService() {
  const { colors } = useTheme();

  return (
    <PageScaffold title="Vigezo na Masharti" subtitle="Terms of Service">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <FileText size={48} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Kilimo AI Terms of Service</Text>
          <Text style={[styles.lastUpdated, { color: colors.textMute }]}>Last Updated: May 2026</Text>
        </View>

        <GlassCard style={styles.card}>
          <Text style={[styles.heading, { color: colors.text }]}>1. Acceptance of Terms</Text>
          <Text style={[styles.body, { color: colors.textMute }]}>
            By accessing or using the Kilimo AI application, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </Text>

          <Text style={[styles.heading, { color: colors.text }]}>2. Eligibility and Verification</Text>
          <Text style={[styles.body, { color: colors.textMute }]}>
            Users must be at least 18 years old. Access to financial features (such as Smart Contracts and the Kilimo Wallet) requires successful identity verification using a valid NIDA ID or Passport.
          </Text>

          <Text style={[styles.heading, { color: colors.text }]}>3. Smart Contracts and Payments</Text>
          <Text style={[styles.body, { color: colors.textMute }]}>
            Kilimo AI acts as an intermediary facilitating smart contracts between farmers and buyers. We do not guarantee crop yields or market prices. All wallet transactions are subject to Mobile Network Operator (MNO) fees and processing times.
          </Text>

          <Text style={[styles.heading, { color: colors.text }]}>4. AI Advisory (Sankofa AI)</Text>
          <Text style={[styles.body, { color: colors.textMute }]}>
            Sankofa AI provides agricultural advice based on generative AI models and available agronomic data. This advice is provided "as is" and should not replace professional agronomic consultation or veterinary services in critical situations.
          </Text>

          <Text style={[styles.heading, { color: colors.text }]}>5. Limitation of Liability</Text>
          <Text style={[styles.body, { color: colors.textMute }]}>
            Kilimo AI shall not be liable for any indirect, incidental, or consequential damages resulting from crop failure, market fluctuations, or reliance on AI-generated advice.
          </Text>

          <Text style={[styles.heading, { color: colors.text }]}>6. Termination</Text>
          <Text style={[styles.body, { color: colors.textMute }]}>
            We reserve the right to suspend or terminate your account if you violate these terms, engage in fraudulent activities, or fail to comply with KYC regulations.
          </Text>
        </GlassCard>
      </ScrollView>
    </PageScaffold>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 64 },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 22, fontFamily: 'InstrumentSerif_400Regular', marginTop: 16, marginBottom: 4 },
  lastUpdated: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  card: { padding: 20 },
  heading: { fontSize: 16, fontFamily: 'Inter_800ExtraBold', marginTop: 24, marginBottom: 8 },
  body: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },
});
