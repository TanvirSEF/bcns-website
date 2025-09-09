"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import { ApiError } from "@/lib/api-client";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  level?: 'page' | 'section' | 'component';
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    // In a real app, you would send this to your error monitoring service
    // like Sentry, LogRocket, or Bugsnag
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        userId: typeof localStorage !== 'undefined' ? localStorage.getItem('user_id') : null,
      };

      // Example: Send to monitoring service
      // monitoringService.captureException(error, { extra: errorData });
      
      console.error('Error logged:', errorData);
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  };

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <this.props.fallback error={this.state.error!} resetError={this.resetError} />;
      }

      return (
        <DefaultErrorFallback 
          error={this.state.error!} 
          errorInfo={this.state.errorInfo}
          level={this.props.level || 'component'}
          resetError={this.resetError} 
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  errorInfo?: React.ErrorInfo | null | undefined;
  level: 'page' | 'section' | 'component';
  resetError: () => void;
}

function DefaultErrorFallback({ error, errorInfo, level, resetError }: DefaultErrorFallbackProps) {
  const isApiError = error instanceof ApiError;
  const isNetworkError = error?.message?.includes('Network') || 
                        error?.message?.includes('fetch');

  const getErrorTitle = () => {
    if (isApiError) {
      switch (error.status) {
        case 401:
          return 'Authentication Required';
        case 403:
          return 'Access Denied';
        case 404:
          return 'Not Found';
        case 500:
          return 'Server Error';
        default:
          return 'API Error';
      }
    }
    
    if (isNetworkError) {
      return 'Connection Problem';
    }
    
    return 'Something went wrong';
  };

  const getErrorMessage = () => {
    if (isApiError) {
      return error.getUserFriendlyMessage();
    }
    
    if (isNetworkError) {
      return 'Please check your internet connection and try again.';
    }
    
    return 'We encountered an unexpected error. Our team has been notified.';
  };

  const getErrorIcon = () => {
    if (isApiError && error.status === 401) {
      return <AlertTriangle className="h-8 w-8 text-yellow-600" />;
    }
    
    if (isNetworkError) {
      return <AlertTriangle className="h-8 w-8 text-orange-600" />;
    }
    
    return <Bug className="h-8 w-8 text-red-600" />;
  };

  const shouldShowRetry = () => {
    // Don't show retry for certain error types
    if (isApiError && [400, 401, 403, 404, 422].includes(error.status)) {
      return false;
    }
    return true;
  };
  return (
    <div className={`
      flex items-center justify-center p-4
      ${level === 'page' ? 'min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-100' : 'min-h-[200px]'}
    `}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-center justify-center">
            {getErrorIcon()}
            {getErrorTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            {getErrorMessage()}
          </p>

          {/* Error details for development */}
          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                Error details (dev only)
              </summary>
              <div className="mt-2 space-y-2">
                <div>
                  <strong>Message:</strong>
                  <pre className="whitespace-pre-wrap bg-muted p-2 rounded text-xs mt-1">
                    {error.message}
                  </pre>
                </div>
                {error.stack && (
                  <div>
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap bg-muted p-2 rounded text-xs mt-1 max-h-32 overflow-auto">
                      {error.stack}
                    </pre>
                  </div>
                )}
                {errorInfo?.componentStack && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="whitespace-pre-wrap bg-muted p-2 rounded text-xs mt-1 max-h-32 overflow-auto">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            {shouldShowRetry() && (
              <Button onClick={resetError} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            
            {level === 'page' && (
              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            )}
          </div>

          {/* Additional help text */}
          {isApiError && error.status === 401 && (
            <p className="text-xs text-muted-foreground text-center">
              Please log in again to continue.
            </p>
          )}
          
          {isNetworkError && (
            <p className="text-xs text-muted-foreground text-center">
              If the problem persists, please contact support.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Hook for using error boundary in functional components
 */
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Manual error report:', error, errorInfo);
    
    // In a real app, you would report this to your error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // reportErrorToService(error, errorInfo);
    }
    
    throw error; // Re-throw to trigger error boundary
  };
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

export { ErrorBoundary, DefaultErrorFallback };
