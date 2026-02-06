import image_e26027fb3aabd00c928ba655f087af31ac20983e from 'figma:asset/e26027fb3aabd00c928ba655f087af31ac20983e.png';
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Sprout, Phone, Mail, Lock, User, MapPin,
  Wheat, UserCog, Building2, Package, GraduationCap, 
  Users, Star, ShieldCheck, AlertCircle
} from "lucide-react";
import { CropSelector } from "./CropSelector";
import logo from "figma:asset/59f0b6f20637b554072039bc3a2caa41a72f5af6.png";

interface RegistrationData {
  name: string;
  phone: string;
  email?: string;
  password: string;
  region: string;
  farmSize: string;
  crops: string[];
  userType: string;
  role?: string;
  gender?: string;
  ageGroup?: string;
}

interface RegistrationFormProps {
  onRegister: (data: RegistrationData) => Promise<void>;
  loading: boolean;
}

const REGIONS = [
  "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", 
  "Kagera", "Katavi", "Kigoma", "Kilimanjaro", "Lindi",
  "Manyara", "Mara", "Mbeya", "Morogoro", "Mtwara",
  "Mwanza", "Njombe", "Pwani", "Rukwa", "Ruvuma",
  "Shinyanga", "Simiyu", "Singida", "Songwe", "Tabora",
  "Tanga"
];

export function RegistrationForm({ onRegister, loading }: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationData>({
    name: "",
    phone: "",
    email: "",
    password: "",
    region: "",
    farmSize: "",
    crops: [],
    userType: "farmer",
    role: "smallholder_farmer",
    gender: "",
    ageGroup: "",
  });

  const [phoneError, setPhoneError] = useState<string>("");

  // Validate Tanzanian phone number format
  const validatePhoneNumber = (phone: string): boolean => {
    // Remove all spaces and dashes for validation
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // Check if it matches Tanzanian format: +255 followed by 9 digits
    // Accepts: +255712345678, +255 712 345 678, +255-712-345-678, etc.
    const tanzaniaPhoneRegex = /^\+255[67]\d{8}$/;
    
    return tanzaniaPhoneRegex.test(cleanPhone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setFormData(prev => ({ ...prev, phone: newPhone }));
    
    // Clear error when user starts typing
    if (phoneError && newPhone.length < formData.phone.length) {
      setPhoneError("");
    }
    
    // Validate on blur or when user has entered enough characters
    if (newPhone.length >= 10) {
      if (!validatePhoneNumber(newPhone)) {
        setPhoneError("Invalid Tanzanian phone number. Use format: +255 XXX XXX XXX (must start with 6 or 7)");
      } else {
        setPhoneError("");
      }
    }
  };

  const handlePhoneBlur = () => {
    if (formData.phone && !validatePhoneNumber(formData.phone)) {
      setPhoneError("Invalid Tanzanian phone number. Use format: +255 XXX XXX XXX (must start with 6 or 7)");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    if (!validatePhoneNumber(formData.phone)) {
      setPhoneError("Invalid Tanzanian phone number. Use format: +255 XXX XXX XXX (must start with 6 or 7)");
      return;
    }
    
    await onRegister(formData);
  };

  return (
    <Card className="w-full shadow-2xl border-0 overflow-hidden">
      {/* Animated Header */}
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
          <p className="text-white/90 text-sm md:text-base">Smart Agriculture Solutions for Tanzanian Smallholder Farmers</p>
        </div>
      </div>

      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Information - No visual dividers, just clean flow */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors z-10" />
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="pl-12 h-12 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors z-10" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+255 XXX XXX XXX"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onBlur={handlePhoneBlur}
                  className="pl-12 h-12 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all bg-white"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">This will be your primary login method</p>
              {phoneError && (
                <p className="text-xs text-red-500">
                  {phoneError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">Optional</span>
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors z-10" />
                <Input
                  id="email"
                  type="email"
                  placeholder="farmer@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-12 h-12 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all bg-white"
                />
              </div>
              <p className="text-xs text-gray-500">
                You can use email to log in later
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors z-10" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password (min. 6 characters)"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-12 h-12 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Account Type - Seamless integration, no visual break */}
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="userType" className="text-sm font-medium text-gray-700">User Type & Role</Label>
              <Select
                value={formData.userType}
                onValueChange={(value) => {
                  // Map user type to role
                  let role = "smallholder_farmer";
                  if (value === "farmer") role = "smallholder_farmer";
                  else if (value === "farm_manager") role = "farm_manager";
                  else if (value === "commercial") role = "commercial_farm_admin";
                  else if (value === "agribusiness") role = "agribusiness_ops";
                  else if (value === "ngo") role = "extension_officer";
                  else if (value === "cooperative") role = "extension_officer";
                  
                  setFormData(prev => ({ ...prev, userType: value, role }));
                }}
              >
                <SelectTrigger id="userType" className="h-12 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-white">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmer" className="py-3">
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex items-center gap-2">
                        <Wheat className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Smallholder Farmer (0-5 acres)</span>
                      </div>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full whitespace-nowrap">FREE</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="farm_manager" className="py-3">
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex items-center gap-2">
                        <UserCog className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Farm Manager (5-50 acres)</span>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full whitespace-nowrap">BASIC</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="commercial" className="py-3">
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Commercial Farm Admin (50+ acres)</span>
                      </div>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full whitespace-nowrap">PREMIUM</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="agribusiness" className="py-3">
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Agribusiness Operations</span>
                      </div>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full whitespace-nowrap">PREMIUM</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ngo" className="py-3">
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Extension Officer / NGO</span>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full whitespace-nowrap">BASIC</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cooperative" className="py-3">
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Cooperative</span>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full whitespace-nowrap">BASIC</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Choose the role that best fits your farming operation size
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region" className="text-sm font-medium text-gray-700">Region</Label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors z-10 pointer-events-none" />
                <Select
                  value={formData.region}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
                >
                  <SelectTrigger id="region" className="h-12 pl-12 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-white">
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {REGIONS.map((region) => (
                      <SelectItem key={region} value={region} className="py-2.5">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-sm">{region}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Farmer Specific Fields - Ultra clean */}
          {formData.userType === "farmer" && (
            <div className="space-y-5 pt-2">
              {/* Clean Modern Header - More subtle */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">Tell us about your farm</h3>
                <p className="text-sm text-gray-500">This helps us personalize your advice</p>
              </div>

              {/* Farm Size - Premium card-style design */}
              <div className="space-y-3">
                <Label htmlFor="farmSize" className="text-sm font-medium text-gray-700">
                  Farm Size
                </Label>
                
                {/* Size Input - Prominent */}
                <div className="relative">
                  <Input
                    id="farmSize"
                    type="number"
                    placeholder="0"
                    value={formData.farmSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, farmSize: e.target.value }))}
                    className="h-16 px-4 text-center text-2xl font-bold border border-gray-300 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-2xl transition-all"
                  />
                </div>

                {/* Unit Toggle - Pill Style */}
                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit mx-auto">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, farmSizeUnit: 'acres' }))}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                      (formData as any).farmSizeUnit !== 'hectares'
                        ? 'bg-white text-green-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Acres
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, farmSizeUnit: 'hectares' }))}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                      (formData as any).farmSizeUnit === 'hectares'
                        ? 'bg-white text-green-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Hectares
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">Total cultivated area of your farm</p>
              </div>

              {/* Crop Selector - Seamless integration */}
              <div>
                <CropSelector
                  selectedCrops={formData.crops}
                  onCropsChange={(crops) => setFormData(prev => ({ ...prev, crops }))}
                />
              </div>

              {/* Optional Details - Ultra minimal */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, showOptionalDetails: !prev.showOptionalDetails }))}
                  className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-2 transition-colors group"
                >
                  <span>{(formData as any).showOptionalDetails ? 'Hide' : 'Add'} optional details</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${(formData as any).showOptionalDetails ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Optional Fields - Creative expansion */}
                {(formData as any).showOptionalDetails && (
                  <div className="mt-5 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    {/* Gender - Elegant 2x2 grid */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">
                        Gender
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, gender: 'female' }))}
                          className={`h-14 rounded-xl border-2 transition-all font-medium text-sm ${
                            formData.gender === 'female'
                              ? 'border-green-500 bg-green-50 text-green-900 shadow-sm'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-green-200 hover:bg-green-50/50'
                          }`}
                        >
                          Female
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, gender: 'male' }))}
                          className={`h-14 rounded-xl border-2 transition-all font-medium text-sm ${
                            formData.gender === 'male'
                              ? 'border-green-500 bg-green-50 text-green-900 shadow-sm'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-green-200 hover:bg-green-50/50'
                          }`}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, gender: 'other' }))}
                          className={`h-14 rounded-xl border-2 transition-all font-medium text-sm ${
                            formData.gender === 'other'
                              ? 'border-green-500 bg-green-50 text-green-900 shadow-sm'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-green-200 hover:bg-green-50/50'
                          }`}
                        >
                          Other
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, gender: 'prefer-not-to-say' }))}
                          className={`h-14 rounded-xl border-2 transition-all font-medium text-sm ${
                            formData.gender === 'prefer-not-to-say'
                              ? 'border-green-500 bg-green-50 text-green-900 shadow-sm'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-green-200 hover:bg-green-50/50'
                          }`}
                        >
                          Prefer not to say
                        </button>
                      </div>
                    </div>

                    {/* Age Range - Modern button grid instead of dropdown */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">
                        Age Range
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {['18-24', '25-34', '35-44', '45-54', '55-64', '65+'].map((age) => (
                          <button
                            key={age}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, ageGroup: age }))}
                            className={`h-12 rounded-xl border-2 transition-all font-medium text-sm ${
                              formData.ageGroup === age
                                ? 'border-green-500 bg-green-50 text-green-900 shadow-sm'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-green-200 hover:bg-green-50/50'
                            }`}
                          >
                            {age}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button - Premium feel */}
          <div className="space-y-3 pt-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 h-14 shadow-lg hover:shadow-xl text-base font-bold rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating your account...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sprout className="h-5 w-5" />
                  <span>Create Free Account</span>
                </span>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500 px-4">
              By signing up, you agree to KILIMO's Terms of Service and Privacy Policy
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}