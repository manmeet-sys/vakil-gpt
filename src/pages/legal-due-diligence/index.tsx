
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import OptimizedAppLayout from '@/components/OptimizedAppLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, FileText } from 'lucide-react';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';
import { getGeminiResponse } from '@/components/GeminiProIntegration';

const LegalDueDiligencePage: React.FC = () => {
  const [transactionType, setTransactionType] = useState<string>('');
  const [dueDiligenceInfo, setDueDiligenceInfo] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string>('');
  const [apiProvider, setApiProvider] = useState<'deepseek' | 'gemini'>('gemini');

  const handleGenerateDueDiligence = async () => {
    if (!dueDiligenceInfo.trim()) {
      toast("Please provide transaction details for due diligence");
      return;
    }

    setIsGenerating(true);

    try {
      let dueDiligenceResults = '';
      
      if (apiProvider === 'gemini') {
        dueDiligenceResults = await generateGeminiDueDiligenceResults();
      } else {
        // Default to OpenAI integration for now
        dueDiligenceResults = await generateOpenAIDueDiligenceResults();
      }

      setResults(dueDiligenceResults);
      toast("Due Diligence Complete");
    } catch (error) {
      console.error('Error generating due diligence report:', error);
      toast(error instanceof Error ? error.message : "Failed to generate due diligence report");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateGeminiDueDiligenceResults = async (): Promise<string> => {
    const systemPrompt = `You are VakilGPT's legal due diligence specialist with expertise in Indian corporate and commercial law.
    
    Generate a comprehensive legal due diligence report based on the following information:
    - Transaction Type: ${transactionType || "General transaction"}
    - Transaction Details: ${dueDiligenceInfo}
    
    Include:
    1. Key areas of legal due diligence required for this transaction under Indian law
    2. Document checklist and information requirements specific to Indian jurisdiction
    3. Potential legal issues to investigate under relevant Indian laws
    4. Risk assessment framework based on Indian regulatory environment
    5. Due diligence process recommendations compliant with Indian legal practices
    6. Relevant Indian legal considerations
    
    Format your response as a professional due diligence report with clear sections.`;

    return await getGeminiResponse(systemPrompt);
  };

  const generateOpenAIDueDiligenceResults = async (): Promise<string> => {
    const systemPrompt = `You are VakilGPT's legal due diligence specialist with expertise in Indian corporate and commercial law.
    
    Generate a comprehensive legal due diligence report based on the following information:
    - Transaction Type: ${transactionType || "General transaction"}
    - Transaction Details: ${dueDiligenceInfo}
    
    Include:
    1. Key areas of legal due diligence required for this transaction under Indian law
    2. Document checklist and information requirements specific to Indian jurisdiction
    3. Potential legal issues to investigate under relevant Indian laws
    4. Risk assessment framework based on Indian regulatory environment
    5. Due diligence process recommendations compliant with Indian legal practices
    6. Relevant Indian legal considerations
    
    Format your response as a professional due diligence report with clear sections.`;
    
    return await getOpenAIResponse(systemPrompt);
  };

  return (
    <OptimizedAppLayout>
      <Helmet>
        <title>Legal Due Diligence | VakilGPT</title>
        <meta name="description" content="Generate comprehensive due diligence reports for legal transactions" />
      </Helmet>
      
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Legal Due Diligence</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Transaction Type</label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">Select transaction type</option>
                  <option value="acquisition">Merger & Acquisition</option>
                  <option value="investment">Investment/Funding Round</option>
                  <option value="joint-venture">Joint Venture</option>
                  <option value="asset-purchase">Asset Purchase</option>
                  <option value="real-estate">Real Estate Transaction</option>
                  <option value="licensing">Licensing Agreement</option>
                  <option value="other">Other Transaction</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Transaction Details</label>
                <Textarea
                  value={dueDiligenceInfo}
                  onChange={(e) => setDueDiligenceInfo(e.target.value)}
                  placeholder="Describe the transaction, parties involved, key concerns, and any specific areas you'd like the due diligence to focus on..."
                  className="min-h-[180px]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">AI Model</label>
                <select
                  value={apiProvider}
                  onChange={(e) => setApiProvider(e.target.value as 'deepseek' | 'gemini')}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="gemini">Google Gemini Pro</option>
                  <option value="deepseek">DeepSeek AI (via OpenAI)</option>
                </select>
              </div>
              
              <Button 
                onClick={handleGenerateDueDiligence} 
                disabled={isGenerating || !dueDiligenceInfo.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Due Diligence Report...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Due Diligence Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Due Diligence Report</CardTitle>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: results.replace(/\n/g, '<br />') }} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  {isGenerating ? 
                    <Loader2 className="h-8 w-8 animate-spin" /> : 
                    <p>Generated report will appear here</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          AI-generated due diligence reports should be reviewed by qualified legal professionals before use.
        </p>
      </div>
    </OptimizedAppLayout>
  );
};

export default LegalDueDiligencePage;
