import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ShieldAlert, FileText, AlertTriangle, Check, Building, ChevronRight, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getGeminiResponse } from '@/components/GeminiProIntegration';

interface AMLAnalysisResult {
  summary: string;
  risks: {
    level: 'low' | 'medium' | 'high';
    description: string;
  }[];
  recommendations: string[];
  applicableRegulations: {
    name: string;
    description: string;
  }[];
}

const AMLComplianceTool = () => {
  const { toast } = useToast();
  const [businessType, setBusinessType] = useState<string>('');
  const [jurisdiction, setJurisdiction] = useState<string>('');
  const [amlSituation, setAmlSituation] = useState<string>('');
  const [amlAnalysisResult, setAmlAnalysisResult] = useState<AMLAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('input');

  const generateAMLAnalysis = async () => {
    if (!businessType || !jurisdiction || !amlSituation.trim()) {
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
        Act as an Anti-Money Laundering (AML) and compliance specialist. Based on the following information, provide a comprehensive AML compliance analysis:
        
        Business Type: ${businessType}
        Jurisdiction: ${jurisdiction}
        AML Situation Description: ${amlSituation}
        
        Format your response exactly as follows (do not include any extra text except what fits in these sections):
        
        SUMMARY: A brief summary of the AML situation and key findings.
        
        RISKS:
        - [HIGH/MEDIUM/LOW]: First risk and explanation
        - [HIGH/MEDIUM/LOW]: Second risk and explanation
        (Include at least 2 risks)
        
        RECOMMENDATIONS:
        - First recommendation
        - Second recommendation
        (Include at least 3 recommendations)
        
        APPLICABLE_REGULATIONS:
        - Regulation Name 1: Brief description of how it applies
        - Regulation Name 2: Brief description of how it applies
        (Include at least 2 applicable regulations)
      `;

      const result = await getGeminiResponse(prompt);
      
      // Parse the AI response to extract structured data
      const analysisResult = parseAIResponse(result);
      setAmlAnalysisResult(analysisResult);
      setActiveTab('results');
      
      toast({
        title: "Analysis Complete",
        description: "AML compliance analysis has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating AML analysis:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error generating the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseAIResponse = (response: string): AMLAnalysisResult => {
    // Initialize result with default values
    const result: AMLAnalysisResult = {
      summary: '',
      risks: [],
      recommendations: [],
      applicableRegulations: []
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
      const recommendationsMatch = response.match(/RECOMMENDATIONS:(.*?)(?=APPLICABLE_REGULATIONS:|$)/s);
      if (recommendationsMatch && recommendationsMatch[1]) {
        const recsText = recommendationsMatch[1].trim();
        result.recommendations = recsText.split('\n-')
          .map(item => item.trim())
          .filter(Boolean)
          .map(item => item.replace(/^-\s*/, ''));
      }

      // Extract applicable regulations
      const regulationsMatch = response.match(/APPLICABLE_REGULATIONS:(.*?)(?=$)/s);
      if (regulationsMatch && regulationsMatch[1]) {
        const regulationsText = regulationsMatch[1].trim();
        const regulationItems = regulationsText.split('\n-')
          .map(item => item.trim())
          .filter(Boolean);
        
        regulationItems.forEach(item => {
          const nameParts = item.split(':');
          if (nameParts.length >= 2) {
            const name = nameParts[0].trim().replace(/^-\s*/, '');
            const description = nameParts.slice(1).join(':').trim();
            result.applicableRegulations.push({ name, description });
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
        applicableRegulations: [{ name: "Error", description: "Could not determine applicable regulations" }]
      };
    }
  };

  const resetForm = () => {
    setBusinessType('');
    setJurisdiction('');
    setAmlSituation('');
    setAmlAnalysisResult(null);
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
          <TabsTrigger value="results" disabled={!amlAnalysisResult}>Results</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-blue-600" />
                AML Compliance Analysis
              </CardTitle>
              <CardDescription>
                Provide details about your business and AML compliance situation for AI-powered analysis
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
                <Label htmlFor="jurisdiction">Primary Jurisdiction</Label>
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
                <Label htmlFor="aml-situation">Describe Your AML Compliance Situation or Question</Label>
                <Textarea
                  id="aml-situation"
                  placeholder="E.g., Our company is expanding operations internationally. We need to understand our AML compliance obligations and potential risks..."
                  value={amlSituation}
                  onChange={(e) => setAmlSituation(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>Reset</Button>
              <Button 
                onClick={generateAMLAnalysis} 
                disabled={isAnalyzing || !businessType || !jurisdiction || !amlSituation.trim()}
              >
                {isAnalyzing ? "Analyzing..." : "Generate AML Analysis"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          {amlAnalysisResult && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-blue-600" />
                    AML Compliance Analysis
                  </CardTitle>
                  <CardDescription>
                    Based on {businessType.replace('-', ' ')} operating in {jurisdiction.replace('-', ' ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Summary</h3>
                      <p className="text-gray-700 dark:text-gray-300">{amlAnalysisResult.summary}</p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-amber-500" /> Risk Assessment
                      </h3>
                      <div className="space-y-3">
                        {amlAnalysisResult.risks.map((risk, index) => (
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
                        {amlAnalysisResult.recommendations.map((rec, index) => (
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
                        <Building className="h-4 w-4 text-indigo-500" /> Applicable Regulations
                      </h3>
                      <div className="space-y-3">
                        {amlAnalysisResult.applicableRegulations.map((regulation, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-md">
                            <h4 className="font-medium text-blue-700 dark:text-blue-400">{regulation.name}</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{regulation.description}</p>
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
                  This analysis is provided for informational purposes only and does not constitute legal or compliance advice. 
                  Please consult with a qualified compliance professional before making decisions based on this information.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AMLComplianceTool;
