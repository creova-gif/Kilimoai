import { useState } from "react";
import {
  Beaker, MapPin, Calendar, CheckCircle2, Clock, Droplets,
  Leaf, TrendingUp, AlertCircle, Package, Truck, FileText,
  Download, Phone, Upload, Camera, ChevronDown, ChevronRight,
  Info, HelpCircle, ArrowRight, Zap, Target, X, Plus,
  Activity, BarChart3, Sprout, ShoppingCart, Eye, Link2,
  Lightbulb, BookOpen, Play, Microscope, TestTube, Users
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface SoilTestingServiceProps {
  userId: string;
  language: "en" | "sw";
  onNavigate?: (tab: string) => void;
}

interface SoilTestResult {
  id: string;
  farmLocation: string;
  fieldName: string;
  cropPlanned: string;
  testDate: string;
  status: "pending" | "processing" | "completed";
  results?: {
    ph: number;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    organicMatter: number;
    calcium: string;
    magnesium: string;
    recommendations: {
      summary: string;
      actionable: string[];
      linkedProducts: string[];
      yieldImpact: string;
    };
  };
}

export function SoilTestingService({ userId, language, onNavigate }: SoilTestingServiceProps) {
  const [viewMode, setViewMode] = useState<"learn" | "test">("learn");
  const [activeTab, setActiveTab] = useState<"request" | "my_tests">("request");
  const [expandedSection, setExpandedSection] = useState<string | null>("why-test");
  const [selectedPackage, setSelectedPackage] = useState<"basic" | "standard" | "premium">("standard");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SoilTestResult | null>(null);

  const testResults: SoilTestResult[] = [
    {
      id: "ST-2026-001",
      farmLocation: "Dodoma, Chamwino District",
      fieldName: "North Field",
      cropPlanned: language === "en" ? "Maize" : "Mahindi",
      testDate: "2026-01-15",
      status: "completed",
      results: {
        ph: 6.2,
        nitrogen: language === "en" ? "Low" : "Chini",
        phosphorus: language === "en" ? "Low" : "Chini",
        potassium: language === "en" ? "Medium" : "Wastani",
        organicMatter: 2.8,
        calcium: language === "en" ? "Medium" : "Wastani",
        magnesium: language === "en" ? "High" : "Juu",
        recommendations: {
          summary: language === "en"
            ? "Your soil lacks nitrogen and phosphorus — critical for maize growth. Without treatment, expect 15-20% yield loss."
            : "Udongo wako unakosa nitrojeni na fosforasi — muhimu kwa ukuaji wa mahindi. Bila matibabu, tarajia hasara ya mavuno ya 15-20%.",
          actionable: [
            language === "en" ? "Apply DAP fertilizer at 100kg/acre before planting" : "Tumia mbolea ya DAP kwa kilo 100 kwa ekari kabla ya kupanda",
            language === "en" ? "Top-dress with Urea (50kg/acre) at 4 weeks after planting" : "Ongeza Urea (kilo 50 kwa ekari) wiki 4 baada ya kupanda",
            language === "en" ? "Add compost (2 tons/acre) to improve organic matter" : "Ongeza mbolea asilia (tani 2 kwa ekari) kuboresha dutu",
            language === "en" ? "Your pH is good — no lime needed" : "pH yako ni nzuri — hakuna haja ya chokaa"
          ],
          linkedProducts: ["DAP Fertilizer (50kg)", "Urea (50kg)", "Organic Compost"],
          yieldImpact: language === "en"
            ? "Following these steps could increase yield from 2 to 3.5 tons/acre (+75%)"
            : "Kufuata hatua hizi kunaweza kuongeza mavuno kutoka tani 2 hadi 3.5 kwa ekari (+75%)"
        }
      }
    },
    {
      id: "ST-2026-002",
      farmLocation: "Arusha, Meru District",
      fieldName: "Coffee Field",
      cropPlanned: language === "en" ? "Coffee" : "Kahawa",
      testDate: "2026-01-20",
      status: "processing"
    },
    {
      id: "ST-2026-003",
      farmLocation: "Mbeya, Mbarali District",
      fieldName: "South Plot",
      cropPlanned: language === "en" ? "Beans" : "Maharage",
      testDate: "2026-01-22",
      status: "pending"
    }
  ];

  const testingPackages = [
    {
      id: "basic",
      name: language === "en" ? "Basic Soil Test" : "Upimaji wa Msingi wa Udongo",
      price: 15000,
      duration: language === "en" ? "7-10 days" : "Siku 7-10",
      features: [
        language === "en" ? "pH Level Analysis" : "Uchambuzi wa Kiwango cha pH",
        language === "en" ? "NPK Testing (Nitrogen, Phosphorus, Potassium)" : "Upimaji wa NPK (Nitrojeni, Fosforasi, Potasiamu)",
        language === "en" ? "Basic Recommendations" : "Mapendekezo ya Msingi",
        language === "en" ? "Digital Report" : "Ripoti ya Kidijitali"
      ],
      bestFor: language === "en" ? "First-time testing, basic crops" : "Upimaji wa mara ya kwanza, mazao ya msingi"
    },
    {
      id: "standard",
      name: language === "en" ? "Standard Soil Analysis" : "Uchambuzi wa Kawaida wa Udongo",
      price: 25000,
      duration: language === "en" ? "5-7 days" : "Siku 5-7",
      features: [
        language === "en" ? "All Basic features" : "Vipengele vyote vya Msingi",
        language === "en" ? "Micronutrient Analysis (Calcium, Magnesium, Sulfur)" : "Uchambuzi wa Virutubisho Vidogo (Kalisiamu, Magnesiamu, Sulfuri)",
        language === "en" ? "Organic Matter Testing" : "Upimaji wa Dutu",
        language === "en" ? "Crop-Specific Fertilizer Plan" : "Mpango wa Mbolea Maalum kwa Zao",
        language === "en" ? "Linked to Input Marketplace" : "Imeunganishwa na Soko la Pembejeo"
      ],
      bestFor: language === "en" ? "Most farmers — best value" : "Wakulima wengi — thamani bora zaidi",
      popular: true
    },
    {
      id: "premium",
      name: language === "en" ? "Premium Soil Health Package" : "Kifurushi cha Afya ya Udongo cha Juu",
      price: 40000,
      duration: language === "en" ? "3-5 days" : "Siku 3-5",
      features: [
        language === "en" ? "All Standard features" : "Vipengele vyote vya Kawaida",
        language === "en" ? "Heavy Metal Screening (Safety Check)" : "Upimaji wa Metali Nzito (Ukaguzi wa Usalama)",
        language === "en" ? "Soil Biology Assessment (Microbes)" : "Tathmini ya Biolojia ya Udongo (Vijidudu)",
        language === "en" ? "Multi-Season Planning (3 crop rotations)" : "Mpango wa Misimu Mingi (miviziaji 3 ya mazao)",
        language === "en" ? "Free Expert Consultation (30 min)" : "Ushauri wa Mtaalamu Bure (dakika 30)",
        language === "en" ? "Priority Processing" : "Usindikaji wa Kipaumbele"
      ],
      bestFor: language === "en" ? "High-value crops, export quality" : "Mazao ya thamani kubwa, ubora wa kuuza nje"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/10 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white px-4 lg:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <Beaker className="h-7 w-7" />
            {language === "en" ? "Soil Testing Service" : "Huduma ya Upimaji wa Udongo"}
          </h1>
          <p className="text-green-100 text-sm">
            {language === "en" 
              ? "Understand your soil, maximize your yields"
              : "Elewa udongo wako, ongeza mavuno yako"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 -mt-4">
        {/* DUAL-LAYER VIEW MODE TOGGLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-1 flex gap-2">
          <button
            onClick={() => setViewMode("learn")}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              viewMode === "learn"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <BookOpen className="h-5 w-5" />
            {language === "en" ? "Why Test Soil?" : "Kwa Nini Kupima Udongo?"}
          </button>
          <button
            onClick={() => setViewMode("test")}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              viewMode === "test"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Beaker className="h-5 w-5" />
            {language === "en" ? "Get Tested" : "Pima Udongo"}
            {testResults.length > 0 && (
              <span className="px-2 py-0.5 bg-white text-green-600 text-xs font-bold rounded-full">
                {testResults.length}
              </span>
            )}
          </button>
        </div>

        {/* ========== LEARNING MODE ========== */}
        {viewMode === "learn" && (
          <div className="space-y-6">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Microscope className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">
                    {language === "en" 
                      ? "Your Soil Holds the Secret to Better Yields" 
                      : "Udongo Wako Una Siri ya Mavuno Bora"}
                  </h2>
                  <p className="text-white/90 mb-4">
                    {language === "en"
                      ? "Know exactly what your soil needs. Stop guessing on fertilizer. Increase yields by 30-50% with the right nutrients."
                      : "Jua hasa kile udongo wako unahitaji. Acha kukisia juu ya mbolea. Ongeza mavuno kwa 30-50% kwa virutubisho sahihi."}
                  </p>
                  <button 
                    onClick={() => setViewMode("test")}
                    className="px-6 py-2 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition-colors"
                  >
                    {language === "en" ? "Request Soil Test" : "Omba Upimaji wa Udongo"}
                  </button>
                </div>
              </div>
            </div>

            {/* Why Test Soil */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "why-test" ? null : "why-test")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "Why Test Your Soil?" : "Kwa Nini Kupima Udongo Wako?"}
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "why-test" ? "rotate-180" : ""}`} />
              </button>

              {expandedSection === "why-test" && (
                <div className="px-6 pb-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      {language === "en" ? "The Problem" : "Tatizo"}
                    </h4>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {language === "en"
                        ? "Most farmers apply the same fertilizer year after year, regardless of what their soil actually needs. This is like taking random medicine without a diagnosis — wasteful and ineffective."
                        : "Wakulima wengi wanatumia mbolea ile ile kila mwaka, bila kujali udongo wao unahitaji nini. Hii ni kama kunywa dawa bila kuchunguza — ni upotevu na haina ufanisi."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: <TrendingUp className="h-6 w-6 text-green-600" />,
                        title: language === "en" ? "Stop Wasting Money" : "Acha Kupoteza Pesa",
                        desc: language === "en"
                          ? "Apply only what you need. Farmers save 20-30% on fertilizer costs by using soil-specific recommendations."
                          : "Tumia tu unachohitaji. Wakulima wanaokoa 20-30% kwa gharama za mbolea kwa kutumia mapendekezo maalum ya udongo."
                      },
                      {
                        icon: <Sprout className="h-6 w-6 text-green-600" />,
                        title: language === "en" ? "Increase Yields" : "Ongeza Mavuno",
                        desc: language === "en"
                          ? "Balanced nutrition = stronger plants. Expect 30-50% yield increase when you fix soil deficiencies."
                          : "Lishe kamilifu = mimea yenye nguvu. Tarajia ongezeko la mavuno la 30-50% unaporekebisha upungufu wa udongo."
                      },
                      {
                        icon: <Activity className="h-6 w-6 text-green-600" />,
                        title: language === "en" ? "Prevent Problems" : "Zuia Matatizo",
                        desc: language === "en"
                          ? "Low pH causes stunted growth. Excess nitrogen invites pests. Know problems before they happen."
                          : "pH ya chini inasababisha ukuaji mdogo. Nitrojeni nyingi huita wadudu. Jua matatizo kabla hayajatokea."
                      },
                      {
                        icon: <Target className="h-6 w-6 text-green-600" />,
                        title: language === "en" ? "Long-Term Planning" : "Mpango wa Muda Mrefu",
                        desc: language === "en"
                          ? "Test once, plan for 3 years. Build soil health season by season with the right amendments."
                          : "Pima mara moja, panga kwa miaka 3. Jenga afya ya udongo msimu kwa msimu kwa marekebisho sahihi."
                      }
                    ].map((benefit, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">{benefit.icon}</div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm mb-1">{benefit.title}</h4>
                            <p className="text-xs text-gray-600">{benefit.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border-2 border-amber-200">
                    <div className="flex items-start gap-3">
                      <Zap className="h-6 w-6 text-amber-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-amber-900 mb-1">
                          {language === "en" ? "Real Example" : "Mfano Halisi"}
                        </h4>
                        <p className="text-sm text-amber-800">
                          {language === "en"
                            ? "Farmer in Dodoma spent 150,000 TZS/year on NPK fertilizer. Soil test revealed he had plenty of P and K, but lacked nitrogen. Switched to Urea only (80,000 TZS) and yields jumped 40%. Saved money + earned more."
                            : "Mkulima huko Dodoma alitumia TZS 150,000 kwa mwaka kwa mbolea ya NPK. Upimaji wa udongo ulidhihirisha alikuwa na P na K ya kutosha, lakini alipungukiwa na nitrojeni. Alibadilisha kwenda Urea tu (TZS 80,000) na mavuno yaliongezeka 40%. Aliokoa pesa + akapata zaidi."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* How It Works - Journey */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "journey" ? null : "journey")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "The Soil Testing Journey" : "Safari ya Upimaji wa Udongo"}
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "journey" ? "rotate-180" : ""}`} />
              </button>

              {expandedSection === "journey" && (
                <div className="px-6 pb-6">
                  {/* Visual Step-by-Step */}
                  <div className="relative">
                    <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gray-200"></div>
                    
                    <div className="space-y-6">
                      {[
                        {
                          step: 1,
                          icon: <Package className="h-6 w-6" />,
                          title: language === "en" ? "Request Test Kit" : "Omba Kifaa cha Upimaji",
                          desc: language === "en"
                            ? "Choose your package. We'll send you a soil collection kit with instructions (or you can upload existing lab results)."
                            : "Chagua kifurushi chako. Tutakutumia kifaa cha kukusanya udongo pamoja na maelekezo (au unaweza kupakua matokeo ya maabara yaliyopo).",
                          time: "1 day",
                          visual: language === "en" ? "Kit includes: Sample bags, labeling cards, collection tool" : "Kifaa kinajumuisha: Mifuko ya sampuli, kadi za kuandika jina, kifaa cha kukusanya"
                        },
                        {
                          step: 2,
                          icon: <MapPin className="h-6 w-6" />,
                          title: language === "en" ? "Collect Soil Sample" : "Kusanya Sampuli ya Udongo",
                          desc: language === "en"
                            ? "Follow simple picture guide: Dig 6 inches deep, take 5 samples from different spots, mix together. Super easy."
                            : "Fuata mwongozo wa picha rahisi: Chimba inchi 6 kirefu, chukua sampuli 5 kutoka maeneo tofauti, changanya pamoja. Rahisi sana.",
                          time: "15 minutes",
                          visual: language === "en" ? "Video guide available offline" : "Mwongozo wa video unapatikana bila mtandao"
                        },
                        {
                          step: 3,
                          icon: <Truck className="h-6 w-6" />,
                          title: language === "en" ? "Send or Upload" : "Tuma au Pakia",
                          desc: language === "en"
                            ? "Option 1: Drop sample at nearest collection point. Option 2: Upload photo of existing lab report. We'll extract the data."
                            : "Chaguo 1: Acha sampuli katika kituo cha ukusanyaji karibu nawe. Chaguo 2: Pakia picha ya ripoti ya maabara iliyopo. Tutachukua data.",
                          time: "Same day",
                          visual: language === "en" ? "1,200+ collection points across Tanzania" : "Vituo 1,200+ vya ukusanyaji Tanzania nzima"
                        },
                        {
                          step: 4,
                          icon: <TestTube className="h-6 w-6" />,
                          title: language === "en" ? "Lab Testing" : "Upimaji wa Maabara",
                          desc: language === "en"
                            ? "Certified labs analyze 10+ soil parameters. You'll get SMS updates on progress."
                            : "Maabara zilizoidhinishwa zinachambuzi vipengele 10+ vya udongo. Utapata sasisho za SMS juu ya maendeleo.",
                          time: "3-10 days",
                          visual: language === "en" ? "Depending on package selected" : "Kutegemea kifurushi ulichochagua"
                        },
                        {
                          step: 5,
                          icon: <FileText className="h-6 w-6" />,
                          title: language === "en" ? "Get Results + Plan" : "Pata Matokeo + Mpango",
                          desc: language === "en"
                            ? "Results in plain language: What your soil has, what it lacks, and exactly what to buy + apply. Linked directly to Input Marketplace."
                            : "Matokeo kwa lugha rahisi: Kile udongo wako una, unachokosa, na hasa unanunua + kutumia nini. Imeunganishwa moja kwa moja kwenye Soko la Pembejeo.",
                          time: "Instant",
                          visual: language === "en" ? "Digital report + fertilizer shopping list" : "Ripoti ya kidijitali + orodha ya ununuzi wa mbolea"
                        }
                      ].map((item) => (
                        <div key={item.step} className="relative pl-16">
                          <div className="absolute left-0 h-12 w-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                            {item.step}
                          </div>
                          
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                {item.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-green-900 mb-1">{item.title}</h4>
                                <p className="text-sm text-green-800">{item.desc}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-green-600 font-bold">{item.time}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-green-700 bg-white rounded px-3 py-2">
                              <Info className="h-3 w-3" />
                              {item.visual}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Understanding Results */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "understanding" ? null : "understanding")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "Understanding Your Results" : "Kuelewa Matokeo Yako"}
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "understanding" ? "rotate-180" : ""}`} />
              </button>

              {expandedSection === "understanding" && (
                <div className="px-6 pb-6 space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 mb-3">
                      {language === "en" ? "We Translate Science Into Action" : "Tunatafsiri Sayansi Kuwa Hatua"}
                    </h4>
                    <p className="text-sm text-gray-800 mb-4">
                      {language === "en"
                        ? "You won't see confusing lab numbers. You'll see:"
                        : "Hutaona nambari za maabara zinazovuruga. Utaona:"}
                    </p>
                    
                    {/* Example Result */}
                    <div className="bg-white rounded-lg p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 mb-1">
                            {language === "en" ? "❌ Problem Identified" : "❌ Tatizo Limegunduliwa"}
                          </div>
                          <div className="text-sm text-gray-700 mb-2">
                            {language === "en"
                              ? "\"Your soil lacks nitrogen — critical for maize growth. Without treatment, expect 15-20% yield loss.\""
                              : "\"Udongo wako unakosa nitrojeni — muhimu kwa ukuaji wa mahindi. Bila matibabu, tarajia hasara ya mavuno ya 15-20%.\""}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 mb-1">
                            {language === "en" ? "✓ Exact Solution" : "✓ Suluhisho Halisi"}
                          </div>
                          <div className="text-sm text-gray-700 space-y-1">
                            <div>• {language === "en" ? "Apply Urea (50kg/acre) at planting" : "Tumia Urea (kilo 50 kwa ekari) wakati wa kupanda"}</div>
                            <div>• {language === "en" ? "Top-dress with DAP (30kg/acre) at 4 weeks" : "Ongeza DAP (kilo 30 kwa ekari) wiki 4"}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 mb-1">
                            {language === "en" ? "📈 Expected Impact" : "📈 Athari Inayotarajiwa"}
                          </div>
                          <div className="text-sm text-gray-700">
                            {language === "en"
                              ? "\"Following these steps could increase yield from 2 to 3.5 tons/acre (+75%)\""
                              : "\"Kufuata hatua hizi kunaweza kuongeza mavuno kutoka tani 2 hadi 3.5 kwa ekari (+75%)\""}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <ShoppingCart className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 mb-1">
                            {language === "en" ? "🛒 Buy Now (Linked)" : "🛒 Nunua Sasa (Imeunganishwa)"}
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              Urea 50kg → 45,000 TZS
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              DAP 30kg → 38,000 TZS
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-start gap-3">
                      <Link2 className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-amber-900 text-sm mb-1">
                          {language === "en" ? "Connected to Input Marketplace" : "Imeunganishwa na Soko la Pembejeo"}
                        </h4>
                        <p className="text-xs text-amber-800">
                          {language === "en"
                            ? "Every recommendation includes direct links to buy the exact products you need from verified sellers. No guesswork, no wasted trips."
                            : "Kila pendekezo linajumuisha viungo vya moja kwa moja vya kununua bidhaa hasa unazohitaji kutoka kwa wauzaji walioidhinishwa. Hakuna kukisia, hakuna safari za bure."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold mb-2">
                {language === "en" ? "Ready to Test Your Soil?" : "Tayari Kupima Udongo Wako?"}
              </h3>
              <p className="text-white/90 mb-4">
                {language === "en"
                  ? "Choose a testing package and start improving your yields today."
                  : "Chagua kifurushi cha upimaji na anza kuboresha mavuno yako leo."}
              </p>
              <button
                onClick={() => setViewMode("test")}
                className="px-8 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition-colors"
              >
                {language === "en" ? "View Testing Packages" : "Angalia Vifurushi vya Upimaji"}
              </button>
            </div>
          </div>
        )}

        {/* ========== TESTING MODE ========== */}
        {viewMode === "test" && (
          <div className="space-y-6">
            {/* Quick Learning Access */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-green-800">
                    {language === "en"
                      ? "First time testing? Learn why soil testing matters and how to collect a perfect sample."
                      : "Mara ya kwanza kupima? Jifunze kwa nini upimaji wa udongo ni muhimu na jinsi ya kukusanya sampuli kamili."}
                  </p>
                  <button
                    onClick={() => setViewMode("learn")}
                    className="mt-2 text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    {language === "en" ? "Learn About Soil Testing" : "Jifunze Kuhusu Upimaji wa Udongo"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("request")}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === "request"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {language === "en" ? "Request Test" : "Omba Upimaji"}
                </button>
                <button
                  onClick={() => setActiveTab("my_tests")}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === "my_tests"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {language === "en" ? "My Tests" : "Upimaji Wangu"}
                  {testResults.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                      {testResults.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* REQUEST TAB */}
            {activeTab === "request" && (
              <div className="space-y-6">
                {/* Packages */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {testingPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id as any)}
                      className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all ${
                        selectedPackage === pkg.id
                          ? "border-green-500 shadow-lg scale-105"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      } ${pkg.popular ? "relative" : ""}`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold rounded-full">
                          {language === "en" ? "MOST POPULAR" : "MAARUFU ZAIDI"}
                        </div>
                      )}
                      
                      <div className="text-center mb-4">
                        <h3 className="font-bold text-gray-900 mb-2">{pkg.name}</h3>
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {pkg.price.toLocaleString()} <span className="text-lg">TZS</span>
                        </div>
                        <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3" />
                          {pkg.duration}
                        </div>
                      </div>

                      <ul className="space-y-2 mb-4">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 italic">
                        <span className="font-semibold">{language === "en" ? "Best for:" : "Bora kwa:"}</span> {pkg.bestFor}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload or Request Options */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">
                    {language === "en" ? "Choose How to Proceed" : "Chagua Jinsi ya Kuendelea"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        toast.success(language === "en" 
                          ? "Test kit request submitted! We'll deliver it within 2 days."
                          : "Ombi la kifaa cha upimaji limetumwa! Tutalituma ndani ya siku 2.");
                      }}
                      className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:border-green-400 transition-all text-left"
                    >
                      <Package className="h-10 w-10 text-green-600 mb-3" />
                      <h4 className="font-bold text-gray-900 mb-2">
                        {language === "en" ? "Request Test Kit" : "Omba Kifaa cha Upimaji"}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {language === "en"
                          ? "We'll send you everything you need to collect a soil sample. Delivery in 1-2 days."
                          : "Tutakutumia kila kitu unachohitaji kukusanya sampuli ya udongo. Utoaji ndani ya siku 1-2."}
                      </p>
                      <div className="text-xs text-green-600 font-bold flex items-center gap-1">
                        <ArrowRight className="h-4 w-4" />
                        {language === "en" ? "Recommended for first-time users" : "Inapendekezwa kwa watumiaji wa mara ya kwanza"}
                      </div>
                    </button>

                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="p-6 bg-gradient-to-r from-gray-50 to-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-400 transition-all text-left"
                    >
                      <Upload className="h-10 w-10 text-gray-600 mb-3" />
                      <h4 className="font-bold text-gray-900 mb-2">
                        {language === "en" ? "Upload Existing Results" : "Pakia Matokeo Yaliyopo"}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {language === "en"
                          ? "Already have a lab report? Upload it and we'll create your custom fertilizer plan instantly."
                          : "Tayari una ripoti ya maabara? Ipakia na tutaunda mpango wako maalum wa mbolea mara moja."}
                      </p>
                      <div className="text-xs text-gray-600 font-bold flex items-center gap-1">
                        <Zap className="h-4 w-4" />
                        {language === "en" ? "Get results in minutes" : "Pata matokeo ndani ya dakika"}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MY TESTS TAB */}
            {activeTab === "my_tests" && (
              <div className="space-y-4">
                {testResults.map((result) => (
                  <div key={result.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className={`p-6 ${result.status === "completed" ? "bg-gradient-to-r from-green-50 to-emerald-50" : "bg-gray-50"}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{result.fieldName}</h3>
                          <div className="text-sm text-gray-600">{result.farmLocation}</div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {result.testDate}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Sprout className="h-3 w-3" />
                              {result.cropPlanned}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            result.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : result.status === "processing"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-gray-200 text-gray-700"
                          }`}>
                            {result.status === "completed" && (language === "en" ? "✓ Complete" : "✓ Kamili")}
                            {result.status === "processing" && (language === "en" ? "⚗️ Processing" : "⚗️ Inachakatwa")}
                            {result.status === "pending" && (language === "en" ? "⏳ Pending" : "⏳ Inasubiri")}
                          </span>
                        </div>
                      </div>

                      {result.status === "completed" && result.results && (
                        <div className="space-y-4">
                          {/* Summary */}
                          <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-bold text-amber-900 mb-2">
                                  {language === "en" ? "Key Finding" : "Matokeo Muhimu"}
                                </h4>
                                <p className="text-sm text-amber-800 leading-relaxed">
                                  {result.results.recommendations.summary}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Soil Metrics */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                              { label: "pH", value: result.results.ph, status: "good" },
                              { label: language === "en" ? "Nitrogen" : "Nitrojeni", value: result.results.nitrogen, status: result.results.nitrogen === "Low" || result.results.nitrogen === "Chini" ? "low" : "good" },
                              { label: language === "en" ? "Phosphorus" : "Fosforasi", value: result.results.phosphorus, status: result.results.phosphorus === "Low" || result.results.phosphorus === "Chini" ? "low" : "good" },
                              { label: language === "en" ? "Potassium" : "Potasiamu", value: result.results.potassium, status: "medium" }
                            ].map((metric, idx) => (
                              <div key={idx} className={`rounded-lg p-3 border-2 ${
                                metric.status === "low" ? "bg-red-50 border-red-200" :
                                metric.status === "medium" ? "bg-yellow-50 border-yellow-200" :
                                "bg-green-50 border-green-200"
                              }`}>
                                <div className="text-xs text-gray-600 mb-1">{metric.label}</div>
                                <div className={`font-bold ${
                                  metric.status === "low" ? "text-red-700" :
                                  metric.status === "medium" ? "text-yellow-700" :
                                  "text-green-700"
                                }`}>
                                  {metric.value}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Action Plan */}
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <Target className="h-5 w-5" />
                              {language === "en" ? "Your Action Plan" : "Mpango Wako wa Hatua"}
                            </h4>
                            <ul className="space-y-2">
                              {result.results.recommendations.actionable.map((action, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-800">{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Yield Impact */}
                          <div className="bg-gradient-to-r from-green-50 to-green-50 rounded-lg p-4 border-2 border-green-200">
                            <div className="flex items-start gap-3">
                              <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-bold text-green-900 mb-1">
                                  {language === "en" ? "Expected Impact" : "Athari Inayotarajiwa"}
                                </h4>
                                <p className="text-sm text-green-800 font-medium">
                                  {result.results.recommendations.yieldImpact}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Linked Products */}
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <ShoppingCart className="h-5 w-5 text-green-600" />
                              {language === "en" ? "Shop Recommended Inputs" : "Nunua Pembejeo Zinazopendekeza"}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {result.results.recommendations.linkedProducts.map((product, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    toast.success(language === "en" 
                                      ? `Opening Input Marketplace for ${product}...`
                                      : `Inafungua Soko la Pembejeo kwa ${product}...`);
                                    if (onNavigate) onNavigate("input-supply");
                                  }}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                  {product}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            <button className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                              <Download className="h-4 w-4" />
                              {language === "en" ? "Download PDF" : "Pakua PDF"}
                            </button>
                            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                              <Users className="h-4 w-4" />
                              {language === "en" ? "Consult Expert" : "Shauriana na Mtaalamu"}
                            </button>
                          </div>
                        </div>
                      )}

                      {result.status === "processing" && (
                        <div className="bg-white rounded-lg p-6 text-center">
                          <Activity className="h-12 w-12 text-gray-600 mx-auto mb-3 animate-pulse" />
                          <div className="font-semibold text-gray-900 mb-1">
                            {language === "en" ? "Testing in Progress" : "Upimaji Unaendelea"}
                          </div>
                          <p className="text-sm text-gray-600">
                            {language === "en"
                              ? "Your sample is being analyzed. We'll SMS you when results are ready."
                              : "Sampuli yako inachambuliwa. Tutakutumia SMS matokeo yatakapokuwa tayari."}
                          </p>
                        </div>
                      )}

                      {result.status === "pending" && (
                        <div className="bg-white rounded-lg p-6 text-center">
                          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <div className="font-semibold text-gray-900 mb-1">
                            {language === "en" ? "Waiting for Sample" : "Inasubiri Sampuli"}
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            {language === "en"
                              ? "Drop your sample at the nearest collection point to start testing."
                              : "Acha sampuli yako katika kituo cha ukusanyaji karibu nawe kuanza upimaji."}
                          </p>
                          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            {language === "en" ? "Find Collection Points" : "Tafuta Vituo vya Ukusanyaji"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal (simplified) */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {language === "en" ? "Upload Lab Results" : "Pakia Matokeo ya Maabara"}
              </h2>
              <button onClick={() => setShowUploadModal(false)}>
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 cursor-pointer transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {language === "en" ? "Take a photo or upload PDF" : "Chukua picha au pakia PDF"}
              </p>
              <p className="text-xs text-gray-500">
                {language === "en" ? "We'll extract the data automatically" : "Tutachukua data moja kwa moja"}
              </p>
            </div>

            <button
              onClick={() => {
                toast.success(language === "en"
                  ? "Results uploaded! Processing your fertilizer plan..."
                  : "Matokeo yamepakiwa! Tunachakata mpango wako wa mbolea...");
                setShowUploadModal(false);
              }}
              className="w-full mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
            >
              {language === "en" ? "Upload & Process" : "Pakia na Chakata"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}