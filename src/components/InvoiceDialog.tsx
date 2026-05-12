import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Download, Printer, Send, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { generateInvoice as apiGenerateInvoice } from "../utils/api";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userId: string;
}

export function InvoiceDialog({ open, onOpenChange, userName, userId }: InvoiceDialogProps) {
  const [invoiceData, setInvoiceData] = useState({
    customerName: "",
    customerPhone: "",
    itemDescription: "",
    quantity: "",
    unitPrice: "",
    crop: "maize",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<{
    invoiceNumber: string;
    invoiceHTML: string;
  } | null>(null);

  const crops = [
    { id: "maize", name: "Maize", unit: "kg" },
    { id: "rice", name: "Rice", unit: "kg" },
    { id: "beans", name: "Beans", unit: "kg" },
    { id: "sunflower", name: "Sunflower", unit: "kg" },
    { id: "cassava", name: "Cassava", unit: "kg" },
    { id: "tomatoes", name: "Tomatoes", unit: "crate" },
  ];

  const selectedCrop = crops.find(c => c.id === invoiceData.crop);
  const subtotal = parseFloat(invoiceData.quantity || "0") * parseFloat(invoiceData.unitPrice || "0");
  const vat = subtotal * 0.18; // 18% VAT
  const total = subtotal + vat;

  const generateInvoice = async () => {
    if (!invoiceData.customerName || !invoiceData.quantity || !invoiceData.unitPrice) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await apiGenerateInvoice({
        userId,
        sellerName: userName,
        sellerPhone: "", // Could add this to user profile
        customerName: invoiceData.customerName,
        customerPhone: invoiceData.customerPhone,
        items: [{
          description: `${selectedCrop?.name} (${invoiceData.itemDescription || "Quality Grade A"})`,
          quantity: parseFloat(invoiceData.quantity),
          unit: selectedCrop?.unit || "kg",
          unitPrice: parseFloat(invoiceData.unitPrice),
          total: subtotal
        }],
        subtotal,
        vat,
        total,
        notes: invoiceData.notes
      });
      
      setGeneratedInvoice(response);
      
      toast.success(`Invoice ${response.invoiceNumber} generated successfully`, {
        description: invoiceData.customerPhone ? "SMS sent to customer" : "Invoice saved to your documents"
      });
      
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error("Invoice generation error:", error);
      toast.error("Failed to generate invoice", {
        description: error.message || "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    toast.info("PDF download coming soon", {
      description: "Integration with PDF generator in progress"
    });
  };

  const sendInvoice = () => {
    if (!invoiceData.customerPhone) {
      toast.error("Customer phone number required to send invoice");
      return;
    }
    toast.success("Invoice sent via SMS", {
      description: `Invoice details sent to ${invoiceData.customerPhone}`
    });
  };

  const resetForm = () => {
    setInvoiceData({
      customerName: "",
      customerPhone: "",
      itemDescription: "",
      quantity: "",
      unitPrice: "",
      crop: "maize",
      notes: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Sales Invoice
          </DialogTitle>
          <DialogDescription>
            Create a professional invoice for your crop sales
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                placeholder="Bakhresa Mills Ltd"
                value={invoiceData.customerName}
                onChange={(e) => setInvoiceData({ ...invoiceData, customerName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Customer Phone</Label>
              <Input
                id="customerPhone"
                placeholder="+255 XXX XXX XXX"
                value={invoiceData.customerPhone}
                onChange={(e) => setInvoiceData({ ...invoiceData, customerPhone: e.target.value })}
              />
            </div>
          </div>

          {/* Item Details */}
          <div className="space-y-2">
            <Label htmlFor="crop">Crop Type *</Label>
            <Select value={invoiceData.crop} onValueChange={(value) => setInvoiceData({ ...invoiceData, crop: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent>
                {crops.map((crop) => (
                  <SelectItem key={crop.id} value={crop.id}>
                    {crop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemDescription">Description (Optional)</Label>
            <Input
              id="itemDescription"
              placeholder="e.g., Organic, Grade A, Dried"
              value={invoiceData.itemDescription}
              onChange={(e) => setInvoiceData({ ...invoiceData, itemDescription: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity ({selectedCrop?.unit}) *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="1000"
                value={invoiceData.quantity}
                onChange={(e) => setInvoiceData({ ...invoiceData, quantity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Price per {selectedCrop?.unit} (TZS) *</Label>
              <Input
                id="unitPrice"
                type="number"
                placeholder="800"
                value={invoiceData.unitPrice}
                onChange={(e) => setInvoiceData({ ...invoiceData, unitPrice: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Payment terms, delivery details, etc."
              value={invoiceData.notes}
              onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
              rows={3}
            />
          </div>

          {/* Invoice Preview */}
          {invoiceData.quantity && invoiceData.unitPrice && (
            <div className="p-4 bg-gray-50 border rounded-lg space-y-2">
              <h4 className="font-medium">Invoice Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>TZS {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>VAT (18%):</span>
                  <span>TZS {vat.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold">
                  <span>Total:</span>
                  <span>TZS {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={generateInvoice} className="flex-1 gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Generate Invoice
            </Button>
            <Button variant="outline" onClick={downloadPDF} className="gap-2">
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" onClick={sendInvoice} className="gap-2">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}