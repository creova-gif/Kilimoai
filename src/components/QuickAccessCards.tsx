import { Card, CardContent } from "./ui/card";
import { 
  Lightbulb, 
  Cloud, 
  TrendingUp, 
  Leaf,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { motion } from "motion/react";

interface QuickAccessCardsProps {
  todayTip: string;
  weatherAlert: {
    condition: string;
    severity: "low" | "medium" | "high";
  };
  marketTrend: {
    crop: string;
    price: number;
    change: number;
  };
  cropHealth: "healthy" | "warning" | "critical";
  onTipClick: () => void;
  onWeatherClick: () => void;
  onMarketClick: () => void;
  onHealthClick: () => void;
}

export function QuickAccessCards({
  todayTip,
  weatherAlert,
  marketTrend,
  cropHealth,
  onTipClick,
  onWeatherClick,
  onMarketClick,
  onHealthClick,
}: QuickAccessCardsProps) {
  const getHealthStatus = () => {
    switch (cropHealth) {
      case "healthy":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-200",
          label: "Excellent Health",
          message: "Your crops are thriving!"
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          label: "Needs Attention",
          message: "Monitor for pests"
        };
      case "critical":
        return {
          icon: AlertTriangle,
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          label: "Critical",
          message: "Immediate action required"
        };
    }
  };

  const healthStatus = getHealthStatus();
  const HealthIcon = healthStatus.icon;

  const getWeatherSeverityColor = () => {
    switch (weatherAlert.severity) {
      case "high":
        return { bg: "bg-red-50", border: "border-red-200", text: "text-red-600" };
      case "medium":
        return { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-600" };
      default:
        return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600" };
    }
  };

  const weatherColors = getWeatherSeverityColor();

  return (
    <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Today's Farming Tip */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card 
          className="border-2 border-purple-200 bg-purple-50 cursor-pointer hover:shadow-lg transition-all group"
          onClick={onTipClick}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <ChevronRight className="h-5 w-5 text-purple-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-sm mb-2 text-purple-900">Today's Tip</h3>
            <p className="text-xs text-purple-700 line-clamp-2 leading-relaxed">
              {todayTip}
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs text-purple-600 font-medium">
              <Lightbulb className="h-3 w-3" />
              <span>Tap to learn more</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weather Alert */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card 
          className={`border-2 ${weatherColors.border} ${weatherColors.bg} cursor-pointer hover:shadow-lg transition-all group`}
          onClick={onWeatherClick}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 ${weatherColors.bg} rounded-lg group-hover:opacity-80 transition-opacity`}>
                <Cloud className={`h-5 w-5 ${weatherColors.text}`} />
              </div>
              <ChevronRight className={`h-5 w-5 ${weatherColors.text} opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
            </div>
            <h3 className={`font-bold text-sm mb-2 ${weatherColors.text}`}>Weather Alert</h3>
            <p className={`text-xs ${weatherColors.text} opacity-90 line-clamp-2 leading-relaxed`}>
              {weatherAlert.condition}
            </p>
            <div className={`mt-3 flex items-center gap-1 text-xs ${weatherColors.text} font-medium`}>
              <Cloud className="h-3 w-3" />
              <span>View 7-day forecast</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Market Trend */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card 
          className="border-2 border-green-200 bg-green-50 cursor-pointer hover:shadow-lg transition-all group"
          onClick={onMarketClick}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <ChevronRight className="h-5 w-5 text-green-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-sm mb-2 text-green-900">Market Price</h3>
            <div className="mb-1">
              <p className="text-xs text-green-700 font-medium">{marketTrend.crop}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-lg font-bold text-green-600">
                  TZS {marketTrend.price.toLocaleString()}
                </p>
                <span className={`text-xs font-medium ${
                  marketTrend.change >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {marketTrend.change >= 0 ? "↑" : "↓"} {Math.abs(marketTrend.change)}%
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-green-600 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>View price trends</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Crop Health */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card 
          className={`border-2 ${healthStatus.border} ${healthStatus.bg} cursor-pointer hover:shadow-lg transition-all group`}
          onClick={onHealthClick}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 ${healthStatus.bg} rounded-lg group-hover:opacity-80 transition-opacity`}>
                <HealthIcon className={`h-5 w-5 ${healthStatus.color}`} />
              </div>
              <ChevronRight className={`h-5 w-5 ${healthStatus.color} opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
            </div>
            <h3 className={`font-bold text-sm mb-2 ${healthStatus.color}`}>Crop Health</h3>
            <p className={`text-xs ${healthStatus.color} font-medium mb-1`}>
              {healthStatus.label}
            </p>
            <p className={`text-xs ${healthStatus.color} opacity-80 line-clamp-1`}>
              {healthStatus.message}
            </p>
            <div className={`mt-3 flex items-center gap-1 text-xs ${healthStatus.color} font-medium`}>
              <Leaf className="h-3 w-3" />
              <span>View full report</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}