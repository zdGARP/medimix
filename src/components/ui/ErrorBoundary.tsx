import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Pill, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MediRead AI UI Error Boundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7FAFC] text-slate-900 flex items-center justify-center p-6 text-center">
          <div className="bg-white border border-slate-200 p-8 rounded-3xl max-w-md w-full space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mx-auto">
              <Pill className="w-8 h-8 rotate-45" />
            </div>

            <h1 className="text-2xl font-black text-slate-900">MediRead AI</h1>
            <p className="text-sm text-slate-600">
              The application encountered a temporary display glitch. Tap below to reload.
            </p>

            {this.state.error && (
              <pre className="text-[10px] font-mono bg-slate-50 text-rose-700 p-3 rounded-xl overflow-x-auto text-left max-h-32 border border-slate-200">
                {this.state.error.message}
              </pre>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload MediRead AI</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
