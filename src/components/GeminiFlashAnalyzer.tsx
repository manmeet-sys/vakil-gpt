
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getGeminiResponse } from './GeminiProIntegration';

interface GeminiFlashAnalyzerProps {
  onAnalysisComplete: (analysis: string) => void;
}

const GeminiFlashAnalyzer: React.FC<GeminiFlashAnalyzerProps> = ({ 
  onAnalysisComplete 
}) => {
  const [legalText, setLegalText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const generateAnalysis = async () => {
    if (!legalText.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter some legal text to analyze",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const analysis = await generateGeminiFlashAnalysis(legalText);
      
      onAnalysisComplete(analysis);
      setIsOpen(false);
      setLegalText('');
      
      toast({
        title: "Advanced Analysis Complete",
        description: "Gemini 2.0 Flash legal analysis has been generated successfully",
      });
    } catch (error) {
      console.error(`Error generating Gemini 2.0 Flash analysis:`, error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to generate advanced legal analysis",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateGeminiFlashAnalysis = async (text: string): Promise<string> => {
    const systemPrompt = `You are PrecedentAI, a legal analysis system specialized in Indian law.
    
    Analyze the provided legal text and generate a comprehensive structured analysis in JSON format that includes:
    1. A summary of the document or text
    2. Key legal concepts identified
    3. Potential legal risks and implications
    4. Recommendations
    
    The response should be formatted as valid JSON with these sections.`;
    
    const prompt = `${systemPrompt}\n\nText to analyze: ${text}`;
    
    // Use the standard Gemini response function for the analysis
    const response = await getGeminiResponse(prompt);
    
    try {
      // Try to parse JSON response
      JSON.parse(response);
      return response;
    } catch (e) {
      // If not valid JSON, return as is
      return response;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs flex items-center gap-1 ml-2"
        >
          <Zap className="h-3 w-3" />
          Gemini Flash
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle>Advanced Legal Analysis with Gemini 2.0 Flash</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter legal text for advanced structured analysis using Gemini 2.0 Flash. Results will be returned in JSON format.
          </p>
          <Textarea
            value={legalText}
            onChange={(e) => setLegalText(e.target.value)}
            className="min-h-[200px] resize-none dark:bg-zinc-800 dark:border-zinc-700"
            placeholder="Enter detailed legal text for structured analysis..."
          />
          <Button 
            onClick={generateAnalysis} 
            disabled={isGenerating || !legalText.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Advanced Analysis...
              </>
            ) : (
              'Generate JSON Analysis'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeminiFlashAnalyzer;
