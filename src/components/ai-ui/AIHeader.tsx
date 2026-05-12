import { LucideIcon, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface AIHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onRefresh?: () => void;
  refreshLabel?: string;
  language?: "en" | "sw";
}

/**
 * AIHeader - Standardized header for all AI features
 * ✅ Brand-compliant: Only uses #2E7D32
 * ✅ Clean, professional design
 * ✅ No gradients or decorative elements
 */
export function AIHeader({ 
  icon: Icon, 
  title, 
  description, 
  onRefresh,
  refreshLabel,
  language = "en"
}: AIHeaderProps) {
  return (
    <div className="rounded-2xl bg-[#2E7D32] p-6 shadow-lg">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {/* Icon Badge */}
          <div className="p-4 bg-white/20 rounded-2xl">
            <Icon className="h-8 w-8 text-white" />
          </div>

          {/* Title Section */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {title}
            </h2>
            <p className="text-sm md:text-base text-white/90 font-medium">
              {description}
            </p>
          </div>
        </div>

        {/* Action Button */}
        {onRefresh && (
          <Button 
            onClick={onRefresh} 
            size="lg" 
            className="bg-white text-[#2E7D32] hover:bg-white/90 font-bold shadow-lg"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {refreshLabel || (language === "sw" ? "Onyesha Upya" : "Refresh")}
          </Button>
        )}
      </div>
    </div>
  );
}
