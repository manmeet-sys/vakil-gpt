
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import OptimizedAppLayout from '@/components/OptimizedAppLayout';
import { FileText, FileCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import GeminiAnalyzer from '@/components/GeminiAnalyzer';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import PdfFileUpload from '@/components/PdfFileUpload';
import { Badge } from '@/components/ui/badge';

interface Summary {
  summary?: string;
  key_points?: string[];
  legal_concepts?: {
    concept: string;
    explanation: string;
  }[];
  recommendations?: string[];
  raw?: string;
}

const AILegalSummarizerPage: React.FC = () => {
  const [documentText, setDocumentText] = useState('');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [pdfText, setPdfText] = useState('');
  const [activeTab, setActiveTab] = useState<string>('paste');
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDocumentText(e.target.value);
  };
  
  const handlePdfTextExtracted = (text: string) => {
    setPdfText(text);
    setDocumentText(text);
    toast.success('PDF text extracted successfully');
  };
  
  const handleAnalysisComplete = (analysis: any) => {
    // Process the analysis result
    setSummary(analysis);
  };
  
  const handleClear = () => {
    setDocumentText('');
    setPdfText('');
    setSummary(null);
  };

  return (
    <OptimizedAppLayout>
      <Helmet>
        <title>AI Legal Summarizer | VakilGPT</title>
        <meta 
          name="description" 
          content="Summarize lengthy legal documents with AI to extract key information and insights" 
        />
      </Helmet>

      <ResponsiveContainer className="py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
              <FileText className="h-5 w-5 text-blue-700 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold">AI Legal Summarizer</h1>
            <Badge variant="outline" className="bg-blue-100/50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Beta</Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Quickly summarize lengthy legal documents with AI to extract key information, legal concepts, and actionable insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Input Document</CardTitle>
                </CardHeader>
                <CardContent className="pb-0">
                  <Tabs defaultValue="paste" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="paste">Paste Text</TabsTrigger>
                      <TabsTrigger value="pdf">Upload PDF</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="paste" className="mt-0">
                      <Label htmlFor="documentText" className="mb-2 block">Document Text</Label>
                      <Textarea 
                        id="documentText"
                        placeholder="Paste your legal document text here..."
                        className="min-h-[250px] mb-4" 
                        value={documentText}
                        onChange={handleTextChange}
                      />
                    </TabsContent>
                    
                    <TabsContent value="pdf" className="mt-0">
                      <div className="mb-4">
                        <PdfFileUpload onTextExtracted={handlePdfTextExtracted} />
                      </div>
                      
                      {pdfText && (
                        <div className="mb-4">
                          <Label htmlFor="extractedText" className="mb-2 block">Extracted Text</Label>
                          <Textarea 
                            id="extractedText" 
                            value={pdfText}
                            readOnly 
                            className="min-h-[150px]"
                          />
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
                
                <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleClear}
                    className="sm:w-auto w-full"
                  >
                    Clear
                  </Button>
                  
                  <div className="grow"></div>
                  
                  <Button 
                    disabled={!documentText.trim()}
                    className="sm:w-auto w-full"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Basic Summary
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* AI Analysis Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GeminiAnalyzer 
                documentText={documentText}
                analysisType="legal"
                onAnalysisComplete={handleAnalysisComplete}
                disableButton={!documentText.trim()}
              />
            </motion.div>
          </div>
          
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    Summary Results
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pb-6">
                  {summary ? (
                    <div className="space-y-4">
                      {summary.summary && (
                        <div className="space-y-2">
                          <h3 className="font-medium text-lg">Summary</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{summary.summary}</p>
                        </div>
                      )}
                      
                      {summary.key_points && summary.key_points.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="font-medium text-lg">Key Points</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {summary.key_points.map((point, index) => (
                              <li key={index} className="text-sm text-gray-600 dark:text-gray-300">{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {summary.legal_concepts && summary.legal_concepts.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="font-medium text-lg">Legal Concepts</h3>
                          <div className="space-y-2">
                            {summary.legal_concepts.map((concept, index) => (
                              <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                                <p className="font-medium text-sm">{concept.concept}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{concept.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {summary.recommendations && summary.recommendations.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="font-medium text-lg">Recommendations</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {summary.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-gray-600 dark:text-gray-300">{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {summary.raw && !summary.summary && (
                        <div className="space-y-2">
                          <h3 className="font-medium text-lg">Analysis</h3>
                          <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                            {summary.raw}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                      <h3 className="font-medium text-lg text-gray-400 dark:text-gray-500">No Summary Available</h3>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-xs mx-auto">
                        Enter your document text and run the analysis to generate a summary
                      </p>
                    </div>
                  )}
                </CardContent>
                
                {summary && (
                  <CardFooter className="pt-0 flex justify-center">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Download Summary
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </ResponsiveContainer>
    </OptimizedAppLayout>
  );
};

export default AILegalSummarizerPage;
