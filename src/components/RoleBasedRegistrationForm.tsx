import image_e26027fb3aabd00c928ba655f087af31ac20983e from 'figma:asset/e26027fb3aabd00c928ba655f087af31ac20983e.png';
import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Sprout, Phone, Mail, Lock, User, MapPin,
  Wheat, UserCog, Building2, Package, GraduationCap, 
  Users, Star, ShieldCheck, AlertCircle, Lightbulb,
  ChevronRight, ChevronLeft, CheckCircle, Sparkles,
  TrendingUp, Calendar, Droplet, Users as TeamIcon,
  FileText, DollarSign, HelpCircle
} from "lucide-react";
import { CropSelector } from "./CropSelector";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface RegistrationData {
  // Common fields
  name: string;
  phone: string;
  email?: string;
  password: string;
  language: "en" | "sw";
  region: string;
  userType: string;
  role?: string;
  
  // Smallholder Farmer fields
  farmSize?: string;
  crops?: string[];
  livestock?: string;
  advisoryChannels?: string[];
  
  // Farmer (>5 acres) additional fields
  machineryAccess?: string;
  irrigationMethod?: string;
  lastSeasonYield?: string;
  numberOfWorkers?: string;
  
  // Farm Manager fields
  organization?: string;
  farmName?: string;
  teamSize?: string;
  cropTypesManaged?: string[];
  softwareGoal?: string;
  
  // Commercial Farm Admin fields
  commercialFarmName?: string;
  registrationLicense?: string;
  operationalAreas?: string[];
  workforceSize?: string;
  strategicKPIs?: string[];
  
  // Agribusiness Operations fields
  businessName?: string;
  businessLicense?: string;
  businessCategory?: string;
  annualVolume?: string;
  
  // Extension Officer / NGO fields
  orgName?: string;
  regionCoverage?: string[];
  farmersSupported?: string;
  programsManaged?: string[];
  
  // Cooperative Leader fields
  coopName?: string;
  memberCount?: string;
  storageCapacity?: string;
}

interface AIAssistance {
  field: string;
  suggestion: string;
  type: "info" | "warning" | "success";
}

interface RegistrationFormProps {
  onRegister: (data: RegistrationData) => Promise<void>;
  loading: boolean;
  language: "en" | "sw";
}

const REGIONS = [
  "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", 
  "Kagera", "Katavi", "Kigoma", "Kilimanjaro", "Lindi",
  "Manyara", "Mara", "Mbeya", "Morogoro", "Mtwara",
  "Mwanza", "Njombe", "Pwani", "Rukwa", "Ruvuma",
  "Shinyanga", "Simiyu", "Singida", "Songwe", "Tabora",
  "Tanga"
];

const ADVISORY_CHANNELS = ["SMS", "Voice Call", "Mobile App", "WhatsApp"];
const IRRIGATION_METHODS = ["Rain-fed", "Drip Irrigation", "Sprinkler", "Flood Irrigation", "Manual Watering"];
const MACHINERY_OPTIONS = ["Tractor", "Plough", "Harvester", "None", "Shared Access"];
const BUSINESS_CATEGORIES = ["Buyer", "Supplier", "Both"];

export function RoleBasedRegistrationForm({ onRegister, loading, language }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    name: "",
    phone: "",
    email: "",
    password: "",
    language: language,
    region: "",
    userType: "smallholder_farmer",
    role: "smallholder_farmer",
    crops: [],
    advisoryChannels: ["Mobile App"],
    // Initialize all optional fields with empty strings instead of undefined
    farmSize: "",
    livestock: "",
    machineryAccess: "",
    irrigationMethod: "",
    lastSeasonYield: "",
    numberOfWorkers: "",
    organization: "",
    farmName: "",
    teamSize: "",
    softwareGoal: "",
    commercialFarmName: "",
    registrationLicense: "",
    workforceSize: "",
    businessName: "",
    businessLicense: "",
    businessCategory: "",
    annualVolume: "",
    orgName: "",
    farmersSupported: "",
    coopName: "",
    memberCount: "",
    storageCapacity: "",
    cropTypesManaged: [],
    operationalAreas: [],
    strategicKPIs: [],
    regionCoverage: [],
    programsManaged: [],
  });
  
  const [phoneError, setPhoneError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [aiAssistance, setAiAssistance] = useState<AIAssistance[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;

  // Validate Tanzanian phone number
  const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const tanzaniaPhoneRegex = /^\+255[67]\d{8}$/;
    return tanzaniaPhoneRegex.test(cleanPhone);
  };

  // AI Assistance based on field values
  const getAIAssistance = (field: string, value: any): AIAssistance | null => {
    switch (field) {
      case "farmSize":
        if (value && parseFloat(value) > 0) {
          if (parseFloat(value) <= 2) {
            return {
              field: "farmSize",
              suggestion: "💡 For farms under 2 acres, we recommend our FREE Basic Advisory Package with SMS tips and weather alerts.",
              type: "info"
            };
          } else if (parseFloat(value) <= 5) {
            return {
              field: "farmSize",
              suggestion: "💡 Farms 2-5 acres typically benefit from our Crop Planning and Market Price features to maximize yields.",
              type: "success"
            };
          } else if (parseFloat(value) > 5 && parseFloat(value) <= 20) {
            return {
              field: "farmSize",
              suggestion: "💡 Consider upgrading to Farm Manager tier for advanced planning and workforce management tools.",
              type: "info"
            };
          }
        }
        break;
        
      case "crops":
        if (value && value.length > 0) {
          const crops = value as string[];
          if (crops.includes("Maize") || crops.includes("Rice")) {
            return {
              field: "crops",
              suggestion: `🌾 ${crops.includes("Maize") ? "Maize" : "Rice"} farming in your region has high Fall Armyworm risk. We'll provide weekly pest monitoring tips.`,
              type: "warning"
            };
          }
          if (crops.length >= 3) {
            return {
              field: "crops",
              suggestion: "✅ Multi-crop farming detected! We'll provide crop rotation advice to improve soil health.",
              type: "success"
            };
          }
        }
        break;
        
      case "irrigationMethod":
        if (value === "Rain-fed") {
          return {
            field: "irrigationMethod",
            suggestion: "🌧️ Rain-fed farming? We'll send you rainfall predictions and drought risk alerts for your region.",
            type: "info"
          };
        } else if (value === "Drip Irrigation") {
          return {
            field: "irrigationMethod",
            suggestion: "💧 Excellent choice! Drip irrigation can reduce water usage by 40-60%. We'll help you optimize water budgets.",
            type: "success"
          };
        }
        break;
        
      case "lastSeasonYield":
        if (value && parseFloat(value) > 0) {
          return {
            field: "lastSeasonYield",
            suggestion: "📊 Based on your last season data, our AI will generate yield improvement forecasts and recommendations.",
            type: "success"
          };
        }
        break;
        
      case "teamSize":
      case "numberOfWorkers":
        if (value && parseInt(value) > 5) {
          return {
            field: value,
            suggestion: "👥 With your team size, we recommend enabling Task Management and Workforce Analytics modules.",
            type: "info"
          };
        }
        break;
        
      case "annualVolume":
        if (value && parseFloat(value) > 0) {
          return {
            field: "annualVolume",
            suggestion: "📈 We'll provide market price trends and aggregation tips based on your volume to maximize profit margins.",
            type: "success"
          };
        }
        break;
        
      case "farmersSupported":
        if (value && parseInt(value) > 50) {
          return {
            field: "farmersSupported",
            suggestion: "🎯 For large farmer networks, we recommend offline survey tools and cohort grouping features.",
            type: "info"
          };
        }
        break;
        
      case "memberCount":
        if (value && parseInt(value) > 0) {
          return {
            field: "memberCount",
            suggestion: `✅ Expected workflow: Member registration → Harvest aggregation → Group sales. We'll set this up for ${value} members.`,
            type: "success"
          };
        }
        break;
    }
    return null;
  };

  // Update AI assistance when fields change
  useEffect(() => {
    const newAssistance: AIAssistance[] = [];
    
    Object.keys(formData).forEach((field) => {
      const value = formData[field as keyof RegistrationData];
      const assistance = getAIAssistance(field, value);
      if (assistance) {
        newAssistance.push(assistance);
      }
    });
    
    setAiAssistance(newAssistance);
  }, [formData]);

  // Progressive save to backend
  const saveProgress = async () => {
    setIsSaving(true);
    try {
      await fetch(`${API_BASE}/registration-progress`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone,
          step: currentStep,
          data: formData,
        }),
      });
    } catch (error) {
      console.log("Progress save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.name) errors.name = "Full name is required";
      if (!formData.phone) errors.phone = "Phone number is required";
      else if (!validatePhoneNumber(formData.phone)) {
        errors.phone = "Invalid Tanzanian phone number. Use format: +255 XXX XXX XXX";
      }
      if (!formData.password || formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
      if (!formData.language) errors.language = "Please select a language";
    }
    
    if (step === 2) {
      if (!formData.userType) errors.userType = "Please select a user type";
      if (!formData.region) errors.region = "Please select your region";
      
      // Role-specific validations
      if (formData.userType === "smallholder_farmer") {
        if (!formData.farmSize) errors.farmSize = "Farm size is required";
        if (!formData.crops || formData.crops.length === 0) {
          errors.crops = "Please select at least one crop";
        }
      }
      
      if (formData.userType === "farm_manager") {
        if (!formData.farmName) errors.farmName = "Farm name is required";
        if (!formData.teamSize) errors.teamSize = "Team size is required";
      }
      
      if (formData.userType === "commercial_farm") {
        if (!formData.commercialFarmName) errors.commercialFarmName = "Farm name is required";
        if (!formData.registrationLicense) errors.registrationLicense = "Registration license is required";
      }
      
      if (formData.userType === "agribusiness") {
        if (!formData.businessName) errors.businessName = "Business name is required";
        if (!formData.businessCategory) errors.businessCategory = "Business category is required";
      }
      
      if (formData.userType === "extension_officer") {
        if (!formData.orgName) errors.orgName = "Organization name is required";
        if (!formData.farmersSupported) errors.farmersSupported = "Number of farmers is required";
      }
      
      if (formData.userType === "cooperative") {
        if (!formData.coopName) errors.coopName = "Cooperative name is required";
        if (!formData.memberCount) errors.memberCount = "Member count is required";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      await saveProgress();
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    await onRegister(formData);
  };

  const renderStepIndicator = () => {
    const steps = ["Account", "Details", "Review"];
    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 ${
              currentStep > index + 1 ? "text-green-600" : 
              currentStep === index + 1 ? "text-green-600" : "text-gray-400"
            }`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                currentStep > index + 1 ? "bg-green-600 text-white" :
                currentStep === index + 1 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {currentStep > index + 1 ? <CheckCircle className="h-5 w-5" /> : index + 1}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{step}</span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderAIAssistance = () => {
    if (aiAssistance.length === 0) return null;
    
    return (
      <div className="space-y-2 mb-4">
        {aiAssistance.map((assist, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 p-3 rounded-xl border ${
              assist.type === "warning" ? "bg-amber-50 border-amber-200" :
              assist.type === "success" ? "bg-green-50 border-green-200" :
              "bg-gray-50 border-gray-200"
            }`}
          >
            <Sparkles className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
              assist.type === "warning" ? "text-amber-600" :
              assist.type === "success" ? "text-green-600" :
              "text-gray-600"
            }`} />
            <p className={`text-xs font-medium ${
              assist.type === "warning" ? "text-amber-800" :
              assist.type === "success" ? "text-green-800" :
              "text-gray-800"
            }`}>
              {assist.suggestion}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // Step 1: Basic Account Information
  const renderStep1 = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</Label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`pl-12 h-12 border-2 rounded-xl ${
              validationErrors.name ? "border-red-500" : "border-gray-200"
            }`}
          />
        </div>
        {validationErrors.name && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {validationErrors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            placeholder="+255 XXX XXX XXX"
            value={formData.phone}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, phone: e.target.value }));
              if (validationErrors.phone) {
                setValidationErrors(prev => ({ ...prev, phone: "" }));
              }
            }}
            className={`pl-12 h-12 border-2 rounded-xl ${
              validationErrors.phone ? "border-red-500" : "border-gray-200"
            }`}
          />
        </div>
        <p className="text-xs text-gray-500">This will be your primary login method</p>
        {validationErrors.phone && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {validationErrors.phone}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">Optional</span>
        </div>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="farmer@example.com"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="pl-12 h-12 border-2 border-gray-200 rounded-xl"
          />
        </div>
        <p className="text-xs text-gray-500">You can use email to log in later</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="Create a strong password (min. 6 characters)"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className={`pl-12 h-12 border-2 rounded-xl ${
              validationErrors.password ? "border-red-500" : "border-gray-200"
            }`}
          />
        </div>
        {validationErrors.password && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {validationErrors.password}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="language" className="text-sm font-semibold text-gray-700">Primary Language</Label>
        <Select
          value={formData.language}
          onValueChange={(value: "en" | "sw") => setFormData(prev => ({ ...prev, language: value }))}
        >
          <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="sw">Swahili (Kiswahili)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  // Step 2: Role-specific details
  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="userType" className="text-sm font-semibold text-gray-700">User Type & Role</Label>
        <Select
          value={formData.userType}
          onValueChange={(value) => setFormData(prev => ({ ...prev, userType: value, role: value }))}
        >
          <SelectTrigger className={`h-12 border-2 rounded-xl ${
            validationErrors.userType ? "border-red-500" : "border-gray-200"
          }`}>
            <SelectValue placeholder="Select user type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="smallholder_farmer">
              <div className="flex items-center gap-2">
                <Wheat className="h-4 w-4 text-green-600" />
                <span>Smallholder Farmer (0-5 acres)</span>
              </div>
            </SelectItem>
            <SelectItem value="farmer">
              <div className="flex items-center gap-2">
                <Wheat className="h-4 w-4 text-green-600" />
                <span>Farmer (&gt;5 acres)</span>
              </div>
            </SelectItem>
            <SelectItem value="farm_manager">
              <div className="flex items-center gap-2">
                <UserCog className="h-4 w-4 text-gray-600" />
                <span>Farm Manager</span>
              </div>
            </SelectItem>
            <SelectItem value="commercial_farm">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-600" />
                <span>Commercial Farm Admin</span>
              </div>
            </SelectItem>
            <SelectItem value="agribusiness">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-600" />
                <span>Agribusiness Operations</span>
              </div>
            </SelectItem>
            <SelectItem value="extension_officer">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-gray-600" />
                <span>Extension Officer / NGO</span>
              </div>
            </SelectItem>
            <SelectItem value="cooperative">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span>Cooperative Leader</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">Choose the role that best fits your farming operation size</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="region" className="text-sm font-semibold text-gray-700">Region</Label>
        <Select
          value={formData.region}
          onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
        >
          <SelectTrigger className={`h-12 border-2 rounded-xl ${
            validationErrors.region ? "border-red-500" : "border-gray-200"
          }`}>
            <SelectValue placeholder="Select your region" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {REGIONS.map((region) => (
              <SelectItem key={region} value={region}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-500" />
                  <span>{region}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {validationErrors.region && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {validationErrors.region}
          </p>
        )}
      </div>

      {/* Role-specific fields */}
      {formData.userType === "smallholder_farmer" && renderSmallholderFields()}
      {formData.userType === "farmer" && renderFarmerFields()}
      {formData.userType === "farm_manager" && renderFarmManagerFields()}
      {formData.userType === "commercial_farm" && renderCommercialFarmFields()}
      {formData.userType === "agribusiness" && renderAgribusinessFields()}
      {formData.userType === "extension_officer" && renderExtensionOfficerFields()}
      {formData.userType === "cooperative" && renderCooperativeFields()}
    </div>
  );

  // Smallholder Farmer Fields
  const renderSmallholderFields = () => (
    <>
      <div className="space-y-3 pt-2">
        <h3 className="text-lg font-semibold text-gray-900">Tell us about your farm</h3>
        <p className="text-sm text-gray-500">This helps us personalize your advice</p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="farmSize" className="text-sm font-semibold text-gray-700">Farm Size (Acres)</Label>
        <Input
          id="farmSize"
          type="number"
          placeholder="0"
          value={formData.farmSize}
          onChange={(e) => setFormData(prev => ({ ...prev, farmSize: e.target.value }))}
          className={`h-14 px-4 text-center text-xl font-bold border-2 rounded-xl ${
            validationErrors.farmSize ? "border-red-500" : "border-gray-200"
          }`}
        />
        <p className="text-xs text-gray-500 text-center">Total cultivated area of your farm</p>
        {validationErrors.farmSize && (
          <p className="text-xs text-red-600 flex items-center gap-1 justify-center">
            <AlertCircle className="h-3 w-3" />
            {validationErrors.farmSize}
          </p>
        )}
      </div>

      <div>
        <CropSelector
          selectedCrops={formData.crops || []}
          onCropsChange={(crops) => setFormData(prev => ({ ...prev, crops }))}
        />
        {validationErrors.crops && (
          <p className="text-xs text-red-600 flex items-center gap-1 mt-2">
            <AlertCircle className="h-3 w-3" />
            {validationErrors.crops}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Preferred Advisory Channels</Label>
        <div className="grid grid-cols-2 gap-2">
          {ADVISORY_CHANNELS.map((channel) => (
            <button
              key={channel}
              type="button"
              onClick={() => {
                const current = formData.advisoryChannels || [];
                const updated = current.includes(channel)
                  ? current.filter(c => c !== channel)
                  : [...current, channel];
                setFormData(prev => ({ ...prev, advisoryChannels: updated }));
              }}
              className={`h-12 rounded-xl border-2 transition-all font-medium text-sm ${
                (formData.advisoryChannels || []).includes(channel)
                  ? "border-green-500 bg-green-50 text-green-900"
                  : "border-gray-200 bg-white text-gray-700 hover:border-green-200"
              }`}
            >
              {channel}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  // Farmer (>5 acres) Fields
  const renderFarmerFields = () => (
    <>
      {renderSmallholderFields()}
      
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Machinery Access</Label>
        <Select
          value={formData.machineryAccess}
          onValueChange={(value) => setFormData(prev => ({ ...prev, machineryAccess: value }))}
        >
          <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl">
            <SelectValue placeholder="Select machinery access" />
          </SelectTrigger>
          <SelectContent>
            {MACHINERY_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Irrigation Method</Label>
        <Select
          value={formData.irrigationMethod}
          onValueChange={(value) => setFormData(prev => ({ ...prev, irrigationMethod: value }))}
        >
          <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl">
            <SelectValue placeholder="Select irrigation method" />
          </SelectTrigger>
          <SelectContent>
            {IRRIGATION_METHODS.map((method) => (
              <SelectItem key={method} value={method}>
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-gray-600" />
                  <span>{method}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-semibold text-gray-700">Last Season Yield (tons)</Label>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">Optional</span>
        </div>
        <Input
          type="number"
          placeholder="e.g., 2.5"
          value={formData.lastSeasonYield}
          onChange={(e) => setFormData(prev => ({ ...prev, lastSeasonYield: e.target.value }))}
          className="h-12 border-2 border-gray-200 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-semibold text-gray-700">Number of Workers</Label>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">Optional</span>
        </div>
        <Input
          type="number"
          placeholder="e.g., 5"
          value={formData.numberOfWorkers}
          onChange={(e) => setFormData(prev => ({ ...prev, numberOfWorkers: e.target.value }))}
          className="h-12 border-2 border-gray-200 rounded-xl"
        />
      </div>
    </>
  );

  // Farm Manager Fields
  const renderFarmManagerFields = () => (
    <>
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Organization</Label>
        <Input
          placeholder="Organization name"
          value={formData.organization}
          onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
          className="h-12 border-2 border-gray-200 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Farm Name</Label>
        <Input
          placeholder="Farm name"
          value={formData.farmName}
          onChange={(e) => setFormData(prev => ({ ...prev, farmName: e.target.value }))}
          className={`h-12 border-2 rounded-xl ${
            validationErrors.farmName ? "border-red-500" : "border-gray-200"
          }`}
        />
        {validationErrors.farmName && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {validationErrors.farmName}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Team Size</Label>
        <Input
          type="number"
          placeholder="Number of team members"
          value={formData.teamSize}
          onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))}
          className={`h-12 border-2 rounded-xl ${
            validationErrors.teamSize ? "border-red-500" : "border-gray-200"
          }`}
        />
        {validationErrors.teamSize && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {validationErrors.teamSize}
          </p>
        )}
      </div>

      <div>
        <CropSelector
          selectedCrops={formData.cropTypesManaged || []}
          onCropsChange={(crops) => setFormData(prev => ({ ...prev, cropTypesManaged: crops }))}
          label="Crop Types Managed"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-semibold text-gray-700">Software Usage Goal</Label>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          placeholder="e.g., Task management, crop planning"
          value={formData.softwareGoal}
          onChange={(e) => setFormData(prev => ({ ...prev, softwareGoal: e.target.value }))}
          className="h-12 border-2 border-gray-200 rounded-xl"
        />
      </div>
    </>
  );

  // Commercial Farm Admin Fields
  const renderCommercialFarmFields = () => (
    <>
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Commercial Farm Name</Label>
        <Input
          placeholder="Farm name"
          value={formData.commercialFarmName}
          onChange={(e) => setFormData(prev => ({ ...prev, commercialFarmName: e.target.value }))}
          className={`h-12 border-2 rounded-xl ${
            validationErrors.commercialFarmName ? "border-red-500" : "border-gray-200"
          }`}
        />
        {validationErrors.commercialFarmName && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {validationErrors.commercialFarmName}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Registration License #</Label>
        <Input
          placeholder="License number"
          value={formData.registrationLicense}
          onChange={(e) => setFormData(prev => ({ ...prev, registrationLicense: e.target.value }))}
          className={`h-12 border-2 rounded-xl ${
            validationErrors.registrationLicense ? "border-red-500" : "border-gray-200"
          }`}
        />
        {validationErrors.registrationLicense && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {validationErrors.registrationLicense}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Workforce Size</Label>
        <Input
          type="number"
          placeholder="Number of workers"
          value={formData.workforceSize}
          onChange={(e) => setFormData(prev => ({ ...prev, workforceSize: e.target.value }))}
          className="h-12 border-2 border-gray-200 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Operational Areas</Label>
        <Input
          placeholder="e.g., Kilimanjaro, Arusha"
          value={formData.operationalAreas?.join(", ")}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            operationalAreas: e.target.value.split(",").map(s => s.trim()) 
          }))}
          className="h-12 border-2 border-gray-200 rounded-xl"
        />
      </div>
    </>
  );

  // Agribusiness Operations Fields
  const renderAgribusinessFields = () => (
    <>
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Business Name</Label>
        <Input
          placeholder="Business name"
          value={formData.businessName}
          onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
          className={`h-12 border-2 rounded-xl ${
            validationErrors.businessName ? "border-red-500" : "border-gray-200"
          }`}
        />
        {validationErrors.businessName && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {validationErrors.businessName}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Registration License #</Label>
        <Input
          placeholder="License number"
          value={formData.businessLicense}
          onChange={(e) => setFormData(prev => ({ ...prev, businessLicense: e.target.value }))}
          className="h-12 border-2 border-gray-200 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Business Category</Label>
        <Select
          value={formData.businessCategory}
          onValueChange={(value) => setFormData(prev => ({ ...prev, businessCategory: value }))}
        >
          <SelectTrigger className={`h-12 border-2 rounded-xl ${
            validationErrors.businessCategory ? "border-red-500" : "border-gray-200"
          }`}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {BUSINESS_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {validationErrors.businessCategory && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {validationErrors.businessCategory}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Estimated Annual Volume (tons)</Label>
        <Input
          type="number"
          placeholder="e.g., 500"
          value={formData.annualVolume}
          onChange={(e) => setFormData(prev => ({ ...prev, annualVolume: e.target.value }))}
          className="h-12 border-2 border-gray-200 rounded-xl"
        />
      </div>
    </>
  );

  // Extension Officer / NGO Fields
  const renderExtensionOfficerFields = () => (
    <>
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Organization Name</Label>
        <Input
          placeholder="Organization name"
          value={formData.orgName}
          onChange={(e) => setFormData(prev => ({ ...prev, orgName: e.target.value }))}
          className={`h-12 border-2 rounded-xl ${
            validationErrors.orgName ? "border-red-500" : "border-gray-200"
          }`}
        />
        {validationErrors.orgName && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {validationErrors.orgName}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Region Coverage</Label>
        <Input
          placeholder="e.g., Kilimanjaro, Arusha, Mwanza"
          value={formData.regionCoverage?.join(", ")}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            regionCoverage: e.target.value.split(",").map(s => s.trim()) 
          }))}
          className="h-12 border-2 border-gray-200 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Number of Farmers Supported</Label>
        <Input
          type="number"
          placeholder="e.g., 150"
          value={formData.farmersSupported}
          onChange={(e) => setFormData(prev => ({ ...prev, farmersSupported: e.target.value }))}
          className={`h-12 border-2 rounded-xl ${
            validationErrors.farmersSupported ? "border-red-500" : "border-gray-200"
          }`}
        />
        {validationErrors.farmersSupported && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {validationErrors.farmersSupported}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Programs Under Management</Label>
        <Input
          placeholder="e.g., Climate adaptation, Market linkages"
          value={formData.programsManaged?.join(", ")}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            programsManaged: e.target.value.split(",").map(s => s.trim()) 
          }))}
          className="h-12 border-2 border-gray-200 rounded-xl"
        />
      </div>
    </>
  );

  // Cooperative Leader Fields
  const renderCooperativeFields = () => (
    <>
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Cooperative Name</Label>
        <Input
          placeholder="Cooperative name"
          value={formData.coopName}
          onChange={(e) => setFormData(prev => ({ ...prev, coopName: e.target.value }))}
          className={`h-12 border-2 rounded-xl ${
            validationErrors.coopName ? "border-red-500" : "border-gray-200"
          }`}
        />
        {validationErrors.coopName && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {validationErrors.coopName}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Member Count</Label>
        <Input
          type="number"
          placeholder="e.g., 250"
          value={formData.memberCount}
          onChange={(e) => setFormData(prev => ({ ...prev, memberCount: e.target.value }))}
          className={`h-12 border-2 rounded-xl ${
            validationErrors.memberCount ? "border-red-500" : "border-gray-200"
          }`}
        />
        {validationErrors.memberCount && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {validationErrors.memberCount}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Storage Capacity (tons)</Label>
        <Input
          type="number"
          placeholder="e.g., 50"
          value={formData.storageCapacity}
          onChange={(e) => setFormData(prev => ({ ...prev, storageCapacity: e.target.value }))}
          className="h-12 border-2 border-gray-200 rounded-xl"
        />
      </div>
    </>
  );

  // Step 3: Review
  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Review Your Information</h3>
        <p className="text-sm text-gray-500 mt-1">Make sure everything looks correct</p>
      </div>

      <div className="space-y-3 bg-gray-50 rounded-xl p-4">
        <div className="flex justify-between items-start">
          <span className="text-sm text-gray-600">Full Name:</span>
          <span className="text-sm font-semibold text-gray-900">{formData.name}</span>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-sm text-gray-600">Phone:</span>
          <span className="text-sm font-semibold text-gray-900">{formData.phone}</span>
        </div>
        {formData.email && (
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-600">Email:</span>
            <span className="text-sm font-semibold text-gray-900">{formData.email}</span>
          </div>
        )}
        <div className="flex justify-between items-start">
          <span className="text-sm text-gray-600">User Type:</span>
          <span className="text-sm font-semibold text-gray-900 capitalize">
            {formData.userType.replace(/_/g, " ")}
          </span>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-sm text-gray-600">Region:</span>
          <span className="text-sm font-semibold text-gray-900">{formData.region}</span>
        </div>
        
        {formData.farmSize && (
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-600">Farm Size:</span>
            <span className="text-sm font-semibold text-gray-900">{formData.farmSize} acres</span>
          </div>
        )}
        
        {formData.crops && formData.crops.length > 0 && (
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-600">Crops:</span>
            <span className="text-sm font-semibold text-gray-900">{formData.crops.join(", ")}</span>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
        <AlertCircle className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-800 font-medium">
          By creating an account, you agree to KILIMO's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );

  return (
    <Card className="w-full shadow-2xl border-0 overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 p-6 md:p-8 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={image_e26027fb3aabd00c928ba655f087af31ac20983e}
              alt="KILIMO Logo" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-black mb-2">Join KILIMO Today!</h1>
          <p className="text-white/90 text-sm md:text-base">Smart Agriculture Solutions for Tanzanian Farmers</p>
        </div>
      </div>

      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStepIndicator()}
          
          {renderAIAssistance()}
          
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {currentStep > 1 && (
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="flex-1 h-12 rounded-xl font-semibold"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 rounded-xl font-semibold"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 rounded-xl font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sprout className="h-5 w-5" />
                    Create Account
                  </span>
                )}
              </Button>
            )}
          </div>

          {isSaving && (
            <p className="text-xs text-center text-gray-500">
              Saving progress...
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}