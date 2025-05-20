
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, FileText } from 'lucide-react';
import PromptBasedGenerator from '@/components/document-drafting/PromptBasedGenerator';
import { performanceMonitor } from '@/utils/performance-monitoring';

const LegalDocumentDraftingPage = () => {
  const [documentContent, setDocumentContent] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentType, setDocumentType] = useState('');
  const { toast } = useToast();

  const handleDraftGenerated = (content: string, title?: string, type?: string) => {
    console.log("Document draft generated:", { title, type, contentLength: content?.length });
    performanceMonitor.measure('DocumentDrafting', 'updateState', () => {
      setDocumentContent(content);
      if (title) setDocumentTitle(title);
      if (type) setDocumentType(type);
      toast({
        title: "Success",
        description: "Document draft generated successfully!"
      });
    });
  };

  const handleCopyContent = () => {
    if (documentContent) {
      navigator.clipboard.writeText(documentContent);
      toast({
        title: "Copied",
        description: "Document content copied to clipboard!"
      });
    }
  };

  const handleDownloadDocument = () => {
    if (documentContent) {
      const element = document.createElement('a');
      const file = new Blob([documentContent], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${documentTitle || 'legal-document'}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast({
        title: "Downloaded",
        description: "Document downloaded successfully!"
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold text-center mb-8">
        Indian Legal Document Drafting
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <PromptBasedGenerator 
            title="Legal Document Generator"
            description="Create professional legal documents for Indian jurisdiction"
            placeholder="Describe the document you need, including purpose, parties involved, key terms, etc."
            onGenerate={(content) => handleDraftGenerated(content)}
          />
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span>{documentTitle || 'Document Preview'}</span>
                  </div>
                </CardTitle>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopyContent}
                    disabled={!documentContent}
                  >
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDownloadDocument}
                    disabled={!documentContent}
                  >
                    Download
                  </Button>
                </div>
              </div>
              {documentType && <p className="text-sm text-muted-foreground">{documentType}</p>}
            </CardHeader>
            <CardContent>
              {documentContent ? (
                <div className="bg-muted p-4 rounded-md whitespace-pre-wrap h-[500px] overflow-y-auto font-mono text-sm">
                  {documentContent}
                </div>
              ) : (
                <div className="bg-muted p-4 rounded-md h-[500px] flex items-center justify-center text-muted-foreground">
                  <p>Generated document will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <p className="text-center text-sm text-muted-foreground mt-6">
        AI-generated legal documents should be reviewed by a qualified legal professional before use.
      </p>
    </div>
  );
};

export default LegalDocumentDraftingPage;
