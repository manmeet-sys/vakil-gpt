
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { toast } from 'sonner';
import { getOpenAIResponse } from './OpenAIIntegration';

interface OpenAIFlashAnalyzerProps {
  onAnalysisComplete: (analysis: string) => void;
}

const OpenAIFlashAnalyzer: React.FC<OpenAIFlashAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const handleClick = async () => {
    setIsAnalyzing(true);
    
    try {
      // This is a simplified version that would typically analyze content from context
      // In a real implementation, you'd likely want to analyze relevant content from the component's parent
      const analysis = await getOpenAIResponse(
        "Provide a brief analysis of potential approaches to this legal case."
      );
      
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
