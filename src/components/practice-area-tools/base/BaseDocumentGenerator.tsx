
import React, { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

export interface BaseDocumentGeneratorProps {
  title: string;
  description: string;
  icon: ReactNode;
  onGenerate?: () => void;
  handleGenerate?: () => void; // Added for compatibility
  generatedContent?: string;
  generatedDocument?: { title: string; content: string; };
  isGenerating?: boolean;
  onEditDocument?: () => void;
  children: ReactNode;
  useAI?: boolean; // Add flag for AI-powered generation
  aiPrompt?: string; // Optional AI prompt for generation
}

export const BaseDocumentGenerator: React.FC<BaseDocumentGeneratorProps> = ({
  title,
  description,
  icon,
  onGenerate,
  handleGenerate,
  generatedContent = '',
  generatedDocument,
  isGenerating = false,
  onEditDocument,
  children,
  useAI = false,
  aiPrompt,
}) => {
  const { toast } = useToast();
  const documentContent = generatedContent || generatedDocument?.content || '';
  const [aiEnhanced, setAiEnhanced] = useState(useAI);
  
  const handleCopyToClipboard = () => {
    if (documentContent) {
      navigator.clipboard.writeText(documentContent);
      toast({
        title: "Document copied",
        description: "Document content has been copied to clipboard",
      });
    }
  };
  
  const handleDownload = () => {
    if (documentContent) {
      const element = document.createElement('a');
      const file = new Blob([documentContent], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Document downloaded",
        description: "Document has been downloaded as a text file",
      });
    }
  };

  // Use the appropriate generate function, with preference for onGenerate for backward compatibility
  const generateFunction = onGenerate || handleGenerate;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <CardTitle className="text-lg font-playfair">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="bg-muted/30 p-4 rounded-md">
          {children}
          
          {useAI && (
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">AI-Enhanced Generation</span>
                  <div className="h-4 w-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-xs text-blue-600">AI</span>
                  </div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={aiEnhanced} 
                    onChange={(e) => setAiEnhanced(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {aiEnhanced && aiPrompt && (
                <div className="text-sm text-muted-foreground italic mb-2">
                  AI will enhance your document using intelligent analysis.
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={generateFunction}
            className="w-full sm:w-auto"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Document"}
          </Button>
        </div>
        
        {documentContent && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-md"
          >
            <div className="flex justify-between items-center bg-muted/50 p-3 border-b">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-medium">
                  {generatedDocument?.title || "Generated Document"}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {onEditDocument && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onEditDocument}
                    className="h-8 p-2"
                  >
                    Edit
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCopyToClipboard}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy document</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDownload}
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download document</span>
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[300px] w-full p-3">
              <pre className="text-xs whitespace-pre-wrap font-mono">{documentContent}</pre>
            </ScrollArea>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
