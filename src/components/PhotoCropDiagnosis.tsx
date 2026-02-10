import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Camera, 
  Upload, 
  X, 
  AlertCircle,
  CheckCircle,
  Leaf,
  Sparkles,
  ImageIcon,
  Loader2,
  Info,
  MapPin,
  Store,
  Target,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  FileImage,
  Scan
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large. Please select an image under 5MB.");
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
      toast.success("Analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze image. Please try again.");
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
      color: "bg-green-100 text-green-700 border-green-200", 
      icon: CheckCircle,
      gradient: "from-[#2E7D32] to-green-600",
      label: "Low Risk"
    },
    medium: { 
      color: "bg-yellow-100 text-yellow-700 border-yellow-200", 
      icon: AlertCircle,
      gradient: "from-yellow-500 to-orange-500",
      label: "Medium Risk"
    },
    high: { 
      color: "bg-red-100 text-red-700 border-red-200", 
      icon: AlertCircle,
      gradient: "from-red-500 to-pink-500",
      label: "High Risk"
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-[#2E7D32] text-white p-8"
      >
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Camera className="h-8 w-8" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold">AI Crop Diagnosis</h1>
                  <p className="text-white/90 mt-1">Instant disease detection powered by computer vision</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                <motion.div 
                  className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Scan className="h-5 w-5 text-white" />
                    </div>
                    <Badge className="bg-white/20 text-white border-0 text-xs">Live</Badge>
                  </div>
                  <p className="text-xs text-white/80 mb-1">{language === "sw" ? "Usahihi" : "Accuracy"}</p>
                  <p className="text-3xl font-bold">95%+</p>
                </motion.div>

                <motion.div 
                  className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <Zap className="h-4 w-4 text-yellow-300" />
                  </div>
                  <p className="text-xs text-white/80 mb-1">{language === "sw" ? "Muda" : "Response"}</p>
                  <p className="text-3xl font-bold">&lt;3s</p>
                </motion.div>

                <motion.div 
                  className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Leaf className="h-5 w-5 text-white" />
                    </div>
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs text-white/80 mb-1">{language === "sw" ? "Magonjwa" : "Diseases"}</p>
                  <p className="text-3xl font-bold">50+</p>
                </motion.div>

                <motion.div 
                  className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                  <p className="text-xs text-white/80 mb-1">{language === "sw" ? "Lugha" : "Language"}</p>
                  <p className="text-3xl font-bold">{language === "sw" ? "SW" : "EN"}</p>
                </motion.div>
              </div>
            </div>
            <Badge className="bg-yellow-500 text-yellow-950 border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Upload className="h-5 w-5 text-gray-600" />
                </div>
                Upload Crop Photo
              </CardTitle>
              <CardDescription>
                Take or upload a clear photo of the affected crop for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedImage ? (
                <div className="space-y-4">
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-green-100 rounded-2xl">
                        <ImageIcon className="h-12 w-12 text-green-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold mb-1">Click to upload photo</p>
                        <p className="text-sm text-gray-500">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full gap-2 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-[#2E7D32]"
                    >
                      <Upload className="h-4 w-4" />
                      Choose Photo
                    </Button>
                    <Button
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.removeAttribute('capture');
                          fileInputRef.current.click();
                        }
                      }}
                      variant="outline"
                      className="w-full gap-2 border-2"
                    >
                      <FileImage className="h-4 w-4" />
                      From Gallery
                    </Button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="relative rounded-2xl overflow-hidden border-2 border-green-200">
                    <img 
                      src={selectedImage} 
                      alt="Selected crop" 
                      className="w-full h-auto"
                    />
                    <Button
                      onClick={handleReset}
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full gap-2 bg-[#2E7D32] hover:bg-[#1f5a24] h-12"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Scan className="h-5 w-5" />
                        Analyze with AI
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="border-2 mt-4 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-gray-600" />
                Tips for Best Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">Take photos in good lighting (natural daylight preferred)</p>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">Focus on the affected area of the plant</p>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">Capture leaves, stems, or fruits clearly</p>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">Avoid blurry or dark images</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                Diagnosis Results
              </CardTitle>
              <CardDescription>
                AI-powered analysis and treatment recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {analyzing ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="inline-block mb-4"
                    >
                      <Scan className="h-16 w-16 text-green-600" />
                    </motion.div>
                    <p className="text-lg font-semibold mb-2">Analyzing your crop...</p>
                    <p className="text-sm text-gray-500">AI is processing the image</p>
                    <div className="mt-6 max-w-xs mx-auto">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Processing</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                    </div>
                  </motion.div>
                ) : diagnosis ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Severity Banner */}
                    <Card className={`border-2 ${severityConfig[diagnosis.severity].color}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${severityConfig[diagnosis.severity].gradient}`}>
                            {diagnosis.severity === 'low' && <CheckCircle className="h-6 w-6 text-white" />}
                            {diagnosis.severity === 'medium' && <AlertCircle className="h-6 w-6 text-white" />}
                            {diagnosis.severity === 'high' && <AlertCircle className="h-6 w-6 text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium opacity-80">Detected Issue</p>
                            <h3 className="text-2xl font-bold">{diagnosis.disease}</h3>
                          </div>
                          <Badge className={severityConfig[diagnosis.severity].color}>
                            {severityConfig[diagnosis.severity].label}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Confidence Score */}
                    <Card className="border-2 bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-600" />
                            <span className="font-semibold">AI Confidence</span>
                          </div>
                          <span className="text-2xl font-bold text-green-600">
                            {Math.round(diagnosis.confidence * 100)}%
                          </span>
                        </div>
                        <Progress value={diagnosis.confidence * 100} className="h-2" />
                      </CardContent>
                    </Card>

                    {/* Treatment Recommendation */}
                    <Card className="border-2 border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Leaf className="h-5 w-5 text-green-600" />
                          Treatment Recommendation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {diagnosis.remedy}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Nearby Dealers */}
                    {diagnosis.nearbyDealers && diagnosis.nearbyDealers.length > 0 && (
                      <Card className="border-2 border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-green-600" />
                            Nearby Agro Dealers
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {diagnosis.nearbyDealers.map((dealer, index) => (
                            <div 
                              key={index}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <Store className="h-4 w-4 text-gray-600" />
                              </div>
                              <p className="text-sm font-medium text-gray-900">{dealer}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Button 
                        onClick={handleReset}
                        variant="outline"
                        className="gap-2 border-2"
                      >
                        <Camera className="h-4 w-4" />
                        New Scan
                      </Button>
                      <Button 
                        className="gap-2 bg-[#2E7D32] hover:bg-[#1f5a24]"
                      >
                        <Info className="h-4 w-4" />
                        Learn More
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center"
                  >
                    <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
                      <Leaf className="h-16 w-16 text-gray-400" />
                    </div>
                    <p className="text-lg font-semibold text-gray-600 mb-2">No analysis yet</p>
                    <p className="text-sm text-gray-500">
                      Upload a crop photo to get started
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-2 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-[#2E7D32] rounded-xl shadow-md">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                How AI Diagnosis Works
              </span>
            </CardTitle>
            <CardDescription className="text-base">
              Advanced computer vision technology powered by Claude & GPT-4 for instant crop disease detection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Step 1: Image Capture */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-md hover:shadow-xl hover:border-gray-300 transition-all duration-300 group"
              >
                <div className="p-3 bg-gray-100 rounded-xl inline-block mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="h-6 w-6 text-gray-700" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <h4 className="font-bold text-gray-900">Image Capture</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Upload or capture a clear photo of the affected crop area using your device camera
                </p>
              </motion.div>

              {/* Step 2: AI Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-md hover:shadow-xl hover:border-gray-300 transition-all duration-300 group"
              >
                <div className="p-3 bg-gray-100 rounded-xl inline-block mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-6 w-6 text-gray-700" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <h4 className="font-bold text-gray-900">AI Analysis</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Claude & GPT-4 Vision models analyze patterns, colors, and symptoms to identify diseases
                </p>
              </motion.div>

              {/* Step 3: Instant Results */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-5 border-2 border-green-200 shadow-md hover:shadow-xl hover:border-green-400 transition-all duration-300 group"
              >
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl inline-block mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <h4 className="font-bold text-gray-900">Instant Results</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get diagnosis, confidence score, severity level, and actionable treatment recommendations
                </p>
              </motion.div>
            </div>

            {/* Additional Info Banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Info className="h-5 w-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 mb-1">AI-Powered Accuracy</h5>
                  <p className="text-sm text-gray-600">
                    Our system uses state-of-the-art vision models trained on thousands of crop disease images. Results include confidence scores and are bilingual (English/Swahili).
                  </p>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}