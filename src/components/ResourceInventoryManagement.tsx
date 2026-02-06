import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Package,
  Wrench,
  Warehouse,
  TrendingDown,
  AlertCircle,
  PlusCircle,
  Search,
  Download,
  BarChart3,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  Fuel,
  Settings,
  FileText,
  MapPin,
  ShoppingCart,
  Layers
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface InventoryItem {
  id: string;
  name: string;
  category: "seeds" | "fertilizer" | "pesticide" | "tools" | "feed" | "fuel" | "other";
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  location: string;
  lotNumber?: string;
  expiryDate?: string;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
}

interface Equipment {
  id: string;
  name: string;
  type: "tractor" | "planter" | "harvester" | "sprayer" | "irrigation" | "other";
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchaseCost: number;
  status: "operational" | "maintenance" | "repair" | "idle";
  currentLocation: string;
  hoursUsed: number;
  lastMaintenance: string;
  nextMaintenance: string;
  fuelType?: string;
  operator?: string;
}

interface MaintenanceLog {
  id: string;
  equipmentId: string;
  date: string;
  type: "routine" | "repair" | "inspection";
  description: string;
  cost: number;
  technician: string;
  partsReplaced?: string[];
  nextServiceDue: string;
}

export function ResourceInventoryManagement() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Mock data - would come from backend
  const inventory: InventoryItem[] = [
    {
      id: "INV001",
      name: "Hybrid Maize Seeds (H614)",
      category: "seeds",
      quantity: 250,
      unit: "kg",
      minStock: 100,
      maxStock: 500,
      location: "Warehouse A - Shelf 12",
      lotNumber: "LOT-2024-001",
      expiryDate: "2024-12-31",
      costPerUnit: 15000,
      supplier: "Seed Co Tanzania",
      lastRestocked: "2024-01-15"
    },
    {
      id: "INV002",
      name: "NPK Fertilizer (23:10:5)",
      category: "fertilizer",
      quantity: 30,
      unit: "bags (50kg)",
      minStock: 50,
      maxStock: 200,
      location: "Warehouse B",
      lotNumber: "LOT-2024-015",
      costPerUnit: 85000,
      supplier: "Yara Tanzania",
      lastRestocked: "2024-02-01"
    },
    {
      id: "INV003",
      name: "Glyphosate Herbicide",
      category: "pesticide",
      quantity: 45,
      unit: "liters",
      minStock: 20,
      maxStock: 100,
      location: "Chemical Store",
      lotNumber: "LOT-2023-089",
      expiryDate: "2025-06-30",
      costPerUnit: 25000,
      supplier: "Bayer East Africa",
      lastRestocked: "2023-11-20"
    },
    {
      id: "INV004",
      name: "Diesel Fuel",
      category: "fuel",
      quantity: 500,
      unit: "liters",
      minStock: 200,
      maxStock: 1000,
      location: "Fuel Tank 1",
      costPerUnit: 3200,
      supplier: "Total Energies",
      lastRestocked: "2024-02-10"
    },
    {
      id: "INV005",
      name: "Livestock Feed (Dairy Mix)",
      category: "feed",
      quantity: 80,
      unit: "bags (50kg)",
      minStock: 100,
      maxStock: 300,
      location: "Feed Store",
      lotNumber: "LOT-2024-023",
      expiryDate: "2024-05-31",
      costPerUnit: 45000,
      supplier: "Nutri Feeds Ltd",
      lastRestocked: "2024-02-05"
    }
  ];

  const equipment: Equipment[] = [
    {
      id: "EQ001",
      name: "John Deere 5075E",
      type: "tractor",
      model: "5075E",
      serialNumber: "JD-2022-4587",
      purchaseDate: "2022-03-15",
      purchaseCost: 35000000,
      status: "operational",
      currentLocation: "Field 3",
      hoursUsed: 1245,
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-03-20",
      fuelType: "Diesel",
      operator: "John Mwangi"
    },
    {
      id: "EQ002",
      name: "Maize Planter 4-Row",
      type: "planter",
      model: "MP-400",
      serialNumber: "MP-2021-8934",
      purchaseDate: "2021-11-10",
      purchaseCost: 8500000,
      status: "operational",
      currentLocation: "Implement Shed",
      hoursUsed: 320,
      lastMaintenance: "2023-12-15",
      nextMaintenance: "2024-11-15"
    },
    {
      id: "EQ003",
      name: "Boom Sprayer",
      type: "sprayer",
      model: "BS-600L",
      serialNumber: "BS-2023-1122",
      purchaseDate: "2023-01-20",
      purchaseCost: 4200000,
      status: "maintenance",
      currentLocation: "Repair Shop",
      hoursUsed: 185,
      lastMaintenance: "2024-02-08",
      nextMaintenance: "2024-02-15"
    },
    {
      id: "EQ004",
      name: "Drip Irrigation System",
      type: "irrigation",
      model: "DIS-5HA",
      serialNumber: "DIS-2022-3345",
      purchaseDate: "2022-06-05",
      purchaseCost: 12000000,
      status: "operational",
      currentLocation: "Field 5 - Vegetables",
      hoursUsed: 2100,
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-04-10"
    }
  ];

  const maintenanceLogs: MaintenanceLog[] = [
    {
      id: "MAINT001",
      equipmentId: "EQ001",
      date: "2024-01-20",
      type: "routine",
      description: "Oil change, filter replacement, general inspection",
      cost: 450000,
      technician: "Peter Kimani",
      partsReplaced: ["Engine Oil", "Oil Filter", "Air Filter"],
      nextServiceDue: "2024-03-20"
    },
    {
      id: "MAINT002",
      equipmentId: "EQ003",
      date: "2024-02-08",
      type: "repair",
      description: "Pump seal replacement, nozzle cleaning",
      cost: 180000,
      technician: "Moses Omondi",
      partsReplaced: ["Pump Seal", "Nozzles (x4)"],
      nextServiceDue: "2024-02-15"
    }
  ];

  const stats = {
    totalValue: inventory.reduce((sum, item) => sum + (item.quantity * item.costPerUnit), 0),
    lowStockItems: inventory.filter(item => item.quantity <= item.minStock).length,
    expiringItems: inventory.filter(item => {
      if (!item.expiryDate) return false;
      const daysUntilExpiry = Math.floor((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 90;
    }).length,
    equipmentOperational: equipment.filter(eq => eq.status === "operational").length,
    equipmentTotal: equipment.length,
    maintenanceDue: equipment.filter(eq => {
      const daysUntilMaintenance = Math.floor((new Date(eq.nextMaintenance).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilMaintenance <= 14;
    }).length
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.quantity / item.maxStock) * 100;
    if (item.quantity <= item.minStock) return { status: "low", color: "red", label: "Low Stock" };
    if (percentage >= 80) return { status: "high", color: "green", label: "Good Stock" };
    return { status: "medium", color: "yellow", label: "Medium Stock" };
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      seeds: Package,
      fertilizer: Layers,
      pesticide: AlertCircle,
      tools: Wrench,
      feed: Package,
      fuel: Fuel,
      other: Package
    };
    return icons[category] || Package;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl mb-2">Resource & Inventory Management</h1>
          <p className="text-gray-600">Track inputs, equipment, and optimize farm operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Inventory Value</p>
                <p className="text-2xl font-bold">TZS {(stats.totalValue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-gray-600 mt-1">{inventory.length} items tracked</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{stats.lowStockItems}</p>
                <p className="text-sm text-gray-600 mt-1">Need restocking</p>
              </div>
              <TrendingDown className="h-12 w-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Equipment Status</p>
                <p className="text-2xl font-bold">{stats.equipmentOperational}/{stats.equipmentTotal}</p>
                <p className="text-sm text-green-600 mt-1">Operational</p>
              </div>
              <Wrench className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Maintenance Due</p>
                <p className="text-2xl font-bold text-red-600">{stats.maintenanceDue}</p>
                <p className="text-sm text-gray-600 mt-1">Within 2 weeks</p>
              </div>
              <Settings className="h-12 w-12 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(stats.lowStockItems > 0 || stats.expiringItems > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.lowStockItems > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900">{stats.lowStockItems} Items Below Minimum Stock</p>
                    <p className="text-sm text-orange-700 mt-1">
                      NPK Fertilizer, Livestock Feed need immediate restocking
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {stats.expiringItems > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">{stats.expiringItems} Items Expiring Soon</p>
                    <p className="text-sm text-red-700 mt-1">
                      Review items expiring within 90 days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="inventory">
            <Package className="h-4 w-4 mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="equipment">
            <Wrench className="h-4 w-4 mr-2" />
            Equipment
          </TabsTrigger>
          <TabsTrigger value="warehouses">
            <Warehouse className="h-4 w-4 mr-2" />
            Warehouses
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search inventory items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              <option value="all">All Categories</option>
              <option value="seeds">Seeds</option>
              <option value="fertilizer">Fertilizers</option>
              <option value="pesticide">Pesticides</option>
              <option value="tools">Tools</option>
              <option value="feed">Feed</option>
              <option value="fuel">Fuel</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Inventory List */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>Complete tracking with lot numbers and expiry dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item);
                  const Icon = getCategoryIcon(item.category);
                  const daysUntilExpiry = item.expiryDate
                    ? Math.floor((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    : null;

                  return (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 bg-${stockStatus.color === 'red' ? 'red' : stockStatus.color === 'green' ? 'green' : 'yellow'}-100 rounded-lg flex items-center justify-center`}>
                            <Icon className={`h-5 w-5 text-${stockStatus.color === 'red' ? 'red' : stockStatus.color === 'green' ? 'green' : 'yellow'}-600`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{item.name}</p>
                              {item.lotNumber && (
                                <Badge variant="outline" className="text-xs">
                                  {item.lotNumber}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {item.location} • {item.supplier}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={
                            stockStatus.color === "red"
                              ? "bg-red-100 text-red-700"
                              : stockStatus.color === "green"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {stockStatus.label}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3 text-sm">
                        <div>
                          <p className="text-gray-600">Current Stock</p>
                          <p className="font-medium">
                            {item.quantity} {item.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Min Stock</p>
                          <p className="font-medium">{item.minStock} {item.unit}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Value</p>
                          <p className="font-medium">
                            TZS {((item.quantity * item.costPerUnit) / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Last Restocked</p>
                          <p className="font-medium">{item.lastRestocked}</p>
                        </div>
                        {item.expiryDate && (
                          <div>
                            <p className="text-gray-600">Expiry Date</p>
                            <p className={`font-medium ${daysUntilExpiry && daysUntilExpiry <= 90 ? 'text-red-600' : ''}`}>
                              {item.expiryDate}
                              {daysUntilExpiry && daysUntilExpiry <= 90 && (
                                <span className="text-xs"> ({daysUntilExpiry}d)</span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>

                      <Progress 
                        value={(item.quantity / item.maxStock) * 100} 
                        className="h-2"
                      />

                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Reorder
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          History
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          {/* Equipment List */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment & Machinery</CardTitle>
              <CardDescription>Track usage, maintenance, and service schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {equipment.map((eq) => (
                  <div key={eq.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 ${eq.status === 'operational' ? 'bg-green-100' : eq.status === 'maintenance' ? 'bg-yellow-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                          <Wrench className={`h-6 w-6 ${eq.status === 'operational' ? 'text-green-600' : eq.status === 'maintenance' ? 'text-yellow-600' : 'text-red-600'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{eq.name}</p>
                            <Badge variant="outline" className="text-xs">{eq.model}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            SN: {eq.serialNumber} • {eq.currentLocation}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          eq.status === "operational"
                            ? "bg-green-100 text-green-700"
                            : eq.status === "maintenance"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {eq.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                      <div>
                        <p className="text-gray-600">Hours Used</p>
                        <p className="font-medium">{eq.hoursUsed.toLocaleString()} hrs</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Maintenance</p>
                        <p className="font-medium">{eq.lastMaintenance}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Next Service</p>
                        <p className="font-medium text-orange-600">{eq.nextMaintenance}</p>
                      </div>
                      {eq.operator && (
                        <div>
                          <p className="text-gray-600">Operator</p>
                          <p className="font-medium">{eq.operator}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        Schedule Maintenance
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        View Logs
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Usage Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-4" variant="outline">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </CardContent>
          </Card>

          {/* Maintenance Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Maintenance Logs</CardTitle>
              <CardDescription>Service history and upcoming schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {maintenanceLogs.map((log) => {
                  const eq = equipment.find(e => e.id === log.equipmentId);
                  return (
                    <div key={log.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{eq?.name}</p>
                          <p className="text-sm text-gray-600">{log.date} • {log.technician}</p>
                        </div>
                        <Badge
                          className={
                            log.type === "routine"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }
                        >
                          {log.type}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{log.description}</p>
                      {log.partsReplaced && (
                        <p className="text-sm text-gray-600 mb-2">
                          Parts: {log.partsReplaced.join(", ")}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-gray-600">Next service: {log.nextServiceDue}</p>
                        <p className="font-medium">TZS {log.cost.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse & Storage Management</CardTitle>
              <CardDescription>Organize inventory across multiple locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Warehouse className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Warehouse A</h4>
                        <p className="text-sm text-gray-600">Main Storage Facility</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Capacity</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    
                    <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                      <div>
                        <p className="text-gray-600">Items Stored</p>
                        <p className="font-medium">42 items</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Value</p>
                        <p className="font-medium">TZS 8.5M</p>
                      </div>
                    </div>

                    <Button size="sm" variant="outline" className="w-full mt-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      View Layout
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Warehouse className="h-8 w-8 text-purple-600" />
                      <div>
                        <h4 className="font-medium">Warehouse B</h4>
                        <p className="text-sm text-gray-600">Chemical & Fertilizer Store</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Capacity</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    
                    <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                      <div>
                        <p className="text-gray-600">Items Stored</p>
                        <p className="font-medium">28 items</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Value</p>
                        <p className="font-medium">TZS 4.2M</p>
                      </div>
                    </div>

                    <Button size="sm" variant="outline" className="w-full mt-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      View Layout
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Analytics</CardTitle>
              <CardDescription>Consumption trends and cost optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 border rounded-lg text-center">
                  <BarChart3 className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">TZS 3.2M</p>
                  <p className="text-sm text-gray-600">Monthly Consumption</p>
                </div>

                <div className="p-4 border rounded-lg text-center">
                  <TrendingDown className="h-10 w-10 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold">-12%</p>
                  <p className="text-sm text-gray-600">Cost Reduction vs Last Month</p>
                </div>

                <div className="p-4 border rounded-lg text-center">
                  <Package className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                  <p className="text-2xl font-bold">18 days</p>
                  <p className="text-sm text-gray-600">Avg. Stock Duration</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Top Consumed Items (This Month)</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Diesel Fuel</span>
                        <span className="font-medium">TZS 1.6M</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>NPK Fertilizer</span>
                        <span className="font-medium">TZS 850K</span>
                      </div>
                      <Progress value={53} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Livestock Feed</span>
                        <span className="font-medium">TZS 450K</span>
                      </div>
                      <Progress value={28} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipment Cost Analytics</CardTitle>
              <CardDescription>Maintenance costs and ROI tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-3">Total Maintenance Costs (YTD)</h4>
                  <p className="text-3xl font-bold mb-2">TZS 1.8M</p>
                  <p className="text-sm text-green-600">↓ 15% vs last year</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Equipment Utilization Rate</h4>
                  <p className="text-3xl font-bold mb-2">73%</p>
                  <p className="text-sm text-gray-600">Target: 80%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
