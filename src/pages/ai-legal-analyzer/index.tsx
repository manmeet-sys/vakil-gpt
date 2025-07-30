import React, { useState } from 'react';
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Zap, Upload, Bot } from 'lucide-react';
import PdfAnalyzer from '@/components/PdfAnalyzer';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';

const AILegalAnalyzerPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // Document Analysis State
  const [analysisResult, setAnalysisResult] = useState<string>('');
  
  // Brief Generation State
  const [topic, setTopic] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [context, setContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState('');
  
  const [activeTab, setActiveTab] = useState('analyze');
  
  const handleAnalysisComplete = (analysis: string) => {
    setAnalysisResult(analysis);
  };
  
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
      const systemPrompt = `You are VakilGPT, a legal expert specialized in Indian law. Generate a comprehensive legal brief on ${topic} ${jurisdiction ? `in the context of ${jurisdiction}` : `under Indian law`}.
      
      The brief should include:
      1. Introduction to the legal topic
      2. Relevant statutes and sections from Indian law${jurisdiction === 'criminal' ? ', including the Bharatiya Nyaya Sanhita (BNS) and Bharatiya Nagarik Suraksha Sanhita (BNSS) where applicable' : ''}
      3. Key Supreme Court and High Court judgments
      4. Legal analysis with citations to precedents
      5. Practical recommendations
      ${jurisdiction === 'criminal' ? '6. Comparison between the older laws (IPC/CrPC) and the new criminal codes (BNS/BNSS/BSA) if relevant' : ''}
      
      Additional context for consideration: ${context || 'None provided'}`;
      
      const briefText = await getOpenAIResponse(systemPrompt, { 
        model: 'gpt-4o', 
        temperature: 0.2,
        maxTokens: 4000
      });
      
      setGeneratedBrief(briefText);
      
      toast({
        title: "Brief Generated",
        description: "Your legal brief has been generated successfully using AI",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "There was an error generating your brief. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-background transition-colors duration-300">
      <header className="border-b border-border py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')} 
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">AI Legal Analyzer & Brief Generator</h1>
          </div>
        </div>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex flex-col items-center py-6 px-4 overflow-hidden">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Comprehensive AI-Powered Legal Analysis
            </h2>
            <p className="text-muted-foreground">
              Upload documents for analysis or generate legal briefs using advanced AI trained on Indian law
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="analyze" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Document Analysis
              </TabsTrigger>
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Brief Generation
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="analyze" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    AI Document Analysis Tool
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Upload your legal document in PDF format and our AI will analyze its content, extracting key information and providing comprehensive legal insights based on Indian law.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <PdfAnalyzer 
                      onAnalysisComplete={handleAnalysisComplete}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {analysisResult && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-primary" />
                      AI Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      value={analysisResult}
                      readOnly
                      className="h-96 resize-none bg-muted border-border"
                    />
                  </CardContent>
                  <CardFooter className="flex gap-3 justify-end border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(analysisResult);
                        toast({
                          title: "Copied",
                          description: "Analysis copied to clipboard",
                        });
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                    <Button
                      onClick={() => setAnalysisResult('')}
                      variant="destructive"
                    >
                      Clear Results
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="generate" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    AI Legal Brief Generator
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Generate comprehensive legal briefs based on Indian law using AI. Our system analyzes relevant case law, statutes, and constitutional provisions.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
                <CardFooter className="border-t border-border">
                  <Button 
                    onClick={handleGenerateBrief}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>Generating Brief...</>
                    ) : (
                      <>
                        Generate Legal Brief with AI
                        <Zap className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              {generatedBrief && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-primary" />
                      AI-Generated Legal Brief
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-md whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto">
                      {generatedBrief}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 border-t border-border">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedBrief);
                        toast({
                          title: "Copied",
                          description: "Brief copied to clipboard"
                        });
                      }}
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AILegalAnalyzerPage;