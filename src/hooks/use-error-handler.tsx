
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
  toastOnError?: boolean;
  logToConsole?: boolean;
  captureToService?: boolean;
}

const defaultOptions: ErrorHandlerOptions = {
  toastOnError: true,
  logToConsole: true,
  captureToService: false
};

export function useErrorHandler(customOptions?: ErrorHandlerOptions) {
  const options = { ...defaultOptions, ...customOptions };
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Generic async handler with loading state
  const handleAsync = useCallback(async <T,>(
    asyncFn: () => Promise<T>, 
    successMessage?: string,
    errorPrefix: string = 'Operation failed'
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFn();
      setIsLoading(false);
      
      if (successMessage) {
        toast.success(successMessage);
      }
      
      return result;
    } catch (err) {
      setIsLoading(false);
      
      const errorMessage = err instanceof Error
        ? `${errorPrefix}: ${err.message}`
        : `${errorPrefix}. Please try again.`;
      
      // Set local error state
      setError(errorMessage);
      
      // Log to console if enabled
      if (options.logToConsole) {
        console.error(errorMessage, err);
      }
      
      // Show toast if enabled
      if (options.toastOnError) {
        toast.error(errorMessage);
      }
      
      // In a real app, you might want to send to an error tracking service
      if (options.captureToService) {
        // captureException(err);
        console.info('Error would be sent to monitoring service in production');
      }
      
      return null;
    }
  }, [options]);
  
  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    error,
    isLoading,
    handleAsync,
    clearError,
    setError
  };
}

export default useErrorHandler;
