
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, FileText, Printer, Share2, Edit, Check, FileType, FileCode, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface DocumentPreviewProps {
  title: string;
  type: string;
  content: string;
  onCopy: () => void;
  onDownload: () => void;
  onEdit?: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  title,
  type,
  content,
  onCopy,
  onDownload,
  onEdit
}) => {
  const [activeView, setActiveView] = useState<'preview' | 'print' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [documentFormat, setDocumentFormat] = useState<'text' | 'markdown' | 'json'>('text');
  const printRef = useRef<HTMLDivElement>(null);
  
  // Format the content for display with proper line breaks
  const formattedContent = content.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));

  const jsonFormatted = () => {
    try {
      return JSON.stringify(JSON.parse(content), null, 2);
    } catch (e) {
      return content;
    }
  };
  
  // Print document functionality
  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML || '';
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title || 'Document'} - Print</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                line-height: 1.5;
              }
              h1 {
                font-size: 18px;
                margin-bottom: 20px;
              }
              .document-content {
                white-space: pre-wrap;
                font-size: 12pt;
              }
            </style>
          </head>
          <body>
            <h1>${title || 'Document'}</h1>
            <div class="document-content">${content.replace(/\n/g, '<br/>')}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    } else {
      toast.error("Unable to open print window. Please check your browser settings.");
    }
  };
  
  // Export as PDF (simplified version)
  const handleExportPDF = () => {
    toast.info("Preparing PDF for download...");
    // In a real implementation, we would use a PDF generation library
    // For now, we'll just simulate the behavior
    setTimeout(() => {
      toast.success("PDF export feature would download the document as PDF");
    }, 1000);
  };
  
  // Copy with feedback
  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Legal Document',
          text: content,
        });
        toast.success("Document shared successfully!");
      } catch (err) {
        console.error("Error sharing: ", err);
        toast.error("Failed to share document");
      }
    } else {
      toast.error("Web Share API not supported on this browser");
    }
  };

  // Empty state when no document is loaded
  if (!content) {
    return (
      <Card className="h-full flex flex-col">
        <CardContent className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <FileText className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Document Preview</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Create a new document using the form or start with a quick start template to see the preview here.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate word and character counts
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="truncate flex items-center gap-2">
              {title || 'Untitled Document'}
              {type && <Badge variant="outline" className="ml-2 text-xs">{type}</Badge>}
            </CardTitle>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
            </div>
          </div>
          <Tabs defaultValue="preview" value={activeView} onValueChange={(v) => setActiveView(v as 'preview' | 'print' | 'code')}>
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="print">Print View</TabsTrigger>
              <TabsTrigger value="code">Code View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0 relative">
        <Tabs value={activeView} className="h-full">
          <TabsContent value="preview" className="p-6 h-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="prose prose-gray dark:prose-invert max-w-none"
            >
              {formattedContent}
            </motion.div>
          </TabsContent>
          <TabsContent value="print" className="p-6 h-full bg-white text-black">
            <div ref={printRef} className="font-serif leading-relaxed">
              {title && <h1 className="text-xl font-bold mb-4 text-center">{title}</h1>}
              <div className="whitespace-pre-wrap">
                {content}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="code" className="p-0 h-full">
            <div className="p-2 bg-gray-100 dark:bg-gray-900 border-b flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={documentFormat === 'text' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setDocumentFormat('text')}
                      className="flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:inline">Text</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Plain Text View</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={documentFormat === 'markdown' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setDocumentFormat('markdown')}
                      className="flex items-center gap-1"
                    >
                      <FileCode className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:inline">Markdown</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Markdown View</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={documentFormat === 'json' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setDocumentFormat('json')}
                      className="flex items-center gap-1"
                    >
                      <FileJson className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:inline">JSON</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>JSON View (if applicable)</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <pre className="p-6 overflow-auto h-[calc(100%-44px)] text-sm font-mono bg-gray-50 dark:bg-gray-900/60">
              {documentFormat === 'json' ? jsonFormatted() : content}
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 dark:bg-gray-900/50 p-3 justify-end gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-1"
          disabled={copied}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPDF}
          className="flex items-center gap-1"
        >
          <FileType className="h-4 w-4" />
          Export as PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="flex items-center gap-1"
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
        {navigator.share && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-1"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
        {onEdit && (
          <Button
            variant="default"
            size="sm"
            onClick={onEdit}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DocumentPreview;
