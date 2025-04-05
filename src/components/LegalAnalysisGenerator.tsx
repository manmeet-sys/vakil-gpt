
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getGeminiResponse } from './GeminiProIntegration';

// Hardcoded API keys (in a real app these would be environment variables)
const GEMINI_API_KEY = "AIzaSyCpX8FmPojP3E4dDqsmi0EtRjDKXGh9SBc";
const DEEPSEEK_API_KEY = "YOUR_DEEPSEEK_API_KEY_HERE";

interface LegalAnalysisGeneratorProps {
  apiProvider: 'deepseek' | 'gemini';
  onAnalysisComplete: (analysis: string) => void;
}

const LegalAnalysisGenerator: React.FC<LegalAnalysisGeneratorProps> = ({ 
  apiProvider,
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
      let analysis = '';
      
      if (apiProvider === 'gemini') {
        analysis = await generateGeminiAnalysis(legalText);
      } else if (apiProvider === 'deepseek') {
        analysis = await generateDeepSeekAnalysis(legalText);
      }

      onAnalysisComplete(analysis);
      setIsOpen(false);
      setLegalText('');
      
      toast({
        title: "Analysis Complete",
        description: "Legal analysis has been generated successfully",
      });
    } catch (error) {
      console.error(`Error generating analysis:`, error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to generate legal analysis",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateGeminiAnalysis = async (text: string): Promise<string> => {
    const systemPrompt = `You are VakilGPT, a legal analysis system specialized in Indian law, especially the Indian Constitution. 
    
    Analyze the provided legal text and generate a comprehensive analysis that includes:
    1. Key legal principles and concepts identified
    2. Relevant constitutional provisions
    3. Applicable case law or precedents from Indian courts
    4. Potential legal arguments or interpretations under Indian jurisprudence
    5. Practical implications or recommendations for Indian legal context
    
    Format your response with clear sections and citations where applicable. Include references to Indian statutes, landmark Supreme Court of India judgments, and High Court precedents where relevant. Provide a thorough yet concise analysis with particular attention to Indian legal nuances.`;

    const prompt = `${systemPrompt}\n\nText to analyze: ${text}`;
    return await getGeminiResponse(prompt);
  };

  const generateDeepSeekAnalysis = async (text: string): Promise<string> => {
    const systemPrompt = `You are VakilGPT, a legal analysis system specialized in Indian law, especially the Indian Constitution.
    
    Analyze the provided legal text and generate a comprehensive analysis that includes:
    1. Key legal principles and concepts identified in Indian jurisprudence
    2. Relevant constitutional provisions under the Constitution of India
    3. Applicable case law or precedents from the Supreme Court and High Courts of India
    4. Potential legal arguments or interpretations according to Indian legal standards
    5. Practical implications or recommendations specific to Indian legal and business environment
    
    Format your response with clear sections and citations where applicable. Provide a thorough yet concise analysis with references to relevant Indian statutes, regulations, and judicial pronouncements.`;
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.4,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs flex items-center gap-1 w-full sm:w-auto"
        >
          <BookOpen className="h-3 w-3" />
          Legal Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-w-[90vw] mx-auto bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 p-4">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Generate Legal Analysis</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-3">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
            Enter legal text, cases, or scenarios for detailed analysis based on Indian law.
          </p>
          <Textarea
            value={legalText}
            onChange={(e) => setLegalText(e.target.value)}
            className="min-h-[150px] sm:min-h-[200px] resize-none dark:bg-zinc-800 dark:border-zinc-700 text-sm"
            placeholder="Enter legal text or case details for analysis..."
          />
          <Button 
            onClick={generateAnalysis} 
            disabled={isGenerating || !legalText.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 text-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Analysis...
              </>
            ) : (
              'Generate Analysis'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LegalAnalysisGenerator;
