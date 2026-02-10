import { useState } from "react";
import { Store, MapPin, Star, ShoppingBag, Phone, CheckCircle, AlertTriangle, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface AgrovetDealer {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  verified: boolean;
  phone: string;
  inventory: {
    seeds: boolean;
    fertilizer: boolean;
    pesticides: boolean;
    tools: boolean;
  };
  products: Array<{
    name: string;
    price: string;
    inStock: boolean;
    verified: boolean;
  }>;
}

interface InputSupplyChainProps {
  userLocation?: string;
}

export function InputSupplyChain({ userLocation = "Morogoro" }: InputSupplyChainProps) {
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const dealers: AgrovetDealer[] = [
    {
      id: "D001",
      name: "Kilimo Bora Agro-Vet",
      location: "Morogoro Town Center",
      distance: "2.5 km",
      rating: 4.8,
      verified: true,
      phone: "+255 XXX XXX 001",
      inventory: { seeds: true, fertilizer: true, pesticides: true, tools: true },
      products: [
        { name: "Maize Seeds (Hybrid) - 10kg", price: "85,000 TZS", inStock: true, verified: true },
        { name: "DAP Fertilizer - 50kg", price: "120,000 TZS", inStock: true, verified: true },
        { name: "Pesticide (Cypermethrin)", price: "25,000 TZS", inStock: true, verified: false },
      ],
    },
    {
      id: "D002",
      name: "Mkulima Suppliers Ltd",
      location: "Mazimbu Area",
      distance: "5.8 km",
      rating: 4.5,
      verified: true,
      phone: "+255 XXX XXX 002",
      inventory: { seeds: true, fertilizer: true, pesticides: false, tools: true },
      products: [
        { name: "Tomato Seeds (Tanya F1)", price: "15,000 TZS", inStock: true, verified: true },
        { name: "Urea Fertilizer - 50kg", price: "95,000 TZS", inStock: false, verified: true },
      ],
    },
    {
      id: "D003",
      name: "Smart Agro Inputs",
      location: "Bigwa Market",
      distance: "7.2 km",
      rating: 4.2,
      verified: false,
      phone: "+255 XXX XXX 003",
      inventory: { seeds: true, fertilizer: true, pesticides: true, tools: false },
      products: [
        { name: "Rice Seeds - 25kg", price: "65,000 TZS", inStock: true, verified: false },
      ],
    },
  ];

  const selectedDealerData = dealers.find(d => d.id === selectedDealer);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Store className="h-6 w-6" />
            Agro-Vet Network
          </CardTitle>
          <CardDescription className="text-green-100">
            Find verified input dealers near you with quality-assured products
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for seeds, fertilizer, pesticides..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <Button className="bg-green-600 hover:bg-green-700">
          <Package className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Quality Assurance Banner */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Quality Verification System</h4>
              <p className="text-sm text-gray-700 mt-1">
                Products marked with <CheckCircle className="h-3 w-3 inline text-green-600" /> are verified authentic by TFRA and TOSCI.
                Report counterfeit products to protect your crops.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dealers List */}
      <div className="space-y-4">
        {dealers.map((dealer) => (
          <Card 
            key={dealer.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedDealer === dealer.id ? 'border-green-500 border-2' : 'border-gray-200'
            }`}
            onClick={() => setSelectedDealer(selectedDealer === dealer.id ? null : dealer.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{dealer.name}</h3>
                    {dealer.verified && (
                      <Badge className="bg-green-100 text-green-700 border-green-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {dealer.location}
                    </span>
                    <span className="text-green-600">{dealer.distance} away</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{dealer.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">(48 reviews)</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="ml-4">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>

              {/* Available Products */}
              <div className="flex flex-wrap gap-2 mb-3">
                {dealer.inventory.seeds && (
                  <Badge variant="outline" className="bg-green-50">Seeds</Badge>
                )}
                {dealer.inventory.fertilizer && (
                  <Badge variant="outline" className="bg-gray-50">Fertilizer</Badge>
                )}
                {dealer.inventory.pesticides && (
                  <Badge variant="outline" className="bg-orange-50">Pesticides</Badge>
                )}
                {dealer.inventory.tools && (
                  <Badge variant="outline" className="bg-gray-50">Tools</Badge>
                )}
              </div>

              {/* Expanded Product List */}
              {selectedDealer === dealer.id && (
                <div className="border-t pt-4 mt-4 space-y-3">
                  <h4 className="font-medium text-sm mb-3">Available Products:</h4>
                  {dealer.products.map((product, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{product.name}</p>
                          {product.verified && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          {!product.verified && (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                        <p className="text-sm text-green-600 font-medium mt-1">{product.price}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        disabled={!product.inStock}
                      >
                        <ShoppingBag className="h-4 w-4 mr-1" />
                        Order
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1">
                      Request Delivery
                    </Button>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      Visit Store
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Group Buying Option */}
      <Card className="border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-gray-900">Bulk Group Purchasing</CardTitle>
          <CardDescription className="text-gray-700">
            Join with other farmers to buy inputs at discounted prices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Maize Seeds Group Order</p>
                <p className="text-sm text-gray-600">12/20 farmers joined • 15% discount</p>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Join Group
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">DAP Fertilizer Bulk Buy</p>
                <p className="text-sm text-gray-600">8/15 farmers joined • 12% discount</p>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Join Group
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Counterfeit */}
      <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50">
        <AlertTriangle className="h-4 w-4 mr-2" />
        Report Counterfeit Product
      </Button>
    </div>
  );
}