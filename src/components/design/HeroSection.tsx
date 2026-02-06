import { ReactNode } from "react";
import { motion } from "motion/react";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  gradient?: string;
  children?: ReactNode;
  height?: string;
}

export function HeroSection({
  title,
  subtitle,
  gradient = "from-green-600 via-emerald-600 to-teal-700",
  children,
  height = "auto"
}: HeroSectionProps) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-3xl ${height !== "auto" ? height : "p-8 md:p-12"}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
              {subtitle}
            </p>
          )}
        </motion.div>
        {children}
      </div>
    </div>
  );
}
