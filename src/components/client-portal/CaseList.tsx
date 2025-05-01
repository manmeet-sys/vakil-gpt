
import React from 'react';
import { Calendar, Clock, ChevronRight, FileClock, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface ClientCase {
  id: string;
  case_title: string;
  case_number: string;
  status: string;
  court_name: string;
  filing_date?: string;
  hearing_date?: string | null;
  progress: number;
}

interface CaseListProps {
  cases: ClientCase[];
  loading: boolean;
}

const CaseList = ({ cases, loading }: CaseListProps) => {
  
  const renderCaseSkeletons = () => (
    <>
      {[1, 2].map(i => (
        <div key={i} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <Skeleton className="h-5 w-64 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-5 w-24 mt-2 md:mt-0" />
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      ))}
    </>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {renderCaseSkeletons()}
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="text-center py-12">
        <FileClock className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium">No cases found</h3>
        <p className="text-gray-500 mt-2">
          No cases have been shared in the advocate community yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cases.map(caseItem => (
        <div key={caseItem.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{caseItem.case_title || 'Untitled Case'}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {caseItem.case_number || 'No case number'} • {caseItem.court_name || 'No court assigned'}
              </p>
            </div>
            <div className="mt-2 md:mt-0 flex items-center gap-2">
              <Badge className="">
                {caseItem.status || 'Draft'}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Public
              </Badge>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Case Progress</span>
              <span>{caseItem.progress}%</span>
            </div>
            <Progress value={caseItem.progress} className="h-2" />
          </div>
          
          {(caseItem.filing_date || caseItem.hearing_date) && (
            <div className="mt-4 flex flex-col sm:flex-row gap-4 text-sm">
              {caseItem.filing_date && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-500 dark:text-gray-400">Filed: </span>
                  <span className="ml-1">{new Date(caseItem.filing_date).toLocaleDateString()}</span>
                </div>
              )}
              {caseItem.hearing_date && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-500 dark:text-gray-400">Next Hearing: </span>
                  <span className="ml-1">{new Date(caseItem.hearing_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t flex justify-between">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs"
              onClick={() => toast.info(`Case details for ${caseItem.case_title || 'this case'} will be available soon.`)}
            >
              View Case Details
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              className="text-xs"
            >
              <Users className="mr-1 h-3 w-3" />
              Discuss with Advocates
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CaseList;
