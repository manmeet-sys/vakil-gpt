
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
import { DollarSign, FileText, AlertTriangle, Check, Building, ChevronRight, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import GeminiProIntegration from './GeminiProIntegration';

interface TaxAnalysisResult {
  summary: string;
  risks: {
    level: 'low' | 'medium' | 'high';
    description: string;
  }[];
  recommendations: string[];
  applicableLaws: {
    name: string;
    description: string;
  }[];
}

const TaxComplianceTool = () => {
  const { toast } = useToast();
  const [businessType, setBusinessType] = useState<string>('');
  const [jurisdiction, setJurisdiction] = useState<string>('');
  const [taxSituation, setTaxSituation] = useState<string>('');
  const [taxAnalysisResult, setTaxAnalysisResult] = useState<TaxAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('input');

  const generateTaxAnalysis = async () => {
    if (!businessType || !jurisdiction || !taxSituation.trim()) {
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
        Act as a tax law specialist and compliance advisor. Based on the following information, provide a comprehensive tax compliance analysis:
        
        Business Type: ${businessType}
        Jurisdiction: ${jurisdiction}
        Tax Situation Description: ${taxSituation}
        
        Format your response exactly as follows (do not include any extra text except what fits in these sections):
        
        SUMMARY: A brief summary of the tax situation and key findings.
        
        RISKS:
        - [HIGH/MEDIUM/LOW]: First risk and explanation
        - [HIGH/MEDIUM/LOW]: Second risk and explanation
        (Include at least 2 risks)
        
        RECOMMENDATIONS:
        - First recommendation
        - Second recommendation
        (Include at least 3 recommendations)
        
        APPLICABLE_LAWS:
        - Law Name 1: Brief description of how it applies
        - Law Name 2: Brief description of how it applies
        (Include at least 2 applicable laws or regulations)
      `;

      // Use GeminiProIntegration to generate analysis
      const response = await GeminiProIntegration.getGeminiResponse(prompt);
      
      // Parse the AI response to extract structured data
      const result = parseAIResponse(response);
      setTaxAnalysisResult(result);
      setActiveTab('results');
      
      toast({
        title: "Analysis Complete",
        description: "Tax compliance analysis has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating tax analysis:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error generating the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseAIResponse = (response: string): TaxAnalysisResult => {
    // Initialize result with default values
    const result: TaxAnalysisResult = {
      summary: '',
      risks: [],
      recommendations: [],
      applicableLaws: []
    };

    try {
      // Extract summary
      const summaryMatch = response.match(/SUMMARY:(.*?)(?=RISKS:|$)/s);
      if (summaryMatch && summaryMatch[1]) {
        result.summary = summaryMatch[1].trim();
      }

      // Extract risks
      const risksMatch = response.match(/RISKS:(.*?)(?=RECOMMENDATIONS:|$)/s);
      if (risksMatch && risksMatch[1]) {
        const risksText = risksMatch[1].trim();
        const riskItems = risksText.split('\n-').map(item => item.trim()).filter(Boolean);
        
        riskItems.forEach(item => {
          const levelMatch = item.match(/\[(HIGH|MEDIUM|LOW)\]:/i);
          if (levelMatch) {
            const level = levelMatch[1].toLowerCase() as 'high' | 'medium' | 'low';
            const description = item.replace(/\[(HIGH|MEDIUM|LOW)\]:/i, '').trim();
            result.risks.push({ level, description });
          }
        });
      }

      // Extract recommendations
      const recommendationsMatch = response.match(/RECOMMENDATIONS:(.*?)(?=APPLICABLE_LAWS:|$)/s);
      if (recommendationsMatch && recommendationsMatch[1]) {
        const recsText = recommendationsMatch[1].trim();
        result.recommendations = recsText.split('\n-')
          .map(item => item.trim())
          .filter(Boolean)
          .map(item => item.replace(/^-\s*/, ''));
      }

      // Extract applicable laws
      const lawsMatch = response.match(/APPLICABLE_LAWS:(.*?)(?=$)/s);
      if (lawsMatch && lawsMatch[1]) {
        const lawsText = lawsMatch[1].trim();
        const lawItems = lawsText.split('\n-')
          .map(item => item.trim())
          .filter(Boolean);
        
        lawItems.forEach(item => {
          const nameParts = item.split(':');
          if (nameParts.length >= 2) {
            const name = nameParts[0].trim().replace(/^-\s*/, '');
            const description = nameParts.slice(1).join(':').trim();
            result.applicableLaws.push({ name, description });
          }
        });
      }

      return result;
    } catch (error) {
      console.error("Error parsing AI response:", error);
      // If parsing fails, return a default error result
      return {
        summary: "Unable to parse the analysis results. Please try again.",
        risks: [{ level: 'medium', description: 'Analysis parsing error' }],
        recommendations: ["Try regenerating the analysis"],
        applicableLaws: [{ name: "Error", description: "Could not determine applicable laws" }]
      };
    }
  };

  const resetForm = () => {
    setBusinessType('');
    setJurisdiction('');
    setTaxSituation('');
    setTaxAnalysisResult(null);
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
          <TabsTrigger value="results" disabled={!taxAnalysisResult}>Results</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Tax Situation Analysis
              </CardTitle>
              <CardDescription>
                Provide details about your business and tax situation for AI-powered compliance analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="business-type">Business Structure</Label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger id="business-type">
                    <SelectValue placeholder="Select business structure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="llc">Limited Liability Company (LLC)</SelectItem>
                    <SelectItem value="s-corporation">S Corporation</SelectItem>
                    <SelectItem value="c-corporation">C Corporation</SelectItem>
                    <SelectItem value="non-profit">Non-Profit Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="jurisdiction">Primary Tax Jurisdiction</Label>
                <Select value={jurisdiction} onValueChange={setJurisdiction}>
                  <SelectTrigger id="jurisdiction">
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us-federal">United States (Federal)</SelectItem>
                    <SelectItem value="california">California</SelectItem>
                    <SelectItem value="new-york">New York</SelectItem>
                    <SelectItem value="texas">Texas</SelectItem>
                    <SelectItem value="florida">Florida</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="eu">European Union</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="tax-situation">Describe Your Tax Situation or Question</Label>
                <Textarea
                  id="tax-situation"
                  placeholder="E.g., Our company is expanding operations to California. We currently have tax nexus in New York and Texas. We need to understand our new tax obligations and potential risks..."
                  value={taxSituation}
                  onChange={(e) => setTaxSituation(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>Reset</Button>
              <Button 
                onClick={generateTaxAnalysis} 
                disabled={isAnalyzing || !businessType || !jurisdiction || !taxSituation.trim()}
              >
                {isAnalyzing ? "Analyzing..." : "Generate Tax Analysis"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          {taxAnalysisResult && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    Tax Compliance Analysis
                  </CardTitle>
                  <CardDescription>
                    Based on {businessType.replace('-', ' ')} operating in {jurisdiction.replace('-', ' ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Summary</h3>
                      <p className="text-gray-700 dark:text-gray-300">{taxAnalysisResult.summary}</p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-amber-500" /> Risk Assessment
                      </h3>
                      <div className="space-y-3">
                        {taxAnalysisResult.risks.map((risk, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Badge className={`${getRiskBadgeColor(risk.level)} capitalize`}>
                              {risk.level}
                            </Badge>
                            <p className="text-gray-700 dark:text-gray-300">{risk.description}</p>
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
                        {taxAnalysisResult.recommendations.map((rec, index) => (
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
                        <Building className="h-4 w-4 text-indigo-500" /> Applicable Laws & Regulations
                      </h3>
                      <div className="space-y-3">
                        {taxAnalysisResult.applicableLaws.map((law, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-md">
                            <h4 className="font-medium text-blue-700 dark:text-blue-400">{law.name}</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{law.description}</p>
                          </div>
                        ))}
                      </div>
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
                  This analysis is provided for informational purposes only and does not constitute legal or tax advice. 
                  Please consult with a qualified tax professional before making decisions based on this information.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxComplianceTool;
