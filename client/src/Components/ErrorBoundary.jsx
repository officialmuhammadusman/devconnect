import React, { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white border border-red-200 shadow-md rounded-xl p-6 max-w-md text-center">
            <h2 className="text-2xl font-semibold text-red-600">Something went wrong</h2>
            <p className="text-gray-600 mt-3">
              {this.state.error?.message || "Unknown error"}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
