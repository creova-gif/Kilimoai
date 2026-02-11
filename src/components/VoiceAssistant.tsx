import { useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Mic, MicOff, Volume2, Loader2, Radio, CheckCircle2, Waves } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";

interface VoiceAssistantProps {
  language?: "en" | "sw";
}

export function VoiceAssistant({ language = "en" }: VoiceAssistantProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [duration, setDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const text = {
    title: language === "sw" ? "Msaidizi wa Sauti" : "Voice Assistant",
    subtitle: language === "sw" ? "Zungumza, AI itajibu kwa sauti" : "Speak, AI responds by voice",
    tapToStart: language === "sw" ? "Bonyeza kuanza kuzungumza" : "Tap to start speaking",
    listening: language === "sw" ? "Inasikiliza..." : "Listening...",
    processing: language === "sw" ? "Inachakata..." : "Processing...",
    tapToStop: language === "sw" ? "Bonyeza kuacha" : "Tap to stop",
    youSaid: language === "sw" ? "Ulisema" : "You said",
    aiResponse: language === "sw" ? "Jibu la AI" : "AI Response",
    tryAgain: language === "sw" ? "Jaribu Tena" : "Try Again",
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
      toast.success(text.listening);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error(language === "sw" ? "Imeshindwa kupata kipaza sauti" : "Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      toast.info(text.processing);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Simulate processing (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transcription and response
      const mockTranscription = language === "sw" 
        ? "Ni mbolea gani bora kwa mahindi?"
        : "What's the best fertilizer for maize?";
      
      const mockResponse = language === "sw"
        ? "Mbolea bora kwa mahindi ni NPK 23:23:0 wakati wa kupanda na Urea kwa top dressing. Tumia kilo 50 kwa ekari."
        : "The best fertilizer for maize is NPK 23:23:0 at planting and Urea for top dressing. Apply 50kg per acre.";
      
      setTranscription(mockTranscription);
      setAiResponse(mockResponse);
      
      toast.success(language === "sw" ? "Jibu lipo tayari!" : "Response ready!");
    } catch (error) {
      console.error("Processing error:", error);
      toast.error(language === "sw" ? "Imeshindwa kuchakata" : "Processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setTranscription("");
    setAiResponse("");
    setDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[calc(100vh-180px)] bg-gradient-to-br from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-2xl p-6 text-white shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Radio className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{text.title}</h1>
                <p className="text-white/90 text-sm">{text.subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Control */}
        <Card className="border-2 border-gray-200 overflow-hidden">
          <CardContent className="py-12">
            <div className="text-center space-y-6">
              {/* Microphone Button */}
              <motion.div
                animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: isRecording ? Infinity : 0, duration: 1.5 }}
              >
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={`relative h-32 w-32 rounded-full mx-auto shadow-2xl transition-all ${
                    isRecording 
                      ? "bg-gradient-to-br from-red-500 to-red-600 scale-110" 
                      : "bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] hover:scale-105"
                  } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isProcessing ? (
                    <Loader2 className="h-16 w-16 text-white animate-spin mx-auto" />
                  ) : isRecording ? (
                    <>
                      <MicOff className="h-16 w-16 text-white mx-auto" />
                      {/* Pulse rings */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-red-400"
                        animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-red-400"
                        animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                      />
                    </>
                  ) : (
                    <Mic className="h-16 w-16 text-white mx-auto" />
                  )}
                </button>
              </motion.div>

              {/* Status Text */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {isProcessing 
                    ? text.processing
                    : isRecording 
                    ? text.listening 
                    : text.tapToStart}
                </h3>
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Badge variant="secondary" className="bg-red-100 text-red-700 px-3 py-1">
                      <Waves className="h-3 w-3 mr-1" />
                      {formatDuration(duration)}
                    </Badge>
                  </motion.div>
                )}
              </div>

              {/* Hint */}
              {!isRecording && !isProcessing && !transcription && (
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  {language === "sw" 
                    ? "Uliza chochote kuhusu kilimo - mbolea, magonjwa, bei za soko, hali ya hewa, na mengine mengi"
                    : "Ask anything about farming - fertilizers, diseases, market prices, weather, and more"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transcription & Response */}
        <AnimatePresence>
          {transcription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Your Question */}
              <Card className="border-2 border-gray-200">
                <CardContent className="py-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">{text.youSaid}</h4>
                      <p className="text-gray-700 leading-relaxed">{transcription}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Response */}
              {aiResponse && (
                <Card className="border-2 border-[#2E7D32] bg-gradient-to-br from-emerald-50 to-white">
                  <CardContent className="py-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-[#2E7D32]/10 rounded-xl flex items-center justify-center">
                        <Volume2 className="h-5 w-5 text-[#2E7D32]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">{text.aiResponse}</h4>
                        <p className="text-gray-700 leading-relaxed">{aiResponse}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Try Again Button */}
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full border-2 border-gray-300 hover:border-[#2E7D32]"
              >
                {text.tryAgain}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

VoiceAssistant.displayName = "VoiceAssistant";
