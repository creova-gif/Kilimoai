import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

/**
 * Offline Detection Hook
 * Monitors network connectivity for Apple App Store compliance
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Offline Banner Component
 * Shows persistent banner when network is unavailable
 */
export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const [showBanner, setShowBanner] = useState(!isOnline);

  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
    } else {
      // Keep showing for 2 seconds after coming back online
      const timer = setTimeout(() => setShowBanner(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showBanner) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOnline ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-2 text-white">
        {isOnline ? (
          <>
            <Wifi className="w-5 h-5" />
            <span className="font-semibold">Umeongelewa tena!</span>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5" />
            <span className="font-semibold">Hakuna mtandao - Kazi zitaendelea offline</span>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Network Error Handler
 * Provides user-friendly error messages for network failures
 */
export function handleNetworkError(error: any): string {
  console.error('Network error:', error);

  // Check if offline
  if (!navigator.onLine) {
    return 'Hakuna mtandao wa intaneti. Tafadhali angalia muunganisho wako.';
  }

  // Check for timeout
  if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
    return 'Ombi limechukua muda mrefu. Tafadhali jaribu tena.';
  }

  // Check for server errors
  if (error.status >= 500) {
    return 'Huduma hazipatikani kwa sasa. Tafadhali jaribu baadaye.';
  }

  // Check for auth errors
  if (error.status === 401 || error.status === 403) {
    return 'Ingia tena ili kuendelea.';
  }

  // Generic error
  return 'Kuna tatizo limetokea. Tafadhali jaribu tena.';
}

/**
 * Retry Button Component
 * Standard retry UI for failed operations
 */
interface RetryButtonProps {
  onRetry: () => void;
  loading?: boolean;
  message?: string;
}

export function RetryButton({ onRetry, loading = false, message }: RetryButtonProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      {message && (
        <p className="text-gray-600 text-center max-w-md">{message}</p>
      )}
      <button
        onClick={onRetry}
        disabled={loading}
        className="bg-[#2E7D32] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#1B5E20] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        {loading ? 'Inapakia...' : 'Jaribu Tena'}
      </button>
    </div>
  );
}

/**
 * Safe Fetch Wrapper
 * Automatically handles offline mode and errors
 */
export async function safeFetch(
  url: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Check online status first
    if (!navigator.onLine) {
      return {
        success: false,
        error: 'Hakuna mtandao. Tafadhali angalia muunganisho wako.',
      };
    }

    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: handleNetworkError({ status: response.status, message: errorText }),
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: handleNetworkError(error),
    };
  }
}

/**
 * Empty State Component
 * For screens with no data yet
 */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {icon && (
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-[#2E7D32] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#1B5E20] transition-all duration-200 shadow-md"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
