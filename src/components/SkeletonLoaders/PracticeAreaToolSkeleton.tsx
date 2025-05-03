
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface PracticeAreaToolSkeletonProps {
  hasInputs?: boolean;
  hasTextArea?: boolean;
  hasMultipleInputs?: boolean;
  hasDocument?: boolean;
  hasResults?: boolean;
}

/**
 * Performance-optimized skeleton loader for practice area tools
 * Uses will-change and translateZ for hardware acceleration
 */
export const PracticeAreaToolSkeleton: React.FC<PracticeAreaToolSkeletonProps> = ({
  hasInputs = true,
  hasTextArea = false,
  hasMultipleInputs = false,
  hasDocument = false,
  hasResults = false,
}) => {
  return (
    <div className="space-y-6 w-full px-4 sm:px-6 md:px-8 py-6" style={{ willChange: 'opacity', transform: 'translateZ(0)' }}>
      {/* Header */}
      <div className="flex items-start space-x-4">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="space-y-2 flex-grow">
          <Skeleton className="h-7 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-4/5 rounded-md" />
        </div>
      </div>

      {/* Content area */}
      <div className="space-y-4">
        {hasInputs && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        )}

        {hasMultipleInputs && (
          <>
            <div className="space-y-2">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </>
        )}

        {hasTextArea && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-28 w-full rounded-md" />
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-end space-x-2 pt-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>

      {/* Results area */}
      {hasResults && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-11/12 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>
        </div>
      )}

      {/* Document preview */}
      {hasDocument && (
        <div className="space-y-3 pt-4 border-t">
          <Skeleton className="h-5 w-40 rounded-md" />
          <div className="h-64 w-full border border-gray-200 dark:border-gray-800 rounded-md p-4 space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <div className="pt-2" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
};

export {
  PracticeAreaToolSkeleton as SentencingPredictorSkeleton,
  PracticeAreaToolSkeleton as PleaBargainSkeleton,
};

export default PracticeAreaToolSkeleton;
