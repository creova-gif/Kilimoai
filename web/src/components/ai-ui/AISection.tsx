import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface AISectionProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * AISection - Standardized section card for AI features
 * ✅ Brand-compliant: Clean white background
 * ✅ No gradients or colors
 * ✅ Simple, professional styling
 */
export function AISection({ 
  icon: Icon, 
  title, 
  description, 
  children,
  className = ""
}: AISectionProps) {
  return (
    <Card className={`border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-3 bg-[#2E7D32]/10 rounded-xl">
              <Icon className="h-5 w-5 text-[#2E7D32]" />
            </div>
          )}
          <div>
            <CardTitle className="text-lg md:text-xl font-bold text-gray-900">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-sm text-gray-600 mt-1">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        {children}
      </CardContent>
    </Card>
  );
}
