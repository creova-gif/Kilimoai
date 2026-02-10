import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { supabase } from "../utils/supabase/client"; // ✅ Use singleton client
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface FormField {
  field: string;
  type: "text" | "number" | "checkbox" | "select" | "multiselect";
  label: string;
  label_sw?: string;
  required?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  options?: string[];
  options_sw?: string[];
  depends_on?: string;
}

interface DynamicRoleOnboardingProps {
  userRole: string;
  userName: string;
  language?: "en" | "sw";
  onComplete: (formData: Record<string, any>) => void;
  onSkip?: () => void;
}

export function DynamicRoleOnboarding({
  userRole,
  userName,
  language = "en",
  onComplete,
  onSkip,
}: DynamicRoleOnboardingProps) {
  const [formSchema, setFormSchema] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch form schema from Supabase
  useEffect(() => {
    async function fetchFormSchema() {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("role_forms")
          .select("form_schema")
          .eq("role_name", userRole)
          .single();

        if (fetchError) {
          console.error("Error fetching form schema:", fetchError);
          setError("Failed to load onboarding form");
          // Fallback to basic form
          setFormSchema([
            {
              field: "preferred_language",
              type: "select",
              label: "Preferred language",
              label_sw: "Lugha unayopendelea",
              required: true,
              options: ["English", "Swahili"],
              options_sw: ["Kiingereza", "Kiswahili"],
            },
          ]);
        } else if (data && data.form_schema) {
          setFormSchema(data.form_schema as FormField[]);
        }
      } catch (err) {
        console.error("Exception fetching form schema:", err);
        setError("An error occurred loading the form");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFormSchema();
  }, [userRole]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateField = (field: FormField): string | null => {
    const value = formData[field.field];

    // Check if field should be shown (dependency check)
    if (field.depends_on && !formData[field.depends_on]) {
      return null; // Skip validation for hidden fields
    }

    if (field.required && (value === undefined || value === "" || value === null)) {
      return `${field.label} is required`;
    }

    if (field.type === "number" && value !== undefined && value !== "") {
      if (field.min !== undefined && value < field.min) {
        return `Minimum value is ${field.min}`;
      }
      if (field.max !== undefined && value > field.max) {
        return `Maximum value is ${field.max}`;
      }
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    formSchema.forEach((field) => {
      const error = validateField(field);
      if (error) {
        newErrors[field.field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const handleNext = () => {
    if (currentStep < formSchema.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getLabel = (field: FormField): string => {
    return language === "sw" && field.label_sw ? field.label_sw : field.label;
  };

  const getOptions = (field: FormField): string[] => {
    return language === "sw" && field.options_sw
      ? field.options_sw
      : field.options || [];
  };

  const shouldShowField = (field: FormField): boolean => {
    if (!field.depends_on) return true;
    return !!formData[field.depends_on];
  };

  const renderField = (field: FormField) => {
    if (!shouldShowField(field)) return null;

    const label = getLabel(field);
    const hasError = !!errors[field.field];

    switch (field.type) {
      case "text":
        return (
          <div key={field.field} className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={formData[field.field] || ""}
              onChange={(e) => handleChange(field.field, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                hasError
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              } focus:outline-none`}
            />
            {hasError && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors[field.field]}
              </p>
            )}
          </div>
        );

      case "number":
        return (
          <div key={field.field} className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              value={formData[field.field] || ""}
              onChange={(e) => handleChange(field.field, parseFloat(e.target.value))}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                hasError
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              } focus:outline-none`}
            />
            {hasError && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors[field.field]}
              </p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.field} className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={!!formData[field.field]}
                onChange={(e) => handleChange(field.field, e.target.checked)}
                className="w-5 h-5 rounded border-2 border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
              />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition-colors">
                {label}
              </span>
            </label>
          </div>
        );

      case "select":
        return (
          <div key={field.field} className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={formData[field.field] || ""}
              onChange={(e) => handleChange(field.field, e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all bg-white ${
                hasError
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              } focus:outline-none`}
            >
              <option value="">Select an option</option>
              {getOptions(field).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {hasError && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors[field.field]}
              </p>
            )}
          </div>
        );

      case "multiselect":
        const selectedValues = formData[field.field] || [];
        return (
          <div key={field.field} className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {getOptions(field).map((option) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      const newValues = isSelected
                        ? selectedValues.filter((v: string) => v !== option)
                        : [...selectedValues, option];
                      handleChange(field.field, newValues);
                    }}
                    className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      isSelected
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {hasError && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors[field.field]}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="p-12 bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
            <p className="text-gray-600 font-medium">Loading your onboarding form...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error && formSchema.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="p-8 bg-white/95 backdrop-blur-xl border-0 shadow-2xl max-w-md">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-16 w-16 text-red-500" />
            <h3 className="text-xl font-bold text-gray-900">Error Loading Form</h3>
            <p className="text-gray-600">{error}</p>
            <Button
              onClick={() => onSkip?.()}
              className="bg-[#2E7D32] hover:opacity-90"
            >
              Continue Anyway
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="relative max-w-2xl w-full bg-white/95 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200">
          <motion.div
            className="h-full bg-[#2E7D32]"
            initial={{ width: 0 }}
            animate={{
              width: `${((Object.keys(formData).length) / formSchema.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex p-4 rounded-2xl bg-[#2E7D32] shadow-xl mb-4"
            >
              <CheckCircle className="h-12 w-12 text-white" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              {language === "sw" ? "Karibu" : "Welcome"}, {userName}!
            </h2>
            <p className="text-lg text-green-600 font-semibold">
              {language === "sw"
                ? "Tuambie zaidi kukuhusu"
                : "Tell us more about yourself"}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 mb-8">
            {formSchema.map((field) => renderField(field))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200">
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                {language === "sw" ? "Ruka" : "Skip for now"}
              </button>
            )}

            <Button
              type="submit"
              className="ml-auto bg-[#2E7D32] hover:opacity-90 flex items-center gap-2"
            >
              {language === "sw" ? "Endelea" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Completion Status */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>
              {Object.keys(formData).length} of {formSchema.filter(f => f.required).length} required fields completed
            </span>
          </div>
        </form>
      </Card>
    </div>
  );
}