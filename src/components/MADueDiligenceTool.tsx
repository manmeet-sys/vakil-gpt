
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface MADueDiligenceToolProps {
  onAnalysisComplete?: (analysis: string) => void;
}

const MADueDiligenceTool: React.FC<MADueDiligenceToolProps> = ({ onAnalysisComplete }) => {
  const [companyName, setCompanyName] = useState<string>('');
  const [industrySector, setIndustrySector] = useState<string>('');
  const [financialData, setFinancialData] = useState<string>('');
  const [legalCompliance, setLegalCompliance] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');

  const generateDueDiligenceReport = async () => {
    if (!companyName || !industrySector || !financialData || !legalCompliance) {
      toast.error("Missing Information", {
        description: "Please fill in all fields before generating the report."
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const prompt = `
        Generate a comprehensive M&A due diligence report for ${companyName} in the ${industrySector} sector.
        
        Financial Data: ${financialData}
        Legal Compliance: ${legalCompliance}
        
        Include key findings, potential risks, and recommendations.
      `;

      const response = await getOpenAIResponse(prompt);
      setAnalysisResult(response);

      if (onAnalysisComplete) {
        onAnalysisComplete(response);
      }

      toast.success("Due Diligence Report Generated", {
        description: "The M&A due diligence report has been generated successfully."
      });
    } catch (error) {
      console.error("Error generating due diligence report:", error);
      toast.error("Report Generation Failed", {
        description: "There was an error generating the due diligence report. Please try again."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>M&A Due Diligence Tool</CardTitle>
        <CardDescription>
          Generate a due diligence report for mergers and acquisitions.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input
            id="company-name"
            placeholder="Enter company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="industry-sector">Industry Sector</Label>
          <Input
            id="industry-sector"
            placeholder="Enter industry sector"
            value={industrySector}
            onChange={(e) => setIndustrySector(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="financial-data">Financial Data</Label>
          <Textarea
            id="financial-data"
            placeholder="Enter financial data"
            value={financialData}
            onChange={(e) => setFinancialData(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="legal-compliance">Legal Compliance</Label>
          <Textarea
            id="legal-compliance"
            placeholder="Enter legal compliance details"
            value={legalCompliance}
            onChange={(e) => setLegalCompliance(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={generateDueDiligenceReport} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Generate Report"
          )}
        </Button>
      </CardFooter>
      {analysisResult && (
        <div className="mt-4 p-4 border-t">
          <h3 className="text-lg font-medium mb-2">Analysis Result</h3>
          <Textarea
            value={analysisResult}
            readOnly
            className="min-h-[150px] resize-none"
          />
        </div>
      )}
    </Card>
  );
};

export default MADueDiligenceTool;
