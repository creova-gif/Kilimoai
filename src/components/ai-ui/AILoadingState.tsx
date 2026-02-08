import { RefreshCw } from "lucide-react";

interface AILoadingStateProps {
  message?: string;
  language?: "en" | "sw";
}

/**
 * AILoadingState - Standardized loading indicator for AI features
 * ✅ Brand-compliant: Uses #2E7D32
 * ✅ Clean, minimal design
 * ✅ Consistent across all AI tools
 */
export function AILoadingState({ 
  message,
  language = "en"
}: AILoadingStateProps) {
  const defaultMessage = language === "sw" ? "Inapakia..." : "Loading...";
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <RefreshCw className="h-8 w-8 animate-spin text-[#2E7D32] mb-4" />
      <p className="text-sm text-gray-600 font-medium">
        {message || defaultMessage}
      </p>
    </div>
  );
}
