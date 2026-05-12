import { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";

interface AIQuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
}

/**
 * AIQuickAction - Standardized quick action button for AI features
 * ✅ Brand-compliant: Uses #2E7D32
 * ✅ No color-coded categories
 * ✅ Simple, consistent design
 */
export function AIQuickAction({ 
  icon: Icon, 
  label, 
  onClick,
  className = ""
}: AIQuickActionProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={`flex items-center gap-2 text-gray-700 border-gray-300 hover:bg-[#2E7D32]/5 hover:border-[#2E7D32]/30 hover:text-[#2E7D32] transition-all ${className}`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}
