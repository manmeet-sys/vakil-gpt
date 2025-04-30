
import React, { Suspense, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A wrapper component for lazy loading components with a consistent loading fallback
 */
const LazyComponent: React.FC<LazyComponentProps> = ({ 
  children, 
  fallback 
}) => {
  const defaultFallback = (
    <div className="w-full p-4 space-y-4">
      <Skeleton className="h-8 w-3/4 rounded-lg" />
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-5/6 rounded-lg" />
        <Skeleton className="h-4 w-4/6 rounded-lg" />
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

export default LazyComponent;
