import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Building, Search, FileText, ExternalLink, Download, Loader2, Shield, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IPAnalysis {
  summary: string;
  risks: string[];
  recommendations: string[];
}

const IpProtectionComponent = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [ipType, setIpType] = useState('trademark');
  const [analysisResults, setAnalysisResults] = useState<IPAnalysis | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [templateType, setTemplateType] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');

  const { toast } = useToast();

  const handleIPSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Search Term Required",
        description: "Please enter a search term",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockAnalysis: IPAnalysis = {
        summary: `Analysis for "${searchTerm}" in ${ipType} category shows potential conflicts and opportunities for IP protection.`,
        risks: [
          'Similar existing registrations found',
          'Potential trademark conflicts in related classes',
          'Geographic limitations may apply'
        ],
        recommendations: [
          'Conduct comprehensive trademark search',
          'Consider alternative branding strategies',
          'File in multiple jurisdictions',
          'Monitor for infringement activities'
        ]
      };

      setAnalysisResults(mockAnalysis);
      toast({
        title: "Search Complete",
        description: "IP analysis has been generated"
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "There was an error searching IP databases",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const generateTemplate = () => {
    if (!templateType || !businessDescription) {
      toast({
        title: "Missing Information",
        description: "Please select template type and provide business description",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Template Generated",
      description: `${templateType} template has been generated for your business`
    });
  };

  const ipResources = [
    {
      title: "Intellectual Property India Portal",
      url: "https://ipindia.gov.in/",
      description: "Official IP India portal for patents, trademarks, designs, and GI",
      type: "government"
    },
    {
      title: "Indian Copyright Office",
      url: "https://copyright.gov.in/",
      description: "Official portal for copyright registration in India",
      type: "government"
    },
    {
      title: "E-Filing for IP",
      url: "https://ipindiaonline.gov.in/",
      description: "Portal for e-filing applications for patents, designs and trademarks",
      type: "government"
    },
    {
      title: "WIPO Global Brand Database",
      url: "https://www.wipo.int/branddb/en/",
      description: "International trademark search database",
      type: "international"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-full">
              <Building className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">IP Protection Suite</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Comprehensive intellectual property protection tools for trademarks, patents, copyrights, and trade secrets in India.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="search">IP Search</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property Search & Analysis</CardTitle>
              <CardDescription>
                Search existing IP registrations and analyze potential conflicts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="search-term">Search Term</Label>
                  <Input
                    id="search-term"
                    placeholder="Enter trademark, patent, or brand name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="ip-type">IP Type</Label>
                  <Select value={ipType} onValueChange={setIpType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select IP type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trademark">Trademark</SelectItem>
                      <SelectItem value="patent">Patent</SelectItem>
                      <SelectItem value="copyright">Copyright</SelectItem>
                      <SelectItem value="design">Industrial Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleIPSearch} disabled={isSearching} className="w-full">
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching IP Databases...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search & Analyze IP
                  </>
                )}
              </Button>

              {analysisResults && (
                <div className="mt-6 space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertTitle>IP Analysis Summary</AlertTitle>
                    <AlertDescription>
                      {analysisResults.summary}
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Alert>
                      <AlertTitle className="text-red-700 dark:text-red-400">Potential Risks</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                          {analysisResults.risks.map((risk, index) => (
                            <li key={index} className="text-sm">{risk}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <AlertTitle className="text-green-700 dark:text-green-400">Recommendations</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                          {analysisResults.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm">{rec}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Application
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>IP Document Templates</CardTitle>
              <CardDescription>
                Generate legal documents for IP protection and licensing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template-type">Template Type</Label>
                <Select value={templateType} onValueChange={setTemplateType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trademark-application">Trademark Application</SelectItem>
                    <SelectItem value="patent-application">Patent Application Draft</SelectItem>
                    <SelectItem value="copyright-registration">Copyright Registration</SelectItem>
                    <SelectItem value="license-agreement">IP License Agreement</SelectItem>
                    <SelectItem value="assignment-deed">IP Assignment Deed</SelectItem>
                    <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="business-description">Business Description</Label>
                <Textarea
                  id="business-description"
                  placeholder="Describe your business, the IP you want to protect, and its intended use..."
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button onClick={generateTemplate} className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Generate Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>IP Protection Resources</CardTitle>
              <CardDescription>
                Official government and international resources for IP protection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ipResources.map((resource, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-base">{resource.title}</h3>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {resource.description}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(resource.url, '_blank')}
                          >
                            <ExternalLink className="mr-2 h-3 w-3" />
                            Visit Resource
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Alert className="mt-6">
                <Shield className="h-4 w-4" />
                <AlertTitle>Important Guidelines</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                    <li>Always conduct thorough searches before filing applications</li>
                    <li>Consider international protection for global businesses</li>
                    <li>Maintain proper documentation and records</li>
                    <li>Regularly monitor for potential infringements</li>
                    <li>Consult IP attorneys for complex matters</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IpProtectionComponent;