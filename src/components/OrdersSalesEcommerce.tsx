import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  FileText,
  CreditCard,
  Star,
  Search,
  PlusCircle,
  BarChart3,
  Download,
  Send,
  Phone,
  Mail,
  Calendar,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    location: string;
    type: "retail" | "wholesale";
  };
  items: {
    product: string;
    quantity: number;
    unit: string;
    price: number;
  }[];
  totalAmount: number;
  status: "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "partial" | "paid";
  paymentMethod: "mobile_money" | "cash" | "bank_transfer" | "credit";
  orderDate: string;
  deliveryDate?: string;
  deliveryMethod: "pickup" | "delivery";
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location: string;
  type: "retail" | "wholesale";
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: "active" | "inactive";
}

export function OrdersSalesEcommerce() {
  const [activeTab, setActiveTab] = useState("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Mock data
  const orders: Order[] = [
    {
      id: "ORD001",
      orderNumber: "CREOVA-2024-0045",
      customer: {
        name: "Mama John's Store",
        phone: "+255 754 123 456",
        location: "Morogoro Town",
        type: "retail"
      },
      items: [
        { product: "Maize (White)", quantity: 50, unit: "bags (100kg)", price: 85000 },
        { product: "Beans (Red)", quantity: 20, unit: "bags (100kg)", price: 120000 }
      ],
      totalAmount: 6650000,
      status: "confirmed",
      paymentStatus: "paid",
      paymentMethod: "mobile_money",
      orderDate: "2024-02-12",
      deliveryDate: "2024-02-15",
      deliveryMethod: "delivery"
    },
    {
      id: "ORD002",
      orderNumber: "CREOVA-2024-0046",
      customer: {
        name: "Bakhresa Mills",
        phone: "+255 766 987 654",
        location: "Dar es Salaam",
        type: "wholesale"
      },
      items: [
        { product: "Maize (Yellow)", quantity: 500, unit: "bags (100kg)", price: 82000 }
      ],
      totalAmount: 41000000,
      status: "packed",
      paymentStatus: "paid",
      paymentMethod: "bank_transfer",
      orderDate: "2024-02-10",
      deliveryDate: "2024-02-14",
      deliveryMethod: "pickup"
    },
    {
      id: "ORD003",
      orderNumber: "CREOVA-2024-0047",
      customer: {
        name: "Green Valley Farms",
        phone: "+255 712 345 678",
        location: "Arusha",
        type: "wholesale"
      },
      items: [
        { product: "Sunflower Seeds", quantity: 2000, unit: "kg", price: 3500 }
      ],
      totalAmount: 7000000,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "mobile_money",
      orderDate: "2024-02-13",
      deliveryMethod: "delivery"
    }
  ];

  const customers: Customer[] = [
    {
      id: "CUST001",
      name: "Mama John's Store",
      phone: "+255 754 123 456",
      email: "mama.john@example.com",
      location: "Morogoro Town",
      type: "retail",
      totalOrders: 24,
      totalSpent: 185000000,
      lastOrder: "2024-02-12",
      status: "active"
    },
    {
      id: "CUST002",
      name: "Bakhresa Mills",
      phone: "+255 766 987 654",
      email: "procurement@bakhresa.co.tz",
      location: "Dar es Salaam",
      type: "wholesale",
      totalOrders: 8,
      totalSpent: 320000000,
      lastOrder: "2024-02-10",
      status: "active"
    }
  ];

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "pending").length,
    completedOrders: orders.filter(o => o.status === "delivered").length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    avgOrderValue: orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length,
    activeCustomers: customers.filter(c => c.status === "active").length
  };

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      packed: "bg-purple-100 text-purple-700",
      shipped: "bg-indigo-100 text-indigo-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700"
    };
    return colors[status];
  };

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    const colors = {
      pending: "bg-red-100 text-red-700",
      partial: "bg-orange-100 text-orange-700",
      paid: "bg-green-100 text-green-700"
    };
    return colors[status];
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl mb-2">Orders, Sales & E-commerce</h1>
          <p className="text-gray-600">Manage orders, customers, and online sales platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
                <p className="text-sm text-gray-600 mt-1">{stats.pendingOrders} pending</p>
              </div>
              <ShoppingCart className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold">TZS {(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600 mt-1">+18% this month</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
                <p className="text-2xl font-bold">TZS {(stats.avgOrderValue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-gray-600 mt-1">Per order</p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Customers</p>
                <p className="text-3xl font-bold">{stats.activeCustomers}</p>
                <p className="text-sm text-gray-600 mt-1">{customers.length} total</p>
              </div>
              <Users className="h-12 w-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="orders">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="customers">
            <Users className="h-4 w-4 mr-2" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="ecommerce">
            <Package className="h-4 w-4 mr-2" />
            E-commerce
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders or customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Orders List */}
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Track and fulfill customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium text-lg">{order.orderNumber}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                            {order.paymentStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {order.customer.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {order.customer.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {order.customer.location}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">TZS {(order.totalAmount / 1000000).toFixed(2)}M</p>
                        <Badge variant="outline" className="mt-1">
                          {order.customer.type}
                        </Badge>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="font-medium text-sm mb-2">Order Items:</p>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span>
                              {item.product} - {item.quantity} {item.unit}
                            </span>
                            <span className="font-medium">
                              TZS {((item.quantity * item.price) / 1000000).toFixed(2)}M
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                      <div>
                        <p className="text-gray-600">Order Date</p>
                        <p className="font-medium">{order.orderDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Delivery Method</p>
                        <p className="font-medium capitalize">{order.deliveryMethod}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Payment Method</p>
                        <p className="font-medium capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                      </div>
                      {order.deliveryDate && (
                        <div>
                          <p className="text-gray-600">Delivery Date</p>
                          <p className="font-medium">{order.deliveryDate}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {order.status === "pending" && (
                        <Button size="sm" className="bg-blue-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Confirm Order
                        </Button>
                      )}
                      {order.status === "confirmed" && (
                        <Button size="sm" className="bg-purple-600">
                          <Package className="h-3 w-3 mr-1" />
                          Mark as Packed
                        </Button>
                      )}
                      {order.status === "packed" && (
                        <Button size="sm" className="bg-indigo-600">
                          <Truck className="h-3 w-3 mr-1" />
                          Mark as Shipped
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        Generate Invoice
                      </Button>
                      <Button size="sm" variant="outline">
                        <Send className="h-3 w-3 mr-1" />
                        Notify Customer
                      </Button>
                      {order.paymentStatus === "pending" && (
                        <Button size="sm" variant="outline" className="text-orange-600 border-orange-300">
                          <CreditCard className="h-3 w-3 mr-1" />
                          Record Payment
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Relationship Management</CardTitle>
              <CardDescription>Track customer orders and build relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customers.map((customer) => (
                  <div key={customer.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-lg">{customer.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {customer.type}
                            </Badge>
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              {customer.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {customer.phone}
                            </span>
                            {customer.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {customer.email}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {customer.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-500 mb-1">
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4" />
                        </div>
                        <p className="text-xs text-gray-600">4.0/5.0 rating</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-gray-600">Total Orders</p>
                        <p className="font-bold text-lg">{customer.totalOrders}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-gray-600">Total Spent</p>
                        <p className="font-bold text-lg">TZS {(customer.totalSpent / 1000000).toFixed(0)}M</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-gray-600">Avg Order</p>
                        <p className="font-bold text-lg">TZS {((customer.totalSpent / customer.totalOrders) / 1000000).toFixed(1)}M</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-gray-600">Last Order</p>
                        <p className="font-bold text-lg">{customer.lastOrder}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        View Orders
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        Statement
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-4" variant="outline">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Customer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ecommerce" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Online E-commerce Platform</CardTitle>
              <CardDescription>Sell directly to consumers through your online store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Platform Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span className="font-medium">Online Store</span>
                      <Badge className="bg-green-600 text-white">Live</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                      <span>Website Visits (Today)</span>
                      <span className="font-bold">1,247</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                      <span>Cart Conversions</span>
                      <span className="font-bold">18%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                      <span>Active Products</span>
                      <span className="font-bold">12 items</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-blue-600">
                    <Package className="h-4 w-4 mr-2" />
                    Manage Products
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Payment Options</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-green-100 rounded flex items-center justify-center">
                          <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium">Mobile Money</span>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">Card Payments</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-purple-100 rounded flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-medium">Cash on Delivery</span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-orange-100 rounded flex items-center justify-center">
                          <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-medium">Credit Terms</span>
                      </div>
                      <Badge className="bg-orange-100 text-orange-700">Wholesale Only</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium mb-2">Platform Features</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>Automated order notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>Integrated mobile money</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>Pickup & delivery options</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>Customer reviews & ratings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>Wholesale & retail pricing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>Real-time inventory sync</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Delivery Zones</span>
                    <span>8 regions covered</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Delivery Partners</span>
                    <span>3 active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Avg Delivery Time</span>
                    <span>2-3 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>POS Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-medium mb-2">Point of Sale System</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect your farm store for in-person sales
                  </p>
                  <Button variant="outline">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Setup POS
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <DollarSign className="h-10 w-10 mx-auto mb-3 text-green-600" />
                <p className="text-3xl font-bold">TZS 54.7M</p>
                <p className="text-sm text-gray-600 mt-1">Revenue (This Month)</p>
                <p className="text-xs text-green-600 mt-1">↑ 18% vs last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <ShoppingCart className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                <p className="text-3xl font-bold">47</p>
                <p className="text-sm text-gray-600 mt-1">Orders (This Month)</p>
                <p className="text-xs text-blue-600 mt-1">↑ 12 orders vs last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="h-10 w-10 mx-auto mb-3 text-purple-600" />
                <p className="text-3xl font-bold">124</p>
                <p className="text-sm text-gray-600 mt-1">Total Customers</p>
                <p className="text-xs text-purple-600 mt-1">+8 new this month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>Monthly trends and top products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Maize (White)</span>
                    <span className="font-medium">TZS 28.5M • 45 orders</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Beans (Red)</span>
                    <span className="font-medium">TZS 15.2M • 28 orders</span>
                  </div>
                  <Progress value={53} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Sunflower Seeds</span>
                    <span className="font-medium">TZS 11.0M • 18 orders</span>
                  </div>
                  <Progress value={39} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Wholesale Buyers</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="h-2 w-24" />
                      <span className="text-sm font-medium">65%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Retail Customers</span>
                    <div className="flex items-center gap-2">
                      <Progress value={35} className="h-2 w-24" />
                      <span className="text-sm font-medium">35%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Mobile Money</span>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="h-2 w-24" />
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bank Transfer</span>
                    <div className="flex items-center gap-2">
                      <Progress value={20} className="h-2 w-24" />
                      <span className="text-sm font-medium">20%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cash</span>
                    <div className="flex items-center gap-2">
                      <Progress value={5} className="h-2 w-24" />
                      <span className="text-sm font-medium">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}