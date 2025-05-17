
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2, FileUp } from 'lucide-react';
import { toast } from 'sonner';
import { generateOpenAIAnalysis } from '@/utils/aiAnalysis';
import PdfFileUpload from './PdfFileUpload';

interface PdfAnalyzerProps {
  onAnalysisComplete: (analysis: string) => void;
  buttonLabel?: string;
  iconOnly?: boolean;
}

const PdfAnalyzer: React.FC<PdfAnalyzerProps> = ({ 
  onAnalysisComplete,
  buttonLabel = "PDF Analyzer",
  iconOnly = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pdfText, setPdfText] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handlePdfExtracted = (text: string, fileName: string) => {
    setPdfText(text);
    setPdfName(fileName);
  };
  
  const analyzePdf = async () => {
    if (!pdfText.trim()) {
      toast.error("Please upload a PDF file first");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const analysis = await generateOpenAIAnalysis(pdfText, pdfName);
      
      onAnalysisComplete(analysis);
      setIsOpen(false);
      setPdfText('');
      setPdfName('');
      
      toast.success("PDF analysis complete");
    } catch (error) {
      console.error("Error analyzing PDF:", error);
      toast.error("Failed to analyze PDF. Please try a different file or try again later.");
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
          className="text-xs flex items-center gap-1 h-8"
        >
          <FileUp className="h-3.5 w-3.5" />
          {!iconOnly && <span>{buttonLabel}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>PDF Analyzer</DialogTitle>
          <DialogDescription>
            Upload a PDF document to extract and analyze its content with AI.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Upload PDF Document</Label>
            <PdfFileUpload 
              onTextExtracted={handlePdfExtracted} 
            />
            {pdfName && (
              <p className="text-sm mt-2 flex items-center">
                <FileUp className="h-4 w-4 mr-2" />
                {pdfName}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Upload your legal document, contract, or any PDF for AI-powered analysis.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            onClick={analyzePdf}
            disabled={isAnalyzing || !pdfText.trim()}
            className="w-full sm:w-auto"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze PDF"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PdfAnalyzer;
