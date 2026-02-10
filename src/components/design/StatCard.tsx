import { ReactNode } from "react";
import { motion } from "motion/react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  color?: string;
  delay?: number;
}

export function StatCard({ label, value, icon, trend, color = "green", delay = 0 }: StatCardProps) {
  const colorClasses = {
    green: "from-green-50 to-emerald-50 border-green-200 text-green-700",
    blue: "from-gray-50 to-gray-100 border-gray-200 text-gray-700",
    orange: "from-orange-50 to-amber-50 border-orange-200 text-orange-700",
    purple: "from-gray-50 to-gray-100 border-gray-200 text-gray-700",
    red: "from-red-50 to-rose-50 border-red-200 text-red-700"
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative bg-gradient-to-br ${colorClasses} border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className={`flex items-center text-sm font-medium ${
          trend.direction === "up" ? "text-green-600" : "text-red-600"
        }`}>
          <span>{trend.direction === "up" ? "↑" : "↓"}</span>
          <span className="ml-1">{Math.abs(trend.value)}%</span>
          <span className="ml-1 opacity-60">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}