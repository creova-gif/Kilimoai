import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { 
  Wallet,
  Send,
  TrendingUp,
  CreditCard,
  Receipt,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Smartphone,
  DollarSign,
  Gift,
  Star,
  Trophy,
  Zap,
  Target,
  Award,
  Loader2,
  Upload
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { InvoiceDialog } from "./InvoiceDialog";
import { PayInputsDialog } from "./PayInputsDialog";
import { LoanRepaymentDialog } from "./LoanRepaymentDialog";
import { PaymentRequestDialog } from "./PaymentRequestDialog";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface MobileMoneyHubProps {
  userId: string;
  userName: string;
  userPhone: string;
}

export function MobileMoneyHub({ 
  userId,
  userName,
  userPhone 
}: MobileMoneyHubProps) {
  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;
  
  const [activeTab, setActiveTab] = useState("wallet");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  
  // ✅ Deposit state
  const [depositAmount, setDepositAmount] = useState("");
  const [depositProvider, setDepositProvider] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");
  const [transactionRef, setTransactionRef] = useState("");
  
  // Dialog states
  const [paymentRequestOpen, setPaymentRequestOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [payInputsOpen, setPayInputsOpen] = useState(false);
  const [loanRepaymentOpen, setLoanRepaymentOpen] = useState(false);

  // ✅ REAL wallet data from backend (not hardcoded!)
  const [walletData, setWalletData] = useState({
    balance: 0,
    pendingPayments: 0,
    escrowAmount: 0,
    totalEarned: 0,
    totalSpent: 0,
  });
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);

  // ✅ Fetch REAL wallet data from backend
  const fetchWalletData = async () => {
    try {
      setLoadingWallet(true);
      const response = await fetch(`${API_BASE}/wallet/${userId}`, {
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success && data.wallet) {
        setWalletData({
          balance: data.wallet.balance || 0,
          pendingPayments: data.wallet.pendingPayments || 0,
          escrowAmount: data.wallet.escrowAmount || 0,
          totalEarned: data.wallet.totalEarned || 0,
          totalSpent: data.wallet.totalSpent || 0,
        });
        
        // Set transactions from backend
        if (data.transactions) {
          setTransactions(data.transactions);
        }
      } else {
        console.log("Wallet not found or not verified. User may need to verify phone.");
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
      toast.error("Could not load wallet. Check your connection.");
    } finally {
      setLoadingWallet(false);
    }
  };

  // Fetch wallet data on component mount and when userId changes
  useEffect(() => {
    if (userId) {
      fetchWalletData();
    }
  }, [userId]);

  // Payment providers
  const providers = [
    { 
      id: "mpesa", 
      name: "M-Pesa", 
      logo: "🟢", 
      fee: "1.5%",
      available: true 
    },
    { 
      id: "tigopesa", 
      name: "TigoPesa", 
      logo: "🔵", 
      fee: "1.8%",
      available: true 
    },
    { 
      id: "airtel", 
      name: "Airtel Money", 
      logo: "🔴", 
      fee: "1.5%",
      available: true 
    },
    { 
      id: "gopay", 
      name: "GoPay", 
      logo: "💚", 
      fee: "0.5%",
      available: true,
      featured: true
    },
  ];

  const handleWithdraw = async () => {
    if (!amount || !phoneNumber || !selectedProvider) {
      toast.error("Please fill all fields");
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount > walletData.balance) {
      toast.error("Insufficient balance");
      return;
    }

    if (numAmount < 1000) {
      toast.error("Minimum withdrawal is TZS 1,000");
      return;
    }

    try {
      // ✅ FIX: Call /wallet/withdraw (not /mobile-money/withdraw)
      const response = await fetch(`${API_BASE}/wallet/withdraw`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          amount: numAmount,
          phoneNumber,
          provider: selectedProvider,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`✅ Withdrawal of TZS ${numAmount.toLocaleString()} initiated! Check your phone (${phoneNumber}) for M-Pesa confirmation.`);
        setAmount("");
        setPhoneNumber("");
        setSelectedProvider("");
        
        // Refresh wallet balance
        await fetchWalletData();
      } else {
        // Handle specific error messages
        if (data.error?.includes("verification") || data.error?.includes("verify")) {
          toast.error("⚠️ Phone verification required. Please verify your phone number first.");
        } else {
          toast.error(data.error || "Withdrawal failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Network error. Please check your internet connection and try again.");
    }
  };

  // ✅ ENHANCED: Deposit handler with STK Push support
  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) < 1000) {
      toast.error("Minimum deposit is TZS 1,000");
      return;
    }

    if (!depositProvider) {
      toast.error("Please select payment provider");
      return;
    }

    try {
      setDepositLoading(true);
      setPaymentStatus("pending");

      // ✅ NEW: Call unified payment endpoint with STK push support
      const response = await fetch(`${API_BASE}/payments/deposit/initiate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          amount: parseFloat(depositAmount),
          phoneNumber: userPhone, // User's verified phone
          paymentMethod: depositProvider,
          description: `Deposit to KILIMO Wallet - TZS ${depositAmount}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentStatus("success");
        setTransactionRef(data.transactionId || "");
        
        toast.success(
          data.message || `✅ Payment initiated! Check your phone to authorize.`,
          { 
            duration: 10000,
            description: data.transactionId ? `Transaction ID: ${data.transactionId}` : undefined,
          }
        );
        
        // If card payment, open checkout URL
        if (data.checkoutUrl) {
          window.open(data.checkoutUrl, '_blank');
          toast.info("Complete payment in the new window", { duration: 8000 });
        }
        
        // Poll for payment verification (for mobile money STK push)
        if (data.transactionId && !data.checkoutUrl) {
          pollPaymentStatus(data.transactionId);
        }
        
        // Reset form
        setDepositAmount("");
        setDepositProvider("");
      } else {
        setPaymentStatus("failed");
        
        // Handle specific errors
        if (data.error?.includes("verification") || data.error?.includes("verify")) {
          toast.error("⚠️ Phone verification required to deposit funds");
        } else {
          toast.error(data.error || "Deposit failed");
        }
      }
    } catch (error) {
      console.error("Deposit error:", error);
      setPaymentStatus("failed");
      toast.error("Network error. Please check your connection.");
    } finally {
      setDepositLoading(false);
    }
  };

  // Poll payment status (for STK push payments)
  const pollPaymentStatus = async (transactionId: string) => {
    let attempts = 0;
    const maxAttempts = 12; // 2 minutes (12 * 10 seconds)
    
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_BASE}/payments/verify`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transactionId }),
        });
        
        const data = await response.json();
        
        if (data.status === "completed") {
          toast.success("🎉 Payment successful! Wallet credited.", { duration: 6000 });
          await fetchWalletData(); // Refresh wallet balance
          setPaymentStatus("success");
          return true;
        } else if (data.status === "failed") {
          toast.error("Payment failed. Please try again.");
          setPaymentStatus("failed");
          return true;
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkStatus, 10000); // Check again in 10 seconds
        } else {
          toast.warning("Payment verification timed out. Check your transaction history.");
          setPaymentStatus("idle");
          return true;
        }
      } catch (error) {
        console.error("Payment status check error:", error);
      }
    };
    
    // Start checking after 5 seconds (give user time to authorize)
    setTimeout(checkStatus, 5000);
  };

  const handlePaymentRequest = () => {
    setPaymentRequestOpen(true);
  };

  const handleGenerateInvoice = () => {
    setInvoiceOpen(true);
  };

  const handlePayForInputs = () => {
    setPayInputsOpen(true);
  };

  const handleLoanRepayment = () => {
    setLoanRepaymentOpen(true);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-200">CREOVA Wallet Balance</p>
                <p className="text-3xl font-bold">TZS {walletData.balance.toLocaleString()}</p>
              </div>
            </div>
            <Button variant="secondary" className="gap-2">
              <Download className="h-4 w-4" />
              Statement
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-sm text-gray-200">Pending</p>
              <p className="text-lg font-bold">TZS {walletData.pendingPayments.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-200">In Escrow</p>
              <p className="text-lg font-bold">TZS {walletData.escrowAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-200">Total Earned</p>
              <p className="text-lg font-bold">TZS {walletData.totalEarned.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Payment Providers
              </CardTitle>
              <CardDescription>
                Link your mobile money accounts for instant payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((provider) => (
                  <div 
                    key={provider.id}
                    className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all ${
                      provider.featured ? 'border-green-500 bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{provider.logo}</div>
                        <div>
                          <p className="font-medium">{provider.name}</p>
                          <p className="text-sm text-gray-600">Fee: {provider.fee}</p>
                        </div>
                      </div>
                      {provider.featured && (
                        <Badge className="bg-green-600">Lowest Fee</Badge>
                      )}
                    </div>
                    <Button 
                      variant={provider.featured ? "default" : "outline"} 
                      className="w-full"
                      size="sm"
                    >
                      {provider.available ? "Connected" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-24 flex-col gap-2" onClick={handlePaymentRequest}>
                  <Send className="h-6 w-6" />
                  <span>Request Payment</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={handleGenerateInvoice}>
                  <Receipt className="h-6 w-6" />
                  <span>Generate Invoice</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={handlePayForInputs}>
                  <CreditCard className="h-6 w-6" />
                  <span>Pay for Inputs</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={handleLoanRepayment}>
                  <DollarSign className="h-6 w-6" />
                  <span>Loan Repayment</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deposit Tab */}
        <TabsContent value="deposit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDownLeft className="h-5 w-5" />
                Deposit to Wallet
              </CardTitle>
              <CardDescription>
                Add funds to your CREOVA Wallet from mobile money
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Select Provider</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {providers.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setDepositProvider(provider.name)}
                        className={`p-3 border rounded-lg hover:border-green-500 transition-all ${
                          depositProvider === provider.name ? 'border-green-500 bg-green-50' : ''
                        }`}
                      >
                        <div className="text-2xl mb-1">{provider.logo}</div>
                        <p className="text-xs font-medium">{provider.name}</p>
                        <p className="text-xs text-gray-500">{provider.fee}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="deposit-amount">Amount (TZS)</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>

                {depositAmount && depositProvider && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-900">
                      Transaction time: 1-5 minutes for instant deposit
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      <strong>Transaction Fee:</strong> TZS {(parseFloat(depositAmount) * 0.015).toFixed(0)}
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      <strong>You will receive:</strong> TZS {(parseFloat(depositAmount) - parseFloat(depositAmount) * 0.015).toFixed(0)}
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleDeposit}
                  className="w-full gap-2"
                  size="lg"
                >
                  <ArrowDownLeft className="h-4 w-4" />
                  Deposit Funds
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-2">💚 GoPay - Lowest Fees!</h3>
              <p className="text-sm text-green-100 mb-3">
                Save money on every transaction with GoPay. Only 0.5% fee compared to 1.5-1.8% on other platforms.
              </p>
              <Button variant="secondary">Learn More</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Withdraw Tab */}
        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5" />
                Withdraw to Mobile Money
              </CardTitle>
              <CardDescription>
                Transfer funds from your CREOVA Wallet to mobile money
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Select Provider</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {providers.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider.name)}
                        className={`p-3 border rounded-lg hover:border-green-500 transition-all ${
                          selectedProvider === provider.name ? 'border-green-500 bg-green-50' : ''
                        }`}
                      >
                        <div className="text-2xl mb-1">{provider.logo}</div>
                        <p className="text-xs font-medium">{provider.name}</p>
                        <p className="text-xs text-gray-500">{provider.fee}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="withdraw-amount">Amount (TZS)</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Available: TZS {walletData.balance.toLocaleString()}
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    id="phone-number"
                    type="tel"
                    placeholder="+255 XXX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1"
                  />
                </div>

                {amount && selectedProvider && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-900">
                      Processing time: 1-5 minutes
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      <strong>Transaction Fee:</strong> TZS {(parseFloat(amount) * 0.015).toFixed(0)}
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      <strong>You will receive:</strong> TZS {(parseFloat(amount) - parseFloat(amount) * 0.015).toFixed(0)}
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleWithdraw}
                  className="w-full gap-2"
                  size="lg"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Withdraw Funds
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-2">💚 GoPay - Lowest Fees!</h3>
              <p className="text-sm text-green-100 mb-3">
                Save money on every transaction with GoPay. Only 0.5% fee compared to 1.5-1.8% on other platforms.
              </p>
              <Button variant="secondary">Learn More</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Transaction History
              </CardTitle>
              <CardDescription>All your payment activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((txn) => (
                  <div 
                    key={txn.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        txn.type === "incoming" 
                          ? "bg-green-100 text-green-600" 
                          : "bg-red-100 text-red-600"
                      }`}>
                        {txn.type === "incoming" ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{txn.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-gray-500">{txn.date}</p>
                          <Badge variant="outline" className="text-xs">
                            {txn.provider}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        txn.type === "incoming" ? "text-green-600" : "text-red-600"
                      }`}>
                        {txn.type === "incoming" ? "+" : "-"}TZS {txn.amount.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {txn.status === "completed" ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">Completed</span>
                          </>
                        ) : txn.status === "pending" ? (
                          <>
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-yellow-600">Pending</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-red-600">Failed</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4">
                Load More
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDownLeft className="h-5 w-5 text-green-600" />
                    <p className="font-medium text-green-900">Income</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    TZS {walletData.totalEarned.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-700 mt-1">This month</p>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="h-5 w-5 text-red-600" />
                    <p className="font-medium text-red-900">Expenses</p>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    TZS {walletData.totalSpent.toLocaleString()}
                  </p>
                  <p className="text-sm text-red-700 mt-1">This month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Benefits Banner */}
      <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-3">Why Use CREOVA Wallet?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Instant Payments</p>
                <p className="text-sm text-gray-100">Get paid immediately when you sell crops</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Secure Escrow</p>
                <p className="text-sm text-gray-100">Payments held safely until delivery confirmed</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Transparent Receipts</p>
                <p className="text-sm text-gray-100">Digital records of all transactions</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Bulk Payments</p>
                <p className="text-sm text-gray-100">Perfect for cooperatives and agribusinesses</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <PaymentRequestDialog 
        open={paymentRequestOpen} 
        onOpenChange={setPaymentRequestOpen} 
        userName={userName}
      />
      <InvoiceDialog 
        open={invoiceOpen} 
        onOpenChange={setInvoiceOpen} 
        userName={userName}
      />
      <PayInputsDialog 
        open={payInputsOpen} 
        onOpenChange={setPayInputsOpen} 
        walletBalance={walletData.balance}
      />
      <LoanRepaymentDialog 
        open={loanRepaymentOpen} 
        onOpenChange={setLoanRepaymentOpen} 
        walletBalance={walletData.balance}
      />
    </div>
  );
}