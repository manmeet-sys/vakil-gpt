
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { extractTextFromPdf } from '@/utils/pdfExtraction';
import { Button } from '@/components/ui/button';
import { FileUp, Loader2, RefreshCw, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateOpenAIAnalysis } from '@/utils/aiAnalysis';
import PdfFileUpload from './PdfFileUpload';
import { useIsMobile } from '@/hooks/use-mobile';

export interface PdfAnalyzerProps {
  onAnalysisComplete?: (analysis: string) => void;
  iconOnly?: boolean;
}

const PdfAnalyzer: React.FC<PdfAnalyzerProps> = ({ onAnalysisComplete, iconOnly = false }) => {
  const [extractedText, setExtractedText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('text');
  const isMobile = useIsMobile();

  const handleTextExtracted = (text: string, fileName: string) => {
    setExtractedText(text);
    setFileName(fileName);
    setAnalysis('');
    if (onAnalysisComplete) {
      onAnalysisComplete(text);
    }
  };

  const analyzeWithOpenAI = async () => {
    if (!extractedText) {
      toast("No text to analyze. Please upload a PDF document first");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const prompt = `
        Analyze the following legal document text and provide a comprehensive summary.
        Include key points, parties involved, obligations, rights, important clauses, 
        potential legal issues, and any significant terms or conditions.
        
        Document text:
        ${extractedText.slice(0, 15000)}
      `;
      
      const result = await generateOpenAIAnalysis(prompt, "Legal Document Analysis");
      
      setAnalysis(result);
      setActiveTab('analysis');
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
      
      toast("Analysis complete. The document analysis is ready for review");
    } catch (error) {
      console.error('Error analyzing document:', error);
      toast("Analysis failed. There was a problem analyzing the document. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (iconOnly) {
    return (
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => {
          if (extractedText) {
            toast("Document already loaded. You can ask questions about it.");
          }
        }}
        className="relative"
      >
        <Upload className="h-4 w-4" />
        {extractedText && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
        )}
      </Button>
    );
  }

  return (
    <Card className="shadow-sm dark:bg-zinc-900/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">Indian Legal Document Analyzer</CardTitle>
        <CardDescription>
          Upload an Indian legal document in PDF format for AI-powered analysis based on Indian law
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!extractedText ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6">
            <PdfFileUpload onTextExtracted={handleTextExtracted} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-sm font-medium">
                  {fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {extractedText.length} characters extracted
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setExtractedText('');
                  setFileName('');
                  setAnalysis('');
                }}
                className="w-full sm:w-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Upload Different Document
              </Button>
            </div>
            
            <Button 
              onClick={analyzeWithOpenAI} 
              disabled={isAnalyzing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Document...
                </>
              ) : (
                <>
                  Analyze Document with AI
                </>
              )}
            </Button>
            
            {(extractedText || analysis) && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="text">Extracted Text</TabsTrigger>
                  <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="mt-4">
                  <div className="relative">
                    <div className="max-h-80 overflow-y-auto border rounded-md p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/50 text-xs sm:text-sm font-mono">
                      {extractedText.split('\n').map((line, i) => (
                        <p key={i} className="mb-1">
                          {line || <br />}
                        </p>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="analysis" className="mt-4">
                  {analysis ? (
                    <div className="max-h-80 overflow-y-auto border rounded-md p-3 sm:p-4 text-xs sm:text-sm">
                      {analysis.split('\n').map((line, i) => (
                        <p key={i} className="mb-2">
                          {line || <br />}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 sm:p-8 text-gray-500">
                      {isAnalyzing ? (
                        <p>Analyzing document...</p>
                      ) : (
                        <p>Click "Analyze Document" to get an AI-powered analysis</p>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PdfAnalyzer;
