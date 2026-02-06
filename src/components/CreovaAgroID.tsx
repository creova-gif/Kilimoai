import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  CreditCard,
  Shield,
  TrendingUp,
  Award,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Calendar,
  MapPin,
  QrCode,
  Fingerprint,
  Lock,
  UserCheck,
  IdCard,
  TreePine,
  Home,
  Activity,
  BarChart3,
  Wallet,
  Phone,
  Zap,
  Target,
  CircleDollarSign
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface CreovaAgroIDProps {
  userId: string;
  userName: string;
  userPhone: string;
  region: string;
  farmSize: string;
  crops: string[];
  registrationDate: string;
}

// NIDA-based AGRO-ID Generator
function generateAgroID(nidaNumber: string, region: string, registrationDate: string): string {
  // Format: AGRO-[REGION_CODE]-[NIDA_HASH]-[YEAR]-[CHECK_DIGIT]
  
  // Region codes (2-letter)
  const regionCodes: Record<string, string> = {
    "Arusha": "AR", "Dar es Salaam": "DS", "Dodoma": "DO", "Geita": "GE",
    "Iringa": "IR", "Kagera": "KG", "Katavi": "KT", "Kigoma": "KI",
    "Kilimanjaro": "KL", "Lindi": "LI", "Manyara": "MN", "Mara": "MR",
    "Mbeya": "MB", "Morogoro": "MO", "Mtwara": "MT", "Mwanza": "MW",
    "Njombe": "NJ", "Pemba North": "PN", "Pemba South": "PS", "Pwani": "PW",
    "Rukwa": "RU", "Ruvuma": "RV", "Shinyanga": "SH", "Simiyu": "SI",
    "Singida": "SG", "Tabora": "TB", "Tanga": "TG", "Zanzibar": "ZN"
  };

  const regionCode = regionCodes[region] || "XX";
  
  // Hash NIDA (use middle 6 digits for privacy)
  const nidaClean = nidaNumber.replace(/[^0-9]/g, "");
  const nidaMiddle = nidaClean.length >= 10 
    ? nidaClean.substring(4, 10) 
    : nidaClean.padEnd(6, "0");
  
  // Extract year from registration
  const year = new Date(registrationDate).getFullYear().toString().substring(2);
  
  // Generate check digit using Luhn algorithm
  const baseId = `${regionCode}${nidaMiddle}${year}`;
  const checkDigit = calculateLuhnCheckDigit(baseId);
  
  return `AGRO-${regionCode}-${nidaMiddle}-${year}${checkDigit}`;
}

function calculateLuhnCheckDigit(str: string): number {
  // Convert to array of digits
  const digits = str.split('').map(char => {
    if (char >= '0' && char <= '9') return parseInt(char);
    // For letters, use ASCII position mod 10
    return char.charCodeAt(0) % 10;
  });
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return (10 - (sum % 10)) % 10;
}

// Credit Scoring Algorithm
function calculateCreditScore(data: {
  farmSize: number;
  yearsActive: number;
  loanHistory: number;
  yieldPerformance: number;
  mobileMoneyUsage: number;
  marketActivity: number;
}): { score: number; rating: string; tier: string } {
  const weights = {
    farmSize: 0.15,
    yearsActive: 0.20,
    loanHistory: 0.25,
    yieldPerformance: 0.20,
    mobileMoneyUsage: 0.10,
    marketActivity: 0.10
  };
  
  const score = Math.round(
    (data.farmSize * weights.farmSize) +
    (data.yearsActive * weights.yearsActive) +
    (data.loanHistory * weights.loanHistory) +
    (data.yieldPerformance * weights.yieldPerformance) +
    (data.mobileMoneyUsage * weights.mobileMoneyUsage) +
    (data.marketActivity * weights.marketActivity)
  );
  
  let rating = "Poor";
  let tier = "Bronze";
  
  if (score >= 750) { rating = "Excellent"; tier = "Platinum"; }
  else if (score >= 650) { rating = "Very Good"; tier = "Gold"; }
  else if (score >= 550) { rating = "Good"; tier = "Silver"; }
  else if (score >= 450) { rating = "Fair"; tier = "Bronze"; }
  
  return { score, rating, tier };
}

export function CreovaAgroID({ 
  userId,
  userName,
  userPhone,
  region,
  farmSize,
  crops,
  registrationDate
}: CreovaAgroIDProps) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [nidaNumber, setNidaNumber] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [agroID, setAgroID] = useState("");
  
  // Mock credit data - in production, this would come from backend
  const creditData = {
    farmSize: parseFloat(farmSize) || 5,
    yearsActive: Math.floor((Date.now() - new Date(registrationDate).getTime()) / (365 * 24 * 60 * 60 * 1000)),
    loanHistory: 75, // 0-100 score based on repayment history
    yieldPerformance: 82, // 0-100 score based on actual vs expected yields
    mobileMoneyUsage: 88, // 0-100 score based on transaction frequency
    marketActivity: 70 // 0-100 score based on marketplace engagement
  };
  
  const creditScore = calculateCreditScore(creditData);
  
  const handleVerifyNIDA = () => {
    if (!nidaNumber || nidaNumber.length < 10) {
      toast.error("Please enter a valid NIDA number");
      return;
    }
    
    // Generate AGRO-ID
    const generatedID = generateAgroID(nidaNumber, region, registrationDate);
    setAgroID(generatedID);
    setIsVerified(true);
    
    toast.success("NIDA verified successfully!", {
      description: `Your CREOVA AGRO-ID: ${generatedID}`
    });
  };

  const verificationStatus = {
    kyc: isVerified,
    farmData: true,
    mobile: true,
    credit: creditScore.score >= 450
  };

  const downloadID = () => {
    toast.success("Digital ID downloaded!", {
      description: "CREOVA AGRO-ID saved to your device"
    });
  };

  const shareID = () => {
    setShowShareOptions(!showShareOptions);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl mb-2">CREOVA AGRO-ID</h1>
          <p className="text-gray-600">Your digital farmer identity & credit profile</p>
        </div>
        {isVerified && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={shareID}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={downloadID}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        )}
      </div>

      {/* Digital ID Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white border-none shadow-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">CREOVA AGRO-ID</h2>
                  <p className="text-green-100 text-sm">Digital Farmer Identity</p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                {isVerified ? (
                  <><CheckCircle2 className="h-3 w-3 mr-1" /> Verified</>
                ) : (
                  <><AlertCircle className="h-3 w-3 mr-1" /> Unverified</>
                )}
              </Badge>
            </div>

            {isVerified ? (
              <>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-green-100 text-sm mb-1">ID Number</p>
                    <p className="text-xl font-mono font-bold">{agroID}</p>
                  </div>
                  <div className="text-right">
                    <QrCode className="h-20 w-20 ml-auto text-white/30" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-green-100 text-sm mb-1">Full Name</p>
                    <p className="font-semibold">{userName}</p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm mb-1">Phone</p>
                    <p className="font-semibold">{userPhone}</p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm mb-1">Region</p>
                    <p className="font-semibold">{region}</p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm mb-1">Farm Size</p>
                    <p className="font-semibold">{farmSize} acres</p>
                  </div>
                </div>

                {/* Credit Score Badge */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm mb-1">Credit Score</p>
                      <p className="text-2xl font-bold">{creditScore.score}</p>
                      <p className="text-sm text-green-100">{creditScore.rating} • {creditScore.tier} Tier</p>
                    </div>
                    <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-8 w-8" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-6 text-xs text-green-100">
                  <Lock className="h-3 w-3" />
                  <span>Secured with blockchain technology • Issued {new Date(registrationDate).toLocaleDateString()}</span>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Fingerprint className="h-16 w-16 mx-auto mb-4 text-white/40" />
                <h3 className="text-xl font-bold mb-2">Verify Your Identity</h3>
                <p className="text-green-100 mb-6">Enter your NIDA number to generate your CREOVA AGRO-ID</p>
                
                <div className="max-w-md mx-auto space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Enter NIDA Number"
                      value={nidaNumber}
                      onChange={(e) => setNidaNumber(e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/50 text-center"
                      maxLength={20}
                    />
                  </div>
                  <Button 
                    onClick={handleVerifyNIDA}
                    className="w-full bg-white text-green-700 hover:bg-green-50"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Verify & Generate AGRO-ID
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {isVerified && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">
              <Home className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="credit">
              <TrendingUp className="h-4 w-4 mr-2" />
              Credit Score
            </TabsTrigger>
            <TabsTrigger value="verification">
              <Shield className="h-4 w-4 mr-2" />
              Verification
            </TabsTrigger>
            <TabsTrigger value="benefits">
              <Award className="h-4 w-4 mr-2" />
              Benefits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">AGRO-ID Status</p>
                      <p className="text-2xl font-bold text-green-600">Active</p>
                    </div>
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Verification Level</p>
                      <p className="text-2xl font-bold">100%</p>
                    </div>
                    <Shield className="h-10 w-10 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Credit Tier</p>
                      <p className="text-2xl font-bold text-purple-600">{creditScore.tier}</p>
                    </div>
                    <Award className="h-10 w-10 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Registered Crops</CardTitle>
                <CardDescription>Your verified farming activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {crops.map((crop, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <TreePine className="h-3 w-3 mr-1" />
                      {crop}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Identity Usage</CardTitle>
                <CardDescription>Services using your AGRO-ID</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">CREOVA Marketplace</p>
                        <p className="text-sm text-gray-600">Buyer verification & payment</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Credit & Loans</p>
                        <p className="text-sm text-gray-600">Loan applications & credit history</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Crop Insurance</p>
                        <p className="text-sm text-gray-600">Policy verification & claims</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-purple-100 text-purple-700">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Credit Score: {creditScore.score}
                </CardTitle>
                <CardDescription>
                  {creditScore.rating} • {creditScore.tier} Tier
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center py-8">
                  <div className="relative">
                    <div className="h-40 w-40 rounded-full border-8 border-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-4xl font-bold">{creditScore.score}</p>
                        <p className="text-sm text-gray-600">{creditScore.rating}</p>
                      </div>
                    </div>
                    <div 
                      className="absolute inset-0 rounded-full border-8 border-transparent"
                      style={{
                        borderTopColor: creditScore.score >= 750 ? '#9333ea' : creditScore.score >= 650 ? '#eab308' : creditScore.score >= 550 ? '#3b82f6' : '#78716c',
                        transform: `rotate(${(creditScore.score / 1000) * 360}deg)`,
                        transition: 'transform 1s ease-out'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Score Breakdown</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Loan Repayment History (25%)</span>
                        <span className="font-medium">{creditData.loanHistory}/100</span>
                      </div>
                      <Progress value={creditData.loanHistory} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Years Active (20%)</span>
                        <span className="font-medium">{creditData.yearsActive}/100</span>
                      </div>
                      <Progress value={Math.min(creditData.yearsActive * 10, 100)} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Yield Performance (20%)</span>
                        <span className="font-medium">{creditData.yieldPerformance}/100</span>
                      </div>
                      <Progress value={creditData.yieldPerformance} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Farm Size (15%)</span>
                        <span className="font-medium">{Math.min(creditData.farmSize * 5, 100)}/100</span>
                      </div>
                      <Progress value={Math.min(creditData.farmSize * 5, 100)} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Mobile Money Usage (10%)</span>
                        <span className="font-medium">{creditData.mobileMoneyUsage}/100</span>
                      </div>
                      <Progress value={creditData.mobileMoneyUsage} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Market Activity (10%)</span>
                        <span className="font-medium">{creditData.marketActivity}/100</span>
                      </div>
                      <Progress value={creditData.marketActivity} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6 text-center">
                      <CircleDollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold text-green-700">TZS 5.2M</p>
                      <p className="text-sm text-gray-600">Available Credit</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6 text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold text-blue-700">4.5%</p>
                      <p className="text-sm text-gray-600">Interest Rate</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improve Your Score</CardTitle>
                <CardDescription>Actions to boost your creditworthiness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Complete 3 more transactions</p>
                      <p className="text-sm text-yellow-700">Increase market activity score by 15 points</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Record higher yields</p>
                      <p className="text-sm text-blue-700">Beat expected yields to gain 10 points</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Use mobile money regularly</p>
                      <p className="text-sm text-green-700">Make 5 payments this month for +8 points</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
                <CardDescription>All verification checks completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium">NIDA Verification</p>
                        <p className="text-sm text-gray-600">National ID verified via NIDA</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Verified</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium">Mobile Number</p>
                        <p className="text-sm text-gray-600">Phone verified with OTP</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Verified</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium">Farm Data</p>
                        <p className="text-sm text-gray-600">Location & size confirmed</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Verified</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium">Creditworthiness</p>
                        <p className="text-sm text-gray-600">Credit history established</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Verified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AGRO-ID Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">ID Number</p>
                    <p className="font-mono font-medium">{agroID}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Issue Date</p>
                    <p className="font-medium">{new Date(registrationDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Region Code</p>
                    <p className="font-medium">{agroID.split('-')[1]}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benefits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AGRO-ID Benefits</CardTitle>
                <CardDescription>Unlock exclusive services and features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-medium mb-2">Access to Credit</h3>
                    <p className="text-sm text-gray-600">
                      Get loans up to TZS 5M based on your credit score with competitive rates as low as 4.5% APR.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-medium mb-2">Instant Insurance</h3>
                    <p className="text-sm text-gray-600">
                      Get crop insurance in minutes with your AGRO-ID. No paperwork, instant approval.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-medium mb-2">Government Subsidies</h3>
                    <p className="text-sm text-gray-600">
                      Automatically qualify for fertilizer subsidies and agricultural support programs.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                      <BarChart3 className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="font-medium mb-2">Marketplace Priority</h3>
                    <p className="text-sm text-gray-600">
                      Verified farmers get priority listings and access to premium buyers on CREOVA Marketplace.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                      <Wallet className="h-5 w-5 text-pink-600" />
                    </div>
                    <h3 className="font-medium mb-2">Wallet Integration</h3>
                    <p className="text-sm text-gray-600">
                      Seamless payments and instant withdrawals through mobile money with your AGRO-ID.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                      <Award className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="font-medium mb-2">Rewards Program</h3>
                    <p className="text-sm text-gray-600">
                      Earn points with every transaction. Redeem for inputs, airtime, or cash.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
