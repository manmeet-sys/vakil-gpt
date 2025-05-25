import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Search, Loader2, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/components/BackButton';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';

interface DueDiligenceResult {
  summary: string;
  keyFindings: string[];
  riskAssessment: {
    level: 'high' | 'medium' | 'low';
    description: string;
  }[];
  recommendations: string[];
}

const LegalDueDiligencePage = () => {
  const { toast } = useToast();
  const [documentType, setDocumentType] = useState<string>('');
  const [industryType, setIndustryType] = useState<string>('');
  const [documentDetails, setDocumentDetails] = useState<string>('');
  const [dueDiligenceResult, setDueDiligenceResult] = useState<DueDiligenceResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const generateDueDiligence = async () => {
    if (!documentType || !industryType || !documentDetails.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const prompt = `
        Act as a legal due diligence specialist. Based on the following information, provide a comprehensive legal due diligence report:

        Document Type: ${documentType}
        Industry: ${industryType}
        Document Details: ${documentDetails}

        Format your response exactly as follows (do not include any extra text except what fits in these sections):

        SUMMARY: A brief summary of the document and key findings.

        KEY_FINDINGS:
        - First key finding
        - Second key finding
        (Include at least 3 key findings)

        RISK_ASSESSMENT:
        - [HIGH/MEDIUM/LOW]: First risk and explanation
        - [HIGH/MEDIUM/LOW]: Second risk and explanation
        (Include at least 3 risks)

        RECOMMENDATIONS:
        - First recommendation
        - Second recommendation
        (Include at least 3 recommendations)
      `;

      const response = await getOpenAIResponse(prompt);

      const result = parseAIResponse(response);
      setDueDiligenceResult(result);

      toast({
        title: "Analysis Complete",
        description: "Legal due diligence report has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating due diligence report:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error generating the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseAIResponse = (response: string): DueDiligenceResult => {
    const result: DueDiligenceResult = {
      summary: '',
      keyFindings: [],
      riskAssessment: [],
      recommendations: [],
    };

    try {
      const summaryMatch = response.match(/SUMMARY:(.*?)(?=KEY_FINDINGS:|$)/s);
      if (summaryMatch && summaryMatch[1]) {
        result.summary = summaryMatch[1].trim();
      }

      const keyFindingsMatch = response.match(/KEY_FINDINGS:(.*?)(?=RISK_ASSESSMENT:|$)/s);
      if (keyFindingsMatch && keyFindingsMatch[1]) {
        const findingsText = keyFindingsMatch[1].trim();
        result.keyFindings = findingsText.split('\n-').map(item => item.trim()).filter(Boolean);
      }

      const riskAssessmentMatch = response.match(/RISK_ASSESSMENT:(.*?)(?=RECOMMENDATIONS:|$)/s);
      if (riskAssessmentMatch && riskAssessmentMatch[1]) {
        const risksText = riskAssessmentMatch[1].trim();
        const riskItems = risksText.split('\n-').map(item => item.trim()).filter(Boolean);

        riskItems.forEach(item => {
          const levelMatch = item.match(/\[(HIGH|MEDIUM|LOW)\]:/i);
          if (levelMatch) {
            const level = levelMatch[1].toLowerCase() as 'high' | 'medium' | 'low';
            const description = item.replace(/\[(HIGH|MEDIUM|LOW)\]:/i, '').trim();
            result.riskAssessment.push({ level, description });
          }
        });
      }

      const recommendationsMatch = response.match(/RECOMMENDATIONS:(.*?)$/s);
      if (recommendationsMatch && recommendationsMatch[1]) {
        const recsText = recommendationsMatch[1].trim();
        result.recommendations = recsText.split('\n-').map(item => item.trim()).filter(Boolean);
      }

      return result;
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return {
        summary: "Unable to parse the analysis results. Please try again.",
        keyFindings: [],
        riskAssessment: [{ level: 'medium', description: 'Analysis parsing error' }],
        recommendations: ["Try regenerating the analysis"],
      };
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <LegalToolLayout
      title="Legal Due Diligence"
      description="Perform legal due diligence on documents using AI"
      icon={<Search className="h-6 w-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />

      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Legal Due Diligence Analysis</CardTitle>
            <CardDescription>
              Provide document details for AI-powered legal due diligence analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="document-type">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="document-type">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="agreement">Agreement</SelectItem>
                  <SelectItem value="license">License</SelectItem>
                  <SelectItem value="memorandum">Memorandum</SelectItem>
                  <SelectItem value="articles-of-association">Articles of Association</SelectItem>
                  <SelectItem value="financial-statement">Financial Statement</SelectItem>
                  <SelectItem value="legal-opinion">Legal Opinion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="industry-type">Industry</Label>
              <Select value={industryType} onValueChange={setIndustryType}>
                <SelectTrigger id="industry-type">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="banking">Banking</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="investment">Investment & Securities</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="cryptocurrency">Cryptocurrency</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="non-profit">Non-Profit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="document-details">Document Details</Label>
              <Textarea
                id="document-details"
                placeholder="Describe the document in detail, including parties involved, amounts, dates, key clauses, etc."
                value={documentDetails}
                onChange={(e) => setDocumentDetails(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={generateDueDiligence}
              disabled={isAnalyzing || !documentType || !industryType || !documentDetails.trim()}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Due Diligence Report
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {dueDiligenceResult && (
          <Card>
            <CardHeader>
              <CardTitle>Legal Due Diligence Report</CardTitle>
              <CardDescription>
                Analysis for {documentType.replace('-', ' ')} in the {industryType.replace('-', ' ')} industry
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Summary</h3>
                <p className="text-gray-700 dark:text-gray-300">{dueDiligenceResult.summary}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium mb-3">Key Findings</h3>
                <ul className="list-disc list-inside">
                  {dueDiligenceResult.keyFindings.map((finding, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{finding}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium mb-3">Risk Assessment</h3>
                {dueDiligenceResult.riskAssessment.map((risk, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`rounded-full w-3 h-3 ${getRiskBadgeColor(risk.level)}`}></div>
                    <span className="text-gray-700 dark:text-gray-300">{risk.description}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium mb-3">Recommendations</h3>
                <ul className="list-decimal list-inside">
                  {dueDiligenceResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{recommendation}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </LegalToolLayout>
  );
};

export default LegalDueDiligencePage;
