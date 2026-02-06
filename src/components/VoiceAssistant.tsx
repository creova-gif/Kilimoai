import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Mic, MicOff, Volume2, Languages, Loader2, Sparkles, Radio, Zap, CheckCircle2, PlayCircle, StopCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";

interface VoiceAssistantProps {
  userId: string;
  apiBase: string;
  authToken: string;
  language: "en" | "sw";
}

export function VoiceAssistant({ userId, apiBase, authToken, language }: VoiceAssistantProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [duration, setDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Convert to base64 and send to backend
        await processAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
      toast.success(language === "sw" ? "Kurekodi kumeanza..." : "Recording started...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error(language === "sw" ? "Hitilafu ya kupata kipaza sauti" : "Error accessing microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      toast.info(language === "sw" ? "Inachakata..." : "Processing...");
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        const response = await fetch(`${apiBase}/voice/upload`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            audioData: base64Audio,
            duration,
            language,
            query: language === "sw" 
              ? "Habari za asubuhi. Je, unaweza kunisaidia na mazao yangu?"
              : "Good morning. Can you help me with my crops?",
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setTranscription(data.response.transcription);
          setAiResponse(data.response.aiResponse);
          toast.success(language === "sw" ? "Umefanikiwa!" : "Success!");
          
          // Track this interaction in farm graph
          await fetch(`${apiBase}/farm-graph/track`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              eventType: "voice_interaction",
              eventData: { language, duration },
              metadata: { feature: "voice_assistant" },
            }),
          });
        } else {
          throw new Error(data.error);
        }
      };
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error(language === "sw" ? "Hitilafu ya kuchakata sauti" : "Error processing audio");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {language === "sw" ? "Msaidizi wa Sauti wa Kilimo" : "Voice Agricultural Assistant"}
                </h2>
                <Badge variant="outline" className="mt-1 bg-white border-green-200">
                  <Languages className="h-3 w-3 mr-1 text-green-600" />
                  {language === "sw" ? "Kiswahili" : "English"}
                </Badge>
              </div>
            </div>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              {language === "sw" 
                ? "Zungumza na SANKOFA AI kwa Kiswahili - Msaidizi wa AI wa kwanza wa sauti kwa wakulima wa Afrika Mashariki"
                : "Speak to SANKOFA AI in Swahili - East Africa's first voice-first AI for farmers"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-green-600 text-white rounded-lg text-center">
              <Radio className="h-5 w-5 mx-auto mb-1" />
              <p className="text-xs font-semibold">
                {language === "sw" ? "MTANDAO" : "LIVE"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Recorder */}
      <Card className="border-2 border-dashed border-purple-200">
        <CardHeader>
          <CardTitle>
            {language === "sw" ? "Rekodi Swali Lako" : "Record Your Question"}
          </CardTitle>
          <CardDescription>
            {language === "sw"
              ? "Bonyeza kitufe cha kipaza sauti kuanza kurekodi. Uliza swali lolote kuhusu kilimo."
              : "Press the microphone button to start recording. Ask any question about farming."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recording Button */}
          <div className="flex flex-col items-center justify-center py-8">
            {!isRecording && !isProcessing && (
              <Button
                size="lg"
                onClick={startRecording}
                className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Mic className="h-10 w-10" />
              </Button>
            )}
            
            {isRecording && (
              <Button
                size="lg"
                onClick={stopRecording}
                className="h-24 w-24 rounded-full bg-red-500 hover:bg-red-600 animate-pulse"
              >
                <MicOff className="h-10 w-10" />
              </Button>
            )}
            
            {isProcessing && (
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
              </div>
            )}
            
            <p className="mt-4 font-medium">
              {isRecording && `${language === "sw" ? "Inarekodi" : "Recording"}: ${formatDuration(duration)}`}
              {isProcessing && (language === "sw" ? "Inachakata..." : "Processing...")}
              {!isRecording && !isProcessing && (language === "sw" ? "Bofya kuanza" : "Tap to start")}
            </p>
          </div>

          {/* Audio Playback */}
          {audioURL && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-purple-600" />
                <div className="flex-1">
                  <audio controls src={audioURL} className="w-full" />
                </div>
              </div>
            </div>
          )}

          {/* Transcription */}
          {transcription && (
            <div className="border rounded-lg p-4 bg-blue-50">
              <p className="text-sm font-medium text-blue-900 mb-2">
                {language === "sw" ? "📝 Maneno Yaliyoandikwa:" : "📝 Transcription:"}
              </p>
              <p className="text-sm text-gray-700">{transcription}</p>
            </div>
          )}

          {/* AI Response */}
          {aiResponse && (
            <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50">
              <p className="text-sm font-medium text-purple-900 mb-2">
                {language === "sw" ? "🤖 Jibu la KILIMO AI:" : "🤖 KILIMO AI Response:"}
              </p>
              <p className="text-sm text-gray-700">{aiResponse}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === "sw" ? "Kwa Nini Sauti ya KILIMO?" : "Why KILIMO Voice?"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <Mic className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">
                  {language === "sw" ? "Zungumza Kiswahili" : "Speak Swahili"}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {language === "sw"
                    ? "Msaidizi wa kwanza wa AI unaozungumza Kiswahili kwa wakulima"
                    : "First Swahili-speaking AI assistant built for farmers"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Languages className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">
                  {language === "sw" ? "Hakuna Haja ya Kusoma" : "No Reading Required"}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {language === "sw"
                    ? "Pata ushauri wa kilimo bila kuandika au kusoma"
                    : "Get farming advice without typing or reading"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Volume2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">
                  {language === "sw" ? "Jibu la Haraka" : "Fast Responses"}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {language === "sw"
                    ? "Pata jibu la papo hapo kwa maswali yako"
                    : "Get instant answers to your farming questions"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Questions */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === "sw" ? "Maswali ya Mfano" : "Example Questions"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {language === "sw" ? (
              <>
                <div className="p-3 border rounded-lg bg-gray-50">
                  <p className="text-sm">🌾 "Je, ni wakati gani bora wa kupanda mahindi?"</p>
                </div>
                <div className="p-3 border rounded-lg bg-gray-50">
                  <p className="text-sm">💰 "Bei ya mahindi ni kiasi gani leo?"</p>
                </div>
                <div className="p-3 border rounded-lg bg-gray-50">
                  <p className="text-sm">🌧️ "Je, mvua itanyesha wiki hii?"</p>
                </div>
                <div className="p-3 border rounded-lg bg-gray-50">
                  <p className="text-sm">🐛 "Jinsi ya kudhibiti Fall Armyworm?"</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 border rounded-lg bg-gray-50">
                  <p className="text-sm">🌾 "When is the best time to plant maize?"</p>
                </div>
                <div className="p-3 border rounded-lg bg-gray-50">
                  <p className="text-sm">💰 "What is the price of maize today?"</p>
                </div>
                <div className="p-3 border rounded-lg bg-gray-50">
                  <p className="text-sm">🌧️ "Will it rain this week?"</p>
                </div>
                <div className="p-3 border rounded-lg bg-gray-50">
                  <p className="text-sm">🐛 "How do I control Fall Armyworm?"</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}