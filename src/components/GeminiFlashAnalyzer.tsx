
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getGeminiResponse } from './GeminiProIntegration';
import { toast } from 'sonner';

interface GeminiFlashAnalyzerProps {
  onAnalysisComplete?: (analysis: string) => void;
}

const GeminiFlashAnalyzer: React.FC<GeminiFlashAnalyzerProps> = ({ 
  onAnalysisComplete 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const runFlashAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Check for API key
      const apiProvider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
      const apiKey = localStorage.getItem(`${apiProvider}ApiKey`) || '';
      
      if (!apiKey) {
        toast.error(
          "API key required", 
          { 
            description: `Please set your ${apiProvider.charAt(0).toUpperCase() + apiProvider.slice(1)} API key in AI Settings.` 
          }
        );
        setIsAnalyzing(false);
        return;
      }
      
      // In a real implementation, this would use relevant data from the current context
      // For now, we'll generate a mock analysis
      const prompt = `You are a legal analysis system. Generate a detailed analysis of a contract dispute case between two technology companies regarding intellectual property rights. Include relevant Indian laws and precedents.

Format the response as JSON with the following structure:
{
  "summary": "Brief summary of the analysis",
  "key_points": ["Key point 1", "Key point 2", ...],
  "legal_framework": {
    "applicable_laws": ["Law 1", "Law 2", ...],
    "relevant_precedents": ["Precedent 1", "Precedent 2", ...]
  },
  "risk_assessment": {
    "major_risks": ["Risk 1", "Risk 2", ...],
    "mitigation_strategies": ["Strategy 1", "Strategy 2", ...]
  },
  "recommendations": ["Recommendation 1", "Recommendation 2", ...]
}`;

      const analysis = await getGeminiResponse(prompt, apiKey);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(analysis);
      }
      
      toast.success("Flash analysis complete", {
        description: "Enhanced insights have been applied to the prediction"
      });
      
    } catch (error) {
      console.error("Error in GeminiFlashAnalyzer:", error);
      toast.error(
        "Analysis failed", 
        { 
          description: error instanceof Error 
            ? error.message 
            : "An error occurred during analysis. Please check your API key."
        }
      );
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={runFlashAnalysis}
            disabled={isAnalyzing}
            className={`inline-flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white 
              transition-all hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-300 
              ${isAnalyzing ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
            aria-label="Run Gemini Flash Analysis"
          >
            <Sparkles className="h-3 w-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Run Gemini Flash Analysis</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default GeminiFlashAnalyzer;
