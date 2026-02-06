import { useState } from "react";
import { Camera, Mic, Stethoscope, MessageSquare } from "lucide-react";
import { UniversalCaptureFlow } from "./UniversalCaptureFlow";

interface CaptureFlowDemoProps {
  language: "en" | "sw";
}

export function CaptureFlowDemo({ language }: CaptureFlowDemoProps) {
  const [activeCaptureMode, setActiveCaptureMode] = useState<"crop-diagnosis" | "livestock-health" | "voice-assistant" | "general-query" | null>(null);
  const [captureResult, setCaptureResult] = useState<any>(null);

  const handleCapture = (data: any) => {
    console.log("Captured data:", data);
    setCaptureResult(data);
    setActiveCaptureMode(null);
    
    // Here you would typically send the data to your AI analysis endpoint
    // Example: await analyzeImage(data.photo, data.mode)
  };

  const useCases = [
    {
      id: "crop-diagnosis" as const,
      title: { en: "Crop Health Check", sw: "Ukaguzi wa Afya ya Zao" },
      description: { en: "Diagnose plant diseases and pests", sw: "Tambua magonjwa ya mimea na wadudu" },
      icon: <div className="text-3xl">🌱</div>,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "livestock-health" as const,
      title: { en: "Livestock Health", sw: "Afya ya Mifugo" },
      description: { en: "Check animal health issues", sw: "Kagua matatizo ya afya ya wanyama" },
      icon: <Stethoscope className="h-8 w-8" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "voice-assistant" as const,
      title: { en: "Voice Assistant", sw: "Msaidizi wa Sauti" },
      description: { en: "Ask farming questions", sw: "Uliza maswali ya kilimo" },
      icon: <Mic className="h-8 w-8" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "general-query" as const,
      title: { en: "Get Advice", sw: "Pata Ushauri" },
      description: { en: "General farming assistance", sw: "Msaada wa jumla wa kilimo" },
      icon: <MessageSquare className="h-8 w-8" />,
      color: "from-amber-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/20 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === "en" ? "Intelligent Capture System" : "Mfumo wa Kupiga Picha Mwerevu"}
          </h1>
          <p className="text-gray-600">
            {language === "en" 
              ? "Multi-modal input for crop & livestock diagnostics" 
              : "Ingizo la aina nyingi kwa uchunguzi wa mazao na mifugo"}
          </p>
        </div>

        {/* Use Case Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {useCases.map((useCase) => (
            <button
              key={useCase.id}
              onClick={() => setActiveCaptureMode(useCase.id)}
              className={`bg-gradient-to-br ${useCase.color} text-white rounded-xl p-6 hover:shadow-xl transition-all transform hover:scale-105`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center">
                  {useCase.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg">{useCase.title[language]}</h3>
                  <p className="text-sm text-white/90">{useCase.description[language]}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>{language === "en" ? "Tap to start" : "Gusa kuanza"}</span>
                <Camera className="h-5 w-5" />
              </div>
            </button>
          ))}
        </div>

        {/* Result Display */}
        {captureResult && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {language === "en" ? "Capture Result" : "Matokeo ya Kupiga Picha"}
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">{language === "en" ? "Type:" : "Aina:"}</span>
                  <span className="ml-2 font-medium">{captureResult.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">{language === "en" ? "Mode:" : "Hali:"}</span>
                  <span className="ml-2 font-medium">{captureResult.metadata.mode}</span>
                </div>
                <div>
                  <span className="text-gray-600">{language === "en" ? "Quality:" : "Ubora:"}</span>
                  <span className="ml-2 font-medium">{captureResult.metadata.quality}</span>
                </div>
                <div>
                  <span className="text-gray-600">{language === "en" ? "Time:" : "Muda:"}</span>
                  <span className="ml-2 font-medium">
                    {new Date(captureResult.metadata.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {captureResult.photo && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {language === "en" ? "Captured Image:" : "Picha Iliyopigiwa:"}
                  </p>
                  <img 
                    src={captureResult.photo} 
                    alt="Captured" 
                    className="w-full h-auto rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {captureResult.text && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {language === "en" ? "Additional Notes:" : "Maelezo Zaidi:"}
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    {captureResult.text}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features List */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">
            {language === "en" ? "System Features" : "Vipengele vya Mfumo"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 bg-green-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              </div>
              <span className="text-gray-700">
                {language === "en" ? "Real-time quality checks" : "Ukaguzi wa ubora wa wakati halisi"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 bg-green-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              </div>
              <span className="text-gray-700">
                {language === "en" ? "Guided capture with overlays" : "Kupiga picha kwa mwongozo na vitando"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 bg-green-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              </div>
              <span className="text-gray-700">
                {language === "en" ? "Multi-modal input (photo + voice)" : "Ingizo la aina nyingi (picha + sauti)"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 bg-green-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              </div>
              <span className="text-gray-700">
                {language === "en" ? "Offline-capable architecture" : "Usanifu unaoweza kufanya kazi nje ya mtandao"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 bg-green-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              </div>
              <span className="text-gray-700">
                {language === "en" ? "Bilingual support (EN/SW)" : "Msaada wa lugha mbili (EN/SW)"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 bg-green-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              </div>
              <span className="text-gray-700">
                {language === "en" ? "Context-aware guidance" : "Mwongozo unaotambua muktadha"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Capture Flow Modal */}
      {activeCaptureMode && (
        <UniversalCaptureFlow
          mode={activeCaptureMode}
          language={language}
          onCapture={handleCapture}
          onClose={() => setActiveCaptureMode(null)}
        />
      )}
    </div>
  );
}
