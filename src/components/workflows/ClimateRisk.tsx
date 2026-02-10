import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  AlertTriangle,
  Bell,
  TrendingDown,
  Loader2,
  CheckCircle2,
  XCircle,
  Calendar
} from "lucide-react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface ClimateAlert {
  id: string;
  type: "drought" | "flooding" | "frost" | "heatwave" | "strong_winds" | "pest_outbreak" | "disease_risk";
  severity: "low" | "moderate" | "high" | "critical";
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  affectedCrops: string[];
  region: string;
  probability: number;
  impact: {
    yieldLoss: string;
    actionRequired: boolean;
    timeframe: string;
  };
  recommendations: string[];
  preventiveMeasures: string[];
  status: "active" | "monitoring" | "resolved";
  createdDate: string;
}

interface ClimateRiskProps {
  userId: string;
  userRole: string;
}

const ALERT_ICONS = {
  drought: Thermometer,
  flooding: CloudRain,
  frost: CloudSnow,
  heatwave: Thermometer,
  strong_winds: Wind,
  pest_outbreak: AlertTriangle,
  disease_risk: AlertTriangle
};

export function ClimateRisk({ userId, userRole }: ClimateRiskProps) {
  const [alerts, setAlerts] = useState<ClimateAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAlerts();
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/climate-alerts/${userId}`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }
      );
      const data = await response.json();
      if (data.success) {
        setAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error("Error loading climate alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAlerts = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/climate-alerts/acknowledge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ alertId })
        }
      );
      await loadAlerts();
    } catch (error) {
      console.error("Error acknowledging alert:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-gray-100 text-gray-800 border-gray-300";
      case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "high": return "bg-orange-100 text-orange-800 border-orange-300";
      case "critical": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-red-100 text-red-800";
      case "monitoring": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const activeAlerts = alerts.filter(a => a.status === "active");
  const criticalAlerts = alerts.filter(a => a.severity === "critical" && a.status === "active");
  const highAlerts = alerts.filter(a => a.severity === "high" && a.status === "active");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CloudRain className="h-6 w-6 text-gray-600" />
            AI Climate Risk Alerts
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Real-time weather alerts and climate risk predictions
          </p>
        </div>
        <Button onClick={refreshAlerts} disabled={refreshing} variant="outline">
          {refreshing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <Bell className="h-4 w-4 mr-2" />
              Refresh Alerts
            </>
          )}
        </Button>
      </div>

      {/* Alert Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className={criticalAlerts.length > 0 ? "border-red-300 bg-red-50" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts.length}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={highAlerts.length > 0 ? "border-orange-300 bg-orange-50" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">High Severity</p>
                <p className="text-2xl font-bold text-orange-600">{highAlerts.length}</p>
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
                <p className="text-xs text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-600">{activeAlerts.length}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <CloudRain className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Card className="border-red-300 bg-gradient-to-r from-red-50 to-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 mb-1">
                  {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? "s" : ""} Requiring Immediate Attention
                </h3>
                <p className="text-sm text-red-700">
                  Take action immediately to protect your crops and livestock
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        </div>
      ) : alerts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h3 className="font-semibold mb-2 text-green-700">No Active Climate Risks</h3>
            <p className="text-sm text-gray-600">
              Your crops are currently safe from major climate threats
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {alerts.map(alert => {
            const AlertIcon = ALERT_ICONS[alert.type];
            return (
              <Card 
                key={alert.id} 
                className={`hover:shadow-lg transition-shadow border-2 ${
                  alert.severity === "critical" ? "border-red-300" :
                  alert.severity === "high" ? "border-orange-300" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        alert.severity === "critical" ? "bg-red-100" :
                        alert.severity === "high" ? "bg-orange-100" :
                        alert.severity === "moderate" ? "bg-yellow-100" : "bg-gray-100"
                      }`}>
                        <AlertIcon className={`h-5 w-5 ${
                          alert.severity === "critical" ? "text-red-600" :
                          alert.severity === "high" ? "text-orange-600" :
                          alert.severity === "moderate" ? "text-yellow-600" : "text-gray-600"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {alert.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(alert.startDate).toLocaleDateString()} - {new Date(alert.endDate).toLocaleDateString()}
                          </span>
                          <span>{alert.region}</span>
                          <span>{alert.probability}% probability</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity} severity
                      </Badge>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Description */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{alert.description}</p>
                  </div>

                  {/* Impact */}
                  <div className={`p-3 rounded-lg border-l-4 ${
                    alert.impact.actionRequired ? "border-red-500 bg-red-50" : "border-yellow-500 bg-yellow-50"
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        Expected Impact
                      </h4>
                      {alert.impact.actionRequired && (
                        <Badge className="bg-red-100 text-red-800">Action Required</Badge>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-600">Potential Yield Loss</p>
                        <p className="font-semibold text-red-700">{alert.impact.yieldLoss}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Action Timeframe</p>
                        <p className="font-semibold">{alert.impact.timeframe}</p>
                      </div>
                    </div>
                  </div>

                  {/* Affected Crops */}
                  {alert.affectedCrops.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-2">Affected Crops</p>
                      <div className="flex flex-wrap gap-2">
                        {alert.affectedCrops.map(crop => (
                          <Badge key={crop} variant="secondary">
                            {crop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preventive Measures */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-sm mb-2 text-gray-900 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-gray-600" />
                      Preventive Measures
                    </h4>
                    <div className="space-y-1">
                      {alert.preventiveMeasures.map((measure, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <div className="min-w-[4px] w-1 h-1 bg-gray-600 rounded-full mt-2" />
                          <span className="text-gray-900">{measure}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-sm mb-2 text-gray-900 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-gray-600" />
                      AI Recommendations
                    </h4>
                    <div className="space-y-1">
                      {alert.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <div className="min-w-[4px] w-1 h-1 bg-gray-600 rounded-full mt-2" />
                          <span className="text-gray-900">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {alert.status === "active" && (
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        onClick={() => acknowledgeAlert(alert.id)}
                        variant="outline"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark as Acknowledged
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}