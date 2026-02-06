import { useState, useRef, useEffect } from "react";
import { 
  Camera, Upload, Mic, X, Check, AlertCircle, Info, Lightbulb,
  Zap, Loader2, RefreshCw, ChevronRight, Volume2, Play, Pause,
  Image as ImageIcon, FileText, Send, ArrowLeft, Target, Eye,
  Sun, AlertTriangle, Maximize2, ZoomIn, ZoomOut, RotateCw,
  CheckCircle2, Sparkles, Brain, Clock, TrendingUp
} from "lucide-react";

interface UniversalCaptureFlowProps {
  mode: "crop-diagnosis" | "livestock-health" | "voice-assistant" | "general-query";
  language: "en" | "sw";
  onCapture: (data: CaptureData) => void;
  onClose: () => void;
}

interface CaptureData {
  type: "photo" | "voice" | "combined";
  photo?: string;
  voice?: Blob;
  text?: string;
  metadata: {
    timestamp: Date;
    mode: string;
    quality?: "high" | "medium" | "low";
  };
}

const USE_CASE_CONFIG = {
  "crop-diagnosis": {
    title: { en: "Check Crop Health", sw: "Kagua Afya ya Zao" },
    subtitle: { en: "A clear photo helps us detect diseases accurately", sw: "Picha wazi inatusaidia kutambua magonjwa kwa usahihi" },
    icon: "🌱",
    color: "green",
    guidanceOverlay: "leaf",
    tips: {
      en: [
        "Focus on affected leaves or stems",
        "Ensure good lighting",
        "Fill the frame with the plant",
        "Avoid shadows and blur"
      ],
      sw: [
        "Zingatia majani au shina lililoathirika",
        "Hakikisha mwanga ni mzuri",
        "Jaza fremu kwa mmea",
        "Epuka vivuli na kupauka"
      ]
    }
  },
  "livestock-health": {
    title: { en: "Check Animal Health", sw: "Kagua Afya ya Mnyama" },
    subtitle: { en: "Clear photos help us identify health issues faster", sw: "Picha wazi zinatusaidia kutambua matatizo ya afya haraka" },
    icon: "🐄",
    color: "blue",
    guidanceOverlay: "animal",
    tips: {
      en: [
        "Capture eyes, skin, or affected area",
        "Stand at animal's level",
        "Use natural lighting",
        "Keep animal calm and still"
      ],
      sw: [
        "Piga picha ya macho, ngozi, au sehemu iliyoathirika",
        "Simama kwa kiwango cha mnyama",
        "Tumia mwanga wa asili",
        "Weka mnyama utulivu na usisogee"
      ]
    }
  },
  "voice-assistant": {
    title: { en: "Ask a Question", sw: "Uliza Swali" },
    subtitle: { en: "Speak naturally - we understand English and Swahili", sw: "Zungumza kwa kawaida - tunaelewa Kiingereza na Kiswahili" },
    icon: "🎤",
    color: "purple",
    guidanceOverlay: "none",
    tips: {
      en: [
        "Speak clearly and naturally",
        "Find a quiet place",
        "Keep your question focused",
        "You can combine voice + photo"
      ],
      sw: [
        "Zungumza kwa uwazi na kwa kawaida",
        "Tafuta mahali pa utulivu",
        "Weka swali lako lifuatane",
        "Unaweza kuchanganya sauti + picha"
      ]
    }
  },
  "general-query": {
    title: { en: "Get Farming Advice", sw: "Pata Ushauri wa Kilimo" },
    subtitle: { en: "Share photos or describe your farming question", sw: "Shiriki picha au eleza swali lako la kilimo" },
    icon: "💡",
    color: "amber",
    guidanceOverlay: "general",
    tips: {
      en: [
        "Photos make advice more accurate",
        "Describe what you need help with",
        "Multiple photos are welcome",
        "We respond in your language"
      ],
      sw: [
        "Picha zinafanya ushauri kuwa sahihi zaidi",
        "Eleza unachohitaji msaada",
        "Picha nyingi zinakaribishwa",
        "Tunajibu kwa lugha yako"
      ]
    }
  }
};

export function UniversalCaptureFlow({ mode, language, onCapture, onClose }: UniversalCaptureFlowProps) {
  const [step, setStep] = useState<"intro" | "capture" | "preview" | "analyzing" | "result">("intro");
  const [captureMethod, setCaptureMethod] = useState<"camera" | "upload" | "voice" | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [capturedVoice, setCapturedVoice] = useState<Blob | null>(null);
  const [additionalText, setAdditionalText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showGuidance, setShowGuidance] = useState(true);
  const [qualityCheck, setQualityCheck] = useState<{
    lighting: "good" | "poor" | "dark";
    blur: "sharp" | "slight" | "blurry";
    distance: "optimal" | "close" | "far";
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const config = USE_CASE_CONFIG[mode];

  // Recording timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: 1920, height: 1080 }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setCaptureMethod("camera");
      setStep("capture");
    } catch (error) {
      console.error("Camera access denied:", error);
      alert(language === "en" 
        ? "Camera access denied. Please enable camera permissions." 
        : "Ufikiaji wa kamera umekataliwa. Tafadhali ruhusu ruhusa za kamera.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const photoData = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedPhoto(photoData);
        
        // Simulate quality check
        setTimeout(() => {
          setQualityCheck({
            lighting: Math.random() > 0.3 ? "good" : "poor",
            blur: Math.random() > 0.2 ? "sharp" : "slight",
            distance: Math.random() > 0.25 ? "optimal" : Math.random() > 0.5 ? "close" : "far"
          });
        }, 500);
        
        stopCamera();
        setStep("preview");
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedPhoto(event.target?.result as string);
        
        // Simulate quality check
        setTimeout(() => {
          setQualityCheck({
            lighting: "good",
            blur: "sharp",
            distance: "optimal"
          });
        }, 500);
        
        setStep("preview");
      };
      reader.readAsDataURL(file);
    }
  };

  // Start voice recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        setCapturedVoice(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setCaptureMethod("voice");
      setStep("capture");
    } catch (error) {
      console.error("Microphone access denied:", error);
      alert(language === "en" 
        ? "Microphone access denied. Please enable microphone permissions." 
        : "Ufikiaji wa kipaza sauti umekataliwa. Tafadhali ruhusu ruhusa za kipaza sauti.");
    }
  };

  // Stop voice recording
  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStep("preview");
    }
  };

  // Submit capture
  const handleSubmit = () => {
    setStep("analyzing");
    
    const data: CaptureData = {
      type: capturedPhoto && capturedVoice ? "combined" : capturedPhoto ? "photo" : "voice",
      photo: capturedPhoto || undefined,
      voice: capturedVoice || undefined,
      text: additionalText || undefined,
      metadata: {
        timestamp: new Date(),
        mode,
        quality: qualityCheck?.blur === "sharp" && qualityCheck?.lighting === "good" ? "high" : "medium"
      }
    };

    // Simulate analysis delay
    setTimeout(() => {
      onCapture(data);
    }, 2000);
  };

  // Retake
  const retake = () => {
    setCapturedPhoto(null);
    setCapturedVoice(null);
    setAdditionalText("");
    setQualityCheck(null);
    setStep("intro");
    setCaptureMethod(null);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              <h1 className="text-xl font-bold">{config.title[language]}</h1>
            </div>
            <p className="text-sm text-white/90 mt-1">{config.subtitle[language]}</p>
          </div>
          <div className="w-10"></div>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className={`h-2 w-12 rounded-full transition-all ${
            step === "intro" ? "bg-white" : "bg-white/30"
          }`}></div>
          <div className={`h-2 w-12 rounded-full transition-all ${
            step === "capture" || step === "preview" ? "bg-white" : "bg-white/30"
          }`}></div>
          <div className={`h-2 w-12 rounded-full transition-all ${
            step === "analyzing" || step === "result" ? "bg-white" : "bg-white/30"
          }`}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[calc(100vh-140px)]">
        {/* INTRO SCREEN */}
        {step === "intro" && (
          <div className="p-6 space-y-6 max-w-2xl mx-auto">
            {/* Tips Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    {language === "en" ? "Tips for Best Results" : "Vidokezo kwa Matokeo Bora"}
                  </h3>
                  <ul className="space-y-2">
                    {config.tips[language].map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-blue-800">
                        <Check className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-600" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Info className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-2">
                    {language === "en" ? "What Happens Next" : "Kinachofuata"}
                  </h3>
                  <div className="space-y-2 text-sm text-green-800">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">1</div>
                      <span>{language === "en" ? "We analyze your photo using AI + expert rules" : "Tunachambua picha yako kwa kutumia AI + kanuni za wataalamu"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                      <span>{language === "en" ? "Results ready in ~10 seconds" : "Matokeo yako katika ~sekunde 10"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">3</div>
                      <span>{language === "en" ? "Get actionable recommendations" : "Pata mapendekezo ya vitendo"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Capture Options */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-center">
                {language === "en" ? "Choose Capture Method" : "Chagua Njia ya Kupiga Picha"}
              </h3>

              {/* Camera Button */}
              {mode !== "voice-assistant" && (
                <button
                  onClick={startCamera}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-6 flex items-center gap-4 hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
                >
                  <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center">
                    <Camera className="h-7 w-7" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-lg">
                      {language === "en" ? "Take Photo" : "Piga Picha"}
                    </div>
                    <div className="text-sm text-white/90">
                      {language === "en" ? "Recommended for best results" : "Inapendekezwa kwa matokeo bora"}
                    </div>
                  </div>
                  <Sparkles className="h-5 w-5" />
                </button>
              )}

              {/* Upload Button */}
              {mode !== "voice-assistant" && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-white text-gray-900 rounded-xl p-6 flex items-center gap-4 hover:bg-gray-50 transition-all border-2 border-gray-300"
                  >
                    <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center">
                      <Upload className="h-7 w-7 text-gray-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-lg">
                        {language === "en" ? "Upload from Gallery" : "Pakia kutoka Mkusanyiko"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {language === "en" ? "Choose existing photo" : "Chagua picha iliyopo"}
                      </div>
                    </div>
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  </button>
                </>
              )}

              {/* Voice Button */}
              <button
                onClick={startVoiceRecording}
                className="w-full bg-purple-600 text-white rounded-xl p-6 flex items-center gap-4 hover:bg-purple-700 transition-all shadow-lg"
              >
                <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center">
                  <Mic className="h-7 w-7" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-lg">
                    {language === "en" ? "Record Voice Note" : "Rekodi Ujumbe wa Sauti"}
                  </div>
                  <div className="text-sm text-white/90">
                    {language === "en" ? "Describe what you're seeing" : "Eleza unachokiona"}
                  </div>
                </div>
                <Volume2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* CAPTURE SCREEN */}
        {step === "capture" && (
          <div className="relative h-[calc(100vh-140px)]">
            {/* Camera View */}
            {captureMethod === "camera" && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Guidance Overlay */}
                {showGuidance && config.guidanceOverlay !== "none" && (
                  <div className="absolute inset-0 pointer-events-none">
                    {config.guidanceOverlay === "leaf" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 border-4 border-green-400 border-dashed rounded-lg animate-pulse">
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                            {language === "en" ? "Frame the leaf here" : "Weka jani hapa"}
                          </div>
                        </div>
                      </div>
                    )}
                    {config.guidanceOverlay === "animal" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-80 h-96 border-4 border-blue-400 border-dashed rounded-2xl animate-pulse">
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                            {language === "en" ? "Center the animal" : "Weka mnyama katikati"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Camera Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setShowGuidance(!showGuidance)}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Target className="h-5 w-5 text-white" />
                    </button>
                    
                    <button
                      onClick={capturePhoto}
                      className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform ring-4 ring-white/30"
                    >
                      <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                    </button>
                    
                    <button
                      onClick={stopCamera}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                  
                  <div className="text-center text-white text-sm mt-4">
                    {language === "en" ? "Tap the circle to capture" : "Gusa mduara kupiga picha"}
                  </div>
                </div>
              </>
            )}

            {/* Voice Recording View */}
            {captureMethod === "voice" && isRecording && (
              <div className="h-full bg-gradient-to-br from-purple-600 to-purple-800 flex flex-col items-center justify-center p-6">
                <div className="relative mb-8">
                  <div className="h-32 w-32 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                    <Mic className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-ping"></div>
                </div>

                <div className="text-white text-center space-y-4">
                  <div className="text-4xl font-bold">{formatDuration(recordingDuration)}</div>
                  <div className="text-lg">{language === "en" ? "Recording..." : "Inarekodi..."}</div>
                  <div className="text-sm text-white/80">
                    {language === "en" ? "Speak clearly and naturally" : "Zungumza kwa uwazi na kwa kawaida"}
                  </div>
                </div>

                {/* Waveform Animation */}
                <div className="flex items-center justify-center gap-1 mt-8">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-white rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 40 + 10}px`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    ></div>
                  ))}
                </div>

                <button
                  onClick={stopVoiceRecording}
                  className="mt-12 h-16 w-16 bg-red-500 rounded-full flex items-center justify-center shadow-2xl hover:bg-red-600 transition-colors"
                >
                  <div className="h-6 w-6 bg-white rounded"></div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* PREVIEW SCREEN */}
        {step === "preview" && (
          <div className="p-6 space-y-6 max-w-2xl mx-auto">
            {/* Photo Preview */}
            {capturedPhoto && (
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <img src={capturedPhoto} alt="Captured" className="w-full h-auto" />
                
                {/* Quality Check */}
                {qualityCheck && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-gray-900">
                        {language === "en" ? "Quality Check" : "Ukaguzi wa Ubora"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className={`text-center p-2 rounded ${
                        qualityCheck.lighting === "good" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        <Sun className="h-4 w-4 mx-auto mb-1" />
                        <div className="font-medium">
                          {qualityCheck.lighting === "good" 
                            ? (language === "en" ? "Good Light" : "Mwanga Mzuri")
                            : (language === "en" ? "Low Light" : "Mwanga Mdogo")}
                        </div>
                      </div>
                      <div className={`text-center p-2 rounded ${
                        qualityCheck.blur === "sharp" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        <Eye className="h-4 w-4 mx-auto mb-1" />
                        <div className="font-medium">
                          {qualityCheck.blur === "sharp"
                            ? (language === "en" ? "Sharp" : "Wazi")
                            : (language === "en" ? "Slight Blur" : "Haijawazi Sana")}
                        </div>
                      </div>
                      <div className={`text-center p-2 rounded ${
                        qualityCheck.distance === "optimal" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        <Maximize2 className="h-4 w-4 mx-auto mb-1" />
                        <div className="font-medium">
                          {qualityCheck.distance === "optimal"
                            ? (language === "en" ? "Good Distance" : "Umbali Mzuri")
                            : (language === "en" ? "Adjust Distance" : "Rekebisha Umbali")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Voice Preview */}
            {capturedVoice && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <Volume2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {language === "en" ? "Voice Note Recorded" : "Ujumbe wa Sauti Umerekodi"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDuration(recordingDuration)} {language === "en" ? "duration" : "muda"}
                    </div>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            )}

            {/* Additional Context (Optional) */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <label className="block font-semibold text-gray-900 mb-2">
                {language === "en" 
                  ? "Add More Details (Optional)" 
                  : "Ongeza Maelezo Zaidi (Si Lazima)"}
              </label>
              <textarea
                value={additionalText}
                onChange={(e) => setAdditionalText(e.target.value)}
                placeholder={language === "en" 
                  ? "Describe what you're seeing or any concerns..."
                  : "Eleza unachokiona au wasiwasi wowote..."}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={retake}
                className="flex-1 px-6 py-4 bg-gray-200 text-gray-900 rounded-xl font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCw className="h-5 w-5" />
                {language === "en" ? "Retake" : "Piga Tena"}
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {language === "en" ? "Analyze" : "Chambua"}
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* ANALYZING SCREEN */}
        {step === "analyzing" && (
          <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="relative">
              <div className="h-24 w-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Brain className="h-12 w-12 text-white" />
              </div>
              <div className="absolute inset-0 border-4 border-green-300 rounded-full animate-ping"></div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {language === "en" ? "Analyzing..." : "Inachambua..."}
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              {language === "en" 
                ? "Our AI is analyzing your photo using advanced computer vision and expert agricultural knowledge."
                : "AI yetu inachambua picha yako kwa kutumia maono ya kompyuta ya hali ya juu na maarifa ya wataalamu wa kilimo."}
            </p>

            {/* Progress Steps */}
            <div className="mt-8 space-y-3 w-full max-w-md">
              {[
                { en: "Processing image quality...", sw: "Inachakata ubora wa picha...", delay: 0 },
                { en: "Running AI detection models...", sw: "Inaendesha mifano ya AI ya kutambua...", delay: 500 },
                { en: "Comparing with disease database...", sw: "Inalinganisha na hifadhidata ya magonjwa...", delay: 1000 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 animate-fadeIn" style={{ animationDelay: `${item.delay}ms` }}>
                  <Loader2 className="h-5 w-5 text-green-600 animate-spin" />
                  <span className="text-sm text-gray-700">{item[language]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
