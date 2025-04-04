
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
import { AlertCircle, ArrowRight, BookOpen, CheckCircle, ChevronDown, ChevronUp, Clock, FileText, Gavel, Scale, Send } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import PleaBargainSkeleton from './SkeletonLoaders/PleaBargainSkeleton';

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
  bnsProvisions?: {
    section: string;
    title: string;
    description: string;
  }[];
  legalPrecedents?: {
    case: string;
    court: string;
    year: string;
    summary: string;
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
  const [criminalCode, setCriminalCode] = useState('bns');
  
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendation');
  
  const { toast } = useToast();
  
  // Simulate loading delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
          recommendation: "The offered plea bargain has potential favorable terms under the Bharatiya Nyaya Sanhita framework, but there are significant opportunities to negotiate for better conditions given the specific circumstances of this case and the available evidence. Consider the recent Supreme Court precedents on similar matters.",
          risks: [
            {
              risk: "Criminal Record Impact",
              severity: "high",
              description: "Accepting the plea will result in a permanent criminal record that may affect future employment opportunities and visa applications, particularly significant in the Indian context."
            },
            {
              risk: "Sentencing Uncertainty",
              severity: "medium",
              description: "The offered sentencing range still has significant variability under BNS Section 63 that could result in longer incarceration than anticipated."
            },
            {
              risk: "Collateral Consequences",
              severity: "medium",
              description: "Pleading guilty may have licensing, professional registration, or other consequences under various Indian regulatory frameworks not addressed in the plea offer."
            }
          ],
          benefits: [
            "Significant reduction in potential maximum sentence compared to trial conviction under BNS provisions",
            "Avoidance of lengthy trial proceedings in Indian courts, which often face substantial backlogs",
            "Removal of most serious charges with higher mandatory minimums under the new criminal code",
            "Possibility of probation and community service options included in the offer"
          ],
          negotiationPoints: [
            {
              point: "Reduced probation period",
              rationale: "Given the defendant's lack of prior record, requesting a reduction from 36 to 18 months of probation is reasonable and supported by similar cases in this jurisdiction.",
              priority: "high"
            },
            {
              point: "First-time offender provisions",
              rationale: "Under BNS Section 74, the defendant's circumstances may qualify for special considerations as a first-time offender, which should be explicitly included in the agreement.",
              priority: "high"
            },
            {
              point: "Specific fine amount reduction",
              rationale: "The current range of potential fines is too broad. Negotiating for a specific, lower amount based on financial circumstances is advisable under recent Delhi High Court precedents.",
              priority: "medium"
            },
            {
              point: "Record sealing provisions",
              rationale: "Include explicit terms about eligibility for record sealing after successful completion of all requirements, which is important in the Indian context.",
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
              caseName: "State v. Sharma (2023)",
              bargainOutcome: "Defendant with similar circumstances under BNS provisions negotiated community service in lieu of jail time with reduced charges.",
              relevance: 85,
              expanded: false
            },
            {
              caseName: "State of Maharashtra v. Kumar (2022)",
              bargainOutcome: "Similar charges resulted in 6 months probation after negotiating down from initial 24-month offer.",
              relevance: 76,
              expanded: false
            },
            {
              caseName: "CBI v. Agarwal (2021)",
              bargainOutcome: "Defendant rejected similar plea offer, went to trial, and received 3-year sentence after conviction under pre-BNS laws.",
              relevance: 68,
              expanded: false
            }
          ],
          bnsProvisions: [
            {
              section: "Section 63",
              title: "Punishment after Previous Conviction",
              description: "When a person having been convicted of an offence punishable under this Sanhita is again guilty of any offence punishable under this Sanhita, the punishment may be enhanced."
            },
            {
              section: "Section 74",
              title: "First-time Offender Considerations",
              description: "The court may consider alternative sentencing for first-time offenders based on the nature of the offense and other mitigating factors."
            },
            {
              section: "Section 3(4)",
              title: "Plea Bargaining Provisions",
              description: "Provides for reduced sentences through plea bargaining while ensuring justice for victims and society."
            }
          ],
          legalPrecedents: [
            {
              case: "Murlidhar Meghraj Loya v. State of Maharashtra",
              court: "Supreme Court",
              year: "2022",
              summary: "Established standards for plea bargaining arrangements that ensure fair process while allowing for case disposition efficiency."
            },
            {
              case: "Thana Singh v. Central Bureau of Narcotics",
              court: "Supreme Court",
              year: "2021",
              summary: "Highlighted the need for ensuring defendants fully understand the consequences of plea agreements, particularly for first-time offenders."
            },
            {
              case: "State of Gujarat v. Natwar Harchandji Thakor",
              court: "High Court of Gujarat",
              year: "2023",
              summary: "Provided guidelines for plea bargaining in cases involving potential sentences under the new Bharatiya Nyaya Sanhita."
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
  
  if (isLoading) {
    return <PleaBargainSkeleton />;
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6 p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800/30">
        <div className="flex space-x-2">
          <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-400">Indian Plea Bargaining Framework</h3>
            <p className="text-sm text-blue-700 dark:text-blue-500 mt-1">
              Analyze plea bargain options under the new Bharatiya Nyaya Sanhita (BNS), which replaced the Indian Penal Code. 
              This tool incorporates provisions of the BNS and recent judgments from Indian courts regarding plea negotiations.
            </p>
            <div className="mt-2">
              <Button 
                variant="link" 
                size="sm" 
                className="text-blue-700 dark:text-blue-400 p-0 h-auto text-xs"
                onClick={() => setInfoDialogOpen(true)}
              >
                Learn more about plea bargaining in India
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Plea Bargaining in the Indian Legal System</DialogTitle>
            <DialogDescription>
              Understanding the evolution and current framework
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <h4 className="font-medium text-lg">Historical Context</h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Plea bargaining was formally introduced in India through the Criminal Procedure Code (Amendment) Act, 2005, which added Chapter XXI-A. It was a significant shift from the traditional adversarial system, aiming to reduce court backlogs and expedite justice.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium text-lg">Current Legal Framework</h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Under the new Bharatiya Nyaya Sanhita (BNS) and Bharatiya Nagarik Suraksha Sanhita (BNSS), which replaced the Indian Penal Code and Criminal Procedure Code respectively, plea bargaining provisions have been retained and enhanced. Sections 248-265 of the BNSS provide for plea bargaining in certain cases.
              </p>
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <h5 className="font-medium">Key Provisions:</h5>
                <ul className="mt-2 space-y-2 text-sm">
                  <li>• Available for offenses with maximum punishment up to 7 years</li>
                  <li>• Not applicable for offenses against women, children under 14 years, or socio-economic offenses</li>
                  <li>• Requires voluntary application by the accused</li>
                  <li>• Court must ensure the plea is voluntary and the accused understands the consequences</li>
                </ul>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium text-lg">Procedure for Plea Bargaining</h4>
              <ol className="mt-2 space-y-2 text-sm list-decimal pl-5 text-gray-600 dark:text-gray-400">
                <li>Filing of application by the accused to the court</li>
                <li>Issuance of notice to the public prosecutor/complainant and accused</li>
                <li>In-camera proceedings for working out a mutually satisfactory disposition</li>
                <li>Voluntary plea of guilt by the accused</li>
                <li>Court pronouncement of judgment based on the agreed terms</li>
              </ol>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium text-lg">Landmark Judgments</h4>
              <div className="mt-2 space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <h5 className="font-medium text-sm">State of Gujarat v. Natwar Harchandji Thakor (2023)</h5>
                  <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                    The High Court of Gujarat provided guidelines for plea bargaining under the new BNS provisions, emphasizing the need for ensuring victims' rights are protected in the process.
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <h5 className="font-medium text-sm">Murlidhar Meghraj Loya v. State of Maharashtra (2022)</h5>
                  <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                    The Supreme Court established standards for plea bargaining arrangements that balance efficiency with fairness, particularly focusing on judicial oversight.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Plea Bargain Analysis</CardTitle>
          <CardDescription>Enter case details to analyze a plea bargain offer under Indian law</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jurisdiction">Indian Jurisdiction</Label>
              <Select value={jurisdiction} onValueChange={setJurisdiction}>
                <SelectTrigger id="jurisdiction">
                  <SelectValue placeholder="Select jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="central">Central Court</SelectItem>
                  <SelectItem value="delhi">Delhi High Court</SelectItem>
                  <SelectItem value="maharashtra">Bombay High Court</SelectItem>
                  <SelectItem value="karnataka">Karnataka High Court</SelectItem>
                  <SelectItem value="tamilnadu">Madras High Court</SelectItem>
                  <SelectItem value="westbengal">Calcutta High Court</SelectItem>
                  <SelectItem value="gujarat">Gujarat High Court</SelectItem>
                  <SelectItem value="punjab">Punjab & Haryana High Court</SelectItem>
                  <SelectItem value="telangana">Telangana High Court</SelectItem>
                  <SelectItem value="other">Other High Court</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="criminal-code">Applicable Criminal Code</Label>
              <Select value={criminalCode} onValueChange={setCriminalCode}>
                <SelectTrigger id="criminal-code">
                  <SelectValue placeholder="Select applicable code" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bns">Bharatiya Nyaya Sanhita (BNS), 2023</SelectItem>
                  <SelectItem value="ipc">Indian Penal Code (IPC), 1860 (Previous)</SelectItem>
                  <SelectItem value="special">Special/Local Laws</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <SelectItem value="felony">Prior Serious Offenses</SelectItem>
                  <SelectItem value="violent">Prior Violent Offenses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="charges">Current Charges under BNS/IPC</Label>
            <Textarea
              id="charges"
              placeholder="Describe the current charges, BNS/IPC sections, allegations, and potential penalties..."
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-1 md:grid-cols-4">
              <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
              <TabsTrigger value="legal-analysis">Legal Analysis</TabsTrigger>
              <TabsTrigger value="negotiation">Negotiation Strategy</TabsTrigger>
              <TabsTrigger value="case-precedents">Case Precedents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recommendation" className="pt-4">
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
            </TabsContent>
            
            <TabsContent value="legal-analysis" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>BNS Relevant Provisions</CardTitle>
                  <CardDescription>
                    Key sections of the Bharatiya Nyaya Sanhita applicable to this case
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.bnsProvisions?.map((provision, idx) => (
                      <div key={idx} className="p-4 rounded-md border border-legal-border dark:border-legal-slate/20">
                        <div className="flex items-center mb-2">
                          <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 mr-2">
                            {provision.section}
                          </Badge>
                          <h4 className="font-medium">{provision.title}</h4>
                        </div>
                        <p className="text-sm text-legal-muted dark:text-gray-400">{provision.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Legal Precedents</CardTitle>
                  <CardDescription>
                    Relevant Indian court judgments that may impact this case
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.legalPrecedents?.map((precedent, idx) => (
                      <div key={idx} className="p-4 rounded-md border border-legal-border dark:border-legal-slate/20">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="font-medium">{precedent.case}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                              {precedent.court}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {precedent.year}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-legal-muted dark:text-gray-400">{precedent.summary}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="negotiation" className="pt-4">
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
            </TabsContent>
            
            <TabsContent value="case-precedents" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Similar Case Outcomes</CardTitle>
                  <CardDescription>Relevant Indian cases with similar circumstances and their outcomes</CardDescription>
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
                            <Gavel className="h-5 w-5 text-legal-accent mr-3" />
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
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      <div className="mt-8 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex space-x-2">
          <Gavel className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-300">Indian Legal Disclaimer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              This prediction tool provides estimates based on historical data and the Bharatiya Nyaya Sanhita (BNS) and is not a substitute for legal advice. 
              Sentencing outcomes in India vary by jurisdiction, judge, and specific case circumstances. The tool does not account for all local 
              variations in the application of the BNS across different High Courts. Always consult with a qualified 
              Indian legal practitioner for accurate legal guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PleaBargainTool;
