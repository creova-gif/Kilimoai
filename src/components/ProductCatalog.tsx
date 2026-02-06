import { X, ShoppingCart, Phone, MapPin, CheckCircle, Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ProductCatalogProps {
  category: string;
  onClose: () => void;
}

export function ProductCatalog({ category, onClose }: ProductCatalogProps) {
  const products = [
    {
      id: "P001",
      name: "DAP Fertilizer (50kg)",
      brand: "Minjingu",
      price: "120,000 TZS",
      verified: true,
      inStock: true,
      rating: 4.8,
      dealer: "Kilimo Bora Agro-Vet",
      location: "Morogoro Town",
      distance: "2.5 km",
      phone: "+255 XXX XXX 001",
      description: "High-quality Diammonium Phosphate for basal fertilizer application. 18% Nitrogen, 46% Phosphate.",
      specifications: [
        "Net weight: 50kg",
        "Nitrogen (N): 18%",
        "Phosphate (P2O5): 46%",
        "Certified by TFRA",
        "Manufactured: 2024"
      ],
      usage: "Apply 200kg/hectare at planting time, 5cm to side and below seed"
    },
    {
      id: "P002",
      name: "Urea Fertilizer (50kg)",
      brand: "Tanga Fertilizer",
      price: "95,000 TZS",
      verified: true,
      inStock: true,
      rating: 4.7,
      dealer: "Mkulima Suppliers Ltd",
      location: "Mazimbu Area",
      distance: "5.8 km",
      phone: "+255 XXX XXX 002",
      description: "Premium urea for top-dressing. 46% Nitrogen content for maximum crop response.",
      specifications: [
        "Net weight: 50kg",
        "Nitrogen (N): 46%",
        "Certified by TFRA",
        "Granular form for easy application",
        "Manufactured: 2024"
      ],
      usage: "Apply 150kg/hectare at 3-4 weeks after planting for maize"
    },
    {
      id: "P003",
      name: "NPK 23:23:0 (50kg)",
      brand: "Yara Tanzania",
      price: "135,000 TZS",
      verified: true,
      inStock: false,
      rating: 4.9,
      dealer: "Smart Agro Inputs",
      location: "Bigwa Market",
      distance: "7.2 km",
      phone: "+255 XXX XXX 003",
      description: "Balanced NPK fertilizer for multiple crops. High nitrogen and phosphate.",
      specifications: [
        "Net weight: 50kg",
        "Nitrogen (N): 23%",
        "Phosphate (P2O5): 23%",
        "Potash (K2O): 0%",
        "Certified by TFRA"
      ],
      usage: "General purpose fertilizer for vegetables and cereals"
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex-1">
            <h3 className="font-bold text-2xl">Recommended {category}</h3>
            <p className="text-sm text-gray-600 mt-1">Verified products from authorized dealers near you</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-4"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="p-6 space-y-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid md:grid-cols-3 gap-6 p-6">
                {/* Product Image */}
                <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-sm">Product Image</p>
                  </div>
                </div>

                {/* Product Details */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-xl mb-1">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {product.verified && (
                          <Badge className="bg-green-100 text-green-700 border-green-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            TFRA Verified
                          </Badge>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-sm">{product.rating}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-4">{product.description}</p>

                    {/* Price & Stock */}
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{product.price}</p>
                      </div>
                      <div>
                        {product.inStock ? (
                          <Badge className="bg-green-100 text-green-700">In Stock</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-blue-900 mb-2">Specifications:</h5>
                      <ul className="space-y-1 text-sm text-blue-800">
                        {product.specifications.map((spec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Usage Guide */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-green-900 mb-2">Application Guide:</h5>
                      <p className="text-sm text-green-800">{product.usage}</p>
                    </div>

                    {/* Dealer Info */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{product.dealer}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {product.location}
                            </span>
                            <span className="text-green-600">{product.distance} away</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.inStock ? "Order Now" : "Notify When Available"}
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Dealer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Safety Information */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-4">
              <h4 className="font-medium text-orange-900 mb-3">⚠️ Safety & Storage Information</h4>
              <ul className="space-y-2 text-sm text-orange-800">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Always wear gloves and protective clothing when handling fertilizers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Store in a cool, dry place away from direct sunlight</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Keep out of reach of children and animals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Do not mix different fertilizer types without expert advice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span>Report counterfeit products immediately to protect the farming community</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
