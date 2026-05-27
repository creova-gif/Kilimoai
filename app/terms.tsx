import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { useColorScheme } from 'react-native';

export default function TermsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bg = isDark ? '#0a0a0a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#111111';
  const subTextColor = isDark ? '#a1a1aa' : '#52525b';
  const borderColor = isDark ? '#27272a' : '#e4e4e7';

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={[styles.container, { backgroundColor: bg }]}>
      <Text style={[styles.title, { color: textColor }]}>Terms of Service</Text>
      <Text style={[styles.date, { color: subTextColor }]}>Last Updated: May 25, 2026 · Effective: May 25, 2026</Text>
      <Text style={[styles.intro, { color: subTextColor }]}>
        These Terms of Service ("Terms") constitute a legally binding agreement between you and Kilimo AI Ltd. ("KILIMO AI," "we," "our," or "us"), governing your use of the KILIMO AI mobile application ("App"). Please read these Terms carefully before using the App. By registering an account or using any feature of the App, you confirm that you have read, understood, and agree to be bound by these Terms.
      </Text>

      <View style={[styles.divider, { backgroundColor: borderColor }]} />

      <Section title="1. Acceptance of Terms" color={textColor} sub={subTextColor}>
        By creating an Agro ID, using any AI feature, accessing market data, or otherwise using the App, you agree to these Terms and our Privacy Policy. If you do not agree, you must not use the App. We may update these Terms at any time; continued use after notification of changes constitutes acceptance.
      </Section>

      <Section title="2. Eligibility" color={textColor} sub={subTextColor}>
        You must be at least 18 years old to create an account and use KILIMO AI. By registering, you confirm that you are at least 18 years of age and have the legal capacity to enter into this agreement. Accounts created on behalf of cooperatives or agribusinesses must be registered by an authorised representative.
      </Section>

      <Section title="3. Description of Services" color={textColor} sub={subTextColor}>
        KILIMO AI provides the following services through the App:{'\n\n'}
        — <Bold>Sankofa AI:</Bold> An AI-powered agricultural advisory chatbot providing farming guidance in Swahili and English.{'\n'}
        — <Bold>Crop Diagnosis:</Bold> AI-powered analysis of crop photos to identify diseases and pests.{'\n'}
        — <Bold>Market Intelligence:</Bold> Real-time and historical crop price data from Tanzanian markets.{'\n'}
        — <Bold>Contract Farming:</Bold> Tools to manage and track agricultural contracts with buyers.{'\n'}
        — <Bold>Farm Management:</Bold> Task scheduling, inventory tracking, and livestock management.{'\n'}
        — <Bold>Agro ID:</Bold> A digital farming identity card linked to your farm profile.{'\n'}
        — <Bold>Wallet & Payments:</Bold> Integration with M-Pesa for cooperative and input supply payments.{'\n'}
        — <Bold>Weather Forecasting:</Bold> Location-based agricultural weather data.{'\n\n'}
        Service availability may vary by subscription tier and geographic location.
      </Section>

      <Section title="4. User Accounts & Agro ID" color={textColor} sub={subTextColor}>
        — You are responsible for maintaining the confidentiality of your Agro ID and any authentication credentials.{'\n'}
        — You must provide accurate, current, and complete information during registration.{'\n'}
        — You are responsible for all activities conducted under your account.{'\n'}
        — You must notify us immediately at support@kilimo.ai if you suspect unauthorized access to your account.{'\n'}
        — We reserve the right to suspend or terminate accounts that provide false information or violate these Terms.
      </Section>

      <Section title="5. Permitted Use" color={textColor} sub={subTextColor}>
        You may use KILIMO AI solely for lawful agricultural management and advisory purposes. You agree to:{'\n\n'}
        — Use the App in compliance with all applicable Tanzanian laws and regulations.{'\n'}
        — Provide accurate farm data to receive meaningful AI recommendations.{'\n'}
        — Treat AI diagnoses and recommendations as advisory, not as professional agricultural or legal advice.{'\n'}
        — Respect the intellectual property rights of KILIMO AI and third parties.
      </Section>

      <Section title="6. Prohibited Use" color={textColor} sub={subTextColor}>
        You must not:{'\n\n'}
        — Use the App to transmit false, misleading, or fraudulent agricultural data.{'\n'}
        — Attempt to reverse-engineer, decompile, or extract source code from the App.{'\n'}
        — Use automated bots, scrapers, or crawlers to access App data.{'\n'}
        — Upload images or content that violates the rights of others or is illegal.{'\n'}
        — Attempt to circumvent subscription limits or access controls.{'\n'}
        — Use the App to manipulate market prices or spread false market information.{'\n'}
        — Share your account credentials with third parties.{'\n'}
        — Use the App in any way that could damage, disable, or impair our servers or network.
      </Section>

      <Section title="7. AI Disclaimer & Limitation of Liability" color={textColor} sub={subTextColor}>
        <Bold>IMPORTANT: AI recommendations are advisory only.{'\n\n'}</Bold>
        Crop diagnoses, yield forecasts, market predictions, and farming advice generated by KILIMO AI's artificial intelligence systems are provided for informational purposes only. They are based on machine learning models trained on agricultural data and may be inaccurate, incomplete, or inapplicable to your specific circumstances.{'\n\n'}
        — AI-generated diagnoses should be verified by a qualified agronomist before major treatment decisions.{'\n'}
        — Market price data is sourced from third parties and may not reflect real-time conditions.{'\n'}
        — KILIMO AI is not liable for crop losses, financial losses, or any other damages arising from reliance on AI-generated recommendations.{'\n\n'}
        To the maximum extent permitted by law, KILIMO AI's total liability for any claim arising from your use of the App shall not exceed the amount you paid for the App in the 12 months preceding the claim.
      </Section>

      <Section title="8. Subscription & Payment Terms" color={textColor} sub={subTextColor}>
        — KILIMO AI offers Free, Premium, and Cooperative subscription tiers.{'\n'}
        — Free tier users receive limited AI diagnoses and chat queries per month as specified in the App.{'\n'}
        — Premium subscriptions are billed monthly or annually at the rates displayed in the App.{'\n'}
        — Payments are processed via M-Pesa or other supported payment methods.{'\n'}
        — Subscriptions auto-renew unless cancelled at least 24 hours before the renewal date.{'\n'}
        — We do not offer refunds for partial subscription periods, except as required by Tanzanian law.{'\n'}
        — We reserve the right to change pricing with 30 days' notice.
      </Section>

      <Section title="9. Intellectual Property" color={textColor} sub={subTextColor}>
        — All content, software, AI models, trademarks, logos, and design elements of the App are the exclusive property of Kilimo AI Ltd. or its licensors.{'\n'}
        — You are granted a limited, non-exclusive, non-transferable license to use the App for its intended purpose.{'\n'}
        — Farm data you enter remains your property. You grant us a license to use anonymized, aggregated farm data to improve our AI models.{'\n'}
        — You may not reproduce, distribute, or create derivative works from App content without our written permission.
      </Section>

      <Section title="10. Third-Party Services" color={textColor} sub={subTextColor}>
        The App integrates with third-party services including OpenAI, Supabase, Africa's Talking, Safaricom M-Pesa, and OpenWeatherMap. Use of these services is subject to their respective terms and privacy policies. KILIMO AI is not responsible for the availability, accuracy, or conduct of third-party services.
      </Section>

      <Section title="11. Data & Privacy" color={textColor} sub={subTextColor}>
        Your use of the App is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the App, you consent to the collection and use of your data as described in our Privacy Policy.
      </Section>

      <Section title="12. Service Availability & Modifications" color={textColor} sub={subTextColor}>
        — We do not guarantee that the App will be available at all times or free from errors.{'\n'}
        — We may modify, suspend, or discontinue any feature of the App at any time with reasonable notice.{'\n'}
        — We will make reasonable efforts to notify you of planned maintenance downtime in advance.{'\n'}
        — KILIMO AI is not liable for losses caused by service unavailability beyond our reasonable control.
      </Section>

      <Section title="13. Termination" color={textColor} sub={subTextColor}>
        — You may terminate your account at any time through Profile → Settings → Delete Account.{'\n'}
        — We may suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or pose a security risk.{'\n'}
        — Upon termination, your access to the App and associated data will cease. We will retain financial transaction records for 7 years as required by law.{'\n'}
        — Provisions that by their nature should survive termination (including Sections 7, 9, 14, and 15) shall remain in effect.
      </Section>

      <Section title="14. Dispute Resolution" color={textColor} sub={subTextColor}>
        — Any dispute arising from these Terms or your use of the App shall first be subject to good-faith negotiation between you and KILIMO AI.{'\n'}
        — If the dispute is not resolved within 30 days, it shall be referred to mediation under the rules of the Tanzania Institute of Arbitrators.{'\n'}
        — If mediation fails, disputes shall be finally settled by arbitration in Dar es Salaam, Tanzania, under UNCITRAL Arbitration Rules.{'\n'}
        — Nothing in this clause prevents either party from seeking urgent injunctive relief from a court of competent jurisdiction.
      </Section>

      <Section title="15. Governing Law" color={textColor} sub={subTextColor}>
        These Terms are governed by and construed in accordance with the laws of the United Republic of Tanzania, without regard to its conflict of law provisions. You consent to the exclusive jurisdiction of the courts of Dar es Salaam, Tanzania, for any matters not subject to arbitration.
      </Section>

      <Section title="16. Warranties Disclaimer" color={textColor} sub={subTextColor}>
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE APP WILL BE ERROR-FREE, SECURE, OR UNINTERRUPTED.
      </Section>

      <Section title="17. Changes to These Terms" color={textColor} sub={subTextColor}>
        We reserve the right to modify these Terms at any time. We will provide at least 14 days' notice of material changes through in-app notification. If you continue to use the App after the effective date of changes, you accept the revised Terms.
      </Section>

      <Section title="18. Contact" color={textColor} sub={subTextColor}>
        For questions about these Terms:{'\n\n'}
        Email: legal@kilimo.ai{'\n'}
        Kilimo AI Ltd.{'\n'}
        Dar es Salaam, Tanzania{'\n'}
        Phone: +255 22 000 0000
      </Section>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

function Bold({ children }: { children: React.ReactNode }) {
  return <Text style={{ fontFamily: 'Inter_700Bold' }}>{children}</Text>;
}

function Section({ title, children, color, sub }: { title: string; children: React.ReactNode; color: string; sub: string }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      <Text style={[styles.sectionText, { color: sub }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 26, fontFamily: 'Inter_700Bold', marginBottom: 6 },
  date: { fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 16 },
  intro: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22, marginBottom: 20 },
  divider: { height: 1, marginBottom: 20 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 10 },
  sectionText: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },
});
