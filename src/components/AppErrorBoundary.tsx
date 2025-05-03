
import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw, MessageSquare } from 'lucide-react';
import FeedbackDialog from './feedback/FeedbackDialog';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * Application-level error boundary with enhanced error handling
 * Provides user-friendly recovery options and error reporting
 */
const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({ children }) => {
  const [errorDetails, setErrorDetails] = React.useState<{
    occurred: boolean;
    path: string;
    timestamp: string;
  }>({
    occurred: false,
    path: '',
    timestamp: ''
  });

  // Record the error details for reporting
  const handleError = (error: Error) => {
    setErrorDetails({
      occurred: true,
      path: window.location.pathname,
      timestamp: new Date().toISOString()
    });
    
    // In a real app, you would send this to your error tracking service
    console.error('Application error captured:', {
      error: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  };

  const handleReset = () => {
    setErrorDetails({
      occurred: false,
      path: '',
      timestamp: ''
    });
    
    window.location.reload();
  };

  const navigateHome = () => {
    window.location.href = '/';
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <Card className="max-w-lg w-full shadow-lg border-red-200 dark:border-red-800">
            <CardHeader className="bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800/50">
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <span>Application Error</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-6 space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                We're sorry, but something went wrong. Our team has been notified of this issue.
              </p>
              
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-sm">
                <p className="font-medium mb-1 text-gray-600 dark:text-gray-400">Error Information:</p>
                <p className="text-gray-600 dark:text-gray-400">Location: {errorDetails.path || window.location.pathname}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Time: {errorDetails.timestamp || new Date().toISOString()}
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800/50">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  If this issue persists, please try clearing your browser cache or using a different browser.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                variant="default" 
                onClick={handleReset}
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Application
              </Button>
              
              <Button 
                variant="outline" 
                onClick={navigateHome}
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Return to Home
              </Button>
              
              <FeedbackDialog
                variant="issue"
                trigger={
                  <Button 
                    variant="secondary"
                    className="w-full sm:w-auto flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Report Problem
                  </Button>
                }
              />
            </CardFooter>
          </Card>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default AppErrorBoundary;
