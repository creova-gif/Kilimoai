import { Brain, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";

interface AIInsight {
  id: string;
  message_en: string;
  message_sw: string;
  priority: "high" | "medium" | "low";
  category: "planting" | "irrigation" | "pest" | "harvest" | "general";
}

interface Props {
  insights: AIInsight[];
  language: "en" | "sw";
}

export function AIFarmingInsights({ insights, language }: Props) {
  if (insights.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-2 border-gray-200 bg-gray-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Brain className="h-5 w-5 text-gray-700" />
              </div>
              {language === "sw" ? "Ushauri wa AI" : "AI Farming Insights"}
            </CardTitle>
            <Badge className="bg-gray-100 text-gray-700 border-gray-300">
              {language === "sw" ? "Akili Bandia" : "AI-Powered"}
            </Badge>
          </div>
          <CardDescription>
            {language === "sw" 
              ? "Mapendekezo ya kilimo kulingana na hali ya hewa ya sasa"
              : "Actionable farming recommendations based on real-time weather"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border-2 ${
                insight.priority === "high" 
                  ? "bg-red-50 border-red-200" 
                  : insight.priority === "medium"
                  ? "bg-orange-50 border-orange-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  insight.priority === "high"
                    ? "bg-red-100"
                    : insight.priority === "medium"
                    ? "bg-orange-100"
                    : "bg-green-100"
                }`}>
                  <CheckCircle className={`h-4 w-4 ${
                    insight.priority === "high"
                      ? "text-red-600"
                      : insight.priority === "medium"
                      ? "text-orange-600"
                      : "text-green-600"
                  }`} />
                </div>
                <p className="text-sm text-gray-700 flex-1">
                  {language === "sw" ? insight.message_sw : insight.message_en}
                </p>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}