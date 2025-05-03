
import React, { Suspense, lazy, ComponentType, PropsWithoutRef, RefAttributes } from 'react';
import { PracticeAreaToolSkeleton } from '@/components/SkeletonLoaders/PracticeAreaToolSkeleton';

interface LazyToolOptions {
  fallback?: React.ReactNode;
  skeletonProps?: {
    hasInputs?: boolean;
    hasTextArea?: boolean;
    hasMultipleInputs?: boolean;
    hasDocument?: boolean;
    hasResults?: boolean;
  };
}

/**
 * Custom hook for lazy loading practice area tools with standardized loading states
 * @param importFactory Function that returns the import promise for the component
 * @param options Configuration options
 * @returns Lazy loaded component with proper suspense fallback
 */
export function useLazyTool<T extends object>(
  importFactory: () => Promise<{ default: ComponentType<T> }>, 
  options?: LazyToolOptions
) {
  const LazyComponent = lazy(importFactory);
  
  // Default skeleton based on options
  const defaultSkeleton = options?.skeletonProps ? 
    <PracticeAreaToolSkeleton {...options.skeletonProps} /> : 
    <PracticeAreaToolSkeleton />;
  
  // Use provided fallback or default skeleton
  const fallback = options?.fallback || defaultSkeleton;
  
  // Return a wrapped component that handles suspense
  const WrappedComponent = (props: T) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
  
  return WrappedComponent;
}

export default useLazyTool;
