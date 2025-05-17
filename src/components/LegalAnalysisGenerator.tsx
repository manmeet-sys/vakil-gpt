
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { generateGeminiAnalysis, generateDeepSeekAnalysis } from '@/utils/aiAnalysis';

interface LegalAnalysisGeneratorProps {
  onAnalysisComplete: (analysis: string) => void;
  apiProvider?: 'gemini' | 'deepseek' | 'openai';
  buttonLabel?: string;
  iconOnly?: boolean;
}

const LegalAnalysisGenerator: React.FC<LegalAnalysisGeneratorProps> = ({ 
  onAnalysisComplete,
  apiProvider = 'openai',
  buttonLabel = "Legal Analysis Generator",
  iconOnly = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [analysisType, setAnalysisType] = useState('legal-brief');
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const analysisOptions = [
    { value: 'legal-brief', label: 'Legal Brief Generation' },
    { value: 'contract-analysis', label: 'Contract Analysis' },
    { value: 'case-precedent', label: 'Case Precedent Research' },
    { value: 'compliance-check', label: 'Compliance Check' },
    { value: 'risk-assessment', label: 'Legal Risk Assessment' },
    { value: 'document-summary', label: 'Document Summary' }
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

  const generateAnalysis = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = getPromptTemplate(analysisType, text);
      let analysis;
      
      if (apiProvider === 'gemini' || apiProvider === 'openai') {
        analysis = await generateGeminiAnalysis(text, `${analysisType}-document.txt`);
      } else {
        analysis = await generateDeepSeekAnalysis(text, `${analysisType}-document.txt`);
      }
      
      onAnalysisComplete(analysis);
      setIsOpen(false);
      setText('');
      
      toast.success(`${analysisOptions.find(opt => opt.value === analysisType)?.label} has been generated`);
    } catch (error) {
      console.error(`Error generating analysis:`, error);
      toast.error("Failed to generate analysis. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs flex items-center gap-1 h-8"
          onClick={() => setIsOpen(true)}
        >
          <FileText className="h-3.5 w-3.5" />
          {!iconOnly && <span>{buttonLabel}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Legal Analysis Generator</DialogTitle>
          <DialogDescription>
            Extract insights and generate legal analysis from text using AI.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="analysis-type">Analysis Type</Label>
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger id="analysis-type">
                <SelectValue placeholder="Select type of analysis" />
              </SelectTrigger>
              <SelectContent>
                {analysisOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the type of legal analysis you need for your Indian legal document.
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="analysis-text">Text for Analysis</Label>
            <Textarea
              id="analysis-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-48 resize-none"
              placeholder="Enter or paste the text you want to analyze..."
            />
            <p className="text-xs text-muted-foreground">
              Paste your legal text, case details, or document content for analysis.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            onClick={generateAnalysis}
            disabled={isGenerating || !text.trim()}
            className="w-full sm:w-auto"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
