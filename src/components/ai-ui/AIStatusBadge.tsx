import { Badge } from "../ui/badge";
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";

interface AIStatusBadgeProps {
  status: "success" | "pending" | "warning" | "error";
  label: string;
  className?: string;
}

/**
 * AIStatusBadge - Standardized status indicator for AI features
 * ✅ Brand-compliant: Uses neutral colors and #2E7D32 for success
 * ✅ Clear visual hierarchy
 * ✅ Accessible and readable
 */
export function AIStatusBadge({ 
  status, 
  label,
  className = ""
}: AIStatusBadgeProps) {
  const config = {
    success: {
      icon: CheckCircle2,
      className: "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/20"
    },
    pending: {
      icon: Clock,
      className: "bg-gray-100 text-gray-700 border-gray-300"
    },
    warning: {
      icon: AlertCircle,
      className: "bg-gray-100 text-gray-700 border-gray-300"
    },
    error: {
      icon: XCircle,
      className: "bg-gray-100 text-gray-700 border-gray-300"
    }
  };

  const { icon: Icon, className: statusClass } = config[status];

  return (
    <Badge className={`px-3 py-1 font-medium border-2 ${statusClass} ${className}`}>
      <Icon className="h-3.5 w-3.5 mr-1.5" />
      {label}
    </Badge>
  );
}
