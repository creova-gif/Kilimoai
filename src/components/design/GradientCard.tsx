import { ReactNode } from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface GradientCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: ReactNode;
  gradient?: string;
  onClick?: () => void;
  className?: string;
  delay?: number;
}

export function GradientCard({
  title,
  description,
  icon: Icon,
  children,
  gradient = "from-green-500 to-emerald-600",
  onClick,
  className = "",
  delay = 0
}: GradientCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: onClick ? 1.02 : 1, y: -4 }}
      onClick={onClick}
      className={`relative group bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {Icon && (
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-4">
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}
        
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        
        {description && (
          <p className="text-white/90 text-sm mb-4">{description}</p>
        )}
        
        {children}
      </div>
    </motion.div>
  );
}
