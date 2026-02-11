/**
 * UNIFIED LIVESTOCK - WORLD-CLASS REDESIGN
 * 
 * Farmer Question: "How is my livestock doing?"
 * 
 * DESIGN PHILOSOPHY:
 * - Individual animal tracking
 * - Health monitoring
 * - Breeding records
 * - Quick vet access
 */

import { useState } from "react";
import { 
  Heart, Plus, TrendingUp, AlertCircle, Stethoscope, CalendarCheck
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

interface UnifiedLivestockProps {
  userId: string;
  language: "en" | "sw";
}

interface Animal {
  id: string;
  name: string;
  type: string;
  age: string;
  health: "excellent" | "good" | "needs_attention";
  lastCheckup: string;
  weight?: number;
}

export function UnifiedLivestock({
  userId,
  language
}: UnifiedLivestockProps) {
  const [livestock, setLivestock] = useState<Animal[]>([
    {
      id: "1",
      name: "Daisy",
      type: language === "en" ? "Dairy Cow" : "Ng'ombe wa Maziwa",
      age: "3 " + (language === "en" ? "years" : "miaka"),
      health: "excellent",
      lastCheckup: "2024-02-01",
      weight: 450
    },
    {
      id: "2",
      name: "Bella",
      type: language === "en" ? "Dairy Cow" : "Ng'ombe wa Maziwa",
      age: "5 " + (language === "en" ? "years" : "miaka"),
      health: "good",
      lastCheckup: "2024-01-28",
      weight: 520
    },
    {
      id: "3",
      name: "Charlie",
      type: language === "en" ? "Goat" : "Mbuzi",
      age: "2 " + (language === "en" ? "years" : "miaka"),
      health: "needs_attention",
      lastCheckup: "2024-01-15",
      weight: 35
    }
  ]);

  const text = {
    title: language === "en" ? "Livestock Management" : "Usimamizi wa Mifugo",
    subtitle: language === "en" ? "Track health and records" : "Fuatilia afya na rekodi",
    addAnimal: language === "en" ? "Add Animal" : "Ongeza Mnyama",
    totalAnimals: language === "en" ? "Total Animals" : "Wanyama Wote",
    healthy: language === "en" ? "Healthy" : "Wenye Afya",
    needsAttention: language === "en" ? "Needs Attention" : "Wanahitaji Angalizo",
    health: {
      excellent: language === "en" ? "Excellent" : "Bora Sana",
      good: language === "en" ? "Good" : "Nzuri",
      needs_attention: language === "en" ? "Needs Care" : "Wanahitaji Huduma"
    },
    lastCheckup: language === "en" ? "Last checkup" : "Ukaguzi wa mwisho",
    weight: language === "en" ? "Weight" : "Uzito",
    viewDetails: language === "en" ? "View Details" : "Tazama Maelezo",
    scheduleVet: language === "en" ? "Schedule Vet" : "Panga Daktari",
  };

  const healthyCount = livestock.filter(a => a.health === "excellent" || a.health === "good").length;
  const needsAttentionCount = livestock.filter(a => a.health === "needs_attention").length;

  const healthColors = {
    excellent: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
    good: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
    needs_attention: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
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
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{text.title}</h1>
                  <p className="text-white/90 text-sm">{text.subtitle}</p>
                </div>
              </div>
              <Button 
                onClick={() => toast.success(language === "en" ? "Opening animal form..." : "Inafungua fomu ya mnyama...")}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                {text.addAnimal}
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{text.totalAnimals}</p>
                <p className="text-2xl font-bold">{livestock.length}</p>
                <p className="text-xs text-white/80">{language === "en" ? "in herd" : "katika kundi"}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{text.healthy}</p>
                <p className="text-2xl font-bold">{healthyCount}</p>
                <p className="text-xs text-white/80">{language === "en" ? "animals" : "wanyama"}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">{text.needsAttention}</p>
                <p className="text-2xl font-bold">{needsAttentionCount}</p>
                <p className="text-xs text-white/80">{language === "en" ? "alerts" : "tahadhari"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attention Alert */}
        {needsAttentionCount > 0 && (
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="py-4">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-1 text-sm">
                    {language === "en" ? "Health Alert" : "Tahadhari ya Afya"}
                  </h4>
                  <p className="text-sm text-red-700 leading-relaxed">
                    {language === "en"
                      ? `${needsAttentionCount} animals need veterinary attention.`
                      : `Wanyama ${needsAttentionCount} wanahitaji angalizo la daktari wa wanyama.`}
                  </p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => toast.success(language === "en" ? "Scheduling vet visit..." : "Inapanga ziara ya daktari...")}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {text.scheduleVet}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Livestock Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {livestock.map((animal, index) => {
            const healthStyle = healthColors[animal.health];
            
            return (
              <motion.div
                key={animal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border-2 ${healthStyle.border} hover:shadow-xl transition-all`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 bg-[#2E7D32] rounded-xl flex items-center justify-center shadow-lg">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <Badge className={`${healthStyle.bg} ${healthStyle.text} border ${healthStyle.border}`}>
                        <div className={`h-2 w-2 ${healthStyle.dot} rounded-full mr-1.5`}></div>
                        {text.health[animal.health]}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-gray-900 text-xl mb-1">{animal.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{animal.type}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{language === "en" ? "Age" : "Umri"}:</span>
                        <span className="font-semibold text-gray-900">{animal.age}</span>
                      </div>
                      {animal.weight && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{text.weight}:</span>
                          <span className="font-semibold text-gray-900">{animal.weight} kg</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{text.lastCheckup}:</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(animal.lastCheckup).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]"
                      onClick={() => toast.success(`${text.viewDetails}: ${animal.name}`)}
                    >
                      <Stethoscope className="h-3.5 w-3.5 mr-2" />
                      {text.viewDetails}
                    </Button>
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
                <CalendarCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1 text-sm">
                  {language === "en" ? "Smart Livestock Tracking" : "Ufuatiliaji Mahiri wa Mifugo"}
                </h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {language === "en"
                    ? "Track individual animal health, breeding cycles, vaccinations, and production. Get reminders for checkups and treatments."
                    : "Fuatilia afya ya mnyama mmoja mmoja, mizunguko ya uzazi, chanjo, na uzalishaji. Pata vikumbusho vya ukaguzi na matibabu."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

UnifiedLivestock.displayName = "UnifiedLivestock";