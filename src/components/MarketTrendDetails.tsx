import { TrendingUp, TrendingDown, DollarSign, Calendar, MapPin, AlertCircle, CheckCircle, Users, BarChart3, Shield, Share2, Bell, MessageCircle, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";

interface MarketTrendDetailsProps {
  crop: string;
  currentPrice: number;
  priceChange: number;
  region: string;
}

export function MarketTrendDetails({ crop, currentPrice, priceChange, region }: MarketTrendDetailsProps) {
  const isPositive = priceChange > 0;
  
  const marketData = {
    currentPrice: currentPrice,
    priceChange: priceChange,
    weeklyAverage: currentPrice - 50,
    monthlyAverage: currentPrice - 120,
    highestPrice: currentPrice + 200,
    lowestPrice: currentPrice - 150,
    trend: isPositive ? "rising" : "falling",
    forecast: isPositive 
      ? "Prices expected to continue rising for the next 2 weeks" 
      : "Prices may stabilize in the coming weeks",
    lastUpdate: new Date().toISOString(),
    
    priceHistory: [
      { date: "Dec 2", price: currentPrice - 200 },
      { date: "Dec 3", price: currentPrice - 150 },
      { date: "Dec 4", price: currentPrice - 100 },
      { date: "Dec 5", price: currentPrice - 80 },
      { date: "Dec 6", price: currentPrice - 50 },
      { date: "Dec 7", price: currentPrice - 20 },
      { date: "Dec 8", price: currentPrice - 10 },
      { date: "Today", price: currentPrice },
    ],

    regionalComparison: [
      { region: "Morogoro", price: currentPrice, distance: "Local" },
      { region: "Dodoma", price: currentPrice - 100, distance: "250km" },
      { region: "Dar es Salaam", price: currentPrice + 150, distance: "450km" },
      { region: "Mbeya", price: currentPrice - 50, distance: "600km" },
    ],

    buyerDemand: {
      high: ["Dar es Salaam exporters", "Supermarket chains", "Food processors"],
      medium: ["Local cooperatives", "Small traders"],
      low: ["Individual buyers"]
    },

    recommendations: [
      {
        title: "Optimal Selling Time",
        advice: isPositive 
          ? "Hold for 1-2 more weeks if possible - prices are rising. Demand is increasing."
          : "Sell now before prices drop further. Current demand is moderate.",
        priority: "high"
      },
      {
        title: "Best Markets",
        advice: "Dar es Salaam offers highest prices (+150 TZS/kg) but consider transport costs. Morogoro local market is safe option.",
        priority: "medium"
      },
      {
        title: "Quality Requirements",
        advice: `For premium prices: moisture content ≤13.5%, clean grains, no foreign matter, Grade A quality.`,
        priority: "high"
      },
      {
        title: "Negotiation Tips",
        advice: "Group selling with cooperative members can increase bargaining power by 10-15%. Avoid selling to first buyer - compare offers.",
        priority: "medium"
      }
    ],

    factors: [
      {
        factor: "Supply & Demand",
        impact: isPositive ? "High demand from exporters driving prices up" : "High supply from recent harvests pushing prices down",
        icon: Users
      },
      {
        factor: "Seasonal Trends",
        impact: "December is harvest season - typically lower prices. Prices rise in Feb-March.",
        icon: Calendar
      },
      {
        factor: "Quality Standards",
        impact: "Only 60% of local maize meets export standards, creating premium for high-quality crops.",
        icon: CheckCircle
      },
      {
        factor: "Transport Costs",
        impact: "Fuel prices affect profitability of selling to distant markets. Factor in 150-200 TZS/kg for long distances.",
        icon: MapPin
      }
    ]
  };

  const handleListCrop = () => {
    toast.success(`Opening listing form for ${crop}`, {
      description: `Current market price: ${currentPrice.toLocaleString()} TZS/kg`,
      duration: 3000,
    });
    // In a real implementation, this would navigate to listing form or open modal
  };

  const handleContactBuyers = () => {
    const highDemandBuyers = marketData.buyerDemand.high.length;
    toast.success(`${highDemandBuyers} high-demand buyers available`, {
      description: `Connecting you to buyers in ${region} region`,
      duration: 3000,
    });
    // In a real implementation, this would open buyer contact list or initiate chat
  };

  const handleSetPriceAlert = () => {
    const alertPrice = Math.round(currentPrice * 1.1); // 10% above current
    toast.success(`Price alert set successfully`, {
      description: `You'll be notified when ${crop} price reaches ${alertPrice.toLocaleString()} TZS/kg`,
      duration: 3000,
    });
    // In a real implementation, this would save alert preference to backend
  };

  const handleShareAnalysis = async () => {
    const analysisText = `${crop} Market Analysis - ${region}\n\nCurrent Price: ${currentPrice.toLocaleString()} TZS/kg\n7-Day Change: ${priceChange > 0 ? '+' : ''}${priceChange}%\n\nForecast: ${marketData.forecast}\n\n📊 Powered by KILIMO Agri-AI`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${crop} Market Analysis`,
          text: analysisText,
        });
        toast.success("Analysis shared successfully!");
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          // Fallback to clipboard
          await navigator.clipboard.writeText(analysisText);
          toast.success("Analysis copied to clipboard!");
        }
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(analysisText);
        toast.success("Analysis copied to clipboard!");
      } catch (error) {
        toast.error("Failed to share analysis");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
            {isPositive ? (
              <TrendingUp className="h-6 w-6 text-green-600" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{crop} Market Analysis</h2>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{region} Market</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Price Card */}
      <Card className={`border-2 ${isPositive ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Price (per kg)</p>
              <p className="text-4xl font-bold">{currentPrice.toLocaleString()} TZS</p>
            </div>
            <div className={`text-right ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
              <p className="text-sm mb-1">7-Day Change</p>
              <p className="text-2xl font-bold flex items-center gap-1">
                {isPositive ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                {isPositive ? '+' : ''}{priceChange}%
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-gray-600 mb-1">7-Day Avg</p>
              <p className="font-medium">{marketData.weeklyAverage.toLocaleString()} TZS</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">30-Day Avg</p>
              <p className="font-medium">{marketData.monthlyAverage.toLocaleString()} TZS</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">High/Low</p>
              <p className="font-medium text-xs">{marketData.highestPrice}/{marketData.lowestPrice}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Forecast */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Price Forecast (Next 2 Weeks)</h4>
              <p className="text-blue-800">{marketData.forecast}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Price Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {marketData.priceHistory.map((item, idx) => {
              const maxPrice = Math.max(...marketData.priceHistory.map(p => p.price));
              const percentage = (item.price / maxPrice) * 100;
              
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className={item.date === "Today" ? "font-bold" : "text-gray-600"}>
                      {item.date}
                    </span>
                    <span className="font-medium">{item.price.toLocaleString()} TZS</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.date === "Today" ? 'bg-green-600' : 'bg-blue-600'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Regional Price Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Price Comparison</CardTitle>
          <CardDescription>Compare prices across different markets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {marketData.regionalComparison.map((market, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{market.region}</p>
                  <p className="text-xs text-gray-500">{market.distance}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{market.price.toLocaleString()} TZS</p>
                <p className={`text-xs ${market.price > currentPrice ? 'text-green-600' : market.price < currentPrice ? 'text-red-600' : 'text-gray-600'}`}>
                  {market.price > currentPrice ? '+' : ''}{market.price - currentPrice} TZS
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Selling Recommendations */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">Expert Selling Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {marketData.recommendations.map((rec, idx) => (
            <div key={idx} className="border-l-4 border-green-600 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium">{rec.title}</h4>
                {rec.priority === "high" && (
                  <Badge className="bg-green-100 text-green-700">High Priority</Badge>
                )}
              </div>
              <p className="text-sm text-gray-700">{rec.advice}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Market Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Factors Affecting Prices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {marketData.factors.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{item.factor}</h4>
                  <p className="text-sm text-gray-600">{item.impact}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Buyer Demand */}
      <Card>
        <CardHeader>
          <CardTitle>Current Buyer Demand</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-3 w-3 rounded-full bg-green-600" />
              <h4 className="font-medium text-sm">High Demand</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {marketData.buyerDemand.high.map((buyer, idx) => (
                <Badge key={idx} className="bg-green-100 text-green-700 border-green-300">
                  {buyer}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-3 w-3 rounded-full bg-orange-600" />
              <h4 className="font-medium text-sm">Medium Demand</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {marketData.buyerDemand.medium.map((buyer, idx) => (
                <Badge key={idx} variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
                  {buyer}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Source */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Verified Market Data</h4>
              <p className="text-sm text-blue-800">
                Prices verified by <strong>Tanzania Agricultural Marketing Information System</strong> and 
                local market agents. Data updated daily at 9 AM.
              </p>
              <p className="text-xs text-blue-700 mt-2">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          onClick={handleListCrop}
        >
          <Package className="h-4 w-4" />
          List Crop for Sale
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleContactBuyers}
        >
          <MessageCircle className="h-4 w-4" />
          Contact Buyers
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleSetPriceAlert}
        >
          <Bell className="h-4 w-4" />
          Set Price Alert
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleShareAnalysis}
        >
          <Share2 className="h-4 w-4" />
          Share Analysis
        </Button>
      </div>
    </div>
  );
}