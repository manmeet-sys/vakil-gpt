
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getOpenAIResponse } from './OpenAIIntegration';
import { toast } from 'sonner';

interface OpenAIFlashAnalyzerProps {
  onAnalysisComplete?: (analysis: string) => void;
}

const OpenAIFlashAnalyzer: React.FC<OpenAIFlashAnalyzerProps> = ({ 
  onAnalysisComplete 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const runFlashAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Check for API key
      const apiKey = localStorage.getItem('openaiApiKey') || '';
      
      if (!apiKey) {
        toast.error(
          "API key required", 
          { 
            description: "Please set your OpenAI API key in AI Settings." 
          }
        );
        setIsAnalyzing(false);
        return;
      }
      
      // Generate a mock analysis for demonstration
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

      const analysis = await getOpenAIResponse(prompt);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(analysis);
      }
      
      toast.success("Flash analysis complete", {
        description: "Enhanced insights have been applied to the prediction"
      });
      
    } catch (error) {
      console.error("Error in OpenAIFlashAnalyzer:", error);
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
            aria-label="Run OpenAI Flash Analysis"
            aria-busy={isAnalyzing}
            className={`inline-flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white 
              transition-all hover:from-green-600 hover:to-emerald-700 focus:ring-2 focus:ring-green-300 focus-visible:outline-none
              ${isAnalyzing ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
          >
            <Sparkles className="h-3 w-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Run OpenAI Flash Analysis</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default OpenAIFlashAnalyzer;
