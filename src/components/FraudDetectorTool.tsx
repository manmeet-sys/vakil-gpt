
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Check, ChevronRight, Info, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';

interface FraudAnalysisResult {
  summary: string;
  fraudIndicators: {
    level: 'low' | 'medium' | 'high';
    description: string;
  }[];
  recommendations: string[];
  regulatoryConsiderations: string[];
}

const FraudDetectorTool = () => {
  const { toast } = useToast();
  const [transactionType, setTransactionType] = useState<string>('');
  const [industryType, setIndustryType] = useState<string>('');
  const [transactionDetails, setTransactionDetails] = useState<string>('');
  const [fraudAnalysisResult, setFraudAnalysisResult] = useState<FraudAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('input');

  const generateFraudAnalysis = async () => {
    if (!transactionType || !industryType || !transactionDetails.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Create prompt for AI analysis
      const prompt = `
        Act as a financial fraud detection specialist. Based on the following information, provide a comprehensive fraud risk analysis:
        
        Transaction Type: ${transactionType}
        Industry: ${industryType}
        Transaction Details: ${transactionDetails}
        
        Format your response exactly as follows (do not include any extra text except what fits in these sections):
        
        SUMMARY: A brief summary of the transaction and key fraud risk findings.
        
        FRAUD_INDICATORS:
        - [HIGH/MEDIUM/LOW]: First indicator and explanation
        - [HIGH/MEDIUM/LOW]: Second indicator and explanation
        (Include at least 3 indicators)
        
        RECOMMENDATIONS:
        - First recommendation
        - Second recommendation
        (Include at least 3 recommendations)
        
        REGULATORY_CONSIDERATIONS:
        - First regulatory consideration
        - Second regulatory consideration
        (Include at least 2 regulatory considerations)
      `;

      const response = await getOpenAIResponse(prompt);
      
      // Parse the AI response to extract structured data
      const result = parseAIResponse(response);
      setFraudAnalysisResult(result);
      setActiveTab('results');
      
      toast({
        title: "Analysis Complete",
        description: "Fraud risk analysis has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating fraud analysis:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error generating the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseAIResponse = (response: string): FraudAnalysisResult => {
    // Initialize result with default values
    const result: FraudAnalysisResult = {
      summary: '',
      fraudIndicators: [],
      recommendations: [],
      regulatoryConsiderations: []
    };

    try {
      // Extract summary
      const summaryMatch = response.match(/SUMMARY:(.*?)(?=FRAUD_INDICATORS:|$)/s);
      if (summaryMatch && summaryMatch[1]) {
        result.summary = summaryMatch[1].trim();
      }

      // Extract fraud indicators
      const indicatorsMatch = response.match(/FRAUD_INDICATORS:(.*?)(?=RECOMMENDATIONS:|$)/s);
      if (indicatorsMatch && indicatorsMatch[1]) {
        const indicatorsText = indicatorsMatch[1].trim();
        const indicatorItems = indicatorsText.split('\n-').map(item => item.trim()).filter(Boolean);
        
        indicatorItems.forEach(item => {
          const levelMatch = item.match(/\[(HIGH|MEDIUM|LOW)\]:/i);
          if (levelMatch) {
            const level = levelMatch[1].toLowerCase() as 'high' | 'medium' | 'low';
            const description = item.replace(/\[(HIGH|MEDIUM|LOW)\]:/i, '').trim();
            result.fraudIndicators.push({ level, description });
          }
        });
      }

      // Extract recommendations
      const recommendationsMatch = response.match(/RECOMMENDATIONS:(.*?)(?=REGULATORY_CONSIDERATIONS:|$)/s);
      if (recommendationsMatch && recommendationsMatch[1]) {
        const recsText = recommendationsMatch[1].trim();
        result.recommendations = recsText.split('\n-')
          .map(item => item.trim())
          .filter(Boolean)
          .map(item => item.replace(/^-\s*/, ''));
      }

      // Extract regulatory considerations
      const regulatoryMatch = response.match(/REGULATORY_CONSIDERATIONS:(.*?)(?=$)/s);
      if (regulatoryMatch && regulatoryMatch[1]) {
        const regulatoryText = regulatoryMatch[1].trim();
        result.regulatoryConsiderations = regulatoryText.split('\n-')
          .map(item => item.trim())
          .filter(Boolean)
          .map(item => item.replace(/^-\s*/, ''));
      }

      return result;
    } catch (error) {
      console.error("Error parsing AI response:", error);
      // If parsing fails, return a default error result
      return {
        summary: "Unable to parse the analysis results. Please try again.",
        fraudIndicators: [{ level: 'medium', description: 'Analysis parsing error' }],
        recommendations: ["Try regenerating the analysis"],
        regulatoryConsiderations: ["Could not determine regulatory considerations"]
      };
    }
  };

  const resetForm = () => {
    setTransactionType('');
    setIndustryType('');
    setTransactionDetails('');
    setFraudAnalysisResult(null);
    setActiveTab('input');
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Input Details</TabsTrigger>
          <TabsTrigger value="results" disabled={!fraudAnalysisResult}>Results</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Financial Fraud Risk Analysis
              </CardTitle>
              <CardDescription>
                Provide transaction details for AI-powered fraud risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="transaction-type">Transaction Type</Label>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger id="transaction-type">
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wire-transfer">Wire Transfer</SelectItem>
                    <SelectItem value="credit-card">Credit Card Transaction</SelectItem>
                    <SelectItem value="loan-application">Loan Application</SelectItem>
                    <SelectItem value="account-opening">Account Opening</SelectItem>
                    <SelectItem value="insurance-claim">Insurance Claim</SelectItem>
                    <SelectItem value="securities-trade">Securities Trade</SelectItem>
                    <SelectItem value="cryptocurrency">Cryptocurrency Transaction</SelectItem>
                    <SelectItem value="real-estate">Real Estate Transaction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="industry-type">Industry</Label>
                <Select value={industryType} onValueChange={setIndustryType}>
                  <SelectTrigger id="industry-type">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banking">Banking</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="investment">Investment & Securities</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="cryptocurrency">Cryptocurrency</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="non-profit">Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="transaction-details">Transaction Details</Label>
                <Textarea
                  id="transaction-details"
                  placeholder="Describe the transaction in detail, including parties involved, amounts, timing, unusual circumstances, etc."
                  value={transactionDetails}
                  onChange={(e) => setTransactionDetails(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>Reset</Button>
              <Button 
                onClick={generateFraudAnalysis} 
                disabled={isAnalyzing || !transactionType || !industryType || !transactionDetails.trim()}
              >
                {isAnalyzing ? "Analyzing..." : "Generate Fraud Analysis"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          {fraudAnalysisResult && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Fraud Risk Analysis
                  </CardTitle>
                  <CardDescription>
                    Analysis for {transactionType.replace('-', ' ')} in the {industryType.replace('-', ' ')} industry
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Summary</h3>
                      <p className="text-gray-700 dark:text-gray-300">{fraudAnalysisResult.summary}</p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-amber-500" /> Fraud Indicators
                      </h3>
                      <div className="space-y-3">
                        {fraudAnalysisResult.fraudIndicators.map((indicator, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Badge className={`${getRiskBadgeColor(indicator.level)} capitalize`}>
                              {indicator.level}
                            </Badge>
                            <p className="text-gray-700 dark:text-gray-300">{indicator.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-1">
                        <Check className="h-4 w-4 text-green-500" /> Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {fraudAnalysisResult.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <ChevronRight className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-1">
                        <Info className="h-4 w-4 text-indigo-500" /> Regulatory Considerations
                      </h3>
                      <ul className="space-y-2">
                        {fraudAnalysisResult.regulatoryConsiderations.map((consideration, index) => (
                          <li key={index} className="flex items-start">
                            <ChevronRight className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{consideration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('input')}>
                    Edit Details
                  </Button>
                  <Button onClick={resetForm}>New Analysis</Button>
                </CardFooter>
              </Card>

              <Alert className="bg-blue-50 text-blue-800 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30">
                <Info className="h-4 w-4" />
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription>
                  This analysis is provided for informational purposes only and does not constitute legal or financial advice. 
                  Please consult with qualified professionals before making decisions based on this information.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FraudDetectorTool;
