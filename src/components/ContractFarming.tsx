import { useState } from "react";
import { FileText, CheckCircle, Clock, DollarSign, Calendar, AlertCircle, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Contract {
  id: string;
  buyer: string;
  crop: string;
  quantity: string;
  pricePerKg: string;
  totalValue: string;
  startDate: string;
  deliveryDate: string;
  status: "active" | "pending" | "completed" | "disputed";
  paymentSchedule: string;
  qualitySpecs: string[];
  progress: number;
  verified: boolean;
}

export function ContractFarming() {
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [showNewContract, setShowNewContract] = useState(false);

  const contracts: Contract[] = [
    {
      id: "C001",
      buyer: "Tanzania Food Company Ltd",
      crop: "Maize",
      quantity: "5,000 kg",
      pricePerKg: "800 TZS",
      totalValue: "4,000,000 TZS",
      startDate: "2024-10-01",
      deliveryDate: "2025-02-15",
      status: "active",
      paymentSchedule: "50% upfront, 50% on delivery",
      qualitySpecs: ["Moisture content ≤ 13.5%", "Grade A quality", "No aflatoxin"],
      progress: 65,
      verified: true,
    },
    {
      id: "C002",
      buyer: "Export Grains Tanzania",
      crop: "Rice",
      quantity: "3,000 kg",
      pricePerKg: "1,200 TZS",
      totalValue: "3,600,000 TZS",
      startDate: "2024-11-01",
      deliveryDate: "2025-03-30",
      status: "active",
      paymentSchedule: "30% upfront, 70% on delivery",
      qualitySpecs: ["Polished white rice", "Broken grains < 5%", "Export grade"],
      progress: 45,
      verified: true,
    },
    {
      id: "C003",
      buyer: "Morogoro Agricultural Coop",
      crop: "Tomatoes",
      quantity: "2,000 kg",
      pricePerKg: "1,500 TZS",
      totalValue: "3,000,000 TZS",
      startDate: "2024-12-01",
      deliveryDate: "2025-01-20",
      status: "pending",
      paymentSchedule: "100% on delivery",
      qualitySpecs: ["Firm texture", "Red color grade", "No bruising"],
      progress: 0,
      verified: false,
    },
  ];

  const availableContracts = [
    {
      buyer: "Kilimo Foods Ltd",
      crop: "Sunflower",
      quantity: "4,000 kg",
      pricePerKg: "900 TZS",
      deliveryWindow: "3 months",
    },
    {
      buyer: "Grain Buyers Association",
      crop: "Maize",
      quantity: "10,000 kg",
      pricePerKg: "850 TZS",
      deliveryWindow: "4 months",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 border-green-300">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Pending Approval</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-300">Completed</Badge>;
      case "disputed":
        return <Badge className="bg-red-100 text-red-700 border-red-300">Disputed</Badge>;
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
            <FileText className="h-6 w-6" />
            Contract Farming
          </CardTitle>
          <CardDescription className="text-green-100">
            Secure guaranteed markets and prices through digital contracts
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Benefits Banner */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-gray-700 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Price Certainty</h4>
                <p className="text-sm text-gray-700">Lock in prices before planting</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-gray-700 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Guaranteed Market</h4>
                <p className="text-sm text-gray-700">Buyers committed to purchase</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-700 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Legal Protection</h4>
                <p className="text-sm text-gray-700">Enforceable digital agreements</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Contracts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Active Contracts</CardTitle>
              <CardDescription>Track your contract farming agreements</CardDescription>
            </div>
            <Button 
              onClick={() => setShowNewContract(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Browse Contracts
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {contracts.map((contract) => (
            <Card 
              key={contract.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedContract === contract.id ? 'border-green-500 border-2' : ''
              }`}
              onClick={() => setSelectedContract(selectedContract === contract.id ? null : contract.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">Contract #{contract.id}</h3>
                      {getStatusBadge(contract.status)}
                      {contract.verified && (
                        <Badge className="bg-green-100 text-green-700 border-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified Buyer
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{contract.buyer}</p>
                    {contract.verified && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Legally binding contract registered with KILIMO
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Crop</p>
                    <p className="font-medium">{contract.crop}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-medium">{contract.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price/kg</p>
                    <p className="font-medium text-green-600">{contract.pricePerKg}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Value</p>
                    <p className="font-medium text-green-600">{contract.totalValue}</p>
                  </div>
                </div>

                {contract.status === "active" && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Contract Progress</span>
                      <span className="font-medium">{contract.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${contract.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {selectedContract === contract.id && (
                  <div className="border-t pt-4 mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          Timeline
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Start Date:</span>
                            <span className="font-medium">{contract.startDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Date:</span>
                            <span className="font-medium">{contract.deliveryDate}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          Payment Schedule
                        </h4>
                        <p className="text-sm text-gray-700">{contract.paymentSchedule}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-gray-500" />
                        Quality Specifications
                      </h4>
                      <ul className="space-y-1">
                        {contract.qualitySpecs.map((spec, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download Contract
                      </Button>
                      {contract.status === "active" && (
                        <Button className="flex-1 bg-green-600 hover:bg-green-700">
                          Update Progress
                        </Button>
                      )}
                      {contract.status === "pending" && (
                        <>
                          <Button className="flex-1 bg-green-600 hover:bg-green-700">
                            Accept Contract
                          </Button>
                          <Button variant="outline" className="flex-1 border-red-300 text-red-600">
                            Decline
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Available Contracts */}
      {showNewContract && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Available Contract Opportunities</CardTitle>
            <CardDescription>Browse and apply for new contract farming opportunities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableContracts.map((contract, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{contract.buyer}</h4>
                    <p className="text-sm text-gray-600">Looking for {contract.crop} farmers</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-300">New</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Quantity Needed</p>
                    <p className="font-medium">{contract.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price Offered</p>
                    <p className="font-medium text-green-600">{contract.pricePerKg}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery</p>
                    <p className="font-medium">{contract.deliveryWindow}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-[#2E7D32] hover:bg-green-700">
                    Apply for Contract
                  </Button>
                  <Button variant="outline">View Details</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Dispute Resolution */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-900 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Contract Support & Dispute Resolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-orange-800 mb-4">
            Having issues with a contract? Our mediation team can help resolve disputes fairly and quickly.
          </p>
          <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
            Report Contract Issue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}