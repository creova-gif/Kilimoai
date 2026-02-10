import { useState } from "react";
import { Shield, Database, Eye, Download, Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ConsentItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  granted: boolean;
  category: "essential" | "analytics" | "marketing" | "sharing";
}

export function DataPrivacyConsent() {
  const [consents, setConsents] = useState<ConsentItem[]>([
    {
      id: "C001",
      title: "Basic Profile & Farm Data",
      description: "Store your name, phone number, location, and crop information to provide personalized farming advice.",
      required: true,
      granted: true,
      category: "essential",
    },
    {
      id: "C002",
      title: "Location Services",
      description: "Use your GPS location to provide accurate weather forecasts and connect you with nearby input dealers.",
      required: false,
      granted: true,
      category: "essential",
    },
    {
      id: "C003",
      title: "Usage Analytics",
      description: "Analyze how you use KILIMO to improve our AI recommendations and user experience.",
      required: false,
      granted: true,
      category: "analytics",
    },
    {
      id: "C004",
      title: "Share Data with Buyers",
      description: "Allow verified buyers to see your crop availability and quality information when you list produce for sale.",
      required: false,
      granted: true,
      category: "sharing",
    },
    {
      id: "C005",
      title: "Anonymized Research Data",
      description: "Include your anonymized farming data in research to help improve agriculture in Tanzania (you'll receive revenue share).",
      required: false,
      granted: false,
      category: "sharing",
    },
    {
      id: "C006",
      title: "SMS & WhatsApp Marketing",
      description: "Receive promotional messages about new features, partnerships, and special offers from KILIMO and partners.",
      required: false,
      granted: false,
      category: "marketing",
    },
  ]);

  const toggleConsent = (id: string) => {
    setConsents(consents.map(c => 
      c.id === id && !c.required ? { ...c, granted: !c.granted } : c
    ));
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "essential":
        return <Badge className="bg-green-100 text-green-700 border-green-300">Essential</Badge>;
      case "analytics":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-300">Analytics</Badge>;
      case "marketing":
        return <Badge className="bg-orange-100 text-orange-700 border-orange-300">Marketing</Badge>;
      case "sharing":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Data Sharing</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-[#2E7D32] text-white border-0">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Data Privacy & Consent
          </CardTitle>
          <CardDescription className="text-green-100">
            Your data, your control. Manage how KILIMO uses your information.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Privacy Principles */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-gray-900">Our Privacy Commitment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Your Data is Secure</h4>
                <p className="text-gray-700">
                  All personal information is encrypted and protected according to Tanzania Data Protection Act 2022.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Transparent Use</h4>
                <p className="text-gray-700">
                  We clearly explain how we use your data and will never share it without your permission.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Revenue Sharing</h4>
                <p className="text-gray-700">
                  If we monetize anonymized data, you receive a fair share of the revenue.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consent Management */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Consents</CardTitle>
          <CardDescription>
            Choose what data you're comfortable sharing. You can change these anytime.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {consents.map((consent) => (
            <div 
              key={consent.id}
              className={`border rounded-lg p-4 ${
                consent.granted ? 'bg-green-50 border-green-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{consent.title}</h4>
                    {getCategoryBadge(consent.category)}
                    {consent.required && (
                      <Badge variant="outline" className="bg-gray-100 text-gray-700">
                        Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{consent.description}</p>
                </div>

                <button
                  onClick={() => toggleConsent(consent.id)}
                  disabled={consent.required}
                  className={`flex items-center justify-center h-12 w-12 rounded-full transition-all flex-shrink-0 ${
                    consent.granted
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-300 hover:bg-gray-400'
                  } ${consent.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {consent.granted ? (
                    <Check className="h-6 w-6 text-white" />
                  ) : (
                    <X className="h-6 w-6 text-white" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Access & Portability */}
      <Card>
        <CardHeader>
          <CardTitle>Your Data Rights</CardTitle>
          <CardDescription>
            Access, download, or delete your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download My Data
            </span>
            <span className="text-sm text-gray-500">Export all your information</span>
          </Button>

          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Data Usage Log
            </span>
            <span className="text-sm text-gray-500">See how your data is being used</span>
          </Button>

          <Button variant="outline" className="w-full justify-between border-red-300 text-red-600 hover:bg-red-50">
            <span className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Delete My Account
            </span>
            <span className="text-sm text-red-400">Permanently remove all data</span>
          </Button>
        </CardContent>
      </Card>

      {/* Data Sharing Revenue */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-gray-900">Data Sharing Revenue</CardTitle>
          <CardDescription className="text-gray-700">
            Earn from anonymized data products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Your Total Earnings</p>
                <p className="text-sm text-gray-700">From data sharing (last 6 months)</p>
              </div>
              <p className="text-2xl font-bold text-green-600">12,500 TZS</p>
            </div>
            
            <div className="border-t border-green-200 pt-3 text-sm text-gray-700">
              <p className="mb-2">
                <strong>How it works:</strong> When you consent to "Anonymized Research Data", 
                we may include your farming data (without personal identifiers) in aggregated 
                datasets sold to researchers, NGOs, and agribusinesses.
              </p>
              <p>
                You receive <strong>20% of revenue</strong> from data products you contribute to, 
                paid quarterly via GoPay.
              </p>
            </div>

            <Button className="w-full bg-green-600 hover:bg-green-700">
              View Revenue Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Info */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-sm">Legal & Compliance</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-gray-600 space-y-2">
          <p>
            <strong>Tanzania Data Protection Act 2022:</strong> KILIMO is registered as a data controller 
            and complies with all national data protection regulations.
          </p>
          <p>
            <strong>Data Storage:</strong> Your data is stored on secure servers in Tanzania and the EU, 
            with appropriate safeguards for cross-border transfer.
          </p>
          <p>
            <strong>Contact:</strong> For privacy concerns or data requests, email privacy@kilimo.co.tz 
            or SMS PRIVACY to 15050.
          </p>
          <div className="flex gap-2 mt-4">
            <Button variant="link" className="text-xs h-auto p-0 text-green-600">
              Read Full Privacy Policy
            </Button>
            <span className="text-gray-400">•</span>
            <Button variant="link" className="text-xs h-auto p-0 text-green-600">
              Read Terms of Service
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}