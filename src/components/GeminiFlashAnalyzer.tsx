
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface GeminiFlashAnalyzerProps {
  apiKey: string;
  onAnalysisComplete: (analysis: string) => void;
}

const GeminiFlashAnalyzer: React.FC<GeminiFlashAnalyzerProps> = ({ 
  apiKey, 
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

    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: "Please set your Gemini API key first",
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
    // Using the Gemini 2.0 Flash model as specified in your Python script
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { 
            role: "user", 
            parts: [{ text }] 
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8000,
          topK: 40,
          topP: 0.95,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
      const responseText = data.candidates[0].content.parts[0].text;
      try {
        // Try to parse JSON response
        const jsonData = JSON.parse(responseText);
        return JSON.stringify(jsonData, null, 2);
      } catch (e) {
        // If not valid JSON, return as is
        return responseText;
      }
    } else {
      throw new Error('Invalid response format from Gemini API');
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
