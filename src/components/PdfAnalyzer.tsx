
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PdfFileUpload from './PdfFileUpload';
import TextPreview from './TextPreview';
import { extractTextFromPdf } from '@/utils/pdfExtraction';
import { generateGeminiAnalysis, generateDeepSeekAnalysis } from '@/utils/aiAnalysis';

interface PdfAnalyzerProps {
  apiProvider: 'deepseek' | 'gemini';
  onAnalysisComplete: (analysis: string) => void;
}

const PdfAnalyzer: React.FC<PdfAnalyzerProps> = ({ 
  apiProvider,
  onAnalysisComplete 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzePdf = async () => {
    if (!pdfFile) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please upload a PDF file first",
      });
      return;
    }

    setIsLoading(true);

    try {
      const text = await extractTextFromPdf(pdfFile);
      setExtractedText(text);

      let analysis = '';
      
      if (apiProvider === 'gemini') {
        analysis = await generateGeminiAnalysis(text, pdfFile.name);
      } else if (apiProvider === 'deepseek') {
        analysis = await generateDeepSeekAnalysis(text, pdfFile.name);
      }

      onAnalysisComplete(analysis);
      setIsOpen(false);
      setPdfFile(null);
      setExtractedText('');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast({
        title: "Analysis Complete",
        description: "Legal document analysis has been generated successfully",
      });
    } catch (error) {
      console.error(`Error analyzing PDF:`, error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze PDF document",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs flex items-center gap-1"
        >
          <FileText className="h-3 w-3" />
          PDF Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle>Analyze Legal Document</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload a PDF document for detailed legal analysis based on Indian law.
          </p>
          
          <PdfFileUpload onChange={setPdfFile} pdfFile={pdfFile} />
          
          <Button 
            onClick={analyzePdf} 
            disabled={isLoading || !pdfFile}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Document...
              </>
            ) : (
              'Analyze Document'
            )}
          </Button>
          
          {extractedText && isLoading && (
            <TextPreview text={extractedText} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfAnalyzer;
