import { motion } from "motion/react";
import { LucideIcon, X } from "lucide-react";

interface NotificationBadgeProps {
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  icon?: LucideIcon;
  onDismiss?: () => void;
  delay?: number;
}

export function NotificationBadge({
  type,
  title,
  message,
  icon: Icon,
  onDismiss,
  delay = 0
}: NotificationBadgeProps) {
  const typeStyles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
      title: "text-green-900",
      message: "text-green-700"
    },
    warning: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      icon: "text-orange-600",
      title: "text-orange-900",
      message: "text-orange-700"
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600",
      title: "text-red-900",
      message: "text-red-700"
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      title: "text-blue-900",
      message: "text-blue-700"
    }
  };

  const styles = typeStyles[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ delay, duration: 0.4 }}
      className={`${styles.bg} ${styles.border} border-2 rounded-xl p-4 shadow-md`}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className={`${styles.icon} flex-shrink-0 mt-0.5`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-bold ${styles.title} mb-1`}>{title}</h4>
          <p className={`text-xs ${styles.message} leading-relaxed`}>{message}</p>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`${styles.icon} hover:opacity-70 transition-opacity flex-shrink-0`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
