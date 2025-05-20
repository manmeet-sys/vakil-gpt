
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';

interface OutcomePredictorProps {
  caseDetails?: {
    id: string;
    title: string;
    description?: string;
    courts?: string[]
    precedents?: string[]
  };
  onPredictionComplete?: (prediction: any) => void;
}

interface PredictionResults {
  probability: number;
  favorableFactors: string[];
  unfavorableFactors: string[];
  relevantPrecedents: string[];
  suggestedApproach: string;
}

const OutcomePredictor: React.FC<OutcomePredictorProps> = ({ 
  caseDetails,
  onPredictionComplete 
}) => {
  const [caseDescription, setCaseDescription] = useState<string>(caseDetails?.description || '');
  const [court, setCourt] = useState<string>('');
  const [precedents, setPrecedents] = useState<string>(caseDetails?.precedents?.join('\n') || '');
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResults | null>(null);

  const handlePredict = async () => {
    if (caseDescription.trim().length < 100) {
      toast({
        description: "Please provide more details about the case for accurate prediction."
      });
      return;
    }

    setIsPredicting(true);
    
    try {
      const promptText = `
        You are an experienced legal analyst with expertise in Indian law. Analyze the following case and predict its likely outcome:
        
        Case Description:
        ${caseDescription}
        
        ${court ? `Court: ${court}` : ''}
        
        ${precedents ? `Relevant Precedents:
        ${precedents}` : ''}
        
        Based on Indian legal principles, statutory provisions, and case law, provide:
        1. A probability percentage of a favorable outcome, considering the strength of the case
        2. Key favorable legal factors that support this case
        3. Key unfavorable legal factors that may weaken this case
        4. Relevant legal precedents from Indian courts that might apply
        5. Suggested approach to improve chances of success
        
        Format your response as JSON with the following structure:
        {
          "probability": [number between 0-100],
          "favorableFactors": ["factor1", "factor2", ...],
          "unfavorableFactors": ["factor1", "factor2", ...],
          "relevantPrecedents": ["precedent with citation", ...],
          "suggestedApproach": "detailed strategic recommendation"
        }
      `;

      const response = await getOpenAIResponse(promptText);
      
      try {
        // Extract JSON if it's wrapped in text or code blocks
        const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                          response.match(/```\s*([\s\S]*?)\s*```/) || 
                          response.match(/{[\s\S]*}/);
        
        let jsonResponse;
        if (jsonMatch) {
          jsonResponse = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } else {
          jsonResponse = JSON.parse(response);
        }
        
        setPrediction(jsonResponse);
        
        if (onPredictionComplete) {
          onPredictionComplete(jsonResponse);
        }
        
        toast({
          description: "Case outcome prediction has been generated"
        });
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        toast({
          description: "Unable to parse AI response. Please try again."
        });
      }
    } catch (error) {
      console.error("Error predicting outcome:", error);
      toast({
        description: error instanceof Error ? error.message : "Failed to generate prediction"
      });
    } finally {
      setIsPredicting(false);
    }
  };

  const getProbabilityDisplay = (probability: number) => {
    let color;
    let text;
    
    if (probability >= 70) {
      color = "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400";
      text = "Favorable";
    } else if (probability >= 40) {
      color = "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400";
      text = "Uncertain";
    } else {
      color = "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
      text = "Unfavorable";
    }
    
    return { color, text };
  };
  
  const openAISettings = () => {
    toast({
      description: "Navigate to AI Settings to customize AI behavior"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Case Outcome Predictor</h2>
        <Button variant="outline" size="sm" onClick={openAISettings}>
          <Settings className="h-4 w-4 mr-1" />
          AI Settings
        </Button>
      </div>
      
      {!prediction ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Predict Case Outcome</CardTitle>
            <CardDescription>
              Enter case details to get an AI prediction based on Indian legal precedents and principles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="case-details">Case Details</Label>
              <Textarea 
                id="case-details" 
                value={caseDescription}
                onChange={(e) => setCaseDescription(e.target.value)}
                placeholder="Describe the case in detail, including facts, legal issues, arguments from both sides..."
                className="min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground">
                Provide comprehensive details for more accurate predictions (minimum 100 characters)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="court">Court/Tribunal</Label>
              <Input 
                id="court"
                value={court}
                onChange={(e) => setCourt(e.target.value)}
                placeholder="e.g., Supreme Court of India, Delhi High Court, NCLT..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="precedents">
                Relevant Precedents <span className="text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea 
                id="precedents"
                value={precedents}
                onChange={(e) => setPrecedents(e.target.value)}
                placeholder="List any relevant case law or precedents, one per line..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handlePredict} 
              disabled={isPredicting || caseDescription.trim().length < 100}
              className="w-full"
            >
              {isPredicting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Case...
                </>
              ) : (
                'Predict Outcome'
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Case Outcome Prediction</span>
              {prediction && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getProbabilityDisplay(prediction.probability).color}`}>
                  {prediction.probability}% - {getProbabilityDisplay(prediction.probability).text}
                </div>
              )}
            </CardTitle>
            <CardDescription>
              AI prediction based on Indian legal precedents and principles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-700 dark:text-green-400">Favorable Factors</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {prediction.favorableFactors.map((factor, i) => (
                    <li key={i} className="text-sm">{factor}</li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-700 dark:text-red-400">Unfavorable Factors</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {prediction.unfavorableFactors.map((factor, i) => (
                    <li key={i} className="text-sm">{factor}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400">Relevant Legal Precedents</h4>
              <ul className="list-disc pl-5 space-y-1">
                {prediction.relevantPrecedents.map((precedent, i) => (
                  <li key={i} className="text-sm">{precedent}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400">Suggested Approach</h4>
              <p className="text-sm">{prediction.suggestedApproach}</p>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md flex gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-300">
                This prediction is based on the information provided and should be used for reference only.
                Actual case outcomes depend on many factors including evidence presented, court jurisdiction,
                and judicial interpretation that may not be reflected in this analysis.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setPrediction(null)}>
              New Prediction
            </Button>
            <Button 
              onClick={() => {
                const formattedPrediction = JSON.stringify(prediction, null, 2);
                navigator.clipboard.writeText(formattedPrediction);
                toast({
                  description: "Prediction data copied to clipboard"
                });
              }}
              variant="secondary"
            >
              Copy Data
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <p className="text-xs text-gray-500 dark:text-gray-400 italic text-center">
        Using AI to analyze Indian legal precedents and principles for predictive insights.
        Results should be reviewed by qualified legal professionals.
      </p>
    </div>
  );
};

export default OutcomePredictor;
