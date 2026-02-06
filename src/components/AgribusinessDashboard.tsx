import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { 
  TrendingUp, 
  MapPin,
  Calendar,
  Download,
  Search,
  Package,
  Truck,
  MessageSquare,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Users,
  Sprout,
  BarChart3,
  Globe,
  DollarSign,
  Target,
  Activity,
  Send,
  Factory,
  Shield,
  Zap,
  Clock,
  Award,
  Menu,
  X,
  Filter,
  Map
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell
} from "recharts";

interface AgribusinessDashboardProps {
  companyName: string;
  onLogout: () => void;
}

export function AgribusinessDashboard({ 
  companyName,
  onLogout 
}: AgribusinessDashboardProps) {
  const [activeTab, setActiveTab] = useState("supply-forecast");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCrop, setSelectedCrop] = useState("maize");
  const [showMenu, setShowMenu] = useState(false);

  // Supply Forecasting Data
  const supplyForecast = [
    { month: "Feb", predicted: 245, actual: 238, historical: 220 },
    { month: "Mar", predicted: 289, actual: 0, historical: 265 },
    { month: "Apr", predicted: 356, actual: 0, historical: 290 },
    { month: "May", predicted: 412, actual: 0, historical: 380 },
    { month: "Jun", predicted: 387, actual: 0, historical: 355 },
    { month: "Jul", predicted: 423, actual: 0, historical: 390 },
  ];

  const regionalSupply = [
    { region: "Arusha", farmers: 2341, expectedYield: 5678, harvestDate: "Mar 15", quality: "High", distance: 245 },
    { region: "Mwanza", farmers: 1987, expectedYield: 4523, harvestDate: "Mar 22", quality: "High", distance: 387 },
    { region: "Kilimanjaro", farmers: 1654, expectedYield: 4234, harvestDate: "Mar 18", quality: "Medium", distance: 198 },
    { region: "Morogoro", farmers: 1432, expectedYield: 3456, harvestDate: "Apr 05", quality: "High", distance: 156 },
    { region: "Dodoma", farmers: 1289, expectedYield: 2987, harvestDate: "Apr 10", quality: "Medium", distance: 289 },
    { region: "Mbeya", farmers: 1156, expectedYield: 2756, harvestDate: "Mar 28", quality: "High", distance: 423 },
  ];

  // Contract Farming Data
  const contractFarmers = [
    { id: 1, name: "John Mwamba", contract: "Season 2024A", inputs: 1200, expectedYield: 12.5, repayment: 850, status: "Active", risk: "Low" },
    { id: 2, name: "Mary Kinabo", contract: "Season 2024A", inputs: 980, expectedYield: 9.8, repayment: 720, status: "Active", risk: "Low" },
    { id: 3, name: "Peter Shayo", contract: "Season 2024A", inputs: 1450, expectedYield: 15.2, repayment: 980, status: "Active", risk: "Medium" },
    { id: 4, name: "Grace Mbwana", contract: "Season 2024A", inputs: 780, expectedYield: 7.5, repayment: 520, status: "Active", risk: "Low" },
    { id: 5, name: "Joseph Ngowi", contract: "Season 2024A", inputs: 1100, expectedYield: 11.0, repayment: 450, status: "Delayed", risk: "High" },
  ];

  // Input Distribution Data
  const inputDistribution = [
    { product: "Hybrid Seeds (H614)", distributed: 12450, unit: "kg", regions: 8, revenue: 87150, verified: 98.5 },
    { product: "DAP Fertilizer", distributed: 34200, unit: "bags", regions: 12, revenue: 239400, verified: 97.2 },
    { product: "Pesticides (Malathion)", distributed: 8900, unit: "liters", regions: 10, revenue: 156100, verified: 99.1 },
    { product: "Growth Hormones", distributed: 2340, unit: "bottles", regions: 6, revenue: 46800, verified: 100 },
  ];

  // Farmer Communication Stats
  const communicationStats = {
    totalFarmers: 12847,
    reachedToday: 8934,
    smsDelivered: 7823,
    appNotifications: 6234,
    voiceCalls: 1567,
    responseRate: 68.5,
  };

  // Quality Control Data
  const qualityMetrics = [
    { metric: "Disease-Free Crops", current: 94.2, target: 95, trend: "up" },
    { metric: "Grade A Quality", current: 78.5, target: 80, trend: "up" },
    { metric: "Moisture Content", current: 13.2, target: 13, trend: "stable" },
    { metric: "Contamination Rate", current: 1.8, target: 2, trend: "down" },
  ];

  // Logistics Data
  const logisticsRoutes = [
    { route: "Northern Corridor", farms: 23, distance: 234, cost: 1250, efficiency: 92 },
    { route: "Central Hub", farms: 18, distance: 189, cost: 980, efficiency: 88 },
    { route: "Southern Circuit", farms: 31, distance: 312, cost: 1680, efficiency: 85 },
    { route: "Lake Zone", farms: 27, distance: 267, cost: 1420, efficiency: 90 },
  ];

  // Climate Risk Alerts
  const climateRisks = [
    { region: "Dodoma", risk: "High", issue: "Drought", farmers: 1289, impact: "Critical", action: "Adjust buying price" },
    { region: "Morogoro", risk: "Medium", issue: "Heavy Rains", farmers: 1432, impact: "Moderate", action: "Delay collection" },
    { region: "Mwanza", risk: "Low", issue: "Pest Pressure", farmers: 1987, impact: "Minor", action: "Monitor closely" },
  ];

  // Traceability Stats
  const traceabilityData = {
    certifiedFarmers: 8234,
    organicCertified: 2345,
    geoTaggedFarms: 11234,
    batchesTracked: 4567,
    exportReady: 6789,
    complianceRate: 94.8,
  };

  const renderKPICard = (
    title: string, 
    value: string | number, 
    change: number, 
    icon: any, 
    description: string
  ) => {
    const Icon = icon;
    const isPositive = change >= 0;
    
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
              <div className="flex items-center gap-1 text-sm">
                <span className={isPositive ? "text-green-600" : "text-red-600"}>
                  {isPositive ? "↑" : "↓"} {Math.abs(change)}%
                </span>
                <span className="text-gray-500 ml-1">{description}</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Icon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Factory className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold">KILIMO Agribusiness Portal</h1>
              <p className="text-sm text-gray-600">{companyName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:flex">
              AGRIBUSINESS
            </Badge>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="text-sm"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {showMenu && (
          <div className="lg:hidden border-t bg-white p-4">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={activeTab === "supply-forecast" ? "default" : "outline"} 
                onClick={() => { setActiveTab("supply-forecast"); setShowMenu(false); }}
                className="text-xs"
              >
                Supply
              </Button>
              <Button 
                variant={activeTab === "farmer-map" ? "default" : "outline"} 
                onClick={() => { setActiveTab("farmer-map"); setShowMenu(false); }}
                className="text-xs"
              >
                Mapping
              </Button>
              <Button 
                variant={activeTab === "communication" ? "default" : "outline"} 
                onClick={() => { setActiveTab("communication"); setShowMenu(false); }}
                className="text-xs"
              >
                Comms
              </Button>
              <Button 
                variant={activeTab === "contracts" ? "default" : "outline"} 
                onClick={() => { setActiveTab("contracts"); setShowMenu(false); }}
                className="text-xs"
              >
                Contracts
              </Button>
            </div>
          </div>
        )}
      </header>

      <div className="p-4 lg:p-8">
        {/* Desktop Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden lg:block mb-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="supply-forecast">Supply Forecast</TabsTrigger>
            <TabsTrigger value="farmer-map">Farmer Mapping</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="contracts">Contract Farming</TabsTrigger>
            <TabsTrigger value="quality">Quality Control</TabsTrigger>
            <TabsTrigger value="logistics">Logistics</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select Crop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maize">Maize</SelectItem>
              <SelectItem value="beans">Beans</SelectItem>
              <SelectItem value="rice">Rice</SelectItem>
              <SelectItem value="coffee">Coffee</SelectItem>
              <SelectItem value="cashews">Cashews</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="arusha">Arusha</SelectItem>
              <SelectItem value="mwanza">Mwanza</SelectItem>
              <SelectItem value="dodoma">Dodoma</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>

        {/* Supply Forecast Tab */}
        {activeTab === "supply-forecast" && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">Guaranteed Supply Forecasting</h3>
                <p className="text-orange-100 mb-4">
                  AI-powered predictions BEFORE harvest happens. Plan factory capacity, prepare containers, and negotiate contracts in advance.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-3xl font-bold">412 tons</p>
                    <p className="text-sm text-orange-100">Expected May</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">8,234</p>
                    <p className="text-sm text-orange-100">Active Farmers</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">98.2%</p>
                    <p className="text-sm text-orange-100">Forecast Accuracy</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">23 days</p>
                    <p className="text-sm text-orange-100">Next Harvest</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKPICard(
                "Total Supply Pipeline",
                "23,634 tons",
                12.5,
                Package,
                "next 6 months"
              )}
              {renderKPICard(
                "Active Suppliers",
                "12,847",
                8.3,
                Users,
                "registered farmers"
              )}
              {renderKPICard(
                "Avg Quality Score",
                "87.5%",
                5.2,
                Award,
                "Grade A+"
              )}
              {renderKPICard(
                "Supply Certainty",
                "94.8%",
                3.1,
                Target,
                "reliability"
              )}
            </div>

            {/* Supply Forecast Chart */}
            <Card>
              <CardHeader>
                <CardTitle>6-Month Supply Forecast vs Historical</CardTitle>
                <CardDescription>AI predictions enable proactive planning for procurement and processing</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={supplyForecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="historical" 
                      stackId="1"
                      stroke="#9ca3af" 
                      fill="#d1d5db" 
                      name="Historical"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="actual" 
                      stackId="2"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                      name="Actual"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="predicted" 
                      stackId="3"
                      stroke="#f97316" 
                      fill="#f97316" 
                      fillOpacity={0.4}
                      name="AI Predicted"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Regional Supply Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Supply by Harvest Date</CardTitle>
                <CardDescription>Plan collection logistics and storage capacity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Region</th>
                        <th className="text-left p-3">Farmers</th>
                        <th className="text-left p-3">Expected Yield</th>
                        <th className="text-left p-3">Harvest Date</th>
                        <th className="text-left p-3">Quality</th>
                        <th className="text-left p-3">Distance (km)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regionalSupply.map((supply, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{supply.region}</td>
                          <td className="p-3">{supply.farmers.toLocaleString()}</td>
                          <td className="p-3 font-bold">{supply.expectedYield.toLocaleString()} tons</td>
                          <td className="p-3">{supply.harvestDate}</td>
                          <td className="p-3">
                            <Badge variant={supply.quality === "High" ? "default" : "secondary"}>
                              {supply.quality}
                            </Badge>
                          </td>
                          <td className="p-3">{supply.distance} km</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Farmer Mapping Tab */}
        {activeTab === "farmer-map" && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">Real-Time Farmer Mapping</h3>
                <p className="text-blue-100 mb-4">
                  See where every farmer is located, farm size, crop history, disease zones, and delivery distance for logistics optimization.
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" className="gap-2">
                    <Map className="h-4 w-4" />
                    View Interactive Map
                  </Button>
                  <Button variant="secondary" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter by Crop
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Mapped Farms</p>
                      <p className="text-2xl font-bold">11,234</p>
                    </div>
                  </div>
                  <Progress value={87.5} className="h-2" />
                  <p className="text-xs text-gray-600 mt-2">87.5% geo-tagged</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Avg Distance</p>
                      <p className="text-2xl font-bold">187 km</p>
                    </div>
                  </div>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-gray-600 mt-2">Within optimal range</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Truck className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Collection Points</p>
                      <p className="text-2xl font-bold">23</p>
                    </div>
                  </div>
                  <Progress value={92} className="h-2" />
                  <p className="text-xs text-gray-600 mt-2">Optimized routes</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Logistics Route Optimization</CardTitle>
                <CardDescription>Reduce collection costs by 20-35% with optimized routing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logisticsRoutes.map((route, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold text-lg">{route.route}</p>
                          <p className="text-sm text-gray-600">
                            {route.farms} farms • {route.distance} km • ${route.cost.toLocaleString()} cost
                          </p>
                        </div>
                        <Badge variant={route.efficiency >= 90 ? "default" : "secondary"}>
                          {route.efficiency}% efficient
                        </Badge>
                      </div>
                      <Progress value={route.efficiency} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Fuel Cost Savings</h3>
                  <p className="text-gray-700 mb-4">
                    Optimized routes save 20-35% on fuel costs. Plan transport routes, reduce delivery distance, and optimize collection centers.
                  </p>
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span className="font-bold text-green-600">$12,450 saved this month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">Disease Risk Zones</h3>
                  <p className="text-gray-700 mb-4">
                    Identify disease-prone areas to adjust quality expectations and buying strategies.
                  </p>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-purple-600" />
                    <span className="font-bold text-purple-600">3 high-risk zones identified</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Communication Tab */}
        {activeTab === "communication" && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">Direct Farmer Communication</h3>
                <p className="text-green-100 mb-4">
                  Instantly reach farmers via SMS, App, USSD, WhatsApp, or AI voice calls. Saves 40-60% on extension costs.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-2xl font-bold">{communicationStats.totalFarmers.toLocaleString()}</p>
                    <p className="text-sm text-green-100">Total Farmers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{communicationStats.reachedToday.toLocaleString()}</p>
                    <p className="text-sm text-green-100">Reached Today</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{communicationStats.smsDelivered.toLocaleString()}</p>
                    <p className="text-sm text-green-100">SMS Delivered</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{communicationStats.appNotifications.toLocaleString()}</p>
                    <p className="text-sm text-green-100">App Notifications</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{communicationStats.responseRate}%</p>
                    <p className="text-sm text-green-100">Response Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Send Bulk Message</CardTitle>
                  <CardDescription>Reach farmers instantly via multiple channels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="price">Buying Price Update</SelectItem>
                          <SelectItem value="training">Training Invitation</SelectItem>
                          <SelectItem value="contract">Contract Terms</SelectItem>
                          <SelectItem value="offer">Special Offer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Target Farmers</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Farmers ({communicationStats.totalFarmers.toLocaleString()})</SelectItem>
                          <SelectItem value="maize">Maize Growers (8,234)</SelectItem>
                          <SelectItem value="region">Specific Region</SelectItem>
                          <SelectItem value="contract">Contract Farmers Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Message</label>
                      <textarea 
                        className="w-full border rounded-lg p-3 min-h-32"
                        placeholder="Enter your message..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 gap-2">
                        <Send className="h-4 w-4" />
                        Send via SMS
                      </Button>
                      <Button variant="outline" className="flex-1 gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Send via App
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Communications</CardTitle>
                  <CardDescription>Message history and engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium">New Maize Buying Price: TZS 850/kg</p>
                        <Badge>SMS</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Sent to 8,234 farmers • 92% delivered • 68% read
                      </p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium">Training: Post-Harvest Management</p>
                        <Badge variant="secondary">App</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Sent to 3,456 farmers • 1,234 confirmed attendance
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium">Contract Renewal Reminder</p>
                        <Badge variant="outline">Voice</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Called 234 farmers • 187 answered • 156 committed
                      </p>
                      <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Cost Savings: 40-60%</h3>
                <p className="text-gray-700">
                  Instead of sending field officers to villages (expensive), reach thousands of farmers instantly via digital channels. Saves time and reduces extension costs significantly.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contract Farming Tab */}
        {activeTab === "contracts" && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">Contract Farming Management</h3>
                <p className="text-purple-100 mb-4">
                  Digitally manage inputs, track repayments, monitor compliance, and predict default risk. Increases contract success rates.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-2xl font-bold">2,456</p>
                    <p className="text-sm text-purple-100">Active Contracts</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">$234K</p>
                    <p className="text-sm text-purple-100">Inputs Issued</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">89.5%</p>
                    <p className="text-sm text-purple-100">Repayment Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">94.2%</p>
                    <p className="text-sm text-purple-100">Compliance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contract Farmer Dashboard</CardTitle>
                <CardDescription>Monitor repayment risk and contract compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Farmer</th>
                        <th className="text-left p-3">Contract</th>
                        <th className="text-left p-3">Inputs ($)</th>
                        <th className="text-left p-3">Expected Yield</th>
                        <th className="text-left p-3">Repayment ($)</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contractFarmers.map((farmer) => (
                        <tr key={farmer.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{farmer.name}</td>
                          <td className="p-3">{farmer.contract}</td>
                          <td className="p-3">${farmer.inputs}</td>
                          <td className="p-3">{farmer.expectedYield} tons</td>
                          <td className="p-3">${farmer.repayment}</td>
                          <td className="p-3">
                            <Badge variant={farmer.status === "Active" ? "default" : "destructive"}>
                              {farmer.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant={
                              farmer.risk === "Low" ? "default" : 
                              farmer.risk === "Medium" ? "secondary" : "destructive"
                            }>
                              {farmer.risk}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Low Risk</h3>
                  <p className="text-3xl font-bold text-green-600 mb-2">2,123</p>
                  <p className="text-sm text-gray-600">farmers (86.4%)</p>
                  <p className="text-xs text-gray-500 mt-2">Expected full repayment</p>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-6">
                  <Clock className="h-8 w-8 text-yellow-600 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Medium Risk</h3>
                  <p className="text-3xl font-bold text-yellow-600 mb-2">267</p>
                  <p className="text-sm text-gray-600">farmers (10.9%)</p>
                  <p className="text-xs text-gray-500 mt-2">Monitor closely</p>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6">
                  <AlertTriangle className="h-8 w-8 text-red-600 mb-3" />
                  <h3 className="font-bold text-lg mb-2">High Risk</h3>
                  <p className="text-3xl font-bold text-red-600 mb-2">66</p>
                  <p className="text-sm text-gray-600">farmers (2.7%)</p>
                  <p className="text-xs text-gray-500 mt-2">Intervention needed</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Quality Control Tab */}
        {activeTab === "quality" && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">Quality Control & Consistency</h3>
                <p className="text-blue-100 mb-4">
                  AI crop disease detection, soil quality estimation, and grading tools ensure higher-quality produce with fewer rejects.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-2xl font-bold">94.2%</p>
                    <p className="text-sm text-blue-100">Disease-Free</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">78.5%</p>
                    <p className="text-sm text-blue-100">Grade A Quality</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1.8%</p>
                    <p className="text-sm text-blue-100">Rejection Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">13.2%</p>
                    <p className="text-sm text-blue-100">Avg Moisture</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics Dashboard</CardTitle>
                <CardDescription>Real-time quality monitoring across all supply sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {qualityMetrics.map((metric, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{metric.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${
                            metric.trend === "up" ? "text-green-600" : 
                            metric.trend === "down" ? "text-red-600" : "text-gray-600"
                          }`}>
                            {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"}
                          </span>
                          <span className="font-bold">{metric.current}%</span>
                          <span className="text-sm text-gray-500">/ {metric.target}%</span>
                        </div>
                      </div>
                      <Progress value={(metric.current / metric.target) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Disease Detection</CardTitle>
                  <CardDescription>Early detection prevents crop losses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <p className="font-medium">Healthy Crops</p>
                        <p className="text-sm text-gray-600">11,234 farms scanned</p>
                      </div>
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div>
                        <p className="font-medium">Early Warning</p>
                        <p className="text-sm text-gray-600">234 farms flagged</p>
                      </div>
                      <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div>
                        <p className="font-medium">Treatment Needed</p>
                        <p className="text-sm text-gray-600">45 farms urgent</p>
                      </div>
                      <Activity className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Input Distribution Verification</CardTitle>
                  <CardDescription>Track genuine products and prevent fraud</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {inputDistribution.slice(0, 3).map((input, idx) => (
                      <div key={idx} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{input.product}</p>
                          <Badge variant="default">{input.verified}% verified</Badge>
                        </div>
                        <Progress value={input.verified} className="h-2 mb-2" />
                        <p className="text-sm text-gray-600">
                          {input.distributed.toLocaleString()} {input.unit} • ${input.revenue.toLocaleString()} revenue
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Logistics Tab */}
        {activeTab === "logistics" && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">Logistics & Supply Chain Optimization</h3>
                <p className="text-orange-100 mb-4">
                  Climate risk alerts, route optimization, and traceability for export markets. Protects business from climate shocks.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-2xl font-bold">23</p>
                    <p className="text-sm text-orange-100">Collection Points</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">$12.5K</p>
                    <p className="text-sm text-orange-100">Monthly Savings</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">94.8%</p>
                    <p className="text-sm text-orange-100">Compliance Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">6,789</p>
                    <p className="text-sm text-orange-100">Export Ready</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Climate Risk Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Climate Risk Alerts</CardTitle>
                <CardDescription>Adjust buying strategies and protect from climate shocks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {climateRisks.map((risk, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`h-6 w-6 ${
                          risk.risk === "High" ? "text-red-600" : 
                          risk.risk === "Medium" ? "text-yellow-600" : "text-green-600"
                        }`} />
                        <div>
                          <p className="font-medium">{risk.region} - {risk.issue}</p>
                          <p className="text-sm text-gray-600">
                            {risk.farmers.toLocaleString()} farmers affected • {risk.impact} impact
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          risk.risk === "High" ? "destructive" : 
                          risk.risk === "Medium" ? "secondary" : "default"
                        }>
                          {risk.risk} Risk
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{risk.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Traceability */}
            <Card>
              <CardHeader>
                <CardTitle>Supply Chain Traceability</CardTitle>
                <CardDescription>Meet EU regulations and access high-value export markets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Globe className="h-6 w-6 text-blue-600 mb-2" />
                    <p className="text-2xl font-bold">{traceabilityData.geoTaggedFarms.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Geo-tagged Farms</p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Shield className="h-6 w-6 text-green-600 mb-2" />
                    <p className="text-2xl font-bold">{traceabilityData.certifiedFarmers.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Certified Farmers</p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600 mb-2" />
                    <p className="text-2xl font-bold">{traceabilityData.organicCertified.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Organic Certified</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg">
                  <h4 className="font-bold mb-2">Export Market Ready</h4>
                  <p className="text-sm text-green-100 mb-3">
                    Full farm-to-market traceability enables access to high-value international markets and compliance with:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">EU Deforestation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">Organic Certification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">GLOBALG.A.P.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">Food Safety Standards</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Data Sharing */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <DollarSign className="h-8 w-8 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Partner with Financial Institutions</h3>
                    <p className="text-gray-700 mb-3">
                      Share farmer yield records, contract agreements, and farm performance data with banks. They use this to finance working capital, out-grower schemes, and input loans.
                    </p>
                    <p className="font-medium text-yellow-700">
                      → Scale sourcing without using your own money
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
