
import React, { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface BaseAnalyzerProps {
  title: string;
  description: string;
  icon: ReactNode;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
  analysisResult?: string;
  children: ReactNode;
  useAI?: boolean;
  aiDescription?: string;
}

export const BaseAnalyzer: React.FC<BaseAnalyzerProps> = ({
  title,
  description,
  icon,
  onAnalyze,
  isAnalyzing = false,
  analysisResult = '',
  children,
  useAI = false,
  aiDescription,
}) => {
  const [aiEnhanced, setAiEnhanced] = useState(useAI);
  
  return (
    <Card className="w-full">
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
        <div className="bg-muted/30 p-4 rounded-md">
          {children}
          
          {useAI && (
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">AI-Enhanced Analysis</span>
                  <div className="h-4 w-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-xs text-blue-600">AI</span>
                  </div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={aiEnhanced} 
                    onChange={(e) => setAiEnhanced(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {aiEnhanced && aiDescription && (
                <div className="text-sm text-muted-foreground italic mb-2">
                  {aiDescription}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={onAnalyze}
            className="w-full sm:w-auto"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
        
        {analysisResult && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-md"
          >
            <div className="flex items-center bg-muted/50 p-3 border-b">
              <Search className="h-4 w-4 text-blue-600 mr-2" />
              <h3 className="text-sm font-medium">Analysis Results</h3>
            </div>
            <ScrollArea className="h-[300px] w-full p-3">
              <div className="text-sm whitespace-pre-wrap">{analysisResult}</div>
            </ScrollArea>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
