
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const AIAnalysisSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Form section skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-24" />
        </div>
        
        <Skeleton className="h-32 w-full" />
        
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
      
      {/* Analysis results skeleton */}
      <div className="border rounded-lg p-4 space-y-4">
        <Skeleton className="h-6 w-48" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <div className="pl-4 space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <div className="pl-4 space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <Skeleton className="h-5 w-28 mb-2" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisSkeleton;
