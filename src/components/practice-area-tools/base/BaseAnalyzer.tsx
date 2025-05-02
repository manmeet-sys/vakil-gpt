
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, FileSearch } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export interface AnalysisResult {
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high' | 'info';
}

export interface BaseAnalyzerProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onAnalyze?: () => void;
  analysisResults?: AnalysisResult[] | React.ReactNode;
  footerContent?: React.ReactNode;
}

const BaseAnalyzer: React.FC<BaseAnalyzerProps> = ({
  title,
  description,
  icon = <FileSearch className="h-5 w-5" />,
  children,
  onAnalyze,
  analysisResults,
  footerContent
}) => {
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleAnalyze = async () => {
    setLoading(true);
    
    try {
      if (onAnalyze) {
        await onAnalyze();
      }
      
      // Simulating analysis time
      setTimeout(() => {
        setShowResults(true);
        setLoading(false);
        toast.success("Analysis completed successfully!");
      }, 1000);
    } catch (error) {
      setLoading(false);
      toast.error("Analysis failed. Please try again.");
    }
  };
  
  const getSeverityColor = (severity?: 'low' | 'medium' | 'high' | 'info') => {
    switch (severity) {
      case 'low': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'medium': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'info':
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };
  
  const renderResults = () => {
    if (!analysisResults) return null;
    
    if (Array.isArray(analysisResults)) {
      return (
        <div className="space-y-3">
          {analysisResults.map((result, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(result.severity)}`}>
                  {result.severity || 'info'}
                </span>
                <h4 className="font-medium">{result.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{result.description}</p>
            </div>
          ))}
        </div>
      );
    }
    
    return analysisResults;
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {children}
        </div>
        
        {showResults && analysisResults && (
          <>
            <Separator className="my-4" />
            <div className="rounded-lg bg-muted/50 p-4">
              <h3 className="font-medium mb-3">Analysis Results</h3>
              {renderResults()}
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="default"
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" /> 
              Analyze
            </>
          )}
        </Button>
        
        {footerContent}
      </CardFooter>
    </Card>
  );
};

export default BaseAnalyzer;
