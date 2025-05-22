
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileUp, Upload, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { getGeminiResponse } from './GeminiProIntegration';

interface PdfAnalyzerProps {
  apiProvider: 'gemini' | 'deepseek';
  onAnalysisComplete: (analysis: string) => void;
  buttonLabel?: string;
  iconOnly?: boolean;
}

const PdfAnalyzer: React.FC<PdfAnalyzerProps> = ({ 
  apiProvider, 
  onAnalysisComplete,
  buttonLabel = "PDF Analysis",
  iconOnly = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileText, setFileText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          variant: "destructive",
          title: "Invalid file format",
          description: "Please upload a PDF file",
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
        });
        return;
      }
      
      setSelectedFile(file);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setFileText("Sample extracted text from PDF document. In real implementation, this would be the actual content extracted from the PDF file.");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleAnalyze = async () => {
    if (!fileText) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No text to analyze",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const prompt = `Analyze this Indian legal document and provide a comprehensive analysis focusing on key legal points, relevant statutes, case laws, and implications:\n\n${fileText}`;
      const analysis = await getGeminiResponse(prompt);
      
      onAnalysisComplete(analysis);
      setIsOpen(false);
      setSelectedFile(null);
      setFileText('');
      setUploadProgress(0);
      
      toast({
        title: "PDF Analysis Complete",
        description: "The legal document has been successfully analyzed",
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
          <FileUp className="h-3 w-3" />
          {!iconOnly && <span>{buttonLabel}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle>PDF Document Analyzer</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!selectedFile ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="pdf-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm font-medium mb-1">Click to upload a PDF</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF (Max 10MB)
                </p>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileUp className="h-4 w-4 text-blue-accent" />
                  <span className="text-sm font-medium truncate max-w-[250px]">
                    {selectedFile.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setFileText('');
                    setUploadProgress(0);
                  }}
                >
                  Remove
                </Button>
              </div>
              
              {uploadProgress < 100 ? (
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-blue-accent h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              ) : (
                <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {fileText}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !fileText}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PdfAnalyzer;
