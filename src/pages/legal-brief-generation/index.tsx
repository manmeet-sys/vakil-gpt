
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { BookOpen, Send } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const LegalBriefGenerationPage = () => {
  const [topic, setTopic] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [context, setContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState('');
  const { toast } = useToast();
  const [apiProvider, setApiProvider] = useState<'gemini' | 'deepseek'>('gemini');
  
  React.useEffect(() => {
    const storedApiProvider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
    setApiProvider(storedApiProvider);
  }, []);
  
  const handleGenerateBrief = async () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a legal topic for your brief",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Get API key based on provider
      const apiKey = localStorage.getItem(`${apiProvider}ApiKey`);
      
      if (!apiKey) {
        toast({
          title: "API Key Required",
          description: `Please set your ${apiProvider.charAt(0).toUpperCase() + apiProvider.slice(1)} API key in settings first`,
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }
      
      // Prepare system prompt for legal brief
      const systemPrompt = `You are VakilGPT, a legal expert specialized in Indian law. Generate a comprehensive legal brief on ${topic} ${jurisdiction ? `in the context of ${jurisdiction}` : `under Indian law`}.
      
      The brief should include:
      1. Introduction to the legal topic
      2. Relevant statutes and sections from Indian law${jurisdiction === 'criminal' ? ', including the Bharatiya Nyaya Sanhita (BNS) and Bharatiya Nagarik Suraksha Sanhita (BNSS) where applicable' : ''}
      3. Key Supreme Court and High Court judgments
      4. Legal analysis with citations to precedents
      5. Practical recommendations
      ${jurisdiction === 'criminal' ? '6. Comparison between the older laws (IPC/CrPC) and the new criminal codes (BNS/BNSS/BSA) if relevant' : ''}
      
      Additional context for consideration: ${context || 'None provided'}`;
      
      let briefText = '';
      
      if (apiProvider === 'gemini') {
        // Generate with Gemini
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
          briefText = data.candidates[0].content.parts[0].text;
        } else {
          throw new Error('Invalid response format from Gemini API');
        }
      } else {
        // Generate with DeepSeek
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
              { role: 'user', content: `Generate a legal brief on ${topic}` }
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
        briefText = data.choices[0].message.content;
      }
      
      setGeneratedBrief(briefText);
      setIsGenerating(false);
      
      toast({
        title: "Brief Generated",
        description: "Your legal brief has been generated successfully",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "There was an error generating your brief. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };
  
  return (
    <LegalToolLayout
      title="AI-Powered Indian Legal Brief Generation"
      description="Generate comprehensive legal briefs based on Indian law. Our AI analyzes relevant case law, statutes, and constitutional provisions to provide structured and well-cited legal briefs for Indian legal practice."
      icon={<BookOpen className="w-6 h-6 text-white" />}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic">Legal Topic</Label>
                <Input 
                  id="topic" 
                  placeholder="e.g., Right to Privacy, Arbitration, Land Acquisition" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="jurisdiction">Indian Jurisdiction (Optional)</Label>
                <Select value={jurisdiction} onValueChange={setJurisdiction}>
                  <SelectTrigger id="jurisdiction">
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="constitutional">Constitutional</SelectItem>
                    <SelectItem value="criminal">Criminal Law (BNS & BNSS)</SelectItem>
                    <SelectItem value="civil">Civil Law</SelectItem>
                    <SelectItem value="corporate">Corporate Law</SelectItem>
                    <SelectItem value="taxation">Taxation</SelectItem>
                    <SelectItem value="intellectual-property">Intellectual Property</SelectItem>
                    <SelectItem value="environmental">Environmental Law</SelectItem>
                    <SelectItem value="delhi-hc">Delhi High Court</SelectItem>
                    <SelectItem value="bombay-hc">Bombay High Court</SelectItem>
                    <SelectItem value="madras-hc">Madras High Court</SelectItem>
                    <SelectItem value="calcutta-hc">Calcutta High Court</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="context">Additional Context</Label>
                <Textarea 
                  id="context" 
                  placeholder="Enter any specific details or context for the brief..." 
                  className="min-h-32"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
            <Button 
              onClick={handleGenerateBrief}
              disabled={isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? (
                <>Generating Brief...</>
              ) : (
                <>
                  Generate Legal Brief
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {generatedBrief && (
          <Card className="bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Generated Legal Brief</h3>
              <div className="bg-gray-50 dark:bg-legal-slate/20 p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
                {generatedBrief}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
              <Button 
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(generatedBrief);
                  toast({
                    title: "Copied",
                    description: "Brief copied to clipboard"
                  });
                }}
                className="mr-2"
              >
                Copy to Clipboard
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  const blob = new Blob([generatedBrief], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `legal-brief-${topic.toLowerCase().replace(/\s+/g, '-')}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  
                  toast({
                    title: "Downloaded",
                    description: "Brief downloaded as text file"
                  });
                }}
              >
                Download
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </LegalToolLayout>
  );
};

export default LegalBriefGenerationPage;
