/**
 * Crash Reporting & Error Tracking
 * 
 * Captures:
 * - JS errors
 * - Unhandled promise rejections
 * - Component errors (via Error Boundaries)
 * - Network failures
 * 
 * For production deployment with Sentry or similar service
 */

import { projectId, publicAnonKey } from "./supabase/info";

export interface CrashReport {
  errorType: "js_error" | "promise_rejection" | "component_error" | "network_error";
  message: string;
  stack?: string;
  componentName?: string;
  userId?: string;
  userAgent: string;
  url: string;
  timestamp: string;
  appVersion: string;
  metadata?: Record<string, any>;
}

class CrashReporter {
  private apiBase: string;
  private appVersion: string;
  private userId?: string;

  constructor() {
    this.apiBase = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;
    this.appVersion = "1.0.0"; // Should come from package.json or env
  }

  /**
   * Initialize crash reporting
   */
  init(userId?: string) {
    this.userId = userId;

    // Capture unhandled JS errors
    window.addEventListener("error", (event) => {
      this.reportCrash({
        errorType: "js_error",
        message: event.message,
        stack: event.error?.stack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        appVersion: this.appVersion,
        userId: this.userId,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Capture unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.reportCrash({
        errorType: "promise_rejection",
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        appVersion: this.appVersion,
        userId: this.userId
      });
    });

    console.log("[Crash Reporter] Initialized");
  }

  /**
   * Report a crash
   */
  async reportCrash(crash: CrashReport) {
    try {
      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.error("[CRASH REPORT]", crash.errorType, crash.message);
        if (crash.stack) {
          console.error(crash.stack);
        }
      }

      // Send to backend (non-blocking)
      fetch(`${this.apiBase}/crash-reports/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(crash)
      }).catch(err => {
        console.error("Failed to send crash report:", err);
        // Silently fail - don't block user experience
      });

      // TODO: In production, also send to Sentry/Firebase Crashlytics
      // if (window.Sentry) {
      //   window.Sentry.captureException(new Error(crash.message), {
      //     extra: crash
      //   });
      // }
    } catch (error) {
      console.error("Crash reporting error:", error);
      // Silently fail
    }
  }

  /**
   * Report component error (use with React Error Boundary)
   */
  reportComponentError(error: Error, componentName: string) {
    this.reportCrash({
      errorType: "component_error",
      message: error.message,
      stack: error.stack,
      componentName,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      appVersion: this.appVersion,
      userId: this.userId
    });
  }

  /**
   * Report network error
   */
  reportNetworkError(url: string, error: string) {
    this.reportCrash({
      errorType: "network_error",
      message: `Network request failed: ${url}`,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      appVersion: this.appVersion,
      userId: this.userId,
      metadata: {
        requestUrl: url,
        error
      }
    });
  }

  /**
   * Update user ID after login
   */
  setUserId(userId: string) {
    this.userId = userId;
  }
}

// Singleton instance
export const crashReporter = new CrashReporter();

/**
 * React Error Boundary Component
 */
import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("[Error Boundary]", error, errorInfo);
    
    crashReporter.reportComponentError(
      error,
      this.props.componentName || "Unknown Component"
    );
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-sm text-gray-600 text-center max-w-md mb-4">
            We've been notified about this issue and are working on a fix. Please refresh the page to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#2E7D32] text-white rounded-lg font-medium hover:bg-[#2E7D32]/90"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook to manually report errors
 */
export function useErrorReporting() {
  return {
    reportError: (error: Error, context?: string) => {
      crashReporter.reportComponentError(error, context || "Manual Report");
    },
    reportNetworkError: (url: string, error: string) => {
      crashReporter.reportNetworkError(url, error);
    }
  };
}
