
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
import { DollarSign, FileText, AlertTriangle, Check, Building, ChevronRight, Info, CalendarClock, IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import * as GeminiAI from '@/components/GeminiProIntegration';
import { Input } from '@/components/ui/input';

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
  const [financialYear, setFinancialYear] = useState<string>('fy2023-24');
  const [annualTurnover, setAnnualTurnover] = useState<string>('');
  const [taxSituation, setTaxSituation] = useState<string>('');
  const [taxAnalysisResult, setTaxAnalysisResult] = useState<TaxAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('input');

  const generateTaxAnalysis = async () => {
    if (!businessType || !jurisdiction || !taxSituation.trim() || !financialYear || !annualTurnover) {
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
        Act as an Indian tax law specialist and compliance advisor. Based on the following information, provide a comprehensive tax compliance analysis for Indian businesses:
        
        Business Type: ${businessType}
        Jurisdiction in India: ${jurisdiction}
        Financial Year: ${financialYear}
        Annual Turnover: ₹${annualTurnover}
        Tax Situation Description: ${taxSituation}
        
        Format your response exactly as follows (do not include any extra text except what fits in these sections):
        
        SUMMARY: A brief summary of the tax situation and key findings under Indian tax laws.
        
        RISKS:
        - [HIGH/MEDIUM/LOW]: First risk and explanation under Indian tax regulations
        - [HIGH/MEDIUM/LOW]: Second risk and explanation under Indian tax regulations
        (Include at least 3 risks)
        
        RECOMMENDATIONS:
        - First recommendation specific to Indian tax compliance
        - Second recommendation specific to Indian tax compliance
        (Include at least 4 recommendations)
        
        APPLICABLE_LAWS:
        - Indian Tax Law 1: Brief description of how it applies (include specific sections if applicable)
        - Indian Tax Law 2: Brief description of how it applies (include specific sections if applicable)
        (Include at least 3 applicable Indian laws or regulations)
      `;

      // Use directly imported GeminiAI module function
      const response = await GeminiAI.getGeminiResponse(prompt);
      
      // Parse the AI response to extract structured data
      const result = parseAIResponse(response);
      setTaxAnalysisResult(result);
      setActiveTab('results');
      
      toast({
        title: "Analysis Complete",
        description: "Indian tax compliance analysis has been generated successfully.",
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
    setFinancialYear('fy2023-24');
    setAnnualTurnover('');
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
                <IndianRupee className="h-5 w-5 text-blue-600" />
                Indian Tax Compliance Analysis
              </CardTitle>
              <CardDescription>
                Provide details about your Indian business and tax situation for AI-powered compliance analysis
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
                    <SelectItem value="proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="partnership">Partnership Firm</SelectItem>
                    <SelectItem value="llp">Limited Liability Partnership (LLP)</SelectItem>
                    <SelectItem value="opc">One Person Company (OPC)</SelectItem>
                    <SelectItem value="private-limited">Private Limited Company</SelectItem>
                    <SelectItem value="public-limited">Public Limited Company</SelectItem>
                    <SelectItem value="trust">Trust</SelectItem>
                    <SelectItem value="ngo">NGO/Non-Profit</SelectItem>
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
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="telangana">Telangana</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="haryana">Haryana</SelectItem>
                    <SelectItem value="other">Other State/UT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="financial-year">Financial Year</Label>
                  <Select value={financialYear} onValueChange={setFinancialYear}>
                    <SelectTrigger id="financial-year">
                      <SelectValue placeholder="Select financial year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fy2023-24">FY 2023-24 (Current)</SelectItem>
                      <SelectItem value="fy2022-23">FY 2022-23</SelectItem>
                      <SelectItem value="fy2021-22">FY 2021-22</SelectItem>
                      <SelectItem value="fy2020-21">FY 2020-21</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              
                <div className="space-y-3">
                  <Label htmlFor="annual-turnover">Annual Turnover (₹)</Label>
                  <Input
                    id="annual-turnover"
                    type="text"
                    placeholder="e.g., 50,00,000"
                    value={annualTurnover}
                    onChange={(e) => setAnnualTurnover(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="tax-situation">Describe Your Tax Situation or Question</Label>
                <Textarea
                  id="tax-situation"
                  placeholder="E.g., Our company operates in the IT sector in Bangalore. We need to understand GST implications for SaaS products and services provided to international clients. We also have questions about TDS compliance on payments to our contractors..."
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
                disabled={isAnalyzing || !businessType || !jurisdiction || !financialYear || !annualTurnover || !taxSituation.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
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
                    <IndianRupee className="h-5 w-5 text-blue-600" />
                    Indian Tax Compliance Analysis
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
                        <Building className="h-4 w-4 text-indigo-500" /> Applicable Indian Laws & Regulations
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

                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                      <h4 className="font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2">
                        <CalendarClock className="h-4 w-4" /> Important Dates & Deadlines
                      </h4>
                      <ul className="mt-2 space-y-1">
                        <li className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">GST Returns:</span> File GSTR-1 by 11th and GSTR-3B by 20th of every month
                        </li>
                        <li className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">TDS Returns:</span> Quarterly filing due by 31st July, 31st Oct, 31st Jan, 31st May
                        </li>
                        <li className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Income Tax Return:</span> July 31st for non-audit cases, October 31st for audit cases
                        </li>
                        <li className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Advance Tax:</span> 15th June (15%), 15th Sept (45%), 15th Dec (75%), 15th March (100%)
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('input')}>
                    Edit Details
                  </Button>
                  <Button 
                    onClick={resetForm}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    New Analysis
                  </Button>
                </CardFooter>
              </Card>

              <Alert className="bg-blue-50 text-blue-800 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30">
                <Info className="h-4 w-4" />
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription>
                  This analysis is provided for informational purposes only and does not constitute legal or tax advice. 
                  Please consult with a qualified Indian tax professional before making decisions based on this information.
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
