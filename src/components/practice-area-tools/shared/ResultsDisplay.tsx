
import React from 'react';
import { motion } from 'framer-motion';
import { Search, AlertCircle, Info, CheckCircle, Download, Save } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { type AnalysisResult } from '@/components/practice-area-tools/base';
import { toast } from 'sonner';
import { useUserData } from '@/context/UserDataContext';

interface ResultsDisplayProps {
  title?: string;
  textResult?: string;
  structuredResults?: AnalysisResult[];
  isLoading?: boolean;
  onExport?: () => void;
  onPrint?: () => void;
  onClear?: () => void;
  exportLabel?: string;
  className?: string;
  toolType?: string;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  title = 'Analysis Results',
  textResult,
  structuredResults,
  isLoading = false,
  onExport,
  onPrint,
  onClear,
  exportLabel = 'Export',
  className = '',
  toolType = 'analysis',
}) => {
  // Get user data context
  const { saveToolResult, exportData } = useUserData();

  // Save the current results
  const handleSaveResults = () => {
    try {
      const dataToSave = {
        title,
        timestamp: new Date().toISOString(),
        textResult,
        structuredResults
      };
      
      saveToolResult(title, toolType, dataToSave)
        .then(() => toast.success('Results saved successfully'))
        .catch(() => toast.error('Failed to save results'));
    } catch (error) {
      console.error('Error saving results:', error);
      toast.error('Failed to save results');
    }
  };
  
  // Handle export results
  const handleExportResults = () => {
    if (onExport) {
      onExport();
      return;
    }
    
    try {
      const dataToExport = {
        title,
        timestamp: new Date().toISOString(),
        textResult,
        structuredResults
      };
      
      exportData(dataToExport, `${toolType}-results-${Date.now()}`, 'json');
    } catch (error) {
      console.error('Error exporting results:', error);
      toast.error('Failed to export results');
    }
  };

  if (isLoading) {
    return (
      <Card className={`border shadow-sm ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Search className="h-4 w-4 mr-2 text-blue-600" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="typing-indicator inline-flex">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Processing analysis...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No results yet
  if (!textResult && (!structuredResults || structuredResults.length === 0)) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border rounded-md shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between bg-muted/50 p-3 border-b">
        <div className="flex items-center">
          <Search className="h-4 w-4 text-blue-600 mr-2" />
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSaveResults}
            className="h-7 text-xs"
          >
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportResults}
            className="h-7 text-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            {exportLabel}
          </Button>
          
          {onPrint && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onPrint}
              className="h-7 text-xs"
            >
              Print
            </Button>
          )}
          
          {onClear && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClear}
              className="h-7 text-xs"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="h-[300px] w-full p-3">
        {/* Display single text result */}
        {textResult && (
          <div className="text-sm whitespace-pre-wrap">
            {textResult}
          </div>
        )}

        {/* Display structured results */}
        {structuredResults && structuredResults.length > 0 && (
          <div className="space-y-4">
            {structuredResults.map((result, index) => {
              // Determine severity styling
              let SeverityIcon = Info;
              let severityColor = "bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-800/20";
              let severityTextColor = "text-blue-700 dark:text-blue-400";
              
              if (result.severity === "high") {
                SeverityIcon = AlertCircle;
                severityColor = "bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-800/20";
                severityTextColor = "text-red-700 dark:text-red-400";
              } else if (result.severity === "medium") {
                SeverityIcon = AlertCircle;
                severityColor = "bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-800/20";
                severityTextColor = "text-amber-700 dark:text-amber-400";
              } else if (result.severity === "low") {
                SeverityIcon = CheckCircle;
                severityColor = "bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-800/20";
                severityTextColor = "text-green-700 dark:text-green-400";
              }
              
              return (
                <Alert key={index} className={`p-3 border ${severityColor}`} variant="default">
                  <SeverityIcon className={`h-4 w-4 ${severityTextColor}`} />
                  <AlertTitle className={`text-sm font-medium mb-1 ${severityTextColor}`}>
                    {result.title}
                  </AlertTitle>
                  <AlertDescription className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {result.description}
                  </AlertDescription>
                </Alert>
              );
            })}
          </div>
        )}
      </ScrollArea>
      
      <CardFooter className="py-2 px-3 border-t bg-muted/20 flex justify-end">
        <p className="text-xs text-muted-foreground">
          {new Date().toLocaleString()}
        </p>
      </CardFooter>
    </motion.div>
  );
};

export default ResultsDisplay;
