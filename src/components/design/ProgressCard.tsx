import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { Progress } from "../ui/progress";

interface ProgressCardProps {
  title: string;
  subtitle?: string;
  progress: number;
  icon?: LucideIcon;
  target?: string;
  current?: string;
  color?: "green" | "blue" | "orange" | "purple";
  delay?: number;
}

export function ProgressCard({
  title,
  subtitle,
  progress,
  icon: Icon,
  target,
  current,
  color = "green",
  delay = 0
}: ProgressCardProps) {
  const colorSchemes = {
    green: {
      bg: "from-green-50 to-emerald-50",
      border: "border-green-200",
      icon: "bg-green-100 text-green-600",
      progress: "bg-green-600"
    },
    blue: {
      bg: "from-blue-50 to-cyan-50",
      border: "border-blue-200",
      icon: "bg-blue-100 text-blue-600",
      progress: "bg-blue-600"
    },
    orange: {
      bg: "from-orange-50 to-amber-50",
      border: "border-orange-200",
      icon: "bg-orange-100 text-orange-600",
      progress: "bg-orange-600"
    },
    purple: {
      bg: "from-purple-50 to-pink-50",
      border: "border-purple-200",
      icon: "bg-purple-100 text-purple-600",
      progress: "bg-purple-600"
    }
  };

  const scheme = colorSchemes[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`bg-gradient-to-br ${scheme.bg} border-2 ${scheme.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {Icon && (
            <div className={`p-2.5 ${scheme.icon} rounded-xl`}>
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
            {subtitle && (
              <p className="text-xs text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>
        <span className="text-2xl font-black text-gray-900">{progress}%</span>
      </div>

      <div className="mb-3">
        <Progress value={progress} className="h-2" />
      </div>

      {(current || target) && (
        <div className="flex items-center justify-between text-xs text-gray-600">
          {current && <span className="font-semibold">Current: {current}</span>}
          {target && <span className="font-medium">Target: {target}</span>}
        </div>
      )}
    </motion.div>
  );
}
