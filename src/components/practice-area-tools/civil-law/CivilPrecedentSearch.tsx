
import React, { useState } from 'react';
import { BaseAnalyzer, AnalysisResult } from '@/components/practice-area-tools/base';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { getGeminiResponse } from '@/components/GeminiProIntegration';
import { Search, Book } from 'lucide-react';
import { toast } from 'sonner';

const CivilPrecedentSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('contract');
  const [yearRange, setYearRange] = useState('any');
  const [searchType, setSearchType] = useState('keyword');
  const [searchResults, setSearchResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const courts = [
    { value: 'all', label: 'All Courts' },
    { value: 'sc', label: 'Supreme Court' },
    { value: 'hc', label: 'High Courts' },
    { value: 'ncdrc', label: 'National Consumer Disputes Redressal Commission' },
    { value: 'nclat', label: 'National Company Law Appellate Tribunal' }
  ];
  
  const categories = [
    { value: 'contract', label: 'Contract Law' },
    { value: 'tort', label: 'Tort Law' },
    { value: 'property', label: 'Property Law' },
    { value: 'tenancy', label: 'Rent and Tenancy' },
    { value: 'specific_relief', label: 'Specific Relief' }
  ];
  
  const yearRanges = [
    { value: 'any', label: 'Any Year' },
    { value: 'last_5', label: 'Last 5 Years' },
    { value: 'last_10', label: 'Last 10 Years' },
    { value: 'last_20', label: 'Last 20 Years' }
  ];
  
  // Mock case database for demo purposes
  // In a real implementation, this would be a call to an API or database
  const mockCaseDatabase = [
    {
      title: "M/s Adhunik Steels Ltd vs Orissa Manganese & Minerals Ltd",
      citation: "(2007) 7 SCC 125",
      court: "Supreme Court of India",
      year: 2007,
      category: "contract",
      principles: [
        "Specific performance of a contract is an equitable and discretionary remedy",
        "It cannot be claimed as a matter of right by a plaintiff",
        "Courts may exercise discretion not to grant specific performance when damages are adequate remedy"
      ],
      summary: "The Supreme Court held that specific performance is a discretionary and equitable remedy that cannot be claimed as a matter of right. Courts consider various factors including adequacy of damages as an alternative remedy."
    },
    {
      title: "Nilabati Behera vs State of Orissa",
      citation: "AIR 1993 SC 1960",
      court: "Supreme Court of India",
      year: 1993,
      category: "tort",
      principles: [
        "State liability in tort extends to violations of fundamental rights",
        "Compensation can be awarded for custodial death under public law remedy",
        "Sovereign immunity is no defense against constitutional violations"
      ],
      summary: "This landmark judgment established that the state can be held liable for tortious acts of its servants and that compensation can be awarded to victims of custodial violence as a public law remedy."
    },
    {
      title: "Dahiben vs Arvindbhai Kalyanji Bhanusali",
      citation: "(2020) 7 SCC 366",
      court: "Supreme Court of India",
      year: 2020,
      category: "property",
      principles: [
        "Adverse possession requires clear, unequivocal and unambiguous assertion of hostile title",
        "Permissive possession cannot be converted into adverse possession",
        "Burden of proof is on the person claiming adverse possession"
      ],
      summary: "The Supreme Court clarified principles governing adverse possession, stating that a permissive possession cannot be converted into adverse possession and that the burden of proving all elements of adverse possession lies squarely on the person asserting it."
    },
    {
      title: "Delhi Airtech Services vs State of UP",
      citation: "(2011) 9 SCC 354",
      court: "Supreme Court of India",
      year: 2011,
      category: "property",
      principles: [
        "Just compensation is a facet of Article 300A",
        "Land acquisition must follow due process of law",
        "Market value determination must be based on relevant factors"
      ],
      summary: "This case established that right to property, though not a fundamental right, is still a constitutional right under Article 300A, and expropriation of property must be strictly in accordance with law accompanied by payment of just compensation."
    },
    {
      title: "Waman Shriniwas Kini vs Ratilal Bhagwandas & Co",
      citation: "AIR 1959 SC 689",
      court: "Supreme Court of India",
      year: 1959,
      category: "tenancy",
      principles: [
        "Bona fide requirement of landlord is a ground for eviction",
        "Landlord's need must be genuine, honest and not a mere desire",
        "Comparative hardship to tenant must be considered"
      ],
      summary: "This judgment laid down principles regarding bona fide requirement of premises by landlord as ground for eviction of tenant, emphasizing that the requirement must be genuine and not merely a desire to get higher rent."
    }
  ];
  
  const performMockSearch = (query: string) => {
    let results = [...mockCaseDatabase];
    
    // Filter by court
    if (selectedCourt !== 'all') {
      results = results.filter(case_ => 
        case_.court.toLowerCase().includes(selectedCourt === 'sc' ? 'supreme court' : 
          selectedCourt === 'hc' ? 'high court' : selectedCourt)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(case_ => case_.category === selectedCategory);
    }
    
    // Filter by year range
    const currentYear = new Date().getFullYear();
    if (yearRange === 'last_5') {
      results = results.filter(case_ => case_.year >= currentYear - 5);
    } else if (yearRange === 'last_10') {
      results = results.filter(case_ => case_.year >= currentYear - 10);
    } else if (yearRange === 'last_20') {
      results = results.filter(case_ => case_.year >= currentYear - 20);
    }
    
    // Filter by query
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(case_ => 
        case_.title.toLowerCase().includes(lowerQuery) || 
        case_.principles.some(p => p.toLowerCase().includes(lowerQuery)) ||
        case_.summary.toLowerCase().includes(lowerQuery)
      );
    }
    
    return results;
  };
  
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // Get cases from mock database
      const relevantCases = performMockSearch(searchQuery);
      
      if (relevantCases.length === 0) {
        setSearchResults([{
          title: "No Matching Cases Found",
          description: "Try broadening your search criteria or using different keywords.",
          severity: "info"
        }]);
        setIsLoading(false);
        return;
      }
      
      // Prepare results
      const results: AnalysisResult[] = [];
      
      // Summary result
      results.push({
        title: `Found ${relevantCases.length} Relevant Cases`,
        description: `Search results for "${searchQuery}" in ${selectedCategory === 'contract' ? 'Contract Law' : 
          selectedCategory === 'tort' ? 'Tort Law' : 
          selectedCategory === 'property' ? 'Property Law' : 
          selectedCategory === 'tenancy' ? 'Rent and Tenancy' : 'Specific Relief'}`,
        severity: "info"
      });
      
      // Case results
      for (const case_ of relevantCases) {
        results.push({
          title: case_.title,
          description: `${case_.citation} (${case_.year}) - ${case_.court}\n\n${case_.summary}`,
          severity: "low"
        });
      }
      
      // If we have the Gemini API integration enabled and query is specific enough,
      // use AI to analyze the results
      if (searchQuery.length > 10 && searchType === 'semantic') {
        try {
          const apiProvider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
          const apiKey = localStorage.getItem(`${apiProvider}ApiKey`);
          
          if (apiKey) {
            const caseSummaries = relevantCases.map(c => `${c.title} (${c.citation}) - ${c.summary}`).join('\n\n');
            
            const prompt = `
              As a legal AI assistant, analyze these Indian civil law cases related to "${searchQuery}":
              
              ${caseSummaries}
              
              Provide a concise analysis of how these cases relate to the query, identifying:
              1. Key legal principles applicable to the query
              2. How the precedents might apply to similar facts
              3. Any contradictions or evolutions in legal reasoning
              
              Format your response in clear, concise bullet points focused on practical legal application.
            `;
            
            const aiAnalysis = await getGeminiResponse(prompt, apiKey);
            
            results.push({
              title: "AI-Generated Case Analysis",
              description: aiAnalysis,
              severity: "info"
            });
          }
        } catch (error) {
          console.error("Error in AI analysis:", error);
          // Continue without AI analysis if it fails
        }
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error("Error in precedent search:", error);
      toast.error("An error occurred during the search. Please try again.");
      setSearchResults([{
        title: "Search Error",
        description: "An error occurred while searching for precedents. Please try again or modify your search.",
        severity: "high"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseAnalyzer
      title="Civil Precedent Search"
      description="Search and analyze civil case precedents with AI-powered legal analysis"
      icon={<Book className="h-5 w-5" />}
      onAnalyze={handleSearch}
      analysisResults={searchResults}
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="search-query">Search Query</Label>
          <Input
            id="search-query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g., specific performance of contract for unique property"
          />
          <p className="text-sm text-muted-foreground">
            Enter keywords, legal concepts, or fact patterns to search for relevant precedents
          </p>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="search-type">Search Method</Label>
          <RadioGroup 
            id="search-type" 
            value={searchType} 
            onValueChange={setSearchType} 
            className="flex flex-row space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="keyword" id="keyword" />
              <Label htmlFor="keyword" className="cursor-pointer">Keyword Search</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="semantic" id="semantic" />
              <Label htmlFor="semantic" className="cursor-pointer">AI-Powered Semantic Search</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-muted-foreground">
            Semantic search uses AI to understand the meaning behind your query (requires API key)
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="court-select">Court</Label>
            <Select value={selectedCourt} onValueChange={setSelectedCourt}>
              <SelectTrigger id="court-select">
                <SelectValue placeholder="Select court" />
              </SelectTrigger>
              <SelectContent>
                {courts.map(court => (
                  <SelectItem key={court.value} value={court.value}>{court.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category-select">Legal Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category-select">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="year-select">Time Period</Label>
            <Select value={yearRange} onValueChange={setYearRange}>
              <SelectTrigger id="year-select">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                {yearRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </BaseAnalyzer>
  );
};

export default CivilPrecedentSearch;
