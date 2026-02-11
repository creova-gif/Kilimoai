/**
 * UNIFIED FARM MAP - WORLD-CLASS SATELLITE IMAGERY
 * 
 * Farmer Question: "Where is everything on my farm?"
 * 
 * PREMIUM FEATURES (TEND-STYLE):
 * - Real satellite imagery backgrounds
 * - Multi-date imagery comparison
 * - Zoom/pan controls
 * - Field overlays with transparency
 * - NDVI vegetation index
 * - Time-series slider
 * - High-resolution imagery
 * - Professional cartography
 */

import { useState } from "react";
import { 
  MapPin, Plus, Navigation, Satellite, Layers, ZoomIn, ZoomOut,
  Calendar, Maximize2, Minimize2, RotateCcw, ChevronLeft, ChevronRight,
  Eye, EyeOff, Edit3, Target, Compass, Radio, PenTool, CloudRain,
  Sprout, TrendingUp, Grid3x3, Sun, Droplets, Wind, Maximize, Download,
  Share2, Settings, Image as ImageIcon
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { Progress } from "../ui/progress";
import { Slider } from "../ui/slider";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface UnifiedFarmMapProps {
  userId: string;
  language: "en" | "sw";
}

interface Field {
  id: string;
  name: string;
  size: number;
  crop: string;
  status: "active" | "fallow" | "preparing";
  health: number;
  soilType: string;
  lastRotation: string;
  coordinates?: { lat: number; lng: number }[];
  color: string;
  ndvi: number; // Vegetation index 0-1
}

interface SatelliteImage {
  id: string;
  date: string;
  url: string;
  resolution: string;
  cloudCover: number;
}

export function UnifiedFarmMap({
  userId,
  language
}: UnifiedFarmMapProps) {
  const [viewMode, setViewMode] = useState<"satellite" | "map" | "hybrid">("satellite");
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [showWeather, setShowWeather] = useState(true);
  const [showFields, setShowFields] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(16);
  const [selectedImageDate, setSelectedImageDate] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(70);
  const [showNDVI, setShowNDVI] = useState(false);

  // Satellite imagery dates
  const satelliteImages: SatelliteImage[] = [
    {
      id: "1",
      date: "2024-02-10",
      url: "https://images.unsplash.com/photo-1705918185419-c58f37874bcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBmYXJtJTIwZmllbGQlMjBzYXRlbGxpdGUlMjB2aWV3fGVufDF8fHx8MTc3MDc2NTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      resolution: "1m/pixel",
      cloudCover: 5
    },
    {
      id: "2",
      date: "2024-01-25",
      url: "https://images.unsplash.com/photo-1745094950509-bee6c1be81f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBmYXJtbGFuZCUyMGFlcmlhbCUyMHRvcCUyMGRvd258ZW58MXx8fHwxNzcwNzY1ODUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      resolution: "1m/pixel",
      cloudCover: 10
    },
    {
      id: "3",
      date: "2024-01-10",
      url: "https://images.unsplash.com/photo-1638348198210-457443779079?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGNyb3AlMjBmaWVsZHMlMjBiaXJkcyUyMGV5ZSUyMHZpZXd8ZW58MXx8fHwxNzcwNzY1ODUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      resolution: "1m/pixel",
      cloudCover: 2
    }
  ];

  const [fields, setFields] = useState<Field[]>([
    {
      id: "1",
      name: language === "en" ? "North Field" : "Shamba la Kaskazini",
      size: 2.5,
      crop: language === "en" ? "Maize" : "Mahindi",
      status: "active",
      health: 85,
      ndvi: 0.72,
      soilType: language === "en" ? "Loamy" : "Udongo wa Loam",
      lastRotation: "2024-01-15",
      color: "#34D399"
    },
    {
      id: "2",
      name: language === "en" ? "South Field" : "Shamba la Kusini",
      size: 1.8,
      crop: language === "en" ? "Beans" : "Maharagwe",
      status: "active",
      health: 92,
      ndvi: 0.81,
      soilType: language === "en" ? "Clay" : "Udongo wa Tope",
      lastRotation: "2023-12-20",
      color: "#60A5FA"
    },
    {
      id: "3",
      name: language === "en" ? "East Field" : "Shamba la Mashariki",
      size: 3.2,
      crop: language === "en" ? "Fallow" : "Tupeni",
      status: "fallow",
      health: 70,
      ndvi: 0.45,
      soilType: language === "en" ? "Sandy" : "Udongo wa Mchanga",
      lastRotation: "2023-11-10",
      color: "#FBBF24"
    },
    {
      id: "4",
      name: language === "en" ? "West Field" : "Shamba la Magharibi",
      size: 2.0,
      crop: language === "en" ? "Rice" : "Mchele",
      status: "preparing",
      health: 78,
      ndvi: 0.58,
      soilType: language === "en" ? "Loamy" : "Udongo wa Loam",
      lastRotation: "2024-02-01",
      color: "#A78BFA"
    }
  ]);

  const text = {
    title: language === "en" ? "Farm Map" : "Ramani ya Shamba",
    subtitle: language === "en" ? "Satellite-powered field management" : "Usimamizi wa mashamba kwa satelaiti",
    addField: language === "en" ? "Draw Field" : "Chora Shamba",
    totalArea: language === "en" ? "Total Area" : "Eneo Jumla",
    fields: language === "en" ? "Fields" : "Mashamba",
    avgHealth: language === "en" ? "Avg Health" : "Afya ya Wastani",
    satelliteView: language === "en" ? "Satellite" : "Satelaiti",
    mapView: language === "en" ? "Map" : "Ramani",
    hybridView: language === "en" ? "Hybrid" : "Mchanganyiko",
    acres: language === "en" ? "acres" : "ekari",
    status: {
      active: language === "en" ? "Growing" : "Inakua",
      fallow: language === "en" ? "Resting" : "Inapumzika",
      preparing: language === "en" ? "Preparing" : "Inaandaliwa"
    },
    health: language === "en" ? "Health" : "Afya",
    soilType: language === "en" ? "Soil" : "Udongo",
    viewDetails: language === "en" ? "Details" : "Maelezo",
    editField: language === "en" ? "Edit" : "Hariri",
    gpsAccuracy: language === "en" ? "GPS" : "GPS",
    excellent: language === "en" ? "Active" : "Hai",
    drawMode: language === "en" ? "Draw Mode" : "Hali ya Kuchora",
    weatherOverlay: language === "en" ? "Weather" : "Hewa",
    fieldBoundaries: language === "en" ? "Fields" : "Mashamba",
    ndviView: language === "en" ? "NDVI" : "NDVI",
    imageDate: language === "en" ? "Image Date" : "Tarehe ya Picha",
    resolution: language === "en" ? "Resolution" : "Ubora",
    cloudCover: language === "en" ? "Cloud Cover" : "Mawingu",
    opacity: language === "en" ? "Overlay" : "Uwazi",
    zoom: language === "en" ? "Zoom" : "Kuza",
  };

  const totalArea = fields.reduce((sum, field) => sum + field.size, 0);
  const avgHealth = fields.reduce((sum, field) => sum + field.health, 0) / fields.length;
  const avgNDVI = fields.reduce((sum, field) => sum + field.ndvi, 0) / fields.length;

  const statusColors = {
    active: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-300", dot: "bg-emerald-500" },
    fallow: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300", dot: "bg-amber-500" },
    preparing: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-300", dot: "bg-purple-500" },
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return { text: "text-emerald-600", bg: "bg-emerald-500" };
    if (health >= 60) return { text: "text-blue-600", bg: "bg-blue-500" };
    if (health >= 40) return { text: "text-amber-600", bg: "bg-amber-500" };
    return { text: "text-red-600", bg: "bg-red-500" };
  };

  const getNDVIColor = (ndvi: number) => {
    if (ndvi >= 0.7) return "#10B981"; // Emerald
    if (ndvi >= 0.5) return "#84CC16"; // Lime
    if (ndvi >= 0.3) return "#FBBF24"; // Amber
    return "#EF4444"; // Red
  };

  const currentImage = satelliteImages[selectedImageDate];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-emerald-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#2E7D32] via-[#388E3C] to-[#1B5E20] rounded-3xl p-6 md:p-8 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-lg">
                    <Satellite className="h-8 w-8 text-white animate-pulse" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-400 rounded-full border-2 border-white animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">{text.title}</h1>
                  <p className="text-white/90 text-sm flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    {text.subtitle}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={() => {
                  setDrawingMode(!drawingMode);
                  toast.success(drawingMode 
                    ? (language === "en" ? "Draw mode disabled" : "Hali ya kuchora imezimwa")
                    : (language === "en" ? "GPS drawing enabled" : "Kuchora kwa GPS kumewashwa")
                  );
                }}
                className={`${drawingMode ? "bg-white text-[#2E7D32]" : "bg-white/20 text-white"} hover:bg-white hover:text-[#2E7D32] backdrop-blur-xl border-0 shadow-xl`}
              >
                <PenTool className="h-4 w-4 mr-2" />
                {text.addField}
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-white/80" />
                  <p className="text-xs text-white/80 uppercase tracking-wide">{text.totalArea}</p>
                </div>
                <p className="text-3xl font-bold mb-1">{totalArea.toFixed(1)}</p>
                <p className="text-xs text-white/80">{text.acres}</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="h-4 w-4 text-white/80" />
                  <p className="text-xs text-white/80 uppercase tracking-wide">{text.fields}</p>
                </div>
                <p className="text-3xl font-bold mb-1">{fields.length}</p>
                <p className="text-xs text-white/80">{language === "en" ? "mapped" : "zimechorwa"}</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sprout className="h-4 w-4 text-white/80" />
                  <p className="text-xs text-white/80 uppercase tracking-wide">{text.avgHealth}</p>
                </div>
                <p className="text-3xl font-bold mb-1">{avgHealth.toFixed(0)}%</p>
                <Progress value={avgHealth} className="h-1.5 bg-white/20 [&>div]:bg-white" />
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Radio className="h-4 w-4 text-white/80 animate-pulse" />
                  <p className="text-xs text-white/80 uppercase tracking-wide">NDVI</p>
                </div>
                <p className="text-3xl font-bold mb-1">{avgNDVI.toFixed(2)}</p>
                <p className="text-xs text-white/80">{language === "en" ? "vegetation" : "mimea"}</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* View Mode & Tools Bar */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* View Mode Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setViewMode("satellite")}
              className={`px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                viewMode === "satellite"
                  ? "bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white shadow-xl scale-105"
                  : "bg-white text-gray-700 border-2 border-gray-200"
              }`}
            >
              <Satellite className="h-4 w-4" />
              {text.satelliteView}
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                viewMode === "map"
                  ? "bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white shadow-xl scale-105"
                  : "bg-white text-gray-700 border-2 border-gray-200"
              }`}
            >
              <MapPin className="h-4 w-4" />
              {text.mapView}
            </button>
            <button
              onClick={() => setViewMode("hybrid")}
              className={`px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                viewMode === "hybrid"
                  ? "bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white shadow-xl scale-105"
                  : "bg-white text-gray-700 border-2 border-gray-200"
              }`}
            >
              <Layers className="h-4 w-4" />
              {text.hybridView}
            </button>
          </div>

          {/* Tools */}
          <div className="flex flex-wrap gap-2 lg:ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFields(!showFields)}
              className={`border-2 ${showFields ? "bg-emerald-50 border-emerald-300" : ""}`}
            >
              {showFields ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              {text.fieldBoundaries}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowNDVI(!showNDVI);
                toast.success(showNDVI 
                  ? (language === "en" ? "NDVI view disabled" : "Muonekano wa NDVI umezimwa")
                  : (language === "en" ? "NDVI vegetation index enabled" : "Kiashiria cha mimea NDVI kimewashwa")
                );
              }}
              className={`border-2 ${showNDVI ? "bg-green-50 border-green-300" : ""}`}
            >
              <Sprout className="h-4 w-4 mr-2" />
              {text.ndviView}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWeather(!showWeather)}
              className={`border-2 ${showWeather ? "bg-blue-50 border-blue-300" : ""}`}
            >
              <CloudRain className="h-4 w-4 mr-2" />
              {text.weatherOverlay}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success(language === "en" ? "Downloading satellite image..." : "Inapakua picha ya satelaiti...")}
            >
              <Download className="h-4 w-4 mr-2" />
              {language === "en" ? "Export" : "Hamisha"}
            </Button>
          </div>
        </div>

        {/* PREMIUM SATELLITE MAP - TEND STYLE */}
        <Card className="border-2 border-gray-300 overflow-hidden shadow-2xl">
          <CardContent className="p-0 relative">
            {/* Satellite Imagery Background */}
            <div className="aspect-video relative overflow-hidden bg-gray-900">
              <ImageWithFallback
                src={currentImage.url}
                alt="Satellite farm view"
                className="w-full h-full object-cover"
              />
              
              {/* NDVI Overlay */}
              <AnimatePresence>
                {showNDVI && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: overlayOpacity / 100 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 mix-blend-multiply"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500/60 via-lime-500/60 to-yellow-500/60"></div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Field Overlays - Tend Style */}
              <AnimatePresence>
                {showFields && (
                  <div className="absolute inset-0 p-8">
                    <div className="relative w-full h-full">
                      {/* Field 1 */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedField(fields[0].id)}
                        className="absolute top-[10%] left-[10%] w-[35%] h-[40%] rounded-2xl cursor-pointer transition-all"
                        style={{
                          backgroundColor: showNDVI ? `${getNDVIColor(fields[0].ndvi)}40` : `${fields[0].color}30`,
                          border: `3px ${selectedField === fields[0].id ? 'solid' : 'dashed'} ${showNDVI ? getNDVIColor(fields[0].ndvi) : fields[0].color}`,
                          boxShadow: selectedField === fields[0].id ? `0 0 40px ${fields[0].color}` : 'none'
                        }}
                      >
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xl rounded-xl px-3 py-2 shadow-2xl border border-gray-200">
                          <p className="text-xs font-bold text-gray-900">{fields[0].name}</p>
                          <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                            <Sprout className="h-3 w-3" />
                            {fields[0].crop} • {fields[0].size} {text.acres}
                          </p>
                          {showNDVI && (
                            <Badge className="mt-1 text-xs" style={{ backgroundColor: getNDVIColor(fields[0].ndvi), color: 'white' }}>
                              NDVI {fields[0].ndvi.toFixed(2)}
                            </Badge>
                          )}
                        </div>
                      </motion.div>

                      {/* Field 2 */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedField(fields[1].id)}
                        className="absolute bottom-[10%] left-[10%] w-[30%] h-[35%] rounded-2xl cursor-pointer transition-all"
                        style={{
                          backgroundColor: showNDVI ? `${getNDVIColor(fields[1].ndvi)}40` : `${fields[1].color}30`,
                          border: `3px ${selectedField === fields[1].id ? 'solid' : 'dashed'} ${showNDVI ? getNDVIColor(fields[1].ndvi) : fields[1].color}`,
                          boxShadow: selectedField === fields[1].id ? `0 0 40px ${fields[1].color}` : 'none'
                        }}
                      >
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xl rounded-xl px-3 py-2 shadow-2xl border border-gray-200">
                          <p className="text-xs font-bold text-gray-900">{fields[1].name}</p>
                          <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                            <Sprout className="h-3 w-3" />
                            {fields[1].crop} • {fields[1].size} {text.acres}
                          </p>
                          {showNDVI && (
                            <Badge className="mt-1 text-xs" style={{ backgroundColor: getNDVIColor(fields[1].ndvi), color: 'white' }}>
                              NDVI {fields[1].ndvi.toFixed(2)}
                            </Badge>
                          )}
                        </div>
                      </motion.div>

                      {/* Field 3 */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedField(fields[2].id)}
                        className="absolute top-[10%] right-[10%] w-[40%] h-[45%] rounded-2xl cursor-pointer transition-all"
                        style={{
                          backgroundColor: showNDVI ? `${getNDVIColor(fields[2].ndvi)}40` : `${fields[2].color}30`,
                          border: `3px ${selectedField === fields[2].id ? 'solid' : 'dashed'} ${showNDVI ? getNDVIColor(fields[2].ndvi) : fields[2].color}`,
                          boxShadow: selectedField === fields[2].id ? `0 0 40px ${fields[2].color}` : 'none'
                        }}
                      >
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xl rounded-xl px-3 py-2 shadow-2xl border border-gray-200">
                          <p className="text-xs font-bold text-gray-900">{fields[2].name}</p>
                          <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                            <Sprout className="h-3 w-3" />
                            {fields[2].crop} • {fields[2].size} {text.acres}
                          </p>
                          {showNDVI && (
                            <Badge className="mt-1 text-xs" style={{ backgroundColor: getNDVIColor(fields[2].ndvi), color: 'white' }}>
                              NDVI {fields[2].ndvi.toFixed(2)}
                            </Badge>
                          )}
                        </div>
                      </motion.div>

                      {/* Field 4 */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedField(fields[3].id)}
                        className="absolute bottom-[10%] right-[10%] w-[35%] h-[30%] rounded-2xl cursor-pointer transition-all"
                        style={{
                          backgroundColor: showNDVI ? `${getNDVIColor(fields[3].ndvi)}40` : `${fields[3].color}30`,
                          border: `3px ${selectedField === fields[3].id ? 'solid' : 'dashed'} ${showNDVI ? getNDVIColor(fields[3].ndvi) : fields[3].color}`,
                          boxShadow: selectedField === fields[3].id ? `0 0 40px ${fields[3].color}` : 'none'
                        }}
                      >
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xl rounded-xl px-3 py-2 shadow-2xl border border-gray-200">
                          <p className="text-xs font-bold text-gray-900">{fields[3].name}</p>
                          <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                            <Sprout className="h-3 w-3" />
                            {fields[3].crop} • {fields[3].size} {text.acres}
                          </p>
                          {showNDVI && (
                            <Badge className="mt-1 text-xs" style={{ backgroundColor: getNDVIColor(fields[3].ndvi), color: 'white' }}>
                              NDVI {fields[3].ndvi.toFixed(2)}
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}
              </AnimatePresence>

              {/* Weather Overlay - Tend Style */}
              <AnimatePresence>
                {showWeather && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-4 left-4 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Sun className="h-6 w-6 text-amber-500" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900">28°C</p>
                          <p className="text-xs text-gray-600">{language === "en" ? "Sunny" : "Jua"}</p>
                        </div>
                      </div>
                      <div className="h-8 w-px bg-gray-300"></div>
                      <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-bold text-gray-900">65%</p>
                          <p className="text-xs text-gray-600">{language === "en" ? "Humidity" : "Unyevu"}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Zoom Controls - Tend Style */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setZoomLevel(Math.min(zoomLevel + 1, 20));
                    toast.success(`${text.zoom}: ${zoomLevel + 1}`);
                  }}
                  className="h-10 w-10 rounded-xl bg-white/95 hover:bg-white text-gray-900 shadow-2xl border border-gray-200"
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setZoomLevel(Math.max(zoomLevel - 1, 10));
                    toast.success(`${text.zoom}: ${zoomLevel - 1}`);
                  }}
                  className="h-10 w-10 rounded-xl bg-white/95 hover:bg-white text-gray-900 shadow-2xl border border-gray-200"
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setZoomLevel(16);
                    toast.success(language === "en" ? "View reset" : "Muonekano umerejeshwa");
                  }}
                  className="h-10 w-10 rounded-xl bg-white/95 hover:bg-white text-gray-900 shadow-2xl border border-gray-200"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>

              {/* GPS Status - Premium */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xl rounded-xl px-4 py-2 shadow-2xl border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="h-3 w-3 bg-emerald-500 rounded-full"></div>
                    <div className="absolute inset-0 h-3 w-3 bg-emerald-500 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">GPS</span>
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs">±1.5m</Badge>
                </div>
              </div>

              {/* Image Metadata - Tend Style */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xl rounded-xl px-4 py-2 shadow-2xl border border-gray-200">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-gray-600" />
                    <span className="font-semibold text-gray-900">
                      {new Date(currentImage.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="h-3 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-1">
                    <ImageIcon className="h-3.5 w-3.5 text-gray-600" />
                    <span className="text-gray-600">{currentImage.resolution}</span>
                  </div>
                  <div className="h-3 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-1">
                    <CloudRain className="h-3.5 w-3.5 text-gray-600" />
                    <span className="text-gray-600">{currentImage.cloudCover}%</span>
                  </div>
                </div>
              </div>

              {/* Drawing Mode Indicator */}
              <AnimatePresence>
                {drawingMode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl px-8 py-4 shadow-2xl"
                  >
                    <div className="text-center">
                      <PenTool className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                      <p className="font-bold text-lg">{text.drawMode}</p>
                      <p className="text-sm opacity-90 mb-3">
                        {language === "en" ? "Walk field boundary to map" : "Tembea mipaka kuchora"}
                      </p>
                      <Button 
                        size="sm" 
                        onClick={() => setDrawingMode(false)}
                        className="bg-white/20 hover:bg-white/30"
                      >
                        {language === "en" ? "Stop Drawing" : "Acha Kuchora"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Time-Series Image Selector - Tend Style */}
            <div className="bg-white border-t-2 border-gray-200 p-4">
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedImageDate(Math.max(0, selectedImageDate - 1))}
                  disabled={selectedImageDate === 0}
                  className="h-9 w-9 p-0"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {text.imageDate}: {new Date(currentImage.date).toLocaleDateString()}
                    </span>
                    <Badge className="bg-blue-100 text-blue-700">
                      {selectedImageDate + 1} / {satelliteImages.length}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {satelliteImages.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImageDate(idx)}
                        className={`flex-1 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageDate === idx 
                            ? 'border-[#2E7D32] ring-2 ring-[#2E7D32] ring-offset-2' 
                            : 'border-gray-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <ImageWithFallback
                          src={img.url}
                          alt={`Satellite ${img.date}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedImageDate(Math.min(satelliteImages.length - 1, selectedImageDate + 1))}
                  disabled={selectedImageDate === satelliteImages.length - 1}
                  className="h-9 w-9 p-0"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Overlay Opacity Control */}
              {showFields && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      {text.opacity}:
                    </span>
                    <Slider
                      value={[overlayOpacity]}
                      onValueChange={(value) => setOverlayOpacity(value[0])}
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-sm font-bold text-gray-900 w-12">
                      {overlayOpacity}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Field Cards - Simplified for Satellite View */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fields.map((field, index) => {
            const statusStyle = statusColors[field.status];
            const isSelected = selectedField === field.id;
            
            return (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedField(field.id)}
              >
                <Card 
                  className={`border-2 ${isSelected ? 'border-[#2E7D32] ring-2 ring-[#2E7D32] ring-offset-2' : 'border-gray-200'} hover:shadow-xl transition-all cursor-pointer`}
                >
                  <div className="h-1.5" style={{ backgroundColor: showNDVI ? getNDVIColor(field.ndvi) : field.color }}></div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div 
                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${field.color}30` }}
                      >
                        <MapPin className="h-5 w-5" style={{ color: field.color }} />
                      </div>
                      <Badge className={`${statusStyle.bg} ${statusStyle.text} text-xs`}>
                        <div className={`h-1.5 w-1.5 ${statusStyle.dot} rounded-full mr-1 animate-pulse`}></div>
                        {text.status[field.status]}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{field.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{field.size} {text.acres}</p>
                    {showNDVI && (
                      <div className="flex items-center gap-1.5">
                        <Sprout className="h-3.5 w-3.5 text-gray-600" />
                        <span className="text-xs font-bold" style={{ color: getNDVIColor(field.ndvi) }}>
                          {field.ndvi.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="py-5">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Satellite className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-2 text-base">
                    {language === "en" ? "Satellite Imagery" : "Picha za Satelaiti"}
                  </h4>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    {language === "en"
                      ? "Access high-resolution satellite images updated every 2 weeks. Compare historical imagery to track crop growth and field changes over time."
                      : "Pata picha za satelaiti zenye ubora wa juu zinazosasishwa kila wiki 2. Linganisha picha za zamani kufuatilia ukuaji wa mazao na mabadiliko ya shamba kwa muda."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="py-5">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sprout className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-green-900 mb-2 text-base">
                    {language === "en" ? "NDVI Analysis" : "Uchambuzi wa NDVI"}
                  </h4>
                  <p className="text-sm text-green-700 leading-relaxed">
                    {language === "en"
                      ? "Vegetation health index (NDVI) shows crop vitality. Green = healthy, Yellow = stress, Red = attention needed. Updated with every satellite pass."
                      : "Kiashiria cha afya ya mimea (NDVI) kinaonyesha nguvu ya mazao. Kijani = afya nzuri, Manjano = msongo, Nyekundu = inahitaji angalizo."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

UnifiedFarmMap.displayName = "UnifiedFarmMap";
