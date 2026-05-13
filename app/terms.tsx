import React from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { useColorScheme } from 'react-native';

export default function TermsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#ffffff' : '#000000';

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#0a0a0a' : '#ffffff' }]}>
      <Text style={[styles.title, { color: textColor }]}>Terms of Service</Text>
      
      <Section title="1. Acceptance of Terms" color={textColor}>
        By using Kilimo AI, you agree to these terms. Please read them carefully.
      </Section>

      <Section title="2. Use of Service" color={textColor}>
        Kilimo AI provides agricultural insights. While we strive for accuracy, decisions made based on AI recommendations are the responsibility of the farmer.
      </Section>

      <Section title="3. Account Responsibilities" color={textColor}>
        You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.
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
