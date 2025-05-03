
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProgressiveToolLoaderProps {
  children: React.ReactNode;
  label?: string;
  priority?: boolean;
}

/**
 * A progressive loader component that improves perceived performance
 * by showing a staged loading experience
 */
export const ProgressiveToolLoader: React.FC<ProgressiveToolLoaderProps> = ({ 
  children, 
  label = 'Loading tool...',
  priority = false
}) => {
  const [loadingStage, setLoadingStage] = useState<'initial' | 'framework' | 'details' | 'complete'>('initial');
  
  useEffect(() => {
    // Simulate progressive loading stages for better perceived performance
    const timers: NodeJS.Timeout[] = [];
    
    // Only use this effect if the component is actually loading (not when it's already loaded)
    if (loadingStage === 'initial') {
      // Show framework quickly
      const frameworkTimer = setTimeout(() => {
        setLoadingStage('framework');
      }, priority ? 100 : 200);
      
      // Show details with a slight delay
      const detailsTimer = setTimeout(() => {
        setLoadingStage('details');
      }, priority ? 300 : 500);
      
      // Complete loading
      const completeTimer = setTimeout(() => {
        setLoadingStage('complete');
      }, priority ? 500 : 800);
      
      timers.push(frameworkTimer, detailsTimer, completeTimer);
    }
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [loadingStage, priority]);
  
  if (loadingStage === 'complete') {
    return <>{children}</>;
  }
  
  return (
    <div className="w-full p-4">
      {loadingStage === 'initial' && (
        <div className="flex justify-center items-center h-32">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      )}
      
      {loadingStage === 'framework' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-2/3" />
          </div>
        </div>
      )}
      
      {loadingStage === 'details' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-24 w-full" />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      )}
      
      <p className="text-center text-sm text-muted-foreground mt-4">{label}</p>
    </div>
  );
};

export default ProgressiveToolLoader;
