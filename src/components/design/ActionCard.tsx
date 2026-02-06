import { ReactNode } from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  onClick: () => void;
  badge?: string;
  delay?: number;
}

export function ActionCard({
  title,
  description,
  icon: Icon,
  color = "green",
  onClick,
  badge,
  delay = 0
}: ActionCardProps) {
  const colorMap = {
    green: {
      bg: "from-green-500 to-emerald-600",
      hover: "hover:from-green-600 hover:to-emerald-700"
    },
    blue: {
      bg: "from-blue-500 to-cyan-600",
      hover: "hover:from-blue-600 hover:to-cyan-700"
    },
    orange: {
      bg: "from-orange-500 to-amber-600",
      hover: "hover:from-orange-600 hover:to-amber-700"
    },
    purple: {
      bg: "from-purple-500 to-pink-600",
      hover: "hover:from-purple-600 hover:to-pink-700"
    },
    teal: {
      bg: "from-teal-500 to-cyan-600",
      hover: "hover:from-teal-600 hover:to-cyan-700"
    }
  };

  const colors = colorMap[color as keyof typeof colorMap] || colorMap.green;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.03, y: -6 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full bg-gradient-to-br ${colors.bg} ${colors.hover} text-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all text-left overflow-hidden group`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <Icon className="h-6 w-6" />
          </div>
          {badge && (
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-white/90 mb-4">{description}</p>

        <div className="flex items-center text-sm font-semibold group-hover:translate-x-2 transition-transform">
          <span>Get Started</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </div>
      </div>
    </motion.button>
  );
}
