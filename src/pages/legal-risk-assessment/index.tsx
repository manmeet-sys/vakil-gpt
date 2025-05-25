
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/components/BackButton';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';

const LegalRiskAssessmentPage = () => {
  const [businessDescription, setBusinessDescription] = useState<string>('');
  const [riskCategory, setRiskCategory] = useState<string>('general');
  const [isAssessing, setIsAssessing] = useState(false);
  const [results, setResults] = useState<string>('');
  const { toast } = useToast();

  const handleAssessRisks = async () => {
    if (!businessDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a business description for risk assessment",
      });
      return;
    }

    const apiKey = localStorage.getItem('openaiApiKey');
    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: "Please set your OpenAI API key in Settings first",
      });
      return;
    }

    setIsAssessing(true);

    try {
      const systemPrompt = `You are VakilGPT's legal risk assessment specialist with expertise in Indian law.
    
Generate a comprehensive legal risk assessment based on the following information:
- Business Description: ${businessDescription}
- Risk Category Focus: ${riskCategory}

Include:
1. Identification of potential legal risks in the context of Indian law
2. Risk severity assessment (High/Medium/Low) with justification
3. Potential legal implications of each identified risk
4. Recommended risk mitigation strategies
5. Relevant Indian legal frameworks and compliance considerations

Format your response with clear sections and prioritize risks by severity.`;

      const riskAssessment = await getOpenAIResponse(systemPrompt, { 
        model: 'gpt-4o', 
        temperature: 0.2 
      });

      setResults(riskAssessment);
      toast({
        title: "Risk Assessment Complete",
        description: "Your legal risk assessment has been generated",
      });
    } catch (error) {
      console.error('Error generating risk assessment:', error);
      toast({
        variant: "destructive",
        title: "Assessment Failed",
        description: error instanceof Error ? error.message : "Failed to generate risk assessment",
      });
    } finally {
      setIsAssessing(false);
    }
  };

  return (
    <LegalToolLayout 
      title="Legal Risk Assessment" 
      description="Identify and evaluate potential legal risks for your business under Indian law"
      icon={<Shield className="h-6 w-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Business Risk Profile</CardTitle>
            <CardDescription>
              Describe your business activities to receive a tailored legal risk assessment for the Indian market.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-desc">Business Description</Label>
                <Textarea
                  id="business-desc"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="Describe your business operations, industry, target market, and any specific concerns you have about legal risks in India."
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Risk Category Focus</Label>
                <RadioGroup value={riskCategory} onValueChange={setRiskCategory}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="general" />
                    <Label htmlFor="general">General Risk Assessment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="contractual" id="contractual" />
                    <Label htmlFor="contractual">Contractual & Agreement Risks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regulatory" id="regulatory" />
                    <Label htmlFor="regulatory">Indian Regulatory Compliance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intellectual" id="intellectual" />
                    <Label htmlFor="intellectual">IP Rights & Protection in India</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="liability" id="liability" />
                    <Label htmlFor="liability">Liability & Litigation Risks</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button 
                onClick={handleAssessRisks} 
                disabled={isAssessing || !businessDescription.trim()}
                className="w-full"
              >
                {isAssessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assessing Risks...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Assess Legal Risks
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Results</CardTitle>
              <CardDescription>
                Identified legal risks and recommended mitigation strategies under Indian law.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: results.replace(/\n/g, '<br />') }} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </LegalToolLayout>
  );
};

export default LegalRiskAssessmentPage;
