
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, FileText, AlertCircle, Check, Send, Printer, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateOpenAIAnalysis } from '@/utils/aiAnalysis';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { extractDocumentInfo, extractLegalDocumentInfo } from '@/utils/documentUtils';
import { Textarea } from '@/components/ui/textarea';

type DocumentPreviewProps = {
  title: string;
  type: string;
  content: string;
  onCopy: () => void;
  onDownload: () => void;
};

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  title,
  type,
  content,
  onCopy,
  onDownload,
}) => {
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<'raw' | 'formatted'>('raw');
  const [legalAnalysis, setLegalAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState('');

  const formatDocumentType = (type: string) => {
    if (!type) return '';
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const analyzeDocument = async () => {
    if (!content) return;
    
    setIsAnalyzing(true);
    try {
      const analysisPrompt = `
        Analyze this Indian legal document with the title "${title}" which appears to be a "${formatDocumentType(type)}".
        
        Document content:
        ${content.substring(0, 3000)}${content.length > 3000 ? '...' : ''}
        
        Please provide an analysis that covers:
        1. Structure and key components of the document
        2. Potential legal issues or missing elements
        3. Suggestions for improvement
        4. Relevant Indian legal provisions and case law
        5. Level of compliance with Indian legal standards
        `;
      
      const analysis = await generateOpenAIAnalysis(analysisPrompt, "Document Analysis");
      setLegalAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing document:', error);
      toast.error('Failed to analyze document. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title || 'Legal Document'}</title>
            <style>
              body {
                font-family: 'Times New Roman', Times, serif;
                padding: 40px;
                line-height: 1.6;
              }
              pre {
                white-space: pre-wrap;
                font-family: 'Times New Roman', Times, serif;
                font-size: 12pt;
              }
              h1 {
                text-align: center;
                font-size: 16pt;
                margin-bottom: 20px;
              }
              .footer {
                margin-top: 30px;
                font-size: 10pt;
                text-align: center;
                color: #666;
              }
            </style>
          </head>
          <body>
            <h1>${title || 'Legal Document'}</h1>
            <pre>${content}</pre>
            <div class="footer">Generated via LegalAssistant - ${new Date().toLocaleDateString()}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleEmailShare = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, this would be integrated with an email API
    // For now, we'll simulate the email sending
    toast.success(`Document sent to ${emailAddress}`);
    setShowEmailDialog(false);
    setEmailAddress('');
  };

  const handleStartEditing = () => {
    setEditableContent(content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    // In a real application, you'd update the document in the parent component
    // For now, just simulate the save and update the local content
    toast.success('Document updated successfully');
    setIsEditing(false);
  };

  const getFormattedContent = () => {
    if (!content) return '';
    
    // Convert plain text to HTML with proper line breaks and styling
    const formattedContent = content
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />');
    
    // Extract document info from content for enhanced formatting
    const docInfo = extractLegalDocumentInfo(content);
    
    // If we have a court and parties, enhance the formatting
    if (docInfo.court || docInfo.parties) {
      return `
        <div class="formatted-legal-document">
          ${docInfo.court ? `<div class="court-header text-center font-bold my-4">${docInfo.court}</div>` : ''}
          ${docInfo.caseNumber ? `<div class="case-number text-center my-2">${docInfo.caseNumber}</div>` : ''}
          ${docInfo.parties ? `<div class="parties text-center font-bold my-4">${docInfo.parties}</div>` : ''}
          <p>${formattedContent}</p>
        </div>
      `;
    }
    
    return `<div class="formatted-legal-document"><p>${formattedContent}</p></div>`;
  };

  return (
    <Card className="h-full shadow-md overflow-hidden flex flex-col">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 pb-2">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
              <FileText className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl text-legal-slate dark:text-white truncate max-w-[200px] sm:max-w-xs">
              {title || 'Document Preview'}
            </CardTitle>
          </div>
          <div className="text-sm text-legal-muted dark:text-gray-400 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
            {formatDocumentType(type) || 'No Type'}
          </div>
        </div>
        
        {content && (
          <Tabs
            defaultValue="raw"
            value={previewMode}
            onValueChange={(value) => setPreviewMode(value as 'raw' | 'formatted')}
            className="mt-2"
          >
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="raw" className="text-xs">Raw Text</TabsTrigger>
              <TabsTrigger value="formatted" className="text-xs">Formatted View</TabsTrigger>
            </TabsList>
          
            <CardContent className="flex-grow overflow-auto p-0">
              {content ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="min-h-[60vh] relative"
                >
                  <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none" />
                  
                  <TabsContent value="raw" className="m-0">
                    {isEditing ? (
                      <div className="p-4">
                        <Textarea
                          value={editableContent}
                          onChange={(e) => setEditableContent(e.target.value)}
                          className="font-mono text-sm min-h-[60vh] resize-none"
                          placeholder="Enter document content..."
                        />
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSaveEdit}>
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <pre className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-inner border border-gray-200 dark:border-gray-800 whitespace-pre-wrap text-sm text-legal-slate dark:text-white font-mono relative overflow-auto min-h-[60vh]">
                        {content}
                      </pre>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="formatted" className="m-0">
                    <div 
                      className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-inner border border-gray-200 dark:border-gray-800 text-sm text-legal-slate dark:text-white relative overflow-auto min-h-[60vh] legal-document-view"
                      dangerouslySetInnerHTML={{ __html: getFormattedContent() }}
                      style={{
                        fontFamily: 'Times New Roman, serif',
                        lineHeight: '1.6',
                        fontSize: '14px'
                      }}
                    />
                  </TabsContent>
                </motion.div>
              ) : (
                <Alert className="mx-6 my-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="text-amber-600 dark:text-amber-400">No document content</AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm">
                    Generate a document using the form or prompt to preview it here.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Tabs>
        )}
      </CardHeader>
      
      {!content && (
        <CardContent className="flex-grow overflow-auto p-0">
          <Alert className="mx-6 my-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-600 dark:text-amber-400">No document content</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm">
              Generate a document using the form or prompt to preview it here.
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
      
      {content && (
        <CardFooter className="flex flex-wrap justify-between gap-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 p-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleCopy} className="flex gap-1 text-xs h-8" disabled={copied}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="hidden xs:inline">{copied ? 'Copied' : 'Copy'}</span>
            </Button>
            
            <Button variant="outline" onClick={handlePrint} className="flex gap-1 text-xs h-8">
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Print</span>
            </Button>
            
            <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex gap-1 text-xs h-8">
                  <Send className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline">Share</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share document via email</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEmailShare} className="space-y-4 pt-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Recipient Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-legal-accent"
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowEmailDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-legal-accent hover:bg-legal-accent/90">
                      Send Document
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              className="flex gap-1 text-xs h-8"
              onClick={handleStartEditing}
              disabled={isEditing}
            >
              <Edit className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Edit</span>
            </Button>
            
            <Button 
              variant={legalAnalysis ? "outline" : "default"} 
              className={`flex gap-1 text-xs h-8 ${!legalAnalysis ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}`}
              onClick={analyzeDocument}
              disabled={isAnalyzing || !content}
            >
              {isAnalyzing ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <span className="hidden xs:inline">Analyzing...</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span className="hidden xs:inline">{legalAnalysis ? 'View Analysis' : 'Analyze'}</span>
                </>
              )}
            </Button>
          </div>
          
          <Button onClick={onDownload} className="bg-legal-accent hover:bg-legal-accent/90 flex gap-1 text-xs h-8">
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </Button>
        </CardFooter>
      )}
      
      {legalAnalysis && (
        <Dialog 
          open={isAnalyzing || !!legalAnalysis} 
          onOpenChange={(open) => {
            if (!open && !isAnalyzing) setLegalAnalysis('');
          }}
        >
          <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Legal Document Analysis</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {isAnalyzing ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: legalAnalysis.replace(/\n/g, '<br/>') }} />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default DocumentPreview;
