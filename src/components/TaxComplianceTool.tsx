import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface TaxComplianceResult {
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  potentialRisks: string[];
}

const TaxComplianceTool = () => {
  const { toast } = useToast();
  const [industry, setIndustry] = useState<string>('');
  const [taxRegime, setTaxRegime] = useState<string>('');
  const [financialData, setFinancialData] = useState<string>('');
  const [complianceResult, setComplianceResult] = useState<TaxComplianceResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const analyzeCompliance = async () => {
    if (!industry || !taxRegime || !financialData.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const prompt = `
        Analyze the tax compliance for a business in the ${industry} industry,
        operating under the ${taxRegime} tax regime, based on the following
        financial data:

        ${financialData}

        Provide a summary of the compliance status, key findings,
        recommendations for improvement, and potential risks.

        Format your response as follows:

        SUMMARY: [Brief summary of the tax compliance status]

        KEY_FINDINGS:
        - [Finding 1]
        - [Finding 2]
        - [Finding 3]

        RECOMMENDATIONS:
        - [Recommendation 1]
        - [Recommendation 2]
        - [Recommendation 3]

        POTENTIAL_RISKS:
        - [Risk 1]
        - [Risk 2]
      `;

      const response = await getOpenAIResponse(prompt);
      const result = parseAIResponse(response);
      setComplianceResult(result);

      toast({
        title: "Analysis Complete",
        description: "Tax compliance analysis generated successfully.",
      });
    } catch (error) {
      console.error("Error generating tax compliance analysis:", error);
      toast({
        title: "Analysis Failed",
        description:
          "There was an error generating the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseAIResponse = (response: string): TaxComplianceResult => {
    const summaryMatch = response.match(/SUMMARY:\s*(.*?)\s*(?=KEY_FINDINGS:|$)/s);
    const keyFindingsMatch = response.match(/KEY_FINDINGS:\s*([\s\S]*?)\s*(?=RECOMMENDATIONS:|$)/s);
    const recommendationsMatch = response.match(/RECOMMENDATIONS:\s*([\s\S]*?)\s*(?=POTENTIAL_RISKS:|$)/s);
    const potentialRisksMatch = response.match(/POTENTIAL_RISKS:\s*([\s\S]*?)$/s);

    return {
      summary: summaryMatch ? summaryMatch[1].trim() : "No summary available.",
      keyFindings: keyFindingsMatch
        ? keyFindingsMatch[1]
            .split("-")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
      recommendations: recommendationsMatch
        ? recommendationsMatch[1]
            .split("-")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
      potentialRisks: potentialRisksMatch
        ? potentialRisksMatch[1]
            .split("-")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
    };
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Tax Compliance Analysis Tool</CardTitle>
          <CardDescription>
            Analyze your tax compliance status based on industry, tax regime,
            and financial data.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="information-technology">
                    Information Technology
                  </SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="financial-services">
                    Financial Services
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tax-regime">Tax Regime</Label>
              <Select value={taxRegime} onValueChange={setTaxRegime}>
                <SelectTrigger id="tax-regime">
                  <SelectValue placeholder="Select a tax regime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gst">Goods and Services Tax (GST)</SelectItem>
                  <SelectItem value="income-tax">Income Tax</SelectItem>
                  <SelectItem value="corporate-tax">Corporate Tax</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="financial-data">Financial Data</Label>
            <Textarea
              id="financial-data"
              placeholder="Enter your financial data here..."
              className="resize-none"
              value={financialData}
              onChange={(e) => setFinancialData(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={analyzeCompliance}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Compliance"
            )}
          </Button>
        </CardFooter>
      </Card>

      {complianceResult && (
        <div className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Analysis Result</CardTitle>
              <CardDescription>
                Here are the key findings and recommendations based on the
                provided data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Summary</h3>
                <p>{complianceResult.summary}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Key Findings
                </h3>
                <ul className="list-disc pl-5">
                  {complianceResult.keyFindings.map((finding, index) => (
                    <li key={index}>{finding}</li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Recommendations
                </h3>
                <ul className="list-disc pl-5">
                  {complianceResult.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Potential Risks
                </h3>
                <ul className="list-disc pl-5">
                  {complianceResult.potentialRisks.map((risk, index) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
              This analysis is for informational purposes only and should not be
              considered as professional tax advice. Consult with a qualified tax
              advisor for specific guidance.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default TaxComplianceTool;
