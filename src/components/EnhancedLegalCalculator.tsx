
import React from 'react';
import LegalCalculator from './LegalCalculator';
import ToolErrorBoundary from '@/components/practice-area-tools/shared/ToolErrorBoundary';
import FeedbackDialog from '@/components/feedback/FeedbackDialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, Download, History } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserData } from '@/context/UserDataContext';
import { motion } from 'framer-motion';
import { usePerformanceTracking } from '@/utils/performance-monitoring';

/**
 * Enhanced wrapper for Legal Calculator tool with error handling, feedback, and data management
 */
const EnhancedLegalCalculator: React.FC = () => {
  // Track component performance
  usePerformanceTracking('EnhancedLegalCalculator');
  
  // Get user data functions
  const { getToolHistory, exportData } = useUserData();
  
  const toolHistory = getToolHistory('calculator');
  
  const handleExportHistory = () => {
    if (toolHistory.length > 0) {
      exportData(toolHistory, `calculator-history-${Date.now()}`, 'json');
    }
  };
  
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
        
        {toolHistory.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleExportHistory} className="text-muted-foreground">
                  <Download className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export calculation history</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
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
    </motion.div>
  );
};

export default EnhancedLegalCalculator;
