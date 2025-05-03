
import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ToolErrorBoundaryProps {
  toolName: string;
  children: React.ReactNode;
  onReset?: () => void;
}

/**
 * Specialized error boundary for practice area tools
 * Provides context-specific error handling with tool name
 */
const ToolErrorBoundary: React.FC<ToolErrorBoundaryProps> = ({
  toolName,
  children,
  onReset
}) => {
  const handleSubmitFeedback = () => {
    // Save error details to localStorage for feedback form
    const feedbackInfo = {
      tool: toolName,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
    
    localStorage.setItem('errorFeedbackInfo', JSON.stringify(feedbackInfo));
    
    // Navigate to feedback form
    window.location.href = '/feedback?type=error';
  };
  
  return (
    <ErrorBoundary
      fallback={
        <Card className="w-full border-red-200 dark:border-red-800 shadow-sm">
          <CardHeader className="bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800/50 pb-3">
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <span>{toolName} Tool Error</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We encountered an error while using this tool. Our team has been notified.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={onReset || (() => window.location.reload())}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Tool
              </Button>
              
              <Button 
                variant="secondary"
                onClick={handleSubmitFeedback}
              >
                Submit Error Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default ToolErrorBoundary;
