/**
 * Crop Planning — AI-assisted seasonal crop calendar
 * Audit B1 (P1): season picker, crop recommendations, visual planting timeline, auto-tasks
 */
import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  Dimensions, StatusBar, Platform, Alert,
} from 'react-native';
import Animated, { FadeIn, FadeOut, FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  ChevronLeft, Sparkles, Leaf, Droplets, AlertCircle, CheckCircle2,
  Plus, TrendingUp, Sun, Cloud, CloudRain, Calendar, Target, ArrowRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';
import { useTasks, TaskCategory } from '../hooks/useTasks';
import { useKilimoStore } from '../store/useKilimoStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Data models ──────────────────────────────────────────────────────────────
type Season = 'masika' | 'vuli' | 'kiangazi';
type WaterNeed = 'Chini' | 'Wastani' | 'Juu';
type Risk = 'Chini' | 'Wastani' | 'Juu';

interface CropRec {
  id: string;
  name: string;
  nameSw: string;
  emoji: string;
  daysToHarvest: number;
  yieldPerAcre: string;   // e.g. "2.5 tani"
  price: string;          // market reference
  water: WaterNeed;
  risk: Risk;
  color: string;
  plantWeeks: number;     // weeks of planting phase
  growWeeks: number;      // weeks of growth phase
  harvestWeeks: number;   // weeks of harvest phase
  tips: string[];
}

const SEASONS: { key: Season; label: string; sublabel: string; months: string; icon: React.ReactNode; color: string }[] = [
  { key: 'masika', label: 'Masika', sublabel: 'Mvua Ndefu', months: 'Mar – Mei', icon: <CloudRain size={16} color="#3b82f6" />, color: '#3b82f6' },
  { key: 'vuli', label: 'Vuli', sublabel: 'Mvua Fupi', months: 'Okt – Des', icon: <Cloud size={16} color="#8b5cf6" />, color: '#8b5cf6' },
  { key: 'kiangazi', label: 'Kiangazi', sublabel: 'Kiangazi', months: 'Jun – Sep', icon: <Sun size={16} color="#f59e0b" />, color: '#f59e0b' },
];

const CROP_DATA: Record<Season, CropRec[]> = {
  masika: [
    { id: 'm1', name: 'Maize', nameSw: 'Mahindi', emoji: '🌽', daysToHarvest: 120, yieldPerAcre: '2.5 tani', price: 'TZS 85,000/mfuko', water: 'Wastani', risk: 'Chini', color: '#f59e0b', plantWeeks: 2, growWeeks: 13, harvestWeeks: 2, tips: ['Tumia mbegu ya DK8031 au H614D', 'Weka CAN wiki 4 baada ya kupanda', 'Dhibiti wadudu wa buni mapema'] },
    { id: 'm2', name: 'Beans', nameSw: 'Maharage', emoji: '🫘', daysToHarvest: 80, yieldPerAcre: '0.8 tani', price: 'TZS 210,000/mfuko', water: 'Wastani', risk: 'Chini', color: '#1A3B14', plantWeeks: 1, growWeeks: 9, harvestWeeks: 1, tips: ['Weka Rhizobium kabla ya kupanda', 'Epuka udongo wenye maji', 'Vuna mapema kuepuka mvua'] },
    { id: 'm3', name: 'Paddy Rice', nameSw: 'Mpunga', emoji: '🌾', daysToHarvest: 150, yieldPerAcre: '3.0 tani', price: 'TZS 120,000/mfuko', water: 'Juu', risk: 'Wastani', color: '#3b82f6', plantWeeks: 3, growWeeks: 16, harvestWeeks: 2, tips: ['Hitaji mfumo mzuri wa umwagiliaji', 'Tumia mbegu SARO 5 au TXD 306', 'Kagua mara kwa mara kwa magonjwa ya majani'] },
    { id: 'm4', name: 'Tomatoes', nameSw: 'Nyanya', emoji: '🍅', daysToHarvest: 90, yieldPerAcre: '5.0 tani', price: 'TZS 38,000/crate', water: 'Wastani', risk: 'Juu', color: '#ef4444', plantWeeks: 2, growWeeks: 9, harvestWeeks: 2, tips: ['Panda katika kitalu kwanza wiki 3', 'Weka steki na uunganishe sawa', 'Dhibiti kuoza kwa mwisho (Blossom End Rot)'] },
  ],
  vuli: [
    { id: 'v1', name: 'Short Maize', nameSw: 'Mahindi (Mfupi)', emoji: '🌽', daysToHarvest: 90, yieldPerAcre: '2.0 tani', price: 'TZS 85,000/mfuko', water: 'Wastani', risk: 'Chini', color: '#f59e0b', plantWeeks: 2, growWeeks: 10, harvestWeeks: 1, tips: ['Chagua aina ya siku 90 (SEEDCO SC403)', 'Panda siku 1-3 za mvua za kwanza', 'Funika udongo (mulching) kudumisha unyevu'] },
    { id: 'v2', name: 'Onions', nameSw: 'Vitunguu', emoji: '🧅', daysToHarvest: 120, yieldPerAcre: '4.0 tani', price: 'TZS 45,000/net 20kg', water: 'Wastani', risk: 'Wastani', color: '#a855f7', plantWeeks: 2, growWeeks: 13, harvestWeeks: 2, tips: ['Anzisha katika kitalu wiki 4-6 mapema', 'Hitaji udongo wenye rutuba na mifereji mizuri', 'Kausha vizuri kabla ya kuhifadhi'] },
    { id: 'v3', name: 'Cabbage', nameSw: 'Kabichi', emoji: '🥬', daysToHarvest: 90, yieldPerAcre: '6.0 tani', price: 'TZS 15,000/kichwa', water: 'Wastani', risk: 'Chini', color: '#1A3B14', plantWeeks: 2, growWeeks: 9, harvestWeeks: 2, tips: ['Panda katika kitalu wiki 3 mapema', 'Weka mbolea ya CAN mara kwa mara', 'Dhibiti viwavi (caterpillars) mapema'] },
    { id: 'v4', name: 'Beans', nameSw: 'Maharage', emoji: '🫘', daysToHarvest: 80, yieldPerAcre: '0.7 tani', price: 'TZS 210,000/mfuko', water: 'Chini', risk: 'Chini', color: '#1A3B14', plantWeeks: 1, growWeeks: 9, harvestWeeks: 1, tips: ['Tumia mbegu ya Jesca au Lyamungu 85', 'Inafaa kwa maeneo ya mvua kidogo', 'Vuna mapema kuepuka mvua ya mwisho'] },
  ],
  kiangazi: [
    { id: 'k1', name: 'Sunflower', nameSw: 'Alizeti', emoji: '🌻', daysToHarvest: 95, yieldPerAcre: '0.5 tani mbegu', price: 'TZS 95,000/mfuko', water: 'Chini', risk: 'Chini', color: '#f59e0b', plantWeeks: 2, growWeeks: 10, harvestWeeks: 2, tips: ['Faa kwa maeneo kame na hata ya kiangazi', 'Umbali wa kupanda: 75cm × 30cm', 'Fua mbegu vizuri kabla ya kuuza'] },
    { id: 'k2', name: 'Irrigated Tomatoes', nameSw: 'Nyanya (Umwagiliaji)', emoji: '🍅', daysToHarvest: 90, yieldPerAcre: '7.0 tani', price: 'TZS 38,000/crate', water: 'Juu', risk: 'Wastani', color: '#ef4444', plantWeeks: 2, growWeeks: 9, harvestWeeks: 2, tips: ['Hitaji umwagiliaji wa drip au flood', 'Bei nzuri wakati wa kiangazi (uhaba)', 'Dhibiti ugonjwa wa Late Blight'] },
    { id: 'k3', name: 'Chili Peppers', nameSw: 'Pilipili Kali', emoji: '🌶️', daysToHarvest: 120, yieldPerAcre: '1.2 tani', price: 'TZS 800/kg fresh', water: 'Wastani', risk: 'Chini', color: '#f97316', plantWeeks: 2, growWeeks: 13, harvestWeeks: 2, tips: ['Panda katika kitalu wiki 4 mapema', 'Inaweza kukaa hadi miaka 2-3 ikitunzwa', 'Soko la nje ya nchi (export) linalipa vizuri'] },
    { id: 'k4', name: 'Sorghum', nameSw: 'Mtama', emoji: '🌿', daysToHarvest: 90, yieldPerAcre: '1.5 tani', price: 'TZS 55,000/mfuko', water: 'Chini', risk: 'Chini', color: '#1A3B14', plantWeeks: 1, growWeeks: 10, harvestWeeks: 2, tips: ['Ustahimili ukame zaidi ya mahindi', 'Inafaa kwa maeneo ya Dodoma/Singida', 'Tumia kwa chakula na lishe ya wanyama'] },
  ],
};

// ─── Background orb ───────────────────────────────────────────────────────────
const NeuralOrb = ({ color, size, x, y, delay = 0 }: any) => (
  <Animated.View
    entering={FadeInDown}
    style={[styles.orb, { width: size, height: size, borderRadius: size / 2, backgroundColor: color, filter: Platform.OS === 'web' ? 'blur(100px)' : undefined }]}
  />
);

// ─── Planting timeline bar ─────────────────────────────────────────────────────
function PlantingTimeline({ crop }: { crop: CropRec }) {
  const total = crop.plantWeeks + crop.growWeeks + crop.harvestWeeks;
  const plantPct = (crop.plantWeeks / total) * 100;
  const growPct = (crop.growWeeks / total) * 100;
  const harvestPct = (crop.harvestWeeks / total) * 100;
  return (
    <View style={{ marginTop: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={tl.label}>KALENDA YA KILIMO ({crop.daysToHarvest} siku)</Text>
      </View>
      <View style={{ flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden', gap: 2 }}>
        <Animated.View entering={FadeInDown} style={{ backgroundColor: '#22c55e', borderRadius: 5 }} />
        <Animated.View entering={FadeInDown} style={{ backgroundColor: '#f59e0b', borderRadius: 5 }} />
        <Animated.View entering={FadeInDown} style={{ backgroundColor: '#f97316', borderRadius: 5 }} />
      </View>
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
        {[{ label: 'Upanzi', color: '#22c55e', weeks: crop.plantWeeks }, { label: 'Ukuaji', color: '#f59e0b', weeks: crop.growWeeks }, { label: 'Mavuno', color: '#f97316', weeks: crop.harvestWeeks }].map((phase) => (
          <View key={phase.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: phase.color }} />
            <Text style={tl.phaseLbl}>{phase.label} ({phase.weeks}w)</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const tl = StyleSheet.create({
  label: { fontSize: 9, fontFamily: 'Inter_900Black', letterSpacing: 1.5, color: '#6b7280' },
  phaseLbl: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: '#6b7280' },
});

// ─── Water / risk badge ────────────────────────────────────────────────────────
const WATER_COLOR: Record<WaterNeed, string> = { Chini: '#22c55e', Wastani: '#f59e0b', Juu: '#3b82f6' };
const RISK_COLOR: Record<Risk, string> = { Chini: '#22c55e', Wastani: '#f59e0b', Juu: '#ef4444' };

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function CropPlanningScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { createTask } = useTasks();
  const addNotification = useKilimoStore((s) => s.addNotification);
  const [season, setSeason] = useState<Season>('masika');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [planning, setPlanning] = useState<Record<string, boolean>>({});

  const crops = CROP_DATA[season];
  const activeSeason = SEASONS.find((s) => s.key === season)!;

  function planCrop(crop: CropRec) {
    if (planning[crop.id]) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const today = new Date();
    createTask({ title: `Panda ${crop.nameSw}`, titleSw: `Panda ${crop.nameSw}`, category: 'planting', priority: 'high', status: 'pending', xpReward: 25, dueDate: new Date(today.getTime() + 1 * 24 * 3600_000).toISOString() });
    createTask({ title: `Tunza ${crop.nameSw} — wiki 1-${crop.growWeeks}`, titleSw: `Tunza ${crop.nameSw}`, category: 'scouting', priority: 'medium', status: 'pending', xpReward: 15, dueDate: new Date(today.getTime() + 14 * 24 * 3600_000).toISOString() });
    createTask({ title: `Vuna ${crop.nameSw}`, titleSw: `Vuna ${crop.nameSw}`, category: 'harvest', priority: 'critical', status: 'pending', xpReward: 40, dueDate: new Date(today.getTime() + crop.daysToHarvest * 24 * 3600_000).toISOString() });
    addNotification({ title: `📅 Mpango wa ${crop.nameSw} Umewekwa`, body: `Kazi 3 zimeongezwa: Upanzi, Utunzaji, na Mavuno baada ya siku ${crop.daysToHarvest}.`, type: 'success' });
    setPlanning((p) => ({ ...p, [crop.id]: true }));
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={StyleSheet.absoluteFill}>
        
        
        <LinearGradient colors={[isDark ? '#020617' : '#ffffff', isDark ? '#020617ee' : '#ffffffee', 'transparent']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: SCREEN_HEIGHT }} />
      </View>

      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <Animated.View entering={FadeInDown} style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={[styles.iconBtn, { borderColor: colors.border }]}>
              <ChevronLeft size={24} color={colors.text} />
            </BlurView>
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
              <Sparkles size={11} color={colors.primary} /><Text style={[styles.badgeText, { color: colors.primary }]}>AI MSHAURI WA KILIMO</Text>
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Upangaji Mazao</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/tasks')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="View farm tasks calendar"
          >
            <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={[styles.iconBtn, { borderColor: colors.border }]}>
              <Calendar size={20} color={colors.primary} />
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Season selector */}
          <Animated.View entering={FadeInDown} style={styles.seasonRow}>
            {SEASONS.map((s) => (
              <TouchableOpacity
              key={s.key}
              onPress={() => { setSeason(s.key); setExpanded(null); Haptics.selectionAsync(); }}
              style={{ flex: 1 }}
              accessibilityRole="button"
              accessibilityLabel={`${s.label} season, ${s.months}`}
              accessibilityState={{ selected: season === s.key }}
            >
                <BlurView intensity={isDark ? 20 : 60} tint={isDark ? 'dark' : 'light'}
                  style={[styles.seasonTab, { borderColor: season === s.key ? s.color : colors.border, borderWidth: season === s.key ? 2 : 1 }]}>
                  <LinearGradient colors={season === s.key ? [s.color + '22', s.color + '08'] : ['transparent', 'transparent']} style={StyleSheet.absoluteFill} />
                  {s.icon}
                  <Text style={[styles.seasonLabel, { color: season === s.key ? s.color : colors.text }]}>{s.label}</Text>
                  <Text style={[styles.seasonSub, { color: colors.textMute }]}>{s.months}</Text>
                </BlurView>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* Season info banner */}
          <Animated.View key={season} entering={FadeInDown}
            style={[styles.banner, { borderColor: activeSeason.color + '40', backgroundColor: activeSeason.color + '12' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {activeSeason.icon}
              <View>
                <Text style={{ fontFamily: 'Inter_900Black', fontSize: 14, color: activeSeason.color }}>{activeSeason.label} — {activeSeason.sublabel}</Text>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.textMute }}>{activeSeason.months} · {crops.length} mazao yanayofaa</Text>
              </View>
            </View>
            <View style={[styles.aiTag, { backgroundColor: colors.primary + '18' }]}>
              <Sparkles size={12} color={colors.primary} />
              <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 10, color: colors.primary }}>AI IMEPENDEKEZA</Text>
            </View>
          </Animated.View>

          {/* Section heading */}
          <View style={styles.sectionRow}>
            <Leaf size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Mazao Yanayopendekezwa</Text>
          </View>

          {/* Crop cards */}
          
            {crops.map((crop, idx) => {
              const isOpen = expanded === crop.id;
              const isPlanned = !!planning[crop.id];
              return (
                <Animated.View key={crop.id} entering={FadeInDown} exiting={FadeOut} style={{ marginBottom: 16 }}>
                  <TouchableOpacity
                    onPress={() => { setExpanded(isOpen ? null : crop.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                    activeOpacity={0.88}
                    accessibilityRole="button"
                    accessibilityLabel={`${crop.nameSw} — ${crop.daysToHarvest} days to harvest`}
                    accessibilityHint={isOpen ? 'Collapse crop details' : 'Expand crop details'}
                    accessibilityState={{ expanded: isOpen }}
                  >
                    <BlurView intensity={isDark ? 20 : 65} tint={isDark ? 'dark' : 'light'}
                      style={[styles.card, { borderColor: isOpen ? crop.color + '50' : colors.border, borderWidth: isOpen ? 2 : 1 }]}>

                      {/* Card header */}
                      <View style={styles.cardHead}>
                        <View style={[styles.emoji, { backgroundColor: crop.color + '18' }]}>
                          <Text style={{ fontSize: 22 }}>{crop.emoji}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.cropName, { color: colors.text }]}>{crop.nameSw}</Text>
                          <Text style={[styles.cropSub, { color: colors.textMute }]}>{crop.name} · {crop.daysToHarvest} siku hadi mavuno</Text>
                        </View>
                        {isPlanned && (
                          <View style={[styles.plannedTag, { backgroundColor: '#22c55e18' }]}>
                            <CheckCircle2 size={14} color="#22c55e" />
                            <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 10, color: '#22c55e' }}>IMEPANGWA</Text>
                          </View>
                        )}
                      </View>

                      {/* Stats row */}
                      <View style={styles.statsRow}>
                        <View style={styles.stat}>
                          <Text style={[styles.statLabel, { color: colors.textMute }]}>Mavuno/Eka</Text>
                          <Text style={[styles.statVal, { color: colors.text }]}>{crop.yieldPerAcre}</Text>
                        </View>
                        <View style={[styles.statDiv, { backgroundColor: colors.border }]} />
                        <View style={styles.stat}>
                          <Text style={[styles.statLabel, { color: colors.textMute }]}>Bei ya Soko</Text>
                          <Text style={[styles.statVal, { color: colors.text }]}>{crop.price}</Text>
                        </View>
                        <View style={[styles.statDiv, { backgroundColor: colors.border }]} />
                        <View style={styles.stat}>
                          <Text style={[styles.statLabel, { color: colors.textMute }]}>Maji</Text>
                          <Text style={[styles.statVal, { color: WATER_COLOR[crop.water] }]}>{crop.water}</Text>
                        </View>
                        <View style={[styles.statDiv, { backgroundColor: colors.border }]} />
                        <View style={styles.stat}>
                          <Text style={[styles.statLabel, { color: colors.textMute }]}>Hatari</Text>
                          <Text style={[styles.statVal, { color: RISK_COLOR[crop.risk] }]}>{crop.risk}</Text>
                        </View>
                      </View>

                      {/* Expanded section */}
                      
                        {isOpen && (
                          <Animated.View entering={FadeInDown} exiting={FadeOut} style={{ overflow: 'hidden' }}>
                            <View style={[styles.divider, { backgroundColor: colors.border }]} />

                            {/* Planting timeline */}
                            <PlantingTimeline crop={crop} />

                            {/* Tips */}
                            <Text style={[styles.tipsTitle, { color: colors.textMute }]}>VIDOKEZO VYA AI</Text>
                            {crop.tips.map((tip, ti) => (
                              <View key={ti} style={styles.tipRow}>
                                <View style={[styles.tipDot, { backgroundColor: crop.color }]} />
                                <Text style={[styles.tipText, { color: colors.text }]}>{tip}</Text>
                              </View>
                            ))}

                            {/* Plan button */}
                            <TouchableOpacity
                              onPress={() => planCrop(crop)}
                              disabled={isPlanned}
                              style={[styles.planBtn, { backgroundColor: isPlanned ? '#22c55e30' : colors.primary, opacity: isPlanned ? 0.85 : 1 }]}
                              accessibilityRole="button"
                              accessibilityLabel={isPlanned ? `${crop.nameSw} tayari imepangwa` : `Panga kazi za ${crop.nameSw}`}
                              accessibilityState={{ disabled: isPlanned }}
                            >
                              {isPlanned ? <CheckCircle2 size={18} color="#22c55e" /> : <Plus size={18} color={isDark ? '#000' : '#FCFBF7'} />}
                              <Text style={[styles.planBtnText, { color: isPlanned ? '#22c55e' : (isDark ? '#000' : '#FCFBF7') }]}>
                                {isPlanned ? 'Kazi Zimeongezwa kwenye Ratiba' : `Panga Kazi za ${crop.nameSw}`}
                              </Text>
                            </TouchableOpacity>
                          </Animated.View>
                        )}
                      

                      {/* Collapsed footer */}
                      {!isOpen && (
                        <View style={[styles.colFooter, { borderColor: colors.border }]}>
                          <Text style={[{ fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.textMute }]}>Bonyeza kuona maelezo kamili</Text>
                          <ArrowRight size={14} color={colors.primary} />
                        </View>
                      )}
                    </BlurView>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          

          {/* Bottom tips card */}
          <Animated.View entering={FadeInDown}>
            <BlurView intensity={isDark ? 15 : 50} tint={isDark ? 'dark' : 'light'} style={[styles.tipCard, { borderColor: colors.border }]}>
              <LinearGradient colors={[colors.primary + '14', colors.primary + '04']} style={StyleSheet.absoluteFill} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Target size={20} color={colors.primary} />
                <Text style={{ fontFamily: 'Inter_900Black', fontSize: 14, color: colors.text }}>Ushauri wa Msimu huu</Text>
              </View>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.textMute, lineHeight: 20 }}>
                Msimu wa <Text style={{ fontWeight: '700', color: colors.text }}>{activeSeason.label}</Text> ni wakati mzuri wa kupanda mazao yanayohitaji <Text style={{ fontWeight: '700', color: activeSeason.color }}>mvua {activeSeason.key === 'kiangazi' ? 'kidogo au umwagiliaji' : activeSeason.key === 'masika' ? 'nyingi na ya uhakika' : 'wastani'}</Text>. Tembelea soko lako la karibu au tumia <Text style={{ fontWeight: '700', color: colors.primary }}>Soko la KILIMO AI</Text> kupata bei za moja kwa moja.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/market')}
                style={[styles.mktBtn, { borderColor: colors.primary }]}
                accessibilityRole="button"
                accessibilityLabel="Check current market prices"
              >
                <TrendingUp size={14} color={colors.primary} />
                <Text style={{ fontFamily: 'Inter_800ExtraBold', fontSize: 12, color: colors.primary }}>Angalia Bei za Soko</Text>
              </TouchableOpacity>
            </BlurView>
          </Animated.View>

          <View style={{ height: 80 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  orb: { position: 'absolute' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 14 },
  iconBtn: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 1, overflow: 'hidden' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 4 },
  badgeText: { fontSize: 9, fontFamily: 'Inter_900Black', letterSpacing: 1 },
  title: { fontSize: 22, fontFamily: 'Inter_900Black', letterSpacing: -0.8 },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  seasonRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  seasonTab: { borderRadius: 20, padding: 14, alignItems: 'center', gap: 4, overflow: 'hidden' },
  seasonLabel: { fontFamily: 'Inter_800ExtraBold', fontSize: 13 },
  seasonSub: { fontFamily: 'Inter_500Medium', fontSize: 10 },
  banner: { borderRadius: 20, padding: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  aiTag: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontFamily: 'Inter_900Black', letterSpacing: -0.5 },
  card: { borderRadius: 28, padding: 20, overflow: 'hidden' },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  emoji: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  cropName: { fontSize: 16, fontFamily: 'Inter_800ExtraBold', letterSpacing: -0.3 },
  cropSub: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 2 },
  plannedTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 10 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 9, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.5, marginBottom: 4 },
  statVal: { fontSize: 12, fontFamily: 'Inter_800ExtraBold' },
  statDiv: { width: 1, height: 32 },
  divider: { height: 1, marginVertical: 16 },
  tipsTitle: { fontSize: 9, fontFamily: 'Inter_900Black', letterSpacing: 1.5, marginBottom: 10 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  tipDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5 },
  tipText: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 20 },
  planBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 16, marginTop: 16 },
  planBtnText: { fontFamily: 'Inter_900Black', fontSize: 14 },
  colFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, marginTop: 4, borderTopWidth: 1 },
  tipCard: { borderRadius: 24, padding: 20, borderWidth: 1, overflow: 'hidden', marginBottom: 16 },
  mktBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1.5, alignSelf: 'flex-start' },
});
