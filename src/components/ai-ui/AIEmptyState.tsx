import { LucideIcon, Inbox } from "lucide-react";
import { Button } from "../ui/button";

interface AIEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  language?: "en" | "sw";
}

/**
 * AIEmptyState - Standardized empty state for AI features
 * ✅ Brand-compliant: Uses #2E7D32 for accents
 * ✅ Calm, helpful messaging
 * ✅ No loud colors or decoration
 */
export function AIEmptyState({ 
  icon: Icon = Inbox,
  title, 
  description, 
  actionLabel,
  onAction,
  language = "en"
}: AIEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] px-6 py-12">
      {/* Icon */}
      <div className="p-6 bg-gray-100 rounded-full mb-4">
        <Icon className="h-12 w-12 text-gray-400" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 text-center max-w-md mb-6">
        {description}
      </p>

      {/* Action Button */}
      {onAction && actionLabel && (
        <Button 
          onClick={onAction}
          className="bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white font-medium"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
