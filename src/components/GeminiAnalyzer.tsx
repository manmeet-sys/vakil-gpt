
import React, { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { getOpenAIResponse } from './OpenAIIntegration';
import { getGeminiResponse } from './GeminiProIntegration';
import ErrorMessage from './ui/error-message';
import { Skeleton } from './ui/skeleton';

interface GeminiAnalyzerProps {
  documentText?: string;
  analysisType: 'legal' | 'risk' | 'contract' | 'case-outcome' | 'compliance';
  onAnalysisComplete?: (analysis: any) => void;
  disableButton?: boolean;
}

const promptTemplates = {
  'legal': `Analyze the following legal document and provide insights:
  - Key legal issues identified
  - Relevant statutes and precedents
  - Potential arguments and counterarguments
  
  Format the response as JSON with keys: "issues", "statutes", "precedents", "arguments".
  Document: {{document}}`,
  
  'risk': `Perform a risk assessment on the following legal document:
  - Identify potential legal risks
  - Rate each risk (high/medium/low)
  - Suggest mitigation strategies
  
  Format the response as JSON with keys: "risks", "ratings", "mitigations".
  Document: {{document}}`,
  
  'contract': `Analyze the following contract:
  - Identify key clauses and obligations
  - Flag potential issues or ambiguities
  - Suggest improvements
  
  Format the response as JSON with keys: "clauses", "issues", "improvements".
  Document: {{document}}`,
  
  'case-outcome': `Predict the potential outcome of the following case:
  - Estimate likelihood of success
  - Identify strengths and weaknesses
  - Suggest strategies to improve outcome
  
  Format the response as JSON with keys: "outcome", "probability", "strengths", "weaknesses", "strategies".
  Document: {{document}}`,
  
  'compliance': `Assess compliance of the following document with Indian legal requirements:
  - Identify applicable regulatory frameworks
  - Check compliance with relevant laws
  - Suggest corrections for non-compliant elements
  
  Format the response as JSON with keys: "regulations", "compliance_status", "corrections".
  Document: {{document}}`
};

const analysisTypeLabels = {
  'legal': 'Legal Analysis',
  'risk': 'Risk Assessment',
  'contract': 'Contract Analysis',
  'case-outcome': 'Case Outcome Prediction',
  'compliance': 'Compliance Check'
};

const GeminiAnalyzer: React.FC<GeminiAnalyzerProps> = ({ 
  documentText = '',
  analysisType,
  onAnalysisComplete,
  disableButton = false
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const runAnalysis = async () => {
    // Check if document text is provided
    if (!documentText.trim()) {
      setError("No document text provided for analysis");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Check for API key
      const apiProvider = localStorage.getItem('preferredApiProvider') as 'openai' | 'deepseek' | 'gemini' || 'openai';
      const apiKey = localStorage.getItem(`${apiProvider}ApiKey`) || '';
      
      if (!apiKey) {
        toast.error(
          "API key required", 
          { 
            description: `Please set your ${apiProvider.charAt(0).toUpperCase() + apiProvider.slice(1)} API key in AI Settings.`,
            action: {
              label: "Settings",
              onClick: () => window.location.href = "/settings?tab=ai"
            }
          }
        );
        setIsAnalyzing(false);
        return;
      }
      
      // Prepare the prompt
      let prompt = promptTemplates[analysisType].replace('{{document}}', documentText);
      
      // Get the analysis from the selected API provider
      let analysis;
      if (apiProvider === 'openai') {
        analysis = await getOpenAIResponse(prompt, apiKey);
      } else {
        analysis = await getGeminiResponse(prompt, apiKey);
      }
      
      // Try to parse the response as JSON
      let parsedAnalysis;
      try {
        parsedAnalysis = JSON.parse(analysis);
      } catch (e) {
        console.warn("AI did not return valid JSON. Using raw response.");
        parsedAnalysis = { raw: analysis };
      }
      
      // Call the onAnalysisComplete callback with the analysis
      if (onAnalysisComplete) {
        onAnalysisComplete(parsedAnalysis);
      }
      
      toast.success(`${analysisTypeLabels[analysisType]} complete`, {
        description: "Enhanced insights have been applied"
      });
      
    } catch (error) {
      console.error("Error in AI Analyzer:", error);
      setError(error instanceof Error 
        ? error.message 
        : "An error occurred during analysis. Please check your API key.");
      
      toast.error("Analysis failed", { 
        description: error instanceof Error 
          ? error.message 
          : "An error occurred during analysis."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Card className="border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          {analysisTypeLabels[analysisType]}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Use {analysisType === 'legal' ? 'Gemini' : 'AI'} to analyze this document and generate detailed insights.
        </p>
        
        {error && (
          <div className="mt-2">
            <ErrorMessage 
              message={error} 
              onDismiss={() => setError(null)} 
              severity="error" 
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={runAnalysis}
          disabled={isAnalyzing || disableButton}
          className="w-full flex items-center justify-center gap-2"
          variant={isAnalyzing ? "outline" : "default"}
        >
          {isAnalyzing ? (
            <>
              <Skeleton className="h-4 w-4 rounded-full animate-pulse" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Run AI Analysis</span>
            </>
          )}
        </Button>
      </CardFooter>
      
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
          >
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-1">
              {/* Settings content would go here */}
              <p className="text-sm text-gray-500">Advanced settings will be available soon.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default GeminiAnalyzer;
