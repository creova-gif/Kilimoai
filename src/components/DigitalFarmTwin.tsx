import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Zap, Droplet, TrendingUp, AlertTriangle, Thermometer, CloudRain, Leaf, Target } from "lucide-react";
import { motion } from "motion/react";

interface DigitalFarmTwinProps {
  userId: string;
  language?: "en" | "sw";
}

export function DigitalFarmTwin({ userId, language = "en" }: DigitalFarmTwinProps) {
  const [selectedMetric, setSelectedMetric] = useState("overview");

  const text = {
    title: language === "sw" ? "Pacha ya Dijiti ya Shamba" : "Digital Farm Twin",
    subtitle: language === "sw" ? "Uchunguzi wa wakati halisi wa shamba lako" : "Real-time farm analytics",
    soilMoisture: language === "sw" ? "Unyevu wa Udongo" : "Soil Moisture",
    temperature: language === "sw" ? "Joto" : "Temperature",
    cropHealth: language === "sw" ? "Afya ya Mazao" : "Crop Health",
    yieldPotential: language === "sw" ? "Uwezo wa Mavuno" : "Yield Potential",
    optimal: language === "sw" ? "Bora" : "Optimal",
    good: language === "sw" ? "Nzuri" : "Good",
    attention: language === "sw" ? "Angalizo" : "Attention",
    premium: language === "sw" ? "Huduma ya Malipo" : "Premium Feature",
  };

  const metrics = [
    {
      id: "moisture",
      icon: Droplet,
      label: text.soilMoisture,
      value: "65%",
      status: "good",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      id: "temp",
      icon: Thermometer,
      label: text.temperature,
      value: "28°C",
      status: "optimal",
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
    {
      id: "health",
      icon: Leaf,
      label: text.cropHealth,
      value: "92%",
      status: "optimal",
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
    {
      id: "yield",
      icon: TrendingUp,
      label: text.yieldPotential,
      value: "2.8T",
      status: "good",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-180px)] bg-gradient-to-br from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{text.title}</h1>
                  <p className="text-white/90 text-sm">{text.subtitle}</p>
                </div>
              </div>
              <Badge className="bg-amber-500 text-white border-0">
                {text.premium}
              </Badge>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-2 ${metric.bgColor} hover:shadow-xl transition-all cursor-pointer`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-12 w-12 ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className={metric.textColor}>
                        {metric.status === "optimal" ? text.optimal : text.good}
                      </Badge>
                    </div>
                    
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">{metric.label}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">{metric.value}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Farm Map Preview */}
        <Card className="border-2 border-gray-200 overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center relative">
              {/* Placeholder for 3D farm visualization */}
              <div className="text-center">
                <div className="h-20 w-20 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {language === "sw" ? "Ramani ya 3D ya Shamba" : "3D Farm Map"}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === "sw" 
                    ? "Onyesho la hali halisi la shamba lako"
                    : "Real-time visualization of your farm"}
                </p>
              </div>
              
              {/* Premium badge overlay */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-purple-600 text-white">
                  {language === "sw" ? "Inapatikana Hivi Karibuni" : "Coming Soon"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-2 border-purple-100 bg-purple-50/50">
          <CardContent className="py-4">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-purple-900 mb-1 text-sm">
                  {language === "sw" ? "Pacha ya Dijiti ni Nini?" : "What is a Digital Twin?"}
                </h4>
                <p className="text-sm text-purple-700 leading-relaxed">
                  {language === "sw"
                    ? "Nakala ya dijiti ya shamba lako ambayo inaboreshwa kwa wakati halisi kwa kutumia data ya sensors, hali ya hewa, na AI. Fanya maamuzi bora zaidi kwa taarifa kamili."
                    : "A real-time digital replica of your farm updated with sensor data, weather, and AI insights. Make better decisions with complete information."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

DigitalFarmTwin.displayName = "DigitalFarmTwin";
