
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { FileUp, Book, Globe, Database, Landmark, Gavel, Search, Plus } from 'lucide-react';
import { generateOpenAIAnalysis, fetchIndianLegalUpdates, subscribeToLegalUpdates } from '@/utils/aiAnalysis';

// Define types for knowledge items
interface KnowledgeItem {
  id: string;
  title: string;
  content?: string;
  url?: string;
  type: 'document' | 'text' | 'url' | 'precedent' | 'legislation';
  tags?: string[];
  dateAdded: string;
  userId?: string;
}

// Mock data for demonstration purposes
const legalKnowledgeSuggestions = [
  { title: "Indian Contract Act, 1872", type: "legislation" },
  { title: "Code of Civil Procedure, 1908", type: "legislation" },
  { title: "Indian Penal Code, 1860", type: "legislation" },
  { title: "The Companies Act, 2013", type: "legislation" },
  { title: "M.C. Mehta v. Union of India", type: "precedent" },
  { title: "Kesavananda Bharati v. State of Kerala", type: "precedent" },
  { title: "Vishaka v. State of Rajasthan", type: "precedent" },
  { title: "ADM Jabalpur v. Shivkant Shukla", type: "precedent" },
];

const KnowledgeManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('add');
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addType, setAddType] = useState<string>('text');
  
  // Form states
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [suggestionFilter, setSuggestionFilter] = useState<string>('all');
  const [legalUpdates, setLegalUpdates] = useState<string>('Loading legal updates...');

  // Load knowledge items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('precedentAI-knowledge');
    if (savedItems) {
      setKnowledgeItems(JSON.parse(savedItems));
    }
    
    // Fetch legal updates
    fetchLegalUpdates();
  }, []);
  
  const fetchLegalUpdates = async () => {
    try {
      const updates = await fetchIndianLegalUpdates();
      setLegalUpdates(updates);
    } catch (error) {
      console.error('Failed to fetch legal updates:', error);
      setLegalUpdates('Could not load legal updates. Please try again later.');
    }
  };
  
  // Subscribe to legal updates
  const handleSubscribeToUpdates = async (email: string, area: string) => {
    try {
      const result = await subscribeToLegalUpdates(area, email);
      toast.success('Subscription successful', {
        description: result
      });
    } catch (error) {
      toast.error('Subscription failed', {
        description: 'Could not subscribe to legal updates'
      });
    }
  };

  // Filter knowledge items based on search query and type
  const filteredItems = knowledgeItems.filter((item) => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Filter suggestions based on suggestionFilter
  const filteredSuggestions = legalKnowledgeSuggestions.filter((suggestion) => {
    return suggestionFilter === 'all' || suggestion.type === suggestionFilter;
  });

  // Add a new knowledge item
  const handleAddItem = () => {
    if (!title) {
      toast.error('Title is required');
      return;
    }
    
    if (addType === 'url' && !url) {
      toast.error('URL is required');
      return;
    }
    
    if (addType === 'text' && !content) {
      toast.error('Content is required');
      return;
    }
    
    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      title,
      type: addType as any,
      dateAdded: new Date().toISOString(),
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    };
    
    if (addType === 'text') {
      newItem.content = content;
    }
    
    if (addType === 'url') {
      newItem.url = url;
    }
    
    const updatedItems = [...knowledgeItems, newItem];
    setKnowledgeItems(updatedItems);
    localStorage.setItem('precedentAI-knowledge', JSON.stringify(updatedItems));
    
    // Reset form
    setTitle('');
    setContent('');
    setUrl('');
    setTags('');
    
    toast.success('Knowledge item added successfully');
    
    // Switch to browse tab
    setActiveTab('browse');
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: any) => {
    setTitle(suggestion.title);
    setAddType(suggestion.type);
  };

  // Delete a knowledge item
  const handleDeleteItem = (id: string) => {
    const updatedItems = knowledgeItems.filter(item => item.id !== id);
    setKnowledgeItems(updatedItems);
    localStorage.setItem('precedentAI-knowledge', JSON.stringify(updatedItems));
    
    toast.success('Knowledge item deleted successfully');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-500" />
          Knowledge Base Manager
        </CardTitle>
        <CardDescription>
          Add, organize, and browse your legal knowledge repository
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="add">
              <Plus className="h-4 w-4 mr-1" />
              Add Knowledge
            </TabsTrigger>
            <TabsTrigger value="browse">
              <Search className="h-4 w-4 mr-1" />
              Browse Knowledge
            </TabsTrigger>
            <TabsTrigger value="updates">
              <Book className="h-4 w-4 mr-1" />
              Legal Updates
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="add">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Knowledge Type</label>
                <Select value={addType} onValueChange={setAddType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Note</SelectItem>
                    <SelectItem value="url">URL / Web Resource</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="precedent">Case Law / Precedent</SelectItem>
                    <SelectItem value="legislation">Legislation / Statute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input 
                  placeholder="Enter a title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              {addType === 'text' && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Content</label>
                  <Textarea 
                    placeholder="Enter your notes or content" 
                    value={content}
                    onChange={(e) => setContent(e.target.value)} 
                    rows={6}
                  />
                </div>
              )}
              
              {addType === 'url' && (
                <div>
                  <label className="text-sm font-medium mb-1 block">URL</label>
                  <Input 
                    placeholder="https://example.com" 
                    type="url" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)} 
                  />
                </div>
              )}
              
              {addType === 'document' && (
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <FileUp className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-medium mb-1">Drag & drop a document here</p>
                  <p className="text-xs text-gray-500">or click to select a file</p>
                  <p className="text-xs text-gray-500 mt-4">(Document upload is not yet implemented)</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium mb-1 block">Tags (comma separated)</label>
                <Input 
                  placeholder="contract, civil, property, etc." 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)} 
                />
              </div>
              
              <Button onClick={handleAddItem} className="w-full">
                Add to Knowledge Base
              </Button>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Recommended Knowledge</h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <Select value={suggestionFilter} onValueChange={setSuggestionFilter}>
                    <SelectTrigger className="h-8 text-xs w-[180px]">
                      <SelectValue placeholder="Filter suggestions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="legislation">Legislation</SelectItem>
                      <SelectItem value="precedent">Case Law</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredSuggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between border rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center gap-2">
                        {suggestion.type === 'legislation' ? (
                          <Landmark className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Gavel className="h-4 w-4 text-amber-500" />
                        )}
                        <span className="text-sm">{suggestion.title}</span>
                      </div>
                      <Badge variant={suggestion.type === 'legislation' ? "outline" : "secondary"} className="text-xs">
                        {suggestion.type === 'legislation' ? 'Statute' : 'Case'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="browse">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search knowledge base..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {filteredItems.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <span>{new Date(item.dateAdded).toLocaleDateString()}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.type === 'text' ? 'Note' : 
                               item.type === 'url' ? 'URL' : 
                               item.type === 'document' ? 'Document' :
                               item.type === 'precedent' ? 'Case Law' : 'Legislation'}
                            </Badge>
                          </div>
                          
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.tags.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {item.content && (
                            <div className="mt-2 text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded-md max-h-20 overflow-y-auto">
                              {item.content}
                            </div>
                          )}
                          
                          {item.url && (
                            <div className="mt-2">
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center"
                              >
                                <Globe className="h-3 w-3 mr-1" />
                                {item.url.length > 40 ? item.url.slice(0, 40) + '...' : item.url}
                              </a>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                          className="h-7 w-7 text-gray-500 hover:text-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No knowledge items found</p>
                  <Button variant="secondary" size="sm" className="mt-4" onClick={() => setActiveTab('add')}>
                    <Plus className="h-4 w-4 mr-1" /> 
                    Add Knowledge
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="updates">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Legal Updates</CardTitle>
                  <CardDescription>
                    Latest developments in Indian law and jurisprudence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-80 overflow-y-auto">
                    {legalUpdates === 'Loading legal updates...' ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin h-8 w-8 border-t-2 border-blue-500 rounded-full" />
                      </div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: legalUpdates.replace(/\n/g, '<br />') }} />
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" onClick={fetchLegalUpdates} className="w-full">
                    Refresh Updates
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Subscribe to Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Practice Area</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select practice area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corporate">Corporate Law</SelectItem>
                          <SelectItem value="criminal">Criminal Law</SelectItem>
                          <SelectItem value="tax">Tax Law</SelectItem>
                          <SelectItem value="ip">Intellectual Property</SelectItem>
                          <SelectItem value="real-estate">Real Estate Law</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <Input placeholder="your-email@example.com" type="email" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" className="w-full">Subscribe</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default KnowledgeManager;
