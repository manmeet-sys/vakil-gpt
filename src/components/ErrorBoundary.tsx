
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    
    // In a production app, send error to your monitoring service
    // sendErrorToMonitoringService(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex items-center justify-center p-4 min-h-[200px]">
          <Card className="max-w-lg w-full">
            <CardHeader className="bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20">
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <span>Something went wrong</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4 space-y-2">
              <p className="text-gray-800 dark:text-gray-200">
                We're sorry, but an error occurred while rendering this component.
              </p>
              {this.state.error && (
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-auto">
                  <p className="font-mono text-red-600 dark:text-red-400">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-3 flex justify-center">
              <Button onClick={this.handleReset}>
                Try Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
