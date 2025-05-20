import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, AlertTriangle, BookOpen, FilePenLine } from 'lucide-react';
import { toast } from 'sonner';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArgumentBuilderType } from '@/types/ArgumentBuilderTypes';
import { performanceMonitor } from '@/utils/performance-monitoring';

interface ArgumentBuilderProps {
  caseDetails?: {
    title: string;
    description: string;
    precedents?: string[];
  };
  onComplete?: (arguments: ArgumentBuilderType) => void;
}

const ArgumentBuilder: React.FC<ArgumentBuilderProps> = ({ 
  caseDetails,
  onComplete 
}) => {
  const [caseDescription, setCaseDescription] = useState(caseDetails?.description || '');
  const [legalIssue, setLegalIssue] = useState('');
  const [jurisdiction, setJurisdiction] = useState('Supreme Court');
  const [argumentStrength, setArgumentStrength] = useState('strong');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArguments, setGeneratedArguments] = useState<ArgumentBuilderType | null>(null);
  const [activeTab, setActiveTab] = useState('input');

  const handleGenerateArguments = async () => {
    if (caseDescription.trim().length < 50) {
      toast({
        description: "Please provide more details about the case for accurate argument generation.",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const result = await performanceMonitor.measureAsync('ArgumentBuilder', 'generateArguments', async () => {
        const promptText = `
          As an Indian legal expert, analyze this case and build comprehensive arguments:
          
          Case Description:
          ${caseDescription}
          
          ${legalIssue ? `Legal Issue: ${legalIssue}` : ''}
          
          Jurisdiction: ${jurisdiction}
          
          Based on Indian law, create:
          1. Main arguments (${argumentStrength} strength requested)
          2. Counter arguments with refutation strategies
          3. Supporting statutory references
          4. Case law references
          5. Constitutional provisions if applicable
          
          Format as JSON:
          {
            "mainArguments": [
              {
                "title": "Argument Title",
                "description": "Detailed explanation",
                "strength": "strong|moderate|weak",
                "supportingLaws": ["law1", "law2"],
                "supportingCases": ["case1", "case2"]
              }
            ],
            "counterArguments": [
              {
                "title": "Counter Argument Title",
                "description": "Detailed explanation",
                "refutationStrategy": "How to refute this"
              }
            ],
            "statutoryReferences": ["statute1", "statute2"],
            "caseReferences": ["case1", "case2"],
            "constitutionalProvisions": ["provision1", "provision2"]
          }
        `;

        const response = await getOpenAIResponse(promptText);
        
        try {
          // Extract JSON if it's wrapped in text or code blocks
          const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                            response.match(/```\s*([\s\S]*?)\s*```/) || 
                            response.match(/{[\s\S]*}/);
          
          let jsonResponse;
          if (jsonMatch) {
            jsonResponse = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          } else {
            jsonResponse = JSON.parse(response);
          }
          
          return jsonResponse as ArgumentBuilderType;
        } catch (parseError) {
          console.error("Error parsing AI response:", parseError);
          toast({
            description: "Unable to parse the response. Please try again.",
          });
          throw parseError;
        }
      });
      
      setGeneratedArguments(result);
      setActiveTab('arguments');
      
      if (onComplete) {
        onComplete(result);
      }
      
      toast({
        description: "Legal arguments successfully generated",
      });
    } catch (error) {
      console.error("Error generating arguments:", error);
      toast({
        description: "Failed to generate arguments. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Content copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold flex-1">Legal Argument Builder</h2>
        <FilePenLine className="h-5 w-5 text-blue-500" />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="input" className="flex items-center gap-1">Input</TabsTrigger>
          <TabsTrigger value="arguments" className="flex items-center gap-1" disabled={!generatedArguments}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="space-y-4 mt-4">
          {/* Form inputs */}
          <div className="space-y-4">
            <div>
              <Select value={jurisdiction} onValueChange={setJurisdiction}>
                <SelectTrigger>
                  <SelectValue placeholder="Select jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  {['Supreme Court', 'High Court', 'District Court'].map(j => (
                    <SelectItem key={j} value={j}>{j}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <RadioGroup value={argumentStrength} onValueChange={setArgumentStrength} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="strong" id="strong" />
                  <Label htmlFor="strong">Strong</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate">Moderate</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="legal-issue">Key Legal Issue (Optional)</Label>
              <Input
                id="legal-issue"
                value={legalIssue}
                onChange={(e) => setLegalIssue(e.target.value)}
                placeholder="e.g., Constitutional validity, Contract breach..."
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="case-description">Case Description</Label>
              <Textarea
                id="case-description"
                value={caseDescription}
                onChange={(e) => setCaseDescription(e.target.value)}
                placeholder="Provide a detailed description of the case..."
                className="h-40"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Provide comprehensive details for better quality arguments
              </p>
            </div>
            
            <Button 
              onClick={handleGenerateArguments} 
              disabled={isGenerating || caseDescription.length < 50} 
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Arguments...
                </>
              ) : (
                <>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Generate Legal Arguments
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="arguments" className="mt-4">
          {generatedArguments && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Main Arguments
                  </CardTitle>
                  <CardDescription>
                    Primary legal arguments for your case
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedArguments.mainArguments.map((arg, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-card">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-base">{arg.title}</h4>
                        <Badge variant={
                          arg.strength === 'strong' ? 'default' : 
                          arg.strength === 'moderate' ? 'outline' : 'secondary'
                        }>
                          {arg.strength}
                        </Badge>
                      </div>
                      <p className="my-2 text-sm">{arg.description}</p>
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Supporting Laws:</p>
                        <ul className="text-xs list-disc pl-5 space-y-1">
                          {arg.supportingLaws.map((law, i) => (
                            <li key={i}>{law}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    Counter Arguments
                  </CardTitle>
                  <CardDescription>
                    Potential opposing arguments with refutation strategies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedArguments.counterArguments.map((arg, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-card">
                      <h4 className="font-semibold text-base">{arg.title}</h4>
                      <p className="my-2 text-sm">{arg.description}</p>
                      <div className="mt-3 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                        <p className="text-xs font-medium text-green-700 dark:text-green-400">Refutation Strategy:</p>
                        <p className="text-sm mt-1">{arg.refutationStrategy}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                    Legal References
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Statutory References</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {generatedArguments.statutoryReferences.map((ref, index) => (
                          <li key={index} className="text-sm">{ref}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Case References</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {generatedArguments.caseReferences.map((ref, index) => (
                          <li key={index} className="text-sm">{ref}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {generatedArguments.constitutionalProvisions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Constitutional Provisions</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {generatedArguments.constitutionalProvisions.map((ref, index) => (
                            <li key={index} className="text-sm">{ref}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto"
                    onClick={() => handleCopyToClipboard(JSON.stringify(generatedArguments, null, 2))}
                  >
                    Copy All References
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArgumentBuilder;
