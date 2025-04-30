
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Loader2, InfoIcon, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';
import { getGeminiResponse } from './GeminiProIntegration';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LegalAnalysisGeneratorProps {
  apiProvider: 'gemini' | 'deepseek';
  onAnalysisComplete: (analysis: string) => void;
  buttonLabel?: string;
  iconOnly?: boolean;
}

const LegalAnalysisGenerator: React.FC<LegalAnalysisGeneratorProps> = ({ 
  apiProvider, 
  onAnalysisComplete,
  buttonLabel = "Legal Analysis",
  iconOnly = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [analysisType, setAnalysisType] = useState('legal-brief');
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('regular');
  
  const analysisOptions = [
    { value: 'legal-brief', label: 'Legal Brief Generation', description: 'Creates a structured legal brief with citations from Indian courts' },
    { value: 'contract-analysis', label: 'Contract Analysis', description: 'Reviews contract terms for risks and compliance with Indian law' },
    { value: 'case-precedent', label: 'Case Precedent Research', description: 'Finds relevant Supreme Court and High Court judgments' },
    { value: 'compliance-check', label: 'Compliance Check', description: 'Identifies regulatory issues under Indian laws' },
    { value: 'risk-assessment', label: 'Legal Risk Assessment', description: 'Evaluates potential legal risks and suggests mitigation' },
    { value: 'document-summary', label: 'Document Summary', description: 'Creates a concise summary of legal documents' }
  ];

  const practiceAreaOptions = [
    { value: 'criminal', label: 'Criminal Law', analysisType: 'legal-brief' },
    { value: 'civil', label: 'Civil Litigation', analysisType: 'legal-brief' },
    { value: 'corporate', label: 'Corporate Law', analysisType: 'contract-analysis' },
    { value: 'family', label: 'Family Law', analysisType: 'case-precedent' },
    { value: 'property', label: 'Property Law', analysisType: 'compliance-check' },
    { value: 'ipr', label: 'Intellectual Property', analysisType: 'risk-assessment' }
  ];

  const getPromptTemplate = (type: string, content: string): string => {
    const templates: Record<string, string> = {
      'legal-brief': `Generate a comprehensive legal brief based on the following information, focusing on relevant Indian law. Include Supreme Court and High Court citations, and structured arguments according to Indian legal practice:\n\n${content}`,
      'contract-analysis': `Analyze this contract text from an Indian legal perspective and identify key clauses, potential risks, obligations, and suggested modifications according to Indian contract law:\n\n${content}`,
      'case-precedent': `Research and identify relevant Indian case precedents related to this legal issue. Include case names, citations from Supreme Court and High Courts, and brief summaries of their relevance:\n\n${content}`,
      'compliance-check': `Perform a compliance check on this text to identify potential regulatory issues, focusing on applicable Indian laws and regulations:\n\n${content}`,
      'risk-assessment': `Conduct a legal risk assessment based on this information in the context of Indian law. Identify potential legal risks, their likelihood, potential impact, and mitigation strategies:\n\n${content}`,
      'document-summary': `Provide a comprehensive yet concise summary of this Indian legal document, highlighting key points, implications, and important considerations under Indian law:\n\n${content}`
    };
    
    return templates[type] || templates['document-summary'];
  };

  const getPracticeAreaPrompt = (area: string, content: string): string => {
    const areaPrompts: Record<string, string> = {
      'criminal': `Generate a criminal law analysis for an Indian advocate focused on the Bharatiya Nyaya Sanhita, 2023 and relevant criminal procedure. Include appropriate Supreme Court precedents where applicable:\n\n${content}`,
      'civil': `Generate a civil litigation analysis under the Code of Civil Procedure, highlighting relevant limitation periods, court jurisdiction in India, and key precedent cases from Indian High Courts:\n\n${content}`,
      'corporate': `Analyze this corporate law matter under the Companies Act, 2013 and other relevant Indian corporate regulations. Identify key compliance requirements and potential liability issues:\n\n${content}`,
      'family': `Provide a family law analysis based on applicable personal laws in India, including relevant provisions from the Hindu Marriage Act, Special Marriage Act, or Muslim personal law as appropriate:\n\n${content}`,
      'property': `Analyze this property law matter under the Transfer of Property Act, relevant state laws, and address registration requirements under Indian law:\n\n${content}`,
      'ipr': `Provide an intellectual property analysis under Indian IP laws, including the Patents Act, Copyright Act, and Trademarks Act, with reference to recent Indian judgments in IP disputes:\n\n${content}`
    };
    
    return areaPrompts[area] || `Generate a comprehensive legal analysis for an Indian advocate based on the following information:\n\n${content}`;
  };

  const generateAnalysis = async () => {
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter some text to analyze",
      });
      return;
    }

    setIsGenerating(true);

    try {
      let prompt;
      
      if (activeTab === 'regular') {
        prompt = getPromptTemplate(analysisType, text);
      } else {
        const selectedArea = activeTab;
        prompt = getPracticeAreaPrompt(selectedArea, text);
      }
      
      const analysis = await getGeminiResponse(prompt);
      
      onAnalysisComplete(analysis);
      setIsOpen(false);
      setText('');
      
      toast({
        title: "Analysis Complete",
        description: activeTab === 'regular' 
          ? `${analysisOptions.find(opt => opt.value === analysisType)?.label} has been generated successfully`
          : `${practiceAreaOptions.find(area => area.value === activeTab)?.label} analysis has been generated successfully`,
      });
    } catch (error) {
      console.error(`Error generating analysis:`, error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to generate analysis",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // If practice area is selected, set the corresponding default analysis type
    if (value !== 'regular') {
      const practiceArea = practiceAreaOptions.find(area => area.value === value);
      if (practiceArea) {
        setAnalysisType(practiceArea.analysisType);
      }
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
      <DialogContent className="sm:max-w-[650px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle>Indian Legal Analysis Generator</DialogTitle>
          <DialogDescription>
            Generate legal analysis tailored to Indian law, with citations from Indian courts
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-2">
          <TabsList className="grid grid-cols-7 gap-1">
            <TabsTrigger value="regular" className="col-span-1">
              General
            </TabsTrigger>
            {practiceAreaOptions.map((area) => (
              <TabsTrigger key={area.value} value={area.value} className="col-span-1 text-xs">
                {area.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="regular">
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="analysis-type" className="text-sm font-medium">
                    Analysis Type
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Help</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Select the type of legal analysis you need. Each option is tailored for specific Indian legal requirements.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select value={analysisType} onValueChange={setAnalysisType}>
                  <SelectTrigger id="analysis-type" className="w-full">
                    <SelectValue placeholder="Select analysis type" />
                  </SelectTrigger>
                  <SelectContent>
                    {analysisOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="text-input" className="text-sm font-medium">
                    Text to Analyze
                  </label>
                </div>
                <Textarea 
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter the text you want to analyze for Indian legal context..."
                  className="min-h-[200px]"
                />
              </div>
            </div>
          </TabsContent>
          
          {practiceAreaOptions.map((area) => (
            <TabsContent key={area.value} value={area.value}>
              <Card className="border-blue-100 dark:border-blue-900/30 p-4 mb-4">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  {area.label} Analysis
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  This analysis will be tailored specifically for Indian {area.label.toLowerCase()} practitioners, 
                  with relevant statutes, regulations, and case law.
                </p>
              </Card>
              <div className="space-y-2">
                <label htmlFor={`${area.value}-text-input`} className="text-sm font-medium">
                  Case/Document Details
                </label>
                <Textarea 
                  id={`${area.value}-text-input`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Enter details for ${area.label.toLowerCase()} analysis...`}
                  className="min-h-[200px]"
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <DialogFooter>
          <Button 
            onClick={generateAnalysis} 
            disabled={isGenerating || !text.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Analysis"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LegalAnalysisGenerator;
