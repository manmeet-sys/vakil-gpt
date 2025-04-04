
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Scale, ChevronDown, ChevronUp, Percent, BarChart3, Timer, Calendar, Landmark, Tag, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const LitigationPredictionPage = () => {
  const [caseType, setCaseType] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [caseFacts, setCaseFacts] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [precedents, setPrecedents] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('litigation-prediction');
  const [applicableLaws, setApplicableLaws] = useState<string[]>([]);
  
  const [analysis, setAnalysis] = useState<{
    winProbability: number;
    settlementProbability: number;
    factors: {
      name: string;
      impact: "positive" | "negative" | "neutral";
      description: string;
      expanded?: boolean;
    }[];
    timeEstimate: {
      min: number;
      max: number;
      unit: "days" | "months" | "years";
    };
    costEstimate: {
      min: number;
      max: number;
    };
    similarCases: {
      title: string;
      outcome: "favorable" | "unfavorable" | "settlement";
      relevance: number; // 0-100
      description: string;
    }[];
    applicableLaws: {
      name: string;
      sections: string[];
      description: string;
    }[];
  } | null>(null);
  
  const { toast } = useToast();
  
  const addPrecedent = () => {
    setPrecedents([...precedents, '']);
  };
  
  const updatePrecedent = (index: number, value: string) => {
    const updatedPrecedents = [...precedents];
    updatedPrecedents[index] = value;
    setPrecedents(updatedPrecedents);
  };
  
  const removePrecedent = (index: number) => {
    const updatedPrecedents = [...precedents];
    updatedPrecedents.splice(index, 1);
    setPrecedents(updatedPrecedents);
  };

  const handleApplicableLawToggle = (law: string) => {
    if (applicableLaws.includes(law)) {
      setApplicableLaws(applicableLaws.filter(l => l !== law));
    } else {
      setApplicableLaws([...applicableLaws, law]);
    }
  };
  
  const analyzeLitigation = () => {
    if (!caseType || !jurisdiction || !caseFacts) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis with a timeout
    setTimeout(() => {
      // Generate more India-specific mock analysis
      const mockAnalysis = {
        winProbability: 68,
        settlementProbability: 75,
        factors: [
          {
            name: "Strong Supreme Court Precedents",
            impact: "positive" as const,
            description: "Multiple Supreme Court judgments with similar fact patterns have resulted in favorable outcomes in this jurisdiction.",
            expanded: false
          },
          {
            name: "Recent BNS Application",
            impact: "neutral" as const,
            description: "As the Bharatiya Nyaya Sanhita is recently enacted, its interpretation by courts in similar cases is limited, creating some uncertainty.",
            expanded: false
          },
          {
            name: "Jurisdictional Delay Concerns",
            impact: "negative" as const,
            description: "Cases in the selected jurisdiction are currently facing significant backlogs, which may impact timelines.",
            expanded: false
          },
          {
            name: "Documentary Evidence Strength",
            impact: "positive" as const,
            description: "Based on the facts presented, your documentary evidence appears strong under Indian Evidence Act standards.",
            expanded: false
          },
          {
            name: "Procedural Compliance Issues",
            impact: "negative" as const,
            description: "There may be potential procedural compliance issues under the Civil Procedure Code that could affect the case outcome.",
            expanded: false
          }
        ],
        timeEstimate: {
          min: 18,
          max: 28,
          unit: "months" as const
        },
        costEstimate: {
          min: 200000,
          max: 450000
        },
        similarCases: [
          {
            title: "Sharma v. Reliance Industries Ltd (2021)",
            outcome: "favorable" as const,
            relevance: 86,
            description: "Delhi High Court ruled in favor of the plaintiff in a similar contractual dispute, citing failure to perform essential obligations."
          },
          {
            title: "Mehta Enterprises v. HDFC Bank Ltd (2020)",
            outcome: "settlement" as const,
            relevance: 74,
            description: "Bombay High Court matter with similar issues that resulted in a settlement during pre-trial proceedings."
          },
          {
            title: "Gupta Trading Co. v. State Bank of India (2019)",
            outcome: "unfavorable" as const,
            relevance: 68,
            description: "Supreme Court ruled against the plaintiff due to insufficient evidence of damages under similar contractual terms."
          }
        ],
        applicableLaws: [
          {
            name: "Indian Contract Act, 1872",
            sections: ["Section 73", "Section 74", "Section 75"],
            description: "Provides the framework for determining damages in case of breach of contract."
          },
          {
            name: "Code of Civil Procedure, 1908",
            sections: ["Order VII", "Order VIII"],
            description: "Governs the procedural aspects of filing and responding to civil suits."
          },
          {
            name: "Specific Relief Act, 1963",
            sections: ["Section 10", "Section 14", "Section 16"],
            description: "Relevant for seeking specific performance of contractual obligations."
          },
          {
            name: "Indian Evidence Act, 1872",
            sections: ["Section 101", "Section 102", "Section 103"],
            description: "Determines burden of proof and admissibility of evidence."
          },
          {
            name: jurisdiction.includes("commercial") ? "Commercial Courts Act, 2015" : "",
            sections: jurisdiction.includes("commercial") ? ["Section 6", "Section 12", "Section 13"] : [],
            description: jurisdiction.includes("commercial") ? "Special provisions for handling commercial disputes." : ""
          }
        ].filter(law => law.name !== "")
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "Litigation prediction analysis has been completed",
      });
    }, 3000);
  };
  
  const toggleFactorExpanded = (factorName: string) => {
    if (analysis) {
      const updatedFactors = analysis.factors.map(factor => 
        factor.name === factorName ? { ...factor, expanded: !factor.expanded } : factor
      );
      setAnalysis({ ...analysis, factors: updatedFactors });
    }
  };
  
  const getOutcomeColor = (outcome: "favorable" | "unfavorable" | "settlement") => {
    switch (outcome) {
      case "favorable":
        return "text-green-600 dark:text-green-400";
      case "unfavorable":
        return "text-red-600 dark:text-red-400";
      case "settlement":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };
  
  const getFactorColor = (impact: "positive" | "negative" | "neutral") => {
    switch (impact) {
      case "positive":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "negative":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "neutral":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };
  
  return (
    <LegalToolLayout
      title="AI-Powered Indian Litigation Prediction"
      description="Analyze case details to predict litigation outcomes, settlement probabilities, and case timelines in Indian courts based on historical data and jurisdiction-specific insights."
      icon={<Scale className="w-6 h-6 text-white" />}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Alert className="mb-4 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle>Indian Litigation Analysis Tool</AlertTitle>
          <AlertDescription className="text-sm">
            This tool analyzes your case under Indian laws including recent legislation like the Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA) where applicable.
          </AlertDescription>
        </Alert>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="litigation-prediction">
              <Scale className="h-4 w-4 mr-2" />
              Litigation Analyzer
            </TabsTrigger>
            <TabsTrigger value="jurisdiction-insights">
              <Landmark className="h-4 w-4 mr-2" />
              Court Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="litigation-prediction">
            <Card>
              <CardHeader>
                <CardTitle>Case Analysis</CardTitle>
                <CardDescription>Enter your case details for predictive analysis in Indian courts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="case-type">Case Type</Label>
                    <Select value={caseType} onValueChange={setCaseType}>
                      <SelectTrigger id="case-type">
                        <SelectValue placeholder="Select case type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breach-of-contract">Breach of Contract</SelectItem>
                        <SelectItem value="property-dispute">Property Dispute</SelectItem>
                        <SelectItem value="employment">Employment Dispute</SelectItem>
                        <SelectItem value="intellectual-property">Intellectual Property</SelectItem>
                        <SelectItem value="consumer-dispute">Consumer Dispute</SelectItem>
                        <SelectItem value="corporate-litigation">Corporate Litigation</SelectItem>
                        <SelectItem value="matrimonial">Matrimonial Dispute</SelectItem>
                        <SelectItem value="civil-damages">Civil Damages</SelectItem>
                        <SelectItem value="landlord-tenant">Landlord-Tenant Dispute</SelectItem>
                        <SelectItem value="administrative">Administrative Law</SelectItem>
                        <SelectItem value="constitutional">Constitutional Law</SelectItem>
                        <SelectItem value="environmental">Environmental Litigation</SelectItem>
                        <SelectItem value="banking">Banking Dispute</SelectItem>
                        <SelectItem value="tax">Tax Litigation</SelectItem>
                        <SelectItem value="criminal">Criminal Case</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="jurisdiction">Indian Jurisdiction</Label>
                    <Select value={jurisdiction} onValueChange={setJurisdiction}>
                      <SelectTrigger id="jurisdiction">
                        <SelectValue placeholder="Select jurisdiction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supreme-court">Supreme Court of India</SelectItem>
                        <SelectItem value="delhi-hc">Delhi High Court</SelectItem>
                        <SelectItem value="bombay-hc">Bombay High Court</SelectItem>
                        <SelectItem value="calcutta-hc">Calcutta High Court</SelectItem>
                        <SelectItem value="madras-hc">Madras High Court</SelectItem>
                        <SelectItem value="karnataka-hc">Karnataka High Court</SelectItem>
                        <SelectItem value="allahabad-hc">Allahabad High Court</SelectItem>
                        <SelectItem value="gujarat-hc">Gujarat High Court</SelectItem>
                        <SelectItem value="punjab-haryana-hc">Punjab & Haryana High Court</SelectItem>
                        <SelectItem value="district-court">District Court</SelectItem>
                        <SelectItem value="commercial-court">Commercial Court</SelectItem>
                        <SelectItem value="consumer-forum">Consumer Forum</SelectItem>
                        <SelectItem value="tribunal-nclt">NCLT (Company Law)</SelectItem>
                        <SelectItem value="tribunal-nclat">NCLAT (Company Law Appeals)</SelectItem>
                        <SelectItem value="tribunal-dgca">DGCA Tribunal (Aviation)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Applicable Laws</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={applicableLaws.includes('contract-act') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleApplicableLawToggle('contract-act')}
                      className="rounded-full"
                    >
                      Indian Contract Act
                    </Button>
                    <Button
                      type="button"
                      variant={applicableLaws.includes('bns') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleApplicableLawToggle('bns')}
                      className="rounded-full"
                    >
                      BNS 2023
                    </Button>
                    <Button
                      type="button"
                      variant={applicableLaws.includes('bnss') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleApplicableLawToggle('bnss')}
                      className="rounded-full"
                    >
                      BNSS 2023
                    </Button>
                    <Button
                      type="button"
                      variant={applicableLaws.includes('bsa') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleApplicableLawToggle('bsa')}
                      className="rounded-full"
                    >
                      BSA 2023
                    </Button>
                    <Button
                      type="button"
                      variant={applicableLaws.includes('cpc') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleApplicableLawToggle('cpc')}
                      className="rounded-full"
                    >
                      CPC 1908
                    </Button>
                    <Button
                      type="button"
                      variant={applicableLaws.includes('companies-act') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleApplicableLawToggle('companies-act')}
                      className="rounded-full"
                    >
                      Companies Act
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="case-facts">Case Facts and Details</Label>
                  <Textarea
                    id="case-facts"
                    placeholder="Describe the key facts and details of your case under Indian law..."
                    className="min-h-36"
                    value={caseFacts}
                    onChange={(e) => setCaseFacts(e.target.value)}
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Relevant Indian Case Precedents (Optional)</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addPrecedent}
                    >
                      Add Precedent
                    </Button>
                  </div>
                  
                  {precedents.length > 0 ? (
                    <div className="space-y-2">
                      {precedents.map((precedent, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            placeholder={`Enter case citation (e.g., Sharma v. Gupta, AIR 2020 SC 456)`}
                            value={precedent}
                            onChange={(e) => updatePrecedent(index, e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removePrecedent(index)}
                            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-legal-muted">No precedents added. Add relevant Indian case precedents to improve prediction accuracy.</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
                <Button
                  onClick={analyzeLitigation}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Litigation Potential"}
                </Button>
              </CardFooter>
            </Card>
            
            {analysis && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Indian Litigation Prediction</CardTitle>
                    <CardDescription>AI-generated analysis based on Indian case law and legal framework</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium flex items-center">
                            <Percent className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                            Success Probability
                          </h3>
                          <div className="mt-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-legal-muted">Likelihood of success</span>
                              <span className="text-sm font-medium text-legal-muted">{analysis.winProbability}%</span>
                            </div>
                            <Progress 
                              value={analysis.winProbability} 
                              className="h-2.5 bg-gray-200 dark:bg-gray-700" 
                            />
                          </div>
                          <p className="text-sm text-legal-muted mt-2">
                            Based on Indian case law and your selected jurisdiction, your case has a {analysis.winProbability}% probability of a favorable outcome.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium flex items-center">
                            <Percent className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                            Settlement Probability
                          </h3>
                          <div className="mt-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-legal-muted">Likelihood of settlement</span>
                              <span className="text-sm font-medium text-legal-muted">{analysis.settlementProbability}%</span>
                            </div>
                            <Progress 
                              value={analysis.settlementProbability} 
                              className="h-2.5 bg-gray-200 dark:bg-gray-700" 
                            />
                          </div>
                          <p className="text-sm text-legal-muted mt-2">
                            There is a {analysis.settlementProbability}% probability that this case will settle before trial in the Indian legal system.
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-legal-accent" />
                            Estimated Timeline
                          </h3>
                          <div className="p-3 mt-2 border border-legal-border dark:border-legal-slate/20 rounded-md">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-legal-muted">Expected case duration in Indian courts:</span>
                              <span className="font-medium">
                                {analysis.timeEstimate.min}-{analysis.timeEstimate.max} {analysis.timeEstimate.unit}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium flex items-center">
                            <Timer className="h-5 w-5 mr-2 text-legal-accent" />
                            Estimated Costs
                          </h3>
                          <div className="p-3 mt-2 border border-legal-border dark:border-legal-slate/20 rounded-md">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-legal-muted">Projected legal costs in India:</span>
                              <span className="font-medium">
                                ₹{analysis.costEstimate.min.toLocaleString()}-₹{analysis.costEstimate.max.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Tag className="h-5 w-5 mr-2 text-legal-accent" />
                        Applicable Indian Laws
                      </h3>
                      
                      <div className="space-y-3">
                        {analysis.applicableLaws.map((law, index) => (
                          <div 
                            key={index}
                            className="p-3 border border-legal-border dark:border-legal-slate/20 rounded-md"
                          >
                            <h4 className="font-medium">{law.name}</h4>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {law.sections.map((section, idx) => (
                                <Badge key={idx} variant="outline" className="bg-legal-accent/10">{section}</Badge>
                              ))}
                            </div>
                            <p className="text-sm text-legal-muted mt-2">{law.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-legal-accent" />
                        Key Factors Affecting Outcome
                      </h3>
                      
                      <div className="space-y-3">
                        {analysis.factors.map((factor) => (
                          <div 
                            key={factor.name}
                            className="border border-legal-border dark:border-legal-slate/20 rounded-md overflow-hidden"
                          >
                            <div 
                              className="p-3 flex items-center justify-between cursor-pointer"
                              onClick={() => toggleFactorExpanded(factor.name)}
                            >
                              <div className="flex items-center">
                                <div className={`px-2 py-1 rounded-md text-xs font-medium ${getFactorColor(factor.impact)} mr-3`}>
                                  {factor.impact.charAt(0).toUpperCase() + factor.impact.slice(1)}
                                </div>
                                <span className="font-medium">{factor.name}</span>
                              </div>
                              
                              <div>
                                {factor.expanded ? (
                                  <ChevronUp className="h-5 w-5 text-legal-muted" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-legal-muted" />
                                )}
                              </div>
                            </div>
                            
                            {factor.expanded && (
                              <div className="p-3 pt-0 border-t border-legal-border dark:border-legal-slate/20">
                                <p className="text-legal-muted">{factor.description}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Similar Indian Case Outcomes</CardTitle>
                    <CardDescription>Analysis of relevant Indian cases with similar fact patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.similarCases.map((caseItem, index) => (
                        <div 
                          key={index}
                          className="p-4 border border-legal-border dark:border-legal-slate/20 rounded-md"
                        >
                          <div className="flex flex-wrap justify-between items-start mb-2">
                            <h4 className="font-medium">{caseItem.title}</h4>
                            <div className="flex items-center mt-1 sm:mt-0">
                              <span className={`${getOutcomeColor(caseItem.outcome)} mr-3`}>
                                {caseItem.outcome.charAt(0).toUpperCase() + caseItem.outcome.slice(1)} Outcome
                              </span>
                              <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                {caseItem.relevance}% Match
                              </span>
                            </div>
                          </div>
                          <p className="text-legal-muted">{caseItem.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
                    <Button 
                      onClick={() => {
                        toast({
                          title: "Report Generated",
                          description: "Complete Indian litigation prediction report has been generated",
                        });
                      }}
                    >
                      Generate Full Report
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="jurisdiction-insights">
            <Card>
              <CardHeader>
                <CardTitle>Indian Court Jurisdiction Insights</CardTitle>
                <CardDescription>Performance metrics and trends across Indian courts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border border-gray-200 dark:border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Supreme Court of India</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-legal-muted">Avg. Case Duration:</span>
                          <span className="text-sm ml-1 font-medium">4.2 years</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-legal-muted">Disposal Rate:</span>
                          <span className="text-sm ml-1 font-medium">63%</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-legal-muted">Pending Cases:</span>
                          <span className="text-sm ml-1 font-medium">72,000+</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200 dark:border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Delhi High Court</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-legal-muted">Avg. Case Duration:</span>
                          <span className="text-sm ml-1 font-medium">3.1 years</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-legal-muted">Disposal Rate:</span>
                          <span className="text-sm ml-1 font-medium">58%</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-legal-muted">Pending Cases:</span>
                          <span className="text-sm ml-1 font-medium">95,000+</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200 dark:border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Bombay High Court</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-legal-muted">Avg. Case Duration:</span>
                          <span className="text-sm ml-1 font-medium">3.6 years</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-legal-muted">Disposal Rate:</span>
                          <span className="text-sm ml-1 font-medium">52%</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-legal-muted">Pending Cases:</span>
                          <span className="text-sm ml-1 font-medium">175,000+</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="p-4 border border-legal-border dark:border-legal-slate/20 rounded-md">
                  <h3 className="font-medium mb-3">Indian Legal System Efficiency Insights</h3>
                  <ul className="space-y-2 text-sm text-legal-muted">
                    <li>
                      <span className="font-medium text-legal-slate dark:text-white">Fast-Track Courts:</span> 14% faster resolution of cases compared to regular courts, with higher success rates in certain jurisdictions.
                    </li>
                    <li>
                      <span className="font-medium text-legal-slate dark:text-white">Commercial Courts:</span> 23% quicker resolution for business disputes under the Commercial Courts Act, with higher settlement rates.
                    </li>
                    <li>
                      <span className="font-medium text-legal-slate dark:text-white">New Criminal Laws Impact:</span> Implementation of BNS, BNSS, and BSA is expected to improve case processing efficiency by an estimated 18% over the next 3 years.
                    </li>
                    <li>
                      <span className="font-medium text-legal-slate dark:text-white">E-Filing Advantage:</span> Cases filed electronically see 22% faster initial processing and 15% faster overall resolution in supported jurisdictions.
                    </li>
                    <li>
                      <span className="font-medium text-legal-slate dark:text-white">Alternative Dispute Resolution:</span> 67% of cases referred to mediation reach settlement, with average time savings of 16 months compared to litigation.
                    </li>
                  </ul>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-legal-border dark:border-legal-slate/20 rounded-md">
                    <h3 className="font-medium mb-3">Recent Judicial Trends in India</h3>
                    <ul className="space-y-2 text-sm text-legal-muted list-disc pl-5">
                      <li>Increased emphasis on virtual hearings post-pandemic, with 38% of non-evidentiary hearings conducted virtually</li>
                      <li>Growing acceptance of digital evidence under the new BSA framework</li>
                      <li>Higher rates of interim relief in intellectual property cases (increased by 24% in last 3 years)</li>
                      <li>Stronger consumer protection rulings following amendments to Consumer Protection Act</li>
                      <li>More stringent enforcement of contractual terms in commercial disputes</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border border-legal-border dark:border-legal-slate/20 rounded-md">
                    <h3 className="font-medium mb-3">Settlement Statistics by Case Type</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Commercial Disputes</span>
                          <span className="text-sm font-medium">72%</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Property Disputes</span>
                          <span className="text-sm font-medium">48%</span>
                        </div>
                        <Progress value={48} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Family Law Matters</span>
                          <span className="text-sm font-medium">65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Employment Disputes</span>
                          <span className="text-sm font-medium">58%</span>
                        </div>
                        <Progress value={58} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center pt-2">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('litigation-prediction')}
                  >
                    Apply Insights to Your Case
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

export default LitigationPredictionPage;
