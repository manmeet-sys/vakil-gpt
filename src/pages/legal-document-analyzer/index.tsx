
import React, { useState } from 'react';
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PdfAnalyzer from '@/components/PdfAnalyzer';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const LegalDocumentAnalyzerPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [apiProvider, setApiProvider] = useState<'deepseek' | 'gemini'>('gemini');
  
  // Load API key on component mount
  React.useEffect(() => {
    const storedApiProvider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
    setApiProvider(storedApiProvider);
    const storedApiKey = localStorage.getItem(`${storedApiProvider}ApiKey`) || '';
    setApiKey(storedApiKey);
  }, []);
  
  const handleAnalysisComplete = (analysis: string) => {
    setAnalysisResult(analysis);
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
      <header className="border-b border-gray-200 dark:border-zinc-700/50 py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')} 
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Legal Document Analyzer</h1>
        </div>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex flex-col items-center py-6 px-4 overflow-hidden">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Upload and analyze legal documents with AI
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Our AI-powered system will analyze your legal documents and provide comprehensive insights based on Indian law
            </p>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Document Analysis Tool</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Upload your legal document in PDF format and our AI will analyze its content, extracting key information and providing legal insights.
            </p>
            
            <div className="flex justify-center mb-6">
              <PdfAnalyzer 
                apiKey={apiKey}
                apiProvider={apiProvider}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </div>
          </div>
          
          {analysisResult && (
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Analysis Results</h3>
              <Textarea 
                value={analysisResult}
                readOnly
                className="h-96 resize-none bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
              />
              
              <div className="mt-4 flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(analysisResult);
                    toast({
                      title: "Copied",
                      description: "Analysis copied to clipboard",
                    });
                  }}
                >
                  Copy to Clipboard
                </Button>
                <Button
                  onClick={() => setAnalysisResult('')}
                  variant="destructive"
                >
                  Clear Results
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LegalDocumentAnalyzerPage;
