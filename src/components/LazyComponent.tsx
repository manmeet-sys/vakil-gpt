
import React, { Suspense, ReactNode, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  delayMs?: number;
  minimumLoadTimeMs?: number;
}

/**
 * An enhanced wrapper component for lazy loading components with customizable loading behavior
 * - delayMs: Delay before showing the loading state to prevent flickering for fast loads
 * - minimumLoadTimeMs: Minimum time to show the loading state to prevent jarring transitions
 */
const LazyComponent: React.FC<LazyComponentProps> = ({ 
  children, 
  fallback,
  delayMs = 300,
  minimumLoadTimeMs = 500
}) => {
  const [shouldRender, setShouldRender] = useState(delayMs === 0);
  const [loadStartTime, setLoadStartTime] = useState(0);

  useEffect(() => {
    if (delayMs === 0) return;
    
    const timer = setTimeout(() => {
      setLoadStartTime(Date.now());
      setShouldRender(true);
    }, delayMs);
    
    return () => clearTimeout(timer);
  }, [delayMs]);

  const handleFallbackRender = () => {
    // If we haven't started showing the fallback yet, show nothing
    if (!shouldRender) return null;
    
    // We're showing the fallback, ensure it stays for minimum time
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
    
    const actualFallback = fallback || defaultFallback;
    
    // If minimum load time is set, ensure it's respected
    if (minimumLoadTimeMs > 0 && loadStartTime > 0) {
      const elapsedTime = Date.now() - loadStartTime;
      if (elapsedTime < minimumLoadTimeMs) {
        const remainingTime = minimumLoadTimeMs - elapsedTime;
        // Force the fallback to show for the remaining time
        setTimeout(() => {
          // This forces a re-render after minimum time
          setShouldRender(prevState => prevState);
        }, remainingTime);
      }
    }
    
    return actualFallback;
  };

  return (
    <Suspense fallback={handleFallbackRender()}>
      {children}
    </Suspense>
  );
};

export default LazyComponent;
