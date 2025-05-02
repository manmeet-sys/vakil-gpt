
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePenLine, Download, Copy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export interface BaseDocumentGeneratorProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onGenerate?: () => void;
  generatedContent?: string | React.ReactNode;
  footerContent?: React.ReactNode;
}

const BaseDocumentGenerator: React.FC<BaseDocumentGeneratorProps> = ({
  title,
  description,
  icon = <FilePenLine className="h-5 w-5" />,
  children,
  onGenerate,
  generatedContent,
  footerContent
}) => {
  const [showGenerated, setShowGenerated] = useState(false);
  
  const handleGenerate = () => {
    if (onGenerate) {
      onGenerate();
    }
    setShowGenerated(true);
    toast.success("Document generated successfully!");
  };
  
  const handleCopy = () => {
    if (typeof generatedContent === 'string') {
      navigator.clipboard.writeText(generatedContent);
      toast.success("Copied to clipboard!");
    }
  };
  
  const handleDownload = () => {
    if (typeof generatedContent === 'string') {
      const blob = new Blob([generatedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Document downloaded!");
    }
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {children}
        </div>
        
        {showGenerated && generatedContent && (
          <>
            <Separator className="my-4" />
            <div className="rounded-lg border p-4 bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">Generated Document</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopy}
                    className="h-8 px-2"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownload}
                    className="h-8 px-2"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="whitespace-pre-wrap bg-muted p-3 rounded text-sm font-mono">
                {generatedContent}
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="default"
          onClick={handleGenerate}
          className="w-full sm:w-auto"
        >
          Generate Document
        </Button>
        
        {footerContent}
      </CardFooter>
    </Card>
  );
};

export default BaseDocumentGenerator;
