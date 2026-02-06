import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { ShoppingCart, Package, Minus, Plus, Trash2, AlertCircle, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { purchaseInputs } from "../utils/api";

interface PayInputsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletBalance: number;
  userId: string;
  onPurchaseComplete?: () => void;
}

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  supplier: string;
  stock: number;
  icon: string;
  quantity: number;
}

export function PayInputsDialog({ open, onOpenChange, walletBalance, userId, onPurchaseComplete }: PayInputsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Agricultural inputs catalog
  const inputs = [
    {
      id: "fert-1",
      name: "Urea Fertilizer",
      category: "fertilizer",
      price: 75000,
      unit: "50kg bag",
      supplier: "Yara Tanzania",
      stock: 150,
      icon: "🌱"
    },
    {
      id: "fert-2",
      name: "DAP Fertilizer",
      category: "fertilizer",
      price: 85000,
      unit: "50kg bag",
      supplier: "Yara Tanzania",
      stock: 200,
      icon: "🌱"
    },
    {
      id: "seed-1",
      name: "Hybrid Maize Seeds",
      category: "seeds",
      price: 45000,
      unit: "10kg",
      supplier: "Seed Co Tanzania",
      stock: 80,
      icon: "🌾"
    },
    {
      id: "seed-2",
      name: "Rice Seeds (SARO 5)",
      category: "seeds",
      price: 35000,
      unit: "10kg",
      supplier: "Kilimo Trust",
      stock: 60,
      icon: "🌾"
    },
    {
      id: "pest-1",
      name: "Insecticide (Cypermethrin)",
      category: "pesticides",
      price: 25000,
      unit: "1L",
      supplier: "Bayer CropScience",
      stock: 100,
      icon: "🛡️"
    },
    {
      id: "pest-2",
      name: "Herbicide (Glyphosate)",
      category: "pesticides",
      price: 18000,
      unit: "1L",
      supplier: "Syngenta",
      stock: 120,
      icon: "🛡️"
    },
    {
      id: "tool-1",
      name: "Hand Sprayer 16L",
      category: "equipment",
      price: 55000,
      unit: "piece",
      supplier: "Agritools Ltd",
      stock: 30,
      icon: "🔧"
    },
  ];

  const categories = [
    { id: "all", name: "All Inputs", icon: "🛒" },
    { id: "fertilizer", name: "Fertilizers", icon: "🌱" },
    { id: "seeds", name: "Seeds", icon: "🌾" },
    { id: "pesticides", name: "Pesticides", icon: "🛡️" },
    { id: "equipment", name: "Equipment", icon: "🔧" },
  ];

  const filteredInputs = selectedCategory === "all" 
    ? inputs 
    : inputs.filter(input => input.category === selectedCategory);

  const addToCart = (input: typeof inputs[0]) => {
    const existingItem = cart.find(item => item.id === input.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === input.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...input, quantity: 1 }]);
    }
    toast.success(`${input.name} added to cart`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
    toast.info("Item removed from cart");
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = cartTotal > 0 ? 15000 : 0;
  const total = cartTotal + deliveryFee;

  const processPayment = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (total > walletBalance) {
      toast.error("Insufficient balance", {
        description: `You need TZS ${(total - walletBalance).toLocaleString()} more`
      });
      return;
    }

    setLoading(true);
    try {
      // Process payment
      await purchaseInputs(userId, cart);
      toast.success("Payment successful!", {
        description: `TZS ${total.toLocaleString()} paid. Order confirmed.`
      });

      // Clear cart and close
      setCart([]);
      onOpenChange(false);
      if (onPurchaseComplete) {
        onPurchaseComplete();
      }
    } catch (error) {
      toast.error("Payment failed", {
        description: "An error occurred while processing your payment."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Agricultural Inputs Marketplace
          </DialogTitle>
          <DialogDescription>
            Purchase quality seeds, fertilizers, and equipment
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Categories */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="gap-2 whitespace-nowrap"
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Products List */}
            <div className="space-y-3">
              <h3 className="font-medium">Available Products</h3>
              {filteredInputs.map((input) => (
                <div key={input.id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{input.icon}</span>
                        <div>
                          <p className="font-medium text-sm">{input.name}</p>
                          <p className="text-xs text-gray-600">{input.supplier}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {input.unit}
                        </Badge>
                        <span className="text-xs text-gray-500">Stock: {input.stock}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">TZS {input.price.toLocaleString()}</p>
                      <Button 
                        size="sm" 
                        onClick={() => addToCart(input)}
                        className="mt-2"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shopping Cart */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                Shopping Cart
                {cart.length > 0 && (
                  <Badge>{cart.length} items</Badge>
                )}
              </h3>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="p-3 border rounded-lg bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm">{item.name}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="font-bold text-sm">
                            TZS {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="p-4 bg-gray-50 border rounded-lg space-y-2">
                    <h4 className="font-medium text-sm">Order Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>TZS {cartTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery Fee:</span>
                        <span>TZS {deliveryFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t font-bold">
                        <span>Total:</span>
                        <span>TZS {total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 pt-1">
                        <span>Wallet Balance:</span>
                        <span className={total > walletBalance ? "text-red-600" : "text-green-600"}>
                          TZS {walletBalance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={processPayment} 
                    className="w-full gap-2"
                    disabled={total > walletBalance || loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Pay TZS {total.toLocaleString()}
                      </>
                    )}
                  </Button>

                  {total > walletBalance && (
                    <p className="text-xs text-red-600 text-center">
                      Insufficient balance. Top up your wallet first.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}