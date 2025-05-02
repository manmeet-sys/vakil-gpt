
import React, { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

interface BaseDocumentGeneratorProps {
  title: string;
  description: string;
  icon: ReactNode;
  onGenerate: () => void;
  generatedContent: string;
  children: ReactNode;
}

export const BaseDocumentGenerator: React.FC<BaseDocumentGeneratorProps> = ({
  title,
  description,
  icon,
  onGenerate,
  generatedContent,
  children,
}) => {
  const { toast } = useToast();
  
  const handleCopyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      toast({
        title: "Document copied",
        description: "Document content has been copied to clipboard",
      });
    }
  };
  
  const handleDownload = () => {
    if (generatedContent) {
      const element = document.createElement('a');
      const file = new Blob([generatedContent], {type: 'text/plain'});
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
            onClick={onGenerate}
            className="w-full sm:w-auto"
          >
            Generate Document
          </Button>
        </div>
        
        {generatedContent && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-md"
          >
            <div className="flex justify-between items-center bg-muted/50 p-3 border-b">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-medium">Generated Document</h3>
              </div>
              <div className="flex items-center gap-2">
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
              <pre className="text-xs whitespace-pre-wrap font-mono">{generatedContent}</pre>
            </ScrollArea>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
