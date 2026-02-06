import { motion } from "motion/react";
import { LucideIcon, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  backButton?: {
    label: string;
    onClick: () => void;
  };
  action?: {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
  };
  gradient?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  backButton,
  action,
  gradient = false
}: PageHeaderProps) {
  const ActionIcon = action?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl md:rounded-3xl p-6 md:p-8 ${
        gradient
          ? "bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 text-white"
          : "bg-white border border-gray-200 text-gray-900"
      }`}
    >
      {backButton && (
        <button
          onClick={backButton.onClick}
          className={`flex items-center gap-2 mb-4 text-sm font-semibold ${
            gradient ? "text-white/90 hover:text-white" : "text-gray-600 hover:text-gray-900"
          } transition-colors`}
        >
          <ArrowLeft className="h-4 w-4" />
          {backButton.label}
        </button>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          {Icon && (
            <div className={`p-3 rounded-2xl ${
              gradient
                ? "bg-white/20 backdrop-blur-md"
                : "bg-green-50"
            }`}>
              <Icon className={`h-7 w-7 ${gradient ? "text-white" : "text-green-600"}`} />
            </div>
          )}
          
          <div className="flex-1">
            <h1 className={`text-2xl md:text-3xl font-black mb-2 ${
              gradient ? "text-white" : "text-gray-900"
            }`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`text-sm md:text-base ${
                gradient ? "text-white/90" : "text-gray-600"
              }`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {action && (
          <Button
            onClick={action.onClick}
            className={
              gradient
                ? "bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            }
          >
            {ActionIcon && <ActionIcon className="h-4 w-4 mr-2" />}
            {action.label}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
