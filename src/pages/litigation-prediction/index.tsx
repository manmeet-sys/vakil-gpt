
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Scale, ChevronDown, ChevronUp, Percent, BarChart3, Timer, Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const LitigationPredictionPage = () => {
  const [caseType, setCaseType] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [caseFacts, setCaseFacts] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [precedents, setPrecedents] = useState<string[]>([]);
  
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
      const mockAnalysis = {
        winProbability: 65,
        settlementProbability: 78,
        factors: [
          {
            name: "Strong Precedent Support",
            impact: "positive" as const,
            description: "Multiple cases with similar fact patterns have resulted in favorable outcomes in this jurisdiction.",
            expanded: false
          },
          {
            name: "Expert Testimony Required",
            impact: "neutral" as const,
            description: "The case will likely require expert testimony, which could strengthen your position but also increases costs and complexity.",
            expanded: false
          },
          {
            name: "Statute of Limitations Concern",
            impact: "negative" as const,
            description: "There may be potential issues with the statute of limitations that could affect the case outcome.",
            expanded: false
          },
          {
            name: "Jurisdiction Tendencies",
            impact: "positive" as const,
            description: "The selected jurisdiction has historically favored plaintiffs in similar cases.",
            expanded: false
          }
        ],
        timeEstimate: {
          min: 14,
          max: 18,
          unit: "months" as const
        },
        costEstimate: {
          min: 50000,
          max: 85000
        },
        similarCases: [
          {
            title: "Smith v. Johnson (2021)",
            outcome: "favorable" as const,
            relevance: 87,
            description: "Similar fact pattern with favorable outcome. Court ruled that the defendant had a duty of care and breached it."
          },
          {
            title: "Williams Corp. v. Davis Inc. (2020)",
            outcome: "settlement" as const,
            relevance: 72,
            description: "Similar contractual dispute that resulted in a settlement after discovery phase."
          },
          {
            title: "Parker Industries v. Thompson (2019)",
            outcome: "unfavorable" as const,
            relevance: 65,
            description: "The court ruled against the plaintiff due to insufficient evidence of damages."
          }
        ]
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
      title="AI-Powered Litigation Prediction"
      description="Analyze case details to predict litigation outcomes, settlement probabilities, and case timelines based on historical data and jurisdiction-specific insights."
      icon={<Scale className="w-6 h-6 text-white" />}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Case Analysis</CardTitle>
            <CardDescription>Enter your case details for predictive analysis</CardDescription>
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
                    <SelectItem value="personal-injury">Personal Injury</SelectItem>
                    <SelectItem value="employment">Employment Dispute</SelectItem>
                    <SelectItem value="intellectual-property">Intellectual Property</SelectItem>
                    <SelectItem value="real-estate">Real Estate Dispute</SelectItem>
                    <SelectItem value="corporate">Corporate Litigation</SelectItem>
                    <SelectItem value="product-liability">Product Liability</SelectItem>
                    <SelectItem value="construction">Construction Dispute</SelectItem>
                    <SelectItem value="insurance">Insurance Claim Dispute</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Select value={jurisdiction} onValueChange={setJurisdiction}>
                  <SelectTrigger id="jurisdiction">
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="federal">Federal Court</SelectItem>
                    <SelectItem value="state-ny">New York State Court</SelectItem>
                    <SelectItem value="state-ca">California State Court</SelectItem>
                    <SelectItem value="state-tx">Texas State Court</SelectItem>
                    <SelectItem value="state-fl">Florida State Court</SelectItem>
                    <SelectItem value="state-il">Illinois State Court</SelectItem>
                    <SelectItem value="state-pa">Pennsylvania State Court</SelectItem>
                    <SelectItem value="state-oh">Ohio State Court</SelectItem>
                    <SelectItem value="state-ga">Georgia State Court</SelectItem>
                    <SelectItem value="other">Other State/Jurisdiction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="case-facts">Case Facts and Details</Label>
              <Textarea
                id="case-facts"
                placeholder="Describe the key facts and details of your case..."
                className="min-h-36"
                value={caseFacts}
                onChange={(e) => setCaseFacts(e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Relevant Precedents (Optional)</Label>
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
                        placeholder={`Enter case citation (e.g., Smith v. Jones, 123 F.3d 456)`}
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
                <p className="text-sm text-legal-muted">No precedents added. Add relevant case precedents to improve prediction accuracy.</p>
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
                <CardTitle>Litigation Prediction</CardTitle>
                <CardDescription>AI-generated analysis based on case details and similar precedents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium flex items-center">
                        <Percent className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                        Win Probability
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
                        Based on the case facts and jurisdiction, your case has a {analysis.winProbability}% probability of a favorable outcome.
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
                        There is a {analysis.settlementProbability}% probability that this case will settle before trial.
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
                          <span className="text-sm text-legal-muted">Expected case duration:</span>
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
                          <span className="text-sm text-legal-muted">Projected legal costs:</span>
                          <span className="font-medium">
                            ${analysis.costEstimate.min.toLocaleString()}-${analysis.costEstimate.max.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
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
                <CardTitle>Similar Case Outcomes</CardTitle>
                <CardDescription>Analysis of relevant cases with similar fact patterns</CardDescription>
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
                      description: "Complete litigation prediction report has been generated",
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
    </LegalToolLayout>
  );
};

export default LitigationPredictionPage;
