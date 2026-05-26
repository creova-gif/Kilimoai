import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Sprout, Box, Activity, ChevronRight, ChevronDown, Check, AlertTriangle, Layers } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../constants/Theme';
import { useKilimoStore } from '../../store/useKilimoStore';
import { Card } from '../../components/ui/Card';

const ZONES_DATA = [
  { level: 'Very High', rate: '70 kg/ha', area: '1.2 ha', color: '#8B5CF6', labelSw: 'Juu Sana' },
  { level: 'High', rate: '83 kg/ha', area: '4.5 ha', color: '#1A3B14', labelSw: 'Juu' },
  { level: 'Average', rate: '100 kg/ha', area: '1.2 ha', color: '#3B82F6', labelSw: 'Wastani' },
  { level: 'Low', rate: '115 kg/ha', area: '6.2 ha', color: '#F59E0B', labelSw: 'Chini' },
];

export default function FarmHub() {
  const router = useRouter();
  const { colors, isDark, radius } = useTheme();
  const language = useKilimoStore((s) => s.language);
  const [selectedCrop, setSelectedCrop] = useState('Corn, grain');
  const [selectedZone, setSelectedZone] = useState(4);
  const [showCropDropdown, setShowCropDropdown] = useState(false);

  const features = [
    {
      id: 'crop-planning',
      title: language === 'sw' ? 'Upangaji Mazao' : 'Crop Planning',
      subtitle: language === 'sw' ? 'Kalenda na ushauri wa kupanda' : 'AI-assisted seasonal crop calendar',
      icon: <Sprout size={22} color={colors.primary} />,
      color: colors.primary,
      route: '/crop-planning' as any,
    },
    {
      id: 'inventory',
      title: language === 'sw' ? 'Ghala & Vifaa' : 'Inventory',
      subtitle: language === 'sw' ? 'Fuatilia mbegu, mbolea na mazao' : 'Track seeds, fertilizer, and yield',
      icon: <Box size={22} color={colors.warning} />,
      color: colors.warning,
      route: '/inventory' as any,
    },
    {
      id: 'livestock',
      title: language === 'sw' ? 'Mifugo' : 'Livestock',
      subtitle: language === 'sw' ? 'Afya, chanjo na uzalishaji' : 'Health, vaccination, and production',
      icon: <Activity size={22} color={colors.info} />,
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

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          {/* Crop Selector Dropdown Card */}
          <Card variant="solid" style={[styles.selectorCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.selectLabel, { color: colors.textMute }]}>SELECTED CROP / CROP TYPE</Text>
            <TouchableOpacity 
              style={[styles.selectRow, { borderColor: colors.border }]} 
              onPress={() => setShowCropDropdown(!showCropDropdown)}
            >
              <Text style={[styles.selectValue, { color: colors.text }]}>
                {language === 'sw' && selectedCrop === 'Corn, grain' ? 'Mahindi, nafaka' : selectedCrop}
              </Text>
              <ChevronDown size={18} color={colors.textMute} />
            </TouchableOpacity>

            {showCropDropdown && (
              <View style={styles.dropdownContent}>
                {['Corn, grain', 'Rice, plants', 'Beans, legumes'].map((crop) => (
                  <TouchableOpacity 
                    key={crop} 
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedCrop(crop);
                      setShowCropDropdown(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, { color: colors.text }]}>
                      {language === 'sw' && crop === 'Corn, grain' ? 'Mahindi, nafaka' : crop}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Card>

          {/* Productivity Zones selector segment */}
          <View style={styles.segmentBlock}>
            <Text style={[styles.sectionSubtitle, { color: colors.textMute }]}>PRODUCTIVITY ZONES</Text>
            <View style={[styles.segmentContainer, { backgroundColor: isDark ? '#121711' : '#EDF1EC' }]}>
              {[3, 4, 5, 6, 7, 8, 9].map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => setSelectedZone(num)}
                  style={[
                    styles.segmentCircle,
                    { 
                      backgroundColor: selectedZone === num ? colors.primary : 'transparent',
                    }
                  ]}
                >
                  <Text style={[
                    styles.segmentText,
                    { 
                      color: selectedZone === num ? '#FFFFFF' : colors.text,
                      fontFamily: selectedZone === num ? 'Inter_900Black' : 'Inter_600SemiBold'
                    }
                  ]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Productivity Zones Breakdown list */}
          <Card variant="solid" style={[styles.zonesCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.zonesHeader}>
              <Layers size={18} color={colors.primary} />
              <Text style={[styles.zonesTitle, { color: colors.text }]}>
                {language === 'sw' ? 'Mchanganuo wa Maeneo' : 'Zones Rate Breakdown'}
              </Text>
            </View>
            <View style={styles.zonesList}>
              {ZONES_DATA.map((zone, idx) => (
                <View key={zone.level}>
                  <View style={styles.zoneRow}>
                    <View style={styles.zoneLeft}>
                      <View style={[styles.statusBadgeDot, { backgroundColor: zone.color }]} />
                      <Text style={[styles.zoneLabelText, { color: colors.text }]}>
                        {language === 'sw' ? zone.labelSw : zone.level}
                      </Text>
                    </View>
                    <View style={styles.zoneRight}>
                      <Text style={[styles.zoneRateText, { color: colors.text }]}>{zone.rate}</Text>
                      <Text style={[styles.zoneAreaText, { color: colors.textMute }]}>{zone.area}</Text>
                    </View>
                  </View>
                  {idx < ZONES_DATA.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  )}
                </View>
              ))}
            </View>
          </Card>

          {/* Soil Nutrition checklist */}
          <Card variant="solid" style={[styles.nutritionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.nutritionTitle, { color: colors.text }]}>
              {language === 'sw' ? 'Tathmini ya Mbolea & Virutubisho' : 'Soil Nutrition Checklist'}
            </Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionCol}>
                <Text style={styles.nutritionHeaderLow}>LOW (Pungufu)</Text>
                {['Phosphorus', 'Magnesium', 'Acidity', 'Quality seeds'].map((item) => (
                  <View key={item} style={styles.nutritionItem}>
                    <AlertTriangle size={12} color="#EF4444" />
                    <Text style={[styles.nutritionItemText, { color: colors.text }]}>{item}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.nutritionCol}>
                <Text style={[styles.nutritionHeaderOk, { color: colors.primary }]}>HIGH (Inatosha)</Text>
                {['Nitrogen', 'Potassium'].map((item) => (
                  <View key={item} style={styles.nutritionItem}>
                    <Check size={12} color={colors.primary} />
                    <Text style={[styles.nutritionItemText, { color: colors.text }]}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>

          {/* Core features listing (Crop planning, inventory, livestock) */}
          <View style={{ marginTop: 8 }}>
            <Text style={[styles.sectionSubtitle, { color: colors.textMute, marginLeft: 4 }]}>
              {language === 'sw' ? 'VIFAA NA USIMAMIZI' : 'TOOLS & SERVICES'}
            </Text>
            <View style={{ gap: 12, marginTop: 8 }}>
              {features.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => router.push(item.route)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                  accessibilityHint={item.subtitle}
                >
                  <BlurView intensity={isDark ? 20 : 60} tint={isDark ? 'dark' : 'light'} style={[styles.featCard, { borderColor: colors.border }]}>
                    <LinearGradient colors={[item.color + '10', 'transparent']} style={StyleSheet.absoluteFill} />
                    <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                      {item.icon}
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
                      <Text style={[styles.cardSubtitle, { color: colors.textMute }]}>{item.subtitle}</Text>
                    </View>
                    <ChevronRight size={18} color={colors.textMute} />
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 8 : 24, paddingBottom: 10 },
  title: { fontSize: 28, fontFamily: 'Inter_900Black', letterSpacing: -0.8 },
  scroll: { paddingHorizontal: 16, paddingTop: 12, gap: 16 },
  
  // Selector Card
  selectorCard: {
    padding: 16,
  },
  selectLabel: {
    fontSize: 9,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1,
    marginBottom: 8,
  },
  selectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectValue: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  dropdownContent: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dropdownItemText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },

  // Segment Block
  segmentBlock: {
    marginTop: 4,
  },
  sectionSubtitle: {
    fontSize: 9,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1,
    marginBottom: 10,
  },
  segmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    borderRadius: 24,
  },
  segmentCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 13,
  },

  // Zones Card List
  zonesCard: {
    padding: 16,
  },
  zonesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  zonesTitle: {
    fontSize: 15,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.2,
  },
  zonesList: {
    gap: 12,
  },
  zoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  zoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusBadgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  zoneLabelText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  zoneRight: {
    alignItems: 'flex-end',
  },
  zoneRateText: {
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
  },
  zoneAreaText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginTop: 8,
  },

  // Nutrition checklist
  nutritionCard: {
    padding: 16,
  },
  nutritionTitle: {
    fontSize: 15,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.2,
    marginBottom: 14,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionCol: {
    flex: 1,
    gap: 8,
  },
  nutritionHeaderLow: {
    color: '#EF4444',
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    marginBottom: 4,
  },
  nutritionHeaderOk: {
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    marginBottom: 4,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nutritionItemText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },

  // Feat Card bottom list
  featCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});
