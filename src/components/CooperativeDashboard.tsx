import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  Users, 
  TrendingUp, 
  Package,
  Calendar,
  Download,
  Search,
  FileText,
  DollarSign,
  CheckCircle2,
  Clock,
  Truck,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Building2,
  Menu,
  X
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CooperativeDashboardProps {
  cooperativeName: string;
  onLogout: () => void;
}

export function CooperativeDashboard({ 
  cooperativeName,
  onLogout 
}: CooperativeDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  // Mock data
  const coopStats = {
    totalMembers: 347,
    activeMembers: 312,
    totalHarvest: 156.7, // tons
    pendingSales: 23.4, // tons
    completedSales: 133.3, // tons
    totalRevenue: 89450, // USD
    avgPricePerTon: 671, // USD
  };

  // Member records
  const members = [
    { id: 1, name: "John Mwamba", farmSize: 2.5, crops: ["Maize", "Beans"], status: "Active", lastPayment: "2024-01-15", amount: 450 },
    { id: 2, name: "Mary Kinabo", farmSize: 1.8, crops: ["Maize", "Sunflower"], status: "Active", lastPayment: "2024-01-10", amount: 380 },
    { id: 3, name: "Peter Shayo", farmSize: 3.2, crops: ["Maize", "Cassava"], status: "Active", lastPayment: "2024-01-08", amount: 620 },
    { id: 4, name: "Grace Mbwana", farmSize: 1.5, crops: ["Beans", "Vegetables"], status: "Active", lastPayment: "2024-01-05", amount: 290 },
    { id: 5, name: "Joseph Ngowi", farmSize: 2.1, crops: ["Maize", "Beans"], status: "Pending", lastPayment: "2023-12-20", amount: 410 },
  ];

  // Harvest predictions
  const harvestPredictions = [
    { month: "Jan", predicted: 24.5, actual: 23.8 },
    { month: "Feb", predicted: 28.3, actual: 27.1 },
    { month: "Mar", predicted: 32.1, actual: 0 },
    { month: "Apr", predicted: 35.6, actual: 0 },
    { month: "May", predicted: 29.8, actual: 0 },
    { month: "Jun", predicted: 31.2, actual: 0 },
  ];

  // Input distribution records
  const inputDistribution = [
    { item: "Fertilizer (DAP)", distributed: 450, unit: "bags", cost: 15750, status: "Completed" },
    { item: "Improved Seeds", distributed: 230, unit: "kg", cost: 8970, status: "Completed" },
    { item: "Pesticides", distributed: 180, unit: "liters", cost: 6340, status: "In Progress" },
    { item: "Farm Tools", distributed: 45, unit: "sets", cost: 3240, status: "Pending" },
  ];

  // Sales coordination
  const salesRecords = [
    { date: "2024-01-20", crop: "Maize", quantity: 45.2, buyer: "National Milling Corp", price: 680, status: "Completed", revenue: 30736 },
    { date: "2024-01-15", crop: "Beans", quantity: 18.5, buyer: "Export Traders Ltd", price: 850, status: "Completed", revenue: 15725 },
    { date: "2024-01-10", crop: "Sunflower", quantity: 12.8, buyer: "Oil Processing Co", price: 720, status: "Completed", revenue: 9216 },
    { date: "2024-02-05", crop: "Maize", quantity: 38.6, buyer: "Regional Warehouse", price: 695, status: "Pending", revenue: 26827 },
  ];

  // Training sessions
  const trainingSessions = [
    { date: "2024-01-25", topic: "Climate-Smart Agriculture", attendance: 234, trainer: "Extension Officer" },
    { date: "2024-01-18", topic: "Post-Harvest Management", attendance: 189, trainer: "KILIMO Expert" },
    { date: "2024-01-11", topic: "Organic Farming", attendance: 156, trainer: "NGO Partner" },
  ];

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
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold">{cooperativeName}</h1>
              <p className="text-sm text-gray-600">Cooperative Management Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:flex">
              COOPERATIVE
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
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 gap-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="harvest">Harvest</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </header>

      <div className="p-4 lg:p-8">
        {/* Desktop Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden lg:block mb-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="harvest">Harvest</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Members</p>
                      <p className="text-3xl font-bold">{coopStats.totalMembers}</p>
                      <p className="text-sm text-green-600 mt-1">
                        {coopStats.activeMembers} active
                      </p>
                    </div>
                    <Users className="h-10 w-10 text-gray-700" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Harvest</p>
                      <p className="text-3xl font-bold">{coopStats.totalHarvest}t</p>
                      <p className="text-sm text-gray-600 mt-1">
                        This season
                      </p>
                    </div>
                    <Package className="h-10 w-10 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-3xl font-bold">${coopStats.totalRevenue.toLocaleString()}</p>
                      <p className="text-sm text-green-600 mt-1">
                        +18.5% vs last year
                      </p>
                    </div>
                    <DollarSign className="h-10 w-10 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Price/Ton</p>
                      <p className="text-3xl font-bold">${coopStats.avgPricePerTon}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Market rate
                      </p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-gray-700" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Harvest Predictions</CardTitle>
                  <CardDescription>AI-powered yield forecasting</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={harvestPredictions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#2E7D32" 
                        strokeWidth={2}
                        name="Predicted (tons)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#6b7280" 
                        strokeWidth={2}
                        name="Actual (tons)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>Last 4 transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {salesRecords.map((sale, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{sale.crop} - {sale.quantity}t</p>
                          <p className="text-sm text-gray-600">{sale.buyer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${sale.revenue.toLocaleString()}</p>
                          <Badge variant={sale.status === "Completed" ? "default" : "secondary"}>
                            {sale.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Benefits Banner */}
            <Card className="bg-[#2E7D32] text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">Digital Cooperative Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <CheckCircle2 className="h-6 w-6 mb-2" />
                    <p className="font-medium">Digital Records</p>
                    <p className="text-sm text-green-100">All member data, production history & payments in one place</p>
                  </div>
                  <div>
                    <CheckCircle2 className="h-6 w-6 mb-2" />
                    <p className="font-medium">Harvest Coordination</p>
                    <p className="text-sm text-green-100">Predict harvest, organize bulk sales & negotiate better prices</p>
                  </div>
                  <div>
                    <CheckCircle2 className="h-6 w-6 mb-2" />
                    <p className="font-medium">Reduce Paperwork</p>
                    <p className="text-sm text-green-100">Digital attendance, training records & reporting</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Member
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Member Directory</CardTitle>
                <CardDescription>Complete digital records for each farmer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Member Name</th>
                        <th className="text-left p-3">Farm Size</th>
                        <th className="text-left p-3">Crops</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Last Payment</th>
                        <th className="text-left p-3">Amount</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{member.name}</td>
                          <td className="p-3">{member.farmSize} ha</td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              {member.crops.map((crop, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {crop}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                              {member.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm">{member.lastPayment}</td>
                          <td className="p-3 font-medium">${member.amount}</td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Harvest Tab */}
        {activeTab === "harvest" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-2">Expected Harvest</p>
                  <p className="text-3xl font-bold text-green-600">184.5 tons</p>
                  <p className="text-sm text-gray-600 mt-1">Next 3 months</p>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-2">Pending Sales</p>
                  <p className="text-3xl font-bold text-yellow-600">{coopStats.pendingSales} tons</p>
                  <p className="text-sm text-gray-600 mt-1">Ready to sell</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-2">Sold This Year</p>
                  <p className="text-3xl font-bold text-gray-900">{coopStats.completedSales} tons</p>
                  <p className="text-sm text-gray-600 mt-1">To date</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Harvest Calendar & Predictions</CardTitle>
                <CardDescription>AI-powered predictions help organize bulk sales</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={harvestPredictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="predicted" fill="#3b82f6" name="Predicted Harvest (tons)" />
                    <Bar dataKey="actual" fill="#10b981" name="Actual Harvest (tons)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-[#2E7D32] text-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Coordinate Bulk Sales</h3>
                    <p className="text-green-100 mb-4">
                      Know exactly how many tons members will harvest. Organize collective sales and negotiate better pricing with buyers.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="gap-2">
                        <Truck className="h-4 w-4" />
                        Find Buyers
                      </Button>
                      <Button variant="secondary" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Sales Coordination</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Record New Sale
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sales History</CardTitle>
                <CardDescription>Track all cooperative sales and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Crop</th>
                        <th className="text-left p-3">Quantity</th>
                        <th className="text-left p-3">Buyer</th>
                        <th className="text-left p-3">Price/Ton</th>
                        <th className="text-left p-3">Revenue</th>
                        <th className="text-left p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesRecords.map((sale, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-3">{sale.date}</td>
                          <td className="p-3 font-medium">{sale.crop}</td>
                          <td className="p-3">{sale.quantity} tons</td>
                          <td className="p-3">{sale.buyer}</td>
                          <td className="p-3">${sale.price}</td>
                          <td className="p-3 font-bold">${sale.revenue.toLocaleString()}</td>
                          <td className="p-3">
                            <Badge variant={sale.status === "Completed" ? "default" : "secondary"}>
                              {sale.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Inputs Tab */}
        {activeTab === "inputs" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Input Distribution</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Record Distribution
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Input Tracking</CardTitle>
                <CardDescription>Digital records of all inputs received and distributed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inputDistribution.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Package className="h-8 w-8 text-gray-700" />
                        <div>
                          <p className="font-medium">{item.item}</p>
                          <p className="text-sm text-gray-600">
                            {item.distributed} {item.unit} distributed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${item.cost.toLocaleString()}</p>
                        <Badge variant={
                          item.status === "Completed" ? "default" :
                          item.status === "In Progress" ? "secondary" : "outline"
                        }>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Training Tab */}
        {activeTab === "training" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Training & Capacity Building</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Schedule Training
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Training Sessions</CardTitle>
                <CardDescription>Digital attendance and training records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingSessions.map((session, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-lg">{session.topic}</p>
                          <p className="text-sm text-gray-600">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            {session.date}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {session.attendance} attended
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>Trainer: {session.trainer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Paperwork Elimination</h3>
                <p className="text-gray-700 mb-4">
                  Everything is digital: attendance tracking, training materials, input distribution records, and automated reporting for stakeholders.
                </p>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Download All Records
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}