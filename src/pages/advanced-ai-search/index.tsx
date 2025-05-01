
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import OptimizedAppLayout from '@/components/OptimizedAppLayout';
import { Search, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import GeminiAnalyzer from '@/components/GeminiAnalyzer';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface SearchResult {
  title: string;
  snippet: string;
  relevance: number;
  source?: string;
  date?: string;
}

const AdvancedAISearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<string>('case-law');
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
  };
  
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search with timeout
    setTimeout(() => {
      setIsSearching(false);
      
      // Mock results based on search type
      if (searchType === 'case-law') {
        setSearchResults([
          {
            title: "Supreme Court of India: XYZ vs State of Maharashtra",
            snippet: "The court held that in cases involving Section 302, the prosecution must establish beyond reasonable doubt that...",
            relevance: 0.95,
            source: "Supreme Court of India",
            date: "2022-05-15"
          },
          {
            title: "Delhi High Court: ABC Ltd vs Commissioner of Income Tax",
            snippet: "The bench unanimously agreed that under the Income Tax Act, the provisions of Section 80 are to be interpreted liberally...",
            relevance: 0.88,
            source: "Delhi High Court",
            date: "2023-01-22"
          },
          {
            title: "Bombay High Court: State vs PQR",
            snippet: "When examining criminal matters under POCSO Act, the courts must ensure that the statements of witnesses...",
            relevance: 0.81,
            source: "Bombay High Court",
            date: "2021-11-10"
          }
        ]);
      } else if (searchType === 'statutes') {
        setSearchResults([
          {
            title: "Indian Penal Code, Section 420",
            snippet: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person...",
            relevance: 0.92,
            source: "Indian Penal Code",
            date: "Last amended: 2018-08-01"
          },
          {
            title: "Information Technology Act, Section 66",
            snippet: "If any person, dishonestly or fraudulently, does any act referred to in section 43, he shall be punishable with imprisonment...",
            relevance: 0.85,
            source: "Information Technology Act",
            date: "Last amended: 2020-06-15"
          }
        ]);
      } else {
        setSearchResults([
          {
            title: "Legal Commentary on Corporate Veil",
            snippet: "The doctrine of piercing the corporate veil in Indian jurisprudence has evolved significantly over the past decade...",
            relevance: 0.93,
            source: "Indian Journal of Corporate Law",
            date: "2022-09-05"
          },
          {
            title: "Commentary on Recent Amendments to Arbitration Act",
            snippet: "The 2021 amendments to the Arbitration and Conciliation Act represent a significant shift in India's approach to...",
            relevance: 0.89,
            source: "Bar Council of India Review",
            date: "2021-12-18"
          }
        ]);
      }
    }, 1500);
  };
  
  const handleClear = () => {
    setSearchQuery('');
    setSearchResults(null);
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

      <ResponsiveContainer className="py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
              <Search className="h-5 w-5 text-green-700 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold">Advanced AI Legal Search</h1>
            <Badge variant="outline" className="bg-green-100/50 text-green-800 dark:bg-green-900/30 dark:text-green-400">Beta</Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Leverage AI to search across case law, statutes, and legal commentary with unprecedented precision and relevance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Advanced Legal Search</CardTitle>
                </CardHeader>
                <CardContent className="pb-0">
                  <Tabs defaultValue="case-law" value={searchType} onValueChange={handleSearchTypeChange}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="case-law">Case Law</TabsTrigger>
                      <TabsTrigger value="statutes">Statutes</TabsTrigger>
                      <TabsTrigger value="commentary">Legal Commentary</TabsTrigger>
                    </TabsList>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="searchQuery">Search Query</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="searchQuery"
                            placeholder={`Search ${searchType}...`}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 dark:text-gray-400">
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
                    Clear
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
          </div>
          
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Search Results
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pb-6">
                  {isSearching ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-green-600"></div>
                      <p className="mt-4 text-gray-500">Searching legal databases...</p>
                    </div>
                  ) : searchResults ? (
                    <div className="space-y-6">
                      {searchResults.map((result, index) => (
                        <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="font-medium text-lg">{result.title}</h3>
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                              {Math.round(result.relevance * 100)}% match
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1.5">{result.snippet}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{result.source}</span>
                            <span>{result.date}</span>
                          </div>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full">
                        Load More Results
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                      <h3 className="font-medium text-lg text-gray-400 dark:text-gray-500">No Results Yet</h3>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-xs mx-auto">
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
