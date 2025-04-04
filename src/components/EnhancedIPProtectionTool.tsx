
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart2, Search, Check, X, Clock, Shield, FileUp, BookOpen, AlertTriangle, FileText, Download, ExternalLink, Globe, BookOpenCheck, ScrollText, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import PdfFileUpload from '@/components/PdfFileUpload';
import { extractTextFromPdf } from '@/utils/pdfExtraction';

interface IPResource {
  title: string;
  url: string;
  description: string;
  icon: React.ReactNode;
  organization: string;
  category: 'trademark' | 'patent' | 'copyright' | 'design' | 'general';
}

const EnhancedIPProtectionTool = () => {
  const [activeTab, setActiveTab] = useState('trademark');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('exact');
  const [jurisdiction, setJurisdiction] = useState('india');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzedDocument, setAnalyzedDocument] = useState('');
  const [ipDescription, setIpDescription] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [ipRiskLevel, setIpRiskLevel] = useState('');
  const [contractText, setContractText] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [resourceCategory, setResourceCategory] = useState('all');

  const indianIPResources: IPResource[] = [
    {
      title: "Indian Trademark Registry",
      url: "https://ipindiaonline.gov.in/trademarkefiling/user/frmlogin.aspx",
      description: "Official portal for trademark filing and search in India",
      icon: <Search className="h-4 w-4 mr-2" />,
      organization: "Controller General of Patents, Designs & Trade Marks",
      category: "trademark"
    },
    {
      title: "Public Search for Trademarks",
      url: "https://ipindiaservices.gov.in/publicsearch",
      description: "Search the Indian trademark database for existing marks",
      icon: <Search className="h-4 w-4 mr-2" />,
      organization: "Intellectual Property India",
      category: "trademark"
    },
    {
      title: "Trademarks Act, 1999",
      url: "https://ipindia.gov.in/acts-rules-tm.htm",
      description: "Full text of the Indian Trademarks Act, 1999",
      icon: <ScrollText className="h-4 w-4 mr-2" />,
      organization: "Intellectual Property India",
      category: "trademark"
    },
    
    {
      title: "Indian Patent Office",
      url: "https://ipindia.gov.in/e-patentfiling.htm",
      description: "Official portal for patent filing in India",
      icon: <FileText className="h-4 w-4 mr-2" />,
      organization: "Controller General of Patents, Designs & Trade Marks",
      category: "patent"
    },
    {
      title: "Patent Search",
      url: "https://ipindia.gov.in/patents.htm",
      description: "Information on patent searching in India",
      icon: <Search className="h-4 w-4 mr-2" />,
      organization: "Intellectual Property India",
      category: "patent"
    },
    {
      title: "Patents Act, 1970",
      url: "https://ipindia.gov.in/acts-rules-patents.htm",
      description: "Full text of the Indian Patents Act, 1970 (as amended)",
      icon: <ScrollText className="h-4 w-4 mr-2" />,
      organization: "Intellectual Property India",
      category: "patent"
    },
    
    {
      title: "Copyright Office India",
      url: "https://copyright.gov.in/",
      description: "Official portal for copyright registration and information in India",
      icon: <BookOpenCheck className="h-4 w-4 mr-2" />,
      organization: "Department for Promotion of Industry and Internal Trade",
      category: "copyright"
    },
    {
      title: "Copyright E-Filing",
      url: "https://copyright.gov.in/UserRegistration/frmLoginPage.aspx",
      description: "Online portal for filing copyright applications in India",
      icon: <FileUp className="h-4 w-4 mr-2" />,
      organization: "Copyright Office, Government of India",
      category: "copyright"
    },
    {
      title: "Copyright Act, 1957",
      url: "https://copyright.gov.in/Documents/CopyrightRules1957.pdf",
      description: "Full text of the Indian Copyright Act, 1957 (as amended)",
      icon: <ScrollText className="h-4 w-4 mr-2" />,
      organization: "Copyright Office, Government of India",
      category: "copyright"
    },
    
    {
      title: "Design Office India",
      url: "https://ipindia.gov.in/designs.htm",
      description: "Official information on industrial design registration in India",
      icon: <FileCheck className="h-4 w-4 mr-2" />,
      organization: "Controller General of Patents, Designs & Trade Marks",
      category: "design"
    },
    {
      title: "Design Public Search",
      url: "https://ipindia.gov.in/designs.htm",
      description: "Information on searching Indian industrial designs database",
      icon: <Search className="h-4 w-4 mr-2" />,
      organization: "Intellectual Property India",
      category: "design"
    },
    {
      title: "Designs Act, 2000",
      url: "https://ipindia.gov.in/acts-rules-designs.htm",
      description: "Full text of the Indian Designs Act, 2000",
      icon: <ScrollText className="h-4 w-4 mr-2" />,
      organization: "Intellectual Property India",
      category: "design"
    },
    
    {
      title: "Intellectual Property India",
      url: "https://ipindia.gov.in/",
      description: "Official website of Indian IP office with comprehensive resources and guidelines",
      icon: <Globe className="h-4 w-4 mr-2" />,
      organization: "Controller General of Patents, Designs & Trade Marks",
      category: "general"
    },
    {
      title: "Cell for IPR Promotion & Management (CIPAM)",
      url: "https://dpiit.gov.in/sites/default/files/ciptam.pdf",
      description: "Indian government initiative for promoting IP awareness and protection",
      icon: <Shield className="h-4 w-4 mr-2" />,
      organization: "Department for Promotion of Industry and Internal Trade",
      category: "general"
    },
    {
      title: "National Intellectual Property Awareness Mission (NIPAM)",
      url: "https://ipindia.gov.in/nipam.htm",
      description: "Nation-wide IP awareness campaign by the Indian government",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      organization: "Intellectual Property India",
      category: "general"
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      const mockResults = getMockResults(activeTab, searchQuery);
      setSearchResults(mockResults);
      setLoading(false);
      
      if (mockResults.length > 0) {
        toast.success(`Found ${mockResults.length} results for your search`);
      } else {
        toast.info('No results found. Try broadening your search');
      }
    }, 1500);
  };

  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      const extractedText = await extractTextFromPdf(file);
      setContractText(extractedText);
      setFileUploaded(true);
      
      setTimeout(() => {
        analyzeIPProtection(extractedText);
        setLoading(false);
        toast.success('Contract analyzed successfully');
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast.error('Error analyzing file: ' + error.message);
    }
  };

  const analyzeIPProtection = (text) => {
    setIpDescription('The document contains several intellectual property clauses related to ownership of trademarks, patents, and copyright materials. The contract appears to include provisions for IP licensing and transfer of rights.');
    setConfidenceScore(78);
    setIpRiskLevel('moderate');
  };
  
  const getMockResults = (tab, query) => {
    if (!query) return [];
    
    const mockData = {
      trademark: [
        { id: 1, name: 'InnovaTech Solutions', status: 'Registered', owner: 'Tech Innovations Pvt Ltd', date: '2022-07-15', similarity: 87 },
        { id: 2, name: 'InnovateTech', status: 'Pending', owner: 'Digital Solutions Ltd', date: '2023-02-10', similarity: 76 },
        { id: 3, name: 'TechnoInnovate', status: 'Registered', owner: 'NextGen Technologies', date: '2021-11-30', similarity: 64 },
      ],
      patent: [
        { id: 1, name: 'Method for secure blockchain transactions', inventor: 'Dr. Rajesh Kumar', owner: 'Secure Chain Technologies', date: '2021-08-22', similarity: 82 },
        { id: 2, name: 'Distributed ledger validation protocol', inventor: 'Sanjay Mehta', owner: 'Fintech Solutions Ltd', date: '2022-03-17', similarity: 75 },
      ],
      copyright: [
        { id: 1, name: 'Digital Asset Management System', author: 'Priya Sharma', owner: 'Creative Solutions Inc', date: '2023-01-05', similarity: 91 },
        { id: 2, name: 'Automated Content Creation Platform', author: 'Vikram Singh', owner: 'MediaTech Innovations', date: '2022-09-12', similarity: 68 },
      ],
      design: [
        { id: 1, name: 'Ergonomic Mobile Device Holder', designer: 'Ananya Patel', owner: 'Design Innovations Pvt Ltd', date: '2022-11-08', similarity: 79 },
        { id: 2, name: 'Smart Home Control Interface', designer: 'Karan Malhotra', owner: 'HomeTech Solutions', date: '2023-04-20', similarity: 85 },
      ]
    };
    
    const results = mockData[tab] || [];
    return results.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) || 
      (item.owner && item.owner.toLowerCase().includes(query.toLowerCase()))
    );
  };
  
  const renderSearchResults = () => {
    if (loading) {
      return (
        <div className="space-y-4 py-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="w-full bg-muted/30 animate-pulse">
              <CardContent className="p-4 h-24"></CardContent>
            </Card>
          ))}
        </div>
      );
    }
    
    if (!searchResults.length && searchQuery) {
      return (
        <Alert className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No results found</AlertTitle>
          <AlertDescription>
            Try broadening your search or using different keywords.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <div className="space-y-4 py-4">
        {searchResults.map((result) => (
          <Card key={result.id} className="w-full hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{result.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Owner: {result.owner || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === 'trademark' && `Filed: ${result.date}`}
                    {activeTab === 'patent' && `Inventor: ${result.inventor}`}
                    {activeTab === 'copyright' && `Author: ${result.author}`}
                    {activeTab === 'design' && `Designer: ${result.designer}`}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 rounded text-xs ${
                    result.status === 'Registered' ? 'bg-green-100 text-green-800' : 
                    result.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {result.status || 'Active'}
                  </span>
                  <span className="text-sm mt-2">Similarity: {result.similarity}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderRiskIndicator = () => {
    if (!ipRiskLevel) return null;
    
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <div className={`p-4 rounded-md border ${colors[ipRiskLevel]} mt-4`}>
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span className="font-medium capitalize">
            {ipRiskLevel} Risk Level
          </span>
        </div>
        <p className="mt-2 text-sm">
          {ipRiskLevel === 'low' && 'This contract appears to have adequate IP protection measures.'}
          {ipRiskLevel === 'moderate' && 'This contract has some IP protection measures but could be strengthened in certain areas.'}
          {ipRiskLevel === 'high' && 'This contract has significant IP protection gaps that should be addressed.'}
        </p>
      </div>
    );
  };
  
  const filteredResources = resourceCategory === 'all' 
    ? indianIPResources 
    : indianIPResources.filter(resource => resource.category === resourceCategory || resource.category === 'general');

  return (
    <div className="space-y-6">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="trademark">Trademark</TabsTrigger>
          <TabsTrigger value="patent">Patent</TabsTrigger>
          <TabsTrigger value="copyright">Copyright</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="contract">Contract Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trademark">
          <IPSearchPanel 
            title="Indian Trademark Search" 
            description="Search for existing trademarks in the Indian trademark registry. Identify potential conflicts before filing your trademark application."
            handleSearch={handleSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchType={searchType}
            setSearchType={setSearchType}
            jurisdiction={jurisdiction}
            setJurisdiction={setJurisdiction}
            loading={loading}
          />
          {renderSearchResults()}
        </TabsContent>

        <TabsContent value="patent">
          <IPSearchPanel 
            title="Indian Patent Search" 
            description="Search for existing patents in Indian and international patent databases to assess novelty and patentability."
            handleSearch={handleSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchType={searchType}
            setSearchType={setSearchType}
            jurisdiction={jurisdiction}
            setJurisdiction={setJurisdiction}
            loading={loading}
          />
          {renderSearchResults()}
        </TabsContent>

        <TabsContent value="copyright">
          <IPSearchPanel 
            title="Copyright Registry Search" 
            description="Search for registered copyrights in the Indian copyright registry to identify potential conflicts."
            handleSearch={handleSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchType={searchType}
            setSearchType={setSearchType}
            jurisdiction={jurisdiction}
            setJurisdiction={setJurisdiction}
            loading={loading}
          />
          {renderSearchResults()}
        </TabsContent>

        <TabsContent value="design">
          <IPSearchPanel 
            title="Industrial Design Search" 
            description="Search for registered designs in the Indian design registry to identify potential conflicts."
            handleSearch={handleSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchType={searchType}
            setSearchType={setSearchType}
            jurisdiction={jurisdiction}
            setJurisdiction={setJurisdiction}
            loading={loading}
          />
          {renderSearchResults()}
        </TabsContent>
        
        <TabsContent value="contract">
          <Card>
            <CardHeader>
              <CardTitle>IP Contract Analysis</CardTitle>
              <CardDescription>
                Upload a contract to analyze intellectual property clauses, rights, and potential risks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Upload Contract</h3>
                  
                  <PdfFileUpload 
                    onChange={handleFileUpload}
                    pdfFile={pdfFile}
                  />
                  
                  {!fileUploaded && (
                    <Textarea 
                      placeholder="Or paste contract text here..."
                      className="min-h-[250px]"
                      value={contractText}
                      onChange={(e) => setContractText(e.target.value)}
                    />
                  )}
                  
                  {contractText && !fileUploaded && (
                    <Button 
                      onClick={() => {
                        setLoading(true);
                        analyzeIPProtection(contractText);
                        setFileUploaded(true);
                        setTimeout(() => {
                          setLoading(false);
                          toast.success('Contract analyzed successfully');
                        }, 1500);
                      }}
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? 'Analyzing...' : 'Analyze IP Protection'}
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Analysis Results</h3>
                  
                  {loading && (
                    <div className="space-y-4">
                      <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-5/6"></div>
                      <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-4/6"></div>
                    </div>
                  )}
                  
                  {fileUploaded && !loading && (
                    <>
                      <ScrollArea className="h-[250px] border rounded-md p-4">
                        <p className="text-sm">{contractText}</p>
                      </ScrollArea>
                      
                      <div className="space-y-4 mt-4">
                        <div>
                          <h4 className="font-medium text-sm">IP Protection Assessment</h4>
                          <p className="text-sm text-muted-foreground">{ipDescription}</p>
                        </div>
                        
                        {confidenceScore !== null && (
                          <div>
                            <h4 className="font-medium text-sm">Confidence Score</h4>
                            <div className="w-full bg-muted h-2 rounded-full mt-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${confidenceScore}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>0%</span>
                              <span>{confidenceScore}%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        )}
                        
                        {renderRiskIndicator()}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" onClick={() => {
                setContractText('');
                setFileUploaded(false);
                setIpDescription('');
                setConfidenceScore(null);
                setIpRiskLevel('');
                setPdfFile(null);
              }}>
                Clear Results
              </Button>
              
              {fileUploaded && (
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-muted/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Official Indian IP Resources
          </CardTitle>
          <CardDescription>
            Access official government IP databases, registries, and legal resources for Indian intellectual property protection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            <Button 
              variant={resourceCategory === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setResourceCategory('all')}
            >
              All Resources
            </Button>
            <Button 
              variant={resourceCategory === 'trademark' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setResourceCategory('trademark')}
            >
              Trademark
            </Button>
            <Button 
              variant={resourceCategory === 'patent' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setResourceCategory('patent')}
            >
              Patent
            </Button>
            <Button 
              variant={resourceCategory === 'copyright' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setResourceCategory('copyright')}
            >
              Copyright
            </Button>
            <Button 
              variant={resourceCategory === 'design' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setResourceCategory('design')}
            >
              Design
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div>
                      <h3 className="font-medium text-base">{resource.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{resource.organization}</p>
                      <p className="text-sm">{resource.description}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        {resource.icon}
                        Access Resource <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Indian IP Protection Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-base mb-2">For Businesses</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>File trademark applications as soon as possible under the Indian Trademarks Act, 1999</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Conduct thorough prior art searches before patent filing to assess patentability under Indian Patents Act, 1970</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Maintain proper documentation for copyright works though registration is voluntary under Indian Copyright Act, 1957</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Register important designs before public disclosure under the Designs Act, 2000</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Implement proper IP assignment clauses in all employment and contractor agreements</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-base mb-2">Legal Considerations</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Monitor trademark journals regularly to oppose conflicting applications</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Renew IP registrations on time (10 years for trademarks, 20 years for patents)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Use proper trademark symbols (™ for unregistered marks, ® for registered marks)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Register with Indian Customs to prevent import/export of infringing goods</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                  <span>Consider licensing opportunities with proper contractual safeguards</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const IPSearchPanel = ({ 
  title, 
  description, 
  handleSearch, 
  searchQuery, 
  setSearchQuery, 
  searchType, 
  setSearchType, 
  jurisdiction, 
  setJurisdiction, 
  loading 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Enter search term..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Button 
              onClick={handleSearch}
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Clock className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium block mb-2">Search Type</label>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger>
                <SelectValue placeholder="Select search type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exact">Exact Match</SelectItem>
                <SelectItem value="partial">Partial Match</SelectItem>
                <SelectItem value="phonetic">Phonetic Match</SelectItem>
                <SelectItem value="conceptual">Conceptual Match</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Jurisdiction</label>
            <Select value={jurisdiction} onValueChange={setJurisdiction}>
              <SelectTrigger>
                <SelectValue placeholder="Select jurisdiction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="international">International</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="eu">European Union</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedIPProtectionTool;
