import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, FileText, AlertTriangle, CheckCircle, Calendar, DollarSign, TrendingUp, Building, Users, Percent, Download, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { getOpenAIResponse } from './OpenAIIntegration';

interface TaxComplianceAnalysis {
  summary: string;
  riskAssessment: string;
  recommendations: string;
}

const TaxComplianceTool = () => {
  const [companyName, setCompanyName] = useState('');
  const [assessmentYear, setAssessmentYear] = useState('');
  const [taxLaws, setTaxLaws] = useState('');
  const [financialData, setFinancialData] = useState('');
  const [analysisResults, setAnalysisResults] = useState<TaxComplianceAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyzeTaxCompliance = async () => {
    if (!companyName || !assessmentYear || !taxLaws || !financialData) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before generating the analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const prompt = `Analyze the tax compliance for ${companyName} for the assessment year ${assessmentYear} based on the following tax laws: ${taxLaws}. Financial data: ${financialData}. Provide a summary, risk assessment, and recommendations.`;
      const aiResponse = await getOpenAIResponse(prompt);

      // Mock parsing of the AI response
      const parsedResponse: TaxComplianceAnalysis = {
        summary: `Tax compliance analysis for ${companyName} for the assessment year ${assessmentYear}.`,
        riskAssessment: "Identified potential risks in tax compliance.",
        recommendations: "Follow the recommendations to ensure tax compliance."
      };

      setAnalysisResults(parsedResponse);
      toast({
        title: "Tax Compliance Analysis Generated",
        description: "The tax compliance analysis has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating tax compliance analysis:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error generating the tax compliance analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm dark:shadow-zinc-800/10">
      <CardHeader>
        <CardTitle>Tax Compliance Analysis Tool</CardTitle>
        <CardDescription>
          Analyze tax compliance based on company information, assessment year, tax laws, and financial data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input
            id="company-name"
            placeholder="Enter the company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="assessment-year">Assessment Year</Label>
          <Input
            id="assessment-year"
            placeholder="Enter the assessment year"
            value={assessmentYear}
            onChange={(e) => setAssessmentYear(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tax-laws">Tax Laws</Label>
          <Textarea
            id="tax-laws"
            placeholder="Enter the applicable tax laws"
            value={taxLaws}
            onChange={(e) => setTaxLaws(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="financial-data">Financial Data</Label>
          <Textarea
            id="financial-data"
            placeholder="Enter the financial data"
            value={financialData}
            onChange={(e) => setFinancialData(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <Button
          onClick={handleAnalyzeTaxCompliance}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-4 w-4" />
              Analyze Tax Compliance
            </>
          )}
        </Button>

        {analysisResults && (
          <div className="mt-4">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Tax Compliance Analysis Results</CardTitle>
                <CardDescription>
                  Review the generated tax compliance analysis results.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Summary</h3>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{analysisResults.summary}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Risk Assessment</h3>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{analysisResults.riskAssessment}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Recommendations</h3>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{analysisResults.recommendations}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxComplianceTool;
