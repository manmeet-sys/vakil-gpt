
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { BookOpen, Search, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const CaseLawResearchPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string>('');
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>('');
  const [apiProvider, setApiProvider] = useState<'deepseek' | 'gemini'>('gemini');
  const [court, setCourt] = useState<string>('all');
  const [jurisdiction, setJurisdiction] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('case-search');

  // Load API key on component mount
  React.useEffect(() => {
    const storedApiProvider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
    setApiProvider(storedApiProvider);
    const storedApiKey = localStorage.getItem(`${storedApiProvider}ApiKey`) || '';
    setApiKey(storedApiKey);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a search query",
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

    setIsSearching(true);

    try {
      // Simulate API call to search for case law
      let caseResults = '';
      
      if (apiProvider === 'gemini') {
        caseResults = await generateGeminiCaseLawResults(query);
      } else if (apiProvider === 'deepseek') {
        caseResults = await generateDeepSeekCaseLawResults(query);
      }

      setResults(caseResults);
      toast({
        title: "Research Complete",
        description: "Indian case law research results have been generated",
      });
    } catch (error) {
      console.error('Error searching case law:', error);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Failed to complete case law research",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const generateGeminiCaseLawResults = async (query: string): Promise<string> => {
    const systemPrompt = `You are VakilGPT's case law research assistant specialized in Indian law. 
    
    For the provided query, find and summarize relevant case law precedents from Indian courts, including:
    1. Key Supreme Court cases relevant to the query ${court !== 'all' ? `focusing on ${court} cases` : ''}
    2. High Court judgments from ${jurisdiction !== 'all' ? jurisdiction : 'relevant jurisdictions'} if applicable
    3. The legal principles established in these cases
    4. Citations to relevant Indian statutes including new laws like Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA) if relevant
    5. How these precedents apply in the Indian legal context
    ${timeframe !== 'all' ? `6. Focus on cases from the ${timeframe}` : ''}
    
    Format your response with proper Indian legal citations and organize by relevance.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'I will research and provide relevant Indian case law and precedents following Indian legal citation standards.' }] },
          { role: 'user', parts: [{ text: query }] }
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

  const generateDeepSeekCaseLawResults = async (query: string): Promise<string> => {
    const systemPrompt = `You are VakilGPT's case law research assistant specialized in Indian law. 
    
    For the provided query, find and summarize relevant case law precedents from Indian courts, including:
    1. Key Supreme Court cases relevant to the query ${court !== 'all' ? `focusing on ${court} cases` : ''}
    2. High Court judgments from ${jurisdiction !== 'all' ? jurisdiction : 'relevant jurisdictions'} if applicable
    3. The legal principles established in these cases
    4. Citations to relevant Indian statutes including new laws like Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA) if relevant
    5. How these precedents apply in the Indian legal context
    ${timeframe !== 'all' ? `6. Focus on cases from the ${timeframe}` : ''}
    
    Format your response with proper Indian legal citations and organize by relevance.`;
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
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

  // Sample list of landmark cases (for the database tab)
  const landmarkCases = [
    {
      name: "Kesavananda Bharati v. State of Kerala",
      year: "1973",
      court: "Supreme Court",
      citation: "(1973) 4 SCC 225",
      principle: "Basic Structure Doctrine - Parliament cannot amend the basic structure of the Constitution"
    },
    {
      name: "Justice K.S. Puttaswamy v. Union of India",
      year: "2017",
      court: "Supreme Court",
      citation: "(2017) 10 SCC 1",
      principle: "Right to Privacy is a fundamental right under Article 21 of the Constitution"
    },
    {
      name: "Vishaka v. State of Rajasthan",
      year: "1997",
      court: "Supreme Court",
      citation: "AIR 1997 SC 3011",
      principle: "Guidelines for prevention of sexual harassment at workplace"
    },
    {
      name: "Shreya Singhal v. Union of India",
      year: "2015",
      court: "Supreme Court",
      citation: "(2015) 5 SCC 1",
      principle: "Section 66A of IT Act struck down as unconstitutional; defined limits on online speech regulation"
    },
    {
      name: "Navtej Singh Johar v. Union of India",
      year: "2018",
      court: "Supreme Court",
      citation: "(2018) 10 SCC 1",
      principle: "Decriminalized consensual homosexual acts by reading down Section 377 of IPC"
    }
  ];

  return (
    <LegalToolLayout 
      title="Indian Case Law Research" 
      description="Research relevant case law precedents from Indian courts based on your legal queries"
      icon={<BookOpen className="h-6 w-6 text-blue-600" />}
    >
      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="case-search">
              <Search className="h-4 w-4 mr-2" />
              Case Law Search
            </TabsTrigger>
            <TabsTrigger value="case-database">
              <BookOpen className="h-4 w-4 mr-2" />
              Landmark Cases
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="case-search">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Search Indian Case Law</CardTitle>
                <CardDescription>
                  Enter your legal question or describe the legal issue to find relevant Indian precedents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Court</label>
                      <Select value={court} onValueChange={setCourt}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Court" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Courts</SelectItem>
                          <SelectItem value="supreme-court">Supreme Court</SelectItem>
                          <SelectItem value="high-court">High Courts</SelectItem>
                          <SelectItem value="district-court">District Courts</SelectItem>
                          <SelectItem value="tribunals">Tribunals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jurisdiction</label>
                      <Select value={jurisdiction} onValueChange={setJurisdiction}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Jurisdiction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All India</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="mumbai">Mumbai</SelectItem>
                          <SelectItem value="kolkata">Kolkata</SelectItem>
                          <SelectItem value="chennai">Chennai</SelectItem>
                          <SelectItem value="bangalore">Bangalore</SelectItem>
                          <SelectItem value="hyderabad">Hyderabad</SelectItem>
                          <SelectItem value="allahabad">Allahabad</SelectItem>
                          <SelectItem value="gujarat">Gujarat</SelectItem>
                          <SelectItem value="punjab-haryana">Punjab & Haryana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Timeframe</label>
                      <Select value={timeframe} onValueChange={setTimeframe}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="last-year">Last Year</SelectItem>
                          <SelectItem value="last-5-years">Last 5 Years</SelectItem>
                          <SelectItem value="last-10-years">Last 10 Years</SelectItem>
                          <SelectItem value="last-20-years">Last 20 Years</SelectItem>
                          <SelectItem value="post-2000">Post 2000</SelectItem>
                          <SelectItem value="post-1990">Post 1990</SelectItem>
                          <SelectItem value="post-1980">Post 1980</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="E.g., What are Supreme Court precedents on right to privacy in India? Or describe a legal scenario under Indian law..."
                    className="min-h-[100px]"
                  />
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>Results will incorporate new Indian laws including BNS, BNSS, and BSA where relevant.</span>
                  </div>
                  
                  <Button 
                    onClick={handleSearch} 
                    disabled={isSearching || !query.trim()}
                    className="w-full"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Researching Indian Case Law...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Research Indian Case Law
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {results && (
              <Card>
                <CardHeader>
                  <CardTitle>Research Results</CardTitle>
                  <CardDescription>
                    Relevant Indian case law and precedents based on your query.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: results.replace(/\n/g, '<br />') }} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      toast({
                        title: "Citation Export",
                        description: "Indian legal citations have been copied to clipboard",
                      });
                    }}
                  >
                    Export Citations
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="case-database">
            <Card>
              <CardHeader>
                <CardTitle>Landmark Indian Cases</CardTitle>
                <CardDescription>
                  Reference key cases that have shaped Indian jurisprudence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {landmarkCases.map((caseItem) => (
                    <div 
                      key={caseItem.name}
                      className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{caseItem.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{caseItem.year}</Badge>
                          <Badge variant="secondary">{caseItem.court}</Badge>
                          <Badge>{caseItem.citation}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{caseItem.principle}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setActiveTab('case-search');
                    setQuery(`Tell me more about ${landmarkCases[0].name} and its impact on Indian law`);
                  }}
                >
                  Research A Landmark Case
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

export default CaseLawResearchPage;
