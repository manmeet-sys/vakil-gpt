
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import OptimizedAppLayout from '@/components/OptimizedAppLayout';
import { Search, FileText, ArrowRight, Sparkles, Filter, Save, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchResult {
  title: string;
  snippet: string;
  relevance: number;
  source?: string;
  date?: string;
  court?: string;
  citation?: string;
}

const AdvancedAISearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<string>('case-law');
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [courtFilter, setCourtFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [relevanceFilter, setRelevanceFilter] = useState<string>('high');
  const isMobile = useIsMobile();
  
  // New filters for advanced search
  const [includeHeadnotes, setIncludeHeadnotes] = useState(true);
  const [includeFullText, setIncludeFullText] = useState(false);
  const [sortBy, setSortBy] = useState<string>('relevance');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
    // Reset some filters based on search type
    if (value !== 'case-law') {
      setCourtFilter('all');
    }
  };
  
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search with timeout
    setTimeout(() => {
      setIsSearching(false);
      
      // Mock results based on search type with more details for an enhanced search experience
      if (searchType === 'case-law') {
        setSearchResults([
          {
            title: "Supreme Court of India: XYZ vs State of Maharashtra",
            snippet: "The court held that in cases involving Section 302, the prosecution must establish beyond reasonable doubt that the accused had the intention to cause death...",
            relevance: 0.95,
            source: "Supreme Court of India",
            date: "2022-05-15",
            court: "Supreme Court",
            citation: "AIR 2022 SC 156"
          },
          {
            title: "Delhi High Court: ABC Ltd vs Commissioner of Income Tax",
            snippet: "The bench unanimously agreed that under the Income Tax Act, the provisions of Section 80 are to be interpreted liberally to provide relief to assessee...",
            relevance: 0.88,
            source: "Delhi High Court",
            date: "2023-01-22",
            court: "Delhi High Court",
            citation: "2023 SCC OnLine Del 123"
          },
          {
            title: "Bombay High Court: State vs PQR",
            snippet: "When examining criminal matters under POCSO Act, the courts must ensure that the statements of witnesses are corroborated by material evidence...",
            relevance: 0.81,
            source: "Bombay High Court",
            date: "2021-11-10",
            court: "Bombay High Court",
            citation: "(2021) 4 Bom CR 782"
          }
        ]);
      } else if (searchType === 'statutes') {
        setSearchResults([
          {
            title: "Indian Penal Code, Section 420",
            snippet: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security...",
            relevance: 0.92,
            source: "Indian Penal Code",
            date: "Last amended: 2018-08-01",
            citation: "Act No. 45 of 1860"
          },
          {
            title: "Information Technology Act, Section 66",
            snippet: "If any person, dishonestly or fraudulently, does any act referred to in section 43, he shall be punishable with imprisonment for a term which may extend to three years or with fine...",
            relevance: 0.85,
            source: "Information Technology Act",
            date: "Last amended: 2020-06-15",
            citation: "Act No. 21 of 2000"
          }
        ]);
      } else {
        setSearchResults([
          {
            title: "Legal Commentary on Corporate Veil",
            snippet: "The doctrine of piercing the corporate veil in Indian jurisprudence has evolved significantly over the past decade with courts becoming more willing to look beyond the corporate form...",
            relevance: 0.93,
            source: "Indian Journal of Corporate Law",
            date: "2022-09-05"
          },
          {
            title: "Commentary on Recent Amendments to Arbitration Act",
            snippet: "The 2021 amendments to the Arbitration and Conciliation Act represent a significant shift in India's approach to interim relief and enforcement mechanisms...",
            relevance: 0.89,
            source: "Bar Council of India Review",
            date: "2021-12-18"
          }
        ]);
      }
      
      toast.success("Search completed successfully");
    }, 1500);
  };
  
  const handleClear = () => {
    setSearchQuery('');
    setSearchResults(null);
    setShowAdvancedFilters(false);
    setCourtFilter('all');
    setYearFilter('all');
    setRelevanceFilter('high');
    setIncludeHeadnotes(true);
    setIncludeFullText(false);
    setSortBy('relevance');
  };
  
  const handleSaveSearch = () => {
    toast.success("Search criteria saved to your profile");
  };
  
  const handleExportResults = () => {
    toast.success("Results exported to PDF");
  };

  return (
    <OptimizedAppLayout>
      <Helmet>
        <title>Advanced AI Search | VakilGPT</title>
        <meta 
          name="description" 
          content="Search legal documents, case law, and statutes with AI-powered precision" 
        />
      </Helmet>

      <ResponsiveContainer className="py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-green-700 dark:text-green-400" />
              </div>
              <h1 className="text-xl sm:text-3xl font-bold font-playfair">Advanced AI Legal Search</h1>
              <Badge variant="outline" className="bg-green-100/50 text-green-800 dark:bg-green-900/30 dark:text-green-400">Beta</Badge>
            </div>
            
            {!isMobile && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSaveSearch} 
                  disabled={!searchQuery}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Search
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportResults}
                  disabled={!searchResults}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            )}
          </div>
          
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Leverage AI to search across case law, statutes, and legal commentary with unprecedented precision and relevance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-4 sm:mb-6">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-lg sm:text-xl font-playfair">Advanced Legal Search</CardTitle>
                </CardHeader>
                <CardContent className="pb-0">
                  <Tabs defaultValue="case-law" value={searchType} onValueChange={handleSearchTypeChange}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="case-law">Case Law</TabsTrigger>
                      <TabsTrigger value="statutes">Statutes</TabsTrigger>
                      <TabsTrigger value="commentary">Legal Commentary</TabsTrigger>
                    </TabsList>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="searchQuery">Search Query</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="searchQuery"
                            placeholder={`Search ${searchType}...`}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        type="button" 
                        className="w-full justify-center items-center"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      >
                        <Filter className="mr-2 h-4 w-4" />
                        {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
                      </Button>
                      
                      {showAdvancedFilters && (
                        <div className="space-y-4 mt-4 border-t pt-4 border-gray-100 dark:border-gray-800">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {searchType === 'case-law' && (
                              <>
                                <div className="space-y-2">
                                  <Label htmlFor="court-filter">Court</Label>
                                  <Select value={courtFilter} onValueChange={setCourtFilter}>
                                    <SelectTrigger id="court-filter">
                                      <SelectValue placeholder="All Courts" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">All Courts</SelectItem>
                                      <SelectItem value="supreme">Supreme Court</SelectItem>
                                      <SelectItem value="high">High Courts</SelectItem>
                                      <SelectItem value="district">District Courts</SelectItem>
                                      <SelectItem value="tribunals">Tribunals</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="year-filter">Year Range</Label>
                                  <Select value={yearFilter} onValueChange={setYearFilter}>
                                    <SelectTrigger id="year-filter">
                                      <SelectValue placeholder="All Years" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">All Years</SelectItem>
                                      <SelectItem value="2020-2023">2020-2023</SelectItem>
                                      <SelectItem value="2010-2019">2010-2019</SelectItem>
                                      <SelectItem value="2000-2009">2000-2009</SelectItem>
                                      <SelectItem value="before-2000">Before 2000</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </>
                            )}
                            
                            <div className="space-y-2">
                              <Label htmlFor="relevance-filter">Minimum Relevance</Label>
                              <Select value={relevanceFilter} onValueChange={setRelevanceFilter}>
                                <SelectTrigger id="relevance-filter">
                                  <SelectValue placeholder="High Relevance" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">High Relevance (90%+)</SelectItem>
                                  <SelectItem value="medium">Medium Relevance (70%+)</SelectItem>
                                  <SelectItem value="low">Low Relevance (50%+)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="sort-by">Sort Results By</Label>
                              <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger id="sort-by">
                                  <SelectValue placeholder="Relevance" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="relevance">Relevance</SelectItem>
                                  <SelectItem value="recent">Most Recent First</SelectItem>
                                  <SelectItem value="oldest">Oldest First</SelectItem>
                                  {searchType === 'case-law' && (
                                    <SelectItem value="court">Court Hierarchy</SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Include in Results:</Label>
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="headnotes" 
                                  checked={includeHeadnotes}
                                  onCheckedChange={(checked) => setIncludeHeadnotes(checked as boolean)}
                                />
                                <Label htmlFor="headnotes" className="text-sm">Headnotes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="full-text" 
                                  checked={includeFullText}
                                  onCheckedChange={(checked) => setIncludeFullText(checked as boolean)}
                                />
                                <Label htmlFor="full-text" className="text-sm">Full Text</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <p className="font-medium mb-1">Search tips:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Use quotes for exact phrase matching: "habeas corpus"</li>
                          <li>Use AND/OR for boolean logic: privacy AND data</li>
                          <li>Use court:SC to filter by Supreme Court</li>
                          <li>Use year:2020-2023 to filter by year range</li>
                        </ul>
                      </div>
                    </div>
                  </Tabs>
                </CardContent>
                
                <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleClear}
                    className="sm:w-auto w-full"
                  >
                    Clear All
                  </Button>
                  
                  <div className="grow"></div>
                  
                  <Button 
                    disabled={!searchQuery.trim() || isSearching}
                    className="sm:w-auto w-full"
                    onClick={handleSearch}
                  >
                    {isSearching ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Mobile action buttons */}
            {isMobile && searchResults && (
              <div className="flex items-center justify-between gap-2 mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSaveSearch} 
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportResults}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-playfair">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                    Search Results
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pb-6">
                  {isSearching ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-green-600"></div>
                      <p className="mt-4 text-sm text-gray-500">Searching legal databases...</p>
                    </div>
                  ) : searchResults ? (
                    <div className="space-y-4 sm:space-y-6">
                      {searchResults.map((result, index) => (
                        <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5">
                            <h3 className="font-medium text-base sm:text-lg font-playfair">{result.title}</h3>
                            <Badge variant="outline" className="self-start sm:self-auto bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                              {Math.round(result.relevance * 100)}% match
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1.5">{result.snippet}</p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                            {result.source && <span>{result.source}</span>}
                            {result.date && <span>{result.date}</span>}
                            {result.citation && <span className="font-medium">{result.citation}</span>}
                          </div>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full">
                        Load More Results
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <Search className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                      <h3 className="font-medium text-base sm:text-lg text-gray-400 dark:text-gray-500 font-playfair">No Results Yet</h3>
                      <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-xs mx-auto">
                        Enter your search query and click the search button to find relevant legal documents
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </ResponsiveContainer>
    </OptimizedAppLayout>
  );
};

export default AdvancedAISearchPage;
