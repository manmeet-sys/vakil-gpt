
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import ContractDraftingForm from '@/components/document-drafting/ContractDraftingForm';
import DocumentPreview from '@/components/document-drafting/DocumentPreview';
import { Download } from 'lucide-react';
import { generateOpenAIAnalysis } from '@/utils/aiAnalysis';

const ContractDraftingPage = () => {
  const { toast } = useToast();
  const [documentContent, setDocumentContent] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('');

  // Function to get AI response for document generation
  const getOpenAIResponse = async (prompt: string, context: string) => {
    try {
      return await generateOpenAIAnalysis(prompt, context);
    } catch (error) {
      console.error('Error generating document:', error);
      toast({
        title: "Generation Error",
        description: "Failed to generate document. Please try again.",
        variant: "destructive"
      });
      return '';
    }
  };

  const handleGenerateDocument = (content: string, title: string, type: string) => {
    setDocumentContent(content);
    setDocumentTitle(title);
    setDocumentType(type);
  };

  const handleCopyDocument = () => {
    navigator.clipboard.writeText(documentContent);
    toast({
      title: "Copied",
      description: "Document content copied to clipboard",
    });
  };

  const handleDownloadDocument = () => {
    const blob = new Blob([documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle || 'contract'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded",
      description: "Document downloaded successfully",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold text-center mb-8">Indian Legal Contract Drafting Tool</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContractDraftingForm onGenerate={handleGenerateDocument} />
        <DocumentPreview
          title={documentTitle}
          type={documentType}
          content={documentContent}
          onCopy={handleCopyDocument}
          onDownload={handleDownloadDocument}
        />
      </div>
    </div>
  );
};

export default ContractDraftingPage;
