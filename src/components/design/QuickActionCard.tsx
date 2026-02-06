import { ReactNode } from "react";
import { motion } from "motion/react";
import { LucideIcon, ArrowRight } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  badge?: string;
  color?: "green" | "blue" | "purple" | "orange" | "teal";
  delay?: number;
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  badge,
  color = "green",
  delay = 0
}: QuickActionCardProps) {
  const colorSchemes = {
    green: {
      bg: "bg-gradient-to-br from-green-50 to-emerald-50",
      border: "border-green-200",
      icon: "bg-green-100 text-green-600",
      hover: "hover:border-green-300 hover:shadow-green-100"
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
      border: "border-blue-200",
      icon: "bg-blue-100 text-blue-600",
      hover: "hover:border-blue-300 hover:shadow-blue-100"
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 to-pink-50",
      border: "border-purple-200",
      icon: "bg-purple-100 text-purple-600",
      hover: "hover:border-purple-300 hover:shadow-purple-100"
    },
    orange: {
      bg: "bg-gradient-to-br from-orange-50 to-amber-50",
      border: "border-orange-200",
      icon: "bg-orange-100 text-orange-600",
      hover: "hover:border-orange-300 hover:shadow-orange-100"
    },
    teal: {
      bg: "bg-gradient-to-br from-teal-50 to-cyan-50",
      border: "border-teal-200",
      icon: "bg-teal-100 text-teal-600",
      hover: "hover:border-teal-300 hover:shadow-teal-100"
    }
  };

  const scheme = colorSchemes[color];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full ${scheme.bg} ${scheme.border} ${scheme.hover} border-2 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all text-left group`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 ${scheme.icon} rounded-xl shadow-sm group-hover:scale-110 transition-transform`}>
          <Icon className="h-6 w-6" />
        </div>
        {badge && (
          <span className="px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700 shadow-sm">
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
        {title}
      </h3>
      
      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center text-sm font-semibold text-gray-700 group-hover:text-gray-900 group-hover:translate-x-1 transition-all">
        <span>Open</span>
        <ArrowRight className="h-4 w-4 ml-1" />
      </div>
    </motion.button>
  );
}
