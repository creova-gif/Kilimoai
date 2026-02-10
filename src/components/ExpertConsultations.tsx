import { useState } from "react";
import {
  Users, Calendar, Video, Phone, MessageSquare, Star, Clock,
  CheckCircle2, Award, Sprout, Bug, Droplets, TrendingUp,
  BookOpen, DollarSign, Shield, Search, Filter, ChevronDown,
  ChevronRight, MapPin, Languages, Zap, Heart, ThumbsUp,
  Target, ArrowRight, Info, HelpCircle, Eye, Send, Mic,
  Play, CheckCircle, AlertCircle, Globe, Verified, BadgeCheck
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ExpertConsultationsProps {
  userId: string;
  language: "en" | "sw";
  onNavigate?: (tab: string) => void;
}

interface Expert {
  id: string;
  name: string;
  title: string;
  specialty: string[];
  rating: number;
  totalConsultations: number;
  successStories: number;
  experience: string;
  languages: string[];
  location: string;
  availability: string;
  pricePerSession: number;
  avatar: string;
  verified: boolean;
  responseTime: string;
  credentials: string[];
  recentOutcomes: {
    problem: string;
    solution: string;
    impact: string;
  }[];
}

interface Consultation {
  id: string;
  expertName: string;
  expertAvatar: string;
  specialty: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled" | "in_progress";
  type: "video" | "phone" | "chat" | "voice_note";
  notes?: string;
  outcome?: string;
}

export function ExpertConsultations({ userId, language, onNavigate }: ExpertConsultationsProps) {
  const [viewMode, setViewMode] = useState<"learn" | "experts">("learn");
  const [activeTab, setActiveTab] = useState<"browse" | "matched" | "my_consultations">("matched");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("why-experts");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");
  const [consultationType, setConsultationType] = useState<"video" | "phone" | "chat" | "voice_note">("chat");

  // Mock expert data with rich profiles
  const experts: Expert[] = [
    {
      id: "exp-001",
      name: "Dr. Amina Mwangi",
      title: "Agricultural Pathologist",
      specialty: ["Crop Diseases", "Pest Management", "Organic Farming"],
      rating: 4.9,
      totalConsultations: 487,
      successStories: 156,
      experience: "15 years",
      languages: ["English", "Swahili", "Kikuyu"],
      location: "Arusha, Tanzania",
      availability: language === "en" ? "Available Now" : "Inapatikana Sasa",
      pricePerSession: 15000,
      avatar: "👩‍🔬",
      verified: true,
      responseTime: language === "en" ? "Usually responds in 2 hours" : "Kawaida anajibu ndani ya masaa 2",
      credentials: ["PhD Crop Science", "Certified IPM Specialist", "15+ peer-reviewed publications"],
      recentOutcomes: [
        {
          problem: language === "en" ? "Tomato blight outbreak" : "Mlipuko wa ugonjwa wa nyanya",
          solution: language === "en" ? "Prescribed copper-based treatment + pruning" : "Alipendekezwa dawa ya shaba + kukata",
          impact: language === "en" ? "Saved 80% of crop, farmer earned 2.3M TZS" : "Aliokoa 80% ya zao, mkulima alipata 2.3M TZS"
        },
        {
          problem: language === "en" ? "Unknown pest attacking maize" : "Wadudu wasiojulikana wakishambulia mahindi",
          solution: language === "en" ? "Identified armyworm, advised bio-pesticide" : "Alitambua jeshi la majangili, alishauri dawa ya kibiolojia",
          impact: language === "en" ? "Prevented total loss, harvest on track" : "Kuzuia hasara kamili, mavuno yanaendelea vizuri"
        }
      ]
    },
    {
      id: "exp-002",
      name: "Eng. Joseph Kioko",
      title: "Irrigation & Water Management Specialist",
      specialty: ["Irrigation Systems", "Water Conservation", "Drip Technology"],
      rating: 4.8,
      totalConsultations: 312,
      successStories: 98,
      experience: "12 years",
      languages: ["English", "Swahili"],
      location: "Dodoma, Tanzania",
      availability: language === "en" ? "Next available: Today 3PM" : "Inapatikana: Leo 3PM",
      pricePerSession: 20000,
      avatar: "👨‍💼",
      verified: true,
      responseTime: language === "en" ? "Usually responds in 4 hours" : "Kawaida anajibu ndani ya masaa 4",
      credentials: ["BSc Agricultural Engineering", "Drip Irrigation Certified", "World Bank Consultant"],
      recentOutcomes: [
        {
          problem: language === "en" ? "High water bills, low yields" : "Bili za maji juu, mavuno madogo",
          solution: language === "en" ? "Designed affordable drip system" : "Aliunda mfumo wa matone wa bei nafuu",
          impact: language === "en" ? "Water use cut 60%, yields up 40%" : "Matumizi ya maji yamepungua 60%, mavuno yameongezeka 40%"
        }
      ]
    },
    {
      id: "exp-003",
      name: "Prof. Grace Njeri",
      title: "Soil Health & Fertility Scientist",
      specialty: ["Soil Testing", "Fertilizer Management", "Soil Conservation"],
      rating: 4.9,
      totalConsultations: 523,
      successStories: 201,
      experience: "18 years",
      languages: ["English", "Swahili"],
      location: "Mwanza, Tanzania",
      availability: language === "en" ? "Available Tomorrow" : "Inapatikana Kesho",
      pricePerSession: 18000,
      avatar: "👩‍🏫",
      verified: true,
      responseTime: language === "en" ? "Usually responds in 1 hour" : "Kawaida anajibu ndani ya saa 1",
      credentials: ["PhD Soil Science", "FAO Consultant", "Author: 'Healthy Soils for Africa'"],
      recentOutcomes: [
        {
          problem: language === "en" ? "Declining maize yields year after year" : "Mavuno ya mahindi yanashuka kila mwaka",
          solution: language === "en" ? "Soil test revealed severe P deficiency, custom fertilizer plan" : "Kipimo cha udongo kilionyesha upungufu mkubwa wa P, mpango maalum wa mbolea",
          impact: language === "en" ? "Yields doubled in one season" : "Mavuno yameongezeka mara mbili katika msimu mmoja"
        }
      ]
    },
    {
      id: "exp-004",
      name: "Dr. Samuel Ouma",
      title: "Livestock Veterinarian",
      specialty: ["Animal Health", "Dairy Management", "Vaccine Programs"],
      rating: 4.7,
      totalConsultations: 289,
      successStories: 112,
      experience: "10 years",
      languages: ["English", "Swahili", "Luo"],
      location: "Mbeya, Tanzania",
      availability: language === "en" ? "Available Now" : "Inapatikana Sasa",
      pricePerSession: 25000,
      avatar: "👨‍⚕️",
      verified: true,
      responseTime: language === "en" ? "Usually responds in 3 hours" : "Kawaida anajibu ndani ya masaa 3",
      credentials: ["DVM Veterinary Medicine", "Certified Livestock Specialist", "10+ years field experience"],
      recentOutcomes: [
        {
          problem: language === "en" ? "Cow producing less milk, seems weak" : "Ng'ombe anatoa maziwa kidogo, anaonekana dhaifu",
          solution: language === "en" ? "Diagnosed mineral deficiency, prescribed supplement" : "Alipima upungufu wa madini, alipendekezwa virutubisho",
          impact: language === "en" ? "Milk production restored, calf born healthy" : "Uzalishaji wa maziwa ulirejeshwa, ndama alizaliwa akiwa na afya"
        }
      ]
    }
  ];

  const myConsultations: Consultation[] = [
    {
      id: "cons-001",
      expertName: "Dr. Amina Mwangi",
      expertAvatar: "👩‍🔬",
      specialty: language === "en" ? "Crop Diseases" : "Magonjwa ya Mazao",
      date: "2026-01-28",
      time: "10:00 AM",
      status: "scheduled",
      type: "video",
      notes: language === "en" ? "Discuss tomato leaf spots" : "Jadili madoa ya majani ya nyanya"
    },
    {
      id: "cons-002",
      expertName: "Prof. Grace Njeri",
      expertAvatar: "👩‍🏫",
      specialty: language === "en" ? "Soil Health" : "Afya ya Udongo",
      date: "2026-01-20",
      time: "2:00 PM",
      status: "completed",
      type: "chat",
      outcome: language === "en" 
        ? "Received custom fertilizer plan for my maize field"
        : "Nimepokea mpango maalum wa mbolea kwa shamba langu la mahindi"
    }
  ];

  // Smart matching based on user context (would use AI in production)
  const matchedExperts = experts.slice(0, 2);

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.specialty.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty = filterSpecialty === "all" || expert.specialty.includes(filterSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-[#2E7D32] text-white px-4 lg:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <Users className="h-7 w-7" />
            {language === "en" ? "Expert Consultation" : "Ushauri wa Mtaalamu"}
          </h1>
          <p className="text-green-100 text-sm">
            {language === "en" 
              ? "Connect with verified agricultural experts for trusted advice"
              : "Unganisha na wataalamu wa kilimo walioidhinishwa kwa ushauri wa kuaminika"}
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
                ? "bg-[#2E7D32] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <HelpCircle className="h-5 w-5" />
            {language === "en" ? "Why Experts?" : "Kwa Nini Wataalamu?"}
          </button>
          <button
            onClick={() => setViewMode("experts")}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              viewMode === "experts"
                ? "bg-[#2E7D32] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Users className="h-5 w-5" />
            {language === "en" ? "Find Expert" : "Tafuta Mtaalamu"}
            {matchedExperts.length > 0 && (
              <span className="px-2 py-0.5 bg-white text-green-600 text-xs font-bold rounded-full">
                {matchedExperts.length}
              </span>
            )}
          </button>
        </div>

        {/* ========== LEARNING MODE ========== */}
        {viewMode === "learn" && (
          <div className="space-y-6">
            {/* Hero Banner */}
            <div className="bg-[#2E7D32] text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">
                    {language === "en" 
                      ? "Get Expert Advice You Can Trust" 
                      : "Pata Ushauri wa Mtaalamu Unaoaminika"}
                  </h2>
                  <p className="text-white/90 mb-4">
                    {language === "en"
                      ? "Every expert is verified, experienced, and rated by farmers like you. Get answers to your toughest farming questions."
                      : "Kila mtaalamu amethimbithishwa, ana uzoefu, na amekadiria na wakulima kama wewe. Pata majibu ya maswali yako magumu zaidi ya kilimo."}
                  </p>
                  <button 
                    onClick={() => setViewMode("experts")}
                    className="px-6 py-2 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition-colors"
                  >
                    {language === "en" ? "Browse Experts" : "Tazama Wataalamu"}
                  </button>
                </div>
              </div>
            </div>

            {/* Why Get Expert Help */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "why-experts" ? null : "why-experts")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "Why Get Expert Help?" : "Kwa Nini Kupata Msaada wa Mtaalamu?"}
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "why-experts" ? "rotate-180" : ""}`} />
              </button>

              {expandedSection === "why-experts" && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: <Target className="h-6 w-6 text-green-600" />,
                        title: language === "en" ? "Solve Problems Faster" : "Tatua Matatizo Haraka",
                        desc: language === "en" 
                          ? "Get accurate diagnosis and solutions in hours, not weeks. Experts have seen your problem before."
                          : "Pata uchunguzi sahihi na suluhisho ndani ya masaa, sio wiki. Wataalamu wameona tatizo lako hapo awali."
                      },
                      {
                        icon: <TrendingUp className="h-6 w-6 text-gray-700" />,
                        title: language === "en" ? "Increase Yields" : "Ongeza Mavuno",
                        desc: language === "en"
                          ? "Farmers who consult experts report 30-40% higher yields. Small changes, big impact."
                          : "Wakulima wanaoshauriana na wataalamu wanaripoti ongezeko la mavuno la 30-40%. Mabadiliko madogo, athari kubwa."
                      },
                      {
                        icon: <DollarSign className="h-6 w-6 text-orange-600" />,
                        title: language === "en" ? "Save Money" : "Okoa Pesa",
                        desc: language === "en"
                          ? "Stop wasting money on wrong inputs. Experts recommend exactly what your farm needs."
                          : "Acha kupoteza pesa kwenye pembejeo zisizo sahihi. Wataalamu wanapendekeza hasa kile shamba lako linahitaji."
                      },
                      {
                        icon: <Shield className="h-6 w-6 text-gray-700" />,
                        title: language === "en" ? "Reduce Risk" : "Punguza Hatari",
                        desc: language === "en"
                          ? "Expert advice helps you avoid costly mistakes and prevent disease outbreaks."
                          : "Ushauri wa mtaalamu unakusaidia kuepuka makosa ya gharama kubwa na kuzuia milipuko ya magonjwa."
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
                </div>
              )}
            </div>

            {/* How Verification Works */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "verification" ? null : "verification")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <BadgeCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "How We Verify Experts" : "Jinsi Tunavyothibitisha Wataalamu"}
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "verification" ? "rotate-180" : ""}`} />
              </button>

              {expandedSection === "verification" && (
                <div className="px-6 pb-6 space-y-4">
                  <div className="bg-green-50 rounded-lg p-5 border-2 border-green-200">
                    <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      {language === "en" ? "Our 5-Step Verification Process" : "Mchakato wetu wa Hatua 5 za Uthibitishaji"}
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          step: 1,
                          title: language === "en" ? "Credential Check" : "Ukaguzi wa Vyeti",
                          desc: language === "en" 
                            ? "We verify degrees, certifications, and professional licenses"
                            : "Tunathibitisha vyuo, vyeti, na leseni za kitaalamu"
                        },
                        {
                          step: 2,
                          title: language === "en" ? "Experience Validation" : "Uthibitishaji wa Uzoefu",
                          desc: language === "en"
                            ? "Minimum 5 years field experience required"
                            : "Uzoefu wa angalau miaka 5 ya shambani unahitajika"
                        },
                        {
                          step: 3,
                          title: language === "en" ? "Background Check" : "Ukaguzi wa Mandari",
                          desc: language === "en"
                            ? "Past employment and reference verification"
                            : "Uthibitishaji wa kazi za zamani na marejeleo"
                        },
                        {
                          step: 4,
                          title: language === "en" ? "Test Consultation" : "Ushauri wa Majaribio",
                          desc: language === "en"
                            ? "Experts complete practice consultations before going live"
                            : "Wataalamu wanakamilisha ushauri wa mazoezi kabla ya kuwa hai"
                        },
                        {
                          step: 5,
                          title: language === "en" ? "Ongoing Monitoring" : "Ufuatiliaji Unaoendelea",
                          desc: language === "en"
                            ? "Performance tracked, farmer ratings reviewed quarterly"
                            : "Utendaji unafuatiliwa, ukadiriaji wa wakulima unapitwa kila robo mwaka"
                        }
                      ].map((item) => (
                        <div key={item.step} className="flex items-start gap-3">
                          <div className="h-6 w-6 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                            {item.step}
                          </div>
                          <div>
                            <div className="font-semibold text-green-900 text-sm">{item.title}</div>
                            <div className="text-xs text-green-700">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">
                          {language === "en" ? "What the Badge Means" : "Nini Maana ya Alama"}
                        </h4>
                        <p className="text-xs text-gray-700">
                          {language === "en"
                            ? "When you see the ✓ Verified badge, it means this expert has passed all checks and maintains a 4.5+ rating from farmers."
                            : "Unapoona alama ya ✓ Imethibitishwa, inamaanisha mtaalamu huyu amepita ukaguzi wote na anadumisha ukadiriaji wa 4.5+ kutoka kwa wakulima."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Consultation Modes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "modes" ? null : "modes")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Video className="h-6 w-6 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "How to Consult" : "Jinsi ya Kushauriana"}
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "modes" ? "rotate-180" : ""}`} />
              </button>

              {expandedSection === "modes" && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: <MessageSquare className="h-6 w-6 text-gray-700" />,
                        mode: language === "en" ? "Text Chat" : "Maandishi",
                        price: "10,000 TZS",
                        time: language === "en" ? "Response within 2-4 hours" : "Jibu ndani ya masaa 2-4",
                        best: language === "en" ? "Best for: Simple questions, follow-ups" : "Bora kwa: Maswali rahisi, ufuatiliaji"
                      },
                      {
                        icon: <Mic className="h-6 w-6 text-green-600" />,
                        mode: language === "en" ? "Voice Notes" : "Sauti",
                        price: "10,000 TZS",
                        time: language === "en" ? "Response within 4-6 hours" : "Jibu ndani ya masaa 4-6",
                        best: language === "en" ? "Best for: Low data, describing symptoms" : "Bora kwa: Data kidogo, kuelezea dalili"
                      },
                      {
                        icon: <Phone className="h-6 w-6 text-orange-600" />,
                        mode: language === "en" ? "Phone Call" : "Simu",
                        price: "15,000 TZS",
                        time: language === "en" ? "30 min scheduled call" : "Simu iliyopangwa ya dakika 30",
                        best: language === "en" ? "Best for: Detailed discussions" : "Bora kwa: Majadiliano ya kina"
                      },
                      {
                        icon: <Video className="h-6 w-6 text-gray-700" />,
                        mode: language === "en" ? "Video Call" : "Video",
                        price: "20,000 TZS",
                        time: language === "en" ? "30 min video session" : "Kipindi cha video cha dakika 30",
                        best: language === "en" ? "Best for: Visual diagnosis, farm tours" : "Bora kwa: Uchunguzi wa kuona, ziara za shamba"
                      }
                    ].map((mode, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-shrink-0">{mode.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{mode.mode}</h4>
                            <div className="text-sm text-green-600 font-bold">{mode.price}</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {mode.time}
                          </div>
                          <div className="text-xs text-gray-500 italic">{mode.best}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-amber-900 text-sm mb-1">
                          {language === "en" ? "Low Connectivity?" : "Mtandao Mdogo?"}
                        </h4>
                        <p className="text-xs text-amber-800">
                          {language === "en"
                            ? "All video and voice calls are optimized for 2G/3G networks. Chat and voice notes work offline — your messages send automatically when you reconnect."
                            : "Simu zote za video na sauti zimeboreshwa kwa mitandao ya 2G/3G. Maandishi na sauti hufanya kazi bila mtandao — ujumbe wako unatuma moja kwa moja unapounganisha tena."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Success Stories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "Real Outcomes from Real Farmers" : "Matokeo Halisi kutoka kwa Wakulima Halisi"}
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {[
                  {
                    farmer: "Juma M., Dodoma",
                    problem: language === "en" ? "Maize leaves turning yellow" : "Majani ya mahindi yanageuka manjano",
                    expert: "Prof. Grace Njeri",
                    solution: language === "en" ? "Nitrogen deficiency. Applied urea fertilizer as advised." : "Upungufu wa nitrojeni. Nilitumia mbolea ya urea kama ilivyoshauri.",
                    outcome: language === "en" ? "Yield increased from 2 to 3.5 tons/acre. Earned extra 800,000 TZS." : "Mavuno yaliongezeka kutoka tani 2 hadi 3.5 kwa ekari. Nilipata TZS 800,000 zaidi."
                  },
                  {
                    farmer: "Grace K., Arusha",
                    problem: language === "en" ? "Tomatoes dying suddenly" : "Nyanya zinakufa ghafla",
                    expert: "Dr. Amina Mwangi",
                    solution: language === "en" ? "Identified bacterial wilt. Removed infected plants, treated soil." : "Alitambua ugonjwa wa ubatari. Aliondoa mimea iliyoambukizwa, alitibiya udongo.",
                    outcome: language === "en" ? "Stopped spread. Saved 75% of crop worth 1.2M TZS." : "Alizuia kuenea. Aliokoa 75% ya zao lenye thamani ya TZS 1.2M."
                  }
                ].map((story, idx) => (
                  <div key={idx} className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-10 w-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                        {story.farmer.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{story.farmer}</div>
                        <div className="text-xs text-gray-600 italic">"{story.problem}"</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="bg-white rounded p-3">
                        <div className="text-xs text-gray-500 mb-1">
                          {language === "en" ? "Expert:" : "Mtaalamu:"} {story.expert}
                        </div>
                        <div className="text-gray-800 text-xs">{story.solution}</div>
                      </div>
                      <div className="bg-green-100 rounded p-3 border border-green-300">
                        <div className="text-xs text-green-900 font-semibold mb-1">
                          {language === "en" ? "✓ Outcome:" : "✓ Matokeo:"}
                        </div>
                        <div className="text-xs text-green-800">{story.outcome}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-[#2E7D32] text-white rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold mb-2">
                {language === "en" ? "Ready to Get Expert Advice?" : "Tayari Kupata Ushauri wa Mtaalamu?"}
              </h3>
              <p className="text-white/90 mb-4">
                {language === "en"
                  ? "Browse verified experts matched to your crops and challenges."
                  : "Tazama wataalamu walioidhinishwa wanaofanana na mazao na changamoto zako."}
              </p>
              <button
                onClick={() => setViewMode("experts")}
                className="px-8 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition-colors"
              >
                {language === "en" ? "Find My Expert" : "Tafuta Mtaalamu Wangu"}
              </button>
            </div>
          </div>
        )}

        {/* ========== EXPERT BROWSING MODE ========== */}
        {viewMode === "experts" && (
          <div className="space-y-6">
            {/* Quick Learning Access */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    {language === "en"
                      ? "New to expert consultations? Learn how verification works and what to expect."
                      : "Mpya kwenye mashauriano ya wataalamu? Jifunze jinsi uthibitishaji unavyofanya kazi na unachotarajia."}
                  </p>
                  <button
                    onClick={() => setViewMode("learn")}
                    className="mt-2 text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    {language === "en" ? "Learn About Expert Verification" : "Jifunze Kuhusu Uthibitishaji wa Wataalamu"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("matched")}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors relative ${
                    activeTab === "matched"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {language === "en" ? "Matched for You" : "Umepangwa Wewe"}
                  {matchedExperts.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                      {matchedExperts.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("browse")}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === "browse"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {language === "en" ? "Browse All" : "Tazama Wote"}
                </button>
                <button
                  onClick={() => setActiveTab("my_consultations")}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === "my_consultations"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {language === "en" ? "My Consultations" : "Mashauriano Yangu"}
                  {myConsultations.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                      {myConsultations.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* MATCHED TAB */}
            {activeTab === "matched" && (
              <div className="space-y-6">
                {/* Smart Matching Banner */}
                <div className="bg-[#2E7D32] text-white rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <Zap className="h-12 w-12 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        {language === "en" ? "🎯 Experts Matched to Your Farm" : "🎯 Wataalamu Wanaofanana na Shamba Lako"}
                      </h3>
                      <p className="text-white/90 text-sm">
                        {language === "en"
                          ? "Based on your crops (Maize, Tomatoes) and recent activity, we recommend:"
                          : "Kulingana na mazao yako (Mahindi, Nyanya) na shughuli za hivi karibuni, tunapendekeza:"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Matched Experts */}
                {matchedExperts.map((expert) => (
                  <ExpertCard 
                    key={expert.id} 
                    expert={expert} 
                    language={language}
                    onSelect={() => {
                      setSelectedExpert(expert);
                      setShowBookingModal(true);
                    }}
                  />
                ))}
              </div>
            )}

            {/* BROWSE ALL TAB */}
            {activeTab === "browse" && (
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder={language === "en" ? "Search by name or specialty..." : "Tafuta kwa jina au utaalamu..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterSpecialty}
                      onChange={(e) => setFilterSpecialty(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="all">{language === "en" ? "All Specialties" : "Utaalamu Wote"}</option>
                      <option value="Crop Diseases">{language === "en" ? "Crop Diseases" : "Magonjwa ya Mazao"}</option>
                      <option value="Soil Testing">{language === "en" ? "Soil Testing" : "Upimaji wa Udongo"}</option>
                      <option value="Irrigation Systems">{language === "en" ? "Irrigation" : "Umwagiliaji"}</option>
                      <option value="Animal Health">{language === "en" ? "Livestock" : "Mifugo"}</option>
                    </select>
                  </div>
                </div>

                {/* All Experts */}
                {filteredExperts.map((expert) => (
                  <ExpertCard 
                    key={expert.id} 
                    expert={expert} 
                    language={language}
                    onSelect={() => {
                      setSelectedExpert(expert);
                      setShowBookingModal(true);
                    }}
                  />
                ))}
              </div>
            )}

            {/* MY CONSULTATIONS TAB */}
            {activeTab === "my_consultations" && (
              <div className="space-y-4">
                {myConsultations.map((consultation) => (
                  <div key={consultation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
                          {consultation.expertAvatar}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{consultation.expertName}</h3>
                          <div className="text-sm text-gray-600">{consultation.specialty}</div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {consultation.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {consultation.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          consultation.status === "scheduled" 
                            ? "bg-gray-100 text-gray-700"
                            : consultation.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {consultation.status === "scheduled" && (language === "en" ? "Scheduled" : "Imepangwa")}
                          {consultation.status === "completed" && (language === "en" ? "Completed" : "Imekamilika")}
                          {consultation.status === "cancelled" && (language === "en" ? "Cancelled" : "Imefutwa")}
                        </span>
                      </div>
                    </div>

                    {consultation.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="text-xs text-gray-500 mb-1">
                          {language === "en" ? "Topic:" : "Mada:"}
                        </div>
                        <div className="text-sm text-gray-800">{consultation.notes}</div>
                      </div>
                    )}

                    {consultation.outcome && (
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="text-xs text-green-600 font-semibold mb-1">
                          {language === "en" ? "✓ Outcome:" : "✓ Matokeo:"}
                        </div>
                        <div className="text-sm text-green-800">{consultation.outcome}</div>
                      </div>
                    )}

                    {consultation.status === "scheduled" && (
                      <div className="flex gap-3 mt-4">
                        <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                          {consultation.type === "video" && <Video className="h-4 w-4" />}
                          {consultation.type === "phone" && <Phone className="h-4 w-4" />}
                          {consultation.type === "chat" && <MessageSquare className="h-4 w-4" />}
                          {language === "en" ? "Join Session" : "Jiunge na Kipindi"}
                        </button>
                        <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          {language === "en" ? "Reschedule" : "Panga Upya"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal (simplified - would be full modal in production) */}
      {showBookingModal && selectedExpert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {language === "en" ? "Book Consultation" : "Panga Ushauri"}
                </h2>
                <button onClick={() => setShowBookingModal(false)}>
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
                    {selectedExpert.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedExpert.name}</h3>
                    <div className="text-sm text-gray-600">{selectedExpert.title}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "en" ? "Select Consultation Type" : "Chagua Aina ya Ushauri"}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { type: "chat" as const, icon: <MessageSquare className="h-5 w-5" />, label: language === "en" ? "Chat" : "Maandishi", price: "10,000" },
                      { type: "voice_note" as const, icon: <Mic className="h-5 w-5" />, label: language === "en" ? "Voice" : "Sauti", price: "10,000" },
                      { type: "phone" as const, icon: <Phone className="h-5 w-5" />, label: language === "en" ? "Phone" : "Simu", price: "15,000" },
                      { type: "video" as const, icon: <Video className="h-5 w-5" />, label: language === "en" ? "Video" : "Video", price: "20,000" }
                    ].map((option) => (
                      <button
                        key={option.type}
                        onClick={() => setConsultationType(option.type)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          consultationType === option.type
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          {option.icon}
                          <span className="font-medium text-sm">{option.label}</span>
                          <span className="text-xs text-green-600 font-bold">{option.price} TZS</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    toast.success(language === "en" 
                      ? "Consultation request sent! Expert will respond within 2 hours."
                      : "Ombi la ushauri limetumwa! Mtaalamu atajibu ndani ya masaa 2.");
                    setShowBookingModal(false);
                  }}
                  className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                  {language === "en" ? "Send Request" : "Tuma Ombi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Expert Card Component
function ExpertCard({ expert, language, onSelect }: { expert: Expert; language: "en" | "sw"; onSelect: () => void }) {
  const [showOutcomes, setShowOutcomes] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl flex-shrink-0">
            {expert.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900">{expert.name}</h3>
              {expert.verified && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  <CheckCircle className="h-3 w-3" />
                  {language === "en" ? "Verified" : "Imethibitishwa"}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600 mb-2">{expert.title}</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {expert.specialty.map((spec, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {spec}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{expert.rating}</span>
              </span>
              <span>•</span>
              <span>{expert.totalConsultations} {language === "en" ? "consultations" : "mashauriano"}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                {expert.successStories} {language === "en" ? "solved" : "suluhisho"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">{language === "en" ? "Experience" : "Uzoefu"}</div>
            <div className="font-semibold text-gray-900">{expert.experience}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">{language === "en" ? "Languages" : "Lugha"}</div>
            <div className="font-semibold text-gray-900">{expert.languages.join(", ")}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">{language === "en" ? "Location" : "Mahali"}</div>
            <div className="font-semibold text-gray-900 text-sm">{expert.location}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">{language === "en" ? "From" : "Kuanzia"}</div>
            <div className="font-bold text-green-600">{expert.pricePerSession.toLocaleString()} TZS</div>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-green-800">{expert.availability}</span>
            <span className="text-green-600 text-xs">• {expert.responseTime}</span>
          </div>
        </div>

        {/* Recent Outcomes */}
        <div>
          <button
            onClick={() => setShowOutcomes(!showOutcomes)}
            className="w-full flex items-center justify-between text-left py-2 hover:bg-gray-50 rounded transition-colors"
          >
            <span className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Award className="h-4 w-4 text-orange-600" />
              {language === "en" ? "What This Expert Has Helped Farmers Solve" : "Nini Mtaalamu Huyu Amesaidia Wakulima Kutatua"}
            </span>
            <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${showOutcomes ? "rotate-180" : ""}`} />
          </button>

          {showOutcomes && (
            <div className="mt-3 space-y-3">
              {expert.recentOutcomes.map((outcome, idx) => (
                <div key={idx} className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <div className="text-xs text-orange-600 font-semibold mb-1">
                    {language === "en" ? "Problem:" : "Tatizo:"}
                  </div>
                  <div className="text-sm text-orange-900 mb-2">{outcome.problem}</div>
                  <div className="text-xs text-orange-600 font-semibold mb-1">
                    {language === "en" ? "Solution:" : "Suluhisho:"}
                  </div>
                  <div className="text-sm text-orange-900 mb-2">{outcome.solution}</div>
                  <div className="bg-green-100 rounded p-2 border border-green-300">
                    <div className="text-xs text-green-600 font-semibold mb-1">
                      ✓ {language === "en" ? "Impact:" : "Athari:"}
                    </div>
                    <div className="text-xs text-green-800 font-medium">{outcome.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Credentials */}
        <div>
          <div className="text-xs text-gray-500 mb-2">{language === "en" ? "Credentials" : "Vyeti"}</div>
          <div className="flex flex-wrap gap-2">
            {expert.credentials.map((cred, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded flex items-center gap-1">
                <BadgeCheck className="h-3 w-3 text-green-600" />
                {cred}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onSelect}
          className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          {language === "en" ? "Book Consultation" : "Panga Ushauri"}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}