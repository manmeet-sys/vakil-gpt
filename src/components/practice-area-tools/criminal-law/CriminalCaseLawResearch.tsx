
import React, { useState } from 'react';
import { BaseAnalyzer, type AnalysisResult } from '../base';
import { Search, Book, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface CasePrecedent {
  id: string;
  title: string;
  citation: string;
  court: string;
  year: number;
  description: string;
  relevantSection: string;
  principles: string[];
  keywords: string[];
}

// Mock data for precedents
const precedents: CasePrecedent[] = [
  {
    id: "1",
    title: "State v. Sharma",
    citation: "(2024) 7 SCC 123",
    court: "Supreme Court of India",
    year: 2024,
    description: "Landmark case interpreting BNS Section 45 (Culpable Homicide). The court distinguished between murder and culpable homicide not amounting to murder under the new BNS provisions.",
    relevantSection: "BNS Section 45",
    principles: ["Knowledge vs. Intention", "Degree of Probability", "Gravity of Injury"],
    keywords: ["culpable homicide", "murder", "intention", "BNS 45"]
  },
  {
    id: "2",
    title: "Patel v. State of Gujarat",
    citation: "(2023) 12 SCC 567",
    court: "Supreme Court of India",
    year: 2023,
    description: "Case examining theft under BNS Section 303. The court clarified the element of 'dishonest intention' and its application under the new code.",
    relevantSection: "BNS Section 303",
    principles: ["Dishonest Intention", "Temporary Deprivation", "Movable Property"],
    keywords: ["theft", "dishonest intention", "property", "BNS 303"]
  },
  {
    id: "3",
    title: "Kumar v. State of Maharashtra",
    citation: "2024 Bom HC 890",
    court: "Bombay High Court",
    year: 2024,
    description: "Case dealing with criminal breach of trust under BNS Section 318. The court examined the fiduciary relationship element and misappropriation of property.",
    relevantSection: "BNS Section 318",
    principles: ["Entrustment", "Misappropriation", "Breach of Trust"],
    keywords: ["criminal breach of trust", "misappropriation", "entrustment", "BNS 318"]
  },
  {
    id: "4",
    title: "State v. Reddy",
    citation: "(2024) 3 SCC 421",
    court: "Supreme Court of India",
    year: 2024,
    description: "Case on kidnapping under BNS Section 137. The court interpreted the elements of taking or enticing and lawful guardianship under the new provisions.",
    relevantSection: "BNS Section 137",
    principles: ["Consent in Kidnapping", "Minor's Custody", "Lawful Guardian"],
    keywords: ["kidnapping", "minor", "consent", "guardian", "BNS 137"]
  }
];

const CriminalCaseLawResearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [court, setCourt] = useState('all');
  const [searchResults, setSearchResults] = useState<CasePrecedent[]>([]);
  
  // Convert search results to analysis results format
  const mapToAnalysisResults = (): AnalysisResult[] => {
    return searchResults.map(precedent => ({
      title: `${precedent.title} (${precedent.year})`,
      description: precedent.description,
      severity: 'info'
    }));
  };
  
  const handleSearch = () => {
    let results = [...precedents];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(precedent => 
        precedent.title.toLowerCase().includes(term) ||
        precedent.description.toLowerCase().includes(term) ||
        precedent.relevantSection.toLowerCase().includes(term) ||
        precedent.keywords.some(keyword => keyword.toLowerCase().includes(term))
      );
    }
    
    // Filter by court
    if (court !== 'all') {
      results = results.filter(precedent => 
        precedent.court.toLowerCase().includes(court.toLowerCase())
      );
    }
    
    setSearchResults(results);
  };
  
  // Custom results render component
  const ResultsComponent = () => {
    if (searchResults.length === 0) {
      return null;
    }
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Book className="h-4 w-4" />
          Found {searchResults.length} relevant precedents
        </p>
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="detail">Detail View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-4">
            <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
              {searchResults.map((precedent) => (
                <motion.div 
                  key={precedent.id} 
                  className="border rounded-lg p-4 bg-background hover:shadow-md transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{precedent.title}</h4>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded">
                      {precedent.year}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{precedent.citation}</p>
                  <p className="text-xs text-muted-foreground mb-2">{precedent.court}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {precedent.keywords.map((keyword, idx) => (
                      <span 
                        key={idx}
                        className="text-xs flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full"
                      >
                        <Tag className="h-3 w-3" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="detail" className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              {searchResults.map((precedent) => (
                <AccordionItem key={precedent.id} value={precedent.id} className="border border-gray-200 dark:border-gray-800 rounded-md mb-3 overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 hover:bg-muted/30">
                    <div className="flex flex-col items-start text-left">
                      <span>{precedent.title}</span>
                      <span className="text-xs text-muted-foreground">{precedent.citation} • {precedent.year}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4 pt-2">
                      <div>
                        <h4 className="text-sm font-medium">Case Summary</h4>
                        <p className="text-sm mt-1 text-muted-foreground leading-relaxed">{precedent.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Relevant Section</h4>
                        <Badge className="mt-1">{precedent.relevantSection}</Badge>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Key Legal Principles</h4>
                        <ul className="text-sm list-disc list-inside mt-1 text-muted-foreground space-y-1">
                          {precedent.principles.map((principle, idx) => (
                            <li key={idx}>{principle}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    );
  };
  
  return (
    <BaseAnalyzer
      title="Criminal Case Law Research"
      description="Search and analyze criminal case precedents from Supreme Court and High Courts"
      icon={<Search className="h-5 w-5 text-blue-600" />}
      onAnalyze={handleSearch}
      analysisResults={mapToAnalysisResults()}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search-term">Search Term</Label>
          <Input
            id="search-term"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter keyword, BNS section, or case name"
            className="transition-all focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="court">Court</Label>
          <Select 
            value={court} 
            onValueChange={setCourt}
          >
            <SelectTrigger className="w-full" id="court">
              <SelectValue placeholder="Filter by court" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courts</SelectItem>
              <SelectItem value="supreme">Supreme Court of India</SelectItem>
              <SelectItem value="high">High Courts</SelectItem>
              <SelectItem value="district">District Courts</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {searchResults.length > 0 && <ResultsComponent />}
      </div>
    </BaseAnalyzer>
  );
};

export default CriminalCaseLawResearch;
