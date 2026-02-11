/**
 * UNIFIED INVENTORY & INPUTS - WORLD-CLASS REDESIGN
 * 
 * Farmer Question: "What do I have and what do I need?"
 * 
 * DESIGN PHILOSOPHY:
 * - Clear stock visibility
 * - Low stock alerts
 * - Quick purchase flow
 * - Usage tracking
 */

import { useState } from "react";
import { 
  Package, ShoppingCart, AlertTriangle, TrendingDown, Plus, Sparkles
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface UnifiedInventoryInputsProps {
  userId: string;
  region?: string;
  crops?: string[];
  onNavigate?: (tab: string) => void;
  language: "en" | "sw";
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minLevel: number;
  category: string;
  lastPurchase?: string;
}

export function UnifiedInventoryInputs({
  userId,
  region = "Arusha",
  crops = [],
  onNavigate,
  language
}: UnifiedInventoryInputsProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      name: language === "en" ? "Maize Seeds" : "Mbegu za Mahindi",
      quantity: 25,
      unit: "kg",
      minLevel: 50,
      category: language === "en" ? "Seeds" : "Mbegu",
      lastPurchase: "2024-01-15"
    },
    {
      id: "2",
      name: language === "en" ? "NPK Fertilizer" : "Mbolea ya NPK",
      quantity: 120,
      unit: "kg",
      minLevel: 100,
      category: language === "en" ? "Fertilizer" : "Mbolea",
      lastPurchase: "2024-02-01"
    },
    {
      id: "3",
      name: language === "en" ? "Pesticide" : "Dawa ya Mdudu",
      quantity: 5,
      unit: "L",
      minLevel: 10,
      category: language === "en" ? "Pesticide" : "Dawa",
      lastPurchase: "2024-01-20"
    },
    {
      id: "4",
      name: language === "en" ? "Bean Seeds" : "Mbegu za Maharagwe",
      quantity: 85,
      unit: "kg",
      minLevel: 30,
      category: language === "en" ? "Seeds" : "Mbegu",
      lastPurchase: "2024-02-05"
    }
  ]);

  const text = {
    title: language === "en" ? "Inventory & Inputs" : "Hifadhi na Vifaa",
    subtitle: language === "en" ? "Track stock and purchase supplies" : "Fuatilia hifadhi na nunua vifaa",
    myStock: language === "en" ? "My Stock" : "Hifadhi Yangu",
    lowStock: language === "en" ? "Low Stock" : "Hifadhi Chache",
    goodStock: language === "en" ? "Good Stock" : "Hifadhi Nzuri",
    purchase: language === "en" ? "Purchase" : "Nunua",
    addItem: language === "en" ? "Add Item" : "Ongeza Kitu",
    viewMarket: language === "en" ? "View Market" : "Tazama Soko",
    lastPurchased: language === "en" ? "Last purchased" : "Iliununuliwa mwisho",
    reorder: language === "en" ? "Reorder" : "Nunua Tena",
    stockLevel: language === "en" ? "Stock Level" : "Kiwango cha Hifadhi",
  };

  const lowStockItems = inventory.filter(item => item.quantity < item.minLevel);
  const goodStockItems = inventory.filter(item => item.quantity >= item.minLevel);

  const categoryColors: Record<string, any> = {
    [language === "en" ? "Seeds" : "Mbegu"]: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "bg-emerald-500" },
    [language === "en" ? "Fertilizer" : "Mbolea"]: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "bg-amber-500" },
    [language === "en" ? "Pesticide" : "Dawa"]: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "bg-red-500" },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-[#2E7D32] rounded-2xl p-6 text-white shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{text.title}</h1>
                  <p className="text-white/90 text-sm">{text.subtitle}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => toast.success(language === "en" ? "Opening marketplace..." : "Inafungua soko...")}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {text.viewMarket}
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{language === "en" ? "Total Items" : "Vitu Vyote"}</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
                <p className="text-xs text-white/80">{language === "en" ? "in stock" : "kwenye hifadhi"}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{text.lowStock}</p>
                <p className="text-2xl font-bold">{lowStockItems.length}</p>
                <p className="text-xs text-white/80">{language === "en" ? "need reorder" : "zinahitaji kuununuliwa"}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{text.goodStock}</p>
                <p className="text-2xl font-bold">{goodStockItems.length}</p>
                <p className="text-xs text-white/80">{language === "en" ? "sufficient" : "ya kutosha"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="py-4">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-1 text-sm">
                    {language === "en" ? "Low Stock Alert" : "Onyo la Hifadhi Chache"}
                  </h4>
                  <p className="text-sm text-red-700 leading-relaxed">
                    {language === "en"
                      ? `${lowStockItems.length} items are below minimum levels. Consider restocking soon.`
                      : `Vitu ${lowStockItems.length} viko chini ya kiwango cha chini. Fikiria kuongeza hifadhi hivi karibuni.`}
                  </p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => toast.success(language === "en" ? "Opening marketplace..." : "Inafungua soko...")}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {text.purchase}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inventory Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {inventory.map((item, index) => {
            const categoryStyle = categoryColors[item.category] || categoryColors["Seeds"];
            const isLowStock = item.quantity < item.minLevel;
            const stockPercent = (item.quantity / item.minLevel) * 100;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border-2 ${isLowStock ? "border-red-200 bg-red-50/30" : categoryStyle.border} hover:shadow-xl transition-all`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-12 w-12 ${categoryStyle.icon} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <Badge className={`${categoryStyle.bg} ${categoryStyle.text} border ${categoryStyle.border}`}>
                        {item.category}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg mb-3">{item.name}</h3>

                    <div className="space-y-3">
                      {/* Stock Level */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">{text.stockLevel}:</span>
                          <span className="font-semibold text-gray-900">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                        <Progress 
                          value={Math.min(stockPercent, 100)} 
                          className={`h-2 ${isLowStock ? "[&>div]:bg-red-500" : "[&>div]:bg-emerald-500"}`}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {language === "en" ? "Min" : "Chini"}: {item.minLevel} {item.unit}
                        </p>
                      </div>

                      {/* Last Purchase */}
                      {item.lastPurchase && (
                        <p className="text-xs text-gray-600">
                          {text.lastPurchased}: {new Date(item.lastPurchase).toLocaleDateString()}
                        </p>
                      )}

                      {/* Action Button */}
                      <Button 
                        size="sm" 
                        className={`w-full ${isLowStock ? "bg-red-600 hover:bg-red-700" : "bg-[#2E7D32] hover:bg-[#1B5E20]"}`}
                        onClick={() => toast.success(`${text.reorder}: ${item.name}`)}
                      >
                        {isLowStock ? <AlertTriangle className="h-3.5 w-3.5 mr-2" /> : <ShoppingCart className="h-3.5 w-3.5 mr-2" />}
                        {text.reorder}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="border-2 border-blue-100 bg-blue-50/50">
          <CardContent className="py-4">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1 text-sm">
                  {language === "en" ? "Smart Inventory Management" : "Usimamizi Mahiri wa Hifadhi"}
                </h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {language === "en"
                    ? "KILIMO tracks your input usage and sends alerts when stock runs low. Connect with verified suppliers for direct purchasing."
                    : "KILIMO inafuatilia matumizi yako ya vifaa na kutuma tahadhari wakati hifadhi inapungua. Unganisha na wauzaji walioidhinishwa kwa ununuzi wa moja kwa moja."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

UnifiedInventoryInputs.displayName = "UnifiedInventoryInputs";