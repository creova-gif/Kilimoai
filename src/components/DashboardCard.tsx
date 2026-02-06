import { Card, CardContent } from "./ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  description?: string;
  onClick?: () => void;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
  description,
  onClick,
  trend,
}: DashboardCardProps) {
  const CardWrapper = onClick ? motion.div : "div";
  const cardProps = onClick
    ? {
        whileHover: { scale: 1.03, y: -4 },
        whileTap: { scale: 0.98 },
        transition: { type: "spring", stiffness: 400, damping: 17 },
      }
    : {};

  return (
    <CardWrapper {...cardProps}>
      <Card
        className={`${onClick ? "cursor-pointer hover:shadow-xl" : ""} transition-all border-2 group`}
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2 font-medium">{title}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                {trend && (
                  <span
                    className={`text-sm font-medium ${
                      trend.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                  </span>
                )}
              </div>
              {description && (
                <p className="text-xs text-gray-500 mt-2">{description}</p>
              )}
            </div>
            <div
              className={`${iconBgColor} p-4 rounded-xl ${
                onClick ? "group-hover:scale-110" : ""
              } transition-transform`}
            >
              <Icon className={`h-7 w-7 ${iconColor}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}