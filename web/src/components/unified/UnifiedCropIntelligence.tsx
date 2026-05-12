/**
 * UNIFIED CROP INTELLIGENCE
 * 
 * Farmer Question: "How do I grow this crop?"
 * 
 * MERGES 3 LEGACY PAGES:
 * - Crop Library (browse all crops)
 * - Growing Templates (best practices per crop)
 * - Crop Specific Tips (contextual advice)
 * 
 * TABS:
 * 1. Crop Library - Browse & search all crops
 * 2. Growing Guides - Step-by-step cultivation guides
 * 3. Seasonal Tips - Current season recommendations
 * 
 * DESIGN PHILOSOPHY:
 * - One farmer job = one page
 * - Tabs instead of separate destinations
 * - Offline-first (all crop data cached)
 * - Speed > beauty > completeness
 */

import { useState, useEffect } from "react";
import { 
  Leaf, BookOpen, Calendar, Search, Filter, ChevronRight,
  Droplet, Sun, ThermometerSun, Sprout, TrendingUp
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { CropSpecificTips } from "../CropSpecificTips";

interface UnifiedCropIntelligenceProps {
  userId: string;
  userCrops?: string[];
  region?: string;
  language: "en" | "sw";
}

// Comprehensive crop database
const CROP_DATABASE = [
  {
    id: "maize",
    name: { en: "Maize (Corn)", sw: "Mahindi" },
    category: "cereals",
    difficulty: "easy",
    season: ["long-rains", "short-rains"],
    duration: "90-120 days",
    yield: "2-4 tons/acre",
    waterNeed: "moderate",
    sunRequirement: "full",
    icon: "🌽"
  },
  {
    id: "beans",
    name: { en: "Beans", sw: "Maharagwe" },
    category: "legumes",
    difficulty: "easy",
    season: ["long-rains", "short-rains"],
    duration: "60-90 days",
    yield: "0.5-1 ton/acre",
    waterNeed: "moderate",
    sunRequirement: "full",
    icon: "🫘"
  },
  {
    id: "coffee",
    name: { en: "Coffee", sw: "Kahawa" },
    category: "cash-crops",
    difficulty: "hard",
    season: ["year-round"],
    duration: "3-4 years to maturity",
    yield: "0.5-2 tons/acre",
    waterNeed: "high",
    sunRequirement: "partial",
    icon: "☕"
  },
  {
    id: "rice",
    name: { en: "Rice", sw: "Mchele" },
    category: "cereals",
    difficulty: "moderate",
    season: ["long-rains"],
    duration: "120-150 days",
    yield: "1-3 tons/acre",
    waterNeed: "very-high",
    sunRequirement: "full",
    icon: "🍚"
  },
  {
    id: "tomatoes",
    name: { en: "Tomatoes", sw: "Nyanya" },
    category: "vegetables",
    difficulty: "moderate",
    season: ["long-rains", "short-rains"],
    duration: "60-90 days",
    yield: "10-20 tons/acre",
    waterNeed: "high",
    sunRequirement: "full",
    icon: "🍅"
  },
  {
    id: "cassava",
    name: { en: "Cassava", sw: "Muhogo" },
    category: "root-crops",
    difficulty: "easy",
    season: ["year-round"],
    duration: "9-12 months",
    yield: "8-15 tons/acre",
    waterNeed: "low",
    sunRequirement: "full",
    icon: "🥔"
  },
  {
    id: "tea",
    name: { en: "Tea", sw: "Chai" },
    category: "cash-crops",
    difficulty: "hard",
    season: ["year-round"],
    duration: "3-5 years to maturity",
    yield: "1-2 tons/acre",
    waterNeed: "high",
    sunRequirement: "partial",
    icon: "🍵"
  },
  {
    id: "sunflower",
    name: { en: "Sunflower", sw: "Alizeti" },
    category: "oilseeds",
    difficulty: "easy",
    season: ["long-rains"],
    duration: "90-120 days",
    yield: "0.8-1.5 tons/acre",
    waterNeed: "low",
    sunRequirement: "full",
    icon: "🌻"
  },
];

export function UnifiedCropIntelligence({
  userId,
  userCrops = [],
  region = "Unknown",
  language
}: UnifiedCropIntelligenceProps) {
  const [activeTab, setActiveTab] = useState("library");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  const categories = [
    { id: "all", label: language === "en" ? "All Crops" : "Mazao Yote" },
    { id: "cereals", label: language === "en" ? "Cereals" : "Nafaka" },
    { id: "legumes", label: language === "en" ? "Legumes" : "Kunde" },
    { id: "vegetables", label: language === "en" ? "Vegetables" : "Mboga" },
    { id: "cash-crops", label: language === "en" ? "Cash Crops" : "Mazao ya Biashara" },
    { id: "root-crops", label: language === "en" ? "Root Crops" : "Mizizi" },
    { id: "oilseeds", label: language === "en" ? "Oilseeds" : "Mbegu za Mafuta" },
  ];

  const filteredCrops = CROP_DATABASE.filter(crop => {
    const matchesSearch = searchQuery === "" || 
      crop.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.name.sw.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === "all" || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const tabs = [
    {
      id: "library",
      label: language === "en" ? "Crop Library" : "Maktaba ya Mazao",
      icon: Leaf,
      description: language === "en" ? "Browse all crops" : "Tazama mazao yote"
    },
    {
      id: "guides",
      label: language === "en" ? "Growing Guides" : "Miongozo",
      icon: BookOpen,
      description: language === "en" ? "Step-by-step guides" : "Hatua kwa hatua"
    },
    {
      id: "tips",
      label: language === "en" ? "Seasonal Tips" : "Vidokezo vya Msimu",
      icon: Calendar,
      description: language === "en" ? "Current season advice" : "Ushauri wa msimu huu"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2E7D32] rounded-lg">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {language === "en" ? "Crop Intelligence" : "Taarifa za Mazao"}
            </h1>
            <p className="text-sm text-gray-600">
              {language === "en" 
                ? "Complete growing guides for every crop" 
                : "Miongozo kamili ya kulima kila zao"}
            </p>
          </div>
        </div>
      </div>

      {/* Unified Tabs Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab List */}
        <TabsList className="w-full justify-start overflow-x-auto bg-white border border-gray-200 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-[#2E7D32] data-[state=active]:text-white transition-colors whitespace-nowrap"
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab Contents */}
        <div className="mt-6">
          {/* Crop Library */}
          <TabsContent value="library" className="mt-0 space-y-4">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={language === "en" ? "Search crops..." : "Tafuta mazao..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? "bg-[#2E7D32] hover:bg-[#2E7D32]/90" : ""}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Crop Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCrops.map((crop) => (
                <Card 
                  key={crop.id} 
                  className="hover:border-[#2E7D32] cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedCrop(crop.id);
                    setActiveTab("guides");
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{crop.icon}</span>
                        <div>
                          <CardTitle className="text-lg">
                            {crop.name[language]}
                          </CardTitle>
                          <CardDescription>
                            {language === "en" ? "Duration:" : "Muda:"} {crop.duration}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge 
                        variant={crop.difficulty === "easy" ? "default" : crop.difficulty === "moderate" ? "secondary" : "destructive"}
                        className={crop.difficulty === "easy" ? "bg-[#2E7D32]" : ""}
                      >
                        {crop.difficulty === "easy" ? (language === "en" ? "Easy" : "Rahisi") :
                         crop.difficulty === "moderate" ? (language === "en" ? "Moderate" : "Wastani") :
                         (language === "en" ? "Advanced" : "Ngumu")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>{language === "en" ? "Yield:" : "Mavuno:"} {crop.yield}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Droplet className="h-3 w-3" />
                        <span>{crop.waterNeed}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Sun className="h-3 w-3" />
                        <span>{crop.sunRequirement}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCrop(crop.id);
                        setActiveTab("guides");
                      }}
                    >
                      {language === "en" ? "View Guide" : "Angalia Mwongozo"}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCrops.length === 0 && (
              <div className="text-center py-12">
                <Leaf className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {language === "en" ? "No crops found" : "Hakuna mazao yaliyopatikana"}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Growing Guides */}
          <TabsContent value="guides" className="mt-0">
            <div className="space-y-4">
              {selectedCrop ? (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === "en" ? "Growing Guide" : "Mwongozo wa Kulima"}
                    </CardTitle>
                    <CardDescription>
                      {CROP_DATABASE.find(c => c.id === selectedCrop)?.name[language]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Sprout className="h-4 w-4 text-[#2E7D32]" />
                        {language === "en" ? "Land Preparation" : "Kuandaa Ardhi"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === "en" 
                          ? "Clear the land and prepare well-drained soil. Add organic matter like compost or manure."
                          : "Safisha ardhi na uandae udongo wenye mfereji mzuri. Ongeza mbolea asilia kama mbolea ya kuku."}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-[#2E7D32]" />
                        {language === "en" ? "Planting" : "Kupanda"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === "en"
                          ? "Plant seeds at the recommended depth and spacing. Water immediately after planting."
                          : "Panda mbegu kwa kina na umbali unaopendekeza. Mwagilie maji mara baada ya kupanda."}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <ThermometerSun className="h-4 w-4 text-[#2E7D32]" />
                        {language === "en" ? "Growing Season" : "Msimu wa Kukua"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === "en"
                          ? "Monitor growth regularly. Apply fertilizer as needed and control pests and diseases."
                          : "Fuatilia ukuaji mara kwa mara. Tumia mbolea inapohitajika na dhibiti wadudu na magonjwa."}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-[#2E7D32]" />
                        {language === "en" ? "Harvesting" : "Kuvuna"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === "en"
                          ? "Harvest when crops reach maturity. Handle produce carefully to minimize damage."
                          : "Vuna wakati mazao yanapokomaa. Shughulikia mazao kwa uangalifu ili kupunguza uharibifu."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {language === "en" 
                      ? "Select a crop from the library to view its growing guide"
                      : "Chagua zao kutoka maktaba ili kuona mwongozo wake"}
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("library")}
                  >
                    {language === "en" ? "Browse Crops" : "Tazama Mazao"}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Seasonal Tips */}
          <TabsContent value="tips" className="mt-0">
            <CropSpecificTips language={language} crops={userCrops} region={region} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
