import { toast } from "sonner@2.0.3";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { generateTasksFromTemplate } from "./TaskGenerationEngine";
import type { GrowingTemplate as TemplateForTaskGen } from "./TaskGenerationEngine";

// ==========================================
// TYPE DEFINITIONS - 3-Layer Architecture
// ==========================================

interface CropProfile {
  id: string;
  name: string;
  variety?: string;
  category: "grain" | "legume" | "vegetable" | "fruit" | "cash";
  growthCycle: number; // days
  perennial: boolean;
  yieldRange: { min: number; max: number }; // tons/acre
  marketPrice: number; // TZS/kg
  soilPreference?: string;
  climateSensitivity?: string;
  createdAt: string;
}

interface GrowingTemplate {
  id: string;
  cropId: string;
  name: string; // e.g., "Rainfed High Density", "Irrigated Standard"
  plantingMethod: string;
  spacing: string;
  expectedYield: number; // tons/acre
  growthStages: { name: string; days: number }[];
  inputs: { name: string; quantity: string; timing: string }[];
  isDefault: boolean;
  createdAt: string;
}

interface CropPlanEntry {
  id: string;
  cropId: string;
  templateId: string;
  acres: number;
  plantingDate?: string;
  harvestDate?: string;
  status: "planned" | "planted" | "growing" | "harvesting";
  expectedYield: number;
  estimatedRevenue: number;
}

interface FarmLandAllocationProps {
  totalFarmSize?: number;
  userId: string;
  language?: "en" | "sw";
  region?: string;
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export function FarmLandAllocation({ 
  totalFarmSize = 100,
  userId,
  language = "en",
  region
}: FarmLandAllocationProps) {
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  // Layer 1: Crop Library (Knowledge)
  const [cropProfiles, setCropProfiles] = useState<CropProfile[]>([
    {
      id: "1",
      name: "Maize",
      variety: "Hybrid DK8031",
      category: "grain",
      growthCycle: 120,
      perennial: false,
      yieldRange: { min: 2.0, max: 4.0 },
      marketPrice: 800,
      soilPreference: "Loam, Clay Loam",
      climateSensitivity: "Moderate drought tolerance",
      createdAt: "2024-01-01"
    },
    {
      id: "2",
      name: "Beans",
      variety: "Lyamungu 90",
      category: "legume",
      growthCycle: 90,
      perennial: false,
      yieldRange: { min: 1.2, max: 2.5 },
      marketPrice: 2000,
      soilPreference: "Well-drained loam",
      climateSensitivity: "Low drought tolerance",
      createdAt: "2024-01-01"
    },
    {
      id: "3",
      name: "Sunflower",
      category: "cash",
      growthCycle: 110,
      perennial: false,
      yieldRange: { min: 0.8, max: 1.8 },
      marketPrice: 1500,
      soilPreference: "Sandy loam",
      climateSensitivity: "High drought tolerance",
      createdAt: "2024-01-01"
    },
    {
      id: "4",
      name: "Tomatoes",
      category: "vegetable",
      growthCycle: 85,
      perennial: false,
      yieldRange: { min: 10.0, max: 20.0 },
      marketPrice: 600,
      soilPreference: "Rich loam",
      climateSensitivity: "Requires consistent moisture",
      createdAt: "2024-01-01"
    },
    {
      id: "5",
      name: "Rice",
      category: "grain",
      growthCycle: 120,
      perennial: false,
      yieldRange: { min: 2.5, max: 4.5 },
      marketPrice: 1200,
      soilPreference: "Clay, requires flooding",
      climateSensitivity: "Requires consistent water",
      createdAt: "2024-01-01"
    }
  ]);

  // Layer 2: Growing Templates (How you farm)
  const [growingTemplates, setGrowingTemplates] = useState<GrowingTemplate[]>([
    {
      id: "t1",
      cropId: "1", // Maize
      name: "Rainfed Standard",
      plantingMethod: "Rows",
      spacing: "75cm × 25cm",
      expectedYield: 2.5,
      growthStages: [
        { name: "Germination", days: 10 },
        { name: "Vegetative", days: 40 },
        { name: "Flowering", days: 30 },
        { name: "Grain Fill", days: 40 }
      ],
      inputs: [
        { name: "DAP Fertilizer", quantity: "50kg/acre", timing: "At planting" },
        { name: "Urea", quantity: "50kg/acre", timing: "35 days after planting" }
      ],
      isDefault: true,
      createdAt: "2024-01-01"
    },
    {
      id: "t2",
      cropId: "1", // Maize
      name: "Irrigated High Density",
      plantingMethod: "Rows",
      spacing: "60cm × 20cm",
      expectedYield: 3.5,
      growthStages: [
        { name: "Germination", days: 10 },
        { name: "Vegetative", days: 40 },
        { name: "Flowering", days: 30 },
        { name: "Grain Fill", days: 40 }
      ],
      inputs: [
        { name: "DAP Fertilizer", quantity: "75kg/acre", timing: "At planting" },
        { name: "Urea", quantity: "75kg/acre", timing: "35 days after planting" },
        { name: "Irrigation", quantity: "Regular", timing: "Throughout season" }
      ],
      isDefault: false,
      createdAt: "2024-01-01"
    },
    {
      id: "t3",
      cropId: "2", // Beans
      name: "Standard Planting",
      plantingMethod: "Rows",
      spacing: "50cm × 10cm",
      expectedYield: 1.8,
      growthStages: [
        { name: "Germination", days: 7 },
        { name: "Vegetative", days: 35 },
        { name: "Flowering", days: 25 },
        { name: "Pod Fill", days: 23 }
      ],
      inputs: [
        { name: "Rhizobium Inoculant", quantity: "As per seed", timing: "At planting" },
        { name: "TSP", quantity: "20kg/acre", timing: "At planting" }
      ],
      isDefault: true,
      createdAt: "2024-01-01"
    },
    {
      id: "t4",
      cropId: "3", // Sunflower
      name: "Dryland Farming",
      plantingMethod: "Rows",
      spacing: "70cm × 30cm",
      expectedYield: 1.2,
      growthStages: [
        { name: "Germination", days: 8 },
        { name: "Vegetative", days: 40 },
        { name: "Flowering", days: 30 },
        { name: "Maturation", days: 32 }
      ],
      inputs: [
        { name: "Compound Fertilizer", quantity: "30kg/acre", timing: "At planting" }
      ],
      isDefault: true,
      createdAt: "2024-01-01"
    }
  ]);

  // Layer 3: Crop Plan (What you plant this season)
  const [cropPlan, setCropPlan] = useState<CropPlanEntry[]>([
    {
      id: "p1",
      cropId: "1",
      templateId: "t1",
      acres: 40,
      plantingDate: "2024-02-15",
      harvestDate: "2024-06-30",
      status: "planted",
      expectedYield: 2.5,
      estimatedRevenue: 8000000
    },
    {
      id: "p2",
      cropId: "2",
      templateId: "t3",
      acres: 25,
      plantingDate: "2024-02-20",
      harvestDate: "2024-05-20",
      status: "planted",
      expectedYield: 1.8,
      estimatedRevenue: 4500000
    }
  ]);

  // UI State
  const [activeTab, setActiveTab] = useState("plan");
  const [showAddCropDialog, setShowAddCropDialog] = useState(false);
  const [showAddTemplateDialog, setShowAddTemplateDialog] = useState(false);
  const [showAddPlanDialog, setShowAddPlanDialog] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);

  // ==========================================
  // CALCULATIONS
  // ==========================================

  const allocatedAcres = cropPlan.reduce((sum, entry) => sum + entry.acres, 0);
  const availableAcres = totalFarmSize - allocatedAcres;
  const totalRevenue = cropPlan.reduce((sum, entry) => sum + entry.estimatedRevenue, 0);

  const getCropName = (cropId: string) => {
    return cropProfiles.find(c => c.id === cropId)?.name || "Unknown";
  };

  const getTemplateName = (templateId: string) => {
    return growingTemplates.find(t => t.id === templateId)?.name || "Unknown";
  };

  // ==========================================
  // TAB 1: CROP LIBRARY
  // ==========================================

  const CropLibraryView = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {language === "sw" ? "Maktaba ya Mazao" : "Crop Library"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {language === "sw" 
              ? "Profaili za mazao zinazoweza kutumiwa tena" 
              : "Reusable crop profiles with cultivation knowledge"}
          </p>
        </div>
        <Button 
          onClick={() => setShowAddCropDialog(true)}
          className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {language === "sw" ? "Ongeza" : "Add Crop"}
        </Button>
      </div>

      {/* AI Info Banner */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-[#2E7D32] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {language === "sw" ? "Ujuzi wa Mazao Unaoweza Kutumiwa Tena" : "Reusable Crop Knowledge"}
              </p>
              <p className="text-xs text-gray-600">
                {language === "sw" 
                  ? "Unda profaili mara moja, tumia misimu yote. Violezo vya kilimo vitaleta kiotomatiki data ya mazao kwenye mipango yako."
                  : "Create once, use every season. Growing templates automatically apply crop data to your plans."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crop Cards */}
      <div className="grid gap-3">
        {cropProfiles.map((crop) => {
          const templates = growingTemplates.filter(t => t.cropId === crop.id);
          const plansCount = cropPlan.filter(p => p.cropId === crop.id).length;
          
          return (
            <Card key={crop.id} className="border border-gray-200 hover:border-[#2E7D32] transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Sprout className="h-5 w-5 text-[#2E7D32]" />
                      <h4 className="font-semibold text-gray-900">{crop.name}</h4>
                      {crop.variety && (
                        <Badge variant="outline" className="text-xs">
                          {crop.variety}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">
                          {language === "sw" ? "Mzunguko" : "Cycle"}
                        </p>
                        <p className="font-medium text-gray-900">{crop.growthCycle} days</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">
                          {language === "sw" ? "Mavuno" : "Yield Range"}
                        </p>
                        <p className="font-medium text-gray-900">
                          {crop.yieldRange.min}-{crop.yieldRange.max} t/acre
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">
                          {language === "sw" ? "Bei" : "Market Price"}
                        </p>
                        <p className="font-medium text-gray-900">TZS {crop.marketPrice}/kg</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">
                          {language === "sw" ? "Violezo" : "Templates"}
                        </p>
                        <p className="font-medium text-[#2E7D32]">{templates.length} available</p>
                      </div>
                    </div>

                    {plansCount > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-600">
                          <CheckCircle2 className="h-3 w-3 inline mr-1 text-[#2E7D32]" />
                          {language === "sw" 
                            ? `Imepangwa kwa msimu huu (ekari ${cropPlan.filter(p => p.cropId === crop.id).reduce((s, p) => s + p.acres, 0)})`
                            : `In this season's plan (${cropPlan.filter(p => p.cropId === crop.id).reduce((s, p) => s + p.acres, 0)} acres)`}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedCropId(crop.id);
                      setActiveTab("templates");
                    }}
                    className="text-[#2E7D32] hover:text-[#1B5E20] hover:bg-gray-50"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {cropProfiles.length === 0 && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {language === "sw" 
                ? "Hakuna profaili za mazao bado. Anza kujenga maktaba yako."
                : "No crop profiles yet. Start building your library."}
            </p>
            <Button 
              onClick={() => setShowAddCropDialog(true)}
              className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === "sw" ? "Ongeza Zao" : "Add First Crop"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // ==========================================
  // TAB 2: GROWING TEMPLATES
  // ==========================================

  const GrowingTemplatesView = () => {
    const templatesForCrop = selectedCropId 
      ? growingTemplates.filter(t => t.cropId === selectedCropId)
      : growingTemplates;

    const cropName = selectedCropId 
      ? getCropName(selectedCropId)
      : language === "sw" ? "Zote" : "All Crops";

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {language === "sw" ? "Violezo vya Kilimo" : "Growing Templates"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {language === "sw" 
                ? `Michoro ya kilimo kwa ${cropName}` 
                : `Cultivation blueprints for ${cropName}`}
            </p>
          </div>
          <Button 
            onClick={() => setShowAddTemplateDialog(true)}
            className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
            disabled={cropProfiles.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            {language === "sw" ? "Ongeza" : "New Template"}
          </Button>
        </div>

        {/* AI Info Banner */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-[#2E7D32] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {language === "sw" ? "Mifumo ya Kilimo Inayoweza Kutumiwa Tena" : "Reusable Growing Methods"}
                </p>
                <p className="text-xs text-gray-600">
                  {language === "sw" 
                    ? "Tengeneza violezo vingi kwa zao moja. Chagua kiolezo unapopanga msimu."
                    : "Create multiple templates per crop. Select a template when planning your season."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crop Filter */}
        {!selectedCropId && cropProfiles.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {cropProfiles.map(crop => {
              const templateCount = growingTemplates.filter(t => t.cropId === crop.id).length;
              return (
                <Button
                  key={crop.id}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCropId(crop.id)}
                  className="text-sm"
                >
                  {crop.name} ({templateCount})
                </Button>
              );
            })}
          </div>
        )}

        {selectedCropId && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedCropId(null)}
          >
            ← {language === "sw" ? "Rudi kwenye zote" : "Back to all templates"}
          </Button>
        )}

        {/* Template Cards */}
        <div className="grid gap-3">
          {templatesForCrop.map((template) => {
            const crop = cropProfiles.find(c => c.id === template.cropId);
            const usedInPlan = cropPlan.filter(p => p.templateId === template.id).length > 0;
            
            return (
              <Card 
                key={template.id} 
                className={`border ${template.isDefault ? 'border-[#2E7D32]' : 'border-gray-200'} hover:border-[#2E7D32] transition-colors`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                        {template.isDefault && (
                          <Badge className="bg-[#2E7D32] text-white text-xs">
                            {language === "sw" ? "Msingi" : "Default"}
                          </Badge>
                        )}
                        {usedInPlan && (
                          <Badge variant="outline" className="text-xs">
                            {language === "sw" ? "Inatumika" : "In use"}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{crop?.name}</p>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          toast.success(language === "sw" ? "Kiolezo kilinakolewa" : "Template cloned");
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                    <div>
                      <p className="text-gray-500 text-xs">
                        {language === "sw" ? "Njia" : "Method"}
                      </p>
                      <p className="font-medium text-gray-900">{template.plantingMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">
                        {language === "sw" ? "Nafasi" : "Spacing"}
                      </p>
                      <p className="font-medium text-gray-900">{template.spacing}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">
                        {language === "sw" ? "Mavuno" : "Expected Yield"}
                      </p>
                      <p className="font-medium text-[#2E7D32]">{template.expectedYield} t/acre</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">
                        {language === "sw" ? "Muda" : "Duration"}
                      </p>
                      <p className="font-medium text-gray-900">
                        {template.growthStages.reduce((sum, stage) => sum + stage.days, 0)} days
                      </p>
                    </div>
                  </div>

                  {/* Growth Stages */}
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      {language === "sw" ? "Hatua za Ukuaji" : "Growth Stages"}
                    </p>
                    <div className="flex gap-1">
                      {template.growthStages.map((stage, idx) => (
                        <div 
                          key={idx}
                          className="flex-1 h-2 bg-gray-200 rounded-full relative group"
                          style={{ 
                            backgroundColor: idx === 0 ? '#2E7D32' : 'rgb(229 231 235)'
                          }}
                        >
                          <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                            {stage.name} ({stage.days}d)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inputs */}
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      {language === "sw" ? "Pembejeo" : "Key Inputs"}
                    </p>
                    <div className="space-y-1">
                      {template.inputs.slice(0, 2).map((input, idx) => (
                        <p key={idx} className="text-xs text-gray-600">
                          • {input.name}: {input.quantity} ({input.timing})
                        </p>
                      ))}
                      {template.inputs.length > 2 && (
                        <p className="text-xs text-gray-500">
                          +{template.inputs.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {templatesForCrop.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                {language === "sw" 
                  ? `Hakuna violezo kwa ${cropName} bado.`
                  : `No templates for ${cropName} yet.`}
              </p>
              <Button 
                onClick={() => setShowAddTemplateDialog(true)}
                className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
                disabled={cropProfiles.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                {language === "sw" ? "Ongeza Kiolezo" : "Create Template"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // ==========================================
  // TAB 3: SEASON PLAN (CROP PLAN)
  // ==========================================

  const SeasonPlanView = () => (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="border-[#2E7D32] bg-white">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {language === "sw" ? "Muhtasari wa Msimu" : "Season Summary"}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500">
                {language === "sw" ? "Jumla" : "Total Farm"}
              </p>
              <p className="text-2xl font-bold text-gray-900">{totalFarmSize}</p>
              <p className="text-xs text-gray-500">acres</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {language === "sw" ? "Imepangwa" : "Allocated"}
              </p>
              <p className="text-2xl font-bold text-gray-900">{allocatedAcres.toFixed(1)}</p>
              <p className="text-xs text-gray-500">acres</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {language === "sw" ? "Inayopatikana" : "Available"}
              </p>
              <p className="text-2xl font-bold text-[#2E7D32]">{availableAcres.toFixed(1)}</p>
              <p className="text-xs text-gray-500">acres</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {language === "sw" ? "Mapato" : "Est. Revenue"}
              </p>
              <p className="text-xl font-bold text-gray-900">
                {(totalRevenue / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-gray-500">TZS</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-600">
                {language === "sw" ? "Matumizi ya Shamba" : "Farm Utilization"}
              </span>
              <span className="font-medium text-gray-900">
                {((allocatedAcres / totalFarmSize) * 100).toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={(allocatedAcres / totalFarmSize) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {language === "sw" ? "Mpango wa Msimu" : "Season Plan"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {language === "sw" 
              ? "Tumia violezo kupanga msimu wako" 
              : "Apply templates to plan your season"}
          </p>
        </div>
        <Button 
          onClick={() => setShowAddPlanDialog(true)}
          className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
          disabled={growingTemplates.length === 0 || availableAcres <= 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          {language === "sw" ? "Ongeza" : "Add to Plan"}
        </Button>
      </div>

      {/* AI Info Banner */}
      {cropPlan.length > 0 && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-[#2E7D32] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {language === "sw" ? "Mipango Inajenga Kazi Kiotomatiki" : "Plans Generate Tasks Automatically"}
                </p>
                <p className="text-xs text-gray-600">
                  {language === "sw" 
                    ? "Kila zao katika mpango wako litaunda kazi, makadirio ya pembejeo, na utabiri wa mapato."
                    : "Each crop in your plan creates tasks, input estimates, and revenue forecasts automatically."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Entries */}
      <div className="space-y-3">
        {cropPlan.map((entry) => {
          const crop = cropProfiles.find(c => c.id === entry.cropId);
          const template = growingTemplates.find(t => t.id === entry.templateId);
          
          return (
            <Card key={entry.id} className="border border-gray-200 hover:border-[#2E7D32] transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-semibold text-gray-900">{crop?.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getStatusLabel(entry.status, language)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {template?.name} • {entry.acres} acres
                    </p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setCropPlan(cropPlan.filter(p => p.id !== entry.id));
                      toast.success(language === "sw" ? "Imeondolewa" : "Removed from plan");
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">
                      {language === "sw" ? "Mavuno" : "Yield"}
                    </p>
                    <p className="font-medium text-gray-900">
                      {(entry.acres * entry.expectedYield).toFixed(1)} tons
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">
                      {language === "sw" ? "Mapato" : "Revenue"}
                    </p>
                    <p className="font-medium text-[#2E7D32]">
                      TZS {(entry.estimatedRevenue / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">
                      {language === "sw" ? "Kupanda" : "Planting"}
                    </p>
                    <p className="font-medium text-gray-900">
                      {entry.plantingDate ? new Date(entry.plantingDate).toLocaleDateString() : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">
                      {language === "sw" ? "Mavuno" : "Harvest"}
                    </p>
                    <p className="font-medium text-gray-900">
                      {entry.harvestDate ? new Date(entry.harvestDate).toLocaleDateString() : "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {cropPlan.length === 0 && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {language === "sw" 
                ? "Mpango wa msimu upo wazi. Anza kuongeza mazao."
                : "Season plan is empty. Start adding crops."}
            </p>
            <Button 
              onClick={() => setShowAddPlanDialog(true)}
              className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
              disabled={growingTemplates.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === "sw" ? "Ongeza Zao" : "Add First Crop"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // ==========================================
  // TAB 4: REVENUE FORECAST
  // ==========================================

  const RevenueView = () => {
    const cropRevenues = cropPlan.map(entry => {
      const crop = cropProfiles.find(c => c.id === entry.cropId);
      return {
        crop: crop?.name || "Unknown",
        acres: entry.acres,
        revenue: entry.estimatedRevenue,
        revenuePerAcre: entry.estimatedRevenue / entry.acres
      };
    }).sort((a, b) => b.revenue - a.revenue);

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {language === "sw" ? "Utabiri wa Mapato" : "Revenue Forecast"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {language === "sw" 
              ? "Makadirio ya mapato kwa msimu huu" 
              : "Projected revenue for this season"}
          </p>
        </div>

        {/* Total Revenue Card */}
        <Card className="bg-[#2E7D32] text-white">
          <CardContent className="p-6">
            <p className="text-sm opacity-90 mb-2">
              {language === "sw" ? "Jumla ya Mapato Yanayotarajiwa" : "Total Expected Revenue"}
            </p>
            <p className="text-4xl font-bold mb-1">
              TZS {(totalRevenue / 1000000).toFixed(2)}M
            </p>
            <p className="text-sm opacity-90">
              {language === "sw" ? `Kutoka ekari ${allocatedAcres.toFixed(1)}` : `From ${allocatedAcres.toFixed(1)} acres`}
            </p>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        {cropRevenues.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {language === "sw" ? "Mgawanyiko wa Mapato" : "Revenue Breakdown"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cropRevenues.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-900">{item.crop}</span>
                    <span className="text-gray-600">
                      TZS {(item.revenue / 1000000).toFixed(2)}M ({((item.revenue / totalRevenue) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-[#2E7D32]"
                      style={{ width: `${(item.revenue / totalRevenue) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.acres} acres • TZS {(item.revenuePerAcre / 1000).toFixed(0)}K per acre
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {cropRevenues.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {language === "sw" 
                  ? "Hakuna data ya mapato. Ongeza mazao kwenye mpango."
                  : "No revenue data. Add crops to your plan."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // ==========================================
  // RENDER MAIN COMPONENT
  // ==========================================

  return (
    <div className="space-y-6 pb-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="library" className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]">
            <BookOpen className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">
              {language === "sw" ? "Maktaba" : "Library"}
            </span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">
              {language === "sw" ? "Violezo" : "Templates"}
            </span>
          </TabsTrigger>
          <TabsTrigger value="plan" className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">
              {language === "sw" ? "Mpango" : "Plan"}
            </span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">
              {language === "sw" ? "Mapato" : "Revenue"}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-6">
          <CropLibraryView />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <GrowingTemplatesView />
        </TabsContent>

        <TabsContent value="plan" className="mt-6">
          <SeasonPlanView />
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <RevenueView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getStatusLabel(status: string, language: "en" | "sw"): string {
  const labels = {
    planned: { en: "Planned", sw: "Imepangwa" },
    planted: { en: "Planted", sw: "Imepandwa" },
    growing: { en: "Growing", sw: "Inakua" },
    harvesting: { en: "Harvesting", sw: "Inavunwa" }
  };
  return labels[status as keyof typeof labels]?.[language] || status;
}

// ==========================================
// TASK GENERATION INTEGRATION
// ==========================================

async function autoGenerateTasksForPlan(
  planEntry: CropPlanEntry,
  template: GrowingTemplate,
  crop: CropProfile,
  userId: string,
  language: "en" | "sw"
) {
  try {
    // Convert local template to TaskGeneration format
    const templateForGen: TemplateForTaskGen = {
      id: template.id,
      cropId: template.cropId,
      name: template.name,
      growthStages: template.growthStages,
      inputs: template.inputs,
      expectedYield: template.expectedYield
    };

    // Create plan entry for task generation
    const planForGen = {
      ...planEntry,
      cropName: crop.name,
      templateName: template.name,
      harvestDate: planEntry.harvestDate || undefined
    };

    // Generate tasks
    const generatedTasks = generateTasksFromTemplate(
      planForGen,
      templateForGen
    );

    // Convert tasks to serializable format (Date -> string)
    const tasksToSave = generatedTasks.map(task => ({
      ...task,
      dueDate: task.dueDate.toISOString()
    }));

    // Save tasks to backend (batch)
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/tasks/batch`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          tasks: tasksToSave,
          userId
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to save tasks');
    }

    // Success notification
    toast.success(
      language === "sw" 
        ? `✨ ${crop.name} imeongezwa! Kazi ${generatedTasks.length} zimeundwa kiotomatiki.`
        : `✨ ${crop.name} added! ${generatedTasks.length} tasks auto-generated.`,
      {
        description: language === "sw"
          ? "Angalia Usimamizi wa Kazi kuona kazi zako."
          : "Check Task Management to see your tasks."
      }
    );

    console.log(`✅ Auto-generated ${generatedTasks.length} tasks for ${crop.name}:`, generatedTasks);
    
    return generatedTasks;
  } catch (error) {
    console.error('Task generation error:', error);
    toast.error(
      language === "sw"
        ? "Imeshindwa kuunda kazi"
        : "Failed to generate tasks",
      {
        description: language === "sw"
          ? "Zao limeongezwa lakini kazi hazikuundwa."
          : "Crop added but tasks were not generated."
      }
    );
    return [];
  }
}