import { LucideIcon } from "lucide-react";

interface AIMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  helper?: string;
  className?: string;
}

/**
 * AIMetricCard - Standardized metric display for AI features
 * ✅ Brand-compliant: Clean white with #2E7D32 accents
 * ✅ No color coding or gradients
 * ✅ Simple, readable design
 */
export function AIMetricCard({ 
  icon: Icon, 
  label, 
  value, 
  helper,
  className = ""
}: AIMetricCardProps) {
  return (
    <div className={`bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-[#2E7D32]/30 shadow-sm hover:shadow-md transition-all ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-[#2E7D32]/10 rounded-lg">
          <Icon className="h-4 w-4 text-[#2E7D32]" />
        </div>
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className="text-lg font-bold text-gray-900">
        {value}
      </p>
      {helper && (
        <p className="text-xs text-gray-500 mt-1">
          {helper}
        </p>
      )}
    </div>
  );
}
