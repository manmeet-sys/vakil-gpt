
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { BookOpen, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const CaseLawResearchPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
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
        description: "Case law research results have been generated",
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
    const systemPrompt = `You are PrecedentAI's case law research assistant specialized in Indian law. 
    
    For the provided query, find and summarize relevant case law precedents from Indian courts, including:
    1. Key Supreme Court cases relevant to the query
    2. Notable High Court judgments if applicable
    3. The legal principles established in these cases
    4. How these precedents might apply to similar situations
    
    Format your response with proper citations and organize by relevance.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'I will research and provide relevant Indian case law and precedents.' }] },
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
    const systemPrompt = `You are PrecedentAI's case law research assistant specialized in Indian law. 
    
    For the provided query, find and summarize relevant case law precedents from Indian courts, including:
    1. Key Supreme Court cases relevant to the query
    2. Notable High Court judgments if applicable
    3. The legal principles established in these cases
    4. How these precedents might apply to similar situations
    
    Format your response with proper citations and organize by relevance.`;
    
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

  return (
    <LegalToolLayout 
      title="Case Law Research" 
      description="Research relevant case law precedents based on your legal queries"
      icon={<BookOpen className="h-6 w-6 text-blue-600" />}
    >
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search for Case Law</CardTitle>
            <CardDescription>
              Enter your legal question or describe the legal issue to find relevant precedents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., What are the precedents regarding right to privacy in India? Or describe a legal scenario..."
                className="min-h-[100px]"
              />
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !query.trim()}
                className="w-full"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Research Case Law
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
                Relevant case law and precedents based on your query.
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

export default CaseLawResearchPage;
