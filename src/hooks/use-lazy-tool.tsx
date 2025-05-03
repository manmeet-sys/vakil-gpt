
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
  preload?: boolean;
  minimumLoadTimeMs?: number;
  delayMs?: number;
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
 * and performance optimizations
 * 
 * @param importFactory Function that returns the import promise for the component
 * @param options Configuration options
 * @returns Lazy loaded component with proper suspense fallback
 */
export function useLazyTool<T extends object>(
  importFactory: () => Promise<{ default: ComponentType<T> }>, 
  options?: LazyToolOptions
): ForwardRefExoticComponent<PropsWithoutRef<T> & RefAttributes<unknown>> {
  // Optimize imports by adding a retry mechanism and timeout
  const optimizedImport = () => {
    return new Promise<{ default: ComponentType<T> }>((resolve, reject) => {
      // Start loading component
      importFactory()
        .then(component => {
          // Add artificial minimum display time for skeleton if specified
          if (options?.minimumLoadTimeMs) {
            setTimeout(() => resolve(component), options.minimumLoadTimeMs);
          } else {
            resolve(component);
          }
        })
        .catch(error => {
          console.error('Error loading component:', error);
          // Retry once after short delay
          setTimeout(() => {
            importFactory()
              .then(resolve)
              .catch(reject);
          }, 500);
        });
    });
  };
  
  // Use optimized import
  const LazyComponent = lazy(optimizedImport);
  
  // Preload component if needed
  if (options?.preload) {
    // Start preloading but don't block
    optimizedImport().catch(() => {});
  }
  
  // Default skeleton based on options  
  const defaultSkeleton = options?.skeletonProps ? 
    <PracticeAreaToolSkeleton {...options.skeletonProps} /> : 
    <PracticeAreaToolSkeleton />;
  
  // Use provided fallback or default skeleton
  const fallback = options?.fallback || defaultSkeleton;
  
  // Create a wrapper component that implements loading delay if specified
  const DelayedFallback = () => {
    const [showFallback, setShowFallback] = React.useState(!options?.delayMs);
    
    React.useEffect(() => {
      if (options?.delayMs) {
        const timer = setTimeout(() => setShowFallback(true), options.delayMs);
        return () => clearTimeout(timer);
      }
    }, []);
    
    return showFallback ? <>{fallback}</> : null;
  };
  
  // Return a wrapped component that handles suspense with properly typed forwardRef
  const WrappedComponent = React.forwardRef<unknown, T>((props, ref) => (
    <Suspense fallback={<DelayedFallback />}>
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
  
  // Add display name for better debugging
  WrappedComponent.displayName = 'LazyComponent';
  
  return WrappedComponent;
}

export default useLazyTool;
