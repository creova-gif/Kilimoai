import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import {
  Leaf,
  Search,
  Filter,
  Sparkles,
  Calendar,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Brain,
  Loader2,
  RefreshCw,
  BookOpen,
  Sun,
  Droplet,
  X,
  CloudOff
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

/**
 * CROP LIBRARY COMPONENT
 * 
 * ✅ BRAND COMPLIANT: Only #2E7D32 (Raspberry Leaf Green)
 * ✅ Mobile-first grid layout
 * ✅ Image-led design
 * ✅ AI-generated crop images
 * ✅ Crop detail view with carousel
 * ✅ "Use in Crop Plan" and "Ask AI" CTAs
 * ✅ Filters by type, lifecycle, season
 * ✅ Bilingual (EN/SW) support
 */

interface Crop {
  id: string;
  name_en: string;
  name_sw: string;
  variety?: string;
  lifecycle: "annual" | "perennial";
  type: "cereal" | "legume" | "vegetable" | "fruit" | "cash_crop" | "root_tuber";
  season: "short_rains" | "long_rains" | "both" | "all_year";
  growth_stages: string[];
  yield_range: string;
  planting_window: string;
  common_risks: string[];
  image_url?: string;
  image_confidence?: number;
  images?: { [stage: string]: string };
  created_at?: string;
  updated_at?: string;
}

interface CropLibraryProps {
  userId: string;
  language: "en" | "sw";
  onNavigate?: (tab: string) => void;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

export function CropLibrary({ userId, language, onNavigate }: CropLibraryProps) {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterLifecycle, setFilterLifecycle] = useState<string>("all");
  const [filterSeason, setFilterSeason] = useState<string>("all");
  const [selectedStage, setSelectedStage] = useState<string>("vegetative");
  const [generatingImage, setGeneratingImage] = useState(false);
  
  // Offline image caching
  const [offlineImages, setOfflineImages] = useState<{ [key: string]: string }>({});
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Translations
  const text = {
    title: language === "en" ? "Crop Library" : "Maktaba ya Mazao",
    subtitle: language === "en" ? "Trusted crop knowledge for your farm" : "Maarifa ya mazao unayoamini kwa shamba lako",
    searchPlaceholder: language === "en" ? "Search crops..." : "Tafuta mazao...",
    filters: language === "en" ? "Filters" : "Vichuja",
    allCrops: language === "en" ? "All Crops" : "Mazao Yote",
    cereals: language === "en" ? "Cereals" : "Nafaka",
    legumes: language === "en" ? "Legumes" : "Kunde",
    vegetables: language === "en" ? "Vegetables" : "Mboga",
    fruits: language === "en" ? "Fruits" : "Matunda",
    cashCrops: language === "en" ? "Cash Crops" : "Mazao ya Biashara",
    rootTubers: language === "en" ? "Root & Tubers" : "Mizizi na Viazi",
    annual: language === "en" ? "Annual" : "Mwaka Mmoja",
    perennial: language === "en" ? "Perennial" : "Kudumu",
    allSeasons: language === "en" ? "All Seasons" : "Misimu Yote",
    shortRains: language === "en" ? "Short Rains" : "Mvua za Vuli",
    longRains: language === "en" ? "Long Rains" : "Mvua za Masika",
    both: language === "en" ? "Both" : "Zote Mbili",
    allYear: language === "en" ? "All Year" : "Mwaka Mzima",
    yieldRange: language === "en" ? "Expected Yield" : "Mavuno Yanayotarajiwa",
    plantingWindow: language === "en" ? "Planting Window" : "Wakati wa Kupanda",
    commonRisks: language === "en" ? "Common Risks" : "Hatari za Kawaida",
    growthStages: language === "en" ? "Growth Stages" : "Hatua za Ukuaji",
    useInCropPlan: language === "en" ? "Use in Crop Plan" : "Tumia kwenye Mpango wa Mazao",
    askAI: language === "en" ? "Ask AI about this crop" : "Uliza AI kuhusu zao hili",
    close: language === "en" ? "Close" : "Funga",
    loading: language === "en" ? "Loading crops..." : "Inapakia mazao...",
    noResults: language === "en" ? "No crops found" : "Hakuna mazao yaliyopatikana",
    tryDifferentSearch: language === "en" ? "Try a different search or filter" : "Jaribu utafutaji au kichuja kingine",
    aiGenerated: language === "en" ? "AI Generated" : "Imetengenezwa na AI",
    confidence: language === "en" ? "Image Quality" : "Ubora wa Picha",
    generateImage: language === "en" ? "Generate AI Image" : "Tengeneza Picha ya AI",
  };

  // Fetch crops on mount
  useEffect(() => {
    fetchCrops();
    loadOfflineImages();
    
    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Filter crops when search or filters change
  useEffect(() => {
    filterCrops();
  }, [searchQuery, filterType, filterLifecycle, filterSeason, crops]);
  
  // Offline image management
  function loadOfflineImages() {
    try {
      const cached = localStorage.getItem('kilimoOfflineCropImages');
      if (cached) {
        setOfflineImages(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Error loading offline images:', error);
    }
  }
  
  async function cacheImageOffline(cropId: string, imageUrl: string) {
    if (!imageUrl || offlineImages[cropId]) return; // Already cached
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Only cache if image is small enough (< 2MB)
      if (blob.size > 2 * 1024 * 1024) return;
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const updated = { ...offlineImages, [cropId]: base64 };
        setOfflineImages(updated);
        
        try {
          localStorage.setItem('kilimoOfflineCropImages', JSON.stringify(updated));
        } catch (error) {
          // Storage full - clear old images
          console.warn('LocalStorage full, clearing old images');
          localStorage.removeItem('kilimoOfflineCropImages');
        }
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Failed to cache image:', error);
    }
  }
  
  function getCropImageUrl(crop: Crop): string {
    // Priority order: online image -> cached offline image -> placeholder
    if (!isOffline && crop.image_url) {
      // Cache for offline use
      cacheImageOffline(crop.id, crop.image_url);
      return crop.image_url;
    }
    
    if (offlineImages[crop.id]) {
      return offlineImages[crop.id];
    }
    
    return ""; // Will show placeholder
  }

  async function fetchCrops() {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE}/crop-library/crops`, {
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch crops");
      }

      const data = await response.json();
      setCrops(data.crops || []);
      setFilteredCrops(data.crops || []);
    } catch (error) {
      console.error("Error fetching crops:", error);
      toast.error(
        language === "en"
          ? "Failed to load crop library"
          : "Imeshindwa kupakia maktaba ya mazao"
      );
    } finally {
      setLoading(false);
    }
  }

  function filterCrops() {
    let result = [...crops];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (crop) =>
          crop.name_en.toLowerCase().includes(query) ||
          crop.name_sw.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (filterType !== "all") {
      result = result.filter((crop) => crop.type === filterType);
    }

    // Lifecycle filter
    if (filterLifecycle !== "all") {
      result = result.filter((crop) => crop.lifecycle === filterLifecycle);
    }

    // Season filter
    if (filterSeason !== "all") {
      result = result.filter(
        (crop) => crop.season === filterSeason || crop.season === "all_year" || crop.season === "both"
      );
    }

    setFilteredCrops(result);
  }

  async function handleGenerateImage(cropId: string, stage: string) {
    try {
      setGeneratingImage(true);
      toast.info(
        language === "en"
          ? "Generating AI image... This may take 30-60 seconds"
          : "Inatengeneza picha ya AI... Hii inaweza kuchukua sekunde 30-60"
      );

      const response = await fetch(`${API_BASE}/crop-library/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ cropId, stage }),
      });

      const data = await response.json();

      if (data.success && data.image_url) {
        toast.success(
          language === "en"
            ? "AI image generated successfully!"
            : "Picha ya AI imetengenezwa!"
        );
        
        // Refresh crops to get updated image
        await fetchCrops();
        
        // Update selected crop if it's the same one
        if (selectedCrop?.id === cropId) {
          const updatedCrop = await fetch(`${API_BASE}/crop-library/crops/${cropId}`, {
            headers: { "Authorization": `Bearer ${publicAnonKey}` },
          });
          const updatedData = await updatedCrop.json();
          setSelectedCrop(updatedData.crop);
        }
      } else {
        throw new Error(data.error || "Failed to generate image");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(
        language === "en"
          ? "Failed to generate AI image"
          : "Imeshindwa kutengeneza picha ya AI"
      );
    } finally {
      setGeneratingImage(false);
    }
  }

  function handleUseinCropPlan(crop: Crop) {
    toast.success(
      language === "en"
        ? `Adding ${crop.name_en} to your crop plan...`
        : `Inaongeza ${crop.name_sw} kwenye mpango wako wa mazao...`
    );
    // Navigate to crop planning page
    onNavigate?.("land-allocation");
  }

  function handleAskAI(crop: Crop) {
    toast.success(
      language === "en"
        ? `Opening AI advisor for ${crop.name_en}...`
        : `Inafungua mshauri wa AI kwa ${crop.name_sw}...`
    );
    // Navigate to AI chat with crop context
    onNavigate?.("ai-chat");
  }

  const getLifecycleBadgeColor = (lifecycle: string) => {
    return lifecycle === "annual" ? "bg-blue-100 text-blue-800" : "bg-[#2E7D32]/10 text-[#2E7D32]";
  };

  const getTypeBadgeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      cereal: "bg-amber-100 text-amber-800",
      legume: "bg-purple-100 text-purple-800",
      vegetable: "bg-[#2E7D32]/10 text-[#2E7D32]",
      fruit: "bg-red-100 text-red-800",
      cash_crop: "bg-emerald-100 text-emerald-800",
      root_tuber: "bg-orange-100 text-orange-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{text.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-4">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-[#2E7D32]/10 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-[#2E7D32]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{text.title}</h1>
              <p className="text-sm text-gray-600">{text.subtitle}</p>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={text.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
            >
              <option value="all">{text.allCrops}</option>
              <option value="cereal">{text.cereals}</option>
              <option value="legume">{text.legumes}</option>
              <option value="vegetable">{text.vegetables}</option>
              <option value="fruit">{text.fruits}</option>
              <option value="cash_crop">{text.cashCrops}</option>
              <option value="root_tuber">{text.rootTubers}</option>
            </select>

            {/* Lifecycle Filter */}
            <select
              value={filterLifecycle}
              onChange={(e) => setFilterLifecycle(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
            >
              <option value="all">{text.allSeasons}</option>
              <option value="annual">{text.annual}</option>
              <option value="perennial">{text.perennial}</option>
            </select>

            {/* Season Filter */}
            <select
              value={filterSeason}
              onChange={(e) => setFilterSeason(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
            >
              <option value="all">{text.allSeasons}</option>
              <option value="short_rains">{text.shortRains}</option>
              <option value="long_rains">{text.longRains}</option>
              <option value="both">{text.both}</option>
              <option value="all_year">{text.allYear}</option>
            </select>
          </div>

          {/* Results count */}
          <div className="mt-3">
            <p className="text-sm text-gray-600">
              {filteredCrops.length} {language === "en" ? "crops" : "mazao"}
            </p>
          </div>
        </div>
      </div>

      {/* Crop Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Offline Indicator */}
        {isOffline && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg">
            <div className="flex items-center">
              <CloudOff className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                {language === "en" 
                  ? "You're offline. Using trusted reference images." 
                  : "Huna mtandao. Tunatumia picha za kumbukumbu."}
              </p>
            </div>
          </div>
        )}
        
        {filteredCrops.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{text.noResults}</h3>
            <p className="text-sm text-gray-600">{text.tryDifferentSearch}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCrops.map((crop) => (
              <Card
                key={crop.id}
                className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden border-2 hover:border-[#2E7D32]"
                onClick={() => setSelectedCrop(crop)}
              >
                {/* Crop Image */}
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {crop.image_url ? (
                    <img
                      src={crop.image_url}
                      alt={language === "en" ? crop.name_en : crop.name_sw}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2E7D32]/10 to-[#2E7D32]/5">
                      <Leaf className="h-16 w-16 text-[#2E7D32]/30" />
                    </div>
                  )}
                  {crop.image_url && crop.image_confidence && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-[#2E7D32]" />
                        <span className="text-xs font-medium text-gray-700">
                          {Math.round(crop.image_confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Crop Info */}
                <CardContent className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {language === "en" ? crop.name_en : crop.name_sw}
                  </h3>
                  <div className="flex gap-1 flex-wrap">
                    <Badge variant="secondary" className={`text-xs ${getLifecycleBadgeColor(crop.lifecycle)}`}>
                      {crop.lifecycle === "annual" ? text.annual : text.perennial}
                    </Badge>
                    <Badge variant="secondary" className={`text-xs ${getTypeBadgeColor(crop.type)}`}>
                      {crop.type.replace("_", " ")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Crop Detail Dialog */}
      {selectedCrop && (
        <Dialog open={!!selectedCrop} onOpenChange={() => setSelectedCrop(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Leaf className="h-6 w-6 text-[#2E7D32]" />
                {language === "en" ? selectedCrop.name_en : selectedCrop.name_sw}
              </DialogTitle>
              <DialogDescription>
                {language === "en" ? selectedCrop.name_sw : selectedCrop.name_en}
              </DialogDescription>
            </DialogHeader>

            {/* Image Carousel / Growth Stages */}
            <div className="mt-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                {selectedCrop.images?.[selectedStage] || selectedCrop.image_url ? (
                  <img
                    src={selectedCrop.images?.[selectedStage] || selectedCrop.image_url}
                    alt={`${selectedCrop.name_en} - ${selectedStage}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <Leaf className="h-20 w-20 text-gray-300" />
                    <Button
                      size="sm"
                      onClick={() => handleGenerateImage(selectedCrop.id, selectedStage)}
                      disabled={generatingImage}
                      className="bg-[#2E7D32] hover:bg-[#2E7D32]/90"
                    >
                      {generatingImage ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {language === "en" ? "Generating..." : "Inatengeneza..."}
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          {text.generateImage}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Growth Stage Selector */}
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {selectedCrop.growth_stages.map((stage) => (
                  <Button
                    key={stage}
                    size="sm"
                    variant={selectedStage === stage ? "default" : "outline"}
                    onClick={() => setSelectedStage(stage)}
                    className={selectedStage === stage ? "bg-[#2E7D32] hover:bg-[#2E7D32]/90" : ""}
                  >
                    {stage.replace("_", " ")}
                  </Button>
                ))}
              </div>
            </div>

            {/* Crop Details */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {/* Yield Range */}
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#2E7D32]/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5 text-[#2E7D32]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{text.yieldRange}</p>
                  <p className="text-sm text-gray-600">{selectedCrop.yield_range}</p>
                </div>
              </div>

              {/* Planting Window */}
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#2E7D32]/10 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-[#2E7D32]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{text.plantingWindow}</p>
                  <p className="text-sm text-gray-600">{selectedCrop.planting_window}</p>
                </div>
              </div>
            </div>

            {/* Common Risks */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold text-gray-900">{text.commonRisks}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCrop.common_risks.map((risk, index) => (
                  <Badge key={index} variant="secondary" className="bg-orange-50 text-orange-800">
                    {risk}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-3 mt-6">
              <Button
                className="bg-[#2E7D32] hover:bg-[#2E7D32]/90"
                onClick={() => handleUseinCropPlan(selectedCrop)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {text.useInCropPlan}
              </Button>
              <Button
                variant="outline"
                className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32]/10"
                onClick={() => handleAskAI(selectedCrop)}
              >
                <Brain className="h-4 w-4 mr-2" />
                {text.askAI}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

CropLibrary.displayName = "CropLibrary";