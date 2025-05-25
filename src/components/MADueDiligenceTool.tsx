import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, FileText, Search, AlertTriangle, CheckCircle, TrendingUp, Calendar, Users, DollarSign, Scale, Shield, Download, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { getOpenAIResponse } from './OpenAIIntegration';

interface MADueDiligenceToolProps {
  // Define any props here
}

const MADueDiligenceTool: React.FC<MADueDiligenceToolProps> = () => {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [financialData, setFinancialData] = useState('');
  const [legalCompliance, setLegalCompliance] = useState('');
  const [riskFactors, setRiskFactors] = useState('');
  const [analysisResults, setAnalysisResults] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysis = async () => {
    if (!companyName || !industry || !targetMarket || !financialData || !legalCompliance || !riskFactors) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before generating the analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const prompt = `Conduct a comprehensive M&A due diligence analysis for ${companyName} in the ${industry} industry, targeting the ${targetMarket} market.
      Financial Data: ${financialData}
      Legal Compliance: ${legalCompliance}
      Risk Factors: ${riskFactors}

      Provide a detailed report covering financial health, legal compliance, market position, and potential risks.`;

      const aiResponse = await getOpenAIResponse(prompt);
      setAnalysisResults(aiResponse);
      toast({
        title: "Analysis Complete",
        description: "The M&A due diligence analysis has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating analysis:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error generating the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="shadow-sm dark:shadow-zinc-800/10">
      <CardHeader>
        <CardTitle>M&A Due Diligence Tool</CardTitle>
        <CardDescription>
          Generate a comprehensive M&A due diligence analysis report.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input
            id="company-name"
            placeholder="Enter company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            placeholder="Enter industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="target-market">Target Market</Label>
          <Input
            id="target-market"
            placeholder="Enter target market"
            value={targetMarket}
            onChange={(e) => setTargetMarket(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="financial-data">Financial Data</Label>
          <Textarea
            id="financial-data"
            placeholder="Enter financial data"
            value={financialData}
            onChange={(e) => setFinancialData(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="legal-compliance">Legal Compliance</Label>
          <Textarea
            id="legal-compliance"
            placeholder="Enter legal compliance details"
            value={legalCompliance}
            onChange={(e) => setLegalCompliance(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="risk-factors">Risk Factors</Label>
          <Textarea
            id="risk-factors"
            placeholder="Enter risk factors"
            value={riskFactors}
            onChange={(e) => setRiskFactors(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <Button onClick={handleAnalysis} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Generate Analysis
            </>
          )}
        </Button>

        {analysisResults && (
          <div className="mt-4">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Review the generated M&A due diligence analysis report.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={analysisResults}
                  readOnly
                  className="min-h-[200px] resize-none"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MADueDiligenceTool;
