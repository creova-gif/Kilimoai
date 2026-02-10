import { X, Bell, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner@2.0.3";

interface SMSAlertModalProps {
  onClose: () => void;
  alertType: string;
}

export function SMSAlertModal({ onClose, alertType }: SMSAlertModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [enrolled, setEnrolled] = useState(false);

  const handleEnroll = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setEnrolled(true);
    toast.success(`SMS alerts enabled for ${phoneNumber}`);
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Bell className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Enable SMS Alerts</h3>
              <p className="text-sm text-gray-600">{alertType}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!enrolled ? (
            <>
              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">What you'll receive:</h4>
                  <ul className="space-y-1 text-sm text-gray-800">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Daily weather updates at 7 AM</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Severe weather warnings (storms, floods, droughts)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Farming tips based on forecast</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Market price alerts when prices change</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <label className="font-medium text-sm">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="+255 XXX XXX XXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-lg"
                />
                <p className="text-xs text-gray-500">
                  Standard SMS rates apply. You can unsubscribe anytime by texting STOP to 15050.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  ✓ Free service for KILIMO users<br />
                  ✓ Up to 3 SMS per day<br />
                  ✓ Available in English & Swahili
                </p>
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleEnroll}
              >
                Enable SMS Alerts
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-bold text-lg mb-2">Successfully Enrolled!</h4>
              <p className="text-gray-600">
                You'll start receiving SMS alerts at<br />
                <strong>{phoneNumber}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Check your phone for a confirmation message.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}