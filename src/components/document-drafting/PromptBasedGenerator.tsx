
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateGeminiAnalysis } from '@/utils/aiAnalysis';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';

type PromptBasedGeneratorProps = {
  onDraftGenerated: (title: string, type: string, content: string) => void;
};

const PromptBasedGenerator: React.FC<PromptBasedGeneratorProps> = ({ onDraftGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);

  const handleGenerateDocument = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate a document');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a document title');
      return;
    }

    setIsGenerating(true);

    try {
      // Save the prompt to recent prompts list for reuse
      setRecentPrompts(prev => {
        const newPrompts = [prompt, ...prev.filter(p => p !== prompt)].slice(0, 5);
        localStorage.setItem('recentDocumentPrompts', JSON.stringify(newPrompts));
        return newPrompts;
      });

      // Enhance the prompt with specific Indian legal context
      const enhancedPrompt = `Generate a professional Indian legal document based on the following request:
      
"${prompt}"

Create a complete and properly formatted legal document that:
1. Follows all Indian legal drafting standards and conventions
2. Includes all necessary sections and clauses required by Indian courts
3. Uses appropriate legal language for Indian jurisdiction
4. References relevant Indian laws and precedents
5. Follows proper legal formatting with correct paragraphs, numbering, and structure
6. Is compliant with current Indian legal requirements including the latest laws like BNS, BNSS, and BSA where applicable

Document format: Return ONLY the complete document text, no explanations needed.`;

      const generatedContent = await generateGeminiAnalysis(enhancedPrompt, `Document Draft: ${title}`);
      
      // Determine document type from prompt or title
      let documentType = 'other';
      const lowerPrompt = prompt.toLowerCase();
      if (lowerPrompt.includes('affidavit')) documentType = 'affidavit';
      else if (lowerPrompt.includes('pil') || lowerPrompt.includes('public interest')) documentType = 'pil';
      else if (lowerPrompt.includes('writ')) documentType = 'writ_petition';
      else if (lowerPrompt.includes('notice')) documentType = 'legal_notice';
      else if (lowerPrompt.includes('vakalatnama')) documentType = 'vakalatnama';
      else if (lowerPrompt.includes('complaint') && lowerPrompt.includes('consumer')) documentType = 'consumer_complaint';
      else if (lowerPrompt.includes('rent') || lowerPrompt.includes('lease')) documentType = 'rental_agreement';
      else if (title.toLowerCase().includes('affidavit')) documentType = 'affidavit';
      else if (title.toLowerCase().includes('petition')) documentType = 'writ_petition';
      
      onDraftGenerated(title, documentType, generatedContent);
      
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error('Failed to generate document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Load recent prompts from localStorage on component mount
  React.useEffect(() => {
    try {
      const savedPrompts = localStorage.getItem('recentDocumentPrompts');
      if (savedPrompts) {
        setRecentPrompts(JSON.parse(savedPrompts));
      }
    } catch (error) {
      console.error('Error loading recent prompts:', error);
    }
  }, []);

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-purple-500/10 text-purple-500">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl text-slate-800 dark:text-white">AI-Powered Document Generation</CardTitle>
            <CardDescription className="text-slate-600 dark:text-gray-400">
              Describe the document you need, and AI will draft it for you
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">Document Title</Label>
          <Input 
            id="title"
            placeholder="Enter a title for your document" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="prompt" className="text-sm font-medium">Describe the Document You Need</Label>
          <Textarea
            id="prompt"
            placeholder="Example: Draft an affidavit for a property dispute in Delhi High Court regarding unauthorized construction by my neighbor on my property boundary. My name is Rajesh Kumar and the neighbor is Sunil Sharma."
            className="min-h-[150px] text-base"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Be specific about document type, parties involved, court/jurisdiction, and key facts of your case
          </p>
        </div>
        
        {recentPrompts.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Recent Prompts</Label>
            <div className="flex flex-wrap gap-2">
              {recentPrompts.map((recentPrompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs truncate max-w-full"
                  onClick={() => setPrompt(recentPrompt)}
                >
                  {recentPrompt.length > 30 ? `${recentPrompt.substring(0, 30)}...` : recentPrompt}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <AlertDescription className="text-sm">
            <span className="font-medium">Tip:</span> Include specific details like names, locations, dates, and the exact legal issue for better results. Mention the court/jurisdiction for proper formatting.
          </AlertDescription>
        </Alert>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={handleGenerateDocument}
            disabled={isGenerating || !prompt.trim() || !title.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Document...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Generate Document
              </>
            )}
          </Button>
        </motion.div>
        
        <p className="text-xs text-center text-muted-foreground">
          The AI will draft a legal document based on Indian laws and legal standards
        </p>
      </CardContent>
    </Card>
  );
};

export default PromptBasedGenerator;
