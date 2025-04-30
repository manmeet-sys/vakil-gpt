
import React, { useState, useEffect, useMemo } from 'react';
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

// Types for improved case law research
interface LandmarkCase {
  name: string;
  year: string;
  court: string;
  citation: string;
  principle: string;
  summary?: string;
  significance?: string;
  tags?: string[];
}

interface CaseLawSearchOptions {
  court: string;
  jurisdiction: string;
  timeframe: string;
  relevance: number;
  includeOverruled: boolean;
  includeRelatedStatutes: boolean;
  includeRecentUpdates: boolean;
  apiProvider: 'deepseek' | 'gemini';
  sortBy: 'relevance' | 'date' | 'authority';
  format: 'detailed' | 'summary' | 'structured';
  subjectMatter: string[];
}

const CaseLawResearchPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string>('');
  const { toast } = useToast();
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('case-search');
  const { logPageView, logSearch, logAction, logError } = useAnalytics();
  
  // Enhanced search options for more accuracy
  const [searchOptions, setSearchOptions] = useState<CaseLawSearchOptions>({
    court: 'all',
    jurisdiction: 'all',
    timeframe: 'all',
    relevance: 80, // Default relevance threshold (0-100)
    includeOverruled: false,
    includeRelatedStatutes: true,
    includeRecentUpdates: true,
    apiProvider: 'gemini',
    sortBy: 'relevance',
    format: 'detailed',
    subjectMatter: [],
  });

  // More complete list of Indian courts
  const courts = [
    { value: 'all', label: 'All Courts' },
    { value: 'supreme-court', label: 'Supreme Court' },
    { value: 'high-court', label: 'High Courts' },
    { value: 'district-court', label: 'District Courts' },
    { value: 'tribunals', label: 'Tribunals' },
    { value: 'special-courts', label: 'Special Courts' },
    { value: 'family-courts', label: 'Family Courts' }
  ];

  // Comprehensive list of Indian jurisdictions
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

  // More extensive landmark cases collection
  const landmarkCases: LandmarkCase[] = [
    {
      name: "Kesavananda Bharati v. State of Kerala",
      year: "1973",
      court: "Supreme Court",
      citation: "(1973) 4 SCC 225",
      principle: "Basic Structure Doctrine - Parliament cannot amend the basic structure of the Constitution",
      summary: "A 13-judge bench ruled that Parliament cannot alter the basic structure of the Constitution. This case established judicial review over constitutional amendments.",
      significance: "The most important constitutional case in India - established limits on parliamentary power to amend the Constitution",
      tags: ["constitutional", "fundamental rights", "parliamentary powers"]
    },
    {
      name: "Justice K.S. Puttaswamy v. Union of India",
      year: "2017",
      court: "Supreme Court",
      citation: "(2017) 10 SCC 1",
      principle: "Right to Privacy is a fundamental right under Article 21 of the Constitution",
      summary: "A nine-judge bench unanimously held that the right to privacy is protected as a fundamental right under Part III of the Constitution. This case has significant implications for data protection, Aadhaar, and digital rights.",
      significance: "Landmark judgment establishing privacy as a fundamental right in the digital age",
      tags: ["constitutional", "privacy", "digital rights", "fundamental rights"]
    },
    {
      name: "Vishaka v. State of Rajasthan",
      year: "1997",
      court: "Supreme Court",
      citation: "AIR 1997 SC 3011",
      principle: "Guidelines for prevention of sexual harassment at workplace",
      summary: "The Court laid down guidelines for prevention of sexual harassment of women at workplace, later codified in the Sexual Harassment of Women at Workplace Act, 2013.",
      significance: "Demonstrated judicial legislation to fill legislative gaps and protect women's workplace rights",
      tags: ["gender justice", "workplace", "sexual harassment"]
    },
    {
      name: "Shreya Singhal v. Union of India",
      year: "2015",
      court: "Supreme Court",
      citation: "(2015) 5 SCC 1",
      principle: "Section 66A of IT Act struck down as unconstitutional; defined limits on online speech regulation",
      summary: "The Court struck down Section 66A of the Information Technology Act for being vague and violating the freedom of speech guaranteed under Article 19(1)(a) of the Constitution.",
      significance: "Protected online free speech and set standards for constitutional scrutiny of speech restrictions",
      tags: ["free speech", "internet law", "constitutional", "IT Act"]
    },
    {
      name: "Navtej Singh Johar v. Union of India",
      year: "2018",
      court: "Supreme Court",
      citation: "(2018) 10 SCC 1",
      principle: "Decriminalized consensual homosexual acts by reading down Section 377 of IPC",
      summary: "The Court unanimously held that Section 377 of IPC is unconstitutional to the extent it criminalizes consensual sexual conduct between adults of the same sex.",
      significance: "Major victory for LGBTQ+ rights in India, recognizing sexual orientation as protected under right to equality",
      tags: ["LGBTQ", "fundamental rights", "criminal law", "equality"]
    },
    {
      name: "Indian Council for Enviro-Legal Action v. Union of India",
      year: "1996",
      court: "Supreme Court",
      citation: "AIR 1996 SC 1446",
      principle: "Polluter Pays Principle and Public Trust Doctrine",
      summary: "The Court applied the 'Polluter Pays Principle', holding that the financial cost of preventing or remedying environmental damage must lie with the undertakings which cause the pollution.",
      significance: "Landmark environmental case establishing liability principles for environmental pollution",
      tags: ["environmental law", "pollution", "corporate responsibility"]
    },
    {
      name: "M.C. Mehta v. Union of India (Oleum Gas Leak Case)",
      year: "1987",
      court: "Supreme Court",
      citation: "AIR 1987 SC 1086",
      principle: "Absolute liability principle for hazardous industries",
      summary: "The Court established the principle of absolute liability without exceptions for enterprises engaged in hazardous activities, going beyond the strict liability rule in Rylands v. Fletcher.",
      significance: "Created stricter liability standards for hazardous industries operating in India",
      tags: ["environmental law", "absolute liability", "industrial accidents"]
    },
    {
      name: "Maneka Gandhi v. Union of India",
      year: "1978",
      court: "Supreme Court",
      citation: "AIR 1978 SC 597",
      principle: "Expanded interpretation of Article 21 - Right to Life includes right to live with human dignity",
      summary: "The Court held that the right to life under Article 21 is not merely a physical right but includes within its ambit the right to live with human dignity.",
      significance: "Transformed interpretation of fundamental rights and expanded scope of Article 21",
      tags: ["constitutional", "fundamental rights", "right to life"]
    },
    {
      name: "Mohd. Ahmed Khan v. Shah Bano Begum",
      year: "1985",
      court: "Supreme Court",
      citation: "AIR 1985 SC 945",
      principle: "Muslim women's right to maintenance under Section 125 of CrPC",
      summary: "The Court upheld the right of a Muslim woman to maintenance under Section 125 of Criminal Procedure Code, beyond the iddat period as prescribed under Muslim personal law.",
      significance: "Created significant debate on uniform civil code and religious personal laws",
      tags: ["family law", "personal law", "gender justice", "maintenance"]
    },
    {
      name: "ADM Jabalpur v. Shivakant Shukla",
      year: "1976",
      court: "Supreme Court",
      citation: "AIR 1976 SC 1207",
      principle: "Suspension of fundamental rights during Emergency (later overruled)",
      summary: "The majority held that a person's right to not be unlawfully detained (habeas corpus) can be suspended during a national emergency. This judgment was later effectively overruled in K.S. Puttaswamy case.",
      significance: "Considered a dark chapter in Indian judicial history, later remedied through constitutional amendments",
      tags: ["constitutional", "emergency powers", "habeas corpus", "fundamental rights"]
    },
    {
      name: "Bachhan Singh v. State of Punjab",
      year: "1980",
      court: "Supreme Court",
      citation: "(1980) 2 SCC 684",
      principle: "Constitutional validity of death penalty and 'rarest of rare' doctrine",
      summary: "The Court upheld the constitutional validity of death penalty but restricted its application to the 'rarest of rare' cases where the alternative of life imprisonment is unquestionably foreclosed.",
      significance: "Established the framework for application of death penalty in India",
      tags: ["criminal law", "death penalty", "sentencing"]
    },
    {
      name: "S.R. Bommai v. Union of India",
      year: "1994",
      court: "Supreme Court",
      citation: "(1994) 3 SCC 1",
      principle: "Presidential proclamation under Article 356 is subject to judicial review",
      summary: "The Court established that the power of the President to dismiss a state government is not absolute and is subject to judicial review.",
      significance: "Protected federalism and established checks on central government power over states",
      tags: ["constitutional", "federalism", "presidential powers"]
    }
  ];
  
  // Added new suggested queries based on common Indian legal research needs
  const suggestedQueries = useMemo(() => [
    "What are the key Supreme Court judgments on the basic structure doctrine after Kesavananda Bharati?",
    "Explain how Indian courts have interpreted Section 124A of IPC (sedition) in recent years",
    "What is the current judicial stance on bail provisions under BNSS compared to CrPC?",
    "Supreme Court precedents on environmental clearances for infrastructure projects",
    "Recent High Court interpretations of tenant rights under Rent Control Acts in urban areas",
    "How does the new Bharatiya Nyaya Sanhita treat white-collar crimes differently from the IPC?",
    "Landmark judgments on personal data protection prior to the Digital Personal Data Protection Act",
    "Competition Commission of India's approach to abuse of dominance in e-commerce platforms",
    "Supreme Court guidelines on electronic evidence admissibility under the new BSA framework",
    "How have courts interpreted 'cruel and unusual punishment' under Article 21 in capital cases?"
  ], []);

  useEffect(() => {
    const storedApiProvider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
    setSearchOptions(prev => ({...prev, apiProvider: storedApiProvider}));
    
    logPageView({
      tool: 'case-law-research',
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
        court: searchOptions.court,
        jurisdiction: searchOptions.jurisdiction,
        timeframe: searchOptions.timeframe,
        provider: searchOptions.apiProvider,
        relevance: searchOptions.relevance,
        sortBy: searchOptions.sortBy,
        format: searchOptions.format
      });

      const apiKey = localStorage.getItem(`${searchOptions.apiProvider}ApiKey`) || '';
      let caseResults = '';
      
      if (searchOptions.apiProvider === 'gemini') {
        caseResults = await generateGeminiCaseLawResults(query, apiKey, searchOptions);
      } else if (searchOptions.apiProvider === 'deepseek') {
        caseResults = await generateDeepSeekCaseLawResults(query, apiKey, searchOptions);
      }

      setResults(caseResults);
      
      logAction('search_complete', {
        query_length: query.length,
        result_length: caseResults.length,
        provider: searchOptions.apiProvider
      });
      
      toast({
        title: "Research Complete",
        description: "Indian case law research results have been generated",
      });
    } catch (error) {
      console.error('Error searching case law:', error);
      
      logError('search_failed', {
        query,
        provider: searchOptions.apiProvider,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Failed to complete case law research",
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
    const citationRegex = /\(\d{4}\)\s+\d+\s+SCC\s+\d+|AIR\s+\d{4}\s+SC\s+\d+|\d{4}\s+\(\d+\)\s+SCC\s+\d+/g;
    const citations = results.match(citationRegex) || [];
    
    if (citations.length > 0) {
      const citationText = citations.join('\n');
      navigator.clipboard.writeText(citationText);
      toast({
        title: "Citations Exported",
        description: `${citations.length} Indian legal citations copied to clipboard`,
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
Case Law Research Results
Query: ${query}
Date: ${new Date().toLocaleDateString('en-IN')}
Search Parameters: 
- Court: ${courts.find(c => c.value === searchOptions.court)?.label}
- Jurisdiction: ${jurisdictions.find(j => j.value === searchOptions.jurisdiction)?.label}
- Timeframe: ${timeframes.find(t => t.value === searchOptions.timeframe)?.label}

RESULTS:
${results}
    `], {type: 'text/plain'});
    
    element.href = URL.createObjectURL(file);
    element.download = `CaseLawResearch_${new Date().toISOString().split('T')[0]}.txt`;
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
    setActiveTab('case-search');
    logAction('suggested_query_selected', { query });
  };

  const generateGeminiCaseLawResults = async (
    query: string, 
    apiKey: string, 
    options: CaseLawSearchOptions
  ): Promise<string> => {
    const timeframeText = options.timeframe !== 'all' 
      ? `6. Focus on cases from the ${timeframes.find(t => t.value === options.timeframe)?.label}` 
      : '';
      
    const courtFocus = options.court !== 'all' 
      ? `focusing primarily on ${courts.find(c => c.value === options.court)?.label} cases` 
      : 'across all relevant courts';
      
    const jurisdictionFocus = options.jurisdiction !== 'all' 
      ? `with particular emphasis on precedents from ${jurisdictions.find(j => j.value === options.jurisdiction)?.label}` 
      : 'from all relevant jurisdictions';
      
    const subjectMatterText = options.subjectMatter.length > 0
      ? `7. Focus on the following subject matters: ${options.subjectMatter.join(', ')}`
      : '';
      
    const overruledText = !options.includeOverruled
      ? "8. Exclude overruled or superseded precedents"
      : "8. Include historically significant overruled precedents with clear indication of their current status";
      
    const formatInstructions = options.format === 'detailed' 
      ? "Provide comprehensive analysis with detailed reasoning from each case"
      : options.format === 'summary' 
        ? "Provide concise summaries focusing on key holdings and principles"
        : "Structure the response with clear headings, bullet points, and tables where appropriate";
        
    const statutesText = options.includeRelatedStatutes
      ? "9. Include references to relevant Indian statutes including new laws like Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA) if applicable"
      : "";
      
    const recentUpdatesText = options.includeRecentUpdates
      ? "10. Highlight any recent updates, amendments or pending review petitions affecting these precedents"
      : "";
      
    const sortingInstruction = options.sortBy === 'relevance'
      ? "Format your response with proper Indian legal citations and organize by relevance"
      : options.sortBy === 'date'
        ? "Format your response with proper Indian legal citations and organize chronologically (newest first)"
        : "Format your response with proper Indian legal citations and organize by authority (Supreme Court first, then High Courts)";

    const systemPrompt = `You are VakilGPT's case law research assistant specialized in Indian law. 
    
    For the provided query, find and summarize relevant case law precedents from Indian courts, including:
    1. Key cases relevant to the query ${courtFocus}
    2. Judgments ${jurisdictionFocus} if applicable
    3. The legal principles established in these cases
    4. The precise ratio decidendi and obiter dicta where relevant
    5. How these precedents apply in the Indian legal context
    ${timeframeText}
    ${subjectMatterText}
    ${overruledText}
    ${statutesText}
    ${recentUpdatesText}
    
    ${formatInstructions}. ${sortingInstruction}.
    
    Maintain a relevance threshold of ${options.relevance}% - only include cases that are directly applicable to the query.`;

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

  const generateDeepSeekCaseLawResults = async (
    query: string, 
    apiKey: string, 
    options: CaseLawSearchOptions
  ): Promise<string> => {
    const timeframeText = options.timeframe !== 'all' 
      ? `6. Focus on cases from the ${timeframes.find(t => t.value === options.timeframe)?.label}` 
      : '';
      
    const courtFocus = options.court !== 'all' 
      ? `focusing primarily on ${courts.find(c => c.value === options.court)?.label} cases` 
      : 'across all relevant courts';
      
    const jurisdictionFocus = options.jurisdiction !== 'all' 
      ? `with particular emphasis on precedents from ${jurisdictions.find(j => j.value === options.jurisdiction)?.label}` 
      : 'from all relevant jurisdictions';
      
    const subjectMatterText = options.subjectMatter.length > 0
      ? `7. Focus on the following subject matters: ${options.subjectMatter.join(', ')}`
      : '';
      
    const overruledText = !options.includeOverruled
      ? "8. Exclude overruled or superseded precedents"
      : "8. Include historically significant overruled precedents with clear indication of their current status";
      
    const formatInstructions = options.format === 'detailed' 
      ? "Provide comprehensive analysis with detailed reasoning from each case"
      : options.format === 'summary' 
        ? "Provide concise summaries focusing on key holdings and principles"
        : "Structure the response with clear headings, bullet points, and tables where appropriate";
        
    const statutesText = options.includeRelatedStatutes
      ? "9. Include references to relevant Indian statutes including new laws like Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA) if applicable"
      : "";
      
    const recentUpdatesText = options.includeRecentUpdates
      ? "10. Highlight any recent updates, amendments or pending review petitions affecting these precedents"
      : "";
      
    const sortingInstruction = options.sortBy === 'relevance'
      ? "Format your response with proper Indian legal citations and organize by relevance"
      : options.sortBy === 'date'
        ? "Format your response with proper Indian legal citations and organize chronologically (newest first)"
        : "Format your response with proper Indian legal citations and organize by authority (Supreme Court first, then High Courts)";

    const systemPrompt = `You are VakilGPT's case law research assistant specialized in Indian law. 
    
    For the provided query, find and summarize relevant case law precedents from Indian courts, including:
    1. Key cases relevant to the query ${courtFocus}
    2. Judgments ${jurisdictionFocus} if applicable
    3. The legal principles established in these cases
    4. The precise ratio decidendi and obiter dicta where relevant
    5. How these precedents apply in the Indian legal context
    ${timeframeText}
    ${subjectMatterText}
    ${overruledText}
    ${statutesText}
    ${recentUpdatesText}
    
    ${formatInstructions}. ${sortingInstruction}.
    
    Maintain a relevance threshold of ${options.relevance}% - only include cases that are directly applicable to the query.`;
    
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
      title="Indian Case Law Research" 
      description="Research relevant case law precedents from Indian courts based on your legal queries"
      icon={<BookOpen className="h-6 w-6 text-blue-600" />}
    >
      <div className="max-w-4xl mx-auto">
        <BackButton to="/tools" label="Back to Tools" />
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="case-search">
              <Search className="h-4 w-4 mr-2" />
              Case Search
            </TabsTrigger>
            <TabsTrigger value="landmark-cases">
              <BookOpenCheck className="h-4 w-4 mr-2" />
              Landmark Cases
            </TabsTrigger>
            <TabsTrigger value="research-tools">
              <FileCog className="h-4 w-4 mr-2" />
              Research Tools
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="case-search">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Indian Case Law Search</CardTitle>
                <CardDescription>
                  Enter your legal question or describe the issue to find relevant Indian precedents. Use advanced filters for more precise results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="E.g., What are Supreme Court precedents on right to privacy in India? Or describe a legal scenario under Indian law..."
                    className="min-h-[100px]"
                  />
                  
                  <div className="flex flex-wrap gap-2">
                    {suggestedQueries.slice(0, 5).map((q, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => handleSuggestedQuery(q)}
                      >
                        {q.length > 40 ? q.substring(0, 40) + '...' : q}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="court" className="text-sm font-medium mb-1 block">Court</Label>
                      <Select value={searchOptions.court} onValueChange={(value) => handleSettingChange('court', value)}>
                        <SelectTrigger id="court">
                          <SelectValue placeholder="Select Court" />
                        </SelectTrigger>
                        <SelectContent>
                          {courts.map(court => (
                            <SelectItem key={court.value} value={court.value}>{court.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
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
                              <SelectItem value="authority">Authority (Supreme Court First)</SelectItem>
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
                      
                      <div>
                        <Label className="text-sm font-medium mb-1 block">Relevance Threshold: {searchOptions.relevance}%</Label>
                        <Slider 
                          value={[searchOptions.relevance]} 
                          min={50} 
                          max={100} 
                          step={5}
                          onValueChange={(value) => handleSettingChange('relevance', value[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>More Results</span>
                          <span>Higher Relevance</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="includeOverruled"
                            checked={searchOptions.includeOverruled}
                            onCheckedChange={(checked) => handleSettingChange('includeOverruled', !!checked)}
                          />
                          <Label htmlFor="includeOverruled" className="text-sm cursor-pointer">
                            Include overruled or superseded precedents (with clear indication)
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="includeRelatedStatutes"
                            checked={searchOptions.includeRelatedStatutes}
                            onCheckedChange={(checked) => handleSettingChange('includeRelatedStatutes', !!checked)}
                          />
                          <Label htmlFor="includeRelatedStatutes" className="text-sm cursor-pointer">
                            Include relevant statutes and regulations
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="includeRecentUpdates"
                            checked={searchOptions.includeRecentUpdates}
                            onCheckedChange={(checked) => handleSettingChange('includeRecentUpdates', !!checked)}
                          />
                          <Label htmlFor="includeRecentUpdates" className="text-sm cursor-pointer">
                            Highlight recent updates and amendments
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>Results will incorporate new Indian laws including BNS, BNSS, and BSA where relevant.</span>
                  </div>
                  
                  <Button 
                    onClick={handleSearch} 
                    disabled={isSearching || !query.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
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
              <Card className="mb-8">
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Research Results</CardTitle>
                      <CardDescription>
                        Relevant Indian case law and precedents based on your query.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleExportCitations}
                        className="text-xs"
                      >
                        Export Citations
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleDownloadResults}
                        className="text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: results.replace(/\n/g, '<br />') }} />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t gap-4">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    Researched on {new Date().toLocaleDateString('en-IN', { 
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </div>
                  
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => {
                      logAction('refine_search', {});
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Refine Search
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="landmark-cases">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2 mb-2">
                <Input
                  placeholder="Search landmark cases..."
                  className="w-full"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {landmarkCases
                .filter(caseItem => 
                  searchTerm ? 
                    caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    caseItem.principle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (caseItem.tags && caseItem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
                    : true
                )
                .map((caseItem) => (
                <Card 
                  key={caseItem.name}
                  className="col-span-1 h-full"
                >
                  <CardHeader className="pb-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{caseItem.name}</CardTitle>
                        <Badge>{caseItem.year}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{caseItem.court}</Badge>
                        <Badge variant="secondary">{caseItem.citation}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="principle" className="border-none">
                        <AccordionTrigger className="py-2 text-sm font-medium">Legal Principle</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm">{caseItem.principle}</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      {caseItem.summary && (
                        <AccordionItem value="summary" className="border-none">
                          <AccordionTrigger className="py-2 text-sm font-medium">Case Summary</AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm">{caseItem.summary}</p>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                      
                      {caseItem.significance && (
                        <AccordionItem value="significance" className="border-none">
                          <AccordionTrigger className="py-2 text-sm font-medium">Significance</AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm">{caseItem.significance}</p>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Accordion>
                    
                    {caseItem.tags && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {caseItem.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-slate-50 dark:bg-slate-900">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-full text-blue-600 dark:text-blue-400"
                      onClick={() => {
                        setActiveTab('case-search');
                        setQuery(`Explain the significance and current application of ${caseItem.name}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Research This Case
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {landmarkCases.filter(caseItem => 
                searchTerm ? 
                  caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  caseItem.principle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (caseItem.tags && caseItem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
                  : true
              ).length === 0 && (
                <div className="col-span-1 md:col-span-2 p-8 text-center border rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">No landmark cases match your search criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="research-tools">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Citation Guides</CardTitle>
                  <CardDescription>Indian legal citation formats and standards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Supreme Court Citation Formats</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-semibold">SCC:</span> (2017) 10 SCC 1</p>
                      <p><span className="font-semibold">SCR:</span> AIR 1973 SC 1461</p>
                      <p><span className="font-semibold">SCJ:</span> (1994) 2 SCJ 1</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">High Court Citation Formats</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="font-semibold">Delhi HC:</span> (2015) 219 DLT 289</p>
                      <p><span className="font-semibold">Bombay HC:</span> (2012) 2 Bom CR 529</p>
                      <p><span className="font-semibold">Calcutta HC:</span> AIR 2010 Cal 123</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Legal Research Databases</CardTitle>
                  <CardDescription>Key Indian legal research resources</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">SCC Online</span>
                    <a 
                      href="https://www.scconline.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Visit
                    </a>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Manupatra</span>
                    <a 
                      href="https://www.manupatra.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Visit
                    </a>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Indian Kanoon</span>
                    <a 
                      href="https://indiankanoon.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Visit
                    </a>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Supreme Court of India</span>
                    <a 
                      href="https://main.sci.gov.in/judgments" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Visit
                    </a>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">e-Courts Services</span>
                    <a 
                      href="https://ecourts.gov.in/ecourts_home/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Visit
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Research Query Templates</CardTitle>
                  <CardDescription>Templates for effective legal research</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">Precedent Search Template</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      "Find Supreme Court judgments on [legal issue] between [timeframe]"
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs w-full mt-1"
                      onClick={() => {
                        setActiveTab('case-search');
                        setQuery("Find Supreme Court judgments on right to privacy between 2017-2023");
                      }}
                    >
                      Use Template
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">Statutory Interpretation Template</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      "How have courts interpreted [section/provision] of [statute] regarding [issue]?"
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs w-full mt-1"
                      onClick={() => {
                        setActiveTab('case-search');
                        setQuery("How have courts interpreted Section 66A of IT Act regarding freedom of expression?");
                      }}
                    >
                      Use Template
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">Legal Principle Template</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      "What is the current position on [legal principle] in Indian jurisprudence?"
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs w-full mt-1"
                      onClick={() => {
                        setActiveTab('case-search');
                        setQuery("What is the current position on the doctrine of legitimate expectation in Indian jurisprudence?");
                      }}
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

export default CaseLawResearchPage;
