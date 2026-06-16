'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center h-full p-8">
          <div className="terminal-panel max-w-md">
            <div className="p-4 space-y-3">
              <p className="text-red-400 font-bold text-xs uppercase tracking-wider">System Error</p>
              <p className="text-emerald-500/70 text-xs font-mono">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="text-[10px] text-emerald-500 hover:text-emerald-300 underline underline-offset-2"
              >
                retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
