
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";

const PleaBargainSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Info panel skeleton */}
      <div className="mb-6 p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800/30">
        <div className="flex space-x-2">
          <Skeleton className="h-5 w-5 rounded-md" />
          <div className="w-full">
            <Skeleton className="h-5 w-44 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-3 w-24 mt-2" />
          </div>
        </div>
      </div>
      
      {/* Form skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-44 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-36 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          
          <div>
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
          
          <div>
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
          
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
          
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-4 w-36" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
          <Skeleton className="h-10 w-40" />
        </CardFooter>
      </Card>
      
      {/* Disclaimer skeleton */}
      <div className="mt-8 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex space-x-2">
          <Skeleton className="h-5 w-5 rounded-md flex-shrink-0 mt-0.5" />
          <div>
            <Skeleton className="h-5 w-44 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PleaBargainSkeleton;
