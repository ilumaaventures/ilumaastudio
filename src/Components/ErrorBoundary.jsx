import React, { Component } from "react";
import { RefreshCw, Home, Copy, ChevronDown, ChevronUp, ShieldAlert } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Uncaught Error Boundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleCopyError = () => {
    const errorText = `Error: ${this.state.error?.toString()}\n\nStack:\n${this.state.errorInfo?.componentStack || this.state.error?.stack || "N/A"}`;
    navigator.clipboard.writeText(errorText);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans select-none">
          <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6">
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-500 flex items-center justify-center mx-auto shadow-xs">
              <ShieldAlert size={36} />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Something Went Wrong
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium leading-relaxed">
                An unexpected component error occurred. Don't worry, your session data is safe and intact.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw size={15} />
                Refresh Application
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home size={15} />
                Back to Home Page
              </button>
            </div>

            {/* Technical Error Details Accordion */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={this.toggleDetails}
                  className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition cursor-pointer"
                >
                  {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  <span>{this.state.showDetails ? "Hide Technical Details" : "Show Technical Details"}</span>
                </button>

                <button
                  onClick={this.handleCopyError}
                  className="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] flex items-center gap-1 transition cursor-pointer"
                >
                  <Copy size={13} />
                  <span>{this.state.copied ? "Copied Logs!" : "Copy Logs"}</span>
                </button>
              </div>

              {this.state.showDetails && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 font-mono text-[11px] text-rose-300 overflow-x-auto max-h-60">
                  <p className="font-bold text-rose-300">
                    {this.state.error && this.state.error.toString()}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-slate-400 text-[10px] whitespace-pre-wrap leading-tight pt-2 border-t border-slate-800">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
