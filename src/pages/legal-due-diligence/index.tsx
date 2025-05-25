import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Search, FileText, Loader2, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dueDiligenceData, setDueDiligenceData] = useState({
    entityName: '',
    entityType: '',
    transactionType: '',
    transactionValue: 0,
    specificConcerns: '',
  });

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

  const performDueDiligence = async () => {
    if (!dueDiligenceData.entityName || !dueDiligenceData.entityType || !dueDiligenceData.transactionType || !dueDiligenceData.transactionValue || !dueDiligenceData.specificConcerns.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields before performing due diligence.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const prompt = `
        Act as a legal due diligence specialist. Based on the following information, provide a comprehensive legal due diligence report:

        Entity/Company Name: ${dueDiligenceData.entityName}
        Entity Type: ${dueDiligenceData.entityType}
        Transaction Type: ${dueDiligenceData.transactionType}
        Transaction Value (₹): ${dueDiligenceData.transactionValue}
        Specific Legal Concerns: ${dueDiligenceData.specificConcerns}

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
      setIsLoading(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDueDiligenceData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <LegalToolLayout
      title="Legal Due Diligence Tool"
      description="Comprehensive legal due diligence for Indian entities and transactions"
      icon={<Search className="h-6 w-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />

      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Entity Information</CardTitle>
            <CardDescription>
              Enter the details of the entity or transaction for due diligence analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entity-name">Entity/Company Name</Label>
                <Input
                  id="entity-name"
                  name="entityName"
                  value={dueDiligenceData.entityName}
                  onChange={handleInputChange}
                  placeholder="Enter entity or company name"
                />
              </div>
              <div>
                <Label htmlFor="entity-type">Entity Type</Label>
                <Select 
                  name="entityType" 
                  value={dueDiligenceData.entityType} 
                  onValueChange={(value) => handleInputChange({ target: { name: 'entityType', value } } as any)}
                >
                  <SelectTrigger id="entity-type">
                    <SelectValue placeholder="Select Entity Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private-limited">Private Limited Company</SelectItem>
                    <SelectItem value="public-limited">Public Limited Company</SelectItem>
                    <SelectItem value="partnership">Partnership Firm</SelectItem>
                    <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                    <SelectItem value="proprietorship">Sole Proprietorship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transaction-type">Transaction Type</Label>
                <Select 
                  name="transactionType" 
                  value={dueDiligenceData.transactionType} 
                  onValueChange={(value) => handleInputChange({ target: { name: 'transactionType', value } } as any)}
                >
                  <SelectTrigger id="transaction-type">
                    <SelectValue placeholder="Select Transaction Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acquisition">Acquisition</SelectItem>
                    <SelectItem value="merger">Merger</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="joint-venture">Joint Venture</SelectItem>
                    <SelectItem value="asset-purchase">Asset Purchase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transaction-value">Transaction Value (₹)</Label>
                <Input
                  id="transaction-value"
                  name="transactionValue"
                  type="number"
                  value={dueDiligenceData.transactionValue}
                  onChange={handleInputChange}
                  placeholder="Enter transaction value in INR"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="specific-concerns">Specific Legal Concerns</Label>
              <Textarea
                id="specific-concerns"
                name="specificConcerns"
                value={dueDiligenceData.specificConcerns}
                onChange={handleInputChange}
                placeholder="Describe any specific legal concerns or areas of focus"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={performDueDiligence}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Performing Due Diligence...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Perform Due Diligence
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
