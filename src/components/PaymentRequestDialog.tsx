import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Send, Copy, Share2, CheckCircle2, QrCode, Loader2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { createPaymentRequest } from "../utils/api";

interface PaymentRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userId: string;
}

export function PaymentRequestDialog({ open, onOpenChange, userName, userId }: PaymentRequestDialogProps) {
  const [requestData, setRequestData] = useState({
    recipientName: "",
    recipientPhone: "",
    amount: "",
    purpose: "crop_sale",
    description: "",
  });
  const [requestGenerated, setRequestGenerated] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const [loading, setLoading] = useState(false);

  const purposes = [
    { id: "crop_sale", name: "Crop Sale Payment", icon: "🌾" },
    { id: "service", name: "Service Payment", icon: "🔧" },
    { id: "loan", name: "Loan Collection", icon: "💰" },
    { id: "rent", name: "Land Rent", icon: "🏞️" },
    { id: "other", name: "Other", icon: "📋" },
  ];

  const generatePaymentRequest = async () => {
    if (!requestData.recipientName || !requestData.amount) {
      toast.error("Please fill recipient name and amount");
      return;
    }

    setLoading(true);

    try {
      const response = await createPaymentRequest({
        userId,
        recipientName: requestData.recipientName,
        recipientPhone: requestData.recipientPhone,
        amount: parseFloat(requestData.amount),
        purpose: requestData.purpose,
        description: requestData.description,
      });
      
      setRequestId(response.requestId);
      setPaymentLink(response.paymentLink);
      setRequestGenerated(true);
      
      toast.success("Payment request created", {
        description: requestData.recipientPhone 
          ? "SMS notification sent to recipient" 
          : `Request ID: ${response.requestId}`
      });
    } catch (error: any) {
      console.error("Payment request error:", error);
      toast.error("Failed to create payment request", {
        description: error.message || "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyRequestLink = () => {
    const link = paymentLink || `https://creova.app/pay/${requestId}`;
    navigator.clipboard.writeText(link);
    toast.success("Payment link copied to clipboard");
  };

  const sendViaSMS = () => {
    if (!requestData.recipientPhone) {
      toast.error("Recipient phone number required");
      return;
    }

    const message = `Payment Request from ${userName}:\nAmount: TZS ${parseFloat(requestData.amount).toLocaleString()}\nPurpose: ${purposes.find(p => p.id === requestData.purpose)?.name}\nPay here: ${paymentLink || `https://creova.app/pay/${requestId}`}`;
    
    toast.success("SMS sent successfully", {
      description: `Payment request sent to ${requestData.recipientPhone}`
    });
  };

  const resetForm = () => {
    setRequestData({
      recipientName: "",
      recipientPhone: "",
      amount: "",
      purpose: "crop_sale",
      description: "",
    });
    setRequestGenerated(false);
    setRequestId("");
    setPaymentLink("");
  };

  const createNew = () => {
    resetForm();
  };

  const selectedPurpose = purposes.find(p => p.id === requestData.purpose);

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Request Payment
          </DialogTitle>
          <DialogDescription>
            Send a payment request to buyers or customers
          </DialogDescription>
        </DialogHeader>

        {!requestGenerated ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name *</Label>
              <Input
                id="recipientName"
                placeholder="e.g., Bakhresa Mills Ltd"
                value={requestData.recipientName}
                onChange={(e) => setRequestData({ ...requestData, recipientName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientPhone">Recipient Phone (Optional)</Label>
              <Input
                id="recipientPhone"
                type="tel"
                placeholder="+255 XXX XXX XXX"
                value={requestData.recipientPhone}
                onChange={(e) => setRequestData({ ...requestData, recipientPhone: e.target.value })}
              />
              <p className="text-xs text-gray-500">Required for SMS notification</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (TZS) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="500000"
                value={requestData.amount}
                onChange={(e) => setRequestData({ ...requestData, amount: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Payment Purpose *</Label>
              <Select value={requestData.purpose} onValueChange={(value) => setRequestData({ ...requestData, purpose: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  {purposes.map((purpose) => (
                    <SelectItem key={purpose.id} value={purpose.id}>
                      <span className="flex items-center gap-2">
                        <span>{purpose.icon}</span>
                        {purpose.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="e.g., Payment for 2 tons of maize delivered on 12/12/2024"
                value={requestData.description}
                onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
                rows={3}
              />
            </div>

            {requestData.amount && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Payment Request Preview</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium">{userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">{requestData.recipientName || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-gray-700">
                      TZS {parseFloat(requestData.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purpose:</span>
                    <span className="font-medium">{selectedPurpose?.name}</span>
                  </div>
                </div>
              </div>
            )}

            <Button onClick={generatePaymentRequest} className="w-full gap-2">
              <Send className="h-4 w-4" />
              Generate Payment Request
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-1">Payment Request Created!</h3>
              <p className="text-sm text-gray-600">Request ID: {requestId}</p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold">TZS {parseFloat(requestData.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipient:</span>
                  <span className="font-medium">{requestData.recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Purpose:</span>
                  <span>{selectedPurpose?.name}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Link</Label>
              <div className="flex gap-2">
                <Input
                  value={paymentLink || `https://creova.app/pay/${requestId}`}
                  readOnly
                  className="text-sm"
                />
                <Button variant="outline" onClick={copyRequestLink} className="gap-2">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={sendViaSMS} className="gap-2">
                <Send className="h-4 w-4" />
                Send SMS
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            <div className="pt-4 border-t space-y-2">
              <Button onClick={createNew} className="w-full">
                Create Another Request
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}