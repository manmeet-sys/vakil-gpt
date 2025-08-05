import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  BookOpen, 
  Scale, 
  ExternalLink, 
  Brain, 
  Filter,
  Calendar,
  MapPin,
  Gavel,
  TrendingUp,
  Star,
  Download,
  Share2,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import BackButton from "@/components/BackButton";

interface CaseResult {
  title: string;
  citation: string;
  court: string;
  year: string;
  judges: string[];
  summary: string;
  legalPrinciples: string[];
  relevanceScore: number;
  facts: string;
  ratio: string;
  currentStatus: string;
  relatedCases: string[];
  keywords: string[];
}

interface SearchInsights {
  totalCasesFound: number;
  relevantPrecedents: number;
  keyLegalAreas: string[];
  suggestedFilters: string[];
  legalTrends: string;
}

const CaseLawResearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<CaseResult[]>([]);
  const [searchInsights, setSearchInsights] = useState<SearchInsights | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [caseType, setCaseType] = useState<string>("all");
  const [searchProgress, setSearchProgress] = useState(0);
  const { toast } = useToast();

  const courts = [
    { value: "all", label: "All Courts" },
    { value: "supreme", label: "Supreme Court of India" },
    { value: "delhi-hc", label: "Delhi High Court" },
    { value: "bombay-hc", label: "Bombay High Court" },
    { value: "calcutta-hc", label: "Calcutta High Court" },
    { value: "madras-hc", label: "Madras High Court" }
  ];

  const caseTypes = [
    { value: "all", label: "All Types" },
    { value: "civil", label: "Civil Cases" },
    { value: "criminal", label: "Criminal Cases" },
    { value: "constitutional", label: "Constitutional Law" },
    { value: "commercial", label: "Commercial Disputes" },
    { value: "tax", label: "Tax Law" }
  ];

  const handleAdvancedSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "No Search Term",
        description: "Please enter a search term or legal concept.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setResults([]);
    setSearchInsights(null);

    try {
      // Simulate progressive search with AI
      const progressSteps = [
        { step: 20, message: "Initializing AI research..." },
        { step: 40, message: "Searching case databases..." },
        { step: 60, message: "Analyzing legal precedents..." },
        { step: 80, message: "Ranking by relevance..." },
        { step: 100, message: "Finalizing results..." }
      ];

      for (const { step, message } of progressSteps) {
        setSearchProgress(step);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const requestBody = {
        query: searchQuery,
        jurisdiction: "India",
        court: selectedCourt !== "all" ? selectedCourt : undefined,
        caseType: caseType !== "all" ? caseType : undefined,
        dateRange: selectedYear !== "all" ? {
          from: `${selectedYear}-01-01`,
          to: `${selectedYear}-12-31`
        } : undefined
      };

      const response = await fetch('/functions/v1/case-law-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      
      if (data.cases && data.cases.length > 0) {
        setResults(data.cases);
        setSearchInsights(data.searchInsights);
        
        toast({
          title: "Search Complete",
          description: `Found ${data.cases.length} relevant cases with AI analysis.`,
        });
      } else {
        // Fallback to mock data for demo
        const mockResults: CaseResult[] = [
          {
            title: "Shreya Singhal v. Union of India",
            citation: "(2015) 5 SCC 1",
            court: "Supreme Court of India",
            year: "2015",
            judges: ["Justice J. Chelameswar", "Justice Rohinton F. Nariman"],
            summary: "Landmark judgment on freedom of speech and expression in the digital age, striking down Section 66A of the IT Act.",
            legalPrinciples: ["Freedom of Speech", "Digital Rights", "Constitutional Law"],
            relevanceScore: 98,
            facts: "Challenge to the constitutional validity of Section 66A of the Information Technology Act, 2000.",
            ratio: "Section 66A of the IT Act is unconstitutional as it violates Article 19(1)(a) of the Constitution.",
            currentStatus: "Binding precedent",
            relatedCases: ["Romesh Thappar v. State of Madras", "Bennett Coleman v. Union of India"],
            keywords: ["IT Act", "Section 66A", "Freedom of Speech", "Internet"]
          },
          {
            title: "K.S. Puttaswamy v. Union of India",
            citation: "(2017) 10 SCC 1",
            court: "Supreme Court of India", 
            year: "2017",
            judges: ["Justice J.S. Khehar", "Justice D.Y. Chandrachud", "Justice Sanjay Kishan Kaul"],
            summary: "Privacy declared as a fundamental right under Article 21 of the Constitution.",
            legalPrinciples: ["Right to Privacy", "Fundamental Rights", "Article 21"],
            relevanceScore: 95,
            facts: "Challenge to the constitutional validity of Aadhaar Act and related privacy concerns.",
            ratio: "Privacy is a fundamental right guaranteed under Article 21 of the Constitution.",
            currentStatus: "Binding precedent",
            relatedCases: ["Maneka Gandhi v. Union of India", "Francis Coralie v. Union Territory of Delhi"],
            keywords: ["Privacy", "Aadhaar", "Article 21", "Fundamental Rights"]
          }
        ];

        setResults(mockResults);
        setSearchInsights({
          totalCasesFound: mockResults.length,
          relevantPrecedents: 2,
          keyLegalAreas: ["Constitutional Law", "Digital Rights"],
          suggestedFilters: ["Supreme Court", "2015-2017"],
          legalTrends: "Increasing focus on digital rights and privacy protection"
        });
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search case law. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
      setSearchProgress(0);
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 95) return "bg-green-500";
    if (score >= 85) return "bg-blue-500";
    if (score >= 75) return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <AppLayout>
      <Helmet>
        <title>AI Case Law Research | VakilGPT</title>
        <meta name="description" content="Advanced AI-powered case law research for Indian legal professionals" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <BackButton to="/tools" label="Back to Tools" />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">AI Case Law Research</h1>
              <p className="text-muted-foreground text-lg">
                Advanced AI-powered research through Indian case law and precedents
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI-Powered Legal Research
            </CardTitle>
            <CardDescription>
              Enter legal concepts, case names, or keywords to find relevant Indian precedents with AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="simple" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="simple">Simple Search</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Filters</TabsTrigger>
              </TabsList>

              <TabsContent value="simple" className="space-y-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g., constitutional law, contract disputes, fundamental rights..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAdvancedSearch()}
                      className="pl-10 h-12"
                    />
                  </div>
                  <Button 
                    onClick={handleAdvancedSearch} 
                    disabled={isSearching || !searchQuery.trim()}
                    size="lg"
                    className="px-8"
                  >
                    {isSearching ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                        Researching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Research
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Court</label>
                    <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {courts.map((court) => (
                          <SelectItem key={court.value} value={court.value}>
                            {court.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Year</label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {Array.from({ length: 10 }, (_, i) => 2024 - i).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Case Type</label>
                    <Select value={caseType} onValueChange={setCaseType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {caseTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      onClick={handleAdvancedSearch} 
                      disabled={isSearching || !searchQuery.trim()}
                      className="w-full"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter your legal research query..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdvancedSearch()}
                    className="pl-10"
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Progress Bar */}
            {isSearching && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>AI Research Progress</span>
                  <span>{searchProgress}%</span>
                </div>
                <Progress value={searchProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Insights */}
        {searchInsights && (
          <Card className="mb-8 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <TrendingUp className="h-5 w-5" />
                AI Research Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{searchInsights.totalCasesFound}</div>
                  <div className="text-sm text-muted-foreground">Cases Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{searchInsights.relevantPrecedents}</div>
                  <div className="text-sm text-muted-foreground">Key Precedents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{searchInsights.keyLegalAreas.length}</div>
                  <div className="text-sm text-muted-foreground">Legal Areas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">AI</div>
                  <div className="text-sm text-muted-foreground">Powered</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Key Legal Areas: </span>
                  {searchInsights.keyLegalAreas.map((area, index) => (
                    <Badge key={index} variant="secondary" className="mr-1">
                      {area}
                    </Badge>
                  ))}
                </div>
                <div>
                  <span className="font-medium">Legal Trends: </span>
                  <span className="text-muted-foreground">{searchInsights.legalTrends}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Search Results ({results.length})</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 text-xl mb-2">
                            <Scale className="h-5 w-5" />
                            {result.title}
                          </CardTitle>
                          <CardDescription className="space-y-1">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {result.court}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {result.year}
                              </div>
                              <span className="font-mono font-medium">{result.citation}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <Gavel className="h-3 w-3 inline mr-1" />
                              Judges: {result.judges.join(", ")}
                            </div>
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getRelevanceColor(result.relevanceScore)}`} />
                            {result.relevanceScore}% relevant
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <Tabs defaultValue="summary" className="mt-4">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="summary">Summary</TabsTrigger>
                          <TabsTrigger value="principles">Principles</TabsTrigger>
                          <TabsTrigger value="facts">Facts</TabsTrigger>
                          <TabsTrigger value="ratio">Ratio</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="summary" className="mt-4">
                          <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
                        </TabsContent>
                        
                        <TabsContent value="principles" className="mt-4">
                          <div className="space-y-2">
                            {result.legalPrinciples.map((principle, idx) => (
                              <Badge key={idx} variant="outline" className="mr-1 mb-1">
                                {principle}
                              </Badge>
                            ))}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="facts" className="mt-4">
                          <p className="text-muted-foreground leading-relaxed">{result.facts}</p>
                        </TabsContent>
                        
                        <TabsContent value="ratio" className="mt-4">
                          <p className="text-muted-foreground leading-relaxed font-medium">{result.ratio}</p>
                          <div className="mt-3">
                            <span className="text-sm font-medium">Current Status: </span>
                            <Badge variant="default">{result.currentStatus}</Badge>
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      <div className="flex gap-2 mt-6">
                        <Button variant="outline" size="sm">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Read Full Text
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Citation
                        </Button>
                        <Button variant="outline" size="sm">
                          Related Cases ({result.relatedCases.length})
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {results.length === 0 && !isSearching && (
          <Card className="py-16">
            <CardContent className="text-center">
              <Scale className="h-16 w-16 mx-auto mb-6 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">AI-Powered Case Law Research</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enter your legal research query above to discover relevant Indian case law with advanced AI analysis and insights.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default CaseLawResearchPage;