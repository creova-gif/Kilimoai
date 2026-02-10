import { Sun, Droplets, Clock, RefreshCw, Smartphone, Wind } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { motion } from "motion/react";

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  rainfall: number;
  rainfallProb: number;
  windSpeed: number;
  lastUpdated: string;
  location: string;
}

interface Season {
  name: string;
  name_sw: string;
  desc: string;
}

interface Props {
  weatherData: WeatherData | null;
  region?: string;
  language: "en" | "sw";
  currentSeason: Season;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenNativeApp: () => void;
}

export function RealTimeWeatherHero({
  weatherData,
  region,
  language,
  currentSeason,
  isLoading,
  onRefresh,
  onOpenNativeApp
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-green-200 bg-gradient-to-r from-blue-50 via-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-3 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl"
              >
                <Sun className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-4xl font-bold text-gray-900">
                    {weatherData?.temp.toFixed(1) || "25.0"}°C
                  </h2>
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    {language === "sw" ? "Sasa Hivi" : "Live"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {weatherData?.condition || "Sunny"} · {weatherData?.location || region || "Tanzania"}
                </p>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <Droplets className="h-4 w-4" />
                    <span>{language === "sw" ? "Uwezekano" : "Rain"} {weatherData?.rainfallProb || 30}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{language === "sw" ? "Imesasishwa" : "Updated"} {weatherData?.lastUpdated || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-2 border-green-300 hover:bg-green-50"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {language === "sw" ? "Sasisha" : "Refresh"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-2 border-green-300 hover:bg-green-50"
                onClick={onOpenNativeApp}
              >
                <Smartphone className="h-4 w-4" />
                {language === "sw" ? "App ya Simu" : "Phone App"}
              </Button>
            </div>
          </div>

          {/* Quick Weather Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-green-200">
              <p className="text-xs text-gray-600 mb-1">{language === "sw" ? "Unyevu" : "Humidity"}</p>
              <p className="text-lg font-bold text-green-600">{weatherData?.humidity.toFixed(0) || 75}%</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-green-200">
              <p className="text-xs text-gray-600 mb-1">{language === "sw" ? "Upepo" : "Wind"}</p>
              <p className="text-lg font-bold text-green-600">{weatherData?.windSpeed.toFixed(1) || 12.5} km/h</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-green-200">
              <p className="text-xs text-gray-600 mb-1">{language === "sw" ? "Msimu" : "Season"}</p>
              <p className="text-lg font-bold text-green-600">{language === "sw" ? currentSeason.name_sw : currentSeason.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}