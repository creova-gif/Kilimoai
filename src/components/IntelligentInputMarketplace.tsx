import { useState } from "react";
import {
  Sprout, Package, Droplets, Tractor, Scale, Zap, Shield,
  TrendingUp, Star, Award, CheckCircle2, AlertCircle, Info,
  ShoppingCart, Heart, MessageCircle, Eye, MapPin, Calendar,
  DollarSign, Clock, Tag, Percent, Box, Truck, FileText,
  Users, Building2, Leaf, Microscope, BarChart3, Target,
  Search, Filter, Grid3x3, List, ChevronDown, ChevronRight,
  X, Plus, Minus, Send, ArrowRight, Sparkles, Radio, Lock,
  CreditCard, Wallet, PiggyBank, Receipt, BadgeCheck, Verified
} from "lucide-react";

interface IntelligentInputMarketplaceProps {
  userId: string;
  region: string;
  language: "en" | "sw";
  crops?: string[];
  soilType?: string;
  onNavigate?: (tab: string) => void;
}

interface InputProduct {
  id: string;
  name: string;
  category: "seeds" | "fertilizer" | "pesticides" | "equipment" | "feed";
  image: string;
  supplier: {
    id: string;
    name: string;
    verified: boolean;
    rating: number;
    reviews: number;
  };
  price: number;
  unit: string;
  recommended: boolean;
  recommendationReason?: string;
  yieldImpact?: string;
  roi?: string;
  inStock: boolean;
  fastDelivery: boolean;
  paymentOptions: ("now" | "later" | "installments")[];
  specifications: {
    key: string;
    value: string;
  }[];
  reviews: number;
  rating: number;
}

export function IntelligentInputMarketplace({ 
  userId, 
  region, 
  language, 
  crops = ["Maize", "Beans"], 
  soilType = "Loamy",
  onNavigate 
}: IntelligentInputMarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<InputProduct | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const categories = [
    { id: "all", name: { en: "All Inputs", sw: "Pembejeo Zote" }, icon: <Box className="h-5 w-5" /> },
    { id: "seeds", name: { en: "Seeds", sw: "Mbegu" }, icon: <Sprout className="h-5 w-5" /> },
    { id: "fertilizer", name: { en: "Fertilizers", sw: "Mbolea" }, icon: <Droplets className="h-5 w-5" /> },
    { id: "pesticides", name: { en: "Pesticides", sw: "Dawa za Wadudu" }, icon: <Shield className="h-5 w-5" /> },
    { id: "equipment", name: { en: "Equipment", sw: "Vifaa" }, icon: <Tractor className="h-5 w-5" /> },
    { id: "feed", name: { en: "Animal Feed", sw: "Chakula cha Wanyama" }, icon: <Package className="h-5 w-5" /> }
  ];

  const products: InputProduct[] = [
    {
      id: "1",
      name: "Hybrid Maize Seeds H614",
      category: "seeds",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop",
      supplier: {
        id: "sup-1",
        name: "Kenya Seed Company",
        verified: true,
        rating: 4.8,
        reviews: 234
      },
      price: 15000,
      unit: language === "en" ? "2kg bag" : "gunia 2kg",
      recommended: true,
      recommendationReason: language === "en" 
        ? "Perfect for your loamy soil and Masika season" 
        : "Nzuri kwa udongo wako wa loam na msimu wa Masika",
      yieldImpact: "+35%",
      roi: "280%",
      inStock: true,
      fastDelivery: true,
      paymentOptions: ["now", "later", "installments"],
      specifications: [
        { key: language === "en" ? "Maturity" : "Ukomavu", value: "120 days" },
        { key: language === "en" ? "Yield Potential" : "Uwezo wa Mavuno", value: "6-8 tons/acre" },
        { key: language === "en" ? "Drought Tolerance" : "Uvumilivu wa Ukame", value: "High" }
      ],
      reviews: 89,
      rating: 4.7
    },
    {
      id: "2",
      name: "NPK Fertilizer 17:17:17",
      category: "fertilizer",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
      supplier: {
        id: "sup-2",
        name: "Yara Tanzania",
        verified: true,
        rating: 4.9,
        reviews: 567
      },
      price: 65000,
      unit: language === "en" ? "50kg bag" : "gunia 50kg",
      recommended: true,
      recommendationReason: language === "en"
        ? "Balanced nutrients for your maize & beans"
        : "Virutubisho vya usawa kwa mahindi na maharagwe yako",
      yieldImpact: "+25%",
      roi: "180%",
      inStock: true,
      fastDelivery: false,
      paymentOptions: ["now", "later"],
      specifications: [
        { key: "Nitrogen (N)", value: "17%" },
        { key: "Phosphorus (P)", value: "17%" },
        { key: "Potassium (K)", value: "17%" }
      ],
      reviews: 156,
      rating: 4.8
    },
    {
      id: "3",
      name: "Organic Pesticide - Neem Extract",
      category: "pesticides",
      image: "https://images.unsplash.com/photo-1592207923909-bc6c94a6b3e1?w=400&h=300&fit=crop",
      supplier: {
        id: "sup-3",
        name: "EcoFarm Solutions",
        verified: true,
        rating: 4.6,
        reviews: 123
      },
      price: 8500,
      unit: language === "en" ? "1 liter" : "lita 1",
      recommended: false,
      inStock: true,
      fastDelivery: true,
      paymentOptions: ["now"],
      specifications: [
        { key: language === "en" ? "Active Ingredient" : "Kiambata Hai", value: "Azadirachtin 0.15%" },
        { key: language === "en" ? "Coverage" : "Uwanja", value: "1 acre per liter" },
        { key: language === "en" ? "Organic" : "Kikaboni", value: language === "en" ? "Yes" : "Ndio" }
      ],
      reviews: 45,
      rating: 4.5
    }
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const recommendedProducts = products.filter(p => p.recommended);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/10 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white px-4 lg:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <Package className="h-7 w-7" />
            {language === "en" ? "Input Marketplace" : "Soko la Pembejeo"}
          </h1>
          <p className="text-white/90 text-sm">
            {language === "en" ? "Quality inputs = Better harvests" : "Pembejeo bora = Mavuno bora"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 -mt-4">
        {/* Smart Recommendations Banner */}
        {recommendedProducts.length > 0 && (
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">
                  {language === "en" ? "🎯 Recommended for Your Farm" : "🎯 Inapendekezwa kwa Shamba Lako"}
                </h3>
                <p className="text-white/90 text-sm mb-4">
                  {language === "en"
                    ? `Based on your ${crops.join(", ")} crops and ${soilType} soil type`
                    : `Kulingana na mazao yako ya ${crops.join(", ")} na aina ya udongo wa ${soilType}`}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recommendedProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-16 w-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm mb-1">{product.name}</div>
                          <div className="text-xs text-white/80 mb-2">{product.recommendationReason}</div>
                          <div className="flex items-center gap-3 text-xs">
                            {product.yieldImpact && (
                              <span className="px-2 py-1 bg-green-500 rounded">
                                📈 {product.yieldImpact} {language === "en" ? "yield" : "mavuno"}
                              </span>
                            )}
                            {product.roi && (
                              <span className="px-2 py-1 bg-amber-500 rounded">
                                💰 {product.roi} ROI
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 transition-all ${
                  selectedCategory === cat.id
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.icon}
                <span>{cat.name[language]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={language === "en" ? "Search inputs..." : "Tafuta pembejeo..."}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                <option>{language === "en" ? "All Suppliers" : "Wauzaji Wote"}</option>
                <option>{language === "en" ? "Verified Only" : "Waliothibitishwa Tu"}</option>
              </select>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                >
                  <Grid3x3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.recommended && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {language === "en" ? "RECOMMENDED" : "INAPENDEKEZWA"}
                  </div>
                )}
                {product.fastDelivery && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {language === "en" ? "FAST" : "HARAKA"}
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg">
                      {language === "en" ? "OUT OF STOCK" : "HAPANA STOCK"}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Supplier */}
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                  <div className="h-6 w-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {product.supplier.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-900 truncate">{product.supplier.name}</span>
                      {product.supplier.verified && (
                        <BadgeCheck className="h-4 w-4 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{product.supplier.rating}</span>
                  </div>
                </div>

                {/* Product Name */}
                <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>

                {/* Recommendation Reason */}
                {product.recommendationReason && (
                  <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-gray-800 flex items-start gap-2">
                    <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
                    <span>{product.recommendationReason}</span>
                  </div>
                )}

                {/* Impact Metrics */}
                {(product.yieldImpact || product.roi) && (
                  <div className="flex gap-2 mb-3">
                    {product.yieldImpact && (
                      <div className="flex-1 text-center p-2 bg-green-50 rounded">
                        <div className="text-xs text-gray-600">{language === "en" ? "Yield" : "Mavuno"}</div>
                        <div className="font-bold text-green-600">{product.yieldImpact}</div>
                      </div>
                    )}
                    {product.roi && (
                      <div className="flex-1 text-center p-2 bg-amber-50 rounded">
                        <div className="text-xs text-gray-600">ROI</div>
                        <div className="font-bold text-amber-600">{product.roi}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold text-green-600">
                    TZS {product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">/{product.unit}</span>
                </div>

                {/* Payment Options */}
                <div className="flex gap-2 mb-4">
                  {product.paymentOptions.includes("now") && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded flex items-center gap-1">
                      <Wallet className="h-3 w-3" />
                      {language === "en" ? "Pay Now" : "Lipa Sasa"}
                    </span>
                  )}
                  {product.paymentOptions.includes("later") && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {language === "en" ? "Pay Later" : "Lipa Baadaye"}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-4 w-4 inline mr-2" />
                    {language === "en" ? "Buy" : "Nunua"}
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          language={language}
          onClose={() => setSelectedProduct(null)}
          onBuyNow={() => {
            setShowPaymentModal(true);
          }}
        />
      )}

      {/* Payment Options Modal */}
      {showPaymentModal && selectedProduct && (
        <PaymentOptionsModal
          product={selectedProduct}
          language={language}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}

// Product Detail Modal
interface ProductDetailModalProps {
  product: InputProduct;
  language: "en" | "sw";
  onClose: () => void;
  onBuyNow: () => void;
}

function ProductDetailModal({ product, language, onClose, onBuyNow }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
          <div className="relative h-96">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h2>

            {/* Specifications */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                {language === "en" ? "Specifications" : "Vipimo"}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="text-gray-600">{spec.key}:</span>
                    <span className="ml-2 font-medium text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Quantity */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">{language === "en" ? "Price" : "Bei"}</div>
                <div className="text-3xl font-bold text-green-600">
                  TZS {product.price.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm text-gray-600 mb-2">
                  {language === "en" ? "Quantity" : "Kiasi"}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center font-semibold"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onBuyNow}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600"
              >
                {language === "en" ? "Choose Payment Method" : "Chagua Njia ya Malipo"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Payment Options Modal
interface PaymentOptionsModalProps {
  product: InputProduct;
  language: "en" | "sw";
  onClose: () => void;
}

function PaymentOptionsModal({ product, language, onClose }: PaymentOptionsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{language === "en" ? "Payment Options" : "Chaguzi za Malipo"}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            {product.paymentOptions.includes("now") && (
              <button className="w-full p-6 border-2 border-green-500 rounded-xl hover:bg-green-50 transition-all text-left">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center">
                    <Wallet className="h-7 w-7 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">
                      {language === "en" ? "Pay Now from Wallet" : "Lipa Sasa kutoka Mkoba"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === "en" ? "Get 5% discount • Instant delivery" : "Pata punguzo 5% • Utoaji wa mara moja"}
                    </p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </div>
              </button>
            )}

            {product.paymentOptions.includes("later") && (
              <button className="w-full p-6 border-2 border-gray-500 rounded-xl hover:bg-gray-50 transition-all text-left">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-7 w-7 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">
                      {language === "en" ? "Pay at Harvest" : "Lipa Wakati wa Mavuno"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === "en" ? "0% interest • Protected by contract" : "0% riba • Inalindwa na mkataba"}
                    </p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </div>
              </button>
            )}

            {product.paymentOptions.includes("installments") && (
              <button className="w-full p-6 border-2 border-gray-500 rounded-xl hover:bg-gray-50 transition-all text-left">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-7 w-7 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">
                      {language === "en" ? "Pay in 3 Installments" : "Lipa kwa Awamu 3"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === "en" ? "Small fees apply • Flexible schedule" : "Ada ndogo zinatumika • Ratiba inayobadilika"}
                    </p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}