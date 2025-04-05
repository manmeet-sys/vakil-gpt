import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { GraduationCap, Loader2, BookOpen, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LegalEducationPage = () => {
  const [activeTab, setActiveTab] = useState<string>('explain');
  const [legalConcept, setLegalConcept] = useState<string>('');
  const [caseStudyTopic, setCaseStudyTopic] = useState<string>('');
  const [comparisonTopic, setComparisonTopic] = useState<string>('');
  const [specialistQuery, setSpecialistQuery] = useState<string>('');
  const [specialistType, setSpecialistType] = useState<string>('constitutional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string>('');
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>('');
  const [apiProvider, setApiProvider] = useState<'deepseek' | 'gemini'>('gemini');

  React.useEffect(() => {
    const storedApiProvider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
    setApiProvider(storedApiProvider);
    const storedApiKey = localStorage.getItem(`${storedApiProvider}ApiKey`) || '';
    setApiKey(storedApiKey);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setResults('');
  };

  const handleGenerateContent = async () => {
    let prompt = '';
    let emptyFieldMessage = '';
    
    if (activeTab === 'explain') {
      prompt = legalConcept;
      emptyFieldMessage = 'Please enter a legal concept to explain';
    } else if (activeTab === 'case-study') {
      prompt = caseStudyTopic;
      emptyFieldMessage = 'Please enter a case study topic';
    } else if (activeTab === 'compare') {
      prompt = comparisonTopic;
      emptyFieldMessage = 'Please enter legal concepts to compare';
    } else if (activeTab === 'specialist') {
      prompt = specialistQuery;
      emptyFieldMessage = 'Please enter a question for the specialist';
    }
    
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: emptyFieldMessage,
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
      let educationalContent = '';
      
      if (apiProvider === 'gemini') {
        educationalContent = await generateGeminiEducationalContent(prompt);
      } else if (apiProvider === 'deepseek') {
        educationalContent = await generateDeepSeekEducationalContent(prompt);
      }

      setResults(educationalContent);
      toast({
        title: "Content Generated",
        description: "Your legal educational content has been generated",
      });
    } catch (error) {
      console.error('Error generating educational content:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate educational content",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateGeminiEducationalContent = async (prompt: string): Promise<string> => {
    let systemPrompt = '';
    
    if (activeTab === 'explain') {
      systemPrompt = `You are VakilGPT's legal education specialist focusing on Indian law.
      
      Explain the following legal concept in a clear, educational way:
      "${prompt}"
      
      Your explanation should:
      1. Define the concept and its importance in Indian law
      2. Explain key principles and applications
      3. Reference relevant sections of Indian legislation or constitutional provisions
      4. Mention landmark Indian court cases if applicable
      5. Provide practical examples of how this concept works in real-world scenarios
      
      Format your explanation to be educational, accurate, and accessible to law students or professionals seeking to understand this concept better.`;
    } else if (activeTab === 'case-study') {
      systemPrompt = `You are VakilGPT's legal education specialist focusing on Indian law.
      
      Create an educational case study on the following legal topic or case:
      "${prompt}"
      
      Your case study should include:
      1. Background and context of the case/topic
      2. Key legal issues and questions presented
      3. The court's analysis and reasoning (if a specific case)
      4. The legal significance and precedent established
      5. Impact on Indian law and subsequent developments
      6. Lessons and principles that can be learned
      
      Format your case study to be educational, detailed, and useful for law students or professionals studying Indian law.`;
    } else if (activeTab === 'compare') {
      systemPrompt = `You are VakilGPT's legal education specialist focusing on Indian law.
      
      Compare and contrast the following legal concepts or areas of law:
      "${prompt}"
      
      Your comparison should:
      1. Define each concept/area clearly
      2. Identify key similarities between them
      3. Highlight important differences
      4. Explain when each would apply in legal practice
      5. Reference relevant Indian legislation or constitutional provisions
      6. Mention significant Indian cases that illustrate the distinctions
      
      Format your comparison in a structured, educational manner that helps clarify the distinctions and relationships between these legal concepts.`;
    } else if (activeTab === 'specialist') {
      const specialistProfiles = {
        constitutional: {
          title: "Constitutional Law Specialist",
          expertise: "expert in constitutional law, Indian constitution, fundamental rights, directive principles, constitutional amendments, and landmark Supreme Court judgments"
        },
        criminal: {
          title: "Criminal Law Specialist",
          expertise: "expert in Indian criminal law, Indian Penal Code, Criminal Procedure Code, criminal defense, prosecution procedures, bail provisions, and criminal jurisprudence"
        },
        corporate: {
          title: "Corporate Law Specialist",
          expertise: "expert in Indian corporate law, Companies Act, corporate governance, mergers and acquisitions, securities law, corporate compliance, and business regulations"
        },
        property: {
          title: "Property Law Specialist",
          expertise: "expert in Indian property law, real estate transactions, land acquisition, property registration, tenancy laws, and property dispute resolution"
        },
        family: {
          title: "Family Law Specialist",
          expertise: "expert in Indian family law, personal laws, marriage, divorce, adoption, maintenance, succession, and family dispute resolution"
        },
        tax: {
          title: "Tax Law Specialist",
          expertise: "expert in Indian tax law, income tax, GST, international taxation, tax planning, tax compliance, and tax dispute resolution"
        }
      };
      
      const specialist = specialistProfiles[specialistType as keyof typeof specialistProfiles];
      
      systemPrompt = `You are VakilGPT's virtual ${specialist.title}, an ${specialist.expertise} with focus on the Indian legal system.
      
      Answer the following legal question with your specialized knowledge:
      "${prompt}"
      
      Your response should:
      1. Provide an expert perspective based on your specialist area of law
      2. Reference relevant Indian legal provisions and authorities
      3. Explain legal concepts specific to ${specialistType} law clearly
      4. Mention important case precedents if applicable
      5. Outline practical implications and considerations
      
      Format your response in a structured, educational manner, making complex legal concepts accessible while demonstrating your specialist expertise. Remember to note that your response is educational information, not legal advice.`;
    }

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

  const generateDeepSeekEducationalContent = async (prompt: string): Promise<string> => {
    let systemPrompt = '';
    
    if (activeTab === 'explain') {
      systemPrompt = `You are VakilGPT's legal education specialist focusing on Indian law.
      
      Explain the following legal concept in a clear, educational way:
      "${prompt}"
      
      Your explanation should:
      1. Define the concept and its importance in Indian law
      2. Explain key principles and applications
      3. Reference relevant sections of Indian legislation or constitutional provisions
      4. Mention landmark Indian court cases if applicable
      5. Provide practical examples of how this concept works in real-world scenarios
      
      Format your explanation to be educational, accurate, and accessible to law students or professionals seeking to understand this concept better.`;
    } else if (activeTab === 'case-study') {
      systemPrompt = `You are VakilGPT's legal education specialist focusing on Indian law.
      
      Create an educational case study on the following legal topic or case:
      "${prompt}"
      
      Your case study should include:
      1. Background and context of the case/topic
      2. Key legal issues and questions presented
      3. The court's analysis and reasoning (if a specific case)
      4. The legal significance and precedent established
      5. Impact on Indian law and subsequent developments
      6. Lessons and principles that can be learned
      
      Format your case study to be educational, detailed, and useful for law students or professionals studying Indian law.`;
    } else if (activeTab === 'compare') {
      systemPrompt = `You are VakilGPT's legal education specialist focusing on Indian law.
      
      Compare and contrast the following legal concepts or areas of law:
      "${prompt}"
      
      Your comparison should:
      1. Define each concept/area clearly
      2. Identify key similarities between them
      3. Highlight important differences
      4. Explain when each would apply in legal practice
      5. Reference relevant Indian legislation or constitutional provisions
      6. Mention significant Indian cases that illustrate the distinctions
      
      Format your comparison in a structured, educational manner that helps clarify the distinctions and relationships between these legal concepts.`;
    } else if (activeTab === 'specialist') {
      const specialistProfiles = {
        constitutional: {
          title: "Constitutional Law Specialist",
          expertise: "expert in constitutional law, Indian constitution, fundamental rights, directive principles, constitutional amendments, and landmark Supreme Court judgments"
        },
        criminal: {
          title: "Criminal Law Specialist",
          expertise: "expert in Indian criminal law, Indian Penal Code, Criminal Procedure Code, criminal defense, prosecution procedures, bail provisions, and criminal jurisprudence"
        },
        corporate: {
          title: "Corporate Law Specialist",
          expertise: "expert in Indian corporate law, Companies Act, corporate governance, mergers and acquisitions, securities law, corporate compliance, and business regulations"
        },
        property: {
          title: "Property Law Specialist",
          expertise: "expert in Indian property law, real estate transactions, land acquisition, property registration, tenancy laws, and property dispute resolution"
        },
        family: {
          title: "Family Law Specialist",
          expertise: "expert in Indian family law, personal laws, marriage, divorce, adoption, maintenance, succession, and family dispute resolution"
        },
        tax: {
          title: "Tax Law Specialist",
          expertise: "expert in Indian tax law, income tax, GST, international taxation, tax planning, tax compliance, and tax dispute resolution"
        }
      };
      
      const specialist = specialistProfiles[specialistType as keyof typeof specialistProfiles];
      
      systemPrompt = `You are VakilGPT's virtual ${specialist.title}, an ${specialist.expertise} with focus on the Indian legal system.
      
      Answer the following legal question with your specialized knowledge:
      "${prompt}"
      
      Your response should:
      1. Provide an expert perspective based on your specialist area of law
      2. Reference relevant Indian legal provisions and authorities
      3. Explain legal concepts specific to ${specialistType} law clearly
      4. Mention important case precedents if applicable
      5. Outline practical implications and considerations
      
      Format your response in a structured, educational manner, making complex legal concepts accessible while demonstrating your specialist expertise. Remember to note that your response is educational information, not legal advice.`;
    }
    
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
      title="Legal Education" 
      description="Learn and understand complex legal concepts through clear explanations"
      icon={<GraduationCap className="h-6 w-6 text-blue-600" />}
    >
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="explain" value={activeTab} onValueChange={handleTabChange} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="explain">Explain Concepts</TabsTrigger>
            <TabsTrigger value="case-study">Case Studies</TabsTrigger>
            <TabsTrigger value="compare">Compare Concepts</TabsTrigger>
            <TabsTrigger value="specialist">Law Specialists</TabsTrigger>
          </TabsList>
          
          <TabsContent value="explain">
            <Card>
              <CardHeader>
                <CardTitle>Legal Concept Explanation</CardTitle>
                <CardDescription>
                  Get clear explanations of complex legal concepts and principles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    value={legalConcept}
                    onChange={(e) => setLegalConcept(e.target.value)}
                    placeholder="Enter a legal concept (e.g., Habeas Corpus, Right to Privacy, Natural Justice)"
                  />
                  <Button 
                    onClick={handleGenerateContent} 
                    disabled={isGenerating || !legalConcept.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Explanation...
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Explain Concept
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="case-study">
            <Card>
              <CardHeader>
                <CardTitle>Legal Case Studies</CardTitle>
                <CardDescription>
                  Learn about landmark cases and their impact on Indian law.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    value={caseStudyTopic}
                    onChange={(e) => setCaseStudyTopic(e.target.value)}
                    placeholder="Enter a case or topic (e.g., Kesavananda Bharati case, ADM Jabalpur case)"
                  />
                  <Button 
                    onClick={handleGenerateContent} 
                    disabled={isGenerating || !caseStudyTopic.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Case Study...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Generate Case Study
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="compare">
            <Card>
              <CardHeader>
                <CardTitle>Compare Legal Concepts</CardTitle>
                <CardDescription>
                  Understand the similarities and differences between legal concepts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={comparisonTopic}
                    onChange={(e) => setComparisonTopic(e.target.value)}
                    placeholder="Enter concepts to compare (e.g., Fundamental Rights vs. Directive Principles, Civil Law vs. Criminal Law)"
                    className="min-h-[80px]"
                  />
                  <Button 
                    onClick={handleGenerateContent} 
                    disabled={isGenerating || !comparisonTopic.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Comparison...
                      </>
                    ) : (
                      'Compare Concepts'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specialist">
            <Card>
              <CardHeader>
                <CardTitle>Consult Law Specialists</CardTitle>
                <CardDescription>
                  Get expert insights from specialists in different areas of Indian law.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Specialist Type</label>
                    <Select 
                      value={specialistType} 
                      onValueChange={setSpecialistType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialist type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="constitutional">Constitutional Law</SelectItem>
                        <SelectItem value="criminal">Criminal Law</SelectItem>
                        <SelectItem value="corporate">Corporate Law</SelectItem>
                        <SelectItem value="property">Property Law</SelectItem>
                        <SelectItem value="family">Family Law</SelectItem>
                        <SelectItem value="tax">Tax Law</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Textarea
                    value={specialistQuery}
                    onChange={(e) => setSpecialistQuery(e.target.value)}
                    placeholder="Ask a specific legal question in this area of law"
                    className="min-h-[80px]"
                  />
                  
                  <Button 
                    onClick={handleGenerateContent} 
                    disabled={isGenerating || !specialistQuery.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Consulting Specialist...
                      </>
                    ) : (
                      <>
                        <Users className="mr-2 h-4 w-4" />
                        Consult Specialist
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'explain' ? 'Concept Explanation' : 
                 activeTab === 'case-study' ? 'Case Study' : 
                 activeTab === 'compare' ? 'Concept Comparison' :
                 'Specialist Consultation'}
              </CardTitle>
              <CardDescription>
                {activeTab === 'specialist' 
                  ? `Expert insights from a ${specialistType.charAt(0).toUpperCase() + specialistType.slice(1)} Law Specialist`
                  : 'Legal educational content based on your request.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: results.replace(/\n/g, '<br />') }} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                For educational purposes only. Not legal advice.
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </LegalToolLayout>
  );
};

export default LegalEducationPage;
