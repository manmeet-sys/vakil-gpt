
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
  onGenerate: () => void;
  handleGenerate?: () => void; // Added for compatibility
  generatedContent?: string;
  generatedDocument?: { title: string; content: string; };
  isGenerating?: boolean;
  onEditDocument?: () => void;
  children: ReactNode;
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
}) => {
  const { toast } = useToast();
  const documentContent = generatedContent || generatedDocument?.content || '';
  
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

  // Use the appropriate generate function
  const generateFunction = handleGenerate || onGenerate;

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
