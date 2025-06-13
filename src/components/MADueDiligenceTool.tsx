
import React, { useState } from 'react';
import { MobileOptimizedCard } from '@/components/ui/mobile-optimized-card';
import { MobileButton } from '@/components/ui/mobile-button';
import { MobileInput, MobileTextarea } from '@/components/ui/mobile-input';
import { RichText } from '@/components/ui/rich-text';
import { Building2, Search, Loader2, FileText, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { getOpenAIResponse } from './OpenAIIntegration';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';

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
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');

  const analysisPhases = [
    'Financial Analysis',
    'Legal Compliance Review',
    'Market Position Assessment',
    'Risk Evaluation',
    'Strategic Recommendations'
  ];

  const handleAnalysis = async () => {
    const requiredFields = [companyName, industry, targetMarket, financialData, legalCompliance, riskFactors];
    const emptyFields = requiredFields.filter(field => !field.trim());
    
    if (emptyFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before generating the analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisResults('');

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          const next = prev + 20;
          const phaseIndex = Math.floor(next / 20) - 1;
          if (phaseIndex >= 0 && phaseIndex < analysisPhases.length) {
            setCurrentPhase(analysisPhases[phaseIndex]);
          }
          return Math.min(next, 90);
        });
      }, 1000);

      const prompt = `Conduct a comprehensive M&A due diligence analysis for "${companyName}" operating in the ${industry} industry, targeting the ${targetMarket} market. Provide a detailed professional report covering:

**EXECUTIVE SUMMARY**
- Key findings and recommendations
- Deal attractiveness score (1-10)
- Critical risk factors

**1. FINANCIAL ANALYSIS**
Financial Data: ${financialData}
- Revenue trends and profitability analysis
- Cash flow assessment
- Debt and liability evaluation
- Valuation metrics and comparables
- Financial red flags or concerns

**2. LEGAL & COMPLIANCE REVIEW**
Legal Compliance Status: ${legalCompliance}
- Regulatory compliance status
- Intellectual property portfolio
- Litigation history and pending cases
- Corporate governance structure
- Compliance with Indian regulations (Companies Act, SEBI, etc.)

**3. MARKET POSITION & COMMERCIAL ASSESSMENT**
- Market share and competitive position
- Customer concentration and relationships
- Supply chain dependencies
- Growth prospects in ${targetMarket}
- Industry trends and outlook

**4. RISK ANALYSIS**
Identified Risk Factors: ${riskFactors}
- Operational risks
- Financial risks
- Legal and regulatory risks
- Market and competitive risks
- Integration risks

**5. STRATEGIC RECOMMENDATIONS**
- Deal structure recommendations
- Post-merger integration considerations
- Risk mitigation strategies
- Negotiation points and deal terms
- Go/No-Go recommendation with rationale

Format the response professionally with clear headings, bullet points, and actionable insights suitable for executive presentation.`;

      const aiResponse = await getOpenAIResponse(prompt);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setCurrentPhase('Analysis Complete');
      setAnalysisResults(aiResponse);
      
      setTimeout(() => {
        toast({
          title: "Analysis Complete",
          description: "The M&A due diligence analysis has been generated successfully.",
        });
      }, 500);
    } catch (error) {
      console.error("Error generating analysis:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error generating the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      setCurrentPhase('');
    }
  };

  const clearForm = () => {
    setCompanyName('');
    setIndustry('');
    setTargetMarket('');
    setFinancialData('');
    setLegalCompliance('');
    setRiskFactors('');
    setAnalysisResults('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className={cn(typography.heading.h1, "text-2xl md:text-3xl")}>
          M&A Due Diligence Analyzer
        </h1>
        <p className={cn(typography.body.medium, "max-w-2xl mx-auto")}>
          Comprehensive AI-powered due diligence analysis for mergers and acquisitions
        </p>
      </div>

      {/* Input Form */}
      <MobileOptimizedCard
        title="Company & Deal Information"
        description="Provide detailed information about the target company and transaction"
        icon={<Building2 className="h-5 w-5 text-blue-600" />}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MobileInput
              label="Company Name *"
              placeholder="Target company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            
            <MobileInput
              label="Industry *"
              placeholder="e.g., Technology, Healthcare"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
            
            <MobileInput
              label="Target Market *"
              placeholder="e.g., India, Asia-Pacific"
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="financial" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="legal">Legal</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="financial" className="space-y-4">
              <MobileTextarea
                label="Financial Data *"
                placeholder="Revenue figures, profitability metrics, cash flow, debt levels, recent financial performance..."
                value={financialData}
                onChange={(e) => setFinancialData(e.target.value)}
                description="Include key financial metrics and recent performance data"
              />
            </TabsContent>
            
            <TabsContent value="legal" className="space-y-4">
              <MobileTextarea
                label="Legal Compliance Status *"
                placeholder="Regulatory compliance, licenses, IP portfolio, litigation history, governance structure..."
                value={legalCompliance}
                onChange={(e) => setLegalCompliance(e.target.value)}
                description="Include compliance status and legal considerations"
              />
            </TabsContent>
            
            <TabsContent value="risks" className="space-y-4">
              <MobileTextarea
                label="Risk Factors *"
                placeholder="Operational risks, market dependencies, competitive threats, regulatory changes..."
                value={riskFactors}
                onChange={(e) => setRiskFactors(e.target.value)}
                description="Identify potential risks and concerns"
              />
            </TabsContent>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-3">
            <MobileButton 
              onClick={handleAnalysis} 
              disabled={isAnalyzing}
              className="flex-1"
              mobileSize="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Generate Analysis
                </>
              )}
            </MobileButton>
            
            {(companyName || industry || financialData) && (
              <MobileButton 
                variant="outline" 
                onClick={clearForm}
                disabled={isAnalyzing}
                mobileSize="lg"
              >
                Clear Form
              </MobileButton>
            )}
          </div>

          {/* Progress Indicator */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <span className={cn(typography.ui.label, "text-blue-800 dark:text-blue-200")}>
                    {currentPhase || 'Initializing...'}
                  </span>
                  <span className="text-sm font-medium text-blue-600">{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MobileOptimizedCard>

      {/* Results */}
      <AnimatePresence>
        {analysisResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MobileOptimizedCard
              title="Due Diligence Analysis Report"
              description="Comprehensive M&A due diligence findings and recommendations"
              icon={<FileText className="h-5 w-5 text-green-600" />}
            >
              <div className="space-y-4">
                {/* Analysis Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className={cn(typography.ui.caption, "text-gray-600 dark:text-gray-400")}>Analysis Status</p>
                    <p className={cn(typography.ui.label, "text-green-600")}>Complete</p>
                  </div>
                  <div className="text-center">
                    <Building2 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className={cn(typography.ui.caption, "text-gray-600 dark:text-gray-400")}>Company</p>
                    <p className={cn(typography.ui.label)}>{companyName}</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <p className={cn(typography.ui.caption, "text-gray-600 dark:text-gray-400")}>Industry</p>
                    <p className={cn(typography.ui.label)}>{industry}</p>
                  </div>
                </div>

                {/* Report Content */}
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700">
                  <RichText 
                    content={analysisResults}
                    variant="expanded"
                    className="text-sm md:text-base"
                  />
                </div>

                {/* Disclaimer */}
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className={cn(typography.ui.label, "text-orange-800 dark:text-orange-200 mb-1")}>
                        Professional Advisory Required
                      </h4>
                      <p className={cn(typography.body.small, "text-orange-700 dark:text-orange-300")}>
                        This AI-generated analysis is for preliminary assessment only. 
                        Engage qualified financial, legal, and business advisors for comprehensive due diligence before making investment decisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </MobileOptimizedCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MADueDiligenceTool;
