import { ReactNode } from "react";
import { motion } from "motion/react";
import { LucideIcon, ChevronRight } from "lucide-react";

interface InfoCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  delay?: number;
  variant?: "default" | "highlight";
}

export function InfoCard({
  title,
  subtitle,
  icon: Icon,
  children,
  action,
  delay = 0,
  variant = "default"
}: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border ${
        variant === "highlight"
          ? "bg-gradient-to-br from-[#2E7D32] to-gray-100 border-[#2E7D32]/20"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {Icon && (
            <div className={`p-3 rounded-xl ${
              variant === "highlight" 
                ? "bg-[#2E7D32]/10 text-[#2E7D32]" 
                : "bg-gray-100 text-gray-600"
            }`}>
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>
        
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm font-semibold text-[#2E7D32] hover:text-[#2E7D32] flex items-center gap-1 whitespace-nowrap transition-colors"
          >
            {action.label}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {children}
      </div>
    </motion.div>
  );
}
