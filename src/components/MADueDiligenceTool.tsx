
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, FileText, AlertTriangle, Check, Building, ChevronRight, Info, Clock, CalendarDays, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getGeminiResponse } from '@/components/GeminiProIntegration';
import PdfFileUpload from '@/components/PdfFileUpload';
import { extractTextFromPdf } from '@/utils/pdfExtraction';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DueDiligenceResult {
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
  timestamp?: string;
  targetCompany?: string;
  industry?: string;
}

const MADueDiligenceTool = () => {
  const { toast } = useToast();
  const [targetCompany, setTargetCompany] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [financialData, setFinancialData] = useState<string>('');
  const [dueDiligenceResult, setDueDiligenceResult] = useState<DueDiligenceResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('input');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isPdfProcessing, setIsPdfProcessing] = useState<boolean>(false);
  const [previousAnalyses, setPreviousAnalyses] = useState<DueDiligenceResult[]>([]);

  // Load prior records from localStorage
  useEffect(() => {
    const savedAnalyses = localStorage.getItem('maDueDiligenceHistory');
    if (savedAnalyses) {
      try {
        setPreviousAnalyses(JSON.parse(savedAnalyses));
      } catch (error) {
        console.error('Error loading previous analyses:', error);
      }
    }
  }, []);

  const handlePdfUpload = async () => {
    if (!pdfFile) {
      toast({
        title: "No PDF file selected",
        description: "Please upload a PDF file containing financial data.",
        variant: "destructive",
      });
      return;
    }

    setIsPdfProcessing(true);
    
    try {
      const extractedText = await extractTextFromPdf(pdfFile);
      setFinancialData(prev => {
        const newData = prev ? `${prev}\n\n${extractedText}` : extractedText;
        return newData;
      });
      
      toast({
        title: "PDF Processed Successfully",
        description: "Financial data has been extracted from the PDF.",
      });
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      toast({
        title: "PDF Processing Failed",
        description: "Could not extract data from the PDF. Please try another file.",
        variant: "destructive",
      });
    } finally {
      setIsPdfProcessing(false);
    }
  };

  const generateDueDiligence = async () => {
    if (!targetCompany || !industry || !financialData.trim()) {
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
        Act as a mergers and acquisitions (M&A) due diligence specialist focusing on Indian corporate and commercial laws. Based on the following information, provide a comprehensive risk assessment:
        
        Target Company: ${targetCompany}
        Industry: ${industry}
        Financial Data: ${financialData}
        
        Format your response exactly as follows (do not include any extra text except what fits in these sections):
        
        SUMMARY: A brief summary of the due diligence findings and key observations under Indian law.
        
        RISKS:
        - [HIGH/MEDIUM/LOW]: First risk and explanation with reference to applicable Indian laws
        - [HIGH/MEDIUM/LOW]: Second risk and explanation with reference to applicable Indian laws
        (Include at least 3 risks)
        
        RECOMMENDATIONS:
        - First recommendation with reference to Indian legal requirements
        - Second recommendation with reference to Indian legal requirements
        (Include at least 3 recommendations)
        
        APPLICABLE_LAWS:
        - Law Name 1: Brief description of how it applies to this M&A transaction in India
        - Law Name 2: Brief description of how it applies to this M&A transaction in India
        (Include at least 3 applicable Indian laws or regulations)
        
        Focus specifically on Indian regulatory framework including Companies Act 2013, SEBI regulations, Competition Act 2002, FEMA provisions if applicable, and any sector-specific regulations in India.
      `;

      const response = await getGeminiResponse(prompt);
      
      // Parse the AI response to extract structured data
      const result = parseAIResponse(response);
      
      // Add metadata to result
      const timestamp = new Date().toISOString();
      const resultWithMetadata = {
        ...result,
        timestamp,
        targetCompany,
        industry
      };
      
      setDueDiligenceResult(resultWithMetadata);
      setActiveTab('results');
      
      // Save to history
      const updatedHistory = [resultWithMetadata, ...previousAnalyses.slice(0, 9)]; // Keep only last 10 analyses
      setPreviousAnalyses(updatedHistory);
      localStorage.setItem('maDueDiligenceHistory', JSON.stringify(updatedHistory));
      
      toast({
        title: "Analysis Complete",
        description: "M&A due diligence analysis has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating due diligence analysis:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error generating the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseAIResponse = (response: string): DueDiligenceResult => {
    // Initialize result with default values
    const result: DueDiligenceResult = {
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
    setTargetCompany('');
    setIndustry('');
    setFinancialData('');
    setPdfFile(null);
    setDueDiligenceResult(null);
    setActiveTab('input');
  };

  const loadPriorAnalysis = (analysis: DueDiligenceResult) => {
    setDueDiligenceResult(analysis);
    setActiveTab('results');
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

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(date);
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">Input Details</TabsTrigger>
          <TabsTrigger value="results" disabled={!dueDiligenceResult}>Results</TabsTrigger>
          <TabsTrigger value="history">Prior Analyses ({previousAnalyses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                M&A Due Diligence
              </CardTitle>
              <CardDescription>
                Provide details about the target company and financial data for AI-powered risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="target-company">Target Company Name</Label>
                <Textarea
                  id="target-company"
                  placeholder="Enter the name of the company being evaluated for acquisition..."
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  rows={2}
                  className="resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="industry">Industry Sector</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select industry sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare & Pharma</SelectItem>
                    <SelectItem value="finance">Financial Services</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                    <SelectItem value="retail">Retail & E-commerce</SelectItem>
                    <SelectItem value="realestate">Real Estate</SelectItem>
                    <SelectItem value="hospitality">Hospitality & Tourism</SelectItem>
                    <SelectItem value="telecom">Telecommunications</SelectItem>
                    <SelectItem value="media">Media & Entertainment</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="financial-data">Key Financial Data</Label>
                  <div className="flex items-center gap-2">
                    <PdfFileUpload onChange={setPdfFile} pdfFile={pdfFile} />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handlePdfUpload} 
                      disabled={isPdfProcessing || !pdfFile}
                      className="ml-2"
                    >
                      {isPdfProcessing ? "Processing..." : "Extract Data"}
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="financial-data"
                  placeholder="E.g., Revenue, Net Income, Debt, Assets, Liabilities, Cash Flow, etc... Or upload a PDF document containing financial information."
                  value={financialData}
                  onChange={(e) => setFinancialData(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>Reset</Button>
              <Button 
                onClick={generateDueDiligence} 
                disabled={isAnalyzing || !targetCompany || !industry || !financialData.trim()}
              >
                {isAnalyzing ? "Analyzing..." : "Generate Due Diligence"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          {dueDiligenceResult && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    M&A Due Diligence Analysis
                  </CardTitle>
                  <CardDescription>
                    Based on {dueDiligenceResult.targetCompany || targetCompany} operating in the {dueDiligenceResult.industry || industry} sector
                    {dueDiligenceResult.timestamp && (
                      <span className="block mt-1 text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Analysis generated on {formatDate(dueDiligenceResult.timestamp)}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Summary</h3>
                      <p className="text-gray-700 dark:text-gray-300">{dueDiligenceResult.summary}</p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-amber-500" /> Risk Assessment
                      </h3>
                      <div className="space-y-3">
                        {dueDiligenceResult.risks.map((risk, index) => (
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
                        {dueDiligenceResult.recommendations.map((rec, index) => (
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
                        {dueDiligenceResult.applicableLaws.map((law, index) => (
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
                  This analysis is provided for informational purposes only and does not constitute legal or financial advice. 
                  Please consult with a qualified professional before making decisions based on this information.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Prior Due Diligence Analyses
              </CardTitle>
              <CardDescription>
                View and access your previous M&A due diligence analyses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {previousAnalyses.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p>No prior analyses found. Complete your first analysis to see it here.</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {previousAnalyses.map((analysis, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-start flex-col text-left">
                          <span className="font-medium">{analysis.targetCompany}</span>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <Badge variant="outline">{analysis.industry}</Badge>
                            {analysis.timestamp && (
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" /> 
                                {formatDate(analysis.timestamp)}
                              </span>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.summary}</p>
                          <div className="flex justify-between">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" /> {analysis.risks.length} risks identified
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => loadPriorAnalysis(analysis)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" /> View Full Analysis
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MADueDiligenceTool;
