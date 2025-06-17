
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Save, Download, Copy, Eye, EyeOff, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DocumentDraftingFormProps {
  onDocumentGenerated: (content: string) => void;
  initialContent?: string;
}

const DocumentDraftingForm: React.FC<DocumentDraftingFormProps> = ({ 
  onDocumentGenerated,
  initialContent = ''
}) => {
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentContent, setDocumentContent] = useState(initialContent);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  // Update content when initialContent changes
  useEffect(() => {
    if (initialContent) {
      setDocumentContent(initialContent);
      setActiveTab('editor');
    }
  }, [initialContent]);

  const documentTypes = [
    { value: 'affidavit', label: 'Affidavit' },
    { value: 'contract', label: 'Contract Agreement' },
    { value: 'legal-notice', label: 'Legal Notice' },
    { value: 'petition', label: 'Petition' },
    { value: 'mou', label: 'Memorandum of Understanding' },
    { value: 'will', label: 'Will & Testament' },
    { value: 'power-of-attorney', label: 'Power of Attorney' },
    { value: 'rental-agreement', label: 'Rental Agreement' },
    { value: 'other', label: 'Other Document' }
  ];

  const handleSaveDocument = () => {
    if (!documentTitle.trim()) {
      toast.error('Please enter a document title');
      return;
    }
    
    if (!documentContent.trim()) {
      toast.error('Please enter document content');
      return;
    }

    // Save to localStorage for persistence
    const savedDocs = JSON.parse(localStorage.getItem('savedDocuments') || '[]');
    const newDoc = {
      id: Date.now().toString(),
      title: documentTitle,
      type: documentType,
      content: documentContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    savedDocs.push(newDoc);
    localStorage.setItem('savedDocuments', JSON.stringify(savedDocs));
    
    onDocumentGenerated(documentContent);
    toast.success('Document saved successfully');
  };

  const handleDownload = () => {
    if (!documentContent.trim()) {
      toast.error('No content to download');
      return;
    }

    const blob = new Blob([documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle || 'document'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Document downloaded successfully');
  };

  const handleCopyToClipboard = async () => {
    if (!documentContent.trim()) {
      toast.error('No content to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(documentContent);
      toast.success('Document copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Information */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-blue-600" />
            Document Information
          </CardTitle>
          <CardDescription>
            Enter basic information about your document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Enter document title..."
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="type" className="h-11">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Editor */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wand2 className="h-5 w-5 text-purple-600" />
                Document Editor
              </CardTitle>
              <CardDescription>
                Create and edit your legal document content
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center gap-1"
              >
                {isPreviewMode ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Edit
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Preview
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor">
              <div className="space-y-4">
                <Textarea
                  value={documentContent}
                  onChange={(e) => setDocumentContent(e.target.value)}
                  placeholder="Enter your document content here..."
                  className="min-h-[400px] resize-none font-mono text-sm leading-relaxed"
                />
                <div className="text-xs text-muted-foreground">
                  {documentContent.length} characters, {documentContent.split('\n').length} lines
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="min-h-[400px] p-4 bg-white dark:bg-gray-900 border rounded-lg">
                {documentContent ? (
                  <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                    {documentContent}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-20">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your document preview will appear here</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <motion.div 
        className="flex flex-wrap gap-3 justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          variant="outline"
          onClick={handleCopyToClipboard}
          disabled={!documentContent.trim()}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy to Clipboard
        </Button>
        <Button
          variant="outline"
          onClick={handleDownload}
          disabled={!documentContent.trim()}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button
          onClick={handleSaveDocument}
          disabled={!documentTitle.trim() || !documentContent.trim()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4" />
          Save Document
        </Button>
      </motion.div>
    </div>
  );
};

export default DocumentDraftingForm;
