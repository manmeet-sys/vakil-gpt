import React, { useState } from 'react';
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import OpenAIFlashAnalyzer from '@/components/OpenAIFlashAnalyzer';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';

const AILegalSummarizerPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [legalText, setLegalText] = useState('');
  const [summaryType, setSummaryType] = useState('comprehensive');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [activeTab, setActiveTab] = useState('input');

  const summaryTypes = [
    { value: 'comprehensive', label: 'Comprehensive Summary' },
    { value: 'brief', label: 'Brief Summary' },
    { value: 'key-points', label: 'Key Points Only' },
    { value: 'legal-analysis', label: 'Legal Analysis' },
    { value: 'simplified', label: 'Simplified (Non-Legal)' }
  ];

  const handleGenerateSummary = async () => {
    if (!legalText.trim()) {
      toast.error('Please enter legal text to summarize');
      return;
    }

    setIsGenerating(true);
    
    try {
      const selectedType = summaryTypes.find(t => t.value === summaryType)?.label || summaryType;
      
      const prompt = `You are an AI legal assistant specializing in Indian law. Please create a ${selectedType.toLowerCase()} of the following legal text, focusing on the key legal principles, implications, and important details. If the text references Indian laws, statutes, or cases, please highlight those specifically.

Legal text to summarize:
${legalText}

Please provide a well-structured summary that would be useful for a legal professional in India.`;

      const summary = await getOpenAIResponse(prompt);
      setGeneratedSummary(summary);
      setActiveTab('result');
      
      toast.success('Summary generated successfully');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSummary);
    toast.success('Summary copied to clipboard');
  };

  const handleReset = () => {
    setLegalText('');
    setGeneratedSummary('');
    setSummaryType('comprehensive');
    setActiveTab('input');
  };

  const handleFlashAnalysis = (analysis: string) => {
    setGeneratedSummary(analysis);
    setActiveTab('result');
    toast.success('Flash analysis complete');
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
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">AI Legal Summarizer</h1>
        </div>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex flex-col items-center py-6 px-4 overflow-auto">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Summarize Legal Documents with AI
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Our AI-powered system will analyze and summarize legal documents, focusing on Indian law
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="input">Input</TabsTrigger>
              <TabsTrigger value="result" disabled={!generatedSummary}>Result</TabsTrigger>
            </TabsList>
            
            <TabsContent value="input" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Legal Text Input
                      </CardTitle>
                      <CardDescription>
                        Enter the legal text you want to summarize
                      </CardDescription>
                    </div>
                    <OpenAIFlashAnalyzer onAnalysisComplete={handleFlashAnalysis} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="summary-type">Summary Type</Label>
                    <Select value={summaryType} onValueChange={setSummaryType}>
                      <SelectTrigger id="summary-type">
                        <SelectValue placeholder="Select summary type" />
                      </SelectTrigger>
                      <SelectContent>
                        {summaryTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="legal-text">Legal Text</Label>
                    <Textarea
                      id="legal-text"
                      placeholder="Paste your legal document, judgment, contract, or other legal text here..."
                      className="min-h-[300px] resize-y"
                      value={legalText}
                      onChange={(e) => setLegalText(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    onClick={handleGenerateSummary}
                    disabled={isGenerating || !legalText.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Summary
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="result" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    Generated Summary
                  </CardTitle>
                  <CardDescription>
                    AI-generated summary based on your legal text
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-zinc-800 rounded-md p-4 border border-gray-200 dark:border-zinc-700 min-h-[300px] whitespace-pre-wrap">
                    {generatedSummary}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleReset}>
                    New Summary
                  </Button>
                  <Button onClick={handleCopy}>
                    Copy to Clipboard
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                <p>This summary is generated by AI and should be reviewed by a legal professional.</p>
                <p>It may not capture all nuances of the original legal text.</p>
              </div>
            </TabsContent>
          </Tabs>
          
          <Separator className="my-8" />
          
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>This tool is designed to assist legal professionals in India.</p>
            <p>For any questions or feedback, please contact our support team.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AILegalSummarizerPage;
