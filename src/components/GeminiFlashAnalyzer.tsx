
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Zap, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';

interface GeminiFlashAnalyzerProps {
  onAnalysisComplete: (analysis: string) => void;
}

// Mock API function - replace with actual API call in production
const generateGeminiFlashAnalysis = async (text: string): Promise<string> => {
  console.log('Generating analysis for:', text);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock response - in production, this would be the actual API call
  try {
    const mockResponse = {
      "summary": "This is a legal document discussing property rights and obligations.",
      "keyLegalConcepts": [
        "Property ownership",
        "Legal liability",
        "Contractual obligations"
      ],
      "potentialRisks": [
        "Undefined liability terms",
        "Ambiguous property boundaries",
        "Unclear remediation responsibilities"
      ],
      "recommendations": [
        "Clarify liability clauses",
        "Define property boundaries precisely",
        "Include specific remediation procedures"
      ]
    };
    
    return JSON.stringify(mockResponse, null, 2);
  } catch (error) {
    console.error('Error generating analysis:', error);
    throw new Error('Failed to generate analysis');
  }
};

const GeminiFlashAnalyzer: React.FC<GeminiFlashAnalyzerProps> = ({ 
  onAnalysisComplete 
}) => {
  const [legalText, setLegalText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showError, setShowError] = useState(false);

  const {
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['geminiAnalysis', legalText],
    queryFn: () => generateGeminiFlashAnalysis(legalText),
    enabled: false, // Don't run automatically
    retry: 1,
    meta: {
      onSuccess: (data: string) => {
        onAnalysisComplete(data);
        setIsOpen(false);
        setLegalText('');
        
        toast({
          title: "Advanced Analysis Complete",
          description: "Gemini 2.0 Flash legal analysis has been generated successfully",
        });
      },
      onError: (err: Error) => {
        console.error(`Error generating Gemini 2.0 Flash analysis:`, err);
        setShowError(true);
        
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: err.message || "Failed to generate advanced legal analysis",
        });
      },
    }
  });

  // Simulate progress during analysis
  React.useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (isFetching) {
      setAnalysisProgress(0);
      progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 150);
    } else if (analysisProgress > 0 && !isFetching) {
      // Complete the progress when done
      setAnalysisProgress(100);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isFetching, analysisProgress]);

  const generateAnalysis = async () => {
    if (!legalText.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter some legal text to analyze",
      });
      return;
    }

    setShowError(false);
    refetch();
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
      <DialogContent 
        className="sm:max-w-[600px]"
        role="dialog"
        aria-modal="true"
        aria-label="Gemini Flash Analyzer"
      >
        <DialogHeader>
          <DialogTitle>Advanced Legal Analysis with Gemini 2.0 Flash</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            Enter legal text for advanced structured analysis using Gemini 2.0 Flash. Results will be returned in JSON format.
          </p>
          <Textarea
            value={legalText}
            onChange={(e) => setLegalText(e.target.value)}
            className="min-h-[200px] resize-none"
            placeholder="Enter detailed legal text for structured analysis..."
            aria-label="Legal text for analysis"
          />
          
          {isFetching && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Analyzing text</span>
                <Progress value={analysisProgress} className="w-full h-2" aria-label="Analysis progress" />
                <span className="text-sm text-muted-foreground">{analysisProgress}%</span>
              </div>
            </>
          )}
          
          {showError && (
            <div className="p-3 border border-destructive/50 bg-destructive/10 rounded-md flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Analysis failed</p>
                <p className="text-xs text-muted-foreground mt-1">
                  There was an error processing your request. Please try again or contact support if the issue persists.
                </p>
              </div>
            </div>
          )}
          
          <Button 
            onClick={generateAnalysis} 
            disabled={isFetching || !legalText.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isFetching ? (
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
