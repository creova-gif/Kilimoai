import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Info, Sprout, ArrowUpRight } from 'lucide-react-native';
import { useTheme } from '../constants/Theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function SoilAnalysis() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Background */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1592982537447-6f2334208f0a?q=80&w=600&auto=format&fit=crop' }}
          style={styles.heroBackground}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.1)', colors.background]}
            style={StyleSheet.absoluteFill}
          />
          <SafeAreaView edges={['top']} style={styles.headerSafe}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={[styles.backBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            >
              <ChevronLeft color="#FFF" size={24} />
            </TouchableOpacity>
            
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Soil Nutrient Analysis</Text>
            </View>
          </SafeAreaView>
        </ImageBackground>

        {/* N-P-K Status Card */}
        <View style={styles.contentPadding}>
          <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.statusHeader}>
              <View>
                <Text style={[styles.statusLabel, { color: colors.textMute }]}>Overall Health</Text>
                <View style={styles.statusRow}>
                  <Text style={[styles.statusMain, { color: colors.text }]}>Optimal</Text>
                  <View style={styles.statusBadge}>
                    <ArrowUpRight size={12} color="#22d15a" />
                    <Text style={styles.statusBadgeText}>+15%</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.infoIcon, { backgroundColor: colors.background }]}>
                <Info size={20} color={colors.textMute} />
              </View>
            </View>

            {/* Bars */}
            <View style={styles.barsContainer}>
              <NutrientBar label="Nitrogen (N)" value={85} color="#22d15a" />
              <NutrientBar label="Phosphorus (P)" value={70} color="#F59E0B" />
              <NutrientBar label="Potassium (K)" value={60} color="#3b82f6" />
            </View>
          </View>

          {/* Urgent Recommendations */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Urgent Recommendations</Text>
          
          <RecommendationItem 
            title="Low Nitrogen detected"
            desc="Apply Urea immediately."
            imageUri="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=300&auto=format&fit=crop"
            onPress={() => router.push('/tasks' as any)}
          />
          
          <RecommendationItem 
            title="Potassium deficiency"
            desc="Boost suggested in Zone 5."
            imageUri="https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=300&auto=format&fit=crop"
            onPress={() => router.push('/consultations' as any)}
          />

        </View>
      </ScrollView>
    </View>
  );
}

function NutrientBar({ label, value, color }: { label: string; value: number; color: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.barItem}>
      <View style={styles.barLabels}>
        <Text style={[styles.barLabelText, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.barValueText, { color: colors.textMute }]}>{value}%</Text>
      </View>
      <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.barFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function RecommendationItem({ title, desc, imageUri, onPress }: { title: string; desc: string; imageUri: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.recCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Image source={{ uri: imageUri }} style={styles.recImage} />
      <View style={styles.recContent}>
        <Text style={[styles.recTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.recDesc, { color: colors.textMute }]}>{desc}</Text>
        <TouchableOpacity style={styles.recAction} onPress={onPress}>
          <Text style={styles.recActionText}>View details</Text>
          <ChevronLeft color="#22d15a" size={14} style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroBackground: {
    width: '100%',
    height: 280,
    justifyContent: 'flex-start',
  },
  headerSafe: {
    width: '100%',
    flex: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    marginTop: Platform.OS === 'ios' ? 0 : 16,
  },
  heroContent: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: 'InstrumentSerif_400Regular',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  contentPadding: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  statusCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginTop: -30, // Pull up over the background
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusMain: {
    fontSize: 24,
    fontFamily: 'Inter_800ExtraBold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 209, 90, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: '#22d15a',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barsContainer: {
    gap: 16,
  },
  barItem: {
    width: '100%',
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  barLabelText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  barValueText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  barTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    marginTop: 32,
    marginBottom: 16,
  },
  recCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  recImage: {
    width: 100,
    height: '100%',
  },
  recContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  recTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  recDesc: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    marginBottom: 12,
  },
  recAction: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34, 209, 90, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  recActionText: {
    color: '#22d15a',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
});
