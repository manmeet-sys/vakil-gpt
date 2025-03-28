
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { ClipboardCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ComplianceAssistancePage = () => {
  const [industry, setIndustry] = useState<string>('');
  const [companySize, setCompanySize] = useState<string>('');
  const [complianceDescription, setComplianceDescription] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string>('');
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>('AIzaSyCpX8FmPojP3E4dDqsmi0EtRjDKXGh9SBc');
  const [apiProvider, setApiProvider] = useState<'deepseek' | 'gemini'>('gemini');

  // Load API key on component mount
  React.useEffect(() => {
    const storedApiProvider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
    setApiProvider(storedApiProvider);
    const storedApiKey = localStorage.getItem(`${storedApiProvider}ApiKey`) || (storedApiProvider === 'gemini' ? 'AIzaSyCpX8FmPojP3E4dDqsmi0EtRjDKXGh9SBc' : '');
    setApiKey(storedApiKey);
  }, []);

  const handleGenerateCompliance = async () => {
    if (!industry || !companySize || !complianceDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all fields to generate compliance recommendations",
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

    setIsGenerating(true);

    try {
      let complianceResults = '';
      
      if (apiProvider === 'gemini') {
        complianceResults = await generateGeminiComplianceResults();
      } else if (apiProvider === 'deepseek') {
        complianceResults = await generateDeepSeekComplianceResults();
      }

      setResults(complianceResults);
      toast({
        title: "Compliance Guidance Generated",
        description: "Your compliance recommendations are ready",
      });
    } catch (error) {
      console.error('Error generating compliance guidance:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate compliance guidance",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateGeminiComplianceResults = async (): Promise<string> => {
    const systemPrompt = `You are PrecedentAI's compliance specialist focused on Indian regulatory frameworks. 
    
    Generate a comprehensive compliance guide based on the following information:
    - Industry: ${industry}
    - Company Size: ${companySize}
    - Compliance Context: ${complianceDescription}
    
    Include:
    1. Key Indian regulations and laws applicable to this scenario
    2. Compliance requirements and obligations
    3. Recommended implementation steps
    4. Common compliance challenges and solutions
    5. Resources for staying updated on regulatory changes
    
    Format your response with clear sections and practical guidance.`;

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

  const generateDeepSeekComplianceResults = async (): Promise<string> => {
    const systemPrompt = `You are PrecedentAI's compliance specialist focused on Indian regulatory frameworks. 
    
    Generate a comprehensive compliance guide based on the following information:
    - Industry: ${industry}
    - Company Size: ${companySize}
    - Compliance Context: ${complianceDescription}
    
    Include:
    1. Key Indian regulations and laws applicable to this scenario
    2. Compliance requirements and obligations
    3. Recommended implementation steps
    4. Common compliance challenges and solutions
    5. Resources for staying updated on regulatory changes
    
    Format your response with clear sections and practical guidance.`;
    
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
      title="Compliance Assistance" 
      description="Get tailored compliance guidance for your business needs"
      icon={<ClipboardCheck className="h-6 w-6 text-blue-600" />}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Compliance Information</CardTitle>
            <CardDescription>
              Provide details about your business to receive tailored compliance guidance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="finance">Finance & Banking</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="technology">Technology & IT</SelectItem>
                      <SelectItem value="ecommerce">E-commerce & Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="realestate">Real Estate & Construction</SelectItem>
                      <SelectItem value="hospitality">Hospitality & Tourism</SelectItem>
                      <SelectItem value="media">Media & Entertainment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-size">Company Size</Label>
                  <Select value={companySize} onValueChange={setCompanySize}>
                    <SelectTrigger id="company-size">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                      <SelectItem value="small">Small Business (11-50 employees)</SelectItem>
                      <SelectItem value="medium">Medium Business (51-250 employees)</SelectItem>
                      <SelectItem value="large">Large Business (251-1000 employees)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="compliance-desc">Compliance Needs</Label>
                <Textarea
                  id="compliance-desc"
                  value={complianceDescription}
                  onChange={(e) => setComplianceDescription(e.target.value)}
                  placeholder="Describe your compliance needs or questions. For example: 'We're launching a fintech app that processes payments and stores user data. What regulations do we need to comply with?'"
                  className="min-h-[100px]"
                />
              </div>
              
              <Button 
                onClick={handleGenerateCompliance} 
                disabled={isGenerating || !industry || !companySize || !complianceDescription.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Guidance...
                  </>
                ) : (
                  'Generate Compliance Guidance'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Compliance Guidance</CardTitle>
              <CardDescription>
                Tailored compliance recommendations for your business.
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

export default ComplianceAssistancePage;

