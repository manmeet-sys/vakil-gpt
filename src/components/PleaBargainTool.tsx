
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { Loader2, FileText, BarChart2, Scale, AlertCircle, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PleaBargainTool = () => {
  const [caseDetails, setCaseDetails] = useState('');
  const [chargeType, setChargeType] = useState('');
  const [criminalHistory, setCriminalHistory] = useState('');
  const [evidenceStrength, setEvidenceStrength] = useState<number[]>([50]);
  const [formValid, setFormValid] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultsData, setResultsData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('case-analysis');
  const { toast } = useToast();

  const validateForm = () => {
    const isValid = caseDetails.trim().length > 0 && chargeType.trim().length > 0;
    setFormValid(isValid);
    return isValid;
  };

  React.useEffect(() => {
    validateForm();
  }, [caseDetails, chargeType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide all required case details"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const apiKey = localStorage.getItem('geminiApiKey');
      
      if (!apiKey) {
        throw new Error("Please set your Gemini API key in the settings");
      }

      const analysis = await generatePleaBargainAnalysis(apiKey);
      setResultsData(analysis);
      setShowResult(true);
      setActiveTab('analysis-results');
      
      toast({
        title: "Analysis Complete",
        description: "Plea bargain analysis has been generated successfully"
      });
    } catch (error) {
      console.error('Error generating plea bargain analysis:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to generate plea bargain analysis"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePleaBargainAnalysis = async (apiKey: string): Promise<any> => {
    // Format the prompt for the Gemini API
    const prompt = `
Act as an experienced criminal defense attorney analyzing a potential plea bargain situation. Provide a comprehensive analysis and strategic approach based on the following case details:

CASE DETAILS:
${caseDetails}

CHARGE TYPE: 
${chargeType}

CRIMINAL HISTORY: 
${criminalHistory || "None/Not provided"}

EVIDENCE STRENGTH (on a scale of 0-100): 
${evidenceStrength[0]}

Please provide a comprehensive plea bargain analysis that includes:

1. CASE ASSESSMENT: Detailed analysis of the case strengths and weaknesses
2. PLEA OPTIONS: Specific potential plea bargain scenarios with pros and cons
3. SENTENCING ESTIMATES: Comparative analysis of trial conviction vs. plea options
4. STRATEGIC RECOMMENDATIONS: Clear actionable advice on how to proceed
5. RISK ANALYSIS: Probability assessment of various outcomes
6. PROCEDURAL TIMELINE: Expected steps and timeline for the plea process

Format your response as a structured legal analysis with clear, detailed sections that would assist a defense attorney in advising their client. Include relevant legal standards, precedents, and practice insights where appropriate.
`;

    // Call the Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: prompt }] }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 4000,
          topP: 0.95,
          topK: 40
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
      const responseText = data.candidates[0].content.parts[0].text;
      
      // Process and structure the response
      const sections = parseAnalysisIntoSections(responseText);
      return sections;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  };

  const parseAnalysisIntoSections = (text: string) => {
    // Simple parsing to extract sections from the Gemini response
    const sections = {
      caseAssessment: extractSection(text, "CASE ASSESSMENT", ["PLEA OPTIONS", "1. CASE ASSESSMENT", "2. PLEA OPTIONS"]),
      pleaOptions: extractSection(text, "PLEA OPTIONS", ["SENTENCING ESTIMATES", "2. PLEA OPTIONS", "3. SENTENCING ESTIMATES"]),
      sentencingEstimates: extractSection(text, "SENTENCING ESTIMATES", ["STRATEGIC RECOMMENDATIONS", "3. SENTENCING ESTIMATES", "4. STRATEGIC RECOMMENDATIONS"]),
      strategicRecommendations: extractSection(text, "STRATEGIC RECOMMENDATIONS", ["RISK ANALYSIS", "4. STRATEGIC RECOMMENDATIONS", "5. RISK ANALYSIS"]),
      riskAnalysis: extractSection(text, "RISK ANALYSIS", ["PROCEDURAL TIMELINE", "5. RISK ANALYSIS", "6. PROCEDURAL TIMELINE"]),
      proceduralTimeline: extractSection(text, "PROCEDURAL TIMELINE", ["", "6. PROCEDURAL TIMELINE", ""]),
      fullText: text
    };
    
    return sections;
  };

  const extractSection = (text: string, sectionName: string, possibleNextSections: string[]) => {
    // Find where this section starts
    let startIndex = -1;
    
    // Try different possible section headers
    for (const possibleHeader of [sectionName, `${sectionName}:`, `# ${sectionName}`, `## ${sectionName}`]) {
      startIndex = text.indexOf(possibleHeader);
      if (startIndex !== -1) {
        startIndex += possibleHeader.length;
        break;
      }
    }
    
    if (startIndex === -1) return "";
    
    // Find where this section ends (the start of the next section)
    let endIndex = text.length;
    
    for (const nextSection of possibleNextSections) {
      if (!nextSection) continue;
      
      const idx = text.indexOf(nextSection, startIndex);
      if (idx !== -1 && idx < endIndex) {
        endIndex = idx;
      }
    }
    
    return text.substring(startIndex, endIndex).trim();
  };

  const renderResults = () => {
    if (!resultsData) return null;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-600" />
              Plea Bargain Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="case-assessment" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="case-assessment">Case Assessment</TabsTrigger>
                <TabsTrigger value="plea-options">Plea Options</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="case-assessment">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Case Strengths & Weaknesses</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-line text-sm">{resultsData.caseAssessment}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Risk Analysis</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-line text-sm">{resultsData.riskAnalysis}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="plea-options">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Available Plea Options</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-line text-sm">{resultsData.pleaOptions}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Sentencing Estimates</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-line text-sm">{resultsData.sentencingEstimates}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recommendations">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Strategic Recommendations</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-line text-sm">{resultsData.strategicRecommendations}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Timeline & Next Steps</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-line text-sm">{resultsData.proceduralTimeline}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6">
              <Accordion type="single" collapsible>
                <AccordionItem value="full-analysis">
                  <AccordionTrigger>View Full Analysis</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <pre className="text-xs whitespace-pre-wrap">{resultsData.fullText}</pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="case-analysis">Case Details</TabsTrigger>
          <TabsTrigger value="analysis-results" disabled={!showResult}>Analysis Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="case-analysis">
          <Card>
            <CardHeader>
              <CardTitle>Enter Case Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="charge-type" className="text-base">
                      Charge Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={chargeType} onValueChange={setChargeType}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select charge type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="drug-possession">Drug Possession</SelectItem>
                        <SelectItem value="drug-trafficking">Drug Trafficking</SelectItem>
                        <SelectItem value="assault-battery">Assault & Battery</SelectItem>
                        <SelectItem value="theft">Theft/Larceny</SelectItem>
                        <SelectItem value="fraud">Fraud/White Collar</SelectItem>
                        <SelectItem value="dui">DUI/DWI</SelectItem>
                        <SelectItem value="weapons">Weapons Charges</SelectItem>
                        <SelectItem value="homicide">Homicide</SelectItem>
                        <SelectItem value="domestic-violence">Domestic Violence</SelectItem>
                        <SelectItem value="sexual-offense">Sexual Offense</SelectItem>
                        <SelectItem value="other">Other Criminal Charge</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="case-details" className="text-base">
                      Case Details <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="case-details"
                      placeholder="Describe the case, including details of the alleged offense, circumstances, location, time, witnesses, and any other relevant information."
                      value={caseDetails}
                      onChange={(e) => setCaseDetails(e.target.value)}
                      className="min-h-[150px] mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="criminal-history" className="text-base">
                      Criminal History (if any)
                    </Label>
                    <Textarea
                      id="criminal-history"
                      placeholder="Describe any prior convictions, arrests, or legal issues that may be relevant to this case."
                      value={criminalHistory}
                      onChange={(e) => setCriminalHistory(e.target.value)}
                      className="min-h-[80px] mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-base">
                      Strength of Evidence (estimated)
                    </Label>
                    <div className="pt-6 pb-2">
                      <Slider
                        value={evidenceStrength}
                        onValueChange={setEvidenceStrength}
                        max={100}
                        step={1}
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>Weak (0)</span>
                        <span>Moderate (50)</span>
                        <span>Strong (100)</span>
                      </div>
                      <div className="text-center mt-2 font-medium">
                        Current: {evidenceStrength[0]}%
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!formValid || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Analysis...
                    </>
                  ) : (
                    'Generate Plea Bargain Analysis'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis-results">
          {renderResults()}
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Important Legal Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-500 dark:text-gray-400">
          <p>
            This tool provides general information and analysis for educational purposes only. It does not constitute legal advice, 
            and no attorney-client relationship is formed by using this tool. The analysis generated is based on the information 
            provided and should be reviewed by a qualified attorney familiar with your specific case and jurisdiction. 
            Legal outcomes vary greatly based on jurisdiction, court, judge, and many other factors not captured by this tool.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PleaBargainTool;
