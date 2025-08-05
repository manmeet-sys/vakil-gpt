import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Search, BookOpen, Calendar, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface StatuteUpdate {
  id: string;
  title: string;
  statute: string;
  date: string;
  type: "amendment" | "new" | "repeal";
  impact: "high" | "medium" | "low";
  summary: string;
  relevantSections: string[];
}

const StatuteTrackerPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trackedStatutes] = useState<string[]>([
    "Indian Contract Act, 1872",
    "Companies Act, 2013",
    "Information Technology Act, 2000",
    "Consumer Protection Act, 2019"
  ]);
  
  const [recentUpdates] = useState<StatuteUpdate[]>([
    {
      id: "1",
      title: "Amendment to Digital Personal Data Protection Rules",
      statute: "Digital Personal Data Protection Act, 2023",
      date: "2024-01-15",
      type: "amendment",
      impact: "high",
      summary: "New rules regarding data processing and consent mechanisms have been introduced.",
      relevantSections: ["Section 7", "Section 11", "Rule 4"]
    },
    {
      id: "2", 
      title: "Update to GST Compliance Procedures",
      statute: "Goods and Services Tax Act, 2017",
      date: "2024-01-10",
      type: "amendment",
      impact: "medium",
      summary: "Revised procedures for GST return filing and input tax credit claims.",
      relevantSections: ["Section 39", "Section 16"]
    },
    {
      id: "3",
      title: "New Environmental Clearance Guidelines",
      statute: "Environment Protection Act, 1986",
      date: "2024-01-05",
      type: "new",
      impact: "high",
      summary: "Additional guidelines for industrial projects requiring environmental clearance.",
      relevantSections: ["New Rule 5A", "Rule 7"]
    }
  ]);

  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "No Search Term",
        description: "Please enter a statute name or legal topic.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: "Search Complete",
        description: "Statute search completed. Results shown below.",
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search statutes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "new": return "bg-green-500";
      case "amendment": return "bg-blue-500";
      case "repeal": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Statute Tracker</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest changes in legislation, track important statutes, and receive notifications about legal updates.
        </p>
      </div>

      <Tabs defaultValue="updates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="updates">Recent Updates</TabsTrigger>
          <TabsTrigger value="tracked">Tracked Statutes</TabsTrigger>
          <TabsTrigger value="search">Search Statutes</TabsTrigger>
        </TabsList>

        <TabsContent value="updates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Legislative Updates
              </CardTitle>
              <CardDescription>
                Latest changes and amendments to tracked legislation
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {recentUpdates.map((update) => (
              <Card key={update.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{update.title}</CardTitle>
                      <CardDescription className="mt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <BookOpen className="h-4 w-4" />
                          {update.statute}
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={getImpactColor(update.impact)}>
                        {update.impact} impact
                      </Badge>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getTypeColor(update.type)}`} />
                        <span className="text-xs text-muted-foreground capitalize">{update.type}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{update.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(update.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Sections: {update.relevantSections.join(", ")}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

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
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{statute}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Active</Badge>
                      <Button variant="ghost" size="sm">
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                Add New Statute to Track
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Statutes
              </CardTitle>
              <CardDescription>
                Find specific statutes and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter statute name, act, or legal topic..."
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

          {searchQuery && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Search results will appear here</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatuteTrackerPage;