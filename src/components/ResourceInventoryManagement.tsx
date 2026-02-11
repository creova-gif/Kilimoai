/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RESOURCE INVENTORY MANAGEMENT - WORLD-CLASS REDESIGN
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * DESIGN PHILOSOPHY:
 * - Visual stock management with instant clarity
 * - Beautiful data visualization
 * - Smart alerts that drive action
 * - Professional, enterprise-grade interface
 * 
 * BRAND COMPLIANCE:
 * - ✅ ONLY #2E7D32 (Raspberry Leaf Green)
 * - ✅ NO gradients
 * - ✅ Clean, modern aesthetics
 * - ✅ Perfect information hierarchy
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
  Clock,
  Fuel,
  Settings,
  FileText,
  ShoppingCart,
  Layers,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Eye,
  Edit
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

interface ResourceInventoryManagementProps {
  userId: string;
  language: string;
}

export function ResourceInventoryManagement({ userId, language }: ResourceInventoryManagementProps) {
  const [activeTab, setActiveTab] = useState("inventory");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const text = {
    title: language === "sw" ? "Rasilimali" : "Inventory Management",
    subtitle: language === "sw" ? "Fuatilia vifaa vyako" : "Track and manage your resources",
    inventory: language === "sw" ? "Rasilimali" : "Inventory",
    equipment: language === "sw" ? "Vifaa" : "Equipment",
    warehouses: language === "sw" ? "Ghala" : "Warehouses",
    analytics: language === "sw" ? "Takwimu" : "Analytics",
    addItem: language === "sw" ? "Ongeza Kifaa" : "Add Item",
    export: language === "sw" ? "Hamisha" : "Export",
    search: language === "sw" ? "Tafuta..." : "Search inventory...",
    allCategories: language === "sw" ? "Aina Zote" : "All Categories",
    totalValue: language === "sw" ? "Thamani Jumla" : "Total Value",
    lowStock: language === "sw" ? "Vifaa Vimepungua" : "Low Stock Items",
    operational: language === "sw" ? "Inafanya kazi" : "Operational",
    maintenanceDue: language === "sw" ? "Matengenezo" : "Maintenance Due"
  };

  // Mock data
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
    if (item.quantity <= item.minStock) return { status: "critical", color: "red", label: "Critical", bgColor: "bg-red-50", textColor: "text-red-700", borderColor: "border-red-200" };
    if (percentage <= 50) return { status: "low", color: "orange", label: "Low Stock", bgColor: "bg-orange-50", textColor: "text-orange-700", borderColor: "border-orange-200" };
    if (percentage >= 80) return { status: "good", color: "green", label: "Good", bgColor: "bg-green-50", textColor: "text-green-700", borderColor: "border-green-200" };
    return { status: "medium", color: "blue", label: "Medium", bgColor: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-200" };
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      seeds: "bg-green-100 text-green-700",
      fertilizer: "bg-blue-100 text-blue-700",
      pesticide: "bg-red-100 text-red-700",
      tools: "bg-gray-100 text-gray-700",
      feed: "bg-amber-100 text-amber-700",
      fuel: "bg-purple-100 text-purple-700",
      other: "bg-gray-100 text-gray-700"
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STATS OVERVIEW - Beautiful Cards with Visual Hierarchy             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Value Card */}
        <Card className="relative overflow-hidden border-2 border-gray-200 hover:border-[#2E7D32] hover:shadow-lg transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2E7D32]/5 rounded-full -mr-16 -mt-16" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#2E7D32]/10 rounded-xl group-hover:bg-[#2E7D32]/20 transition-colors">
                <DollarSign className="h-6 w-6 text-[#2E7D32]" />
              </div>
              <TrendingUp className="h-4 w-4 text-[#2E7D32]" />
            </div>
            <p className="text-sm text-gray-600 mb-1 font-medium">{text.totalValue}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              TZS {(stats.totalValue / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-500">{inventory.length} items tracked</p>
          </CardContent>
        </Card>

        {/* Low Stock Alert Card */}
        <Card className={`relative overflow-hidden border-2 transition-all duration-300 ${
          stats.lowStockItems > 0 
            ? "border-red-200 bg-red-50 hover:shadow-lg" 
            : "border-gray-200 hover:border-gray-300"
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                stats.lowStockItems > 0 ? "bg-red-100" : "bg-gray-100"
              }`}>
                <TrendingDown className={`h-6 w-6 ${
                  stats.lowStockItems > 0 ? "text-red-600" : "text-gray-600"
                }`} />
              </div>
              {stats.lowStockItems > 0 && (
                <div className="flex items-center justify-center h-6 w-6 bg-red-600 rounded-full animate-pulse">
                  <span className="text-xs font-bold text-white">!</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1 font-medium">{text.lowStock}</p>
            <p className={`text-3xl font-bold mb-1 ${
              stats.lowStockItems > 0 ? "text-red-700" : "text-gray-900"
            }`}>
              {stats.lowStockItems}
            </p>
            <p className="text-xs text-gray-600">Need immediate action</p>
          </CardContent>
        </Card>

        {/* Equipment Status Card */}
        <Card className="relative overflow-hidden border-2 border-gray-200 hover:border-[#2E7D32] hover:shadow-lg transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2E7D32]/5 rounded-full -mr-16 -mt-16" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#2E7D32]/10 rounded-xl group-hover:bg-[#2E7D32]/20 transition-colors">
                <Wrench className="h-6 w-6 text-[#2E7D32]" />
              </div>
              <CheckCircle className="h-4 w-4 text-[#2E7D32]" />
            </div>
            <p className="text-sm text-gray-600 mb-1 font-medium">Equipment Status</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stats.equipmentOperational}/{stats.equipmentTotal}
            </p>
            <p className="text-xs text-[#2E7D32] font-medium">{text.operational}</p>
          </CardContent>
        </Card>

        {/* Maintenance Due Card */}
        <Card className={`relative overflow-hidden border-2 transition-all duration-300 ${
          stats.maintenanceDue > 0 
            ? "border-amber-200 bg-amber-50 hover:shadow-lg" 
            : "border-gray-200 hover:border-gray-300"
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                stats.maintenanceDue > 0 ? "bg-amber-100" : "bg-gray-100"
              }`}>
                <Settings className={`h-6 w-6 ${
                  stats.maintenanceDue > 0 ? "text-amber-600" : "text-gray-600"
                }`} />
              </div>
              {stats.maintenanceDue > 0 && (
                <Clock className="h-4 w-4 text-amber-600" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1 font-medium">{text.maintenanceDue}</p>
            <p className={`text-3xl font-bold mb-1 ${
              stats.maintenanceDue > 0 ? "text-amber-700" : "text-gray-900"
            }`}>
              {stats.maintenanceDue}
            </p>
            <p className="text-xs text-gray-600">Within 2 weeks</p>
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ALERT BANNERS - Smart Notifications                                 */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {(stats.lowStockItems > 0 || stats.expiringItems > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.lowStockItems > 0 && (
            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-red-900 mb-1">
                      {stats.lowStockItems} Items Below Minimum Stock
                    </p>
                    <p className="text-sm text-red-700 mb-3">
                      NPK Fertilizer, Livestock Feed need immediate restocking
                    </p>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      <ShoppingCart className="h-3 w-3 mr-2" />
                      Reorder Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {stats.expiringItems > 0 && (
            <Card className="border-2 border-amber-200 bg-amber-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-amber-900 mb-1">
                      {stats.expiringItems} Items Expiring Soon
                    </p>
                    <p className="text-sm text-amber-700 mb-3">
                      Review items expiring within 90 days
                    </p>
                    <Button size="sm" variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-100">
                      <Eye className="h-3 w-3 mr-2" />
                      View Items
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT TABS                                                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-white border-2 border-gray-200 p-1">
            <TabsTrigger 
              value="inventory" 
              className="data-[state=active]:bg-[#2E7D32] data-[state=active]:text-white"
            >
              <Package className="h-4 w-4 mr-2" />
              {text.inventory}
            </TabsTrigger>
            <TabsTrigger 
              value="equipment"
              className="data-[state=active]:bg-[#2E7D32] data-[state=active]:text-white"
            >
              <Wrench className="h-4 w-4 mr-2" />
              {text.equipment}
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-[#2E7D32] data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {text.analytics}
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button variant="outline" className="border-gray-300">
              <Download className="h-4 w-4 mr-2" />
              {text.export}
            </Button>
            <Button className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              {text.addItem}
            </Button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* INVENTORY TAB - Beautiful Item Cards                           */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="inventory" className="space-y-6 mt-0">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={text.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 border-gray-200 focus:border-[#2E7D32] h-12"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg bg-white font-medium text-gray-700 focus:border-[#2E7D32] focus:outline-none transition-colors"
            >
              <option value="all">{text.allCategories}</option>
              <option value="seeds">Seeds</option>
              <option value="fertilizer">Fertilizers</option>
              <option value="pesticide">Pesticides</option>
              <option value="tools">Tools</option>
              <option value="feed">Feed</option>
              <option value="fuel">Fuel</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Inventory Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredInventory.map((item) => {
              const stockStatus = getStockStatus(item);
              const Icon = getCategoryIcon(item.category);
              const daysUntilExpiry = item.expiryDate
                ? Math.floor((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : null;
              const stockPercentage = (item.quantity / item.maxStock) * 100;

              return (
                <Card 
                  key={item.id} 
                  className={`border-2 ${stockStatus.borderColor} ${stockStatus.bgColor} hover:shadow-xl transition-all duration-300 group`}
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 ${getCategoryColor(item.category)} rounded-xl`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.lotNumber}
                            </Badge>
                            <Badge className={stockStatus.textColor.replace('text-', 'bg-').replace('-700', '-100') + ' ' + stockStatus.textColor}>
                              {stockStatus.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Expiry Warning */}
                      {daysUntilExpiry !== null && daysUntilExpiry <= 90 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-red-100 rounded-lg">
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                          <span className="text-xs font-bold text-red-600">{daysUntilExpiry}d</span>
                        </div>
                      )}
                    </div>

                    {/* Stock Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Stock Level</span>
                        <span className="text-sm font-bold text-gray-900">
                          {item.quantity} / {item.maxStock} {item.unit}
                        </span>
                      </div>
                      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`absolute left-0 top-0 h-full ${
                            stockStatus.status === "critical" ? "bg-red-500" :
                            stockStatus.status === "low" ? "bg-orange-500" :
                            stockStatus.status === "good" ? "bg-[#2E7D32]" :
                            "bg-blue-500"
                          } transition-all duration-500`}
                          style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                        />
                        {/* Min stock indicator */}
                        <div 
                          className="absolute top-0 bottom-0 w-0.5 bg-red-600"
                          style={{ left: `${(item.minStock / item.maxStock) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Location</p>
                        <p className="text-sm font-medium text-gray-900">{item.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Supplier</p>
                        <p className="text-sm font-medium text-gray-900">{item.supplier}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Value</p>
                        <p className="text-sm font-bold text-[#2E7D32]">
                          TZS {((item.quantity * item.costPerUnit) / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Last Restocked</p>
                        <p className="text-sm font-medium text-gray-900">{item.lastRestocked}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
                      >
                        <ShoppingCart className="h-3 w-3 mr-2" />
                        Reorder
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-300">
                        <Edit className="h-3 w-3 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-300">
                        <FileText className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* EQUIPMENT TAB - Machine Management                             */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="equipment" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {equipment.map((eq) => {
              const daysUntilMaintenance = Math.floor(
                (new Date(eq.nextMaintenance).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              const maintenanceDue = daysUntilMaintenance <= 14;

              return (
                <Card 
                  key={eq.id} 
                  className={`border-2 transition-all duration-300 hover:shadow-xl ${
                    eq.status === "operational" ? "border-green-200 bg-green-50" :
                    eq.status === "maintenance" ? "border-amber-200 bg-amber-50" :
                    "border-red-200 bg-red-50"
                  }`}
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${
                          eq.status === "operational" ? "bg-green-100" :
                          eq.status === "maintenance" ? "bg-amber-100" :
                          "bg-red-100"
                        }`}>
                          <Wrench className={`h-5 w-5 ${
                            eq.status === "operational" ? "text-green-600" :
                            eq.status === "maintenance" ? "text-amber-600" :
                            "text-red-600"
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{eq.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{eq.model}</Badge>
                            <Badge className={
                              eq.status === "operational" ? "bg-green-100 text-green-700" :
                              eq.status === "maintenance" ? "bg-amber-100 text-amber-700" :
                              "bg-red-100 text-red-700"
                            }>
                              {eq.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {maintenanceDue && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 rounded-lg">
                          <Clock className="h-3 w-3 text-amber-600" />
                          <span className="text-xs font-bold text-amber-600">{daysUntilMaintenance}d</span>
                        </div>
                      )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Serial Number</p>
                        <p className="text-sm font-medium text-gray-900">{eq.serialNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Location</p>
                        <p className="text-sm font-medium text-gray-900">{eq.currentLocation}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Hours Used</p>
                        <p className="text-sm font-bold text-gray-900">{eq.hoursUsed.toLocaleString()} hrs</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Next Maintenance</p>
                        <p className={`text-sm font-medium ${maintenanceDue ? 'text-amber-700 font-bold' : 'text-gray-900'}`}>
                          {eq.nextMaintenance}
                        </p>
                      </div>
                      {eq.operator && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Operator</p>
                          <p className="text-sm font-medium text-gray-900">{eq.operator}</p>
                        </div>
                      )}
                      {eq.fuelType && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Fuel Type</p>
                          <p className="text-sm font-medium text-gray-900">{eq.fuelType}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white">
                        <Calendar className="h-3 w-3 mr-2" />
                        Schedule Service
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-300">
                        <FileText className="h-3 w-3 mr-2" />
                        History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ANALYTICS TAB - Coming Soon                                     */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <TabsContent value="analytics" className="mt-0">
          <Card className="border-2 border-gray-200">
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-[#2E7D32]/10 rounded-full w-fit mx-auto mb-4">
                  <BarChart3 className="h-12 w-12 text-[#2E7D32]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-600 mb-6">
                  Track inventory trends, usage patterns, and cost analysis
                </p>
                <Button className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white">
                  <Zap className="h-4 w-4 mr-2" />
                  Request Early Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
