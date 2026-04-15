import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 text-center">
          <div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
            <AlertTriangle size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Something went wrong</h1>
          <p className="text-slate-500 max-w-md mb-8">
            An unexpected error occurred. We've been notified and are working on a fix.
          </p>
          <div className="flex gap-4">
            <Button 
                variant="secondary" 
                onClick={() => window.location.reload()}
                className="flex items-center gap-2"
            >
              <RefreshCw size={18} /> Reload Page
            </Button>
            <Button onClick={() => window.location.href = '/'}>
              Go to Homepage
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 p-6 bg-slate-900 rounded-2xl text-left overflow-auto max-w-4xl w-full">
              <pre className="text-emerald-400 text-xs font-mono">
                {this.state.error?.toString()}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
