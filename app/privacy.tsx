import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { useColorScheme } from 'react-native';

export default function PrivacyScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#ffffff' : '#000000';
  const subTextColor = isDark ? '#a1a1aa' : '#71717a';

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#0a0a0a' : '#ffffff' }]}>
      <Text style={[styles.title, { color: textColor }]}>Privacy Policy</Text>
      <Text style={[styles.date, { color: subTextColor }]}>Last Updated: May 12, 2026</Text>
      
      <Section title="1. Information We Collect" color={textColor}>
        Kilimo AI collects agricultural data, location information (to provide local weather forecasts), and account details to provide a personalized farming experience.
      </Section>

      <Section title="2. How We Use Data" color={textColor}>
        Your data is used to train our agricultural models and provide precise recommendations for your specific crops and region.
      </Section>

      <Section title="3. Data Security" color={textColor}>
        We implement industry-standard encryption to protect your sensitive farm data and personal information.
      </Section>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function Section({ title, children, color }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      <Text style={styles.sectionText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
    color: '#71717a',
  },
});
