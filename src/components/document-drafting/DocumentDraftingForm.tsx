import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Eye, Share2, Wand2, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateAIAnalysis } from '@/utils/aiAnalysis';
import ShareButton from '../ShareButton';
import TextPreview from '../TextPreview';

interface DocumentDraftingFormProps {
  onDocumentGenerated: (document: string) => void;
}

const DocumentDraftingForm: React.FC<DocumentDraftingFormProps> = ({ onDocumentGenerated }) => {
  const [documentType, setDocumentType] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [documentDescription, setDocumentDescription] = useState<string>('');
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isTextCopied, setIsTextCopied] = useState<boolean>(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const documentTypes = [
    "Affidavit",
    "Legal Notice",
    "Contract Agreement",
    "Power of Attorney",
    "Will and Testament",
    "Partnership Deed",
    "Lease Agreement",
    "Sale Deed",
    "Memorandum of Understanding",
    "Complaint",
    "Petition"
  ];

  const handleGenerateDocument = async () => {
    if (!documentType || !documentTitle || !documentDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before generating the document.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = `Generate a ${documentType} titled "${documentTitle}" with the following description: ${documentDescription}. Ensure the document is legally sound, well-structured, and includes all necessary clauses and sections.`;
      const aiResponse = await generateAIAnalysis(prompt, documentTitle);
      setGeneratedDocument(aiResponse);
      onDocumentGenerated(aiResponse);
      toast({
        title: "Document Generated",
        description: "The document has been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeDocument = async () => {
    if (!generatedDocument.trim()) {
      toast({
        title: "No Document to Analyze",
        description: "Please generate a document before analyzing it.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const analysis = await generateAIAnalysis(generatedDocument, documentTitle);
      setAnalysisResults(analysis);
      toast({
        title: "Analysis Complete",
        description: "The document has been analyzed successfully.",
      });
    } catch (error) {
      console.error("Error analyzing document:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadDocument = () => {
    if (!generatedDocument.trim()) {
      toast({
        title: "No Document to Download",
        description: "Please generate a document before downloading it.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([generatedDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle || 'legal-document'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    if (!generatedDocument.trim()) {
      toast({
        title: "No Document to Copy",
        description: "Please generate a document before copying it.",
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard.writeText(generatedDocument)
      .then(() => {
        setIsTextCopied(true);
        toast({
          title: "Text Copied",
          description: "Document text copied to clipboard",
        });
        setTimeout(() => setIsTextCopied(false), 3000);
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
        toast({
          title: "Copy Failed",
          description: "Failed to copy document text to clipboard",
          variant: "destructive",
        });
      });
  };

  const handleShare = () => {
    if (!generatedDocument.trim()) {
      toast({
        title: "No Document to Share",
        description: "Please generate a document before sharing it.",
        variant: "destructive",
      });
      return;
    }
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  return (
    <Card className="shadow-sm dark:shadow-zinc-800/10">
      <CardHeader>
        <CardTitle>Draft a Legal Document</CardTitle>
        <CardDescription>
          Generate a legal document by providing the type, title, and description.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="document-type">Document Type</Label>
          <Select onValueChange={setDocumentType}>
            <SelectTrigger id="document-type">
              <SelectValue placeholder="Select a document type" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="document-title">Document Title</Label>
          <Input
            id="document-title"
            placeholder="Enter the document title"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="document-description">Document Description</Label>
          <Textarea
            id="document-description"
            placeholder="Describe the document's purpose, key terms, and any specific details"
            value={documentDescription}
            onChange={(e) => setDocumentDescription(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <Button
          onClick={handleGenerateDocument}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <FileText className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Document
            </>
          )}
        </Button>
      </CardContent>

      {generatedDocument && (
        <div className="p-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Generated Document</CardTitle>
              <CardDescription>
                Review the generated document and perform further actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TextPreview text={generatedDocument} />
            </CardContent>
            <div className="flex justify-between items-center p-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleAnalyzeDocument}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Search className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Analyze Document
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="mr-2 h-4 w-4" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownloadDocument}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleCopyToClipboard} disabled={isTextCopied}>
                  <FileText className="mr-2 h-4 w-4" />
                  {isTextCopied ? 'Copied!' : 'Copy Text'}
                </Button>
                <ShareButton content={generatedDocument} />
              </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};

export default DocumentDraftingForm;
