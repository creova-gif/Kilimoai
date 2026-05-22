import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions, 
  Image, 
  StatusBar, 
  Platform 
} from 'react-native';
import { 
  X, 
  Zap, 
  Image as ImageIcon, 
  RotateCw, 
  WifiOff,
  Info,
  AlertCircle,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Camera,
  CloudOff,
  CheckCircle2,
  Activity
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../constants/Theme';
import { motion, AnimatePresence } from "motion/react";
import { useTasks } from '../hooks/useTasks';
import { useNotifications } from '../hooks/useNotifications';
import { useKilimoStore } from '../store/useKilimoStore';
import { sendSms } from '../lib/sms';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { diagnoseCropPhoto, aiConfigured, AIError, VisionDiagnosis } from '../lib/ai';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ScanPhase = 'IDLE' | 'SCANNING' | 'ANALYZING' | 'RESULT' | 'ERROR';

const MOCK_BG = 'https://images.unsplash.com/photo-1594488651083-023b8a4a3b1e?q=80&w=2940&auto=format&fit=crop';

// Fallback used only when the AI returns unparseable content — keeps the UI
// from rendering "undefined".
const FALLBACK_RESULT: Required<Pick<VisionDiagnosis, 'disease' | 'severity'>> & { recommendation: string } = {
  disease: 'Diagnosis incomplete',
  severity: 'medium',
  recommendation: 'Picha haikutoa matokeo wazi. Tafadhali piga picha nyingine yenye mwanga mzuri.',
};

export default function ScanScreen() {
  const router = useRouter();
  const { colors, spacing, radius, isDark } = useTheme();
  const { createTask } = useTasks();
  const { scheduleReminder } = useNotifications();
  const addNotification = useKilimoStore((s) => s.addNotification);
  const agroId = useKilimoStore((s) => s.agroId);

  const [phase, setPhase] = useState<ScanPhase>('IDLE');
  const [isOffline, setIsOffline] = useState(false); // Mock offline state
  const [analysisText, setAnalysisText] = useState('Initiating quantum analysis...');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<VisionDiagnosis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Versioning so a stale vision response cannot overwrite a newer one
  const scanSeq = React.useRef(0);

  // Cycle through analysis text to feel agentic
  useEffect(() => {
    if (phase === 'ANALYZING') {
      const texts = [
        'Extracting spectral bio-markers...',
        'Cross-referencing East African pathogen database...',
        'Validating confidence levels...',
        'Compiling predictive treatment plan...'
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setAnalysisText(texts[i]);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const pickPhoto = async (source: 'camera' | 'library') => {
    const perm = source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setErrorMsg('Tafadhali ruhusu app kufikia kamera/picha kwenye mipangilio.');
      setPhase('ERROR');
      return null;
    }
    // quality 0.5 + allowsEditing crops/resizes before we read base64, keeping
    // payload < ~1.5MB on typical phones and avoiding memory spikes from raw
    // 12MP captures.
    const opts = {
      quality: 0.5,
      base64: false,
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    } as const;
    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync(opts)
      : await ImagePicker.launchImageLibraryAsync(opts);
    if (result.canceled) return null;
    return result.assets[0];
  };

  const runVisionDiagnosis = async (source: 'camera' | 'library') => {
    if (!aiConfigured()) {
      setErrorMsg('Sankofa AI haijasanidiwa bado. Wasiliana na msimamizi.');
      setPhase('ERROR');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    const asset = await pickPhoto(source);
    if (!asset) return;

    const seq = ++scanSeq.current;
    setPhotoUri(asset.uri);
    setErrorMsg(null);
    setDiagnosis(null);
    setPhase('SCANNING');

    // Brief cinematic scan -> analyzing transition
    await new Promise((r) => setTimeout(r, 800));
    if (scanSeq.current !== seq) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPhase('ANALYZING');

    try {
      // Read picked file as base64 for the vision proxy. On web, expo-image-picker
      // returns data: URIs which fail readAsStringAsync — handle both paths.
      let base64: string;
      let mimeType = 'image/jpeg';
      if (asset.uri.startsWith('data:')) {
        const m = asset.uri.match(/^data:([^;]+);base64,(.*)$/);
        if (!m) throw new AIError('Picha haikuweza kusomwa. Jaribu picha nyingine.', 'validation');
        mimeType = m[1];
        base64 = m[2];
      } else {
        // Hard cap at 5MB raw to protect lower-end devices from OOM crashes.
        try {
          const info = await FileSystem.getInfoAsync(asset.uri);
          if (info.exists && typeof info.size === 'number' && info.size > 5_000_000) {
            throw new AIError('Picha ni kubwa sana. Tafadhali piga picha nyepesi.', 'validation');
          }
        } catch (e) {
          if (e instanceof AIError) throw e;
          // getInfoAsync may fail on some URIs; proceed and let the read fail.
        }
        base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
        if (asset.uri.toLowerCase().endsWith('.png')) mimeType = 'image/png';
      }

      const result = await diagnoseCropPhoto(base64, { mimeType });
      if (scanSeq.current !== seq) return; // stale

      setDiagnosis(result);
      setPhase('RESULT');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (result.severity === 'critical') {
        fireCriticalSideEffects(result);
      }
    } catch (err) {
      if (scanSeq.current !== seq) return;
      const e = err as AIError;
      const friendly =
        e?.kind === 'validation' ? e.message
        : e?.kind === 'unauthorized' ? 'Tafadhali ingia tena ili kutumia uchunguzi wa picha.'
        : e?.kind === 'network' ? 'Hakuna mtandao. Picha itahifadhiwa na kuchanganuliwa baadaye.'
        : 'Samahani, uchunguzi wa picha umeshindikana. Jaribu tena.';
      setErrorMsg(friendly);
      setPhase('ERROR');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleScan = () => runVisionDiagnosis('camera');
  const handlePickFromGallery = () => runVisionDiagnosis('library');

  /**
   * Critical-severity diagnosis side effects (PRD §2.2 Notification Matrix).
   */
  const fireCriticalSideEffects = async (result: VisionDiagnosis) => {
    if (result.severity !== 'critical') return;
    const disease = result.disease ?? 'Critical crop issue';
    const recommendation = result.actions?.join(' • ') ?? FALLBACK_RESULT.recommendation;

    try {
      await createTask({
        title: `Critical · Isolate ${disease}`,
        titleSw: `Hatari · Tenga mimea (${disease})`,
        description: recommendation,
        category: 'scouting',
        priority: 'critical',
        status: 'pending',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        xpReward: 60,
        farmBlock: 'Block A',
      });

      addNotification({
        title: `⚠️ ${disease} detected`,
        body: recommendation,
        type: 'warning',
      });

      scheduleReminder(
        'Follow-up · Crop diagnosis',
        `Check progress on ${disease} containment.`,
        4 * 60 * 60,
        '/tasks',
      ).catch(() => { /* permission may be denied — silent */ });

      if (agroId?.phoneNumber) {
        sendSms({
          to: agroId.phoneNumber,
          event: 'critical_diagnosis',
          body: `KILIMO AI: ${disease} imegunduliwa. Tenga mimea ndani ya 24h. Angalia app.`,
          meta: { disease },
        }).catch(() => { /* stub may log but never throws */ });
      }
    } catch (err) {
      console.warn('[scan] critical side effects failed:', err);
    }
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scanSeq.current++; // invalidate any in-flight diagnosis
    setPhase('IDLE');
    setPhotoUri(null);
    setDiagnosis(null);
    setErrorMsg(null);
  };

  const toggleNetwork = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsOffline(!isOffline);
  };

  // Advanced Neural Orb for background aesthetics
  const NeuralOrb = ({ color, size, delay, x, y }: any) => (
    <motion.View
      initial={{ x, y, opacity: 0, scale: 0.8 }}
      animate={{ 
        x: [x, x + 40, x - 20, x],
        y: [y, y - 50, y + 30, y],
        opacity: [0.08, 0.15, 0.1, 0.08],
        scale: [1, 1.1, 0.95, 1]
      }}
      transition={{
        duration: 20 + delay / 1000,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={[
        styles.bgOrb,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          filter: Platform.OS === 'web' ? 'blur(90px)' : undefined,
        },
      ]}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Cinematic Camera View */}
      <motion.View 
        animate={{ 
          scale: phase === 'IDLE' ? 1 : 1.05,
          filter: phase === 'ANALYZING' || phase === 'RESULT' ? 'blur(10px)' : 'blur(0px)',
          opacity: phase === 'ANALYZING' ? 0.6 : 1
        }}
        transition={{ type: "spring", damping: 25, stiffness: 70 }}
        style={styles.cameraView}
      >
        <Image
          source={{ uri: photoUri ?? MOCK_BG }}
          style={styles.mockCamera}
        />
        
        {/* Dynamic Scan Line Overlay */}
        <AnimatePresence>
          {phase === 'SCANNING' && (
            <motion.View 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={StyleSheet.absoluteFill}
            >
              <motion.View 
                animate={{ 
                  y: [SCREEN_HEIGHT * 0.15, SCREEN_HEIGHT * 0.75, SCREEN_HEIGHT * 0.15] 
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                style={styles.scanOverlay}
              >
                <LinearGradient
                  colors={['transparent', colors.primary + '80', colors.primary, colors.primary + '80', 'transparent']}
                  style={styles.scanLine}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                />
                <motion.View 
                  animate={{ opacity: [0.1, 0.5, 0.1], scaleY: [1, 2, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                  style={[styles.scanGlow, { backgroundColor: colors.primary + '30' }]} 
                />
              </motion.View>
            </motion.View>
          )}
        </AnimatePresence>
      </motion.View>

      <SafeAreaView style={styles.safeArea}>
        {/* Floating Header */}
        <motion.View 
          animate={{ opacity: phase === 'IDLE' ? 1 : 0, y: phase === 'IDLE' ? 0 : -20 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} accessibilityLabel="Go back">
            <BlurView intensity={40} tint="dark" style={styles.iconButton}>
              <X size={24} color="#ffffff" />
            </BlurView>
          </TouchableOpacity>
          
          <View style={styles.headerTitleBox}>
            <BlurView intensity={30} tint="dark" style={styles.badge}>
              <Sparkles size={12} color={colors.primary} />
              <Text style={styles.badgeText}>KILIMO VISION AI</Text>
            </BlurView>
          </View>

          <TouchableOpacity onPress={toggleNetwork} activeOpacity={0.7} accessibilityLabel="Toggle offline mode">
            <BlurView intensity={40} tint="dark" style={[styles.iconButton, isOffline && { borderColor: '#ef4444' }]}>
              {isOffline ? <WifiOff size={20} color="#ef4444" /> : <Zap size={22} color={colors.primary} />}
            </BlurView>
          </TouchableOpacity>
        </motion.View>

        {/* Offline Warning Toast */}
        <AnimatePresence>
          {isOffline && phase === 'IDLE' && (
            <motion.View
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={styles.offlineToast}
            >
              <BlurView intensity={60} tint="dark" style={styles.offlineInner}>
                <CloudOff size={16} color="#fbbf24" />
                <Text style={styles.offlineText}>Offline Mode: Diagnosis will be queued and synced.</Text>
              </BlurView>
            </motion.View>
          )}
        </AnimatePresence>

        <View style={styles.content}>
          <AnimatePresence mode="wait">
            
            {/* IDLE / SCANNING PHASE */}
            {(phase === 'IDLE' || phase === 'SCANNING') && (
              <motion.View 
                key="scanner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={styles.scannerInterface}
              >
                {/* Aiming Reticle */}
                <View style={styles.reticleContainer}>
                  {[styles.tl, styles.tr, styles.bl, styles.br].map((posStyle, idx) => (
                    <motion.View 
                      key={idx}
                      animate={{ 
                        scale: phase === 'SCANNING' ? 1.08 : 1,
                        opacity: phase === 'SCANNING' ? [0.4, 1, 0.4] : 1,
                        borderColor: phase === 'SCANNING' ? colors.primary : '#ffffff'
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.1 }}
                      style={[styles.corner, posStyle]} 
                    />
                  ))}
                  
                  <AnimatePresence>
                    {phase === 'SCANNING' && (
                      <motion.View 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        style={styles.aiMarkers}
                      >
                        <motion.View 
                          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          style={styles.markerPulse} 
                        />
                        <View style={styles.markerTextContainer}>
                          <Text style={styles.markerText}>LOCKING TARGET</Text>
                        </View>
                      </motion.View>
                    )}
                  </AnimatePresence>
                </View>

                <motion.View animate={{ y: phase === 'SCANNING' ? 20 : 0 }} style={styles.instructions}>
                  <Text style={styles.instructionLarge}>
                    {phase === 'SCANNING' ? 'Hold Steady' : 'Target Crop Anomaly'}
                  </Text>
                  <Text style={styles.instructionSmall}>
                    {phase === 'SCANNING' ? 'Kilimo AI is capturing hyperspectral data...' : 'Ensure the affected leaf is well-lit and in focus.'}
                  </Text>
                </motion.View>
              </motion.View>
            )}

            {/* ANALYZING PHASE */}
            {phase === 'ANALYZING' && (
              <motion.View 
                key="analyzing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                style={styles.analyzingContainer}
              >
                <NeuralOrb color={colors.primary} size={250} x={0} y={0} delay={0} />
                <motion.View
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  style={styles.analyzingRings}
                >
                  <Activity size={48} color={colors.primary} />
                </motion.View>
                <Text style={styles.analyzingTitle}>AI Agronomist Active</Text>
                <Text style={styles.analyzingSubtitle}>{analysisText}</Text>
              </motion.View>
            )}

            {/* ERROR PHASE */}
            {phase === 'ERROR' && (
              <motion.View
                key="error"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                style={styles.resultWrapper}
              >
                <BlurView intensity={isDark ? 40 : 90} tint={isDark ? 'dark' : 'light'} style={[styles.resultCard, { borderColor: 'rgba(239,68,68,0.3)' }]}>
                  <View style={styles.resultHeader}>
                    <View style={[styles.resultIcon, { backgroundColor: '#ef4444' }]}>
                      <AlertCircle size={32} color="#fff" />
                    </View>
                    <View style={styles.resultMeta}>
                      <Text style={[styles.resultName, { color: colors.text }]}>Imeshindikana</Text>
                      <Text style={[styles.confText, { color: colors.textMute }]}>Uchunguzi haukufanyika</Text>
                    </View>
                  </View>
                  <View style={[styles.detailCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                    <Text style={[styles.detailBody, { color: colors.textMute }]}>{errorMsg ?? 'Hitilafu isiyojulikana.'}</Text>
                  </View>
                  <TouchableOpacity style={styles.resetBtn} onPress={handleReset} accessibilityLabel="Try again">
                    <RotateCw size={18} color={colors.textMute} />
                    <Text style={[styles.resetBtnText, { color: colors.textMute }]}>Jaribu Tena</Text>
                  </TouchableOpacity>
                </BlurView>
              </motion.View>
            )}

            {/* RESULT PHASE */}
            {phase === 'RESULT' && (
              <motion.View 
                key="result"
                initial={{ opacity: 0, y: 80, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 22, stiffness: 90 }}
                style={styles.resultWrapper}
              >
                <BlurView intensity={isDark ? 40 : 90} tint={isDark ? "dark" : "light"} style={[styles.resultCard, { borderColor: 'rgba(255,255,255,0.1)' }]}>
                  <LinearGradient
                    colors={[colors.primary + '15', 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                  
                  {(() => {
                    const sev = diagnosis?.severity ?? FALLBACK_RESULT.severity;
                    const sevColor = sev === 'critical' ? '#ef4444'
                      : sev === 'high' ? '#f97316'
                      : sev === 'medium' ? '#eab308'
                      : '#22c55e';
                    const sevLabel = sev === 'critical' ? 'Critical Priority'
                      : sev === 'high' ? 'High Priority'
                      : sev === 'medium' ? 'Medium Priority'
                      : 'Low Priority';
                    const disease = diagnosis?.disease ?? FALLBACK_RESULT.disease;
                    const cropLine = diagnosis?.crop ? `${diagnosis.crop} · ` : '';
                    const actions = diagnosis?.actions ?? [];
                    const body = actions.length > 0
                      ? actions.map((a) => `• ${a}`).join('\n')
                      : (diagnosis?.raw?.slice(0, 280) ?? FALLBACK_RESULT.recommendation);
                    return (
                      <>
                        <View style={styles.resultHeader}>
                          <motion.View
                            initial={{ rotate: -20, scale: 0.5 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            style={[styles.resultIcon, { backgroundColor: colors.primary }]}
                          >
                            <BrainCircuit size={32} color="#000" />
                          </motion.View>
                          <View style={styles.resultMeta}>
                            <Text style={[styles.resultName, { color: colors.text }]}>{disease}</Text>
                            <motion.View
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                              style={styles.confBadge}
                            >
                              <Text style={styles.confText}>{cropLine}AI Diagnosis</Text>
                            </motion.View>
                          </View>
                        </View>

                        {isOffline && (
                          <motion.View initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.offlineNoticeBox}>
                            <CloudOff size={16} color="#fbbf24" />
                            <Text style={styles.offlineNoticeText}>Saved locally. Will sync to your Agro ID when online.</Text>
                          </motion.View>
                        )}

                        <motion.View
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          style={[styles.detailCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
                        >
                          <View style={styles.detailTitleRow}>
                            <AlertCircle size={18} color={sevColor} />
                            <Text style={[styles.detailTitle, { color: colors.text }]}>{sevLabel}</Text>
                          </View>
                          <Text style={[styles.detailBody, { color: colors.textMute }]}>{body}</Text>
                        </motion.View>
                      </>
                    );
                  })()}

                  <motion.View initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <TouchableOpacity 
                      style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                      activeOpacity={0.8}
                      onPress={() => {
                         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                         router.push('/sankofa');
                      }}
                      accessibilityLabel="Speak with AI Agronomist"
                    >
                      <Text style={styles.primaryBtnText}>Ask AI Agronomist</Text>
                      <ArrowRight size={20} color="#000" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.resetBtn} onPress={handleReset} accessibilityLabel="Retake Scan">
                      <RotateCw size={18} color={colors.textMute} />
                      <Text style={[styles.resetBtnText, { color: colors.textMute }]}>Scan Another Plant</Text>
                    </TouchableOpacity>
                  </motion.View>
                </BlurView>
              </motion.View>
            )}
          </AnimatePresence>
        </View>

        {/* Shutter Controls */}
        <AnimatePresence>
          {phase === 'IDLE' && (
            <motion.View 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              style={styles.footer}
            >
              <TouchableOpacity style={styles.auxBtn} accessibilityLabel="Open gallery" onPress={handlePickFromGallery}>
                <BlurView intensity={40} tint="dark" style={styles.auxInner}>
                  <ImageIcon size={24} color="#ffffff" />
                </BlurView>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.shutterRing, { borderColor: colors.primary }]}
                onPress={handleScan}
                activeOpacity={0.8}
                accessibilityLabel="Take picture for AI diagnosis"
              >
                <motion.View 
                  whileTap={{ scale: 0.9 }}
                  style={[styles.shutterCore, { backgroundColor: '#ffffff' }]}
                >
                  <Camera size={34} color="#000" />
                </motion.View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.auxBtn} accessibilityLabel="Scanning tips" onPress={() => { Haptics.selectionAsync(); Alert.alert('Vidokezo vya Skanning', '• Hakikisha taa ya kutosha\n• Shika simu umbali wa sm 15-30\n• Zingatia majani yenye dalili\n• Epuka mwanga mkali nyuma\n• Piga picha moja kwa wakati mmoja'); }}>
                <BlurView intensity={40} tint="dark" style={styles.auxInner}>
                  <Info size={24} color="#ffffff" />
                </BlurView>
              </TouchableOpacity>
            </motion.View>
          )}
        </AnimatePresence>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraView: {
    ...StyleSheet.absoluteFillObject,
  },
  mockCamera: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  bgOrb: {
    position: 'absolute',
    filter: Platform.OS === 'web' ? 'blur(90px)' : undefined,
  },
  scanOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLine: {
    width: '100%',
    height: 6,
    shadowColor: "#3ecf8e",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 20,
  },
  scanGlow: {
    position: 'absolute',
    width: '100%',
    height: 70,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    zIndex: 10,
  },
  headerTitleBox: {
    flex: 1,
    alignItems: 'center',
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    gap: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Inter_900Black',
    letterSpacing: 2,
  },
  offlineToast: {
    position: 'absolute',
    top: 90,
    left: 20,
    right: 20,
    zIndex: 20,
  },
  offlineInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    gap: 10,
    overflow: 'hidden',
  },
  offlineText: {
    color: '#fbbf24',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerInterface: {
    alignItems: 'center',
  },
  reticleContainer: {
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 60,
    height: 60,
  },
  tl: {
    top: 0,
    left: 0,
    borderTopWidth: 8,
    borderLeftWidth: 8,
    borderTopLeftRadius: 40,
  },
  tr: {
    top: 0,
    right: 0,
    borderTopWidth: 8,
    borderRightWidth: 8,
    borderTopRightRadius: 40,
  },
  bl: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 8,
    borderLeftWidth: 8,
    borderBottomLeftRadius: 40,
  },
  br: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 8,
    borderRightWidth: 8,
    borderBottomRightRadius: 40,
  },
  aiMarkers: {
    alignItems: 'center',
  },
  markerPulse: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3ecf8e',
    marginBottom: 12,
  },
  markerTextContainer: {
    alignItems: 'center',
  },
  markerText: {
    color: '#3ecf8e',
    fontSize: 10,
    fontFamily: 'Inter_900Black',
    letterSpacing: 2,
  },
  instructions: {
    marginTop: 70,
    alignItems: 'center',
  },
  instructionLarge: {
    color: '#ffffff',
    fontSize: 26,
    fontFamily: 'Inter_900Black',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  instructionSmall: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 22,
  },
  analyzingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzingRings: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(62, 207, 142, 0.3)',
    borderTopColor: '#3ecf8e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  analyzingTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    marginBottom: 12,
  },
  analyzingSubtitle: {
    color: '#3ecf8e',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  resultWrapper: {
    width: SCREEN_WIDTH * 0.92,
  },
  resultCard: {
    borderRadius: 44,
    padding: 32,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultIcon: {
    width: 72,
    height: 72,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#3ecf8e",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
  },
  resultMeta: {
    flex: 1,
    marginLeft: 20,
  },
  resultName: {
    fontSize: 26,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  confBadge: {
    marginTop: 8,
  },
  confText: {
    color: '#3ecf8e',
    fontSize: 13,
    fontFamily: 'Inter_800ExtraBold',
  },
  offlineNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    padding: 12,
    borderRadius: 16,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
  },
  offlineNoticeText: {
    color: '#fbbf24',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
  detailCard: {
    padding: 26,
    borderRadius: 32,
    marginBottom: 32,
  },
  detailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  detailTitle: {
    fontSize: 17,
    fontFamily: 'Inter_900Black',
    marginLeft: 12,
  },
  detailBody: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    lineHeight: 24,
    opacity: 0.85,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    borderRadius: 28,
    marginBottom: 16,
    shadowColor: "#3ecf8e",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  primaryBtnText: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    marginRight: 12,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  resetBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 50,
  },
  auxBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
  },
  auxInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  shutterRing: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  shutterCore: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
