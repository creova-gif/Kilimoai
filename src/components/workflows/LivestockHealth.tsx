import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import {
  Heart,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Pill,
  Syringe,
  Calendar,
  Bell,
  TrendingUp
} from "lucide-react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface LivestockAnimal {
  id: string;
  tagId: string;
  type: "Cattle" | "Goat" | "Sheep" | "Chicken" | "Pig" | "Donkey";
  breed: string;
  age: number;
  weight: number;
  healthStatus: "healthy" | "sick" | "recovering" | "critical";
  lastCheckup: string;
  vaccinations: Vaccination[];
  healthAlerts: HealthAlert[];
  treatmentPlan?: TreatmentPlan;
}

interface Vaccination {
  name: string;
  date: string;
  nextDue: string;
  status: "due" | "upcoming" | "completed";
}

interface HealthAlert {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  symptom: string;
  detectedDate: string;
  aiDiagnosis: string;
  recommendedAction: string;
  status: "new" | "monitoring" | "treated" | "resolved";
}

interface TreatmentPlan {
  diagnosis: string;
  treatments: string[];
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  followUpDate: string;
  cost: number;
  prognosis: string;
}

interface LivestockHealthProps {
  userId: string;
  userRole: string;
}

const LIVESTOCK_TYPES = ["Cattle", "Goat", "Sheep", "Chicken", "Pig", "Donkey"];
const COMMON_SYMPTOMS = [
  "Loss of appetite",
  "Lethargy/weakness",
  "Fever",
  "Coughing",
  "Diarrhea",
  "Lameness",
  "Discharge from nose/eyes",
  "Skin lesions",
  "Abnormal breathing",
  "Weight loss",
  "Bloating",
  "Mastitis (udder inflammation)"
];

export function LivestockHealth({ userId, userRole }: LivestockHealthProps) {
  const [animals, setAnimals] = useState<LivestockAnimal[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<LivestockAnimal | null>(null);
  const [showReportSymptom, setShowReportSymptom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diagnosing, setDiagnosing] = useState(false);

  const [symptomForm, setSymptomForm] = useState({
    animalId: "",
    symptoms: [] as string[],
    description: "",
    duration: "",
    severity: "medium" as "low" | "medium" | "high" | "critical"
  });

  useEffect(() => {
    loadAnimals();
  }, [userId]);

  const loadAnimals = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/livestock/${userId}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      const data = await response.json();
      if (data.success) {
        setAnimals(data.animals || []);
      }
    } catch (error) {
      console.error("Error loading livestock:", error);
    } finally {
      setLoading(false);
    }
  };

  const reportSymptom = async () => {
    setDiagnosing(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/livestock/diagnose`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            userId,
            ...symptomForm
          })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        await loadAnimals();
        setShowReportSymptom(false);
        setSymptomForm({
          animalId: "",
          symptoms: [],
          description: "",
          duration: "",
          severity: "medium"
        });
        alert("AI diagnosis completed! Check the animal's health alerts.");
      } else {
        alert(data.error || "Failed to generate diagnosis");
      }
    } catch (error) {
      console.error("Error reporting symptom:", error);
      alert("Failed to report symptom");
    } finally {
      setDiagnosing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-100 text-green-800";
      case "recovering": return "bg-gray-100 text-gray-800";
      case "sick": return "bg-orange-100 text-orange-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const healthyCount = animals.filter(a => a.healthStatus === "healthy").length;
  const sickCount = animals.filter(a => a.healthStatus === "sick" || a.healthStatus === "critical").length;
  const pendingAlerts = animals.reduce((acc, a) => acc + a.healthAlerts.filter(h => h.status === "new").length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-600" />
            Livestock Health & Treatment Alerts
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            AI-powered health monitoring, diagnosis, and treatment recommendations
          </p>
        </div>
        <Button onClick={() => setShowReportSymptom(true)} className="bg-red-600">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report Symptom
        </Button>
      </div>

      {/* Health Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Animals</p>
                <p className="text-2xl font-bold">{animals.length}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Heart className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Healthy</p>
                <p className="text-2xl font-bold text-green-600">{healthyCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Need Attention</p>
                <p className="text-2xl font-bold text-orange-600">{sickCount}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Pending Alerts</p>
                <p className="text-2xl font-bold text-red-600">{pendingAlerts}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Bell className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Symptom Form */}
      {showReportSymptom && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle>Report Animal Symptom for AI Diagnosis</CardTitle>
            <CardDescription>
              Describe the symptoms and let AI diagnose and recommend treatment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Animal</Label>
              <Select
                value={symptomForm.animalId}
                onValueChange={(value) => setSymptomForm(prev => ({ ...prev, animalId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select animal" />
                </SelectTrigger>
                <SelectContent>
                  {animals.map(animal => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.type} - {animal.tagId} ({animal.breed})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Observed Symptoms</Label>
              <div className="grid grid-cols-2 gap-2">
                {COMMON_SYMPTOMS.map(symptom => (
                  <label key={symptom} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={symptomForm.symptoms.includes(symptom)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSymptomForm(prev => ({ ...prev, symptoms: [...prev.symptoms, symptom] }));
                        } else {
                          setSymptomForm(prev => ({ ...prev, symptoms: prev.symptoms.filter(s => s !== symptom) }));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional Description</Label>
              <Textarea
                placeholder="Describe any other symptoms or observations..."
                value={symptomForm.description}
                onChange={(e) => setSymptomForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  placeholder="e.g., 2 days"
                  value={symptomForm.duration}
                  onChange={(e) => setSymptomForm(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Severity</Label>
                <Select
                  value={symptomForm.severity}
                  onValueChange={(value: any) => setSymptomForm(prev => ({ ...prev, severity: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Minor discomfort</SelectItem>
                    <SelectItem value="medium">Medium - Noticeable symptoms</SelectItem>
                    <SelectItem value="high">High - Severe symptoms</SelectItem>
                    <SelectItem value="critical">Critical - Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={reportSymptom}
                disabled={!symptomForm.animalId || symptomForm.symptoms.length === 0 || diagnosing}
                className="bg-red-600"
              >
                {diagnosing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    AI Diagnosing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get AI Diagnosis
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowReportSymptom(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Animals List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
      ) : animals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-semibold mb-2">No livestock registered</h3>
            <p className="text-sm text-gray-600">
              Add animals to your farm to start tracking their health
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {animals.map(animal => (
            <Card key={animal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      {animal.type} - {animal.tagId}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span>{animal.breed}</span>
                      <span>{animal.age} years</span>
                      <span>{animal.weight} kg</span>
                    </CardDescription>
                  </div>
                  <Badge className={getHealthStatusColor(animal.healthStatus)}>
                    {animal.healthStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Health Alerts */}
                {animal.healthAlerts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      Health Alerts ({animal.healthAlerts.length})
                    </h4>
                    {animal.healthAlerts.map(alert => (
                      <div key={alert.id} className="border-l-4 border-orange-500 bg-orange-50 p-3 rounded">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{alert.symptom}</p>
                            <p className="text-xs text-gray-600">
                              Detected: {new Date(alert.detectedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <div className="space-y-2 mt-2">
                          <div className="bg-white p-2 rounded text-sm">
                            <p className="font-medium text-xs text-gray-600 mb-1">AI Diagnosis:</p>
                            <p>{alert.aiDiagnosis}</p>
                          </div>
                          <div className="bg-white p-2 rounded text-sm">
                            <p className="font-medium text-xs text-gray-600 mb-1">Recommended Action:</p>
                            <p>{alert.recommendedAction}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Treatment Plan */}
                {animal.treatmentPlan && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Pill className="h-4 w-4 text-gray-600" />
                      Active Treatment Plan
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Diagnosis</p>
                        <p className="text-sm font-semibold">{animal.treatmentPlan.diagnosis}</p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Treatments</p>
                        {animal.treatmentPlan.treatments.map((treatment, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm mb-1">
                            <CheckCircle2 className="h-4 w-4 text-gray-600 mt-0.5" />
                            <span>{treatment}</span>
                          </div>
                        ))}
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Medications</p>
                        {animal.treatmentPlan.medications.map((med, idx) => (
                          <div key={idx} className="bg-white p-2 rounded text-sm mb-2">
                            <p className="font-medium flex items-center gap-2">
                              <Syringe className="h-3 w-3 text-gray-600" />
                              {med.name}
                            </p>
                            <div className="text-xs text-gray-600 mt-1 grid grid-cols-3 gap-2">
                              <span>Dosage: {med.dosage}</span>
                              <span>Frequency: {med.frequency}</span>
                              <span>Duration: {med.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-600">Follow-up</p>
                          <p className="text-sm font-semibold flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {animal.treatmentPlan.followUpDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Est. Cost</p>
                          <p className="text-sm font-semibold">
                            TZS {animal.treatmentPlan.cost.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Prognosis</p>
                          <p className="text-sm font-semibold text-green-600">
                            {animal.treatmentPlan.prognosis}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vaccinations */}
                {animal.vaccinations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Syringe className="h-4 w-4 text-gray-600" />
                      Vaccination Schedule
                    </h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {animal.vaccinations.map((vac, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200">
                          <p className="font-medium text-sm">{vac.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-600">
                              Last: {new Date(vac.date).toLocaleDateString()}
                            </p>
                            <Badge className={
                              vac.status === "due" ? "bg-red-100 text-red-800" :
                              vac.status === "upcoming" ? "bg-yellow-100 text-yellow-800" :
                              "bg-green-100 text-green-800"
                            }>
                              {vac.status === "due" ? `Due: ${vac.nextDue}` : vac.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}