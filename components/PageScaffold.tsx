/**
 * Kilimo AI — Shared Page Scaffold
 *
 * Glass-morphism background + animated orbs + standardized header so every
 * feature page has the same premium feel without 300 lines of boilerplate.
 *
 * Usage:
 *   <PageScaffold title="Mifugo" subtitle="Livestock Tracking" badge="LIVESTOCK">
 *     ...page body...
 *   </PageScaffold>
 */

import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView,
  Dimensions, StatusBar, Platform, RefreshControl,
} from 'react-native';
import { ChevronLeft, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';
import { motion } from 'motion/react';

const { width: SW, height: SH } = Dimensions.get('window');

const NeuralOrb = ({ color, size, x, y, delay }: any) => (
  <motion.View
    initial={{ x, y, opacity: 0, scale: 0.8 }}
    animate={{
      x: [x, x + 30, x - 20, x],
      y: [y, y - 40, y + 30, y],
      opacity: [0.08, 0.18, 0.12, 0.08],
      scale: [1, 1.1, 0.95, 1],
    }}
    transition={{ duration: 20 + delay / 1000, repeat: Infinity, ease: 'easeInOut' }}
    style={[
      styles.orb,
      {
        width: size, height: size, borderRadius: size / 2, backgroundColor: color,
        filter: Platform.OS === 'web' ? 'blur(100px)' : undefined,
      },
    ]}
  />
);

export interface PageScaffoldProps {
  title: string;
  subtitle?: string;
  badge?: string;
  headerRight?: React.ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  children: React.ReactNode;
}

export default function PageScaffold({
  title, subtitle, badge, headerRight,
  scroll = true, refreshing, onRefresh, children,
}: PageScaffoldProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const body = (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={[styles.iconBtn, { borderColor: colors.border }]}>
            <ChevronLeft size={22} color={colors.text} />
          </BlurView>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center' }}>
          {badge ? (
            <View style={[styles.badge, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}>
              <Sparkles size={11} color={colors.primary} />
              <Text style={[styles.badgeText, { color: colors.primary }]}>{badge}</Text>
            </View>
          ) : null}
        </View>

        <View style={{ width: 44 }}>{headerRight}</View>
      </View>

      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: colors.textMute }]}>{subtitle}</Text> : null}
      </View>

      <View style={styles.body}>{children}</View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <NeuralOrb color="#3ecf8e" size={340} x={-60} y={-40} delay={0} />
        <NeuralOrb color="#3b82f6" size={280} x={SW - 160} y={SH * 0.5} delay={2000} />
        <LinearGradient
          colors={[isDark ? '#020617' : '#f8fafc', 'transparent']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: SH }}
        />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.primary} /> : undefined}
          >
            {body}
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>{body}</View>
        )}
      </SafeAreaView>
    </View>
  );
}

/** Standardised glass card used on every feature page. */
export function GlassCard({ children, style }: { children: React.ReactNode; style?: any }) {
  const { isDark, colors } = useTheme();
  return (
    <BlurView
      intensity={isDark ? 25 : 70}
      tint={isDark ? 'dark' : 'light'}
      style={[scStyles.glass, { borderColor: colors.border }, style]}
    >
      {children}
    </BlurView>
  );
}

/** Standardised section header within a page body. */
export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={scStyles.sectionHeader}>
      <Text style={[scStyles.sectionTitle, { color: colors.textMute }]}>{title.toUpperCase()}</Text>
      {action ? (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={[scStyles.sectionAction, { color: colors.primary }]}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/** Standardised empty state. */
export function EmptyState({ icon, title, body, cta, onCta }: { icon: React.ReactNode; title: string; body: string; cta?: string; onCta?: () => void }) {
  const { colors } = useTheme();
  return (
    <GlassCard style={{ padding: 32, alignItems: 'center', marginHorizontal: 24, marginTop: 16 }}>
      <View style={{ marginBottom: 12, opacity: 0.7 }}>{icon}</View>
      <Text style={[scStyles.emptyTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[scStyles.emptyBody, { color: colors.textMute }]}>{body}</Text>
      {cta ? (
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onCta?.(); }}
          style={[scStyles.emptyCta, { backgroundColor: colors.primary }]}
          activeOpacity={0.85}
        >
          <Text style={scStyles.emptyCtaText}>{cta}</Text>
        </TouchableOpacity>
      ) : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  orb: { position: 'absolute' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingTop: 16,
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, overflow: 'hidden',
  },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1,
  },
  badgeText: { fontSize: 10, fontFamily: 'Inter_900Black', letterSpacing: 1.5 },
  titleBlock: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 },
  title: { fontSize: 32, fontFamily: 'Inter_900Black', letterSpacing: -1 },
  subtitle: { fontSize: 14, fontFamily: 'Inter_500Medium', marginTop: 4 },
  body: { flex: 1, paddingTop: 16 },
});

const scStyles = StyleSheet.create({
  glass: {
    borderRadius: 24, borderWidth: 1, overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 32, paddingTop: 24, paddingBottom: 10,
  },
  sectionTitle: { fontSize: 11, fontFamily: 'Inter_900Black', letterSpacing: 1.5 },
  sectionAction: { fontSize: 12, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.5 },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_900Black', marginBottom: 6, textAlign: 'center' },
  emptyBody: { fontSize: 13, fontFamily: 'Inter_500Medium', textAlign: 'center', lineHeight: 19, maxWidth: 260 },
  emptyCta: { marginTop: 18, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 },
  emptyCtaText: { color: '#000', fontSize: 13, fontFamily: 'Inter_900Black', letterSpacing: 0.5 },
});
