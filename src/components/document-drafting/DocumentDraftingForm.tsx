
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface DocumentDraftingFormProps {
  onDraftGenerated: (title: string, type: string, content: string) => void;
  initialValues?: {
    title?: string;
    type?: string;
    content?: string;
  };
}

const DocumentDraftingForm: React.FC<DocumentDraftingFormProps> = ({ 
  onDraftGenerated,
  initialValues
}) => {
  const [documentTitle, setDocumentTitle] = useState(initialValues?.title || '');
  const [documentType, setDocumentType] = useState(initialValues?.type || '');
  const [documentContent, setDocumentContent] = useState(initialValues?.content || '');
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    type?: string;
    content?: string;
  }>({});
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);

  const documentTypes = [
    { id: 'agreement', name: 'Agreement' },
    { id: 'affidavit', name: 'Affidavit' },
    { id: 'legal_notice', name: 'Legal Notice' },
    { id: 'petition', name: 'Petition' },
    { id: 'application', name: 'Application' },
    { id: 'contract', name: 'Contract' },
    { id: 'letter', name: 'Legal Letter' },
    { id: 'poa', name: 'Power of Attorney' },
    { id: 'will', name: 'Will / Testament' },
    { id: 'deed', name: 'Deed' },
    { id: 'mou', name: 'MOU' },
    { id: 'undertaking', name: 'Undertaking' },
    { id: 'declaration', name: 'Declaration' },
    { id: 'complaint', name: 'Complaint' },
    { id: 'motion', name: 'Motion' },
    { id: 'custom', name: 'Custom Document' }
  ];

  // Auto-save functionality
  useEffect(() => {
    const hasContent = documentTitle || documentType || documentContent;
    
    if (hasContent) {
      const autoSaveTimer = setTimeout(() => {
        try {
          setAutoSaveStatus('saving');
          localStorage.setItem('draftDocument', JSON.stringify({
            title: documentTitle,
            type: documentType,
            content: documentContent,
            timestamp: new Date().toISOString()
          }));
          
          setTimeout(() => {
            setAutoSaveStatus('saved');
            // Reset the status after a while
            setTimeout(() => {
              setAutoSaveStatus(null);
            }, 3000);
          }, 500);
        } catch (err) {
          console.error('Failed to auto-save document', err);
          setAutoSaveStatus('error');
        }
      }, 2000);
      
      return () => clearTimeout(autoSaveTimer);
    }
  }, [documentTitle, documentType, documentContent]);

  // Load any auto-saved content when component mounts
  useEffect(() => {
    if (!initialValues?.content) {
      try {
        const savedContent = localStorage.getItem('draftDocument');
        if (savedContent) {
          const parsed = JSON.parse(savedContent);
          
          // Only load if there's no initial content
          if (!documentContent && !documentTitle && !documentType) {
            setDocumentTitle(parsed.title || '');
            setDocumentType(parsed.type || '');
            setDocumentContent(parsed.content || '');
            toast.info('Loaded auto-saved draft');
          }
        }
      } catch (err) {
        console.error('Failed to load auto-saved document', err);
      }
    }
  }, [initialValues, documentContent, documentTitle, documentType]);

  const validateForm = () => {
    const errors: {
      title?: string;
      type?: string;
      content?: string;
    } = {};
    
    if (!documentTitle.trim()) {
      errors.title = 'Document title is required';
    }
    
    if (!documentType) {
      errors.type = 'Document type is required';
    }
    
    if (!documentContent.trim()) {
      errors.content = 'Document content is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onDraftGenerated(documentTitle, documentType, documentContent);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear the form? This will remove all content.')) {
      setDocumentTitle('');
      setDocumentType('');
      setDocumentContent('');
      setFormErrors({});
      localStorage.removeItem('draftDocument');
      toast.info('Form cleared');
    }
  };

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-500" />
          Document Editor
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-title">Document Title</Label>
            <Input
              id="document-title"
              placeholder="Enter document title"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className={formErrors.title ? "border-red-500" : ""}
            />
            {formErrors.title && (
              <p className="text-red-500 text-xs">{formErrors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select 
              value={documentType} 
              onValueChange={setDocumentType}
            >
              <SelectTrigger 
                id="document-type"
                className={formErrors.type ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.type && (
              <p className="text-red-500 text-xs">{formErrors.type}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="document-content">Document Content</Label>
              {autoSaveStatus && (
                <div className="flex items-center text-xs">
                  {autoSaveStatus === 'saving' && (
                    <>
                      <Clock className="h-3 w-3 mr-1 text-amber-500" />
                      <span className="text-amber-500">Auto-saving...</span>
                    </>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-green-500">Auto-saved</span>
                    </>
                  )}
                  {autoSaveStatus === 'error' && (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                      <span className="text-red-500">Failed to save</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <Textarea
              id="document-content"
              placeholder="Enter document content here..."
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)}
              className={`min-h-[300px] ${formErrors.content ? "border-red-500" : ""}`}
            />
            {formErrors.content && (
              <p className="text-red-500 text-xs">{formErrors.content}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClearForm}
          >
            Clear Form
          </Button>
          <Button type="submit">
            Generate Document
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DocumentDraftingForm;
