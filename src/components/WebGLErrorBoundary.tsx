/**
 * WebGLErrorBoundary.tsx
 * Catches WebGL/R3F errors so the rest of the dashboard still loads.
 */
import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export default class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="w-full h-full flex items-center justify-center text-center p-8 text-surface-500">
          <div>
            <svg className="w-12 h-12 mx-auto mb-3 text-surface-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">WebGL tidak tersedia di browser ini.</p>
            <p className="text-xs mt-1 text-surface-600">Coba Chrome/Firefox terbaru.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
