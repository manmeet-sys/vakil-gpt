
import React, { useState } from 'react';
import { Search, AlertTriangle, FileText, Check, X, AlertCircle, Info } from 'lucide-react';
import { BaseAnalyzer, AnalysisResult } from '@/components/practice-area-tools/base';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface RiskCategory {
  name: string;
  description: string;
  score: number;
  factors: RiskFactor[];
}

interface RiskFactor {
  id: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  detected: boolean;
  remarks?: string;
}

const ContractRiskAnalyzer: React.FC = () => {
  const { toast } = useToast();
  const [contractTitle, setContractTitle] = useState<string>('');
  const [contractType, setContractType] = useState<string>('service');
  const [contractText, setContractText] = useState<string>('');
  const [otherParty, setOtherParty] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [riskCategories, setRiskCategories] = useState<RiskCategory[]>([]);
  const [overallRisk, setOverallRisk] = useState<{ score: number; level: string }>({ score: 0, level: '' });
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  
  // Define risk categories and factors
  const initialCategories: RiskCategory[] = [
    {
      name: 'Liability & Indemnification',
      description: 'Assessment of liability clauses, indemnification provisions and risk allocation',
      score: 0,
      factors: [
        { 
          id: 'liab1', 
          description: 'Unlimited or disproportionate liability exposure',
          severity: 'high',
          detected: false 
        },
        { 
          id: 'liab2', 
          description: 'One-sided indemnification clauses favoring the other party',
          severity: 'high',
          detected: false 
        },
        { 
          id: 'liab3', 
          description: 'Missing liability caps or limitations',
          severity: 'medium',
          detected: false 
        },
        { 
          id: 'liab4', 
          description: 'Inadequate insurance requirements',
          severity: 'medium',
          detected: false 
        },
        { 
          id: 'liab5', 
          description: 'Liability for third-party claims without limitations',
          severity: 'high',
          detected: false 
        },
      ]
    },
    {
      name: 'Termination & Exit',
      description: 'Analysis of termination provisions, notice periods and consequences of termination',
      score: 0,
      factors: [
        { 
          id: 'term1', 
          description: 'Unilateral termination rights for other party without cause',
          severity: 'high',
          detected: false 
        },
        { 
          id: 'term2', 
          description: 'Inadequate notice periods for termination',
          severity: 'medium',
          detected: false 
        },
        { 
          id: 'term3', 
          description: 'No transition assistance provisions upon termination',
          severity: 'medium',
          detected: false 
        },
        { 
          id: 'term4', 
          description: 'Missing or inadequate post-termination obligations',
          severity: 'low',
          detected: false 
        },
        { 
          id: 'term5', 
          description: 'Unbalanced consequences of termination (e.g., forfeiture of payments)',
          severity: 'medium',
          detected: false 
        },
      ]
    },
    {
      name: 'Payment & Financial Terms',
      description: 'Review of payment terms, pricing structures, and financial obligations',
      score: 0,
      factors: [
        { 
          id: 'pay1', 
          description: 'Unclear or ambiguous pricing structure',
          severity: 'medium',
          detected: false 
        },
        { 
          id: 'pay2', 
          description: 'One-sided price escalation clauses',
          severity: 'medium',
          detected: false 
        },
        { 
          id: 'pay3', 
          description: 'Extended payment terms favorable to other party',
          severity: 'low',
          detected: false 
        },
        { 
          id: 'pay4', 
          description: 'Inadequate remedies for non-payment or delayed payment',
          severity: 'medium',
          detected: false 
        },
        { 
          id: 'pay5', 
          description: 'Missing tax provisions or unfavorable tax allocation',
          severity: 'medium',
          detected: false 
        },
      ]
    },
    {
      name: 'Intellectual Property Rights',
      description: 'Assessment of IP ownership, licenses, and usage restrictions',
      score: 0,
      factors: [
        { 
          id: 'ip1', 
          description: 'Broad IP ownership transfer to other party',
          severity: 'high',
          detected: false 
        },
        { 
          id: 'ip2', 
          description: 'Inadequate IP protection or licensing provisions',
          severity: 'medium',
          detected: false 
        },
        { 
          id: 'ip3', 
          description: 'Missing or weak IP infringement indemnification',
          severity: 'high',
          detected: false 
        },
        { 
          id: 'ip4', 
          description: 'Ambiguous confidentiality provisions',
          severity: 'medium',
          detected: false 
        },
        { 
          id: 'ip5', 
          description: 'Unreasonable restrictions on use of own IP',
          severity: 'medium',
          detected: false 
        },
      ]
    },
    {
      name: 'Compliance & Regulatory',
      description: 'Evaluation of legal compliance provisions and regulatory requirements',
      score: 0,
      factors: [
        { 
          id: 'comp1', 
          description: 'Missing or inadequate data protection provisions',
          severity: 'high',
          detected: false 
        },
        { 
          id: 'comp2', 
          description: 'Inadequate anti-corruption compliance provisions',
          severity: 'medium',
          detected: false 
        },
        { 
          id: 'comp3', 
          description: 'Non-compliance with industry-specific regulations',
          severity: 'high',
          detected: false 
        },
        { 
          id: 'comp4', 
          description: 'Missing audit rights or compliance verification mechanisms',
          severity: 'low',
          detected: false 
        },
        { 
          id: 'comp5', 
          description: 'Inadequate representation and warranties regarding compliance',
          severity: 'medium',
          detected: false 
        },
      ]
    },
    {
      name: 'Performance & Deliverables',
      description: 'Analysis of performance standards, deliverables, and acceptance criteria',
      score: 0,
      factors: [
        { 
          id: 'perf1', 
          description: 'Ambiguous or subjective performance criteria',
          severity: 'medium',
          detected: false 
        },
        { 
          id: 'perf2', 
          description: 'Unrealistic or unachievable performance metrics',
          severity: 'high',
          detected: false 
        },
        { 
          id: 'perf3', 
          description: 'Missing or inadequate acceptance procedures',
          severity: 'medium',
          detected: false 
        },
        { 
          id: 'perf4', 
          description: 'Lack of clear consequences for performance failure',
          severity: 'medium',
          detected: false 
        },
        { 
          id: 'perf5', 
          description: 'No remediation process for defects or non-conforming deliverables',
          severity: 'medium',
          detected: false 
        },
      ]
    },
  ];

  const simulateAnalysis = () => {
    if (!contractText || !contractTitle) {
      toast({
        title: "Missing information",
        description: "Please enter contract title and the contract text",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    // Reset categories
    setRiskCategories(initialCategories.map(category => ({
      ...category,
      score: 0,
      factors: category.factors.map(factor => ({
        ...factor,
        detected: false,
        remarks: undefined
      }))
    })));
    
    // In a real implementation, this would analyze the actual contract text
    // For this demo, we'll simulate detection based on keywords or random detection
    
    // Simulate processing delay for UX
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(progressInterval);
        
        // Process and simulate detection of risk factors
        const contractLower = contractText.toLowerCase();
        
        // This is just for simulation - in real implementation, use proper NLP/ML techniques
        const updatedCategories = initialCategories.map(category => {
          const updatedFactors = category.factors.map(factor => {
            // For demonstration, we'll detect based on keywords or random detection if text contains keywords
            let detected = false;
            let remarks;
            
            // Simple keyword detection for simulation purposes
            switch (factor.id) {
              case 'liab1':
                detected = contractLower.includes('unlimited liability') || contractLower.includes('full liability');
                remarks = detected ? 'Contract contains language suggesting unlimited liability obligations.' : undefined;
                break;
              case 'liab2':
                detected = contractLower.includes('indemnify') && !contractLower.includes('mutual indemnification');
                remarks = detected ? 'One-sided indemnification provisions detected without reciprocity.' : undefined;
                break;
              case 'term1':
                detected = contractLower.includes('terminate at any time') || contractLower.includes('terminate without cause');
                remarks = detected ? 'Other party can terminate without cause with minimal or no notice.' : undefined;
                break;
              case 'ip1':
                detected = contractLower.includes('assign all rights') || contractLower.includes('transfer all intellectual property');
                remarks = detected ? 'Contract requires broad transfer of intellectual property rights.' : undefined;
                break;
              case 'comp1':
                detected = !contractLower.includes('data protection') && !contractLower.includes('gdpr') && !contractLower.includes('privacy');
                remarks = detected ? 'No specific data protection or privacy provisions identified.' : undefined;
                break;
              case 'perf2':
                detected = contractLower.includes('100% uptime') || contractLower.includes('zero defect');
                remarks = detected ? 'Contract contains potentially unachievable performance standards.' : undefined;
                break;
              default:
                // For other factors, randomly determine if detected based on contract type for simulation
                detected = Math.random() > 0.6;
                if (detected) {
                  remarks = `Potential issue identified based on ${contractType} contract analysis.`;
                }
            }
            
            return {
              ...factor,
              detected,
              remarks
            };
          });
          
          // Calculate category score based on detected factors
          const score = updatedFactors.reduce((total, factor) => {
            if (!factor.detected) return total;
            return total + (factor.severity === 'high' ? 10 : factor.severity === 'medium' ? 5 : 2);
          }, 0);
          
          return {
            ...category,
            score,
            factors: updatedFactors
          };
        });
        
        // Calculate overall risk
        const totalScore = updatedCategories.reduce((sum, category) => sum + category.score, 0);
        const maxPossibleScore = 200; // Assuming max possible risk score
        const riskPercentage = Math.min(100, Math.round((totalScore / maxPossibleScore) * 100));
        
        let riskLevel;
        if (riskPercentage < 25) riskLevel = 'Low Risk';
        else if (riskPercentage < 50) riskLevel = 'Medium Risk';
        else if (riskPercentage < 75) riskLevel = 'High Risk';
        else riskLevel = 'Critical Risk';
        
        setRiskCategories(updatedCategories);
        setOverallRisk({
          score: riskPercentage,
          level: riskLevel
        });
        
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        
        toast({
          title: "Analysis complete",
          description: `Contract risk analysis completed with risk level: ${riskLevel}`,
        });
      }
    }, 200);
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500 dark:text-red-400';
      case 'medium': return 'text-amber-500 dark:text-amber-400';
      case 'low': return 'text-green-500 dark:text-green-400';
      default: return '';
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'low': return <Info className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };
  
  const getProgressColor = (score: number) => {
    if (score < 25) return 'bg-green-500';
    if (score < 50) return 'bg-amber-500';
    if (score < 75) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Critical Risk': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'High Risk': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Medium Risk': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Low Risk': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return '';
    }
  };
  
  const renderResults = () => {
    if (!analysisComplete) return null;
    
    const results: AnalysisResult = {
      title: 'Contract Risk Analysis',
      summary: `The contract "${contractTitle}" has been analyzed for risk factors across ${riskCategories.length} categories. Overall risk level: ${overallRisk.level} (${overallRisk.score}%).`,
      content: (
        <div className="space-y-6">
          {/* Overall Risk Score */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Overall Risk Assessment</span>
                <Badge variant="outline" className={getRiskBadgeColor(overallRisk.level)}>
                  {overallRisk.level}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Risk Score:</span>
                  <span className="font-medium">{overallRisk.score}%</span>
                </div>
                <Progress value={overallRisk.score} className={getProgressColor(overallRisk.score)} />
                <div className="text-sm text-muted-foreground mt-2">
                  Contract: {contractTitle}<br />
                  Type: {contractType.charAt(0).toUpperCase() + contractType.slice(1)} Agreement<br />
                  {otherParty && `Other Party: ${otherParty}`}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Risk Categories Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Risk Areas Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {riskCategories.map((category, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.name}</span>
                      <span className={`text-sm font-medium ${
                        category.score > 15 ? 'text-red-500 dark:text-red-400' :
                        category.score > 10 ? 'text-orange-500 dark:text-orange-400' :
                        category.score > 5 ? 'text-amber-500 dark:text-amber-400' :
                        'text-green-500 dark:text-green-400'
                      }`}>
                        {category.score > 15 ? 'High Risk' : 
                         category.score > 10 ? 'Moderate Risk' :
                         category.score > 5 ? 'Low Risk' :
                         'Minimal Risk'}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(100, (category.score / 30) * 100)} 
                      className={
                        category.score > 15 ? 'bg-red-500' : 
                        category.score > 10 ? 'bg-orange-500' :
                        category.score > 5 ? 'bg-amber-500' :
                        'bg-green-500'
                      } 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Detailed Risk Factors */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Detailed Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {riskCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                      <Badge variant="outline" className={
                        category.score > 15 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                        category.score > 10 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                        category.score > 5 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }>
                        Score: {category.score}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {category.factors.filter(factor => factor.detected).map((factor, factorIndex) => (
                        <div key={factorIndex} className="flex items-start gap-2 bg-muted/30 p-2 rounded-md">
                          <div className="mt-0.5 flex-shrink-0">
                            {getSeverityIcon(factor.severity)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium">{factor.description}</p>
                              <Badge className={`${
                                factor.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                                factor.severity === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              } ml-2`}>
                                {factor.severity.charAt(0).toUpperCase() + factor.severity.slice(1)} Risk
                              </Badge>
                            </div>
                            {factor.remarks && (
                              <p className="text-xs text-muted-foreground mt-1">{factor.remarks}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {!category.factors.some(factor => factor.detected) && (
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                          <Check className="h-4 w-4" />
                          <span>No significant risks detected in this category</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Recommendations */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overallRisk.score > 50 && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p>This contract presents significant risks and should be carefully reviewed by legal counsel before signing.</p>
                  </div>
                )}
                
                {riskCategories.find(c => c.name === 'Liability & Indemnification')?.score > 10 && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p>Consider negotiating liability caps and more balanced indemnification provisions.</p>
                  </div>
                )}
                
                {riskCategories.find(c => c.name === 'Intellectual Property Rights')?.score > 10 && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p>Review IP provisions to ensure adequate protection of your intellectual property rights.</p>
                  </div>
                )}
                
                {riskCategories.find(c => c.name === 'Termination & Exit')?.score > 10 && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p>Negotiate more balanced termination provisions with appropriate notice periods.</p>
                  </div>
                )}
                
                {overallRisk.score < 30 && (
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p>This contract has an acceptable risk profile with minimal significant concerns.</p>
                  </div>
                )}
                
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p>Document all negotiations and agreement changes to maintain a clear record of risk acceptance decisions.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    };
    
    return results;
  };

  return (
    <BaseAnalyzer
      title="Contract Risk Analysis"
      description="Analyze contracts for legal risks, liability exposure, and unfavorable terms"
      icon={<Search className="h-4 w-4 text-blue-600" />}
      onAnalyze={simulateAnalysis}
      isAnalyzing={isAnalyzing}
      analysisResult={renderResults()}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contract-title">Contract Title</Label>
            <Input
              id="contract-title"
              className="mt-1"
              value={contractTitle}
              onChange={(e) => setContractTitle(e.target.value)}
              placeholder="Enter contract title"
            />
          </div>
          
          <div>
            <Label htmlFor="contract-type">Contract Type</Label>
            <Select value={contractType} onValueChange={setContractType}>
              <SelectTrigger id="contract-type" className="mt-1">
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service">Service Agreement</SelectItem>
                <SelectItem value="employment">Employment Contract</SelectItem>
                <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
                <SelectItem value="license">License Agreement</SelectItem>
                <SelectItem value="supply">Supply Agreement</SelectItem>
                <SelectItem value="distribution">Distribution Agreement</SelectItem>
                <SelectItem value="lease">Lease Agreement</SelectItem>
                <SelectItem value="consulting">Consulting Agreement</SelectItem>
                <SelectItem value="loan">Loan Agreement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="other-party">Other Party Name (Optional)</Label>
          <Input
            id="other-party"
            className="mt-1"
            value={otherParty}
            onChange={(e) => setOtherParty(e.target.value)}
            placeholder="Enter name of the other party"
          />
        </div>
        
        <div>
          <Label htmlFor="contract-text">Contract Text</Label>
          <Textarea
            id="contract-text"
            className="mt-1 h-60 font-mono text-sm"
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            placeholder="Paste contract text here for analysis..."
          />
        </div>
        
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              <span>For demonstration, you can enter keywords like "unlimited liability", "indemnify", "terminate at any time", etc. to trigger specific risk detections.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseAnalyzer>
  );
};

export default ContractRiskAnalyzer;
