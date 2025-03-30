import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { 
  Search, FileText, Shield, Bookmark, Copyright, Hash, Database, 
  CheckCircle, AlertTriangle, Loader2, Download, Edit, Plus, Trash
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { getGeminiResponse } from './GeminiProIntegration';

interface SearchResult {
  id: string;
  type: 'trademark' | 'patent' | 'copyright';
  name: string;
  owner: string;
  filingDate: string;
  registrationDate?: string;
  status: string;
  description: string;
  similarityScore?: number;
}

interface IPAsset {
  id: string;
  type: 'trademark' | 'patent' | 'copyright';
  name: string;
  description: string;
  filingDate: string;
  status: string;
  notes: string;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    date: string;
  }>;
}

const mockTrademarkResults: SearchResult[] = [
  {
    id: 'tm-1',
    type: 'trademark',
    name: 'APPLE',
    owner: 'Apple Inc.',
    filingDate: '1998-07-15',
    registrationDate: '1999-02-28',
    status: 'Registered',
    description: 'Electronic devices, computers, and software',
    similarityScore: 0.22
  },
  {
    id: 'tm-2',
    type: 'trademark',
    name: 'APPLESEED',
    owner: 'Appleseed Organics LLC',
    filingDate: '2015-04-22',
    registrationDate: '2016-01-15',
    status: 'Registered',
    description: 'Organic food products, apple-based juices',
    similarityScore: 0.68
  },
  {
    id: 'tm-3',
    type: 'trademark',
    name: 'APPLE VALLEY',
    owner: 'Apple Valley Farms Inc.',
    filingDate: '2010-09-30',
    registrationDate: '2011-08-12',
    status: 'Registered',
    description: 'Agricultural products, fruit production',
    similarityScore: 0.45
  }
];

const mockPatentResults: SearchResult[] = [
  {
    id: 'pt-1',
    type: 'patent',
    name: 'Method and System for Data Security',
    owner: 'Security Systems Inc.',
    filingDate: '2018-03-10',
    registrationDate: '2020-06-15',
    status: 'Granted',
    description: 'A method for encrypting and securing data transmission across networks',
    similarityScore: 0.35
  },
  {
    id: 'pt-2',
    type: 'patent',
    name: 'Data Protection System for Cloud Services',
    owner: 'CloudSecure Technologies',
    filingDate: '2019-11-05',
    status: 'Pending',
    description: 'System and methods for protecting sensitive data in cloud computing environments',
    similarityScore: 0.72
  }
];

const IPProtectionTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchType, setSearchType] = useState<'trademark' | 'patent' | 'copyright'>('trademark');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '');
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  
  const [myIpAssets, setMyIpAssets] = useState<IPAsset[]>(() => {
    const saved = localStorage.getItem('ipAssets');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedAsset, setSelectedAsset] = useState<IPAsset | null>(null);
  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);
  const [newAsset, setNewAsset] = useState<Omit<IPAsset, 'id' | 'documents'>>({
    type: 'trademark',
    name: '',
    description: '',
    filingDate: new Date().toISOString().split('T')[0],
    status: 'Planned',
    notes: ''
  });
  
  const [analysisText, setAnalysisText] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  React.useEffect(() => {
    localStorage.setItem('ipAssets', JSON.stringify(myIpAssets));
  }, [myIpAssets]);
  
  React.useEffect(() => {
    localStorage.setItem('geminiApiKey', apiKey);
  }, [apiKey]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Search Query Required",
        description: "Please enter a search term",
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (searchType === 'trademark') {
        setSearchResults(mockTrademarkResults.filter(result => 
          result.name.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      } else if (searchType === 'patent') {
        setSearchResults(mockPatentResults.filter(result => 
          result.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          result.description.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      } else {
        setSearchResults([]);
      }
      
      toast({
        title: "Search Complete",
        description: `Found ${searchResults.length} results for "${searchQuery}"`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "Unable to complete the search. Please try again later.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const saveApiKey = () => {
    localStorage.setItem('geminiApiKey', apiKey);
    setIsApiKeyDialogOpen(false);
    
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved for future use",
    });
  };

  const addToPortfolio = (result: SearchResult) => {
    const newIpAsset: IPAsset = {
      id: Date.now().toString(),
      type: result.type,
      name: result.name,
      description: result.description,
      filingDate: new Date().toISOString().split('T')[0],
      status: 'Monitoring',
      notes: `Added from ${result.type} search. Original owner: ${result.owner}`,
      documents: []
    };
    
    setMyIpAssets([...myIpAssets, newIpAsset]);
    
    toast({
      title: "Added to Portfolio",
      description: `"${result.name}" has been added to your IP portfolio`,
    });
  };

  const addNewAsset = () => {
    if (!newAsset.name.trim()) {
      toast({
        variant: "destructive",
        title: "Name Required",
        description: "Please enter a name for your IP asset",
      });
      return;
    }
    
    const asset: IPAsset = {
      id: Date.now().toString(),
      ...newAsset,
      documents: []
    };
    
    setMyIpAssets([...myIpAssets, asset]);
    setIsAssetDialogOpen(false);
    
    setNewAsset({
      type: 'trademark',
      name: '',
      description: '',
      filingDate: new Date().toISOString().split('T')[0],
      status: 'Planned',
      notes: ''
    });
    
    toast({
      title: "Asset Added",
      description: `"${asset.name}" has been added to your IP portfolio`,
    });
  };

  const updateAsset = () => {
    if (!selectedAsset) return;
    
    setMyIpAssets(
      myIpAssets.map(asset => 
        asset.id === selectedAsset.id ? selectedAsset : asset
      )
    );
    
    setIsAssetDialogOpen(false);
    setSelectedAsset(null);
    
    toast({
      title: "Asset Updated",
      description: `"${selectedAsset.name}" has been updated in your IP portfolio`,
    });
  };

  const deleteAsset = (id: string) => {
    setMyIpAssets(myIpAssets.filter(asset => asset.id !== id));
    
    toast({
      title: "Asset Deleted",
      description: "The IP asset has been removed from your portfolio",
    });
  };

  const analyzeIPRisk = async () => {
    if (!analysisText.trim()) {
      toast({
        variant: "destructive",
        title: "Text Required",
        description: "Please enter text to analyze for IP risks",
      });
      return;
    }
    
    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: "Please set your Gemini API key to use the analysis feature",
      });
      setIsApiKeyDialogOpen(true);
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const prompt = `You are an intellectual property analysis expert. Analyze the following text for potential IP risks such as trademark issues, copyright concerns, or patent infringements. Provide a detailed assessment of potential legal risks and recommendations for risk mitigation.

Text to analyze:
${analysisText}

Please structure your response with these sections:
1. Summary of Identified IP Risks
2. Trademark Concerns
3. Copyright Issues
4. Patent Considerations
5. Risk Mitigation Recommendations`;
      
      const result = await getGeminiResponse(prompt, apiKey);
      setAnalysisResult(result);
      
      toast({
        title: "Analysis Complete",
        description: "IP risk analysis has been generated",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to complete the analysis",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addDocumentToAsset = (assetId: string) => {
    const asset = myIpAssets.find(a => a.id === assetId);
    if (!asset) return;
    
    const newDocument = {
      id: Date.now().toString(),
      name: `Document ${asset.documents.length + 1}`,
      type: 'Application',
      date: new Date().toISOString().split('T')[0]
    };
    
    const updatedAsset = {
      ...asset,
      documents: [...asset.documents, newDocument]
    };
    
    setMyIpAssets(
      myIpAssets.map(a => a.id === assetId ? updatedAsset : a)
    );
    
    toast({
      title: "Document Added",
      description: `Document has been added to "${asset.name}"`,
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'registered':
      case 'granted':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'filed':
      case 'monitoring':
        return 'bg-blue-100 text-blue-800';
      case 'abandoned':
      case 'expired':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'planned':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIPTypeIcon = (type: 'trademark' | 'patent' | 'copyright') => {
    switch (type) {
      case 'trademark':
        return <Hash className="h-5 w-5" />;
      case 'patent':
        return <Database className="h-5 w-5" />;
      case 'copyright':
        return <Copyright className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="search">
            <Search className="mr-2 h-4 w-4" />
            IP Search
          </TabsTrigger>
          <TabsTrigger value="portfolio">
            <Shield className="mr-2 h-4 w-4" />
            IP Portfolio
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <FileText className="mr-2 h-4 w-4" />
            IP Risk Analysis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Intellectual Property Databases</CardTitle>
              <CardDescription>
                Search for trademarks, patents, or copyrights to check availability and monitor competitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex space-x-4 mb-4">
                  <Select
                    value={searchType}
                    onValueChange={(value: 'trademark' | 'patent' | 'copyright') => {
                      setSearchType(value);
                      setSearchResults([]);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Search type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trademark">
                        <div className="flex items-center">
                          <Hash className="mr-2 h-4 w-4" />
                          Trademark
                        </div>
                      </SelectItem>
                      <SelectItem value="patent">
                        <div className="flex items-center">
                          <Database className="mr-2 h-4 w-4" />
                          Patent
                        </div>
                      </SelectItem>
                      <SelectItem value="copyright">
                        <div className="flex items-center">
                          <Copyright className="mr-2 h-4 w-4" />
                          Copyright
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex-1 flex space-x-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Enter ${searchType} search terms...`}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={isSearching}>
                      {isSearching ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                </div>
                
                {searchType === 'trademark' && (
                  <div className="text-sm text-gray-500 mb-4">
                    Search for trademarks by name, owner, or description. Results will show registration status and similarity scores.
                  </div>
                )}
                
                {searchType === 'patent' && (
                  <div className="text-sm text-gray-500 mb-4">
                    Search for patents by title, inventor, owner, or abstract. Results will include filing status and relevant details.
                  </div>
                )}
                
                {searchType === 'copyright' && (
                  <div className="text-sm text-gray-500 mb-4">
                    Search for registered copyrights by title, author, or owner. Note that many copyrighted works may not be registered.
                  </div>
                )}
                
                {searchResults.length > 0 ? (
                  <div className="border rounded-md divide-y">
                    {searchResults.map((result) => (
                      <div key={result.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-1">
                              {result.type === 'trademark' && <Hash className="mr-2 h-4 w-4 text-blue-600" />}
                              {result.type === 'patent' && <Database className="mr-2 h-4 w-4 text-blue-600" />}
                              {result.type === 'copyright' && <Copyright className="mr-2 h-4 w-4 text-blue-600" />}
                              <h3 className="font-medium">{result.name}</h3>
                              
                              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusBadgeColor(result.status)}`}>
                                {result.status}
                              </span>
                            </div>
                            
                            <p className="text-sm mb-2">{result.description}</p>
                            
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>Owner: {result.owner}</div>
                              <div>Filed: {result.filingDate}</div>
                              {result.registrationDate && <div>Registered: {result.registrationDate}</div>}
                              {result.similarityScore !== undefined && (
                                <div className="flex items-center mt-2">
                                  <span>Similarity: </span>
                                  <div className="w-24 h-2 bg-gray-200 rounded-full ml-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        result.similarityScore > 0.7 ? 'bg-red-500' : 
                                        result.similarityScore > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                                      }`} 
                                      style={{ width: `${result.similarityScore * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 font-medium">
                                    {Math.round(result.similarityScore * 100)}%
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addToPortfolio(result)}
                          >
                            <Bookmark className="mr-2 h-4 w-4" />
                            Add to Portfolio
                          </Button>
                        </div>
                        
                        {result.similarityScore !== undefined && result.similarityScore > 0.7 && (
                          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md flex items-start">
                            <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                            <span className="text-sm text-red-700">
                              High similarity detected. This may present significant legal risks if used.
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  searchQuery && !isSearching ? (
                    <div className="text-center p-8 text-gray-500">
                      No results found for "{searchQuery}". Try different search terms.
                    </div>
                  ) : !isSearching && (
                    <div className="text-center p-8 text-gray-500">
                      Enter a search term to find intellectual property records.
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Intellectual Property Portfolio</span>
                <Button onClick={() => {
                  setSelectedAsset(null);
                  setIsAssetDialogOpen(true);
                  setNewAsset({
                    type: 'trademark',
                    name: '',
                    description: '',
                    filingDate: new Date().toISOString().split('T')[0],
                    status: 'Planned',
                    notes: ''
                  });
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add IP Asset
                </Button>
              </CardTitle>
              <CardDescription>
                Manage your intellectual property assets and track their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myIpAssets.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>You haven't added any IP assets to your portfolio yet.</p>
                  <p className="text-sm mt-2">
                    Search for existing IP or add your own to start tracking.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myIpAssets.map((asset) => (
                    <Card key={asset.id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            {getIPTypeIcon(asset.type)}
                            <div className="ml-3">
                              <h3 className="font-medium text-lg">{asset.name}</h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeColor(asset.status)}`}>
                                  {asset.status}
                                </span>
                                <span className="mx-2">•</span>
                                <span>Filing Date: {asset.filingDate}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setSelectedAsset(asset);
                                setIsAssetDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => deleteAsset(asset.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm mt-3">{asset.description}</p>
                        
                        {asset.notes && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
                            <p className="font-medium mb-1">Notes:</p>
                            <p>{asset.notes}</p>
                          </div>
                        )}
                        
                        {asset.documents.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Documents</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {asset.documents.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                  <div className="flex items-center">
                                    <FileText className="h-4 w-4 text-blue-500 mr-2" />
                                    <div>
                                      <p className="text-sm font-medium">{doc.name}</p>
                                      <p className="text-xs text-gray-500">{doc.type} • {doc.date}</p>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addDocumentToAsset(asset.id)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Document
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>IP Risk Analysis</CardTitle>
              <CardDescription>
                Analyze product names, marketing materials, or invention descriptions for potential IP risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="api-key" className="text-sm font-medium">
                    Gemini API Key:
                  </Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsApiKeyDialogOpen(true)}
                  >
                    {apiKey ? 'Change API Key' : 'Set API Key'}
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor="analysis-text" className="text-sm font-medium mb-2 block">
                    Text to Analyze
                  </Label>
                  <Textarea
                    id="analysis-text"
                    placeholder="Enter product name, description, or marketing copy to analyze for potential IP issues..."
                    className="min-h-[200px]"
                    value={analysisText}
                    onChange={(e) => setAnalysisText(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    For best results, include detailed information about your product, service, or content.
                  </p>
                </div>
                
                <Button 
                  onClick={analyzeIPRisk} 
                  disabled={isAnalyzing || !analysisText.trim()}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing IP Risks...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Analyze IP Risks
                    </>
                  )}
                </Button>
                
                {analysisResult && (
                  <Card className="mt-4 border-blue-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">IP Risk Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <div dangerouslySetInnerHTML={{ 
                          __html: analysisResult.replace(/\n/g, '<br>') 
                        }} />
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          This analysis is provided for informational purposes only and should not be considered legal advice. 
                          Consult with a qualified intellectual property attorney for specific legal guidance.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Gemini API Key</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="gemini-api-key" className="mb-2 block">
              Enter your Gemini API Key
            </Label>
            <Input
              id="gemini-api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Key"
              className="mb-2"
            />
            <p className="text-xs text-gray-500">
              Your API key is stored locally and is used only for IP risk analysis within this tool.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApiKeyDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveApiKey} disabled={!apiKey.trim()}>Save API Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAssetDialogOpen} onOpenChange={setIsAssetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAsset ? 'Edit IP Asset' : 'Add New IP Asset'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ip-type">IP Type</Label>
                <Select
                  value={selectedAsset ? selectedAsset.type : newAsset.type}
                  onValueChange={(value: 'trademark' | 'patent' | 'copyright') => {
                    if (selectedAsset) {
                      setSelectedAsset({...selectedAsset, type: value});
                    } else {
                      setNewAsset({...newAsset, type: value});
                    }
                  }}
                >
                  <SelectTrigger id="ip-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trademark">Trademark</SelectItem>
                    <SelectItem value="patent">Patent</SelectItem>
                    <SelectItem value="copyright">Copyright</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ip-status">Status</Label>
                <Select
                  value={selectedAsset ? selectedAsset.status : newAsset.status}
                  onValueChange={(value) => {
                    if (selectedAsset) {
                      setSelectedAsset({...selectedAsset, status: value});
                    } else {
                      setNewAsset({...newAsset, status: value});
                    }
                  }}
                >
                  <SelectTrigger id="ip-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="Filed">Filed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Registered">Registered</SelectItem>
                    <SelectItem value="Granted">Granted</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Monitoring">Monitoring</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="ip-name">Name</Label>
              <Input
                id="ip-name"
                value={selectedAsset ? selectedAsset.name : newAsset.name}
                onChange={(e) => {
                  if (selectedAsset) {
                    setSelectedAsset({...selectedAsset, name: e.target.value});
                  } else {
                    setNewAsset({...newAsset, name: e.target.value});
                  }
                }}
                placeholder="IP Asset Name"
              />
            </div>
            
            <div>
              <Label htmlFor="ip-description">Description</Label>
              <Textarea
                id="ip-description"
                value={selectedAsset ? selectedAsset.description : newAsset.description}
                onChange={(e) => {
                  if (selectedAsset) {
                    setSelectedAsset({...selectedAsset, description: e.target.value});
                  } else {
                    setNewAsset({...newAsset, description: e.target.value});
                  }
                }}
                placeholder="Describe the intellectual property"
              />
            </div>
            
            <div>
              <Label htmlFor="ip-filing-date">Filing Date</Label>
              <Input
                id="ip-filing-date"
                type="date"
                value={selectedAsset ? selectedAsset.filingDate : newAsset.filingDate}
                onChange={(e) => {
                  if (selectedAsset) {
                    setSelectedAsset({...selectedAsset, filingDate: e.target.value});
                  } else {
                    setNewAsset({...newAsset, filingDate: e.target.value});
                  }
                }}
              />
            </div>
            
            <div>
              <Label htmlFor="ip-notes">Notes</Label>
              <Textarea
                id="ip-notes"
                value={selectedAsset ? selectedAsset.notes : newAsset.notes}
                onChange={(e) => {
                  if (selectedAsset) {
                    setSelectedAsset({...selectedAsset, notes: e.target.value});
                  } else {
                    setNewAsset({...newAsset, notes: e.target.value});
                  }
                }}
                placeholder="Additional notes about this IP asset"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssetDialogOpen(false)}>Cancel</Button>
            <Button onClick={selectedAsset ? updateAsset : addNewAsset}>
              {selectedAsset ? 'Update Asset' : 'Add Asset'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IPProtectionTool;
