import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Map, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Sprout, 
  Home, 
  Droplet,
  Info,
  CheckCircle2,
  BarChart3,
  Grid3x3
} from "lucide-react";
import { toast } from "sonner@2.0.3";

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface Field {
  id: string;
  name: string;
  area: number; // in acres
  crop: string;
  soilType: string;
  status: "active" | "fallow" | "preparing";
  coordinates?: { lat: number; lng: number }[];
  notes?: string;
}

interface Asset {
  id: string;
  type: "building" | "water" | "equipment";
  name: string;
  location: { lat: number; lng: number };
  description: string;
}

interface FarmMappingProps {
  userId?: string;
  language?: "en" | "sw";
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export function FarmMappingRedesign({ 
  userId,
  language = "en" 
}: FarmMappingProps) {
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  const [fields, setFields] = useState<Field[]>([
    {
      id: "1",
      name: "Field A - North",
      area: 5.2,
      crop: "Maize",
      soilType: "Clay Loam",
      status: "active",
      notes: "Recently fertilized"
    },
    {
      id: "2",
      name: "Field B - South",
      area: 3.8,
      crop: "Rice",
      soilType: "Sandy Loam",
      status: "active"
    },
    {
      id: "3",
      name: "Field C - West",
      area: 2.5,
      crop: "None",
      soilType: "Loam",
      status: "fallow",
      notes: "Resting for next season"
    }
  ]);

  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      type: "building",
      name: "Main Storage Barn",
      location: { lat: -3.3874, lng: 36.6838 },
      description: "Primary storage facility"
    },
    {
      id: "2",
      type: "water",
      name: "Irrigation Well",
      location: { lat: -3.3884, lng: 36.6838 },
      description: "Main water source"
    },
    {
      id: "3",
      type: "equipment",
      name: "Equipment Shed",
      location: { lat: -3.3874, lng: 36.6828 },
      description: "Tool and equipment storage"
    }
  ]);

  const [activeTab, setActiveTab] = useState("fields");
  const [showAddFieldDialog, setShowAddFieldDialog] = useState(false);
  const [showAddAssetDialog, setShowAddAssetDialog] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // Form state
  const [fieldForm, setFieldForm] = useState({
    name: "",
    area: "",
    crop: "",
    soilType: "",
    status: "active" as Field["status"],
    notes: ""
  });

  const [assetForm, setAssetForm] = useState({
    name: "",
    type: "building" as Asset["type"],
    description: ""
  });

  // ==========================================
  // CALCULATIONS
  // ==========================================

  const totalFarmArea = fields.reduce((sum, field) => sum + field.area, 0);
  const activeArea = fields.filter(f => f.status === "active").reduce((sum, f) => sum + f.area, 0);
  const fallowArea = fields.filter(f => f.status === "fallow").reduce((sum, f) => sum + f.area, 0);
  const activeFieldsCount = fields.filter(f => f.status === "active").length;

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleAddField = () => {
    if (!fieldForm.name || !fieldForm.area) {
      toast.error(language === "sw" ? "Jaza jina na ukubwa" : "Fill in name and area");
      return;
    }

    const newField: Field = {
      id: Date.now().toString(),
      name: fieldForm.name,
      area: parseFloat(fieldForm.area),
      crop: fieldForm.crop || "None",
      soilType: fieldForm.soilType || "Unknown",
      status: fieldForm.status,
      notes: fieldForm.notes
    };

    setFields([...fields, newField]);
    setShowAddFieldDialog(false);
    toast.success(language === "sw" ? "Shamba limeongezwa" : "Field added successfully");

    // Reset form
    setFieldForm({
      name: "",
      area: "",
      crop: "",
      soilType: "",
      status: "active",
      notes: ""
    });
  };

  const handleAddAsset = () => {
    if (!assetForm.name) {
      toast.error(language === "sw" ? "Jaza jina" : "Fill in name");
      return;
    }

    const newAsset: Asset = {
      id: Date.now().toString(),
      type: assetForm.type,
      name: assetForm.name,
      location: { lat: 0, lng: 0 }, // Would be set via GPS/map picker
      description: assetForm.description
    };

    setAssets([...assets, newAsset]);
    setShowAddAssetDialog(false);
    toast.success(language === "sw" ? "Rasilimali imeongezwa" : "Asset added successfully");

    // Reset form
    setAssetForm({
      name: "",
      type: "building",
      description: ""
    });
  };

  const handleDeleteField = (id: string) => {
    const field = fields.find(f => f.id === id);
    setFields(fields.filter(f => f.id !== id));
    toast.success(language === "sw" ? `${field?.name} limeondolewa` : `${field?.name} removed`);
  };

  const handleDeleteAsset = (id: string) => {
    const asset = assets.find(a => a.id === id);
    setAssets(assets.filter(a => a.id !== id));
    toast.success(language === "sw" ? `${asset?.name} limeondolewa` : `${asset?.name} removed`);
  };

  const getStatusColor = (status: Field["status"]) => {
    switch (status) {
      case "active":
        return "bg-[#2E7D32] text-white";
      case "fallow":
        return "bg-gray-200 text-gray-700";
      case "preparing":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: Field["status"]) => {
    const labels = {
      active: { en: "Active", sw: "Inatumika" },
      fallow: { en: "Fallow", sw: "Inalala" },
      preparing: { en: "Preparing", sw: "Inatengenezwa" }
    };
    return labels[status][language];
  };

  const getAssetIcon = (type: Asset["type"]) => {
    switch (type) {
      case "building":
        return <Home className="h-5 w-5 text-[#2E7D32]" />;
      case "water":
        return <Droplet className="h-5 w-5 text-[#2E7D32]" />;
      case "equipment":
        return <Grid3x3 className="h-5 w-5 text-[#2E7D32]" />;
    }
  };

  // ==========================================
  // TAB 1: FIELDS VIEW
  // ==========================================

  const FieldsView = () => (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="border-[#2E7D32] bg-white">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {language === "sw" ? "Muhtasari wa Shamba" : "Farm Summary"}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">
                {language === "sw" ? "Jumla" : "Total Area"}
              </p>
              <p className="text-2xl font-bold text-gray-900">{totalFarmArea.toFixed(1)}</p>
              <p className="text-xs text-gray-500">acres</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {language === "sw" ? "Mashamba" : "Fields"}
              </p>
              <p className="text-2xl font-bold text-gray-900">{fields.length}</p>
              <p className="text-xs text-gray-500">{language === "sw" ? "jumla" : "total"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {language === "sw" ? "Yanayotumika" : "Active"}
              </p>
              <p className="text-2xl font-bold text-[#2E7D32]">{activeArea.toFixed(1)}</p>
              <p className="text-xs text-gray-500">acres</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {language === "sw" ? "Yaliyolala" : "Fallow"}
              </p>
              <p className="text-2xl font-bold text-gray-900">{fallowArea.toFixed(1)}</p>
              <p className="text-xs text-gray-500">acres</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {language === "sw" ? "Mashamba Yako" : "Your Fields"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {language === "sw" 
              ? "Dhibiti mashamba na mazao" 
              : "Manage fields and crops"}
          </p>
        </div>
        <Button 
          onClick={() => setShowAddFieldDialog(true)}
          className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {language === "sw" ? "Ongeza Shamba" : "Add Field"}
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-[#2E7D32] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {language === "sw" ? "Ramani Rahisi ya Shamba" : "Simple Farm Layout"}
              </p>
              <p className="text-xs text-gray-600">
                {language === "sw" 
                  ? "Ongeza na dhibiti mashamba yako. Unganisha na mipango ya mazao kuona ni zao gani linafanya vizuri wapi."
                  : "Add and manage your fields. Connect to crop plans to see which crops perform best where."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fields List */}
      <div className="grid gap-3">
        {fields.map((field) => (
          <Card key={field.id} className="border border-gray-200 hover:border-[#2E7D32] transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <MapPin className="h-5 w-5 text-[#2E7D32]" />
                    <h4 className="font-semibold text-gray-900">{field.name}</h4>
                    <Badge className={getStatusColor(field.status)}>
                      {getStatusLabel(field.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">
                        {language === "sw" ? "Ukubwa" : "Area"}
                      </p>
                      <p className="font-medium text-gray-900">{field.area} acres</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">
                        {language === "sw" ? "Zao" : "Crop"}
                      </p>
                      <p className="font-medium text-gray-900">{field.crop}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">
                        {language === "sw" ? "Udongo" : "Soil Type"}
                      </p>
                      <p className="font-medium text-gray-900">{field.soilType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">
                        {language === "sw" ? "Hali" : "Status"}
                      </p>
                      <p className="font-medium text-gray-900">
                        {field.status === "active" ? (
                          <CheckCircle2 className="h-4 w-4 inline text-[#2E7D32]" />
                        ) : (
                          <span className="text-gray-500">{getStatusLabel(field.status)}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {field.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-600">{field.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      // Edit functionality
                      toast.info(language === "sw" ? "Hariri shamba" : "Edit field");
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteField(field.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {fields.length === 0 && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center">
            <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {language === "sw" 
                ? "Hakuna mashamba yameongezwa bado. Anza kurekodi muundo wa shamba lako."
                : "No fields added yet. Start recording your farm layout."}
            </p>
            <Button 
              onClick={() => setShowAddFieldDialog(true)}
              className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === "sw" ? "Ongeza Shamba la Kwanza" : "Add First Field"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // ==========================================
  // TAB 2: ASSETS VIEW
  // ==========================================

  const AssetsView = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {language === "sw" ? "Rasilimali za Shamba" : "Farm Assets"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {language === "sw" 
              ? "Dhibiti majengo, maji, na vifaa" 
              : "Manage buildings, water sources, and equipment"}
          </p>
        </div>
        <Button 
          onClick={() => setShowAddAssetDialog(true)}
          className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {language === "sw" ? "Ongeza Rasilimali" : "Add Asset"}
        </Button>
      </div>

      {/* Assets Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4">
            <Home className="h-5 w-5 text-[#2E7D32] mb-2" />
            <p className="text-xs text-gray-500">{language === "sw" ? "Majengo" : "Buildings"}</p>
            <p className="text-2xl font-bold text-gray-900">
              {assets.filter(a => a.type === "building").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Droplet className="h-5 w-5 text-[#2E7D32] mb-2" />
            <p className="text-xs text-gray-500">{language === "sw" ? "Maji" : "Water"}</p>
            <p className="text-2xl font-bold text-gray-900">
              {assets.filter(a => a.type === "water").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Grid3x3 className="h-5 w-5 text-[#2E7D32] mb-2" />
            <p className="text-xs text-gray-500">{language === "sw" ? "Vifaa" : "Equipment"}</p>
            <p className="text-2xl font-bold text-gray-900">
              {assets.filter(a => a.type === "equipment").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assets List */}
      <div className="grid gap-3">
        {assets.map((asset) => (
          <Card key={asset.id} className="border border-gray-200 hover:border-[#2E7D32] transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {getAssetIcon(asset.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{asset.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{asset.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {asset.type === "building" && (language === "sw" ? "Jengo" : "Building")}
                      {asset.type === "water" && (language === "sw" ? "Maji" : "Water")}
                      {asset.type === "equipment" && (language === "sw" ? "Kifaa" : "Equipment")}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      toast.info(language === "sw" ? "Hariri rasilimali" : "Edit asset");
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteAsset(asset.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {assets.length === 0 && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {language === "sw" 
                ? "Hakuna rasilimali zimeongezwa bado."
                : "No assets added yet."}
            </p>
            <Button 
              onClick={() => setShowAddAssetDialog(true)}
              className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === "sw" ? "Ongeza Rasilimali" : "Add First Asset"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // ==========================================
  // TAB 3: ANALYTICS VIEW
  // ==========================================

  const AnalyticsView = () => {
    const soilTypes = [...new Set(fields.map(f => f.soilType))];
    const cropDistribution = fields.filter(f => f.crop !== "None").reduce((acc, field) => {
      acc[field.crop] = (acc[field.crop] || 0) + field.area;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {language === "sw" ? "Uchambuzi wa Shamba" : "Farm Analytics"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {language === "sw" 
              ? "Takwimu na maelezo ya shamba lako" 
              : "Statistics and insights about your farm"}
          </p>
        </div>

        {/* Farm Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {language === "sw" ? "Ufanisi wa Shamba" : "Farm Efficiency"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">
                  {language === "sw" ? "Matumizi ya Ardhi" : "Land Utilization"}
                </span>
                <span className="font-medium text-gray-900">
                  {((activeArea / totalFarmArea) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-[#2E7D32]"
                  style={{ width: `${(activeArea / totalFarmArea) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  {language === "sw" ? "Mashamba Yanayotumika" : "Active Fields"}
                </p>
                <p className="text-2xl font-bold text-[#2E7D32]">{activeFieldsCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  {language === "sw" ? "Wastani wa Ukubwa" : "Avg Field Size"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(totalFarmArea / fields.length || 0).toFixed(1)} <span className="text-sm">acres</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crop Distribution */}
        {Object.keys(cropDistribution).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {language === "sw" ? "Usambazaji wa Mazao" : "Crop Distribution"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(cropDistribution).map(([crop, area]) => (
                <div key={crop}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900">{crop}</span>
                    <span className="text-gray-600">
                      {area.toFixed(1)} acres ({((area / totalFarmArea) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-[#2E7D32]"
                      style={{ width: `${(area / totalFarmArea) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Soil Types */}
        {soilTypes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {language === "sw" ? "Aina za Udongo" : "Soil Types"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {soilTypes.map(soil => (
                  <Badge key={soil} variant="outline">
                    {soil}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // ==========================================
  // DIALOGS
  // ==========================================

  const AddFieldDialog = () => (
    <Dialog open={showAddFieldDialog} onOpenChange={setShowAddFieldDialog}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {language === "sw" ? "Ongeza Shamba Jipya" : "Add New Field"}
          </DialogTitle>
          <DialogDescription>
            {language === "sw" 
              ? "Rekodi taarifa za shamba lako" 
              : "Record your field information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fieldName">
              {language === "sw" ? "Jina la Shamba" : "Field Name"} *
            </Label>
            <Input
              id="fieldName"
              placeholder={language === "sw" ? "Mfano: Shamba A - Kaskazini" : "e.g., Field A - North"}
              value={fieldForm.name}
              onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fieldArea">
              {language === "sw" ? "Ukubwa (ekari)" : "Area (acres)"} *
            </Label>
            <Input
              id="fieldArea"
              type="number"
              step="0.1"
              placeholder="5.2"
              value={fieldForm.area}
              onChange={(e) => setFieldForm({ ...fieldForm, area: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fieldCrop">
              {language === "sw" ? "Zao la Sasa" : "Current Crop"}
            </Label>
            <Input
              id="fieldCrop"
              placeholder={language === "sw" ? "Mfano: Mahindi" : "e.g., Maize"}
              value={fieldForm.crop}
              onChange={(e) => setFieldForm({ ...fieldForm, crop: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="soilType">
              {language === "sw" ? "Aina ya Udongo" : "Soil Type"}
            </Label>
            <Input
              id="soilType"
              placeholder={language === "sw" ? "Mfano: Udongo wa matope" : "e.g., Clay Loam"}
              value={fieldForm.soilType}
              onChange={(e) => setFieldForm({ ...fieldForm, soilType: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fieldStatus">
              {language === "sw" ? "Hali" : "Status"}
            </Label>
            <Select
              value={fieldForm.status}
              onValueChange={(value) => setFieldForm({ ...fieldForm, status: value as Field["status"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{language === "sw" ? "Inatumika" : "Active"}</SelectItem>
                <SelectItem value="fallow">{language === "sw" ? "Inalala" : "Fallow"}</SelectItem>
                <SelectItem value="preparing">{language === "sw" ? "Inatengenezwa" : "Preparing"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fieldNotes">
              {language === "sw" ? "Maelezo" : "Notes"} ({language === "sw" ? "Si lazima" : "Optional"})
            </Label>
            <Input
              id="fieldNotes"
              placeholder={language === "sw" ? "Maelezo yoyote" : "Any notes"}
              value={fieldForm.notes}
              onChange={(e) => setFieldForm({ ...fieldForm, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setShowAddFieldDialog(false)}
          >
            {language === "sw" ? "Ghairi" : "Cancel"}
          </Button>
          <Button
            onClick={handleAddField}
            className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
          >
            {language === "sw" ? "Ongeza Shamba" : "Add Field"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const AddAssetDialog = () => (
    <Dialog open={showAddAssetDialog} onOpenChange={setShowAddAssetDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === "sw" ? "Ongeza Rasilimali" : "Add Asset"}
          </DialogTitle>
          <DialogDescription>
            {language === "sw" 
              ? "Rekodi rasilimali za shamba lako" 
              : "Record your farm assets"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="assetName">
              {language === "sw" ? "Jina" : "Name"} *
            </Label>
            <Input
              id="assetName"
              placeholder={language === "sw" ? "Mfano: Ghala Kuu" : "e.g., Main Storage Barn"}
              value={assetForm.name}
              onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetType">
              {language === "sw" ? "Aina" : "Type"} *
            </Label>
            <Select
              value={assetForm.type}
              onValueChange={(value) => setAssetForm({ ...assetForm, type: value as Asset["type"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="building">{language === "sw" ? "Jengo" : "Building"}</SelectItem>
                <SelectItem value="water">{language === "sw" ? "Maji" : "Water Source"}</SelectItem>
                <SelectItem value="equipment">{language === "sw" ? "Vifaa" : "Equipment"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetDescription">
              {language === "sw" ? "Maelezo" : "Description"}
            </Label>
            <Input
              id="assetDescription"
              placeholder={language === "sw" ? "Maelezo mafupi" : "Brief description"}
              value={assetForm.description}
              onChange={(e) => setAssetForm({ ...assetForm, description: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setShowAddAssetDialog(false)}
          >
            {language === "sw" ? "Ghairi" : "Cancel"}
          </Button>
          <Button
            onClick={handleAddAsset}
            className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
          >
            {language === "sw" ? "Ongeza" : "Add Asset"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // ==========================================
  // RENDER MAIN COMPONENT
  // ==========================================

  return (
    <div className="space-y-6 pb-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="fields" className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">
              {language === "sw" ? "Mashamba" : "Fields"}
            </span>
          </TabsTrigger>
          <TabsTrigger value="assets" className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]">
            <Home className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">
              {language === "sw" ? "Rasilimali" : "Assets"}
            </span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]">
            <BarChart3 className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">
              {language === "sw" ? "Uchambuzi" : "Analytics"}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fields" className="mt-6">
          <FieldsView />
        </TabsContent>

        <TabsContent value="assets" className="mt-6">
          <AssetsView />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsView />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddFieldDialog />
      <AddAssetDialog />
    </div>
  );
}
