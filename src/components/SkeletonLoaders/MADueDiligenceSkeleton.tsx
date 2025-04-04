
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const MADueDiligenceSkeleton = () => {
  return (
    <div className="space-y-5">
      {/* Form skeleton */}
      <div className="space-y-4 mb-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-full" />
        
        <Skeleton className="h-8 w-44 mt-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        
        <Skeleton className="h-8 w-36 mt-4" />
        <Skeleton className="h-24 w-full" />
        
        <Skeleton className="h-10 w-40 mt-6" />
      </div>
      
      {/* Results skeleton */}
      <div className="rounded-lg border p-6 mt-8">
        <Skeleton className="h-7 w-48 mb-4" />
        
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="border rounded-lg p-4">
            <Skeleton className="h-6 w-36 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MADueDiligenceSkeleton;
