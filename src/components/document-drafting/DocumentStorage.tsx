
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, FileText, Pencil, Trash, Save as SaveIcon } from 'lucide-react';
import { toast } from 'sonner';
import { TEMPLATE_CATEGORIES, DocumentTemplate } from '@/services/documentTemplates';
import { v4 as uuidv4 } from 'uuid';

interface DocumentStorageProps {
  currentDocument: {
    title: string;
    type: string;
    content: string;
  };
  onLoadDocument: (doc: SavedDocument) => void;
}

interface SavedDocument {
  id: string;
  title: string;
  type: string;
  content: string;
  category: string;
  dateCreated: string;
  dateModified: string;
  tags?: string[];
}

const DocumentStorage: React.FC<DocumentStorageProps> = ({ currentDocument, onLoadDocument }) => {
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  
  // Form state for saving
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentCategory, setDocumentCategory] = useState('');
  const [documentTags, setDocumentTags] = useState('');
  
  // Load saved documents
  useEffect(() => {
    const savedDocs = localStorage.getItem('savedLegalDocuments');
    if (savedDocs) {
      setSavedDocuments(JSON.parse(savedDocs));
    }
  }, []);
  
  // Pre-fill form when saving current document
  useEffect(() => {
    if (showSaveDialog && currentDocument) {
      setDocumentTitle(currentDocument.title || '');
      setDocumentType(currentDocument.type || '');
    }
  }, [showSaveDialog, currentDocument]);
  
  const handleSaveDocument = () => {
    if (!documentTitle) {
      toast.error('Please enter a document title');
      return;
    }
    
    if (!currentDocument.content) {
      toast.error('No document content to save');
      return;
    }
    
    const now = new Date().toISOString();
    const newDocument: SavedDocument = {
      id: uuidv4(),
      title: documentTitle,
      type: documentType,
      category: documentCategory,
      content: currentDocument.content,
      dateCreated: now,
      dateModified: now,
      tags: documentTags ? documentTags.split(',').map(tag => tag.trim()) : undefined
    };
    
    const updatedDocuments = [...savedDocuments, newDocument];
    setSavedDocuments(updatedDocuments);
    localStorage.setItem('savedLegalDocuments', JSON.stringify(updatedDocuments));
    
    toast.success('Document saved successfully');
    setShowSaveDialog(false);
    resetForm();
  };
  
  const handleLoadDocument = (doc: SavedDocument) => {
    onLoadDocument(doc);
    toast.success(`"${doc.title}" loaded successfully`);
    setShowManageDialog(false);
  };
  
  const handleDeleteDocument = (id: string) => {
    const updatedDocuments = savedDocuments.filter(doc => doc.id !== id);
    setSavedDocuments(updatedDocuments);
    localStorage.setItem('savedLegalDocuments', JSON.stringify(updatedDocuments));
    toast.success('Document deleted');
    setDocumentToDelete(null);
  };
  
  const resetForm = () => {
    setDocumentTitle('');
    setDocumentType('');
    setDocumentCategory('');
    setDocumentTags('');
  };

  return (
    <>
      {/* Save Button */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowSaveDialog(true)} 
        className="flex items-center gap-1"
      >
        <Save className="h-4 w-4" />
        Save
      </Button>
      
      {/* Library Button */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowManageDialog(true)} 
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" />
        My Documents
        {savedDocuments.length > 0 && (
          <Badge variant="secondary" className="ml-1">{savedDocuments.length}</Badge>
        )}
      </Button>
      
      {/* Save Document Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Document</DialogTitle>
            <DialogDescription>
              Save your current document for future use
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Enter document title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Document Type</Label>
                <Input
                  id="type"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  placeholder="Agreement, Pleading, etc."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={documentCategory} onValueChange={setDocumentCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TEMPLATE_CATEGORIES).map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={documentTags}
                onChange={(e) => setDocumentTags(e.target.value)}
                placeholder="case123, client456, urgent"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDocument} className="flex items-center gap-1">
              <SaveIcon className="h-4 w-4" />
              Save Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Manage Saved Documents Dialog */}
      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>My Saved Documents</DialogTitle>
            <DialogDescription>
              Manage all your saved legal documents
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto py-2">
            {savedDocuments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>You don't have any saved documents yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between p-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-base mb-1">{doc.title}</h3>
                          <div className="flex gap-2 mb-2">
                            {doc.type && (
                              <Badge variant="secondary">{doc.type}</Badge>
                            )}
                            {doc.category && (
                              <Badge variant="outline">{doc.category}</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last modified: {new Date(doc.dateModified).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleLoadDocument(doc)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDocumentToDelete(doc.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManageDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Delete Dialog */}
      <Dialog 
        open={Boolean(documentToDelete)} 
        onOpenChange={(open) => !open && setDocumentToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDocumentToDelete(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => documentToDelete && handleDeleteDocument(documentToDelete)}
              className="flex items-center gap-1"
            >
              <Trash className="h-4 w-4" />
              Delete Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentStorage;
