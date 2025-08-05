import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Scale, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CaseResult {
  id: string;
  title: string;
  court: string;
  year: string;
  citation: string;
  summary: string;
  relevanceScore: number;
  url: string;
}

const CaseLawResearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<CaseResult[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "No Search Term",
        description: "Please enter a search term or legal concept.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      // Simulate case law search
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const mockResults: CaseResult[] = [
        {
          id: "1",
          title: "State v. Johnson",
          court: "Supreme Court of India",
          year: "2023",
          citation: "2023 SCC 145",
          summary: "Landmark judgment regarding constitutional interpretation of fundamental rights in digital privacy cases.",
          relevanceScore: 95,
          url: "#"
        },
        {
          id: "2",
          title: "Ram Kumar v. Union of India",
          court: "Delhi High Court",
          year: "2022",
          citation: "2022 DHC 892",
          summary: "Important precedent on administrative law and procedural fairness in government decision-making.",
          relevanceScore: 88,
          url: "#"
        },
        {
          id: "3",
          title: "Tech Solutions Ltd. v. Data Corp",
          court: "Bombay High Court",
          year: "2023",
          citation: "2023 BHC 234",
          summary: "Commercial dispute involving intellectual property rights and data protection obligations.",
          relevanceScore: 82,
          url: "#"
        }
      ];
      
      setResults(mockResults);
      toast({
        title: "Search Complete",
        description: `Found ${mockResults.length} relevant cases.`,
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search case law. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Case Law Research</h1>
        <p className="text-muted-foreground">
          Search and analyze relevant case law, precedents, and judicial decisions using AI-powered legal research.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Case Law
          </CardTitle>
          <CardDescription>
            Enter legal concepts, case names, or keywords to find relevant precedents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="e.g., constitutional law, contract disputes, intellectual property..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Search Results ({results.length})</h2>
          
          {results.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Scale className="h-5 w-5" />
                      {result.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex items-center gap-4 text-sm">
                        <span>{result.court}</span>
                        <span>•</span>
                        <span>{result.year}</span>
                        <span>•</span>
                        <span className="font-mono">{result.citation}</span>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <div 
                        className={`w-2 h-2 rounded-full ${getRelevanceColor(result.relevanceScore)}`}
                      />
                      {result.relevanceScore}% relevant
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{result.summary}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Read Full Text
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Citation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {results.length === 0 && !isSearching && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Search for case law to see results here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CaseLawResearchPage;