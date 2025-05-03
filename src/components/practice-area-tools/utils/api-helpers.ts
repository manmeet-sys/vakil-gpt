
import { toast } from "sonner";

/**
 * Standard error handler for practice area tools
 * @param error The error object
 * @param fallbackMessage Optional fallback message
 * @returns Standard error message
 */
export const handleApiError = (error: unknown, fallbackMessage = "An error occurred. Please try again."): string => {
  console.error("API Error:", error);
  
  // Extract message from different error types
  let errorMessage = fallbackMessage;
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = String((error as any).message);
  }
  
  // Show toast notification
  toast.error(errorMessage);
  
  return errorMessage;
};

/**
 * Standardized loader function for practice area tools
 * Handles loading states and cancellation
 * @param loadingFn The async function to execute
 * @param setIsLoading State setter for loading indicator
 * @param options Optional configuration
 * @returns Promise with result or error
 */
export const withLoadingState = async<T>(
  loadingFn: () => Promise<T>, 
  setIsLoading: (isLoading: boolean) => void,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: unknown) => void;
    errorMessage?: string;
  }
): Promise<T | null> => {
  setIsLoading(true);
  
  try {
    const result = await loadingFn();
    
    if (options?.onSuccess) {
      options.onSuccess(result);
    }
    
    return result;
  } catch (error) {
    handleApiError(error, options?.errorMessage);
    
    if (options?.onError) {
      options.onError(error);
    }
    
    return null;
  } finally {
    setIsLoading(false);
  }
};

/**
 * Creates an abortable fetch request that can be cancelled
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns Object with fetch promise and abort function
 */
export const createAbortableFetch = (url: string, options?: RequestInit) => {
  const controller = new AbortController();
  const { signal } = controller;
  
  const promise = fetch(url, { ...options, signal });
  const abort = () => controller.abort();
  
  return { promise, abort };
};

/**
 * Debounces a function call
 * @param fn The function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

/**
 * Format a date for consistent display across all tools
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatDateForDisplay = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Creates a delay promise for simulating API calls during development
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the specified delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
