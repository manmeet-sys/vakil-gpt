import React, { useState, useEffect } from 'react';
import { Plus, File, Globe, Trash2, AlertCircle, Gavel, LibraryBig, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchIndianLegalUpdates, subscribeToLegalUpdates } from '@/utils/aiAnalysis';

// Define types for our knowledge items
interface KnowledgeItem {
  id: string;
  type: 'document' | 'url' | 'text' | 'precedent' | 'legislation';
  title: string;
  content: string;
  source?: string;
  dateAdded: string;
  size?: string;
  citation?: string;
  court?: string;
  statuteType?: string;
  effectiveDate?: string;
  jurisdiction?: string;
  tags?: string[];
}

interface StatuteUpdate {
  id: number;
  name: string;
  date: string;
  description: string;
  type: string;
}

interface PrecedentUpdate {
  id: number;
  case: string;
  court: string;
  date: string;
  summary: string;
  impact: string;
}

interface LegalUpdates {
  statutes: StatuteUpdate[];
  precedents: PrecedentUpdate[];
}

const KnowledgeManager: React.FC = () => {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [documentTitle, setDocumentTitle] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('document');
  const [legalUpdates, setLegalUpdates] = useState<LegalUpdates | null>(null);
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(false);
  const [selectedUpdates, setSelectedUpdates] = useState<Array<{id: number, name: string}>>([]);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  // Precedent specific states
  const [precedentTitle, setPrecedentTitle] = useState('');
  const [precedentCitation, setPrecedentCitation] = useState('');
  const [precedentCourt, setPrecedentCourt] = useState('');
  const [precedentContent, setPrecedentContent] = useState('');
  
  // Legislation specific states
  const [legislationTitle, setLegislationTitle] = useState('');
  const [legislationType, setLegislationType] = useState('');
  const [legislationDate, setLegislationDate] = useState('');
  const [legislationJurisdiction, setLegislationJurisdiction] = useState('');
  const [legislationContent, setLegislationContent] = useState('');

  // Load knowledge items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('precedentAI-knowledge');
    if (savedItems) {
      try {
        setKnowledgeItems(JSON.parse(savedItems));
      } catch (e) {
        console.error('Failed to parse saved knowledge items:', e);
      }
    }
    
    // Load legal updates when component mounts
    loadLegalUpdates();
  }, []);

  // Save knowledge items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('precedentAI-knowledge', JSON.stringify(knowledgeItems));
  }, [knowledgeItems]);

  const loadLegalUpdates = async () => {
    setIsLoadingUpdates(true);
    try {
      const updates = await fetchIndianLegalUpdates();
      setLegalUpdates(updates);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch legal updates. Please try again later.",
      });
    } finally {
      setIsLoadingUpdates(false);
    }
  };

  const handleSubscribe = async () => {
    if (!subscriberEmail) {
      toast({
        variant: "destructive",
        title: "Missing email",
        description: "Please enter your email address",
      });
      return;
    }
    
    if (selectedUpdates.length === 0) {
      toast({
        variant: "destructive",
        title: "No updates selected",
        description: "Please select at least one update to subscribe to",
      });
      return;
    }
    
    setIsSubscribing(true);
    try {
      const result = await subscribeToLegalUpdates(selectedUpdates, subscriberEmail);
      toast({
        title: "Subscription successful",
        description: result,
      });
      setSelectedUpdates([]);
      setSubscriberEmail('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to subscribe to updates. Please try again later.",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleUpdateSelection = (update: StatuteUpdate | PrecedentUpdate, isSelected: boolean) => {
    if (isSelected) {
      setSelectedUpdates(prev => [...prev, { id: update.id, name: 'name' in update ? update.name : update.case }]);
    } else {
      setSelectedUpdates(prev => prev.filter(item => item.id !== update.id));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only accept PDF, DOCX, and TXT files
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file",
      });
      return;
    }

    // Set a default title based on the file name if no title is provided
    if (!documentTitle) {
      setDocumentTitle(file.name.split('.')[0]);
    }

    setIsUploading(true);
    
    // Simulate file processing with a progress bar
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          processFile(file);
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      }
    }, 100);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      // For demo purposes, we'll just store the first 1000 characters
      // In a real application, you would process the full content
      const content = result.substring(0, 1000);
      
      const newItem: KnowledgeItem = {
        id: Date.now().toString(),
        type: 'document',
        title: documentTitle || file.name,
        content: content,
        source: file.name,
        dateAdded: new Date().toISOString(),
        size: formatFileSize(file.size)
      };
      
      setKnowledgeItems(prev => [...prev, newItem]);
      setDocumentTitle('');
      
      toast({
        title: "Document added",
        description: `${file.name} has been added to your knowledge base`,
      });
    };
    
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to read the file",
      });
    };
    
    reader.readAsText(file);
  };

  const handleAddUrl = async () => {
    if (!urlInput) {
      toast({
        variant: "destructive",
        title: "Missing URL",
        description: "Please enter a URL",
      });
      return;
    }
    
    // Simple URL validation
    if (!urlInput.startsWith('http://') && !urlInput.startsWith('https://')) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real application, you would fetch the content from the URL
      // Here, we'll simulate it for demo purposes
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newItem: KnowledgeItem = {
              id: Date.now().toString(),
              type: 'url',
              title: urlTitle || new URL(urlInput).hostname,
              content: `Content from ${urlInput} would be fetched and processed here.`,
              source: urlInput,
              dateAdded: new Date().toISOString()
            };
            
            setKnowledgeItems(prev => [...prev, newItem]);
            setUrlInput('');
            setUrlTitle('');
            setIsUploading(false);
            setUploadProgress(0);
            
            toast({
              title: "URL added",
              description: "The URL has been added to your knowledge base",
            });
          }, 500);
        }
      }, 100);
    } catch (error) {
      setIsUploading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the URL",
      });
    }
  };

  const handleAddText = () => {
    if (!textContent) {
      toast({
        variant: "destructive",
        title: "Missing content",
        description: "Please enter some text content",
      });
      return;
    }
    
    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      type: 'text',
      title: textTitle || `Text ${knowledgeItems.filter(item => item.type === 'text').length + 1}`,
      content: textContent,
      dateAdded: new Date().toISOString()
    };
    
    setKnowledgeItems(prev => [...prev, newItem]);
    setTextContent('');
    setTextTitle('');
    
    toast({
      title: "Text added",
      description: "The text has been added to your knowledge base",
    });
  };

  const handleAddPrecedent = () => {
    if (!precedentTitle || !precedentContent) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide at least a title and content for the precedent",
      });
      return;
    }
    
    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      type: 'precedent',
      title: precedentTitle,
      content: precedentContent,
      citation: precedentCitation,
      court: precedentCourt,
      dateAdded: new Date().toISOString(),
    };
    
    setKnowledgeItems(prev => [...prev, newItem]);
    setPrecedentTitle('');
    setPrecedentCitation('');
    setPrecedentCourt('');
    setPrecedentContent('');
    
    toast({
      title: "Precedent added",
      description: `${precedentTitle} has been added to your knowledge base`,
    });
  };
  
  const handleAddLegislation = () => {
    if (!legislationTitle || !legislationContent) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide at least a title and content for the legislation",
      });
      return;
    }
    
    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      type: 'legislation',
      title: legislationTitle,
      content: legislationContent,
      statuteType: legislationType,
      effectiveDate: legislationDate,
      jurisdiction: legislationJurisdiction,
      dateAdded: new Date().toISOString(),
    };
    
    setKnowledgeItems(prev => [...prev, newItem]);
    setLegislationTitle('');
    setLegislationType('');
    setLegislationDate('');
    setLegislationJurisdiction('');
    setLegislationContent('');
    
    toast({
      title: "Legislation added",
      description: `${legislationTitle} has been added to your knowledge base`,
    });
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      setKnowledgeItems(prev => prev.filter(item => item.id !== itemToDelete));
      setShowDeleteDialog(false);
      setItemToDelete(null);
      
      toast({
        title: "Item deleted",
        description: "The item has been removed from your knowledge base",
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <File className="h-6 w-6 text-blue-500" />;
      case 'url': return <Globe className="h-6 w-6 text-green-500" />;
      case 'text': return <File className="h-6 w-6 text-purple-500" />;
      case 'precedent': return <Gavel className="h-6 w-6 text-amber-500" />;
      case 'legislation': return <BookOpen className="h-6 w-6 text-red-500" />;
      default: return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">VakilGPT Knowledge Base</h2>
        <Button 
          onClick={() => window.history.back()} 
          variant="outline"
        >
          Back to Chat
        </Button>
      </div>

      <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
        <AlertTitle>Knowledge Management</AlertTitle>
        <AlertDescription>
          Add documents, URLs, precedents, legislation or text to enhance VakilGPT's knowledge base. This information will be used to provide more accurate and relevant responses aligned with Indian law.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="document">Documents</TabsTrigger>
          <TabsTrigger value="url">URLs</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="precedent">Precedents</TabsTrigger>
          <TabsTrigger value="legislation">Legislation</TabsTrigger>
        </TabsList>

        <TabsContent value="document" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-title">Document Title (Optional)</Label>
            <Input
              id="document-title"
              placeholder="Enter a title for this document"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              disabled={isUploading}
            />
          </div>
          
          <div className="border-2 border-dashed rounded-md p-6 text-center">
            <Input
              id="document-upload"
              type="file"
              className="hidden"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Label 
              htmlFor="document-upload" 
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <File className="h-10 w-10 text-blue-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click to upload PDF, DOCX, or TXT files
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Maximum file size: 10MB
              </p>
            </Label>
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Processing document... {uploadProgress}%
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url-title">URL Title (Optional)</Label>
            <Input
              id="url-title"
              placeholder="Enter a title for this URL"
              value={urlTitle}
              onChange={(e) => setUrlTitle(e.target.value)}
              disabled={isUploading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url-input">URL</Label>
            <div className="flex space-x-2">
              <Input
                id="url-input"
                placeholder="https://example.com/article"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={isUploading}
              />
              <Button onClick={handleAddUrl} disabled={isUploading}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Processing URL... {uploadProgress}%
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text-title">Text Title (Optional)</Label>
            <Input
              id="text-title"
              placeholder="Enter a title for this text"
              value={textTitle}
              onChange={(e) => setTextTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="text-content">Text Content</Label>
            <Textarea
              id="text-content"
              placeholder="Enter legal text, case law, or other information..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows={6}
            />
          </div>
          
          <Button onClick={handleAddText}>
            <Plus className="h-4 w-4 mr-1" /> Add Text
          </Button>
        </TabsContent>
        
        <TabsContent value="precedent" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="precedent-title">Case Name/Title</Label>
            <Input
              id="precedent-title"
              placeholder="e.g., Kesavananda Bharati v. State of Kerala"
              value={precedentTitle}
              onChange={(e) => setPrecedentTitle(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precedent-citation">Citation</Label>
              <Input
                id="precedent-citation"
                placeholder="e.g., AIR 1973 SC 1461"
                value={precedentCitation}
                onChange={(e) => setPrecedentCitation(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="precedent-court">Court</Label>
              <Select value={precedentCourt} onValueChange={setPrecedentCourt}>
                <SelectTrigger id="precedent-court">
                  <SelectValue placeholder="Select court" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supreme-court">Supreme Court of India</SelectItem>
                  <SelectItem value="high-court">High Court</SelectItem>
                  <SelectItem value="district-court">District Court</SelectItem>
                  <SelectItem value="tribunals">Tribunals</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="precedent-content">Key Points & Holdings</Label>
            <Textarea
              id="precedent-content"
              placeholder="Enter key legal points, holdings, and significance of this precedent..."
              value={precedentContent}
              onChange={(e) => setPrecedentContent(e.target.value)}
              rows={6}
            />
          </div>
          
          <Button onClick={handleAddPrecedent}>
            <Plus className="h-4 w-4 mr-1" /> Add Precedent
          </Button>
        </TabsContent>
        
        <TabsContent value="legislation" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="legislation-title">Title</Label>
            <Input
              id="legislation-title"
              placeholder="e.g., The Bharatiya Nyaya Sanhita, 2023"
              value={legislationTitle}
              onChange={(e) => setLegislationTitle(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="legislation-type">Type</Label>
              <Select value={legislationType} onValueChange={setLegislationType}>
                <SelectTrigger id="legislation-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="act">Act</SelectItem>
                  <SelectItem value="rules">Rules</SelectItem>
                  <SelectItem value="regulations">Regulations</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="order">Order</SelectItem>
                  <SelectItem value="amendment">Amendment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="legislation-date">Effective Date</Label>
              <Input
                id="legislation-date"
                type="date"
                value={legislationDate}
                onChange={(e) => setLegislationDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="legislation-jurisdiction">Jurisdiction</Label>
              <Select value={legislationJurisdiction} onValueChange={setLegislationJurisdiction}>
                <SelectTrigger id="legislation-jurisdiction">
                  <SelectValue placeholder="Select jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="central">Central/Union</SelectItem>
                  <SelectItem value="state">State</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="legislation-content">Key Provisions</Label>
            <Textarea
              id="legislation-content"
              placeholder="Enter key provisions and significance of this legislation..."
              value={legislationContent}
              onChange={(e) => setLegislationContent(e.target.value)}
              rows={6}
            />
          </div>
          
          <Button onClick={handleAddLegislation}>
            <Plus className="h-4 w-4 mr-1" /> Add Legislation
          </Button>
        </TabsContent>
      </Tabs>
      
      <div className="mt-4">
        <Tabs defaultValue="knowledge-items" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="knowledge-items">My Knowledge Items</TabsTrigger>
            <TabsTrigger value="legal-updates">Legal Updates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="knowledge-items" className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Knowledge Items ({knowledgeItems.length})</h3>
            
            {knowledgeItems.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 dark:bg-zinc-800/20 rounded-md">
                <p className="text-gray-500 dark:text-gray-400">
                  No knowledge items added yet. Upload documents, add URLs, precedents, legislation or enter text to enhance VakilGPT.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {knowledgeItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-start p-4 rounded-md border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/20"
                  >
                    <div className="mr-4 mt-1">
                      {getTypeIcon(item.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white">{item.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Added on {formatDate(item.dateAdded)}
                          </p>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => confirmDelete(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.type === 'document' ? 'Document' : 
                           item.type === 'url' ? 'URL' : 
                           item.type === 'text' ? 'Text' :
                           item.type === 'precedent' ? 'Precedent' : 'Legislation'}
                        </Badge>
                        
                        {item.source && (
                          <Badge variant="outline" className="text-xs text-blue-500 dark:text-blue-400">
                            {item.type === 'url' ? new URL(item.source).hostname : item.source}
                          </Badge>
                        )}
                        
                        {item.citation && (
                          <Badge variant="outline" className="text-xs text-amber-500 dark:text-amber-400">
                            {item.citation}
                          </Badge>
                        )}
                        
                        {item.court && (
                          <Badge variant="outline" className="text-xs text-purple-500 dark:text-purple-400">
                            {item.court === 'supreme-court' ? 'Supreme Court' : 
                             item.court === 'high-court' ? 'High Court' : 
                             item.court === 'district-court' ? 'District Court' : 
                             item.court === 'tribunals' ? 'Tribunal' : 'Other Court'}
                          </Badge>
                        )}
                        
                        {item.statuteType && (
                          <Badge variant="outline" className="text-xs text-red-500 dark:text-red-400">
                            {item.statuteType === 'act' ? 'Act' : 
                             item.statuteType === 'rules' ? 'Rules' : 
                             item.statuteType === 'regulations' ? 'Regulations' : 
                             item.statuteType === 'notification' ? 'Notification' : 
                             item.statuteType === 'order' ? 'Order' : 'Amendment'}
                          </Badge>
                        )}
                        
                        {item.jurisdiction && (
                          <Badge variant="outline" className="text-xs text-green-500 dark:text-green-400">
                            {item.jurisdiction === 'central' ? 'Central' : 
                             item.jurisdiction === 'state' ? 'State' : 'Local'}
                          </Badge>
                        )}
                        
                        {item.size && (
                          <Badge variant="outline" className="text-xs">
                            {item.size}
                          </Badge>
                        )}
                      </div>
                      
                      {(item.type === 'text' || item.type === 'precedent' || item.type === 'legislation') && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {item.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="legal-updates" className="space-y-6">
            {isLoadingUpdates ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : legalUpdates ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-red-500" /> Recent Statutory Updates
                    </h3>
                    
                    {legalUpdates.statutes.map((statute) => (
                      <div 
                        key={statute.id}
                        className="p-4 rounded-md border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/20"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800 dark:text-white">{statute.name}</h4>
                          <input 
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            onChange={(e) => handleUpdateSelection(statute, e.target.checked)}
                            checked={selectedUpdates.some(item => item.id === statute.id)}
                          />
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{statute.type}</Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{statute.date}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{statute.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                      <Gavel className="mr-2 h-5 w-5 text-amber-500" /> Recent Case Law Developments
                    </h3>
                    
                    {legalUpdates.precedents.map((precedent) => (
                      <div 
                        key={precedent.id}
                        className="p-4 rounded-md border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/20"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800 dark:text-white">{precedent.case}</h4>
                          <input 
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            onChange={(e) => handleUpdateSelection(precedent, e.target.checked)}
                            checked={selectedUpdates.some(item => item.id === precedent.id)}
                          />
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{precedent.court}</Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{precedent.date}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{precedent.summary}</p>
                        <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">Impact: {precedent.impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4 mt-6">
                  <h3 className="text-base font-medium mb-3">Subscribe to Legal Updates</h3>
                  
                  <div className="flex flex-col md:flex-row gap-3">
                    <Input
                      placeholder="Your email address"
                      type="email"
                      value={subscriberEmail}
                      onChange={(e) => setSubscriberEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSubscribe} disabled={isSubscribing || selectedUpdates.length === 0}>
                      {isSubscribing ? "Subscribing..." : "Subscribe"}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Subscribe to receive notifications when selected legal updates are modified or new related updates are published.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Failed to load legal updates.</p>
                <Button variant="outline" className="mt-4" onClick={loadLegalUpdates}>
                  Try Again
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item from your knowledge base? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KnowledgeManager;
