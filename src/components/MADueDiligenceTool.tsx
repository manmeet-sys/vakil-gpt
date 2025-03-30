
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, FileText, CheckCircle, AlertCircle, AlertTriangle, Briefcase, Search, Upload, Loader2, Download, BarChart, FileCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getGeminiResponse } from './GeminiProIntegration';

interface RiskArea {
  id: string;
  name: string;
  score: number;
  findings: string[];
  recommendations: string[];
}

interface DueDiligenceReport {
  overallScore: number;
  summary: string;
  keyFindings: string[];
  riskAreas: RiskArea[];
  recommendations: string[];
}

const MADueDiligenceTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState('transaction');
  const [transactionDetails, setTransactionDetails] = useState({
    dealType: '',
    targetCompany: '',
    acquiringCompany: '',
    industry: '',
    dealValue: '',
    closingTimeline: '',
    jurisdiction: '',
    dealDescription: '',
  });
  
  const [financialData, setFinancialData] = useState({
    revenueGrowth: '',
    profitMargin: '',
    debtToEquity: '',
    cashFlow: '',
    contingentLiabilities: '',
    taxCompliance: false,
    auditedStatements: false,
    accountingIssues: false,
    notes: '',
  });
  
  const [legalCompliance, setLegalCompliance] = useState({
    pendingLitigation: false,
    regulatoryIssues: false,
    intellectualProperty: false,
    employmentIssues: false,
    contractualObligations: false,
    environmentalCompliance: false,
    dataPrivacy: false,
    notes: '',
  });
  
  const [operationalInfo, setOperationalInfo] = useState({
    keyCustomers: '',
    supplierDependencies: '',
    operationalRedFlags: '',
    integrationChallenges: '',
    technologySystems: '',
    cybersecurityConcerns: false,
    notes: '',
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<DueDiligenceReport | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [apiProvider, setApiProvider] = useState<'deepseek' | 'gemini'>('gemini');
  const { toast } = useToast();
  
  // Load API key on component mount
  useEffect(() => {
    const storedApiProvider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
    setApiProvider(storedApiProvider);
    const storedApiKey = localStorage.getItem(`${storedApiProvider}ApiKey`) || (storedApiProvider === 'gemini' ? 'AIzaSyCpX8FmPojP3E4dDqsmi0EtRjDKXGh9SBc' : '');
    setApiKey(storedApiKey);
  }, []);
  
  const handleTransactionChange = (field: string, value: string) => {
    setTransactionDetails(prev => ({ ...prev, [field]: value }));
  };
  
  const handleFinancialChange = (field: string, value: any) => {
    setFinancialData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleLegalChange = (field: string, value: any) => {
    setLegalCompliance(prev => ({ ...prev, [field]: value }));
  };
  
  const handleOperationalChange = (field: string, value: any) => {
    setOperationalInfo(prev => ({ ...prev, [field]: value }));
  };
  
  const generateDueDiligenceReport = async () => {
    if (!transactionDetails.targetCompany || !transactionDetails.dealType) {
      toast({
        title: "Missing Information",
        description: "Please provide at least the target company and deal type",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Generate due diligence report using AI
      const prompt = `You are an M&A due diligence expert. Based on the following information, provide a comprehensive due diligence report for this potential transaction:
      
      TRANSACTION DETAILS:
      - Deal Type: ${transactionDetails.dealType}
      - Target Company: ${transactionDetails.targetCompany}
      - Acquiring Company: ${transactionDetails.acquiringCompany || "Not provided"}
      - Industry: ${transactionDetails.industry || "Not provided"}
      - Deal Value: ${transactionDetails.dealValue || "Not provided"}
      - Closing Timeline: ${transactionDetails.closingTimeline || "Not provided"}
      - Jurisdiction: ${transactionDetails.jurisdiction || "Not provided"}
      - Deal Description: ${transactionDetails.dealDescription || "Not provided"}
      
      FINANCIAL INFORMATION:
      - Revenue Growth: ${financialData.revenueGrowth || "Not provided"}
      - Profit Margin: ${financialData.profitMargin || "Not provided"}
      - Debt-to-Equity Ratio: ${financialData.debtToEquity || "Not provided"}
      - Cash Flow: ${financialData.cashFlow || "Not provided"}
      - Contingent Liabilities: ${financialData.contingentLiabilities || "Not provided"}
      - Tax Compliance Issues: ${financialData.taxCompliance ? "Yes" : "No"}
      - Audited Financial Statements: ${financialData.auditedStatements ? "Yes" : "No"}
      - Accounting Irregularities: ${financialData.accountingIssues ? "Yes" : "No"}
      - Financial Notes: ${financialData.notes || "Not provided"}
      
      LEGAL & COMPLIANCE:
      - Pending Litigation: ${legalCompliance.pendingLitigation ? "Yes" : "No"}
      - Regulatory Issues: ${legalCompliance.regulatoryIssues ? "Yes" : "No"}
      - Intellectual Property Concerns: ${legalCompliance.intellectualProperty ? "Yes" : "No"}
      - Employment Issues: ${legalCompliance.employmentIssues ? "Yes" : "No"}
      - Material Contractual Obligations: ${legalCompliance.contractualObligations ? "Yes" : "No"}
      - Environmental Compliance Issues: ${legalCompliance.environmentalCompliance ? "Yes" : "No"}
      - Data Privacy Concerns: ${legalCompliance.dataPrivacy ? "Yes" : "No"}
      - Legal Notes: ${legalCompliance.notes || "Not provided"}
      
      OPERATIONAL INFORMATION:
      - Key Customer Relationships: ${operationalInfo.keyCustomers || "Not provided"}
      - Supplier Dependencies: ${operationalInfo.supplierDependencies || "Not provided"}
      - Operational Red Flags: ${operationalInfo.operationalRedFlags || "Not provided"}
      - Integration Challenges: ${operationalInfo.integrationChallenges || "Not provided"}
      - Technology Systems: ${operationalInfo.technologySystems || "Not provided"}
      - Cybersecurity Concerns: ${operationalInfo.cybersecurityConcerns ? "Yes" : "No"}
      - Operational Notes: ${operationalInfo.notes || "Not provided"}
      
      Please provide a structured report with:
      1. An overall risk score from 0-100 (where 100 is minimal risk)
      2. A summary of key findings
      3. Detailed analysis of risk areas
      4. Recommendations for further due diligence
      
      Format your response as a structured JSON object with these fields.`;
      
      const aiResponse = await getGeminiResponse(prompt, apiKey);
      
      // Parse the JSON response if possible
      try {
        // Extract JSON from the response if it contains text
        const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                           aiResponse.match(/```\n([\s\S]*?)\n```/) || 
                           aiResponse.match(/{[\s\S]*?}/);
                           
        const jsonStr = jsonMatch ? jsonMatch[0].replace(/```json\n|```\n|```/g, '') : aiResponse;
        const parsedResponse = JSON.parse(jsonStr);
        
        setReport(parsedResponse);
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        
        // Create a manually formatted result based on the input data
        const defaultReport: DueDiligenceReport = {
          overallScore: calculateDefaultRiskScore(),
          summary: `Initial due diligence assessment for ${transactionDetails.targetCompany} acquisition by ${transactionDetails.acquiringCompany || "acquiring company"}.`,
          keyFindings: extractKeyPoints(aiResponse),
          riskAreas: [
            {
              id: "financial",
              name: "Financial Risks",
              score: calculateFinancialRiskScore(),
              findings: extractFindingsForArea(aiResponse, "financial"),
              recommendations: ["Conduct detailed financial audit", "Review tax compliance history"]
            },
            {
              id: "legal",
              name: "Legal & Compliance Risks",
              score: calculateLegalRiskScore(),
              findings: extractFindingsForArea(aiResponse, "legal"),
              recommendations: ["Review all pending litigation", "Assess regulatory compliance history"]
            },
            {
              id: "operational",
              name: "Operational Risks",
              score: calculateOperationalRiskScore(),
              findings: extractFindingsForArea(aiResponse, "operational"),
              recommendations: ["Evaluate key customer relationships", "Assess technology integration challenges"]
            }
          ],
          recommendations: extractRecommendations(aiResponse)
        };
        
        setReport(defaultReport);
      }
      
      setActiveTab('results');
      
      toast({
        title: "Analysis Complete",
        description: "M&A due diligence report has been generated",
      });
    } catch (error) {
      console.error("Error generating due diligence report:", error);
      toast({
        title: "Error",
        description: "Failed to generate due diligence report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const calculateDefaultRiskScore = (): number => {
    let score = 70; // Start with a moderate score
    
    // Adjust based on financial factors
    if (financialData.accountingIssues) score -= 15;
    if (!financialData.auditedStatements) score -= 10;
    if (financialData.taxCompliance) score -= 10;
    
    // Adjust based on legal factors
    if (legalCompliance.pendingLitigation) score -= 15;
    if (legalCompliance.regulatoryIssues) score -= 12;
    if (legalCompliance.intellectualProperty) score -= 10;
    if (legalCompliance.environmentalCompliance) score -= 8;
    if (legalCompliance.dataPrivacy) score -= 8;
    
    // Adjust based on operational factors
    if (operationalInfo.cybersecurityConcerns) score -= 10;
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  };
  
  const calculateFinancialRiskScore = (): number => {
    let score = 80;
    if (financialData.accountingIssues) score -= 25;
    if (!financialData.auditedStatements) score -= 15;
    if (financialData.taxCompliance) score -= 20;
    return Math.max(0, Math.min(100, score));
  };
  
  const calculateLegalRiskScore = (): number => {
    let score = 75;
    if (legalCompliance.pendingLitigation) score -= 20;
    if (legalCompliance.regulatoryIssues) score -= 15;
    if (legalCompliance.intellectualProperty) score -= 15;
    if (legalCompliance.environmentalCompliance) score -= 10;
    if (legalCompliance.dataPrivacy) score -= 10;
    return Math.max(0, Math.min(100, score));
  };
  
  const calculateOperationalRiskScore = (): number => {
    let score = 85;
    if (operationalInfo.cybersecurityConcerns) score -= 15;
    return Math.max(0, Math.min(100, score));
  };
  
  const extractKeyPoints = (text: string): string[] => {
    const findingsRegex = /(?:key findings|key points|main findings)(?::|include|are)?\s*((?:[-•].*?(?:\n|$))+)/i;
    const match = text.match(findingsRegex);
    
    if (match && match[1]) {
      return match[1].split(/[-•]/).filter(s => s.trim()).map(s => s.trim());
    }
    
    // Default findings if none found
    return [
      "Transaction requires comprehensive financial due diligence",
      "Legal compliance issues identified that need further investigation",
      "Operational integration may present challenges"
    ];
  };
  
  const extractFindingsForArea = (text: string, area: string): string[] => {
    const regex = new RegExp(`(?:${area} risks?|${area} findings|${area} issues)(?::|include|are)?\s*((?:[-•].*?(?:\n|$))+)`, 'i');
    const match = text.match(regex);
    
    if (match && match[1]) {
      return match[1].split(/[-•]/).filter(s => s.trim()).map(s => s.trim());
    }
    
    // Default findings for each area
    if (area === 'financial') {
      return financialData.accountingIssues ? ["Accounting irregularities identified"] : 
             !financialData.auditedStatements ? ["No audited financial statements available"] : 
             ["Financial review needed"];
    } else if (area === 'legal') {
      return legalCompliance.pendingLitigation ? ["Pending litigation identified"] : 
             legalCompliance.regulatoryIssues ? ["Regulatory compliance issues present"] : 
             ["Legal review needed"];
    } else {
      return operationalInfo.cybersecurityConcerns ? ["Cybersecurity vulnerabilities identified"] : 
             ["Operational assessment needed"];
    }
  };
  
  const extractRecommendations = (text: string): string[] => {
    const recommendationsRegex = /(?:recommendations|recommended actions|next steps)(?::|include|are)?\s*((?:[-•].*?(?:\n|$))+)/i;
    const match = text.match(recommendationsRegex);
    
    if (match && match[1]) {
      return match[1].split(/[-•]/).filter(s => s.trim()).map(s => s.trim());
    }
    
    // Default recommendations if none found
    return [
      "Conduct comprehensive financial audit with third-party accounting firm",
      "Perform legal compliance review focusing on identified risk areas",
      "Assess operational integration feasibility and timeline",
      "Review customer contracts and relationships for potential issues",
      "Evaluate technology systems and cybersecurity posture"
    ];
  };
  
  const getRiskColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };
  
  const getRiskLabel = (score: number): string => {
    if (score >= 80) return "Low Risk";
    if (score >= 60) return "Medium Risk";
    return "High Risk";
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="transaction">
            <Briefcase className="mr-2 h-4 w-4" />
            Transaction
          </TabsTrigger>
          <TabsTrigger value="financial">
            <TrendingUp className="mr-2 h-4 w-4" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="legal">
            <FileCheck className="mr-2 h-4 w-4" />
            Legal
          </TabsTrigger>
          <TabsTrigger value="operational">
            <BarChart className="mr-2 h-4 w-4" />
            Operational
          </TabsTrigger>
          <TabsTrigger value="results">
            <CheckCircle className="mr-2 h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>
        
        {/* Transaction Details Tab */}
        <TabsContent value="transaction">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>
                Enter basic information about the M&A transaction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dealType">Deal Type <span className="text-red-500">*</span></Label>
                  <Select 
                    value={transactionDetails.dealType} 
                    onValueChange={(value) => handleTransactionChange('dealType', value)}
                  >
                    <SelectTrigger id="dealType">
                      <SelectValue placeholder="Select deal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acquisition">Acquisition</SelectItem>
                      <SelectItem value="merger">Merger</SelectItem>
                      <SelectItem value="asset-purchase">Asset Purchase</SelectItem>
                      <SelectItem value="stock-purchase">Stock Purchase</SelectItem>
                      <SelectItem value="joint-venture">Joint Venture</SelectItem>
                      <SelectItem value="minority-investment">Minority Investment</SelectItem>
                      <SelectItem value="majority-investment">Majority Investment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetCompany">Target Company <span className="text-red-500">*</span></Label>
                  <Input 
                    id="targetCompany" 
                    value={transactionDetails.targetCompany}
                    onChange={(e) => handleTransactionChange('targetCompany', e.target.value)}
                    placeholder="Company being acquired"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="acquiringCompany">Acquiring Company</Label>
                  <Input 
                    id="acquiringCompany" 
                    value={transactionDetails.acquiringCompany}
                    onChange={(e) => handleTransactionChange('acquiringCompany', e.target.value)}
                    placeholder="Company making the acquisition"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input 
                    id="industry" 
                    value={transactionDetails.industry}
                    onChange={(e) => handleTransactionChange('industry', e.target.value)}
                    placeholder="Primary industry of target company"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dealValue">Approximate Deal Value</Label>
                  <Input 
                    id="dealValue" 
                    value={transactionDetails.dealValue}
                    onChange={(e) => handleTransactionChange('dealValue', e.target.value)}
                    placeholder="e.g. $10M"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="closingTimeline">Expected Closing Timeline</Label>
                  <Input 
                    id="closingTimeline" 
                    value={transactionDetails.closingTimeline}
                    onChange={(e) => handleTransactionChange('closingTimeline', e.target.value)}
                    placeholder="e.g. Q4 2023"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jurisdiction">Primary Jurisdiction</Label>
                  <Input 
                    id="jurisdiction" 
                    value={transactionDetails.jurisdiction}
                    onChange={(e) => handleTransactionChange('jurisdiction', e.target.value)}
                    placeholder="Primary legal jurisdiction"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dealDescription">Transaction Description</Label>
                <Textarea 
                  id="dealDescription" 
                  value={transactionDetails.dealDescription}
                  onChange={(e) => handleTransactionChange('dealDescription', e.target.value)}
                  placeholder="Describe the purpose and structure of the transaction"
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setActiveTab('financial')}>
                  Next: Financial Information
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Financial Information Tab */}
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
              <CardDescription>
                Enter key financial metrics and concerns for the target company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="revenueGrowth">Revenue Growth Rate</Label>
                  <Input 
                    id="revenueGrowth" 
                    value={financialData.revenueGrowth}
                    onChange={(e) => handleFinancialChange('revenueGrowth', e.target.value)}
                    placeholder="e.g. 15% YoY"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profitMargin">Profit Margin</Label>
                  <Input 
                    id="profitMargin" 
                    value={financialData.profitMargin}
                    onChange={(e) => handleFinancialChange('profitMargin', e.target.value)}
                    placeholder="e.g. 22%"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="debtToEquity">Debt-to-Equity Ratio</Label>
                  <Input 
                    id="debtToEquity" 
                    value={financialData.debtToEquity}
                    onChange={(e) => handleFinancialChange('debtToEquity', e.target.value)}
                    placeholder="e.g. 0.8"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cashFlow">Cash Flow Status</Label>
                  <Input 
                    id="cashFlow" 
                    value={financialData.cashFlow}
                    onChange={(e) => handleFinancialChange('cashFlow', e.target.value)}
                    placeholder="e.g. Positive, $5M annually"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contingentLiabilities">Contingent Liabilities</Label>
                  <Input 
                    id="contingentLiabilities" 
                    value={financialData.contingentLiabilities}
                    onChange={(e) => handleFinancialChange('contingentLiabilities', e.target.value)}
                    placeholder="Any significant potential liabilities"
                  />
                </div>
              </div>
              
              <div className="space-y-4 mt-4">
                <h3 className="text-sm font-medium">Financial Risk Factors</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="taxCompliance" 
                      checked={financialData.taxCompliance}
                      onCheckedChange={(checked) => handleFinancialChange('taxCompliance', checked)}
                    />
                    <Label htmlFor="taxCompliance">Tax compliance issues identified</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="auditedStatements" 
                      checked={financialData.auditedStatements}
                      onCheckedChange={(checked) => handleFinancialChange('auditedStatements', checked)}
                    />
                    <Label htmlFor="auditedStatements">Audited financial statements available</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="accountingIssues" 
                      checked={financialData.accountingIssues}
                      onCheckedChange={(checked) => handleFinancialChange('accountingIssues', checked)}
                    />
                    <Label htmlFor="accountingIssues">Accounting irregularities or restatements</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="financialNotes">Additional Financial Notes</Label>
                <Textarea 
                  id="financialNotes" 
                  value={financialData.notes}
                  onChange={(e) => handleFinancialChange('notes', e.target.value)}
                  placeholder="Additional financial information or concerns"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab('transaction')}>
                  Previous: Transaction Details
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('legal')}>
                  Next: Legal & Compliance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Legal & Compliance Tab */}
        <TabsContent value="legal">
          <Card>
            <CardHeader>
              <CardTitle>Legal & Compliance</CardTitle>
              <CardDescription>
                Identify potential legal risks and compliance issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Legal Risk Factors</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pendingLitigation" 
                      checked={legalCompliance.pendingLitigation}
                      onCheckedChange={(checked) => handleLegalChange('pendingLitigation', checked)}
                    />
                    <Label htmlFor="pendingLitigation">Pending litigation or legal disputes</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="regulatoryIssues" 
                      checked={legalCompliance.regulatoryIssues}
                      onCheckedChange={(checked) => handleLegalChange('regulatoryIssues', checked)}
                    />
                    <Label htmlFor="regulatoryIssues">Regulatory compliance issues</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="intellectualProperty" 
                      checked={legalCompliance.intellectualProperty}
                      onCheckedChange={(checked) => handleLegalChange('intellectualProperty', checked)}
                    />
                    <Label htmlFor="intellectualProperty">Intellectual property concerns</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="employmentIssues" 
                      checked={legalCompliance.employmentIssues}
                      onCheckedChange={(checked) => handleLegalChange('employmentIssues', checked)}
                    />
                    <Label htmlFor="employmentIssues">Employment or labor issues</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="contractualObligations" 
                      checked={legalCompliance.contractualObligations}
                      onCheckedChange={(checked) => handleLegalChange('contractualObligations', checked)}
                    />
                    <Label htmlFor="contractualObligations">Material contractual obligations</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="environmentalCompliance" 
                      checked={legalCompliance.environmentalCompliance}
                      onCheckedChange={(checked) => handleLegalChange('environmentalCompliance', checked)}
                    />
                    <Label htmlFor="environmentalCompliance">Environmental compliance issues</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="dataPrivacy" 
                      checked={legalCompliance.dataPrivacy}
                      onCheckedChange={(checked) => handleLegalChange('dataPrivacy', checked)}
                    />
                    <Label htmlFor="dataPrivacy">Data privacy or cybersecurity legal concerns</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="legalNotes">Legal Notes</Label>
                <Textarea 
                  id="legalNotes" 
                  value={legalCompliance.notes}
                  onChange={(e) => handleLegalChange('notes', e.target.value)}
                  placeholder="Additional details about legal issues or compliance concerns"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab('financial')}>
                  Previous: Financial Information
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('operational')}>
                  Next: Operational Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Operational Information Tab */}
        <TabsContent value="operational">
          <Card>
            <CardHeader>
              <CardTitle>Operational Assessment</CardTitle>
              <CardDescription>
                Evaluate operational aspects and integration considerations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="keyCustomers">Key Customer Relationships</Label>
                  <Textarea 
                    id="keyCustomers" 
                    value={operationalInfo.keyCustomers}
                    onChange={(e) => handleOperationalChange('keyCustomers', e.target.value)}
                    placeholder="Information about major customers and relationship stability"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supplierDependencies">Supplier Dependencies</Label>
                  <Textarea 
                    id="supplierDependencies" 
                    value={operationalInfo.supplierDependencies}
                    onChange={(e) => handleOperationalChange('supplierDependencies', e.target.value)}
                    placeholder="Key suppliers and supply chain risks"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="operationalRedFlags">Operational Red Flags</Label>
                  <Textarea 
                    id="operationalRedFlags" 
                    value={operationalInfo.operationalRedFlags}
                    onChange={(e) => handleOperationalChange('operationalRedFlags', e.target.value)}
                    placeholder="Any operational concerns or inefficiencies"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="integrationChallenges">Integration Challenges</Label>
                  <Textarea 
                    id="integrationChallenges" 
                    value={operationalInfo.integrationChallenges}
                    onChange={(e) => handleOperationalChange('integrationChallenges', e.target.value)}
                    placeholder="Potential challenges in post-acquisition integration"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="technologySystems">Technology Systems</Label>
                  <Textarea 
                    id="technologySystems" 
                    value={operationalInfo.technologySystems}
                    onChange={(e) => handleOperationalChange('technologySystems', e.target.value)}
                    placeholder="Key technology systems and compatibility issues"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cybersecurityConcerns" 
                        checked={operationalInfo.cybersecurityConcerns}
                        onCheckedChange={(checked) => handleOperationalChange('cybersecurityConcerns', checked)}
                      />
                      <Label htmlFor="cybersecurityConcerns">Cybersecurity or data protection concerns</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="operationalNotes">Additional Operational Notes</Label>
                    <Textarea 
                      id="operationalNotes" 
                      value={operationalInfo.notes}
                      onChange={(e) => handleOperationalChange('notes', e.target.value)}
                      placeholder="Any other operational details or risk factors"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setActiveTab('legal')}>
                  Previous: Legal & Compliance
                </Button>
                
                <Button 
                  onClick={generateDueDiligenceReport}
                  disabled={isAnalyzing || !transactionDetails.targetCompany || !transactionDetails.dealType}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Generate Due Diligence Report
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Results Tab */}
        <TabsContent value="results">
          {!report ? (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Due Diligence Report Generated</h3>
                <p className="text-muted-foreground mb-4">
                  Complete the transaction information and risk assessments, then generate a report to see results.
                </p>
                <Button variant="outline" onClick={() => setActiveTab('transaction')}>
                  Go to Transaction Details
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>M&A Due Diligence Report</CardTitle>
                  <CardDescription>
                    {transactionDetails.targetCompany} - {transactionDetails.dealType.charAt(0).toUpperCase() + transactionDetails.dealType.slice(1)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Overall Risk Assessment</h3>
                      <span className={`font-bold text-lg ${getRiskColor(report.overallScore)}`}>
                        {report.overallScore}/100 ({getRiskLabel(report.overallScore)})
                      </span>
                    </div>
                    <Progress 
                      value={report.overallScore} 
                      className="h-3" 
                      indicatorClassName={report.overallScore >= 80 ? "bg-green-500" : report.overallScore >= 60 ? "bg-yellow-500" : "bg-red-500"}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Executive Summary</h3>
                    <p className="text-muted-foreground">
                      {report.summary}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Key Findings</h3>
                    <ul className="space-y-1">
                      {report.keyFindings.map((finding, i) => (
                        <li key={i} className="flex items-start">
                          <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 h-5 w-5 mr-3 mt-0.5 text-xs font-medium">
                            {i + 1}
                          </span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-6">
                    <h3 className="font-medium mb-4">Risk Area Analysis</h3>
                    
                    {report.riskAreas.map((area) => (
                      <div key={area.id} className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{area.name}</h4>
                          <span className={`font-medium ${getRiskColor(area.score)}`}>
                            {area.score}/100 ({getRiskLabel(area.score)})
                          </span>
                        </div>
                        <Progress 
                          value={area.score} 
                          className="h-2 mb-4" 
                          indicatorClassName={area.score >= 80 ? "bg-green-500" : area.score >= 60 ? "bg-yellow-500" : "bg-red-500"}
                        />
                        
                        <div className="ml-2">
                          <h5 className="text-sm font-medium mb-1">Findings:</h5>
                          <ul className="space-y-1 mb-3">
                            {area.findings.map((finding, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start">
                                <span className="text-muted-foreground mr-2">•</span>
                                <span>{finding}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <h5 className="text-sm font-medium mb-1">Recommendations:</h5>
                          <ul className="space-y-1">
                            {area.recommendations.map((rec, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start">
                                <span className="text-muted-foreground mr-2">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {report.recommendations.map((step, i) => (
                      <li key={i} className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                          {i + 1}
                        </div>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('operational')}>
                  Back to Operational Assessment
                </Button>
                
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MADueDiligenceTool;
