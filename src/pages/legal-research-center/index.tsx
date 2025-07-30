import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, Search, Gavel, Clock, RefreshCw, BookOpen, Download, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';

interface SearchOptions {
  court: string;
  jurisdiction: string;
  timeframe: string;
  includeRepealed: boolean;
  includeRecent: boolean;
  sortBy: 'relevance' | 'date' | 'authority';
  format: 'detailed' | 'summary' | 'structured';
}

const LegalResearchCenterPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // Case Law Research State
  const [caseQuery, setCaseQuery] = useState('');
  const [caseResults, setCaseResults] = useState<string>('');
  const [isCaseSearching, setIsCaseSearching] = useState(false);
  
  // Statute Tracker State
  const [statuteQuery, setStatuteQuery] = useState('');
  const [statuteResults, setStatuteResults] = useState<string>('');
  const [isStatuteSearching, setIsStatuteSearching] = useState(false);
  const [statuteUpdates, setStatuteUpdates] = useState<any[]>([]);
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(false);
  
  const [activeTab, setActiveTab] = useState('case-law');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    court: 'all',
    jurisdiction: 'all',
    timeframe: 'all',
    includeRepealed: false,
    includeRecent: true,
    sortBy: 'relevance',
    format: 'detailed'
  });

  const courts = [
    { value: 'all', label: 'All Courts' },
    { value: 'supreme-court', label: 'Supreme Court' },
    { value: 'high-court', label: 'High Courts' },
    { value: 'district-court', label: 'District Courts' },
    { value: 'tribunals', label: 'Tribunals' }
  ];

  const jurisdictions = [
    { value: 'all', label: 'All India' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'mumbai', label: 'Mumbai (Bombay HC)' },
    { value: 'kolkata', label: 'Kolkata (Calcutta HC)' },
    { value: 'chennai', label: 'Chennai (Madras HC)' },
    { value: 'bangalore', label: 'Bangalore (Karnataka HC)' },
    { value: 'hyderabad', label: 'Hyderabad (Telangana HC)' }
  ];

  const timeframes = [
    { value: 'all', label: 'All Time' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-6-months', label: 'Last 6 Months' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'last-5-years', label: 'Last 5 Years' },
    { value: 'bnss-bns-era', label: 'BNS/BNSS/BSA Era (2023-)' },
    { value: 'post-2020', label: 'Post 2020' },
    { value: 'post-2010', label: 'Post 2010' }
  ];

  const suggestedCaseQueries = [
    "Recent Supreme Court judgments on fundamental rights",
    "High Court decisions on digital privacy and data protection",
    "Environmental law precedents from 2020 onwards", 
    "Corporate law interpretations under Companies Act 2013",
    "Criminal law changes under BNS and BNSS",
    "Labour law judgments on gig economy workers"
  ];

  const suggestedStatuteQueries = [
    "Recent amendments to Information Technology Act 2000",
    "Updates to Criminal Procedure Code vs BNSS",
    "Changes in GST law and notifications",
    "New rules under Digital Personal Data Protection Act",
    "Environmental clearance procedure updates",
    "Corporate governance compliance requirements"
  ];

  useEffect(() => {
    fetchRecentStatuteUpdates();
  }, []);

  const fetchRecentStatuteUpdates = async () => {
    setIsLoadingUpdates(true);
    try {
      // Mock recent statute updates for demonstration
      const mockUpdates = [
        {
          id: 1,
          title: "Bharatiya Nyaya Sanhita, 2023 - Implementation Guidelines",
          date: "2024-01-26",
          type: "New Act",
          description: "Comprehensive criminal law reform replacing IPC 1860"
        },
        {
          id: 2,
          title: "Digital Personal Data Protection Act Rules, 2024",
          date: "2024-01-15",
          type: "Rules",
          description: "Detailed rules for data protection compliance"
        },
        {
          id: 3,
          title: "GST Amendment Notification 2024",
          date: "2024-01-10",
          type: "Amendment",
          description: "Changes to reverse charge mechanism"
        }
      ];
      setStatuteUpdates(mockUpdates);
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setIsLoadingUpdates(false);
    }
  };

  const handleCaseLawSearch = async () => {
    if (!caseQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a search query for case law research",
      });
      return;
    }

    setIsCaseSearching(true);
    try {
      const systemPrompt = `You are VakilGPT, an expert legal researcher specializing in Indian case law. Research and provide comprehensive information about: "${caseQuery}"

Please provide:
1. Recent and landmark judgments related to the query
2. Key legal principles established
3. Proper Indian legal citations (e.g., (2023) 1 SCC 123, AIR 2023 SC 456)
4. Court hierarchy analysis (Supreme Court, High Courts, lower courts)
5. Evolution of legal interpretation over time
6. Practical implications for legal practice
7. Related statutory provisions
8. Current legal status and recent developments

Focus on authentic Indian legal precedents and ensure all citations follow Indian legal citation format. Include judgments from ${searchOptions.timeframe !== 'all' ? timeframes.find(t => t.value === searchOptions.timeframe)?.label : 'all periods'} ${searchOptions.court !== 'all' ? 'specifically from ' + courts.find(c => c.value === searchOptions.court)?.label : ''} ${searchOptions.jurisdiction !== 'all' ? 'with focus on ' + jurisdictions.find(j => j.value === searchOptions.jurisdiction)?.label : ''}.

Organize by ${searchOptions.sortBy} and provide ${searchOptions.format} analysis.`;

      const results = await getOpenAIResponse(systemPrompt, {
        model: 'gpt-4o',
        temperature: 0.2,
        maxTokens: 3000
      });

      setCaseResults(results);
      toast({
        title: "Research Complete",
        description: "Case law research results have been generated",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Failed to complete case law research",
      });
    } finally {
      setIsCaseSearching(false);
    }
  };

  const handleStatuteSearch = async () => {
    if (!statuteQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a search query for statute research",
      });
      return;
    }

    setIsStatuteSearching(true);
    try {
      const systemPrompt = `You are VakilGPT, an expert legal researcher specializing in Indian statutory law. Research and provide real-time, up-to-date information about: "${statuteQuery}"

Please provide:
1. Current status of relevant statutes and amendments
2. Recent notifications, rules, and circulars (2023-2024)
3. Legislative changes and their implementation timelines
4. Comparison with previous versions where applicable
5. Practical impact on legal practice and compliance
6. Cross-references to related statutes and rules
7. Upcoming changes or proposed amendments
8. State-specific variations where relevant

Focus on: 
- Real-time legal developments and current status
- Recent government notifications and gazette publications
- Implementation challenges and clarifications
- Compliance requirements and deadlines
- Judicial interpretations of new provisions

Include analysis from ${searchOptions.timeframe !== 'all' ? timeframes.find(t => t.value === searchOptions.timeframe)?.label : 'all periods'} ${searchOptions.jurisdiction !== 'all' ? 'with focus on ' + jurisdictions.find(j => j.value === searchOptions.jurisdiction)?.label : ''}.

${searchOptions.includeRepealed ? 'Include information about repealed statutes and transition provisions.' : 'Focus on currently active statutes only.'}

Organize by ${searchOptions.sortBy} and provide ${searchOptions.format} analysis with emphasis on current legal position.`;

      const results = await getOpenAIResponse(systemPrompt, {
        model: 'gpt-4o',
        temperature: 0.1,
        maxTokens: 3000
      });

      setStatuteResults(results);
      toast({
        title: "Research Complete",
        description: "Statute research results have been generated",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Failed to complete statute research",
      });
    } finally {
      setIsStatuteSearching(false);
    }
  };

  const handleExportResults = (results: string, type: string) => {
    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-research-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: `${type} research results downloaded`,
    });
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
            <Scale className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Legal Research Center</h1>
          </div>
        </div>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex flex-col items-center py-6 px-4">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Comprehensive Legal Research Platform
            </h2>
            <p className="text-muted-foreground">
              Advanced AI-powered case law research and real-time statute tracking for Indian legal practice
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="case-law" className="flex items-center gap-2">
                <Gavel className="w-4 h-4" />
                Case Law Research
              </TabsTrigger>
              <TabsTrigger value="statute-tracker" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Statute Tracker
              </TabsTrigger>
            </TabsList>

            {/* Advanced Search Options */}
            <Card className="mb-6 bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Research Options
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  >
                    {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
                  </Button>
                </div>
              </CardHeader>
              {showAdvancedOptions && (
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Court Level</Label>
                    <Select value={searchOptions.court} onValueChange={(value) => setSearchOptions(prev => ({...prev, court: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {courts.map(court => (
                          <SelectItem key={court.value} value={court.value}>{court.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Jurisdiction</Label>
                    <Select value={searchOptions.jurisdiction} onValueChange={(value) => setSearchOptions(prev => ({...prev, jurisdiction: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {jurisdictions.map(jurisdiction => (
                          <SelectItem key={jurisdiction.value} value={jurisdiction.value}>{jurisdiction.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Time Period</Label>
                    <Select value={searchOptions.timeframe} onValueChange={(value) => setSearchOptions(prev => ({...prev, timeframe: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeframes.map(timeframe => (
                          <SelectItem key={timeframe.value} value={timeframe.value}>{timeframe.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeRepealed" 
                      checked={searchOptions.includeRepealed}
                      onCheckedChange={(checked) => setSearchOptions(prev => ({...prev, includeRepealed: checked as boolean}))}
                    />
                    <Label htmlFor="includeRepealed">Include repealed statutes</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeRecent" 
                      checked={searchOptions.includeRecent}
                      onCheckedChange={(checked) => setSearchOptions(prev => ({...prev, includeRecent: checked as boolean}))}
                    />
                    <Label htmlFor="includeRecent">Focus on recent developments</Label>
                  </div>
                </CardContent>
              )}
            </Card>
            
            <TabsContent value="case-law" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-primary" />
                    Case Law Research
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Find up-to-date judgments, precedents, and legal principles from Indian courts using AI-powered research
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="case-query">Research Query</Label>
                    <Input 
                      id="case-query"
                      placeholder="e.g., Recent privacy rights judgments, bail provisions under BNSS..."
                      value={caseQuery}
                      onChange={(e) => setCaseQuery(e.target.value)}
                    />
                  </div>
                  
                  <Accordion type="single" collapsible>
                    <AccordionItem value="suggestions">
                      <AccordionTrigger className="text-sm">Suggested Research Topics</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 gap-2">
                          {suggestedCaseQueries.map((query, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              className="justify-start h-auto text-left p-2"
                              onClick={() => setCaseQuery(query)}
                            >
                              {query}
                            </Button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleCaseLawSearch}
                    disabled={isCaseSearching}
                    className="w-full"
                  >
                    {isCaseSearching ? (
                      <>Researching Case Law...</>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Research Case Law
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              {caseResults && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Case Law Research Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      value={caseResults}
                      readOnly
                      className="h-96 resize-none bg-muted border-border font-mono text-sm"
                    />
                  </CardContent>
                  <CardFooter className="flex gap-2 justify-end border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(caseResults);
                        toast({
                          title: "Copied",
                          description: "Case law research copied to clipboard",
                        });
                      }}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleExportResults(caseResults, 'case-law')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="statute-tracker" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Statute Research & Tracking
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Get real-time updates on Indian statutes, amendments, and legislative changes
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="statute-query">Statute Query</Label>
                        <Input 
                          id="statute-query"
                          placeholder="e.g., Digital Personal Data Protection Act updates, GST amendments..."
                          value={statuteQuery}
                          onChange={(e) => setStatuteQuery(e.target.value)}
                        />
                      </div>
                      
                      <Accordion type="single" collapsible>
                        <AccordionItem value="suggestions">
                          <AccordionTrigger className="text-sm">Suggested Statute Topics</AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 gap-2">
                              {suggestedStatuteQueries.map((query, index) => (
                                <Button
                                  key={index}
                                  variant="ghost"
                                  size="sm"
                                  className="justify-start h-auto text-left p-2"
                                  onClick={() => setStatuteQuery(query)}
                                >
                                  {query}
                                </Button>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleStatuteSearch}
                        disabled={isStatuteSearching}
                        className="w-full"
                      >
                        {isStatuteSearching ? (
                          <>Tracking Statutes...</>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Research Statutes
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {statuteResults && (
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle>Statute Research Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea 
                          value={statuteResults}
                          readOnly
                          className="h-96 resize-none bg-muted border-border font-mono text-sm"
                        />
                      </CardContent>
                      <CardFooter className="flex gap-2 justify-end border-t border-border">
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(statuteResults);
                            toast({
                              title: "Copied",
                              description: "Statute research copied to clipboard",
                            });
                          }}
                        >
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleExportResults(statuteResults, 'statute')}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </div>
                
                <div>
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-primary" />
                          Recent Updates
                        </CardTitle>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={fetchRecentStatuteUpdates}
                          disabled={isLoadingUpdates}
                        >
                          <RefreshCw className={`h-4 w-4 ${isLoadingUpdates ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {isLoadingUpdates ? (
                        <div className="flex justify-center py-4">
                          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : (
                        statuteUpdates.map((update) => (
                          <div key={update.id} className="p-3 border border-border rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-sm">{update.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {update.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{update.description}</p>
                            <p className="text-xs text-muted-foreground">{update.date}</p>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default LegalResearchCenterPage;