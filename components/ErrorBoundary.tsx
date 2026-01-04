import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  // FIX: Using a class property for state initialization. This is a more modern
  // syntax and helps ensure the correct 'this' context, which should resolve the
  // reported errors regarding 'state' and 'props' not being accessible.
  public state: State = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#0f172a',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', color: '#f87171' }}>Something went wrong.</h1>
          <p style={{ marginTop: '1rem', color: '#94a3b8' }}>
            We've been notified of the issue. Please try refreshing the page.
          </p>
          {this.state.error && (
            <details style={{ marginTop: '2rem', color: '#64748b', width: '100%', maxWidth: '800px' }}>
              <summary>Error Details</summary>
              <pre style={{
                marginTop: '1rem',
                backgroundColor: '#1e293b',
                padding: '1rem',
                borderRadius: '8px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                fontSize: '0.8rem',
                textAlign: 'left',
              }}>
                {this.state.error.toString()}
                <br />
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;