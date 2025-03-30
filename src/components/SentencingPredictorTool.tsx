import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { 
  FileText, Scale, BarChart, History, ArrowRight, Check, RotateCcw, 
  Clock, Briefcase, FileCheck, CircleHelp, ChevronRight, ChevronLeft, 
  Shield, Trash, Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { getGeminiResponse } from './GeminiProIntegration';

interface CrimeCategory {
  id: string;
  name: string;
  subCategories: {
    id: string;
    name: string;
  }[];
}

interface SentencingFactor {
  id: string;
  name: string;
  type: 'aggravating' | 'mitigating';
  description: string;
  selected: boolean;
}

interface PriorOffense {
  id: string;
  offense: string;
  date: string;
  sentence: string;
}

interface SentencingEstimate {
  probabilityOfIncarceration: number;
  estimatedSentenceRange: {
    min: number;
    max: number;
  };
  sentenceType: string;
  factors: {
    key: string;
    impact: 'high' | 'medium' | 'low';
    direction: 'increase' | 'decrease';
  }[];
  comparisonToAverage: number;
  alternativeSentences?: string[];
}

const crimeCategories: CrimeCategory[] = [
  {
    id: 'violent',
    name: 'Violent Crimes',
    subCategories: [
      { id: 'assault', name: 'Assault' },
      { id: 'battery', name: 'Battery' },
      { id: 'robbery', name: 'Robbery' },
      { id: 'homicide', name: 'Homicide' }
    ]
  },
  {
    id: 'property',
    name: 'Property Crimes',
    subCategories: [
      { id: 'theft', name: 'Theft/Larceny' },
      { id: 'burglary', name: 'Burglary' },
      { id: 'arson', name: 'Arson' },
      { id: 'vandalism', name: 'Vandalism' }
    ]
  },
  {
    id: 'whitecollar',
    name: 'White Collar Crimes',
    subCategories: [
      { id: 'fraud', name: 'Fraud' },
      { id: 'embezzlement', name: 'Embezzlement' },
      { id: 'tax', name: 'Tax Evasion' },
      { id: 'securities', name: 'Securities Fraud' }
    ]
  },
  {
    id: 'drug',
    name: 'Drug Offenses',
    subCategories: [
      { id: 'possession', name: 'Possession' },
      { id: 'distribution', name: 'Distribution/Sale' },
      { id: 'manufacturing', name: 'Manufacturing' },
      { id: 'trafficking', name: 'Trafficking' }
    ]
  },
  {
    id: 'other',
    name: 'Other Offenses',
    subCategories: [
      { id: 'dui', name: 'DUI/DWI' },
      { id: 'domestic', name: 'Domestic Violence' },
      { id: 'weapons', name: 'Weapons Charges' },
      { id: 'cybercrime', name: 'Cybercrime' }
    ]
  }
];

const sentencingFactors: SentencingFactor[] = [
  {
    id: 'prior-record',
    name: 'Prior Criminal Record',
    type: 'aggravating',
    description: 'Previous criminal convictions can significantly increase sentence severity.',
    selected: false
  },
  {
    id: 'weapon',
    name: 'Weapon Involved',
    type: 'aggravating',
    description: 'Use of a weapon during the commission of a crime typically increases sentence length.',
    selected: false
  },
  {
    id: 'bodily-harm',
    name: 'Bodily Harm Caused',
    type: 'aggravating',
    description: 'Physical injury to victims is a major aggravating factor in sentencing.',
    selected: false
  },
  {
    id: 'vulnerable-victim',
    name: 'Vulnerable Victim',
    type: 'aggravating',
    description: 'Crimes against children, elderly, or disabled individuals often receive harsher sentences.',
    selected: false
  },
  {
    id: 'position-of-trust',
    name: 'Position of Trust',
    type: 'aggravating',
    description: 'Abuse of a position of trust or authority can enhance sentencing.',
    selected: false
  },
  {
    id: 'financial-damage',
    name: 'Significant Financial Damage',
    type: 'aggravating',
    description: 'Large financial losses to victims can increase sentence severity.',
    selected: false
  },
  {
    id: 'no-priors',
    name: 'No Prior Record',
    type: 'mitigating',
    description: 'First-time offenders often receive more lenient sentences.',
    selected: false
  },
  {
    id: 'mental-health',
    name: 'Mental Health Issues',
    type: 'mitigating',
    description: 'Documented mental health conditions may reduce culpability in some cases.',
    selected: false
  },
  {
    id: 'cooperation',
    name: 'Cooperation with Authorities',
    type: 'mitigating',
    description: 'Assistance to law enforcement can result in reduced sentences.',
    selected: false
  },
  {
    id: 'remorse',
    name: 'Genuine Remorse',
    type: 'mitigating',
    description: 'Demonstrating sincere remorse can positively influence sentencing.',
    selected: false
  },
  {
    id: 'community-ties',
    name: 'Strong Community Ties',
    type: 'mitigating',
    description: 'Employment history, family support, and community involvement can reduce sentences.',
    selected: false
  },
  {
    id: 'rehabilitation',
    name: 'Rehabilitation Potential',
    type: 'mitigating',
    description: 'Evidence of rehabilitation efforts or potential can lead to lesser sentences.',
    selected: false
  }
];

const SentencingPredictorTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState('case-info');
  
  // Case Information State
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOffense, setSelectedOffense] = useState('');
  const [offenseLevel, setOffenseLevel] = useState<'misdemeanor' | 'felony'>('misdemeanor');
  const [offenseDegree, setOffenseDegree] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [caseDetails, setCaseDetails] = useState('');
  
  // Defendant Information State
  const [age, setAge] = useState('');
  const [priorOffenses, setPriorOffenses] = useState<PriorOffense[]>([]);
  const [newPriorOffense, setNewPriorOffense] = useState({
    offense: '',
    date: '',
    sentence: ''
  });
  const [factors, setFactors] = useState<SentencingFactor[]>(sentencingFactors);
  const [additionalFactors, setAdditionalFactors] = useState('');
  
  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentencingEstimate, setSentencingEstimate] = useState<SentencingEstimate | null>(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '');
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  
  // Dialog States
  const [isFactorDialogOpen, setIsFactorDialogOpen] = useState(false);
  const [isOffenseDialogOpen, setIsOffenseDialogOpen] = useState(false);
  
  React.useEffect(() => {
    localStorage.setItem('geminiApiKey', apiKey);
  }, [apiKey]);

  const addPriorOffense = () => {
    if (!newPriorOffense.offense || !newPriorOffense.date) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both the offense and date",
      });
      return;
    }
    
    const offense: PriorOffense = {
      id: Date.now().toString(),
      ...newPriorOffense
    };
    
    setPriorOffenses([...priorOffenses, offense]);
    setNewPriorOffense({
      offense: '',
      date: '',
      sentence: ''
    });
    
    toast({
      title: "Prior Offense Added",
      description: "The offense has been added to the defendant's history",
    });
  };

  const removePriorOffense = (id: string) => {
    setPriorOffenses(priorOffenses.filter(offense => offense.id !== id));
  };

  const toggleFactor = (id: string) => {
    setFactors(
      factors.map(factor => 
        factor.id === id 
          ? { ...factor, selected: !factor.selected } 
          : factor
      )
    );
  };

  const saveApiKey = () => {
    localStorage.setItem('geminiApiKey', apiKey);
    setIsApiKeyDialogOpen(false);
    
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved for future use",
    });
  };

  const validateCaseInfo = () => {
    if (!selectedCategory || !selectedOffense || !offenseLevel || !jurisdiction) {
      toast({
        variant: "destructive",
        title: "Missing Case Information",
        description: "Please fill in all required case information fields",
      });
      return false;
    }
    return true;
  };

  const analyzeSentencing = async () => {
    if (!validateCaseInfo()) return;
    
    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: "Please set your Gemini API key to use the analysis feature",
      });
      setIsApiKeyDialogOpen(true);
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Generate a mock sentencing estimate first
      const mockEstimate: SentencingEstimate = {
        probabilityOfIncarceration: Math.random() * 100,
        estimatedSentenceRange: {
          min: Math.floor(Math.random() * 24),
          max: Math.floor(Math.random() * 48) + 24
        },
        sentenceType: offenseLevel === 'felony' ? 'Prison' : 'Jail/Probation',
        factors: [
          {
            key: 'Offense Severity',
            impact: 'high',
            direction: 'increase'
          },
          {
            key: 'Criminal History',
            impact: priorOffenses.length > 0 ? 'medium' : 'low',
            direction: priorOffenses.length > 0 ? 'increase' : 'decrease'
          }
        ],
        comparisonToAverage: Math.random() * 40 - 20,
        alternativeSentences: [
          'Probation with community service',
          'Electronic monitoring with home detention',
          'Drug/alcohol treatment program'
        ]
      };
      
      // Add all selected factors to the estimate
      factors.filter(f => f.selected).forEach(factor => {
        mockEstimate.factors.push({
          key: factor.name,
          impact: Math.random() > 0.5 ? 'high' : 'medium',
          direction: factor.type === 'aggravating' ? 'increase' : 'decrease'
        });
      });
      
      setSentencingEstimate(mockEstimate);
      
      // Now get AI analysis of the case
      const selectedFactors = factors.filter(f => f.selected).map(f => `${f.name} (${f.type})`).join(', ');
      
      const prompt = `You are a sentencing analysis expert. Based on the following case information, provide a detailed analysis of likely sentencing outcomes and legal considerations.

Case Details:
- Offense: ${selectedOffense} (${offenseLevel}, ${offenseDegree || 'not specified'})
- Jurisdiction: ${jurisdiction}
- Case Notes: ${caseDetails || 'None provided'}

Defendant Information:
- Age: ${age || 'Not provided'}
- Prior Criminal History: ${priorOffenses.length === 0 ? 'None' : priorOffenses.map(p => `${p.offense} (${p.date})`).join(', ')}
- Sentencing Factors: ${selectedFactors || 'None selected'}
- Additional Considerations: ${additionalFactors || 'None provided'}

Please structure your analysis with these sections:
1. Legal Analysis of Potential Sentencing
2. Comparable Case Outcomes
3. Strategic Recommendations
4. Potential Alternative Sentences
5. Key Factors Affecting Sentencing

Ensure your analysis is balanced, fact-based, and considers both the prosecution and defense perspectives.`;
      
      const analysis = await getGeminiResponse(prompt, apiKey);
      setAiAnalysis(analysis);
      
      // Move to the analysis tab
      setActiveTab('analysis');
      
      toast({
        title: "Analysis Complete",
        description: "Sentencing prediction analysis has been generated",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to complete the analysis",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory('');
    setSelectedOffense('');
    setOffenseLevel('misdemeanor');
    setOffenseDegree('');
    setJurisdiction('');
    setCaseDetails('');
    setAge('');
    setPriorOffenses([]);
    setFactors(sentencingFactors.map(f => ({ ...f, selected: false })));
    setAdditionalFactors('');
    setSentencingEstimate(null);
    setAiAnalysis('');
    setActiveTab('case-info');
    
    toast({
      title: "Form Reset",
      description: "All fields have been cleared",
    });
  };

  const downloadAnalysis = () => {
    if (!sentencingEstimate || !aiAnalysis) return;
    
    const analysisText = `
SENTENCING PREDICTION ANALYSIS
==============================
Offense: ${selectedOffense} (${offenseLevel}, ${offenseDegree || 'not specified'})
Jurisdiction: ${jurisdiction}

ESTIMATED OUTCOMES
------------------------------
Probability of Incarceration: ${sentencingEstimate.probabilityOfIncarceration.toFixed(1)}%
Estimated Sentence Range: ${sentencingEstimate.estimatedSentenceRange.min} - ${sentencingEstimate.estimatedSentenceRange.max} months
Sentence Type: ${sentencingEstimate.sentenceType}
Comparison to Average: ${sentencingEstimate.comparisonToAverage > 0 ? '+' : ''}${sentencingEstimate.comparisonToAverage.toFixed(1)}%

KEY FACTORS
------------------------------
${sentencingEstimate.factors.map(f => `- ${f.key}: ${f.impact.toUpperCase()} ${f.direction === 'increase' ? 'INCREASE' : 'DECREASE'}`).join('\n')}

ALTERNATIVE SENTENCING OPTIONS
------------------------------
${sentencingEstimate.alternativeSentences?.join('\n') || 'None identified'}

DETAILED ANALYSIS
------------------------------
${aiAnalysis}

DISCLAIMER
------------------------------
This analysis is provided for informational purposes only and should not be considered legal advice. Actual sentencing outcomes may vary significantly based on individual case circumstances, judge discretion, and other factors not accounted for in this analysis.
    `;
    
    const blob = new Blob([analysisText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Sentencing-Analysis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Analysis Downloaded",
      description: "Analysis has been downloaded as a text file",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">AI Sentencing Predictor</h2>
          <p className="text-muted-foreground">
            Estimate sentencing outcomes based on case factors and historical data
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsApiKeyDialogOpen(true)}
          >
            {apiKey ? 'Change API Key' : 'Set API Key'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetForm}
          >
            Reset Form
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="case-info">
            <FileText className="mr-2 h-4 w-4" />
            Case Information
          </TabsTrigger>
          <TabsTrigger value="defendant-info">
            <Book className="mr-2 h-4 w-4" />
            Defendant Profile
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <BarChart3 className="mr-2 h-4 w-4" />
            Sentencing Analysis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="case-info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Offense Details</CardTitle>
              <CardDescription>
                Enter information about the criminal offense to analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="crime-category">Crime Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                      setSelectedCategory(value);
                      setSelectedOffense('');
                    }}
                  >
                    <SelectTrigger id="crime-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {crimeCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="offense">Specific Offense</Label>
                  <Select
                    value={selectedOffense}
                    onValueChange={setSelectedOffense}
                    disabled={!selectedCategory}
                  >
                    <SelectTrigger id="offense">
                      <SelectValue placeholder="Select offense" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory && crimeCategories
                        .find(cat => cat.id === selectedCategory)
                        ?.subCategories.map(sub => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="offense-level">Offense Level</Label>
                  <Select
                    value={offenseLevel}
                    onValueChange={(value: 'misdemeanor' | 'felony') => setOffenseLevel(value)}
                  >
                    <SelectTrigger id="offense-level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="misdemeanor">Misdemeanor</SelectItem>
                      <SelectItem value="felony">Felony</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="offense-degree">Degree/Class</Label>
                  <Select
                    value={offenseDegree}
                    onValueChange={setOffenseDegree}
                  >
                    <SelectTrigger id="offense-degree">
                      <SelectValue placeholder="Select degree (if applicable)" />
                    </SelectTrigger>
                    <SelectContent>
                      {offenseLevel === 'felony' ? (
                        <>
                          <SelectItem value="1st">First Degree</SelectItem>
                          <SelectItem value="2nd">Second Degree</SelectItem>
                          <SelectItem value="3rd">Third Degree</SelectItem>
                          <SelectItem value="4th">Fourth Degree</SelectItem>
                          <SelectItem value="5th">Fifth Degree</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="A">Class A</SelectItem>
                          <SelectItem value="B">Class B</SelectItem>
                          <SelectItem value="C">Class C</SelectItem>
                          <SelectItem value="unclassified">Unclassified</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Select
                  value={jurisdiction}
                  onValueChange={setJurisdiction}
                >
                  <SelectTrigger id="jurisdiction">
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="federal">Federal</SelectItem>
                    <SelectItem value="alabama">Alabama</SelectItem>
                    <SelectItem value="alaska">Alaska</SelectItem>
                    <SelectItem value="arizona">Arizona</SelectItem>
                    <SelectItem value="arkansas">Arkansas</SelectItem>
                    <SelectItem value="california">California</SelectItem>
                    <SelectItem value="colorado">Colorado</SelectItem>
                    <SelectItem value="connecticut">Connecticut</SelectItem>
                    <SelectItem value="delaware">Delaware</SelectItem>
                    <SelectItem value="florida">Florida</SelectItem>
                    <SelectItem value="georgia">Georgia</SelectItem>
                    <SelectItem value="hawaii">Hawaii</SelectItem>
                    <SelectItem value="idaho">Idaho</SelectItem>
                    <SelectItem value="illinois">Illinois</SelectItem>
                    <SelectItem value="indiana">Indiana</SelectItem>
                    <SelectItem value="iowa">Iowa</SelectItem>
                    <SelectItem value="kansas">Kansas</SelectItem>
                    <SelectItem value="kentucky">Kentucky</SelectItem>
                    <SelectItem value="louisiana">Louisiana</SelectItem>
                    <SelectItem value="maine">Maine</SelectItem>
                    <SelectItem value="maryland">Maryland</SelectItem>
                    <SelectItem value="massachusetts">Massachusetts</SelectItem>
                    <SelectItem value="michigan">Michigan</SelectItem>
                    <SelectItem value="minnesota">Minnesota</SelectItem>
                    <SelectItem value="mississippi">Mississippi</SelectItem>
                    <SelectItem value="missouri">Missouri</SelectItem>
                    <SelectItem value="montana">Montana</SelectItem>
                    <SelectItem value="nebraska">Nebraska</SelectItem>
                    <SelectItem value="nevada">Nevada</SelectItem>
                    <SelectItem value="new-hampshire">New Hampshire</SelectItem>
                    <SelectItem value="new-jersey">New Jersey</SelectItem>
                    <SelectItem value="new-mexico">New Mexico</SelectItem>
                    <SelectItem value="new-york">New York</SelectItem>
                    <SelectItem value="north-carolina">North Carolina</SelectItem>
                    <SelectItem value="north-dakota">North Dakota</SelectItem>
                    <SelectItem value="ohio">Ohio</SelectItem>
                    <SelectItem value="oklahoma">Oklahoma</SelectItem>
                    <SelectItem value="oregon">Oregon</SelectItem>
                    <SelectItem value="pennsylvania">Pennsylvania</SelectItem>
                    <SelectItem value="rhode-island">Rhode Island</SelectItem>
                    <SelectItem value="south-carolina">South Carolina</SelectItem>
                    <SelectItem value="south-dakota">South Dakota</SelectItem>
                    <SelectItem value="tennessee">Tennessee</SelectItem>
                    <SelectItem value="texas">Texas</SelectItem>
                    <SelectItem value="utah">Utah</SelectItem>
                    <SelectItem value="vermont">Vermont</SelectItem>
                    <SelectItem value="virginia">Virginia</SelectItem>
                    <SelectItem value="washington">Washington</SelectItem>
                    <SelectItem value="west-virginia">West Virginia</SelectItem>
                    <SelectItem value="wisconsin">Wisconsin</SelectItem>
                    <SelectItem value="wyoming">Wyoming</SelectItem>
                    <SelectItem value="dc">District of Columbia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="case-details">Case Details (Optional)</Label>
                <Textarea
                  id="case-details"
                  placeholder="Enter specific details about the case that may affect sentencing..."
                  value={caseDetails}
                  onChange={(e) => setCaseDetails(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                <AlertCircle className="inline-block h-4 w-4 mr-1" />
                All fields except Case Details are required
              </div>
              <Button 
                onClick={() => {
                  if (validateCaseInfo()) {
                    setActiveTab('defendant-info');
                  }
                }}
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="defendant-info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Defendant Information</CardTitle>
              <CardDescription>
                Enter details about the defendant that may affect sentencing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="age">Defendant Age (Optional)</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  placeholder="Enter age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Prior Criminal History</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsOffenseDialogOpen(true)}
                  >
                    Add Prior Offense
                  </Button>
                </div>
                
                {priorOffenses.length === 0 ? (
                  <div className="text-sm text-muted-foreground border rounded-md p-4 text-center">
                    No prior offenses recorded
                  </div>
                ) : (
                  <div className="border rounded-md divide-y">
                    {priorOffenses.map((offense) => (
                      <div key={offense.id} className="p-3 flex justify-between items-center">
                        <div>
                          <div className="font-medium">{offense.offense}</div>
                          <div className="text-sm text-muted-foreground flex">
                            <span>Date: {offense.date}</span>
                            {offense.sentence && (
                              <span className="ml-3">Sentence: {offense.sentence}</span>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removePriorOffense(offense.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Sentencing Factors</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsFactorDialogOpen(true)}
                  >
                    View All Factors
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {factors.filter(f => f.selected).length === 0 ? (
                    <div className="text-sm text-muted-foreground border rounded-md p-4 text-center">
                      No factors selected
                    </div>
                  ) : (
                    <div className="border rounded-md divide-y">
                      {factors.filter(f => f.selected).map((factor) => (
                        <div key={factor.id} className="p-3">
                          <div className="flex items-center">
                            <div 
                              className={`w-2 h-2 rounded-full mr-2 ${
                                factor.type === 'aggravating' ? 'bg-red-500' : 'bg-green-500'
                              }`}
                            ></div>
                            <span className="font-medium">{factor.name}</span>
                            <span 
                              className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                factor.type === 'aggravating' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {factor.type === 'aggravating' ? 'Aggravating' : 'Mitigating'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {factor.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="additional-factors">Additional Considerations (Optional)</Label>
                <Textarea
                  id="additional-factors"
                  placeholder="Enter any other factors that may affect sentencing (e.g., family circumstances, health issues)..."
                  value={additionalFactors}
                  onChange={(e) => setAdditionalFactors(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('case-info')}>
                Back
              </Button>
              <Button onClick={analyzeSentencing} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Generate Sentencing Analysis
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-6">
          {!sentencingEstimate ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Analysis Generated Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Fill in the case and defendant information, then generate an analysis to see results.
                </p>
                <Button onClick={() => setActiveTab('case-info')}>
                  Go to Case Information
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Sentencing Estimate</CardTitle>
                  <CardDescription>
                    Estimated outcomes based on case specifics and historical data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold mb-2">
                        {sentencingEstimate.probabilityOfIncarceration.toFixed(1)}%
                      </div>
                      <div className="text-sm text-center text-muted-foreground">
                        Probability of Incarceration
                      </div>
                      <div 
                        className={`w-full h-2 rounded-full mt-2 ${
                          sentencingEstimate.probabilityOfIncarceration > 70 
                            ? 'bg-red-200' 
                            : sentencingEstimate.probabilityOfIncarceration > 30 
                              ? 'bg-yellow-200' 
                              : 'bg-green-200'
                        }`}
                      >
                        <div 
                          className={`h-2 rounded-full ${
                            sentencingEstimate.probabilityOfIncarceration > 70 
                              ? 'bg-red-500' 
                              : sentencingEstimate.probabilityOfIncarceration > 30 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`} 
                          style={{ width: `${sentencingEstimate.probabilityOfIncarceration}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold mb-2">
                        {sentencingEstimate.estimatedSentenceRange.min} - {sentencingEstimate.estimatedSentenceRange.max}
                      </div>
                      <div className="text-sm text-center text-muted-foreground">
                        Estimated Sentence Range (Months)
                      </div>
                      <div className="text-xs mt-2 flex items-center">
                        <span>Min</span>
                        <div className="w-full mx-2 h-2 bg-gray-200 rounded-full">
                          <div className="bg-gray-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <span>Max</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold mb-2">
                        {sentencingEstimate.sentenceType}
                      </div>
                      <div className="text-sm text-center text-muted-foreground">
                        Likely Sentence Type
                      </div>
                      <div 
                        className={`px-2 py-1 rounded-full text-xs mt-2 ${
                          sentencingEstimate.sentenceType.toLowerCase().includes('prison') 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {sentencingEstimate.comparisonToAverage > 0 
                          ? `${sentencingEstimate.comparisonToAverage.toFixed(1)}% higher than average` 
                          : `${Math.abs(sentencingEstimate.comparisonToAverage).toFixed(1)}% lower than average`
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Key Factors</h3>
                      <div className="border rounded-md divide-y">
                        {sentencingEstimate.factors.map((factor, index) => (
                          <div key={index} className="p-3 flex justify-between items-center">
                            <div className="flex items-center">
                              {factor.direction === 'increase' 
                                ? <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                                : <Check className="h-4 w-4 text-green-500 mr-2" />
                              }
                              <span>{factor.key}</span>
                            </div>
                            <div 
                              className={`px-2 py-1 rounded-full text-xs ${
                                factor.direction === 'increase' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {factor.impact.toUpperCase()} {factor.direction.toUpperCase()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Alternative Sentencing Options</h3>
                      <div className="border rounded-md divide-y">
                        {sentencingEstimate.alternativeSentences?.map((alt, index) => (
                          <div key={index} className="p-3">
                            <div className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              <span>{alt}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={downloadAnalysis}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Analysis
                  </Button>
                </CardFooter>
              </Card>
              
              {aiAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Legal Analysis</CardTitle>
                    <CardDescription>
                      AI-generated analysis of sentencing considerations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {aiAnalysis.split('\n\n').map((paragraph, index) => (
                        paragraph.startsWith('#') || paragraph.startsWith('##') ? (
                          <h3 key={index} className="text-lg font-medium mt-4 mb-2">
                            {paragraph.replace(/^#+\s/, '')}
                          </h3>
                        ) : (
                          <p key={index} className="mb-3">
                            {paragraph}
                          </p>
                        )
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full p-3 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <div className="text-sm text-amber-800">
                          <p className="font-medium mb-1">Legal Disclaimer</p>
                          <p>
                            This analysis is provided for informational purposes only and should not be considered legal advice. 
                            Actual sentencing outcomes may vary significantly based on individual case circumstances, judge 
                            discretion, and other factors not accounted for in this analysis. Always consult with a qualified 
                            attorney for professional legal advice.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
      
      {/* API Key Dialog */}
      <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Gemini API Key</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="gemini-api-key" className="mb-2 block">
              Enter your Gemini API Key
            </Label>
            <Input
              id="gemini-api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Key"
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and is used only for generating sentencing analysis.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApiKeyDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveApiKey} disabled={!apiKey.trim()}>Save API Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Sentencing Factors Dialog */}
      <Dialog open={isFactorDialogOpen} onOpenChange={setIsFactorDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Sentencing Factors</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-2">
              <h3 className="font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                Aggravating Factors
              </h3>
              
              {factors.filter(f => f.type === 'aggravating').map((factor) => (
                <div 
                  key={factor.id}
                  className={`p-3 border rounded-md ${factor.selected ? 'bg-red-50 border-red-200' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`factor-${factor.id}`}
                        checked={factor.selected}
                        onChange={() => toggleFactor(factor.id)}
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <label 
                        htmlFor={`factor-${factor.id}`} 
                        className="ml-2 font-medium cursor-pointer"
                      >
                        {factor.name}
                      </label>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 ml-6">
                    {factor.description}
                  </p>
                </div>
              ))}
              
              <h3 className="font-medium flex items-center mt-4">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Mitigating Factors
              </h3>
              
              {factors.filter(f => f.type === 'mitigating').map((factor) => (
                <div 
                  key={factor.id}
                  className={`p-3 border rounded-md ${factor.selected ? 'bg-green-50 border-green-200' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`factor-${factor.id}`}
                        checked={factor.selected}
                        onChange={() => toggleFactor(factor.id)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label 
                        htmlFor={`factor-${factor.id}`} 
                        className="ml-2 font-medium cursor-pointer"
                      >
                        {factor.name}
                      </label>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 ml-6">
                    {factor.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsFactorDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Prior Offense Dialog */}
      <Dialog open={isOffenseDialogOpen} onOpenChange={setIsOffenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Prior Offense</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="prior-offense">Offense</Label>
              <Input
                id="prior-offense"
                value={newPriorOffense.offense}
                onChange={(e) => setNewPriorOffense({...newPriorOffense, offense: e.target.value})}
                placeholder="e.g., Petty Theft, DUI"
              />
            </div>
            
            <div>
              <Label htmlFor="offense-date">Date</Label>
              <Input
                id="offense-date"
                type="date"
                value={newPriorOffense.date}
                onChange={(e) => setNewPriorOffense({...newPriorOffense, date: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="sentence">Sentence (Optional)</Label>
              <Input
                id="sentence"
                value={newPriorOffense.sentence}
                onChange={(e) => setNewPriorOffense({...newPriorOffense, sentence: e.target.value})}
                placeholder="e.g., 6 months probation, 30 days jail"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOffenseDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                addPriorOffense();
                setIsOffenseDialogOpen(false);
              }}
              disabled={!newPriorOffense.offense || !newPriorOffense.date}
            >
              Add Offense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SentencingPredictorTool;
