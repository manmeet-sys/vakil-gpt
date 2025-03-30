
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Search, Shield, Loader2, FileText, CheckCircle, AlertCircle, Download, X, Info, Calendar, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getGeminiResponse } from './GeminiProIntegration';

interface RiskIndicator {
  id: string;
  name: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  score: number;
}

interface FraudAnalysisResult {
  overallScore: number;
  riskLevel: 'high' | 'medium' | 'low';
  summary: string;
  indicators: RiskIndicator[];
  recommendations: string[];
  timestamp: string;
}

const FraudDetectorTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState('transaction');
  const [transactionData, setTransactionData] = useState({
    transactionType: '',
    transactionAmount: '',
    transactionDate: '',
    paymentMethod: '',
    counterparty: '',
    counterpartyLocation: '',
    isNewCounterparty: false,
    recentFrequency: '',
    deviationFromNormal: 'no',
    roundNumbers: false,
    transactionDescription: '',
  });
  
  const [riskIndicators, setRiskIndicators] = useState({
    unusualTiming: false,
    structuredTransactions: false,
    highRiskLocation: false,
    mismatchedDetails: false,
    rapidSuccession: false,
    shellEntity: false,
    documentDiscrepancies: false,
    lackOfTransparency: false,
    unusualPressure: false,
    complexStructure: false,
    additionalContext: '',
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FraudAnalysisResult | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [apiProvider, setApiProvider] = useState<'deepseek' | 'gemini'>('gemini');
  const { toast } = useToast();
  
  const [pastAnalyses, setPastAnalyses] = useState<FraudAnalysisResult[]>([]);
  const [selectedPastAnalysis, setSelectedPastAnalysis] = useState<FraudAnalysisResult | null>(null);
  
  // Load API key and past analyses on component mount
  useEffect(() => {
    const storedApiProvider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
    setApiProvider(storedApiProvider);
    const storedApiKey = localStorage.getItem(`${storedApiProvider}ApiKey`) || (storedApiProvider === 'gemini' ? 'AIzaSyCpX8FmPojP3E4dDqsmi0EtRjDKXGh9SBc' : '');
    setApiKey(storedApiKey);
    
    const savedAnalyses = localStorage.getItem('fraudDetectionAnalyses');
    if (savedAnalyses) {
      try {
        setPastAnalyses(JSON.parse(savedAnalyses));
      } catch (error) {
        console.error("Error parsing saved analyses:", error);
      }
    }
  }, []);
  
  // Save past analyses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fraudDetectionAnalyses', JSON.stringify(pastAnalyses));
  }, [pastAnalyses]);
  
  const handleTransactionChange = (field: string, value: any) => {
    setTransactionData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleRiskIndicatorChange = (field: string, value: any) => {
    setRiskIndicators(prev => ({ ...prev, [field]: value }));
  };
  
  const detectFraud = async () => {
    if (!transactionData.transactionType || !transactionData.transactionAmount) {
      toast({
        title: "Missing Information",
        description: "Please provide at least transaction type and amount",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Generate AI-based fraud analysis
      const prompt = `You are a financial fraud detection expert. Based on the following information about a financial transaction, provide a comprehensive fraud risk assessment:
      
      TRANSACTION DETAILS:
      - Type: ${transactionData.transactionType}
      - Amount: ${transactionData.transactionAmount}
      - Date: ${transactionData.transactionDate || "Not provided"}
      - Payment Method: ${transactionData.paymentMethod || "Not provided"}
      - Counterparty: ${transactionData.counterparty || "Not provided"}
      - Counterparty Location: ${transactionData.counterpartyLocation || "Not provided"}
      - New Counterparty: ${transactionData.isNewCounterparty ? "Yes" : "No"}
      - Recent Transaction Frequency: ${transactionData.recentFrequency || "Not provided"}
      - Deviation from Normal Patterns: ${transactionData.deviationFromNormal}
      - Round Numbers Used: ${transactionData.roundNumbers ? "Yes" : "No"}
      - Transaction Description: ${transactionData.transactionDescription || "Not provided"}
      
      RISK INDICATORS:
      - Unusual Timing: ${riskIndicators.unusualTiming ? "Yes" : "No"}
      - Structured Transactions: ${riskIndicators.structuredTransactions ? "Yes" : "No"}
      - High-Risk Location: ${riskIndicators.highRiskLocation ? "Yes" : "No"}
      - Mismatched Details: ${riskIndicators.mismatchedDetails ? "Yes" : "No"}
      - Rapid Succession Transactions: ${riskIndicators.rapidSuccession ? "Yes" : "No"}
      - Shell Entity Involvement: ${riskIndicators.shellEntity ? "Yes" : "No"}
      - Document Discrepancies: ${riskIndicators.documentDiscrepancies ? "Yes" : "No"}
      - Lack of Transparency: ${riskIndicators.lackOfTransparency ? "Yes" : "No"}
      - Unusual Pressure for Completion: ${riskIndicators.unusualPressure ? "Yes" : "No"}
      - Complex Transaction Structure: ${riskIndicators.complexStructure ? "Yes" : "No"}
      - Additional Context: ${riskIndicators.additionalContext || "Not provided"}
      
      Please provide:
      1. An overall fraud risk score from 0-100 (where 0 is highest risk and 100 is lowest risk)
      2. A risk level assessment (high, medium, or low)
      3. A summary of the fraud risk analysis
      4. Detailed analysis of specific risk indicators with individual scores
      5. Recommendations for further investigation or risk mitigation
      
      Format your response as a structured JSON object with these fields.`;
      
      const aiResponse = await getGeminiResponse(prompt, apiKey);
      
      // Parse the JSON response if possible
      try {
        // Extract JSON from the response if it contains text
        const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                          aiResponse.match(/```\n([\s\S]*?)\n```/) || 
                          aiResponse.match(/{[\s\S]*?}/);
                          
        const jsonStr = jsonMatch ? jsonMatch[0].replace(/```json\n|```\n|```/g, '') : aiResponse;
        const parsedResponse = JSON.parse(jsonStr);
        
        // Add timestamp to the result
        const result = {
          ...parsedResponse,
          timestamp: new Date().toISOString()
        };
        
        setAnalysisResult(result);
        setPastAnalyses(prev => [result, ...prev]);
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        
        // Create a manually formatted result
        const fallbackResult: FraudAnalysisResult = {
          overallScore: calculateRiskScore(),
          riskLevel: determineRiskLevel(calculateRiskScore()),
          summary: "Based on the provided transaction details and risk indicators, this transaction has been analyzed for potential fraud risk.",
          indicators: generateRiskIndicators(),
          recommendations: [
            "Verify counterparty identity through additional documentation",
            "Compare transaction with historical patterns",
            "Implement additional verification steps for high-value transactions",
            "Document decision-making process for regulatory compliance"
          ],
          timestamp: new Date().toISOString()
        };
        
        setAnalysisResult(fallbackResult);
        setPastAnalyses(prev => [fallbackResult, ...prev]);
      }
      
      setActiveTab('results');
      
      toast({
        title: "Analysis Complete",
        description: "Fraud risk assessment has been generated",
      });
    } catch (error) {
      console.error("Error generating fraud detection report:", error);
      toast({
        title: "Error",
        description: "Failed to generate fraud detection report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const calculateRiskScore = (): number => {
    let score = 80; // Start with a good score
    
    // Deduct points for high-risk factors
    if (transactionData.isNewCounterparty) score -= 10;
    if (transactionData.deviationFromNormal === 'yes') score -= 15;
    if (transactionData.roundNumbers) score -= 5;
    
    // Deduct for risk indicators
    if (riskIndicators.unusualTiming) score -= 10;
    if (riskIndicators.structuredTransactions) score -= 15;
    if (riskIndicators.highRiskLocation) score -= 15;
    if (riskIndicators.mismatchedDetails) score -= 20;
    if (riskIndicators.rapidSuccession) score -= 10;
    if (riskIndicators.shellEntity) score -= 25;
    if (riskIndicators.documentDiscrepancies) score -= 20;
    if (riskIndicators.lackOfTransparency) score -= 15;
    if (riskIndicators.unusualPressure) score -= 10;
    if (riskIndicators.complexStructure) score -= 10;
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  };
  
  const determineRiskLevel = (score: number): 'high' | 'medium' | 'low' => {
    if (score < 40) return 'high';
    if (score < 70) return 'medium';
    return 'low';
  };
  
  const generateRiskIndicators = (): RiskIndicator[] => {
    const indicators: RiskIndicator[] = [];
    
    if (riskIndicators.unusualTiming) {
      indicators.push({
        id: 'unusual-timing',
        name: 'Unusual Transaction Timing',
        description: 'Transaction occurs outside normal business hours or patterns',
        severity: 'medium',
        score: 60
      });
    }
    
    if (riskIndicators.structuredTransactions) {
      indicators.push({
        id: 'structured-transactions',
        name: 'Structured Transactions',
        description: 'Multiple related transactions just below reporting thresholds',
        severity: 'high',
        score: 30
      });
    }
    
    if (riskIndicators.highRiskLocation) {
      indicators.push({
        id: 'high-risk-location',
        name: 'High-Risk Location',
        description: 'Transaction involves entity in high-risk jurisdiction',
        severity: 'high',
        score: 35
      });
    }
    
    if (riskIndicators.mismatchedDetails) {
      indicators.push({
        id: 'mismatched-details',
        name: 'Mismatched Details',
        description: 'Inconsistencies in transaction documentation or details',
        severity: 'high',
        score: 25
      });
    }
    
    if (riskIndicators.shellEntity) {
      indicators.push({
        id: 'shell-entity',
        name: 'Shell Entity Involvement',
        description: 'Transaction involves entity with minimal operational footprint',
        severity: 'high',
        score: 20
      });
    }
    
    // Add more indicators if they exist
    if (transactionData.isNewCounterparty) {
      indicators.push({
        id: 'new-counterparty',
        name: 'New Counterparty',
        description: 'Transaction with previously unknown entity',
        severity: 'medium',
        score: 50
      });
    }
    
    if (transactionData.deviationFromNormal === 'yes') {
      indicators.push({
        id: 'pattern-deviation',
        name: 'Deviation from Normal Patterns',
        description: 'Transaction differs significantly from established patterns',
        severity: 'medium',
        score: 45
      });
    }
    
    return indicators;
  };
  
  const getRiskLevelColor = (riskLevel: 'high' | 'medium' | 'low'): string => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return '';
    }
  };
  
  const getRiskLevelBadge = (riskLevel: 'high' | 'medium' | 'low'): string => {
    switch (riskLevel) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return '';
    }
  };
  
  const getScoreColor = (score: number): string => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };
  
  const handleViewPastAnalysis = (analysis: FraudAnalysisResult) => {
    setSelectedPastAnalysis(analysis);
  };
  
  const handleDeletePastAnalysis = (timestamp: string) => {
    setPastAnalyses(prev => prev.filter(a => a.timestamp !== timestamp));
    setSelectedPastAnalysis(null);
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="transaction">
            <FileText className="mr-2 h-4 w-4" />
            Transaction Details
          </TabsTrigger>
          <TabsTrigger value="results">
            <Shield className="mr-2 h-4 w-4" />
            Analysis Results
          </TabsTrigger>
          <TabsTrigger value="history">
            <Calendar className="mr-2 h-4 w-4" />
            Analysis History
          </TabsTrigger>
        </TabsList>
        
        {/* Transaction Details Tab */}
        <TabsContent value="transaction">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Information</CardTitle>
                <CardDescription>
                  Enter details about the financial transaction to analyze
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transaction-type">Transaction Type <span className="text-red-500">*</span></Label>
                    <Select 
                      value={transactionData.transactionType} 
                      onValueChange={(value) => handleTransactionChange('transactionType', value)}
                    >
                      <SelectTrigger id="transaction-type">
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wire-transfer">Wire Transfer</SelectItem>
                        <SelectItem value="ach">ACH Payment</SelectItem>
                        <SelectItem value="credit-card">Credit Card Payment</SelectItem>
                        <SelectItem value="check">Check Payment</SelectItem>
                        <SelectItem value="cash">Cash Transaction</SelectItem>
                        <SelectItem value="cryptocurrency">Cryptocurrency Transaction</SelectItem>
                        <SelectItem value="international-transfer">International Transfer</SelectItem>
                        <SelectItem value="inter-company">Inter-Company Transfer</SelectItem>
                        <SelectItem value="loan-disbursement">Loan Disbursement</SelectItem>
                        <SelectItem value="investment">Investment Transaction</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="transaction-amount">Transaction Amount <span className="text-red-500">*</span></Label>
                    <Input 
                      id="transaction-amount" 
                      value={transactionData.transactionAmount}
                      onChange={(e) => handleTransactionChange('transactionAmount', e.target.value)}
                      placeholder="e.g. $10,000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="transaction-date">Transaction Date</Label>
                    <Input 
                      id="transaction-date" 
                      type="date"
                      value={transactionData.transactionDate}
                      onChange={(e) => handleTransactionChange('transactionDate', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Input 
                      id="payment-method" 
                      value={transactionData.paymentMethod}
                      onChange={(e) => handleTransactionChange('paymentMethod', e.target.value)}
                      placeholder="e.g. Bank Transfer, Credit Card, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="counterparty">Counterparty Name</Label>
                    <Input 
                      id="counterparty" 
                      value={transactionData.counterparty}
                      onChange={(e) => handleTransactionChange('counterparty', e.target.value)}
                      placeholder="Individual or company name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="counterparty-location">Counterparty Location</Label>
                    <Input 
                      id="counterparty-location" 
                      value={transactionData.counterpartyLocation}
                      onChange={(e) => handleTransactionChange('counterpartyLocation', e.target.value)}
                      placeholder="Country or region"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="new-counterparty" 
                        checked={transactionData.isNewCounterparty}
                        onCheckedChange={(checked) => handleTransactionChange('isNewCounterparty', checked)}
                      />
                      <Label htmlFor="new-counterparty">New counterparty (first transaction)</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recent-frequency">Recent Transaction Frequency</Label>
                    <Select 
                      value={transactionData.recentFrequency} 
                      onValueChange={(value) => handleTransactionChange('recentFrequency', value)}
                    >
                      <SelectTrigger id="recent-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first-time">First Time Transaction</SelectItem>
                        <SelectItem value="infrequent">Infrequent (Several times per year)</SelectItem>
                        <SelectItem value="regular">Regular (Monthly/Quarterly)</SelectItem>
                        <SelectItem value="frequent">Frequent (Weekly or more)</SelectItem>
                        <SelectItem value="sudden-increase">Sudden Increase in Frequency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deviation-normal">Deviates from Normal Pattern?</Label>
                    <RadioGroup 
                      id="deviation-normal"
                      value={transactionData.deviationFromNormal}
                      onValueChange={(value) => handleTransactionChange('deviationFromNormal', value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="deviation-no" />
                        <Label htmlFor="deviation-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="deviation-yes" />
                        <Label htmlFor="deviation-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unknown" id="deviation-unknown" />
                        <Label htmlFor="deviation-unknown">Unknown</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="round-numbers" 
                        checked={transactionData.roundNumbers}
                        onCheckedChange={(checked) => handleTransactionChange('roundNumbers', checked)}
                      />
                      <Label htmlFor="round-numbers">Transaction uses round numbers (e.g. exactly $10,000)</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="transaction-description">Transaction Description/Purpose</Label>
                    <Textarea 
                      id="transaction-description" 
                      value={transactionData.transactionDescription}
                      onChange={(e) => handleTransactionChange('transactionDescription', e.target.value)}
                      placeholder="Describe the purpose of this transaction"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Risk Indicators</CardTitle>
                <CardDescription>
                  Select all risk factors that apply to this transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="unusual-timing" 
                      checked={riskIndicators.unusualTiming}
                      onCheckedChange={(checked) => handleRiskIndicatorChange('unusualTiming', checked)}
                    />
                    <Label htmlFor="unusual-timing">Unusual timing (after hours, weekend, holiday)</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="structured-transactions" 
                      checked={riskIndicators.structuredTransactions}
                      onCheckedChange={(checked) => handleRiskIndicatorChange('structuredTransactions', checked)}
                    />
                    <Label htmlFor="structured-transactions">Structured transactions (multiple similar transactions)</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="high-risk-location" 
                      checked={riskIndicators.highRiskLocation}
                      onCheckedChange={(checked) => handleRiskIndicatorChange('highRiskLocation', checked)}
                    />
                    <Label htmlFor="high-risk-location">High-risk geographic location</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="mismatched-details" 
                      checked={riskIndicators.mismatchedDetails}
                      onCheckedChange={(checked) => handleRiskIndicatorChange('mismatchedDetails', checked)}
                    />
                    <Label htmlFor="mismatched-details">Mismatched or inconsistent details</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="rapid-succession" 
                      checked={riskIndicators.rapidSuccession}
                      onCheckedChange={(checked) => handleRiskIndicatorChange('rapidSuccession', checked)}
                    />
                    <Label htmlFor="rapid-succession">Multiple transactions in rapid succession</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="shell-entity" 
                      checked={riskIndicators.shellEntity}
                      onCheckedChange={(checked) => handleRiskIndicatorChange('shellEntity', checked)}
                    />
                    <Label htmlFor="shell-entity">Shell company or suspicious entity involved</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="document-discrepancies" 
                      checked={riskIndicators.documentDiscrepancies}
                      onCheckedChange={(checked) => handleRiskIndicatorChange('documentDiscrepancies', checked)}
                    />
                    <Label htmlFor="document-discrepancies">Documentation discrepancies or irregularities</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="lack-transparency" 
                      checked={riskIndicators.lackOfTransparency}
                      onCheckedChange={(checked) => handleRiskIndicatorChange('lackOfTransparency', checked)}
                    />
                    <Label htmlFor="lack-transparency">Lack of transparency about transaction purpose</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="unusual-pressure" 
                      checked={riskIndicators.unusualPressure}
                      onCheckedChange={(checked) => handleRiskIndicatorChange('unusualPressure', checked)}
                    />
                    <Label htmlFor="unusual-pressure">Unusual pressure to complete transaction quickly</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="complex-structure" 
                      checked={riskIndicators.complexStructure}
                      onCheckedChange={(checked) => handleRiskIndicatorChange('complexStructure', checked)}
                    />
                    <Label htmlFor="complex-structure">Unnecessarily complex transaction structure</Label>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="additional-context">Additional Risk Context</Label>
                  <Textarea 
                    id="additional-context" 
                    value={riskIndicators.additionalContext}
                    onChange={(e) => handleRiskIndicatorChange('additionalContext', e.target.value)}
                    placeholder="Provide any additional risk factors or context"
                    className="min-h-[80px]"
                  />
                </div>
                
                <Button 
                  onClick={detectFraud}
                  disabled={isAnalyzing || !transactionData.transactionType || !transactionData.transactionAmount}
                  className="w-full mt-4"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Transaction...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Detect Potential Fraud
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Analysis Results Tab */}
        <TabsContent value="results">
          {!analysisResult ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Fraud Analysis Generated</h3>
                <p className="text-muted-foreground mb-4">
                  Complete the transaction information and risk assessment, then run the fraud detection.
                </p>
                <Button variant="outline" onClick={() => setActiveTab('transaction')}>
                  Go to Transaction Details
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fraud Detection Results</CardTitle>
                  <CardDescription>
                    Analysis generated {new Date(analysisResult.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Risk Assessment</h3>
                      <div className="flex items-center">
                        <span className={`font-bold text-lg ${getScoreColor(analysisResult.overallScore)} mr-2`}>
                          {analysisResult.overallScore}/100
                        </span>
                        <Badge className={getRiskLevelBadge(analysisResult.riskLevel)}>
                          {analysisResult.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={analysisResult.overallScore} 
                      className="h-3" 
                      indicatorClassName={
                        analysisResult.overallScore >= 70 ? "bg-green-500" : 
                        analysisResult.overallScore >= 40 ? "bg-yellow-500" : 
                        "bg-red-500"
                      }
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Analysis Summary</h3>
                    <p className="text-muted-foreground">
                      {analysisResult.summary}
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="font-medium mb-4">Risk Indicators</h3>
                    
                    {analysisResult.indicators.map(indicator => {
                      const severityColor = 
                        indicator.severity === 'high' ? 'border-red-500' :
                        indicator.severity === 'medium' ? 'border-yellow-500' :
                        'border-blue-500';
                      
                      return (
                        <div key={indicator.id} className={`border-l-4 ${severityColor} pl-4 py-2`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{indicator.name}</h4>
                              <p className="text-sm text-muted-foreground">{indicator.description}</p>
                            </div>
                            <Badge variant={
                              indicator.severity === 'high' ? 'destructive' :
                              indicator.severity === 'medium' ? 'secondary' :
                              'outline'
                            }>
                              {indicator.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between items-center text-sm mb-1">
                              <span>Risk Score</span>
                              <span className={getScoreColor(indicator.score)}>{indicator.score}/100</span>
                            </div>
                            <Progress 
                              value={indicator.score} 
                              className="h-1.5" 
                              indicatorClassName={
                                indicator.score >= 70 ? "bg-green-500" : 
                                indicator.score >= 40 ? "bg-yellow-500" : 
                                "bg-red-500"
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                    
                    {analysisResult.indicators.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        No specific risk indicators identified.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisResult.recommendations.map((recommendation, i) => (
                      <li key={i} className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                          {i + 1}
                        </div>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="border-t px-6 py-4 flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('transaction')}>
                    New Analysis
                  </Button>
                  
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
        
        {/* Analysis History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>
                View past fraud detection analyses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pastAnalyses.length > 0 ? (
                <div className="space-y-4">
                  {pastAnalyses.map((analysis, index) => (
                    <div 
                      key={index} 
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900/10 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            Analysis from {formatDate(analysis.timestamp)}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {analysis.summary}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getRiskLevelBadge(analysis.riskLevel)}>
                            {analysis.riskLevel.toUpperCase()} RISK
                          </Badge>
                          <p className="text-sm font-medium mt-1">
                            Score: {analysis.overallScore}/100
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeletePastAnalysis(analysis.timestamp)}
                          className="text-xs"
                        >
                          <Trash className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewPastAnalysis(analysis)}
                          className="text-xs"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-1">No Analysis History</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't performed any fraud detection analyses yet.
                  </p>
                  <Button onClick={() => setActiveTab('transaction')}>
                    Run Your First Analysis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Past Analysis Details Dialog */}
          {selectedPastAnalysis && (
            <Dialog open={true} onOpenChange={(open) => !open && setSelectedPastAnalysis(null)}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Analysis Details</DialogTitle>
                </DialogHeader>
                
                <div className="py-4 space-y-6">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Analysis from {formatDate(selectedPastAnalysis.timestamp)}
                    </p>
                    <Badge className={getRiskLevelBadge(selectedPastAnalysis.riskLevel)}>
                      {selectedPastAnalysis.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Risk Score</h3>
                      <span className={`font-bold ${getScoreColor(selectedPastAnalysis.overallScore)}`}>
                        {selectedPastAnalysis.overallScore}/100
                      </span>
                    </div>
                    <Progress 
                      value={selectedPastAnalysis.overallScore} 
                      className="h-2" 
                      indicatorClassName={
                        selectedPastAnalysis.overallScore >= 70 ? "bg-green-500" : 
                        selectedPastAnalysis.overallScore >= 40 ? "bg-yellow-500" : 
                        "bg-red-500"
                      }
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Analysis Summary</h3>
                    <p className="text-muted-foreground">
                      {selectedPastAnalysis.summary}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4">Risk Indicators</h3>
                    <div className="space-y-4">
                      {selectedPastAnalysis.indicators.map(indicator => (
                        <div 
                          key={indicator.id} 
                          className={`border-l-4 pl-4 py-2 ${
                            indicator.severity === 'high' ? 'border-red-500' :
                            indicator.severity === 'medium' ? 'border-yellow-500' :
                            'border-blue-500'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{indicator.name}</h4>
                            <Badge variant={
                              indicator.severity === 'high' ? 'destructive' :
                              indicator.severity === 'medium' ? 'secondary' :
                              'outline'
                            }>
                              {indicator.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{indicator.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Recommendations</h3>
                    <ul className="space-y-2">
                      {selectedPastAnalysis.recommendations.map((recommendation, i) => (
                        <li key={i} className="flex items-start">
                          <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-600 h-5 w-5 mr-3 mt-0.5 text-xs font-medium">
                            {i + 1}
                          </span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeletePastAnalysis(selectedPastAnalysis.timestamp)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Analysis
                  </Button>
                  <Button 
                    onClick={() => setSelectedPastAnalysis(null)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FraudDetectorTool;
