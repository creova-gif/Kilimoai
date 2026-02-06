import { ReactNode } from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { Badge } from "./ui/badge";

interface TabWrapperProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  gradient: string;
  badge?: {
    text: string;
    icon?: LucideIcon;
    color?: string;
  };
  stats?: {
    label: string;
    value: string | number;
  }[];
}

export function TabWrapper({
  children,
  title,
  subtitle,
  icon: Icon,
  gradient,
  badge,
  stats
}: TabWrapperProps) {
  return (
    <div className="space-y-6">
      {/* Premium Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} text-white p-6 md:p-8`}
      >
        <div className="absolute top-0 right-0 opacity-10">
          <Icon className="h-64 w-64 -mt-16 -mr-16" />
        </div>
        
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon className="h-8 w-8" />
                </motion.div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
                  <p className="text-white/90 mt-1">{subtitle}</p>
                </div>
              </div>
              
              {stats && stats.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (index + 1) }}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-3"
                    >
                      <p className="text-sm text-white/80">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {badge && (
              <Badge className={badge.color || "bg-yellow-500 text-yellow-950 border-0"}>
                {badge.icon && <badge.icon className="h-3 w-3 mr-1" />}
                {badge.text}
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
}