import { useState, useEffect } from 'react';
import { X, Download, Share, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 30 seconds if not dismissed
      setTimeout(() => {
        const dismissed = localStorage.getItem('installPromptDismissed');
        if (!dismissed) {
          setShowInstallPrompt(true);
        }
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For iOS, show custom prompt
    if (iOS) {
      setTimeout(() => {
        const dismissed = localStorage.getItem('installPromptDismissed');
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (!dismissed && !isStandalone) {
          setShowInstallPrompt(true);
        }
      }, 30000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-5">
      <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-none shadow-xl">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <span className="text-2xl">🌾</span>
              </div>
              <div>
                <h3 className="font-semibold">Install KILIMO</h3>
                <p className="text-sm text-green-100">Add to your home screen</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 -mt-1 -mr-1"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isIOS ? (
            <div className="space-y-3">
              <p className="text-sm text-green-50">
                Install KILIMO for quick access and offline features:
              </p>
              <ol className="text-sm space-y-2 text-green-50">
                <li className="flex items-start gap-2">
                  <span className="font-semibold">1.</span>
                  <span>Tap the <Share className="inline h-4 w-4 mx-1" /> Share button below</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">2.</span>
                  <span>Select "Add to Home Screen" <Plus className="inline h-4 w-4 mx-1" /></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">3.</span>
                  <span>Tap "Add" to install</span>
                </li>
              </ol>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-green-50">
                Get faster access and work offline. Install KILIMO on your device!
              </p>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-white text-green-700 hover:bg-green-50"
                  onClick={handleInstallClick}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Install App
                </Button>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={handleDismiss}
                >
                  Not Now
                </Button>
              </div>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="grid grid-cols-3 gap-2 text-xs text-green-50">
              <div className="text-center">
                <div className="font-semibold">⚡ Fast</div>
                <div>Quick Load</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">📱 Native</div>
                <div>App Feel</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">🔒 Offline</div>
                <div>Works Offline</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}