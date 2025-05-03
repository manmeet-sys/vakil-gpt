
import React, { 
  Suspense, 
  lazy, 
  ComponentType, 
  ForwardRefExoticComponent, 
  PropsWithoutRef,
  RefAttributes,
  ForwardedRef
} from 'react';
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
): ForwardRefExoticComponent<PropsWithoutRef<T> & RefAttributes<unknown>> {
  const LazyComponent = lazy(importFactory);
  
  // Default skeleton based on options
  const defaultSkeleton = options?.skeletonProps ? 
    <PracticeAreaToolSkeleton {...options.skeletonProps} /> : 
    <PracticeAreaToolSkeleton />;
  
  // Use provided fallback or default skeleton
  const fallback = options?.fallback || defaultSkeleton;
  
  // Return a wrapped component that handles suspense with properly typed forwardRef
  const WrappedComponent = React.forwardRef<unknown, T>((props, ref) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
  
  // Add display name for better debugging
  WrappedComponent.displayName = 'LazyComponent';
  
  return WrappedComponent;
}

export default useLazyTool;
