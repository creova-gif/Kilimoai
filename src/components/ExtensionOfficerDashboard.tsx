import { useState } from "react";
import { Calendar, MapPin, Users, CheckCircle, Clock, AlertCircle, Camera, Phone, Navigation } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface FieldVisit {
  id: string;
  farmer: string;
  location: string;
  date: string;
  time: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  purpose: string;
  notes?: string;
  photos?: number;
  gpsCoords?: string;
}

interface FarmerProfile {
  name: string;
  phone: string;
  location: string;
  crops: string[];
  lastVisit: string;
  category: "progressive" | "traditional" | "struggling";
  adoptionRate: number;
}

export function ExtensionOfficerDashboard() {
  const [selectedVisit, setSelectedVisit] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");

  const visits: FieldVisit[] = [
    {
      id: "V001",
      farmer: "John Mwangi",
      location: "Kilosa District, Plot 234",
      date: "2024-12-10",
      time: "09:00 AM",
      status: "scheduled",
      purpose: "Maize pest inspection and treatment advice",
      gpsCoords: "-6.8333, 36.9833",
    },
    {
      id: "V002",
      farmer: "Grace Mollel",
      location: "Morogoro Town, Farm 12",
      date: "2024-12-10",
      time: "02:00 PM",
      status: "scheduled",
      purpose: "Tomato planting technique demonstration",
      gpsCoords: "-6.8235, 37.6619",
    },
    {
      id: "V003",
      farmer: "Peter Komba",
      location: "Mvomero District, Village A",
      date: "2024-12-08",
      time: "10:00 AM",
      status: "completed",
      purpose: "Follow-up on fertilizer application",
      notes: "Farmer successfully applied DAP. Crop showing good response. Recommended additional urea in 2 weeks.",
      photos: 4,
      gpsCoords: "-6.4000, 37.5000",
    },
    {
      id: "V004",
      farmer: "Amina Hassan",
      location: "Gairo District, Plot 89",
      date: "2024-12-09",
      time: "11:30 AM",
      status: "in-progress",
      purpose: "Rice disease diagnosis",
      photos: 2,
      gpsCoords: "-6.0833, 36.8167",
    },
  ];

  const upcomingVisits = visits.filter(v => v.status === "scheduled" || v.status === "in-progress");
  const completedVisits = visits.filter(v => v.status === "completed");

  const farmerProfiles: FarmerProfile[] = [
    {
      name: "John Mwangi",
      phone: "+255 XXX XXX 001",
      location: "Kilosa District",
      crops: ["Maize", "Beans"],
      lastVisit: "2024-11-15",
      category: "progressive",
      adoptionRate: 85,
    },
    {
      name: "Grace Mollel",
      phone: "+255 XXX XXX 002",
      location: "Morogoro Town",
      crops: ["Tomatoes", "Vegetables"],
      lastVisit: "2024-10-20",
      category: "traditional",
      adoptionRate: 45,
    },
    {
      name: "Peter Komba",
      phone: "+255 XXX XXX 003",
      location: "Mvomero District",
      crops: ["Rice", "Maize"],
      lastVisit: "2024-12-08",
      category: "progressive",
      adoptionRate: 78,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-300">Scheduled</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-700 border-green-300">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-300">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "progressive":
        return <Badge className="bg-green-100 text-green-700">Progressive</Badge>;
      case "traditional":
        return <Badge className="bg-gray-100 text-gray-700">Traditional</Badge>;
      case "struggling":
        return <Badge className="bg-red-100 text-red-700">Needs Support</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today's Visits</p>
                <p className="text-2xl font-bold text-green-600">4</p>
              </div>
              <Calendar className="h-10 w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Farmers Managed</p>
                <p className="text-2xl font-bold text-gray-900">48</p>
              </div>
              <Users className="h-10 w-10 text-gray-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-2xl font-bold text-orange-600">12</p>
              </div>
              <Clock className="h-10 w-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Adoption</p>
                <p className="text-2xl font-bold text-orange-600">68%</p>
              </div>
              <CheckCircle className="h-10 w-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule New Visit */}
      <Button className="w-full bg-green-600 hover:bg-green-700">
        <Calendar className="h-4 w-4 mr-2" />
        Schedule New Field Visit
      </Button>

      {/* Field Visits */}
      <Card>
        <CardHeader>
          <CardTitle>Field Visit Schedule</CardTitle>
          <CardDescription>Manage and track your farm visits</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "upcoming"
                  ? "border-green-600 text-green-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Upcoming ({upcomingVisits.length})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "completed"
                  ? "border-green-600 text-green-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Completed ({completedVisits.length})
            </button>
          </div>

          {/* Visit List */}
          <div className="space-y-4">
            {(activeTab === "upcoming" ? upcomingVisits : completedVisits).map((visit) => (
              <Card 
                key={visit.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedVisit === visit.id ? 'border-green-500 border-2' : ''
                }`}
                onClick={() => setSelectedVisit(selectedVisit === visit.id ? null : visit.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{visit.farmer}</h4>
                        {getStatusBadge(visit.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{visit.purpose}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {visit.date} at {visit.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {visit.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedVisit === visit.id && (
                    <div className="border-t pt-4 mt-4 space-y-4">
                      {visit.gpsCoords && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium mb-1">GPS Coordinates:</p>
                          <p className="text-sm text-gray-600 font-mono">{visit.gpsCoords}</p>
                        </div>
                      )}

                      {visit.notes && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-green-900 mb-1">Visit Notes:</p>
                          <p className="text-sm text-green-800">{visit.notes}</p>
                        </div>
                      )}

                      {visit.photos && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Camera className="h-4 w-4" />
                          <span>{visit.photos} photos attached</span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {visit.status === "scheduled" && (
                          <>
                            <Button className="flex-1 bg-green-600 hover:bg-green-700">
                              <Navigation className="h-4 w-4 mr-2" />
                              Navigate to Farm
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Phone className="h-4 w-4 mr-2" />
                              Call Farmer
                            </Button>
                          </>
                        )}
                        {visit.status === "in-progress" && (
                          <>
                            <Button className="flex-1 bg-green-600 hover:bg-green-700">
                              <Camera className="h-4 w-4 mr-2" />
                              Add Photos
                            </Button>
                            <Button variant="outline" className="flex-1">
                              Complete Visit
                            </Button>
                          </>
                        )}
                        {visit.status === "completed" && (
                          <Button variant="outline" className="w-full">
                            View Full Report
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Farmer Profiles */}
      <Card>
        <CardHeader>
          <CardTitle>Farmer Profiles & Segmentation</CardTitle>
          <CardDescription>Track farmer progress and personalize interventions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {farmerProfiles.map((farmer, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{farmer.name}</h4>
                    {getCategoryBadge(farmer.category)}
                  </div>
                  <p className="text-sm text-gray-600">{farmer.location}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                <div>
                  <p className="text-gray-500">Crops</p>
                  <p className="font-medium">{farmer.crops.join(", ")}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Visit</p>
                  <p className="font-medium">{farmer.lastVisit}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{farmer.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Adoption Rate</p>
                  <p className="font-medium text-green-600">{farmer.adoptionRate}%</p>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Advisory Adoption Progress</span>
                  <span className="font-medium">{farmer.adoptionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${farmer.adoptionRate}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1">
                  View Full Profile
                </Button>
                <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                  Schedule Visit
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Offline Sync Status */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Offline Mode Active</h4>
              <p className="text-sm text-gray-700 mt-1">
                All visit data is saved locally and will sync when you're back online. Last sync: 2 hours ago
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance KPIs */}
      <Card>
        <CardHeader>
          <CardTitle>Your Performance Metrics</CardTitle>
          <CardDescription>This month's achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Farmers Reached</span>
                <span className="font-medium">48/50 (96%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "96%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Advisory Adoption Rate</span>
                <span className="font-medium">68/80 (85%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "85%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Field Visits Completed</span>
                <span className="font-medium">34/40 (85%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: "85%" }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}