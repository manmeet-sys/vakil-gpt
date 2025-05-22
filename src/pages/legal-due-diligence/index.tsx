import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Scale, FileText, Loader2, Upload, IndianRupee, BookOpen, Building, Landmark, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getGeminiResponse } from '@/components/GeminiProIntegration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LegalDueDiligencePage = () => {
  const [transactionType, setTransactionType] = useState<string>('');
  const [dueDiligenceInfo, setDueDiligenceInfo] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string>('');
  const { toast } = useToast();
  const [apiProvider, setApiProvider] = useState<'deepseek' | 'gemini'>('gemini');
  const [activeTab, setActiveTab] = useState<string>('transaction-details');
  const [industryType, setIndustryType] = useState<string>('');
  const [indianJurisdiction, setIndianJurisdiction] = useState<string>('national');

  React.useEffect(() => {
    const storedApiProvider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
    setApiProvider(storedApiProvider);
  }, []);

  const handleGenerateDueDiligence = async () => {
    if (!transactionType || !dueDiligenceInfo.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsGenerating(true);

    try {
      let dueDiligenceResults = '';
      
      if (apiProvider === 'gemini') {
        dueDiligenceResults = await generateGeminiDueDiligenceResults();
      } else if (apiProvider === 'deepseek') {
        dueDiligenceResults = await generateDeepSeekDueDiligenceResults();
      }

      setResults(dueDiligenceResults);
      toast({
        title: "Due Diligence Complete",
        description: "Your Indian legal due diligence report has been generated",
      });
      setActiveTab('results');
    } catch (error) {
      console.error('Error generating due diligence report:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate due diligence report",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateGeminiDueDiligenceResults = async (): Promise<string> => {
    const systemPrompt = `You are VakilGPT's legal due diligence specialist with expertise in Indian corporate and commercial law.
    
    Generate a comprehensive legal due diligence report based on the following information:
    - Transaction Type: ${transactionType}
    - Industry: ${industryType || "Not specified"}
    - Jurisdiction in India: ${indianJurisdiction}
    - Transaction Details: ${dueDiligenceInfo}
    
    Include:
    1. Key areas of legal due diligence required for this transaction under Indian law
    2. Document checklist and information requirements specific to Indian jurisdiction
    3. Potential legal issues to investigate under relevant Indian laws
    4. Risk assessment framework based on Indian regulatory environment
    5. Due diligence process recommendations compliant with Indian legal practices
    6. Relevant Indian legal considerations with specific references to:
       - Companies Act, 2013
       - Indian Contract Act, 1872
       - Competition Act, 2002
       - Foreign Exchange Management Act, 1999 (if applicable)
       - Income Tax Act, 1961
       - Bharatiya Nyaya Sanhita, 2023 compliance (replacing IPC) if relevant
       - Relevant state-specific regulations when applicable
    7. References to relevant Supreme Court and High Court precedents
    
    Format your response as a professional due diligence report with clear sections.`;

    return await getGeminiResponse(systemPrompt);
  };

  const generateDeepSeekDueDiligenceResults = async (): Promise<string> => {
    const systemPrompt = `You are VakilGPT's legal due diligence specialist with expertise in Indian corporate and commercial law.
    
    Generate a comprehensive legal due diligence report based on the following information:
    - Transaction Type: ${transactionType}
    - Industry: ${industryType || "Not specified"}
    - Jurisdiction in India: ${indianJurisdiction}
    - Transaction Details: ${dueDiligenceInfo}
    
    Include:
    1. Key areas of legal due diligence required for this transaction under Indian law
    2. Document checklist and information requirements specific to Indian jurisdiction
    3. Potential legal issues to investigate under relevant Indian laws
    4. Risk assessment framework based on Indian regulatory environment
    5. Due diligence process recommendations compliant with Indian legal practices
    6. Relevant Indian legal considerations with specific references to:
       - Companies Act, 2013
       - Indian Contract Act, 1872
       - Competition Act, 2002
       - Foreign Exchange Management Act, 1999 (if applicable)
       - Income Tax Act, 1961
       - Bharatiya Nyaya Sanhita, 2023 compliance (replacing IPC) if relevant
       - Relevant state-specific regulations when applicable
    7. References to relevant Supreme Court and High Court precedents
    
    Format your response as a professional due diligence report with clear sections.`;
    
    return await getGeminiResponse(systemPrompt);
  };

  const industryOptions = [
    { value: 'technology', label: 'Technology & IT' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'pharma', label: 'Pharmaceutical & Healthcare' },
    { value: 'financial', label: 'Financial Services' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'realestate', label: 'Real Estate & Construction' },
    { value: 'energy', label: 'Energy & Utilities' },
    { value: 'telecom', label: 'Telecommunications' },
    { value: 'hospitality', label: 'Hospitality & Tourism' },
    { value: 'media', label: 'Media & Entertainment' },
    { value: 'agriculture', label: 'Agriculture & Food Processing' },
    { value: 'education', label: 'Education & EdTech' },
    { value: 'logistics', label: 'Logistics & Transportation' },
    { value: 'textile', label: 'Textile & Apparel' },
    { value: 'other', label: 'Other Industry' }
  ];

  const jurisdictionOptions = [
    { value: 'national', label: 'National (All India)' },
    { value: 'delhi', label: 'Delhi NCR' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'tamilnadu', label: 'Tamil Nadu' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'westbengal', label: 'West Bengal' },
    { value: 'uttarpradesh', label: 'Uttar Pradesh' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'other', label: 'Other State/UT' }
  ];

  return (
    <LegalToolLayout 
      title="Legal Due Diligence" 
      description="Generate comprehensive due diligence reports for Indian legal transactions"
      icon={<Scale className="h-6 w-6 text-blue-600" />}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 border-blue-100 dark:border-blue-900">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-t-lg pb-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <Landmark className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Indian Legal Due Diligence</CardTitle>
                <CardDescription className="mt-1.5">
                  Generate detailed due diligence reports tailored to Indian laws, regulations, and case precedents
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transaction-details">
                  <FileText className="mr-2 h-4 w-4" />
                  Transaction Details
                </TabsTrigger>
                <TabsTrigger value="results" disabled={!results}>
                  <Gavel className="mr-2 h-4 w-4" />
                  Due Diligence Report
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="transaction-details" className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="transaction-type">Transaction Type</Label>
                      <Select value={transactionType} onValueChange={setTransactionType}>
                        <SelectTrigger id="transaction-type">
                          <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acquisition">Merger & Acquisition</SelectItem>
                          <SelectItem value="investment">Investment/Funding Round</SelectItem>
                          <SelectItem value="joint-venture">Joint Venture</SelectItem>
                          <SelectItem value="asset-purchase">Asset Purchase</SelectItem>
                          <SelectItem value="real-estate">Real Estate Transaction</SelectItem>
                          <SelectItem value="licensing">Licensing Agreement</SelectItem>
                          <SelectItem value="corporate-restructuring">Corporate Restructuring</SelectItem>
                          <SelectItem value="ipo">IPO Preparation</SelectItem>
                          <SelectItem value="franchise">Franchise Agreement</SelectItem>
                          <SelectItem value="other">Other Transaction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="industry-type">Industry Sector</Label>
                      <Select value={industryType} onValueChange={setIndustryType}>
                        <SelectTrigger id="industry-type">
                          <SelectValue placeholder="Select industry sector" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="indian-jurisdiction">Indian Jurisdiction</Label>
                    <Select value={indianJurisdiction} onValueChange={setIndianJurisdiction}>
                      <SelectTrigger id="indian-jurisdiction">
                        <SelectValue placeholder="Select applicable jurisdiction" />
                      </SelectTrigger>
                      <SelectContent>
                        {jurisdictionOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Select the primary Indian jurisdiction applicable to this transaction.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="diligence-info">Transaction Details</Label>
                    <Textarea
                      id="diligence-info"
                      value={dueDiligenceInfo}
                      onChange={(e) => setDueDiligenceInfo(e.target.value)}
                      placeholder="Describe the transaction, parties involved, key concerns, and any specific areas you'd like the due diligence to focus on under Indian law. Include details like transaction value, entity structures, or regulatory considerations."
                      className="min-h-[180px]"
                    />
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 p-4 rounded-md mb-4">
                    <div className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Indian Legal Framework</h4>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                          Your due diligence report will include analysis based on relevant Indian laws including Companies Act 2013, 
                          Contract Act 1872, FEMA 1999, Competition Act 2002, and applicable BNS/BNSS provisions as well as state-specific 
                          regulations based on your selected jurisdiction.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-provider">AI Model Selection</Label>
                    <Select value={apiProvider} onValueChange={(value: 'deepseek' | 'gemini') => setApiProvider(value)}>
                      <SelectTrigger id="api-provider">
                        <SelectValue placeholder="Select AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini">Google Gemini Pro</SelectItem>
                        <SelectItem value="deepseek">DeepSeek AI</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Select the AI model to use for generating your Indian legal due diligence report.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-4 rounded-md mb-4">
                    <div className="flex items-start gap-3">
                      <IndianRupee className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Indian Financial Compliance</h4>
                        <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                          Your report will include considerations for Indian financial regulations including RBI guidelines, 
                          SEBI regulations, GST compliance, income tax implications, and foreign investment rules as applicable 
                          to your transaction type.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGenerateDueDiligence} 
                    disabled={isGenerating || !transactionType || !dueDiligenceInfo.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Indian Legal Due Diligence Report...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Generate Indian Due Diligence Report
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="results" className="p-0">
                {results && (
                  <div>
                    <div className="p-6">
                      <div className="prose dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: results.replace(/\n/g, '<br />') }} />
                      </div>
                    </div>
                    <CardFooter className="bg-gray-50 dark:bg-gray-900/30 p-4 border-t border-gray-100 dark:border-gray-800 rounded-b-lg">
                      <div className="w-full flex flex-col sm:flex-row gap-3 justify-between items-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          This report is generated using AI and should be reviewed by a qualified Indian legal professional before use.
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab('transaction-details')}
                          size="sm"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Edit Details
                        </Button>
                      </div>
                    </CardFooter>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </LegalToolLayout>
  );
};

export default LegalDueDiligencePage;
