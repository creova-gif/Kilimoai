import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { Shield } from 'lucide-react-native';
import PageScaffold, { GlassCard } from '../../components/PageScaffold';
import { useTheme } from '../../constants/Theme';

export default function PrivacyPolicy() {
  const { colors } = useTheme();

  return (
    <PageScaffold title="Sera ya Faragha" subtitle="Privacy Policy">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Shield size={48} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Kilimo AI Privacy Policy</Text>
          <Text style={[styles.lastUpdated, { color: colors.textMute }]}>Last Updated: May 2026</Text>
        </View>

        <GlassCard style={styles.card}>
          <Text style={[styles.heading, { color: colors.text }]}>1. Introduction</Text>
          <Text style={[styles.body, { color: colors.textMute }]}>
            Welcome to Kilimo AI. We respect your privacy and are committed to protecting your personal data in compliance with the Tanzania Personal Data Protection Act (PDPA) and other applicable regulations. This policy explains how we collect, use, and safeguard your information.
          </Text>

          <Text style={[styles.heading, { color: colors.text }]}>2. Data We Collect</Text>
          <Text style={[styles.body, { color: colors.textMute }]}>
            • <Text style={{ fontFamily: 'Inter_700Bold' }}>Personal Identity:</Text> Name, phone number, NIDA/Passport details (for verified accounts).{'\n'}
            • <Text style={{ fontFamily: 'Inter_700Bold' }}>Farm Data:</Text> Farm size, location, crop types, and soil/weather sensor data.{'\n'}
            • <Text style={{ fontFamily: 'Inter_700Bold' }}>Financial Data:</Text> Mobile money (M-Pesa, Tigo Pesa, Airtel Money) phone numbers for payouts and transactions.{'\n'}
            • <Text style={{ fontFamily: 'Inter_700Bold' }}>Usage Data:</Text> App interactions, diagnostic logs, and AI prompt history (Sankofa AI).
          </Text>

          <Text style={[styles.heading, { color: colors.text }]}>3. How We Use Your Data</Text>
          <Text style={[styles.body, { color: colors.textMute }]}>
            Your data is used to provide accurate crop forecasts, facilitate smart contract farming connections, process secure payments, and improve the Sankofa AI advisory models. Verification data is used strictly for KYC/AML compliance.
          </Text>

          <Text style={[styles.heading, { color: colors.text }]}>4. Data Security & Retention</Text>
          <Text style={[styles.body, { color: colors.textMute }]}>
            We employ bank-grade encryption to protect your data. KYC documents that fail verification are permanently deleted within 90 days. You may request full account deletion at any time via the Profile settings.
          </Text>

          <Text style={[styles.heading, { color: colors.text }]}>5. Contact Us</Text>
          <Text style={[styles.body, { color: colors.textMute }]}>
            For data privacy inquiries or to exercise your rights under the PDPA, contact our Data Protection Officer at privacy@kilimo.ai or via the Help Center in the app.
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
