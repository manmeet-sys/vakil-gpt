
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const LegalRiskAssessmentPage = () => {
  const [businessDescription, setBusinessDescription] = useState<string>('');
  const [riskCategory, setRiskCategory] = useState<string>('general');
  const [isAssessing, setIsAssessing] = useState(false);
  const [results, setResults] = useState<string>('');
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>('');
  const [apiProvider, setApiProvider] = useState<'deepseek' | 'gemini'>('gemini');

  // Load API key on component mount
  React.useEffect(() => {
    const storedApiProvider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
    setApiProvider(storedApiProvider);
    const storedApiKey = localStorage.getItem(`${storedApiProvider}ApiKey`) || '';
    setApiKey(storedApiKey);
  }, []);

  const handleAssessRisks = async () => {
    if (!businessDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a business description for risk assessment",
      });
      return;
    }

    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: `Please set your ${apiProvider.charAt(0).toUpperCase() + apiProvider.slice(1)} API key first`,
      });
      return;
    }

    setIsAssessing(true);

    try {
      let riskAssessment = '';
      
      if (apiProvider === 'gemini') {
        riskAssessment = await generateGeminiRiskAssessment();
      } else if (apiProvider === 'deepseek') {
        riskAssessment = await generateDeepSeekRiskAssessment();
      }

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

  const generateGeminiRiskAssessment = async (): Promise<string> => {
    const systemPrompt = `You are PrecedentAI's legal risk assessment specialist with expertise in Indian law.
    
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4000,
          topK: 40,
          topP: 0.95
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  };

  const generateDeepSeekRiskAssessment = async (): Promise<string> => {
    const systemPrompt = `You are PrecedentAI's legal risk assessment specialist with expertise in Indian law.
    
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
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt }
        ],
        temperature: 0.2,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  return (
    <LegalToolLayout 
      title="Legal Risk Assessment" 
      description="Identify and evaluate potential legal risks for your business under Indian law"
      icon={<Shield className="h-6 w-6 text-blue-600" />}
    >
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
