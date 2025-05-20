import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';
import OpenAIFlashAnalyzer from '@/components/OpenAIFlashAnalyzer';

interface ArgumentBuilderProps {
  caseDetails?: {
    id: string;
    title: string;
    description?: string;
    jurisdiction?: string;
  };
  onAnalysisComplete?: (analysis: ArgumentBuilderType) => void;
}

const ArgumentBuilder: React.FC<ArgumentBuilderProps> = ({ 
  caseDetails, 
  onAnalysisComplete 
}) => {
  const [caseDescription, setCaseDescription] = useState<string>(caseDetails?.description || '');
  const [legalIssue, setLegalIssue] = useState<string>('');
  const [clientPosition, setClientPosition] = useState<string>('plaintiff');
  const [caseType, setCaseType] = useState<string>('civil');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [legalArguments, setLegalArguments] = useState<ArgumentBuilderType | null>(null);
  const [activeTab, setActiveTab] = useState<string>('input');

  // Case types
  const caseTypes = [
    { value: 'civil', label: 'Civil Case' },
    { value: 'criminal', label: 'Criminal Case' },
    { value: 'constitutional', label: 'Constitutional Matter' },
    { value: 'commercial', label: 'Commercial Dispute' },
    { value: 'taxation', label: 'Taxation Matter' },
    { value: 'family', label: 'Family Law Case' },
    { value: 'property', label: 'Property Dispute' },
    { value: 'ip', label: 'Intellectual Property' },
    { value: 'consumer', label: 'Consumer Dispute' },
    { value: 'environmental', label: 'Environmental Case' }
  ];

  const handleGenerateArguments = async () => {
    if (caseDescription.trim().length < 50 || legalIssue.trim().length < 10) {
      toast({
        variant: "destructive",
        title: "Insufficient Information",
        description: "Please provide more details about the case and legal issues.",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const selectedCaseType = caseTypes.find(t => t.value === caseType)?.label || caseType;
      
      const prompt = `You are an AI assistant specialized in Indian law. Build comprehensive legal arguments for the following case based on Indian legal principles, statutes, and precedents.

Case Type: ${selectedCaseType}
Client Position: ${clientPosition === 'plaintiff' ? 'Plaintiff/Petitioner' : 'Defendant/Respondent'}
Case Description: ${caseDescription}
Legal Issue: ${legalIssue}

Your response should be in JSON format with the following structure:
{
  "mainArguments": [
    {
      "title": "Argument title",
      "description": "Detailed argument based on Indian law",
      "strength": "strong/moderate/weak",
      "supportingLaws": ["Relevant Indian statutes, sections and provisions"],
      "supportingCases": ["Relevant Indian case precedents with citations"]
    },
    ...
  ],
  "counterArguments": [
    {
      "title": "Potential counter-argument title",
      "description": "Description of counter-argument",
      "refutationStrategy": "Strategy to refute this counter-argument"
    },
    ...
  ],
  "statutoryReferences": ["Complete list of all relevant Indian statutes"],
  "caseReferences": ["Complete list of all relevant Indian cases with full citations"],
  "constitutionalProvisions": ["Relevant Indian constitutional provisions if applicable"]
}

Include specific references to Indian laws, Indian Penal Code sections, Indian court precedents, and the Constitution of India where relevant. Provide at least 3 main arguments and 2 counter-arguments with refutations.`;

      // Generate the arguments using OpenAI
      const response = await getOpenAIResponse(prompt);
      
      try {
        // Parse the JSON response
        let jsonResponse: ArgumentBuilderType;
        
        // Extract JSON if it's wrapped in text or code blocks
        const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                         response.match(/```\s*([\s\S]*?)\s*```/) || 
                         response.match(/{[\s\S]*}/);
                         
        if (jsonMatch) {
          jsonResponse = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } else {
          jsonResponse = JSON.parse(response);
        }
        
        setLegalArguments(jsonResponse);
        setActiveTab('results');
        
        if (onAnalysisComplete) {
          onAnalysisComplete(jsonResponse);
        }
        
        toast({
          title: "Arguments Built",
          description: "Legal arguments have been generated based on Indian law",
        });
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        toast({
          variant: "destructive",
          title: "Format Error",
          description: "Unable to parse AI response. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error generating arguments:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate arguments",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFlashAnalysis = (analysis: string) => {
    try {
      // Parse JSON from the analysis
      const jsonResponse: ArgumentBuilderType = JSON.parse(analysis);
      setLegalArguments(jsonResponse);
      setActiveTab('results');
      
      if (onAnalysisComplete) {
        onAnalysisComplete(jsonResponse);
      }
      
      toast({
        title: "Flash Analysis Complete",
        description: "Legal arguments have been generated",
      });
    } catch (parseError) {
      console.error("Error parsing flash analysis:", parseError);
      toast({
        variant: "destructive",
        title: "Format Error",
        description: "Unable to parse analysis. Please try again.",
      });
    }
  };
  
  const reset = () => {
    setLegalArguments(null);
    setActiveTab('input');
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'weak':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FilePenLine className="h-5 w-5 text-blue-600" />
          <span>Legal Argument Builder</span>
        </h2>
        <OpenAIFlashAnalyzer onAnalysisComplete={handleFlashAnalysis} />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Case Information</TabsTrigger>
          <TabsTrigger value="results" disabled={!legalArguments}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="case-type">Case Type</Label>
              <Select value={caseType} onValueChange={setCaseType}>
                <SelectTrigger id="case-type">
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  {caseTypes.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client-position">Client Position</Label>
              <RadioGroup 
                id="client-position" 
                value={clientPosition} 
                onValueChange={setClientPosition}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="plaintiff" id="plaintiff" />
                  <Label htmlFor="plaintiff">Plaintiff/Petitioner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="defendant" id="defendant" />
                  <Label htmlFor="defendant">Defendant/Respondent</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="legal-issue">Primary Legal Issue</Label>
            <Input
              id="legal-issue"
              value={legalIssue}
              onChange={(e) => setLegalIssue(e.target.value)}
              placeholder="E.g., Whether the defendant's actions constitute negligence under Indian tort law"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="case-description">
              Case Facts & Context
              <span className="ml-1 text-sm text-gray-500">(Be comprehensive for better results)</span>
            </Label>
            <Textarea
              id="case-description"
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
              placeholder="Describe the case in detail, including relevant facts, evidence, applicable Indian laws, and the context of the legal dispute..."
              className="min-h-[200px]"
            />
          </div>
          
          <Button 
            onClick={handleGenerateArguments} 
            disabled={isGenerating || caseDescription.trim().length < 50 || legalIssue.trim().length < 10}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Building Arguments...
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                Generate Legal Arguments
              </>
            )}
          </Button>
        </TabsContent>
        
        <TabsContent value="results" className="mt-4">
          {legalArguments && (
            <div className="space-y-6">
              {/* Main Arguments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>Main Arguments</span>
                  </CardTitle>
                  <CardDescription>
                    Based on Indian law, statutes, and precedents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {legalArguments.mainArguments.map((arg, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-lg">{arg.title}</h3>
                        <Badge className={getStrengthColor(arg.strength)}>
                          {arg.strength.charAt(0).toUpperCase() + arg.strength.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {arg.description}
                      </p>
                      
                      <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                        <h4 className="text-sm font-medium">Supporting Laws</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {arg.supportingLaws.map((law, i) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300">{law}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-3 mt-3 rounded-md">
                        <h4 className="text-sm font-medium">Supporting Cases</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {arg.supportingCases.map((caseRef, i) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300">{caseRef}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* Counter Arguments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span>Counter Arguments & Refutation</span>
                  </CardTitle>
                  <CardDescription>
                    Anticipating opposing counsel's positions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {legalArguments.counterArguments.map((counter, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-medium text-lg mb-2">{counter.title}</h3>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-red-700 dark:text-red-400">Opponent Argument</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {counter.description}
                          </p>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                          <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400">Refutation Strategy</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {counter.refutationStrategy}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* Legal References */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <span>Legal References</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Statutory References</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {legalArguments.statutoryReferences.map((statute, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{statute}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Case References</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {legalArguments.caseReferences.map((caseRef, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{caseRef}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {legalArguments.constitutionalProvisions && legalArguments.constitutionalProvisions.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Constitutional Provisions</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {legalArguments.constitutionalProvisions.map((provision, index) => (
                          <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{provision}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={reset}>
                    New Arguments
                  </Button>
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(legalArguments, null, 2));
                      toast({
                        title: "Copied",
                        description: "Arguments data copied to clipboard",
                      });
                    }}
                    variant="secondary"
                  >
                    Copy Data
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 italic text-center">
                These arguments are generated based on AI analysis of Indian law and precedents.
                They should be reviewed by a qualified advocate before use in legal proceedings.
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArgumentBuilder;
