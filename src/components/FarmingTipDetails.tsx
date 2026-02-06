import { CheckCircle, Calendar, Leaf, AlertCircle, BookOpen, Video } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { ArticleReader } from "./ArticleReader";
import { ProductCatalog } from "./ProductCatalog";

interface FarmingTipDetailsProps {
  tip: string;
  crop?: string;
  stage?: string;
}

export function FarmingTipDetails({ tip, crop = "Maize", stage = "Vegetative Growth" }: FarmingTipDetailsProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [showArticle, setShowArticle] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);

  const detailedTips = [
    {
      category: "Fertilizer Application",
      title: "Nitrogen Top-Dressing for Maize",
      timing: "3-4 weeks after planting",
      description: tip,
      steps: [
        "Wait until maize plants are knee-high (3-4 weeks after planting)",
        "Use Urea fertilizer at 50kg per acre",
        "Apply fertilizer 10cm away from plant base to avoid burning",
        "Cover fertilizer with soil immediately",
        "Apply when soil is moist or before expected rain"
      ],
      dosage: "50kg Urea per acre (or 2 tablespoons per plant)",
      expectedResults: "Darker green leaves within 7-10 days, improved growth rate",
      cost: "80,000 - 100,000 TZS per 50kg bag",
      verified: true,
      source: "Tanzania Agricultural Research Institute (TARI)",
    },
    {
      category: "Pest Management",
      title: "Early Detection is Key",
      timing: "Monitor weekly",
      description: "Regular crop inspection prevents major pest damage",
      steps: [
        "Walk through your field at least twice per week",
        "Check undersides of leaves for eggs and insects",
        "Look for discolored or damaged leaves",
        "Count number of pests per plant (if more than 5, take action)",
        "Use yellow sticky traps to monitor flying insects"
      ],
      dosage: "N/A - preventive monitoring",
      expectedResults: "Early detection saves up to 30% of potential crop loss",
      cost: "Free (labor only) or 15,000 TZS for sticky traps",
      verified: true,
      source: "Ministry of Agriculture Extension Services",
    },
    {
      category: "Water Management",
      title: "Irrigation Timing for Vegetables",
      timing: "Early morning (6-8 AM) or evening (5-7 PM)",
      description: "Proper watering timing reduces disease and water waste",
      steps: [
        "Water early morning for best absorption",
        "Avoid watering during midday heat (water evaporates)",
        "Apply water at plant base, not on leaves",
        "Water deeply but less frequently (encourages deep roots)",
        "Check soil moisture 5cm below surface before watering"
      ],
      dosage: "20-30 liters per square meter, 2-3 times per week",
      expectedResults: "Reduced fungal diseases, stronger root systems, 20% water savings",
      cost: "Variable (depends on water source)",
      verified: true,
      source: "Sokoine University of Agriculture",
    }
  ];

  const currentTip = detailedTips[0]; // In real app, select based on user's crop and stage

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold">{currentTip.title}</h2>
            {currentTip.verified && (
              <Badge className="bg-green-100 text-green-700 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <p className="text-gray-600">{currentTip.category}</p>
        </div>
      </div>

      {/* Context Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-blue-600">Crop</p>
                <p className="font-medium text-blue-900">{crop}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-blue-600">Best Timing</p>
                <p className="font-medium text-blue-900">{currentTip.timing}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{currentTip.description}</p>
        </CardContent>
      </Card>

      {/* Step-by-Step Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {currentTip.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 font-medium text-sm flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-gray-700 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Application Details */}
      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-gray-500 mb-1">Recommended Dosage</h4>
            <p className="text-gray-900">{currentTip.dosage}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-gray-500 mb-1">Expected Results</h4>
            <p className="text-gray-900">{currentTip.expectedResults}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-gray-500 mb-1">Estimated Cost</h4>
            <p className="text-gray-900">{currentTip.cost}</p>
          </div>
        </CardContent>
      </Card>

      {/* Source & Verification */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900 mb-1">Verified by Experts</h4>
              <p className="text-sm text-green-800">
                This advice has been verified by <strong>{currentTip.source}</strong> and is 
                recommended for Tanzanian farming conditions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Related Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={() => setShowVideo(true)}>
            <Video className="h-4 w-4 mr-2" />
            Watch: How to Apply Fertilizer Correctly (3 min video)
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => setShowArticle(true)}>
            <BookOpen className="h-4 w-4 mr-2" />
            Read: Complete Maize Growing Guide
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => setShowProducts(true)}>
            <Leaf className="h-4 w-4 mr-2" />
            View: Recommended Fertilizer Brands
          </Button>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-900 mb-2">Important Reminders</h4>
              <ul className="space-y-1 text-sm text-orange-800">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Always wear gloves when handling fertilizer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Store fertilizer in a cool, dry place away from children</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Do not apply fertilizer on dry soil - water first or wait for rain</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Buy fertilizer from verified dealers to avoid counterfeits</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => setReminderSet(true)}>
          {reminderSet ? "Reminder Set" : "Set Reminder"}
        </Button>
        <Button variant="outline" className="flex-1">
          Ask AI for Help
        </Button>
      </div>

      {/* Modal for Video */}
      {showVideo && (
        <VideoPlayer
          title="How to Apply Fertilizer Correctly"
          description="Learn the proper technique for applying nitrogen fertilizer to maize crops without burning plants"
          duration="3:45"
          language="English & Swahili"
          onClose={() => setShowVideo(false)}
        />
      )}

      {/* Modal for Article */}
      {showArticle && (
        <ArticleReader
          title="Complete Maize Growing Guide"
          category="Crop Production"
          readTime="12 min"
          language="English & Swahili"
          onClose={() => setShowArticle(false)}
        />
      )}

      {/* Modal for Products */}
      {showProducts && (
        <ProductCatalog
          category="Fertilizer Brands"
          onClose={() => setShowProducts(false)}
        />
      )}
    </div>
  );
}