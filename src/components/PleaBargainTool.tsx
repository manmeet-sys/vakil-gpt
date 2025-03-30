
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, ArrowRight, CheckCircle, ChevronDown, ChevronUp, Clock, FileText, Scale, Send } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface AnalysisResult {
  recommendedAction: 'accept' | 'negotiate' | 'reject';
  confidenceScore: number;
  recommendation: string;
  risks: { risk: string; severity: 'high' | 'medium' | 'low'; description: string }[];
  benefits: string[];
  negotiationPoints: { point: string; rationale: string; priority: 'high' | 'medium' | 'low' }[];
  sentenceComparison: {
    originalEstimate: { min: number; max: number; unit: string };
    pleaBargainOffer: { min: number; max: number; unit: string };
    potentialReduction: number;
  };
  similarCases: {
    caseName: string;
    bargainOutcome: string;
    relevance: number;
    expanded?: boolean;
  }[];
}

const PleaBargainTool = () => {
  // Form state
  const [chargeDescription, setChargeDescription] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [defendantPriors, setDefendantPriors] = useState('none');
  const [offerDescription, setOfferDescription] = useState('');
  const [evidence, setEvidence] = useState('');
  const [mitigatingFactors, setMitigatingFactors] = useState(false);
  const [mitigatingDescription, setMitigatingDescription] = useState('');
  
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const { toast } = useToast();
  
  const handleAnalyze = async () => {
    // Validate inputs
    if (!chargeDescription || !jurisdiction || !offerDescription) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields before analyzing",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // In a real implementation, we would call a Gemini API here
      // For now, we'll simulate a response with a timeout
      setTimeout(() => {
        const mockResult: AnalysisResult = {
          recommendedAction: 'negotiate',
          confidenceScore: 78,
          recommendation: "The offered plea bargain has some favorable terms, but there are opportunities to negotiate for better conditions given the specific circumstances of this case and the available evidence.",
          risks: [
            {
              risk: "Criminal Record",
              severity: "high",
              description: "Accepting the plea will result in a permanent criminal record that may affect future employment opportunities."
            },
            {
              risk: "Sentencing Uncertainty",
              severity: "medium",
              description: "The offered sentencing range still has significant variability that could result in longer incarceration than anticipated."
            },
            {
              risk: "Collateral Consequences",
              severity: "medium",
              description: "Pleading guilty to this charge may have licensing, immigration, or other consequences not addressed in the plea offer."
            }
          ],
          benefits: [
            "Significant reduction in potential maximum sentence compared to trial conviction",
            "Avoidance of lengthy and costly trial proceedings",
            "Removal of most serious charges with higher mandatory minimums",
            "Possibility of alternative sentencing options included in the offer"
          ],
          negotiationPoints: [
            {
              point: "Reduced probation period",
              rationale: "Given the defendant's lack of prior record, requesting a reduction from 36 to 18 months of probation is reasonable and supported by similar cases in this jurisdiction.",
              priority: "high"
            },
            {
              point: "Diversion program eligibility",
              rationale: "The defendant's circumstances may qualify for a first-time offender diversion program, which should be explicitly included in the agreement.",
              priority: "high"
            },
            {
              point: "Specific fine amount",
              rationale: "The current range of potential fines is too broad. Negotiating for a specific, lower amount based on financial circumstances is advisable.",
              priority: "medium"
            },
            {
              point: "Record sealing provisions",
              rationale: "Include explicit terms about eligibility for record sealing or expungement after successful completion of all requirements.",
              priority: "medium"
            }
          ],
          sentenceComparison: {
            originalEstimate: { min: 2, max: 5, unit: "years" },
            pleaBargainOffer: { min: 6, max: 18, unit: "months" },
            potentialReduction: 70
          },
          similarCases: [
            {
              caseName: "State v. Johnson (2022)",
              bargainOutcome: "Defendant with similar circumstances negotiated community service in lieu of jail time with reduced charges.",
              relevance: 85,
              expanded: false
            },
            {
              caseName: "People v. Martinez (2021)",
              bargainOutcome: "Similar charges resulted in 6 months probation after negotiating down from initial 24-month offer.",
              relevance: 76,
              expanded: false
            },
            {
              caseName: "Commonwealth v. Williams (2020)",
              bargainOutcome: "Defendant rejected similar plea offer, went to trial, and received 3-year sentence after conviction.",
              relevance: 68,
              expanded: false
            }
          ]
        };
        
        setAnalysisResult(mockResult);
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis Complete",
          description: "Plea bargain analysis and recommendations are ready to review",
        });
      }, 3000);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to complete the analysis. Please try again.",
        variant: "destructive"
      });
      setIsAnalyzing(false);
    }
  };
  
  const toggleCaseExpanded = (caseName: string) => {
    if (analysisResult) {
      const updatedCases = analysisResult.similarCases.map(caseItem => 
        caseItem.caseName === caseName ? { ...caseItem, expanded: !caseItem.expanded } : caseItem
      );
      setAnalysisResult({ ...analysisResult, similarCases: updatedCases });
    }
  };
  
  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'medium':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300';
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Plea Bargain Analysis</CardTitle>
          <CardDescription>Enter case details to analyze a plea bargain offer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jurisdiction">Jurisdiction</Label>
              <Select value={jurisdiction} onValueChange={setJurisdiction}>
                <SelectTrigger id="jurisdiction">
                  <SelectValue placeholder="Select jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="federal">Federal Court</SelectItem>
                  <SelectItem value="state-ny">New York</SelectItem>
                  <SelectItem value="state-ca">California</SelectItem>
                  <SelectItem value="state-tx">Texas</SelectItem>
                  <SelectItem value="state-fl">Florida</SelectItem>
                  <SelectItem value="state-il">Illinois</SelectItem>
                  <SelectItem value="state-pa">Pennsylvania</SelectItem>
                  <SelectItem value="state-oh">Ohio</SelectItem>
                  <SelectItem value="state-ga">Georgia</SelectItem>
                  <SelectItem value="other">Other State</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priors">Defendant Prior Record</Label>
              <Select value={defendantPriors} onValueChange={setDefendantPriors}>
                <SelectTrigger id="priors">
                  <SelectValue placeholder="Select prior history" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Prior Record</SelectItem>
                  <SelectItem value="minor">Minor Non-Violent Offenses</SelectItem>
                  <SelectItem value="similar">Prior Similar Offenses</SelectItem>
                  <SelectItem value="felony">Prior Felony Convictions</SelectItem>
                  <SelectItem value="violent">Prior Violent Offenses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="charges">Current Charges and Allegations</Label>
            <Textarea
              id="charges"
              placeholder="Describe the current charges, allegations, and potential penalties..."
              value={chargeDescription}
              onChange={(e) => setChargeDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="plea-offer">Plea Bargain Offer Details</Label>
            <Textarea
              id="plea-offer"
              placeholder="Describe the terms of the plea bargain offer..."
              value={offerDescription}
              onChange={(e) => setOfferDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="evidence">Evidence Strength</Label>
            <Textarea
              id="evidence"
              placeholder="Describe the strength of evidence for and against the defendant..."
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="mitigating-factors" 
              checked={mitigatingFactors}
              onCheckedChange={setMitigatingFactors}
            />
            <Label htmlFor="mitigating-factors">Mitigating Factors Present</Label>
          </div>
          
          {mitigatingFactors && (
            <div>
              <Label htmlFor="mitigating-details">Mitigating Factor Details</Label>
              <Textarea
                id="mitigating-details"
                placeholder="Describe any mitigating factors that may influence the case..."
                value={mitigatingDescription}
                onChange={(e) => setMitigatingDescription(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full sm:w-auto"
          >
            {isAnalyzing ? (
              <>Analyzing Plea Bargain...</>
            ) : (
              <>
                Analyze Plea Bargain
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {analysisResult && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recommendation Summary</span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  analysisResult.recommendedAction === 'accept' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                  analysisResult.recommendedAction === 'negotiate' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {analysisResult.recommendedAction === 'accept' ? 'Recommend Accept' :
                   analysisResult.recommendedAction === 'negotiate' ? 'Recommend Negotiate' :
                   'Recommend Reject'}
                </div>
              </CardTitle>
              <CardDescription>
                AI analysis with {analysisResult.confidenceScore}% confidence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                  <p className="text-legal-slate dark:text-white">{analysisResult.recommendation}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Sentence Comparison</h3>
                    <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800/50">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-legal-muted mb-1">Original Estimate:</p>
                          <p className="font-medium text-red-600 dark:text-red-400">
                            {analysisResult.sentenceComparison.originalEstimate.min}-{analysisResult.sentenceComparison.originalEstimate.max} {analysisResult.sentenceComparison.originalEstimate.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-legal-muted mb-1">Plea Bargain Offer:</p>
                          <p className="font-medium text-green-600 dark:text-green-400">
                            {analysisResult.sentenceComparison.pleaBargainOffer.min}-{analysisResult.sentenceComparison.pleaBargainOffer.max} {analysisResult.sentenceComparison.pleaBargainOffer.unit}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Potential Sentence Reduction</span>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">{analysisResult.sentenceComparison.potentialReduction}%</span>
                        </div>
                        <Progress value={analysisResult.sentenceComparison.potentialReduction} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Key Benefits</h3>
                    <div className="space-y-2">
                      {analysisResult.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/20 mr-3">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <p className="text-legal-slate dark:text-white">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Potential Risks</h3>
                  <div className="space-y-3">
                    {analysisResult.risks.map((risk, idx) => (
                      <div key={idx} className="p-3 rounded-md border border-legal-border dark:border-legal-slate/20">
                        <div className="flex items-start">
                          <div className={`p-1.5 rounded-full ${
                            risk.severity === 'high' ? 'bg-red-100 dark:bg-red-900/20' : 
                            risk.severity === 'medium' ? 'bg-amber-100 dark:bg-amber-900/20' : 
                            'bg-blue-100 dark:bg-blue-900/20'
                          } mr-3`}>
                            <AlertCircle className={`h-4 w-4 ${
                              risk.severity === 'high' ? 'text-red-600 dark:text-red-400' : 
                              risk.severity === 'medium' ? 'text-amber-600 dark:text-amber-400' : 
                              'text-blue-600 dark:text-blue-400'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-medium flex items-center">
                              {risk.risk}
                              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getSeverityColor(risk.severity)}`}>
                                {risk.severity.toUpperCase()}
                              </span>
                            </h4>
                            <p className="text-sm text-legal-muted dark:text-gray-400 mt-1">{risk.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Negotiation Strategy</CardTitle>
              <CardDescription>
                Recommended points for further negotiation of the plea bargain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResult.negotiationPoints.map((point, idx) => (
                  <div key={idx} className="p-4 rounded-md border border-legal-border dark:border-legal-slate/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{point.point}</h4>
                      <Badge className={getPriorityColor(point.priority)}>
                        {point.priority.toUpperCase()} PRIORITY
                      </Badge>
                    </div>
                    <p className="text-legal-muted dark:text-gray-400">{point.rationale}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Similar Case Outcomes</CardTitle>
              <CardDescription>Relevant cases with similar circumstances and their outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult.similarCases.map((caseItem) => (
                  <div 
                    key={caseItem.caseName} 
                    className="border border-legal-border dark:border-legal-slate/20 rounded-md overflow-hidden"
                  >
                    <div 
                      className="p-3 flex items-center justify-between cursor-pointer"
                      onClick={() => toggleCaseExpanded(caseItem.caseName)}
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-legal-accent mr-3" />
                        <span className="font-medium">{caseItem.caseName}</span>
                        <span className="ml-3 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          {caseItem.relevance}% Relevant
                        </span>
                      </div>
                      
                      <div>
                        {caseItem.expanded ? (
                          <ChevronUp className="h-5 w-5 text-legal-muted" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-legal-muted" />
                        )}
                      </div>
                    </div>
                    
                    {caseItem.expanded && (
                      <div className="p-3 pt-0 border-t border-legal-border dark:border-legal-slate/20">
                        <p className="text-legal-muted">{caseItem.bargainOutcome}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
              <Button 
                onClick={() => {
                  toast({
                    title: "Report Generated",
                    description: "Complete plea bargain analysis report has been generated",
                  });
                }}
              >
                Generate Full Report
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PleaBargainTool;
