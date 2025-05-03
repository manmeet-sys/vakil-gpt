
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ResponsiveContainer } from '@/components/ui/responsive-container';

export interface PracticeAreaToolSkeletonProps {
  hasInputs?: boolean;
  hasTextArea?: boolean;
  hasMultipleInputs?: boolean;
  hasDocument?: boolean;
  hasResults?: boolean;
}

const PracticeAreaToolSkeleton: React.FC<PracticeAreaToolSkeletonProps> = ({
  hasInputs = true,
  hasTextArea = false,
  hasMultipleInputs = false,
  hasDocument = false,
  hasResults = false,
}) => {
  return (
    <ResponsiveContainer containerSize="lg">
      {/* Header skeleton */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-20" />
        </div>
        
        <div className="flex items-start space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>
      </div>
      
      {/* Main tool skeleton */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-3 w-80" />
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="bg-muted/30 p-4 rounded-md space-y-4">
            {/* Input fields */}
            {hasInputs && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-full" />
                </div>
                {hasMultipleInputs && (
                  <>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-9 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-9 w-full" />
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Text area */}
            {hasTextArea && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>
            )}
            
            {/* Document area */}
            {hasDocument && (
              <div className="border rounded-md p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-40 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            )}
            
            {/* AI toggle */}
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="h-6 w-11" />
              </div>
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Skeleton className="h-10 w-28" />
          </div>
          
          {/* Results section */}
          {hasResults && (
            <div className="border rounded-md">
              <div className="flex items-center bg-muted/50 p-3 border-b">
                <Skeleton className="h-4 w-4 mr-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="p-3 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ResponsiveContainer>
  );
};

export { PracticeAreaToolSkeleton };

// Export variations with preset configurations
export const CompanyFormationSkeleton = () => <PracticeAreaToolSkeleton hasInputs hasTextArea hasDocument />;
export const ComplianceCalendarSkeleton = () => <PracticeAreaToolSkeleton hasInputs hasMultipleInputs hasResults />;
export const ContractRiskAnalyzerSkeleton = () => <PracticeAreaToolSkeleton hasTextArea hasResults />;
export const TitleSearchSkeleton = () => <PracticeAreaToolSkeleton hasInputs hasMultipleInputs hasResults />;
export const RERAComplianceSkeleton = () => <PracticeAreaToolSkeleton hasInputs hasMultipleInputs hasResults />;
export const PropertyDocumentSkeleton = () => <PracticeAreaToolSkeleton hasInputs hasDocument />;
export const PropertyDueDiligenceSkeleton = () => <PracticeAreaToolSkeleton hasTextArea hasResults />;
export const SentencingPredictorSkeleton = () => <PracticeAreaToolSkeleton hasInputs hasMultipleInputs hasResults />;
export const PleaBargainSkeleton = () => <PracticeAreaToolSkeleton hasTextArea hasInputs hasResults />;
export const FamilyLawToolsSkeleton = () => <PracticeAreaToolSkeleton hasInputs hasTextArea hasResults />;
export const CivilLawToolsSkeleton = () => <PracticeAreaToolSkeleton hasTextArea hasResults />;
export const MatrimonialLawToolsSkeleton = () => <PracticeAreaToolSkeleton hasInputs hasTextArea hasResults />;
