
import React, { useState, useEffect } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { BookOpen, Search, Loader2, AlertCircle, Filter, Clock, Download, BookOpenCheck, FileCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '@/hooks/use-analytics';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import BackButton from '@/components/BackButton';

// Types for improved statute tracking
interface Statute {
  id: string;
  name: string;
  jurisdiction: string;
  lastUpdated: string;
  recentChanges: string[];
  notifications: boolean;
  details: StatuteDetails;
}

interface StatuteDetails {
  description: string;
  fullTextLink: string;
  relatedRules: string[];
  keyTerms: string[];
}

interface StatuteSearchOptions {
  jurisdiction: string;
  timeframe: string;
  relevance: number;
  includeRepealed: boolean;
  includeAmendments: boolean;
  apiProvider: 'deepseek' | 'gemini';
  sortBy: 'relevance' | 'date' | 'authority';
  format: 'detailed' | 'summary' | 'structured';
  subjectMatter: string[];
}

const StatuteTrackerPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<string>('');
  const { toast } = useToast();
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('statute-search');
  const { logPageView, logSearch, logAction, logError } = useAnalytics();

  // Enhanced search options for more accuracy
  const [searchOptions, setSearchOptions] = useState<StatuteSearchOptions>({
    jurisdiction: 'all',
    timeframe: 'all',
    relevance: 80, // Default relevance threshold (0-100)
    includeRepealed: false,
    includeAmendments: true,
    apiProvider: 'gemini',
    sortBy: 'relevance',
    format: 'detailed',
    subjectMatter: [],
  });

  // More complete list of Indian jurisdictions
  const jurisdictions = [
    { value: 'all', label: 'All India' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'mumbai', label: 'Mumbai (Bombay HC)' },
    { value: 'kolkata', label: 'Kolkata (Calcutta HC)' },
    { value: 'chennai', label: 'Chennai (Madras HC)' },
    { value: 'bangalore', label: 'Bangalore (Karnataka HC)' },
    { value: 'hyderabad', label: 'Hyderabad (Telangana HC)' },
    { value: 'allahabad', label: 'Allahabad HC' },
    { value: 'gujarat', label: 'Gujarat HC' },
    { value: 'punjab-haryana', label: 'Punjab & Haryana HC' },
    { value: 'kerala', label: 'Kerala HC' },
    { value: 'patna', label: 'Patna HC' },
    { value: 'rajasthan', label: 'Rajasthan HC' },
    { value: 'orissa', label: 'Orissa HC' },
    { value: 'gauhati', label: 'Gauhati HC' },
    { value: 'jharkhand', label: 'Jharkhand HC' },
    { value: 'chhattisgarh', label: 'Chhattisgarh HC' },
    { value: 'uttarakhand', label: 'Uttarakhand HC' },
    { value: 'sikkim', label: 'Sikkim HC' },
    { value: 'manipur', label: 'Manipur HC' },
    { value: 'tripura', label: 'Tripura HC' }
  ];

  // Timeframe options with more specific filtering
  const timeframes = [
    { value: 'all', label: 'All Time' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-6-months', label: 'Last 6 Months' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'last-5-years', label: 'Last 5 Years' },
    { value: 'last-10-years', label: 'Last 10 Years' },
    { value: 'last-20-years', label: 'Last 20 Years' },
    { value: 'bnss-bns-era', label: 'BNS/BNSS/BSA Era (2023-)' },
    { value: 'post-2020', label: 'Post 2020' },
    { value: 'post-2010', label: 'Post 2010' },
    { value: 'post-2000', label: 'Post 2000' },
    { value: 'post-1990', label: 'Post 1990' },
    { value: 'post-1980', label: 'Post 1980' },
    { value: 'post-independence', label: 'Post Independence (1947+)' },
    { value: 'pre-independence', label: 'Pre-Independence (Before 1947)' }
  ];

  // Subject matter options
  const subjectMatters = [
    { value: 'constitutional', label: 'Constitutional Law' },
    { value: 'criminal', label: 'Criminal Law' },
    { value: 'civil', label: 'Civil Law' },
    { value: 'corporate', label: 'Corporate Law' },
    { value: 'tax', label: 'Tax Law' },
    { value: 'property', label: 'Property Law' },
    { value: 'family', label: 'Family Law' },
    { value: 'ip', label: 'Intellectual Property' },
    { value: 'labor', label: 'Labor & Employment' },
    { value: 'administrative', label: 'Administrative Law' },
    { value: 'environmental', label: 'Environmental Law' },
    { value: 'banking', label: 'Banking & Finance' },
    { value: 'competition', label: 'Competition Law' },
    { value: 'arbitration', label: 'Arbitration & ADR' },
  ];

  // Mock statute data for demonstration
  const mockStatutes: Statute[] = [
    {
      id: 'ipc',
      name: 'Indian Penal Code, 1860',
      jurisdiction: 'India',
      lastUpdated: '2024-01-26',
      recentChanges: ['Bharatiya Nyaya Sanhita, 2023 (BNS)'],
      notifications: true,
      details: {
        description: 'The main criminal code of India, defining various offences and punishments.',
        fullTextLink: 'https://legislative.gov.in/sites/default/files/A1860-45.pdf',
        relatedRules: ['Criminal Procedure Code, 1973'],
        keyTerms: ['Murder', 'Theft', 'Cheating', 'Criminal Conspiracy']
      }
    },
    {
      id: 'crpc',
      name: 'Criminal Procedure Code, 1973',
      jurisdiction: 'India',
      lastUpdated: '2024-01-26',
      recentChanges: ['Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)'],
      notifications: true,
      details: {
        description: 'Provides the procedure for the administration of criminal law in India.',
        fullTextLink: 'https://legislative.gov.in/sites/default/files/A1974-02.pdf',
        relatedRules: ['Indian Penal Code, 1860'],
        keyTerms: ['Arrest', 'Bail', 'Investigation', 'Trial']
      }
    },
    {
      id: 'evidence-act',
      name: 'Indian Evidence Act, 1872',
      jurisdiction: 'India',
      lastUpdated: '2024-01-26',
      recentChanges: ['Bharatiya Sakshya Adhiniyam, 2023 (BSA)'],
      notifications: true,
      details: {
        description: 'Governs the admissibility of evidence in Indian courts.',
        fullTextLink: 'https://legislative.gov.in/sites/default/files/A1872-01.pdf',
        relatedRules: ['Criminal Procedure Code, 1973', 'Civil Procedure Code, 1908'],
        keyTerms: ['Evidence', 'Witness', 'Admissibility', 'Proof']
      }
    },
    {
      id: 'constitution',
      name: 'Constitution of India, 1950',
      jurisdiction: 'India',
      lastUpdated: '2024-01-26',
      recentChanges: ['Various Amendments'],
      notifications: true,
      details: {
        description: 'The supreme law of India, defining the framework of political principles, procedures, and powers of government.',
        fullTextLink: 'https://legislative.gov.in/constitution-of-india',
        relatedRules: [],
        keyTerms: ['Fundamental Rights', 'Directive Principles', 'Parliament', 'Judiciary']
      }
    },
    {
      id: 'it-act',
      name: 'Information Technology Act, 2000',
      jurisdiction: 'India',
      lastUpdated: '2024-01-26',
      recentChanges: ['Amendments in 2008'],
      notifications: true,
      details: {
        description: 'Deals with cybercrime and electronic commerce.',
        fullTextLink: 'https://legislative.gov.in/sites/default/files/A2000-21.pdf',
        relatedRules: [],
        keyTerms: ['Cybercrime', 'Data Protection', 'E-commerce', 'Digital Signature']
      }
    },
    {
      id: 'companies-act',
      name: 'Companies Act, 2013',
      jurisdiction: 'India',
      lastUpdated: '2024-01-26',
      recentChanges: ['Various Amendments'],
      notifications: true,
      details: {
        description: 'Regulates the incorporation, operation, and winding up of companies in India.',
        fullTextLink: 'https://www.mca.gov.in/MinistryV2/companiesact2013.html',
        relatedRules: [],
        keyTerms: ['Company', 'Director', 'Shareholder', 'Corporate Governance']
      }
    },
    {
      id: 'consumer-protection-act',
      name: 'Consumer Protection Act, 2019',
      jurisdiction: 'India',
      lastUpdated: '2024-01-26',
      recentChanges: [],
      notifications: true,
      details: {
        description: 'Protects the rights of consumers and provides mechanisms for redressal of grievances.',
        fullTextLink: 'https://consumeraffairs.nic.in/sites/default/files/file-uploads/latest-acts-rules/Consumer%20Protection%20Act%2C2019.pdf',
        relatedRules: [],
        keyTerms: ['Consumer Rights', 'Grievance Redressal', 'Product Liability', 'Unfair Trade Practices']
      }
    },
    {
      id: 'motor-vehicles-act',
      name: 'Motor Vehicles Act, 1988',
      jurisdiction: 'India',
      lastUpdated: '2024-01-26',
      recentChanges: ['Amendments in 2019'],
      notifications: true,
      details: {
        description: 'Regulates road transport and provides for compensation to victims of road accidents.',
        fullTextLink: 'https://legislative.gov.in/sites/default/files/A1988-59.pdf',
        relatedRules: [],
        keyTerms: ['Road Transport', 'Accident Compensation', 'Driving License', 'Vehicle Insurance']
      }
    },
    {
      id: 'rbi-act',
      name: 'Reserve Bank of India Act, 1934',
      jurisdiction: 'India',
      lastUpdated: '2024-01-26',
      recentChanges: [],
      notifications: true,
      details: {
        description: 'Governs the functioning of the Reserve Bank of India and regulates the monetary policy of India.',
        fullTextLink: 'https://rbi.org.in/Scripts/Acts_Notified.aspx?Id=10448',
        relatedRules: [],
        keyTerms: ['Monetary Policy', 'Banking Regulation', 'Currency', 'Reserve Bank']
      }
    },
    {
      id: 'epf-act',
      name: 'Employees\' Provident Funds and Miscellaneous Provisions Act, 1952',
      jurisdiction: 'India',
      lastUpdated: '2024-01-26',
      recentChanges: [],
      notifications: true,
      details: {
        description: 'Provides for the establishment of provident funds for employees.',
        fullTextLink: 'https://labour.gov.in/epfo/acts-rules-0',
        relatedRules: [],
        keyTerms: ['Provident Fund', 'Employees', 'Pension', 'Insurance']
      }
    }
  ];

  useEffect(() => {
    const storedApiProvider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
    setSearchOptions(prev => ({...prev, apiProvider: storedApiProvider}));

    logPageView({
      tool: 'statute-tracker',
      provider: storedApiProvider
    });
  }, [logPageView]);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a search query",
      });
      return;
    }

    setIsSearching(true);

    try {
      logSearch(query, {
        jurisdiction: searchOptions.jurisdiction,
        timeframe: searchOptions.timeframe,
        provider: searchOptions.apiProvider,
        relevance: searchOptions.relevance,
        sortBy: searchOptions.sortBy,
        format: searchOptions.format
      });

      const apiKey = localStorage.getItem(`${searchOptions.apiProvider}ApiKey`) || '';
      let statuteResults = '';

      if (searchOptions.apiProvider === 'gemini') {
        statuteResults = await generateGeminiStatuteResults(query, apiKey, searchOptions);
      } else if (searchOptions.apiProvider === 'deepseek') {
        statuteResults = await generateDeepSeekStatuteResults(query, apiKey, searchOptions);
      }

      setResults(statuteResults);

      logAction('search_complete', {
        query_length: query.length,
        result_length: statuteResults.length,
        provider: searchOptions.apiProvider
      });

      toast({
        title: "Research Complete",
        description: "Indian statute research results have been generated",
      });
    } catch (error) {
      console.error('Error searching statute:', error);

      logError('search_failed', {
        query,
        provider: searchOptions.apiProvider,
        error: error instanceof Error ? error.message : "Unknown error"
      });

      toast({
        variant: "destructive",
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Failed to complete statute research",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    logAction('tab_change', { tab: value });
  };

  const handleExportCitations = () => {
    logAction('export_citations', { query });

    // Extract citations from results
    const citationRegex = /\b(?:Art|Sec)\.\s*\d+(?:A-Z)?(?:\(\d+\))?(?:\s*of\s*[A-Za-z\s]+)?\b/g;
    const citations = results.match(citationRegex) || [];

    if (citations.length > 0) {
      const citationText = citations.join('\n');
      navigator.clipboard.writeText(citationText);
      toast({
        title: "Citations Exported",
        description: `${citations.length} Indian statute citations copied to clipboard`,
      });
    } else {
      toast({
        title: "No Citations Found",
        description: "Could not identify standard citation formats in the results",
        variant: "destructive"
      });
    }
  };

  const handleDownloadResults = () => {
    logAction('download_results', { query });

    // Create a download file with the research results
    const element = document.createElement("a");
    const file = new Blob([`
Statute Research Results
Query: ${query}
Date: ${new Date().toLocaleDateString('en-IN')}
Search Parameters: 
- Jurisdiction: ${jurisdictions.find(j => j.value === searchOptions.jurisdiction)?.label}
- Timeframe: ${timeframes.find(t => t.value === searchOptions.timeframe)?.label}

RESULTS:
${results}
    `], {type: 'text/plain'});

    element.href = URL.createObjectURL(file);
    element.download = `StatuteResearch_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Results Downloaded",
      description: "Research results saved as text file",
    });
  };

  const handleSettingChange = (setting: string, value: any) => {
    logAction('setting_change', { setting, value });

    setSearchOptions(prev => ({...prev, [setting]: value}));

    if (setting === 'apiProvider') {
      localStorage.setItem('preferredApiProvider', value);
    }
  };

  const handleSuggestedQuery = (query: string) => {
    setQuery(query);
    setActiveTab('statute-search');
    logAction('suggested_query_selected', { query });
  };

  const generateGeminiStatuteResults = async (
    query: string,
    apiKey: string,
    options: StatuteSearchOptions
  ): Promise<string> => {
    const timeframeText = options.timeframe !== 'all'
      ? `6. Focus on statutes from the ${timeframes.find(t => t.value === options.timeframe)?.label}`
      : '';

    const jurisdictionFocus = options.jurisdiction !== 'all'
      ? `with particular emphasis on statutes from ${jurisdictions.find(j => j.value === options.jurisdiction)?.label}`
      : 'from all relevant jurisdictions';

    const subjectMatterText = options.subjectMatter.length > 0
      ? `7. Focus on the following subject matters: ${options.subjectMatter.join(', ')}`
      : '';

    const repealedText = !options.includeRepealed
      ? "8. Exclude repealed or superseded statutes"
      : "8. Include historically significant repealed statutes with clear indication of their current status";

    const formatInstructions = options.format === 'detailed'
      ? "Provide comprehensive analysis with detailed reasoning from each statute"
      : options.format === 'summary'
        ? "Provide concise summaries focusing on key sections and principles"
        : "Structure the response with clear headings, bullet points, and tables where appropriate";

    const amendmentsText = options.includeAmendments
      ? "9. Include references to relevant amendments and related rules"
      : "";

    const sortingInstruction = options.sortBy === 'relevance'
      ? "Format your response with proper Indian legal citations and organize by relevance"
      : options.sortBy === 'date'
        ? "Format your response with proper Indian legal citations and organize chronologically (newest first)"
        : "Format your response with proper Indian legal citations and organize by authority (Central Acts first, then State Acts)";

    const systemPrompt = `You are VakilGPT's statute research assistant specialized in Indian law. 
    
    For the provided query, find and summarize relevant statutes from Indian jurisdictions, including:
    1. Key statutes relevant to the query
    2. Statutes ${jurisdictionFocus} if applicable
    3. The legal principles established in these statutes
    4. Key sections and provisions
    5. How these statutes apply in the Indian legal context
    ${timeframeText}
    ${subjectMatterText}
    ${repealedText}
    ${amendmentsText}
    
    ${formatInstructions}. ${sortingInstruction}.
    
    Maintain a relevance threshold of ${options.relevance}% - only include statutes that are directly applicable to the query.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'I will research and provide relevant Indian statutes and provisions following Indian legal citation standards.' }] },
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

  const generateDeepSeekStatuteResults = async (
    query: string,
    apiKey: string,
    options: StatuteSearchOptions
  ): Promise<string> => {
    const timeframeText = options.timeframe !== 'all'
      ? `6. Focus on statutes from the ${timeframes.find(t => t.value === options.timeframe)?.label}`
      : '';

    const jurisdictionFocus = options.jurisdiction !== 'all'
      ? `with particular emphasis on statutes from ${jurisdictions.find(j => j.value === options.jurisdiction)?.label}`
      : 'from all relevant jurisdictions';

    const subjectMatterText = options.subjectMatter.length > 0
      ? `7. Focus on the following subject matters: ${options.subjectMatter.join(', ')}`
      : '';

    const repealedText = !options.includeRepealed
      ? "8. Exclude repealed or superseded statutes"
      : "8. Include historically significant repealed statutes with clear indication of their current status";

    const formatInstructions = options.format === 'detailed'
      ? "Provide comprehensive analysis with detailed reasoning from each statute"
      : options.format === 'summary'
        ? "Provide concise summaries focusing on key sections and principles"
        : "Structure the response with clear headings, bullet points, and tables where appropriate";

    const amendmentsText = options.includeAmendments
      ? "9. Include references to relevant amendments and related rules"
      : "";

    const sortingInstruction = options.sortBy === 'relevance'
      ? "Format your response with proper Indian legal citations and organize by relevance"
      : options.sortBy === 'date'
        ? "Format your response with proper Indian legal citations and organize chronologically (newest first)"
        : "Format your response with proper Indian legal citations and organize by authority (Central Acts first, then State Acts)";

    const systemPrompt = `You are VakilGPT's statute research assistant specialized in Indian law. 
    
    For the provided query, find and summarize relevant statutes from Indian jurisdictions, including:
    1. Key statutes relevant to the query
    2. Statutes ${jurisdictionFocus} if applicable
    3. The legal principles established in these statutes
    4. Key sections and provisions
    5. How these statutes apply in the Indian legal context
    ${timeframeText}
    ${subjectMatterText}
    ${repealedText}
    ${amendmentsText}
    
    ${formatInstructions}. ${sortingInstruction}.
    
    Maintain a relevance threshold of ${options.relevance}% - only include statutes that are directly applicable to the query.`;

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
      title="Indian Statute Tracker"
      description="Research and track relevant statutes from Indian jurisdictions based on your legal queries"
      icon={<BookOpen className="h-6 w-6 text-blue-600" />}
    >
      <div className="max-w-4xl mx-auto">
        <BackButton to="/tools" label="Back to Tools" />

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="statute-search">
              <Search className="h-4 w-4 mr-2" />
              Statute Search
            </TabsTrigger>
            <TabsTrigger value="statute-list">
              <BookOpenCheck className="h-4 w-4 mr-2" />
              Statute List
            </TabsTrigger>
          </TabsList>

          <TabsContent value="statute-search">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Indian Statute Search</CardTitle>
                <CardDescription>
                  Enter your legal question or describe the issue to find relevant Indian statutes. Use advanced filters for more precise results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="E.g., What are the key provisions of the Information Technology Act, 2000? Or describe a legal scenario under Indian law..."
                    className="min-h-[100px]"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jurisdiction" className="text-sm font-medium mb-1 block">Jurisdiction</Label>
                      <Select value={searchOptions.jurisdiction} onValueChange={(value) => handleSettingChange('jurisdiction', value)}>
                        <SelectTrigger id="jurisdiction">
                          <SelectValue placeholder="Select Jurisdiction" />
                        </SelectTrigger>
                        <SelectContent>
                          {jurisdictions.map(jurisdiction => (
                            <SelectItem key={jurisdiction.value} value={jurisdiction.value}>{jurisdiction.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="timeframe" className="text-sm font-medium mb-1 block">Timeframe</Label>
                      <Select value={searchOptions.timeframe} onValueChange={(value) => handleSettingChange('timeframe', value)}>
                        <SelectTrigger id="timeframe">
                          <SelectValue placeholder="Select Timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeframes.map(timeframe => (
                            <SelectItem key={timeframe.value} value={timeframe.value}>{timeframe.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                      size="sm"
                      className="text-blue-600 dark:text-blue-400"
                    >
                      {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
                    </Button>

                    <div className="flex items-center gap-2">
                      <Label htmlFor="apiProvider" className="text-sm font-medium">API Provider</Label>
                      <Select
                        value={searchOptions.apiProvider}
                        onValueChange={(value) => handleSettingChange('apiProvider', value as 'deepseek' | 'gemini')}
                      >
                        <SelectTrigger id="apiProvider" className="w-[120px]">
                          <SelectValue placeholder="Select Provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gemini">Gemini</SelectItem>
                          <SelectItem value="deepseek">DeepSeek</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {showAdvancedOptions && (
                    <div className="border rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-zinc-900">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Advanced Search Options
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="sortBy" className="text-sm font-medium mb-1 block">Sort Results By</Label>
                          <Select value={searchOptions.sortBy} onValueChange={(value: any) => handleSettingChange('sortBy', value)}>
                            <SelectTrigger id="sortBy">
                              <SelectValue placeholder="Sort Results By" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="relevance">Relevance</SelectItem>
                              <SelectItem value="date">Date (Newest First)</SelectItem>
                              <SelectItem value="authority">Authority (Central Acts First)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="format" className="text-sm font-medium mb-1 block">Result Format</Label>
                          <Select value={searchOptions.format} onValueChange={(value: any) => handleSettingChange('format', value)}>
                            <SelectTrigger id="format">
                              <SelectValue placeholder="Result Format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="detailed">Detailed Analysis</SelectItem>
                              <SelectItem value="summary">Concise Summary</SelectItem>
                              <SelectItem value="structured">Structured Format</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="subjectMatter" className="text-sm font-medium mb-1 block">Subject Matter</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                {searchOptions.subjectMatter.length > 0
                                  ? `${searchOptions.subjectMatter.length} selected`
                                  : "Select Subject Matter"}
                                <span className="sr-only">Open popover</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                              <div className="max-h-80 overflow-auto p-4">
                                {subjectMatters.map(subject => (
                                  <div key={subject.value} className="flex items-center space-x-2 mb-2">
                                    <Checkbox
                                      id={`subject-${subject.value}`}
                                      checked={searchOptions.subjectMatter.includes(subject.value)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          handleSettingChange('subjectMatter',
                                            [...searchOptions.subjectMatter, subject.value]
                                          );
                                        } else {
                                          handleSettingChange('subjectMatter',
                                            searchOptions.subjectMatter.filter(s => s !== subject.value)
                                          );
                                        }
                                      }}
                                    />
                                    <Label
                                      htmlFor={`subject-${subject.value}`}
                                      className="text-sm cursor-pointer"
                                    >
                                      {subject.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center justify-between p-2 border-t">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSettingChange('subjectMatter', [])}
                                >
                                  Clear All
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSettingChange('subjectMatter', subjectMatters.map(s => s.value))}
                                >
                                  Select All
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="relevance" className="text-sm font-medium">Relevance Threshold ({searchOptions.relevance}%)</Label>
                        </div>
                        <Slider
                          id="relevance"
                          min={50}
                          max={100}
                          step={5}
                          value={[searchOptions.relevance]}
                          onValueChange={(value) => handleSettingChange('relevance', value[0])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Broader Results</span>
                          <span>Precise Results</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="includeRepealed"
                            checked={searchOptions.includeRepealed}
                            onCheckedChange={(checked) => handleSettingChange('includeRepealed', !!checked)}
                          />
                          <Label htmlFor="includeRepealed" className="text-sm cursor-pointer">
                            Include Repealed Statutes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="includeAmendments"
                            checked={searchOptions.includeAmendments}
                            onCheckedChange={(checked) => handleSettingChange('includeAmendments', !!checked)}
                          />
                          <Label htmlFor="includeAmendments" className="text-sm cursor-pointer">
                            Include Amendments
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setQuery('');
                        setResults('');
                        logAction('clear_search', {});
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Researching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Search Statutes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
              
              {results && (
                <CardFooter className="flex flex-col pt-6">
                  <div className="border-t w-full pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Research Results</h3>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExportCitations}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Extract Citations
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadResults}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="prose dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-zinc-900 p-4 rounded-md border overflow-auto max-h-[600px]">
                        {results}
                      </pre>
                    </div>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="statute-list">
            <Card>
              <CardHeader>
                <CardTitle>Indian Statutes Library</CardTitle>
                <CardDescription>
                  Browse the collection of important Indian statutes with latest updates and amendments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search statutes by name or keyword..."
                    className="max-w-md"
                  />
                  
                  <Accordion type="single" collapsible className="w-full">
                    {mockStatutes
                      .filter(statute => 
                        !searchTerm || 
                        statute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        statute.details.keyTerms.some(term => term.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .map(statute => (
                        <AccordionItem key={statute.id} value={statute.id}>
                          <AccordionTrigger className="hover:bg-gray-50 dark:hover:bg-zinc-900 px-4 py-2 rounded-md">
                            <div className="flex flex-col items-start text-left">
                              <div className="flex items-center gap-2">
                                <span>{statute.name}</span>
                                {statute.recentChanges.length > 0 && (
                                  <Badge variant="outline" className="text-xs bg-yellow-100 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800">
                                    Recently Updated
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                                Last updated: {statute.lastUpdated}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pl-4">
                            <div className="space-y-4 py-2">
                              <p className="text-sm">{statute.details.description}</p>
                              
                              {statute.details.keyTerms.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Key Terms:</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {statute.details.keyTerms.map(term => (
                                      <Badge key={term} variant="secondary" className="text-xs" onClick={() => handleSuggestedQuery(term)}>
                                        {term}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {statute.recentChanges.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Recent Changes:</h4>
                                  <ul className="list-disc list-inside text-sm space-y-1">
                                    {statute.recentChanges.map((change, i) => (
                                      <li key={i}>{change}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {statute.details.relatedRules.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Related Rules:</h4>
                                  <ul className="list-disc list-inside text-sm space-y-1">
                                    {statute.details.relatedRules.map((rule, i) => (
                                      <li key={i} className="cursor-pointer hover:text-blue-600" onClick={() => handleSuggestedQuery(rule)}>
                                        {rule}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              <div className="flex justify-between items-center pt-2">
                                <Button 
                                  variant="link" 
                                  className="text-blue-600 dark:text-blue-400 p-0 h-auto text-sm"
                                  onClick={() => window.open(statute.details.fullTextLink, '_blank')}
                                >
                                  View Full Text <FileCog className="ml-1 h-3 w-3" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSuggestedQuery(`Key provisions of ${statute.name}`)}
                                >
                                  Research This Statute
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

export default StatuteTrackerPage;
