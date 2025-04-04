
import React, { useState, useEffect } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { BookOpen, Send, RefreshCw, Bell } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { fetchIndianLegalUpdates } from '@/utils/aiAnalysis';

const LegalBriefGenerationPage = () => {
  const [topic, setTopic] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [context, setContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState('');
  const { toast } = useToast();
  const [apiProvider, setApiProvider] = useState<'gemini' | 'deepseek'>('gemini');
  const [activeTab, setActiveTab] = useState('generate');
  const [legalUpdates, setLegalUpdates] = useState<any>({ statutes: [], precedents: [] });
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(false);
  const [selectedUpdates, setSelectedUpdates] = useState<Array<{id: number, name: string}>>([]);
  const [updateEmail, setUpdateEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  React.useEffect(() => {
    const storedApiProvider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
    setApiProvider(storedApiProvider);
    fetchLatestUpdates();
  }, []);
  
  const fetchLatestUpdates = async () => {
    setIsLoadingUpdates(true);
    try {
      const updates = await fetchIndianLegalUpdates();
      setLegalUpdates(updates);
    } catch (error) {
      toast({
        title: "Failed to fetch updates",
        description: error instanceof Error ? error.message : "An error occurred while fetching the latest legal updates",
        variant: "destructive"
      });
    } finally {
      setIsLoadingUpdates(false);
    }
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

  const toggleUpdateSelection = (id: number, name: string) => {
    setSelectedUpdates(prev => {
      const exists = prev.some(item => item.id === id);
      if (exists) {
        return prev.filter(item => item.id !== id);
      } else {
        return [...prev, { id, name }];
      }
    });
  };

  const handleSubscribe = async () => {
    if (selectedUpdates.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one law or precedent to subscribe to",
        variant: "destructive"
      });
      return;
    }

    if (!updateEmail || !/^\S+@\S+\.\S+$/.test(updateEmail)) {
      toast({
        title: "Valid email required",
        description: "Please enter a valid email address to receive updates",
        variant: "destructive"
      });
      return;
    }

    setIsSubscribing(true);
    try {
      // In a production environment, this would call the actual subscription service
      const message = "Successfully subscribed to updates for the selected items";
      
      // Save subscription in localStorage for demo purposes
      const existingSubscriptions = JSON.parse(localStorage.getItem('vakilgpt-legal-subscriptions') || '[]');
      const newSubscription = {
        email: updateEmail,
        items: selectedUpdates,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('vakilgpt-legal-subscriptions', JSON.stringify([...existingSubscriptions, newSubscription]));
      
      toast({
        title: "Subscription Successful",
        description: message
      });
      setSelectedUpdates([]);
      setUpdateEmail('');
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "Failed to subscribe to updates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };
  
  return (
    <LegalToolLayout
      title="AI-Powered Indian Legal Brief Generation"
      description="Generate comprehensive legal briefs based on Indian law. Our AI analyzes relevant case law, statutes, and constitutional provisions to provide structured and well-cited legal briefs for Indian legal practice."
      icon={<BookOpen className="w-6 h-6 text-white" />}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Brief</TabsTrigger>
            <TabsTrigger value="updates">
              Law Updates
              <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">New</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-6 mt-4">
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
          </TabsContent>
          
          <TabsContent value="updates" className="space-y-6 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Latest Indian Legal Updates</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={fetchLatestUpdates}
                    disabled={isLoadingUpdates}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingUpdates ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium mb-3">Recent Statute Updates</h4>
                  {isLoadingUpdates ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin text-legal-accent" />
                    </div>
                  ) : legalUpdates.statutes.length > 0 ? (
                    <div className="space-y-3">
                      {legalUpdates.statutes.map((statute: any) => (
                        <div 
                          key={statute.id} 
                          className="p-4 border border-gray-200 dark:border-legal-slate/20 rounded-md flex justify-between items-start"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-semibold">{statute.name}</h5>
                              <Badge variant="outline" className={`
                                ${statute.type === 'Amendment' ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                                  statute.type === 'Rules' ? 'bg-green-100 text-green-800 border-green-200' : 
                                  statute.type === 'Notification' ? 'bg-purple-100 text-purple-800 border-purple-200' : 
                                  'bg-amber-100 text-amber-800 border-amber-200'} 
                                dark:bg-opacity-20 dark:border-opacity-30
                              `}>
                                {statute.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{statute.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Updated: {statute.date}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={selectedUpdates.some(item => item.id === statute.id) ? 
                              "text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20" : 
                              "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/20"
                            }
                            onClick={() => toggleUpdateSelection(statute.id, statute.name)}
                          >
                            {selectedUpdates.some(item => item.id === statute.id) ? 
                              "Selected" : "Subscribe"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">No recent statute updates found</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-3">Recent Case Law Precedents</h4>
                  {isLoadingUpdates ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin text-legal-accent" />
                    </div>
                  ) : legalUpdates.precedents.length > 0 ? (
                    <div className="space-y-3">
                      {legalUpdates.precedents.map((precedent: any) => (
                        <div 
                          key={precedent.id} 
                          className="p-4 border border-gray-200 dark:border-legal-slate/20 rounded-md flex justify-between items-start"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-semibold">{precedent.case}</h5>
                              <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/50">
                                {precedent.court}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{precedent.summary}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Date: {precedent.date}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={selectedUpdates.some(item => item.id === precedent.id) ? 
                              "text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20" : 
                              "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/20"
                            }
                            onClick={() => toggleUpdateSelection(precedent.id, precedent.case)}
                          >
                            {selectedUpdates.some(item => item.id === precedent.id) ? 
                              "Selected" : "Subscribe"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-gray-500 dark:text-gray-400">No recent precedents found</p>
                  )}
                </div>
                
                {(legalUpdates.statutes.length > 0 || legalUpdates.precedents.length > 0) && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800/30">
                    <h4 className="text-md font-medium text-blue-800 dark:text-blue-300 flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      Subscribe to Automatic Updates
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      Receive email notifications when selected laws or precedents are updated
                    </p>
                    
                    <div className="mt-3 space-y-3">
                      <Input
                        type="email"
                        placeholder="Your email address"
                        value={updateEmail}
                        onChange={(e) => setUpdateEmail(e.target.value)}
                      />
                      
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {selectedUpdates.length} item{selectedUpdates.length !== 1 ? 's' : ''} selected
                        </p>
                        <Button 
                          disabled={isSubscribing || selectedUpdates.length === 0 || !updateEmail}
                          onClick={handleSubscribe}
                        >
                          {isSubscribing ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Subscribing...
                            </>
                          ) : (
                            <>Subscribe</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

export default LegalBriefGenerationPage;
