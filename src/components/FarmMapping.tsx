import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { 
  Map, MapPin, Plus, Layers, Satellite, Navigation,
  Edit, Trash2, Download, Upload, Maximize2,
  Sprout, Home, Droplet, Barn, AlertCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Field {
  id: string;
  name: string;
  area: number; // in acres
  crop: string;
  soilType: string;
  coordinates: { lat: number; lng: number }[];
  status: "active" | "fallow" | "preparing";
  color: string;
}

interface Asset {
  id: string;
  type: "building" | "water" | "equipment";
  name: string;
  location: { lat: number; lng: number };
  icon: string;
  description: string;
}

export function FarmMapping() {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [mapView, setMapView] = useState<"standard" | "satellite">("standard");
  const [showAddField, setShowAddField] = useState(false);

  // Mock field data
  const [fields, setFields] = useState<Field[]>([
    {
      id: "1",
      name: "Field A - North",
      area: 5.2,
      crop: "Maize",
      soilType: "Clay Loam",
      coordinates: [
        { lat: -3.3869, lng: 36.6833 },
        { lat: -3.3869, lng: 36.6843 },
        { lat: -3.3879, lng: 36.6843 },
        { lat: -3.3879, lng: 36.6833 }
      ],
      status: "active",
      color: "#22c55e"
    },
    {
      id: "2",
      name: "Field B - South",
      area: 3.8,
      crop: "Rice",
      soilType: "Sandy Loam",
      coordinates: [
        { lat: -3.3889, lng: 36.6833 },
        { lat: -3.3889, lng: 36.6843 },
        { lat: -3.3899, lng: 36.6843 },
        { lat: -3.3899, lng: 36.6833 }
      ],
      status: "active",
      color: "#3b82f6"
    },
    {
      id: "3",
      name: "Field C - West",
      area: 2.5,
      crop: "Fallow",
      soilType: "Loam",
      coordinates: [
        { lat: -3.3869, lng: 36.6823 },
        { lat: -3.3869, lng: 36.6830 },
        { lat: -3.3879, lng: 36.6830 },
        { lat: -3.3879, lng: 36.6823 }
      ],
      status: "fallow",
      color: "#a3a3a3"
    }
  ]);

  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      type: "building",
      name: "Main Storage Barn",
      location: { lat: -3.3874, lng: 36.6838 },
      icon: "🏠",
      description: "Primary storage facility"
    },
    {
      id: "2",
      type: "water",
      name: "Irrigation Well",
      location: { lat: -3.3884, lng: 36.6838 },
      icon: "💧",
      description: "Main water source"
    },
    {
      id: "3",
      type: "building",
      name: "Equipment Shed",
      location: { lat: -3.3874, lng: 36.6828 },
      icon: "🔧",
      description: "Tool and equipment storage"
    }
  ]);

  const totalFarmArea = fields.reduce((sum, field) => sum + field.area, 0);
  const activeFields = fields.filter(f => f.status === "active").length;
  const fallowArea = fields.filter(f => f.status === "fallow").reduce((sum, f) => sum + f.area, 0);

  const handleAddField = () => {
    toast.success("Field mapping feature", {
      description: "Use GPS to mark field boundaries on mobile"
    });
    setShowAddField(false);
  };

  const exportMap = () => {
    toast.success("Map exported!", {
      description: "Farm map downloaded as KML file"
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl mb-2">Farm Mapping</h1>
          <p className="text-gray-600">Visualize and manage your farm layout</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportMap}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showAddField} onOpenChange={setShowAddField}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Field</DialogTitle>
                <DialogDescription>
                  Use GPS to mark field boundaries
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Navigation className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        GPS Boundary Marking
                      </p>
                      <p className="text-xs text-blue-700">
                        On mobile, walk around your field perimeter while the app records GPS coordinates to automatically calculate area.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Field Name</Label>
                  <Input placeholder="e.g., North Field" />
                </div>

                <div className="space-y-2">
                  <Label>Crop/Use</Label>
                  <Input placeholder="e.g., Maize, Fallow" />
                </div>

                <div className="space-y-2">
                  <Label>Soil Type</Label>
                  <Input placeholder="e.g., Clay Loam" />
                </div>

                <Button onClick={handleAddField} className="w-full bg-green-600 hover:bg-green-700">
                  <Navigation className="h-4 w-4 mr-2" />
                  Start GPS Recording
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Farm Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Map className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">{totalFarmArea.toFixed(1)}</p>
              <p className="text-xs text-gray-600 mt-1">Total Acres</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Sprout className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{activeFields}</p>
              <p className="text-xs text-gray-600 mt-1">Active Fields</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Layers className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <p className="text-2xl font-bold">{fallowArea.toFixed(1)}</p>
              <p className="text-xs text-gray-600 mt-1">Fallow Acres</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Home className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold">{assets.length}</p>
              <p className="text-xs text-gray-600 mt-1">Assets Mapped</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Display */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Farm Map</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={mapView === "standard" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMapView("standard")}
                >
                  <Map className="h-4 w-4 mr-1" />
                  Standard
                </Button>
                <Button
                  variant={mapView === "satellite" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMapView("satellite")}
                >
                  <Satellite className="h-4 w-4 mr-1" />
                  Satellite
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Map Placeholder */}
            <div className="relative h-96 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
              {/* Simulated map background */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 grid-rows-8 h-full">
                  {[...Array(64)].map((_, i) => (
                    <div key={i} className="border border-gray-200" />
                  ))}
                </div>
              </div>

              {/* Fields overlay */}
              <div className="absolute inset-0 p-8">
                {/* Field A */}
                <div 
                  className="absolute top-1/4 left-1/4 w-32 h-32 rounded-lg opacity-70 border-4 border-green-600 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: fields[0].color }}
                  onClick={() => setSelectedField(fields[0].id)}
                >
                  <div className="absolute -top-6 left-0 bg-white px-2 py-1 rounded shadow text-xs font-medium">
                    {fields[0].name}
                  </div>
                </div>

                {/* Field B */}
                <div 
                  className="absolute bottom-1/4 left-1/4 w-24 h-24 rounded-lg opacity-70 border-4 border-blue-600 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: fields[1].color }}
                  onClick={() => setSelectedField(fields[1].id)}
                >
                  <div className="absolute -top-6 left-0 bg-white px-2 py-1 rounded shadow text-xs font-medium">
                    {fields[1].name}
                  </div>
                </div>

                {/* Field C */}
                <div 
                  className="absolute top-1/3 left-12 w-20 h-20 rounded-lg opacity-70 border-4 border-gray-400 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: fields[2].color }}
                  onClick={() => setSelectedField(fields[2].id)}
                >
                  <div className="absolute -top-6 left-0 bg-white px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
                    {fields[2].name}
                  </div>
                </div>

                {/* Assets */}
                {assets.map((asset, index) => (
                  <div
                    key={asset.id}
                    className="absolute"
                    style={{
                      top: `${30 + index * 15}%`,
                      right: `${20 + index * 10}%`
                    }}
                  >
                    <div className="relative group">
                      <div className="text-3xl cursor-pointer hover:scale-110 transition-transform">
                        {asset.icon}
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {asset.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Scale indicator */}
              <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded shadow text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-gray-900"></div>
                  <span>100m</span>
                </div>
              </div>

              {/* Compass */}
              <div className="absolute top-4 left-4 bg-white p-2 rounded-full shadow">
                <Navigation className="h-6 w-6 text-red-600" style={{ transform: 'rotate(0deg)' }} />
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  <strong>Mobile GPS Feature:</strong> On mobile devices, use GPS to walk field boundaries for accurate mapping. Works offline and syncs when connected.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Field List & Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fields</CardTitle>
              <CardDescription>{fields.length} mapped fields</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.map(field => (
                <div
                  key={field.id}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedField === field.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedField(field.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: field.color }}
                      />
                      <span className="font-medium text-sm">{field.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {field.area.toFixed(1)} ac
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Sprout className="h-3 w-3" />
                      <span>{field.crop}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="h-3 w-3" />
                      <span>{field.soilType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={
                          field.status === "active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {field.status}
                      </Badge>
                    </div>
                  </div>
                  {selectedField === field.id && (
                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Farm Assets</CardTitle>
              <CardDescription>{assets.length} locations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {assets.map(asset => (
                <div key={asset.id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{asset.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{asset.name}</p>
                      <p className="text-xs text-gray-600">{asset.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
