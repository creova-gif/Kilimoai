import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Sprout, Box, Activity, ChevronRight } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';

export default function FarmHub() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const language = useKilimoStore((s) => s.language);

  const features = [
    {
      id: 'crop-planning',
      title: language === 'sw' ? 'Upangaji Mazao' : 'Crop Planning',
      subtitle: language === 'sw' ? 'Kalenda na ushauri wa kupanda' : 'AI-assisted seasonal crop calendar',
      icon: <Sprout size={24} color={colors.primary} />,
      color: colors.primary,
      route: '/crop-planning' as any,
    },
    {
      id: 'inventory',
      title: language === 'sw' ? 'Ghala & Vifaa' : 'Inventory',
      subtitle: language === 'sw' ? 'Fuatilia mbegu, mbolea na mazao' : 'Track seeds, fertilizer, and yield',
      icon: <Box size={24} color={colors.warning} />,
      color: colors.warning,
      route: '/inventory' as any,
    },
    {
      id: 'livestock',
      title: language === 'sw' ? 'Mifugo' : 'Livestock',
      subtitle: language === 'sw' ? 'Afya, chanjo na uzalishaji' : 'Health, vaccination, and production',
      icon: <Activity size={24} color={colors.info} />,
      color: colors.info,
      route: '/livestock' as any,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {language === 'sw' ? 'Usimamizi wa Shamba' : 'Farm Management'}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {features.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(item.route)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              accessibilityHint={item.subtitle}
            >
              <BlurView intensity={isDark ? 20 : 60} tint={isDark ? 'dark' : 'light'} style={[styles.card, { borderColor: colors.border }]}>
                <LinearGradient colors={[item.color + '15', 'transparent']} style={StyleSheet.absoluteFill} />
                <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                  {item.icon}
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.cardSubtitle, { color: colors.textMute }]}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={20} color={colors.textMute} />
              </BlurView>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: { paddingHorizontal: 24, paddingVertical: 20 },
  title: { fontSize: 28, fontFamily: 'Inter_900Black', letterSpacing: -0.8 },
  scroll: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100, gap: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
});
