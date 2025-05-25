
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Loader2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { getOpenAIResponse } from './OpenAIIntegration';
import { extractTextFromPDF } from '@/utils/pdfExtraction';

interface PdfAnalyzerProps {
  onAnalysisComplete: (analysis: string) => void;
  buttonLabel?: string;
  iconOnly?: boolean;
}

const PdfAnalyzer: React.FC<PdfAnalyzerProps> = ({ 
  onAnalysisComplete,
  buttonLabel = "PDF Analysis",
  iconOnly = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select a PDF file",
      });
      return;
    }

    setSelectedFile(file);
    
    try {
      const text = await extractTextFromPDF(file);
      setExtractedText(text);
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      toast({
        variant: "destructive",
        title: "Extraction Failed",
        description: "Failed to extract text from PDF",
      });
    }
  };

  const analyzePDF = async () => {
    if (!extractedText.trim()) {
      toast({
        variant: "destructive",
        title: "No Content",
        description: "No text content found in the PDF",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const prompt = `Analyze this legal document from an Indian law perspective. Provide a comprehensive analysis including:
      1. Document type and purpose
      2. Key legal provisions under Indian law
      3. Potential issues or risks
      4. Recommendations for Indian legal practice
      
      Document content: ${extractedText}`;

      const analysis = await getOpenAIResponse(prompt);
      
      onAnalysisComplete(analysis);
      setIsOpen(false);
      setSelectedFile(null);
      setExtractedText('');
      
      toast({
        title: "Analysis Complete",
        description: "PDF has been analyzed successfully",
      });
    } catch (error) {
      console.error('Error analyzing PDF:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze PDF",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`text-xs flex items-center gap-1 ${iconOnly ? 'px-2 h-8 min-w-8' : ''}`}
        >
          <FileText className="h-3 w-3" />
          {!iconOnly && <span>{buttonLabel}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>PDF Legal Document Analyzer</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
              disabled={isAnalyzing}
            >
              <Upload className="mr-2 h-4 w-4" />
              Select PDF File
            </Button>
            
            {selectedFile && (
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Selected: {selectedFile.name}
                </AlertDescription>
              </Alert>
            )}
            
            {extractedText && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Text extracted successfully. Click analyze to proceed.
                </p>
                <Button
                  onClick={analyzePDF}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Document"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfAnalyzer;
