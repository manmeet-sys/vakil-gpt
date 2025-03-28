
import React, { useState, useEffect } from 'react';
import { Plus, File, Globe, Trash2, AlertCircle } from 'lucide-react';
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

// Define types for our knowledge items
interface KnowledgeItem {
  id: string;
  type: 'document' | 'url' | 'text';
  title: string;
  content: string;
  source?: string;
  dateAdded: string;
  size?: string;
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
  }, []);

  // Save knowledge items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('precedentAI-knowledge', JSON.stringify(knowledgeItems));
  }, [knowledgeItems]);

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

  return (
    <div className="flex flex-col space-y-6 p-6 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Knowledge Base</h2>
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
          Add documents, URLs, or text to enhance PrecedentAI's knowledge base. This information will be used to provide more accurate and relevant responses.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="document" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="document">Upload Document</TabsTrigger>
          <TabsTrigger value="url">Add URL</TabsTrigger>
          <TabsTrigger value="text">Add Text</TabsTrigger>
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
      </Tabs>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Knowledge Items ({knowledgeItems.length})</h3>
        
        {knowledgeItems.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 dark:bg-zinc-800/20 rounded-md">
            <p className="text-gray-500 dark:text-gray-400">
              No knowledge items added yet. Upload documents, add URLs, or enter text to enhance PrecedentAI.
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
                  {item.type === 'document' && <File className="h-6 w-6 text-blue-500" />}
                  {item.type === 'url' && <Globe className="h-6 w-6 text-green-500" />}
                  {item.type === 'text' && <File className="h-6 w-6 text-purple-500" />}
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
                      {item.type === 'document' ? 'Document' : item.type === 'url' ? 'URL' : 'Text'}
                    </Badge>
                    
                    {item.source && (
                      <Badge variant="outline" className="text-xs text-blue-500 dark:text-blue-400">
                        {item.type === 'url' ? new URL(item.source).hostname : item.source}
                      </Badge>
                    )}
                    
                    {item.size && (
                      <Badge variant="outline" className="text-xs">
                        {item.size}
                      </Badge>
                    )}
                  </div>
                  
                  {item.type === 'text' && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {item.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
