import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { 
  Users, TrendingUp, Target, DollarSign, 
  Download, BarChart3, PieChart, Activity,
  Sprout, Heart, Droplet, Sun, FileText,
  AlertCircle, CheckCircle, Clock, Award
} from "lucide-react";
import { Progress } from "./ui/progress";

interface InstitutionalDashboardProps {
  organizationName: string;
  organizationType: string;
}

export function InstitutionalDashboard({ organizationName, organizationType }: InstitutionalDashboardProps) {
  // Mock data - would come from backend
  const stats = {
    registeredFarmers: 12847,
    activeFarmers: 9234,
    femalePercentage: 42,
    youthPercentage: 28,
    avgFarmSize: 3.2,
    totalRevenue: 245000000, // TZS
    transactionVolume: 1250,
    creditScoreAvg: 72
  };

  const projectMetrics = {
    productivity: 78,
    climateResilience: 65,
    marketAccess: 82,
    financialInclusion: 59,
    genderEquality: 71
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl mb-2">{organizationName}</h1>
          <p className="text-gray-600">Institutional Dashboard - {organizationType}</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Export M&E Report
        </Button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardDescription>Registered Farmers</CardDescription>
              <Users className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl mb-1">{stats.registeredFarmers.toLocaleString()}</div>
            <p className="text-xs text-gray-600">
              <span className="text-green-600">↑ 23%</span> vs last quarter
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardDescription>Active Users (30d)</CardDescription>
              <Activity className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl mb-1">{stats.activeFarmers.toLocaleString()}</div>
            <p className="text-xs text-gray-600">
              {((stats.activeFarmers / stats.registeredFarmers) * 100).toFixed(1)}% engagement rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardDescription>Female Farmers</CardDescription>
              <Heart className="h-5 w-5 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl mb-1">{stats.femalePercentage}%</div>
            <p className="text-xs text-gray-600">
              {Math.round(stats.registeredFarmers * (stats.femalePercentage / 100)).toLocaleString()} women
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardDescription>Transaction Volume</CardDescription>
              <DollarSign className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl mb-1">TZS {(stats.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-gray-600">
              {stats.transactionVolume} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gender">Gender & Youth</TabsTrigger>
          <TabsTrigger value="finance">Finance & Credit</TabsTrigger>
          <TabsTrigger value="climate">Climate Impact</TabsTrigger>
          <TabsTrigger value="reports">M&E Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Project Impact Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Project Impact Metrics</CardTitle>
              <CardDescription>Key performance indicators for donor reporting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-green-600" />
                    <span>Productivity Improvement</span>
                  </div>
                  <span className="text-sm font-semibold">{projectMetrics.productivity}%</span>
                </div>
                <Progress value={projectMetrics.productivity} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-orange-600" />
                    <span>Climate Resilience Score</span>
                  </div>
                  <span className="text-sm font-semibold">{projectMetrics.climateResilience}%</span>
                </div>
                <Progress value={projectMetrics.climateResilience} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <span>Market Access</span>
                  </div>
                  <span className="text-sm font-semibold">{projectMetrics.marketAccess}%</span>
                </div>
                <Progress value={projectMetrics.marketAccess} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>Financial Inclusion</span>
                  </div>
                  <span className="text-sm font-semibold">{projectMetrics.financialInclusion}%</span>
                </div>
                <Progress value={projectMetrics.financialInclusion} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-gray-600" />
                    <span>Gender Equality</span>
                  </div>
                  <span className="text-sm font-semibold">{projectMetrics.genderEquality}%</span>
                </div>
                <Progress value={projectMetrics.genderEquality} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Regional Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Top Regions</CardTitle>
                <CardDescription>Farmer distribution by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { region: "Mwanza", count: 2847, percentage: 22 },
                    { region: "Arusha", count: 2234, percentage: 17 },
                    { region: "Dodoma", count: 1923, percentage: 15 },
                    { region: "Kilimanjaro", count: 1654, percentage: 13 },
                    { region: "Mbeya", count: 1432, percentage: 11 }
                  ].map((item) => (
                    <div key={item.region}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{item.region}</span>
                        <span className="text-sm">{item.count.toLocaleString()}</span>
                      </div>
                      <Progress value={item.percentage} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Crop Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Crop Distribution</CardTitle>
                <CardDescription>Primary crops by farmer count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { crop: "Maize", count: 5432, percentage: 42 },
                    { crop: "Rice", count: 3214, percentage: 25 },
                    { crop: "Beans", count: 2134, percentage: 17 },
                    { crop: "Sunflower", count: 1234, percentage: 10 },
                    { crop: "Cassava", count: 833, percentage: 6 }
                  ].map((item) => (
                    <div key={item.crop}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{item.crop}</span>
                        <span className="text-sm">{item.count.toLocaleString()}</span>
                      </div>
                      <Progress value={item.percentage} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gender" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle>Female Farmers</CardTitle>
                <CardDescription>Gender distribution insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl mb-2">{stats.femalePercentage}%</div>
                <p className="text-sm text-gray-600">
                  {Math.round(stats.registeredFarmers * (stats.femalePercentage / 100)).toLocaleString()} women farmers
                </p>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">Target: 50%</p>
                  <Progress value={stats.femalePercentage} max={50} className="h-2 mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardHeader>
                <CardTitle>Youth Farmers</CardTitle>
                <CardDescription>Age 18-34 years</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl mb-2">{stats.youthPercentage}%</div>
                <p className="text-sm text-gray-600">
                  {Math.round(stats.registeredFarmers * (stats.youthPercentage / 100)).toLocaleString()} young farmers
                </p>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">Target: 35%</p>
                  <Progress value={stats.youthPercentage} max={35} className="h-2 mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle>Female-Headed</CardTitle>
                <CardDescription>Household decision makers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl mb-2">38%</div>
                <p className="text-sm text-gray-600">
                  {Math.round(stats.registeredFarmers * 0.38).toLocaleString()} households
                </p>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">Tracking decision-making power</p>
                  <Progress value={38} className="h-2 mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gender Impact Metrics</CardTitle>
              <CardDescription>Tracking gender equality in agricultural outcomes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { metric: "Access to AI Advisory", female: 87, male: 89 },
                { metric: "Market Transaction Success", female: 72, male: 76 },
                { metric: "Credit Access", female: 45, male: 58 },
                { metric: "Input Access", female: 68, male: 71 },
                { metric: "Mobile Money Usage", female: 92, male: 88 }
              ].map((item) => (
                <div key={item.metric} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.metric}</span>
                    <span className="text-xs text-gray-500">F: {item.female}% / M: {item.male}%</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Progress value={item.female} className="h-2 bg-gray-100 [&>div]:bg-gray-500" />
                    </div>
                    <div className="flex-1">
                      <Progress value={item.male} className="h-2 bg-gray-100 [&>div]:bg-gray-600" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Avg Credit Score</CardTitle>
                <CardDescription>AI-powered creditworthiness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl mb-2">{stats.creditScoreAvg}/100</div>
                <Progress value={stats.creditScoreAvg} className="h-2 mt-4" />
                <p className="text-xs text-gray-500 mt-2">
                  {Math.round(stats.registeredFarmers * 0.67).toLocaleString()} farmers credit-ready
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loan Referrals</CardTitle>
                <CardDescription>Facilitated financing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl mb-2">847</div>
                <p className="text-sm text-gray-600 mt-2">TZS 3.2B total value</p>
                <p className="text-xs text-gray-500 mt-2">
                  Commission: TZS 128M (4%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Repayment Rate</CardTitle>
                <CardDescription>Loan performance tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl mb-2 text-green-600">94%</div>
                <Progress value={94} className="h-2 mt-4" />
                <p className="text-xs text-gray-500 mt-2">
                  Industry avg: 78%
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Credit Score Distribution</CardTitle>
              <CardDescription>Farmer creditworthiness breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { range: "Excellent (80-100)", count: 2847, percentage: 22, color: "bg-green-500" },
                { range: "Good (70-79)", count: 5134, percentage: 40, color: "bg-gray-500" },
                { range: "Fair (60-69)", count: 3214, percentage: 25, color: "bg-yellow-500" },
                { range: "Poor (50-59)", count: 1234, percentage: 10, color: "bg-orange-500" },
                { range: "Very Poor (<50)", count: 418, percentage: 3, color: "bg-red-500" }
              ].map((item) => (
                <div key={item.range}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{item.range}</span>
                    <span className="text-sm">{item.count.toLocaleString()} farmers</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="climate" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Climate Alerts Sent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">24,582</div>
                <p className="text-xs text-gray-500 mt-2">This quarter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Water Conservation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">68%</div>
                <p className="text-xs text-gray-500 mt-2">Adoption rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Drought Resilience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">+42%</div>
                <p className="text-xs text-gray-500 mt-2">Improvement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carbon Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl">234 tCO₂</div>
                <p className="text-xs text-gray-500 mt-2">Potential value</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>M&E Reports</CardTitle>
              <CardDescription>Monitoring & Evaluation exports for donors and partners</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Q4 2024 Impact Report", date: "2024-12-15", status: "ready" },
                { name: "Gender & Youth Analysis", date: "2024-12-10", status: "ready" },
                { name: "Financial Inclusion Dashboard", date: "2024-12-08", status: "ready" },
                { name: "Climate Resilience Report", date: "2024-12-01", status: "ready" },
                { name: "Annual Farmer Survey Results", date: "2024-11-25", status: "ready" }
              ].map((report) => (
                <div key={report.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-xs text-gray-500">{report.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Generate custom M&E reports for your specific needs</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Create Custom Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}