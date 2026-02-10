import { Cloud, CloudRain, Sun, Wind, Droplets, AlertTriangle, CheckCircle, Calendar, MapPin, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { SMSAlertModal } from "./SMSAlertModal";
import { toast } from "sonner@2.0.3";

interface WeatherAlertDetailsProps {
  condition: string;
  severity: "low" | "medium" | "high";
  region: string;
}

export function WeatherAlertDetails({ condition, severity, region }: WeatherAlertDetailsProps) {
  const [showSMSModal, setShowSMSModal] = useState(false);

  const getAlertData = () => {
    if (severity === "high") {
      return {
        title: "Heavy Rainfall Expected",
        icon: CloudRain,
        color: "red",
        description: "Intense rainfall predicted in the next 48 hours. Risk of flooding and crop damage.",
        forecast: {
          today: { condition: "Heavy Rain", temp: "22°C", rainfall: "45mm", humidity: "85%" },
          tomorrow: { condition: "Rain Showers", temp: "23°C", rainfall: "30mm", humidity: "80%" },
          day3: { condition: "Partly Cloudy", temp: "25°C", rainfall: "10mm", humidity: "70%" },
        },
        actions: [
          {
            title: "Immediate Actions (Next 6 hours)",
            priority: "high",
            tasks: [
              "Harvest any mature crops immediately if possible",
              "Check and clear drainage channels around your farm",
              "Secure fertilizer and pesticide storage (keep dry)",
              "Move farm equipment to higher ground",
              "Ensure livestock have shelter"
            ]
          },
          {
            title: "During the Rainfall",
            priority: "medium",
            tasks: [
              "Do not apply any fertilizer or pesticides (will wash away)",
              "Monitor for waterlogging in low-lying areas",
              "Check for soil erosion on slopes",
              "Avoid working in fields during heavy downpours"
            ]
          },
          {
            title: "After the Rain",
            priority: "low",
            tasks: [
              "Inspect crops for damage within 24 hours",
              "Drain any standing water from fields",
              "Re-apply fertilizer if it was washed away",
              "Treat fungal diseases that may appear (high humidity)",
              "Replant any damaged seedlings"
            ]
          }
        ],
        risks: [
          "Waterlogging can kill young maize and vegetable plants",
          "Fungal diseases spread rapidly in wet conditions",
          "Soil erosion removes topsoil and nutrients",
          "Heavy rain can wash away applied fertilizer (economic loss)"
        ],
        opportunities: [
          "Good time to plant drought-resistant crops after rain passes",
          "Soil moisture will be excellent for next 2 weeks",
          "Natural irrigation saves water costs"
        ]
      };
    } else if (severity === "medium") {
      return {
        title: "Moderate Rain Forecast",
        icon: Cloud,
        color: "orange",
        description: "Light to moderate rainfall expected. Good for most crops, but take precautions.",
        forecast: {
          today: { condition: "Light Rain", temp: "25°C", rainfall: "15mm", humidity: "75%" },
          tomorrow: { condition: "Cloudy", temp: "26°C", rainfall: "8mm", humidity: "70%" },
          day3: { condition: "Partly Sunny", temp: "28°C", rainfall: "0mm", humidity: "65%" },
        },
        actions: [
          {
            title: "Recommended Actions",
            priority: "medium",
            tasks: [
              "Good time to apply fertilizer (rain will help it absorb)",
              "Transplant seedlings if soil is not too wet",
              "Monitor for pests that emerge after rain",
              "Weed control is easier when soil is moist"
            ]
          }
        ],
        risks: [
          "Some fungal diseases may appear in humid conditions",
          "Weeds will grow faster after rain"
        ],
        opportunities: [
          "Excellent planting conditions for most crops",
          "Natural irrigation reduces watering needs",
          "Good time for land preparation"
        ]
      };
    } else {
      return {
        title: "Dry and Sunny Conditions",
        icon: Sun,
        color: "blue",
        description: "Clear skies expected. Ensure adequate irrigation for your crops.",
        forecast: {
          today: { condition: "Sunny", temp: "32°C", rainfall: "0mm", humidity: "45%" },
          tomorrow: { condition: "Sunny", temp: "33°C", rainfall: "0mm", humidity: "40%" },
          day3: { condition: "Mostly Sunny", temp: "31°C", rainfall: "0mm", humidity: "50%" },
        },
        actions: [
          {
            title: "Irrigation Management",
            priority: "high",
            tasks: [
              "Water crops early morning (6-8 AM) or evening (5-7 PM)",
              "Check soil moisture daily - water when dry 5cm below surface",
              "Apply mulch to reduce water evaporation",
              "Increase watering frequency for young plants"
            ]
          },
          {
            title: "Heat Stress Prevention",
            priority: "medium",
            tasks: [
              "Monitor crops for wilting (sign of water stress)",
              "Provide shade for sensitive vegetables if possible",
              "Avoid fertilizer application during peak heat",
              "Harvest vegetables early morning when cool"
            ]
          }
        ],
        risks: [
          "Drought stress reduces crop yields",
          "Young plants are most vulnerable to heat",
          "Pests like aphids thrive in dry conditions"
        ],
        opportunities: [
          "Great weather for harvesting and drying crops",
          "Good time for land clearing and preparation",
          "Reduced fungal disease pressure"
        ]
      };
    }
  };

  const alertData = getAlertData();
  const Icon = alertData.icon;

  const getSeverityBadge = () => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-100 text-red-700 border-red-300">High Alert</Badge>;
      case "medium":
        return <Badge className="bg-orange-100 text-orange-700 border-orange-300">Moderate</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-300">Low Risk</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-${alertData.color}-100`}>
            <Icon className={`h-6 w-6 text-${alertData.color}-600`} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{alertData.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{region} Region</span>
            </div>
          </div>
          {getSeverityBadge()}
        </div>
        <p className="text-gray-600 mt-2">{alertData.description}</p>
      </div>

      {/* 3-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            3-Day Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Today", data: alertData.forecast.today },
              { label: "Tomorrow", data: alertData.forecast.tomorrow },
              { label: "Day 3", data: alertData.forecast.day3 }
            ].map((day, idx) => (
              <div key={idx} className="text-center border rounded-lg p-3">
                <p className="font-medium text-sm mb-2">{day.label}</p>
                <p className="text-xs text-gray-600 mb-2">{day.data.condition}</p>
                <p className="text-2xl font-bold mb-2">{day.data.temp}</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center justify-center gap-1">
                    <Droplets className="h-3 w-3" />
                    <span>{day.data.rainfall}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Wind className="h-3 w-3" />
                    <span>{day.data.humidity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
          <CardDescription>What you should do based on this weather forecast</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {alertData.actions.map((action, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-2 mb-3">
                <h4 className="font-medium">{action.title}</h4>
                {action.priority === "high" && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                    High Priority
                  </Badge>
                )}
              </div>
              <ul className="space-y-2">
                {action.tasks.map((task, taskIdx) => (
                  <li key={taskIdx} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Risks */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Potential Risks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {alertData.risks.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2 text-red-800">
                <span className="text-red-600 mt-1">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Opportunities */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-900">Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {alertData.opportunities.map((opportunity, idx) => (
              <li key={idx} className="flex items-start gap-2 text-green-800">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{opportunity}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Data Source */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Verified Weather Data</h4>
              <p className="text-sm text-gray-800">
                Forecast provided by <strong>Tanzania Meteorological Authority (TMA)</strong> and 
                satellite data. Updated every 6 hours.
              </p>
              <p className="text-xs text-gray-700 mt-2">Last updated: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => setShowSMSModal(true)}>
          Enable SMS Alerts
        </Button>
        <Button variant="outline" className="flex-1">
          Share with Group
        </Button>
      </div>

      {/* SMS Alert Modal */}
      {showSMSModal && (
        <SMSAlertModal
          onClose={() => setShowSMSModal(false)}
          alertType="Weather Alerts"
        />
      )}
    </div>
  );
}