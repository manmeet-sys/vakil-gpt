
import React, { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface AnalysisResult {
  status?: string;
  data?: any;
  title?: string;
  description?: string;
  severity?: 'high' | 'medium' | 'low' | 'info';
  summary?: string;
}

interface BaseAnalyzerProps {
  title: string;
  description: string;
  icon: ReactNode;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
  analysisResult?: AnalysisResult | null;
  analysisResults?: AnalysisResult[];
  children: ReactNode;
  buttonText?: string;
  className?: string;
  useAI?: boolean; // Flag for AI-enhanced analysis
  aiDescription?: string; // Description of AI features
}

export const BaseAnalyzer: React.FC<BaseAnalyzerProps> = ({
  title,
  description,
  icon,
  onAnalyze,
  isAnalyzing = false,
  analysisResult = null,
  analysisResults = [], // Default to empty array
  children,
  buttonText = "Analyze",
  className = "",
  useAI = false,
  aiDescription = "Enhanced analysis with AI capabilities",
}) => {
  const [aiEnabled, setAiEnabled] = useState(useAI);
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10';
      case 'medium':
        return 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10';
      case 'low':
        return 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10';
      default:
        return 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10';
    }
  };

  return (
    <Card className={`w-full shadow-sm border border-gray-200/80 dark:border-gray-800/80 ${className}`}>
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
        <div className="bg-muted/30 p-4 rounded-md border border-muted/30">
          {children}
          
          {useAI && (
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <Label htmlFor="ai-toggle" className="text-sm font-medium">AI-Enhanced Analysis</Label>
                </div>
                <Switch 
                  id="ai-toggle" 
                  checked={aiEnabled}
                  onCheckedChange={setAiEnabled}
                />
              </div>
              {aiEnabled && (
                <p className="text-xs text-muted-foreground mt-2">
                  {aiDescription}
                </p>
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
            {isAnalyzing ? "Analyzing..." : buttonText}
            {aiEnabled && useAI && <Sparkles className="ml-2 h-4 w-4" />}
          </Button>
        </div>
        
        {analysisResults && analysisResults.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h3 className="text-base font-medium font-playfair">Analysis Results</h3>
            <div className="space-y-3">
              {analysisResults.map((result, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 border-l-4 rounded-r-md ${getSeverityColor(result.severity || 'info')}`}
                >
                  <div className="flex gap-2 items-start">
                    {getSeverityIcon(result.severity || 'info')}
                    <div>
                      <h4 className="font-medium font-playfair text-sm">{result.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
                      {result.data && (
                        <div className="mt-2 text-sm border-t pt-2 border-dashed border-gray-200">
                          <pre className="text-xs whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-900 p-2 rounded">
                            {typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {analysisResult && !analysisResults?.length && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h3 className="text-base font-medium font-playfair">Analysis Result</h3>
            <div className="space-y-3">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 border-l-4 rounded-r-md ${getSeverityColor(analysisResult.severity || 'info')}`}
              >
                <div className="flex gap-2 items-start">
                  {getSeverityIcon(analysisResult.severity || 'info')}
                  <div>
                    <h4 className="font-medium font-playfair text-sm">{analysisResult.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{analysisResult.description}</p>
                    {analysisResult.summary && (
                      <p className="mt-2 text-sm border-t pt-2 border-dashed border-gray-200">{analysisResult.summary}</p>
                    )}
                    {analysisResult.data && (
                      <div className="mt-2 text-sm border-t pt-2 border-dashed border-gray-200">
                        <pre className="text-xs whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-900 p-2 rounded">
                          {typeof analysisResult.data === 'string' ? analysisResult.data : JSON.stringify(analysisResult.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
