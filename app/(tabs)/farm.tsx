import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Sprout, Box, Activity, ChevronRight, ChevronLeft, ChevronDown, Check, AlertTriangle, Layers } from 'lucide-react-native';
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

          {/* Soil Nutrient Analysis */}
          <Card variant="solid" style={[styles.nutrientCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.nutrientHeader}>
              <Text style={[styles.nutrientTitle, { color: colors.text }]}>
                {language === 'sw' ? 'Uchambuzi wa Virutubisho vya Udongo' : 'Soil Nutrient Analysis'}
              </Text>
              <View style={[styles.updateBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.updateBadgeText, { color: colors.primary }]}>
                  {language === 'sw' ? 'Kusasishwa masaa 2' : 'Update 2h'}
                </Text>
              </View>
            </View>

            <View style={styles.nutrientGrid}>
              {/* Nitrogen (N) */}
              <View style={[styles.nutrientCol, { backgroundColor: isDark ? '#211812' : '#FDF6E2', borderColor: isDark ? '#5B3E12' : '#F0C987' }]}>
                <Text style={[styles.nutrientElem, { color: colors.text }]}>Nitrogen (N)</Text>
                <Text style={[styles.nutrientStatus, { color: '#D97706' }]}>
                  {language === 'sw' ? 'Chini (-15%)' : 'Low (-15%)'}
                </Text>
                <View style={styles.miniProgressBg}>
                  <View style={[styles.miniProgressFill, { width: '40%', backgroundColor: '#D97706' }]} />
                </View>
              </View>

              {/* Phosphorus (P) */}
              <View style={[styles.nutrientCol, { backgroundColor: isDark ? '#111C11' : '#E8F5E9', borderColor: isDark ? '#1C3B1C' : '#A5D6A7' }]}>
                <Text style={[styles.nutrientElem, { color: colors.text }]}>Phosphorus (P)</Text>
                <Text style={[styles.nutrientStatus, { color: colors.primary }]}>
                  {language === 'sw' ? 'Safi (Imara)' : 'Optimal (Stable)'}
                </Text>
                <View style={styles.miniProgressBg}>
                  <View style={[styles.miniProgressFill, { width: '85%', backgroundColor: colors.primary }]} />
                </View>
              </View>

              {/* Potassium (K) */}
              <View style={[styles.nutrientCol, { backgroundColor: isDark ? '#221111' : '#FFEBEE', borderColor: isDark ? '#5B1E1E' : '#FFCDD2' }]}>
                <Text style={[styles.nutrientElem, { color: colors.text }]}>Potassium (K)</Text>
                <Text style={[styles.nutrientStatus, { color: '#EF4444' }]}>
                  {language === 'sw' ? 'Pungufu (-22%)' : 'Deficient (-22%)'}
                </Text>
                <View style={styles.miniProgressBg}>
                  <View style={[styles.miniProgressFill, { width: '25%', backgroundColor: '#EF4444' }]} />
                </View>
              </View>
            </View>
          </Card>

          {/* Urgent Recommendations */}
          <View style={styles.recSection}>
            <Text style={[styles.sectionSubtitle, { color: colors.textMute, marginLeft: 4 }]}>
              {language === 'sw' ? 'MAPENDEKEZO YA HARAKA' : 'URGENT RECOMMENDATIONS'}
            </Text>
            <View style={{ gap: 12, marginTop: 8 }}>
              {/* Recommendation 1 */}
              <Card variant="solid" style={[styles.recCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.recHeader}>
                  <View style={[styles.bulletPoint, { backgroundColor: '#D97706' }]} />
                  <Text style={[styles.recTitle, { color: colors.text }]}>
                    {language === 'sw' ? 'Weka Naitrojeni (Urea)' : 'Apply Nitrogen (Urea)'}
                  </Text>
                </View>
                <Text style={[styles.recBody, { color: colors.textMute }]}>
                  {language === 'sw'
                    ? 'Mkulima anapima unyevu wa udongo kwenye shamba la ngano akitumia kipimo cha kidijitali.'
                    : 'A farmer tests soil moisture in a wheat field using a digital meter.'}
                </Text>
                <View style={styles.recActionRow}>
                  <TouchableOpacity style={[styles.recBtnFilled, { backgroundColor: colors.primary }]} activeOpacity={0.8}>
                    <Text style={styles.recBtnTextFilled}>
                      {language === 'sw' ? 'Weka Sasa' : 'Apply Now'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.recBtnOutlined, { borderColor: colors.border }]} activeOpacity={0.8}>
                    <Text style={[styles.recBtnTextOutlined, { color: colors.text }]}>
                      {language === 'sw' ? 'Maelezo' : 'Details'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card>

              {/* Recommendation 2 */}
              <Card variant="solid" style={[styles.recCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.recHeader}>
                  <View style={[styles.bulletPoint, { backgroundColor: '#EF4444' }]} />
                  <Text style={[styles.recTitle, { color: colors.text }]}>
                    {language === 'sw' ? 'Kiongeza Potash (Potash Booster)' : 'Potash Booster'}
                  </Text>
                </View>
                <Text style={[styles.recBody, { color: colors.textMute }]}>
                  {language === 'sw'
                    ? 'Mtu aliyeshika mimea mibichi ya basil yenye mizizi inayoonekana, akiwa amevaa aproni ya kijani.'
                    : 'Person holding fresh basil plants with visible roots, wearing a green apron.'}
                </Text>
                <View style={styles.recActionRow}>
                  <TouchableOpacity style={[styles.recBtnFilled, { backgroundColor: colors.primary }]} activeOpacity={0.8}>
                    <Text style={styles.recBtnTextFilled}>
                      {language === 'sw' ? 'Ratiba' : 'Schedule'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.recBtnOutlined, { borderColor: colors.border }]} activeOpacity={0.8}>
                    <Text style={[styles.recBtnTextOutlined, { color: colors.text }]}>
                      {language === 'sw' ? 'Maelezo' : 'Details'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </View>
          </View>

          {/* Application Schedule Calendar */}
          <Card variant="solid" style={[styles.scheduleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.scheduleHeader}>
              <Text style={[styles.scheduleTitle, { color: colors.text }]}>
                {language === 'sw' ? 'Ratiba ya Uwekaji' : 'Application Schedule'}
              </Text>
              <View style={styles.scheduleNav}>
                <TouchableOpacity style={styles.arrowBtn}>
                  <ChevronLeft size={16} color={colors.textMute} />
                </TouchableOpacity>
                <Text style={[styles.monthLabel, { color: colors.text }]}>
                  {language === 'sw' ? 'Oktoba 2024' : 'October 2024'}
                </Text>
                <TouchableOpacity style={styles.arrowBtn}>
                  <ChevronRight size={16} color={colors.textMute} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.calendarStrip}>
              {/* Day headers */}
              <View style={styles.dayNamesRow}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                  <Text key={idx} style={[styles.dayNameLabel, { color: colors.textMute }]}>
                    {day}
                  </Text>
                ))}
              </View>
              {/* Day numbers */}
              <View style={styles.dayNumbersRow}>
                {[
                  { num: '28', active: false },
                  { num: '29', active: false },
                  { num: '1', active: false },
                  { num: '2', active: false },
                  { num: '3', active: true },
                  { num: '4', active: false },
                  { num: '5', active: false }
                ].map((item, idx) => (
                  <View key={idx} style={styles.dayNumCell}>
                    <TouchableOpacity
                      style={[
                        styles.dayCircle,
                        item.active && { backgroundColor: colors.primary }
                      ]}
                      disabled={!item.active}
                    >
                      <Text
                        style={[
                          styles.dayNumText,
                          { color: item.active ? '#FFFFFF' : colors.text },
                          item.active && { fontFamily: 'Inter_900Black' }
                        ]}
                      >
                        {item.num}
                      </Text>
                    </TouchableOpacity>
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

  // Nutrient Card
  nutrientCard: {
    padding: 16,
  },
  nutrientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nutrientTitle: {
    fontSize: 15,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.2,
  },
  updateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  updateBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 0.5,
  },
  nutrientGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  nutrientCol: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  nutrientElem: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  nutrientStatus: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
  },
  miniProgressBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Urgent recommendations
  recSection: {
    marginTop: 4,
  },
  recCard: {
    padding: 16,
    gap: 8,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  recTitle: {
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
  },
  recBody: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    lineHeight: 18,
  },
  recActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  recBtnFilled: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recBtnTextFilled: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
  },
  recBtnOutlined: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recBtnTextOutlined: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },

  // Calendar Schedule
  scheduleCard: {
    padding: 16,
  },
  scheduleTitle: {
    fontSize: 15,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrowBtn: {
    padding: 4,
  },
  monthLabel: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
  },
  calendarStrip: {
    gap: 12,
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  dayNameLabel: {
    width: 32,
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  dayNumbersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  dayNumCell: {
    alignItems: 'center',
    gap: 4,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNumText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
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
