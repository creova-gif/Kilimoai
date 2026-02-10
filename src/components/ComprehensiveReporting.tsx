import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Download,
  FileText,
  Calendar,
  Leaf,
  Shield,
  Award,
  Target,
  Activity,
  PieChart,
  LineChart,
  Users,
  Package,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export function ComprehensiveReporting() {
  const [activeTab, setActiveTab] = useState("operational");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock analytics data
  const operationalMetrics = {
    totalAcres: 33,
    cropsDiversity: 5,
    yieldEfficiency: 87,
    taskCompletion: 92,
    equipmentUtilization: 73,
    laborProductivity: 85
  };

  const financialMetrics = {
    totalRevenue: 54700000,
    totalExpenses: 22300000,
    netProfit: 32400000,
    profitMargin: 59.2,
    roi: 145,
    costPerAcre: 676000
  };

  const productionMetrics = {
    totalYield: 3850,
    yieldPerAcre: 116.7,
    qualityGrade: "A",
    wastePercentage: 3.5,
    harvestEfficiency: 94
  };

  const sustainabilityMetrics = {
    organicCertified: 40, // percentage
    waterUsageEfficiency: 78,
    soilHealthScore: 85,
    carbonFootprint: 2.3, // tons
    biodiversityIndex: 72
  };

  const kpis = [
    { name: "Revenue Growth", value: "+18%", trend: "up", color: "green" },
    { name: "Cost Reduction", value: "-12%", trend: "up", color: "green" },
    { name: "Yield Improvement", value: "+15%", trend: "up", color: "green" },
    { name: "Customer Satisfaction", value: "94%", trend: "up", color: "blue" },
    { name: "Task Completion", value: "92%", trend: "up", color: "purple" },
    { name: "Equipment Uptime", value: "87%", trend: "up", color: "orange" }
  ];

  const generateReport = (type: string) => {
    toast.success(`${type} report generated!`, {
      description: "Download will start shortly"
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl mb-2">Reporting & Analytics</h1>
          <p className="text-gray-600">Turn data into actionable insights that drive results</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* KPI Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
          <CardDescription>At-a-glance metrics across all operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">{kpi.name}</p>
                  <TrendingUp className={`h-4 w-4 text-${kpi.color}-600`} />
                </div>
                <p className={`text-2xl font-bold text-${kpi.color}-600`}>{kpi.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="operational">
            <Activity className="h-4 w-4 mr-2" />
            Operational
          </TabsTrigger>
          <TabsTrigger value="financial">
            <DollarSign className="h-4 w-4 mr-2" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="production">
            <BarChart3 className="h-4 w-4 mr-2" />
            Production
          </TabsTrigger>
          <TabsTrigger value="sustainability">
            <Leaf className="h-4 w-4 mr-2" />
            Sustainability
          </TabsTrigger>
          <TabsTrigger value="traceability">
            <Shield className="h-4 w-4 mr-2" />
            Traceability
          </TabsTrigger>
        </TabsList>

        <TabsContent value="operational" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Package className="h-10 w-10 mx-auto mb-3 text-gray-700" />
                  <p className="text-3xl font-bold">{operationalMetrics.totalAcres}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Acres</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Leaf className="h-10 w-10 mx-auto mb-3 text-green-600" />
                  <p className="text-3xl font-bold">{operationalMetrics.cropsDiversity}</p>
                  <p className="text-sm text-gray-600 mt-1">Crop Types Cultivated</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Target className="h-10 w-10 mx-auto mb-3 text-gray-700" />
                  <p className="text-3xl font-bold">{operationalMetrics.yieldEfficiency}%</p>
                  <p className="text-sm text-gray-600 mt-1">Yield Efficiency vs Target</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Operational Efficiency Metrics</CardTitle>
              <CardDescription>Performance across farm operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Task Completion Rate</span>
                    <span className="font-medium">{operationalMetrics.taskCompletion}%</span>
                  </div>
                  <Progress value={operationalMetrics.taskCompletion} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Equipment Utilization</span>
                    <span className="font-medium">{operationalMetrics.equipmentUtilization}%</span>
                  </div>
                  <Progress value={operationalMetrics.equipmentUtilization} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Labor Productivity</span>
                    <span className="font-medium">{operationalMetrics.laborProductivity}%</span>
                  </div>
                  <Progress value={operationalMetrics.laborProductivity} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Water Usage Efficiency</span>
                    <span className="font-bold">82%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Fertilizer Application Accuracy</span>
                    <span className="font-bold">91%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Pesticide Usage Optimization</span>
                    <span className="font-bold">88%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Average Tasks per Worker/Day</span>
                    <span className="font-bold">8.5</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">On-Time Task Completion</span>
                    <span className="font-bold">94%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Safety Incidents</span>
                    <span className="font-bold text-green-600">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => generateReport("Operational Performance")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Operational Performance Report
                </Button>
                <Button variant="outline" onClick={() => generateReport("Resource Utilization")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Resource Utilization Report
                </Button>
                <Button variant="outline" onClick={() => generateReport("Team Productivity")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Team Productivity Report
                </Button>
                <Button variant="outline" onClick={() => generateReport("Equipment Performance")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Equipment Performance Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <DollarSign className="h-10 w-10 mx-auto mb-3 text-green-600" />
                  <p className="text-2xl font-bold">TZS {(financialMetrics.totalRevenue / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
                  <p className="text-xs text-green-600 mt-1">↑ 18% vs last period</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="h-10 w-10 mx-auto mb-3 text-gray-700" />
                  <p className="text-2xl font-bold">TZS {(financialMetrics.netProfit / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-gray-600 mt-1">Net Profit</p>
                  <p className="text-xs text-gray-600 mt-1">{financialMetrics.profitMargin}% margin</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 mx-auto mb-3 text-gray-700" />
                  <p className="text-2xl font-bold">{financialMetrics.roi}%</p>
                  <p className="text-sm text-gray-600 mt-1">Return on Investment</p>
                  <p className="text-xs text-gray-600 mt-1">Above industry avg</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Breakdown</CardTitle>
              <CardDescription>Detailed revenue and expense analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Revenue Streams</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Crop Sales</span>
                        <span className="font-medium">TZS 42.5M (78%)</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Livestock Products</span>
                        <span className="font-medium">TZS 8.2M (15%)</span>
                      </div>
                      <Progress value={15} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Value-Added Products</span>
                        <span className="font-medium">TZS 4.0M (7%)</span>
                      </div>
                      <Progress value={7} className="h-2" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Expense Categories</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Inputs & Supplies</span>
                        <span className="font-medium">TZS 12.8M (57%)</span>
                      </div>
                      <Progress value={57} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Labor Costs</span>
                        <span className="font-medium">TZS 6.5M (29%)</span>
                      </div>
                      <Progress value={29} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Equipment & Maintenance</span>
                        <span className="font-medium">TZS 3.0M (14%)</span>
                      </div>
                      <Progress value={14} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Profitability by Crop</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Maize</span>
                      <span className="font-bold text-green-600">+145%</span>
                    </div>
                    <p className="text-xs text-gray-600">Revenue: TZS 28.5M | Cost: TZS 11.7M</p>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Beans</span>
                      <span className="font-bold text-gray-900">+168%</span>
                    </div>
                    <p className="text-xs text-gray-600">Revenue: TZS 15.2M | Cost: TZS 5.7M</p>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Sunflower</span>
                      <span className="font-bold text-gray-900">+112%</span>
                    </div>
                    <p className="text-xs text-gray-600">Revenue: TZS 11.0M | Cost: TZS 4.9M</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Cash on Hand</span>
                    <span className="font-bold">TZS 8.5M</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Accounts Receivable</span>
                    <span className="font-bold">TZS 12.3M</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">Accounts Payable</span>
                    <span className="font-bold">TZS 3.2M</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-sm font-medium">Net Cash Position</span>
                    <span className="font-bold text-green-600">TZS 17.6M</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => generateReport("Profit & Loss Statement")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Profit & Loss Statement
                </Button>
                <Button variant="outline" onClick={() => generateReport("Cash Flow Statement")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Cash Flow Statement
                </Button>
                <Button variant="outline" onClick={() => generateReport("Balance Sheet")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Balance Sheet
                </Button>
                <Button variant="outline" onClick={() => generateReport("Tax Report")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Tax Report (TRA Compliant)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Package className="h-10 w-10 mx-auto mb-3 text-gray-700" />
                  <p className="text-3xl font-bold">{productionMetrics.totalYield}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Yield (bags)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="h-10 w-10 mx-auto mb-3 text-green-600" />
                  <p className="text-3xl font-bold">{productionMetrics.yieldPerAcre}</p>
                  <p className="text-sm text-gray-600 mt-1">Yield per Acre</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Award className="h-10 w-10 mx-auto mb-3 text-gray-700" />
                  <p className="text-3xl font-bold">{productionMetrics.qualityGrade}</p>
                  <p className="text-sm text-gray-600 mt-1">Quality Grade</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-orange-600" />
                  <p className="text-3xl font-bold">{productionMetrics.harvestEfficiency}%</p>
                  <p className="text-sm text-gray-600 mt-1">Harvest Efficiency</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Production Performance by Crop</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between mb-3">
                    <h4 className="font-medium">Maize (15 acres)</h4>
                    <Badge className="bg-green-100 text-green-700">Excellent</Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Total Yield</p>
                      <p className="font-bold">3,000 bags</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Per Acre</p>
                      <p className="font-bold">200 bags</p>
                    </div>
                    <div>
                      <p className="text-gray-600">vs Target</p>
                      <p className="font-bold text-green-600">+15%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Quality</p>
                      <p className="font-bold">Grade A</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between mb-3">
                    <h4 className="font-medium">Beans (8 acres)</h4>
                    <Badge className="bg-gray-100 text-gray-700">Good</Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Total Yield</p>
                      <p className="font-bold">800 bags</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Per Acre</p>
                      <p className="font-bold">100 bags</p>
                    </div>
                    <div>
                      <p className="text-gray-600">vs Target</p>
                      <p className="font-bold text-green-600">+8%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Quality</p>
                      <p className="font-bold">Grade A</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Production Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => generateReport("Harvest Report")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Harvest Report
                </Button>
                <Button variant="outline" onClick={() => generateReport("Yield Analysis")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Yield Analysis Report
                </Button>
                <Button variant="outline" onClick={() => generateReport("Quality Assessment")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Quality Assessment Report
                </Button>
                <Button variant="outline" onClick={() => generateReport("Seasonal Comparison")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Seasonal Comparison Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Leaf className="h-10 w-10 mx-auto mb-3 text-green-600" />
                  <p className="text-3xl font-bold">{sustainabilityMetrics.organicCertified}%</p>
                  <p className="text-sm text-gray-600 mt-1">Organic Certified Land</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Activity className="h-10 w-10 mx-auto mb-3 text-gray-700" />
                  <p className="text-3xl font-bold">{sustainabilityMetrics.soilHealthScore}%</p>
                  <p className="text-sm text-gray-600 mt-1">Soil Health Score</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Target className="h-10 w-10 mx-auto mb-3 text-gray-700" />
                  <p className="text-3xl font-bold">{sustainabilityMetrics.carbonFootprint} t</p>
                  <p className="text-sm text-gray-600 mt-1">Carbon Footprint</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Environmental Impact Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Water Usage Efficiency</span>
                    <span className="font-medium">{sustainabilityMetrics.waterUsageEfficiency}%</span>
                  </div>
                  <Progress value={sustainabilityMetrics.waterUsageEfficiency} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Biodiversity Index</span>
                    <span className="font-medium">{sustainabilityMetrics.biodiversityIndex}%</span>
                  </div>
                  <Progress value={sustainabilityMetrics.biodiversityIndex} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Renewable Energy Usage</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certification & Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Organic Certification</span>
                  </div>
                  <Badge className="bg-green-600 text-white">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-700" />
                    <span className="font-medium">GlobalGAP Certified</span>
                  </div>
                  <Badge className="bg-gray-700 text-white">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-700" />
                    <span className="font-medium">Fair Trade Compliance</span>
                  </div>
                  <Badge className="bg-gray-700 text-white">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sustainability Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => generateReport("Environmental Impact")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Environmental Impact Report
                </Button>
                <Button variant="outline" onClick={() => generateReport("Carbon Footprint")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Carbon Footprint Report
                </Button>
                <Button variant="outline" onClick={() => generateReport("Organic Compliance")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Organic Compliance Report
                </Button>
                <Button variant="outline" onClick={() => generateReport("Biodiversity Assessment")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Biodiversity Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traceability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seed to Sale Traceability</CardTitle>
              <CardDescription>Complete tracking from planting to delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Batch: MAIZE-2024A-001</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Planting</p>
                        <p className="text-sm text-gray-600">March 15, 2024 • Field 1 • H614 Hybrid Seeds</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Fertilization</p>
                        <p className="text-sm text-gray-600">April 20, 2024 • NPK 23:10:5 • 12 bags applied</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Pest Control</p>
                        <p className="text-sm text-gray-600">May 10, 2024 • Organic pesticide • Certified application</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Activity className="h-4 w-4 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Harvest</p>
                        <p className="text-sm text-gray-600">Expected: July 20, 2024 • Quality: Grade A</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Delivery</p>
                        <p className="text-sm text-gray-600">Pending harvest completion</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Traceability Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => generateReport("Batch Traceability")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Batch Traceability Report
                </Button>
                <Button variant="outline" onClick={() => generateReport("Input Usage")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Input Usage Report
                </Button>
                <Button variant="outline" onClick={() => generateReport("Supply Chain")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Supply Chain Report
                </Button>
                <Button variant="outline" onClick={() => generateReport("Quality Certificates")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Quality Certificates
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}