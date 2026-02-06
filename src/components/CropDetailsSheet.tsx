import { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "./ui/sheet";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Droplets,
  Sun,
  Bug,
  Leaf,
  Calendar,
  MapPin,
  DollarSign,
  LineChart,
  AlertCircle,
  CheckCircle2,
  Sprout
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface CropPrice {
  crop: string;
  price: number;
  unit: string;
  currency: string;
  market: string;
  date: string;
  change?: number;
}

interface CropAdvice {
  stage: string;
  tasks: string[];
  tips: string[];
  warnings: string[];
  wateringSchedule: string;
  fertilization: string;
  pestControl: string;
  expectedHarvest: string;
}

interface CropDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cropName: string;
  userRegion: string;
  apiBase: string;
  authToken: string;
}

export function CropDetailsSheet({
  isOpen,
  onClose,
  cropName,
  userRegion,
  apiBase,
  authToken,
}: CropDetailsSheetProps) {
  const [loading, setLoading] = useState(true);
  const [cropPrice, setCropPrice] = useState<CropPrice | null>(null);
  const [comparativePrices, setComparativePrices] = useState<Record<string, number>>({});
  const [priceTrends, setPriceTrends] = useState<any[]>([]);
  const [cropAdvice, setCropAdvice] = useState<CropAdvice | null>(null);

  useEffect(() => {
    if (isOpen && cropName) {
      loadCropData();
    }
  }, [isOpen, cropName]);

  const loadCropData = async () => {
    setLoading(true);
    try {
      // Load crop price data
      const priceRes = await fetch(`${apiBase}/crop-price/${userRegion}/${cropName}`, {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      const priceData = await priceRes.json();
      if (priceData.success) {
        setCropPrice(priceData.price);
      }

      // Load comparative prices
      const comparativeRes = await fetch(`${apiBase}/comparative-prices/${cropName}`, {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      const comparativeData = await comparativeRes.json();
      if (comparativeData.success) {
        setComparativePrices(comparativeData.prices);
      }

      // Load price trends
      const trendsRes = await fetch(`${apiBase}/price-trends/${userRegion}/${cropName}`, {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      const trendsData = await trendsRes.json();
      if (trendsData.success) {
        setPriceTrends(trendsData.trends);
      }

      // Load crop-specific advice
      const adviceRes = await fetch(`${apiBase}/crop-advice/${cropName}`, {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      const adviceData = await adviceRes.json();
      if (adviceData.success) {
        setCropAdvice(adviceData.advice);
      }
    } catch (error) {
      console.error("Error loading crop data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getLowestPrice = () => {
    if (Object.keys(comparativePrices).length === 0) return null;
    const entries = Object.entries(comparativePrices);
    return entries.reduce((min, curr) => curr[1] < min[1] ? curr : min);
  };

  const getHighestPrice = () => {
    if (Object.keys(comparativePrices).length === 0) return null;
    const entries = Object.entries(comparativePrices);
    return entries.reduce((max, curr) => curr[1] > max[1] ? curr : max);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-green-600" />
            {cropName}
          </SheetTitle>
          <SheetDescription>
            Comprehensive market data and growing advice for {cropName} in {userRegion}
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="space-y-4 mt-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <Tabs defaultValue="market" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="market">Market Data</TabsTrigger>
              <TabsTrigger value="advice">Growing Advice</TabsTrigger>
            </TabsList>

            {/* Market Data Tab */}
            <TabsContent value="market" className="space-y-4">
              {/* Current Price Card */}
              {cropPrice && (
                <Card className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Current Price in {userRegion}</p>
                      <h3 className="text-2xl font-bold">{formatPrice(cropPrice.price)}</h3>
                      <p className="text-sm text-gray-600 mt-1">per {cropPrice.unit}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {cropPrice.change && cropPrice.change > 0 ? (
                        <>
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <span className="text-green-600 font-medium">+{cropPrice.change}%</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-5 w-5 text-red-600" />
                          <span className="text-red-600 font-medium">{cropPrice.change}%</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{cropPrice.market}</span>
                  </div>
                </Card>
              )}

              {/* Comparative Prices */}
              {Object.keys(comparativePrices).length > 0 && (
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-blue-600" />
                    Regional Price Comparison
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(comparativePrices)
                      .sort(([, a], [, b]) => b - a)
                      .map(([region, price]) => {
                        const isLowest = getLowestPrice()?.[0] === region;
                        const isHighest = getHighestPrice()?.[0] === region;
                        const isCurrent = region === userRegion;
                        
                        return (
                          <div key={region} className="flex items-center justify-between py-2 border-b last:border-b-0">
                            <div className="flex items-center gap-2">
                              <span className={isCurrent ? "font-medium" : ""}>{region}</span>
                              {isLowest && <Badge variant="outline" className="text-green-600 border-green-600">Lowest</Badge>}
                              {isHighest && <Badge variant="outline" className="text-red-600 border-red-600">Highest</Badge>}
                              {isCurrent && <Badge variant="default">Your Region</Badge>}
                            </div>
                            <span className="font-medium">{formatPrice(price)}</span>
                          </div>
                        );
                      })}
                  </div>
                </Card>
              )}

              {/* Price Trends Mini Chart */}
              {priceTrends.length > 0 && (
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    30-Day Price Trend
                  </h4>
                  <div className="text-sm text-gray-600 mb-3">
                    Showing price fluctuations over the last month
                  </div>
                  <div className="flex items-end justify-between h-32 gap-1">
                    {priceTrends.slice(-14).map((trend, index) => {
                      const maxPrice = Math.max(...priceTrends.map(t => t.price));
                      const minPrice = Math.min(...priceTrends.map(t => t.price));
                      const height = ((trend.price - minPrice) / (maxPrice - minPrice)) * 100;
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                            style={{ height: `${height}%`, minHeight: '4px' }}
                            title={`${trend.date}: ${formatPrice(trend.price)}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-gray-500">
                    <span>{priceTrends[priceTrends.length - 14]?.date || 'Start'}</span>
                    <span>{priceTrends[priceTrends.length - 1]?.date || 'Today'}</span>
                  </div>
                </Card>
              )}

              {/* Market Insights */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-900">
                  <DollarSign className="h-4 w-4" />
                  Market Insights
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  {cropPrice?.change && cropPrice.change > 3 && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Prices are trending upward - good time to sell</span>
                    </li>
                  )}
                  {getLowestPrice()?.[0] !== userRegion && getLowestPrice() && (
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Lower prices available in {getLowestPrice()?.[0]} ({formatPrice(getLowestPrice()?.[1] || 0)})</span>
                    </li>
                  )}
                  {getHighestPrice()?.[0] === userRegion && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Your region has the highest prices - excellent selling opportunity!</span>
                    </li>
                  )}
                </ul>
              </Card>
            </TabsContent>

            {/* Growing Advice Tab */}
            <TabsContent value="advice" className="space-y-4">
              {cropAdvice ? (
                <>
                  {/* Current Stage */}
                  <Card className="p-4 bg-green-50 border-green-200">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-900">
                      <Leaf className="h-4 w-4" />
                      Current Growth Stage
                    </h4>
                    <p className="text-green-800">{cropAdvice.stage}</p>
                  </Card>

                  {/* Immediate Tasks */}
                  {cropAdvice.tasks && cropAdvice.tasks.length > 0 && (
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-600" />
                        Tasks This Week
                      </h4>
                      <ul className="space-y-2">
                        {cropAdvice.tasks.map((task, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {/* Growing Tips */}
                  {cropAdvice.tips && cropAdvice.tips.length > 0 && (
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-600" />
                        Growing Tips
                      </h4>
                      <ul className="space-y-2">
                        {cropAdvice.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-yellow-600 flex-shrink-0">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {/* Warnings */}
                  {cropAdvice.warnings && cropAdvice.warnings.length > 0 && (
                    <Card className="p-4 bg-red-50 border-red-200">
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-900">
                        <AlertCircle className="h-4 w-4" />
                        Important Warnings
                      </h4>
                      <ul className="space-y-2">
                        {cropAdvice.warnings.map((warning, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-red-800">
                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {/* Care Schedule */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-900">
                        <Droplets className="h-4 w-4 text-blue-600" />
                        Watering
                      </h4>
                      <p className="text-sm text-gray-700">{cropAdvice.wateringSchedule}</p>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-purple-900">
                        <Sprout className="h-4 w-4 text-purple-600" />
                        Fertilization
                      </h4>
                      <p className="text-sm text-gray-700">{cropAdvice.fertilization}</p>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-orange-900">
                        <Bug className="h-4 w-4 text-orange-600" />
                        Pest Control
                      </h4>
                      <p className="text-sm text-gray-700">{cropAdvice.pestControl}</p>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-900">
                        <Calendar className="h-4 w-4 text-green-600" />
                        Expected Harvest
                      </h4>
                      <p className="text-sm text-gray-700">{cropAdvice.expectedHarvest}</p>
                    </Card>
                  </div>
                </>
              ) : (
                <Card className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    No specific growing advice available for {cropName} at this time.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Try asking our AI chatbot for personalized advice!
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
}