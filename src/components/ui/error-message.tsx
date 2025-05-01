
import React from 'react';
import { AlertCircle, XCircle, AlertTriangle, InfoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type ErrorSeverity = 'error' | 'warning' | 'info';

interface ErrorMessageProps {
  message: string;
  severity?: ErrorSeverity;
  className?: string;
  onDismiss?: () => void;
  id?: string;
}

const ErrorMessage = ({ 
  message, 
  severity = 'error',
  className,
  onDismiss,
  id
}: ErrorMessageProps) => {
  // Generate a unique ID if not provided
  const messageId = id || `message-${Math.random().toString(36).substr(2, 9)}`;
  
  const getIcon = () => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4" aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" aria-hidden="true" />;
      case 'info':
        return <InfoIcon className="h-4 w-4" aria-hidden="true" />;
      default:
        return <AlertCircle className="h-4 w-4" aria-hidden="true" />;
    }
  };

  const getColorClasses = () => {
    switch (severity) {
      case 'error':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50';
      case 'warning':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50';
      case 'info':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/50';
      default:
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50';
    }
  };

  const getAriaRole = () => {
    switch (severity) {
      case 'error':
        return 'alert';
      case 'warning':
        return 'status';
      case 'info':
        return 'status';
      default:
        return 'alert';
    }
  };

  return (
    <div 
      className={cn(
        'flex items-start gap-2 text-sm p-2 rounded border',
        getColorClasses(),
        className
      )}
      role={getAriaRole()}
      aria-live={severity === 'error' ? 'assertive' : 'polite'}
      id={messageId}
    >
      <span className="mt-0.5 flex-shrink-0">
        {getIcon()}
      </span>
      <span className="flex-grow">{message}</span>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="flex-shrink-0 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
          aria-label="Dismiss message"
        >
          <XCircle className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
