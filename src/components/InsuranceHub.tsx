import { useState } from "react";
import {
  Shield, Cloud, Droplet, Bug, DollarSign, CheckCircle, Info,
  AlertCircle, Calendar, TrendingUp, Users, Sprout, X, ArrowRight,
  HelpCircle, Eye, Download, ChevronDown, Zap, Target, Clock,
  FileText, Award, ThumbsUp, Heart, Lightbulb, AlertTriangle,
  Umbrella, Sun, CloudRain, Wind, ChevronRight, Play, BookOpen,
  BadgeCheck, Link2, ShoppingCart, Phone, MessageCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface InsuranceHubProps {
  userId: string;
  language: "en" | "sw";
  onNavigate?: (tab: string) => void;
}

interface InsuranceProduct {
  id: string;
  name: string;
  type: "weather" | "crop" | "livestock" | "contract" | "input";
  provider: string;
  verified: boolean;
  coverage: string;
  premium: number;
  premiumPer: string;
  payout: {
    trigger: string;
    amount: string;
    speed: string;
  };
  icon: any;
  color: string;
  benefits: string[];
  howItWorks: string[];
  scenario: {
    situation: string;
    whatHappens: string;
    payout: string;
  };
}

interface InsurancePolicy {
  id: string;
  productName: string;
  productType: string;
  status: "active" | "claimed" | "expired" | "pending_claim";
  coverage: string;
  premium: string;
  startDate: string;
  endDate: string;
  claimStatus?: string;
  payoutReceived?: number;
}

export function InsuranceHub({ userId, language, onNavigate }: InsuranceHubProps) {
  const [viewMode, setViewMode] = useState<"learn" | "products">("learn");
  const [activeTab, setActiveTab] = useState<"available" | "my_policies">("available");
  const [expandedSection, setExpandedSection] = useState<string | null>("why-insurance");
  const [selectedProduct, setSelectedProduct] = useState<InsuranceProduct | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  const products: InsuranceProduct[] = [
    {
      id: "ins-001",
      name: language === "en" ? "Drought Protection" : "Ulinzi wa Ukame",
      type: "weather",
      provider: "ACRE Africa",
      verified: true,
      coverage: language === "en" ? "Up to 80% of input costs" : "Hadi 80% ya gharama za pembejeo",
      premium: 35000,
      premiumPer: language === "en" ? "per acre/season" : "kwa ekari/msimu",
      payout: {
        trigger: language === "en" ? "Rainfall < 300mm during season" : "Mvua < 300mm wakati wa msimu",
        amount: language === "en" ? "Up to 280,000 TZS/acre" : "Hadi TZS 280,000 kwa ekari",
        speed: language === "en" ? "Automatic payout within 2 weeks" : "Malipo ya moja kwa moja ndani ya wiki 2"
      },
      icon: Droplet,
      color: "blue",
      benefits: [
        language === "en" ? "No claim forms — automatic satellite monitoring" : "Hakuna fomu za madai — ufuatiliaji wa satellite moja kwa moja",
        language === "en" ? "Covers seed & fertilizer costs" : "Inagharamia mbegu na mbolea",
        language === "en" ? "SMS alerts when triggers activate" : "Arifa za SMS wakati vichocheo vinavyowashwa",
        language === "en" ? "Payment via mobile money (M-Pesa/Airtel)" : "Malipo kupitia pesa ya simu (M-Pesa/Airtel)"
      ],
      howItWorks: [
        language === "en" ? "Satellites track rainfall in your area every day" : "Satellites hufuatilia mvua katika eneo lako kila siku",
        language === "en" ? "If total rainfall drops below 300mm, payout triggers automatically" : "Ikiwa mvua jumla inashuka chini ya 300mm, malipo yanachochewa moja kwa moja",
        language === "en" ? "No need to file claim — money sent to your phone" : "Hakuna haja ya kufungua madai — pesa zinatumwa kwenye simu yako",
        language === "en" ? "You decide how to use the payout (replant, buy food, pay debts)" : "Unaamua jinsi ya kutumia malipo (panda tena, nunua chakula, lipa madeni)"
      ],
      scenario: {
        situation: language === "en"
          ? "You plant 2 acres of maize. Total input cost: 200,000 TZS. Drought hits — only 150mm of rain falls."
          : "Unapanda ekari 2 za mahindi. Gharama jumla ya pembejeo: TZS 200,000. Ukame unapiga — mvua ya mm 150 tu inaanguka.",
        whatHappens: language === "en"
          ? "Satellite detects low rainfall. Insurance triggers automatically. No assessor needed."
          : "Satellite inagundua mvua kidogo. Bima inachochewa moja kwa moja. Hakuna haja ya mkaguzi.",
        payout: language === "en"
          ? "You receive 280,000 TZS (80% of 350,000 typical input value) within 14 days via M-Pesa."
          : "Unapokea TZS 280,000 (80% ya TZS 350,000 thamani ya kawaida ya pembejeo) ndani ya siku 14 kupitia M-Pesa."
      }
    },
    {
      id: "ins-002",
      name: language === "en" ? "Excess Rainfall Cover" : "Ulinzi wa Mvua Nyingi",
      type: "weather",
      provider: "Pula Insurance",
      verified: true,
      coverage: language === "en" ? "Up to 1,000,000 TZS/acre" : "Hadi TZS 1,000,000 kwa ekari",
      premium: 45000,
      premiumPer: language === "en" ? "per acre/season" : "kwa ekari/msimu",
      payout: {
        trigger: language === "en" ? "Rainfall > 800mm in 30 days" : "Mvua > 800mm ndani ya siku 30",
        amount: language === "en" ? "Up to 1,000,000 TZS/acre" : "Hadi TZS 1,000,000 kwa ekari",
        speed: language === "en" ? "Automatic within 21 days" : "Moja kwa moja ndani ya siku 21"
      },
      icon: CloudRain,
      color: "gray",
      benefits: [
        language === "en" ? "Protects against flooding damage" : "Inalinda dhidi ya uharibifu wa mafuriko",
        language === "en" ? "Parametric — no field inspection needed" : "Parametric — hakuna haja ya ukaguzi wa shamba",
        language === "en" ? "Satellite weather data monitoring" : "Ufuatiliaji wa data ya hali ya hewa ya satellite",
        language === "en" ? "Covers replanting and recovery costs" : "Inagharamia gharama za kupanda tena na kurejeshwa"
      ],
      howItWorks: [
        language === "en" ? "Satellites measure daily rainfall in your exact location" : "Satellites hupima mvua ya kila siku katika eneo lako halisi",
        language === "en" ? "If 800mm+ falls in 30 days → flooding assumed" : "Ikiwa mm 800+ zinaanguka ndani ya siku 30 → mafuriko yanazingatiwa",
        language === "en" ? "Payout calculated based on rainfall excess" : "Malipo yanahesabiwa kulingana na ziada ya mvua",
        language === "en" ? "Money sent directly to your mobile wallet" : "Pesa zinatumwa moja kwa moja kwenye mkoba wako wa simu"
      ],
      scenario: {
        situation: language === "en"
          ? "You plant 1 acre of beans. Heavy rains hit — 850mm falls in 25 days. Field floods, crop destroyed."
          : "Unapanda ekari 1 ya maharage. Mvua kubwa inapiga — mm 850 zinaanguka ndani ya siku 25. Shamba linazama, zao limeharibika.",
        whatHappens: language === "en"
          ? "Satellite confirms excessive rainfall. Trigger met. Payout approved automatically."
          : "Satellite inathibitisha mvua nyingi sana. Kichocheo kimekidhi. Malipo yameidhinishwa moja kwa moja.",
        payout: language === "en"
          ? "You receive 800,000 TZS within 3 weeks. No photos, no assessor visit required."
          : "Unapokea TZS 800,000 ndani ya wiki 3. Hakuna picha, hakuna ziara ya mkaguzi inayohitajika."
      }
    },
    {
      id: "ins-003",
      name: language === "en" ? "Crop Disease Insurance" : "Bima ya Magonjwa ya Mazao",
      type: "crop",
      provider: "Jubilee Insurance",
      verified: true,
      coverage: language === "en" ? "Up to 70% of expected yield" : "Hadi 70% ya mavuno yanayotarajiwa",
      premium: 60000,
      premiumPer: language === "en" ? "per acre/season" : "kwa ekari/msimu",
      payout: {
        trigger: language === "en" ? "Disease confirmed by photo + expert" : "Ugonjwa umethibitishwa kwa picha + mtaalamu",
        amount: language === "en" ? "Up to 500,000 TZS/acre" : "Hadi TZS 500,000 kwa ekari",
        speed: language === "en" ? "Within 30 days of claim approval" : "Ndani ya siku 30 baada ya idhini ya madai"
      },
      icon: Bug,
      color: "orange",
      benefits: [
        language === "en" ? "Covers major pests and diseases (blight, armyworm, etc.)" : "Inashughulikia wadudu wakubwa na magonjwa (blight, jeshi la majangili, n.k.)",
        language === "en" ? "AI photo assessment for fast claims" : "Tathmini ya picha ya AI kwa madai ya haraka",
        language === "en" ? "Extension officer verification" : "Uthibitishaji wa afisa wa ugani",
        language === "en" ? "Replanting support included" : "Msaada wa kupanda tena unajumuishwa"
      ],
      howItWorks: [
        language === "en" ? "Submit photos of affected crops via app" : "Wasilisha picha za mazao yaliyoathirika kupitia programu",
        language === "en" ? "AI analyzes photos to identify disease" : "AI inachambuzi picha kutambua ugonjwa",
        language === "en" ? "Extension officer confirms damage level (optional)" : "Afisa wa ugani anathibitisha kiwango cha uharibifu (hiari)",
        language === "en" ? "Claim processed and payout approved" : "Madai yanachakatwa na malipo yanaidhinishwa"
      ],
      scenario: {
        situation: language === "en"
          ? "You plant 1.5 acres of tomatoes. Expected yield: 10 tons. Bacterial wilt strikes, destroying 60% of crop."
          : "Unapanda ekari 1.5 za nyanya. Mavuno yanayotarajiwa: tani 10. Ugonjwa wa ubatari unapiga, kuuharibu 60% ya zao.",
        whatHappens: language === "en"
          ? "You take photos, submit claim. AI confirms bacterial wilt. Extension officer visits to verify loss percentage."
          : "Unachukua picha, wasilisha madai. AI inathibitisha ugonjwa wa ubatari. Afisa wa ugani anatembelea kuthibitisha asilimia ya hasara.",
        payout: language === "en"
          ? "You receive 350,000 TZS (70% of lost yield value) plus 50,000 TZS replanting support."
          : "Unapokea TZS 350,000 (70% ya thamani ya mavuno yaliyopotea) pamoja na TZS 50,000 msaada wa kupanda tena."
      }
    },
    {
      id: "ins-004",
      name: language === "en" ? "Livestock Mortality Insurance" : "Bima ya Kifo cha Mifugo",
      type: "livestock",
      provider: "Madison Insurance",
      verified: true,
      coverage: language === "en" ? "Up to 80% of animal value" : "Hadi 80% ya thamani ya mnyama",
      premium: 120000,
      premiumPer: language === "en" ? "per cow/year" : "kwa ng'ombe/mwaka",
      payout: {
        trigger: language === "en" ? "Death from disease/accident" : "Kifo kutokana na ugonjwa/ajali",
        amount: language === "en" ? "Up to 2,400,000 TZS/animal" : "Hadi TZS 2,400,000 kwa mnyama",
        speed: language === "en" ? "Within 45 days of claim" : "Ndani ya siku 45 baada ya madai"
      },
      icon: Heart,
      color: "pink",
      benefits: [
        language === "en" ? "Covers death from disease, accident, theft" : "Inagharamia kifo kutokana na ugonjwa, ajali, wizi",
        language === "en" ? "Free vet consultation on health issues" : "Ushauri wa bure wa daktari wa wanyama juu ya matatizo ya afya",
        language === "en" ? "Vaccination support programs" : "Programu za msaada wa chanjo",
        language === "en" ? "Replacement animal assistance" : "Msaada wa mnyama wa kubadilisha"
      ],
      howItWorks: [
        language === "en" ? "Animal is tagged and photographed at enrollment" : "Mnyama anaekwa lebo na kupigwa picha wakati wa usajili",
        language === "en" ? "If animal dies, you report within 24 hours" : "Ikiwa mnyama anakufa, unaripoti ndani ya masaa 24",
        language === "en" ? "Vet or livestock officer confirms cause of death" : "Daktari wa wanyama au afisa wa mifugo anathibitisha sababu ya kifo",
        language === "en" ? "Payout based on animal's insured value" : "Malipo kulingana na thamani ya mnyama iliyofungiwa bima"
      ],
      scenario: {
        situation: language === "en"
          ? "You own a dairy cow valued at 3,000,000 TZS. She suddenly falls sick and dies from East Coast Fever."
          : "Una ng'ombe wa maziwa wenye thamani ya TZS 3,000,000. Ghafla anaumwa na kufa kutokana na Homa ya Pwani ya Mashariki.",
        whatHappens: language === "en"
          ? "You report death within 24 hours. Livestock officer visits, confirms ECF as cause. Photos of animal tag verified."
          : "Unaripoti kifo ndani ya masaa 24. Afisa wa mifugo anatembelea, anathibitisha ECF kama sababu. Picha za lebo ya mnyama zinathibitishwa.",
        payout: language === "en"
          ? "You receive 2,400,000 TZS (80% of cow's value). You can use this to buy a replacement heifer."
          : "Unapokea TZS 2,400,000 (80% ya thamani ya ng'ombe). Unaweza kutumia hii kununua mtamba wa kubadilisha."
      }
    },
    {
      id: "ins-005",
      name: language === "en" ? "Contract Insurance" : "Bima ya Mkataba",
      type: "contract",
      provider: "KILIMO Insurance Partners",
      verified: true,
      coverage: language === "en" ? "Contract value protection" : "Ulinzi wa thamani ya mkataba",
      premium: 25000,
      premiumPer: language === "en" ? "per contract" : "kwa mkataba",
      payout: {
        trigger: language === "en" ? "Contract breach or crop failure" : "Uvunjaji wa mkataba au kushindwa kwa zao",
        amount: language === "en" ? "Up to contract value" : "Hadi thamani ya mkataba",
        speed: language === "en" ? "Within 21 days of verification" : "Ndani ya siku 21 baada ya uthibitishaji"
      },
      icon: FileText,
      color: "purple",
      benefits: [
        language === "en" ? "Protects you if buyer defaults" : "Inakul linda ikiwa mnunuzi atakosea",
        language === "en" ? "Covers input advance if crop fails" : "Inagharamia mkopo wa pembejeo ikiwa zao litashindwa",
        language === "en" ? "Linked to Contract Farming module" : "Imeunganishwa na moduli ya Ukulima wa Mikataba",
        language === "en" ? "Arbitration support for disputes" : "Msaada wa uamuzi kwa migogoro"
      ],
      howItWorks: [
        language === "en" ? "Enroll when signing contract farming agreement" : "Jiandikishe unaposaini makubaliano ya ukulima wa mikataba",
        language === "en" ? "Premium deducted from first payment or advance" : "Kiasi cha bima kinatobolewa kutoka malipo ya kwanza au mkopo",
        language === "en" ? "If buyer breaches or crop fails, file claim" : "Ikiwa mnunuzi atakiuka au zao litashindwa, wasilisha madai",
        language === "en" ? "Insurance covers lost income or input debt" : "Bima inagharamia mapato yaliyopotea au deni la pembejeo"
      ],
      scenario: {
        situation: language === "en"
          ? "You sign a 4M TZS maize contract. Buyer provides 500K input advance. Drought destroys crop — you can't deliver."
          : "Unasaini mkataba wa mahindi wa TZS 4M. Mnunuzi anatoa mkopo wa pembejeo wa TZS 500K. Ukame unaharibu zao — huwezi kutoa.",
        whatHappens: language === "en"
          ? "You file claim showing drought evidence (satellite data). Insurance verifies you couldn't fulfill contract due to covered event."
          : "Unawasilisha madai ukionyesha ushahidi wa ukame (data ya satellite). Bima inathibitisha hukuweza kukidhi mkataba kutokana na tukio lililogharamiwa.",
        payout: language === "en"
          ? "You receive 500,000 TZS to cover input advance debt. You don't owe the buyer anything."
          : "Unapokea TZS 500,000 kugharamia deni la mkopo wa pembejeo. Haudaiwa na mnunuzi chochote."
      }
    }
  ];

  const myPolicies: InsurancePolicy[] = [
    {
      id: "pol-001",
      productName: language === "en" ? "Drought Protection" : "Ulinzi wa Ukame",
      productType: language === "en" ? "Weather Insurance" : "Bima ya Hali ya Hewa",
      status: "active",
      coverage: language === "en" ? "2 acres maize" : "Ekari 2 za mahindi",
      premium: "70,000 TZS",
      startDate: "2025-10-01",
      endDate: "2026-03-31"
    },
    {
      id: "pol-002",
      productName: language === "en" ? "Crop Disease Insurance" : "Bima ya Magonjwa ya Mazao",
      productType: language === "en" ? "Crop Insurance" : "Bima ya Mazao",
      status: "claimed",
      coverage: language === "en" ? "1.5 acres tomatoes" : "Ekari 1.5 za nyanya",
      premium: "90,000 TZS",
      startDate: "2025-11-01",
      endDate: "2026-02-28",
      claimStatus: language === "en" ? "Approved - Payout Processing" : "Imeidhinishwa - Malipo Yanachakatwa",
      payoutReceived: 350000
    }
  ];

  const filteredProducts = products.filter(p => 
    filterType === "all" || p.type === filterType
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/10 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white px-4 lg:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <Shield className="h-7 w-7" />
            {language === "en" ? "Agricultural Insurance" : "Bima ya Kilimo"}
          </h1>
          <p className="text-indigo-100 text-sm">
            {language === "en" 
              ? "Fair protection against risks you can't control"
              : "Ulinzi wa haki dhidi ya hatari huwezi kudhibiti"}
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
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <BookOpen className="h-5 w-5" />
            {language === "en" ? "How Insurance Works" : "Jinsi Bima Inavyofanya Kazi"}
          </button>
          <button
            onClick={() => setViewMode("products")}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              viewMode === "products"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Shield className="h-5 w-5" />
            {language === "en" ? "Browse Coverage" : "Tazama Ulinzi"}
            {myPolicies.length > 0 && (
              <span className="px-2 py-0.5 bg-white text-indigo-600 text-xs font-bold rounded-full">
                {myPolicies.length}
              </span>
            )}
          </button>
        </div>

        {/* ========== LEARNING MODE ========== */}
        {viewMode === "learn" && (
          <div className="space-y-6">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Umbrella className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">
                    {language === "en" 
                      ? "Insurance Without Fear — Transparent, Fair, Fast" 
                      : "Bima Bila Hofu — Wazi, Haki, Haraka"}
                  </h2>
                  <p className="text-white/90 mb-4">
                    {language === "en"
                      ? "Understand exactly what's covered, what's not, and when you get paid. No hidden terms, no endless paperwork."
                      : "Elewa hasa kinachogharamiwa, kile kisicho, na unapolipwa. Hakuna masharti ya siri, hakuna karatasi za mwisho usio na mwisho."}
                  </p>
                  <button 
                    onClick={() => setViewMode("products")}
                    className="px-6 py-2 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    {language === "en" ? "Explore Insurance Products" : "Chunguza Bidhaa za Bima"}
                  </button>
                </div>
              </div>
            </div>

            {/* Why Insurance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "why-insurance" ? null : "why-insurance")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <HelpCircle className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "Why Get Insurance?" : "Kwa Nini Kupata Bima?"}
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "why-insurance" ? "rotate-180" : ""}`} />
              </button>

              {expandedSection === "why-insurance" && (
                <div className="px-6 pb-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4">
                    <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      {language === "en" ? "The Reality of Farming" : "Ukweli wa Kilimo"}
                    </h4>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      {language === "en"
                        ? "You can do everything right — plant on time, use quality inputs, work hard — and still lose your harvest to drought, floods, or disease. These risks are unpredictable and beyond your control. Insurance is your safety net."
                        : "Unaweza kufanya kila kitu vizuri — panda kwa wakati, tumia pembejeo bora, fanya kazi kwa bidii — na bado upoteze mavuno yako kwa ukame, mafuriko, au magonjwa. Hatari hizi haziwezi kutabiriwa na haziko chini ya udhibiti wako. Bima ni wavu wako wa usalama."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: <Shield className="h-6 w-6 text-blue-600" />,
                        title: language === "en" ? "Protect Your Investment" : "Linda Uwekezaji Wako",
                        desc: language === "en"
                          ? "You invest 200K+ in seeds, fertilizer, labor. Insurance ensures you're not left with nothing if disaster strikes."
                          : "Unawekeza TZS 200K+ kwenye mbegu, mbolea, kazi. Bima inahakikisha hajaachwa na kitu ikiwa janga litatokea."
                      },
                      {
                        icon: <DollarSign className="h-6 w-6 text-green-600" />,
                        title: language === "en" ? "Maintain Cash Flow" : "Dhibiti Mtiririko wa Pesa",
                        desc: language === "en"
                          ? "Even if crop fails, insurance payout helps you replant, feed family, and stay financially stable."
                          : "Hata ikiwa zao litashindwa, malipo ya bima yanakusaidia kupanda tena, kulisha familia, na kudumisha utulivu wa kifedha."
                      },
                      {
                        icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
                        title: language === "en" ? "Access Credit" : "Pata Mkopo",
                        desc: language === "en"
                          ? "Banks and input suppliers are more willing to give loans/credit when you have insurance coverage."
                          : "Benki na watoaji wa pembejeo wako tayari zaidi kutoa mikopo/mkopo una ulinzi wa bima."
                      },
                      {
                        icon: <Heart className="h-6 w-6 text-pink-600" />,
                        title: language === "en" ? "Peace of Mind" : "Amani ya Akili",
                        desc: language === "en"
                          ? "Farm confidently knowing you won't be ruined by events beyond your control."
                          : "Lima kwa kujiamini ukijua hutaharibika na matukio yasiyo chini ya udhibiti wako."
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

            {/* How It Works - Simple Explanation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "how-it-works" ? null : "how-it-works")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "How Insurance Works (Simple Version)" : "Jinsi Bima Inavyofanya Kazi (Toleo Rahisi)"}
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "how-it-works" ? "rotate-180" : ""}`} />
              </button>

              {expandedSection === "how-it-works" && (
                <div className="px-6 pb-6 space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-3">
                      {language === "en" ? "Three Simple Steps" : "Hatua Tatu Rahisi"}
                    </h4>
                    
                    <div className="space-y-4">
                      {[
                        {
                          step: 1,
                          title: language === "en" ? "Pay Small Premium" : "Lipa Kiasi Kidogo cha Bima",
                          desc: language === "en"
                            ? "Like a protection fee. Example: Pay 35,000 TZS to protect 200,000 TZS of inputs."
                            : "Kama ada ya ulinzi. Mfano: Lipa TZS 35,000 kulinda TZS 200,000 za pembejeo."
                        },
                        {
                          step: 2,
                          title: language === "en" ? "Farm Normally" : "Lima Kawaida",
                          desc: language === "en"
                            ? "You plant, grow, and hope for good harvest. Insurance is just backup — you hope to never use it."
                            : "Unapanda, unakulima, na unatumaini mavuno mazuri. Bima ni msaada tu — unatumaini hutaitumia kamwe."
                        },
                        {
                          step: 3,
                          title: language === "en" ? "Get Paid if Disaster Hits" : "Lipwa Ikiwa Janga Litatokea",
                          desc: language === "en"
                            ? "If drought/flood/disease occurs (as defined in policy), you get money to cover losses."
                            : "Ikiwa ukame/mafuriko/ugonjwa utatokea (kama ilivyofafanuliwa kwenye sera), utapata pesa kugharamia hasara."
                        }
                      ].map((item) => (
                        <div key={item.step} className="flex items-start gap-4">
                          <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                            {item.step}
                          </div>
                          <div>
                            <h5 className="font-bold text-blue-900 mb-1">{item.title}</h5>
                            <p className="text-sm text-blue-800">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-green-900 text-sm mb-1">
                          {language === "en" ? "Think of It Like This" : "Fikiri Hivi"}
                        </h4>
                        <p className="text-xs text-green-800">
                          {language === "en"
                            ? "You pay 35,000 TZS to protect 200,000 TZS. If nothing bad happens, you lose the 35K (but you had a good harvest!). If disaster strikes, you get up to 280,000 TZS back — saving you from total loss."
                            : "Unalipa TZS 35,000 kulinda TZS 200,000. Ikiwa hakuna baya litakalotokea, unapoteza TZS 35K (lakini ulikuwa na mavuno mazuri!). Ikiwa janga litatokea, utapata hadi TZS 280,000 — kukuokoa kutoka hasara kamili."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* What's Covered vs Not Covered */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "coverage" ? null : "coverage")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "What's Covered (and What's Not)" : "Kinachogharamiwa (na Kile Kisicho)"}
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "coverage" ? "rotate-180" : ""}`} />
              </button>

              {expandedSection === "coverage" && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Covered */}
                    <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
                      <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        {language === "en" ? "✅ Covered (You Get Paid)" : "✅ Kinagharamiwa (Unalipwa)"}
                      </h4>
                      <ul className="space-y-2 text-sm text-green-800">
                        <li className="flex items-start gap-2">
                          <Droplet className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Drought (rainfall below threshold)" : "Ukame (mvua chini ya kiwango)"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CloudRain className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Excess rainfall / flooding" : "Mvua nyingi / mafuriko"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Bug className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Crop diseases (bacterial wilt, blight, etc.)" : "Magonjwa ya mazao (ugonjwa wa ubatari, blight, n.k.)"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Wind className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Windstorms, hailstorms" : "Dhoruba za upepo, mvua za mvua"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Heart className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Livestock death (disease, accident)" : "Kifo cha mifugo (ugonjwa, ajali)"}</span>
                        </li>
                      </ul>
                    </div>

                    {/* Not Covered */}
                    <div className="bg-red-50 rounded-xl p-5 border-2 border-red-200">
                      <h4 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                        <X className="h-5 w-5" />
                        {language === "en" ? "❌ NOT Covered (No Payout)" : "❌ HAKIGHARAMIWA (Hakuna Malipo)"}
                      </h4>
                      <ul className="space-y-2 text-sm text-red-800">
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Poor farming practices (not planting on time, wrong inputs)" : "Mazoea mabaya ya kilimo (kutopanda kwa wakati, pembejeo zisizo sahihi)"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Theft or vandalism" : "Wizi au uharibifu"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Low yields due to poor soil (not disease/weather)" : "Mavuno madogo kutokana na udongo mbaya (sio ugonjwa/hali ya hewa)"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Intentional damage or fraud" : "Uharibifu wa makusudi au ulaghai)"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Events that happen before you enrolled" : "Matukio yanayotokea kabla haujajisajili"}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-blue-900 text-sm mb-1">
                          {language === "en" ? "The Key Principle" : "Kanuni Muhimu"}
                        </h4>
                        <p className="text-xs text-blue-800">
                          {language === "en"
                            ? "Insurance covers risks beyond your control (weather, disease outbreaks). It does NOT cover poor decisions or lack of effort."
                            : "Bima inagharamia hatari zisizo chini ya udhibiti wako (hali ya hewa, milipuko ya magonjwa). HAIGHARAMII maamuzi mabaya au ukosefu wa juhudi."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* When & How You Get Paid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "payout" ? null : "payout")}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "When & How You Get Paid" : "Lini na Jinsi Unavyolipwa"}
                  </h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedSection === "payout" ? "rotate-180" : ""}`} />
              </button>

              {expandedSection === "payout" && (
                <div className="px-6 pb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Weather Insurance (Fast) */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Zap className="h-6 w-6 text-green-600" />
                        <h4 className="font-bold text-green-900">
                          {language === "en" ? "Weather Insurance (Fastest)" : "Bima ya Hali ya Hewa (Haraka Zaidi)"}
                        </h4>
                      </div>
                      <ul className="space-y-2 text-sm text-green-800">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Satellite monitors rainfall automatically" : "Satellite hufuatilia mvua moja kwa moja"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "If trigger met → payout automatic" : "Ikiwa kichocheo kimekidhi → malipo ya moja kwa moja"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="font-bold">{language === "en" ? "Timeline: 2-3 weeks" : "Ratiba: Wiki 2-3"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "No claim form needed" : "Hakuna fomu ya madai inayohitajika"}</span>
                        </li>
                      </ul>
                    </div>

                    {/* Crop/Livestock (Slower) */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Clock className="h-6 w-6 text-blue-600" />
                        <h4 className="font-bold text-blue-900">
                          {language === "en" ? "Crop/Livestock (Slower)" : "Mazao/Mifugo (Polepole)"}
                        </h4>
                      </div>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "You submit photos or call officer" : "Unawasilisha picha au kumwita afisa"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Expert/officer verifies damage" : "Mtaalamu/afisa anathibitisha uharibifu"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="font-bold">{language === "en" ? "Timeline: 30-45 days" : "Ratiba: Siku 30-45"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{language === "en" ? "Claim form + verification needed" : "Fomu ya madai + uthibitishaji unahitajika"}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-5 border-2 border-purple-200">
                    <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      {language === "en" ? "How You Receive Payment" : "Jinsi Unavyopokea Malipo"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-purple-800">
                      <div className="bg-white rounded p-3">
                        <div className="font-semibold mb-1">{language === "en" ? "Mobile Money" : "Pesa ya Simu"}</div>
                        <div className="text-xs">M-Pesa, Airtel Money, Tigo Pesa</div>
                      </div>
                      <div className="bg-white rounded p-3">
                        <div className="font-semibold mb-1">{language === "en" ? "Bank Transfer" : "Uhamisho wa Benki"}</div>
                        <div className="text-xs">{language === "en" ? "Direct to your account" : "Moja kwa moja kwenye akaunti yako"}</div>
                      </div>
                      <div className="bg-white rounded p-3">
                        <div className="font-semibold mb-1">{language === "en" ? "Digital Wallet" : "Mkoba wa Kidijitali"}</div>
                        <div className="text-xs">{language === "en" ? "KILIMO Wallet" : "Mkoba wa KILIMO"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Scenario Examples */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Play className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {language === "en" ? "Real Scenarios: What Would Happen?" : "Hali Halisi: Nini Kingetokeaingekuwa?"}
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {products.slice(0, 2).map((product) => (
                  <div key={product.id} className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 border-2 border-amber-200">
                    <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                      <product.icon className="h-5 w-5" />
                      {product.name}
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-xs text-gray-500 font-semibold mb-1">
                          {language === "en" ? "SITUATION" : "HALI"}
                        </div>
                        <p className="text-sm text-gray-800">{product.scenario.situation}</p>
                      </div>

                      <div className="bg-blue-100 rounded-lg p-4">
                        <div className="text-xs text-blue-600 font-semibold mb-1">
                          {language === "en" ? "WHAT HAPPENS" : "KINACHOTOKEA"}
                        </div>
                        <p className="text-sm text-blue-900">{product.scenario.whatHappens}</p>
                      </div>

                      <div className="bg-green-100 rounded-lg p-4 border-2 border-green-300">
                        <div className="text-xs text-green-600 font-semibold mb-1 flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {language === "en" ? "✓ YOUR PAYOUT" : "✓ MALIPO YAKO"}
                        </div>
                        <p className="text-sm text-green-900 font-bold">{product.scenario.payout}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold mb-2">
                {language === "en" ? "Ready to Protect Your Farm?" : "Tayari Kulinda Shamba Lako?"}
              </h3>
              <p className="text-white/90 mb-4">
                {language === "en"
                  ? "Browse insurance products and find the right protection for your crops and livestock."
                  : "Tazama bidhaa za bima na pata ulinzi unaofaa kwa mazao na mifugo yako."}
              </p>
              <button
                onClick={() => setViewMode("products")}
                className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors"
              >
                {language === "en" ? "Explore Insurance Products" : "Chunguza Bidhaa za Bima"}
              </button>
            </div>
          </div>
        )}

        {/* ========== PRODUCTS MODE ========== */}
        {viewMode === "products" && (
          <div className="space-y-6">
            {/* Quick Learning Access */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-indigo-800">
                    {language === "en"
                      ? "New to agricultural insurance? Learn what's covered, how payouts work, and see real scenarios."
                      : "Mpya kwenye bima ya kilimo? Jifunze kinachogharamiwa, jinsi malipo yanavyofanya kazi, na uone hali halisi."}
                  </p>
                  <button
                    onClick={() => setViewMode("learn")}
                    className="mt-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    {language === "en" ? "Learn How Insurance Works" : "Jifunze Jinsi Bima Inavyofanya Kazi"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("available")}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === "available"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {language === "en" ? "Available Products" : "Bidhaa Zinazopatikana"}
                </button>
                <button
                  onClick={() => setActiveTab("my_policies")}
                  className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === "my_policies"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {language === "en" ? "My Policies" : "Sera Zangu"}
                  {myPolicies.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full">
                      {myPolicies.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* AVAILABLE PRODUCTS TAB */}
            {activeTab === "available" && (
              <div className="space-y-6">
                {/* Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">{language === "en" ? "All Insurance Types" : "Aina Zote za Bima"}</option>
                    <option value="weather">{language === "en" ? "Weather Insurance" : "Bima ya Hali ya Hewa"}</option>
                    <option value="crop">{language === "en" ? "Crop Insurance" : "Bima ya Mazao"}</option>
                    <option value="livestock">{language === "en" ? "Livestock Insurance" : "Bima ya Mifugo"}</option>
                    <option value="contract">{language === "en" ? "Contract Insurance" : "Bima ya Mikataba"}</option>
                  </select>
                </div>

                {/* Products */}
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className={`bg-gradient-to-r from-${product.color}-50 to-${product.color}-100 p-6 border-b border-gray-200`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`h-16 w-16 bg-${product.color}-100 rounded-xl flex items-center justify-center`}>
                            <product.icon className={`h-8 w-8 text-${product.color}-600`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                              {product.verified && (
                                <BadgeCheck className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <div className="text-sm text-gray-600">{product.provider}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">
                            {product.premium.toLocaleString()} <span className="text-sm">TZS</span>
                          </div>
                          <div className="text-xs text-gray-600">{product.premiumPer}</div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">{language === "en" ? "Coverage" : "Ulinzi"}</div>
                        <div className="font-semibold text-gray-900">{product.coverage}</div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                      {/* Quick Payout Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <div className="text-xs text-blue-600 mb-1">{language === "en" ? "Trigger" : "Kichocheo"}</div>
                          <div className="text-sm text-blue-900 font-medium">{product.payout.trigger}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <div className="text-xs text-green-600 mb-1">{language === "en" ? "Max Payout" : "Malipo ya Juu"}</div>
                          <div className="text-sm text-green-900 font-medium">{product.payout.amount}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                          <div className="text-xs text-purple-600 mb-1">{language === "en" ? "Payment Speed" : "Kasi ya Malipo"}</div>
                          <div className="text-sm text-purple-900 font-medium">{product.payout.speed}</div>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                          {language === "en" ? "Key Benefits" : "Faida Muhimu"}
                        </h4>
                        <ul className="space-y-2">
                          {product.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowProductDetail(true);
                          }}
                          className="flex-1 px-6 py-3 border-2 border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 font-medium text-indigo-700"
                        >
                          <Eye className="h-5 w-5" />
                          {language === "en" ? "View Details" : "Ona Maelezo"}
                        </button>
                        <button
                          onClick={() => {
                            toast.success(language === "en" 
                              ? "Enrollment request sent! An agent will contact you within 24 hours."
                              : "Ombi la usajili limetumwa! Wakala atawasiliana nawe ndani ya masaa 24.");
                          }}
                          className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Shield className="h-5 w-5" />
                          {language === "en" ? "Enroll Now" : "Jisajili Sasa"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MY POLICIES TAB */}
            {activeTab === "my_policies" && (
              <div className="space-y-4">
                {myPolicies.map((policy) => (
                  <div key={policy.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{policy.productName}</h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            policy.status === "active"
                              ? "bg-green-100 text-green-700"
                              : policy.status === "claimed"
                              ? "bg-blue-100 text-blue-700"
                              : policy.status === "pending_claim"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {policy.status === "active" && (language === "en" ? "Active" : "Hai")}
                            {policy.status === "claimed" && (language === "en" ? "Claim Approved" : "Madai Yameidhinishwa")}
                            {policy.status === "pending_claim" && (language === "en" ? "Claim Pending" : "Madai Yanasubiri")}
                            {policy.status === "expired" && (language === "en" ? "Expired" : "Imeisha")}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">{policy.productType}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">{language === "en" ? "Coverage" : "Ulinzi"}</div>
                        <div className="font-semibold text-gray-900 text-sm">{policy.coverage}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">{language === "en" ? "Premium Paid" : "Kiasi cha Bima Kiliolipiwa"}</div>
                        <div className="font-semibold text-gray-900 text-sm">{policy.premium}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">{language === "en" ? "Start Date" : "Tarehe ya Kuanza"}</div>
                        <div className="font-semibold text-gray-900 text-sm">{policy.startDate}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">{language === "en" ? "End Date" : "Tarehe ya Kumalizika"}</div>
                        <div className="font-semibold text-gray-900 text-sm">{policy.endDate}</div>
                      </div>
                    </div>

                    {policy.claimStatus && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold text-blue-900 mb-1">
                              {language === "en" ? "Claim Status" : "Hali ya Madai"}
                            </div>
                            <div className="text-sm text-blue-800">{policy.claimStatus}</div>
                            {policy.payoutReceived && (
                              <div className="mt-2 font-bold text-green-600">
                                {language === "en" ? "Payout:" : "Malipo:"} {policy.payoutReceived.toLocaleString()} TZS
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        {language === "en" ? "Download Certificate" : "Pakua Cheti"}
                      </button>
                      {policy.status === "active" && (
                        <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                          <FileText className="h-4 w-4" />
                          {language === "en" ? "File Claim" : "Wasilisha Madai"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Detail Modal (simplified) */}
      {showProductDetail && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h2>
                <button onClick={() => setShowProductDetail(false)}>
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Scenario */}
              <div className="space-y-4 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">
                  {language === "en" ? "Example Scenario" : "Mfano wa Hali"}
                </h3>
                
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <div className="text-xs text-amber-600 font-semibold mb-2">
                    {language === "en" ? "SITUATION" : "HALI"}
                  </div>
                  <p className="text-sm text-amber-900">{selectedProduct.scenario.situation}</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-xs text-blue-600 font-semibold mb-2">
                    {language === "en" ? "WHAT HAPPENS" : "KINACHOTOKEA"}
                  </div>
                  <p className="text-sm text-blue-900">{selectedProduct.scenario.whatHappens}</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                  <div className="text-xs text-green-600 font-semibold mb-2 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {language === "en" ? "YOUR PAYOUT" : "MALIPO YAKO"}
                  </div>
                  <p className="text-sm text-green-900 font-bold">{selectedProduct.scenario.payout}</p>
                </div>
              </div>

              {/* How It Works */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">
                  {language === "en" ? "How It Works" : "Jinsi Inavyofanya Kazi"}
                </h3>
                <ol className="space-y-2">
                  {selectedProduct.howItWorks.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="h-6 w-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <button
                onClick={() => {
                  toast.success(language === "en" 
                    ? "Enrollment request sent!"
                    : "Ombi la usajili limetumwa!");
                  setShowProductDetail(false);
                }}
                className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {language === "en" ? "Enroll in This Product" : "Jisajili katika Bidhaa Hii"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
