import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  DollarSign, 
  Building2, 
  Calendar, 
  TrendingDown, 
  AlertCircle,
  CheckCircle2,
  CreditCard
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface LoanRepaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletBalance: number;
}

interface Loan {
  id: string;
  lender: string;
  lenderLogo: string;
  type: string;
  principal: number;
  outstanding: number;
  paid: number;
  interestRate: number;
  monthlyPayment: number;
  nextDueDate: string;
  status: "active" | "overdue" | "completed";
  disbursedDate: string;
}

export function LoanRepaymentDialog({ open, onOpenChange, walletBalance }: LoanRepaymentDialogProps) {
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  // Mock active loans
  const loans: Loan[] = [
    {
      id: "loan-1",
      lender: "CRDB Bank",
      lenderLogo: "🏦",
      type: "Agricultural Input Loan",
      principal: 2000000,
      outstanding: 1200000,
      paid: 800000,
      interestRate: 12,
      monthlyPayment: 200000,
      nextDueDate: "2024-12-20",
      status: "active",
      disbursedDate: "2024-06-01"
    },
    {
      id: "loan-2",
      lender: "SACCOS Kilimo",
      lenderLogo: "🤝",
      type: "Seasonal Farming Loan",
      principal: 1500000,
      outstanding: 450000,
      paid: 1050000,
      interestRate: 8,
      monthlyPayment: 150000,
      nextDueDate: "2024-12-25",
      status: "active",
      disbursedDate: "2024-04-15"
    },
    {
      id: "loan-3",
      lender: "AgriFinance MFI",
      lenderLogo: "💰",
      type: "Equipment Purchase Loan",
      principal: 800000,
      outstanding: 850000,
      paid: 0,
      interestRate: 15,
      monthlyPayment: 100000,
      nextDueDate: "2024-12-10",
      status: "overdue",
      disbursedDate: "2024-08-01"
    },
  ];

  const activeLoan = loans.find(loan => loan.id === selectedLoan);

  const processPayment = () => {
    if (!selectedLoan || !paymentAmount) {
      toast.error("Please select a loan and enter payment amount");
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount <= 0) {
      toast.error("Invalid payment amount");
      return;
    }

    if (amount > walletBalance) {
      toast.error("Insufficient wallet balance", {
        description: `You need TZS ${(amount - walletBalance).toLocaleString()} more`
      });
      return;
    }

    if (activeLoan && amount > activeLoan.outstanding) {
      toast.error("Payment exceeds outstanding balance", {
        description: `Outstanding: TZS ${activeLoan.outstanding.toLocaleString()}`
      });
      return;
    }

    // Process payment
    toast.success("Loan payment successful!", {
      description: `TZS ${amount.toLocaleString()} paid to ${activeLoan?.lender}`
    });

    setPaymentAmount("");
    setSelectedLoan(null);
  };

  const payFullAmount = () => {
    if (activeLoan) {
      setPaymentAmount(activeLoan.outstanding.toString());
    }
  };

  const payMinimum = () => {
    if (activeLoan) {
      setPaymentAmount(activeLoan.monthlyPayment.toString());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Loan Repayment Portal
          </DialogTitle>
          <DialogDescription>
            Manage and repay your agricultural loans
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Wallet Balance */}
          <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg">
            <p className="text-sm text-purple-200">Available Balance</p>
            <p className="text-2xl font-bold">TZS {walletBalance.toLocaleString()}</p>
          </div>

          {/* Active Loans */}
          <div className="space-y-3">
            <h3 className="font-medium">Your Active Loans</h3>
            {loans.map((loan) => {
              const progress = (loan.paid / loan.principal) * 100;
              const isSelected = selectedLoan === loan.id;

              return (
                <div
                  key={loan.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected ? "border-purple-500 bg-purple-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedLoan(loan.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{loan.lenderLogo}</div>
                      <div>
                        <p className="font-medium">{loan.lender}</p>
                        <p className="text-sm text-gray-600">{loan.type}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={loan.status === "overdue" ? "destructive" : "default"}
                      className={loan.status === "active" ? "bg-green-600" : ""}
                    >
                      {loan.status === "overdue" ? "Overdue" : "Active"}
                    </Badge>
                  </div>

                  {/* Loan Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Repayment Progress</span>
                      <span className="font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Paid: TZS {loan.paid.toLocaleString()}
                      </span>
                      <span className="font-medium text-red-600">
                        Outstanding: TZS {loan.outstanding.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Loan Details */}
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Next Payment</p>
                        <p className="font-medium">{loan.nextDueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Monthly Amount</p>
                        <p className="font-medium">TZS {loan.monthlyPayment.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {loan.status === "overdue" && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-sm text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      <span>Payment overdue! Please pay immediately to avoid penalties.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Payment Section */}
          {selectedLoan && activeLoan && (
            <div className="p-4 bg-gray-50 border rounded-lg space-y-4">
              <h3 className="font-medium">Make a Payment</h3>

              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Payment Amount (TZS)</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={payMinimum}
                  >
                    Minimum ({activeLoan.monthlyPayment.toLocaleString()})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={payFullAmount}
                  >
                    Full Amount ({activeLoan.outstanding.toLocaleString()})
                  </Button>
                </div>
              </div>

              {paymentAmount && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Payment Amount:</span>
                    <span className="font-medium">TZS {parseFloat(paymentAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining Balance:</span>
                    <span className="font-medium">
                      TZS {(activeLoan.outstanding - parseFloat(paymentAmount)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Your Balance After:</span>
                    <span className={
                      walletBalance - parseFloat(paymentAmount) < 0 
                        ? "text-red-600 font-medium" 
                        : "text-green-600 font-medium"
                    }>
                      TZS {(walletBalance - parseFloat(paymentAmount)).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <Button 
                onClick={processPayment} 
                className="w-full gap-2"
                disabled={!paymentAmount || parseFloat(paymentAmount) > walletBalance}
              >
                <CreditCard className="h-4 w-4" />
                Pay TZS {paymentAmount ? parseFloat(paymentAmount).toLocaleString() : "0"}
              </Button>

              {paymentAmount && parseFloat(paymentAmount) > walletBalance && (
                <p className="text-xs text-red-600 text-center">
                  Insufficient balance. Top up your wallet first.
                </p>
              )}
            </div>
          )}

          {/* Loan Summary */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border rounded-lg">
            <h4 className="font-medium mb-3">Loan Portfolio Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Total Borrowed</p>
                <p className="text-lg font-bold">
                  TZS {loans.reduce((sum, loan) => sum + loan.principal, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Paid</p>
                <p className="text-lg font-bold text-green-600">
                  TZS {loans.reduce((sum, loan) => sum + loan.paid, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Outstanding</p>
                <p className="text-lg font-bold text-red-600">
                  TZS {loans.reduce((sum, loan) => sum + loan.outstanding, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900 mb-1">Payment Tips</p>
                <ul className="space-y-1 text-yellow-800">
                  <li>• Pay on time to maintain good credit score</li>
                  <li>• Paying more than minimum reduces total interest</li>
                  <li>• Contact lender if you're having difficulty paying</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
