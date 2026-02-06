import { AlertTriangle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface AICreditsWarningProps {
  language?: "en" | "sw";
}

export function AICreditsWarning({ language = "en" }: AICreditsWarningProps) {
  return (
    <Card className="border-yellow-300 bg-yellow-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <CardTitle className="text-lg text-yellow-900">
            {language === "en" ? "AI Service Notice" : "Taarifa ya Huduma ya AI"}
          </CardTitle>
        </div>
        <CardDescription className="text-yellow-800">
          {language === "en" 
            ? "AI recommendations are currently using sample data" 
            : "Mapendekezo ya AI kwa sasa yanatumia data ya sampuli"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-yellow-800 mb-4">
          {language === "en" 
            ? "The AI service has reached its credit limit. Sample recommendations are displayed for demonstration purposes. Real-time AI insights will resume once credits are replenished." 
            : "Huduma ya AI imefika kikomo chake cha mkopo. Mapendekezo ya sampuli yanaonyeshwa kwa madhumuni ya onyesho. Maarifa ya AI ya wakati halisi yatarudi mara baada ya mkopo kujazwa."}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="text-yellow-700 border-yellow-400 hover:bg-yellow-100"
            onClick={() => window.open("https://openrouter.ai/settings/credits", "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {language === "en" ? "Upgrade Credits" : "Ongeza Mkopo"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-yellow-700 border-yellow-400 hover:bg-yellow-100"
            onClick={() => window.location.reload()}
          >
            {language === "en" ? "Refresh" : "Onyesha Upya"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
