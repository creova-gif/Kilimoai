import { Leaf, AlertTriangle, CheckCircle, Camera, Droplets, Bug, Wind, Sun, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface CropHealthDetailsProps {
  status: "healthy" | "warning" | "critical";
  crop: string;
}

export function CropHealthDetails({ status, crop }: CropHealthDetailsProps) {
  const getHealthData = () => {
    if (status === "critical") {
      return {
        title: "Critical - Immediate Action Required",
        color: "red",
        icon: AlertTriangle,
        score: 35,
        description: "Multiple serious issues detected. Take immediate action to prevent crop loss.",
        issues: [
          {
            severity: "high",
            name: "Severe Pest Infestation",
            details: "Fall armyworm detected at high density (>8 larvae per plant)",
            symptoms: ["Holes in leaves", "Brown frass visible", "Damaged growing points"],
            immediateActions: [
              "Apply pesticide immediately (Cypermethrin or Chlorantraniliprole)",
              "Scout entire field and treat affected areas",
              "Remove and destroy severely damaged plants",
              "Apply early morning or late evening for best results"
            ],
            preventionCost: "15,000 - 25,000 TZS per acre",
            expectedLoss: "Up to 40% yield loss if untreated"
          },
          {
            severity: "high",
            name: "Nitrogen Deficiency",
            details: "Severe yellowing of lower leaves indicating critical N shortage",
            symptoms: ["Yellow lower leaves", "Stunted growth", "Thin stems"],
            immediateActions: [
              "Apply urea fertilizer at 50kg per acre immediately",
              "Water after application if no rain expected",
              "Consider foliar spray for quick response",
              "Monitor recovery within 7 days"
            ],
            preventionCost: "80,000 - 100,000 TZS per 50kg urea",
            expectedLoss: "30% yield reduction if not corrected within 1 week"
          }
        ],
        monitoring: "Daily inspection required until issues resolved",
        urgency: "Act within 48 hours"
      };
    } else if (status === "warning") {
      return {
        title: "Warning - Attention Needed",
        color: "orange",
        icon: AlertTriangle,
        score: 65,
        description: "Minor issues detected that need attention to prevent escalation.",
        issues: [
          {
            severity: "medium",
            name: "Early Blight Symptoms",
            details: "Small brown spots appearing on lower leaves - early stage fungal infection",
            symptoms: ["Brown spots with concentric rings", "Yellowing around spots", "Starting on lower leaves"],
            immediateActions: [
              "Remove and burn affected leaves",
              "Apply copper-based fungicide",
              "Improve air circulation between plants",
              "Avoid overhead watering",
              "Monitor closely for spread"
            ],
            preventionCost: "8,000 - 12,000 TZS per liter fungicide",
            expectedLoss: "5-10% yield loss if managed early"
          },
          {
            severity: "medium",
            name: "Mild Water Stress",
            details: "Some wilting during midday heat - indicates need for irrigation",
            symptoms: ["Leaves droop at midday", "Soil dry 10cm below surface", "Slower growth rate"],
            immediateActions: [
              "Increase watering frequency",
              "Water deeply (20-30 liters per sq meter)",
              "Apply mulch to retain moisture",
              "Water early morning or evening",
              "Check soil moisture daily"
            ],
            preventionCost: "Variable (depends on water source)",
            expectedLoss: "10-15% yield reduction if stress continues"
          }
        ],
        monitoring: "Check every 2-3 days",
        urgency: "Address within 1 week"
      };
    } else {
      return {
        title: "Healthy - Excellent Condition",
        color: "green",
        icon: CheckCircle,
        score: 92,
        description: "Your crops are in excellent condition. Continue current management practices.",
        issues: [], // No issues
        strengths: [
          {
            aspect: "Plant Vigor",
            status: "Excellent",
            details: "Dark green leaves, strong stems, active growth - indicates optimal nutrition and water",
            maintainActions: [
              "Continue current fertilizer schedule",
              "Maintain regular watering routine",
              "Monitor for any changes in color or growth"
            ]
          },
          {
            aspect: "Pest & Disease Pressure",
            status: "Low",
            details: "No significant pests or diseases detected - good preventive management",
            maintainActions: [
              "Continue weekly field scouting",
              "Maintain field sanitation (remove plant debris)",
              "Practice crop rotation next season",
              "Keep records of pest/disease observations"
            ]
          },
          {
            aspect: "Soil Health",
            status: "Good",
            details: "Well-drained soil with good structure, adequate organic matter",
            maintainActions: [
              "Consider cover crops after harvest",
              "Add compost or manure annually",
              "Minimize soil compaction (reduce heavy equipment)"
            ]
          }
        ],
        nextSteps: [
          {
            stage: "Flowering (Expected in 2 weeks)",
            actions: ["Ensure adequate water during flowering", "Watch for flower pests", "Prepare for top-dressing fertilizer"]
          },
          {
            stage: "Grain Filling (Expected in 5 weeks)",
            actions: ["Maintain consistent moisture", "Monitor for grain pests", "Plan harvest logistics"]
          }
        ],
        monitoring: "Weekly inspection is sufficient",
        urgency: "No urgent actions needed"
      };
    }
  };

  const healthData = getHealthData();
  const Icon = healthData.icon;

  const getScoreColor = () => {
    if (healthData.score >= 80) return "text-green-600";
    if (healthData.score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-100 text-red-700 border-red-300">High Severity</Badge>;
      case "medium":
        return <Badge className="bg-orange-100 text-orange-700 border-orange-300">Medium</Badge>;
      case "low":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-${healthData.color}-100`}>
            <Icon className={`h-6 w-6 text-${healthData.color}-600`} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{crop} Health Assessment</h2>
            <p className="text-gray-600">{healthData.title}</p>
          </div>
        </div>
      </div>

      {/* Health Score */}
      <Card className={`border-2 border-${healthData.color}-300 bg-${healthData.color}-50`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Overall Health Score</p>
              <p className={`text-5xl font-bold ${getScoreColor()}`}>{healthData.score}/100</p>
            </div>
            <div className="relative w-24 h-24">
              <svg className="transform -rotate-90 w-24 h-24">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke={healthData.score >= 80 ? "#16a34a" : healthData.score >= 60 ? "#f97316" : "#dc2626"}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${(healthData.score / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-gray-700">{healthData.description}</p>
          
          {healthData.urgency && (
            <div className={`mt-4 p-3 rounded-lg border ${
              status === "critical" ? 'bg-red-100 border-red-300' : 'bg-orange-100 border-orange-300'
            }`}>
              <p className={`font-medium ${status === "critical" ? 'text-red-900' : 'text-orange-900'}`}>
                ⏰ {healthData.urgency}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Issues (if any) */}
      {healthData.issues && healthData.issues.length > 0 && (
        <div className="space-y-4">
          {healthData.issues.map((issue, idx) => (
            <Card key={idx} className="border-red-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-red-900">{issue.name}</CardTitle>
                    <CardDescription className="mt-1">{issue.details}</CardDescription>
                  </div>
                  {getSeverityBadge(issue.severity)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Symptoms */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Visible Symptoms:</h4>
                  <ul className="space-y-1">
                    {issue.symptoms.map((symptom, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Immediate Actions */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-3">Immediate Actions Required:</h4>
                  <ol className="space-y-2">
                    {issue.immediateActions.map((action, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2 text-sm">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-white text-xs font-medium flex-shrink-0">
                          {aIdx + 1}
                        </span>
                        <span className="text-orange-900 pt-0.5">{action}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Cost & Impact */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Treatment Cost</p>
                    <p className="font-medium text-sm">{issue.preventionCost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Potential Loss if Untreated</p>
                    <p className="font-medium text-sm text-red-600">{issue.expectedLoss}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Strengths (if healthy) */}
      {healthData.strengths && (
        <div className="space-y-4">
          {healthData.strengths.map((strength, idx) => (
            <Card key={idx} className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-green-900">{strength.aspect}</h4>
                      <Badge className="bg-green-600 text-white">{strength.status}</Badge>
                    </div>
                    <p className="text-sm text-green-800 mb-3">{strength.details}</p>
                    <div>
                      <p className="text-sm font-medium text-green-900 mb-2">Continue doing:</p>
                      <ul className="space-y-1">
                        {strength.maintainActions.map((action, aIdx) => (
                          <li key={aIdx} className="flex items-center gap-2 text-sm text-green-800">
                            <CheckCircle className="h-4 w-4" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Next Growth Stages (if healthy) */}
      {healthData.nextSteps && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Growth Stages</CardTitle>
            <CardDescription>Prepare for these critical phases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthData.nextSteps.map((step, idx) => (
              <div key={idx} className="border-l-4 border-green-600 pl-4">
                <h4 className="font-medium mb-2">{step.stage}</h4>
                <ul className="space-y-1">
                  {step.actions.map((action, aIdx) => (
                    <li key={aIdx} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Environmental Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Current Environmental Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Droplets className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Soil Moisture</p>
                <p className="font-medium">Optimal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                <Sun className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Sunlight</p>
                <p className="font-medium">Good</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Wind className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Air Circulation</p>
                <p className="font-medium">Adequate</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Leaf className="h-5 w-5 text-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Nutrient Level</p>
                <p className="font-medium">Good</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Schedule */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-gray-700 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Recommended Monitoring</h4>
              <p className="text-sm text-gray-800">{healthData.monitoring}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button className="bg-green-600 hover:bg-green-700">
          <Camera className="h-4 w-4 mr-2" />
          Take Photo for AI Analysis
        </Button>
        <Button variant="outline">
          Contact Extension Officer
        </Button>
        <Button variant="outline">
          View Treatment Products
        </Button>
        <Button variant="outline">
          Set Monitoring Reminder
        </Button>
      </div>
    </div>
  );
}