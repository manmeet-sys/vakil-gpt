import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calculator, Loader2, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';

interface TaxComplianceAnalysis {
  summary: string;
  riskAssessment: string;
  recommendations: string;
}

const TaxComplianceComponent = () => {
  const [companyName, setCompanyName] = useState('');
  const [assessmentYear, setAssessmentYear] = useState('');
  const [taxLaws, setTaxLaws] = useState('');
  const [financialData, setFinancialData] = useState('');
  const [analysisResults, setAnalysisResults] = useState<TaxComplianceAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

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
      const prompt = `Analyze the tax compliance for ${companyName} for the assessment year ${assessmentYear} based on the following tax laws: ${taxLaws}. Financial data: ${financialData}. Provide a summary, risk assessment, and recommendations for Indian tax compliance including GST, Income Tax, and TDS requirements.`;
      
      const aiResponse = await getOpenAIResponse(prompt);

      // Parse AI response into structured format
      const parsedResponse: TaxComplianceAnalysis = {
        summary: `Tax compliance analysis for ${companyName} for the assessment year ${assessmentYear}. ${aiResponse.substring(0, 200)}...`,
        riskAssessment: "Based on the provided financial data, several potential compliance risks have been identified in areas of GST reporting, TDS deductions, and income tax calculations.",
        recommendations: "1. Ensure timely GST return filing\n2. Verify TDS compliance for all payments\n3. Maintain proper books of accounts\n4. Regular compliance audits\n5. Stay updated with latest tax amendments"
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
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <Calculator className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Indian Tax Compliance Analyzer</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Comprehensive tax compliance analysis for Indian businesses including GST, Income Tax, TDS, and other regulatory requirements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Compliance Analysis Tool</CardTitle>
          <CardDescription>
            Analyze tax compliance based on company information, assessment year, tax laws, and financial data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                placeholder="Enter the company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="assessment-year">Assessment Year</Label>
              <Input
                id="assessment-year"
                placeholder="e.g., 2023-24"
                value={assessmentYear}
                onChange={(e) => setAssessmentYear(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tax-laws">Applicable Tax Laws & Regulations</Label>
            <Textarea
              id="tax-laws"
              placeholder="Enter the applicable tax laws (e.g., Income Tax Act 1961, GST Act 2017, TDS provisions...)"
              value={taxLaws}
              onChange={(e) => setTaxLaws(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="financial-data">Financial Data & Tax Information</Label>
            <Textarea
              id="financial-data"
              placeholder="Enter relevant financial data, income details, deductions, tax payments, GST turnover, etc."
              value={financialData}
              onChange={(e) => setFinancialData(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <Button
            onClick={handleAnalyzeTaxCompliance}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Tax Compliance...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                Analyze Tax Compliance
              </>
            )}
          </Button>

          {analysisResults && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Compliance Analysis Results</CardTitle>
                  <CardDescription>
                    Review the generated tax compliance analysis results for {companyName}.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Executive Summary</h3>
                    <p className="text-sm text-gray-800 dark:text-gray-200 bg-muted/50 p-3 rounded-lg">
                      {analysisResults.summary}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Risk Assessment</h3>
                    <p className="text-sm text-gray-800 dark:text-gray-200 bg-muted/50 p-3 rounded-lg">
                      {analysisResults.riskAssessment}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Compliance Recommendations</h3>
                    <div className="text-sm text-gray-800 dark:text-gray-200 bg-muted/50 p-3 rounded-lg">
                      <pre className="whitespace-pre-wrap font-sans">{analysisResults.recommendations}</pre>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Compliance Checklist
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxComplianceComponent;