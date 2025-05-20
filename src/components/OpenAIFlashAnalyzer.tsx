
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { toast } from 'sonner';
import { generateOpenAIAnalysis } from '@/utils/aiAnalysis';

interface OpenAIFlashAnalyzerProps {
  onAnalysisComplete: (analysis: string) => void;
  text?: string;
  context?: string;
}

const OpenAIFlashAnalyzer: React.FC<OpenAIFlashAnalyzerProps> = ({ 
  onAnalysisComplete,
  text = "",
  context = ""
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleClick = async () => {
    setIsAnalyzing(true);
    
    try {
      const contentToAnalyze = text || "Provide a brief analysis of this legal case.";
      const contextInfo = context || "Legal Analysis";
      
      const analysis = await generateOpenAIAnalysis(contentToAnalyze, contextInfo);
      
      onAnalysisComplete(analysis);
      toast.success("Enhanced analysis applied");
    } catch (error) {
      console.error('Error in flash analysis:', error);
      toast.error("Failed to generate enhanced analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 rounded-full"
      onClick={handleClick}
      disabled={isAnalyzing}
      title="Get enhanced AI analysis"
    >
      <Zap 
        className={`h-4 w-4 ${isAnalyzing 
          ? 'animate-pulse text-yellow-500' 
          : 'text-muted-foreground'}`} 
      />
    </Button>
  );
};

export default OpenAIFlashAnalyzer;
