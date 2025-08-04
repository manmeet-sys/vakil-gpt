import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Loader2, Download, FileText, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const DueDiligenceComponent = () => {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [transactionValue, setTransactionValue] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<string | null>(null);

  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!companyName || !industry || !transactionType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisResults(null);

    try {
      // Simulate progress updates
      const progressSteps = [
        { progress: 20, message: "Analyzing financial statements..." },
        { progress: 40, message: "Reviewing legal documentation..." },
        { progress: 60, message: "Assessing regulatory compliance..." },
        { progress: 80, message: "Evaluating commercial risks..." },
        { progress: 100, message: "Generating comprehensive report..." }
      ];

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAnalysisProgress(step.progress);
      }

      const mockResults = generateDueDiligenceResults();
      setAnalysisResults(mockResults);

      toast({
        title: "Due Diligence Analysis Complete",
        description: "Your M&A due diligence report has been generated"
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error generating the due diligence report",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const generateDueDiligenceResults = () => {
    return `# M&A Due Diligence Report - ${companyName}

## Executive Summary
This due diligence assessment analyzes ${companyName}, a ${industry} company, for the proposed ${transactionType} transaction valued at ${transactionValue || 'TBD'}.

## Key Findings

### 1. Financial Due Diligence
**Revenue Analysis:**
- Historical revenue growth trends
- Revenue recognition practices
- Recurring vs. one-time revenue streams
- Working capital requirements

**Profitability Assessment:**
- EBITDA margins and sustainability
- Cost structure analysis
- Operational leverage potential

### 2. Legal Due Diligence
**Corporate Structure:**
- Entity formation and corporate history
- Shareholding pattern and cap table
- Board composition and governance

**Material Agreements:**
- Customer contracts and terms
- Supplier agreements
- Employment contracts
- IP licensing agreements

**Regulatory Compliance:**
- Industry-specific regulations
- Environmental clearances
- Labor law compliance
- Tax compliance status

### 3. Commercial Due Diligence
**Market Position:**
- Competitive landscape analysis
- Market share and positioning
- Customer concentration risks
- Supplier dependency

**Business Model:**
- Value proposition sustainability
- Scalability assessment
- Technology dependencies

### 4. Risk Assessment

**High Risk Areas:**
- Regulatory compliance gaps
- Customer concentration
- Key person dependencies

**Medium Risk Areas:**
- Market competition
- Technology obsolescence
- Working capital management

**Low Risk Areas:**
- Financial reporting practices
- Corporate governance

### 5. Valuation Considerations
- Comparable company analysis
- Discounted cash flow projections
- Risk-adjusted valuations
- Synergy potential assessment

### 6. Recommendations
1. **Proceed with Caution**: Address identified high-risk areas
2. **Negotiate Representations**: Include specific warranties
3. **Escrow Arrangements**: Protect against undisclosed liabilities
4. **Post-Merger Integration**: Plan for key integration activities

### 7. Next Steps
- Detailed financial audit
- Management presentations
- Employee retention planning
- Integration roadmap development

---
*This report is based on available information and should be supplemented with professional advisory services.*`;
  };

  const clearForm = () => {
    setCompanyName('');
    setIndustry('');
    setTransactionType('');
    setTransactionValue('');
    setAdditionalDetails('');
    setAnalysisResults(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">M&A Due Diligence Analyzer</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                AI-powered due diligence analysis for mergers, acquisitions, and investment transactions in India.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>
            Provide transaction details to generate a comprehensive due diligence analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-name">Target Company Name</Label>
              <Input
                id="company-name"
                placeholder="Enter company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry Sector</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="fintech">Financial Services</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="retail">Retail & E-commerce</SelectItem>
                  <SelectItem value="energy">Energy & Utilities</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="transaction-type">Transaction Type</Label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acquisition">Acquisition</SelectItem>
                  <SelectItem value="merger">Merger</SelectItem>
                  <SelectItem value="investment">Strategic Investment</SelectItem>
                  <SelectItem value="buyout">Management Buyout</SelectItem>
                  <SelectItem value="joint-venture">Joint Venture</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="transaction-value">Transaction Value (INR)</Label>
              <Input
                id="transaction-value"
                placeholder="e.g., ₹50 Crores"
                value={transactionValue}
                onChange={(e) => setTransactionValue(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="additional-details">Additional Details</Label>
            <Textarea
              id="additional-details"
              placeholder="Provide any additional context about the transaction, specific concerns, or areas of focus for the due diligence..."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Analysis Progress</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="w-full" />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleAnalysis} disabled={isAnalyzing} className="flex-1">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Generate Due Diligence Report
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={clearForm}>
              Clear Form
            </Button>
          </div>

          {analysisResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Due Diligence Analysis Report</CardTitle>
                  <CardDescription>
                    Comprehensive analysis for {companyName} - {transactionType}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">{analysisResults}</pre>
                  </div>

                  <div className="flex gap-2 mt-6 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Checklist
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Disclaimer:</strong> This AI-generated analysis is for informational purposes only. 
                  Please consult with qualified legal, financial, and business advisors for actual due diligence activities.
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DueDiligenceComponent;