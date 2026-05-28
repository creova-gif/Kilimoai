import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { ChevronLeft, Leaf, Droplets, Sun, AlertTriangle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../constants/Theme';
import { chat } from '../lib/ai';

const { width: SW } = Dimensions.get('window');

const CROPS = [
  { id: 'maize', name: 'Maize / Mahindi', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400' },
  { id: 'beans', name: 'Beans / Maharage', img: 'https://images.unsplash.com/photo-1551608674-d4b3ff2efbb7?auto=format&fit=crop&q=80&w=400' },
  { id: 'tomato', name: 'Tomatoes / Nyanya', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400' },
  { id: 'rice', name: 'Rice / Mpunga', img: 'https://images.unsplash.com/photo-1530335032608-f40445a6c1e9?auto=format&fit=crop&q=80&w=400' },
  { id: 'onion', name: 'Onions / Vitunguu', img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=400' },
  { id: 'sunflower', name: 'Sunflower / Alizeti', img: 'https://images.unsplash.com/photo-1558500259-22a868427ce2?auto=format&fit=crop&q=80&w=400' },
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
        { role: 'user', content: `Nipe mwongozo kamili wa kilimo cha ${crop.name}. Jumuisha: 1. Maandalizi ya shamba, 2. Umbali wa kupanda, 3. Magonjwa makuu, 4. Uvunaji. Fupisha kwa nukta (bullet points) ili iwe rahisi kusoma.` }
      ]);
      setDetails(response);
    } catch (e) {
      setDetails("Kuna changamoto ya mtandao. Tafadhali jaribu tena baadaye.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color={colors.text} size={28} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Maktaba ya Mazao</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {CROPS.map((crop) => (
          <TouchableOpacity 
            key={crop.id} 
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => fetchCropDetails(crop)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: crop.img }} style={styles.cardImg} />
            <View style={styles.cardBody}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{crop.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Crop Details Modal */}
      <Modal visible={!!selectedCrop} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedCrop?.name}</Text>
              <TouchableOpacity onPress={() => setSelectedCrop(null)} style={[styles.closeBtn, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>X</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              <Image source={{ uri: selectedCrop?.img }} style={styles.modalImg} />
              
              <View style={[styles.infoBar, { backgroundColor: colors.background }]}>
                <View style={styles.infoIcon}><Droplets size={18} color="#3b82f6" /><Text style={[styles.infoText, { color: colors.textMute }]}>Maji</Text></View>
                <View style={styles.infoIcon}><Sun size={18} color="#f59e0b" /><Text style={[styles.infoText, { color: colors.textMute }]}>Jua</Text></View>
                <View style={styles.infoIcon}><Leaf size={18} color={colors.primary} /><Text style={[styles.infoText, { color: colors.textMute }]}>Mbolea</Text></View>
              </View>

              <View style={{ marginTop: 24 }}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Mwongozo wa Kilimo (AI)</Text>
                {loading ? (
                  <View style={{ padding: 40, alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ color: colors.textMute, marginTop: 12 }}>Inachambua taarifa...</Text>
                  </View>
                ) : (
                  <Text style={[styles.detailsText, { color: colors.text }]}>{details}</Text>
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
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  title: { fontSize: 20, fontFamily: 'InstrumentSerif_400Regular' },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', padding: 16, justifyContent: 'space-between'
  },
  card: {
    width: (SW - 48) / 2,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#0a3d18', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4
  },
  cardImg: { width: '100%', height: 120 },
  cardBody: { padding: 12 },
  cardTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: {
    height: '85%',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 20
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 24, fontFamily: 'InstrumentSerif_400Regular' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  modalImg: { width: '100%', height: 180, borderRadius: 16, marginBottom: 16 },
  infoBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 16, borderRadius: 12 },
  infoIcon: { alignItems: 'center', gap: 4 },
  infoText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_600SemiBold', marginBottom: 12 },
  detailsText: { fontSize: 15, fontFamily: 'Inter_400Regular', lineHeight: 24 },
});
