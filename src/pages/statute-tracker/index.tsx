import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Bell, 
  Search, 
  BookOpen, 
  Calendar, 
  AlertTriangle, 
  Brain,
  TrendingUp,
  Download,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  Filter,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import BackButton from "@/components/BackButton";

interface StatuteUpdate {
  statute: string;
  updateType: "Amendment" | "New" | "Repeal";
  date: string;
  title: string;
  summary: string;
  impact: "High" | "Medium" | "Low";
  affectedSections: string[];
  effectiveDate: string;
  complianceRequirements: string[];
  source: string;
}

interface StatuteSearchResult {
  name: string;
  shortName: string;
  year: string;
  type: string;
  ministry: string;
  lastAmendment: string;
  status: string;
  summary: string;
  keyProvisions: string[];
  relevanceScore: number;
  implementationDate: string;
  applicability: string;
  relatedStatutes: string[];
  recentChanges: string[];
}

const StatuteTrackerPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(false);
  const [searchResults, setSearchResults] = useState<StatuteSearchResult[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<StatuteUpdate[]>([]);
  const [searchProgress, setSearchProgress] = useState(0);
  const [trackedStatutes] = useState<string[]>([
    "Digital Personal Data Protection Act, 2023",
    "Companies Act, 2013",
    "Information Technology Act, 2000",
    "Consumer Protection Act, 2019",
    "Goods and Services Tax Act, 2017"
  ]);
  
  const { toast } = useToast();

  useEffect(() => {
    loadRecentUpdates();
  }, []);

  const loadRecentUpdates = async () => {
    setIsLoadingUpdates(true);
    try {
      const response = await fetch('/functions/v1/statute-tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_updates',
          dateRange: {
            from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            to: new Date().toISOString().split('T')[0]
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.updates) {
          setRecentUpdates(data.updates);
        }
      } else {
        // Fallback mock data
        setRecentUpdates([
          {
            statute: "Digital Personal Data Protection Act, 2023",
            updateType: "Amendment",
            date: "2024-01-15",
            title: "New Data Processing Rules Introduced",
            summary: "Enhanced rules for data processing and consent mechanisms have been introduced to strengthen privacy protection.",
            impact: "High",
            affectedSections: ["Section 7", "Section 11", "Rule 4"],
            effectiveDate: "2024-02-15",
            complianceRequirements: ["Update privacy policies", "Implement new consent mechanisms"],
            source: "Ministry of Electronics and IT"
          },
          {
            statute: "Goods and Services Tax Act, 2017",
            updateType: "Amendment",
            date: "2024-01-10",
            title: "GST Compliance Procedure Updates",
            summary: "Revised procedures for GST return filing and input tax credit claims to streamline compliance.",
            impact: "Medium",
            affectedSections: ["Section 39", "Section 16"],
            effectiveDate: "2024-01-20",
            complianceRequirements: ["Update accounting software", "Train compliance team"],
            source: "Central Board of Indirect Taxes"
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to load updates:', error);
    } finally {
      setIsLoadingUpdates(false);
    }
  };

  const handleStatuteSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "No Search Term",
        description: "Please enter a statute name or legal topic.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setSearchResults([]);

    try {
      // Progress simulation
      const progressSteps = [
        { step: 25, message: "Initializing AI search..." },
        { step: 50, message: "Searching statute databases..." },
        { step: 75, message: "Analyzing amendments..." },
        { step: 100, message: "Compiling results..." }
      ];

      for (const { step } of progressSteps) {
        setSearchProgress(step);
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      const response = await fetch('/functions/v1/statute-tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'search',
          query: searchQuery
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.statutes) {
          setSearchResults(data.statutes);
          toast({
            title: "Search Complete",
            description: `Found ${data.statutes.length} relevant statutes.`,
          });
        }
      } else {
        // Fallback mock data
        const mockResults: StatuteSearchResult[] = [
          {
            name: "Digital Personal Data Protection Act, 2023",
            shortName: "DPDP Act",
            year: "2023",
            type: "Act",
            ministry: "Ministry of Electronics and Information Technology",
            lastAmendment: "2024-01-15",
            status: "Active",
            summary: "Comprehensive legislation to protect personal data and ensure privacy rights of citizens.",
            keyProvisions: ["Data Protection", "Consent Mechanisms", "Data Breach Notification"],
            relevanceScore: 95,
            implementationDate: "2023-08-11",
            applicability: "Nationwide",
            relatedStatutes: ["Information Technology Act, 2000"],
            recentChanges: ["New processing rules", "Enhanced penalties"]
          }
        ];
        
        setSearchResults(mockResults);
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search statutes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
      setSearchProgress(0);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getUpdateTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "new": return "bg-green-500";
      case "amendment": return "bg-blue-500";
      case "repeal": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <AppLayout>
      <Helmet>
        <title>AI Statute Tracker | VakilGPT</title>
        <meta name="description" content="AI-powered statute tracking and legislative updates for Indian legal professionals" />
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
              <h1 className="text-3xl md:text-4xl font-bold">AI Statute Tracker</h1>
              <p className="text-muted-foreground text-lg">
                Stay updated with AI-powered legislative tracking and analysis
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="updates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="updates" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Recent Updates
            </TabsTrigger>
            <TabsTrigger value="tracked" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Tracked Statutes
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              AI Search
            </TabsTrigger>
          </TabsList>

          {/* Recent Updates Tab */}
          <TabsContent value="updates" className="space-y-6">
            <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <TrendingUp className="h-5 w-5" />
                  Legislative Intelligence
                </CardTitle>
                <CardDescription>
                  AI-powered analysis of recent legislative changes and their impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{recentUpdates.length}</div>
                    <div className="text-sm text-muted-foreground">Recent Updates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {recentUpdates.filter(u => u.impact === "High").length}
                    </div>
                    <div className="text-sm text-muted-foreground">High Impact</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{trackedStatutes.length}</div>
                    <div className="text-sm text-muted-foreground">Tracked Acts</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AnimatePresence>
              {isLoadingUpdates ? (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center">
                      <Sparkles className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
                      <p className="text-muted-foreground">Loading latest updates...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {recentUpdates.map((update, index) => (
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
                              <CardTitle className="text-lg mb-2">{update.title}</CardTitle>
                              <CardDescription>
                                <div className="flex items-center gap-2 text-sm mb-2">
                                  <BookOpen className="h-4 w-4" />
                                  {update.statute}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(update.date).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Effective: {new Date(update.effectiveDate).toLocaleDateString()}
                                  </div>
                                </div>
                              </CardDescription>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant={getImpactColor(update.impact)}>
                                {update.impact} impact
                              </Badge>
                              <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${getUpdateTypeColor(update.updateType)}`} />
                                <span className="text-xs text-muted-foreground">{update.updateType}</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4 leading-relaxed">{update.summary}</p>
                          
                          <div className="space-y-3">
                            <div>
                              <span className="font-medium text-sm">Affected Sections: </span>
                              {update.affectedSections.map((section, idx) => (
                                <Badge key={idx} variant="outline" className="mr-1">
                                  {section}
                                </Badge>
                              ))}
                            </div>
                            
                            <div>
                              <span className="font-medium text-sm">Compliance Requirements:</span>
                              <ul className="mt-1 text-sm text-muted-foreground">
                                {update.complianceRequirements.map((req, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Tracked Statutes Tab */}
          <TabsContent value="tracked" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Tracked Statutes
                </CardTitle>
                <CardDescription>
                  Statutes you're currently monitoring for updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trackedStatutes.map((statute, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{statute}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Statute to Track
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card className="shadow-lg border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI-Powered Statute Search
                </CardTitle>
                <CardDescription>
                  Find and analyze Indian statutes with advanced AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g., data protection, GST, companies act, labor law..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleStatuteSearch()}
                        className="pl-10 h-12"
                      />
                    </div>
                    <Button 
                      onClick={handleStatuteSearch} 
                      disabled={isSearching || !searchQuery.trim()}
                      size="lg"
                      className="px-8"
                    >
                      {isSearching ? (
                        <>
                          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>

                  {isSearching && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>AI Search Progress</span>
                        <span>{searchProgress}%</span>
                      </div>
                      <Progress value={searchProgress} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold">Search Results ({searchResults.length})</h3>
                  {searchResults.map((result, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{result.name}</CardTitle>
                            <CardDescription className="mt-2">
                              <div className="flex items-center gap-4 text-sm">
                                <span>{result.year}</span>
                                <span>•</span>
                                <span>{result.ministry}</span>
                                <span>•</span>
                                <Badge variant="outline">{result.status}</Badge>
                              </div>
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">
                            {result.relevanceScore}% relevant
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{result.summary}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div>
                            <span className="font-medium text-sm">Key Provisions: </span>
                            {result.keyProvisions.map((provision, idx) => (
                              <Badge key={idx} variant="outline" className="mr-1">
                                {provision}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Last Amendment:</span> {result.lastAmendment}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Text
                          </Button>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Track Updates
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {searchResults.length === 0 && !isSearching && searchQuery && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No statutes found matching your search criteria</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {searchResults.length === 0 && !isSearching && !searchQuery && (
              <Card>
                <CardContent className="py-16">
                  <div className="text-center">
                    <Brain className="h-16 w-16 mx-auto mb-6 text-muted-foreground/50" />
                    <h3 className="text-xl font-semibold mb-2">AI Statute Search</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Enter a statute name or legal topic to search through Indian legislation with AI-powered analysis and insights.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default StatuteTrackerPage;