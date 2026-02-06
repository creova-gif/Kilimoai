import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Beef,
  Heart,
  TrendingUp,
  Calendar,
  Syringe,
  Activity,
  Users,
  Milk,
  Baby,
  MapPin,
  AlertCircle,
  CheckCircle2,
  PlusCircle,
  Search,
  Filter,
  Download,
  Bell,
  Scan,
  BarChart3,
  Leaf,
  Scale,
  Clock,
  Target,
  DollarSign
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Animal {
  id: string;
  tagId: string;
  name: string;
  species: "cattle" | "goat" | "sheep" | "chicken" | "pig";
  breed: string;
  sex: "male" | "female";
  birthDate: string;
  acquisitionDate: string;
  weight: number;
  motherId?: string;
  fatherId?: string;
  status: "healthy" | "sick" | "treatment" | "sold" | "deceased";
  location: string;
  group?: string;
}

interface HealthRecord {
  id: string;
  animalId: string;
  date: string;
  type: "vaccination" | "treatment" | "checkup" | "breeding";
  description: string;
  veterinarian?: string;
  medication?: string;
  withdrawalDate?: string;
  cost: number;
  nextDue?: string;
}

interface BreedingRecord {
  id: string;
  motherId: string;
  fatherId: string;
  breedingDate: string;
  expectedDueDate: string;
  actualBirthDate?: string;
  offspring: number;
  status: "pending" | "successful" | "failed";
}

export function LivestockManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecies, setFilterSpecies] = useState<string>("all");

  // Mock data - would come from backend
  const animals: Animal[] = [
    {
      id: "A001",
      tagId: "TZ-DAIRY-001",
      name: "Bessie",
      species: "cattle",
      breed: "Friesian",
      sex: "female",
      birthDate: "2021-03-15",
      acquisitionDate: "2021-03-15",
      weight: 450,
      status: "healthy",
      location: "Pasture A",
      group: "Dairy Herd 1"
    },
    {
      id: "A002",
      tagId: "TZ-DAIRY-002",
      name: "Daisy",
      species: "cattle",
      breed: "Ayrshire",
      sex: "female",
      birthDate: "2020-08-22",
      acquisitionDate: "2021-01-10",
      weight: 520,
      status: "treatment",
      location: "Barn 2",
      motherId: "A015",
      group: "Dairy Herd 1"
    },
    {
      id: "A003",
      tagId: "TZ-GOAT-001",
      name: "Billy",
      species: "goat",
      breed: "Boer",
      sex: "male",
      birthDate: "2022-05-10",
      acquisitionDate: "2022-05-10",
      weight: 45,
      status: "healthy",
      location: "Pasture B"
    }
  ];

  const healthRecords: HealthRecord[] = [
    {
      id: "H001",
      animalId: "A001",
      date: "2024-02-01",
      type: "vaccination",
      description: "FMD Vaccination",
      veterinarian: "Dr. Mwangi",
      medication: "FMD Vaccine",
      cost: 15000,
      nextDue: "2024-08-01"
    },
    {
      id: "H002",
      animalId: "A002",
      date: "2024-02-10",
      type: "treatment",
      description: "Mastitis Treatment",
      veterinarian: "Dr. Mwangi",
      medication: "Antibiotics (Penicillin)",
      withdrawalDate: "2024-02-24",
      cost: 25000
    }
  ];

  const breedingRecords: BreedingRecord[] = [
    {
      id: "B001",
      motherId: "A001",
      fatherId: "A010",
      breedingDate: "2023-11-15",
      expectedDueDate: "2024-08-15",
      status: "pending",
      offspring: 0
    },
    {
      id: "B002",
      motherId: "A002",
      breedingDate: "2023-09-20",
      expectedDueDate: "2024-06-20",
      actualBirthDate: "2024-06-18",
      status: "successful",
      offspring: 1,
      fatherId: "A010"
    }
  ];

  const stats = {
    totalAnimals: animals.length,
    healthy: animals.filter(a => a.status === "healthy").length,
    sick: animals.filter(a => a.status === "sick" || a.status === "treatment").length,
    pregnant: 2,
    upcomingVaccinations: 5,
    avgWeight: {
      cattle: 485,
      goat: 42,
      sheep: 38,
      chicken: 1.8,
      pig: 95
    },
    milkProduction: {
      daily: 245, // liters
      monthly: 7350,
      trend: "+8%"
    },
    feedConsumption: {
      daily: 890, // kg
      monthly: 26700,
      costPerAnimal: 2500
    }
  };

  const upcomingTasks = [
    { id: 1, type: "vaccination", animal: "TZ-DAIRY-001", task: "FMD Booster", dueDate: "2024-02-20", priority: "high" },
    { id: 2, type: "checkup", animal: "TZ-DAIRY-002", task: "Pregnancy Check", dueDate: "2024-02-18", priority: "medium" },
    { id: 3, type: "breeding", animal: "TZ-GOAT-003", task: "Heat Detection", dueDate: "2024-02-16", priority: "medium" },
    { id: 4, type: "treatment", animal: "TZ-DAIRY-002", task: "Withdrawal Period Ends", dueDate: "2024-02-24", priority: "high" },
  ];

  const speciesIcons = {
    cattle: Beef,
    goat: Beef,
    sheep: Beef,
    chicken: Beef,
    pig: Beef
  };

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         animal.tagId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecies = filterSpecies === "all" || animal.species === filterSpecies;
    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl mb-2">Livestock Management</h1>
          <p className="text-gray-600">Comprehensive herd health, breeding & performance tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Animal
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Animals</p>
                <p className="text-3xl font-bold">{stats.totalAnimals}</p>
                <p className="text-sm text-green-600 mt-1">+3 this month</p>
              </div>
              <Users className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Health Status</p>
                <p className="text-3xl font-bold text-green-600">{stats.healthy}</p>
                <p className="text-sm text-gray-600 mt-1">{stats.sick} need attention</p>
              </div>
              <Heart className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Milk Production</p>
                <p className="text-3xl font-bold">{stats.milkProduction.daily}L</p>
                <p className="text-sm text-green-600 mt-1">{stats.milkProduction.trend} vs last month</p>
              </div>
              <Milk className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Upcoming Tasks</p>
                <p className="text-3xl font-bold text-orange-600">{stats.upcomingVaccinations}</p>
                <p className="text-sm text-gray-600 mt-1">Due this week</p>
              </div>
              <Bell className="h-12 w-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">2 Animals Need Attention</p>
                <p className="text-sm text-orange-700 mt-1">
                  TZ-DAIRY-002 - Treatment withdrawal period ends in 4 days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Baby className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">2 Expected Births</p>
                <p className="text-sm text-blue-700 mt-1">
                  TZ-DAIRY-001 due in 6 months • TZ-GOAT-005 due in 2 weeks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="health">
            <Heart className="h-4 w-4 mr-2" />
            Health
          </TabsTrigger>
          <TabsTrigger value="breeding">
            <Baby className="h-4 w-4 mr-2" />
            Breeding
          </TabsTrigger>
          <TabsTrigger value="performance">
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="grazing">
            <MapPin className="h-4 w-4 mr-2" />
            Grazing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Search and Filter */}
          <Card className="bg-white shadow-sm">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    placeholder="Search by name or tag ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white relative z-0"
                  />
                </div>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <select
                    value={filterSpecies}
                    onChange={(e) => setFilterSpecies(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[140px]"
                  >
                    <option value="all">All Species</option>
                    <option value="cattle">Cattle</option>
                    <option value="goat">Goats</option>
                    <option value="sheep">Sheep</option>
                    <option value="chicken">Poultry</option>
                    <option value="pig">Pigs</option>
                  </select>
                  <Button variant="outline" className="whitespace-nowrap">
                    <Scan className="h-4 w-4 mr-2" />
                    RFID Scan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Animal List */}
          <Card>
            <CardHeader>
              <CardTitle>Herd Registry</CardTitle>
              <CardDescription>All animals tracked in your system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredAnimals.map((animal) => (
                  <div
                    key={animal.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedAnimal(animal)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Beef className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{animal.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {animal.tagId}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {animal.breed} • {animal.sex} • {animal.weight}kg • {animal.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          animal.status === "healthy"
                            ? "bg-green-100 text-green-700"
                            : animal.status === "treatment"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {animal.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks & Reminders</CardTitle>
              <CardDescription>Scheduled activities requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">{task.task}</p>
                        <p className="text-sm text-gray-600">{task.animal}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <p className="text-sm text-gray-600">{task.dueDate}</p>
                      <Badge
                        className={
                          task.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {task.priority}
                      </Badge>
                      <Button size="sm">Complete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Records & Treatments</CardTitle>
              <CardDescription>Complete medical history and compliance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthRecords.map((record) => {
                  const animal = animals.find(a => a.id === record.animalId);
                  return (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Syringe className="h-4 w-4 text-blue-600" />
                            <p className="font-medium">{record.description}</p>
                            <Badge variant="outline">{record.type}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {animal?.name} ({animal?.tagId}) • {record.date}
                          </p>
                        </div>
                        <p className="font-medium">TZS {record.cost.toLocaleString()}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        {record.veterinarian && (
                          <div>
                            <p className="text-gray-600">Veterinarian</p>
                            <p className="font-medium">{record.veterinarian}</p>
                          </div>
                        )}
                        {record.medication && (
                          <div>
                            <p className="text-gray-600">Medication</p>
                            <p className="font-medium">{record.medication}</p>
                          </div>
                        )}
                        {record.withdrawalDate && (
                          <div>
                            <p className="text-gray-600">Withdrawal Date</p>
                            <p className="font-medium text-orange-600">{record.withdrawalDate}</p>
                          </div>
                        )}
                        {record.nextDue && (
                          <div>
                            <p className="text-gray-600">Next Due</p>
                            <p className="font-medium text-blue-600">{record.nextDue}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button className="w-full mt-4" variant="outline">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Health Record
              </Button>
            </CardContent>
          </Card>

          {/* Withdrawal Compliance */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Withdrawal Period Compliance
              </CardTitle>
              <CardDescription>Animals with active treatment withdrawal periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">TZ-DAIRY-002 (Daisy)</p>
                    <Badge className="bg-orange-600 text-white">Active</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Antibiotic treatment - Milk withdrawal until Feb 24, 2024
                  </p>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-gray-600 mt-2">4 days remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breeding" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Baby className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                  <p className="text-3xl font-bold">{stats.pregnant}</p>
                  <p className="text-sm text-gray-600 mt-1">Pregnant Animals</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="h-10 w-10 mx-auto mb-3 text-green-600" />
                  <p className="text-3xl font-bold">87%</p>
                  <p className="text-sm text-gray-600 mt-1">Conception Rate</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Target className="h-10 w-10 mx-auto mb-3 text-purple-600" />
                  <p className="text-3xl font-bold">12</p>
                  <p className="text-sm text-gray-600 mt-1">Expected Births (3mo)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Breeding Records & Genealogy</CardTitle>
              <CardDescription>Track breeding cycles, fertility, and offspring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {breedingRecords.map((record) => {
                  const mother = animals.find(a => a.id === record.motherId);
                  return (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Baby className="h-5 w-5 text-blue-600" />
                          <p className="font-medium">{mother?.name} ({mother?.tagId})</p>
                          <Badge
                            className={
                              record.status === "successful"
                                ? "bg-green-100 text-green-700"
                                : record.status === "pending"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {record.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Breeding Date</p>
                          <p className="font-medium">{record.breedingDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Expected Due</p>
                          <p className="font-medium">{record.expectedDueDate}</p>
                        </div>
                        {record.actualBirthDate && (
                          <div>
                            <p className="text-gray-600">Actual Birth</p>
                            <p className="font-medium">{record.actualBirthDate}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-600">Offspring</p>
                          <p className="font-medium">{record.offspring || "Pending"}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button className="w-full mt-4" variant="outline">
                <PlusCircle className="h-4 w-4 mr-2" />
                Record Breeding
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Production Performance</CardTitle>
              <CardDescription>Milk yield, weight gain, and feed efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Milk Production Trends</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Daily Average</span>
                        <span className="font-medium">245 L</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Per Cow Average</span>
                        <span className="font-medium">18.5 L</span>
                      </div>
                      <Progress value={74} className="h-2" />
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        <TrendingUp className="h-4 w-4 inline mr-1" />
                        Production up 8% vs last month
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Weight Gain Performance</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cattle (Avg Daily Gain)</span>
                        <span className="font-medium">0.85 kg/day</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Goats (Avg Daily Gain)</span>
                        <span className="font-medium">0.15 kg/day</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <Scale className="h-4 w-4 inline mr-1" />
                        Above industry average for breed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feed Performance & Analytics</CardTitle>
              <CardDescription>Feed conversion ratio and consumption patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <Leaf className="h-8 w-8 text-green-600 mb-2" />
                  <p className="text-2xl font-bold">{stats.feedConsumption.daily} kg</p>
                  <p className="text-sm text-gray-600">Daily Feed Consumption</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <BarChart3 className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="text-2xl font-bold">1:6.2</p>
                  <p className="text-sm text-gray-600">Feed Conversion Ratio</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <DollarSign className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-2xl font-bold">TZS {stats.feedConsumption.costPerAnimal.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Cost per Animal/Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grazing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grazing Management & Pasture Rotation</CardTitle>
              <CardDescription>Optimize pasture health and prevent overgrazing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Pasture A</h4>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Herd</span>
                      <span className="font-medium">Dairy Herd 1 (15 animals)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grazing Since</span>
                      <span className="font-medium">Feb 1, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rotation Due</span>
                      <span className="font-medium text-orange-600">Feb 15, 2024</span>
                    </div>
                  </div>
                  <Progress value={70} className="h-2 mt-3" />
                  <p className="text-xs text-gray-600 mt-2">Pasture utilization: 70%</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Pasture B</h4>
                    <Badge className="bg-blue-100 text-blue-700">Resting</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className="font-medium">Regenerating</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rest Started</span>
                      <span className="font-medium">Jan 20, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ready For Use</span>
                      <span className="font-medium text-green-600">Feb 18, 2024</span>
                    </div>
                  </div>
                  <Progress value={85} className="h-2 mt-3" />
                  <p className="text-xs text-gray-600 mt-2">Recovery: 85%</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Recommended Rotation Schedule
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">• Move Dairy Herd 1 from Pasture A to Pasture B on Feb 15</p>
                  <p className="text-gray-700">• Allow Pasture A to rest for 21 days minimum</p>
                  <p className="text-gray-700">• Monitor grass height: rotate when 6-8 inches tall</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}