
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const CompanyFormationSkeleton: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Form skeleton */}
      <div className="space-y-4 mb-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-full" />
        
        <Skeleton className="h-8 w-44 mt-4" />
        <Skeleton className="h-10 w-full" />
        
        <Skeleton className="h-8 w-36 mt-4" />
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
    </div>
  );
};

export const MADueDiligenceSkeleton: React.FC = () => {
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
      
      {/* Checklist categories skeleton */}
      <div className="space-y-3 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ComplianceCalendarSkeleton: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Form skeleton */}
      <div className="space-y-4 mb-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-10 w-full mt-1" />
          </div>
          <div>
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-10 w-full mt-1" />
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <Skeleton className="h-6 w-32 mb-3" />
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <Skeleton className="h-6 w-40 mb-3" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </div>
        
        <Skeleton className="h-10 w-40 mt-6" />
      </div>
    </div>
  );
};

export const ContractRiskAnalyzerSkeleton: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Form skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-10 w-full mt-1" />
        </div>
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-full mt-1" />
        </div>
      </div>
      
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-full mt-1" />
      </div>
      
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-60 w-full mt-1" />
      </div>
      
      <div className="border rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
      
      <Skeleton className="h-10 w-40 mt-4" />
      
      {/* Analysis results skeleton */}
      <div className="border rounded-lg p-4 mt-8">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-full rounded-full" />
        </div>
        
        <div className="mt-6">
          <Skeleton className="h-6 w-40 mb-3" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
