
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const SentencingPredictorSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Form skeleton */}
      <div className="space-y-4 mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-32 mt-4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-32 mt-4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-36 mt-6" />
      </div>
      
      {/* Results skeleton */}
      <div className="rounded-lg border p-6 mt-6">
        <Skeleton className="h-7 w-48 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 border rounded-lg">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-20" />
          </div>
          <div className="p-4 border rounded-lg">
            <Skeleton className="h-6 w-28 mb-2" />
            <Skeleton className="h-10 w-20" />
          </div>
          <div className="p-4 border rounded-lg">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentencingPredictorSkeleton;
