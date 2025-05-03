
import React from 'react';
import LegalCalculator from './LegalCalculator';
import ToolErrorBoundary from '@/components/practice-area-tools/shared/ToolErrorBoundary';
import FeedbackDialog from '@/components/feedback/FeedbackDialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Enhanced wrapper for Legal Calculator tool with error handling and feedback
 */
const EnhancedLegalCalculator: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute top-0 right-0 flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Calculate court fees and legal interest based on Indian legal standards.
                All calculations are based on applicable rates under Indian law.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <FeedbackDialog 
          toolName="Legal Calculator" 
          placement="inline" 
          variant="suggestion"
          trigger={
            <Button variant="outline" size="sm">
              Suggest Improvement
            </Button>
          }
        />
      </div>
      
      <div className="pb-6">
        <ToolErrorBoundary toolName="Legal Calculator">
          <LegalCalculator />
        </ToolErrorBoundary>
      </div>
    </div>
  );
};

export default EnhancedLegalCalculator;
