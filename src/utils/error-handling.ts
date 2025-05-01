
/**
 * Centralized error handling functions
 */

type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // Fallback in case there's an error stringifying the error
    return new Error(String(maybeError));
  }
}

/**
 * Get a standardized error message from any error
 */
export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
}

/**
 * Create a standardized error object with typed errors
 */
export class AppError extends Error {
  code?: string;
  statusCode?: number;
  context?: Record<string, unknown>;

  constructor(
    message: string,
    options?: {
      code?: string;
      statusCode?: number;
      cause?: Error;
      context?: Record<string, unknown>;
    }
  ) {
    super(message);
    this.name = 'AppError';
    this.code = options?.code;
    this.statusCode = options?.statusCode;
    this.cause = options?.cause;
    this.context = options?.context;
  }
}

/**
 * Safely execute a function with proper error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorHandler?: (err: unknown) => void
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (err) {
    const error = isErrorWithMessage(err) ? new Error(err.message) : new Error('An unknown error occurred');
    if (errorHandler) {
      errorHandler(err);
    } else {
      console.error('Operation failed:', err);
    }
    return { data: null, error };
  }
}

/**
 * Format API validation errors into user-friendly messages
 */
export function formatValidationErrors(
  errors: Record<string, string[]>
): { field: string; message: string }[] {
  return Object.entries(errors).map(([field, messages]) => ({
    field,
    message: messages[0] || 'Invalid value'
  }));
}

/**
 * Check if error is a network connectivity error
 */
export function isNetworkError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes('network') ||
    message.includes('connection') ||
    message.includes('offline') ||
    message.includes('failed to fetch')
  );
}

/**
 * Generate user-friendly error messages
 */
export function getUserFriendlyError(error: unknown): string {
  const message = getErrorMessage(error);
  
  // Network connectivity
  if (isNetworkError(error)) {
    return 'Network connection issue. Please check your internet connection and try again.';
  }
  
  // Authentication
  if (message.includes('auth') || message.includes('permission') || message.includes('unauthorized')) {
    return 'Authentication error. Please log in again.';
  }
  
  // Server errors
  if (message.includes('500')) {
    return 'The server encountered an error. Please try again later.';
  }
  
  // Default message
  return message;
}
