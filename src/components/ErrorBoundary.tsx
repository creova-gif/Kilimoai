import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Global Error Boundary for KILIMO
 * Prevents app crashes from reaching Apple reviewers
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging (not shown to users)
    console.error('🚨 Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send to error tracking service (Sentry, etc.)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border-2 border-green-100">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Samahani, Kuna Tatizo
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              Kuna hitilafu imetokea. Tafadhali jaribu tena au wasiliana na msaada wetu.
            </p>

            {/* Error details (only in dev) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-xs font-mono text-red-800 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-[#2E7D32] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#1B5E20] transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
              >
                <RefreshCw className="w-5 h-5" />
                Rudi Mwanzo
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-white text-gray-700 py-3 px-6 rounded-xl font-semibold border-2 border-gray-200 hover:border-[#2E7D32] hover:text-[#2E7D32] transition-all duration-200"
              >
                Jaribu Tena
              </button>
            </div>

            {/* Support contact */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center">
                Msaada? Piga simu:{' '}
                <a href="tel:+255700000000" className="text-[#2E7D32] font-semibold">
                  +255 700 000 000
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
