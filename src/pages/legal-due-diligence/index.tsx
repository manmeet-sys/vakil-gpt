import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Scale, FileText, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getGeminiResponse } from '@/components/GeminiProIntegration';

const LegalDueDiligencePage = () => {
  const [transactionType, setTransactionType] = useState<string>('');
  const [dueDiligenceInfo, setDueDiligenceInfo] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string>('');
  const { toast } = useToast();
  const [apiProvider, setApiProvider] = useState<'deepseek' | 'gemini'>('gemini');

  // Load API provider preference on component mount
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
        description: "Your legal due diligence report has been generated",
      });
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
    - Transaction Details: ${dueDiligenceInfo}
    
    Include:
    1. Key areas of legal due diligence required for this transaction under Indian law
    2. Document checklist and information requirements
    3. Potential legal issues to investigate
    4. Risk assessment framework
    5. Due diligence process recommendations
    6. Relevant Indian legal considerations specific to this transaction
    
    Format your response as a professional due diligence report with clear sections.`;

    return await getGeminiResponse(systemPrompt);
  };

  const generateDeepSeekDueDiligenceResults = async (): Promise<string> => {
    const systemPrompt = `You are VakilGPT's legal due diligence specialist with expertise in Indian corporate and commercial law.
    
    Generate a comprehensive legal due diligence report based on the following information:
    - Transaction Type: ${transactionType}
    - Transaction Details: ${dueDiligenceInfo}
    
    Include:
    1. Key areas of legal due diligence required for this transaction under Indian law
    2. Document checklist and information requirements
    3. Potential legal issues to investigate
    4. Risk assessment framework
    5. Due diligence process recommendations
    6. Relevant Indian legal considerations specific to this transaction
    
    Format your response as a professional due diligence report with clear sections.`;
    
    // For now, just use Gemini API since DeepSeek API key is not provided
    return await getGeminiResponse(systemPrompt);
  };

  return (
    <LegalToolLayout 
      title="Legal Due Diligence" 
      description="Generate comprehensive due diligence reports for Indian legal transactions"
      icon={<Scale className="h-6 w-6 text-blue-600" />}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Due Diligence Information</CardTitle>
            <CardDescription>
              Provide details about the transaction for a tailored due diligence report under Indian law.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transaction-type">Transaction Type</Label>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger id="transaction-type">
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acquisition">Merger & Acquisition</SelectItem>
                    <SelectItem value="investment">Investment/Funding</SelectItem>
                    <SelectItem value="joint-venture">Joint Venture</SelectItem>
                    <SelectItem value="asset-purchase">Asset Purchase</SelectItem>
                    <SelectItem value="real-estate">Real Estate Transaction</SelectItem>
                    <SelectItem value="licensing">Licensing Agreement</SelectItem>
                    <SelectItem value="corporate-restructuring">Corporate Restructuring</SelectItem>
                    <SelectItem value="ipo">IPO Preparation</SelectItem>
                    <SelectItem value="other">Other Transaction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="diligence-info">Transaction Details</Label>
                <Textarea
                  id="diligence-info"
                  value={dueDiligenceInfo}
                  onChange={(e) => setDueDiligenceInfo(e.target.value)}
                  placeholder="Describe the transaction, parties involved, key concerns, and any specific areas you'd like the due diligence to focus on under Indian law."
                  className="min-h-[150px]"
                />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Document Upload Coming Soon</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Soon you'll be able to upload transaction documents directly for more accurate due diligence analysis under Indian law.
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
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Generate Due Diligence Report
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Due Diligence Report</CardTitle>
              <CardDescription>
                Comprehensive legal due diligence analysis for your transaction under Indian law.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: results.replace(/\n/g, '<br />') }} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </LegalToolLayout>
  );
};

export default LegalDueDiligencePage;
