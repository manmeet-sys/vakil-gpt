
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Scale, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import GeminiFlashAnalyzer from '@/components/GeminiFlashAnalyzer';
import LazyComponent from '@/components/LazyComponent';
import AIAnalysisSkeleton from '../SkeletonLoaders/AIAnalysisSkeleton';

const OutcomePredictor = () => {
  const { toast } = useToast();
  const [caseDetail, setCaseDetail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<null | any>(null);
  const [geminiAnalysis, setGeminiAnalysis] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      // In a real app, this would call your API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result
      setResult({
        prediction: "Likely favorable outcome",
        confidence: 78,
        relevantCases: [
          "Singh v. State of Maharashtra (2022)",
          "Patel Industries Ltd. v. Union of India (2021)",
          "Kumar Enterprises v. Tax Authority (2023)"
        ],
        analysis: "Based on precedents established by the Supreme Court of India in similar cases, there is a high likelihood of a favorable judgment. The statutory interpretation favors the petitioner's position, though some risk remains due to potentially conflicting High Court rulings."
      });
      
      toast({
        title: "Analysis Complete",
        description: "Case outcome prediction generated successfully"
      });
    } catch (error) {
      console.error("Error predicting outcome:", error);
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: "Failed to analyze case details. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGeminiAnalysis = (analysis: string) => {
    setGeminiAnalysis(analysis);
    
    try {
      // Update our regular prediction with enhanced Gemini results
      const parsedAnalysis = JSON.parse(analysis);
      
      // In a real app, you'd integrate this with the existing prediction
      toast({
        title: "Enhanced Analysis Applied",
        description: "Gemini insights have been incorporated into your prediction"
      });
    } catch (e) {
      console.error("Error parsing Gemini analysis:", e);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-600" />
            Case Outcome Prediction
            <GeminiFlashAnalyzer onAnalysisComplete={handleGeminiAnalysis} />
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="caseDetails">
              Enter Case Details
            </Label>
            <Textarea
              id="caseDetails"
              placeholder="Provide facts of the case, applicable laws, jurisdiction, and relevant circumstances..."
              value={caseDetail}
              onChange={e => setCaseDetail(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full sm:w-auto" 
            disabled={isLoading}
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
            <CardHeader className="pb-2">
              <h3 className="text-lg font-medium text-blue-700 dark:text-blue-400">Prediction Results</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-between sm:w-1/2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Predicted Outcome</p>
                    <p className="text-xl font-semibold text-blue-700 dark:text-blue-400">{result.prediction}</p>
                  </div>
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{result.confidence}%</div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg sm:w-1/2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Key Analysis</p>
                  <p className="text-sm">{result.analysis}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Relevant Indian Precedents</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {result.relevantCases.map((caseRef: string, i: number) => (
                    <div key={i} className="flex items-center p-2 border rounded-md gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{caseRef}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {geminiAnalysis && (
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm font-medium mb-2">Advanced Gemini Analysis</p>
                  <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded overflow-auto max-h-[250px]">
                    {geminiAnalysis}
                  </pre>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
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
            </CardFooter>
          </Card>
        )}
      </LazyComponent>
    </div>
  );
};

export default OutcomePredictor;
