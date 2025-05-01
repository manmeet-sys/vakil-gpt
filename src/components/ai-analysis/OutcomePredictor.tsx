
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Loader2, Scale, AlignLeft, BarChart2, FileText, BadgeInfo } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getGeminiResponse } from '../GeminiProIntegration';
import { OutcomePrediction } from '@/types/GlobalTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import GeminiFlashAnalyzer from '../GeminiFlashAnalyzer';

interface OutcomePredictorProps {
  caseDetails?: {
    id: string;
    title: string;
    description?: string;
    court?: string;
    jurisdiction?: string;
  };
  onAnalysisComplete?: (analysis: OutcomePrediction) => void;
}

const OutcomePredictor: React.FC<OutcomePredictorProps> = ({ 
  caseDetails, 
  onAnalysisComplete 
}) => {
  const [caseDescription, setCaseDescription] = useState<string>(caseDetails?.description || '');
  const [jurisdiction, setJurisdiction] = useState<string>(caseDetails?.jurisdiction || 'supreme-court');
  const [caseType, setCaseType] = useState<string>('civil');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<OutcomePrediction | null>(null);
  const [activeTab, setActiveTab] = useState<string>('input');

  // Indian jurisdictions
  const jurisdictions = [
    { value: 'supreme-court', label: 'Supreme Court of India' },
    { value: 'delhi-high-court', label: 'Delhi High Court' },
    { value: 'bombay-high-court', label: 'Bombay High Court' },
    { value: 'calcutta-high-court', label: 'Calcutta High Court' },
    { value: 'madras-high-court', label: 'Madras High Court' },
    { value: 'allahabad-high-court', label: 'Allahabad High Court' },
    { value: 'district-court', label: 'District Courts' },
    { value: 'consumer-forum', label: 'Consumer Forums' },
    { value: 'ngt', label: 'National Green Tribunal' },
    { value: 'nclt', label: 'National Company Law Tribunal' }
  ];

  // Case types
  const caseTypes = [
    { value: 'civil', label: 'Civil Case' },
    { value: 'criminal', label: 'Criminal Case' },
    { value: 'constitutional', label: 'Constitutional Matter' },
    { value: 'commercial', label: 'Commercial Dispute' },
    { value: 'taxation', label: 'Taxation Matter' },
    { value: 'family', label: 'Family Law Case' },
    { value: 'property', label: 'Property Dispute' },
    { value: 'ip', label: 'Intellectual Property' },
    { value: 'consumer', label: 'Consumer Dispute' },
    { value: 'environmental', label: 'Environmental Case' }
  ];

  const handleGeneratePrediction = async () => {
    if (caseDescription.trim().length < 50) {
      toast({
        variant: "destructive",
        title: "Insufficient Information",
        description: "Please provide more details about the case (minimum 50 characters).",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const selectedJurisdiction = jurisdictions.find(j => j.value === jurisdiction)?.label || jurisdiction;
      const selectedCaseType = caseTypes.find(t => t.value === caseType)?.label || caseType;
      
      const prompt = `You are an AI assistant specialized in Indian law. Analyze the following case and provide a detailed outcome prediction based on Indian legal precedents, statutes, and typical rulings in the ${selectedJurisdiction} for ${selectedCaseType} cases. 

Case Details:
${caseDescription}

Your analysis should be structured in JSON format with the following fields:
{
  "likelihood": [number between 0-100 representing percentage chance of success],
  "favorableOutcome": [boolean indicating if outcome is likely favorable for the client],
  "reasoning": [detailed explanation of the prediction with reference to Indian law],
  "keyFactors": [array of key factors that influence the outcome],
  "similarCases": [array of objects containing relevant Indian case precedents with name, citation, outcome, and relevance],
  "alternativeStrategies": [array of alternative legal strategies to consider under Indian law]
}

Be realistic in your assessment and base your prediction on actual Indian legal principles and precedent. Include specific statutes, legal principles, and case citations whenever possible.`;

      // Generate the prediction using Gemini
      const response = await getGeminiResponse(prompt);
      
      try {
        // Parse the JSON response
        let jsonResponse: OutcomePrediction;
        
        // Extract JSON if it's wrapped in text or code blocks
        const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                         response.match(/```\s*([\s\S]*?)\s*```/) || 
                         response.match(/{[\s\S]*}/);
                         
        if (jsonMatch) {
          jsonResponse = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } else {
          jsonResponse = JSON.parse(response);
        }
        
        setPrediction(jsonResponse);
        setActiveTab('results');
        
        if (onAnalysisComplete) {
          onAnalysisComplete(jsonResponse);
        }
        
        toast({
          title: "Analysis Complete",
          description: "Case outcome prediction has been generated",
        });
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        toast({
          variant: "destructive",
          title: "Format Error",
          description: "Unable to parse AI response. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error generating prediction:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to generate prediction",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFlashAnalysis = (analysis: string) => {
    try {
      // Parse JSON from the analysis
      const jsonResponse: OutcomePrediction = JSON.parse(analysis);
      setPrediction(jsonResponse);
      setActiveTab('results');
      
      if (onAnalysisComplete) {
        onAnalysisComplete(jsonResponse);
      }
      
      toast({
        title: "Flash Analysis Complete",
        description: "Case outcome prediction has been generated",
      });
    } catch (parseError) {
      console.error("Error parsing flash analysis:", parseError);
      toast({
        variant: "destructive",
        title: "Format Error",
        description: "Unable to parse analysis. Please try again.",
      });
    }
  };
  
  const reset = () => {
    setPrediction(null);
    setActiveTab('input');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Scale className="h-5 w-5 text-blue-600" />
          <span>Case Outcome Predictor</span>
        </h2>
        <GeminiFlashAnalyzer onAnalysisComplete={handleFlashAnalysis} />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Case Details</TabsTrigger>
          <TabsTrigger value="results" disabled={!prediction}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jurisdiction">Court/Jurisdiction</Label>
              <Select value={jurisdiction} onValueChange={setJurisdiction}>
                <SelectTrigger id="jurisdiction">
                  <SelectValue placeholder="Select jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  {jurisdictions.map(j => (
                    <SelectItem key={j.value} value={j.value}>{j.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="case-type">Case Type</Label>
              <Select value={caseType} onValueChange={setCaseType}>
                <SelectTrigger id="case-type">
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  {caseTypes.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="case-description">
              Case Description
              <span className="ml-1 text-sm text-gray-500">(Include facts, legal issues, and context)</span>
            </Label>
            <Textarea
              id="case-description"
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
              placeholder="Describe the case in detail, including relevant facts, legal issues, arguments from both sides, applicable laws, and the current stage of proceedings..."
              className="min-h-[200px]"
            />
          </div>
          
          <Button 
            onClick={handleGeneratePrediction} 
            disabled={isGenerating || caseDescription.trim().length < 50}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Prediction...
              </>
            ) : (
              <>
                <BarChart2 className="mr-2 h-4 w-4" />
                Generate Case Outcome Prediction
              </>
            )}
          </Button>
        </TabsContent>
        
        <TabsContent value="results" className="mt-4">
          {prediction && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-blue-600" />
                      <span>Outcome Prediction</span>
                    </div>
                    <Badge className={prediction.favorableOutcome ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}>
                      {prediction.favorableOutcome ? "Favorable" : "Unfavorable"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Based on Indian legal precedents and statutes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Likelihood meter */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Success Likelihood</span>
                      <span className="font-medium">{prediction.likelihood}%</span>
                    </div>
                    <Progress value={prediction.likelihood} className="h-2" />
                  </div>
                  
                  {/* Reasoning */}
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-1.5">
                      <AlignLeft className="h-4 w-4 text-blue-600" />
                      Analysis & Reasoning
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                      {prediction.reasoning}
                    </p>
                  </div>
                  
                  {/* Key Factors */}
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-1.5">
                      <BadgeInfo className="h-4 w-4 text-blue-600" />
                      Key Factors
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {prediction.keyFactors.map((factor, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{factor}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Similar Cases */}
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Relevant Indian Case Law
                    </h3>
                    <div className="space-y-3">
                      {prediction.similarCases.map((caseRef, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                          <div className="font-medium text-sm">{caseRef.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{caseRef.citation}</div>
                          <div className="text-xs mt-1">
                            <span className="font-medium">Outcome:</span> {caseRef.outcome}
                          </div>
                          <div className="text-xs mt-1">
                            <span className="font-medium">Relevance:</span> {caseRef.relevance}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Alternative Strategies */}
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-1.5">
                      <BarChart2 className="h-4 w-4 text-blue-600" />
                      Alternative Strategies
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {prediction.alternativeStrategies.map((strategy, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{strategy}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={reset}>
                    New Prediction
                  </Button>
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(prediction, null, 2));
                      toast({
                        title: "Copied",
                        description: "Prediction data copied to clipboard",
                      });
                    }}
                    variant="secondary"
                  >
                    Copy Data
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 italic text-center">
                This prediction is based on AI analysis of the provided information and Indian legal precedents. 
                It should not be considered as legal advice. Always consult with a qualified advocate.
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutcomePredictor;
