import { useEffect } from 'react';
import { toast } from 'sonner@2.0.3';

export function PWAManager() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker registered successfully:', registration.scope);

            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    toast.info('New version available! Refresh to update.', {
                      duration: 10000,
                      action: {
                        label: 'Refresh',
                        onClick: () => window.location.reload()
                      }
                    });
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }

    // Handle online/offline events
    const handleOnline = () => {
      toast.success('You are back online!');
    };

    const handleOffline = () => {
      toast.warning('You are offline. Some features may be limited.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // iOS standalone mode detection
    const isIOSStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isIOSStandalone) {
      console.log('Running in standalone mode (installed as PWA)');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null;
}
