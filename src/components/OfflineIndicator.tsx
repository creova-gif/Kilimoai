import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !showOfflineMessage) {
    return null;
  }

  return (
    <Alert 
      variant={isOnline ? "default" : "destructive"} 
      className={`mb-4 ${isOnline ? "bg-[#2E7D32]/5 border-[#2E7D32]/20" : ""}`}
    >
      <div className="flex items-start gap-3">
        {isOnline ? (
          <Wifi className="h-5 w-5 text-[#2E7D32] mt-0.5" />
        ) : (
          <WifiOff className="h-5 w-5 mt-0.5" />
        )}
        <AlertDescription>
          {isOnline ? (
            <div>
              <p className="font-medium text-[#2E7D32]">Back online!</p>
              <p className="text-sm text-[#2E7D32]">You can now access all features.</p>
            </div>
          ) : (
            <div>
              <p className="font-medium">Offline Mode</p>
              <p className="text-sm">You have access to last 3 messages and cached data. Connect to internet for full features.</p>
            </div>
          )}
        </AlertDescription>
      </div>
    </Alert>
  );
}
