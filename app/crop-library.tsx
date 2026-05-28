import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Leaf, Droplets, Sun, Sprout, TrendingUp, Clock, PlayCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../constants/Theme';
import { chat } from '../lib/ai';

const { width: SW } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'staple', title: 'Nafaka & Chakula Kikuu', subtitle: 'Msingi wa usalama wa chakula wa kila siku' },
  { id: 'cash', title: 'Mazao ya Biashara', subtitle: 'Kwa ajili ya masoko makubwa ya ndani na nje' },
  { id: 'horticulture', title: 'Matunda, Mboga & Viungo', subtitle: 'Mzunguko wa haraka, faida ya haraka' },
];

const CROPS = [
  { 
    id: 'maize', nameEn: 'Maize', nameSw: 'Mahindi', category: 'staple',
    img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400',
    duration: 'Miezi 3-4', difficulty: 'Kati', profit: 'Kati', water: 'Wastani', sun: 'Jua Kamili',
    desc: 'Zao kuu la chakula Tanzania. Hustawi maeneo mengi yenye mvua za kutosha.'
  },
  { 
    id: 'rice', nameEn: 'Rice', nameSw: 'Mpunga', category: 'staple',
    img: 'https://images.unsplash.com/photo-1530335032608-f40445a6c1e9?auto=format&fit=crop&q=80&w=400',
    duration: 'Miezi 4-5', difficulty: 'Nguvu', profit: 'Juu', water: 'Mingi Sana', sun: 'Jua Kamili',
    desc: 'Hulimwa sana mabondeni Mbeya, Morogoro, na Shinyanga. Hulipa sana kibiashara.'
  },
  { 
    id: 'beans', nameEn: 'Beans', nameSw: 'Maharage', category: 'staple',
    img: 'https://images.unsplash.com/photo-1551608674-d4b3ff2efbb7?auto=format&fit=crop&q=80&w=400',
    duration: 'Siku 60-90', difficulty: 'Rahisi', profit: 'Kati', water: 'Wastani', sun: 'Jua Kamili',
    desc: 'Hulimwa sana nyanda za juu. Husaidia kurudisha nitrojeni kwenye udongo.'
  },
  { 
    id: 'cassava', nameEn: 'Cassava', nameSw: 'Muhogo', category: 'staple',
    img: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=400',
    duration: 'Miezi 9-12', difficulty: 'Rahisi', profit: 'Kati', water: 'Kidogo', sun: 'Jua Kamili',
    desc: 'Zao linalostahimili ukame mkali. Hulimwa sana kanda ya ziwa, Pwani na kusini.'
  },
  { 
    id: 'sweetpotato', nameEn: 'Sweet Potato', nameSw: 'Viazi Vitamu', category: 'staple',
    img: 'https://images.unsplash.com/photo-1596525164996-857e53f19e7a?auto=format&fit=crop&q=80&w=400',
    duration: 'Miezi 3-5', difficulty: 'Rahisi', profit: 'Kati', water: 'Wastani', sun: 'Jua Kamili',
    desc: 'Hukua haraka na kufunika ardhi. Hutoa chakula wakati wa njaa na hujazana mizizi kwa urahisi.'
  },
  { 
    id: 'sorghum', nameEn: 'Sorghum', nameSw: 'Mtama', category: 'staple',
    img: 'https://images.unsplash.com/photo-1597816001099-0158bc56184a?auto=format&fit=crop&q=80&w=400',
    duration: 'Miezi 3-4', difficulty: 'Rahisi', profit: 'Chini', water: 'Kidogo Sana', sun: 'Jua Kali',
    desc: 'Hustahimili ukame wa hali ya juu. Zao zuri kwa kanda kame kama Dodoma.'
  },
  { 
    id: 'cashew', nameEn: 'Cashew Nuts', nameSw: 'Korosho', category: 'cash',
    img: 'https://images.unsplash.com/photo-1533742468351-4d40abcb6478?auto=format&fit=crop&q=80&w=400',
    duration: 'Miaka 3+ (Mavuno)', difficulty: 'Kati', profit: 'Juu Sana', water: 'Kidogo', sun: 'Jua Kamili',
    desc: 'Zao la utajiri Kusini mwa Tanzania (Mtwara, Lindi). Huhitaji dawa za ukungu mara kwa mara.'
  },
  { 
    id: 'coffee', nameEn: 'Coffee', nameSw: 'Kahawa', category: 'cash',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400',
    duration: 'Miaka 3-5 (Mavuno)', difficulty: 'Nguvu', profit: 'Juu', water: 'Mingi', sun: 'Kivuli Kiasi',
    desc: 'Zao kuu la biashara (Arabica kaskazini/kusini, Robusta Kagera). Linaleta fedha za kigeni.'
  },
  { 
    id: 'cotton', nameEn: 'Cotton', nameSw: 'Pamba', category: 'cash',
    img: 'https://images.unsplash.com/photo-1502472458406-8d62dcce474f?auto=format&fit=crop&q=80&w=400',
    duration: 'Miezi 5-6', difficulty: 'Nguvu', profit: 'Kati', water: 'Wastani', sun: 'Jua Kamili',
    desc: '"Dhahabu Nyeupe" inayolimwa sana Kanda ya Ziwa. Huhitaji udhibiti mkali wa wadudu.'
  },
  { 
    id: 'sunflower', nameEn: 'Sunflower', nameSw: 'Alizeti', category: 'cash',
    img: 'https://images.unsplash.com/photo-1558500259-22a868427ce2?auto=format&fit=crop&q=80&w=400',
    duration: 'Siku 90-120', difficulty: 'Rahisi', profit: 'Kati', water: 'Kidogo', sun: 'Jua Kamili',
    desc: 'Hustahimili ukame. Hustawi sana Dodoma na Singida kwa uzalishaji wa mafuta ya kula.'
  },
  {
    id: 'tea', nameEn: 'Tea', nameSw: 'Chai', category: 'cash',
    img: 'https://images.unsplash.com/photo-1596637373007-9304a3f3a8b4?auto=format&fit=crop&q=80&w=400',
    duration: 'Miaka 3+', difficulty: 'Nguvu', profit: 'Juu', water: 'Mingi Sana', sun: 'Jua Kiasi',
    desc: 'Hulimwa nyanda za juu zenye baridi na mvua nyingi kama Mufindi na Lushoto.'
  },
  { 
    id: 'tomato', nameEn: 'Tomatoes', nameSw: 'Nyanya', category: 'horticulture',
    img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400',
    duration: 'Miezi 2-3', difficulty: 'Nguvu', profit: 'Juu', water: 'Mingi', sun: 'Jua Kamili',
    desc: 'Zao la biashara la haraka. Linahitaji matunzo na dawa za kuzuia magonjwa ya kuvu.'
  },
  { 
    id: 'onion', nameEn: 'Onions', nameSw: 'Vitunguu', category: 'horticulture',
    img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=400',
    duration: 'Miezi 3-4', difficulty: 'Kati', profit: 'Juu Sana', water: 'Wastani', sun: 'Jua Kamili',
    desc: 'Vitunguu vya Singida na Mang\'ola vina soko kubwa Afrika Mashariki.'
  },
  { 
    id: 'avocado', nameEn: 'Avocado', nameSw: 'Parachichi', category: 'horticulture',
    img: 'https://images.unsplash.com/photo-1517666005606-1eb8a614d95b?auto=format&fit=crop&q=80&w=400',
    duration: 'Miaka 3+', difficulty: 'Kati', profit: 'Juu Sana', water: 'Wastani', sun: 'Jua Kamili',
    desc: 'Dhahabu ya kijani Njombe na Mbeya. Soko lake linakua kwa kasi kubwa kimataifa (Hass).'
  },
  { 
    id: 'banana', nameEn: 'Banana', nameSw: 'Ndizi', category: 'horticulture',
    img: 'https://images.unsplash.com/photo-1601002888204-5838cc518e38?auto=format&fit=crop&q=80&w=400',
    duration: 'Miezi 9-12', difficulty: 'Kati', profit: 'Juu', water: 'Mingi', sun: 'Kiasi',
    desc: 'Chakula kikuu Kilimanjaro na Kagera. Inahitaji unyevu na mboji nyingi.'
  },
  { 
    id: 'cloves', nameEn: 'Cloves', nameSw: 'Karafuu', category: 'horticulture',
    img: 'https://images.unsplash.com/photo-1606822263435-0ce1b88e0018?auto=format&fit=crop&q=80&w=400',
    duration: 'Miaka 5+ (Mavuno)', difficulty: 'Kati', profit: 'Juu Sana', water: 'Mingi', sun: 'Jua Kamili',
    desc: 'Zao maarufu la Visiwa vya Zanzibar na Pemba. Hutumika kama kiungo duniani kote.'
  }
];

export default function CropLibraryScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [details, setDetails] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchCropDetails = async (crop: any) => {
    setSelectedCrop(crop);
    setDetails('');
    setLoading(true);
    try {
      const response = await chat([
        { role: 'user', content: `Nipe mwongozo kamili na wa ubunifu wa kilimo cha ${crop.nameSw}. Jumuisha: 1. Maandalizi ya shamba, 2. Umbali wa kupanda, 3. Magonjwa makuu, 4. Uvunaji. Fupisha kwa nukta (bullet points) vizuri.` }
      ]);
      setDetails(response);
    } catch (e) {
      setDetails("Kuna changamoto ya mtandao kufikia AI. Tafadhali jaribu tena baadaye.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn}>
          <ChevronLeft color={colors.text} size={28} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Maktaba ya Mazao</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}>
        {CATEGORIES.map(cat => {
          const catCrops = CROPS.filter(c => c.category === cat.id);
          return (
            <View key={cat.id} style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitleText, { color: colors.text }]}>{cat.title}</Text>
                <Text style={[styles.sectionSubtitleText, { color: colors.textMute }]}>{cat.subtitle}</Text>
              </View>

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.horizontalScroll}
                snapToInterval={SW * 0.45 + 16}
                decelerationRate="fast"
              >
                {catCrops.map((crop, index) => {
                  const isFeatured = index === 0;
                  return (
                    <TouchableOpacity 
                      key={crop.id} 
                      style={[
                        styles.card, 
                        { backgroundColor: colors.card, borderColor: colors.border },
                        isFeatured ? styles.cardFeatured : styles.cardNormal
                      ]}
                      onPress={() => fetchCropDetails(crop)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: crop.img }} style={[styles.cardImg, isFeatured && styles.cardImgFeatured]} />
                      <View style={styles.cardBody}>
                        <Text style={[styles.cardTitle, isFeatured && styles.cardTitleFeatured, { color: colors.text }]} numberOfLines={1}>
                          {crop.nameSw}
                        </Text>
                        <Text style={[styles.cardSub, { color: colors.textMute }]} numberOfLines={1}>{crop.nameEn}</Text>
                        
                        <View style={styles.badgeRow}>
                          <View style={[styles.microBadge, { backgroundColor: crop.profit === 'Juu Sana' ? '#22d15a20' : colors.border }]}>
                            <TrendingUp size={10} color={crop.profit === 'Juu Sana' ? '#22d15a' : colors.textMute} />
                            <Text style={[styles.microBadgeText, { color: crop.profit === 'Juu Sana' ? '#22d15a' : colors.textMute }]}>{crop.profit}</Text>
                          </View>
                          <View style={[styles.microBadge, { backgroundColor: colors.border }]}>
                            <Clock size={10} color={colors.textMute} />
                            <Text style={[styles.microBadgeText, { color: colors.textMute }]}>{crop.duration}</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>

      {/* Enhanced Crop Details Modal */}
      <Modal visible={!!selectedCrop} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.6)' }]} />
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedCrop?.nameSw}</Text>
                <Text style={[styles.modalSub, { color: colors.textMute }]}>{selectedCrop?.nameEn}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedCrop(null)} style={[styles.closeBtn, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text, fontFamily: 'Inter_700Bold' }}>X</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              <Image source={{ uri: selectedCrop?.img }} style={styles.modalImg} />
              
              <Text style={[styles.cropDescription, { color: colors.text }]}>{selectedCrop?.desc}</Text>

              {/* Creative Stats Grid */}
              <View style={styles.statsGrid}>
                <View style={[styles.statBox, { backgroundColor: colors.background }]}>
                  <Clock size={20} color={colors.primary} />
                  <Text style={[styles.statValue, { color: colors.text }]}>{selectedCrop?.duration}</Text>
                  <Text style={[styles.statLabel, { color: colors.textMute }]}>Muda wa Kukua</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: colors.background }]}>
                  <TrendingUp size={20} color="#f59e0b" />
                  <Text style={[styles.statValue, { color: colors.text }]}>{selectedCrop?.profit}</Text>
                  <Text style={[styles.statLabel, { color: colors.textMute }]}>Faida / Soko</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: colors.background }]}>
                  <Sprout size={20} color="#3b82f6" />
                  <Text style={[styles.statValue, { color: colors.text }]}>{selectedCrop?.difficulty}</Text>
                  <Text style={[styles.statLabel, { color: colors.textMute }]}>Ugumu</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: colors.background }]}>
                  <Droplets size={20} color="#0ea5e9" />
                  <Text style={[styles.statValue, { color: colors.text }]}>{selectedCrop?.water}</Text>
                  <Text style={[styles.statLabel, { color: colors.textMute }]}>Mahitaji ya Maji</Text>
                </View>
              </View>

              <View style={{ marginTop: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <PlayCircle size={24} color={colors.primary} />
                  <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Mwongozo wa AI</Text>
                </View>

                {loading ? (
                  <View style={{ padding: 40, alignItems: 'center', backgroundColor: colors.background, borderRadius: 16 }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ color: colors.textMute, marginTop: 12, fontFamily: 'Inter_500Medium' }}>Sankofa AI inachambua mwongozo wako...</Text>
                  </View>
                ) : (
                  <View style={{ backgroundColor: colors.background, padding: 20, borderRadius: 16 }}>
                    <Text style={[styles.detailsText, { color: colors.text }]}>{details}</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  title: { fontSize: 22, fontFamily: 'InstrumentSerif_400Regular' },
  
  sectionContainer: { marginBottom: 32 },
  sectionHeader: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitleText: { fontSize: 24, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.5 },
  sectionSubtitleText: { fontSize: 13, fontFamily: 'Inter_500Medium', marginTop: 2 },
  
  horizontalScroll: { paddingHorizontal: 16, gap: 16 },
  
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2
  },
  cardNormal: { width: SW * 0.45 },
  cardFeatured: { width: SW * 0.70 },
  
  cardImg: { width: '100%', height: 120 },
  cardImgFeatured: { height: 160 },
  
  cardBody: { padding: 12 },
  cardTitle: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  cardTitleFeatured: { fontSize: 18 },
  cardSub: { fontFamily: 'Inter_500Medium', fontSize: 12, marginBottom: 8 },
  
  badgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  microBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, gap: 4 },
  microBadgeText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: {
    height: '90%',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 20
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  modalTitle: { fontSize: 28, fontFamily: 'InstrumentSerif_400Regular', letterSpacing: -0.5 },
  modalSub: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginTop: 2 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  modalImg: { width: '100%', height: 200, borderRadius: 16, marginBottom: 16 },
  cropDescription: { fontSize: 15, fontFamily: 'Inter_500Medium', lineHeight: 22, marginBottom: 20 },
  
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statBox: { width: '48%', padding: 16, borderRadius: 16, alignItems: 'flex-start', gap: 8 },
  statValue: { fontSize: 16, fontFamily: 'Inter_700Bold', marginTop: 4 },
  statLabel: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  detailsText: { fontSize: 15, fontFamily: 'Inter_500Medium', lineHeight: 24 },
});
