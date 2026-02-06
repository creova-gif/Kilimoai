import { ReactNode } from "react";
import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";

interface FeatureListProps {
  title: string;
  features: Array<{
    text: string;
    icon?: ReactNode;
  }>;
  delay?: number;
}

export function FeatureList({ title, features, delay = 0 }: FeatureListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + (index * 0.1), duration: 0.3 }}
            className="flex items-start gap-3"
          >
            <div className="flex-shrink-0 mt-0.5">
              {feature.icon || (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{feature.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
