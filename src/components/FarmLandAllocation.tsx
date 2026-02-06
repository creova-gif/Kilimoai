import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Plus, 
  Trash2, 
  MapPin, 
  TrendingUp, 
  DollarSign,
  Calculator,
  PieChart,
  AlertCircle,
  CheckCircle2,
  Edit2
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface CropAllocation {
  id: string;
  crop: string;
  acres: number;
  expectedYield: number; // tons per acre
  estimatedRevenue: number;
  plantingDate?: string;
  harvestDate?: string;
  status: "planned" | "planted" | "growing" | "harvesting";
}

interface FarmLandAllocationProps {
  totalFarmSize: number; // in acres
  userId: string;
  region: string;
}

export function FarmLandAllocation({ 
  totalFarmSize,
  userId,
  region 
}: FarmLandAllocationProps) {
  const [allocations, setAllocations] = useState<CropAllocation[]>([
    {
      id: "1",
      crop: "Maize",
      acres: 40,
      expectedYield: 2.5,
      estimatedRevenue: 8000000,
      plantingDate: "2024-02-15",
      harvestDate: "2024-06-30",
      status: "planted"
    },
    {
      id: "2",
      crop: "Beans",
      acres: 25,
      expectedYield: 1.8,
      estimatedRevenue: 4500000,
      plantingDate: "2024-02-20",
      harvestDate: "2024-05-20",
      status: "planted"
    },
    {
      id: "3",
      crop: "Sunflower",
      acres: 20,
      expectedYield: 1.2,
      estimatedRevenue: 2400000,
      status: "planned"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCrop, setNewCrop] = useState("");
  const [newAcres, setNewAcres] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Crop yield database (tons/acre) and price (TZS/kg)
  const cropDatabase: Record<string, { yield: number; price: number }> = {
    "Maize": { yield: 2.5, price: 800 },
    "Beans": { yield: 1.8, price: 2000 },
    "Rice": { yield: 3.0, price: 1200 },
    "Sunflower": { yield: 1.2, price: 1500 },
    "Coffee": { yield: 0.8, price: 5000 },
    "Cashews": { yield: 0.6, price: 4000 },
    "Tomatoes": { yield: 15.0, price: 600 },
    "Onions": { yield: 12.0, price: 700 },
    "Wheat": { yield: 2.0, price: 900 },
  };

  const availableCrops = Object.keys(cropDatabase);

  const allocatedAcres = allocations.reduce((sum, a) => sum + a.acres, 0);
  const unallocatedAcres = totalFarmSize - allocatedAcres;
  const totalExpectedRevenue = allocations.reduce((sum, a) => sum + a.estimatedRevenue, 0);

  const handleAddAllocation = () => {
    if (!newCrop || !newAcres) {
      toast.error("Please select a crop and enter acreage");
      return;
    }

    const acres = parseFloat(newAcres);
    if (acres <= 0) {
      toast.error("Acreage must be greater than 0");
      return;
    }

    if (acres > unallocatedAcres) {
      toast.error(`Only ${unallocatedAcres.toFixed(1)} acres available`);
      return;
    }

    const cropData = cropDatabase[newCrop];
    const expectedYield = cropData.yield;
    const estimatedRevenue = acres * expectedYield * 1000 * cropData.price; // Convert tons to kg

    const newAllocation: CropAllocation = {
      id: Date.now().toString(),
      crop: newCrop,
      acres,
      expectedYield,
      estimatedRevenue,
      status: "planned"
    };

    setAllocations([...allocations, newAllocation]);
    setNewCrop("");
    setNewAcres("");
    setShowAddForm(false);
    toast.success(`${acres} acres allocated to ${newCrop}`);
  };

  const handleRemoveAllocation = (id: string) => {
    const allocation = allocations.find(a => a.id === id);
    setAllocations(allocations.filter(a => a.id !== id));
    toast.success(`${allocation?.crop} allocation removed`);
  };

  const handleUpdateStatus = (id: string, newStatus: CropAllocation["status"]) => {
    setAllocations(allocations.map(a => 
      a.id === id ? { ...a, status: newStatus } : a
    ));
    toast.success("Status updated");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-gray-100 text-gray-700";
      case "planted":
        return "bg-blue-100 text-blue-700";
      case "growing":
        return "bg-green-100 text-green-700";
      case "harvesting":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCropColor = (index: number) => {
    const colors = [
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-orange-500"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Overview Card */}
      <Card className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Farm Land Distribution</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-green-100">Total Farm Size</p>
              <p className="text-3xl font-bold">{totalFarmSize}</p>
              <p className="text-sm text-green-100">acres</p>
            </div>
            <div>
              <p className="text-sm text-green-100">Allocated</p>
              <p className="text-3xl font-bold">{allocatedAcres.toFixed(1)}</p>
              <p className="text-sm text-green-100">acres</p>
            </div>
            <div>
              <p className="text-sm text-green-100">Available</p>
              <p className="text-3xl font-bold">{unallocatedAcres.toFixed(1)}</p>
              <p className="text-sm text-green-100">acres</p>
            </div>
            <div>
              <p className="text-sm text-green-100">Est. Revenue</p>
              <p className="text-2xl font-bold">TZS {(totalExpectedRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-green-100">this season</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Farm Utilization</span>
              <span>{((allocatedAcres / totalFarmSize) * 100).toFixed(1)}%</span>
            </div>
            <Progress 
              value={(allocatedAcres / totalFarmSize) * 100} 
              className="h-3 bg-white/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Visual Land Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Land Distribution by Crop
          </CardTitle>
          <CardDescription>Visual representation of your farm allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allocations.map((allocation, idx) => (
              <div key={allocation.id}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{allocation.crop}</span>
                  <span className="text-gray-600">
                    {allocation.acres} acres ({((allocation.acres / totalFarmSize) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full ${getCropColor(idx)} flex items-center px-3 text-white text-sm font-medium transition-all`}
                    style={{ width: `${(allocation.acres / totalFarmSize) * 100}%` }}
                  >
                    {allocation.acres} acres
                  </div>
                </div>
              </div>
            ))}
            
            {unallocatedAcres > 0 && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-500">Unallocated</span>
                  <span className="text-gray-600">
                    {unallocatedAcres.toFixed(1)} acres ({((unallocatedAcres / totalFarmSize) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gray-200 flex items-center px-3 text-gray-600 text-sm font-medium"
                    style={{ width: `${(unallocatedAcres / totalFarmSize) * 100}%` }}
                  >
                    Available
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Crop Allocations Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Crop Allocations</CardTitle>
              <CardDescription>Manage your farm's crop distribution</CardDescription>
            </div>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Crop
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add Form */}
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-blue-50">
              <h4 className="font-medium mb-3">Allocate New Crop</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Crop Type</Label>
                  <select
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-lg"
                  >
                    <option value="">Select crop...</option>
                    {availableCrops.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Acreage</Label>
                  <Input
                    type="number"
                    placeholder="Enter acres"
                    value={newAcres}
                    onChange={(e) => setNewAcres(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Available: {unallocatedAcres.toFixed(1)} acres
                  </p>
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleAddAllocation} className="flex-1">
                    Add
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              {newCrop && newAcres && (
                <div className="mt-3 p-3 bg-white border rounded-lg">
                  <p className="text-sm font-medium mb-1">Projected Performance:</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Expected Yield</p>
                      <p className="font-bold">{(parseFloat(newAcres) * cropDatabase[newCrop].yield).toFixed(1)} tons</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Market Price</p>
                      <p className="font-bold">TZS {cropDatabase[newCrop].price}/kg</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Est. Revenue</p>
                      <p className="font-bold text-green-600">
                        TZS {((parseFloat(newAcres) * cropDatabase[newCrop].yield * 1000 * cropDatabase[newCrop].price) / 1000000).toFixed(2)}M
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Allocations List */}
          <div className="space-y-3">
            {allocations.map((allocation) => (
              <div 
                key={allocation.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg">{allocation.crop}</h4>
                      <Badge className={getStatusColor(allocation.status)}>
                        {allocation.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {allocation.acres} acres • {(allocation.acres * allocation.expectedYield).toFixed(1)} tons expected yield
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAllocation(allocation.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Acreage</p>
                      <p className="font-medium">{allocation.acres} acres</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Yield/Acre</p>
                      <p className="font-medium">{allocation.expectedYield} tons</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Est. Revenue</p>
                      <p className="font-medium text-green-600">
                        TZS {(allocation.estimatedRevenue / 1000000).toFixed(2)}M
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Revenue/Acre</p>
                      <p className="font-medium">
                        TZS {(allocation.estimatedRevenue / allocation.acres / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </div>

                {allocation.plantingDate && (
                  <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">
                        Planted: {new Date(allocation.plantingDate).toLocaleDateString()}
                      </span>
                      {allocation.harvestDate && (
                        <span className="text-gray-600">
                          Harvest: {new Date(allocation.harvestDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(allocation.id, "growing")}
                      >
                        Update Status
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Tips */}
      {unallocatedAcres > 5 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-900">Optimization Opportunity</p>
                <p className="text-sm text-yellow-800 mt-1">
                  You have {unallocatedAcres.toFixed(1)} acres unallocated. Consider planting a high-value crop like Tomatoes or Onions to maximize revenue.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {allocatedAcres === totalFarmSize && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900">Fully Allocated!</p>
                <p className="text-sm text-green-800 mt-1">
                  Your entire farm is allocated. Expected total revenue: TZS {(totalExpectedRevenue / 1000000).toFixed(2)}M this season.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
