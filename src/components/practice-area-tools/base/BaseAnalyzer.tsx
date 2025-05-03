
import React, { ReactNode, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResultsDisplay } from '../shared/ResultsDisplay';
import { AIToggle } from '../shared/FormComponents';
import { useIsMobile } from '@/hooks/use-mobile';

export interface AnalysisResult {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low' | 'info';
}

export interface BaseAnalyzerProps {
  title: string;
  description: string;
  icon: ReactNode;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
  analysisResult?: string;
  analysisResults?: AnalysisResult[];
  children: ReactNode;
  useAI?: boolean;
  aiDescription?: string;
  className?: string;
  isLoading?: boolean;
  onExportResults?: () => void;
  onPrintResults?: () => void;
  onClearResults?: () => void;
  resultTitle?: string;
}

export const BaseAnalyzer: React.FC<BaseAnalyzerProps> = ({
  title,
  description,
  icon,
  onAnalyze,
  isAnalyzing = false,
  analysisResult = '',
  analysisResults = [],
  children,
  useAI = false,
  aiDescription,
  className = '',
  isLoading = false,
  onExportResults,
  onPrintResults,
  onClearResults,
  resultTitle = 'Analysis Results'
}) => {
  const [aiEnhanced, setAiEnhanced] = useState(useAI);
  const isMobile = useIsMobile();
  
  // Reset loading state when component unmounts
  useEffect(() => {
    return () => {
      if (onClearResults) {
        onClearResults();
      }
    };
  }, [onClearResults]);

  const hasResults = analysisResult || analysisResults.length > 0;
  
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <CardTitle className="text-lg font-playfair">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <motion.div 
          className="bg-muted/30 p-4 rounded-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
          
          {useAI && (
            <AIToggle 
              enabled={aiEnhanced}
              setEnabled={setAiEnhanced}
              description={aiDescription}
            />
          )}
        </motion.div>
        
        <div className={`flex ${isMobile ? 'flex-col' : 'justify-end'} ${isMobile && hasResults ? 'space-y-4' : ''}`}>
          {isMobile && hasResults && onClearResults && (
            <Button 
              variant="outline" 
              onClick={onClearResults}
              className="w-full"
              disabled={isAnalyzing}
            >
              Clear Results
            </Button>
          )}
          
          <Button 
            onClick={onAnalyze}
            className={`${isMobile ? 'w-full' : 'w-auto'}`}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
        
        {/* Use the shared ResultsDisplay component */}
        {(analysisResult || analysisResults.length > 0 || isAnalyzing) && (
          <ResultsDisplay 
            title={resultTitle}
            textResult={analysisResult}
            structuredResults={analysisResults}
            isLoading={isAnalyzing || isLoading}
            onExport={onExportResults}
            onPrint={onPrintResults}
            onClear={onClearResults}
          />
        )}
      </CardContent>
    </Card>
  );
};
