import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import {
  Plus,
  Calendar,
  MapPin,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Trash2,
  Info,
  Sprout,
  BarChart3,
  DollarSign,
  Eye,
  EyeOff,
  Save,
  Sparkles,
  RotateCw,
  Zap,
  Target,
  Lightbulb,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { generateTasksFromTemplate } from "./TaskGenerationEngine";

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface CropProfile {
  id: string;
  name: string;
  variety?: string;
  category: string;
  growthCycle: number;
  yieldRange: { min: number; max: number };
  marketPrice: number;
}

interface GrowingTemplate {
  id: string;
  cropId: string;
  name: string;
  plantingMethod: string;
  spacing: string;
  expectedYield: number;
  growthStages: { name: string; days: number }[];
  inputs: { name: string; quantity: string; timing: string }[];
}

interface Field {
  id: string;
  name: string;
  acres: number;
  soilType?: string;
}

interface Planting {
  id: string;
  cropId: string;
  templateId: string;
  fieldId: string;
  acres: number;
  plantingDate: string;
  harvestDate: string;
  status: "planned" | "planted" | "growing" | "harvesting";
  expectedYield: number;
  estimatedRevenue: number;
  startWeek: number;
  durationWeeks: number;
}

interface SeasonTemplate {
  id: string;
  name: string;
  description: string;
  plantings: Omit<Planting, 'id' | 'startWeek' | 'durationWeeks'>[];
  totalRevenue: number;
  totalYield: number;
  createdAt: string;
}

interface AIOptimization {
  type: "date" | "crop" | "revenue" | "rotation";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action: () => void;
}

interface VisualCropPlannerEnhancedProps {
  userId: string;
  language?: "en" | "sw";
  totalFarmSize?: number;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function calculateHarvestDate(plantingDate: string, growthCycle: number): string {
  const planting = new Date(plantingDate);
  const harvest = addDays(planting, growthCycle);
  return harvest.toISOString().split('T')[0];
}

function formatCurrency(amount: number, language: "en" | "sw"): string {
  const millions = amount / 1000000;
  return millions >= 1 
    ? `${millions.toFixed(1)}M TZS`
    : `${(amount / 1000).toFixed(0)}K TZS`;
}

function getOptimalPlantingDate(cropId: string, region: string = "tanzania"): string {
  // AI Logic: Based on crop type and region climate
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  
  // Tanzania rainy seasons: Mar-May (long rains), Oct-Dec (short rains)
  const nextOptimalMonth = month < 3 ? 3 : month < 10 ? 10 : 3;
  const nextOptimalYear = nextOptimalMonth === 3 && month >= 10 ? year + 1 : year;
  
  return new Date(nextOptimalYear, nextOptimalMonth, 1).toISOString().split('T')[0];
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export function VisualCropPlannerEnhanced({
  userId,
  language = "en",
  totalFarmSize = 100
}: VisualCropPlannerEnhancedProps) {

  // ==========================================
  // STATE - DATA
  // ==========================================

  const [cropProfiles, setCropProfiles] = useState<CropProfile[]>([
    {
      id: "1",
      name: "Maize",
      variety: "Hybrid DK8031",
      category: "grain",
      growthCycle: 120,
      yieldRange: { min: 2.0, max: 4.0 },
      marketPrice: 800
    },
    {
      id: "2",
      name: "Beans",
      variety: "Lyamungu 90",
      category: "legume",
      growthCycle: 90,
      yieldRange: { min: 1.2, max: 2.5 },
      marketPrice: 2000
    },
    {
      id: "3",
      name: "Sunflower",
      category: "cash",
      growthCycle: 110,
      yieldRange: { min: 0.8, max: 1.8 },
      marketPrice: 1500
    },
    {
      id: "4",
      name: "Tomatoes",
      category: "vegetable",
      growthCycle: 85,
      yieldRange: { min: 10.0, max: 20.0 },
      marketPrice: 600
    }
  ]);

  const [growingTemplates, setGrowingTemplates] = useState<GrowingTemplate[]>([
    {
      id: "t1",
      cropId: "1",
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
      ]
    },
    {
      id: "t2",
      cropId: "2",
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
      ]
    }
  ]);

  const [fields, setFields] = useState<Field[]>([
    { id: "f1", name: "Field A - North", acres: 40, soilType: "Loam" },
    { id: "f2", name: "Field B - South", acres: 35, soilType: "Clay Loam" },
    { id: "f3", name: "Field C - East", acres: 25, soilType: "Sandy Loam" }
  ]);

  const [plantings, setPlantings] = useState<Planting[]>([]);

  const [seasonTemplates, setSeasonTemplates] = useState<SeasonTemplate[]>([]);

  // ==========================================
  // STATE - UI
  // ==========================================

  const [viewMode, setViewMode] = useState<"crop" | "field">("crop");
  const [showInsights, setShowInsights] = useState(true);
  const [showAddPlantingDialog, setShowAddPlantingDialog] = useState(false);
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
  const [showLoadTemplateDialog, setShowLoadTemplateDialog] = useState(false);
  const [showAIOptimizationDialog, setShowAIOptimizationDialog] = useState(false);
  const [selectedPlanting, setSelectedPlanting] = useState<Planting | null>(null);
  const [draggedPlanting, setDraggedPlanting] = useState<string | null>(null);
  const [dragOverField, setDragOverField] = useState<string | null>(null);

  // Form states
  const [newPlanting, setNewPlanting] = useState({
    cropId: "",
    templateId: "",
    fieldId: "",
    acres: 0,
    plantingDate: new Date().toISOString().split('T')[0]
  });

  const [templateForm, setTemplateForm] = useState({
    name: "",
    description: ""
  });

  // Timeline navigation
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // ==========================================
  // CALCULATIONS - REAL-TIME
  // ==========================================

  const allocatedAcres = useMemo(() => {
    return plantings.reduce((sum, p) => sum + p.acres, 0);
  }, [plantings]);

  const availableAcres = useMemo(() => {
    return totalFarmSize - allocatedAcres;
  }, [totalFarmSize, allocatedAcres]);

  const totalRevenue = useMemo(() => {
    return plantings.reduce((sum, p) => sum + p.estimatedRevenue, 0);
  }, [plantings]);

  const totalYield = useMemo(() => {
    return plantings.reduce((sum, p) => sum + (p.acres * p.expectedYield), 0);
  }, [plantings]);

  const utilizationPercent = useMemo(() => {
    return (allocatedAcres / totalFarmSize) * 100;
  }, [allocatedAcres, totalFarmSize]);

  const fieldUtilization = useMemo(() => {
    return fields.map(field => {
      const used = plantings
        .filter(p => p.fieldId === field.id)
        .reduce((sum, p) => sum + p.acres, 0);
      return {
        fieldId: field.id,
        used,
        available: field.acres - used,
        percent: (used / field.acres) * 100
      };
    });
  }, [fields, plantings]);

  // ==========================================
  // AI OPTIMIZATION ENGINE
  // ==========================================

  const generateAIOptimizations = useMemo((): AIOptimization[] => {
    const optimizations: AIOptimization[] = [];

    // 1. Optimal Planting Dates
    plantings.forEach(planting => {
      const optimal = getOptimalPlantingDate(planting.cropId);
      if (planting.plantingDate !== optimal) {
        const crop = cropProfiles.find(c => c.id === planting.cropId);
        optimizations.push({
          type: "date",
          priority: "medium",
          title: language === "sw" 
            ? `Badilisha tarehe ya kupanda ${crop?.name}`
            : `Optimize ${crop?.name} planting date`,
          description: language === "sw"
            ? `Panda mnamo ${new Date(optimal).toLocaleDateString()} kwa mavuno bora`
            : `Plant on ${new Date(optimal).toLocaleDateString()} for optimal yield`,
          action: () => {
            updatePlanting(planting.id, { plantingDate: optimal });
          }
        });
      }
    });

    // 2. Revenue Maximization
    if (availableAcres > 5) {
      const highValueCrop = cropProfiles
        .sort((a, b) => b.marketPrice * b.yieldRange.max - a.marketPrice * a.yieldRange.max)[0];
      
      optimizations.push({
        type: "revenue",
        priority: "high",
        title: language === "sw"
          ? `Ongeza ${highValueCrop.name} kwa mapato zaidi`
          : `Add more ${highValueCrop.name} for higher revenue`,
        description: language === "sw"
          ? `Una nafasi ya ekari ${availableAcres.toFixed(1)}. ${highValueCrop.name} inaleta mapato ya juu.`
          : `You have ${availableAcres.toFixed(1)} acres available. ${highValueCrop.name} has highest revenue potential.`,
        action: () => {
          setNewPlanting({
            ...newPlanting,
            cropId: highValueCrop.id,
            acres: Math.min(availableAcres, 10)
          });
          setShowAddPlantingDialog(true);
        }
      });
    }

    // 3. Crop Rotation
    const grainCount = plantings.filter(p => {
      const crop = cropProfiles.find(c => c.id === p.cropId);
      return crop?.category === "grain";
    }).length;

    const legumeCount = plantings.filter(p => {
      const crop = cropProfiles.find(c => c.id === p.cropId);
      return crop?.category === "legume";
    }).length;

    if (grainCount > 0 && legumeCount === 0) {
      optimizations.push({
        type: "rotation",
        priority: "high",
        title: language === "sw"
          ? "Ongeza kunde/maharagwe kwa uzalishaji wa udongo"
          : "Add legumes for soil fertility",
        description: language === "sw"
          ? "Kunde na maharagwe huongeza nitrojeni udongoni, ikiongeza mavuno ya nafaka baadaye."
          : "Legumes add nitrogen to soil, improving future grain yields.",
        action: () => {
          const beansCrop = cropProfiles.find(c => c.name === "Beans");
          if (beansCrop) {
            setNewPlanting({
              ...newPlanting,
              cropId: beansCrop.id
            });
            setShowAddPlantingDialog(true);
          }
        }
      });
    }

    // 4. Space Optimization
    if (utilizationPercent < 70) {
      optimizations.push({
        type: "crop",
        priority: "medium",
        title: language === "sw"
          ? "Tumia nafasi zaidi ya shamba"
          : "Utilize more farm space",
        description: language === "sw"
          ? `Unatumia ${utilizationPercent.toFixed(0)}% tu. Ongeza mazao kutumia nafasi iliyobaki.`
          : `Only ${utilizationPercent.toFixed(0)}% utilized. Add crops to use remaining space.`,
        action: () => {
          setShowAddPlantingDialog(true);
        }
      });
    }

    return optimizations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [plantings, availableAcres, utilizationPercent, cropProfiles, language, newPlanting]);

  // ==========================================
  // DRAG AND DROP HANDLERS
  // ==========================================

  const handleDragStart = (e: React.DragEvent, plantingId: string) => {
    setDraggedPlanting(plantingId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, fieldId: string) => {
    e.preventDefault();
    setDragOverField(fieldId);
  };

  const handleDragLeave = () => {
    setDragOverField(null);
  };

  const handleDrop = async (e: React.DragEvent, targetFieldId: string) => {
    e.preventDefault();
    setDragOverField(null);

    if (!draggedPlanting) return;

    const planting = plantings.find(p => p.id === draggedPlanting);
    if (!planting) return;

    // Check if target field has space
    const targetFieldUtil = fieldUtilization.find(f => f.fieldId === targetFieldId);
    if (!targetFieldUtil || planting.acres > targetFieldUtil.available + (planting.fieldId === targetFieldId ? planting.acres : 0)) {
      toast.error(
        language === "sw"
          ? "Shamba halina nafasi ya kutosha"
          : "Field has insufficient space"
      );
      setDraggedPlanting(null);
      return;
    }

    // Update planting
    await updatePlanting(planting.id, { fieldId: targetFieldId });
    
    toast.success(
      language === "sw"
        ? `${cropProfiles.find(c => c.id === planting.cropId)?.name} imehamishwa`
        : `${cropProfiles.find(c => c.id === planting.cropId)?.name} moved`
    );

    setDraggedPlanting(null);
  };

  const updatePlanting = async (plantingId: string, updates: Partial<Planting>) => {
    setPlantings(plantings.map(p => {
      if (p.id === plantingId) {
        const updated = { ...p, ...updates };
        
        // Recalculate if date changed
        if (updates.plantingDate) {
          const crop = cropProfiles.find(c => c.id === p.cropId);
          if (crop) {
            updated.harvestDate = calculateHarvestDate(updates.plantingDate, crop.growthCycle);
            updated.startWeek = getWeekNumber(new Date(updates.plantingDate));
          }
        }
        
        return updated;
      }
      return p;
    }));
  };

  // ==========================================
  // PLANTING MANAGEMENT
  // ==========================================

  const handleAddPlanting = async () => {
    const crop = cropProfiles.find(c => c.id === newPlanting.cropId);
    const template = growingTemplates.find(t => t.id === newPlanting.templateId);
    const field = fields.find(f => f.id === newPlanting.fieldId);

    if (!crop || !template || !field) {
      toast.error(language === "sw" ? "Tafadhali jaza sehemu zote" : "Please fill all fields");
      return;
    }

    const fieldUtil = fieldUtilization.find(f => f.fieldId === field.id);
    if (fieldUtil && newPlanting.acres > fieldUtil.available) {
      toast.error(
        language === "sw" 
          ? `Shamba linapungukiwa nafasi. Inapatikana: ${fieldUtil.available} ekari`
          : `Field has insufficient space. Available: ${fieldUtil.available} acres`
      );
      return;
    }

    const harvestDate = calculateHarvestDate(newPlanting.plantingDate, crop.growthCycle);
    const totalYield = newPlanting.acres * template.expectedYield;
    const revenue = totalYield * 1000 * crop.marketPrice;

    const planting: Planting = {
      id: `p${Date.now()}`,
      cropId: newPlanting.cropId,
      templateId: newPlanting.templateId,
      fieldId: newPlanting.fieldId,
      acres: newPlanting.acres,
      plantingDate: newPlanting.plantingDate,
      harvestDate,
      status: "planned",
      expectedYield: template.expectedYield,
      estimatedRevenue: revenue,
      startWeek: getWeekNumber(new Date(newPlanting.plantingDate)),
      durationWeeks: Math.ceil(crop.growthCycle / 7)
    };

    setPlantings([...plantings, planting]);
    await autoGenerateTasks(planting, template, crop, field);

    setNewPlanting({
      cropId: "",
      templateId: "",
      fieldId: "",
      acres: 0,
      plantingDate: new Date().toISOString().split('T')[0]
    });
    setShowAddPlantingDialog(false);

    toast.success(
      language === "sw"
        ? `✨ ${crop.name} imeongezwa! Kazi zimeundwa kiotomatiki.`
        : `✨ ${crop.name} added! Tasks auto-generated.`
    );
  };

  const autoGenerateTasks = async (
    planting: Planting,
    template: GrowingTemplate,
    crop: CropProfile,
    field: Field
  ) => {
    try {
      const planForGen = {
        id: planting.id,
        cropId: planting.cropId,
        templateId: planting.templateId,
        acres: planting.acres,
        plantingDate: planting.plantingDate,
        harvestDate: planting.harvestDate,
        status: planting.status,
        expectedYield: planting.expectedYield,
        estimatedRevenue: planting.estimatedRevenue,
        cropName: crop.name,
        templateName: template.name,
        fieldName: field.name
      };

      const generatedTasks = generateTasksFromTemplate(
        planForGen,
        {
          id: template.id,
          cropId: template.cropId,
          name: template.name,
          growthStages: template.growthStages,
          inputs: template.inputs,
          expectedYield: template.expectedYield
        }
      );

      const tasksToSave = generatedTasks.map(task => ({
        ...task,
        dueDate: task.dueDate.toISOString()
      }));

      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/tasks/batch`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ tasks: tasksToSave, userId })
        }
      );
    } catch (error) {
      console.error('Task generation error:', error);
    }
  };

  const handleDeletePlanting = (plantingId: string) => {
    const planting = plantings.find(p => p.id === plantingId);
    const crop = cropProfiles.find(c => c.id === planting?.cropId);
    
    setPlantings(plantings.filter(p => p.id !== plantingId));
    
    toast.success(
      language === "sw"
        ? `${crop?.name} imeondolewa`
        : `${crop?.name} removed`
    );
  };

  const handleDuplicatePlanting = (plantingId: string) => {
    const original = plantings.find(p => p.id === plantingId);
    if (!original) return;

    const crop = cropProfiles.find(c => c.id === original.cropId);
    
    const duplicate: Planting = {
      ...original,
      id: `p${Date.now()}`,
      status: "planned"
    };

    setPlantings([...plantings, duplicate]);
    
    toast.success(
      language === "sw"
        ? `${crop?.name} imenakiliwa`
        : `${crop?.name} duplicated`
    );
  };

  // ==========================================
  // SEASONAL TEMPLATES
  // ==========================================

  const handleSaveAsTemplate = () => {
    if (!templateForm.name.trim()) {
      toast.error(language === "sw" ? "Weka jina la kiolezo" : "Enter template name");
      return;
    }

    const template: SeasonTemplate = {
      id: `st${Date.now()}`,
      name: templateForm.name,
      description: templateForm.description,
      plantings: plantings.map(p => ({
        cropId: p.cropId,
        templateId: p.templateId,
        fieldId: p.fieldId,
        acres: p.acres,
        plantingDate: p.plantingDate,
        harvestDate: p.harvestDate,
        status: p.status,
        expectedYield: p.expectedYield,
        estimatedRevenue: p.estimatedRevenue
      })),
      totalRevenue,
      totalYield,
      createdAt: new Date().toISOString()
    };

    setSeasonTemplates([...seasonTemplates, template]);
    setTemplateForm({ name: "", description: "" });
    setShowSaveTemplateDialog(false);

    toast.success(
      language === "sw"
        ? `✨ Kiolezo "${template.name}" kimehifadhiwa`
        : `✨ Template "${template.name}" saved`
    );
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = seasonTemplates.find(t => t.id === templateId);
    if (!template) return;

    // Clear current plantings
    setPlantings([]);

    // Load template plantings with new dates (current year)
    const currentYear = new Date().getFullYear();
    const newPlantings: Planting[] = template.plantings.map((p, idx) => {
      const originalDate = new Date(p.plantingDate);
      const newDate = new Date(currentYear, originalDate.getMonth(), originalDate.getDate());
      
      const crop = cropProfiles.find(c => c.id === p.cropId);
      const harvestDate = crop 
        ? calculateHarvestDate(newDate.toISOString().split('T')[0], crop.growthCycle)
        : p.harvestDate;

      return {
        ...p,
        id: `p${Date.now()}-${idx}`,
        plantingDate: newDate.toISOString().split('T')[0],
        harvestDate,
        startWeek: getWeekNumber(newDate),
        durationWeeks: crop ? Math.ceil(crop.growthCycle / 7) : 17
      };
    });

    setPlantings(newPlantings);
    setShowLoadTemplateDialog(false);

    toast.success(
      language === "sw"
        ? `✨ Kiolezo "${template.name}" kimepakiwa`
        : `✨ Template "${template.name}" loaded`
    );
  };

  // ==========================================
  // VISUAL TIMELINE RENDERING
  // ==========================================

  const renderTimeline = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(currentYear, currentMonth + i, 1);
      months.push({
        month: monthDate.getMonth(),
        year: monthDate.getFullYear(),
        name: monthDate.toLocaleString('default', { month: 'short' }),
        weekStart: getWeekNumber(monthDate)
      });
    }

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Month Headers */}
          <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
            <div className="w-40 px-4 py-2 text-sm font-medium text-gray-700 border-r border-gray-200">
              {viewMode === "crop" 
                ? (language === "sw" ? "Mazao" : "Crops")
                : (language === "sw" ? "Mashamba" : "Fields")}
            </div>
            <div className="flex-1 flex">
              {months.map((m, idx) => (
                <div 
                  key={idx} 
                  className="flex-1 px-2 py-2 text-xs font-medium text-gray-600 text-center border-r border-gray-200"
                >
                  {m.name} {m.year}
                </div>
              ))}
            </div>
          </div>

          {/* Planting Rows */}
          {viewMode === "crop" ? renderCropView(months) : renderFieldView(months)}
        </div>
      </div>
    );
  };

  const renderCropView = (months: any[]) => {
    const uniqueCrops = [...new Set(plantings.map(p => p.cropId))];

    if (uniqueCrops.length === 0) {
      return (
        <div className="p-12 text-center text-gray-500">
          <Sprout className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>{language === "sw" ? "Hakuna mazao bado" : "No crops yet"}</p>
        </div>
      );
    }

    return uniqueCrops.map(cropId => {
      const crop = cropProfiles.find(c => c.id === cropId);
      const cropPlantings = plantings.filter(p => p.cropId === cropId);

      return (
        <div key={cropId} className="flex border-b border-gray-200 hover:bg-gray-50">
          <div className="w-40 px-4 py-3 border-r border-gray-200">
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-[#2E7D32]" />
              <div>
                <p className="text-sm font-medium text-gray-900">{crop?.name}</p>
                <p className="text-xs text-gray-500">
                  {cropPlantings.reduce((s, p) => s + p.acres, 0)} acres
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 relative h-16">
            {cropPlantings.map(planting => renderPlantingBlock(planting, months))}
          </div>
        </div>
      );
    });
  };

  const renderFieldView = (months: any[]) => {
    return fields.map(field => {
      const fieldPlantings = plantings.filter(p => p.fieldId === field.id);
      const util = fieldUtilization.find(u => u.fieldId === field.id);

      return (
        <div 
          key={field.id} 
          className={`flex border-b border-gray-200 hover:bg-gray-50 transition-colors ${
            dragOverField === field.id ? 'bg-gray-100 border-[#2E7D32]' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, field.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, field.id)}
        >
          <div className="w-40 px-4 py-3 border-r border-gray-200">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#2E7D32]" />
              <div>
                <p className="text-sm font-medium text-gray-900">{field.name}</p>
                <p className="text-xs text-gray-500">
                  {util?.used.toFixed(1)}/{field.acres} acres
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 relative h-16">
            {fieldPlantings.map(planting => renderPlantingBlock(planting, months))}
          </div>
        </div>
      );
    });
  };

  const renderPlantingBlock = (planting: Planting, months: any[]) => {
    const crop = cropProfiles.find(c => c.id === planting.cropId);
    const startDate = new Date(planting.plantingDate);
    const endDate = new Date(planting.harvestDate);
    
    const firstWeek = months[0].weekStart;
    const leftPercent = ((planting.startWeek - firstWeek) / 52) * 100;
    const widthPercent = (planting.durationWeeks / 52) * 100;

    return (
      <div
        key={planting.id}
        className={`absolute top-2 h-12 bg-white border-2 ${
          selectedPlanting?.id === planting.id 
            ? 'border-[#2E7D32] shadow-md' 
            : draggedPlanting === planting.id
            ? 'border-gray-400 opacity-50'
            : 'border-gray-300 hover:border-[#2E7D32]'
        } rounded cursor-move transition-all`}
        style={{
          left: `${leftPercent}%`,
          width: `${widthPercent}%`,
          minWidth: '80px'
        }}
        onClick={() => setSelectedPlanting(planting)}
        draggable
        onDragStart={(e) => handleDragStart(e, planting.id)}
        onDragEnd={() => setDraggedPlanting(null)}
      >
        <div className="px-2 py-1 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <p className="text-xs font-medium text-gray-900 truncate">
              {crop?.name}
            </p>
            <Badge className="text-xs bg-gray-100 text-gray-700" variant="outline">
              {planting.acres}ac
            </Badge>
          </div>
          <p className="text-xs text-gray-500">
            {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} →{' '}
            {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>
    );
  };

  // ==========================================
  // INSIGHTS PANEL
  // ==========================================

  const InsightsPanel = () => (
    <Card className="border border-gray-200">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">
            {language === "sw" ? "Muhtasari" : "Insights"}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInsights(!showInsights)}
          >
            {showInsights ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {showInsights && (
          <>
            {/* Space Utilization */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600">
                  {language === "sw" ? "Matumizi ya Shamba" : "Space Utilization"}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {utilizationPercent.toFixed(1)}%
                </p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2E7D32]"
                  style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {allocatedAcres.toFixed(1)} / {totalFarmSize} acres
              </p>
            </div>

            {/* Total Yield */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded">
                <BarChart3 className="h-4 w-4 text-[#2E7D32]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600">
                  {language === "sw" ? "Jumla ya Mavuno" : "Total Yield"}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {totalYield.toFixed(1)} tons
                </p>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded">
                <DollarSign className="h-4 w-4 text-[#2E7D32]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600">
                  {language === "sw" ? "Mapato Yanayotarajiwa" : "Expected Revenue"}
                </p>
                <p className="text-lg font-bold text-[#2E7D32]">
                  {formatCurrency(totalRevenue, language)}
                </p>
              </div>
            </div>

            {/* Active Crops */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded">
                <Sprout className="h-4 w-4 text-[#2E7D32]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600">
                  {language === "sw" ? "Mazao Yaliyopangwa" : "Planned Crops"}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {plantings.length}
                </p>
              </div>
            </div>

            {/* AI Optimizations Available */}
            {generateAIOptimizations.length > 0 && (
              <div className="pt-3 border-t border-gray-200">
                <Button
                  onClick={() => setShowAIOptimizationDialog(true)}
                  className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm"
                  size="sm"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {language === "sw" 
                    ? `${generateAIOptimizations.length} Mapendekezo`
                    : `${generateAIOptimizations.length} AI Suggestions`}
                </Button>
              </div>
            )}

            {/* Warnings */}
            {availableAcres < 0 && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-gray-700 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-900">
                      {language === "sw" ? "Shamba limezidi" : "Farm over-allocated"}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {language === "sw"
                        ? `Punguza ekari ${Math.abs(availableAcres).toFixed(1)}`
                        : `Reduce by ${Math.abs(availableAcres).toFixed(1)} acres`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  // ==========================================
  // RENDER MAIN COMPONENT
  // ==========================================

  return (
    <div className="space-y-4 pb-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {language === "sw" ? "Mpango wa Mazao" : "Visual Crop Planner"}
          </h2>
          <p className="text-sm text-gray-600">
            {language === "sw" 
              ? "Panga msimu wako kwa kuona" 
              : "Plan your season visually"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* AI Optimization */}
          {generateAIOptimizations.length > 0 && (
            <Button
              onClick={() => setShowAIOptimizationDialog(true)}
              variant="outline"
              size="sm"
              className="border-[#2E7D32] text-[#2E7D32] hover:bg-gray-50"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {language === "sw" ? "AI" : "AI Optimize"}
            </Button>
          )}

          {/* Template Actions */}
          {plantings.length > 0 && (
            <Button
              onClick={() => setShowSaveTemplateDialog(true)}
              variant="outline"
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {language === "sw" ? "Hifadhi" : "Save Template"}
            </Button>
          )}

          {seasonTemplates.length > 0 && (
            <Button
              onClick={() => setShowLoadTemplateDialog(true)}
              variant="outline"
              size="sm"
            >
              <RotateCw className="h-4 w-4 mr-2" />
              {language === "sw" ? "Pakia" : "Load Template"}
            </Button>
          )}

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded p-1">
            <button
              onClick={() => setViewMode("crop")}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === "crop"
                  ? "bg-white text-[#2E7D32] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Sprout className="h-3 w-3 inline mr-1" />
              {language === "sw" ? "Mazao" : "Crops"}
            </button>
            <button
              onClick={() => setViewMode("field")}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === "field"
                  ? "bg-white text-[#2E7D32] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <MapPin className="h-3 w-3 inline mr-1" />
              {language === "sw" ? "Mashamba" : "Fields"}
            </button>
          </div>

          {/* Add Planting */}
          <Button
            onClick={() => setShowAddPlantingDialog(true)}
            className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            {language === "sw" ? "Ongeza" : "Add Planting"}
          </Button>
        </div>
      </div>

      {/* Main Layout: Timeline + Insights */}
      <div className="grid lg:grid-cols-[1fr_280px] gap-4">
        {/* Timeline Canvas */}
        <Card className="border border-gray-200">
          <CardContent className="p-0">
            {/* Timeline Navigation */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear(currentYear - 1);
                  } else {
                    setCurrentMonth(currentMonth - 1);
                  }
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <p className="text-sm font-medium text-gray-900">
                {new Date(currentYear, currentMonth).toLocaleString('default', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear(currentYear + 1);
                  } else {
                    setCurrentMonth(currentMonth + 1);
                  }
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Timeline Grid */}
            {renderTimeline()}
          </CardContent>
        </Card>

        {/* Insights Panel */}
        <div className="hidden lg:block">
          <InsightsPanel />
        </div>
      </div>

      {/* Mobile Insights */}
      <div className="lg:hidden">
        <InsightsPanel />
      </div>

      {/* Selected Planting Details */}
      {selectedPlanting && (
        <Card className="border-[#2E7D32] bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {cropProfiles.find(c => c.id === selectedPlanting.cropId)?.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {fields.find(f => f.id === selectedPlanting.fieldId)?.name}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDuplicatePlanting(selectedPlanting.id)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleDeletePlanting(selectedPlanting.id);
                    setSelectedPlanting(null);
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-600">
                  {language === "sw" ? "Ekari" : "Acres"}
                </p>
                <p className="font-medium text-gray-900">{selectedPlanting.acres}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">
                  {language === "sw" ? "Mavuno" : "Yield"}
                </p>
                <p className="font-medium text-gray-900">
                  {(selectedPlanting.acres * selectedPlanting.expectedYield).toFixed(1)} tons
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">
                  {language === "sw" ? "Mapato" : "Revenue"}
                </p>
                <p className="font-medium text-[#2E7D32]">
                  {formatCurrency(selectedPlanting.estimatedRevenue, language)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">
                  {language === "sw" ? "Hali" : "Status"}
                </p>
                <Badge variant="outline" className="text-xs">
                  {selectedPlanting.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Planting Dialog */}
      <Dialog open={showAddPlantingDialog} onOpenChange={setShowAddPlantingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === "sw" ? "Ongeza Upandaji" : "Add Planting"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>{language === "sw" ? "Zao" : "Crop"}</Label>
              <Select 
                value={newPlanting.cropId} 
                onValueChange={(value) => setNewPlanting({ ...newPlanting, cropId: value, templateId: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "sw" ? "Chagua zao" : "Select crop"} />
                </SelectTrigger>
                <SelectContent>
                  {cropProfiles.map(crop => (
                    <SelectItem key={crop.id} value={crop.id}>
                      {crop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newPlanting.cropId && (
              <div>
                <Label>{language === "sw" ? "Kiolezo" : "Template"}</Label>
                <Select 
                  value={newPlanting.templateId} 
                  onValueChange={(value) => setNewPlanting({ ...newPlanting, templateId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === "sw" ? "Chagua kiolezo" : "Select template"} />
                  </SelectTrigger>
                  <SelectContent>
                    {growingTemplates
                      .filter(t => t.cropId === newPlanting.cropId)
                      .map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>{language === "sw" ? "Shamba" : "Field"}</Label>
              <Select 
                value={newPlanting.fieldId} 
                onValueChange={(value) => setNewPlanting({ ...newPlanting, fieldId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "sw" ? "Chagua shamba" : "Select field"} />
                </SelectTrigger>
                <SelectContent>
                  {fields.map(field => {
                    const util = fieldUtilization.find(u => u.fieldId === field.id);
                    return (
                      <SelectItem key={field.id} value={field.id}>
                        {field.name} ({util?.available.toFixed(1)} acres available)
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{language === "sw" ? "Ekari" : "Acres"}</Label>
              <Input
                type="number"
                value={newPlanting.acres || ""}
                onChange={(e) => setNewPlanting({ ...newPlanting, acres: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <Label>{language === "sw" ? "Tarehe ya Kupanda" : "Planting Date"}</Label>
              <Input
                type="date"
                value={newPlanting.plantingDate}
                onChange={(e) => setNewPlanting({ ...newPlanting, plantingDate: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddPlanting}
                disabled={!newPlanting.cropId || !newPlanting.templateId || !newPlanting.fieldId || newPlanting.acres <= 0}
                className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
              >
                {language === "sw" ? "Ongeza" : "Add Planting"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddPlantingDialog(false)}
              >
                {language === "sw" ? "Ghairi" : "Cancel"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Template Dialog */}
      <Dialog open={showSaveTemplateDialog} onOpenChange={setShowSaveTemplateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === "sw" ? "Hifadhi Kiolezo cha Msimu" : "Save Season Template"}
            </DialogTitle>
            <DialogDescription>
              {language === "sw" 
                ? "Hifadhi mpango huu wa msimu kama kiolezo kinachoweza kutumiwa tena"
                : "Save this season plan as a reusable template"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>{language === "sw" ? "Jina la Kiolezo" : "Template Name"}</Label>
              <Input
                value={templateForm.name}
                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                placeholder={language === "sw" ? "Mfano: Msimu wa Mvua 2026" : "e.g., Rainy Season 2026"}
              />
            </div>

            <div>
              <Label>{language === "sw" ? "Maelezo" : "Description"}</Label>
              <Textarea
                value={templateForm.description}
                onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                placeholder={language === "sw" ? "Maelezo ya kiolezo..." : "Template description..."}
                rows={3}
              />
            </div>

            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-xs text-gray-600 mb-2">
                {language === "sw" ? "Kile kinachohifadhiwa:" : "What will be saved:"}
              </p>
              <div className="space-y-1 text-xs">
                <p className="text-gray-900">
                  • {plantings.length} {language === "sw" ? "upandaji" : "plantings"}
                </p>
                <p className="text-gray-900">
                  • {formatCurrency(totalRevenue, language)} {language === "sw" ? "mapato" : "revenue"}
                </p>
                <p className="text-gray-900">
                  • {totalYield.toFixed(1)} tons {language === "sw" ? "mavuno" : "yield"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSaveAsTemplate}
                disabled={!templateForm.name.trim()}
                className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {language === "sw" ? "Hifadhi" : "Save Template"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSaveTemplateDialog(false)}
              >
                {language === "sw" ? "Ghairi" : "Cancel"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Load Template Dialog */}
      <Dialog open={showLoadTemplateDialog} onOpenChange={setShowLoadTemplateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === "sw" ? "Pakia Kiolezo cha Msimu" : "Load Season Template"}
            </DialogTitle>
            <DialogDescription>
              {language === "sw" 
                ? "Chagua kiolezo cha msimu uliohifadhi"
                : "Select a saved season template"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {seasonTemplates.map(template => (
              <Card 
                key={template.id} 
                className="border border-gray-200 hover:border-[#2E7D32] cursor-pointer transition-colors"
                onClick={() => handleLoadTemplate(template.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{template.name}</h4>
                      {template.description && (
                        <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                      )}
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-[#2E7D32]" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500">{language === "sw" ? "Mazao" : "Crops"}</p>
                      <p className="font-medium text-gray-900">{template.plantings.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">{language === "sw" ? "Mavuno" : "Yield"}</p>
                      <p className="font-medium text-gray-900">{template.totalYield.toFixed(1)}t</p>
                    </div>
                    <div>
                      <p className="text-gray-500">{language === "sw" ? "Mapato" : "Revenue"}</p>
                      <p className="font-medium text-[#2E7D32]">
                        {formatCurrency(template.totalRevenue, language)}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    {language === "sw" ? "Ilihifadhiwa: " : "Saved: "}
                    {new Date(template.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}

            {seasonTemplates.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Save className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm">
                  {language === "sw" 
                    ? "Hakuna violezo vilivyohifadhiwa bado"
                    : "No saved templates yet"}
                </p>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setShowLoadTemplateDialog(false)}
            className="w-full"
          >
            {language === "sw" ? "Funga" : "Close"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* AI Optimization Dialog */}
      <Dialog open={showAIOptimizationDialog} onOpenChange={setShowAIOptimizationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#2E7D32]" />
              {language === "sw" ? "Mapendekezo ya AI" : "AI Optimization Suggestions"}
            </DialogTitle>
            <DialogDescription>
              {language === "sw" 
                ? "Fanya maboresho haya kuboresha mpango wako wa msimu"
                : "Apply these suggestions to improve your season plan"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {generateAIOptimizations.map((opt, idx) => (
              <Card 
                key={idx}
                className="border border-gray-200 hover:border-[#2E7D32] transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded ${
                      opt.priority === "high" ? "bg-gray-100" :
                      opt.priority === "medium" ? "bg-gray-50" :
                      "bg-gray-50"
                    }`}>
                      {opt.type === "date" && <Calendar className="h-4 w-4 text-[#2E7D32]" />}
                      {opt.type === "revenue" && <DollarSign className="h-4 w-4 text-[#2E7D32]" />}
                      {opt.type === "rotation" && <RotateCw className="h-4 w-4 text-[#2E7D32]" />}
                      {opt.type === "crop" && <Sprout className="h-4 w-4 text-[#2E7D32]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900">{opt.title}</h4>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                        >
                          {opt.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{opt.description}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      opt.action();
                      setShowAIOptimizationDialog(false);
                    }}
                    size="sm"
                    className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
                  >
                    <Zap className="h-3 w-3 mr-2" />
                    {language === "sw" ? "Tekeleza" : "Apply"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setShowAIOptimizationDialog(false)}
            className="w-full"
          >
            {language === "sw" ? "Funga" : "Close"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

VisualCropPlannerEnhanced.displayName = "VisualCropPlannerEnhanced";