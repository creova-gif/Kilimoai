import { motion } from "motion/react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: "up" | "down";
    label?: string;
  };
  color?: "green" | "blue" | "purple" | "orange" | "gray";
  delay?: number;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  color = "green",
  delay = 0
}: MetricCardProps) {
  const colorSchemes = {
    green: {
      gradient: "from-green-500 to-emerald-600",
      bg: "bg-green-50",
      text: "text-green-700"
    },
    blue: {
      gradient: "from-gray-500 to-slate-600",
      bg: "bg-gray-50",
      text: "text-gray-700"
    },
    purple: {
      gradient: "from-gray-500 to-slate-600",
      bg: "bg-gray-50",
      text: "text-gray-700"
    },
    orange: {
      gradient: "from-orange-500 to-amber-600",
      bg: "bg-orange-50",
      text: "text-orange-700"
    },
    gray: {
      gradient: "from-gray-500 to-slate-600",
      bg: "bg-gray-50",
      text: "text-gray-700"
    }
  };

  const scheme = colorSchemes[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, type: "spring" }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="relative overflow-hidden rounded-2xl p-5 shadow-md hover:shadow-xl transition-all bg-white border border-gray-200"
    >
      {/* Gradient background accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${scheme.gradient} opacity-10 rounded-full blur-2xl`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-3 ${scheme.bg} rounded-xl shadow-sm`}>
            <Icon className={`h-6 w-6 ${scheme.text}`} />
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              trend.direction === "up"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}>
              {trend.direction === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className="text-xs font-bold">
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-black text-gray-900">{value}</p>
          {trend?.label && (
            <p className="text-xs text-gray-500">{trend.label}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}