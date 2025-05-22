
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PleaBargainSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
          
          <div className="space-y-2 pt-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
      
      <Skeleton className="h-40 w-full" />
    </div>
  );
};

export default PleaBargainSkeleton;
