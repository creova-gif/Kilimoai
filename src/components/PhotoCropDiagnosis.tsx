import { useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Camera, 
  Upload, 
  X, 
  AlertCircle,
  CheckCircle,
  Sparkles,
  Loader2,
  Info,
  Store,
  Zap,
  Shield,
  Scan,
  Image as ImageIcon,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";

interface DiagnosisResult {
  disease: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  remedy: string;
  nearbyDealers?: string[];
}

interface PhotoCropDiagnosisProps {
  onAnalyzePhoto: (imageData: string) => Promise<DiagnosisResult>;
  language?: "en" | "sw";
}

export function PhotoCropDiagnosis({ onAnalyzePhoto, language = "en" }: PhotoCropDiagnosisProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const text = {
    title: language === "sw" ? "Changanua Picha" : "Photo Diagnosis",
    subtitle: language === "sw" ? "Piga picha au pakia picha ya mmea" : "Snap or upload a crop photo",
    uploadBtn: language === "sw" ? "Pakia Picha" : "Upload Photo",
    takePhoto: language === "sw" ? "Piga Picha" : "Take Photo",
    analyzing: language === "sw" ? "Inachambanua..." : "Analyzing...",
    analyzeBtn: language === "sw" ? "Chambanua Picha" : "Analyze Photo",
    reset: language === "sw" ? "Piga Picha Nyingine" : "Try Another",
    disease: language === "sw" ? "Ugonjwa" : "Disease",
    confidence: language === "sw" ? "Uhakika" : "Confidence",
    severity: language === "sw" ? "Ukali" : "Severity",
    remedy: language === "sw" ? "Tiba" : "Treatment",
    dealers: language === "sw" ? "Maduka Karibu" : "Nearby Dealers",
    low: language === "sw" ? "Hatari Kidogo" : "Low Risk",
    medium: language === "sw" ? "Hatari ya Kati" : "Medium Risk",
    high: language === "sw" ? "Hatari Kubwa" : "High Risk",
    dragDrop: language === "sw" ? "Buruta na udondoshe picha hapa" : "Drag & drop your image here",
    or: language === "sw" ? "au" : "or",
    tips: language === "sw" ? "Vidokezo" : "Tips",
    tip1: language === "sw" ? "Piga picha wazi ya jua" : "Take clear, well-lit photos",
    tip2: language === "sw" ? "Karibia kwa majani yaliyoathirika" : "Focus on affected leaves",
    tip3: language === "sw" ? "Picha moja kwa mmea mmoja" : "One plant per photo",
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(language === "sw" ? "Picha ni kubwa sana" : "Image too large");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setDiagnosis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    try {
      const result = await onAnalyzePhoto(selectedImage);
      setDiagnosis(result);
      toast.success(language === "sw" ? "Uchambuzi umekamilika!" : "Analysis complete!");
    } catch (error) {
      toast.error(language === "sw" ? "Imeshindwa kuchambanua" : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setDiagnosis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const severityConfig = {
    low: { 
      color: "bg-emerald-500", 
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      icon: CheckCircle,
      label: text.low
    },
    medium: { 
      color: "bg-amber-500", 
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      icon: AlertCircle,
      label: text.medium
    },
    high: { 
      color: "bg-red-500", 
      textColor: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      icon: AlertTriangle,
      label: text.high
    },
  };

  return (
    <div className="min-h-[calc(100vh-180px)] bg-gradient-to-br from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-2xl p-6 text-white shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Scan className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{text.title}</h1>
                <p className="text-white/90 text-sm">{text.subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        {!selectedImage ? (
          /* Upload Area */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 border-dashed border-gray-300 hover:border-[#2E7D32] transition-all">
              <CardContent className="py-12">
                <div className="text-center space-y-6">
                  <div className="h-20 w-20 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                    <ImageIcon className="h-10 w-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {text.dragDrop}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{text.or}</p>
                  </div>

                  <div className="flex gap-3 justify-center flex-wrap">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#2E7D32] hover:bg-[#1B5E20] shadow-lg"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {text.uploadBtn}
                    </Button>
                    
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="border-2 border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32]/10"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {text.takePhoto}
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-2 border-blue-100 bg-blue-50/50">
              <CardContent className="py-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-2">{text.tips}</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                        {text.tip1}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                        {text.tip2}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                        {text.tip3}
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Analysis Area */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Image Preview */}
            <Card className="border-2 border-gray-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={selectedImage}
                    alt="Crop"
                    className="w-full h-full object-contain"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleReset}
                    className="absolute top-4 right-4 rounded-full shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analyze Button */}
            {!diagnosis && !analyzing && (
              <Button
                onClick={handleAnalyze}
                className="w-full h-14 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] hover:from-[#1B5E20] hover:to-[#2E7D32] text-white shadow-xl"
                size="lg"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {text.analyzeBtn}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            )}

            {/* Analyzing State */}
            {analyzing && (
              <Card className="border-2 border-[#2E7D32] bg-gradient-to-br from-emerald-50 to-white">
                <CardContent className="py-8">
                  <div className="text-center space-y-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-2xl flex items-center justify-center mx-auto shadow-xl animate-pulse">
                      <Scan className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {text.analyzing}
                      </h3>
                      <Progress value={66} className="w-64 mx-auto h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            <AnimatePresence>
              {diagnosis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {/* Severity Banner */}
                  <Card className={`border-2 ${severityConfig[diagnosis.severity].borderColor} ${severityConfig[diagnosis.severity].bgColor}`}>
                    <CardContent className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 ${severityConfig[diagnosis.severity].color} rounded-xl flex items-center justify-center`}>
                          {(() => {
                            const Icon = severityConfig[diagnosis.severity].icon;
                            return <Icon className="h-6 w-6 text-white" />;
                          })()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">{diagnosis.disease}</h3>
                          <p className={`text-sm font-medium ${severityConfig[diagnosis.severity].textColor}`}>
                            {severityConfig[diagnosis.severity].label}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {Math.round(diagnosis.confidence * 100)}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Treatment */}
                  <Card className="border-2 border-gray-200">
                    <CardContent className="py-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-[#2E7D32]/10 rounded-xl flex items-center justify-center">
                          <Shield className="h-5 w-5 text-[#2E7D32]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{text.remedy}</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">{diagnosis.remedy}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dealers */}
                  {diagnosis.nearbyDealers && diagnosis.nearbyDealers.length > 0 && (
                    <Card className="border-2 border-gray-200">
                      <CardContent className="py-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Store className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{text.dealers}</h4>
                            <div className="space-y-1">
                              {diagnosis.nearbyDealers.map((dealer, index) => (
                                <p key={index} className="text-sm text-gray-700">• {dealer}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Try Another */}
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full border-2 border-gray-300 hover:border-[#2E7D32]"
                  >
                    {text.reset}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

PhotoCropDiagnosis.displayName = "PhotoCropDiagnosis";
