import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Users, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Target,
  DollarSign,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  UserX,
  Globe,
  Settings,
  FileText,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Menu,
  X
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

interface OrganizationDashboardProps {
  organizationType: string;
  organizationName: string;
  onLogout: () => void;
}

export function OrganizationDashboard({ 
  organizationType, 
  organizationName,
  onLogout 
}: OrganizationDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [showMenu, setShowMenu] = useState(false);

  // Mock data - would come from backend in production
  const dashboardData = {
    totalFarmers: 12847,
    activeFarmers: 9234,
    femaleHeaded: 5423,
    maleHeaded: 7424,
    youthFarmers: 3821,
    averageYield: 2.4, // tons/hectare
    yieldIncrease: 18.5, // percentage
    incomeIncrease: 23.7, // percentage
    areasServed: 18,
    avgFarmSize: 1.8, // hectares
    cropsDiversified: 4.2, // average crops per farmer
  };

  // Real-time farmer performance data
  const farmerPerformanceData = [
    { month: "Jan", yield: 1.8, income: 450, farmers: 8234 },
    { month: "Feb", yield: 2.0, income: 520, farmers: 8912 },
    { month: "Mar", yield: 2.1, income: 580, farmers: 9456 },
    { month: "Apr", yield: 2.3, income: 620, farmers: 10234 },
    { month: "May", yield: 2.4, income: 680, farmers: 11123 },
    { month: "Jun", yield: 2.4, income: 710, farmers: 12847 },
  ];

  // Gender-disaggregated data
  const genderData = [
    { category: "Female Headed", value: 5423, color: "#ec4899" },
    { category: "Male Headed", value: 7424, color: "#3b82f6" },
  ];

  // Decision making data (for NGO gender impact)
  const decisionMakingData = [
    { category: "Joint Decision", value: 6234, percentage: 48.5 },
    { category: "Women Lead", value: 3891, percentage: 30.3 },
    { category: "Men Lead", value: 2722, percentage: 21.2 },
  ];

  // District-level data
  const districtData = [
    { district: "Arusha", farmers: 2341, yield: 2.6, alerts: 3 },
    { district: "Mwanza", farmers: 1987, yield: 2.3, alerts: 5 },
    { district: "Dodoma", farmers: 1654, yield: 2.1, alerts: 2 },
    { district: "Kilimanjaro", farmers: 1432, yield: 2.8, alerts: 1 },
    { district: "Morogoro", farmers: 1289, yield: 2.0, alerts: 7 },
    { district: "Mbeya", farmers: 1156, yield: 2.4, alerts: 4 },
    { district: "Iringa", farmers: 1034, yield: 2.5, alerts: 2 },
    { district: "Others", farmers: 1954, yield: 2.2, alerts: 6 },
  ];

  // Climate risk alerts
  const climateRiskData = [
    { region: "Mwanza", risk: "High", issue: "Drought", farmers: 1987, severity: "critical" },
    { region: "Morogoro", risk: "High", issue: "Pest Outbreak", farmers: 1289, severity: "critical" },
    { region: "Mbeya", risk: "Medium", issue: "Heavy Rains", farmers: 1156, severity: "warning" },
    { region: "Arusha", risk: "Low", issue: "Moderate Temps", farmers: 2341, severity: "info" },
  ];

  // Income tracking by gender
  const incomeByGenderData = [
    { month: "Jan", female: 420, male: 480 },
    { month: "Feb", female: 490, male: 550 },
    { month: "Mar", female: 560, male: 600 },
    { month: "Apr", female: 610, male: 630 },
    { month: "May", female: 670, male: 690 },
    { month: "Jun", female: 720, male: 700 },
  ];

  // Youth engagement data
  const youthEngagementData = [
    { ageGroup: "18-25", count: 1234, percentage: 32.3 },
    { ageGroup: "26-30", count: 1456, percentage: 38.1 },
    { ageGroup: "31-35", count: 1131, percentage: 29.6 },
  ];

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
                {isPositive ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <span className={isPositive ? "text-green-600" : "text-red-600"}>
                  {Math.abs(change)}%
                </span>
                <span className="text-gray-500 ml-1">{description}</span>
              </div>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Icon className="h-6 w-6 text-gray-600" />
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
            <Building2 className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold">KILIMO Impact Dashboard</h1>
              <p className="text-sm text-gray-600">{organizationName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:flex">
              {organizationType.toUpperCase()}
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
                <TabsTrigger value="impact">Impact</TabsTrigger>
                <TabsTrigger value="gender">Gender</TabsTrigger>
                <TabsTrigger value="districts">Districts</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </header>

      <div className="p-4 lg:p-8">
        {/* Desktop Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden lg:block mb-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="impact">Real-Time Impact</TabsTrigger>
            <TabsTrigger value="gender">Gender Analytics</TabsTrigger>
            <TabsTrigger value="districts">Districts</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
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

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderKPICard(
                "Total Farmers",
                dashboardData.totalFarmers.toLocaleString(),
                12.3,
                Users,
                "vs last month"
              )}
              {renderKPICard(
                "Active Farmers",
                dashboardData.activeFarmers.toLocaleString(),
                8.7,
                UserCheck,
                "engagement rate"
              )}
              {renderKPICard(
                "Avg Yield Increase",
                `${dashboardData.yieldIncrease}%`,
                18.5,
                TrendingUp,
                "above baseline"
              )}
              {renderKPICard(
                "Income Growth",
                `${dashboardData.incomeIncrease}%`,
                23.7,
                DollarSign,
                "household income"
              )}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Farmer Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Farmer Enrollment & Performance</CardTitle>
                  <CardDescription>6-month trend analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={farmerPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="farmers" 
                        stackId="1"
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.6}
                        name="Total Farmers"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gender Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                  <CardDescription>Household leadership breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, value }) => `${category}: ${value.toLocaleString()}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Climate Risk Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Climate Risk Alerts
                </CardTitle>
                <CardDescription>Real-time environmental monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {climateRiskData.map((alert, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.severity === 'critical' ? 'bg-red-600' :
                          alert.severity === 'warning' ? 'bg-orange-600' : 'bg-green-600'
                        }`} />
                        <div>
                          <p className="font-medium">{alert.region} - {alert.issue}</p>
                          <p className="text-sm text-gray-600">
                            {alert.farmers.toLocaleString()} farmers affected
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        alert.severity === 'critical' ? 'destructive' : 
                        alert.severity === 'warning' ? 'default' : 'secondary'
                      }>
                        {alert.risk} Risk
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Impact Tab */}
        {activeTab === "impact" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sprout className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Average Yield</p>
                      <p className="text-2xl font-bold">{dashboardData.averageYield} t/ha</p>
                    </div>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-gray-600 mt-2">75% of target achieved</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Crops Diversified</p>
                      <p className="text-2xl font-bold">{dashboardData.cropsDiversified}</p>
                    </div>
                  </div>
                  <Progress value={84} className="h-2" />
                  <p className="text-xs text-gray-600 mt-2">Avg crops per farmer</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Districts Covered</p>
                      <p className="text-2xl font-bold">{dashboardData.areasServed}</p>
                    </div>
                  </div>
                  <Progress value={69} className="h-2" />
                  <p className="text-xs text-gray-600 mt-2">Out of 26 regions</p>
                </CardContent>
              </Card>
            </div>

            {/* Yield & Income Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Yield & Income Progression</CardTitle>
                <CardDescription>Demonstrating real agricultural impact</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={farmerPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="yield" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Yield (t/ha)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="income" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Income (USD)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* M&E Cost Savings Banner */}
            <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">M&E Cost Savings</h3>
                    <p className="text-green-100">
                      Real-time data eliminates 6-12 month survey delays
                    </p>
                    <p className="text-2xl font-bold mt-2">40-60% Cost Reduction</p>
                  </div>
                  <Button variant="secondary" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Generate M&E Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gender Analytics Tab */}
        {activeTab === "gender" && (
          <div className="space-y-6">
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-6 w-6 text-gray-600" />
                  <h3 className="text-lg font-bold">Gender Equality & Inclusion Tracking</h3>
                </div>
                <p className="text-sm text-gray-700">
                  GALS-style tracking built into the platform - meeting donor requirements for gender-based results
                </p>
              </CardContent>
            </Card>

            {/* Gender KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-2">Female-Headed Households</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData.femaleHeaded.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">42.2% of total farmers</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-2">Male-Headed Households</p>
                  <p className="text-3xl font-bold text-green-600">{dashboardData.maleHeaded.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">57.8% of total farmers</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 mb-2">Youth Engagement (18-35)</p>
                  <p className="text-3xl font-bold text-green-600">{dashboardData.youthFarmers.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">29.7% of total farmers</p>
                </CardContent>
              </Card>
            </div>

            {/* Decision Making Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>Household Decision Making Patterns</CardTitle>
                <CardDescription>Who makes farming decisions in the household</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {decisionMakingData.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-sm text-gray-600">
                          {item.value.toLocaleString()} ({item.percentage}%)
                        </span>
                      </div>
                      <Progress value={item.percentage} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Income by Gender */}
            <Card>
              <CardHeader>
                <CardTitle>Income Trends by Gender</CardTitle>
                <CardDescription>Household income changes (USD/month)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={incomeByGenderData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="female" fill="#ec4899" name="Female-Headed" />
                    <Bar dataKey="male" fill="#3b82f6" name="Male-Headed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Youth Engagement Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Youth Participation by Age Group</CardTitle>
                <CardDescription>Engaging the next generation of farmers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {youthEngagementData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium mb-2">{item.ageGroup} years</p>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                      <div className="ml-4 text-right">
                        <p className="font-bold text-lg">{item.count.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Districts Tab */}
        {activeTab === "districts" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>District-Level Performance Dashboard</CardTitle>
                <CardDescription>Regional breakdown of farmer performance and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">District</th>
                        <th className="text-left p-3">Total Farmers</th>
                        <th className="text-left p-3">Avg Yield (t/ha)</th>
                        <th className="text-left p-3">Active Alerts</th>
                        <th className="text-left p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {districtData.map((district, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{district.district}</td>
                          <td className="p-3">{district.farmers.toLocaleString()}</td>
                          <td className="p-3">
                            <span className={`font-medium ${
                              district.yield >= 2.5 ? 'text-green-600' :
                              district.yield >= 2.0 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {district.yield}
                            </span>
                          </td>
                          <td className="p-3">
                            {district.alerts > 0 ? (
                              <Badge variant="destructive">{district.alerts} alerts</Badge>
                            ) : (
                              <Badge variant="secondary">No alerts</Badge>
                            )}
                          </td>
                          <td className="p-3">
                            {district.yield >= 2.5 ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-orange-600" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* District Yield Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>District Yield Comparison</CardTitle>
                <CardDescription>Performance benchmarking across regions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={districtData.slice(0, 7)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="district" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="yield" fill="#10b981" name="Yield (t/ha)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Automated Project Reporting</CardTitle>
                <CardDescription>Generate comprehensive reports for stakeholders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <FileText className="h-8 w-8" />
                    <span>Monthly Impact Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Users className="h-8 w-8" />
                    <span>Gender Disaggregated Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <MapPin className="h-8 w-8" />
                    <span>District Performance Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <TrendingUp className="h-8 w-8" />
                    <span>Quarterly M&E Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Scalable Interventions</h3>
                <p className="text-green-50 mb-6">
                  KILIMO enables projects to scale from 500 → 50,000 farmers through USSD, 
                  voice assistant, AI chatbot, and offline mode. No laptops or field officers needed.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">12,847</p>
                    <p className="text-sm text-green-100">Current Farmers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">18</p>
                    <p className="text-sm text-green-100">Districts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">2,560%</p>
                    <p className="text-sm text-green-100">Growth Potential</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">50K+</p>
                    <p className="text-sm text-green-100">Target Scale</p>
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