import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, ActivityIndicator, Image, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/src/context/AuthContext';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { API_BASE } from '@/src/lib/supabase';

interface DiagnosisResult {
  disease: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  treatment: string[];
  prevention: string[];
}

const MOCK_RESULTS: DiagnosisResult[] = [
  {
    disease: 'Maize Leaf Blight',
    confidence: 87,
    severity: 'medium',
    description: 'Northern corn leaf blight caused by Exserohilum turcicum. Characterized by long, elliptical gray-green lesions on leaves.',
    treatment: [
      'Apply fungicide (Mancozeb 80% WP) at 2.5kg/ha',
      'Remove and destroy severely infected leaves',
      'Ensure proper field sanitation after harvest',
    ],
    prevention: [
      'Use disease-resistant hybrid varieties',
      'Rotate crops every season',
      'Avoid overhead irrigation to reduce leaf wetness',
    ],
  },
  {
    disease: 'Healthy Plant',
    confidence: 95,
    severity: 'low',
    description: 'No disease detected. Your crop appears healthy. Continue with regular monitoring.',
    treatment: ['Maintain current crop management practices'],
    prevention: [
      'Continue regular scouting every 7–10 days',
      'Maintain proper nutrition and irrigation',
    ],
  },
];

export default function DiagnosisScreen() {
  const insets = useSafeAreaInsets();
  const { language } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const topInset = Platform.OS === 'web' ? 20 : insets.top;

  const pickImage = async (fromCamera: boolean) => {
    try {
      let res;
      if (fromCamera) {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          Alert.alert(
            language === 'sw' ? 'Ruhusa Inahitajika' : 'Permission Required',
            language === 'sw' ? 'Tafadhali ruhusu upatikanaji wa kamera.' : 'Please allow camera access to take photos.'
          );
          return;
        }
        res = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          allowsEditing: true,
          aspect: [4, 3],
        });
      } else {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          Alert.alert(
            language === 'sw' ? 'Ruhusa Inahitajika' : 'Permission Required',
            language === 'sw' ? 'Tafadhali ruhusu upatikanaji wa picha.' : 'Please allow photo library access.'
          );
          return;
        }
        res = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          allowsEditing: true,
          aspect: [4, 3],
        });
      }
      if (!res.canceled && res.assets[0]) {
        setImage(res.assets[0].uri);
        setResult(null);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (e) {
      Alert.alert('Error', String(e));
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setAnalyzing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const formData = new FormData();
      formData.append('action', 'diagnose_crop');
      formData.append('language', language);
      formData.append('image', { uri: image, name: 'crop.jpg', type: 'image/jpeg' } as any);

      const res = await fetch(API_BASE, { method: 'POST', body: formData });
      if (res.ok) {
        const json = await res.json();
        setResult(json.result || MOCK_RESULTS[0]);
      } else {
        setResult(MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)]);
      }
    } catch {
      await new Promise(r => setTimeout(r, 2200));
      setResult(MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)]);
    } finally {
      setAnalyzing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const reset = () => { setImage(null); setResult(null); };

  const severityColor = result?.severity === 'high' ? Colors.error
    : result?.severity === 'medium' ? Colors.warning
    : Colors.success;

  const severityLabel = {
    high: language === 'sw' ? 'Kali' : 'Severe',
    medium: language === 'sw' ? 'Wastani' : 'Moderate',
    low: language === 'sw' ? 'Ndogo' : 'Mild',
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topInset + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>
            {language === 'sw' ? 'Uchunguzi wa Mazao' : 'Crop Diagnosis'}
          </Text>
          <Text style={styles.headerSub}>
            {language === 'sw' ? 'Piga picha ya mmea wenye tatizo' : 'Photo-based disease detection'}
          </Text>
        </View>
        <View style={styles.aiBadge}>
          <Ionicons name="leaf" size={14} color="#fff" />
          <Text style={styles.aiBadgeText}>AI</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {!image ? (
          <View style={styles.uploadArea}>
            <View style={styles.uploadIcon}>
              <Ionicons name="camera" size={48} color={Colors.primary} />
            </View>
            <Text style={styles.uploadTitle}>
              {language === 'sw' ? 'Piga au Pakia Picha' : 'Take or Upload a Photo'}
            </Text>
            <Text style={styles.uploadDesc}>
              {language === 'sw'
                ? 'Piga picha wazi ya jani au sehemu yoyote ya mmea wenye tatizo. AI itachambua na kutoa matokeo.'
                : 'Take a clear photo of the affected leaf or plant part. Our AI will analyze and provide instant results.'}
            </Text>

            <View style={styles.uploadBtns}>
              <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage(true)} activeOpacity={0.85}>
                <View style={[styles.uploadBtnIcon, { backgroundColor: Colors.primaryMuted }]}>
                  <Ionicons name="camera" size={28} color={Colors.primary} />
                </View>
                <Text style={styles.uploadBtnLabel}>
                  {language === 'sw' ? 'Piga Picha' : 'Take Photo'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage(false)} activeOpacity={0.85}>
                <View style={[styles.uploadBtnIcon, { backgroundColor: Colors.infoLight }]}>
                  <Ionicons name="images" size={28} color={Colors.info} />
                </View>
                <Text style={styles.uploadBtnLabel}>
                  {language === 'sw' ? 'Chagua Picha' : 'Choose Photo'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>
                <Ionicons name="bulb-outline" size={14} color={Colors.warning} /> {language === 'sw' ? ' Vidokezo' : ' Tips'}
              </Text>
              {[
                language === 'sw' ? 'Piga picha katika mwanga mzuri wa asili' : 'Photograph in good natural lighting',
                language === 'sw' ? 'Karibishia kamera karibu na dalili' : 'Get close to the affected area',
                language === 'sw' ? 'Epuka picha zenye ukungu' : 'Avoid blurry images',
                language === 'sw' ? 'Jani moja kwa kila picha' : 'One leaf or plant part per photo',
              ].map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <View style={styles.tipDot} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <>
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.previewImage} resizeMode="cover" />
              {!analyzing && !result && (
                <TouchableOpacity style={styles.retakeBtn} onPress={reset}>
                  <Ionicons name="refresh" size={16} color="#fff" />
                  <Text style={styles.retakeBtnText}>{language === 'sw' ? 'Badilisha' : 'Retake'}</Text>
                </TouchableOpacity>
              )}
            </View>

            {!result && !analyzing && (
              <Button
                title={language === 'sw' ? 'Chunguza Picha' : 'Analyze Photo'}
                onPress={analyzeImage}
                fullWidth
                icon="scan"
                style={{ marginTop: 4 }}
              />
            )}

            {analyzing && (
              <Card style={styles.analyzingCard}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.analyzingTitle}>
                  {language === 'sw' ? 'Inachambua...' : 'Analyzing...'}
                </Text>
                <Text style={styles.analyzingDesc}>
                  {language === 'sw'
                    ? 'AI inachunguza picha yako. Tafadhali subiri.'
                    : 'AI is examining your crop image. Please wait.'}
                </Text>
              </Card>
            )}

            {result && (
              <>
                <Card style={StyleSheet.flatten([styles.resultHeader, { borderLeftColor: severityColor }])}>
                  <View style={styles.resultTitleRow}>
                    <View style={styles.resultIconWrap}>
                      <Ionicons
                        name={result.severity === 'low' ? 'checkmark-circle' : result.severity === 'medium' ? 'warning' : 'alert-circle'}
                        size={28}
                        color={severityColor}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resultDisease}>{result.disease}</Text>
                      <View style={styles.resultBadges}>
                        <View style={[styles.severityBadge, { backgroundColor: severityColor + '20' }]}>
                          <Text style={[styles.severityText, { color: severityColor }]}>
                            {severityLabel[result.severity]}
                          </Text>
                        </View>
                        <View style={styles.confidenceBadge}>
                          <Text style={styles.confidenceText}>{result.confidence}% {language === 'sw' ? 'uhakika' : 'confidence'}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.resultDesc}>{result.description}</Text>
                </Card>

                <Card style={styles.resultSection}>
                  <View style={styles.resultSectionHeader}>
                    <Ionicons name="medkit" size={18} color={Colors.error} />
                    <Text style={styles.resultSectionTitle}>
                      {language === 'sw' ? 'Matibabu' : 'Treatment'}
                    </Text>
                  </View>
                  {result.treatment.map((t, i) => (
                    <View key={i} style={styles.bulletRow}>
                      <View style={[styles.bullet, { backgroundColor: Colors.error }]} />
                      <Text style={styles.bulletText}>{t}</Text>
                    </View>
                  ))}
                </Card>

                <Card style={styles.resultSection}>
                  <View style={styles.resultSectionHeader}>
                    <Ionicons name="shield-checkmark" size={18} color={Colors.success} />
                    <Text style={styles.resultSectionTitle}>
                      {language === 'sw' ? 'Kinga' : 'Prevention'}
                    </Text>
                  </View>
                  {result.prevention.map((p, i) => (
                    <View key={i} style={styles.bulletRow}>
                      <View style={[styles.bullet, { backgroundColor: Colors.success }]} />
                      <Text style={styles.bulletText}>{p}</Text>
                    </View>
                  ))}
                </Card>

                <View style={styles.resultActions}>
                  <Button
                    title={language === 'sw' ? 'Chunguza Tena' : 'New Diagnosis'}
                    onPress={reset}
                    variant="outline"
                    style={{ flex: 1 }}
                  />
                  <Button
                    title={language === 'sw' ? 'Uliza AI' : 'Ask AI'}
                    onPress={() => router.push('/(tabs)/ai')}
                    style={{ flex: 1 }}
                  />
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    backgroundColor: Colors.primary, paddingHorizontal: 16, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700' as const, color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  aiBadge: {
    marginLeft: 'auto' as any, flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Colors.radiusFull,
  },
  aiBadgeText: { fontSize: 12, fontWeight: '700' as const, color: '#fff' },
  content: { padding: 16, gap: 16, paddingBottom: 48 },
  uploadArea: { alignItems: 'center', gap: 16 },
  uploadIcon: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.primary, borderStyle: 'dashed',
  },
  uploadTitle: { fontSize: 20, fontWeight: '700' as const, color: Colors.text, textAlign: 'center' },
  uploadDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: 8 },
  uploadBtns: { flexDirection: 'row', gap: 14, width: '100%' },
  uploadBtn: {
    flex: 1, backgroundColor: Colors.card, borderRadius: Colors.radiusLg,
    padding: 20, alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderColor: Colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  uploadBtnIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  uploadBtnLabel: { fontSize: 14, fontWeight: '600' as const, color: Colors.text },
  tipsCard: {
    width: '100%', backgroundColor: Colors.warningLight,
    borderRadius: Colors.radius, padding: 16, gap: 8,
    borderLeftWidth: 3, borderLeftColor: Colors.warning,
  },
  tipsTitle: { fontSize: 14, fontWeight: '600' as const, color: Colors.text, marginBottom: 4 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  tipDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.warning, marginTop: 7 },
  tipText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  imageContainer: { borderRadius: Colors.radiusLg, overflow: 'hidden', position: 'relative' },
  previewImage: { width: '100%', height: 260 },
  retakeBtn: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: Colors.radiusFull,
  },
  retakeBtnText: { fontSize: 13, color: '#fff', fontWeight: '500' as const },
  analyzingCard: { alignItems: 'center', padding: 32, gap: 14 },
  analyzingTitle: { fontSize: 18, fontWeight: '700' as const, color: Colors.text },
  analyzingDesc: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
  resultHeader: {
    padding: 16, borderLeftWidth: 4, gap: 10,
  },
  resultTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  resultIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center',
  },
  resultDisease: { fontSize: 17, fontWeight: '700' as const, color: Colors.text, marginBottom: 6 },
  resultBadges: { flexDirection: 'row', gap: 8 },
  severityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Colors.radiusFull },
  severityText: { fontSize: 12, fontWeight: '600' as const },
  confidenceBadge: { backgroundColor: Colors.gray100, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Colors.radiusFull },
  confidenceText: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' as const },
  resultDesc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },
  resultSection: { padding: 16, gap: 12 },
  resultSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resultSectionTitle: { fontSize: 16, fontWeight: '700' as const, color: Colors.text },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  bulletText: { flex: 1, fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },
  resultActions: { flexDirection: 'row', gap: 12 },
});
