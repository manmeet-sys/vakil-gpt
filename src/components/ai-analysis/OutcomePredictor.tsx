import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Scale, FileText, AlertCircle, HelpCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import OpenAIFlashAnalyzer from '@/components/OpenAIFlashAnalyzer';
import LazyComponent from '@/components/LazyComponent';
import AIAnalysisSkeleton from '../SkeletonLoaders/AIAnalysisSkeleton';
import { design } from '@/lib/design-system';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import InfoCard from '../ui/info-card';
import ErrorMessage from '../ui/error-message';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';
import { useNavigate } from 'react-router-dom';

const OutcomePredictor = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [caseDetail, setCaseDetail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<null | any>(null);
  const [openAiAnalysis, setOpenAiAnalysis] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error states at the beginning of submission
    setError(null);
    setApiKeyError(null);
    
    if (!caseDetail.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide case details for analysis"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { primaryApiKey } = {
        primaryApiKey: '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'
      };
      
      // Create a prompt for the AI
      const prompt = `You are an AI legal assistant specializing in Indian law. Analyze the following case details and predict the likely outcome based on Indian legal precedents and statutes.
      
Case details:
${caseDetail}

Provide your analysis in JSON format with the following structure:
{
  "prediction": "Brief outcome prediction (1-2 sentences)",
  "confidence": [Number between 0-100 representing confidence level],
  "relevantCases": ["Case citation 1", "Case citation 2", "Case citation 3"],
  "analysis": "Detailed analysis explaining the prediction (2-3 paragraphs)"
}`;
      
      // Make the API call
      const responseText = await getOpenAIResponse(prompt, primaryApiKey);
      
      // Parse the JSON response
      let jsonResponse;
      try {
        // Find JSON content in the response (in case the AI wraps it in markdown code blocks)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : responseText;
        jsonResponse = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        throw new Error("Failed to parse AI response. Please try again.");
      }
      
      // Set the result
      setResult(jsonResponse);
      
      // Hide onboarding message after successful analysis
      setShowOnboarding(false);
      
      toast({
        title: "Analysis Complete",
        description: "Case outcome prediction generated successfully"
      });
    } catch (error) {
      console.error("Error predicting outcome:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "Failed to analyze case details. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenAiAnalysis = (analysis: string) => {
    setOpenAiAnalysis(analysis);
    
    try {
      // Update our regular prediction with enhanced OpenAI results
      toast({
        title: "Enhanced Analysis Applied",
        description: "OpenAI insights have been incorporated into your prediction"
      });
    } catch (e) {
      console.error("Error parsing OpenAI analysis:", e);
      toast({
        variant: "destructive",
        title: "Analysis Processing Error",
        description: "Could not process the enhanced analysis. The basic results are still available."
      });
    }
  };
  
  return (
    <TooltipProvider>
      <div className={cn("space-y-6", design.spacing.section)}>
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className={cn(design.text.heading, "text-lg flex items-center gap-2")}>
              <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Case Outcome Prediction
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>This tool uses AI to analyze case details and predict potential outcomes based on Indian legal precedents.</p>
                </TooltipContent>
              </Tooltip>
              <OpenAIFlashAnalyzer onAnalysisComplete={handleOpenAiAnalysis} />
            </h3>
          </div>
          
          {apiKeyError && (
            <InfoCard
              title="API Key Required"
              type="help"
              className="mb-4"
            >
              <p className="mb-3">{apiKeyError}</p>
              <Button 
                onClick={navigateToSettings}
                variant="outline" 
                size="sm"
                className="mt-2"
              >
                Go to AI Settings
              </Button>
            </InfoCard>
          )}
          
          {showOnboarding && !apiKeyError && (
            <InfoCard
              title="How to use this tool"
              type="info"
              className="mb-4"
              dismissible
              onDismiss={() => setShowOnboarding(false)}
            >
              <p>
                Enter the details of your legal case including relevant facts, applicable laws, jurisdiction information. 
                The AI will analyze your input and provide a prediction based on similar cases in Indian courts.
              </p>
            </InfoCard>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="caseDetails" className={cn(design.text.body, "font-medium")}>
                  Enter Case Details
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="max-w-xs">Include case facts, applicable laws, jurisdiction details, and precedents if known.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Textarea
                id="caseDetails"
                placeholder="Provide facts of the case, applicable laws, jurisdiction, and relevant circumstances..."
                value={caseDetail}
                onChange={e => setCaseDetail(e.target.value)}
                className={cn("min-h-[150px] resize-y", error ? "border-red-300 dark:border-red-700" : "")}
              />
              
              {error && (
                <ErrorMessage 
                  message={error}
                  severity="error"
                  className="mt-2"
                />
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full sm:w-auto" 
              disabled={isLoading || !!apiKeyError}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Generate Prediction'
              )}
            </Button>
          </form>
        </div>
        
        <LazyComponent 
          fallback={<AIAnalysisSkeleton />} 
          delayMs={200}
          minimumLoadTimeMs={800}
        >
          {result && (
            <Card className="border border-blue-200 dark:border-blue-900/50">
              <CardHeader className="pb-2 space-y-1.5">
                <CardTitle className={cn(design.text.heading, "text-lg text-blue-700 dark:text-blue-400")}>
                  Prediction Results
                </CardTitle>
                <CardDescription>
                  AI-generated legal prediction based on similar Indian cases and precedents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-between sm:w-1/2">
                    <div>
                      <p className={cn(design.text.caption, "mb-1")}>Predicted Outcome</p>
                      <p className="text-xl font-semibold text-blue-700 dark:text-blue-400">{result.prediction}</p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{result.confidence}%</div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Confidence score based on analysis of similar cases</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg sm:w-1/2">
                    <p className={cn(design.text.caption, "mb-1")}>Key Analysis</p>
                    <p className={cn(design.text.body, "text-sm")}>{result.analysis}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Relevant Indian Precedents</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {result.relevantCases.map((caseRef: string, i: number) => (
                      <div key={i} className="flex items-center p-2 border border-gray-200 dark:border-gray-800 rounded-md gap-2 bg-white dark:bg-gray-900">
                        <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm">{caseRef}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {openAiAnalysis && (
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Advanced OpenAI Analysis</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enhanced analysis generated by OpenAI's GPT-4 model</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded overflow-auto max-h-[250px] border border-gray-200 dark:border-gray-700">
                      {openAiAnalysis}
                    </pre>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end pt-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                        toast({
                          title: "Copied",
                          description: "Prediction results copied to clipboard"
                        });
                      }}
                    >
                      Export Results
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy prediction results to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </CardFooter>
            </Card>
          )}
        </LazyComponent>
      </div>
    </TooltipProvider>
  );
};

export default OutcomePredictor;
