import { useState } from "react";
import {
  FileText, CheckCircle2, Clock, AlertTriangle, Award, Users,
  Building2, Calendar, Package, DollarSign, TrendingUp, Shield,
  MapPin, Sprout, Scale, Target, BarChart3, MessageCircle,
  Phone, Video, ArrowRight, ChevronDown, ChevronRight, Info,
  AlertCircle, X, Check, Eye, Download, Upload, Send, Edit,
  Lock, Unlock, Plus, Search, Filter, List, Grid3x3, Star,
  ThumbsUp, ThumbsDown, Flag, HelpCircle, ExternalLink, Zap,
  Truck, Receipt, Fingerprint, FileCheck, ClipboardCheck, BookOpen,
  Lightbulb, GraduationCap, HandshakeIcon as Handshake, Layers
} from "lucide-react";

interface FairContractFarmingProps {
  userId: string;
  language: "en" | "sw";
}

interface Contract {
  id: string;
  buyer: {
    id: string;
    name: string;
    type: "cooperative" | "processor" | "exporter" | "trader";
    verified: boolean;
    rating: number;
    contractsCompleted: number;
  };
  crop: string;
  status: "draft" | "pending_farmer" | "active" | "completed" | "disputed";
  startDate: Date;
  endDate: Date;
  
  // What Farmer Provides
  farmerProvides: {
    quantity: number;
    unit: string;
    quality: string;
    deliveryLocation: string;
  };
  
  // What Buyer Provides
  buyerProvides: {
    pricePerUnit: number;
    totalValue: number;
    inputAdvance?: {
      amount: number;
      items: string[];
      dueDate: Date;
    };
    technicalSupport: boolean;
    insurance: boolean;
  };
  
  // Milestones
  milestones: {
    id: string;
    name: string;
    description: string;
    dueDate: Date;
    status: "pending" | "in_progress" | "completed" | "overdue";
    payment?: number;
  }[];
  
  // Terms & Conditions
  terms: {
    paymentSchedule: string;
    deliveryTerms: string;
    qualityStandards: string;
    penalties: string;
    disputeResolution: string;
  };
  
  // Risk Flags
  riskFlags: {
    type: "warning" | "info";
    message: string;
  }[];
}

export function FairContractFarming({ userId, language }: FairContractFarmingProps) {
  // Main view toggle: Learning vs Contract Management
  const [viewMode, setViewMode] = useState<"learn" | "contracts">("learn");
  
  // Contract management states
  const [activeTab, setActiveTab] = useState<"active" | "available" | "history">("active");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showContractDetail, setShowContractDetail] = useState(false);
  
  // Learning content states
  const [expandedSection, setExpandedSection] = useState<string | null>("how-it-works");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Check if user has active contracts (simulate with localStorage or prop)
  const hasActiveContracts = true; // Would come from backend
  const isFirstTimeUser = false; // Would come from user profile

  const contracts: Contract[] = [
    {
      id: "con-001",
      buyer: {
        id: "buy-1",
        name: "Kilimo Fresh Cooperative",
        type: "cooperative",
        verified: true,
        rating: 4.8,
        contractsCompleted: 234
      },
      crop: language === "en" ? "White Maize" : "Mahindi Meupe",
      status: "active",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-06-30"),
      farmerProvides: {
        quantity: 5000,
        unit: "kg",
        quality: language === "en" ? "Grade A (moisture <13%)" : "Daraja A (unyevu <13%)",
        deliveryLocation: "Arusha Collection Center"
      },
      buyerProvides: {
        pricePerUnit: 900,
        totalValue: 4500000,
        inputAdvance: {
          amount: 500000,
          items: ["Seeds (H614)", "NPK Fertilizer", "Pesticides"],
          dueDate: new Date("2026-01-15")
        },
        technicalSupport: true,
        insurance: true
      },
      milestones: [
        {
          id: "m1",
          name: language === "en" ? "Input Delivery" : "Utoaji wa Pembejeo",
          description: language === "en" ? "Receive seeds, fertilizer, and pesticides" : "Pokea mbegu, mbolea, na dawa za wadudu",
          dueDate: new Date("2026-01-15"),
          status: "completed",
          payment: 0
        },
        {
          id: "m2",
          name: language === "en" ? "Planting" : "Kupanda",
          description: language === "en" ? "Complete planting within 2 weeks" : "Maliza kupanda ndani ya wiki 2",
          dueDate: new Date("2026-02-01"),
          status: "completed"
        },
        {
          id: "m3",
          name: language === "en" ? "Mid-Season Inspection" : "Ukaguzi wa Katikati ya Msimu",
          description: language === "en" ? "Buyer inspection and technical advice" : "Ukaguzi wa mnunuzi na ushauri wa kiufundi",
          dueDate: new Date("2026-03-15"),
          status: "in_progress"
        },
        {
          id: "m4",
          name: language === "en" ? "Harvest & Delivery" : "Mavuno na Utoaji",
          description: language === "en" ? "Deliver 5,000 kg Grade A maize" : "Toa mahindi 5,000 kg Daraja A",
          dueDate: new Date("2026-06-15"),
          status: "pending",
          payment: 4500000
        }
      ],
      terms: {
        paymentSchedule: language === "en" 
          ? "Full payment within 7 days of delivery & quality verification"
          : "Malipo kamili ndani ya siku 7 baada ya utoaji na uthibitisho wa ubora",
        deliveryTerms: language === "en"
          ? "Deliver to Arusha Collection Center, transport cost covered by buyer"
          : "Toa katika Kituo cha Ukusanyaji cha Arusha, gharama za usafiri zinalipiwa na mnunuzi",
        qualityStandards: language === "en"
          ? "Moisture <13%, no aflatoxin, clean & sorted"
          : "Unyevu <13%, hakuna aflatoxin, safi na zimechaguliwa",
        penalties: language === "en"
          ? "Late delivery: 2% per week | Quality issues: Price adjustment based on grade"
          : "Kuchelewa utoaji: 2% kwa wiki | Matatizo ya ubora: Marekebisho ya bei kulingana na daraja",
        disputeResolution: language === "en"
          ? "3-step process: Direct negotiation → Cooperative mediation → Arbitration board"
          : "Hatua 3: Mazungumzo ya moja kwa moja → Upatanisho wa ushirika → Bodi ya uamuzi"
      },
      riskFlags: [
        {
          type: "info",
          message: language === "en"
            ? "This contract includes input advance - seeds and fertilizer will be deducted from final payment"
            : "Mkataba huu una mkopo wa pembejeo - mbegu na mbolea zitatobolewa kutoka malipo ya mwisho"
        }
      ]
    },
    {
      id: "con-002",
      buyer: {
        id: "buy-2",
        name: "Tanzania Coffee Exporters Ltd",
        type: "exporter",
        verified: true,
        rating: 4.9,
        contractsCompleted: 167
      },
      crop: language === "en" ? "Arabica Coffee" : "Kahawa ya Arabica",
      status: "active",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-07-31"),
      farmerProvides: {
        quantity: 2000,
        unit: "kg",
        quality: language === "en" ? "AA Grade (screen 18+)" : "Daraja AA (screen 18+)",
        deliveryLocation: "Moshi Processing Center"
      },
      buyerProvides: {
        pricePerUnit: 8500,
        totalValue: 17000000,
        technicalSupport: true,
        insurance: true
      },
      milestones: [
        {
          id: "c2m1",
          name: language === "en" ? "Pruning & Preparation" : "Kukata na Maandalizi",
          description: language === "en" ? "Complete tree pruning and field preparation" : "Maliza kukata miti na maandalizi ya shamba",
          dueDate: new Date("2025-10-15"),
          status: "completed"
        },
        {
          id: "c2m2",
          name: language === "en" ? "Flowering Inspection" : "Ukaguzi wa Maua",
          description: language === "en" ? "Buyer inspection during flowering season" : "Ukaguzi wa mnunuzi wakati wa msimu wa maua",
          dueDate: new Date("2026-01-30"),
          status: "completed"
        },
        {
          id: "c2m3",
          name: language === "en" ? "Cherry Harvest" : "Mavuno ya Cherry",
          description: language === "en" ? "Harvest ripe coffee cherries" : "Vuna kahawa iliyo iva",
          dueDate: new Date("2026-06-30"),
          status: "in_progress"
        },
        {
          id: "c2m4",
          name: language === "en" ? "Processing & Delivery" : "Usindikaji na Utoaji",
          description: language === "en" ? "Process and deliver AA grade beans" : "Sindika na utoe maharagwe ya daraja AA",
          dueDate: new Date("2026-07-31"),
          status: "pending",
          payment: 17000000
        }
      ],
      terms: {
        paymentSchedule: language === "en"
          ? "70% upon delivery, 30% after quality grading (within 14 days)"
          : "70% baada ya utoaji, 30% baada ya kupimia ubora (ndani ya siku 14)",
        deliveryTerms: language === "en"
          ? "Deliver to Moshi Processing Center, transport arranged by buyer"
          : "Toa katika Kituo cha Usindikaji cha Moshi, usafiri utapangwa na mnunuzi",
        qualityStandards: language === "en"
          ? "AA Grade: Screen size 18+, moisture 10-12%, zero defects"
          : "Daraja AA: Ukubwa wa screen 18+, unyevu 10-12%, hakuna kasoro",
        penalties: language === "en"
          ? "Quality downgrade: Price adjustment | Late delivery: 1% per week"
          : "Kushuka daraja: Marekebisho ya bei | Kuchelewa: 1% kwa wiki",
        disputeResolution: language === "en"
          ? "Coffee Association arbitration → Tanzania Coffee Board review"
          : "Uamuzi wa Chama cha Kahawa → Mapitio ya Bodi ya Kahawa Tanzania"
      },
      riskFlags: [
        {
          type: "info",
          message: language === "en"
            ? "Payment split: 70% immediate, 30% after grading. Funds will be in escrow during grading period."
            : "Mgawanyo wa malipo: 70% mara moja, 30% baada ya kupimia. Fedha zitakuwa kwenye escrow wakati wa kupimia."
        }
      ]
    }
  ];

  const availableContracts: Partial<Contract>[] = [
    {
      id: "avl-001",
      buyer: {
        id: "buy-2",
        name: "Tanzania Export Co.",
        type: "exporter",
        verified: true,
        rating: 4.9,
        contractsCompleted: 456
      },
      crop: language === "en" ? "Red Kidney Beans" : "Maharagwe Mekundu",
      farmerProvides: {
        quantity: 2000,
        unit: "kg",
        quality: language === "en" ? "Export Grade" : "Daraja la Kuuza Nje",
        deliveryLocation: "Mwanza Port"
      },
      buyerProvides: {
        pricePerUnit: 2500,
        totalValue: 5000000,
        technicalSupport: true,
        insurance: true
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-[#2E7D32] text-white px-4 lg:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <FileText className="h-7 w-7" />
            {language === "en" ? "Contract Farming" : "Ukulima wa Mikataba"}
          </h1>
          <p className="text-green-100 text-sm">
            {language === "en" ? "Fair agreements, guaranteed markets, your protections" : "Makubaliano ya haki, masoko yaliyothibitishwa, ulinzi wako"}
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
            <BookOpen className="h-5 w-5" />
            {language === "en" ? "How It Works" : "Jinsi Inavyofanya Kazi"}
          </button>
          <button
            onClick={() => setViewMode("contracts")}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              viewMode === "contracts"
                ? "bg-[#2E7D32] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FileText className="h-5 w-5" />
            {language === "en" ? "My Contracts" : "Mikataba Yangu"}
            {hasActiveContracts && (
              <span className="px-2 py-0.5 bg-white text-green-600 text-xs font-bold rounded-full">
                {contracts.length}
              </span>
            )}
          </button>
        </div>

        {/* ========== LEARNING MODE ========== */}
        {viewMode === "learn" && (
          <div className="space-y-6">
            {/* Quick CTA Banner */}
            <div className="bg-[#2E7D32] text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <Lightbulb className="h-12 w-12 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">
                    {language === "en" 
                      ? "New to Contract Farming?" 
                      : "Mpya kwenye Ukulima wa Mikataba?"}
                  </h2>
                  <p className="text-white/90 mb-4">
                    {language === "en"
                      ? "Learn how contract farming gives you guaranteed markets, fair prices, and financial support — while protecting your rights."
                      : "Jifunze jinsi ukulima wa mikataba unavyokupa masoko yaliyohakikishwa, bei za haki, na msaada wa kifedha — huku ukilinda haki zako."}
                  </p>
                  <button 
                    onClick={() => setExpandedSection("how-it-works")}
                    className="px-6 py-2 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition-colors"
                  >
                    {language === "en" ? "Start Learning" : "Anza Kujifunza"}
                  </button>
                </div>
              </div>
            </div>

            {/* ========== HOW CONTRACT FARMING WORKS ========== */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "how-it-works" ? null : "how-it-works")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "How Contract Farming Works" : "Jinsi Ukulima wa Mikataba Unavyofanya Kazi"}
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "how-it-works" ? "rotate-180" : ""}`} />
              </button>

              {expandedSection === "how-it-works" && (
                <div className="px-6 pb-6 space-y-6">
                  {/* Visual Step-by-Step Process */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      {
                        step: 1,
                        icon: <Search className="h-6 w-6" />,
                        title: language === "en" ? "Find Contract" : "Tafuta Mkataba",
                        desc: language === "en" ? "Browse verified buyers looking for your crops" : "Tafuta wanunuzi walioidhinishwa wanaotafuta mazao yako"
                      },
                      {
                        step: 2,
                        icon: <FileCheck className="h-6 w-6" />,
                        title: language === "en" ? "Review Terms" : "Angalia Masharti",
                        desc: language === "en" ? "Understand what you'll provide and receive" : "Elewa unachotoa na unachopokea"
                      },
                      {
                        step: 3,
                        icon: <Handshake className="h-6 w-6" />,
                        title: language === "en" ? "Sign Agreement" : "Saini Mkataba",
                        desc: language === "en" ? "Both parties agree to fair, clear terms" : "Pande zote zinakubaliana na masharti ya haki na wazi"
                      },
                      {
                        step: 4,
                        icon: <TrendingUp className="h-6 w-6" />,
                        title: language === "en" ? "Grow & Deliver" : "Lima na Toa",
                        desc: language === "en" ? "Farm with support, deliver, get paid" : "Lima kwa msaada, toa, lipe"
                      }
                    ].map((item) => (
                      <div key={item.step} className="relative">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                          <div className="h-12 w-12 bg-green-600 text-white rounded-full flex items-center justify-center mb-3 mx-auto">
                            {item.icon}
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-green-600 font-bold mb-1">
                              {language === "en" ? "STEP" : "HATUA"} {item.step}
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h4>
                            <p className="text-xs text-gray-600">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Plain Language Explanation */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      {language === "en" ? "What Does This Mean For You?" : "Hii Inamaanisha Nini Kwako?"}
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {language === "en"
                        ? "Contract farming is an agreement between you (the farmer) and a buyer (like a cooperative, processor, or exporter). Before you plant, you agree on: what crop to grow, how much to deliver, the quality standard, and the price you'll be paid. The buyer often provides seeds, fertilizer, training, and guaranteed purchase. You focus on growing quality crops — the buyer handles the market."
                        : "Ukulima wa mikataba ni makubaliano kati yako (mkulima) na mnunuzi (kama ushirika, msindikaji, au mhamisho). Kabla ya kupanda, mnakubaliana juu ya: zao gani la kulima, kiasi gani cha kutoa, kiwango cha ubora, na bei utakayolipwa. Mnunuzi mara nyingi hutoa mbegu, mbolea, mafunzo, na ununuzi uliohakikishwa. Wewe unazingatia kulima mazao ya ubora — mnunuzi anashughulikia soko."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ========== BENEFITS ========== */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "benefits" ? null : "benefits")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "Benefits & Advantages" : "Faida na Manufaa"}
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "benefits" ? "rotate-180" : ""}`} />
              </button>

              {expandedSection === "benefits" && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: <DollarSign className="h-6 w-6 text-green-600" />,
                        title: language === "en" ? "Guaranteed Market" : "Soko Lililohakikishwa",
                        desc: language === "en" ? "No more searching for buyers or price negotiation stress. You know who will buy and at what price before planting." : "Hakuna tena kutafuta wanunuzi au mfadhaiko wa kupata bei. Unajua nani atanunua na kwa bei gani kabla ya kupanda."
                      },
                      {
                        icon: <Package className="h-6 w-6 text-gray-700" />,
                        title: language === "en" ? "Input Support" : "Msaada wa Pembejeo",
                        desc: language === "en" ? "Many contracts include seeds, fertilizer, and pesticides provided upfront — paid from your harvest proceeds." : "Mikataba mingi inajumuisha mbegu, mbolea, na dawa za wadudu zinazotolewa mapema — zinalipiwa kutoka mapato ya mavuno yako."
                      },
                      {
                        icon: <GraduationCap className="h-6 w-6 text-orange-600" />,
                        title: language === "en" ? "Technical Training" : "Mafunzo ya Kiufundi",
                        desc: language === "en" ? "Buyers often provide agronomists and training to help you meet quality standards and maximize yields." : "Wanunuzi mara nyingi hutoa wataalamu wa kilimo na mafunzo kukusaidia kukidhi viwango vya ubora na kuongeza mavuno."
                      },
                      {
                        icon: <Shield className="h-6 w-6 text-gray-700" />,
                        title: language === "en" ? "Risk Protection" : "Ulinzi wa Hatari",
                        desc: language === "en" ? "Some contracts include crop insurance and protections against price drops or market changes." : "Mikataba mingine inajumuisha bima ya mazao na ulinzi dhidi ya kushuka kwa bei au mabadiliko ya soko."
                      },
                      {
                        icon: <Truck className="h-6 w-6 text-orange-600" />,
                        title: language === "en" ? "Transport Arranged" : "Usafiri Umepangwa",
                        desc: language === "en" ? "Many buyers handle logistics — you deliver to a nearby collection center, not a distant market." : "Wanunuzi wengi wanashughulikia vifaa — unatoa katika kituo cha ukusanyaji karibu, si soko la mbali."
                      },
                      {
                        icon: <Award className="h-6 w-6 text-yellow-600" />,
                        title: language === "en" ? "Quality Premium" : "Malimbuko ya Ubora",
                        desc: language === "en" ? "Meet quality standards and earn bonus payments on top of the agreed price." : "Kufuata viwango vya ubora na pata malipo ya ziada juu ya bei iliyokubaliana."
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

            {/* ========== YOUR PROTECTIONS ========== */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "protections" ? null : "protections")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "Your Protections & Rights" : "Ulinzi na Haki Zako"}
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "protections" ? "rotate-180" : ""}`} />
              </button>

              {expandedSection === "protections" && (
                <div className="px-6 pb-6 space-y-4">
                  {/* Escrow Protection */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border-2 border-green-200">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                        <Lock className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-green-900 mb-2">
                          {language === "en" ? "Escrow Payment Protection" : "Ulinzi wa Malipo ya Escrow"}
                        </h4>
                        <p className="text-sm text-green-800 mb-3">
                          {language === "en"
                            ? "Your payment is held in escrow (a secure account) until you deliver. This means the buyer's money is already set aside for you — they can't back out or claim they don't have funds."
                            : "Malipo yako yanashikiliwa kwenye escrow (akaunti salama) hadi utoe. Hii inamaanisha pesa za mnunuzi tayari zimewekwa kando kwa ajili yako — hawawezi kurudi nyuma au kudai hawana pesa."}
                        </p>
                        <div className="text-xs text-green-700 font-medium">
                          {language === "en" ? "💡 What this means: You're guaranteed to be paid once you meet the contract terms." : "💡 Hii inamaanisha: Unahakikishiwa kulipwa mara tu ukikidhi masharti ya mkataba."}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verified Buyers Only */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border-2 border-green-200">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">
                          {language === "en" ? "Verified Buyers Only" : "Wanunuzi Walioidhinishwa Tu"}
                        </h4>
                        <p className="text-sm text-gray-700 mb-3">
                          {language === "en"
                            ? "Every buyer on this platform is verified by KILIMO. We check their business registration, financial capacity, and track record. You can see their rating and how many contracts they've completed successfully."
                            : "Kila mnunuzi kwenye jukwaa hili amethimbithishwa na KILIMO. Tunakagua usajili wa biashara yao, uwezo wa kifedha, na kumbukumbu ya utendaji. Unaweza kuona ukadiriaji wao na ni mikataba mingapi wamekamilisha kwa mafanikio."}
                        </p>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span className="text-xs text-green-700 font-medium">
                            {language === "en" ? "All buyers are background-checked" : "Wanunuzi wote wamekaguliwa mandari"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dispute Resolution */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-5 border-2 border-amber-200">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-amber-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-900 mb-2">
                          {language === "en" ? "Fair Dispute Resolution" : "Utatuzi wa Haki wa Migogoro"}
                        </h4>
                        <p className="text-sm text-amber-800 mb-3">
                          {language === "en"
                            ? "If there's a disagreement (quality, quantity, timing), there's a 3-step process to resolve it fairly:"
                            : "Ikiwa kuna kutokuelewana (ubora, kiasi, muda), kuna mchakato wa hatua 3 wa kutatua kwa haki:"}
                        </p>
                        <div className="space-y-2 text-sm text-amber-900">
                          <div className="flex items-start gap-2">
                            <span className="font-bold">1.</span>
                            <span>{language === "en" ? "Direct negotiation between you and the buyer" : "Mazungumzo ya moja kwa moja kati yako na mnunuzi"}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-bold">2.</span>
                            <span>{language === "en" ? "Cooperative or KILIMO mediation" : "Upatanisho wa ushirika au KILIMO"}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-bold">3.</span>
                            <span>{language === "en" ? "Independent arbitration board (final decision)" : "Bodi huru ya uamuzi (uamuzi wa mwisho)"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contract Transparency */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-3">
                      <Eye className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">
                          {language === "en" ? "Plain Language Contracts" : "Mikataba ya Lugha Rahisi"}
                        </h4>
                        <p className="text-xs text-gray-700">
                          {language === "en"
                            ? "Every contract clause is explained in simple language. No legal jargon. You'll know exactly what each term means before you sign."
                            : "Kila kipengele cha mkataba kinaelezwa kwa lugha rahisi. Hakuna istilahi za kisheria ngumu. Utajua hasa kila neno linamaanisha nini kabla ya kusaini."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ========== ROLES & RESPONSIBILITIES ========== */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "roles" ? null : "roles")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "Who Does What? Roles & Responsibilities" : "Nani Anafanya Nini? Majukumu na Wajibu"}
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "roles" ? "rotate-180" : ""}`} />
              </button>

              {expandedSection === "roles" && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Farmer Responsibilities */}
                    <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
                      <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                        <Sprout className="h-5 w-5" />
                        {language === "en" ? "Your Responsibilities (Farmer)" : "Wajibu Wako (Mkulima)"}
                      </h4>
                      <ul className="space-y-2 text-sm text-green-800">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Plant and grow the agreed crop variety" : "Panda na lima aina ya zao iliyokubaliana"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Meet quality standards (moisture, cleanliness, sorting)" : "Kufuata viwango vya ubora (unyevu, usafi, uchaguzi)"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Deliver the agreed quantity on time" : "Toa kiasi kilichokubaliana kwa wakati"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Allow buyer inspections during the season (if agreed)" : "Ruhusu ukaguzi wa mnunuzi wakati wa msimu (ikiwa imekubaliana)"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Follow farming practices recommended by the buyer" : "Fuata mazoea ya kilimo yanayopendekezwa na mnunuzi"}</span>
                        </li>
                      </ul>
                    </div>

                    {/* Buyer Responsibilities */}
                    <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {language === "en" ? "Buyer Responsibilities" : "Wajibu wa Mnunuzi"}
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Provide inputs (seeds, fertilizer) if agreed in contract" : "Kutoa pembejeo (mbegu, mbolea) ikiwa imekubaliana kwenye mkataba"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Offer technical support and training" : "Kutoa msaada wa kiufundi na mafunzo"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Purchase all produce that meets quality standards" : "Kununua mazao yote yanayokidhi viwango vya ubora"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Pay on time according to payment schedule" : "Kulipa kwa wakati kulingana na ratiba ya malipo"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Arrange transport or provide collection center" : "Kupanga usafiri au kutoa kituo cha ukusanyaji"}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ========== RISKS & HOW WE MITIGATE THEM ========== */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "risks" ? null : "risks")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "Potential Risks & How We Protect You" : "Hatari Zinazowezekana na Jinsi Tunavyokulinda"}
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "risks" ? "rotate-180" : ""}`} />
              </button>

              {expandedSection === "risks" && (
                <div className="px-6 pb-6 space-y-3">
                  {[
                    {
                      risk: language === "en" ? "Buyer doesn't pay" : "Mnunuzi hamalipe",
                      protection: language === "en" 
                        ? "Payments are held in escrow — the money is secured before you plant. If buyer defaults, you're paid from escrow."
                        : "Malipo yanashikiliwa kwenye escrow — pesa zinawekwa salama kabla ya kupanda. Ikiwa mnunuzi atakosea, utalipwa kutoka escrow."
                    },
                    {
                      risk: language === "en" ? "Quality disputes" : "Migogoro ya ubora",
                      protection: language === "en"
                        ? "Quality standards are defined clearly upfront. Independent testing determines grade. Mediation process ensures fairness."
                        : "Viwango vya ubora vimefafanuliwa wazi mapema. Upimaji huru unaamua daraja. Mchakato wa upatanisho unahakikisha haki."
                    },
                    {
                      risk: language === "en" ? "Crop failure" : "Kushindwa kwa zao",
                      protection: language === "en"
                        ? "Many contracts include crop insurance. If there's total crop failure due to weather, insurance covers input costs."
                        : "Mikataba mingi inajumuisha bima ya mazao. Ikiwa kuna kushindwa kabisa kwa zao kutokana na hali ya hewa, bima inagharamia gharama za pembejeo."
                    },
                    {
                      risk: language === "en" ? "Price changes during season" : "Mabadiliko ya bei wakati wa msimu",
                      protection: language === "en"
                        ? "Contract price is locked in before planting. Even if market prices drop, you get the agreed price. (Note: this also means you don't benefit if prices rise significantly.)"
                        : "Bei ya mkataba inafungwa kabla ya kupanda. Hata ikiwa bei za soko zinashuka, utapata bei iliyokubaliana. (Kumbuka: hii pia inamaanisha hutanufaika ikiwa bei zinapanda sana.)"
                    },
                    {
                      risk: language === "en" ? "Input debt burden" : "Mzigo wa deni la pembejeo",
                      protection: language === "en"
                        ? "Input advance costs are clearly stated and deducted transparently from final payment. You always know what you owe and what you'll receive net."
                        : "Gharama za mkopo wa pembejeo zinaelezwa wazi na zinatobolewa kwa uwazi kutoka malipo ya mwisho. Daima unajua unachodaiwa na utakachopokea jumla."
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-amber-900 text-sm mb-1">
                            {language === "en" ? "Risk:" : "Hatari:"} {item.risk}
                          </h4>
                          <p className="text-xs text-amber-800">
                            <span className="font-semibold">{language === "en" ? "Protection:" : "Ulinzi:"}</span> {item.protection}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ========== FAQ ========== */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <HelpCircle className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "Frequently Asked Questions" : "Maswali Yanayoulizwa Mara kwa Mara"}
                  </h3>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {[
                  {
                    id: "faq1",
                    q: language === "en" ? "Can I cancel a contract after signing?" : "Naweza kufuta mkataba baada ya kusaini?",
                    a: language === "en"
                      ? "Contracts are legally binding once both parties sign. However, if there's a valid reason (e.g., natural disaster, buyer breach), the dispute resolution process can help. Always read terms carefully before signing."
                      : "Mikataba ni lazima kisheria mara pande zote mbili zikisaini. Hata hivyo, ikiwa kuna sababu halali (kwa mfano, janga la asili, uvunjaji wa mnunuzi), mchakato wa utatuzi wa migogoro unaweza kusaidia. Daima soma masharti kwa makini kabla ya kusaini."
                  },
                  {
                    id: "faq2",
                    q: language === "en" ? "What if I can't deliver the full quantity?" : "Je, ikiwa siwezi kutoa kiasi kamili?",
                    a: language === "en"
                      ? "It depends on the reason. If it's due to documented weather/disaster and you have insurance, you're covered. If it's due to poor farming practices, there may be penalties. Communicate early with the buyer if you foresee issues."
                      : "Inategemea sababu. Ikiwa ni kutokana na hali ya hewa/janga lililowekwa kumbukumbu na una bima, utalindwa. Ikiwa ni kutokana na mazoea mabaya ya kilimo, kunaweza kuwa na adhabu. Wasiliana mapema na mnunuzi ikiwa unaona matatizo."
                  },
                  {
                    id: "faq3",
                    q: language === "en" ? "How do I know the buyer is trustworthy?" : "Ninajuaje mnunuzi ni wa kuaminika?",
                    a: language === "en"
                      ? "All buyers are verified by KILIMO — we check registration, financial capacity, and past performance. You can see their rating, completed contracts, and reviews from other farmers."
                      : "Wanunuzi wote wamethimbithishwa na KILIMO — tunakagua usajili, uwezo wa kifedha, na utendaji wa nyuma. Unaweza kuona ukadiriaji wao, mikataba iliyokamilika, na mapitio kutoka kwa wakulima wengine."
                  },
                  {
                    id: "faq4",
                    q: language === "en" ? "Can I negotiate contract terms?" : "Naweza kushawishi masharti ya mkataba?",
                    a: language === "en"
                      ? "Some terms are flexible (e.g., delivery dates, quantity), while others are fixed (e.g., quality standards). Use the messaging feature to discuss with the buyer before signing."
                      : "Masharti mengine yanaweza kubadilishwa (kwa mfano, tarehe za utoaji, kiasi), wakati mengine yanakomaa (kwa mfano, viwango vya ubora). Tumia kipengele cha ujumbe kujadili na mnunuzi kabla ya kusaini."
                  },
                  {
                    id: "faq5",
                    q: language === "en" ? "When do I get paid?" : "Ninalipwa lini?",
                    a: language === "en"
                      ? "Payment schedule is clearly stated in the contract. Common models: (1) Full payment within 7-14 days of delivery, or (2) Partial payment on delivery, remainder after quality grading. All payments go through escrow for security."
                      : "Ratiba ya malipo inaelezwa wazi kwenye mkataba. Mifano ya kawaida: (1) Malipo kamili ndani ya siku 7-14 baada ya utoaji, au (2) Malipo ya sehemu wakati wa utoaji, iliyobaki baada ya kupimia ubora. Malipo yote yanapita escrow kwa usalama."
                  }
                ].map((faq) => (
                  <div key={faq.id}>
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
                      <ChevronDown className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform ${expandedFAQ === faq.id ? "rotate-180" : ""}`} />
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA to View Contracts */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold mb-2">
                {language === "en" ? "Ready to Start?" : "Tayari Kuanza?"}
              </h3>
              <p className="text-white/90 mb-4">
                {language === "en"
                  ? "Browse available contracts from verified buyers and find the right opportunity for your farm."
                  : "Tafuta mikataba inayopatikana kutoka kwa wanunuzi walioidhinishwa na upate fursa sahihi kwa shamba lako."}
              </p>
              <button
                onClick={() => setViewMode("contracts")}
                className="px-8 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                {language === "en" ? "View Available Contracts" : "Ona Mikataba Inayopatikana"}
              </button>
            </div>
          </div>
        )}

        {/* ========== CONTRACT MANAGEMENT MODE ========== */}
        {viewMode === "contracts" && (
          <div className="space-y-6">
            {/* Quick access to learning */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    {language === "en"
                      ? "New to contract farming? Learn how it works, your rights, and protections before signing."
                      : "Mpya kwenye ukulima wa mikataba? Jifunze jinsi inavyofanya kazi, haki zako, na ulinzi kabla ya kusaini."}
                  </p>
                  <button
                    onClick={() => setViewMode("learn")}
                    className="mt-2 text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    {language === "en" ? "Learn How It Works" : "Jifunze Jinsi Inavyofanya Kazi"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{contracts.length}</div>
                    <div className="text-sm text-gray-600">
                      {language === "en" ? "Active Contracts" : "Mikataba Hai"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-gray-700" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">TZS 21.5M</div>
                    <div className="text-sm text-gray-600">
                      {language === "en" ? "Total Contract Value" : "Thamani ya Jumla ya Mkataba"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">98%</div>
                    <div className="text-sm text-gray-600">
                      {language === "en" ? "Success Rate" : "Kiwango cha Mafanikio"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("active")}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === "active"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {language === "en" ? "Active Contracts" : "Mikataba Hai"}
                </button>
                <button
                  onClick={() => setActiveTab("available")}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors relative ${
                    activeTab === "available"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {language === "en" ? "Available Contracts" : "Mikataba Inayopatikana"}
                  <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {availableContracts.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === "history"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {language === "en" ? "History" : "Historia"}
                </button>
              </div>
            </div>

            {/* ACTIVE CONTRACTS TAB */}
            {activeTab === "active" && (
              <div className="space-y-6">
                {contracts.map((contract) => (
                  <div key={contract.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Contract Header */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                            {contract.buyer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-gray-900">{contract.buyer.name}</h3>
                              {contract.buyer.verified && (
                                <Shield className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                {contract.buyer.rating}
                              </span>
                              <span>•</span>
                              <span>{contract.buyer.contractsCompleted} {language === "en" ? "contracts completed" : "mikataba iliyokamilika"}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedContract(contract);
                            setShowContractDetail(true);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          {language === "en" ? "View Details" : "Ona Maelezo"}
                        </button>
                      </div>

                      {/* Visual Contract Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* What You Provide */}
                        <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-green-600" />
                            </div>
                            <h4 className="font-bold text-gray-900">
                              {language === "en" ? "What You Provide" : "Unachotoa"}
                            </h4>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">{language === "en" ? "Crop" : "Zao"}:</span>
                              <span className="font-semibold text-gray-900">{contract.crop}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">{language === "en" ? "Quantity" : "Kiasi"}:</span>
                              <span className="font-semibold text-gray-900">
                                {contract.farmerProvides.quantity.toLocaleString()} {contract.farmerProvides.unit}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">{language === "en" ? "Quality" : "Ubora"}:</span>
                              <span className="font-semibold text-gray-900">{contract.farmerProvides.quality}</span>
                            </div>
                            <div className="flex items-start justify-between">
                              <span className="text-gray-600">{language === "en" ? "Deliver to" : "Toa kwa"}:</span>
                              <span className="font-semibold text-gray-900 text-right">{contract.farmerProvides.deliveryLocation}</span>
                            </div>
                          </div>
                        </div>

                        {/* What Buyer Provides */}
                        <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-gray-700" />
                            </div>
                            <h4 className="font-bold text-gray-900">
                              {language === "en" ? "What Buyer Provides" : "Mnunuzi Anatoa"}
                            </h4>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">{language === "en" ? "Price/unit" : "Bei/kipimo"}:</span>
                              <span className="font-semibold text-gray-900">
                                TZS {contract.buyerProvides.pricePerUnit.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">{language === "en" ? "Total Value" : "Jumla"}:</span>
                              <span className="font-bold text-gray-900 text-lg">
                                TZS {contract.buyerProvides.totalValue.toLocaleString()}
                              </span>
                            </div>
                            {contract.buyerProvides.inputAdvance && (
                              <div className="pt-2 border-t border-gray-200">
                                <div className="font-semibold text-gray-900 mb-1">
                                  {language === "en" ? "Input Advance" : "Mkopo wa Pembejeo"}
                                </div>
                                <div className="text-xs text-gray-600">
                                  TZS {contract.buyerProvides.inputAdvance.amount.toLocaleString()}
                                </div>
                              </div>
                            )}
                            <div className="flex flex-wrap gap-2 pt-2">
                              {contract.buyerProvides.technicalSupport && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                  ✓ {language === "en" ? "Tech Support" : "Msaada wa Kiufundi"}
                                </span>
                              )}
                              {contract.buyerProvides.insurance && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                                  ✓ {language === "en" ? "Insurance" : "Bima"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Milestones Progress */}
                    <div className="p-6">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-600" />
                        {language === "en" ? "Progress Milestones" : "Malengo ya Maendeleo"}
                      </h4>
                      <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        
                        <div className="space-y-6">
                          {contract.milestones.map((milestone, idx) => (
                            <div key={milestone.id} className="relative pl-12">
                              <div className={`absolute left-0 h-8 w-8 rounded-full flex items-center justify-center ${
                                milestone.status === "completed" 
                                  ? "bg-green-500 text-white" 
                                  : milestone.status === "in_progress"
                                  ? "bg-gray-500 text-white animate-pulse"
                                  : milestone.status === "overdue"
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-200 text-gray-600"
                              }`}>
                                {milestone.status === "completed" ? (
                                  <Check className="h-5 w-5" />
                                ) : milestone.status === "in_progress" ? (
                                  <Clock className="h-5 w-5" />
                                ) : (
                                  <span className="text-sm font-bold">{idx + 1}</span>
                                )}
                              </div>
                              
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h5 className="font-semibold text-gray-900">{milestone.name}</h5>
                                    <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                                  </div>
                                  {milestone.payment && (
                                    <div className="text-right">
                                      <div className="text-xs text-gray-600">{language === "en" ? "Payment" : "Malipo"}</div>
                                      <div className="font-bold text-green-600">
                                        TZS {milestone.payment.toLocaleString()}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {milestone.dueDate.toLocaleDateString()}
                                  </span>
                                  <span className={`px-2 py-1 rounded font-medium ${
                                    milestone.status === "completed"
                                      ? "bg-green-100 text-green-700"
                                      : milestone.status === "in_progress"
                                      ? "bg-gray-100 text-gray-700"
                                      : milestone.status === "overdue"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}>
                                    {milestone.status === "completed" && (language === "en" ? "Completed" : "Imekamilika")}
                                    {milestone.status === "in_progress" && (language === "en" ? "In Progress" : "Inaendelea")}
                                    {milestone.status === "overdue" && (language === "en" ? "Overdue" : "Imechelewa")}
                                    {milestone.status === "pending" && (language === "en" ? "Pending" : "Inasubiri")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Risk Flags */}
                    {contract.riskFlags.length > 0 && (
                      <div className="px-6 pb-6">
                        {contract.riskFlags.map((flag, idx) => (
                          <div key={idx} className={`p-4 rounded-lg border ${
                            flag.type === "warning" 
                              ? "bg-amber-50 border-amber-200"
                              : "bg-green-50 border-green-200"
                          }`}>
                            <div className="flex items-start gap-3">
                              {flag.type === "warning" ? (
                                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                              ) : (
                                <Info className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                              )}
                              <p className={`text-sm ${
                                flag.type === "warning" ? "text-amber-800" : "text-gray-700"
                              }`}>
                                {flag.message}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="px-6 pb-6 flex gap-3">
                      <button className="flex-1 px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        {language === "en" ? "Contact Buyer" : "Wasiliana na Mnunuzi"}
                      </button>
                      <button className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        {language === "en" ? "Download" : "Pakua"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AVAILABLE CONTRACTS TAB */}
            {activeTab === "available" && (
              <div className="space-y-6">
                {availableContracts.map((contract) => (
                  <div key={contract.id} className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                          {contract.buyer!.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{contract.buyer!.name}</h3>
                          <div className="text-sm text-gray-600 mt-1">
                            {language === "en" ? "Looking for" : "Anatafuta"}: {contract.crop}
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        {language === "en" ? "NEW" : "MPYA"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">{language === "en" ? "Quantity Needed" : "Kiasi Kinacohitajika"}</div>
                        <div className="font-bold text-gray-900">
                          {contract.farmerProvides!.quantity.toLocaleString()} {contract.farmerProvides!.unit}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">{language === "en" ? "Offered Price" : "Bei Inayotolewa"}</div>
                        <div className="font-bold text-green-600 text-lg">
                          TZS {contract.buyerProvides!.pricePerUnit.toLocaleString()}/{contract.farmerProvides!.unit}
                        </div>
                      </div>
                    </div>

                    <button className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      {language === "en" ? "View Contract & Apply" : "Ona Mkataba na Omba"}
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === "history" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === "en" ? "No Contract History" : "Hakuna Historia ya Mikataba"}
                </h3>
                <p className="text-gray-600">
                  {language === "en" 
                    ? "Your completed contracts will appear here"
                    : "Mikataba yako iliyokamilika itaonekana hapa"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
